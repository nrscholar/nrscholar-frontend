import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap, Coins, Gift, Swords, Sparkles, BookOpen } from "lucide-react";
import { MapStageConfig, NRSCHOLAR_TOKENS } from "./AdventureTheme";
import { useTranslation } from "react-i18next";

interface LocationModalSheetProps {
  stage: MapStageConfig | null;
  state?: "completed" | "current" | "upcoming";
  onClose: () => void;
  onEnter: (stage: MapStageConfig) => void;
}

export default function LocationModalSheet({
  stage,
  state = "current",
  onClose,
  onEnter,
}: LocationModalSheetProps) {
  const { t } = useTranslation();
  if (!stage) return null;

  const isCurrent = state === "current";
  const isCompleted = state === "completed";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 backdrop-blur-xs p-0 sm:p-4 select-none">
        {/* Backdrop Tap Dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Storybook Bottom Sheet Panel */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="relative z-10 w-full max-w-[420px] bg-[#F4F8FF] border-t-4 border-[#2D328F] rounded-t-[32px] sm:rounded-[32px] p-6 text-slate-900 shadow-[0_-16px_48px_rgba(45,50,143,0.25)] flex flex-col gap-4 overflow-hidden"
        >
          {/* Top Handle */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-0.5" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-500 transition-all border border-slate-200 shadow-2xs"
          >
            <X size={16} />
          </button>

          {/* HERO BANNER SECTION */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl border-2 border-white flex items-center justify-center text-4xl shadow-md shrink-0 text-white bg-gradient-to-br from-[#2D328F] to-[#1E2266]"
            >
              {stage.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-[9.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                style={{
                  backgroundColor: isCompleted
                    ? "#10B981"
                    : isCurrent
                    ? NRSCHOLAR_TOKENS.secondary
                    : NRSCHOLAR_TOKENS.tertiary,
                }}
              >
                {isCompleted
                  ? t('stage_completed', '✓ STAGE COMPLETED')
                  : isCurrent
                  ? t('current_adventure', 'CURRENT ADVENTURE')
                  : t('upcoming_quest', 'UPCOMING QUEST')}
              </span>
              <h2
                className="text-lg font-black truncate leading-tight font-headline"
                style={{ color: NRSCHOLAR_TOKENS.textDark }}
              >
                {t(stage.name.toLowerCase().replace(/ /g, '_'), { defaultValue: stage.name })}
              </h2>
              <p className="text-xs font-bold text-slate-500 truncate mt-0.5">
                {stage.subtitle ? t(stage.subtitle.toLowerCase().replace(/ /g, '_'), { defaultValue: stage.subtitle }) : (stage as any).description || t('milestone_quest_node', 'Milestone Quest Node')}
              </p>
            </div>
          </div>

          {/* NARRATIVE STORY QUOTE */}
          <div className="bg-white border border-indigo-100/90 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
            <span className="text-lg shrink-0">📜</span>
            <p className="text-xs font-bold leading-relaxed italic text-slate-700">
              "{(stage as any).storyQuote || (stage as any).description || t('complete_quests_to_unlock', 'Complete chapter learning quests to unlock this milestone!')}"
            </p>
          </div>

          {/* MISSIONS BREAKDOWN LIST */}
          {(() => {
            const nodeCh = stage.questsCount || 4;
            const xpVal = stage.xpReward || (nodeCh * 50);
            const halfXp = Math.round(xpVal / 2);
            const missionsList = (stage.missions && stage.missions.length > 0) ? stage.missions : [
              { title: `${stage.name} Textbook Reading & Concept Quests`, icon: "📖", xp: halfXp },
              { title: `${stage.name} Boss Battle & Practice Challenge`, icon: "⚔️", xp: halfXp }
            ];
            return (
              <div className="flex flex-col gap-2">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-[#141779] px-1 flex items-center gap-1.5">
                  <Swords size={12} className="text-[#006a62]" />
                  {t('available_missions', 'AVAILABLE MISSIONS')} ({missionsList.length})
                </h4>

                <div className="flex flex-col gap-1.5">
                  {missionsList.map((m, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{m.icon}</span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-black bg-indigo-50 text-[#141779] px-2 py-0.5 rounded-full shrink-0">
                        +{m.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* AREA REWARDS SUMMARY BADGE */}
          {(() => {
            const nodeCh = stage.questsCount || 4;
            const xpVal = stage.xpReward || (nodeCh * 50);
            const coinVal = stage.coinReward || (nodeCh * 25);
            const rewardLabel = stage.itemReward || `${nodeCh} Chapters`;
            return (
              <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-amber-600 text-xs font-black flex items-center gap-1">
                    <Zap size={13} className="fill-amber-500 text-amber-500" />
                    +{xpVal} XP
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-center border-x border-slate-100">
                  <span className="text-[#141779] text-xs font-black flex items-center gap-1">
                    <Coins size={13} className="text-[#FFC857]" />
                    +{coinVal} {t('coins', 'Coins')}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[#006a62] text-xs font-black flex items-center gap-1 truncate">
                    <Gift size={13} />
                    {rewardLabel}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* PRIMARY ENTER ACTION CTA BUTTON */}
          <button
            onClick={() => onEnter(stage)}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all border-2 flex items-center justify-center gap-2 mt-1 active:scale-95 text-white bg-gradient-to-r from-[#141779] via-[#1c1970] to-[#25218c] hover:brightness-110 border-indigo-300/40"
          >
            <Swords size={16} />
            <span>{t('start_adventure', 'START ADVENTURE')}</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
