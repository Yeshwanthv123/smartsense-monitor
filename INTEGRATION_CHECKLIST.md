# 🎯 Arduino Integration Checklist

Use this checklist to verify your Arduino integration is set up correctly.

## ✅ Hardware Setup

- [ ] Arduino board connected to USB
- [ ] DHT22 sensor connected to GPIO 26
- [ ] Gas/Smoke sensor connected to GPIO 34 (analog)
- [ ] Buzzer connected to GPIO 32
- [ ] All connections verified and secure
- [ ] No loose wires or cold solder joints

## ✅ Arduino Software

- [ ] DHT library installed in Arduino IDE (Sketch → Include Library)
- [ ] `SmartSense.ino` sketch opened in Arduino IDE
- [ ] Board type selected correctly (Tools → Board)
- [ ] COM port selected correctly (Tools → Port)
- [ ] Sketch uploaded successfully (Sketch → Upload)
- [ ] Serial monitor shows: "Temp: X.X| Humidity: Y.YC | Smoke: Z"
- [ ] Serial monitor set to 115200 baud
- [ ] Data updates every ~2 seconds

## ✅ Python Environment

- [ ] Python 3.8+ installed
- [ ] Navigated to `backend/` directory in terminal
- [ ] Ran `pip install -r requirements.txt` successfully
- [ ] `pyserial` package installed

## ✅ Backend Setup

- [ ] `main.py` exists in backend directory
- [ ] No syntax errors in `main.py`
- [ ] Backend starts: `uvicorn main:app --reload`
- [ ] Backend running at `http://localhost:8000`
- [ ] Health check returns JSON: `http://localhost:8000/`

## ✅ Arduino Reader Setup

- [ ] `arduino_reader.py` exists in backend directory
- [ ] Arduino reader starts: `python arduino_reader.py`
- [ ] Reader auto-detects Arduino COM port
- [ ] Reader shows: "✅ Found Arduino on: COMx"
- [ ] Reader shows: "✅ Connected to Arduino on COMx at 115200 baud"
- [ ] Reader shows: "✅ Backend is running"
- [ ] Data flowing: "✅ Temp: X.X°C | Humidity: Y.Y% | Gas: Z PPM"

## ✅ Frontend Setup

- [ ] Frontend installed and dependencies ready
- [ ] Frontend running: `npm run dev`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Can log in with demo credentials (admin/admin123)
- [ ] Dashboard shows real-time sensor data
- [ ] Data updates every ~2 seconds
- [ ] Sensor cards display Temperature, Humidity, Gas Level
- [ ] No WebSocket errors in browser console

## ✅ Data Validation

- [ ] Temperature readings between 0-50°C (reasonable)
- [ ] Humidity readings between 0-100%
- [ ] Gas levels between 0-1000 PPM (realistic)
- [ ] Timestamps are current
- [ ] Status shows SAFE/WARNING/DANGER correctly

## ✅ Alert Testing

- [ ] When gas > 300: Dashboard shows WARNING (yellow)
- [ ] When gas > 500: Dashboard shows DANGER (red)
- [ ] Buzzer pulses when smoke > 200 (Arduino action)
- [ ] Alert banner appears on frontend for DANGER

## ✅ Error Handling

- [ ] Unplug Arduino → reader reconnects automatically
- [ ] Stop backend → reader shows connection error
- [ ] Restart backend → reader reconnects automatically
- [ ] No crashes in console output

## 🐛 Troubleshooting Checklist

### If Arduino not detected:
- [ ] Check USB cable connection
- [ ] USB device appears in Device Manager
- [ ] Try different USB port
- [ ] Install CH340 driver if board not recognized
- [ ] Run `python -m serial.tools.list_ports` to see all ports

### If backend fails to start:
- [ ] Port 8000 not in use: `netstat -ano | findstr :8000`
- [ ] Try different port: `uvicorn main:app --reload --port 8001`
- [ ] Check Python dependencies: `pip list | grep -E "fastapi|uvicorn"`

### If no data in frontend:
- [ ] Browser console shows no WebSocket errors
- [ ] Backend console shows `/data` POST requests
- [ ] Arduino serial monitor shows data output
- [ ] All three services running (backend, reader, frontend)

### If data looks wrong:
- [ ] Verify sensor values in SQL Serial Monitor first
- [ ] Check data format matches regex pattern
- [ ] Verify baud rate is 115200 everywhere
- [ ] Check for multiple Arduino reader instances running

## 📊 Expected Data Flow

```
Arduino Serial Output:
Temp: 28.5| Humidity: 60.2C | Smoke: 245

↓ (parsed by arduino_reader.py)

Python Dictionary:
{
  "temperature": 28.5,
  "humidity": 60.2,
  "gas_level": 245
}

↓ (sent to backend /data endpoint)

Backend JSON:
{
  "temperature": 28.5,
  "gas_level": 245,
  "humidity": 60.2,
  "status": "SAFE",
  "timestamp": "2024-02-15T10:30:45.123456"
}

↓ (broadcast via WebSocket)

Frontend Display:
Temperature: 28.5°C
Humidity: 60.2%
Gas Level: 245 PPM
Status: SAFE ✅
```

## 🚀 Quick Reference Commands

```bash
# From backend/ directory

# Setup
SETUP.bat                            # Windows: Install dependencies

# Run everything
START_ARDUINO_READER.bat             # Windows: Start backend + reader
./start_arduino_reader.sh            # Linux/Mac: Start backend + reader

# Manual startup
uvicorn main:app --reload            # Terminal 1: Backend
python arduino_reader.py             # Terminal 2: Arduino reader

# Test backend
curl http://localhost:8000/          # Health check
curl http://localhost:8000/docs      # API documentation

# Test Arduino connection
python -m serial.tools.list_ports    # List available COM ports
```

## 📞 Support

- **Arduino Issues:** See [ARDUINO.md](./ARDUINO.md)
- **Backend Issues:** Check backend console for error messages
- **Frontend Issues:** Check browser DevTools console
- **Data Issues:** Verify Arduino serial monitor output first

---

**When everything is checked, you're ready to monitor! 🎉**

If any checks fail, refer to troubleshooting sections in [ARDUINO.md](./ARDUINO.md)
