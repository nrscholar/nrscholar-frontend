import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Sparkles, X, ChevronRight } from "lucide-react";

interface ToastData {
  title: string;
  message: string;
  screen?: string;
  type?: string;
}

export default function GlobalNotificationBanner() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    // Request Desktop Notification Permission on initial mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    const handleToastEvent = (e: any) => {
      if (e.detail) {
        setToast(e.detail);
        // Auto-dismiss after 6 seconds
        setTimeout(() => setToast(null), 6000);
      }
    };

    window.addEventListener("show-notification-toast", handleToastEvent);
    return () => window.removeEventListener("show-notification-toast", handleToastEvent);
  }, []);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] pointer-events-none">
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="pointer-events-auto bg-gradient-to-r from-[#141779] via-[#1E2266] to-[#2D328F] text-white p-4 rounded-2xl shadow-[0_12px_30px_rgba(20,23,121,0.5)] border-2 border-[#57fae9] flex items-center gap-3 select-none w-full"
        >
          <div className="w-10 h-10 rounded-full bg-[#57fae9] text-[#141779] flex items-center justify-center font-black text-xl shrink-0 shadow-md">
            {toast.type === "gamification" ? <Sparkles size={20} /> : <Bell size={20} />}
          </div>

          <div className="flex-1 min-w-0" onClick={() => {
            if (toast.screen) {
              navigate(toast.screen);
              setToast(null);
            }
          }}>
            <h4 className="text-xs font-black text-[#57fae9] uppercase tracking-wider truncate mb-0.5">
              {toast.title}
            </h4>
            <p className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
              {toast.message}
            </p>
          </div>

          {toast.screen && (
            <button
              onClick={() => {
                navigate(toast.screen!);
                setToast(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#57fae9] text-[#141779] font-black text-[11px] uppercase tracking-wider flex items-center gap-0.5 shrink-0 shadow-md active:scale-95 transition-all"
            >
              <span>View</span>
              <ChevronRight size={13} />
            </button>
          )}

          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 shrink-0"
          >
            <X size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
