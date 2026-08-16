# NiveshLabs — Security & Pen-Test Guide ("hacking-proof")

Your goal: *"it should be pen-test proof, all-hacking-proof."* No real site is
100% unhackable, but we can make NiveshLabs **hard, boring, and low-value to
attack** — which is what "hacking-proof" means in practice. This document is the
standard every phase in [ROADMAP.md](ROADMAP.md) must meet, plus the pen-test
checklist for Phase 6.

We follow the **OWASP Top 10** (the standard list of the most common web
attacks) and **OWASP ASVS Level 1** (a checklist of baseline requirements).

> Golden rule: **never trust anything that comes from the browser** — form
> input, headers, cookies, URLs, uploaded files. Validate and escape all of it.

---

## 1. Threat model (what we are actually defending)

The valuable, attackable things in the first release:

- **The admin panel** (`/admin`) — if broken into, an attacker can publish
  content on your domain. This is the crown jewel. Most of our effort goes here.
- **The database** — article and admin data.
- **The server / VPS** — must not become someone's crypto miner.
- **Your reputation** — a defaced finance site is a serious trust problem.

Who we defend against for v1: automated bots and opportunistic attackers
(the 99%). Not nation-states. Getting the basics right stops almost everyone.

---

## 2. Secrets management (do this first)

- All secrets — `ADMIN_PASSWORD`, `DATABASE_PASSWORD`, session signing key,
  any API key — live in **environment variables**, never in git.
- `.env*` files are git-ignored. **Verify:**
  ```bash
  git ls-files | grep -E '\.env($|\.)' || echo "OK: no env files tracked"
  git log --all -p | grep -iE 'password|secret|api[_-]?key' | head
  ```
  If a secret was ever committed, **rotate it** (change it everywhere) — removing
  it from history is not enough.
- Production, staging, and local use **different** secrets.
- Passwords are long and random (use a password manager), never reused.
- The Postgres password in `compose.yaml` is for local dev only and must never
  be used on the VPS (README already says this — good).

---

## 3. Authentication & the admin panel

This is the most important section.

- **Password storage:** BCrypt (you already use it — good). Never store or log
  plaintext passwords. Cost factor ≥ 10.
- **Sessions:** login state in an **HTTP-only, Secure, SameSite=Lax/Strict**
  cookie (you already use HTTP-only sessions — good). HTTP-only stops JavaScript
  from stealing the cookie; Secure keeps it HTTPS-only.
- **Session fixation:** issue a **new** session id on login (Spring Security does
  this by default — keep it on).
- **Brute-force protection:** rate-limit `/admin/login` (e.g. lock/slow after 5
  failed attempts per IP/account for a few minutes). Prevents password guessing.
- **Generic errors:** login failures say "invalid email or password" — never
  reveal which was wrong (stops user enumeration).
- **No secrets in URLs:** never put tokens/passwords in query strings (they land
  in logs and history).
- **Logout** actually invalidates the session server-side.
- **Admin discoverability:** `/admin` requires auth for *everything* except the
  login page. An unauthenticated request to any admin API returns 401/redirect,
  never data.
- **(Recommended for v1.1):** add TOTP two-factor for the admin account. Even one
  admin with 2FA hugely raises the bar.

---

## 4. HTTP security headers (defense in depth)

Set these globally — Next.js `next.config.ts` `headers()` for the frontend, and
Spring Security for the backend. One central place each.

| Header | Value (starting point) | Why |
| --- | --- | --- |
| `Content-Security-Policy` | start strict; allow only your own scripts/styles/fonts | Biggest XSS defence — blocks injected scripts |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS forever (HSTS) |
| `X-Content-Type-Options` | `nosniff` | Stops MIME-type tricks |
| `X-Frame-Options` | `DENY` | Stops clickjacking (site in an iframe) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Don't leak full URLs |
| `Permissions-Policy` | disable camera, mic, geolocation you don't use | Shrinks attack surface |

