# Vaha Echosystem

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white&style=for-the-badge)](https://www.python.org)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?logo=sqlite&logoColor=white&style=for-the-badge)](https://www.sqlite.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-Latest-C5F900?logo=drizzle&logoColor=black&style=for-the-badge)](https://orm.drizzle.team)
[![Arduino](https://img.shields.io/badge/Arduino-Uno_Q-00979D?logo=arduino&logoColor=white&style=for-the-badge)](https://www.arduino.cc)

**Privacy-first, offline-first voice and ambient telemetry capture ecosystem.**

[View Demo Video](#demo-showcase) • [Download Mobile App](#apk-installation) • [Hardware Setup](#hardware-integration) • [Developer Guide](#developer-setup)

</div>

---

## 📺 Demo Showcase

<div align="center">
  <p align="center">
    <!-- Replace the URL below with your actual demo video link -->
    <a href="https://www.youtube.com/watch?v=demo-placeholder">
      <img src="https://img.youtube.com/vi/demo-placeholder/0.jpg" alt="Vaha Ecosystem Demo" width="70%"/>
    </a>
  </p>
  <p><em>Click the image above to watch the Vaha physical device and mobile app synchronization demo.</em></p>
</div>

---

## 🌌 The Vision
Vaha is an ambient capture ecosystem designed to eliminate the friction between human thought and digital preservation. Using a dedicated, zero-friction physical device and a feature-rich companion mobile application, Vaha securely captures and enriches personal voice notes with physical environmental context—without relying on continuous network access or compromising user privacy.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Physical Device (Arduino Uno Q)
        Sensors[DHT22 / AGS02MA / Flow] -->|Raw Readings| UnoMCU[Arduino Uno Q MCU]
        UnoMCU -->|Serial Bridge API| RouterBridge[Arduino Router Bridge]
    end

    subgraph Companion Server (Python Service)
        RouterBridge -->|sensors_get / WebSocket| AudioLoop[Audio & Telemetry Loop]
        Mic[Physical Microphone] -->|Audio Input| AudioLoop
        AudioLoop -->|VAD / Edge Impulse| WakeDetect[Marvin Wake Keyword Detect]
        AudioLoop -->|faster-whisper| STT[Whisper Offline STT]
        STT -->|Transcripts| SyncService[Sync Engine]
        SyncService -->|Local SQLite| DB[(Telemetry DB)]
        SyncService -->|Sync API| Notion[(Notion Cloud Sync)]
        AudioLoop -->|Piper TTS| Speak[Audio Feedback]
    end

    subgraph Mobile Companion (Expo / React Native)
        SyncService -->|WebSocket Telemetry| MobileUI[React Native App]
        DB -->|Drizzle SQLite| MobileUI
        MobileUI -->|UI Panels| InsightsChart[Interactive SVG Charts]
        MobileUI -->|Speech-to-Text Fallback| GroqTranscribe[Groq Fallback STT]
    end
```

---

## 🚀 Key Features

*   🔊 **Zero-Friction Voice Logging**: Offline voice-activity detection (VAD) using Edge Impulse models. Instantly records voice memos when keyword "Marvin" is detected.
*   💾 **Local-First Core**: All audio transcriptions (Whisper) and telemetry databases (SQLite) run locally on the host companion server.
*   📊 **Ambient Telemetry Graphs**: Gathers real-time environmental context (Temperature, Humidity, Water Flow, TVOC Air Quality) and displays them on premium interactive SVG line charts.
*   🧠 **AI Title Suggestions**: Intelligently summarizes note logs to suggest creative, relevant headers using Llama 3.1 8B via Groq.
*   🤖 **Kids Sustainability Mode**: Incorporates a kid-friendly narrative engine that turns telemetry data (like water volume usage) into engaging sustainability stories.
*   📲 **Batch Management**: Supports batch selection, tagging, database merging, and bulk deletion of recorded notes.

---

## 📱 Mobile App (APK Installation)

The mobile companion application is compiled for Android viewports and is available for instant download.

| Platform | Build Type | Download Link |
|:---|:---|:---|
| **Android (arm64-v8a)** | Release (v1.1.0) | [📥 Download arm64-v8a APK](release/vaha-companion-v1.1.0-arm64-v8a.apk) |
| **Android (armeabi-v7a)** | Release (v1.1.0) | [📥 Download armeabi-v7a APK](release/vaha-companion-v1.1.0-armeabi-v7a.apk) |

*The APKs have been optimized using R8 minification to reduce download size and memory overhead.*

---

## 🔌 Hardware Integration

The Vaha physical node runs on an **Arduino Uno Q** microcontroller connected to temperature, air quality, and water flow sensors.

### 📐 Circuit Diagram & Pinout

<div align="center">
  <!-- Place your circuit diagram image here -->
  <img src="design/wireframes/circuit_layout_placeholder.png" alt="Vaha Circuit Schema" width="80%"/>
  <p><em>Vaha Physical Node Schematic (DHT22, AGS02MA TVOC, and Flow sensor integration)</em></p>
</div>

| Sensor | Sensor Pin | Arduino Uno Q Pin | Connection Type | Description |
|:---|:---|:---|:---|:---|
| **DHT22** | VCC | 5V | Power | - |
| **DHT22** | Data | Pin 2 | Digital Input | Temperature & Humidity |
| **DHT22** | GND | GND | Ground | - |
| **AGS02MA** | VCC | 3.3V | Power | TVOC Air Quality Sensor |
| **AGS02MA** | SDA | SDA (A4) | I2C Data | Communicating at 20kHz |
| **AGS02MA** | SCL | SCL (A5) | I2C Clock | - |
| **AGS02MA** | GND | GND | Ground | - |
| **Flow Meter**| VCC | 5V | Power | Water Pulse Flow Sensor |
| **Flow Meter**| Output | Pin 3 | Digital Interrupt | RISING pulse interrupt count |
| **Flow Meter**| GND | GND | Ground | - |

---

## ⚙️ Developer Setup

### 1. Arduino Firmware Flash
Ensure you have the Arduino IDE or CLI installed:
1. Open the sketch file in [`sketch/sketch.ino`](file:///c:/Projects/vaha/sketch/sketch.ino).
2. Install the `DHT` sensor library and `Arduino_RouterBridge` library.
3. Flash the code to the **Arduino Uno Q**.

### 2. Backend Companion Server Setup (Python)
The backend requires **Python 3.12** and virtual environment setups.

1. Navigate to the python directory:
   ```bash
   cd python
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy and populate the local configuration variables:
   ```bash
   cp .env.example .env
   # Set your Groq API keys, Notion database credentials, and port choices
   ```
5. Run the server:
   ```bash
   python main.py
   ```

### 3. Mobile App Development Setup (Expo)
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 📄 License & Terms
Proprietary. All rights reserved. Code licensed under custom terms for Gratian Technologies.
