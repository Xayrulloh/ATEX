import { buildServer } from "./server";

const start = async () => {
  const server = await buildServer();

  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });

    console.log("🚀 product-crud is running on http://localhost:3001");
  } catch (err) {
    server.log.error(err);

    process.exit(1);
  }
};

start();
