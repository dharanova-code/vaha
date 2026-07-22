from fastapi import APIRouter, Depends, HTTPException
from typing import List

from server.models.schemas import SensorReading
from server.services.sensor_service import sensor_service
from server.middleware.auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])

@router.get("/current", response_model=SensorReading)
async def get_current_sensors():
    reading = sensor_service.get_current()
    if not reading:
        raise HTTPException(status_code=503, detail="Sensor data not available")
    return reading


@router.get("/history", response_model=List[SensorReading])
async def get_sensor_history():
    return sensor_service.get_history()
