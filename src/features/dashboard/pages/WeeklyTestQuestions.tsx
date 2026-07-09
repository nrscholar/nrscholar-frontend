import { ArrowLeft, Check, Lightbulb, X as XIcon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../../../api";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function WeeklyTestQuestionsScreen() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [tipsData, setTipsData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchTest() {
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

      try {
        const res = await apiFetch("/api/practice/weekly-test");
        const json = await res.json();
        if (json.success && json.data) {
          setQuestionsData(json.data.questions);
          setTipsData(json.data.tips);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, []);

  const total = questionsData.length > 0 ? questionsData.length : 1;
  const q = questionsData.length > 0 ? questionsData[currentQ] : { subject: "MATH", text: "Loading...", options: ["","","",""], correct: 0 };
  const tip = tipsData.length > 0 ? tipsData[currentQ] : "Loading tip...";
  const progress = ((currentQ) / total) * 100;

  const isCorrect = selected === q.correct;

  const handleConfirm = () => {
    if (selected === null) return;
    if (!confirmed) {
      setConfirmed(true);
      if (isCorrect) setScore((s) => s + 1);
    } else {
      if (currentQ < total - 1) {
        setCurrentQ((p) => p + 1);
        setSelected(null);
        setConfirmed(false);
      } else {
        navigate(`/weekly-test-results?score=${score + (isCorrect ? 1 : 0)}&total=${total}`, { replace: true });
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4efff]">
      <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const subjectColors: Record<string, string> = {
    "MATH": "bg-[#006a62]",
    "SCIENCE": "bg-[#30007f]",
    "ENGLISH": "bg-[#141779]",
  };
  const bgClass = subjectColors[q.subject] || "bg-[#141779]";

  const btnLabel = !confirmed
    ? "CONFIRM ANSWER"
    : currentQ < total - 1
    ? "NEXT QUESTION →"
    : "SEE RESULTS 🏆";

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
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
          <h1 className="text-[22px] font-extrabold text-[#141779] whitespace-nowrap">Weekly Quest</h1>
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

        {/* Question Card */}
        <div className="bg-white rounded-[20px] p-7 mb-6 relative border border-[rgba(211,202,188,0.15)] shadow-[0_12px_24px_rgba(25,28,30,0.05)]">
          {/* Subject badge */}
          <div className={`absolute -top-3.5 left-3 px-4 py-2 rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.18)] -rotate-[5deg] ${bgClass}`}>
            <span className="text-[15px] font-black text-white tracking-[0.5px]">{q.subject}</span>
          </div>

          <div className="flex flex-col items-center pt-5 pb-2 gap-2.5 relative z-10">
            <span className="text-xs font-semibold text-[#464652] tracking-[3px]">CHALLENGE</span>
            <h2 className="text-2xl font-black text-[#191c1e] text-center leading-[34px] tracking-[-0.5px]">
              {q.text}
            </h2>
          </div>

          <span className="absolute -bottom-2 right-2 text-[72px] opacity-10 pointer-events-none select-none">
            🔢
          </span>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-7">
          {q.options.map((opt: string, idx: number) => {
            let btnClass = "bg-white border-2 border-transparent";
            let labelClass = "bg-[#f5f5f5]";
            let textClass = "text-[#191c1e]";

            if (confirmed) {
              if (idx === q.correct) {
                btnClass = "bg-[#e8ddff] border-[#30007f]";
                labelClass = "bg-[#30007f] text-white";
                textClass = "text-[#1d0052]";
              } else if (idx === selected) {
                btnClass = "bg-[#ffdad6] border-[#ba1a1a]";
                labelClass = "bg-[#ba1a1a] text-white";
                textClass = "text-[#ba1a1a]";
              } else {
                btnClass = "bg-white border-transparent opacity-45";
              }
            } else if (selected === idx) {
              btnClass = "bg-[rgba(224,224,255,0.4)] border-[#c2e8ff]";
              textClass = "text-[#141779]";
            }

            return (
              <button
                key={idx}
                onClick={() => !confirmed && setSelected(idx)}
                className={`rounded-[18px] py-[18px] px-3 flex flex-col items-center justify-center relative shadow-[0_10px_20px_rgba(25,28,30,0.05)] transition-all ${btnClass}`}
              >
                <div className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center ${labelClass}`}>
                  <span className={`text-[13px] font-bold ${confirmed && (idx === q.correct || idx === selected) ? 'text-white' : 'text-[#827656]'}`}>
                    {OPTION_LABELS[idx]}
                  </span>
                </div>
                <span className={`text-xl font-black mt-2 ${textClass}`}>{opt}</span>
                
                {confirmed && idx === q.correct && (
                  <Check className="absolute bottom-2 right-3 text-[#30007f]" size={20} strokeWidth={4} />
                )}
                {confirmed && idx === selected && idx !== q.correct && (
                  <XIcon className="absolute bottom-2 right-3 text-[#ba1a1a]" size={20} strokeWidth={4} />
                )}
              </button>
            );
          })}
        </div>

        {/* Pro Tip Bubble */}
        <div className="flex items-start gap-3.5 bg-[rgba(255,255,255,0.85)] rounded-[18px] p-4.5 border border-[rgba(255,255,255,0.6)] shadow-[0_8px_16px_rgba(25,28,30,0.05)] mb-2">
          <div className="w-11 h-11 bg-[#d0f0ed] rounded-full flex items-center justify-center shrink-0">
            <Lightbulb size={20} color="#006a62" className="fill-[#006a62]" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] font-bold text-[#006a62] tracking-[1px] mb-1">PRO TIP</span>
            <p className="text-sm font-medium text-[#464652] leading-5">{tip}</p>
          </div>
        </div>
      </main>

      {/* Fixed Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f4efff] via-[#f4efff] to-transparent pointer-events-none">
        <button
          disabled={selected === null && !confirmed}
          onClick={handleConfirm}
          className={`w-full bg-[#141779] py-[18px] rounded-full flex items-center justify-center shadow-[0_4px_0_#141779] pointer-events-auto transition-opacity ${
            selected === null && !confirmed ? 'opacity-45' : 'hover:opacity-90'
          }`}
        >
          <span className="text-white text-[17px] font-extrabold tracking-[1px] uppercase">
            {btnLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
