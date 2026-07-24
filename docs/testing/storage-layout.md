# Storage Layout

## Edge Server Storage
The edge server (Arduino Uno Q) utilizes a hierarchical folder structure. This prevents directory iteration bottlenecks.

```
/app/captures/
  YYYY/
    MM/
      DD/
        <uuid>/
           audio.wav
           metadata.json
           transcript.json
           checksum.md5
```

## Mobile Storage (React Native)
- **Audio:** Securely stored using `expo-file-system` inside `documentDirectory/vaha/audio/<uuid>.wav`.
- **Metadata:** Persistent metadata is loaded into the `expo-sqlite` database (`captures` table) containing UUIDs, dates, and transcript payloads.
