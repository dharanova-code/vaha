# Vaha Architecture Decisions (ADR)

This document tracks all major architectural and design decisions for the Vaha product ecosystem.

---

## Decision 0001: Repository = Product

*   **Status**: Accepted
*   **Reason**: Establishing a single source of truth for the entire product team.
*   **Alternatives**: Maintaining separate repositories for firmware, mobile code, and product documentation.
*   **Consequences**: Technical documentation, UI mockups, firmware code, and mobile client code evolve together in a single monorepo, facilitating consistent version releases and simple API synchronization.

---

## Decision 0002: Expo (React Native) for Companion App

*   **Status**: Accepted
*   **Reason**: Cross-platform target coverage (iOS and Android) with a single codebase. Over-the-air (OTA) update support simplifies mobile client delivery.
*   **Alternatives**: Flutter, Native development (Swift / Kotlin).
*   **Consequences**: Introduces a JavaScript runtime overhead, but accelerates development velocity and lowers team specialization barriers.

---

## Decision 0003: Offline-first Data Architecture

*   **Status**: Accepted
*   **Reason**: Guarantees that Vaha can capture thoughts in remote environments, showers, or areas with poor connection, while securing maximum user privacy.
*   **Alternatives**: Direct streaming of voice files to cloud-based speech engines.
*   **Consequences**: Requires robust local database management on the Companion App, large physical flash buffers on the device, and transactional reconciliation algorithms inside the Sync Engine.

---

## Decision 0004: Uno Q Protocol as Sync Source of Truth

*   **Status**: Accepted
*   **Reason**: To avoid synchronization conflicts and data corruption when syncing records across the physical device, mobile companion app, and cloud layers. The transactional queue system (Uno Q) treats the physical capture device as the master source of truth for raw transaction creations, and the local Companion App database as the final ledger.
*   **Alternatives**: Dynamic multi-master replication.
*   **Consequences**: Simpler sync logic. Nodes only append or mark records as synced; conflicts are resolved automatically by physical timestamp ordering.
