"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ArrowDown } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const wordWeRef = useRef<HTMLSpanElement>(null);
  const wordPreserveRef = useRef<HTMLSpanElement>(null);
  const wordEmotionsRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomMetaRef = useRef<HTMLDivElement>(null);
  const rightMetaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Set initial GSAP states
    gsap.set(
      [
        eyebrowRef.current,
        wordWeRef.current,
        wordPreserveRef.current,
        wordEmotionsRef.current,
        descRef.current,
        ctaRef.current,
        bottomMetaRef.current,
        rightMetaRef.current,
        scrollRef.current,
      ],
      { opacity: 0, y: 24 }
    );

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Eyebrow fades upward
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
      });

      // 2. WE fades in
      tl.to(
        wordWeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
        },
        "-=0.5"
      );

      // 3. PRESERVE fades in
      tl.to(
        wordPreserveRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
        },
        "-=0.6"
      );

      // 4. EMOTIONS. fades in
      tl.to(
        wordEmotionsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
        },
        "-=0.6"
      );

      // 5. Supporting text fades upward
      tl.to(
        descRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.4"
      );

      // 6. CTA slides upward
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.5"
      );

      // 7. Bottom metadata, right metadata & scroll indicator appear last
      tl.to(
        [bottomMetaRef.current, rightMetaRef.current, scrollRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToPortfolio = () => {
    const target = document.getElementById("portfolio");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section bg-transparent relative w-full min-h-screen h-[100dvh] flex flex-col justify-between overflow-hidden z-10"
      id="hero"
      aria-label="Editorial Wedding Photography Studio Hero"
    >
      {/* Right Side Vertical Camera Metadata Accent (Centered Vertically, 60–80px margin) */}
      <div
        ref={rightMetaRef}
        className="absolute right-12 md:right-16 lg:right-20 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-4 select-none pointer-events-none opacity-0"
      >
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

      {/* Main Content Area — Occupies Left 40–45% of Viewport */}
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-12 lg:px-20 pt-28 md:pt-36 my-auto relative z-10">
        <div className="w-full lg:w-[44%] max-w-xl flex flex-col items-start">
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="text-[#ae2012] text-xs font-medium tracking-[0.3em] uppercase mb-8 md:mb-10 opacity-0"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            WE DON&apos;T JUST CAPTURE MOMENTS
          </p>

          {/* Main Heading — Single Typography Style (High-Contrast Serif) */}
          <h1
            className="text-[#ffffff] font-light leading-[0.95] tracking-[-0.03em] text-[3.8rem] sm:text-[4.8rem] md:text-[6.2rem] lg:text-[7.2rem] xl:text-[8rem] uppercase select-none mb-8 md:mb-10 flex flex-col items-start"
            style={{
              fontFamily:
                "var(--font-cormorant-garamond), var(--font-display), serif",
            }}
          >
            <span ref={wordWeRef} className="block opacity-0">
              WE
            </span>
            <span ref={wordPreserveRef} className="block opacity-0">
              PRESERVE
            </span>
            <span ref={wordEmotionsRef} className="block opacity-0">
              EMOTIONS.
            </span>
          </h1>

          {/* Supporting Copy (Two lines only) */}
          <p
            ref={descRef}
            className="text-[#ffffff] text-sm md:text-base font-light leading-relaxed max-w-sm mb-8 md:mb-10 opacity-0"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Luxury Wedding Photography
            <br />
            Crafting timeless memories with cinematic storytelling.
          </p>

          {/* Minimal Editorial CTA */}
          <div ref={ctaRef} className="opacity-0">
            <button
              type="button"
              onClick={scrollToPortfolio}
              className="group inline-flex items-center gap-3 py-2 text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-[#ffffff] hover:text-[#C8A86B] transition-colors duration-300 cursor-pointer border-b border-[#ffffff]/30 hover:border-[#C8A86B] pb-1"
            >
              <span>Explore Portfolio</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information Bar */}
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-12 lg:px-20 pb-8 flex items-center justify-between z-10">
        {/* Bottom Left — Camera Metadata with Thin Dividers */}
        <div
          ref={bottomMetaRef}
          className="flex items-center gap-4 sm:gap-5 text-[#ffffff]/80 text-[0.68rem] md:text-xs tracking-[0.28em] uppercase font-medium opacity-0 select-none"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span>ISO 100</span>
          <span className="text-[#C8A86B]/45 font-light">│</span>
          <span>F2.8</span>
          <span className="text-[#C8A86B]/45 font-light">│</span>
          <span>1/250</span>
        </div>

        {/* Bottom Right — Subtle Scroll Indicator */}
        <div
          ref={scrollRef}
          className="inline-flex items-center gap-2 text-[#ffffff]/80 text-[0.65rem] md:text-xs tracking-[0.25em] uppercase font-medium opacity-0 cursor-pointer hover:text-[#ffffff] transition-colors duration-200"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          onClick={scrollToPortfolio}
        >
          <span>SCROLL</span>
          <ArrowDown size={12} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
