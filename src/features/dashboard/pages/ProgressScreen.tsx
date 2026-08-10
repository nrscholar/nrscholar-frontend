import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Flame, Bell } from "lucide-react";
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

  // Compute level and progress percentage dynamically from actual XP
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

      const missionsPromise = (async () => {
        try {
          // Fetch dynamic mission progression for active chapter (default: ch1)
          const res = await apiFetch("/api/practice/chapters/ch1/missions");
          const data = await res.json();
          if (data.success && data.data?.missions) {
            setMissions(data.data.missions);
          }
        } catch (e) {
          console.error(e);
        }
      })();

      await Promise.allSettled([mePromise, notifPromise, missionsPromise]);
      setLoading(false);
    };
    fetchProgress();
  }, []);

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

  // Fallback to basic list if API failed or missions is empty
  const activeMissions = missions.length > 0 ? missions : [
    { seq: 1, title: "Forest Trail", icon: "🌲", status: "completed", stars: 3 },
    { seq: 2, title: "Mystic River", icon: "🌊", status: "locked", stars: 0 },
    { seq: 3, title: "Crystal Cave", icon: "💎", status: "locked", stars: 0 },
    { seq: 4, title: "Royal Castle", icon: "🏰", status: "locked", stars: 0 },
    { seq: 5, title: "Dragon King Lair", icon: "🐲", status: "locked", stars: 0 },
  ];

  // Dynamic achievement unlock check matching real child stats
  const hasMathAce = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("math") : b?.name?.toLowerCase().includes("math"));
  const isStreakUnlocked = streakDays >= 3 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("streak") : b?.name?.toLowerCase().includes("streak"));

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24 max-w-lg mx-auto">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
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
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative"
        >
          <Bell size={20} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
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
            <h2 className="text-sm font-bold text-[#141779] tracking-[1px] uppercase">Active Mission Progression</h2>
            <button 
              onClick={() => navigate("/mission-roadmap?chapterId=ch1")}
              className="text-xs font-bold text-[#006a62] hover:underline"
            >
              View Full Map →
            </button>
          </div>
          <p className="text-[11px] text-gray-500 font-medium px-1 -mt-2.5">Conquer all realms to reach the Dragon King!</p>

          <div className="bg-[rgba(255,255,255,0.8)] backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
            {/* Dynamic Mission List */}
            {activeMissions.map((m) => {
              const isCompleted = m.status === "completed";
              const isUnlocked = m.status === "unlocked";

              return (
                <div
                  key={m.seq}
                  onClick={() => {
                    if (isUnlocked || isCompleted) {
                      navigate(`/mission-play?chapterId=ch1&missionSeq=${m.seq}${isCompleted ? "&replay=true" : ""}`);
                    }
                  }}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isCompleted
                      ? "bg-emerald-50/80 border-emerald-200 text-[#191c1e] cursor-pointer"
                      : isUnlocked
                      ? "bg-amber-50/90 border-amber-300 text-[#191c1e] ring-2 ring-amber-400/30 cursor-pointer animate-pulse"
                      : "bg-gray-100/60 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 text-[#191c1e]">
                          Mission {m.seq}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Completed ✓
                          </span>
                        )}
                        {isUnlocked && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                            Next Up! 🚀
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold mt-1 text-[#191c1e]">{m.title}</h4>
                    </div>
                  </div>

                  <div className="text-right">
                    {isCompleted ? (
                      <div className="flex gap-0.5">
                        <span className="text-xs font-semibold text-amber-500">
                          {Array.from({ length: m.stars || 3 }).map(() => "★").join("")}
                        </span>
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-xl">
                        Play
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">Locked 🔒</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Recent Achievements */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#464652] tracking-[1px] px-1">{t('recent_achievements')}</h2>
          <div className="flex gap-4">
            
            <div className={`flex-1 rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center gap-3 transition-all ${
              hasMathAce ? 'bg-white border-primary/20' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasMathAce ? 'bg-[#e0e0ff]' : 'bg-gray-200'}`}>
                <Award size={28} className={hasMathAce ? 'text-[#141779]' : 'text-gray-400'} />
              </div>
              <span className="text-sm font-semibold text-[#191c1e] text-center">
                {t('math_ace')} {hasMathAce ? '🏆' : '🔒'}
              </span>
            </div>

            <div className={`flex-1 rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center gap-3 transition-all ${
              isStreakUnlocked ? 'bg-white border-primary/20' : 'bg-gray-50/70 opacity-60 grayscale-[0.6]'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isStreakUnlocked ? 'bg-[#57fae9]' : 'bg-gray-200'}`}>
                <Flame size={28} className={isStreakUnlocked ? 'text-[#006a62]' : 'text-gray-400'} />
              </div>
              <span className="text-sm font-semibold text-[#191c1e] text-center">
                {t('day_streak', { days: streakDays })} {isStreakUnlocked ? '🔥' : '🔒'}
              </span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
