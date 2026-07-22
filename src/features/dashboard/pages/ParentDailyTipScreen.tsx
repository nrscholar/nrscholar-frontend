import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb, Flame, ShieldCheck, BookOpen,
  Heart, Brain, CheckCircle, Star, Zap, ArrowLeft, Trophy, Target
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

interface Tip {
  instead?: string;
  try?: string;
  benefit?: string;
  title?: string;
  description?: string;
  rewardPoints?: number;
}

interface Milestone {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  completed: boolean;
  progress?: number; // 0-100
  iconBg: string;
  iconColor: string;
}

export default function ParentDailyTipScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Cached data helper
  const cachedTip = (() => {
    try {
      const raw = sessionStorage.getItem("parent_daily_tip_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  // User data
  const [childName, setChildName] = useState(cachedTip?.childName || "Explorer");
  const [parentLevel, setParentLevel] = useState(cachedTip?.parentLevel || 1);
  const [childLevel, setChildLevel] = useState(cachedTip?.childLevel || 1);
  const [xp, setXp] = useState(cachedTip?.xp || 0);
  const [totalStars, setTotalStars] = useState(cachedTip?.totalStars || 0);
  const [streak, setStreak] = useState(cachedTip?.streak || 0);
  const [totalTests, setTotalTests] = useState(cachedTip?.totalTests || 0);
  const [childCity, setChildCity] = useState(cachedTip?.childCity || "Egg Village");

  // Daily tip from backend
  const [tip, setTip] = useState<Tip | null>(cachedTip?.tip || {
    title: "Be Present & Active",
    description: "Spend 10 uninterrupted minutes with your child today. Put the phone away, make eye contact, and listen to their thoughts on today's learning.",
    benefit: "Builds deep trust, emotional security, and boosts learning confidence.",
  });
  const [tipLoading, setTipLoading] = useState(!cachedTip);

  // ── XP / level helpers ──────────────────────────────────────────────────
  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  const roadmapXp = xp;
  const stageName =
    roadmapXp >= 5000 ? "Master Parent" :
    roadmapXp >= 2500 ? "Mindful Parent" :
    roadmapXp >= 1200 ? "Growth Coach" :
    roadmapXp >= 500  ? "Calm Parent"   : "New Parent";

  const xpForCurrentLevel = getXpForLevel(parentLevel);
  const xpForNextLevel    = getXpForLevel(parentLevel + 1);
  const levelProgress = xpForNextLevel > xpForCurrentLevel
    ? Math.min(100, Math.round(((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100))
    : 100;

  const stageThresholds = [0, 500, 1200, 2500, 5000];
  const stageIdx     = stageThresholds.findIndex((t, i) => i > 0 && roadmapXp < t) - 1;
  const safeIdx      = Math.max(0, Math.min(stageIdx, 3));
  const prevT        = stageThresholds[safeIdx];
  const nextT        = stageThresholds[safeIdx + 1] || 5000;
  const growthScore  = nextT > prevT
    ? Math.min(100, Math.round(((roadmapXp - prevT) / (nextT - prevT)) * 100))
    : 100;

  // Dynamic growth message based on score
  const growthMessage =
    growthScore >= 80 ? "Outstanding! You're in the top tier of parents! 🏆" :
    growthScore >= 60 ? "You're soaring! Keep the momentum going! 🚀" :
    growthScore >= 40 ? "Good progress! Every day counts. 💪" :
    growthScore >= 20 ? "Getting started — consistency is your superpower! 🌱" :
    "Begin your journey — complete lessons to grow! ✨";

  // ── Dynamic milestones built from real data ─────────────────────────────
  const milestones: Milestone[] = [
    {
      icon: <Flame size={24} />,
      title: streak >= 7 ? "7-Day Streak Achieved! 🔥" : `${streak}/7 Day Streak`,
      subtitle: streak >= 7 ? "Consistency master!" : streak === 0 ? "Start your streak today!" : `${7 - streak} more days to go`,
      completed: streak >= 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
      iconBg: "bg-[#ffdad6]",
      iconColor: "text-[#ba1a1a]",
    },
    {
      icon: <Trophy size={24} />,
      title: totalTests >= 10 ? "10 Lessons Completed! 🎓" : `${totalTests}/10 Lessons Done`,
      subtitle: totalTests >= 10 ? "Dedicated learner!" : `${10 - totalTests} more to go`,
      completed: totalTests >= 10,
      progress: Math.min(100, Math.round((totalTests / 10) * 100)),
      iconBg: "bg-[#471ba5]/20",
      iconColor: "text-[#30007f]",
    },
    {
      icon: <Star size={24} />,
      title: totalStars >= 50 ? "50 Stars Collected! ⭐" : `${totalStars}/50 Stars`,
      subtitle: totalStars >= 50 ? "Rising star parent!" : totalStars === 0 ? "Complete lessons to earn stars" : `${50 - totalStars} more to go`,
      completed: totalStars >= 50,
      progress: Math.min(100, Math.round((totalStars / 50) * 100)),
      iconBg: "bg-[#fef3c7]",
      iconColor: "text-[#d97706]",
    },
    {
      icon: <Brain size={24} />,
      title: streak >= 15 ? "15-Day Learning Streak! 🧠" : `${streak}/15 Day Streak`,
      subtitle: streak >= 15 ? "Master of Consistency!" : streak === 0 ? "Start your learning journey" : `${15 - streak} more days to unlock`,
      completed: streak >= 15,
      progress: Math.min(100, Math.round((streak / 15) * 100)),
      iconBg: "bg-[#2d328f]/20",
      iconColor: "text-[#141779]",
    },
  ];

  // ── Fetch all data in Parallel ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchAll() {
      const nextCache: any = cachedTip ? { ...cachedTip } : {};

      // Execute daily-tip API immediately in parallel with stats
      const tipPromise = apiFetch("/api/parent/daily-tip")
        .then(res => res.json())
        .then(tJson => {
          if (tJson.success && tJson.data) {
            setTip(tJson.data);
            nextCache.tip = tJson.data;
          }
        })
        .catch(() => {})
        .finally(() => setTipLoading(false));

      const statsPromise = (async () => {
        try {
          const [uRes, gRes, rRes, cRes] = await Promise.all([
            apiFetch("/api/users/me").catch(() => null),
            apiFetch("/api/practice/gamification").catch(() => null),
            apiFetch("/api/parent/report").catch(() => null),
            apiFetch("/api/practice/cities").catch(() => null),
          ]);

          if (uRes) {
            const uJson = await uRes.json();
            if (uJson.success && uJson.data?.user) {
              const u = uJson.data.user;
              setChildName(u.childName || "Explorer");
              setParentLevel(u.parentLevel || 1);
              setXp(u.parentXp || 0);
              setTotalStars(u.totalStars || 0);
              setStreak(u.streakDays || 0);

              nextCache.childName = u.childName || "Explorer";
              nextCache.parentLevel = u.parentLevel || 1;
              nextCache.xp = u.parentXp || 0;
              nextCache.totalStars = u.totalStars || 0;
              nextCache.streak = u.streakDays || 0;
            }
          }

          if (gRes) {
            const gJson = await gRes.json();
            if (gJson.success && gJson.data) {
              setChildLevel(gJson.data.level || 1);
              nextCache.childLevel = gJson.data.level || 1;
            }
          }

          if (rRes) {
            const rJson = await rRes.json();
            if (rJson.success && rJson.data) {
              setTotalTests(rJson.data.totalTests || 0);
              nextCache.totalTests = rJson.data.totalTests || 0;
            }
          }

          if (cRes) {
            const cJson = await cRes.json();
            if (cJson.success && Array.isArray(cJson.data) && cJson.data.length > 0) {
              const cityName = cJson.data[0]?.name || "Egg Village";
              setChildCity(cityName);
              nextCache.childCity = cityName;
            }
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      })();

      await Promise.all([tipPromise, statsPromise]);
      sessionStorage.setItem("parent_daily_tip_cache", JSON.stringify(nextCache));
    }

    fetchAll();
  }, []);

  // ── Inline styles ────────────────────────────────────────────────────────
  const inlineStyles = `
    @keyframes float {
      0%   { transform: translate(0, 0) scale(1);   opacity: 0.3; }
      100% { transform: translate(30px, 40px) scale(1.2); opacity: 0.6; }
    }
    .glass-panel {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255,255,255,0.4);
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  // Stable particle positions (no re-render flicker)
  const particles = [
    { w: 120, h: 80,  l: 10, t: 5  },
    { w: 80,  h: 100, l: 60, t: 15 },
    { w: 150, h: 90,  l: 30, t: 50 },
    { w: 70,  h: 120, l: 80, t: 70 },
    { w: 100, h: 70,  l: 5,  t: 80 },
    { w: 90,  h: 110, l: 50, t: 30 },
  ];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex flex-col min-h-screen w-full relative overflow-hidden font-sans">
      <style>{inlineStyles}</style>

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.85)] backdrop-blur-lg border-b-[1.5px] border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.08)] flex items-center px-6 h-16 gap-2">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[18px] font-bold text-[#141779] tracking-tight">{t("daily_tip") || "Daily Parenting Tips"}</h1>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 mt-16 mb-8 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-5 relative z-10">

        {/* ── Today's Tip ─────────────────────────────────────── */}
        <section className="w-full glass-panel rounded-2xl p-5 flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-[#006a62]" size={22} fill="currentColor" />
            <h2 className="text-[#191c1e] font-bold text-base tracking-tight">Today's Parenting Tip</h2>
            <span className="ml-auto text-[10px] font-bold text-[#767683] bg-[#f2f4f6] px-2 py-1 rounded-full uppercase tracking-wider">Day {new Date().getDate()}</span>
          </div>

          {tipLoading ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : tip ? (
            <>
              {/* "Instead / Try" format tip */}
              {tip.instead ? (
                <div className="bg-[#f2f4f6] rounded-xl p-4 flex flex-col gap-3 border border-[#c7c5d4]/20">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#464652] uppercase tracking-wider">Instead of:</span>
                    <p className="text-[#464652] italic text-sm">{tip.instead}</p>
                  </div>
                  <div className="h-[1px] w-full bg-[#c7c5d4]/30"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#006a62] uppercase tracking-wider">Try:</span>
                    <p className="text-[#141779] font-semibold text-sm">{tip.try}</p>
                  </div>
                </div>
              ) : (
                /* Title / description format tip (from backend) */
                <div className="bg-gradient-to-br from-[#141779]/5 to-[#006a62]/5 rounded-xl p-4 border border-[#141779]/10">
                  {tip.title && <p className="text-[#141779] font-bold text-sm mb-2">💡 {tip.title}</p>}
                  <p className="text-[#464652] text-sm leading-relaxed">{tip.description}</p>
                </div>
              )}

              {/* Benefit row */}
              {(tip.benefit) && (
                <div className="flex items-start gap-2 text-[#006a62]">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified</span>
                  <p className="text-xs font-medium">{tip.benefit}</p>
                </div>
              )}

              {/* XP badge if available */}
              {tip.rewardPoints && (
                <div className="flex items-center gap-1.5 self-start bg-[#57fae9]/20 text-[#006a62] px-3 py-1 rounded-full">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold">+{tip.rewardPoints} XP for applying this tip</span>
                </div>
              )}

              <button
                onClick={() => navigate("/parent/lessons")}
                className="w-full bg-[#141779] text-white py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95"
              >
                Explore Related Lessons →
              </button>
            </>
          ) : (
            <p className="text-[#767683] text-sm text-center py-4">No tip available today. Check back tomorrow!</p>
          )}
        </section>

        {/* ── Growth Score Ring ──────────────────────────────── */}
        <section className="w-full flex flex-col items-center justify-center py-2">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#57fae9]/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center relative p-1 shadow-lg"
              style={{ background: `conic-gradient(from 0deg, #57fae9 0%, #006a62 ${growthScore}%, #e0e3e5 ${growthScore}%)` }}
            >
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-[#006a62] font-bold text-[38px] leading-none">{growthScore}%</span>
                <span className="text-[#464652] font-bold text-[11px] uppercase tracking-wider mt-1">Growth Score</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-1.5 bg-[#006a62] text-white rounded-full shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
          </div>
          <p className="mt-3 text-[#191c1e] font-semibold text-center text-sm px-4">{growthMessage}</p>
          {/* Stage label */}
          <div className="mt-2 bg-[#141779]/10 text-[#141779] px-4 py-1 rounded-full text-xs font-bold">
            {stageName} · Roadmap Stage
          </div>
        </section>

        {/* ── Streak + Combo Badge ───────────────────────────── */}
        <section className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between shadow-sm overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#471ba5]/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${streak > 0 ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#e0e3e5] text-[#767683]"}`}>
              <Flame size={24} />
            </div>
            <div>
              <h3 className="text-[#191c1e] font-bold text-base">
                {streak > 0 ? `${streak} Day Streak 🔥` : "No Streak Yet"}
              </h3>
              <p className="text-[#464652] text-xs">
                {streak === 0 ? "Log in daily to start your streak!" :
                 streak < 7  ? `${7 - streak} more days for Streak Badge!` :
                 streak < 15 ? "On your way to 15-Day Milestone!" :
                 "Consistency Champion! Keep it up!"}
              </p>
            </div>
          </div>
          {/* Dynamic combo badge: P<parentLevel> + C<childLevel> */}
          <div className="flex flex-col items-center relative z-10">
            <div className="flex items-center gap-1 text-[#141779]">
              <span className="text-base font-bold">P{parentLevel}+C{childLevel}</span>
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="text-[9px] text-[#767683] font-semibold uppercase tracking-wide">Combo Level</span>
          </div>
        </section>

        {/* ── Parent + Child Split View ──────────────────────── */}
        <section className="w-full grid grid-cols-2 gap-4">
          {/* Parent Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[#2d328f] font-bold text-[10px] uppercase tracking-wider">PARENT</span>
              <ShieldCheck className="text-[#141779]" size={16} />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2d328f] to-[#141779] flex items-center justify-center text-xl mb-2 border-2 border-white shadow-sm">
                👨‍👩‍👦
              </div>
              <h4 className="text-[#191c1e] font-bold text-sm leading-tight">{stageName}</h4>
              <p className="text-[#464652] text-[10px] mb-2">LVL {parentLevel}</p>
              <div className="w-full bg-[#eceef0] rounded-full h-1.5 relative overflow-hidden">
                <div
                  className="absolute h-full bg-[#141779] rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <p className="text-[#464652] text-[9px] mt-1 font-semibold">{xp} / {xpForNextLevel} XP</p>
            </div>
          </div>

          {/* Child Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-md border-[#006a62]/10">
            <div className="flex items-center justify-between">
              <span className="text-[#006a62] font-bold text-[10px] uppercase tracking-wider">CHILD</span>
              <span className="material-symbols-outlined text-[#006a62] text-[16px]">child_care</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#57fae9] to-[#006a62] flex items-center justify-center text-xl mb-2 border-2 border-white shadow-sm">
                🐉
              </div>
              <h4 className="text-[#191c1e] font-bold text-sm leading-tight truncate w-full">{childName}</h4>
              <p className="text-[#464652] text-[10px] mb-2">LVL {childLevel}</p>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006a62] text-[12px]">pets</span>
                <span className="text-[9px] font-bold text-[#464652]">Dragon Rider</span>
              </div>
              <div className="flex items-center gap-1 text-[#006a62] text-[9px] font-bold mt-1">
                <span className="material-symbols-outlined text-[11px]">location_on</span>
                <span className="truncate max-w-[80px]">{childCity}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Family Milestones ──────────────────────────────── */}
        <section className="w-full flex flex-col gap-3 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#191c1e] font-bold text-lg tracking-tight">Family Milestones</h2>
            <span className="text-[10px] font-bold text-[#006a62] bg-[#57fae9]/20 px-2 py-1 rounded-full">
              {milestones.filter(m => m.completed).length}/{milestones.length} Done
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-2xl shadow-sm border transition-all ${
                  m.completed
                    ? "bg-white border-[#006a62]/20"
                    : "bg-white border-[#c7c5d4]/30"
                }`}
              >
                <div className={`w-12 h-12 ${m.iconBg} ${m.iconColor} rounded-full flex items-center justify-center shrink-0`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[#191c1e] font-bold text-sm">{m.title}</h5>
                  <p className="text-[#464652] text-xs">{m.subtitle}</p>
                  {!m.completed && m.progress !== undefined && (
                    <div className="w-full bg-[#eceef0] h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-[#006a62] rounded-full transition-all duration-700"
                        style={{ width: `${m.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                {m.completed
                  ? <CheckCircle className="text-[#006a62] shrink-0" size={22} />
                  : <Target className="text-[#c7c5d4] shrink-0" size={22} />
                }
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── Ambient particles ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute bg-[#57fae9]/10 rounded-full blur-xl"
            style={{
              width:  `${p.w}px`,
              height: `${p.h}px`,
              left:   `${p.l}%`,
              top:    `${p.t}%`,
              animation: `float ${12 + i * 2}s infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
