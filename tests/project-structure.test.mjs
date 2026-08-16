import assert from "node:assert/strict";
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
