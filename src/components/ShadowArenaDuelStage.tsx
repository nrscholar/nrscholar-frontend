import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Swords, Zap, Flame, Award, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ShadowArenaTheme = "dragon" | "science" | "social";

interface ShadowArenaDuelStageProps {
  theme?: ShadowArenaTheme;
  playerName?: string;
  opponentName?: string;
  onThemeChange?: (theme: ShadowArenaTheme) => void;
  showThemeSelector?: boolean;
  className?: string;
  isCompact?: boolean;
}

// =========================================================================
// 1. DRAGON DUEL: 2 Dragons Fighting (Cyan Hero Dragon vs Ruby Shadow Dragon)
// =========================================================================

const HeroDragonSVG = () => (
  <motion.div
    animate={{ y: [-3, 3, -3], rotate: [-1, 2, -1] }}
    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,229,255,0.7)] overflow-visible">
      <defs>
        <linearGradient id="heroDragonBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="60%" stopColor="#00b894" />
          <stop offset="100%" stopColor="#0984e3" />
        </linearGradient>
        <linearGradient id="heroDragonBelly" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8ff78" />
          <stop offset="100%" stopColor="#55efc4" />
        </linearGradient>
        <linearGradient id="heroFlame" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#00f0ff" />
          <stop offset="80%" stopColor="#0984e3" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="heroDragonAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00b894" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura Glow */}
      <circle cx="55" cy="55" r="45" fill="url(#heroDragonAura)" />

      {/* Tail with Spikes */}
      <path d="M 30 75 Q 12 85 8 98 Q 18 102 28 88 Q 34 80 38 72 Z" fill="#00b894" />
      <polygon points="8,98 2,106 14,103" fill="#00f0ff" />
      <polygon points="18,88 12,94 22,92" fill="#55efc4" />

      {/* Beating Wing */}
      <motion.g
        animate={{ rotate: [-8, 12, -8] }}
        transition={{ repeat: Infinity, duration: 0.85, ease: "easeInOut" }}
        style={{ transformOrigin: "42px 48px" }}
      >
        <path d="M 42 48 L 18 18 L 32 32 L 30 14 L 46 36 L 50 18 L 56 46 Z" fill="url(#heroDragonBody)" stroke="#00f0ff" strokeWidth="1.2" />
        <path d="M 18 18 Q 32 26 42 48 M 30 14 Q 38 28 46 36 M 50 18 Q 52 30 56 46" stroke="#a8ff78" strokeWidth="0.8" fill="none" opacity="0.8" />
      </motion.g>

      {/* Dragon Body */}
      <ellipse cx="50" cy="62" rx="22" ry="17" fill="url(#heroDragonBody)" />

      {/* Dragon Belly Plates */}
      <path d="M 46 54 Q 60 62 58 76 Q 44 76 40 64 Z" fill="url(#heroDragonBelly)" opacity="0.9" />
      <line x1="43" y1="59" x2="55" y2="62" stroke="#00b894" strokeWidth="1" />
      <line x1="42" y1="66" x2="56" y2="69" stroke="#00b894" strokeWidth="1" />

      {/* Dragon Legs & Claws */}
      <path d="M 42 74 L 38 90 L 44 92 L 48 88 L 52 92 L 54 84 Z" fill="#00b894" />
      <path d="M 58 72 L 64 86 L 70 88 L 72 82 L 76 86 L 74 78 Z" fill="#0984e3" />

      {/* Dragon Neck & Head */}
      <path d="M 58 54 Q 68 46 72 36 L 62 38 Z" fill="url(#heroDragonBody)" />
      
      {/* Head */}
      <path d="M 64 36 Q 74 24 86 28 Q 94 36 84 46 L 68 46 Z" fill="url(#heroDragonBody)" />
      {/* Horns */}
      <path d="M 66 28 Q 60 14 52 12 Q 58 22 64 26 Z" fill="#ffd166" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M 72 26 Q 72 10 66 8 Q 72 18 74 24 Z" fill="#ffd166" stroke="#f59e0b" strokeWidth="0.8" />
      {/* Snout & Jaw */}
      <path d="M 82 30 L 96 34 L 88 42 L 76 42 Z" fill="#00f0ff" />
      {/* Eye */}
      <circle cx="78" cy="32" r="3.2" fill="#ffffff" />
      <ellipse cx="78.5" cy="32" rx="1.2" ry="2.6" fill="#007a5e" />
      {/* Sharp Teeth */}
      <polygon points="86,36 88,40 90,36" fill="#ffffff" />
      <polygon points="92,37 94,41 96,37" fill="#ffffff" />

      {/* Clashing Flame Breath (shooting right) */}
      <motion.g
        animate={{ scaleX: [0.85, 1.25, 0.95], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
        style={{ transformOrigin: "94px 38px" }}
      >
        <path d="M 94 36 Q 110 32 124 38 Q 112 44 94 41 Z" fill="url(#heroFlame)" />
        <path d="M 95 37 Q 106 35 116 38 Q 107 41 95 40 Z" fill="#ffffff" />
        <circle cx="118" cy="34" r="2.5" fill="#00f0ff" className="animate-ping" />
        <circle cx="124" cy="42" r="2" fill="#a8ff78" />
      </motion.g>
    </svg>
  </motion.div>
);

const RivalDragonSVG = () => (
  <motion.div
    animate={{ y: [3, -3, 3], rotate: [1, -2, 1] }}
    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_12px_rgba(255,71,87,0.7)] overflow-visible">
      <defs>
        <linearGradient id="rivalDragonBody" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4757" />
          <stop offset="60%" stopColor="#d63031" />
          <stop offset="100%" stopColor="#2d3436" />
        </linearGradient>
        <linearGradient id="rivalDragonBelly" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffa502" />
          <stop offset="100%" stopColor="#ff6b81" />
        </linearGradient>
        <linearGradient id="rivalFlame" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#ff4757" />
          <stop offset="80%" stopColor="#ffa502" />
          <stop offset="100%" stopColor="#ff4757" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rivalDragonAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4757" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2d3436" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura Glow */}
      <circle cx="65" cy="55" r="45" fill="url(#rivalDragonAura)" />

      {/* Spiked Tail */}
      <path d="M 90 75 Q 108 85 112 98 Q 102 102 92 88 Q 86 80 82 72 Z" fill="#d63031" />
      <polygon points="112,98 118,106 106,103" fill="#ff4757" />
      <polygon points="102,88 108,94 98,92" fill="#ffa502" />

      {/* Beating Shadow Wing */}
      <motion.g
        animate={{ rotate: [8, -12, 8] }}
        transition={{ repeat: Infinity, duration: 0.85, ease: "easeInOut" }}
        style={{ transformOrigin: "78px 48px" }}
      >
        <path d="M 78 48 L 102 18 L 88 32 L 90 14 L 74 36 L 70 18 L 64 46 Z" fill="url(#rivalDragonBody)" stroke="#ff4757" strokeWidth="1.2" />
        <path d="M 102 18 Q 88 26 78 48 M 90 14 Q 82 28 74 36 M 70 18 Q 68 30 64 46" stroke="#ffa502" strokeWidth="0.8" fill="none" opacity="0.8" />
      </motion.g>

      {/* Dragon Body */}
      <ellipse cx="70" cy="62" rx="22" ry="17" fill="url(#rivalDragonBody)" />

      {/* Dragon Belly Plates */}
      <path d="M 74 54 Q 60 62 62 76 Q 76 76 80 64 Z" fill="url(#rivalDragonBelly)" opacity="0.9" />
      <line x1="77" y1="59" x2="65" y2="62" stroke="#b71540" strokeWidth="1" />
      <line x1="78" y1="66" x2="64" y2="69" stroke="#b71540" strokeWidth="1" />

      {/* Dragon Legs & Claws */}
      <path d="M 78 74 L 82 90 L 76 92 L 72 88 L 68 92 L 66 84 Z" fill="#d63031" />
      <path d="M 62 72 L 56 86 L 50 88 L 48 82 L 44 86 L 46 78 Z" fill="#2d3436" />

      {/* Dragon Neck & Head */}
      <path d="M 62 54 Q 52 46 48 36 L 58 38 Z" fill="url(#rivalDragonBody)" />
      
      {/* Head */}
      <path d="M 56 36 Q 46 24 34 28 Q 26 36 36 46 L 52 46 Z" fill="url(#rivalDragonBody)" />
      {/* Spiked Horns */}
      <path d="M 54 28 Q 60 14 68 12 Q 62 22 56 26 Z" fill="#2d3436" stroke="#ff4757" strokeWidth="0.8" />
      <path d="M 48 26 Q 48 10 54 8 Q 48 18 46 24 Z" fill="#2d3436" stroke="#ff4757" strokeWidth="0.8" />
      {/* Snout & Jaw */}
      <path d="M 38 30 L 24 34 L 32 42 L 44 42 Z" fill="#ff4757" />
      {/* Eye */}
      <circle cx="42" cy="32" r="3.2" fill="#ffffff" />
      <ellipse cx="41.5" cy="32" rx="1.2" ry="2.6" fill="#e17055" />
      {/* Sharp Teeth */}
      <polygon points="34,36 32,40 30,36" fill="#ffffff" />
      <polygon points="28,37 26,41 24,37" fill="#ffffff" />

      {/* Clashing Flame Breath (shooting left) */}
      <motion.g
        animate={{ scaleX: [0.85, 1.25, 0.95], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
        style={{ transformOrigin: "26px 38px" }}
      >
        <path d="M 26 36 Q 10 32 -4 38 Q 8 44 26 41 Z" fill="url(#rivalFlame)" />
        <path d="M 25 37 Q 14 35 4 38 Q 13 41 25 40 Z" fill="#ffffff" />
        <circle cx="2" cy="34" r="2.5" fill="#ffa502" className="animate-ping" />
        <circle cx="-4" cy="42" r="2" fill="#ff4757" />
      </motion.g>
    </svg>
  </motion.div>
);

// Center Clash for Dragons
const DragonClashCenter = () => (
  <div className="relative flex flex-col items-center justify-center mx-1 z-20 shrink-0">
    {/* Clashing Fireburst Core */}
    <motion.div
      animate={{ scale: [1, 1.35, 1], rotate: [0, 180, 360] }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#ffd166] to-[#ff4757] opacity-60 blur-md pointer-events-none"
    />
    {/* Fiery Impact Ring */}
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffd166] via-[#ff4757] to-[#00f0ff] p-[2px] shadow-[0_0_18px_rgba(255,209,102,0.9)] animate-pulse relative z-10">
      <div className="w-full h-full bg-[#150a2f] rounded-full flex items-center justify-center border border-amber-300/40">
        <span className="text-xs font-black text-[#ffd166] tracking-tighter italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VS</span>
      </div>
    </div>
    {/* Arena Tag */}
    <span className="text-[10px] font-black text-amber-300 tracking-wider mt-1 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-0.5">
      <Flame size={10} className="text-orange-400 animate-bounce" />
      <span>DRAGON DUEL</span>
    </span>
  </div>
);

// =========================================================================
// 2. SCIENCE LAB DUEL: 2 Scientists Fighting (Hero Scientist vs Rival Scientist)
// =========================================================================

const HeroScientistSVG = () => (
  <motion.div
    animate={{ y: [-2, 2, -2], x: [0, 2, 0] }}
    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.7)] overflow-visible">
      <defs>
        <linearGradient id="sciHeroCoat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="sciHeroBeam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#00f0ff" />
          <stop offset="85%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sciHeroPotion" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#55efc4" />
          <stop offset="100%" stopColor="#00b894" />
        </linearGradient>
      </defs>

      {/* Orbiting Quantum Electron */}
      <ellipse cx="50" cy="50" rx="35" ry="14" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" transform="rotate(-25 50 50)" />
      <circle cx="20" cy="38" r="2.2" fill="#00f0ff" className="animate-ping" />

      {/* Hair & Head */}
      <path d="M 40 26 Q 34 14 46 10 Q 56 12 58 22 Q 62 26 56 32 Z" fill="#1e293b" />
      <path d="M 46 12 Q 52 14 50 20 Z" fill="#00f0ff" opacity="0.8" />
      {/* Face */}
      <circle cx="48" cy="28" r="10" fill="#fde047" opacity="0.9" />

      {/* High-Tech Glowing Cyan Goggles */}
      <rect x="42" y="24" width="16" height="7" rx="3.5" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
      <circle cx="46" cy="27.5" r="2.5" fill="#00f0ff" />
      <circle cx="54" cy="27.5" r="2.5" fill="#00f0ff" />
      <circle cx="47" cy="26.5" r="0.8" fill="#ffffff" />
      <circle cx="55" cy="26.5" r="0.8" fill="#ffffff" />
      {/* Goggle strap */}
      <line x1="38" y1="27" x2="42" y2="27" stroke="#00f0ff" strokeWidth="1.2" />

      {/* Smiling Hero Mouth */}
      <path d="M 48 34 Q 52 37 54 34" stroke="#b45309" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Body & Lab Coat */}
      {/* Tie & Inner Shirt */}
      <polygon points="48,38 52,38 50,48" fill="#0284c7" />
      <path d="M 40 38 L 32 82 L 44 84 L 48 54 L 54 84 L 66 82 L 58 38 Z" fill="url(#sciHeroCoat)" stroke="#94a3b8" strokeWidth="1" />
      {/* Coat Collar & ID Badge */}
      <path d="M 42 38 L 46 48 L 48 38 M 56 38 L 52 48 L 50 38" stroke="#0284c7" strokeWidth="1" fill="none" />
      <rect x="54" y="44" width="5" height="7" rx="1" fill="#38bdf8" />

      {/* Legs & Shoes */}
      <line x1="42" y1="84" x2="40" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="56" y1="84" x2="58" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="38" cy="99" rx="5" ry="2" fill="#0f172a" />
      <ellipse cx="60" cy="99" rx="5" ry="2" fill="#0f172a" />

      {/* Left Hand holding Bubbling Chemical Flask */}
      <path d="M 38 48 L 22 56 L 22 66" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      {/* Erlenmeyer Flask */}
      <polygon points="20,62 14,76 28,76 22,62" fill="#e2e8f0" stroke="#00f0ff" strokeWidth="1" opacity="0.9" />
      <polygon points="19,68 15,75 27,75 23,68" fill="url(#sciHeroPotion)" />
      <circle cx="21" cy="71" r="1.5" fill="#ffffff" />
      <circle cx="20" cy="58" r="1.5" fill="#55efc4" className="animate-ping" />

      {/* Right Hand aiming Quantum Ray Blaster forward */}
      <path d="M 54 48 L 74 46 L 82 48" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      {/* Tesla Ray Tool */}
      <rect x="76" y="43" width="12" height="7" rx="2" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.2" />
      <circle cx="86" cy="46.5" r="3.5" fill="#00f0ff" />
      <line x1="88" y1="46.5" x2="94" y2="46.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Concentrated Quantum Laser Beam (shooting right) */}
      <motion.g
        animate={{ scaleX: [0.9, 1.3, 0.95], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 0.25, ease: "easeInOut" }}
        style={{ transformOrigin: "94px 46.5px" }}
      >
        <line x1="94" y1="46.5" x2="124" y2="46.5" stroke="url(#sciHeroBeam)" strokeWidth="5" strokeLinecap="round" />
        <line x1="94" y1="46.5" x2="124" y2="46.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {/* Electric Sparks */}
        <path d="M 102 43 L 105 40 L 107 45 L 112 42" stroke="#00f0ff" strokeWidth="1.2" fill="none" />
        <circle cx="120" cy="42" r="2.2" fill="#38bdf8" className="animate-ping" />
      </motion.g>
    </svg>
  </motion.div>
);

