import { useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { Home, BarChart2, BookOpen, TrendingUp, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, Suspense } from "react";
import { startNavigationProgress } from "../../components/NavigationProgressBar";
import RouteSkeletonLoader from "../../components/RouteSkeletonLoader";

// Dynamic prefetchers for Parent Portal routes
const parentRoutePreloaders: Record<string, () => Promise<any>> = {
  "/parent/dashboard": () => import("../../features/dashboard/pages/ParentDashboardScreen"),
  "/parent/reports": () => import("../../features/dashboard/pages/ParentReportScreen"),
  "/parent/lessons": () => import("../../features/dashboard/pages/ParentLessonsScreen"),
  "/parent/roadmap": () => import("../../features/dashboard/pages/ParentRoadmapScreen"),
  "/parent/settings": () => import("../../features/dashboard/pages/ParentSettings"),
};

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const isPinVerified = sessionStorage.getItem("parentPinVerified") === "true";

  // Optimistic active path tracking
  const [activePath, setActivePath] = useState(currentPath);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Proactively prefetch Parent route modules during idle time
  useEffect(() => {
    const timer = setTimeout(() => {
      Object.values(parentRoutePreloaders).forEach((loader) => {
        try { loader(); } catch (e) {}
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isPinVerified && !currentPath.startsWith("/parent/gate") && currentPath !== "/parent") {
    const returnTo = encodeURIComponent(currentPath + location.search);
    return <Navigate to={`/parent/gate?returnTo=${returnTo}`} replace />;
  }

  const navItems = [
    { path: "/parent/dashboard", label: t('dashboard', 'Dashboard'), icon: Home },
    { path: "/parent/reports", label: t('reports', 'Reports'), icon: BarChart2 },
    { path: "/parent/lessons", label: t('academy', 'Academy'), icon: BookOpen },
    { path: "/parent/roadmap", label: t('roadmap', 'Roadmap'), icon: TrendingUp },
    { path: "/parent/settings", label: t('settings', 'Settings'), icon: Settings },
  ];

  const isLessonPlayer = currentPath.startsWith("/parent/lessons/player");

  const preloadRoute = (path: string) => {
    const loader = parentRoutePreloaders[path];
    if (loader) {
      try { loader(); } catch (e) {}
    }
  };

  const handleTabClick = (path: string) => {
    if (activePath === path && location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 1. Instant optimistic tab state update (0ms immediate feedback)
    setActivePath(path);

    // 2. Trigger top glowing progress bar immediately
    startNavigationProgress();

    // 3. Instant synchronous route change (no waiting for background transitions)
    navigate(path);
  };

  const activeIndex = navItems.findIndex((item) => {
    if (item.path === "/parent/dashboard") {
      const subpages = [
        "/parent/achievements",
        "/parent/challenges",
        "/parent/daily-tip",
        "/parent/kids-activity",
        "/parent/learning-dna"
      ];
      return activePath === "/parent/dashboard" || subpages.some(p => activePath.startsWith(p));
    } else if (item.path === "/parent/lessons") {
      return activePath.startsWith("/parent/lessons") || activePath.startsWith("/parent/learning-library");
    } else {
      return activePath === item.path || activePath.startsWith(item.path);
    }
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Content wrapper with Isolated Suspense boundary to prevent navbar unmounting */}
      <div className="flex-1 pb-24 relative">
        <Suspense fallback={<RouteSkeletonLoader />}>
          <Outlet />
        </Suspense>
      </div>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      {!isLessonPlayer && (
        <nav className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-50 p-1.5 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_12px_40px_rgba(20,23,121,0.14)]">
          <div className="relative flex items-center justify-between w-full">
            {/* Pure horizontal sliding active capsule pill */}
            {activeIndex >= 0 && (
              <div
                style={{
                  width: `${100 / navItems.length}%`,
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-b from-[#141779] to-[#2d328f] rounded-xl shadow-md shadow-[#141779]/30 border border-white/20 z-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              />
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              
              let isActive = false;
              if (item.path === "/parent/dashboard") {
                const subpages = [
                  "/parent/achievements",
                  "/parent/challenges",
                  "/parent/daily-tip",
                  "/parent/kids-activity",
                  "/parent/learning-dna"
                ];
                isActive = activePath === "/parent/dashboard" || subpages.some(p => activePath.startsWith(p));
              } else if (item.path === "/parent/lessons") {
                isActive = activePath.startsWith("/parent/lessons") || activePath.startsWith("/parent/learning-library");
              } else {
                isActive = activePath === item.path || activePath.startsWith(item.path);
              }

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleTabClick(item.path)}
                  onMouseEnter={() => preloadRoute(item.path)}
                  onPointerDown={() => preloadRoute(item.path)}
                  className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 gap-1 rounded-xl select-none touch-none focus:outline-none transition-colors z-10"
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`shrink-0 transition-colors duration-150 ${
                      isActive ? "text-white" : "text-[#5c5f73]"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs tracking-tight whitespace-nowrap leading-none transition-colors duration-150 ${
                      isActive ? "text-white font-black" : "text-[#5c5f73] font-bold"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
