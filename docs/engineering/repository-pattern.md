# Repository Pattern Boundaries & Guidelines

This document details the data access layer architecture using the Repository Pattern in Vaha.

---

## 1. Why Repositories Exist
The Repository Pattern acts as an in-memory collection interface representing domain objects. 
*   **Encapsulate Drizzle ORM:** Keeps raw SQL strings or Drizzle schemas completely out of presentation components, UI hooks, and Zustand state stores.
*   **Decoupled testing:** Allows front-end developers to mock database adapters during local feature development without running SQLite bindings.
*   **Unified Error Mapping:** Automatically converts database connection exceptions into type-safe `Result` outputs containing typed `DatabaseError` structures.

---

## 2. Layer Boundaries & Flow Direction

```text
┌─────────────────────────────────┐
│     Zustand State Stores / UI   │
└────────────────┬────────────────┘
                 │ (Resolves via DI)
                 ▼
┌─────────────────────────────────┐
│    Repository Interfaces        │ (e.g. CaptureRepository.ts)
└────────────────┬────────────────┘
                 │ (Injected Singleton)
                 ▼
┌─────────────────────────────────┐
│    Repository Implementations   │ (e.g. CaptureRepositoryImpl.ts)
└────────────────┬────────────────┘
                 │ (Drizzle query mapping)
                 ▼
┌─────────────────────────────────┐
│        Expo SQLite Database     │
└─────────────────────────────────┘
```

---

## 3. Dependency Rules
1.  **Interface to Implementation separation:** Concrete classes must never be imported directly by presentation views or business stores.
2.  **No UI imports:** Repositories must never reference React or React Native hooks.
3.  **Result wrappers:** Every query method must return a `Result<T, DatabaseError>` monad; throwing raw SQL exceptions is strictly forbidden.
4.  **No SQL leaks:** Method signatures must accept and return plain TypeScript models or types inferred from Drizzle schemas.

---

## 4. Transaction Boundaries
To coordinate multiple database writes, repositories support executing atomic queries within transactional boundaries:
```typescript
await databaseProvider.transaction(async (tx) => {
  await captureRepo.createWithTx(tx, ...);
  await syncRepo.enqueueWithTx(tx, ...);
});
```
This ensures sync reconciliation operations either succeed or roll back atomically.
