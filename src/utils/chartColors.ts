/**
 * Multi-Series Chart & Graph Color Utilities
 * 
 * Provides a curated, distinct, high-contrast color palette for multi-subject 
 * graphs and charts across Parent Dashboard and Learning Reports.
 */

export interface ChartColorEntry {
  color: string;
  bg: string;
  border: string;
  bar: string;
  name: string; 
}

// 10 distinct, high-contrast base colors spanning the full color wheel (no overlapping hues)
export const DISTINCT_SUBJECT_PALETTE: ChartColorEntry[] = [
  {
    name: "Royal Blue",
    color: "#2563eb",
    bg: "bg-blue-50 text-blue-900 border-blue-200",
    border: "#93c5fd",
    bar: "bg-blue-600"
  },
  {
    name: "Emerald Green",
    color: "#059669",
    bg: "bg-emerald-50 text-emerald-900 border-emerald-200",
    border: "#a7f3d0",
    bar: "bg-emerald-600"
  },
  {
    name: "Vibrant Purple",
    color: "#7c3aed",
    bg: "bg-purple-50 text-purple-900 border-purple-200",
    border: "#d8b4fe",
    bar: "bg-purple-600"
  },
  {
    name: "Warm Amber",
    color: "#d97706",
    bg: "bg-amber-50 text-amber-900 border-amber-200",
    border: "#fde68a",
    bar: "bg-amber-600"
  },
  {
    name: "Deep Cyan / Teal",
    color: "#0891b2",
    bg: "bg-cyan-50 text-cyan-900 border-cyan-200",
    border: "#a5f3fc",
    bar: "bg-cyan-600"
  },
  {
    name: "Vibrant Crimson Rose",
    color: "#e11d48",
    bg: "bg-rose-50 text-rose-900 border-rose-200",
    border: "#fecdd3",
    bar: "bg-rose-600"
  },
  {
    name: "Electric Indigo",
    color: "#4f46e5",
    bg: "bg-indigo-50 text-indigo-900 border-indigo-200",
    border: "#c7d2fe",
    bar: "bg-indigo-600"
  },
  {
    name: "Radiant Fuchsia",
    color: "#c026d3",
    bg: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200",
    border: "#f5d0fe",
    bar: "bg-fuchsia-600"
  },
  {
    name: "Forest Jade",
    color: "#15803d",
    bg: "bg-green-50 text-green-900 border-green-200",
    border: "#bbf7d0",
    bar: "bg-green-600"
  },
  {
    name: "Sunset Orange",
    color: "#ea580c",
    bg: "bg-orange-50 text-orange-900 border-orange-200",
    border: "#fed7aa",
    bar: "bg-orange-600"
  }
];

// Consistent subject name signature mapping (across English, Gujarati, Hindi terms)
const SUBJECT_SIGNATURE_MAP: Record<string, ChartColorEntry> = {
  // Mathematics -> Royal Blue
  mathematics: DISTINCT_SUBJECT_PALETTE[0],
  maths: DISTINCT_SUBJECT_PALETTE[0],
  math: DISTINCT_SUBJECT_PALETTE[0],
  "ગણિત": DISTINCT_SUBJECT_PALETTE[0],
  "गणित": DISTINCT_SUBJECT_PALETTE[0],

  // Science -> Emerald Green
  science: DISTINCT_SUBJECT_PALETTE[1],
  sci: DISTINCT_SUBJECT_PALETTE[1],
  "વિજ્ઞાન": DISTINCT_SUBJECT_PALETTE[1],
  "विज्ञान": DISTINCT_SUBJECT_PALETTE[1],

  // English -> Vibrant Purple
  english: DISTINCT_SUBJECT_PALETTE[2],
  eng: DISTINCT_SUBJECT_PALETTE[2],
  "અંગ્રેજી": DISTINCT_SUBJECT_PALETTE[2],
  "अंग्रेजी": DISTINCT_SUBJECT_PALETTE[2],

  // Gujarati -> Warm Amber
  gujarati: DISTINCT_SUBJECT_PALETTE[3],
  guj: DISTINCT_SUBJECT_PALETTE[3],
  "ગુજરાતી": DISTINCT_SUBJECT_PALETTE[3],

  // Hindi -> Deep Cyan / Teal
  hindi: DISTINCT_SUBJECT_PALETTE[4],
  hin: DISTINCT_SUBJECT_PALETTE[4],
  "હિન્દી": DISTINCT_SUBJECT_PALETTE[4],
  "हिन्दी": DISTINCT_SUBJECT_PALETTE[4],

  // Social Studies -> Vibrant Crimson Rose
  "social studies": DISTINCT_SUBJECT_PALETTE[5],
  "social_studies": DISTINCT_SUBJECT_PALETTE[5],
  sst: DISTINCT_SUBJECT_PALETTE[5],
  "સામાજિક વિજ્ઞાન": DISTINCT_SUBJECT_PALETTE[5],
  "सामाजिक विज्ञान": DISTINCT_SUBJECT_PALETTE[5],
  history: DISTINCT_SUBJECT_PALETTE[5],

  // Geography -> Sunset Orange
  geography: DISTINCT_SUBJECT_PALETTE[9],
  "ભૂગોળ": DISTINCT_SUBJECT_PALETTE[9],

  // EVS -> Forest Jade
  evs: DISTINCT_SUBJECT_PALETTE[8],
  environmental: DISTINCT_SUBJECT_PALETTE[8],
  "પર્યાવરણ": DISTINCT_SUBJECT_PALETTE[8],
  "पर्यावरण": DISTINCT_SUBJECT_PALETTE[8],

  // Computer / Tech -> Electric Indigo
  computer: DISTINCT_SUBJECT_PALETTE[6],
  coding: DISTINCT_SUBJECT_PALETTE[6],

  // General Knowledge -> Radiant Fuchsia
  gk: DISTINCT_SUBJECT_PALETTE[7],
  "general knowledge": DISTINCT_SUBJECT_PALETTE[7]
};

