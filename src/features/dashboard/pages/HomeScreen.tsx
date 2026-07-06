import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Zap, MapPin, ChevronRight, BookOpen, Map, Bookmark, Shield, Gift, CheckCircle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";


export default function HomeScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [fuel, setFuel] = useState(0);
  const [coins, setCoins] = useState(0);
  const [childName, setChildName] = useState("Explorer");
  const [userLevel, setUserLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  const [missions, setMissions] = useState<any[]>([]);
  const [retentionStreak, setRetentionStreak] = useState<any>(null);
  
  // Unscripted Game Elements
  const [surpriseData, setSurpriseData] = useState<any>(null);
  const [chestTaps, setChestTaps] = useState(0);
  const [mascotMsg, setMascotMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const response = await apiFetch("/api/users/me", {
        });
        const data = await response.json();
        if (data.success) {
          const u = data.data.user;
          setFuel(u.fuel || 0);
          setCoins(u.coins || 0);
          setChildName(u.childName || "Explorer");
          setUserLevel(u.level || 1);
          setStreakDays(u.streakDays || 0);
          localStorage.setItem("userData", JSON.stringify(u));
        }
      } catch (e) {
        console.error("Failed to fetch profile");
      }
    };
    
    // Initial load from cache
    const cached = localStorage.getItem("userData");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setFuel(u.fuel || 0);
        setCoins(u.coins || 0);
        setChildName(u.childName || "Explorer");
        setUserLevel(u.level || 1);
        setStreakDays(u.streakDays || 0);
      } catch(e) {}
    }
    
    const fetchRetentionData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const msRes = await apiFetch("/api/retention/missions/today");
        if (msRes.ok) {
          const msData = await msRes.json();
          if (msData && Array.isArray(msData.missions)) {
            setMissions(msData.missions);
          }
        }
        
        // IMPORTANT: Update the streak BEFORE fetching it
        try {
          await apiFetch("/api/retention/streak/update", { method: "POST" });
        } catch(e) {}
        
        const stRes = await apiFetch("/api/retention/streak");
        if (stRes.ok) {
          const stData = await stRes.json();
          setRetentionStreak(stData);
        }
        
        // Fetch Random Unscripted Surprise
        const surRes = await apiFetch("/api/retention/surprise");
        if (surRes.ok) {
          const surData = await surRes.json();
          if (surData && surData.reward_type) {
            setSurpriseData(surData);
            setChestTaps(0);
          }
        }
      } catch (e) {
        console.error("Failed to fetch retention data", e);
      }
    };
    
    fetchProfile();
    fetchRetentionData();
  }, []);

  const completeMission = async (missionId: string) => {
    try {
      const res = await apiFetch("/api/retention/missions/complete", {
        method: "POST",
        body: JSON.stringify({ mission_id: missionId })
      });
      if (res.ok) {
        const data = await res.json();
        // Update mission state
        setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'completed' } : m));
        // Add coins and XP visually
        setCoins(prev => prev + (data.coinReward || 0));
      }
    } catch (e) {
      console.error("Failed to complete mission");
    }
  };

  const CITIES = [
    "Egg Village",
    "Forest Kingdom",
    "Magic Desert",
    "Ice Kingdom",
    "Dragon Mountain"
  ];

  // Calculate destination progress based on fuel
  const nextLockedIndex = Math.min(CITIES.length - 1, Math.max(1, Math.floor(fuel / 500) + 1));
  const currentCityName = CITIES[nextLockedIndex - 1] || "Egg Village";
  const nextCityName = CITIES[nextLockedIndex] || "Forest Kingdom";
  const targetFuel = nextLockedIndex * 500;
  const fuelNeeded = Math.max(0, targetFuel - fuel);
  const prevMilestoneFuel = (nextLockedIndex - 1) * 500;
  const currentLegFuelTotal = 500;
  const currentLegFuelEarned = Math.max(0, fuel - prevMilestoneFuel);
  const fuelPercentage = Math.min(100, Math.max(0, (currentLegFuelEarned / currentLegFuelTotal) * 100));

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden pb-24">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] -right-[20%] w-[280px] h-[280px] rounded-full bg-[rgba(87,250,233,0.12)] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* Top Section */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md pt-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/profile")}
            className="w-11 h-11 rounded-full border-2 border-[#57fae9] overflow-hidden hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#141779] leading-tight">{childName}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={14} fill="#006a62" color="#006a62" />
              <span className="text-[11px] text-[#767683] font-semibold">Explorer Level {userLevel}</span>
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex gap-2">
          <div className="bg-[rgba(255,159,67,0.15)] px-2.5 py-1.5 rounded-xl flex items-center justify-center">
            <span className="text-xs font-bold text-[#ff9f43]">🔥 {retentionStreak?.currentStreak ?? streakDays} Days</span>
          </div>
          <button 
            onClick={() => navigate("/practice/inventory")}
            className="bg-[rgba(255,215,0,0.15)] px-2.5 py-1.5 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="text-xs font-bold text-[#141779]">🪙 {coins}</span>
          </button>
        </div>
      </header>

      <main className="px-6 pt-6 flex flex-col gap-6">
        {/* Journey Fuel Bar Card */}
        <div className="bg-white rounded-[20px] p-4 border-[1.5px] border-[#f0f0f0] shadow-sm relative z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <Zap size={16} fill="#141779" color="#141779" />
              <span className="text-[10px] font-bold text-[#141779] tracking-[1px]">JOURNEY FUEL</span>
            </div>
            <span className="text-xs font-bold text-[#141779]">🚂 {fuel} Fuel</span>
          </div>
          <div className="h-2.5 bg-[rgba(20,23,121,0.1)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#141779] to-[#57fae9] transition-all duration-500"
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2.5">
            <MapPin size={16} fill="#ff9f43" color="white" />
            <span className="text-[11px] text-[#767683] font-semibold">
              Next: {nextCityName} • <span className="font-bold text-[#141779]">{fuelNeeded > 0 ? `${fuelNeeded} Fuel Needed` : "Ready!"}</span>
            </span>
          </div>
        </div>

        {/* MAIN HERO SECTION: Large Journey Progress Card */}
        <button
          onClick={() => navigate("/practice/chapters")}
          className="w-full text-left bg-gradient-to-br from-[#e0f7f6] to-[#ffffff] rounded-[24px] p-5 border-[1.5px] border-[rgba(255,255,255,0.5)] shadow-[0_6px_16px_rgba(0,0,0,0.05)] relative z-10 hover:shadow-md transition-shadow"
        >
          <p className="text-[9px] font-bold text-[#141779] tracking-[2px] text-center mb-2">CURRENT ROUTE</p>
          <div className="flex justify-center items-center gap-3 mb-5">
            <span className="text-[22px] font-bold text-[#141779]">{currentCityName}</span>
            <ChevronRight size={18} color="#141779" />
            <span className="text-[22px] font-bold text-[#141779]">{nextCityName}</span>
          </div>

          {/* Map Progress Track with Learning Train */}
          <div className="h-16 flex items-center bg-[rgba(255,255,255,0.6)] rounded-2xl border border-[#e0f2f1] relative overflow-hidden mb-4 px-5">
            <div className="h-0.5 border-t-2 border-dashed border-[#141779] opacity-50 w-full" />
            
            <motion.div 
              className="absolute left-5"
              animate={{ x: [0, 150, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <motion.div
                animate={{ y: [-3, 0, -3] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                className="bg-[#141779] rounded-[10px] p-2 border-[1.5px] border-[#57fae9]"
              >
                <div className="w-6 h-6 flex items-center justify-center text-white">🚂</div>
              </motion.div>
            </motion.div>
          </div>

          <p className="text-xs font-bold text-[#141779] text-center">
            {fuelNeeded > 0 ? `Only ${fuelNeeded} Fuel left to reach ${nextCityName}` : `You have reached ${nextCityName}!`}
          </p>
        </button>

        {/* QUICK ACTIONS BENTO GRID */}
        <div className="flex flex-col gap-[14px] relative z-10">
          <h2 className="text-[10px] font-bold text-[#767683] tracking-[1.5px] px-1">EXPLORER MISSION CONTROLS 13</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Continue Learning */}
            <button
              onClick={() => navigate("/practice/chapters")}
              className="bg-[#e0e0ff] rounded-[20px] p-4 flex flex-col justify-between h-32 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-left hover:scale-[1.02] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(20,23,121,0.15)] flex items-center justify-center">
                <BookOpen size={24} color="#141779" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#141779] mb-1">📚 {t('continue_learning')}</h3>
                <p className="text-[10px] text-[#767683] font-semibold">Math & Science Quests</p>
              </div>
            </button>

            {/* Good Habits */}
            <button
              onClick={() => navigate("/good-habits")}
              className="bg-[#fff0da] rounded-[20px] p-4 flex flex-col justify-between h-32 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-left hover:scale-[1.02] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(255,159,67,0.2)] flex items-center justify-center">
                <Star size={24} color="#ff9f43" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#141779] mb-1">⭐ {t('good_habits')}</h3>
                <p className="text-[10px] text-[#767683] font-semibold">Daily lessons & rewards</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* My Journey */}
            <button
              onClick={() => navigate("/practice/journey-map")}
              className="bg-[#d7fdf5] rounded-[20px] p-4 flex flex-col justify-between h-32 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-left hover:scale-[1.02] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(0,106,98,0.15)] flex items-center justify-center">
                <Map size={24} color="#006a62" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#141779] mb-1">🗺 {t('journey')}</h3>
                <p className="text-[10px] text-[#767683] font-semibold">Gujarat Explorer Map</p>
              </div>
            </button>

            {/* My Collections */}
            <button
              onClick={() => navigate("/practice/collections")}
              className="bg-[#ffe8ed] rounded-[20px] p-4 flex flex-col justify-between h-32 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-left hover:scale-[1.02] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(255,107,107,0.15)] flex items-center justify-center">
                <Bookmark size={24} color="#ff6b6b" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#141779] mb-1">🏆 My Collections</h3>
                <p className="text-[10px] text-[#767683] font-semibold">Unlocked Cards & Badges</p>
              </div>
            </button>
          </div>

          {/* Multiplayer Challenge */}
          <button
            onClick={() => navigate("/multiplayer-hub")}
            className="w-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-[20px] p-5 flex items-center justify-between shadow-[0_6px_15px_rgba(20,23,121,0.2)] hover:scale-[1.02] transition-transform border border-white/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-2xl">⚔️</span>
              </div>
              <div className="text-left">
                <h3 className="text-[16px] font-black text-white uppercase tracking-wider mb-0.5">Shadow Arena (1v1)</h3>
                <p className="text-[11px] text-[#57fae9] font-bold">Challenge friends. Win 25 for physical prize!</p>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <ChevronRight size={20} color="white" />
            </div>
          </button>
        </div>

        {/* DAILY MISSIONS WIDGET */}
        {missions.length > 0 && (
          <div className="bg-white rounded-[24px] p-5 border-[1.5px] border-[#f0f0f0] shadow-sm relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-[#ff6b6b]" />
                <h2 className="text-[15px] font-bold text-[#141779]">Daily Missions</h2>
              </div>
              <span className="text-[11px] font-bold text-[#767683] bg-gray-100 px-2 py-1 rounded-full">
                {missions.filter(m => m.status === 'completed').length}/{missions.length} Done
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {missions.map((mission) => (
                <motion.div 
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-3 rounded-[16px] border ${
                    mission.status === 'completed' 
                      ? 'bg-[#f8fdfb] border-[#e6fcf5]' 
                      : 'bg-white border-[#f0f0f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={mission.status === 'completed' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.6, repeat: mission.status === 'completed' ? Infinity : 0, repeatDelay: 3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      mission.status === 'completed' ? 'bg-[#20c997] text-white' : 'bg-[#e0e0ff] text-[#141779]'
                    }`}>
                      {mission.status === 'completed' ? <CheckCircle size={20} /> : <Gift size={20} />}
                    </motion.div>
                    <div>
                      <h3 className={`text-[13px] font-bold ${mission.status === 'completed' ? 'text-[#20c997]' : 'text-[#141779]'}`}>
                        {mission.title}
                      </h3>
                      <p className="text-[11px] text-[#767683] font-semibold mt-0.5 flex items-center gap-2">
                        <span>🪙 +{mission.coin_reward || mission.coinReward} Coins</span>
                        <span>⭐ +{mission.xp_reward || mission.xpReward} XP</span>
                      </p>
                    </div>
                  </div>
                  
                  {mission.status !== 'completed' && (
                    <div className="bg-[#f0f0f0] text-[#767683] text-[11px] font-bold px-4 py-2 rounded-[12px]">
                      In Progress
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/parent")}
          className="bg-white rounded-[20px] p-4 flex justify-between items-center border-[1.5px] border-[#eef0f2] shadow-sm relative z-10 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield size={24} color="#141779" />
            <div className="text-left">
              <h3 className="text-[15px] font-bold text-[#141779]">{t('parent_space')}</h3>
              <p className="text-[11px] text-[#767683] font-semibold">View stats, DNA, & reports</p>
            </div>
          </div>
          <ChevronRight size={24} color="#141779" />
        </button>
      </main>

      {/* FLOATING INTERACTIVE MASCOT */}
      <motion.div 
        className="fixed bottom-24 right-4 z-40 flex flex-col items-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {mascotMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white text-[#141779] text-xs font-bold px-4 py-2 rounded-[16px] shadow-lg mb-2 relative border-2 border-[#57fae9]"
          >
            {mascotMsg}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-[#57fae9] transform rotate-45"></div>
          </motion.div>
        )}
        <button 
          onClick={() => {
            const quotes = [
              "You're doing great! 🚀", 
              "Did you check your missions? 🎯", 
              "Keep up the streak! 🔥", 
              "I smell mystery boxes... 📦",
              "Let's learn something new! 📚"
            ];
            setMascotMsg(quotes[Math.floor(Math.random() * quotes.length)]);
            setTimeout(() => setMascotMsg(""), 3500);
          }}
          className="bg-white rounded-full w-14 h-14 shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-[#141779] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <span className="text-3xl">🐉</span>
        </button>
      </motion.div>

      {/* SURPRISE CHEST MINIGAME MODAL */}
      {surpriseData && chestTaps < 2 && (
        <div className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ y: -500, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-center flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8 animate-pulse text-center">A Wild Surprise<br/>Appeared!</h2>
            <motion.button
              onClick={() => {
                 if(chestTaps === 0) {
                   setChestTaps(1);
                   setTimeout(() => setChestTaps(2), 1200);
                 }
              }}
              animate={chestTaps === 1 ? { 
                scale: [1, 1.2, 1.1, 1.3, 1.5],
                rotate: [0, -10, 10, -15, 15, -20, 20, 0],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(2)"]
              } : {}}
              transition={chestTaps === 1 ? { duration: 1.2, ease: "easeInOut" } : {}}
              whileHover={chestTaps === 0 ? { scale: 1.1, rotate: 5 } : {}}
              whileTap={chestTaps === 0 ? { scale: 0.8, rotate: -15 } : {}}
              className="text-[140px] filter drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] cursor-pointer relative"
            >
              <span className="relative z-10">🎁</span>
              {chestTaps === 1 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 5, 15], opacity: [0, 1, 1] }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeIn" }}
                  className="absolute inset-0 bg-white rounded-full blur-2xl z-20 pointer-events-none"
                />
              )}
            </motion.button>
            <p className="text-white mt-12 font-bold text-xl bg-[rgba(255,255,255,0.2)] px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
              {chestTaps === 1 ? "Opening..." : "Tap to open!"}
            </p>
          </motion.div>
        </div>
      )}

      {/* REWARD REVEAL */}
      {surpriseData && chestTaps >= 2 && (
        <div className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-gradient-to-b from-[#fff7e6] to-white w-full max-w-sm rounded-[32px] p-8 text-center relative shadow-[0_0_50px_rgba(255,215,0,0.4)]"
          >
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-6xl block mb-4"
            >
              🎉
            </motion.span>
            <h2 className="text-3xl font-bold text-[#141779] mb-2">Surprise Reward!</h2>
            <p className="text-[#767683] font-semibold mb-6">The magic chest gave you something special.</p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-[#ff9f43]/10 rounded-2xl p-6 mb-8 border-2 border-[#ff9f43]/30 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/40 blur-xl animate-pulse" />
               <span className="text-5xl block mb-2 relative z-10">{surpriseData.reward_type === 'coins' ? '🪙' : surpriseData.reward_type === 'xp' ? '⭐' : '🔮'}</span>
               <h3 className="text-2xl font-bold text-[#ff9f43] relative z-10">+{surpriseData.amount} {surpriseData.reward_type.toUpperCase()}</h3>
            </motion.div>

            <button 
              onClick={() => { 
                if (surpriseData.reward_type === 'coins') setCoins(c => c + surpriseData.amount);
                setSurpriseData(null); 
              }}
              className="w-full bg-[#141779] text-white font-bold py-4 rounded-[16px] hover:opacity-90 active:scale-95 transition-all text-xl shadow-[0_4px_12px_rgba(20,23,121,0.2)]"
            >
              Claim!
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
