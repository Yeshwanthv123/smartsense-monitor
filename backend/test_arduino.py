import serial
import serial.tools.list_ports
import time

# Find Arduino
ports = serial.tools.list_ports.comports()
arduino_port = None

for port in ports:
    if 'Arduino' in port.description or 'CH340' in port.description or 'CP210' in port.description:
        arduino_port = port.device
        break

if not arduino_port:
    arduino_port = ports[0].device if ports else None

if arduino_port:
    print(f"Connecting to {arduino_port}...")
    ser = serial.Serial(arduino_port, 115200, timeout=2)
    print("Waiting for Arduino to boot...\n")
    time.sleep(3)
    
    # Clear buffer
    ser.reset_input_buffer()
    
    print("Reading sensor data lines:\n")
    for i in range(15):
        time.sleep(0.5)
        if ser.in_waiting:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line:
                print(f"{i+1}: {repr(line)}")
    ser.close()
else:
    print("No Arduino found")
