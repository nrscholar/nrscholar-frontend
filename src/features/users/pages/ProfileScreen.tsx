import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Coins, Flame, Users, HelpCircle, LogOut, Gift, ChevronRight, Trophy, GraduationCap, Cake, BookOpen, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch, clearAuthSession } from "../../../api";
import { useTranslation } from "react-i18next";

// Math-aligned level thresholds matching backend
function getLevelInfo(xp: number) {
  if (xp < 100) {
    return { level: 1, percent: Math.round((xp / 100) * 100), nextXp: 100, currentXp: 0 };
  }
  if (xp < 250) {
    return { level: 2, percent: Math.round(((xp - 100) / 150) * 100), nextXp: 250, currentXp: 100 };
  }
  
  let lvl = 3;
  while (true) {
    const currentThreshold = Math.floor(250 * Math.pow(1.5, lvl - 3));
    const nextThreshold = Math.floor(250 * Math.pow(1.5, (lvl + 1) - 3));
    if (xp >= nextThreshold) {
      lvl++;
    } else {
      const range = nextThreshold - currentThreshold;
      const progress = xp - currentThreshold;
      const percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
      return { level: lvl, percent, nextXp: nextThreshold, currentXp: currentThreshold };
    }
  }
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await apiFetch("/api/users/me", {});
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          localStorage.setItem("userData", JSON.stringify(data.data.user));
        }
      } catch (e) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [navigate]);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          setUnreadCount(json.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
    };
    fetchNotifications();
  }, []);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await apiFetch("/api/users/logout", { method: "POST" });
    } catch (e) {}
    clearAuthSession();
    navigate("/login");
  };

  const xp = user.xp || 0;
  const streakDays = user.streakDays || 0;
  const coins = user.coins || 0;
  const badges = user.badges || [];
  const levelInfo = getLevelInfo(xp);
  const userLevel = user.level || levelInfo.level;
  const xpNeeded = Math.max(0, levelInfo.nextXp - xp);

  const hasMathAce = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("math") : b?.name?.toLowerCase().includes("math"));
  const isStreakUnlocked = streakDays >= 3 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("streak") : b?.name?.toLowerCase().includes("streak"));
  const hasScienceProdigy = badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("science") : b?.name?.toLowerCase().includes("science"));
  const hasArenaMaster = userLevel >= 5 || badges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("arena") : b?.name?.toLowerCase().includes("arena"));

  const currentLang = (i18n?.language || localStorage.getItem('i18nextLng') || 'en').slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 font-sans pb-28 max-w-lg mx-auto relative overflow-x-hidden selection:bg-[#141779] selection:text-white">
      
      {/* TOP APP BAR (Sticky Standard Header - 100% Unified) */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
            {user.childPhoto ? (
              <img src={user.childPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#141779] text-white font-bold text-xs flex items-center justify-center">
                {user.childName ? user.childName.slice(0, 2).toUpperCase() : "NR"}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">{user.childName || user.name || "Explorer"}</h1>
              <span className="text-[10px] text-[#141779] bg-indigo-50/80 font-bold px-2 py-0.5 rounded-full border border-indigo-100/60 shrink-0">
                {user.childClass || t('class_10', { defaultValue: "Class 10" })}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
              {t('explorer_level', { defaultValue: "Explorer Level" })} {userLevel}
            </span>
          </div>
        </div>

        {/* Top Header Currency & Streak Stats */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => navigate("/home")}
            className="bg-orange-50/80 border border-orange-100 rounded-xl px-2.5 py-1 flex items-center gap-1 hover:bg-orange-100/60 active:scale-95 transition-all shadow-2xs"
          >
            <span className="text-xs font-bold text-orange-600">🔥 {streakDays || 0}</span>
          </button>
          <button
            onClick={() => navigate("/practice/inventory")}
            className="bg-amber-50/80 border border-amber-100 rounded-xl px-2.5 py-1 flex items-center gap-1 hover:bg-amber-100/60 active:scale-95 transition-all shadow-2xs"
          >
            <span className="text-xs font-bold text-amber-700">🪙 {coins || 0}</span>
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shrink-0 relative"
          >
            <Bell size={17} className="text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 pt-3 flex flex-col gap-3.5 relative z-10">
        
        {/* 1. FLAGSHIP PLAYER HERO CARD (Micro-Polished Layout) */}
        <section className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs relative overflow-hidden flex flex-col gap-3.5">
          {/* Top Integrated Row: Left Avatar & Level Rank + Right Details */}
          <div className="flex items-center gap-3.5">
            {/* Left: Avatar & Rank Badge Stack */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl border border-indigo-100/90 p-0.5 bg-white shadow-[0_4px_12px_rgba(20,23,121,0.08)] overflow-hidden flex items-center justify-center">
                {user.childPhoto ? (
                  <img src={user.childPhoto} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.childName || "Kid")}&background=141779&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
              {/* Level Rank Tag Pill (10-15% Lighter Indigo #2d328f for Visual Contrast) */}
              <div className="absolute -bottom-2 bg-[#2d328f] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-white/30 shrink-0 whitespace-nowrap">
                <Zap size={10} className="text-amber-300 fill-amber-300" />
                <span className="text-[10px] font-bold tracking-wider uppercase">LVL {userLevel}</span>
              </div>
            </div>

            {/* Right: Info Details Column (Perfect Visual Alignment with Avatar Box) */}
            <div className="flex-1 min-w-0 h-20 flex flex-col justify-between pt-1 pb-0.5">
              {/* Line 1: Perfectly Aligned Name */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
                {user.childName || "Young Explorer"}
              </h2>

              {/* Line 2: Middle Aligned Subtitle */}
              <p className="text-[11px] sm:text-xs font-semibold text-[#141779]/80 leading-tight truncate">
                {t('explorer_extraordinaire') || "Explorer Extraordinaire"}
              </p>

              {/* Line 3: Bottom Aligned Chips Row */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap overflow-x-auto no-scrollbar">
                {(user.childClass || user.activeChild?.childClass) && (
                  <span className="h-5.5 bg-slate-50 text-slate-700 border border-slate-200/70 text-[10px] font-medium px-2 rounded-md inline-flex items-center gap-1 shadow-2xs whitespace-nowrap shrink-0">
                    <GraduationCap size={11} className="text-[#141779] shrink-0" />
                    {t((user.childClass || user.activeChild?.childClass || 'class_1').toLowerCase().replace(/ /g, '_'), { defaultValue: user.childClass || user.activeChild?.childClass })}
                  </span>
                )}
                {(user.childAge || user.activeChild?.childAge) && (
                  <span className="h-5.5 bg-slate-50 text-slate-700 border border-slate-200/70 text-[10px] font-medium px-2 rounded-md inline-flex items-center gap-1 shadow-2xs whitespace-nowrap shrink-0">
                    <Cake size={11} className="text-amber-600 shrink-0" />
                    {user.childAge || user.activeChild?.childAge} {t('years_old', 'Years Old')}
                  </span>
                )}
                {(user.childBoard || user.activeChild?.childBoard) && (
                  <span className="h-5.5 bg-slate-50 text-slate-700 border border-slate-200/70 text-[10px] font-medium px-2 rounded-md inline-flex items-center gap-1 shadow-2xs whitespace-nowrap shrink-0">
                    <BookOpen size={11} className="text-teal-600 shrink-0" />
                    {user.childBoard || user.activeChild?.childBoard}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* XP Progress Bar Base Section */}
          <div className="w-full pt-3.5 border-t border-slate-100/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                {t('level_progress_title', { level: userLevel, defaultValue: `LEVEL ${userLevel} PROGRESS` })}
              </span>
              <span className="text-xs font-bold text-[#141779]">{xp.toLocaleString()} XP</span>
            </div>
            {/* 3px Height Track Fill */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-2xs">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#141779] to-[#57fae9] rounded-full shadow-2xs"
              />
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-1.5 text-right tracking-tight">
              {xpNeeded > 0 ? t('xp_to_next_level', { xp: xpNeeded.toLocaleString(), nextLevel: userLevel + 1, defaultValue: `${xpNeeded.toLocaleString()} XP to Level ${userLevel + 1}` }) : t('max_level_reached', 'Max Level Reached!')}
            </p>
          </div>
        </section>

        {/* 2. GAME STATS ROW */}
        <section className="grid grid-cols-3 gap-2.5">
          {/* Points */}
          <div className="bg-white border border-slate-100 hover:border-slate-200 transition-all rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#141779] flex items-center justify-center mb-1.5 border border-indigo-100/50">
              <Zap size={18} className="fill-[#141779]" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">{xp.toLocaleString()}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{t('points', 'POINTS')}</span>
          </div>

          {/* Coins */}
          <div className="bg-white border border-slate-100 hover:border-slate-200 transition-all rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 border border-amber-100/50">
              <Coins size={18} />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">{coins.toLocaleString()}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{t('coins', 'COINS')}</span>
          </div>

          {/* Streak */}
          <div className="bg-white border border-slate-100 hover:border-slate-200 transition-all rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-1.5 border border-orange-100/50">
              <Flame size={18} className="fill-orange-500" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">{streakDays}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{t('streak', 'STREAK')}</span>
          </div>
        </section>

        {/* 3. FEATURE SHORTCUTS */}
        <section className="flex flex-col gap-2.5">
          {/* My Collection Shortcut */}
          <button 
            onClick={() => navigate("/practice/inventory")}
            className="w-full bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-100/60 flex items-center justify-center shrink-0">
                <Gift size={18} />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('my_collections', 'MY COLLECTION')}</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{t('collection_subtitle', 'Boxes • Dragons • Badges • Vault')}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Learning Journey Shortcut */}
          <button 
            onClick={() => navigate("/practice/journey-map")}
            className="w-full bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#141779] border border-indigo-100/60 flex items-center justify-center shrink-0">
                <Trophy size={18} />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('learning_journey', 'LEARNING JOURNEY')}</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{t('learning_journey_subtitle', 'Continue your chapter adventure')}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </section>

        {/* 4. ACHIEVEMENTS PREVIEW */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              {t('achievements', 'ACHIEVEMENTS')}
            </span>
            <button 
              onClick={() => navigate("/practice/inventory")}
              className="text-xs font-bold text-[#141779] hover:underline"
            >
              {t('view_all', 'View All →')}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className={`bg-white border rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all ${hasMathAce ? 'border-slate-100' : 'border-slate-100 opacity-45'}`}>
              <span className="text-lg mb-0.5">🏆</span>
              <span className="text-[10px] font-semibold text-slate-800 truncate w-full">{t('math_ace', 'Math Ace')}</span>
            </div>
            <div className={`bg-white border rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all ${isStreakUnlocked ? 'border-slate-100' : 'border-slate-100 opacity-45'}`}>
              <span className="text-lg mb-0.5">🔥</span>
              <span className="text-[10px] font-semibold text-slate-800 truncate w-full">{t('streak', 'Streak')}</span>
            </div>
            <div className={`bg-white border rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all ${hasScienceProdigy ? 'border-slate-100' : 'border-slate-100 opacity-45'}`}>
              <span className="text-lg mb-0.5">⚛️</span>
              <span className="text-[10px] font-semibold text-slate-800 truncate w-full">{t('science', 'Science')}</span>
            </div>
            <div className={`bg-white border rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs transition-all ${hasArenaMaster ? 'border-slate-100' : 'border-slate-100 opacity-45'}`}>
              <span className="text-lg mb-0.5">🛡️</span>
              <span className="text-[10px] font-semibold text-slate-800 truncate w-full">{t('arena', 'Arena')}</span>
            </div>
          </div>
        </section>

        {/* 5. ACCOUNT & SETTINGS SECTION */}
        <section className="flex flex-col gap-2.5 pt-2 border-t border-slate-200/60">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {t('account_and_settings', 'ACCOUNT & SETTINGS')}
          </span>

          {/* Parental Controls */}
          <button 
            onClick={() => navigate("/parent")}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              {user.parentPhoto ? (
                <div className="w-7 h-7 rounded-full border border-slate-200 overflow-hidden shrink-0">
                  <img src={user.parentPhoto} alt="Parent" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Users size={15} />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900">{t('parental_controls', 'Parental Controls')}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Help Center */}
          <button 
            onClick={() => navigate("/help")}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <HelpCircle size={15} />
              </div>
              <span className="text-xs font-bold text-slate-900">{t('help_center', 'Help Center')}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* App Display Language Segmented Selector */}
          <div className="bg-white rounded-2xl p-3 flex flex-col gap-2 border border-slate-100 shadow-xs">
            <span className="text-xs font-bold text-slate-900">{t('app_language', 'App Display Language')}</span>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'en'); i18n?.changeLanguage('en'); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${currentLang === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                English
              </button>
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'hi'); i18n?.changeLanguage('hi'); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${currentLang === 'hi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'gu'); i18n?.changeLanguage('gu'); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${currentLang === 'gu' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>

          {/* Logout Device Button */}
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-100 hover:border-red-100 hover:bg-red-50/30 transition-all shadow-xs group mt-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/60">
                <LogOut size={15} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-red-600 block">{t('logout_device', 'Logout Device')}</span>
                <span className="text-[10px] font-medium text-slate-400 block">{t('logout_subtitle', 'Sign out from this device')}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-red-400 transition-colors" />
          </button>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
              <LogOut size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{t('logout_device', 'Logout Device')}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {t('logout_confirm_msg', 'Are you sure you want to log out from this device? You will need your credentials to sign back in.')}
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                {t('yes_logout_device', 'Yes, Logout Device')}
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                {t('cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
