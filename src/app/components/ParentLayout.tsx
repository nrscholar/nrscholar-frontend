import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, BarChart2, BookOpen, TrendingUp, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ParentLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const navItems = [
    { path: "/parent/dashboard", label: t('dashboard', 'Dashboard'), icon: Home },
    { path: "/parent/reports", label: t('reports', 'Reports'), icon: BarChart2 },
    { path: "/parent/lessons", label: t('academy', 'Academy'), icon: BookOpen },
    { path: "/parent/roadmap", label: t('roadmap', 'Roadmap'), icon: TrendingUp },
    { path: "/parent/settings", label: t('settings', 'Settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Content wrapper */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-[rgba(247,249,251,0.65)] backdrop-blur-lg border-t-[1.5px] border-[rgba(255,255,255,0.4)] rounded-t-[24px] shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Match active route: exactly or starting with (e.g. /parent/learning-library highlights Academy)
          let isActive = false;
          if (item.path === "/parent/dashboard") {
            // Dashboard is active for /parent/dashboard and related dashboard child routes that don't have separate tabs (like achievements, daily-tip, challenges, kids-activity, learning-dna)
            const subpages = [
              "/parent/achievements",
              "/parent/challenges",
              "/parent/daily-tip",
              "/parent/kids-activity",
              "/parent/learning-dna"
            ];
            isActive = currentPath === "/parent/dashboard" || subpages.some(p => currentPath.startsWith(p));
          } else if (item.path === "/parent/lessons") {
            // Academy tab remains active when on parent lessons, learning library, etc.
            isActive = currentPath.startsWith("/parent/lessons") || currentPath.startsWith("/parent/learning-library");
          } else {
            isActive = currentPath === item.path || currentPath.startsWith(item.path);
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 h-[56px] min-w-[64px] px-2 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-[#57fae9] text-[#007168] shadow-sm scale-105"
                  : "text-[#464652] hover:text-[#007168]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              <span className="text-[10px] font-bold tracking-wide whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
