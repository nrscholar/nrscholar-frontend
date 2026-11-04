import React from "react";

export interface QuestionFeedbackItemProps {
  modeIcon?: React.ReactNode | string;
  modeLabel?: string;
  timestamp?: string;
  duration?: string;
  isCorrect?: boolean;
  statusLabel?: string;
  compactSymbolOnly?: boolean;
  questionText: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Global shared component for rendering question attempts, feedback cards,
 * and quest reviews with collision-proof metadata alignment.
 */
export const QuestionFeedbackItem: React.FC<QuestionFeedbackItemProps> = ({
  modeIcon,
  modeLabel,
  timestamp,
  duration,
  isCorrect = true,
  statusLabel,
  compactSymbolOnly = true,
  questionText,
  className = "",
  children,
}) => {
  return (
    <div
      className={`p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors flex flex-col justify-between ${className}`}
    >
      {/* Resilient, single-line collision-proof metadata header */}
      <div className="flex items-center justify-between w-full gap-2 min-w-0">
        {/* Left Meta Group: Mode Icon, Mode Name & Optional Timestamp */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          {modeIcon && (
            <span className="category-icon text-xs flex-shrink-0 flex items-center">
              {modeIcon}
            </span>
          )}
          {modeLabel && (
            <span className="pill-badge text-[11px] sm:text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex-shrink-0 whitespace-nowrap truncate max-w-[130px] sm:max-w-[180px]">
              {modeLabel}
            </span>
          )}
          {timestamp && (
            <span className="attempt-time text-[10px] sm:text-xs text-slate-400 font-semibold flex-shrink-0 whitespace-nowrap">
              {timestamp}
            </span>
          )}
        </div>

        {/* Right Group: Duration Badge & Circular Status Icon (Check/Cross Only) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto whitespace-nowrap">
          {duration && (
            <span className="duration-badge text-[11px] sm:text-xs font-mono font-extrabold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-lg flex-shrink-0 whitespace-nowrap flex items-center gap-1">
              ⏱️ {duration}
            </span>
          )}

          {/* Minimal Status Icon: Circular badge with symbol only */}
          {compactSymbolOnly ? (
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border transition-transform ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
              title={isCorrect ? "Correct" : "Incorrect"}
              aria-label={isCorrect ? "Correct" : "Incorrect"}
            >
              {isCorrect ? "✓" : "✕"}
            </span>
          ) : statusLabel ? (
            <span
              className={`status-badge text-xs font-black px-2.5 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {statusLabel}
            </span>
          ) : (
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border transition-transform ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
              title={isCorrect ? "Correct" : "Incorrect"}
              aria-label={isCorrect ? "Correct" : "Incorrect"}
            >
              {isCorrect ? "✓" : "✕"}
            </span>
          )}
        </div>
      </div>

      {/* Question Snippet on its own clean second row with consistent spacing */}
      <p className="text-xs font-bold text-slate-800 leading-snug mt-2 truncate w-full">
        {questionText}
      </p>

      {/* Optional supplementary content (e.g., options, explanation) */}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default QuestionFeedbackItem;
