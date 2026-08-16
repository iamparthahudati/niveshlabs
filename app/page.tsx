import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/public-articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getPublishedArticles();

  return (
    <>
      <SiteHeader />
      <main className="public-main" aria-label="NiveshLabs homepage content">
        <section className="home-hero">
          <p className="section-kicker">SMARTER MONEY, SIMPLIFIED</p>
          <h1>Learn to make confident financial decisions.</h1>
          <p>Clear, practical guides for investing, saving and understanding the markets.</p>
        </section>

        <section className="latest-articles" id="learn">
          <div className="section-heading">
            <div><p className="section-kicker">LATEST INSIGHTS</p><h2>Fresh from NiveshLabs</h2></div>
            <span>{articles.length} {articles.length === 1 ? "article" : "articles"}</span>
          </div>

          {articles.length === 0 ? (
            <div className="public-empty"><h3>Articles are on the way.</h3><p>Published posts will appear here automatically.</p></div>
          ) : (
            <div className="article-card-grid">
              {articles.map((article, index) => (
                <Link className="article-card" href={`/articles/${article.slug}`} key={article.id}>
                  <span className={`article-card-art art-${index % 3}`} aria-hidden="true"><i>N</i></span>
                  <span className="article-card-body">
                    <small>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(article.publishedAt))}</small>
                    <strong>{article.title}</strong>
                    <span>{article.summary}</span>
                    <em>Read article <b aria-hidden="true">→</b></em>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
