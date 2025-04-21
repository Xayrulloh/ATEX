FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build

ENTRYPOINT pnpm --filter=product-crud drizzle:push && \
  pnpm start --filter=product-crud