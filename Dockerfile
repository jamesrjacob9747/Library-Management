# syntax=docker/dockerfile:1

# ── Stage 1: Build Frontend ─────────────────────────────────────────

FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./

RUN npm ci

COPY frontend/ .

ARG VITE_API_KEY
ARG VITE_API_BASE_URL=/api

ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


# ── Stage 2: Build Backend ──────────────────────────────────────────

FROM node:20-alpine AS backend-build

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./

RUN npm ci

COPY backend/prisma ./prisma
COPY backend/prisma.config.js ./

# Dummy DATABASE_URL is only required during image build
# for Prisma client generation.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY backend/ .


# ── Stage 3: Final Image ───────────────────────────────────────────

FROM postgres:16-alpine

RUN apk add --no-cache nodejs npm nginx tini su-exec \
  && mkdir -p /run/nginx /var/log/nginx


# ── Copy backend ───────────────────────────────────────────────────

WORKDIR /app/backend

COPY --from=backend-build /app /app/backend


# ── Copy frontend build ────────────────────────────────────────────

COPY --from=frontend-build /app/dist /usr/share/nginx/html


# ── Nginx configuration ────────────────────────────────────────────

COPY <<'NGINX_CONF' /etc/nginx/http.d/default.conf

server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;

    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;

    # ── Backend API ────────────────────────────────────────────────

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 30s;
    }

    # ── Backend health check ───────────────────────────────────────

    location /health {
        proxy_pass http://127.0.0.1:3001/health;
    }

    # ── React frontend ────────────────────────────────────────────

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ── Static assets ──────────────────────────────────────────────

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

NGINX_CONF


# ── Entrypoint script ──────────────────────────────────────────────

COPY <<'ENTRYPOINT_SCRIPT' /entrypoint.sh

#!/bin/sh

set -e


# ── Default database variables ─────────────────────────────────────

: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=}"
: "${DB_NAME:=library_management}"


PGDATA="/var/lib/postgresql/data"

export PGDATA


# ── Database configuration ─────────────────────────────────────────

# If DATABASE_URL is provided, use the external RDS PostgreSQL database.
#
# Otherwise, start the PostgreSQL server inside this container.

if [ -n "${DATABASE_URL:-}" ]; then

    echo "[init] Using external PostgreSQL database"

    USING_EXTERNAL_DB=true

else

    echo "[init] Using PostgreSQL inside container"

    USING_EXTERNAL_DB=false

    : "${DB_PASSWORD:?DB_PASSWORD is required}"

    export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"


    # ── Initialize local PostgreSQL if fresh volume ───────────────

    if [ ! -s "$PGDATA/PG_VERSION" ]; then

        echo "[init] Creating PostgreSQL data directory..."

        su-exec postgres initdb -D "$PGDATA"

        sed -i \
            "s/#listen_addresses = 'localhost'/listen_addresses = '127.0.0.1'/" \
            "$PGDATA/postgresql.conf"

    fi


    # ── Start local PostgreSQL ────────────────────────────────────

    echo "[init] Starting local PostgreSQL..."

    su-exec postgres \
        pg_ctl \
        -D "$PGDATA" \
        -w start \
        -o "-k /run/postgresql"


    # ── Create database if needed ─────────────────────────────────

    su-exec postgres psql -tc \
        "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" \
        | grep -q 1 \
        || su-exec postgres createdb "$DB_NAME"


    echo "[init] Local database '${DB_NAME}' ready."

fi


# ── Push Prisma schema ─────────────────────────────────────────────

echo "[init] Checking Prisma schema..."

cd /app/backend

npx prisma db push --schema=./prisma/schema.prisma


# ── Optional database seed ─────────────────────────────────────────

if [ "${SEED_DB}" = "true" ]; then

    echo "[init] Seeding database..."

    API_KEY="${API_KEY}" node src/seeds/run.js

fi


# ── Start backend ──────────────────────────────────────────────────

echo "[init] Starting backend on :3001..."

NODE_ENV=production \
PORT=3001 \
API_KEY="${API_KEY}" \
FRONTEND_URL="http://localhost" \
node src/app.js &

NODE_PID=$!


# ── Start Nginx ────────────────────────────────────────────────────

echo "[init] Starting Nginx on :80..."

nginx -g "daemon off;" &

NGINX_PID=$!


# ── Graceful shutdown handler ─────────────────────────────────────

cleanup() {

    echo "[shutdown] Stopping services..."

    nginx -s quit 2>/dev/null || true

    kill "$NODE_PID" 2>/dev/null || true


    # Only stop PostgreSQL if this container is using
    # the internal PostgreSQL database.

    if [ "$USING_EXTERNAL_DB" = "false" ]; then

        su-exec postgres \
            pg_ctl \
            -D "$PGDATA" \
            stop \
            -m fast \
            2>/dev/null || true

    fi

    exit 0
}


trap cleanup SIGTERM SIGINT


# ── All services running ──────────────────────────────────────────

echo "[init] All services running -- http://localhost"

wait

ENTRYPOINT_SCRIPT


# ── Normalize line endings and make entrypoint executable ──────────

RUN sed -i 's/\r$//' /entrypoint.sh \
  && chmod +x /entrypoint.sh


# ── Container configuration ───────────────────────────────────────

EXPOSE 80

VOLUME ["/var/lib/postgresql/data"]


# tini handles zombie reaping and signal forwarding

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]