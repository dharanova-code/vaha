# Project Status: Vaha

This document tracks the specification and development progress of the Vaha physical device and companion application features.

> Last updated: 2026-08-07

---

## 1. Product Maturity Dashboard

*   **Documentation Baseline**: Established (v1.2.0)
*   **Physical Device MVP Status**: ✅ Functional — pipeline working end-to-end with high performance
*   **Companion App MVP Status**: ✅ Functional — sync, transcription, custom profile avatar, settings working cleanly
*   **Next Milestone**: BLE provisioning flow integration + Sensor TVOC firmware fix

---

## 2. Feature Implementation Matrix

### 2.1 Physical Device Subsystems (Uno Q / Python)

| Feature | Status | Notes |
|---------|--------|-------|
| Wake word detection | ✅ Working | Edge Impulse `new-marvin.eim` with spectral formant voice gate (ZCR + frequency ratio checks) |
| Recording pipeline | ✅ Working | Stops on `im_done` keyword (0.92 threshold, 4/6 sliding frames) OR 10.0s human voice silence VAD |
| On-device Whisper transcription | ✅ Working | Upgraded to `faster-whisper base.en` for 5x faster transcription with sub-millisecond normalize |
| Edge HTTP API (FastAPI) | ✅ Working | Port 8080, auth token check |
| `/captures/transcribe` endpoint | ✅ Working | Loads model based on configurable `WHISPER_MODEL_NAME` |
| DHT22 sensor (Temp/Humidity) | ✅ Working | Read via `Bridge.call('sensors_get')` |
| Flow sensor (L/min) | ✅ Working | Read via bridge |
| TVOC sensor (SGP30) | ❌ Broken | Returns hardcoded 8889 ppb — sensor not properly initialized in sketch firmware |
| Notion sync | ✅ Working | Dynamically enabled when token/db ID are present, syncs telemetry & notes |
| WebSocket server | ✅ Working | Port 8080/ws, broadcasts live capture states and heartbeats |

### 2.2 Companion Application Subsystems (Expo React Native)

| Feature | Status | Notes |
|---------|--------|-------|
| Device connection (HTTP) | ✅ Working | Connects to Uno Q via user-configured IP, test IP ping button |
| My Notes list | ✅ Working | Redesigned with spacious, unclustered layout, floating FAB |
| Audio download / sync | ✅ Working | Direct downloadAsync binary fetch, purges device on success |
| Groq cloud transcription fallback | ✅ Working | Sends to OpenAI-compatible Groq transcription fallback |
| Settings screen | ✅ Working | Persists profile avatar picker, Name, Email, Bio, server IP, Groq API key |
| Sensor display | ✅ Working | Live temperature, humidity, flow rate, TVOC, and total water consumed cards |
| BLE provisioning | 🚧 In progress | `NativeBleProvisioningService.ts` exists, not wired to setup flow yet |
| AI Analysis (summary/action items) | ❌ Not started | API stubbed |
| Privacy & storage panel | ✅ Working | Local SQLite settings persistence, retention timer settings |

---

## 3. Known Issues

| Issue | Severity | Root Cause | Status |
|-------|----------|------------|--------|
| TVOC always 8889 ppb | Medium | SGP30 not initialized in Arduino sketch | Open — hardware fix needed |
| BLE pairing not wired to setup flow | Low | `NativeBleProvisioningService.ts` not connected | In progress |

---

## 4. Pipeline Architecture Summary

```
[Uno Q Hardware]
  Microphone → Edge Impulse Wake Word (new-marvin.eim)
     → Recording loop (continuous PCM, 48kHz mono)
     → Stop phrase detection (im_done keyword, EIM inference)
     → faster-whisper transcription (small, int8, CPU)
     → Save to capture_service (YYYY/MM/DD/uuid/{audio.wav, metadata.json})
     → Notion sync (via python-notion-client)
     → FastAPI edge server serves captures to mobile app

[Mobile App]
  Device discovery (manual IP entry) → HTTP transport
     → GET /api/v1/captures → build metadata map
     → download audio → MD5 verify → save to local FS
     → DELETE /api/v1/captures/{id} (device purge after successful download)
     → transcription: POST /api/v1/captures/transcribe (on-device Whisper)
       OR cloud fallback to Groq whisper-large-v3
```