const RivalScientistSVG = () => (
  <motion.div
    animate={{ y: [2, -2, 2], x: [0, -2, 0] }}
    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_12px_rgba(236,72,153,0.7)] overflow-visible">
      <defs>
        <linearGradient id="sciRivalCoat" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="sciRivalBeam" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#ec4899" />
          <stop offset="85%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sciRivalPotion" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Orbiting Dark Energy Ring */}
      <ellipse cx="70" cy="50" rx="35" ry="14" fill="none" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" transform="rotate(25 70 50)" />
      <circle cx="100" cy="38" r="2.2" fill="#ec4899" className="animate-ping" />

      {/* Wild Mad Scientist Hair & Head */}
      <path d="M 80 26 Q 86 12 74 10 Q 64 12 62 22 Q 58 26 64 32 Z" fill="#475569" />
      <path d="M 74 12 Q 68 14 70 20 Z" fill="#ec4899" opacity="0.8" />
      {/* Face */}
      <circle cx="72" cy="28" r="10" fill="#fde047" opacity="0.9" />

      {/* Cybernetic Glowing Magenta Visor */}
      <polygon points="62,24 78,22 80,29 64,31" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
      <line x1="64" y1="27" x2="78" y2="25" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="26" x2="74" y2="25" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

      {/* Smirking Rival Mouth */}
      <path d="M 72 34 Q 68 37 66 34" stroke="#9f1239" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Body & Dark Lab Coat */}
      <polygon points="72,38 68,38 70,48" fill="#9333ea" />
      <path d="M 80 38 L 88 82 L 76 84 L 72 54 L 66 84 L 54 82 L 62 38 Z" fill="url(#sciRivalCoat)" stroke="#a855f7" strokeWidth="1" />
      <path d="M 78 38 L 74 48 L 72 38 M 64 38 L 68 48 L 70 38" stroke="#ec4899" strokeWidth="1" fill="none" />

      {/* Legs & Shoes */}
      <line x1="78" y1="84" x2="80" y2="98" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <line x1="64" y1="84" x2="62" y2="98" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="82" cy="99" rx="5" ry="2" fill="#020617" />
      <ellipse cx="60" cy="99" rx="5" ry="2" fill="#020617" />

      {/* Right Hand holding Bubbling Chemical Test Tube */}
      <path d="M 82 48 L 98 56 L 98 66" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
      {/* Test Tube */}
      <rect x="95" y="60" width="7" height="18" rx="3.5" fill="#e2e8f0" stroke="#ec4899" strokeWidth="1" opacity="0.9" />
      <rect x="96" y="68" width="5" height="9" rx="2.5" fill="url(#sciRivalPotion)" />
      <circle cx="98.5" cy="72" r="1.2" fill="#ffffff" />
      <circle cx="98" cy="56" r="1.5" fill="#ec4899" className="animate-ping" />

      {/* Left Hand aiming Plasma Blaster forward */}
      <path d="M 66 48 L 46 46 L 38 48" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
      {/* Plasma Cannon Tool */}
      <rect x="32" y="43" width="12" height="7" rx="2" fill="#0f172a" stroke="#ec4899" strokeWidth="1.2" />
      <circle cx="34" cy="46.5" r="3.5" fill="#ec4899" />
      <line x1="32" y1="46.5" x2="26" y2="46.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Concentrated Plasma Beam (shooting left) */}
      <motion.g
        animate={{ scaleX: [0.9, 1.3, 0.95], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 0.25, ease: "easeInOut" }}
        style={{ transformOrigin: "26px 46.5px" }}
      >
        <line x1="26" y1="46.5" x2="-4" y2="46.5" stroke="url(#sciRivalBeam)" strokeWidth="5" strokeLinecap="round" />
        <line x1="26" y1="46.5" x2="-4" y2="46.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {/* Plasma Jagged Lightning */}
        <path d="M 18 43 L 15 40 L 13 45 L 8 42" stroke="#ec4899" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="42" r="2.2" fill="#a855f7" className="animate-ping" />
      </motion.g>
    </svg>
  </motion.div>
);

