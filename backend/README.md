# SmartSense Backend

Python FastAPI backend for the Industrial Safety Monitoring System.

## 🚀 Quick Start

### Option 1: Real-Time Arduino Data (Recommended)

1. **Upload Arduino Sketch**
   - Open `SmartSense.ino` in Arduino IDE
   - Upload to your board
   - Use USB cable (115200 baud)

2. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start Backend**
   ```bash
   uvicorn main:app --reload
   ```

4. **Start Arduino Reader** (new terminal)
   ```bash
   python arduino_reader.py
   ```

5. **View Data**
   - Open: http://localhost:5173
   - Login with: admin / admin123
   - Dashboard shows real-time sensor data!

**Windows Quick Start:**
```bash
START_ARDUINO_READER.bat
```

**Linux/Mac Quick Start:**
```bash
chmod +x start_arduino_reader.sh
./start_arduino_reader.sh
```

### Option 2: Test with Simulator

Use this for testing without hardware:

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   uvicorn main:app --reload
   ```

3. **Start Simulator** (new terminal)
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

## 📡 Sensor Data Integration

### Arduino/ESP32 via Serial Port (Recommended)

Use `arduino_reader.py` to automatically:
- Detect Arduino COM port
- Parse sensor data from serial
- Send to backend `/data` endpoint
- Stream updates to frontend via WebSocket

**Features:**
- ✅ Auto port detection
- ✅ Real-time data streaming
- ✅ Automatic error handling and reconnection
- ✅ Tested with Arduino Mega, ESP32, and clones

See [ARDUINO.md](./ARDUINO.md) for full integration guide.

### WiFi-Connected ESP32

For ESP32 with WiFi, modify the Arduino sketch to send HTTP POST directly:

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

Then skip `arduino_reader.py` - Arduino sends directly to backend.
