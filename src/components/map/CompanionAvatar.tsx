import React from "react";
import { motion } from "framer-motion";
import { NRSCHOLAR_TOKENS } from "./AdventureTheme";

interface CompanionAvatarProps {
  emoji?: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  isVisible?: boolean;
  onClick?: () => void;
}

export default function CompanionAvatar({
  emoji = "🐉",
  x,
  y,
  isVisible = true,
  onClick,
}: CompanionAvatarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 15 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.6, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onClick={onClick}
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
      style={{ left: `${x}%`, top: `${y - 12}%` }}
    >
      <div className="relative flex flex-col items-center group">
        {/* Animated Speech Bubble Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mb-1 px-3 py-1 rounded-xl bg-white border border-indigo-100 shadow-md text-[9.5px] font-black text-[#2D328F] flex items-center gap-1 shrink-0 whitespace-nowrap relative"
        >
          <span>Ready for our quest! ✨</span>
          {/* Speech bubble pointer arrow */}
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-white" />
        </motion.div>

        {/* Soft Glowing Aura Shadow */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -bottom-1 w-12 h-3 rounded-full blur-xs"
          style={{ backgroundColor: "rgba(20, 200, 198, 0.45)" }}
        />

        {/* Mascot Mascot Animation: Breathing & Idle Float */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [-1.5, 1.5, -1.5],
            scale: [1, 1.03, 1],
          }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl filter drop-shadow-[0_8px_16px_rgba(45,50,143,0.3)] hover:scale-105 active:scale-95 transition-transform"
        >
          {emoji}
        </motion.div>
      </div>
    </motion.div>
  );
}
