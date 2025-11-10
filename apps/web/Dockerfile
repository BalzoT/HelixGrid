# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/web ./apps/web
COPY libs ./libs
RUN pnpm install --frozen-lockfile
RUN pnpm nx build web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Copy Next standalone server and assets
COPY --from=builder /workspace/dist/apps/web/.next/standalone ./
COPY --from=builder /workspace/dist/apps/web/.next/static ./.next/static
COPY --from=builder /workspace/apps/web/public ./public
ENV PORT=3000
EXPOSE 3000
CMD ["node","server.js"]

