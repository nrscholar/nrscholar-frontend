import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, CheckCircle, ChevronRight, Clock, Gift, Map, Shield, Star, Bell, Crown, Gem, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import AdventureHero from "../../../components/AdventureHero";
import StreakModal from "../../../components/StreakModal";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [childName, setChildName] = useState("Explorer");
  const [childPhoto, setChildPhoto] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showDailyMissionModal, setShowDailyMissionModal] = useState(false);
  const [questTab, setQuestTab] = useState<'all' | 'active' | 'completed'>('all');


  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  const [missions, setMissions] = useState<any[]>([]);
  const [retentionStreak, setRetentionStreak] = useState<any>(null);
  const [retentionTrigger] = useState(0);

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


  const [unreadCount, setUnreadCount] = useState(0);
  const [hasFreeSpin, setHasFreeSpin] = useState(false);
  const [showSpinPopup, setShowSpinPopup] = useState(false);
  const [pendingSpinPopup, setPendingSpinPopup] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakRevivalData, setStreakRevivalData] = useState<any>(null);
  const [showRevivalModal, setShowRevivalModal] = useState(false);
  const [showRevivalConfirmModal, setShowRevivalConfirmModal] = useState(false);
  const [revivalError, setRevivalError] = useState("");
  const [revivalLoading, setRevivalLoading] = useState(false);

  const handleOpenRevivalConfirm = () => {
    if (!streakRevivalData) return;
    setRevivalError("");

    if ((coins || 0) < streakRevivalData.reviveCost) {
      setRevivalError("You don't have enough coins to revive your streak!");
      return;
    }

    setShowRevivalConfirmModal(true);
  };

  const handleReviveStreak = async () => {
    setRevivalError("");
    setRevivalLoading(true);
    try {
      const res = await apiFetch("/api/retention/streak/revive", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setShowRevivalConfirmModal(false);
        setShowRevivalModal(false);
        setCoins(json.coins);
        setStreakDays(json.current_streak);

        const cachedData = localStorage.getItem("userData");
        if (cachedData) {
          try {
            const u = JSON.parse(cachedData);
            u.coins = json.coins;
            u.streakDays = json.current_streak;
            localStorage.setItem("userData", JSON.stringify(u));
          } catch (e) { }
        }
        window.dispatchEvent(new Event("userDataUpdated"));

        fetchProfile();

        try {
          const stRes = await apiFetch("/api/retention/streak");
          if (stRes.ok) {
            const stData = await stRes.json();
            setRetentionStreak(stData);
          }
        } catch (e) { }

        setShowStreakModal(true);
      } else {
        setRevivalError(json.message || "You don't have enough coins to revive your streak!");
        setShowRevivalConfirmModal(false);
      }
    } catch (e) {
      setRevivalError("Failed to revive streak. Please try again.");
      setShowRevivalConfirmModal(false);
    } finally {
      setRevivalLoading(false);
    }
  };

  const handleDeclineRevival = async () => {
    setShowRevivalConfirmModal(false);
    setShowRevivalModal(false);
    setStreakDays(0);
    setRetentionStreak((prev: any) => ({
      ...(prev || {}),
      currentStreak: 0,
      streakDaysOfWeek: [false, false, false, false, false, false, false]
    }));
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.streakDays = 0;
        localStorage.setItem("userData", JSON.stringify(parsed));
      }
    } catch (e) {}

    try {
      await apiFetch("/api/retention/streak/decline", { method: "POST" });
    } catch (e) { }
    fetchProfile();

    try {
      const stRes = await apiFetch("/api/retention/streak");
      if (stRes.ok) {
        const stData = await stRes.json();
        setRetentionStreak(stData);
      }
    } catch (e) { }
  };

  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [dailyHabitData, setDailyHabitData] = useState<any>(null);

  useEffect(() => {
    if (pendingSpinPopup) {
      setShowSpinPopup(true);
      sessionStorage.setItem("dailySpinPopupShown", "true");
      setPendingSpinPopup(false);
    }
  }, [pendingSpinPopup]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data) {
        setUnreadCount(json.data.filter((n: any) => !n.isRead).length);
      }
    } catch (e) { }
  };

  const fetchJourneyData = async (userDoc?: any) => {
    try {
      const u = userDoc || userData;
      let url = "/api/journey/progress";
      if (u) {
        const params = new URLSearchParams();
        if (u.childClass) params.append("classLevel", u.childClass);
        if (u.childBoard) params.append("board", u.childBoard);
        if (u.activeChildId) params.append("child_id", u.activeChildId);

        const q = params.toString();
        if (q) {
          url += `?${q}`;
        }
      }
      const res = await apiFetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setJourneyData(json.data);
          try {
            localStorage.setItem("cachedJourneyData", JSON.stringify(json.data));
          } catch (e) { }
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
        fetchJourneyData(u);
      }
    } catch (e) {
      console.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    const cachedJ = localStorage.getItem("cachedJourneyData");
    if (cachedJ) {
      try {
        setJourneyData(JSON.parse(cachedJ));
      } catch (e) { }
    }

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
        fetchJourneyData(u);
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
      const dailyHabitPromise = (async () => {
        try {
          const res = await apiFetch("/api/practice/habits/daily");
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setDailyHabitData(json.data);
            }
          }
        } catch (e) {
          console.error("Failed to fetch daily habit info", e);
        }
      })();

      await Promise.allSettled([
        profilePromise,
        missionsPromise,
        notificationsPromise,
        citiesPromise,
        spinWheelPromise,
        streakSequencePromise,
        journeyPromise,
        dailyHabitPromise
      ]);
    };

    loadAllDashboardData();

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
        if (data.coinReward) setCoins(prev => prev + (data.coinReward || 0));
        if (data.xpReward) setXp(prev => prev + (data.xpReward || 0));
        fetchMissions();
      }
    } catch (e) {
      console.error("Failed to complete mission");
    }
  };

  const activeMission = missions.find(m => m.status !== 'claimed') || missions[0];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden pb-28 max-w-md mx-auto">
      {/* Dynamic Background Glows */}
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-[28px] shadow-xs z-50 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:opacity-90 transition-opacity shrink-0 bg-[#141779] shadow-xs"
          >
            {childPhoto ? (
              <img
                src={childPhoto}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#141779] text-white font-bold text-xs flex items-center justify-center">
                {childName ? childName.slice(0, 2).toUpperCase() : "NR"}
              </div>
            )}
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">{childName}</h1>
              <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                {userData?.childClass || t('class_10', { defaultValue: "Class 10" })}
              </span>

            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[12px] text-slate-400 font-extrabold whitespace-nowrap">
                {t('explorer_level', { defaultValue: "Explorer Level" })} {userLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowStreakModal(true)}
            className="bg-[#fff7ed] border border-orange-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[48px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
          >
            <span className="text-[11px] font-black text-[#ea580c] leading-none">🔥 {retentionStreak?.currentStreak ?? streakDays ?? 0}</span>
          </button>
          <button
            onClick={() => navigate("/practice/inventory")}
            className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[48px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
          >
            <span className="text-[11px] font-black text-[#b45309] leading-none">🪙 {coins || 0}</span>
          </button>
            <button
            onClick={() => navigate("/notifications")}
            className="w-9 h-9 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 transition-all shrink-0 border border-slate-100 relative"
          >
            <Bell size={16} className="text-[#1c1970]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

        </div>
      </header>

      <main className="px-5 pt-[78px] flex flex-col gap-4 relative z-10">
        {/* 1. ADVENTURE HERO CARD */}
        {(() => {
          const effectiveTheme = (() => {
            const themeParam = searchParams.get("theme");
            if (themeParam && ["dragon", "science", "social"].includes(themeParam)) return themeParam;
            if (journeyData?.tierKey === "scientist") return "science";
            if (journeyData?.tierKey === "social_proof") return "social";
            if (journeyData?.tierKey === "dragon") return "dragon";

            const childClassStr = userData?.childClass || "";
            const match = childClassStr.match(/\d+/);
            const classNum = match ? parseInt(match[0], 10) : 1;
            if (classNum >= 8) return "social";
            if (classNum >= 5) return "science";
            return "dragon";
          })();

          return (
            <AdventureHero
              themeKey={effectiveTheme}
              xp={xp}
              targetXp={1000}
              currentLocationName={journeyData?.currentLocation || "Egg Village"}
              destinationName={journeyData?.nextNodeName || "Forest Kingdom"}
              journeyData={journeyData}
              onCtaClick={() => navigate("/practice/journey-map")}
              onMissionClick={() => setShowDailyMissionModal(true)}
              missionTitle={activeMission?.title}
              missionProgress={activeMission ? { current: activeMission.current_progress ?? activeMission.currentProgress ?? 0, total: activeMission.target_progress ?? activeMission.targetProgress ?? 10 } : undefined}
              missionRewardText={activeMission ? `+${activeMission.xp_reward ?? activeMission.xpReward ?? 20} XP & ${activeMission.coin_reward ?? activeMission.coinReward ?? 10} Coins` : undefined}
              missionXpReward={activeMission ? (activeMission.xp_reward ?? activeMission.xpReward ?? activeMission.xp) : undefined}
              missionCoinReward={activeMission ? (activeMission.coin_reward ?? activeMission.coinReward ?? activeMission.coins) : undefined}
            />
          );
        })()}

        {/* 2. FOUR QUICK ACTION BENTO GRID (2x2 Cards with Continue Learning in position) */}
        <section className="grid grid-cols-2 gap-3">
          {/* Continue Learning */}
          <button
            onClick={() => navigate("/practice/chapters")}
            className="bg-[#e0e0ff] rounded-[24px] p-4 flex flex-col justify-between min-h-[145px] h-[145px] border border-[#c7c7ff]/70 shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-full bg-[rgba(20,23,121,0.12)] flex items-center justify-center">
              <BookOpen size={18} className="text-[#141779]" />
            </div>
            <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
              <ChevronRight size={14} />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">{t('continue_learning')}</h3>
              <p className="text-[11px] text-[#525266] font-bold leading-relaxed mb-2 truncate">{t('math_science_quests')}</p>
              <div className="space-y-1">
                <div className="text-[9.5px] font-extrabold text-[#141779] truncate">
                  {t('resume_chapters', 'Resume chapters & practice')}
                </div>
                <div className="w-full h-1.5 bg-[#c7c7ff]/70 rounded-full overflow-hidden">
                  <div className="h-full bg-[#141779] rounded-full transition-all duration-500" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </button>

          {/* Good Habits */}
          {(() => {
            const currentHabitDay = dailyHabitData?.currentDay ?? 8;
            const isCompletedToday = dailyHabitData?.isCompletedToday ?? false;
            const doneQuests = missions ? missions.filter((m: any) => m.status === 'completed' || m.status === 'claimed').length : (todayCompletedCount || 0);
            const totalQuests = missions?.length || 6;

            const habitsDoneText = isCompletedToday
              ? `Day ${currentHabitDay} habit done today!`
              : `Day ${currentHabitDay} habit`;

            const habitsPct = isCompletedToday ? 100 : Math.min(95, Math.max(15, Math.round((doneQuests / (totalQuests || 1)) * 100)));

            return (
              <button
                onClick={() => navigate("/good-habits")}
                className="bg-[#fff8ee] rounded-[24px] p-4 flex flex-col justify-between min-h-[145px] h-[145px] border border-[#fed7aa]/60 shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group"
              >
                <div className="w-9 h-9 rounded-full bg-[#ffedd5] flex items-center justify-center">
                  <Star size={18} className="text-[#f97316] fill-[#f97316]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={14} />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">{t('good_habits', 'Good Habits')}</h3>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2 truncate">{t('daily_lessons_rewards', 'Daily lessons & rewards')}</p>
                  <div className="space-y-1">
                    <div className="text-[9.5px] font-extrabold text-slate-700 truncate">
                      {habitsDoneText}
                    </div>
                    <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${habitsPct}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })()}

          {/* Journey */}
          {(() => {
            const nodesList = journeyData?.nodes || [];
            const completedCount = nodesList.filter((n: any) => n.completed).length;
            const totalStages = journeyData?.totalStages || (nodesList.length > 0 ? nodesList.length : 3);
            const activeStageIndex = journeyData?.activeNodeIndex !== undefined
              ? (journeyData.activeNodeIndex + 1)
              : Math.min(completedCount + 1, totalStages);

            const numDots = Math.min(Math.max(totalStages, 3), 6);
            const dots = Array.from({ length: numDots }).map((_, idx) => {
              if (nodesList.length > 0) {
                return nodesList[idx]?.completed ?? (idx < completedCount);
              }
              return idx < completedCount;
            });

            const completedDots = dots.filter(Boolean).length;
            const lineProgressPct = numDots > 1 ? (Math.min(completedDots, numDots - 1) / (numDots - 1)) * 100 : 0;

            return (
              <button
                onClick={() => navigate("/practice/journey-map")}
                className="bg-[#e6fbf7] rounded-[24px] p-4 flex flex-col justify-between min-h-[145px] h-[145px] border border-[#b2f5ea]/60 shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group"
              >
                <div className="w-9 h-9 rounded-full bg-[#ccfbf1] flex items-center justify-center">
                  <BookOpen size={18} className="text-[#0d9488]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={14} />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">{t('journey', 'Journey')}</h3>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-1 truncate">{t('explorer_map', 'Explorer Map & Stages')}</p>

                  <div className="relative flex items-center justify-between my-1 px-1">
                    <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-slate-200/90 rounded-full z-0" />
                    <div
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-[#10b981] rounded-full z-0 transition-all duration-500"
                      style={{ width: `calc(${lineProgressPct}% * (100% - 16px) / 100)` }}
                    />
                    {dots.map((isDone, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-black z-10 transition-colors shadow-2xs ${
                          isDone ? "bg-[#10b981] text-white" : "bg-slate-300 text-white"
                        }`}
                      >
                        {isDone ? "✓" : "?"}
                      </span>
                    ))}
                  </div>

                  <span className="text-[9.5px] font-black text-slate-500 block mt-0.5 truncate">
                    {t('stage_progress', { stage: activeStageIndex, total: totalStages, defaultValue: `Stage ${activeStageIndex} of ${totalStages}` })}
                  </span>
                </div>
              </button>
            );
          })()}

          {/* My Collections */}
          <button
            onClick={() => navigate("/practice/collections")}
            className="bg-[#fff1f3] rounded-[24px] p-4 flex flex-col justify-between min-h-[145px] h-[145px] border border-[#fecdd3]/60 shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-full bg-[#ffe4e6] flex items-center justify-center">
              <Trophy size={18} className="text-[#e11d48]" />
            </div>
            <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
              <ChevronRight size={14} />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">{t('my_collections', 'My Collections')}</h3>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2 truncate">{t('unlocked_cards_badges', 'Unlocked cards & badges')}</p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-2xs border border-amber-200/50">
                  <Star size={12} className="fill-white" />
                </div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-2xs border border-purple-200/50">
                  <Crown size={12} className="fill-white" />
                </div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-2xs border border-pink-200/50">
                  <BookOpen size={12} />
                </div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-2xs border border-cyan-200/50">
                  <Gem size={12} />
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* 3. SHADOW ARENA (1V1) CARD */}
        <section>
          <button
            onClick={() => navigate("/multiplayer-hub")}
            className="w-full bg-[#1c1970] rounded-[24px] p-4 flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform border border-[#2d28a3]/40 relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
                <span className="text-2xl">⚔️</span>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-white tracking-wide mb-0.5">{t('shadow_arena', 'Shadow Arena')}</h3>
                <p className="text-[11px] text-indigo-200/90 font-bold">{t('challenge_friends', 'Challenge friends in realtime battles')}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center backdrop-blur-md border border-white/20 z-10">
              <ChevronRight size={16} />
            </div>
          </button>
        </section>

        {/* 4. PARENT SPACE LINK CARD */}
        <section>
          <button
            onClick={() => navigate("/parent")}
            className="w-full bg-white rounded-[24px] p-3.5 flex justify-between items-center border border-slate-200/80 shadow-2xs hover:bg-slate-50/80 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-[#1c1970]" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-900">
                  <span>{t('parent_space', 'Parent Space')}</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">{t('view_stats_dna', 'View detailed stats & learning DNA')}</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
              <ChevronRight size={14} />
            </div>
          </button>
        </section>
      </main>

      {/* DAILY MISSIONS MODAL */}
      <AnimatePresence>
        {showDailyMissionModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white text-slate-950 w-full max-w-[440px] h-auto max-h-[85vh] p-4 sm:p-6 rounded-[32px] border-2 border-slate-200 shadow-2xl flex flex-col relative overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-white shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight truncate">{t('daily_quests', 'Daily Quests')}</h3>
                      <span className="text-[10px] sm:text-xs font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full border border-amber-400 shrink-0">
                        ⚡ {todayCompletedCount}/25
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5 truncate">{t('continuous_missions_desc', 'Continuous 5,000 Missions Journey')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDailyMissionModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950 flex items-center justify-center font-extrabold text-sm transition-all active:scale-90 shrink-0 ml-1"
                >
                  ✕
                </button>
              </div>

              {/* Filter Tabs: All, Active, Completed */}
              <div className="flex items-center gap-2 py-2.5 border-b border-slate-100 shrink-0 relative z-10">
                <button
                  onClick={() => setQuestTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${questTab === 'all'
                      ? 'bg-[#141779] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {t('all', 'All')}
                </button>
                <button
                  onClick={() => setQuestTab('active')}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${questTab === 'active'
                      ? 'bg-[#141779] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  🎯 {t('active', 'Active')}
                </button>
                <button
                  onClick={() => setQuestTab('completed')}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${questTab === 'completed'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  ✅ {t('completed', 'Completed')}
                </button>
              </div>

              {dailyLimitReached ? (
                <div className="p-6 my-auto bg-gradient-to-b from-amber-50 to-amber-100/40 rounded-[24px] border-2 border-amber-200 text-center flex flex-col items-center gap-3 shadow-sm relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-amber-500/25 animate-bounce">
                    🏆
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-amber-950">{t('quests_mastered_today', '25 / 25 Quests Mastered Today!')}</h4>
                  <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                    {t('quests_mastered_desc', "Sensational effort! You have completed today's maximum 25 quests. Tomorrow starts your next continuous sequence!")}
                  </p>
                </div>
              ) : (
                /* GUARANTEED TOUCH & MOUSE SCROLL CONTAINER */
                <div
                  className="my-2 flex-1 min-h-0 overflow-y-auto overscroll-contain py-1 pr-1 flex flex-col gap-2.5 relative z-10 select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-amber-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100"
                  style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                >
                  {(() => {
                    const rawList = (missions && missions.length > 0 ? missions : [
                      { seq: 1, id: "seq_1", title: t('answer_10_questions', 'Answer 10 Questions'), coin_reward: 10, xp_reward: 20, current_progress: 0, target_progress: 10, status: "pending", mission_type: "answer_questions" },
                      { seq: 2, id: "seq_2", title: t('win_1_boss_battle', 'Win 1 Boss Battle'), coin_reward: 15, xp_reward: 20, current_progress: 0, target_progress: 1, status: "pending", mission_type: "boss_win" },
                      { seq: 3, id: "seq_3", title: t('win_1_shadow_arena', 'Win 1 Shadow Arena Battle'), coin_reward: 50, xp_reward: 50, current_progress: 0, target_progress: 1, status: "pending", mission_type: "shadow_arena_win" }
                    ]);

                    const filteredList = rawList.filter((m) => {
                      const isDone = m.status === "completed";
                      if (questTab === 'completed') return isDone;
                      if (questTab === 'active') return !isDone;
                      return true;
                    });

                    const sortedList = [...filteredList].sort((a, b) => {
                      const isDoneA = a.status === "completed";
                      const isReadyA = a.status === "ready_to_claim" || (a.current_progress >= (a.target_progress || 1) && !isDoneA);
                      const isDoneB = b.status === "completed";
                      const isReadyB = b.status === "ready_to_claim" || (b.current_progress >= (b.target_progress || 1) && !isDoneB);

                      const orderA = isReadyA ? 0 : isDoneA ? 2 : 1;
                      const orderB = isReadyB ? 0 : isDoneB ? 2 : 1;
                      if (orderA !== orderB) return orderA - orderB;
                      return (a.seq || 0) - (b.seq || 0);
                    });

                    const displayList = sortedList.slice(0, 3);

                    if (displayList.length === 0) {
                      return (
                        <div className="py-8 text-center text-slate-500 font-bold text-sm">
                          {questTab === 'completed'
                            ? t('no_completed_quests', 'No completed quests yet!')
                            : t('no_active_quests', 'No active quests remaining!')}
                        </div>
                      );
                    }

                    return displayList.map((mission) => {
                      const isDone = mission.status === "completed";
                      const isReady = mission.status === "ready_to_claim" || (mission.current_progress >= (mission.target_progress || 1) && !isDone);
                      const cur = mission.current_progress || 0;
                      const target = mission.target_progress || 1;

                      const getIcon = () => {
                        if (mission.mission_type === "boss_win") return "⚔️";
                        if (mission.mission_type === "shadow_arena_win") return "👑";
                        return "🎯";
                      };

                      const translatedTitle = t(mission.title.toLowerCase().replace(/ /g, '_'), { defaultValue: mission.title });

                      return (
                        <div
                          key={mission.id || `seq_${mission.seq}`}
                          className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 shrink-0 ${isDone
                              ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
                              : isReady
                                ? "bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-400/20"
                                : "bg-slate-50 border-slate-200/90 text-slate-900"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold border shadow-sm ${isDone
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : isReady
                                  ? "bg-amber-500 border-amber-400 text-slate-950 animate-bounce"
                                  : "bg-[#4338ca] border-indigo-500 text-white"
                              }`}>
                              {isDone ? <CheckCircle className="w-6 h-6" /> : getIcon()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="inline-block bg-[#1e1b4b] text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-0.5 shrink-0">
                                #{mission.seq}
                              </span>
                              <h4 className="text-xs sm:text-sm font-black text-slate-950 leading-tight mb-1 truncate">
                                {translatedTitle}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] font-black flex-wrap">
                                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                                  🪙 +{mission.coin_reward || mission.coinReward || 10}
                                </span>
                                <span className="inline-flex items-center gap-0.5 bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                                  ⭐ +{mission.xp_reward || mission.xpReward || 20}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Status / Action */}
                          <div className="shrink-0 flex items-center">
                            {isDone ? (
                              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                                {t('claimed', '✓ Claimed')}
                              </span>
                            ) : isReady ? (
                              <button
                                onClick={() => {
                                  completeMission(mission.id || `seq_${mission.seq}`);
                                }}
                                className="text-xs font-black text-white bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] hover:from-[#1c1970] hover:to-[#2e2aab] active:scale-95 px-3.5 py-1.5 rounded-xl shadow-md shadow-indigo-900/30 animate-pulse border border-indigo-300/40"
                              >
                                {t('claim', '🎁 CLAIM')}
                              </button>
                            ) : (
                              <span className="text-xs font-black text-slate-700 bg-slate-200/90 px-3 py-1 rounded-xl border border-slate-300/60">
                                {cur} / {target}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end pt-2.5 border-t border-slate-100 shrink-0 relative z-10">
                <button
                  onClick={() => setShowDailyMissionModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95"
                >
                  {t('close', 'Close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* FLOATING ACTION BUTTONS (GIFT & CLOCK) - Properly Positioned */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 items-center">
        {/* Spin Wheel Gift Icon */}
        <motion.div
          animate={hasFreeSpin ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }}
          transition={hasFreeSpin ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : { duration: 0.3 }}
        >
          <button
            onClick={() => navigate("/daily-rewards")}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95 ${hasFreeSpin
              ? "bg-[#57fae9] border-[#007168] text-[#007168] animate-pulse"
              : "bg-white border-[#141779] text-[#141779]"
              }`}
          >
            <Gift className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Daily Missions Clock Icon */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => {
              fetchMissions();
              setShowDailyMissionModal(true);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#141779] to-[#30007f] text-amber-300 shadow-lg flex items-center justify-center border-2 border-amber-300/40 relative hover:scale-105 transition-transform"
          >
            <Clock className="w-6 h-6 animate-pulse" />
            {missions.some(m => m.status === 'ready_to_claim') && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center border border-white animate-bounce">
                !
              </span>
            )}
          </button>
        </motion.div>
      </div>

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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(87,250,233,0.12)_0%,transparent_65%)] pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              <div className="relative w-20 h-20 rounded-full bg-[rgba(87,250,233,0.08)] flex items-center justify-center border border-[#57fae9]/40 shadow-[0_0_30px_rgba(87,250,233,0.25)] z-10">
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

      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streakDays={streakDays}
        retentionStreak={retentionStreak}
      />

      {/* STREAK REVIVAL MODAL */}
      {showRevivalModal && streakRevivalData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-500/30 flex flex-col items-center text-center relative overflow-hidden animate-scale-up">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

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
                onClick={handleOpenRevivalConfirm}
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

      {/* STREAK REVIVAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {showRevivalConfirmModal && streakRevivalData && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => !revivalLoading && setShowRevivalConfirmModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-[360px] p-6 rounded-[32px] flex flex-col items-center text-center gap-5 border-2 border-amber-300 shadow-2xl overflow-hidden z-10 text-slate-950"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
                🔥
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-950">
                  Confirm Streak Revival
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  Spend <span className="font-extrabold text-amber-600">{streakRevivalData.reviveCost} Coins</span> to restore your <span className="font-extrabold text-slate-900">{streakRevivalData.previousStreak}-day streak</span>?
                </p>
              </div>

              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 flex justify-between items-center text-xs font-bold text-amber-900">
                <span>🪙 Cost:</span>
                <span className="text-amber-700 font-extrabold text-sm">{streakRevivalData.reviveCost} Coins</span>
              </div>

              <div className="w-full flex gap-3 pt-2">
                <button
                  onClick={() => setShowRevivalConfirmModal(false)}
                  disabled={revivalLoading}
                  className="flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviveStreak}
                  disabled={revivalLoading}
                  className="flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all shadow-md border border-amber-300 flex items-center justify-center gap-1.5"
                >
                  {revivalLoading ? "Reviving..." : "Confirm & Pay"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
