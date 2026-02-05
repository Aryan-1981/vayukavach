# 🚀 ESP32 Air Purifier with Vercel Dashboard

Complete guide to deploy your air quality monitor with a beautiful real-time dashboard on Vercel.

## ✨ What You Get

- **Beautiful Dashboard**: Modern, responsive web interface
- **Real-time Updates**: See data update live on the dashboard
- **Historical Charts**: Interactive graphs showing trends
- **100% Free**: Using free tiers of Vercel + Supabase
- **Deployed Online**: Accessible from anywhere in the world

## 📋 Step-by-Step Setup

### Step 1: Set Up Supabase (Database) - 5 minutes

1. **Create Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Name: "air-quality-monitor"
   - Database Password: Create a strong password
   - Region: Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

3. **Create Database Table**
   - Once project is ready, go to "SQL Editor" (left sidebar)
   - Click "New Query"
   - Paste this SQL code:

```sql
CREATE TABLE sensor_data (
  id BIGSERIAL PRIMARY KEY,
  pm1_0 DECIMAL(10,2) NOT NULL,
  pm2_5 DECIMAL(10,2) NOT NULL,
  pm10 DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX idx_created_at ON sensor_data(created_at DESC);

-- Enable Row Level Security
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow ESP32 to insert data
CREATE POLICY "Allow public insert" ON sensor_data
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow dashboard to read data
CREATE POLICY "Allow public read" ON sensor_data
  FOR SELECT TO anon
  USING (true);
```

   - Click "Run" or press Cmd/Ctrl + Enter
   - You should see "Success. No rows returned"

4. **Get Your API Credentials**
   - Go to "Settings" (gear icon) > "API"
   - Copy these two values (you'll need them later):
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: Long string starting with `eyJ...`

### Step 2: Deploy Dashboard to Vercel - 10 minutes

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org
   - Install LTS version

2. **Open Terminal** in the project folder
   ```bash
   cd "/Users/ak/Documents/esp 32 project arduino/vercel-dashboard"
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Test Locally** (optional but recommended)
   ```bash
   # Copy environment template
   cp .env.local.example .env.local
   
   # Edit .env.local and add your Supabase credentials
   # Then run:
   npm run dev
   ```
   - Open http://localhost:3000 in browser
   - You should see the dashboard (no data yet)

5. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Air Quality Dashboard"
   ```
   
   - Go to https://github.com/new
   - Create new repository (name: `air-quality-dashboard`)
   - Copy the commands shown and run in terminal:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/air-quality-dashboard.git
   git branch -M main
   git push -u origin main
   ```

6. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New..." > "Project"
   - Import your `air-quality-dashboard` repository
   - Configure:
     - Framework Preset: Next.js (auto-detected)
     - Root Directory: `./` (default)
   - Add Environment Variables (click "Environment Variables"):
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
     - `API_SECRET_KEY` = Create your own secret (e.g., `esp32_secret_2024`)
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

7. **Get Your Dashboard URL**
   - After deployment completes, you'll see your URL:
   - `https://air-quality-dashboard-xxxxx.vercel.app`
   - Click it to see your dashboard!
   - Your API endpoint is: `https://your-url.vercel.app/api/upload`

### Step 3: Configure ESP32 - 5 minutes

1. **Install ArduinoJson Library**
   - Open Arduino IDE
   - Go to "Sketch" > "Include Library" > "Manage Libraries"
   - Search for "ArduinoJson"
   - Install "ArduinoJson" by Benoit Blanchon (version 6.x)

2. **Update ESP32 Code**
   - Open `ESP32_PM7003_Vercel.ino`
   - Update these lines:

```cpp
// WiFi credentials
const char* ssid = "YourWiFiName";
const char* password = "YourWiFiPassword";

// Vercel API endpoint
const char* vercelServerURL = "https://your-project.vercel.app/api/upload";

// API secret key (same as in Vercel environment variables)
const char* apiSecretKey = "esp32_secret_2024";
```

3. **Upload to ESP32**
   - Connect ESP32 via USB
   - Select correct board and port
   - Click "Upload"
   - Open Serial Monitor (115200 baud)

4. **Verify It's Working**
   - Serial Monitor should show:
     - WiFi connection success
     - Sensor readings every 2 seconds
     - Upload success every 60 seconds
   - Check your dashboard - you should see real-time data!

## 🎉 You're Done!

Your dashboard is now live at: `https://your-project.vercel.app`

### What Happens Now:

1. **ESP32** reads PM7003 sensor every 2 seconds
2. **Uploads** data to Vercel every 60 seconds
3. **Vercel** API stores data in Supabase
4. **Dashboard** auto-updates with real-time data
5. **You** can view from anywhere in the world!

## 🔧 Customization

### Change Upload Frequency

In `ESP32_PM7003_Vercel.ino`:
```cpp
const unsigned long uploadInterval = 30000; // 30 seconds
```

### Change Chart Time Range

In `vercel-dashboard/pages/index.js`:
```javascript
.limit(100) // Show last 100 readings instead of 50
```

### Add More Sensors

1. Modify ESP32 code to read additional sensors
2. Add fields to Supabase table
3. Update API endpoint to accept new data
4. Add cards to dashboard

## 📱 Sharing Your Dashboard

### Make It Public
- Your Vercel URL is already public!
- Share: `https://your-project.vercel.app`

### Add Custom Domain (Optional)
- Go to Vercel project settings
- Click "Domains"
- Add your custom domain (e.g., `airquality.mydomain.com`)

### Embed in Website
```html
<iframe src="https://your-project.vercel.app" 
        width="100%" height="800px" 
        frameborder="0">
</iframe>
```

## 🛠️ Troubleshooting

### ESP32 Upload Fails
**Error: Connection refused**
- Check Vercel URL is correct
- Verify WiFi is connected
- Check Serial Monitor for exact error

**Error: 401 Unauthorized**
- API key mismatch
- Check `apiSecretKey` matches Vercel environment variable

**Error: 400 Bad Request**
- JSON format issue
- Check ArduinoJson library is installed

### Dashboard Shows No Data
**Blank dashboard**
- Check Supabase has data: SQL Editor > `SELECT * FROM sensor_data;`
- Verify environment variables in Vercel
- Check browser console (F12) for errors

**Data not updating**
- Refresh page
- Check ESP32 is uploading (Serial Monitor)
- Verify Supabase policies are set correctly

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## 💰 Cost Breakdown

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Supabase | 500MB DB | ~1MB/month | $0 |
| Vercel | 100GB bandwidth | ~1GB/month | $0 |
| **Total** | | | **$0/month** |

Even with continuous uploads every minute, you'll stay within free tiers!

## 🔐 Security Best Practices

1. **Use HTTPS**: Vercel provides automatic SSL
2. **API Keys**: Keep `apiSecretKey` private
3. **Rate Limiting**: Consider adding rate limits for production
4. **Supabase RLS**: Already configured for security

## 📊 Next Steps

- **Add Alerts**: Send email/SMS when air quality is poor
- **Historical Analysis**: Export data for analysis
- **Multiple Sensors**: Add more ESP32 devices
- **Mobile App**: Create React Native app
- **Predictions**: Add ML predictions for air quality trends

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **ESP32 Forum**: https://www.esp32.com
- **GitHub Issues**: Create issue in your repository

---

**Congratulations! You now have a professional air quality monitoring system! 🎉**
