# NiveshLabs — First Release Roadmap

This is the **master plan** for the first public release of NiveshLabs. It is
written to be read top to bottom. Every phase is small on purpose, so you always
understand the whole system in your head.

Three companion documents go deeper on the hard parts. Read them when the
roadmap points you to them:

- [BACKLOG.md](BACKLOG.md) — the trackable, checkbox task list organized by phase.
- [COMPONENTS.md](COMPONENTS.md) — how we build the UI, one small piece at a time.
- [SECURITY.md](SECURITY.md) — how we make it "pen-test proof / hacking proof".
- [SEO.md](SEO.md) — classic SEO **and** LLM / AI-chat (GEO) SEO.

---

## 0. What "first release" means

The first release is **not** the full dashboard in the design mockup. Trying to
build all of that at once is how projects die. The first release is the smallest
thing that is:

1. **Real** — a live site at `niveshlabs.com` that a stranger can use.
2. **Trustworthy** — hardened, no obvious way to hack it, correct legal
   disclaimers.
3. **Findable** — ranks in Google *and* can be cited by ChatGPT / Claude / Gemini.
4. **Editable by you** — an admin panel at `niveshlabs.com/admin` where you
   publish articles.
5. **Extendable** — built so the market dashboard, more tools, and accounts can
   be added later without a rewrite.

### First release scope (the finish line)

| Area | In first release | Deliberately later |
| --- | --- | --- |
| Public site | Home, article list, article page, calculators, static "learn" pages, legal pages | Personalized dashboard, user accounts, portfolios |
| Tools | SIP, EMI, FD, Income-Tax calculators (client-side, no login) | Live goal planning, saved calculations |
| Market data | A **static/sample** market strip + a clearly-labelled snapshot | Real-time streaming quotes, charts, gainers/losers |
| Content | Articles via admin CMS (already started) | Comments, newsletters, tags/search |
| Admin | Login, create/edit/publish articles | Roles, audit log UI, media library |
| Backend | Java + Spring Boot: health, auth, articles | Payments, external market-data ingestion |

> **Rule of the project:** if a feature is not on the "in first release" list,
> it goes in a `docs/BACKLOG.md` note and we do not build it yet.

### The two non-negotiables you asked for

These are not a phase you do at the end. They are a **standard every phase must
meet** before it is called done:

- **Hacking-proof:** every new endpoint and form is checked against
  [SECURITY.md](SECURITY.md) before merge. No exceptions.
- **SEO + LLM SEO:** every new public page ships with metadata, structured data,
  and clean semantic HTML per [SEO.md](SEO.md). A page with no SEO is not "done".

---

## 1. How we work (so it stays in your understanding)

**One small component at a time.** We never build a whole page in one go. We
build the smallest visible piece, look at it in the browser, understand it, then
compose bigger pieces out of the small ones. Full method in
[COMPONENTS.md](COMPONENTS.md).

**The loop for every task:**

1. Write down *what* the piece is and *why* it exists (one sentence).
2. Build only that piece.
3. Run it: `npm run dev` and look at it.
4. Check it against the phase's "Definition of done".
5. Commit with a message that explains the *why*, not just the *what*.
6. Move to the next piece.

**Branch + commit discipline**

- `main` stays deployable at all times.
- One feature = one branch = one small pull request.
- Commit messages: `area: what changed (why)` — e.g.
  `header: extract MarketStrip into its own component (reuse on all pages)`.

**Testing baseline (must stay green)**

```bash
npm test            # lint + frontend project checks
npm run build       # must compile with no type errors
npm run test:backend
```

If any of these are red, the task is not done.

---

## 2. Environments

We keep three clearly separated environments so nothing on your laptop can leak
into production.

| Environment | Where | Data | Purpose |
| --- | --- | --- | --- |
| **Local** | your Mac | H2 in-memory or local Postgres | day-to-day building |
| **Staging** | `staging.niveshlabs.com` on the VPS | its own Postgres | test the real thing before users see it |
| **Production** | `niveshlabs.com` on the VPS | production Postgres, backups on | the live site |

