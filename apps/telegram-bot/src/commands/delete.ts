import { ProductType } from "@repo/shared/schema/product";
import { client } from "../helper/axios";

export async function remove(id: string): Promise<ProductType> {
  const response = await client.delete(`/products/${id}`).catch((error) => {
    console.error("Error deleting product:", error);
  });

  return response?.data || "Something went wrong";
}
