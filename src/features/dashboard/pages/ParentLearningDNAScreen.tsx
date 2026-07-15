import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit, Target, Zap, Activity } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentLearningDNAScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dnaData, setDnaData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/parent/learning-dna");
        const json = await res.json();
        if (json.success) {
          setDnaData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#191c1e] font-sans pb-20 relative">
      <header className="flex items-center gap-4 px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
          <ArrowLeft size={22} className="text-[#141779]" />
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-[#141779]/20 overflow-hidden bg-white shrink-0">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover"
            src={`https://ui-avatars.com/api/?name=Parent&background=random`}
          />
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#30007f]">Learning DNA</h1>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto flex flex-col gap-6">
        
        {/* Core Trait Overview */}
        <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-xs font-bold text-[#464652] tracking-[1px] mb-1">COGNITIVE PROFILE</p>
              <h2 className="text-[26px] font-bold text-[#141779]">{dnaData?.dominantProfile || "Visual-Spatial Learner"}</h2>
            </div>
            <div className="bg-[#57fae9] px-3 py-1 rounded-full border border-[#006a62]/10">
              <span className="text-sm font-bold text-[#007168]">Strong</span>
            </div>
          </div>
          
          <p className="text-[15px] text-[#464652] leading-relaxed mb-6 relative z-10">
            {dnaData?.description || "Your child excels at processing information visually. They grasp concepts much faster when presented with images, charts, and spatial puzzles compared to text-heavy instructions."}
          </p>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="bg-white/50 p-4 rounded-xl border border-white/40">
              <h4 className="text-[14px] font-bold text-[#006a62] mb-1">Focus Mode</h4>
              <p className="text-[13px] text-[#767683] font-medium">{dnaData?.focusMode || "High in mornings"}</p>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-white/40">
              <h4 className="text-[14px] font-bold text-[#30007f] mb-1">Avg. Attention</h4>
              <p className="text-[13px] text-[#767683] font-medium">{dnaData?.avgAttention || "15-20 min bursts"}</p>
            </div>
          </div>
        </div>

        {/* Learning Style Metrics */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#464652] mb-3 px-1">Learning Modalities</h3>
          <div className="bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-5">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6e0ff] flex items-center justify-center">
                <BrainCircuit size={24} className="text-[#30007f]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[15px] font-bold text-[#191c1e]">Visual Processing</span>
                  <span className="text-[15px] font-bold text-[#30007f]">{dnaData?.visualPercentage ?? 92}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200/60 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full" style={{ width: `${dnaData?.visualPercentage ?? 92}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ccf4f0] flex items-center justify-center">
                <Activity size={24} className="text-[#006a62]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[15px] font-bold text-[#191c1e]">Kinesthetic (Hands-on)</span>
                  <span className="text-[15px] font-bold text-[#006a62]">{dnaData?.kinestheticPercentage ?? 78}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200/60 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] rounded-full" style={{ width: `${dnaData?.kinestheticPercentage ?? 78}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] flex items-center justify-center">
                <Target size={24} className="text-[#ba1a1a]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[15px] font-bold text-[#191c1e]">Reading/Writing</span>
                  <span className="text-[15px] font-bold text-[#ba1a1a]">{dnaData?.readingPercentage ?? 45}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200/60 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-[#ba1a1a] rounded-full" style={{ width: `${dnaData?.readingPercentage ?? 45}%` }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#464652] mb-3 px-1">Actionable Tips</h3>
          <div className="flex flex-col gap-4">
            {(dnaData?.tips || [
              {"title": "Use more diagrams", "icon": "Zap", "color": "#141779", "desc": "When explaining complex concepts, try drawing them out. The visual association helps retention by up to 60%."},
              {"title": "Keep reading sessions short", "icon": "Target", "color": "#006a62", "desc": "Due to lower reading endurance, break long texts into 5-minute chunks with small active breaks in between."}
            ]).map((tip: any, index: number) => {
              const borderLeftColor = tip.color || (index === 0 ? "#141779" : "#006a62");
              return (
                <div 
                  key={index} 
                  className="bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:bg-white hover:shadow-lg transition-all"
                  style={{ borderLeft: `5px solid ${borderLeftColor}` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {tip.icon === "Zap" ? <Zap size={18} style={{ color: borderLeftColor }} /> : <Target size={18} style={{ color: borderLeftColor }} />}
                    <h4 className="text-[15px] font-bold text-[#141779]">{tip.title}</h4>
                  </div>
                  <p className="text-[14px] text-[#464652] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
