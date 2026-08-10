import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, Globe, BookOpen, Flame, Lock, GraduationCap, Users, X, 
  TrendingUp, Settings, ArrowLeft, Trophy, Sparkles, ChevronRight, CheckCircle2 
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
    <div className="flex flex-col items-center justify-start text-on-background bg-[#f7f9fb] h-screen overflow-hidden font-sans">
      <style>{`
        .bento-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(224, 227, 229, 0.6);
            box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.12), 0 2px 8px -1px rgba(148, 163, 184, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(148, 163, 184, 0.2), 0 8px 16px -6px rgba(148, 163, 184, 0.15);
            border-color: rgba(20, 23, 121, 0.15);
        }
        .bento-card-active {
            border-color: rgba(20, 23, 121, 0.3);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 255, 0.9) 100%);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2.5s infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .bento-glow-cyan {
            box-shadow: 0 0 20px -2px rgba(0, 106, 98, 0.15);
        }
        .bento-glow-purple {
            box-shadow: 0 0 20px -2px rgba(48, 0, 127, 0.15);
        }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-variant rounded-xl transition-all duration-200 active:scale-95">
            <ArrowLeft className="text-primary font-bold" size={20} />
          </button>
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-primary/15 shadow-inner">
            <img 
              alt="Parent Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=141779&color=ffffff&bold=true`}
            />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">{t("achievements") || "Achievements"}</span>
        </div>
        <button 
          onClick={() => navigate('/parent/settings')}
          className="p-2 hover:bg-surface-variant rounded-xl transition-all duration-200 text-on-surface-variant"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Bento Layout Container */}
      <main className="w-full max-w-[430px] h-full pt-16 pb-24 px-4 flex flex-col items-center overflow-y-auto no-scrollbar relative gap-4">
        
        {/* Background Ambient Blur */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-2 gap-3.5 mt-4">
          
          {/* Bento Box 1: Welcome & Profile Info (col-span-2) */}
          <div className="col-span-2 bento-card rounded-2xl p-5 flex items-center justify-between relative overflow-hidden bg-gradient-to-r from-surface-container-lowest to-[#f7f9fb]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="flex flex-col gap-1 z-10">
              <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Parent Dashboard</span>
              <h2 className="text-xl font-extrabold text-primary flex items-center gap-1.5">
                Hi, {username} <Sparkles className="text-amber-500 animate-pulse" size={18} />
              </h2>
              <p className="text-xs text-on-surface-variant leading-tight mt-1">Nurturing curiosity & celebrating key learning milestones.</p>
            </div>
            <div className="flex items-center justify-center bg-primary/10 w-12 h-12 rounded-2xl text-primary shadow-sm">
              <Trophy size={24} />
            </div>
          </div>

          {/* Bento Box 2: Total Badges Box (col-span-1) */}
          <div className="col-span-1 bento-card rounded-2xl p-4 flex flex-col justify-between h-[115px] bg-gradient-to-br from-surface-container-lowest to-secondary-fixed/20 bento-glow-cyan">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Badges</span>
              <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                <GraduationCap size={16} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary tracking-tight">{badgesEarned}</div>
              <span className="text-[10px] text-on-surface-variant font-medium">Unlocked Medals</span>
            </div>
          </div>

          {/* Bento Box 3: Global Rank Box (col-span-1) */}
          <div className="col-span-1 bento-card rounded-2xl p-4 flex flex-col justify-between h-[115px] bg-gradient-to-br from-surface-container-lowest to-tertiary-fixed-dim/40 bento-glow-purple">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">Rank</span>
              <div className="p-1.5 bg-tertiary-fixed rounded-lg text-tertiary">
                <Globe size={16} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary tracking-tight">#{globalRank}</div>
              <span className="text-[10px] text-on-surface-variant font-medium">Worldwide Position</span>
            </div>
          </div>

          {/* Bento Box 4: Next Milestone (col-span-2) */}
          {nextMilestone && (
            <div className="col-span-2 bento-card rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="text-xs font-bold text-on-background">Next Milestone Target</span>
                </div>
                <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  {Math.round((nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}% Complete
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-variant/40 flex items-center justify-center text-on-surface-variant border border-outline-variant/30">
                  {React.createElement(ICON_MAP[nextMilestone.icon] || Lock, { size: 20 })}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-primary truncate">{nextMilestone.title}</h4>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{nextMilestone.desc}</p>
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant mb-1.5">
                  <span>Current Progress</span>
                  <span className="font-bold text-on-background">
                    {nextMilestone.currentProgress} / {nextMilestone.totalRequired} {nextMilestone.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-variant/40 rounded-full overflow-hidden border border-outline-variant/20">
                  <div 
                    className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (nextMilestone.currentProgress / nextMilestone.totalRequired) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Filters Bar (col-span-2) */}
          <div className="col-span-2 flex items-center justify-between mt-2 mb-0.5">
            <span className="text-sm font-extrabold text-primary">Achievement Wall</span>
            <div className="flex bg-surface-variant/60 p-0.5 rounded-xl border border-outline-variant/30">
              <button 
                onClick={() => setFilter("all")} 
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === "all" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-background"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("unlocked")} 
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === "unlocked" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-background"}`}
              >
                Unlocked
              </button>
              <button 
                onClick={() => setFilter("locked")} 
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === "locked" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-background"}`}
              >
                Locked
              </button>
            </div>
          </div>

          {/* Achievement Grid Cards (col-span-1 each) */}
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.currentProgress >= ach.totalRequired;
            const IconComponent = ICON_MAP[ach.icon] || Lock;
            const isSelected = activeAchievement?.id === ach.id;
            
            return (
              <div 
                key={ach.id} 
                onClick={() => showDetails(ach)}
                className={`col-span-1 bento-card rounded-2xl p-4 flex flex-col justify-between min-h-[140px] cursor-pointer relative overflow-hidden ${isSelected ? "bento-card-active border-primary" : ""}`}
              >
                {/* Badge Icon Slot */}
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                    isUnlocked 
                      ? "bg-gradient-to-br from-primary to-primary-container text-white" 
                      : "bg-surface-variant/30 text-outline border border-outline-variant/30"
                  }`}>
                    <IconComponent size={18} />
                  </div>
                  
                  {isUnlocked ? (
                    <span className="p-1 bg-secondary/15 text-secondary rounded-full">
                      <CheckCircle2 size={14} className="fill-secondary/15" />
                    </span>
                  ) : (
                    <span className="p-1 bg-surface-variant/30 text-outline rounded-full border border-outline-variant/30">
                      <Lock size={12} />
                    </span>
                  )}
                </div>

                {/* Info Text */}
                <div className="mt-3 flex flex-col gap-1">
                  <h5 className={`text-xs font-bold leading-snug truncate ${isUnlocked ? "text-primary" : "text-on-surface-variant"}`}>
                    {ach.title}
                  </h5>
                  <p className="text-[10px] text-on-surface-variant line-clamp-2 leading-tight">
                    {ach.desc}
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[9px] text-on-surface-variant mb-1">
                    <span>Progress</span>
                    <span className="font-bold">
                      {Math.min(ach.totalRequired, ach.currentProgress)}/{ach.totalRequired}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-variant/30 rounded-full overflow-hidden border border-outline-variant/20">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? "bg-secondary" : "bg-primary/40"}`}
                      style={{ width: `${Math.min(100, (ach.currentProgress / ach.totalRequired) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Bento Details Sliding Bottom Drawer */}
        {activeAchievement && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end justify-center animate-fade-in" onClick={hideDetails}>
            <div 
              className="w-full max-w-[430px] bg-surface-container-lowest rounded-t-3xl p-6 shadow-2xl border-t border-outline-variant/20 flex flex-col gap-4 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Pull Element */}
              <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto -mt-2 mb-2"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                    activeAchievement.currentProgress >= activeAchievement.totalRequired
                      ? "bg-gradient-to-br from-primary to-primary-container"
                      : "bg-surface-variant"
                  }`}>
                    {React.createElement(ICON_MAP[activeAchievement.icon] || Lock, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-primary">{activeAchievement.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeAchievement.currentProgress >= activeAchievement.totalRequired
                        ? "bg-secondary/15 text-secondary"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      {activeAchievement.currentProgress >= activeAchievement.totalRequired ? "Completed & Unlocked" : "In Progress"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={hideDetails}
                  className="p-1.5 hover:bg-surface-variant rounded-full text-on-surface-variant hover:text-on-background transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-[#f7f9fb] rounded-2xl p-4 border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Requirement</span>
                <p className="text-xs text-on-background leading-relaxed">{activeAchievement.desc}</p>
              </div>

              {/* Progress bar inside drawer */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-bold text-on-surface-variant">Achievement Milestone Progress</span>
                  <span className="font-semibold text-primary">
                    {Math.min(activeAchievement.totalRequired, activeAchievement.currentProgress)} / {activeAchievement.totalRequired} {activeAchievement.progressUnit || ""}
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-variant/40 rounded-full overflow-hidden border border-outline-variant/30">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (activeAchievement.currentProgress / activeAchievement.totalRequired) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-on-surface-variant text-center mt-1">
                  {activeAchievement.currentProgress >= activeAchievement.totalRequired 
                    ? "🎉 Congratulations! You have unlocked this milestone reward." 
                    : `Keep going! Only ${activeAchievement.totalRequired - activeAchievement.currentProgress} more to unlock.`}
                </div>
              </div>

              <button 
                onClick={hideDetails}
                className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.98] mt-2"
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
