import { db } from "../db/drizzle";
import { NatsConnection } from "nats";
import {
  CreateProductSchema,
  ProductParamsSchema,
} from "@repo/shared/schema/product";
import { validate } from "@repo/shared/utils/validate";
import { productsSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { redis } from "../redis/client";
import {
  createProduct,
  deleteProduct,
  findProduct,
  findProducts,
  updateProduct,
} from "../db/product-dry";

export const handleProductCRUD = async (nats: NatsConnection) => {
  // GET ALL
  nats.subscribe("product.getAll", {
    callback: async (err, msg) => {
      if (err || !msg) return;

      try {
        const cached = await redis.get("products");

        if (cached) {
          return nats.publish(msg.reply!, cached);
        }

        const products = await findProducts();
        const data = JSON.stringify(products);

        nats.publish(msg.reply!, data);

        await redis.set("products", data, "EX", 60);
      } catch (e) {
        console.log("🚀 ~ callback: ~ e:", e);

        nats.publish(msg.reply!, JSON.stringify({ error: "get all failed" }));
      }
    },
  });

  // GET ONE
  nats.subscribe("product.getOne", {
    callback: async (err, msg) => {
      if (err || !msg) return;

      try {
        const id = msg.data.toString();
        const parsed = validate({ id }, ProductParamsSchema);

        if (!parsed.success) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: parsed.error.message }),
          );
        }

        const product = await findProduct(parsed.data.id);

        if (!product) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: "Product not found" }),
          );
        }

        nats.publish(msg.reply!, JSON.stringify(product));
      } catch (e) {
        console.log("🚀 ~ callback: ~ e:", e);

        nats.publish(msg.reply!, JSON.stringify({ error: "delete failed" }));
      }
    },
  });

  // CREATE
  nats.subscribe("product.create", {
    callback: async (err, msg) => {
      if (err || !msg) return;

      try {
        const parsed = validate(
          JSON.parse(msg.data.toString()),
          CreateProductSchema,
        );

        if (!parsed.success) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: parsed.error.message }),
          );
        }

        const created = await createProduct(parsed.data.name);

        nats.publish(msg.reply!, JSON.stringify(created));

        await redis.del("products");
      } catch (e) {
        console.log("🚀 ~ callback: ~ e:", e);

        nats.publish(msg.reply!, JSON.stringify({ error: "create failed" }));
      }
    },
  });

  // UPDATE
  nats.subscribe("product.update", {
    callback: async (err, msg) => {
      if (err || !msg) return;

      try {
        const { id, ...rest } = JSON.parse(msg.data.toString());
        const parsedId = validate({ id }, ProductParamsSchema);
        const parsedData = validate(rest, CreateProductSchema);

        if (!parsedId.success) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: parsedId.error.message }),
          );
        }

        if (!parsedData.success) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: parsedData.error.message }),
          );
        }

        const product = await findProduct(parsedId.data.id);

        if (!product) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: "Product not found" }),
          );
        }

        const updated = await updateProduct(
          parsedId.data.id,
          parsedData.data.name,
        );

        nats.publish(msg.reply!, JSON.stringify(updated));

        await redis.del("products");
      } catch (e) {
        console.log("🚀 ~ callback: ~ e:", e);

        nats.publish(msg.reply!, JSON.stringify({ error: "update failed" }));
      }
    },
  });

  // DELETE
  nats.subscribe("product.delete", {
    callback: async (err, msg) => {
      if (err || !msg) return;

      try {
        const id = msg.data.toString();
        const parsed = validate({ id }, ProductParamsSchema);

        if (!parsed.success) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: parsed.error.message }),
          );
        }

        const product = await findProduct(parsed.data.id);

        if (!product) {
          return nats.publish(
            msg.reply!,
            JSON.stringify({ error: "Product not found" }),
          );
        }

        const deleted = await deleteProduct(parsed.data.id);

        nats.publish(msg.reply!, JSON.stringify(deleted));

        await redis.del("products");
      } catch (e) {
        console.log("🚀 ~ callback: ~ e:", e);

        nats.publish(msg.reply!, JSON.stringify({ error: "delete failed" }));
      }
    },
  });
};
