@echo off
REM SmartSense Real-Time Arduino Integration Startup Script (Windows)
REM This script starts both the backend server and Arduino reader

cls
echo.
echo ============================================================
echo     SmartSense Industrial Safety Monitoring System
echo     Real-Time Arduino Integration
echo ============================================================
echo.
echo This script will:
echo   1. Start the FastAPI backend server (port 8000)
echo   2. In a new window: Start the Arduino realtime reader
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ and add to PATH
    pause
    exit /b 1
)

REM Check if we're in the backend directory
if not exist "main.py" (
    echo [ERROR] main.py not found!
    echo Please run this script from the backend\ directory
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo [1/3] Installing/upgrading dependencies...
python -m pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Start backend server
echo [2/3] Starting FastAPI backend server on port 8000...
echo.
echo.
start "SmartSense Backend Server" cmd /k python -m uvicorn main:app --reload

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Arduino reader in new window
echo [3/3] Starting Arduino reader in new window...
echo.
start "SmartSense Arduino Reader" cmd /k python arduino_reader.py

echo.
echo ============================================================
echo.
echo ✅ Services started!
echo.
echo Frontend URL: http://localhost:5173
echo Backend URL:  http://localhost:8000
echo.
echo Demo Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo ============================================================
echo.
echo Tip: Keep both windows open. Data will stream in real-time.
echo Press Ctrl+C in either window to stop services.
echo.
pause
