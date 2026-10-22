#!/usr/bin/env python3
"""Measure sync-initiation latency and transfer throughput against the VAHA device server.

The server code is run unchanged on a development machine, bound to 127.0.0.1, against a
temporary capture folder seeded with synthetic captures (the server's own
CaptureService.save_capture()). The UNO Q hardware is not involved; timing here reflects
this development machine and local loopback, not the Arduino UNO Q or a real local Wi-Fi
link to a handset -- see the whitepaper's Limitations section for what that does and does
not establish.

For each of N_RUNS downloads: "sync-initiation latency" is wall-clock time from issuing the
GET request to the first byte of the response; "throughput" is the capture's byte size
divided by total download wall-clock time.

Writes data/raw/sync_performance_test_<date>.csv and refuses to overwrite an existing file.

Usage:
  <python with the packages in analysis/requirements.txt> analysis/sync_performance_test.py
  (run from anywhere inside the vaha repository checkout; it locates python/ relative to its own location)
"""

import argparse
import csv
import json
import math
import os
import platform
import struct
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TOKEN = "vaha-dev-2026"
PORT = 18081
N_RUNS = 10
CAPTURE_SECONDS = 8.0  # a representative voice-note length, not measured elsewhere in this repo


def tone_pcm(seconds, rate=48000, freq=440.0):
    n = int(seconds * rate)
    return b"".join(struct.pack("<h", int(8000 * math.sin(2 * math.pi * freq * i / rate))) for i in range(n))


def seed(vaha_python, capture_dir, n):
    code = (
        "import json, sys\n"
        "from server.services.capture_service import capture_service\n"
        "pcm = sys.stdin.buffer.read()\n"
        f"ids = [capture_service.save_capture(pcm, f'perf test capture {{i + 1}}', None).transaction_id "
        f"for i in range({n})]\n"
        "print(json.dumps(ids))\n"
    )
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir}
    out = subprocess.run([sys.executable, "-c", code], input=tone_pcm(CAPTURE_SECONDS), capture_output=True,
                         cwd=vaha_python, env=env, check=True).stdout.decode()
    return json.loads(out.strip().splitlines()[-1])


def start(vaha_python, capture_dir):
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir, "VAHA_HTTP_HOST": "127.0.0.1",
           "VAHA_HTTP_PORT": str(PORT)}
    env.pop("VAHA_DEV_TOKEN", None)
    env.pop("VAHA_AUTH_ENABLED", None)
    proc = subprocess.Popen([sys.executable, "-c", "from server.app import run_server; run_server()"],
                            cwd=vaha_python, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(100):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/v1/health", timeout=0.5)
            return proc
        except (urllib.error.URLError, ConnectionError):
            time.sleep(0.1)
    proc.terminate()
    raise SystemExit("server did not start")


def timed_download(tx):
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/v1/captures/{tx}", method="GET")
    req.add_header("Authorization", f"Bearer {DEFAULT_TOKEN}")
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=30) as r:
        first_byte = r.read(1)
        t_first_byte = time.perf_counter()
        rest = r.read()
        t_done = time.perf_counter()
    size = len(first_byte) + len(rest)
    return {
        "initiation_latency_ms": round((t_first_byte - t0) * 1000, 2),
        "total_download_s": round(t_done - t0, 4),
        "bytes": size,
        "throughput_MBps": round((size / (1024 * 1024)) / (t_done - t0), 4) if t_done > t0 else None,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    args = ap.parse_args()
    vaha_python = str(ROOT / "python")  # this script now lives inside the vaha repo itself

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"sync_performance_test_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    rows = []
    with tempfile.TemporaryDirectory() as cap_dir:
        ids = seed(vaha_python, cap_dir, N_RUNS)
        proc = start(vaha_python, cap_dir)
        try:
            for i, tx in enumerate(ids, 1):
                m = timed_download(tx)
                rows.append({"run_at": run_at.isoformat(timespec="seconds"), "run_index": i,
                             "transaction_id": tx, "capture_seconds": CAPTURE_SECONDS, **m})
        finally:
            proc.terminate()
            proc.wait(timeout=10)

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    lat = [r["initiation_latency_ms"] for r in rows]
    thr = [r["throughput_MBps"] for r in rows if r["throughput_MBps"] is not None]
    print(f"n={len(rows)} runs, {CAPTURE_SECONDS}s captures ({rows[0]['bytes']} bytes each)")
    print(f"initiation latency ms: min={min(lat)} max={max(lat)} mean={round(sum(lat)/len(lat), 2)}")
    print(f"throughput MB/s:       min={min(thr)} max={max(thr)} mean={round(sum(thr)/len(thr), 4)}")
    print(f"Python {platform.python_version()} on {platform.system()} {platform.machine()}")
    print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
