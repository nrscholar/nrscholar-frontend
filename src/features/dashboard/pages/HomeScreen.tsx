import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, CheckCircle, ChevronRight, Gift, Map, MapPin, Shield, Star, Target, Zap, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";


export default function HomeScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [childName, setChildName] = useState("Explorer");
  const [childPhoto, setChildPhoto] = useState("");
  const [userLevel, setUserLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  const [missions, setMissions] = useState<any[]>([]);
  const [retentionStreak, setRetentionStreak] = useState<any>(null);
  
  // Unscripted Game Elements
  const [surpriseData, setSurpriseData] = useState<any>(null);
  const [chestTaps, setChestTaps] = useState(0);
  const [mascotMsg, setMascotMsg] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasFreeSpin, setHasFreeSpin] = useState(false);
  const [showSpinPopup, setShowSpinPopup] = useState(false);
  const [citiesData, setCitiesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          setUnreadCount(json.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
    };
    const fetchMascotNarration = async () => {
      try {
        const res = await apiFetch("/api/dashboard/mascot-narration");
        const json = await res.json();
        if (json.success && json.narration) {
          setMascotMsg(json.narration);
          setTimeout(() => setMascotMsg(""), 8000);
        }
      } catch (e) {}
    };
    fetchNotifications();
    fetchMascotNarration();
  }, []);

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
          setXp(u.xp || 0);
          setCoins(u.coins || 0);
          setChildName(u.childName || "Explorer");
          setChildPhoto(u.childPhoto || "");
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
        setXp(u.xp || 0);
        setCoins(u.coins || 0);
        setChildName(u.childName || "Explorer");
        setChildPhoto(u.childPhoto || "");
        setUserLevel(u.level || 1);
        setStreakDays(u.streakDays || 0);
      } catch(e) {}
    }
    
    const fetchMissions = async () => {
      try {
        const msRes = await apiFetch("/api/retention/missions/today");
        if (msRes.ok) {
          const msData = await msRes.json();
          if (msData && Array.isArray(msData)) {
            setMissions(msData);
          }
        }
      } catch (e) {}
    };

    const fetchRetentionData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        await fetchMissions();
        
        // IMPORTANT: Update the streak BEFORE fetching it
        try {
          const streakUpRes = await apiFetch("/api/retention/streak/update", { method: "POST" });
          if (streakUpRes.ok) {
            // Refetch profile to display new XP/coins from daily login on-the-spot
            fetchProfile();
          }
        } catch(e) {}
        
        const stRes = await apiFetch("/api/retention/streak");
        if (stRes.ok) {
          const stData = await stRes.json();
          setRetentionStreak(stData);
        }

        try {
          const cRes = await apiFetch("/api/practice/cities");
          if (cRes.ok) {
            const cData = await cRes.json();
            if (cData.success && cData.data) {
              setCitiesData(cData.data);
            }
          }
        } catch (e) {
          console.error("Failed to fetch cities", e);
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

        // Fetch Spin Wheel status
        try {
          const spinRes = await apiFetch("/api/retention/spin-wheel/status");
          if (spinRes.ok) {
            const spinData = await spinRes.json();
            if (spinData && spinData.balances) {
              const dailyCount = spinData.balances.daily_spins_balance || 0;
              const hasSpin = dailyCount > 0 || (spinData.balances.chapter_spins_balance || 0) > 0 || (spinData.balances.event_spins_balance || 0) > 0;
              setHasFreeSpin(hasSpin);
              
              if (dailyCount > 0 && sessionStorage.getItem("dailySpinPopupShown") !== "true") {
                setShowSpinPopup(true);
                sessionStorage.setItem("dailySpinPopupShown", "true");
              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch spin wheel status", e);
        }
      } catch (e) {
        console.error("Failed to fetch retention data", e);
      }
    };
    
    fetchProfile();
    fetchRetentionData();

    // Re-fetch missions whenever the user switches back to this tab/screen
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMissions();
        fetchProfile();
        fetchRetentionData();
      }
    };
    // Also re-fetch on window focus (covers navigating back from another route)
    const handleFocus = () => {
      fetchMissions();
      fetchProfile();
      fetchRetentionData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Poll every 10 seconds so missions update quickly after being completed
    const pollInterval = setInterval(fetchMissions, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, []);

  const completeMission = async (missionId: string) => {
    try {
      const res = await apiFetch("/api/retention/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_id: missionId })
      });
      if (res.ok) {
        const data = await res.json();
        // Update mission state
        setMissions(prev => prev.map(m => (m.id === missionId || m._id === missionId) ? { ...m, status: 'completed' } : m));
        // Add coins and XP visually
        setCoins(prev => prev + (data.coinReward || 0));
        if (data.xpReward) {
          setXp(prev => prev + data.xpReward);
        }
      }
    } catch (e) {
      console.error("Failed to complete mission");
    }
  };

  // Calculate destination progress based on fetched cities
  let currentCityIndex = 0;
  if (citiesData.length > 0) {
    for (let i = 0; i < citiesData.length; i++) {
      if (xp >= (citiesData[i].requiredFuel || 0)) {
        currentCityIndex = i;
      }
    }
  }

  const nextLockedIndex = citiesData.length > 0 ? Math.min(citiesData.length - 1, currentCityIndex + 1) : 0;
  const currentCityName = citiesData.length > 0 ? citiesData[currentCityIndex].name : "Egg Village";
  const nextCityName = citiesData.length > 0 ? citiesData[nextLockedIndex].name : "Forest Kingdom";
  
  const targetXp = citiesData.length > 0 ? (citiesData[nextLockedIndex].requiredFuel || 1000) : 1000;
  const prevMilestoneXp = citiesData.length > 0 ? (citiesData[currentCityIndex].requiredFuel || 0) : 0;
  
  const xpNeeded = Math.max(0, targetXp - xp);
  const currentLegXpTotal = targetXp - prevMilestoneXp;
  const currentLegXpPercentage = targetXp > 0 ? Math.min(100, Math.max(0, (xp / targetXp) * 100)) : 100;


  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden pb-24">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] -right-[20%] w-[280px] h-[280px] rounded-full bg-[rgba(87,250,233,0.12)] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* Top Section */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md pt-8 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate("/profile")}
            className="w-11 h-11 rounded-full border-2 border-[#57fae9] overflow-hidden hover:opacity-80 transition-opacity shrink-0"
          >
            {childPhoto ? (
              <img 
                src={childPhoto} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(childName || "Kid")}&background=random`} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-bold text-[#141779] leading-tight truncate">{childName}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={14} fill="#006a62" color="#006a62" className="shrink-0" />
              <span className="text-[11px] text-[#767683] font-semibold truncate">{t('explorer_level')} {userLevel}</span>
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-10 bg-[rgba(255,159,67,0.15)] px-2.5 rounded-xl flex items-center justify-center whitespace-nowrap">
            <span className="text-xs font-bold text-[#ff9f43]">🔥 {retentionStreak?.currentStreak ?? streakDays}</span>
          </div>
          {/* Bell button with badge overlapping the icon top-right */}
          <button 
            onClick={() => navigate("/notifications")}
            className="w-10 h-10 rounded-xl bg-[rgba(20,23,121,0.08)] flex items-center justify-center hover:bg-[rgba(20,23,121,0.15)] transition-all shrink-0"
          >
            <div className="relative">
              <Bell size={18} className="text-[#141779]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
          <button 
            onClick={() => navigate("/practice/inventory")}
            className="h-10 bg-[rgba(255,215,0,0.15)] px-2.5 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
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
              <span className="text-[10px] font-bold text-[#141779] tracking-[1px]">{t('journey_progress')}</span>
            </div>
            <span className="text-xs font-bold text-[#141779]">🔥 {xp} XP</span>
          </div>
          {/* XP Progress Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden bg-[rgba(20,23,121,0.10)] mt-1 mb-0.5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${currentLegXpPercentage}%`,
                background: "linear-gradient(to right, #141779, #57fae9)"
              }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2.5">
            <MapPin size={16} fill="#ff9f43" color="white" />
            <span className="text-[11px] text-[#767683] font-semibold">
              {t('next')}: {t(nextCityName.toLowerCase().replace(' ', '_'))} • <span className="font-bold text-[#141779]">{xpNeeded > 0 ? `${xpNeeded} ${t('xp_needed')}` : t('ready')}</span>
            </span>
          </div>
        </div>

        {/* MAIN HERO SECTION: Large Journey Progress Card */}
        <button
          onClick={() => navigate("/practice/journey-map")}
          className="w-full text-left bg-gradient-to-br from-[#e0f7f6] to-[#ffffff] rounded-[24px] p-5 border-[1.5px] border-[rgba(255,255,255,0.5)] shadow-[0_6px_16px_rgba(0,0,0,0.05)] relative z-10 hover:shadow-md transition-shadow"
        >
          <p className="text-[9px] font-bold text-[#141779] tracking-[2px] text-center mb-2">{t('current_route')}</p>
          <div className="flex justify-center items-center gap-3 mb-5">
            <span className="text-[22px] font-bold text-[#141779]">{t(currentCityName.toLowerCase().replace(' ', '_'))}</span>
            <ChevronRight size={18} color="#141779" />
            <span className="text-[22px] font-bold text-[#141779]">{t(nextCityName.toLowerCase().replace(' ', '_'))}</span>
          </div>

          {/* Map Progress Track with Learning Train */}
          <div className="h-16 flex items-center bg-[rgba(255,255,255,0.6)] rounded-2xl border border-[#e0f2f1] relative overflow-hidden mb-4 px-5">
            <div className="h-0.5 border-t-2 border-dashed border-[#141779] opacity-50 w-full" />
            
            <div className="absolute inset-0 px-5 flex items-center">
              <div style={{ width: `${currentLegXpPercentage}%`, transition: 'width 1s ease-in-out' }} />
              <motion.div
                animate={{ y: [-3, 0, -3] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                className="bg-[#141779] rounded-[10px] p-2 border-[1.5px] border-[#57fae9] -ml-5 shadow-sm"
              >
                <div className="w-6 h-6 flex items-center justify-center text-white">🚂</div>
              </motion.div>
            </div>
          </div>

          <p className="text-xs font-bold text-[#141779] text-center">
            {xpNeeded > 0 ? t('only_xp_left', { xp: xpNeeded, city: t(nextCityName.toLowerCase().replace(' ', '_')) }) : t('reached_city', { city: t(nextCityName.toLowerCase().replace(' ', '_')) })}
          </p>
        </button>

        {/* QUICK ACTIONS BENTO GRID */}
        <div className="flex flex-col gap-[14px] relative z-10">
          <h2 className="text-[10px] font-bold text-[#767683] tracking-[1.5px] px-1">{t('explorer_mission_controls')}   </h2>
          
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
                <p className="text-[10px] text-[#767683] font-semibold">{t('math_science_quests')}</p>
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
                <p className="text-[10px] text-[#767683] font-semibold">{t('daily_lessons_rewards')}</p>
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
                <p className="text-[10px] text-[#767683] font-semibold">{t('explorer_map')}</p>
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
                <h3 className="text-[13px] font-bold text-[#141779] mb-1">🏆 {t('my_collections')}</h3>
                <p className="text-[10px] text-[#767683] font-semibold">{t('unlocked_cards_badges')}</p>
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
                <h3 className="text-[16px] font-black text-white uppercase tracking-wider mb-0.5">{t('shadow_arena')}</h3>
                <p className="text-[11px] text-[#57fae9] font-bold">{t('challenge_friends')}</p>
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
                <h2 className="text-[15px] font-bold text-[#141779]">{t('daily_missions')}</h2>
              </div>
              <span className="text-[11px] font-bold text-[#767683] bg-gray-100 px-2 py-1 rounded-full">
                {missions.filter(m => m.status === 'completed').length}/{missions.length} {t('done')}
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
                        <span>🪙 +{mission.coin_reward || mission.coinReward} {t('coins')}</span>
                        <span>⭐ +{mission.xp_reward || mission.xpReward} {t('xp')}</span>
                      </p>
                    </div>
                  </div>
                  
                  {mission.status === 'completed' ? (
                    <div className="bg-[#e6fcf5] text-[#20c997] text-[11px] font-bold px-4 py-2 rounded-[12px]">
                      ✓ Completed
                    </div>
                  ) : (
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
              <p className="text-[11px] text-[#767683] font-semibold">{t('view_stats_dna')}</p>
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
            onClick={() => navigate('/evolution')}
            className="bg-white text-[#141779] text-xs font-bold px-4 py-2 rounded-[16px] shadow-lg mb-2 relative border-2 border-[#57fae9] flex items-center gap-2 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
          >
            <span>{mascotMsg}</span>
            <span className="text-[9px] bg-[#141779] text-[#57fae9] px-1.5 py-0.5 rounded-full whitespace-nowrap">Visit ➜</span>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-[#57fae9] transform rotate-45"></div>
          </motion.div>
        )}
        <button 
          onClick={async () => {
            try {
              const res = await apiFetch("/api/dashboard/mascot-narration");
              const json = await res.json();
              if (json.success && json.narration) {
                setMascotMsg(json.narration);
                setTimeout(() => setMascotMsg(""), 5000);
              }
            } catch (e) {
              const quotes = [
                "You're doing great! 🚀", 
                "Did you check your missions? 🎯", 
                "Keep up the streak! 🔥", 
                "I smell mystery boxes... 📦",
                "Let's learn something new! 📚"
              ];
              setMascotMsg(quotes[Math.floor(Math.random() * quotes.length)]);
              setTimeout(() => setMascotMsg(""), 3500);
            }
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
            <h2 className="text-3xl font-bold text-white mb-8 animate-pulse text-center">{t('wild_surprise')}</h2>
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
              {chestTaps === 1 ? t('opening') : t('tap_to_open')}
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
            <h2 className="text-3xl font-bold text-[#141779] mb-2">{t('surprise_reward')}</h2>
            <p className="text-[#767683] font-semibold mb-6">{t('magic_chest_gave_you')}</p>
            
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
                if (surpriseData.reward_type === 'coins') {
                  setCoins(c => {
                    const newCoins = c + surpriseData.amount;
                    const cached = localStorage.getItem("userData");
                    if (cached) {
                      const u = JSON.parse(cached);
                      u.coins = newCoins;
                      localStorage.setItem("userData", JSON.stringify(u));
                    }
                    return newCoins;
                  });
                } else if (surpriseData.reward_type === 'xp') {
                  setXp(x => {
                    const newXp = x + surpriseData.amount;
                    const cached = localStorage.getItem("userData");
                    if (cached) {
                      const u = JSON.parse(cached);
                      u.xp = newXp;
                      localStorage.setItem("userData", JSON.stringify(u));
                    }
                    return newXp;
                  });
                }
                setSurpriseData(null); 
              }}
              className="w-full bg-[#141779] text-white font-bold py-4 rounded-[16px] hover:opacity-90 active:scale-95 transition-all text-xl shadow-[0_4px_12px_rgba(20,23,121,0.2)]"
            >
              Claim!
            </button>
          </motion.div>
        </div>
      )}

      {/* FLOATING SPIN WHEEL GIFT ICON */}
      <motion.div
        className="fixed bottom-40 right-4 z-40"
        animate={hasFreeSpin ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }}
        transition={hasFreeSpin ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <button
          onClick={() => navigate("/daily-rewards")}
          className={`w-14 h-14 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95 ${
            hasFreeSpin
              ? "bg-[#57fae9] border-[#007168] text-[#007168] animate-pulse"
              : "bg-white border-[#141779] text-[#141779]"
          }`}
        >
          <Gift className="w-7 h-7" />
        </button>
      </motion.div>

      {/* DAILY FREE SPIN AUTO-POPUP */}
      <AnimatePresence>
        {showSpinPopup && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#141779] to-[#07051a] w-full max-w-[360px] p-8 rounded-3xl flex flex-col items-center text-center gap-6 border border-[#57fae9]/30 shadow-[0_0_30px_rgba(87,250,233,0.2)]"
            >
              <div className="w-20 h-20 rounded-full bg-[#57fae9]/10 flex items-center justify-center border border-[#57fae9]/30 animate-bounce">
                <Gift className="w-10 h-10 text-[#57fae9]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Free Spin Available!</h3>
                <p className="text-sm text-white/70 mt-2">
                  You have a free daily spin waiting. Spin the Quantum Wheel to unlock coins, XP, boosters, and legendary companion skins!
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => {
                    setShowSpinPopup(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full py-4 bg-[#57fae9] text-[#007168] font-bold rounded-full hover:bg-[#45e0d0] active:scale-95 transition-all uppercase tracking-wide text-sm"
                >
                  Spin Now
                </button>
                <button
                  onClick={() => setShowSpinPopup(false)}
                  className="w-full py-3 bg-white/5 text-white/50 font-bold rounded-full hover:bg-white/10 active:scale-95 transition-all text-xs"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
