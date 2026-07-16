# Vaha API & Protocol Specification

This document details the interface contracts and communication protocols defining interactions within the Vaha product ecosystem.

---

## 1. Device-to-App Local Synchronization Protocol

When the Vaha physical device establishes a local connection (Wi-Fi/BLE) to the Companion App, it syncs recorded notes using a binary protocol or secure JSON payload structure.

### 1.1 Synchronization Handshake
To initiate sync, the device transmits a status check payload:

```json
{
  "device_id": "VAHA-88291-A",
  "firmware_version": "1.0.4",
  "battery_percentage": 94,
  "buffered_notes_count": 12,
  "storage_used_bytes": 18291000
}
```

### 1.2 Note Transfer Payload
For each buffered transaction, the device streams the encrypted record:

```json
{
  "transaction_id": "tx-99201-abc",
  "captured_timestamp": "2026-07-16T08:22:00Z",
  "audio_payload": {
    "encoding": "FLAC",
    "sample_rate": 48000,
    "channels": 1,
    "payload_base64": "UklGRiS3AABXQVZFZm10IBIAAA..."
  },
  "telemetry_metrics": {
    "temperature_celsius": 24.5,
    "humidity_percentage": 62.1,
    "voc_parts_per_billion": 120,
    "liquid_flow": {
      "rate_liters_per_minute": 6.2,
      "accumulated_volume_liters": 12.4
    }
  }
}
```

---

## 2. Companion App-to-Cloud Sync API

If the user enables Cloud Sync, the Companion App communicates with the secure Vaha cloud infrastructure over HTTPS.

### 2.1 Note Creation Endpoint (`POST /api/v1/notes`)
Syncs a structured note transaction to the user's remote cloud profile.

#### Request Headers
*   `Authorization: Bearer <JWT_USER_TOKEN>`
*   `Content-Type: application/json`

#### Request Body
```json
{
  "transaction_id": "tx-99201-abc",
  "raw_transcript": "Establish a new design system file for the web client.",
  "captured_at": "2026-07-16T08:22:00Z",
  "telemetry": {
    "temperature": 24.5,
    "humidity": 62.1,
    "voc": 120,
    "flow_rate": 6.2,
    "flow_volume": 12.4
  },
  "ai_analysis_requested": true
}
```

#### Response Body
```json
{
  "note_id": "note-88219-xyz",
  "status": "processed",
  "structured_content": {
    "title": "Design System File Creation",
    "summary": "Create a new dedicated design system file for the web client.",
    "action_items": [
      {
        "task": "Establish design system file",
        "due_date": null,
        "completed": false
      }
    ],
    "suggested_tags": ["design", "web", "task"]
  }
}
```
