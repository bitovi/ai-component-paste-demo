# Multi-stage build: build the UI and the server, then a slim runtime image
# that contains both. The server serves the built UI (ui/dist) same-origin.

# --- Stage 1: build the Vite UI ---
FROM node:22-alpine AS ui-build

WORKDIR /ui

COPY ui/package*.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build

# --- Stage 2: bundle the server ---
FROM node:22-alpine AS server-build

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/ ./
RUN npm run build

# --- Stage 3: runtime ---
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Prod deps only.
COPY server/package*.json ./
RUN npm ci --omit=dev

# Bundled server + built UI. The process runs from /app, so the server resolves
# ui/dist via process.cwd() (= /app).
COPY --from=server-build /app/dist ./dist
COPY --from=ui-build /ui/dist ./ui/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
