import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Trophy, Zap, Target } from "lucide-react";

export interface AdventureThemeConfig {
  type: "dragon" | "science" | "social" | "space" | "ocean" | "history";
  worldTitle: string;
  storyText: string;
  missionTitle: string;
  missionProgress: { current: number; total: number };
  missionRewardText: string;
  currentLocationName: string;
  destinationName: string;
  rewardName: string;
  rewardIcon: string;
  characterIcon: string;
  characterName: string;
  ctaText: string;
  bgGradient: string;
  accentBorderColor: string;
  accentTextColor: string;
  bgDecorations: string[];
  pathColor: string;
}

export const ADVENTURE_THEMES: Record<string, AdventureThemeConfig> = {
  dragon: {
    type: "dragon",
    worldTitle: "🐉 DRAGON VALLEY",
    storyText: "The dragon needs your help finding its lost egg in the mystic valley!",
    missionTitle: "Complete today's learning quest to cross Dragon Valley",
    missionProgress: { current: 3, total: 5 },
    missionRewardText: "+50 XP & Dragon Scale",
    currentLocationName: "Forest Kingdom",
    destinationName: "Dragon Cave",
    rewardName: "Dragon Egg",
    rewardIcon: "🥚",
    characterIcon: "🐉",
    characterName: "Flame Dragon",
    ctaText: "CONTINUE ADVENTURE →",
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    accentBorderColor: "border-amber-400",
    accentTextColor: "text-amber-300",
    bgDecorations: ["☁️", "🏔️", "🏰", "🔥"],
    pathColor: "#fbbf24",
  },
  science: {
    type: "science",
    worldTitle: "🧪 SCIENCE LAB",
    storyText: "Help Professor Owl finish Experiment #04 to synthesize the Quantum Catalyst!",
    missionTitle: "Complete 4 science challenges to ignite the lab furnace",
    missionProgress: { current: 2, total: 4 },
    missionRewardText: "+60 XP & Quantum Core",
    currentLocationName: "Research Bench",
    destinationName: "Quantum Lab",
    rewardName: "Advanced Lab",
    rewardIcon: "🔬",
    characterIcon: "🦉",
    characterName: "Scientist Owl",
    ctaText: "ENTER LAB →",
    bgGradient: "from-indigo-800 via-purple-900 to-slate-950",
    accentBorderColor: "border-cyan-400",
    accentTextColor: "text-cyan-300",
    bgDecorations: ["⚡", "⚛️", "🧪", "✨"],
    pathColor: "#38bdf8",
  },
  social: {
    type: "social",
    worldTitle: "🏆 CHAMPION'S ARENA",
    storyText: "Step into the arena and master confidence challenges to earn the Silver Medal!",
    missionTitle: "Complete 3 daily habit challenges",
    missionProgress: { current: 1, total: 3 },
    missionRewardText: "+40 XP & Arena Star",
    currentLocationName: "Training Grounds",
    destinationName: "Victory Podium",
    rewardName: "Silver Medal",
    rewardIcon: "🥈",
    characterIcon: "🦁",
    characterName: "Champion Lion",
    ctaText: "TAKE CHALLENGE →",
    bgGradient: "from-amber-700 via-orange-800 to-slate-950",
    accentBorderColor: "border-yellow-300",
    accentTextColor: "text-yellow-200",
    bgDecorations: ["⭐", "🏆", "🚩", "✨"],
    pathColor: "#facc15",
  },
  space: {
    type: "space",
    worldTitle: "🚀 GALAXY QUEST",
    storyText: "Pilot your rover across the starlight asteroid belt toward Planet Nebula!",
    missionTitle: "Complete 5 space problems to charge thrusters",
    missionProgress: { current: 3, total: 5 },
    missionRewardText: "+75 XP & Space Crystal",
    currentLocationName: "Launch Pad",
    destinationName: "Planet Nebula",
    rewardName: "Space Station",
    rewardIcon: "🛸",
    characterIcon: "🚀",
    characterName: "Astronaut Rover",
    ctaText: "LAUNCH ROCKET →",
    bgGradient: "from-slate-950 via-indigo-950 to-purple-950",
    accentBorderColor: "border-purple-400",
    accentTextColor: "text-purple-300",
    bgDecorations: ["🌌", "🪐", "✨", "☄️"],
    pathColor: "#c084fc",
  },
  ocean: {
    type: "ocean",
    worldTitle: "🌊 OCEAN EXPLORER",
    storyText: "Dive into the coral reef trenches to locate the sunken Royal Treasure Chest!",
    missionTitle: "Complete 4 reading quests underwater",
    missionProgress: { current: 2, total: 4 },
    missionRewardText: "+50 XP & Pearl Shell",
    currentLocationName: "Shallow Reef",
    destinationName: "Coral Trench",
    rewardName: "Treasure Chest",
    rewardIcon: "🏴‍☠️",
    characterIcon: "🤿",
    characterName: "Deep Diver",
    ctaText: "DIVE DEEP →",
    bgGradient: "from-sky-800 via-cyan-900 to-slate-950",
    accentBorderColor: "border-teal-300",
    accentTextColor: "text-teal-200",
    bgDecorations: ["🫧", "🐠", "🪸", "⚓"],
    pathColor: "#2dd4bf",
  },
  history: {
    type: "history",
    worldTitle: "📜 ANCIENT RUINS",
    storyText: "Uncover forgotten scrolls in the Sunken Temple of Alexandria!",
    missionTitle: "Complete 3 history investigations",
    missionProgress: { current: 1, total: 3 },
    missionRewardText: "+45 XP & Golden Scroll",
    currentLocationName: "Desert Camp",
    destinationName: "Sunken Temple",
    rewardName: "Ancient Urn",
    rewardIcon: "🏺",
    characterIcon: "🧭",
    characterName: "Ruins Explorer",
    ctaText: "EXPLORE RUINS →",
    bgGradient: "from-amber-800 via-stone-900 to-slate-950",
    accentBorderColor: "border-amber-400",
    accentTextColor: "text-amber-300",
    bgDecorations: ["🏛️", "📜", "🏺", "⌛"],
    pathColor: "#fbbf24",
  },
};

