# CWA Assignment – Split Frontend and API

This repository contains a Next.js frontend (`frontend/`) and a Node/Express API (`api/`) using Prisma + SQLite. It also includes Playwright E2E tests and a basic Docker setup.

## Project Structure
```
ass1/
  api/                 # Express API + Prisma (SQLite dev DB in api/prisma/dev.db)
  frontend/            # Next.js app (App Router)
  docker-compose.yml   # Optional two-service local run
```

## Tech Stack
- Frontend: Next.js 15, React 19, TypeScript, Tailwind
- API: Express, Prisma ORM, SQLite (easy local dev; can switch to Postgres)
- E2E: Playwright (tests in `frontend/tests`)

## Getting Started
Prerequisites: Node 20+, npm, free ports 3000 (frontend) and 4002 (API).

1) Start the API:
```bash
cd api
npm i
npx prisma generate
npx prisma migrate deploy
PORT=4002 npm run dev
```
- Database URL is pointed to `api/prisma/dev.db` at runtime.

2) Start the Frontend:
```bash
cd frontend
npm i
npm run dev
```
- App: http://localhost:3000
- API (direct): http://localhost:4002

The frontend proxies `/api/*` to the API port configured in `frontend/next.config.ts`. If you prefer direct calls instead of proxy, set:
```
frontend/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:4002
```

## API Overview
Base: `http://localhost:4002`
- GET `/custom-questions` → list topics with questions
- POST `/custom-questions` → create topic
```json
{
  "title": "Topic name",
  "timerSeconds": 300,
  "items": [
    { "question": "Q1", "answer": "A1", "hint1": "h1", "hint2": "h2", "hint3": "h3" }
  ]
}
```
- DELETE `/custom-questions?title=Topic%20name`

Prisma (in `api/`):
```bash
npx prisma generate
npx prisma migrate dev --name <message>
```

## E2E Tests (Playwright)
```bash
cd frontend
npx playwright install
# with dev servers running (3000/4002)
npx playwright test
```
- Config: `frontend/playwright.config.ts`
- Tests: `frontend/tests/*.spec.ts`

## Docker
Local two-service run:
```bash
docker compose up --build
```
Adjust Dockerfiles and compose if you migrate from SQLite to Postgres.

## Deployment (Suggested AWS)
- API → AWS App Runner (container from ECR)
  - Env: `DATABASE_URL` (use Postgres in production)
- Frontend → AWS Amplify Hosting (Next.js)
  - Env: `NEXT_PUBLIC_API_BASE=https://<your-api-domain>`
- Optional: Route 53 custom domains; CloudFront in front of API for caching.

For dynamic HTML with S3 + Lambda + API Gateway (separate from this repo), deploy a Lambda that reads templates from S3 and renders paths; wire ANY `/{proxy+}` via API Gateway to the Lambda.

## Troubleshooting
- Port busy: `kill -TERM $(lsof -ti :3000)` or `:4002`
- Prisma errors:
  - Missing `DATABASE_URL`: ensure `api/src/server.ts` sets it or add `api/.env`
  - Read-only SQLite: ensure DB path is writable; default to `api/prisma/dev.db`
- Frontend cannot load previous topics: confirm proxy in `frontend/next.config.ts` points to the running API port
- Git push rejected (large files): do not commit `node_modules/` or `.next/`; if history contains them, use `git filter-repo` to purge

## Scripts
- Frontend (`frontend/package.json`): `dev`, `build`, `start`, `lint`, `test:e2e`
- API (`api/package.json`): `dev`, `build`, `start`, `prisma:*`

## Notes
- SQLite is for development. For production, switch Prisma `provider` to `postgresql` and set `DATABASE_URL`; re-run migrations.
- Escape Room tab persists topics via the API and can replay previously saved topics from the “Previous topic” list.
