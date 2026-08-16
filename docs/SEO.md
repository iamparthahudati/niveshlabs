# NiveshLabs — SEO & LLM / AI-Chat SEO Guide

Two goals, both required for the first release:

1. **Classic SEO** — rank in Google/Bing so people find NiveshLabs by searching.
2. **LLM SEO (a.k.a. GEO — Generative Engine Optimization)** — be findable and
   **citable** by AI assistants (ChatGPT, Claude, Gemini, Perplexity, Google AI
   Overviews) so that when someone asks them a finance question, they quote and
   link NiveshLabs.

This is the standard every public page in [ROADMAP.md](ROADMAP.md) must meet.

> The good news: the same foundations — clean semantic HTML, fast pages, clear
> facts, and structured data — serve **both** Google and the LLMs. Do the
> fundamentals well and you win both.

---

## 1. The mindset

- **Search engines and LLMs read your HTML, not your design.** Server-render real
  text. Never hide the important content behind JavaScript a crawler won't run.
  (Next.js server components already give us this — keep content server-rendered.)
- **Be the clearest, most trustworthy answer to a question.** LLMs and Google both
  reward pages that directly and factually answer a specific question.
- **E-E-A-T matters extra for finance** (Experience, Expertise, Authoritativeness,
  Trust). Finance is "Your Money or Your Life" content that Google judges strictly:
  show author, sources, dates, and disclaimers.

---

## 2. Per-page metadata (every public page)

Next.js Metadata API — you already do this well in `app/layout.tsx`. Each page
must set:

- **Title** — unique, ~50–60 chars, includes the main keyword.
  e.g. *"SIP Calculator — Estimate Your Mutual Fund Returns | NiveshLabs"*.
- **Meta description** — ~150–160 chars, compelling, includes the keyword.
- **Canonical URL** — the one true URL for this content (you set `alternates.canonical`
  — do it per page too, to avoid duplicate-content issues).
- **Open Graph + Twitter cards** — title, description, `og:image` (1200×630) for
  nice link previews (already set at the root — override per article).
- **`lang`** on `<html>` (you have `lang="en"`; use `en-IN` if you want to signal
  India).

