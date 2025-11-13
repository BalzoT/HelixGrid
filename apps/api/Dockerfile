# syntax=docker/dockerfile:1

FROM node:20-slim AS base
RUN corepack enable \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec prisma generate --schema apps/api/prisma/schema.prisma
RUN pnpm exec tsc -p apps/api/tsconfig.build.json
RUN set -eux; \
  mkdir -p /workspace/prisma-pack; \
  cp -rL /workspace/node_modules/@prisma/client /workspace/prisma-pack/client; \
  PRISMA_DIR=$(find /workspace/node_modules -type d -path "*/node_modules/.prisma" | head -n1 || true); \
  if [ -n "$PRISMA_DIR" ]; then cp -r "$PRISMA_DIR" /workspace/prisma-pack/.prisma; fi

FROM base AS migration
WORKDIR /workspace
COPY apps/api/prisma ./apps/api/prisma
CMD ["pnpm","dlx","prisma","migrate","deploy","--schema","apps/api/prisma/schema.prisma"]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store corepack enable && pnpm install --prod --frozen-lockfile --ignore-scripts
COPY --from=builder /workspace/dist/apps/api ./dist
# Ensure generated Prisma client is available at runtime
# Copy prepacked Prisma client and engines
COPY --from=builder /workspace/prisma-pack/client ./node_modules/@prisma/client
COPY --from=builder /workspace/prisma-pack/.prisma ./node_modules/.prisma
ENV PORT=3001
EXPOSE 3001
USER node
CMD ["node","dist/main.js"]
