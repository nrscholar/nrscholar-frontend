import { motion } from "framer-motion";

interface MonsterCharacterProps {
  className?: string;
  /** "idle" | "attack" | "hurt" */
  state?: "idle" | "attack" | "hurt";
}

export default function MonsterCharacter({ className = "", state = "idle" }: MonsterCharacterProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={
        state === "hurt"
          ? { x: [-6, 6, -6, 6, 0], filter: ["brightness(1)", "brightness(3) saturate(0)", "brightness(1)"] }
          : state === "attack"
          ? { scale: [1, 1.3, 1], y: [0, -10, 0] }
          : { y: [0, -8, 0], scale: [1, 1.03, 1] }
      }
      transition={
        state === "idle"
          ? { repeat: Infinity, duration: 3, ease: "easeInOut" }
          : { duration: 0.6 }
      }
    >
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="monsterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="monsterBodyGrad" cx="35%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#e17055" />
            <stop offset="100%" stopColor="#ba1a1a" />
          </radialGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffff00" />
            <stop offset="100%" stopColor="#ff8c00" />
          </radialGradient>
        </defs>

        {/* Red glow aura */}
        <motion.ellipse
          cx="60" cy="78" rx="40" ry="20"
          fill="url(#monsterGlow)"
          animate={{ opacity: [0.4, 0.9, 0.4], ry: [20, 26, 20] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Shadow */}
        <ellipse cx="60" cy="100" rx="28" ry="8" fill="#7f0000" opacity="0.3" />

        {/* Body */}
        <ellipse cx="60" cy="76" rx="28" ry="24" fill="url(#monsterBodyGrad)" />

        {/* Belly (lighter) */}
        <ellipse cx="60" cy="80" rx="16" ry="14" fill="#e17055" opacity="0.5" />

        {/* Spikes on back */}
        <path d="M 38 60 L 32 44 L 42 58" fill="#7f0000" />
        <path d="M 50 55 L 46 38 L 56 54" fill="#7f0000" />
        <path d="M 62 54 L 60 36 L 68 54" fill="#7f0000" />
        <path d="M 74 56 L 74 40 L 80 56" fill="#7f0000" />
        <path d="M 84 62 L 88 46 L 90 62" fill="#7f0000" />

        {/* Head */}
        <circle cx="60" cy="48" r="26" fill="url(#monsterBodyGrad)" />

        {/* Horns */}
        <path d="M 42 28 L 36 8 L 46 26" fill="#7f0000" />
        <path d="M 78 28 L 84 8 L 74 26" fill="#7f0000" />
        {/* Horn tips */}
        <path d="M 36 8 L 40 14 L 44 8 Z" fill="#ff4444" opacity="0.7" />
        <path d="M 76 8 L 80 14 L 84 8 Z" fill="#ff4444" opacity="0.7" />

        {/* Angry brow */}
        <path d="M 36 36 L 50 40" stroke="#7f0000" strokeWidth="4" strokeLinecap="round" />
        <path d="M 84 36 L 70 40" stroke="#7f0000" strokeWidth="4" strokeLinecap="round" />

        {/* Eye glow */}
        <motion.circle
          cx="46" cy="44" r="9"
          fill="url(#eyeGlow)"
          animate={{ opacity: [0.8, 1, 0.8], r: [9, 10, 9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.circle
          cx="74" cy="44" r="9"
          fill="url(#eyeGlow)"
          animate={{ opacity: [0.8, 1, 0.8], r: [9, 10, 9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Pupils */}
        <motion.g
          animate={{ scaleY: [1, 0.15, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.5, 1], ease: "easeInOut", repeatDelay: 3 }}
          style={{ transformOrigin: "60px 44px" }}
        >
          <circle cx="47" cy="45" r="5" fill="#1a0000" />
          <circle cx="75" cy="45" r="5" fill="#1a0000" />
          {/* Red eye shine */}
          <circle cx="49" cy="43" r="2" fill="#ff6666" opacity="0.6" />
          <circle cx="77" cy="43" r="2" fill="#ff6666" opacity="0.6" />
        </motion.g>

        {/* Scary nose */}
        <path d="M 55 54 L 60 58 L 65 54" fill="#7f0000" />

        {/* Big scary mouth */}
        <path d="M 38 64 Q 60 76 82 64" fill="#5a0000" />

        {/* Teeth (top) */}
        <path d="M 44 64 L 44 71 L 50 64 Z" fill="white" />
        <path d="M 54 65 L 52 73 L 60 65 Z" fill="white" />
        <path d="M 66 65 L 68 73 L 74 64 Z" fill="white" />
        <path d="M 76 64 L 74 71 L 80 64 Z" fill="white" />

        {/* Arms */}
        <path d="M 32 72 Q 18 80 16 92 Q 22 96 28 88 Q 30 82 34 78" fill="url(#monsterBodyGrad)" />
        <path d="M 88 72 Q 102 80 104 92 Q 98 96 92 88 Q 90 82 86 78" fill="url(#monsterBodyGrad)" />

        {/* Claws */}
        <path d="M 16 92 L 12 98 L 16 96 L 18 102 L 22 96 L 24 100 L 26 94 Z" fill="#7f0000" />
        <path d="M 104 92 L 108 98 L 104 96 L 102 102 L 98 96 L 96 100 L 94 94 Z" fill="#7f0000" />

        {/* Attack energy effect */}
        {state === "attack" && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: "60px 60px" }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.line
                key={i}
                x1="60" y1="60"
                x2={60 + Math.cos((angle * Math.PI) / 180) * 50}
                y2={60 + Math.sin((angle * Math.PI) / 180) * 50}
                stroke="#ff4400"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              />
            ))}
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
