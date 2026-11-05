import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Star, Lock, Sparkles, Check, CheckCircle2, BookOpen, Tag } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { showNotificationToast } from "../../../components/GlobalNotificationBanner";

export default function HabitsScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        showNotificationToast({
          title: "Habit Practiced! ⭐",
          message: `+${habit?.rewardPoints || 10} Gold Stars earned!`,
          type: "gamification"
        });
        setTimeout(() => {
          setShowModal(true);
        }, 400);
      }
    } catch (e) {
      console.error("Failed to complete habit", e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentDay = habit?.currentDay || 1;

  return (
    <div className="min-h-screen bg-[#F8FAFF] bg-gradient-to-b from-[#F0F4FF] via-[#F8FAFF] to-[#FFFFFF] text-slate-900 w-full flex flex-col items-center overflow-x-clip font-sans relative pb-12">
      {/* Soft ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] h-[180px] bg-[#141779]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-2 w-[220px] h-[220px] bg-[#141779]/4 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100/80 flex justify-between items-center px-5 py-3.5 max-w-[430px] mx-auto sticky top-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 hover:bg-slate-100 active:scale-95 rounded-full transition-all flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={20} className="text-[#141779]" />
          </button>
          <h1 className="text-lg font-black tracking-tight text-[#141779]">{t('good_habits', 'Good Habits')}</h1>
        </div>
        <button 
          onClick={() => navigate("/notifications")} 
          className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all relative shrink-0 border border-slate-200/80"
        >
          <Bell size={18} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>
      </header>

      <main className="px-5 pt-5 flex flex-col items-center gap-5 w-full max-w-[430px] relative z-10">
        
        {/* Main Title Section */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-[26px] font-black text-[#141779] tracking-tight">
            {t('daily_habit_journey', 'Daily Habit Journey')}
          </h2>
          <p className="text-[11px] sm:text-xs font-black text-[#141779]/80 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>{t('build_smart_habits_desc', 'BUILD SMART HABITS, GAIN GOLD STARS!')}</span>
            <span className="text-[#FBBF24]">⭐</span>
          </p>
        </div>

        {/* Progress Journey Bar Component */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(20,23,121,0.05)] relative">
          {/* Connecting Dotted Line */}
          <div className="absolute top-[38px] left-12 right-12 h-[2px] border-t-2 border-dashed border-slate-200 pointer-events-none" />

          <div className="flex justify-between items-center w-full relative z-10">
            
            {/* Step 1 */}
            {currentDay === 1 ? (
              /* If currentDay is Day 1, Step 1 is TODAY (Active) */
              <div className="flex flex-col items-center gap-1 min-w-[70px] relative">
                <div className="absolute -top-3.5 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs border border-white">
                  TODAY
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white relative z-10 shadow-sm ${
                  completed 
                    ? "bg-[#141779] text-white shadow-[#141779]/25" 
                    : "bg-[#141779] text-white ring-4 ring-[#141779]/15"
                }`}>
                  {completed ? (
                    <Check size={18} strokeWidth={3} className="text-white" />
                  ) : (
                    <Star size={17} className="fill-[#FBBF24] text-[#FBBF24]" />
                  )}
                </div>
                <span className="text-[11px] font-black text-[#141779]">
                  {completed ? "Completed" : "In Progress"}
                </span>
                <span className="text-[10px] font-medium text-slate-400">Day 1</span>
              </div>
            ) : (
              /* If currentDay > 1 (e.g. Day 5), Step 1 is the Previous Day (Completed) */
              <div className="flex flex-col items-center gap-1 min-w-[70px]">
                <div className="w-10 h-10 rounded-full bg-[#141779] text-white flex items-center justify-center shadow-xs shadow-[#141779]/20 border-2 border-white relative">
                  <Check size={18} strokeWidth={3} className="text-white" />
                </div>
                <span className="text-[11px] font-black text-[#141779]">Completed</span>
                <span className="text-[10px] font-medium text-slate-400">Day {currentDay - 1}</span>
              </div>
            )}

            {/* Step 2 */}
            {currentDay === 1 ? (
              /* If currentDay is Day 1, Step 2 is Day 2 (Locked) */
              <div className="flex flex-col items-center gap-1 min-w-[70px] opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                  <Lock size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-400">Locked</span>
                <span className="text-[10px] font-medium text-slate-400">Day 2</span>
              </div>
            ) : (
              /* If currentDay > 1 (e.g. Day 5), Step 2 is TODAY (Active) */
              <div className="flex flex-col items-center gap-1 min-w-[70px] relative">
                <div className="absolute -top-3.5 bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs border border-white">
                  TODAY
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white relative z-10 shadow-sm ${
                  completed 
                    ? "bg-[#141779] text-white shadow-[#141779]/25" 
                    : "bg-[#141779] text-white ring-4 ring-[#141779]/15"
                }`}>
                  {completed ? (
                    <Check size={18} strokeWidth={3} className="text-white" />
                  ) : (
                    <Star size={17} className="fill-[#FBBF24] text-[#FBBF24]" />
                  )}
                </div>
                <span className="text-[11px] font-black text-[#141779]">
                  {completed ? "Completed" : "In Progress"}
                </span>
                <span className="text-[10px] font-medium text-slate-400">Day {currentDay}</span>
              </div>
            )}

            {/* Step 3 */}
            {currentDay === 1 ? (
              /* If currentDay is Day 1, Step 3 is Day 3 (Locked) */
              <div className="flex flex-col items-center gap-1 min-w-[70px] opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                  <Lock size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-400">Locked</span>
                <span className="text-[10px] font-medium text-slate-400">Day 3</span>
              </div>
            ) : (
              /* If currentDay > 1 (e.g. Day 5), Step 3 is Next Day (Locked) */
              <div className="flex flex-col items-center gap-1 min-w-[70px] opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                  <Lock size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-400">Locked</span>
                <span className="text-[10px] font-medium text-slate-400">Day {currentDay + 1}</span>
              </div>
            )}

          </div>
        </div>

        {/* Daily Lesson Hero Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col border border-slate-200/80 shadow-[0_8px_30px_rgba(20,23,121,0.06)] w-full relative overflow-hidden">
          {loading ? (
            <div className="py-6 flex flex-col items-center justify-center w-full animate-pulse gap-3">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl mb-2" />
              <div className="h-6 bg-slate-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6 mb-6" />
              <div className="h-12 w-full bg-slate-200 rounded-2xl" />
            </div>
          ) : (
            <>
              {/* Category Indicator Header Badge */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141779] text-white flex items-center justify-center shadow-sm shrink-0">
                  <Tag size={16} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-[#141779] tracking-wide uppercase truncate">
                  {habit?.category || t('general', 'General')}
                </span>
              </div>

              {/* Story Title */}
              <div className="mb-2.5">
                <h3 className="text-xl font-black text-[#141779] leading-snug tracking-tight">
                  {habit?.title || t('the_magic_of_honesty', 'The Magic of Honesty')}
                </h3>
              </div>

              {/* Story Description Paragraph */}
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                {habit?.description || t('lion_story_desc', 'Leo the Lion found a shiny coin that didn’t belong to him. Instead of keeping it, he asked his friends if they lost it. Being honest made Leo feel even braver than his roar!')}
              </p>

              {/* Actionable Practice Task Box */}
              {habit?.actionableStep && (
                <div className="mb-5 bg-gradient-to-r from-indigo-50/90 via-blue-50/40 to-indigo-50/70 border border-indigo-100/90 rounded-2xl p-3 sm:p-3.5 flex items-start gap-2.5 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-white text-[#141779] border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#141779] block">
                      {t('daily_practice_goal', "Today's Practice Task")}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 leading-snug mt-0.5">
                      {habit.actionableStep}
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                disabled={completed || !habit || submitting}
                onClick={handleComplete}
                className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  completed 
                    ? 'bg-indigo-50/90 border border-indigo-200/90 text-[#141779] font-black cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] hover:brightness-110 text-white font-black hover:scale-[1.01] active:scale-[0.98] shadow-[0_4px_16px_rgba(20,23,121,0.35)] border border-indigo-300/40 cursor-pointer'
                }`}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {!completed && (
                      <BookOpen size={18} className="shrink-0 text-white" />
                    )}
                    <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${completed ? 'text-[#141779]' : 'text-white'}`}>
                      {completed ? t('story_completed', 'Story Completed ✓') : t('complete_story', 'Complete Story')}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* UNIFIED HABIT REWARD MODAL */}
        <UnifiedConfirmModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); navigate(-1); }}
          onConfirm={() => { setShowModal(false); navigate(-1); }}
          title={t('habit_practiced_title', 'Habit Unlocked!')}
          message={t('earned_points_desc', { points: habit?.rewardPoints || 10, defaultValue: `You earned +${habit?.rewardPoints || 10} Gold Stars for practicing this habit today!` })}
          confirmText={t('continue_journey', 'Continue Journey')}
          showCancel={false}
          variant="primary"
          icon={<span className="text-3xl">⭐</span>}
        />
      </main>
    </div>
  );
}

