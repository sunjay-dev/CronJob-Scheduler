ARG NODE_VERSION=24.11.0
ARG PNPM_VERSION=10.17.1

# ==================== Base stage ============================================
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

# ==================== Dependencies stage ============================================
FROM base AS deps

RUN --mount=type=cache,target=/root/.npm \
npm install -g pnpm@${PNPM_VERSION}

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# ==================== Build stage ============================================
FROM deps AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# ==================== Final stage ============================================
FROM base AS final

ENV NODE_ENV=production

USER node
COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3002

CMD ["node", "./dist/app.js"]