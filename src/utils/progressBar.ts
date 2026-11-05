import type { CSSProperties } from "react";

export const PROGRESS_PRIMARY = "#141779";
export const PROGRESS_ACCENT = "#57fae9";
/** Tailwind classes for the track behind a progress fill. */
export const PROGRESS_TRACK_CLASS = "bg-slate-100";

/**
 * Shared style for a progress-bar fill (same look as the Profile "Level progress" bar).
 * - pct <= 25: solid primary colour (no gradient yet)
 * - pct  > 25: primary colour, then the gradient to the accent starts at the 25% mark of the track.
 */
export function progressFillStyle(percent: number): CSSProperties {
  const pct = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  if (pct <= 25) {
    return { width: `${pct}%`, background: PROGRESS_PRIMARY };
  }
  const stop = (25 / pct) * 100;
  return {
    width: `${pct}%`,
    background: `linear-gradient(to right, ${PROGRESS_PRIMARY} 0%, ${PROGRESS_PRIMARY} ${stop.toFixed(2)}%, ${PROGRESS_ACCENT} 100%)`,
  };
}
