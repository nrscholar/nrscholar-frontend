import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit, Target, Zap, Activity } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentLearningDNAScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch actual report if needed
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans pb-20 relative">
      <header className="flex items-center gap-4 px-6 py-5 bg-[rgba(247,249,251,0.8)] backdrop-blur-md sticky top-0 z-50 border-b border-[rgba(255,255,255,0.3)]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-xl font-bold text-[#141779]">Learning DNA</h1>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto flex flex-col gap-6">
        
        {/* Core Trait Overview */}
        <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-[#464652] tracking-[1px] mb-1">COGNITIVE PROFILE</p>
              <h2 className="text-xl font-bold text-[#141779]">Visual-Spatial Learner</h2>
            </div>
            <div className="bg-[#57fae9] px-3 py-1 rounded-full border border-[#006a62]/10">
              <span className="text-xs font-bold text-[#007168]">Strong</span>
            </div>
          </div>
          
          <p className="text-sm text-[#464652] leading-relaxed mb-6">
            Your child excels at processing information visually. They grasp concepts much faster when presented with images, charts, and spatial puzzles compared to text-heavy instructions.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f2f4f6] p-3 rounded-xl">
              <h4 className="text-xs font-bold text-[#006a62] mb-1">Focus Mode</h4>
              <p className="text-xs text-[#767683]">High in mornings</p>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded-xl">
              <h4 className="text-xs font-bold text-[#30007f] mb-1">Avg. Attention</h4>
              <p className="text-xs text-[#767683]">15-20 min bursts</p>
            </div>
          </div>
        </div>

        {/* Learning Style Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-[#464652] mb-3 px-1">Learning Modalities</h3>
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(20,23,121,0.1)] flex items-center justify-center">
                <BrainCircuit size={20} color="#141779" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-[#191c1e]">Visual Processing</span>
                  <span className="text-sm font-bold text-[#141779]">92%</span>
                </div>
                <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#141779] rounded-full w-[92%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,106,98,0.1)] flex items-center justify-center">
                <Activity size={20} color="#006a62" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-[#191c1e]">Kinesthetic (Hands-on)</span>
                  <span className="text-sm font-bold text-[#006a62]">78%</span>
                </div>
                <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006a62] rounded-full w-[78%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(186,26,26,0.1)] flex items-center justify-center">
                <Target size={20} color="#ba1a1a" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-[#191c1e]">Reading/Writing</span>
                  <span className="text-sm font-bold text-[#ba1a1a]">45%</span>
                </div>
                <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ba1a1a] rounded-full w-[45%]" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-semibold text-[#464652] mb-3 px-1">Actionable Tips</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#141779]">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} color="#141779" />
                <h4 className="text-sm font-bold text-[#141779]">Use more diagrams</h4>
              </div>
              <p className="text-xs text-[#464652] leading-relaxed">
                When explaining complex concepts, try drawing them out. The visual association helps retention by up to 60%.
              </p>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#006a62]">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} color="#006a62" />
                <h4 className="text-sm font-bold text-[#006a62]">Keep reading sessions short</h4>
              </div>
              <p className="text-xs text-[#464652] leading-relaxed">
                Due to lower reading endurance, break long texts into 5-minute chunks with small active breaks in between.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
