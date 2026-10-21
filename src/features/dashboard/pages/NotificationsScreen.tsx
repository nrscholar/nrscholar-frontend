import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Sparkles, AlertCircle, Gift, BookOpen, Disc, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import { translateNotificationTitle, translateNotificationMessage } from "../../../utils/notificationTranslator";

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const formatNotificationTitle = (title: string) => translateNotificationTitle(title, t);
  const formatNotificationMessage = (msg: string) => translateNotificationMessage(msg, t);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    async function loadNotifications() {
      try {
        const cached = localStorage.getItem("userData");
        let activeChildId = "";
        let childName = "Explorer";
        if (cached) {
          try {
            const u = JSON.parse(cached);
            activeChildId = u.activeChildId || u.children?.[0]?.childId || u.childId || "";
            childName = u.childName || "Explorer";
          } catch (e) {}
        }

        const notifUrl = `/api/notifications?role=child${activeChildId ? `&childId=${encodeURIComponent(activeChildId)}` : ""}`;
        const res = await apiFetch(notifUrl);
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = json.data.map((n: any) => {
            let message = n.message || "";
            // Make it child-friendly by replacing childName with "You"
            const regex = new RegExp(childName, "gi");
            message = message.replace(regex, "You");
            
            // Correct basic grammar
            message = message.replace(/\bYou has\b/gi, "You have");
            message = message.replace(/\bYou is\b/gi, "You are");
            message = message.replace(/\bYou completed their\b/gi, "You completed your");
            message = message.replace(/\bYou left a\b/gi, "You left your");

            return { ...n, message };
          });
          setNotifications(formatted);

          // Mark all read when viewed by child for this specific child
          const markUrl = `/api/notifications/mark-all-read?role=child${activeChildId ? `&childId=${encodeURIComponent(activeChildId)}` : ""}`;
          apiFetch(markUrl, { method: "POST" }).catch(() => {});
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();

    const handleUserDataUpdate = () => {
      loadNotifications();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => window.removeEventListener("userDataUpdated", handleUserDataUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10 overflow-x-hidden relative">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex items-center justify-between px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">
            {t('notifications', 'Notifications')}
          </h1>
        </div>
      </header>

      <main className="px-4 sm:px-5 pt-3.5 sm:pt-4 pb-24 flex flex-col gap-3.5 sm:gap-4 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="relative pl-1 flex flex-col gap-3.5 sm:gap-4">
            <div className="absolute left-[22px] top-0 bottom-0 border-l-2 border-dashed border-[rgba(20,23,121,0.2)] z-0" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3.5 z-10 relative animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 mt-1 shrink-0" />
                <div className="flex-1 relative">
                  <div className="absolute -left-[6px] top-5 w-4 h-4 bg-gray-100 rotate-45 z-0" />
                  <div className="w-full bg-gray-100 rounded-2xl p-3.5 sm:p-4 border-[1.5px] border-white shadow-2xs relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-10" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-base font-bold text-gray-500">{t('no_notifications_yet', 'No notifications yet!')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('keep_completing_quests', 'Keep completing quests to see updates.')}</p>
          </div>
        ) : (
          <div className="relative pl-1 flex flex-col gap-3 sm:gap-3.5">
            {/* Dashed Line */}
            <div className="absolute left-[22px] top-0 bottom-0 border-l-2 border-dashed border-[rgba(20,23,121,0.2)] z-0" />

            {notifications.map((notif, idx) => {
              const isSpin = notif.type === "spin" || notif.type === "daily_spin";
              const isReward = notif.type === "reward" || notif.type === "daily_reward";
              const isPdf = notif.type === "pdf" || notif.type === "reading";
              const isGamification = notif.type === "gamification";
              const isLearning = notif.type === "learning";
              
              return (
                <div key={notif._id || idx} className="flex items-start gap-3 sm:gap-3.5 z-10 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs mt-1 ${
                    isSpin ? "bg-purple-600 text-white" :
                    isReward ? "bg-amber-500 text-white" :
                    isPdf ? "bg-indigo-600 text-white" :
                    isLearning ? "bg-[#141779] text-white" :
                    isGamification ? "bg-[#57fae9] text-[#006a62]" :
                    "bg-[#e0e3e5] text-[#141779]"
                  }`}>
                    {isSpin ? <Disc size={18} /> :
                     isReward ? <Gift size={18} /> :
                     isPdf ? <BookOpen size={18} /> :
                     isLearning ? <Bell size={18} /> :
                     isGamification ? <Sparkles size={18} /> :
                     <AlertCircle size={18} />}
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute -left-[6px] top-4 sm:top-5 w-3.5 h-3.5 bg-white rotate-45 z-0" />
                    <div 
                      onClick={() => notif.screen && navigate(notif.screen)}
                      className={`w-full text-left bg-white/95 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-indigo-200 transition-all relative z-10 ${notif.screen ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs sm:text-sm font-bold text-[#141779]">
                          {formatNotificationTitle(notif.title)}
                        </h3>
                        {notif.createdAt && (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-[#191c1e]">{formatNotificationMessage(notif.message)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#141779] text-white shadow-[0_4px_20px_rgba(20,23,121,0.4)] border-2 border-white/30 flex items-center justify-center hover:bg-[#191C8B] active:scale-90 transition-all cursor-pointer"
            aria-label={t('scroll_to_top', 'Scroll to top')}
          >
            <ArrowUp size={22} className="stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
