#!/usr/bin/env python3
"""Prove the TVOC placeholder values survive, unflagged, to the real HTTP API.

sketch/sketch.ino's readTVOC() returns a fixed 7777 on a short I2C read and 8888+err on a
transmission error (sketch/sketch.ino, readTVOC()). This script does not touch the sketch --
it runs the unchanged Python device server and asks, with a real call through the real code
path: if a capture carries one of these placeholder values, does anything between
capture_service.save_capture() and the server's own /captures API endpoint notice?

Method: call the server's own CaptureService.save_capture() directly (as main.py's capture
flow does) with a synthetic sensors dict carrying tvoc_ppb=7777 and tvoc_ppb=8891 (8888+3, an
arbitrary nonzero I2C error code), each alongside a normal-looking temperature/humidity/flow
reading. Then start the real FastAPI server, unchanged, and GET /api/v1/captures -- the same
endpoint the companion app calls -- and read back what it reports for each capture's
voc_parts_per_billion field.

Writes data/raw/tvoc_placeholder_propagation_2026-10-22.csv and refuses to overwrite an
existing file.

Usage:
  <python with the packages in analysis/requirements.txt> analysis/tvoc_placeholder_propagation_test.py
  (run from anywhere inside the vaha repository checkout; it locates python/ relative to its own location)
"""

import argparse
import csv
import json
import os
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
PORT = 18083

CASES = [
    {"label": "normal reading", "sensors": {"temp": 24.3, "humidity": 51.2, "flow_lpm": 0.0,
                                             "total_liters": 0.0, "tvoc_ppb": 142}},
    {"label": "readTVOC() short-read placeholder (7777)", "sensors": {"temp": 24.3, "humidity": 51.2,
                                             "flow_lpm": 0.0, "total_liters": 0.0, "tvoc_ppb": 7777}},
    {"label": "readTVOC() transmission-error placeholder (8888+3)", "sensors": {"temp": 24.3,
                                             "humidity": 51.2, "flow_lpm": 0.0, "total_liters": 0.0,
                                             "tvoc_ppb": 8891}},
]


def seed(vaha_python, capture_dir):
    code = (
        "import json, sys\n"
        "from server.services.capture_service import capture_service\n"
        "cases = json.loads(sys.stdin.read())\n"
        "pcm = bytes(48000 * 2)  # 1s of silence, enough for save_capture's WAV writer\n"
        "out = []\n"
        "for c in cases:\n"
        "    cap = capture_service.save_capture(pcm, f\"tvoc placeholder test: {c['label']}\", c['sensors'])\n"
        "    out.append(cap.transaction_id)\n"
        "print(json.dumps(out))\n"
    )
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir}
    out = subprocess.run([sys.executable, "-c", code], input=json.dumps(CASES).encode(),
                         capture_output=True, cwd=vaha_python, env=env, check=True, timeout=60).stdout.decode()
    return json.loads(out.strip().splitlines()[-1])


def start(vaha_python, capture_dir):
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir, "VAHA_HTTP_HOST": "127.0.0.1",
           "VAHA_HTTP_PORT": str(PORT)}
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


def main():
    ap = argparse.ArgumentParser()
    args = ap.parse_args()
    vaha_python = str(ROOT / "python")  # this script now lives inside the vaha repo itself

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"tvoc_placeholder_propagation_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    rows = []
    with tempfile.TemporaryDirectory() as cap_dir:
        ids = seed(vaha_python, cap_dir)
        proc = start(vaha_python, cap_dir)
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/v1/captures", method="GET")
            req.add_header("Authorization", f"Bearer {DEFAULT_TOKEN}")
            with urllib.request.urlopen(req, timeout=10) as r:
                listed = {c["transaction_id"]: c for c in json.loads(r.read())}
            for case, tx in zip(CASES, ids):
                cap = listed.get(tx, {})
                telemetry = cap.get("telemetry_metrics", {})
                api_value = telemetry.get("voc_parts_per_billion")
                rows.append({
                    "run_at": run_at.isoformat(timespec="seconds"),
                    "case_label": case["label"],
                    "transaction_id": tx,
                    "sent_tvoc_ppb": case["sensors"]["tvoc_ppb"],
                    "api_endpoint": "GET /api/v1/captures",
                    "api_reported_voc_parts_per_billion": api_value,
                    "any_error_flag_present": "no" if api_value is not None else "null (not flagged, just absent)",
                    "indistinguishable_from_real_reading": "yes" if api_value == case["sensors"]["tvoc_ppb"] else "no",
                })
        finally:
            proc.terminate()
            proc.wait(timeout=10)

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    for r in rows:
        print(f"{r['case_label']:48} sent={r['sent_tvoc_ppb']:5}  API reports={r['api_reported_voc_parts_per_billion']}")
    print(f"\nWrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
