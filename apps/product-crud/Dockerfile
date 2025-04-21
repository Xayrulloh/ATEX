FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build

RUN pnpm --filter=product-crud drizzle:push

CMD ["pnpm", "start", "--filter=product-crud"]
