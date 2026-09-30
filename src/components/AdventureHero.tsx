import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Trophy, Zap, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface AdventureThemeConfig {
  type: "dragon" | "science" | "social" | "space" | "ocean" | "history";
  worldTitleKey: string;
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
  ctaTextKey: string;
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
    worldTitleKey: "dragon_valley",
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
    ctaTextKey: "continue_adventure",
    ctaText: "CONTINUE ADVENTURE →",
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    accentBorderColor: "border-amber-400",
    accentTextColor: "text-amber-300",
    bgDecorations: ["☁️", "🏔️", "🏰", "🔥"],
    pathColor: "#fbbf24",
  },
  science: {
    type: "science",
    worldTitleKey: "science_lab",
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
    ctaTextKey: "enter_lab",
    ctaText: "ENTER LAB →",
    bgGradient: "from-indigo-800 via-purple-900 to-slate-950",
    accentBorderColor: "border-cyan-400",
    accentTextColor: "text-cyan-300",
    bgDecorations: ["⚡", "⚛️", "🧪", "✨"],
    pathColor: "#38bdf8",
  },
  social: {
    type: "social",
    worldTitleKey: "champions_arena",
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
    ctaTextKey: "take_challenge",
    ctaText: "TAKE CHALLENGE →",
    bgGradient: "from-amber-700 via-orange-800 to-slate-950",
    accentBorderColor: "border-yellow-300",
    accentTextColor: "text-yellow-200",
    bgDecorations: ["⭐", "🏆", "🚩", "✨"],
    pathColor: "#facc15",
  },
  space: {
    type: "space",
    worldTitleKey: "galaxy_quest",
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
    ctaTextKey: "launch_rocket",
    ctaText: "LAUNCH ROCKET →",
    bgGradient: "from-slate-950 via-indigo-950 to-purple-950",
    accentBorderColor: "border-purple-400",
    accentTextColor: "text-purple-300",
    bgDecorations: ["🌌", "🪐", "✨", "☄️"],
    pathColor: "#c084fc",
  },
  ocean: {
    type: "ocean",
    worldTitleKey: "ocean_explorer",
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
    ctaTextKey: "dive_deep",
    ctaText: "DIVE DEEP →",
    bgGradient: "from-sky-800 via-cyan-900 to-slate-950",
    accentBorderColor: "border-teal-300",
    accentTextColor: "text-teal-200",
    bgDecorations: ["🫧", "🐠", "🪸", "⚓"],
    pathColor: "#2dd4bf",
  },
  history: {
    type: "history",
    worldTitleKey: "ancient_ruins",
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
    ctaTextKey: "explore_ruins",
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
  currentLocationName?: string;
  destinationName?: string;
  progressPercentage?: number;
  chaptersNeededForNext?: number;
  onCtaClick?: () => void;
  onMissionClick?: () => void;
  missionTitle?: string;
  missionProgress?: { current: number; total: number };
  missionRewardText?: string;
  missionXpReward?: number;
  missionCoinReward?: number;
  journeyData?: any;
}

