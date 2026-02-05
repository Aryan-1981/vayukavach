# 📦 ESP32 PM7003 Air Purifier - Complete Project

## 🎯 What This Project Does

Upload real-time air quality data from your ESP32 + PM7003 sensor to a website!

**Measures:**
- PM1.0 (ultra-fine particles)
- PM2.5 (fine particles - health concern)
- PM10 (coarse particles)

**Uploads to:**
- ✅ ThingSpeak (5-min setup)
- ✅ Vercel + Supabase (20-min setup, professional)

---

## 📂 Project Files Overview

### 🟢 For ThingSpeak (Easiest):
| File | Description |
|------|-------------|
| `ESP32_PM7003_WebUpload.ino` | Arduino code for ESP32 |
| `dashboard.html` | Optional local dashboard |
| `README.md` | Complete setup guide |

### 🔵 For Vercel (Professional):
| File | Description |
|------|-------------|
| `ESP32_PM7003_Vercel.ino` | Arduino code for Vercel |
| `vercel-dashboard/` | Next.js dashboard app |
| `VERCEL_SETUP_GUIDE.md` | Step-by-step Vercel guide |

### 📚 Documentation:
| File | Description |
|------|-------------|
| `START_HERE.md` | ⭐ **Begin here!** Quick start |
| `WIRING_GUIDE.md` | Hardware connection diagrams |
| `THINGSPEAK_VS_VERCEL.md` | Comparison & decision guide |
| `PROJECT_SUMMARY.md` | This file |

### 🗂️ Other Files:
| File | Description |
|------|-------------|
| `server_example.php` | Optional PHP server example |

---

## 🚀 Quick Start (Choose One)

### Option A: ThingSpeak (Recommended for Beginners)
```
1. Read: START_HERE.md
2. Follow: README.md
3. Use: ESP32_PM7003_WebUpload.ino
4. Time: 5 minutes
```

### Option B: Vercel (Recommended for Developers)
```
1. Read: START_HERE.md
2. Follow: VERCEL_SETUP_GUIDE.md
3. Use: ESP32_PM7003_Vercel.ino + vercel-dashboard/
4. Time: 20 minutes
```

---

## 📋 What You Need

### Hardware:
- [ ] ESP32 Development Board
- [ ] PM7003 Air Quality Sensor
- [ ] 4 jumper wires
- [ ] USB cable
- [ ] WiFi connection

### Software:
- [ ] Arduino IDE
- [ ] ESP32 board support (installed in Arduino IDE)

### For Vercel Only:
- [ ] Node.js
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Supabase account (free)

---

## 🔧 Setup Steps Summary

### 1. Hardware Setup (Both Options)
```
See: WIRING_GUIDE.md

PM7003 → ESP32:
- VCC → 5V
- GND → GND
- TX  → GPIO 16 (RX2)
- RX  → GPIO 17 (TX2)
```

### 2A. ThingSpeak Software Setup
```
1. Create ThingSpeak account
2. Create channel with 3 fields
3. Copy Write API Key
4. Update ESP32_PM7003_WebUpload.ino:
   - WiFi SSID & Password
   - ThingSpeak API Key
5. Upload to ESP32
6. Done! View on ThingSpeak.com
```

### 2B. Vercel Software Setup
```
1. Create Supabase account & database
2. Deploy dashboard to Vercel
3. Update ESP32_PM7003_Vercel.ino:
   - WiFi SSID & Password
   - Vercel API URL
4. Upload to ESP32
5. Done! Share your custom URL
```

---

## 🎨 Features Comparison

| Feature | ThingSpeak | Vercel |
|---------|------------|--------|
| Setup Time | 5 min | 20 min |
| Dashboard | Basic | Beautiful |
| Customization | Limited | Unlimited |
| Domain | thingspeak.com | your-name.vercel.app |
| Real-time | 15s delay | Instant |
| Best For | Quick start | Production |

---

## 📖 Reading Order

