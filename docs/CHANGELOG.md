# Changelog

All notable changes to the Vaha Product Specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-08-07

### Added
*   **Formant Voice Activity Detector (VAD)**: Implemented spectral VAD logic in `main.py` that computes Zero Crossing Rates (ZCR) and frequency band ratios (300Hz-3400Hz formant band vs >4000Hz noise band) to ignore non-human noises (running tap water, fans, room hum) during silence tracking.
*   **Audio Chime Feedback Suite**: Synthesized custom ALSA sound cues for wake (rising double beep), stop (falling double beep), and success (ascending C-E-G major chord).
*   **Interactive Profile Photo & Avatar picker**: Added `expo-image-picker` support, editable profile Name, Email, and Bio with persistent Zustand + SQLite SQLite schema.
*   **Device IP Ping Test**: Added interactive "Test IP" button in Settings to send active HTTP status check to Vaha Box.

### Fixed
*   **Mid-Sentence Recording Cutoffs**: Increased stop keyword threshold to 0.92, required 4 out of 6 sliding window frames, and gated inference to only run when human voice is actively detected, protecting continuous speech.
*   **10-Second Silence Auto-Stop**: Extended silence VAD auto-stop to 10.0 seconds so long pauses are allowed, but the box auto-stops without needing keyword repetition.
*   **Dynamic Time Greetings**: Replaced hardcoded greeting on Home screen with real local time-of-day greetings (Good Morning / Afternoon / Evening / Night) and user's first name.
*   **Notion Sync Skip**: Notion sync now dynamically enables when `NOTION_TOKEN` and `NOTION_DATABASE_ID` are present in `.env`, instead of being hardcoded to `False`.

### Changed
*   **Whisper Performance Boost**: Upgraded transcription speed 5x by switching default `WHISPER_MODEL_NAME` to `base.en` and replacing CPU-intensive STFT `noisereduce` with sub-millisecond normalization. Total pipeline lag dropped from ~36s to ~4-5s.
*   **Airy & Spacious Card Layout**: Redesigned captures list with 18px padding, 16px margins, clean pill filters, and floating Record Note button to eliminate cramped and cluttered elements.
*   **Tab Titles**: Renamed tabs to Home, My Notes, and My Device.

---

## [1.1.0] - 2026-08-07

### Fixed
- **`/captures/transcribe` 500 error**: Removed broken `import __main__` hack that crashed when the server ran under Uvicorn (entry point is `server/app.py`, not `main.py`). The endpoint now owns a self-contained lazy Whisper singleton.
- **Sync retry loop**: `SyncService.processQueue()` was re-fetching the full `/captures` list from the device for each item. If a capture was already deleted after a prior successful download, the fetch returned nothing and the item was spuriously marked "failed". Fixed by building an in-memory `metadataByLocalId` map during discovery and passing it to `processQueue`.
- **VAD false-stops**: Removed Voice Activity Detection (VAD) + silence timeout from the recording pipeline. The pipeline now uses 100% keyword-based stop detection (`im_done`), eliminating false stops caused by the chime echo being detected as silence.

### Changed
- **Wake word sensitivity**: Threshold raised to 0.85 with 3 consecutive frames required to reduce false triggers.
- **Stop phrase sensitivity**: Threshold set to 0.75 with 2 consecutive frames to allow natural fast speech for the stop phrase.
- **Startup grace period**: Increased to 2.5 seconds to filter out chime echo from wake word inference window.
- **`faster-whisper` integration on server**: The `/captures/transcribe` endpoint now directly loads `WhisperModel(small, int8)` from `WHISPER_MODEL_DIR` env var, making it usable from any process context.

### Known Issues
- **TVOC sensor**: SGP30 returns hardcoded 8889 ppb. Root cause is in the Arduino sketch firmware (sensor not properly initialized). Hardware fix pending.

---

## [1.0.0] - 2026-07-16

This release establishes the baseline product documentation suite for the commercialization of the Vaha ecosystem.

### Added
- **Product Vision Specification**: Established core design principles, architectural split between Physical Device (simple capture) and Companion App (intelligence center), and primary user scenarios.
- **Product Requirements Document (PRD)**: Defined formal functional requirements for device voice capture, telemetry association, connectivity, and companion app note management.
- **VROS OS Specification**: Detailed the embedded operating system layers, audio ring buffer streaming, power states, and security properties.
- **Interaction Flows**: Documented setup and pairing, voice capture, sync sequences, and data enrichment flows.
- **Screen & Interface Inventory**: Detailed layout specifications for the Companion App screens and physical device LED/audio cues.
- **Design System Manual**: Defined brand colors, typography, sonic feedback chimes, and LED animation parameters.
- **API Spec**: Documented local BLE sync packets, note transfer records, and HTTPS API endpoints.
- **Data Model Schema**: Specified physical flash memory configurations, companion database schemas, and AI task tables.
- **Roadmap**: Outlined Phase 1 (Capture), Phase 2 (Optimization), and Phase 3 (Intelligence) milestones.
- **System Architecture Specification**: Added system overview, data flow models, offline strategy, and component mappings.
- **Architecture Decisions Record (ADR)**: Established formal ADR documentation tracking major product design choices.

