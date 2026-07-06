import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  fallback?: string; // emoji fallback when CDN fails
}

export default function LottiePlayer({ src, className = "", loop = true, autoplay = true, fallback = "🐉" }: LottiePlayerProps) {
  const [animData, setAnimData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setAnimData(null);
    fetch(src)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { if (!cancelled) setAnimData(d); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [src]);

  // Show animated emoji fallback if CDN fails
  if (failed) {
    return (
      <motion.span
        animate={{ y: [0, -6, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="flex items-center justify-center w-full h-full text-[3rem] select-none"
      >
        {fallback}
      </motion.span>
    );
  }

  if (!animData) return null;

  return (
    <Lottie
      animationData={animData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

