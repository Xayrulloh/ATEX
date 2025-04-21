import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const productsSchema = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  name: text("name").notNull(),
});
