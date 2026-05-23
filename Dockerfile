# syntax=docker/dockerfile:1.7
# Multi-stage Dockerfile for Next.js 15 + Payload 3 (pnpm).
# Designed for Coolify (or any container host) with a persistent volume for /app/media.

ARG NODE_VERSION=22-alpine

# ---------- base ----------
FROM node:${NODE_VERSION} AS base
# libc6-compat: required by sharp's prebuilt binaries on Alpine.
RUN apk add --no-cache libc6-compat
# Enable pnpm via corepack. PNPM_HOME must be on PATH for shims.
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# Enable corepack and bake pnpm into this layer so the runtime stage doesn't
# have to download it on first boot.
RUN corepack enable && corepack prepare pnpm@latest-10 --activate

# ---------- deps ----------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Build-time placeholders. Real values are injected at runtime by the host
# (Coolify env vars). Payload's config only *reads* these — it doesn't connect
# to the DB during `next build`, since every page is dynamic (uses draftMode()).
ENV PAYLOAD_SECRET=build-placeholder-replace-at-runtime
ENV DATABASE_URI=postgres://placeholder:placeholder@localhost:5432/placeholder

RUN pnpm build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# Copy the built app + the bits needed to run migrations against payload.config.ts.
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/.npmrc ./.npmrc
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Persistent media directory — mount a volume here in Coolify (Storages → /app/media).
RUN mkdir -p /app/media && chown -R nextjs:nodejs /app/media
VOLUME ["/app/media"]

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
