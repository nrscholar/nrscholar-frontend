import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

// Global event helpers to trigger instant 0ms navigation progress from any button or handler
export function startNavigationProgress() {
  window.dispatchEvent(new CustomEvent("nrscholar-nav-start"));
}

export function completeNavigationProgress() {
  window.dispatchEvent(new CustomEvent("nrscholar-nav-complete"));
}

export default function NavigationProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<any>(null);
  const resetTimerRef = useRef<any>(null);
  const isNavigatingRef = useRef(false);

  // Start progress: immediate jump to 30%, then trickle to ~80%
  const start = () => {
    isNavigatingRef.current = true;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setVisible(true);
    setProgress(30);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 80) {
          clearInterval(timerRef.current);
          return 80;
        }
        // Non-linear trickle
        const diff = (85 - prev) * 0.15;
        return Math.min(80, prev + Math.max(diff, 1));
      });
    }, 120);
  };

  // Complete progress: snap to 100% and fade out
  const complete = () => {
    isNavigatingRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);

    setProgress(100);

    resetTimerRef.current = setTimeout(() => {
      setVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 180);
  };

  // Listen to manual start / complete events
  useEffect(() => {
    const handleStart = () => start();
    const handleComplete = () => complete();

    window.addEventListener("nrscholar-nav-start", handleStart);
    window.addEventListener("nrscholar-nav-complete", handleComplete);

    return () => {
      window.removeEventListener("nrscholar-nav-start", handleStart);
      window.removeEventListener("nrscholar-nav-complete", handleComplete);
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Complete when route changes
  useEffect(() => {
    if (isNavigatingRef.current || visible) {
      complete();
    }
  }, [location.pathname, location.search]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      {/* Track Background Glow */}
      <div
        className="h-full w-full will-change-transform relative"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left center",
          transition: progress === 100 ? "transform 150ms ease-out" : "transform 250ms ease-out",
          background: "linear-gradient(90deg, #141779 0%, #4f46e5 50%, #57fae9 100%)",
          boxShadow: "0 0 10px rgba(79, 70, 229, 0.7), 0 0 5px rgba(87, 250, 233, 0.6)",
        }}
      >
        {/* Leading edge light burst */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-white/90 shadow-[0_0_8px_#ffffff]" />
      </div>
    </div>
  );
}
