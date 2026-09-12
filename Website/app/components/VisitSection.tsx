"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./VisitSection.module.css";

export default function VisitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(elementsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(elementsRef.current, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(elementsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="visit" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <p ref={addToRefs} className={styles.eyebrow}>
            VISIT OUR STUDIO
          </p>

          <h2 ref={addToRefs} className={styles.heading}>
            Find Us in HD Kote.
          </h2>

          <div ref={addToRefs} className={styles.divider} aria-hidden="true" />

          <p ref={addToRefs} className={styles.description}>
            We'd love to meet you and discuss your wedding story. Visit our studio by appointment or reach us using the directions below.
          </p>

          <div ref={addToRefs} className={styles.address}>
            N.G Complex,<br />
            Belaganahalli Road,<br />
            Opposite Police Station,<br />
            Heggadadevanakote,<br />
            Karnataka – 571114
          </div>
        </div>

        <div ref={addToRefs} className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3336775040275!2d76.3308684!3d12.0892888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba5f380ef1f5bd7%3A0x4c7f652c817ed698!2sImpoo%20Digital%20Studio!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            className={styles.mapIframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Impoo Digital Studio Location"
          ></iframe>
        </div>

        <div ref={addToRefs} className={styles.buttonWrapper}>
          <a
            href="https://maps.app.goo.gl/Hf8Cck1eZVhW9ca77"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsButton}
          >
            Get Directions <span className={styles.buttonArrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