/**
 * Returns a distinct, high-contrast color entry for any subject.
 * Matches known subjects to signature colors, or falls back to the distinct palette.
 * If a category is specified (strengths, risks, weaknesses), returns the category shade.
 */
export function getSubjectChartColor(
  subjectName?: string, 
  index = 0, 
  category?: string
): ChartColorEntry {
  if (category && isCategoryTrendMode(category)) {
    return getCategorySubjectChartColor(category, index);
  }
  if (subjectName) {
    const key = subjectName.toLowerCase().trim();
    if (SUBJECT_SIGNATURE_MAP[key]) {
      return SUBJECT_SIGNATURE_MAP[key];
    }
    for (const [subjKey, entry] of Object.entries(SUBJECT_SIGNATURE_MAP)) {
      if (key.includes(subjKey) || subjKey.includes(key)) {
        return entry;
      }
    }
  }
  return DISTINCT_SUBJECT_PALETTE[index % DISTINCT_SUBJECT_PALETTE.length];
}

/**
 * Dedicated Categorical Color Families for 7-Day Trend Graphs:
 * 
 * - Strength Category: High-contrast shades of Green
 * - Risk Category: High-contrast shades of Yellow / Amber
 * - Weakness Category: High-contrast shades of Red
 * 
 * Provides alternating luminance, warmth, and hue steps for unmistakable
 * visual differentiation when multiple subjects fall under the same category.
 */
export const STRENGTH_GREEN_SHADES: ChartColorEntry[] = [
  {
    name: "Emerald Green",
    color: "#059669",
    bg: "bg-emerald-50 text-emerald-950 border-emerald-300",
    border: "#6ee7b7",
    bar: "bg-emerald-600"
  },
  {
    name: "Dark Forest Green",
    color: "#166534",
    bg: "bg-green-100 text-green-950 border-green-400",
    border: "#86efac",
    bar: "bg-green-800"
  },
  {
    name: "Bright Jade Mint",
    color: "#10b981",
    bg: "bg-teal-50 text-teal-950 border-teal-300",
    border: "#a7f3d0",
    bar: "bg-teal-500"
  },
  {
    name: "Lime Chartreuse",
    color: "#65a30d",
    bg: "bg-lime-50 text-lime-950 border-lime-300",
    border: "#bef264",
    bar: "bg-lime-600"
  },
  {
    name: "Deep Spruce Teal",
    color: "#0f766e",
    bg: "bg-emerald-100 text-teal-950 border-teal-400",
    border: "#5eead4",
    bar: "bg-teal-700"
  },
  {
    name: "Deep Pine",
    color: "#065f46",
    bg: "bg-emerald-50 text-emerald-900 border-emerald-200",
    border: "#34d399",
    bar: "bg-emerald-700"
  }
];

