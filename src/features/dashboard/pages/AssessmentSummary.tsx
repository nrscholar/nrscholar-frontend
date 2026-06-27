
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Rocket, Sun, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../api";

const CONFETTI_COLORS = ['#57fae9', '#141779', '#bfc2ff', '#006a62', '#ffdad6'];
const NUM_CONFETTI = 40;

const ConfettiPiece = () => {
  const left = Math.random() * 100;
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const isCircle = Math.random() > 0.5;
  const duration = Math.random() * 3 + 3;
  const delay = Math.random() * 3;

  return (
    <motion.div
      initial={{ y: -50, rotate: 0 }}
      animate={{ y: "120vh", rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
      className={`absolute w-2 h-2 ${isCircle ? 'rounded-full' : 'rounded-sm'} z-0`}
      style={{ left: `${left}%`, backgroundColor: color }}
    />
  );
};

export default function AssessmentSummary() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>({
    masteryProgress: 92,
    starsEarned: 240,
    confidence: "9/10",
    topic: "Solar System",
    concepts: ['The Sun', 'Planets', 'Gravity']
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryScore = searchParams.get("score");
  const queryTotal = searchParams.get("total");
  let initialAnswers = location.state?.userAnswers;
  if (!initialAnswers || initialAnswers.length === 0) {
    try {
      const stored = sessionStorage.getItem("lastSessionAnswers");
      if (stored) {
        initialAnswers = JSON.parse(stored);
      }
    } catch (e) {}
  }
  const localAnswers = initialAnswers || [];

  const [isReviewing, setIsReviewing] = useState(false);

  const [dbAnswers, setDbAnswers] = useState<any[]>([]);
  
  const userAnswers = localAnswers.length > 0 ? localAnswers : dbAnswers;

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await apiFetch("/api/practice/assessment-summary");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {}
    }
    
    async function fetchAnswers() {
      const chapterId = searchParams.get("chapterId");
      if (chapterId && (!initialAnswers || initialAnswers.length === 0)) {
        try {
          const res = await apiFetch(`/api/practice/chapter-progress/${chapterId}`);
          const json = await res.json();
          if (json.success && json.data && json.data.answers) {
            setDbAnswers(json.data.answers);
          }
        } catch (e) {}
      }
    }
    
    fetchAnswers();
    
    // If we have query params, override the data
    if (queryScore !== null && queryTotal !== null) {
      const scoreNum = parseInt(queryScore);
      const totalNum = parseInt(queryTotal) || 1;
      const mastery = Math.round((scoreNum / totalNum) * 100);
      setData({
        masteryProgress: mastery,
        starsEarned: scoreNum * 10,
        confidence: `${scoreNum}/${totalNum}`,
        topic: "Chapter Quiz",
        concepts: ['Accuracy', 'Completion']
      });
    } else {
      fetchSummary();
    }
  }, [queryScore, queryTotal]);

  const masteryProgress = data.masteryProgress;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (masteryProgress / 100) * circumference;

  if (isReviewing) {
    return (
      <div className="fixed inset-0 bg-[#f7f9fb] text-[#141779] p-6 pb-20 overflow-y-auto font-sans z-50">
        <header className="flex items-center gap-4 mb-6 pt-4">
           <button onClick={() => setIsReviewing(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#e0e3e5] hover:opacity-80"> 
             <ArrowLeft size={24} color="#141779" />
           </button>
           <h1 className="text-xl font-bold tracking-[-0.5px]">Review Answers</h1>
        </header>

        {userAnswers.length === 0 ? (
           <div className="flex flex-col items-center justify-center mt-20">
             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Menu size={32} color="#9ca3af" />
             </div>
             <p className="text-center text-gray-500 font-medium">No review data available for this session.</p>
           </div>
        ) : (
          <div className="flex flex-col gap-4">
             {userAnswers.map((ans: any, idx: number) => {
               if (!ans) return null; // Skip empty
               return (
                <div key={idx} className={`p-4 rounded-[20px] border-[1.5px] ${ans.isCorrect ? 'border-[rgba(0,106,98,0.4)] bg-[rgba(87,250,233,0.15)]' : 'border-[rgba(186,26,26,0.3)] bg-[#ffdad6]'} shadow-[0_2px_10px_rgba(0,0,0,0.03)]`}>
                   <div className="flex gap-3 mb-2 items-start">
                     <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[13px] font-bold text-white ${ans.isCorrect ? 'bg-[#006a62]' : 'bg-[#ba1a1a]'}`}>
                       {idx + 1}
                     </span>
                     <h3 className="font-bold text-[15px] leading-5 flex-1 mt-0.5">{ans.questionText || "Question"}</h3>
                   </div>
                   
                   {ans.interactionType === "mcq" ? (
                     <div className="flex flex-col gap-2 mt-3 pl-10">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-gray-500 w-[60px] uppercase tracking-wide">You:</span>
                          <span className={`text-sm font-bold ${ans.isCorrect ? 'text-[#006a62]' : 'text-[#ba1a1a]'}`}>
                            {ans.selected !== null && ans.selected !== undefined ? ans.optionsList?.[ans.selected] : "Skipped/None"}
                          </span>
                        </div>
                        {!ans.isCorrect && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-500 w-[60px] uppercase tracking-wide">Correct:</span>
                            <span className="text-sm font-bold text-[#006a62]">
                              {ans.correctAnswer}
                            </span>
                          </div>
                        )}
                     </div>
                   ) : (
                     <div className="flex flex-col gap-2 mt-3 pl-10">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-gray-500 w-[60px] uppercase tracking-wide">You:</span>
                          <span className={`text-sm font-bold ${ans.isCorrect ? 'text-[#006a62]' : 'text-[#ba1a1a]'}`}>
                            {ans.selected} {ans.objectEmoji}
                          </span>
                        </div>
                        {!ans.isCorrect && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-500 w-[60px] uppercase tracking-wide">Correct:</span>
                            <span className="text-sm font-bold text-[#006a62]">
                              {ans.targetCount} {ans.objectEmoji}
                            </span>
                          </div>
                        )}
                     </div>
                   )}
                </div>
             )})}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-hidden">
      {/* Confetti Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} />
        ))}
      </div>

      {/* Top App Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md pt-8">
        <button className="p-1 hover:opacity-80 transition-opacity">
          <Menu size={24} color="#141779" />
        </button>
        <h1 className="text-xl font-bold text-[#141779] tracking-[-0.5px]">Studysaathy</h1>
        <div className="w-8 h-8 rounded-full bg-[#2d328f] overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPi330Jn0m4Ju-QdTyxElmKEzS1nvZXgLAUHgkcNZ9oDk1LWGslJRxi9Gp57yzRvs7gZoIuC3Nhuh1HsMVlYVxj93yJo_RavUo85gHvTsBuic6vl8zGcYonFP4bfQLsMx83i_Gq2Ka1yV_p0I8anRK9yJgn7Vfo2rLoKxCDpx-YZ5eHc2zqYcUTsi2qplbVnpM5PzFxVkkOZFtx86zCQJf_RyQkl_LgxogY7aw88XZ3BM8BbWILHWDY3oWI002qj_WgT5tJ8Uxxw"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="px-6 pt-6 pb-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Celebratory Header */}
        <div className="flex flex-col items-center mb-6 relative z-10">
          <motion.div
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-2"
          >
            <Rocket size={64} color="#006a62" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#141779] mb-1">Great Job, Explorer!</h2>
          <p className="text-base font-medium text-[#464652]">Daily Quest Completed Successfully</p>
        </div>

        {/* Central Summary Card (Bento Style) */}
        <div className="w-full max-w-[430px] flex flex-col gap-4 mb-6 relative z-10">
          {/* Topic Card */}
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#57fae9] flex items-center justify-center">
              <Sun size={24} color="#006a62" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#464652] tracking-[1px] mb-0.5">COMPLETED TOPIC</p>
              <h3 className="text-xl font-bold text-[#141779]">{data.topic}</h3>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Mastery Score */}
            <div className="flex-1 aspect-square bg-[rgba(255,255,255,0.7)] rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center justify-center">
              <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#e0e3e5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#006a62"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#141779]">{masteryProgress}%</span>
                  <span className="text-xs font-bold text-[#464652]">Mastery</span>
                </div>
              </div>
            </div>

            {/* Rewards Column */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-3 border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center">
                  <span className="text-[#f59e0b] text-xl">⭐</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#141779]">{data.starsEarned}</p>
                  <p className="text-xs font-bold text-[#464652]">Stars Earned</p>
                </div>
              </div>

              <div className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-3 border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e0e0ff] flex items-center justify-center">
                  <span className="text-[#141779] text-xl">🧠</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#141779]">{data.confidence}</p>
                  <p className="text-xs font-bold text-[#464652]">Confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Concepts Learned Grid */}
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)]">
            <h4 className="text-sm font-semibold text-[#141779] mb-3">Concepts Mastered</h4>
            <div className="flex flex-wrap gap-2">
              {data.concepts.map((concept: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(87,250,233,0.3)] rounded-full">
                  <CheckCircle size={16} color="#007168" />
                  <span className="text-xs font-bold text-[#007168]">{concept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[430px] flex flex-col gap-3 mt-auto relative z-10">
          <button
            onClick={() => navigate('/home')}
            className="w-full h-14 bg-[#141779] rounded-full flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
          >
            <span className="text-xl font-bold text-white">Back to Home</span>
          </button>
          <button
            onClick={() => setIsReviewing(true)}
            className="w-full h-14 bg-white border-2 border-[#bfc2ff] rounded-full flex items-center justify-center hover:bg-[#f4efff] transition-colors shadow-sm"
          >
            <span className="text-xl font-bold text-[#141779]">Review Questions</span>
          </button>
        </div>
      </main>
    </div>
  );
}
