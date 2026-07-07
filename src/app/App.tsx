import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
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
import ChapterLevelsScreen from "../features/dashboard/pages/ChapterLevelsScreen";
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
import ParentLearningDNAScreen from "../features/dashboard/pages/ParentLearningDNAScreen";
import ParentLearningLibraryScreen from "../features/dashboard/pages/ParentLearningLibraryScreen";
import ParentLessonPlayerScreen from "../features/dashboard/pages/ParentLessonPlayerScreen";
import ParentLessonsScreen from "../features/dashboard/pages/ParentLessonsScreen";
import ParentRoadmapScreen from "../features/dashboard/pages/ParentRoadmapScreen";
import ParentSettings from "../features/dashboard/pages/ParentSettings";
import ParentSubscriptionScreen from "../features/dashboard/pages/ParentSubscriptionScreen";
import ProgressScreen from "../features/dashboard/pages/ProgressScreen";
import RecapScreen from "../features/dashboard/pages/RecapScreen";
import RewardScreen from "../features/dashboard/pages/RewardScreen";
import ScanAndLearn from "../features/dashboard/pages/ScanAndLearn";
import ScanHistory from "../features/dashboard/pages/ScanHistory";
import WeeklyTestScreen from "../features/dashboard/pages/WeeklyTest";
import WeeklyTestQuestionsScreen from "../features/dashboard/pages/WeeklyTestQuestions";
import WeeklyTestResultsScreen from "../features/dashboard/pages/WeeklyTestResults";
const BossBattleScreen = lazy(() => import("../features/dashboard/pages/BossBattleScreen"));
const MultiplayerHubScreen = lazy(() => import("../features/dashboard/pages/MultiplayerHubScreen"));
const MultiplayerRoomScreen = lazy(() => import("../features/dashboard/pages/MultiplayerRoomScreen"));
const MultiplayerBattleScreen = lazy(() => import("../features/dashboard/pages/MultiplayerBattleScreen"));

const AuthHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => navigate("/login", { replace: true });
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, [navigate]);
  return null;
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthHandler />
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
            <Route path="/chapter-levels" element={<ChapterLevelsScreen />} />
            <Route path="/chapter-questions" element={<ChapterQuestionsScreen />} />
            <Route path="/practice/inventory" element={<InventoryScreen />} />
            <Route path="/practice/journey-map" element={<JourneyMapScreen />} />
            <Route path="/practice/collections" element={<InventoryScreen />} />
            <Route path="/daily-challenge" element={<DailyChallenge />} />
            <Route path="/parent" element={<ParentalGateScreen />} />
            <Route path="/parent/dashboard" element={<ParentDashboardScreen />} />
            <Route path="/parent/daily-tip" element={<ParentDailyTipScreen />} />
            <Route path="/parent/challenges" element={<ParentChallengesScreen />} />
            <Route path="/parent/achievements" element={<ParentAchievementsScreen />} />
            <Route path="/parent/lessons" element={<ParentLessonsScreen />} />
            <Route path="/parent/learning-library" element={<ParentLearningLibraryScreen />} />
            <Route path="/parent/lessons/player" element={<ParentLessonPlayerScreen />} />
            <Route path="/parent/roadmap" element={<ParentRoadmapScreen />} />
            <Route path="/parent/settings" element={<ParentSettings />} />
            <Route path="/parent/subscription" element={<ParentSubscriptionScreen />} />
            <Route path="/parent/learning-dna" element={<ParentLearningDNAScreen />} />
            <Route path="/practice/reward" element={<RewardScreen />} />
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
          </Route>
          
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
