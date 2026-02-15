"""
Arduino Serial Reader for SmartSense Safety Monitoring System
Reads real-time sensor data from Arduino and sends to backend API.

Usage:
1. First, start the backend server: uvicorn main:app --reload
2. Upload the Arduino sketch to your ESP32/Arduino board
3. Run this script: python arduino_reader.py
4. Connect Arduino via USB - the script will auto-detect the COM port
"""

import serial
import serial.tools.list_ports
import requests
import time
import re
from typing import Optional, Dict

API_URL = "http://localhost:8000/data"


def find_arduino_port() -> Optional[str]:
    """
    Auto-detect Arduino COM port.
    Looks for common patterns in port descriptions.
    """
    ports = serial.tools.list_ports.comports()
    
    if not ports:
        print("❌ No serial ports found. Check USB connection.")
        return None
    
    print("Available serial ports:")
    for port in ports:
        print(f"  - {port.device}: {port.description}")
    
    # Common Arduino board descriptions
    arduino_keywords = ["Arduino", "CH340", "CP210x", "FTDI", "USB"]
    
    for port in ports:
        for keyword in arduino_keywords:
            if keyword.lower() in port.description.lower():
                print(f"\n✅ Found Arduino on: {port.device}")
                return port.device
    
    # If no keyword match, use first available port
    first_port = ports[0].device
    print(f"\n⚠️  Using first available port: {first_port}")
    print(f"   Description: {ports[0].description}")
    return first_port


def parse_sensor_data(line: str) -> Optional[Dict]:
    """
    Parse sensor data from Arduino serial output.
    
    Expected formats:
    "Temp: 25.5| Humidity: 60.2C | Smoke: 250" (original)
    "Temp: 25.5°C | Humidity: 60.2% | Smoke Level: 250" (actual)
    
    Returns:
    {
        "temperature": 25.5,
        "humidity": 60.2,
        "gas_level": 250
    }
    """
    try:
        # Try pattern 1: Temp: 25.5°C | Humidity: 60.2% | Smoke Level: 250
        pattern1 = r"Temp:\s*([\d.]+)°?C?\s*\|\s*Humidity:\s*([\d.]+)%?\s*\|\s*Smoke\s*Level:\s*(\d+)"
        match = re.search(pattern1, line)
        
        # Try pattern 2 (original): Temp: 25.5| Humidity: 60.2C | Smoke: 250
        if not match:
            pattern2 = r"Temp:\s*([\d.]+)\|\s*Humidity:\s*([\d.]+)C\s*\|\s*Smoke:\s*(\d+)"
            match = re.search(pattern2, line)
        if match:
            temperature = float(match.group(1))
            humidity = float(match.group(2))
            gas_level = int(match.group(3))
            
            return {
                "temperature": temperature,
                "humidity": humidity,
                "gas_level": gas_level
            }
    except (ValueError, AttributeError) as e:
        print(f"❌ Error parsing: {e}")
    
    return None


def send_data_to_backend(data: Dict) -> bool:
    """Send parsed sensor data to backend API."""
    try:
        response = requests.post(API_URL, json=data, timeout=5)
        
        if response.status_code == 200:
            print(f"✅ Temp: {data['temperature']}°C | Humidity: {data['humidity']}% | "
                  f"Gas: {data['gas_level']} PPM")
            return True
        else:
            print(f"❌ Backend error: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running? (uvicorn main:app --reload)")
        return False
    except requests.exceptions.Timeout:
        print("❌ Backend request timeout")
        return False
    except Exception as e:
        print(f"❌ Error sending data: {e}")
        return False


def main():
    """Main loop for reading Arduino data and sending to backend."""
    print("\n" + "="*60)
    print("🔌 SmartSense Arduino Reader - Real-Time Data Streaming")
    print("="*60 + "\n")
    
    # Find Arduino port
    port = find_arduino_port()
    if not port:
        print("\n❌ Failed to find Arduino device.")
        print("💡 Troubleshooting tips:")
        print("   1. Check USB connection")
        print("   2. Install CH340 driver if needed (for some Arduino clones)")
        print("   3. Check Device Manager (Windows) for Unknown Devices")
        return
    
    # Connect to Arduino
    try:
        ser = serial.Serial(port, 115200, timeout=1)
        time.sleep(2)  # Wait for Arduino to initialize
        print(f"\n✅ Connected to Arduino on {port} at 115200 baud\n")
    except serial.SerialException as e:
        print(f"❌ Failed to open serial port: {e}")
        print("💡 Make sure the port is not in use by another application")
        return
    
    # Verify backend is running
    try:
        response = requests.get("http://localhost:8000/", timeout=2)
        if response.status_code == 200:
            print("✅ Backend is running\n")
    except:
        print("⚠️  Backend might not be running. Start it with:")
        print("   uvicorn main:app --reload\n")
    
    print("📊 Streaming real-time sensor data...")
    print("(Press Ctrl+C to stop)\n")
    
    consecutive_errors = 0
    max_consecutive_errors = 10
    
    try:
        while True:
            try:
                if ser.in_waiting:
                    line = ser.readline().decode('utf-8').strip()
                    
                    if line:
                        # Parse sensor data
                        data = parse_sensor_data(line)
                        
                        if data:
                            # Send to backend
                            success = send_data_to_backend(data)
                            if success:
                                consecutive_errors = 0
                            else:
                                consecutive_errors += 1
                        else:
                            # Sometimes Arduino prints other messages
                            if "System Online" in line or "Testing" in line or "BUZZER" in line:
                                print(f"📱 {line}")
                
                time.sleep(0.1)
                
            except UnicodeDecodeError:
                print("⚠️  Serial decode error, skipping line")
                consecutive_errors += 1
            
            if consecutive_errors >= max_consecutive_errors:
                print(f"\n❌ Too many consecutive errors ({max_consecutive_errors}). Reconnecting...")
                ser.close()
                time.sleep(2)
                ser = serial.Serial(port, 115200, timeout=1)
                consecutive_errors = 0
    
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping sensor reader...")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
    finally:
        if ser.is_open:
            ser.close()
            print("✅ Serial connection closed")


if __name__ == "__main__":
    main()