interface AdventureHeroProps {
  themeKey?: string;
  xp?: number;
  targetXp?: number;
  currentCityName?: string;
  nextCityName?: string;
  onCtaClick?: () => void;
  onMissionClick?: () => void;
  // Overrides for dynamic backend values
  missionTitle?: string;
  missionProgress?: { current: number; total: number };
  missionRewardText?: string;
}

export default function AdventureHero({
  themeKey = "dragon",
  xp = 1105,
  targetXp = 2500,
  currentCityName,
  nextCityName,
  onCtaClick,
  onMissionClick,
  missionTitle,
  missionProgress,
  missionRewardText,
}: AdventureHeroProps) {
  const theme = ADVENTURE_THEMES[themeKey] || ADVENTURE_THEMES.dragon;

  const startName = currentCityName || theme.currentLocationName;
  const endName = nextCityName || theme.destinationName;

  const displayMissionTitle = missionTitle || theme.missionTitle;
  const displayMissionProgress = missionProgress || theme.missionProgress;
  const displayMissionRewardText = missionRewardText || theme.missionRewardText;

  // Calculate percentage along the leg (0% to 100%)
  const legProgress = Math.min(100, Math.max(0, Math.round((xp / targetXp) * 100)));
  const xpRemaining = Math.max(0, targetXp - xp);

  // SVG curved path calculation
  const pathD = "M 20 40 C 90 10, 230 70, 310 35";

  return (
    <div className="w-full max-w-[430px] mx-auto flex flex-col gap-3 font-sans">
      {/* 1. IMMERSIVE ENVIRONMENT CARD */}
      <div
        className={`w-full rounded-[32px] bg-gradient-to-b ${theme.bgGradient} p-5 border-4 ${theme.accentBorderColor} shadow-[0_12px_32px_rgba(0,0,0,0.3)] relative overflow-hidden text-white flex flex-col gap-4 select-none`}
      >
        {/* Ambient environmental particles / animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Drifting Clouds / Stars */}
          <motion.div
            animate={{ x: [-60, 380] }}
            transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
            className="absolute top-2 left-0 text-2xl opacity-30"
          >
            {theme.bgDecorations[0] || "☁️"}
          </motion.div>
          <motion.div
            animate={{ x: [380, -60] }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
            className="absolute top-8 left-0 text-xl opacity-20"
          >
            {theme.bgDecorations[0] || "☁️"}
          </motion.div>

          {/* Floating magical particles */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 130, x: 40 + i * 85, opacity: 0, scale: 0.5 }}
              animate={{ y: [130, 20], opacity: [0, 0.7, 0.7, 0], scale: [0.5, 1.1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3.5 + i, delay: i * 0.7 }}
              className="absolute text-sm"
            >
              {theme.bgDecorations[3] || "✨"}
            </motion.div>
          ))}
        </div>

        {/* TOP BAR: World Title & Supporting XP Pill */}
        <div className="flex items-center justify-between z-10 gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-[11px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1.5">
              {theme.worldTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-white/10 backdrop-blur-md text-[10.5px] font-black text-amber-300">
            <Zap size={13} className="text-amber-400 fill-amber-400" />
            <span>🔥 {xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* STORY CALLOUT BANNER */}
        <div className="z-10 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-2.5 shadow-inner flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base shrink-0 border border-white/20 shadow-xs">
            📜
          </div>
          <p className="text-xs font-bold text-slate-100 leading-snug tracking-tight">
            "{theme.storyText}"
          </p>
        </div>

        {/* LIVING ADVENTURE WORLD SCENE (Dragon flying over path to destination) */}
        <div className="relative w-full h-32 my-1 z-10 flex flex-col justify-between">
          {/* Background Scenery Elements */}
          <div className="absolute inset-0 flex justify-between items-end px-2 opacity-40 pointer-events-none">
            <span className="text-4xl">{theme.bgDecorations[1] || "🏔️"}</span>
            <span className="text-3xl mb-4">{theme.bgDecorations[0] || "☁️"}</span>
            <span className="text-4xl">{theme.bgDecorations[2] || "🏰"}</span>
          </div>

          {/* CURVED ORGANIC ADVENTURE PATH SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 330 70" className="w-full h-full overflow-visible">
              {/* Background Path Line */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              {/* Progress Path Line */}
              <path
                d={pathD}
                fill="none"
                stroke={theme.pathColor}
                strokeWidth="5"
                strokeDasharray="330"
                strokeDashoffset={330 - (330 * legProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* START NODE: Current Location */}
            <div className="absolute left-2 bottom-3 flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-700 flex items-center justify-center text-xs shadow-md">
                📍
              </div>
              <span className="text-[9px] font-black text-slate-200 uppercase mt-0.5 tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {startName}
              </span>
            </div>

            {/* CHARACTER: Flying / Floating Mascot IN THE WORLD */}
            <div className="absolute inset-x-6 inset-y-0 pointer-events-none z-20">
              <div
                className="h-full flex items-center transition-all duration-1000"
                style={{ marginLeft: `calc(${Math.min(82, Math.max(5, legProgress))}% - 20px)` }}
              >
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="text-4xl filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)] select-none">
                    {theme.characterIcon}
                  </div>
                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full uppercase shadow-md -mt-1 tracking-wider border border-amber-300">
                    YOU
                  </span>
                </motion.div>
              </div>
            </div>

            {/* DESTINATION NODE: Target Reward Item */}
            <div className="absolute right-2 top-2 flex flex-col items-center z-10">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-10 h-10 rounded-2xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-xl shadow-lg backdrop-blur-md relative"
              >
                <span className="select-none">{theme.rewardIcon}</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              </motion.div>
              <span className="text-[9px] font-black text-amber-300 uppercase mt-0.5 tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {theme.rewardName}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS SUPPORTING INDICATOR */}
        <div className="z-10 bg-black/30 border border-white/10 rounded-2xl p-2.5 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-200">
            <span>Progress to {endName}</span>
            <span className={theme.accentTextColor}>{legProgress}% Completed</span>
          </div>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${legProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9.5px] font-extrabold text-slate-300 mt-0.5">
            <span>{theme.rewardIcon} {theme.rewardName} Unlock</span>
            <span className="text-amber-300">{xpRemaining > 0 ? `${xpRemaining} XP Remaining` : "Ready to Unlock!"}</span>
          </div>
        </div>

        {/* PRIMARY ACTION CTA BUTTON */}
        <button
          onClick={onCtaClick}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all border-2 border-amber-300 flex items-center justify-center gap-2 z-10"
        >
          <span>{theme.ctaText}</span>
        </button>
      </div>

      {/* 2. TODAY'S QUEST CARD (Clear Mission Hierarchy) */}
      <div className="w-full bg-white rounded-3xl p-4 border-2 border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                TODAY'S QUEST
              </span>
              <h4 className="text-xs font-black text-slate-900 mt-0.5 leading-snug">
                {displayMissionTitle}
              </h4>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase gap-1">
              <span className="whitespace-nowrap truncate">Mission Progress</span>
              <span className="text-indigo-600 font-extrabold whitespace-nowrap">
                {displayMissionProgress.current} / {displayMissionProgress.total}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(displayMissionProgress.current / displayMissionProgress.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9.5px] sm:text-[10.5px] font-black px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl shrink-0 whitespace-nowrap">
            <span>🎁 {displayMissionRewardText}</span>
          </div>
        </div>

        <button
          onClick={onMissionClick || onCtaClick}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>CONTINUE QUEST →</span>
        </button>
      </div>
    </div>
  );
}
