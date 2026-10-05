import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Play,
  Swords,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";
import { showInteractiveNotification } from "../../../services/pushNotificationService";

type StepPhase = "INTRO" | "QUIZ" | "MINI_REWARD" | "BOSS" | "SUMMARY";

const getUserClassNumber = (): number => {
  const cached = localStorage.getItem("userData");
  if (cached) {
    try {
      const u = JSON.parse(cached);
      const className = u.childClass || "Class 3";
      const num = parseInt(className.replace(/\D/g, ""), 10);
      return isNaN(num) ? 3 : num;
    } catch (e) {
      return 3;
    }
  }
  return 3;
};

const RenderClassIllustration = ({ classNum }: { classNum: number }) => {
  if (classNum >= 2 && classNum <= 4) {
    // Dragon SVG
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-4 right-6 text-3xl pointer-events-none"
        >
          🎉
        </motion.div>
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute top-10 left-6 text-2xl pointer-events-none"
        >
          ✨
        </motion.div>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <motion.path
            d="M20,40 Q5,30 25,20 Z"
            fill="#34d399"
            animate={{ rotate: [-10, 15, -10] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: "25px 20px" }}
          />
          <motion.path
            d="M80,40 Q95,30 75,20 Z"
            fill="#34d399"
            animate={{ rotate: [10, -15, 10] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: "75px 20px" }}
          />
          <ellipse cx="50" cy="55" rx="22" ry="25" fill="#10b981" />
          <ellipse cx="50" cy="62" rx="14" ry="16" fill="#6ee7b7" />
          <motion.g
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <circle cx="50" cy="30" r="16" fill="#10b981" />
            <circle cx="44" cy="26" r="4.5" fill="white" />
            <circle cx="45.5" cy="26" r="2" fill="black" />
            <circle cx="56" cy="26" r="4.5" fill="white" />
            <circle cx="54.5" cy="26" r="2" fill="black" />
            <circle cx="38" cy="32" r="2" fill="#f43f5e" opacity="0.6" />
            <circle cx="62" cy="32" r="2" fill="#f43f5e" opacity="0.6" />
            <path d="M42,16 Q45,6 48,15 Z" fill="#fbbf24" />
            <path d="M58,16 Q55,6 52,15 Z" fill="#fbbf24" />
            <path d="M50,33 L62,35 L62,38 L50,34 Z" fill="#fb923c" />
            <ellipse cx="62" cy="36.5" rx="1.5" ry="3" fill="#fb7185" />
          </motion.g>
          <motion.path
            d="M68,68 Q85,80 75,90"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "68px 68px" }}
          />
        </svg>
      </div>
    );
  } else if (classNum >= 5 && classNum <= 7) {
    // Scientist Owl SVG
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ y: [20, -30], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute bottom-12 right-10 text-emerald-400 text-sm font-bold pointer-events-none"
        >
          🧪
        </motion.div>
        <motion.div
          animate={{ y: [15, -40], opacity: [0, 1, 0], scale: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
          className="absolute bottom-16 right-6 text-purple-400 text-xs font-bold pointer-events-none"
        >
          ✨
        </motion.div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <path d="M30,85 L70,85 L62,55 L38,55 Z" fill="#e2e8f0" />
          <path d="M48,55 L52,55 L50,68 Z" fill="#141779" />
          <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 50px" }}
          >
            <circle cx="50" cy="40" r="18" fill="#4f46e5" />
            <path d="M32,32 L25,22 L38,28 Z" fill="#312e81" />
            <path d="M68,32 L75,22 L62,28 Z" fill="#312e81" />
            
            <circle cx="43" cy="40" r="6.5" fill="white" />
            <circle cx="43" cy="40" r="3" fill="#1e1b4b" />
            <circle cx="57" cy="40" r="6.5" fill="white" />
            <circle cx="57" cy="40" r="3" fill="#1e1b4b" />
            
            <circle cx="43" cy="40" r="7.5" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="57" cy="40" r="7.5" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="50.5" y1="40" x2="49.5" y2="40" stroke="#fbbf24" strokeWidth="2.5" />
            
            <path d="M50,44 L47,48 L53,48 Z" fill="#fb923c" />
          </motion.g>
          <circle cx="34" cy="65" r="4" fill="#4f46e5" />
          <circle cx="66" cy="65" r="4" fill="#4f46e5" />
          <path d="M63,65 L69,65 L73,78 L59,78 Z" fill="#059669" opacity="0.85" />
          <rect x="64" y="60" width="4" height="6" fill="#e2e8f0" />
        </svg>
      </div>
    );
  } else {
    // Medalist (Class 8-10)
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-yellow-300/30 rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-4 left-6 text-2xl pointer-events-none"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ scale: [1, 0.7, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-6 right-6 text-xl pointer-events-none"
        >
          ✨
        </motion.div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <path d="M35,50 L25,90 L40,80 L48,50 Z" fill="#e11d48" />
          <path d="M65,50 L75,90 L60,80 L52,50 Z" fill="#e11d48" />
          <path d="M38,50 L32,85 L42,77 L47,50 Z" fill="#be123c" />
          <path d="M62,50 L68,85 L58,77 L53,50 Z" fill="#be123c" />
          
          <motion.circle
            cx="50"
            cy="46"
            r="24"
            fill="#fbbf24"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <circle cx="50" cy="46" r="20" fill="#f59e0b" />
          <polygon points="50,34 54,42 63,42 56,48 59,57 50,51 41,57 44,48 37,42 46,42" fill="#fff" />
          <path d="M34,34 Q40,24 50,23 Q40,32 34,34 Z" fill="#fff" opacity="0.3" />
        </svg>
      </div>
    );
  }
};