**Per-page recipe (App Router):**
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  return {
    title: `${article.title} | NiveshLabs`,
    description: article.summary,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: { title: article.title, description: article.summary, type: "article" },
  };
}
```

---

## 3. Structured data (JSON-LD) — critical for both Google & LLMs

Structured data is hidden, machine-readable facts. Google uses it for rich
results; LLMs use it to extract clean facts to cite. Add a `<script
type="application/ld+json">` (build a small `components/seo/JsonLd` helper).

Ship these types:

- **Organization** (site-wide, in the layout) — name, url, logo, sameAs (your
  social profiles). Establishes the brand entity.
- **WebSite + SearchAction** (site-wide) — enables the sitelinks search box and
  tells engines your search URL.
- **Article** (every article) — `headline`, `description`, `datePublished`,
  `dateModified`, `author`, `publisher`, `image`, `mainEntityOfPage`.
- **BreadcrumbList** (article + tool pages) — the Home › Section › Page trail.
- **FAQPage** (tool pages, guides) — question/answer pairs. LLMs love these; they
  quote them almost verbatim.
- **SoftwareApplication** (calculator pages) — marks the page as a tool.

Validate everything at <https://search.google.com/test/rich-results> and
<https://validator.schema.org>.

---

## 4. Content structure (how to write a page that ranks & gets cited)

Structure content so both a skim-reader and a machine can extract the answer:

- **One `<h1>`** = the page's main question/topic. Then `<h2>`/`<h3>` sections in
  logical order (COMPONENTS.md §7 enforces heading order).
- **Answer the question in the first paragraph.** LLMs and Google's snippets pull
  the direct answer from near the top. Don't bury it.
- **Use lists, tables, and short paragraphs.** Machines extract these cleanly.
  (A calculator page: a "How it works" list, a formula, a worked-example table,
  an FAQ.)
- **Include the formula and a worked example** on each tool page — this is unique,
  quotable, high-value content.
- **Self-contained facts.** Write sentences that stand alone when quoted:
  *"A SIP of ₹5,000/month at 12% for 10 years grows to about ₹11.6 lakh."* An LLM
  can lift that as a citation.
- **Internal links** with descriptive anchor text between related tools/articles.
- **Show freshness:** visible published/updated dates (Google + LLMs favour
  current info). Update `dateModified` when you edit.
- **Author + sources:** a byline and links to authoritative sources (RBI, SEBI,
  AMFI) build the E-E-A-T that finance content needs.

---

## 5. LLM / AI-chat SEO (GEO) specifics

Beyond the above, to get cited by AI assistants:

- **`/llms.txt`** — a plain-text/markdown file at the site root that gives LLMs a
  clean guide to your best content and what the site is. (Emerging convention,
  cheap to add.) Add a route:
  ```text
  app/llms.txt/route.ts  →  returns text/plain describing NiveshLabs + key links
  ```
  Include: what NiveshLabs is, that it's finance **education** for India, and a
  linked list of your best pages (calculators, key guides).
- **Don't block AI crawlers you want citations from.** Your `robots.ts` currently
  allows all — that's fine for visibility. If you later want to *exclude* some AI
  training bots but keep answer-engine citation, do it deliberately (e.g. allow
  `OAI-SearchBot`/`PerplexityBot` for citations, decide separately on `GPTBot`).
  For a new site chasing reach, **allowing them is the right call for v1.**
- **Clean, crawlable HTML with real text** (again): answer engines fetch and parse
  the page live. No content = no citation.
- **FAQ + Q&A framing.** Phrase headings as the questions people actually ask
  ("How is SIP return calculated?"). LLMs match on questions.
- **Structured data (again):** `FAQPage`, `Article`, `Organization` give LLMs
  high-confidence facts to quote.
- **Consistent entity identity:** same name, description, and links everywhere
  (site, structured data, social) so LLMs form a clear picture of "NiveshLabs".
- **Get referenced elsewhere:** mentions/links from other reputable finance sites
  raise the odds LLMs learn and trust your brand. (Longer-term, but start now.)

---

## 6. Technical SEO (the plumbing)

- **`sitemap.xml`** — you have `app/sitemap.ts` (includes articles). Keep it to
  **published** URLs only. Add tool/calculator pages as they ship.
- **`robots.txt`** — you have `app/robots.ts`, points to the sitemap. Good.
- **RSS/Atom feed** — add `app/feed.xml/route.ts` for articles. Helps distribution
  and some answer engines.
- **Canonical + no duplicate content** — one URL per piece; redirect
  `www`→apex (or vice-versa) and trailing-slash variants consistently.
- **Clean URLs** — `/calculators/sip`, `/articles/what-is-a-mutual-fund`. No ids,
  no query junk. Slugs are stable (don't change a published slug; if you must,
  301-redirect the old one).
- **HTTPS** (also a ranking signal) — Phase 7.
- **404/500 pages** — helpful `not-found` and error pages so crawlers get correct
  status codes.
- **International signal (optional):** `hreflang`/`en-IN` if you target India
  specifically.

---

## 7. Performance & accessibility (they ARE ranking factors)

Google ranks on **Core Web Vitals** and mobile usability; accessible pages are
also more machine-readable.

- **Core Web Vitals targets:** LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **Images:** use `next/image`, correct sizes, lazy-load below the fold, set
  width/height to avoid layout shift.
- **Fonts:** you use `next/font` (self-hosted, no layout shift) — good.
- **Ship less JavaScript:** prefer server components; only hydrate interactive
  bits (calculators). Static content stays static.
- **Accessibility:** follow COMPONENTS.md §7 (semantic HTML, keyboard, contrast,
  labels, alt text). Run Lighthouse and `axe`.

Target: Lighthouse **Performance, SEO, Best-Practices, Accessibility ≥ 90** on
mobile for every public page.

---

## 8. Off-page & measurement (set up at launch)

- **Google Search Console** — verify the domain, submit `sitemap.xml`, watch for
  coverage/indexing errors and search queries.
- **Bing Webmaster Tools** — verify + submit sitemap (Bing also feeds some AI
  answer engines).
- **Analytics** — a privacy-respecting analytics tool so you see what pages get
  traffic (respect the privacy rules; prefer cookieless if possible).
- **Track LLM referrals** — watch your logs/analytics for referrers like
  `chat.openai.com`, `perplexity.ai`, `gemini.google.com` to see GEO working.

---

## 9. Per-page SEO checklist (Definition of done for any public page)

- [ ] Unique `<title>` (~55 chars) + meta description (~155 chars) with the keyword.
- [ ] Canonical URL set.
- [ ] Open Graph + Twitter card (with an image).
- [ ] Exactly one `<h1>`; headings in logical order.
- [ ] The main question is answered in the first paragraph.
- [ ] At least one JSON-LD block (Article / FAQ / SoftwareApplication as fits),
      validated in Rich Results test.
- [ ] Content server-rendered; readable with JavaScript off.
- [ ] Descriptive internal links to/from related pages.
- [ ] Visible author + published/updated date (for articles & guides).
- [ ] Finance disclaimer present where there are figures/tools.
- [ ] In `sitemap.xml` (if public & published); not in it if draft.
- [ ] Lighthouse SEO + Accessibility ≥ 90 on mobile.

---

## 10. What we already have (good starting point)

From the current repo:
- `app/layout.tsx` — solid root metadata: title, description, `metadataBase`,
  canonical, Open Graph, Twitter, icons. ✅
- `app/sitemap.ts` — dynamic sitemap including published articles. ✅
- `app/robots.ts` — robots pointing to the sitemap. ✅
- Semantic HTML + `sr-only` labels in the header. ✅
- `next/font` for fast, shift-free fonts. ✅

**Next SEO steps (as pages are built):** per-page `generateMetadata`, JSON-LD
helper + Article/FAQ/Organization data, an RSS feed, `/llms.txt`, and the
Lighthouse pass in Phase 5.
</content>
