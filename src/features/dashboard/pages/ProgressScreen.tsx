import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Flame, Bell, Rocket, Atom, ShieldCheck, Zap, Trophy, Compass, ChevronRight, Star, CheckCircle, Lock } from "lucide-react";
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
  const [username, setUsername] = useState("Explorer");
  const [userPhoto, setUserPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [missionsList, setMissionsList] = useState<any[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);

  const { level, percent: progressPercent, nextXp, currentXp } = getLevelInfo(xp);
  const xpNeededForNext = Math.max(0, nextXp - xp);

  useEffect(() => {
    const fetchProgress = async () => {
      const cached = localStorage.getItem("userData");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          setXp(u.xp || 0);
          setStreakDays(u.streakDays || 0);
          setUsername(u.childName || u.name || "Explorer");
          setUserPhoto(u.childPhoto || u.photo || "");
          setBadges(u.badges || []);
        } catch(e) {}
      }

      const mePromise = (async () => {
        try {
          const response = await apiFetch("/api/users/me");
          const data = await response.json();
          if (data.success && data.data.user) {
             const u = data.data.user;
             setXp(u.xp || 0);
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
            const found = subData.data.find((s: any) => s._id === savedSubId);
            setActiveSubject(found || subData.data[0]);
          }
        } catch (e) {
          console.error("Failed to fetch subjects:", e);
        }
      })();

      await Promise.allSettled([mePromise, notifPromise, subjectsPromise]);
      setLoading(false);
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!activeSubject) return;

    const fetchMissionsForActiveSubject = async () => {
      setLoadingMissions(true);
      try {
        const [chRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/chapters/${activeSubject._id}`),
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
  }, [activeSubject]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F6FB] via-[#FAFAFF] to-[#FFFFFF] text-[#17177F] font-sans pb-28 max-w-lg mx-auto relative selection:bg-[#4D4BFF] selection:text-white overflow-x-hidden">
      {/* Background World Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#4D4BFF]/10 blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#FFC83D]/15 blur-[90px]" />
      </div>

      {/* TOP APP BAR / GAME HUD */}
      <header className="flex flex-col bg-white/85 backdrop-blur-md border-b border-[#E0E3E5] sticky top-0 z-50 shadow-sm pb-2.5">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 rounded-full bg-[#F5F6FB] border border-[#E0E3E5] hover:bg-[#EEF1FF] flex items-center justify-center transition-all active:scale-95 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={18} className="text-[#17177F]" />
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full border-2 border-[#38E4D4] overflow-hidden bg-white shrink-0 active:scale-95 transition-all shadow-xs"
            >
              {userPhoto ? (
                <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4D4BFF] block leading-none">
                PLAYER PROFILE
              </span>
              <h1 className="text-base font-black text-[#17177F] tracking-wide uppercase leading-tight">
                MY JOURNEY
              </h1>
            </div>
          </div>
          
          {/* Right Bell Notification */}
          <button 
            onClick={() => navigate("/notifications")}
            className="w-9 h-9 rounded-full bg-white border border-[#E0E3E5] shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shrink-0"
          >
            <div className="relative">
              <Bell size={18} className="text-[#17177F]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-black border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* SUBJECT SELECTION HORIZONTAL TABS */}
        {subjects.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar px-4 pb-1 gap-2 pr-6">
            {subjects.map((sub) => {
              const isActive = activeSubject?._id === sub._id;
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubject(sub);
                    sessionStorage.setItem("activeSubjectId", sub._id);
                  }}
                  className={`px-4 py-1.5 rounded-full font-black text-xs whitespace-nowrap transition-all uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#4D4BFF] to-[#17177F] text-white shadow-md border border-[#4D4BFF]' 
                      : 'bg-white text-[#767683] border border-[#E0E3E5] hover:border-[#4D4BFF]/60'
                  }`}
                >
                  <Compass size={13} className={isActive ? "text-[#FFC83D]" : "text-[#767683]"} />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4 relative z-10">
        {/* 1. PLAYER PROGRESSION HERO CARD */}
        <section className="bg-gradient-to-br from-[#180C4F] via-[#2824A3] to-[#17177F] border-2 border-[#4D4BFF]/40 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 bg-[#4D4BFF]/30 px-2.5 py-1 rounded-full border border-[#4D4BFF]/50">
              <Zap size={15} className="text-[#FFC83D]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                LEVEL {level} • ADVENTURER
              </span>
            </div>
            <span className="text-xs font-black text-[#FFC83D]">
              {xp.toLocaleString()} XP EARNED
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="my-2.5">
            <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#5B5CFF] via-[#4D4BFF] to-[#38E4D4] rounded-full shadow-[0_0_10px_rgba(56,228,212,0.5)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#EEF1FF]">
            <span>{progressPercent}% Complete</span>
            <span className="text-[#38E4D4] font-black">
              {xpNeededForNext > 0 ? `${xpNeededForNext} XP until Level ${level + 1}` : `Max Level Reached!`} →
            </span>
          </div>
        </section>

        {/* 2. GAME STATS COMPACT ROW */}
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-white border border-[#E0E3E5] rounded-xl p-2 text-center shadow-xs">
            <p className="text-[9px] font-extrabold text-[#767683] uppercase tracking-wider">XP POWER</p>
            <p className="text-sm font-black text-[#4D4BFF]">{xp.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[#E0E3E5] rounded-xl p-2 text-center shadow-xs">
            <p className="text-[9px] font-extrabold text-[#767683] uppercase tracking-wider">STREAK</p>
            <p className="text-sm font-black text-[#FFC83D] flex items-center justify-center gap-0.5">
              <span>{streakDays}</span>
              <span className="text-xs">🔥</span>
            </p>
          </div>
          <div className="bg-white border border-[#E0E3E5] rounded-xl p-2 text-center shadow-xs">
            <p className="text-[9px] font-extrabold text-[#767683] uppercase tracking-wider">BADGES</p>
            <p className="text-sm font-black text-[#38E4D4]">{badges.length}</p>
          </div>
          <div className="bg-white border border-[#E0E3E5] rounded-xl p-2 text-center shadow-xs">
            <p className="text-[9px] font-extrabold text-[#767683] uppercase tracking-wider">LEVEL</p>
            <p className="text-sm font-black text-[#17177F]">Lvl {level}</p>
          </div>
        </section>

        {/* 3. FEATURED CURRENT ADVENTURE QUEST CARD */}
        <section className="bg-white border-2 border-[#E0E3E5] rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Rocket size={16} className="text-[#4D4BFF]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#17177F]">
                🚀 CURRENT ADVENTURE
              </span>
            </div>
            {activeChapter && (
              <button 
                onClick={() => navigate(`/mission-roadmap?chapterId=${activeChapter._id}&title=${encodeURIComponent(activeChapter.name)}`)}
                className="text-xs font-black text-[#4D4BFF] hover:underline flex items-center gap-0.5"
              >
                <span>View Map</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="my-2">
            <h2 className="text-base font-black text-[#17177F] leading-tight">
              {activeChapter ? activeChapter.name : "Active Mission Progression"}
            </h2>
            <p className="text-xs font-semibold text-[#767683] mt-0.5">
              Conquer all realms in {activeSubject?.name || "this subject"} to unlock rewards!
            </p>
          </div>

          {activeChapter && (
            <button
              onClick={() => navigate(`/mission-roadmap?chapterId=${activeChapter._id}&title=${encodeURIComponent(activeChapter.name)}`)}
              className="w-full mt-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#4D4BFF] to-[#17177F] text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>CONTINUE ADVENTURE</span>
              <ChevronRight size={16} />
            </button>
          )}
        </section>

        {/* 4. YOUR MISSIONS SECTION */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#17177F] uppercase tracking-wider flex items-center gap-1.5">
              <Trophy size={14} className="text-[#FFC83D]" />
              YOUR MISSIONS
            </span>
            <span className="text-[11px] font-bold text-[#4D4BFF]">
              {missionsList.filter(m => m.status === "completed").length} / {missionsList.length} COMPLETED
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 border-2 border-[#E0E3E5] shadow-sm flex flex-col gap-2.5">
            {loadingMissions ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-7 h-7 border-3 border-[#4D4BFF] border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-gray-500 font-bold animate-pulse">Syncing mission data...</p>
              </div>
            ) : !activeChapter ? (
              <div className="text-center py-6 text-[#767683] font-semibold text-xs">
                No active chapters found for this subject.
              </div>
            ) : missionsList.length === 0 ? (
              <div className="text-center py-6 text-[#767683] font-semibold text-xs flex flex-col items-center gap-2">
                <Rocket size={28} className="text-gray-300 animate-bounce" />
                <span>No missions loaded for this chapter.</span>
              </div>
            ) : (
              missionsList.map((m) => {
                const isCompleted = m.status === "completed";
                const isRetest = m.status === "retest";
                const isUnlocked = m.status === "unlocked" || isRetest;

                return (
                  <div
                    key={m.seq}
                    onClick={() => {
                      if (isUnlocked || isCompleted) {
                        navigate(`/mission-play?chapterId=${activeChapter._id}&missionSeq=${m.seq}${(isCompleted || isRetest) ? "&replay=true" : ""}`);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                      isCompleted
                        ? "bg-[#40C98A]/10 border-[#40C98A]/50 text-[#17177F] cursor-pointer hover:bg-[#40C98A]/20"
                        : isRetest
                        ? "bg-[#FFC83D]/10 border-[#FFC83D]/60 text-[#17177F] cursor-pointer hover:bg-[#FFC83D]/20"
                        : isUnlocked
                        ? "bg-[#EEF1FF] border-[#4D4BFF]/60 text-[#17177F] cursor-pointer hover:bg-[#EEF1FF]/80 shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-65"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon || "🚀"}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-200">
                            Mission {m.seq}
                          </span>
                          {isCompleted && (
                            <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                              Completed ✓
                            </span>
                          )}
                          {isRetest && (
                            <span className="text-[9px] font-bold text-[#D97706] bg-[#FFC83D]/20 px-2 py-0.5 rounded-full">
                              Re-test 🔄
                            </span>
                          )}
                          {isUnlocked && !isRetest && (
                            <span className="text-[9px] font-bold text-[#4D4BFF] bg-[#4D4BFF]/15 px-2 py-0.5 rounded-full">
                              Next Up! 🚀
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-black mt-1 text-[#17177F]">{m.title}</h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isCompleted || isRetest ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((starIndex) => (
                            <span 
                              key={starIndex} 
                              className={`text-xs font-black ${starIndex <= m.stars ? "text-[#FFC83D]" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : isUnlocked ? (
                        <span className="text-xs font-black text-white bg-gradient-to-r from-[#4D4BFF] to-[#17177F] px-3 py-1 rounded-lg shadow-xs">
                          PLAY
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <Lock size={12} />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 5. ACHIEVEMENTS SHOWCASE */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#17177F] uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-[#4D4BFF]" />
              🏆 RECENT ACHIEVEMENTS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. Math Ace */}
            <div className={`rounded-2xl p-3 border-2 flex flex-col items-center gap-2 transition-all ${
              hasMathAce ? 'bg-white border-[#4D4BFF]/50 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${hasMathAce ? 'bg-[#4D4BFF]/15' : 'bg-gray-200'}`}>
                <Award size={24} className={hasMathAce ? 'text-[#4D4BFF]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#17177F] text-center leading-tight">
                {t('math_ace') || 'Math Ace'} {hasMathAce ? '🏆' : '🔒'}
              </span>
            </div>

            {/* 2. Streak Champion */}
            <div className={`rounded-2xl p-3 border-2 flex flex-col items-center gap-2 transition-all ${
              isStreakUnlocked ? 'bg-white border-[#FFC83D]/60 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${isStreakUnlocked ? 'bg-[#FFC83D]/20' : 'bg-gray-200'}`}>
                <Flame size={24} className={isStreakUnlocked ? 'text-[#D97706]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#17177F] text-center leading-tight">
                {t('day_streak', { days: streakDays }) || `Streak: ${streakDays} Days`} {isStreakUnlocked ? '🔥' : '🔒'}
              </span>
            </div>

            {/* 3. Science Prodigy */}
            <div className={`rounded-2xl p-3 border-2 flex flex-col items-center gap-2 transition-all ${
              hasScienceProdigy ? 'bg-white border-[#38E4D4]/60 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${hasScienceProdigy ? 'bg-[#38E4D4]/20' : 'bg-gray-200'}`}>
                <Atom size={24} className={hasScienceProdigy ? 'text-[#0284C7]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#17177F] text-center leading-tight">
                {t('science_prodigy') || 'Science Prodigy'} {hasScienceProdigy ? '⚛️' : '🔒'}
              </span>
            </div>

            {/* 4. Arena Master */}
            <div className={`rounded-2xl p-3 border-2 flex flex-col items-center gap-2 transition-all ${
              hasArenaMaster ? 'bg-white border-purple-300 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${hasArenaMaster ? 'bg-purple-100' : 'bg-gray-200'}`}>
                <ShieldCheck size={24} className={hasArenaMaster ? 'text-purple-700' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#17177F] text-center leading-tight">
                {t('arena_master') || 'Arena Master'} {hasArenaMaster ? '🛡️' : '🔒'}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
