"""
VAHA Edge Server — WebSocket Handler

Handles the `/ws` endpoint for real-time communication.
Broadly responsible for:
- Initial status snapshot on connect
- Heartbeat (PING/PONG)
- Broadcasting live sensors
- Broadcasting capture ready events
"""
import asyncio
from datetime import datetime, timezone
from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import json

from server.services.sensor_service import sensor_service
from server.services.capture_service import register_capture_listener
from server.models.schemas import WsMessage
from server.config import WS_HEARTBEAT_INTERVAL


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: WsMessage):
        data = message.model_dump_json()
        for connection in self.active_connections:
            try:
                await connection.send_text(data)
            except Exception:
                pass


ws_manager = ConnectionManager()


# Register capture listener to broadcast events
def on_capture_ready(meta):
    msg = WsMessage(
        type="capture_ready",
        payload=meta.model_dump(),
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    # create_task to run async broadcast from sync context
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(ws_manager.broadcast(msg))
    except RuntimeError:
        pass


def broadcast_event(event_type: str, payload: dict = None):
    if payload is None:
        payload = {}
    msg = WsMessage(
        type=event_type,
        payload=payload,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(ws_manager.broadcast(msg))
    except RuntimeError:
        pass

register_capture_listener(on_capture_ready)


async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Start a background task for heartbeat and sensor broadcast
        broadcast_task = asyncio.create_task(_broadcast_loop(websocket))
        
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    pong = WsMessage(
                        type="pong",
                        payload={},
                        timestamp=datetime.now(timezone.utc).isoformat()
                    )
                    await websocket.send_text(pong.model_dump_json())
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


async def _broadcast_loop(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(WS_HEARTBEAT_INTERVAL)
            # Broadcast sensors if available
            reading = sensor_service.get_current()
            if reading:
                msg = WsMessage(
                    type="telemetry",
                    payload=reading.model_dump(),
                    timestamp=datetime.now(timezone.utc).isoformat()
                )
                await websocket.send_text(msg.model_dump_json())
    except Exception:
        pass

