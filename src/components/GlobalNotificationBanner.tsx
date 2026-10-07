import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Sparkles, X, ChevronRight, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateNotificationTitle, translateNotificationMessage } from "../utils/notificationTranslator";

export interface ToastData {
  title?: string;
  message: string;
  screen?: string;
  type?: "lock" | "warning" | "error" | "gamification" | "success" | "info" | string;
}

// Global Helper function to trigger unified toast notification from anywhere
export const showNotificationToast = (data: ToastData) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-notification-toast", { detail: data }));
  }
};

export default function GlobalNotificationBanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    let timer: any = null;

    const handleToastEvent = (e: any) => {
      if (e.detail) {
        setToast(e.detail);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setToast(null), 5000);
      }
    };

    window.addEventListener("show-notification-toast", handleToastEvent);
    return () => {
      window.removeEventListener("show-notification-toast", handleToastEvent);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  const rawTitle = toast.title || (toast.type === "lock" ? "CHAPTER LOCKED 🔒" : toast.type === "error" || toast.type === "warning" ? "NOTICE ⚠️" : "NOTIFICATION 🔔");
  const displayTitle = translateNotificationTitle(rawTitle, t);
  const displayMessage = translateNotificationMessage(toast.message, t);

  const renderIcon = () => {
    switch (toast.type) {
      case "lock":
        return <Lock size={18} className="text-[#141779]" />;
      case "warning":
      case "error":
        return <AlertCircle size={18} className="text-[#141779]" />;
      case "success":
        return <CheckCircle size={18} className="text-[#141779]" />;
      case "gamification":
        return <Sparkles size={18} className="text-[#141779]" />;
      default:
        return <Bell size={18} className="text-[#141779]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99999] max-w-md w-[92%] pointer-events-none">
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="pointer-events-auto bg-gradient-to-r from-[#141779] via-[#1E2266] to-[#2D328F] text-white p-3.5 rounded-2xl shadow-[0_16px_36px_rgba(20,23,121,0.45)] border-2 border-[#57fae9] flex items-center gap-3 select-none w-full backdrop-blur-xl"
        >
          {/* Accent Icon Capsule */}
          <div className="w-9 h-9 rounded-xl bg-[#57fae9] flex items-center justify-center font-black shrink-0 shadow-md">
            {renderIcon()}
          </div>

          <div 
            className="flex-1 min-w-0 cursor-pointer" 
            onClick={() => {
              if (toast.screen) {
                navigate(toast.screen);
                setToast(null);
              }
            }}
          >
            <h4 className="text-[11px] font-black text-[#57fae9] uppercase tracking-wider mb-0.5 leading-none">
              {displayTitle}
            </h4>
            <p className="text-xs font-bold text-slate-100 leading-snug break-words">
              {displayMessage}
            </p>
          </div>

          {toast.screen && (
            <button
              onClick={() => {
                navigate(toast.screen!);
                setToast(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#57fae9] text-[#141779] font-black text-[10px] uppercase tracking-wider flex items-center gap-0.5 shrink-0 shadow-md active:scale-95 transition-all"
            >
              <span>{t('view', 'View')}</span>
              <ChevronRight size={12} />
            </button>
          )}

          <button
            onClick={() => setToast(null)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 shrink-0 transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
