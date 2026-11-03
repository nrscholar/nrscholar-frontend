import React from "react";
import NRScholarLogo from "./NRScholarLogo";

export interface NRScholarNavBrandProps {
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
}

/**
 * Standardized Header Component Pattern for Auth Screens:
 * - Back button (optional / conditional): text-[#1E255E] hover:opacity-80
 * - Inline Brand Title Row:
 *   - Official Book-Scholar SVG Icon (28px x 28px, w-7 h-7)
 *   - Brand Title: "N R Scholar" font-bold text-base md:text-lg text-[#1E255E] whitespace-nowrap
 * - Horizontal baseline alignment (inline-flex items-center gap-2)
 */
export const NRScholarNavBrand: React.FC<NRScholarNavBrandProps> = ({
  onBack,
  showBack = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Back Button (if present on screen) */}
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-[#1E255E] hover:opacity-80 p-1 -ml-1 mr-1 transition-opacity cursor-pointer flex items-center justify-center"
          aria-label="Back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Clean Brand Title Row */}
      <div className="inline-flex items-center gap-2 select-none">
        {/* Official Book-Scholar SVG Icon */}
        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
          <NRScholarLogo size={28} className="w-7 h-7" />
        </div>

        {/* Correctly Formatted Brand Text */}
        <span className="font-bold text-base md:text-lg text-[#1E255E] tracking-tight whitespace-nowrap">
          N R Scholar
        </span>
      </div>
    </div>
  );
};

export default NRScholarNavBrand;
