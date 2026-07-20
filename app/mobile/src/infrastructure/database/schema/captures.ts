import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { collections } from "./collections";
import { devices } from "./devices";

export const captures = sqliteTable(
  "captures",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    uuid: text("uuid").notNull().unique(),
    title: text("title"),
    transcript: text("transcript"),
    summary: text("summary"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    collectionId: integer("collection_id").references(() => collections.id, {
      onDelete: "set null",
    }),
    deviceId: integer("device_id").references(() => devices.id, {
      onDelete: "set null",
    }),
    syncState: text("sync_state", {
      enum: ["pending", "synced", "failed"],
    })
      .notNull()
      .default("pending"),
  },
  (table) => ({
    createdAtIdx: index("captures_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("captures_updated_at_idx").on(table.updatedAt),
    collectionIdIdx: index("captures_collection_id_idx").on(table.collectionId),
    deviceIdIdx: index("captures_device_id_idx").on(table.deviceId),
    syncStateIdx: index("captures_sync_state_idx").on(table.syncState),
  }),
);

export type Capture = typeof captures.$inferSelect;
export type NewCapture = typeof captures.$inferInsert;