export default function MissionPlayScreen() { // MissionPlayScreen.tsx - NR Scholar Mission Play Engine (Updated)
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId") || "ch1";
  const missionSeq = parseInt(searchParams.get("missionSeq") || "1", 10);
  const [isReplay] = useState(() => searchParams.get("replay") === "true");

  const [loading, setLoading] = useState(true);
  const [missionData, setMissionData] = useState<any>(null);
  // Check if an in-progress session exists in sessionStorage for this specific mission
  const savedPhase = sessionStorage.getItem(`mission_phase_${chapterId}_${missionSeq}`);
  const hasSavedSession = Boolean(
    savedPhase && (savedPhase === "BOSS" || savedPhase === "QUIZ" || savedPhase === "MINI_REWARD" || savedPhase === "SUMMARY")
  );

  const [phase, setPhase] = useState<StepPhase>(() => {
    if (isReplay) {
      sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);
      const queryPhase = searchParams.get("phase");
      if (queryPhase === "BOSS" || queryPhase === "QUIZ" || queryPhase === "SUMMARY") {
        return queryPhase as StepPhase;
      }
      return "INTRO";
    }
    if (hasSavedSession) {
      return savedPhase as StepPhase;
    }
    const queryPhase = searchParams.get("phase");
    if (queryPhase === "BOSS" || queryPhase === "QUIZ" || queryPhase === "SUMMARY") {
      return queryPhase as StepPhase;
    }
    return "INTRO";
  });

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(() => {
    if (isReplay) return 0;
    const savedAns = sessionStorage.getItem(`user_answers_${chapterId}_${missionSeq}`);
    if (savedAns) {
      try {
        const arr = JSON.parse(savedAns);
        if (Array.isArray(arr)) return arr.length;
      } catch (e) {
        // Ignored fallback
      }
    }
    return 0;
  });
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`quiz_correct_${chapterId}_${missionSeq}`);
    if (saved !== null) return parseInt(saved, 10) || 0;
    const savedAns = sessionStorage.getItem(`user_answers_${chapterId}_${missionSeq}`);
    if (savedAns) {
      try {
        const arr = JSON.parse(savedAns);
        if (Array.isArray(arr)) return arr.filter((a: any) => a?.isCorrect).length;
      } catch (e) {
        // Ignored fallback
      }
    }
    return 0;
  });
  const [basketCount, setBasketCount] = useState(0);
  const [selectedDragValue, setSelectedDragValue] = useState<string | null>(null);
  const [quizConfirmed, setQuizConfirmed] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  // Stats state
  const [xpEarned, setXpEarned] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`xp_earned_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });
  const [coinsEarned, setCoinsEarned] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`coins_earned_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });
  const [streak, setStreak] = useState(1);

  const QUESTION_TIME_LIMIT = 30;

  // Question Countdown Timer State (30s per question)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [totalSessionSec, setTotalSessionSec] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`mission_timer_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });

  // Boss Battle state
  const [bossDamageCount, setBossDamageCount] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`boss_damage_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });
  const [childDamageCount, setChildDamageCount] = useState(0); // tracks hearts lost (0-3)
  const [wrongAnswerCount, setWrongAnswerCount] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`boss_wrong_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });
  const [currentBossIndex, setCurrentBossIndex] = useState(() => {
    if (isReplay) return 0;
    const saved = sessionStorage.getItem(`boss_index_${chapterId}_${missionSeq}`);
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });
  const [bossSelected, setBossSelected] = useState<number | null>(null);
  const [bossConfirmed, setBossConfirmed] = useState(false);
  const [bossAngry, setBossAngry] = useState(false);
  const [dragonCrying, setDragonCrying] = useState(false);
  const [bossBasketCount, setBossBasketCount] = useState(0);
  const [selectedBossDragValue, setSelectedBossDragValue] = useState<string | null>(null);

  // Revival State
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [revivalSpins, setRevivalSpins] = useState(0);
  const [hasDoubleDamage, setHasDoubleDamage] = useState(false);
  const [lossOverlay, setLossOverlay] = useState<{ show: boolean; xpLoss: number }>({ show: false, xpLoss: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [userCoins, setUserCoins] = useState(0);

  // Duolingo Streak animations and steps
  const [summaryStep, setSummaryStep] = useState<"LESSON_COMPLETE" | "STREAK" | "REPORT">(() => {
    if (isReplay) return "LESSON_COMPLETE";
    const saved = sessionStorage.getItem(`summary_step_${chapterId}_${missionSeq}`);
    return (saved as any) || "LESSON_COMPLETE";
  });
  const [displayedStreak, setDisplayedStreak] = useState(0);
  const [streakDaysOfWeek, setStreakDaysOfWeek] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [animateStreakNumber, setAnimateStreakNumber] = useState(false);

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

  useEffect(() => {
    sessionStorage.setItem(`boss_damage_${chapterId}_${missionSeq}`, bossDamageCount.toString());
  }, [bossDamageCount, chapterId, missionSeq]);

  useEffect(() => {
    sessionStorage.setItem(`boss_wrong_${chapterId}_${missionSeq}`, wrongAnswerCount.toString());
  }, [wrongAnswerCount, chapterId, missionSeq]);

  useEffect(() => {
    sessionStorage.setItem(`boss_index_${chapterId}_${missionSeq}`, currentBossIndex.toString());
  }, [currentBossIndex, chapterId, missionSeq]);

  useEffect(() => {
    sessionStorage.setItem(`quiz_correct_${chapterId}_${missionSeq}`, quizCorrectCount.toString());
  }, [quizCorrectCount, chapterId, missionSeq]);

  useEffect(() => {
    sessionStorage.setItem(`xp_earned_${chapterId}_${missionSeq}`, xpEarned.toString());
  }, [xpEarned, chapterId, missionSeq]);

  useEffect(() => {
    sessionStorage.setItem(`coins_earned_${chapterId}_${missionSeq}`, coinsEarned.toString());
  }, [coinsEarned, chapterId, missionSeq]);

  // Final Summary state
  const [completionResult, setCompletionResult] = useState<any>(() => {
    if (isReplay) return null;
    const saved = sessionStorage.getItem(`completion_result_${chapterId}_${missionSeq}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [userAnswers, setUserAnswers] = useState<any[]>(() => {
    if (isReplay) return [];
    const saved = sessionStorage.getItem(`user_answers_${chapterId}_${missionSeq}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(`user_answers_${chapterId}_${missionSeq}`, JSON.stringify(userAnswers));
  }, [userAnswers, chapterId, missionSeq]);

  useEffect(() => {
    if (phase && phase !== "INTRO") {
      sessionStorage.setItem(`mission_phase_${chapterId}_${missionSeq}`, phase);
    }
  }, [phase, chapterId, missionSeq]);

  useEffect(() => {
    if (phase === "SUMMARY") {
      sessionStorage.setItem(`summary_step_${chapterId}_${missionSeq}`, summaryStep);
    }
  }, [summaryStep, phase, chapterId, missionSeq]);

  useEffect(() => {
    if (searchParams.get("replay") === "true") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("replay");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [isQuitting, setIsQuitting] = useState(false);

  // Fetch Mission Data Effect
  useEffect(() => {
    async function fetchMission() {
      try {
        if (isReplay) {
          apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, { method: "DELETE" }).catch(() => {});
        }
        const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}`);
        const json = await res.json();
        if (json.success && json.data) {
          setMissionData(json.data);

          // Restore draft from database if present (ignore when starting fresh replay)
          const draft = isReplay ? null : json.data.activeDraft;
          if (draft) {
            if (typeof draft.currentQuizIndex === "number") setCurrentQuizIndex(draft.currentQuizIndex);
            if (draft.phase && draft.phase !== "INTRO") setPhase(draft.phase);
            if (typeof draft.quizCorrectCount === "number") setQuizCorrectCount(draft.quizCorrectCount);
            if (Array.isArray(draft.userAnswers)) setUserAnswers(draft.userAnswers);
            if (typeof draft.xpEarned === "number") setXpEarned(draft.xpEarned);
            if (typeof draft.coinsEarned === "number") setCoinsEarned(draft.coinsEarned);
            if (typeof draft.bossDamageCount === "number") setBossDamageCount(draft.bossDamageCount);
            if (typeof draft.wrongAnswerCount === "number") setWrongAnswerCount(draft.wrongAnswerCount);
            if (typeof draft.currentBossIndex === "number") setCurrentBossIndex(draft.currentBossIndex);
            if (typeof draft.totalSessionSec === "number") setTotalSessionSec(draft.totalSessionSec);
          }

          if (json.data.doubleDamage !== undefined) {
            setHasDoubleDamage(json.data.doubleDamage);
          }
          if (isReplay || !draft) {
            setChildDamageCount(0);
            setBossDamageCount(0);
            setWrongAnswerCount(0);
            setCurrentBossIndex(0);
            sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
          } else if (json.data.childHearts !== undefined && draft?.phase === "BOSS") {
            setChildDamageCount(Math.max(0, 3 - json.data.childHearts));
            if (json.data.childHearts === 0) {
              openReviveModal();
            }
          } else {
            setChildDamageCount(0);
          }
        }
      } catch (e) {
        console.error("Failed to load mission:", e);
      } finally {
        setLoading(false);
        setIsDraftRestored(true);
      }
    }
    fetchMission();
  }, [chapterId, missionSeq]);

  // Auto-sync active mission draft state to backend database (Solution 1)
  useEffect(() => {
    if (!isDraftRestored || isQuitting || !phase || phase === "INTRO" || phase === "SUMMARY" || loading || childDamageCount >= 3) return;

    const timeoutId = setTimeout(() => {
      apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentQuizIndex,
          phase,
          quizCorrectCount,
          userAnswers,
          xpEarned,
          coinsEarned,
          bossDamageCount,
          wrongAnswerCount,
          currentBossIndex,
          totalSessionSec
        })
      }).catch((err) => console.error("Failed to sync draft to server:", err));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    isDraftRestored,
    isQuitting,
    childDamageCount,
    currentQuizIndex,
    phase,
    quizCorrectCount,
    userAnswers,
    xpEarned,
    coinsEarned,
    bossDamageCount,
    wrongAnswerCount,
    currentBossIndex,
    totalSessionSec,
    chapterId,
    missionSeq,
    isReplay,
    loading
  ]);

  const defaultQuiz = [
    { _id: "fq1", question: "Which of the following is a synonym for 'happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], answer: "Joyful", type: "multiple_choice" },
    { _id: "fq2", question: "Which of these is a primary color?", options: ["Red", "Green", "Purple", "Orange"], answer: "Red", type: "multiple_choice" },
    { _id: "fq3", question: "What is the capital city of France?", options: ["Paris", "London", "Berlin", "Rome"], answer: "Paris", type: "multiple_choice" },
    { _id: "fq4", question: "What comes after the letter B in the alphabet?", options: ["C", "A", "D", "E"], answer: "C", type: "multiple_choice" }
  ];

  const shuffleQuestionOptions = (questions: any[]) => {
    return questions.map((q) => {
      if (!q || !q.options || !Array.isArray(q.options) || q.options.length < 2) return q;
      const opts = [...q.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return { ...q, options: opts };
    });
  };

  const rawQuiz = (missionData?.quizQuestions && missionData.quizQuestions.length > 0)
    ? missionData.quizQuestions
    : defaultQuiz;

  const quizQuestions = useMemo(() => shuffleQuestionOptions(rawQuiz), [rawQuiz]);

  const rawBoss = (missionData?.bossQuestions && missionData.bossQuestions.length > 0)
    ? missionData.bossQuestions
    : (() => {
        const half = Math.ceil(quizQuestions.length / 2);
        return [...quizQuestions.slice(half), ...quizQuestions.slice(0, half)];
      })();

  const bossQuestions = useMemo(() => {
    const list = rawBoss.length > 0 ? rawBoss : (quizQuestions.length > 0 ? quizQuestions : defaultQuiz);
    return shuffleQuestionOptions(list);
  }, [rawBoss, quizQuestions]);

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
  const isBossLanguageDrag = isBossDrag && activeBossQ?.options && activeBossQ.options.length > 0 && isNaN(Number(activeBossQ.options[0]));

  useEffect(() => {
    if (activeBossQ) {
      const initial = activeBossQ?.interaction?.details?.initialCount || 0;
      setBossBasketCount(initial);
    }
    setBossSelected(null);
    setBossConfirmed(false);
    setSelectedBossDragValue(null);
  }, [currentBossIndex, activeBossQ?._id]);

  const activeBossOptions = useMemo(() => {
    const rawOpts = (activeBossQ?.options && Array.isArray(activeBossQ.options) && activeBossQ.options.length > 0)
      ? activeBossQ.options
      : [activeBossQ?.answer || "Option 1", "Option 2", "Option 3", "Option 4"];

    const opts = [...rawOpts];
    // Seeded PRNG Fisher-Yates shuffle per question text/id
    const seedStr = String(activeBossQ?._id || activeBossQ?.question || currentBossIndex);
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
    }
    const rng = () => {
      h += h << 13;
      h ^= h >> 7;
      h += h << 3;
      h ^= h >> 17;
      return ((h += h << 5) >>> 0) / 4294967296;
    };
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [activeBossQ?._id, activeBossQ?.question, activeBossQ?.options, currentBossIndex]);

  const bossName = missionData?.bossName || "Boss Guardian";
  const missionTitle = missionData?.title || `Mission ${missionSeq}`;
  const missionIcon = missionData?.icon || "🎯";

  useEffect(() => {
    if (phase === "QUIZ" && quizQuestions.length > 0 && currentQuizIndex >= quizQuestions.length) {
      setPhase("MINI_REWARD");
    }
  }, [currentQuizIndex, quizQuestions.length, phase]);

  const safeQuizIndex = Math.min(currentQuizIndex, Math.max(0, quizQuestions.length - 1));
  const currentQ = quizQuestions[safeQuizIndex] || quizQuestions[0];
  const interactionType = currentQ?.interaction?.type || currentQ?.type || "multiple_choice";
  const isDragObjects = interactionType === "drag_objects";

  const dragDetails = currentQ?.interaction?.details || {};
  const targetCount = dragDetails.targetCount ?? (parseInt(currentQ?.answer) || 3);
  const totalDraggables = dragDetails.draggablesCount || (targetCount + 3);
  const objectEmoji = dragDetails.objectEmoji || "🍎";
  const isLanguageDrag = isDragObjects && currentQ?.options && currentQ.options.length > 0 && isNaN(Number(currentQ.options[0]));

  useEffect(() => {
    if (currentQ) {
      const initial = currentQ?.interaction?.details?.initialCount || 0;
      setBasketCount(initial);
    }
    setQuizConfirmed(false);
    setQuizSelected(null);
    setSelectedDragValue(null);
  }, [safeQuizIndex, currentQ?._id]);

  // Boss Expression based on health & attack status
  const getBossExpression = () => {
    if (bossAngry) return { status: "Boss Enraged & Furious!", color: "from-[#2d328f] via-[#7c1d32] to-[#2b2fa3]" };
    if (bossHearts >= 3) return { status: "Confident & Fierce", color: "from-[#1c208c] to-[#2b2fa3]" };
    if (bossHearts === 2) return { status: "Annoyed & Shaken", color: "from-[#25299e] to-[#3a3ebd]" };
    if (bossHearts === 1) return { status: "Critical Health!", color: "from-[#3a1d7c] to-[#5b23a8]" };
    return { status: "Defeated!", color: "from-[#1a1c4b] to-[#272b6b]" };
  };

  const bossState = getBossExpression();

  const getSuccessFeedback = () => {
    if (streak > 2) {
      return {
        main: "🔥 You're on a roll!",
        sub: `${streak} correct answers in a row!`
      };
    }
    if (currentQ?.difficulty === "Hard" || currentQ?.isBoss) {
      return {
        main: "💪 Brilliant!",
        sub: "That was a tricky one — and you got it right!"
      };
    }
    const general = [
      { main: "🧠 Great thinking!", sub: "You understood this concept correctly." },
      { main: "🎯 You got it right!", sub: "Great thinking! You understood it correctly." },
      { main: "🎉 Nailed it!", sub: "Your answer is correct." },
      { main: "💡 Smart move!", sub: "You solved this challenge perfectly." },
      { main: "🌟 Brilliant work!", sub: "Keep going, you are doing awesome!" },
      { main: "🚀 You're getting stronger!", sub: "Every correct answer helps you grow." }
    ];
    return general[currentQuizIndex % general.length];
  };

  // Finalize Mission API helper
  const finalizeMission = async (finalBossDamage = bossDamageCount, finalChildDamage = childDamageCount, currentAnswers = userAnswers) => {
    setIsCompleting(true);
    try {
      // Clear boss & quiz session state
      sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
      sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);

      const bossCorrect = finalBossDamage;
      const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizCorrect: quizCorrectCount,
          quizTotal: quizQuestions.length,
          bossCorrect: bossCorrect,
          bossTotal: bossCorrect + wrongAnswerCount,
          timeTakenSec: totalSessionSec,
          livesRemaining: Math.max(0, 3 - finalChildDamage),
          answers: currentAnswers
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCompletionResult(json.data);
        sessionStorage.setItem(`completion_result_${chapterId}_${missionSeq}`, JSON.stringify(json.data));
        // Trigger Interactive Desktop Push Notification & Floating Banner Toast
        showInteractiveNotification(
          "🧩 MYSTERY SOLVED!",
          `You bagged ${json.data.earnedXp || 20} XP & ${json.data.earnedCoins || 50} Coins! Your dragon egg is glowing 🐉`,
          "/home",
          "gamification"
        );
        const oldStr = json.data.oldStreak !== undefined ? json.data.oldStreak : (json.data.streak || 1);
        setDisplayedStreak(oldStr);
        setStreakDaysOfWeek(json.data.streakDaysOfWeek || [false, false, false, false, false, false, false]);
        
        // If it should animate (first lesson today), trigger numbers increment after delay
        if (json.data.shouldAnimateStreak) {
          setTimeout(() => {
            setAnimateStreakNumber(true);
            setDisplayedStreak(json.data.streak || 1);
          }, 1500);
        } else {
          setDisplayedStreak(json.data.streak || 1);
        }
      } else {
        const fallbackRes = {
          xpEarned: xpEarned || 20,
          coinsEarned: coinsEarned || 50,
          earnedXp: xpEarned || 20,
          earnedCoins: coinsEarned || 50,
          accuracy: 100,
          totalQuestions: quizQuestions.length + bossQuestions.length,
          correctAnswers: quizCorrectCount + finalBossDamage,
          streak: streak || 1,
          todayLessonsCount: 1
        };
        setCompletionResult(fallbackRes);
        sessionStorage.setItem(`completion_result_${chapterId}_${missionSeq}`, JSON.stringify(fallbackRes));
      }
    } catch (e) {
      console.error("Failed to complete mission:", e);
    } finally {
      setIsCompleting(false);
      setPhase("SUMMARY");
    }
  };

  const handleBackToRoadmap = useCallback(async () => {
    sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`completion_result_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`summary_step_${chapterId}_${missionSeq}`);

    try {
      await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, { method: "DELETE" });
    } catch (e) {}

    navigate(`/mission-roadmap?chapterId=${chapterId}`);
  }, [chapterId, missionSeq, navigate]);

  const handleReplayMission = useCallback(async () => {
    sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`completion_result_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`summary_step_${chapterId}_${missionSeq}`);

    try {
      await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, { method: "DELETE" });
    } catch (e) {}

    window.location.href = `/mission-play?chapterId=${chapterId}&missionSeq=${missionSeq}&replay=true`;
  }, [chapterId, missionSeq]);

  const handleNextMission = useCallback(async () => {
    const nextSeq = missionSeq + 1;
    sessionStorage.removeItem(`user_answers_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`mission_phase_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`mission_timer_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`boss_damage_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`boss_wrong_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`boss_index_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`quiz_correct_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`xp_earned_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`coins_earned_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`completion_result_${chapterId}_${nextSeq}`);
    sessionStorage.removeItem(`summary_step_${chapterId}_${nextSeq}`);

    try {
      await apiFetch(`/api/practice/chapters/${chapterId}/missions/${nextSeq}/draft`, { method: "DELETE" });
    } catch (e) {}

    window.location.href = `/mission-play?chapterId=${chapterId}&missionSeq=${nextSeq}`;
  }, [chapterId, missionSeq]);

  const handleGiveUp = async () => {
    setIsQuitting(true);
    setShowReviveModal(false);

    // Clear all session storage keys for this mission
    sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
    sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);

    try {
      // Call backend retreat endpoint to apply XP deduction & reset hearts
      await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/retreat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: userAnswers
        })
      });
      // Delete draft on server explicitly
      await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Failed to call retreat API:", e);
    }

    // Show the defeat overlay with XP loss
    setLossOverlay({ show: true, xpLoss: -30 });

    // Navigate back to the previous screen (the roadmap) after 3 seconds
    setTimeout(() => {
      navigate(`/mission-roadmap?chapterId=${chapterId}`, { replace: true });
    }, 3000);
  };

  // Boss Attack execution helper
  const executeBossAttack = useCallback((isCorrect: boolean, currentAnswers = userAnswers) => {
    if (isCorrect) {
      // Right Answer -> Boss is Angry!
      setBossAngry(true);
      setDragonCrying(false);
      const newBossDamage = bossDamageCount + (hasDoubleDamage ? 2 : 1);
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
          await finalizeMission(newBossDamage, childDamageCount, currentAnswers);
        } else {
          setCurrentBossIndex(nextIndex);
        }
      }, 1400);

    } else {
      // Wrong Answer -> Dragon/Hero is Crying!
      setDragonCrying(true);
      setBossAngry(false);
      setXpEarned((prev) => Math.max(0, prev - 25));
      setCoinsEarned((prev) => Math.max(0, prev - 20));
      const newWrongCount = wrongAnswerCount + 1;
      setWrongAnswerCount(newWrongCount);

      const newChildDamage = Math.min(3, childDamageCount + 1);
      setChildDamageCount(newChildDamage);

      // Sync updated lives to the backend immediately so that revival spin checks are accurate
      apiFetch(`/api/practice/chapters/${chapterId}/missions/hearts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hearts: Math.max(0, 3 - newChildDamage) })
      }).catch(console.error);

      setTimeout(() => {
        setDragonCrying(false);
      }, 1200);

      setTimeout(async () => {
        setBossSelected(null);
        setBossBasketCount(0);
        const nextIndex = currentBossIndex + 1;
        if (newChildDamage >= 3) {
          openReviveModal();
        } else if (nextIndex >= bossQuestions.length) {
          await finalizeMission(bossDamageCount, newChildDamage, currentAnswers);
        } else {
          setCurrentBossIndex(nextIndex);
        }
      }, 1400);
    }
  }, [bossDamageCount, childDamageCount, wrongAnswerCount, currentBossIndex, bossMaxHp, bossQuestions.length, userAnswers, hasDoubleDamage]);

  const handleQuizConfirm = () => {
    if (!quizConfirmed) {
      let isCorrect = false;
      if (isDragObjects) {
        if (isLanguageDrag) {
          isCorrect = String(selectedDragValue).trim().toLowerCase() === String(currentQ?.answer).trim().toLowerCase();
        } else {
          isCorrect = (basketCount === targetCount || String(basketCount) === String(currentQ?.answer));
        }
      } else {
        if (quizSelected === null) return;
        const selectedOpt = currentQ?.options?.[quizSelected];
        isCorrect = String(selectedOpt).trim().toLowerCase() === String(currentQ?.answer).trim().toLowerCase();
      }

      setQuizConfirmed(true);
      setQuizIsCorrect(isCorrect);

      const selectedValue = isDragObjects 
        ? (isLanguageDrag ? String(selectedDragValue) : String(basketCount)) 
        : (quizSelected !== null ? String(currentQ?.options?.[quizSelected]) : "");
      const newAns = {
        questionId: currentQ?._id,
        isCorrect: isCorrect,
        selectedAnswer: selectedValue,
        timeSpent: QUESTION_TIME_LIMIT - questionTimeLeft
      };
      setUserAnswers((prev) => [...prev, newAns]);

      if (isCorrect) {
        setQuizCorrectCount((prev) => prev + 1);
        setXpEarned((prev) => prev + 15);
        setCoinsEarned((prev) => prev + 10);
        setStreak((prev) => prev + 1);
      } else {
        setXpEarned((prev) => Math.max(0, prev - 15));
        setCoinsEarned((prev) => Math.max(0, prev - 10));
        setStreak(1);
      }
    } else {
      setQuizConfirmed(false);
      setQuizSelected(null);
      setBasketCount(0);
      setQuestionTimeLeft(QUESTION_TIME_LIMIT);
      setIsTimeout(false);
      if (currentQuizIndex + 1 < quizQuestions.length) {
        setCurrentQuizIndex((prev) => prev + 1);
      } else {
        setPhase("MINI_REWARD");
      }
    }
  };

  const handleBossAnswer = (optionIndex: number) => {
    if (bossConfirmed) return;
    setBossSelected(optionIndex);
  };

  const handleBossMCConfirm = () => {
    if (bossSelected === null || bossConfirmed) return;
    setBossConfirmed(true);

    const optionText = activeBossOptions[bossSelected];
    const isCorrect = String(optionText).trim().toLowerCase() === String(activeBossQ?.answer).trim().toLowerCase();
    const newAns = {
      questionId: activeBossQ?._id,
      isCorrect: isCorrect,
      selectedAnswer: optionText,
      timeSpent: QUESTION_TIME_LIMIT - questionTimeLeft
    };
    const updatedAnswers = [...userAnswers, newAns];
    setUserAnswers(updatedAnswers);
    executeBossAttack(isCorrect, updatedAnswers);
  };

  const handleBossDragConfirm = () => {
    if (bossConfirmed) return;
    setBossConfirmed(true);
    let isCorrect = false;
    if (isBossLanguageDrag) {
      isCorrect = String(selectedBossDragValue).trim().toLowerCase() === String(activeBossQ?.answer).trim().toLowerCase();
    } else {
      isCorrect = (bossBasketCount === bossTargetCount || String(bossBasketCount) === String(activeBossQ?.answer));
    }
    const newAns = {
      questionId: activeBossQ?._id,
      isCorrect: isCorrect,
      selectedAnswer: isBossLanguageDrag ? String(selectedBossDragValue) : String(bossBasketCount),
      timeSpent: QUESTION_TIME_LIMIT - questionTimeLeft
    };
    const updatedAnswers = [...userAnswers, newAns];
    setUserAnswers(updatedAnswers);
    executeBossAttack(isCorrect, updatedAnswers);
  };

  useEffect(() => {
    if (phase && phase !== "INTRO") {
      sessionStorage.setItem(`mission_phase_${chapterId}_${missionSeq}`, phase);
    }
  }, [phase, chapterId, missionSeq]);

  // Overall session active timer (for parent space total time reporting)
  useEffect(() => {
    if (phase === "SUMMARY") return;
    const timer = setInterval(() => {
      if (isCompleting) return;
      setTotalSessionSec((prev) => {
        const next = prev + 1;
        sessionStorage.setItem(`mission_timer_${chapterId}_${missionSeq}`, next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [chapterId, missionSeq, isCompleting, phase]);

  // Reset 30-second countdown on question change
  useEffect(() => {
    setQuestionTimeLeft(QUESTION_TIME_LIMIT);
    setIsTimeout(false);
  }, [currentQuizIndex, currentBossIndex, phase]);

  // 30s Per-Question Countdown Timer Effect (30s -> 29s -> 28s ... -> 0s)
  useEffect(() => {
    if (isCompleting) return;
    if (phase === "QUIZ" && !quizConfirmed) {
      if (questionTimeLeft <= 0) {
        // Auto-fail on 30s timeout
        setIsTimeout(true);
        setQuizConfirmed(true);
        setQuizIsCorrect(false);
        setXpEarned((prev) => Math.max(0, prev - 15));
        setCoinsEarned((prev) => Math.max(0, prev - 10));
        setStreak(1);

        const newAns = {
          questionId: currentQ?._id,
          isCorrect: false,
          selectedAnswer: "TIMEOUT",
          timeSpent: QUESTION_TIME_LIMIT
        };
        setUserAnswers((prev) => [...prev, newAns]);
        return;
      }
      const t = setInterval(() => {
        setQuestionTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(t);
    } else if (phase === "BOSS" && !bossConfirmed && !bossAngry && !dragonCrying) {
      if (questionTimeLeft <= 0) {
        // Auto-fail boss question on 30s timeout (deduct exactly 1 heart)
        setIsTimeout(true);
        setQuestionTimeLeft(QUESTION_TIME_LIMIT);
        setBossSelected(-1);
        setBossConfirmed(true);

        const newAns = {
          questionId: activeBossQ?._id,
          isCorrect: false,
          selectedAnswer: "TIMEOUT",
          timeSpent: QUESTION_TIME_LIMIT
        };
        const updatedAnswers = [...userAnswers, newAns];
        setUserAnswers(updatedAnswers);
        executeBossAttack(false, updatedAnswers);
        return;
      }
      const t = setInterval(() => {
        setQuestionTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(t);
    }
  }, [phase, questionTimeLeft, quizConfirmed, bossSelected, bossConfirmed, bossAngry, dragonCrying, executeBossAttack, currentQ?._id, activeBossQ?._id, userAnswers, isCompleting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] text-[#141779] flex flex-col items-center justify-center p-6 font-sans">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-[#141779]/15 border-t-[#141779] rounded-full animate-spin shadow-sm" />
          <span className="absolute text-2xl">🎯</span>
        </div>
        <h3 className="font-black text-lg text-[#141779] mb-1">Preparing Mission {missionSeq}</h3>
        <p className="font-medium text-xs text-[#767683] animate-pulse">Loading questions and boss arena...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-x-hidden flex flex-col justify-between">
      <header className="sticky top-0 z-40 bg-[rgba(247,249,251,0.85)] backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-xs">
        <button
          onClick={async () => {
            if (childDamageCount >= 3 || showReviveModal) {
              setIsQuitting(true);
              sessionStorage.removeItem(`boss_damage_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`boss_wrong_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`boss_index_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`mission_phase_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`mission_timer_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`user_answers_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`quiz_correct_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`xp_earned_${chapterId}_${missionSeq}`);
              sessionStorage.removeItem(`coins_earned_${chapterId}_${missionSeq}`);

              try {
                await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/retreat`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ answers: userAnswers })
                });
                await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, {
                  method: "DELETE"
                });
              } catch (e) {}
            } else if (!isQuitting && phase && phase !== "INTRO" && phase !== "SUMMARY") {
              try {
                await apiFetch(`/api/practice/chapters/${chapterId}/missions/${missionSeq}/draft`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    currentQuizIndex,
                    phase,
                    quizCorrectCount,
                    userAnswers,
                    xpEarned,
                    coinsEarned,
                    bossDamageCount,
                    wrongAnswerCount,
                    currentBossIndex,
                    totalSessionSec
                  })
                });
              } catch (e) {
                console.error("Save draft on back button click failed:", e);
              }
            }
            navigate(`/mission-roadmap?chapterId=${chapterId}`, { replace: true });
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <ArrowLeft size={18} className="text-[#141779]" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 bg-amber-50 px-2 sm:px-3 py-1 rounded-full border border-amber-200 text-amber-800 font-bold text-[10px] sm:text-xs shrink-0 whitespace-nowrap">
            <Zap size={12} className="text-amber-500 fill-amber-400" />
            <span>{xpEarned} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-teal-50 px-2 sm:px-3 py-1 rounded-full border border-teal-200 text-teal-800 font-bold text-[10px] sm:text-xs shrink-0 whitespace-nowrap">
            <Award size={12} className="text-teal-600 fill-teal-500" />
            <span>{coinsEarned} Coins</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {phase === "SUMMARY" && (
            <button
              onClick={handleReplayMission}
              title={t('replay_mission_btn', 'Replay Mission 🔄')}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#141779] text-white hover:bg-[#101362] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer border border-indigo-200"
            >
              <RotateCcw size={16} className="text-white" />
            </button>
          )}

          <div className={`flex items-center gap-1 sm:gap-1.5 border px-2 sm:px-3.5 py-1 rounded-full font-mono font-extrabold text-[10px] sm:text-xs shadow-2xs transition-all shrink-0 whitespace-nowrap ${(phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5
              ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse ring-2 ring-rose-400/40"
              : "bg-slate-100/90 border-slate-200 text-slate-800"
            }`}>
            <div className="relative flex items-center justify-center">
              <Clock size={12} className={(phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5 ? "text-rose-600 animate-bounce" : "text-indigo-600"} />
              <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${(phase === "QUIZ" || phase === "BOSS") && questionTimeLeft <= 5 ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-ping"
                }`} />
            </div>
            <span>
              {phase === "QUIZ" || phase === "BOSS"
                ? `${questionTimeLeft}s`
                : `${Math.floor(totalSessionSec / 60).toString().padStart(2, '0')}:${(totalSessionSec % 60).toString().padStart(2, '0')}`}
            </span>
          </div>
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
            {t('mission_launch', { seq: missionSeq, defaultValue: `Mission ${missionSeq} Launch` })}
          </span>

          <h2 className="text-2xl font-black text-[#141779] mb-2">
            {t(missionTitle.toLowerCase().replace(/ /g, '_'), { defaultValue: missionTitle })}
          </h2>
          <p className="text-[#464652] text-sm mb-8 leading-relaxed font-medium">
            {t('solve_practice_q_desc', { count: quizQuestions.length, boss: t(bossName.toLowerCase().replace(/ /g, '_'), { defaultValue: bossName }), defaultValue: `Solve ${quizQuestions.length} practice questions to charge your weapon, then defeat ${bossName} in the Boss Arena!` })}
          </p>

          <div className="w-full bg-white border border-gray-200 rounded-3xl p-5 mb-8 text-left flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h4 className="text-xs font-bold uppercase text-[#767683] tracking-wider">{t('mission_objectives', 'Mission Objectives')}</h4>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#141779]">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>{t('complete_practice_questions', { count: quizQuestions.length, defaultValue: `Complete ${quizQuestions.length} Practice Questions` })}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#141779]">
              <CheckCircle2 size={18} className="text-amber-500" />
              <span>{t('defeat_boss', { boss: t(bossName.toLowerCase().replace(/ /g, '_'), { defaultValue: bossName }), defaultValue: `Defeat ${bossName} (3 Boss Hearts)` })}</span>
            </div>
          </div>

          <button
            onClick={() => setPhase("QUIZ")}
            className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>{t('start_mission', 'Start Mission')}</span>
            <Play size={18} className="fill-white" />
          </button>
        </main>
      )}

      {phase === "QUIZ" && (
        <main className="px-6 py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#767683] mb-2">
              <span className="flex items-center gap-1.5 font-extrabold text-[#141779]">
                {isDragObjects ? t('drag_drop_phase', '🧩 Drag & Drop Phase') : t('quiz_phase', '🎯 Quiz Phase')}
              </span>
              <span>
                {t('question_counter', { current: currentQuizIndex + 1, total: quizQuestions.length, defaultValue: `Question ${currentQuizIndex + 1} of ${quizQuestions.length}` })}
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
              {t('question_number', { num: currentQuizIndex + 1, defaultValue: `Question #${currentQuizIndex + 1}` })} {isDragObjects ? t('drag_drop_tag', '• Drag & Drop') : ""}
            </span>
            <h3 className="text-lg font-bold text-[#141779] leading-snug">
              {currentQ?.question?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
            </h3>
          </div>

          {isDragObjects ? (
            <div className="flex flex-col gap-4 mb-4">
              <div
                className={`w-full min-h-[140px] rounded-2xl border-4 border-dashed p-4 flex flex-wrap gap-2 items-center justify-center transition-colors ${quizConfirmed
                    ? quizIsCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                  }`}
                onClick={() => {
                  if (!quizConfirmed) {
                    if (isLanguageDrag) {
                      setSelectedDragValue(null);
                      setBasketCount(0);
                    } else if (basketCount > 0) {
                      setBasketCount((prev) => prev - 1);
                    }
                  }
                }}
              >
                {isLanguageDrag ? (
                  selectedDragValue === null ? (
                    <span className="text-gray-400 font-bold select-none text-center text-sm uppercase tracking-wider">
                      {t('tap_option_spelling', 'Tap an option below to complete the spelling!')}
                    </span>
                  ) : (
                    <span className="text-5xl font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-300 px-6 py-4 rounded-2xl shadow-inner animate-in zoom-in-50 duration-200">
                      {selectedDragValue}
                    </span>
                  )
                ) : (
                  <>
                    {basketCount === 0 && (
                      <span className="text-gray-400 font-bold select-none text-center text-sm uppercase tracking-wider">
                        {t('tap_items_basket', 'Tap items below to add to Basket!')}
                      </span>
                    )}
                    {Array.from({ length: basketCount }).map((_, i) => (
                      <span key={i} className="text-4xl animate-bounce drop-shadow-sm select-none">
                        {objectEmoji}
                      </span>
                    ))}
                  </>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 p-4 bg-white rounded-2xl shadow-xs border border-gray-200">
                {isLanguageDrag ? (
                  currentQ.options.map((opt: string, idx: number) => {
                    const isSelected = selectedDragValue === opt;
                    return (
                      <button
                        key={idx}
                        disabled={quizConfirmed}
                        onClick={() => {
                          if (!quizConfirmed) {
                            setSelectedDragValue(opt);
                            setBasketCount(1);
                          }
                        }}
                        className={`px-5 py-3 rounded-xl border text-xl font-bold transition-all ${
                          isSelected
                            ? "bg-[#141779] border-[#141779] text-white scale-105 shadow-md animate-pulse"
                            : "bg-gray-50 border-gray-200 text-slate-700 hover:border-indigo-400 active:scale-95"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })
                ) : (
                  <>
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
                  </>
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
                  if (isTimeout) {
                    style = "bg-white border-gray-200 text-[#191c1e] opacity-60";
                  } else if (isCorrect) {
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
                    <span className="flex-1 mr-4 break-words text-left">{opt}</span>
                    {quizConfirmed && !isTimeout && isCorrect && <CheckCircle2 size={20} className="text-white" />}
                    {quizConfirmed && !isTimeout && isSelected && !isCorrect && <XCircle size={20} className="text-white" />}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">

            <button
              disabled={!isDragObjects && quizSelected === null && !quizConfirmed}
              onClick={handleQuizConfirm}
              className={`w-full py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${!isDragObjects && quizSelected === null && !quizConfirmed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : !quizConfirmed
                    ? "bg-[#141779] text-white hover:bg-[#101362]"
                    : quizIsCorrect
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              <span>{quizConfirmed ? t('continue_btn', 'CONTINUE →') : t('check_answer', 'CHECK ANSWER')}</span>
            </button>
          </div>
        </main>
      )}

      {phase === "MINI_REWARD" && (() => {
        return (
          <main className="px-6 py-8 flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg border-4 bg-emerald-100 border-emerald-400"
            >
              🌟
            </motion.div>

            <h2 className="text-2xl font-black text-[#141779] mb-2">
              {t('quiz_phase_complete', 'Quiz Phase Complete!')}
            </h2>
            <p className="text-[#464652] text-sm mb-6 font-medium leading-relaxed">
              {t('quiz_phase_complete_desc', { correct: quizCorrectCount, total: quizQuestions.length, defaultValue: `Awesome job! You answered ${quizCorrectCount} out of ${quizQuestions.length} correctly. Your energy is charged for the Boss Battle!` })}
            </p>

            <div className="bg-white border border-gray-200 p-5 rounded-3xl w-full mb-8 flex justify-around shadow-xs">
              <div>
                <span className="text-xs text-[#767683] block font-semibold">{t('bonus_xp', 'Bonus XP')}</span>
                <span className="text-xl font-black text-amber-600">+{xpEarned}</span>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <span className="text-xs text-[#767683] block font-semibold">{t('bonus_coins', 'Bonus Coins')}</span>
                <span className="text-xl font-black text-teal-600">+{coinsEarned}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPhase("BOSS");
              }}
              className="w-full py-4 rounded-2xl bg-[#141779] text-white font-black text-base shadow-lg hover:bg-[#101362] flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span>{t('enter_boss_arena', 'Enter Boss Arena 👹')}</span>
            </button>
          </main>
        );
      })()}

      {phase === "BOSS" && (
        <main className="px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
          {/* Top Outer Indigo/Lavender Boss Stage Header Card with Premium Visual Aesthetics */}
          <div className="bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] rounded-[28px] sm:rounded-[32px] p-3 sm:p-5 pt-4 pb-3.5 mb-4 shadow-[0_10px_30px_rgba(20,23,121,0.08)] border-2 border-indigo-200/80 relative backdrop-blur-md overflow-hidden">
            
            {/* Top Bar: Hero vs Boss Header */}
            <div className="flex items-center justify-between mb-3 relative z-10 px-0.5 gap-1">

              {/* Left: Dragon Hero in Pill Container */}
              <div className="flex flex-col items-start shrink-0 bg-white/95 backdrop-blur-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-indigo-100/80 shadow-2xs">
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase text-[#141779] tracking-wider block leading-tight whitespace-nowrap">
                  DRAGON HERO
                </span>
                <div className="flex gap-0.5 sm:gap-1 mt-1">
                  {[1, 2, 3].map((h) => (
                    <Heart
                      key={h}
                      size={13}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${h <= childHearts ? (dragonCrying ? "text-cyan-500 fill-cyan-400 animate-ping" : "text-rose-500 fill-rose-500 drop-shadow-xs") : "text-slate-300 fill-slate-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Center: Boss Stage Badge */}
              <div className="px-2 py-1 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white font-black text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full shadow-md border border-white/20 flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>BOSS STAGE</span>
                <span className="text-xs">⚔️</span>
              </div>

              {/* Right: Boss Name / Chapter Stage in Pill Container */}
              <div className="flex flex-col items-end shrink-0 bg-white/95 backdrop-blur-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-indigo-100/80 shadow-2xs min-w-0">
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase text-[#141779] tracking-wider block leading-tight text-right whitespace-nowrap max-w-[110px] xs:max-w-none truncate">
                  {bossName ? bossName.toUpperCase() : 'BOSS'}
                </span>
                <div className="flex gap-0.5 sm:gap-1 mt-1">
                  {[1, 2, 3].map((h) => (
                    <Heart
                      key={h}
                      size={13}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${h <= bossHearts ? "text-rose-500 fill-rose-500 drop-shadow-xs" : "text-slate-300 fill-slate-200"}`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Inner White Boss Card with Soft Depth & Breathing Animation */}
            <div className="relative p-3.5 sm:p-4 rounded-[24px] bg-white border-2 border-indigo-100/80 flex items-center justify-between shadow-xs">
              <motion.div
                animate={{
                  y: bossAngry ? [0, -8, 0] : [0, -4, 0],
                  scale: bossAngry ? [1, 1.08, 1] : 1,
                  rotate: bossAngry ? [-3, 3, -3, 3, 0] : 0
                }}
                transition={bossAngry ? { duration: 0.5, repeat: 2 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center gap-3"
              >
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-xs relative ${bossAngry ? "ring-4 ring-rose-500/80 animate-pulse" : ""}`}>
                  <span>🐉</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-[#141779] leading-tight drop-shadow-2xs">{bossName}</h4>
                  <span className={`text-xs font-bold ${bossAngry ? "text-rose-600 animate-pulse" : "text-indigo-600"}`}>
                    {bossState.status}
                  </span>
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-xs font-black bg-indigo-50/80 border border-indigo-100 px-3.5 py-1.5 rounded-full text-[#141779] shadow-2xs whitespace-nowrap">
                  {bossHearts} / {bossMaxHp} HP
                </span>
              </div>
            </div>
          </div>

          {/* Question Box Card with Soft Floating Elevation */}
          <div className="my-3 bg-white border-2 border-[#E2E4FA] rounded-[28px] p-5 sm:p-6 shadow-[0_8px_25px_rgba(20,23,121,0.06)] relative">
            <span className="text-xs font-black text-[#006a62] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span>⚔️ BOSS STRIKE #{safeBossIndex + 1}</span>
              <span>•</span>
              <span>{isBossDrag ? "DRAG & DROP STRIKE" : "DIRECT STRIKE"}</span>
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#141779] leading-snug">
              {activeBossQ?.question?.replace(/^(Boss\s+)?(Challenge|Question)(\s*#\d+)?(\s*\([^)]+\))?:\s*/i, "").trim().replace(/^\w/, c => c.toUpperCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
            </h3>
          </div>

          {/* Answer options / drag section with Enhanced UI */}
          {isBossDrag ? (
            <div className="flex flex-col gap-4 mb-4">
              <div
                className="w-full min-h-[120px] rounded-2xl border-2 border-dashed border-[#141779]/30 bg-indigo-50/60 p-4 flex flex-wrap gap-2 items-center justify-center cursor-pointer shadow-inner"
                onClick={() => {
                  if (!bossConfirmed) {
                    if (isBossLanguageDrag) {
                      setSelectedBossDragValue(null);
                      setBossBasketCount(0);
                    } else if (bossBasketCount > 0) {
                      setBossBasketCount((prev) => prev - 1);
                    }
                  }
                }}
              >
                {isBossLanguageDrag ? (
                  selectedBossDragValue === null ? (
                    <span className="text-[#141779]/70 font-bold select-none text-center text-xs uppercase tracking-wider">
                      {t('tap_boss_slot', 'Tap an option below to fill the boss weapon slot!')}
                    </span>
                  ) : (
                    <span className="text-4xl font-black text-indigo-700 bg-white border-2 border-indigo-300 px-5 py-3 rounded-xl shadow-sm animate-in zoom-in-50 duration-200">
                      {selectedBossDragValue}
                    </span>
                  )
                ) : (
                  <>
                    {bossBasketCount === 0 && (
                      <span className="text-[#141779]/70 font-bold select-none text-center text-xs uppercase tracking-wider">
                        {t('tap_items_basket', 'Tap items below to load into Weapon Basket!')}
                      </span>
                    )}
                    {Array.from({ length: bossBasketCount }).map((_, i) => (
                      <span key={i} className="text-3xl animate-bounce drop-shadow-xs select-none">
                        {bossObjectEmoji}
                      </span>
                    ))}
                  </>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-xs">
                {isBossLanguageDrag ? (
                  activeBossOptions.map((opt: string, idx: number) => {
                    const isSelected = selectedBossDragValue === opt;
                    return (
                      <button
                        key={idx}
                        disabled={bossConfirmed}
                        onClick={() => {
                          if (!bossConfirmed) {
                            setSelectedBossDragValue(opt);
                            setBossBasketCount(1);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-lg border text-lg font-bold transition-all ${
                          isSelected
                            ? "bg-[#141779] border-[#141779] text-white scale-105 shadow-md animate-pulse"
                            : "bg-gray-50 border-gray-200 text-slate-700 hover:border-indigo-400 active:scale-95"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <button
                disabled={bossConfirmed || (isBossLanguageDrag && selectedBossDragValue === null)}
                onClick={handleBossDragConfirm}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#141779] via-[#25299e] to-[#3a3ebd] text-white font-black text-base shadow-[0_10px_25px_rgba(20,23,121,0.25)] hover:bg-[#101362] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 uppercase tracking-wider"
              >
                <span>STRIKE BOSS ⚡</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex flex-col gap-3">
                {activeBossOptions.map((opt: string, idx: number) => {
                  const isSelected = bossSelected === idx;
                  const isCorrect = String(opt).trim().toLowerCase() === String(activeBossQ?.answer).trim().toLowerCase();

                  let style = "bg-white border-2 border-gray-200 text-[#141779] hover:border-[#141779] shadow-2xs hover:shadow-xs";
                  if (bossConfirmed) {
                    if (isTimeout) {
                      if (isCorrect) {
                        style = "bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-600 text-white font-black shadow-md shadow-emerald-500/20";
                      } else {
                        style = "bg-white border-2 border-gray-200 text-[#141779] opacity-60";
                      }
                    } else {
                      if (isCorrect) {
                        // Correct answer ALWAYS highlights green with ✓ icon
                        style = "bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-600 text-white font-black shadow-md shadow-emerald-500/20 animate-pulse";
                      } else if (isSelected) {
                        // Selected wrong answer highlights red with ✗ icon
                        style = "bg-gradient-to-r from-rose-500 to-red-600 border-2 border-rose-600 text-white font-black shadow-md shadow-rose-500/20";
                      } else {
                        style = "bg-white border-2 border-gray-200 text-[#141779] opacity-40";
                      }
                    }
                  } else {
                    if (isSelected) {
                      style = "bg-indigo-50/90 border-2 border-[#141779] text-[#141779] ring-2 ring-[#141779]/20 font-black shadow-sm scale-[1.01]";
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={!bossConfirmed ? { scale: 0.98 } : undefined}
                      disabled={bossConfirmed}
                      onClick={() => handleBossAnswer(idx)}
                      className={`w-full p-4 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between active:scale-98 ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                          bossConfirmed && isCorrect ? "bg-white/20 text-white" :
                          bossConfirmed && isSelected && !isCorrect ? "bg-white/20 text-white" :
                          isSelected ? "bg-[#141779] text-white" : "bg-[#F3F4F6] text-[#141779]"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {bossConfirmed && isCorrect && <CheckCircle2 size={20} className="text-white shrink-0 animate-bounce" />}
                      {bossConfirmed && isSelected && !isCorrect && <XCircle size={20} className="text-white shrink-0 animate-pulse" />}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={bossSelected !== null && !bossConfirmed ? { scale: 0.96 } : undefined}
                disabled={bossSelected === null || bossConfirmed}
                onClick={handleBossMCConfirm}
                className={`w-full py-4 mt-2 rounded-2xl text-white font-black text-base shadow-[0_10px_25px_rgba(20,23,121,0.2)] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 uppercase tracking-wider ${
                  bossSelected === null || bossConfirmed
                    ? "bg-[#9FA0D7] cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#141779] via-[#25299e] to-[#3a3ebd] hover:opacity-95"
                }`}
              >
                <span>STRIKE BOSS ⚡</span>
              </motion.button>
            </div>
          )}
        </main>
      )}

      {phase === "SUMMARY" && (
        <>
          {summaryStep === "LESSON_COMPLETE" && (
            <main className="fixed inset-0 z-50 bg-[#f7f9fb] flex flex-col items-center justify-between p-6 max-w-md mx-auto w-full text-center pb-8 animate-in fade-in duration-300">
              <div className="flex-1 flex flex-col items-center justify-center w-full gap-5">
                {/* Cute Class-Specific Animated Illustration */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="filter drop-shadow-md relative"
                >
                  <RenderClassIllustration classNum={getUserClassNumber()} />
                </motion.div>

                {/* Congratulations Header */}
                <div className="space-y-1.5 max-w-xs">
                  <h2 className="text-3xl font-black text-[#141779] leading-tight tracking-tight uppercase">{t('lesson_complete', 'Lesson Complete!')}</h2>
                  <p className="text-xs font-bold text-[#767683] px-2 leading-relaxed">
                    {t('lesson_complete_desc', "You've successfully completed the lesson. Excellent progress!")}
                  </p>
                </div>

                {/* Premium Custom Reward Dashboard Cards */}
                <div className="w-full max-w-sm grid grid-cols-3 gap-3.5 mt-2 px-1">
                  {/* XP Card */}
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center p-3 rounded-2xl bg-amber-50/70 border-2 border-amber-100/60 shadow-xs relative overflow-hidden"
                  >
                    <div className="text-2xl animate-pulse">⚡</div>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider mt-1.5">{t('xp', 'XP')}</span>
                    <span className="text-base font-black text-amber-900 mt-0.5">+{completionResult?.xpEarned ?? 0}</span>
                  </motion.div>

                  {/* Accuracy Card */}
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50/70 border-2 border-emerald-100/60 shadow-xs relative overflow-hidden"
                  >
                    <div className="text-2xl">🎯</div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mt-1.5">{t('accuracy', 'Accuracy')}</span>
                    <span className="text-base font-black text-emerald-900 mt-0.5">{completionResult?.accuracy ?? 100}%</span>
                  </motion.div>

                  {/* Coin Card */}
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center p-3 rounded-2xl bg-yellow-50/70 border-2 border-yellow-100/60 shadow-xs relative overflow-hidden"
                  >
                    <div className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🪙</div>
                    <span className="text-[10px] font-black text-yellow-700 uppercase tracking-wider mt-1.5">{t('coins', 'Coins')}</span>
                    <span className="text-base font-black text-yellow-900 mt-0.5">+{completionResult?.coinsEarned ?? 0}</span>
                  </motion.div>
                </div>

                {/* Dynamic progress bar to daily goal */}
                {(() => {
                  const todayLessons = completionResult?.todayLessonsCount || 1;
                  const xpGoalPct = Math.min(100, Math.max(34, Math.round(todayLessons * 34)));
                  return (
                    <div className="w-full max-w-xs flex flex-col gap-2 mt-3">
                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-gray-300">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${xpGoalPct}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-amber-600 uppercase tracking-wider px-1">
                        <span>{t('daily_xp_goal', 'Daily XP Goal')}</span>
                        <span>{xpGoalPct >= 100 ? t('goal_mastered', '100% Goal Mastered! 🎉') : t('percent_reached', { percent: xpGoalPct, defaultValue: `${xpGoalPct}% Reached` })}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Continue button - Primary color & Streak first-lesson filter */}
              <button
                onClick={() => {
                  const todayKey = `streak_shown_${new Date().toISOString().slice(0, 10)}`;
                  const alreadyShownToday = localStorage.getItem(todayKey) === "true";
                  
                  if (completionResult?.shouldAnimateStreak && !alreadyShownToday) {
                    localStorage.setItem(todayKey, "true");
                    setSummaryStep("STREAK");
                  } else {
                    setSummaryStep("REPORT");
                  }
                }}
                className="w-full py-4 rounded-2xl bg-[#141779] hover:bg-[#101362] text-white font-black text-base shadow-lg shadow-indigo-900/20 uppercase tracking-wider active:scale-95 transition-all mt-auto"
              >
                {t('continue_btn', 'Continue')}
              </button>
            </main>
          )}

          {summaryStep === "STREAK" && (
            <main className="fixed inset-0 z-50 bg-[#f7f9fb] flex flex-col items-center justify-between p-6 max-w-md mx-auto w-full text-center pb-8 animate-in fade-in duration-300">
              <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
                {/* Large Duolingo Fire Flame */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Floating Streak Extended animation */}
                  {completionResult?.shouldAnimateStreak && animateStreakNumber && (
                    <motion.div
                      initial={{ y: 20, opacity: 0, scale: 0.5 }}
                      animate={{ y: -65, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1] }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      className="absolute -top-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none z-20 whitespace-nowrap border border-orange-300 uppercase tracking-wider"
                    >
                      STREAK EXTENDED! 🔥
                    </motion.div>
                  )}
                  
                  <motion.div
                    animate={animateStreakNumber ? {
                      scale: [1, 1.35, 1.1, 1.18, 1],
                      filter: ["brightness(1)", "brightness(1.25)", "brightness(1)"]
                    } : {}}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full text-[160px] flex items-center justify-center filter drop-shadow-[0_8px_25px_rgba(255,159,67,0.45)] select-none"
                  >
                    🔥
                  </motion.div>
                  {/* Streak Number Overlay */}
                  <motion.span
                    key={displayedStreak}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                    className="absolute text-5xl font-black text-white mt-12 select-none"
                  >
                    {displayedStreak}
                  </motion.span>
                </div>

                {/* Day of Week Row (Sun to Sat) */}
                <div className="flex justify-between w-full max-w-xs px-2 mt-4 gap-1.5">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                    const isToday = new Date().getDay() === idx;
                    
                    // If this is today, and we should animate, start with today as inactive (grey)
                    // and animate it active (colored) when animateStreakNumber is true.
                    const isActive = isToday 
                      ? (completionResult?.shouldAnimateStreak ? animateStreakNumber : streakDaysOfWeek[idx])
                      : streakDaysOfWeek[idx];
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 relative">
                        {/* Floating +1 Day badge above today's circle */}
                        {isToday && completionResult?.shouldAnimateStreak && animateStreakNumber && (
                          <motion.div
                            initial={{ y: 5, opacity: 0, scale: 0.5 }}
                            animate={{ y: -38, opacity: [0, 1, 1, 0], scale: [0.5, 1.25, 1] }}
                            transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
                            className="absolute -top-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-md pointer-events-none z-20 border border-amber-300 tracking-wider whitespace-nowrap"
                          >
                            +1 DAY!
                          </motion.div>
                        )}
                        
                        <motion.div
                          animate={isToday && animateStreakNumber ? {
                            scale: [1, 1.35, 1.05, 1.1, 1],
                            rotate: [0, 15, -15, 0]
                          } : {}}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-xs transition-all duration-500 border ${
                            isActive
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-inner scale-105"
                              : "bg-gray-100 border-gray-200 text-gray-400"
                          }`}
                        >
                          {day}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 max-w-xs mt-2">
                  <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tight uppercase">
                    {displayedStreak === 0
                      ? t('start_streak_title', 'Start Your Streak Today! 🚀')
                      : t('day_streak', { streak: displayedStreak, days: displayedStreak, defaultValue: `${displayedStreak} Day Streak!` })}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    {displayedStreak === 0
                      ? t('zero_streak_quote', '“Every expert was once a beginner! Complete 1 lesson today to ignite your flame!” 🔥')
                      : displayedStreak === 1
                      ? t('one_day_streak_sub', 'Awesome start! Complete a lesson tomorrow to build your streak momentum! 💪')
                      : t('complete_lesson_daily', 'Complete a lesson every day to build your streak!')}
                  </p>
                </div>
              </div>

              {/* Continue to stats button - Primary color */}
              <button
                onClick={() => setSummaryStep("REPORT")}
                className="w-full py-4 rounded-2xl bg-[#141779] hover:bg-[#101362] text-white font-black text-base shadow-lg shadow-indigo-900/20 uppercase tracking-wider active:scale-95 transition-all mt-auto"
              >
                {t('continue_btn', 'Continue')}
              </button>
            </main>
          )}

          {summaryStep === "REPORT" && (
            <div className="fixed inset-0 z-50 bg-[#f7f9fb] flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden">
              <header className="sticky top-0 z-40 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs shrink-0 w-full relative">
                <button
                  onClick={handleBackToRoadmap}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer z-10"
                >
                  <ArrowLeft size={18} className="text-[#141779]" />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-800 font-bold text-xs shrink-0 whitespace-nowrap">
                    <Zap size={12} className="text-amber-500 fill-amber-400" />
                    <span>{xpEarned} XP</span>
                  </div>
                  <div className="flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 text-teal-800 font-bold text-xs shrink-0 whitespace-nowrap">
                    <Award size={12} className="text-teal-600 fill-teal-500" />
                    <span>{coinsEarned} Coins</span>
                  </div>
                </div>

                <div className="w-9 h-9 shrink-0 pointer-events-none" />
              </header>

              <main className="px-6 pt-4 pb-28 flex-1 flex flex-col items-center w-full text-center overflow-y-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 rounded-3xl bg-[#141779] flex items-center justify-center text-4xl shadow-xl mb-4 border-4 border-amber-300 text-white shrink-0"
                >
                  {missionIcon}
                </motion.div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-300 mb-2">
                  {t('mission_accomplished', { seq: missionSeq, defaultValue: `Mission ${missionSeq} Accomplished!` })}
                </span>

                <h2 className="text-2xl font-black text-[#141779] mb-1">
                  {t('victory_title', { title: t(String(missionTitle || "").toLowerCase().replace(/ /g, '_'), { defaultValue: missionTitle }), defaultValue: `${missionTitle} Victory!` })}
                </h2>
                <p className="text-xs text-[#464652] font-semibold mb-4">{t('progression_report', 'Chapter Progression & Performance Report')}</p>

                <div className="flex flex-col items-center gap-1.5 mb-5">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={28}
                        className={
                          s <= (completionResult?.runStars ?? (completionResult?.stars ?? 0))
                            ? "text-amber-500 fill-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  {completionResult?.runStars !== undefined && completionResult?.bestStars !== undefined && completionResult.runStars < completionResult.bestStars && (
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 mt-1 shadow-xs">
                      🏆 {t('best_record_retained', { best: completionResult.bestStars, run: completionResult.runStars, defaultValue: `Best record of ${completionResult.bestStars} ⭐ preserved! (This run: ${completionResult.runStars} ⭐)` })}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-4">
                  <div className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col items-center shadow-xs">
                    <span className="text-[10px] font-black text-[#767683] uppercase tracking-wider">{t('accuracy', 'Accuracy')}</span>
                    <span className="text-3xl font-black text-emerald-600 mt-1">
                      {completionResult?.accuracy ?? Math.round((quizCorrectCount / Math.max(1, quizQuestions.length)) * 100)}%
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      {completionResult?.targetStatus 
                        ? t(String(completionResult.targetStatus || "").toLowerCase().replace(/ /g, '_'), { defaultValue: completionResult.targetStatus })
                        : ((completionResult?.accuracy ?? 100) >= 85 ? t('target_exceeded', 'Target Exceeded') : t('target_met', 'Target Met'))}
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col items-center shadow-xs">
                    <span className="text-[10px] font-black text-[#767683] uppercase tracking-wider">{t('confidence', 'Confidence')}</span>
                    <span className="text-xl font-black text-[#141779] mt-2">
                      {completionResult?.confidenceLabel ? t(String(completionResult.confidenceLabel || "").toLowerCase().replace(/ /g, '_'), { defaultValue: completionResult.confidenceLabel }) : t('high_mastery', 'High Mastery 🚀')}
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
                  {completionResult?.threeDayAvailable !== false ? (
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1">
                            <span>📈 {t('three_day_avg', '3-Day Performance Average')}</span>
                          </h4>
                          <span className="text-[11px] text-gray-500 font-semibold">{t('short_term_retention', 'Short-term retention trend')}</span>
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
                            <span className="text-[10px] font-bold text-gray-500">{t(String(d?.day || "").toLowerCase().replace(/ /g, '_'), { defaultValue: d?.day })}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-2xs">
                        <Clock size={20} className="animate-pulse" />
                      </div>
                      <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <span>📈 {t('three_day_avg', '3-Day Performance Average')}</span>
                      </h4>
                      <p className="text-xs text-gray-500 font-bold max-w-[280px] leading-relaxed">
                        {t('data_not_available_days', "Required data not available. You'll see in next few learning Days.")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full mb-6 text-left shadow-xs">
                  {completionResult?.sevenDayAvailable !== false ? (
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1">
                            <span>📊 {t('seven_day_trend', '7-Day Performance Trend')}</span>
                          </h4>
                          <span className="text-[11px] text-gray-500 font-semibold">{t('weekly_consistency', 'Weekly consistency overview')}</span>
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
                            <span className="text-[9px] font-extrabold text-gray-600">{t(String(d?.day || "").toLowerCase(), { defaultValue: d?.day })}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-2xs">
                        <Clock size={20} className="animate-pulse" />
                      </div>
                      <h4 className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <span>📊 {t('seven_day_trend', '7-Day Performance Trend')}</span>
                      </h4>
                      <p className="text-xs text-gray-500 font-bold max-w-[280px] leading-relaxed">
                        {t('data_not_available_days', "Required data not available. You'll see in next few learning Days.")}
                      </p>
                    </div>
                  )}
                </div>
              </main>

              {/* NON-SCROLLABLE FIXED BOTTOM ACTION BAR (EQUAL 50-50 BUTTON SIZES) */}
              {(() => {
                const finalAcc = completionResult?.accuracy ?? Math.round((quizCorrectCount / Math.max(1, quizQuestions.length)) * 100);
                const hasPassedMission = finalAcc >= 65;

                return (
                  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
                    <div className="max-w-md mx-auto w-full">
                      {hasPassedMission ? (
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <button
                            onClick={handleBackToRoadmap}
                            className="w-full h-12 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-2xs whitespace-nowrap uppercase tracking-wider box-border"
                          >
                            <span>🚪 {t('roadmap', 'Roadmap')}</span>
                          </button>
                          <button
                            onClick={handleNextMission}
                            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] border-2 border-transparent text-white font-black text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider box-border"
                          >
                            <span>{t('next_mission_btn', 'Next Mission 🚀')}</span>
                            <Play size={14} className="fill-white shrink-0" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 w-full">
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded-xl text-[10px] font-bold text-center leading-tight">
                            ⚠️ {t('pass_accuracy_warning', '65% accuracy required for Next Mission. Replay to master!')}
                          </div>
                          <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                              onClick={handleBackToRoadmap}
                              className="w-full h-12 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-2xs whitespace-nowrap uppercase tracking-wider box-border"
                            >
                              <span>🚪 {t('roadmap', 'Roadmap')}</span>
                            </button>
                            <button
                              onClick={handleReplayMission}
                              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] border-2 border-transparent text-white font-black text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider box-border"
                            >
                              <span>{t('replay_mission_btn', 'Replay Mission 🔄')}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}

      {showReviveModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-[#141779]/20 rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(20,23,121,0.15)] flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center animate-pulse">
              <Swords className="text-[#006a62] w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#141779] uppercase tracking-widest">Final Chance!</h2>
              <p className="text-xs font-semibold text-[#464652] mt-2 leading-relaxed">
                You ran out of hearts! Revive using the Revival Wheel to keep your current progress and fight on!
              </p>
            </div>

            <div className="w-full bg-[#f8fafc] rounded-2xl p-4 border border-gray-200 flex justify-between items-center text-center shadow-xs">
              <div className="flex-1">
                <span className="text-[10px] text-[#767683] uppercase font-black tracking-widest block mb-1">Revival Spins</span>
                <span className="text-2xl font-black text-teal-700">{revivalSpins}</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex-1">
                <span className="text-[10px] text-[#767683] uppercase font-black tracking-widest block mb-1">Your Coins</span>
                <span className="text-2xl font-black text-amber-600">🪙 {Math.max(0, userCoins)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {revivalSpins > 0 ? (
                <button
                  onClick={() => navigate(`/daily-rewards?type=boss_revival&chapter_id=${chapterId}`)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <span>🔥 Spin to Revive</span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (userCoins < 100) {
                      showToast("Not enough coins! You need 100 coins.");
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
                        showToast("Purchased 1 Revival Spin! 🎉");
                      } else {
                        showToast(json.message || "Purchase failed.");
                      }
                    } catch (e) {
                      showToast("Purchase failed.");
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md border border-indigo-300/40"
                >
                  <span>🛒 Buy Revival Spin (100 🪙)</span>
                </button>
              )}

              <button
                onClick={handleGiveUp}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl active:scale-95 transition-all text-xs border border-gray-200"
              >
                Retreat & Lose XP
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Defeat/Retreat Overlay Animation */}
      {lossOverlay.show && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white border-2 border-rose-200 rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex flex-col items-center gap-6"
          >
            {/* Spotlight Icon */}
            <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-xs relative">
              <ShieldAlert className="text-rose-600 w-10 h-10 animate-pulse" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#141779] uppercase tracking-wider">
                Fall Back!
              </h2>
              <p className="text-xs text-[#464652] leading-relaxed font-bold">
                You retreated from the mission. Rest up and try again!
              </p>
            </div>

            {/* Penalty Box */}
            <div className="w-full bg-rose-50/70 rounded-2xl p-4 border border-rose-200 relative overflow-hidden">
              <span className="text-[10px] text-rose-700 uppercase font-black tracking-widest block mb-1">
                XP Penalty
              </span>
              <span className="text-2xl font-black text-rose-600">
                {lossOverlay.xpLoss} XP
              </span>
            </div>
          </motion.div>
        </div>
      )}
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white px-4.5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(20,23,121,0.4)] border border-[#57fae9]/40 font-bold text-xs flex items-center justify-center gap-2.5 text-center max-w-[90vw] w-auto animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <span className="text-sm shrink-0">✨</span>
          <span className="truncate max-w-[280px] sm:max-w-[340px] line-clamp-1">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
