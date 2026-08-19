import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, CheckCircle, ChevronRight, Clock, Gift, Map, MapPin, Shield, Star, Target, Zap, Bell, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import AdventureHero from "../../../components/AdventureHero";


interface AdventureTheme {
  type: string;
  title: string;
  bgGradient: string;
  bgColor: string;
  character: string;
  characterName: string;
  particle: string;
  rewardIcon: string;
  rewardName: string;
  rewardXpText: string;
  ctaText: string;
}

const ADVENTURE_THEMES: Record<string, AdventureTheme> = {
  dragon: {
    type: "dragon",
    title: "🐉 DRAGON VALLEY",
    bgGradient: "from-emerald-400 via-teal-300 to-sky-200",
    bgColor: "border-emerald-400 text-emerald-950",
    character: "🐉",
    characterName: "Flame Dragon",
    particle: "🔥",
    rewardIcon: "🥚",
    rewardName: "DRAGON EGG",
    rewardXpText: "XP TO HATCH EGG",
    ctaText: "CONTINUE ADVENTURE →"
  },
  science: {
    type: "science",
    title: "🧪 SCIENCE LAB",
    bgGradient: "from-indigo-400 via-purple-300 to-pink-200",
    bgColor: "border-indigo-400 text-indigo-950",
    character: "🧪",
    characterName: "Scientist Owl",
    particle: "⚡",
    rewardIcon: "🔬",
    rewardName: "QUANTUM MICROSCOPE",
    rewardXpText: "XP TO UNLOCK LAB",
    ctaText: "ENTER LAB →"
  },
  social: {
    type: "social",
    title: "🏆 CHAMPION'S ARENA",
    bgGradient: "from-amber-400 via-orange-300 to-yellow-200",
    bgColor: "border-amber-400 text-amber-950",
    character: "🏆",
    characterName: "Champion Star",
    particle: "⭐",
    rewardIcon: "🥉",
    rewardName: "BRONZE MEDAL",
    rewardXpText: "XP TO CLAIM MEDAL",
    ctaText: "TAKE CHALLENGE →"
  },
  space: {
    type: "space",
    title: "🚀 QUANTUM SPACE",
    bgGradient: "from-slate-900 via-indigo-950 to-indigo-900",
    bgColor: "border-indigo-400 text-indigo-200",
    character: "🚀",
    characterName: "Astronaut Rover",
    particle: "✨",
    rewardIcon: "🛸",
    rewardName: "ALIEN SATELLITE",
    rewardXpText: "XP TO UNLOCK SPACE STATION",
    ctaText: "LAUNCH ROCKET →"
  },
  ocean: {
    type: "ocean",
    title: "🌊 UNDERWATER TRENCH",
    bgGradient: "from-sky-500 via-cyan-400 to-teal-300",
    bgColor: "border-cyan-400 text-cyan-950",
    character: "🌊",
    characterName: "Deep Diver",
    particle: "🫧",
    rewardIcon: "🏴‍☠️",
    rewardName: "SUNKEN TREASURE",
    rewardXpText: "XP TO OPEN TREASURE",
    ctaText: "DIVE DEEP →"
  },
  history: {
    type: "history",
    title: "📜 ANCIENT RUINS",
    bgGradient: "from-amber-600 via-yellow-500 to-orange-400",
    bgColor: "border-amber-600 text-amber-950",
    character: "📜",
    characterName: "Ruins Explorer",
    particle: "🏺",
    rewardIcon: "🏺",
    rewardName: "ANCIENT URN",
    rewardXpText: "XP TO UNLOCK TEMPLE",
    ctaText: "EXPLORE RUINS →"
  }
};

