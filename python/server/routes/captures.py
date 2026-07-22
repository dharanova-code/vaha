from typing import List, Optional
import os
import time
import tempfile
import sys
import numpy as np
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form

from server.models.schemas import CaptureMetadata, DeleteResponse
from server.services.capture_service import capture_service
from server.middleware.auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])

@router.get("", response_model=List[CaptureMetadata])
async def list_captures():
    return capture_service.list_captures()


@router.get("/{tx_id}")
async def get_capture_audio(tx_id: str):
    audio_path = capture_service.get_audio_path(tx_id)
    if not audio_path or not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Capture audio not found")
    # FileResponse supports HTTP Range headers out of the box
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
    
    # Save audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Load audio using built-in wave module
        import wave
        with wave.open(tmp_path, 'rb') as wf:
            sr = wf.getframerate()
            n_channels = wf.getnchannels()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)
            audio_np = np.frombuffer(raw_data, dtype=np.int16)
            
        # Ensure it's mono
        if n_channels > 1:
            audio_np = audio_np.reshape(-1, n_channels).mean(axis=1).astype(np.int16)
            
        duration = len(audio_np) / sr
            
        # Resample to 16k if needed
        if sr != 16000:
            from scipy.signal import resample_poly
            import math
            gcd = math.gcd(sr, 16000)
            audio_16k = resample_poly(audio_np.astype(np.float32), 16000 // gcd, sr // gcd).astype(np.int16)
        else:
            audio_16k = audio_np

        import __main__
        if hasattr(__main__, 'transcribe'):
            transcript = __main__.transcribe(audio_16k)
        else:
            # Fallback if __main__ doesn't have it (e.g. tests)
            transcript = "Transcription unavailable."

        end_time = time.time()
        processing_time_ms = int((end_time - start_time) * 1000)

        return {
            "success": True,
            "transcript": transcript,
            "duration": round(duration, 2),
            "language": "en",
            "processing_time_ms": processing_time_ms
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
