# Changelog

## [Unreleased] - 2026-08-05

### Added
- **Profile Management**: Added fully functional Name and Email fields to the Settings tab, complete with UI editing states and MMKV local persistence.
- **Groq Cloud Transcription Fallback**: Implemented a free internet-based fallback for transcription. When the UNO Q device is offline, the app automatically transcribes audio via the Groq API (using the `whisper-large-v3` model) if a Groq API key is configured.
- **IoT Wi-Fi Scanner UI**: Added a "Scan Wi-Fi via UNO Q" button to the device provisioning flow. This simulates the hardware scanning for networks and displays a native-style list of local SSIDs (with signal strength and lock icons) for easy one-click connection.

### Changed
- **Navigation & Routing Refactor**: Consolidated the redundant "Device" and "Device / Provision" screens into a single, cohesive interface. The dedicated `provision.tsx` screen was deleted and its logic was gracefully merged into `device/index.tsx`, cleaning up the bottom tab bar.
- **BLE Scanner Revamp**: The Device tab scanner now mimics native OS Bluetooth settings. It scans and displays *all* nearby Bluetooth devices (sorted by signal strength) instead of artificially filtering for "VAHA" devices. It also displays dynamic signal-bar icons.
- **Settings Store**: Expanded `settingsStore.ts` (Zustand) to support and persist `userName`, `userEmail`, and `groqApiKey` locally.
- **Settings UI Revamp**: Rebuilt the `app/(tabs)/settings/index.tsx` interface to accommodate the new Profile and Cloud Services sections alongside the original sync preferences in a clean, scrollable layout.

### Fixed
- **Onboarding Notification Block**: Removed the blocking alert related to `expo-notifications` on Expo Go. The app now gracefully catches the unsupported push notification error and allows the user to complete the onboarding flow without getting stuck.
- **TypeScript Errors**: Resolved various strict null-check warnings and type errors related to `retentionDays` indexing and device provisioning state logic.
