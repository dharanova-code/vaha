# Failure Recovery

The offline Sync engine is built to handle common failure scenarios efficiently.

## 1. Network Drops During Transfer
- Transport will emit `DeviceDisconnectedError`.
- State transitions to `failed` for that capture segment.
- Retry queue waits utilizing exponential backoff.
- On reconnection, incomplete files are overwritten cleanly by starting the payload request again.

## 2. Checksum Mismatch
- The `expo-crypto` hash compares to the `metadata.audio_md5`.
- If mismatch detected: `ChecksumMismatchError` emitted.
- Current downloaded binary dropped. Retries fetch immediately (up to 3 times) before skipping to avoid infinite loops on corrupted disk sectors on edge.

## 3. Power Loss on Device
- Directory structure prevents orphaned JSON files lacking audio (UUID folder allows atomic deletion).
- Sync only targets valid directories containing the `metadata.json`.

## 4. Power Loss on Mobile
- Mobile uses a "Write-and-Confirm" protocol.
- The `DELETE` payload is only sent to the edge device *after* a successful SQLite `INSERT`.
- If the phone crashes post-download but pre-insert, the Edge device retains the file, and sync resumes upon reboot.
