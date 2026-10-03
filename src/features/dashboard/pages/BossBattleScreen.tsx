import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Swords, Sparkles, CheckCircle2, XCircle, Shield } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import DragonCharacter from "../../../components/DragonCharacter";
import MonsterCharacter from "../../../components/MonsterCharacter";
import { useTranslation } from "react-i18next";

// Fire Sparks particle config for Boss Battle background
const FIRE_PARTICLES_CONFIG = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    color: { value: ["#ff6600", "#ff4400", "#ffcc00", "#00f5d4"] },
    move: { direction: "top" as const, enable: true, speed: 2, outModes: { default: "out" as const } },
    number: { value: 30 },
    opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 2 } },
    shape: { type: "circle" },
    size: { value: { min: 1.5, max: 4.5 } },
    life: { duration: { sync: false, value: 3 }, count: 0 },
  },
  detectRetina: true,
};

export default function BossBattleScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const worldId = searchParams.get("worldId") || "w1";
  const returnTo = searchParams.get("returnTo");

  // Sync active language setting from user/child profile or localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    let targetLang = localStorage.getItem("i18nextLng");

    if (storedUserData) {
      try {
        const u = JSON.parse(storedUserData);
        const activeChildId = u.activeChildId || "child_1";
        const activeChild = (u.children || []).find((c: any) => c.childId === activeChildId);
        if (activeChild && (activeChild.prefLanguage || activeChild.language)) {
          targetLang = activeChild.prefLanguage || activeChild.language;
        } else if (u.language) {
          targetLang = u.language;
        }
      } catch (e) {}
    }

    if (targetLang && i18n && typeof i18n.changeLanguage === 'function' && i18n.language !== targetLang) {
      localStorage.setItem("i18nextLng", targetLang);
      i18n.changeLanguage(targetLang);
    }
  }, [i18n]);

  const [loading, setLoading] = useState(true);
  const [battleData, setBattleData] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [attacking, setAttacking] = useState(false);
  const [actionResult, setActionResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [lossOverlay, setLossOverlay] = useState({ show: false, xpLoss: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [userCoins, setUserCoins] = useState(0);

  // Animated Battle Effects State
  const [projectile, setProjectile] = useState<{ show: boolean; type: "dragon" | "boss" }>({ show: false, type: "dragon" });
  const [damagePopup, setDamagePopup] = useState<{ show: boolean; text: string; target: "dragon" | "boss" }>({ show: false, text: "", target: "boss" });

  const openReviveModal = async () => {
    setShowReviveModal(true);
    try {
      const res = await apiFetch("/api/users/me");
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUserCoins(json.data.user.coins || 0);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      const res = await apiFetch("/api/retention/spin-wheel/status");
      const json = await res.json();
      if (json && json.balances) {
        setRevivalSpins(json.balances.boss_revival_spins_balance || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const [particlesInit, setParticlesInit] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [revivalSpins, setRevivalSpins] = useState(0);
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [pendingLossData, setPendingLossData] = useState<any>(null);

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
        
        const shuffleOpts = (opts: string[]) => {
          if (!opts || !Array.isArray(opts) || opts.length < 2) return opts;
          const list = [...opts];
          for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
          }
          return list;
        };

        const createDemoQuestions = () => [
          { _id: "b1", question: "Which of the following is a synonym for 'courageous'?", options: shuffleOpts(["Brave", "Fearful", "Tired", "Silent"]), answer: "Brave" },
          { _id: "b2", question: "Which of the following is the opposite of the word 'fast'?", options: shuffleOpts(["Slow", "Quick", "Swift", "Bright"]), answer: "Slow" },
          { _id: "b3", question: "Which of these is a primary color?", options: shuffleOpts(["Red", "Green", "Purple", "Orange"]), answer: "Red" },
          { _id: "b4", question: "What is the capital city of France?", options: shuffleOpts(["Paris", "London", "Berlin", "Rome"]), answer: "Paris" },
          { _id: "b5", question: "How many sides does a triangle have?", options: shuffleOpts(["3", "4", "5", "6"]), answer: "3" },
        ];

        if (json.success && json.data && json.data.questions && json.data.questions.length > 0) {
          const processedQuestions = json.data.questions.map((q: any) => ({
            ...q,
            options: shuffleOpts(q.options)
          }));
          setBattleData({
            ...json.data,
            questions: processedQuestions
          });
        } else {
          setBattleData({
            battleId: "demo_b1",
            bossName: searchParams.get("chapterName") || "Boss Guardian",
            bossHP: 50,
            maxHP: 50,
            playerHearts: 3,
            questions: createDemoQuestions()
          });
        }
      } catch (e) {
        console.error("Failed to start boss battle", e);
        setBattleData({
          battleId: "demo_b1",
          bossName: "Boss Guardian",
          bossHP: 50,
          maxHP: 50,
          playerHearts: 3,
          questions: [
            { _id: "b1", question: "Which of the following is a synonym for 'courageous'?", options: ["Fearful", "Brave", "Tired", "Silent"], answer: "Brave" },
            { _id: "b2", question: "Which of the following is the opposite of the word 'fast'?", options: ["Quick", "Slow", "Swift", "Bright"], answer: "Slow" },
            { _id: "b3", question: "Which of these is a primary color?", options: ["Green", "Purple", "Red", "Orange"], answer: "Red" },
            { _id: "b4", question: "What is the capital city of France?", options: ["London", "Paris", "Berlin", "Rome"], answer: "Paris" },
            { _id: "b5", question: "How many sides does a triangle have?", options: ["4", "3", "5", "6"], answer: "3" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    startBattle();
  }, [worldId]);

  const isAttackingRef = useRef(false);

  const handleAttack = async (optIndex?: number) => {
    const chosenIndex = optIndex !== undefined ? optIndex : selected;
    // STRICT GUARD: Prevent duplicate calls for the same question
    if (
      chosenIndex === null || 
      chosenIndex === undefined || 
      !battleData || 
      isAttackingRef.current || 
      selected !== null || 
      attacking
    ) return;
    
    isAttackingRef.current = true;
    setSelected(chosenIndex);
    setAttacking(true);
    
    // Wrap index so we don't run out of questions in hard mode
    const actualIndex = currentQIndex % battleData.questions.length;
    const currentQ = battleData.questions[actualIndex];
    // Use direct value comparison in case of duplicate options
    const isCorrect = String(currentQ.options[chosenIndex]).trim() === String(currentQ.answer).trim();
    
    setActionResult(isCorrect ? "correct" : "wrong");

    // Trigger visual battle effects & projectiles
    if (isCorrect) {
      setProjectile({ show: true, type: "dragon" });
      setTimeout(() => {
        setProjectile({ show: false, type: "dragon" });
        setDamagePopup({ show: true, text: "-10 HP", target: "boss" });
        setTimeout(() => setDamagePopup({ show: false, text: "", target: "boss" }), 1000);
      }, 400);
    } else {
      setProjectile({ show: true, type: "boss" });
      setTimeout(() => {
        setProjectile({ show: false, type: "boss" });
        setDamagePopup({ show: true, text: "-1 ❤️", target: "dragon" });
        setTimeout(() => setDamagePopup({ show: false, text: "", target: "dragon" }), 1000);
      }, 400);
    }

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const newAnswer = {
        questionText: currentQ.question,
        isCorrect,
        timeSpent
    };
    const newAnswers = [...userAnswers, newAnswer];
    setUserAnswers(newAnswers);

    const delay = isCorrect ? 1400 : 2000;

    // Optimistically update health for immediate animation (STRICTLY 1 heart loss)
    setBattleData((prev: any) => ({
        ...prev,
        bossHP: isCorrect ? Math.max(prev.bossHP - 10, 0) : prev.bossHP,
        playerHearts: isCorrect ? prev.playerHearts : Math.max(prev.playerHearts - 1, 0)
    }));

    if (battleData.battleId === "demo_b1" || !battleData.battleId) {
      setTimeout(() => {
        const nextBossHp = isCorrect ? Math.max(battleData.bossHP - 10, 0) : battleData.bossHP;
        const nextHearts = isCorrect ? battleData.playerHearts : Math.max(battleData.playerHearts - 1, 0);

        if (nextBossHp <= 0) {
          setShowConfetti(true);
          submitActivityLog(newAnswers).catch(() => {});
          setTimeout(() => {
            if (returnTo) {
               navigate(`/practice/reward?type=boss&amount=1000&returnTo=${encodeURIComponent(returnTo)}`, { state: location.state, replace: true });
            } else {
               navigate(`/practice/reward?type=coins&amount=1000&returnTo=/practice/journey-map`, { replace: true });
            }
          }, 1000);
        } else if (nextHearts <= 0) {
          submitActivityLog(newAnswers).catch(() => {});
          setPendingLossData({ xpLoss: -30, newAnswers });
          openReviveModal();
        } else {
          setCurrentQIndex(prev => prev + 1);
          setSelected(null);
          setAttacking(false);
          isAttackingRef.current = false;
          setActionResult("idle");
        }
      }, delay);
      return;
    }

    try {
      const res = await apiFetch("/api/world/boss/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          battleId: battleData.battleId, 
          questionId: currentQ._id,
          answer: currentQ.options[chosenIndex] 
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const { bossHP, playerHearts, status, coinsReward } = json.data;
        
        setTimeout(() => {
          setBattleData((prev: any) => ({ ...prev, bossHP, playerHearts }));
          if (status === "WON") {
            const rewardAmt = coinsReward || 1000;
            const chapterId = searchParams.get("chapterId");
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

            setTimeout(() => {
              if (returnTo) {
                 navigate(`/practice/reward?type=boss&amount=${rewardAmt}&returnTo=${encodeURIComponent(returnTo)}`, { state: location.state, replace: true });
              } else {
                 navigate(`/practice/reward?type=coins&amount=${rewardAmt}&returnTo=/practice/journey-map`, { replace: true });
              }
            }, 1000);
          } else if (status === "LOST") {
            submitActivityLog(newAnswers).catch(() => {});
            setPendingLossData({
              xpLoss: json.data.xpLoss || -30,
              newAnswers
            });
            openReviveModal();
          } else {
            setCurrentQIndex(prev => prev + 1);
            setSelected(null);
            setAttacking(false);
            isAttackingRef.current = false;
            setActionResult("idle");
          }
        }, delay);
      } else {
        setTimeout(() => {
          setCurrentQIndex(prev => prev + 1);
          setSelected(null);
          setAttacking(false);
          isAttackingRef.current = false;
          setActionResult("idle");
        }, delay);
      }
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
        setSelected(null);
        setAttacking(false);
        isAttackingRef.current = false;
        setActionResult("idle");
      }, delay);
    }
  };

  const handleGiveUp = async () => {
    setShowReviveModal(false);
    const xpLoss = pendingLossData?.xpLoss || -30;
    setLossOverlay({ show: true, xpLoss });

    if (battleData?.battleId) {
      apiFetch("/api/world/boss/confirm-retreat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ battleId: battleData.battleId })
      }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efff] flex flex-col items-center justify-center text-[#141779]">
        <div className="w-12 h-12 border-4 border-[#141779] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-sm uppercase tracking-wider">{t('loading_boss_battle', 'Preparing Boss Arena...')}</p>
      </div>
    );
  }

  if (!battleData || battleData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4efff] flex flex-col items-center justify-center text-[#141779] px-6 text-center">
        <h2 className="text-2xl font-black mb-4">Boss has fled!</h2>
        <button onClick={() => navigate(-1)} className="bg-[#141779] text-white px-8 py-3 rounded-full font-black uppercase tracking-wider shadow-md">
          Retreat
        </button>
      </div>
    );
  }

  const { bossName, bossHP, maxHP, playerHearts, questions } = battleData;
  const totalQCount = questions ? questions.length : 1;
  const displayQNum = (currentQIndex % totalQCount) + 1;
  const currentQ = questions && questions.length > 0 ? questions[currentQIndex % questions.length] : null;

  // Format question text
  let displayQuestion = currentQ?.question || "Prepare yourself!";
  displayQuestion = displayQuestion.replace(/^Boss Attack \([A-Za-z]+\):\s*/i, '');
  displayQuestion = displayQuestion.replace(/(\d+)\s+([+\-*/])\s+(\d+)/g, '$1\u00A0$2\u00A0$3');

  // Find correct answer index for explicit answer feedback highlighting
  const correctAnswerIndex = currentQ && currentQ.options 
    ? currentQ.options.findIndex((opt: string) => String(opt).trim() === String(currentQ.answer).trim())
    : -1;

  const difficultyText = (searchParams.get("difficulty") || "Easy").toUpperCase();

  return (
    <div className={`min-h-screen bg-[#f4efff] text-[#141779] flex flex-col items-center justify-between relative overflow-hidden font-sans select-none transition-colors duration-500 pb-6 ${actionResult === 'wrong' ? 'animate-hard-shake' : ''}`}>
      <style>{`
        @keyframes hard-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-12px); }
            20%, 40%, 60%, 80% { transform: translateX(12px); }
        }
        .animate-hard-shake {
            animation: hard-shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      {/* Layer 1: Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4efff] via-[#ffffff] to-[#f4efff] z-0" />
      
      {/* Background Particles */}
      {particlesInit && (
        <Particles
          id="boss-fire-particles"
          options={{
            ...FIRE_PARTICLES_CONFIG,
            particles: {
              ...FIRE_PARTICLES_CONFIG.particles,
              color: { value: ["#141779", "#6C4DFF", "#ff6600", "#ffaa00", "#00b4d8"] }
            }
          }}
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
              number: { value: 90 },
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

      {/* TOP APP BAR (CURVED STICKY HUD DESIGN) */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-[28px] shadow-xs px-4 py-3 gap-2">
        {/* Left: Back button & Boss Name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={async () => { await submitActivityLog(userAnswers); navigate(-1); }} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center active:scale-95 transition-all shadow-xs shrink-0"
          >
            <ArrowLeft className="text-[#141779]" size={20} />
          </button>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate max-w-[160px]">
                {bossName || "Boss Guardian"}
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#141779] shrink-0">
                {difficultyText}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {t('boss_guardian', 'BOSS GUARDIAN')}
            </span>
          </div>
        </div>

        {/* Right: Player Hearts / Lives */}
        <div className="flex items-center gap-1.5 bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100 shadow-xs shrink-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={i < playerHearts ? { scale: [1, 1.15, 1] } : { scale: 0.9 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              <Heart 
                size={18} 
                className={`${i < playerHearts ? 'fill-[#ff2e63] text-[#ff2e63] drop-shadow-xs' : 'fill-slate-200 text-slate-300'} transition-all duration-300`} 
              />
            </motion.div>
          ))}
        </div>
      </header>

      {/* MAIN BATTLE ARENA */}
      <main className="w-full max-w-[460px] flex-1 flex flex-col items-center justify-between px-4 sm:px-6 relative z-20 pt-4 pb-4 overflow-y-auto">
        
        {/* SUB-HEADER: QUESTION PROGRESS PILL CARD */}
        <div className="flex items-center justify-between w-full bg-white/95 backdrop-blur-md border border-slate-200/80 px-4 py-2.5 rounded-2xl mb-3 shadow-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#141779]">
            QUESTION {displayQNum} OF {totalQCount}
          </span>
          <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div className="h-full bg-gradient-to-r from-[#5B5CFF] via-[#35E5D4] to-[#45D483] rounded-full transition-all duration-500" style={{ width: `${(displayQNum / totalQCount) * 100}%` }} />
          </div>
        </div>

        {/* RPG BATTLE ARENA: PLAYER (LEFT) VS BOSS (RIGHT) */}
        <div className="w-full flex justify-between items-end mb-4 relative min-h-[160px] px-2">
            
            {/* FLYING PROJECTILE ANIMATIONS */}
            <AnimatePresence>
              {projectile.show && projectile.type === "dragon" && (
                <motion.div
                  initial={{ left: "20%", top: "45%", scale: 0.5, opacity: 1 }}
                  animate={{ left: "75%", top: "45%", scale: 1.2, opacity: 0.9 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute z-40 pointer-events-none flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#141779] to-[#6C4DFF] shadow-lg shadow-[#6C4DFF]/50 flex items-center justify-center animate-spin">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                </motion.div>
              )}
              {projectile.show && projectile.type === "boss" && (
                <motion.div
                  initial={{ right: "20%", top: "45%", scale: 0.5, opacity: 1 }}
                  animate={{ right: "75%", top: "45%", scale: 1.2, opacity: 0.9 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute z-40 pointer-events-none flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff0055] to-[#ba1a1a] shadow-lg shadow-[#ff0055]/50 flex items-center justify-center animate-spin">
                    <Swords className="text-white w-6 h-6" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PLAYER DRAGON HERO (LEFT SIDE) */}
            <div className="flex flex-col items-center relative">
              {/* Player HP Header Card */}
              <div className="flex flex-col items-center mb-2 bg-white px-3.5 py-1.5 rounded-2xl border-2 border-indigo-100 shadow-md min-w-[125px] sm:min-w-[140px]">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-[#141779] flex items-center gap-1">
                  <Shield size={12} className="text-[#141779]" /> YOU (HERO)
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                   {[...Array(playerHearts)].map((_, i) => <Heart key={i} size={14} className="fill-[#ff2e63] text-[#ff2e63] drop-shadow-xs" />)}
                   {[...Array(Math.max(0, 3 - playerHearts))].map((_, i) => <Heart key={i+3} size={14} className="fill-transparent text-slate-300" />)}
                </div>
              </div>

              {/* Dragon Character with Rune Platform */}
              <div className="relative flex flex-col items-center">
                <div className="absolute bottom-0 w-24 h-6 bg-[#141779]/15 rounded-full blur-xs border border-[#141779]/30 transform rotate-X-60 animate-pulse" />
                
                <motion.div
                  animate={actionResult === 'correct' ? { x: [0, 40, 0] } : actionResult === 'wrong' ? { x: [0, -10, 10, -5, 0] } : { y: [0, -6, 0] }}
                  transition={actionResult === 'idle' ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
                  className="relative z-10"
                >
                  <DragonCharacter
                    state={actionResult === 'correct' ? 'attack' : actionResult === 'wrong' ? 'hurt' : 'idle'}
                    flipped={actionResult !== 'correct'}
                    className={`w-28 h-28 sm:w-32 sm:h-32 object-contain ${actionResult === 'wrong' ? 'brightness-125 saturate-150 text-red-500' : ''}`}
                  />
                </motion.div>

                {/* Damage Popup */}
                <AnimatePresence>
                  {damagePopup.show && damagePopup.target === "dragon" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, y: -30, scale: 1.3 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="absolute top-0 z-50 text-red-600 font-black text-2xl drop-shadow-md pointer-events-none"
                    >
                      {damagePopup.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* VS CENTER ARENA BADGE */}
            <div className="relative flex flex-col items-center justify-center self-center mb-6 z-30">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 via-[#141779] to-[#0f172a] border-2 border-white flex items-center justify-center font-black text-white text-xs shadow-md z-10">
                VS
              </div>
            </div>

            {/* BOSS GUARDIAN (RIGHT SIDE) */}
            <div className="flex flex-col items-center relative">
              {/* Boss HP Bar Card */}
              <div className="flex flex-col items-center mb-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-indigo-100 shadow-md w-36 sm:w-40">
                <div className="flex justify-between items-center w-full px-0.5 gap-1">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-[#141779] truncate">
                    {bossName || "BOSS GUARDIAN"}
                  </span>
                  <span className="text-[9.5px] font-black text-[#141779] bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full shrink-0">
                    {Math.max(0, bossHP)} / {maxHP} HP
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden p-0.5 border border-slate-200/80">
                  <div className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 rounded-full transition-all duration-500 shadow-xs" style={{ width: `${(bossHP / maxHP) * 100}%` }} />
                </div>
              </div>

              {/* Boss Character */}
              <div className="relative flex flex-col items-center">
                <div className="absolute bottom-0 w-24 h-6 bg-[#ff9f43]/15 rounded-full blur-xs border border-[#ff9f43]/30 transform rotate-X-60 animate-pulse" />
                
                <motion.div
                  animate={actionResult === 'wrong' ? { x: [0, -40, 0] } : actionResult === 'correct' ? { x: [0, 10, -10, 5, 0] } : { y: [0, -6, 0] }}
                  transition={actionResult === 'idle' ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
                  className="relative z-10"
                >
                  <MonsterCharacter
                    state={actionResult === 'wrong' ? 'attack' : actionResult === 'correct' ? 'hurt' : 'idle'}
                    className={`w-28 h-28 sm:w-32 sm:h-32 object-contain ${actionResult === 'correct' ? 'brightness-125 saturate-150 text-emerald-500' : ''}`}
                  />
                </motion.div>

                {/* Damage Popup */}
                <AnimatePresence>
                  {damagePopup.show && damagePopup.target === "boss" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, y: -30, scale: 1.3 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="absolute top-0 z-50 text-[#141779] font-black text-2xl drop-shadow-md pointer-events-none"
                    >
                      {damagePopup.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
        </div>

        {/* QUESTION SPEECH BUBBLE CARD (EXACT ORIGINAL DESIGN) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white p-5 rounded-[28px] border-2 border-[#141779] relative shadow-[0_10px_30px_rgba(20,23,121,0.12)] mb-4 text-center backdrop-blur-md"
        >
            {/* Speech Bubble Arrow pointing right towards the Boss */}
            <div className="absolute -right-2 -top-2 w-5 h-5 bg-white border-t-2 border-r-2 border-[#141779] transform rotate-45" />
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeed1] border border-[#ff9f43] mb-2.5">
              <Swords size={14} className="text-[#d97706] animate-pulse" />
              <span className="text-[10px] text-[#d97706] font-black uppercase tracking-widest">
                {t('boss_is_attacking', 'બોસ હુમલો કરી રહ્યા છે!')}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-black text-[#141779] leading-snug tracking-wide drop-shadow-xs">
              {displayQuestion}
            </h2>
        </motion.div>

        {/* ANSWER OPTIONS 2x2 BENTO GRID (EXACT ORIGINAL DESIGN) */}
        <div className="grid grid-cols-2 gap-3 w-full relative z-20 mb-2">
          {currentQ?.options?.map((opt: string, idx: number) => {
            const isSelected = selected === idx;
            const isAnswerOption = idx === correctAnswerIndex;
            
            let buttonStyle = "bg-white border-2 border-[#e0e0e0] text-[#141779] shadow-sm hover:border-[#141779] hover:bg-[#f4efff] active:scale-[0.98]";
            let badgeStyle = "bg-[#f4efff] text-[#141779] border border-[#e0e0e0]";
            let icon = null;

            if (selected !== null) {
              if (isSelected) {
                if (actionResult === 'correct') {
                  buttonStyle = "bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-300 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] scale-[1.02]";
                  badgeStyle = "bg-white text-emerald-700 font-black";
                  icon = <CheckCircle2 size={20} className="text-white animate-bounce shrink-0" />;
                } else if (actionResult === 'wrong') {
                  buttonStyle = "bg-gradient-to-r from-red-500 to-rose-600 border-2 border-red-300 text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] animate-shake";
                  badgeStyle = "bg-white text-red-700 font-black";
                  icon = <XCircle size={20} className="text-white animate-pulse shrink-0" />;
                }
              } else if (actionResult === 'wrong' && isAnswerOption) {
                buttonStyle = "bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-300 text-white shadow-[0_4px_20px_rgba(16,185,129,0.5)] animate-pulse ring-2 ring-emerald-300";
                badgeStyle = "bg-white text-emerald-700 font-black";
                icon = <CheckCircle2 size={20} className="text-white animate-bounce shrink-0" />;
              } else {
                buttonStyle = "bg-slate-100 border-slate-200 text-slate-400 opacity-50 pointer-events-none";
                badgeStyle = "bg-slate-200 text-slate-400";
              }
            }

            const optionLetters = ["A", "B", "C", "D"];

            return (
              <motion.button
                key={idx}
                disabled={selected !== null || attacking}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAttack(idx)}
                className={`h-[60px] rounded-2xl p-3 flex items-center justify-between relative transition-all duration-200 border ${buttonStyle}`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${badgeStyle}`}>
                    {optionLetters[idx] || idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-left truncate leading-tight">
                    {opt}
                  </span>
                </div>
                {icon}
              </motion.button>
            );
          })}
        </div>

      </main>
      
      {/* BOSS REVIVAL MODAL */}
      <AnimatePresence>
        {showReviveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-2 border-[#141779] rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(20,23,121,0.2)] flex flex-col items-center gap-6 text-[#141779]"
            >
              <div className="w-20 h-20 rounded-full bg-[#f4efff] border-2 border-[#141779] flex items-center justify-center animate-pulse">
                <Swords className="text-[#141779] w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#141779] uppercase tracking-widest">{t('final_chance', 'Final Chance!')}</h2>
                <p className="text-sm font-semibold text-[#464652] mt-2">
                  {t('boss_revive_desc', 'You ran out of hearts! Revive using the Revival Wheel to keep your current boss HP progress and fight on!')}
                </p>
              </div>
              
              <div className="w-full bg-[#f4efff] rounded-2xl p-4 border border-[#e0e0e0] flex justify-between items-center text-center">
                <div className="flex-1">
                  <span className="text-[10px] text-[#767683] uppercase font-black tracking-widest block mb-1">{t('revival_spins', 'Revival Spins')}</span>
                  <span className="text-2xl font-black text-[#141779]">{revivalSpins}</span>
                </div>
                <div className="w-px h-8 bg-[#e0e0e0]" />
                <div className="flex-1">
                  <span className="text-[10px] text-[#767683] uppercase font-black tracking-widest block mb-1">{t('your_coins', 'Your Coins')}</span>
                  <span className="text-2xl font-black text-[#d97706]">🪙 {Math.max(0, userCoins)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {revivalSpins > 0 ? (
                  <button
                    onClick={() => navigate(`/daily-rewards?type=boss_revival&boss_id=${battleData?.battleId}`)}
                    className="w-full py-4 bg-[#141779] text-white font-bold rounded-full hover:bg-[#101362] active:scale-95 transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>🔥 {t('spin_to_revive', 'Spin to Revive')}</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (userCoins < 100) {
                        showToast(t('not_enough_coins', "Not enough coins! You need 100 coins."));
                        return;
                      }
                      try {
                        const res = await apiFetch("/api/retention/spin-wheel/buy-revival", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" }
                        });
                        const json = await res.json();
                        if (json.success) {
                          setRevivalSpins(json.balances.boss_revival_spins_balance || 1);
                          setUserCoins(json.coins);
                          showToast(t('purchased_revival_spin', "Purchased 1 Revival Spin! 🎉"));
                        } else {
                          showToast(json.message || t('purchase_failed', "Purchase failed."));
                        }
                      } catch (e) {
                        showToast(t('purchase_failed', "Purchase failed."));
                      }
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white font-bold rounded-full hover:brightness-110 active:scale-95 transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 shadow-md border border-indigo-300/40"
                  >
                    <span>🛒 {t('buy_revival_spin', 'Buy Revival Spin (100 🪙)')}</span>
                  </button>
                )}
                
                <button
                  onClick={handleGiveUp}
                  className="w-full py-3 bg-[#f4efff] text-[#767683] font-bold rounded-full hover:bg-[#e8ddff] active:scale-95 transition-all text-xs border border-[#e0e0e0]"
                >
                  {t('give_up', 'Give Up')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOSS OVERLAY SCREEN */}
      {lossOverlay.show && (
        <div className="fixed inset-0 z-[120] bg-[#f4efff] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-[#ffebee] border-2 border-[#ba1a1a] flex items-center justify-center mb-4">
            <span className="text-4xl">💔</span>
          </div>
          <h2 className="text-3xl font-black text-[#ba1a1a] uppercase tracking-wider mb-2">{t('defeat', 'DEFEAT')}</h2>
          <p className="text-sm font-bold text-[#464652] mb-6 max-w-xs">{t('boss_defeat_desc', 'You ran out of hearts! Keep practicing to come back stronger!')}</p>
          <button
            onClick={() => {
              if (returnTo) {
                navigate(decodeURIComponent(returnTo), { replace: true });
              } else {
                navigate("/practice/journey-map", { replace: true });
              }
            }}
            className="w-full max-w-xs py-4 bg-[#141779] text-white font-black uppercase tracking-widest rounded-full shadow-md"
          >
            {t('return_to_map', 'Return to Map')}
          </button>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white px-4.5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(20,23,121,0.4)] border border-[#57fae9]/40 font-bold text-xs flex items-center justify-center gap-2.5 text-center max-w-[90vw] w-auto animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <Sparkles size={16} className="text-[#57fae9] shrink-0" />
          <span className="truncate max-w-[280px] sm:max-w-[340px] line-clamp-1">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
