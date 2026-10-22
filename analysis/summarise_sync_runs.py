#!/usr/bin/env python3
"""Summarise the two loopback sync runs for the whitepaper (Table C.2 and section 6.2).

Reads, does not change:
  data/raw/sync_performance_test_2026-10-22.csv
  data/raw/dated_120_capture_session_2026-10-22.csv

Throughput is recomputed from `bytes` and `total_download_s` in decimal MB/s (10^6 bytes per
second). The raw column `throughput_MBps` was computed with 2^20 bytes, so it is in MiB/s
despite its name; it is not used here.

With n = 10, p95 and p99 cannot be estimated meaningfully, so the summary gives n, mean,
standard deviation (sample), min, median and max.

Writes data/processed/sync_performance_summary.csv and prints the 120-capture session counts.

Usage:
  python3 analysis/summarise_sync_runs.py

Dependencies: Python standard library (tested with Python 3.13).
"""

import csv
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PERF = ROOT / "data" / "raw" / "sync_performance_test_2026-10-22.csv"
SESSION = ROOT / "data" / "raw" / "dated_120_capture_session_2026-10-22.csv"
OUT = ROOT / "data" / "processed" / "sync_performance_summary.csv"


def describe(name, unit, values):
    return {"metric": name, "unit": unit, "n": len(values),
            "mean": round(statistics.mean(values), 1), "sd": round(statistics.stdev(values), 1),
            "min": round(min(values), 1), "median": round(statistics.median(values), 1),
            "max": round(max(values), 1)}


def main():
    with open(PERF, encoding="utf-8") as f:
        perf = list(csv.DictReader(f))
    ttfb = [float(r["initiation_latency_ms"]) for r in perf]
    mbps = [int(r["bytes"]) / 1e6 / float(r["total_download_s"]) for r in perf]
    rows = [describe("time to first byte", "ms", ttfb), describe("throughput", "MB/s", mbps)]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    for r in rows:
        print(r)
    print(f"capture size: {sorted({int(r['bytes']) for r in perf})} bytes")

    with open(SESSION, encoding="utf-8") as f:
        session = list(csv.DictReader(f))
    count = lambda col, val: sum(1 for r in session if r[col] == val)
    print(f"120-capture session: n={len(session)}, run at {session[0]['session_run_at']}")
    print(f"  download HTTP 200: {count('download_http_status', '200')}")
    print(f"  body MD5 matched the server's audio_md5: {count('md5_would_have_matched', 'yes')}")
    print(f"  delete HTTP 200: {count('delete_http_status', '200')}")
    secs = [float(r["capture_seconds"]) for r in session]
    print(f"  capture length s: min={min(secs)} max={max(secs)}")
    print(f"Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
