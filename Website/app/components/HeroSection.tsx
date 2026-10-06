"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ShinyText } from "@/components/lightswind/shiny-text";

const STAGES = [
  {
    id: 1,
    eyebrow: "SCROLL TO EXPLORE",
    heading: ["EVERY FRAME", "HAS A STORY."],
    desc: "",
    isReveal: false,
  },
  {
    id: 2,
    eyebrow: "THE CRAFT",
    heading: ["THE", "CRAFT"],
    desc: "We balance light and shadow to create cinematic visual poetry.",
    isReveal: false,
  },
  {
    id: 3,
    eyebrow: "THE CAMERA",
    heading: ["THE", "CAMERA"],
    desc: "Capturing unscripted, fleeting moments with raw authenticity.",
    isReveal: false,
  },
  {
    id: 4,
    eyebrow: "THE MOMENT",
    heading: ["THE", "MOMENT"],
    desc: "Freezing time precisely when emotion takes over.",
    isReveal: false,
  },
  {
    id: 5,
    eyebrow: "THE HANDOVER",
    heading: ["THE", "HANDOVER"],
    desc: "Delivering a timeless legacy that will be cherished for generations.",
    isReveal: false,
  },
  {
    id: 6,
    eyebrow: "THE PHOTOGRAPHER",
    heading: ["RAVIKUMAR", "IMPOO"],
    desc: "PHOTOGRAPHER / VISUAL STORYTELLER",
    isReveal: true,
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Make the total scroll slightly shorter so transitions happen faster
      const animationScrollDistance = window.innerHeight * 2.5; 
      const scrollY = window.scrollY;

      if (animationScrollDistance > 0) {
        let fraction = scrollY / animationScrollDistance;
        fraction = Math.max(0, Math.min(1, fraction));
        
        // Map 0 -> 1 directly to 0 -> 5
        const stageIndex = Math.min(5, Math.floor(fraction * 5.99));
        setCurrentStage(stageIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPortfolio = () => {
    const target = document.getElementById("portfolio");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-transparent relative w-full h-[350vh] z-10"
      id="hero"
      aria-label="Editorial Wedding Photography Studio Hero"
    >
      <div className="sticky top-0 w-full h-[100dvh] flex flex-col justify-center overflow-hidden px-8 md:px-24">
        
        {/* Left Side Vertical Progress Indicator (Desktop) */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-6 select-none pointer-events-none">
          <span className="text-[#ffffff]/80 text-[0.65rem] tracking-[0.2em] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            06
          </span>
          <div className="w-[1px] h-32 bg-[#ffffff]/20 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full bg-[#C8A86B] transition-all duration-300 ease-out"
              style={{ height: `${((currentStage + 1) / 6) * 100}%` }}
            />
          </div>
          <span className="text-[#C8A86B] text-[0.65rem] tracking-[0.2em] font-medium transition-all duration-300" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            0{currentStage + 1}
          </span>
        </div>

        {/* Right Side Vertical Camera Metadata Accent (Desktop) */}
        <div className="absolute right-6 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-4 select-none pointer-events-none">
          <div className="w-[1px] h-28 bg-[#C8A86B]/40" aria-hidden="true" />
          <div
            className="flex flex-col items-start gap-4 text-[#ffffff]/80 text-[0.68rem] md:text-xs tracking-[0.28em] uppercase font-medium"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            <span>ISO 100</span>
            <span>F2.8</span>
            <span>1/250</span>
          </div>
        </div>

        {/* Main Content Area (Perfectly vertically centered) */}
        <div className="w-full lg:w-[65%] max-w-3xl relative mx-auto lg:mx-0 z-10">
          <div className="relative w-full h-[300px] md:h-[400px]">
            {STAGES.map((stage, idx) => {
              const isActive = currentStage === idx;
              return (
                <div
                  key={stage.id}
                  className={`absolute inset-0 flex flex-col justify-center items-start transition-all duration-700 ease-in-out transform ${
                    isActive ? "opacity-100 translate-y-0 blur-none pointer-events-auto" : "opacity-0 -translate-y-8 blur-sm pointer-events-none"
                  }`}
                >
                  {/* Eyebrow / Stage Label */}
                  <p
                    className="text-[#C8A86B] text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-4 md:mb-6"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {stage.eyebrow}
                  </p>

                  {/* Main Heading */}
                  <h1
                    className="text-[#ffffff] font-light leading-[1] tracking-[-0.02em] text-[2.8rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] uppercase select-none mb-6"
                    style={{ fontFamily: "var(--font-cormorant-garamond), var(--font-display), serif" }}
                  >
                    {stage.heading.map((line, lineIdx) => {
                      const isSpecial = stage.isReveal && lineIdx === 1;
                      return (
                        <span 
                          key={lineIdx} 
                          className={`block transition-all duration-700 ${lineIdx === 0 ? "delay-[50ms]" : "delay-[150ms]"} ${
                            isActive ? "translate-y-0 opacity-100 blur-none" : "translate-y-4 opacity-0 blur-sm"
                          } ${
                            isSpecial ? "lowercase italic text-[#C8A86B] tracking-normal ml-12 md:ml-24 text-[1.1em]" : ""
                          }`}
                          style={isSpecial ? { fontFamily: "'Playfair Display', 'Brush Script MT', cursive" } : {}}
                        >
                          {stage.isReveal ? (
                            <ShinyText 
                              baseColor={isSpecial ? "#C8A86B" : "#ffffff"} 
                              shineColor={isSpecial ? "#ffffff" : "#C8A86B"} 
                              speed={3}
                              size="none"
                              weight="none"
                            >
                              {line}
                            </ShinyText>
                          ) : (
                            line
                          )}
                        </span>
                      );
                    })}
                  </h1>

                  {/* Supporting Copy */}
                  {stage.desc && (
                    <p
                      className={`text-[#ffffff]/90 text-sm md:text-base font-light leading-relaxed max-w-sm mb-8 transition-all duration-700 delay-[250ms] ${
                        isActive ? "translate-y-0 opacity-100 blur-none" : "translate-y-4 opacity-0 blur-sm"
                      }`}
                      style={{ fontFamily: "var(--font-body), sans-serif" }}
                    >
                      {stage.desc}
                    </p>
                  )}

                  {/* CTA */}
                  {stage.isReveal && (
                    <div className={`transition-all duration-700 delay-[350ms] ${isActive ? "translate-y-0 opacity-100 blur-none" : "translate-y-4 opacity-0 blur-sm"}`}>
                      <button
                        type="button"
                        onClick={scrollToPortfolio}
                        className="group inline-flex items-center gap-3 py-2 text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-[#ffffff] hover:text-[#C8A86B] transition-colors duration-300 cursor-pointer border-b border-[#ffffff]/30 hover:border-[#C8A86B] pb-1"
                      >
                        <span>EXPLORE THE WORK</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Information Bar */}
        <div className="absolute bottom-8 left-8 right-8 md:left-24 md:right-24 flex items-center justify-between z-10">
          
          {/* Bottom Left — Mobile Progress (Only visible on small screens) */}
          <div className="md:hidden flex items-center gap-3 text-[#C8A86B] text-[0.65rem] tracking-[0.2em] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            <span>0{currentStage + 1}</span>
            <div className="w-12 h-[1px] bg-[#ffffff]/20 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#C8A86B] transition-all duration-300 ease-out"
                style={{ width: `${((currentStage + 1) / 6) * 100}%` }}
              />
            </div>
            <span className="text-[#ffffff]/50">06</span>
          </div>

          {/* Bottom Left — Copyright (Desktop) */}
          <div className="hidden md:block text-[#ffffff]/50 text-[0.65rem] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            © {new Date().getFullYear()} IMPOO DIGITAL STUDIO
          </div>

          {/* Bottom Right — Subtle Scroll Indicator */}
          <div
            className="inline-flex items-center gap-2 text-[#ffffff]/80 text-[0.65rem] md:text-xs tracking-[0.25em] uppercase font-medium cursor-pointer hover:text-[#ffffff] transition-colors duration-200"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            onClick={scrollToPortfolio}
          >
            <span>SCROLL</span>
            <ArrowDown size={12} className="animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
