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

## raw/tvoc_placeholder_propagation_2026-10-22.csv

Written by `analysis/tvoc_placeholder_propagation_test.py` on 2026-10-22. The device server was run unchanged, seeded with three synthetic captures via `CaptureService.save_capture()` (one normal TVOC reading, one carrying `readTVOC()`'s short-read placeholder `7777`, one carrying its transmission-error placeholder `8888+3`), then read back through the real `GET /api/v1/captures` endpoint. Backs the sensor-bridge whitepaper's Table 5.2.

| Column | Meaning |
| --- | --- |
| `run_at` | When the script ran, ISO 8601 with time zone |
| `case_label` | Which of the three synthetic readings |
| `transaction_id` | Capture's ID |
| `sent_tvoc_ppb` | What was given to `save_capture()` |
| `api_endpoint` | Which real endpoint was read back from |
| `api_reported_voc_parts_per_billion` | What the API actually returned |
| `any_error_flag_present` | Always "no" — confirms there is no flag anywhere to check |
| `indistinguishable_from_real_reading` | "yes" if the API value matches what was sent exactly, with no marker |

## raw/readtvoc_logic_simulation_2026-10-22.csv

Written by `analysis/readtvoc_logic_simulation.c`, compiled and run with `tcc` (Tiny C Compiler) on 2026-10-22. `readTVOC()` (`sketch/sketch.ino`, lines 17–41) was transcribed by hand into a standalone C program, with its three `Wire` calls replaced by mock functions this harness controls, so each of its three branches could be driven on purpose. Not a build of the original `.ino`. Backs the sensor-bridge whitepaper's Table 5.3.

| Column | Meaning |
| --- | --- |
| `run_at` | When the simulation ran, ISO 8601 with time zone |
| `scenario` | Healthy sensor / I2C transmission fails / short I2C read |
| `mock_setup` | What the mock `Wire` functions were set to return |
| `readtvoc_branch_taken` | Which branch of the transcribed source this drove |
| `expected_return_value` | What the source says that branch returns |
| `actual_return_value` | What the compiled simulation actually returned |
| `matches_source_logic` | "yes" for all three — confirms the transcription is faithful, not that real hardware behaves this way |
| `compiler` | `tcc`, not the Arduino toolchain |

## raw/wer_latency_test_2026-10-22.csv

Written by `analysis/wer_latency_test.py` on 2026-10-22, on a development computer (Intel Core i5-10210U @ 1.60 GHz, Windows build 10.0.26200, Python 3.12.10, packages in `analysis/requirements.txt`). 12 known-transcript sentences from `analysis/tts_references/` (offline Windows text-to-speech, two SAPI voices), resampled to 16,000 Hz, transcribed by both candidate models (`base.en`, `small`) using the exact decode options and post-processing `python/main.py` uses. 24 rows (12 sentences × 2 models). Not the Arduino UNO Q; not real human speech.

| Column | Meaning |
| --- | --- |
| `run_at` | When the script ran, ISO 8601 with time zone |
| `model` | `base.en` or `small` |
| `model_load_s` | Time to load that model, seconds (once per model, not per sentence) |
| `ref_index` | 0–11 |
| `voice` | SAPI voice used for that sentence |
| `reference_text` | The known, exact text synthesized |
| `hypothesis_text` | What the model transcribed |
| `audio_seconds` | Length of the synthesized audio, seconds |
| `inference_s` | Wall-clock transcription time, seconds |
| `ref_word_count` | Words in `reference_text` |
| `edit_distance` | Word-level Levenshtein distance, `reference_text` vs. `hypothesis_text` |
| `wer` | `edit_distance / ref_word_count` |

## processed/wer_latency_summary.csv

Written by `analysis/summarise_wer.py` from `raw/wer_latency_test_2026-10-22.csv`. One row per (model, metric): n, mean, standard deviation (sample), min, median, max, for word error rate and inference latency.

## Still needed

| Needed file | What it should contain | Why |
| --- | --- | --- |
| `raw/corruption_test_log.csv` | Per trial: timestamp, capture id, how the transfer was altered, accepted or rejected, device copy kept or deleted | Evidence for R2 once the MD5 check is restored (at least 59 trials) |
| `raw/packet_capture/` | Captures of sync traffic on the Wi-Fi network before and after TLS, with a note of what was readable | Evidence for R4 on the real network |
| `raw/access_test_log.csv` | As `server_access_test`, but on the UNO Q from a second device on the network, before and after the per-device credential | Evidence for R3 on the device |
| `raw/sync_timing_log.csv` (on the UNO Q, real Wi-Fi) | Per sync: timestamp, capture id, size in bytes, request and download durations in ms, session id, across several sessions | `sync_performance_test_2026-10-22.csv` is a first version of this on loopback; replaces the reported ~250 ms and ~1.5 MB/s with p50/p95/p99 and n only once it's run against real hardware over real Wi-Fi |
| `raw/interruption_log.csv` | Per trial: interruption type (Wi-Fi drop, app closed), attempts, outcome, capture lost or duplicated | Retry and recovery behaviour |
| `raw/ags02ma_physical_fault_test.csv` | Same propagation test as `tvoc_placeholder_propagation_2026-10-22.csv`, but with a real I2C fault induced on real AGS02MA hardware (e.g. disconnected SDA), not a synthetic value | Confirms the firmware actually produces these placeholder values in the field, which this round of testing does not establish |
| `raw/uno_q_wer_latency_test.csv` | Same measurement as `wer_latency_test_2026-10-22.csv`, run on the Arduino UNO Q itself | The existing run's latency numbers are not representative of the target hardware |
| `raw/real_speech_wer_test.csv` | Same measurement, with real recorded human speech under the bathroom-noise conditions used elsewhere in this series, not synthetic TTS | Synthetic speech has none of the acoustic difficulty (fan noise, echo, mic distance) real use has |
