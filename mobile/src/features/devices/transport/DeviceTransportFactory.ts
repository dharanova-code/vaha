import { DeviceTransport } from "./DeviceTransport";
import {
  HttpDeviceTransport,
  HttpTransportConfig,
} from "./HttpDeviceTransport";
import { MockDeviceTransport } from "./MockDeviceTransport";
import { Logger } from "@core/logger/Logger";
import { DEV_STATIC_TOKEN } from "../constants/ApiCompatibility";
import { appConfig } from "@core/config/AppConfig";

/**
 * Configuration required by DeviceTransportFactory to create a transport.
 */
export interface TransportFactoryConfig {
  /** Resolved IP address of the device on the local network */
  readonly deviceIp: string;
  /** Device UUID from the devices table */
  readonly deviceUuid: string;
  /**
   * Auth token for this session.
   * In Phase D, pass DEV_STATIC_TOKEN.
   * Post Milestone 7 (BLE pairing), pass the HMAC-SHA256 session token.
   */
  readonly authToken?: string;
  /** Port override — defaults to 8080 */
  readonly port?: number;
}

/**
 * Factory responsible for creating DeviceTransport instances.
 *
 * Centralises transport construction so the rest of the codebase
 * never imports concrete transport classes directly. Future transport
 * implementations (BLE, USB) can be added here without changing callers.
 */
export class DeviceTransportFactory {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Create an HTTP/WebSocket transport for a device resolved on the local network.
   *
   * @param config - Factory configuration including resolved device IP and credentials
   * @returns A DeviceTransport instance ready to make requests
   */
  createHttpTransport(config: TransportFactoryConfig): DeviceTransport {
    if (appConfig.useMockDevice) {
      this.logger.info("[COMM] Creating Mock transport", {
        uuid: config.deviceUuid,
      });
      return new MockDeviceTransport(config.deviceUuid, this.logger);
    }

    const transportConfig: HttpTransportConfig = {
      deviceIp: config.deviceIp,
      deviceUuid: config.deviceUuid,
      authToken: config.authToken ?? DEV_STATIC_TOKEN,
      ...(config.port !== undefined ? { port: config.port } : {}),
    };

    this.logger.info("[COMM] Creating HTTP transport", {
      ip: config.deviceIp,
      uuid: config.deviceUuid,
    });

    return new HttpDeviceTransport(transportConfig, this.logger);
  }
}
