# Stage 1: Build the application
FROM docker.io/library/node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Copy dependency manifests and workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

# Install dependencies respecting lockfile
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm build

# Stage 2: Production Nginx web server (non-root)
FROM docker.io/library/nginx:alpine AS runner

# Copy optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled artifacts from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure permissions to run Nginx as non-root user
RUN sed -i 's,/run/nginx.pid,/tmp/nginx.pid,; s,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
