"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutSection.module.css";
import { HangingIdCard } from "@/components/lightswind/hanging-id-card";
import { ScrollRevealText } from "@/components/animate-ui/components/ScrollRevealText";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Instant reveal for accessibility
      gsap.set(elementsRef.current, { opacity: 1, y: 0 });
      if (imageWrapperRef.current) {
        gsap.set(imageWrapperRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state: hidden + shifted down
      gsap.set(elementsRef.current, { opacity: 0, y: 28 });
      if (imageWrapperRef.current) {
        gsap.set(imageWrapperRef.current, { opacity: 0, scale: 0.98 });
      }

      // Timeline trigger when 75% in viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      // Animate text elements with subtle stagger
      tl.to(elementsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });

      // Animate founder image reveal simultaneously
      if (imageWrapperRef.current) {
        tl.to(
          imageWrapperRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.7"
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToPortfolio = () => {
    const portfolioEl = document.getElementById("portfolio");
    if (portfolioEl) {
      portfolioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Side: Typography & Brand Narrative (45%) */}
          <div className={styles.textWrapper}>
            <ScrollRevealText as="p" className={styles.eyebrow}>
              MEET THE ARTIST &amp; VISIONARY
            </ScrollRevealText>

            <ScrollRevealText type="crazy" as="h2" className={styles.heading}>
              Ravikumar IMPOO
            </ScrollRevealText>

            <div ref={addToRefs} className={styles.divider} aria-hidden="true" />

            <ScrollRevealText type="words" delay={0.2} as="p" className={styles.paragraph}>
              Founder and Lead Cinematographer of IMPOO Digital Studio,
              Ravikumar brings over a decade of master craftsmanship to HD
              Kote and Mysore. With an editorial eye rooted in warm shadows,
              authentic emotion, and cinematic grandeur, he crafts visual
              legacies that endure across generations.
            </ScrollRevealText>

            <ScrollRevealText type="words" delay={0.4} as="p" className={styles.paragraph}>
              Every wedding and portrait session is treated as an original
              masterpiece — capturing unscripted tears, sacred rituals, and the
              quiet elegance of quiet glances without intrusive staging.
            </ScrollRevealText>

            <div ref={addToRefs} className={styles.buttonWrapper}>
              <button
                type="button"
                className={styles.portfolioButton}
                onClick={scrollToPortfolio}
              >
                VIEW PORTFOLIO <span className={styles.buttonArrow}>→</span>
              </button>
            </div>
          </div>

          {/* Right Side: Large Founder Portrait (55%) */}
          <div ref={imageWrapperRef} className={styles.imageWrapper}>
            <div className="flex items-center justify-center w-full h-full pt-12 md:pt-0 pb-16 scale-125 md:scale-150">
              <HangingIdCard
                name="Ravikumar IMPOO"
                role="Lead Cinematographer"
                badgeId="IMPOO-2026"
                accentColor="#C8A86B"
                ropeLength={90}
                imageUrl="/portfolio/awards-recognition/cover.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
