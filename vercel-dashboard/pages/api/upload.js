// API endpoint for ESP32 to upload sensor data
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pm1_0, pm2_5, pm10, api_key } = req.body;

    // Optional: Validate API key from ESP32
    if (process.env.API_SECRET_KEY && api_key !== process.env.API_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate data
    if (!pm1_0 && pm1_0 !== 0 || !pm2_5 && pm2_5 !== 0 || !pm10 && pm10 !== 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('sensor_data')
      .insert([
        {
          pm1_0: parseFloat(pm1_0),
          pm2_5: parseFloat(pm2_5),
          pm10: parseFloat(pm10),
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Data uploaded successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