- **CSP is the hard one** — build it incrementally, watch the browser console for
  violations, tighten until only your own origins are allowed. Avoid
  `unsafe-inline` for scripts.
- Verify headers after deploy:
  ```bash
  curl -sI https://niveshlabs.com | grep -iE 'content-security|strict-transport|x-frame|x-content|referrer|permissions'
  ```
  and cross-check with <https://securityheaders.com>.

---

## 5. CSRF (cross-site request forgery)

An attacker's page tricks your logged-in browser into POSTing to our admin API.

- Keep Spring Security's **CSRF protection ON** for all state-changing requests
  (POST/PUT/DELETE). You already use CSRF tokens — good.
- The frontend admin forms must send the CSRF token with every write.
- Cookies are `SameSite`, which is a second layer of CSRF defence.
- **Do not** disable CSRF "to make it work" — fix the token flow instead.

---

## 6. XSS & input handling (this is where article content bites)

XSS = attacker's HTML/JS runs in a visitor's browser. Your article editor stores
HTML, so this is a real risk area.

- **Sanitise on input:** you already use `sanitize-html` — lock the allow-list to
  a **small** set of tags/attributes (headings, p, a, ul/ol/li, strong/em, code,
  img with safe src). Strip `<script>`, `on*` handlers, `javascript:` URLs,
  `<iframe>`, `<style>`.
- **Escape on output:** React escapes by default. Only bypass with
  `dangerouslySetInnerHTML` for **already-sanitised** article HTML, nowhere else.
  Every use of `dangerouslySetInnerHTML` must be justified in a code comment.
- **Validate all input server-side too** — never rely only on the browser. The
  browser is attacker-controlled.
- **Length/format limits** on every field (title, slug, summary, body) to prevent
  abuse and giant payloads.
- **Slugs:** generate/validate to `[a-z0-9-]` only — this also prevents path
  tricks.

---

## 7. Injection, database & API safety

- **SQL injection:** use JPA/parameterised queries only. **Never** build SQL by
  string-concatenating user input. (Spring Data repositories do this correctly —
  keep it that way; be careful with any custom `@Query`.)
- **IDOR (Insecure Direct Object Reference):** on every admin endpoint, check the
  logged-in user is allowed to touch *that* record — don't trust the id in the
  URL. Test: logged in, can you edit an article you shouldn't by changing the id?
- **Mass assignment:** admin endpoints accept only the fields they should. Don't
  bind request bodies straight onto entities where a user could set, e.g.,
  `role` or `id`.
- **Provider/API keys stay server-side.** If Phase 4 adds a market-data source,
  the browser calls **our** backend, and the backend calls the provider with the
  secret key. The key never appears in page source or network tab.
- **CORS:** the API allows only our own origins, not `*`.
- **Rate limiting** on public and admin APIs to blunt scraping and abuse.
- **Error messages** to users are generic; stack traces and DB errors go to
  server logs only, never to the browser.

---

## 8. Transport, infrastructure & the VPS

- **HTTPS everywhere**, HTTP → HTTPS redirect, valid cert (Caddy/Let's Encrypt —
  matches your `infra/Caddyfile` direction). HSTS on.
- **Reverse proxy** (Caddy) terminates TLS and forwards to Next.js/Spring; the
  app ports (3000/8080) and Postgres (5432) are **not** exposed publicly — bind
  to `127.0.0.1` (your `compose.yaml` already binds Postgres to `127.0.0.1` —
  good).
- **Firewall:** only 80/443 (and your SSH port) open to the world.
- **SSH:** key-based auth only, disable password login, ideally non-default port,
  consider fail2ban.
- **Keep the host patched:** OS updates, and rebuild Docker images to pick up base
  image security fixes.
- **Run apps as a non-root user** inside containers.
- **Postgres:** strong password, not reachable from the internet, least-privilege
  DB user for the app.

---

## 9. Automated scanning (run every release)

