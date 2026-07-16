# Vaha System Architecture

This document details the high-level system architecture, cross-component communication, and security models of the Vaha product ecosystem.

---

## 1. System Overview

Vaha is structured into three primary architectural tiers: the **Physical Device**, the **Companion Application**, and the **Secure Cloud Layer**. The system architecture is built around the principle of **decoupled intelligence**, keeping the capture hardware minimal while leveraging the client host device (mobile/desktop) for speech processing and AI analysis.

```mermaid
graph TD
    subgraph Physical Device (VROS)
        Cap[Acoustic Capture Engine]
        Sens[Telemetry Acquisition]
        Flash[Secure Flash Storage]
        LSync[Local Sync Engine]
    end

    subgraph Companion Application (Mobile/Desktop)
        AppSync[App Sync Engine]
        LDB[(Local Relational DB)]
        Trans[Transcription Engine]
        AppUI[User Interface & Dashboard]
        LocalAI[Local AI Analyzer]
    end

    subgraph Secure Cloud Layer
        CloudSync[Cloud Gateway]
        CloudAI[Cloud AI Enrichment]
        UserDB[(Cloud User Database)]
    end

    %% Sync Protocols
    LSync <-->|Encrypted BLE/Wi-Fi| AppSync
    AppSync <-->|HTTPS / Secure Sync Protocol| CloudSync
    AppSync --> Trans
    Trans --> LocalAI
    AppSync <--> LDB
    CloudSync <--> CloudAI
    CloudSync <--> UserDB
```

---

## 2. Core Architectural Components

### 2.1 Physical Device (VROS)
The physical hardware runs **VROS (Vaha Real-time OS)**. Its design is strictly restricted to low-latency capture:
*   **Standby Engine**: Runs low-power wake-word matching locally.
*   **Audio Pipeline**: Captures uncompressed, high-fidelity audio streams.
*   **Data Aggregation**: Interleaves real-time climate, chemical (VOC), and liquid flow telemetry with audio timestamps.
*   **Encrypted Storage**: Enforces AES-256 block encryption on local non-volatile flash buffers.

### 2.2 Companion Application (Client)
The Companion App serves as the primary coordination node:
*   **Sync Manager**: Negotiates connections with the Physical Device, pulling raw payloads and clearing remote buffers.
*   **Transcription Service**: Dispatches raw audio to either a local ASR engine (offline mode) or cloud-assisted services.
*   **AI Insight Engine**: Parses transcribed text to extract titles, structured lists, tasks, and semantic tags.
*   **Local Store**: SQLite-based database holding local notes, telemetry records, and device settings.

### 2.3 Cloud Layer (Vaha Cloud)
An optional tier providing backup and premium collaborative features:
*   **User Portal**: Synchronizes note histories across multiple client devices.
*   **Deep AI Analysis**: Runs large language models for complex cross-note summarization and workspace integrations.

---

## 3. Data Flow

### Capture to Sync Loop
1.  **Trigger**: Local wake word activates recording.
2.  **Telemetry Capture**: Environment sensors sample temperature, humidity, and flow metrics.
3.  **Local Commit**: Raw audio is encrypted and saved to physical flash.
4.  **Pairing**: Device connects to the Companion App via Wi-Fi/BLE.
5.  **Streaming**: Secure sync engine transfers packets.
6.  **Purge**: The device flash space is marked for reuse.
7.  **Enrichment**: Companion App transcribes the payload, appends context, runs AI extraction, and updates the local UI timeline.

---

## 4. Security & Privacy Model

*   **Zero-Trust Local Transfer**: All communication between the Physical Device and Companion App over Wi-Fi/BLE is encrypted using ephemeral keys negotiated during setup pairing.
*   **Data at Rest**: Physical device flash and local app databases are encrypted with AES-256 keys derived from the user's master passcode.
*   **Acoustic Isolation**: The hardware microphones do not buffer audio to long-term memory or network channels unless the wake word is matched.

---

## 5. Offline-First Strategy

The system is designed to tolerate infinite network dropouts:
*   **Device Autonomy**: The physical device records and timestamps environmental data and audio files without needing Wi-Fi or Companion App connections.
*   **App Autonomy**: The Companion App caches all notes locally, allowing viewing, searching, and editing offline. Once network access returns, the App syncs changes to Vaha Cloud.

---

## 6. Future Extensibility

*   **Micro-Module Bus**: The physical hardware supports modular sensor arrays (e.g., air quality, barometric pressure) via standard internal serial/I2C buses.
*   **Pluggable Sync Targets**: The Companion App's data pipeline is decoupled, allowing users to select alternative backup targets (e.g., local markdown directories, third-party databases) without architectural changes.
