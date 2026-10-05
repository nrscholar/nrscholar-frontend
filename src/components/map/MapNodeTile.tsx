import React from "react";
import { motion } from "framer-motion";
import { MapStageConfig, NRSCHOLAR_TOKENS } from "./AdventureTheme";
import { Check, Lock, Star } from "lucide-react";

export type StageState = "completed" | "current" | "upcoming";

interface MapNodeTileProps {
  stage: MapStageConfig;
  state: StageState;
  onClick: (stage: MapStageConfig) => void;
}

export default function MapNodeTile({ stage, state, onClick }: MapNodeTileProps) {
  const isCurrent = state === "current";
  const isCompleted = state === "completed";
  const isUpcoming = state === "upcoming";

  return (
    <div
      onClick={() => onClick(stage)}
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group"
      style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Aura Ring for Current Node */}
        {isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute -inset-3 rounded-full blur-xs z-0"
            style={{
              backgroundColor: "rgba(20, 200, 198, 0.4)",
              border: `3px solid ${NRSCHOLAR_TOKENS.secondary}`,
            }}
          />
        )}

        {/* 3D Illustrated Stage Tile Badge */}
        <motion.div
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.92 }}
          className={`relative z-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            isCurrent
              ? "w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-br from-[#2D328F] via-[#3B42B8] to-[#1E2266] border-4 border-[#FFC857] shadow-[0_10px_25px_rgba(45,50,143,0.4)] ring-4 ring-[#14C8C6]/40"
              : isCompleted
              ? "w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-emerald-500 to-teal-700 border-3 border-emerald-200 shadow-emerald-700/30"
              : "w-14 h-14 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-md border-2 border-slate-200/90 text-slate-400 shadow-md"
          }`}
        >
          {/* Stage Emoji Illustration */}
          <span
            className={`transition-all ${
              isCurrent
                ? "text-4xl sm:text-5xl filter drop-shadow-md"
                : isCompleted
                ? "text-3xl sm:text-4xl filter drop-shadow-xs"
                : "text-2xl sm:text-3xl opacity-75 grayscale-25"
            }`}
          >
            {stage.emoji}
          </span>

          {/* Status Badge Overlay */}
          {isCompleted && (
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#FFC857] border-2 border-white flex items-center justify-center text-slate-950 font-black shadow-xs">
              <Check size={14} strokeWidth={3} />
            </div>
          )}

          {isUpcoming && (
            <div className="absolute -bottom-1 -right-1 bg-slate-100 rounded-full p-1 border border-slate-300 shadow-xs text-slate-400">
              <Lock size={12} />
            </div>
          )}
        </motion.div>

        {/* Current Stage Badge Banner */}
        {isCurrent && (
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-1.5 px-3 py-0.5 rounded-full text-slate-950 font-black text-[9px] uppercase tracking-widest shadow-md border border-white flex items-center gap-1 shrink-0 whitespace-nowrap"
            style={{ backgroundColor: NRSCHOLAR_TOKENS.reward }}
          >
            <Star size={10} className="fill-slate-950 text-slate-950" />
            <span>CURRENT QUEST</span>
          </motion.div>
        )}

        {/* Stage Name Card Tag */}
        <div
          className={`mt-1 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider shadow-sm border max-w-[120px] truncate text-center transition-all ${
            isCurrent
              ? "bg-[#2D328F] border-indigo-300 text-white shadow-indigo-900/30"
              : isCompleted
              ? "bg-emerald-800 border-emerald-400 text-emerald-100"
              : "bg-white/90 border-slate-200 text-slate-600 font-bold"
          }`}
        >
          {stage.name}
        </div>
      </div>
    </div>
  );
}
