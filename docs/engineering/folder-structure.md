# Folder Structure Reference

Vaha organizes code modularly to simplify scaling and isolate platform concerns.

```text
app/mobile/
├── app/                  # Expo Router directory (file-system routes only)
├── assets/               # Local static images, fonts, icons
├── src/
│   ├── core/             # Central configs, error system, custom DI container, types, utilities
│   ├── infrastructure/   # Storage, filesystem, database wrappers implementing core interfaces
│   ├── platform/         # Android, iOS and shared native OS wrappers (permissions, lifecycle)
│   ├── features/         # Modular feature silos (captures, settings, pairing, search)
│   └── shared/           # Common components, styles, hooks, and Zod form validation helpers
└── tests/                # Core and utility unit test suites
```
