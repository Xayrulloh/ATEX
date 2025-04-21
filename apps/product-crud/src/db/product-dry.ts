import { ProductType } from "@shared/schema/product";
import { db } from "./drizzle";
import { eq } from "drizzle-orm";
import { productsSchema } from "./schema";

export async function findProducts(): Promise<ProductType[]> {
  return db.query.productsSchema.findMany();
}

export async function findProduct(
  id: string,
): Promise<ProductType | undefined> {
  return db.query.productsSchema.findFirst({
    where: eq(productsSchema.id, id),
  });
}

export async function createProduct(name: string): Promise<ProductType> {
  return (await db.insert(productsSchema).values({ name }).returning())[0];
}

export async function updateProduct(
  id: string,
  name: string,
): Promise<ProductType> {
  return (
    await db
      .update(productsSchema)
      .set({ name })
      .where(eq(productsSchema.id, id))
      .returning()
  )[0];
}

export async function deleteProduct(id: string): Promise<ProductType> {
  return (
    await db.delete(productsSchema).where(eq(productsSchema.id, id)).returning()
  )[0];
}
