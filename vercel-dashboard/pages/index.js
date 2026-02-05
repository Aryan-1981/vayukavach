import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Assets (Inline SVGs) ---
const LeafIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.4,6.7C17,3.5,14.6,1,11.3,0.3c-0.2,0-0.4,0-0.5,0.1C10.6,0.5,10.5,0.7,10.6,1c1.2,3,0.3,6.3-2.1,8.6 c-2.6,2.5-6.6,2.8-9.4,0.6C-1.3,9.8-1.2,10.2,0.6,12.2c1.7,2,4,3.1,6.6,3.1c0.1,0,0.3,0,0.4,0c2.8-0.1,5.4-1.3,7.4-3.5 C16.9,9.8,17.6,8.3,17.4,6.7z M3.6,10.3c2.4,1.4,5.4,1,7.5-1c2-1.9,2.8-4.6,2.1-7.2C13.8,2.8,14.2,3.4,14.5,4 c-0.1,1.8-0.9,3.4-2.2,4.8c-2,2-4.5,3.1-7.2,3C4.6,11.7,4.1,11.1,3.6,10.3z" />
  </svg>
);

const PlantIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2C8 2 6 6 6 10c0 4 3 7 3 9v3h6v-3c0-2 3-5 3-9C18 6 16 2 12 2zM12 22v-2c-1 0-2-1-2-2 0-3 2-5 2-8 0 3 2 5 2 8C14 21 13 22 12 22z" />
  </svg>
);

const TreeIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2L3 16h6v6h6v-6h6L12 2z" opacity="0.8"/>
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.5,12c-0.3,0-0.6,0.1-0.9,0.2c-0.3-2.9-2.8-5.2-5.7-5.2c-2.3,0-4.4,1.4-5.2,3.6c-0.4-0.2-0.8-0.3-1.3-0.3 c-2.4,0-4.3,1.9-4.3,4.3C1,17,2.9,19,5.3,19h13.2c1.9,0,3.5-1.6,3.5-3.5S20.4,12,18.5,12z" opacity="0.8"/>
  </svg>
);

const BirdIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M2 12s5-3 9-3 9 3 9 3" />
  </svg>
);

// --- Particle Background Component ---
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Wind Flow Lines */}
      {[...Array(5)].map((_, i) => (
         <div 
           key={`wind-${i}`}
           className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-wind"
           style={{ top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` }}
         />
      ))}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle absolute text-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 10}s`
          }}
        >
          {i % 3 === 0 ? '●' : i % 3 === 1 ? '☁' : '✦'}
        </div>
      ))}
      <div className="absolute top-20 left-0 w-full h-full pointer-events-none">
        <BirdIcon className="w-12 h-12 text-white/10 animate-fly" style={{ top: '10%', animationDuration: '25s' }} />
        <BirdIcon className="w-8 h-8 text-white/5 animate-fly animation-delay-1000" style={{ top: '20%', animationDuration: '30s' }} />
        <BirdIcon className="w-6 h-6 text-white/5 animate-fly animation-delay-500" style={{ top: '15%', animationDuration: '28s', animationDelay: '5s' }} />
      </div>
    </div>
  );
};

