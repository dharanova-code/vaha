"""
VAHA Edge Server — Capture Service

Manages the filesystem-based capture store at VAHA_CAPTURE_DIR.

Each capture consists of two files:
  <CAPTURE_DIR>/<uuid>.json  — metadata (CaptureRecord)
  <CAPTURE_DIR>/<uuid>.wav   — raw audio (WAV format)

This service is the single source of truth for capture persistence on the device.
The main.py vaha_loop() calls save_capture() after each successful transcription.
"""
from __future__ import annotations

import json
import os
import uuid
import hashlib
import wave
import threading
from datetime import datetime, timezone
from typing import Optional, List, Callable
from server.config import CAPTURE_DIR, AUDIO_FORMAT
from server.models.schemas import CaptureMetadata, TelemetryMetrics, FlowReading


# Callbacks registered by ws_handler to broadcast capture_ready events.
_capture_listeners: list[Callable[[CaptureMetadata], None]] = []
_listener_lock = threading.Lock()


def register_capture_listener(callback: Callable[[CaptureMetadata], None]) -> None:
    """Register a callback to be called whenever a new capture is saved."""
    with _listener_lock:
        _capture_listeners.append(callback)


def _notify_capture_listeners(meta: CaptureMetadata) -> None:
    with _listener_lock:
        listeners = list(_capture_listeners)
    for cb in listeners:
        try:
            cb(meta)
        except Exception as exc:
            print(f"[capture_service] Listener error: {exc}", flush=True)


