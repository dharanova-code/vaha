"""
VAHA Edge Server — Storage Service

Provides disk usage and capture storage statistics.
"""
import shutil
import os
from server.config import CAPTURE_DIR
from server.services.capture_service import capture_service


class StorageService:
    @staticmethod
    def get_storage_info() -> dict:
        total, used, free = shutil.disk_usage("/")
        capture_count = capture_service.count()
        capture_bytes = capture_service.total_bytes()
        return {
            "total_bytes": total,
            "used_bytes": used,
            "free_bytes": free,
            "capture_count": capture_count,
            "capture_storage_bytes": capture_bytes,
        }

storage_service = StorageService()
