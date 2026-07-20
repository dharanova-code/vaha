import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { captures } from "./captures";

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const captureTags = sqliteTable(
  "capture_tags",
  {
    captureId: integer("capture_id")
      .notNull()
      .references(() => captures.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    captureIdIdx: index("capture_tags_capture_id_idx").on(table.captureId),
    tagIdIdx: index("capture_tags_tag_id_idx").on(table.tagId),
  }),
);

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type CaptureTag = typeof captureTags.$inferSelect;
export type NewCaptureTag = typeof captureTags.$inferInsert;
