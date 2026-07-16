# Vaha Screen & Interface Inventory

This document details the interface components, views, and layout systems for both the Companion Application and the Physical Device status interfaces.

---

## 1. Companion Application Screens

### 1.1 Home Dashboard
The entry portal containing chronological note records and primary search functionality.
*   **Timeline View**: Scrollable list of structured note cards. Each card displays:
    *   AI-generated title.
    *   Timestamp.
    *   Tag chips.
    *   Ambient icons (e.g., Temperature, Shower Flow active indicator).
*   **Omni-Search Bar**: Full-text and semantic search input supporting voice query.
*   **Device Status Widget**: Icon displaying active battery levels, sync status, and storage status of paired devices.

### 1.2 Note Detail Screen
The dedicated view for viewing, editing, and analyzing a specific capture.
*   **Note Title Block**: Editable title text field.
*   **Audio Player Block**: Waveform visualizer with play/pause, scrub, and speed controls for reviewing the raw capture.
*   **Transcription Editor**: Interactive Rich Text field housing the generated note transcript.
*   **AI Summary Card**: Bulleted highlights synthesized by the AI engine.
*   **Action Items Checklist**: Automatically extracted task checklist (each task editable and checkable).
*   **Telemetry Panel**: Visual gauges displaying associated climate (temp, humidity), volatile organic compound (VOC) levels, and water flow rate/volume active during the capture.

### 1.3 Device Management Portal
Allows administrative control over paired physical units.
*   **Connection Status Indicator**: Displays whether the device is Connected via BLE, Connected via Wi-Fi, or Offline.
*   **Battery Meter**: Numerical percentage and charging state.
*   **Storage Monitor**: Gauge showing filled vs. available memory on the device's secure flash buffer.
*   **Firmware Version Control**: Displays current version, checking status, and an "Update Now" action button.

### 1.4 Privacy & Security Console
Contains the controls safeguarding user data.
*   **Transcription Selector**: Toggle between "Local Offline Transcription" (on-device/host) or "Cloud-assisted High-Precision Transcription".
*   **Audio Retention Policy**: Dropdown selector: "Delete audio post-sync", "Keep for 30 days", or "Never delete raw audio".
*   **Encryption Key Manager**: Fields to import, back up, or rotate local AES decryption keys.

---

## 2. Physical Device State Indicators (Light & Sound)

The physical device has no screen. It communicates status via an LED status light and audio cues.

| Device State | LED Light Pattern | Audio Feedback Cue | Description |
| :--- | :--- | :--- | :--- |
| **Standby** | Off / Dark | None | Device is in ultra-low power monitoring mode. |
| **Wake Triggered** | Solid Blue (1.5s) | Ascending Two-Tone Chime | Wake word recognized; transitioning to recording. |
| **Recording** | Pulsing Blue | None | Audio capture stream is active. |
| **Processing / Saving**| Spinning White | None | Audio payload is being committed to local flash. |
| **Success / Done** | Solid Green (1.5s) | Descending Two-Tone Chime | Recording finalized and stored securely. |
| **BLE Pairing Mode** | Pulsing Orange | None | BLE radio advertising for connection setup. |
| **Error / Memory Full**| Flashing Red | Double Low-Pitch Tone | Storage threshold exceeded, or hardware fault detected. |