Rules:
- Secrets (admin password, DB password, session keys) live **only** in
  environment variables on each machine, never in git. See `SECURITY.md §2`.
- We always deploy **local → staging → production**. Never straight to prod.
- Production and staging use **different** passwords and secrets.

---

## 3. The phases

Each phase is a couple of days of focused work, not weeks. Do them in order.
Each has a **goal**, the **small pieces** inside it, and a **Definition of
done** (DoD) you must satisfy before moving on.

---

### Phase 0 — Foundations & guardrails

**Goal:** the ground is solid before we build on it. No feature work here.

Pieces:
1. **Confirm the local stack runs** — frontend on 3000, backend on 8080, DB
   reachable (README already documents this).
2. **Secrets hygiene** — verify `.gitignore` excludes `.env*`, verify no secret
   is committed. (`SECURITY.md §2`.)
3. **Baseline CI** — a script/GitHub Action that runs `npm test`,
   `npm run build`, and `npm run test:backend` on every push.
4. **Security headers scaffold** — add a single place (Next.js `next.config.ts`
   headers + a Spring `SecurityConfig`) where all security headers live.
   (`SECURITY.md §4`.)
5. **Error/observability basics** — decide now: where do logs go, how do you see
   a 500 error in production. Even a simple file log + `journald` is fine for v1.

DoD:
- [ ] `npm test`, `npm run build`, `npm run test:backend` all green.
- [ ] No secret anywhere in git history (`SECURITY.md §2` check passes).
- [ ] CI runs on push and is green.
- [ ] Security headers present on a curl of the homepage (`SECURITY.md §4`).

---

### Phase 1 — Design system & core layout

**Goal:** a small, consistent set of building blocks and the page shell that
every page reuses. This is where "header component first, then show all the
header" happens.

Read [COMPONENTS.md](COMPONENTS.md) fully before this phase.

Pieces (smallest → biggest):
1. **Design tokens** — colours, spacing, font sizes, radius as CSS variables in
   `globals.css`. One source of truth. (You already have fonts + some CSS.)
2. **Primitives** — `Button`, `Link/NavLink`, `Card`, `Container`, `Icon`.
3. **Header, decomposed** — split today's `site-header.tsx` into:
   `Brand`, `MarketStrip`, `PrimaryNav`, `SearchForm`, `AccountButton`,
   `MobileMenu`. Assemble them back into `SiteHeader`.
4. **Footer** — with the mandatory market-risk disclaimer and legal links.
5. **Page shell** — a layout that puts header + `<main>` + footer around any
   page, so a new page is "just the middle".

DoD:
- [ ] Header renders on every page from the shared shell.
- [ ] Every colour/spacing value comes from a token, none hard-coded ad-hoc.
- [ ] Keyboard-only navigation works through the header (a11y — `SEO.md §6`).
- [ ] Mobile menu opens/closes and is reachable by keyboard.

---

### Phase 2 — Content backbone (articles)

**Goal:** you can log in at `/admin`, write an article, publish it, and it
appears on the public site with correct SEO. Much of this exists already —
this phase is to *finish and harden* it.

Pieces:
1. **Backend: Article model + repository + migration** — exists
   (`article/`, `V1__initial_schema.sql`). Verify fields: `title`, `slug`,
   `summary`, `body`, `status`, `publishedAt`, `updatedAt`, SEO fields
   (meta description, canonical, optional OG image).
2. **Backend: public read API** — `GET /api/articles`, `GET /api/articles/{slug}`,
   published-only. (`PublicArticleController`.)
3. **Backend: admin write API** — create/update/publish, **auth required + CSRF**
   (`AdminArticleController`, `SecurityConfig`). Check against `SECURITY.md §5`.
4. **Public pages** — home list + `articles/[slug]`. Add per-article metadata,
   canonical URL, and `Article` structured data (`SEO.md §3`).
