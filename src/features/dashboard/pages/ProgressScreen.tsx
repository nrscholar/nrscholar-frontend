import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Flame, Bell, Rocket, Atom, ShieldCheck, Zap, Trophy, Compass, ChevronRight, Star, CheckCircle, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

// Math-aligned level thresholds matching backend:
// Level 1: 0 XP
// Level 2: 100 XP
// Level 3: 250 XP
// Level >= 4: 250 * 1.5^(level - 3)
function getLevelInfo(xp: number) {
  if (xp < 100) {
    return { level: 1, percent: Math.round((xp / 100) * 100), nextXp: 100, currentXp: 0 };
  }
  if (xp < 250) {
    return { level: 2, percent: Math.round(((xp - 100) / 150) * 100), nextXp: 250, currentXp: 100 };
  }
  
  let lvl = 3;
  while (true) {
    const currentThreshold = Math.floor(250 * Math.pow(1.5, lvl - 3));
    const nextThreshold = Math.floor(250 * Math.pow(1.5, (lvl + 1) - 3));
    if (xp >= nextThreshold) {
      lvl++;
    } else {
      const range = nextThreshold - currentThreshold;
      const progress = xp - currentThreshold;
      const percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
      return { level: lvl, percent, nextXp: nextThreshold, currentXp: currentThreshold };
    }
  }
}

