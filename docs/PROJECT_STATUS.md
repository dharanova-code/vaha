# Project Status: Vaha

This document tracks the specification and development progress of the Vaha physical device and companion application features.

> Last updated: 2026-08-07

---

## 1. Product Maturity Dashboard

*   **Documentation Baseline**: Established (v1.1.0)
*   **Physical Device MVP Status**: ✅ Functional — pipeline working end-to-end
*   **Companion App MVP Status**: 🚧 Integration — sync and transcription in repair
*   **Next Milestone**: Transcription & Sync Stability + Sensor TVOC Fix

---

## 2. Feature Implementation Matrix

### 2.1 Physical Device Subsystems (Uno Q / Python)

| Feature | Status | Notes |
|---------|--------|-------|
| Wake word detection | ✅ Working | Edge Impulse `new-marvin.eim` (threshold 0.85, 3 consec frames, 2.5s grace after chime) |
| Recording pipeline | ✅ Working | Continuous; stops on `im_done` keyword (0.75 threshold, 2 consec frames) |
| On-device Whisper transcription | ✅ Working | `faster-whisper small`, int8, CPU |
| Edge HTTP API (FastAPI) | ✅ Working | Port 8080, auth token `vaha-dev-2026` |
| `/captures/transcribe` endpoint | ✅ Fixed | Was broken (500 error — used `__main__` import hack). Now has self-contained Whisper singleton |
| DHT22 sensor (Temp/Humidity) | ✅ Working | Read via `Bridge.call('sensors_get')` |
| Flow sensor (L/min) | ✅ Working | Read via bridge |
| TVOC sensor (SGP30) | ❌ Broken | Returns hardcoded 8889 ppb — sensor not properly initialized in sketch firmware |
| Notion sync | ✅ Working | Syncs transcripts with telemetry to Notion database via API |
| WebSocket server | ✅ Working | Port 8080/ws, broadcasts `capture_ready` and heartbeat |

### 2.2 Companion Application Subsystems (Expo React Native)

| Feature | Status | Notes |
|---------|--------|-------|
| Device connection (HTTP) | ✅ Working | Connects to Uno Q via user-configured IP |
| Captures list | ✅ Working | Fetches and displays captures from device |
| Audio download / sync | ✅ Fixed | Was retrying endlessly due to re-fetching stale metadata; now uses cached metadata map |
| Groq cloud transcription fallback | ✅ Working | Sends to `api.groq.com/openai/v1/audio/transcriptions` when device offline |
| Settings (Groq API key, server IP) | ✅ Working | Persists to SQLite via drizzle-orm |
| Sensor display | ✅ Working | Shows temp/humidity/flow; TVOC shows wrong value (firmware bug) |
| BLE provisioning | 🚧 In progress | `NativeBleProvisioningService.ts` exists, not wired to setup flow yet |
| AI Analysis (summary/action items) | ❌ Not started | API stubbed |
| Privacy & storage panel | ❌ Not started | |

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
