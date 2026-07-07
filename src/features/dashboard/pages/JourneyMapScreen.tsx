import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import { motion, AnimatePresence } from "framer-motion";

interface City {
  _id?: string;
  name: string;
  unlocked: boolean;
  landmark: string;
  fact: string;
  badge: string;
  requiredFuel: number;
}

export default function JourneyMapScreen() {
  const navigate = useNavigate();
  const [fuel, setFuel] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [username, setUsername] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapped UI cities for visual representation
  const uiCities = [
    { name: "Egg Village", emoji: "🥚", fallbackFuel: 0, reward: "Dragon Egg", rewardColor: "text-secondary-fixed" },
    { name: "Forest Kingdom", emoji: "🐉", fallbackFuel: 500, reward: "Baby Dragon", rewardColor: "text-primary" },
    { name: "Magic Desert", emoji: "🔥", fallbackFuel: 1000, reward: "Phoenix", rewardColor: "text-outline" },
    { name: "Ice Kingdom", emoji: "❄️", fallbackFuel: 2000, reward: "Ice Dragon", rewardColor: "text-outline" },
    { name: "Dragon Mountain", emoji: "🏔️", fallbackFuel: 5000, reward: "Legendary Dragon", rewardColor: "text-on-surface-variant" },
  ];

  useEffect(() => {
    const fetchJourney = async () => {
      // Fetch user data
      let userFuel = 0;
      let userXp = 0;
      let userCoins = 0;
      let userName = "Explorer";

      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const uRes = await apiFetch("/api/users/me");
          const uData = await uRes.json();
          if (uData.success) {
            userFuel = uData.data.user.fuel || 0;
            userXp = uData.data.user.xp || 1200; // default for visual
            userCoins = uData.data.user.coins || 450;
            userName = uData.data.user.name || "Explorer";
          }
        } catch (e) {}
      }
      
      // Fallback
      if (userFuel === 0) {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            userFuel = u.fuel || 0;
            userName = u.name || "Explorer";
            userXp = u.xp || 1200;
            userCoins = u.coins || 450;
          } catch(e) {}
        }
      }
      setFuel(userFuel);
      setXp(userXp);
      setCoins(userCoins);
      setUsername(userName);

      // Fetch cities
      try {
        const cRes = await apiFetch("/api/practice/cities");
        const cData = await cRes.json();
        if (cData.success && cData.data.length > 0) {
          const mapped = cData.data.map((c: any) => ({
            _id: c._id || c.id,
            name: c.name,
            landmark: c.landmark,
            fact: c.fact,
            badge: c.badge,
            requiredFuel: c.requiredFuel || 0,
            unlocked: userFuel >= (c.requiredFuel || 0)
          }));
          setCities(mapped);
        } else {
          // Fallback to static if no cities from API
          setCities(uiCities.map(c => ({
            name: c.name,
            landmark: "", fact: "", badge: "",
            requiredFuel: c.fallbackFuel,
            unlocked: userFuel >= c.fallbackFuel
          })));
        }
      } catch (e) {
        console.error("Failed to fetch cities", e);
        setCities(uiCities.map(c => ({
            name: c.name,
            landmark: "", fact: "", badge: "",
            requiredFuel: c.fallbackFuel,
            unlocked: userFuel >= c.fallbackFuel
          })));
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine Dragon Stage based on fuel
  let dragonStage = "Egg";
  let dragonImage = "/images/dragons/egg.png";
  let dragonMessage = "Keep learning to hatch your egg!";
  let dragonNextGoal = 10;
  let dragonScale = "1";

  if (fuel >= 1000) {
    dragonStage = "Elder Dragon";
    dragonImage = "/images/dragons/adult.png";
    dragonMessage = "Your dragon is legendary!";
    dragonNextGoal = 2500;
    dragonScale = "1.2";
  } else if (fuel >= 250) {
    dragonStage = "Teen Dragon";
    dragonImage = "/images/dragons/teen.png";
    dragonMessage = "Your dragon is learning to fly!";
    dragonNextGoal = 1000;
    dragonScale = "1.1";
  } else if (fuel >= 50) {
    dragonStage = "Baby Dragon";
    dragonImage = "/images/dragons/baby.png";
    dragonMessage = "Your dragon hatched! Keep feeding it fuel!";
    dragonNextGoal = 250;
    dragonScale = "1.05";
  } else if (fuel >= 10) {
    dragonStage = "Cracking Egg";
    dragonImage = "/images/dragons/cracked.png";
    dragonMessage = "It's hatching! Just a bit more fuel!";
    dragonNextGoal = 50;
    dragonScale = "1.02";
  }

  const dragonProgress = Math.min(100, Math.round((fuel / dragonNextGoal) * 100));

  return (
    <div className="bg-background text-on-surface flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-[430px] h-screen bg-surface-bright flex flex-col overflow-hidden shadow-2xl">
        
        {/* TopAppBar */}
        <header className="fixed top-0 w-full max-w-[430px] z-50 flex justify-between items-center px-4 py-4 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-lg border-b-[1.5px] border-outline-variant/30 shadow-sm gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button onClick={() => navigate('/home')} className="p-1 hover:opacity-80 transition-opacity shrink-0">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shrink-0">
              <img alt="User Profile" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}/>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-label-lg font-bold text-primary truncate">{username}</h1>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                <p className="text-[10px] font-bold text-on-surface-variant truncate">Explorer Lvl 1</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1.5 rounded-full whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-orange-500" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
              <span className="text-[11px] font-bold">{xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp} XP</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1.5 rounded-full whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>monetization_on</span>
              <span className="text-[11px] font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1.5 rounded-full whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>local_gas_station</span>
              <span className="text-[11px] font-bold">{fuel}</span>
            </div>
          </div>
        </header>

        {/* Main Map Content Area */}
        <main className="flex-1 mt-20 mb-24 overflow-y-auto no-scrollbar relative px-6 py-4">
          
          {/* Dynamic Dragon Pet Widget */}
          <div 
            onClick={() => navigate('/evolution')}
            className="bg-gradient-to-br from-primary-container to-secondary-container rounded-3xl p-5 mb-8 shadow-[0_8px_30px_rgba(0,106,98,0.2)] border border-white/40 flex flex-col items-center relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
          >
            <div className="absolute top-2 right-4 flex items-center gap-1 bg-white/40 px-2 py-1 rounded-full group-hover:bg-white/60 transition-colors">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Tap to View</span>
              <span className="material-symbols-outlined text-[12px] text-primary">open_in_new</span>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full translate-x-10 -translate-y-10"></div>
            
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-1 mt-2">My Dragon Companion</h2>
            <p className="text-xs font-bold text-on-surface-variant mb-4">{dragonMessage}</p>
            
            <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center p-2 mb-4 shadow-inner ring-4 ring-white relative z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={dragonStage}
                  src={dragonImage} 
                  alt={dragonStage} 
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ 
                    scale: fuel < 50 ? [1, 1.05, 1] : 1,
                    rotate: fuel < 50 ? [0, -5, 5, -5, 0] : 0,
                    opacity: 1 
                  }}
                  exit={{ scale: 1.5, opacity: 0, filter: "brightness(2)" }}
                  transition={{ 
                    duration: fuel < 50 ? 2 : 0.5, 
                    repeat: fuel < 50 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`w-full h-full object-cover rounded-full shadow-lg ${fuel >= 50 && fuel < 250 ? 'animate-[bounce_3s_infinite]' : ''} ${fuel >= 250 ? 'animate-[pulse_4s_infinite]' : ''}`}
                />
              </AnimatePresence>
            </div>
            
            <h3 className="text-xl font-black text-primary mb-2">{dragonStage}</h3>
            
            <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner flex mb-1">
              <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-1000" style={{width: `${dragonProgress}%`}}></div>
            </div>
            <div className="w-full flex justify-between px-1">
              <span className="text-[10px] font-bold text-on-surface-variant">{fuel} Fuel</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Next: {dragonNextGoal}</span>
            </div>
          </div>

          <div className="relative min-h-[800px] py-10 flex flex-col items-center gap-16">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e0e3e5" strokeDasharray="8" strokeWidth="4" />
            </svg>

            {cities.map((city, idx) => {
              const uiCity = uiCities[Math.min(idx, uiCities.length - 1)];
              const isUltimate = idx === cities.length - 1;
              const isNext = !city.unlocked && (idx === 0 || cities[idx - 1].unlocked);
              const translateClass = idx % 2 === 0 ? "translate-x-[-40px]" : "translate-x-[40px]";

              if (isUltimate) {
                const canPlay = isNext || city.unlocked;
                return (
                  <div key={idx} className={`relative z-10 w-full flex justify-center opacity-${canPlay ? '100' : '30'} mb-10`}>
                    <div onClick={canPlay ? () => navigate(`/boss-battle?worldId=${city._id || 'w1'}&difficulty=hard&returnTo=/practice/journey-map`) : undefined} className="glass-card p-6 rounded-3xl w-72 text-center border-2 border-dashed border-outline-variant cursor-pointer active:scale-95 transition-all">
                      <div className="w-16 h-16 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4 text-3xl">{uiCity.emoji}</div>
                      <h3 className="font-headline text-headline-md font-bold text-on-surface-variant mb-2">{city.name}</h3>
                      <p className="text-label-sm text-outline mb-4">The Final Legend awaits...</p>
                      <div className="py-2 px-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-full inline-block font-bold text-xs">{city.requiredFuel.toLocaleString()} FUEL NEEDED</div>
                    </div>
                  </div>
                );
              }

              if (city.unlocked) {
                return (
                  <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass}`}>
                    <div 
                      onClick={() => navigate(`/boss-battle?worldId=${city._id || 'w1'}&difficulty=hard&returnTo=/practice/journey-map`)}
                      className="glass-card p-4 rounded-2xl w-64 border-l-4 border-secondary-fixed shadow-[0_4px_20px_rgba(0,106,98,0.2)] hover:scale-105 cursor-pointer active:scale-95 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full group-hover:bg-secondary-fixed transition-colors">UNLOCKED</span>
                        <span className="material-symbols-outlined text-secondary-fixed text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      </div>
                      <h3 className="font-headline text-body-lg font-bold text-primary mb-1 group-hover:text-secondary-fixed transition-colors">{city.name}</h3>
                      <p className="text-label-sm text-on-surface-variant mb-3">{idx === 0 ? "The journey begins here..." : "Completed area"}</p>
                      <div className="flex items-center gap-3 bg-surface-container/50 p-2 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-2xl">{uiCity.emoji}</div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant">REWARD</p>
                          <p className="text-label-sm font-bold text-primary">{uiCity.reward}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (isNext) {
                const progressToNext = Math.min((fuel / city.requiredFuel) * 100, 100);
                return (
                  <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass}`}>
                    <div 
                      onClick={() => navigate(`/boss-battle?worldId=${city._id || 'w1'}&difficulty=hard&returnTo=/practice/journey-map`)}
                      className="glass-card p-4 rounded-2xl w-64 border-l-4 border-primary shadow-lg ring-2 ring-primary/20 cursor-pointer active:scale-95 hover:shadow-[0_0_20px_rgba(20,23,121,0.2)] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">IN PROGRESS</span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm">local_gas_station</span>
                          <span className="text-label-sm font-bold">{city.requiredFuel >= 1000 ? `${(city.requiredFuel/1000).toFixed(1)}k` : city.requiredFuel}</span>
                        </div>
                      </div>
                      <h3 className="font-headline text-body-lg font-bold text-primary mb-1">{city.name}</h3>
                      <div className="w-full h-1.5 bg-surface-container rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{width: `${progressToNext}%`}}></div>
                      </div>
                      <div className="flex items-center gap-3 bg-primary/5 p-2 rounded-lg border border-primary/10">
                        <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center text-2xl">{uiCity.emoji}</div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Click to fight Boss!</p>
                          <p className="text-label-sm font-bold text-primary">Unlock {uiCity.reward}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-outline-variant rounded-full flex items-center justify-center shadow-md animate-bounce">
                      <span className="material-symbols-outlined text-sm text-primary" style={{fontVariationSettings: "'FILL' 1"}}>swords</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass} opacity-60`}>
                  <div 
                    onClick={() => alert(`You need ${city.requiredFuel - fuel} more Fuel to unlock ${city.name}!`)}
                    className={`glass-card p-4 rounded-2xl w-64 cursor-pointer hover:opacity-100 transition-opacity ${idx % 2 === 0 ? 'grayscale-[0.5]' : 'grayscale'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">LOCKED</span>
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">local_gas_station</span>
                        <span className="text-label-sm font-bold">{city.requiredFuel >= 1000 ? `${(city.requiredFuel/1000).toFixed(1)}k` : city.requiredFuel}</span>
                      </div>
                    </div>
                    <h3 className="font-headline text-body-lg font-bold text-on-surface-variant mb-1">{city.name}</h3>
                    <p className="text-label-sm text-outline mb-3">Locked by Mystery</p>
                    <div className="flex items-center gap-3 bg-surface-container/30 p-2 rounded-lg">
                      <div className="w-10 h-10 bg-surface-container rounded-md flex items-center justify-center text-2xl opacity-30">{uiCity.emoji}</div>
                      <div>
                        <p className="text-[10px] font-bold text-outline">REWARD</p>
                        <p className="text-label-sm font-bold text-outline">{uiCity.reward}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
