import { motion } from "framer-motion";

interface DragonCharacterProps {
  className?: string;
  /** "idle" | "attack" | "hurt" */
  state?: "idle" | "attack" | "hurt";
  flipped?: boolean;
}

export default function DragonCharacter({ className = "", state = "idle", flipped = false }: DragonCharacterProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      animate={
        state === "hurt"
          ? { x: [-4, 4, -4, 4, 0], filter: ["brightness(1)", "brightness(0.4) saturate(3)", "brightness(1)"] }
          : state === "attack"
          ? { x: [0, 12, 0], scale: [1, 1.15, 1] }
          : { y: [0, -6, 0] }
      }
      transition={
        state === "idle"
          ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
          : { duration: 0.5 }
      }
    >
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="dragonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00b894" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bodyGrad" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#55efc4" />
            <stop offset="100%" stopColor="#00b894" />
          </radialGradient>
          <radialGradient id="wingGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#81ecec" />
            <stop offset="100%" stopColor="#00cec9" />
          </radialGradient>
        </defs>

        {/* Glow Aura */}
        <motion.ellipse
          cx="60" cy="70" rx="38" ry="18"
          fill="url(#dragonGlow)"
          animate={{ opacity: [0.5, 1, 0.5], ry: [18, 22, 18] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        />

        {/* Left Wing */}
        <motion.path
          d="M 30 62 L 4 34 L 10 48 L 2 58 L 28 70 Z"
          fill="url(#wingGrad)"
          stroke="#00b894" strokeWidth="1"
          animate={{ rotate: [-6, 6, -6], originX: "30px", originY: "65px" }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          style={{ transformOrigin: "30px 65px" }}
        />
        {/* Right Wing */}
        <motion.path
          d="M 90 62 L 116 34 L 110 48 L 118 58 L 92 70 Z"
          fill="url(#wingGrad)"
          stroke="#00b894" strokeWidth="1"
          animate={{ rotate: [6, -6, 6], originX: "90px", originY: "65px" }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          style={{ transformOrigin: "90px 65px" }}
        />

        {/* Body */}
        <ellipse cx="60" cy="74" rx="26" ry="20" fill="url(#bodyGrad)" />

        {/* Belly */}
        <ellipse cx="60" cy="76" rx="16" ry="12" fill="#b2f5ea" opacity="0.7" />

        {/* Tail */}
        <path d="M 76 86 Q 100 95 96 108 Q 84 112 80 100 Q 78 94 76 88" fill="#00b894" />
        <path d="M 96 108 L 104 112 L 100 118 L 92 110 Z" fill="#55efc4" />

        {/* Neck */}
        <ellipse cx="60" cy="57" rx="14" ry="10" fill="url(#bodyGrad)" />

        {/* Head */}
        <circle cx="60" cy="40" r="22" fill="url(#bodyGrad)" />

        {/* Snout */}
        <ellipse cx="60" cy="50" rx="10" ry="7" fill="#00b894" />

        {/* Nostrils */}
        <ellipse cx="56" cy="52" rx="2" ry="1.5" fill="#007a5e" />
        <ellipse cx="64" cy="52" rx="2" ry="1.5" fill="#007a5e" />

        {/* Eye whites */}
        <circle cx="48" cy="36" r="7" fill="white" />
        <circle cx="72" cy="36" r="7" fill="white" />

        {/* Pupils */}
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.5, 1], ease: "easeInOut", repeatDelay: 2 }}
          style={{ transformOrigin: "60px 36px" }}
        >
          <circle cx="49" cy="37" r="4" fill="#1a1a2e" />
          <circle cx="73" cy="37" r="4" fill="#1a1a2e" />
          {/* Eye shine */}
          <circle cx="51" cy="35" r="1.5" fill="white" />
          <circle cx="75" cy="35" r="1.5" fill="white" />
        </motion.g>

        {/* Horns */}
        <path d="M 48 20 L 43 4 L 53 18" fill="#55efc4" />
        <path d="M 72 20 L 77 4 L 67 18" fill="#55efc4" />

        {/* Scales on back */}
        <path d="M 52 22 L 56 16 L 60 22" fill="#00cec9" opacity="0.6" />
        <path d="M 60 20 L 64 14 L 68 20" fill="#00cec9" opacity="0.6" />

        {/* Smile */}
        <path d="M 53 52 Q 60 57 67 52" fill="none" stroke="#007a5e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Fire breath when attacking */}
        {state === "attack" && (
          <motion.g
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1.2, 0] }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "80px 52px" }}
          >
            <ellipse cx="92" cy="52" rx="14" ry="6" fill="#ff6b00" opacity="0.9" />
            <ellipse cx="104" cy="52" rx="10" ry="4" fill="#ffcc00" opacity="0.8" />
            <ellipse cx="114" cy="52" rx="6" ry="3" fill="#ff4400" opacity="0.6" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
