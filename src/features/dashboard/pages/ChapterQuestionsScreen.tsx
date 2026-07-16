import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, X as XIcon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import DragonCharacter from "../../../components/DragonCharacter";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function ChapterQuestionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chapterId = searchParams.get("chapterId");
  const level = searchParams.get("level") || "easy";

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [basketCount, setBasketCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [answeredThisSession, setAnsweredThisSession] = useState(0);
  const [particlesInit, setParticlesInit] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine); }).then(() => setParticlesInit(true));
  }, []);

  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            setChildName(u.childName || u.name || "Kid");
            setChildPhoto(u.childPhoto || u.photo || "");
          } catch(e) {}
        }
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          setChildName(meJson.data.user.childName || meJson.data.user.name || "Kid");
          setChildPhoto(meJson.data.user.childPhoto || meJson.data.user.photo || "");
        }
      } catch (e) {}

      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
      if (!chapterId) {
        setLoading(false);
        return;
      }
      try {
        const [qRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/questions/${chapterId}`),
          apiFetch(`/api/practice/chapter-progress/${chapterId}`)
        ]);
        const qJson = await qRes.json();
        const pJson = await pRes.json();
        
        let filtered: any[] = [];
        if (qJson.success && qJson.data) {
          // Take first 15 questions for the linear flow
          filtered = qJson.data.slice(0, 15);
          setQuestionsData(filtered);
        }
        if (pJson.success && pJson.data) {
          if (!pJson.data.questionsCompleted) {
            const savedQ = pJson.data.currentQ || 0;
            if (filtered.length > 0 && savedQ >= filtered.length) {
              // User finished questions but didn't beat boss, take them straight to boss
              const finalReturnUrl = encodeURIComponent(`/practice/chapters`);
              
              sessionStorage.setItem("lastSessionAnswers", JSON.stringify(pJson.data.answers || []));
              
              navigate(`/boss-battle?worldId=w1&chapterId=${chapterId}&difficulty=easy&returnTo=${finalReturnUrl}`, {
                state: { userAnswers: pJson.data.answers || [] },
                replace: true
              });
              return;
            } else {
              setCurrentQ(savedQ);
              setScore(pJson.data.score || 0);
              setUserAnswers(pJson.data.answers || []);
            }
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [chapterId]);

  const total = questionsData.length > 0 ? questionsData.length : 1;
  const q = questionsData.length > 0 ? questionsData[currentQ] : null;
  const tip = "You can do it!";
  const progress = total > 0 ? (currentQ / total) * 100 : 0;

  useEffect(() => {
    if (q?.interaction?.type === "drag_objects") {
      setBasketCount(q.interaction.details.initialCount || 0);
    }
    setQuestionStartTime(Date.now());
  }, [currentQ, q]);

  const questionText = q?.interaction?.details?.question || q?.question || q?.text || "Loading...";
  const interactionType = q?.interaction?.type || "mcq";

  // MCQ
  const optionsList = q?.interaction?.details?.options || q?.options || [];
  const correctAnswer = q?.interaction?.details?.answer || q?.answer || q?.correctAnswer || "";
  const correctIndex = optionsList?.findIndex((opt: string) => opt === correctAnswer) ?? 0;
  
  // Drag
  const dragDetails = q?.interaction?.details || {};
  const targetCount = dragDetails.targetCount || 0;
  const totalDraggables = dragDetails.draggablesCount || 6;
  const objectEmoji = dragDetails.objectEmoji || "🍎";

  const isTextInput = interactionType === "mcq" && optionsList.length === 0;

  let isCorrect = false;
  if (interactionType === "drag_objects") {
    isCorrect = basketCount === targetCount;
  } else if (isTextInput) {
    isCorrect = textAnswer.trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
  } else {
    isCorrect = selected === correctIndex;
  }

  const submitActivityLog = async (answersToSubmit: any[]) => {
    // Only log if new questions were actually answered in this session
    if (answeredThisSession === 0) return;
    try {
      const tQ = questionsData.length;
      // Only count answers from this session (the last answeredThisSession entries)
      const sessionAnswers = answersToSubmit.filter(a => a != null).slice(-answeredThisSession);
      const cQ = sessionAnswers.filter(a => a?.isCorrect).length;
      const timeTaken = sessionAnswers.reduce((acc, a) => acc + (a?.timeSpent || 0), 0);
      const details = sessionAnswers.map(a => ({
         questionText: a.questionText || "Question",
         isCorrect: !!a.isCorrect,
         timeSpent: a.timeSpent || 0
      }));

      await apiFetch("/api/parent/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              title: searchParams.get("chapterName") || "Chapter Challenge",
              type: "quiz",
              timeTaken,
              correctQuestions: cQ,
              totalQuestions: tQ,
              details
          })
      });
    } catch (e) {
      console.error("Failed to submit activity log", e);
    }
  };

  const handleConfirm = async () => {
    if (interactionType === "mcq" && !isTextInput && selected === null) return;
    if (isTextInput && textAnswer.trim() === "" && !confirmed) return;
    if (!confirmed) {
      setConfirmed(true);
      setAnsweredThisSession(prev => prev + 1);
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      if (isCorrect) {
        setScore((s) => s + 1);
        setSessionCorrect((s) => s + 1);
        // ✨ Trigger sparkle burst!
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1500);
      }
      
      setUserAnswers(prev => {
        const next = [...prev];
        next[currentQ] = {
          isCorrect,
          selected: interactionType === "drag_objects" ? basketCount : isTextInput ? textAnswer.trim() : selected,
          interactionType,
          questionText,
          optionsList,
          correctAnswer,
          correctIndex,
          targetCount,
          objectEmoji,
          timeSpent
        };
        return next;
      });

      // Submit to world API for dynamic rewards
      apiFetch("/api/world/questions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q?._id || `q_${currentQ}`, isCorrect })
      }).catch(e => console.error("Failed to submit for rewards", e));

    } else {
      
        if (currentQ < total - 1) {
        const nextQ = currentQ + 1;
        
        // Save progress asynchronously
        apiFetch("/api/practice/chapter-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterId: chapterId,
            currentQ: nextQ,
            score: score,
            answers: userAnswers,
            completed: false,
            readingCompleted: true,
            questionsCompleted: false
          })
        }).catch(() => {});

        // Store nextQ state first
        setCurrentQ(nextQ);
        setSelected(null);
        setTextAnswer("");
        setConfirmed(false);

      } else {
        // Save final completion for this tier
        try {
          await apiFetch("/api/practice/chapter-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterId: chapterId,
              currentQ: total,
              score: score,
              answers: userAnswers,
              completed: false,
              readingCompleted: true,
              questionsCompleted: true
            })
          });
        } catch (e) {
          console.error("Failed to save progress", e);
        }
        
        const finalReturnUrl = encodeURIComponent(`/practice/chapters`);
        
        sessionStorage.setItem("lastSessionAnswers", JSON.stringify(userAnswers));
        
        navigate(`/boss-battle?worldId=w1&chapterId=${chapterId}&difficulty=easy&returnTo=${finalReturnUrl}`, {
          state: { userAnswers },
          replace: true
        });
      }
    }
  };

  const [showQuitModal, setShowQuitModal] = useState(false);

  const handleQuit = async () => {
    // Save progress asynchronously before leaving
    apiFetch("/api/practice/chapter-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: chapterId,
        currentQ,
        score: score,
        answers: userAnswers,
        completed: false,
        readingCompleted: true,
        questionsCompleted: false
      })
    }).catch(() => {});
    
    await submitActivityLog(userAnswers);
    navigate("/practice/chapters", { replace: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4efff]">
      <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (questionsData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efff] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#141779] mb-4">There is no challenge available for now.</h2>
        <button onClick={() => navigate("/home")} className="bg-[#141779] text-white px-6 py-3 rounded-full font-bold">
          Return to Home Screen
        </button>
      </div>
    );
  }

  const bgClass = "bg-[#006a62]"; // Default chapter color

  const btnLabel = !confirmed
    ? "CONFIRM ANSWER"
    : currentQ < total - 1
    ? "NEXT QUESTION →"
    : "SEE RESULTS 🏆";

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24 relative overflow-hidden">
      
      {/* ✨ Magic Sparkle Burst on Correct Answer */}
      {showSparkle && particlesInit && (
        <Particles
          id="quiz-sparkle"
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            emitters: { position: { x: 20, y: 80 }, rate: { quantity: 15, delay: 0 }, life: { count: 1 } },
            particles: {
              color: { value: ["#ffcc00", "#ff69b4", "#58cc02", "#00e5ff", "#e040fb"] },
              move: { enable: true, speed: { min: 3, max: 8 }, direction: "top-right" as const, outModes: { default: "out" as const } },
              number: { value: 0 },
              opacity: { value: { min: 0.5, max: 1 }, animation: { enable: true, speed: 3, startValue: "max" as const, destroy: "min" as const } },
              shape: { type: ["star", "circle"] },
              size: { value: { min: 3, max: 8 } },
              life: { duration: { value: 1.5 }, count: 1 },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-[30] pointer-events-none"
        />
      )}

      {/* Quit Modal Overlay */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center px-6 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mb-4">
              <XIcon size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-[#141779] mb-2 tracking-tight">Quit Quiz?</h3>
            <p className="text-[#464652] font-medium mb-8">
              Are you sure you want to quit the quiz? Your progress will be saved.
            </p>
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-4 bg-[#f4efff] text-[#141779] font-bold rounded-xl hover:bg-[#e8ddff] transition-colors"
              >
                No, Stay
              </button>
              <button 
                onClick={handleQuit}
                className="flex-1 py-4 bg-[#ba1a1a] text-white font-bold rounded-xl shadow-md hover:bg-[#93000a] transition-colors"
              >
                Yes, Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setShowQuitModal(true)} className="p-1 hover:opacity-80 transition-opacity shrink-0">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <button 
            onClick={() => navigate("/profile")} 
            className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden bg-[#e0e0ff] hover:opacity-80 transition-opacity shrink-0"
          >
            {childPhoto ? (
              <img 
                src={childPhoto} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(childName || "Kid")}&background=random`} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </button>
          <h1 className="text-[22px] font-extrabold text-[#141779] truncate">{searchParams.get("chapterName") || "Chapter Challenge"}</h1>
        </div>

        {/* Right Side: Bell Icon */}
        <button 
          onClick={() => navigate("/notifications")}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative shrink-0"
        >
          <Bell size={18} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-6 pt-2 flex-1 flex flex-col">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-0.5">
            <span className="text-xl font-bold text-[#141779]">
              Question {currentQ + 1} <span className="text-[17px] font-medium text-[#827656]">/ {total}</span>
            </span>
            <div className="bg-[#e8ddff] px-3.5 py-1.5 rounded-full">
              <span className="text-xs font-bold text-[#1d0052] tracking-[0.5px]">KEEP GOING!</span>
            </div>
          </div>
          <div className="h-6 bg-[#e6e6e6] rounded-full overflow-hidden p-[5px]">
            <div 
              className="h-full bg-[#30007f] rounded-lg transition-all duration-300"
              style={{ width: `${progress + 10}%` }}
            />
          </div>
        </div>

        {/* Mascot Question Area (Duolingo Style) */}
        <div className="flex items-end gap-4 mb-8 mt-4 px-2 relative z-10">
           <div className="relative">
             <DragonCharacter
                state={confirmed ? (isCorrect ? 'attack' : 'hurt') : 'idle'}
                className="w-[70px] h-[70px]"
              />

             {/* Floating XP Animation */}
             <AnimatePresence>
               {confirmed && (
                 <motion.div
                   key={isCorrect ? "correct-xp" : "wrong-xp"}
                   initial={{ opacity: 0, y: 20, scale: 0.5 }}
                   animate={{ opacity: [0, 1, 1, 0], y: -60, scale: 1.2 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[26px] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-50 pointer-events-none whitespace-nowrap ${
                     isCorrect ? 'text-[#58cc02]' : 'text-[#ba1a1a]'
                   }`}
                   style={{ WebkitTextStroke: '1px white' }}
                 >
                   {isCorrect ? '+10 XP' : '-5 XP'}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           <div className="flex-1 bg-white p-5 rounded-[24px] rounded-bl-none border-2 border-gray-200 relative shadow-[0_4px_0_rgba(0,0,0,0.05)]">
             {/* Speech Bubble Arrow */}
             <div className="absolute -left-3 bottom-6 w-5 h-5 bg-white border-b-2 border-l-2 border-gray-200 transform rotate-45" />
             <h2 className="text-[19px] font-bold text-[#4b4b4b] leading-tight">
               {questionText}
             </h2>
           </div>
        </div>

        {/* Interactive Area */}
        <div className="mb-7">
          {interactionType === "mcq" && !isTextInput && (
            <div className="grid grid-cols-2 gap-3.5">
              {optionsList && optionsList.map((opt: string, idx: number) => {
                let btnClass = "bg-white border-2 border-gray-200 border-b-[4px] active:border-b-2 active:translate-y-[2px] active:mt-[2px] active:mb-[-2px]";
                let textClass = "text-[#4b4b4b]";

                if (confirmed) {
                  if (idx === correctIndex) {
                    btnClass = "bg-[#e8ddff] border-2 border-[#30007f] border-b-[4px]";
                    textClass = "text-[#1d0052]";
                  } else if (idx === selected) {
                    btnClass = "bg-[#ffdad6] border-2 border-[#ba1a1a] border-b-[4px]";
                    textClass = "text-[#ba1a1a]";
                  } else {
                    btnClass = "bg-white border-2 border-gray-200 border-b-[4px] opacity-45";
                  }
                } else if (selected === idx) {
                  btnClass = "bg-[rgba(224,224,255,0.4)] border-2 border-[#141779] border-b-[4px] active:border-b-2 active:translate-y-[2px] active:mt-[2px] active:mb-[-2px]";
                  textClass = "text-[#141779]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !confirmed && setSelected(idx)}
                    className={`rounded-[16px] py-[18px] px-3 flex flex-col items-center justify-center relative transition-all ${btnClass}`}
                  >
                    <span className={`text-[19px] font-bold ${textClass}`}>{opt}</span>
                    
                    {confirmed && idx === correctIndex && (
                      <Check className="absolute top-2 right-2 text-[#30007f]" size={20} strokeWidth={4} />
                    )}
                    {confirmed && idx === selected && idx !== correctIndex && (
                      <XIcon className="absolute top-2 right-2 text-[#ba1a1a]" size={20} strokeWidth={4} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isTextInput && (
            <div className="w-full flex flex-col justify-center mt-4 mb-4 gap-3">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => {
                  if (!confirmed) setTextAnswer(e.target.value);
                }}
                disabled={confirmed}
                placeholder="Type your answer here..."
                className={`w-full p-4 rounded-2xl border-2 font-bold text-lg outline-none transition-all ${
                  confirmed ? (isCorrect ? 'bg-[#e8ddff] border-[#30007f] text-[#1d0052]' : 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]')
                  : 'bg-white border-gray-200 text-[#4b4b4b] focus:border-[#141779] shadow-sm'
                }`}
              />
              {confirmed && !isCorrect && (
                <div className="w-full p-4 rounded-xl bg-white border-2 border-[#ba1a1a] text-[#ba1a1a] font-bold text-center flex items-center justify-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <span className="text-[#58cc02]">✓</span>
                  <span>Correct Answer: {correctAnswer}</span>
                </div>
              )}
            </div>
          )}

          {interactionType === "drag_objects" && (
            <div className="flex flex-col gap-4">
              {/* Basket Area */}
              <div 
                className={`w-full min-h-[140px] rounded-2xl border-4 border-dashed p-4 flex flex-wrap gap-2 items-center justify-center transition-colors ${confirmed ? (isCorrect ? 'border-[#30007f] bg-[#e8ddff]' : 'border-[#ba1a1a] bg-[#ffdad6]') : 'border-[#afafaf] bg-transparent cursor-pointer hover:bg-gray-50'}`}
                onClick={() => {
                  if (!confirmed && basketCount > 0) {
                    setBasketCount(prev => prev - 1);
                  }
                }}
              >
                {basketCount === 0 && <span className="text-[#afafaf] font-bold select-none text-center text-xl tracking-wide uppercase">BASKET</span>}
                {Array.from({ length: basketCount }).map((_, i) => (
                  <span key={i} className="text-5xl animate-bounce drop-shadow-sm select-none">{objectEmoji}</span>
                ))}
              </div>

              {/* Source Items Area */}
              <div className="flex flex-wrap justify-center gap-4 p-5 bg-white rounded-[20px] shadow-sm border-2 border-gray-200 border-b-[4px]">
                {Array.from({ length: totalDraggables - basketCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!confirmed && basketCount < totalDraggables) {
                        setBasketCount(prev => prev + 1);
                      }
                    }}
                    className="text-5xl hover:scale-110 active:scale-95 transition-transform p-2 drop-shadow-sm"
                  >
                    {objectEmoji}
                  </button>
                ))}
                {totalDraggables - basketCount === 0 && (
                   <span className="text-gray-400 font-bold py-2">Empty!</span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DUOLINGO STYLE FEEDBACK FOOTER (With NR Scholar Colors) */}
      <div className={`fixed bottom-0 left-0 right-0 transition-colors duration-300 z-50 ${
        !confirmed ? 'bg-white border-t-2 border-gray-200' :
        isCorrect ? 'bg-[#e8ddff] border-t-2 border-[#d0bbf2]' :
        'bg-[#ffdad6] border-t-2 border-[#ffb4ab]'
      }`}>
        <div className="max-w-md mx-auto flex flex-col gap-4 p-5">
          
          <AnimatePresence>
            {confirmed && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm ${
                  isCorrect ? 'text-[#30007f]' : 'text-[#ba1a1a]'
                }`}>
                   {isCorrect ? <Check size={36} strokeWidth={4} /> : <XIcon size={36} strokeWidth={4} />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[22px] font-black tracking-wide ${isCorrect ? 'text-[#30007f]' : 'text-[#ba1a1a]'}`}>
                    {isCorrect ? 'Excellent!' : 'Incorrect'}
                  </span>
                  {!isCorrect && (
                    <span className="text-sm font-bold text-[#ba1a1a] opacity-90">
                      Correct answer: {correctAnswer}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={(interactionType === "mcq" && !isTextInput && selected === null && !confirmed) || (isTextInput && textAnswer.trim() === "" && !confirmed)}
            onClick={handleConfirm}
            className={`w-full py-[16px] rounded-2xl flex items-center justify-center transition-all ${
              (!confirmed && interactionType === "mcq" && !isTextInput && selected === null) || (!confirmed && isTextInput && textAnswer.trim() === "") ? 'bg-[#e5e5e5] text-[#afafaf]' :
              !confirmed ? 'bg-[#141779] text-white shadow-[0_4px_0_#0b0d4d] hover:bg-[#1a1e9e] active:translate-y-[4px] active:shadow-none active:mt-1' :
              isCorrect ? 'bg-[#30007f] text-white shadow-[0_4px_0_#1d0052] hover:bg-[#3f00a8] active:translate-y-[4px] active:shadow-none active:mt-1' :
              'bg-[#ba1a1a] text-white shadow-[0_4px_0_#93000a] hover:bg-[#d92222] active:translate-y-[4px] active:shadow-none active:mt-1'
            }`}
          >
            <span className="text-[17px] font-extrabold tracking-[1px] uppercase">
              {confirmed ? 'CONTINUE' : 'CHECK'}
            </span>
          </button>
      </div>
        </div>
    </div>
  );
}
