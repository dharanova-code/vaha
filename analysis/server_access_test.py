#!/usr/bin/env python3
"""Run the VAHA device server from the vaha repository and record who it lets in.

The server code is run unchanged on a development machine, bound to 127.0.0.1, against a
temporary capture folder seeded with synthetic captures (one second of a 440 Hz tone each,
written by the server's own CaptureService.save_capture()). The UNO Q hardware is not involved;
the token check, the routes and the transport do not depend on it.

Two server configurations are tested:
  auth_on   the default (VAHA_AUTH_ENABLED unset, token left at its default)
  auth_off  VAHA_AUTH_ENABLED=false

For each request the script records the HTTP status, and for audio downloads whether the
body's MD5 matches the audio_md5 in the capture list. It also tries a TLS handshake on the
server's port to see whether the server speaks HTTPS.

Writes data/raw/server_access_test_<date>.csv and refuses to overwrite an existing file.

Usage:
  <python with the packages in analysis/requirements.txt> analysis/server_access_test.py
  (run from anywhere inside the vaha repository checkout; it locates python/ relative to its own location)

Dependencies: see analysis/requirements.txt (the device server's own imports).
"""

import argparse
import csv
import hashlib
import json
import math
import os
import platform
import socket
import ssl
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
DEFAULT_TOKEN = "vaha-dev-2026"  # config.py line 22, AppConfig.ts line 52
N_CAPTURES = 3
PORT = 18080


def tone_pcm(seconds=1.0, rate=48000, freq=440.0):
    n = int(seconds * rate)
    return b"".join(struct.pack("<h", int(8000 * math.sin(2 * math.pi * freq * i / rate))) for i in range(n))


def seed(vaha_python, capture_dir):
    """Write synthetic captures with the server's own save_capture()."""
    code = (
        "import json, sys\n"
        "from server.services.capture_service import capture_service\n"
        "pcm = sys.stdin.buffer.read()\n"
        f"ids = [capture_service.save_capture(pcm, f'synthetic test capture {{i + 1}}', None).transaction_id "
        f"for i in range({N_CAPTURES})]\n"
        "print(json.dumps(ids))\n"
    )
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir}
    out = subprocess.run([sys.executable, "-c", code], input=tone_pcm(), capture_output=True,
                         cwd=vaha_python, env=env, check=True).stdout.decode()
    return json.loads(out.strip().splitlines()[-1])


def start(vaha_python, capture_dir, auth_enabled):
    env = {**os.environ, "VAHA_CAPTURE_DIR": capture_dir, "VAHA_HTTP_HOST": "127.0.0.1",
           "VAHA_HTTP_PORT": str(PORT)}
    env.pop("VAHA_DEV_TOKEN", None)
    if auth_enabled:
        env.pop("VAHA_AUTH_ENABLED", None)
    else:
        env["VAHA_AUTH_ENABLED"] = "false"
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


def request(method, path, token):
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/v1{path}", method=method)
    if token is not None:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def tls_probe():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with socket.create_connection(("127.0.0.1", PORT), timeout=3) as s:
            with ctx.wrap_socket(s) as t:
                return f"TLS handshake succeeded ({t.version()})"
    except (ssl.SSLError, ConnectionError, OSError) as e:
        return f"TLS handshake failed: {type(e).__name__}"


def run_case(rows, base, case, method, path, token, expected_md5=None, cap_dir=None, tx=None):
    status, body = request(method, path, token)
    note = ""
    if expected_md5 is not None and status == 200:
        note = "body MD5 matches audio_md5" if hashlib.md5(body).hexdigest() == expected_md5 else "body MD5 differs"
    if method == "DELETE" and cap_dir is not None:
        still = any(tx in str(p) for p in Path(cap_dir).rglob("metadata.json"))
        note = "capture folder still present" if still else "capture folder removed"
    rows.append({**base, "case": case, "method": method, "path": f"/api/v1{path}",
                 "token_sent": {None: "none", DEFAULT_TOKEN: "default (vaha-dev-2026)"}.get(token, "other"),
                 "http_status": status, "response_bytes": len(body), "note": note})
    return status, body


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    args = ap.parse_args()
    vaha_python = str(ROOT / "python")  # this script now lives inside the vaha repo itself

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"server_access_test_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    rows = []
    for auth_on in (True, False):
        with tempfile.TemporaryDirectory() as cap_dir:
            ids = seed(vaha_python, cap_dir)
            proc = start(vaha_python, cap_dir, auth_on)
            base = {"run_at": run_at.isoformat(timespec="seconds"),
                    "server_config": "auth_on (defaults)" if auth_on else "auth_off (VAHA_AUTH_ENABLED=false)"}
            try:
                token = DEFAULT_TOKEN if auth_on else None
                run_case(rows, base, "health, no token", "GET", "/health", None)
                run_case(rows, base, "list, no token", "GET", "/captures", None)
                if auth_on:
                    run_case(rows, base, "list, wrong token", "GET", "/captures", "not-the-token")
                status, body = run_case(rows, base, "list, default token" if auth_on else "list, no token (repeat)",
                                        "GET", "/captures", token)
                listed = {c["transaction_id"]: c["audio_md5"] for c in json.loads(body)} if status == 200 else {}
                tx = ids[0]
                run_case(rows, base, "download, " + ("default token" if auth_on else "no token"), "GET",
                         f"/captures/{tx}", token, expected_md5=listed.get(tx))
                if auth_on:
                    run_case(rows, base, "delete, no token", "DELETE", f"/captures/{ids[1]}", None,
                             cap_dir=cap_dir, tx=ids[1])
                run_case(rows, base, "delete, " + ("default token" if auth_on else "no token"), "DELETE",
                         f"/captures/{tx}", token, cap_dir=cap_dir, tx=tx)
                rows.append({**base, "case": "TLS handshake on the server port", "method": "", "path": "",
                             "token_sent": "", "http_status": "", "response_bytes": "", "note": tls_probe()})
            finally:
                proc.terminate()
                proc.wait(timeout=10)

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    for r in rows:
        print(f"{r['server_config']:38} {r['case']:34} {str(r['http_status']):4} {r['note']}")
    print(f"Python {platform.python_version()} on {platform.system()} {platform.machine()}")
    print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
