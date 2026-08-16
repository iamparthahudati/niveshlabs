# NiveshLabs learning path

The purpose of this project is for you to learn by implementing each feature.
Avoid copying complete solutions before you understand the request, response,
data, and tests involved.

## Working agreement

For each feature:

1. Write the expected behaviour in plain language.
2. Sketch the request and response.
3. Implement the smallest version.
4. Add tests.
5. Run it locally.
6. Explain the code back in your own words.
7. Commit the working change.

## Milestone 1 — Understand the current setup

- Run the Java backend.
- Open `/api/health` directly.
- Run the Next.js frontend.
- Open `/api/health` through port 3000.
- Find the controller method that creates the response.
- Change only the application name, rerun the test, and observe the result.

Topics: HTTP, JSON, ports, Java records, controllers, Maven, and tests.

## Milestone 2 — First finance calculator

Build a calculator as a **client-side TypeScript** function.

> Decision (2026-08-17): calculator math lives in the frontend
> (`lib/calculators/`) as pure, tested TypeScript functions — not the Java
> backend. Reasons: instant UX with no network round-trip per calculation, best
> for SEO (no API dependency), and smallest attack surface. See
> [BACKLOG.md Phase 2](BACKLOG.md).

- Define the input fields and their types.
- Put the formula in a pure function in `lib/calculators/<name>.ts`.
- Validate positive values; handle edge cases (0, huge, decimals).
- Test the function in isolation first.
- Build the React form + result components only after the tests pass.

Topics: pure functions, TypeScript types, input validation, decimal precision,
and unit testing.

## Milestone 3 — Article model

- Learn the existing Flyway migration.
- Create an `Article` Java entity.
- Create a repository.
- Return only published articles from a public endpoint.
- Add service and integration tests.

Topics: SQL, JPA, entities, repositories, migrations, and transactions.

## Milestone 4 — Private administration

- Add Spring Security.
- Create an administrator account safely.
- Build server-rendered article forms.
- Add draft, review, and published states.

Topics: authentication, authorization, password hashing, forms, CSRF, and
secure sessions.

## Milestone 5 — Production preparation

- Install Docker locally.
- Run PostgreSQL instead of H2.
- Add structured logs and health checks.
- Create backups.
- Deploy to a staging subdomain.
- Test before changing production DNS.

Do not add user accounts, payments, live market data, or microservices before
these five milestones are complete.
