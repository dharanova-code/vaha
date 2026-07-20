import { Database } from "../../src/infrastructure/database/config/Database";
import { DatabaseProvider } from "../../src/infrastructure/database/config/DatabaseProvider";
import { ConsoleLogger } from "../../src/core/logger/Logger";

const mockExecSync = jest.fn();
const mockCloseSync = jest.fn();

jest.mock("expo-sqlite", () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: mockExecSync,
    closeSync: mockCloseSync,
  })),
}));

jest.mock("drizzle-orm/expo-sqlite/migrator", () => ({
  migrate: jest.fn(() => Promise.resolve()),
}));

describe("Database Foundation", () => {
  let db: Database;
  let provider: DatabaseProvider;
  const logger = new ConsoleLogger();

  beforeEach(() => {
    jest.clearAllMocks();
    db = Database.getInstance();
    db.close();
    provider = new DatabaseProvider(logger);
  });

  it("should initialize and close connection successfully", async () => {
    const initRes = await provider.initialize();
    expect(initRes.isSuccess).toBe(true);

    const expoDb = db.getExpoDb();
    expect(expoDb).toBeDefined();
    expect(mockExecSync).toHaveBeenCalledWith("PRAGMA journal_mode = WAL;");

    const closeRes = await provider.close();
    expect(closeRes.isSuccess).toBe(true);
    expect(mockCloseSync).toHaveBeenCalled();
  });

  it("should execute migrations successfully", async () => {
    await provider.initialize();
    const migrateRes = await provider.runMigrations();
    expect(migrateRes.isSuccess).toBe(true);
  });

  it("should report database health status correctly", async () => {
    await provider.initialize();
    const healthRes = await provider.health();
    expect(healthRes.isSuccess).toBe(true);
    expect(healthRes.getValueOrThrow().status).toBe("healthy");
  });

  it("should throw error when resolving db before initialization", () => {
    expect(() => db.getDb()).toThrow();
  });
});
