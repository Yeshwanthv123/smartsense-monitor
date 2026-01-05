# SmartSense Backend

Python FastAPI backend for the Industrial Safety Monitoring System.

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at: http://localhost:8000

3. **Test with Simulator**
   In a new terminal:
   ```bash
   python simulate_sensors.py
   ```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/data` | POST | Receive sensor data from ESP32 |
| `/ws` | WebSocket | Real-time data stream for frontend |

## Sensor Data Format

```json
{
  "temperature": 32.5,
  "gas_level": 250,
  "humidity": 65.0
}
```

## Safety Thresholds

| Status | Condition |
|--------|-----------|
| 🚨 DANGER | Temperature > 45°C OR Gas > 500 PPM |
| ⚠️ WARNING | Temperature > 35°C OR Gas > 300 PPM |
| ✅ SAFE | All readings within normal range |

## ESP32 Integration

Send POST requests to `/data` endpoint:

```cpp
// ESP32 Example
HTTPClient http;
http.begin("http://YOUR_SERVER_IP:8000/data");
http.addHeader("Content-Type", "application/json");

String payload = "{\"temperature\":" + String(temp) + 
                 ",\"gas_level\":" + String(gas) + 
                 ",\"humidity\":" + String(humidity) + "}";

int httpCode = http.POST(payload);
http.end();
```
