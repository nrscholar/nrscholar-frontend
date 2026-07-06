import { AnimatePresence, motion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../api";

// Hardcoded rapid fire questions for MVP multiplayer
const BATTLE_QUESTIONS = [
  { q: "What is 12 + 15?", options: ["27", "25", "29", "30"], a: 0 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1 },
  { q: "What is 8 x 7?", options: ["54", "56", "62", "48"], a: 1 },
  { q: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], a: 1 },
  { q: "What is 45 ÷ 5?", options: ["8", "10", "9", "7"], a: 2 },
  { q: "Which animal is the king of the jungle?", options: ["Tiger", "Lion", "Elephant", "Bear"], a: 1 },
  { q: "What is 100 - 45?", options: ["55", "45", "65", "50"], a: 0 },
  { q: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], a: 2 },
  { q: "What is the opposite of 'Hot'?", options: ["Warm", "Cold", "Freezing", "Cool"], a: 1 },
  { q: "Which shape has 3 sides?", options: ["Square", "Circle", "Triangle", "Rectangle"], a: 2 }
];

export default function MultiplayerBattleScreen() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const [room, setRoom] = useState<any>(null);
  const [myId, setMyId] = useState<string>("");
  
  const [questions, setQuestions] = useState<any[]>(BATTLE_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  
  const [isFinished, setIsFinished] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [continuousWins, setContinuousWins] = useState(0);

  // Sync state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [waitTimer, setWaitTimer] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await apiFetch(`/api/multiplayer/room/${roomId}/questions`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
        }
      } catch (e) {
        console.error("Failed to load questions:", e);
      }
    };
    loadQuestions();
  }, [roomId]);

  useEffect(() => {
    // Get user id from token/profile
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setMyId(u._id || u.id); // depending on how _id is stored
      } catch(e) {}
    }
  }, []);

  const fetchRoomStatus = async () => {
    try {
      const res = await apiFetch(`/api/multiplayer/room/${roomId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setRoom(data.data);
        if (data.data.status === "finished") {
          setIsFinished(true);
          setWinnerId(data.data.winnerId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRoomStatus();
    const interval = setInterval(fetchRoomStatus, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  const updateBackendProgress = async (prog: number, sc: number, fin: boolean, timeTaken: number = 0, isCorrect: boolean = false) => {
    try {
      await apiFetch(`/api/multiplayer/room/${roomId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: prog, score: sc, isFinished: fin, timeTaken, isCorrect })
      });
      // Force an immediate fetch to sync state
      fetchRoomStatus();
    } catch (e) {}
  };

  const handleAnswer = (selectedIndex: number) => {
    if (isFinished || selectedOption !== null) return;
    
    setSelectedOption(selectedIndex);
    const timeTaken = 15 - timeLeft; // calculate time taken
    
    const isCorrect = selectedIndex !== -1 && selectedIndex === questions[currentQ].a;
    let newScore = myScore;
    if (isCorrect) {
      newScore += 10;
    }
    
    setMyScore(newScore);
    
    const isLast = currentQ === questions.length - 1;
    const newProgress = Math.round(((currentQ + 1) / questions.length) * 100);
    
    setMyProgress(newProgress);
    updateBackendProgress(newProgress, newScore, isLast, timeTaken, isCorrect);
  };

  // Timer logic
  useEffect(() => {
    if (isFinished) return;
    const t = setInterval(() => {
      if (selectedOption !== null && !isAdvancing) {
        setWaitTimer(prev => prev + 1);
        return;
      }
      setWaitTimer(0);
      
      setTimeLeft((prev) => {
        if (selectedOption !== null) return prev;
        if (prev <= 1) {
          clearInterval(t);
          handleAnswer(-1); // Auto-fail on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [currentQ, isFinished, selectedOption, isAdvancing]);

  // Synchronous Advancement logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Auto-advance if opponent disconnects/AFKs for >15 seconds
    if (waitTimer > 15 && selectedOption !== null && !isAdvancing) {
       setIsAdvancing(true);
       const isLast = currentQ === questions.length - 1;
       timeout = setTimeout(() => {
          if (isLast) {
            setIsFinished(true);
          } else {
            setCurrentQ(q => q + 1);
            setSelectedOption(null);
            setTimeLeft(15);
            setWaitTimer(0);
            setIsAdvancing(false);
          }
       }, 500);
       return () => clearTimeout(timeout);
    }
    
    if (room && selectedOption !== null && myProgress > 0 && !isAdvancing) {
      const isHost = room.hostId === myId;
      const oppProgress = isHost ? room.guestProgress : room.hostProgress;
      
      // If opponent has caught up to our progress
      if (oppProgress >= myProgress) {
        setIsAdvancing(true);
        const isLast = currentQ === questions.length - 1;
        
        timeout = setTimeout(() => {
          if (isLast) {
            setIsFinished(true);
          } else {
            setCurrentQ(q => q + 1);
            setSelectedOption(null);
            setTimeLeft(15);
            setWaitTimer(0);
            setIsAdvancing(false); // allow next question advancement
          }
        }, 1000); // 1-second delay so you can see your selected answer
      }
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    }
  }, [room, selectedOption, myProgress, isAdvancing, currentQ, questions.length, waitTimer]);

  
  useEffect(() => {
    let mounted = true;
    if (isFinished && winnerId === myId) {
      // Fetch profile to get updated streak
      apiFetch("/api/users/me").then(res => res.json()).then(data => {
        if (mounted && data.success && data.data && data.data.user) {
          const streak = data.data.user.multiplayerStreak || 0;
          setContinuousWins(streak);
          if (streak >= 25) {
            setShowRewardModal(true);
          }
        }
      });
    }
    return () => { mounted = false; };
  }, [isFinished, winnerId, myId]);

  if (!room) return <div className="min-h-screen bg-[#1d0052] flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"/></div>;

  const isHost = room.hostId === myId;
  const myAvatar = isHost ? room.hostAvatar : room.guestAvatar;
  const oppAvatar = isHost ? room.guestAvatar : room.hostAvatar;
  const myName = isHost ? room.hostName : room.guestName;
  const oppName = isHost ? room.guestName : room.hostName;
  
  const oppProgress = isHost ? room.guestProgress : room.hostProgress;
  const oppScore = isHost ? room.guestScore : room.hostScore;

  const amIWinning = myScore > oppScore;
  const isOppWinning = oppScore > myScore;

  return (
    <div className="min-h-screen bg-[#141779] font-sans flex flex-col relative overflow-hidden text-white">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 blur-[2px]"></div>

      {/* VS Header with Progress Bars */}
      <header className="px-4 py-4 relative z-10 bg-[#0b0d4d]/80 backdrop-blur-md shadow-lg border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate("/home")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
             <X size={20} color="white" />
          </button>
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Live Battle</span>
          <div className="w-9" />
        </div>
        <div className="flex items-center justify-between gap-4">
          
          {/* MY SIDE */}
          <div className="flex-1 flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#57fae9] overflow-hidden bg-white">
                <img src={myAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-[#57fae9] text-lg uppercase tracking-wide">{myName || "You"}</p>
                  {amIWinning && <Trophy size={16} color="#ffd700" className="animate-pulse" />}
                </div>
                <p className="text-sm font-bold text-white">{myScore} PTS</p>
              </div>
            </div>
            {/* Health/Progress Bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <div className="h-full bg-gradient-to-r from-[#57fae9] to-[#006a62] transition-all duration-300" style={{ width: `${myProgress}%` }} />
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-black italic text-[#ff9f43] drop-shadow-[0_0_10px_rgba(255,159,67,0.8)]">VS</span>
          </div>

          {/* OPPONENT SIDE */}
          <div className="flex-1 flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9f43] overflow-hidden bg-white">
                <img src={oppAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Opp"} className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {isOppWinning && <Trophy size={16} color="#ffd700" className="animate-pulse" />}
                  <p className="font-black text-[#ff9f43] text-lg uppercase tracking-wide">{oppName || "Opponent"}</p>
                </div>
                <p className="text-sm font-bold text-white">{oppScore} PTS</p>
              </div>
            </div>
            {/* Health/Progress Bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20 flex justify-end">
              <div className="h-full bg-gradient-to-l from-[#ff9f43] to-[#d17e30] transition-all duration-300" style={{ width: `${oppProgress}%` }} />
            </div>
          </div>

        </div>
      </header>

      {/* Main Battle Area */}
      <main className="flex-1 flex flex-col px-6 py-8 relative z-10">
        {!isFinished ? (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 relative">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[#57fae9] font-bold text-sm tracking-widest uppercase">Question {currentQ + 1}/{questions.length}</span>
                 <span className={`font-black text-xl px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
                   ⏳ {timeLeft}s
                 </span>
               </div>
               <h2 className="text-3xl font-black mt-2 leading-tight drop-shadow-md">
                 {questions[currentQ]?.q || ""}
               </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-auto relative">
              {questions[currentQ]?.options?.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === questions[currentQ].a;
                
                let btnStyle = "bg-white/10 hover:bg-white/20 border-white/20";
                if (selectedOption !== null) {
                   if (isSelected) {
                      btnStyle = isCorrect ? "bg-[#006a62] border-[#57fae9]" : "bg-[#ba1a1a] border-[#ffb4ab]";
                   } else if (isCorrect) {
                      btnStyle = "bg-[#006a62]/50 border-[#57fae9]/50"; 
                   } else {
                      btnStyle = "bg-white/5 border-white/10 opacity-50";
                   }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`backdrop-blur-md border text-white font-bold text-xl py-5 px-6 rounded-2xl text-left transition-all ${btnStyle} ${selectedOption === null ? 'active:scale-[0.98]' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
              
              {/* Unobtrusive "Waiting" text that doesn't block the screen */}
              {selectedOption !== null && (
                <div className="absolute -bottom-8 w-full text-center animate-pulse">
                  <span className="text-white/60 font-bold text-sm">Waiting for {oppName}...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 overflow-y-auto pt-10">
            {winnerId === myId ? (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 mb-4 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.6)]"
                >
                  <Trophy size={48} color="white" />
                </motion.div>
                <h2 className="text-4xl font-black text-white mb-1 drop-shadow-lg">VICTORY!</h2>
                <p className="text-lg text-[#57fae9] font-bold mb-4">You crushed your opponent.</p>
              </>
            ) : winnerId === null || winnerId === "tie" ? (
              <>
                {winnerId === null ? (
                  <>
                    <div className="w-16 h-16 mb-4 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 animate-pulse">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"/>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Calculating...</h2>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-white mb-2">IT'S A TIE!</h2>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="w-24 h-24 mb-4 bg-white/10 rounded-full flex items-center justify-center border-4 border-[#ba1a1a]">
                  <X size={48} color="#ba1a1a" />
                </div>
                <h2 className="text-4xl font-black text-white mb-1">DEFEAT</h2>
                <p className="text-[#ba1a1a] font-bold text-lg mb-4">Your opponent was faster!</p>
              </>
            )}

            {/* Detailed Post-Game Scoreboard */}
            {winnerId !== null && (
               <div className="w-full bg-white/10 rounded-2xl border border-white/20 p-5 mb-4 flex flex-col gap-3 shadow-xl text-left">
                 <h3 className="text-sm font-black text-[#ff9f43] tracking-widest uppercase text-center mb-1">Final Result</h3>
                 
                 <div className="flex justify-between font-bold text-xs uppercase text-white/50 border-b border-white/10 pb-2">
                    <span className="w-1/3 text-center">Q#</span>
                    <span className="w-1/3 text-center">{myName || "You"}</span>
                    <span className="w-1/3 text-center">{oppName || "Opp"}</span>
                 </div>
                 
                 {questions.map((_, i) => {
                    const myT = isHost ? (room.hostTimes?.[i] || 0) : (room.guestTimes?.[i] || 0);
                    const oppT = isHost ? (room.guestTimes?.[i] || 0) : (room.hostTimes?.[i] || 0);
                    
                    const myC = isHost ? (room.hostCorrects?.[i] || false) : (room.guestCorrects?.[i] || false);
                    const oppC = isHost ? (room.guestCorrects?.[i] || false) : (room.hostCorrects?.[i] || false);
                    
                    // Winner logic for UI highlight: Correct answer wins. If both correct, lower time wins.
                    let iWonT = false;
                    let oppWonT = false;
                    
                    if (myC && !oppC) iWonT = true;
                    else if (!myC && oppC) oppWonT = true;
                    else if (myC && oppC) {
                       if (myT < oppT) iWonT = true;
                       else if (oppT < myT) oppWonT = true;
                    }

                    return (
                      <div key={i} className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-1">
                        <span className="w-1/3 text-center text-white/70">Q{i + 1}</span>
                        <span className={`w-1/3 text-center ${iWonT ? 'text-[#57fae9]' : 'text-white'}`}>
                           {myC ? '✅' : '❌'} {myT}s
                        </span>
                        <span className={`w-1/3 text-center ${oppWonT ? 'text-[#ff9f43]' : 'text-white'}`}>
                           {oppC ? '✅' : '❌'} {oppT}s
                        </span>
                      </div>
                    )
                 })}
                 
                 <div className="flex justify-between font-black text-lg pt-2 mt-2 border-t border-white/30">
                    <span className="w-1/3 text-center text-white/70">Total</span>
                    <span className="w-1/3 text-center text-[#57fae9]">{myScore} pts</span>
                    <span className="w-1/3 text-center text-[#ff9f43]">{oppScore} pts</span>
                 </div>
               </div>
            )}
            
            {winnerId === myId && (
               <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 mb-6 w-full shadow-lg">
                  <p className="text-white/80 font-bold uppercase text-xs mb-1">Win Streak</p>
                  <p className="text-2xl font-black text-[#ff9f43]">{continuousWins} 🔥</p>
               </div>
            )}
            
            {winnerId !== null && !showRewardModal && (
              <button 
                onClick={() => navigate("/multiplayer-hub")}
                className="w-full max-w-[250px] bg-white text-[#141779] py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 shadow-[0_4px_15px_rgba(255,255,255,0.3)] mb-4"
              >
                Back to Arena
              </button>
            )}
          </div>
        )}
      </main>

      {/* PHYSICAL REWARD MODAL */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-b from-[#ffeed1] to-white rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-[0_0_60px_rgba(255,159,67,0.5)] border-4 border-[#ff9f43]"
            >
              <div className="text-[80px] mb-2">🎁</div>
              <h2 className="text-3xl font-black text-[#141779] mb-2 uppercase">Incredible!</h2>
              <div className="bg-[#141779] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-4">25 WINS IN A ROW</div>
              <p className="text-[#4b4b4b] font-bold mb-6">
                You have reached 25 continuous wins! A physical reward box is being prepared by our team and will be shipped to your registered address!
              </p>
              
              <button 
                onClick={() => {
                  setShowRewardModal(false);
                  navigate("/multiplayer-hub");
                }}
                className="w-full bg-[#ff9f43] text-white py-4 rounded-xl font-black uppercase text-lg shadow-[0_4px_0_#d17e30] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Claim My Prize!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
