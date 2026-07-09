import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Star, Check, Sparkles, Brain, Lock, Trophy, BookOpen, TrendingUp, Users, Settings, Play, ArrowLeft, Home, BarChart2 } from "lucide-react";
import { apiFetch } from "../../../api";

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
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await apiFetch("/api/parent/roadmap");
        const json = await res.json();
        if (json.success && json.data) {
          setRoadmapData(json.data);
        }
      } catch (err) {
        console.error("Failed to load roadmap", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

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
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-hidden selection:bg-[#57fae9]">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
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
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-xl border-b border-[rgba(199,197,212,0.3)] shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-[rgba(20,23,121,0.05)] rounded-full transition-colors active:scale-95">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#141779]/20 overflow-hidden bg-white shrink-0">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src={`https://ui-avatars.com/api/?name=Parent&background=random`}
            />
          </div>
          <Rocket size={20} color="#141779" className="hidden sm:block" />
          <h1 className="text-xl font-bold text-[#141779] whitespace-nowrap">Growth Journey</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center pt-16 pb-20">
        {/* Adventure Roadmap Container */}
        <div ref={containerRef} className="relative w-full max-w-[430px] h-full flex flex-col items-center overflow-y-auto no-scrollbar py-12">
          
          {/* Roadmap SVG Path (Visual Guide) */}
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1200px] pointer-events-none z-0 opacity-20" fill="none" viewBox="0 0 256 1200" xmlns="http://www.w3.org/2000/svg">
            <path className="roadmap-path" d="M128 0 C 128 150, 200 150, 200 300 C 200 450, 56 450, 56 600 C 56 750, 200 750, 200 900 C 200 1050, 128 1050, 128 1200" stroke="#141779" strokeWidth="4"></path>
          </svg>

          {roadmapData?.stages?.map((stage: any, index: number) => {
            const isCompleted = stage.status === "completed";
            const isActive = stage.status === "active";
            const isLocked = stage.status === "locked";
            
            const positionClasses = [
              "-translate-x-12",
              "translate-x-12",
              "-translate-x-8",
              "translate-x-12",
              "0" // centered for last
            ];
            
            const IconComp = IconMap[stage.icon] || Star;
            const translateClass = positionClasses[index % positionClasses.length];
            
            if (isCompleted) {
              return (
                <div key={stage.id} className={`relative z-10 w-full mb-20 flex justify-center ${translateClass}`}>
                  <div className="glass-card p-4 rounded-xl w-48 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#006a62] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-[#006a62]/20">
                      <IconComp size={20} color="white" strokeWidth={3} />
                    </div>
                    {stage.xpRequired > 0 ? (
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={14} color="#006a62" />
                        <span className="text-xs text-[#464652] font-bold uppercase">{stage.xpRequired} XP</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#006a62] font-bold uppercase tracking-wider mb-1">Unlocked</span>
                    )}
                    <h3 className="text-base font-bold text-[#191c1e] text-center">{stage.title}</h3>
                    {stage.rewards && (
                      <div className="mt-2 text-[10px] text-[#464652] grid grid-cols-2 gap-x-2 gap-y-1">
                        {stage.rewards.map((rw: any, i: number) => {
                          const RIcon = IconMap[rw.icon] || Star;
                          return (
                            <span key={i} className="flex items-center gap-1"><RIcon size={12} /> {rw.label}</span>
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
                <div key={stage.id} className={`relative z-20 w-full mb-20 flex justify-center ${translateClass}`}>
                  <div className="glass-card p-5 rounded-2xl w-56 shadow-xl border-[#006a62] border-2 animate-pulse-teal flex flex-col items-center scale-105 bg-white/90">
                    <div className="w-12 h-12 bg-[#2d328f] rounded-full flex items-center justify-center mb-3 shadow-lg ring-4 ring-[#006a62]/30">
                      <IconComp size={24} color="#9ba1ff" />
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={16} color="#006a62" />
                      <span className="text-sm text-[#141779] font-bold uppercase">{stage.xpRequired} XP</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#141779] mb-2">{stage.title}</h3>
                    
                    <div className="w-full bg-[#eceef0] rounded-full h-2 mb-1 overflow-hidden">
                      <div className="bg-[#006a62] h-full rounded-full transition-all duration-1000" style={{ width: `${stage.progress}%` }}></div>
                    </div>
                    {stage.nextStageName && (
                      <p className="text-[10px] text-[#464652] font-medium mb-3">{stage.progress}% to {stage.nextStageName}</p>
                    )}
                    
                    {stage.rewards && (
                      <div className="mt-1 flex gap-3 text-[11px] text-[#464652] font-semibold bg-[#57fae9]/20 px-3 py-1 rounded-full">
                        {stage.rewards.map((rw: any, i: number) => {
                          const RIcon = IconMap[rw.icon] || Star;
                          return (
                            <span key={i} className="flex items-center gap-1"><RIcon size={14} /> {rw.label}</span>
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
                <div key={stage.id} className={`relative z-10 w-full mb-20 flex justify-center ${translateClass} opacity-60 grayscale-[0.5]`}>
                  <div className="bg-[#eceef0] p-4 rounded-xl w-48 shadow-sm flex flex-col items-center border border-[#767683]/10">
                    <div className="w-10 h-10 bg-[#767683] rounded-full flex items-center justify-center mb-2">
                      <IconComp size={20} color="white" />
                    </div>
                    <span className="text-xs text-[#767683] font-bold uppercase tracking-wider mb-1">Locked</span>
                    <h3 className="text-base font-bold text-[#464652] text-center">{stage.title}</h3>
                    {stage.description && (
                      <p className="text-[10px] text-center mt-1 text-[#767683]">{stage.description}</p>
                    )}
                    {stage.rewards && (
                      <div className="mt-2 text-[10px] text-[#767683] flex items-center gap-1">
                        {stage.rewards.map((rw: any, i: number) => {
                          const RIcon = IconMap[rw.icon] || Star;
                          return (
                            <span key={i} className="flex items-center gap-1"><RIcon size={12} /> {rw.label}</span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            
            return null;
          })}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#141779] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:bg-[#30007f]">
          <Play size={24} fill="currentColor" />
        </button>
      </main>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-white/60 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate('/parent/dashboard')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168]">
          <Home size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>
        <button onClick={() => navigate('/parent/reports')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168]">
          <BarChart2 size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Reports</span>
        </button>
        <button onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168]">
          <Settings size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Settings</span>
        </button>
      </nav>
    </div>
  );
}
