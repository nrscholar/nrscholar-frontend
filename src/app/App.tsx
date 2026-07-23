import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ChildSwitcherModal from "../components/ChildSwitcherModal";
import { Clock, Sparkles } from "lucide-react";

// Auth feature pages
import ForgotPasswordScreen from "../features/auth/pages/ForgotPasswordScreen";
import LoginScreen from "../features/auth/pages/LoginScreen";
import NotFoundScreen from "./NotFoundScreen";
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
import DailyChallenge from "../features/dashboard/pages/DailyChallenge";
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

const ScreenTimeTracker = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const location = useLocation();
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

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
          } catch (err) {}
        }
      }
    };

    window.addEventListener("screenTimeLimitChanged", handleLimitChange);

    const interval = setInterval(() => {
      if (limitMinutes >= 9999) {
        setIsLocked(false);
        setShowWarning(false);
        return;
      }
      
      const currentPath = window.location.pathname;
      const isParentOrAuthRoute = currentPath.startsWith("/parent") || currentPath.startsWith("/login") || currentPath.startsWith("/signup");

      // Child-scoped and User-scoped daily screen time key
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

        // Periodically sync screen time to MongoDB backend for accurate parent space reporting
        if (usedSeconds % 10 === 0 || usedSeconds === 1) {
          apiFetch("/api/users/sync-screen-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: todayStr, activeSeconds: usedSeconds })
          }).catch(() => {});
        }
      }
      
      const usedMinutes = usedSeconds / 60;
      const remaining = limitMinutes - usedMinutes;
      
      if (remaining <= 0 && !isParentOrAuthRoute) {
        setIsLocked(true);
        setShowWarning(false);
      } else if (remaining <= 5 && remaining > 0 && !isParentOrAuthRoute) {
        setIsLocked(false);
        setMinutesLeft(Math.ceil(remaining));
        setShowWarning(true);
      } else {
        setIsLocked(false);
        setShowWarning(false);
      }
      
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("screenTimeLimitChanged", handleLimitChange);
    };
  }, []);

  const isParentRoute = location.pathname.startsWith('/parent');

  if (isLocked && !isParentRoute) {
    return (
      <div className="fixed inset-0 bg-[#f7f9fb]/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-[#141779] border border-[#1f239c] rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(20,23,121,0.3)] flex flex-col items-center relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          {/* Clock Icon Header */}
          <div className="relative mb-4 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-xs">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-lg sm:text-xl">⏳</span>
          </div>

          {/* Badge */}
          <span className="px-3.5 py-1 bg-amber-400 text-[#141779] font-black text-[11px] rounded-full uppercase tracking-wider mb-3 shadow-sm z-10">
            Daily Screen Time Limit 🏆
          </span>

          {/* Title */}
          <h1 className="text-white text-xl sm:text-2xl font-black mb-2 tracking-tight z-10">
            Time's Up for Today!
          </h1>

          {/* Description */}
          <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed mb-5 font-medium z-10">
            You've completed your daily learning goal. Great job practicing today! Login as parent to unlock or switch child.
          </p>

          <div className="w-full flex flex-col gap-2.5 z-10">
            <button 
              onClick={() => window.location.href = '/parent/gate'} 
              className="w-full bg-gradient-to-r from-[#007168] to-[#004e48] text-white py-3 rounded-2xl font-extrabold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15"
            >
              <span>👨‍👩‍👦 Enter Parent PIN</span>
            </button>

            <button 
              onClick={() => setShowSwitcherModal(true)} 
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-2xl font-extrabold transition-all text-xs flex items-center justify-center gap-2 border border-white/15"
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

  if (showWarning && !isParentRoute) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.4)] z-[9999] flex items-center gap-3 animate-bounce border-2 border-white/30 backdrop-blur-md">
        <Clock className="w-5 h-5 text-amber-100 animate-spin" />
        <span className="font-extrabold text-sm tracking-wide">
          Only {minutesLeft} {minutesLeft === 1 ? 'minute' : 'minutes'} left for today! ⏳
        </span>
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

  return (
    <BrowserRouter>
      <AuthHandler />
      <ScreenTimeTracker />
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
            <Route path="/daily-challenge" element={<DailyChallenge />} />
            <Route path="/parent" element={<ParentalGateScreen />} />
            <Route path="/parent/gate" element={<ParentalGateScreen />} />
            <Route path="/parent/dashboard" element={<ParentDashboardScreen />} />
            <Route path="/parent/reports" element={<ParentReportScreen />} />
            <Route path="/parent/daily-tip" element={<ParentDailyTipScreen />} />
            <Route path="/parent/challenges" element={<ParentChallengesScreen />} />
            <Route path="/parent/achievements" element={<ParentAchievementsScreen />} />
            <Route path="/parent/lessons" element={<ParentLessonsScreen />} />
            <Route path="/parent/learning-library" element={<ParentLearningLibraryScreen />} />
            <Route path="/parent/lessons/player" element={<ParentLessonPlayerScreen />} />
            <Route path="/parent/roadmap" element={<ParentRoadmapScreen />} />
            <Route path="/parent/kids-activity" element={<KidsActivityScreen />} />
            <Route path="/parent/settings" element={<ParentSettings />} />
            <Route path="/parent/subscription" element={<ParentSubscriptionScreen />} />
            <Route path="/parent/learning-dna" element={<ParentLearningDNAScreen />} />
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
          
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
