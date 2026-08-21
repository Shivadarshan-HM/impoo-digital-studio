import { MetadataRoute } from "next";
import { getPublishedCategories } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://impodigitalstudio.com";

const DEFAULT_SLUGS = [
  "wedding",
  "haldi",
  "reception",
  "baby-shoot",
  "awards-recognition",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs = DEFAULT_SLUGS;

  try {
    const categories = await getPublishedCategories();
    if (categories && categories.length > 0) {
      const fetchedSlugs = categories.map((c) => c.slug);
      slugs = Array.from(new Set([...DEFAULT_SLUGS, ...fetchedSlugs]));
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic categories for sitemap, using default slugs:", err);
  }

  const currentDate = new Date();

  const categoryRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/portfolio/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryRoutes,
  ];
}

