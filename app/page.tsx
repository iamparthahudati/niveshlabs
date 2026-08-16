import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedArticles } from "@/lib/public-articles";

export const dynamic = "force-dynamic";

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://niveshlabs.com/#organization",
      name: "NiveshLabs",
      url: "https://niveshlabs.com",
      logo: "https://niveshlabs.com/favicon.svg",
      description:
        "Track Indian markets, explore mutual funds, compare credit cards and use practical finance calculators.",
    },
    {
      "@type": "WebSite",
      "@id": "https://niveshlabs.com/#website",
      url: "https://niveshlabs.com",
      name: "NiveshLabs",
      publisher: { "@id": "https://niveshlabs.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://niveshlabs.com/search?query={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function Home() {
  const articles = await getPublishedArticles();

  return (
    <PageShell mainLabel="NiveshLabs homepage content">
      <JsonLd schema={homeSchema} id="home-structured-data" />
      <div className="public-main">
        <section className="home-hero">
          <Container size="default">
            <p className="section-kicker">SMARTER MONEY, SIMPLIFIED</p>
            <h1>Learn to make confident financial decisions.</h1>
            <p>
              Clear, practical guides for investing, saving and understanding
              the markets.
            </p>
          </Container>
        </section>

        <section className="latest-articles" id="learn">
          <Container size="default">
            <div className="section-heading">
              <div>
                <p className="section-kicker">LATEST INSIGHTS</p>
                <h2>Fresh from NiveshLabs</h2>
              </div>
              <Tag variant="indigo" size="md">
                {articles.length} {articles.length === 1 ? "article" : "articles"}
              </Tag>
            </div>

            {articles.length === 0 ? (
              <div className="public-empty">
                <h3>Articles are on the way.</h3>
                <p>Published posts will appear here automatically.</p>
              </div>
            ) : (
              <div className="article-card-grid">
                {articles.map((article, index) => (
                  <Link
                    className="article-card"
                    href={`/articles/${article.slug}`}
                    key={article.id}
                  >
                    <span
                      className={`article-card-art art-${index % 3}`}
                      aria-hidden="true"
                    >
                      <i>N</i>
                    </span>
                    <span className="article-card-body">
                      <small>
                        {new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(article.publishedAt))}
                      </small>
                      <strong>{article.title}</strong>
                      <span>{article.summary}</span>
                      <em>
                        Read article <b aria-hidden="true">→</b>
                      </em>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </section>
      </div>
    </PageShell>
  );
}