// Center Clash for Science Lab
const ScienceClashCenter = () => (
  <div className="relative flex flex-col items-center justify-center mx-1 z-20 shrink-0">
    {/* Clashing Quantum Singularity Core */}
    <motion.div
      animate={{ scale: [1, 1.4, 1], rotate: [0, -180, -360] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
      className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#d946ef] to-[#38bdf8] opacity-60 blur-md pointer-events-none"
    />
    {/* Central Reactor Ring */}
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00f0ff] via-[#ec4899] to-[#38bdf8] p-[2px] shadow-[0_0_18px_rgba(0,240,255,0.9)] animate-pulse relative z-10">
      <div className="w-full h-full bg-[#0a0f24] rounded-full flex items-center justify-center border border-cyan-400/40">
        <span className="text-xs font-black text-[#00f0ff] tracking-tighter italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VS</span>
      </div>
    </div>
    {/* Arena Tag */}
    <span className="text-[10px] font-black text-cyan-300 tracking-wider mt-1 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-0.5">
      <Zap size={10} className="text-cyan-400 animate-bounce" />
      <span>SCIENCE DUEL</span>
    </span>
  </div>
);

// =========================================================================
// 3. SOCIAL PROOF DUEL: 2 Gold Medalists Fighting (2 Champions with Medals)
// =========================================================================

const HeroGoldMedalistSVG = () => (
  <motion.div
    animate={{ y: [-2, 2, -2], x: [0, 3, 0] }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_14px_rgba(255,215,0,0.8)] overflow-visible">
      <defs>
        <linearGradient id="goldMedalShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="heroFencerSuit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="heroSwordBlade" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Champion Star Glow */}
      <circle cx="50" cy="50" r="40" fill="#ffd700" opacity="0.12" />

      {/* Champion Laurel / Headband & Hair */}
      <path d="M 40 24 Q 36 12 48 10 Q 60 12 60 22 Q 62 26 56 30 Z" fill="#312e81" />
      {/* Golden Headband / Laurel */}
      <path d="M 42 22 Q 52 18 60 22" stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="51,18 49,22 53,22" fill="#ffd700" />

      {/* Confident Hero Face */}
      <circle cx="50" cy="27" r="9.5" fill="#fde047" opacity="0.9" />
      <circle cx="53" cy="26" r="1.5" fill="#1e1b4b" />
      <path d="M 50 32 Q 53 35 56 32" stroke="#b45309" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Champion Uniform (Navy / Sapphire with Gold Stripes) */}
      <path d="M 42 37 L 34 82 L 46 84 L 50 54 L 56 84 L 68 82 L 60 37 Z" fill="url(#heroFencerSuit)" stroke="#ffd700" strokeWidth="1" />
      {/* Gold Chevron Stripes */}
      <path d="M 46 54 L 51 60 L 56 54" stroke="#ffd700" strokeWidth="1.5" fill="none" />

      {/* 🥇 PROMINENT GOLD MEDAL ON STRIPED RIBBON */}
      {/* Ribbon */}
      <path d="M 44 36 L 50 48 L 56 36" stroke="#3b82f6" strokeWidth="3" fill="none" />
      <path d="M 44 36 L 50 48 L 56 36" stroke="#ffd700" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      {/* Gold Medal Disc */}
      <motion.g
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 53px" }}
      >
        <circle cx="50" cy="53" r="7.5" fill="url(#goldMedalShine)" stroke="#b45309" strokeWidth="0.8" />
        <circle cx="50" cy="53" r="5.5" fill="none" stroke="#fffbeb" strokeWidth="0.6" />
        {/* Star / "1" on Medal */}
        <polygon points="50,48.5 51.5,52 55,52 52,54 53,57.5 50,55.5 47,57.5 48,54 45,52 48.5,52" fill="#b45309" />
        {/* Shimmer Sparkle */}
        <circle cx="48" cy="50.5" r="1" fill="#ffffff" />
      </motion.g>

      {/* Legs & Athletic Champion Shoes */}
      <line x1="44" y1="84" x2="38" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="84" x2="64" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="36" cy="99" rx="5" ry="2" fill="#ffd700" />
      <ellipse cx="66" cy="99" rx="5" ry="2" fill="#ffd700" />

      {/* Left Arm in Athletic Balance Pose */}
      <path d="M 40 44 L 26 48 L 24 58" stroke="#1e40af" strokeWidth="3.5" strokeLinecap="round" />

      {/* Right Arm Wielding Golden Champion Rapier / Saber */}
      <path d="M 56 44 L 76 42 L 84 44" stroke="#1e40af" strokeWidth="3.5" strokeLinecap="round" />
      {/* Sword Guard & Grip */}
      <ellipse cx="84" cy="44" rx="3" ry="5" fill="#ffd700" stroke="#b45309" strokeWidth="1" />
      {/* Gleaming Golden Blade (thrusting right) */}
      <line x1="84" y1="44" x2="122" y2="44" stroke="url(#heroSwordBlade)" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="86" y1="44" x2="120" y2="44" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Blade Tip Sparkle */}
      <polygon points="122,44 117,41 119,44 117,47" fill="#ffffff" />
      <circle cx="122" cy="44" r="2.5" fill="#ffd700" className="animate-ping" />
      <polygon points="112,38 114,40 112,42 110,40" fill="#ffd700" />
    </svg>
  </motion.div>
);

