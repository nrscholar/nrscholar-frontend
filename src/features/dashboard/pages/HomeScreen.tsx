import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, Brain, CheckCircle, ChevronRight, Clock, Gift, Map, Shield, Star, Bell, Crown, Gem, Swords, Trophy, Users, ChevronDown, X } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../../api";
import AdventureHero from "../../../components/AdventureHero";
import LevelUpModal from "../../../components/LevelUpModal";
import { showInteractiveNotification, triggerDevicePushNotification } from "../../../services/pushNotificationService";
import { startNavigationProgress } from "../../../components/NavigationProgressBar";
import { getScopedItem, setScopedItem, getActiveUserContext, normalizeClassLevel } from "../../../utils/sessionCache";
import { loadClassSkills } from "../../../data/neuroplay/skillsLoader";
import { useLockBodyScroll } from "../../../utils/useLockBodyScroll";
import { useUserStatsStore } from "../../../services/userStatsStore";
import { progressFillStyle } from "../../../utils/progressBar";

const ChildSwitcherModal = lazy(() => import("../../../components/ChildSwitcherModal"));

export default function HomeScreen() {
  const rawNavigate = useNavigate();
  const navigate = useCallback((to: any, options?: any) => {
    startNavigationProgress();
    rawNavigate(to, options);
  }, [rawNavigate]);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [userData, setUserData] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [xp, setXp] = useState<number>(() => userData?.xp || 0);
  const [coins, setCoins] = useState<number>(() => userData?.coins || 0);
  const [childName, setChildName] = useState<string>(() => userData?.childName || "Explorer");
  const [childPhoto, setChildPhoto] = useState<string>(() => userData?.childPhoto || "");
  const [userLevel, setUserLevel] = useState<number>(() => userData?.level || 1);
  const { 
    level: storeLevel, 
    xp: storeXp, 
    coins: storeCoins, 
    streakDays: storeStreak, 
    childName: storeChildName, 
    childPhoto: storeChildPhoto,
    syncFromUserData
  } = useUserStatsStore();
  const effectiveLevel = storeLevel || userLevel || 1;
  const [streakDays, setStreakDays] = useState<number>(() => userData?.streakDays || 0);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showDailyMissionModal, setShowDailyMissionModal] = useState(false);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const [questTab, setQuestTab] = useState<'all' | 'active' | 'completed'>('all');

  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);

  const [missions, setMissions] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem("daily_missions_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });
  const [isMissionsLoading, setIsMissionsLoading] = useState(() => {
    try {
      const cached = localStorage.getItem("daily_missions_cache");
      return !cached || cached === "[]";
    } catch {
      return true;
    }
  });
  const [retentionStreak, setRetentionStreak] = useState<any>(null);
  const [retentionTrigger] = useState(0);

  const fetchMissions = async () => {
    try {
      const msRes = await apiFetch("/api/retention/missions/today");
      if (msRes.ok) {
        const msData = await msRes.json();
        if (msData && Array.isArray(msData)) {
          setMissions(msData);
          try { localStorage.setItem("daily_missions_cache", JSON.stringify(msData)); } catch { /* Ignore */ }
        } else if (msData && Array.isArray(msData.missions)) {
          setMissions(msData.missions);
          setDailyLimitReached(msData.daily_limit_reached || false);
          setTodayCompletedCount(msData.today_completed_count || 0);
          try { localStorage.setItem("daily_missions_cache", JSON.stringify(msData.missions)); } catch { /* Ignore */ }
        }
      }
    } catch (e) {
      console.error("Failed to fetch missions", e);
    } finally {
      setIsMissionsLoading(false);
    }
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

  useLockBodyScroll(
    Boolean(
      showDailyMissionModal ||
      showSpinPopup ||
      showStreakModal ||
      showRevivalModal ||
      showRevivalConfirmModal
    )
  );

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
    } catch (e) { }

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
  const [journeyData, setJourneyData] = useState<any>(() => {
    try {
      const raw = getScopedItem("cachedJourneyData");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [isJourneyLoading, setIsJourneyLoading] = useState<boolean>(() => {
    try {
      return !getScopedItem("cachedJourneyData");
    } catch { return true; }
  });
  const [continueLearningProgress, setContinueLearningProgress] = useState<{ completed: number; total: number; percent: number }>(() => {
    try {
      const raw = getScopedItem("cached_continue_learning_progress");
      return raw ? JSON.parse(raw) : { completed: 0, total: 0, percent: 0 };
    } catch { return { completed: 0, total: 0, percent: 0 }; }
  });
  const [isContinueLearningLoading, setIsContinueLearningLoading] = useState<boolean>(() => {
    try {
      return !getScopedItem("cached_continue_learning_progress");
    } catch { return true; }
  });
  const [neuroPlayProgress, setNeuroPlayProgress] = useState<{ completed: number; total: number; percent: number }>(() => {
    try {
      const raw = getScopedItem("cached_neuroplay_progress");
      return raw ? JSON.parse(raw) : { completed: 0, total: 0, percent: 0 };
    } catch { return { completed: 0, total: 0, percent: 0 }; }
  });
  const [isNeuroPlayLoading, setIsNeuroPlayLoading] = useState<boolean>(() => {
    try {
      return !getScopedItem("cached_neuroplay_progress");
    } catch { return true; }
  });
  const [dailyHabitData, setDailyHabitData] = useState<any>(() => {
    try {
      const ctx = getActiveUserContext();
      const raw = sessionStorage.getItem(`nrs_global_habit_${ctx.childId}`) || getScopedItem("cached_daily_habit_data");
      if (raw) return JSON.parse(raw);
    } catch (e) { }
    return null;
  });
  const [isHabitLoading, setIsHabitLoading] = useState<boolean>(() => {
    try {
      const ctx = getActiveUserContext();
      return !(sessionStorage.getItem(`nrs_global_habit_${ctx.childId}`) || getScopedItem("cached_daily_habit_data"));
    } catch { return true; }
  });
  const [shadowArenaProgress, setShadowArenaProgress] = useState<{ completed: number; total: number; percent: number }>(() => {
    try {
      const cached = getScopedItem("cached_shadow_arena_progress");
      if (cached) {
        const parsed = JSON.parse(cached);
        const completed = Number(parsed.completed ?? 0);
        const total = 100;
        const percent = Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
        return { completed, total, percent };
      }
    } catch (e) { }
    return { completed: 0, total: 100, percent: 0 };
  });
  const [isShadowArenaLoading, setIsShadowArenaLoading] = useState<boolean>(() => {
    try {
      return !getScopedItem("cached_shadow_arena_progress");
    } catch { return true; }
  });

  useEffect(() => {
    if (pendingSpinPopup) {
      setShowSpinPopup(true);
      sessionStorage.setItem("dailySpinPopupShown", "true");
      setPendingSpinPopup(false);
    }
  }, [pendingSpinPopup]);

  const fetchNotifications = async (userDoc?: any) => {
    try {
      const u = userDoc || userData || (() => {
        try {
          const stored = localStorage.getItem("userData");
          return stored ? JSON.parse(stored) : null;
        } catch (e) { return null; }
      })();
      const activeChildId = u?.activeChildId || u?.children?.[0]?.childId || u?.childId || "";
      const notifUrl = `/api/notifications?role=child${activeChildId ? `&childId=${encodeURIComponent(activeChildId)}` : ""}`;
      const res = await apiFetch(notifUrl);
      const json = await res.json();
      if (json.success && json.data) {
        const unread = json.data.filter((n: any) => !n.isRead);
        setUnreadCount(unread.length);

        // Dispatch in-app alert for newly received unread notifications without missing them
        if (unread.length > 0) {
          const latestUnread = unread[0];
          const notifId = latestUnread._id;
          const lastAlerted = sessionStorage.getItem("last_alerted_notif_id");
          if (notifId && lastAlerted !== notifId) {
            const notifTime = latestUnread.createdAt ? new Date(latestUnread.createdAt).getTime() : 0;
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            if (notifTime > fiveMinutesAgo) {
              sessionStorage.setItem("last_alerted_notif_id", notifId);
              const isMissionComplete = (latestUnread.title || "").toUpperCase().includes("MISSION COMPLETED") ||
                (latestUnread.title || "").toUpperCase().includes("MYSTERY SOLVED") ||
                (latestUnread.title || "").toUpperCase().includes("LESSON COMPLETE");
              showInteractiveNotification(
                latestUnread.title,
                latestUnread.message,
                latestUnread.screen || "/notifications",
                latestUnread.type || "general",
                !isMissionComplete
              );
            }
          }
        }
      }
    } catch (e) { }
  };

  const fetchJourneyData = async (userDoc?: any) => {
    try {
      const u = userDoc || userData;
      const ctx = getActiveUserContext();
      let url = "/api/journey/progress";
      const params = new URLSearchParams();
      if (ctx.classLevel) params.append("classLevel", ctx.classLevel);
      if (u?.childBoard) params.append("board", u.childBoard);
      if (ctx.childId) params.append("child_id", ctx.childId);

      const q = params.toString();
      if (q) {
        url += `?${q}`;
      }
      const res = await apiFetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setJourneyData(json.data);
          try {
            setScopedItem("cachedJourneyData", JSON.stringify(json.data));
          } catch (e) { }
        }
      }
    } catch (e) {
      console.error("Failed to fetch journey progress", e);
    } finally {
      setIsJourneyLoading(false);
    }
  };

  const fetchContinueLearningProgress = useCallback(async (userDoc?: any) => {
    try {
      const u = userDoc || userData;
      const ctx = getActiveUserContext();
      const classLevel = ctx.classLevel || u?.childClass || "Class 1";
      const [subRes, progRes, journeyRes] = await Promise.all([
        apiFetch(`/api/practice/subjects?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null),
        apiFetch(`/api/practice/chapter-progress?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null),
        apiFetch(`/api/journey/progress?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null)
      ]);

      let totalChapters = 0;
      if (journeyRes?.ok) {
        const jData = await journeyRes.json().catch(() => null);
        if (jData?.success && jData?.data) {
          totalChapters = jData.data.totalCurrentClassChapters || jData.data.totalTierChapters || 0;
        }
      }
      if (subRes?.ok) {
        const subData = await subRes.json().catch(() => null);
        if (subData?.success && Array.isArray(subData.data)) {
          setScopedItem("cached_practice_subjects", JSON.stringify(subData.data));
          if (!totalChapters) {
            totalChapters = subData.data.reduce((sum: number, s: any) => sum + (Number(s.totalChapters) || 0), 0);
          }
        }
      }

      let completedChapters = 0;
      let partialProgress = 0;
      if (progRes?.ok) {
        const progData = await progRes.json().catch(() => null);
        if (progData?.success && Array.isArray(progData.data)) {
          progData.data.forEach((p: any) => {
            const isDone = Boolean(p.completed || p.chapterCompleted);
            if (isDone) {
              completedChapters += 1;
            } else {
              if (Array.isArray(p.completedMissions) && p.completedMissions.length > 0) {
                partialProgress += Math.min(0.9, p.completedMissions.length / 5);
              } else if (p.readingCompleted || p.questionsCompleted) {
                partialProgress += 0.2;
              }
            }
          });
        }
      }

      const effectiveCompleted = completedChapters + partialProgress;
      const percent = totalChapters > 0 ? Math.min(100, Math.round((effectiveCompleted / totalChapters) * 100)) : 0;
      const progressObj = { completed: completedChapters, total: totalChapters, percent };
      setContinueLearningProgress(progressObj);
      try {
        setScopedItem("cached_continue_learning_progress", JSON.stringify(progressObj));
      } catch (e) { }
    } catch (e) {
      console.error("Failed to fetch continue learning progress", e);
    } finally {
      setIsContinueLearningLoading(false);
    }
  }, [userData]);

  const fetchNeuroPlayProgress = useCallback(async (userDoc?: any) => {
    try {
      const u = userDoc || userData;
      const ctx = getActiveUserContext();
      const rawClass = ctx.classLevel || u?.childClass || u?.studentClass || u?.grade || "Class 1";
      const match = String(rawClass).match(/\d+/);
      const classNum = match ? parseInt(match[0], 10) : 1;

      const skills = await loadClassSkills(classNum);
      const activeChild = Array.isArray(u?.children) ? u.children.find((c: any) => c.childId === ctx.childId) : null;
      const apiSkills: string[] = Array.isArray(activeChild?.neuroplayCompletedSkills)
        ? activeChild.neuroplayCompletedSkills
        : (Array.isArray(u?.neuroplayCompletedSkills) ? u.neuroplayCompletedSkills : []);

      const uid = String(u?._id || u?.id || "");
      const childKey = ctx.childId ? `neuroplay_completed_skills_${ctx.childId}` : (uid ? `neuroplay_completed_skills_${uid}` : null);
      let localSkills: string[] = [];
      if (childKey) {
        try {
          const str = localStorage.getItem(childKey);
          if (str) localSkills = JSON.parse(str);
        } catch { }
      }

      const allCompleted = new Set([...apiSkills, ...localSkills]);
      const totalSkills = Array.isArray(skills) ? skills.length : 0;
      const completedSkills = Array.isArray(skills) ? skills.filter((s: any) => allCompleted.has(s.id)).length : 0;
      const percent = totalSkills > 0 ? Math.min(100, Math.round((completedSkills / totalSkills) * 100)) : 0;

      const progressObj = { completed: completedSkills, total: totalSkills, percent };
      setNeuroPlayProgress(progressObj);
      try {
        setScopedItem("cached_neuroplay_progress", JSON.stringify(progressObj));
      } catch (e) { }
    } catch (e) {
      console.error("Failed to fetch neuroplay progress", e);
    } finally {
      setIsNeuroPlayLoading(false);
    }
  }, [userData]);

  const fetchShadowArenaProgress = useCallback(async (userDoc?: any) => {
    try {
      const u = userDoc || userData;
      const ctx = getActiveUserContext();
      const normClass = normalizeClassLevel(ctx.classLevel || u?.childClass || u?.studentClass || u?.grade || "Class 1");
      const childId = ctx.childId || u?.activeChildId || "child_1";

      const res = await apiFetch(`/api/multiplayer/progress?classLevel=${encodeURIComponent(normClass)}&childId=${encodeURIComponent(childId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const completed = Number(json.data.completedFights ?? 0);
          const total = 100;
          const percent = Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
          const progressObj = { completed, total, percent };
          setShadowArenaProgress(progressObj);
          try {
            setScopedItem("cached_shadow_arena_progress", JSON.stringify(progressObj));
          } catch (e) { }
          return;
        }
      }

      const activeChild = Array.isArray(u?.children) ? u.children.find((c: any) => c.childId === childId) : null;
      const fbc = activeChild?.multiplayerFightsByClass || u?.multiplayerFightsByClass || {};
      const completed = Number(fbc[normClass] ?? fbc[ctx.classLevel] ?? 0);
      const total = 100;
      const percent = Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
      const progressObj = { completed, total, percent };
      setShadowArenaProgress(progressObj);
      try {
        setScopedItem("cached_shadow_arena_progress", JSON.stringify(progressObj));
      } catch (e) { }
    } catch (e) {
      console.error("Failed to fetch shadow arena progress", e);
    } finally {
      setIsShadowArenaLoading(false);
    }
  }, [userData]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      const response = await apiFetch("/api/users/me");
      const data = await response.json();
      if (data.success) {
        const u = data.data.user;
        syncFromUserData(u);
        setUserData(u);
        setXp(u.xp || 0);
        setCoins(u.coins || 0);
        setChildName(u.childName || "Explorer");
        setChildPhoto(u.childPhoto || "");
        setUserLevel(u.level || 1);
        setStreakDays(u.streakDays || 0);
        localStorage.setItem("userData", JSON.stringify(u));
        fetchJourneyData(u);
        fetchContinueLearningProgress(u);
        fetchNeuroPlayProgress(u);
        fetchShadowArenaProgress(u);
      }
    } catch (e) {
      console.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    let deferTimer: any = null;

    const loadAllDashboardData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      // Stage 1 (Critical Above-The-Fold): Fetch profile, missions, journey, continue learning, and neuroplay immediately
      const profilePromise = fetchProfile();
      const missionsPromise = fetchMissions();
      const journeyPromise = fetchJourneyData();
      const continueLearningPromise = fetchContinueLearningProgress();
      const neuroPlayPromise = fetchNeuroPlayProgress();
      const shadowArenaPromise = fetchShadowArenaProgress();

      await Promise.allSettled([
        profilePromise,
        missionsPromise,
        journeyPromise,
        continueLearningPromise,
        neuroPlayPromise,
        shadowArenaPromise
      ]);

      // Stage 2 (Deferred Background Work): Unblock the main thread to complete FCP & LCP paint
      deferTimer = setTimeout(async () => {
        try {
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
                  try {
                    sessionStorage.setItem("spin_wheel_cached_balances", JSON.stringify(spinData.balances));
                    localStorage.setItem("spin_wheel_cached_balances", JSON.stringify(spinData.balances));
                  } catch (_) { }
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

          const dailyHabitPromise = (async () => {
            try {
              const ctx = getActiveUserContext();
              const childId = ctx.childId || userData?.activeChildId || "child_1";
              const res = await apiFetch(`/api/practice/habits/daily?childId=${encodeURIComponent(childId)}`);
              if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                  setDailyHabitData(json.data);
                  try {
                    sessionStorage.setItem(`nrs_global_habit_${childId}`, JSON.stringify(json.data));
                  } catch (e) { }
                  return;
                }
              }
              // Graceful fallback to Day 1 if response is not successful
              setDailyHabitData((prev: any) => prev || { currentDay: 1, isCompletedToday: false, completedCount: 0, totalHabits: 365 });
            } catch (e) {
              console.error("Failed to fetch daily habit info", e);
              setDailyHabitData((prev: any) => prev || { currentDay: 1, isCompletedToday: false, completedCount: 0, totalHabits: 365 });
            } finally {
              setIsHabitLoading(false);
            }
          })();

          await Promise.allSettled([
            notificationsPromise,
            citiesPromise,
            spinWheelPromise,
            streakSequencePromise,
            dailyHabitPromise
          ]);
        } catch (e) { }
      }, 120);
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
          syncFromUserData(u);
          setUserData(u);
          setXp(u.xp || 0);
          setCoins(u.coins || 0);
          setChildName(u.childName || "Explorer");
          setChildPhoto(u.childPhoto || "");
          setUserLevel(u.level || 1);
          setStreakDays(u.streakDays || 0);
          fetchJourneyData(u);
          fetchContinueLearningProgress(u);
          fetchNeuroPlayProgress(u);
          fetchNotifications(u);
          const cachedSA = getScopedItem("cached_shadow_arena_progress");
          if (cachedSA) {
            try {
              const parsed = JSON.parse(cachedSA);
              const completed = Number(parsed.completed ?? 0);
              const total = 100;
              const percent = Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
              setShadowArenaProgress({ completed, total, percent });
            } catch (e) { }
          }
          fetchShadowArenaProgress(u);
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
      if (deferTimer) clearTimeout(deferTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
      clearInterval(pollInterval);
    };
  }, [retentionTrigger]);

  const completeMission = async (missionId: string, missionObj?: any) => {
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

        const taskTitle = data.title || missionObj?.title || `Mission #${data.seq || missionObj?.seq || ''}`;
        const earnedXp = data.xpReward ?? missionObj?.xp_reward ?? 20;
        const earnedCoins = data.coinReward ?? missionObj?.coin_reward ?? 10;

        let childName = "Your child";
        try {
          const cached = localStorage.getItem("userData");
          if (cached) {
            const u = JSON.parse(cached);
            childName = u.childName || u.fullName || "Your child";
          }
        } catch (_) {}

        // Trigger Device Push Notification with child's name and exact task title
        triggerDevicePushNotification(
          "🎯 DAILY QUEST COMPLETED!",
          `${childName} completed quest "${taskTitle}" and claimed +${earnedXp} XP & +${earnedCoins} Coins! 🚀`,
          "/home"
        );

        window.dispatchEvent(new Event("userDataUpdated"));
        fetchMissions();
      }
    } catch (e) {
      console.error("Failed to complete mission");
    }
  };

  const activeMission = useMemo(() => {
    return missions.find(m => m.status !== 'claimed') || missions[0];
  }, [missions]);

  const displayMissions = useMemo(() => {
    if (!missions || missions.length === 0) return [];

    const filteredList = missions.filter((m) => {
      const isClaimed = m.status === "completed" || m.status === "claimed";
      const isUnclaimed = m.status === "ready_to_claim" || (Number(m.current_progress || 0) >= Number(m.target_progress || 1) && !isClaimed);
      const isCompleted = isClaimed || isUnclaimed;
      const isActive = !isCompleted;

      if (questTab === 'completed') return isCompleted;
      if (questTab === 'active') return isActive;
      return true;
    });

    const sortedList = [...filteredList].sort((a, b) => {
      const isClaimedA = a.status === "completed" || a.status === "claimed";
      const isReadyA = a.status === "ready_to_claim" || (Number(a.current_progress || 0) >= Number(a.target_progress || 1) && !isClaimedA);
      const isDoneA = isClaimedA;

      const isClaimedB = b.status === "completed" || b.status === "claimed";
      const isReadyB = b.status === "ready_to_claim" || (Number(b.current_progress || 0) >= Number(b.target_progress || 1) && !isClaimedB);
      const isDoneB = isClaimedB;

      const orderA = isReadyA ? 0 : isDoneA ? 2 : 1;
      const orderB = isReadyB ? 0 : isDoneB ? 2 : 1;
      if (orderA !== orderB) return orderA - orderB;
      return (a.seq || 0) - (b.seq || 0);
    });

    return sortedList;
  }, [missions, questTab]);

  const effectiveTheme = useMemo(() => {
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
  }, [searchParams, journeyData?.tierKey, userData?.childClass]);

  // Detect a level increase (since the last level we showed for this child) and celebrate it
  useEffect(() => {
    if (!effectiveLevel) return;
    const key = `lastSeenLevel:${userData?.activeChildId || userData?.children?.[0]?.childId || "default"}`;
    try {
      const prevRaw = localStorage.getItem(key);
      const prev = prevRaw ? Number(prevRaw) : 0;
      if (prev > 0 && effectiveLevel > prev) setLevelUpTo(effectiveLevel);
      if (!prev || effectiveLevel > prev) localStorage.setItem(key, String(effectiveLevel));
    } catch { }
  }, [effectiveLevel, userData?.activeChildId]);

  const handleCtaClick = useCallback(() => {
    startNavigationProgress();
    navigate("/practice/journey-map");
  }, [navigate]);
  const handleMissionClick = useCallback(() => setShowDailyMissionModal(true), []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-clip pb-3 max-w-md mx-auto">
      {/* Dynamic Background Glows */}
      <div className="absolute bottom-[20%] -left-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(20,23,121,0.05)] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto flex items-center justify-between px-4 pt-3 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_16px_rgba(20,23,121,0.05)] z-50 gap-2 select-none">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <button
              onClick={() => {
                startNavigationProgress();
                navigate("/profile");
              }}
              className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:opacity-90 active:scale-90 touch-manipulation transition-all shrink-0 bg-[#141779] shadow-xs block cursor-pointer"
              aria-label="Profile Avatar"
            >
              {childPhoto ? (
                <img
                  src={childPhoto}
                  alt="Avatar"
                  width={40}
                  height={40}
                  loading="eager"
                  decoding="async"
                  // @ts-ignore fetchpriority for React 18
                  fetchpriority="high"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#141779] text-white font-bold text-xs flex items-center justify-center">
                  {childName ? childName.slice(0, 2).toUpperCase() : "NR"}
                </div>
              )}
            </button>
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            {/* Line 1: Child Name (Full Width, No Truncation Cramming) */}
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">{childName}</h1>
            </div>
            {/* Line 2: Class Badge, Level & Switch Pill Button */}
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-1.5 py-0.5 rounded-full border border-indigo-100 shrink-0 whitespace-nowrap">
                {userData?.childClass || getActiveUserContext().classLevel || ""}
              </span>
              <span className="text-[10.5px] text-slate-400 font-extrabold whitespace-nowrap">
                Lvl {effectiveLevel}
              </span>
              {userData?.children && userData.children.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowSwitcher(true)}
                  className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-[#141779] rounded-full text-[9.5px] font-black border border-indigo-200/80 active:scale-95 transition-all shrink-0 cursor-pointer"
                  title="Switch child profile"
                >
                  Switch
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => setShowStreakModal(true)}
            className="bg-[#fff7ed] border border-orange-100/80 rounded-2xl px-2 py-1 flex items-center justify-center hover:scale-105 active:scale-95 touch-manipulation transition-transform shadow-2xs cursor-pointer"
          >
            <span className="text-[11px] font-black text-[#ea580c] leading-none whitespace-nowrap">🔥 {retentionStreak?.currentStreak ?? streakDays ?? 0}</span>
          </button>
          <button
            onClick={() => {
              startNavigationProgress();
              navigate("/practice/inventory");
            }}
            className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl px-2 py-1 flex items-center justify-center hover:scale-105 active:scale-90 touch-manipulation transition-transform shadow-2xs cursor-pointer"
          >
            <span className="text-[11px] font-black text-[#b45309] leading-none whitespace-nowrap">🪙 {coins || 0}</span>
          </button>
          <button
            onClick={() => {
              startNavigationProgress();
              navigate("/notifications");
            }}
            className="w-8 h-8 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 active:scale-90 touch-manipulation transition-all shrink-0 border border-slate-100 relative cursor-pointer"
          >
            <Bell size={15} className="text-[#1c1970]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 pt-[68px] flex flex-col gap-3.5 relative z-10">
        {/* 1. ADVENTURE HERO CARD */}
        <AdventureHero
          themeKey={effectiveTheme}
          xp={xp}
          targetXp={1000}
          currentLocationName={journeyData?.currentLocation}
          destinationName={journeyData?.nextNodeName}
          journeyData={journeyData}
          onCtaClick={handleCtaClick}
          onMissionClick={handleMissionClick}
          isLoadingMission={isMissionsLoading && !activeMission}
          missionTitle={activeMission?.title}
          missionProgress={activeMission ? {
            current: activeMission.current_progress ?? activeMission.currentProgress ?? 0,
            total: activeMission.target_progress ?? activeMission.targetProgress ?? 0
          } : undefined}
          missionRewardText={activeMission ? `+${activeMission.xp_reward ?? activeMission.xpReward ?? 20} XP & ${activeMission.coin_reward ?? activeMission.coinReward ?? 10} Coins` : undefined}
          missionXpReward={activeMission ? (activeMission.xp_reward ?? activeMission.xpReward ?? activeMission.xp) : undefined}
          missionCoinReward={activeMission ? (activeMission.coin_reward ?? activeMission.coinReward ?? activeMission.coins) : undefined}
        />

        {/* 2. FIVE QUICK ACTION BENTO GRID (2+2+1 Cards: Continue Learning, Good Habits, My Collections, Neuro Play, Shadow Arena) */}
        <section className="grid grid-cols-2 gap-3">
          {/* Card 1: Continue Learning (Soft Periwinkle / Royal Sky) */}
          {(() => {
            const isLoading = isContinueLearningLoading && !continueLearningProgress.total;
            const classCurriculumTotal = journeyData?.totalCurrentClassChapters ?? journeyData?.totalTierChapters;
            const totalCh = classCurriculumTotal || continueLearningProgress.total || 0;
            const completedCh = continueLearningProgress.completed;
            const pct = totalCh > 0 ? Math.min(100, Math.round((completedCh / totalCh) * 100)) : 0;
            const progressText = totalCh > 0
              ? t('chapters_complete', { completed: completedCh, total: totalCh, defaultValue: `${completedCh}/${totalCh} Chapters Complete` })
              : t('resume_chapters', 'Resume chapters & practice');

            return (
              <button
                onClick={() => navigate("/practice/chapters")}
                className="bg-[#EEF2FF] rounded-[24px] p-4 flex flex-col justify-between min-h-[168px] border border-[#C7D2FE] shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center shrink-0">
                  <BookOpen size={19} className="text-[#4338CA]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={15} />
                </div>
                <div className="mt-3">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 truncate">{t('continue_learning')}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2 truncate">{t('math_science_quests')}</p>
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#141779]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#141779] animate-pulse shrink-0" />
                        <span className="animate-pulse truncate">{t('loading', 'Loading...')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#c7c7ff]/70 rounded-full overflow-hidden">
                        <div className="h-full bg-[#141779]/40 rounded-full animate-pulse transition-all duration-500" style={{ width: '0%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[9.5px] font-extrabold text-[#4338CA] truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />
                        <span className="truncate">{progressText}</span>
                      </div>
                      <div className={`w-full h-1.5 bg-slate-100 rounded-full overflow-hidden ${pct === 0 ? 'flex items-center' : ''}`}>
                        {pct === 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#141779] shrink-0" />
                        ) : (
                          <div className="h-full rounded-full transition-all duration-500" style={progressFillStyle(pct)} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })()}

          {/* Card 2: Good Habits (Warm Apricot / Honey Cream) */}
          {(() => {
            const isLoading = isHabitLoading && !dailyHabitData;
            const currentHabitDay = dailyHabitData?.currentDay || 1;
            const isCompletedToday = dailyHabitData?.isCompletedToday ?? false;
            const totalHabits = dailyHabitData?.totalHabits || 365;
            const completedHabits = typeof dailyHabitData?.completedCount === "number"
              ? dailyHabitData.completedCount
              : Math.max(0, isCompletedToday ? currentHabitDay : currentHabitDay - 1);

            const habitsPct = totalHabits > 0
              ? Math.min(100, Math.round((completedHabits / totalHabits) * 100))
              : 0;

            const habitsBarWidth = completedHabits > 0 ? Math.max(1, habitsPct) : 0;

            const habitsDoneText = t('habits_completed_ratio', {
              completed: completedHabits,
              total: totalHabits,
              pct: habitsPct,
              defaultValue: `${completedHabits}/${totalHabits} Habits (${habitsPct}%)`
            });

            return (
              <button
                onClick={() => navigate("/good-habits")}
                className="bg-[#FFFBEB] rounded-[24px] p-4 flex flex-col justify-between min-h-[168px] border border-[#FDE68A] shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <Star size={19} className="text-[#D97706] fill-[#D97706]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={15} />
                </div>
                <div className="mt-3">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 truncate">{t('good_habits', 'Good Habits')}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2 truncate">{t('daily_lessons_rewards', 'Daily lessons & rewards')}</p>
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#D97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse shrink-0" />
                        <span className="animate-pulse truncate">{t('loading', 'Loading...')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FEF3C7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F59E0B] rounded-full animate-pulse transition-all duration-500" style={{ width: '0%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[9.5px] font-extrabold text-[#D97706] truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                        <span className="truncate">{habitsDoneText}</span>
                      </div>
                      <div className={`w-full h-1.5 bg-[#FEF3C7] rounded-full overflow-hidden ${habitsBarWidth === 0 ? 'flex items-center' : ''}`}>
                        {habitsBarWidth === 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#141779] shrink-0" />
                        ) : (
                          <div className="h-full rounded-full transition-all duration-500" style={progressFillStyle(habitsBarWidth)} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })()}

          {/* Card 6: Shadow Arena (Crisp Ice Blue / Cyan Aqua) */}
          {(() => {
            const isLoading = isShadowArenaLoading && !shadowArenaProgress.completed;
            const fightsCompleted = Number(shadowArenaProgress.completed || 0);
            const targetFights = 100;
            const fightsPct = Math.min(100, Math.max(0, Math.round((fightsCompleted / targetFights) * 100)));
            const fightsBarWidth = fightsCompleted > 0 ? Math.max(1, fightsPct) : 0;

            const fightsText = t('fights_completed_ratio', {
              completed: fightsCompleted,
              total: targetFights,
              pct: fightsPct,
              defaultValue: `${fightsCompleted}/${targetFights} Fights (${fightsPct}%)`
            });

            return (
              <button
                onClick={() => navigate("/multiplayer-hub")}
                className="bg-[#ECFEFF] rounded-[24px] p-4 flex flex-col justify-between min-h-[168px] border border-[#A5F3FC] shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0">
                  <Swords size={19} className="text-[#059669]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={15} />
                </div>
                <div className="mt-3">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 truncate">{t('shadow_arena', 'Shadow Arena')}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2 truncate">{t('challenge_friends_in_battles', 'Challenge friends in battles')}</p>
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#059669]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
                        <span className="animate-pulse truncate">{t('loading', 'Loading...')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#d1fae5]/80 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981]/40 rounded-full animate-pulse transition-all duration-500" style={{ width: '0%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[9.5px] font-extrabold text-[#059669] truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" />
                        <span className="truncate">{fightsText}</span>
                      </div>
                      <div className={`w-full h-1.5 bg-[#d1fae5] rounded-full overflow-hidden ${fightsBarWidth === 0 ? 'flex items-center' : ''}`}>
                        {fightsBarWidth === 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#141779] shrink-0" />
                        ) : (
                          <div className="h-full rounded-full transition-all duration-500" style={progressFillStyle(fightsBarWidth)} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })()}

          {/* Card 5: Neuro Play (Vibrant Orchid / Electric Lilac) */}
          {(() => {
            const isLoading = isNeuroPlayLoading && !neuroPlayProgress.total;
            const skillsCompleted = neuroPlayProgress.completed;
            const totalSkills = neuroPlayProgress.total;
            const pct = neuroPlayProgress.percent;
            const neuroPlayText = totalSkills > 0
              ? t('skills_completed_ratio', { completed: skillsCompleted, total: totalSkills, defaultValue: `${skillsCompleted}/${totalSkills} Skills completed` })
              : t('day_1_quests', 'Day 1 Quests (M01 & M02)');

            return (
              <button
                onClick={() => navigate("/neuro-play")}
                className="bg-[#FAF5FF] rounded-[24px] p-4 flex flex-col justify-between min-h-[168px] border border-[#E9D5FF] shadow-2xs text-left hover:scale-[1.02] transition-transform relative overflow-hidden group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <Brain size={19} className="text-[#9333EA]" />
                </div>
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={15} />
                </div>
                <div className="mt-3">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 truncate">{t('neuro_play', 'Neuro Play')}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2 truncate">{t('brain_skill_lab', 'Brain Skill Lab & Quests')}</p>
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#7c3aed]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse shrink-0" />
                        <span className="animate-pulse truncate">{t('loading', 'Loading...')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#ede9fe]/80 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8b5cf6]/40 rounded-full animate-pulse transition-all duration-500" style={{ width: '0%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[9.5px] font-extrabold text-[#9333EA] truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shrink-0" />
                        <span className="truncate">{neuroPlayText}</span>
                      </div>
                      <div className={`w-full h-1.5 bg-[#F3E8FF] rounded-full overflow-hidden ${pct === 0 ? 'flex items-center' : ''}`}>
                        {pct === 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#141779] shrink-0" />
                        ) : (
                          <div className="h-full rounded-full transition-all duration-500" style={progressFillStyle(pct)} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })()}

          {/* Card 4: My Collections (Blush Rose / Coral) - compact row, same size as Parent Space */}
          <button
            onClick={() => navigate("/practice/collections")}
            className="col-span-2 bg-[#FFF1F2] rounded-[24px] p-3.5 flex justify-between items-center gap-2 border border-[#FECDD3] shadow-2xs text-left hover:bg-[#FFE4E6]/60 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#FFE4E6] flex items-center justify-center shrink-0">
                <Trophy size={18} className="text-[#E11D48]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-900 truncate">{t('my_collections', 'My Collections')}</h3>
                <p className="text-[11px] text-slate-500 font-semibold truncate">{t('unlocked_cards_badges', 'Unlocked cards & badges')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center border border-amber-200/50">
                <Star size={10} className="fill-white" />
              </div>
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center border border-purple-200/50">
                <Crown size={10} className="fill-white" />
              </div>
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center border border-cyan-200/50">
                <Gem size={10} />
              </div>
              <div className="w-7 h-7 ml-1 rounded-full bg-white border border-slate-100 text-slate-500 flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-transform">
                <ChevronRight size={14} />
              </div>
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

      <LevelUpModal
        isOpen={levelUpTo !== null}
        level={levelUpTo || effectiveLevel}
        onClose={() => setLevelUpTo(null)}
      />

      {/* DAILY MISSIONS MODAL */}
      <AnimatePresence>
        {showDailyMissionModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden"
            style={{ touchAction: "none" }}
            onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowDailyMissionModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                overscrollBehavior: "contain",
                touchAction: "pan-y",
                willChange: "transform, opacity",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-slate-950 w-full max-w-sm sm:max-w-[440px] max-h-[88vh] p-4 sm:p-6 rounded-[32px] border-2 border-slate-200 shadow-2xl flex flex-col relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#141779] to-[#25218c] text-white flex items-center justify-center shadow-lg shadow-indigo-900/20 border-2 border-indigo-200/40 shrink-0">
                    <Clock className="w-5 h-5 animate-pulse text-[#57fae9]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight truncate">{t('daily_quests', 'Daily Quests')}</h3>
                      <span className="text-[10px] sm:text-xs font-black bg-[#141779] text-white px-2 py-0.5 rounded-full border border-indigo-900/40 shrink-0">
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
                <div className="p-6 my-auto bg-gradient-to-b from-indigo-50 to-indigo-100/50 rounded-[24px] border-2 border-indigo-200 text-center flex flex-col items-center gap-3 shadow-sm relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#141779] to-[#25218c] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-indigo-900/25 animate-bounce">
                    🏆
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#141779]">{t('quests_mastered_today', '25 / 25 Quests Mastered Today!')}</h4>
                  <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                    {t('quests_mastered_desc', "Sensational effort! You have completed today's maximum 25 quests. Tomorrow starts your next continuous sequence!")}
                  </p>
                </div>
              ) : (
                /* GUARANTEED TOUCH & MOUSE SCROLL CONTAINER */
                <div
                  className="my-2 h-[318px] shrink-0 overflow-y-auto overscroll-contain py-1 pr-1 flex flex-col gap-2.5 relative z-10 select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#141779]/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100"
                  style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                >
                  {(() => {
                    if (isMissionsLoading && (!missions || missions.length === 0)) {
                      return (
                        <div className="flex flex-col gap-2.5 animate-pulse min-h-[280px]">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 sm:p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 h-[76px]">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-11 h-11 rounded-2xl bg-slate-200 shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <div className="h-4 w-36 bg-slate-200 rounded" />
                                  <div className="h-3 w-48 bg-slate-100 rounded" />
                                </div>
                              </div>
                              <div className="h-8 w-16 bg-slate-200 rounded-xl shrink-0" />
                            </div>
                          ))}
                        </div>
                      );
                    }

                    if (displayMissions.length === 0) {
                      return (
                        <div className="flex-1 flex items-center justify-center text-center text-slate-500 font-bold text-sm">
                          {questTab === 'completed'
                            ? t('no_completed_quests', 'No completed quests yet!')
                            : questTab === 'active'
                              ? t('no_active_quests', 'No active quests remaining!')
                              : t('no_quests_found', 'No quests found!')}
                        </div>
                      );
                    }

                    return displayMissions.map((mission) => {
                      const isDone = mission.status === "completed" || mission.status === "claimed";
                      const isReady = mission.status === "ready_to_claim" || (Number(mission.current_progress || 0) >= Number(mission.target_progress || 1) && !isDone);
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
                              ? "bg-indigo-50/80 border-indigo-300 shadow-md ring-2 ring-indigo-500/20"
                              : "bg-slate-50 border-slate-200/90 text-slate-900"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold border shadow-sm ${isDone
                              ? "bg-emerald-500 border-emerald-400 text-white"
                              : isReady
                                ? "bg-[#141779] border-indigo-500 text-white animate-bounce"
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
                                <span className="inline-flex items-center gap-0.5 bg-indigo-50 text-[#141779] px-2 py-0.5 rounded-full border border-indigo-200/80">
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
                                  completeMission(mission.id || `seq_${mission.seq}`, mission);
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
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#141779] to-[#25218c] border-2 border-[#FFC83D] text-[#FFC83D] shadow-[0_4px_16px_rgba(20,23,121,0.4)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Gift className="w-6 h-6 text-[#FFC83D]" />
          </button>
        </motion.div>

        {/* Daily Missions Clock Icon */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => {
              setShowDailyMissionModal(true);
              if (!missions || missions.length === 0) {
                fetchMissions();
              }
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#141779] to-[#25218c] border-2 border-[#FFC83D] text-[#FFC83D] shadow-[0_4px_16px_rgba(20,23,121,0.4)] flex items-center justify-center relative hover:scale-105 transition-transform"
          >
            <Clock className="w-6 h-6 animate-pulse text-[#FFC83D]" />
            {missions.some(m => m.status === 'ready_to_claim') && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC83D] text-[#141779] rounded-full text-[9px] font-black flex items-center justify-center border border-[#141779] animate-bounce">
                !
              </span>
            )}
          </button>
        </motion.div>
      </div>

      {/* DAILY FREE SPIN AUTO-POPUP */}
      <AnimatePresence>
        {showSpinPopup && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
            style={{ touchAction: "none" }}
            onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowSpinPopup(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ overscrollBehavior: "contain" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#111453]/95 via-[#141779]/95 to-[#0b0c3f]/95 text-white w-full max-w-[360px] p-7 rounded-[32px] flex flex-col items-center text-center gap-5 border border-white/10 shadow-[0_20px_50px_rgba(20,23,121,0.5)] relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowSpinPopup(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(87,250,233,0.12)_0%,transparent_65%)] pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              <div className="relative w-20 h-20 rounded-full bg-[rgba(87,250,233,0.08)] flex items-center justify-center border border-[#57fae9]/40 shadow-[0_0_30px_rgba(87,250,233,0.25)] z-10">
                <Gift className="w-10 h-10 text-[#57fae9] filter drop-shadow-[0_0_8px_rgba(87,250,233,0.6)] animate-pulse" />
              </div>

              <div className="z-10">
                <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_2px_10px_rgba(249,115,22,0.3)] mb-3.5 inline-block border-0">
                  Daily Bonus
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
                  <span>Spin Now</span>
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

      <AnimatePresence>
        {showStreakModal && (() => {
          const currentStreakVal = Number(retentionStreak?.currentStreak ?? streakDays ?? 0);
          const rawLongestStreakVal = Number(retentionStreak?.longestStreak ?? streakDays ?? 0);
          const longestStreakVal = Math.max(currentStreakVal, rawLongestStreakVal);

          let titleText = `${currentStreakVal} Day Streak!`;
          let subtitleText = `Your longest streak is ${longestStreakVal} days. Keep up the consistency!`;
          let btnText = "AWESOME!";

          if (currentStreakVal === 0) {
            titleText = "Start Your Streak Today! 🚀";
            subtitleText = "“Every expert was once a beginner! Complete 1 lesson today to ignite your flame!” 🔥";
            btnText = "LET'S DO THIS! 🚀";
          } else if (currentStreakVal === 1) {
            titleText = "1 Day Streak! 🔥";
            subtitleText = "Awesome start! Complete a lesson tomorrow to build your streak momentum! 💪";
            btnText = "AWESOME!";
          } else if (currentStreakVal >= longestStreakVal && currentStreakVal > 1) {
            titleText = `${currentStreakVal} Day Streak! 🎉`;
            subtitleText = `🏆 New Personal Record! You've achieved your longest streak ever. Keep it burning!`;
            btnText = "AWESOME!";
          }

          return (
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
              style={{ touchAction: "none" }}
              onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowStreakModal(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                style={{ overscrollBehavior: "contain" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#111453] via-[#141779] to-[#0b0c3f] text-white border border-white/15 w-full max-w-sm rounded-[32px] p-7 text-center relative shadow-[0_20px_50px_rgba(20,23,121,0.6)] flex flex-col items-center justify-between gap-6 overflow-hidden"
              >
                {/* Top-Right Close Button */}
                <button
                  type="button"
                  onClick={() => setShowStreakModal(false)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-400/25 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-300/20 blur-2xl pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center w-full gap-5 z-10">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.06, 1],
                        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="w-full h-full text-[120px] flex items-center justify-center filter drop-shadow-[0_8px_25px_rgba(255,159,67,0.5)] select-none"
                    >
                      🔥
                    </motion.div>
                    <span className="absolute text-4xl font-black text-white mt-8 select-none drop-shadow-md">
                      {currentStreakVal}
                    </span>
                  </div>

                  <div className="flex justify-between w-full px-1 gap-1.5">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => {
                      const isActive = currentStreakVal > 0 && Boolean(retentionStreak?.streakDaysOfWeek?.[idx]);

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${isActive
                              ? "bg-white border-2 border-white text-[#141779] shadow-[0_0_12px_rgba(255,255,255,0.45)] scale-110"
                              : "bg-white/10 border border-white/15 text-slate-300 opacity-60"
                              }`}
                          >
                            {day}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 mt-1">
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {titleText}
                    </h2>
                    <p className="text-xs font-bold text-slate-200 leading-relaxed px-2">
                      {subtitleText}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowStreakModal(false);
                    if (currentStreakVal === 0) {
                      navigate("/practice/chapters");
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] hover:brightness-110 text-white font-black text-xs border border-white/25 shadow-[0_8px_24px_rgba(20,23,121,0.45)] uppercase tracking-wider active:scale-95 transition-all mt-2 z-10 cursor-pointer"
                >
                  {btnText}
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* STREAK REVIVAL MODAL */}
      {showRevivalModal && streakRevivalData && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in select-none pointer-events-auto"
          style={{ touchAction: "none" }}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-500/30 flex flex-col items-center text-center relative overflow-hidden animate-scale-up"
            style={{ overscrollBehavior: "contain" }}
          >
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
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#141779]/20 border border-indigo-200/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>🔥 Pay {streakRevivalData.reviveCost} Coins to Revive</span>
              </button>

              <button
                onClick={handleDeclineRevival}
                disabled={revivalLoading}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold text-xs rounded-2xl transition-all"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STREAK REVIVAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {showRevivalConfirmModal && streakRevivalData && (
          <div
            className="fixed inset-0 z-[1001] flex items-center justify-center px-6"
            style={{ touchAction: "none" }}
            onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !revivalLoading && setShowRevivalConfirmModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ overscrollBehavior: "contain" }}
              className="relative bg-white w-full max-w-[360px] p-6 rounded-[32px] flex flex-col items-center text-center gap-5 border-2 border-indigo-100 shadow-2xl overflow-hidden z-10 text-slate-950"
            >
              <button
                type="button"
                onClick={() => !revivalLoading && setShowRevivalConfirmModal(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-3xl shadow-inner">
                🔥
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-950">
                  Confirm Streak Revival
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  Spend <span className="font-extrabold text-[#141779]">{streakRevivalData.reviveCost} Coins</span> to restore your <span className="font-extrabold text-slate-900">{streakRevivalData.previousStreak}-day streak</span>?
                </p>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>🪙 Cost:</span>
                <span className="text-[#141779] font-extrabold text-sm">{streakRevivalData.reviveCost} Coins</span>
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
                  className="flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] hover:brightness-110 transition-all shadow-md shadow-[#141779]/20 border border-indigo-300/40 flex items-center justify-center gap-1.5"
                >
                  {revivalLoading ? "Reviving..." : "Confirm & Pay"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showSwitcher && (
        <Suspense fallback={null}>
          <ChildSwitcherModal
            isOpen={showSwitcher}
            onClose={() => setShowSwitcher(false)}
            user={userData}
            onUserUpdated={(updated) => {
              setUserData(updated);
              localStorage.setItem("userData", JSON.stringify(updated));
              window.dispatchEvent(new Event("userDataUpdated"));
            }}
            onSwitched={() => {
              fetchProfile();
              fetchMissions();
              fetchJourneyData();
              fetchContinueLearningProgress();
              fetchNeuroPlayProgress();
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
