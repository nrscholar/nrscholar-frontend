import React from "react";
import { motion } from "framer-motion";
import { MapStageConfig, NRSCHOLAR_TOKENS } from "./AdventureTheme";

interface MapPathTrailProps {
  stages: MapStageConfig[];
  currentStageIndex: number;
}

export default function MapPathTrail({
  stages,
  currentStageIndex,
}: MapPathTrailProps) {
  if (!stages || stages.length < 2) return null;

  // Build SVG cubic bezier path string
  const buildPathD = (): string => {
    let d = `M ${stages[0].x * 3.7} ${stages[0].y * 6.8}`;
    for (let i = 1; i < stages.length; i++) {
      const prev = stages[i - 1];
      const curr = stages[i];
      const cx1 = (prev.x * 3.7 + curr.x * 3.7) / 2;
      const cy1 = prev.y * 6.8;
      const cx2 = (prev.x * 3.7 + curr.x * 3.7) / 2;
      const cy2 = curr.y * 6.8;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x * 3.7} ${curr.y * 6.8}`;
    }
    return d;
  };

  const pathD = buildPathD();
  const progressRatio = Math.min(1, (currentStageIndex + 0.5) / (stages.length - 1));

  return (
    <svg viewBox="0 0 370 680" className="w-full h-full absolute inset-0 pointer-events-none z-0">
      <defs>
        {/* Soft Drop Shadow for Path */}
        <filter id="pathShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2D328F" floodOpacity="0.15" />
        </filter>
        {/* Glowing Turquoise Gradient */}
        <linearGradient id="activeTrailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14C8C6" />
          <stop offset="100%" stopColor="#2D328F" />
        </linearGradient>
      </defs>

      {/* 1. Base Trail (Cobblestone / Path Outer Shell) */}
      <path
        d={pathD}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#pathShadow)"
      />

      {/* 2. Path Inner Track */}
      <path
        d={pathD}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Active Progress Path in Turquoise/Indigo */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#activeTrailGrad)"
        strokeWidth="12"
        strokeDasharray="1200"
        strokeDashoffset={1200 * (1 - progressRatio)}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDashoffset: 1200 }}
        animate={{ strokeDashoffset: 1200 * (1 - progressRatio) }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* 4. Animated Glowing Dots along the Path */}
      {stages.slice(0, currentStageIndex + 1).map((stg, idx) => {
        if (idx === 0) return null;
        const prev = stages[idx - 1];
        const midX = (prev.x + stg.x) / 2;
        const midY = (prev.y + stg.y) / 2;

        return (
          <g key={`dot_${idx}`}>
            <circle
              cx={midX * 3.7}
              cy={midY * 6.8}
              r="4"
              fill={NRSCHOLAR_TOKENS.secondary}
            />
            <circle
              cx={midX * 3.7}
              cy={midY * 6.8}
              r="7"
              fill={NRSCHOLAR_TOKENS.secondary}
              opacity="0.3"
            />
          </g>
        );
      })}
    </svg>
  );
}
