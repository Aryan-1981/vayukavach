# ESP32 Air Purifier - PM7003 Sensor Web Upload

This project reads air quality data from a PM7003 particulate matter sensor using an ESP32 and uploads the data to a website.

## Hardware Setup

### Components Required:
- ESP32 Development Board
- PM7003 Air Quality Sensor
- Connecting wires
- 5V Power supply (if needed)

### Wiring Connections:
```
PM7003 Sensor -> ESP32
--------------------------
TX  (Pin 4)  -> GPIO 16 (RX2)
RX  (Pin 5)  -> GPIO 17 (TX2)
VCC (Pin 1)  -> 5V
GND (Pin 2)  -> GND
```

**Note:** The PM7003 operates at 5V, but the TX/RX lines are 3.3V compatible.

## Software Setup

### 1. Install Arduino IDE
- Download from: https://www.arduino.cc/en/software

### 2. Install ESP32 Board Support
1. Open Arduino IDE
2. Go to **File > Preferences**
3. Add this URL to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools > Board > Boards Manager**
5. Search for "ESP32" and install "ESP32 by Espressif Systems"

### 3. Select Your Board
1. Go to **Tools > Board > ESP32 Arduino**
2. Select your ESP32 board (e.g., "ESP32 Dev Module")
3. Select the correct **Port** under **Tools > Port**

## Configuration

### Option 1: Upload to ThingSpeak (Recommended - Free & Easy)

1. **Create a ThingSpeak Account:**
   - Visit: https://thingspeak.com
   - Sign up for free account

2. **Create a New Channel:**
   - Click "Channels" > "My Channels" > "New Channel"
   - Name: "Air Quality Monitor"
   - Field 1: PM1.0
   - Field 2: PM2.5
   - Field 3: PM10
   - Save Channel

3. **Get Your API Key:**
   - Go to "API Keys" tab
   - Copy the "Write API Key"

4. **Update the Arduino Code:**
   ```cpp
   const char* ssid = "YourWiFiName";
   const char* password = "YourWiFiPassword";
   String thingSpeakAPIKey = "YOUR_WRITE_API_KEY";
   ```

### Option 2: Upload to Your Own Server

1. Set up a web server with an API endpoint
2. Update the code:
   ```cpp
   const char* customServerURL = "http://your-server.com/api/upload";
   ```
3. Comment out `uploadToThingSpeak()` and use `uploadToCustomServer()` instead

## Upload and Run

1. Open `ESP32_PM7003_WebUpload.ino` in Arduino IDE
2. Update WiFi credentials and API keys
3. Click **Upload** button
4. Open **Serial Monitor** (Tools > Serial Monitor) at 115200 baud
5. Watch the sensor data being read and uploaded!

## Viewing Your Data

### ThingSpeak:
- Go to your ThingSpeak channel
- Click on "Private View" or "Public View"
- You'll see real-time graphs of PM1.0, PM2.5, and PM10 levels

### Custom Dashboard:
- See `dashboard.html` for a simple web dashboard
- Modify it to fetch data from your server

## Data Upload Interval

By default, data is uploaded every 60 seconds. To change this:
```cpp
const unsigned long uploadInterval = 60000; // Change to desired milliseconds
```

## Troubleshooting

### No sensor data:
- Check wiring connections
- Verify PM7003 is powered (5V)
- Make sure TX/RX pins are correct (GPIO 16, 17)

### WiFi connection fails:
- Verify SSID and password
- Check WiFi signal strength
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)

### Upload fails:
- Check internet connection
- Verify API key is correct
- Check ThingSpeak rate limits (15 seconds minimum between updates)

## PM2.5 Air Quality Index Reference

| PM2.5 (µg/m³) | Air Quality | Health Impact |
|---------------|-------------|---------------|
| 0-12          | Good        | Minimal impact |
| 12-35         | Moderate    | Acceptable |
| 35-55         | Unhealthy for Sensitive Groups | May affect sensitive people |
| 55-150        | Unhealthy   | Everyone may experience effects |
| 150-250       | Very Unhealthy | Health alert |
| 250+          | Hazardous   | Health warnings |

## License

MIT License - Free to use and modify
