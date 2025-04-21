import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/products",
});

export const db = drizzle(pool, { schema });
