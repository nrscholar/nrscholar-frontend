import { AnimatePresence, motion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  
  const [isFinished, setIsFinished] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [continuousWins, setContinuousWins] = useState(0);
  const [checkingReward, setCheckingReward] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [opponentQuit, setOpponentQuit] = useState(false);
  const [quitCount, setQuitCount] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  const gameStateRef = useRef({ isFinished, opponentQuit, roomId });
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    gameStateRef.current = { isFinished, opponentQuit, roomId };
  }, [isFinished, opponentQuit, roomId]);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const backendHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "127.0.0.1:5000"
      : window.location.host;
    const wsUrl = `${wsProtocol}//${backendHost}/api/multiplayer/room/${roomId}/ws`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected to Shadow Arena room:", roomId);
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      if (event.data.includes("opponent_quit")) {
        setOpponentQuit(true);
      } else if (event.data.includes("progress_updated") || event.data.includes("Update:")) {
        // Fetch the updated room status immediately to sync scores and progress
        fetchRoomStatus();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [roomId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { isFinished: finished, opponentQuit: oppQuit, roomId: rId } = gameStateRef.current;
      if (!finished && !oppQuit) {
        const token = localStorage.getItem("userToken");
        if (token) {
          fetch(`/api/multiplayer/room/${rId}/quit`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            keepalive: true
          });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      // Handle component unmount (React Router navigation / back button)
      const { isFinished: finished, opponentQuit: oppQuit, roomId: rId } = gameStateRef.current;
      const isStillOnBattlePage = window.location.pathname.includes(`/multiplayer-battle/${rId}`);
      if (!finished && !oppQuit && !isStillOnBattlePage) {
        const token = localStorage.getItem("userToken");
        if (token) {
          fetch(`/api/multiplayer/room/${rId}/quit`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            keepalive: true
          }).catch(console.error);
        }
      }
    };
  }, []);

  // Sync state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [waitTimer, setWaitTimer] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const isHost = room?.hostId === myId;
  const myAvatar = isHost ? room?.hostAvatar : room?.guestAvatar;
  const oppAvatar = isHost ? room?.guestAvatar : room?.hostAvatar;
  const myName = isHost ? room?.hostName : room?.guestName;
  const oppName = isHost ? room?.guestName : room?.hostName;
  
  const oppProgress = isHost ? room?.guestProgress : room?.hostProgress;
  const oppScore = isHost ? room?.guestScore : room?.hostScore;

  const amIWinning = myScore > oppScore;
  const isOppWinning = oppScore > myScore;

  useEffect(() => {
    let attempts = 0;
    const loadQuestions = async () => {
      try {
        const res = await apiFetch(`/api/multiplayer/room/${roomId}/questions`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
        } else if (attempts < 5) {
          attempts++;
          setTimeout(loadQuestions, 1000);
        }
      } catch (e) {
        console.error("Failed to load questions:", e);
        if (attempts < 5) {
          attempts++;
          setTimeout(loadQuestions, 1000);
        }
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
        apiFetch("/api/users/me").then(res => res.json()).then(data => {
            if (data.success && data.data && data.data.user) {
                setQuitCount(data.data.user.multiplayerQuitCount || 0);
                setMyStreak(data.data.user.multiplayerStreak || 0);
            }
        }).catch(console.error);
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
        } else if (data.data.status === "opponent_quit" && myId && data.data.winnerId === myId) {
          setOpponentQuit(true);
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

      // Notify opponent via WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send("progress_updated");
      }
    } catch (e) {}
  };

  const handleAnswer = (selectedIndex: number) => {
    if (isFinished || opponentQuit || selectedOption !== null) return;
    
    setSelectedOption(selectedIndex);
    const timeTaken = 15 - timeLeft; // calculate time taken
    
    const isCorrect = selectedIndex !== -1 && selectedIndex === questions[currentQ]?.a;
    let newScore = myScore;
    if (isCorrect) {
      newScore += 10;
    }
    
    setMyScore(newScore);
    
    const newAnswer = {
        questionText: questions[currentQ]?.q || "Question",
        isCorrect,
        timeSpent: timeTaken
    };
    setUserAnswers(prev => [...prev, newAnswer]);
    
    const isLast = currentQ === questions.length - 1;
    const newProgress = Math.round(((currentQ + 1) / questions.length) * 100);
    
    setMyProgress(newProgress);
    updateBackendProgress(newProgress, newScore, isLast, timeTaken, isCorrect);
  };

  // Synchronized countdown logic
  useEffect(() => {
    if (!room || !room.startedAt || questions.length === 0) return;
    
    const startTime = new Date(room.startedAt).getTime() + 4000; // 4 seconds countdown
    
    const updateCountdown = () => {
      const diff = startTime - Date.now();
      if (diff > 0) {
        setCountdown(Math.ceil(diff / 1000));
      } else {
        setCountdown(null);
      }
    };
    
    updateCountdown();
    const t = setInterval(updateCountdown, 200);
    return () => clearInterval(t);
  }, [room?.startedAt, questions.length]);

  // Timer logic
  useEffect(() => {
    if (isFinished || opponentQuit || countdown !== null) return;
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
  }, [currentQ, isFinished, opponentQuit, selectedOption, isAdvancing, countdown]);

  // Synchronous Advancement logic
  useEffect(() => {
    // Auto-advance if opponent disconnects/AFKs for >15 seconds
    if (waitTimer > 15 && selectedOption !== null && !isAdvancing) {
       setIsAdvancing(true);
       const isLast = currentQ === questions.length - 1;
       setTimeout(() => {
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
       return;
    }
    
    if (room && selectedOption !== null && myProgress > 0 && !isAdvancing) {
      const isHost = room.hostId === myId;
      const oppProgress = isHost ? room.guestProgress : room.hostProgress;
      
      // If opponent has caught up to our progress
      if (oppProgress >= myProgress) {
        setIsAdvancing(true);
        const isLast = currentQ === questions.length - 1;
        
        setTimeout(() => {
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
  }, [room, selectedOption, myProgress, isAdvancing, currentQ, questions.length, waitTimer]);

  
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
                  title: `1v1 Live Battle vs ${oppName || 'Opponent'}`,
                  type: "multiplayer",
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

  useEffect(() => {
    let mounted = true;
    if (isFinished) {
      submitActivityLog(userAnswers).catch(() => {});
    }
    if (isFinished && winnerId === myId) {
      setCheckingReward(true);
      // Fetch profile to get updated streak
      apiFetch("/api/users/me").then(res => res.json()).then(data => {
        if (mounted) {
          setCheckingReward(false);
          if (data.success && data.data && data.data.user) {
            const streak = data.data.user.multiplayerStreak || 0;
            setContinuousWins(streak);
            if (streak >= 25) {
              setShowRewardModal(true);
            }
          }
        }
      });
    }
    return () => { mounted = false; };
  }, [isFinished, winnerId, myId, userAnswers]);

  if (!room || !myId || questions.length === 0) return (
    <div className="min-h-screen bg-[#f4efff] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (countdown !== null) {
    return (
      <div className="min-h-screen bg-[#f4efff] flex flex-col items-center justify-center text-[#141779] relative">
        {/* Background Decor */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#e8ddff] rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#ffd700] rounded-full blur-[100px] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="text-[60px] animate-bounce">⚔️</div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#141779]">Battle Starts In</h2>
          <div className="text-8xl font-black text-[#ff9f43] drop-shadow-md scale-110 transition-transform duration-200">
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col relative overflow-hidden text-[#141779]">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#e8ddff] rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#ffd700] rounded-full blur-[100px] opacity-10"></div>

      {/* VS Header with Progress Bars */}
      <header className="px-4 py-4 relative z-10 bg-white shadow-md border-b border-[#e0e0e0]">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setShowQuitModal(true)} className="p-2 bg-[#f4efff] rounded-full hover:bg-[#e8ddff] border border-[#e0e0e0] transition-colors">
             <X size={20} color="#141779" />
          </button>
          <span className="text-[#767683] text-xs font-bold uppercase tracking-widest">Live Battle</span>
          <div className="w-9" />
        </div>
        <div className="flex items-center justify-between gap-4">
          
          {/* MY SIDE */}
          <div className="flex-1 flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#141779] overflow-hidden bg-white shadow-sm">
                <img src={myAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${myName || 'Me'}`} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-[#141779] text-base uppercase tracking-wide truncate max-w-[80px]">{myName || "You"}</p>
                  {amIWinning && <Trophy size={16} color="#ff9f43" className="animate-pulse" />}
                </div>
                <p className="text-xs font-bold text-[#767683]">{myScore} PTS</p>
              </div>
            </div>
            {/* Health/Progress Bar */}
            <div className="w-full h-3 bg-[#e8ddff] rounded-full overflow-hidden border border-[#d0d0d0]">
              <div className="h-full bg-gradient-to-r from-[#006a62] to-[#57fae9] transition-all duration-300" style={{ width: `${myProgress}%` }} />
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center">
             <span className="text-2xl font-black italic text-[#ff9f43]">VS</span>
          </div>

          {/* OPPONENT SIDE */}
          <div className="flex-1 flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9f43] overflow-hidden bg-white shadow-sm">
                <img src={oppAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${oppName || 'Opp'}`} className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {isOppWinning && <Trophy size={16} color="#ffd700" className="animate-pulse" />}
                  <p className="font-black text-[#141779] text-base uppercase tracking-wide truncate max-w-[80px]">{oppName || "Opponent"}</p>
                </div>
                <p className="text-xs font-bold text-[#767683]">{oppScore} PTS</p>
              </div>
            </div>
            {/* Health/Progress Bar */}
            <div className="w-full h-3 bg-[#e8ddff] rounded-full overflow-hidden border border-[#d0d0d0] flex justify-end">
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
                 <span className="text-[#141779] font-bold text-sm tracking-widest uppercase">Question {currentQ + 1}/{questions.length}</span>
                 <span className={`font-black text-sm px-3 py-1 rounded-full border border-[#d0d0d0] ${timeLeft <= 5 ? 'bg-red-100 text-red-700 animate-pulse border-red-300' : 'bg-white text-[#141779]'}`}>
                   ⏳ {timeLeft}s
                 </span>
               </div>
               <h2 className="text-3xl font-black mt-2 leading-tight text-[#141779] drop-shadow-sm">
                 {questions[currentQ]?.q || ""}
               </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-auto relative">
              {questions[currentQ]?.options?.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === questions[currentQ]?.a;
                
                let btnStyle = "bg-white hover:bg-[#f4efff] border-[#e0e0e0] text-[#141779]";
                if (selectedOption !== null) {
                   if (isSelected) {
                      btnStyle = isCorrect ? "bg-[#e0f2f1] border-[#006a62] text-[#006a62]" : "bg-[#ffebee] border-[#ba1a1a] text-[#ba1a1a]";
                   } else if (isCorrect) {
                      btnStyle = "bg-[#e0f2f1]/50 border-[#006a62]/50 text-[#006a62]/80"; 
                   } else {
                      btnStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
                   }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`border font-bold text-lg py-5 px-6 rounded-2xl text-left transition-all shadow-sm ${btnStyle} ${selectedOption === null ? 'active:scale-[0.98]' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
              
              {/* Unobtrusive "Waiting" text that doesn't block the screen */}
              {selectedOption !== null && (
                <div className="absolute -bottom-8 w-full text-center animate-pulse">
                  <span className="text-[#767683] font-bold text-sm">Waiting for {oppName}...</span>
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
                  className="w-24 h-24 mb-4 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Trophy size={48} color="white" />
                </motion.div>
                <h2 className="text-4xl font-black text-[#141779] mb-1">VICTORY!</h2>
                <p className="text-lg text-[#006a62] font-bold mb-4">You crushed your opponent.</p>
              </>
            ) : winnerId === null || winnerId === "tie" ? (
              <>
                {winnerId === null ? (
                  <>
                    <div className="w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center border-4 border-[#141779] animate-pulse">
                      <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin"/>
                    </div>
                    <h2 className="text-3xl font-black text-[#141779] mb-2">Calculating...</h2>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-[#141779] mb-2">IT'S A TIE!</h2>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="w-24 h-24 mb-4 bg-[#ffebee] rounded-full flex items-center justify-center border-4 border-[#ba1a1a] shadow-sm">
                  <X size={48} color="#ba1a1a" />
                </div>
                <h2 className="text-4xl font-black text-[#ba1a1a] mb-1">DEFEAT</h2>
                <p className="text-[#ba1a1a] font-bold text-lg mb-4">Your opponent was faster!</p>
              </>
            )}

            {/* Detailed Post-Game Scoreboard */}
            {winnerId !== null && (
               <div className="w-full bg-white rounded-2xl border-2 border-[#d0d0d0] p-5 mb-4 flex flex-col gap-3 shadow-md text-left">
                 <h3 className="text-sm font-black text-[#ff9f43] tracking-widest uppercase text-center mb-1">Final Result</h3>
                 
                 <div className="flex justify-between font-bold text-xs uppercase text-[#767683] border-b border-[#e0e0e0] pb-2">
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
                      <div key={i} className="flex justify-between items-center text-sm font-bold border-b border-[#f0f0f0] pb-1.5 pt-1">
                        <span className="w-1/3 text-center text-[#767683]">Q{i + 1}</span>
                        <span className={`w-1/3 text-center py-0.5 rounded ${iWonT ? 'text-[#006a62] bg-[#e0f2f1]/40 font-black' : 'text-[#464652]'}`}>
                           {myC ? '✅' : '❌'} {myT}s
                        </span>
                        <span className={`w-1/3 text-center py-0.5 rounded ${oppWonT ? 'text-[#ff9f43] bg-[#ffeed1]/40 font-black' : 'text-[#464652]'}`}>
                           {oppC ? '✅' : '❌'} {oppT}s
                        </span>
                      </div>
                    )
                 })}
                 
                 <div className="flex justify-between font-black text-lg pt-2 mt-2 border-t border-[#d0d0d0]">
                    <span className="w-1/3 text-center text-[#767683]">Total</span>
                    <span className="w-1/3 text-center text-[#006a62]">{myScore} pts</span>
                    <span className="w-1/3 text-center text-[#ff9f43]">{oppScore} pts</span>
                 </div>
               </div>
            )}
            
            {winnerId === myId && (
               <div className="bg-white px-6 py-3 rounded-2xl border-2 border-[#d0d0d0] mb-6 w-full shadow-sm text-center">
                  <p className="text-[#767683] font-bold uppercase text-xs mb-1">Win Streak</p>
                  <p className="text-2xl font-black text-[#ff9f43]">{continuousWins} ⚔️</p>
               </div>
            )}
            
            {winnerId !== null && !showRewardModal && (
              <button 
                onClick={() => navigate("/multiplayer-hub")}
                disabled={checkingReward}
                className="w-full max-w-[250px] bg-[#141779] text-white py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-[#30007f] shadow-md mb-4 disabled:opacity-50 border-2 border-[#141779]"
              >
                {checkingReward ? "Checking rewards..." : "Back to Arena"}
              </button>
            )}
          </div>
        )}
      </main>

      {/* PHYSICAL REWARD MODAL */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-b from-[#ffeed1] to-white rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-[0_0_40px_rgba(255,159,67,0.3)] border-4 border-[#ff9f43]"
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

      {/* QUIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showQuitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border-2 border-[#e0e0e0]"
            >
              <div className="w-16 h-16 rounded-full bg-[#ffebee] flex items-center justify-center mb-4 border border-[#ffb4ab]">
                <X size={32} color="#ba1a1a" />
              </div>
              <h2 className="text-2xl font-black text-[#141779] mb-2">Are you sure?</h2>
              <p className="text-[#464652] font-semibold mb-6">
                {myStreak === 0
                  ? "If you leave now, you will lose the game and be penalized 100 coins!"
                  : quitCount === 0 
                  ? "If you leave now, you will lose the game! This is your first warning, so your streak is safe."
                  : quitCount === 1 
                  ? "If you leave now, you will lose the game and your win streak will decrease by 1!"
                  : "If you leave now, you will lose the game and your win streak will be completely reset!"}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowQuitModal(false)}
                  className="flex-grow bg-[#f4efff] text-[#141779] py-3 rounded-xl font-bold hover:bg-[#e8ddff] transition-all border-2 border-[#e0e0e0]"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    setShowQuitModal(false);
                    try {
                      await submitActivityLog(userAnswers);
                      await apiFetch(`/api/multiplayer/room/${roomId}/quit`, { method: "POST" });
                    } catch(e) {}
                    navigate("/multiplayer-hub");
                  }}
                  className="flex-grow bg-[#ba1a1a] text-white py-3 rounded-xl font-bold hover:bg-[#ba1a1a]/80 transition-all"
                >
                  Yes, Quit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OPPONENT QUIT MODAL */}
      <AnimatePresence>
        {opponentQuit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border-2 border-[#e0e0e0]"
            >
              <div className="text-[60px] mb-2">🏃‍♂️💨</div>
              <h2 className="text-2xl font-black text-[#141779] mb-2 uppercase">Opponent Fled!</h2>
              <p className="text-[#006a62] font-bold mb-6">
                Your opponent left the game. You win by default!
              </p>
              
              <button 
                onClick={() => navigate("/multiplayer-hub")}
                className="w-full bg-[#141779] text-white py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#30007f] transition-all border-2 border-[#141779]"
              >
                Back to Arena
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
