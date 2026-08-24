import React, { useState } from "react";
import { motion } from "framer-motion";
import { WORLD_THEMES, MapWorldThemeConfig, MapStageConfig } from "./AdventureTheme";
import LocationModalSheet from "./LocationModalSheet";
import { Check, Lock, Star, Play, Sparkles, BookOpen } from "lucide-react";

interface MapWorldProps {
  themeKey?: "dragon" | "science" | "reading" | "space" | "social";
  xp?: number;
  userLevel?: number;
  companionEmoji?: string;
  onEnterStage: (stage: MapStageConfig) => void;
  nodes?: any[];
  progressPercentage?: number;
}

// Theme-specific visual config
const THEME_VISUALS: Record<string, {
  bg: string;
  accentFrom: string;
  accentTo: string;
  pathColor: string;
  completedIcon: string;
  currentIcon: string;
  lockedIcon: string;
}> = {
  dragon: {
    bg: "from-[#e8f4fd] via-[#f0f7ff] to-[#e6f0fa]",
    accentFrom: "#141779",
    accentTo: "#006a62",
    pathColor: "#141779",
    completedIcon: "🐉",
    currentIcon: "⚡",
    lockedIcon: "🔒",
  },
  science: {
    bg: "from-[#e8f9f7] via-[#f0fffe] to-[#eaf5f4]",
    accentFrom: "#006a62",
    accentTo: "#0d9488",
    pathColor: "#006a62",
    completedIcon: "🔬",
    currentIcon: "⚗️",
    lockedIcon: "🔒",
  },
  space: {
    bg: "from-[#1a1a3e] via-[#16213e] to-[#0f0c29]",
    accentFrom: "#7c3aed",
    accentTo: "#06b6d4",
    pathColor: "#7c3aed",
    completedIcon: "🚀",
    currentIcon: "🌟",
    lockedIcon: "🔒",
  },
  social: {
    bg: "from-[#fef3c7] via-[#fefce8] to-[#fef9ee]",
    accentFrom: "#d97706",
    accentTo: "#f59e0b",
    pathColor: "#d97706",
    completedIcon: "🏆",
    currentIcon: "⚡",
    lockedIcon: "🔒",
  },
};

