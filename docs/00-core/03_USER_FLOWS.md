# Vaha User Flows & Interaction Journeys

This document details the core user journeys across the Vaha hardware device and the companion application.

---

## 1. Out-of-Box Setup & Pairing Flow

This journey details how a user configures a new physical device and pairs it with their companion app.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Companion App
    participant Dev as Vaha Physical Device

    User->>Dev: Power on device
    Dev->>Dev: Boot VROS & enter BLE Advertising Mode
    Dev-->>Dev: Pulse LED indicator (Orange)
    User->>App: Launch App & select "Pair Device"
    App->>App: Scan for BLE advertising packets
    App-->>User: Display discovered Vaha devices
    User->>App: Select device and enter Wi-Fi credentials
    App->>Dev: Transmit network credentials over encrypted BLE
    Dev->>Dev: Connect to Wi-Fi network
    Dev-->>App: Confirm connection success
    Dev-->>Dev: Transition LED to solid green (1.5s), then fade to standby
    App-->>User: Setup complete notification
```

---

## 2. Voice Capture & Telemetry Recording Flow

The core capture loop, operating entirely on-device and offline.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Dev as Vaha Physical Device
    participant Sens as Ambient Sensors
    participant Mem as Secure Flash Memory

    User->>Dev: Speak wake word
    Dev->>Dev: Verify wake word locally
    Dev->>Dev: Play start chime & change LED to Recording Mode (Pulsing Blue)
    Dev->>Sens: Query ambient sensors & flow rate metrics
    Sens-->>Dev: Telemetry data packet
    User->>Dev: Dictate thought/idea
    User->>Dev: Remain silent (or speak stop phrase)
    Dev->>Dev: Detect end of speech (VAD)
    Dev->>Dev: Play confirmation chime & turn off LED
    Dev->>Mem: Write encrypted audio file + telemetry packet
```

---

## 3. Background Sync & Companion App Processing Flow

The background sequence that transfers, transcribes, and enriches captured notes.

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Vaha Physical Device
    participant App as Companion App
    participant Cloud as Companion Secure Cloud (Sync/AI)

    Note over Dev, App: Bluetooth/Wi-Fi connection established
    Dev->>App: Initiate sync handshake
    Dev->>App: Stream encrypted audio files + telemetry packages
    App->>App: Decrypt packages and save to local database
    Dev->>Dev: Clear successfully synced memory blocks
    App->>App: Run speech-to-text engine (Local/Cloud depending on privacy config)
    App->>Cloud: Run AI synthesis (Extract summary, action items, tags)
    Cloud-->>App: Structured Note Object
    App-->>App: Push notification: "New Note Structured: [Summary]"
```
