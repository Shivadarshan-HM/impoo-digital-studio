"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  src: string;
  width?: number;
  height?: number;
  alt: string;
}

export interface GalleryGridWithLightboxProps {
  images: GalleryImage[];
  categoryName: string;
}

export default function GalleryGridWithLightbox({
  images,
  categoryName,
}: GalleryGridWithLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = useCallback(() => {
    const lastIndex = selectedIndex;
    setSelectedIndex(null);
    if (lastIndex !== null && triggerRefs.current[lastIndex]) {
      triggerRefs.current[lastIndex]?.focus();
    }
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : (prev ?? 0) - 1));
  }, [selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : (prev ?? 0) + 1));
  }, [selectedIndex, images.length]);

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (selectedIndex === null) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  return (
    <>
      {/* Reduced Motion CSS support */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .gallery-grid-img {
            transition: none !important;
            transform: none !important;
            filter: grayscale(0%) brightness(1) !important;
          }
        }
      `}</style>

      {/* Uniform Responsive CSS Grid (4:5 Aspect Ratio per card) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {images.map((img, idx) => (
          <button
            key={`${img.src}-${idx}`}
            type="button"
            ref={(el) => {
              triggerRefs.current[idx] = el;
            }}
            onClick={() => handleOpen(idx)}
            className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[2px] border border-[rgba(245,242,235,0.08)] bg-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0A]"
            aria-label={`View full size ${categoryName} photo ${idx + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              loading={idx < 4 ? "eager" : "lazy"}
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="gallery-grid-img object-cover object-center w-full h-full grayscale-[40%] brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.03] group-focus-visible:grayscale-0 group-focus-visible:brightness-100 group-focus-visible:scale-[1.03] transition-all duration-700 ease-out"
            />
          </button>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${categoryName} image viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#090909]/95 backdrop-blur-md p-4 md:p-8"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 flex items-center justify-center p-3 rounded-full bg-[#121212]/80 text-[#F5F2EB] hover:text-[#C9A227] border border-[rgba(245,242,235,0.12)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            aria-label="Close image modal"
          >
            <X size={24} />
          </button>

          {/* Navigation Controls (Prev) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-[#121212]/80 text-[#F5F2EB] hover:text-[#C9A227] border border-[rgba(245,242,235,0.12)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Navigation Controls (Next) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-[#121212]/80 text-[#F5F2EB] hover:text-[#C9A227] border border-[rgba(245,242,235,0.12)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Lightbox Main Image Container */}
          <div
            className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={images[selectedIndex].width || 1200}
              height={images[selectedIndex].height || 1500}
              priority
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-[2px] shadow-2xl border border-[rgba(245,242,235,0.08)]"
            />

            {/* Counter Footer */}
            <div
              className="mt-4 text-xs tracking-widest text-[#A89F92] uppercase"
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              <span className="text-[#C9A227] font-medium">
                {selectedIndex + 1 < 10 ? `0${selectedIndex + 1}` : selectedIndex + 1}
              </span>{" "}
              / {images.length < 10 ? `0${images.length}` : images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
