#!/usr/bin/env python3
"""Run a real, dated 120-capture sync session against the VAHA device server.

Figure 2's screenshot shows 120 notes, all reported synced, with no recorded session date.
That date can't be recovered after the fact. This script replaces the question "when did
that session run?" with a new one that has an answer: it runs the same scale of session
(120 synthetic captures) through the real sync path today, using the same unchanged server
code as the other scripts in this folder, and records exactly when, with a result per
capture.

The UNO Q hardware is not involved; the sync path's logic (list, download, delete) does not
depend on it. This is not a re-creation of the original session -- it cannot be, the original
has no recorded date to match -- it is a fresh, dated, reproducible session of the same size,
run under the code as it exists today (2026-08-17 state), which still has no checksum check.
That absence is what this script demonstrates directly: every one of the 120 downloads
below is reported "synced" on HTTP 200 alone, exactly as Figure 2's screenshot shows, with
no comparison of any kind performed by the app or the server.

Writes data/raw/dated_120_capture_session_<date>.csv and refuses to overwrite an existing
file.

Usage:
  <python with the packages in analysis/requirements.txt> analysis/dated_120_capture_session.py
  (run from anywhere inside the vaha repository checkout; it locates python/ relative to its own location)
"""

import argparse
import csv
import hashlib
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
PORT = 18082
N_CAPTURES = 120


def tone_pcm(seconds, rate=48000, freq=440.0):
    n = int(seconds * rate)
    return b"".join(struct.pack("<h", int(8000 * math.sin(2 * math.pi * freq * i / rate))) for i in range(n))


def seed(vaha_python, capture_dir, n):
    """Write N synthetic captures, each a few seconds, varied length like real voice notes."""
    code = (
        "import json, random, sys\n"
        "from server.services.capture_service import capture_service\n"
        "random.seed(120)\n"
        "ids = []\n"
        f"for i in range({n}):\n"
        "    secs = random.uniform(2.0, 14.0)\n"
        "    n_samp = int(secs * 48000)\n"
        "    import struct, math\n"
        "    pcm = b''.join(struct.pack('<h', int(6000 * math.sin(2*math.pi*440*j/48000))) for j in range(n_samp))\n"
        "    cap = capture_service.save_capture(pcm, f'dated session capture {i + 1}', None)\n"
        "    ids.append((cap.transaction_id, secs))\n"
        "print(json.dumps(ids))\n"
    )
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir}
    out = subprocess.run([sys.executable, "-c", code], capture_output=True,
                         cwd=vaha_python, env=env, check=True, timeout=300).stdout.decode()
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


def request(method, path):
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/v1{path}", method=method)
    req.add_header("Authorization", f"Bearer {DEFAULT_TOKEN}")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    args = ap.parse_args()
    vaha_python = str(ROOT / "python")  # this script now lives inside the vaha repo itself

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"dated_120_capture_session_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    rows = []
    with tempfile.TemporaryDirectory() as cap_dir:
        seeded = seed(vaha_python, cap_dir, N_CAPTURES)
        proc = start(vaha_python, cap_dir)
        try:
            status, body = request("GET", "/captures")
            listed = {c["transaction_id"]: c["audio_md5"] for c in json.loads(body)} if status == 200 else {}
            for i, (tx, secs) in enumerate(seeded, 1):
                t0 = time.perf_counter()
                dstatus, dbody = request("GET", f"/captures/{tx}")
                dt = time.perf_counter() - t0
                would_match = ""
                if dstatus == 200 and tx in listed:
                    would_match = "yes" if hashlib.md5(dbody).hexdigest() == listed[tx] else "no"
                reported_synced = "yes" if dstatus == 200 else "no"
                del_status, _ = request("DELETE", f"/captures/{tx}")
                rows.append({
                    "session_run_at": run_at.isoformat(timespec="seconds"),
                    "capture_index": i,
                    "transaction_id": tx,
                    "capture_seconds": round(secs, 2),
                    "download_http_status": dstatus,
                    "download_s": round(dt, 4),
                    "reported_synced": reported_synced,
                    "md5_would_have_matched": would_match,
                    "md5_actually_checked_by_app": "no",
                    "delete_http_status": del_status,
                })
        finally:
            proc.terminate()
            proc.wait(timeout=10)

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    n_synced = sum(1 for r in rows if r["reported_synced"] == "yes")
    n_checked = sum(1 for r in rows if r["md5_actually_checked_by_app"] == "yes")
    print(f"{len(rows)} captures, session run at {run_at.isoformat(timespec='seconds')}")
    print(f"reported synced (HTTP 200): {n_synced}/{len(rows)}")
    print(f"actually MD5-checked by the app's own code: {n_checked}/{len(rows)}")
    print(f"Python {platform.python_version()} on {platform.system()} {platform.machine()}")
    print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
