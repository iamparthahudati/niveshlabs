import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses standard Next.js without the previous hosting runtime", async () => {
  const [packageJson, nextConfig] = await Promise.all([
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
  ]);

  assert.match(packageJson, /"dev": "next dev"/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|cloudflare/i);
  assert.match(nextConfig, /output: "standalone"/);
  await assert.rejects(access(new URL(".openai/hosting.json", root)));
});

test("includes the Java backend starter", async () => {
  const [pom, controller] = await Promise.all([
    readFile(new URL("backend/pom.xml", root), "utf8"),
    readFile(
      new URL(
        "backend/src/main/java/com/niveshlabs/api/health/HealthController.java",
        root,
      ),
      "utf8",
    ),
  ]);

  assert.match(pom, /spring-boot-starter-web/);
  assert.match(pom, /postgresql/);
  assert.match(controller, /\/api\/health/);
});

test("protects the admin panel and includes article management", async () => {
  const [security, login, articles, proxy] = await Promise.all([
    readFile(new URL("backend/src/main/java/com/niveshlabs/api/security/SecurityConfig.java", root), "utf8"),
    readFile(new URL("app/admin/login/page.tsx", root), "utf8"),
    readFile(new URL("backend/src/main/java/com/niveshlabs/api/article/AdminArticleController.java", root), "utf8"),
    readFile(new URL("proxy.ts", root), "utf8"),
  ]);

  assert.match(security, /springframework\.security/);
  assert.match(login, /api\/auth\/login/);
  assert.match(articles, /api\/admin\/articles/);
  assert.match(proxy, /JSESSIONID/);
});

test("enforces secrets hygiene with no env secrets tracked in git", async () => {
  const gitTracked = execSync("git ls-files", { encoding: "utf8" });
  const envFiles = gitTracked
    .split("\n")
    .filter((f) => f.includes(".env") && !f.endsWith(".env.example"));

  assert.deepEqual(
    envFiles,
    [],
    `Found tracked env files in git: ${envFiles.join(", ")}`,
  );
});

test("configures central HTTP security headers for Next.js and Spring Security", async () => {
  const [nextConfig, springSecurity] = await Promise.all([
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL("backend/src/main/java/com/niveshlabs/api/security/SecurityConfig.java", root), "utf8"),
  ]);

  // Next.js security headers
  assert.match(nextConfig, /Content-Security-Policy/);
  assert.match(nextConfig, /Strict-Transport-Security/);
  assert.match(nextConfig, /X-Content-Type-Options/);
  assert.match(nextConfig, /X-Frame-Options/);
  assert.match(nextConfig, /Referrer-Policy/);
  assert.match(nextConfig, /Permissions-Policy/);

  // Spring Security headers DSL
  assert.match(springSecurity, /contentTypeOptions/);
  assert.match(springSecurity, /frameOptions/);
  assert.match(springSecurity, /referrerPolicy/);
  assert.match(springSecurity, /permissionsPolicy/);
  assert.match(springSecurity, /httpStrictTransportSecurity/);
});

test("provides design tokens system and imports tokens into global styles", async () => {
  const [tokensCss, globalsCss, layoutTsx] = await Promise.all([
    readFile(new URL("app/tokens.css", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  assert.match(tokensCss, /--color-navy:/);
  assert.match(tokensCss, /--color-indigo:/);
  assert.match(tokensCss, /--font-dm-sans:/);
  assert.match(tokensCss, /--space-4:/);
  assert.match(tokensCss, /--radius-md:/);
  assert.match(tokensCss, /--shadow-md:/);
  assert.match(tokensCss, /--container-max-w:/);

  assert.match(globalsCss, /var\(--/);
  assert.match(layoutTsx, /import "\.\/tokens\.css"/);
});

test("establishes required component and lib folder structure", async () => {
  const requiredPaths = [
    "components/ui/index.ts",
    "components/header/index.ts",
    "components/footer/index.ts",
    "components/layout/index.ts",
    "components/article/index.ts",
    "components/calculators/index.ts",
    "components/admin/index.ts",
    "components/seo/index.ts",
    "lib/calculators/index.ts",
    "lib/seo/index.ts",
    ".github/workflows/ci.yml",
  ];

  for (const relPath of requiredPaths) {
    await assert.doesNotReject(
      access(new URL(relPath, root)),
      `Expected ${relPath} to exist`,
    );
  }
});
