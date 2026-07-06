import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { apiFetch } from "../../../api";

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

  // Determine Emoji based on stage
  let avatar = "🥚";
  let bgGradient = "from-surface-container to-surface-container-highest";
  if (stage === 2) { avatar = "🐣"; bgGradient = "from-[#fdfcfb] to-[#e2d1c3]"; }
  if (stage === 3) { avatar = "🦎"; bgGradient = "from-[#a8ff78] to-[#78ffd6]"; }
  if (stage === 4) { avatar = "🐉"; bgGradient = "from-[#ff9966] to-[#ff5e62]"; }
  if (stage === 5) { avatar = "🔥"; bgGradient = "from-[#f12711] to-[#f5af19]"; }
  if (stage === 6) { avatar = "✨🐲✨"; bgGradient = "from-[#8E2DE2] to-[#4A00E0]"; }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center">
      <div className="w-full max-w-[430px] flex-1 bg-surface-bright flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-center sticky top-0 z-50 bg-surface-bright border-b border-surface-variant/20 shadow-sm">
          <h1 className="text-[24px] font-black text-[#141779] uppercase tracking-wide">Dragon Evolution</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="text-center mb-10 z-10">
            <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">{stageName}</h2>
            <p className="text-on-surface-variant font-medium text-sm">Level {stage} Companion</p>
          </div>

          {/* Avatar Container */}
          <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-9xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 border-4 border-white ${stage >= 5 ? 'animate-pulse' : ''}`}>
            
            {stage === 1 ? (
              <svg viewBox="0 0 100 120" className="w-40 h-40 drop-shadow-2xl">
                {/* Dragon Peeking (only at 95%+) */}
                <g className={`transition-all duration-1000 ${percentage >= 95 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {/* Dragon Face */}
                  <circle cx="50" cy="60" r="22" fill="#34d399" />
                  <circle cx="42" cy="55" r="4" fill="#064e3b" />
                  <circle cx="58" cy="55" r="4" fill="#064e3b" />
                  {/* Snout */}
                  <ellipse cx="50" cy="68" rx="12" ry="8" fill="#10b981" />
                  <path d="M 45 68 Q 50 72 55 68" stroke="#064e3b" strokeWidth="1.5" fill="none" />
                </g>

                {percentage < 50 ? (
                  /* WHOLE EGG (0% to 49%) */
                  <g>
                    <path d="M 10 70 C 10 20 30 5 50 5 C 70 5 90 20 90 70 Q 90 115 50 115 Q 10 115 10 70 Z" fill="#fffefc" stroke="#eaddd1" strokeWidth="2" />
                    {/* Cracks appear progressively */}
                    {percentage >= 5 && <path d="M 50 5 L 47 20 L 52 30 L 49 45" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 10 && <path d="M 30 20 L 35 30 L 25 40" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 15 && <path d="M 70 25 L 65 35 L 75 45" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 20 && <path d="M 49 45 L 40 55 L 45 65" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 25 && <path d="M 75 45 L 65 55 L 70 65" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 30 && <path d="M 25 40 L 35 55 L 20 65" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 35 && <path d="M 50 115 L 48 100 L 53 90" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 40 && <path d="M 20 65 L 30 75 L 25 85 L 35 95" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                    {percentage >= 45 && <path d="M 70 65 L 60 75 L 65 85 L 55 95" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                  </g>
                ) : (
                  /* BROKEN EGG (50% to 100%) */
                  <g>
                    {/* Bottom Shell */}
                    <path d="M 10 70 Q 10 115 50 115 Q 90 115 90 70 L 75 62 L 60 72 L 50 60 L 40 72 L 25 62 Z" fill="#fffefc" stroke="#eaddd1" strokeWidth="2" />
                    
                    {/* Bottom Cracks */}
                    <path d="M 50 115 L 48 100 L 53 90 L 50 80" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    <path d="M 25 62 L 30 75 L 25 85 L 35 95" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    <path d="M 75 62 L 60 75 L 65 85 L 55 95" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

                    {/* Top Shell (Moves up at 50%, moves more and rotates at 95%) */}
                    <g className={`transition-all duration-1000 origin-[80px_30px] ${percentage >= 95 ? '-translate-y-8 rotate-[20deg]' : 'translate-y-0'}`}>
                      <path d="M 10 70 C 10 20 30 5 50 5 C 70 5 90 20 90 70 L 75 62 L 60 72 L 50 60 L 40 72 L 25 62 Z" fill="#fffefc" stroke="#eaddd1" strokeWidth="2" />
                      {/* Top Cracks */}
                      <path d="M 50 5 L 47 20 L 52 30 L 49 45 L 40 55" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                      <path d="M 30 20 L 35 30 L 25 40" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                      <path d="M 70 25 L 65 35 L 75 45 L 65 55" stroke="#a8a29e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    </g>
                  </g>
                )}
              </svg>
            ) : (
              <span className={`drop-shadow-2xl ${stage === 1 ? 'animate-bounce' : ''}`}>{avatar}</span>
            )}
            
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
              <span>10,000 XP for Max</span>
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
