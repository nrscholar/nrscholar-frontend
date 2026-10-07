import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home, MessageSquare, BookOpen, BarChart2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  // Optimistic tab tracking for 0ms lag-free tab switching
  const [activePath, setActivePath] = useState(currentPath);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { path: "/home", label: t('home', 'Home'), icon: Home },
    { path: "/chat", label: t('ai_chat_nav', 'AI Chat'), icon: MessageSquare },
    { path: "/practice/chapters", label: t('library', 'Library'), icon: BookOpen },
    { path: "/progress", label: t('progress', 'Progress'), icon: BarChart2 },
    { path: "/profile", label: t('profile', 'Profile'), icon: User },
  ];

  const handleTabClick = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  const activeIndex = navItems.findIndex(
    (item) => activePath === item.path || (item.path !== "/home" && activePath.startsWith(item.path))
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 pb-24 relative">
        <Outlet />
      </div>

      {/* Floating Bottom Glassmorphic Navigation Bar with Horizontal Spring Pill */}
      <nav className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-50 p-1.5 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_12px_40px_rgba(20,23,121,0.12)]">
        <div className="relative flex items-center justify-between w-full">
          {/* Pure horizontal sliding active capsule pill (strictly horizontal within footer bar) */}
          {activeIndex >= 0 && (
            <motion.div
              initial={false}
              animate={{
                x: `${activeIndex * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.85 }}
              style={{ width: `${100 / navItems.length}%` }}
              className="absolute top-0 bottom-0 left-0 bg-[#1c1970] rounded-xl shadow-md shadow-[#1c1970]/30 z-0 will-change-transform"
            />
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path || (item.path !== "/home" && activePath.startsWith(item.path));

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleTabClick(item.path)}
                className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 gap-1 rounded-xl select-none touch-none focus:outline-none transition-colors z-10"
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 transition-colors duration-150 ${
                    isActive ? "text-white" : "text-[#787a91]"
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight whitespace-nowrap leading-none transition-colors duration-150 ${
                    isActive ? "text-white font-bold" : "text-[#787a91] font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
