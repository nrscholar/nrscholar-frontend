import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, BookOpen, Flame, Lock, GraduationCap, Users, X, 
  Settings, ArrowLeft, Trophy, Sparkles, CheckCircle2, Bell, Star
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import { getActiveUserContext } from "../../../utils/sessionCache";
import { useLockBodyScroll } from "../../../utils/useLockBodyScroll";

export default function ParentAchievementsScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeAchievement, setActiveAchievement] = useState<any | null>(null);
  const [badgesEarned, setBadgesEarned] = useState(0);
  const [globalRank, setGlobalRank] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [parentPhoto, setParentPhoto] = useState("");
  const [username, setUsername] = useState("Parent");
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  useLockBodyScroll(Boolean(activeAchievement));

  const fetchStats = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const ctx = getActiveUserContext();
      const childParam = ctx.childId ? `childId=${encodeURIComponent(ctx.childId)}` : "";
      const classParam = ctx.classLevel ? `classLevel=${encodeURIComponent(ctx.classLevel)}` : "";
      const q = [childParam, classParam].filter(Boolean).join("&");

      const uPromise = apiFetch("/api/users/me").then(r => r.json()).catch(() => ({ success: false }));
      const libPromise = apiFetch("/api/parent/learning-library").then(r => r.json()).catch(() => ({ success: false }));
      const chalPromise = apiFetch("/api/parent/challenges").then(r => r.json()).catch(() => ({ success: false }));
      const achPromise = apiFetch(`/api/parent/achievements${q ? `?${q}` : ""}`).then(r => r.json()).catch(() => ({ success: false }));
      const rankPromise = apiFetch(`/api/parent/rank${q ? `?${q}` : ""}`).then(r => r.json()).catch(() => ({ success: false }));

      const [uRes, libRes, chalRes, achRes, rankRes] = await Promise.allSettled([
        uPromise, libPromise, chalPromise, achPromise, rankPromise
      ]);

      let userObj: any = null;
      let realStreak = 0;
      let realXp = 0;
      if (uRes.status === "fulfilled" && uRes.value?.success && uRes.value.data?.user) {
        userObj = uRes.value.data.user;
        setParentPhoto(userObj.parentPhoto || "");
        setUsername(userObj.parentName || userObj.username || "Parent");
        realStreak = userObj.parentStreak !== undefined ? userObj.parentStreak : (userObj.streak || 0);
        realXp = userObj.parentXp !== undefined ? userObj.parentXp : (userObj.xp || 0);
      }

      let completedLessonsCount = 0;
      if (libRes.status === "fulfilled" && libRes.value?.success && Array.isArray(libRes.value.data?.topics)) {
        completedLessonsCount = libRes.value.data.topics.filter((t: any) => t.status === "completed").length;
      }
      try {
        const cached = JSON.parse(sessionStorage.getItem("parent_learning_library_cache") || "{}");
        if (Array.isArray(cached?.topics)) {
          const cCount = cached.topics.filter((t: any) => t.status === "completed").length;
          completedLessonsCount = Math.max(completedLessonsCount, cCount);
        }
      } catch (_) {}

      let completedChallengesCount = 0;
      if (chalRes.status === "fulfilled" && chalRes.value?.success && Array.isArray(chalRes.value.data?.challenges)) {
        completedChallengesCount = chalRes.value.data.challenges.filter(
          (c: any) => c.isCompleted || c.claimed || (c.completedDays && c.totalDays && c.completedDays >= c.totalDays)
        ).length;
      }

      if (rankRes.status === "fulfilled" && rankRes.value?.success && rankRes.value.data?.rank) {
        setGlobalRank(rankRes.value.data.rank);
      } else {
        const uXpTotal = realXp + (userObj?.xp || 0);
        const derivedRank = Math.max(1, Math.min(100, 100 - Math.floor(uXpTotal / 50)));
        setGlobalRank(derivedRank);
      }

      const defaultAchievements = [
        {
          id: "lesson",
          title: "First Steps",
          icon: "BookOpen",
          desc: "Successfully completed your first parenting module or test. The journey of a thousand miles begins here!",
          totalRequired: 1,
          currentProgress: completedLessonsCount,
          progressUnit: "Modules"
        },
        {
          id: "streak7",
          title: "Week On Fire",
          icon: "Flame",
          desc: "Maintained a consistent learning rhythm for 7 consecutive days. You are building amazing habits!",
          totalRequired: 7,
          currentProgress: realStreak,
          progressUnit: "Days"
        },
        {
          id: "streak30",
          title: "Monthly Master",
          icon: "Lock",
          desc: "Achieve a 30-day learning streak to unlock this achievement.",
          totalRequired: 30,
          currentProgress: realStreak,
          progressUnit: "Days"
        },
        {
          id: "lesson10",
          title: "Rising Scholar",
          icon: "GraduationCap",
          desc: "You have completed 10 lessons or tests! Your dedication to growth is making a real difference at home.",
          totalRequired: 10,
          currentProgress: completedLessonsCount,
          progressUnit: "Lessons"
        },
        {
          id: "challenges5",
          title: "Challenger",
          icon: "Lock",
          desc: "Complete 5 growth challenges to unlock this badge.",
          totalRequired: 5,
          currentProgress: completedChallengesCount,
          progressUnit: "Challenges"
        },
        {
          id: "community1",
          title: "Supporter",
          icon: "Users",
          desc: "Participate in the community forum.",
          totalRequired: 1,
          currentProgress: 0,
          progressUnit: "Posts"
        }
      ];

      const baseList = (achRes.status === "fulfilled" && achRes.value?.success && Array.isArray(achRes.value.data?.achievements) && achRes.value.data.achievements.length > 0)
        ? achRes.value.data.achievements
        : defaultAchievements;

      const enriched = baseList.map((ach: any) => {
        let progress = ach.currentProgress ?? 0;

        if (ach.id === "lesson" || ach.id === "lesson10" || /first steps|rising scholar|lesson|module/i.test(ach.title)) {
          progress = Math.max(progress, completedLessonsCount);
        } else if (ach.id === "streak7" || ach.id === "streak30" || /fire|streak|master/i.test(ach.title)) {
          progress = Math.max(progress, realStreak);
        } else if (ach.id === "challenges5" || /challenger/i.test(ach.title)) {
          progress = Math.max(progress, completedChallengesCount);
        }

        return {
          ...ach,
          currentProgress: progress
        };
      });

      setAchievements(enriched);
      const unlockedCount = enriched.filter((a: any) => a.currentProgress >= a.totalRequired).length;
      setBadgesEarned(unlockedCount);

      // Keep active achievement drawer modal synchronized in real time
      setActiveAchievement((prev: any) => {
        if (!prev) return null;
        return enriched.find((a: any) => a.id === prev.id) || prev;
      });
    } catch (e) {
      console.error("Failed to fetch achievements telemetry", e);
    } finally {
      if (!isSilent) {
        setTimeout(() => setLoading(false), 250);
      }
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const handleDataUpdate = () => {
      fetchStats(true);
    };

    window.addEventListener("userDataUpdated", handleDataUpdate);
    window.addEventListener("parentLessonsLanguageChanged", handleDataUpdate);
    window.addEventListener("focus", handleDataUpdate);

    return () => {
      window.removeEventListener("userDataUpdated", handleDataUpdate);
      window.removeEventListener("parentLessonsLanguageChanged", handleDataUpdate);
      window.removeEventListener("focus", handleDataUpdate);
    };
  }, [fetchStats]);

  const ICON_MAP: Record<string, any> = {
    BookOpen, Flame, Lock, GraduationCap, Users, Trophy
  };

  const showDetails = (ach: any) => {
    setActiveAchievement(ach);
  };

  const hideDetails = () => {
    setActiveAchievement(null);
  };

  // Find next closest milestone
  const lockedAchievements = achievements.filter(ach => ach.currentProgress < ach.totalRequired);
  const nextMilestone = lockedAchievements.length > 0
    ? lockedAchievements.reduce((prev, curr) => {
        const prevRatio = prev.currentProgress / prev.totalRequired;
        const currRatio = curr.currentProgress / curr.totalRequired;
        return currRatio > prevRatio ? curr : prev;
      })
    : null;

  const translateAchText = (text: string) => {
    if (!text) return "";
    const trimmed = text.trim();

    // Direct i18n lookup first
    const direct = t(trimmed, "");
    if (direct && direct !== trimmed) return direct;

    // Badge Titles mapping
    if (trimmed === "First Steps") return t("badge_first_steps", "First Steps");
    if (trimmed === "Week On Fire") return t("badge_week_on_fire", "Week On Fire");
    if (trimmed === "Monthly Master") return t("badge_monthly_master", "Monthly Master");
    if (trimmed === "Rising Scholar") return t("badge_rising_scholar", "Rising Scholar");
    if (trimmed === "Challenger") return t("badge_challenger", "Challenger");
    if (trimmed === "Supporter") return t("badge_supporter", "Supporter");
    if (trimmed === "Science Prodigy") return t("badge_science_prodigy", "Science Prodigy");
    if (trimmed === "Math Ace") return t("badge_math_ace", "Math Ace");
    if (trimmed === "Arena Master") return t("badge_arena_master", "Arena Master");
    if (trimmed === "Streak Master") return t("badge_streak_master", "Streak Master");

    // Badge Descriptions mapping
    if (/Successfully completed your/i.test(trimmed)) {
      return t("desc_first_steps", "Successfully completed your first parenting module or test. The journey of a thousand miles begins here!");
    }
    if (/Maintained a (?:consistent learning|7-day learning streak)/i.test(trimmed)) {
      return t("desc_week_on_fire", "Maintained a consistent learning rhythm for 7 consecutive days. You are building amazing habits!");
    }
    if (/Achieve a 30-day learning streak/i.test(trimmed)) {
      return t("desc_monthly_master", "Achieve a 30-day learning streak to unlock this achievement.");
    }
    if (/You have completed 10 lessons or tests/i.test(trimmed)) {
      return t("desc_rising_scholar", "You have completed 10 lessons or tests! Your dedication to growth is making a real difference at home.");
    }
    if (/Complete 5 growth challenges/i.test(trimmed)) {
      return t("desc_challenger", "Complete 5 growth challenges to unlock this badge.");
    }
    if (/Participate in the community forum/i.test(trimmed)) {
      return t("desc_supporter", "Participate in the community forum.");
    }
    if (/Master of Science/i.test(trimmed)) {
      return t("desc_science_prodigy", "Master of Science & Nature");
    }
    if (/Solved over 50 math/i.test(trimmed)) {
      return t("desc_math_ace", "Solved over 50 math challenges");
    }
    if (/Victor of live multiplayer/i.test(trimmed)) {
      return t("desc_arena_master", "Victor of live multiplayer battles");
    }

    return t(trimmed, trimmed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] font-sans relative pb-24 overflow-x-clip">
        {/* Top Header Skeleton */}
        <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-xs flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full animate-skeleton shrink-0"></div>
            <div className="h-6 w-36 rounded-lg animate-skeleton"></div>
          </div>
          <div className="w-9 h-9 rounded-full animate-skeleton"></div>
        </header>

        {/* Bento Grid Skeleton */}
        <main className="w-full max-w-lg mx-auto pt-3 sm:pt-4 pb-4 px-4 sm:px-5 flex flex-col items-center relative gap-3.5">
          <div className="w-full bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border-2 border-white/50 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded-md animate-skeleton"></div>
                <div className="h-3 w-56 rounded-md animate-skeleton"></div>
              </div>
              <div className="w-12 h-12 rounded-2xl animate-skeleton"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 border border-slate-200/60 shadow-xs space-y-3 h-32 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded-md animate-skeleton"></div>
                <div className="w-8 h-8 rounded-xl animate-skeleton"></div>
              </div>
              <div className="h-8 w-12 rounded-lg animate-skeleton"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 border border-slate-200/60 shadow-xs space-y-3 h-32 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded-md animate-skeleton"></div>
                <div className="w-8 h-8 rounded-xl animate-skeleton"></div>
              </div>
              <div className="h-8 w-16 rounded-lg animate-skeleton"></div>
            </div>
          </div>

          <div className="w-full space-y-3 pt-2">
            <div className="h-5 w-48 rounded-md animate-skeleton"></div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60 shadow-xs h-32 flex flex-col items-center justify-between">
                  <div className="w-12 h-12 rounded-full animate-skeleton"></div>
                  <div className="h-3 w-16 rounded-md animate-skeleton"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const filteredAchievements = achievements.filter(ach => {
    const isUnlocked = ach.currentProgress >= ach.totalRequired;
    if (filter === "unlocked") return isUnlocked;
    if (filter === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-clip font-sans">
      <style>{`
        .bento-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.9);
            box-shadow: 0 4px 16px -2px rgba(148, 163, 184, 0.1);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px -4px rgba(20, 23, 121, 0.12);
            border-color: rgba(20, 23, 121, 0.3);
        }
        .bento-card-active {
            border-color: #141779;
            background: #f8fafc;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex items-center justify-between px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/80 overflow-hidden bg-white shrink-0 shadow-2xs">
            <img 
              alt="Parent Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=141779&color=ffffff&bold=true`}
            />
          </div>
          <span className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">{t("achievements", "Achievements")}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button 
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* Main Bento Layout Container */}
      <main className="w-full max-w-lg mx-auto pt-3 sm:pt-4 pb-4 px-4 sm:px-5 flex flex-col items-center no-scrollbar relative gap-3.5">
        
        {/* Bento Grid */}
        <div className="w-full grid grid-cols-2 gap-3 sm:gap-3.5 mt-0.5">
          
          {/* Bento Box 1: Welcome & Profile Info */}
          <div className="col-span-2 bento-card rounded-2xl p-4 sm:p-5 flex items-center justify-between relative overflow-hidden bg-white">
            <div className="flex flex-col gap-0.5 z-10">
              <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">{t("parent_dashboard_upper", "PARENT DASHBOARD")}</span>
              <h2 className="text-lg sm:text-xl font-black text-[#141779] flex items-center gap-1.5">
                {t("hi_user", { name: username, defaultValue: `Hi, ${username}` })} <Sparkles className="text-amber-500 animate-pulse" size={18} />
              </h2>
            </div>
            <div className="flex items-center justify-center bg-indigo-50 border border-indigo-100 w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-[#141779] shadow-2xs shrink-0">
              <Trophy size={22} />
            </div>
          </div>

          {/* Bento Box 2: Total Badges Box */}
          <div className="col-span-1 bento-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-[115px] sm:h-[120px] bg-white border border-teal-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006a62] uppercase tracking-wider">{t("badges", "Badges")}</span>
              <div className="p-1.5 bg-teal-50 rounded-lg text-[#006a62]">
                <GraduationCap size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#141779] tracking-tight">{badgesEarned}</div>
              <span className="text-xs text-slate-600 font-black">{t("unlocked_medals", "Unlocked Medals")}</span>
            </div>
          </div>

          {/* Bento Box 3: Global Rank Box */}
          <div className="col-span-1 bento-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-[115px] sm:h-[120px] bg-white border border-indigo-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#30007f] uppercase tracking-wider">{t("rank", "Rank")}</span>
              <div className="p-1.5 bg-indigo-50 rounded-lg text-[#30007f]">
                <Globe size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#141779] tracking-tight">#{globalRank > 0 ? globalRank : 1}</div>
              <span className="text-xs text-slate-600 font-black">{t("worldwide_position", "Worldwide Position")}</span>
            </div>
          </div>

          {/* Bento Box 4: Next Milestone */}
          {nextMilestone ? (
            <div className="col-span-2 bento-card rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006a62]"></span>
                  </span>
                  <span className="text-xs font-black text-[#141779]">{t("next_milestone_target", "Next Milestone Target")}</span>
                </div>
                <span className="text-xs font-black text-[#006a62] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {Math.round((nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}% {t("complete_caps", "Complete")}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0">
                  {React.createElement(ICON_MAP[nextMilestone.icon] || Lock, { size: 18 })}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-[#141779] truncate">{translateAchText(nextMilestone.title)}</h4>
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1">
                  <span>{t("current_progress_label", "Current Progress")}</span>
                  <span className="font-black text-[#141779]">
                    {nextMilestone.currentProgress} / {nextMilestone.totalRequired} {nextMilestone.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-2 bento-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 bg-gradient-to-r from-teal-50/70 via-white to-indigo-50/70 border border-teal-200">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#006a62] to-[#141779] text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <Trophy size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] block">{t("all_milestones_unlocked", "All Milestones Unlocked")}</span>
                <p className="text-xs sm:text-sm font-black text-[#141779] leading-snug">
                  {t("master_parent_achieved", "Master Parent Status Achieved! Keep leading by example.")}
                </p>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="col-span-2 flex flex-col gap-2.5 mt-2 mb-1 px-0.5">
            {/* Title Row - Guaranteed Single Line */}
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-[#141779] whitespace-nowrap tracking-tight">
                {t("achievement_wall", "Achievement Wall")}
              </h3>
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                {badgesEarned} / {achievements.length} {t("unlocked", "Unlocked")}
              </span>
            </div>

            {/* Filter Tabs Row - Placed Neatly Below */}
            <div className="w-full">
              <div className="grid grid-cols-3 bg-slate-200/80 p-1 rounded-xl border border-slate-300/60 gap-1 w-full">
                <button 
                  type="button"
                  onClick={() => setFilter("all")} 
                  className={`text-xs font-black py-2 px-2.5 sm:px-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    filter === "all" ? "bg-[#141779] text-white shadow-2xs" : "text-slate-700 hover:text-[#141779] hover:bg-white/50"
                  }`}
                >
                  <span>{t("all", "All")}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    filter === "all" ? "bg-white/20 text-white" : "bg-slate-300/80 text-slate-700"
                  }`}>
                    {achievements.length}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFilter("unlocked")} 
                  className={`text-xs font-black py-2 px-2.5 sm:px-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    filter === "unlocked" ? "bg-[#141779] text-white shadow-2xs" : "text-slate-700 hover:text-[#141779] hover:bg-white/50"
                  }`}
                >
                  <span>{t("unlocked", "Unlocked")}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    filter === "unlocked" ? "bg-white/20 text-white" : "bg-teal-100 text-[#006a62]"
                  }`}>
                    {badgesEarned}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFilter("locked")} 
                  className={`text-xs font-black py-2 px-2.5 sm:px-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    filter === "locked" ? "bg-[#141779] text-white shadow-2xs" : "text-slate-700 hover:text-[#141779] hover:bg-white/50"
                  }`}
                >
                  <span>{t("locked", "Locked")}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    filter === "locked" ? "bg-white/20 text-white" : "bg-slate-300/80 text-slate-700"
                  }`}>
                    {Math.max(0, achievements.length - badgesEarned)}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Achievement Grid Cards */}
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.currentProgress >= ach.totalRequired;
            const percent = Math.min(100, Math.round((ach.currentProgress / ach.totalRequired) * 100));
            const IconComponent = ICON_MAP[ach.icon] || Lock;
            const isSelected = activeAchievement?.id === ach.id;
            
            return (
              <div 
                key={ach.id} 
                onClick={() => showDetails(ach)}
                className={`col-span-1 bento-card rounded-2xl p-4 flex flex-col items-center justify-between text-center min-h-[155px] cursor-pointer relative overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected ? "bento-card-active border-[#141779] ring-2 ring-[#141779]/20" : ""
                } ${
                  isUnlocked 
                    ? "bg-gradient-to-b from-white via-white to-teal-50/30 border-teal-200/80 shadow-2xs" 
                    : "bg-white border-slate-200/80"
                }`}
              >
                {/* Visual Badge with Progress Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${
                        isUnlocked 
                          ? "text-[#006a62]" 
                          : percent > 0 
                          ? "text-[#141779]" 
                          : "text-transparent"
                      } transition-all duration-700 ease-out`}
                      strokeDasharray={`${percent}, 100`}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className={`absolute inset-0 m-1.5 rounded-full flex items-center justify-center shadow-2xs ${
                    isUnlocked
                      ? "bg-gradient-to-br from-[#141779] to-[#006a62] text-amber-300"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  {isUnlocked ? (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-slate-900 border-2 border-white flex items-center justify-center shadow-xs">
                      <Star size={9} fill="currentColor" />
                    </span>
                  ) : percent > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 px-1 h-3.5 rounded-full bg-[#141779] text-white border border-white flex items-center justify-center shadow-xs text-[8px] font-black">
                      {percent}%
                    </span>
                  ) : (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-200 text-slate-500 border-2 border-white flex items-center justify-center shadow-xs">
                      <Lock size={8} />
                    </span>
                  )}
                </div>

                {/* Short Badge Title Only */}
                <h5 className={`text-xs sm:text-sm font-black leading-tight w-full truncate mt-2.5 ${
                  isUnlocked ? "text-[#141779]" : "text-slate-700"
                }`}>
                  {translateAchText(ach.title)}
                </h5>

                {/* Simple Numerical Progress Indicator */}
                <div className="mt-2 w-full flex items-center justify-center">
                  {isUnlocked ? (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-[#006a62] shadow-2xs">
                      {ach.totalRequired}/{ach.totalRequired} {t("completed", "Completed")}
                    </span>
                  ) : (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[#141779]">
                      {Math.min(ach.totalRequired, ach.currentProgress)}/{ach.totalRequired}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty State for Filter Tabs */}
          {filteredAchievements.length === 0 && (
            <div className="col-span-2 py-8 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                {filter === "unlocked" ? <Trophy size={24} className="text-slate-400" /> : <Lock size={24} className="text-slate-400" />}
              </div>
              <p className="text-xs font-black text-[#141779]">
                {filter === "unlocked"
                  ? t("no_unlocked_achievements", "No unlocked badges yet. Complete lessons to unlock!")
                  : t("no_locked_achievements", "Great job! All achievements have been unlocked!")}
              </p>
            </div>
          )}

        </div>

        {/* Bento Details Sliding Bottom Drawer */}
        {activeAchievement && (
          <div 
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[99999] flex items-end justify-center p-3 pb-24 sm:p-4 animate-fade-in overscroll-contain select-none" 
            style={{
              zIndex: 99999,
              overscrollBehavior: "contain",
              touchAction: "none",
              paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
            }}
            onClick={hideDetails}
          >
            <div 
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-slide-up overscroll-contain select-text mb-1 sm:mb-0 max-h-[80vh] overflow-y-auto"
              style={{ zIndex: 100000, overscrollBehavior: "contain", touchAction: "pan-y" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Pull Element */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-2"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                    activeAchievement.currentProgress >= activeAchievement.totalRequired
                      ? "bg-gradient-to-br from-[#141779] to-[#30007f]"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {React.createElement(ICON_MAP[activeAchievement.icon] || Lock, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#141779]">{translateAchText(activeAchievement.title)}</h3>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      activeAchievement.currentProgress >= activeAchievement.totalRequired
                        ? "bg-teal-50 text-[#006a62] border border-teal-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {activeAchievement.currentProgress >= activeAchievement.totalRequired ? t("completed_unlocked", "Completed & Unlocked") : t("in_progress", "In Progress")}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={hideDetails}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-[#141779] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">{t("target_requirement", "Target Requirement")}</span>
                <p className="text-xs text-slate-800 font-bold leading-relaxed">{translateAchText(activeAchievement.desc)}</p>
              </div>

              {/* Progress bar inside drawer */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-extrabold text-slate-700">{t("achievement_progress", "Achievement Progress")}</span>
                  <span className="font-black text-[#141779]">
                    {Math.min(activeAchievement.totalRequired, activeAchievement.currentProgress)} / {activeAchievement.totalRequired} {activeAchievement.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (activeAchievement.currentProgress / activeAchievement.totalRequired) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 font-bold text-center mt-1">
                  {activeAchievement.currentProgress >= activeAchievement.totalRequired 
                    ? t("congrats_unlocked", "🎉 Congratulations! You have unlocked this milestone reward.") 
                    : t("keep_going_to_unlock", { count: activeAchievement.totalRequired - activeAchievement.currentProgress, defaultValue: `Keep going! Only ${activeAchievement.totalRequired - activeAchievement.currentProgress} more to unlock.` })}
                </div>
              </div>

              <button 
                onClick={hideDetails}
                className="w-full bg-[#141779] text-white py-3 rounded-full font-black text-sm shadow-md hover:bg-[#1e23a0] active:scale-95 transition-all mt-2"
              >
                {t("awesome", "Awesome")}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

