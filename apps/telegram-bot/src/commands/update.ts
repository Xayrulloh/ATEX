import { ProductType } from "@shared/src/schema/product";
import { client } from "../helper/axios";

export async function update(id: string, name: string): Promise<ProductType> {
  const response = await client
    .put(`/products/${id}`, { name })
    .catch((error) => {
      console.error("Error updating product:", error);
    });

  return response?.data || "Something went wrong";
}
