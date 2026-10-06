"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const StarsBackground = ({
  starColor = "#000",
  className,
}: {
  starColor?: string;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    const stars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.15 + 0.05,
      speedX: (Math.random() - 0.5) * 0.1,
      opacity: Math.random(),
      opacitySpeed: (Math.random() - 0.5) * 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = starColor;

      stars.forEach((star) => {
        star.y -= star.speedY;
        star.x += star.speedX;
        star.opacity += star.opacitySpeed;

        if (star.opacity > 1 || star.opacity < 0) {
          star.opacitySpeed = -star.opacitySpeed;
        }

        if (star.y < 0) star.y = height;
        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;

        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("pointer-events-none", className)} 
    />
  );
};
