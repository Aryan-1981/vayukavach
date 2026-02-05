# 🔌 ESP32 + PM7003 Wiring Diagram

## Hardware Connections

```
┌──────────────────────────────────────────────────────────────┐
│                    PM7003 Air Quality Sensor                 │
│                                                              │
│  Pin 1 (VCC)  ●──────────────────────┐                      │
│  Pin 2 (GND)  ●──────────────┐       │                      │
│  Pin 3 (SET)  ●  (not used)  │       │                      │
│  Pin 4 (RX)   ●──────────┐   │       │                      │
│  Pin 5 (TX)   ●──────┐   │   │       │                      │
│  Pin 6 (RESET)●      │   │   │       │  (not used)          │
│  Pin 7 (NC)   ●      │   │   │       │  (not connected)     │
│  Pin 8 (NC)   ●      │   │   │       │  (not connected)     │
└──────────────────────┼───┼───┼───────┼──────────────────────┘
                       │   │   │       │
                       │   │   │       │
                       │   │   │       │
                       │   │   │       │
┌──────────────────────┼───┼───┼───────┼──────────────────────┐
│                      │   │   │       │     ESP32             │
│                      │   │   │       │                       │
│              GPIO 17 ●───┘   │       │  (TX2 / Serial2 TX)   │
│              GPIO 16 ●───────┘       │  (RX2 / Serial2 RX)   │
│                  GND ●───────────────┘                       │
│                  5V  ●───────────────────────────────────────┘
│                                                              │
│  Other useful pins:                                          │
│  GPIO 2  ●  (built-in LED)                                  │
│  3.3V    ●  (power output - don't use for PM7003)          │
│  EN      ●  (enable/reset)                                  │
└──────────────────────────────────────────────────────────────┘
```

## Pin Mapping Table

| PM7003 Pin | Wire Color* | Function | ESP32 Pin | ESP32 Function |
|------------|-------------|----------|-----------|----------------|
| 1 (VCC)    | Red         | Power 5V | 5V / VIN  | 5V Power Out   |
| 2 (GND)    | Black       | Ground   | GND       | Ground         |
| 4 (RX)     | Yellow      | Receive  | GPIO 17   | TX2 (Serial2)  |
| 5 (TX)     | Green       | Transmit | GPIO 16   | RX2 (Serial2)  |

*Wire colors may vary depending on your PM7003 cable

## Important Notes

### ⚠️ Power Requirements:
- PM7003 requires **5V** power (not 3.3V!)
- Current draw: ~100mA
- ESP32 can provide 5V from VIN pin when powered via USB
- For battery operation, ensure your power source provides 5V

### ✅ Signal Level Compatibility:
- PM7003 TX/RX signals are **3.3V compatible**
- Safe to connect directly to ESP32 GPIO pins
- No level shifter needed

### 🔧 Serial Communication:
- PM7003 communicates at **9600 baud**
- Uses standard UART protocol
- Data format: 8N1 (8 data bits, no parity, 1 stop bit)

## Step-by-Step Wiring Instructions

### 1. Prepare Your Components
   - ESP32 development board
   - PM7003 sensor with cable
   - Breadboard (optional)
   - Jumper wires (4 wires minimum)

### 2. Connect Power (FIRST)
   ```
   PM7003 VCC (Pin 1, Red)    →  ESP32 5V or VIN
   PM7003 GND (Pin 2, Black)  →  ESP32 GND
   ```

### 3. Connect Data Lines
   ```
   PM7003 TX (Pin 5, Green)   →  ESP32 GPIO 16 (RX2)
   PM7003 RX (Pin 4, Yellow)  →  ESP32 GPIO 17 (TX2)
   ```

### 4. Double Check
   - ✅ VCC to 5V (not 3.3V)
   - ✅ GND to GND
   - ✅ TX to RX (crossed)
   - ✅ RX to TX (crossed)

## Breadboard Layout (Optional)

```
                USB
                 ║
         ┌───────╨───────┐
         │               │
         │     ESP32     │
         │               │
         └───┬───────┬───┘
             │       │
        GPIO16      GPIO17
        (RX2)       (TX2)
             │       │
             │       │
         ┌───┴───────┴───┐
         │  Breadboard   │
         │   Power Rails │
         │   5V    GND   │
         └───┬───────┬───┘
             │       │
             │       │
         ┌───┴───────┴───────┐
         │                   │
         │      PM7003       │
         │   Air Sensor      │
         │                   │
         └───────────────────┘
```

## Common Wiring Mistakes

### ❌ Don't Do This:
1. **Wrong voltage**: Connecting VCC to 3.3V instead of 5V
2. **Reversed TX/RX**: TX to TX or RX to RX
3. **Wrong GPIO pins**: Using different pins than GPIO 16/17
4. **No common ground**: Forgetting to connect GND