class CaptureService:
    """Filesystem-backed capture store."""

    def __init__(self, capture_dir: str = CAPTURE_DIR) -> None:
        self._dir = capture_dir
        os.makedirs(self._dir, exist_ok=True)

    # ── public API ───────────────────────────────────────────────────────────

    def list_captures(self) -> List[CaptureMetadata]:
        """Return all captures ordered by timestamp descending."""
        captures: list[CaptureMetadata] = []
        for root, dirs, files in os.walk(self._dir):
            for file in files:
                if file == "metadata.json":
                    meta = self._load_meta(os.path.join(root, file))
                    if meta:
                        captures.append(meta)
        captures.sort(key=lambda c: c.captured_timestamp, reverse=True)
        return captures

    def _get_capture_dir(self, transaction_id: str) -> Optional[str]:
        # Since we don't know the date from just the ID, we have to search
        # or we could encode the date in the ID. For now, search.
        # This is a bit inefficient but works for edge storage.
        for root, dirs, files in os.walk(self._dir):
            if transaction_id in dirs:
                return os.path.join(root, transaction_id)
        return None

    def get_capture(self, transaction_id: str) -> Optional[CaptureMetadata]:
        """Return metadata for a single capture by transaction_id."""
        cap_dir = self._get_capture_dir(transaction_id)
        if not cap_dir:
            return None
        return self._load_meta(os.path.join(cap_dir, "metadata.json"))

    def get_audio_path(self, transaction_id: str) -> Optional[str]:
        """Return the filesystem path to the audio file, or None if not found."""
        cap_dir = self._get_capture_dir(transaction_id)
        if not cap_dir:
            return None
        audio_path = os.path.join(cap_dir, f"audio.{AUDIO_FORMAT}")
        return audio_path if os.path.exists(audio_path) else None

    def delete_capture(self, transaction_id: str) -> bool:
        """
        Delete the entire capture directory.
        Returns True if deleted, False if not found.
        """
        cap_dir = self._get_capture_dir(transaction_id)
        if not cap_dir:
            return False
            
        import shutil
        try:
            shutil.rmtree(cap_dir)
            return True
        except Exception:
            return False

    def save_capture(
        self,
        audio_data: bytes,
        transcript: str,
        sensors: Optional[dict],
        sample_rate: int = 48000,
        channels: int = 1,
    ) -> CaptureMetadata:
        """
        Persist a completed capture to disk and return its metadata.
        """
        tx_id = str(uuid.uuid4())
        dt_now = datetime.now(timezone.utc)
        now = dt_now.isoformat()
        
        # Build path: CAPTURE_DIR/YYYY/MM/DD/tx_id
        year = dt_now.strftime("%Y")
        month = dt_now.strftime("%m")
        day = dt_now.strftime("%d")
        
        cap_dir = os.path.join(self._dir, year, month, day, tx_id)
        
        if os.path.exists(cap_dir):
            # Never overwrite (though UUID collision is statistically impossible)
            raise FileExistsError("Capture directory already exists")
            
        os.makedirs(cap_dir, exist_ok=True)

        # Write WAV file
        audio_path = os.path.join(cap_dir, f"audio.{AUDIO_FORMAT}")
        self._write_wav(audio_path, audio_data, sample_rate, channels)

        audio_size = os.path.getsize(audio_path)
        audio_md5 = self._md5_file(audio_path)
        duration = len(audio_data) / (sample_rate * channels * 2)

        # Build telemetry
        telemetry = self._build_telemetry(sensors)

        meta = CaptureMetadata(
            transaction_id=tx_id,
            captured_timestamp=now,
            audio_encoding=AUDIO_FORMAT.upper(),
            sample_rate=sample_rate,
            channels=channels,
            audio_size_bytes=audio_size,
            audio_md5=audio_md5,
            transcript=transcript,
            duration_seconds=round(duration, 2),
            telemetry_metrics=telemetry,
        )

        # Write metadata.json
        meta_path = os.path.join(cap_dir, "metadata.json")
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta.model_dump(), f, indent=2, default=str)
            
        # Write checksum.md5
        md5_path = os.path.join(cap_dir, "checksum.md5")
        with open(md5_path, 'w', encoding='utf-8') as f:
            f.write(audio_md5)
            
        # Write transcript.json (redundant but requested)
        transcript_path = os.path.join(cap_dir, "transcript.json")
        with open(transcript_path, 'w', encoding='utf-8') as f:
            json.dump({"transcript": transcript}, f, indent=2)

        print(f"[capture_service] Saved capture {tx_id} ({audio_size} bytes)", flush=True)
        _notify_capture_listeners(meta)
        return meta

    def count(self) -> int:
        """Return the number of captures currently stored."""
        count = 0
        for root, dirs, files in os.walk(self._dir):
            if "metadata.json" in files:
                count += 1
        return count

    def total_bytes(self) -> int:
        """Return the total bytes used by all capture files."""
        total = 0
        for root, dirs, files in os.walk(self._dir):
            for file in files:
                total += os.path.getsize(os.path.join(root, file))
        return total

    # ── private helpers ──────────────────────────────────────────────────────

    def _load_meta(self, path: str) -> Optional[CaptureMetadata]:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return CaptureMetadata(**data)
        except Exception as exc:
            print(f"[capture_service] Failed to load {path}: {exc}", flush=True)
            return None

    @staticmethod
    def _write_wav(path: str, pcm_data: bytes, rate: int, channels: int) -> None:
        import wave
        with wave.open(path, 'wb') as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(2)  # int16 = 2 bytes
            wf.setframerate(rate)
            wf.writeframes(pcm_data)

    @staticmethod
    def _md5_file(path: str) -> str:
        h = hashlib.md5()
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(65536), b''):
                h.update(chunk)
        return h.hexdigest()

    @staticmethod
    def _build_telemetry(sensors: Optional[dict]) -> TelemetryMetrics:
        if not sensors:
            return TelemetryMetrics()
        flow = None
        if sensors.get('flow_lpm') is not None:
            flow = FlowReading(
                rate_liters_per_minute=sensors.get('flow_lpm'),
                accumulated_volume_liters=sensors.get('total_liters'),
            )
        return TelemetryMetrics(
            temperature_celsius=sensors.get('temp'),
            humidity_percentage=sensors.get('humidity'),
            voc_parts_per_billion=sensors.get('tvoc_ppb'),
            liquid_flow=flow,
        )


# Module-level singleton — imported by routes, ws_handler, and main.py.
capture_service = CaptureService()
