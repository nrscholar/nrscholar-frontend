import React from "react";

type MedalTier = "bronze" | "silver" | "gold";

const MEDAL_COLORS: Record<MedalTier, { a: string; b: string; ribbon: string; ribbon2: string }> = {
  bronze: { a: "#F6B67A", b: "#B45309", ribbon: "#2563EB", ribbon2: "#1E3A8A" },
  silver: { a: "#F1F5F9", b: "#94A3B8", ribbon: "#7C3AED", ribbon2: "#4C1D95" },
  gold: { a: "#FDE68A", b: "#D97706", ribbon: "#DC2626", ribbon2: "#7F1D1D" },
};

/** Friendly scientist character (lab coat, goggles, flask). */
export function ScientistSVG({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="Scientist">
      <defs>
        <linearGradient id="sciCoat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>
      {/* hair */}
      <path d="M17 26c0-10 6-16 15-16s15 6 15 16c-3-5-8-7-15-7s-12 2-15 7z" fill="#3B2A20" />
      {/* face */}
      <circle cx="32" cy="29" r="12" fill="#FFD7B5" />
      {/* goggles */}
      <rect x="18" y="22" width="28" height="4" rx="2" fill="#141779" />
      <circle cx="26" cy="25" r="5" fill="#BAE6FD" stroke="#141779" strokeWidth="2" />
      <circle cx="38" cy="25" r="5" fill="#BAE6FD" stroke="#141779" strokeWidth="2" />
      <circle cx="26" cy="25" r="1.6" fill="#141779" />
      <circle cx="38" cy="25" r="1.6" fill="#141779" />
      {/* smile */}
      <path d="M27 34c2 2.5 8 2.5 10 0" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* lab coat */}
      <path d="M12 60c0-11 7-17 20-17s20 6 20 17z" fill="url(#sciCoat)" stroke="#141779" strokeWidth="1.5" />
      <path d="M32 43l-5 8 5 9 5-9z" fill="#141779" opacity="0.12" />
      <path d="M32 43v17" stroke="#141779" strokeWidth="1.2" opacity="0.4" />
      {/* flask */}
      <path d="M47 38h5v6l5 9a2.5 2.5 0 0 1-2.2 3.7H44.2A2.5 2.5 0 0 1 42 53l5-9z" fill="#34D399" stroke="#141779" strokeWidth="1.5" />
      <rect x="46" y="36" width="7" height="3" rx="1" fill="#141779" />
      <circle cx="49" cy="51" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="52" cy="48" r="1" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/** Medal icon with the class number. Bronze = Class 8, Silver = Class 9, Gold = Class 10. */
export function MedalSVG({ tier = "gold", size = 48, className = "", label }: { tier?: MedalTier; size?: number; className?: string; label?: string }) {
  const c = MEDAL_COLORS[tier];
  const id = `medal-${tier}`;
  const text = label ?? (tier === "bronze" ? "8" : tier === "silver" ? "9" : "10");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={`${tier} medal ${text}`}>
      <defs>
        <linearGradient id={`${id}-coin`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
      </defs>
      {/* ribbon (crossed V) */}
      <path d="M46 3H34L26 31h11z" fill={c.ribbon2} />
      <path d="M18 3h12l8 28H27z" fill={c.ribbon} />
      <path d="M18 3h12l1.6 5.6H19.6z" fill="#fff" fillOpacity="0.25" />
      <path d="M34 3h12l-1.6 5.6H32.4z" fill="#fff" fillOpacity="0.18" />
      {/* coin */}
      <circle cx="32" cy="43" r="18" fill={`url(#${id}-coin)`} stroke={c.b} strokeWidth="2" />
      <circle cx="32" cy="43" r="13.5" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" />
      <circle cx="32" cy="43" r="13.5" fill="#000" fillOpacity="0.06" />
      <path d="M21 36a13 13 0 0 1 9-5.5" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <text
        x="32"
        y="48.5"
        textAnchor="middle"
        fontSize={text.length > 1 ? 15 : 18}
        fontWeight="900"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fill="#fff"
        stroke={c.b}
        strokeWidth="0.8"
        paintOrder="stroke"
      >
        {text}
      </text>
    </svg>
  );
}

/** Pick the right character for a standard (class). */
export function ClassCharacterSVG({ classLevel, size = 48, className = "" }: { classLevel: number; size?: number; className?: string }) {
  if (classLevel === 8) return <MedalSVG tier="bronze" size={size} className={className} />;
  if (classLevel === 9) return <MedalSVG tier="silver" size={size} className={className} />;
  if (classLevel >= 10) return <MedalSVG tier="gold" size={size} className={className} />;
  return <ScientistSVG size={size} className={className} />;
}

export default ClassCharacterSVG;
