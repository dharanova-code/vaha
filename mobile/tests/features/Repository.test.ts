import { Container } from "../../src/core/di/Container";
import { bootstrapDI } from "../../src/core/di/bootstrap";
import { CaptureRepository } from "../../src/features/captures/repositories/CaptureRepository";
import { CollectionRepository } from "../../src/features/collections/repositories/CollectionRepository";
import { TagRepository } from "../../src/features/tags/repositories/TagRepository";
import { DeviceRepository } from "../../src/features/devices/repositories/DeviceRepository";
import { SettingsRepository } from "../../src/features/settings/repositories/SettingsRepository";
import { SyncRepository } from "../../src/features/sync/repositories/SyncRepository";

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
    setAudioModeAsync: jest.fn(),
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
      getURI: jest.fn().mockReturnValue("file://test.wav"),
    })),
  },
}));

const mockInsertReturning = jest.fn(() => Promise.resolve([{ id: 1 }]));
const mockUpdateReturning = jest.fn(() => Promise.resolve([{ id: 1 }]));
const mockDeleteReturning = jest.fn(() => Promise.resolve([{ id: 1 }]));
const mockSelect = jest.fn(() => ({
  from: jest.fn(() => ({
    where: jest.fn(() => Promise.resolve([])),
    innerJoin: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve([])),
    })),
  })),
}));

jest.mock("../../src/infrastructure/database/config/Database", () => ({
  Database: {
    getInstance: () => ({
      getDb: () => ({
        insert: jest.fn(() => ({
          values: jest.fn(() => ({
            returning: mockInsertReturning,
            onConflictDoNothing: jest.fn(() => Promise.resolve()),
          })),
        })),
        update: jest.fn(() => ({
          set: jest.fn(() => ({
            where: jest.fn(() => ({
              returning: mockUpdateReturning,
            })),
          })),
        })),
        delete: jest.fn(() => ({
          where: jest.fn(() => ({
            returning: mockDeleteReturning,
          })),
        })),
        select: mockSelect,
        transaction: jest.fn((cb) => cb({})),
      }),
    }),
  },
}));

describe("Repositories Integration & DI", () => {
  beforeAll(() => {
    bootstrapDI();
  });

  it("should resolve registered repository interfaces", () => {
    const container = Container.getInstance();
    expect(
      container.resolve<CaptureRepository>("CaptureRepository"),
    ).toBeDefined();
    expect(
      container.resolve<CollectionRepository>("CollectionRepository"),
    ).toBeDefined();
    expect(container.resolve<TagRepository>("TagRepository")).toBeDefined();
    expect(
      container.resolve<DeviceRepository>("DeviceRepository"),
    ).toBeDefined();
    expect(
      container.resolve<SettingsRepository>("SettingsRepository"),
    ).toBeDefined();
    expect(container.resolve<SyncRepository>("SyncRepository")).toBeDefined();
  });

  it("should complete CaptureRepository operations", async () => {
    const repo = Container.getInstance().resolve<CaptureRepository>(
      "CaptureRepository",
    );
    const res = await repo.create({
      uuid: "cap-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      syncState: "pending",
    });
    expect(res.isSuccess).toBe(true);
    expect(res.getValueOrThrow()).toEqual({ id: 1 });
  });

  it("should complete CollectionRepository operations", async () => {
    const repo = Container.getInstance().resolve<CollectionRepository>(
      "CollectionRepository",
    );
    const res = await repo.findAll();
    expect(res.isSuccess).toBe(true);
  });
});
