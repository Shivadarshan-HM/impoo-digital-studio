"use client";

import React, { useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const TOTAL_FRAMES = 240;
const FRAME_PATH_PREFIX = "/frames-webp/frame_";
const FRAME_EXT = ".webp";

const BACKGROUND_CONCURRENCY = 8;
const SCROLL_DISTANCE_VH = 3; // animation completes over 3× viewport height

/**
 * Generates a zero-padded frame path: /frames-webp/frame_0001.webp … frame_0240.webp
 */
function framePath(index: number): string {
  const num = String(index + 1).padStart(4, "0");
  return `${FRAME_PATH_PREFIX}${num}${FRAME_EXT}`;
}

// ---------------------------------------------------------------------------
// Image loader with createImageBitmap pre-decode & responsive resize
// ---------------------------------------------------------------------------
function loadAndDecode(
  src: string,
  resizeWidth: number
): Promise<ImageBitmap | HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (typeof createImageBitmap === "function") {
        createImageBitmap(img, {
          resizeWidth,
          resizeQuality: "medium",
        })
          .then(resolve)
          .catch(() => {
            // Fallback without resize options if browser engine does not support ImageBitmapOptions
            createImageBitmap(img).then(resolve).catch(reject);
          });
      } else {
        // Fallback: decode() on HTMLImageElement
        img
          .decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      }
    };
    img.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function FrameAnimationBackground({
  className = "",
}: {
  fps?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const lastDrawnIndexRef = useRef<number>(-1);
  const scrollProgressRef = useRef<number>(0);
  const targetIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const posterReadyRef = useRef<boolean>(false);
  const mountedRef = useRef(true);

  // -----------------------------------------------------------------------
  // Draw a single frame onto the canvas (cover-fit)
  // -----------------------------------------------------------------------
  const drawFrame = useCallback(
    (bitmap: ImageBitmap | HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;

      const iw =
        "naturalWidth" in bitmap
          ? (bitmap as HTMLImageElement).naturalWidth || bitmap.width
          : bitmap.width;
      const ih =
        "naturalHeight" in bitmap
          ? (bitmap as HTMLImageElement).naturalHeight || bitmap.height
          : bitmap.height;
      if (!iw || !ih) return;

      // Cover-fit calculation
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;
      let drawW: number;
      let drawH: number;

      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }

      const offsetX = (cw - drawW) / 2;
      const offsetY = (ch - drawH) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(bitmap, offsetX, offsetY, drawW, drawH);
    },
    []
  );

  // -----------------------------------------------------------------------
  // Find nearest loaded frame to the requested target index
  // -----------------------------------------------------------------------
  const findNearestLoadedFrame = useCallback(
    (targetIndex: number): number => {
      const frames = framesRef.current;
      if (frames[targetIndex]) return targetIndex;

      // Search outward from target
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const before = targetIndex - offset;
        const after = targetIndex + offset;
        if (before >= 0 && frames[before]) return before;
        if (after < TOTAL_FRAMES && frames[after]) return after;
      }
      return -1;
    },
    []
  );

  // -----------------------------------------------------------------------
  // Canvas resize handler (caps DPR at 2)
  // -----------------------------------------------------------------------
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    // Force redraw on next opportunity
    lastDrawnIndexRef.current = -1;
  }, []);

  // -----------------------------------------------------------------------
  // Main effect: responsive loading pipeline, dynamic priority & idle rAF
  // -----------------------------------------------------------------------
  useEffect(() => {
    mountedRef.current = true;
    const abortController = new AbortController();

    // Responsive setup: screens < 768px load every 2nd frame at 640px wide
    const isMobile = window.innerWidth < 768;
    const resizeWidth = isMobile ? 640 : 1280;
    const frameStep = isMobile ? 2 : 1;

    const activeIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += frameStep) {
      activeIndices.push(i);
    }

    const priorityBatchCount = Math.min(isMobile ? 8 : 12, activeIndices.length);

    handleResize();
    window.addEventListener("resize", handleResize);

    // Track loading progress and in-flight fetches
    const loadedSet = new Set<number>();
    const inFlightSet = new Set<number>();

    // Callback when a frame completes loading
    const onFrameReady = (
      index: number,
      bitmap: ImageBitmap | HTMLImageElement
    ) => {
      if (!mountedRef.current) return;
      framesRef.current[index] = bitmap;

      // Draw initial poster as soon as frame 0 lands
      if (index === 0 && !posterReadyRef.current) {
        posterReadyRef.current = true;
        drawFrame(bitmap);
        lastDrawnIndexRef.current = 0;
      } else if (rafIdRef.current === null) {
        // If rAF is idle, check if this new frame is the best match for current scroll position
        const currentTarget = targetIndexRef.current;
        const bestIndex = findNearestLoadedFrame(currentTarget);
        if (bestIndex === index && index !== lastDrawnIndexRef.current) {
          drawFrame(bitmap);
          lastDrawnIndexRef.current = index;
        }
      }
    };

    // -------------------------------------------------------------------
    // Dynamic Priority Queue: loads remaining frames ordered by distance
    // from targetIndexRef.current, re-sorting as the user scrolls
    // -------------------------------------------------------------------
    const pumpQueue = () => {
      if (abortController.signal.aborted || !mountedRef.current) return;

      while (inFlightSet.size < BACKGROUND_CONCURRENCY) {
        const candidates: number[] = [];
        for (let k = 0; k < activeIndices.length; k++) {
          const idx = activeIndices[k];
          if (!loadedSet.has(idx) && !inFlightSet.has(idx)) {
            candidates.push(idx);
          }
        }

        if (candidates.length === 0) break;

        const currentTarget = targetIndexRef.current;
        candidates.sort((a, b) => {
          const distA = Math.abs(a - currentTarget);
          const distB = Math.abs(b - currentTarget);
          if (distA !== distB) return distA - distB;
          return a >= currentTarget ? -1 : 1;
        });

        const nextIndex = candidates[0];
        inFlightSet.add(nextIndex);

        loadAndDecode(framePath(nextIndex), resizeWidth)
          .then((bitmap) => {
            if (abortController.signal.aborted || !mountedRef.current) {
              if (
                bitmap &&
                "close" in bitmap &&
                typeof (bitmap as ImageBitmap).close === "function"
              ) {
                try {
                  (bitmap as ImageBitmap).close();
                } catch {
                  /* noop */
                }
              }
              return;
            }
            inFlightSet.delete(nextIndex);
            loadedSet.add(nextIndex);
            onFrameReady(nextIndex, bitmap);
            pumpQueue();
          })
          .catch(() => {
            inFlightSet.delete(nextIndex);
            loadedSet.add(nextIndex); // Avoid infinite retries on error
            pumpQueue();
          });
      }
    };

    // -------------------------------------------------------------------
    // Animation loop: stops when |target - current| < 0.01
    // -------------------------------------------------------------------
    let currentFrameFloat = 0;

    const tick = () => {
      if (!mountedRef.current) return;

      const targetStep =
        scrollProgressRef.current * (activeIndices.length - 1);
      const diff = targetStep - currentFrameFloat;

      // Stop rAF loop when settled within 0.01 of target
      if (Math.abs(diff) < 0.01) {
        currentFrameFloat = targetStep;
        const finalStep = Math.min(
          Math.max(0, Math.round(currentFrameFloat)),
          activeIndices.length - 1
        );
        const finalIndex = activeIndices[finalStep];

        if (finalIndex !== lastDrawnIndexRef.current) {
          const bestIndex = findNearestLoadedFrame(finalIndex);
          if (bestIndex >= 0) {
            const bmp = framesRef.current[bestIndex];
            if (bmp) {
              drawFrame(bmp);
              lastDrawnIndexRef.current = bestIndex;
            }
          }
        }

        rafIdRef.current = null;
        return;
      }

      currentFrameFloat += diff * 0.12;
      const currentStep = Math.min(
        Math.max(0, Math.round(currentFrameFloat)),
        activeIndices.length - 1
      );
      const targetIndex = activeIndices[currentStep];

      if (targetIndex !== lastDrawnIndexRef.current) {
        const bestIndex = findNearestLoadedFrame(targetIndex);
        if (bestIndex >= 0) {
          const bmp = framesRef.current[bestIndex];
          if (bmp) {
            drawFrame(bmp);
            lastDrawnIndexRef.current = bestIndex;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    // -------------------------------------------------------------------
    // Scroll handler: updates target, restarts rAF if idle, pumps queue
    // -------------------------------------------------------------------
    const handleScroll = () => {
      const maxScroll = window.innerHeight * SCROLL_DISTANCE_VH;
      scrollProgressRef.current = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );

      const targetStep = Math.min(
        Math.max(
          0,
          Math.round(scrollProgressRef.current * (activeIndices.length - 1))
        ),
        activeIndices.length - 1
      );
      targetIndexRef.current = activeIndices[targetStep];

      // Restart rAF loop if idle
      if (rafIdRef.current === null && mountedRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      }

      // Re-sort and dispatch background queue closer to current scroll target
      pumpQueue();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize scroll position

    // -------------------------------------------------------------------
    // Pipeline execution:
    // 1. Priority batch loads first
    // 2. Start animation loop
    // 3. Background queue loads remaining frames ordered by scroll distance
    // -------------------------------------------------------------------
    (async () => {
      const initialIndices = activeIndices.slice(0, priorityBatchCount);
      initialIndices.forEach((idx) => inFlightSet.add(idx));

      await Promise.all(
        initialIndices.map(async (idx) => {
          try {
            const bmp = await loadAndDecode(framePath(idx), resizeWidth);
            inFlightSet.delete(idx);
            loadedSet.add(idx);
            onFrameReady(idx, bmp);
          } catch {
            inFlightSet.delete(idx);
            loadedSet.add(idx);
          }
        })
      );

      if (mountedRef.current) {
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(tick);
        }
        // Background loading for all remaining frames
        pumpQueue();
      }
    })();

    // Visibility change handler
    const handleVisibility = () => {
      if (document.hidden) {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      } else {
        if (rafIdRef.current === null && mountedRef.current) {
          rafIdRef.current = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // -------------------------------------------------------------------
    // Cleanup on unmount:
    // Call bitmap.close() on all stored ImageBitmaps (skip HTMLImageElement)
    // -------------------------------------------------------------------
    return () => {
      mountedRef.current = false;
      abortController.abort();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      framesRef.current.forEach((bitmap) => {
        if (
          bitmap &&
          "close" in bitmap &&
          typeof (bitmap as ImageBitmap).close === "function"
        ) {
          try {
            (bitmap as ImageBitmap).close();
          } catch {
            /* noop */
          }
        }
      });
      framesRef.current = new Array(TOTAL_FRAMES).fill(null);
    };
  }, [drawFrame, findNearestLoadedFrame, handleResize]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover pointer-events-none"
      />
      {/* Editorial Vignette & Left-Side Contrast Scrim for Pristine Text Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(9, 9, 9, 0.72) 0%, rgba(9, 9, 9, 0.46) 42%, rgba(9, 9, 9, 0.12) 75%, rgba(9, 9, 9, 0.35) 100%), linear-gradient(to bottom, rgba(9, 9, 9, 0.55) 0%, transparent 20%, transparent 80%, rgba(9, 9, 9, 0.75) 100%)",
        }}
      />
    </div>
  );
}