5. **Admin pages** — login, list, new, edit (exist under `app/admin`). Harden
   the editor's HTML sanitisation (`SECURITY.md §6` — you already use
   `sanitize-html`, we lock down the allow-list).

DoD:
- [ ] Draft articles are invisible on the public site and in the sitemap.
- [ ] Published article page has title, meta description, canonical, OG tags,
      and JSON-LD `Article` (validate with Google Rich Results test).
- [ ] Admin write endpoints reject requests without a valid session + CSRF token.
- [ ] Article body is sanitised on the way in *and* rendered safely.
- [ ] Sitemap and RSS include only published articles.

---

### Phase 3 — Tools & calculators

**Goal:** the first genuinely useful, shareable pages — finance calculators.
These are pure client-side (no login, no personal data stored), which makes them
safe and great for SEO.

Build them one at a time, in this order:
1. **SIP calculator** — build the calculation function first (pure, tested),
   then the form, then the result, then the page.
2. **EMI calculator**
3. **FD calculator**
4. **Income-Tax estimator** (label clearly: "estimate, not tax advice").

For **each** calculator (this is the repeating recipe):
- Pure calc function in `lib/` with unit tests (numbers must be correct).
- A small `CalculatorForm` + `ResultCard` component.
- A dedicated page `/calculators/<name>` with:
  - Full explainer content (what it is, formula, worked example) — this is what
    ranks and what LLMs cite (`SEO.md §4`, §5).
  - `FAQPage` + `HowTo`/`SoftwareApplication` structured data where it fits.
  - Correct metadata + canonical.
- A "Popular calculators" grid linking them together (internal linking helps SEO).

DoD (per calculator):
- [ ] Calc function has tests covering normal + edge cases (0, huge, decimals).
- [ ] Works with JavaScript computing on the client; page content is server-
      rendered so crawlers/LLMs see the explainer text without running JS.
- [ ] Page passes Lighthouse SEO + a11y ≥ 95.
- [ ] Has FAQ structured data validated in Rich Results test.

---

### Phase 4 — Market data surfaces (safe v1)

**Goal:** show the market strip / snapshot from the mockup — but **honestly**.
For the first release we do **not** stream live money data (that is legally and
technically heavy). We ship a clearly-labelled snapshot.

Pieces:
1. **Static/sample strip** — keep today's market strip but label it
   ("Sample data" / "As on <date>") so no one mistakes it for live prices.
2. **A single server-side snapshot** (optional) — if you add a data source,
   fetch it **server-side on a schedule/cache**, never expose provider keys to
   the browser (`SECURITY.md §7`). Add the source's required attribution.
3. **Disclaimers** — the SEBI-style "investments are subject to market risks"
   line in the footer and near any numbers.

DoD:
- [ ] No market number is presented as live unless it genuinely is.
- [ ] No third-party API key is reachable from the browser or the page source.
- [ ] Disclaimer visible on every page with financial figures.

> We are a finance **education** site. We never give personalized investment
> advice. Every tool and figure carries the appropriate disclaimer.

---

### Phase 5 — SEO + LLM/AI-chat SEO pass

**Goal:** make sure Google ranks us and AI assistants can cite us. Do this as a
dedicated pass once real content exists.

Follow [SEO.md](SEO.md) end to end. Highlights:
- Titles, meta descriptions, canonicals on every page.
- `sitemap.xml` (exists) + `robots.txt` (exists) + RSS feed.
- Structured data (Organization, WebSite+SearchAction, Article, FAQ, Breadcrumb).
- An **`/llms.txt`** file and content written so LLMs can quote clean facts
  (`SEO.md §5`).
- Performance (Core Web Vitals) and accessibility, which are ranking factors.

DoD:
- [ ] Every public URL returns valid metadata + at least one JSON-LD block.
- [ ] Google Search Console + Bing Webmaster verified; sitemap submitted.
- [ ] `/llms.txt` present and accurate.
- [ ] Lighthouse: Performance, SEO, Best-Practices, a11y all ≥ 90 on mobile.

