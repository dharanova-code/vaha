import { Result } from "@core/utils/Result";
import { Container } from "@core/di/Container";
import { CommunicationError } from "@core/errors/CommunicationError";
import { DeviceStatus, LiveSensorReading, DeviceCaptureMetadata } from "../models/DeviceStatus";
import { DeviceTransportFactory } from "../transport/DeviceTransportFactory";
import { DeviceTransport, DeviceStream } from "../transport/DeviceTransport";
import { DeviceDiscoveryService } from "../services/DeviceDiscoveryService";
import { Logger } from "@core/logger/Logger";
import {
  DEVICE_HTTP_PORT,
  DEV_STATIC_TOKEN,
} from "../constants/ApiCompatibility";

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime_seconds: number;
}

export type SyncEventListener = (event: unknown) => void;

export interface DeviceClient {
  readonly isConnected: boolean;
  readonly deviceIp: string | null;
  readonly transport: DeviceTransport | null;

  connect(ip: string): Promise<Result<void, CommunicationError>>;
  disconnect(): Promise<void>;
  health(): Promise<Result<HealthResponse, CommunicationError>>;
  status(): Promise<Result<DeviceStatus, CommunicationError>>;
  getSensors(): Promise<Result<LiveSensorReading, CommunicationError>>;
  getSensorHistory(): Promise<Result<LiveSensorReading[], CommunicationError>>;
  getCaptures(): Promise<Result<DeviceCaptureMetadata[], CommunicationError>>;
  downloadCapture(txId: string): Promise<Result<ArrayBuffer, CommunicationError>>;
  deleteCapture(txId: string): Promise<Result<void, CommunicationError>>;
  subscribe(listener: SyncEventListener): () => void;
}

class DeviceClientImpl implements DeviceClient {
  transport: DeviceTransport | null = null;
  private ip: string | null = null;
  private listeners: Set<SyncEventListener> = new Set();
  private activeStream: DeviceStream | null = null;
  private logger: Logger;
  
  private discoveryService: DeviceDiscoveryService;
  private transportFactory: DeviceTransportFactory;

  constructor() {
    this.logger = Container.getInstance().resolve<Logger>("Logger");
    this.discoveryService = Container.getInstance().resolve("DeviceDiscoveryService");
    this.transportFactory = Container.getInstance().resolve("DeviceTransportFactory");
  }

  get isConnected(): boolean {
    return this.transport !== null;
  }

  get deviceIp(): string | null {
    return this.ip;
  }

  async connect(ip: string): Promise<Result<void, CommunicationError>> {
    // Phase E: Simple connection (no full mDNS yet)
    const transport = this.transportFactory.createHttpTransport({
      deviceIp: ip,
      deviceUuid: "device-uuid-stub",
      port: DEVICE_HTTP_PORT,
      authToken: DEV_STATIC_TOKEN,
    });
    
    // Connect handshake
    const handshakeResult = await this.discoveryService.connectToIp(ip, "device-uuid-stub", DEV_STATIC_TOKEN);
    if (!handshakeResult.isSuccess) {
      return Result.fail(handshakeResult.getErrorOrThrow());
    }

    this.transport = transport;
    this.ip = ip;

    // Open persistent WebSocket stream
    try {
      this.activeStream = this.transport.openStream(
        "/ws",
        (message) => {
          this.listeners.forEach((listener) => {
            try {
              listener(message);
            } catch (err) {
              this.logger.error("[DeviceClient] WS listener error", err);
            }
          });
        },
        (error) => {
          this.logger.error("[DeviceClient] WS stream error, disconnecting", error);
          this.disconnect();
        }
      );
    } catch (err) {
      this.logger.error("[DeviceClient] Failed to open WS stream", err);
    }

    return Result.ok(undefined);
  }

  async disconnect(): Promise<void> {
    if (this.activeStream) {
      this.activeStream.close();
      this.activeStream = null;
    }
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
      this.ip = null;
    }
  }

  private ensureConnected(): Result<DeviceTransport, CommunicationError> {
    if (!this.transport) {
      return Result.fail(new CommunicationError("Not connected to a device", "DISCONNECTED"));
    }
    return Result.ok(this.transport);
  }

  async health(): Promise<Result<HealthResponse, CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    return transportResult.getValueOrThrow().get<HealthResponse>("/health");
  }

  async status(): Promise<Result<DeviceStatus, CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    return transportResult.getValueOrThrow().get<DeviceStatus>("/status");
  }

  async getSensors(): Promise<Result<LiveSensorReading, CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    return transportResult.getValueOrThrow().get<LiveSensorReading>("/sensors/current");
  }

  async getSensorHistory(): Promise<Result<LiveSensorReading[], CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    return transportResult.getValueOrThrow().get<LiveSensorReading[]>("/sensors/history");
  }

  async getCaptures(): Promise<Result<DeviceCaptureMetadata[], CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    return transportResult.getValueOrThrow().get<DeviceCaptureMetadata[]>("/captures");
  }

  async downloadCapture(txId: string): Promise<Result<ArrayBuffer, CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    
    return transportResult.getValueOrThrow().download(`/captures/${txId}`, 0);
  }

  async deleteCapture(txId: string): Promise<Result<void, CommunicationError>> {
    const transportResult = this.ensureConnected();
    if (!transportResult.isSuccess) return Result.fail(transportResult.getErrorOrThrow());
    
    const result = await transportResult.getValueOrThrow().delete<{ success: boolean }>(`/captures/${txId}`);
    if (result.isSuccess && result.getValueOrThrow().success) {
      return Result.ok(undefined);
    } else if (result.isSuccess) {
        return Result.fail(new CommunicationError("Failed to delete", "REQUEST_FAILED"));
    }
    return Result.fail(result.getErrorOrThrow());
  }

  subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    // In a full implementation, we'd wire this to the transport's stream
    // For Phase E, we'll keep it simple
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Register as a singleton
Container.getInstance().singleton("DeviceClient", () => new DeviceClientImpl());

export function useDeviceClient(): DeviceClient {
  return Container.getInstance().resolve<DeviceClient>("DeviceClient");
}
