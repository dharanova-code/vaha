# Capture Pipeline

The capture pipeline manages the entire lifecycle of a voice note, from raw PCM audio on the device to a fully synced UI on the mobile client.

## 1. Trigger (Wake Word)
- User speaks the wake word ("Marvin").
- `edge_impulse_linux.runner` matches the wake word logic in `main.py`.
- **Event:** `capture_started` broadcast over WebSocket.
- Chime plays.

## 2. Voice Capture
- Raw `int16` 48kHz audio is captured continuously until silence or stop phrase.
- Noise reduction reduces background artifacts.
- **Event:** `recording` broadcast over WebSocket.

## 3. Local Processing (Whisper)
- **Event:** `capture_finished` broadcast over WebSocket when recording terminates.
- Audio is downsampled to 16kHz for Faster Whisper.
- Whisper converts voice to text.
- **Event:** `whisper_processing` broadcast.

## 4. Edge Storage
- Snapshot of sensors is taken.
- `CaptureService` stores `audio.wav`, `metadata.json`, `checksum.md5`, and `transcript.json` in `captures/YYYY/MM/DD/uuid/`.
- **Event:** `capture_ready` broadcast to alert mobile.

## 5. Mobile Sync
- `DeviceSyncService` handles file fetching and checksum validation.
- Writes to `expo-file-system`.
- Injects into local SQLite via `CaptureRepository`.
- Edge device storage is purged of synced capture.