- **Dependencies:**
  ```bash
  npm audit --production
  ```
  and for Java, use OWASP Dependency-Check or `mvn versions:display-dependency-updates`
  plus a vulnerability scan.
- **Container images:** `trivy image <your-image>` for frontend and backend.
- **Dynamic scan:** OWASP **ZAP baseline** against staging — catches missing
  headers, obvious XSS, etc.
- **Static analysis / linting:** ESLint (present), plus a security-focused ruleset;
  optionally CodeQL via GitHub Actions.
- **Secret scanning:** enable GitHub secret scanning or run `gitleaks` in CI.

Wire the fast ones (`npm audit`, gitleaks, lint) into CI so every push is checked.

---

## 10. Logging, monitoring & recovery

- Log auth events (login success/failure, logout) and admin write actions — you
  want to see if someone is attacking the login.
- **Never log** passwords, session cookies, or CSRF tokens.
- Alert on spikes in 401/403/500.
- **Backups:** nightly Postgres dump, stored off the box, **restore tested**. A
  backup you've never restored is not a backup.
- **Incident plan:** if compromised — rotate all secrets, invalidate all sessions,
  restore from a known-good backup, patch the hole, then post-mortem.

---

## 11. Manual pen-test checklist (Phase 6)

Try to break your own site. Work through this against **staging**:

**Auth & sessions**
- [ ] Access `/admin` and every admin API while logged out → blocked (401/redirect).
- [ ] Brute-force login → gets rate-limited/locked.
- [ ] Session cookie is HttpOnly + Secure + SameSite (check dev tools).
- [ ] Session id changes after login; logout invalidates it server-side.
- [ ] Login error messages don't reveal whether the email exists.

**CSRF & requests**
- [ ] A POST to an admin write endpoint without the CSRF token → rejected.
- [ ] A cross-origin form cannot perform an admin action.

**XSS & content**
- [ ] Paste `<script>alert(1)</script>` and an `<img onerror=...>` into an article
      → stripped/escaped, does not execute anywhere it's shown.
- [ ] `javascript:` links and event handlers are removed.

**Access control (IDOR)**
- [ ] Changing the article id in an edit URL/API can't touch records you shouldn't.
- [ ] Draft/unpublished articles are not reachable via public URLs or sitemap.

**Injection & input**
- [ ] SQL-ish payloads in search/slug/fields don't error out or leak data.
- [ ] Oversized inputs are rejected by length limits.
- [ ] Slugs reject anything outside `[a-z0-9-]`.

**Transport & headers**
- [ ] HTTP redirects to HTTPS; HSTS present.
- [ ] securityheaders.com grade A; no key in page source or network tab.
- [ ] App ports and Postgres are not reachable from the public internet.

**Infra & deps**
- [ ] `npm audit` / trivy / dependency-check show no high/critical.
- [ ] ZAP baseline shows no high/medium.
- [ ] SSH is key-only; firewall exposes only 80/443/SSH.

Write every finding down, fix it, and **re-run the section**. When all boxes are
checked and re-verified, the pen-test pass is done.

---

## 12. OWASP Top 10 → where we handle it (quick map)

| OWASP Top 10 (2021) | Handled in |
| --- | --- |
| A01 Broken Access Control | §3, §7 (IDOR), §11 |
| A02 Cryptographic Failures | §2, §3 (BCrypt), §8 (TLS/HSTS) |
| A03 Injection | §6 (XSS), §7 (SQL) |
| A04 Insecure Design | whole roadmap: security as a per-phase standard |
| A05 Security Misconfiguration | §4 (headers), §8 (infra) |
| A06 Vulnerable Components | §9 (audits/scans) |
| A07 Auth Failures | §3 |
| A08 Data Integrity Failures | §5 (CSRF), §9 (secret scanning) |
| A09 Logging/Monitoring Failures | §10 |
| A10 SSRF | §7 (server-side fetch only to known providers) |
</content>