const RivalGoldMedalistSVG = () => (
  <motion.div
    animate={{ y: [2, -2, 2], x: [0, -3, 0] }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none"
  >
    <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-[0_0_14px_rgba(255,215,0,0.8)] overflow-visible">
      <defs>
        <linearGradient id="goldMedalShineRival" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="rivalFencerSuit" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        <linearGradient id="rivalSwordBlade" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Champion Star Glow */}
      <circle cx="70" cy="50" r="40" fill="#ffd700" opacity="0.12" />

      {/* Rival Champion Headband & Hair */}
      <path d="M 80 24 Q 84 12 72 10 Q 60 12 60 22 Q 58 26 64 30 Z" fill="#18181b" />
      {/* Golden Headband */}
      <path d="M 78 22 Q 68 18 60 22" stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="69,18 71,22 67,22" fill="#ffd700" />

      {/* Intense Rival Face */}
      <circle cx="70" cy="27" r="9.5" fill="#fde047" opacity="0.9" />
      <circle cx="67" cy="26" r="1.5" fill="#450a0a" />
      <path d="M 70 32 Q 67 35 64 32" stroke="#991b1b" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Rival Uniform (Crimson / Obsidian with Gold Trim) */}
      <path d="M 78 37 L 86 82 L 74 84 L 70 54 L 64 84 L 52 82 L 60 37 Z" fill="url(#rivalFencerSuit)" stroke="#ffd700" strokeWidth="1" />
      {/* Gold Chevron Stripes */}
      <path d="M 74 54 L 69 60 L 64 54" stroke="#ffd700" strokeWidth="1.5" fill="none" />

      {/* 🥇 PROMINENT GOLD MEDAL ON STRIPED RIBBON */}
      {/* Ribbon */}
      <path d="M 76 36 L 70 48 L 64 36" stroke="#ef4444" strokeWidth="3" fill="none" />
      <path d="M 76 36 L 70 48 L 64 36" stroke="#ffd700" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      {/* Gold Medal Disc */}
      <motion.g
        animate={{ rotate: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ transformOrigin: "70px 53px" }}
      >
        <circle cx="70" cy="53" r="7.5" fill="url(#goldMedalShineRival)" stroke="#c2410c" strokeWidth="0.8" />
        <circle cx="70" cy="53" r="5.5" fill="none" stroke="#fffbeb" strokeWidth="0.6" />
        {/* Star / "1" on Medal */}
        <polygon points="70,48.5 71.5,52 75,52 72,54 73,57.5 70,55.5 67,57.5 68,54 65,52 68.5,52" fill="#c2410c" />
        {/* Shimmer Sparkle */}
        <circle cx="72" cy="50.5" r="1" fill="#ffffff" />
      </motion.g>

      {/* Legs & Athletic Shoes */}
      <line x1="76" y1="84" x2="82" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="84" x2="56" y2="98" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="84" cy="99" rx="5" ry="2" fill="#ffd700" />
      <ellipse cx="54" cy="99" rx="5" ry="2" fill="#ffd700" />

      {/* Right Arm in Athletic Balance Pose */}
      <path d="M 80 44 L 94 48 L 96 58" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" />

      {/* Left Arm Wielding Golden Champion Saber */}
      <path d="M 64 44 L 44 42 L 36 44" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" />
      {/* Sword Guard & Grip */}
      <ellipse cx="36" cy="44" rx="3" ry="5" fill="#ffd700" stroke="#c2410c" strokeWidth="1" />
      {/* Gleaming Golden Blade (thrusting left) */}
      <line x1="36" y1="44" x2="-2" y2="44" stroke="url(#rivalSwordBlade)" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="34" y1="44" x2="0" y2="44" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Blade Tip Sparkle */}
      <polygon points="-2,44 3,41 1,44 3,47" fill="#ffffff" />
      <circle cx="-2" cy="44" r="2.5" fill="#ffd700" className="animate-ping" />
      <polygon points="8,38 6,40 8,42 10,40" fill="#ffd700" />
    </svg>
  </motion.div>
);

