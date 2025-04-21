import { ProductType } from "@shared/src/schema/product";
import { client } from "../helper/axios";

export async function getAll(): Promise<ProductType[]> {
  const response = await client.get(`/products/`).catch((error) => {
    console.error("Error getting products:", error);
  });

  return response?.data || "Something went wrong";
}
