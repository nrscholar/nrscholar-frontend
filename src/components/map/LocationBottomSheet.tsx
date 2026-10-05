import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Flame, BookOpen, Star } from "lucide-react";
import { MapLocationConfig, NRSCHOLAR_COLORS } from "./AdventureTheme";

interface LocationBottomSheetProps {
  location: MapLocationConfig | null;
  state?: "current" | "next" | "future";
  onClose: () => void;
  onEnter: (location: MapLocationConfig) => void;
}

export default function LocationBottomSheet({
  location,
  state = "next",
  onClose,
  onEnter,
}: LocationBottomSheetProps) {
  if (!location) return null;

  const isCurrent = state === "current";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-xs p-0 sm:p-4">
        {/* Backdrop overlay tap dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Storybook Bottom Sheet Panel */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="relative z-10 w-full max-w-[400px] bg-[#F4F8FF] border-t-4 border-[#2D328F] rounded-t-[32px] sm:rounded-[32px] p-6 text-slate-900 shadow-[0_-12px_40px_rgba(45,50,143,0.2)] flex flex-col gap-4 overflow-hidden select-none"
        >
          {/* Top Sheet Drag Indicator Bar */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-0.5" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-500 transition-all border border-slate-200"
          >
            <X size={16} />
          </button>

          {/* HEADER LOCATION TITLE */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl border-2 border-white flex items-center justify-center text-3xl shadow-md shrink-0 text-white"
              style={{ backgroundColor: NRSCHOLAR_COLORS.primary }}
            >
              {location.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: NRSCHOLAR_COLORS.secondary }}
              >
                {isCurrent ? "YOUR CURRENT ADVENTURE" : "YOUR NEXT ADVENTURE"}
              </span>
              <h2
                className="text-base font-black truncate mt-1 leading-snug"
                style={{ color: NRSCHOLAR_COLORS.heading }}
              >
                {location.name}
              </h2>
            </div>
          </div>

          {/* SHORT NARRATIVE STORY (1-2 sentences) */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
            <span className="text-base shrink-0">📜</span>
            <p className="text-xs font-bold leading-relaxed italic text-slate-700">
              "{location.storyQuote}"
            </p>
          </div>

          {/* LOCATION STATS SUMMARY PILL */}
          <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[#2D328F] text-xs font-black flex items-center gap-1">
                <Flame size={13} className="fill-amber-500 text-amber-500" />
                {location.questsCount} Quests
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-slate-100">
              <span className="text-[#2D328F] text-xs font-black flex items-center gap-1">
                <BookOpen size={13} className="text-[#14C8C6]" />
                {location.lessonsCount} Lessons
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[#2D328F] text-xs font-black flex items-center gap-1">
                <Star size={13} className="fill-[#FFC857] text-[#FFC857]" />
                {location.xpReward} XP
              </span>
            </div>
          </div>

          {/* PRIMARY ENTER ACTION CTA */}
          <button
            onClick={() => onEnter(location)}
            className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all border-2 flex items-center justify-center gap-2 mt-1 active:scale-95 text-slate-950 border-amber-300"
            style={{
              backgroundColor: NRSCHOLAR_COLORS.reward,
            }}
          >
            <span>ENTER ADVENTURE</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
