# VAHA — Offline-First Physical AI Voice Capture Device

<div align="center">

**Arduino Physical AI Challenge India 2026 — Project Report & Repository**

*Organised by Robu.in × Arduino*

[![Arduino Uno Q](https://img.shields.io/badge/Microcontroller-Arduino_Uno_Q_--_ABX00087-00979D?logo=arduino&logoColor=white&style=flat-square)](https://www.arduino.cc)
[![Expo React Native](https://img.shields.io/badge/Mobile-Expo_React_Native_SDK_54-61DAFB?logo=react&logoColor=black&style=flat-square)](https://reactnative.dev)
[![Python Edge Runtime](https://img.shields.io/badge/Runtime-Python_3.12-3776AB?logo=python&logoColor=white&style=flat-square)](https://www.python.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite_--_Drizzle_ORM-003B57?logo=sqlite&logoColor=white&style=flat-square)](https://www.sqlite.org)

**Team Name:** `VAHA` | **Team ID:** `APC-2026-AP-13507` | **Track:** `Smart Homes / Consumer AI`  
**Institution:** `Dharanova Private Limited, Visakhapatnam, Andhra Pradesh, India`  
**Developer:** `Ritesh Bonthalakoti (ritesh@dharanova.com)` — Solo Developer

[📺 View Demo Video](https://youtu.be/_Y_hMeHslhI?si=Uxo2WZzAGikBSO-f) • [📱 Download APK](#-mobile-companion-apk) • [🔌 Circuit Pinout](#-hardware-bom--wiring) • [⚙️ Installation](#-setup--installation)

</div>

---

## 📺 Demo & Product Showcase

<div align="center">
  <table border="0">
    <tr>
      <td width="50%" align="center">
        <img src="docs/design/images/assembled_device_enclosure.jpg" width="95%" style="border-radius: 8px; border: 2px solid #ddd;"/><br/>
        <b>Hardware Product: VAHA Enclosure by Dharanova Private Limited</b>
      </td>
      <td width="50%" align="center">
        <img src="docs/design/images/development_workspace.jpg" width="95%" style="border-radius: 8px; border: 2px solid #ddd;"/><br/>
        <b>VAHA Ecosystem & Companion App Integration</b>
      </td>
    </tr>
  </table>
  <br/>
  <a href="https://youtu.be/_Y_hMeHslhI?si=Uxo2WZzAGikBSO-f">
    <img src="docs/design/images/development_workspace.jpg" alt="VAHA Demo Video" width="75%" style="border-radius: 8px; border: 2px solid #ddd;"/>
  </a>
  <p><em>📺 Click above or visit <a href="https://youtu.be/_Y_hMeHslhI?si=Uxo2WZzAGikBSO-f">https://youtu.be/_Y_hMeHslhI</a> to watch the full physical demonstration.</em></p>
</div>

---

## 🌌 Project Overview & Problem Statement

Creative minds don't switch off. Ideas show up at the office, school, the park, a beach, in transit — anywhere you'd normally have a phone or notebook close by. There's one place that isn't true: **the bathroom**, where the mind keeps wandering with no way to write anything down. **VAHA** closes that gap — built for the one place your other devices can't follow you, so an idea never has to wait.

### Key Innovations:
1. **Hands-free Voice Capture**: Say *"Marvin"* to start recording thoughts without touching a phone or unlocking a device.
2. **Environmental Context Enrichment**: Stamps every voice note with temperature, humidity, TVOC air quality, and water flow rate at that exact moment.
3. **100% On-Device & Offline Privacy**: All wake-word detection, speech-to-text, sensor processing, and storage run locally on the Arduino UNO Q. No audio or text ever touches the cloud.

---

## ⏳ Project Development Timeline (June 2026 – August 2026)

```
June 2026                    July 2026                     August 2026 (Till Now)
  ├─ Ideation & Need        ├─ Breadboard Assembly       ├─ Expo Companion App
  ├─ Problem Analysis       ├─ Edge Impulse "Marvin"     ├─ Drizzle SQLite Database
  ├─ Sensor Selection       ├─ faster-whisper STT        ├─ FastAPI / WebSocket Sync
  └─ Board Architecture     └─ Enclosure Fabrication     └─ 34 Real-Noise Trials
```

### 🗓️ Phase 1: Ideation & Architectural Planning (June 2026)
- **Problem Discovery**: Identified the bathroom as the primary home "blind spot" where spontaneous creative thoughts occur but go unrecorded due to water and privacy constraints.
- **Hardware Architecture**: Selected the **Arduino UNO Q (ABX00087)** for its dual Linux OS + MCU bridge architecture.
- **Sensor Specification**: Designed the environmental sensing suite combining **DHT22** (climate), **AGS02MA** (air quality TVOC), and a **Hall-effect pulse water flow sensor**.

### 🗓️ Phase 2: MVP Hardware & On-Device AI Pipeline (July 2026)
- **Sensor Circuit Rig**: Assembled initial breadboard prototypes with custom I2C and digital pulse interrupt handlers.
- **On-Device Wake-Word Model**: Collected 48 custom voice logs and augmented them into 1,800+ samples to train an Edge Impulse keyword model (`Marvin` wake-word & `im_done` stop-phrase) achieving **98.7% validation accuracy**.
- **Speech-to-Text Integration**: Fine-tuned `faster-whisper` (`base.en`, int8 quantized) to execute offline on the Uno Q CPU.
- **Enclosure Design**: Fabricated the physical wall-mountable enclosure featuring Dharanova Private Limited branding and physical sensor vents.

### 🗓️ Phase 3: Mobile Companion, Sync Engine & Verification (August 2026 – Till Now)
- **Mobile Companion Development**: Built the mobile app using **Expo / React Native SDK 54** with **Drizzle SQLite** for local persistence.
- **Local Edge Server**: Implemented FastAPI backend (Port 8080) and WebSocket (`/ws`) real-time sensor broadcast.
- **MD5 Checksum Sync Engine**: Designed the Wi-Fi sync loop with checksum validation and automatic device storage purging.
- **Acoustic Stress Testing**: Successfully verified the system across **34 capture trials** in real bathroom acoustic conditions with running taps and exhaust fans running.

---

## 🏗️ System Workflow & Architecture

The Arduino UNO Q serves as the central bridge, running an on-device Linux OS environment alongside an MCU microcontroller core to merge local voice AI processing with physical sensing.

```mermaid
graph TD
    subgraph Arduino UNO Q Board
        Sensors[DHT22 / AGS02MA / Flow] -->|Raw Readings| MCU[microcontroller Core]
        MCU -->|sensors_get Bridge API| LinuxOS[Linux OS Runtime]
        Mic[CS202 USB Microphone] -->|48 kHz Mono PCM| LinuxOS
    end

    subgraph "Linux OS Runtime (Python Backend)"
        LinuxOS -->|Edge Impulse Model| VAD[Marvin Wake Detect]
        VAD -->|Active Recording| AudioLoop[Audio Capture State Machine]
        AudioLoop -->|Stop Keyword / Silence| StopDetect[im_done detection]
        StopDetect -->|faster-whisper base.en int8| STT[On-Device Transcription]
        STT -->|Assemble Capture| Storage[Local storage: audio + JSON + checksum]
        Storage -->|FastAPI Edge Server| Webserver[FastAPI endpoint: 8080]
        Storage -->|Optional Sync| Notion[Notion Client API]
        AudioLoop -->|Piper TTS| Speaker[PAM8403 Audio Out]
    end

    subgraph "Mobile Companion (Expo / React Native)"
        Webserver -->|Wi-Fi HTTP Sync| SyncService[Sync Service]
        SyncService -->|Verify Checksum| SQLite[(Drizzle SQLite DB)]
        SQLite -->|Dynamic Card List| AppUI[React Native Viewports]
        AppUI -->|Interactive SVG charts| GraphPanel[Telemetry Panel]
    end
```

### Step-by-Step Data Flow:
1. **Wake Word Detection**: The user says *"Marvin"*. The on-device Edge Impulse model (`new-marvin.eim`) detects it and triggers a `capture_started` event over WebSockets.
2. **Audio Capture**: Raw audio is recorded at **48 kHz (16-bit PCM)** with noise reduction.
3. **Stop Trigger**: Recording ends when the stop phrase *"im_done"* is detected (threshold 0.80) or after 10 seconds of silence.
4. **On-Device STT**: Audio is downsampled to 16 kHz and transcribed locally using `faster-whisper` (`base.en`, int8 quantized, running on CPU).
5. **Sensor Sync**: Environmental readings are pulled via the sketch's `sensors_get()` bridge call and packaged into a JSON metadata payload.
6. **Local Storage**: The capture package (`audio.wav`, `transcript.json`, `metadata.json`, `checksum.md5`) is written locally to `captures/YYYY/MM/DD/uuid/` and optionally synced to Notion.
7. **Mobile Sync**: The companion React Native app pulls the captures over local Wi-Fi, verifies the MD5 checksums, inserts records into Drizzle SQLite, and issues a purge command to clear the physical device storage.

---

## 📷 Complete Project Image Gallery

Here is the complete visual documentation of the VAHA hardware, schematics, and enclosure assembly:

<div align="center">
  <table border="0">
    <tr>
      <td width="50%" align="center">
        <img src="docs/design/images/block_diagram.png" width="95%" style="border-radius: 8px; border: 1px solid #ddd;"/><br/>
        <b>Figure 1. VAHA System Block Diagram</b>
      </td>
      <td width="50%" align="center">
        <img src="docs/design/images/circuit_diagram.png" width="95%" style="border-radius: 8px; border: 1px solid #ddd;"/><br/>
        <b>Figure 2. VAHA Main Circuit Schematic</b>
      </td>
    </tr>
    <tr>
      <td width="50%" align="center">
        <img src="docs/design/images/development_workspace.jpg" width="95%" style="border-radius: 8px;"/><br/>
        <b>Development Workspace Layout</b>
      </td>
      <td width="50%" align="center">
        <img src="docs/design/images/arduino_uno_q_lavalier_mic.jpg" width="95%" style="border-radius: 8px;"/><br/>
        <b>UNO Q, USB Hub & Lavalier Mic Setup</b>
      </td>
    </tr>
    <tr>
      <td width="50%" align="center">
        <img src="docs/design/images/sensor_wiring_breadboard.jpg" width="95%" style="border-radius: 8px;"/><br/>
        <b>DHT22 & AGS02MA TVOC Sensor Wiring</b>
      </td>
      <td width="50%" align="center">
        <img src="docs/design/images/water_flow_sensor_test_rig.jpg" width="95%" style="border-radius: 8px;"/><br/>
        <b>Water Flow Sensor Test Rig Setup</b>
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <img src="docs/design/images/assembled_device_enclosure.jpg" width="60%" style="border-radius: 8px; border: 1px solid #ddd;"/><br/>
        <b>Assembled VAHA Unit with Dharanova Private Limited Branding</b>
      </td>
    </tr>
  </table>
</div>

---

## 🔌 Hardware BOM & Wiring

### Bill of Materials (BOM)
*   **Microcontroller**: Arduino UNO Q (ABX00087) — 4GB RAM / 32GB storage
*   **Climate Sensor**: DHT22 Temperature & Humidity Sensor
*   **Air Quality Sensor**: AGS02MA TVOC Air Quality Sensor (I2C)
*   **Water Sensor**: Hall-effect Pulse Water Flow Sensor (7.5 pulses/L/min)
*   **Audio Input**: USB Lavalier Microphone (auto-detected via CS202 adapter)
*   **Audio Output**: PAM8403 Audio Amplifier + 4Ω 3W Speaker (chime + Piper TTS output)
*   **Peripherals**: Portronics USB-C multiport hub, 2x Mini Breadboards, 10000 mAh Power Bank

### Pin Connection Map
| Sensor/Module | Module Pin | Arduino UNO Q Pin | Connection Type | Description |
|:---|:---|:---|:---|:---|
| **DHT22** | VCC | 5V | Power | Temperature & Humidity Sensor |
| **DHT22** | DATA | Pin D2 | Digital Input | Climate telemetry signal line |
| **DHT22** | GND | GND | Ground | Common ground |
| **Water Flow** | VCC | 5V | Power | Hall-effect pulse sensor |
| **Water Flow** | SIG | Pin D3 | Digital Interrupt | RISING edge interrupt pulse counter |
| **Water Flow** | GND | GND | Ground | Common ground |
| **AGS02MA** | VCC | 3.3V | Power | TVOC air quality sensor |
| **AGS02MA** | SDA | Pin A4 (SDA) | I2C Data | Communicates at 20kHz clock |
| **AGS02MA** | SCL | Pin A5 (SCL) | I2C Clock | - |
| **AGS02MA** | GND | GND | Ground | Common ground |
| **PAM8403** | 5V / GND | 5V / GND | Power | Speaker amplifier module |
| **PAM8403** | Audio In | Audio Out (Analog)| Analog Input | Voice prompt TTS output from Uno Q |
| **Speaker** | L+ / L- | Speaker Outputs | Analog Output | 4Ω 3W audio transducer output |

---

## 🤖 AI / ML Model Specifications

| Layer / Task | Model Used | Platform / Runtime | Training & Dataset |
|:---|:---|:---|:---|
| **A: Wake-word Spotting** | `"Marvin"` (`new-marvin.eim`) | Edge Impulse Runner | Trained on 48 custom voice logs augmented into 1,800 sample iterations (98.7% accuracy). |
| **B: Stop-phrase Spotting** | `"im_done"` (`new-marvin.eim`) | Edge Impulse Runner | Trained on custom-recorded voice command datasets. |
| **C: Speech-to-Text (STT)** | `faster-whisper small` (277M) | CTranslate2 (int8, CPU) | Fine-tuned English speech model running 100% offline on-device. |

---

## 📊 Verification & Real Bathroom Noise Results

### Testing Highlights:
- **Verified under real bathroom noise — 34 capture trials**: Wake word and stop phrase were exercised across 34 capture attempts in an actual bathroom environment with the exhaust fan running and the tap open. Detection held reliably throughout at `0.75 / 0.80` thresholds.
- **End-to-end flow verified**: Wake word ➔ Recording ➔ Stop phrase / VAD cutoff ➔ On-device transcription ➔ Local SQLite save ➔ Mobile sync.
- **Checksum Verification**: Confirmed on every capture package synced to the companion app with zero corrupted transfers.

### Performance Metrics:
*   **Sync-Initiation Latency**: ~250 ms average per capture package.
*   **Transfer Throughput**: ~1.5 MB/s over local Wi-Fi.
*   **CPU Utilization**: ~30% peak CPU usage on the Arduino UNO Q during local Whisper inference.
*   **WebSocket Telemetry Latency**: <10 ms latency for real-time sensor updates.
*   **Database Write Latency**: ~5 ms per SQLite transaction in the mobile app.

---

## 📱 Mobile Companion APK

The compiled Android companion application is available in the repository:

*   **[📥 Download ARM64 App Build (v1.1.0)](release/vaha-companion-v1.1.0-arm64-v8a.apk)** (Optimized for arm64-v8a)
*   **[📥 Download ARMv7 App Build (v1.1.0)](release/vaha-companion-v1.1.0-armeabi-v7a.apk)** (Optimized for armeabi-v7a)

---

## ⚙️ Setup & Installation

### 1. Microcontroller Firmware Flash
1. Install Arduino CLI or Arduino IDE.
2. Open [`sketch/sketch.ino`](file:///c:/Projects/vaha/sketch/sketch.ino).
3. Install dependencies: `DHT` library and `Arduino_RouterBridge` library.
4. Upload the sketch to the **Arduino UNO Q** board.

### 2. Python Backend Edge Runtime
1. Install **Python 3.12** on the Uno Q Linux workspace.
2. Navigate to [`python/`](file:///c:/Projects/vaha/python):
   ```bash
   cd python
   python -m venv venv
   # Activate:
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Linux/macOS
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in API keys (Notion database IDs, Groq token for fallback).
5. Start the edge server:
   ```bash
   python main.py
   ```

### 3. Mobile Companion Application (React Native)
1. Install Node.js (LTS version).
2. Navigate to [`mobile/`](file:///c:/Projects/vaha/mobile):
   ```bash
   cd mobile
   npm install
   ```
3. Run the development server:
   ```bash
   npx expo start
   ```

---

## 📄 License & Intellectual Property

Proprietary. All rights reserved. Code licensed under custom terms for **Dharanova Private Limited**.
