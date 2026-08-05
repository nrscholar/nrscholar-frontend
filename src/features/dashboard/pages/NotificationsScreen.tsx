import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../api";

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await apiFetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          const cached = localStorage.getItem("userData");
          let childName = "Explorer";
          if (cached) {
            try {
              childName = JSON.parse(cached).childName || "Explorer";
            } catch (e) {}
          }

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

          // Mark all read when viewed by child
          apiFetch("/api/notifications/mark-all-read", { method: "POST" }).catch(() => {});
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center px-4 h-16 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">Notifications</h1>
      </header>

      <main className="px-6 pt-8 flex flex-col gap-6 max-w-[500px] mx-auto">
        {loading ? (
          <div className="relative pl-1 flex flex-col gap-6">
            <div className="absolute left-[22px] top-0 bottom-0 border-l-2 border-dashed border-[rgba(20,23,121,0.2)] z-0" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 z-10 relative animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 mt-1 shrink-0" />
                <div className="flex-1 relative">
                  <div className="absolute -left-[6px] top-5 w-4 h-4 bg-gray-100 rotate-45 z-0" />
                  <div className="w-full bg-gray-100 rounded-2xl p-4 border-[1.5px] border-white shadow-sm relative z-10">
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={28} className="text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-500">No notifications yet!</p>
            <p className="text-sm text-gray-400 mt-1">Keep completing quests to see updates.</p>
          </div>
        ) : (
          <div className="relative pl-1 flex flex-col gap-6">
            {/* Dashed Line */}
            <div className="absolute left-[22px] top-0 bottom-0 border-l-2 border-dashed border-[rgba(20,23,121,0.2)] z-0" />

            {notifications.map((notif, idx) => {
              const isInfo = notif.type === "habit" || notif.type === "general";
              const isGamification = notif.type === "gamification";
              const isLearning = notif.type === "learning";
              
              return (
                <div key={notif._id || idx} className="flex items-start gap-4 z-10 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] mt-1 ${
                    isLearning ? "bg-[#141779] text-white" :
                    isGamification ? "bg-[#57fae9] text-[#006a62]" :
                    "bg-[#e0e3e5] text-[#141779]"
                  }`}>
                    {isLearning ? <Bell size={20} /> :
                     isGamification ? <Sparkles size={20} /> :
                     <AlertCircle size={20} />}
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute -left-[6px] top-5 w-4 h-4 bg-[rgba(255,255,255,0.7)] rotate-45 z-0" />
                    <div className="w-full text-left bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.5)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold text-[#141779]">{notif.title}</h3>
                        {notif.createdAt && (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-base font-medium text-[#191c1e]">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Visual Anchor */}
        <div className="mt-8 relative w-full h-48 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[rgba(0,106,98,0.05)] rounded-full"
          />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcg9JTfpWdNOXpWuO22pAh-SmdrVfI0_D7ceGxeDxO3gO-tl8MfHIl2U2sOBoSOnMQxjKkQkUwK6nFeC7BJX9w_D87zfkhtbhlEtizN4c-C_BFnGPHsqutVbgyi8mzN5DIvrn9JnnMETaWneQo-LPHZ1mcXJ_KjTaLb2iDH6eQKZAhFWejwLoV_BrYdrbu2oYvv2-pxHMPTpNHeQbcPAC-aaCDkttqKHBsgbkXzDtN4wyNlmZnXrR4_vboBBJMBA5cEybt9xqJnA"
            alt="Buddy"
            className="w-32 h-32 object-contain relative z-10"
          />
        </div>
      </main>
    </div>
  );
}
