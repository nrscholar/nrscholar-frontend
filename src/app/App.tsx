import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ParentLayout from "./components/ParentLayout";
import ChildSwitcherModal from "../components/ChildSwitcherModal";
import { Clock, Sparkles, ChevronRight, X } from "lucide-react";

// Auth feature pages
import ForgotPasswordScreen from "../features/auth/pages/ForgotPasswordScreen";
import LoginScreen from "../features/auth/pages/LoginScreen";
import NotFoundScreen from "./NotFoundScreen";
import { UniversalErrorBoundary } from "../components/UniversalErrorScreen";
import ParentalGateScreen from "../features/auth/pages/ParentalGateScreen";
import SignupStep1Screen from "../features/auth/pages/SignupStep1";
import SignupStep2Screen from "../features/auth/pages/SignupStep2";
import SignupStep3Screen from "../features/auth/pages/SignupStep3";

// Users feature pages
import EditProfileScreen from "../features/users/pages/EditProfileScreen";
import HelpCenterScreen from "../features/users/pages/HelpCenterScreen";
import ProfileScreen from "../features/users/pages/ProfileScreen";

// Dashboard feature pages
import AssessmentSummary from "../features/dashboard/pages/AssessmentSummary";
import ChapterQuestionsScreen from "../features/dashboard/pages/ChapterQuestionsScreen";
import ChaptersScreen from "../features/dashboard/pages/ChaptersScreen";
import ChatScreen from "../features/dashboard/pages/ChatScreen";
import EvolutionScreen from "../features/dashboard/pages/EvolutionScreen";
import HabitsScreen from "../features/dashboard/pages/HabitsScreen";
import HomeScreen from "../features/dashboard/pages/HomeScreen";
import InventoryScreen from "../features/dashboard/pages/InventoryScreen";
import JourneyMapScreen from "../features/dashboard/pages/JourneyMapScreen";
import NotificationsScreen from "../features/dashboard/pages/NotificationsScreen";
import ParentAchievementsScreen from "../features/dashboard/pages/ParentAchievementsScreen";
import ParentChallengesScreen from "../features/dashboard/pages/ParentChallengesScreen";
import ParentDailyTipScreen from "../features/dashboard/pages/ParentDailyTipScreen";
import ParentDashboardScreen from "../features/dashboard/pages/ParentDashboardScreen";
import ParentReportScreen from "../features/dashboard/pages/ParentReportScreen";
import ParentLearningDNAScreen from "../features/dashboard/pages/ParentLearningDNAScreen";
import ParentLearningLibraryScreen from "../features/dashboard/pages/ParentLearningLibraryScreen";
import ParentLessonPlayerScreen from "../features/dashboard/pages/ParentLessonPlayerScreen";
import ParentLessonsScreen from "../features/dashboard/pages/ParentLessonsScreen";
import ParentRoadmapScreen from "../features/dashboard/pages/ParentRoadmapScreen";
import ParentSettings from "../features/dashboard/pages/ParentSettings";
import ParentSubscriptionScreen from "../features/dashboard/pages/ParentSubscriptionScreen";
import ProgressScreen from "../features/dashboard/pages/ProgressScreen";
import RecapScreen from "../features/dashboard/pages/RecapScreen";
import DailyRewardsScreen from "../features/dashboard/pages/DailyRewardsScreen";
import RewardScreen from "../features/dashboard/pages/RewardScreen";
import ScanAndLearn from "../features/dashboard/pages/ScanAndLearn";
import ScanHistory from "../features/dashboard/pages/ScanHistory";
import KidsActivityScreen from "../features/dashboard/pages/KidsActivityScreen";
import WeeklyTestScreen from "../features/dashboard/pages/WeeklyTest";
import WeeklyTestQuestionsScreen from "../features/dashboard/pages/WeeklyTestQuestions";
import WeeklyTestResultsScreen from "../features/dashboard/pages/WeeklyTestResults";
const BossBattleScreen = lazy(() => import("../features/dashboard/pages/BossBattleScreen"));
const MultiplayerHubScreen = lazy(() => import("../features/dashboard/pages/MultiplayerHubScreen"));
const MultiplayerRoomScreen = lazy(() => import("../features/dashboard/pages/MultiplayerRoomScreen"));
const MultiplayerBattleScreen = lazy(() => import("../features/dashboard/pages/MultiplayerBattleScreen"));
const TextbookSubjectsScreen = lazy(() => import("../features/dashboard/pages/TextbookSubjectsScreen"));
const TextbookChaptersScreen = lazy(() => import("../features/dashboard/pages/TextbookChaptersScreen"));
const ChapterReaderScreen = lazy(() => import("../features/dashboard/pages/ChapterReaderScreen"));
const MissionMapScreen = lazy(() => import("../features/dashboard/pages/MissionMapScreen"));
const MissionPlayScreen = lazy(() => import("../features/dashboard/pages/MissionPlayScreen"));