export default function AdventureHero({
  themeKey = "dragon",
  xp = 1105,
  targetXp = 2500,
  currentLocationName,
  destinationName,
  progressPercentage,
  chaptersNeededForNext,
  onCtaClick,
  onMissionClick,
  missionTitle,
  missionProgress,
  missionRewardText,
  missionXpReward,
  missionCoinReward,
  journeyData,
}: AdventureHeroProps) {
  const { t } = useTranslation();
  const theme = ADVENTURE_THEMES[themeKey] || ADVENTURE_THEMES.dragon;

  const displayXpReward = missionXpReward !== undefined ? missionXpReward : 140;
  const displayCoinReward = missionCoinReward !== undefined ? missionCoinReward : 105;

  const rawStart = journeyData?.currentLocation || currentLocationName || "Egg Village";
  const rawEnd = journeyData?.nextNodeName || destinationName || "Hatchling Haven";
  const startName = rawStart === "Egg Village" ? t('egg_village', { defaultValue: "Egg Village" }) : rawStart;
  const endName = rawEnd === "Hatchling Haven" ? t('hatchling_haven', { defaultValue: "Hatchling Haven" }) : rawEnd;

  const displayMissionTitle = missionTitle || theme.missionTitle;
  const displayMissionProgress = missionProgress || theme.missionProgress;
  const activeNode = journeyData?.nodes?.find((n: any) => n.unlocked && !n.completed) || journeyData?.nodes?.[0];
  const legProgress = activeNode?.nodeProgressPercentage !== undefined
    ? Math.round(activeNode.nodeProgressPercentage)
    : (journeyData?.progressPercentage !== undefined
        ? Math.round(journeyData.progressPercentage)
        : (progressPercentage !== undefined ? progressPercentage : Math.min(100, Math.max(0, Math.round((xp / targetXp) * 100)))));
  const chaptersRemaining = journeyData?.chaptersNeededForNext !== undefined ? journeyData.chaptersNeededForNext : chaptersNeededForNext;
  const xpRemaining = Math.max(0, targetXp - xp);
  const pathD = "M 62 46 C 110 5, 215 65, 278 32";
  const pathLength = 250;
  const mascotLeftPercent = 25 + (legProgress / 100) * 54;

  return (
    <div className="w-full max-w-[430px] mx-auto flex flex-col gap-3 font-sans">
      {/* 1. IMMERSIVE ENVIRONMENT HERO CARD (DYNAMIC THEME & ANIMATED MASCOT) */}
      <div
        className={`w-full rounded-[32px] bg-gradient-to-b ${theme.bgGradient} p-3.5 border-4 ${theme.accentBorderColor} shadow-[0_12px_32px_rgba(0,0,0,0.3)] relative overflow-hidden text-white flex flex-col gap-3 select-none`}
      >
        {/* Ambient environmental particles / animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

        {/* TOP BAR: World Title & XP Pill */}
        <div className="flex items-center justify-between z-10 gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-[11px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1.5 text-white">
              {t(theme.worldTitleKey, { defaultValue: theme.worldTitle })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-white/10 backdrop-blur-md text-[10.5px] font-black text-amber-300">
            <Zap size={13} className="text-amber-400 fill-amber-400" />
            <span> {xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* LIVING ADVENTURE WORLD SCENE (Flying Mascot over path to destination) */}
        <div className="relative w-full h-[60px] z-10 flex flex-col justify-between my-1">
          <div className="absolute inset-0 flex justify-between items-end px-2 opacity-20 pointer-events-none">
            <span className="text-3xl">{theme.bgDecorations[1] || "🏔️"}</span>
            <span className="text-2xl mb-4">{theme.bgDecorations[0] || "☁️"}</span>
            <span className="text-2xl opacity-15">{theme.bgDecorations[2] || "🏰"}</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 330 70" className="w-full h-full overflow-visible">
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <path
                d={pathD}
                fill="none"
                stroke={theme.pathColor}
                strokeWidth="5"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength - (pathLength * legProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* START NODE */}
            <div className="absolute left-2 bottom-0 flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-700 flex items-center justify-center text-xs shadow-md">
                📍
              </div>
              <span className="text-[9px] font-black text-slate-200 uppercase mt-0.5 tracking-tighter bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs whitespace-nowrap">
                {startName}
              </span>
            </div>

            {/* CHARACTER MASCOT */}
            <div className="absolute inset-x-0 inset-y-0 pointer-events-none z-20">
              <div
                className="h-full flex items-center transition-all duration-1000"
                style={{ marginLeft: `calc(${mascotLeftPercent}% - 18px)` }}
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
                    {t('you', { defaultValue: "YOU" })}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* DESTINATION NODE */}
            <div className="absolute right-0 top-1 flex flex-col items-center z-10">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-10 h-10 rounded-2xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-xl shadow-lg backdrop-blur-md relative"
              >
                <span className="select-none">{journeyData?.nextNodeEmoji || theme.rewardIcon}</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              </motion.div>
              <span className="text-[9px] font-black text-amber-300 uppercase mt-0.5 tracking-tighter bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-xs whitespace-nowrap shadow-sm">
                {t(rawEnd.toLowerCase().replace(/ /g, '_'), { defaultValue: rawEnd })}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS SUPPORTING INDICATOR */}
        <div className="z-10 bg-black/30 border border-white/10 rounded-2xl p-2.5 flex flex-col gap-1 backdrop-blur-md">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-200">
            <span>{t('progress_to', { destination: endName, defaultValue: `Progress to ${endName}` })}</span>
            <span className={theme.accentTextColor}>{t('completed_label', { percent: legProgress, defaultValue: `${legProgress}% COMPLETED` })}</span>
          </div>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${legProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9.5px] font-extrabold text-slate-300 mt-0.5">
            <span>{t('unlock_label', { destination: endName, defaultValue: `${endName} Unlock` })}</span>
            <span className="text-amber-300">
              {chaptersRemaining !== undefined 
                ? (chaptersRemaining > 0 ? t('chapters_remaining_count', { count: chaptersRemaining, defaultValue: `${chaptersRemaining} chapter(s) remaining` }) : t('stage_complete', { defaultValue: "Stage Complete!" }))
                : (xpRemaining > 0 ? t('xp_remaining_count', { count: xpRemaining, defaultValue: `${xpRemaining} XP Remaining` }) : t('ready_to_unlock', { defaultValue: "Ready to Unlock!" }))}
            </span>
          </div>
        </div>

        {/* PRIMARY ACTION CTA BUTTON */}
        <button
          onClick={onCtaClick}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all border-2 border-amber-300 flex items-center justify-center gap-2 z-10"
        >
          <span>{t(theme.ctaTextKey, { defaultValue: theme.ctaText })}</span>
        </button>
      </div>

      {/* 2. TODAY'S QUEST CARD (100% MATCHING SCREENSHOT) */}
      <div className="w-full bg-white rounded-[28px] p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🎯
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black text-[#4f46e5] uppercase tracking-wider block">
                {t('todays_quest', { defaultValue: "TODAY'S QUEST" })}
              </span>
              <h4 className="text-sm font-black text-[#1c1970] leading-tight truncate mt-0.5">
                {t(displayMissionTitle.toLowerCase().replace(/ /g, '_'), { defaultValue: displayMissionTitle || "Win 7 Boss Battles" })}
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
                {t('defeat_boss_desc', { defaultValue: "Defeat 7 boss battles and earn rewards!" })}
              </p>
            </div>
          </div>

          {/* Progress Meter on Right */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-black text-[#4f46e5]">
              {displayMissionProgress.current} / {displayMissionProgress.total}
            </span>
            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
              <div
                className="h-full bg-[#4f46e5] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (displayMissionProgress.current / displayMissionProgress.total) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Rewards & CTA Button Row */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <span className="bg-[#fff0f3] text-[#f43f5e] font-black border border-rose-100 px-2.5 py-2 rounded-2xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap">
            🎁 +{displayXpReward} XP
          </span>
          <span className="bg-[#fffbeb] text-[#d97706] font-black border border-amber-100 px-2.5 py-2 rounded-2xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap">
            🪙 +{displayCoinReward} Coins
          </span>
          <button
            onClick={onMissionClick || onCtaClick}
            className="bg-[#1c1970] hover:bg-[#25218c] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider px-3 py-2 rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
          >
            <span>{t('continue_quest', { defaultValue: "CONTINUE QUEST ->" })}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
