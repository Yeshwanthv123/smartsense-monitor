#!/bin/bash

# SmartSense Real-Time Arduino Integration Startup Script (Linux/Mac)
# This script starts both the backend server and Arduino reader

clear

echo ""
echo "============================================================"
echo "     SmartSense Industrial Safety Monitoring System"
echo "     Real-Time Arduino Integration"
echo "============================================================"
echo ""
echo "This script will:"
echo "   1. Start the FastAPI backend server (port 8000)"
echo "   2. In a new terminal: Start the Arduino realtime reader"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.8+ first:"
    echo "  Ubuntu/Debian: sudo apt-get install python3 python3-pip"
    echo "  macOS: brew install python3"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "[ERROR] main.py not found!"
    echo "Please run this script from the backend/ directory"
    exit 1
fi

# Make this script executable (just in case)
chmod +x "$0"

# Install/upgrade dependencies
echo "[1/3] Installing/upgrading dependencies..."
python3 -m pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

# Start backend server in background
echo "[2/3] Starting FastAPI backend server on port 8000..."
echo ""
python3 -m uvicorn main:app --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Arduino reader in new terminal window
echo "[3/3] Starting Arduino reader in new terminal..."
echo ""

# Detect the terminal emulator and open new window
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- python3 arduino_reader.py
elif command -v xterm &> /dev/null; then
    xterm -e python3 arduino_reader.py &
elif command -v osascript &> /dev/null; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && python3 arduino_reader.py"'
else
    # Fallback - run in same terminal but in background
    echo "Could not detect terminal. Running Arduino reader in background..."
    python3 arduino_reader.py &
fi

echo ""
echo "============================================================"
echo ""
echo "✅ Services started!"
echo ""
echo "Frontend URL: http://localhost:5173"
echo "Backend URL:  http://localhost:8000"
echo ""
echo "Demo Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "============================================================"
echo ""
echo "To stop all services, press Ctrl+C or run:"
echo "   kill $BACKEND_PID"
echo ""

# Wait for interrupt signal
trap "kill $BACKEND_PID 2>/dev/null; exit 0" INT TERM
wait
