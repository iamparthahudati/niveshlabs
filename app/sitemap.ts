import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/public-articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  return [
    {
      url: "https://niveshlabs.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `https://niveshlabs.com/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
