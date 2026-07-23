/**
 * API version compatibility constants for device communication.
 *
 * When the app connects to a device, it reads the api_version field from
 * the /status handshake and validates it against MINIMUM_SUPPORTED_API_VERSION.
 * If the device version is below the minimum, a firmware update prompt is shown.
 */

import { appConfig } from "@core/config/AppConfig";

/** The API version this app natively implements. */
export const CURRENT_APP_API_VERSION = "v1" as const;

/**
 * The oldest device API version this app can communicate with.
 * Devices running firmware that exposes an older API version will
 * receive an ApiVersionMismatchError and must be updated via OTA.
 */
export const MINIMUM_SUPPORTED_API_VERSION = "v1" as const;

/** All API versions this app can speak to (for capability negotiation). */
export const SUPPORTED_API_VERSIONS: readonly string[] = ["v1"] as const;

/** The base path prefix for all device API requests. */
export const API_BASE_PATH = "/api/v1" as const;

/** The default port the device HTTP server listens on. */
export const DEVICE_HTTP_PORT = appConfig.defaultDevicePort;

/** mDNS service type used for device discovery. */
export const MDNS_SERVICE_TYPE = "_vaha._tcp" as const;

/** WebSocket endpoint path for real-time sensor/event streaming. */
export const WS_ENDPOINT_PATH = `${API_BASE_PATH}/ws` as const;

/** WebSocket heartbeat interval in milliseconds. */
export const WS_HEARTBEAT_INTERVAL_MS = 10_000 as const;

/** Number of consecutive missed heartbeats before declaring the device offline. */
export const WS_MAX_MISSED_HEARTBEATS = 3 as const;

/** Maximum number of transfer retry attempts before marking a job as failed. */
export const MAX_TRANSFER_RETRY_ATTEMPTS = 5 as const;

/** Base delay in milliseconds for exponential backoff on transfer retry. */
export const TRANSFER_RETRY_BASE_DELAY_MS = 1_000 as const;

/** Maximum delay cap in milliseconds for exponential backoff. */
export const TRANSFER_RETRY_MAX_DELAY_MS = 60_000 as const;

/**
 * Development-only static token used before BLE pairing is implemented.
 *
 * @warning This token MUST be replaced by a proper HMAC-SHA256 session token
 *          derived from the BLE-exchanged shared secret before any production build.
 *          CI must enforce that this constant is never present in a release binary.
 */
export const DEV_STATIC_TOKEN = process.env["EXPO_PUBLIC_DEV_DEVICE_TOKEN"] ?? appConfig.defaultDeviceToken;
