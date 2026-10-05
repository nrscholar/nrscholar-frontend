import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { Home, BarChart2, BookOpen, TrendingUp, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const isPinVerified = sessionStorage.getItem("parentPinVerified") === "true";
  if (!isPinVerified) {
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

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Content wrapper */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      {!isLessonPlayer && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-2.5 bg-white/90 backdrop-blur-2xl border-t-2 border-slate-200/90 rounded-t-[28px] shadow-[0_-12px_40px_rgba(20,23,121,0.14)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            // Match active route: exactly or starting with (e.g. /parent/learning-library highlights Academy)
            let isActive = false;
            if (item.path === "/parent/dashboard") {
              const subpages = [
                "/parent/achievements",
                "/parent/challenges",
                "/parent/daily-tip",
                "/parent/kids-activity",
                "/parent/learning-dna"
              ];
              isActive = currentPath === "/parent/dashboard" || subpages.some(p => currentPath.startsWith(p));
            } else if (item.path === "/parent/lessons") {
              isActive = currentPath.startsWith("/parent/lessons") || currentPath.startsWith("/parent/learning-library");
            } else {
              isActive = currentPath === item.path || currentPath.startsWith(item.path);
            }

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 h-[56px] min-w-[64px] px-2.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-b from-[#141779] to-[#2d328f] text-white shadow-lg shadow-[#141779]/30 border border-white/20 scale-105"
                    : "text-[#5c5f73] hover:text-[#141779] hover:bg-slate-100/70 active:scale-95"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className="text-[10px] font-extrabold tracking-wide whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
