import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useLockBodyScroll } from "../utils/useLockBodyScroll";

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const CONFETTI_COLORS = ["#FFC83D", "#35E5D4", "#FF6B8B", "#8B8CFF", "#FFFFFF", "#45D483"];

export default function LevelUpModal({
  isOpen,
  level,
  onClose,
  title = "LEVEL UP!",
  subtitle = "You are getting stronger. Keep learning to unlock new rewards!",
  buttonText = "Awesome!",
}: LevelUpModalProps) {
  useLockBodyScroll(isOpen);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 110 + (i % 5) * 28;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          size: 6 + (i % 4) * 2,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          rotate: (i * 47) % 360,
          delay: (i % 7) * 0.03,
          round: i % 3 === 0,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
          style={{ touchAction: "none" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] rounded-[32px] bg-gradient-to-br from-[#111453] via-[#141779] to-[#0b0c3f] text-white border border-white/15 shadow-[0_24px_60px_rgba(20,23,121,0.6)] px-6 pt-10 pb-6 text-center flex flex-col items-center gap-4 overflow-hidden"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Rotating light rays */}
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              className="absolute left-1/2 top-[108px] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-30 pointer-events-none"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.55) 0deg 8deg, transparent 8deg 24deg)",
                WebkitMaskImage: "radial-gradient(circle, black 10%, transparent 68%)",
                maskImage: "radial-gradient(circle, black 10%, transparent 68%)",
              }}
            />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-400/25 blur-3xl pointer-events-none" />

            {/* Badge + confetti burst */}
            <div className="relative w-36 h-36 flex items-center justify-center z-10">
              {confetti.map((c) => (
                <motion.span
                  key={c.id}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ x: c.x, y: c.y + 40, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.6], rotate: c.rotate + 360 }}
                  transition={{ duration: 1.6, delay: 0.25 + c.delay, ease: "easeOut" }}
                  className="absolute"
                  style={{
                    width: c.size,
                    height: c.size,
                    background: c.color,
                    borderRadius: c.round ? "9999px" : "2px",
                  }}
                />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
                className="relative w-32 h-32"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-[0_10px_24px_rgba(255,200,61,0.55)]">
                    <defs>
                      <linearGradient id="lvlRing" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#FFE58A" />
                        <stop offset="1" stopColor="#E08A00" />
                      </linearGradient>
                      <radialGradient id="lvlFace" cx="0.35" cy="0.3" r="0.9">
                        <stop offset="0" stopColor="#3B3FD6" />
                        <stop offset="1" stopColor="#141779" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M64 6l15 11 19-2 6 18 17 9-3 19 8 17-13 14 0 19-19 3-12 15-18-7-18 7-12-15-19-3 0-19L1 80l8-17-3-19 17-9 6-18 19 2z"
                      fill="url(#lvlRing)"
                    />
                    <circle cx="64" cy="64" r="43" fill="url(#lvlFace)" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" />
                  </svg>
                </motion.div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black tracking-[0.25em] text-[#FFE58A] leading-none mb-0.5">LEVEL</span>
                  <motion.span
                    key={level}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.45 }}
                    className="text-5xl font-black text-white leading-none drop-shadow-md"
                  >
                    {level}
                  </motion.span>
                </div>
                {/* shine sweep */}
                <motion.div
                  aria-hidden
                  initial={{ x: -140, opacity: 0 }}
                  animate={{ x: 140, opacity: [0, 0.8, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 1.6, duration: 1, delay: 0.8 }}
                  className="absolute top-0 bottom-0 w-8 bg-white/50 -skew-x-12 blur-sm pointer-events-none"
                  style={{ clipPath: "circle(48% at 50% 50%)" }}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="z-10 space-y-1.5"
            >
              <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                <Sparkles size={22} className="text-[#FFC83D]" />
                {title}
                <Sparkles size={22} className="text-[#FFC83D]" />
              </h2>
              <p className="text-xs font-bold text-slate-200 leading-relaxed px-2">{subtitle}</p>
            </motion.div>

            <motion.button
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-[#141779] font-black text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(20,23,121,0.45)] z-10 mt-1 cursor-pointer"
            >
              {buttonText}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