export default function ProgressScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [streakDays, setStreakDays] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState("Explorer");
  const [userPhoto, setUserPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [missionsList, setMissionsList] = useState<any[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [weeklyGrowth, setWeeklyGrowth] = useState<any[]>([]);
  const [loadingGrowth, setLoadingGrowth] = useState(true);
  const [subjectCompletionStats, setSubjectCompletionStats] = useState<Record<string, { completed: number; total: number; percent: number }>>({});

  const { level, percent: progressPercent, nextXp, currentXp } = getLevelInfo(xp);
  const xpNeededForNext = Math.max(0, nextXp - xp);

  const fetchAllSubjectCompletion = async (subs: any[]) => {
    try {
      const pRes = await apiFetch('/api/practice/chapter-progress');
      const pData = await pRes.json();
      const completedSet = new Set<string>();
      if (pData.success && pData.data) {
        pData.data.forEach((p: any) => {
          if (p.chapterCompleted || p.completed) {
            completedSet.add(String(p.chapterId));
            completedSet.add(`${p.chapterId}_hard`);
          }
        });
      }

      await Promise.all(
        subs.map(async (sub) => {
          try {
            const chRes = await apiFetch(`/api/practice/chapters/${sub._id}`);
            const chData = await chRes.json();
            if (chData.success && Array.isArray(chData.data)) {
              const total = chData.data.length;
              const completed = chData.data.filter((ch: any) => 
                completedSet.has(String(ch._id)) || completedSet.has(`${ch._id}_hard`)
              ).length;
              const percent = total > 0 ? Math.round((completed / total) * 100) : (completed > 0 ? 100 : 0);
              setSubjectCompletionStats(prev => ({
                ...prev,
                [sub._id]: { completed, total, percent }
              }));
            }
          } catch (e) {}
        })
      );
    } catch (e) {
      console.error("Error fetching subject completion:", e);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      const cached = localStorage.getItem("userData");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          setXp(u.xp || 0);
          setCoins(u.coins || 0);
          setUserData(u);
          setStreakDays(u.streakDays || 0);
          setUsername(u.childName || u.name || "Explorer");
          setUserPhoto(u.childPhoto || u.photo || "");
          setBadges(u.badges || []);
          setLoading(false); // Render UI instantly from cache!
        } catch(e) {}
      }

      const mePromise = (async () => {
        try {
          const response = await apiFetch("/api/users/me");
          const data = await response.json();
          if (data.success && data.data.user) {
             const u = data.data.user;
             setXp(u.xp || 0);
             setCoins(u.coins || 0);
             setUserData(u);
             setStreakDays(u.streakDays || 0);
             setUsername(u.childName || u.name || "Explorer");
             setUserPhoto(u.childPhoto || u.photo || "");
             setBadges(u.badges || []);
          }
        } catch(e) {}
      })();

      const notifPromise = (async () => {
        try {
          const notifRes = await apiFetch("/api/notifications");
          const notifData = await notifRes.json();
          if (notifData.success && notifData.data) {
            setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
          }
        } catch (e) {}
      })();

      const subjectsPromise = (async () => {
        try {
          const subRes = await apiFetch("/api/practice/subjects");
          const subData = await subRes.json();
          if (subData.success && subData.data && subData.data.length > 0) {
            setSubjects(subData.data);
            const savedSubId = sessionStorage.getItem("activeSubjectId");
            const found = (savedSubId && savedSubId !== "all") ? subData.data.find((s: any) => s._id === savedSubId) : null;
            setActiveSubject(found || subData.data[0]);
            // Run completion stats fetch asynchronously in background
            setTimeout(() => fetchAllSubjectCompletion(subData.data), 0);
          }
        } catch (e) {
          console.error("Failed to fetch subjects:", e);
        } finally {
          setLoading(false);
        }
      })();

      const growthPromise = (async () => {
        try {
          const res = await apiFetch("/api/practice/subjects/weekly-growth");
          const data = await res.json();
          if (data.success && data.data) {
            setWeeklyGrowth(data.data);
          }
        } catch (e) {
          console.error("Failed to fetch weekly subject growth:", e);
        } finally {
          setLoadingGrowth(false);
        }
      })();

      await Promise.allSettled([mePromise, notifPromise, subjectsPromise, growthPromise]);
      setLoading(false);
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!activeSubject) return;

    const targetSubId = activeSubject._id;
    if (!targetSubId) return;

    const fetchMissionsForActiveSubject = async () => {
      setLoadingMissions(true);
      try {
        const [chRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/chapters/${targetSubId}`),
          apiFetch(`/api/practice/chapter-progress`)
        ]);
        const chData = await chRes.json();
        const pData = await pRes.json();

        let chapters: any[] = [];
        let completedChapterIds: string[] = [];

        if (chData.success) {
          chapters = chData.data;
        }
        if (pData.success && pData.data) {
          completedChapterIds = pData.data
            .filter((p: any) => p.chapterCompleted || p.completed)
            .map((p: any) => p.chapterId);
        }

        if (chapters.length > 0) {
          const currentChapterIndex = chapters.findIndex(ch => !completedChapterIds.includes(ch._id) && !completedChapterIds.includes(`${ch._id}_hard`));
          const currentActive = chapters[currentChapterIndex >= 0 ? currentChapterIndex : 0];
          setActiveChapter(currentActive);

          const mRes = await apiFetch(`/api/practice/chapters/${currentActive._id}/missions`);
          const mData = await mRes.json();
          if (mData.success && mData.data?.missions) {
            setMissionsList(mData.data.missions);
          } else {
            setMissionsList([]);
          }
        } else {
          setActiveChapter(null);
          setMissionsList([]);
        }
      } catch (e) {
        console.error("Failed to load active chapter missions:", e);
        setMissionsList([]);
      } finally {
        setLoadingMissions(false);
      }
    };

    fetchMissionsForActiveSubject();
  }, [activeSubject, subjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FB] font-sans pb-28 animate-pulse flex flex-col max-w-lg mx-auto">
        <header className="flex items-center justify-between px-4 py-4 bg-white/80 border-b border-[#E0E3E5]">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
            <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
        </header>
        <main className="px-4 pt-6 flex flex-col gap-6">
          <div className="h-36 bg-gray-200 rounded-2xl w-full" />
          <div className="h-28 bg-gray-200 rounded-2xl w-full" />
          <div className="h-44 bg-gray-200 rounded-2xl w-full" />
        </main>
      </div>
    );
  }

  // Dynamic achievement unlock check matching real child stats
  const hasMathAce = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("math") : b?.name?.toLowerCase().includes("math"));
  const isStreakUnlocked = streakDays >= 3 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("streak") : b?.name?.toLowerCase().includes("streak"));
  const hasScienceProdigy = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("science") : b?.name?.toLowerCase().includes("science"));
  const hasArenaMaster = level >= 5 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("arena") : b?.name?.toLowerCase().includes("arena"));

  const unlockedMilestonesCount = [hasMathAce, isStreakUnlocked, hasScienceProdigy, hasArenaMaster].filter(Boolean).length;
  const totalBadgesCount = Math.max(badges.length, unlockedMilestonesCount);

  // Filter growth list based on active subject selection & ensure single graph display per selected subject
  let filteredGrowth = activeSubject
    ? weeklyGrowth.filter((item: any) => 
        item.subjectId === activeSubject._id || 
        item.name.toLowerCase().replace(/ /g, '_') === activeSubject.name.toLowerCase().replace(/ /g, '_') ||
        item.name.toLowerCase().includes(activeSubject.name.toLowerCase()) || 
        activeSubject.name.toLowerCase().includes(item.name.toLowerCase()) ||
        (item.name.toLowerCase().startsWith('math') && activeSubject.name.toLowerCase().startsWith('math'))
      )
    : weeklyGrowth;

  // Restrict to exactly 1 primary graph for the active subject
  const displayedGrowth = activeSubject
    ? (filteredGrowth.length > 0 ? [filteredGrowth[0]] : [])
    : (weeklyGrowth.length > 0 ? [weeklyGrowth[0]] : []);

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#17177F] font-sans pb-28 max-w-lg mx-auto relative selection:bg-[#4D4BFF] selection:text-white overflow-x-hidden">
      {/* Background Soft Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[40%] rounded-full bg-[#17177F]/8 blur-[100px]" />
        <div className="absolute top-[40%] right-[-10%] w-[55%] h-[40%] rounded-full bg-[#4D4BFF]/8 blur-[100px]" />
      </div>

      {/* TOP APP BAR / GAME HUD (Curved Sticky Design) */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-[28px] shadow-xs gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:opacity-90 transition-opacity shrink-0 bg-[#141779] shadow-xs"
          >
            {userPhoto ? (
              <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#141779] text-white font-bold text-xs flex items-center justify-center">
                {username ? username.slice(0, 2).toUpperCase() : "NR"}
              </div>
            )}
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">{username || "Explorer"}</h1>
              <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                {userData?.childClass || t('class_10', { defaultValue: "Class 10" })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] text-slate-400 font-extrabold whitespace-nowrap">
                {t('explorer_level', { defaultValue: "Explorer Level" })} {level}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => navigate("/home")}
            className="bg-[#fff7ed] border border-orange-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
          >
            <span className="text-[11px] font-black text-[#ea580c] leading-none">🔥 {streakDays || 0}</span>
          </button>
          <button
            onClick={() => navigate("/practice/inventory")}
            className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
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

      <main className="px-4 pt-3.5 sm:pt-5 flex flex-col gap-4 relative z-10">
        {/* 1. TOP XP HERO CARD */}
        <section className="bg-gradient-to-br from-[#17177F] via-[#141779] to-[#0D0E4C] rounded-[24px] p-4 sm:p-5 text-white shadow-[0_10px_35px_-8px_rgba(23,23,127,0.35)] relative overflow-hidden">
          <div className="w-48 h-48 rounded-full bg-white/5 blur-2xl absolute -right-6 -bottom-6 pointer-events-none" />
          <div className="w-32 h-32 rounded-full bg-white/5 blur-xl absolute -left-6 -top-6 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1 rounded-full border border-white/25 shadow-xs text-[10px] sm:text-[11.5px] font-bold text-white uppercase shrink-0 whitespace-nowrap">
                <span>
                  {t('level_adventurer', { level, defaultValue: `LEVEL ${level} • ADVENTURER` })}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/15 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1 rounded-full border border-white/25 shadow-xs text-[10px] sm:text-[11.5px] font-bold text-white tracking-wide shrink-0 whitespace-nowrap">
                <span className="text-[#FFC83D]">⚡</span>
                <span>{t('xp_earned', 'XP Earned ')}:</span>
                <span className="text-[#FFC83D]">{xp.toLocaleString()} XP</span>
              </div>
            </div>

            <div className="flex flex-col text-left mt-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[30px] sm:text-[34px] font-black tracking-tight leading-none text-white">
                  {xp.toLocaleString()}
                </span>
                <span className="text-[15px] sm:text-[17px] font-bold text-[#EEF1FF]">XP</span>
              </div>
              <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#E0E7FF] mt-0.5">
                {t('total_xp_accumulated', 'Total Experience Points Accumulated')}
              </span>
            </div>

            <div className="w-full h-3 sm:h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#38E4D4] via-[#40C98A] to-[#FFC83D] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
            </div>

            <div className="flex items-center justify-between text-[10.5px] sm:text-[12px] font-medium text-[#EEF1FF]">
              <span>{progressPercent}% {t('complete', 'Complete')}</span>
              <span className="text-white font-bold flex items-center gap-1">
                {xpNeededForNext > 0 ? t('xp_until_level', { xp: xpNeededForNext, level: level + 1, defaultValue: `${xpNeededForNext} XP until Level ${level + 1}` }) : t('max_level_reached', 'Max Level Reached!')} →
              </span>
            </div>
          </div>
        </section>

        {/* 2. STAT CARDS GRID */}
        <section className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E0E3E5]/60 flex flex-col items-center justify-center gap-1.5 sm:gap-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#17177F] shadow-2xs shrink-0">
              <Zap size={16} className="fill-[#17177F]" />
            </div>
            <div className="w-full">
              <p className="text-[15px] sm:text-[22px] font-black text-[#17177F] leading-tight truncate">{xp.toLocaleString()}</p>
              <p className="text-[10px] sm:text-[12px] font-medium text-[#767683] mt-0.5 truncate">{t('xp_power', 'XP Power')}</p>
            </div>
          </div>

          <div className="bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E0E3E5]/60 flex flex-col items-center justify-center gap-1.5 sm:gap-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFC83D]/20 flex items-center justify-center text-[#D97706] shadow-2xs shrink-0">
              <Flame size={16} className="fill-[#D97706]" />
            </div>
            <div className="w-full">
              <p className="text-[15px] sm:text-[22px] font-black text-[#17177F] leading-tight truncate">{streakDays}</p>
              <p className="text-[10px] sm:text-[12px] font-medium text-[#767683] mt-0.5 truncate">{t('streak', 'Streak 🔥')}</p>
            </div>
          </div>

          <div className="bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E0E3E5]/60 flex flex-col items-center justify-center gap-1.5 sm:gap-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#38E4D4]/20 flex items-center justify-center text-[#006A62] shadow-2xs shrink-0">
              <Award size={16} />
            </div>
            <div className="w-full">
              <p className="text-[15px] sm:text-[22px] font-black text-[#17177F] leading-tight truncate">{totalBadgesCount}</p>
              <p className="text-[10px] sm:text-[12px] font-medium text-[#767683] mt-0.5 truncate">{t('badges', 'Badges')}</p>
            </div>
          </div>

          <div className="bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E0E3E5]/60 flex flex-col items-center justify-center gap-1.5 sm:gap-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#17177F]/10 flex items-center justify-center text-[#17177F] shadow-2xs shrink-0">
              <Trophy size={16} />
            </div>
            <div className="w-full">
              <p className="text-[15px] sm:text-[22px] font-black text-[#17177F] leading-tight truncate">Lvl {level}</p>
              <p className="text-[10px] sm:text-[12px] font-medium text-[#767683] mt-0.5 truncate">{t('level', 'Level')}</p>
            </div>
          </div>
        </section>

        {/* 3. REDESIGNED PREMIUM SUBJECT ANALYTICS & CHARTS SECTION (BAR GRAPH) */}
        <section className="flex flex-col gap-3">
          {/* SUBJECT SELECTION HORIZONTAL TABS */}
          <div className="flex overflow-x-auto hide-scrollbar py-1 gap-2.5">
            {subjects.map((sub) => {
              const isActive = activeSubject?._id === sub._id;
              const translatedSubName = t(sub.name.toLowerCase().replace(/ /g, '_'), { defaultValue: sub.name });
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubject(sub);
                    sessionStorage.setItem("activeSubjectId", sub._id);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold text-[13px] whitespace-nowrap transition-all shrink-0 flex items-center gap-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#17177F] to-[#141779] text-white shadow-md shadow-[#17177F]/25 border border-[#17177F]' 
                      : 'bg-white text-[#767683] border border-[#E0E3E5] hover:border-[#17177F]/40 shadow-2xs'
                  }`}
                >
                  <Compass size={14} className={isActive ? "text-white" : "text-[#767683]"} />
                  <span>{translatedSubName}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.06)] border border-[#E0E3E5]/60 flex flex-col gap-5">
            <div className="flex flex-col gap-1 text-left">
              <h2 className="text-[20px] font-bold text-[#17177F] tracking-tight leading-snug">
                {t('weekly_subject_growth_title', 'Subject Analytics & Growth')}
              </h2>
              <p className="text-[14px] font-medium text-[#767683]">
                {t('weekly_subject_growth_sub', 'Compare weekly mastery breakdown across your subjects')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#EEF1FF] border border-[#4D4BFF]/20 text-[#17177F] px-3.5 py-1 rounded-full text-[13px] font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4D4BFF]" />
                <span>{t('current_week', 'Current Week')}</span>
              </div>
              <div className="bg-[#CBD5E1]/30 border border-[#CBD5E1]/50 text-[#64748B] px-3.5 py-1 rounded-full text-[13px] font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                <span>{t('previous_week', 'Previous Week')}</span>
              </div>
            </div>

            {loadingGrowth ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-8 h-8 border-3 border-[#17177F] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-[13px] font-medium text-[#767683] animate-pulse">{t('loading_analytics', 'Loading subject growth analytics...')}</p>
              </div>
            ) : displayedGrowth.length === 0 ? (
              <div className="text-center py-8 text-[#767683] font-medium text-[14px]">
                {t('no_growth_data', 'Complete quizzes across subjects to see weekly growth breakdown!')}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {displayedGrowth.map((item: any, idx: number) => {
                  const delta = item.growthDelta !== undefined ? item.growthDelta : (item.thisWeekAccuracy - item.lastWeekAccuracy);
                  const isPositive = delta >= 0;
                  const translatedSubName = t(item.name.toLowerCase().replace(/ /g, '_'), { defaultValue: item.name });

                  const getIcon = (n: string) => {
                    const lower = n.toLowerCase();
                    if (lower.includes("guj")) return "📘";
                    if (lower.includes("math")) return "🧮";
                    if (lower.includes("sci")) return "🔬";
                    if (lower.includes("eng")) return "📖";
                    return "🌎";
                  };

                  const icon = item.icon || getIcon(item.name);

                  const getPerfLabel = (acc: number) => {
                    if (acc >= 85) return t('excellent_progress', 'Excellent Progress');
                    if (acc >= 75) return t('great_mastery', 'Great Mastery');
                    if (acc >= 65) return t('building_skill', 'Building Skill');
                    return t('needs_practice', 'Needs Practice');
                  };

                  const stats = (activeSubject && subjectCompletionStats[activeSubject._id]) || 
                                (item.subjectId && subjectCompletionStats[item.subjectId]) || 
                                { completed: 0, total: 0, percent: 0 };
                  const circleRadius = 48;
                  const circumference = 2 * Math.PI * circleRadius;
                  const strokeDashoffset = circumference - (stats.percent / 100) * circumference;

                  return (
                    <motion.div
                      key={item.subjectId || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="flex flex-col gap-5 text-left"
                    >
                      {/* 1. SUBJECT HEADER & ACCURACY SCORE */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{icon}</span>
                            <h3 className="text-[16px] font-bold text-[#17177F]">
                              {translatedSubName}
                            </h3>
                          </div>
                          <span className="text-[13px] font-medium text-[#767683]">
                            {getPerfLabel(item.thisWeekAccuracy)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[34px] font-black text-[#17177F] tracking-tight leading-none">
                            {item.thisWeekAccuracy}%
                          </span>

                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                            className={`px-[10px] py-[5px] rounded-[100px] text-[13px] font-bold flex items-center gap-1 shadow-2xs ${
                              isPositive
                                ? "bg-[#DCFCE7] text-[#16A34A]"
                                : "bg-[#FEE2E2] text-[#DC2626]"
                            }`}
                          >
                            <span>{isPositive ? "▲" : "▼"}</span>
                            <span>{isPositive ? `+${delta}%` : `${delta}%`}</span>
                          </motion.span>
                        </div>
                      </div>

                      {/* 2. FIRST: PREMIUM REDESIGNED WEEKLY COMPARISON BAR CHART */}
                      <div className="flex flex-col gap-2">
                        {/* Chart Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-[13px] font-bold text-[#17177F] tracking-wide">
                              {t('weekly_comparison', 'Weekly Comparison')}
                            </span>
                            <span className="text-[11px] font-medium text-[#64748B]">
                              {t('current_vs_previous', 'Current Week vs Previous Week')}
                            </span>
                          </div>
                        </div>

                        {/* Chart Body with Grid & Bars */}
                        <div className="relative pt-4 pb-2">
                          {/* Subtle Horizontal Grid Lines */}
                          <div className="absolute inset-x-0 top-10 bottom-8 flex flex-col justify-between pointer-events-none opacity-60 z-0">
                            <div className="border-b border-[#E2E8F0] border-dashed w-full h-0" />
                            <div className="border-b border-[#E2E8F0] border-dashed w-full h-0" />
                            <div className="border-b border-[#E2E8F0] border-dashed w-full h-0" />
                          </div>

                          <div className="relative z-10 flex items-end justify-center gap-12 sm:gap-16 h-44 pt-4">
                            {/* Current Week Bar Group */}
                            <div className="flex flex-col items-center group cursor-pointer">
                              <span className="text-[16px] font-semibold text-[#17177F] mb-3 leading-none">
                                {item.thisWeekAccuracy}%
                              </span>
                              <div className="h-32 flex items-end">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(16, (item.thisWeekAccuracy / 100) * 120)}px` }}
                                  transition={{ duration: 0.7, ease: "easeOut" }}
                                  className="w-12 sm:w-14 rounded-t-[16px] rounded-b-[4px] bg-gradient-to-t from-[#4F46E5] to-[#7C6CFF] shadow-[0_6px_16px_rgba(79,70,229,0.25)] hover:scale-[1.03] transition-transform duration-200 overflow-hidden relative"
                                >
                                  {/* Subtle top highlight cap */}
                                  <div className="w-full h-[2px] bg-white/40 rounded-t-[16px]" />
                                </motion.div>
                              </div>
                              <span className="text-[13px] font-medium text-[#64748B] mt-3 leading-none text-center">
                                {t('current_week', 'Current Week')}
                              </span>
                            </div>

                            {/* Previous Week Bar Group */}
                            <div className="flex flex-col items-center group cursor-pointer">
                              <span className="text-[16px] font-semibold text-[#64748B] mb-3 leading-none">
                                {item.lastWeekAccuracy}%
                              </span>
                              <div className="h-32 flex items-end">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(16, (item.lastWeekAccuracy / 100) * 120)}px` }}
                                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                                  className="w-12 sm:w-14 rounded-t-[16px] rounded-b-[4px] bg-gradient-to-t from-[#94A3B8] to-[#CBD5E1] shadow-[0_6px_16px_rgba(148,163,184,0.2)] hover:scale-[1.03] transition-transform duration-200 overflow-hidden relative"
                                >
                                  {/* Subtle top highlight cap */}
                                  <div className="w-full h-[2px] bg-white/30 rounded-t-[16px]" />
                                </motion.div>
                              </div>
                              <span className="text-[13px] font-medium text-[#64748B] mt-3 leading-none text-center">
                                {t('previous_week', 'Previous Week')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Compact Summary Row (Insight) */}
                        <div className="mt-1 pt-3 border-t border-[#F1F5F9] flex items-center gap-2 text-left">
                          <span className={`px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1 shadow-2xs ${
                            isPositive ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}>
                            <span>{isPositive ? "▲" : "▼"}</span>
                            <span>{isPositive ? `+${delta}%` : `${delta}%`}</span>
                          </span>
                          <span className="text-[13px] font-medium text-[#64748B]">
                            {isPositive 
                              ? t('higher_than_last_week', 'Higher than last week') 
                              : t('lower_than_last_week', 'Lower than last week')
                            }
                          </span>
                        </div>
                      </div>
            
                      {/* 3. AFTER THAT: CIRCLE PROGRESS GRAPH (Chapter / Syllabus Completion for Active Subject) */}
                      <div className="flex flex-col items-center justify-center gap-2 pt-2">
                        <span className="text-[11px] font-extrabold tracking-wider text-[#767683] uppercase">
                          {t('chapter_completion', 'CHAPTER COMPLETION')}
                        </span>
                        
                        <div className="relative w-36 h-36 flex items-center justify-center my-1">
                          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 120 120">
                            <defs>
                              {/* Radium Cyan-Green Gradient matching top XP card 100% */}
                              <linearGradient id={`radium-grad-${item.subjectId || idx}`} x1="60" y1="12" x2="60" y2="108" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#20E2D7" />
                                <stop offset="25%" stopColor="#38E4D4" />
                                <stop offset="60%" stopColor="#40C98A" />
                                <stop offset="100%" stopColor="#FFC83D" />
                              </linearGradient>

                              {/* Subtle Radium Glow Effect */}
                              <filter id={`radium-glow-${item.subjectId || idx}`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>

                            {/* Background Track Circle Line */}
                            <circle
                              cx="60"
                              cy="60"
                              r={circleRadius}
                              stroke="#EEF2FF"
                              strokeWidth="12"
                              fill="transparent"
                            />

                            {/* Radium Glowing Progress Completion Ring */}
                            <motion.circle
                              cx="60"
                              cy="60"
                              r={circleRadius}
                              stroke={`url(#radium-grad-${item.subjectId || idx})`}
                              strokeWidth="14"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              strokeLinecap="round"
                              fill="transparent"
                              filter={`url(#radium-glow-${item.subjectId || idx})`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl mb-0.5">{icon}</span>
                            <span className="text-[24px] font-black text-[#17177F] leading-none tracking-tight">
                              {stats.percent}%
                            </span>
                          </div>
                        </div>

                        <div className="text-center flex flex-col items-center">
                          <span className="text-[12px] font-bold text-[#4D4BFF]">
                            {stats.total > 0 
                              ? `${stats.completed}/${stats.total} ${t('chapters', 'Chapters')} ${t('completed', 'Completed')}`
                              : `${stats.percent}% ${t('mastered', 'Mastered')}`
                            }
                          </span>
                        </div>
                      </div>

                      {/* 4. AFTER THAT: APPRECIATION PARAGRAPH / INSIGHT BOX */}
                      <div className="bg-[#EEF1FF] rounded-[18px] p-[16px] flex items-start gap-3 border border-[#4D4BFF]/20 text-left">
                        <div className="w-8 h-8 rounded-full bg-[#4D4BFF]/15 flex items-center justify-center text-base shrink-0 mt-0.5 text-[#17177F]">
                          💡
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <h4 className="text-[14px] font-bold text-[#17177F]">
                            {t('great_progress_title', '💡 Great Progress!')}
                          </h4>
                          <p className="text-[13px] font-medium text-[#767683] leading-relaxed">
                            {t('insight_growth_desc', { 
                              subject: translatedSubName, 
                              delta: delta >= 0 ? `+${delta}%` : `${delta}%`,
                              defaultValue: `Your ${translatedSubName} score improved by ${delta >= 0 ? `+${delta}%` : `${delta}%`} compared to last week.`
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 5. ACHIEVEMENTS SHOWCASE */}
        <section className="flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[18px] font-semibold text-[#17177F] flex items-center gap-2">
              <Award size={18} className="text-[#4D4BFF]" />
              <span>🏆 {t('recent_achievements', 'Recent Achievements')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-[24px] p-5 border flex flex-col items-center gap-2.5 transition-all ${
              hasMathAce ? 'bg-white border-[#4D4BFF]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasMathAce ? 'bg-[#EEF1FF]' : 'bg-gray-200'}`}>
                <Award size={24} className={hasMathAce ? 'text-[#4D4BFF]' : 'text-gray-400'} />
              </div>
              <span className="text-[14px] font-semibold text-[#17177F] text-center leading-tight">
                {t('math_ace', 'Math Ace')} {hasMathAce ? '🏆' : '🔒'}
              </span>
            </div>

            <div className={`rounded-[24px] p-5 border flex flex-col items-center gap-2.5 transition-all ${
              isStreakUnlocked ? 'bg-white border-[#FFC83D]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isStreakUnlocked ? 'bg-[#FFC83D]/20' : 'bg-gray-200'}`}>
                <Flame size={24} className={isStreakUnlocked ? 'text-[#D97706]' : 'text-gray-400'} />
              </div>
              <span className="text-[14px] font-semibold text-[#17177F] text-center leading-tight">
                {t('day_streak', { days: streakDays, streak: streakDays, count: streakDays, defaultValue: `Streak: ${streakDays} Days` })} {isStreakUnlocked ? '🔥' : '🔒'}
              </span>
            </div>

            <div className={`rounded-[24px] p-5 border flex flex-col items-center gap-2.5 transition-all ${
              hasScienceProdigy ? 'bg-white border-[#38E4D4]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasScienceProdigy ? 'bg-[#38E4D4]/20' : 'bg-gray-200'}`}>
                <Atom size={24} className={hasScienceProdigy ? 'text-[#0284C7]' : 'text-gray-400'} />
              </div>
              <span className="text-[14px] font-semibold text-[#17177F] text-center leading-tight">
                {t('science_prodigy', 'Science Prodigy')} {hasScienceProdigy ? '⚛️' : '🔒'}
              </span>
            </div>

            <div className={`rounded-[24px] p-5 border flex flex-col items-center gap-2.5 transition-all ${
              hasArenaMaster ? 'bg-white border-purple-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasArenaMaster ? 'bg-purple-100' : 'bg-gray-200'}`}>
                <ShieldCheck size={24} className={hasArenaMaster ? 'text-purple-700' : 'text-gray-400'} />
              </div>
              <span className="text-[14px] font-semibold text-[#17177F] text-center leading-tight">
                {t('arena_master', 'Arena Master')} {hasArenaMaster ? '🛡️' : '🔒'}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
