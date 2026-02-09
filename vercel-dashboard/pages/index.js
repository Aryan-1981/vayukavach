

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

const EarthIcon = ({ className, style }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <circle cx="50" cy="50" r="40" fill="url(#earthGradient)" opacity="0.9"/>
    <defs>
      <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
        <stop offset="50%" stopColor="#059669" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#047857" stopOpacity="0.4"/>
      </linearGradient>
    </defs>
    <path d="M30,25 Q35,30 40,25 T50,20 T60,25" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M20,45 Q30,40 40,45 T60,40 T80,45" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M25,65 Q40,60 55,65 T75,60" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6"/>
    <circle cx="35" cy="35" r="3" fill="#22c55e" opacity="0.7"/>
    <circle cx="65" cy="55" r="4" fill="#22c55e" opacity="0.7"/>
    <circle cx="50" cy="70" r="2" fill="#22c55e" opacity="0.7"/>
  </svg>
);

const VehicleIcon = ({ className, style }) => (
  <svg viewBox="0 0 200 120" className={className} style={style}>
    {/* Vehicle Body */}
    <rect x="20" y="60" width="160" height="40" rx="8" fill="currentColor" opacity="0.3"/>
    <rect x="40" y="50" width="120" height="30" rx="6" fill="currentColor" opacity="0.4"/>
    {/* Windows */}
    <rect x="50" y="55" width="35" height="20" rx="3" fill="currentColor" opacity="0.2"/>
    <rect x="115" y="55" width="35" height="20" rx="3" fill="currentColor" opacity="0.2"/>
    {/* Wheels */}
    <circle cx="50" cy="100" r="12" fill="currentColor" opacity="0.5"/>
    <circle cx="150" cy="100" r="12" fill="currentColor" opacity="0.5"/>
    {/* Rooftop Purifier Unit */}
    <rect x="70" y="35" width="60" height="20" rx="4" fill="#22c55e" opacity="0.6" className="pulse-glow"/>
    <circle cx="100" cy="32" r="3" fill="#22c55e" className="animate-pulse"/>
  </svg>
);

