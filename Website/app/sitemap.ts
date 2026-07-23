import { MetadataRoute } from "next";
import { getPublishedCategories } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://impoo-digital-studio-c7n1-gilt.vercel.app";

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

  const categoryRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryRoutes,
  ];
}
