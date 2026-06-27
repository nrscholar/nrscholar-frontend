import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Star, Check, Sparkles, Brain, Lock, Trophy, BookOpen, TrendingUp, Users, Settings, Play } from "lucide-react";

export default function ParentRoadmapScreen() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the current active stage (Growth Coach)
    if (containerRef.current) {
      const activeStage = containerRef.current.querySelector('.animate-pulse-teal');
      if (activeStage) {
        activeStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

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
          <Rocket size={24} color="#141779" />
          <h1 className="text-xl font-bold text-[#141779]">Growth Journey</h1>
        </div>
        <button onClick={() => navigate('/parent')} className="active:scale-95 transition-transform duration-200 hover:opacity-80">
          <Star size={24} color="#141779" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center pt-16 pb-20">
        {/* Adventure Roadmap Container */}
        <div ref={containerRef} className="relative w-full max-w-[430px] h-full flex flex-col items-center overflow-y-auto no-scrollbar py-12">
          
          {/* Roadmap SVG Path (Visual Guide) */}
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1200px] pointer-events-none z-0 opacity-20" fill="none" viewBox="0 0 256 1200" xmlns="http://www.w3.org/2000/svg">
            <path className="roadmap-path" d="M128 0 C 128 150, 200 150, 200 300 C 200 450, 56 450, 56 600 C 56 750, 200 750, 200 900 C 200 1050, 128 1050, 128 1200" stroke="#141779" strokeWidth="4"></path>
          </svg>

          {/* Stage 1: New Parent (Completed) */}
          <div className="relative z-10 w-full mb-20 flex justify-center -translate-x-12">
            <div className="glass-card p-4 rounded-xl w-48 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 bg-[#006a62] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-[#006a62]/20">
                <Check size={20} color="white" strokeWidth={3} />
              </div>
              <span className="text-xs text-[#006a62] font-bold uppercase tracking-wider mb-1">Unlocked</span>
              <h3 className="text-base font-bold text-[#191c1e]">New Parent</h3>
              <div className="mt-2 text-[10px] text-[#464652] flex gap-2">
                <span className="flex items-center gap-1"><Star size={12} /> Badge</span>
              </div>
            </div>
          </div>

          {/* Stage 2: Calm Parent (Completed) */}
          <div className="relative z-10 w-full mb-20 flex justify-center translate-x-12">
            <div className="glass-card p-4 rounded-xl w-48 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 bg-[#006a62] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-[#006a62]/20">
                <Sparkles size={20} color="white" />
              </div>
              <div className="flex items-center gap-1 mb-1">
                <Star size={14} color="#006a62" />
                <span className="text-xs text-[#464652] font-bold uppercase">500 XP</span>
              </div>
              <h3 className="text-base font-bold text-[#191c1e] text-center">Calm Parent</h3>
              <div className="mt-2 text-[10px] text-[#464652] grid grid-cols-2 gap-x-2 gap-y-1">
                <span className="flex items-center gap-1"><BookOpen size={12} /> 5 Lessons</span>
                <span className="flex items-center gap-1"><Trophy size={12} /> 2 Chal.</span>
              </div>
            </div>
          </div>

          {/* Stage 3: Growth Coach (Current) */}
          <div className="relative z-20 w-full mb-20 flex justify-center -translate-x-8">
            <div className="glass-card p-5 rounded-2xl w-56 shadow-xl border-[#006a62] border-2 animate-pulse-teal flex flex-col items-center scale-105">
              <div className="w-12 h-12 bg-[#2d328f] rounded-full flex items-center justify-center mb-3 shadow-lg ring-4 ring-[#006a62]/30">
                <Brain size={24} color="#9ba1ff" />
              </div>
              <div className="flex items-center gap-1 mb-1">
                <Star size={16} color="#006a62" />
                <span className="text-sm text-[#141779] font-bold uppercase">1200 XP</span>
              </div>
              <h3 className="text-2xl font-bold text-[#141779] mb-2">Growth Coach</h3>
              {/* Progress toward next stage */}
              <div className="w-full bg-[#eceef0] rounded-full h-2 mb-1 overflow-hidden">
                <div className="bg-[#006a62] h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
              <p className="text-[10px] text-[#464652] font-medium mb-3">48% to Mindful Parent</p>
              <div className="mt-1 flex gap-3 text-[11px] text-[#464652] font-semibold bg-[#57fae9]/20 px-3 py-1 rounded-full">
                <span className="flex items-center gap-1"><BookOpen size={14} /> 10</span>
                <span className="flex items-center gap-1"><Star size={14} /> 5</span>
              </div>
            </div>
          </div>

          {/* Stage 4: Mindful Parent (Locked) */}
          <div className="relative z-10 w-full mb-20 flex justify-center translate-x-12 opacity-60 grayscale-[0.5]">
            <div className="bg-[#eceef0] p-4 rounded-xl w-48 shadow-sm flex flex-col items-center border border-[#767683]/10">
              <div className="w-10 h-10 bg-[#767683] rounded-full flex items-center justify-center mb-2">
                <Lock size={20} color="white" />
              </div>
              <span className="text-xs text-[#767683] font-bold uppercase tracking-wider mb-1">Locked</span>
              <h3 className="text-base font-bold text-[#464652]">Mindful Parent</h3>
              <div className="mt-2 text-[10px] text-[#767683] flex items-center gap-1">
                <Trophy size={12} /> Certificate Reward
              </div>
            </div>
          </div>

          {/* Stage 5: Master Parent (Locked) */}
          <div className="relative z-10 w-full mb-32 flex justify-center">
            <div className="bg-[#eceef0] p-5 rounded-xl w-52 shadow-sm flex flex-col items-center border border-[#767683]/10 opacity-50 grayscale">
              <div className="w-14 h-14 bg-[#e0e3e5] rounded-full flex items-center justify-center mb-2">
                <Trophy size={32} color="#767683" />
              </div>
              <h3 className="text-base font-bold text-[#464652]">Master Parent</h3>
              <p className="text-[10px] text-center mt-1 text-[#767683]">The ultimate parent explorer achievement</p>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#141779] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40">
          <Play size={24} fill="currentColor" />
        </button>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[rgba(236,238,240,0.9)] backdrop-blur-2xl border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 h-[80px]">
        {/* Lessons */}
        <div 
          onClick={() => navigate('/parent/lessons')}
          className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90"
        >
          <BookOpen size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Lessons</span>
        </div>
        {/* Growth (Active) */}
        <div className="flex flex-col items-center justify-center text-[#141779] bg-[rgba(20,23,121,0.1)] rounded-full px-5 py-2 cursor-pointer active:scale-90 transition-all">
          <TrendingUp size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Growth</span>
        </div>
        {/* Community */}
        <div className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90">
          <Users size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Community</span>
        </div>
        {/* Settings */}
        <div 
          onClick={() => navigate('/parent/settings')}
          className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90"
        >
          <Settings size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Settings</span>
        </div>
      </nav>
    </div>
  );
}
