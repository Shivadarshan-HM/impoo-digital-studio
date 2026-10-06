import PortfolioCategoryCard from "./PortfolioCategoryCard";
import styles from "./PortfolioSection.module.css";
import { getPublishedCategories, type PublicCategory } from "@/lib/api";
import CoolSlideGallery from "@/components/lightswind/cool-slide-gallery";
import WaveGridBackground from "@/components/lightswind/wave-grid-background";
import { ScrollRevealText } from "@/components/animate-ui/components/ScrollRevealText";

interface CategoryDef {
  name: string;
  slug: string;
  fallbackCover: string;
  aspectRatio: "4:5" | "16:10" | string;
  isHero?: boolean;
  priority?: boolean;
  isBabyShoot?: boolean;
}

const DEFAULT_DEFS: CategoryDef[] = [
  {
    name: "Wedding",
    slug: "wedding",
    fallbackCover: "/portfolio/wedding/cover.jpg",
    aspectRatio: "4:5",
    isHero: true,
    priority: true,
  },
  {
    name: "Haldi",
    slug: "haldi",
    fallbackCover: "/portfolio/haldi/cover.jpg",
    aspectRatio: "16:10",
  },
  {
    name: "Reception",
    slug: "reception",
    fallbackCover: "/portfolio/reception/cover.jpg",
    aspectRatio: "16:10",
  },
  {
    name: "Baby Shoot",
    slug: "baby-shoot",
    fallbackCover: "/portfolio/baby-shoot/cover.jpg",
    aspectRatio: "16:10",
    isBabyShoot: true,
  },
  {
    name: "Awards & Recognition",
    slug: "awards-recognition",
    fallbackCover: "/portfolio/awards-recognition/cover.jpg",
    aspectRatio: "16:10",
  },
];

export default async function PortfolioSection() {
  // Fetch dynamic categories from FastAPI backend public API
  let fetchedCategories: PublicCategory[] = [];
  try {
    fetchedCategories = await getPublishedCategories();
  } catch (error) {
    console.warn("Could not fetch categories from backend API, using fallback data:", error);
    fetchedCategories = [];
  }

  // Create a map by slug for fast lookup
  const categoryMap = new Map<string, PublicCategory>();
  fetchedCategories.forEach((cat) => {
    categoryMap.set(cat.slug, cat);
  });

  // Combine definitions with API data or fallback
  const categoriesData = DEFAULT_DEFS.map((def) => {
    const apiData = categoryMap.get(def.slug);
    
    // Specifically override Haldi cover image as requested
    let coverImage = apiData?.cover_image_url || def.fallbackCover;
    if (def.slug === "haldi" && !apiData?.cover_image_url) {
      coverImage = "/images/Haldi/WhatsApp%20Image%202026-07-19%20at%207.44.16%20PM.jpeg";
    }

    return {
      ...def,
      name: apiData?.name || def.name,
      photoCount: apiData?.photo_count ?? 0,
      coverImage: coverImage,
    };
  });

  const gallerySlides = categoriesData.map(c => ({
    src: c.coverImage,
    title: c.name,
    subtitle: `${c.photoCount} Photos`,
    badge: c.isHero ? "Featured" : (c.isBabyShoot ? "Popular" : undefined),
    href: `/portfolio/${c.slug}`
  }));

  return (
    <section
      id="portfolio"
      className={`${styles.section} relative overflow-hidden`}
      aria-labelledby="portfolio-heading"
    >
      {/* Wave Grid Background */}
      <div className="absolute inset-0 z-0">
        <WaveGridBackground 
          colorBase="#ffffff" 
          colorHigh="#C8A86B" 
          autoAnimate={true}
        />
      </div>

      <div className={`${styles.inner} relative z-10`}>
        {/* Section Header */}
        <div className={styles.header}>
          <ScrollRevealText as="p" className={styles.label}>
            Selected Portfolio
          </ScrollRevealText>
          <ScrollRevealText as="h2" id="portfolio-heading" className={styles.heading} type="words">
            Cinematic Stories. Timeless Moments.
          </ScrollRevealText>
          <ScrollRevealText as="p" className={styles.description} delay={0.2} type="words">
            Explore our curated portfolio of weddings, celebrations, intimate portraiture, and award-winning recognition.
          </ScrollRevealText>
        </div>

        {/* Cool Slide Gallery replacing the Grid */}
        <div className="w-full h-[600px] mt-12 flex items-center justify-center rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] border border-white/5 rounded-2xl z-0" />
          <div className="relative z-10 w-full h-full pt-6">
            <CoolSlideGallery
              slides={gallerySlides}
              cardWidth={360}
              cardHeight={440}
              showTitle
              showArrows
              showDots
              draggable
              clickable
              autoplay={false}
              easing="smooth"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
