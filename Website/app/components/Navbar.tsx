"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X, ArrowRight } from "lucide-react";
import SpotlightNavbar from "./SpotlightNavbar";
import SpecularButton from "./SpecularButton";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Service", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const spotlightNavWrapperRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.9 }
      );

      if (spotlightNavWrapperRef.current) {
        tl.fromTo(
          spotlightNavWrapperRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        );
      }

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Lock body scroll when mobile menu overlay is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);

    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      if (!id) {
        if (window.location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.href = "/";
        }
      } else {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.location.href = `/${href}`;
        }
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-20 pointer-events-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo — minimal */}
            <div ref={logoRef} className="flex-shrink-0 opacity-0 z-50">
              <a href="/" className="flex items-center gap-2.5 sm:gap-3 cursor-pointer">
                <span
                  className="text-[1.1rem] md:text-[1.2rem] tracking-[0.2em] text-foreground font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  IMPOO
                </span>
                <span
                  className="hidden sm:inline-block text-[0.5rem] tracking-[0.25em] uppercase text-subtle font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Digital Studio
                </span>
              </a>
            </div>

            {/* Center SpotlightNavbar Links — Desktop only */}
            <div
              ref={spotlightNavWrapperRef}
              className="hidden lg:flex items-center opacity-0"
            >
              <SpotlightNavbar items={navItems} defaultActiveIndex={0} />
            </div>

            {/* Right Side: CTA Button & Mobile Menu Toggle */}
            <div ref={ctaRef} className="flex items-center gap-3 sm:gap-4 opacity-0 z-50">
              {/* CTA button */}
              <SpecularButton
                size="md"
                radius={18}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor="#0a0a0a"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
                onClick={() => {
                  setMobileMenuOpen(false);
                  const target = document.getElementById("contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    window.location.href = "/#contact";
                  }
                }}
              >
                <span className="hidden xs:inline">Book Your Story</span>
                <span className="xs:hidden">Book</span>
              </SpecularButton>

              {/* Mobile Hamburger Toggle Button (lg:hidden) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-full border border-[#F5F2EB]/20 bg-black/60 text-[#F5F2EB] hover:text-[#C8A86B] hover:border-[#C8A86B] backdrop-blur-md transition-all duration-300 cursor-pointer"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Luxury Editorial Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808]/96 backdrop-blur-2xl flex flex-col justify-between px-8 pt-28 pb-12 transition-opacity duration-300 lg:hidden pointer-events-auto">
          <div className="flex flex-col items-start gap-6 max-w-sm mx-auto w-full my-auto">
            <p
              className="text-[#C8A86B] text-[0.65rem] tracking-[0.3em] uppercase font-medium mb-2"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              ✦ NAVIGATION
            </p>

            {navItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleMobileNavClick(item.href)}
                className="group w-full text-left flex items-center justify-between py-2.5 text-3xl sm:text-4xl text-[#F5F2EB] hover:text-[#C8A86B] font-light transition-colors duration-300 border-b border-[#F5F2EB]/10 cursor-pointer"
                style={{
                  fontFamily:
                    "var(--font-cormorant-garamond), var(--font-display), serif",
                }}
              >
                <span>{item.label}</span>
                <ArrowRight
                  size={18}
                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#C8A86B]"
                />
              </button>
            ))}
          </div>

          <div className="text-center max-w-sm mx-auto w-full pt-8 border-t border-[#F5F2EB]/10">
            <p
              className="text-[#A89F92] text-xs tracking-[0.2em] uppercase font-medium mb-1"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              IMPOO DIGITAL STUDIO
            </p>
            <p className="text-[#A89F92]/60 text-[0.7rem]">
              Luxury Wedding Photography & Cinematography
            </p>
          </div>
        </div>
      )}
    </>
  );
}
