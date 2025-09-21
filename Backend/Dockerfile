FROM node:20-alpine AS base

WORKDIR /app

RUN  npm i -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]