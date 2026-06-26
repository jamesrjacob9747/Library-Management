# ── Stage 1: deps (production only) ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Stage 2: prisma generate (needs devDeps for CLI) ────────────────────────
FROM node:20-alpine AS prisma-gen
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
# Use --schema directly; prisma.config.js requires DATABASE_URL which isn't available at build time
RUN npx prisma generate --schema=./prisma/schema.prisma

# ── Stage 3: final ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
# Prisma 7 generates into both .prisma AND @prisma/client
COPY --from=prisma-gen /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma-gen /app/node_modules/@prisma/client ./node_modules/@prisma/client
# Copy prisma CLI (devDep) so `prisma db push` can load prisma.config.js at runtime
COPY --from=prisma-gen /app/node_modules/prisma ./node_modules/prisma
COPY --from=prisma-gen /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/app.js"]
