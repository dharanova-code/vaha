#!/usr/bin/env python3
"""Check what the released companion-app builds contain, as opposed to what the repository says.

For each APK given, records its SHA-256 and size, reads the manifest with aapt2 (version name and
the usesCleartextTraffic setting), and counts marker strings in the JavaScript bundle
(assets/index.android.bundle, Hermes bytecode; string literals are stored as plain text):

  vaha-dev-2026                          default device token compiled into the app (Gap 2)
  via downloadAsync                      log text of the download code written on 2026-08-07
  Capture stored but device purge failed log text of the same code, after the delete request
  Checksum verification failed           log text of the MD5 comparison removed on 2026-08-07

Writes data/raw/release_apk_inspection_<date>.csv and refuses to overwrite an existing file.

Usage:
  python3 analysis/inspect_release_apk.py --aapt2 <path to aapt2> <apk> [<apk> ...]

Dependencies: Python standard library (tested with Python 3.13) and aapt2 from the Android SDK
build-tools (tested with build-tools 36.0.0).
"""

import argparse
import csv
import hashlib
import re
import subprocess
import zipfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARKERS = [
    ("vaha-dev-2026", "Default device token compiled into the app"),
    ("via downloadAsync", "Download code written on 2026-08-07"),
    ("Capture stored but device purge failed", "Delete-request code written on 2026-08-07"),
    ("Checksum verification failed", "MD5 comparison removed on 2026-08-07"),
]


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def manifest(aapt2, apk):
    tree = subprocess.run([aapt2, "dump", "xmltree", "--file", "AndroidManifest.xml", str(apk)],
                          capture_output=True, text=True, check=True).stdout
    version = re.search(r'versionName\(0x0101021c\)="([^"]+)"', tree)
    cleartext = re.search(r"usesCleartextTraffic\(0x010104ec\)=(\w+)", tree)
    return (version.group(1) if version else ""), (cleartext.group(1) if cleartext else "not set")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aapt2", required=True)
    ap.add_argument("apks", nargs="+")
    args = ap.parse_args()

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"release_apk_inspection_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    rows = []
    for apk in map(Path, args.apks):
        digest, size = sha256(apk), apk.stat().st_size
        version, cleartext = manifest(args.aapt2, apk)
        with zipfile.ZipFile(apk) as z:
            bundle = z.read("assets/index.android.bundle")
        base = dict(inspected_at=run_at.isoformat(timespec="seconds"), apk_file=apk.name, sha256=digest,
                    size_bytes=size, version_name=version)
        rows.append({**base, "check": "manifest usesCleartextTraffic", "meaning": "Plain HTTP allowed (Gap 3)",
                     "value": cleartext})
        for marker, meaning in MARKERS:
            rows.append({**base, "check": f"bundle string: {marker}", "meaning": meaning,
                         "value": bundle.count(marker.encode())})

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    for r in rows:
        print(f"{r['apk_file']:42} {r['check']:55} {r['value']}")
    print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
