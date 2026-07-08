import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveCompanion from "../../../components/InteractiveCompanion";

interface City {
  _id?: string;
  name: string;
  unlocked: boolean;
  landmark: string;
  fact: string;
  badge: string;
  requiredXp: number;
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
    { name: "Egg Village", emoji: "🥚", fallbackXp: 0, reward: "Dragon Egg", rewardColor: "text-secondary-fixed" },
    { name: "Forest Kingdom", emoji: "🐉", fallbackXp: 1000, reward: "Baby Dragon", rewardColor: "text-primary" },
    { name: "Magic Desert", emoji: "🔥", fallbackXp: 2500, reward: "Phoenix", rewardColor: "text-outline" },
    { name: "Ice Kingdom", emoji: "❄️", fallbackXp: 5000, reward: "Ice Dragon", rewardColor: "text-outline" },
    { name: "Dragon Mountain", emoji: "🏔️", fallbackXp: 10000, reward: "Legendary Dragon", rewardColor: "text-on-surface-variant" },
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
      if (userXp === 0) {
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

      const xpThresholds = [0, 1000, 2500, 5000, 10000];

      // Fetch cities
      try {
        const cRes = await apiFetch("/api/practice/cities");
        const cData = await cRes.json();
        if (cData.success && cData.data.length > 0) {
          const mapped = cData.data.map((c: any, index: number) => {
            const reqXp = xpThresholds[index] || 0;
            return {
              _id: c._id || c.id,
              name: c.name,
              landmark: c.landmark,
              fact: c.fact,
              badge: c.badge,
              requiredXp: reqXp,
              unlocked: userXp >= reqXp
            };
          });
          setCities(mapped);
        } else {
          // Fallback to static if no cities from API
          setCities(uiCities.map((c, index) => {
            const reqXp = xpThresholds[index] || 0;
            return {
              name: c.name,
              landmark: "", fact: "", badge: "",
              requiredXp: reqXp,
              unlocked: userXp >= reqXp
            };
          }));
        }
      } catch (e) {
        console.error("Failed to fetch cities", e);
        setCities(uiCities.map((c, index) => {
          const reqXp = xpThresholds[index] || 0;
          return {
            name: c.name,
            landmark: "", fact: "", badge: "",
            requiredXp: reqXp,
            unlocked: userXp >= reqXp
          };
        }));
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

  // Determine Dragon Stage based on XP (aligned with backend /evolution API)
  let dragonStage = "Pristine Egg";
  let dragonModelUrl = "/images/dragons/egg.glb";
  let dragonFallbackImage = "/images/dragons/egg.png";
  let dragonMessage = "Keep learning to hatch your egg!";
  let dragonNextGoal = 2000;
  let companionScale = 0.8;

  if (xp >= 10000) {
    dragonStage = "Legendary Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "Amazing! Your dragon is legendary!";
    dragonNextGoal = 10000;
    companionScale = 1.3;
  } else if (xp >= 8000) {
    dragonStage = "Fire Dragon";
    dragonModelUrl = "/images/dragons/teen_dragon.glb";
    dragonFallbackImage = "/images/dragons/teen.png";
    dragonMessage = "Your dragon is growing fast!";
    dragonNextGoal = 10000;
    companionScale = 1.2;
  } else if (xp >= 6000) {
    dragonStage = "Adult Dragon";
    dragonModelUrl = "/images/dragons/teen_dragon.glb";
    dragonFallbackImage = "/images/dragons/teen.png";
    dragonMessage = "Your dragon is learning to fly!";
    dragonNextGoal = 8000;
    companionScale = 1.1;
  } else if (xp >= 4000) {
    dragonStage = "Baby Dragon";
    dragonModelUrl = "/images/dragons/baby_dragon.glb";
    dragonFallbackImage = "/images/dragons/baby.png";
    dragonMessage = "Your dragon hatched! Keep learning!";
    dragonNextGoal = 6000;
    companionScale = 0.9;
  } else if (xp >= 2000) {
    dragonStage = "Hatching Companion";
    dragonModelUrl = "/images/dragons/egg.glb";
    dragonFallbackImage = "/images/dragons/cracked.png";
    dragonMessage = "It's hatching! Just a bit more learning!";
    dragonNextGoal = 4000;
    companionScale = 0.85;
  } else {
    // Stage 1 (xp < 2000)
    if (xp >= 1000) {
      dragonStage = "Cracking Egg";
      dragonFallbackImage = "/images/dragons/cracked.png";
      dragonMessage = "The egg is starting to crack!";
    } else {
      dragonStage = "Dragon Egg";
      dragonFallbackImage = "/images/dragons/egg.png";
      dragonMessage = "Keep learning to start cracking your egg!";
    }
    dragonModelUrl = "/images/dragons/egg.glb";
    dragonNextGoal = 2000;
    companionScale = 0.8;
  }

  const startXpOfStage = xp >= 10000 ? 10000 : xp >= 8000 ? 8000 : xp >= 6000 ? 6000 : xp >= 4000 ? 4000 : xp >= 2000 ? 2000 : 0;
  const stageRange = dragonNextGoal - startXpOfStage;
  const dragonProgress = stageRange > 0 ? Math.min(100, Math.round(((xp - startXpOfStage) / stageRange) * 100)) : 100;

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
            
            <div className="w-36 h-36 bg-white/50 rounded-full flex items-center justify-center p-2 mb-4 shadow-inner ring-4 ring-white relative z-10 overflow-hidden">
              <InteractiveCompanion scale={companionScale} url={dragonModelUrl} fallbackImage={dragonFallbackImage} />
            </div>
            
            <h3 className="text-xl font-black text-primary mb-2">{dragonStage}</h3>
            
            <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner flex mb-1">
              <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-1000" style={{width: `${dragonProgress}%`}}></div>
            </div>
            <div className="w-full flex justify-between px-1">
              <span className="text-[10px] font-bold text-on-surface-variant">{xp} XP</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Next: {dragonNextGoal} XP</span>
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
                    <div className="glass-card p-6 rounded-3xl w-72 text-center border-2 border-dashed border-outline-variant transition-all">
                      <div className="w-16 h-16 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4 text-3xl">{uiCity.emoji}</div>
                      <h3 className="font-headline text-headline-md font-bold text-on-surface-variant mb-2">{city.name}</h3>
                      <p className="text-label-sm text-outline mb-4">The Final Legend awaits...</p>
                      <div className="py-2 px-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-full inline-block font-bold text-xs">{city.requiredXp.toLocaleString()} XP NEEDED</div>
                    </div>
                  </div>
                );
              }

