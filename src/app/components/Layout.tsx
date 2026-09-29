import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home, MessageSquare, BookOpen, BarChart2, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const navigate = useNavigate();
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-2.5 bg-white/90 backdrop-blur-2xl border-t-2 border-slate-200/90 rounded-t-[28px] shadow-[0_-12px_40px_rgba(20,23,121,0.14)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== "/home" && currentPath.startsWith(item.path));

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
    </div>
  );
}
