import React from "react";
import { motion } from "framer-motion";

interface CompanionCharacterProps {
  type?: "dragon" | "science" | "social" | "space" | "ocean" | "history";
  position: { x: number; y: number }; // Percentage offsets on map (0-100)
  level?: number;
  name?: string;
  onClick?: () => void;
}

const COMPANION_ICONS: Record<string, string> = {
  dragon: "🐉",
  science: "🦉",
  social: "🦁",
  space: "🚀",
  ocean: "🤿",
  history: "🧭",
};

export default function CompanionCharacter({
  type = "dragon",
  position,
  level = 5,
  name = "Flame Companion",
  onClick,
}: CompanionCharacterProps) {
  const icon = COMPANION_ICONS[type] || "🐉";

  return (
    <div
      onClick={onClick}
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-1000 ease-out"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative flex flex-col items-center group">
        {/* Pulsing Footprint / Energy Halo beneath character */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-1 w-12 h-5 rounded-full bg-amber-400/40 blur-xs"
        />

        {/* Floating Sparks / Dust particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: [-10, -35], opacity: [0, 0.8, 0], scale: [0.5, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 text-xs text-amber-300"
            >
              ✨
            </motion.span>
          ))}
        </div>

        {/* Character Mascot with Gentle Idle Bobbing / Wing Flap */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [-3, 3, -3],
            scale: [1, 1.04, 1],
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="text-5xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none hover:scale-110 active:scale-95 transition-transform"
        >
          {icon}
        </motion.div>

        {/* Character Badge / Level Tag */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9.5px] uppercase tracking-wider shadow-lg border border-amber-200 flex items-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
          <span>YOU (Lvl {level})</span>
        </motion.div>
      </div>
    </div>
  );
}
