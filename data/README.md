# Data dictionary

The findings in sections 3 and 5.1 are read from the `vaha` repository at commit `e65d6c0` (last change 2026-08-17); that evidence is each cited file and line (whitepaper Appendix A). The files below are measured. The four performance figures in Appendix C are **reported** (from the `vaha` README), not from a file here. The retry waits and the corruption-test trial count are **calculated** by `analysis/make_diagrams.py`.

## raw/dated_120_capture_session_2026-10-22.csv

Written by `analysis/dated_120_capture_session.py` on 2026-10-22, on a development computer (Windows on AMD64, Python 3.12.10, packages in `analysis/requirements.txt`), with the server bound to 127.0.0.1 port 18082. Figure 2's screenshot shows 120 synced notes with no recorded session date; this is a fresh 120-capture session of the same scale, run today through the real sync path (list, download, delete) against the unchanged device server, one row per capture.

| Column | Meaning |
| --- | --- |
| `session_run_at` | When the session ran, ISO 8601 with time zone |
| `capture_index` | 1–120 |
| `transaction_id` | Synthetic capture's ID |
| `capture_seconds` | Synthetic capture length, seconds (varied, 2–14 s) |
| `download_http_status` | HTTP status for the download |
| `download_s` | Download wall-clock time, seconds |
| `reported_synced` | `yes` if `download_http_status` was 200 — this is all "synced" means in the app today |
| `md5_would_have_matched` | Whether the downloaded body's MD5 matches the server's own record, checked by this script, not the app |
| `md5_actually_checked_by_app` | Always `no`. Set by the script from the code review (Gap 1), not measured: the app is not run |
| `delete_http_status` | HTTP status for the delete request that follows |

## raw/release_apk_inspection_2026-10-22.csv

Written by `analysis/inspect_release_apk.py` on 2026-10-22 from the two APKs in the `vaha` repository's `release/` folder (committed 2026-08-10). One row per APK per check.

| Column | Meaning |
| --- | --- |
| `inspected_at` | When the script ran, ISO 8601 with time zone |
| `apk_file` | APK file name |
| `sha256` | SHA-256 of the APK, to identify the exact build |
| `size_bytes` | APK size, bytes |
| `version_name` | `versionName` from the manifest |
| `check` | `manifest usesCleartextTraffic`, or `bundle string: <text>` for a search of `assets/index.android.bundle` |
| `meaning` | What the check shows |
| `value` | Manifest value (`true`, `false` or `not set`), or the number of times the text occurs in the bundle |

## raw/server_access_test_2026-10-22.csv

Written by `analysis/server_access_test.py` on 2026-10-22. The device server code from `vaha` at `e65d6c0` was run unchanged on a development computer (macOS, Apple silicon, Python 3.13.3, packages in `analysis/requirements.txt`), bound to 127.0.0.1 port 18080, with three synthetic captures (1 s, 440 Hz tone, 48 kHz mono) written by the server's own `save_capture()` into a temporary folder. One run per case.

| Column | Meaning |
| --- | --- |
| `run_at` | When the script ran, ISO 8601 with time zone |
| `server_config` | `auth_on (defaults)` or `auth_off (VAHA_AUTH_ENABLED=false)` |
| `case` | Short description of the request |
| `method`, `path` | HTTP method and path |
| `token_sent` | `none`, `default (vaha-dev-2026)` or `other` (a wrong token) |
| `http_status` | HTTP status returned |
| `response_bytes` | Length of the response body, bytes |
| `note` | For downloads, whether the body's MD5 matches `audio_md5` in the list; for deletes, whether the capture folder is still on disk; for the TLS case, the handshake outcome |

## raw/sync_performance_test_2026-10-22.csv

Written by `analysis/sync_performance_test.py` on 2026-10-22. The device server code from `vaha` was run unchanged on a development computer (Windows, Python 3.12.10, packages in `analysis/requirements.txt`), bound to 127.0.0.1 port 18081, with 10 synthetic captures (8 s, 440 Hz tone, 48 kHz mono) written by the server's own `save_capture()`. Loopback on a development machine, not the Arduino UNO Q and not a real Wi-Fi link — see whitepaper Appendix C for what this does and does not establish.

| Column | Meaning |
| --- | --- |
| `run_at` | When the script ran, ISO 8601 with time zone |
| `run_index` | 1–10 |
| `transaction_id` | Synthetic capture's ID |
| `capture_seconds` | Synthetic capture length, seconds |
| `initiation_latency_ms` | Wall-clock time from request to first byte of response |
| `total_download_s` | Wall-clock time from request to the full body received |
| `bytes` | Response body size |
| `throughput_MBps` | `bytes` / 2^20 divided by `total_download_s`, so MiB/s despite the name. The whitepaper uses decimal MB/s recomputed from `bytes` and `total_download_s` (see `processed/` below) |

## processed/sync_performance_summary.csv

Written by `analysis/summarise_sync_runs.py` from `raw/sync_performance_test_2026-10-22.csv`. One row per metric: time to first byte (ms) and throughput (decimal MB/s, from `bytes` and `total_download_s`), with `n`, `mean`, `sd` (sample), `min`, `median` and `max`. Used for whitepaper Table C.2.

## Still needed

| Needed file | What it should contain | Why |
| --- | --- | --- |
| `raw/corruption_test_log.csv` | Per trial: timestamp, capture id, how the transfer was altered, accepted or rejected, device copy kept or deleted | Evidence for R2 once the MD5 check is restored (at least 59 trials) |
| `raw/packet_capture/` | Captures of sync traffic on the Wi-Fi network before and after TLS, with a note of what was readable | Evidence for R4 on the real network |
| `raw/access_test_log.csv` | As `server_access_test`, but on the UNO Q from a second device on the network, before and after the per-device credential | Evidence for R3 on the device |
| `raw/sync_timing_log.csv` (on the UNO Q, real Wi-Fi) | Per sync: timestamp, capture id, size in bytes, request and download durations in ms, session id, across several sessions | `sync_performance_test_2026-10-22.csv` is a first version of this on loopback; replaces the reported ~250 ms and ~1.5 MB/s with p50/p95/p99 and n only once it's run against real hardware over real Wi-Fi |
| `raw/interruption_log.csv` | Per trial: interruption type (Wi-Fi drop, app closed), attempts, outcome, capture lost or duplicated | Retry and recovery behaviour |
