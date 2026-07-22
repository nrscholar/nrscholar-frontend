import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";

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
          limitMinutes = json.data.parentControls.screenTimeMinutes;
        }
      } catch (e) {
        console.error("Failed to fetch screen time limit", e);
      }
    };

    fetchLimit();

    const handleLimitChange = () => {
      fetchLimit();
    };

    window.addEventListener("screenTimeLimitChanged", handleLimitChange);

    const todayStr = new Date().toISOString().split("T")[0];
    const storageKey = `screenTime_${todayStr}`;
    
    const interval = setInterval(() => {
      if (limitMinutes <= 0 || limitMinutes >= 9999) {
        setIsLocked(false);
        setShowWarning(false);
        return;
      }
      
      const isParent = locationRef.current.startsWith('/parent');
      
      // Only increment time if NOT on a parent route
      let usedSeconds = parseInt(localStorage.getItem(storageKey) || "0", 10);
      if (!isParent) {
        usedSeconds += 1;
        localStorage.setItem(storageKey, usedSeconds.toString());
      }
      
      const usedMinutes = usedSeconds / 60;
      const remaining = limitMinutes - usedMinutes;
      
      if (remaining <= 0) {
        setIsLocked(true);
        setShowWarning(false);
      } else if (remaining <= 5 && remaining > 0) {
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

  if (isLocked) {
    if (!isParentRoute) {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <span className="material-symbols-outlined text-red-500 text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>timer_off</span>
          </div>
          <h1 className="text-white text-3xl font-black mb-3 font-display">Time's Up!</h1>
          <p className="text-gray-300 text-lg max-w-md font-medium mb-2">You've reached your screen time limit for today.</p>
          <p className="text-gray-400 text-sm max-w-md font-medium">To unlock or extend learning time, login as parent below.</p>
          <button 
            onClick={() => window.location.href = '/parent/gate'} 
            className="mt-8 bg-gradient-to-r from-[#006a62] to-[#009b8f] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-base flex items-center gap-2"
          >
            👨‍👩‍👦 Login as Parent
          </button>
        </div>
      );
    }
  }

  if (showWarning && !isParentRoute) {
    return (
      <div className="fixed top-2 left-2 bg-red-600 text-white px-3 py-1.5 rounded-md shadow-md z-[9999] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>timer</span>
        <span className="font-bold text-[10px] tracking-wide">only {minutesLeft} {minutesLeft === 1 ? 'minute' : 'minutes'} left</span>
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
          </Route>
          
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
