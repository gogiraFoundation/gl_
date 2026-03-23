# Use Node 20 Alpine; refresh apk for base image security (e.g. OpenSSL)
FROM node:25.8.1-alpine AS deps
RUN apk update && apk upgrade --no-cache && npm install -g npm@latest

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

FROM node:25.8.1-alpine AS builder
RUN apk update && apk upgrade --no-cache && npm install -g npm@latest

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Ensure /app/public exists after build (some Next versions omit empty public from standalone; COPY needs this path)
RUN mkdir -p public && touch public/.gitkeep

# Production stage
FROM node:25.8.1-alpine AS runner
RUN apk update && apk upgrade --no-cache && npm install -g npm@latest

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
