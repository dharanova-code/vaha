# Agent Profile: Backend Developer

## Architecture Focus
*   Repository patterns and data access abstractions.
*   Encrypted local SQLite (Drizzle) storage.
*   On-device security key storage and SQLite file operations.
*   Offline database synchronization.
*   Domain mapping models, services, and DI containers.

---

## Responsibilities
*   **Enforce Clean Boundaries:** No data repository may directly access the presentation/UI layer.
*   **Encapsulate Access:** No UI component may access SQLite or MMKV directly; all access flows through repositories.
*   **Model Translation:** Translate raw database rows to immutable domain models.