**Complete Beginner?**
1. START_HERE.md ← Start!
2. WIRING_GUIDE.md
3. README.md (ThingSpeak)
4. Upload ESP32_PM7003_WebUpload.ino

**Developer/Student?**
1. START_HERE.md ← Start!
2. THINGSPEAK_VS_VERCEL.md
3. VERCEL_SETUP_GUIDE.md
4. Deploy vercel-dashboard/
5. Upload ESP32_PM7003_Vercel.ino

**Need to Decide?**
1. START_HERE.md ← Start!
2. THINGSPEAK_VS_VERCEL.md
3. Choose your path!

---

## 🎯 Success Checklist

### Hardware Working:
- [ ] PM7003 fan is spinning
- [ ] ESP32 powers on (LED lights)
- [ ] Serial Monitor shows sensor data
- [ ] WiFi connects successfully

### ThingSpeak Working:
- [ ] Channel created with 3 fields
- [ ] API key copied correctly
- [ ] ESP32 uploads data (check Serial Monitor)
- [ ] Data appears on ThingSpeak charts

### Vercel Working:
- [ ] Supabase database created
- [ ] Dashboard deployed to Vercel
- [ ] ESP32 uploads data successfully
- [ ] Dashboard shows real-time data

---

## 🆘 Troubleshooting Quick Reference

### No Sensor Data?
→ Check: WIRING_GUIDE.md
- Verify TX/RX connections
- Ensure 5V power (not 3.3V)

### WiFi Won't Connect?
→ Check ESP32 code:
- SSID and password correct?
- Using 2.4GHz WiFi (not 5GHz)
- Router in range?

### Upload Fails?
→ For ThingSpeak:
- API key correct?
- Check Serial Monitor for error
- Wait 15 seconds between uploads

→ For Vercel:
- URL correct?
- Supabase policies set?
- ArduinoJson library installed?

### Dashboard Empty?
→ For ThingSpeak:
- Wait up to 60 seconds
- Check "Private View"
- Verify channel ID

→ For Vercel:
- Check browser console (F12)
- Verify environment variables
- Check Supabase for data

---

## 💡 Pro Tips

### Test Locally First:
1. Connect ESP32 via USB
2. Open Serial Monitor
3. Verify sensor readings
4. Then test uploads

### Start Simple:
- Begin with ThingSpeak
- Switch to Vercel later if needed
- All code is ready for both!

### Keep Learning:
- Modify dashboard colors
- Add email alerts
- Connect multiple sensors
- Build mobile app

---

## 🌟 Project Ideas & Extensions

### Easy:
- [ ] Add temperature/humidity sensor
- [ ] Send alerts when PM2.5 is high
- [ ] Log data to SD card
- [ ] Add LCD display

### Medium:
- [ ] Control air purifier based on readings
- [ ] Compare outdoor vs indoor air quality
- [ ] Create weekly/monthly reports
- [ ] Add weather data integration

### Advanced:
- [ ] Build mobile app
- [ ] Machine learning predictions
- [ ] Deploy multiple sensors (air quality map)
- [ ] Voice assistant integration

---

## 📚 Learning Resources

### ESP32:
- Official Docs: https://docs.espressif.com
- Random Nerd Tutorials: https://randomnerdtutorials.com/esp32
- Arduino ESP32: https://github.com/espressif/arduino-esp32

### PM7003:
- Datasheet: Search "PM7003 datasheet"
- Plantower: Official manufacturer

### Web Development:
- Next.js: https://nextjs.org/learn
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs

### Air Quality:
- EPA AQI: https://www.airnow.gov/aqi/
- WHO Guidelines: https://www.who.int/health-topics/air-pollution

---

## 🎓 Educational Value

**What You'll Learn:**

### Hardware:
- Serial communication (UART)
- Sensor interfacing
- ESP32 programming
- Power management

### Software:
- WiFi networking
- HTTP requests
- JSON data format
- API integration

### Web (Vercel path):
- React/Next.js
- Database design
- RESTful APIs
- Real-time updates
- Cloud deployment

---

## 📊 Expected Results

