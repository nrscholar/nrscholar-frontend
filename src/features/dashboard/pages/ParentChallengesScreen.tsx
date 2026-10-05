import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, VolumeX, Heart, Star, ShieldCheck, Gift, Ear, Sparkles, BookOpen, Lock, TrendingUp, Settings, ArrowLeft, Flame } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

export default function ParentChallengesScreen() {
  const { t, i18n } = useTranslation();
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
  const [loading, setLoading] = useState(true);

  const translateChalTitle = (title: string) => {
    if (!title) return "";
    if (title.includes("Positive Swap")) return t("chal_title_positive_swap", "Positive Swap");
    if (title.includes("Eye-to-Eye Connection") || title.includes("Eye Connection")) return t("chal_title_eye_connection", "Eye-to-Eye Connection");
    if (title.includes("Pause") || title.includes("5s")) return t("chal_title_pause_5s", "5-Second Pause");
    if (title.includes("Active Listener") || title.includes("Listening")) return t("chal_title_active_listener", "Active Listener");
    if (title.includes("No-Interruption") || title.includes("Interruption")) return t("chal_title_no_interruption", "No-Interruption Time");
    return t(title, title);
  };

  const translateChalDesc = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("Replace one command") || desc.includes("positive communication swap")) {
      return t("chal_desc_positive_swap", "Replace one command with one positive communication swap today (e.g., 'What is the first thing you need to finish?' instead of 'Do your homework').");
    }
    if (desc.includes("Get down to eye level") || desc.includes("eye contact")) {
      return t("chal_desc_eye_connection", "Get down to eye level and make eye contact with your child before giving any instruction today.");
    }
    if (desc.includes("Pause for 5 seconds") || desc.includes("5 seconds")) {
      return t("chal_desc_pause_5s", "Pause for 5 seconds before responding when your child says something difficult.");
    }
    if (desc.includes("Reflect on what your child says") || desc.includes("Active Listener")) {
      return t("chal_desc_active_listener", "Reflect on what your child says before giving your opinion.");
    }
    if (desc.includes("Let your child speak completely") || desc.includes("without interrupting")) {
      return t("chal_desc_no_interruption", "Let your child speak completely during dinner without interrupting them.");
    }
    return t(desc, desc);
  };

  const translateChalBadge = (badge: string) => {
    if (!badge) return "";
    if (badge.includes("Communication")) return t("badge_communication", "Communication Badge");
    if (badge.includes("Connection")) return t("badge_connection", "Connection Badge");
    if (badge.includes("Patience")) return t("badge_patience", "Patience Badge");
    if (badge.includes("Listening")) return t("badge_listening", "Listening Star");
    return t(badge, badge);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const lang = i18n.language || "en";
      const [resUser, resChal] = await Promise.all([
        apiFetch("/api/users/me").catch(() => null),
        apiFetch("/api/parent/challenges", { headers: { "Accept-Language": lang } }).catch(() => null)
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
          const listRaw = jsonChal.data.challenges || [];
          // Deduplicate challenges by ID
          const uniqueMap = new Map();
          listRaw.forEach((c: any) => {
            if (c && c.id != null) uniqueMap.set(String(c.id), c);
          });
          const list = Array.from(uniqueMap.values());

          setChallenges(list);
          const upcomingRaw = jsonChal.data.upcoming || [];
          const existingIds = new Set(list.map((c: any) => String(c.id)));
          const uniqueUpcoming = upcomingRaw.filter((uc: any) => uc && uc.id != null && !existingIds.has(String(uc.id)));
          setUpcoming(uniqueUpcoming);
          setActiveCount(jsonChal.data.activeCount ?? list.filter((c: any) => !c.isCompleted).length);
          setTotalActive(jsonChal.data.totalActive || 3);
          
          const newClaimState: any = {};
          list.forEach((c: any) => {
             if (c.claimed) newClaimState[c.id] = "claimed";
             else newClaimState[c.id] = "idle";
          });
          setClaimState(newClaimState);
        }
      }
    } catch (e) {
      console.error("Error fetching parent challenges:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  const handleClaim = async (id: string, xp: number) => {
    setClaimState(prev => ({ ...prev, [id]: "processing" }));
    try {
      const res = await apiFetch(`/api/parent/challenges/${id}/claim`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setClaimState(prev => ({ ...prev, [id]: "claimed" }));
        setTotalXP(prev => prev + xp);
        
        setToastMessage(t("xp_increased_count", { count: xp, defaultValue: `${xp} XP increased!` }));
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
      setChallenges(prev => {
        if (prev.some(c => String(c.id) === String(nextActive.id))) return prev;
        return [...prev, nextActive];
      });
      setUpcoming(prev => prev.filter(u => String(u.id) !== String(nextActive.id)));
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

  // Helper deduplicated active and completed lists
  const activeChallenges = (() => {
    const map = new Map();
    challenges.filter(c => !c.isCompleted).forEach(c => map.set(String(c.id), c));
    return Array.from(map.values());
  })();

  const completedChallenges = (() => {
    const map = new Map();
    challenges.filter(c => c.isCompleted).forEach(c => map.set(String(c.id), c));
    return Array.from(map.values());
  })();

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center font-sans relative pb-24">
      <style>{`
        .glass-card {
            background: #ffffff;
            border: 1px solid rgba(20, 23, 121, 0.15);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
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
              {t("reward_claimed_badge", "Reward Claimed! 🏆")}
            </span>

            {/* Title */}
            <h1 className="text-white text-xl sm:text-2xl font-black mb-2 tracking-tight z-10">
              {t("xp_increased_title", "XP Increased!")}
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
                <span>{t("awesome", "Awesome!")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex justify-between items-center px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft className="text-[#141779] font-bold" size={24} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden flex items-center justify-center bg-[#141779]/10">
            <img 
              className="w-full h-full object-cover" 
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779]">{t("growth_challenges", "Growth Challenges")}</h1>
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
                <p className="text-[#e0e0ff] text-xs font-bold tracking-widest uppercase">{t("level_explorer_upper", { level, defaultValue: `LEVEL ${level} EXPLORER` })}</p>
                <h2 className="text-3xl font-bold">{totalXP} XP</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/30">
                <span className="text-orange-400">🔥</span>
                <span className="font-bold text-sm">{t("day_streak", { days: streak, streak, count: streak, defaultValue: `${streak} Day Streak` })}</span>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>{t("progress_to_level", { level: level + 1, defaultValue: `Progress to Level ${level + 1}` })}</span>
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
          <h3 className="text-lg font-bold text-[#141779]">{t("active_challenges", "Active Challenges")}</h3>
          <span className="text-[#006a62] font-bold text-sm">{t("active_count_of", { activeCount: activeChallenges.length, totalActive, defaultValue: `${activeChallenges.length} of ${totalActive} Active` })}</span>
        </div>

        {/* Skeleton Loading State */}
        {loading && (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/40 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl animate-skeleton shrink-0"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-36 rounded-md animate-skeleton"></div>
                      <div className="h-3 w-24 rounded-md animate-skeleton"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full animate-skeleton"></div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 rounded-full animate-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Fallback */}
        {!loading && challenges.length === 0 && (
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 my-4">
            <Sparkles className="w-12 h-12 text-[#141779]/40" />
            <h4 className="text-base font-bold text-[#141779]">
              {t("no_challenges_found", "No challenges available right now")}
            </h4>
            <p className="text-slate-600 text-xs font-semibold">
              {t("no_challenges_desc", "Tap below to reload parent growth challenges.")}
            </p>
            <button
              onClick={fetchData}
              className="mt-2 px-5 py-2.5 bg-[#141779] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
            >
              {t("reload", "Reload Challenges")}
            </button>
          </div>
        )}

        {/* Challenges Grid/List */}
        {!loading && challenges.length > 0 && (
          <div className="flex flex-col gap-4">
            
            {activeChallenges.map((chal, idx) => {
              const Icon = IconMap[chal.icon] || Star;
              const progressPercent = Math.min(100, Math.round((chal.completedDays / chal.totalDays) * 100));

              return (
                <div key={`active_${chal.id}_${idx}`} className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-[#141779]/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0`} style={{ backgroundColor: `${chal.color || '#006a62'}18`, color: chal.color || '#006a62' }}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-[#141779] leading-snug">{translateChalTitle(chal.title)}</h4>
                      <p className="text-slate-800 text-[13px] font-semibold leading-relaxed mt-1">{translateChalDesc(chal.desc)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{t("day_completed_progress", { completed: chal.completedDays, total: chal.totalDays, defaultValue: `Day ${chal.completedDays} / ${chal.totalDays} Complete` })}</span>
                      <span className="text-[#006a62] font-extrabold">{progressPercent}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div className="h-full bg-[#006a62] progress-bar-glow rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl px-4 border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Star className="text-[#141779]" size={18} fill="currentColor" />
                      <span className="text-xs font-bold text-[#141779]">+{chal.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-[#006a62]" size={18} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-800">{translateChalBadge(chal.badge)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleIncrement(chal.id, e)}
                    disabled={chal.incrementedToday}
                    className={`w-full font-black tracking-wide py-2.5 mt-1 rounded-xl border-2 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 ${
                      chal.incrementedToday 
                        ? "border-slate-200 text-slate-400 bg-slate-100 font-bold" 
                        : "border-[#141779] text-[#141779] bg-[#141779]/5 hover:bg-[#141779]/10"
                    }`}
                  >
                    <Star size={16} />
                    {chal.incrementedToday ? t("completed_for_today", "COMPLETED FOR TODAY") : t("mark_today_complete", "MARK TODAY COMPLETE")}
                  </button>
                </div>
              );
            })}

            {/* Upcoming Section */}
            {upcoming.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-[#141779] mt-4">{t("upcoming_challenges", "Upcoming Challenges")}</h3>
                
                {upcoming.map((uc, idx) => (
                  <div key={`upcoming_${uc.id}_${idx}`} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#141779] text-base">{translateChalTitle(uc.title)}</h4>
                      <p className="text-slate-800 text-[13px] font-semibold mt-1">{translateChalDesc(uc.desc)}</p>
                    </div>
                    <Lock className="text-slate-400 shrink-0" size={24} />
                  </div>
                ))}
              </>
            )}

            {/* Completed Challenges Section */}
            {completedChallenges.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-[#141779] mt-4">{t("completed_challenges", "Completed Challenges")}</h3>
                
                {completedChallenges.map((chal, idx) => {
                  const Icon = IconMap[chal.icon] || Star;
                  const cState = claimState[chal.id] || "idle";

                  return (
                    <div key={`completed_${chal.id}_${idx}`} className="border-2 border-dashed border-[#006a62]/40 bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#006a62]/15 rounded-full flex items-center justify-center text-[#006a62] shrink-0">
                          <Icon size={24} fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#141779] text-base">{translateChalTitle(chal.title)}</h4>
                          <p className="text-slate-800 text-[13px] font-semibold mt-1">{translateChalDesc(chal.desc)}</p>
                        </div>
                        <span className="bg-[#006a62] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0">{t("completed_caps", "COMPLETED")}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl px-4 border border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <Star className="text-[#006a62]" size={18} fill="currentColor" />
                          <span className="text-xs font-bold text-[#006a62]">+{chal.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="text-[#006a62]" size={18} fill="currentColor" />
                          <span className="text-xs font-bold text-slate-800">{translateChalBadge(chal.badge)}</span>
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
                            {t("claim_rewards", "CLAIM REWARDS")}
                          </>
                        )}
                        {cState === "processing" && (
                          <>
                            <Sparkles className="animate-spin" size={20} />
                            {t("processing_caps", "PROCESSING...")}
                          </>
                        )}
                        {cState === "claimed" && (
                          <>
                            <ShieldCheck size={20} />
                            {t("rewards_claimed", "REWARDS CLAIMED!")}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </>
            )}

          </div>
        )}
      </main>

    </div>
  );
}
