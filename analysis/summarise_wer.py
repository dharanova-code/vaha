#!/usr/bin/env python3
"""Summarise the WER/latency test for the whitepaper (Table 5.1).

Reads, does not change: data/raw/wer_latency_test_2026-10-22.csv

One row per model (base.en, small): n, mean, standard deviation (sample), min,
median, max for word error rate and inference latency.

Writes data/processed/wer_latency_summary.csv.

Usage:
  python3 analysis/summarise_wer.py
"""

import csv
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "wer_latency_test_2026-10-22.csv"
OUT = ROOT / "data" / "processed" / "wer_latency_summary.csv"


def describe(model, metric, unit, values):
    return {"model": model, "metric": metric, "unit": unit, "n": len(values),
            "mean": round(statistics.mean(values), 4), "sd": round(statistics.stdev(values), 4),
            "min": round(min(values), 4), "median": round(statistics.median(values), 4),
            "max": round(max(values), 4)}


def main():
    with open(RAW, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    out_rows = []
    for model in sorted({r["model"] for r in rows}):
        mrows = [r for r in rows if r["model"] == model]
        wers = [float(r["wer"]) for r in mrows]
        lat_ms = [float(r["inference_s"]) * 1000 for r in mrows]
        out_rows.append(describe(model, "word_error_rate", "fraction", wers))
        out_rows.append(describe(model, "inference_latency", "ms", lat_ms))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out_rows[0]))
        w.writeheader()
        w.writerows(out_rows)
    for r in out_rows:
        print(r)
    print(f"Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
