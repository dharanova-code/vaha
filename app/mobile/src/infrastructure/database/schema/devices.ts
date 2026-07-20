import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const devices = sqliteTable("devices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  name: text("name").notNull(),
  model: text("model"),
  firmware: text("firmware"),
  lastSeen: integer("last_seen", { mode: "timestamp" }),
  trusted: integer("trusted", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;
