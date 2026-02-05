import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [latestData, setLatestData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestData();
    fetchHistoricalData();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('sensor_data_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sensor_data' },
        (payload) => {
          setLatestData(payload.new);
          fetchHistoricalData();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLatestData();
      fetchHistoricalData();
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  async function fetchLatestData() {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setLatestData(data[0]);
    }
    setLoading(false);
  }

  async function fetchHistoricalData() {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      // Reverse to show oldest to newest
      const formattedData = data.reverse().map(item => ({
        time: new Date(item.created_at).toLocaleTimeString(),
        PM1: item.pm1_0,
        PM2_5: item.pm2_5,
        PM10: item.pm10
      }));
      setHistoricalData(formattedData);
    }
  }

  function getAirQualityStatus(pm25) {
    if (pm25 <= 12) return { text: 'Good', color: 'bg-green-500' };
    if (pm25 <= 35) return { text: 'Moderate', color: 'bg-yellow-500' };
    if (pm25 <= 55) return { text: 'Unhealthy for Sensitive', color: 'bg-orange-500' };
    if (pm25 <= 150) return { text: 'Unhealthy', color: 'bg-red-500' };
    if (pm25 <= 250) return { text: 'Very Unhealthy', color: 'bg-purple-500' };
    return { text: 'Hazardous', color: 'bg-red-900' };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const status = latestData ? getAirQualityStatus(latestData.pm2_5) : { text: 'No Data', color: 'bg-gray-500' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-2">🌬️ Air Quality Monitor</h1>
          <p className="text-xl opacity-90">Real-time PM7003 Sensor Data</p>
        </header>

        {/* Current Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* PM1.0 Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-3">PM1.0 Particles</div>
            <div className="text-5xl font-bold text-green-600 mb-2">
              {latestData ? latestData.pm1_0.toFixed(1) : '--'}
            </div>
            <div className="text-gray-400 text-sm">µg/m³</div>
          </div>

          {/* PM2.5 Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-3">PM2.5 Particles</div>
            <div className="text-5xl font-bold text-orange-600 mb-2">
              {latestData ? latestData.pm2_5.toFixed(1) : '--'}
            </div>
            <div className="text-gray-400 text-sm mb-4">µg/m³</div>
            <div className={`${status.color} text-white px-4 py-2 rounded-lg text-center font-bold`}>
              {status.text}
            </div>
          </div>

          {/* PM10 Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-3">PM10 Particles</div>
            <div className="text-5xl font-bold text-red-600 mb-2">
              {latestData ? latestData.pm10.toFixed(1) : '--'}
            </div>
            <div className="text-gray-400 text-sm">µg/m³</div>
          </div>
        </div>

        {/* Historical Chart */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Historical Data (Last 50 Readings)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'µg/m³', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="PM1" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="PM2_5" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="PM10" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Air Quality Reference */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Air Quality Index Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">PM2.5 (µg/m³)</th>
                  <th className="px-4 py-3 text-left">Air Quality</th>
                  <th className="px-4 py-3 text-left">Health Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">0 - 12</td>
                  <td className="px-4 py-3"><span className="bg-green-500 text-white px-3 py-1 rounded">Good</span></td>
                  <td className="px-4 py-3">Air quality is satisfactory</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">12 - 35</td>
                  <td className="px-4 py-3"><span className="bg-yellow-500 text-white px-3 py-1 rounded">Moderate</span></td>
                  <td className="px-4 py-3">Acceptable for most people</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">35 - 55</td>
                  <td className="px-4 py-3"><span className="bg-orange-500 text-white px-3 py-1 rounded">Unhealthy for Sensitive</span></td>
                  <td className="px-4 py-3">May affect sensitive groups</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">55 - 150</td>
                  <td className="px-4 py-3"><span className="bg-red-500 text-white px-3 py-1 rounded">Unhealthy</span></td>
                  <td className="px-4 py-3">Everyone may experience effects</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">150 - 250</td>
                  <td className="px-4 py-3"><span className="bg-purple-500 text-white px-3 py-1 rounded">Very Unhealthy</span></td>
                  <td className="px-4 py-3">Health alert for everyone</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">250+</td>
                  <td className="px-4 py-3"><span className="bg-red-900 text-white px-3 py-1 rounded">Hazardous</span></td>
                  <td className="px-4 py-3">Emergency conditions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center text-white mt-8 pb-8">
          <p className="text-sm opacity-75">
            Last updated: {latestData ? new Date(latestData.created_at).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}
