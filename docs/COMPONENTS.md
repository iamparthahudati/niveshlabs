# NiveshLabs — Component-by-Component Build Guide

This document answers your exact request: *"build from very small small
components so everything is in my understanding — header component first, then
show all the header, how to show all the tools, how to make each thing SEO
friendly."*

Read this before **Phase 1** of [ROADMAP.md](ROADMAP.md).

---

## 1. The mental model: atoms → molecules → organisms → pages

We build the UI in four sizes. Small things combine into bigger things. You
never build a big thing directly.

```text
Atom        a single element: Button, Icon, NavLink, Input, Tag
   ↓ combine
Molecule    a few atoms with one job: SearchForm, MarketItem, ArticleCard
   ↓ combine
Organism    a section of the page: SiteHeader, Footer, CalculatorPanel
   ↓ combine
Template    the page shell: header + <main> + footer, no real content yet
   ↓ fill with data
Page        a real URL: /, /articles/[slug], /calculators/sip
```

Why this order: when a `Button` looks right, it looks right *everywhere*. Fix
once, benefit everywhere. And you only ever hold one small piece in your head.

---

## 2. Folder layout for components

```text
components/
  ui/            atoms + small molecules (Button, Card, Input, Icon, Tag)
  header/        Brand, MarketStrip, PrimaryNav, SearchForm, AccountButton, MobileMenu, SiteHeader
  footer/        Footer, Disclaimer, LegalLinks
  article/       ArticleCard, ArticleList, ArticleMeta
  calculators/   CalculatorForm, ResultCard, and one folder per calculator
  admin/         AdminHeader, ArticleEditor (exists), forms
  seo/           JsonLd, Breadcrumbs (structured-data helpers)
lib/             pure logic, no UI: calc functions, api clients, formatting
```

Rule: **`lib/` never imports from `components/`.** Logic is separate from UI so
it can be tested on its own and reused (e.g. server-side and client-side).

---

## 3. The recipe for building ONE component

Every single component follows the same six steps. This is the habit that keeps
the project in your understanding.

1. **Name + one sentence.** e.g. *"`MarketStrip` — the scrolling row of index
   values at the very top of the site."*
2. **Props.** What does it need from outside? Type them.
   ```tsx
   type MarketItem = { name: string; value: string; change: string; trend: "up" | "down" };
   function MarketStrip({ items }: { items: MarketItem[] }) { /* ... */ }
   ```
3. **Semantic HTML first.** Use the right tag (`<nav>`, `<header>`, `<button>`,
   `<article>`). This is free SEO + accessibility (see §7).
4. **Style with tokens.** Use the CSS variables, not random colours.
5. **Look at it.** `npm run dev`, view it, resize to mobile, tab through with the
   keyboard.
6. **Prove it.** For logic-bearing pieces, a small test. For visual pieces, the
   checklist in §7.

Keep components **small and dumb**: they receive data via props and render it.
Fetching data and business logic live in `lib/` and in the page, not inside a
button.

---

## 4. Worked example: building the header, piece by piece

Your `components/site-header.tsx` today already contains everything, but as one
big file. The exercise in Phase 1 is to **break it into small components you
understand**, then reassemble. Here is the order.

**Step 1 — `Brand` (atom).** The logo + name that links home.
- Props: none (or an optional `href`).
- Semantic: an `<a>`/`<Link>` with `aria-label="NiveshLabs home"`.
- Done when: clicking it goes home; readable by screen reader.

**Step 2 — `NavLink` (atom).** One navigation link with active state.
- Props: `href`, `label`, `isActive`.
- Semantic: `<a aria-current={isActive ? "page" : undefined}>`.

**Step 3 — `PrimaryNav` (molecule).** The row of `NavLink`s.
- Props: `items: {label, href}[]`.
- Semantic: wrapped in `<nav aria-label="Primary">`.
- Note: right now nav items link to `#anchors`. As real pages exist
  (`/markets`, `/calculators`, ...), change these to real routes — real URLs are
  vital for SEO and for LLMs.

**Step 4 — `MarketItem` (molecule)** and **`MarketStrip` (organism).**
- `MarketItem`: one index (name, value, up/down change).
- `MarketStrip`: the list of them + the "Sample data" label.
- Keep the honesty label — see `ROADMAP.md` Phase 4.

**Step 5 — `SearchForm` (molecule).**
- Semantic: `<form role="search">` with a **real `<label>`** (you already do
  this with `sr-only` — good).
- v1 can submit to `/search?query=...`; the results page can come later.

**Step 6 — `AccountButton` (atom)** and **`MobileMenu` (organism).**
- `MobileMenu` uses `<details>/<summary>` (you already do — nice, it works
  without JavaScript, which is good for crawlers and reliability).

