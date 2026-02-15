@echo off
REM SmartSense Arduino Integration - Setup Script (Windows)
REM This script installs all dependencies and creates necessary files

cls
echo.
echo ============================================================
echo     SmartSense Arduino Integration - Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Python is not installed or not in PATH
    echo.
    echo Please install Python 3.8+ from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [✓] Python detected: 
python --version
echo.

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pip not found. Try: python -m pip install --upgrade pip
    pause
    exit /b 1
)

REM Check if we're in the backend directory
if not exist "main.py" (
    echo.
    echo [ERROR] main.py not found!
    echo.
    echo Please run this script from the backend\ directory
    echo.
    pause
    exit /b 1
)

echo [✓] Found main.py - correct directory
echo.

REM Install dependencies
echo [1/3] Installing Python dependencies from requirements.txt...
echo.
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [✓] Dependencies installed successfully
echo.

REM Create necessary directories
echo [2/3] Setting up project structure...
if not exist "logs" mkdir logs
if not exist "data" mkdir data
echo [✓] Created directories
echo.

REM Verify Arduino reader script
echo [3/3] Verifying Arduino reader script...
if not exist "arduino_reader.py" (
    echo [ERROR] arduino_reader.py not found!
    pause
    exit /b 1
)
echo [✓] Arduino reader found
echo.

REM Summary
echo ============================================================
echo.
echo [✓] Setup Complete!
echo.
echo Next Steps:
echo.
echo 1. Upload Arduino Sketch:
echo    - Open SmartSense.ino in Arduino IDE
echo    - Select your board and COM port
echo    - Click Upload
echo.
echo 2. Start Backend (this terminal):
echo    python -m uvicorn main:app --reload
echo.
echo 3. Start Arduino Reader (new terminal):
echo    python arduino_reader.py
echo.
echo 4. Open Frontend:
echo    http://localhost:5173
echo    Login: admin / admin123
echo.
echo Or, use the quick-start script:
echo    START_ARDUINO_READER.bat
echo.
echo For more help, see: ARDUINO.md
echo.
echo ============================================================
echo.
pause
