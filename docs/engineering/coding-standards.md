# Coding Standards

Vaha enforces strict TypeScript configurations and automated styling.

---

## 1. Type Safety
*   Avoid `any` type casting. Set `@typescript-eslint/no-explicit-any` as an error.
*   Satisfy `exactOptionalPropertyTypes: true` compiler rules. Omit properties rather than setting optional properties to `undefined`.
*   Handle errors via the central custom error system (e.g. `DatabaseError`, `StorageError`).

---

## 2. Formatting & Linting
*   Prettier handles auto-formatting on every commit via `lint-staged`.
*   Conventional Commits specification is enforced using `@commitlint`.
