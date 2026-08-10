import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap, Coins, Gift, Swords, Sparkles, BookOpen } from "lucide-react";
import { MapStageConfig, NRSCHOLAR_TOKENS } from "./AdventureTheme";

interface LocationModalSheetProps {
  stage: MapStageConfig | null;
  state?: "completed" | "current" | "upcoming";
  onClose: () => void;
  onEnter: (stage: MapStageConfig) => void;
}

export default function LocationModalSheet({
  stage,
  state = "current",
  onClose,
  onEnter,
}: LocationModalSheetProps) {
  if (!stage) return null;

  const isCurrent = state === "current";
  const isCompleted = state === "completed";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 backdrop-blur-xs p-0 sm:p-4 select-none">
        {/* Backdrop Tap Dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Storybook Bottom Sheet Panel */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="relative z-10 w-full max-w-[420px] bg-[#F4F8FF] border-t-4 border-[#2D328F] rounded-t-[32px] sm:rounded-[32px] p-6 text-slate-900 shadow-[0_-16px_48px_rgba(45,50,143,0.25)] flex flex-col gap-4 overflow-hidden"
        >
          {/* Top Handle */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-0.5" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-500 transition-all border border-slate-200 shadow-2xs"
          >
            <X size={16} />
          </button>

          {/* HERO BANNER SECTION */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl border-2 border-white flex items-center justify-center text-4xl shadow-md shrink-0 text-white bg-gradient-to-br from-[#2D328F] to-[#1E2266]"
            >
              {stage.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-[9.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                style={{
                  backgroundColor: isCompleted
                    ? "#10B981"
                    : isCurrent
                    ? NRSCHOLAR_TOKENS.secondary
                    : NRSCHOLAR_TOKENS.tertiary,
                }}
              >
                {isCompleted
                  ? "✓ STAGE COMPLETED"
                  : isCurrent
                  ? "CURRENT ADVENTURE"
                  : "UPCOMING QUEST"}
              </span>
              <h2
                className="text-lg font-black truncate leading-tight font-headline"
                style={{ color: NRSCHOLAR_TOKENS.textDark }}
              >
                {stage.name}
              </h2>
              <p className="text-xs font-bold text-slate-500 truncate mt-0.5">
                {stage.subtitle}
              </p>
            </div>
          </div>

          {/* NARRATIVE STORY QUOTE */}
          <div className="bg-white border border-indigo-100/90 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
            <span className="text-lg shrink-0">📜</span>
            <p className="text-xs font-bold leading-relaxed italic text-slate-700">
              "{stage.storyQuote}"
            </p>
          </div>

          {/* MISSIONS BREAKDOWN LIST */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10.5px] font-black uppercase tracking-wider text-[#2D328F] px-1 flex items-center gap-1.5">
              <Swords size={12} className="text-[#14C8C6]" />
              AVAILABLE MISSIONS ({stage.missions.length})
            </h4>

            <div className="flex flex-col gap-1.5">
              {stage.missions.map((m, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{m.icon}</span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {m.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-black bg-indigo-50 text-[#2D328F] px-2 py-0.5 rounded-full shrink-0">
                    +{m.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AREA REWARDS SUMMARY BADGE */}
          <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-amber-600 text-xs font-black flex items-center gap-1">
                <Zap size={13} className="fill-amber-500 text-amber-500" />
                +{stage.xpReward} XP
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-slate-100">
              <span className="text-[#2D328F] text-xs font-black flex items-center gap-1">
                <Coins size={13} className="text-[#FFC857]" />
                +{stage.coinReward} Coins
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[#14C8C6] text-xs font-black flex items-center gap-1 truncate">
                <Gift size={13} />
                {stage.itemReward}
              </span>
            </div>
          </div>

          {/* PRIMARY ENTER ACTION CTA BUTTON */}
          <button
            onClick={() => onEnter(stage)}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all border-2 flex items-center justify-center gap-2 mt-1 active:scale-95 text-slate-950 border-amber-300"
            style={{ backgroundColor: NRSCHOLAR_TOKENS.reward }}
          >
            <Swords size={16} />
            <span>START ADVENTURE</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
