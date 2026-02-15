# 🎯 Arduino Integration Guide - SmartSense Real-Time Sensor Monitoring

## Overview
This guide explains how to connect your Arduino/ESP32 with DHT22 and gas sensors to the SmartSense web application for real-time monitoring.

## 📋 Prerequisites

### Hardware
- Arduino board (any board with serial capabilities: Arduino Mega, Arduino Uno, ESP32, etc.)
- DHT22 temperature/humidity sensor
- MQ-2 or MQ-135 gas/smoke sensor
- Buzzer/alarm module
- USB cable for Arduino programming

### Software
- Arduino IDE or compatible upload tool
- Python 3.8+
- pip package manager

## 🔧 Step 1: Upload Arduino Sketch

1. **Copy your sketch into Arduino IDE** - Use the code you provided in `SmartSense.ino`
   - Ensure the correct board is selected in Tools → Board
   - Select the correct COM port in Tools → Port
   - Click Upload

2. **Expected Serial Output** (at 115200 baud):
   ```
   SmartSense: System Online - Testing Heavy Pulse Beep...
   Temp: 28.5| Humidity: 65.3C | Smoke: 245
   Temp: 28.6| Humidity: 65.2C | Smoke: 248
   ```

## 🚀 Step 2: Install Dependencies

From the `backend/` directory:

```bash
pip install -r requirements.txt
```

This installs:
- `pyserial` - for USB/serial communication with Arduino
- `requests` - for sending data to backend API
- All other FastAPI dependencies

## 🌐 Step 3: Start the Backend Server

From the `backend/` directory:

```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🔌 Step 4: Connect Arduino and Start Reading Data

**Keep the backend running**, then open a **new terminal** and run:

From the `backend/` directory:

```bash
python arduino_reader.py
```

The script will:
1. Auto-detect your Arduino COM port
2. Connect at 115200 baud (same as Arduino code)
3. Parse incoming sensor data
4. Send to backend API
5. Display real-time readings

Example output:
```
============================================================
🔌 SmartSense Arduino Reader - Real-Time Data Streaming
============================================================

Available serial ports:
  - COM3: CH340 USB UART

✅ Found Arduino on: COM3
✅ Connected to Arduino on COM3 at 115200 baud

✅ Backend is running

📊 Streaming real-time sensor data...
(Press Ctrl+C to stop)

✅ Temp: 28.5°C | Humidity: 65.3% | Gas: 245 PPM
✅ Temp: 28.6°C | Humidity: 65.2% | Gas: 248 PPM
```

## 👁️ Step 5: View Data in Web App

1. Open your browser to `http://localhost:5173` (or wherever your frontend is running)
2. Login with demo credentials:
   - Username: `admin`
   - Password: `admin123`
3. Navigate to Dashboard - you'll see **real-time sensor data** updating every 2 seconds!

## 📊 Data Flow Architecture

```
Arduino (USB)
    ↓
arduino_reader.py (reads serial data)
    ↓
Python regex parser (extracts temp, humidity, gas)
    ↓
POST /data to FastAPI backend
    ↓
Backend broadcasts via WebSocket
    ↓
Frontend receives & displays in Dashboard
```

## 🔒 Arduino Serial Format Reference

Your Arduino code sends data in this exact format:

```
Temp: [TEMP]| Humidity: [HUMIDITY]C | Smoke: [SMOKE_LEVEL]
```

Example:
```
Temp: 32.5| Humidity: 58.7C | Smoke: 310
```

The `arduino_reader.py` script automatically parses this using regex:
```python
pattern = r"Temp:\s*([\d.]+)\|\s*Humidity:\s*([\d.]+)C\s*\|\s*Smoke:\s*(\d+)"
```

## ⚠️ Thresholds & Alert Levels

| Status | Temperature | Gas Level | Behavior |
|--------|------------|-----------|----------|
| 🟢 SAFE | < 35°C | < 300 PPM | Normal operation |
| 🟡 WARNING | 35-45°C | 300-500 PPM | Alert banner displayed |
| 🔴 DANGER | > 45°C | > 500 PPM | Red alert + buzzer trigger |

## 🐛 Troubleshooting

### Arduino not found
```
❌ No serial ports found. Check USB connection.
```
**Solution:** 
- Check USB cable connection
- Install CH340 driver if using Arduino clone boards
- Check Device Manager for unknown devices

### Backend connection error
```
❌ Cannot connect to backend. Is it running?
```
**Solution:**
- Ensure backend is running: `uvicorn main:app --reload`
- Check if port 8000 is already in use
- On Windows: `netstat -ano | findstr :8000`

### Data not updating in frontend
- Check that WebSocket is connected (DevTools → Network → ws)
- Verify Arduino is sending data (check serial monitor at 115200 baud)
- Check backend console for incoming `/data` requests

### Strange characters in serial output
```
⚠️  Serial decode error, skipping line
```
**Solution:**
- Verify Arduino baud rate is 115200
- Check USB cable quality
- Try a different USB port

## 📦 File Structure

```
backend/
├── main.py                  # FastAPI backend with WebSocket
├── arduino_reader.py        # NEW: Serial reader for Arduino
├── simulate_sensors.py      # Old: Use this to fall back to simulation
└── requirements.txt         # Now includes pyserial
```

## 🔄 Switching Between Real & Simulated Data

### Use Real Arduino Data (Recommended)
```bash
# Terminal 1
uvicorn main:app --reload

# Terminal 2
python arduino_reader.py
```

### Fall Back to Simulation (for testing)
```bash
# Terminal 1
uvicorn main:app --reload

# Terminal 2
python simulate_sensors.py
```

## 📱 Remote Deployment

For production with remote Arduino:

1. **Use IoT Platform:** Consider Arduino Cloud, ThingSpeak, or AWS IoT
2. **WiFi Arduino:** Modify Arduino code to send HTTP POST directly
3. **Bridge PC:** Run `arduino_reader.py` on any PC connected to Arduino
4. **Docker:** Already included - see DOCKER.md

## 📝 Example Arduino WiFi Version

For ESP32 with WiFi (future enhancement):

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

void setup() {
  WiFi.begin(SSID, PASSWORD);
  // ... initialize sensors
}

void loop() {
  // ... read sensors
  
  if (WiFi.connected()) {
    HTTPClient http;
    http.begin("http://backend-server:8000/data");
    http.addHeader("Content-Type", "application/json");
    
    String json = "{\"temperature\":" + String(temp) + 
                  ",\"humidity\":" + String(humidity) + 
                  ",\"gas_level\":" + String(gas) + "}";
    
    http.POST(json);
    http.end();
  }
  delay(2000);
}
```

## ✅ Verify Everything Works

1. **Backend running:** Visit `http://localhost:8000/` → Should see JSON
2. **Arduino connected:** Check serial monitor for sensor output
3. **Reader running:** Should show "✅ Temp: X°C | Humidity: Y% | Gas: Z PPM"
4. **Frontend updating:** Dashboard shows real-time data
5. **Alerts working:** When gas > 500 PPM, dashboard shows DANGER alert

## 📞 Support

Common issues in `arduino_reader.py` error messages:
- Check the error message - it provides specific troubleshooting tips
- Monitor the backend console: `uvicorn main:app --reload`
- Check Arduino serial monitor: `Tools → Serial Monitor` (115200 baud)

---

**Happy monitoring! 🎉**
