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
| `/login` | POST | User authentication |
| `/signup` | POST | Create new account |
| `/data` | POST | Receive sensor data from ESP32/Arduino |
| `/ws` | WebSocket | Real-time data stream for frontend |
| `/verify-token` | POST | Verify authentication token |

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
- ✅ Verbose logging and debugging options

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

## 📁 File Structure

| File | Purpose |
|------|---------|
| `main.py` | FastAPI backend server with authentication & WebSocket |
| `arduino_reader.py` | 🆕 Reads sensor data from Arduino serial port |
| `SmartSense.ino` | 🆕 Arduino sketch for DHT22 + gas sensor |
| `simulate_sensors.py` | Test mode: generates fake sensor data |
| `requirements.txt` | Python dependencies (now includes pyserial) |
| `ARDUINO.md` | 🆕 Complete Arduino integration guide |
| `START_ARDUINO_READER.bat` | 🆕 Windows quick-start script |
| `start_arduino_reader.sh` | 🆕 Linux/Mac quick-start script |
| `arduino_reader.conf` | 🆕 Configuration file (optional) |

## 🐛 Troubleshooting

### Arduino not found
```
❌ No serial ports found. Check USB connection.
```
**Solution:**
- Check USB cable connection
- Install CH340 driver if using Arduino clones
- On Windows, check Device Manager for unknown devices

### Backend won't start
```
Uvicorn error: Address already in use
```
**Solution:**
```bash
# Check what's using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                # Linux/Mac

# Kill the process or use different port
uvicorn main:app --reload --port 8001
```

### Data not appearing in frontend
1. Check WebSocket connection: DevTools → Network → ws
2. Verify Arduino is sending data (use serial monitor at 115200 baud)
3. Check backend console for `/data` POST requests
4. Verify sensor format matches expected pattern

### Arduino reader crashes with decode error
**Solution:**
- Check USB cable quality (try different port)
- Verify Arduino code compiles and uploads successfully
- Check baud rate is 115200 in Arduino code

## 📊 Architecture

```
Arduino (USB/Serial)
    ↓ (115200 baud)
arduino_reader.py
    ↓ (regex parser)
FastAPI POST /data
    ↓ (broadcast via WebSocket)
Frontend Dashboard (real-time update)
```

## 🔐 Authentication

Demo credentials (for development only):
- **admin** / admin123 (admin role)
- **user** / user123 (operator role)

**⚠️ IMPORTANT:** Change these in production! Modify `USERS` dictionary in `main.py`.

## 🔒 Security Notes

- Default credentials should be changed in production
- CORS is enabled for all origins - restrict in production
- Tokens expire after 24 hours
- Use HTTPS in production (behind proxy like nginx)
- Store real credentials in a proper database
- Use environment variables for sensitive data

## 📝 Environment Variables (Optional)

```bash
# Backend
PYTHONUNBUFFERED=1
DEBUG=False

# Arduino Reader (optional)
ARDUINO_PORT=/dev/ttyUSB0  # Override auto-detection
BACKEND_URL=http://your-server:8000/data
```

## 🧪 Development Tips

Monitor real-time data flow:

```bash
# Terminal 1: Backend with auto-reload and verbose output
uvicorn main:app --reload --log-level debug

# Terminal 2: Arduino reader (already has verbose output)
python arduino_reader.py

# Terminal 3: Monitor incoming requests
curl http://localhost:8000/  # Health check
```

## 📚 Related Documentation

- [Frontend Setup](../README.md) - React/Vite frontend setup
- [Arduino Integration Guide](./ARDUINO.md) - Complete hardware integration
- [Docker Deployment](../DOCKER.md) - Containerized deployment
- [API Documentation](http://localhost:8000/docs) - Swagger UI (when backend is running)

## 🚀 Deployment

### Local Development
- Backend: `uvicorn main:app --reload` 
- Arduino: `python arduino_reader.py`

### Docker
```bash
docker build -f Dockerfile.backend -t smartsense-backend .
docker run -p 8000:8000 smartsense-backend
```

### Production
- Use a production ASGI server (Gunicorn + Uvicorn)
- Setup reverse proxy (nginx/Apache)
- Enable HTTPS/SSL
- Use proper database for users and sessions
- Set up monitoring and logging

---

**Happy Monitoring! 🎉**

For questions about Arduino integration, see [ARDUINO.md](./ARDUINO.md)
