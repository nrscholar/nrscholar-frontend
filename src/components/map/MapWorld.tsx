import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WORLD_THEMES, MapWorldThemeConfig, MapStageConfig, NRSCHOLAR_TOKENS } from "./AdventureTheme";
import MapPathTrail from "./MapPathTrail";
import MapNodeTile, { StageState } from "./MapNodeTile";
import CompanionAvatar from "./CompanionAvatar";
import LocationModalSheet from "./LocationModalSheet";
import { ChevronRight, Swords, Sparkles } from "lucide-react";

interface MapWorldProps {
  themeKey?: "dragon" | "science" | "reading" | "space";
  xp?: number;
  userLevel?: number;
  companionEmoji?: string;
  onEnterStage: (stage: MapStageConfig) => void;
}

export default function MapWorld({
  themeKey = "dragon",
  xp = 1105,
  userLevel = 7,
  companionEmoji,
  onEnterStage,
}: MapWorldProps) {
  const theme: MapWorldThemeConfig = WORLD_THEMES[themeKey] || WORLD_THEMES.dragon;
  const [selectedStage, setSelectedStage] = useState<MapStageConfig | null>(null);
  const [showMascot, setShowMascot] = useState(false);

  useEffect(() => {
    const mascotTimer = setTimeout(() => setShowMascot(true), 600);
    return () => clearTimeout(mascotTimer);
  }, []);

  // Determine current stage index based on XP
  let currentStageIndex = 0;
  if (xp >= 1000) currentStageIndex = 3;
  else if (xp >= 600) currentStageIndex = 2;
  else if (xp >= 350) currentStageIndex = 1;

  const stages = theme.stages;
  const currentStage = stages[currentStageIndex] || stages[0];
  const nextStage = stages[currentStageIndex + 1] || null;

  // Resolve state for a given stage index
  const getStageState = (index: number): StageState => {
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "upcoming";
  };

  const mascotEmoji = companionEmoji || (themeKey === "dragon" ? "🐉" : themeKey === "science" ? "🦉" : themeKey === "reading" ? "🦊" : "🦁");

  return (
    <div className="relative w-full h-full min-h-[760px] bg-[#F4F8FF] overflow-hidden select-none flex flex-col justify-between p-3 font-sans">
      
      {/* SCENERY BIOME ENVIRONMENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Atmosphere Ambient Glows */}
        <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-[#14C8C6]/15 blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-90 h-90 rounded-full bg-[#8B6AF5]/15 blur-3xl" />

        {/* Drifting Clouds & Environmental Micro-Animations */}
        <motion.div
          animate={{ x: [-80, 420] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          className="absolute top-8 left-0 text-3xl opacity-40 filter drop-shadow-xs"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [420, -80] }}
          transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
          className="absolute top-48 left-0 text-2xl opacity-30"
        >
          ☁️
        </motion.div>

        {/* Floating Butterflies / Magical Leaves */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-5, 5, -5],
              rotate: [-4, 4, -4],
            }}
            transition={{ repeat: Infinity, duration: 3.5 + i, ease: "easeInOut", delay: i * 0.8 }}
            className="absolute text-sm opacity-45"
            style={{ top: `${22 + i * 24}%`, left: `${12 + i * 32}%` }}
          >
            {i % 2 === 0 ? "🦋" : "🍃"}
          </motion.div>
        ))}

        {/* 3D Winding Adventure Trail Path */}
        <MapPathTrail
          stages={stages}
          currentStageIndex={currentStageIndex}
        />
      </div>

      {/* INTERACTIVE STAGE NODES & MASCOT AVATAR */}
      <div className="relative w-full h-full inset-0 z-10">
        {stages.map((stg, idx) => (
          <MapNodeTile
            key={stg.id}
            stage={stg}
            state={getStageState(idx)}
            onClick={(stg) => setSelectedStage(stg)}
          />
        ))}

        {/* Companion Mascot Avatar standing on current stage node */}
        <CompanionAvatar
          emoji={mascotEmoji}
          x={currentStage.x}
          y={currentStage.y}
          isVisible={showMascot}
          onClick={() => setSelectedStage(currentStage)}
        />
      </div>

      {/* FLOATING COMPACT BOTTOM ACTION PROMPT */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-20 w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-indigo-100/90 shadow-xl flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs border border-white text-white bg-gradient-to-br from-[#2D328F] to-[#1E2266]"
          >
            {currentStage.emoji}
          </div>
          <div className="min-w-0">
            <h3
              className="text-xs font-black truncate uppercase tracking-tight font-headline"
              style={{ color: NRSCHOLAR_TOKENS.textDark }}
            >
              {currentStage.name}
            </h3>
            <p
              className="text-[10px] font-bold truncate flex items-center gap-1"
              style={{ color: NRSCHOLAR_TOKENS.secondary }}
            >
              <Sparkles size={10} />
              <span>Your next quest is waiting</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onEnterStage(nextStage || currentStage)}
          className="px-4 py-2.5 rounded-xl text-slate-950 font-black text-[10.5px] uppercase tracking-wider shadow-md active:scale-95 transition-all border border-amber-300 flex items-center gap-1.5 shrink-0"
          style={{ backgroundColor: NRSCHOLAR_TOKENS.reward }}
        >
          <Swords size={13} />
          <span>CONTINUE</span>
          <ChevronRight size={14} />
        </button>
      </motion.div>

      {/* LOCATION INTERACTION BOTTOM SHEET */}
      <LocationModalSheet
        stage={selectedStage}
        state={
          selectedStage
            ? getStageState(stages.findIndex((s) => s.id === selectedStage.id))
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
