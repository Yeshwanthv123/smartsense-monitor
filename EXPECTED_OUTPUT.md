# 📊 Expected Output & Visual Guide

This guide shows what you should expect to see when everything is running correctly.

## 🖥️ Terminal 1: Backend Server

```
$ cd backend
$ uvicorn main:app --reload

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process [1234]
INFO:     Waiting for application startup.
INFO:     Application startup complete [0.123456s]
```

When Arduino reader connects and sends data:
```
📊 Data received - Temp: 28.5°C, Gas: 245 PPM, Humidity: 60.2% -> Status: SAFE
Client connected. Total connections: 1
```

When multiple clients connect:
```
Client connected. Total connections: 2
Client disconnected. Total connections: 1
```

## 🔌 Terminal 2: Arduino Reader

```
$ python arduino_reader.py

============================================================
🔌 SmartSense Arduino Reader - Real-Time Data Streaming
============================================================

Available serial ports:
  - COM3: CH340 USB UART
  - COM5: Serial USB Device

✅ Found Arduino on: COM3

Connected to Arduino on COM3 at 115200 baud

✅ Backend is running

📊 Streaming real-time sensor data...
(Press Ctrl+C to stop)

✅ Temp: 28.5°C | Humidity: 60.2% | Gas: 245 PPM
✅ Temp: 28.6°C | Humidity: 60.1% | Gas: 248 PPM
✅ Temp: 28.7°C | Humidity: 60.3% | Gas: 242 PPM
📱 >>> BUZZER PULSING <<<
✅ Temp: 32.1°C | Humidity: 58.9% | Gas: 310 PPM
```

When Arduino is disconnected:
```
❌ Serial connection error: (The system cannot find the file specified) COM3
❌ Arduino disconnected. Attempting to reconnect...
⏳ Waiting 2 seconds...

✅ Found Arduino on: COM3
✅ Connected to Arduino on COM3 at 115200 baud
```

When backend is not running:
```
❌ Cannot connect to backend. Is it running? (uvicorn main:app --reload)
⏳ Will retry in next reading...
✅ Connected! Resuming data stream...
```

## 🌐 Browser: Frontend Dashboard

### Safe Status (All Green)
```
╔═══════════════════════════════════════╗
║  SmartSense Safety Monitor            ║
╠═══════════════════════════════════════╣
║                                       ║
║  Status: ✅ SAFE                      ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Temperature                     │  ║
║  │ 28.5°C                          │  ║
║  │ ✅ Normal                       │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Humidity                        │  ║
║  │ 60.2%                           │  ║
║  │ ✅ Normal                       │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Gas Level                       │  ║
║  │ 245 PPM                         │  ║
║  │ ✅ Safe (< 300)                 │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  Last Update: 2024-02-15 10:30:45    ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Warning Status (Yellow Alert)
```
╔═══════════════════════════════════════╗
║  SmartSense Safety Monitor            ║
╠═══════════════════════════════════════╣
║                                       ║
║  Status: ⚠️ WARNING                   ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Temperature                     │  ║
║  │ 38.5°C                          │  ║
║  │ ⚠️ Elevated                     │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Gas Level                       │  ║
║  │ 320 PPM                         │  ║
║  │ ⚠️ Warning (300-500)            │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  🔔 Alert Banner:                     ║
║  "⚠️ WARNING: Elevated readings"     ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Danger Status (Red Alert + Buzzer)
```
╔═════════════════════════════════════════╗
║  SmartSense Safety Monitor              ║
╠═════════════════════════════════════════╣
║                                         ║
║  ┌─────────────────────────────────┐   ║
║  │ Status: 🔴 DANGER               │   ║
║  │ IMMEDIATE ACTION REQUIRED        │   ║
║  └─────────────────────────────────┘   ║
║                                         ║
║  🚨 ALERT BANNER (Red):                ║
║  "🔴 DANGER: Hazardous conditions!"   ║
║                                         ║
║  ┌─────────────────────────────────┐   ║
║  │ Temperature: 48.5°C             │   ║
║  │ 🔴 CRITICAL                     │   ║
║  │ Gas Level: 520 PPM              │   ║
║  │ 🔴 HAZARDOUS                    │   ║
║  └─────────────────────────────────┘   ║
║                                         ║
║  🔊 BUZZER ACTIVE (1 sec pulse)        ║
║  📱 ALARM triggered on Arduino          ║
║                                         ║
╚═════════════════════════════════════════╝
```

## 📊 Browser Console (Network Tab)

### WebSocket Connection Established
```
[Network Tab]
ws://localhost:8000/ws
Status: 101 Switching Protocols
Connected ✓
```

### Incoming Data Messages
```
{
  "temperature": 28.5,
  "gas_level": 245,
  "humidity": 60.2,
  "status": "SAFE",
  "timestamp": "2024-02-15T10:30:45.123456"
}

{
  "temperature": 28.6,
  "gas_level": 248,
  "humidity": 60.1,
  "status": "SAFE",
  "timestamp": "2024-02-15T10:30:47.234567"
}
```

## ✅ Health Check (Browser)

Visit `http://localhost:8000/` to see:
```json
{
  "service": "SmartSense Safety Monitor",
  "status": "running",
  "version": "1.0.0"
}
```

## 📱 Arduino Serial Monitor Output

Set to 115200 baud and you should see:
```
SmartSense: System Online - Testing Heavy Pulse Beep...
Temp: 28.5| Humidity: 60.2C | Smoke: 245
Temp: 28.6| Humidity: 60.1C | Smoke: 248
Temp: 28.7| Humidity: 60.3C | Smoke: 242
>>> BUZZER PULSING <<<
Temp: 32.1| Humidity: 58.9C | Smoke: 310
>>> BUZZER PULSING <<<
Temp: 31.8| Humidity: 59.1C | Smoke: 305
```

## 🔄 Real-Time Update Cycle

When everything is running:

1. **Every 2 seconds:**
   - Arduino reads sensors
   - Arduino prints to serial: `Temp: X| Humidity: YC | Smoke: Z`

2. **Arduino reader:**
   - Reads serial line
   - Parses with regex
   - Sends POST to `/data`

3. **Backend:**
   - Receives data
   - calculates status (SAFE/WARNING/DANGER)
   - Broadcasts via WebSocket

4. **Frontend:**
   - Receives WebSocket message
   - Updates dashboard
   - Updates chart history
   - Checks for alerts

**Total latency: ~100-500ms** (imperceptible to user)

## 🎯 Data Value Ranges

### Normal Operation
- Temperature: 25-30°C
- Humidity: 40-70%
- Gas: 100-250 PPM
- Status: ✅ SAFE

### Warning Level
- Temperature: 35-42°C
- Humidity: 70-85%
- Gas: 300-450 PPM
- Status: ⚠️ WARNING

### Danger Level
- Temperature: 45-60°C
- Humidity: 85-100%
- Gas: 501+ PPM
- Status: 🔴 DANGER

## 📈 Chart View

The Dashboard shows:
- **Real-time temperature** graph
- **Recent gas levels** trend
- **Humidity history** (last 20 readings)
- **Status indicator** and timestamps

Each data point appears as it's received, updating smoothly.

## 🔊 Buzzer States

**Buzzer OFF (Normal):**
- Arduino GPIO 32 = HIGH
- No sound
- Status shows SAFE

**Buzzer ON (Alarm):**
- Arduino GPIO 32 = LOW (1 second)
- Produces buzzing sound
- Arduino GPIO 32 = HIGH (1 second)
- Repeats while gas > 200

---

**When you see all of this, your integration is working perfectly! 🎉**
