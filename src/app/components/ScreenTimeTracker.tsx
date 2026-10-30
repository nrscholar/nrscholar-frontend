import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Clock, ChevronRight, X } from "lucide-react";
import { apiFetch } from "../../api";
import { registerPushNotificationToken } from "../../services/pushNotificationService";
import { useLockBodyScroll } from "../../utils/useLockBodyScroll";

const ChildSwitcherModal = lazy(() => import("../../components/ChildSwitcherModal"));

const getDismissedMilestonesFromStorage = (userId: string, childId: string, todayStr: string): Record<string, boolean> => {
  try {
    const key = `dismissedMilestones_${userId}_${childId}_${todayStr}`;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : {};
  } catch (e) {
    return {};
  }
};

const saveDismissedMilestoneToStorage = (userId: string, childId: string, todayStr: string, milestoneKey: string) => {
  try {
    const key = `dismissedMilestones_${userId}_${childId}_${todayStr}`;
    const current = getDismissedMilestonesFromStorage(userId, childId, todayStr);
    current[milestoneKey] = true;
    localStorage.setItem(key, JSON.stringify(current));
  } catch (e) {}
};

const clearDismissedMilestonesStorage = (userId: string, childId: string, todayStr: string) => {
  try {
    const key = `dismissedMilestones_${userId}_${childId}_${todayStr}`;
    localStorage.removeItem(key);
  } catch (e) {}
};

