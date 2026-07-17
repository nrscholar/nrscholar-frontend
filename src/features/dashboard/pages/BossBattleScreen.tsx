import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Swords } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import DragonCharacter from "../../../components/DragonCharacter";
import MonsterCharacter from "../../../components/MonsterCharacter";

// Fire Sparks particle config for Boss Battle background
const FIRE_PARTICLES_CONFIG = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    color: { value: ["#ff6600", "#ff4400", "#ffcc00", "#ff0000"] },
    move: { direction: "top" as const, enable: true, speed: 2, outModes: { default: "out" as const } },
    number: { value: 25 },
    opacity: { value: { min: 0.05, max: 0.25 }, animation: { enable: true, speed: 2 } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 4 } },
    life: { duration: { sync: false, value: 3 }, count: 0 },
  },
  detectRetina: true,
};

export default function BossBattleScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const worldId = searchParams.get("worldId") || "w1";
  const returnTo = searchParams.get("returnTo");

  const [loading, setLoading] = useState(true);
  const [battleData, setBattleData] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [attacking, setAttacking] = useState(false);
  const [actionResult, setActionResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [lossOverlay, setLossOverlay] = useState({ show: false, xpLoss: 0 });
  const [particlesInit, setParticlesInit] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQIndex]);

  const submitActivityLog = async (answersToSubmit: any[]) => {
      try {
          if (!answersToSubmit.length) return;
          const tQ = answersToSubmit.length;
          const cQ = answersToSubmit.filter(a => a?.isCorrect).length;
          const timeTaken = answersToSubmit.reduce((acc, a) => acc + (a?.timeSpent || 0), 0);
          const details = answersToSubmit.map(a => ({
             questionText: a.questionText || "Question",
             isCorrect: !!a.isCorrect,
             timeSpent: a.timeSpent || 0
          }));
          
          await apiFetch("/api/parent/activities", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  title: `${searchParams.get("chapterName") || ""} ${searchParams.get("difficulty") || "easy"} Boss Battle`.trim(),
                  type: "battle",
                  timeTaken,
                  correctQuestions: cQ,
                  totalQuestions: tQ,
                  details,
                  chapter: searchParams.get("chapterName") || undefined,
                  subject: searchParams.get("subjectName") || undefined
              })
          });
      } catch (e) {
          console.error("Failed to submit activity log", e);
      }
  };

  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine); }).then(() => setParticlesInit(true));
  }, []);

  const confettiInit = useCallback(async (engine: any) => { await loadSlim(engine); }, []);

  useEffect(() => {
    const startBattle = async () => {
      try {
        const chapterId = searchParams.get("chapterId") || undefined;
        const difficulty = searchParams.get("difficulty") || "easy";
        
        const bodyData = { 
            worldId,
            chapterId,
            chapterName: searchParams.get("chapterName") || undefined,
            subjectName: searchParams.get("subjectName") || undefined,
            difficulty
        };
        
        const res = await apiFetch("/api/world/boss/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData)
        });
        const json = await res.json();
        if (json.success && json.data) {
          setBattleData(json.data);
        } else {
          console.error("Boss API returned false:", json.message);
        }
      } catch (e) {
        console.error("Failed to start boss battle", e);
      } finally {
        setLoading(false);
      }
    };
    startBattle();
  }, [worldId]);

  const isAttackingRef = useRef(false);

  const handleAttack = async () => {
    if (selected === null || !battleData || isAttackingRef.current) return;
    isAttackingRef.current = true;
    setAttacking(true);
    
    // Wrap index so we don't run out of questions in hard mode
    const actualIndex = currentQIndex % battleData.questions.length;
    const currentQ = battleData.questions[actualIndex];
    // Use direct value comparison in case of duplicate options
    const isCorrect = currentQ.options[selected] === currentQ.answer;
    
    setActionResult(isCorrect ? "correct" : "wrong");

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const newAnswer = {
        questionText: currentQ.question,
        isCorrect,
        timeSpent
    };
    const newAnswers = [...userAnswers, newAnswer];
    setUserAnswers(newAnswers);

    // Optimistically update health for immediate animation
    setBattleData(prev => ({
        ...prev,
        bossHP: isCorrect ? Math.max(prev.bossHP - 10, 0) : prev.bossHP,
        playerHearts: isCorrect ? prev.playerHearts : Math.max(prev.playerHearts - 1, 0)
    }));

    try {
      const res = await apiFetch("/api/world/boss/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          battleId: battleData.battleId, 
          questionId: currentQ._id,
          answer: currentQ.options[selected] 
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const { bossHP, playerHearts, status, coinsReward } = json.data;
        
        // Wait for animation (longer if wrong so the boss attack plays out)
        const delay = isCorrect ? 1000 : 1800;
        setTimeout(() => {
          setBattleData(prev => ({ ...prev, bossHP, playerHearts }));
          if (status === "WON") {
            const rewardAmt = coinsReward || 1000;
            const chapterId = searchParams.get("chapterId");
            const level = searchParams.get("difficulty") || "easy";
            
            // 🎉 Trigger confetti burst!
            setShowConfetti(true);
            
            if (chapterId) {
                const existingAnswers = location.state?.userAnswers || [];
                apiFetch("/api/practice/chapter-progress", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    chapterId: chapterId,
                    currentQ: 10,
                    score: existingAnswers.length,
                    completed: true,
                    readingCompleted: true,
                    questionsCompleted: true,
                    bossCompleted: true,
                    chapterCompleted: true,
                    answers: existingAnswers
                  })
                }).catch(console.error);
            }
            
            submitActivityLog(newAnswers).catch(() => {});

            // Wait 2s for confetti to show, then navigate
            setTimeout(() => {
              if (returnTo) {
                 navigate(`/practice/reward?type=boss&amount=${rewardAmt}&returnTo=${encodeURIComponent(returnTo)}`, { state: location.state, replace: true });
              } else {
                 navigate(`/practice/reward?type=coins&amount=${rewardAmt}&returnTo=/practice/journey-map`, { replace: true });
              }
            }, 1000);
          } else if (status === "LOST") {
            setLossOverlay({ show: true, xpLoss: json.data.xpLoss || -30 });
            
            submitActivityLog(newAnswers).catch(() => {});
            
            // Wait 3 seconds to show the animation, then navigate
            setTimeout(() => {
                const chapterId = searchParams.get("chapterId");
                const chapterName = searchParams.get("chapterName");
                if (chapterId) {
                    const existingAnswers = location.state?.userAnswers || [];
                    const rewindAnswers = existingAnswers.slice(0, 9);
                    const rewindScore = rewindAnswers.filter((a: any) => a?.isCorrect).length;
                    const level = searchParams.get("difficulty") || "easy";
    
                    apiFetch("/api/practice/chapter-progress", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        chapterId: chapterId,
                        currentQ: 9, // Rewind to 10th question
                        score: rewindScore,
                        completed: false,
                        readingCompleted: true,
                        questionsCompleted: false,
                        bossCompleted: false,
                        chapterCompleted: false,
                        answers: rewindAnswers
                      })
                    }).then(() => {
                        const returnDest = `/practice/chapters`;
                        navigate(returnDest, { replace: true });
                    }).catch(() => {
                        navigate("/practice/chapters", { replace: true });
                    });
                } else if (returnTo) {
                   navigate(returnTo, { state: location.state, replace: true });
                } else {
                   navigate("/practice/chapters", { replace: true });
                }
            }, 3000);
          } else {
            setCurrentQIndex(prev => prev + 1);
            setSelected(null);
            setAttacking(false);
            isAttackingRef.current = false;
            setActionResult("idle");
          }
        }, delay);
      }
    } catch (e) {
      console.error(e);
      setAttacking(false);
      isAttackingRef.current = false;
      setActionResult("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-inverse-surface flex items-center justify-center">
        <Swords className="text-error animate-pulse" size={48} />
      </div>
    );
  }

  if (!battleData || battleData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-inverse-surface flex flex-col items-center justify-center text-white px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Boss has fled!</h2>
        <button onClick={() => navigate(-1)} className="bg-primary text-white px-6 py-3 rounded-full font-bold">
          Retreat
        </button>
      </div>
    );
  }

  const { bossName, bossHP, maxHP, playerHearts, questions } = battleData;
  const currentQ = questions && questions.length > 0 ? questions[currentQIndex % questions.length] : null;

  // Format question to fit nicely on one line
  let displayQuestion = currentQ?.question || "Prepare yourself!";
  // 1. Remove redundant "Boss Attack (Easy): " prefixes
  displayQuestion = displayQuestion.replace(/^Boss Attack \([A-Za-z]+\):\s*/i, '');
  // 2. Prevent math equations from wrapping by replacing spaces with non-breaking spaces
  displayQuestion = displayQuestion.replace(/(\d+)\s+([+\-*/])\s+(\d+)/g, '$1\u00A0$2\u00A0$3');

  return (
    <div className={`min-h-screen bg-background text-on-background flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-300 ${actionResult === 'wrong' ? 'bg-error-container/20 animate-hard-shake' : ''}`}>
      <style>{`
        .glass-hud {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 20px rgba(0, 106, 98, 0.1);
        }
        @keyframes hard-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-15px); }
            20%, 40%, 60%, 80% { transform: translateX(15px); }
        }
        .animate-hard-shake {
            animation: hard-shake 1.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes boss-zoom {
            0% { transform: scale(1); }
            20% { transform: scale(1.5); filter: drop-shadow(0 0 30px rgba(186, 26, 26, 1)); z-index: 50; }
            80% { transform: scale(1.5); filter: drop-shadow(0 0 30px rgba(186, 26, 26, 1)); z-index: 50; }
            100% { transform: scale(1); }
        }
        .animate-boss-attack {
            animation: boss-zoom 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes player-zoom {
            0% { transform: scaleX(-1) scale(1); }
            20% { transform: scaleX(-1) scale(1.5); filter: drop-shadow(0 0 30px rgba(0, 229, 255, 1)); z-index: 50; }
            80% { transform: scaleX(-1) scale(1.5); filter: drop-shadow(0 0 30px rgba(0, 229, 255, 1)); z-index: 50; }
            100% { transform: scaleX(-1) scale(1); }
        }
        .animate-player-attack {
            animation: player-zoom 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .boss-glow {
            filter: drop-shadow(0 0 15px rgba(20, 23, 121, 0.4));
            animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
        }
        .choice-pod {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .choice-pod:active {
            transform: scale(0.95);
        }
        .scanline {
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 106, 98, 0.05) 50%);
            background-size: 100% 4px;
            pointer-events: none;
        }
      `}</style>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 scanline z-10 pointer-events-none"></div>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#e8ddff] z-0"></div>
      
      {/* Fire Sparks particles - non-interactive background */}
      {particlesInit && (
        <Particles
          id="boss-fire-particles"
          options={FIRE_PARTICLES_CONFIG}
          className="absolute inset-0 z-[1] pointer-events-none"
        />
      )}

      {/* Confetti burst on win */}
      {showConfetti && particlesInit && (
        <Particles
          id="boss-confetti"
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              color: { value: ["#ff0080", "#ffcc00", "#00e5ff", "#58cc02", "#ff6600", "#e040fb"] },
              move: { direction: "bottom" as const, enable: true, speed: 6, gravity: { enable: true, acceleration: 5 } },
              number: { value: 80 },
              opacity: { value: { min: 0.6, max: 1 } },
              shape: { type: ["square", "circle"] },
              size: { value: { min: 4, max: 10 } },
              rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 15 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-[200] pointer-events-none"
        />
      )}

      {/* Decorative Clouds */}
      <div className="absolute top-[20%] left-[-10%] w-48 h-16 bg-white/40 blur-xl rounded-full z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-64 h-24 bg-white/50 blur-xl rounded-full z-0"></div>

      {/* Top App Bar (HUD Style) */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/30 backdrop-blur-md border-b border-white/40">
        <div className="flex items-center gap-3">
          <button onClick={async () => { await submitActivityLog(userAnswers); navigate(-1); }} className="w-10 h-10 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform shadow-sm">
            <ArrowLeft className="text-[#141779]" size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#30007f] opacity-80 leading-none">Dragon Academy</span>
            <span className="text-lg font-black text-[#141779] uppercase">{searchParams.get("difficulty") || "Easy"} Boss</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-white/80 shadow-sm">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              size={20} 
              className={`${i < playerHearts ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'fill-transparent text-[#afafaf]'} transition-all duration-300 drop-shadow-sm`} 
            />
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[430px] flex-1 flex flex-col items-center justify-between px-6 relative z-20 pt-20 pb-8 overflow-y-auto">
        
        {/* RPG Battle Arena: Player (Left) vs Boss (Right) */}
        <div className="w-full flex justify-between items-center mb-8 mt-4 relative">
            
            {/* Player Dragon (Left Side) */}
            <div className="flex flex-col items-center">
              {/* Player Hearts Indicator */}
              <div className="flex items-center gap-1 mb-2">
                 {[...Array(playerHearts)].map((_, i) => <Heart key={i} size={14} className="fill-[#ff0055] text-[#ff0055] animate-pulse" />)}
                 {[...Array(3 - playerHearts)].map((_, i) => <Heart key={i+3} size={14} className="fill-transparent text-[#afafaf]" />)}
              </div>
               <div className="relative">
                 <DragonCharacter
                   state={actionResult === 'correct' ? 'attack' : actionResult === 'wrong' ? 'hurt' : 'idle'}
                   flipped={actionResult !== 'correct'}
                   className="w-28 h-28"
                 />
                 {/* Damage Number Overlay for Dragon */}
                 {actionResult === 'wrong' && (
                    <span className="absolute top-0 right-[-10px] text-red-500 font-black text-2xl drop-shadow-md animate-[ping_0.5s_ease-out_forwards] z-50">-1 ❤️</span>
                 )}
               </div>
             </div>

            {/* VS Badge */}
            <div className="w-10 h-10 rounded-full bg-[#ffcc00] border-4 border-white flex items-center justify-center font-black text-[#141779] text-sm z-30 shadow-lg absolute left-1/2 -translate-x-1/2">
                VS
            </div>

            {/* Boss (Right Side) */}
            <div className="flex flex-col items-center">
              {/* Boss HP Bar */}
              <div className="w-16 h-2 rounded-full mb-3 overflow-hidden border border-white/80 bg-white/50 shadow-inner">
                <div className="h-full bg-[#ba1a1a] transition-all duration-1000" style={{ width: `${Math.max((bossHP / maxHP) * 100, 0)}%` }}></div>
              </div>
              <div className="relative">
                <div className="absolute inset-[-5px] bg-[#ba1a1a]/10 rounded-full blur-lg z-0 animate-pulse"></div>
                <MonsterCharacter
                  state={actionResult === 'wrong' ? 'attack' : actionResult === 'correct' ? 'hurt' : 'idle'}
                  className="w-28 h-28 relative z-10"
                />
                {/* Damage Number Overlay for Boss */}
                {actionResult === 'correct' && (
                   <span className="absolute top-0 left-[-10px] text-[#00e5ff] font-black text-2xl drop-shadow-md animate-[ping_0.5s_ease-out_forwards] z-50">-10 HP</span>
                )}
              </div>
            </div>

        </div>

        {/* Boss Speech Bubble Question */}
        <div className="w-full bg-white p-5 rounded-[24px] rounded-tr-none border-2 border-gray-200 relative shadow-[0_4px_0_rgba(0,0,0,0.05)] mb-8 text-center mt-4">
            {/* Speech Bubble Arrow pointing TOP RIGHT towards the Boss */}
            <div className="absolute -right-3 -top-3 w-6 h-6 bg-white border-t-2 border-r-2 border-gray-200 transform rotate-45" />
            <p className="text-[12px] text-[#ba1a1a] mb-1 uppercase tracking-widest font-black">Boss is Attacking!</p>
            <h2 className="text-[20px] font-bold text-[#4b4b4b] leading-snug">{displayQuestion}</h2>
        </div>

        {/* Options Bento Grid */}
        <div className="grid grid-cols-2 gap-3.5 w-full relative z-20">
          {currentQ?.options?.map((opt: string, idx: number) => {
            const isSelected = selected === idx;
            let buttonClass = "bg-white border-2 border-gray-200 border-b-[4px] active:border-b-2 active:translate-y-[2px] active:mt-[2px] active:mb-[-2px]";
            let textClass = "text-[#4b4b4b]";
            
            if (isSelected) {
               if (actionResult === 'correct') {
                 buttonClass = "bg-[#e8ddff] border-2 border-[#30007f] border-b-[4px]";
                 textClass = "text-[#1d0052]";
               } else if (actionResult === 'wrong') {
                 buttonClass = "bg-[#ffdad6] border-2 border-[#ba1a1a] border-b-[4px]";
                 textClass = "text-[#ba1a1a]";
               } else {
                 buttonClass = "bg-[rgba(224,224,255,0.4)] border-2 border-[#141779] border-b-[4px]";
                 textClass = "text-[#141779]";
               }
            }
            
            return (
              <button
                key={idx}
                disabled={attacking}
                onClick={() => {
                  setSelected(idx);
                  // Auto-submit on select for this design
                  setTimeout(() => document.getElementById('attack-btn')?.click(), 100);
                }}
                className={`choice-pod rounded-[16px] py-[18px] px-3 flex flex-col items-center justify-center relative transition-all ${buttonClass}`}
              >
                <span className={`text-[20px] font-bold ${textClass}`}>{opt}</span>
              </button>
            );
          })}
        </div>
        
        {/* Hidden attack button to trigger logic after selection */}
        <button id="attack-btn" onClick={handleAttack} className="hidden">Attack</button>
      </main>
      
      {/* Defeat Overlay Animation */}
      {lossOverlay.show && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md px-6 text-center"
        >
            <motion.div
               initial={{ scale: 0.5, y: 50 }}
               animate={{ scale: 1, y: 0 }}
               transition={{ type: "spring", bounce: 0.5 }}
               className="bg-[#ffdad6] border-[4px] border-[#ba1a1a] rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(186,26,26,0.5)]"
            >
                <div className="text-[60px] mb-2 animate-bounce">☠️</div>
                <h2 className="text-3xl font-black text-[#ba1a1a] uppercase tracking-widest mb-2">Defeated!</h2>
                <p className="text-lg font-bold text-[#4b4b4b] mb-6">The Boss was too strong this time. Fall back and try again!</p>
                <div className="bg-white rounded-xl p-4 border-2 border-[#ba1a1a]/30">
                    <span className="text-sm font-bold text-[#afafaf] uppercase tracking-widest block mb-1">Penalty</span>
                    <span className="text-3xl font-black text-[#ba1a1a]">{lossOverlay.xpLoss} XP</span>
                </div>
            </motion.div>
        </motion.div>
      )}
    </div>
  );
}
