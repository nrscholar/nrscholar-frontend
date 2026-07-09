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
    <div className="min-h-screen bg-[#f7f9fb] font-sans relative overflow-hidden pb-10">
      {/* Background Elements */}
      <div className="absolute top-[25%] -left-[50px] w-[150px] h-[150px] bg-[rgba(0,106,98,0.1)] rounded-full z-0" />
      <div className="absolute bottom-[25%] -right-[50px] w-[180px] h-[180px] bg-[rgba(20,23,121,0.05)] rounded-full z-0" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-xl font-bold text-[#141779]">Good Habits</h1>
        </div>
        <button 
          onClick={() => navigate("/notifications")} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative shrink-0"
        >
          <Bell size={20} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-6 pt-8 flex flex-col items-center gap-8 relative z-10">
        
        {/* Title Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#141779] mb-1">Good Habits & Values</h2>
          <span className="text-sm font-semibold text-[#006a62]">Sparkle like a Star today!</span>
        </div>

        {/* Progress Orbit Tracker */}
        <div className="flex justify-center gap-4 w-full">
          {/* Day 1 */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-[#57fae9] flex items-center justify-center shadow-[0_0_10px_rgba(87,250,233,0.5)]">
              <Star size={24} color="#00201d" className="fill-[#00201d]" />
            </div>
            <span className="text-xs font-bold text-[#464652]">Day 1</span>
          </div>
          {/* Day 2 */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-[#57fae9] flex items-center justify-center shadow-[0_0_10px_rgba(87,250,233,0.5)]">
              <Star size={24} color="#00201d" className="fill-[#00201d]" />
            </div>
            <span className="text-xs font-bold text-[#464652]">Day 2</span>
          </div>
          {/* Today */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#2addcd] flex items-center justify-center">
              <Heart size={24} color="#2addcd" className="fill-[#2addcd]" />
            </div>
            <span className="text-xs font-bold text-[#464652]">Today</span>
          </div>
          {/* Day 4 */}
          <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#c7c5d4] flex items-center justify-center">
              <Lock size={24} color="#767683" />
            </div>
            <span className="text-xs font-bold text-[#464652]">Day 4</span>
          </div>
        </div>

        {/* Daily Lesson Card */}
        <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 flex flex-col items-center border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] w-full max-w-[400px]">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#e0e0ff] rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={36} color="#141779" />
              </div>
              <h3 className="text-xl font-bold text-[#141779] text-center mb-3">
                {habit?.title || "Daily Lesson"}
              </h3>
              <p className="text-base font-medium text-[#464652] text-center leading-6 mb-8 px-2">
                {habit?.description || "Loading your lesson..."}
              </p>

              {/* Interaction Button */}
              <button
                disabled={completed || !habit || submitting}
                onClick={handleComplete}
                className={`w-full py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(20,23,121,0.3)] transition-all ${
                  completed ? 'bg-[#f0f0f0] border-2 border-[#e0e3e5] shadow-none cursor-not-allowed' : 'bg-[#141779] hover:opacity-90 active:scale-[0.98]'
                }`}
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className={`text-base font-bold ${completed ? 'text-[#767683]' : 'text-white'}`}>
                      {completed ? `Claimed +${habit?.rewardPoints || 10} Points` : "Complete Story"}
                    </span>
                    {completed ? (
                      <CheckCircle2 size={22} color="#767683" />
                    ) : (
                      <PartyPopper size={22} color="white" />
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-6 flex flex-col items-center w-full max-w-[320px] shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#fff0da] rounded-full flex items-center justify-center mb-4">
                <PartyPopper size={32} color="#ff9f43" />
              </div>
              <h3 className="text-xl font-bold text-[#141779] text-center mb-2">Brilliant!</h3>
              <p className="text-[#464652] text-center mb-6">You earned <span className="font-bold text-[#ff9f43]">{habit?.rewardPoints || 10} Points</span> for completing today's story.</p>
              <button 
                onClick={() => { setShowModal(false); navigate(-1); }}
                className="w-full bg-[#141779] text-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
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
