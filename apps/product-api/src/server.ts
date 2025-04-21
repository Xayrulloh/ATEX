import Fastify from "fastify";
import productRoutes from "./routes/product";
import { getNatsClient } from "./nats/client";

export async function buildServer() {
  const app = Fastify({ logger: true });

  const nats = await getNatsClient();
  app.decorate("nats", nats);

  app.register(productRoutes, { prefix: "/products" });

  return app;
}
