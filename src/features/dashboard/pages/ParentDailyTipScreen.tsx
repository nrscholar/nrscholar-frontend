import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb, Flame, ShieldCheck,
  Brain, CheckCircle, CheckCircle2, Star, Zap, ArrowLeft, Trophy, Target, Bell
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";

interface Tip {
  instead?: string;
  try?: string;
  benefit?: string;
  title?: string;
  description?: string;
  rewardPoints?: number;
  category?: string;
  actionStep?: string;
  status?: string;
  subject?: string;
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

  // Daily tip from backend (no fake static tip fallback)
  const [tip, setTip] = useState<Tip | null>(cachedTip?.tip || null);
  const [tipLoading, setTipLoading] = useState(!cachedTip?.tip);
  const [metrics, setMetrics] = useState<any>(cachedTip?.metrics || null);

  // Header notifications & child switcher modal
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);

  // ── Level XP thresholds ──────────────────────────────────────────────────
  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  const roadmapXp = xp;
  const stageName =
    roadmapXp >= 5000 ? t("master_parent", "Master Parent") :
    roadmapXp >= 2500 ? t("mindful_parent", "Mindful Parent") :
    roadmapXp >= 1200 ? t("growth_coach", "Growth Coach") :
    roadmapXp >= 500  ? t("calm_parent", "Calm Parent")   : t("new_parent", "New Parent");

  const xpForCurrentLevel = getXpForLevel(parentLevel);
  const xpForNextLevel    = getXpForLevel(parentLevel + 1);
  const levelProgress = xpForNextLevel > xpForCurrentLevel
    ? Math.min(100, Math.round(((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100))
    : 100;

  // ── Dynamic Growth Rate Calculation (ZERO Fake Fallback Percentages) ───────
  const hasRealData = metrics?.hasRealData ?? (totalTests > 0 || accuracy > 0);
  const baseGrowthFromXp = Math.min(100, Math.round((roadmapXp / 2500) * 100));

  // Compute genuine growth score only if real attempts/tests exist
  const computedGrowthScore = (metrics?.growthScore !== undefined && metrics?.growthScore !== null)
    ? metrics.growthScore
    : (hasRealData
        ? Math.min(100, Math.round((baseGrowthFromXp * 0.5) + (accuracy * 0.5)))
        : null);

  const growthScore = computedGrowthScore;

  // Dynamic growth message based on score
  const growthMessage = !hasRealData
    ? t("growth_msg_new_user", "Welcome! Complete your child's first quest to unlock real-time growth analytics. 🌱")
    : (growthScore !== null && growthScore >= 80 ? t("growth_msg_80", "Outstanding! You're in the top tier of parents! 🏆") :
       growthScore !== null && growthScore >= 60 ? t("growth_msg_60", "You're soaring! Keep the momentum going! 🚀") :
       growthScore !== null && growthScore >= 40 ? t("growth_msg_40", "Good progress! Every day counts. 💪") :
       growthScore !== null && growthScore >= 20 ? t("growth_msg_20", "Getting started — consistency is your superpower! 🌱") :
       t("growth_msg_0", "Begin your journey — complete lessons to grow! ✨"));

  // ── Dynamic Milestones built from real User & Report Data ─────────────────
  const milestones: Milestone[] = [
    {
      icon: <Flame size={22} />,
      title: streak >= 7 ? t("streak_7_achieved", "7-Day Streak Achieved! 🔥") : t("streak_progress", { count: streak, defaultValue: `${streak}/7 Day Streak` }),
      subtitle: streak >= 7 ? t("consistency_master", "Consistency master!") : streak === 0 ? t("log_in_daily_streak", "Log in daily to start your streak!") : t("days_to_go", { count: 7 - streak, defaultValue: `${7 - streak} more days to go` }),
      completed: streak >= 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: <Trophy size={22} />,
      title: totalTests >= 5 ? t("lessons_done_5", "5+ Lessons & Quizzes Done! 🎓") : t("lessons_progress", { count: totalTests, defaultValue: `${totalTests}/5 Lessons Done` }),
      subtitle: totalTests >= 5 ? t("dedicated_learning_partner", "Dedicated learning partner!") : t("lessons_to_go", { count: Math.max(1, 5 - totalTests), defaultValue: `${Math.max(1, 5 - totalTests)} more lessons to go` }),
      completed: totalTests >= 5,
      progress: Math.min(100, Math.round((totalTests / 5) * 100)),
      iconBg: "bg-indigo-100",
      iconColor: "text-[#141779]",
    },
    {
      icon: <Star size={22} />,
      title: totalStars >= 50 ? t("milestones_50", "50+ Learning Milestones! ⭐") : t("points_earned_progress", { count: totalStars, defaultValue: `${totalStars}/50 Points Earned` }),
      subtitle: totalStars >= 50 ? t("rising_star_family", "Rising star family!") : t("complete_lessons_stars", "Complete lessons & quests to earn milestone stars"),
      completed: totalStars >= 50,
      progress: Math.min(100, Math.round((totalStars / 50) * 100)),
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: <Brain size={22} />,
      title: hasRealData
        ? (accuracy >= 70 ? t("cognitive_mastery_70", "70%+ Cognitive Mastery! 🧠") : t("cognitive_accuracy_fmt", { acc: accuracy, defaultValue: `${accuracy}% Cognitive Accuracy` }))
        : t("cognitive_baseline", "Cognitive Baseline 🧠"),
      subtitle: hasRealData
        ? (accuracy >= 70 ? t("high_reasoning_perf", "High reasoning & logic performance!") : t("keep_practicing_boost", "Keep practicing to boost cognitive score"))
        : t("awaiting_first_mission", "Complete 1st quest to calculate cognitive accuracy"),
      completed: hasRealData && accuracy >= 70,
      progress: hasRealData ? Math.min(100, accuracy) : 0,
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
            if (tJson.data.childName) {
              setChildName(tJson.data.childName);
            }
            if (tJson.data.metrics) {
              setMetrics(tJson.data.metrics);
              nextCache.metrics = tJson.data.metrics;
              if (tJson.data.metrics.accuracy !== null && tJson.data.metrics.accuracy !== undefined) {
                setAccuracy(tJson.data.metrics.accuracy);
                nextCache.accuracy = tJson.data.metrics.accuracy;
              }
              if (tJson.data.metrics.streak !== undefined) {
                setStreak(tJson.data.metrics.streak);
              }
              if (tJson.data.metrics.totalStars !== undefined) {
                setTotalStars(tJson.data.metrics.totalStars);
              }
              if (tJson.data.metrics.totalTests !== undefined) {
                setTotalTests(tJson.data.metrics.totalTests);
              }
            }
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

              const parentXpVal = u.parentXp !== undefined ? u.parentXp : 0;
              const parentLevelVal = u.parentLevel !== undefined ? u.parentLevel : 1;
              const effectiveStars = (u.parentStars || 0) + (u.totalStars || 0) + (u.stars || 0);
              const effectiveStreak = u.parentStreak !== undefined ? u.parentStreak : 0;

              setUserData(u);
              setChildName(u.childName || childObj.childName || "Explorer");
              setParentLevel(parentLevelVal);
              setChildLevel(childObj.level || u.level || 1);
              setXp(parentXpVal);
              setTotalStars(effectiveStars);
              setStreak(effectiveStreak);

              nextCache.childName = u.childName || childObj.childName || "Explorer";
              nextCache.parentLevel = parentLevelVal;
              nextCache.childLevel = childObj.level || u.level || 1;
              nextCache.xp = parentXpVal;
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
              const tests = rJson.data.totalChaptersCompleted || 0;
              const acc = (rJson.data.overallAccuracy !== undefined && rJson.data.overallAccuracy !== null)
                ? rJson.data.overallAccuracy
                : (rJson.data.weeklyConfidenceScore || 0);
              setTotalTests(prev => Math.max(prev, tests));
              if (acc > 0) {
                setAccuracy(acc);
                nextCache.accuracy = acc;
              }
              nextCache.totalTests = tests;
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

      const notifPromise = apiFetch("/api/notifications?role=parent")
        .then(res => res.json())
        .then(nJson => {
          if (nJson.success && Array.isArray(nJson.data)) {
            setUnreadCount(nJson.data.filter((n: any) => !n.isRead).length);
          }
        })
        .catch(() => {});

      await Promise.all([tipPromise, statsPromise, notifPromise]);
      sessionStorage.setItem("parent_daily_tip_cache", JSON.stringify(nextCache));
    }

    fetchAll();

    const handleUserDataUpdate = () => {
      sessionStorage.removeItem("parent_daily_tip_cache");
      fetchAll();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateTipField = (text?: string) => {
    if (!text) return "";
    const trimmed = text.trim();

    // 1. Screen-Free Dinner Table
    if (/Screen-Free Dinner Table/i.test(trimmed)) {
      return t("tip_screen_free_table", "Screen-Free Dinner Table");
    }
    if (/Designate the dinner table as a screen-free zone/i.test(trimmed)) {
      return t("tip_screen_free_table_desc", "Designate the dinner table as a screen-free zone for everyone. Use this time for family conversation.");
    }
    if (/Strengthens family connections and social habits/i.test(trimmed)) {
      return t("tip_screen_free_table_benefit", "Strengthens family connections and social habits.");
    }

    // 2. Model Self-Regulation
    if (/Model Self-Regulation/i.test(trimmed)) {
      return t("model_self_regulation", "Model Self-Regulation");
    }
    if (/When you feel frustrated, speak your coping strategy/i.test(trimmed)) {
      return t("model_self_regulation_desc", "When you feel frustrated, speak your coping strategy aloud: 'I'm feeling a bit overwhelmed, so I'm going to take three deep breaths.'");
    }
    if (/Teaches emotional control by example/i.test(trimmed)) {
      return t("model_self_regulation_benefit", "Teaches emotional control by example.");
    }

    // 3. Establish Bedtime Routines
    if (/Establish Bedtime Routines/i.test(trimmed)) {
      return t("tip_bedtime_routines", "Establish Bedtime Routines");
    }
    if (/Create a consistent bedtime routine/i.test(trimmed)) {
      return t("tip_bedtime_routines_desc", "Create a consistent bedtime routine. Clear structures help children feel safe and reduce transition anxiety.");
    }
    if (/Improves sleep quality/i.test(trimmed)) {
      return t("tip_bedtime_routines_benefit", "Improves sleep quality and emotional stability.");
    }

    const direct = t(trimmed, "");
    if (direct && direct !== trimmed) return direct;

    return t(trimmed, trimmed);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans max-w-md mx-auto">

      {/* ── Top Header matching Child Space Header exactly ── */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between px-4 pt-3 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-2xl shadow-[0_4px_16px_rgba(20,23,121,0.05)] gap-2 w-full">
        {/* Left Side: Back button + Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex flex-col min-w-0 justify-center">
            <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
              {t("daily_parenting_tip", "Daily Parenting Tip")}
            </h1>
            <span className="text-[10.5px] sm:text-xs text-slate-400 font-extrabold truncate mt-0.5">
              {childName ? `${childName} • ` : ""}{t("parent_guidance", "Parent Guidance")}
            </span>
          </div>
        </div>

        {/* Right Side: Currency / XP & Notification Indicators */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => navigate("/parent/roadmap")}
            className="bg-[#eef2ff] hover:bg-indigo-100 border border-indigo-100/90 rounded-2xl px-2.5 py-1.5 flex items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-transform shadow-2xs cursor-pointer"
            title={t("view_roadmap", "View Roadmap & XP")}
            aria-label={t("xp_count", { xp, defaultValue: `${xp.toLocaleString()} XP` })}
          >
            <span className="text-xs text-amber-500 leading-none">⭐</span>
            <span className="text-[11px] font-black text-[#141779] leading-none whitespace-nowrap">
              {xp.toLocaleString()} XP
            </span>
          </button>
          
          <button
            onClick={() => navigate("/notifications")}
            className="w-9 h-9 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shrink-0 border border-slate-100 relative cursor-pointer"
            aria-label={t("notifications", "Notifications")}
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

      {/* ── Main Content Container with Clearance for Bottom Navigation ── */}
      <main className="flex-1 px-4 pt-3.5 pb-32 sm:pb-36 flex flex-col gap-3.5 relative z-10 max-w-md mx-auto w-full">

        {/* ── 1. Today's Parenting Tip Card (Primary Focus) ── */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8.5 h-8.5 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-[#006a62] shrink-0">
                <Lightbulb size={18} fill="currentColor" />
              </div>
              <h2 className="text-[#141779] font-black text-base sm:text-lg truncate">
                {t("todays_parenting_tip", "Today's Parenting Tip")}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {tip?.category && (
                <span className="text-[10px] font-black text-[#006a62] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {tip.category}
                </span>
              )}
              <span className="text-[10px] sm:text-[11px] font-black text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t("day_num", { day: streak > 0 ? streak : 1, defaultValue: streak > 0 ? `Day ${streak}` : "Day 1" })}
              </span>
            </div>
          </div>

          {tipLoading ? (
            <div className="space-y-2.5 py-2">
              <div className="h-4 bg-slate-200/60 animate-skeleton rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-200/60 animate-skeleton rounded-lg w-full"></div>
              <div className="h-4 bg-slate-200/60 animate-skeleton rounded-lg w-5/6"></div>
            </div>
          ) : tip ? (
            <>
              {tip.subject && (
                <div className="flex items-center gap-1.5 self-start bg-indigo-50/80 text-[#141779] border border-indigo-200/70 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                  <span>🎯 {t("focus_subject", "Subject Focus")}: {tip.subject}</span>
                </div>
              )}

              {tip.instead ? (
                <div className="bg-slate-50/90 rounded-2xl p-3.5 flex flex-col gap-2.5 border border-slate-200/70">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">{t("instead_of", "Instead of:")}</span>
                    <p className="text-slate-600 font-semibold italic text-xs sm:text-sm leading-relaxed">{translateTipField(tip.instead)}</p>
                  </div>
                  <div className="h-[1px] w-full bg-slate-200/80" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-black text-[#006a62] uppercase tracking-wider">{t("try_this", "Try:")}</span>
                    <p className="text-[#141779] font-bold text-xs sm:text-sm leading-relaxed">{translateTipField(tip.try)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-50/80 via-white to-teal-50/40 rounded-2xl p-4 border border-indigo-100/80 shadow-2xs">
                  {tip.title && <h3 className="text-[#141779] font-black text-sm sm:text-base mb-1.5">💡 {translateTipField(tip.title)}</h3>}
                  <p className="text-slate-800 font-semibold text-xs sm:text-sm leading-relaxed">{translateTipField(tip.description)}</p>
                </div>
              )}

              {/* Suggested Action Step */}
              {tip.actionStep && (
                <div className="flex items-start gap-2.5 text-indigo-950 bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100/90 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={15} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 leading-tight">{t("action_step", "Action Step")}</span>
                    <p className="text-xs font-bold text-indigo-950 leading-snug mt-0.5">{translateTipField(tip.actionStep)}</p>
                  </div>
                </div>
              )}

              {/* Expected Learning or Communication Benefit */}
              {tip.benefit && (
                <div className="flex items-start gap-2.5 text-[#006a62] bg-teal-50/70 p-3 rounded-2xl border border-teal-100/90 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#006a62] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] leading-tight">{t("why_it_matters", "Why It Matters")}</span>
                    <p className="text-xs font-extrabold text-[#006a62] leading-snug mt-0.5">{translateTipField(tip.benefit)}</p>
                  </div>
                </div>
              )}

              {/* XP Reward for applying tip */}
              {tip.rewardPoints && (
                <div className="flex items-center gap-1.5 self-start bg-teal-50 border border-teal-200/80 text-[#006a62] px-2.5 py-1 rounded-full text-xs font-black shadow-2xs">
                  <Star size={12} fill="currentColor" />
                  <span>+{tip.rewardPoints} XP {t("for_applying_tip", "for applying this tip")}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => navigate("/parent/lessons")}
                className="w-full bg-[#141779] text-white py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm hover:bg-[#1e23a0] active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 mt-0.5"
              >
                <span>{t("explore_related_lessons", "Explore Related Lessons")}</span>
                <span>→</span>
              </button>
            </>
          ) : (
            <p className="text-slate-500 font-bold text-sm text-center py-4">{t("no_tip_available_today", "No tip available today. Check back tomorrow!")}</p>
          )}
        </section>

        {/* ── 2. Growth Score and Streak Section (Compact & Balanced) ── */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex flex-col gap-3.5">
          {/* Growth Score Gauge & Roadmap Stage */}
          <div className="flex items-center gap-3.5">
            {hasRealData && growthScore !== null ? (
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#006a62] transition-all duration-1000 ease-out"
                    strokeDasharray={`${Math.min(100, Math.max(0, growthScore))}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[#006a62] font-black text-lg sm:text-xl leading-none">
                    {growthScore}%
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
                    {t("growth_score", "Score")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 border-dashed border-teal-300 flex flex-col items-center justify-center bg-teal-50/50 shrink-0">
                <span className="text-xl">🌱</span>
                <span className="text-[9px] font-black text-[#006a62] uppercase tracking-wider mt-0.5">Day 1</span>
              </div>
            )}

            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                  {t("growth_score", "Growth Score")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#141779] text-[10px] font-black">
                  {stageName}
                </span>
              </div>
              <p className="text-slate-700 font-bold text-xs sm:text-[13px] leading-snug">
                {growthMessage}
              </p>
            </div>
          </div>

          {/* Streak & Combo Mini-grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-100">
            {/* Streak */}
            <div className="bg-slate-50/80 rounded-2xl p-2.5 sm:p-3 border border-slate-200/70 flex items-center gap-2.5 shadow-2xs">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${streak > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"}`}>
                <Flame size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black text-[#141779] truncate leading-tight">
                  {streak > 0 ? t("day_streak_fire", { streak, defaultValue: `${streak} Day Streak 🔥` }) : t("no_active_streak", "0 Day Streak")}
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                  {streak === 0 ? t("log_in_daily_streak", "Start today") : t("active_days", { streak, defaultValue: `${streak} active days` })}
                </p>
              </div>
            </div>

            {/* Combo Level */}
            <div className="bg-slate-50/80 rounded-2xl p-2.5 sm:p-3 border border-slate-200/70 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Zap size={18} fill="currentColor" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black text-[#141779] truncate leading-tight">
                  P{parentLevel}+C{childLevel}
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider truncate mt-0.5">
                  {t("combo_level", "Combo Level")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Family Context & Profile Identity Section ── */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex items-center justify-between gap-3">
          {/* Parent Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-base shrink-0 shadow-2xs">
              👨‍👩‍👦
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#141779] block">
                {t("parent", "Parent")} · Lvl {parentLevel}
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-800 truncate leading-tight">
                {stageName}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/60 mt-1 max-w-[120px]">
                <div
                  className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 shrink-0" />

          {/* Child Info with Switch Affordance */}
          <button
            onClick={() => setShowSwitcher(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left group cursor-pointer hover:opacity-90 transition-opacity"
            title={t("switch_child_profile", "Switch Student Profile")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-50 border border-teal-200/80 flex items-center justify-center text-base shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              🐉
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#006a62] block truncate">
                  {t("child", "Child")} · Lvl {childLevel}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-indigo-600 font-bold">▾</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-800 truncate leading-tight group-hover:text-indigo-900 transition-colors">
                {childName}
              </p>
              <span className="text-[10px] font-bold text-slate-400 truncate block mt-0.5">
                📍 {childCity}
              </span>
            </div>
          </button>
        </section>

        {/* ── 4. Family Milestones Section ── */}
        <section className="w-full flex flex-col gap-2.5 pb-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[#141779] font-black text-sm sm:text-base tracking-tight">
              {t("family_milestones", "Family Milestones")}
            </h2>
            <span className="text-[10px] font-black text-[#006a62] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              {milestones.filter(m => m.completed).length}/{milestones.length} {t("done", "Done")}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all shadow-2xs ${
                  m.completed
                    ? "bg-white border-teal-200/80"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${m.iconBg} ${m.iconColor} rounded-xl flex items-center justify-center shrink-0 shadow-2xs`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-[#141779] font-black text-xs sm:text-sm truncate">{m.title}</h5>
                    {m.completed ? (
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#006a62] border border-teal-200 text-[9px] sm:text-[10px] font-black shrink-0">
                        ✓ {t("completed", "Completed")}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {m.progress}%
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-semibold text-[10px] sm:text-[11px] mt-0.5 leading-snug">{m.subtitle}</p>
                  {!m.completed && m.progress !== undefined && (
                    <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden mt-1.5 border border-slate-200/60">
                      <div
                        className="h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Child Switcher Modal */}
      <ChildSwitcherModal
        isOpen={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        user={userData}
        onUserUpdated={(u) => setUserData(u)}
        onSwitched={() => {
          sessionStorage.removeItem("parent_daily_tip_cache");
          window.location.reload();
        }}
      />
    </div>
  );
}

