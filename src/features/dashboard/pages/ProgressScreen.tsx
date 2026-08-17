import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle, Award, Flame, Bell, Rocket, Atom, ShieldCheck } from "lucide-react";
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
  const [missions, setMissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [missionsList, setMissionsList] = useState<any[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);

  const { level, percent: progressPercent } = getLevelInfo(xp);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

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
      <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24 animate-pulse flex flex-col max-w-lg mx-auto">
        <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
            <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="w-11 h-11 bg-gray-200 rounded-full shrink-0 ml-2" />
        </header>
        <main className="px-6 pt-8 flex flex-col gap-8">
          <div className="flex items-center justify-center">
            <div className="w-[192px] h-[192px] bg-gray-200 rounded-full" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 px-1" />
            <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end px-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-10" />
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // activeMissions removed — the missionsList from the API is used directly above
  // with proper empty states for no chapter / no missions cases

  // Dynamic achievement unlock check matching real child stats
  const hasMathAce = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("math") : b?.name?.toLowerCase().includes("math"));
  const isStreakUnlocked = streakDays >= 3 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("streak") : b?.name?.toLowerCase().includes("streak"));
  const hasScienceProdigy = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("science") : b?.name?.toLowerCase().includes("science"));
  const hasArenaMaster = level >= 5 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("arena") : b?.name?.toLowerCase().includes("arena"));

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24 max-w-lg mx-auto">
      {/* TopAppBar */}
      <header className="flex flex-col bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-sm pb-3">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} color="#141779" />
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full border-2 border-[#57fae9] overflow-hidden bg-white shrink-0 active:scale-95 transition-all"
            >
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
            <h1 className="text-2xl font-bold text-[#141779] tracking-[-0.5px]">My Progress</h1>
          </div>
          
          {/* Right side: Bell icon */}
          <button 
            onClick={() => navigate("/notifications")}
            className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative shrink-0"
          >
            <Bell size={20} className="text-[#141779]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Subject Selector Tabs */}
        {subjects.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar px-6 pb-1 gap-3">
            {subjects.map((sub) => {
              const isActive = activeSubject?._id === sub._id;
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubject(sub);
                    sessionStorage.setItem("activeSubjectId", sub._id);
                  }}
                  className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#141779] text-white shadow-md' 
                      : 'bg-white text-[#767683] border border-[#e0e3e5] hover:border-[#141779]'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="px-6 pt-8 flex flex-col gap-8">
        {/* Hero Section: Level & Circular Progress */}
        <div className="flex items-center justify-center">
          <div className="relative w-[192px] h-[192px] flex items-center justify-center">
            <svg width="192" height="192" viewBox="0 0 192 192" className="-rotate-90 absolute">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#eceef0"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#2addcd"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#464652] uppercase tracking-[1px]">{t('level')}</span>
              <span className="text-4xl font-bold text-[#141779] my-0.5">{level}</span>
              <span className="text-sm font-semibold text-[#006a62] mt-1">{progressPercent}{t('percent_to_next')}</span>
            </div>
          </div>
        </div>

        {/* Mid Section: Mission Progress Roadmap */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-[#141779] tracking-[1px] uppercase truncate max-w-[240px]">
              {activeChapter ? `Active: ${activeChapter.name}` : "Active Mission Progression"}
            </h2>
            {activeChapter && (
              <button 
                onClick={() => navigate(`/mission-roadmap?chapterId=${activeChapter._id}&title=${encodeURIComponent(activeChapter.name)}`)}
                className="text-xs font-bold text-[#006a62] hover:underline shrink-0"
              >
                View Full Map →
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-500 font-medium px-1 -mt-2.5">Conquer all realms to reach the Dragon King!</p>

          <div className="bg-[rgba(255,255,255,0.8)] backdrop-blur-md rounded-3xl p-6 border-[1.5px] border-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4">
            {loadingMissions ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-gray-500 font-bold animate-pulse">Syncing mission data...</p>
              </div>
            ) : !activeChapter ? (
              <div className="text-center py-8 text-[#767683] font-semibold text-sm">
                No active chapters found for this subject.
              </div>
            ) : missionsList.length === 0 ? (
              <div className="text-center py-8 text-[#767683] font-semibold text-sm flex flex-col items-center gap-2">
                <Rocket size={32} className="text-gray-300 animate-bounce" />
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
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isCompleted
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-950 cursor-pointer hover:bg-emerald-100/50"
                        : isRetest
                        ? "bg-amber-50/90 border-amber-300 text-amber-950 ring-2 ring-amber-400/20 cursor-pointer hover:bg-amber-100/50"
                        : isUnlocked
                        ? "bg-blue-50/90 border-blue-200 text-blue-950 ring-2 ring-blue-400/20 cursor-pointer hover:bg-blue-100/50"
                        : "bg-gray-100/60 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60">
                            Mission {m.seq}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Completed ✓
                            </span>
                          )}
                          {isRetest && (
                            <span className="text-[10px] font-bold text-[#b45309] bg-amber-100 px-2 py-0.5 rounded-full">
                              Re-test 🔄
                            </span>
                          )}
                          {isUnlocked && !isRetest && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                              Next Up! 🚀
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold mt-1 text-[#141779]">{m.title}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCompleted || isRetest ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((starIndex) => (
                            <span 
                              key={starIndex} 
                              className={`text-xs font-black ${starIndex <= m.stars ? "text-amber-500" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : isUnlocked ? (
                        <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-xl">
                          Play
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">Locked 🔒</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Section: Recent Achievements */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#464652] tracking-[1px] px-1">{t('recent_achievements')}</h2>
          <div className="grid grid-cols-2 gap-4">
            
            {/* 1. Math Ace */}
            <div className={`rounded-2xl p-4 border border-gray-100 shadow-[0_4px_16px_rgba(20,23,121,0.03)] flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
              hasMathAce ? 'bg-white border-indigo-200' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${hasMathAce ? 'bg-[rgba(20,23,121,0.08)] scale-110' : 'bg-gray-200'}`}>
                <Award size={28} className={hasMathAce ? 'text-[#141779]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#191c1e] text-center leading-tight">
                {t('math_ace') || 'Math Ace'} {hasMathAce ? '🏆' : '🔒'}
              </span>
            </div>

            {/* 2. Streak Champion */}
            <div className={`rounded-2xl p-4 border border-gray-100 shadow-[0_4px_16px_rgba(20,23,121,0.03)] flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
              isStreakUnlocked ? 'bg-white border-teal-200' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isStreakUnlocked ? 'bg-[rgba(87,250,233,0.2)] scale-110' : 'bg-gray-200'}`}>
                <Flame size={28} className={isStreakUnlocked ? 'text-[#006a62]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#191c1e] text-center leading-tight">
                {t('day_streak', { days: streakDays }) || `Streak: ${streakDays} Days`} {isStreakUnlocked ? '🔥' : '🔒'}
              </span>
            </div>

            {/* 3. Science Prodigy */}
            <div className={`rounded-2xl p-4 border border-gray-100 shadow-[0_4px_16px_rgba(20,23,121,0.03)] flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
              hasScienceProdigy ? 'bg-white border-purple-200' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${hasScienceProdigy ? 'bg-[rgba(48,0,127,0.08)] scale-110' : 'bg-gray-200'}`}>
                <Atom size={28} className={hasScienceProdigy ? 'text-[#30007f]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#191c1e] text-center leading-tight">
                {t('science_prodigy') || 'Science Prodigy'} {hasScienceProdigy ? '⚛️' : '🔒'}
              </span>
            </div>

            {/* 4. Arena Master */}
            <div className={`rounded-2xl p-4 border border-gray-100 shadow-[0_4px_16px_rgba(20,23,121,0.03)] flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
              hasArenaMaster ? 'bg-white border-rose-200' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${hasArenaMaster ? 'bg-[rgba(186,26,26,0.08)] scale-110' : 'bg-gray-200'}`}>
                <ShieldCheck size={28} className={hasArenaMaster ? 'text-[#ba1a1a]' : 'text-gray-400'} />
              </div>
              <span className="text-xs font-black text-[#191c1e] text-center leading-tight">
                {t('arena_master') || 'Arena Master'} {hasArenaMaster ? '🛡️' : '🔒'}
              </span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
