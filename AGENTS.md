# Repository Guidelines

Contributor guide for HelixGrid. This repo contains: A) Postgres DB schema for a solar PPA platform, B) NestJS backend, C) Next.js + Tailwind dashboard, D) a solar simulation API starter. This file applies repo‑wide unless a nested AGENTS.md overrides it.

## Project Structure & Module Organization
- `db/` — SQL schema and migrations in `db/migrations/*.sql` (name `YYYYMMDD_HHMM__desc.sql`), seeds in `db/seed/*.sql`.
- `apps/api/` — NestJS backend (`src/main.ts`, `src/app.module.ts`, `src/modules/*`, `src/common/*`, `src/dtos/*`, `src/entities/*`).
- `apps/web/` — Next.js + Tailwind dashboard (`app/`, `components/ui/*`, `styles/globals.css`, `tailwind.config.ts`).
- `apps/sim/` — Solar simulation API starter (Node TS; `src/index.ts`, `src/lib/*`).
- `libs/` — shared TS libraries (domain, utils, types) consumed by apps.
- `docs/` — ADRs, architecture notes; `.github/workflows/` — CI.

## Monorepo (Nx + pnpm)
- Managed by pnpm workspaces (`pnpm-workspace.yaml`). Run tools via `pnpm nx ...`.
- Projects live under `apps/*` and `libs/*` with per‑project `project.json`.
- Use Nx caching and affected commands to speed CI.
- Common commands: `pnpm nx serve api|web|sim`, `pnpm nx run-many -t build,test,lint`, `pnpm nx affected -t build,test,lint`, `pnpm nx graph`, `pnpm nx reset`.
- The Makefile wraps Nx tasks for a consistent DX.
- TS path alias: `@ui` -> `libs/ui/src/index.ts` in `tsconfig.base.json` for shared components.
- pnpm is enforced via preinstall; use `pnpm install` (not npm/yarn).

## Build, Test, and Development Commands
Use `make` wrappers (preferred); they call Nx under the hood. Install deps with `make setup` (pnpm).
- `make db-up` / `make db-down` — start/stop local Postgres (Docker Compose).
- Prisma: `make prisma.generate` (client), `make prisma.migrate.dev` (dev migrate), `make prisma.migrate.deploy` (apply), `make prisma.seed` (seed), `make prisma.studio` (UI).
- Legacy SQL: `make migrate` applies `db/migrations`; `make seed` loads `db/seed`.
- `make api.dev` / `make web.dev` / `make sim.dev` — dev servers via Nx.
- `make build` / `make test` / `make lint` / `make type-check` — run across all projects.
- `make affected` — run affected build,test,lint; `make graph` — Nx graph; `make reset` — clear cache.
 - Docker: build images (`make docker.api|docker.web|docker.sim`), run full stack (`make compose.up`), stop (`make compose.down`). Compose defines `db`, a one-shot `api-migrate` job (runs Prisma migrate deploy before startup), then `api`, `sim`, and `web`.
Ports: API on 3001 (`GET /v1/health`), Sim on 3002 (`GET /v1/health`, `GET /v1/sim/pv?lat&lon&kw`). Backend uses NestJS + Prisma. Prisma schema: `apps/api/prisma/schema.prisma`; set `DATABASE_URL` in `.env`.
For containerized web deploys: Next builds with `output: 'standalone'` — run `node dist/apps/web/.next/standalone/server.js` in the image.

## Coding Style & Naming Conventions
- TypeScript: 2‑space indent; strict TS. Use ESLint + Prettier. DTOs `CreatePpaDto`, modules `PpaModule`, services `PpaService`.
- SQL: UPPERCASE keywords; tables plural `snake_case` (e.g., `power_plants`, `ppa_contracts`), columns `snake_case`, PK `id`, FKs `*_id`.
- Routing: version REST (`GET /v1/ppas/:id`). Prefer composition and small modules.

## UI (Tailwind + shadcn/ui)
- We use Tailwind as the styling system; shadcn/ui generates local components. Install with `cd apps/web && pnpm dlx shadcn@latest init`.
- Tailwind config at `apps/web/tailwind.config.ts`:
  - `darkMode: 'class'`
  - `content`: `['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}','../../libs/**/*.{ts,tsx}']`
  - `plugins`: `[require('tailwindcss-animate')]`
  - `theme.extend` maps tokens to CSS vars, e.g., `primary: 'hsl(var(--primary))'`.
- Global tokens in `apps/web/app/globals.css` (`:root` and `.dark`). Keep contrast AA+.
- Generate components: `pnpm dlx shadcn@latest add button input card dialog dropdown-menu form toast ...` into `apps/web/components/ui/*`; utility `apps/web/lib/utils.ts` exports `cn`.
- Conventions: PascalCase components, no default exports, style variants via `class-variance-authority` (cva), merge classes with `tailwind-merge`. If sharing UI, move to `libs/ui` and include it in Tailwind `content`.

## Testing Guidelines
- Jest for NestJS and sim; Playwright/Cypress for web e2e. Place tests under `apps/*/src/**/{__tests__,*.spec.ts}`. Target ≥ 80% coverage. DB tests run against Docker Postgres or a dedicated test DB.

## Commit & Pull Request Guidelines
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`). One logical change per PR. Include purpose, linked issues, test plan, and UI screenshots. Update migrations/seeds with schema changes. Keep CI green.

## Security & Configuration Tips
- Never commit secrets. Provide `.env.example` (`DATABASE_URL`, `SIM_API_KEY`, `NEXT_PUBLIC_*`); use `.env.local` (git‑ignored). Review migrations and avoid destructive changes without a safe rollout plan.

## CI
- GitHub Actions workflow at `.github/workflows/ci.yml` uses pnpm, caches deps, and runs `lint`, `build`, and `test` across all projects.

## TypeScript Notes
- We temporarily set `ignoreDeprecations: '5.0'` in `tsconfig.base.json` to silence the upcoming deprecation of `baseUrl` in future TS versions. Path alias `@ui` is defined via `compilerOptions.paths` and remains supported.
- Migration plan: move aliases to package subpath imports/exports (e.g., `"imports": { "#ui": "libs/ui/src/index.ts" }`) or library package.json `exports` when extracting libs for publish. We’ll remove `baseUrl` once upstream tooling fully supports this setup across Nx/Next.
