import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Auth feature pages
import LoginScreen from "../features/auth/pages/LoginScreen";
import SignupStep1Screen from "../features/auth/pages/SignupStep1";
import SignupStep2Screen from "../features/auth/pages/SignupStep2";
import SignupStep3Screen from "../features/auth/pages/SignupStep3";
import ForgotPasswordScreen from "../features/auth/pages/ForgotPasswordScreen";
import ParentalGateScreen from "../features/auth/pages/ParentalGateScreen";

// Users feature pages
import ProfileScreen from "../features/users/pages/ProfileScreen";
import HelpCenterScreen from "../features/users/pages/HelpCenterScreen";
import EditProfileScreen from "../features/users/pages/EditProfileScreen";

// Dashboard feature pages
import HomeScreen from "../features/dashboard/pages/HomeScreen";
import AssessmentSummary from "../features/dashboard/pages/AssessmentSummary";
import ScanAndLearn from "../features/dashboard/pages/ScanAndLearn";
import ChaptersScreen from "../features/dashboard/pages/ChaptersScreen";
import ChapterQuestionsScreen from "../features/dashboard/pages/ChapterQuestionsScreen";
import ChapterLevelsScreen from "../features/dashboard/pages/ChapterLevelsScreen";
import DailyChallenge from "../features/dashboard/pages/DailyChallenge";
import ProgressScreen from "../features/dashboard/pages/ProgressScreen";
import ParentDashboardScreen from "../features/dashboard/pages/ParentDashboardScreen";
import ParentDailyTipScreen from "../features/dashboard/pages/ParentDailyTipScreen";
import ParentChallengesScreen from "../features/dashboard/pages/ParentChallengesScreen";
import ParentAchievementsScreen from "../features/dashboard/pages/ParentAchievementsScreen";
import ParentLessonsScreen from "../features/dashboard/pages/ParentLessonsScreen";
import ParentLearningLibraryScreen from "../features/dashboard/pages/ParentLearningLibraryScreen";
import ParentLessonPlayerScreen from "../features/dashboard/pages/ParentLessonPlayerScreen";
import ParentRoadmapScreen from "../features/dashboard/pages/ParentRoadmapScreen";
import ParentSettings from "../features/dashboard/pages/ParentSettings";
import ParentSubscriptionScreen from "../features/dashboard/pages/ParentSubscriptionScreen";
import RewardScreen from "../features/dashboard/pages/RewardScreen";
import WeeklyTestScreen from "../features/dashboard/pages/WeeklyTest";
import WeeklyTestQuestionsScreen from "../features/dashboard/pages/WeeklyTestQuestions";
import WeeklyTestResultsScreen from "../features/dashboard/pages/WeeklyTestResults";
import ScanHistory from "../features/dashboard/pages/ScanHistory";
import HabitsScreen from "../features/dashboard/pages/HabitsScreen";
import RecapScreen from "../features/dashboard/pages/RecapScreen";
import NotificationsScreen from "../features/dashboard/pages/NotificationsScreen";
import InventoryScreen from "../features/dashboard/pages/InventoryScreen";
import ChatScreen from "../features/dashboard/pages/ChatScreen";
import JourneyMapScreen from "../features/dashboard/pages/JourneyMapScreen";
import EvolutionScreen from "../features/dashboard/pages/EvolutionScreen";
import BossBattleScreen from "../features/dashboard/pages/BossBattleScreen";
import MultiplayerHubScreen from "../features/dashboard/pages/MultiplayerHubScreen";
import MultiplayerRoomScreen from "../features/dashboard/pages/MultiplayerRoomScreen";
import MultiplayerBattleScreen from "../features/dashboard/pages/MultiplayerBattleScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/practice/chapters" element={<ChaptersScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/help" element={<HelpCenterScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Route>
        
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/signup-step1" element={<SignupStep1Screen />} />
        <Route path="/signup-step2" element={<SignupStep2Screen />} />
        <Route path="/signup-step3" element={<SignupStep3Screen />} />
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
        <Route path="*" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
