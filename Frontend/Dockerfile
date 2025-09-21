FROM node:20-alpine AS build

WORKDIR /app

RUN npm i -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "host"]