// Admin (question bank) — separate session from student/parent
const AdminLoginScreen = lazy(() => import("../features/admin/pages/AdminLoginScreen"));
const QuestionBankScreen = lazy(() => import("../features/admin/pages/QuestionBankScreen"));
const ChapterReviewScreen = lazy(() => import("../features/admin/pages/ChapterReviewScreen"));
const AllQuestionsScreen = lazy(() => import("../features/admin/pages/AllQuestionsScreen"));
const AdminProtectedRoute = lazy(() =>
  import("../features/admin/components/AdminUI").then((m) => ({ default: m.AdminProtectedRoute }))
);

/** Student-only overlays (screen-time lock, notifications) must not cover the admin panel. */
const StudentOnly = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? null : <>{children}</>;
};
const AuthHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => navigate("/login", { replace: true });
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, [navigate]);
  return null;
};

import { apiFetch } from "../api";
import { registerPushNotificationToken } from "../services/pushNotificationService";
import GlobalNotificationBanner from "../components/GlobalNotificationBanner";

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

const ScreenTimeTracker = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Milestone warnings tracking state
  const [dismissedMilestones, setDismissedMilestones] = useState<Record<string, boolean>>({});
  const [activeMilestone, setActiveMilestone] = useState<{ key: string; title: string; subtitle: string; timeBadge: string; icon: string } | null>(null);

  const location = useLocation();
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    registerPushNotificationToken();

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

    const interval = setInterval(() => {
      if (limitMinutes >= 9999) {
        setIsLocked(false);
        setActiveMilestone(null);
        return;
      }
      
      const currentPath = window.location.pathname;
      const isParentOrAuthRoute = currentPath.startsWith("/parent") || currentPath.startsWith("/login") || currentPath.startsWith("/signup");

      const uStr = localStorage.getItem("userData");
      let childId = "child_1";
      let userId = "user";
      if (uStr) {
        try {
          const u = JSON.parse(uStr);
          childId = u.activeChildId || u.childId || "child_1";
          userId = u.id || u._id || "user";
          setUserData(u);
        } catch (e) {}
      }

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

  const isParentRoute = location.pathname.startsWith('/parent');

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
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg z-[9999] flex items-center justify-center p-5 text-center font-sans animate-in fade-in duration-300">
        <div className="bg-[#141779] border-4 border-amber-400 rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(20,23,121,0.5)] flex flex-col items-center relative overflow-hidden text-white">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />

          {/* Trophy Header */}
          <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl shadow-xl backdrop-blur-md mb-3 z-10">
            🏆
          </div>

          <span className="px-3.5 py-1 bg-amber-400 text-[#141779] font-black text-[10px] rounded-full uppercase tracking-wider mb-2.5 shadow-xs z-10">
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
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 py-3.5 rounded-2xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider border border-amber-300 flex items-center justify-center gap-2"
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

        {userData && (
          <ChildSwitcherModal
            isOpen={showSwitcherModal}
            onClose={() => setShowSwitcherModal(false)}
            user={userData}
            onUserUpdated={(u) => setUserData(u)}
          />
        )}
      </div>
    );
  }

  return null;
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

function App() {
  // Intercept token from query parameter (passed from mobile webview)
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    localStorage.setItem("userToken", urlToken);
    params.delete("token");
    const cleanSearch = params.toString();
    const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  }

