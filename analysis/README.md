# Backend review and test scripts

These scripts run the device server's own code unchanged (never modified) to produce evidence cited in Dharanova's *Local-network synchronisation and data-integrity architecture of the VAHA companion application* whitepaper ([`dharanova-code/publications`](https://github.com/dharanova-code/publications), `Whitepapers/Vaha/2026-10_Local-Sync-Integrity-and-Architecture/`).

Install the exact tested package versions first:

```sh
pip install -r analysis/requirements.txt
```

- `server_access_test.py` — starts the device server bound to `127.0.0.1`, seeds synthetic captures, and records HTTP status and MD5 outcomes for list/download/delete requests with no token, a wrong token, and the default token, both with the auth check on and with `VAHA_AUTH_ENABLED=false`. Also probes whether the server port speaks TLS.
- `sync_performance_test.py` — times repeated downloads against the same unchanged server to measure sync-initiation latency and transfer throughput. Runs on loopback on whatever machine it's run on — not the Arduino UNO Q, not a real Wi-Fi link.
- `dated_120_capture_session.py` — runs a full, dated session of 120 synthetic captures through the real sync path (list, download, delete), to produce a timestamped result of the same shape as the companion app's own "120 notes, all synced" display.
- `inspect_release_apk.py` — reads a built APK's manifest and searches its JavaScript bundle for marker strings, to check what code a *released* build actually contains, independent of the source tree.

Each script writes to `data/raw/<script>_<date>.csv` and refuses to overwrite an existing file. All three server-side scripts run the server locally and never touch a real device; `inspect_release_apk.py` only reads an APK file, it doesn't install or run one.
