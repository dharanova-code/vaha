"""
VAHA Edge Server — Authentication Middleware

Phase E: Static development token validation.

All protected routes include `auth: None = Depends(require_auth)` in their
function signature. FastAPI evaluates the dependency before the handler runs.

Future (Milestone 7): Replace with HMAC-SHA256 session token derived from
the BLE-exchanged ECDH shared secret.
"""
from fastapi import HTTPException, Header, Depends
from typing import Optional
from . import config as _cfg  # avoids circular if config imports anything


def _get_config():
    """Lazy import of config to avoid circular dependencies."""
    from server.config import DEV_TOKEN, AUTH_ENABLED
    return DEV_TOKEN, AUTH_ENABLED


async def require_auth(authorization: Optional[str] = Header(default=None)) -> None:
    """
    FastAPI dependency that validates the Authorization header.

    Expected header format: Authorization: Bearer <token>

    Raises:
        HTTPException 401 if token is missing or wrong and AUTH_ENABLED is True.
    """
    dev_token, auth_enabled = _get_config()

    if not auth_enabled:
        return

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Authorization scheme must be 'Bearer'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if token != dev_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
