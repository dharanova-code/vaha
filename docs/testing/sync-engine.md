# Sync Engine

The Sync Engine operates purely offline over a local WiFi connection.

## Triggers
- Automatic upon App Foregrounding (if Auto-Sync enabled in Settings).
- Automatic upon Device Connection (if Auto-Sync enabled).
- Manual trigger from Device Screen UI.

## Flow
1. Fetch pending list from Edge Server (`/captures`).
2. Iterates over missing captures.
3. Requests audio payload via `GET /captures/:id`.
4. Saves payload to `expo-file-system`.
5. Validates MD5 checksum using `expo-crypto`.
6. Inserts metadata into SQLite via `CaptureRepository`.
7. Sends `DELETE /captures/:id` to edge server.
8. Retries with exponential backoff on failure.

## Resilience
- Checksums prevent corrupted storage.
- Exponential backoff ensures network blips do not permanently halt sync.
- SQLite constraints ensure idempotency.
