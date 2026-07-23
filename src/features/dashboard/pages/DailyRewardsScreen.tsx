import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Gift, History, HelpCircle, Shield, Sparkles, Star } from "lucide-react";
import { apiFetch } from "../../../api";

interface Reward {
  name: string;
  category: string;
  reward_type: string;
  icon: string;
  color: string;
  amount?: number;
  item_id?: string;
  booster_type?: string;
}

export default function DailyRewardsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "daily";

  const [spinType, setSpinType] = useState<string>(initialType);
  const [balances, setBalances] = useState<any>({
    daily_spins_balance: 0,
    chapter_spins_balance: 0,
    boss_revival_spins_balance: 0,
    event_spins_balance: 0,
    parent_spins_balance: 0
  });

  const [activeRewards, setActiveRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [wonReward, setWonReward] = useState<Reward | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const wheelRef = useRef<HTMLDivElement>(null);

  // Default rewards fallback
  const defaultRewards: Reward[] = [
    { name: "+500 XP", category: "Rare", reward_type: "xp", icon: "stars", color: "#0f766e" },
    { name: "Hint Card", category: "Common", reward_type: "item", icon: "help", color: "#2563eb" },
    { name: "50 COINS", category: "Common", reward_type: "coins", icon: "token", color: "#2563eb" },
    { name: "Try Again", category: "Common", reward_type: "none", icon: "refresh", color: "#dc2626" },
    { name: "+100 XP", category: "Common", reward_type: "xp", icon: "stars", color: "#2563eb" },
    { name: "+200 XP", category: "Rare", reward_type: "xp", icon: "stars", color: "#0f766e" },
    { name: "LEGEND CARD", category: "Legendary", reward_type: "item", icon: "military_tech", color: "#ea580c" },
    { name: "+50 XP", category: "Common", reward_type: "xp", icon: "stars", color: "#2563eb" }
  ];

  const bossRevivalRewards: Reward[] = [
    { name: "Recover 1 Heart", category: "Revival", reward_type: "heart", amount: 1, icon: "favorite", color: "#ef4444" },
    { name: "Recover 2 Hearts", category: "Revival", reward_type: "heart", amount: 2, icon: "favorite", color: "#ef4444" },
    { name: "Recover 3 Hearts", category: "Revival", reward_type: "heart", amount: 3, icon: "favorite", color: "#ef4444" },
    { name: "Shield (Next attack)", category: "Revival", reward_type: "shield", amount: 1, icon: "shield", color: "#06b6d4" },
    { name: "Double Damage", category: "Revival", reward_type: "double_damage", amount: 1, icon: "swords", color: "#f59e0b" }
  ];

  useEffect(() => {
    fetchSpinStatus();
  }, []);

  const getShortName = (name: string) => {
    if (name === "AI Motivation Card") return "AI Motivation";
    if (name === "Shield (Next attack)") return "Shield";
    if (name === "Double XP (15m)") return "Double XP";
    if (name === "Boss Damage Booster") return "Boss Damage";
    if (name === "Exclusive Profile Theme") return "Profile Theme";
    if (name === "New Companion Skin") return "Companion Skin";
    return name;
  };

  const getFontSizeClass = (name: string) => {
    const shortName = getShortName(name);
    const words = shortName.split(" ");
    const maxLength = Math.max(...words.map(w => w.length));
    
    if (maxLength >= 10) {
      return "text-[7.5px]"; // e.g. MOTIVATION
    } else if (maxLength >= 8) {
      return "text-[8.2px]"; // e.g. SCIENTIST
    }
    return "text-[9px]";
  };

  const fetchSpinStatus = async () => {
    try {
      const response = await apiFetch("/api/retention/spin-wheel/status");
      const data = await response.json();
      if (response.ok) {
        setBalances(data.balances);
        setActiveRewards(data.rewards && data.rewards.length > 0 ? data.rewards : defaultRewards);
      } else {
        setErrorMessage(data.message || `Error ${response.status}: Failed to fetch spin status`);
        setActiveRewards(defaultRewards);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to connect to the server");
      setActiveRewards(defaultRewards);
    } finally {
      setLoading(false);
    }
  };

  const interleaveRewards = (rewards: Reward[]): Reward[] => {
    if (rewards.length <= 2) return rewards;

    // Group rewards by category
    const groups: { [key: string]: Reward[] } = {};
    rewards.forEach((r) => {
      const cat = r.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...r });
    });

    const result: Reward[] = [];
    const keys = Object.keys(groups);
    
    // Sort keys by size of group descending
    keys.sort((a, b) => groups[b].length - groups[a].length);

    let itemsLeft = true;
    while (itemsLeft) {
      itemsLeft = false;
      for (const key of keys) {
        if (groups[key].length > 0) {
          result.push(groups[key].shift()!);
          itemsLeft = true;
        }
      }
    }

    return result;
  };

  const getDisplayRewards = () => {
    if (spinType === "boss_revival") {
      return bossRevivalRewards;
    }
    // Filter rewards dynamically by spinType tab if spin_types field is present
    const filtered = activeRewards.filter((r: any) => 
      r.spin_types ? r.spin_types.includes(spinType) : true
    );
    const pool = filtered.length > 0 ? filtered : activeRewards;
    
    // Interleave same-category options so they are not adjacent on the wheel
    return interleaveRewards(pool);
  };

  const getSpinBalance = () => {
    switch (spinType) {
      case "daily":
        return balances.daily_spins_balance || 0;
      case "chapter":
        return balances.chapter_spins_balance || 0;
      case "boss_revival":
        return balances.boss_revival_spins_balance || 0;
      case "event":
        return balances.event_spins_balance || 0;
      case "parent":
        return balances.parent_spins_balance || 0;
      default:
        return 0;
    }
  };

  const handleBack = () => {
    if (spinType === "boss_revival") {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  const startSpin = async () => {
    if (isSpinning) return;
    setErrorMessage("");

    const balance = getSpinBalance();
    if (balance <= 0) {
      setErrorMessage(`No ${spinType.replace("_", " ")} attempts remaining`);
      return;
    }

    setIsSpinning(true);

    try {
      // Server-side reward generation
      const res = await apiFetch("/api/retention/spin-wheel/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spin_type: spinType,
          boss_id: searchParams.get("boss_id")
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Server failed to initiate spin");
      }

      const reward = data.reward;
      const finalBalances = data.balances;

      if (data.user) {
        const stored = localStorage.getItem("userData");
        if (stored) {
          const u = JSON.parse(stored);
          u.coins = data.user.coins;
          u.xp = data.user.xp;
          u.level = data.user.level;
          localStorage.setItem("userData", JSON.stringify(u));
        }
        window.dispatchEvent(new Event("userDataUpdated"));
      }

      // Find the index of the won reward on the wheel
      const pool = getDisplayRewards();
      let index = pool.findIndex(
        (r) => r.name.toLowerCase() === reward.name.toLowerCase()
      );

      if (index === -1) {
        // Fallback: match by reward type or category
        index = pool.findIndex((r) => r.reward_type === reward.reward_type);
        if (index === -1) index = 0;
      }

      const N = pool.length;
      const segmentAngle = 360 / N;

      // Spin 6 full times, and calculate ending alignment to target slice
      const spinsCount = 6;
      const finalAngle = rotation + (spinsCount * 360) + (360 - (index * segmentAngle) - (segmentAngle / 2));

      setRotation(finalAngle);
      setWonReward(reward);
      setBalances(finalBalances);

      // Animation duration: 6.5 seconds
      setTimeout(() => {
        setIsSpinning(false);
        setShowModal(true);
      }, 6500);

    } catch (e: any) {
      setErrorMessage(e.message || "Something went wrong. Please check your connection.");
      setIsSpinning(false);
    }
  };

  const handleClaim = () => {
    setShowModal(false);
    if (spinType === "boss_revival") {
      // Navigate back to resume boss battle
      navigate(-1);
    } else {
      fetchSpinStatus();
    }
  };

  // Helper to get Material Symbol name equivalents for Lucide icons
  const getMaterialIcon = (iconName: string) => {
    switch (iconName) {
      case "stars":
        return "stars";
      case "token":
        return "token";
      case "help":
        return "help_center";
      case "favorite":
        return "favorite";
      case "shield":
        return "shield";
      case "swords":
        return "swords";
      case "refresh":
        return "refresh";
      default:
        return "explore";
    }
  };

  const currentRewards = getDisplayRewards();
  const segmentAngle = 360 / currentRewards.length;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] w-full flex flex-col items-center overflow-x-hidden font-headline relative">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30" 
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,23,121,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Top App Bar */}
      <header className="w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-lg border-b border-[#141779]/10 flex justify-between items-center px-6 py-4 max-w-[430px] mx-auto">
        <button onClick={handleBack} className="active:scale-95 transition-transform text-[#141779]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">
          {spinType === "boss_revival" ? "Revival Wheel" : "Daily Rewards"}
        </h1>
        <div className="w-6 h-6" />
      </header>

      {/* Tabs for different spin types (Hidden if boss revival) */}
      {spinType !== "boss_revival" && (
        <div className="flex gap-2 p-2 bg-[#141779]/5 border border-[#141779]/10 rounded-full mt-4 max-w-[360px] w-[90%] mx-auto overflow-x-auto no-scrollbar relative z-10">
          {[
            { id: "daily", label: "Daily" },
            { id: "chapter", label: "Chapter" },
            { id: "event", label: "Event" }
          ].map((tab) => {
            const isActive = spinType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!isSpinning) {
                    setSpinType(tab.id);
                    setErrorMessage("");
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#141779] text-white shadow-md"
                    : "text-[#141779]/60 hover:text-[#141779]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Canvas */}
      <main className="relative flex-1 w-full max-w-[430px] flex flex-col items-center justify-center px-6 pt-8 pb-24 gap-8 z-10">
        
        {/* Reward Info Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[2px] text-[#008477]">
            {spinType === "boss_revival" ? "BOSS EMERGENCY" : "QUANTUM EXPEDITION"}
          </p>
          <h2 className="text-2xl font-bold text-[#141779]">
            {spinType === "boss_revival" ? "Spin the Revival Wheel" : "Spin the Quantum Wheel"}
          </h2>
          <p className="text-sm text-[#141779]/60">
            {spinType === "boss_revival" 
              ? "Recover hearts to jump back into the battle!"
              : "Upgrade your learning kit with daily rewards."}
          </p>
        </div>

        {/* Quantum Wheel Container */}
        <div className="relative w-full aspect-square flex items-center justify-center">
          {/* Outer Ring with marks */}
          <div className="absolute inset-0 rounded-full border border-[#141779]/10 flex items-center justify-center">
            <div className="w-[94%] h-[94%] rounded-full border-2 border-[#141779]/5 border-dashed" />
          </div>

          {/* The Needle indicator */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <div className="w-1.5 h-10 bg-[#ff9f43] rounded-full shadow-[0_0_10px_#ff9f43]" />
            <div className="w-4 h-4 bg-[#ff9f43] rotate-45 -mt-2 shadow-[0_0_10px_#ff9f43]" />
          </div>

          {/* The Wheel */}
          <div 
            ref={wheelRef}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "transform 6.5s cubic-bezier(0.15, 0, 0.15, 1)" : "none"
            }}
            className="relative w-[85%] h-[85%] rounded-full bg-gradient-to-b from-[#1c1b6d] to-[#0c0a3e] shadow-[0_12px_40px_rgba(20,23,121,0.25)] overflow-hidden border-4 border-white ring-1 ring-black/5"
          >
            {/* Draw SVG Slices dynamically */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <g>
                {currentRewards.map((reward, i) => {
                  const angle = segmentAngle;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;

                  // Convert degrees to polar coordinates for SVG path
                  const rad1 = ((startAngle - 90) * Math.PI) / 180;
                  const rad2 = ((endAngle - 90) * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(rad1);
                  const y1 = 50 + 50 * Math.sin(rad1);
                  const x2 = 50 + 50 * Math.cos(rad2);
                  const y2 = 50 + 50 * Math.sin(rad2);

                  // Path representing a pie slice
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <path
                      key={i}
                      d={pathData}
                      fill={reward.color + "2e"}
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="0.8"
                    />
                  );
                })}
              </g>
            </svg>

            {/* Slices Labels */}
            <div className="absolute inset-0 pointer-events-none">
              {currentRewards.map((reward, i) => {
                const angle = i * segmentAngle + segmentAngle / 2;
                return (
                  <div
                    key={i}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "50% 50%"
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-start pt-[22px] text-center"
                  >
                    <span 
                      className={`font-black tracking-wider uppercase px-2 py-0.5 rounded-full text-white shadow-md select-none max-w-[62px] text-center block leading-[1.1] mx-auto whitespace-normal break-normal ${getFontSizeClass(reward.name)}`}
                      style={{ 
                        backgroundColor: reward.color,
                        border: "1px solid rgba(255,255,255,0.3)",
                        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.8)"
                      }}
                    >
                      {getShortName(reward.name)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Inner Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white rounded-full shadow-[0_4px_12px_rgba(20,23,121,0.15)] flex items-center justify-center border border-slate-200">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-[#141779]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        {/* Controls */}
        <div className="w-full space-y-4">
          <button
            onClick={startSpin}
            disabled={isSpinning || getSpinBalance() <= 0}
            style={{
              boxShadow: getSpinBalance() > 0 ? "0 4px 15px rgba(20,23,121,0.2)" : "none"
            }}
            className={`w-full py-4 rounded-full font-bold text-lg tracking-wide uppercase transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
              isSpinning 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : getSpinBalance() > 0
                ? "bg-[#141779] text-white hover:bg-[#141779]/95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40"
            }`}
          >
            {isSpinning ? "Calibrating..." : "Initialize Spin"}
          </button>

          <div className="flex items-center justify-center gap-2 text-[#141779]/70 text-sm font-semibold">
            <History className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">
              {getSpinBalance()} attempts left
            </span>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      <AnimatePresence>
        {showModal && wonReward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={handleClaim}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-[360px] p-8 rounded-3xl flex flex-col items-center text-center gap-6 border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-radial-gradient(circle,rgba(20,23,121,0.05)_0%,transparent_70%) pointer-events-none" />

              {/* Reward Icon Spotlight */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-md relative"
                style={{
                  background: `radial-gradient(circle, ${wonReward.color}20 0%, transparent 80%)`,
                  border: `2px solid ${wonReward.color}`
                }}
              >
                <Sparkles 
                  className="w-12 h-12"
                  style={{ color: wonReward.color }}
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#141779] tracking-wide">
                  Mission Success!
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  You've unlocked the{" "}
                  <span className="font-bold" style={{ color: wonReward.color }}>
                    {wonReward.name}
                  </span>{" "}
                  reward.
                </p>
                
                {/* Motivation message */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-slate-200/50 italic">
                  "Excellent! Your consistency has been rewarded. Keep going!"
                </div>
              </div>

              <button
                onClick={handleClaim}
                className="w-full py-4 rounded-full font-bold text-base tracking-wide uppercase transition-all duration-300 transform active:scale-95 text-white"
                style={{
                  backgroundColor: wonReward.color,
                  boxShadow: `0 4px 15px ${wonReward.color}40`
                }}
              >
                Claim Reward
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
