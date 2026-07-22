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
            src="https://maps.app.goo.gl/vU3DDpii8tfGSK1YA"
            className={styles.mapIframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="IMPOO Digital Studio Location"
          ></iframe>
        </div>

        <div ref={addToRefs} className={styles.buttonWrapper}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=N.G+Complex,+Belaganahalli+Road,+Opposite+Police+Station,+Heggadadevanakote,+Karnataka+571114"
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
