# NiveshLabs

NiveshLabs is a local-first finance education project. The public website uses
Next.js, and the backend uses Java with Spring Boot. It is designed to run on a
normal VPS without depending on a proprietary application host.

## Architecture

```text
Browser
  |
  +-- Next.js frontend (port 3000)
  |
  +-- /api/* -> Spring Boot backend (port 8080)
                     |
                     +-- PostgreSQL (port 5432)
```

The backend contains health, admin authentication and article-management APIs.
Admin passwords are hashed with BCrypt, login state is stored in an HTTP-only
session cookie, and data-changing requests use CSRF protection.

## Project layout

```text
app/                 Next.js pages and styles
backend/             Java and Spring Boot application
backend/src/         Java source, configuration, migrations, and tests
infra/               VPS-facing configuration
public/              Public images and icons
tests/               Frontend project checks
compose.yaml         Full local stack with PostgreSQL
```

## What is already installed on this computer

- Node.js 24
- npm 11
- Java 17

Maven does not need to be installed globally. The project contains its own
Maven launcher in `backend/mvnw`.

Docker is not installed yet. It is optional for the first lessons because the
backend uses a temporary in-memory H2 database when PostgreSQL is unavailable.

## Run locally without Docker

Open two Terminal windows in this project.

Terminal 1 — Java backend:

```bash
ADMIN_EMAIL=admin@niveshlabs.local \
ADMIN_PASSWORD='choose-a-long-password' \
ADMIN_DISPLAY_NAME=Partha \
npm run dev:backend
```

The first run downloads Maven and Java dependencies. When it is ready, visit:

```text
http://localhost:8080/api/health
```

Terminal 2 — Next.js frontend:

```bash
npm install
npm run dev:frontend
```

Visit:

```text
http://localhost:3000
```

Then visit `/admin`. You will be redirected to `/admin/login`. Sign in with
the email and password supplied when starting the backend. The account is
created only when that email does not already exist; changing the environment
password later does not overwrite an existing account.

If port 3000 is already being used, Next.js automatically chooses another
port such as 3001. Always use the exact local address printed in the Terminal.

Next.js forwards `/api/*` to Spring Boot during local development, so this also
works when both applications are running:

```text
http://localhost:3000/api/health
```

Stop either application with `Control+C` in its Terminal window.

## Run tests

Frontend:

```bash
npm test
npm run build
```

Backend:

```bash
npm run test:backend
```

## Run the complete stack with Docker later

After Docker Desktop is installed:

```bash
docker compose up --build
```

This starts Next.js, Spring Boot and PostgreSQL. The PostgreSQL password in
`compose.yaml` is only for local development and must not be reused on the VPS.

## Environment values

Copy `.env.example` to `.env.local` only when you need to change the default
backend address. Never commit real passwords or API keys.

The backend environment example is in `backend/.env.example`. Spring Boot uses
H2 by default for the first local lessons and switches to PostgreSQL when the
database environment values are supplied.

## Production direction

The `infra/Caddyfile` shows the future VPS routing. It is not used during the
first local lessons. We will deploy to `staging.niveshlabs.com` before changing
the live domain.

Read [docs/LEARNING_PATH.md](docs/LEARNING_PATH.md) before adding features.

## First release plan

The full step-by-step plan for the first public release lives in `docs/`:

- [docs/ROADMAP.md](docs/ROADMAP.md) — master, phased build plan (start here).
- [docs/COMPONENTS.md](docs/COMPONENTS.md) — how we build the UI one small
  component at a time (header first, then tools, etc.).
- [docs/SECURITY.md](docs/SECURITY.md) — the "pen-test proof / hacking proof"
  standard and checklist.
- [docs/SEO.md](docs/SEO.md) — classic SEO and LLM / AI-chat (GEO) SEO.
