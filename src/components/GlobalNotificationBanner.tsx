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
    try {
      sessionStorage.setItem("active_toast_payload", JSON.stringify(data));
    } catch (e) {}
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

    const isMissionCompleteToast = (item: any): boolean => {
      if (!item) return false;
      const t = String(item.title || "").toUpperCase();
      const m = String(item.message || "").toUpperCase();
      return (
        t.includes("MISSION COMPLETED") ||
        t.includes("LESSON COMPLETE") ||
        t.includes("MYSTERY SOLVED") ||
        m.includes("YOUR DRAGON EGG IS GLOWING")
      );
    };

    // Check if there is an active toast dispatched right before route transition/reload
    try {
      const activePayload = sessionStorage.getItem("active_toast_payload");
      if (activePayload) {
        sessionStorage.removeItem("active_toast_payload");
        const parsed = JSON.parse(activePayload);
        if (!isMissionCompleteToast(parsed)) {
          setToast(parsed);
          timer = setTimeout(() => setToast(null), 5000);
        }
      }
    } catch (e) {}

    const handleToastEvent = (e: any) => {
      if (e.detail) {
        // Exclude mission completion toasts from rendering on-screen banner
        if (isMissionCompleteToast(e.detail)) {
          return;
        }
        setToast(e.detail);
        try {
          sessionStorage.removeItem("active_toast_payload");
        } catch (e) {}
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

  const rawTitle = toast
    ? toast.title || (toast.type === "lock" ? "CHAPTER LOCKED" : toast.type === "error" || toast.type === "warning" ? "NOTICE" : "NOTIFICATION")
    : "";
  // Icon lives in the accent badge, so strip emojis from the text to avoid duplicate icons.
  const stripEmoji = (txt: string) =>
    txt.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "").replace(/\s{2,}/g, " ").trim();
  const displayTitle = toast ? stripEmoji(translateNotificationTitle(rawTitle, t)) : "";
  const displayMessage = toast ? stripEmoji(translateNotificationMessage(toast.message, t)) : "";

  const kind = toast?.type;
  const theme =
    kind === "success"
      ? { Icon: CheckCircle, badge: "bg-emerald-50 text-emerald-600 border-emerald-100", bar: "#10b981", title: "text-emerald-700" }
      : kind === "error"
        ? { Icon: AlertCircle, badge: "bg-rose-50 text-rose-600 border-rose-100", bar: "#f43f5e", title: "text-rose-700" }
        : kind === "warning"
          ? { Icon: AlertCircle, badge: "bg-amber-50 text-amber-600 border-amber-100", bar: "#f59e0b", title: "text-amber-700" }
          : kind === "lock"
            ? { Icon: Lock, badge: "bg-indigo-50 text-[#141779] border-indigo-100", bar: "#141779", title: "text-[#141779]" }
            : kind === "gamification"
              ? { Icon: Sparkles, badge: "bg-indigo-50 text-[#141779] border-indigo-100", bar: "#141779", title: "text-[#141779]" }
              : { Icon: Bell, badge: "bg-indigo-50 text-[#141779] border-indigo-100", bar: "#141779", title: "text-[#141779]" };

  const go = () => {
    if (toast?.screen) {
      navigate(toast.screen);
      setToast(null);
    }
  };

  return (
    <AnimatePresence>
      {toast && (
        <div
          key="toast-wrap"
          className="fixed left-1/2 -translate-x-1/2 z-[99999] max-w-md w-[92%] pointer-events-none"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        >
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            role="status"
            aria-live="polite"
            className="pointer-events-auto relative overflow-hidden bg-white text-slate-900 rounded-2xl border border-slate-200/80 shadow-[0_12px_32px_rgba(20,23,121,0.18)] flex items-center gap-3 p-3 pr-2 select-none w-full"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${theme.badge}`}>
              <theme.Icon size={20} strokeWidth={2.4} />
            </div>

            <div className={`flex-1 min-w-0 ${toast.screen ? "cursor-pointer" : ""}`} onClick={go}>
              <h4 className={`text-[11px] font-black uppercase tracking-wider leading-none mb-1 ${theme.title}`}>
                {displayTitle}
              </h4>
              <p className="text-[13px] font-semibold text-slate-600 leading-snug break-words">{displayMessage}</p>
            </div>

            {toast.screen && (
              <button
                type="button"
                onClick={go}
                className="px-3 py-1.5 rounded-xl bg-[#141779] text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-0.5 shrink-0 active:scale-95 transition-all"
              >
                <span>{t("view", "View")}</span>
                <ChevronRight size={12} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setToast(null)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            {/* Auto-dismiss timer bar */}
            <motion.div
              key={`${displayTitle}-${displayMessage}`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              style={{ background: theme.bar, transformOrigin: "left" }}
              className="absolute left-0 bottom-0 h-[3px] w-full opacity-70"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
