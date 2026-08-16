import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("UI primitives export correctly and follow accessibility patterns", async () => {
  const [buttonSrc, navLinkSrc, fieldSrc, cardSrc, containerSrc, iconSrc, tagSrc, uiIndexSrc] =
    await Promise.all([
      readFile(new URL("components/ui/Button.tsx", root), "utf8"),
      readFile(new URL("components/ui/NavLink.tsx", root), "utf8"),
      readFile(new URL("components/ui/Field.tsx", root), "utf8"),
      readFile(new URL("components/ui/Card.tsx", root), "utf8"),
      readFile(new URL("components/ui/Container.tsx", root), "utf8"),
      readFile(new URL("components/ui/Icon.tsx", root), "utf8"),
      readFile(new URL("components/ui/Tag.tsx", root), "utf8"),
      readFile(new URL("components/ui/index.ts", root), "utf8"),
    ]);

  // Button accessibility & variant support
  assert.match(buttonSrc, /aria-busy/);
  assert.match(buttonSrc, /btn-\$\{variant\}/);
  assert.match(buttonSrc, /variant\?: ButtonVariant/);
  assert.match(buttonSrc, /btn-spinner/);

  // NavLink aria-current active state
  assert.match(navLinkSrc, /aria-current=/);

  // Field label association and aria-describedby / aria-invalid
  assert.match(fieldSrc, /htmlFor=/);
  assert.match(fieldSrc, /aria-invalid/);
  assert.match(fieldSrc, /aria-describedby/);

  // Card composability
  assert.match(cardSrc, /CardHeader/);
  assert.match(cardSrc, /CardTitle/);
  assert.match(cardSrc, /CardContent/);

  // Container responsive wrapper
  assert.match(containerSrc, /container-base/);

  // Icon SVG accessible attributes
  assert.match(iconSrc, /aria-hidden=/);
  assert.match(iconSrc, /chevron-right/);
  assert.match(iconSrc, /trend-up/);

  // Tag / Badge component
  assert.match(tagSrc, /tag-base/);
  assert.match(tagSrc, /Badge/);

  // Index barrel export
  assert.match(uiIndexSrc, /export \* from "\.\/Button"/);
  assert.match(uiIndexSrc, /export \* from "\.\/Field"/);
});

test("Header is modularly decomposed into atoms, molecules, and SiteHeader organism", async () => {
  const [brandSrc, marketStripSrc, primaryNavSrc, searchFormSrc, mobileMenuSrc, siteHeaderSrc, headerIndexSrc] =
    await Promise.all([
      readFile(new URL("components/header/Brand.tsx", root), "utf8"),
      readFile(new URL("components/header/MarketStrip.tsx", root), "utf8"),
      readFile(new URL("components/header/PrimaryNav.tsx", root), "utf8"),
      readFile(new URL("components/header/SearchForm.tsx", root), "utf8"),
      readFile(new URL("components/header/MobileMenu.tsx", root), "utf8"),
      readFile(new URL("components/header/SiteHeader.tsx", root), "utf8"),
      readFile(new URL("components/header/index.ts", root), "utf8"),
    ]);

  // Brand semantic markup
  assert.match(brandSrc, /aria-label="NiveshLabs home"/);

  // MarketStrip transparency label
  assert.match(marketStripSrc, /Sample data/);

  // PrimaryNav semantic navigation
  assert.match(primaryNavSrc, /aria-label="Primary navigation"/);

  // SearchForm semantic search role and accessible label
  assert.match(searchFormSrc, /role="search"/);
  assert.match(searchFormSrc, /className="sr-only"/);

  // MobileMenu zero-JS accessible details/summary
  assert.match(mobileMenuSrc, /<details/);
  assert.match(mobileMenuSrc, /<summary/);

  // SiteHeader assembly
  assert.match(siteHeaderSrc, /<MarketStrip/);
  assert.match(siteHeaderSrc, /<Brand/);
  assert.match(siteHeaderSrc, /<PrimaryNav/);
  assert.match(siteHeaderSrc, /<SearchForm/);

  // Barrel export
  assert.match(headerIndexSrc, /export \* from "\.\/SiteHeader"/);
});

test("Footer and PageShell enforce layout, skip-link, and legal risk disclaimer", async () => {
  const [disclaimerSrc, legalLinksSrc, footerSrc, pageShellSrc] = await Promise.all([
    readFile(new URL("components/footer/Disclaimer.tsx", root), "utf8"),
    readFile(new URL("components/footer/LegalLinks.tsx", root), "utf8"),
    readFile(new URL("components/footer/Footer.tsx", root), "utf8"),
    readFile(new URL("components/layout/PageShell.tsx", root), "utf8"),
  ]);

  // Mandatory financial risk disclaimer content
  assert.match(disclaimerSrc, /market risks/i);
  assert.match(disclaimerSrc, /educational and illustrative purposes/i);

  // Legal navigation
  assert.match(legalLinksSrc, /Privacy Policy/);
  assert.match(legalLinksSrc, /Terms of Service/);

  // Footer landmarks & copyright
  assert.match(footerSrc, /role="contentinfo"/);
  assert.match(footerSrc, /NiveshLabs/);

  // PageShell accessibility: skip-link + main landmark + header + footer
  assert.match(pageShellSrc, /href="#main"/);
  assert.match(pageShellSrc, /className="skip-link"/);
  assert.match(pageShellSrc, /<main id="main"/);
  assert.match(pageShellSrc, /<SiteHeader/);
  assert.match(pageShellSrc, /<Footer/);
});

test("SEO helpers safely render JSON-LD structured data and semantic Breadcrumbs", async () => {
  const [jsonLdSrc, breadcrumbsSrc] = await Promise.all([
    readFile(new URL("components/seo/JsonLd.tsx", root), "utf8"),
    readFile(new URL("components/seo/Breadcrumbs.tsx", root), "utf8"),
  ]);

  // JsonLd security against script injection
  assert.match(jsonLdSrc, /application\/ld\+json/);
  assert.match(jsonLdSrc, /safeJsonLdReplacer/);

  // Breadcrumbs semantic navigation & Schema.org BreadcrumbList
  assert.match(breadcrumbsSrc, /aria-label="Breadcrumb"/);
  assert.match(breadcrumbsSrc, /BreadcrumbList/);
  assert.match(breadcrumbsSrc, /<JsonLd/);
});
