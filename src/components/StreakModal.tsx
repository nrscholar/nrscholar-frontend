import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../api";

export interface RetentionStreakData {
  currentStreak?: number;
  longestStreak?: number;
  streakDaysOfWeek?: boolean[];
  [key: string]: any;
}

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays?: number;
  retentionStreak?: RetentionStreakData | null;
}

export default function StreakModal({
  isOpen,
  onClose,
  streakDays = 0,
  retentionStreak: propRetentionStreak,
}: StreakModalProps) {
  const [retentionStreak, setRetentionStreak] = useState<RetentionStreakData | null>(
    propRetentionStreak || null
  );

  useEffect(() => {
    if (propRetentionStreak) {
      setRetentionStreak(propRetentionStreak);
    }
  }, [propRetentionStreak]);

  useEffect(() => {
    if (isOpen && !propRetentionStreak) {
      const fetchStreak = async () => {
        try {
          const res = await apiFetch("/api/retention/streak");
          if (res.ok) {
            const data = await res.json();
            setRetentionStreak(data);
          }
        } catch (e) {
          console.error("Failed to fetch streak in StreakModal", e);
        }
      };
      fetchStreak();
    }
  }, [isOpen, propRetentionStreak]);

  const currentStreak = retentionStreak?.currentStreak ?? streakDays;
  const longestStreak = retentionStreak?.longestStreak ?? streakDays;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-[#f7f9fb]/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-[#111453]/95 via-[#141779]/95 to-[#0b0c3f]/95 text-white border border-white/10 w-full max-w-sm rounded-[32px] p-8 text-center relative shadow-[0_20px_50px_rgba(20,23,121,0.5)] flex flex-col items-center justify-between gap-6 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 z-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-full h-full text-[140px] flex items-center justify-center filter drop-shadow-[0_8px_25px_rgba(255,159,67,0.4)] select-none animate-pulse"
                >
                  🔥
                </motion.div>
                <span className="absolute text-4xl font-black text-white mt-10 select-none">
                  {currentStreak}
                </span>
              </div>

              <div className="flex justify-between w-full px-1 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => {
                  const isActive = Boolean(retentionStreak?.streakDaysOfWeek?.[idx]);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner border ${isActive
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white"
                            : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                      >
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 mt-2">
                <h2 className="text-2xl font-black text-white leading-tight">
                  {currentStreak} Day Streak!
                </h2>
                <p className="text-xs font-bold text-slate-300 leading-relaxed px-4">
                  Your longest streak is {longestStreak} days. Keep up the consistency!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#57fae9] to-[#00c9b7] text-[#141779] font-black text-xs shadow-[0_4px_15px_rgba(87,250,233,0.3)] uppercase tracking-wider active:scale-95 transition-all mt-4 z-10 border-0"
            >
              Awesome!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
