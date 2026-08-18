import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, BookOpen, Flame, Lock, GraduationCap, Users, X, 
  Settings, ArrowLeft, Trophy, Sparkles, CheckCircle2 
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

export default function ParentAchievementsScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeAchievement, setActiveAchievement] = useState<any | null>(null);
  const [badgesEarned, setBadgesEarned] = useState(0);
  const [globalRank, setGlobalRank] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [parentPhoto, setParentPhoto] = useState("");
  const [username, setUsername] = useState("Parent");
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  useEffect(() => {
    async function fetchStats() {
      try {
        const uPromise = (async () => {
          try {
            const uRes = await apiFetch("/api/users/me");
            const uJson = await uRes.json();
            if (uJson.success && uJson.data?.user) {
              setParentPhoto(uJson.data.user.parentPhoto || "");
              setUsername(uJson.data.user.parentName || uJson.data.user.username || "Parent");
            }
          } catch (e) {}
        })();

        const rankPromise = (async () => {
          try {
            const rankRes = await apiFetch("/api/parent/rank");
            const rankJson = await rankRes.json();
            if (rankJson.success && rankJson.data) {
              setGlobalRank(rankJson.data.rank);
            }
          } catch (e) {}
        })();

        const achPromise = (async () => {
          try {
            const achRes = await apiFetch("/api/parent/achievements");
            const achJson = await achRes.json();
            if (achJson.success && achJson.data) {
              setAchievements(achJson.data.achievements);
              setBadgesEarned(achJson.data.badgesEarned);
            }
          } catch (e) {}
        })();

        await Promise.allSettled([uPromise, rankPromise, achPromise]);
      } catch (e) {}
    }
    fetchStats();
  }, []);

  const ICON_MAP: Record<string, any> = {
    BookOpen, Flame, Lock, GraduationCap, Users, Trophy
  };

  const showDetails = (ach: any) => {
    setActiveAchievement(ach);
  };

  const hideDetails = () => {
    setActiveAchievement(null);
  };

  // Find next closest milestone
  const lockedAchievements = achievements.filter(ach => ach.currentProgress < ach.totalRequired);
  const nextMilestone = lockedAchievements.length > 0
    ? lockedAchievements.reduce((prev, curr) => {
        const prevRatio = prev.currentProgress / prev.totalRequired;
        const currRatio = curr.currentProgress / curr.totalRequired;
        return currRatio > prevRatio ? curr : prev;
      })
    : null;

  const filteredAchievements = achievements.filter(ach => {
    const isUnlocked = ach.currentProgress >= ach.totalRequired;
    if (filter === "unlocked") return isUnlocked;
    if (filter === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans">
      <style>{`
        .bento-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.9);
            box-shadow: 0 4px 16px -2px rgba(148, 163, 184, 0.1);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px -4px rgba(20, 23, 121, 0.12);
            border-color: rgba(20, 23, 121, 0.3);
        }
        .bento-card-active {
            border-color: #141779;
            background: #f8fafc;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all">
            <ArrowLeft size={20} className="text-[#141779]" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#141779]/20 shadow-xs">
            <img 
              alt="Parent Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=141779&color=ffffff&bold=true`}
            />
          </div>
          <span className="text-xl font-black text-[#141779] tracking-tight">{t("achievements") || "Achievements"}</span>
        </div>
        <button 
          onClick={() => navigate('/parent/settings')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#141779] transition-all"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Bento Layout Container */}
      <main className="w-full max-w-lg mx-auto pt-20 pb-32 px-5 flex flex-col items-center overflow-y-auto no-scrollbar relative gap-4">
        
        {/* Bento Grid */}
        <div className="w-full grid grid-cols-2 gap-4 mt-2">
          
          {/* Bento Box 1: Welcome & Profile Info */}
          <div className="col-span-2 bento-card rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden bg-white">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[11px] font-black text-slate-500 tracking-wider uppercase">Parent Dashboard</span>
              <h2 className="text-xl font-black text-[#141779] flex items-center gap-1.5">
                Hi, {username} <Sparkles className="text-amber-500 animate-pulse" size={20} />
              </h2>
              <p className="text-xs text-slate-600 font-bold leading-snug mt-0.5">Nurturing curiosity & celebrating key learning milestones.</p>
            </div>
            <div className="flex items-center justify-center bg-indigo-50 border border-indigo-100 w-12 h-12 rounded-2xl text-[#141779] shadow-xs shrink-0">
              <Trophy size={24} />
            </div>
          </div>

          {/* Bento Box 2: Total Badges Box */}
          <div className="col-span-1 bento-card rounded-[24px] p-5 flex flex-col justify-between h-[125px] bg-white border border-teal-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006a62] uppercase tracking-wider">Badges</span>
              <div className="p-2 bg-teal-50 rounded-xl text-[#006a62]">
                <GraduationCap size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#141779] tracking-tight">{badgesEarned}</div>
              <span className="text-[11px] text-slate-600 font-extrabold">Unlocked Medals</span>
            </div>
          </div>

          {/* Bento Box 3: Global Rank Box */}
          <div className="col-span-1 bento-card rounded-[24px] p-5 flex flex-col justify-between h-[125px] bg-white border border-indigo-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#30007f] uppercase tracking-wider">Rank</span>
              <div className="p-2 bg-indigo-50 rounded-xl text-[#30007f]">
                <Globe size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#141779] tracking-tight">#{globalRank}</div>
              <span className="text-[11px] text-slate-600 font-extrabold">Worldwide Position</span>
            </div>
          </div>

          {/* Bento Box 4: Next Milestone */}
          {nextMilestone && (
            <div className="col-span-2 bento-card rounded-[24px] p-5 flex flex-col gap-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006a62]"></span>
                  </span>
                  <span className="text-xs font-black text-[#141779]">Next Milestone Target</span>
                </div>
                <span className="text-[11px] font-black text-[#006a62] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {Math.round((nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}% Complete
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0">
                  {React.createElement(ICON_MAP[nextMilestone.icon] || Lock, { size: 20 })}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-[#141779] truncate">{nextMilestone.title}</h4>
                  <p className="text-xs text-slate-600 font-bold truncate mt-0.5">{nextMilestone.desc}</p>
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1.5">
                  <span>Current Progress</span>
                  <span className="font-black text-[#141779]">
                    {nextMilestone.currentProgress} / {nextMilestone.totalRequired} {nextMilestone.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="col-span-2 flex items-center justify-between mt-2 mb-1 px-1">
            <span className="text-base font-black text-[#141779]">Achievement Wall</span>
            <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60">
              <button 
                onClick={() => setFilter("all")} 
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all ${filter === "all" ? "bg-[#141779] text-white shadow-xs" : "text-slate-700 hover:text-[#141779]"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("unlocked")} 
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all ${filter === "unlocked" ? "bg-[#141779] text-white shadow-xs" : "text-slate-700 hover:text-[#141779]"}`}
              >
                Unlocked
              </button>
              <button 
                onClick={() => setFilter("locked")} 
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all ${filter === "locked" ? "bg-[#141779] text-white shadow-xs" : "text-slate-700 hover:text-[#141779]"}`}
              >
                Locked
              </button>
            </div>
          </div>

          {/* Achievement Grid Cards */}
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.currentProgress >= ach.totalRequired;
            const IconComponent = ICON_MAP[ach.icon] || Lock;
            const isSelected = activeAchievement?.id === ach.id;
            
            return (
              <div 
                key={ach.id} 
                onClick={() => showDetails(ach)}
                className={`col-span-1 bento-card rounded-[24px] p-4 flex flex-col justify-between min-h-[145px] cursor-pointer relative overflow-hidden ${isSelected ? "bento-card-active border-[#141779]" : ""}`}
              >
                {/* Badge Icon Slot */}
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                    isUnlocked 
                      ? "bg-gradient-to-br from-[#141779] to-[#30007f] text-white" 
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  
                  {isUnlocked ? (
                    <span className="p-1 bg-teal-50 text-[#006a62] rounded-full border border-teal-200">
                      <CheckCircle2 size={16} />
                    </span>
                  ) : (
                    <span className="p-1 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                      <Lock size={14} />
                    </span>
                  )}
                </div>

                {/* Info Text */}
                <div className="mt-3 flex flex-col gap-1">
                  <h5 className={`text-sm font-black leading-tight truncate ${isUnlocked ? "text-[#141779]" : "text-slate-700"}`}>
                    {ach.title}
                  </h5>
                  <p className="text-xs text-slate-600 font-bold line-clamp-2 leading-snug">
                    {ach.desc}
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[10px] text-slate-600 font-extrabold mb-1">
                    <span>Progress</span>
                    <span className="font-black text-[#141779]">
                      {Math.min(ach.totalRequired, ach.currentProgress)}/{ach.totalRequired}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? "bg-[#006a62]" : "bg-[#141779]/40"}`}
                      style={{ width: `${Math.min(100, (ach.currentProgress / ach.totalRequired) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Bento Details Sliding Bottom Drawer */}
        {activeAchievement && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-end justify-center animate-fade-in" onClick={hideDetails}>
            <div 
              className="w-full max-w-lg bg-white rounded-t-[32px] p-6 shadow-2xl border-t border-slate-200 flex flex-col gap-4 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Pull Element */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-2"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                    activeAchievement.currentProgress >= activeAchievement.totalRequired
                      ? "bg-gradient-to-br from-[#141779] to-[#30007f]"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {React.createElement(ICON_MAP[activeAchievement.icon] || Lock, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#141779]">{activeAchievement.title}</h3>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      activeAchievement.currentProgress >= activeAchievement.totalRequired
                        ? "bg-teal-50 text-[#006a62] border border-teal-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {activeAchievement.currentProgress >= activeAchievement.totalRequired ? "Completed & Unlocked" : "In Progress"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={hideDetails}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-[#141779] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Target Requirement</span>
                <p className="text-xs text-slate-800 font-bold leading-relaxed">{activeAchievement.desc}</p>
              </div>

              {/* Progress bar inside drawer */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-extrabold text-slate-700">Achievement Progress</span>
                  <span className="font-black text-[#141779]">
                    {Math.min(activeAchievement.totalRequired, activeAchievement.currentProgress)} / {activeAchievement.totalRequired} {activeAchievement.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (activeAchievement.currentProgress / activeAchievement.totalRequired) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 font-bold text-center mt-1">
                  {activeAchievement.currentProgress >= activeAchievement.totalRequired 
                    ? "🎉 Congratulations! You have unlocked this milestone reward." 
                    : `Keep going! Only ${activeAchievement.totalRequired - activeAchievement.currentProgress} more to unlock.`}
                </div>
              </div>

              <button 
                onClick={hideDetails}
                className="w-full bg-[#141779] text-white py-3 rounded-full font-black text-sm shadow-md hover:bg-[#1e23a0] active:scale-95 transition-all mt-2"
              >
                Awesome
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

