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
