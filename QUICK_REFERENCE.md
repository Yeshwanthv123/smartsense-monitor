# 🚀 Quick Reference Card

Print this page or keep it handy while setting up Arduino integration!

## 📌 Essential Info

| Item | Value |
|------|-------|
| **Arduino Baud Rate** | 115200 (must match!) |
| **Backend URL** | http://localhost:8000 |
| **Frontend URL** | http://localhost:5173 |
| **Demo Username** | admin |
| **Demo Password** | admin123 |
| **Temperature Pin** | GPIO 26 (DHT22) |
| **Gas Sensor Pin** | GPIO 34 (MQ-2/MQ-135) |
| **Buzzer Pin** | GPIO 32 (active low) |

## ⚠️ Thresholds

| Status | Temperature | Gas Level |
|--------|------------|-----------|
| 🟢 SAFE | < 35°C | < 300 PPM |
| 🟡 WARNING | 35-45°C | 300-500 PPM |
| 🔴 DANGER | > 45°C | > 500 PPM |

## 💻 Command Cheat Sheet

### Windows
```bash
# Setup (first time only)
cd backend
SETUP.bat

# Quick start (all-in-one)
START_ARDUINO_READER.bat

# Manual startup
cd backend
uvicorn main:app --reload      # Terminal 1
python arduino_reader.py       # Terminal 2
```

### Linux/Mac
```bash
# Setup (first time only)
cd backend
chmod +x SETUP.sh
./SETUP.sh

# Quick start (all-in-one)
chmod +x start_arduino_reader.sh
./start_arduino_reader.sh

# Manual startup
cd backend
uvicorn main:app --reload      # Terminal 1
python arduino_reader.py       # Terminal 2
```

## 📋 Setup Checklist (5 Min)

1. ☐ Connect Arduino via USB
2. ☐ Open `backend/SmartSense.ino` in Arduino IDE
3. ☐ Upload to Arduino (Ctrl+U)
4. ☐ Navigate to `backend/` folder
5. ☐ Run `SETUP.bat` (Windows) or setup script (Mac/Linux)
6. ☐ Run `START_ARDUINO_READER.bat` or `./start_arduino_reader.sh`
7. ☐ Open http://localhost:5173 in browser
8. ☐ Login with admin/admin123
9. ☐ See live data on dashboard!

## 🔧 Troubleshooting Quick Fix

| Problem | Quick Fix |
|---------|-----------|
| Arduino not found | Install CH340 driver, check USB cable |
| Backend won't start | Port 8000 in use, try port 8001 |
| No data | Check Arduino serial monitor shows data |
| Disconnects | Check USB cable quality |
| Weird characters | Verify baud rate is 115200 |

## 📁 Key Files

| File | Purpose | Location |
|------|---------|----------|
| SmartSense.ino | Arduino sketch | backend/ |
| arduino_reader.py | Serial reader | backend/ |
| main.py | Backend API | backend/ |
| Dashboard.tsx | Frontend display | src/components/ |
| ARDUINO.md | Full guide | backend/ |

## 🧪 Test Commands

```bash
# Test backend running
curl http://localhost:8000/

# Test Arduino detection
python -m serial.tools.list_ports

# Monitor data
# Open Arduino IDE → Tools → Serial Monitor (115200 baud)
```

## 📊 Expected Data Format

**Arduino sends:**
```
Temp: 28.5| Humidity: 60.2C | Smoke: 245
```

**Reader sends to backend:**
```json
{"temperature": 28.5, "humidity": 60.2, "gas_level": 245}
```

**Frontend displays:**
```
Temperature: 28.5°C
Humidity: 60.2%
Gas Level: 245 PPM
Status: ✅ SAFE
```

## 🎯 Key Success Indicators

✅ Arduino serial monitor shows: `Temp: X| Humidity: YC | Smoke: Z`
✅ Arduino reader shows: `✅ Temp: X°C | Humidity: Y% | Gas: Z PPM`
✅ Backend console shows: `📊 Data received - Temp: X°C, Gas: Z PPM`
✅ Frontend dashboard updates every 2 seconds
✅ No errors in browser console

## 🔐 Default Users

```
admin / admin123        (admin role)
user / user123          (operator role)
```
⚠️ **CHANGE BEFORE PRODUCTION!**

## 📞 Need Help?

1. **Setup issues:** See [backend/ARDUINO.md](backend/ARDUINO.md)
2. **Verification:** See [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md)
3. **Expected output:** See [EXPECTED_OUTPUT.md](EXPECTED_OUTPUT.md)
4. **Backend info:** See [backend/README_NEW.md](backend/README_NEW.md)
5. **API docs:** Run backend and visit http://localhost:8000/docs

## 🎓 Learning Path

1. **First time?** → Start with [ARDUINO_INTEGRATION_SUMMARY.md](ARDUINO_INTEGRATION_SUMMARY.md)
2. **Setting up?** → Use [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md)
3. **Troubleshooting?** → Check [backend/ARDUINO.md](backend/ARDUINO.md)
4. **Want details?** → Read [EXPECTED_OUTPUT.md](EXPECTED_OUTPUT.md)

## ⏱️ Typical Setup Time

- Hardware assembly: 10-15 minutes
- Arduino upload: 2 minutes
- Python setup: 2 minutes
- Starting services: 1 minute
- **Total: ~20 minutes**

## 🎊 Quick Win: Verify Everything Works

1. Start all services
2. Watch Arduino reader show data
3. Watch backend receive data
4. Refresh frontend - see live data!
5. Disconnect Arduino - see error handling
6. Reconnect - resume automatically!

**Congratulations! Your real-time monitor is working!** 🎉

---

**Save this file! Print it! Keep it handy!** 📌

*SmartSense Arduino Integration v1.0*
*February 2024*
