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
  const [showFullChart, setShowFullChart] = useState(false);

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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center transition-all duration-500 p-4`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 md:h-32 md:w-32 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl md:text-2xl animate-pulse px-4">Loading Air Quality Data...</div>
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
    } p-2 sm:p-4 md:p-6`}>
      
      {/* Add meta viewport for mobile */}
      <style jsx global>{`
        @media (max-width: 640px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header with Dark Mode Toggle - Mobile Optimized */}
        <header className="text-center text-white mb-4 sm:mb-8 pt-4 sm:pt-8 animate-fade-in relative px-4">
          {/* Dark Mode Toggle Button - Repositioned for mobile */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute top-2 right-2 sm:top-0 sm:right-4 p-3 sm:p-4 rounded-full transition-all duration-500 transform hover:scale-110 active:scale-95 touch-manipulation ${
              darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-300'
            } shadow-2xl z-10`}
            aria-label="Toggle dark mode"
          >
            <div className="text-2xl sm:text-3xl animate-bounce-slow">
              {darkMode ? '☀️' : '🌙'}
            </div>
          </button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 animate-slide-down leading-tight">
            🌬️ VayuKavach
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 animate-slide-up px-2">
            वायु कवच - Air Quality Monitor
          </p>
          <div className="mt-3 sm:mt-4 inline-block">
            <span className="animate-pulse bg-white bg-opacity-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              🔴 Live Monitoring
            </span>
          </div>
        </header>

        {/* Current Data Cards - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
          {/* PM1.0 Card */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 transform active:scale-95 sm:hover:scale-105 sm:hover:-rotate-1 transition-all duration-300 animate-fade-in-up delay-100 touch-manipulation`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3 flex items-center justify-between`}>
              <span>PM1.0 Particles</span>
              <span className="text-xl sm:text-2xl animate-pulse">💨</span>
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-500 mb-1 sm:mb-2 animate-number-pop">
              {latestData ? latestData.pm1_0.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm mb-2 sm:mb-3`}>µg/m³</div>
            <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 animate-progress transition-all duration-1000"
                style={{ width: `${Math.min((latestData?.pm1_0 || 0) / 50 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* PM2.5 Card - Featured */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 transform active:scale-95 sm:hover:scale-105 sm:hover:rotate-1 transition-all duration-300 animate-fade-in-up delay-200 touch-manipulation sm:col-span-2 lg:col-span-1`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3 flex items-center justify-between`}>
              <span>PM2.5 Particles</span>
              <span className="text-xl sm:text-2xl animate-bounce">⚠️</span>
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-500 mb-1 sm:mb-2 animate-number-pop">
              {latestData ? latestData.pm2_5.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm mb-3 sm:mb-4`}>µg/m³</div>
            <div className={`${status.color} text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-center font-bold text-sm sm:text-base transform active:scale-95 sm:hover:scale-105 transition-transform`}>
              {status.text}
            </div>
          </div>

          {/* PM10 Card */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          } rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 transform active:scale-95 sm:hover:scale-105 sm:hover:-rotate-1 transition-all duration-300 animate-fade-in-up delay-300 touch-manipulation sm:col-span-2 lg:col-span-1`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3 flex items-center justify-between`}>
              <span>PM10 Particles</span>
              <span className="text-xl sm:text-2xl animate-pulse">🔴</span>
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-500 mb-1 sm:mb-2 animate-number-pop">
              {latestData ? latestData.pm10.toFixed(1) : '--'}
            </div>
            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm mb-2 sm:mb-3`}>µg/m³</div>
            <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 animate-progress transition-all duration-1000"
                style={{ width: `${Math.min((latestData?.pm10 || 0) / 100 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Historical Chart - Mobile Optimized */}
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-8 animate-fade-in-up delay-400`}>
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📊 Historical Data
            </h2>
            {/* Toggle for mobile chart view */}
            <button
              onClick={() => setShowFullChart(!showFullChart)}
              className="md:hidden px-3 py-1 bg-blue-500 text-white rounded-lg text-xs active:scale-95 transition-transform"
            >
              {showFullChart ? 'Compact' : 'Expand'}
            </button>
          </div>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={showFullChart ? 350 : 250} minWidth={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="time" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 10 }}
                  interval={showFullChart ? 'preserveStartEnd' : 'auto'}
                />
                <YAxis 
                  label={{ 
                    value: 'µg/m³', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fill: darkMode ? '#9ca3af' : '#6b7280',
                    fontSize: 12
                  }} 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    color: darkMode ? '#ffffff' : '#000000',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="PM1" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="PM2_5" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="PM10" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Air Quality Reference - Mobile Optimized Table */}
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 md:p-8 animate-fade-in-up delay-500`}>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📋 Air Quality Index
          </h2>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[500px] sm:min-w-full">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">PM2.5</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Quality</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm hidden sm:table-cell">Health Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">0-12</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Good</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Satisfactory</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">12-35</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Moderate</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Acceptable</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">35-55</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap">Unhealthy*</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Sensitive groups</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">55-150</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Unhealthy</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Everyone affected</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">150-250</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Very Bad</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Health alert</td>
                </tr>
                <tr className={`active:bg-opacity-10 active:bg-gray-500 sm:hover:bg-opacity-10 sm:hover:bg-gray-500 transition-colors`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">250+</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className="bg-red-900 text-white px-2 py-1 rounded text-xs">Hazardous</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">Emergency</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 px-2 sm:px-0">
            * Unhealthy for sensitive groups
          </p>
        </div>

        {/* Last Update - Mobile Friendly */}
        <div className="text-center text-white mt-4 sm:mt-8 pb-4 sm:pb-8 animate-fade-in px-2">
          <p className="text-xs sm:text-sm opacity-75">
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
