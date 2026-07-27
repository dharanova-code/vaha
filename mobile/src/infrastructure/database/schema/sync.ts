import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

export const syncQueue = sqliteTable(
  "sync_queue",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entity: text("entity").notNull(),
    entityId: integer("entity_id").notNull(),
    operation: text("operation", {
      enum: ["insert", "update", "delete"],
    }).notNull(),
    status: text("status", {
      enum: ["pending", "processing", "completed", "failed"],
    })
      .notNull()
      .default("pending"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    statusIdx: index("sync_queue_status_idx").on(table.status),
    createdAtIdx: index("sync_queue_created_at_idx").on(table.createdAt),
  }),
);

export type SyncQueueItem = typeof syncQueue.$inferSelect;
export type NewSyncQueueItem = typeof syncQueue.$inferInsert;
