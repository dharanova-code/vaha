# Vaha Architecture Decisions (ADR) - Local Agent Index

This document tracks local Phase C architectural and design decisions made during milestone implementations.

---

## Decision 0005: Modular Application Bootstrap Pipeline

*   **Status**: Accepted
*   **Reason**: To ensure all system-level dependencies (logger, configuration, database, migrations, repositories) are initialized in a safe, predictable, sequential pipeline before the first screen appears.
*   **Consequences**: Halts app startup on any step failure and records the failure state in a clean, non-crashing manner, preventing the app from launching in an inconsistent state. Allows future plugins to hook easily into the boot sequence.

---

## Decision 0006: Lightweight RuntimeState Singleton

*   **Status**: Accepted
*   **Reason**: To manage global application boot metrics, environment settings, and lifecycle status transitions without the overhead and complexity of reactive state stores (like Zustand) during early startup.
*   **Consequences**: Simple, fast, and type-safe access to status, startup duration, current boot step, and failure records.

---

## Decision 0007: Tab-First Layout with Expo Router

*   **Status**: Accepted
*   **Reason**: The approved information architecture defines five top-level workspaces (Home, Captures/Library, Insights, Device, Settings). Tab-based layouts provide the most native user experience.
*   **Consequences**: Implements `/home`, `/captures`, `/insights`, `/device`, and `/settings` under a tab-based system shell.

---

## Decision 0008: Error Boundary & Bootstrap Integration at Layout Root

*   **Status**: Accepted
*   **Reason**: To guarantee the application does not render visual modules in an uninitialized or broken state.
*   **Consequences**: Root layouts compose Safe Area, status bars, and the bootstrap pipeline run, routing to `<Slot />` only on initialization success. Custom `ErrorBoundary` handles render exceptions.

---

## Decision 0009: Clean Mock Data Architecture for Approved UI Integration

*   **Status**: Accepted
*   **Reason**: To build and visually validate layout integrations cleanly without coupling presentation files directly to database repositories, caching services, or Zustand stores too early.
*   **Consequences**: Decoupled mock files under `src/features/home/mock/` supply static models to UI screens, preventing hardcoded arrays in visual views. Allows easy swap with Zustand/Repositories in future phases.

---

## Decision 0010: mDNS as Primary Device Discovery Mechanism

*   **Status**: Accepted
*   **Reason**: Devices advertise via Avahi (`_vaha._tcp`) on the Linux layer. mDNS is zero-configuration, requires no cloud relay, and natively aligns with the offline-first mandate. Manual IP fallback is provided for enterprise networks.
*   **Consequences**: `DeviceDiscoveryService` stubs the scan() interface in Phase D (mDNS library evaluation pending). The `connectToIp()` fallback is used for Phase D testing. Real mDNS integration is a follow-up task.

---

## Decision 0011: HTTP/1.1 REST + WebSocket as Primary Device Transport

*   **Status**: Accepted
*   **Reason**: HTTP/1.1 is the most stable baseline for the Arduino Uno Q constrained Linux environment. WebSocket (upgrade over HTTP/1.1) handles real-time telemetry. BLE is reserved for Milestone 7 pairing only.
*   **Consequences**: All transport logic is abstracted behind `DeviceTransport` interface. `HttpDeviceTransport` is the Phase D concrete implementation. BLE or USB transports can be added via `DeviceTransportFactory` without changing business logic.

---

## Decision 0012: HMAC-SHA256 Session Token Authentication

*   **Status**: Accepted
*   **Reason**: Ephemeral session tokens derived from a BLE-exchanged shared secret (ECDH) prevent replay attacks without requiring cloud authentication. Tokens rotate every 5 minutes.
*   **Consequences**: Phase D uses a static development token from `.env` (never in production binaries — CI gate required). Full implementation is gated on Milestone 7 BLE pairing.

---

## Decision 0013: URL-Prefixed Versioning + Capability Negotiation

*   **Status**: Accepted
*   **Reason**: URL prefix (`/api/v1`) clearly versions the contract. The `/status` handshake exposes a `capabilities` array allowing the app to enable features conditionally based on device firmware.
*   **Consequences**: `ApiCompatibility.ts` holds `MINIMUM_SUPPORTED_API_VERSION`. Version mismatches produce `ApiVersionMismatchError` surfaced as a firmware update prompt — never a crash.

---

## Decision 0014: Idempotent Transfer with Write-and-Confirm Purge Protocol

*   **Status**: Accepted
*   **Reason**: Using `transaction_id` as an idempotency key prevents duplicate captures from repeated transfers. The device does not purge a capture until the app confirms receipt via `DELETE /captures/:txId`. Protects against data loss from interrupted transfers.
*   **Consequences**: `DeviceSyncService` implements exponential backoff (1s→60s, max 5 retries) and MD5 checksum verification. MD5 is a Phase D placeholder using `expo-crypto` in a follow-up.

---

## Decision 0015: Feature-First Devices/ Service Layer with DI-Injected Transport

*   **Status**: Accepted
*   **Reason**: Follows the established feature-first architecture. All communication services (`DeviceDiscoveryService`, `DeviceSyncService`) live under `src/features/devices/services/`. Transport is injected via DI container, never imported directly by UI or stores.
*   **Consequences**: Bootstrap pipeline gains a new `InitializeDeviceCommunicationStep` registered last. No UI component ever calls transport directly.
