import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  VolumeX,
  Heart,
  Star,
  ShieldCheck,
  Gift,
  Ear,
  Sparkles,
  BookOpen,
  Lock,
  TrendingUp,
  Settings,
  ArrowLeft,
  Flame,
  Bell,
  ChevronDown,
  ChevronUp,
  Eye,
  Award,
  PhoneOff,
  CheckCircle,
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import StreakModal from "../../../components/StreakModal";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { showNotificationToast } from "../../../components/GlobalNotificationBanner";
import { COMMUNICATION_CHALLENGES, GrowthChallengeItem } from "../data/growthChallengesData";

export default function ParentChallengesScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [claimState, setClaimState] = useState<Record<string, "idle" | "processing" | "claimed">>({});
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("Parent");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [totalActive, setTotalActive] = useState(5);
  const [unlockedLessonCount, setUnlockedLessonCount] = useState(1);
  const [showAllActive, setShowAllActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const translateChalTitle = (title: string) => {
    if (!title) return "";
    if (title.includes("Positive Swap")) return t("chal_title_positive_swap", "Positive Swap");
    if (title.includes("Eye-to-Eye Connection") || title.includes("Eye Connection")) return t("chal_title_eye_connection", "Eye-to-Eye Connection");
    if (title.includes("Pause") || title.includes("5s")) return t("chal_title_pause_5s", "5-Second Pause");
    if (title.includes("Active Listener") || title.includes("Listening")) return t("chal_title_active_listener", "Active Listener");
    if (title.includes("No-Interruption") || title.includes("Interruption")) return t("chal_title_no_interruption", "No-Interruption Time");
    return t(title, title);
  };

  const translateChalDesc = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("Replace one command") || desc.includes("positive communication swap")) {
      return t("chal_desc_positive_swap", "Replace one command with one positive communication swap today (e.g., 'What is the first thing you need to finish?' instead of 'Do your homework').");
    }
    if (desc.includes("Get down to eye level") || desc.includes("eye contact")) {
      return t("chal_desc_eye_connection", "Get down to eye level and make eye contact with your child before giving any instruction today.");
    }
    if (desc.includes("Pause for 5 seconds") || desc.includes("5 seconds")) {
      return t("chal_desc_pause_5s", "Pause for 5 seconds before responding when your child says something difficult.");
    }
    if (desc.includes("Reflect on what your child says") || desc.includes("Active Listener")) {
      return t("chal_desc_active_listener", "Reflect on what your child says before giving your opinion.");
    }
    if (desc.includes("Let your child speak completely") || desc.includes("without interrupting")) {
      return t("chal_desc_no_interruption", "Let your child speak completely during dinner without interrupting them.");
    }
    return t(desc, desc);
  };

  const translateChalBadge = (badge: string) => {
    if (!badge) return "";
    if (badge.includes("Communication")) return t("badge_communication", "Communication Badge");
    if (badge.includes("Connection")) return t("badge_connection", "Connection Badge");
    if (badge.includes("Patience")) return t("badge_patience", "Patience Badge");
    if (badge.includes("Listening")) return t("badge_listening", "Listening Star");
    if (badge.includes("Respect")) return t("badge_respect", "Respect Badge");
    if (badge.includes("Curiosity")) return t("badge_curiosity", "Curiosity Badge");
    if (badge.includes("Ritual")) return t("badge_ritual", "Ritual Badge");
    if (badge.includes("Gratitude")) return t("badge_gratitude", "Gratitude Star");
    if (badge.includes("Calm")) return t("badge_calm_voice", "Calm Voice Badge");
    if (badge.includes("Love Note") || badge.includes("Note")) return t("badge_love_note", "Love Note Badge");
    return t(badge, badge);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const lang = i18n.language || "en";
      const [resUser, resChal, resLib] = await Promise.all([
        apiFetch("/api/users/me").catch(() => null),
        apiFetch("/api/parent/challenges", { headers: { "Accept-Language": lang } }).catch(() => null),
        apiFetch("/api/parent/learning-library", { headers: { "Accept-Language": lang } }).catch(() => null),
      ]);

      if (resUser) {
        const jsonUser = await resUser.json();
        if (jsonUser.success && jsonUser.data?.user) {
          setLevel(jsonUser.data.user.parentLevel || 1);
          setStreak(jsonUser.data.user.parentStreak ?? 0);
          setTotalXP(jsonUser.data.user.parentXp || 0);
          setUsername(jsonUser.data.user.parentName || jsonUser.data.user.username || "Parent");
          setProfilePic(jsonUser.data.user.parentPhoto || "");
        }
      }

      // 1. Determine unlocked lessons from Learning Library progression
      let currentUnlockedLesson = 1; // By default Lesson 1 is unlocked
      if (resLib) {
        try {
          const jsonLib = await resLib.json();
          if (jsonLib.success && jsonLib.data?.topics) {
            const topics: any[] = jsonLib.data.topics;
            const completedTopics = topics.filter((t: any) => t.status === "completed");
            const activeTopics = topics.filter((t: any) => t.status === "active");
            const maxActiveOrCompleted = Math.max(
              1,
              ...topics
                .filter((t: any) => t.status === "completed" || t.status === "active")
                .map((t: any) => parseInt(t.topicId) || 1)
            );
            currentUnlockedLesson = Math.min(10, Math.max(1, maxActiveOrCompleted, completedTopics.length + 1));
          }
        } catch (e) {
          console.error("Error reading lesson progression:", e);
        }
      }
      setUnlockedLessonCount(currentUnlockedLesson);

      // 2. Map unlocked lessons to challenges (5 challenges per lesson)
      const unlockedMissionCount = Math.min(50, currentUnlockedLesson * 5);
      const unlockedMissions = COMMUNICATION_CHALLENGES.slice(0, unlockedMissionCount);
      const lockedUpcoming = COMMUNICATION_CHALLENGES.slice(
        unlockedMissionCount,
        Math.min(50, unlockedMissionCount + 5)
      );

      // 3. Extract backend saved progress and claim states
      const backendProgressMap = new Map<string, any>();
      if (resChal) {
        try {
          const jsonChal = await resChal.json();
          if (jsonChal.success && jsonChal.data) {
            const listRaw = jsonChal.data.challenges || [];
            listRaw.forEach((c: any) => {
              if (c && c.id != null) backendProgressMap.set(String(c.id), c);
              if (c && c.challengeId != null) backendProgressMap.set(String(c.challengeId), c);
            });
          }
        } catch (e) {
          console.error("Error reading challenge states:", e);
        }
      }

      // Merge backend progress into the unlocked missions
      const mergedUnlocked = unlockedMissions.map((item) => {
        const be = backendProgressMap.get(String(item.id)) || backendProgressMap.get(String(item.challengeId));
        const completedDays = be?.completedDays ?? 0;
        const isCompleted = be?.isCompleted ?? completedDays >= item.totalDays;
        const claimed = be?.claimed ?? false;
        const incrementedToday = be?.incrementedToday ?? false;
        return {
          ...item,
          completedDays,
          isCompleted,
          claimed,
          incrementedToday,
          lastIncrementDate: be?.lastIncrementDate,
        };
      });

      // Also merge any other completed challenges from backend (if any)
      backendProgressMap.forEach((beChal) => {
        if (beChal.isCompleted && !mergedUnlocked.some((c) => String(c.id) === String(beChal.id))) {
          mergedUnlocked.push(beChal);
        }
      });

      setChallenges(mergedUnlocked);
      setUpcoming(lockedUpcoming);
      setTotalActive(unlockedMissionCount);

      const newClaimState: Record<string, "idle" | "processing" | "claimed"> = {};
      mergedUnlocked.forEach((c: any) => {
        if (c.claimed) newClaimState[c.id] = "claimed";
        else newClaimState[c.id] = "idle";
      });
      setClaimState(newClaimState);
    } catch (e) {
      console.error("Error fetching parent challenges:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  const handleClaim = async (id: string, xp: number) => {
    setClaimState((prev) => ({ ...prev, [id]: "processing" }));
    try {
      const res = await apiFetch(`/api/parent/challenges/${id}/claim`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setClaimState((prev) => ({ ...prev, [id]: "claimed" }));
        setTotalXP((prev) => prev + xp);

        const msg = t("xp_increased_count", { count: xp, defaultValue: `${xp} XP increased!` });
        setToastMessage(msg);
        showNotificationToast({
          title: "Challenge Reward",
          message: msg,
          type: "gamification",
        });
      } else {
        setClaimState((prev) => ({ ...prev, [id]: "idle" }));
      }
    } catch (e) {
      setClaimState((prev) => ({ ...prev, [id]: "idle" }));
    }
  };

  const handleIncrement = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const targetChallenge = challenges.find((c) => String(c.id) === String(id));
    if (!targetChallenge) return;

    const willBeCompleted = (targetChallenge.completedDays || 0) + 1 >= (targetChallenge.totalDays || 1);

    // Optimistic UI update
    setChallenges((prev) =>
      prev.map((c) => {
        if (String(c.id) === String(id)) {
          return {
            ...c,
            completedDays: (c.completedDays || 0) + 1,
            isCompleted: willBeCompleted,
            incrementedToday: true,
          };
        }
        return c;
      })
    );

    if (willBeCompleted) {
      setClaimState((prev) => ({ ...prev, [id]: "idle" }));
    }

    try {
      await apiFetch(`/api/parent/challenges/${id}/increment`, { method: "POST" });
    } catch (e) {}
  };

  const getXpForLevel = (lvl: number) => {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  };
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const levelProgressPercent = Math.max(
    0,
    Math.min(100, Math.round(((totalXP - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100))
  );

  const IconMap: Record<string, any> = {
    Heart,
    Eye,
    Award,
    PhoneOff,
    SmartphoneOff: PhoneOff,
    Star,
    ShieldCheck,
    Flame,
    BookOpen,
    Sparkles,
    Ear,
    VolumeX,
    CheckCircle,
  };

  // Active challenges list in progression order
  const activeChallenges = (() => {
    const map = new Map();
    challenges.filter((c) => !c.isCompleted).forEach((c) => map.set(String(c.id), c));
    return Array.from(map.values());
  })();

  // Completed challenges list
  const completedChallenges = (() => {
    const map = new Map();
    challenges.filter((c) => c.isCompleted).forEach((c) => map.set(String(c.id), c));
    return Array.from(map.values());
  })();

  // Concise preview: default 3 active challenges or full list on View All
  const displayedActiveChallenges = showAllActive ? activeChallenges : activeChallenges.slice(0, 3);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center font-sans relative">
      <style>{`
        .glass-card {
            background: #ffffff;
            border: 1px solid rgba(20, 23, 121, 0.12);
            box-shadow: 0 2px 12px rgba(20, 23, 121, 0.03);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .progress-bar-glow {
            box-shadow: 0 0 12px rgba(20, 23, 121, 0.3);
        }
        .cosmic-gradient {
            background: linear-gradient(135deg, #141779 0%, #30007f 100%);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Unified Reward Pop-up Modal */}
      <UnifiedConfirmModal
        isOpen={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        onConfirm={() => setToastMessage(null)}
        title={t("xp_increased_title", "XP Increased!")}
        message={toastMessage || ""}
        confirmText={t("awesome", "Awesome!")}
        showCancel={false}
        variant="success"
        icon={<Sparkles size={30} className="text-[#141779] animate-pulse" />}
      />

      {/* Top App Bar */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex justify-between items-center px-4 sm:px-6 h-16 w-full">
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
              className="w-full h-full object-cover"
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
            />
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">
            {t("growth_challenges", "Growth Challenges")}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => navigate("/parent/settings")}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg mx-auto flex-1 flex flex-col pt-3 sm:pt-4 pb-4 px-4 sm:px-5">
        {/* Growth Status Header */}
        <section className="cosmic-gradient rounded-2xl p-4 sm:p-5 text-white mb-3.5 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-3.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#e0e0ff] text-xs font-bold tracking-widest uppercase">
                  {t("level_explorer_upper", { level, defaultValue: `LEVEL ${level} EXPLORER` })}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold">{totalXP} XP</h2>
              </div>
              <button
                onClick={() => setShowStreakModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/30 cursor-pointer active:scale-95 transition-all"
              >
                <span className="text-orange-400">🔥</span>
                <span className="font-bold text-xs sm:text-sm">
                  {t("day_streak", { days: streak, streak, count: streak, defaultValue: `${streak} Day Streak` })}
                </span>
              </button>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>{t("progress_to_level", { level: level + 1, defaultValue: `Progress to Level ${level + 1}` })}</span>
                <span>{levelProgressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#57fae9] rounded-full" style={{ width: `${levelProgressPercent}%` }}></div>
              </div>
            </div>
          </div>
          {/* Decorative Orbit */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-white/5 rounded-full"></div>
        </section>

        {/* Active Challenges Header */}
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base sm:text-lg font-bold text-[#141779]">
            {t("active_challenges", "Active Challenges")}
          </h3>
          <span className="text-[#141779] font-extrabold text-xs sm:text-sm">
            {t("active_count_of", {
              activeCount: activeChallenges.length,
              totalActive: unlockedLessonCount * 5,
              defaultValue: `${activeChallenges.length} of ${unlockedLessonCount * 5} Active`,
            })}
          </span>
        </div>

        {/* Skeleton Loading State */}
        {loading && (
          <div className="space-y-3 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4 sm:p-5 border border-white/40 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl animate-skeleton shrink-0"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-36 rounded-md animate-skeleton"></div>
                      <div className="h-3 w-24 rounded-md animate-skeleton"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full animate-skeleton"></div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 rounded-full animate-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Fallback */}
        {!loading && challenges.length === 0 && (
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2.5 my-3">
            <Sparkles className="w-10 h-10 text-[#141779]/40" />
            <h4 className="text-base font-bold text-[#141779]">
              {t("no_challenges_found", "No challenges available right now")}
            </h4>
            <p className="text-slate-600 text-xs font-semibold">
              {t("no_challenges_desc", "Tap below to reload parent growth challenges.")}
            </p>
            <button
              onClick={fetchData}
              className="mt-1 px-4 py-2 bg-[#141779] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {t("reload", "Reload Challenges")}
            </button>
          </div>
        )}

        {/* Challenges Grid/List */}
        {!loading && challenges.length > 0 && (
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {/* Active / Unlocked Challenges Preview */}
            {displayedActiveChallenges.map((chal, idx) => {
              const Icon = IconMap[chal.icon] || Star;
              const progressPercent = Math.min(100, Math.round(((chal.completedDays || 0) / (chal.totalDays || 1)) * 100));

              return (
                <div
                  key={`active_${chal.id}_${idx}`}
                  className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-3.5 shadow-xs border border-slate-200/80 hover:border-[#141779]/40 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${chal.color || "#141779"}18`,
                        color: chal.color || "#141779",
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-[#141779] leading-snug">
                        {translateChalTitle(chal.title)}
                      </h4>
                      <p className="text-slate-800 text-xs sm:text-[13px] font-semibold leading-relaxed mt-0.5">
                        {translateChalDesc(chal.desc)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>
                        {t("day_completed_progress", {
                          completed: chal.completedDays || 0,
                          total: chal.totalDays || 1,
                          defaultValue: `Day ${chal.completedDays || 0} / ${chal.totalDays || 1} Complete`,
                        })}
                      </span>
                      <span className="text-[#141779] font-black">{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div
                        className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] progress-bar-glow rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 sm:p-2.5 rounded-xl px-3 sm:px-4 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Star className="text-[#141779]" size={16} fill="currentColor" />
                      <span className="text-xs font-black text-[#141779]">+{chal.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <ShieldCheck className="text-[#141779]" size={16} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-800">{translateChalBadge(chal.badge)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleIncrement(chal.id, e)}
                    disabled={chal.incrementedToday}
                    className={`w-full font-black tracking-wide py-2.5 mt-0.5 rounded-xl border-2 active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      chal.incrementedToday
                        ? "border-slate-200 text-slate-400 bg-slate-100 font-bold"
                        : "border-[#141779] text-[#141779] bg-[#141779]/5 hover:bg-[#141779]/10"
                    }`}
                  >
                    <Star size={15} />
                    {chal.incrementedToday
                      ? t("completed_for_today", "COMPLETED FOR TODAY")
                      : t("mark_today_complete", "MARK TODAY COMPLETE")}
                  </button>
                </div>
              );
            })}

            {/* Prominent View All / Show Less Toggle Button */}
            {activeChallenges.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllActive(!showAllActive)}
                className="w-full py-3 px-4 rounded-2xl bg-white border-2 border-[#141779]/20 hover:border-[#141779] text-[#141779] font-black text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                {showAllActive ? (
                  <>
                    <span>{t("show_less", "Show Less")}</span>
                    <ChevronUp size={17} />
                  </>
                ) : (
                  <>
                    <span>
                      {t("view_all_unlocked", "View All ({{count}})", { count: activeChallenges.length })}
                    </span>
                    <ChevronDown size={17} />
                  </>
                )}
              </button>
            )}

            {/* Upcoming / Locked Challenges Section */}
            {upcoming.length > 0 && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-[#141779] mt-3">
                  {t("upcoming_challenges", "Upcoming Challenges")}
                </h3>

                {upcoming.map((uc, idx) => {
                  const Icon = IconMap[uc.icon] || BookOpen;
                  return (
                    <div
                      key={`upcoming_${uc.id}_${idx}`}
                      className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 flex items-center gap-3.5 shadow-2xs"
                    >
                      <div className="w-10 h-10 bg-indigo-50/70 rounded-full flex items-center justify-center text-[#141779]/60 shrink-0">
                        <Icon size={19} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#141779] text-sm sm:text-base">
                            {translateChalTitle(uc.title)}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Lesson {uc.lessonId}
                          </span>
                        </div>
                        <p className="text-slate-800 text-xs sm:text-[13px] font-semibold mt-0.5">
                          {translateChalDesc(uc.desc)}
                        </p>
                      </div>
                      <Lock className="text-slate-400 shrink-0" size={18} />
                    </div>
                  );
                })}
              </>
            )}

            {/* Completed Challenges Section */}
            {completedChallenges.length > 0 && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-[#141779] mt-3">
                  {t("completed_challenges", "Completed Challenges")}
                </h3>

                {completedChallenges.map((chal, idx) => {
                  const Icon = IconMap[chal.icon] || Star;
                  const cState = claimState[chal.id] || "idle";

                  return (
                    <div
                      key={`completed_${chal.id}_${idx}`}
                      className="border-2 border-dashed border-[#141779]/30 hover:border-[#141779]/50 bg-white/95 rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3 shadow-2xs transition-all"
                    >
                      <div className="flex items-start gap-3 sm:gap-3.5">
                        <div className="w-10 h-10 bg-[#141779]/10 rounded-full flex items-center justify-center text-[#141779] shrink-0 ring-2 ring-[#141779]/10 mt-0.5">
                          <Icon size={20} fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-[#141779] text-sm sm:text-base leading-snug">
                              {translateChalTitle(chal.title)}
                            </h4>
                            <span className="bg-gradient-to-r from-[#141779] to-[#25218c] text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-black shrink-0 shadow-xs tracking-wider">
                              {t("completed_caps", "COMPLETED")}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs sm:text-[13px] font-semibold leading-relaxed mt-1">
                            {translateChalDesc(chal.desc)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl px-4 border border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <Star className="text-[#141779]" size={18} fill="currentColor" />
                          <span className="text-xs font-black text-[#141779]">+{chal.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="text-[#141779]" size={18} fill="currentColor" />
                          <span className="text-xs font-bold text-slate-800">{translateChalBadge(chal.badge)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClaim(chal.id, chal.xp || 200)}
                        disabled={cState !== "idle"}
                        className={`w-full font-black py-3 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          cState === "claimed"
                            ? "bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-[#57fae9] border border-indigo-200/40 shadow-[0_4px_16px_rgba(20,23,121,0.2)] cursor-default tracking-wide"
                            : cState === "processing"
                            ? "bg-[#141779]/80 text-[#57fae9] cursor-wait"
                            : "bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-[#57fae9] shadow-[0_4px_16px_rgba(20,23,121,0.25)] hover:shadow-[0_6px_20px_rgba(20,23,121,0.35)]"
                        }`}
                      >
                        {cState === "idle" && (
                          <>
                            <Sparkles size={20} fill="currentColor" />
                            {t("claim_rewards", "CLAIM REWARDS")}
                          </>
                        )}
                        {cState === "processing" && (
                          <>
                            <Sparkles className="animate-spin" size={20} />
                            {t("processing_caps", "PROCESSING...")}
                          </>
                        )}
                        {cState === "claimed" && (
                          <>
                            <ShieldCheck size={20} />
                            {t("rewards_claimed", "REWARDS CLAIMED!")}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </main>

      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streakDays={streak}
      />
    </div>
  );
}
