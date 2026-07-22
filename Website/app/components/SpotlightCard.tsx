"use client";

import React, { useRef, useState } from "react";

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  tabIndex?: number;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(200, 168, 107, 0.18)",
  tabIndex = 0,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={tabIndex}
      className={`group relative overflow-hidden rounded-[2px] border border-[rgba(245,242,235,0.08)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] ${className}`}
    >
      {/* Interactive Spotlight Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
