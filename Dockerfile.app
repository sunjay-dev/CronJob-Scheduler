ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.1

# --------------------- Base Stage ----------------
FROM node:${NODE_VERSION} AS base
  
ARG PNPM_VERSION

RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# --------------------- Client Builder Stage ----------------
FROM base AS client-builder

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY frontend/ ./
RUN pnpm build

# --------------------- Server Builder Stage ----------------
FROM base AS server-builder

WORKDIR /app
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY backend/ ./
RUN pnpm build

# --------------------- Prod Deps Stage ---------------------
FROM base AS prod-deps

WORKDIR /app
COPY backend/package.json backend/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# --------------------- Runner Stage ----------------
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=server-builder /app/dist ./dist
COPY --from=client-builder /app/dist ./dist/public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run server
CMD ["node", "./dist/src/server.js"]