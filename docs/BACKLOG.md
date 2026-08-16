# NiveshLabs — First Release Backlog

This is the **working task list** for the first release. It follows the phase
structure you proposed, refined slightly. Tick the boxes as you go.

- The **why / how / standards** live in [ROADMAP.md](ROADMAP.md),
  [COMPONENTS.md](COMPONENTS.md), [SECURITY.md](SECURITY.md), [SEO.md](SEO.md).
- This file is the **what** — the ordered checklist.

> **Two rules that apply to EVERY task below** (the "Definition of Done" for the
> whole project). A task is not done until both are true:
> 1. **SEO + LLM-SEO proved** — passes the per-page checklist in [SEO.md §9](SEO.md).
> 2. **Security proved** — passes the relevant items in [SECURITY.md](SECURITY.md).
>
> See [§ Cross-cutting standards](#cross-cutting-standards-apply-to-every-phase)
> at the bottom — these are not a phase, they are a standard.

### Phase order (refined from your idea)

| Phase | Name | Why here |
| --- | --- | --- |
| 0 | Foundation & setup | ground must be solid first |
| 1 | Components (design system) | everything else is built from these |
| 2 | Calculators (2.1, 2.2, …) | self-contained, high-SEO, no login — best early wins |
| 3 | Home screen | composes components + links to calculators/articles |
| 4 | Admin panel | mostly exists in code — this phase *finishes & hardens* it |
| 5 | Content (2 months) | needs the admin panel working first |
| 6 | SEO/LLM hardening + publish/launch | submit, verify, go live |

> Small change I made vs your draft: I merged your "Publishing" into a combined
> **SEO-hardening + launch** phase, because publishing content and getting it
> ranked/cited are the same push. Everything else keeps your ordering.

---

## Phase 0 — Foundation & setup

**Goal:** the repo, environments, and guardrails are ready. No feature work.

- [ ] Confirm local stack runs (frontend 3000, backend 8080, DB reachable).
- [ ] Secrets hygiene verified — no secret in git, `.env*` ignored ([SECURITY.md §2](SECURITY.md)).
- [ ] CI runs `npm test`, `npm run build`, `npm run test:backend` on every push.
- [ ] Central security-headers config (Next.js + Spring) scaffolded ([SECURITY.md §4](SECURITY.md)).
- [ ] Design tokens file (colours, spacing, fonts, radius as CSS variables).
- [ ] Decide + document folder structure (`components/ui`, `header`, `seo`, `lib`, …).
- [ ] `docs/BACKLOG.md` (this file) is the single source of task truth.

**DoD:** all three test commands green; CI green; no secrets tracked; headers
present on a curl of the homepage.

---

## Phase 1 — Components (design system)

**Goal:** the small, reusable building blocks + the page shell. Build tiny pieces
first, compose upward. Full method in [COMPONENTS.md](COMPONENTS.md).

**UI primitives (atoms)**
- [ ] `Button`
- [ ] `Link` / `NavLink` (with active state)
- [ ] `Input`, `Select`, `Field` (label + input + error)
- [ ] `Card`
- [ ] `Container` (max-width wrapper)
- [ ] `Icon`
- [ ] `Tag` / `Badge` (e.g. risk level, category)

**Header (decompose the existing `site-header.tsx`)**
- [ ] `Brand`
- [ ] `MarketStrip` + `MarketItem` (keep the honest "Sample data" label)
- [ ] `PrimaryNav`
- [ ] `SearchForm`
- [ ] `AccountButton`
- [ ] `MobileMenu`
- [ ] `SiteHeader` (assembles the above)

**Footer & shell**
- [ ] `Disclaimer` (market-risk line — mandatory on every page with figures)
- [ ] `LegalLinks` (privacy, terms, disclaimer, contact)
- [ ] `Footer`
- [ ] `PageShell` (header + `<main id="main">` + footer + skip-link)

**SEO helpers**
- [ ] `seo/JsonLd` (renders structured data)
- [ ] `seo/Breadcrumbs`

**DoD:** header/footer render on every page via `PageShell`; all values from
tokens; keyboard + screen-reader navigable; passes [COMPONENTS.md §7](COMPONENTS.md) checklist.

---

## Phase 2 — Calculators

**Goal:** each calculator is its **own page**, built separately, but all reuse a
shared shell. This is the repeatable recipe — do it once, repeat per calculator.

**Shared groundwork (build once, before 2.1)**
- [ ] `lib/calculators/` — folder for pure math functions (tested, no UI).
- [ ] `components/calculators/CalculatorForm` (generic input shell).
- [ ] `components/calculators/ResultCard` (generic result display).
- [ ] `components/calculators/ToolCard` + `ToolGrid` (for listing tools).
- [ ] `lib/tools.ts` — **one registry array** of all tools (drives the grid,
      the `/calculators` index, internal links, and the sitemap). *(future-scope:
      add a new calculator by adding one entry.)*
- [ ] `/calculators` index page listing all tools via `ToolGrid`.

**The recipe for EACH calculator (2.x)** — every sub-phase repeats this:
1. [ ] Pure math function in `lib/calculators/<name>.ts` + unit tests
       (normal + edge cases: 0, huge, decimals).
2. [ ] Page `/calculators/<name>` using `CalculatorForm` + `ResultCard`.
3. [ ] Server-rendered explainer content: what it is, the **formula**, a
       **worked example** (table), and an **FAQ** (this is what ranks & gets cited).
4. [ ] Metadata: unique title, meta description, canonical.
5. [ ] Structured data: `SoftwareApplication` + `FAQPage` (validate in Rich Results).
6. [ ] Add entry to `lib/tools.ts` (auto-appears in grid + sitemap).
7. [ ] Lighthouse SEO + a11y ≥ 90 on mobile.

### Calculators — first release set

- [ ] **Phase 2.1 — SIP Calculator** (`/calculators/sip`)
- [ ] **Phase 2.2 — Lumpsum Calculator** (`/calculators/lumpsum`) *(shares SIP math family)*
- [ ] **Phase 2.3 — SWP Calculator** (`/calculators/swp`)
- [ ] **Phase 2.4 — EMI Calculator** (`/calculators/emi`)
- [ ] **Phase 2.5 — FD Calculator** (`/calculators/fd`)
- [ ] **Phase 2.6 — RD Calculator** (`/calculators/rd`)
- [ ] **Phase 2.7 — PPF Calculator** (`/calculators/ppf`)
- [ ] **Phase 2.8 — Income Tax Estimator** (`/calculators/income-tax`) *(label: estimate, not tax advice)*

> Ordering note: I put **Lumpsum right after SIP** because they share the same
> compounding math — you'll reuse most of the function. **EMI** next (most-searched
> loan tool), then the deposit family (FD/RD/PPF), then Income Tax (most complex).

