# Vaha Data Model & Schema Specification

This document details the data structures, schemas, and relational models utilized across the Vaha device storage, local companion app, and cloud sync layers.

---

## 1. Physical Device Flash File Layout

To ensure data integrity under power-loss conditions, VROS structures voice notes in a sequential, fixed-header format inside the non-volatile memory (NVM).

```
+-------------------------------------------------------------+
| Header Block                                                |
| - Transaction ID (16 bytes)                                 |
| - Timestamp (8 bytes - Unix epoch)                          |
| - Telemetry Offset (4 bytes)                                |
| - Audio Offset (4 bytes)                                    |
+-------------------------------------------------------------+
| Telemetry Context Block                                     |
| - Temperature (4 bytes, Float32)                            |
| - Humidity (4 bytes, Float32)                               |
| - VOC Level (4 bytes, UInt32)                               |
| - Liquid Flow Rate (4 bytes, Float32)                       |
| - Liquid Flow Volume (4 bytes, Float32)                     |
+-------------------------------------------------------------+
| Encrypted Audio Block                                       |
| - Salt & IV (24 bytes)                                      |
| - Audio Frame Data (Encrypted AES-256-GCM)                  |
+-------------------------------------------------------------+
```

---

## 2. Companion App Relational Schema

The Companion App houses note, device, and task data in a relational database.

### 2.1 Table: `notes`
Stores the core contents and metadata of captured thoughts.

| Column Name | Data Type | Key Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary | Unique identifier for the note. |
| `transaction_id` | Text | Unique | Match identifier from the device. |
| `raw_text` | Text | None | Full transcription block. |
| `title` | Text | None | AI-generated summary title. |
| `summary` | Text | None | AI-generated summary bullet points. |
| `captured_at` | Timestamp | None | Time of physical voice recording. |
| `sync_status` | Text | None | State of note sync: `LocalOnly`, `CloudSynced`. |

### 2.2 Table: `telemetry_records`
Links physical sensor context to notes.

| Column Name | Data Type | Key Type | Description |
| :--- | :--- | :--- | :--- |
| `note_id` | UUID | Foreign | References `notes.id` (Cascade on Delete). |
| `temperature` | Real | None | Temperature at time of capture (°C). |
| `humidity` | Real | None | Relative Humidity percentage. |
| `voc` | Integer | None | TVOC levels in ppb. |
| `flow_rate` | Real | None | Liquid flow rate (L/min). |
| `flow_volume` | Real | None | Liquid volume (Liters). |

### 2.3 Table: `action_items`
Extracts tasks identified by the AI.

| Column Name | Data Type | Key Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary | Unique task identifier. |
| `note_id` | UUID | Foreign | References `notes.id`. |
| `task_description`| Text | None | The physical item to complete. |
| `completed` | Boolean | None | Completion status toggle. |
| `due_date` | Timestamp | None | Optional extracted deadline. |
