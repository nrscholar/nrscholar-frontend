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

      {/* Floating Bottom Navigation Bar (Matching Screenshot Theme) */}
      <nav className="fixed bottom-2 left-4 right-4 max-w-md mx-auto z-50 flex items-center justify-between px-2 py-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== "/home" && currentPath.startsWith(item.path));

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 gap-1 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-[#1c1970] text-white shadow-md shadow-[#1c1970]/25 font-bold"
                  : "text-[#787a91] hover:text-[#1c1970] hover:bg-slate-50 active:scale-95 font-medium"
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              <span className="text-[10px] tracking-tight whitespace-nowrap leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
