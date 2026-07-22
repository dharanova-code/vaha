import { Result } from "../../../src/core/utils/Result";
import { DeviceTransport, DeviceStream, DeviceStreamMessage } from "../../../src/features/devices/transport/DeviceTransport";
import { DeviceDiscoveryService } from "../../../src/features/devices/services/DeviceDiscoveryService";
import { DeviceTransportFactory } from "../../../src/features/devices/transport/DeviceTransportFactory";
import { ConsoleLogger } from "../../../src/core/logger/Logger";
import { DeviceStatus } from "../../../src/features/devices/models/DeviceStatus";
import { CommunicationError, ApiVersionMismatchError } from "../../../src/core/errors/CommunicationError";

// ---------------------------------------------------------------------------
// Mock transport builder
// ---------------------------------------------------------------------------

function makeMockTransport(overrides?: Partial<DeviceTransport>): DeviceTransport {
  return {
    isConnected: true,
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    download: jest.fn(),
    upload: jest.fn(),
    openStream: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeValidStatus(overrides?: Partial<DeviceStatus>): DeviceStatus {
  return {
    device_id: "VAHA-88291-A",
    firmware_version: "1.0.4",
    api_version: "v1",
    capabilities: ["sensors", "audio_flac"],
    battery_percentage: 94,
    buffered_captures_count: 3,
    storage_used_bytes: 18291000,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Mock transport factory
// ---------------------------------------------------------------------------

function makeMockFactory(transport: DeviceTransport): DeviceTransportFactory {
  const factory = {
    createHttpTransport: jest.fn().mockReturnValue(transport),
  } as unknown as DeviceTransportFactory;
  return factory;
}

// ---------------------------------------------------------------------------
// Tests: DeviceDiscoveryService
// ---------------------------------------------------------------------------

describe("DeviceDiscoveryService", () => {
  const logger = new ConsoleLogger();

  describe("scan()", () => {
    it("returns an empty array (mDNS not yet implemented in Phase D)", async () => {
      const transport = makeMockTransport();
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      const results = await service.scan();
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });
  });

  describe("connectToIp()", () => {
    it("returns a transport on successful handshake with compatible api_version", async () => {
      const validStatus = makeValidStatus();
      const transport = makeMockTransport({
        get: jest.fn().mockResolvedValue(Result.ok(validStatus)),
      });
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      const result = await service.connectToIp(
        "192.168.1.45",
        "VAHA-88291-A",
        "dev-token",
      );

      expect(result.isSuccess).toBe(true);
      expect(result.getValueOrThrow()).toBe(transport);
    });

    it("fails when /status returns an error", async () => {
      const transport = makeMockTransport({
        get: jest.fn().mockResolvedValue(
          Result.fail(new CommunicationError("timeout")),
        ),
      });
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      const result = await service.connectToIp(
        "192.168.1.45",
        "VAHA-88291-A",
        "dev-token",
      );

      expect(result.isSuccess).toBe(false);
      expect(result.getErrorOrThrow()).toBeInstanceOf(CommunicationError);
    });

    it("fails with ApiVersionMismatchError when device api_version is too old", async () => {
      const oldStatus = makeValidStatus({ api_version: "v0" });
      const transport = makeMockTransport({
        get: jest.fn().mockResolvedValue(Result.ok(oldStatus)),
      });
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      const result = await service.connectToIp(
        "192.168.1.45",
        "VAHA-88291-A",
        "dev-token",
      );

      expect(result.isSuccess).toBe(false);
      expect(result.getErrorOrThrow()).toBeInstanceOf(ApiVersionMismatchError);
    });

    it("closes transport if handshake fails", async () => {
      const transport = makeMockTransport({
        get: jest.fn().mockResolvedValue(
          Result.fail(new CommunicationError("refused")),
        ),
        close: jest.fn().mockResolvedValue(undefined),
      });
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      await service.connectToIp("192.168.1.45", "VAHA-88291-A", "dev-token");

      expect(transport.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("resolveDiscovered()", () => {
    it("delegates to connectToIp with the discovered device IP", async () => {
      const validStatus = makeValidStatus();
      const transport = makeMockTransport({
        get: jest.fn().mockResolvedValue(Result.ok(validStatus)),
      });
      const factory = makeMockFactory(transport);
      const service = new DeviceDiscoveryService(logger, factory);

      const result = await service.resolveDiscovered(
        {
          deviceId: "VAHA-88291-A",
          ip: "192.168.1.45",
          port: 8080,
          txtRecords: { api: "v1" },
        },
        "dev-token",
      );

      expect(result.isSuccess).toBe(true);
    });
  });
});