// --- Parallax Background Component ---
const ParallaxNature = () => {
  const [offset, setOffset] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [plantGrowth, setPlantGrowth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffset(scrollY);
      // Plants grow as user scrolls (0 to 1 scale)
      const growth = Math.min(scrollY / 2000, 1);
      setPlantGrowth(growth);
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000">
      {/* Layer 1: Distant Hills (Slowest) */}
      <div 
          className="absolute -bottom-20 left-0 w-full h-1/2 bg-gradient-to-t from-green-900/10 via-green-800/5 to-transparent"
          style={{ transform: `translateY(${offset * 0.1}px)` }}
      />
      
      {/* Layer 2: Mid-ground Trees (Medium Speed + Mouse Parallax) */}
      <div 
          className="absolute bottom-0 left-0 w-full flex justify-between opacity-20"
          style={{ 
            transform: `translateY(${offset * 0.2}px) translateX(${mousePos.x * 2}px)` 
          }}
      >
           <TreeIcon className="w-64 h-64 text-green-800 transform -translate-x-12 translate-y-12 blur-[2px] animate-sway-gentle" />
           <TreeIcon className="w-80 h-80 text-green-900 transform translate-x-20 translate-y-20 blur-[1px] animate-sway" style={{ animationDelay: '1s' }} />
           <TreeIcon className="w-56 h-56 text-green-700 transform translate-y-16 blur-[2px] animate-sway-gentle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Layer 3: Foreground Plants (Fastest & Interactive) */}
      <div 
          className="absolute bottom-0 left-0 w-full flex justify-between items-end px-10 pointer-events-auto"
          style={{ 
            transform: `translateY(-${offset * 0.05}px) translateX(${mousePos.x * 4}px)`,
            opacity: 0.3 + plantGrowth * 0.2
          }}
      >
           <PlantIcon 
             className="w-16 h-16 text-green-500/30 animate-grow animate-sway-gentle hover-nature cursor-pointer transition-all duration-300" 
             style={{ 
               animationDelay: '0.5s',
               transform: `scale(${0.8 + plantGrowth * 0.4}) rotate(${mousePos.x * 0.5}deg)`
             }} 
           />
           <PlantIcon 
             className="w-24 h-24 text-green-400/30 animate-grow animate-sway hover-nature cursor-pointer transition-all duration-300" 
             style={{ 
               animationDelay: '1s',
               transform: `scale(${0.8 + plantGrowth * 0.4}) rotate(${mousePos.x * -0.3}deg)`
             }} 
           />
           <PlantIcon 
             className="w-20 h-20 text-emerald-500/30 animate-grow animate-sway-gentle hover-nature cursor-pointer transition-all duration-300" 
             style={{ 
               animationDelay: '1.5s',
               transform: `scale(${0.8 + plantGrowth * 0.4}) rotate(${mousePos.x * 0.4}deg)`
             }} 
           />
           <PlantIcon 
             className="w-18 h-18 text-green-600/25 animate-grow animate-sway hover-nature cursor-pointer transition-all duration-300" 
             style={{ 
               animationDelay: '2s',
               transform: `scale(${0.8 + plantGrowth * 0.4}) rotate(${mousePos.x * -0.2}deg)`
             }} 
           />
      </div>
    </div>
  );
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [latestData, setLatestData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // --- Data Fetching Logic (Preserved) ---
  useEffect(() => {
    fetchLatestData();
    fetchHistoricalData();

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

    const interval = setInterval(() => {
      fetchLatestData();
      fetchHistoricalData();
    }, 30000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section
      const sections = ['home', 'dashboard', 'about', 'team'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function fetchLatestData() {
    const { data } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0) setLatestData(data[0]);
  }

  async function fetchHistoricalData() {
    const { data } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20); // Reduced for cleaner chart
    if (data) {
      const formattedData = data.reverse().map(item => ({
        time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        PM1: item.pm1_0,
        PM2_5: item.pm2_5,
        PM10: item.pm10
      }));
      setHistoricalData(formattedData);
    }
  }

  function getAQIStatus(pm25) {
    if (pm25 <= 12) return { text: 'Pristine', color: 'text-green-400', bg: 'from-green-500/20 to-green-900/20', desc: 'Perfect for outdoor activities.' };
    if (pm25 <= 35) return { text: 'Moderate', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-900/20', desc: 'Acceptable air quality.' };
    if (pm25 <= 55) return { text: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-900/20', desc: 'Sensitive groups should reduce outdoor exertion.' };
    if (pm25 <= 150) return { text: 'Unhealthy', color: 'text-red-400', bg: 'from-red-500/20 to-red-900/20', desc: 'Everyone may begin to experience health effects.' };
    return { text: 'Hazardous', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-900/20', desc: 'Health warnings of emergency conditions.' };
  }

  const status = latestData ? getAQIStatus(latestData.pm2_5) : { text: '--', color: 'text-gray-400', bg: 'from-gray-800 to-gray-900', desc: 'Loading data...' };

  return (
    <div className="bg-[#0a0a0a] text-white font-sans min-h-screen selection:bg-green-500/30 overflow-x-hidden">
      <ParticleBackground />
      <ParallaxNature />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LeafIcon className="w-6 h-6 text-green-400 animate-sway" />
            <span className="text-xl font-bold tracking-tight">Vayu<span className="text-green-400">Kavach</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/80">
            {['Home', 'Dashboard', 'About', 'Team'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`transition-colors hover:text-green-400 ${activeSection === item.toLowerCase() ? 'text-green-400' : ''}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#112211] to-[#0a0a0a] z-0" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="reveal-up animation-delay-100 mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium tracking-wide backdrop-blur-sm">
              LIVE AIR QUALITY MONITORING
            </span>
          </div>
          <h1 className="reveal-up animation-delay-200 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
            Breathe <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Pure.</span> <br />
            Live <span className="text-white">Better.</span>
          </h1>
          <p className="reveal-up animation-delay-300 text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Advanced real-time environmental sensing powered by ESP32 technology. 
            Invisible data made visible for a healthier tomorrow.
          </p>
          <div className="reveal-up animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#dashboard" className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transform hover:-translate-y-1">
              View Live Dashboard
            </a>
            <a href="#about" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all backdrop-blur-md">
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Live Dashboard Section */}
      <section id="dashboard" className="min-h-screen py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Live Atmosphere</h2>
              <p className="text-gray-400">Real-time particulate matter analysis from your sensor.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 md:mt-0 glass-panel px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Updating every 30s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Status Card - Large */}
            <div className={`col-span-1 md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br ${status.bg} border-0`}>
              <div className="relative z-10">
                <div className="text-sm uppercase tracking-wider opacity-70 mb-1">Air Quality Index</div>
                <div className={`text-4xl md:text-5xl font-bold mb-4 ${status.color} text-glow`}>{status.text}</div>
                <p className="text-lg opacity-90 max-w-md">{status.desc}</p>
              </div>
              <CloudIcon className="absolute top-0 right-0 w-64 h-64 text-white/5 -translate-y-12 translate-x-12 animate-float" />
            </div>

            {/* PM2.5 Card */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-400">PM2.5</div>
                <div className="p-2 rounded-full bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">{latestData ? latestData.pm2_5.toFixed(1) : '--'}</div>
                <div className="text-xs text-gray-500">Fine Particles (µg/m³)</div>
              </div>
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${Math.min(((latestData?.pm2_5 || 0) / 100) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* PM10 Card */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-400">PM10</div>
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">{latestData ? latestData.pm10.toFixed(1) : '--'}</div>
                <div className="text-xs text-gray-500">Coarse Particles (µg/m³)</div>
              </div>
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(((latestData?.pm10 || 0) / 100) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full" />
              Historical Trends
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPM1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="PM2_5" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorPM25)" />
                  <Area type="monotone" dataKey="PM1" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPM1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* About / How it Works Section */}
      <section id="about" className="py-24 relative bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-green-900/20 to-black border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                   <LeafIcon className="w-48 h-48 text-green-500/10 animate-float" />
                </div>
                {/* Simulated Device Visualization */}
                <div className="absolute inset-x-10 bottom-10 top-20 bg-black/40 backdrop-blur-xl rounded-t-2xl border-t border-l border-r border-white/10 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                  </div>
                  <div className="space-y-3">
                     <div className="h-2 w-full bg-white/5 rounded-full" />
                     <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                     <div className="h-2 w-5/6 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Invisible Threats, <br/><span className="text-green-400">Visibly Managed.</span></h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We believe that clean air is a fundamental right. VayuKavach combines industrial-grade laser sensors with modern cloud connectivity to give you a complete picture of your environmental health.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-400 font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">Laser Scattering Technology</h4>
                    <p className="text-gray-500">The PM7003 sensor detects particles as small as 0.3 micrometers suspended in the air.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">Real-time Transmission</h4>
                    <p className="text-gray-500">Data is processed by ESP32 and beamed securely to our Supabase cloud infrastructure.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">Instant Visualization</h4>
                    <p className="text-gray-500">Monitor trends, get alerts, and take action to protect your lungs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">The Minds Behind VayuKavach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {/* Team Member 1 */}
             <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-700 to-green-600 mx-auto mb-4 border-2 border-white/10" />
                <h3 className="text-lg font-semibold">Aryan Kumar Bhargava</h3>
                <p className="text-green-400 text-xs uppercase tracking-wider mb-2 font-bold">Web & ESP32 Lead</p>
                <p className="text-gray-400 text-sm leading-relaxed">Handling full-stack website development and ESP32 firmware integration.</p>
             </div>
             
             {/* Team Member 2 */}
             <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 to-blue-600 mx-auto mb-4 border-2 border-white/10" />
                <h3 className="text-lg font-semibold">Tejaswa Rana</h3>
                <p className="text-blue-400 text-xs uppercase tracking-wider mb-2 font-bold">Hardware Specialist</p>
                <p className="text-gray-400 text-sm leading-relaxed">Expert in sensor calibration, hardware configuration, and circuit design.</p>
             </div>

             {/* Team Member 3 */}
             <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-purple-600 mx-auto mb-4 border-2 border-white/10" />
                <h3 className="text-lg font-semibold">Vansh Shrivastav</h3>
                <p className="text-purple-400 text-xs uppercase tracking-wider mb-2 font-bold">Innovation Lead</p>
                <p className="text-gray-400 text-sm leading-relaxed">Driving project ideation and overseeing practical hardware implementation.</p>
             </div>

             {/* Team Member 4 */}
             <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-700 to-orange-600 mx-auto mb-4 border-2 border-white/10" />
                <h3 className="text-lg font-semibold">Yuvraj Yadav</h3>
                <p className="text-orange-400 text-xs uppercase tracking-wider mb-2 font-bold">Design Expert</p>
                <p className="text-gray-400 text-sm leading-relaxed">Crafting the visual identity and ensuring an intuitive user experience.</p>
             </div>

             {/* Team Member 5 */}
             <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-700 to-pink-600 mx-auto mb-4 border-2 border-white/10" />
                <h3 className="text-lg font-semibold">Vansh Trivedi</h3>
                <p className="text-pink-400 text-xs uppercase tracking-wider mb-2 font-bold">Comm & Hardware</p>
                <p className="text-gray-400 text-sm leading-relaxed">Managing communications and assisting with hardware assembly.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Join the Movement</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Interested in deploying VayuKavach in your community? We are looking for partners to expand our sensing network.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <a href="mailto:contact@vayukavach.io" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               Contact Team
             </a>
             <a href="#" className="px-8 py-4 glass-card rounded-full font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               GitHub
             </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
           <LeafIcon className="w-4 h-4 text-green-800" />
           <span>VayuKavach Project</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Environmental Monitoring Initiative. All rights reserved.</p>
      </footer>
    </div>
  );
}
