import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routes import health, status, sensors, captures, storage, settings
from server.websocket.ws_handler import websocket_endpoint
from server.config import HTTP_HOST, HTTP_PORT, CORS_ORIGINS

def create_app() -> FastAPI:
    app = FastAPI(title="VAHA Edge Server API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api/v1")
    app.include_router(status.router, prefix="/api/v1")
    app.include_router(sensors.router, prefix="/api/v1/sensors")
    app.include_router(captures.router, prefix="/api/v1/captures")
    app.include_router(storage.router, prefix="/api/v1/storage")
    app.include_router(settings.router, prefix="/api/v1/settings")

    app.add_api_websocket_route("/api/v1/ws", websocket_endpoint)

    return app

def run_server():
    app = create_app()
    uvicorn.run(app, host=HTTP_HOST, port=HTTP_PORT, log_level="info")
