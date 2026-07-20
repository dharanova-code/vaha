import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";
import { appConfig } from "@core/config/AppConfig";
import * as schema from "../schema";

export class Database {
  private static instance: Database;
  private expoDb: SQLiteDatabase | null = null;
  private drizzleDb: ExpoSQLiteDatabase<typeof schema> | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDb(): ExpoSQLiteDatabase<typeof schema> {
    if (!this.drizzleDb) {
      throw new Error("Database is not initialized. Call initialize() first.");
    }
    return this.drizzleDb;
  }

  public getExpoDb(): SQLiteDatabase {
    if (!this.expoDb) {
      throw new Error("Database is not initialized. Call initialize() first.");
    }
    return this.expoDb;
  }

  public initialize(): void {
    if (this.drizzleDb && this.expoDb) {
      return;
    }

    try {
      const dbName = appConfig.database.name;
      this.expoDb = openDatabaseSync(dbName);

      // Configure Write-Ahead Logging (WAL) for better performance on local devices
      this.expoDb.execSync("PRAGMA journal_mode = WAL;");

      this.drizzleDb = drizzle(this.expoDb, { schema });
    } catch (error) {
      throw error;
    }
  }

  public close(): void {
    if (this.expoDb) {
      this.expoDb.closeSync();
      this.expoDb = null;
      this.drizzleDb = null;
    }
  }
}
export type { ExpoSQLiteDatabase };
