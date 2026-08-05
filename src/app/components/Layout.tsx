import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, MessageSquare, BookOpen, BarChart2, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const navItems = [
    { path: "/home", label: t('home'), icon: Home },
    { path: "/chat", label: t('ai_chat_nav'), icon: MessageSquare },
    { path: "/practice/chapters", label: t('library'), icon: BookOpen },
    { path: "/progress", label: t('progress'), icon: BarChart2 },
    { path: "/profile", label: t('profile'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Content wrapper with bottom padding to ensure content doesn't get hidden behind the floating custom tab bar */}
      <div className="flex-1 pb-24">
        <Outlet />
      </div>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-[rgba(247,249,251,0.65)] backdrop-blur-lg border-t-[1.5px] border-[rgba(255,255,255,0.4)] rounded-t-[24px] shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== "/home" && currentPath.startsWith(item.path));

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