### Air Quality Readings:
**Indoor (typical):**
- PM2.5: 5-15 µg/m³ (Good)
- PM10: 10-25 µg/m³

**Outdoor (varies):**
- PM2.5: 10-50 µg/m³
- PM10: 20-100 µg/m³

**High pollution:**
- PM2.5: 50+ µg/m³ (Unhealthy)
- PM10: 100+ µg/m³

### Update Frequency:
- Sensor reading: Every 2 seconds
- Upload to cloud: Every 60 seconds (configurable)
- Dashboard refresh: 30 seconds (Vercel: real-time)

---

## 🔐 Security & Privacy

### Data Privacy:
- **ThingSpeak**: Data on MathWorks servers
- **Vercel**: Your own Supabase database

### Security Best Practices:
- Keep API keys private
- Don't commit .env files to GitHub
- Use strong passwords
- Enable 2FA on accounts

### Optional Improvements:
- Add authentication to dashboard
- Encrypt sensor data
- Rate limit API endpoint
- Use HTTPS (Vercel does this automatically)

---

## 💰 Cost Breakdown

### Hardware (One-time):
- ESP32: $5-15
- PM7003: $15-25
- Wires/USB: $5
- **Total**: ~$30-50

### Cloud Services (Monthly):
- ThingSpeak: $0 (free tier)
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- **Total**: $0/month

**Perfect for students and hobbyists!**

---

## 🎉 What Makes This Project Special

✅ **Complete & Ready**: All code provided, tested, and documented
✅ **Two Options**: Choose complexity level
✅ **Well Documented**: Step-by-step guides
✅ **Free to Run**: No monthly costs
✅ **Educational**: Learn hardware + software
✅ **Expandable**: Add features easily
✅ **Professional**: Portfolio-worthy (Vercel)
✅ **Health Focused**: Monitor air you breathe

---

## 🤝 Contributing & Sharing

### Made Improvements?
- Share your modifications
- Create GitHub repository
- Help others learn!

### Showcase Your Build:
- Take photos of setup
- Share dashboard URL
- Blog about your experience
- Make YouTube tutorial

---

## 📞 Getting Help

### Before Asking:
1. Read relevant .md file
2. Check Serial Monitor output
3. Verify all connections
4. Try example code first

### Where to Ask:
- ESP32 Forums: https://www.esp32.com
- Arduino Forums: https://forum.arduino.cc
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://supabase.com/discord

---

## ✨ Final Words

You now have everything you need to build a professional air quality monitoring system!

### Your Next Steps:
1. ⭐ Read `START_HERE.md`
2. 🔌 Check `WIRING_GUIDE.md`
3. 🚀 Choose ThingSpeak or Vercel
4. 📖 Follow the setup guide
5. 🎉 Enjoy your working project!

**The code is complete. The guides are ready. Time to build!**

Good luck! 🌬️💨

---

## 📄 File Structure Reference

```
esp 32 project arduino/
│
├── 📘 START_HERE.md                    ← Read this first!
├── 📘 PROJECT_SUMMARY.md               ← This file
├── 📘 WIRING_GUIDE.md                  ← Hardware setup
├── 📘 THINGSPEAK_VS_VERCEL.md         ← Comparison
│
├── 🟢 ThingSpeak Files:
│   ├── ESP32_PM7003_WebUpload.ino     ← ESP32 code
│   ├── README.md                       ← Setup guide
│   ├── dashboard.html                  ← Local viewer
│   └── server_example.php              ← Optional server
│
└── 🔵 Vercel Files:
    ├── ESP32_PM7003_Vercel.ino        ← ESP32 code
    ├── VERCEL_SETUP_GUIDE.md          ← Full guide
    └── vercel-dashboard/               ← Web app
        ├── pages/
        │   ├── index.js               ← Dashboard
        │   └── api/upload.js          ← API endpoint
        ├── styles/
        ├── package.json               ← Dependencies
        └── ... (other config files)
```

---

**Version**: 1.0
**Last Updated**: 2026
**License**: MIT (Free to use and modify)
