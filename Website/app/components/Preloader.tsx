"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [counter, setCounter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's already been seen in this browser session
    if (sessionStorage.getItem("hasSeenPreloader")) {
      setShow(false);
      return;
    }

    // Lock body scrolling while preloader is active
    document.body.style.overflow = "hidden";

    const progressObj = { value: 0 };

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(logoWrapperRef.current, { opacity: 0, y: 15, scale: 1 });
      gsap.set([trackRef.current, counterRef.current], { opacity: 0 });
      gsap.set(barRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("hasSeenPreloader", "true");
          document.body.style.overflow = "";
          setShow(false);
        },
      });

      // 1. Studio Logo fades in & shifts up subtly
      tl.to(logoWrapperRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
      });

      // 2. Loading line & percentage counter fade in
      tl.to(
        [trackRef.current, counterRef.current],
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // 3. Thin gold loading line fills smoothly & counter increments 0–100%
      tl.to(
        barRef.current,
        {
          scaleX: 1,
          duration: 2.2,
          ease: "power2.inOut",
        },
        "-=0.3"
      ).to(
        progressObj,
        {
          value: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            setCounter(Math.floor(progressObj.value));
          },
        },
        "<"
      );

      // 4. Once 100% complete, logo gently scales down and fades
      tl.to(logoWrapperRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.65,
        ease: "power2.inOut",
      });

      // 5. Loading line & percentage disappear
      tl.to(
        [trackRef.current, counterRef.current],
        {
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
        },
        "-=0.55"
      );

      // 6. Preloader background container fades out smoothly into hero
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.3"
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className={styles.preloader}
      aria-label="IMPOO Digital Studio Loading Sequence"
    >
      <div className={styles.content}>
        {/* Studio Logo */}
        <div ref={logoWrapperRef} className={styles.logoWrapper}>
          <h1 className={styles.logoTitle}>IMPOO</h1>
          <span className={styles.logoSubtitle}>Digital Studio</span>
        </div>

        {/* Thin Gold Loading Line */}
        <div ref={trackRef} className={styles.progressTrack} aria-hidden="true">
          <div ref={barRef} className={styles.progressBar} />
        </div>

        {/* Percentage Counter */}
        <div ref={counterRef} className={styles.counterText}>
          {String(counter).padStart(2, "0")}%
        </div>
      </div>
    </div>
  );
}
