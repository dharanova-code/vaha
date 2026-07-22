import { Result } from "@core/utils/Result";
import {
  CommunicationError,
} from "@core/errors/CommunicationError";
import { Logger } from "@core/logger/Logger";
import { DeviceTransport } from "../transport/DeviceTransport";
import { DeviceTransportFactory } from "../transport/DeviceTransportFactory";
import { DeviceStatus } from "../models/DeviceStatus";
import {
  MDNS_SERVICE_TYPE,
  DEVICE_HTTP_PORT,
  MINIMUM_SUPPORTED_API_VERSION,
} from "../constants/ApiCompatibility";
import { ApiVersionMismatchError } from "@core/errors/CommunicationError";

import { appConfig } from "@core/config/AppConfig";

/**
 * Discovered device interface.
 */
export interface DiscoveredDevice {
  readonly deviceId: string;
  readonly ip: string;
  readonly port: number;
  readonly txtRecords: {
    readonly fw?: string;
    readonly model?: string;
    readonly api?: string;
  };
}

/**
 * DeviceDiscoveryService is responsible for...
 */
export class DeviceDiscoveryService {
  private readonly logger: Logger;
  private readonly transportFactory: DeviceTransportFactory;

  constructor(logger: Logger, transportFactory: DeviceTransportFactory) {
    this.logger = logger;
    this.transportFactory = transportFactory;
  }

  async scan(): Promise<DiscoveredDevice[]> {
    this.logger.info(
      `[COMM] Scanning for devices on ${MDNS_SERVICE_TYPE} (mDNS)`,
    );

    if (appConfig.useMockDevice) {
      this.logger.info("[COMM] Mock mode: returning simulated discovered device");
      return [
        {
          deviceId: "VAHA-MOCK-DEV",
          ip: "192.168.1.150",
          port: DEVICE_HTTP_PORT,
          txtRecords: {
            fw: "1.0.4-mock",
            model: "Uno Q Mock",
            api: "v1",
          },
        },
      ];
    }

    this.logger.warn(
      "[COMM] mDNS scanning not yet implemented. Use connectToIp() for Phase D testing.",
    );
    return [];
  }

  /**
   * Directly connect to a device at a known IP address.
   * Used as a fallback when mDNS is unavailable (e.g. enterprise networks)
   * or during Phase D development testing.
   *
   * @param deviceIp - IP address of the device
   * @param deviceUuid - UUID of the device (from pairing record or manual entry)
   * @param authToken - Auth token for this session
   * @returns A DeviceTransport ready for use, after handshake verification
   */
  async connectToIp(
    deviceIp: string,
    deviceUuid: string,
    authToken: string,
  ): Promise<Result<DeviceTransport, CommunicationError>> {
    this.logger.info(`[COMM] Connecting to device at ${deviceIp}`, {
      uuid: deviceUuid,
    });

    const transport = this.transportFactory.createHttpTransport({
      deviceIp,
      deviceUuid,
      authToken,
      port: DEVICE_HTTP_PORT,
    });

    const handshakeResult = await this._performHandshake(transport);
    if (!handshakeResult.isSuccess) {
      await transport.close();
      return Result.fail(handshakeResult.getErrorOrThrow());
    }

    this.logger.info(`[COMM] Device connected and verified`, {
      uuid: deviceUuid,
      ip: deviceIp,
      status: handshakeResult.getValueOrThrow().api_version,
    });

    return Result.ok(transport);
  }

  /**
   * Resolve a discovered mDNS device to a verified DeviceTransport.
   *
   * @param device - A device resolved from the scan() result
   * @param authToken - Auth token for this session
   */
  async resolveDiscovered(
    device: DiscoveredDevice,
    authToken: string,
  ): Promise<Result<DeviceTransport, CommunicationError>> {
    return this.connectToIp(device.ip, device.deviceId, authToken);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Perform the /status handshake and validate API version compatibility.
   */
  private async _performHandshake(
    transport: DeviceTransport,
  ): Promise<Result<DeviceStatus, CommunicationError>> {
    this.logger.debug("[COMM] Performing /status handshake");

    const result = await transport.get<DeviceStatus>("/status");
    if (!result.isSuccess) {
      return Result.fail(result.getErrorOrThrow());
    }

    const status = result.getValueOrThrow();

    if (!this._isVersionSupported(status.api_version)) {
      const err = new ApiVersionMismatchError(
        status.api_version,
        MINIMUM_SUPPORTED_API_VERSION,
      );
      this.logger.error("[COMM] API version mismatch", err);
      return Result.fail(err);
    }

    this.logger.info("[COMM] Handshake successful", {
      deviceId: status.device_id,
      firmware: status.firmware_version,
      api: status.api_version,
      capabilities: status.capabilities,
      bufferedCaptures: status.buffered_captures_count,
    });

    return Result.ok(status);
  }

  /**
   * Check if the device's reported API version meets the minimum requirement.
   * Version strings are of the form "v1", "v2", etc.
   */
  private _isVersionSupported(apiVersion: string): boolean {
    const parseVersion = (v: string): number =>
      parseInt(v.replace(/^v/i, ""), 10);

    const deviceV = parseVersion(apiVersion);
    const minV = parseVersion(MINIMUM_SUPPORTED_API_VERSION);

    if (isNaN(deviceV) || isNaN(minV)) {
      this.logger.warn("[COMM] Could not parse API version strings", {
        device: apiVersion,
        minimum: MINIMUM_SUPPORTED_API_VERSION,
      });
      return false;
    }

    return deviceV >= minV;
  }
}
