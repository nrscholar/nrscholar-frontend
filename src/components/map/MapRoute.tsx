import React from "react";
import { motion } from "framer-motion";
import { MapLocationConfig, NRSCHOLAR_COLORS } from "./AdventureTheme";

interface MapRouteProps {
  locations: MapLocationConfig[];
  currentIndex?: number;
  isIlluminated?: boolean;
}

export default function MapRoute({
  locations,
  currentIndex = 0,
  isIlluminated = true,
}: MapRouteProps) {
  if (!locations || locations.length < 2) return null;

  // Generate smooth SVG cubic bezier path string connecting locations in order
  const generatePathD = (): string => {
    let d = `M ${locations[0].x * 3.5} ${locations[0].y * 6.5}`;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      const cx1 = (prev.x * 3.5 + curr.x * 3.5) / 2;
      const cy1 = prev.y * 6.5;
      const cx2 = (prev.x * 3.5 + curr.x * 3.5) / 2;
      const cy2 = curr.y * 6.5;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x * 3.5} ${curr.y * 6.5}`;
    }
    return d;
  };

  const pathD = generatePathD();

  return (
    <svg viewBox="0 0 350 650" className="w-full h-full absolute inset-0 pointer-events-none z-0">
      {/* 1. Lighter Dotted Path for Future Locations */}
      <path
        d={pathD}
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeDasharray="4 8"
        strokeLinecap="round"
      />

      {/* 2. Clearly Visible Turquoise (#14C8C6) Magical Trail for Current -> Next Location */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={NRSCHOLAR_COLORS.secondary}
        strokeWidth="3.5"
        strokeDasharray="6 8"
        strokeDashoffset={1000 - Math.min(950, ((currentIndex + 1) / locations.length) * 1000)}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: isIlluminated ? 1 : 0.4 }}
        transition={{ duration: 1 }}
      />

      {/* 3. Tiny Footstep / Sparkle Trail Markers along the Active Segment */}
      {locations.slice(0, Math.min(locations.length, currentIndex + 2)).map((loc, idx) => {
        if (idx === 0) return null;
        const prev = locations[idx - 1];
        const midX = (prev.x + loc.x) / 2;
        const midY = (prev.y + loc.y) / 2;

        return (
          <g key={`trail_${idx}`}>
            {/* Tiny Footstep Dot 1 */}
            <circle
              cx={midX * 3.5 - 6}
              cy={midY * 6.5 - 4}
              r="2.5"
              fill={NRSCHOLAR_COLORS.secondary}
              opacity="0.8"
            />
            {/* Tiny Footstep Dot 2 */}
            <circle
              cx={midX * 3.5 + 6}
              cy={midY * 6.5 + 4}
              r="2.5"
              fill={NRSCHOLAR_COLORS.secondary}
              opacity="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
}
