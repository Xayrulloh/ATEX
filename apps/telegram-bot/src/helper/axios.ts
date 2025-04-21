import axios from "axios";

export const client = axios.create({
  baseURL: "http://product-api:3000",
});
