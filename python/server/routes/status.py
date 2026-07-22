from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from typing import List

from server.models.schemas import DeviceStatusResponse, DeviceInfo, VersionResponse, CapabilitiesResponse
from server.services.system_service import system_service
from server.services.storage_service import storage_service
from server.services.capture_service import capture_service
from server.middleware.auth import require_auth
from server.config import FIRMWARE_VERSION, API_VERSION, DEVICE_MODEL

router = APIRouter()

@router.get("/status", response_model=DeviceStatusResponse, dependencies=[Depends(require_auth)])
async def get_status():
    sys_metrics = system_service.get_system_metrics()
    storage = storage_service.get_storage_info()
    
    # Dummy device ID - usually this is configured or generated
    device_id = "VAHA-UNO-Q-01" 
    
    return DeviceStatusResponse(
        device_id=device_id,
        firmware_version=FIRMWARE_VERSION,
        api_version=API_VERSION,
        capabilities=["sensors", "audio_wav", "ota"],
        battery_percentage=100.0,  # Assuming plugged in for Uno Q
        buffered_captures_count=storage["capture_count"],
        storage_used_bytes=storage["used_bytes"],
        wifi_rssi_dbm=sys_metrics["wifi_rssi_dbm"],
        ip_address=sys_metrics["ip_address"],
        mac_address=sys_metrics["mac_address"],
        uptime_seconds=sys_metrics["uptime_seconds"],
        cpu_percent=sys_metrics["cpu_percent"],
        memory_used_bytes=sys_metrics["memory_used_bytes"],
        microphone_active=True,
        timestamp=datetime.now(timezone.utc).isoformat()
    )


@router.get("/device", response_model=DeviceInfo, dependencies=[Depends(require_auth)])
async def get_device():
    sys_metrics = system_service.get_system_metrics()
    return DeviceInfo(
        device_id="VAHA-UNO-Q-01",
        model=DEVICE_MODEL,
        firmware_version=FIRMWARE_VERSION,
        api_version=API_VERSION,
        mac_address=sys_metrics["mac_address"]
    )


@router.get("/version", response_model=VersionResponse)
async def get_version():
    return VersionResponse(
        api_version=API_VERSION,
        firmware_version=FIRMWARE_VERSION,
        model=DEVICE_MODEL
    )


@router.get("/capabilities", response_model=CapabilitiesResponse)
async def get_capabilities():
    return CapabilitiesResponse(
        capabilities=["sensors", "audio_wav", "ota"]
    )
