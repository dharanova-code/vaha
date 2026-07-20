# Dependency Rules

To prevent code coupling, import boundaries are strictly enforced.

---

## 1. Feature Dependencies
*   Feature modules under `src/features/` should **never** import other feature modules directly.
*   Cross-feature communication is handled through registered core services via Dependency Injection or shared state.

---

## 2. Infrastructure Dependencies
*   No presentation view code should import classes inside `src/infrastructure/` directly.
*   All infrastructure wrappers (database, filesystem, bluetooth) must be accessed via shared core interfaces resolved through the DI container.
