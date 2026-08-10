import React from "react";
import { motion } from "framer-motion";
import { Lock, Star, CheckCircle2, ShieldAlert } from "lucide-react";

export interface LandmarkData {
  id: string;
  name: string;
  region: string;
  emoji: string;
  status: "unlocked" | "locked" | "completed" | "active";
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  requiredXp: number;
  description: string;
  missionsCount: number;
  reward: string;
  rewardIcon: string;
  themeColor: string;
}

interface MapLandmarkProps {
  landmark: LandmarkData;
  onClick: (landmark: LandmarkData) => void;
}

export default function MapLandmark({ landmark, onClick }: MapLandmarkProps) {
  const isLocked = landmark.status === "locked";
  const isCompleted = landmark.status === "completed";
  const isActive = landmark.status === "active";

  return (
    <div
      onClick={() => onClick(landmark)}
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group"
      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Mysterious Fog effect over locked locations */}
        {isLocked && (
          <div className="absolute -inset-4 rounded-full bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-30 pointer-events-none">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-white/70"
            >
              <Lock size={18} />
            </motion.div>
          </div>
        )}

        {/* Pulsing Active Ring for current active target */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -inset-3 rounded-3xl bg-amber-400/40 border-2 border-amber-300 blur-2xs z-0"
          />
        )}

        {/* Landmark Illustration Container */}
        <motion.div
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.92 }}
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center border-3 transition-all duration-300 shadow-xl ${
            isCompleted
              ? "bg-gradient-to-b from-emerald-400 to-teal-600 border-amber-300 text-white shadow-emerald-500/30"
              : isActive
              ? "bg-gradient-to-b from-amber-400 to-orange-500 border-white text-slate-950 shadow-amber-500/40 ring-4 ring-amber-400/30"
              : isLocked
              ? "bg-slate-800/80 border-slate-700 text-slate-500 grayscale opacity-80"
              : "bg-gradient-to-b from-sky-400 to-indigo-600 border-white text-white shadow-indigo-500/30"
          }`}
        >
          {/* Landmark Emoji Icon */}
          <span className="text-3xl sm:text-4xl filter drop-shadow-md select-none">
            {landmark.emoji}
          </span>

          {/* Status Badge Overlays */}
          {isCompleted && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 border-2 border-white flex items-center justify-center shadow-md">
              <CheckCircle2 size={14} className="stroke-[3]" />
            </div>
          )}

          {isActive && (
            <div className="absolute -top-2.5 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 border-2 border-white flex items-center justify-center font-black text-xs shadow-md animate-bounce">
              ⚡
            </div>
          )}
        </motion.div>

        {/* Landmark Name Label */}
        <div
          className={`mt-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-wider shadow-md border max-w-[110px] truncate text-center ${
            isCompleted
              ? "bg-emerald-950/80 border-emerald-400/50 text-emerald-200"
              : isActive
              ? "bg-amber-950/90 border-amber-400 text-amber-300"
              : isLocked
              ? "bg-slate-900/80 border-slate-700 text-slate-400"
              : "bg-slate-950/80 border-white/30 text-white"
          }`}
        >
          {landmark.name}
        </div>
      </div>
    </div>
  );
}
