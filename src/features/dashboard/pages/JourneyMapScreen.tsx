import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

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

  const maxFuel = 5000;
  const progressPercent = Math.min(Math.round((fuel / maxFuel) * 100), 100);

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
          <div className="glass-card rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Current Expedition</p>
              <h2 className="font-headline text-headline-md text-primary">Map Explorer</h2>
            </div>
            <div className="text-right">
              <p className="text-label-sm font-bold text-secondary">{progressPercent}% Completed</p>
              <div className="w-24 h-2 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-secondary-fixed transition-all duration-500" style={{width: `${progressPercent}%`}}></div>
              </div>
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
                    <div className="glass-card p-4 rounded-2xl w-64 border-l-4 border-secondary-fixed shadow-lg glow-pulse cursor-pointer active:scale-95 transition-all">
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
                  <div className={`glass-card p-4 rounded-2xl w-64 ${idx % 2 === 0 ? 'grayscale-[0.5]' : 'grayscale'}`}>
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

        {/* Stats Overlay */}
        <div className="fixed bottom-24 w-full max-w-[430px] px-6 pointer-events-none z-40">
          <div className="pointer-events-auto glass-card p-4 rounded-2xl flex items-center justify-center shadow-2xl ring-1 ring-white/50">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
              onClick={() => navigate('/evolution')}
            >
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center text-primary-fixed-dim">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>egg</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Dragon Evolution</p>
                <p className="text-body-md font-bold text-primary">Tap to View</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom NavBar */}
        <nav className="fixed bottom-0 w-full max-w-[430px] z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-t-[1.5px] border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-fixed text-on-secondary-container dark:text-on-secondary-fixed rounded-full px-4 py-1.5 transition-all active:scale-90 duration-200">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>map</span>
            <span className="font-label text-label-sm font-bold">Map</span>
          </div>
          <div onClick={() => navigate('/home')} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1.5 hover:text-secondary active:scale-90 transition-transform duration-200 cursor-pointer">
            <span className="material-symbols-outlined">explore</span>
            <span className="font-label text-label-sm font-bold">Quests</span>
          </div>
          <div onClick={() => alert('Feature coming soon!')} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1.5 hover:text-secondary active:scale-90 transition-transform duration-200 cursor-pointer">
            <span className="material-symbols-outlined">backpack</span>
            <span className="font-label text-label-sm font-bold">Backpack</span>
          </div>
          <div onClick={() => alert('Feature coming soon!')} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1.5 hover:text-secondary active:scale-90 transition-transform duration-200 cursor-pointer">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label text-label-sm font-bold">Friends</span>
          </div>
        </nav>
      </div>
    </div>
  );
}
