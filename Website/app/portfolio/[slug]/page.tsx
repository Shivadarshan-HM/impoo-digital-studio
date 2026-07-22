import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import GalleryGridWithLightbox, {
  type GalleryImage,
} from "@/app/components/GalleryGridWithLightbox";

import {
  getCategoryBySlug,
  getCategoryPhotosBySlug,
  type PublicCategory,
  type PublicPhoto,
} from "@/lib/api";

interface CategoryDetails {
  title: string;
  slug: string;
  folder: string;
  fallbackSourceDir: string;
  description: string;
}

const CATEGORY_MAP: Record<string, CategoryDetails> = {
  wedding: {
    title: "Wedding",
    slug: "wedding",
    folder: "wedding",
    fallbackSourceDir: "images/marriage",
    description:
      "A cinematic journey through sacred vows, emotional unions, and grand celebrations. Capturing every candid tear, shared laugh, and intricate ritual with timeless editorial grace.",
  },
  haldi: {
    title: "Haldi",
    slug: "haldi",
    folder: "haldi",
    fallbackSourceDir: "images/Haldi",
    description:
      "Vibrant bursts of turmeric, joyful laughter, and intimate pre-wedding rituals. Documenting the authentic warmth, playfulness, and sacred blessings of traditional Haldi ceremonies.",
  },
  reception: {
    title: "Reception",
    slug: "reception",
    folder: "reception",
    fallbackSourceDir: "images/marriage",
    description:
      "An evening of twilight glamour, opulent decor, and unforgettable first dances. Framing high-fashion portraiture and midnight festivities in deep cinematic contrast.",
  },
  "baby-shoot": {
    title: "Baby Shoot",
    slug: "baby-shoot",
    folder: "baby-shoot",
    fallbackSourceDir: "images/baby photo",
    description:
      "Soft, warm, and heart-melting portraits of new beginnings. Celebrating the gentle innocence, delicate details, and quiet joy of your littlest family members.",
  },
  "awards-recognition": {
    title: "Awards & Recognition",
    slug: "awards-recognition",
    folder: "awards-recognition",
    fallbackSourceDir: "images/Award-recognization",
    description:
      "Honored by international photography associations and prestigious editorial publications. Celebrating our commitment to artistic excellence, master craftsmanship, and timeless storytelling.",
  },
};

/**
 * Pure Node helper to parse image dimensions (PNG, JPEG, WebP) directly from binary headers
 */
function getImageDimensions(filePath: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(filePath);

    // PNG
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        if (
          marker === 0xffc0 ||
          marker === 0xffc1 ||
          marker === 0xffc2 ||
          marker === 0xffc3
        ) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }

    // WebP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      if (
        buffer[12] === 0x56 &&
        buffer[13] === 0x50 &&
        buffer[14] === 0x38 &&
        buffer[15] === 0x20
      ) {
        return {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff,
        };
      }
      if (
        buffer[12] === 0x56 &&
        buffer[13] === 0x50 &&
        buffer[14] === 0x38 &&
        buffer[15] === 0x4c
      ) {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        return {
          width: 1 + (((b1 & 0x3f) << 8) | b0),
          height: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
        };
      }
      if (
        buffer[12] === 0x56 &&
        buffer[13] === 0x50 &&
        buffer[14] === 0x38 &&
        buffer[15] === 0x58
      ) {
        return {
          width: 1 + buffer.readUIntLE(24, 3),
          height: 1 + buffer.readUIntLE(27, 3),
        };
      }
    }
  } catch {
    // ignore parsing errors
  }

  return { width: 1200, height: 800 }; // default fallback
}

function isMarriagePhoto(filename: string): boolean {
  const lower = filename.toLowerCase();
  if (
    lower.startsWith("exhibition") ||
    lower.startsWith("product") ||
    lower.startsWith("corporate") ||
    lower.startsWith("birthday")
  ) {
    return false;
  }
  return /\.(jpe?g|png|webp)$/i.test(filename);
}

/**
 * Server-side helper to read cover and gallery images from local filesystem as fallback
 */
function getLocalFallbackGallery(category: CategoryDetails) {
  const rootDir = process.cwd();
  const dir = path.join(rootDir, "public", "portfolio", category.folder);

  let files: string[] = [];
  try {
    if (fs.existsSync(dir)) {
      files = fs
        .readdirSync(dir)
        .filter((f) =>
          category.folder === "wedding"
            ? isMarriagePhoto(f)
            : /\.(jpe?g|png|webp)$/i.test(f)
        );
    }
  } catch {
    files = [];
  }

  let coverFileName = files.find((f) => /^cover\.(jpe?g|png|webp)$/i.test(f));
  if (!coverFileName && files.length > 0) {
    coverFileName = files[0];
  }

  const coverImage = coverFileName
    ? `/portfolio/${category.folder}/${coverFileName}`
    : `/images/marriage/wedding-01.jpg`;

  const galleryFiles = files.filter((f) => f !== coverFileName);
  const galleryListToUse = galleryFiles.length > 0 ? galleryFiles : files;

  const galleryImages: GalleryImage[] = galleryListToUse.map((filename, idx) => {
    const fullPath = path.join(dir, filename);
    const { width, height } = getImageDimensions(fullPath);
    return {
      src: `/portfolio/${category.folder}/${filename}`,
      width,
      height,
      alt: `${category.title} photograph ${idx + 1} — IMPO Digital Studio`,
    };
  });

  return {
    coverImage,
    totalPhotoCount: files.length,
    galleryImages,
  };
}