export const RISK_AMBER_SHADES: ChartColorEntry[] = [
  {
    name: "Warm Amber",
    color: "#d97706",
    bg: "bg-amber-50 text-amber-950 border-amber-300",
    border: "#fcd34d",
    bar: "bg-amber-600"
  },
  {
    name: "Deep Bronze Russet",
    color: "#92400e",
    bg: "bg-amber-100 text-amber-950 border-amber-400",
    border: "#fde68a",
    bar: "bg-amber-800"
  },
  {
    name: "Golden Honey",
    color: "#ca8a04",
    bg: "bg-yellow-50 text-yellow-950 border-yellow-300",
    border: "#fde047",
    bar: "bg-yellow-600"
  },
  {
    name: "Bright Tangerine Amber",
    color: "#f59e0b",
    bg: "bg-orange-50 text-amber-950 border-orange-300",
    border: "#fed7aa",
    bar: "bg-orange-500"
  },
  {
    name: "Dark Ochre Brown",
    color: "#78350f",
    bg: "bg-yellow-100 text-yellow-950 border-yellow-500",
    border: "#fbbf24",
    bar: "bg-yellow-900"
  },
  {
    name: "Rich Caramel",
    color: "#b45309",
    bg: "bg-amber-50 text-amber-900 border-amber-200",
    border: "#f59e0b",
    bar: "bg-amber-700"
  }
];

export const WEAKNESS_RED_SHADES: ChartColorEntry[] = [
  {
    name: "Crimson Red",
    color: "#dc2626",
    bg: "bg-red-50 text-red-950 border-red-300",
    border: "#fca5a5",
    bar: "bg-red-600"
  },
  {
    name: "Deep Burgundy Maroon",
    color: "#991b1b",
    bg: "bg-red-100 text-red-950 border-red-400",
    border: "#f87171",
    bar: "bg-red-800"
  },
  {
    name: "Vibrant Rose Berry",
    color: "#e11d48",
    bg: "bg-rose-50 text-rose-950 border-rose-300",
    border: "#fda4af",
    bar: "bg-rose-600"
  },
  {
    name: "Fiery Coral Red",
    color: "#ea580c",
    bg: "bg-rose-100 text-rose-950 border-orange-300",
    border: "#fecdd3",
    bar: "bg-orange-600"
  },
  {
    name: "Deep Ruby Wine",
    color: "#881337",
    bg: "bg-pink-100 text-rose-950 border-pink-400",
    border: "#fb7185",
    bar: "bg-rose-900"
  },
  {
    name: "Bright Scarlet Red",
    color: "#ef4444",
    bg: "bg-red-50 text-red-900 border-red-200",
    border: "#f87171",
    bar: "bg-red-500"
  }
];

/**
 * Returns a category-specific color entry from the dedicated color family.
 * - Strengths: Distinct shades of Green
 * - Risks: Distinct shades of Yellow / Amber
 * - Weaknesses: Distinct shades of Red
 */
export function getCategorySubjectChartColor(
  category: "strengths" | "weaknesses" | "risks" | string,
  index = 0
): ChartColorEntry {
  const normCategory = (category || "").toLowerCase().trim();
  if (normCategory === "strengths" || normCategory === "strength") {
    return STRENGTH_GREEN_SHADES[index % STRENGTH_GREEN_SHADES.length];
  }
  if (normCategory === "risks" || normCategory === "risk") {
    return RISK_AMBER_SHADES[index % RISK_AMBER_SHADES.length];
  }
  if (normCategory === "weaknesses" || normCategory === "weakness") {
    return WEAKNESS_RED_SHADES[index % WEAKNESS_RED_SHADES.length];
  }
  return DISTINCT_SUBJECT_PALETTE[index % DISTINCT_SUBJECT_PALETTE.length];
}

/**
 * Returns whether a given mode is one of the dedicated category trend graph views.
 */
export function isCategoryTrendMode(mode?: string): boolean {
  if (!mode) return false;
  const m = mode.toLowerCase().trim();
  return m === "strengths" || m === "strength" ||
         m === "weaknesses" || m === "weakness" ||
         m === "risks" || m === "risk";
}

/**
 * High shade-contrast palette when theme constraints require single color families,
 * ensuring adjacent lines have clearly noticeable luminance/contrast steps.
 */
export const THEMED_HIGH_CONTRAST_SHADES = {
  strengths: STRENGTH_GREEN_SHADES.map(s => s.color),
  risks: RISK_AMBER_SHADES.map(s => s.color),
  weaknesses: WEAKNESS_RED_SHADES.map(s => s.color)
};

/**
 * Line dash patterns for additional visual differentiation between overlapping lines
 */
export const MULTI_LINE_DASH_PATTERNS = [
  "none",        // Solid
  "none",        // Solid (with distinct points)
  "6 3",         // Long dash
  "2 2",         // Fine dots
  "8 3 2 3"      // Dash-dot
];
