from fastapi import APIRouter, Depends
from server.models.schemas import StorageInfo
from server.services.storage_service import storage_service
from server.middleware.auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])

@router.get("", response_model=StorageInfo)
async def get_storage():
    return StorageInfo(**storage_service.get_storage_info())
