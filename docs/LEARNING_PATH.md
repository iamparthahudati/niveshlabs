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

Build an EMI calculator in the Java backend.

- Define the input fields.
- Validate positive values.
- Put the formula in a service class.
- Keep the controller focused on HTTP.
- Test normal inputs and edge cases.
- Create the React form only after the Java tests pass.

Topics: DTOs, validation, services, exceptions, decimal precision, and unit
testing.

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
