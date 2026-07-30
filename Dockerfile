# Build and run the Hono API server only. The UI is deployed separately as a
# static site (S3 + CloudFront), so this image contains just the API.

# --- Stage 1: bundle the server ---
FROM node:22-alpine AS server-build

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/ ./
RUN npm run build

# --- Stage 2: runtime ---
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Prod deps only.
COPY server/package*.json ./
RUN npm ci --omit=dev

COPY --from=server-build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
