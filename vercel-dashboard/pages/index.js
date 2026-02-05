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
  const [darkMode, setDarkMode] = useState(false);

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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center transition-all duration-500`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-white text-2xl animate-pulse">Loading Air Quality Data...</div>
        </div>
      </div>
    );
  }

  const status = latestData ? getAirQualityStatus(latestData.pm2_5) : { text: 'No Data', color: 'bg-gray-500' };

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
    } p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <header className="text-center text-white mb-8 pt-8 animate-fade-in relative">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute top-0 right-4 p-4 rounded-full transition-all duration-500 transform hover:scale-110 hover:rotate-12 ${
              darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-300'
            } shadow-2xl`}
            aria-label="Toggle dark mode"
          >
            <div className="text-3xl animate-bounce-slow">
              {darkMode ? '☀️' : '🌙'}
            </div>
          </button>

          <h1 className="text-5xl md:text-6xl font-bold mb-2 animate-slide-down">
            🌬️ VayuKavach
          </h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slide-up">
            वायु कवच - Air Quality Monitor
          </p>
          <div className="mt-4 inline-block">
            <span className="animate-pulse bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
              🔴 Live Monitoring
            </span>
          </div>
        </header>

        {/* Current Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* PM1.0 Card */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-2xl shadow-2xl p-8 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in-up delay-100`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wide mb-3 flex items-center justify-between`}>
              <span>PM1.0 Particles</span>
              <span className="text-2xl animate-pulse">💨</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-green-500 mb-2 animate-number-pop">
              {latestData ? latestData.pm1_0.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>µg/m³</div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 animate-progress transition-all duration-1000"
                style={{ width: `${Math.min((latestData?.pm1_0 || 0) / 50 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* PM2.5 Card */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-2xl shadow-2xl p-8 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in-up delay-200`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wide mb-3 flex items-center justify-between`}>
              <span>PM2.5 Particles</span>
              <span className="text-2xl animate-bounce">⚠️</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-orange-500 mb-2 animate-number-pop">
              {latestData ? latestData.pm2_5.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm mb-4`}>µg/m³</div>
            <div className={`${status.color} text-white px-4 py-2 rounded-lg text-center font-bold transform hover:scale-105 transition-transform`}>
              {status.text}
            </div>
          </div>

          {/* PM10 Card */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-2xl shadow-2xl p-8 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in-up delay-300`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wide mb-3 flex items-center justify-between`}>
              <span>PM10 Particles</span>
              <span className="text-2xl animate-pulse">🔴</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-red-500 mb-2 animate-number-pop">
              {latestData ? latestData.pm10.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>µg/m³</div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 animate-progress transition-all duration-1000"
                style={{ width: `${Math.min((latestData?.pm10 || 0) / 100 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Historical Chart */}
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in-up delay-400`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📊 Historical Data (Last 50 Readings)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis 
                label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', fill: darkMode ? '#9ca3af' : '#6b7280' }} 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="PM1" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="PM2_5" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="PM10" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Air Quality Reference */}
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-2xl shadow-2xl p-8 animate-fade-in-up delay-500`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📋 Air Quality Index Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="px-4 py-3 text-left">PM2.5 (µg/m³)</th>
                  <th className="px-4 py-3 text-left">Air Quality</th>
                  <th className="px-4 py-3 text-left">Health Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">0 - 12</td>
                  <td className="px-4 py-3"><span className="bg-green-500 text-white px-3 py-1 rounded">Good</span></td>
                  <td className="px-4 py-3">Air quality is satisfactory</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">12 - 35</td>
                  <td className="px-4 py-3"><span className="bg-yellow-500 text-white px-3 py-1 rounded">Moderate</span></td>
                  <td className="px-4 py-3">Acceptable for most people</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">35 - 55</td>
                  <td className="px-4 py-3"><span className="bg-orange-500 text-white px-3 py-1 rounded">Unhealthy for Sensitive</span></td>
                  <td className="px-4 py-3">May affect sensitive groups</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">55 - 150</td>
                  <td className="px-4 py-3"><span className="bg-red-500 text-white px-3 py-1 rounded">Unhealthy</span></td>
                  <td className="px-4 py-3">Everyone may experience effects</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">150 - 250</td>
                  <td className="px-4 py-3"><span className="bg-purple-500 text-white px-3 py-1 rounded">Very Unhealthy</span></td>
                  <td className="px-4 py-3">Health alert for everyone</td>
                </tr>
                <tr className={`hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  <td className="px-4 py-3">250+</td>
                  <td className="px-4 py-3"><span className="bg-red-900 text-white px-3 py-1 rounded">Hazardous</span></td>
                  <td className="px-4 py-3">Emergency conditions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center text-white mt-8 pb-8 animate-fade-in">
          <p className="text-sm opacity-75">
            Last updated: {latestData ? new Date(latestData.created_at).toLocaleString() : 'Never'}
          </p>
          <p className="text-xs opacity-50 mt-2">
            Made with ❤️ by VayuKavach Team
          </p>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes number-pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-number-pop {
          animation: number-pop 0.5s ease-out;
        }
        
        .animate-progress {
          transform-origin: left;
          animation: progress 1.5s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
