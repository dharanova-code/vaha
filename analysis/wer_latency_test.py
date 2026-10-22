#!/usr/bin/env python3
"""Measure word error rate and inference latency for both candidate Whisper models.

Audio: 12 known-transcript sentences, synthesized with offline Windows SAPI TTS
(pyttsx3, two voices), representative of short voice notes but NOT real human speech
or real bathroom-noise conditions -- see the whitepaper's Limitations for what this
does and does not establish. Resampled to 16 kHz to match the model's actual input
rate (python/main.py MODEL_RATE).

Decode options match python/main.py's transcribe() exactly: language="en",
vad_filter=False. clean_audio() (DC-offset removal, peak normalize) is applied first,
also matching main.py.

For each of the two candidate models (base.en, small), each of the 12 references is
transcribed once; WER is computed as word-level Levenshtein edit distance over the
reference word count.

Writes data/raw/wer_latency_test_<date>.csv and refuses to overwrite an existing file.

Usage:
  python analysis/wer_latency_test.py
  (defaults to analysis/tts_references; pass --refs to use a different folder)
"""

import argparse
import csv
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
MODEL_RATE = 16000
MODELS = ["base.en", "small"]


def clean_audio(audio):
    """Matches python/main.py clean_audio() exactly."""
    if audio.size < 512:
        return audio
    was_int16 = audio.dtype == np.int16
    f = audio.astype(np.float32)
    f = f - np.mean(f)
    max_val = np.max(np.abs(f))
    if max_val > 0:
        f = f / max_val
    if was_int16:
        return (f * 32767).astype(np.int16)
    return f


def load_resampled(path):
    sr, data = wavfile.read(path)
    if data.ndim > 1:
        data = data[:, 0]
    if sr != MODEL_RATE:
        n_out = int(len(data) * MODEL_RATE / sr)
        data = resample_poly(data, MODEL_RATE, sr).astype(data.dtype)
    return data


def normalize_words(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9' ]", " ", text)
    return [w for w in text.split() if w]


def word_edit_distance(ref, hyp):
    n, m = len(ref), len(hyp)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if ref[i - 1] == hyp[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    return dp[n][m]


def transcribe(model, audio):
    """Matches python/main.py transcribe() post-processing exactly."""
    FILLERS = ["um", "uh", "uhh", "umm", "hmm"]
    audio = clean_audio(audio)
    if audio.dtype == np.int16:
        audio = audio.astype(np.float32) / 32768.0
    segments, _ = model.transcribe(audio, language="en", vad_filter=False)
    raw = " ".join(s.text.strip() for s in segments).strip()
    for fl in FILLERS:
        raw = re.sub(rf"\b{fl}\b[,]?\s*", " ", raw, flags=re.IGNORECASE)
    raw = re.sub(r"\s{2,}", " ", raw).strip(" ,")
    if not raw:
        return ""
    raw = raw[0].upper() + raw[1:]
    if raw[-1] not in ".!?":
        raw += "."
    return raw


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refs", default=None, help="folder with tts_manifest.json and the wav files "
                    "(default: analysis/tts_references, relative to this script)")
    args = ap.parse_args()
    refs_dir = Path(args.refs) if args.refs else (ROOT / "analysis" / "tts_references")
    manifest = json.loads((refs_dir / "tts_manifest.json").read_text(encoding="utf-8"))

    run_at = datetime.now(timezone.utc).astimezone()
    out = ROOT / "data" / "raw" / f"wer_latency_test_{run_at:%Y-%m-%d}.csv"
    if out.exists():
        raise SystemExit(f"{out} exists; raw data is not overwritten")

    audio_cache = {m["file"]: load_resampled(refs_dir / m["file"]) for m in manifest}

    rows = []
    for model_name in MODELS:
        print(f"loading {model_name}...")
        t_load0 = time.perf_counter()
        model = WhisperModel(model_name, device="cpu", compute_type="int8")
        load_s = time.perf_counter() - t_load0
        for m in manifest:
            audio = audio_cache[m["file"]]
            t0 = time.perf_counter()
            hyp = transcribe(model, audio)
            dt = time.perf_counter() - t0
            ref_words = normalize_words(m["text"])
            hyp_words = normalize_words(hyp)
            edits = word_edit_distance(ref_words, hyp_words)
            wer = edits / len(ref_words) if ref_words else None
            rows.append({
                "run_at": run_at.isoformat(timespec="seconds"),
                "model": model_name,
                "model_load_s": round(load_s, 3),
                "ref_index": m["index"],
                "voice": m["voice"],
                "reference_text": m["text"],
                "hypothesis_text": hyp,
                "audio_seconds": round(len(audio) / MODEL_RATE, 3),
                "inference_s": round(dt, 4),
                "ref_word_count": len(ref_words),
                "edit_distance": edits,
                "wer": round(wer, 4) if wer is not None else None,
            })
            print(f"  [{model_name}] ref {m['index']:2d}  wer={wer:.3f}  {dt*1000:6.1f} ms  \"{hyp}\"")
        del model

    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    for model_name in MODELS:
        mrows = [r for r in rows if r["model"] == model_name]
        wers = [r["wer"] for r in mrows if r["wer"] is not None]
        lats = [r["inference_s"] * 1000 for r in mrows]
        print(f"\n{model_name}: mean WER = {sum(wers)/len(wers):.4f}, "
              f"mean latency = {sum(lats)/len(lats):.1f} ms "
              f"(min {min(lats):.1f}, max {max(lats):.1f}), n={len(mrows)}")
    print(f"\nWrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
