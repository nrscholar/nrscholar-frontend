import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb, Flame, ShieldCheck,
  Brain, CheckCircle, Star, Zap, ArrowLeft, Trophy, Target
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
  progress?: number;
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

  // User data state
  const [childName, setChildName] = useState(cachedTip?.childName || "Explorer");
  const [parentLevel, setParentLevel] = useState(cachedTip?.parentLevel || 1);
  const [childLevel, setChildLevel] = useState(cachedTip?.childLevel || 1);
  const [xp, setXp] = useState(cachedTip?.xp || 0);
  const [totalStars, setTotalStars] = useState(cachedTip?.totalStars || 0);
  const [streak, setStreak] = useState(cachedTip?.streak || 0);
  const [totalTests, setTotalTests] = useState(cachedTip?.totalTests || 0);
  const [accuracy, setAccuracy] = useState(cachedTip?.accuracy || 0);
  const [childCity, setChildCity] = useState(cachedTip?.childCity || "Egg Village");

  // Daily tip from backend
  const [tip, setTip] = useState<Tip | null>(cachedTip?.tip || {
    title: "Be Present & Active",
    description: "Spend 10 uninterrupted minutes with your child today. Put the phone away, make eye contact, and listen to their thoughts on today's learning.",
    benefit: "Builds deep trust, emotional security, and boosts learning confidence.",
  });
  const [tipLoading, setTipLoading] = useState(!cachedTip);

  // ── Level XP thresholds ──────────────────────────────────────────────────
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

  // ── Dynamic Growth Rate Calculation ─────────────────────────────────────
  const baseGrowthFromXp = Math.min(100, Math.round((roadmapXp / 2500) * 100));
  const accuracyContribution = accuracy > 0 ? accuracy : 75;
  const growthScore = Math.min(100, Math.max(15, Math.round((baseGrowthFromXp * 0.5) + (accuracyContribution * 0.5))));

  // Dynamic growth message based on score
  const growthMessage =
    growthScore >= 80 ? "Outstanding! You're in the top tier of parents! 🏆" :
    growthScore >= 60 ? "You're soaring! Keep the momentum going! 🚀" :
    growthScore >= 40 ? "Good progress! Every day counts. 💪" :
    growthScore >= 20 ? "Getting started — consistency is your superpower! 🌱" :
    "Begin your journey — complete lessons to grow! ✨";

  // ── Dynamic Milestones built from real User & Report Data ─────────────────
  const milestones: Milestone[] = [
    {
      icon: <Flame size={22} />,
      title: streak >= 7 ? "7-Day Streak Achieved! 🔥" : `${streak}/7 Day Streak`,
      subtitle: streak >= 7 ? "Consistency master!" : streak === 0 ? "Log in daily to start your streak!" : `${7 - streak} more days to go`,
      completed: streak >= 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: <Trophy size={22} />,
      title: totalTests >= 5 ? "5+ Lessons & Quizzes Done! 🎓" : `${totalTests}/5 Lessons Done`,
      subtitle: totalTests >= 5 ? "Dedicated learning partner!" : `${Math.max(1, 5 - totalTests)} more lessons to go`,
      completed: totalTests >= 5,
      progress: Math.min(100, Math.round((totalTests / 5) * 100)),
      iconBg: "bg-indigo-100",
      iconColor: "text-[#141779]",
    },
    {
      icon: <Star size={22} />,
      title: totalStars >= 50 || xp >= 500 ? "50+ Learning Milestones! ⭐" : `${Math.min(50, totalStars || Math.round(xp / 10))}/50 Points Earned`,
      subtitle: totalStars >= 50 || xp >= 500 ? "Rising star family!" : "Complete lessons & quests to earn milestone stars",
      completed: totalStars >= 50 || xp >= 500,
      progress: Math.min(100, Math.round((Math.max(totalStars, xp / 10) / 50) * 100)),
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: <Brain size={22} />,
      title: accuracy >= 70 || xp >= 1200 ? "70%+ Cognitive Mastery! 🧠" : `${accuracy || 70}% Cognitive Accuracy`,
      subtitle: accuracy >= 70 || xp >= 1200 ? "High reasoning & logic performance!" : "Keep practicing to boost cognitive score",
      completed: accuracy >= 70 || xp >= 1200,
      progress: Math.min(100, Math.max(20, accuracy || Math.round((xp / 1200) * 100))),
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
  ];

  // ── Fetch all data in Parallel ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchAll() {
      const nextCache: any = cachedTip ? { ...cachedTip } : {};

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
              const childObj = (u.children && u.children[0]) || {};

              const effectiveXp = Math.max(u.xp || 0, u.parentXp || 0, childObj.xp || 0);
              const effectiveLevel = Math.max(u.level || 1, u.parentLevel || 1, childObj.level || 1, 1);
              const effectiveStars = Math.max((u.parentStars || 0) + (u.totalStars || 0) + (u.stars || 0), childObj.coins || 0);
              const effectiveStreak = Math.max(u.streakDays || 0, u.parentStreak || 0, childObj.streakDays || 0);

              setChildName(u.childName || childObj.childName || "Explorer");
              setParentLevel(effectiveLevel);
              setChildLevel(childObj.level || u.level || 1);
              setXp(effectiveXp);
              setTotalStars(effectiveStars);
              setStreak(effectiveStreak);

              nextCache.childName = u.childName || childObj.childName || "Explorer";
              nextCache.parentLevel = effectiveLevel;
              nextCache.childLevel = childObj.level || u.level || 1;
              nextCache.xp = effectiveXp;
              nextCache.totalStars = effectiveStars;
              nextCache.streak = effectiveStreak;
            }
          }

          if (gRes) {
            const gJson = await gRes.json();
            if (gJson.success && gJson.data) {
              setChildLevel(prev => Math.max(prev, gJson.data.level || 1));
              nextCache.childLevel = Math.max(nextCache.childLevel || 1, gJson.data.level || 1);
            }
          }

          if (rRes) {
            const rJson = await rRes.json();
            if (rJson.success && rJson.data) {
              const tests = Math.max(rJson.data.totalTests || 0, rJson.data.totalChaptersCompleted || 0, rJson.data.todaySolved > 0 ? 1 : 0);
              const acc = rJson.data.overallAccuracy || rJson.data.weeklyConfidenceScore || 0;
              setTotalTests(tests);
              setAccuracy(acc);
              nextCache.totalTests = tests;
              nextCache.accuracy = acc;
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

  return (
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans">

      {/* ── Top Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex items-center px-6 h-16 gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all">
          <ArrowLeft size={20} className="text-[#141779]" />
        </button>
        <h1 className="text-xl font-black text-[#141779] tracking-tight">{t("daily_tip") || "Daily Parenting Tip"}</h1>
      </header>

      {/* ── Main Content Container with Clearance ── */}
      <main className="flex-1 pt-20 pb-32 px-5 flex flex-col gap-6 relative z-10 max-w-lg mx-auto w-full">

        {/* ── Today's Tip Card ── */}
        <section className="w-full bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <Lightbulb className="text-[#006a62]" size={20} fill="currentColor" />
              </div>
              <h2 className="text-[#141779] font-black text-lg">Today's Parenting Tip</h2>
            </div>
            <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Day {new Date().getDate()}
            </span>
          </div>

          {tipLoading ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          ) : tip ? (
            <>
              {tip.instead ? (
                <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3 border border-slate-200/80">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Instead of:</span>
                    <p className="text-slate-600 font-semibold italic text-sm">{tip.instead}</p>
                  </div>
                  <div className="h-[1px] w-full bg-slate-200"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-[#006a62] uppercase tracking-wider">Try:</span>
                    <p className="text-[#141779] font-bold text-sm leading-relaxed">{tip.try}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-50/80 to-teal-50/50 rounded-2xl p-5 border border-indigo-100/80 shadow-2xs">
                  {tip.title && <p className="text-[#141779] font-black text-base mb-2">💡 {tip.title}</p>}
                  <p className="text-slate-800 font-bold text-sm leading-relaxed tracking-tight">{tip.description}</p>
                </div>
              )}

              {tip.benefit && (
                <div className="flex items-start gap-2.5 text-[#006a62] bg-teal-50/60 p-3 rounded-xl border border-teal-100/80">
                  <CheckCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-extrabold text-[#006a62] leading-snug">{tip.benefit}</p>
                </div>
              )}

              {tip.rewardPoints && (
                <div className="flex items-center gap-1.5 self-start bg-teal-50 border border-teal-200 text-[#006a62] px-3 py-1 rounded-full">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-black">+{tip.rewardPoints} XP for applying this tip</span>
                </div>
              )}

              <button
                onClick={() => navigate("/parent/lessons")}
                className="w-full bg-[#141779] text-white py-3 rounded-full font-black text-sm hover:bg-[#1e23a0] active:scale-95 transition-all shadow-md mt-1"
              >
                Explore Related Lessons →
              </button>
            </>
          ) : (
            <p className="text-slate-500 font-bold text-sm text-center py-4">No tip available today. Check back tomorrow!</p>
          )}
        </section>

        {/* ── Dynamic Growth Score Ring ── */}
        <section className="w-full bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-[#57fae9]/20 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center relative p-1.5 shadow-md"
              style={{ background: `conic-gradient(from 0deg, #006a62 0%, #57fae9 ${growthScore}%, #e2e8f0 ${growthScore}%)` }}
            >
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-[#006a62] font-black text-[42px] leading-none">{growthScore}%</span>
                <span className="text-slate-600 font-extrabold text-[11px] uppercase tracking-wider mt-1">Growth Score</span>
              </div>
            </div>
          </div>
          <p className="text-slate-800 font-black text-base px-2 leading-snug mt-1">{growthMessage}</p>
          <div className="mt-3 bg-indigo-50 border border-indigo-100 text-[#141779] px-4 py-1.5 rounded-full text-xs font-black">
            {stageName} · Roadmap Stage
          </div>
        </section>

        {/* ── Streak + Combo Badge ── */}
        <section className="w-full bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${streak > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"}`}>
              <Flame size={24} />
            </div>
            <div>
              <h3 className="text-[#141779] font-black text-base">
                {streak > 0 ? `${streak} Day Streak 🔥` : "No Active Streak"}
              </h3>
              <p className="text-slate-600 font-bold text-xs">
                {streak === 0 ? "Log in daily to build your streak!" : `${streak} consecutive active days!`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[#141779] font-black text-base">
              <span>P{parentLevel}+C{childLevel}</span>
              <Zap size={16} fill="currentColor" className="text-amber-500" />
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Combo Level</span>
          </div>
        </section>

        {/* ── Parent + Child Split Cards ── */}
        <section className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#141779] font-black text-[10px] uppercase tracking-wider">PARENT</span>
              <ShieldCheck className="text-[#141779]" size={16} />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xl mb-1 shadow-xs">
                👨‍👩‍👦
              </div>
              <h4 className="text-[#141779] font-black text-sm leading-tight">{stageName}</h4>
              <p className="text-slate-500 font-extrabold text-[11px] mb-2">LVL {parentLevel}</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-slate-600 text-[10px] font-extrabold mt-1">{xp} / {xpForNextLevel} XP</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#006a62] font-black text-[10px] uppercase tracking-wider">CHILD</span>
              <span className="material-symbols-outlined text-[#006a62] text-[16px]">child_care</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xl mb-1 shadow-xs">
                🐉
              </div>
              <h4 className="text-[#141779] font-black text-sm leading-tight truncate w-full">{childName}</h4>
              <p className="text-slate-500 font-extrabold text-[11px] mb-2">LVL {childLevel}</p>
              <div className="flex items-center gap-1 text-[#006a62] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                <span className="truncate max-w-[90px]">{childCity}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Family Milestones Section (with extra clearance) ── */}
        <section className="w-full flex flex-col gap-3 pb-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[#141779] font-black text-lg tracking-tight">Family Milestones</h2>
            <span className="text-[10px] font-black text-[#006a62] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              {milestones.filter(m => m.completed).length}/{milestones.length} Done
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-[20px] shadow-xs border transition-all ${
                  m.completed
                    ? "bg-white border-teal-200/80"
                    : "bg-white border-slate-200/80"
                }`}
              >
                <div className={`w-11 h-11 ${m.iconBg} ${m.iconColor} rounded-2xl flex items-center justify-center shrink-0 shadow-2xs`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[#141779] font-black text-sm">{m.title}</h5>
                  <p className="text-slate-600 font-bold text-xs mt-0.5">{m.subtitle}</p>
                  {!m.completed && m.progress !== undefined && (
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 border border-slate-200/60">
                      <div
                        className="h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] rounded-full transition-all duration-700"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {m.completed
                  ? <CheckCircle className="text-[#006a62] shrink-0" size={22} />
                  : <Target className="text-slate-300 shrink-0" size={22} />
                }
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

