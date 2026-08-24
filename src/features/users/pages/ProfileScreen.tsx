import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Coins, Flame, Users, HelpCircle, LogOut, Award, Sparkles, Rocket, Gift, ChevronRight, Trophy, ShieldCheck, Atom } from "lucide-react";
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
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [user, setUser] = useState<any>(null);

  useState(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch(e) {}
    }
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

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FB] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#17177F] border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F6FB] via-[#FAFAFF] to-[#FFFFFF] text-[#16165F] font-sans pb-28 max-w-lg mx-auto relative selection:bg-[#5B5CFF] selection:text-white overflow-x-hidden">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#5B5CFF]/10 blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#FFC83D]/15 blur-[90px]" />
      </div>

      {/* TOP APP BAR */}
      <header className="flex items-center justify-between px-4 py-3.5 bg-white/85 backdrop-blur-md border-b border-[#E0E3E5] sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="w-9 h-9 rounded-full bg-[#F5F6FB] border border-[#E0E3E5] hover:bg-[#EEF1FF] flex items-center justify-center transition-all active:scale-95 shrink-0"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-[#17177F]" />
        </button>
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#5B5CFF] animate-pulse" />
          <h1 className="text-base font-black text-[#17177F] tracking-wide uppercase">
            PLAYER PROFILE
          </h1>
        </div>
        <div className="w-9" />
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4 relative z-10">
        {/* 1. PLAYER HERO CARD */}
        <section className="bg-white border-2 border-[#E0E3E5] rounded-2xl p-4 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
          {/* Avatar Container */}
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full border-4 border-[#3FE4D5] shadow-[0_0_16px_rgba(63,228,213,0.4)] overflow-hidden bg-white flex items-center justify-center">
              {user.childPhoto ? (
                <img src={user.childPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.childName || "Kid")}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Overlapping Rank Pill */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5B5CFF] to-[#17177F] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-[#3FE4D5]/40 shrink-0 whitespace-nowrap">
              <Zap size={12} className="text-[#FFC83D]" />
              <span className="text-[10px] font-black tracking-wider uppercase">⚡ LVL {userLevel}</span>
            </div>
          </div>

          {/* Player Name & Role */}
          <h2 className="text-xl font-black text-[#17177F] tracking-tight mt-1">
            {user.childName || "Young Explorer"}
          </h2>
          <p className="text-xs font-bold text-[#777A91]">
            {t('explorer_extraordinaire') || "Explorer Extraordinaire"}
          </p>

          {/* XP Progression Bar */}
          <div className="w-full mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-[#17177F] uppercase tracking-wider">LEVEL {userLevel} PROGRESS</span>
              <span className="text-[#5B5CFF] font-black">{xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-3 bg-[#F5F6FB] rounded-full overflow-hidden p-0.5 border border-[#E0E3E5]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#5B5CFF] via-[#3FE4D5] to-[#FFC83D] rounded-full shadow-xs"
              />
            </div>
            <p className="text-[10px] font-bold text-[#777A91] mt-1 text-right">
              {xpNeeded > 0 ? `${xpNeeded} XP to Level ${userLevel + 1}` : 'Max Level Reached!'}
            </p>
          </div>
        </section>

        {/* 2. GAME STATS ROW */}
        <section className="grid grid-cols-3 gap-2.5">
          <div className="bg-white border-2 border-[#5B5CFF]/30 rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#5B5CFF]/15 flex items-center justify-center mb-1">
              <Zap size={20} className="text-[#5B5CFF]" />
            </div>
            <span className="text-lg font-black text-[#17177F]">{xp.toLocaleString()}</span>
            <span className="text-[9px] font-extrabold text-[#777A91] uppercase tracking-wider">POINTS</span>
          </div>

          <div className="bg-white border-2 border-[#FFC83D]/40 rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#FFC83D]/20 flex items-center justify-center mb-1">
              <Coins size={20} className="text-[#D97706]" />
            </div>
            <span className="text-lg font-black text-[#17177F]">{coins.toLocaleString()}</span>
            <span className="text-[9px] font-extrabold text-[#D97706] uppercase tracking-wider">COINS</span>
          </div>

          <div className="bg-white border-2 border-[#FF9D3D]/40 rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#FF9D3D]/20 flex items-center justify-center mb-1">
              <Flame size={20} className="text-[#EA580C]" />
            </div>
            <span className="text-lg font-black text-[#17177F]">{streakDays}</span>
            <span className="text-[9px] font-extrabold text-[#EA580C] uppercase tracking-wider">STREAK</span>
          </div>
        </section>

        {/* 3. GAME FEATURE SHORTCUTS */}
        <section className="flex flex-col gap-2.5">
          {/* My Collection Shortcut */}
          <button 
            onClick={() => navigate("/practice/inventory")}
            className="w-full bg-gradient-to-r from-white to-[#F5F6FB] border-2 border-[#3FE4D5]/60 hover:border-[#3FE4D5] rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3FE4D5]/20 border border-[#3FE4D5]/40 flex items-center justify-center shrink-0">
                <Gift size={20} className="text-[#0284C7]" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-black text-[#17177F] uppercase tracking-wider">MY COLLECTION</h3>
                <p className="text-[10px] font-bold text-[#777A91]">Boxes • Dragons • Badges • Vault</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#5B5CFF]" />
          </button>

          {/* Learning Journey Shortcut */}
          <button 
            onClick={() => navigate("/practice/journey-map")}
            className="w-full bg-gradient-to-r from-white to-[#EEF1FF] border-2 border-[#5B5CFF]/40 hover:border-[#5B5CFF] rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B5CFF]/15 border border-[#5B5CFF]/30 flex items-center justify-center shrink-0">
                <Rocket size={20} className="text-[#5B5CFF]" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-black text-[#17177F] uppercase tracking-wider">LEARNING JOURNEY</h3>
                <p className="text-[10px] font-bold text-[#777A91]">Continue your chapter adventure</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#5B5CFF]" />
          </button>
        </section>

        {/* 4. ACHIEVEMENTS PREVIEW */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#17177F] uppercase tracking-wider flex items-center gap-1.5">
              <Trophy size={14} className="text-[#FFC83D]" />
              🏆 ACHIEVEMENTS
            </span>
            <button 
              onClick={() => navigate("/practice/inventory")}
              className="text-[11px] font-bold text-[#5B5CFF] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className={`bg-white border rounded-xl p-2 flex flex-col items-center text-center ${hasMathAce ? 'border-[#5B5CFF]/50 shadow-xs' : 'border-gray-200 opacity-50 grayscale'}`}>
              <span className="text-lg">🏆</span>
              <span className="text-[8px] font-black text-[#17177F] mt-1 truncate w-full">Math Ace</span>
            </div>
            <div className={`bg-white border rounded-xl p-2 flex flex-col items-center text-center ${isStreakUnlocked ? 'border-[#FFC83D]/60 shadow-xs' : 'border-gray-200 opacity-50 grayscale'}`}>
              <span className="text-lg">🔥</span>
              <span className="text-[8px] font-black text-[#17177F] mt-1 truncate w-full">Streak</span>
            </div>
            <div className={`bg-white border rounded-xl p-2 flex flex-col items-center text-center ${hasScienceProdigy ? 'border-[#3FE4D5]/60 shadow-xs' : 'border-gray-200 opacity-50 grayscale'}`}>
              <span className="text-lg">⚛️</span>
              <span className="text-[8px] font-black text-[#17177F] mt-1 truncate w-full">Science</span>
            </div>
            <div className={`bg-white border rounded-xl p-2 flex flex-col items-center text-center ${hasArenaMaster ? 'border-purple-300 shadow-xs' : 'border-gray-200 opacity-50 grayscale'}`}>
              <span className="text-lg">🛡️</span>
              <span className="text-[8px] font-black text-[#17177F] mt-1 truncate w-full">Arena</span>
            </div>
          </div>
        </section>

        {/* 5. UTILITY SETTINGS SECTION */}
        <section className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
          <span className="text-xs font-black text-[#777A91] uppercase tracking-wider px-1">
            ACCOUNT & SETTINGS
          </span>

          {/* Parental Controls */}
          <button 
            onClick={() => navigate("/parent")}
            className="w-full flex items-center justify-between bg-white rounded-xl p-3 border border-[#E0E3E5] hover:border-[#17177F] transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              {user.parentPhoto ? (
                <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0">
                  <img src={user.parentPhoto} alt="Parent" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#17177F]/10 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-[#17177F]" />
                </div>
              )}
              <span className="text-xs font-bold text-[#16165F]">{t('parental_controls') || "Parental Controls"}</span>
            </div>
            <ChevronRight size={18} className="text-[#777A91]" />
          </button>

          {/* Help Center */}
          <button 
            onClick={() => navigate("/help")}
            className="w-full flex items-center justify-between bg-white rounded-xl p-3 border border-[#E0E3E5] hover:border-[#17177F] transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#17177F]/10 flex items-center justify-center shrink-0">
                <HelpCircle size={18} className="text-[#17177F]" />
              </div>
              <span className="text-xs font-bold text-[#16165F]">{t('help_center') || "Help Center"}</span>
            </div>
            <ChevronRight size={18} className="text-[#777A91]" />
          </button>

          {/* App Language Selector */}
          <div className="bg-white rounded-xl p-3 flex flex-col gap-2 border border-[#E0E3E5] shadow-xs">
            <span className="text-xs font-bold text-[#16165F]">{t('app_language') || "App Language"}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'en'); window.location.reload(); }}
                className={`flex-1 py-1.5 rounded-lg border ${localStorage.getItem('i18nextLng') === 'en' || !localStorage.getItem('i18nextLng') ? 'bg-[#17177F] text-white border-[#17177F]' : 'bg-gray-50 text-[#17177F] border-gray-200'} text-xs font-bold transition-colors`}
              >
                English
              </button>
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'hi'); window.location.reload(); }}
                className={`flex-1 py-1.5 rounded-lg border ${localStorage.getItem('i18nextLng') === 'hi' ? 'bg-[#17177F] text-white border-[#17177F]' : 'bg-gray-50 text-[#17177F] border-gray-200'} text-xs font-bold transition-colors`}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => { localStorage.setItem('i18nextLng', 'gu'); window.location.reload(); }}
                className={`flex-1 py-1.5 rounded-lg border ${localStorage.getItem('i18nextLng') === 'gu' ? 'bg-[#17177F] text-white border-[#17177F]' : 'bg-gray-50 text-[#17177F] border-gray-200'} text-xs font-bold transition-colors`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>

          {/* Logout Device Button */}
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between bg-red-50/70 rounded-xl p-3 border border-red-200/80 hover:bg-red-100/80 transition-colors group mt-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <LogOut size={16} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-red-700 block">Logout Device</span>
                <span className="text-[10px] font-semibold text-red-500 block">Sign out from this device</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-400" />
          </button>
        </section>
      </main>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-red-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
              <LogOut size={28} />
            </div>
            <h3 className="text-lg font-black text-[#17177F] mb-1">Logout Device</h3>
            <p className="text-xs text-[#777A91] mb-5 leading-relaxed">
              Are you sure you want to log out from this device? You will need your credentials to sign back in.
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:bg-red-700 active:scale-95 transition-all"
              >
                Yes, Logout Device
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 bg-gray-100 text-[#17177F] rounded-xl font-bold text-xs hover:bg-gray-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
