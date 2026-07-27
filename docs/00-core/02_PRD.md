# Vaha Product Requirements Document (PRD)

This document establishes the commercial requirements for the Vaha physical device and companion application.

---

## 1. Physical Device Requirements

The Vaha hardware is a single-purpose, ambient device designed for friction-free voice capture in homes and workspaces.

### 1.1 Voice Capture & Wakefulness
*   **Local Wake Word Matching**: The device must continuously evaluate ambient audio for the wake word with zero cloud dependency.
*   **Recording Indicator**: A physical LED indicator must display a distinct visual pattern when recording is active.
*   **Voice Activity Detection (RMS)**: The device must dynamically identify when the user starts and stops speaking using an RMS energy threshold method.
*   **Automatic Cutoff**: Recording must stop automatically when a continuous period of silence is detected or a manual termination phrase is recognized.
*   **Local Buffer**: Captured audio must be stored locally in high-quality, uncompressed format until successful sync.

### 1.2 Telemetry Collection
*   **Ambient Sensors**: The device must collect temperature, humidity, and volatile organic compound (VOC) levels.
*   **Flow Rate Sensors**: The hardware must support external inputs for liquid flow rate sensors (useful for bathroom/shower installations).
*   **Telemetry Association**: Telemetry data must be sampled at the exact time of voice recording and bound to the audio transaction.

### 1.3 Connectivity & Local Storage
*   **Offline Buffering**: The device must contain secure non-volatile flash storage capable of buffering at least 100 voice notes when offline.
*   **Local Networking**: The device must support dual-band Wi-Fi and Bluetooth Low Energy (BLE) for pairing and syncing.
*   **Background Sync**: Once a connection is established, the device must securely stream buffered notes and telemetry to the Companion App in the background.

---

## 2. Companion Application Requirements

The Companion App serves as the primary configuration and consumption portal.

### 2.1 Note Management
*   **Transcription**: The application must transcribe received audio streams.
*   **Viewing & Search**: Users must be able to view notes in a chronological timeline and perform full-text and semantic searches.
*   **Editing & Organization**: Support text editing, tagging, and folder structures.
*   **AI Insight Engine**: 
    *   Synthesize summaries from raw notes.
    *   Automatically extract actionable tasks and schedule reminders.
    *   Suggest tags based on content and context.

### 2.2 Device & Data Management
*   **Device Configuration**: Wi-Fi configuration via BLE, volume adjustments, and LED behavior control.
*   **Sync Dashboard**: Status of buffered items, last sync timestamp, and device health diagnostics.
*   **Privacy Console**: Controls to toggle cloud-based processing vs. local device transcription, edit encryption passphrases, and purge voice recordings.
*   **Storage Controls**: Option to automatically delete raw voice files on the physical device immediately post-sync or retain them for a set duration.

---

## 3. Non-Functional & Quality Requirements

| Metric | Target Specification | Priority |
| :--- | :--- | :--- |
| **Wake Word Precision** | False trigger rate < 1 per 24 hours | P0 |
| **Audio Latency** | Response chime < 150 ms from wake recognition | P0 |
| **Data Security** | AES-256 encryption for on-device and transit data | P0 |
| **Battery Life (Battery Variant)** | > 6 months under standard usage (3 captures/day) | P1 |
| **Ingress Protection** | IP65 minimum (dust/water spray resistant) | P0 |
