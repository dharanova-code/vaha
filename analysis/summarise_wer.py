#!/usr/bin/env python3
"""Summarise the word-error-rate and latency test for the whitepaper (Tables 5.1 and 5.2).

Reads, does not change:
  data/raw/wer_latency_test_2026-10-22.csv

Word error rate is pooled over the test set: total word edits divided by total reference
words. The raw `wer` column is per sentence; its mean weights short sentences more and is
not used here.

The 95 % interval on each word error rate is the Wilson score interval for a binomial
proportion (z = 1.96), treating each reference word as an independent trial. Words in one
sentence are not independent, so the true interval is wider; the interval is a lower bound
on the uncertainty, used only to show whether the two models can be told apart.

Real-time factor is transcription time divided by audio length (below 1 means faster than
the speech itself).

With n = 12 sentences and one run, p95 and p99 cannot be estimated meaningfully, so the
summary gives n, mean, standard deviation (sample), min, median and max.

Writes data/processed/wer_latency_summary.csv and prints every sentence with at least one
word edit, with its reference and transcript, so the paper can show each error.

Usage:
  python3 analysis/summarise_wer.py

Dependencies: Python standard library (tested with Python 3.13).
"""

import csv
import math
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "wer_latency_test_2026-10-22.csv"
OUT = ROOT / "data" / "processed" / "wer_latency_summary.csv"


def wilson(k, n, z=1.96):
    """Wilson score interval for k successes in n trials, as percentages."""
    p = k / n
    d = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / d
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return round(100 * (centre - half), 1), round(100 * (centre + half), 1)


def main():
    with open(RAW, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    summary = []
    for model in dict.fromkeys(r["model"] for r in rows):
        mrows = [r for r in rows if r["model"] == model]
        words = sum(int(r["ref_word_count"]) for r in mrows)
        edits = sum(int(r["edit_distance"]) for r in mrows)
        lat = [float(r["inference_s"]) for r in mrows]
        rtf = [float(r["inference_s"]) / float(r["audio_seconds"]) for r in mrows]
        summary.append({
            "model": model, "n_sentences": len(mrows), "ref_words": words, "word_edits": edits,
            "wer_pct": round(100 * edits / words, 1),
            "wer_ci95_low_pct": wilson(edits, words)[0], "wer_ci95_high_pct": wilson(edits, words)[1],
            "sentences_with_edits": sum(1 for r in mrows if int(r["edit_distance"]) > 0),
            "latency_mean_s": round(statistics.mean(lat), 2), "latency_sd_s": round(statistics.stdev(lat), 2),
            "latency_min_s": round(min(lat), 2), "latency_median_s": round(statistics.median(lat), 2),
            "latency_max_s": round(max(lat), 2), "rtf_mean": round(statistics.mean(rtf), 2),
            "rtf_min": round(min(rtf), 2), "rtf_max": round(max(rtf), 2),
            "audio_s_min": round(min(float(r["audio_seconds"]) for r in mrows), 2),
            "audio_s_max": round(max(float(r["audio_seconds"]) for r in mrows), 2),
            "model_load_s": round(float(mrows[0]["model_load_s"]), 1),
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(summary[0]))
        w.writeheader()
        w.writerows(summary)
    for s in summary:
        print(s)

    ratio = summary[1]["latency_mean_s"] / summary[0]["latency_mean_s"]
    print(f"mean latency ratio {summary[1]['model']} / {summary[0]['model']}: {ratio:.1f}")
    total_words = sum(int(r["ref_word_count"]) for r in rows) // len(summary)
    print(f"reference words per model: {total_words}; run at {rows[0]['run_at']}")
    print("Sentences with word edits:")
    for r in rows:
        if int(r["edit_distance"]) > 0:
            print(f"  {r['model']:8} #{r['ref_index']:>2} edits={r['edit_distance']}  "
                  f"ref: {r['reference_text']!r}  hyp: {r['hypothesis_text']!r}")
    print(f"Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