export default function ScreenTimeTracker() {
  const [isLocked, setIsLocked] = useState(false);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Milestone warnings tracking state
  const [dismissedMilestones, setDismissedMilestones] = useState<Record<string, boolean>>({});
  const [activeMilestone, setActiveMilestone] = useState<{ key: string; title: string; subtitle: string; timeBadge: string; icon: string } | null>(null);

  const location = useLocation();
  const isParentRoute = location.pathname.startsWith('/parent');
  useLockBodyScroll(Boolean(isLocked && !isParentRoute));
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    // Defer non-critical push notification registration to idle time to prioritize FCP/LCP
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => registerPushNotificationToken());
    } else {
      setTimeout(() => registerPushNotificationToken(), 2000);
    }

    let limitMinutes = 9999;
    
    const fetchLimit = async () => {
      try {
        const res = await apiFetch("/api/parent/controls");
        const json = await res.json();
        if (json.success && json.data?.parentControls?.screenTimeMinutes !== undefined) {
          const val = json.data.parentControls.screenTimeMinutes;
          // 0 or >= 9999 means UNLIMITED (no lock)
          limitMinutes = (val <= 0 || val >= 9999) ? 9999 : val;
        }
      } catch (e) {
        console.error("Failed to fetch screen time limit", e);
      }
    };

    fetchLimit();

    const handleLimitChange = (e?: any) => {
      fetchLimit();
      if (e?.detail?.resetTimer) {
        const uStr = localStorage.getItem("userData");
        if (uStr) {
          try {
            const u = JSON.parse(uStr);
            const cId = u.activeChildId || u.childId || "child_1";
            const uId = u.id || u._id || "user";
            const tStr = new Date().toISOString().split("T")[0];
            localStorage.setItem(`screenTime_${uId}_${cId}_${tStr}`, "0");
            clearDismissedMilestonesStorage(uId, cId, tStr);
          } catch (err) {}
        }
        setDismissedMilestones({});
        setActiveMilestone(null);
        setIsLocked(false);
      }
    };

    window.addEventListener("screenTimeLimitChanged", handleLimitChange);

    let lastParsedUStr = "";
    let cachedUser: any = null;

    const interval = setInterval(() => {
      if (limitMinutes >= 9999) {
        setIsLocked(false);
        setActiveMilestone(null);
        return;
      }
      
      const currentPath = window.location.pathname;
      const isParentOrAuthRoute = currentPath.startsWith("/parent") || currentPath.startsWith("/login") || currentPath.startsWith("/signup");

      const uStr = localStorage.getItem("userData") || "";
      if (uStr !== lastParsedUStr) {
        lastParsedUStr = uStr;
        try {
          cachedUser = uStr ? JSON.parse(uStr) : null;
          if (cachedUser) setUserData(cachedUser);
        } catch (e) {}
      }

      const childId = cachedUser?.activeChildId || cachedUser?.childId || "child_1";
      const userId = cachedUser?.id || cachedUser?._id || "user";

      const todayStr = new Date().toISOString().split("T")[0];
      const storageKey = `screenTime_${userId}_${childId}_${todayStr}`;
      
      let usedSeconds = parseInt(localStorage.getItem(storageKey) || "0", 10);
      if (!isParentOrAuthRoute) {
        usedSeconds += 1;
        localStorage.setItem(storageKey, usedSeconds.toString());

        if (usedSeconds % 10 === 0 || usedSeconds === 1) {
          apiFetch("/api/users/sync-screen-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: todayStr, activeSeconds: usedSeconds })
          }).catch(() => {});
        }
      }
      
      const remainingSeconds = (limitMinutes * 60) - usedSeconds;

      if (remainingSeconds <= 0 && !isParentOrAuthRoute) {
        setIsLocked(true);
        setActiveMilestone(null);
      } else if (!isParentOrAuthRoute) {
        setIsLocked(false);
        
        // Milestone thresholds schedule: 5m and 30s remaining
        let targetMilestone: { key: string; title: string; subtitle: string; timeBadge: string; icon: string } | null = null;
        
        if (remainingSeconds <= 30 && remainingSeconds > 0) {
          targetMilestone = {
            key: "30s",
            timeBadge: "30 SECONDS LEFT",
            title: "Almost Time to Wrap Up! ⏳",
            subtitle: "You have 30 seconds left today. Finish up your current task!",
            icon: "⚡"
          };
        } else if (remainingSeconds <= 300 && remainingSeconds > 30) {
          targetMilestone = {
            key: "5m",
            timeBadge: "5 MINUTES REMAINING",
            title: "5 Minutes Remaining! ⏱️",
            subtitle: "5 minutes left for today's learning! Keep going to complete your goal.",
            icon: "🚀"
          };
        }

        if (targetMilestone) {
          const storedDismissed = getDismissedMilestonesFromStorage(userId, childId, todayStr);
          if (!storedDismissed[targetMilestone.key]) {
            setActiveMilestone(targetMilestone);
          } else {
            setActiveMilestone((curr) => (curr?.key === targetMilestone!.key ? null : curr));
          }
        } else {
          setActiveMilestone(null);
        }
      }
      
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("screenTimeLimitChanged", handleLimitChange);
    };
  }, []);

  const dismissWarning = (key: string) => {
    const uStr = localStorage.getItem("userData");
    let childId = "child_1";
    let userId = "user";
    if (uStr) {
      try {
        const u = JSON.parse(uStr);
        childId = u.activeChildId || u.childId || "child_1";
        userId = u.id || u._id || "user";
      } catch (e) {}
    }
    const todayStr = new Date().toISOString().split("T")[0];
    saveDismissedMilestoneToStorage(userId, childId, todayStr, key);
    setDismissedMilestones((prev) => ({ ...prev, [key]: true }));
    setActiveMilestone(null);
  };

  // Render Warning Milestone Popup (Top-Side Global Notification Banner Style matching Photo 2)
  if (activeMilestone && !isLocked && !isParentRoute) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] pointer-events-none font-sans">
        <div className="pointer-events-auto bg-gradient-to-r from-[#141779] via-[#1E2266] to-[#2D328F] text-white p-3.5 sm:p-4 rounded-2xl shadow-[0_12px_30px_rgba(20,23,121,0.5)] border-2 border-[#57fae9] flex items-center gap-3 select-none w-full animate-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-full bg-[#57fae9] text-[#141779] flex items-center justify-center font-black text-xl shrink-0 shadow-md">
            <Clock size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-[#57fae9] uppercase tracking-wider truncate mb-0.5">
              ⏰ {activeMilestone.timeBadge}
            </h4>
            <p className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
              {activeMilestone.subtitle}
            </p>
          </div>

          <button
            onClick={() => dismissWarning(activeMilestone.key)}
            className="px-3 py-1.5 rounded-xl bg-[#57fae9] text-[#141779] font-black text-[11px] uppercase tracking-wider flex items-center gap-0.5 shrink-0 shadow-md active:scale-95 transition-all"
          >
            <span>Got it</span>
            <ChevronRight size={13} />
          </button>

          <button
            onClick={() => dismissWarning(activeMilestone.key)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 shrink-0"
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Render Final Screen Time Lock Screen
  if (isLocked && !isParentRoute) {
    return (
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg z-[9999] flex items-center justify-center p-5 text-center font-sans animate-in fade-in duration-300"
        style={{ touchAction: "none" }}
        onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      >
        <div 
          className="bg-[#141779] border-4 border-amber-400 rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(20,23,121,0.5)] flex flex-col items-center relative overflow-hidden text-white"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />

          {/* Trophy Header */}
          <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl shadow-xl backdrop-blur-md mb-3 z-10">
            🏆
          </div>

          <span className="px-3.5 py-1 bg-[#57fae9] text-[#141779] font-black text-[10px] rounded-full uppercase tracking-wider mb-2.5 shadow-xs z-10">
            Daily Screen Time Reached 🌟
          </span>

          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight uppercase z-10">
            Time's Up for Today!
          </h1>

          <p className="text-blue-100/90 text-xs leading-relaxed mb-6 font-medium px-1 z-10">
            You've completed your daily learning session. Great effort today! Parents can unlock or switch child profile below.
          </p>

          <div className="w-full flex flex-col gap-3 z-10">
            <button 
              onClick={() => window.location.href = '/parent/gate'} 
              className="w-full bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white py-3.5 rounded-2xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider border border-[#5B5CFF] flex items-center justify-center gap-2"
            >
              <span>👨‍👩‍👦 Enter Parent PIN</span>
            </button>

            <button 
              onClick={() => setShowSwitcherModal(true)} 
              className="w-full bg-white/15 hover:bg-white/25 text-white py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2"
            >
              <span>🔄 Switch Child Profile</span>
            </button>
          </div>
        </div>

        {userData && showSwitcherModal && (
          <Suspense fallback={null}>
            <ChildSwitcherModal
              isOpen={showSwitcherModal}
              onClose={() => setShowSwitcherModal(false)}
              user={userData}
              onUserUpdated={(u) => setUserData(u)}
            />
          </Suspense>
        )}
      </div>
    );
  }

  return null;
}
