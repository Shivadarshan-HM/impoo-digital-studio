"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeDBendCarousel, { ThreeDBendCarouselRef } from "@/components/lightswind/3d-bend-carousel";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";

const services = [
  {
    image: "/portfolio/reception/photo-37.jpeg",
    title: "Wedding Photography",
    subtitle: "Timeless Storytelling",
    badge: "01",
    tag: "Photography",
    description: "Timeless storytelling through elegant, emotion-driven imagery crafted around real moments and refined details.",
  },
  {
    image: "/portfolio/wedding/photo-12.jpeg",
    title: "Wedding Cinematography",
    subtitle: "Cinematic Intent",
    badge: "02",
    tag: "Video",
    description: "Every glance, every emotion in motion, filmed with cinematic intent so your day can be felt again with depth.",
  },
  {
    image: "/portfolio/reception/photo-5.jpg",
    title: "Pre Wedding Stories",
    subtitle: "Intimate Frames",
    badge: "03",
    tag: "Session",
    description: "Beautiful stories before the vows, reflecting your personalities in frames that balance elegance and connection.",
  },
  {
    image: "/portfolio/reception/photo-31.jpeg",
    title: "Luxury Wedding Albums",
    subtitle: "Archival Quality",
    badge: "04",
    tag: "Print",
    description: "Designed to preserve memories for generations, curated with craftsmanship and a timeless editorial finish.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<ThreeDBendCarouselRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${(services.length - 1) * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          if (carouselRef.current) {
            carouselRef.current.setProgress(self.progress);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="relative w-full text-zinc-900 overflow-hidden bg-[#FAF8F5]" 
      aria-labelledby="services-heading"
    >
      {/* Background with Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarsBackground
          starColor="#C8A86B"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#FAF8F5_0%,_#EBE4D5_100%)] opacity-60"
        />
      </div>

      {/* Sticky container that stays pinned while we scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-between overflow-hidden">
        
        {/* LEFT SIDE - Service Information */}
        <div className="w-full md:w-1/2 h-[45%] md:h-full flex flex-col justify-end md:justify-center px-6 md:px-16 lg:px-24 z-20 pb-4 md:pb-0 pt-20 md:pt-0">
          <div className="mb-4 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#C8A86B] font-semibold mb-2 md:mb-4">Services</p>
            <h2 id="services-heading" className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
              Crafted Experiences,<br />
              <span className="font-serif italic text-zinc-500">Beyond Photography.</span>
            </h2>
          </div>

          {/* Animated Text Block that changes based on activeIndex */}
          <div className="relative h-40 md:h-48 mt-2 md:mt-8">
            {services.map((service, index) => (
              <div 
                key={service.badge}
                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeIndex === index 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-12 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                  <span className="text-xl md:text-3xl font-light text-[#C8A86B]">{service.badge}</span>
                  <h3 className="text-lg md:text-2xl font-medium">{service.title}</h3>
                </div>
                <p className="text-zinc-600 leading-relaxed text-sm md:text-lg max-w-md">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - 3D Bend Carousel */}
        <div className="w-full md:w-1/2 h-[55%] md:h-full flex items-center justify-center relative">
          
          <ThreeDBendCarousel
            ref={carouselRef}
            items={services}
            orientation="vertical"
            curveDirection="concave"
            grayscaleInactive={true}
            itemWidth={340}
            aspectRatio={0.75}
            gap={-35}
            perspective={1200}
            bendAngle={45}
            depth={400}
            snap={true}
            loop={false}
            autoPlay={false}
            enableWheel={false}  // Let the page handle scrolling
            enableDrag={false}   // Prevent dragging so it strictly follows page scroll
            showControls={false} // Clean UI without arrows
            showIndicators={false} // Clean UI without dots
            onActiveChange={setActiveIndex}
            className="w-full h-[150%] md:h-[120vh]" // Make it taller to allow bending out of view
            cardClassName="scale-90 md:scale-100" // Scale down cards slightly on mobile
          />

          {/* Foreground blend gradient to soften edges of the carousel */}
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none z-10 md:hidden" />
        </div>

      </div>
    </section>
  );
}