export default function MapWorld({
  themeKey = "dragon",
  xp = 1105,
  userLevel = 7,
  companionEmoji,
  onEnterStage,
  nodes,
  progressPercentage = 0
}: MapWorldProps) {
  const theme: MapWorldThemeConfig = WORLD_THEMES[themeKey] || WORLD_THEMES.dragon;
  const tv = THEME_VISUALS[themeKey] || THEME_VISUALS.dragon;
  const isSpaceDark = themeKey === "space";
  const [selectedStage, setSelectedStage] = useState<MapStageConfig | null>(null);

  // Build stage list from nodes or theme defaults
  const stages: MapStageConfig[] = nodes && nodes.length > 0
    ? nodes.map((n: any, idx: number) => {
        const xpR = n.xpReward || Math.max(100, (n.requiredChapters || 0) * 50);
        const coinR = n.coinReward || Math.max(50, (n.requiredChapters || 0) * 25);
        const missionXp = Math.max(50, Math.round(xpR / 2));
        const biomes: Array<"forest" | "cave" | "volcano" | "castle"> = ["forest", "cave", "volcano", "castle"];
        return {
          id: `node-${idx}`,
          stageNumber: idx + 1,
          name: n.name,
          subtitle: `Required Chapters: ${n.requiredChapters}`,
          emoji: n.emoji || "⭐",
          storyQuote: `Complete chapter learning quests to unlock ${n.name}! (${n.requiredPercentage}% Journey Completion required)`,
          description: `Unlocks at ${n.requiredPercentage}% tier completion (${n.requiredChapters} chapters)`,
          questsCount: n.requiredChapters || 0,
          lessonsCount: Math.ceil((n.requiredChapters || 0) / 2),
          xpReward: xpR,
          coinReward: coinR,
          unlocked: Boolean(n.unlocked),
          itemIcon: n.emoji || "⭐",
          itemReward: `${n.requiredChapters} Chapters`,
          x: 50,
          y: Math.max(10, 90 - idx * 20),
          biomeType: biomes[idx % biomes.length],
          missions: [
            { title: `${n.name} Chapter Reading Quest`, type: "reading", icon: "📖", xp: missionXp },
            { title: `${n.name} Practice Challenge`, type: "practice", icon: "✍️", xp: missionXp }
          ]
        };
      })
    : theme.stages;

  // Determine current stage index
  let currentStageIndex = 0;
  if (nodes && nodes.length > 0) {
    const lastUnlocked = nodes.map(n => n.unlocked).lastIndexOf(true);
    currentStageIndex = lastUnlocked !== -1 ? Math.min(nodes.length - 1, lastUnlocked) : 0;
  } else {
    if (xp >= 1000) currentStageIndex = 3;
    else if (xp >= 600) currentStageIndex = 2;
    else if (xp >= 350) currentStageIndex = 1;
  }

  const getStageState = (index: number) => {
    if (nodes && nodes.length > 0) {
      if (nodes[index]?.unlocked) return "completed";
      if (index === currentStageIndex + 1 || (currentStageIndex === 0 && index === 0 && !nodes[0]?.unlocked)) return "current";
      return "upcoming";
    }
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "upcoming";
  };

  // Safe zigzag: alternate left/right anchor within the container.
  // Cards are 78% wide — flush left on even indices, flush right on odd.
  // This gives a visible ~22% zigzag without any risk of overflow.
  const isLeft = (index: number) => index % 2 === 0;

  return (
    <div className={`relative w-full bg-gradient-to-b ${tv.bg} overflow-x-hidden pt-6 pb-36 flex flex-col items-center select-none font-sans`}>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
        style={{ background: tv.accentFrom, filter: "blur(60px)" }} />
      <div className="absolute top-20 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: tv.accentTo, filter: "blur(50px)" }} />

      {/* STAGE CARDS in zigzag */}
      <div className="relative w-full max-w-[390px] mx-auto flex flex-col items-stretch px-3">
        {stages.map((stage, index) => {
          const state = getStageState(index);
          const isCompleted = state === "completed";
          const isCurrent = state === "current";
          const isUpcoming = state === "upcoming";
          const left = isLeft(index);

          const stageProgress = isCompleted
            ? 100
            : isCurrent
            ? Math.min(95, Math.round(((xp % 1000) / 1000) * 100))
            : 0;

          // ── Card visual variants ──
          const cardStyle = isCompleted
            ? {
                bg: isSpaceDark ? "bg-white/10 backdrop-blur-md" : "bg-white",
                border: isSpaceDark ? "border border-white/20" : "border border-[#006a62]/20",
                shadow: "shadow-md",
                iconBg: `bg-[${tv.accentTo}]`,
                iconBgClass: "bg-[#006a62]",
                barColor: "bg-[#006a62]",
                pill: isSpaceDark
                  ? "bg-white/10 border-white/20 text-white/80"
                  : "bg-teal-50 border-teal-200 text-[#006a62]",
                titleColor: isSpaceDark ? "text-white" : "text-[#141779]",
                labelColor: isSpaceDark ? "text-teal-300" : "text-[#006a62]",
              }
            : isCurrent
            ? {
                bg: isSpaceDark ? "bg-white/15 backdrop-blur-md" : "bg-white",
                border: isSpaceDark ? "border-2 border-cyan-400/60" : "border-2 border-[#141779]",
                shadow: isSpaceDark
                  ? "shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
                  : "shadow-[0_8px_32px_rgba(20,23,121,0.18)]",
                iconBgClass: isSpaceDark ? "bg-violet-600" : "bg-[#141779]",
                barColor: isSpaceDark ? "bg-violet-400" : "bg-[#141779]",
                pill: isSpaceDark
                  ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-200"
                  : "bg-[#141779]/10 border-[#141779]/20 text-[#141779]",
                titleColor: isSpaceDark ? "text-white" : "text-[#141779]",
                labelColor: isSpaceDark ? "text-cyan-300" : "text-[#141779]",
              }
            : {
                bg: isSpaceDark ? "bg-white/5 backdrop-blur-md" : "bg-slate-50/80",
                border: isSpaceDark ? "border border-white/10" : "border border-slate-200",
                shadow: "shadow-xs",
                iconBgClass: "bg-slate-300",
                barColor: "bg-slate-300",
                pill: isSpaceDark
                  ? "bg-white/5 border-white/10 text-white/30"
                  : "bg-white border-slate-200 text-slate-400",
                titleColor: isSpaceDark ? "text-white/40" : "text-slate-400",
                labelColor: isSpaceDark ? "text-white/30" : "text-slate-400",
              };

          return (
            <div key={stage.id} className="w-full flex flex-col">
              {/* Centered connector between cards */}
              {index > 0 && (
                <div className="flex flex-col items-center py-1 self-center">
                  <div
                    className="w-px h-7 opacity-25"
                    style={{ background: `repeating-linear-gradient(to bottom, ${tv.pathColor} 0, ${tv.pathColor} 5px, transparent 5px, transparent 10px)` }}
                  />
                  <div className="w-2.5 h-2.5 rounded-full opacity-40 border-2 border-white" style={{ background: tv.pathColor }} />
                  <div
                    className="w-px h-4 opacity-15"
                    style={{ background: `repeating-linear-gradient(to bottom, ${tv.pathColor} 0, ${tv.pathColor} 5px, transparent 5px, transparent 10px)` }}
                  />
                </div>
              )}

              {/* Card: flush-left on even, flush-right on odd */}
              <motion.div
                className={`flex ${left ? "justify-start" : "justify-end"} w-full mb-1`}
                initial={{ opacity: 0, x: left ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.09, duration: 0.38, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStage(stage)}
                  className={`
                    ${cardStyle.bg} ${cardStyle.border} ${cardStyle.shadow}
                    rounded-3xl p-4 w-[78%] cursor-pointer transition-all relative overflow-hidden
                    ${isUpcoming ? "opacity-50" : ""}
                  `}
                >
                  {/* Inner glow for current node */}
                  {isCurrent && !isSpaceDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#141779]/5 via-transparent to-[#006a62]/5 rounded-3xl pointer-events-none" />
                  )}
                  {isCurrent && isSpaceDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 rounded-3xl pointer-events-none" />
                  )}

                  <div className="relative z-10 flex items-start gap-3">
                    {/* Icon column */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className={`w-11 h-11 ${cardStyle.iconBgClass} rounded-2xl flex items-center justify-center shadow-md relative`}>
                        {isCompleted && <Check size={20} color="white" strokeWidth={3} />}
                        {isCurrent && <Sparkles size={18} className="text-[#57fae9] animate-pulse" />}
                        {isUpcoming && <Lock size={16} color="white" />}
                        {/* Node number badge */}
                        <div
                          className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-white"
                          style={{ background: tv.pathColor }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      {stage.emoji && (
                        <span className="text-base leading-none">{stage.emoji}</span>
                      )}
                    </div>

                    {/* Content column */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${cardStyle.labelColor}`}>
                        {isCompleted ? "✓ Unlocked" : isCurrent ? "▶ In Progress" : "⏸ Locked"}
                      </span>
                      <h3 className={`text-sm font-black leading-snug mt-0.5 ${cardStyle.titleColor}`}>
                        {stage.name}
                      </h3>

                      {/* Progress bar */}
                      <div className="w-full bg-black/10 rounded-full h-1.5 mt-2 overflow-hidden">
                        <motion.div
                          className={`${cardStyle.barColor} h-full rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stageProgress}%` }}
                          transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                      <p className={`text-[9px] font-bold mt-0.5 ${isSpaceDark ? "text-white/40" : "text-slate-400"}`}>
                        {stageProgress}% Completed
                      </p>

                      {/* Chapter pill */}
                      <div className={`inline-flex items-center gap-1 text-[10px] font-bold mt-2 px-2.5 py-1 rounded-full border ${cardStyle.pill}`}>
                        <BookOpen size={10} />
                        <span>{stage.itemReward}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Floating Play Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEnterStage(stages[currentStageIndex])}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 text-white rounded-full shadow-[0_8px_25px_rgba(20,23,121,0.4)] flex items-center justify-center border-2 border-white/20 transition-all"
        style={{ background: tv.accentFrom }}
      >
        <Play size={26} className="fill-white ml-1" />
      </motion.button>

      {/* Location Bottom Sheet */}
      <LocationModalSheet
        stage={selectedStage}
        state={
          selectedStage
            ? (stages.findIndex((s) => s.id === selectedStage.id) < currentStageIndex
                ? "completed"
                : stages.findIndex((s) => s.id === selectedStage.id) === currentStageIndex
                ? "current"
                : "upcoming")
            : "current"
        }
        onClose={() => setSelectedStage(null)}
        onEnter={(stg) => {
          setSelectedStage(null);
          onEnterStage(stg);
        }}
      />
    </div>
  );
}
