"""
VAHA Edge Server — Configuration

All configuration is read from environment variables (via python-dotenv).
Values here are typed constants with safe defaults for development.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ─── Network ──────────────────────────────────────────────────────────────────

HTTP_HOST: str = os.environ.get("VAHA_HTTP_HOST", "0.0.0.0")
HTTP_PORT: int = int(os.environ.get("VAHA_HTTP_PORT", "8080"))

# ─── Authentication ────────────────────────────────────────────────────────────

# Static development token for Phase E.
# In production (post Milestone 7 BLE pairing), this will be replaced by
# HMAC-SHA256 session tokens derived from the BLE-exchanged shared secret.
DEV_TOKEN: str = os.environ.get("VAHA_DEV_TOKEN", "vaha-dev-2026")

# Set VAHA_AUTH_ENABLED=false to bypass token check during development.
AUTH_ENABLED: bool = os.environ.get("VAHA_AUTH_ENABLED", "true").lower() == "true"

# ─── Storage ──────────────────────────────────────────────────────────────────

CAPTURE_DIR: str = os.environ.get("VAHA_CAPTURE_DIR", "/app/captures")
AUDIO_FORMAT: str = "wav"  # Audio format produced by the recording pipeline

# ─── Versioning ───────────────────────────────────────────────────────────────

FIRMWARE_VERSION: str = os.environ.get("VAHA_FIRMWARE_VERSION", "1.0.0")
API_VERSION: str = "v1"
DEVICE_MODEL: str = "Arduino Uno Q"

# ─── Sensor History ───────────────────────────────────────────────────────────

# Maximum number of sensor readings to keep in the in-memory ring buffer.
SENSOR_HISTORY_SIZE: int = 100

# How often (seconds) the background sensor poller updates.
SENSOR_POLL_INTERVAL: float = 30.0

# ─── WebSocket ────────────────────────────────────────────────────────────────

WS_HEARTBEAT_INTERVAL: float = 10.0  # seconds between heartbeat broadcasts

# ─── CORS ─────────────────────────────────────────────────────────────────────

# Only allow local network origins. Do NOT use ["*"] in production.
CORS_ORIGINS: list[str] = ["*"]
