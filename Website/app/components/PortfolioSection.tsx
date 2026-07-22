import PortfolioCategoryCard from "./PortfolioCategoryCard";
import styles from "./PortfolioSection.module.css";
import { getPublishedCategories, type PublicCategory } from "@/lib/api";

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
    return {
      ...def,
      name: apiData?.name || def.name,
      photoCount: apiData?.photo_count ?? 0,
      coverImage: apiData?.cover_image_url || def.fallbackCover,
    };
  });

  const weddingCard = categoriesData.find((c) => c.slug === "wedding");
  const haldiCard = categoriesData.find((c) => c.slug === "haldi");
  const receptionCard = categoriesData.find((c) => c.slug === "reception");
  const babyShootCard = categoriesData.find((c) => c.slug === "baby-shoot");
  const awardsCard = categoriesData.find((c) => c.slug === "awards-recognition");

  return (
    <section
      id="portfolio"
      className={styles.section}
      aria-labelledby="portfolio-heading"
    >
      <div className={styles.inner}>
        {/* Section Header */}
        <div className={styles.header}>
          <p className={styles.label}>Selected Portfolio</p>
          <h2 id="portfolio-heading" className={styles.heading}>
            Cinematic Stories. Timeless Moments.
          </h2>
          <p className={styles.description}>
            Explore our curated portfolio of weddings, celebrations, intimate portraiture, and award-winning recognition.
          </p>
        </div>

        {/* 5-Category Editorial Portfolio Grid */}
        <div className={styles.portfolioGrid}>
          {/* Desktop Left Column (1.7fr): Hero Wedding Card */}
          {weddingCard && (
            <div className={styles.leftCol}>
              <PortfolioCategoryCard
                name={weddingCard.name}
                photoCount={weddingCard.photoCount}
                slug={weddingCard.slug}
                coverImage={weddingCard.coverImage}
                priority={weddingCard.priority}
                aspectRatio={weddingCard.aspectRatio}
                isHero={weddingCard.isHero}
              />
            </div>
          )}

          {/* Desktop Right Column (2x2 Grid): Haldi, Reception, Baby Shoot, Awards & Recognition */}
          <div className={styles.rightGrid}>
            {haldiCard && (
              <div className={styles.haldiItem}>
                <PortfolioCategoryCard
                  name={haldiCard.name}
                  photoCount={haldiCard.photoCount}
                  slug={haldiCard.slug}
                  coverImage={haldiCard.coverImage}
                  priority={haldiCard.priority}
                  aspectRatio={haldiCard.aspectRatio}
                />
              </div>
            )}

            {receptionCard && (
              <div className={styles.receptionItem}>
                <PortfolioCategoryCard
                  name={receptionCard.name}
                  photoCount={receptionCard.photoCount}
                  slug={receptionCard.slug}
                  coverImage={receptionCard.coverImage}
                  priority={receptionCard.priority}
                  aspectRatio={receptionCard.aspectRatio}
                />
              </div>
            )}

            {babyShootCard && (
              <div className={styles.babyShootItem}>
                <PortfolioCategoryCard
                  name={babyShootCard.name}
                  photoCount={babyShootCard.photoCount}
                  slug={babyShootCard.slug}
                  coverImage={babyShootCard.coverImage}
                  priority={babyShootCard.priority}
                  aspectRatio={babyShootCard.aspectRatio}
                  isBabyShoot={babyShootCard.isBabyShoot}
                />
              </div>
            )}

            {awardsCard && (
              <div className={styles.awardsItem}>
                <PortfolioCategoryCard
                  name={awardsCard.name}
                  photoCount={awardsCard.photoCount}
                  slug={awardsCard.slug}
                  coverImage={awardsCard.coverImage}
                  priority={awardsCard.priority}
                  aspectRatio={awardsCard.aspectRatio}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
