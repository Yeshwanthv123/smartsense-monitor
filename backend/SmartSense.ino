/*
 * SmartSense Industrial Safety Monitoring System
 * Arduino Sketch for DHT22 + Gas/Smoke Sensor
 * 
 * Hardware Configuration:
 * - DHT22 (Temperature/Humidity): GPIO 26
 * - Gas/Smoke Sensor (MQ-2/MQ-135): GPIO 34 (Analog Input)
 * - Buzzer/Alarm: GPIO 32 (Digital Output, LOW = ON)
 * 
 * Serial Output: 115200 baud
 * Data Format: "Temp: [T]| Humidity: [H]C | Smoke: [S]"
 * 
 * Upload Instructions:
 * 1. Install DHT library: Sketch → Include Library → Manage Libraries
 *    Search for "DHT sensor library" by Adafruit and install
 * 2. Connect Arduino to USB
 * 3. Select correct board: Tools → Board
 * 4. Select correct port: Tools → Port
 * 5. Click Upload
 * 
 * Integration with SmartSense:
 * 1. Ensure Arduino is connected via USB
 * 2. Start backend: uvicorn main:app --reload
 * 3. Run reader: python arduino_reader.py
 * 4. View data at: http://localhost:5173
 */

#include "DHT.h"

// Pin Configuration
#define DHTPIN 26       // GPIO pin for DHT22 temperature/humidity sensor
#define DHTTYPE DHT22   // DHT22 sensor type
#define GAS_PIN 34      // Analog pin for gas/smoke sensor
#define BUZZER_PIN 32   // GPIO pin for buzzer/alarm (LOW = ON, HIGH = OFF)

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Initialize Serial communication at 115200 baud (matches reader.py)
  Serial.begin(115200);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Configure GPIO pins
  pinMode(GAS_PIN, INPUT);      // Gas sensor input
  pinMode(BUZZER_PIN, OUTPUT);  // Buzzer output
  
  // Buzzer setup: HIGH = OFF (for Low Level Trigger)
  digitalWrite(BUZZER_PIN, HIGH);
  
  // System startup message
  Serial.println("SmartSense: System Online - Testing Heavy Pulse Beep...");
  
  // Optional: Test buzzer (uncomment to test on startup)
  // test_buzzer();
}

void loop() {
  // 2-second delay between readings (matches backend expectations)
  delay(2000);
  
  // Read sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int smokeLevel = analogRead(GAS_PIN);
  
  // Error handling for DHT sensor failures
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("ERROR: DHT sensor read failed!");
    return;
  }
  
  // Send data in the exact format expected by arduino_reader.py
  // Format: "Temp: [VALUE]| Humidity: [VALUE]C | Smoke: [VALUE]"
  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.print("| Humidity: ");
  Serial.print(humidity);
  Serial.print("C | Smoke: ");
  Serial.println(smokeLevel);
  
  // Alarm Logic: Trigger buzzer if smoke level is high
  // Thresholds should match backend thresholds for consistency:
  // WARNING: smokeLevel > 200 (maps to ~300 PPM)
  // DANGER: smokeLevel > 350 (maps to ~500 PPM)
  
  if (smokeLevel > 200) {
    // Send alarm indicator to serial
    Serial.println(">>> BUZZER PULSING <<<");
    
    // 1 Full Second ON to produce a solid sound
    digitalWrite(BUZZER_PIN, LOW);   // Buzzer ON (active low)
    delay(1000);
    
    // 1 Second OFF
    digitalWrite(BUZZER_PIN, HIGH);  // Buzzer OFF
    delay(1000);
  } else {
    // No alarm needed - buzzer OFF
    digitalWrite(BUZZER_PIN, HIGH);
  }
}

/*
 * Optional: Test buzzer function
 * Uncomment the call in setup() to test on startup
 */
void test_buzzer() {
  Serial.println("Testing buzzer...");
  
  // Pulse pattern: 3 short beeps
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, LOW);   // ON
    delay(200);
    digitalWrite(BUZZER_PIN, HIGH);  // OFF
    delay(200);
  }
  
  Serial.println("Buzzer test complete!");
}

/*
 * Sensor Calibration Notes:
 * 
 * DHT22 Specifications:
 * - Temperature: -40 to 80°C, accuracy ±0.5°C
 * - Humidity: 0-100%, accuracy ±2%
 * - Response time: ~2 seconds
 * 
 * Gas/Smoke Sensor (MQ-2/MQ-135):
 * - Analog output: 0-4095 (10-bit ADC)
 * - Readjust Ro calibration for accurate PPM conversion
 * - Needs 5-10 minutes warmup time
 * - Typical readings:
 *   - 100-200: Clean air
 *   - 200-300: Normal environment
 *   - 300-500: Warning level (smoke/gas detected)
 *   - 500+: Danger level (fire/high gas concentration)
 * 
 * Buzzer:
 * - Use GPIO pin with adequate current capability
 * - If connected via relay/transistor, ensure proper circuit
 * - Test buzzer separately before integration
 */