---

### Phase 6 — Security hardening & pen-test pass

**Goal:** actively try to break your own site before anyone else does.

Follow [SECURITY.md](SECURITY.md) end to end. This phase is where you run the
full checklist and the automated + manual tests.

Pieces:
- Run automated scanners (OWASP ZAP baseline, `npm audit`, dependency scan,
  `trivy` on the Docker images). (`SECURITY.md §9`.)
- Manually test the admin panel: auth bypass, CSRF, session fixation, IDOR
  (can you edit article `2` while logged in as someone who shouldn't?).
- Verify rate limiting on login, security headers, and TLS config.
- Write down every finding and fix it. Re-test.

DoD:
- [ ] OWASP ASVS Level 1 items in `SECURITY.md` all checked.
- [ ] ZAP baseline scan shows no high/medium alerts.
- [ ] `npm audit` and backend dependency scan show no high/critical.
- [ ] Admin panel survives the manual attack checklist in `SECURITY.md §11`.

---

### Phase 7 — Launch readiness

**Goal:** go live with confidence and be able to recover if something breaks.

Pieces:
1. **Backups** — automated nightly Postgres dump, tested restore.
2. **Monitoring/uptime** — a simple uptime check + `/api/health` alert.
3. **TLS + reverse proxy** — the `infra/Caddyfile` direction; HTTPS everywhere,
   HSTS on (`SECURITY.md §4`, §8).
4. **Deploy to staging** — run the whole checklist there first.
5. **Go-live** — point `niveshlabs.com` at production, submit sitemap, announce.
6. **Post-launch watch** — check logs, Search Console, and error rates daily for
   the first week.

DoD (launch checklist):
- [ ] Staging mirrors production and passed all earlier DoDs.
- [ ] HTTPS with a valid cert; HTTP redirects to HTTPS; HSTS present.
- [ ] Nightly backup runs and a restore has been tested at least once.
- [ ] Health check + uptime alert wired to your email/phone.
- [ ] Rollback plan written (how to revert to the previous release).

---

## 4. Definition of "done" for the whole first release

The first release ships only when **all** of these are true:

- [ ] Home, article list, an article, all four calculators, and legal pages are
      live at `niveshlabs.com` over HTTPS.
- [ ] `niveshlabs.com/admin` lets you log in and publish an article that appears
      publicly with correct SEO.
- [ ] Security: `SECURITY.md` checklist fully green; pen-test pass done.
- [ ] SEO: `SEO.md` checklist fully green; verified in Search Console; `/llms.txt`
      live.
- [ ] Backups + monitoring on; rollback plan exists.
- [ ] `npm test`, `npm run build`, `npm run test:backend` green on `main`.

---

## 5. What we intentionally leave for release 2+

Written here so you are never tempted to build them early:

- User accounts, login for the public, portfolios, watchlists.
- Real-time streaming market data, charts, gainers/losers.
- Newsletter, comments, article search and tags.
- Payments / subscriptions / premium content.
- Mobile app.

When you want one of these, it becomes its own roadmap, built the same way:
small components, security + SEO as a standard, one phase at a time.

---

## 6. Glossary (plain words)

- **Component:** a small, reusable piece of UI (a button, the header).
- **Structured data / JSON-LD:** hidden machine-readable facts on a page that
  Google and LLMs read to understand it.
- **GEO / LLM SEO:** making your content easy for AI chat assistants to find and
  cite, not just for Google.
- **CSRF:** an attack where another site tricks your browser into making a
  request to ours; we block it with tokens.
- **XSS:** injecting malicious HTML/JS into a page; we block it by sanitising
  and escaping.
- **IDOR:** accessing data you shouldn't by changing an id in the URL; we block
  it with ownership/permission checks.
- **Core Web Vitals:** Google's speed/stability scores that affect ranking.
- **HSTS:** a header that forces browsers to always use HTTPS for our domain.
</content>
</invoke>