              if (city.unlocked) {
                return (
                  <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass}`}>
                    <div 
                      className="glass-card p-4 rounded-2xl w-64 border-l-4 border-secondary-fixed shadow-[0_4px_20px_rgba(0,106,98,0.2)] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">UNLOCKED</span>
                        <span className="material-symbols-outlined text-secondary-fixed text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      </div>
                      <h3 className="font-headline text-body-lg font-bold text-primary mb-1">{city.name}</h3>
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
                const progressToNext = Math.min((xp / city.requiredXp) * 100, 100);
                return (
                  <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass}`}>
                    <div 
                      className="glass-card p-4 rounded-2xl w-64 border-l-4 border-primary shadow-lg ring-2 ring-primary/20 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">IN PROGRESS</span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm text-orange-500" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
                          <span className="text-label-sm font-bold">{city.requiredXp >= 1000 ? `${(city.requiredXp/1000).toFixed(1)}k` : city.requiredXp}</span>
                        </div>
                      </div>
                      <h3 className="font-headline text-body-lg font-bold text-primary mb-1">{city.name}</h3>
                      <div className="w-full h-1.5 bg-surface-container rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{width: `${progressToNext}%`}}></div>
                      </div>
                      <div className="flex items-center gap-3 bg-primary/5 p-2 rounded-lg border border-primary/10">
                        <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center text-2xl">{uiCity.emoji}</div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase">REWARD</p>
                          <p className="text-label-sm font-bold text-primary">Unlock {uiCity.reward}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className={`relative z-10 w-full flex justify-center ${translateClass} opacity-60`}>
                  <div 
                    className={`glass-card p-4 rounded-2xl w-64 ${idx % 2 === 0 ? 'grayscale-[0.5]' : 'grayscale'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">LOCKED</span>
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">local_fire_department</span>
                        <span className="text-label-sm font-bold">{city.requiredXp >= 1000 ? `${(city.requiredXp/1000).toFixed(1)}k` : city.requiredXp}</span>
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
