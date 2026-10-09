import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORLD_THEMES, MapWorldThemeConfig, MapStageConfig } from "./AdventureTheme";
import LocationModalSheet from "./LocationModalSheet";
import { Check, Lock, Star, Play, Sparkles, BookOpen, GraduationCap, Compass, ShieldAlert, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MapWorldProps {
  themeKey?: "dragon" | "science" | "reading" | "space" | "social";
  xp?: number;
  userLevel?: number;
  activeClassLevel?: number;
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
    bg: "from-[#EEF4FB] via-[#F4F8FE] to-[#E9F1FC]",
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
  userLevel = 1,
  activeClassLevel,
  companionEmoji,
  onEnterStage,
  nodes,
  progressPercentage = 0
}: MapWorldProps) {
  const { t } = useTranslation();
  const theme: MapWorldThemeConfig = WORLD_THEMES[themeKey] || WORLD_THEMES.dragon;
  const tv = THEME_VISUALS[themeKey] || THEME_VISUALS.dragon;
  const isSpaceDark = themeKey === "space";
  const [selectedStage, setSelectedStage] = useState<MapStageConfig | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Inferred user active class number (defaulting to 1 if not provided)
  const inferredActiveClass = activeClassLevel || (nodes?.find((n: any) => !n.isPriorClass && !n.isFutureClass)?.minClass) || userLevel || 1;
  const [activeNavClass, setActiveNavClass] = useState<number>(inferredActiveClass);

  // Build full stage list from nodes or fallback defaults
  const rawStages: (MapStageConfig & { minClass: number; nodeData?: any })[] = nodes && nodes.length > 0
    ? nodes.map((n: any, idx: number) => {
        const xpR = n.xpReward || Math.max(100, (n.requiredChapters || 0) * 50);
        const coinR = n.coinReward || Math.max(50, (n.requiredChapters || 0) * 25);
        const missionXp = Math.max(50, Math.round(xpR / 2));
        const biomes: Array<"forest" | "cave" | "volcano" | "castle"> = ["forest", "cave", "volcano", "castle"];
        const nodeCh = n.nodeChapters || 4;
        const minClassNum = n.minClass || (idx < 3 ? 1 : idx < 6 ? 2 : idx < 9 ? 3 : 4);
        return {
          id: `node-${idx}`,
          stageNumber: n.displayLevel || (idx + 1),
          name: n.name,
          subtitle: `Class ${minClassNum} • ${nodeCh} Chapters`,
          emoji: n.emoji || "⭐",
          storyQuote: `Complete Class ${minClassNum} chapter quests to unlock ${n.name}!`,
          description: n.lockReason || `Class ${minClassNum} Realm`,
          questsCount: nodeCh,
          lessonsCount: Math.ceil(nodeCh / 2),
          xpReward: xpR,
          coinReward: coinR,
          unlocked: Boolean(n.unlocked),
          itemIcon: n.emoji || "⭐",
          itemReward: `${nodeCh} Chapters`,
          x: 50,
          y: Math.max(10, 90 - idx * 20),
          biomeType: biomes[idx % biomes.length],
          minClass: minClassNum,
          nodeData: n,
          missions: [
            { title: `${n.name} Reading Quest`, type: "reading", icon: "📖", xp: missionXp },
            { title: `${n.name} Practice Challenge`, type: "practice", icon: "✍️", xp: missionXp }
          ]
        };
      })
    : [
        { id: "node-0", stageNumber: 1, name: "Egg Village", subtitle: "Class 1 • Hatching Grounds", emoji: "🥚", storyQuote: "Hatch & Begin", description: "Hatch & Begin", questsCount: 4, lessonsCount: 2, xpReward: 500, coinReward: 200, itemReward: "4 Chapters", itemIcon: "🥚", unlocked: true, minClass: 1, x: 50, y: 90, biomeType: "forest", missions: [] },
        { id: "node-1", stageNumber: 2, name: "Hatchling Haven", subtitle: "Class 1 • Nursery Realm", emoji: "🐣", storyQuote: "Nursery Realm", description: "Nursery Realm", questsCount: 4, lessonsCount: 2, xpReward: 500, coinReward: 200, itemReward: "4 Chapters", itemIcon: "🐣", unlocked: true, minClass: 1, x: 50, y: 70, biomeType: "forest", missions: [] },
        { id: "node-2", stageNumber: 3, name: "Forest Kingdom", subtitle: "Class 1 • Enchanted Woods", emoji: "🐉", storyQuote: "Enchanted Woods", description: "Enchanted Woods", questsCount: 4, lessonsCount: 2, xpReward: 500, coinReward: 200, itemReward: "4 Chapters", itemIcon: "🐉", unlocked: false, minClass: 1, x: 50, y: 50, biomeType: "forest", missions: [] },
        { id: "node-3", stageNumber: 4, name: "Magic Desert", subtitle: "Class 2 • Sun Sands", emoji: "🔥", storyQuote: "Sun Sands", description: "Sun Sands", questsCount: 4, lessonsCount: 2, xpReward: 800, coinReward: 350, itemReward: "4 Chapters", itemIcon: "🔥", unlocked: false, minClass: 2, x: 50, y: 40, biomeType: "cave", missions: [] },
        { id: "node-4", stageNumber: 5, name: "Ice Kingdom", subtitle: "Class 2 • Frost Peak", emoji: "❄️", storyQuote: "Frost Peak", description: "Frost Peak", questsCount: 4, lessonsCount: 2, xpReward: 800, coinReward: 350, itemReward: "4 Chapters", itemIcon: "❄️", unlocked: false, minClass: 2, x: 50, y: 30, biomeType: "cave", missions: [] },
        { id: "node-5", stageNumber: 6, name: "Dragon Mountain", subtitle: "Class 2 • Dragon Apex", emoji: "🏔️", storyQuote: "Dragon Apex", description: "Dragon Apex", questsCount: 4, lessonsCount: 2, xpReward: 800, coinReward: 350, itemReward: "4 Chapters", itemIcon: "🏔️", unlocked: false, minClass: 2, x: 50, y: 20, biomeType: "cave", missions: [] },
        { id: "node-6", stageNumber: 7, name: "Cloud City", subtitle: "Class 3 • Sky Haven", emoji: "☁️", storyQuote: "Sky Haven", description: "Sky Haven", questsCount: 4, lessonsCount: 2, xpReward: 1200, coinReward: 500, itemReward: "4 Chapters", itemIcon: "☁️", unlocked: false, minClass: 3, x: 50, y: 10, biomeType: "volcano", missions: [] },
        { id: "node-7", stageNumber: 8, name: "Crystal Caves", subtitle: "Class 3 • Gem Caverns", emoji: "💎", storyQuote: "Gem Caverns", description: "Gem Caverns", questsCount: 4, lessonsCount: 2, xpReward: 1200, coinReward: 500, itemReward: "4 Chapters", itemIcon: "💎", unlocked: false, minClass: 3, x: 50, y: 5, biomeType: "volcano", missions: [] },
        { id: "node-8", stageNumber: 9, name: "Underworld", subtitle: "Class 3 • Deep Lair", emoji: "🌋", storyQuote: "Deep Lair", description: "Deep Lair", questsCount: 4, lessonsCount: 2, xpReward: 1200, coinReward: 500, itemReward: "4 Chapters", itemIcon: "🌋", unlocked: false, minClass: 3, x: 50, y: 0, biomeType: "volcano", missions: [] },
        { id: "node-9", stageNumber: 10, name: "Galactic Core", subtitle: "Class 4 • Stellar Lair", emoji: "🌌", storyQuote: "Stellar Lair", description: "Stellar Lair", questsCount: 4, lessonsCount: 2, xpReward: 2000, coinReward: 800, itemReward: "4 Chapters", itemIcon: "🌌", unlocked: false, minClass: 4, x: 50, y: 0, biomeType: "castle", missions: [] },
        { id: "node-10", stageNumber: 11, name: "Stone Age Hunter", subtitle: "Class 4 • Ancestral Lands", emoji: "🏹", storyQuote: "Ancestral Lands", description: "Ancestral Lands", questsCount: 4, lessonsCount: 2, xpReward: 2000, coinReward: 800, itemReward: "4 Chapters", itemIcon: "🏹", unlocked: false, minClass: 4, x: 50, y: 0, biomeType: "castle", missions: [] },
        { id: "node-11", stageNumber: 12, name: "Bronze Craftsman", subtitle: "Class 4 • Forge Realm", emoji: "🔨", storyQuote: "Forge Realm", description: "Forge Realm", questsCount: 4, lessonsCount: 2, xpReward: 2000, coinReward: 800, itemReward: "4 Chapters", itemIcon: "🔨", unlocked: false, minClass: 4, x: 50, y: 0, biomeType: "castle", missions: [] },
        { id: "node-12", stageNumber: 13, name: "Civilization Leader", subtitle: "Class 4 • Apex Throne", emoji: "👑", storyQuote: "Apex Throne", description: "Apex Throne", questsCount: 4, lessonsCount: 2, xpReward: 2000, coinReward: 800, itemReward: "4 Chapters", itemIcon: "👑", unlocked: false, minClass: 4, x: 50, y: 0, biomeType: "castle", missions: [] }
      ];

  // Group stages by Class / Standard
  const classNumbers = Array.from(new Set(rawStages.map(s => s.minClass))).sort((a, b) => a - b);

  const getClassHeaderInfo = (cNum: number) => {
    const titles: Record<number, { title: string; subtitle: string; icon: string; gradient: string; badgeClass: string }> = {
      1: { title: "Elementary Expedition", subtitle: "EGG & HATCHLING REALM", icon: "🥚", gradient: "bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] border-[#9C7CFF]/50 shadow-md", badgeClass: "bg-[#57FAE9] text-[#141779] border border-[#57FAE9]" },
      2: { title: "Dragon & Mountain Trails", subtitle: "DESERT & FROST REALM", icon: "🔥", gradient: "bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#3B0764] border-[#C084FC]/50 shadow-md", badgeClass: "bg-[#FFD45A] text-[#451A03] border border-[#FFD45A]" },
      3: { title: "Celestial Heavens", subtitle: "CLOUD & CRYSTAL REALM", icon: "☁️", gradient: "bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#312E81] border-[#A5B4FC]/50 shadow-md", badgeClass: "bg-[#818CF8] text-[#0F172A] border border-[#A5B4FC]" },
      4: { title: "Apex Evolution & Cosmos", subtitle: "GALACTIC & CIVILIZATION", icon: "🌌", gradient: "bg-gradient-to-r from-[#172554] via-[#1D4ED8] to-[#2563EB] border-[#60A5FA]/50 shadow-md", badgeClass: "bg-[#F472B6] text-[#3B0764] border border-[#F472B6]" },
      5: { title: "Atom & Discovery Lab", subtitle: "FUNDAMENTAL SCIENCES", icon: "🧪", gradient: "bg-gradient-to-r from-[#042F2E] via-[#0D9488] to-[#14B8A6] border-[#57FAE9]/50 shadow-md", badgeClass: "bg-[#57FAE9] text-[#042F2E] border border-[#57FAE9]" },
      6: { title: "Quantum Energy Station", subtitle: "ADVANCED DYNAMICS", icon: "⚡", gradient: "bg-gradient-to-r from-[#172554] via-[#1D4ED8] to-[#2563EB] border-[#60A5FA]/50 shadow-md", badgeClass: "bg-[#60A5FA] text-[#172554] border border-[#60A5FA]" },
      7: { title: "Innovation & Genius Citadel", subtitle: "PIONEER RESEARCH", icon: "💡", gradient: "bg-gradient-to-r from-[#4A0E17] via-[#9F1239] to-[#E11D48] border-[#FB7185]/50 shadow-md", badgeClass: "bg-[#FB7185] text-[#4A0E17] border border-[#FB7185]" },
      8: { title: "Bronze Scholar League", subtitle: "FOUNDATION ARENA", icon: "🥉", gradient: "bg-gradient-to-r from-[#451A03] via-[#78350F] to-[#B45309] border-[#FDE68A]/50 shadow-md", badgeClass: "bg-[#FDE68A] text-[#451A03] border border-[#FDE68A]" },
      9: { title: "Silver & Gold League", subtitle: "MASTER COMPETITOR", icon: "🥇", gradient: "bg-gradient-to-r from-[#312E81] via-[#4338CA] to-[#6366F1] border-[#C7D2FE]/50 shadow-md", badgeClass: "bg-[#C7D2FE] text-[#312E81] border border-[#C7D2FE]" },
      10: { title: "Diamond Apex League", subtitle: "SUPREME MASTERY", icon: "💎", gradient: "bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] border-[#38BDF8]/50 shadow-md", badgeClass: "bg-[#38BDF8] text-[#0F172A] border border-[#38BDF8]" }
    };
    return titles[cNum] || { title: `Class ${cNum} Realm`, subtitle: `CLASS ${cNum} EXPEDITION`, icon: "🎓", gradient: "bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c]", badgeClass: "bg-white text-[#141779]" };
  };

  const isClickingRef = useRef(false);

  // Smooth auto-scroll to current user class section on mount
  useEffect(() => {
    const targetId = `class-section-${inferredActiveClass}`;
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [inferredActiveClass]);

  // ScrollSpy listener to dynamically highlight active class pill when scrolling UP or DOWN
  useEffect(() => {
    const handleScroll = () => {
      if (isClickingRef.current) return;
      const stickyThreshold = 160;
      let matchedClass = classNumbers[0];

      for (const cNum of classNumbers) {
        const el = document.getElementById(`class-section-${cNum}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= stickyThreshold) {
            matchedClass = cNum;
          }
        }
      }

      if (matchedClass !== undefined) {
        setActiveNavClass(matchedClass);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [classNumbers]);

  const scrollToClass = (cNum: number) => {
    isClickingRef.current = true;
    setActiveNavClass(cNum);
    const el = document.getElementById(`class-section-${cNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      isClickingRef.current = false;
    }, 850);
  };

  // Determine global index of current playable node
  let currentStageIndex = rawStages.findIndex(s => s.unlocked && !s.nodeData?.completed);
  if (currentStageIndex === -1) {
    const lastUnlocked = rawStages.map(s => s.unlocked).lastIndexOf(true);
    currentStageIndex = lastUnlocked !== -1 ? lastUnlocked : 0;
  }

  const getStageState = (stage: any, index: number) => {
    if (stage.nodeData) {
      if (stage.nodeData.completed) return "completed";
      if (stage.nodeData.unlocked) return "current";
      return "upcoming";
    }
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "upcoming";
  };

  const isLeft = (index: number) => index % 2 === 0;

  return (
    <div className={`relative w-full bg-gradient-to-b ${tv.bg} overflow-x-hidden pb-36 flex flex-col items-center select-none font-sans`}>
      {/* Ambient background glow particles */}
      <div className="absolute top-0 left-0 w-52 h-52 rounded-full opacity-15 pointer-events-none"
        style={{ background: tv.accentFrom, filter: "blur(70px)" }} />
      <div className="absolute top-48 right-0 w-44 h-44 rounded-full opacity-15 pointer-events-none"
        style={{ background: tv.accentTo, filter: "blur(60px)" }} />

      {/* ULTRA-PREMIUM FLOATING CLASS SEGMENTED CONTROLLER (9.5+ RATING) */}
      <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-2 py-2 flex items-center justify-center shadow-xs">
        <div className="flex items-center justify-between gap-1 max-w-[420px] w-full bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-inner">
          {classNumbers.map((cNum) => {
            const isUserCurrentClass = cNum === inferredActiveClass;
            const isSelected = activeNavClass === cNum;
            const isPastClass = cNum < inferredActiveClass;

            return (
              <button
                key={cNum}
                onClick={() => scrollToClass(cNum)}
                className={`flex-1 py-2 px-1 rounded-full text-[11px] font-black uppercase tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-1 leading-none whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] text-white shadow-md shadow-indigo-900/30 scale-[1.03] border border-indigo-300/40"
                    : "bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-white hover:text-slate-900"
                }`}
              >
                <span className="text-[10px] shrink-0">{isUserCurrentClass ? "⚡" : isPastClass ? "✓" : "🔒"}</span>
                <span className="whitespace-nowrap">{`Class ${cNum}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCKED NOTICE TOAST */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 z-50 max-w-[390px] w-[90%] mx-auto bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between text-xs font-bold"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-amber-400 shrink-0" />
              <span>{lockedNotice}</span>
            </div>
            <button onClick={() => setLockedNotice(null)} className="text-slate-400 hover:text-white text-sm font-bold ml-2">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MULTI-STANDARD CLASS SECTIONS CONTAINER */}
      <div className="relative w-full max-w-[390px] mx-auto flex flex-col items-stretch px-3 pt-2">
        {classNumbers.map((cNum) => {
          const classStages = rawStages.filter(s => s.minClass === cNum);
          const headerInfo = getClassHeaderInfo(cNum);
          const isCompletedClass = cNum < inferredActiveClass;
          const isCurrentClass = cNum === inferredActiveClass;
          const isLockedClass = cNum > inferredActiveClass;
          const isAllStagesCompleted = classStages.length > 0 && classStages.every(s => Boolean(s.nodeData?.completed));

          return (
            <div key={cNum} id={`class-section-${cNum}`} className="w-full flex flex-col">
              
              {/* EPIC CLASS REALM GATEWAY CARD (9.5+ RATED DESIGN) */}
              <div className="w-full pt-5 pb-3">
                <div className={`
                  w-full rounded-[24px] p-4 border-2 shadow-md relative overflow-hidden transition-all text-white
                  ${headerInfo.gradient}
                `}>
                  <div className="flex flex-col gap-2.5">
                    {/* Top row: Realm emoji + Status badge */}
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-base shrink-0 shadow-xs">
                          {headerInfo.icon}
                        </div>
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-white/90 whitespace-nowrap truncate shrink min-w-0">
                          {headerInfo.subtitle}
                        </span>
                      </div>

                      <div className="shrink-0 flex-shrink-0 ml-1">
                        {isCurrentClass && (
                          <span className={`${headerInfo.badgeClass} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-md animate-pulse whitespace-nowrap shrink-0`}>
                            ⚡ {t('current_class', 'CURRENT CLASS')}
                          </span>
                        )}
                        {isCompletedClass && isAllStagesCompleted && (
                          <span className="bg-emerald-500/30 border border-emerald-400 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0">
                            ✓ {t('completed_upper', 'COMPLETED')}
                          </span>
                        )}
                        {isCompletedClass && !isAllStagesCompleted && (
                          <span className="bg-white/20 border border-white/30 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0">
                            📚 CLASS {cNum}
                          </span>
                        )}
                        {isLockedClass && (
                          <span className="bg-black/35 text-white border border-white/35 text-[8.5px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight inline-flex items-center gap-1 backdrop-blur-md whitespace-nowrap shrink-0 flex-shrink-0 shadow-xs">
                            🔒 <span className="whitespace-nowrap inline-block">{t('unlocks_at_class', { count: cNum, defaultValue: `UNLOCKS AT CLASS ${cNum}` })}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom row: Standard Title (No truncation cutoffs!) */}
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wide leading-tight text-white drop-shadow-xs">
                        Class {cNum} • {headerInfo.title}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLASS STAGE CARDS */}
              {classStages.map((stage) => {
                const globalIndex = rawStages.findIndex(s => s.id === stage.id);
                const isNodeCompleted = Boolean(stage.nodeData ? stage.nodeData.completed : false);
                const stageProgPct = stage.nodeData?.nodeProgressPercentage !== undefined
                  ? Math.round(stage.nodeData.nodeProgressPercentage)
                  : 0;

                // Unlocked rule:
                // - Current standard (cNum === inferredActiveClass): unlocked if stage is active/unlocked in current class
                // - Prior/other standards (cNum < inferredActiveClass): unlocked ONLY IF progress > 0% or completed! If 0%, it stays locked.
                // - Future standards (cNum > inferredActiveClass): locked.
                const isNodeUnlocked = isCurrentClass
                  ? Boolean(stage.nodeData ? stage.nodeData.unlocked : stage.unlocked)
                  : (isNodeCompleted || stageProgPct > 0);

                const isCompleted = isNodeCompleted;
                const isCurrent = isNodeUnlocked && !isCompleted && (isCurrentClass || stageProgPct > 0);
                const stageProgress = isCompleted ? 100 : (isNodeUnlocked ? stageProgPct : 0);

                const left = isLeft(globalIndex);

                // Card visual styling variants
                const cardStyle = isCompleted
                  ? {
                      bg: isSpaceDark ? "bg-white/10 backdrop-blur-md" : "bg-white",
                      border: isSpaceDark ? "border border-white/20" : "border border-[#141779]/20",
                      shadow: "shadow-md",
                      iconBgClass: "bg-[#141779]",
                      barColor: "bg-emerald-500",
                      pill: isSpaceDark ? "bg-white/10 border-white/20 text-white/80" : "bg-indigo-50 border-indigo-200 text-[#141779]",
                      titleColor: isSpaceDark ? "text-white" : "text-[#141779]",
                      labelColor: isSpaceDark ? "text-emerald-400" : "text-emerald-600",
                    }
                  : isNodeUnlocked
                  ? {
                      bg: isSpaceDark ? "bg-white/15 backdrop-blur-md" : "bg-white",
                      border: isSpaceDark ? "border-2 border-cyan-400/60" : "border-2 border-[#141779]",
                      shadow: isSpaceDark
                        ? "shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
                        : "shadow-[0_8px_32px_rgba(20,23,121,0.18)]",
                      iconBgClass: isSpaceDark ? "bg-violet-600" : "bg-[#141779]",
                      barColor: isSpaceDark ? "bg-violet-400" : "bg-[#141779]",
                      pill: isSpaceDark ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-200" : "bg-[#141779]/10 border-[#141779]/20 text-[#141779]",
                      titleColor: isSpaceDark ? "text-white" : "text-[#141779]",
                      labelColor: isSpaceDark ? "text-cyan-300" : "text-[#141779]",
                    }
                  : {
                      bg: isSpaceDark ? "bg-white/5 backdrop-blur-md" : "bg-slate-50/80",
                      border: isSpaceDark ? "border border-white/10" : "border border-slate-200",
                      shadow: "shadow-xs",
                      iconBgClass: "bg-slate-300",
                      barColor: "bg-slate-300",
                      pill: isSpaceDark ? "bg-white/5 border-white/10 text-white/30" : "bg-white border-slate-200 text-slate-400",
                      titleColor: isSpaceDark ? "text-white/40" : "text-slate-400",
                      labelColor: isSpaceDark ? "text-white/30" : "text-slate-400",
                    };

                return (
                  <div key={stage.id} className="w-full flex flex-col">
                    {/* Dashed connector line */}
                    <div className="flex flex-col items-center py-1 self-center">
                      <div
                        className="w-px h-6 opacity-25"
                        style={{ background: `repeating-linear-gradient(to bottom, ${tv.pathColor} 0, ${tv.pathColor} 4px, transparent 4px, transparent 8px)` }}
                      />
                      <div className="w-2.5 h-2.5 rounded-full opacity-40 border-2 border-white" style={{ background: tv.pathColor }} />
                    </div>

                    {/* Card container in zigzag arrangement */}
                    <motion.div
                      className={`flex ${left ? "justify-start" : "justify-end"} w-full mb-1`}
                      initial={{ opacity: 0, x: left ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: globalIndex * 0.04, duration: 0.35, ease: "easeOut" }}
                    >
                      <motion.div
                        whileHover={{ y: -3, scale: 1.015 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (isLockedClass) {
                            setLockedNotice(`🔒 ${stage.name} unlocks when you reach Class ${cNum}!`);
                            setTimeout(() => setLockedNotice(null), 3000);
                          } else if (!isNodeUnlocked && !isCompleted) {
                            setLockedNotice(`🔒 ${stage.name} is locked. Complete previous chapters in Class ${cNum} to unlock!`);
                            setTimeout(() => setLockedNotice(null), 3000);
                          } else {
                            setSelectedStage(stage);
                          }
                        }}
                        className={`
                          ${cardStyle.bg} ${cardStyle.border} ${cardStyle.shadow}
                          rounded-3xl p-4 w-[80%] cursor-pointer transition-all relative overflow-hidden
                          ${!isNodeUnlocked && !isCompleted ? "opacity-60 bg-slate-50/60 grayscale-[0.2]" : ""}
                        `}
                      >
                        {/* Glow accent for current node */}
                        {isCurrent && !isSpaceDark && (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#141779]/5 via-transparent to-[#006a62]/5 rounded-3xl pointer-events-none" />
                        )}

                        <div className="relative z-10 flex items-start gap-3">
                          {/* Stage Icon */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-12 h-12 ${cardStyle.iconBgClass} rounded-2xl flex items-center justify-center shadow-md relative text-white`}>
                              {stage.emoji ? (
                                <span className="text-xl leading-none select-none">{stage.emoji}</span>
                              ) : (
                                <>
                                  {isCompleted && <Check size={20} color="white" strokeWidth={3} />}
                                  {isNodeUnlocked && <Sparkles size={18} className="text-[#57fae9] animate-pulse" />}
                                  {!isNodeUnlocked && <Lock size={16} color="white" />}
                                </>
                              )}
                              {/* Level Badge */}
                              <div
                                className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-white shadow-xs"
                                style={{ background: tv.pathColor }}
                              >
                                {stage.stageNumber}
                              </div>
                            </div>
                          </div>

                          {/* Content column */}
                          <div className="flex-1 min-w-0">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${cardStyle.labelColor}`}>
                              {isLockedClass
                                ? `🔒 ${t('unlocks_at_class_short', { count: cNum, defaultValue: `Class ${cNum}` })}`
                                : isCompleted
                                ? `✓ ${t('completed', 'Completed')}`
                                : isNodeUnlocked
                                ? (stageProgPct > 0 ? `▶ ${t('in_progress_status', 'In Progress')}` : `✓ ${t('unlocked_status', 'Unlocked')}`)
                                : `🔒 ${t('locked_status', 'Locked')}`}
                            </span>
                            <h3 className={`text-sm font-black leading-snug mt-0.5 ${cardStyle.titleColor}`}>
                              {t(stage.name.toLowerCase().replace(/ /g, '_'), { defaultValue: stage.name })}
                            </h3>

                            {/* Progress Bar */}
                            <div className="w-full bg-black/10 rounded-full h-1.5 mt-2 overflow-hidden">
                              <motion.div
                                className={`${cardStyle.barColor} h-full rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${stageProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <p className={`text-[9px] font-bold mt-0.5 ${isSpaceDark ? "text-white/40" : "text-slate-400"}`}>
                              {stageProgress}% {t('completed', 'Completed')}
                            </p>

                            {/* Chapter pill */}
                            <div className={`inline-flex items-center gap-1 text-[10px] font-bold mt-2 px-2.5 py-1 rounded-full border ${cardStyle.pill}`}>
                              <BookOpen size={10} />
                              <span>{stage.questsCount || 4} {t('chapters_word', 'Chapters')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating Play Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const playableStage = rawStages[currentStageIndex] || rawStages[0];
          onEnterStage(playableStage);
        }}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 text-white rounded-full shadow-[0_8px_25px_rgba(20,23,121,0.4)] flex items-center justify-center border-2 border-white/20 transition-all"
        style={{ background: tv.accentFrom }}
      >
        <Play size={26} className="fill-white ml-1" />
      </motion.button>

      {/* Location Modal Sheet */}
      <LocationModalSheet
        stage={selectedStage}
        state={
          selectedStage
            ? (selectedStage.nodeData?.completed
                ? "completed"
                : selectedStage.unlocked
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
