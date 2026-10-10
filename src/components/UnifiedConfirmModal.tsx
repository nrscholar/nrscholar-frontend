import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info, Trash2, HelpCircle } from "lucide-react";

export type ModalVariant = "primary" | "danger" | "warning" | "success" | "info";

export interface UnifiedConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  showCancel?: boolean;
  maxWidth?: string;
  zIndex?: string;
}

export default function UnifiedConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  icon,
  loading = false,
  showCancel = true,
  maxWidth = "max-w-[360px]",
  zIndex = "z-[300]"
}: UnifiedConfirmModalProps) {
  if (!isOpen) return null;

  const renderDefaultIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 size={30} className="text-rose-600" />;
      case "warning":
        return <AlertTriangle size={30} className="text-amber-600" />;
      case "success":
        return <CheckCircle2 size={30} className="text-emerald-600" />;
      case "info":
        return <Info size={30} className="text-[#141779]" />;
      default:
        return <HelpCircle size={30} className="text-[#141779]" />;
    }
  };

  const getBadgeStyle = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-50 border-rose-200 text-rose-600";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-600";
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "info":
      case "primary":
      default:
        return "bg-indigo-50 border-indigo-100 text-[#141779]";
    }
  };

  const getConfirmBtnStyle = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20";
      case "info":
      case "primary":
      default:
        return "bg-[#141779] hover:bg-[#101362] text-white shadow-[#141779]/20";
    }
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm select-none animate-in fade-in duration-200`}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className={`w-full ${maxWidth} bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_20px_60px_rgba(20,23,121,0.18)] border border-slate-100 flex flex-col items-center text-center relative`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Icon Badge */}
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-3.5 shadow-xs ${getBadgeStyle()}`}>
            {icon || renderDefaultIcon()}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-[#141779] mb-1.5 leading-snug">
            {title}
          </h3>

          {/* Message / Description */}
          <div className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed mb-6 px-1">
            {message}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 w-full">
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`w-full py-3.5 rounded-full font-black text-sm uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 ${getConfirmBtnStyle()}`}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{confirmText}</span>
              </button>
            )}

            {showCancel && (
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 rounded-full font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
