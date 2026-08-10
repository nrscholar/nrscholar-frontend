import React from "react";
import { motion } from "framer-motion";
import { MapLocationConfig, NRSCHOLAR_COLORS } from "./AdventureTheme";

export type LocationState = "current" | "next" | "future";

interface MapLocationProps {
  location: MapLocationConfig;
  state: LocationState;
  onClick: (location: MapLocationConfig) => void;
}

export default function MapLocation({ location, state, onClick }: MapLocationProps) {
  const isCurrent = state === "current";
  const isNext = state === "next";
  const isFuture = state === "future";

  return (
    <div
      onClick={() => onClick(location)}
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group transition-all duration-500"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Subtle Turquoise (#14C8C6) Highlight Ring for NEXT location */}
        {isNext && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -inset-2.5 rounded-full blur-2xs z-0"
            style={{ backgroundColor: "rgba(20, 200, 198, 0.35)", border: `2px solid ${NRSCHOLAR_COLORS.secondary}` }}
          />
        )}

        {/* Subtle Royal Indigo (#2D328F) Glow Ring for CURRENT location */}
        {isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -inset-2.5 rounded-full blur-2xs z-0"
            style={{ backgroundColor: "rgba(45, 50, 143, 0.25)", border: `2px solid ${NRSCHOLAR_COLORS.primary}` }}
          />
        )}

        {/* Storybook Environment Illustration Node (No generic rectangular cards!) */}
        <motion.div
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.94 }}
          className={`relative z-10 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 shadow-md ${
            isCurrent
              ? "w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-b from-[#2D328F] to-[#1E2A5E] border-3 border-white text-white shadow-indigo-900/30"
              : isNext
              ? "w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-[#14C8C6] to-[#0D9488] border-3 border-white text-white shadow-teal-700/30"
              : "w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-b from-white to-slate-100 border-2 border-slate-300/70 text-slate-500 opacity-75 backdrop-blur-xs"
          }`}
        >
          {/* Environment Location Icon */}
          <span
            className={`select-none transition-all duration-500 ${
              isCurrent
                ? "text-3xl sm:text-4xl filter drop-shadow-md"
                : isNext
                ? "text-2xl sm:text-3xl filter drop-shadow-xs"
                : "text-xl sm:text-2xl opacity-75"
            }`}
          >
            {location.emoji}
          </span>

          {/* Terrain Decor Overlay */}
          {location.terrainIcon && (
            <span className="absolute -bottom-1 -right-1 text-xs bg-white/90 rounded-full p-0.5 border border-slate-200 shadow-2xs">
              {location.terrainIcon}
            </span>
          )}
        </motion.div>

        {/* Location Tag Badge */}
        {isNext && (
          <div
            className="mt-1 px-2 py-0.5 rounded-full text-slate-950 font-black text-[8.5px] uppercase tracking-wider shadow-xs border border-white whitespace-nowrap animate-pulse"
            style={{ backgroundColor: NRSCHOLAR_COLORS.reward }}
          >
            NEXT ADVENTURE
          </div>
        )}

        {/* Location Title Label (NRscholar Poppins Heading Style) */}
        <div
          className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border max-w-[110px] truncate text-center transition-all ${
            isCurrent
              ? "bg-[#2D328F] border-indigo-400 text-white"
              : isNext
              ? "bg-[#14C8C6] border-teal-200 text-slate-950"
              : "bg-white/80 border-slate-300/60 text-slate-600 font-bold"
          }`}
        >
          {location.name}
        </div>
      </div>
    </div>
  );
}