function PinGuard() {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith("/parent")) {
      sessionStorage.removeItem("parentPinVerified");
    }
  }, [location.pathname]);
  return null;
}

  return (
    <BrowserRouter>
      <PinGuard />
      <ScrollToTop />
      <AuthHandler />
      <StudentOnly>
        <ScreenTimeTracker />
        <GlobalNotificationBanner />
      </StudentOnly>
      <UniversalErrorBoundary>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#141779]"></div></div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/signup-step1" element={<SignupStep1Screen />} />
            <Route path="/signup-step2" element={<SignupStep2Screen />} />
            <Route path="/signup-step3" element={<SignupStep3Screen />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/progress" element={<ProgressScreen />} />
                <Route path="/practice/chapters" element={<ChaptersScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/help" element={<HelpCenterScreen />} />
                <Route path="/chat" element={<ChatScreen />} />
              </Route>
              
              <Route path="/edit-profile" element={<EditProfileScreen />} />
              <Route path="/assessment-summary" element={<AssessmentSummary />} />
              <Route path="/scan-and-learn" element={<ScanAndLearn />} />
              <Route path="/chapter-reader" element={<ChapterReaderScreen />} />
              <Route path="/chapter-questions" element={<ChapterQuestionsScreen />} />
              <Route path="/practice/inventory" element={<InventoryScreen />} />
              <Route path="/practice/journey-map" element={<JourneyMapScreen />} />
              <Route path="/practice/collections" element={<InventoryScreen />} />
              <Route path="/parent" element={<ParentalGateScreen />} />
              <Route path="/parent/gate" element={<ParentalGateScreen />} />
              <Route element={<ParentLayout />}>
                <Route path="/parent/dashboard" element={<ParentDashboardScreen />} />
                <Route path="/parent/reports" element={<ParentReportScreen />} />
                <Route path="/parent/daily-tip" element={<ParentDailyTipScreen />} />
                <Route path="/parent/challenges" element={<ParentChallengesScreen />} />
                <Route path="/parent/achievements" element={<ParentAchievementsScreen />} />
                <Route path="/parent/lessons" element={<ParentLessonsScreen />} />
                <Route path="/parent/learning-library" element={<ParentLearningLibraryScreen />} />
                <Route path="/parent/roadmap" element={<ParentRoadmapScreen />} />
                <Route path="/parent/kids-activity" element={<KidsActivityScreen />} />
                <Route path="/parent/settings" element={<ParentSettings />} />
                <Route path="/parent/learning-dna" element={<ParentLearningDNAScreen />} />
                <Route path="/parent/lessons/player" element={<ParentLessonPlayerScreen />} />
                <Route path="/parent/subscription" element={<ParentSubscriptionScreen />} />
              </Route>
              <Route path="/practice/reward" element={<RewardScreen />} />
              <Route path="/daily-rewards" element={<DailyRewardsScreen />} />
              <Route path="/weekly-test" element={<WeeklyTestScreen />} />
              <Route path="/weekly-test-questions" element={<WeeklyTestQuestionsScreen />} />
              <Route path="/weekly-test-results" element={<WeeklyTestResultsScreen />} />
              <Route path="/scan-history" element={<ScanHistory />} />
              <Route path="/good-habits" element={<HabitsScreen />} />
              <Route path="/recap" element={<RecapScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/evolution" element={<EvolutionScreen />} />
              <Route path="/boss-battle" element={<BossBattleScreen />} />
              <Route path="/multiplayer-hub" element={<MultiplayerHubScreen />} />
              <Route path="/multiplayer-room/:roomId" element={<MultiplayerRoomScreen />} />
              <Route path="/multiplayer-battle/:roomId" element={<MultiplayerBattleScreen />} />
              <Route path="/textbook/subjects" element={<TextbookSubjectsScreen />} />
              <Route path="/textbook/chapters" element={<TextbookChaptersScreen />} />
              <Route path="/textbook/reader" element={<ChapterReaderScreen />} />
              <Route path="/mission-roadmap" element={<MissionMapScreen />} />
              <Route path="/mission-play" element={<MissionPlayScreen />} />
            </Route>
            
            <Route path="/admin/login" element={<AdminLoginScreen />} />
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route index element={<Navigate to="/admin/question-bank" replace />} />
              <Route path="question-bank" element={<QuestionBankScreen />} />
              <Route path="question-bank/:chapterId" element={<ChapterReviewScreen />} />
              <Route path="all-questions" element={<AllQuestionsScreen />} />
            </Route>

            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Suspense>
      </UniversalErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
