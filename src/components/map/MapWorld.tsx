import React, { useState } from "react";
import { motion } from "framer-motion";
import { WORLD_THEMES, MapWorldThemeConfig, MapStageConfig } from "./AdventureTheme";
import LocationModalSheet from "./LocationModalSheet";
import { Check, Lock, Star, Play, Sparkles, BookOpen, Trophy } from "lucide-react";

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

  // Determine current stage index based on XP
  let currentStageIndex = 0;
  if (xp >= 1000) currentStageIndex = 3;
  else if (xp >= 600) currentStageIndex = 2;
  else if (xp >= 350) currentStageIndex = 1;

  const stages = theme.stages;
  const currentStage = stages[currentStageIndex] || stages[0];

  const getStageState = (index: number) => {
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "upcoming";
  };

  const positionClasses = [
    "-translate-x-12",
    "translate-x-12",
    "-translate-x-8",
    "translate-x-12",
    "0"
  ];

  return (
    <div className="relative w-full h-full min-h-[760px] bg-[#F7F9FB] overflow-y-auto no-scrollbar py-12 pb-32 flex flex-col items-center select-none font-sans">
      
      {/* S-CURVED DASHED ROADMAP PATH */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1200px] pointer-events-none z-0 opacity-20"
        fill="none"
        viewBox="0 0 256 1200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M128 0 C 128 150, 200 150, 200 300 C 200 450, 56 450, 56 600 C 56 750, 200 750, 200 900 C 200 1050, 128 1050, 128 1200"
          stroke="#141779"
          strokeWidth="4"
          strokeDasharray="8 8"
        />
      </svg>

      {/* STAGE ROADMAP CARDS */}
      <div className="relative z-10 w-full max-w-[430px] flex flex-col items-center">
        {stages.map((stage, index) => {
          const state = getStageState(index);
          const isCompleted = state === "completed";
          const isCurrent = state === "current";
          const translateClass = positionClasses[index % positionClasses.length];

          // Calculate stage progress percentage
          const stageProgress = isCompleted ? 100 : isCurrent ? Math.min(95, Math.round(((xp % 1000) / 1000) * 100)) : 0;
          const nextStage = stages[index + 1];

          if (isCompleted) {
            return (
              <div key={stage.id} className={`relative z-10 w-full mb-16 flex justify-center ${translateClass}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStage(stage)}
                  className="bg-white/95 backdrop-blur-md p-5 rounded-[24px] w-56 shadow-md border border-slate-100 flex flex-col items-center cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="w-11 h-11 bg-[#006a62] rounded-full flex items-center justify-center mb-2 shadow-md shadow-[#006a62]/20">
                    <Check size={22} color="white" strokeWidth={3} />
                  </div>
                  <span className="text-[10px] text-[#006a62] font-black uppercase tracking-widest mb-1">
                    UNLOCKED
                  </span>
                  <h3 className="text-base font-black text-[#141779] text-center mb-2">{stage.name}</h3>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#464652] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    <span>{stage.itemIcon || stage.emoji}</span>
                    <span>{stage.itemReward || "Stage Cleared"}</span>
                  </div>
                </motion.div>
              </div>
            );
          }

          if (isCurrent) {
            return (
              <div key={stage.id} className={`relative z-20 w-full mb-16 flex justify-center ${translateClass}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStage(stage)}
                  className="bg-white p-5 rounded-[28px] w-64 shadow-2xl border-2 border-[#006a62] flex flex-col items-center cursor-pointer relative scale-105"
                >
                  <div className="w-13 h-13 bg-[#141779] rounded-full flex items-center justify-center mb-2 shadow-xl ring-4 ring-[#006a62]/20">
                    <Sparkles size={24} className="text-[#57fae9] animate-pulse" />
                  </div>

                  <div className="flex items-center gap-1 mb-1 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
                    <Star size={13} className="fill-[#006a62] text-[#006a62]" />
                    <span className="text-xs text-[#006a62] font-black uppercase tracking-wider">{stage.xpReward} XP</span>
                  </div>

                  <h3 className="text-xl font-black text-[#141779] text-center mb-2">{stage.name}</h3>

                  <div className="w-full bg-[#eceef0] rounded-full h-2 mb-1 overflow-hidden">
                    <div className="bg-[#006a62] h-full rounded-full transition-all duration-1000" style={{ width: `${stageProgress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mb-3">{stageProgress}% to {nextStage ? nextStage.name : "Mastery"}</p>

                  <div className="flex gap-2 text-[11px] font-bold text-slate-700 bg-[#57fae9]/20 px-3.5 py-1.5 rounded-full border border-[#14C8C6]/30">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {stage.lessonsCount || 5} Lessons</span>
                    <span className="flex items-center gap-1"><Trophy size={12} /> {stage.questsCount || 2} Chal.</span>
                  </div>
                </motion.div>
              </div>
            );
          }

          return (
            <div key={stage.id} className={`relative z-10 w-full mb-16 flex justify-center ${translateClass} opacity-60 grayscale-[0.3]`}>
              <motion.div
                onClick={() => setSelectedStage(stage)}
                className="bg-[#eceef0] p-5 rounded-[24px] w-56 shadow-xs flex flex-col items-center border border-slate-200 cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#767683] rounded-full flex items-center justify-center mb-2 shadow-xs">
                  <Lock size={18} color="white" />
                </div>
                <span className="text-[10px] text-[#767683] font-black uppercase tracking-widest mb-1">
                  LOCKED
                </span>
                <h3 className="text-base font-black text-[#464652] text-center">{stage.name}</h3>

                <div className="mt-2 text-[10px] text-[#767683] font-bold bg-white/70 px-3 py-1 rounded-full border border-slate-200">
                  <span>🔒 Required: {stage.xpReward} XP</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* FLOATING PLAY BUTTON IN BOTTOM RIGHT CORNER (MATCHING SCREENSHOT) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEnterStage(currentStage)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#141779] text-white rounded-full shadow-[0_8px_25px_rgba(20,23,121,0.4)] flex items-center justify-center border-2 border-white/20 hover:bg-[#101362] transition-all"
      >
        <Play size={28} className="fill-white ml-1" />
      </motion.button>

      {/* LOCATION INTERACTION BOTTOM SHEET */}
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
