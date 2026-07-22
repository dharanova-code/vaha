"""
VAHA Edge Server — Pydantic Response Schemas

All API responses are typed via these models. This provides:
- Automatic JSON serialisation
- OpenAPI/Swagger documentation (via FastAPI)
- Runtime validation

Models mirror the TypeScript interfaces in the mobile app's
src/features/devices/models/DeviceStatus.ts exactly.
"""
from __future__ import annotations

from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


# ─── Primitives ───────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = Field(description="'ok' or 'degraded'")
    timestamp: str = Field(description="ISO 8601 UTC timestamp")
    uptime_seconds: float = Field(description="Seconds since process start")


class VersionResponse(BaseModel):
    api_version: str
    firmware_version: str
    model: str


# ─── Sensor Data ──────────────────────────────────────────────────────────────

class FlowReading(BaseModel):
    rate_liters_per_minute: Optional[float] = None
    accumulated_volume_liters: Optional[float] = None


class SensorReading(BaseModel):
    temperature_celsius: Optional[float] = None
    humidity_percentage: Optional[float] = None
    voc_parts_per_billion: Optional[int] = None
    flow_rate_liters_per_minute: Optional[float] = None
    accumulated_volume_liters: Optional[float] = None
    sampled_at: str = Field(description="ISO 8601 UTC timestamp")


# ─── Storage ──────────────────────────────────────────────────────────────────

class StorageInfo(BaseModel):
    total_bytes: int
    used_bytes: int
    free_bytes: int
    capture_count: int
    capture_storage_bytes: int


# ─── Device Status ────────────────────────────────────────────────────────────

class DeviceStatusResponse(BaseModel):
    device_id: str = Field(description="Unique device identifier, e.g. 'VAHA-88291-A'")
    firmware_version: str
    api_version: str
    capabilities: List[str]
    battery_percentage: Optional[float] = None
    buffered_captures_count: int
    storage_used_bytes: int
    wifi_rssi_dbm: Optional[int] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    uptime_seconds: float
    cpu_percent: Optional[float] = None
    memory_used_bytes: Optional[int] = None
    microphone_active: bool = True
    timestamp: str


class DeviceInfo(BaseModel):
    device_id: str
    model: str
    firmware_version: str
    api_version: str
    mac_address: Optional[str] = None


class CapabilitiesResponse(BaseModel):
    capabilities: List[str]


# ─── Captures ─────────────────────────────────────────────────────────────────

class TelemetryMetrics(BaseModel):
    temperature_celsius: Optional[float] = None
    humidity_percentage: Optional[float] = None
    voc_parts_per_billion: Optional[int] = None
    liquid_flow: Optional[FlowReading] = None


class CaptureMetadata(BaseModel):
    transaction_id: str = Field(description="UUID of the capture")
    captured_timestamp: str = Field(description="ISO 8601 UTC timestamp of when captured")
    audio_encoding: str = Field(description="e.g. WAV, FLAC, PCM")
    sample_rate: int
    channels: int
    audio_size_bytes: int
    audio_md5: str
    transcript: Optional[str] = None
    duration_seconds: Optional[float] = None
    telemetry_metrics: TelemetryMetrics


class DeleteResponse(BaseModel):
    success: bool
    transaction_id: str


# ─── Settings ─────────────────────────────────────────────────────────────────

class SettingsUpdateRequest(BaseModel):
    auto_sync: Optional[bool] = None
    sensor_poll_interval: Optional[float] = None


class SettingsUpdateResponse(BaseModel):
    success: bool


# ─── WebSocket Messages ───────────────────────────────────────────────────────

class WsMessage(BaseModel):
    type: str
    payload: dict
    timestamp: str
