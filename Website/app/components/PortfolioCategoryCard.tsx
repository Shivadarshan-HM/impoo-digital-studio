import Link from "next/link";
import Image from "next/image";

export interface PortfolioCategoryCardProps {
  name: string;
  photoCount: number;
  slug: string;
  coverImage: string;
  priority?: boolean;
  aspectRatio?: "4:5" | "16:10" | string;
  isHero?: boolean;
  isBabyShoot?: boolean;
}

export default function PortfolioCategoryCard({
  name,
  photoCount,
  slug,
  coverImage,
  priority = false,
  aspectRatio = "16:10",
  isHero = false,
  isBabyShoot = false,
}: PortfolioCategoryCardProps) {
  // Format count with leading zero if single digit (e.g. 08, 12)
  const formattedCount = photoCount < 10 ? `0${photoCount}` : `${photoCount}`;

  // Aspect ratio mapping
  const aspectClass =
    aspectRatio === "4:5"
      ? "aspect-[4/5]"
      : aspectRatio === "16:10"
      ? "aspect-[16/10]"
      : aspectRatio;

  return (
    <Link
      href={`/portfolio/${slug}`}
      className={`group relative block w-full overflow-hidden rounded-[2px] bg-[#121212] border border-[rgba(245,242,235,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] ${aspectClass}`}
      aria-label={`View ${name} portfolio containing ${photoCount} photos`}
    >
      {/* Film-strip detail for Wedding card (Top Left decorative) */}
      {isHero && (
        <div
          className="absolute top-4 left-5 z-20 flex items-center gap-1.5 pointer-events-none"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-[1px] h-[8px] bg-[#C8A86B] opacity-50"
            />
          ))}
        </div>
      )}

      {/* Image element */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={coverImage}
          alt={`${name} photography portfolio`}
          fill
          priority={priority}
          sizes={
            isHero
              ? "(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
          className={`portfolio-card-img object-cover object-center ${
            isBabyShoot
              ? "brightness-[0.92] contrast-[0.96] saturate-[1.08]"
              : ""
          }`}
          style={{
            /* Default: grayscale(40%) brightness(.82), Hover: grayscale(0) brightness(.96) scale(1.06) */
            transition:
              "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.1s ease",
          }}
        />
      </div>

      {/* Bottom Cinematic Gradient Scrim (Transparent -> 90% near black) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#090909]/90 via-[#090909]/40 to-transparent"
        aria-hidden="true"
      />

      {/* Card Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-5 md:p-6 lg:p-7">
        {/* Bottom Left: Category Name & Animated Gold Underline */}
        <div className="flex flex-col items-start gap-2">
          <h3
            className="text-2xl md:text-3xl lg:text-4xl text-[#F5F2EB] font-normal tracking-tight leading-none"
            style={{
              fontFamily:
                "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif",
            }}
          >
            {name}
          </h3>
          <span
            className="portfolio-card-underline block h-[1px] bg-[#C8A86B] w-[36px] group-hover:w-[64px]"
            style={{
              transition: "width 0.6s ease",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Bottom Right: Gold Photo Count & Small PHOTOS label */}
        <div className="flex flex-col items-end text-right">
          <span
            className="text-2xl md:text-3xl lg:text-4xl font-medium leading-none text-[#C8A86B]"
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}
          >
            {formattedCount}
          </span>
          <span
            className="mt-1 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#A89F92]"
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}
          >
            PHOTOS
          </span>
        </div>
      </div>
    </Link>
  );
}
