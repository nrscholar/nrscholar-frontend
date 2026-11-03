import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Rocket, Sun, Compass, Globe, Moon, CheckCircle, Lock, Bell, Sparkles, Trophy, ChevronRight, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";
import { prefetchPdf } from "../../../utils/pdfCache";
import { getScopedItem, setScopedItem, getActiveUserContext } from "../../../utils/sessionCache";
import StreakModal from "../../../components/StreakModal";
import { showNotificationToast } from "../../../components/GlobalNotificationBanner";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { startNavigationProgress } from "../../../components/NavigationProgressBar";

// In-memory runtime cache for parsed chapter arrays to ensure 0ms instantaneous tab switching
const runtimeChapterCache = new Map<string, any[]>();

export default function ChaptersScreen() {
  const rawNavigate = useNavigate();
  const navigate = useCallback((to: any, options?: any) => {
    startNavigationProgress();
    rawNavigate(to, options);
  }, [rawNavigate]);
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const translateSubjectName = (subj: string) => {
    if (!subj) return "";
    const lower = subj.toLowerCase();
    if (lower.includes("gujarati")) return t("gujarati", "Gujarati");
    if (lower.includes("math")) return t("mathematics", t("maths", "Mathematics"));
    if (lower.includes("english")) return t("english_subject", "English");
    if (lower.includes("social")) return t("social_science", t("social_studies", "Social Science"));
    if (lower.includes("science")) return t("science", "Science");
    if (lower.includes("hindi")) return t("hindi_subject", "Hindi");
    return t(subj.toLowerCase().replace(/ /g, '_'), { defaultValue: subj });
  };

  // Synchronous cache initialization for 0ms instant display
  const getInitialSubjects = () => {
    try {
      const cached = getScopedItem("cached_practice_subjects");
      if (!cached) return [];
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed)
        ? parsed.filter((s: any) => (s.totalChapters === undefined || s.totalChapters > 0) && s.hasContent !== false && s.isactive !== 0)
        : [];
    } catch (e) { return []; }
  };

  const getInitialActiveSubject = () => {
    const initialSubs = getInitialSubjects();
    if (initialSubs.length === 0) return null;
    const savedId = getScopedItem("activeSubjectId");
    return initialSubs.find((s: any) => s._id === savedId) || initialSubs[0];
  };

  const getInitialChapters = (subjectId?: string) => {
    if (!subjectId) return [];
    if (runtimeChapterCache.has(subjectId)) {
      return runtimeChapterCache.get(subjectId)!;
    }
    try {
      const cached = getScopedItem(`cached_chapters_${subjectId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          runtimeChapterCache.set(subjectId, parsed);
          return parsed;
        }
      }
      return [];
    } catch (e) { return []; }
  };

  const getInitialProgressMap = (): Record<string, any> => {
    try {
      const cached = getScopedItem("cached_chapter_progress");
      return cached ? JSON.parse(cached) : {};
    } catch (e) { return {}; }
  };

  const getInitialCompletedChapters = (): string[] => {
    try {
      const cached = getScopedItem("cached_completed_chapters");
      const list: string[] = cached ? JSON.parse(cached) : [];
      const cachedProg = getScopedItem("cached_chapter_progress");
      const progMap = cachedProg ? JSON.parse(cachedProg) : null;
      if (progMap && Array.isArray(list)) {
        return list.filter(id => {
          const rawId = id.replace(/_hard$/, "");
          const p = progMap[rawId] || progMap[id];
          if (p && Array.isArray(p.completedMissions) && p.completedMissions.length > 0) {
            return p.completedMissions.length >= 5;
          }
          return true;
        });
      }
      return list;
    } catch (e) { return []; }
  };

  const initialSubjects = getInitialSubjects();
  const initialActive = getInitialActiveSubject();
  const initialChapters = getInitialChapters(initialActive?._id);
  const initialProgressMap = getInitialProgressMap();
  const initialCompletedChapters = getInitialCompletedChapters();

  const [subjects, setSubjects] = useState<any[]>(initialSubjects);
  const [activeSubject, setActiveSubject] = useState<any>(initialActive);
  const [chapters, setChapters] = useState<any[]>(initialChapters);
  const [loading, setLoading] = useState(initialChapters.length === 0);
  const [completedChapters, setCompletedChapters] = useState<string[]>(initialCompletedChapters);
  const [chapterProgressMap, setChapterProgressMap] = useState<Record<string, any>>(initialProgressMap);
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [childClass, setChildClass] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [coins, setCoins] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const activeSubjectRef = useRef<string | null>(initialActive?._id || null);

  const processProgressData = useCallback((pList: any[]) => {
    const progMap: Record<string, any> = {};
    const completedIds: string[] = [];

    if (Array.isArray(pList)) {
      pList.forEach((p: any) => {
        if (!p || !p.chapterId) return;
        const chIdStr = String(p.chapterId);
        const mList = Array.isArray(p.completedMissions) ? p.completedMissions : [];

        // Strict Mission Logic: A chapter is ONLY complete when all 5 missions are finished
        let isDone = false;
        if (mList.length > 0) {
          isDone = mList.length >= 5 && p.chapterCompleted !== false;
        } else {
          isDone = Boolean(
            p.chapterCompleted === true &&
            p.completed === true &&
            p.questionsCompleted === true
          );
        }

        const normalizedP = {
          ...p,
          chapterCompleted: isDone,
          completed: isDone,
          completedMissions: mList
        };

        progMap[chIdStr] = normalizedP;
        progMap[p.chapterId] = normalizedP;

        if (isDone) {
          if (!completedIds.includes(chIdStr)) completedIds.push(chIdStr);
          if (!completedIds.includes(`${chIdStr}_hard`)) completedIds.push(`${chIdStr}_hard`);
        }
      });
    }

    return { progMap, completedIds };
  }, []);

  const fetchChapterProgress = useCallback(async () => {
    try {
      const { classLevel } = getActiveUserContext();
      const pRes = await apiFetch(`/api/practice/chapter-progress?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null);
      if (pRes?.ok) {
        const pData = await pRes.json().catch(() => null);
        if (pData?.success && Array.isArray(pData.data)) {
          const { progMap, completedIds } = processProgressData(pData.data);
          setChapterProgressMap(progMap);
          setCompletedChapters(completedIds);
          setScopedItem("cached_chapter_progress", JSON.stringify(progMap));
          setScopedItem("cached_completed_chapters", JSON.stringify(completedIds));
        }
      }
    } catch (e) {
      console.error("Failed to fetch chapter progress", e);
    }
  }, [processProgressData]);

  const handleSelectSubject = (sub: any) => {
    if (!sub || sub._id === activeSubject?._id) return;
    activeSubjectRef.current = sub._id;
    setActiveSubject(sub);
    setScopedItem("activeSubjectId", sub._id);

    // Instant 0ms synchronous chapter swap / skeleton loader
    const cachedChs = getInitialChapters(sub._id);
    if (cachedChs.length > 0) {
      setChapters(cachedChs);
      setLoading(false);
    } else {
      setChapters([]);
      setLoading(true);
    }
  };

  const showToast = (message: string) => {
    showNotificationToast({
      title: t('chapter_locked', 'CHAPTER LOCKED 🔒'),
      message,
      type: "lock"
    });
  };

  const fetchSubjects = useCallback(async () => {
    // 1. Read cached user data instantly
    const cachedUser = localStorage.getItem("userData");
    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setChildName(u.childName || u.name || "Kid");
        setChildPhoto(u.childPhoto || u.photo || "");
        setChildClass(u.childClass || u.class_name || u.className || "");
        setStreakDays(u.streakDays || u.streak_days || u.streak || 0);
        setCoins(u.coins || u.xp || 0);
        setIsSubscribed(Boolean(u.is_subscribed || u.isSubscribed));
      } catch (e) { }
    }

    // 2. Parallel background fetch for user, notifications, subjects, and controls
    try {
      const { classLevel } = getActiveUserContext();
      const [meRes, notifRes, subRes, controlsRes] = await Promise.all([
        apiFetch("/api/users/me").catch(() => null),
        apiFetch("/api/notifications").catch(() => null),
        apiFetch(`/api/practice/subjects?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null),
        apiFetch("/api/parent/controls").catch(() => null)
      ]);

      if (meRes?.ok) {
        try {
          const meJson = await meRes.json();
          if (meJson.success && meJson.data?.user) {
            const u = meJson.data.user;
            localStorage.setItem("userData", JSON.stringify(u));
            setChildName(u.childName || u.name || "Kid");
            setChildPhoto(u.childPhoto || u.photo || "");
            setChildClass(u.childClass || u.class_name || u.className || "");
            setStreakDays(u.streakDays || u.streak_days || u.streak || 0);
            setCoins(u.coins || u.xp || 0);
            setIsSubscribed(Boolean(u.is_subscribed || u.isSubscribed));
          }
        } catch (e) { }
      }

      if (notifRes?.ok) {
        try {
          const notifData = await notifRes.json();
          if (notifData.success && notifData.data) {
            setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
          }
        } catch (e) { }
      }

      let subData: any = { success: false, data: [] };
      if (subRes?.ok) {
        try { subData = await subRes.json(); } catch (e) { }
      }

      let controlsData: any = { success: false };
      if (controlsRes?.ok) {
        try { controlsData = await controlsRes.json(); } catch (e) { }
      }

      let restricted: Record<string, boolean> = {};
      if (controlsData?.success && controlsData.data?.parentControls?.restrictedSubjects) {
        restricted = controlsData.data.parentControls.restrictedSubjects;
      }

      if (subData?.success && Array.isArray(subData.data) && subData.data.length > 0) {
        const allowedSubjects = subData.data.filter((s: any) => {
          if (restricted[s.name] || restricted[s.subject]) return false;
          if (s.totalChapters !== undefined && s.totalChapters <= 0) return false;
          if (s.hasContent === false) return false;
          if (s.isactive === 0) return false;
          return true;
        });

        if (allowedSubjects.length > 0) {
          setSubjects(allowedSubjects);
          setScopedItem("cached_practice_subjects", JSON.stringify(allowedSubjects));
          const savedSubjectId = getScopedItem("activeSubjectId");
          const found = allowedSubjects.find((s: any) => s._id === savedSubjectId) || allowedSubjects[0];
          setActiveSubject((prev: any) => {
            if (prev?._id === found._id) return prev;
            return found;
          });
          activeSubjectRef.current = found._id;
          setScopedItem("activeSubjectId", found._id);

          // Fast background prefetch for remaining subjects so user tab switches are instant (0ms)
          allowedSubjects.forEach((sub: any) => {
            const sid = sub._id;
            if (sid !== found._id && !runtimeChapterCache.has(sid) && !getScopedItem(`cached_chapters_${sid}`)) {
              apiFetch(`/api/practice/chapters/${sid}?classLevel=${encodeURIComponent(classLevel)}`)
                .then(r => r?.ok ? r.json() : null)
                .then(d => {
                  if (d?.success && Array.isArray(d.data)) {
                    runtimeChapterCache.set(sid, d.data);
                    setScopedItem(`cached_chapters_${sid}`, JSON.stringify(d.data));
                  }
                })
                .catch(() => {});
            }
          });
        } else {
          setSubjects([]);
          setLoading(false);
        }
      } else {
        if (subjects.length === 0) {
          setSubjects([]);
          setLoading(false);
        }
      }
    } catch (e) {
      console.error("Failed to fetch subjects", e);
      setLoading(false);
    }
  }, [subjects.length]);

  useEffect(() => {
    fetchSubjects();
    fetchChapterProgress();

    const handleUserDataUpdate = () => {
      const cachedUser = localStorage.getItem("userData");
      if (cachedUser) {
        try {
          const u = JSON.parse(cachedUser);
          setChildName(u.childName || u.name || "Kid");
          setChildPhoto(u.childPhoto || u.photo || "");
          setChildClass(u.childClass || u.class_name || u.className || "");
          setStreakDays(u.streakDays || u.streak_days || u.streak || 0);
          setCoins(u.coins || u.xp || 0);
          setIsSubscribed(Boolean(u.is_subscribed || u.isSubscribed));
        } catch (e) {}
      }
      fetchSubjects();
      fetchChapterProgress();
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchChapterProgress();
      }
    };

    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [fetchSubjects, fetchChapterProgress]);

  useEffect(() => {
    if (!activeSubject) return;

    const currentSubId = activeSubject._id;
    activeSubjectRef.current = currentSubId;

    const fetchChapters = async () => {
      const cachedChs = getInitialChapters(currentSubId);
      if (cachedChs.length > 0) {
        setChapters(cachedChs);
        setLoading(false);
      } else {
        setChapters([]);
        setLoading(true);
      }

      try {
        const { classLevel } = getActiveUserContext();
        const fetchTasks: Promise<any>[] = [
          apiFetch(`/api/practice/chapters/${currentSubId}?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null)
        ];
        if (completedChapters.length === 0) {
          fetchTasks.push(apiFetch(`/api/practice/chapter-progress?classLevel=${encodeURIComponent(classLevel)}`).catch(() => null));
        }
        const [chRes, pRes] = await Promise.all(fetchTasks);

        // Always update chapter progress across all subjects regardless of activeSubjectRef,
        // because chapter-progress is global child progress!
        if (pRes?.ok) {
          try {
            const pData = await pRes.json();
            if (pData?.success && Array.isArray(pData.data)) {
              const { progMap, completedIds } = processProgressData(pData.data);
              setChapterProgressMap(progMap);
              setCompletedChapters(completedIds);
              setScopedItem("cached_chapter_progress", JSON.stringify(progMap));
              setScopedItem("cached_completed_chapters", JSON.stringify(completedIds));
            }
          } catch (pe) {
            console.error("Failed to parse progress data", pe);
          }
        }

        if (activeSubjectRef.current !== currentSubId) return;

        let chData: any = { success: false, data: [] };
        if (chRes?.ok) {
          try { chData = await chRes.json(); } catch (e) { }
        }

        if (activeSubjectRef.current !== currentSubId) return;

        if (chData?.success && Array.isArray(chData.data)) {
          runtimeChapterCache.set(currentSubId, chData.data);
          setChapters(chData.data);
          setScopedItem(`cached_chapters_${currentSubId}`, JSON.stringify(chData.data));
          if (chData.data.length === 0) {
            // Subject has no active chapters seeded: prune from tabs to strictly hide empty subjects
            setSubjects((prevSubjects) => {
              const pruned = prevSubjects.filter((s) => s._id !== currentSubId);
              setScopedItem("cached_practice_subjects", JSON.stringify(pruned));
              if (pruned.length > 0) {
                const nextSub = pruned[0];
                setActiveSubject(nextSub);
                activeSubjectRef.current = nextSub._id;
                setScopedItem("activeSubjectId", nextSub._id);
              } else {
                setActiveSubject(null);
                activeSubjectRef.current = null;
              }
              return pruned;
            });
          } else {
            // Prefetch first 3 chapter PDFs in the background
            chData.data.slice(0, 3).forEach((c: any) => {
              const cid = c._id || c.chapterId;
              if (cid) prefetchPdf(cid);
            });
          }
        } else {
          setChapters([]);
        }
      } catch (e) {
        console.error("Failed to fetch chapters", e);
      } finally {
        if (activeSubjectRef.current === currentSubId) {
          setLoading(false);
        }
      }
    };
    fetchChapters();
  }, [activeSubject?._id, processProgressData]);

  const totalChapters = chapters.length;
  const isChapterCompleted = useCallback((chapterId: string) => {
    if (!chapterId) return false;
    const chIdStr = String(chapterId);
    const p = chapterProgressMap[chIdStr] || chapterProgressMap[chapterId] || chapterProgressMap[`${chIdStr}_hard`];
    if (p) {
      const mList = Array.isArray(p.completedMissions) ? p.completedMissions : [];
      if (mList.length > 0) {
        return mList.length >= 5 && p.chapterCompleted !== false;
      }
      if (p.chapterCompleted === true && p.completed === true && p.questionsCompleted === true) {
        return true;
      }
      return false;
    }
    if (completedChapters.includes(chIdStr) || completedChapters.includes(`${chIdStr}_hard`)) {
      return true;
    }
    return false;
  }, [completedChapters, chapterProgressMap]);
  const completedChaptersCount = chapters.filter(ch => isChapterCompleted(ch._id)).length;

  // Track Mission Progress for active subject (removing chapter duplication with Progress Screen)
  const MISSIONS_PER_CHAPTER = 5;
  const totalMissions = chapters.reduce((sum, ch) => {
    const chMissions = Array.isArray(ch.missions) && ch.missions.length > 0 ? ch.missions.length : MISSIONS_PER_CHAPTER;
    return sum + chMissions;
  }, 0);

  const completedMissionsCount = chapters.reduce((sum, ch) => {
    const chIdStr = String(ch._id);
    const p = chapterProgressMap[chIdStr] || chapterProgressMap[ch._id] || chapterProgressMap[`${chIdStr}_hard`];
    const isDone = isChapterCompleted(chIdStr);
    const chMissionsTotal = Array.isArray(ch.missions) && ch.missions.length > 0 ? ch.missions.length : MISSIONS_PER_CHAPTER;

    if (isDone) {
      return sum + chMissionsTotal;
    }

    if (p) {
      if (Array.isArray(p.completedMissions) && p.completedMissions.length > 0) {
        return sum + Math.min(chMissionsTotal, p.completedMissions.length);
      }
      if (p.readingCompleted || p.questionsCompleted) {
        return sum + 1;
      }
    }

    return sum;
  }, 0);

  const progressPercent = totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

  const currentChapterIndex = chapters.findIndex(ch => !isChapterCompleted(ch._id));
  const activeCurrentChapter = currentChapterIndex >= 0 ? chapters[currentChapterIndex] : chapters[chapters.length - 1];

  const getChapterTitle = (chap: any, index: number) => {
    if (!chap) return `${t('chapter', 'Chapter')} ${index + 1}`;
    const raw = chap.name || chap.title || chap.chapter_name || chap.chapterName;
    if (raw && typeof raw === 'string' && raw.trim().length > 0 && isNaN(Number(raw.trim()))) {
      return raw.trim();
    }
    return `${t('chapter', 'Chapter')} ${index + 1}`;
  };

  const handleToggleChapter = async (index: number, chapterId: string, chapterName: string) => {
    if (index >= 1 && !isSubscribed) {
      setShowSubModal(true);
      return;
    }
    const progress = chapterProgressMap[chapterId] || {};
    startNavigationProgress();
    if (!progress.readingCompleted) {
      navigate(`/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    } else {
      navigate(`/mission-roadmap?chapterId=${chapterId}&title=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] text-[#17157F] font-sans pb-44 relative selection:bg-[#5B5CFF] selection:text-white overflow-x-clip">
      {/* Background World Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#5B5CFF]/10 blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#FFC83D]/15 blur-[90px]" />
      </div>

      {/* TOP APP BAR / GAME HUD (Square Sticky Design) */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex flex-col bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs gap-2 pb-2 select-none">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => {
                startNavigationProgress();
                navigate("/profile");
              }}
              className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:opacity-90 active:scale-90 touch-manipulation transition-all shrink-0 bg-[#141779] shadow-xs cursor-pointer"
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
            <div className="flex flex-col min-w-0 justify-center">
              {/* Line 1: Name + Class on same line */}
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-sm font-black text-slate-900 leading-tight truncate max-w-[130px]">{childName || "Explorer"}</h1>
                <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-2 py-0.5 rounded-full border border-indigo-100 shrink-0 whitespace-nowrap">
                  {childClass || t('class_10', { defaultValue: "Class 10" })}
                </span>
              </div>
              {/* Line 2: Level */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11.5px] text-slate-400 font-extrabold whitespace-nowrap">
                  {t('explorer_level', { defaultValue: "Explorer Level" })} {Math.min(99, completedChaptersCount + 1)}
                </span>
              </div>
            </div>
          </div>

          {/* Currency & Streak Stats */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowStreakModal(true)}
              className="bg-[#fff7ed] border border-orange-100/80 rounded-2xl px-2 py-1.5 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 touch-manipulation transition-transform shadow-2xs cursor-pointer"
            >
              <span className="text-[11px] font-black text-[#ea580c] leading-none">🔥 {streakDays || 0}</span>
            </button>
            <button
              onClick={() => {
                startNavigationProgress();
                navigate("/practice/inventory");
              }}
              className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl px-2 py-1.5 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-90 touch-manipulation transition-transform shadow-2xs cursor-pointer"
            >
              <span className="text-[11px] font-black text-[#b45309] leading-none">🪙 {coins || 0}</span>
            </button>
            <button
              onClick={() => {
                startNavigationProgress();
                navigate("/notifications");
              }}
              className="w-9 h-9 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 active:scale-90 touch-manipulation transition-all shrink-0 border border-slate-100 relative cursor-pointer"
            >
              <Bell size={16} className="text-[#1c1970]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DIVIDER LINE SEPARATING HEADER PROFILE & SUBJECTS */}
        <div className="border-b border-slate-200/70 mx-4 mb-2" />

        {/* SUBJECT SELECTION TABS */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2.5 gap-2 max-w-[430px] mx-auto w-full pr-6">
          {subjects.filter((s) => (s.totalChapters === undefined || s.totalChapters > 0) && s.hasContent !== false && s.isactive !== 0).length > 0 ? (
            subjects
              .filter((s) => (s.totalChapters === undefined || s.totalChapters > 0) && s.hasContent !== false && s.isactive !== 0)
              .map((sub) => {
                const isActive = activeSubject?._id === sub._id;
                return (
                  <button
                    key={sub._id}
                    onClick={() => handleSelectSubject(sub)}
                    className={`px-4 py-1.5 rounded-full font-black text-xs whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#5B5CFF] to-[#17157F] text-white shadow-md border border-[#5B5CFF]' 
                        : 'bg-white text-[#767683] border border-[#E0E3E5] hover:border-[#5B5CFF]/60'
                    }`}
                  >
                    <Globe size={13} className={isActive ? "text-[#FFC83D]" : "text-[#767683]"} />
                    <span>{translateSubjectName(sub.name)}</span>
                  </button>
                );
              })
          ) : (
            <>
              <div className="h-7 w-24 rounded-full animate-skeleton shrink-0 border border-[#5B5CFF]/20" />
              <div className="h-7 w-28 rounded-full animate-skeleton shrink-0 border border-[#5B5CFF]/20" />
              <div className="h-7 w-24 rounded-full animate-skeleton shrink-0 border border-[#5B5CFF]/20" />
            </>
          )}
        </div>
      </header>

      {/* MAIN ADVENTURE CONTENT */}
      <main className="px-4 pt-4 max-w-[430px] mx-auto w-full relative z-10 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            {/* MISSION PROGRESS HERO CARD SKELETON */}
            <div className="bg-[#EEF1FF]/90 border-2 border-[#5B5CFF]/30 rounded-2xl p-4 shadow-md backdrop-blur-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full animate-skeleton shrink-0" />
                  <div className="h-4 w-28 rounded-md animate-skeleton" />
                </div>
                <div className="h-5 w-24 rounded-full animate-skeleton" />
              </div>
              <div className="h-6 w-52 rounded-lg animate-skeleton" />
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-3.5 rounded-full animate-skeleton" />
                <div className="h-4 w-8 rounded-md animate-skeleton shrink-0" />
              </div>
              <div className="h-3 w-56 rounded-md animate-skeleton" />
            </div>

            {/* CHAPTER TIMELINE SKELETON (4 Cards matching 1:1 layout) */}
            <div className="relative flex flex-col gap-4">
              {/* Timeline Axis Background Line */}
              <div className="absolute left-[28px] top-6 bottom-6 w-1 -translate-x-1/2 bg-[#5B5CFF]/20 rounded-full" />

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 w-full">
                  <div className="w-14 shrink-0 flex items-center justify-center pt-1">
                    <div className="w-11 h-11 rounded-full animate-skeleton border-4 border-white shadow-md shrink-0" />
                  </div>
                  <div className="flex-1 bg-[#EEF1FF]/80 border-2 border-[#5B5CFF]/20 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div className="space-y-2.5 flex-1 pr-2">
                      <div className="h-3.5 w-24 rounded-full animate-skeleton" />
                      <div className="h-5 w-3/4 rounded-md animate-skeleton" />
                      <div className="h-8 w-full rounded-xl animate-skeleton mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (

          <>
            {/* MISSION PROGRESS HERO CARD */}
            <section className="bg-white border-2 border-[#E0E3E5] rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#17157F]">
                    {t('your_journey', '🚀 YOUR JOURNEY')}
                  </span>
                </div>
                <span className="text-[10px] font-black text-[#006a62] bg-[#35E5D4]/20 px-2 py-0.5 rounded-full border border-[#35E5D4]/50">
                  {t('of_missions', { completed: completedMissionsCount, total: totalMissions, defaultValue: `${completedMissionsCount} OF ${totalMissions} MISSIONS` })}
                </span>
              </div>

              <div className="mb-2.5">
                <h2 className="text-base font-black text-[#17157F] leading-tight">
                  {activeCurrentChapter ? getChapterTitle(activeCurrentChapter, currentChapterIndex >= 0 ? currentChapterIndex : 0) : t('journey_completed', 'Journey Completed!')}
                </h2>
              </div>

              {/* Progress Bar & Percentage Alignment */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[#EEF1FF] rounded-full overflow-hidden p-0.5 border border-[#E0E3E5]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#5B5CFF] via-[#35E5D4] to-[#45D483] rounded-full shadow-sm"
                  />
                </div>
                <span className="text-xs font-black text-[#17157F] shrink-0">
                  {progressPercent}%
                </span>
              </div>

              <p className="text-[10px] font-bold text-[#5B5CFF] mt-2 italic">
                {completedMissionsCount === totalMissions && totalMissions > 0
                  ? t('mastered_learning_world', '🎉 You mastered this entire learning world!')
                  : t('next_mission_waiting', 'Keep going! Your next mission is waiting.')}
              </p>
            </section>

            {/* VERTICAL LEARNING ADVENTURE MAP WITH FIXED TIMELINE AXIS */}
            <section className="relative py-2 flex flex-col gap-5">
              {/* Continuous Vertical Timeline Axis Line (Centered on 28px inside 56px Timeline Column) */}
              <div className="absolute left-[28px] top-6 bottom-14 w-1 -translate-x-1/2 bg-gradient-to-b from-[#45D483] via-[#5B5CFF] to-[#B9BBC8]/40 -z-10 rounded-full" />

              {chapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8 border-2 border-[#E0E3E5] border-dashed text-center my-4">
                  <Rocket size={40} className="text-[#5B5CFF] mb-2" />
                  <p className="text-sm font-bold text-[#17157F]">{t('new_missions_soon', 'New Missions Launching Soon!')}</p>
                  <p className="text-xs text-[#767683] mt-1">{t('check_back_shortly', { subject: activeSubject?.name, defaultValue: `Check back shortly for new adventures in ${activeSubject?.name}.` })}</p>
                </div>
              ) : (
                chapters.map((chap, index) => {
                  const isCompleted = isChapterCompleted(chap._id);
                  const isCurrent = !isCompleted && index === currentChapterIndex;
                  const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";
                  const isSubLocked = index >= 1 && !isSubscribed;
                  const isExpanded = expandedChapter === chap._id;
                  const displayTitle = getChapterTitle(chap, index);

                  // Accordion Options for Completed Chapter
                  const renderQuestions = () => (
                    isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-100 w-full text-left flex flex-col gap-2"
                      >
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/chapter-reader?chapterId=${chap._id}&title=${encodeURIComponent(displayTitle)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); 
                          }} 
                          className="bg-[#EEF1FF] border border-[#5B5CFF]/30 text-[#17157F] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#5B5CFF] hover:text-white transition-all flex items-center justify-between"
                        >
                          <span>{t('read_chapter_pdf', '📖 Read Chapter PDF')}</span>
                          <ChevronRight size={16} />
                        </button>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/mission-roadmap?chapterId=${chap._id}&title=${encodeURIComponent(displayTitle)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); 
                          }} 
                          className="bg-[#EEF1FF] border border-[#5B5CFF]/30 text-[#17157F] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#5B5CFF] hover:text-white transition-all flex items-center justify-between"
                        >
                          <span>{t('practice_mission_questions', '⚡ Practice Mission Questions')}</span>
                          <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )
                  );

                  return (
                    <div key={chap._id} className="relative flex items-start gap-3 w-full">
                      {/* FIXED TIMELINE COLUMN (56px Wide - Exact Center Alignment across all nodes) */}
                      <div className="w-14 shrink-0 flex items-center justify-center pt-1 relative">
                        {status === "completed" && (
                          <div className="w-11 h-11 rounded-full bg-[#45D483] border-4 border-white text-white flex items-center justify-center shadow-md">
                            <CheckCircle size={22} strokeWidth={2.5} />
                          </div>
                        )}
                        {status === "current" && (
                          <div className="w-11 h-11 rounded-full bg-white relative flex items-center justify-center shrink-0">
                            <div className="w-full h-full rounded-full bg-[#5B5CFF] border-4 border-white text-white flex items-center justify-center shadow-[0_0_16px_rgba(91,92,255,0.6)] animate-pulse">
                              <Rocket size={20} className="text-[#FFC83D]" />
                            </div>
                          </div>
                        )}
                        {status === "locked" && (
                          <div className={`w-11 h-11 rounded-full border-4 flex items-center justify-center ${
                            isSubLocked 
                              ? 'bg-[#FEF3C7] border-white text-[#D97706]' 
                              : 'bg-[#F1F3F5] border-white text-[#B9BBC8]'
                          }`}>
                            <Lock size={18} className={isSubLocked ? 'text-[#D97706]' : 'text-[#B9BBC8]'} />
                          </div>
                        )}
                      </div>

                      {/* CHAPTER CARD (RIGHT OF TIMELINE) */}
                      <div className="flex-1 min-w-0">
                        {status === "completed" && (
                          <div className="bg-white border-2 border-[#45D483]/60 rounded-2xl p-3.5 shadow-sm transition-all text-left">
                            <button 
                              onClick={() => {
                                if (expandedChapter === chap._id) setExpandedChapter(null);
                                else setExpandedChapter(chap._id);
                              }} 
                              className="flex flex-col text-left w-full gap-1"
                            >
                              <div className="flex items-center justify-between w-full">
                                <p className="text-[10px] font-bold text-[#767683]">
                                  {t('chapter', 'Chapter')} {index + 1}
                                </p>
                                <span className="text-[9px] font-black uppercase tracking-wider text-[#45D483] bg-[#45D483]/15 px-2 py-0.5 rounded-full border border-[#45D483]/40 shrink-0">
                                  {t('mission_completed_badge', '✓ MISSION COMPLETED')}
                                </span>
                              </div>

                              <div className="flex items-center justify-between w-full gap-2 mt-0.5">
                                <h3 className="text-sm font-black text-[#17157F] leading-tight truncate">
                                  {displayTitle}
                                </h3>
                                <span className="text-[10.5px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#141779] to-[#25218c] px-3 py-1 rounded-full shrink-0 shadow-xs hover:brightness-110 active:scale-95 transition-all">
                                  {isExpanded ? t('close', 'Close') : t('review', 'Review')}
                                </span>
                              </div>
                            </button>
                            {renderQuestions()}
                          </div>
                        )}

                        {status === "current" && (
                          <div className={`flex-1 ${isSubLocked ? 'bg-amber-50 border-amber-300' : 'bg-gradient-to-br from-white to-[#EEF1FF] border-2 border-[#5B5CFF] shadow-[0_4px_16px_rgba(91,92,255,0.2)]'} rounded-2xl p-4 relative overflow-hidden transition-all text-left`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-bold text-[#5B5CFF]">
                                {t('chapter', 'Chapter')} {index + 1}
                              </p>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${isSubLocked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#5B5CFF] text-white border-[#5B5CFF]'}`}>
                                {isSubLocked ? t('premium_mission_badge', '👑 PREMIUM MISSION 🔒') : t('current_mission_badge', '🚀 CURRENT MISSION')}
                              </span>
                            </div>

                            <h3 className="text-base font-black text-[#17157F] leading-tight mb-2.5">
                              {displayTitle}
                            </h3>

                            {(() => {
                              const savedAns = getScopedItem(`user_answers_${chap._id}_1`);
                              const savedPhase = getScopedItem(`mission_phase_${chap._id}_1`);
                              let isChapInProgress = false;
                              if (savedAns) {
                                try {
                                  const arr = JSON.parse(savedAns);
                                  if (Array.isArray(arr) && arr.length > 0) isChapInProgress = true;
                                } catch (e) {}
                              }
                              if (savedPhase && savedPhase !== "SUMMARY") isChapInProgress = true;

                              return (
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleToggleChapter(index, chap._id, displayTitle)}
                                    className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                      isSubLocked
                                        ? 'bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white shadow-md active:scale-95 border border-indigo-300/40'
                                        : 'bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white shadow-[0_4px_14px_rgba(91,92,255,0.4)] hover:brightness-110 active:scale-95 border border-[#5B5CFF]'
                                    }`}
                                  >
                                    <span>{isSubLocked ? t('unlock_premium_mission', 'UNLOCK PREMIUM MISSION') : isChapInProgress ? t('continue_mission_btn', 'CONTINUE MISSION →') : t('start_mission_btn', 'START MISSION →')}</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {status === "locked" && (
                          <div 
                            onClick={() => {
                              if (isSubLocked) setShowSubModal(true);
                              else showToast(t('complete_chapter_to_unlock', { chapter: currentChapterIndex + 1 }));
                            }}
                            className={`rounded-2xl p-3.5 border-2 transition-all cursor-pointer text-left ${
                              isSubLocked 
                                ? 'bg-indigo-50/60 border-indigo-200' 
                                : 'bg-white/80 border-[#E0E3E5]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] font-bold text-[#767683]">
                                {t('chapter', 'Chapter')} {index + 1}
                              </p>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${isSubLocked ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {isSubLocked ? t('premium_badge', '👑 PREMIUM 🔒') : t('locked_badge', '🔒 LOCKED')}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#767683] leading-tight">
                              {displayTitle}
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>

      {/* UNIFIED SUBSCRIPTION LOCK MODAL */}
      <UnifiedConfirmModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onConfirm={() => {
          setShowSubModal(false);
          navigate("/parent/subscription");
        }}
        title={t('unlock_full_adventure', 'Unlock Full Adventure!')}
        message={t('chapter_1_free_desc', 'Chapter 1 is free for everyone. Access to Chapter 2 and beyond requires an active StudySaathy Subscription.')}
        confirmText={t('upgrade_subscription', 'Upgrade Subscription →')}
        cancelText={t('maybe_later', 'Maybe Later')}
        variant="primary"
        icon={<Crown size={30} className="text-[#141779]" />}
      />

      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streakDays={streakDays}
      />
    </div>
  );
}
