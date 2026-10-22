# Backend review and test scripts

These scripts run the device server's own code unchanged (never modified) to produce evidence cited in Dharanova's whitepaper *Device-to-app sync for VAHA: architecture, and the integrity and security of the current build*.

Install the exact tested package versions first:

```sh
pip install -r analysis/requirements.txt
```

- `server_access_test.py` — starts the device server bound to `127.0.0.1`, seeds synthetic captures, and records HTTP status and MD5 outcomes for list/download/delete requests with no token, a wrong token, and the default token, both with the auth check on and with `VAHA_AUTH_ENABLED=false`. Also probes whether the server port speaks TLS.
- `sync_performance_test.py` — times repeated downloads against the same unchanged server to measure sync-initiation latency and transfer throughput. Runs on loopback on whatever machine it's run on — not the Arduino UNO Q, not a real Wi-Fi link.
- `dated_120_capture_session.py` — runs a full, dated session of 120 synthetic captures through the device server's side of the sync path only (list, download, delete against the server's own HTTP API). It does not exercise the companion app — there is no mobile client involved, and no claim is made about the app's own behaviour. The result is a timestamped count of the same shape as the app's "120 notes, all synced" display, produced entirely server-side.
- `inspect_release_apk.py` — reads a built APK's manifest and searches its JavaScript bundle for marker strings, to check what code a *released* build actually contains, independent of the source tree.
- `summarise_sync_runs.py` — reads `sync_performance_test_2026-10-22.csv` and `dated_120_capture_session_2026-10-22.csv` (does not change them) and writes `data/processed/sync_performance_summary.csv`: n, mean, standard deviation, min, median, max for time-to-first-byte and throughput, plus the 120-capture session's pass counts.

Each test script writes to `data/raw/<script>_<date>.csv` and refuses to overwrite an existing file. All three server-side scripts run the server locally and never touch a real device; `inspect_release_apk.py` only reads an APK file, it doesn't install or run one; `summarise_sync_runs.py` only reads existing raw data and writes to `data/processed/`.

See `data/README.md` for what each raw and processed CSV's columns mean.
