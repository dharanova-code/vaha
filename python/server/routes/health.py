from fastapi import APIRouter
from datetime import datetime, timezone
from server.models.schemas import HealthResponse
from server.services.system_service import system_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc).isoformat(),
        uptime_seconds=system_service.get_system_metrics()["uptime_seconds"]
    )
