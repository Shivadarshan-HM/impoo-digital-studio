"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const footer = footerRef.current;
    if (!footer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(elementsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(elementsRef.current, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 90%",
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
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.topDivider} aria-hidden="true" />
      
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div ref={addToRefs} className={styles.column}>
            <h3 className={styles.brandName}>IMPOO Digital Studio</h3>
            <p className={styles.statement}>
              Capturing timeless photographs and cinematic wedding films that preserve every emotion for generations.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div ref={addToRefs} className={styles.column}>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <ul className={styles.linkList}>
              <li><button onClick={() => scrollToSection("hero")} className={styles.linkButton}>Home</button></li>
              <li><button onClick={() => scrollToSection("about")} className={styles.linkButton}>About</button></li>
              <li><button onClick={() => scrollToSection("portfolio")} className={styles.linkButton}>Portfolio</button></li>
              <li><button onClick={() => scrollToSection("services")} className={styles.linkButton}>Services</button></li>
              <li><button onClick={() => scrollToSection("contact")} className={styles.linkButton}>Contact</button></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div ref={addToRefs} className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.contactDetails}>
              <p>Ravikumar Aradhya</p>
              <p><a href="tel:+919739747628" className={styles.phoneLink}>+91 9739747628</a></p>
              <p className={styles.address}>
                N.G Complex<br />
                Belaganahalli Road<br />
                Opposite Police Station<br />
                Heggadadevanakote<br />
                Karnataka – 571114
              </p>
            </div>
          </div>

          {/* Column 4: Follow */}
          <div ref={addToRefs} className={styles.column}>
            <h4 className={styles.columnTitle}>Follow</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.instagram.com/impoophotography?utm_source=qr&igsh=MTYzazdqN29jdzNpaA%3D%3D" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://wa.me/919739747628" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/vU3DDpii8tfGSK1YA" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div ref={addToRefs} className={styles.bottomBarWrapper}>
          <div className={styles.bottomDivider} aria-hidden="true" />
          <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              © 2026 IMPOO Digital Studio.<br className={styles.mobileBreak} /> All Rights Reserved.
            </p>
            <p className={styles.credit}>
              Designed & Developed by<br className={styles.mobileBreak} /> IMPOO Digital Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
