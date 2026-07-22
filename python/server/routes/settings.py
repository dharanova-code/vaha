from fastapi import APIRouter, Depends
from server.models.schemas import SettingsUpdateRequest, SettingsUpdateResponse
from server.middleware.auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])

@router.post("", response_model=SettingsUpdateResponse)
async def update_settings(settings: SettingsUpdateRequest):
    # Future: Actually update configuration
    return SettingsUpdateResponse(success=True)