### Calculators — backlog (Release 2+, future scope)

Add later using the exact same recipe; `lib/tools.ts` makes each a one-entry add:

- [ ] Step-up SIP, Goal SIP, Retirement / NPS, CAGR, Inflation, Compound Interest,
      Gratuity, HRA exemption, Home-loan eligibility, Credit-card EMI.

**Phase 2 DoD:** every shipped calculator passes the 7-step recipe; `/calculators`
index links them all; all math has tests; all pages pass SEO + a11y ≥ 90.

---

## Phase 3 — Home screen

**Goal:** the homepage from the design, composed from Phase-1 components and
linking out to calculators (Phase 2) and articles (Phase 5).

- [ ] `Hero` section.
- [ ] "Popular calculators" section (reuse `ToolGrid` from Phase 2 — no new code).
- [ ] "Latest insights / articles" section (reuse `ArticleList`).
- [ ] "Learn finance" cards section.
- [ ] Market snapshot section (honest/sample-labelled — [ROADMAP.md Phase 4](ROADMAP.md)).
- [ ] Home metadata + `Organization` + `WebSite`+`SearchAction` JSON-LD ([SEO.md §3](SEO.md)).
- [ ] Internal links from home → every calculator + top articles (SEO juice).

**DoD:** home renders server-side; all sections reuse existing components; passes
SEO + a11y ≥ 90; every "View all"/card links to a real URL (no dead `#anchors`).

---

## Phase 4 — Admin panel (finish & harden)

**Goal:** `niveshlabs.com/admin` — log in, write, publish. Backend + pages
**already exist** in the repo, so this phase is mostly *completing and securing*.

- [ ] Confirm `Article` model has SEO fields (slug, meta description, canonical,
      optional OG image, published/updated dates).
- [ ] Public read API: `GET /api/articles`, `GET /api/articles/{slug}` (published only).
- [ ] Admin write API: create/update/publish — **auth + CSRF required** ([SECURITY.md §3,§5](SECURITY.md)).
- [ ] Admin pages: login, list, new, edit (harden the editor).
- [ ] **Lock down HTML sanitisation** allow-list in the editor ([SECURITY.md §6](SECURITY.md)).
- [ ] Rate-limit `/admin/login`; generic login errors ([SECURITY.md §3](SECURITY.md)).
- [ ] IDOR check: can't edit records you shouldn't by changing the id ([SECURITY.md §7](SECURITY.md)).
- [ ] Draft articles invisible on public site **and** sitemap.

**DoD:** unauthenticated requests to any admin API are blocked; writes need
session + CSRF; article body sanitised in and rendered safe out; passes the
admin items of the [SECURITY.md §11](SECURITY.md) manual checklist.

---

## Phase 5 — Content (first 2 months)

**Goal:** enough high-quality, SEO/LLM-optimised articles that the site is worth
ranking and citing. Written through the admin panel from Phase 4.

- [ ] Article template checklist (per [SEO.md §4](SEO.md)): one `<h1>`, answer-first
      intro, headings in order, lists/tables, FAQ, author byline, sources, dates.