// Center Clash for Gold Medalists
const GoldMedalistClashCenter = () => (
  <div className="relative flex flex-col items-center justify-center mx-1 z-20 shrink-0">
    {/* Clashing Golden Starburst Core */}
    <motion.div
      animate={{ scale: [1, 1.45, 1], rotate: [0, 90, 180, 270, 360] }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-[#ffd700] via-[#fbbf24] to-[#f59e0b] opacity-70 blur-md pointer-events-none"
    />
    {/* Clashing Blades Star */}
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f59e0b] to-[#fbbf24] p-[2px] shadow-[0_0_20px_rgba(255,215,0,0.95)] animate-pulse relative z-10">
      <div className="w-full h-full bg-[#1e1338] rounded-full flex items-center justify-center border border-amber-300">
        <span className="text-xs font-black text-[#ffd700] tracking-tighter italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VS</span>
      </div>
    </div>
    {/* Arena Tag */}
    <span className="text-[10px] font-black text-amber-200 tracking-wider mt-1 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-0.5">
      <Award size={10} className="text-amber-400 animate-bounce" />
      <span>MEDALISTS DUEL</span>
    </span>
  </div>
);

interface ShadowArenaDuelStageProps {
  theme?: ShadowArenaTheme;
  playerName?: string;
  opponentName?: string;
  className?: string;
  isCompact?: boolean;
}

export default function ShadowArenaDuelStage({
  theme = "dragon",
  playerName,
  opponentName,
  className = "",
  isCompact = false,
}: ShadowArenaDuelStageProps) {
  const { t } = useTranslation();
  const activeTheme: ShadowArenaTheme = theme;

  // Theme-specific Stage Styling
  const stageThemeConfig = {
    dragon: {
      title: t('dragon_arena_title', 'DRAGON SHADOW ARENA'),
      subtitle: t('dragon_arena_desc', '2 Dragons Clashing • Answer Faster • Unleash Fire Breath'),
      tagBg: 'bg-[#ff4757]/20 text-[#ffd166] border-[#ff4757]/40',
      bgGradient: 'from-[#140628] via-[#240b36] to-[#0f051d]',
      borderColor: 'border-[#ff4757]/40',
      shadow: 'shadow-[0_8px_24px_rgba(255,71,87,0.25)]',
      playerBadgeBg: 'bg-gradient-to-r from-[#00b894] to-[#00f0ff] text-slate-950 border-[#00f0ff]',
      rivalBadgeBg: 'bg-gradient-to-r from-[#ff4757] to-[#ffa502] text-white border-[#ffd166]',
      gridColor: 'rgba(255,71,87,0.08)',
      icon: '🐉',
    },
    science: {
      title: t('science_arena_title', 'QUANTUM LAB ARENA'),
      subtitle: t('science_arena_desc', '2 Scientists Clashing • Answer Faster • Charge Plasma Beam'),
      tagBg: 'bg-[#00f0ff]/20 text-[#38bdf8] border-[#00f0ff]/40',
      bgGradient: 'from-[#07132a] via-[#0f224a] to-[#090d24]',
      borderColor: 'border-[#00f0ff]/40',
      shadow: 'shadow-[0_8px_24px_rgba(0,240,255,0.25)]',
      playerBadgeBg: 'bg-gradient-to-r from-[#0284c7] to-[#00f0ff] text-white border-[#38bdf8]',
      rivalBadgeBg: 'bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white border-[#f472b6]',
      gridColor: 'rgba(0,240,255,0.08)',
      icon: '🧪',
    },
    social: {
      title: t('social_arena_title', 'CHAMPIONS MEDAL ARENA'),
      subtitle: t('social_arena_desc', '2 Gold Medalists Clashing • Answer Faster • Claim Glory'),
      tagBg: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/40',
      bgGradient: 'from-[#1a1138] via-[#2c1a59] to-[#120a28]',
      borderColor: 'border-[#ffd700]/40',
      shadow: 'shadow-[0_8px_24px_rgba(255,215,0,0.25)]',
      playerBadgeBg: 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white border-[#ffd700]',
      rivalBadgeBg: 'bg-gradient-to-r from-[#b91c1c] to-[#ea580c] text-white border-[#ffd700]',
      gridColor: 'rgba(255,215,0,0.08)',
      icon: '🥇',
    },
  }[activeTheme];

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* MAIN BATTLE STAGE BOX */}
      <div
        className={`w-full bg-gradient-to-b ${stageThemeConfig.bgGradient} border-2 ${stageThemeConfig.borderColor} rounded-2xl p-2.5 relative ${stageThemeConfig.shadow} overflow-hidden transition-all duration-500`}
      >
        {/* Dynamic Background Battle Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, ${stageThemeConfig.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${stageThemeConfig.gridColor} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        {/* Floating Sparks / Atmosphere Particles */}
        <div className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-white/40 animate-ping pointer-events-none" />
        <div className="absolute bottom-4 right-10 w-2 h-2 rounded-full bg-amber-300/40 animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-cyan-300/50 animate-ping pointer-events-none" />

        {/* FIGHTER DUEL STAGE */}
        <div className="relative flex items-center justify-between px-2 sm:px-4 py-1">
          
          {/* PLAYER 1 (LEFT FIGHTER) */}
          <div className="flex flex-col items-center z-10">
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm mb-1 ${stageThemeConfig.playerBadgeBg}`}
            >
              {playerName || t('you', 'YOU')}
            </span>
            <AnimatePresence mode="wait">
              {activeTheme === "dragon" && <HeroDragonSVG key="hero-dragon" />}
              {activeTheme === "science" && <HeroScientistSVG key="hero-sci" />}
              {activeTheme === "social" && <HeroGoldMedalistSVG key="hero-social" />}
            </AnimatePresence>
          </div>

          {/* CENTER VS & CLASH EFFECT */}
          <div className="flex flex-col items-center z-20">
            <AnimatePresence mode="wait">
              {activeTheme === "dragon" && <DragonClashCenter key="clash-dragon" />}
              {activeTheme === "science" && <ScienceClashCenter key="clash-sci" />}
              {activeTheme === "social" && <GoldMedalistClashCenter key="clash-social" />}
            </AnimatePresence>
          </div>

          {/* PLAYER 2 (RIGHT FIGHTER) */}
          <div className="flex flex-col items-center z-10">
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm mb-1 ${stageThemeConfig.rivalBadgeBg}`}
            >
              {opponentName || t('challenger', 'CHALLENGER')}
            </span>
            <AnimatePresence mode="wait">
              {activeTheme === "dragon" && <RivalDragonSVG key="rival-dragon" />}
              {activeTheme === "science" && <RivalScientistSVG key="rival-sci" />}
              {activeTheme === "social" && <RivalGoldMedalistSVG key="rival-social" />}
            </AnimatePresence>
          </div>

        </div>

        {/* SUBTITLE & ACTION BANNER */}
        {!isCompact && (
          <p className="text-center text-[10px] font-bold text-slate-200 mt-1 tracking-tight drop-shadow-sm">
            {stageThemeConfig.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