const AirFlowIcon = ({ className, direction = "in" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <g opacity={direction === "in" ? "0.4" : "0.8"}>
      <circle cx="20" cy="50" r="3" fill={direction === "in" ? "#ef4444" : "#22c55e"}>
        <animate attributeName="cx" from="20" to="80" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="10" cy="50" r="3" fill={direction === "in" ? "#ef4444" : "#22c55e"}>
        <animate attributeName="cx" from="10" to="70" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="30" cy="50" r="3" fill={direction === "in" ? "#ef4444" : "#22c55e"}>
        <animate attributeName="cx" from="30" to="90" dur="2s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
    </g>
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

// --- Team Member Card Component with Image, Lazy Load, and Social Icons ---
const TeamMemberCard = ({ 
  name, 
  role, 
  roleColor, 
  description, 
  imagePath, 
  gradientFrom, 
  gradientTo,
  social = {},
  delay = '',
  isVisible = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <div className={`team-card glass-card p-6 rounded-3xl relative group ${isVisible ? `team-card-reveal ${delay}` : 'opacity-0'}`}>
      {/* Profile Image Container */}
      <div className="relative mb-4 mx-auto w-24 h-24">
        {/* Gradient Fallback or Loading State */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${gradientFrom} ${gradientTo} border-2 border-white/10 ${imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
        
        {/* Actual Profile Image */}
        <img
          ref={imageRef}
          data-src={imagePath}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`team-profile-image absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/20 ${imageLoaded && !imageError ? 'opacity-100 lazy-loaded' : 'opacity-0'}`}
        />

        {/* Hover Overlay with Social Icons */}
        <div className="social-overlay absolute inset-0 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center gap-2">
          {social.github && (
            <a 
              href={social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:text-green-400 transition-all"
              aria-label={`${name} GitHub`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {social.linkedin && (
            <a 
              href={social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon w-8 h-8 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center text-white transition-all"
              aria-label={`${name} LinkedIn`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {social.twitter && (
            <a 
              href={social.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon w-8 h-8 rounded-full bg-white/10 hover:bg-blue-400 flex items-center justify-center text-white transition-all"
              aria-label={`${name} Twitter`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Member Info */}
      <h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
      <div className={`role-badge inline-block px-3 py-1 rounded-full ${roleColor} text-xs uppercase tracking-wider mb-3 font-bold bg-white/5`}>
        {role}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">
        {/* Highlight institutional affiliation */}
        {description.split('.').map((sentence, index) => {
          const trimmed = sentence.trim();
          if (!trimmed) return null;
          
          // Check if this sentence contains institutional info
          const isInstitutional = trimmed.includes('UG Student') || 
                                   trimmed.includes('Assistant Professor') || 
                                   trimmed.includes('Associate Professor') ||
                                   trimmed.includes('CIoT') ||
                                   trimmed.includes('MITS Gwalior');
          
          return (
            <span key={index}>
              {isInstitutional ? (
                <span className="text-white font-semibold bg-gradient-to-r from-green-400/10 to-cyan-400/10 px-1.5 py-0.5 rounded">
                  {trimmed}
                </span>
              ) : (
                trimmed
              )}
              {index < description.split('.').length - 2 && '. '}
            </span>
          );
        })}
      </p>

      {/* Decorative Gradient Border Effect on Hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-transparent group-hover:to-green-500/5 transition-all duration-500 pointer-events-none" />
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
  const [aqiCount, setAqiCount] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

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
      const sections = ['home', 'problem', 'dashboard', 'system', 'impact', 'future', 'about', 'team', 'contact'];
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

  // Smooth counter animation for AQI
  useEffect(() => {
    if (latestData && latestData.pm2_5) {
      const target = Math.round(latestData.pm2_5);
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setAqiCount(Math.round(easeOut * target));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [latestData]);

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
            {['Home', 'Problem', 'Dashboard', 'System', 'Impact', 'Future', 'About', 'Team', 'Contact'].map((item) => (
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

        {/* Rotating Earth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <EarthIcon className="w-[600px] h-[600px] text-green-500 rotate-earth" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="reveal-up animation-delay-100 mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium tracking-wide backdrop-blur-sm">
              SMART ROOFTOP AIR PURIFICATION
            </span>
          </div>
          <h1 className="reveal-up animation-delay-200 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Purifying Air <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">On The Move</span>
          </h1>
          <p className="reveal-up animation-delay-300 text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            A rooftop-mounted air purification system for urban vehicles. 
            Actively cleans polluted air while driving, verified by real-time PM7003 sensor readings.
          </p>
          
          {/* Vehicle with Purifier Visualization */}
          <div className="reveal-up animation-delay-350 mb-10 relative">
            <div className="flex items-center justify-center gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <AirFlowIcon className="w-20 h-20 mx-auto mb-2" direction="in" />
                <span className="text-red-400 text-sm font-medium">Polluted Air In</span>
              </div>
              
              <VehicleIcon className="w-64 h-40 text-white" />
              
              <div className="text-center">
                <AirFlowIcon className="w-20 h-20 mx-auto mb-2" direction="out" />
                <span className="text-green-400 text-sm font-medium">Clean Air Out</span>
              </div>
            </div>
          </div>
          <div className="reveal-up animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#dashboard" className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transform hover:-translate-y-1 btn-float">
              View Live Performance
            </a>
            <a href="#system" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all backdrop-blur-md btn-float">
              How It Works
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

      {/* USP Banner Section */}
      <section className={`py-20 relative bg-[#0a0a0a] border-y border-white/5 ${visibleSections.usp ? 'scroll-reveal-fast' : ''}`} id="usp">
        <div className="max-w-6xl mx-auto px-6">
          <div className="usp-banner bg-gradient-to-r from-black/60 via-green-950/20 to-black/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-green-500/20">
            <div className="flex items-start gap-6">
              <div className="hidden md:block flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-green-400 mb-3 font-semibold">What Makes Us Different</div>
                <p className="usp-text text-gray-200">
                  Unlike traditional air monitoring systems, VayuKavach <span className="usp-highlight">actively purifies outdoor air</span> in real-time as vehicles move through the city, and <span className="usp-highlight">verifies performance</span> using PM7003 sensor data—delivering proven results, not just observations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Urban Vehicle Pollution */}
      <section id="problem" className={`min-h-screen py-24 relative problem-bg ${visibleSections.problem ? 'scroll-reveal' : ''}`}>
        {/* Animated Floating Shapes */}
        <div className="abstract-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.problem ? 'scroll-reveal-fast' : ''}`}>
            <span className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-6">
              THE URBAN CHALLENGE
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Vehicles: From <span className="text-red-400">Polluters</span> to <span className="text-green-400">Purifiers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Urban vehicles contribute <span className="text-red-400 font-bold">72%</span> of city air pollution. 
              What if every vehicle could actively clean the air instead of just polluting it?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem Card 1 */}
            <div className={`glass-card p-8 rounded-3xl card-lift ${visibleSections.problem ? 'scroll-reveal-delay-1' : ''}`}>
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 mx-auto pulse-glow">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Traffic Exhaust Zones</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Drivers and passengers breathe concentrated pollution directly from surrounding vehicles and traffic jams.
              </p>
            </div>

            {/* Problem Card 2 */}
            <div className={`glass-card p-8 rounded-3xl card-lift ${visibleSections.problem ? 'scroll-reveal-delay-2' : ''}`}>
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 mx-auto pulse-glow">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Passive Air Intake</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Standard vehicle ventilation systems simply circulate polluted air without any filtration or purification.
              </p>
            </div>

            {/* Problem Card 3 */}
            <div className={`glass-card p-8 rounded-3xl card-lift ${visibleSections.problem ? 'scroll-reveal-delay-3' : ''}`}>
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 mx-auto pulse-glow">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Wasted Rooftop Space</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Vehicle rooftops remain unused—perfect real estate for active air purification technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purification Performance Section */}
      <section id="dashboard" className={`min-h-screen py-24 relative dashboard-enhanced-bg data-section-calm ${visibleSections.dashboard ? 'scroll-reveal' : ''}`}>
        {/* Airflow Wave Lines */}
        <div className="airflow-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        <div className="mesh-gradient"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex flex-col md:flex-row justify-between items-end mb-12 ${visibleSections.dashboard ? 'scroll-reveal-fast' : ''}`}>
            <div>
              <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4">
                LIVE FROM PM7003 SENSOR
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Purification Performance</h2>
              <p className="text-gray-400">Real-time measurement from sensor at purifier outlet showing cleaned air quality.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 md:mt-0 glass-panel px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live sensor data • Updates every 30s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Status Card - Large with Animated Counter */}
            <div className={`col-span-1 md:col-span-2 lg:col-span-2 data-card-calm rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br ${status.bg} border-0 card-lift ${visibleSections.dashboard ? 'scroll-reveal-delay-1' : ''}`}>
              <div className="relative z-10">
                <div className="text-sm uppercase tracking-wider opacity-70 mb-1">Output Air Quality (After Purification)</div>
                <div className={`text-6xl md:text-7xl font-bold mb-2 ${status.color} text-glow-calm count-up`}>
                  {aqiCount}
                </div>
                <div className={`text-3xl md:text-4xl font-bold mb-4 ${status.color}`}>{status.text}</div>
                <p className="text-lg opacity-90 max-w-md">{status.desc}</p>
                <div className="mt-4 text-xs text-gray-500">
                  📍 Measured by PM7003 at purifier outlet
                </div>
              </div>
              <CloudIcon className="absolute top-0 right-0 w-64 h-64 text-white/5 -translate-y-12 translate-x-12 animate-float" />
            </div>

            {/* PM2.5 Card - After Purification */}
            <div className={`data-card-calm rounded-3xl p-6 flex flex-col justify-between group card-lift ${visibleSections.dashboard ? 'scroll-reveal-delay-2' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-400">PM2.5 (After)</div>
                <div className="p-2 rounded-full bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">{latestData ? latestData.pm2_5.toFixed(1) : '--'}</div>
                <div className="text-xs text-gray-500">Fine Particles (µg/m³)</div>
                <div className="text-xs text-green-400 mt-1">✓ Purified</div>
              </div>
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${Math.min(((latestData?.pm2_5 || 0) / 100) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* PM10 Card - After Purification */}
            <div className={`data-card-calm rounded-3xl p-6 flex flex-col justify-between group card-lift ${visibleSections.dashboard ? 'scroll-reveal-delay-3' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-400">PM10 (After)</div>
                <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">{latestData ? latestData.pm10.toFixed(1) : '--'}</div>
                <div className="text-xs text-gray-500">Coarse Particles (µg/m³)</div>
                <div className="text-xs text-cyan-400 mt-1">✓ Purified</div>
              </div>
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${Math.min(((latestData?.pm10 || 0) / 100) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className={`data-card-calm rounded-3xl p-6 md:p-8 ${visibleSections.dashboard ? 'scroll-reveal-delay-4' : ''}`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full" />
              Purification Trends (Output Air Quality Over Time)
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', border: '1px solid #222', borderRadius: '12px' }}
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

      {/* How The System Works Section */}
      <section id="system" className={`py-24 relative system-bg ${visibleSections.system ? 'scroll-reveal' : ''}`}>
        {/* Animated Floating Shapes */}
        <div className="abstract-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="mesh-gradient"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-6">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How It <span className="text-cyan-400">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A complete air purification cycle from intake to verified clean output
            </p>
          </div>

          {/* Vertical Flow Diagram */}
          <div className="max-w-2xl mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-blue-500 via-purple-500 via-green-500 to-cyan-500 opacity-30 hidden md:block" style={{ transform: 'translateX(-50%)' }}></div>

            {/* Step 1 - Polluted Air In */}
            <div className="relative mb-8">
              <div className="glass-card p-8 rounded-3xl card-lift group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">1. Polluted Air In</h4>
                    <p className="text-gray-400">Rooftop intake pulls surrounding urban air with PM2.5 and PM10 particles</p>
                  </div>
                </div>
              </div>
              {/* Downward Arrow */}
              <div className="flex justify-center my-4">
                <svg className="w-8 h-8 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 2 - Filtration */}
            <div className="relative mb-8">
              <div className="glass-card p-8 rounded-3xl card-lift group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">2. Filtration</h4>
                    <p className="text-gray-400">Multi-layer HEPA filters + activated carbon remove harmful particles</p>
                  </div>
                </div>
              </div>
              {/* Downward Arrow */}
              <div className="flex justify-center my-4">
                <svg className="w-8 h-8 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" style={{ animationDelay: '0.1s' }}>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 3 - Blower Fan */}
            <div className="relative mb-8">
              <div className="glass-card p-8 rounded-3xl card-lift group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">3. Blower Fan</h4>
                    <p className="text-gray-400">12V DC motor maintains continuous airflow through the system</p>
                  </div>
                </div>
              </div>
              {/* Downward Arrow */}
              <div className="flex justify-center my-4">
                <svg className="w-8 h-8 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" style={{ animationDelay: '0.2s' }}>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 4 - Clean Air Out */}
            <div className="relative mb-8">
              <div className="glass-card p-8 rounded-3xl card-lift group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform pulse-glow relative z-10">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">4. Clean Air Out</h4>
                    <p className="text-gray-400">Purified air exits through the outlet, significantly cleaner</p>
                  </div>
                </div>
              </div>
              {/* Downward Arrow */}
              <div className="flex justify-center my-4">
                <svg className="w-8 h-8 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" style={{ animationDelay: '0.3s' }}>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 5 - PM7003 Sensor */}
            <div className="relative mb-8">
              <div className="glass-card p-8 rounded-3xl card-lift group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">5. PM7003 Sensor</h4>
                    <p className="text-gray-400">Laser sensor verifies output air quality and measures purification effectiveness</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ESP32 & Cloud Connection */}
            <div className="mt-12 text-center">
              <div className="glass-card p-6 rounded-2xl inline-block">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-sm font-medium">ESP32 sends verified data to cloud (Supabase) → <span className="text-cyan-400">Live Website Dashboard</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="impact" className={`py-24 relative impact-bg ${visibleSections.impact ? 'scroll-reveal' : ''}`}>
        {/* Airflow Wave Lines */}
        <div className="airflow-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
        </div>
        <div className="mesh-gradient"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.impact ? 'scroll-reveal-fast' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why It <span className="text-green-400">Matters</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hardware-driven purification with real-time proof of performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Impact 1: Active Purification */}
            <div className="glass-card p-8 rounded-3xl text-center feature-card-hover group">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative animate-periodic-pulse">
                {/* Circular airflow particles */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                  {/* Particle 1 */}
                  <g className="animate-airflow-particle" style={{ transformOrigin: '40px 40px' }}>
                    <circle cx="40" cy="15" r="2.5" fill="#22c55e" opacity="0.8">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                  {/* Particle 2 */}
                  <g className="animate-airflow-particle-delayed-1" style={{ transformOrigin: '40px 40px' }}>
                    <circle cx="40" cy="15" r="2" fill="#34d399" opacity="0.7">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                  {/* Particle 3 */}
                  <g className="animate-airflow-particle-delayed-2" style={{ transformOrigin: '40px 40px' }}>
                    <circle cx="40" cy="15" r="2.5" fill="#10b981" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                  {/* Particle 4 */}
                  <g className="animate-airflow-particle-delayed-3" style={{ transformOrigin: '40px 40px' }}>
                    <circle cx="40" cy="15" r="2" fill="#6ee7b7" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                </svg>
                <svg className="w-10 h-10 text-green-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Active Purification</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                HEPA filters running <span className="text-green-400 font-bold">24/7</span> actively cleaning air, not just monitoring it
              </p>
              <div className="text-4xl font-bold text-green-400 count-up">24/7</div>
            </div>

            {/* Impact 2: Smart Urban Impact */}
            <div className="glass-card p-8 rounded-3xl text-center feature-card-hover group animate-urban-move">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative overflow-visible">
                {/* Enhanced animated air flow particles - pollution entering and fading */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 80 80">
                  {/* Particle entering from left, shrinking and fading */}
                  <circle cx="15" cy="40" r="2.5" fill="#ef4444" opacity="0.8">
                    <animate attributeName="cx" values="15;25;40;55;70" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="2.5;2.2;1.5;1;0.5" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.7;0.4;0.2;0" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="fill" values="#ef4444;#f87171;#3b82f6;#60a5fa;#93c5fd" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="10" cy="30" r="2" fill="#f87171" opacity="0.7">
                    <animate attributeName="cx" values="10;20;35;50;65" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="r" values="2;1.8;1.2;0.8;0.4" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="opacity" values="0.7;0.6;0.3;0.15;0" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="fill" values="#f87171;#fca5a5;#3b82f6;#60a5fa;#93c5fd" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                  </circle>
                  <circle cx="12" cy="50" r="2.2" fill="#dc2626" opacity="0.75">
                    <animate attributeName="cx" values="12;22;37;52;67" dur="3.2s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="r" values="2.2;2;1.4;0.9;0.4" dur="3.2s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="opacity" values="0.75;0.65;0.35;0.18;0" dur="3.2s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="fill" values="#dc2626;#f87171;#3b82f6;#60a5fa;#93c5fd" dur="3.2s" repeatCount="indefinite" begin="1s"/>
                  </circle>
                  <circle cx="8" cy="45" r="1.8" fill="#fca5a5" opacity="0.6">
                    <animate attributeName="cx" values="8;18;33;48;63" dur="3.8s" repeatCount="indefinite" begin="1.5s"/>
                    <animate attributeName="r" values="1.8;1.6;1.1;0.7;0.3" dur="3.8s" repeatCount="indefinite" begin="1.5s"/>
                    <animate attributeName="opacity" values="0.6;0.5;0.25;0.12;0" dur="3.8s" repeatCount="indefinite" begin="1.5s"/>
                    <animate attributeName="fill" values="#fca5a5;#fecaca;#60a5fa;#93c5fd;#bfdbfe" dur="3.8s" repeatCount="indefinite" begin="1.5s"/>
                  </circle>
                </svg>
                <svg className="w-10 h-10 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-3.018A9 9 0 1112 21a9 9 0 01-8.018-12.982" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Urban Impact</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Each rooftop-mounted purifier <span className="text-blue-400 font-bold">actively cleans outdoor urban air</span> as the vehicle moves through the city
              </p>
              <div className="text-2xl font-bold text-blue-400">Moving Air Purifier</div>
            </div>

            {/* Impact 3: Verified Results */}
            <div className="glass-card p-8 rounded-3xl text-center feature-card-hover group">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative">
                {/* Animated chart bars representing live sensor data */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                  <g transform="translate(20, 50)">
                    {/* Bar 1 */}
                    <rect x="5" y="0" width="8" rx="2" fill="#a855f7" opacity="0.7" className="animate-chart-bar-1">
                      <animate attributeName="height" values="12;24;18;28;12" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="18;6;12;2;18" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.7;1;0.8;1;0.7" dur="3s" repeatCount="indefinite"/>
                    </rect>
                    {/* Bar 2 */}
                    <rect x="17" y="0" width="8" rx="2" fill="#c084fc" opacity="0.8" className="animate-chart-bar-2">
                      <animate attributeName="height" values="20;14;30;22;20" dur="3s" repeatCount="indefinite" begin="0.3s"/>
                      <animate attributeName="y" values="10;16;0;8;10" dur="3s" repeatCount="indefinite" begin="0.3s"/>
                      <animate attributeName="opacity" values="0.8;0.7;1;0.9;0.8" dur="3s" repeatCount="indefinite" begin="0.3s"/>
                    </rect>
                    {/* Bar 3 */}
                    <rect x="29" y="0" width="8" rx="2" fill="#d8b4fe" opacity="1" className="animate-chart-bar-3">
                      <animate attributeName="height" values="26;20;16;32;26" dur="3s" repeatCount="indefinite" begin="0.6s"/>
                      <animate attributeName="y" values="4;10;14;-2;4" dur="3s" repeatCount="indefinite" begin="0.6s"/>
                      <animate attributeName="opacity" values="1;0.8;0.7;1;1" dur="3s" repeatCount="indefinite" begin="0.6s"/>
                    </rect>
                  </g>
                </svg>
                <svg className="w-10 h-10 text-purple-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Verified Results</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                <span className="text-purple-400 font-bold">100% real-time proof</span> via PM7003 sensor—no guesswork, just data
              </p>
              <div className="text-4xl font-bold text-purple-400 animate-count-up">100%</div>
            </div>

            {/* Impact 4: Scalable Network */}
            <div className="glass-card p-8 rounded-3xl text-center feature-card-hover group">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative overflow-visible">
                {/* Network dots spreading outward with connecting lines */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 80 80">
                  {/* Center hub */}
                  <circle cx="40" cy="40" r="3" fill="#fb923c" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Network nodes spreading out */}
                  {/* Node 1 - Top */}
                  <circle cx="40" cy="40" r="2" fill="#fdba74" className="animate-network-dot" style={{ '--spread-x': '0px', '--spread-y': '-25px' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  {/* Node 2 - Top Right */}
                  <circle cx="40" cy="40" r="2" fill="#fb923c" className="animate-network-dot" style={{ '--spread-x': '18px', '--spread-y': '-18px', animationDelay: '0.5s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="0.5s"/>
                  </circle>
                  {/* Node 3 - Right */}
                  <circle cx="40" cy="40" r="2" fill="#fdba74" className="animate-network-dot" style={{ '--spread-x': '25px', '--spread-y': '0px', animationDelay: '1s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="1s"/>
                  </circle>
                  {/* Node 4 - Bottom Right */}
                  <circle cx="40" cy="40" r="2" fill="#fb923c" className="animate-network-dot" style={{ '--spread-x': '18px', '--spread-y': '18px', animationDelay: '1.5s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="1.5s"/>
                  </circle>
                  {/* Node 5 - Bottom */}
                  <circle cx="40" cy="40" r="2" fill="#fdba74" className="animate-network-dot" style={{ '--spread-x': '0px', '--spread-y': '25px', animationDelay: '2s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="2s"/>
                  </circle>
                  {/* Node 6 - Bottom Left */}
                  <circle cx="40" cy="40" r="2" fill="#fb923c" className="animate-network-dot" style={{ '--spread-x': '-18px', '--spread-y': '18px', animationDelay: '2.5s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="2.5s"/>
                  </circle>
                  {/* Node 7 - Left */}
                  <circle cx="40" cy="40" r="2" fill="#fdba74" className="animate-network-dot" style={{ '--spread-x': '-25px', '--spread-y': '0px', animationDelay: '3s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="3s"/>
                  </circle>
                  {/* Node 8 - Top Left */}
                  <circle cx="40" cy="40" r="2" fill="#fb923c" className="animate-network-dot" style={{ '--spread-x': '-18px', '--spread-y': '-18px', animationDelay: '3.5s' }}>
                    <animate attributeName="r" values="0;2;1.5;1" dur="4s" repeatCount="indefinite" begin="3.5s"/>
                  </circle>

                  {/* Connection lines */}
                  <line x1="40" y1="40" x2="40" y2="15" stroke="#fb923c" strokeWidth="1" className="animate-network-line" opacity="0.4"/>
                  <line x1="40" y1="40" x2="58" y2="22" stroke="#fb923c" strokeWidth="1" className="animate-network-line" opacity="0.4" style={{ animationDelay: '0.5s' }}/>
                  <line x1="40" y1="40" x2="65" y2="40" stroke="#fb923c" strokeWidth="1" className="animate-network-line" opacity="0.4" style={{ animationDelay: '1s' }}/>
                  <line x1="40" y1="40" x2="58" y2="58" stroke="#fb923c" strokeWidth="1" className="animate-network-line" opacity="0.4" style={{ animationDelay: '1.5s' }}/>
                </svg>
                <svg className="w-10 h-10 text-orange-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Scalable Network</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Deployable across <span className="text-orange-400 font-bold">entire vehicle fleets</span> to create city-wide purification
              </p>
              <div className="text-4xl font-bold text-orange-400 count-up">∞</div>
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

      {/* Smart City Vision Section */}
      <section id="future" className="py-24 relative future-bg overflow-hidden">
        {/* Animated Floating Shapes */}
        <div className="abstract-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="mesh-gradient"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-6">
              COMING SOON
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Smart City Air <span className="text-cyan-400">Network</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Imagine a city where every rooftop monitors air quality in real-time. 
              VayuKavach is building the foundation for intelligent, breathable urban spaces.
            </p>
          </div>

          {/* City Map Visualization */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 p-8 backdrop-blur-sm relative overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
              </div>

              {/* Buildings/Sensor Points */}
              <div className="relative h-full flex items-end justify-around px-8">
                {/* Building 1 */}
                <div className="flex flex-col items-center animate-grow" style={{ animationDelay: '0.2s' }}>
                  <div className="w-3 h-3 rounded-full bg-green-500 pulse-glow mb-2"></div>
                  <div className="w-16 h-32 bg-gradient-to-t from-green-500/20 to-green-500/5 rounded-t-lg border border-green-500/30"></div>
                  <div className="text-xs text-green-400 mt-2">Good</div>
                </div>

                {/* Building 2 */}
                <div className="flex flex-col items-center animate-grow" style={{ animationDelay: '0.4s' }}>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 pulse-glow mb-2"></div>
                  <div className="w-20 h-48 bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 rounded-t-lg border border-yellow-500/30"></div>
                  <div className="text-xs text-yellow-400 mt-2">Moderate</div>
                </div>

                {/* Building 3 */}
                <div className="flex flex-col items-center animate-grow" style={{ animationDelay: '0.6s' }}>
                  <div className="w-3 h-3 rounded-full bg-green-500 pulse-glow mb-2"></div>
                  <div className="w-16 h-40 bg-gradient-to-t from-green-500/20 to-green-500/5 rounded-t-lg border border-green-500/30"></div>
                  <div className="text-xs text-green-400 mt-2">Good</div>
                </div>

                {/* Building 4 */}
                <div className="flex flex-col items-center animate-grow" style={{ animationDelay: '0.8s' }}>
                  <div className="w-3 h-3 rounded-full bg-orange-500 pulse-glow mb-2"></div>
                  <div className="w-24 h-56 bg-gradient-to-t from-orange-500/20 to-orange-500/5 rounded-t-lg border border-orange-500/30"></div>
                  <div className="text-xs text-orange-400 mt-2">Sensitive</div>
                </div>

                {/* Building 5 */}
                <div className="flex flex-col items-center animate-grow" style={{ animationDelay: '1s' }}>
                  <div className="w-3 h-3 rounded-full bg-green-500 pulse-glow mb-2"></div>
                  <div className="w-16 h-36 bg-gradient-to-t from-green-500/20 to-green-500/5 rounded-t-lg border border-green-500/30"></div>
                  <div className="text-xs text-green-400 mt-2">Good</div>
                </div>
              </div>

              {/* Network Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <line x1="20%" y1="50%" x2="40%" y2="40%" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="2" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                </line>
                <line x1="40%" y1="40%" x2="60%" y2="45%" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="2" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                </line>
                <line x1="60%" y1="45%" x2="80%" y2="35%" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="2" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                </line>
              </svg>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">100+</div>
                <div className="text-sm text-gray-400">Sensors Planned</div>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">Real-time</div>
                <div className="text-sm text-gray-400">Data Updates</div>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">AI-Driven</div>
                <div className="text-sm text-gray-400">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className={`py-24 relative overflow-hidden ${visibleSections.team ? 'scroll-reveal' : ''}`}>
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f1f0f] to-[#0a0a0a] pointer-events-none opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-6">
              OUR TEAM
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Minds Behind <span className="text-green-400">VayuKavach</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A passionate team of innovators dedicated to creating a cleaner, healthier future through smart environmental technology.
            </p>
          </div>

          {/* Mentors Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                Academic <span className="text-cyan-400">Mentors</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Providing expert guidance and institutional support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Mentor 1 - Dr. Praveen Bansal */}
              <TeamMemberCard
                name="Dr. Praveen Bansal"
                role="Head, CIoT"
                roleColor="text-indigo-400"
                description="Associate Professor, Centre for Internet of Things (CIoT), MITS Gwalior. Academic leadership and institutional guidance supporting the VayuKavach initiative."
                imagePath="/team/dr-praveen.jpg"
                gradientFrom="from-indigo-700"
                gradientTo="to-indigo-600"
                social={{
                  linkedin: "https://www.linkedin.com/in/dr-praveen-bansal-7711a51b2/",
                }}
                delay="team-card-reveal-delay-1"
                isVisible={visibleSections.team}
              />

              {/* Mentor 2 - Dr. Aftab Ahmed Ansari */}
              <TeamMemberCard
                name="Dr. Aftab Ahmed Ansari"
                role="Mentor & Project Guide"
                roleColor="text-cyan-400"
                description="Assistant Professor, Centre for Internet of Things (CIoT), MITS Gwalior. Providing technical guidance, system architecture direction, and research-oriented mentoring."
                imagePath="/team/dr-aftab.jpg"
                gradientFrom="from-cyan-700"
                gradientTo="to-cyan-600"
                social={{
                  linkedin: "https://www.linkedin.com/in/dr-aftab-ahmed-ansari-8b5361a4/",
                }}
                delay="team-card-reveal-delay-2"
                isVisible={visibleSections.team}
              />
            </div>
          </div>

          {/* Student Team Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Student <span className="text-green-400">Development Team</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The core team building VayuKavach from concept to reality
            </p>
          </div>

          {/* First Row - 2 Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
             {/* Team Member 1 - Aryan */}
             <TeamMemberCard
               name="Aryan Kumar Bhargava"
               role="WEB & ESP32 LEAD"
               roleColor="text-green-400"
               description="UG Student, CIoT, MITS Gwalior. Handling full-stack web development and ESP32 firmware integration."
               imagePath="/team/aryan.jpg"
               gradientFrom="from-green-700"
               gradientTo="to-green-600"
               social={{
                 github: "https://github.com/Aryan-1981",
                 linkedin: "https://www.linkedin.com/in/aryan-bhargava-a1aba9385/",
               }}
               delay="team-card-reveal-delay-3"
               isVisible={visibleSections.team}
             />
             
             {/* Team Member 2 - Tejaswa */}
             <TeamMemberCard
               name="Tejaswa Singh Rana"
               role="Hardware Specialist"
               roleColor="text-blue-400"
               description="UG Student, CIoT, MITS Gwalior. Expert in sensor calibration, hardware configuration, and circuit design."
               imagePath="/team/tejaswa.jpg"
               gradientFrom="from-blue-700"
               gradientTo="to-blue-600"
               social={{
                 github: "https://github.com/Tejaswa-Singh-Rana",
                 linkedin: "https://www.linkedin.com/in/tejaswa-singh-rana-6b74a4381/",
               }}
               delay="team-card-reveal-delay-4"
               isVisible={visibleSections.team}
             />
          </div>

          {/* Second Row - 3 Students */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {/* Team Member 3 - Vansh S */}
             <TeamMemberCard
               name="Vansh Shrivastava"
               role="Innovation Lead"
               roleColor="text-purple-400"
               description="UG Student, CIoT, MITS Gwalior. Driving project ideation and overseeing practical hardware implementation."
               imagePath="/team/vansh-s.jpg"
               gradientFrom="from-purple-700"
               gradientTo="to-purple-600"
               social={{
                 github: "https://github.com/vanshshri2007-sudo",
                 linkedin: "https://www.linkedin.com/in/vansh-shrivastava-b1b8403a1/",
               }}
               delay="team-card-reveal-delay-5"
               isVisible={visibleSections.team}
             />

             {/* Team Member 4 - Yuvraj */}
             <TeamMemberCard
               name="Yuvraj Yadav"
               role="Design Expert"
               roleColor="text-orange-400"
               description="UG Student, CIoT, MITS Gwalior. Crafting the visual identity and ensuring an intuitive user experience."
               imagePath="/team/yuvraj.jpg"
               gradientFrom="from-orange-700"
               gradientTo="to-orange-600"
               social={{
                 github: "https://github.com/yuvraj",
                 linkedin: "https://linkedin.com/in/yuvraj",
                 
               }}
               delay="team-card-reveal-delay-6"
               isVisible={visibleSections.team}
             />

             {/* Team Member 5 - Vansh T */}
             <TeamMemberCard
               name="Vansh Trivedi"
               role="Comm & Hardware"
               roleColor="text-pink-400"
               description="UG Student, CIoT, MITS Gwalior. Managing communications and assisting with hardware assembly."
               imagePath="/team/vansh-t.jpg"
               gradientFrom="from-pink-700"
               gradientTo="to-pink-600"
               social={{
                 github: "https://github.com/vansh-1140",
                 linkedin: "https://www.linkedin.com/in/vansh-trivedi-011244235/",
               }}
               delay="team-card-reveal-delay-7"
               isVisible={visibleSections.team}
             />
          </div>
        </div>
      </section>

      {/* Future Vision - Smart City Section */}
      <section id="future" className="py-24 relative bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-6">
              COMING SOON
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Smart City <span className="text-blue-400">Air Network</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Imagine a city where every rooftop monitors air quality in real-time, creating a living map of environmental health.
            </p>
          </div>

          {/* City Map Visualization */}
          <div className="relative max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                  {[...Array(96)].map((_, i) => (
                    <div key={i} className="border border-blue-500/20" />
                  ))}
                </div>
              </div>

              {/* City Skyline Silhouette */}
              <div className="relative z-10 mb-8">
                <svg viewBox="0 0 800 200" className="w-full h-32 md:h-48 text-blue-400/20">
                  <rect x="50" y="80" width="60" height="120" fill="currentColor" />
                  <rect x="130" y="60" width="80" height="140" fill="currentColor" />
                  <rect x="230" y="100" width="50" height="100" fill="currentColor" />
                  <rect x="300" y="40" width="90" height="160" fill="currentColor" />
                  <rect x="410" y="90" width="70" height="110" fill="currentColor" />
                  <rect x="500" y="70" width="60" height="130" fill="currentColor" />
                  <rect x="580" y="50" width="85" height="150" fill="currentColor" />
                  <rect x="685" y="85" width="65" height="115" fill="currentColor" />
                </svg>

                {/* Sensor Dots - Glowing Points */}
                <div className="absolute inset-0">
                  {/* Sensor 1 - Green (Good) */}
                  <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-green-500 rounded-full pulse-glow animate-pulse" />
                  <div className="absolute top-[20%] left-[15%] w-6 h-6 bg-green-500/30 rounded-full animate-ping" />
                  
                  {/* Sensor 2 - Yellow (Moderate) */}
                  <div className="absolute top-[15%] left-[30%] w-3 h-3 bg-yellow-500 rounded-full pulse-glow animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-[15%] left-[30%] w-6 h-6 bg-yellow-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  
                  {/* Sensor 3 - Green (Good) */}
                  <div className="absolute top-[30%] left-[42%] w-3 h-3 bg-green-500 rounded-full pulse-glow animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-[30%] left-[42%] w-6 h-6 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  
                  {/* Sensor 4 - Red (Poor) */}
                  <div className="absolute top-[10%] left-[55%] w-3 h-3 bg-red-500 rounded-full pulse-glow animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <div className="absolute top-[10%] left-[55%] w-6 h-6 bg-red-500/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                  
                  {/* Sensor 5 - Green (Good) */}
                  <div className="absolute top-[25%] left-[68%] w-3 h-3 bg-green-500 rounded-full pulse-glow animate-pulse" style={{ animationDelay: '2s' }} />
                  <div className="absolute top-[25%] left-[68%] w-6 h-6 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                  
                  {/* Sensor 6 - Yellow (Moderate) */}
                  <div className="absolute top-[18%] left-[82%] w-3 h-3 bg-yellow-500 rounded-full pulse-glow animate-pulse" style={{ animationDelay: '2.5s' }} />
                  <div className="absolute top-[18%] left-[82%] w-6 h-6 bg-yellow-500/30 rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2 count-up">500+</div>
                  <div className="text-gray-400">Planned Sensors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2 count-up">24/7</div>
                  <div className="text-gray-400">Real-time Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2 count-up">∞</div>
                  <div className="text-gray-400">Lives Protected</div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="glass-card p-6 rounded-2xl card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">City-Wide Coverage</h4>
                    <p className="text-gray-400">Comprehensive air quality mapping across entire metropolitan areas</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Instant Alerts</h4>
                    <p className="text-gray-400">Notify citizens when pollution levels exceed safe thresholds</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Predictive Analytics</h4>
                    <p className="text-gray-400">AI-powered forecasting of pollution patterns and trends</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Community Driven</h4>
                    <p className="text-gray-400">Empower citizens with transparent, accessible data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Get In Touch</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Interested in deploying VayuKavach in your community? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-3xl p-8 md:p-12 card-lift">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="Partnership Inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea 
                  rows="5"
                  placeholder="Tell us about your project or inquiry..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 btn-float"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Quick Contact Options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
             <a href="mailto:contact@vayukavach.io" className="px-8 py-4 glass-card rounded-full font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 btn-float">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               Email Us
             </a>
             <a href="https://github.com/Aryan-1981/vayukavach" target="_blank" rel="noopener noreferrer" className="px-8 py-4 glass-card rounded-full font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 btn-float">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               View on GitHub
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