- [ ] Per-article metadata + `Article` + `BreadcrumbList` JSON-LD.
- [ ] Plan ~8–12 cornerstone articles (2 months) around your calculators &
      "learn" topics, e.g.:
  - [ ] What is a Mutual Fund?
  - [ ] What is SIP and how does it work? (links the SIP calculator)
  - [ ] SIP vs Lumpsum — which is better?
  - [ ] What is an EMI and how is it calculated? (links the EMI calculator)
  - [ ] FD vs RD vs PPF — where to park safe money
  - [ ] What is SWP and who is it for?
  - [ ] Income tax basics (old vs new regime)
  - [ ] What is inflation and how it eats returns
  - [ ] How to build an emergency fund
  - [ ] Understanding NIFTY & SENSEX
- [ ] Internal-link every article to its related calculator and 2–3 sibling articles.
- [ ] RSS feed (`app/feed.xml`) includes published articles.

**DoD:** each article passes [SEO.md §9](SEO.md); each links to a relevant tool;
all appear in sitemap + RSS; drafts stay hidden.

---

## Phase 6 — SEO/LLM hardening + publish/launch

**Goal:** ship it, get it indexed by Google, and citable by AI assistants.

**SEO / LLM final pass**
- [ ] Every public URL: metadata + ≥1 JSON-LD block (validated).
- [ ] `sitemap.xml` (tools + articles), `robots.txt`, RSS all correct.
- [ ] **`/llms.txt`** live and accurate ([SEO.md §5](SEO.md)).
- [ ] Google Search Console + Bing Webmaster verified; sitemap submitted.
- [ ] Lighthouse Perf/SEO/Best-Practices/a11y ≥ 90 on mobile, every page.
- [ ] Analytics + LLM-referral tracking set up ([SEO.md §8](SEO.md)).

**Security pen-test pass**
- [ ] Automated scans clean: `npm audit`, dependency scan, `trivy`, ZAP baseline
      ([SECURITY.md §9](SECURITY.md)).
- [ ] Full manual pen-test checklist green ([SECURITY.md §11](SECURITY.md)).

**Launch**
- [ ] Deploy to `staging.niveshlabs.com`; run the whole checklist there.
- [ ] HTTPS + HSTS; HTTP→HTTPS redirect; app ports & Postgres not public.
- [ ] Nightly Postgres backup + a **tested** restore.
- [ ] Uptime + `/api/health` alerting.
- [ ] Rollback plan written.
- [ ] Go live on `niveshlabs.com`; resubmit sitemap; watch logs for week 1.

**DoD:** the whole-release DoD in [ROADMAP.md §4](ROADMAP.md) is satisfied.

---

## Cross-cutting standards (apply to every phase)

These are not phases. They are checked on **every** task:

- **SEO + LLM-SEO** — every public page: [SEO.md §9](SEO.md) checklist. Server-rendered
  content, metadata, JSON-LD, answer-first writing, internal links, `/llms.txt`.
- **Security** — every endpoint/form: [SECURITY.md](SECURITY.md). Validate input, escape
  output, auth+CSRF on writes, no secrets client-side, security headers.
- **Accessibility** — [COMPONENTS.md §7](COMPONENTS.md): semantic HTML, keyboard, contrast,
  labels. (Also helps SEO and LLM parsing.)
- **Performance** — Core Web Vitals green; ship minimal JS; images via `next/image`.
- **Tests green** — `npm test`, `npm run build`, `npm run test:backend` before merge.
- **Small commits** — one small piece per branch/PR, message explains the *why*.

---

## Future scope (built now to make later easy)

Decisions we take in the first release specifically so Release 2+ is cheap:

- **Tool registry (`lib/tools.ts`)** — a new calculator = one array entry. Scales
  to 20+ tools with no plumbing changes.
- **Component library (`components/ui`)** — new pages reuse atoms; no restyling.
- **`PageShell`** — new page = "just the middle".
- **Article schema with SEO fields** — ready for tags, search, categories later
  without a migration rewrite.
- **Clean, stable URLs + canonicals** — safe to add sections (`/markets`,
  `/mutual-funds`) later without breaking rankings.
- **Server-side data fetching + API proxy** — real market data / accounts can be
  added behind the same pattern (keys stay server-side, [SECURITY.md §7](SECURITY.md)).
- **i18n-ready copy** — if you later add Hindi/regional content, structure allows it.

### Release 2+ backlog (do NOT build now)

- [ ] User accounts, login, saved calculations, watchlists, portfolios.
- [ ] Real-time market data, charts, gainers/losers.
- [ ] More calculators (see Phase 2 backlog list).
- [ ] Article search, tags, categories, comments.
- [ ] Newsletter / email.
- [ ] Credit-card & mutual-fund comparison sections.
- [ ] Payments / premium content.

Each becomes its own roadmap when its time comes — same method: small components,
SEO + security as standards, one phase at a time.
</content>
