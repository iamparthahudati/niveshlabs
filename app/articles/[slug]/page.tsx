import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticle } from "@/lib/public-articles";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return article
    ? { title: `${article.title} — NiveshLabs`, description: article.summary }
    : { title: "Article not found — NiveshLabs" };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const safeContent = sanitizeHtml(article.content, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "p", "br", "strong", "b", "em", "i", "u", "s",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "figure", "figcaption", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="article-page">
        <article>
          <Link className="article-back" href="/">← All articles</Link>
          <header className="article-hero">
            <p className="section-kicker">NIVESHLABS GUIDE</p>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
            <time dateTime={article.publishedAt}>Published {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))}</time>
          </header>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
        </article>
      </main>
    </>
  );
}
