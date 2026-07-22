"use client";

import React, { useEffect, useRef } from "react";

export interface CloudscapeProps {
  colorBottom?: string;
  colorMid?: string;
  colorTop?: string;
  speed?: number;
  height?: string;
  className?: string;
}

export default function Cloudscape({
  colorBottom = "#87ceeb",
  colorMid = "#f8f8f8",
  colorTop = "#ffffff",
  speed = 1,
  height = "100vh",
  className = "",
}: CloudscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let heightPx = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      heightPx = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Reduced motion & visibility check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    let time = 0;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !isReducedMotion && speed > 0) {
        startAnimation();
      } else if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Soft organic cloud blobs simulation
    const clouds = [
      { x: 0.2, y: 0.3, r: 0.4, speedX: 0.0003, speedY: 0.00015 },
      { x: 0.7, y: 0.5, r: 0.5, speedX: -0.0002, speedY: 0.0002 },
      { x: 0.5, y: 0.8, r: 0.6, speedX: 0.00025, speedY: -0.0001 },
      { x: 0.8, y: 0.2, r: 0.35, speedX: -0.0003, speedY: -0.0002 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, heightPx);

      // Base Sky Gradient (colorTop -> colorMid -> colorBottom)
      const baseGrad = ctx.createLinearGradient(0, 0, 0, heightPx);
      baseGrad.addColorStop(0, colorTop);
      baseGrad.addColorStop(0.5, colorMid);
      baseGrad.addColorStop(1, colorBottom);

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, heightPx);

      // Organic Cloud Layer Overlays
      clouds.forEach((cloud, i) => {
        const cx = (cloud.x + Math.sin(time * cloud.speedX * speed + i) * 0.1) * width;
        const cy = (cloud.y + Math.cos(time * cloud.speedY * speed + i) * 0.1) * heightPx;
        const radius = cloud.r * Math.min(width, heightPx);

        const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        cloudGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
        cloudGrad.addColorStop(0.5, "rgba(248, 248, 248, 0.45)");
        cloudGrad.addColorStop(1, "rgba(135, 206, 235, 0)");

        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const renderLoop = () => {
      if (!isTabVisible) return;
      time += 1;
      draw();
      if (!isReducedMotion && speed > 0) {
        animFrameId.current = requestAnimationFrame(renderLoop);
      }
    };

    const startAnimation = () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderLoop();
    };

    draw(); // Initial render
    if (!isReducedMotion && speed > 0) {
      startAnimation();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [colorBottom, colorMid, colorTop, speed]);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}
