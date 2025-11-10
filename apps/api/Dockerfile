# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs
RUN pnpm install --frozen-lockfile
RUN pnpm nx run api:prisma-generate
RUN pnpm nx build api

FROM base AS migration
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs
RUN pnpm install --frozen-lockfile
CMD ["pnpm","prisma","migrate","deploy","--schema","apps/api/prisma/schema.prisma"]

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile
COPY --from=builder /workspace/dist/apps/api ./dist
# Ensure generated Prisma client is available at runtime
COPY --from=builder /workspace/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /workspace/node_modules/.prisma ./node_modules/.prisma
ENV PORT=3001
EXPOSE 3001
CMD ["node","dist/main.js"]
