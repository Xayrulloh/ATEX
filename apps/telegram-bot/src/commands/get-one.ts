import { ProductType } from "@shared/src/schema/product";
import { client } from "../helper/axios";

export async function getOne(id: string): Promise<ProductType> {
  const response = await client.get(`/products/${id}`).catch((error) => {
    console.error("Error getting product:", error);
  });

  return response?.data || "Something went wrong";
}
