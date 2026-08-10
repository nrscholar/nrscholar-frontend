import React from "react";
import { motion } from "framer-motion";
import { NRSCHOLAR_COLORS } from "./AdventureTheme";

interface CompanionProps {
  emoji?: string;
  x: number; // percentage on map (0 - 100)
  y: number; // percentage on map (0 - 100)
  isVisible?: boolean;
  onClick?: () => void;
}

export default function Companion({
  emoji = "🐉",
  x,
  y,
  isVisible = true,
  onClick,
}: CompanionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.7, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      onClick={onClick}
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-1000 ease-out select-none"
      style={{ left: `${x}%`, top: `${y - 10}%` }}
    >
      <div className="relative flex flex-col items-center group">
        {/* Subtle Turquoise (#14C8C6) Glowing Ring / Shadow Underneath */}
        <motion.div
          animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.35, 0.65, 0.35] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -bottom-1 w-10 h-3 rounded-full blur-xs"
          style={{ backgroundColor: "rgba(20, 200, 198, 0.5)" }}
        />

        {/* Calm Idle Mascot Animation: breathing, head movement, blinking */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            scale: [1, 1.025, 1],
            rotate: [-1, 1, -1],
          }}
          transition={{ repeat: Infinity, duration: 4.0, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl filter drop-shadow-[0_6px_14px_rgba(45,50,143,0.3)] select-none hover:scale-105 active:scale-95 transition-transform"
        >
          {emoji}
        </motion.div>

        {/* Subtle Branded Royal Indigo Tag (Optional tiny indicator) */}
        <div
          className="mt-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider text-white shadow-xs border border-white/40 flex items-center gap-1 shrink-0 whitespace-nowrap"
          style={{ backgroundColor: NRSCHOLAR_COLORS.primary }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: NRSCHOLAR_COLORS.secondary }}
          />
          <span>YOU ARE HERE</span>
        </div>
      </div>
    </motion.div>
  );
}
