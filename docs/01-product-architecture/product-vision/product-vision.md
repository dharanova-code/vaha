
# Vaha Product Vision

Vaha is a privacy-first, offline-first personal idea capture ecosystem designed to eliminate the friction between a human thought and its digital preservation.

In moments of transition, creativity, or physical isolation—such as working in a laboratory, cooking, or showering—fleeting thoughts are easily lost. Vaha captures these moments instantly using a dedicated physical capture device and structures them into actionable intelligence via a feature-rich companion application.

---

## 1. Core Principles

* **Privacy-First**: Voice processing, keyword detection, and temporary audio buffering occur locally on the user's dedicated hardware. Personal voice data is never sent to third-party cloud services for wakefulness detection or transcription.
* **Offline-First**: The physical hardware operates entirely decoupled from network availability. Thoughts are buffered locally in secure hardware storage and synchronized securely when connection to the companion application is established.
* **Zero-Friction Capture**: The hardware is single-purpose and ambient. There are no screens, no menus, and no configuration requirements on the device. It is not an AI assistant; it does not answer questions, read weather reports, or process commands. It only listens, records, and syncs.
* **Decoupled Intelligence**: The physical device is intentionally lightweight and simple. The cognitive overhead of transcription, metadata association, structured editing, categorization, search, and AI-driven insights is offloaded to the Companion Application.

---

## 2. Product Architecture Overview

The Vaha product ecosystem is divided into two distinct components:

```mermaid
graph LR
    subgraph Physical Device
        Capture[Voice Capture Engine]
        Sensors[Ambient Sensors]
        Storage[Local Secure Buffer]
        SyncEngine[Background Sync Manager]
    end
  
    subgraph Companion App
        Viewer[Note Manager & Editor]
        AIService[AI Insight Engine]
        DeviceMgr[Device & Sync Manager]
        PrivacySettings[Privacy & Storage Controls]
    end
  
    Physical Device -->|Local Encrypted Sync| Companion App
```

### 2.1 The Physical Device

A minimal, industrial-grade hardware appliance designed for ambient installation:

* **Wake Word Detection**: Low-power local hardware matches the activation phrase to wake up from standby.
* **Voice Capture**: High-fidelity, beamforming acoustic arrays record voice notes immediately after wake word recognition.
* **Local Storage**: Flash-based secure buffer to store voice logs and environmental metadata during offline periods.
* **Sensor Collection**: Gathers ambient environmental context (such as temperature, humidity, volatile organic compounds, and optional liquid flow metrics) to contextualize captured thoughts.
* **Background Synchronization**: Automatically negotiates secure local and cloud connections to sync raw captures to the Companion App.

### 2.2 The Companion Application

The primary interface of the Vaha ecosystem, running on mobile, desktop, or web platforms:

* **Note Management**: Interface for viewing, searching, editing, and manually organizing synced captures.
* **AI Insight Engine**: Converts raw voice transcripts into structured summaries, action items, tags, and semantic relationships.
* **Device Management**: Handles device setup, Wi-Fi pairing, firmware update scheduling, and diagnostic reporting.
* **Sync & Storage Management**: Governs storage thresholds on both the device and host, managing retention periods for raw audio files.
* **Privacy Settings**: Configures encryption keys, transcription engine selections (local vs. cloud), and permissions.
