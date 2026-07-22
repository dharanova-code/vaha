"""
VAHA Edge Server — Sensor Service

Reads sensor data from the Arduino bridge and maintains an in-memory
ring buffer for history queries.

The underlying sensor reading calls the same Bridge.call('sensors_get')
used in main.py. This service wraps that function with:
  - Thread-safe caching (latest reading)
  - Ring buffer for history (SENSOR_HISTORY_SIZE readings)
  - Background polling thread

Usage:
    sensor_service = SensorService()
    sensor_service.start()
    reading = sensor_service.get_current()
    history = sensor_service.get_history()
"""
from __future__ import annotations

import threading
import time
from collections import deque
from datetime import datetime, timezone
from typing import Optional, Deque
from server.config import SENSOR_HISTORY_SIZE, SENSOR_POLL_INTERVAL
from server.models.schemas import SensorReading


def _read_bridge_sensors() -> Optional[dict]:
    """
    Call the Arduino bridge to get a raw sensor reading.
    Returns a dict or None on failure.

    Falls back gracefully if the bridge is not available (e.g. during testing).
    """
    try:
        from arduino.app_utils import Bridge
        raw = Bridge.call('sensors_get')
        tokens = raw.split(':')
        data: dict = {}
        for i in range(0, len(tokens) - 1, 2):
            data[tokens[i]] = tokens[i + 1]
        return {
            'temp':         float(data['T']) if data.get('T', 'nan') != 'nan' else None,
            'humidity':     float(data['H']) if data.get('H', 'nan') != 'nan' else None,
            'flow_lpm':     float(data.get('F', 0)),
            'total_liters': float(data.get('L', 0)),
            'tvoc_ppb':     int(data.get('V', 0)),
        }
    except Exception as exc:
        print(f"[sensor_service] Bridge read failed: {exc}", flush=True)
        return None


class SensorService:
    """
    Thread-safe sensor reading service with in-memory history ring buffer.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._current: Optional[SensorReading] = None
        self._history: Deque[SensorReading] = deque(maxlen=SENSOR_HISTORY_SIZE)
        self._thread: Optional[threading.Thread] = None
        self._running = False

    def start(self) -> None:
        """Start the background polling thread."""
        if self._running:
            return
        self._running = True
        # Perform an initial read synchronously so the first API call has data.
        self._poll_once()
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()
        print(f"[sensor_service] Started (poll interval={SENSOR_POLL_INTERVAL}s)", flush=True)

    def stop(self) -> None:
        """Signal the polling thread to stop."""
        self._running = False

    def get_current(self) -> Optional[SensorReading]:
        """Return the most recent sensor reading (thread-safe)."""
        with self._lock:
            return self._current

    def get_history(self) -> list[SensorReading]:
        """Return all historical readings, oldest first (thread-safe)."""
        with self._lock:
            return list(self._history)

    # ── private ──────────────────────────────────────────────────────────────

    def _poll_loop(self) -> None:
        while self._running:
            time.sleep(SENSOR_POLL_INTERVAL)
            if self._running:
                self._poll_once()

    def _poll_once(self) -> None:
        raw = _read_bridge_sensors()
        if raw is None:
            return
        now = datetime.now(timezone.utc).isoformat()
        reading = SensorReading(
            temperature_celsius=raw.get('temp'),
            humidity_percentage=raw.get('humidity'),
            voc_parts_per_billion=raw.get('tvoc_ppb'),
            flow_rate_liters_per_minute=raw.get('flow_lpm'),
            accumulated_volume_liters=raw.get('total_liters'),
            sampled_at=now,
        )
        with self._lock:
            self._current = reading
            self._history.append(reading)


# Module-level singleton — imported by routes and ws_handler.
sensor_service = SensorService()
