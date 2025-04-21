import { z } from "zod";

const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});
type ProductType = z.infer<typeof ProductSchema>;

const CreateProductSchema = ProductSchema.omit({ id: true });
type CreateProductType = z.infer<typeof CreateProductSchema>;

const ProductParamsSchema = ProductSchema.pick({ id: true });
type ProductParamsType = z.infer<typeof ProductParamsSchema>;

export {
  ProductSchema,
  ProductType,
  CreateProductSchema,
  CreateProductType,
  ProductParamsSchema,
  ProductParamsType,
};
