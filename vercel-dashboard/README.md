# ESP32 Air Quality Dashboard - Vercel + Supabase

A beautiful, real-time air quality monitoring dashboard built with Next.js, deployed on Vercel, with Supabase as the backend database.

## 🚀 Quick Start

### 1. Set Up Supabase (Free Database)

1. **Create Supabase Account:**
   - Go to https://supabase.com
   - Sign up for free
   - Create a new project

2. **Create Database Table:**
   - Go to "SQL Editor" in Supabase
   - Run this SQL command:

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

-- Enable Row Level Security (RLS)
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for ESP32)
CREATE POLICY "Allow public insert" ON sensor_data
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public read (for dashboard)
CREATE POLICY "Allow public read" ON sensor_data
  FOR SELECT TO anon
  USING (true);
```

3. **Get Your API Keys:**
   - Go to "Settings" > "API"
   - Copy your `Project URL` and `anon/public` key

### 2. Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   cd vercel-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Add Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
     - `API_SECRET_KEY` = (Optional) Create a secret key for ESP32
   - Click "Deploy"

3. **Get Your API Endpoint:**
   - After deployment, your API endpoint will be:
   - `https://your-project.vercel.app/api/upload`

### 3. Update ESP32 Code

Update your ESP32 Arduino code with the Vercel endpoint:

```cpp
const char* customServerURL = "https://your-project.vercel.app/api/upload";
```

And use the `uploadToCustomServer()` function instead of ThingSpeak.

## 🛠️ Local Development

1. **Install Dependencies:**
   ```bash
   cd vercel-dashboard
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Browser:**
   - Navigate to http://localhost:3000

## 📱 Features

✅ **Real-time Updates** - Dashboard updates automatically when new data arrives
✅ **Beautiful Charts** - Interactive line charts for historical data
✅ **Air Quality Status** - Color-coded air quality indicators
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Fast & Scalable** - Powered by Vercel's edge network
✅ **Free Tier** - Both Vercel and Supabase have generous free tiers

## 🔧 Troubleshooting

### ESP32 Can't Upload Data:
- Check that your Vercel URL is correct
- Verify Supabase policies allow anonymous inserts
- Check ESP32 Serial Monitor for error codes

### Dashboard Shows No Data:
- Verify data exists in Supabase (check SQL Editor)
- Check browser console for errors
- Verify environment variables in Vercel

### Real-time Updates Not Working:
- Supabase real-time is enabled by default
- Check browser console for subscription errors

## 📊 API Endpoints

### POST `/api/upload`
Upload sensor data from ESP32

**Request Body:**
```json
{
  "pm1_0": 10.5,
  "pm2_5": 25.3,
  "pm10": 35.7,
  "api_key": "your-secret-key" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data uploaded successfully"
}
```

## 🎨 Customization

### Change Update Interval:
Edit in `pages/index.js`:
```javascript
const interval = setInterval(() => {
  fetchLatestData();
  fetchHistoricalData();
}, 30000); // Change 30000 to desired milliseconds
```

### Change Chart Data Points:
Edit in `pages/index.js`:
```javascript
.limit(50) // Change to desired number of data points
```

## 💰 Cost

- **Supabase Free Tier:** 500MB database, 2GB file storage
- **Vercel Free Tier:** 100GB bandwidth, unlimited deployments
- **Total Cost:** $0/month for most personal projects!

## 📝 License

MIT License - Free to use and modify
