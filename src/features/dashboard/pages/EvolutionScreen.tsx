import { Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import InteractiveCompanion from "../../../components/InteractiveCompanion";

export default function EvolutionScreen() {
  const navigate = useNavigate();
  const [evoData, setEvoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    const fetchEvo = async () => {
      try {
        const res = await apiFetch("/api/world/evolution");
        const json = await res.json();
        if (json.success) {
          setEvoData(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch evolution status", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { xp = 0, percentage = 0, stage = 1, stageName = "Egg" } = evoData || {};

  // Determine Dragon properties based on stage
  let dragonScale = 0.8;
  let bgGradient = "from-[#fdfcfb] to-[#e2d1c3]";
  let modelUrl = "/images/dragons/egg.glb";
  let fallbackUrl = "/images/dragons/egg.png";

  if (stage === 1) {
    dragonScale = 0.8;
    bgGradient = "from-[#fdfcfb] to-[#e2d1c3]";
    modelUrl = "/images/dragons/egg.glb";
    fallbackUrl = (stageName === "Cracking Egg" || stageName === "Broken Egg" || stageName === "Hatching Dragon")
      ? "/images/dragons/cracked.png"
      : "/images/dragons/egg.png";
  } else if (stage === 2) {
    dragonScale = 0.9;
    bgGradient = "from-[#dcfce7] to-[#86efac]";
    modelUrl = "/images/dragons/baby_dragon.glb";
    fallbackUrl = "/images/dragons/baby.png";
  } else if (stage === 3) {
    dragonScale = 1.1;
    bgGradient = "from-[#ffedd5] to-[#fdbb2d]";
    modelUrl = "/images/dragons/teen_dragon.glb";
    fallbackUrl = "/images/dragons/teen.png";
  } else if (stage === 4) {
    dragonScale = 1.2;
    bgGradient = "from-[#e0f2fe] to-[#7dd3fc]";
    modelUrl = "/images/dragons/teen_dragon.glb";
    fallbackUrl = "/images/dragons/teen.png";
  } else if (stage === 5) {
    dragonScale = 1.25;
    bgGradient = "from-[#f3e8ff] to-[#c084fc]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  } else if (stage === 6) {
    dragonScale = 1.3;
    bgGradient = "from-[#bae6fd] to-[#38bdf8]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  } else if (stage === 7) {
    dragonScale = 1.35;
    bgGradient = "from-[#ccfbf1] to-[#2dd4bf]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  } else if (stage === 8) {
    dragonScale = 1.4;
    bgGradient = "from-[#fee2e2] to-[#ef4444]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  } else if (stage === 9) {
    dragonScale = 1.45;
    bgGradient = "from-[#fef9c3] to-[#eab308]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  } else {
    dragonScale = 1.5;
    bgGradient = "from-[#e0e7ff] to-[#6366f1]";
    modelUrl = "/images/dragons/legendary_dragon.glb";
    fallbackUrl = "/images/dragons/adult.png";
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center">
      <div className="w-full max-w-[430px] flex-1 bg-surface-bright flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center sticky top-0 z-50 bg-surface-bright border-b border-surface-variant/20 shadow-sm">
          <button 
            onClick={() => returnTo ? navigate(returnTo) : navigate(-1)} 
            className="p-1 -ml-2 rounded-full hover:bg-surface-container-highest transition-colors"
          >
            <ArrowLeft size={24} className="text-[#141779]" />
          </button>
          <h1 className="text-[20px] font-black text-[#141779] uppercase tracking-wide flex-1 text-center -mr-6">Dragon Evolution</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="text-center mb-10 z-10">
            <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">{stageName}</h2>
            <p className="text-on-surface-variant font-medium text-sm">Level {stage} Companion</p>
          </div>

          {/* Avatar Container */}
          <div className={`w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br ${bgGradient} flex items-center justify-center text-9xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 border-4 border-white ${stage >= 5 ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center p-2 rounded-full overflow-hidden">
              <InteractiveCompanion scale={dragonScale} url={modelUrl} fallbackImage={fallbackUrl} />
            </div>
            
            {stage >= 3 && (
              <div className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
            )}
          </div>

          {/* Progress Section */}
          <div className="w-full mt-16 bg-white p-6 rounded-3xl shadow-lg border border-outline-variant/20 z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-label-md font-bold text-on-surface-variant">Evolution Progress</span>
              <span className="text-label-md font-bold text-primary">{Math.round(percentage)}%</span>
            </div>
            
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden mb-4 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary-fixed transition-all duration-1000 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-outline font-medium">
              <span>{xp} XP Earned</span>
              <span>{stage === 10 ? "Max Stage Reached!" : `${evoData?.nextStageXp?.toLocaleString() || 50000} XP for Next Stage`}</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (returnTo) navigate(returnTo, { state: location.state });
              else navigate('/home');
            }}
            className="mt-8 bg-primary text-on-primary w-full py-4 rounded-full font-bold text-lg shadow-[0_8px_20px_rgba(20,23,121,0.3)] hover:opacity-90 active:scale-95 transition-all z-10 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Keep Learning to Grow!
          </button>
        </main>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 -left-10 w-40 h-40 bg-primary-fixed rounded-full blur-[80px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-secondary-fixed rounded-full blur-[80px] opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
