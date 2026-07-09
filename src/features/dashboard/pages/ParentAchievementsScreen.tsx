import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Globe, BookOpen, Flame, Lock, GraduationCap, Users, X, TrendingUp, Settings, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentAchievementsScreen() {
  const navigate = useNavigate();
  const [activeAchievement, setActiveAchievement] = useState<any | null>(null);
  const [badgesEarned, setBadgesEarned] = useState(0);
  const [globalRank, setGlobalRank] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [parentPhoto, setParentPhoto] = useState("");
  const [username, setUsername] = useState("Parent");

  useEffect(() => {
    async function fetchStats() {
      try {
        const uRes = await apiFetch("/api/users/me");
        const uJson = await uRes.json();
        if (uJson.success && uJson.data?.user) {
          setParentPhoto(uJson.data.user.parentPhoto || "");
          setUsername(uJson.data.user.parentName || uJson.data.user.username || "Parent");
        }

        // BUG-P05 FIX: Real rank from DB instead of fake formula
        try {
          const rankRes = await apiFetch("/api/parent/rank");
          const rankJson = await rankRes.json();
          if (rankJson.success && rankJson.data) {
            setGlobalRank(rankJson.data.rank);
          }
        } catch (e) {}

        try {
          const achRes = await apiFetch("/api/parent/achievements");
          const achJson = await achRes.json();
          if (achJson.success && achJson.data) {
            setAchievements(achJson.data.achievements);
            setBadgesEarned(achJson.data.badgesEarned);
          }
        } catch (e) {}

      } catch (e) {}
    }
    fetchStats();
  }, []);

  const ICON_MAP: Record<string, any> = {
    BookOpen, Flame, Lock, GraduationCap, Users
  };

  const showDetails = (ach: any) => {
    setActiveAchievement(ach);
  };

  const hideDetails = () => {
    setActiveAchievement(null);
  };

  return (
    <div className="flex flex-col items-center justify-start text-[#191c1e] bg-[#f7f9fb] h-screen overflow-hidden font-sans">
      <style>{`
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .badge-glow {
            filter: drop-shadow(0 0 8px rgba(0, 106, 98, 0.4));
        }
        .hexagon {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-b border-[#c7c5d4]/30 shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft className="text-[#141779] font-bold" size={24} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#141779]/20 bg-white">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779] tracking-tight">Achievements</h1>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[430px] h-full pt-20 pb-24 px-6 flex flex-col items-center overflow-y-auto no-scrollbar relative">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#006a62]/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#141779]/10 rounded-full blur-[80px] -z-10"></div>
        
        {/* Header Section */}
        <section className="w-full mt-4 mb-6">
          <h2 className="text-2xl font-bold text-[#141779] mb-4 text-center">Parent Achievements</h2>
          <div className="glass-panel rounded-xl p-5 flex justify-around items-center shadow-sm">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#464652] mb-1">Badges Earned</p>
              <div className="flex items-center justify-center gap-1">
                <GraduationCap className="text-[#006a62]" size={24} />
                <span className="text-2xl font-bold text-[#141779]">{badgesEarned}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-[#c7c5d4]/50"></div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#464652] mb-1">Global Rank</p>
              <div className="flex items-center justify-center gap-1">
                <Globe className="text-[#30007f]" size={24} />
                <span className="text-2xl font-bold text-[#141779]">#{globalRank}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Chips */}
        <section className="w-full mb-8 overflow-x-auto no-scrollbar flex gap-3 pb-2">
          <button className="whitespace-nowrap px-6 py-2 rounded-full bg-[#141779] text-white font-bold text-sm shadow-md transition-all active:scale-95">All</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Communication</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Patience</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Consistency</button>
        </section>

        {/* Achievement Wall */}
        <section className="w-full grid grid-cols-3 gap-y-10 gap-x-4 mb-8">
          {achievements.map((ach) => {
            const isUnlocked = ach.currentProgress >= ach.totalRequired;
            const Icon = ICON_MAP[ach.icon] || Lock;
            
            let bgClass = "bg-[#e0e3e5] grayscale border-2 border-dashed border-[#767683]";
            let iconClass = "text-[#767683]";
            
            if (isUnlocked) {
              if (ach.id === "lesson") {
                bgClass = "bg-gradient-to-br from-[#006a62] to-[#141779] shadow-lg badge-glow";
                iconClass = "text-white";
              } else if (ach.id.startsWith("streak")) {
                bgClass = "bg-gradient-to-br from-[#30007f] to-[#2d328f] shadow-lg badge-glow";
                iconClass = "text-white";
              } else if (ach.id.startsWith("lesson10")) {
                bgClass = "bg-gradient-to-br from-[#57fae9] to-[#006a62] shadow-lg badge-glow";
                iconClass = "text-[#007168]";
              } else {
                bgClass = "bg-gradient-to-br from-[#141779] to-[#30007f] shadow-lg badge-glow";
                iconClass = "text-white";
              }
            }

            return (
              <div 
                key={ach.id} 
                className={`flex flex-col items-center ${isUnlocked ? 'cursor-pointer group' : 'opacity-50'}`} 
                onClick={() => showDetails(ach)}
              >
                <div className={`hexagon w-20 h-20 flex items-center justify-center transition-transform ${isUnlocked ? 'group-active:scale-95' : ''} ${bgClass}`}>
                  <Icon className={iconClass} size={32} />
                </div>
                <p className={`text-xs font-bold text-center mt-3 ${isUnlocked ? 'text-[#141779]' : 'text-[#767683]'}`}>
                  {ach.title}
                </p>
              </div>
            );
          })}
        </section>

        {/* Dynamic Detail Card */}
        {activeAchievement && (() => {
          const isUnlocked = activeAchievement.currentProgress >= activeAchievement.totalRequired;
          const Icon = ICON_MAP[activeAchievement.icon] || Lock;
          let bgClass = "bg-[#e0e3e5]";
          
          if (isUnlocked) {
             if (activeAchievement.id === "lesson") bgClass = "bg-gradient-to-br from-[#006a62] to-[#141779]";
             else if (activeAchievement.id.startsWith("streak")) bgClass = "bg-gradient-to-br from-[#30007f] to-[#2d328f]";
             else if (activeAchievement.id.startsWith("lesson10")) bgClass = "bg-gradient-to-br from-[#57fae9] to-[#006a62]";
             else bgClass = "bg-gradient-to-br from-[#141779] to-[#30007f]";
          }

          return (
            <section className="w-full glass-panel rounded-xl p-6 shadow-xl border-[#006a62]/30 animate-fade-in-up">
              <div className="flex items-start gap-4 mb-4">
                <div className={`hexagon w-16 h-16 flex items-center justify-center shadow-md ${bgClass}`}>
                  <Icon className={isUnlocked ? (activeAchievement.id === "lesson10" ? "text-[#007168]" : "text-white") : "text-[#767683]"} size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#141779]">
                    {activeAchievement.title}
                  </h3>
                  <p className="text-xs text-[#006a62] font-semibold">
                    {isUnlocked ? "Unlocked!" : "Locked"}
                  </p>
                </div>
                <button 
                  className="text-[#464652] hover:text-[#ba1a1a] transition-colors" 
                  onClick={hideDetails}
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-[#464652] mb-4 leading-relaxed">
                {activeAchievement.desc}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-[#141779]">Progress</span>
                  <span className="text-xs text-[#464652]">
                    {Math.min(activeAchievement.totalRequired, activeAchievement.currentProgress)}/{activeAchievement.totalRequired} {activeAchievement.progressUnit}
                  </span>
                </div>
                <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#006a62] transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (activeAchievement.currentProgress / activeAchievement.totalRequired) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </section>
          );
        })()}

        <div className="w-full h-12"></div> {/* Spacer */}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full rounded-t-xl z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-t border-[#c7c5d4]/30 shadow-lg flex justify-around items-center px-2 py-3">
        <button onClick={() => navigate('/parent/lessons')} className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <BookOpen className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Lessons</span>
        </button>
        <button onClick={() => navigate('/parent/roadmap')} className="flex flex-col items-center justify-center bg-[#57fae9] text-[#007168] rounded-full px-5 py-2 hover:bg-[#e0e3e5] transition-all active:scale-90 shadow-sm">
          <TrendingUp className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Growth</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <Users className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Community</span>
        </button>
        <button onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <Settings className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
