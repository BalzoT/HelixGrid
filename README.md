# HelixGrid

Solar PPA platform monorepo with a Postgres schema, NestJS API, Next.js dashboard, and a solar simulation service. Built with Nx + pnpm and containerized via Docker Compose.

## Stack
- Apps
  - `apps/api` — NestJS + Prisma ORM (Postgres)
  - `apps/web` — Next.js 16 + Tailwind + shadcn/ui (App Router)
  - `apps/sim` — Node TypeScript solar simulation API
- Libs
  - `libs/ui` — shared React components (published as `@ui` workspace package)
- Data
  - `db/migrations`, `db/seed` — optional raw SQL (legacy)
- Tooling
  - Nx workspace, pnpm workspaces, GitHub Actions CI

## Quick Start
Prerequisites: Node 20+, Docker, Docker Compose. Enable pnpm: `corepack enable`.

Local (dev):
1) Install deps: `pnpm install`
2) Start DB: `make db-up`
3) Env: `cp .env.example .env` and set `DATABASE_URL`
4) Migrate + generate: `make prisma.migrate.dev && make prisma.generate`
5) Run services (separate terminals):
   - API: `pnpm nx serve api` → http://localhost:3001/v1/health
   - Sim: `pnpm nx serve sim` → http://localhost:3002/v1/health
   - Web: `pnpm nx serve web` → http://localhost:3000

Docker (all-in-one):
- Up: `make compose.up`
  - Order: db → api-migrate (Prisma deploy) → api → sim → web
- Down: `make compose.down`
- Logs: `make compose.logs`

## Common Tasks
- Lint/Type/Build: `pnpm run lint` | `pnpm run type-check` | `pnpm run build`
- Nx graph: `pnpm nx graph`
- Prisma (API):
  - `make prisma.generate` — generate client
  - `make prisma.migrate.dev` — dev migrations
  - `make prisma.migrate.deploy` — deploy migrations
  - `make prisma.seed` — seed data
  - `make prisma.studio` — Prisma Studio

## UI (Tailwind + shadcn/ui)
- Web app uses Tailwind + shadcn/ui. Shared components live in `libs/ui` and are consumed via the workspace package `@ui`.
- Example:
  ```tsx
  import { Button } from '@ui'
  ```

## Project Layout
- `apps/` — applications (`api`, `web`, `sim`)
- `libs/` — shared libraries (`ui`)
- `db/` — SQL migrations/seeds (optional)
- `.github/workflows/ci.yml` — pnpm + Nx CI (lint, type-check, build)

## Notes
- pnpm is enforced locally; in CI/Docker it’s skipped for lean images.
- Next.js builds with `output: 'standalone'`; the container runs `server.js` from the standalone output.
- The `api-migrate` one-shot job runs Prisma `migrate deploy` before the API starts.

Troubleshooting
- If Docker web fails with “Cannot find module 'next'”, ensure the image copies `.next/standalone/node_modules` (Dockerfile already does this).
- If Prisma complains about OpenSSL, the API image uses Debian slim with `openssl` installed to satisfy Prisma engines.
