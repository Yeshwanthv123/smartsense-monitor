"""
SmartSense Industrial Safety Monitoring System - Backend
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta
import hashlib
import secrets
from functools import lru_cache

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


class LoginRequest(BaseModel):
    """Pydantic model for login requests."""
    username: str
    password: str


class SignupRequest(BaseModel):
    """Pydantic model for signup requests."""
    email: str
    username: str
    password: str


class LoginResponse(BaseModel):
    """Pydantic model for login response."""
    success: bool
    token: Optional[str] = None
    message: str
    user: Optional[dict] = None


class SignupResponse(BaseModel):
    """Pydantic model for signup response."""
    success: bool
    message: str
    user: Optional[dict] = None


# In-memory user database (demo only - use real DB in production)
USERS = {
    "admin": {
        "email": "admin@smartsense.io",
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
        "name": "Admin User",
        "role": "admin"
    },
    "user": {
        "email": "user@smartsense.io",
        "password_hash": hashlib.sha256("user123".encode()).hexdigest(),
        "name": "Demo User",
        "role": "operator"
    }
}

# Track emails to prevent duplicates
EMAIL_TO_USERNAME = {
    "admin@smartsense.io": "admin",
    "user@smartsense.io": "user"
}

# Simple in-memory token storage (use Redis/DB in production)
TOKENS = {}


def determine_status(temperature: float, gas_level: int) -> str:
    """
    Determine safety status based on sensor thresholds.
    
    Thresholds:
    - DANGER: Temperature > 45°C OR Gas > 1000 PPM
    - WARNING: Temperature > 35°C OR Gas > 300 PPM
    - SAFE: All readings within normal range
    """
    if temperature > 45 or gas_level > 1000:
        return "DANGER"
    elif temperature > 35 or gas_level > 300:
        return "WARNING"
    return "SAFE"


def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)


def hash_password(password: str) -> str:
    """Hash a password using SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()


@app.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint for user authentication.
    
    Demo credentials:
    - Username: admin, Password: admin123 (admin role)
    - Username: user, Password: user123 (operator role)
    """
    username = credentials.username.lower()
    
    # Check if user exists
    if username not in USERS:
        return LoginResponse(
            success=False,
            message="Invalid username or password"
        )
    
    # Verify password
    user = USERS[username]
    password_hash = hash_password(credentials.password)
    
    if user["password_hash"] != password_hash:
        return LoginResponse(
            success=False,
            message="Invalid username or password"
        )
    
    # Generate token
    token = generate_token()
    TOKENS[token] = {
        "username": username,
        "name": user["name"],
        "role": user["role"],
        "created_at": datetime.now(),
        "expires_at": datetime.now() + timedelta(hours=24)
    }
    
    return LoginResponse(
        success=True,
        token=token,
        message="Login successful",
        user={
            "username": username,
            "name": user["name"],
            "role": user["role"]
        }
    )


@app.post("/signup", response_model=SignupResponse)
async def signup(data: SignupRequest):
    """
    Signup endpoint for new user registration.
    
    Requires:
    - email: Valid email address
    - username: Unique username
    - password: Password (minimum 6 characters)
    """
    email = data.email.lower()
    username = data.username.lower()
    password = data.password
    
    # Validate email format
    if "@" not in email or "." not in email:
        return SignupResponse(
            success=False,
            message="Invalid email format"
        )
    
    # Validate username
    if not username or len(username) < 3:
        return SignupResponse(
            success=False,
            message="Username must be at least 3 characters"
        )
    
    # Validate password
    if not password or len(password) < 6:
        return SignupResponse(
            success=False,
            message="Password must be at least 6 characters"
        )
    
    # Check if username already exists
    if username in USERS:
        return SignupResponse(
            success=False,
            message="Username already exists"
        )
    
    # Check if email already exists
    if email in EMAIL_TO_USERNAME:
        return SignupResponse(
            success=False,
            message="Email already registered"
        )
    
    # Create new user
    password_hash = hash_password(password)
    user_name = username.capitalize()  # Use capitalized username as display name
    
    USERS[username] = {
        "email": email,
        "password_hash": password_hash,
        "name": user_name,
        "role": "operator"  # New users get operator role
    }
    
    EMAIL_TO_USERNAME[email] = username
    
    return SignupResponse(
        success=True,
        message="Account created successfully. Please log in.",
        user={
            "username": username,
            "email": email,
            "name": user_name,
            "role": "operator"
        }
    )


@app.post("/logout")
async def logout(token: str):
    """Logout endpoint to invalidate token."""
    if token in TOKENS:
        del TOKENS[token]
        return {"success": True, "message": "Logout successful"}
    return {"success": False, "message": "Invalid token"}


@app.post("/verify-token")
async def verify_token(token: str):
    """Verify if a token is valid."""
    if token not in TOKENS:
        return {"valid": False, "message": "Invalid or expired token"}
    
    token_data = TOKENS[token]
    
    # Check if token is expired
    if datetime.now() > token_data["expires_at"]:
        del TOKENS[token]
        return {"valid": False, "message": "Token expired"}
    
    return {
        "valid": True,
        "user": {
            "username": token_data["username"],
            "name": token_data["name"],
            "role": token_data["role"]
        }
    }


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
