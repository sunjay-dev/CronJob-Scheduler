FROM node:20-alpine AS base

WORKDIR /app

RUN  npm i -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install 

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]    