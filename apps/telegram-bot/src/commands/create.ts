import { ProductType } from "@shared/src/schema/product";
import { client } from "../helper/axios";

export async function create(name: string): Promise<ProductType> {
  const response = await client.post(`/products`, { name }).catch((error) => {
    console.error("Error creating product:", error);
  });

  return response?.data || "Something went wrong";
}
