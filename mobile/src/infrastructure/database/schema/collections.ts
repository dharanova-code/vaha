import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  name: text("name").notNull(),
  color: text("color"),
  icon: text("icon"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
