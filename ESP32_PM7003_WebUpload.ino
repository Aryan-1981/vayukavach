/*
 * ESP32 Air Purifier - PM7003 Sensor Data Upload
 * Reads PM2.5, PM10 data from PM7003 sensor and uploads to web
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

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ThingSpeak Settings (Free Cloud Option)
const char* thingSpeakServer = "http://api.thingspeak.com/update";
String thingSpeakAPIKey = "YOUR_THINGSPEAK_API_KEY";

// Alternative: Your own server endpoint
const char* customServerURL = "http://your-server.com/api/upload";

// PM7003 Serial (using Serial2)
HardwareSerial pmsSerial(2);

// PM7003 data structure
struct PMSData {
  uint16_t pm1_0_standard;
  uint16_t pm2_5_standard;
  uint16_t pm10_standard;
  uint16_t pm1_0_env;
  uint16_t pm2_5_env;
  uint16_t pm10_env;
};

PMSData pmsData;

// Timing variables
unsigned long lastUploadTime = 0;
const unsigned long uploadInterval = 60000; // Upload every 60 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize PM7003 sensor (GPIO 16=RX, GPIO 17=TX)
  pmsSerial.begin(9600, SERIAL_8N1, 16, 17);
  
  Serial.println("\n\nESP32 Air Purifier - PM7003 Sensor");
  
  // Connect to WiFi
  connectToWiFi();
  
  delay(2000);
}

void loop() {
  // Read PM7003 sensor data
  if (readPMSData()) {
    // Display data on Serial Monitor
    displaySensorData();
    
    // Upload data to website every interval
    if (millis() - lastUploadTime >= uploadInterval) {
      uploadToThingSpeak();
      // OR use: uploadToCustomServer();
      
      lastUploadTime = millis();
    }
  }
  
  delay(2000); // Read every 2 seconds
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed!");
  }
}

bool readPMSData() {
  // PM7003 sends 32 bytes of data
  if (pmsSerial.available() >= 32) {
    uint8_t buffer[32];
    uint16_t sum = 0;
    
    // Look for start characters 0x42, 0x4D
    if (pmsSerial.read() == 0x42 && pmsSerial.read() == 0x4D) {
      // Read the remaining 30 bytes
      for (int i = 0; i < 30; i++) {
        buffer[i] = pmsSerial.read();
      }
      
      // Calculate checksum (first 30 bytes + start chars)
      sum = 0x42 + 0x4D;
      for (int i = 0; i < 28; i++) {
        sum += buffer[i];
      }
      
      uint16_t receivedChecksum = (buffer[28] << 8) | buffer[29];
      
      if (sum == receivedChecksum) {
        // Parse data (values are in big-endian format)
        pmsData.pm1_0_standard = (buffer[2] << 8) | buffer[3];
        pmsData.pm2_5_standard = (buffer[4] << 8) | buffer[5];
        pmsData.pm10_standard = (buffer[6] << 8) | buffer[7];
        pmsData.pm1_0_env = (buffer[8] << 8) | buffer[9];
        pmsData.pm2_5_env = (buffer[10] << 8) | buffer[11];
        pmsData.pm10_env = (buffer[12] << 8) | buffer[13];
        
        return true;
      }
    }
  }
  
  return false;
}

void displaySensorData() {
  Serial.println("\n=== Air Quality Data ===");
  Serial.print("PM1.0: ");
  Serial.print(pmsData.pm1_0_env);
  Serial.println(" µg/m³");
  
  Serial.print("PM2.5: ");
  Serial.print(pmsData.pm2_5_env);
  Serial.println(" µg/m³");
  
  Serial.print("PM10: ");
  Serial.print(pmsData.pm10_env);
  Serial.println(" µg/m³");
  Serial.println("========================\n");
}

void uploadToThingSpeak() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Construct ThingSpeak URL
    String url = String(thingSpeakServer) + "?api_key=" + thingSpeakAPIKey;
    url += "&field1=" + String(pmsData.pm1_0_env);
    url += "&field2=" + String(pmsData.pm2_5_env);
    url += "&field3=" + String(pmsData.pm10_env);
    
    Serial.println("Uploading to ThingSpeak...");
    http.begin(url);
    
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      Serial.print("Upload successful! Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.print("Upload failed! Error code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected!");
    connectToWiFi();
  }
}

void uploadToCustomServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(customServerURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    String jsonPayload = "{";
    jsonPayload += "\"pm1_0\":" + String(pmsData.pm1_0_env) + ",";
    jsonPayload += "\"pm2_5\":" + String(pmsData.pm2_5_env) + ",";
    jsonPayload += "\"pm10\":" + String(pmsData.pm10_env) + ",";
    jsonPayload += "\"timestamp\":" + String(millis());
    jsonPayload += "}";
    
    Serial.println("Uploading to Custom Server...");
    Serial.println("Payload: " + jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("Upload successful! Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.print("Upload failed! Error code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected!");
    connectToWiFi();
  }
}
