# Vaha Product Roadmap

This document outlines the product progression phases for the Vaha voice capture and ambient telemetry ecosystem.

---

## Phase 1: Core Capture Platform (Current Focus)

*   **Offline Voice Capture**: Reliable local wake-word recognition and local high-fidelity audio buffering on the physical device.
*   **Local Device-to-App Sync**: Secure local wireless transmission of audio payloads and telemetry data records.
*   **Enriched Transcripts**: Automated transcription and AI synthesis (summary, task extraction, automatic categorization) within the companion app.
*   **Environment Integration**: Standard climate and VOC sensor readings associated with each capture.

---

## Phase 2: Hardware Optimization & Deep App Capabilities

*   **Hardware Power Optimization**: Refine VROS power management drivers to target a minimum of 6 months battery life on cordless hardware variants.
*   **On-Device Storage Expansion**: Implement stream-to-flash optimization to support recording voice notes of arbitrary length (up to 30 minutes).
*   **Local Companion App Transcription**: Support high-performance local Whisper transcription on desktop and mobile clients, eliminating cloud dependencies for privacy-focused users.
*   **Advanced Task Manager Sync**: Direct integrations in the companion app to auto-export tasks to Todoist, Apple Reminders, and Notion databases.

---

## Phase 3: Ambient Intelligence & Scaling

*   **Multi-Device Environments**: Support multiple Vaha devices synced to a single companion app, with smart deduplication and room-level zone tracking.
*   **Environmental Analytics Dashboard**: Graphing and insight modules inside the companion app relating long-term climate, humidity, and VOC levels to user habits and wellbeing.
*   **Custom Wake Word Engines**: Let users define personalized wake words inside the companion app and train the hardware parameters over BLE.
*   **Automated Semantic Linking**: AI engine automatically connects notes together using semantic threads (e.g., reminding the user of a similar thought recorded 3 weeks prior).
