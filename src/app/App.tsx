import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";
const Layout = lazy(() => import("./components/Layout"));
const ParentLayout = lazy(() => import("./components/ParentLayout"));
const AnimatedStackContainer = lazy(() => import("./components/AnimatedStackContainer"));
const ScreenTimeTracker = lazy(() => import("./components/ScreenTimeTracker"));

// Auth feature pages (Lazy loaded)
const SplashScreen = lazy(() => import("../features/auth/pages/SplashScreen"));
const ForgotPasswordScreen = lazy(() => import("../features/auth/pages/ForgotPasswordScreen"));
const LoginScreen = lazy(() => import("../features/auth/pages/LoginScreen"));
const NotFoundScreen = lazy(() => import("./NotFoundScreen"));
import { UniversalErrorBoundary } from "../components/UniversalErrorBoundary";
import NavigationProgressBar from "../components/NavigationProgressBar";
import MobileBackHandler from "../components/MobileBackHandler";
const ParentalGateScreen = lazy(() => import("../features/auth/pages/ParentalGateScreen"));
const SignupStep1Screen = lazy(() => import("../features/auth/pages/SignupStep1"));
const SignupStep2Screen = lazy(() => import("../features/auth/pages/SignupStep2"));
const SignupStep3Screen = lazy(() => import("../features/auth/pages/SignupStep3"));

// Users feature pages (Lazy loaded)
const EditProfileScreen = lazy(() => import("../features/users/pages/EditProfileScreen"));
const HelpCenterScreen = lazy(() => import("../features/users/pages/HelpCenterScreen"));
const ProfileScreen = lazy(() => import("../features/users/pages/ProfileScreen"));

// Dashboard feature pages (Lazy loaded)
const AssessmentSummary = lazy(() => import("../features/dashboard/pages/AssessmentSummary"));
const ChapterQuestionsScreen = lazy(() => import("../features/dashboard/pages/ChapterQuestionsScreen"));
const ChaptersScreen = lazy(() => import("../features/dashboard/pages/ChaptersScreen"));
const ChatScreen = lazy(() => import("../features/dashboard/pages/ChatScreen"));
const EvolutionScreen = lazy(() => import("../features/dashboard/pages/EvolutionScreen"));
const HabitsScreen = lazy(() => import("../features/dashboard/pages/HabitsScreen"));
const HomeScreen = lazy(() => import("../features/dashboard/pages/HomeScreen"));
const NeuroPlayScreen = lazy(() => import("../features/dashboard/pages/NeuroPlayScreen"));
const InventoryScreen = lazy(() => import("../features/dashboard/pages/InventoryScreen"));
const JourneyMapScreen = lazy(() => import("../features/dashboard/pages/JourneyMapScreen"));
const NotificationsScreen = lazy(() => import("../features/dashboard/pages/NotificationsScreen"));
const ParentAchievementsScreen = lazy(() => import("../features/dashboard/pages/ParentAchievementsScreen"));
const ParentChallengesScreen = lazy(() => import("../features/dashboard/pages/ParentChallengesScreen"));
const ParentDailyTipScreen = lazy(() => import("../features/dashboard/pages/ParentDailyTipScreen"));
const ParentDashboardScreen = lazy(() => import("../features/dashboard/pages/ParentDashboardScreen"));
const ParentReportScreen = lazy(() => import("../features/dashboard/pages/ParentReportScreen"));
const ParentLearningDNAScreen = lazy(() => import("../features/dashboard/pages/ParentLearningDNAScreen"));
const ParentLearningLibraryScreen = lazy(() => import("../features/dashboard/pages/ParentLearningLibraryScreen"));
const ParentLessonPlayerScreen = lazy(() => import("../features/dashboard/pages/ParentLessonPlayerScreen"));
const ParentLessonsScreen = lazy(() => import("../features/dashboard/pages/ParentLessonsScreen"));
const ParentRoadmapScreen = lazy(() => import("../features/dashboard/pages/ParentRoadmapScreen"));
const ParentSettings = lazy(() => import("../features/dashboard/pages/ParentSettings"));
const ParentSubscriptionScreen = lazy(() => import("../features/dashboard/pages/ParentSubscriptionScreen"));
const ProgressScreen = lazy(() => import("../features/dashboard/pages/ProgressScreen"));
const RecapScreen = lazy(() => import("../features/dashboard/pages/RecapScreen"));
const DailyRewardsScreen = lazy(() => import("../features/dashboard/pages/DailyRewardsScreen"));
const RewardScreen = lazy(() => import("../features/dashboard/pages/RewardScreen"));
const ScanAndLearn = lazy(() => import("../features/dashboard/pages/ScanAndLearn"));
const ScanHistory = lazy(() => import("../features/dashboard/pages/ScanHistory"));
const KidsActivityScreen = lazy(() => import("../features/dashboard/pages/KidsActivityScreen"));
const WeeklyTestScreen = lazy(() => import("../features/dashboard/pages/WeeklyTest"));
const WeeklyTestQuestionsScreen = lazy(() => import("../features/dashboard/pages/WeeklyTestQuestions"));
const WeeklyTestResultsScreen = lazy(() => import("../features/dashboard/pages/WeeklyTestResults"));
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

