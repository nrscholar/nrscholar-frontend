import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Star, Heart, Lock, Sparkles, PartyPopper, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../../../api";


export default function HabitsScreen() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const response = await apiFetch("/api/practice/habits/daily");
        const data = await response.json();
        if (data.success) {
          setHabit(data.data);
          setCompleted(data.data.isCompletedToday || false);
        }
      } catch (e) {
        console.error("Failed to fetch daily habit");
      } finally {
        setLoading(false);
      }
    };
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          setUnreadCount(json.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
    };
    fetchHabit();
    fetchNotifications();
  }, []);

  const handleComplete = async () => {
    if (!habit || completed) return;
    setSubmitting(true);
    try {
      const response = await apiFetch("/api/practice/habits/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId: habit._id, isCompleted: true })
      });
      const data = await response.json();
      if (data.success) {
        setCompleted(true);
        setTimeout(() => {
          setShowModal(true);
        }, 500);
      }
    } catch (e) {
      console.error("Failed to complete habit", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefcbf] via-[#fffbeb] to-[#f0f9ff] text-slate-900 w-full flex flex-col items-center overflow-x-hidden font-headline relative pb-10">
      {/* Soft warm sun glows */}
      <div className="absolute top-[5%] -left-[40px] w-[180px] h-[180px] bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] -right-[40px] w-[200px] h-[200px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full z-40 bg-white/80 backdrop-blur-md border-b border-amber-900/10 flex justify-between items-center px-6 py-4 max-w-[430px] mx-auto sticky top-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-amber-100/50 active:scale-95 rounded-full transition-all shrink-0"
          >
            <ArrowLeft size={24} className="text-[#141779]" />
          </button>
          <h1 className="text-xl font-black tracking-wide text-[#141779]">Good Habits</h1>
        </div>
        <button 
          onClick={() => navigate("/notifications")} 
          className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center hover:bg-amber-50 active:scale-95 transition-all relative shrink-0 border border-amber-100"
        >
          <Bell size={20} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-6 pt-6 flex flex-col items-center gap-6 w-full max-w-[430px] relative z-10">
        
        {/* Title Section */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-[#141779] tracking-tight">Daily Habit Journey</h2>
          <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Build smart habits, gain gold stars! ⭐</p>
        </div>

        {/* Progress Orbit Tracker (Cute Stepping Stones) */}
        <div className="flex justify-between items-center w-full bg-white/90 border-2 border-amber-200/50 p-5 rounded-3xl shadow-sm relative overflow-hidden">
          {/* Stepper Path Connecting Line */}
          <div className="absolute top-[42px] left-10 right-10 h-1 border-t-2 border-dashed border-amber-300 pointer-events-none" />

          {/* Past Day (currentDay - 2) */}
          {(habit?.currentDay > 2) ? (
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-sm border-2 border-white">
                <Star size={18} className="fill-white text-white" />
              </div>
              <span className="text-[10px] font-black text-amber-900">Day {habit.currentDay - 2}</span>
            </div>
          ) : (
            <div className="w-11 h-11 opacity-0 pointer-events-none" />
          )}
          
          {/* Past Day (currentDay - 1) */}
          {(habit?.currentDay > 1) ? (
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-sm border-2 border-white">
                <Star size={18} className="fill-white text-white" />
              </div>
              <span className="text-[10px] font-black text-amber-900">Day {habit.currentDay - 1}</span>
            </div>
          ) : (
            <div className="w-11 h-11 opacity-0 pointer-events-none" />
          )}

          {/* Today (currentDay) */}
          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div className="absolute -top-5 bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white shadow-xs animate-bounce">
              TODAY
            </div>
            <div className={`w-13 h-13 rounded-full flex items-center justify-center border-2 border-white relative z-10 shadow-md ${
              completed 
                ? "bg-gradient-to-br from-amber-400 to-amber-500" 
                : "bg-gradient-to-br from-emerald-400 to-emerald-500 animate-pulse"
            }`}>
              {completed ? (
                <Star size={22} className="fill-white text-white" />
              ) : (
                <Heart size={22} className="fill-white text-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-black text-emerald-950">Day {habit?.currentDay || 1}</span>
          </div>

          {/* Next Day (currentDay + 1) */}
          <div className="flex flex-col items-center gap-1.5 opacity-60 relative z-10">
            <div className="w-11 h-11 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              <Lock size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-500">Day {(habit?.currentDay || 1) + 1}</span>
          </div>
        </div>

        {/* Daily Lesson Card */}
        <div className="bg-white rounded-[32px] p-6 flex flex-col items-center border-2 border-amber-100 shadow-[0_12px_24px_rgba(180,83,9,0.04)] w-full max-w-[400px] relative overflow-hidden">
          {loading ? (
            <div className="py-6 flex flex-col items-center justify-center w-full animate-pulse gap-3">
              <div className="w-20 h-20 bg-slate-200 rounded-3xl mb-4" />
              <div className="h-6 bg-slate-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6 mb-6" />
              <div className="h-14 w-full bg-slate-200 rounded-full" />
            </div>
          ) : (
            <>
              {/* Dynamic Theme Icon Wrapper */}
              <div className="w-18 h-18 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center mb-5 shadow-md border-2 border-white relative">
                <Sparkles size={32} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white border border-white text-[9px] rounded-full flex items-center justify-center font-black">✓</span>
              </div>

              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1.5">LESSON {habit?.currentDay || 1}</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#141779] text-center mb-3 tracking-tight">
                {habit?.title || "Daily Lesson"}
              </h3>
              <p className="text-sm font-bold text-slate-600 text-center leading-relaxed mb-6 px-1">
                {habit?.description || "Loading your daily story..."}
              </p>

              {/* Interaction Button */}
              <button
                disabled={completed || !habit || submitting}
                onClick={handleComplete}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 border transition-all duration-300 ${
                  completed 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:scale-[1.01] active:scale-[0.98] border-orange-400/20'
                }`}
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-base font-black uppercase tracking-wider">
                      {completed ? `Claimed +${habit?.rewardPoints || 10} Points` : "Complete Story"}
                    </span>
                    {completed ? (
                      <CheckCircle2 size={20} className="text-emerald-700" />
                    ) : (
                      <PartyPopper size={20} className="text-white shrink-0 animate-bounce" />
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] p-8 flex flex-col items-center w-full max-w-[340px] border-2 border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-18 h-18 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center mb-5 animate-bounce">
                <PartyPopper size={36} className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-[#141779] text-center mb-2">🎉 Splendid!</h3>
              <p className="text-slate-600 text-center mb-6 leading-relaxed">
                You earned <span className="font-extrabold text-amber-500 text-lg">+{habit?.rewardPoints || 10} Points</span> for practicing this habit today!
              </p>
              <button 
                onClick={() => { setShowModal(false); navigate(-1); }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 rounded-2xl font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-orange-500/10"
              >
                Continue Journey
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
