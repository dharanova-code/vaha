import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "./src/infrastructure/database/migrations",
  dialect: "sqlite",
  driver: "expo",
});
