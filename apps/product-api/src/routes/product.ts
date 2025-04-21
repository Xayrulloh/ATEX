import { FastifyInstance } from "fastify";
import { sc } from "../nats/client";
import {
  CreateProductSchema,
  ProductParamsSchema,
  ProductType,
} from "@repo/shared/schema/product";
import { validate } from "@repo/shared/utils/validate";

export default async function productRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply): Promise<ProductType[]> => {
    const msg = await app.nats.request("product.getAll", sc.encode(""), {
      timeout: 2000,
    });
    const data = sc.decode(msg.data);

    return reply.send(JSON.parse(data));
  });

  app.get("/:id", async (req, reply): Promise<ProductType> => {
    const idResult = validate(req.params, ProductParamsSchema);

    if (!idResult.success) {
      return reply.status(400).send(idResult.error.message);
    }

    const { id } = idResult.data;

    const msg = await app.nats.request("product.getOne", sc.encode(id), {
      timeout: 2000,
    });
    const data = sc.decode(msg.data);

    return reply.send(JSON.parse(data));
  });

  app.post("/", async (req, reply): Promise<ProductType> => {
    const body = validate(req.body, CreateProductSchema);

    if (!body.success) {
      return reply.status(400).send(body.error.message);
    }

    const msg = await app.nats.request(
      "product.create",
      sc.encode(JSON.stringify(body.data)),
      { timeout: 2000 },
    );

    const data = sc.decode(msg.data);

    return reply.send(JSON.parse(data));
  });

  app.put("/:id", async (req, reply): Promise<ProductType> => {
    const param = validate(req.params, ProductParamsSchema);

    if (!param.success) {
      return reply.status(400).send(param.error.message);
    }

    const { id } = param.data;

    const result = CreateProductSchema.safeParse(req.body);

    if (!result.success) {
      return reply.status(400).send(result.error.message);
    }

    const msg = await app.nats.request(
      "product.update",
      sc.encode(JSON.stringify({ id, ...result.data })),
      { timeout: 2000 },
    );
    const data = sc.decode(msg.data);

    return reply.send(JSON.parse(data));
  });

  app.delete("/:id", async (req, reply): Promise<ProductType> => {
    const idResult = validate(req.params, ProductParamsSchema);

    if (!idResult.success) {
      return reply.status(400).send(idResult.error.message);
    }

    const { id } = idResult.data;

    const msg = await app.nats.request("product.delete", sc.encode(id), {
      timeout: 2000,
    });
    const data = sc.decode(msg.data);

    return reply.send(JSON.parse(data));
  });
}