**Step 7 — `SiteHeader` (organism).** Assemble the above. Now the header file is
tiny and just wires small pieces together.

**"Show all the header" =** compose these on the page shell (§6) so every page
gets the same header for free.

> This same decomposition is how you attack **any** big screen from the mockup:
> list the small pieces, build each once, compose them.

---

## 5. Worked example: "how to show all the tools"

The dashboard mockup has a "Popular calculators" grid and dedicated tool pages.
Here is the small-pieces breakdown.

**Atoms/molecules**
- `ToolCard` — icon + title + one-line description + arrow, links to the tool
  page. Props: `{ icon, title, subtitle, href }`.
- `ToolGrid` — a responsive grid of `ToolCard`s. Props: `{ tools: Tool[] }`.

**The tool page itself (organism → page), one per calculator**
- `CalculatorForm` — the inputs (amount, rate, years...). Controlled inputs.
- `ResultCard` — shows the computed number(s) and a small breakdown.
- The **calculation** is NOT in these components. It is a pure function in
  `lib/calculators/sip.ts` with tests. The component calls it.

```text
lib/calculators/sip.ts        // pure math + tests  (build this FIRST)
components/calculators/
  CalculatorForm.tsx          // generic form shell
  ResultCard.tsx              // generic result display
app/calculators/sip/page.tsx  // the page: form + result + explainer content
```

**Why build the math first:** a wrong calculator destroys trust. Prove the
numbers in isolation, then you never worry about them again while styling.

**Making each tool page SEO + LLM friendly (this is the important part):**
- The page must be **server-rendered** and contain real explainer text (what the
  tool is, the formula, a worked example, an FAQ). Crawlers and LLMs read the
  HTML; they should not need to run your JavaScript to understand the page.
- The interactive calculator hydrates on top of that content for humans.
- Add structured data: `SoftwareApplication` (it's a tool) + `FAQPage`
  (the questions). See [SEO.md](SEO.md) §3–§5.
- Link the tools to each other ("Popular calculators" grid) — internal links
  spread ranking and help discovery.

**Listing all tools in one place** = a `/calculators` index page rendering
`ToolGrid` from a single `tools` array in `lib/`. One array drives the grid, the
sitemap, and the internal links — one source of truth.

---

## 6. The page shell (so a new page is "just the middle")

Build one template that every page reuses:

```tsx
// components/layout/PageShell.tsx  (conceptually)
<>
  <SiteHeader />
  <main id="main" aria-label="...">{children}</main>
  <Footer />
</>
```

Now a new page = write only the `{children}`. Header, footer, disclaimer, and
skip-link come for free and stay consistent. This is how you "show the header on
all pages" without repeating yourself.

---

## 7. The per-component quality checklist

Before a component is "done", it passes this. Pin it somewhere.

**Structure / semantics**
- [ ] Uses the correct HTML element (`button`, `nav`, `article`, `form`, ...),
      not a `div` pretending to be one.
- [ ] Exactly one `<h1>` per page; headings go in order (h1 → h2 → h3).
- [ ] Images have meaningful `alt`; decorative ones are `aria-hidden`.

**Accessibility (also helps SEO)**
- [ ] Fully usable with the keyboard (Tab / Enter / Esc).
- [ ] Visible focus outline.
- [ ] Interactive things have a name (label or `aria-label`).
- [ ] Text contrast passes (aim WCAG AA).

**Behaviour / safety**
- [ ] No user-provided HTML rendered without sanitising (see `SECURITY.md §6`).
- [ ] No secret/API key used inside a client component.
- [ ] Handles empty / loading / error states (e.g. "Articles are on the way").

**Responsiveness**
- [ ] Looks right at 375px (mobile), 768px (tablet), 1280px (desktop).
- [ ] Nothing overflows horizontally on mobile.

**Reuse**
- [ ] Values come from design tokens, not one-off hex codes.
- [ ] Data comes in via props; the component doesn't fetch or compute business
      logic itself.

---

## 8. Suggested build order (maps to the roadmap phases)

1. Tokens + `ui/` primitives (Button, Card, Input, Icon, Container). *(Phase 1)*
2. `header/*` decomposed, then `SiteHeader`. *(Phase 1)*
3. `footer/*` with disclaimer. *(Phase 1)*
4. `PageShell`. *(Phase 1)*
5. `article/*` (`ArticleCard`, `ArticleList`, `ArticleMeta`) + `seo/JsonLd`. *(Phase 2)*
6. `calculators/*` + one `lib/calculators/*` per tool + `ToolCard`/`ToolGrid`. *(Phase 3)*
7. Market surfaces (`MarketStrip` already done; keep honest labels). *(Phase 4)*

Each item = several tiny components, each built with the §3 recipe and checked
with the §7 checklist. That is the whole method.
</content>
