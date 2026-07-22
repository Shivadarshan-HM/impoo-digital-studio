"use client";

import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 40;

const ALL_FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${num}.jpg`;
});

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

    const loadAll40Frames = async () => {
      let framePaths = ALL_FRAME_PATHS;
      try {
        const res = await fetch("/api/frames");
        if (res.ok) {
          const data = await res.json();
          if (data.frames && data.frames.length > 0) {
            framePaths = data.frames;
          }
        }
      } catch {
        // Fallback to ALL_FRAME_PATHS
      }

      const loadedImgs: HTMLImageElement[] = new Array(framePaths.length);
      let loadedCount = 0;

      framePaths.forEach((path, idx) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          if (!isMounted) return;
          loadedImgs[idx] = img;
          loadedCount++;
          if (loadedCount === framePaths.length) {
            loadedImagesRef.current = loadedImgs;
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          if (!isMounted) return;
          loadedImgs[idx] = img;
          loadedCount++;
          if (loadedCount === framePaths.length) {
            loadedImagesRef.current = loadedImgs;
            setImagesLoaded(true);
          }
        };
      });
    };

    loadAll40Frames();

    return () => {
      isMounted = false;
    };
  }, []);

  // 24 FPS Canvas Animation Loop across all 40 frames
  useEffect(() => {
    if (!imagesLoaded || loadedImagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = loadedImagesRef.current;
    const totalFrames = images.length;
    const frameDuration = 1000 / fps; // ~41.67ms per frame for 24 FPS

    let currentFrame = 0;
    let lastFrameTime = performance.now();
    let isTabVisible = !document.hidden;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const drawFrame = (img: HTMLImageElement) => {
      if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0)
        return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      // Cover scaling calculation (object-fit: cover equivalent)
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;

      let drawW = cw;
      let drawH = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
        offsetY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
        offsetX = (cw - drawW) / 2;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const animateLoop = (now: number) => {
      if (isTabVisible) {
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
    </div>
  );
}
