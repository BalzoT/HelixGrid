.PHONY: help setup db-up db-down db-destroy migrate seed db-psql api.dev web.dev sim.dev build test lint format format.check affected graph reset clean

# Package manager (override: make PM=pnpm setup)
PM ?= pnpm
NX ?= pnpm exec nx
DC ?= docker compose
DB_SERVICE ?= db

help:
	@echo "HelixGrid Makefile (Nx monorepo)"
	@echo "setup          Install Node deps (PM=$(PM))"
	@echo "db-up          Start local Postgres via docker compose"
	@echo "db-down        Stop Postgres container"
	@echo "db-destroy     Stop and remove Postgres volumes"
	@echo "migrate        Apply SQL migrations in db/migrations"
	@echo "seed           Load seed data from db/seed"
	@echo "db-psql        Open psql inside the container"
	@echo "prisma.generate Generate Prisma client for API"
	@echo "prisma.migrate.dev Run Prisma dev migration"
	@echo "prisma.migrate.deploy Apply Prisma migrations in deploy mode"
	@echo "prisma.seed     Seed database via Prisma script"
	@echo "prisma.studio   Open Prisma Studio"
	@echo "api.dev        Run NestJS API in watch mode (Nx)"
	@echo "web.dev        Run Next.js dev server (Nx)"
	@echo "sim.dev        Run simulation API dev (Nx)"
	@echo "build          Build all projects (Nx)"
	@echo "test           Test all projects (Nx)"
	@echo "lint           Lint all projects (Nx)"
	@echo "format         Write formatting changes"
	@echo "format.check   Check formatting only"
	@echo "affected       Run affected build,test,lint (Nx)"
	@echo "graph          Open Nx project graph"
	@echo "reset          Reset Nx cache"
	@echo "clean          Remove build artifacts"
	@echo "docker.api     Build API Docker image"
	@echo "docker.web     Build Web Docker image"
	@echo "docker.sim     Build Sim Docker image"
	@echo "compose.up     Build and start all services"
	@echo "compose.down   Stop all services"
	@echo "compose.logs   Tail logs for all services"

setup:
	@if [ "$(PM)" = "pnpm" ]; then \
	  pnpm install; \
	elif [ "$(PM)" = "npm" ]; then \
	  (npm ci || npm install); \
	else \
	  yarn install --frozen-lockfile; \
	fi

db-up:
	$(DC) up -d $(DB_SERVICE)

db-down:
	$(DC) stop $(DB_SERVICE) || true

db-destroy:
	$(DC) down -v

migrate:
	@echo "Applying migrations in db/migrations to Postgres..."
	$(DC) exec -T $(DB_SERVICE) sh -lc 'set -eu; for f in /db/migrations/*.sql; do [ -e "$$f" ] || continue; echo ">> $$f"; psql -U $$POSTGRES_USER -d $$POSTGRES_DB -v ON_ERROR_STOP=1 -f "$$f"; done'

seed:
	@echo "Seeding database from db/seed..."
	$(DC) exec -T $(DB_SERVICE) sh -lc 'set -eu; for f in /db/seed/*.sql; do [ -e "$$f" ] || continue; echo ">> $$f"; psql -U $$POSTGRES_USER -d $$POSTGRES_DB -v ON_ERROR_STOP=1 -f "$$f"; done'

db-psql:
	$(DC) exec $(DB_SERVICE) psql -U postgres -d helixgrid

api.dev:
	$(NX) serve api

web.dev:
	$(NX) serve web

sim.dev:
	$(NX) serve sim

prisma.generate:
	$(NX) run api:prisma-generate

prisma.migrate.dev:
	$(NX) run api:prisma-migrate-dev

prisma.migrate.deploy:
	$(NX) run api:prisma-migrate-deploy

prisma.seed:
	$(NX) run api:prisma-seed

prisma.studio:
	$(NX) run api:prisma-studio

build:
	$(NX) run-many -t build --all

test:
	$(NX) run-many -t test --all --parallel=3

lint:
	$(NX) run-many -t lint --all

type-check:
	$(NX) run-many -t type-check --all

format:
	$(NX) format:write

format.check:
	$(NX) format:check

affected:
	$(NX) affected -t build,test,lint --parallel=3

graph:
	$(NX) graph

reset:
	$(NX) reset

clean:
	rm -rf dist

docker.api:
	docker build -f apps/api/Dockerfile -t helixgrid-api:local .

docker.web:
	docker build -f apps/web/Dockerfile -t helixgrid-web:local .

docker.sim:
	docker build -f apps/sim/Dockerfile -t helixgrid-sim:local .

compose.up:
	$(DC) up -d --build

compose.down:
	$(DC) down

compose.logs:
	$(DC) logs -f