const GlobalNotificationBanner = lazy(() => import("../components/GlobalNotificationBanner"));

const StackLayout = () => {
  const location = useLocation();
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const isCoParent = Boolean(
    currentUser?.isSecondaryParent ||
    currentUser?.isCoParent ||
    currentUser?.role === "co_parent" ||
    currentUser?.role === "secondary_parent" ||
    currentUser?.primary_parent_id
  );

  // Strict isolation: Co-parent cannot access student stack routes
  if (isCoParent && !location.pathname.startsWith("/parent")) {
    const isPinVerified = sessionStorage.getItem("parentPinVerified") === "true";
    return <Navigate to={isPinVerified ? "/parent/dashboard" : "/parent/gate"} replace />;
  }

  return (
    <div className="w-full h-[100dvh] overflow-hidden">
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#141779]"></div></div>}>
        <AnimatedStackContainer />
      </Suspense>
    </div>
  );
};

const RootRedirect = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash") === "true";
    return <Navigate to={hasSeenSplash ? "/login" : "/splash"} replace />;
  }

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const isCoParent = Boolean(
    currentUser?.isSecondaryParent ||
    currentUser?.isCoParent ||
    currentUser?.role === "co_parent" ||
    currentUser?.role === "secondary_parent" ||
    currentUser?.primary_parent_id
  );

  const isPinVerified = sessionStorage.getItem("parentPinVerified") === "true";
  return <Navigate to={isCoParent ? (isPinVerified ? "/parent/dashboard" : "/parent/gate") : "/home"} replace />;
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
    if (location.pathname.startsWith("/parent")) {
      sessionStorage.setItem("last_active_portal", "parent");
    } else {
      sessionStorage.removeItem("parentPinVerified");
      sessionStorage.setItem("last_active_portal", "child");
    }
  }, [location.pathname]);
  return null;
}

  return (
    <BrowserRouter>
      <MobileBackHandler />
      <NavigationProgressBar />
      <PinGuard />
      <ScrollToTop />
      <AuthHandler />
      <Suspense fallback={null}>
        <ScreenTimeTracker />
      </Suspense>
      <Suspense fallback={null}>
        <GlobalNotificationBanner />
      </Suspense>
      <UniversalErrorBoundary>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#141779]"></div></div>}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            
            {/* Public Routes */}
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/welcome" element={<SplashScreen />} />
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

              {/* Parental Gate Screens (Dedicated Protected Routes outside StackLayout and ParentLayout) */}
              <Route path="/parent" element={<ParentalGateScreen />} />
              <Route path="/parent/gate" element={<ParentalGateScreen />} />

              {/* Sub-routes with Native Stack Card Slide */}
              <Route element={<StackLayout />}>
                <Route path="/edit-profile" element={<EditProfileScreen />} />
                <Route path="/assessment-summary" element={<AssessmentSummary />} />
                <Route path="/scan-and-learn" element={<ScanAndLearn />} />
                <Route path="/chapter-reader" element={<ChapterReaderScreen />} />
                <Route path="/chapter-questions" element={<ChapterQuestionsScreen />} />
                <Route path="/practice/inventory" element={<InventoryScreen />} />
                <Route path="/practice/journey-map" element={<JourneyMapScreen />} />
                <Route path="/practice/collections" element={<InventoryScreen />} />
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
                <Route path="/boss-battle" element={<Navigate to="/practice/chapters" replace />} />
                <Route path="/multiplayer-hub" element={<MultiplayerHubScreen />} />
                <Route path="/multiplayer-room/:roomId" element={<MultiplayerRoomScreen />} />
                <Route path="/multiplayer-battle/:roomId" element={<MultiplayerBattleScreen />} />
                <Route path="/textbook/subjects" element={<TextbookSubjectsScreen />} />
                <Route path="/textbook/chapters" element={<TextbookChaptersScreen />} />
                <Route path="/textbook/reader" element={<ChapterReaderScreen />} />
                <Route path="/mission-roadmap" element={<MissionMapScreen />} />
                <Route path="/mission-play" element={<MissionPlayScreen />} />
                <Route path="/neuro-play" element={<NeuroPlayScreen />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Suspense>
      </UniversalErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
