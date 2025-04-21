FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build

RUN pnpm drizzle:push

CMD ["node", "dist/main.js"]
