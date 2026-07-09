import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle, Award, Flame,Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

export default function ProgressScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [level, setLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);
  const [xp, setXp] = useState(0);
  const [username, setUsername] = useState("Explorer");
  const [userPhoto, setUserPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const progressPercent = Math.min(100, Math.max(0, Math.round(((xp % 1000) / 1000) * 100)));
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
           const u = JSON.parse(cached);
           setXp(u.xp || 0);
           setLevel(u.level || 1);
           setStreakDays(u.streakDays || 0);
           setUsername(u.childName || u.name || "Explorer");
           setUserPhoto(u.childPhoto || u.photo || "");
        }
        
        const response = await apiFetch("/api/users/me");
        const data = await response.json();
        if (data.success && data.data.user) {
           const u = data.data.user;
           setXp(u.xp || 0);
           setLevel(u.level || 1);
           setStreakDays(u.streakDays || 0);
           setUsername(u.childName || u.name || "Explorer");
           setUserPhoto(u.childPhoto || u.photo || "");
        }
      } catch(e) {}

      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
      
      setLoading(false);
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full border-2 border-[#57fae9] overflow-hidden bg-white shrink-0 active:scale-95 transition-all"
          >
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </button>
          <h1 className="text-2xl font-bold text-[#141779] tracking-[-0.5px]">My Progress</h1>
        </div>
        
        {/* Right side: Bell icon */}
        <button 
          onClick={() => navigate("/notifications")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative"
        >
          <Bell size={20} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-6 pt-8 flex flex-col gap-8">
        {/* Hero Section: Level & Circular Progress */}
        <div className="flex items-center justify-center">
          <div className="relative w-[192px] h-[192px] flex items-center justify-center">
            <svg width="192" height="192" viewBox="0 0 192 192" className="-rotate-90 absolute">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#eceef0"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#2addcd"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#464652] uppercase tracking-[1px]">{t('level')}</span>
              <span className="text-4xl font-bold text-[#141779] my-0.5">{level}</span>
              <span className="text-sm font-semibold text-[#006a62] mt-1">{progressPercent}{t('percent_to_next')}</span>
            </div>
          </div>
        </div>

        {/* Mid Section: Subject Mastery */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#464652] tracking-[1px] px-1">{t('subject_mastery')}</h2>
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
            
            {/* Math */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-base font-bold text-[#141779]">{t('math')}</span>
                <span className="text-xs font-bold text-[#006a62]">{Math.min(100, Math.round(xp / 10))}%</span>
              </div>
              <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                <div className="h-full bg-[#141779] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round(xp / 10))}%` }} />
              </div>
            </div>

            {/* Science */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-base font-bold text-[#141779]">{t('science')}</span>
                <span className="text-xs font-bold text-[#006a62]">{Math.min(100, Math.round(xp / 15))}%</span>
              </div>
              <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2addcd] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round(xp / 15))}%` }} />
              </div>
            </div>

            {/* English/Vocabulary */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-base font-bold text-[#141779]">{t('vocabulary')}</span>
                <span className="text-xs font-bold text-[#006a62]">{Math.min(100, Math.round(xp / 20))}%</span>
              </div>
              <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2d328f] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round(xp / 20))}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Recent Achievements */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#464652] tracking-[1px] px-1">{t('recent_achievements')}</h2>
          <div className="flex gap-4">
            
            <button className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col items-center gap-3 hover:bg-white transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#e0e0ff] flex items-center justify-center">
                <Award size={28} color="#141779" />
              </div>
              <span className="text-sm font-semibold text-[#191c1e] text-center">{t('math_ace')}</span>
            </button>

            <button className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col items-center gap-3 hover:bg-white transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#57fae9] flex items-center justify-center">
                <Flame size={28} color="#006a62" />
              </div>
              <span className="text-sm font-semibold text-[#191c1e] text-center">{t('day_streak', { days: streakDays })}</span>
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}