### ✅ Do This:
1. **5V power**: Use 5V or VIN pin
2. **Crossed lines**: TX → RX, RX → TX
3. **Correct GPIOs**: GPIO 16 (RX) and GPIO 17 (TX)
4. **Common ground**: Always connect GND

## Testing Your Connections

### Visual Check:
- [ ] 4 wires connected
- [ ] Red wire to 5V
- [ ] Black wire to GND
- [ ] Data wires to GPIO 16 and 17

### Power Test:
1. Connect ESP32 to USB
2. PM7003 fan should start spinning
3. Small LED on PM7003 may blink (if present)

### Communication Test:
1. Upload the Arduino code
2. Open Serial Monitor (115200 baud)
3. You should see:
   ```
   WiFi Connected!
   === Air Quality Data ===
   PM1.0: XX µg/m³
   PM2.5: XX µg/m³
   PM10: XX µg/m³
   ```

## Troubleshooting Connection Issues

### No Sensor Data:
**Problem**: Serial Monitor shows no PM readings

**Solutions**:
1. Check TX/RX are not swapped
   - PM7003 TX → ESP32 RX (GPIO 16)
   - PM7003 RX → ESP32 TX (GPIO 17)
2. Verify baud rate is 9600
3. Try swapping TX/RX if still not working

### Fan Not Spinning:
**Problem**: PM7003 fan is not running

**Solutions**:
1. Check VCC is connected to 5V (not 3.3V)
2. Verify GND connection
3. Try different USB cable/power source
4. Measure voltage with multimeter (should be ~5V)

### Erratic Readings:
**Problem**: Sensor gives random/inconsistent values

**Solutions**:
1. Add 0.1µF capacitor between VCC and GND (near sensor)
2. Use shorter wires (< 30cm recommended)
3. Keep sensor away from electromagnetic interference
4. Wait 30 seconds for sensor to stabilize after power-on

## Advanced: Multiple Sensors

Want to add more PM7003 sensors?

```cpp
// Second sensor on different pins
HardwareSerial pmsSerial1(1);  // Serial1
pmsSerial1.begin(9600, SERIAL_8N1, 18, 19); // RX=18, TX=19
```

Wiring for second sensor:
- PM7003 #2 TX → ESP32 GPIO 18
- PM7003 #2 RX → ESP32 GPIO 19
- Share 5V and GND connections

## Pinout References

### ESP32 DevKit V1 Pinout:
```
                      ┌─────USB─────┐
                      │             │
                3.3V  ●             ● GND
                  EN  ●             ● GPIO 23
            GPIO 36   ●             ● GPIO 22
            GPIO 39   ●             ● GPIO 1 (TX0)
            GPIO 34   ●             ● GPIO 3 (RX0)
            GPIO 35   ●             ● GPIO 21
            GPIO 32   ●             ● GND
            GPIO 33   ●             ● GPIO 19
            GPIO 25   ●             ● GPIO 18
            GPIO 26   ●             ● GPIO 5
            GPIO 27   ●  ESP32      ● GPIO 17 ← TX2
            GPIO 14   ●             ● GPIO 16 ← RX2
            GPIO 12   ●             ● GPIO 4
                GND   ●             ● GPIO 0
            GPIO 13   ●             ● GPIO 2
              SD2/9   ●             ● GPIO 15
             SD3/10   ●             ● SD1/8
             CMD/11   ●             ● SD0/7
                5V    ●             ● CLK/6
                      └─────────────┘
```

### PM7003 Sensor Pinout:
```
         ┌──────────────────┐
     VCC │ 1  ●             │
     GND │ 2  ●    PM7003   │
     SET │ 3  ●   Sensor    │
      RX │ 4  ●             │
      TX │ 5  ●             │
   RESET │ 6  ●             │
      NC │ 7  ●             │
      NC │ 8  ●             │
         └──────────────────┘
```

## Final Checklist Before Upload

- [ ] PM7003 VCC connected to ESP32 5V
- [ ] PM7003 GND connected to ESP32 GND
- [ ] PM7003 TX connected to ESP32 GPIO 16
- [ ] PM7003 RX connected to ESP32 GPIO 17
- [ ] All connections are secure
- [ ] PM7003 fan is spinning
- [ ] ESP32 is connected to computer via USB
- [ ] Correct board selected in Arduino IDE
- [ ] Correct port selected in Arduino IDE

## Ready to Upload!

Once all connections are verified:
1. Open your chosen `.ino` file
2. Update WiFi credentials
3. Upload to ESP32
4. Open Serial Monitor (115200 baud)
5. Watch the data flow! 🎉

---

**Note**: If you're using a different ESP32 board model, pin locations may vary. Refer to your board's pinout diagram.