export async function generateStaticParams() {
  return [
    { slug: "wedding" },
    { slug: "haldi" },
    { slug: "reception" },
    { slug: "baby-shoot" },
    { slug: "awards-recognition" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categoryDef = CATEGORY_MAP[resolvedParams.slug];

  if (!categoryDef) {
    return {
      title: "Portfolio — IMPO Digital Studio",
    };
  }

  return {
    title: `${categoryDef.title} — IMPO Digital Studio`,
    description: categoryDef.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryDef = CATEGORY_MAP[slug];

  if (!categoryDef) {
    notFound();
  }

  let coverImage = "";
  let totalPhotoCount = 0;
  let galleryImages: GalleryImage[] = [];
  let categoryTitle = categoryDef.title;
  let categoryDescription = categoryDef.description;

  try {
    // Attempt dynamic fetch from backend API by slug
    const [apiCategory, apiPhotos] = await Promise.all([
      getCategoryBySlug(slug).catch(() => null),
      getCategoryPhotosBySlug(slug).catch(() => []),
    ]);

    if (apiCategory) {
      categoryTitle = apiCategory.name;
    }

    if (apiPhotos && apiPhotos.length > 0) {
      galleryImages = apiPhotos.map((photo, idx) => ({
        src: photo.image_url,
        width: 1200,
        height: 800,
        alt: `${categoryTitle} photograph ${idx + 1} — IMPO Digital Studio`,
      }));

      totalPhotoCount = apiCategory ? apiCategory.photo_count : apiPhotos.length;
      coverImage =
        apiCategory?.cover_image_url ||
        apiPhotos.find((p) => p.is_cover)?.image_url ||
        apiPhotos[0].image_url;
    } else if (apiCategory && apiCategory.cover_image_url) {
      coverImage = apiCategory.cover_image_url;
      totalPhotoCount = apiCategory.photo_count;
    }
  } catch (err) {
    console.warn(`Backend API fetch for category slug '${slug}' failed:`, err);
  }

  // If no dynamic images fetched from API, fall back gracefully to local filesystem files
  if (galleryImages.length === 0) {
    const fallback = getLocalFallbackGallery(categoryDef);
    coverImage = coverImage || fallback.coverImage;
    totalPhotoCount = totalPhotoCount || fallback.totalPhotoCount;
    galleryImages = fallback.galleryImages;
  }

  const formattedCount =
    totalPhotoCount < 10 ? `0${totalPhotoCount}` : `${totalPhotoCount}`;

  return (
    <div className="min-h-screen bg-[#0E0D0A] text-[#F3EDE2]">
      {/* Fixed Header / Back Link */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none">
        <Link
          href="/#portfolio"
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212]/80 backdrop-blur-md text-xs uppercase tracking-widest text-[#F3EDE2] hover:text-[#C9A227] border border-[rgba(245,242,235,0.12)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          aria-label="Back to Portfolio on homepage"
        >
          <ArrowLeft size={14} />
          <span>Portfolio</span>
        </Link>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[70vh] min-h-[480px] bg-[#121212] overflow-hidden">
        {coverImage && (
          <Image
            src={coverImage}
            alt={`${categoryTitle} cover image`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.88] contrast-[0.96]"
          />
        )}

        {/* Bottom Cinematic Gradient Scrim (Transparent -> ~85% Black) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0E0D0A] via-[#0E0D0A]/50 to-transparent"
          aria-hidden="true"
        />

        {/* Hero Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1440px] mx-auto px-6 md:px-12 pb-8 md:pb-12 flex items-end justify-between">
          {/* Bottom Left: Category Title & Widening Gold Underline Motif */}
          <div className="flex flex-col items-start gap-3">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl text-[#F3EDE2] font-light tracking-tight leading-none"
              style={{
                fontFamily:
                  "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif",
              }}
            >
              {categoryTitle}
            </h1>
            <span
              className="block h-[1px] bg-[#C9A227] w-[64px]"
              aria-hidden="true"
            />
          </div>

          {/* Bottom Right: Photo Count Anchor */}
          <div className="flex flex-col items-end text-right">
            <span
              className="text-3xl md:text-5xl font-medium leading-none text-[#C9A227]"
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              {formattedCount}
            </span>
            <span
              className="mt-1 text-xs uppercase tracking-[0.2em] text-[#8C8577]"
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              PHOTOS
            </span>
          </div>
        </div>
      </section>

      {/* 2. DESCRIPTION SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-12">
        <div className="max-w-[640px]">
          <p
            className="text-base md:text-lg text-[#8C8577] font-light leading-relaxed"
            style={{
              fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
            }}
          >
            {categoryDescription}
          </p>
        </div>
      </section>

      {/* 3. RESPONSIVE MASONRY GALLERY */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <GalleryGridWithLightbox
          images={galleryImages}
          categoryName={categoryTitle}
        />
      </section>
    </div>
  );
}
