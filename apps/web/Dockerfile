# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web ./apps/web
COPY libs ./libs
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec next build apps/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Copy Next standalone server and assets
# Copy only the built app subtree from standalone so server.js is at project root
COPY --from=builder /workspace/apps/web/.next/standalone/node_modules ./node_modules
COPY --from=builder /workspace/apps/web/.next/standalone/apps/web ./
COPY --from=builder /workspace/apps/web/.next/static ./.next/static
COPY --from=builder /workspace/apps/web/public ./public
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node","server.js"]
