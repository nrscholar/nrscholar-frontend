import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Sparkles, ChevronRight, Award, Shield } from "lucide-react";
import { LandmarkData } from "./MapLandmark";

interface LocationPreviewProps {
  landmark: LandmarkData | null;
  onClose: () => void;
  onEnter: (landmark: LandmarkData) => void;
}

export default function LocationPreview({ landmark, onClose, onEnter }: LocationPreviewProps) {
  if (!landmark) return null;

  const isLocked = landmark.status === "locked";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4">
        {/* Backdrop Tap dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Bottom Sheet Modal */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-[430px] bg-slate-900 border-t-4 border-amber-400 rounded-t-[36px] sm:rounded-[36px] p-6 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-4 overflow-hidden select-none"
        >
          {/* Top Grab Handle */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-2 mb-1" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-300 transition-all border border-white/10"
          >
            <X size={18} />
          </button>

          {/* LANDMARK HEADER */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/40 flex items-center justify-center text-4xl shadow-lg shrink-0">
              {landmark.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                {landmark.region}
              </span>
              <h2 className="text-lg font-black text-white truncate mt-1 leading-snug">
                {landmark.name}
              </h2>
              <p className="text-xs text-slate-300 font-medium truncate">
                {landmark.description}
              </p>
            </div>
          </div>

          {/* FLAVOR STORY / REWARD BADGE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-base border border-amber-400/30 shrink-0">
                {landmark.rewardIcon || "🥚"}
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                  AREA REWARD
                </span>
                <span className="text-xs font-black text-amber-300">
                  {landmark.reward}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                REQUIRED XP
              </span>
              <span className="text-xs font-black text-white">
                ⚡ {landmark.requiredXp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* MISSIONS LIST PREVIEW */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-amber-400" />
                <span>AVAILABLE MISSIONS ({landmark.missionsCount})</span>
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📐</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">Math Challenge</h4>
                    <span className="text-[10px] text-amber-300 font-bold">+50 XP & Quest Progress</span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-lg">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📖</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">Reading Quest</h4>
                    <span className="text-[10px] text-emerald-300 font-bold">+30 XP & Story Scroll</span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-lg">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧪</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">Logic Battle</h4>
                    <span className="text-[10px] text-purple-300 font-bold">+40 XP & Trophy Star</span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg">
                  READY
                </span>
              </div>
            </div>
          </div>

          {/* PRIMARY ENTER ACTION CTA */}
          <button
            disabled={isLocked}
            onClick={() => onEnter(landmark)}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all mt-1 ${
              isLocked
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 hover:from-amber-500 hover:to-orange-600 active:scale-95 border-2 border-amber-300 shadow-amber-500/30"
            }`}
          >
            <span>{isLocked ? "LOCATION LOCKED" : `ENTER ${landmark.name.toUpperCase()} ⚔️`}</span>
            {!isLocked && <ChevronRight size={16} />}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
