"""
SmartSense Industrial Safety Monitoring System - Backend
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
from datetime import datetime

app = FastAPI(title="SmartSense Safety Monitor API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    """Manages WebSocket connections for real-time data broadcasting."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        """Send message to all connected clients."""
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"Error sending to client: {e}")


manager = ConnectionManager()


class SensorData(BaseModel):
    """Pydantic model for incoming sensor data from ESP32."""
    temperature: float
    gas_level: int
    humidity: float


def determine_status(temperature: float, gas_level: int) -> str:
    """
    Determine safety status based on sensor thresholds.
    
    Thresholds:
    - DANGER: Temperature > 45°C OR Gas > 500 PPM
    - WARNING: Temperature > 35°C OR Gas > 300 PPM
    - SAFE: All readings within normal range
    """
    if temperature > 45 or gas_level > 500:
        return "DANGER"
    elif temperature > 35 or gas_level > 300:
        return "WARNING"
    return "SAFE"


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "SmartSense Safety Monitor",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/data")
async def receive_sensor_data(data: SensorData):
    """
    Receive sensor data from ESP32 and broadcast to all WebSocket clients.
    
    Expected payload:
    {
        "temperature": 32.5,
        "gas_level": 250,
        "humidity": 65.0
    }
    """
    status = determine_status(data.temperature, data.gas_level)
    
    response = {
        "temperature": data.temperature,
        "gas_level": data.gas_level,
        "humidity": data.humidity,
        "status": status,
        "timestamp": datetime.now().isoformat()
    }
    
    # Broadcast to all connected WebSocket clients
    await manager.broadcast(json.dumps(response))
    
    print(f"📊 Data received - Temp: {data.temperature}°C, Gas: {data.gas_level} PPM, "
          f"Humidity: {data.humidity}% -> Status: {status}")
    
    return response


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data streaming to frontend."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, data is pushed via broadcast
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
