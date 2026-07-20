# Engineering Architecture

This document describes the design principles and structural boundaries of the Vaha mobile companion application.

---

## 1. Feature-First Modular Structure
Instead of classic Clean Architecture layers separating the entire project, Vaha organizes logic into feature modules under `src/features/`.
*   **Encapsulation:** Each feature owns its models, state management, hooks, and local business validation.
*   **Infrastructure Isolation:** Cross-cutting technologies (SQLite, MMKV, BLE, secure storage) are extracted into `src/infrastructure/` and consumed via interfaces.

---

## 2. Platform Isolation Layer
Device-specific API bindings (lifecycle hooks, BLE scanning differences, hardware permission requests) reside in `src/platform/`.
*   Platform boundaries prevent platform-specific conditional logic (`Platform.OS === 'ios'`) from cluttering the business flow.
*   Interactions with native APIs are wrapped by unified shared interfaces under `src/platform/shared/`.

---

## 3. Local-First Decoupled States
*   **No Active Network Sync Dependency:** The application relies on a local database (SQLite) and local key-value stores (MMKV).
*   **Encryption at Rest:** Keys are managed through the native secure keystore, allowing AES-256 local decryption without cloud interaction.
