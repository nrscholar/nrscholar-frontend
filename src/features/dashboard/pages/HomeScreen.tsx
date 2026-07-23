import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, CheckCircle, ChevronRight, Clock, Gift, Map, MapPin, Shield, Star, Target, Zap, Bell, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";


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
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showDailyMissionModal, setShowDailyMissionModal] = useState(false);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  const [missions, setMissions] = useState<any[]>([]);
  const [retentionStreak, setRetentionStreak] = useState<any>(null);

  const fetchMissions = async () => {
    try {
      const msRes = await apiFetch("/api/retention/missions/today");
      if (msRes.ok) {
        const msData = await msRes.json();
        if (msData && Array.isArray(msData)) {
          setMissions(msData);
        } else if (msData && Array.isArray(msData.missions)) {
          setMissions(msData.missions);
          setDailyLimitReached(msData.daily_limit_reached || false);
          setTodayCompletedCount(msData.today_completed_count || 0);
        }
      }
    } catch (e) {}
  };
  
  // Unscripted Game Elements
  const [surpriseData, setSurpriseData] = useState<any>(null);
  const [chestTaps, setChestTaps] = useState(0);
  const [mascotMsg, setMascotMsg] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasFreeSpin, setHasFreeSpin] = useState(false);
  const [showSpinPopup, setShowSpinPopup] = useState(false);
  const [pendingSpinPopup, setPendingSpinPopup] = useState(false);
  const [citiesData, setCitiesData] = useState<any[]>([]);

  useEffect(() => {
    if (pendingSpinPopup && !surpriseData) {
      setShowSpinPopup(true);
      sessionStorage.setItem("dailySpinPopupShown", "true");
      setPendingSpinPopup(false);
    }
  }, [pendingSpinPopup, surpriseData]);

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
          setUserData(u);
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
        setUserData(u);
        setXp(u.xp || 0);
        setCoins(u.coins || 0);
        setChildName(u.childName || "Explorer");
        setChildPhoto(u.childPhoto || "");
        setUserLevel(u.level || 1);
        setStreakDays(u.streakDays || 0);
      } catch(e) {}
    }

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
                setPendingSpinPopup(true);
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
    window.addEventListener('userDataUpdated', fetchProfile);

    // Poll every 10 seconds so missions update quickly after being completed
    const pollInterval = setInterval(fetchMissions, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('userDataUpdated', fetchProfile);
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
        if (data.error) {
          console.warn(data.error);
          return;
        }
        // Add coins and XP visually
        if (data.coinReward) setCoins(prev => prev + (data.coinReward || 0));
        if (data.xpReward) setXp(prev => prev + (data.xpReward || 0));
        
        // Instantly fetch updated missions so the NEXT mission in sequence populates!
        fetchMissions();
      }
    } catch (e) {
      console.error("Failed to complete mission");
    }
  };

  // XP Thresholds for cities (aligned with JourneyMapScreen)
  const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000, 50000];

  // Calculate destination progress based on fetched cities and xp thresholds
  let currentCityIndex = 0;
  if (citiesData.length > 0) {
    for (let i = 0; i < citiesData.length; i++) {
      const requiredXp = xpThresholds[i] || (i * 5000); // fallback for any extra cities
      if (xp >= requiredXp) {
        currentCityIndex = i;
      }
    }
  }

  const nextLockedIndex = citiesData.length > 0 ? Math.min(citiesData.length - 1, currentCityIndex + 1) : 0;
  const currentCityName = citiesData.length > 0 ? citiesData[currentCityIndex].name : "Egg Village";
  const nextCityName = citiesData.length > 0 ? citiesData[nextLockedIndex].name : "Forest Kingdom";
  
  const targetXp = citiesData.length > 0 ? (xpThresholds[nextLockedIndex] || (nextLockedIndex * 5000)) : 1000;
  const prevMilestoneXp = citiesData.length > 0 ? (xpThresholds[currentCityIndex] || (currentCityIndex * 5000)) : 0;
  const xpNeeded = Math.max(0, targetXp - xp);
  const currentLegXpTotal = Math.max(1, targetXp - prevMilestoneXp);
  
  // Calculate leg percentage: if at initial milestone (e.g. initial 50 XP daily login streak reward), start at 0%
  const xpInLeg = Math.max(0, xp - prevMilestoneXp);
  let rawLegPercentage = currentLegXpTotal > 0 ? (xpInLeg / currentLegXpTotal) * 100 : 0;
  if (currentCityIndex === 0 && xpInLeg <= 50) {
    rawLegPercentage = 0;
  }
  const currentLegXpPercentage = Math.min(100, Math.max(0, Math.floor(rawLegPercentage)));


  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden pb-24">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] -right-[20%] w-[280px] h-[280px] rounded-full bg-[rgba(87,250,233,0.12)] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* Top Section */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] z-50 backdrop-blur-md gap-2">
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
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-[#141779] leading-tight truncate">{childName}</h1>
              <button
                onClick={() => setShowSwitcher(true)}
                title="Switch Child Profile"
                className="p-1 rounded-lg bg-indigo-50 text-[#141779] hover:bg-indigo-100 transition-colors flex items-center gap-1 text-[10px] font-bold border border-indigo-100 shrink-0"
              >
                <Users size={12} />
                <span>Switch</span>
              </button>
            </div>
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

      <main className="px-6 pt-[100px] flex flex-col gap-6">
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

      {/* DAILY MISSIONS MODAL */}
      <AnimatePresence>
        {showDailyMissionModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white/95 backdrop-blur-xl text-slate-900 w-full max-w-[420px] max-h-[88vh] p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-white/80 shadow-[0_30px_80px_-15px_rgba(20,23,121,0.35)] flex flex-col gap-3.5 sm:gap-5 relative overflow-hidden my-auto"
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100/80 relative z-10">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300 shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">Daily Quests</h3>
                      <span className="text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs border border-amber-400 shrink-0">
                        ⚡ {todayCompletedCount}/25
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 truncate">Continuous 5,000 Missions Journey</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDailyMissionModal(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center font-extrabold text-xs sm:text-sm transition-all active:scale-90 shrink-0 ml-1"
                >
                  ✕
                </button>
              </div>

              {/* Daily Limit Reached Summary */}
              {dailyLimitReached ? (
                <div className="p-5 sm:p-6 bg-gradient-to-b from-amber-50 to-amber-100/60 rounded-2xl sm:rounded-3xl border border-amber-200/80 text-center flex flex-col items-center gap-2.5 sm:gap-3 shadow-inner relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
                    🏆
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-amber-950">25 / 25 Quests Mastered Today!</h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-800 leading-relaxed">
                    Sensational effort! You have completed today's maximum 25 quests. Tomorrow starts your next continuous sequence!
                  </p>
                </div>
              ) : (
                /* Missions List */
                <div className="flex flex-col gap-2.5 sm:gap-3.5 max-h-[55vh] sm:max-h-[380px] overflow-y-auto pr-0.5 relative z-10 custom-scrollbar">
                  {(missions && missions.length > 0 ? missions : [
                    { seq: 1, id: "seq_1", title: "Answer 10 Questions", coin_reward: 10, xp_reward: 20, current_progress: 0, target_progress: 10, status: "pending", mission_type: "answer_questions" },
                    { seq: 2, id: "seq_2", title: "Win 1 Boss Battle", coin_reward: 15, xp_reward: 20, current_progress: 0, target_progress: 1, status: "pending", mission_type: "boss_win" },
                    { seq: 3, id: "seq_3", title: "Win 1 Shadow Arena Battle", coin_reward: 50, xp_reward: 50, current_progress: 0, target_progress: 1, status: "pending", mission_type: "shadow_arena_win" }
                  ]).map((mission) => {
                    const isDone = mission.status === "completed";
                    const isReady = mission.status === "ready_to_claim" || (mission.current_progress >= (mission.target_progress || 1) && !isDone);
                    const cur = mission.current_progress || 0;
                    const target = mission.target_progress || 1;
                    const pct = Math.min(100, Math.round((cur / target) * 100));

                    const getIcon = () => {
                      if (mission.mission_type === "boss_win") return "⚔️";
                      if (mission.mission_type === "shadow_arena_win") return "👑";
                      return "🎯";
                    };

                    return (
                      <div
                        key={mission.id || `seq_${mission.seq}`}
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                          isDone
                            ? "bg-emerald-50/80 border-emerald-200/90 text-emerald-950 shadow-xs"
                            : isReady
                            ? "bg-gradient-to-r from-amber-50/90 via-amber-100/70 to-amber-50/90 border-amber-300 shadow-md ring-2 ring-amber-400/40"
                            : "bg-slate-50/90 border-slate-200/80 text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-base sm:text-xl font-bold shadow-xs ${
                              isDone 
                                ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                                : isReady
                                ? "bg-amber-500 text-white animate-bounce shadow-amber-500/30"
                                : "bg-indigo-600 text-white shadow-indigo-600/20"
                            }`}>
                              {isDone ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : getIcon()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-indigo-600/10 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-600/20 shrink-0">
                                  #{mission.seq}
                                </span>
                                <h4 className="text-[11px] sm:text-xs font-black text-slate-900 truncate tracking-tight">{mission.title}</h4>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-extrabold">
                                <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  🪙 +{mission.coin_reward || mission.coinReward || 10}
                                </span>
                                <span className="inline-flex items-center gap-0.5 bg-indigo-500/10 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                  ⭐ +{mission.xp_reward || mission.xpReward || 20}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Action Button */}
                          {isDone ? (
                            <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0 border border-emerald-300/80 shadow-xs flex items-center gap-1">
                              ✓ Claimed
                            </span>
                          ) : isReady ? (
                            <button
                              onClick={() => {
                                completeMission(mission.id || `seq_${mission.seq}`);
                              }}
                              className="text-[10px] sm:text-[11px] font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 active:scale-95 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shrink-0 shadow-md shadow-amber-500/30 animate-pulse transition-all border border-amber-300"
                            >
                              🎁 CLAIM
                            </button>
                          ) : (
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-[10px] sm:text-[11px] font-black text-slate-600 bg-slate-200/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-300/60 shadow-xs">
                                {cur} / {target}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar (if not completed) */}
                        {!isDone && (
                          <div className="w-full bg-slate-200/90 h-2 sm:h-2.5 rounded-full overflow-hidden mt-2 sm:mt-2.5 border border-slate-200/60 p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                isReady 
                                  ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm shadow-amber-500/50" 
                                  : "bg-gradient-to-r from-indigo-500 to-indigo-700"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer Action */}
              <button
                onClick={() => setShowDailyMissionModal(false)}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-slate-100 to-slate-200/80 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-black rounded-xl sm:rounded-2xl text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-xs active:scale-98 border border-slate-200 relative z-10"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* FLOATING DAILY MISSIONS CLOCK ICON (Just below Spin Wheel icon) */}
      <motion.div
        className="fixed bottom-24 right-4 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => {
            fetchMissions();
            setShowDailyMissionModal(true);
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#141779] to-[#30007f] text-amber-300 shadow-[0_4px_15px_rgba(20,23,121,0.3)] flex items-center justify-center border-2 border-amber-300/40 relative hover:scale-105 transition-transform"
        >
          <Clock className="w-7 h-7 animate-pulse" />
          {/* Badge indicator if claimable missions exist */}
          {missions.some(m => m.status === 'ready_to_claim') && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white animate-bounce">
              !
            </span>
          )}
        </button>
      </motion.div>

      {/* DAILY FREE SPIN AUTO-POPUP */}
      <AnimatePresence>
        {showSpinPopup && (
          <div className="fixed inset-0 z-[100] bg-[#f7f9fb]/95 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-[360px] p-7 rounded-[32px] flex flex-col items-center text-center gap-5 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              {/* Background ambient glows */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center border border-teal-200 shadow-sm animate-bounce z-10">
                <Gift className="w-10 h-10 text-[#006a62]" />
              </div>
              <div className="z-10">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 mb-2 inline-block">
                  Daily Bonus 🎁
                </span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Free Spin Available!</h3>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-2">
                  You have a free daily spin waiting. Spin the Quantum Wheel to unlock coins, XP, boosters, and legendary companion skins!
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-full z-10">
                <button
                  onClick={() => {
                    setShowSpinPopup(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#007168] to-[#004e48] text-white font-extrabold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wide text-xs shadow-md border border-teal-600/30 flex items-center justify-center gap-2"
                >
                  <span>🎰 Spin Now</span>
                </button>
                <button
                  onClick={() => setShowSpinPopup(false)}
                  className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 active:scale-95 transition-all text-xs border border-slate-200"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChildSwitcherModal 
        isOpen={showSwitcher} 
        onClose={() => setShowSwitcher(false)} 
        user={userData} 
        onUserUpdated={(u) => setUserData(u)} 
      />

    </div>
  );
}
