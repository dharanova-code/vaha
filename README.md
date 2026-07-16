# Vaha

Privacy-first, offline-first voice and telemetry capture ecosystem.

---

## Vision
Vaha is an ambient capture ecosystem designed to eliminate the friction between a human thought and its digital preservation. Using a dedicated, zero-friction physical device and a feature-rich companion application, Vaha securely records and enriches personal notes with physical environmental context without relying on continuous network access or compromising user privacy.

---

## Repository Structure
Vaha is structured as a unified product repository:

```text
├── app/                  # Application codebases
│   └── mobile/           # Mobile Companion App (Expo/React Native)
├── design/               # Design assets and system mockups
│   ├── wireframes/       # Interactive wireframe layouts
│   ├── mockups/          # High-fidelity visual mockups
│   └── exports/          # Production asset exports
├── docs/                 # Product and technical specifications
├── prompts/              # Structured prompts for developer workflows
│   ├── architecture/     # Prompts for system-level design decisions
│   ├── documentation/    # Prompts for documentation guidelines
│   ├── implementation/   # Prompts for coding workflows
│   └── review/           # Prompts for code reviews and PR audits
├── PROJECT_STATUS.md     # Engineering progress tracking
└── CHANGELOG.md          # Version history ledger
```

---

## Documentation Index

Explore the Vaha documentation suite in order of architectural dependency:

1.  **[01_PRODUCT_VISION.md](file:///c:/Projects/vaha/docs/01_PRODUCT_VISION.md)**: Product goals, key tenets, and ecosystem split.
2.  **[02_PRD.md](file:///c:/Projects/vaha/docs/02_PRD.md)**: Product Requirements Document for hardware, software, and companion clients.
3.  **[00_VROS.md](file:///c:/Projects/vaha/docs/00_VROS.md)**: Embedded Device Operating System Specification.
4.  **[09_ARCHITECTURE.md](file:///c:/Projects/vaha/docs/09_ARCHITECTURE.md)**: High-level system architecture, sync structures, and data flows.
5.  **[03_USER_FLOWS.md](file:///c:/Projects/vaha/docs/03_USER_FLOWS.md)**: Interaction mappings for setup, voice recording, and sync.
6.  **[04_SCREEN_INVENTORY.md](file:///c:/Projects/vaha/docs/04_SCREEN_INVENTORY.md)**: User Interfaces for the Companion App and hardware status indicators.
7.  **[05_DESIGN_SYSTEM.md](file:///c:/Projects/vaha/docs/05_DESIGN_SYSTEM.md)**: Brand styles, visual assets, LED behaviors, and audio chimes.
8.  **[06_API_SPEC.md](file:///c:/Projects/vaha/docs/06_API_SPEC.md)**: Serialization protocol formats and cloud sync endpoints.
9.  **[07_DATA_MODEL.md](file:///c:/Projects/vaha/docs/07_DATA_MODEL.md)**: Database schemas and device storage layout structures.
10. **[08_ROADMAP.md](file:///c:/Projects/vaha/docs/08_ROADMAP.md)**: Product release and feature progression roadmap.
11. **[10_DECISIONS.md](file:///c:/Projects/vaha/docs/10_DECISIONS.md)**: Architecture Decision Records (ADRs).

---

## Getting Started

### Prerequisites
*   Node.js (LTS version) for Companion App development.
*   Expo Go app on iOS/Android for testing mobile builds.

### Initial App Setup
1.  Navigate to the mobile directory:
    ```bash
    cd app/mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npx expo start
    ```

---

## Development Workflow
*   **Documentation-First**: All technical changes or new integrations must start with an update to the corresponding specification inside the `docs/` folder.
*   **Testing**: All components must be validated against the specs outlined in `docs/02_PRD.md`.

---

## Branch Strategy
*   **main**: Represents the current stable commercial build.
*   **develop**: Active integration branch for feature updates.
*   **feature/***: Sandbox branches for individual feature development.

---

## Roadmap
For the multi-year progression plan of the hardware and application systems, see [08_ROADMAP.md](file:///c:/Projects/vaha/docs/08_ROADMAP.md).

---

## License
Proprietary. All rights reserved.
