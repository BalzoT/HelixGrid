# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/sim ./apps/sim
COPY libs ./libs
RUN pnpm install --frozen-lockfile
RUN pnpm nx build sim

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /workspace/dist/apps/sim ./dist
ENV PORT=3002
EXPOSE 3002
CMD ["node","dist/index.js"]

