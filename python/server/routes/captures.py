"""
VAHA Edge Server — Captures Routes

Provides:
  GET    /captures                → list all captures
  GET    /captures/{tx_id}        → stream audio WAV
  DELETE /captures/{tx_id}        → delete a capture
  POST   /captures/transcribe     → transcribe an uploaded WAV via on-device Whisper

The /transcribe endpoint has its own lazy-loaded Whisper singleton so it works
correctly under Uvicorn (where __main__ is app.py, not main.py).
"""
from typing import List, Optional
import os
import time
import tempfile
import threading
import numpy as np
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse

from server.models.schemas import CaptureMetadata, DeleteResponse
from server.services.capture_service import capture_service
from server.middleware.auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])

# ─── Lazy Whisper singleton (isolated from main.py) ───────────────────────────
_whisper_lock = threading.Lock()
_whisper_model = None

def _get_whisper():
    """
    Lazy-load faster-whisper small. Thread-safe singleton.
    The model directory is the same one used by main.py.
    """
    global _whisper_model
    if _whisper_model is None:
        with _whisper_lock:
            if _whisper_model is None:
                model_name = os.environ.get("WHISPER_MODEL_NAME", "base.en")
                whisper_dir = os.environ.get(
                    "WHISPER_MODEL_DIR",
                    "/app/models/faster-whisper",
                )
                print(f"[captures] Loading faster-whisper ({model_name}) for transcription endpoint...", flush=True)
                _whisper_model = WhisperModel(
                    model_name,
                    device="cpu",
                    compute_type="int8",
                    download_root=whisper_dir,
                )
                print(f"[captures] faster-whisper ready ({model_name}).", flush=True)
    return _whisper_model


def _transcribe_audio(audio_np: np.ndarray, sample_rate: int = 16000) -> str:
    """Run Whisper on a 16 kHz int16 numpy array. Returns cleaned transcript string."""
    import re
    # Normalise to float32 [-1, 1]
    audio_f32 = audio_np.astype(np.float32) / 32768.0
    model = _get_whisper()
    segments, _ = model.transcribe(audio_f32, language="en", vad_filter=False)
    raw = " ".join(s.text.strip() for s in segments).strip()
    # Strip filler words
    for filler in ["um", "uh", "uhh", "umm", "hmm"]:
        raw = re.sub(rf"\b{filler}\b[,]?\s*", " ", raw, flags=re.IGNORECASE)
    raw = re.sub(r"\s{2,}", " ", raw).strip(" ,")
    if not raw:
        return ""
    raw = raw[0].upper() + raw[1:]
    if raw[-1] not in ".!?":
        raw += "."
    return raw


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("", response_model=List[CaptureMetadata])
async def list_captures():
    return capture_service.list_captures()


@router.get("/{tx_id}")
async def get_capture_audio(tx_id: str):
    audio_path = capture_service.get_audio_path(tx_id)
    if not audio_path or not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Capture audio not found")
    return FileResponse(audio_path, media_type="audio/wav")


@router.delete("/{tx_id}", response_model=DeleteResponse)
async def delete_capture(tx_id: str):
    success = capture_service.delete_capture(tx_id)
    if not success:
        raise HTTPException(status_code=404, detail="Capture not found")
    return DeleteResponse(success=True, transaction_id=tx_id)


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    metadata: Optional[str] = Form(None)
):
    start_time = time.time()

    # Save upload temporarily
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Decode WAV
        import wave
        with wave.open(tmp_path, "rb") as wf:
            sr = wf.getframerate()
            n_channels = wf.getnchannels()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)
            audio_np = np.frombuffer(raw_data, dtype=np.int16)

        # Ensure mono
        if n_channels > 1:
            audio_np = audio_np.reshape(-1, n_channels).mean(axis=1).astype(np.int16)

        duration = len(audio_np) / sr

        # Resample to 16 kHz if needed
        if sr != 16000:
            from scipy.signal import resample_poly
            import math
            gcd = math.gcd(sr, 16000)
            audio_np = resample_poly(
                audio_np.astype(np.float32), 16000 // gcd, sr // gcd
            ).astype(np.int16)

        transcript = _transcribe_audio(audio_np)

        processing_time_ms = int((time.time() - start_time) * 1000)
        return {
            "success": True,
            "transcript": transcript,
            "duration": round(duration, 2),
            "language": "en",
            "processing_time_ms": processing_time_ms,
        }

    except Exception as e:
        print(f"[captures] /transcribe error: {e}", flush=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
