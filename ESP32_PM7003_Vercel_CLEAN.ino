/*
 * ESP32 Air Purifier - PM7003 Sensor Data Upload to Vercel
 * Reads PM2.5, PM10 data from PM7003 sensor and uploads to Vercel + Supabase
 * 
 * PM7003 Connections:
 * PM7003 TX -> ESP32 RX (GPIO 16)
 * PM7003 RX -> ESP32 TX (GPIO 17)
 * PM7003 VCC -> 5V
 * PM7003 GND -> GND
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>

HardwareSerial pmSerial(2);
uint8_t buffer[32];

// ===== WIFI DETAILS =====
const char* ssid = "realme_3";
const char* password = "vansh_1909";

// ===== VERCEL DASHBOARD =====
const char* dashboardURL = "https://vayukavach.vercel.app/api/upload";
const char* apiSecretKey = "esp32_secret_2024";

// Timing for uploads
unsigned long lastUploadTime = 0;
const unsigned long uploadInterval = 60000; // Upload every 60 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);

  // PM7003 UART
  pmSerial.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println("\n=== ESP32 Air Purifier - PM7003 to Vercel ===");
  
  // WiFi connect
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Dashboard: ");
  Serial.println("https://vayukavach.vercel.app");
  Serial.println("==============================================\n");
}

void loop() {
  if (pmSerial.available() >= 32) {
    if (pmSerial.read() == 0x42) {
      pmSerial.read();

      for (int i = 0; i < 30; i++) {
        buffer[i] = pmSerial.read();
      }

      int pm1  = buffer[4] * 256 + buffer[5];
      int pm25 = buffer[6] * 256 + buffer[7];
      int pm10 = buffer[8] * 256 + buffer[9];

      Serial.println("------ AIR QUALITY ------");
      Serial.print("PM1.0 : ");  Serial.println(pm1);
      Serial.print("PM2.5 : ");  Serial.println(pm25);
      Serial.print("PM10  : ");  Serial.println(pm10);
      Serial.println("-------------------------");

      // Upload to Vercel dashboard every 60 seconds
      if (millis() - lastUploadTime >= uploadInterval) {
        uploadToVercel(pm1, pm25, pm10);
        lastUploadTime = millis();
      }
    }
  }

  delay(700);
}

void uploadToVercel(int pm1, int pm25, int pm10) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(dashboardURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload using ArduinoJson v7
    JsonDocument doc;
    doc["pm1_0"] = pm1;
    doc["pm2_5"] = pm25;
    doc["pm10"] = pm10;
    doc["api_key"] = apiSecretKey;
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    Serial.println("\n📤 Uploading to Vercel Dashboard...");
    Serial.println("Payload: " + jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("✓ Upload successful! Response: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("✗ Upload failed! Error: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("⚠ WiFi disconnected! Reconnecting...");
    WiFi.begin(ssid, password);
  }
}
