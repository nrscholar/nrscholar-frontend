import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, VolumeX, Heart, Star, ShieldCheck, Gift, Ear, Sparkles, BookOpen, Lock, TrendingUp, Settings, ArrowLeft, Flame } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

export default function ParentChallengesScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [claimState, setClaimState] = useState<Record<string, "idle" | "processing" | "claimed">>({});
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("Parent");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [totalActive, setTotalActive] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [resUser, resChal] = await Promise.all([
          apiFetch("/api/users/me").catch(() => null),
          apiFetch("/api/parent/challenges").catch(() => null)
        ]);

        if (resUser) {
          const jsonUser = await resUser.json();
          if (jsonUser.success && jsonUser.data?.user) {
            setLevel(jsonUser.data.user.parentLevel || 1);
            setStreak(jsonUser.data.user.parentStreak ?? jsonUser.data.user.streakDays ?? 0);
            setTotalXP(jsonUser.data.user.parentXp || 0);
            setUsername(jsonUser.data.user.parentName || jsonUser.data.user.username || "Parent");
            setProfilePic(jsonUser.data.user.parentPhoto || "");
          }
        }
        
        if (resChal) {
          const jsonChal = await resChal.json();
          if (jsonChal.success && jsonChal.data) {
            setChallenges(jsonChal.data.challenges);
            setUpcoming(jsonChal.data.upcoming);
            setActiveCount(jsonChal.data.activeCount);
            setTotalActive(jsonChal.data.totalActive);
            
            const newClaimState: any = {};
            jsonChal.data.challenges.forEach((c: any) => {
               if (c.claimed) newClaimState[c.id] = "claimed";
               else newClaimState[c.id] = "idle";
            });
            setClaimState(newClaimState);
          }
        }
      } catch (e) {}
    }
    fetchData();
  }, []);

  const handleClaim = async (id: string, xp: number) => {
    setClaimState(prev => ({ ...prev, [id]: "processing" }));
    try {
      const res = await apiFetch(`/api/parent/challenges/${id}/claim`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setClaimState(prev => ({ ...prev, [id]: "claimed" }));
        setTotalXP(prev => prev + xp);
        
        setToastMessage(`${xp} XP increased!`);
      } else {
        setClaimState(prev => ({ ...prev, [id]: "idle" }));
      }
    } catch(e) {
      setClaimState(prev => ({ ...prev, [id]: "idle" }));
    }
  };

  const handleIncrement = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const targetChallenge = challenges.find(c => c.id === id);
    if (!targetChallenge) return;
    
    const willBeCompleted = targetChallenge.completedDays + 1 >= targetChallenge.totalDays;

    // Optimistic UI update
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          completedDays: c.completedDays + 1,
          isCompleted: willBeCompleted,
          incrementedToday: true
        };
      }
      return c;
    }));

    if (willBeCompleted && upcoming.length > 0) {
      const nextActive = upcoming[0];
      setChallenges(prev => [...prev, nextActive]);
      setUpcoming(prev => prev.slice(1));
    }

    try {
      await apiFetch(`/api/parent/challenges/${id}/increment`, { method: 'POST' });
    } catch(e) {}
  };

  const getXpForLevel = (lvl: number) => {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  };
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const levelProgressPercent = Math.max(0, Math.min(100, Math.round(((totalXP - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100)));

  const IconMap: any = { VolumeX, Heart, Ear, BookOpen, Flame };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center font-sans relative pb-24">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .progress-bar-glow {
            box-shadow: 0 0 12px rgba(87, 250, 233, 0.4);
        }
        .cosmic-gradient {
            background: linear-gradient(135deg, #141779 0%, #30007f 100%);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Reward Pop-up Modal */}
      {toastMessage && (
        <div className="fixed inset-0 bg-[#f7f9fb]/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#141779] border border-[#1f239c] rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(20,23,121,0.3)] flex flex-col items-center relative overflow-hidden">
            {/* Decorative ambient background glows */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

            {/* Icon Header */}
            <div className="relative mb-4 z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-xs">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-lg sm:text-xl">🎉</span>
            </div>

            {/* Badge */}
            <span className="px-3.5 py-1 bg-amber-400 text-[#141779] font-black text-[11px] rounded-full uppercase tracking-wider mb-3 shadow-sm z-10">
              Reward Claimed! 🏆
            </span>

            {/* Title */}
            <h1 className="text-white text-xl sm:text-2xl font-black mb-2 tracking-tight z-10">
              XP Increased!
            </h1>

            {/* Description */}
            <p className="text-blue-100/90 text-sm leading-relaxed mb-5 font-bold z-10">
              {toastMessage}
            </p>

            <div className="w-full flex flex-col gap-2.5 z-10">
              <button 
                onClick={() => setToastMessage(null)} 
                className="w-full bg-gradient-to-r from-[#007168] to-[#004e48] text-white py-3 rounded-2xl font-extrabold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15"
              >
                <span>Awesome!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg flex justify-between items-center px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/parent/dashboard')} className="p-1 -ml-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft className="text-[#141779] font-bold" size={24} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden flex items-center justify-center bg-[#141779]/10">
            <img 
              className="w-full h-full object-cover" 
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779]">{t("challenges") || "Growth Challenges"}</h1>
        </div>
        <button onClick={() => navigate('/parent/settings')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
          <Settings size={20} className="text-[#141779]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col px-6 py-4">
        
        {/* Growth Status Header */}
        <section className="cosmic-gradient rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#e0e0ff] text-xs font-bold tracking-widest uppercase">LEVEL {level} EXPLORER</p>
                <h2 className="text-3xl font-bold">{totalXP} XP</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/30">
                <span className="text-orange-400">🔥</span>
                <span className="font-bold text-sm">{streak} Day Streak</span>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>Progress to Level {level + 1}</span>
                <span>{levelProgressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#57fae9] rounded-full" style={{ width: `${levelProgressPercent}%` }}></div>
              </div>
            </div>
          </div>
          {/* Decorative Orbit */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-white/5 rounded-full"></div>
        </section>

        {/* Active Challenges Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#141779]">Active Challenges</h3>
          <span className="text-[#006a62] font-bold text-sm">{activeCount} of {totalActive} Active</span>
        </div>

        {/* Challenges Grid/List */}
        <div className="flex flex-col gap-4">
          
          {challenges.filter(c => !c.isCompleted).map((chal) => {
            const Icon = IconMap[chal.icon] || Star;
            const progressPercent = Math.min(100, Math.round((chal.completedDays / chal.totalDays) * 100));

            return (
              <div key={chal.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${chal.color}15`, color: chal.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold" style={{ color: chal.color }}>{chal.title}</h4>
                    <p className="text-[#464652] text-sm">{chal.desc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#464652]">
                    <span>Day {chal.completedDays} / {chal.totalDays} Complete</span>
                    <span className="text-[#006a62]">{progressPercent}%</span>
                  </div>
                  <div className="h-3 w-full bg-[#e0e3e5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#006a62] progress-bar-glow rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#f2f4f6] p-2 rounded-full px-4 border border-[#c7c5d4]/30">
                  <div className="flex items-center gap-2">
                    <Star className="text-[#141779]" size={18} fill="currentColor" />
                    <span className="text-xs font-bold text-[#141779]">+{chal.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-[#006a62]" size={18} fill="currentColor" />
                    <span className="text-xs font-bold text-[#464652]">{chal.badge}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleIncrement(chal.id, e)}
                  disabled={chal.incrementedToday}
                  className={`w-full font-bold py-2 mt-2 rounded-xl border-2 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 ${
                    chal.incrementedToday 
                      ? "border-[#c7c5d4] text-[#8e8d9a] bg-[#f2f4f6]" 
                      : "border-[#141779] text-[#141779] hover:bg-[#141779]/5"
                  }`}
                >
                  <Star size={16} />
                  {chal.incrementedToday ? "COMPLETED FOR TODAY" : "MARK TODAY COMPLETE"}
                </button>
              </div>
            );
          })}

          {/* Upcoming Section */}
          {upcoming.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-[#141779] mt-4">Upcoming Challenges</h3>
              
              {upcoming.map(uc => (
                <div key={uc.id} className="bg-[#e0e3e5]/50 border border-[#c7c5d4]/30 rounded-2xl p-5 flex items-center gap-4 grayscale opacity-60">
                  <div className="w-12 h-12 bg-[#767683]/20 rounded-full flex items-center justify-center text-[#767683]">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#141779]">{uc.title}</h4>
                    <p className="text-[#464652] text-sm italic">{uc.desc}</p>
                  </div>
                  <Lock className="text-[#767683]" size={24} />
                </div>
              ))}
            </>
          )}

          {/* Completed Challenges Section */}
          {challenges.filter(c => c.isCompleted).length > 0 && (
            <>
              <h3 className="text-lg font-bold text-[#141779] mt-4">Completed Challenges</h3>
              
              {challenges.filter(c => c.isCompleted).map((chal) => {
                const Icon = IconMap[chal.icon] || Star;
                const cState = claimState[chal.id] || "idle";

                return (
                  <div key={chal.id} className="border-2 border-dashed border-[#006a62]/40 bg-[#006a62]/5 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-start gap-4 opacity-70">
                      <div className="w-12 h-12 bg-[#006a62]/20 rounded-full flex items-center justify-center text-[#006a62]">
                        <Icon size={24} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#141779]">{chal.title}</h4>
                        <p className="text-[#464652] text-sm">{chal.desc}</p>
                      </div>
                      <span className="bg-[#006a62] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">COMPLETED</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#006a62]/10 p-2 rounded-full px-4 border border-[#006a62]/20">
                      <div className="flex items-center gap-2">
                        <Star className="text-[#006a62]" size={18} fill="currentColor" />
                        <span className="text-xs font-bold text-[#006a62]">+{chal.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#006a62]" size={18} fill="currentColor" />
                        <span className="text-xs font-bold text-[#464652]">{chal.badge}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClaim(chal.id, chal.xp || 200)}
                      disabled={cState !== "idle"}
                      className={`w-full font-bold py-3 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                        cState === "claimed" 
                          ? "bg-green-600 text-white shadow-green-600/30" 
                          : cState === "processing"
                          ? "bg-[#006a62]/70 text-white cursor-wait"
                          : "bg-[#006a62] text-white shadow-[#006a62]/30"
                      }`}
                    >
                      {cState === "idle" && (
                        <>
                          <Sparkles size={20} fill="currentColor" />
                          CLAIM REWARDS
                        </>
                      )}
                      {cState === "processing" && (
                        <>
                          <Sparkles className="animate-spin" size={20} />
                          PROCESSING...
                        </>
                      )}
                      {cState === "claimed" && (
                        <>
                          <ShieldCheck size={20} />
                          REWARDS CLAIMED!
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </>
          )}

        </div>
      </main>



    </div>
  );
}
