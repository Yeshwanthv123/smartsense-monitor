"""
Sensor Simulator for SmartSense Safety Monitoring System
Simulates ESP32 sensor data by sending random POST requests every 2 seconds.

Usage:
1. First, start the backend server: uvicorn main:app --reload
2. Then run this script: python simulate_sensors.py
"""

import requests
import random
import time
from datetime import datetime

API_URL = "http://localhost:8000/data"


def generate_sensor_data():
    """Generate realistic sensor readings with occasional spikes."""
    
    # Base values for normal operation
    base_temp = 28 + random.random() * 10  # 28-38°C normally
    base_gas = 150 + random.random() * 100  # 150-250 PPM normally
    base_humidity = 40 + random.random() * 30  # 40-70% humidity
    
    # 10% chance of warning levels, 5% chance of danger levels
    spike = random.random()
    
    if spike > 0.95:
        # Danger scenario
        temperature = 46 + random.random() * 10  # 46-56°C
        gas_level = 510 + random.random() * 100  # 510-610 PPM
        print("⚠️  SIMULATING DANGER SCENARIO")
    elif spike > 0.85:
        # Warning scenario
        temperature = 36 + random.random() * 8  # 36-44°C
        gas_level = 310 + random.random() * 150  # 310-460 PPM
        print("⚡ SIMULATING WARNING SCENARIO")
    else:
        # Normal operation
        temperature = base_temp
        gas_level = base_gas
    
    return {
        "temperature": round(temperature, 1),
        "gas_level": int(gas_level),
        "humidity": round(base_humidity, 1)
    }


def send_data(data):
    """Send sensor data to the backend API."""
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            result = response.json()
            status_emoji = {
                "SAFE": "✅",
                "WARNING": "⚠️",
                "DANGER": "🚨"
            }.get(result["status"], "❓")
            
            print(f"{datetime.now().strftime('%H:%M:%S')} | "
                  f"Temp: {data['temperature']:5.1f}°C | "
                  f"Gas: {data['gas_level']:4d} PPM | "
                  f"Humidity: {data['humidity']:5.1f}% | "
                  f"Status: {status_emoji} {result['status']}")
        else:
            print(f"❌ Error: Server returned {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the backend server running?")
        print("   Start it with: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    """Main loop to continuously send simulated sensor data."""
    print("=" * 70)
    print("🏭 SmartSense Sensor Simulator")
    print("=" * 70)
    print("Sending simulated sensor data every 2 seconds...")
    print("Press Ctrl+C to stop\n")
    print("-" * 70)
    print(f"{'Time':^10} | {'Temperature':^12} | {'Gas Level':^10} | {'Humidity':^10} | Status")
    print("-" * 70)
    
    try:
        while True:
            data = generate_sensor_data()
            send_data(data)
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n" + "=" * 70)
        print("Simulator stopped. Goodbye! 👋")
        print("=" * 70)


if __name__ == "__main__":
    main()
