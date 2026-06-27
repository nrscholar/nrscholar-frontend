import { useNavigate, useLocation } from "react-router-dom";
import { X, Sparkles, Star, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../../api";

const ScratchCard = ({ width, height, onReveal, children }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // Create silver metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e0e0e0');
    gradient.addColorStop(0.3, '#ffffff');
    gradient.addColorStop(0.5, '#b3b3b3');
    gradient.addColorStop(0.7, '#ffffff');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add pattern/text
    ctx.fillStyle = '#666666';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', width / 2, height / 2 - 15);
    ctx.fillText('TO REVEAL!', width / 2, height / 2 + 15);
  }, [width, height]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparent = 0;
    
    // Check every 16th pixel for performance
    for (let i = 0; i < pixels.length; i += 64) {
      if (pixels[i + 3] < 128) {
        transparent++;
      }
    }
    
    const percent = (transparent / (pixels.length / 64)) * 100;
    if (percent > 45) { // 45% scratched
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDrawing) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => setIsDrawing(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) scratch(e.clientX, e.clientY);
  };
  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseLeave = () => setIsDrawing(false);

  return (
    <div className="relative" style={{ width, height }}>
      {children}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 z-50 cursor-crosshair rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-opacity duration-500 ease-out"
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
};

export default function RewardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");
  const rewardType = searchParams.get("type") || "coins";
  const amount = parseInt(searchParams.get("amount") || "10");
  const navState = location.state;

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
     if (isRevealed) {
       if (rewardType === "coins" || rewardType === "boss") {
           apiFetch("/api/users/add-coins", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ coins: amount })
           });
       } else if (rewardType === "badge") {
           apiFetch("/api/users/add-badge", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ badge: "Sharpshooter" })
           });
       }
     }
  }, [rewardType, amount, isRevealed]);

  const handleCollect = () => {
     if (returnTo) navigate(returnTo, { state: navState });
     else navigate(-1);
  };

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
  }));

  let title = "Bonus Reward!";
  let subtitle = `You earned ${amount} coins for answering 5 in a row!`;
  let tagText = "COIN BONUS";
  let iconUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-b12m1P3gH05_q7R3rO0lP-iM9_wD8Y9H6hR0pP6I5R1E3pP6N-I5xZ7-x5H4sI5o8Q2lG3E5hU7eW3vY9bM1qX4pA8xZ0qY9H8bN7E5hI5R1uP6O9P1_6oH3qY2lE5aI1eQ9M3kL6R1fN5iM8qQ9H6qG5fJ1eW3_Q8rN6aU1mZ7gV5bI5R1pQ2vW4jX6_O7aI1mZ7";
  
  if (rewardType === "boss") {
      title = "Boss Defeated!";
      subtitle = `You conquered the chapter and earned ${amount} coins!`;
      tagText = "BOSS REWARD";
      iconUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcG8R4hY8vG9D5P8H6O3L9R4N9oU1I3P4V9L6P4P8W3oK5M7U3O8E9S4U5H9E5K4H9R3U5E8N5U7E3U8O8R8L9D4L6L6D4O6C8U9D9P9H8O5I3"; // example fallback
  } else if (rewardType === "badge") {
      title = "Sharpshooter";
      subtitle = "You answered 25 questions correctly in a single session! You earned a new badge.";
      tagText = "RARE BADGE";
      iconUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDRHcKf0YYUdWtSVgiFjyLzgE1kfrmmZWWzbveF9vkixJAqjrF0XMH3oCXrixUC2_HUTVTURn2DC-nEzuWliaHK3DkO7Ht1cmKa2gliF3ZUMeRcVd5DU5okkJIEX2Kqf-QrWeLu1YzYJafK0AI6N3Yjzhd40gNeonYhWmVHbnJiGH4v-zoJl9wP_Sv88krUYwFx-Z2ckgWuS490qD8NtGOp-WGNeo7T_WYS-N4TFygSvNnlHZk8jv9cS0PyLQr8Ca4G_zNk4mEPlw";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141779] to-[#0c0e35] relative overflow-hidden font-sans">
      
      {/* Background Particles (Only show when revealed) */}
      {isRevealed && particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-[#57fae9] rounded-full opacity-30 animate-pulse"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
        />
      ))}

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 relative z-10">
        <button onClick={handleCollect} className="hover:opacity-80 transition-opacity">
          <X size={24} color="rgba(255,255,255,0.5)" />
        </button>
        
        {isRevealed && (
          <div className="flex items-center gap-2">
            <Sparkles size={20} color="#57fae9" />
            <span className="text-sm font-semibold text-white tracking-wide">NEW UNLOCK</span>
          </div>
        )}

        <div className="w-6" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 relative z-10">
        
        {/* Rarity Tag */}
        <div className={`mb-6 transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center bg-gradient-to-r from-[#ffd700] to-[#ffcc00] px-4 py-2 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.4)]">
            <Sparkles size={16} color="#141779" className="mr-1.5" />
            <span className="text-[#141779] text-xs font-bold tracking-[1px]">{tagText}</span>
          </div>
        </div>

        {/* Central Badge Spotlight with Scratch Card Wrapper */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-10">
          
          {isRevealed && (
            <>
              {/* Radial Shine Layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle,rgba(87,250,233,0.15)_0%,transparent_70%)]"
              />

              {/* Floating Stars */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-2"
              >
                <Star size={32} color="#57fae9" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-2"
              >
                <Star size={24} color="#57fae9" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-5"
              >
                <Star size={18} color="rgba(87,250,233,0.5)" />
              </motion.div>
            </>
          )}

          <ScratchCard width={220} height={220} onReveal={() => setIsRevealed(true)}>
            {/* Badge Card */}
            <motion.div
              animate={isRevealed ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden shadow-[0_20px_25px_rgba(0,0,0,0.5)] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,23,121,0.4)] to-transparent" />
              <img
                src={iconUrl}
                alt="Reward"
                className="w-[170px] h-[170px] drop-shadow-[0_8px_12px_rgba(255,215,0,0.3)] relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDRHcKf0YYUdWtSVgiFjyLzgE1kfrmmZWWzbveF9vkixJAqjrF0XMH3oCXrixUC2_HUTVTURn2DC-nEzuWliaHK3DkO7Ht1cmKa2gliF3ZUMeRcVd5DU5okkJIEX2Kqf-QrWeLu1YzYJafK0AI6N3Yjzhd40gNeonYhWmVHbnJiGH4v-zoJl9wP_Sv88krUYwFx-Z2ckgWuS490qD8NtGOp-WGNeo7T_WYS-N4TFygSvNnlHZk8jv9cS0PyLQr8Ca4G_zNk4mEPlw";
                }}
              />
            </motion.div>
          </ScratchCard>
        </div>

        {/* Content Details */}
        <div className={`flex flex-col items-center mb-10 gap-2 transition-opacity duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl font-bold text-white text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            {title}
          </h1>
          <p className="text-base text-[rgba(255,255,255,0.7)] text-center leading-6 px-4">
            {subtitle}
          </p>
        </div>

        {/* Action Button */}
        <div className={`w-full max-w-[280px] transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={handleCollect}
            className="w-full h-[60px] rounded-full bg-[#57fae9] flex items-center justify-center gap-2 shadow-[0_10px_15px_rgba(42,221,205,0.4)] hover:bg-[#45e0d0] transition-colors"
          >
            <span className="text-[#007168] text-xl font-bold">Collect</span>
            <ChevronsRight size={24} color="#007168" />
          </button>
        </div>
      </main>
    </div>
  );
}
