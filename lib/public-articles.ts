import "server-only";

export type PublicArticle = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
};

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function getPublishedArticles(): Promise<PublicArticle[]> {
  try {
    const response = await fetch(`${backendUrl}/api/articles`, { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string): Promise<PublicArticle | null> {
  try {
    const response = await fetch(`${backendUrl}/api/articles/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
