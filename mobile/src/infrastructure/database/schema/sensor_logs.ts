import { sqliteTable, integer, real } from "drizzle-orm/sqlite-core";

export const sensorLogs = sqliteTable("sensor_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  voc: real("voc"),
  flowRate: real("flow_rate"),
  accumulatedVolume: real("accumulated_volume"),
});

export type SensorLog = typeof sensorLogs.$inferSelect;
export type NewSensorLog = typeof sensorLogs.$inferInsert;
