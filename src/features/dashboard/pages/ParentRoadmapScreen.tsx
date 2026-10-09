import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Star, Check, Sparkles, Brain, Lock, Trophy, BookOpen, TrendingUp, Users, Settings, Play, ArrowLeft, Home, BarChart2 } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

const IconMap: Record<string, any> = {
  Check,
  Sparkles,
  Brain,
  Lock,
  Trophy,
  BookOpen,
  Star
};

export default function ParentRoadmapScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  const cachedRoadmap = (() => {
    try {
      const raw = sessionStorage.getItem("parent_roadmap_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  const [roadmapData, setRoadmapData] = useState<any>(cachedRoadmap);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("Parent");

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const [resUser, resRoadmap] = await Promise.all([
          apiFetch("/api/users/me").catch(() => null),
          apiFetch("/api/parent/roadmap").catch(() => null)
        ]);

        if (resUser) {
          const jsonUser = await resUser.json();
          if (jsonUser.success && jsonUser.data?.user) {
            setUsername(jsonUser.data.user.parentName || jsonUser.data.user.username || "Parent");
            setProfilePic(jsonUser.data.user.parentPhoto || "");
          }
        }

        if (resRoadmap) {
          const json = await resRoadmap.json();
          if (json.success && json.data) {
            setRoadmapData(json.data);
            sessionStorage.setItem("parent_roadmap_cache", JSON.stringify(json.data));
          }
        }
      } catch (err) {
        console.error("Failed to load roadmap", err);
      } finally {
        setTimeout(() => setLoading(false), 350);
      }
    }
    fetchRoadmap();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const h = contentRef.current.offsetHeight;
        if (h > 0) {
          setContentHeight(h);
        }
      }
    };

    updateHeight();
    const timer = setTimeout(updateHeight, 300);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && contentRef.current) {
      ro = new ResizeObserver(() => updateHeight());
      ro.observe(contentRef.current);
    }

    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [roadmapData, loading]);

  const stagesCount = roadmapData?.stages?.length || 10;
  const svgHeight = contentHeight > 0 ? contentHeight : Math.max(1200, stagesCount * 250);

  const roadmapPathD = (() => {
    const xPattern = [88, 168, 88, 168, 128];
    const n = stagesCount;
    const stageHeight = svgHeight / (n || 1);
    
    let d = "M128 0";
    let prevX = 128;
    let prevY = 0;

    for (let i = 0; i < n; i++) {
      const targetX = xPattern[i % xPattern.length];
      const targetY = Math.round((i + 0.5) * stageHeight);
      const cpY1 = prevY + (targetY - prevY) * 0.45;
      const cpY2 = prevY + (targetY - prevY) * 0.55;
      d += ` C ${prevX} ${cpY1}, ${targetX} ${cpY2}, ${targetX} ${targetY}`;
      prevX = targetX;
      prevY = targetY;
    }

    // Terminate path cleanly at the last level/stage card — do not draw trailing line below
    return d;
  })();

  const translateStageTitle = (title: string) => {
    if (!title) return "";
    const lower = title.toLowerCase().trim();
    if (lower.includes("communication")) return t("communication", title);
    if (lower.includes("anger")) return t("anger_management", title);
    if (lower.includes("emotional")) return t("emotional_intelligence", title);
    if (lower.includes("focus")) return t("focus", t("focus_skills", title));
    if (lower.includes("study")) return t("study_habits", title);
    if (lower.includes("confidence")) return t("confidence_building", title);
    if (lower.includes("digital")) return t("digital_parenting", title);
    if (lower.includes("psychology")) return t("child_psychology", title);
    if (lower.includes("family")) return t("family_growth", title);
    if (lower.includes("advanced")) return t("advanced_parenting", title);
    return t(title, title);
  };

  const translateStageDesc = (desc: string) => {
    if (!desc) return "";
    const lower = desc.toLowerCase().trim();
    if (lower.includes("dialog") || lower.includes("communication") || lower.includes("સંવાદ") || lower.includes("વાતચીત") || lower.includes("बातचीत")) {
      return t("desc_communication", desc);
    }
    if (lower.includes("calm mind") || lower.includes("anger") || lower.includes("મુશ્કેલ ક્ષણો") || lower.includes("શાંત મન") || lower.includes("शांत मन")) {
      return t("desc_anger_management", desc);
    }
    if (lower.includes("concentration") || lower.includes("focus") || lower.includes("અભ્યાસ સમયનું ધ્યાન") || lower.includes("એકાગ્રતા") || lower.includes("एकाग्रता")) {
      return t("desc_focus", desc);
    }
    if (lower.includes("discipline") || lower.includes("routine") || lower.includes("habits") || lower.includes("લાંબા ગાળાનું શિસ્ત") || lower.includes("દિનચર્યા") || lower.includes("दिनचर्या")) {
      return t("desc_study_habits", desc);
    }
    if (lower.includes("believe") || lower.includes("confidence") || lower.includes("વિશ્વાસ") || lower.includes("विश्वास")) {
      return t("desc_confidence_building", desc);
    }
    if (lower.includes("screen time") || lower.includes("digital") || lower.includes("સ્ક્રીન") || lower.includes("स्क्रीन")) {
      return t("desc_digital_parenting", desc);
    }
    if (lower.includes("developmental") || lower.includes("psychology") || lower.includes("વિકાસના તબક્કા") || lower.includes("विकास के चरण")) {
      return t("desc_child_psychology", desc);
    }
    if (lower.includes("empathy") || lower.includes("emotional") || lower.includes("સહાનુભૂતિ") || lower.includes("सहानुभूति")) {
      return t("desc_emotional_intelligence", desc);
    }
    if (lower.includes("peaceful") || lower.includes("home") || lower.includes("family") || lower.includes("વાતાવરણ") || lower.includes("वातावरण")) {
      return t("desc_family_growth", desc);
    }
    if (lower.includes("coaching") || lower.includes("advanced") || lower.includes("master") || lower.includes("હકારાત્મક કોચિંગ") || lower.includes("કોચિંગ") || lower.includes("कोचिंग")) {
      return t("desc_advanced_parenting", desc);
    }
    return t(desc, desc);
  };

  const translateRewardLabel = (label: string) => {
    if (!label) return "";
    const match = label.match(/(\d+)/);
    const xp = match ? match[1] : "50";
    if (/xp/i.test(label) || /reward/i.test(label) || /ઇનામ/i.test(label) || /ઈનામ/i.test(label) || /पुरस्कार/i.test(label) || /इनाम/i.test(label)) {
      return t("xp_reward_fmt", { xp, defaultValue: `${xp} XP Reward` });
    }
    return t(label, label);
  };

  useEffect(() => {
    if (!loading && containerRef.current) {
      setTimeout(() => {
        const activeStage = containerRef.current?.querySelector('.animate-pulse-teal');
        if (activeStage) {
          activeStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [loading, roadmapData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-hidden">
        {/* Top Header Skeleton */}
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-xs flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full animate-skeleton shrink-0"></div>
            <div className="h-6 w-36 rounded-lg animate-skeleton"></div>
          </div>
          <div className="h-7 w-24 rounded-full animate-skeleton"></div>
        </header>

        {/* Roadmap Path Stages Skeleton */}
        <main className="relative min-h-screen w-full flex flex-col items-center pt-24 pb-28 px-6">
          <div className="w-full max-w-md flex flex-col gap-12 items-center">
            {/* Hero Stage Skeleton */}
            <div className="w-full bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border-2 border-white/50 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-md animate-skeleton"></div>
                  <div className="h-6 w-40 rounded-xl animate-skeleton"></div>
                </div>
                <div className="w-12 h-12 rounded-full animate-skeleton"></div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 rounded-full animate-skeleton"></div>
              </div>
            </div>

            {/* ZigZag Stage Cards Skeleton */}
            <div className="w-full space-y-8">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-xs w-4/5 space-y-3 ${
                    idx % 2 === 0 ? "-translate-x-2" : "translate-x-12"
                  }`}
                >
                  <div className="h-4 w-32 rounded-md animate-skeleton"></div>
                  <div className="h-3 w-48 rounded-md animate-skeleton"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-hidden selection:bg-[#57fae9]">
      <style>{`
        .glass-card {
            background: #ffffff;
            backdrop-filter: blur(12px);
            border: 1.5px solid rgba(255, 255, 255, 0.8);
        }
        .roadmap-path {
            stroke-dasharray: 8 8;
            stroke-linecap: round;
        }
        @keyframes pulse-teal {
            0% { box-shadow: 0 0 0 0 rgba(0, 106, 98, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(0, 106, 98, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 106, 98, 0); }
        }
        .animate-pulse-teal {
            animation: pulse-teal 2s infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* TopAppBar Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-[rgba(20,23,121,0.05)] rounded-full transition-colors active:scale-95">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#141779]/20 overflow-hidden bg-white shrink-0">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
            />
          </div>
          <Rocket size={20} color="#141779" className="hidden sm:block" />
          <h1 className="text-xl font-bold text-[#141779] whitespace-nowrap">{t("growth_journey") || "Growth Journey"}</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center pt-20 pb-24">
        {/* Adventure Roadmap Container */}
        <div ref={containerRef} className="relative w-full max-w-[430px] h-full flex flex-col items-center overflow-y-auto no-scrollbar pt-6 pb-36 px-4 scroll-pt-24 scroll-pb-32">
          
          {/* Roadmap SVG Path (Visual Guide) */}
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 pointer-events-none z-0 opacity-20"
            style={{ height: `${svgHeight}px` }}
            viewBox={`0 0 256 ${svgHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path className="roadmap-path" d={roadmapPathD} stroke="#141779" strokeWidth="4"></path>
          </svg>

          <div ref={contentRef} className="w-full flex flex-col items-center relative z-10">
            {roadmapData?.stages?.map((stage: any, index: number) => {
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "active";
              const isLocked = stage.status === "locked";
              
              const positionClasses = [
                "-translate-x-6",
                "translate-x-6",
                "-translate-x-6",
                "translate-x-6",
                "0" // centered for 5th and 10th
              ];
              
              const IconComp = IconMap[stage.icon] || Star;
              const translateClass = positionClasses[index % positionClasses.length];
              
              if (isCompleted) {
                return (
                  <div key={stage.id} className={`relative z-10 w-full mb-14 flex justify-center ${translateClass}`}>
                    <div 
                      onClick={() => navigate(`/parent/lessons?category=${encodeURIComponent(stage.title)}`)}
                      className="glass-card bg-white p-4 rounded-2xl w-48 sm:w-52 shadow-sm flex flex-col items-center cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <div className="w-10 h-10 bg-[#006a62] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-[#006a62]/20">
                        <IconComp size={20} color="white" strokeWidth={3} />
                      </div>
                      {stage.xpRequired > 0 ? (
                        <div className="flex items-center gap-1 mb-1">
                          <Star size={14} color="#006a62" />
                          <span className="text-xs text-[#464652] font-bold uppercase">{stage.xpRequired} XP</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#006a62] font-bold uppercase tracking-wider mb-1">{t("unlocked", "Unlocked")}</span>
                      )}
                      <h3 className="text-base font-bold text-[#191c1e] text-center">{translateStageTitle(stage.title)}</h3>
                      {stage.rewards && (
                        <div className="mt-2 text-[10px] text-[#464652] grid grid-cols-2 gap-x-2 gap-y-1">
                          {stage.rewards.map((rw: any, i: number) => {
                            const RIcon = IconMap[rw.icon] || Star;
                            return (
                              <span key={i} className="flex items-center gap-1"><RIcon size={12} /> {translateRewardLabel(rw.label)}</span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              if (isActive) {
                return (
                  <div key={stage.id} className={`relative z-20 w-full mb-14 flex justify-center ${translateClass}`}>
                    <div 
                      onClick={() => navigate(`/parent/lessons?category=${encodeURIComponent(stage.title)}`)}
                      className="glass-card bg-white p-5 rounded-2xl w-52 sm:w-56 shadow-xl border-[#006a62] border-2 animate-pulse-teal flex flex-col items-center scale-105 cursor-pointer hover:shadow-2xl active:scale-[1.02] transition-all"
                    >
                      <div className="w-12 h-12 bg-[#2d328f] rounded-full flex items-center justify-center mb-3 shadow-lg ring-4 ring-[#006a62]/30">
                        <IconComp size={24} color="#9ba1ff" />
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={16} color="#006a62" />
                        <span className="text-sm text-[#141779] font-bold uppercase">{stage.xpRequired} XP</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#141779] mb-2">{translateStageTitle(stage.title)}</h3>
                      
                      <div className="w-full bg-[#eceef0] rounded-full h-2 mb-1 overflow-hidden">
                        <div className="bg-[#006a62] h-full rounded-full transition-all duration-1000" style={{ width: `${stage.progress}%` }}></div>
                      </div>
                      {stage.nextStageName && (
                        <p className="text-[10px] text-[#464652] font-medium mb-3">
                          {t("percent_to_target", { percent: stage.progress, target: translateStageTitle(stage.nextStageName), defaultValue: `${stage.progress}% to ${translateStageTitle(stage.nextStageName)}` })}
                        </p>
                      )}
                      
                      {stage.rewards && (
                        <div className="mt-1 flex gap-3 text-[11px] text-[#464652] font-semibold bg-[#57fae9]/20 px-3 py-1 rounded-full">
                          {stage.rewards.map((rw: any, i: number) => {
                            const RIcon = IconMap[rw.icon] || Star;
                            return (
                              <span key={i} className="flex items-center gap-1"><RIcon size={14} /> {translateRewardLabel(rw.label)}</span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              if (isLocked) {
                return (
                  <div key={stage.id} className={`relative z-10 w-full mb-14 flex justify-center ${translateClass}`}>
                    <div className="bg-[#eceef0] p-4 rounded-2xl w-48 sm:w-52 shadow-sm flex flex-col items-center border border-[#767683]/15">
                      <div className="w-full flex flex-col items-center opacity-80">
                        <div className="w-10 h-10 bg-[#767683] rounded-full flex items-center justify-center mb-2 shadow-xs">
                          <IconComp size={20} color="white" />
                        </div>
                        <span className="text-xs text-[#767683] font-bold uppercase tracking-wider mb-1">{t("locked_caps", "LOCKED")}</span>
                        <h3 className="text-base font-bold text-[#464652] text-center">{translateStageTitle(stage.title)}</h3>
                        {stage.description && (
                          <p className="text-[10px] text-center mt-1 text-[#767683] leading-relaxed">{translateStageDesc(stage.description)}</p>
                        )}
                        {stage.rewards && (
                          <div className="mt-2 text-[10px] text-[#767683] flex items-center gap-1 font-medium">
                            {stage.rewards.map((rw: any, i: number) => {
                              const RIcon = IconMap[rw.icon] || Star;
                              return (
                                <span key={i} className="flex items-center gap-1"><RIcon size={12} /> {translateRewardLabel(rw.label)}</span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <button onClick={() => navigate('/parent/lessons')} className="fixed bottom-24 right-5 w-14 h-14 bg-[#141779] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:bg-[#30007f]">
          <Play size={24} fill="currentColor" />
        </button>
      </main>


    </div>
  );
}
