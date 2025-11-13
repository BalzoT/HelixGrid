# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/sim ./apps/sim
COPY libs ./libs
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts && pnpm exec tsc -p apps/sim/tsconfig.build.json

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /workspace/dist/apps/sim ./dist
ENV PORT=3002
EXPOSE 3002
USER node
CMD ["node","dist/index.js"]
