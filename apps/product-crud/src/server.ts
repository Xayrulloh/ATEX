import fastify from "fastify";
import { connect } from "nats";
import { handleProductCRUD } from "./routes/product";

export const buildServer = async () => {
  const app = fastify();

  const nats = await connect({ servers: "nats://localhost:4222" });

  handleProductCRUD(nats);

  return app;
};
