"use client";

import React, { useEffect, useRef, useState } from "react";

const DEFAULT_FRAME_PATHS = [
  "/frames/hero-wedding-sunset.jpg",
  "/frames/ezgif-frame-001.jpg",
];

export default function FrameAnimationBackground({
  fps = 24,
  className = "",
}: {
  fps?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFrames = async () => {
      let framePaths = DEFAULT_FRAME_PATHS.slice(0, 1);
      try {
        const res = await fetch("/api/frames");
        if (res.ok) {
          const data = await res.json();
          if (data.frames && data.frames.length > 0) {
            framePaths = data.frames;
          }
        }
      } catch {
        // Fallback to DEFAULT_FRAME_PATHS
      }

      // De-duplicate in case of duplicate entries
      const uniquePaths = Array.from(new Set(framePaths));
      const loadedImgs: HTMLImageElement[] = new Array(uniquePaths.length);
      let loadedCount = 0;

      uniquePaths.forEach((path, idx) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          if (!isMounted) return;
          loadedImgs[idx] = img;
          loadedCount++;
          if (loadedCount === uniquePaths.length) {
            loadedImagesRef.current = loadedImgs.filter(
              (img): img is HTMLImageElement =>
                Boolean(img && img.complete && (img.naturalWidth > 0 || img.width > 0))
            );
            setImagesLoaded(loadedImagesRef.current.length > 0);
          }
        };
        img.onerror = () => {
          if (!isMounted) return;
          // If first path failed, try fallback
          if (path !== DEFAULT_FRAME_PATHS[1]) {
            const fallbackImg = new Image();
            fallbackImg.src = DEFAULT_FRAME_PATHS[1];
            fallbackImg.onload = () => {
              if (!isMounted) return;
              loadedImgs[idx] = fallbackImg;
              loadedCount++;
              if (loadedCount === uniquePaths.length) {
                loadedImagesRef.current = loadedImgs.filter(
                  (img): img is HTMLImageElement =>
                    Boolean(img && img.complete && (img.naturalWidth > 0 || img.width > 0))
                );
                setImagesLoaded(loadedImagesRef.current.length > 0);
              }
            };
            fallbackImg.onerror = () => {
              if (!isMounted) return;
              loadedCount++;
              if (loadedCount === uniquePaths.length) {
                loadedImagesRef.current = loadedImgs.filter(
                  (img): img is HTMLImageElement =>
                    Boolean(img && img.complete && (img.naturalWidth > 0 || img.width > 0))
                );
                setImagesLoaded(loadedImagesRef.current.length > 0);
              }
            };
          } else {
            loadedCount++;
            if (loadedCount === uniquePaths.length) {
              loadedImagesRef.current = loadedImgs.filter(
                (img): img is HTMLImageElement =>
                  Boolean(img && img.complete && (img.naturalWidth > 0 || img.width > 0))
              );
              setImagesLoaded(loadedImagesRef.current.length > 0);
            }
          }
        };
      });
    };

    loadFrames();

    return () => {
      isMounted = false;
    };
  }, []);

  // Animation Loop (Cinematic Ken Burns for single frame, multi-frame sequence if multiple)
  useEffect(() => {
    if (!imagesLoaded || loadedImagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = loadedImagesRef.current;
    const totalFrames = images.length;
    const frameDuration = 1000 / fps;

    let currentFrame = 0;
    let lastFrameTime = performance.now();
    const startTime = performance.now();
    let isTabVisible = !document.hidden;

    const drawFrame = (
      img: HTMLImageElement,
      scale = 1.0,
      panX = 0,
      panY = 0
    ) => {
      if (!canvas || !ctx || !img || !img.complete) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;

      // Cover scaling calculation (object-fit: cover equivalent)
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;

      let baseW = cw;
      let baseH = ch;

      if (canvasRatio > imgRatio) {
        baseW = cw;
        baseH = cw / imgRatio;
      } else {
        baseH = ch;
        baseW = ch * imgRatio;
      }

      const drawW = baseW * scale;
      const drawH = baseH * scale;
      const offsetX = (cw - drawW) / 2 + panX;
      const offsetY = (ch - drawH) / 2 + panY;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = images[currentFrame] || images[0];
      if (img) {
        drawFrame(img);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animateLoop = (now: number) => {
      if (isTabVisible) {
        if (totalFrames > 1) {
          // Multi-frame sequential playback
          const delta = now - lastFrameTime;
          if (delta >= frameDuration) {
            const framesToAdvance = Math.floor(delta / frameDuration);
            currentFrame = (currentFrame + framesToAdvance) % totalFrames;
            lastFrameTime = now - (delta % frameDuration);
          }
          const img = images[currentFrame];
          if (img) {
            drawFrame(img);
          }
        } else {
          // Single frame: subtle cinematic Ken Burns breathe effect
          const elapsed = (now - startTime) * 0.001; // elapsed in seconds
          const scale =
            1.0 + 0.04 * (0.5 + 0.5 * Math.sin((elapsed * Math.PI * 2) / 16));
          const panX = Math.sin((elapsed * Math.PI * 2) / 22) * 6;
          const panY = Math.cos((elapsed * Math.PI * 2) / 22) * 3;

          const img = images[0];
          if (img) {
            drawFrame(img, scale, panX, panY);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animateLoop);
    };

    if (images[0]) {
      drawFrame(images[0]);
    }

    animFrameIdRef.current = requestAnimationFrame(animateLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [imagesLoaded, fps]);

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
