import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Zap,
  Award,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Volume2,
  ShieldAlert,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";

type StepPhase = "INTRO" | "QUIZ" | "MINI_REWARD" | "BOSS" | "SUMMARY";

export default function MissionPlayScreen() { // MissionPlayScreen.tsx - StudySaathy Mission Play Engine (Updated)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId") || "ch1";
  const missionSeq = parseInt(searchParams.get("missionSeq") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [missionData, setMissionData] = useState<any>(null);
  const [phase, setPhase] = useState<StepPhase>(() => {
    const queryPhase = searchParams.get("phase");
    if (queryPhase === "BOSS" || queryPhase === "QUIZ" || queryPhase === "SUMMARY") {
      return queryPhase as StepPhase;
    }
    const saved = sessionStorage.getItem(`mission_phase_${chapterId}_${missionSeq}`);
    if (saved === "BOSS" || saved === "QUIZ" || saved === "MINI_REWARD" || saved === "SUMMARY") {
      return saved as StepPhase;
    }
    return "INTRO";
  });

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [basketCount, setBasketCount] = useState(0);
  const [quizConfirmed, setQuizConfirmed] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);

  // Stats state
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [streak, setStreak] = useState(1);

  const QUESTION_TIME_LIMIT = 30;

  // Question Countdown Timer State (30s per question)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [totalSessionSec, setTotalSessionSec] = useState(() => {
    const saved = sessionStorage.getItem(`mission_timer_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });

  // Boss Battle state
  const [bossDamageCount, setBossDamageCount] = useState(0);
  const [childDamageCount, setChildDamageCount] = useState(0);
  const [currentBossIndex, setCurrentBossIndex] = useState(0);
  const [bossSelected, setBossSelected] = useState<number | null>(null);
  const [bossAngry, setBossAngry] = useState(false);
  const [dragonCrying, setDragonCrying] = useState(false);
  const [bossBasketCount, setBossBasketCount] = useState(0);

  // Final Summary state
  const [completionResult, setCompletionResult] = useState<any>(null);

  // Fetch Mission Data Effect
  useEffect(() => {
    async function fetchMission() {
      try {
        const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}`);
        const json = await res.json();
        if (json.success && json.data) {
          setMissionData(json.data);
          if (json.data.quizCompleted) {
            setPhase("BOSS");
          }
        }
      } catch (e) {
        console.error("Failed to load mission:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMission();
  }, [chapterId, missionSeq]);

  const quizQuestions = missionData?.quizQuestions || [];
  let bossQuestions = (missionData?.bossQuestions && missionData.bossQuestions.length > 0) 
    ? missionData.bossQuestions 
    : quizQuestions;

  if (bossQuestions.length === 0) {
    bossQuestions = [
      { _id: "b1", question: "Boss Challenge #1: What is 5 + 5?", options: ["10", "12", "8", "15"], answer: "10", type: "boss" },
      { _id: "b2", question: "Boss Challenge #2: What is 10 + 10?", options: ["20", "25", "15", "30"], answer: "20", type: "boss" },
      { _id: "b3", question: "Boss Challenge #3: What is 15 + 15?", options: ["30", "35", "25", "40"], answer: "30", type: "boss" }
    ];
  }

  const bossMaxHp = 3;
  const bossHearts = Math.max(0, bossMaxHp - bossDamageCount);
  const childHearts = Math.max(0, 3 - childDamageCount);

  const safeBossIndex = Math.min(currentBossIndex, Math.max(0, bossQuestions.length - 1));
  const activeBossQ = bossQuestions[safeBossIndex] || bossQuestions[0];
  const isBossDrag = activeBossQ?.type === "drag_objects" || activeBossQ?.interaction?.type === "drag_objects";
  const bossDragDetails = activeBossQ?.interaction?.details || {};
  const bossTargetCount = bossDragDetails.targetCount ?? (parseInt(activeBossQ?.answer) || 3);
  const bossTotalDraggables = bossDragDetails.draggablesCount || (bossTargetCount + 3);
  const bossObjectEmoji = bossDragDetails.objectEmoji || "⭐";

  useEffect(() => {
    if (activeBossQ) {
      const initial = activeBossQ?.interaction?.details?.initialCount || 0;
      setBossBasketCount(initial);
    }
  }, [currentBossIndex, activeBossQ?._id]);

  const activeBossOptions = (activeBossQ?.options && Array.isArray(activeBossQ.options) && activeBossQ.options.length > 0)
    ? activeBossQ.options
    : [activeBossQ?.answer || "Option 1", "Option 2", "Option 3", "Option 4"];

  const bossName = missionData?.bossName || "Boss Guardian";
  const missionTitle = missionData?.title || `Mission ${missionSeq}`;
  const missionIcon = missionData?.icon || "🎯";

  const currentQ = quizQuestions[currentQuizIndex];
  const interactionType = currentQ?.interaction?.type || currentQ?.type || "multiple_choice";
  const isDragObjects = interactionType === "drag_objects";

  const dragDetails = currentQ?.interaction?.details || {};
  const targetCount = dragDetails.targetCount ?? (parseInt(currentQ?.answer) || 3);
  const totalDraggables = dragDetails.draggablesCount || (targetCount + 3);
  const objectEmoji = dragDetails.objectEmoji || "🍎";

  useEffect(() => {
    if (currentQ) {
      const initial = currentQ?.interaction?.details?.initialCount || 0;
      setBasketCount(initial);
    }
    setQuizConfirmed(false);
    setQuizSelected(null);
  }, [currentQuizIndex, currentQ?._id]);

  // Boss Expression based on health & attack status
  const getBossExpression = () => {
    if (bossAngry) return { status: "Boss Enraged & Furious!", color: "from-[#2d328f] via-[#7c1d32] to-[#2b2fa3]" };
    if (bossHearts >= 3) return { status: "Confident & Fierce", color: "from-[#1c208c] to-[#2b2fa3]" };
    if (bossHearts === 2) return { status: "Annoyed & Shaken", color: "from-[#25299e] to-[#3a3ebd]" };
    if (bossHearts === 1) return { status: "Critical Health!", color: "from-[#3a1d7c] to-[#5b23a8]" };
    return { status: "Defeated!", color: "from-[#1a1c4b] to-[#272b6b]" };
  };

  const bossState = getBossExpression();

  // Finalize Mission API helper
  const finalizeMission = async (finalBossDamage = bossDamageCount, finalChildDamage = childDamageCount) => {
    try {
      const bossCorrect = finalBossDamage;
      const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizCorrect: quizCorrectCount,
          quizTotal: quizQuestions.length,
          bossCorrect: bossCorrect,
          bossTotal: bossQuestions.length,
          timeTakenSec: totalSessionSec,
          livesRemaining: Math.max(0, 3 - finalChildDamage)
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCompletionResult(json.data);
      }
    } catch (e) {
      console.error("Failed to complete mission:", e);
    } finally {
      setPhase("SUMMARY");
    }
  };

  // Boss Attack execution helper
  const executeBossAttack = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      // Right Answer -> Boss is Angry!
      setBossAngry(true);
      setDragonCrying(false);
      const newBossDamage = bossDamageCount + 1;
      setBossDamageCount(newBossDamage);
      setXpEarned((prev) => prev + 25);
      setCoinsEarned((prev) => prev + 20);

      setTimeout(() => {
        setBossAngry(false);
      }, 1200);

      setTimeout(async () => {
        setBossSelected(null);
        setBossBasketCount(0);
        const nextIndex = currentBossIndex + 1;
        if (newBossDamage >= bossMaxHp || nextIndex >= bossQuestions.length) {
          await finalizeMission(newBossDamage, childDamageCount);
        } else {
          setCurrentBossIndex(nextIndex);
        }
      }, 1400);

    } else {
      // Wrong Answer -> Dragon/Hero is Crying!
      setDragonCrying(true);
      setBossAngry(false);
      const newChildDamage = childDamageCount + 1;
      setChildDamageCount(newChildDamage);

      setTimeout(() => {
        setDragonCrying(false);
      }, 1200);

      setTimeout(async () => {
        setBossSelected(null);
        setBossBasketCount(0);
        const nextIndex = currentBossIndex + 1;
        if (newChildDamage >= 3 || nextIndex >= bossQuestions.length) {
          await finalizeMission(bossDamageCount, newChildDamage);
        } else {
          setCurrentBossIndex(nextIndex);
        }
      }, 1400);
    }
  }, [bossDamageCount, childDamageCount, currentBossIndex, bossMaxHp, bossQuestions.length]);

  const handleQuizConfirm = () => {
    if (!quizConfirmed) {
      let isCorrect = false;
      if (isDragObjects) {
        isCorrect = (basketCount === targetCount || String(basketCount) === String(currentQ?.answer));
      } else {
        if (quizSelected === null) return;
        const selectedOpt = currentQ?.options?.[quizSelected];
        isCorrect = String(selectedOpt).trim().toLowerCase() === String(currentQ?.answer).trim().toLowerCase();
      }

      setQuizConfirmed(true);
      setQuizIsCorrect(isCorrect);

      if (isCorrect) {
        setQuizCorrectCount((prev) => prev + 1);
        setXpEarned((prev) => prev + 15);
        setCoinsEarned((prev) => prev + 10);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(1);
      }
    } else {
      setQuizConfirmed(false);
      setQuizSelected(null);
      setBasketCount(0);
      if (currentQuizIndex + 1 < quizQuestions.length) {
        setCurrentQuizIndex((prev) => prev + 1);
      } else {
        setPhase("MINI_REWARD");
      }
    }
  };

  const handleBossAnswer = (optionIndex: number, optionText: string) => {
    if (bossSelected !== null) return;
    setBossSelected(optionIndex);

    const isCorrect = String(optionText).trim().toLowerCase() === String(activeBossQ?.answer).trim().toLowerCase();
    executeBossAttack(isCorrect);
  };

  const handleBossDragConfirm = () => {
    if (bossSelected !== null) return;
    const isCorrect = (bossBasketCount === bossTargetCount || String(bossBasketCount) === String(activeBossQ?.answer));
    executeBossAttack(isCorrect);
  };

  useEffect(() => {
    if (phase && phase !== "INTRO") {
      sessionStorage.setItem(`mission_phase_${chapterId}_${missionSeq}`, phase);
    }
  }, [phase, chapterId, missionSeq]);

  // Overall session active timer (for parent space total time reporting)
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSessionSec((prev) => {
        const next = prev + 1;
        sessionStorage.setItem(`mission_timer_${chapterId}_${missionSeq}`, next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [chapterId, missionSeq]);

  // Reset 30-second countdown on question change
  useEffect(() => {
    setQuestionTimeLeft(QUESTION_TIME_LIMIT);
  }, [currentQuizIndex, currentBossIndex, phase]);

  // 30s Per-Question Countdown Timer Effect (30s -> 29s -> 28s ... -> 0s)
  useEffect(() => {
    if (phase === "QUIZ" && !quizConfirmed) {
      if (questionTimeLeft <= 0) {
        // Auto-fail on 30s timeout
        setQuizConfirmed(true);
        setQuizIsCorrect(false);
        setStreak(1);
        return;
      }
      const t = setInterval(() => {
        setQuestionTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(t);
    } else if (phase === "BOSS" && bossSelected === null && !bossAngry && !dragonCrying) {
      if (questionTimeLeft <= 0) {
        // Auto-fail boss question on 30s timeout (deduct exactly 1 heart)
        setQuestionTimeLeft(QUESTION_TIME_LIMIT);
        setBossSelected(-1);
        executeBossAttack(false);
        return;
      }
      const t = setInterval(() => {
        setQuestionTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(t);
    }
  }, [phase, questionTimeLeft, quizConfirmed, bossSelected, bossAngry, dragonCrying, executeBossAttack]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] text-[#141779] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold tracking-wide text-base animate-pulse">Preparing Mission {missionSeq}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-x-hidden flex flex-col justify-between">
      <header className="sticky top-0 z-40 bg-[rgba(247,249,251,0.85)] backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
        >
          <ArrowLeft size={20} className="text-[#141779]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-amber-800 font-bold text-xs">
            <Zap size={14} className="text-amber-500 fill-amber-400" />
            <span>{xpEarned} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 text-teal-800 font-bold text-xs">
            <Award size={14} className="text-teal-600 fill-teal-500" />
            <span>{coinsEarned} Coins</span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 border px-3.5 py-1 rounded-full font-mono font-extrabold text-xs shadow-2xs transition-all ${
          (phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5 
            ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse ring-2 ring-rose-400/40" 
            : "bg-slate-100/90 border-slate-200 text-slate-800"
        }`}>
          <div className="relative flex items-center justify-center">
            <Clock size={14} className={(phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5 ? "text-rose-600 animate-bounce" : "text-indigo-600"} />
            <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
              (phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5 ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-ping"
            }`} />
          </div>
          <span>
            {phase === "QUIZ" || phase === "BOSS" 
              ? `${questionTimeLeft}s` 
              : `${Math.floor(totalSessionSec / 60).toString().padStart(2, '0')}:${(totalSessionSec % 60).toString().padStart(2, '0')}`}
          </span>
        </div>
      </header>



      {phase === "INTRO" && (
        <main className="px-6 py-8 flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-3xl bg-[#141779] flex items-center justify-center text-4xl shadow-xl mb-6 border-4 border-amber-300 text-white"
          >
            {missionIcon}
          </motion.div>

          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs uppercase tracking-widest border border-amber-300 mb-3">
            Mission {missionSeq} Launch
          </span>

          <h2 className="text-2xl font-black text-[#141779] mb-2">{missionTitle}</h2>
          <p className="text-[#464652] text-sm mb-8 leading-relaxed font-medium">
            Solve {quizQuestions.length} practice questions to charge your weapon, then defeat {bossName} in the Boss Arena!
          </p>

          <div className="w-full bg-white border border-gray-200 rounded-3xl p-5 mb-8 text-left flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h4 className="text-xs font-bold uppercase text-[#767683] tracking-wider">Mission Objectives</h4>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#141779]">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Complete {quizQuestions.length} Practice Questions</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#141779]">
              <CheckCircle2 size={18} className="text-amber-500" />
              <span>Defeat {bossName} (3 Boss Hearts)</span>
            </div>
          </div>

          <button
            onClick={() => setPhase("QUIZ")}
            className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>Start Mission</span>
            <Play size={18} className="fill-white" />
          </button>
        </main>
      )}

      {phase === "QUIZ" && quizQuestions.length > 0 && (
        <main className="px-6 py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#767683] mb-2">
              <span className="flex items-center gap-1.5 font-extrabold text-[#141779]">
                {isDragObjects ? "🧩 Drag & Drop Phase" : "🎯 Quiz Phase"}
              </span>
              <span>
                Question {currentQuizIndex + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#141779] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="my-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative">
            <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider block mb-2">
              Question #{currentQuizIndex + 1} {isDragObjects ? "• Drag & Drop" : "• Multiple Choice"}
            </span>
            <h3 className="text-lg font-bold text-[#141779] leading-snug">
              {currentQ?.question}
            </h3>
          </div>

          {isDragObjects ? (
            <div className="flex flex-col gap-4 mb-4">
              <div
                className={`w-full min-h-[140px] rounded-2xl border-4 border-dashed p-4 flex flex-wrap gap-2 items-center justify-center transition-colors ${
                  quizConfirmed
                    ? quizIsCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                }`}
                onClick={() => {
                  if (!quizConfirmed && basketCount > 0) {
                    setBasketCount((prev) => prev - 1);
                  }
                }}
              >
                {basketCount === 0 && (
                  <span className="text-gray-400 font-bold select-none text-center text-sm uppercase tracking-wider">
                    Tap items below to add to Basket!
                  </span>
                )}
                {Array.from({ length: basketCount }).map((_, i) => (
                  <span key={i} className="text-4xl animate-bounce drop-shadow-sm select-none">
                    {objectEmoji}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 p-4 bg-white rounded-2xl shadow-xs border border-gray-200">
                {Array.from({ length: Math.max(0, totalDraggables - basketCount) }).map((_, i) => (
                  <button
                    key={i}
                    disabled={quizConfirmed}
                    onClick={() => {
                      if (!quizConfirmed && basketCount < totalDraggables) {
                        setBasketCount((prev) => prev + 1);
                      }
                    }}
                    className="text-4xl hover:scale-110 active:scale-95 transition-transform p-2 drop-shadow-xs"
                  >
                    {objectEmoji}
                  </button>
                ))}
                {totalDraggables - basketCount === 0 && (
                  <span className="text-gray-400 font-bold text-xs py-2 uppercase tracking-wide">
                    Basket Full! Tap basket to remove item.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              {currentQ?.options?.map((opt: string, idx: number) => {
                const isSelected = quizSelected === idx;
                const isCorrect = String(opt).trim().toLowerCase() === String(currentQ?.answer).trim().toLowerCase();

                let style = "bg-white border-gray-200 text-[#191c1e] hover:border-[#141779]";
                if (quizConfirmed) {
                  if (isCorrect) {
                    style = "bg-emerald-500 border-emerald-600 text-white font-bold";
                  } else if (isSelected) {
                    style = "bg-red-500 border-red-600 text-white font-bold";
                  }
                } else if (isSelected) {
                  style = "bg-indigo-50 border-[#141779] text-[#141779] font-bold ring-2 ring-[#141779]/20";
                }

                return (
                  <button
                    key={idx}
                    disabled={quizConfirmed}
                    onClick={() => !quizConfirmed && setQuizSelected(idx)}
                    className={`w-full p-4 rounded-2xl border text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs ${style}`}
                  >
                    <span>{opt}</span>
                    {quizConfirmed && isCorrect && <CheckCircle2 size={20} className="text-white" />}
                    {quizConfirmed && isSelected && !isCorrect && <XCircle size={20} className="text-white" />}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {quizConfirmed && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-3 ${
                  quizIsCorrect
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-red-100 text-red-900 border border-red-300"
                }`}
              >
                {quizIsCorrect ? (
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                ) : (
                  <XCircle size={24} className="text-red-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm">
                    {quizIsCorrect ? "Excellent! Target Reached! 🌟" : "Not quite right!"}
                  </h4>
                  <p className="text-xs font-semibold">
                    {quizIsCorrect
                      ? "+15 XP & +10 Coins"
                      : isDragObjects
                      ? `Target was ${targetCount} ${objectEmoji}`
                      : `Correct Answer: ${currentQ?.answer}`}
                  </p>
                </div>
              </div>
            )}

            <button
              disabled={!isDragObjects && quizSelected === null && !quizConfirmed}
              onClick={handleQuizConfirm}
              className={`w-full py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                !isDragObjects && quizSelected === null && !quizConfirmed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : !quizConfirmed
                  ? "bg-[#141779] text-white hover:bg-[#101362]"
                  : quizIsCorrect
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <span>{quizConfirmed ? "CONTINUE →" : "CHECK ANSWER"}</span>
            </button>
          </div>
        </main>
      )}

      {phase === "MINI_REWARD" && (
        <main className="px-6 py-8 flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.1 }}
            className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-4xl mb-6 shadow-lg"
          >
            🌟
          </motion.div>

          <h2 className="text-2xl font-black text-[#141779] mb-2">Quiz Phase Complete!</h2>
          <p className="text-[#464652] text-sm mb-6 font-medium">
            Awesome! You answered {quizCorrectCount} out of {quizQuestions.length} correctly. Your energy is fully charged for the Boss Battle!
          </p>

          <div className="bg-white border border-gray-200 p-5 rounded-3xl w-full mb-8 flex justify-around shadow-xs">
            <div>
              <span className="text-xs text-[#767683] block font-semibold">Bonus XP</span>
              <span className="text-xl font-black text-amber-600">+{quizCorrectCount * 15}</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <span className="text-xs text-[#767683] block font-semibold">Bonus Coins</span>
              <span className="text-xl font-black text-teal-600">+{quizCorrectCount * 10}</span>
            </div>
          </div>

          <button
            onClick={() => setPhase("BOSS")}
            className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>Enter Boss Arena 👹</span>
          </button>
        </main>
      )}

      {phase === "BOSS" && (
        <main className="px-6 py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
          {/* Re-designed Boss Battle Header Card */}
          <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white rounded-[28px] p-5 mb-4 shadow-[0_12px_40px_rgba(49,46,129,0.35)] border-2 border-indigo-400/30 relative overflow-hidden">
            {/* Background Orbs & Sparkles */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-indigo-500/25 blur-2xl pointer-events-none" />
            
            {/* Top Bar: Hero vs Boss Header */}
            <div className="flex items-center justify-between mb-3.5 relative z-10 gap-2">
              
              {/* Left: Dragon Hero */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl relative shadow-inner">
                  <span>🐲</span>
                  {dragonCrying && (
                    <motion.span
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: [1, 0], y: [0, 8] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 text-[10px]"
                    >
                      💧
                    </motion.span>
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block leading-tight">
                    Dragon Hero
                  </span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3].map((h) => (
                      <Heart
                        key={h}
                        size={15}
                        className={h <= childHearts ? (dragonCrying ? "text-cyan-300 fill-cyan-300 animate-ping" : "text-rose-400 fill-rose-400 animate-pulse") : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: Boss Stage Badge */}
              <div className="px-3 py-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-full shadow-md border border-amber-200 shrink-0">
                BOSS STAGE ⚔️
              </div>

              {/* Right: Boss Guardian */}
              <div className="flex items-center gap-2 justify-end">
                <div className="text-right">
                  <span className="text-[11px] font-black uppercase text-indigo-200 tracking-wider block leading-tight truncate max-w-[90px]">
                    {bossName}
                  </span>
                  <div className="flex gap-0.5 mt-0.5 justify-end">
                    {[1, 2, 3].map((h) => (
                      <Heart
                        key={h}
                        size={15}
                        className={h <= bossHearts ? "text-amber-400 fill-amber-400 animate-pulse" : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center text-xl shadow-inner">
                  <span>🐉</span>
                </div>
              </div>

            </div>

            {/* Inner Boss Card */}
            <div className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-inner overflow-hidden">
              <motion.div
                animate={{
                  scale: bossAngry ? [1, 1.08, 1] : 1,
                  rotate: bossAngry ? [-3, 3, -3, 3, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: bossAngry ? 2 : 0 }}
                className="relative z-10 flex items-center gap-3"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/30 backdrop-blur-xs border border-white/30 flex items-center justify-center text-3xl shadow-inner relative ${
                  bossAngry ? "ring-4 ring-rose-500/80 animate-pulse" : ""
                }`}>
                  <span>🐲</span>
                  {bossAngry && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                      className="absolute -top-2.5 -right-2 text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded-full border border-white uppercase tracking-wider"
                    >
                      ANGRY!
                    </motion.span>
                  )}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{bossName}</h4>
                  <span className={`text-xs font-extrabold ${bossAngry ? "text-rose-300 animate-pulse" : "text-amber-300"}`}>
                    {bossState.status}
                  </span>
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col items-end gap-1.5">
                <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30 text-white shadow-xs">
                  {bossHearts} / 3 HP
                </span>
              </div>

              <Sparkles className="absolute -right-4 -bottom-4 w-28 h-28 text-amber-300/15 pointer-events-none animate-spin" />
            </div>
          </div>



          <div className="my-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative">
            <span className="text-xs font-bold text-[#141779] uppercase tracking-wider block mb-2">
              Boss Strike #{safeBossIndex + 1} {isBossDrag ? "• Drag & Drop Strike" : "• Direct Strike"}
            </span>
            <h3 className="text-lg font-bold text-[#141779] leading-snug">
              {activeBossQ?.question}
            </h3>
          </div>

          {isBossDrag ? (
            <div className="flex flex-col gap-4 mb-4">
              <div
                className="w-full min-h-[120px] rounded-2xl border-2 border-dashed border-[#141779]/30 bg-[#f0f2ff] p-4 flex flex-wrap gap-2 items-center justify-center cursor-pointer shadow-inner"
                onClick={() => {
                  if (bossSelected === null && bossBasketCount > 0) {
                    setBossBasketCount((prev) => prev - 1);
                  }
                }}
              >
                {bossBasketCount === 0 && (
                  <span className="text-[#141779]/70 font-bold select-none text-center text-xs uppercase tracking-wider">
                    Tap items below to load into Weapon Basket!
                  </span>
                )}
                {Array.from({ length: bossBasketCount }).map((_, i) => (
                  <span key={i} className="text-3xl animate-bounce drop-shadow-xs select-none">
                    {bossObjectEmoji}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-xs">
                {Array.from({ length: Math.max(0, bossTotalDraggables - bossBasketCount) }).map((_, i) => (
                  <button
                    key={i}
                    disabled={bossSelected !== null}
                    onClick={() => {
                      if (bossSelected === null && bossBasketCount < bossTotalDraggables) {
                        setBossBasketCount((prev) => prev + 1);
                      }
                    }}
                    className="text-3xl hover:scale-110 active:scale-95 transition-transform p-1.5"
                  >
                    {bossObjectEmoji}
                  </button>
                ))}
              </div>

              <button
                disabled={bossSelected !== null}
                onClick={handleBossDragConfirm}
                className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>STRIKE BOSS ⚡</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {activeBossOptions.map((opt: string, idx: number) => {
                const isSelected = bossSelected === idx;
                const isCorrect = String(opt).trim().toLowerCase() === String(activeBossQ?.answer).trim().toLowerCase();

                let style = "bg-white border-gray-200 text-[#141779] hover:border-[#141779]";
                if (bossSelected !== null) {
                  if (isCorrect) {
                    style = "bg-emerald-600 border-emerald-600 text-white font-bold";
                  } else if (isSelected) {
                    style = "bg-red-600 border-red-600 text-white font-bold";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={bossSelected !== null}
                    onClick={() => handleBossAnswer(idx, opt)}
                    className={`w-full p-4 rounded-2xl border text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs ${style}`}
                  >
                    <span>{opt}</span>
                    {bossSelected !== null && isCorrect && <CheckCircle2 size={20} className="text-white" />}
                    {bossSelected !== null && isSelected && !isCorrect && <XCircle size={20} className="text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      )}

      {phase === "SUMMARY" && (
        <main className="px-6 py-6 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-200 flex items-center justify-center text-4xl mb-3 shadow-xl"
          >
            🏆
          </motion.div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-300 mb-2">
            Mission {missionSeq} Accomplished!
          </span>

          <h2 className="text-2xl font-black text-[#141779] mb-1">{missionTitle} Victory!</h2>
          <p className="text-xs text-[#464652] font-semibold mb-4">Chapter Progression & Performance Report</p>

          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={28}
                className={
                  s <= (completionResult?.stars || 3)
                    ? "text-amber-500 fill-amber-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mb-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col items-center shadow-xs">
              <span className="text-[10px] font-black text-[#767683] uppercase tracking-wider">Accuracy</span>
              <span className="text-3xl font-black text-emerald-600 mt-1">
                {completionResult?.accuracy ?? Math.round((quizCorrectCount / Math.max(1, quizQuestions.length)) * 100)}%
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                {completionResult?.targetStatus || ((completionResult?.accuracy ?? 100) >= 85 ? "Target Exceeded" : "Target Met")}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col items-center shadow-xs">
              <span className="text-[10px] font-black text-[#767683] uppercase tracking-wider">Confidence</span>
              <span className="text-xl font-black text-[#141779] mt-2">
                {completionResult?.confidenceLabel || "High Mastery 🚀"}
              </span>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full"
                  style={{ width: `${completionResult?.confidenceScore || 90}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full mb-4 text-left shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1">
                  <span>📈 3-Day Performance Average</span>
                </h4>
                <span className="text-[11px] text-gray-500 font-semibold">Short-term retention trend</span>
              </div>
              <span className="text-base font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                {completionResult?.threeDayAvg ?? 0}%
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 h-24 pt-4 px-2">
              {(completionResult?.threeDayTrend || [
                { day: "Day 1", accuracy: 0 },
                { day: "Day 2", accuracy: 0 },
                { day: "Today", accuracy: completionResult?.accuracy || 0 }
              ]).map((d: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-[#141779]">{d.accuracy}%</span>
                  <div className="w-full bg-gray-100 rounded-xl h-full flex items-end overflow-hidden p-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${d.accuracy}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-teal-400 rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full mb-6 text-left shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1">
                  <span>📊 7-Day Performance Trend</span>
                </h4>
                <span className="text-[11px] text-gray-500 font-semibold">Weekly consistency overview</span>
              </div>
              <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {completionResult?.sevenDayAvg ?? 0}%
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-24 pt-4 px-1">
              {(completionResult?.sevenDayTrend || [
                { day: "Mon", accuracy: 0 },
                { day: "Tue", accuracy: 0 },
                { day: "Wed", accuracy: 0 },
                { day: "Thu", accuracy: 0 },
                { day: "Fri", accuracy: 0 },
                { day: "Sat", accuracy: 0 },
                { day: "Sun", accuracy: completionResult?.accuracy || 0 }
              ]).map((d: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-gray-500">{d.accuracy}%</span>
                  <div className="w-full bg-gray-100 rounded-lg h-full flex items-end overflow-hidden p-0.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${d.accuracy}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.08 }}
                      className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-md"
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-gray-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => navigate(`/mission-roadmap?chapterId=${chapterId}`)}
              className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Continue to Next Mission</span>
              <Play size={18} className="fill-white" />
            </button>
          </div>
        </main>
      )}

      <footer className="px-6 py-4 text-center text-xs font-semibold text-[#767683]">
        © StudySaathy Learning Platform
      </footer>
    </div>
  );
}
