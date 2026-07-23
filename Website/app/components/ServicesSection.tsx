"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesSection.module.css";

type Service = {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const services: Service[] = [
  {
    number: "01",
    title: "Wedding Photography",
    description:
      "Timeless storytelling through elegant, emotion-driven imagery crafted around real moments, refined details, and the natural rhythm of your celebration.",
    imageSrc: "/portfolio/reception/photo-37.jpeg",
    imageAlt: "Wedding couple portrait captured during golden hour in Mysore by IMPOO Digital Studio",
  },
  {
    number: "02",
    title: "Wedding Cinematography",
    description:
      "Every glance, every smile, every emotion in motion, filmed with cinematic intent so your day can be felt again with depth, sound, and atmosphere.",
    imageSrc: "/portfolio/wedding/photo-12.jpeg",
    imageAlt: "Cinematic wedding decor and sacred ceremony framing by IMPOO Digital Studio, Karnataka",
  },
  {
    number: "03",
    title: "Pre Wedding Stories",
    description:
      "Beautiful stories before the vows, designed to reflect your personalities in intimate frames that balance elegance, movement, and authentic connection.",
    imageSrc: "/portfolio/reception/photo-5.jpg",
    imageAlt: "Pre-wedding couple portrait session in HD Kote by IMPOO Digital Studio",
  },
  {
    number: "04",
    title: "Luxury Wedding Albums",
    description:
      "Designed to preserve memories for generations, each album is curated with archival quality craftsmanship, thoughtful pacing, and a timeless editorial finish.",
    imageSrc: "/portfolio/reception/photo-31.jpeg",
    imageAlt: "Elegant luxury wedding album portrait by IMPOO Digital Studio, Mysore",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const blocks = blockRefs.current.filter(Boolean);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headerEls = headerRef.current.querySelectorAll("[data-services-reveal]");

        gsap.fromTo(
          headerEls,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        gsap.to(headerRef.current, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      blocks.forEach((block) => {
        if (!block) return;

          const copy = block.querySelector<HTMLElement>("[data-service-copy]");
          const number = block.querySelector<HTMLElement>("[data-service-number]");
          const title = block.querySelector<HTMLElement>("[data-service-title]");
          const text = block.querySelector<HTMLElement>("[data-service-text]");
          const media = block.querySelector<HTMLElement>("[data-service-media]");
          const image = block.querySelector<HTMLElement>("[data-service-image]");

          const blockTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 76%",
              once: true,
            },
          });

          blockTimeline.fromTo(
            [number, title, text],
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
            }
          );

          blockTimeline.fromTo(
            media,
            { opacity: 0, y: 34, clipPath: "inset(10% 0% 10% 0% round 16px)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              duration: 1.05,
              ease: "power4.out",
            },
            "-=0.62"
          );

          blockTimeline.fromTo(
            image,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "<"
          );

          if (copy) {
            gsap.to(copy, {
              yPercent: -3,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            });
          }

          if (image) {
            gsap.to(image, {
              yPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            });
          }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.section} aria-labelledby="services-heading">
      <div className={styles.inner}>
        <div ref={headerRef} className={styles.header}>
          <p data-services-reveal className={styles.label}>Services</p>
          <h2 data-services-reveal id="services-heading" className={styles.heading}>
            Crafted Experiences,
            <br />
            Beyond Photography.
          </h2>
          <p data-services-reveal className={styles.description}>
            From first conversation to final delivery, every service is tailored to preserve your celebration with intention, elegance, and timeless craft.
          </p>
        </div>

        <div className={styles.blocks}>
          {services.map((service, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={service.number}
                ref={(element) => {
                  blockRefs.current[index] = element;
                }}
                className={`${styles.block} ${isEven ? styles.blockReverse : ""}`}
              >
                <div className={styles.copy} data-service-copy>
                  <p className={styles.number} data-service-number>{service.number}</p>
                  <h3 className={styles.serviceTitle} data-service-title>{service.title}</h3>
                  <p className={styles.serviceText} data-service-text>{service.description}</p>
                </div>

                <div className={styles.media} data-service-media>
                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 52vw, 48vw"
                    className={styles.image}
                    data-service-image
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