const RenderThemeAnimationElements = ({ themeType }: { themeType: string }) => {
  if (themeType === "dragon") {
    return (
      <>
        <motion.div
          animate={{ x: [-40, 360] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-4 left-0 text-3xl opacity-30 pointer-events-none select-none"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [360, -40] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          className="absolute top-10 left-0 text-2xl opacity-20 pointer-events-none select-none"
        >
          ☁️
        </motion.div>
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 120, x: 50 + i * 80, opacity: 0, scale: 0.5 }}
            animate={{ y: [120, 20], opacity: [0, 0.7, 0.7, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.8 }}
            className="absolute text-sm pointer-events-none select-none"
          >
            🔥
          </motion.div>
        ))}
      </>
    );
  }
  if (themeType === "science") {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 130, x: 40 + i * 110, opacity: 0 }}
            animate={{ y: [130, 10], opacity: [0, 0.6, 0.6, 0], rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 1.2 }}
            className="absolute text-lg pointer-events-none select-none"
          >
            ⚛️
          </motion.div>
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, x: 80 + i * 90, y: 30 + i * 20 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
            className="absolute text-xs pointer-events-none select-none text-yellow-300"
          >
            ⚡
          </motion.div>
        ))}
      </>
    );
  }
  if (themeType === "social") {
    return (
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0.2 }}
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.2, 0.9, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
            className="absolute text-base pointer-events-none select-none text-yellow-400"
            style={{ top: `${20 + i * 25}px`, left: `${30 + i * 100}px` }}
          >
            ⭐
          </motion.div>
        ))}
      </>
    );
  }
  if (themeType === "space") {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.3 }}
            className="absolute text-[8px] pointer-events-none select-none text-white"
            style={{ top: `${15 + i * 20}px`, left: `${20 + i * 80}px` }}
          >
            ✨
          </motion.div>
        ))}
      </>
    );
  }
  if (themeType === "ocean") {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 140, x: 30 + i * 75, opacity: 0 }}
            animate={{ y: [140, 10], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.6 }}
            className="absolute text-xs pointer-events-none select-none text-cyan-200"
          >
            🫧
          </motion.div>
        ))}
      </>
    );
  }
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 130, x: 60 + i * 100, opacity: 0 }}
          animate={{ y: [130, 20], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 5, delay: i * 1.5 }}
          className="absolute text-sm pointer-events-none select-none"
        >
          🏺
        </motion.div>
      ))}
    </>
  );
};

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
  const [retentionTrigger, setRetentionTrigger] = useState(0);



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
    } catch (e) { }
  };

  // Unscripted Game Elements
  const [surpriseData, setSurpriseData] = useState<any>(null);
  const [chestTaps, setChestTaps] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasFreeSpin, setHasFreeSpin] = useState(false);
  const [showSpinPopup, setShowSpinPopup] = useState(false);
  const [pendingSpinPopup, setPendingSpinPopup] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakRevivalData, setStreakRevivalData] = useState<any>(null);
  const [showRevivalModal, setShowRevivalModal] = useState(false);
  const [revivalError, setRevivalError] = useState("");
  const [revivalLoading, setRevivalLoading] = useState(false);

  const handleReviveStreak = async () => {
    setRevivalError("");
    setRevivalLoading(true);
    try {
      const res = await apiFetch("/api/retention/streak/revive", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setShowRevivalModal(false);
        setCoins(json.coins);
        setStreakDays(json.current_streak);
        fetchProfile();
        
        // Re-fetch retention streak details so UI updates streakDaysOfWeek and currentStreak
        try {
          const stRes = await apiFetch("/api/retention/streak");
          if (stRes.ok) {
            const stData = await stRes.json();
            setRetentionStreak(stData);
          }
        } catch (e) {}

        setShowStreakModal(true);
      } else {
        setRevivalError(json.message || "You don't have enough coins to revive your streak!");
      }
    } catch (e) {
      setRevivalError("Failed to revive streak. Please try again.");
    } finally {
      setRevivalLoading(false);
    }
  };

  const handleDeclineRevival = async () => {
    try {
      await apiFetch("/api/retention/streak/decline", { method: "POST" });
    } catch (e) {}
    setShowRevivalModal(false);
    setStreakDays(0);
    fetchProfile();

    try {
      const stRes = await apiFetch("/api/retention/streak");
      if (stRes.ok) {
        const stData = await stRes.json();
        setRetentionStreak(stData);
      }
    } catch (e) {}
  };

  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [journeyData, setJourneyData] = useState<any>(null);

  useEffect(() => {
    if (pendingSpinPopup && !surpriseData) {
      setShowSpinPopup(true);
      sessionStorage.setItem("dailySpinPopupShown", "true");
      setPendingSpinPopup(false);
    }
  }, [pendingSpinPopup, surpriseData]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data) {
        setUnreadCount(json.data.filter((n: any) => !n.isRead).length);
      }
    } catch (e) { }
  };

  const fetchJourneyData = async () => {
    try {
      const res = await apiFetch("/api/journey/progress");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setJourneyData(json.data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch journey progress", e);
    }
  };



  const fetchProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      const response = await apiFetch("/api/users/me");
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

  useEffect(() => {
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
      } catch (e) { }
    }

    const loadAllDashboardData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const profilePromise = fetchProfile();
      const missionsPromise = fetchMissions();
      const notificationsPromise = fetchNotifications();

      const citiesPromise = (async () => {
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
      })();

      const surprisePromise = (async () => {
        try {
          const surRes = await apiFetch("/api/retention/surprise");
          if (surRes.ok) {
            const surData = await surRes.json();
            if (surData && surData.reward_type) {
              setSurpriseData(surData);
              setChestTaps(0);
            }
          }
        } catch (e) { }
      })();

      const spinWheelPromise = (async () => {
        try {
          const spinRes = await apiFetch("/api/retention/spin-wheel/status");
          if (spinRes.ok) {
            const spinData = await spinRes.json();
            if (spinData && spinData.balances) {
              const dailyCount = spinData.balances.daily_spins_balance || 0;
              const hasSpin = dailyCount > 0 || (spinData.balances.event_spins_balance || 0) > 0;
              setHasFreeSpin(hasSpin);

              if (dailyCount > 0 && sessionStorage.getItem("dailySpinPopupShown") !== "true") {
                setPendingSpinPopup(true);
              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch spin wheel status", e);
        }
      })();

      const streakSequencePromise = (async () => {
        try {
          try {
            const statusRes = await apiFetch("/api/retention/streak/status");
            if (statusRes.ok) {
              const sData = await statusRes.json();
              if (sData.lostStreak) {
                setStreakRevivalData(sData);
                setShowRevivalModal(true);
              }
            }
          } catch (e) { }

          const stRes = await apiFetch("/api/retention/streak");
          if (stRes.ok) {
            const stData = await stRes.json();
            setRetentionStreak(stData);
          }
        } catch (e) {
          console.error("Failed to fetch streak info", e);
        }
      })();

      const journeyPromise = fetchJourneyData();

      await Promise.allSettled([
        profilePromise,
        missionsPromise,
        notificationsPromise,
        citiesPromise,
        surprisePromise,
        spinWheelPromise,
        streakSequencePromise,
        journeyPromise
      ]);
    };

    loadAllDashboardData();

    // Re-fetch missions whenever the user switches back to this tab/screen
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadAllDashboardData();
      }
    };

    const handleUserDataUpdated = () => {
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
        } catch (e) {
          console.error("Failed to parse cached userData:", e);
        }
      } else {
        fetchProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('userDataUpdated', handleUserDataUpdated);

    // Poll every 10 seconds so missions update quickly after being completed
    const pollInterval = setInterval(fetchMissions, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
      clearInterval(pollInterval);
    };
  }, [retentionTrigger]);

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

  const getAdventureTheme = (): typeof ADVENTURE_THEMES[keyof typeof ADVENTURE_THEMES] => {
    const name = currentCityName.toLowerCase();
    if (name.includes("desert") || name.includes("forest") || name.includes("egg") || name.includes("valley")) {
      return ADVENTURE_THEMES.dragon;
    }
    if (name.includes("lab") || name.includes("science") || name.includes("experiment") || name.includes("quantum")) {
      return ADVENTURE_THEMES.science;
    }
    if (name.includes("arena") || name.includes("champion") || name.includes("medal") || name.includes("habits")) {
      return ADVENTURE_THEMES.social;
    }
    if (name.includes("space") || name.includes("planet") || name.includes("star") || name.includes("rocket") || name.includes("galaxy")) {
      return ADVENTURE_THEMES.space;
    }
    if (name.includes("ocean") || name.includes("water") || name.includes("trench") || name.includes("sea") || name.includes("treasure")) {
      return ADVENTURE_THEMES.ocean;
    }
    if (name.includes("ruins") || name.includes("ancient") || name.includes("history") || name.includes("temple")) {
      return ADVENTURE_THEMES.history;
    }
    
    const keys = Object.keys(ADVENTURE_THEMES);
    const themeKey = keys[userLevel % keys.length];
    return ADVENTURE_THEMES[themeKey] || ADVENTURE_THEMES.dragon;
  };

  const theme = getAdventureTheme();

  const totalMissions = missions.length || 4;
  const completedMissions = missions.filter((m: any) => m.status === "completed").length;
  const hatchPct = Math.round((completedMissions / totalMissions) * 100);
  const remainingQuests = totalMissions - completedMissions;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden pb-24">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] -right-[20%] w-[280px] h-[280px] rounded-full bg-[rgba(87,250,233,0.12)] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* Top Section */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#f7f9fb]/90 border-b border-slate-100 z-50 backdrop-blur-md gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full border border-teal-200 overflow-hidden hover:opacity-80 transition-opacity shrink-0"
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
            <h1 className="text-sm font-black text-slate-800 leading-tight truncate">{childName}</h1>
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star size={10} fill="#006a62" color="#006a62" className="shrink-0" />
              <span className="text-[10px] text-slate-500 font-bold truncate">{t('explorer_level')} {userLevel}</span>
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowStreakModal(true)}
            className="h-8.5 bg-orange-50 px-2 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-orange-100 whitespace-nowrap"
          >
            <span className="text-[11px] font-black text-orange-600">🔥 {retentionStreak?.currentStreak ?? streakDays}</span>
          </button>
          
          <button
            onClick={() => navigate("/notifications")}
            className="w-8.5 h-8.5 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all shrink-0 border border-slate-200/40"
          >
            <div className="relative">
              <Bell size={15} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => navigate("/practice/inventory")}
            className="h-8.5 bg-amber-50 px-2 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-amber-100 whitespace-nowrap shrink-0"
          >
            <span className="text-[11px] font-black text-amber-700">🪙 {coins}</span>
          </button>
        </div>
      </header>

      <main className="px-6 pt-[76px] flex flex-col gap-5 max-w-md mx-auto w-full">
        {/* 1. HERO SECTION - MY LEARNING ADVENTURE */}
        {(() => {
          const activeMission = missions.find(m => m.status !== 'claimed') || missions[0];
          return (
            <AdventureHero
              themeKey={journeyData?.tierKey === "scientist" ? "science" : journeyData?.tierKey === "social_proof" ? "social" : "dragon"}
              xp={xp}
              targetXp={targetXp}
              currentLocationName={journeyData?.currentLocation || currentCityName}
              destinationName={journeyData?.nextNodeName || nextCityName}
              journeyData={journeyData}
              onCtaClick={() => navigate("/practice/journey-map")}
              onMissionClick={() => navigate("/practice/chapters")}
              missionTitle={activeMission?.title}
              missionProgress={activeMission ? { current: activeMission.current_progress || 0, total: activeMission.target_progress || 1 } : undefined}
              missionRewardText={activeMission ? `+${activeMission.xp_reward} XP & ${activeMission.coin_reward} Coins` : undefined}
            />
          );
        })()}

        {/* 2. RECENT UNLOCK / NEXT UNLOCK */}
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black text-[#141779] tracking-widest uppercase">
              {journeyData?.completedChapters > 0 ? "Recent Unlock" : "Next Unlock"}
            </h2>
            <span className="text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs uppercase tracking-wider animate-pulse">
              {journeyData?.completedChapters > 0 ? "✨ UNLOCKED" : "🎯 IN PROGRESS"}
            </span>
          </div>
          <div 
            onClick={() => navigate("/practice/journey-map")}
            className="bg-gradient-to-r from-amber-50/70 to-yellow-50/70 border-2 border-amber-100 rounded-[24px] p-4 flex items-center gap-4 shadow-sm relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0 select-none">
              {journeyData?.currentEmoji || "🐉"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-tight">
                {journeyData?.completedChapters > 0 ? journeyData.currentLocation : (journeyData?.nextNodeName || nextCityName)}
              </h3>
              <div className="flex justify-between items-center text-[9px] font-black text-amber-700 mt-1 uppercase">
                <span>{journeyData ? `Next: ${journeyData.nextNodeName}` : "Unlock Progress"}</span>
                <span>{journeyData?.progressPercentage || currentLegXpPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden p-0.5 border border-amber-200/40 mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${journeyData?.progressPercentage || currentLegXpPercentage}%` }}
                />
              </div>
              <p className="text-[9px] font-bold text-amber-800 mt-1.5 truncate">
                🎯 {journeyData ? (journeyData.chaptersNeededForNext > 0 ? `${journeyData.chaptersNeededForNext} chapter(s) remaining to unlock ${journeyData.nextNodeName}!` : "Stage Completed! All chapters clear!") : `${xpNeeded} XP needed to unlock ${nextCityName}!`}
              </p>
            </div>
          </div>
        </div>

        {/* 4. QUICK ACTIONS BENTO GRID */}
        <div className="flex flex-col gap-3 relative z-10">
          <h2 className="text-[10px] font-bold text-[#767683] tracking-[1.5px] px-1 uppercase">{t('explorer_mission_controls')}</h2>

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

        {/* 5. PARENT SPACE LINK */}
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
          <div className="fixed inset-0 z-[100] bg-slate-950/80 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white text-slate-950 w-full max-w-[430px] max-h-[90vh] p-5 sm:p-7 rounded-[32px] border-2 border-slate-200 shadow-2xl flex flex-col gap-4 sm:gap-6 relative overflow-hidden my-auto"
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-white shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight truncate">Daily Quests</h3>
                      <span className="text-[10px] sm:text-xs font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-400 shrink-0">
                        ⚡ {todayCompletedCount}/25
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">Continuous 5,000 Missions Journey</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDailyMissionModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950 flex items-center justify-center font-extrabold text-sm transition-all active:scale-90 shrink-0 ml-1"
                >
                  ✕
                </button>
              </div>

              {/* Daily Limit Reached Summary */}
              {dailyLimitReached ? (
                <div className="p-6 bg-gradient-to-b from-amber-50 to-amber-100/40 rounded-[24px] border-2 border-amber-200 text-center flex flex-col items-center gap-3 shadow-sm relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-amber-500/25 animate-bounce">
                    🏆
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-amber-950">25 / 25 Quests Mastered Today!</h4>
                  <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                    Sensational effort! You have completed today's maximum 25 quests. Tomorrow starts your next continuous sequence!
                  </p>
                </div>
              ) : (
                /* Missions List */
                <div className="flex flex-col gap-3 max-h-[60vh] sm:max-h-[420px] overflow-y-auto pr-1 relative z-10 custom-scrollbar">
                  {(missions && missions.length > 0 ? missions : [
                    { seq: 1, id: "seq_1", title: "Answer 10 Questions", coin_reward: 10, xp_reward: 20, current_progress: 0, target_progress: 10, status: "pending", mission_type: "answer_questions" },
                    { seq: 2, id: "seq_2", title: "Win 1 Boss Battle", coin_reward: 15, xp_reward: 20, current_progress: 0, target_progress: 1, status: "pending", mission_type: "boss_win" },
                    { seq: 3, id: "seq_3", title: "Win 1 Shadow Arena Battle", coin_reward: 50, xp_reward: 50, current_progress: 0, target_progress: 1, status: "pending", mission_type: "shadow_arena_win" }
                  ]).map((mission, index) => {
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
                      <motion.div
                        key={mission.id || `seq_${mission.seq}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                        whileHover={{ scale: 1.015 }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${isDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm"
                            : isReady
                              ? "bg-amber-50/70 border-amber-300 shadow-md ring-2 ring-amber-400/20"
                              : "bg-slate-50 border-slate-200 text-slate-900 hover:border-indigo-200 hover:bg-white"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold border ${isDone
                                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                : isReady
                                  ? "bg-amber-500 border-amber-400 text-slate-950 animate-bounce shadow-lg shadow-amber-500/25"
                                  : "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                              }`}>
                              {isDone ? <CheckCircle className="w-6 h-6" /> : getIcon()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-wider bg-[#141779] text-white px-2 py-0.5 rounded-md shrink-0">
                                  #{mission.seq}
                                </span>
                                <h4 className="text-sm sm:text-base font-black text-slate-950 whitespace-normal break-words leading-snug tracking-tight">
                                  {mission.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-black flex-wrap">
                                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-lg border border-amber-200">
                                  🪙 +{mission.coin_reward || mission.coinReward || 10}
                                </span>
                                <span className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                                  ⭐ +{mission.xp_reward || mission.xpReward || 20}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Action Button */}
                          {isDone ? (
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl shrink-0 border border-emerald-200 shadow-xs flex items-center gap-1">
                              ✓ Claimed
                            </span>
                          ) : isReady ? (
                            <button
                              onClick={() => {
                                completeMission(mission.id || `seq_${mission.seq}`);
                              }}
                              className="text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 active:scale-95 px-4 py-2 rounded-xl shrink-0 shadow-lg shadow-amber-500/30 animate-pulse border border-amber-300"
                            >
                              🎁 CLAIM
                            </button>
                          ) : (
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-xs font-black text-slate-700 bg-slate-200/80 px-2.5 py-1 rounded-xl border border-slate-300/40">
                                {cur} / {target}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar (if not completed) */}
                        {!isDone && (
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3 border border-slate-300/30 p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${isReady
                                  ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm"
                                  : "bg-gradient-to-r from-indigo-500 to-indigo-700"
                                }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Close Bottom Area */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowDailyMissionModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SURPRISE CHEST MINIGAME MODAL */}
      {surpriseData && chestTaps < 2 && (
        <div className="fixed inset-0 z-[100] bg-[#f7f9fb]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ y: -500, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-center flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-[#141779] mb-8 animate-pulse text-center">{t('wild_surprise')}</h2>
            <motion.button
              onClick={() => {
                if (chestTaps === 0) {
                  setChestTaps(1);
                  setTimeout(() => setChestTaps(2), 1200);
                }
              }}
              animate={chestTaps === 1 ? {
                scale: [1, 1.2, 1.1, 1.3, 1.5],
                rotate: [0, -10, 10, -15, 15, -20, 20, 0]
              } : {}}
              transition={chestTaps === 1 ? { duration: 1.2, ease: "easeInOut" } : {}}
              whileHover={chestTaps === 0 ? { scale: 1.1, rotate: 5 } : {}}
              whileTap={chestTaps === 0 ? { scale: 0.8, rotate: -15 } : {}}
              className="text-[140px] cursor-pointer relative filter drop-shadow-md"
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
            <p className="text-[#006a62] mt-12 font-bold text-xl bg-white border border-teal-200 px-6 py-3 rounded-full shadow-md animate-pulse">
              {chestTaps === 1 ? t('opening') : t('tap_to_open')}
            </p>
          </motion.div>
        </div>
      )}

      {/* REWARD REVEAL */}
      {surpriseData && chestTaps >= 2 && (
        <div className="fixed inset-0 z-[100] bg-[#f7f9fb]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center relative shadow-2xl border border-slate-200"
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
              className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200 relative overflow-hidden"
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
          className={`w-14 h-14 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95 ${hasFreeSpin
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
          <div className="fixed inset-0 z-[100] bg-[#f7f9fb]/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#111453]/95 via-[#141779]/95 to-[#0b0c3f]/95 text-white w-full max-w-[360px] p-7 rounded-[32px] flex flex-col items-center text-center gap-5 border border-white/10 shadow-[0_20px_50px_rgba(20,23,121,0.5)] relative overflow-hidden"
            >
              {/* Radial ambient glow behind card contents */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(87,250,233,0.12)_0%,transparent_65%)] pointer-events-none" />
              
              {/* Background corner glows */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              <div className="relative w-20 h-20 rounded-full bg-[rgba(87,250,233,0.08)] flex items-center justify-center border border-[#57fae9]/40 shadow-[0_0_30px_rgba(87,250,233,0.25)] z-10">
                {/* Rotating dashed ring */}
                <div 
                  className="absolute inset-[-6px] border-2 border-dashed border-[#57fae9]/40 rounded-full pointer-events-none"
                  style={{ animation: 'spin 20s linear infinite' }}
                />
                <Gift className="w-10 h-10 text-[#57fae9] filter drop-shadow-[0_0_8px_rgba(87,250,233,0.6)] animate-pulse" />
              </div>

              <div className="z-10">
                <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_2px_10px_rgba(249,115,22,0.3)] mb-3.5 inline-block border-0">
                  Daily Bonus 🎁
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-teal-200">
                  Free Spin Available!
                </h3>
                <p className="text-[11px] font-medium text-slate-300/90 leading-relaxed mt-2.5 max-w-[280px] mx-auto">
                  Your daily ticket is ready. Spin the <span className="text-[#57fae9] font-black">Quantum Wheel</span> to claim legendary skins, XP multipliers, and bonus coins!
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full z-10">
                <button
                  onClick={() => {
                    setShowSpinPopup(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#57fae9] via-[#00f2fe] to-[#4facfe] text-[#141779] font-black rounded-2xl hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest text-[11px] shadow-[0_0_25px_rgba(87,250,233,0.5)] flex items-center justify-center gap-2 border-0"
                >
                  <span>🎰 Spin Now</span>
                </button>
                <button
                  onClick={() => setShowSpinPopup(false)}
                  className="w-full py-3 bg-white/5 text-slate-400 font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition-all text-xs transition-colors duration-200"
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

      <AnimatePresence>
        {showStreakModal && (
          <div className="fixed inset-0 z-[110] bg-[#f7f9fb]/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-[#111453]/95 via-[#141779]/95 to-[#0b0c3f]/95 text-white border border-white/10 w-full max-w-sm rounded-[32px] p-8 text-center relative shadow-[0_20px_50px_rgba(20,23,121,0.5)] flex flex-col items-center justify-between gap-6 overflow-hidden"
            >
              {/* Background ambient glows */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />

              <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 z-10">
                {/* Large Duolingo Fire Flame */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-full h-full text-[140px] flex items-center justify-center filter drop-shadow-[0_8px_25px_rgba(255,159,67,0.4)] select-none animate-pulse"
                  >
                    🔥
                  </motion.div>
                  {/* Streak Number Overlay */}
                  <span className="absolute text-4xl font-black text-white mt-10 select-none">
                    {retentionStreak?.currentStreak ?? streakDays}
                  </span>
                </div>

                {/* Day of Week Row (Sun to Sat) */}
                <div className="flex justify-between w-full px-1 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                    const isActive = Boolean(retentionStreak?.streakDaysOfWeek?.[idx]);
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner border ${
                            isActive
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white"
                              : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1 mt-2">
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {retentionStreak?.currentStreak ?? streakDays} Day Streak!
                  </h2>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed px-4">
                    Your longest streak is {retentionStreak?.longestStreak ?? streakDays} days. Keep up the consistency!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#57fae9] to-[#00c9b7] text-[#141779] font-black text-xs shadow-[0_4px_15px_rgba(87,250,233,0.3)] uppercase tracking-wider active:scale-95 transition-all mt-4 z-10 border-0"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* STREAK REVIVAL MODAL */}
      {showRevivalModal && streakRevivalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-500/30 flex flex-col items-center text-center relative overflow-hidden animate-scale-up">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Icon Badge */}
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-4xl mb-4 border border-red-200 shadow-inner">
              💔
            </div>

            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              You Lost Your Streak!
            </h2>

            <p className="text-xs font-medium text-slate-600 mb-4 leading-relaxed">
              You missed <span className="font-black text-red-600">{streakRevivalData.missedDays} day(s)</span> and lost your <span className="font-black text-amber-600">{streakRevivalData.previousStreak}-day streak</span>!
            </p>

            {revivalError && (
              <div className="w-full mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-600 font-extrabold text-xs rounded-xl text-center shadow-xs">
                {revivalError}
              </div>
            )}

            <div className="w-full flex flex-col gap-2.5 mt-1">
              <button
                onClick={handleReviveStreak}
                disabled={revivalLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg border border-amber-300/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>🔥 Pay {streakRevivalData.reviveCost} Coins to Revive</span>
              </button>

              <button
                onClick={handleDeclineRevival}
                disabled={revivalLoading}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold text-xs rounded-2xl transition-all"
              >
                Start Fresh 🔄
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
