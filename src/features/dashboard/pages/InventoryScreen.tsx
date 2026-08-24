import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, Zap, Shield, MapPin, Package, Star, Gift, PartyPopper, Lock, Sparkles, Trophy, ChevronRight, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";

// Stylized 3D Treasure Box Hero SVG
const MysteryBoxHeroSVG = ({ type }: { type?: string }) => {
  const isEpic = type === "epic";
  const isRare = type === "rare";
  
  const boxGradientId = isEpic ? "epicBoxGrad" : isRare ? "rareBoxGrad" : "commonBoxGrad";
  const glowColor = isEpic ? "#C084FC" : isRare ? "#38BDF8" : "#94A3B8";

  return (
    <svg viewBox="0 0 160 160" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_0_25px_rgba(108,77,255,0.5)]">
      <defs>
        <linearGradient id="epicBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E879F9" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
        <linearGradient id="rareBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="commonBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="goldLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="boxGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#boxGlow)">
        <ellipse cx="80" cy="135" rx="55" ry="12" fill={glowColor} opacity="0.4" />
        <path d="M 30 75 L 80 100 L 130 75 L 130 120 L 80 145 L 30 120 Z" fill={`url(#${boxGradientId})`} stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M 80 100 L 80 145" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <path d="M 25 55 L 80 30 L 135 55 L 80 80 Z" fill="url(#goldLidGrad)" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 25 55 L 80 75 L 135 55 L 135 68 L 80 88 L 25 68 Z" fill="#D97706" opacity="0.9" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="80" cy="95" r="10" fill="#FFD45A" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 80 91 L 80 97 M 78 97 L 82 97" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 40 35 L 45 40 L 40 45 L 35 40 Z" fill="#FFD45A" />
        <path d="M 125 35 L 128 38 L 125 41 L 122 38 Z" fill="#27F2E6" />
        <path d="M 135 90 L 138 93 L 135 96 L 132 93 Z" fill="#FFD45A" />
      </g>
    </svg>
  );
};

export default function InventoryScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Mystery Boxes" | "Dragon Academy" | "Cities" | "Badges">("Mystery Boxes");

  const [mysteryBoxes, setMysteryBoxes] = useState<any>({});
  const [dragons, setDragons] = useState<any[]>([]);
  const [fragments, setFragments] = useState<any[]>([]);
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  const [hatchingType, setHatchingType] = useState<string | null>(null);
  const [rewardData, setRewardData] = useState<any>(null);
  const [subTab, setSubTab] = useState<"Journey" | "Lab">("Journey");

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [userBadges, setUserBadges] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      const response = await apiFetch("/api/users/me", {});
      const data = await response.json();
      if (data.success) {
        const u = data.data.user;
        setXp(u.xp || 0);
        setCoins(u.coins || 0);
        setUserBadges(u.badges || []);
        localStorage.setItem("userData", JSON.stringify(u));
      }
    } catch (e) {}
  };

  useEffect(() => {
    const cached = localStorage.getItem("userData");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setXp(u.xp || 0);
        setCoins(u.coins || 0);
        setUserBadges(u.badges || []);
      } catch(e) {}
    }
    
    const fetchInventory = async () => {
      try {
        const res = await apiFetch("/api/retention/mystery-boxes");
        if (res.ok) {
          const data = await res.json();
          setMysteryBoxes(data.boxes || {});
        }
        const dragRes = await apiFetch("/api/retention/dragons");
        if (dragRes.ok) {
          const dData = await dragRes.json();
          setDragons(dData);
        }
        const fragRes = await apiFetch("/api/retention/fragments");
        if (fragRes.ok) {
          const fData = await fragRes.json();
          setFragments(fData);
        }
      } catch (e) {
        console.error("Failed to fetch inventory data", e);
      }
    };
    
    fetchProfile();
    fetchInventory();
  }, []);

  const combineFragments = async (type: string) => {
    setHatchingType(type);
    try {
      const res = await apiFetch("/api/retention/fragments/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fragment_type: type })
      });
      if (res.ok) {
        const newDragon = await res.json();
        setTimeout(async () => {
          setRewardData({ type: 'dragon', amount: 0, name: newDragon.name });
          try {
            const dragRes = await apiFetch("/api/retention/dragons");
            if (dragRes.ok) {
              const dData = await dragRes.json();
              setDragons(dData);
            }
            const fragRes = await apiFetch("/api/retention/fragments");
            if (fragRes.ok) {
              const fData = await fragRes.json();
              setFragments(fData);
            }
          } catch (e) {}
          setHatchingType(null);
        }, 1500);
      } else {
        setHatchingType(null);
      }
    } catch (e) {
      setHatchingType(null);
      console.error("Failed to combine fragments");
    }
  };

  const openMysteryBox = async (type: string) => {
    setOpeningBox(type);
    setRewardData(null);
    try {
      const res = await apiFetch("/api/retention/mystery-box/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ box_type: type })
      });
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setRewardData(data);
          setOpeningBox(null);
          setMysteryBoxes((prev: any) => ({...prev, [type]: Math.max(0, (prev[type] || 0) - 1)}));

          if (data.user_coins !== undefined && data.user_coins !== null) {
            setCoins(data.user_coins);
          } else if (data.type === 'coins') {
            setCoins(prev => prev + data.amount);
          }

          if (data.user_xp !== undefined && data.user_xp !== null) {
            setXp(data.user_xp);
          } else if (data.type === 'xp') {
            setXp(prev => prev + data.amount);
          }

          const stored = localStorage.getItem("userData");
          if (stored) {
            const u = JSON.parse(stored);
            if (data.user_coins !== undefined) u.coins = data.user_coins;
            else if (data.type === 'coins') u.coins = (u.coins || 0) + data.amount;
            if (data.user_xp !== undefined) u.xp = data.user_xp;
            else if (data.type === 'xp') u.xp = (u.xp || 0) + data.amount;
            localStorage.setItem("userData", JSON.stringify(u));
          }
          window.dispatchEvent(new Event("userDataUpdated"));

          if (data.type === 'fragment') {
            apiFetch("/api/retention/fragments").then(r => r.json()).then(f => setFragments(f)).catch(() => {});
          }
        }, 1500);
      } else {
        setOpeningBox(null);
      }
    } catch (e) {
      setOpeningBox(null);
    }
  };

  const [citiesData, setCitiesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await apiFetch("/api/practice/cities");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setCitiesData(data.data);
        } else {
          setCitiesData([
            { name: "Egg Village", requiredFuel: 0 },
            { name: "Forest Kingdom", requiredFuel: 50 },
            { name: "Magic Desert", requiredFuel: 250 },
            { name: "Ice Kingdom", requiredFuel: 1000 },
            { name: "Dragon Mountain", requiredFuel: 2500 },
          ]);
        }
      } catch (e) {}
    };
    fetchCities();
  }, []);

  const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000, 50000];
  const cities = citiesData.map((cityData, index) => {
    const reqXp = xpThresholds[index] || 0;
    const nextReqXp = xpThresholds[index + 1] || 99999;
    const isUnlocked = xp >= reqXp;
    const isCurrent = isUnlocked && (index === citiesData.length - 1 || xp < nextReqXp);

    let status = "Locked 🔒";
    if (isCurrent) {
      status = "Current Location 📍";
    } else if (isUnlocked) {
      status = "Completed 🎉";
    }

    return {
      id: String(index),
      name: cityData.name,
      status
    };
  });

  const badges = userBadges.map((b, i) => ({
    id: String(i),
    name: b.name || `Badge ${i+1}`,
    icon: i % 2 === 0 ? Star : Shield,
    desc: b.description || "Earned achievement",
    color: i % 2 === 0 ? "#D97706" : "#0284C7"
  }));

  // Dynamic Collection Statistics
  const totalBoxesOwned = (mysteryBoxes.common || 0) + (mysteryBoxes.rare || 0) + (mysteryBoxes.epic || 0);
  const totalDragonsHatched = dragons.length;
  const totalCitiesUnlocked = cities.filter(c => !c.status.includes('Locked')).length;
  const totalBadgesEarned = userBadges.length;

  const collectionScore = Math.min(100, Math.round(((totalBoxesOwned + totalDragonsHatched + totalCitiesUnlocked + totalBadgesEarned) / 25) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4EFF7] via-[#F9F6FF] to-[#FFFFFF] text-[#141779] font-sans pb-24 relative selection:bg-[#6C4DFF] selection:text-white overflow-x-hidden">
      {/* Background Soft Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#6C4DFF]/10 blur-[80px]" />
        <div className="absolute top-[35%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#F4C95D]/15 blur-[90px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] rounded-full bg-[#3520A8]/5 blur-[70px]" />
      </div>

      {/* HEADER: MY COLLECTION */}
      <header className="px-4 py-3 bg-white/80 backdrop-blur-md border-b border-[#E5DBFB] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-[430px] mx-auto w-full">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-[#F4EFF7] border border-[#E5DBFB] hover:bg-[#EAE2FB] flex items-center justify-center transition-all active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft size={18} className="text-[#141779]" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} className="text-[#6C4DFF] animate-pulse" />
            <h1 className="text-[16px] font-black tracking-widest uppercase text-[#141779]">
              MY TREASURE VAULT
            </h1>
          </div>

          <div className="w-9 flex justify-end">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 flex items-center justify-center">
              <Trophy size={16} className="text-[#D97706]" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-3 max-w-[430px] mx-auto w-full relative z-10">
        {/* PLAYER COLLECTION SUMMARY HUD */}
        <section className="mb-4">
          <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
            {/* Currency Badges Row */}
            <div className="flex items-center justify-between gap-3 mb-3">
              {/* Coins HUD */}
              <div className="flex-1 bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/50 flex items-center justify-center shrink-0">
                  <Coins size={18} className="text-[#D97706]" />
                </div>
                <div>
                  <p className="text-base font-black text-[#141779] leading-tight">{coins.toLocaleString()}</p>
                  <p className="text-[9px] font-extrabold text-[#D97706] tracking-widest uppercase">COINS</p>
                </div>
              </div>

              {/* XP HUD */}
              <div className="flex-1 bg-[#F0F9FF] border border-[#0EA5E9]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/20 border border-[#0EA5E9]/50 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-[#0284C7]" />
                </div>
                <div>
                  <p className="text-base font-black text-[#141779] leading-tight">{xp.toLocaleString()}</p>
                  <p className="text-[9px] font-extrabold text-[#0284C7] tracking-widest uppercase">XP POWER</p>
                </div>
              </div>
            </div>

            {/* Collection Level & Progress Bar */}
            <div className="bg-[#F4EFF7] border border-[#E5DBFB] rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#141779] flex items-center gap-1.5">
                  <Compass size={13} className="text-[#6C4DFF]" />
                  COLLECTION PROGRESS
                </span>
                <span className="text-[11px] font-black text-[#6C4DFF]">
                  {collectionScore}% VAULT POWER
                </span>
              </div>

              <div className="w-full h-2.5 bg-white rounded-full overflow-hidden p-0.5 border border-[#E5DBFB]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${collectionScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#6C4DFF] via-[#512BE2] to-[#3520A8] rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTION CATEGORY NAVIGATION TABS */}
        <nav className="mb-4">
          <div className="grid grid-cols-4 gap-1.5 bg-[#EAE2FB] p-1.5 rounded-2xl border border-[#E5DBFB] shadow-sm">
            {[
              { id: "Mystery Boxes", label: "BOXES", icon: Gift },
              { id: "Dragon Academy", label: "DRAGONS", icon: Sparkles },
              { id: "Cities", label: "CITIES", icon: MapPin },
              { id: "Badges", label: "BADGES", icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-black transition-all duration-200 uppercase tracking-tight ${
                    isActive
                      ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md border border-[#9C7CFF]/50 scale-[1.02]"
                      : "text-[#6D28D9] hover:bg-white/50 hover:text-[#141779]"
                  }`}
                >
                  <Icon size={16} className={`mb-1 ${isActive ? "text-[#FFD45A]" : "text-[#6D28D9]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* CATEGORY 1: MYSTERY BOXES */}
        {activeTab === "Mystery Boxes" && (
          <section className="flex flex-col gap-4">
            {/* Featured Box Vault Hero Banner */}
            <div className="bg-gradient-to-b from-[#180C4F] to-[#2B1778] rounded-2xl p-4 border-2 border-[#6C4DFF]/40 text-center relative overflow-hidden shadow-lg">
              <div className="absolute top-2 left-3 bg-[#6C4DFF] border border-[#9C7CFF] px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                ✨ FEATURED VAULT
              </div>

              <div className="flex justify-center my-1">
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-1, 1, -1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MysteryBoxHeroSVG type="epic" />
                </motion.div>
              </div>

              <h2 className="text-base font-black text-white uppercase tracking-wider">
                MYSTERY REWARD VAULT
              </h2>
              <p className="text-xs text-[#EAE2FB] font-medium mt-0.5">
                Open boxes to discover rare dragons, coins, and XP!
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold text-[#EAE2FB]">
                <span>BOX COLLECTION</span>
                <span className="text-[#FFD45A] font-black">{totalBoxesOwned} BOXES READY</span>
              </div>
            </div>

            {/* 2-Column Collectible Rarity Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: "common", name: "COMMON BOX", rarity: "COMMON", color: "#64748B", border: "border-slate-300", glow: "shadow-sm", bg: "bg-white", text: "text-slate-700" },
                { type: "rare", name: "RARE BOX", rarity: "RARE", color: "#0284C7", border: "border-sky-300", glow: "shadow-sm", bg: "bg-white", text: "text-sky-700" },
                { type: "epic", name: "EPIC BOX", rarity: "EPIC", color: "#9333EA", border: "border-purple-300", glow: "shadow-sm", bg: "bg-white", text: "text-purple-700" },
              ].map(item => {
                const count = mysteryBoxes[item.type] || 0;
                const isOpening = openingBox === item.type;

                return (
                  <motion.div
                    key={item.type}
                    animate={isOpening ? { 
                      x: [-6, 6, -6, 6, -3, 3, 0],
                      scale: [1, 1.04, 1]
                    } : {}}
                    transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
                    className={`${item.bg} border-2 ${item.border} ${item.glow} rounded-2xl p-3.5 flex flex-col items-center justify-between relative overflow-hidden transition-all`}
                  >
                    {/* Rarity Pill */}
                    <span 
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border mb-2"
                      style={{ color: item.color, borderColor: `${item.color}50`, backgroundColor: `${item.color}15` }}
                    >
                      {item.rarity}
                    </span>

                    {/* Box Art */}
                    <div className="w-16 h-16 rounded-full bg-[#F4EFF7] border border-[#E5DBFB] flex items-center justify-center mb-2 shadow-inner">
                      <Package size={32} style={{ color: item.color }} />
                    </div>

                    {/* Name & Count */}
                    <h3 className="text-xs font-black text-[#141779] uppercase tracking-tight text-center">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-bold text-[#6D28D9] mb-3">
                      x{count} OWNED
                    </p>

                    {/* Action Button */}
                    <button 
                      onClick={() => openMysteryBox(item.type)}
                      disabled={count === 0 || openingBox !== null}
                      className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        count > 0 && openingBox !== item.type
                          ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md hover:brightness-110 active:scale-95 border border-[#9C7CFF]/40"
                          : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {isOpening ? "OPENING..." : count > 0 ? "OPEN VAULT" : "LOCKED"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* CATEGORY 2: DRAGON ACADEMY */}
        {activeTab === "Dragon Academy" && (
          <section className="flex flex-col gap-4">
            {/* Dragon Academy Hero Banner */}
            <div className="bg-gradient-to-b from-[#180C4F] to-[#2B1778] rounded-2xl p-4 border-2 border-[#FFD45A]/40 text-center relative overflow-hidden shadow-lg">
              <div className="absolute top-2 left-3 bg-[#F59E0B] border border-[#FFD45A] px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                🐉 MYSTICAL DRAGONS
              </div>

              <span className="text-5xl block my-2 drop-shadow-[0_0_15px_rgba(255,212,90,0.6)]">🐉</span>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                DRAGON ACADEMY
              </h2>
              <p className="text-xs text-[#EAE2FB] font-medium mt-0.5">
                Hatch fragments and level up your companions!
              </p>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex bg-[#EAE2FB] p-1 rounded-xl border border-[#E5DBFB]">
              <button
                onClick={() => setSubTab("Journey")}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  subTab === "Journey"
                    ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md border border-[#9C7CFF]/40"
                    : "text-[#6D28D9] hover:text-[#141779]"
                }`}
              >
                Dragon Journey 🗺️
              </button>
              <button
                onClick={() => setSubTab("Lab")}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  subTab === "Lab"
                    ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md border border-[#9C7CFF]/40"
                    : "text-[#6D28D9] hover:text-[#141779]"
                }`}
              >
                Fragment Lab 🧪
              </button>
            </div>

            {/* Sub-Tab 1: Dragon Journey */}
            {subTab === "Journey" && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                    MY DRAGON COMPANIONS
                  </span>
                  <span className="text-[11px] font-bold text-[#D97706]">
                    {dragons.length} HATCHED
                  </span>
                </div>

                {dragons.length === 0 ? (
                  <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-xs text-[#6D28D9]">No dragons hatched yet. Collect fragments in mystery boxes!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {dragons.map((d: any, index: number) => {
                      const isNew = d.isNew || index === dragons.length - 1;
                      return (
                        <motion.div 
                          key={d.id || index} 
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ repeat: Infinity, duration: 2.5 + Math.random(), ease: "easeInOut" }}
                          className="bg-white border-2 border-[#E5DBFB] hover:border-[#6C4DFF] rounded-2xl p-3.5 flex flex-col items-center relative overflow-hidden shadow-sm transition-all"
                        >
                          {isNew && (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-amber-300 shadow-xs animate-pulse uppercase tracking-wider">
                              NEW
                            </span>
                          )}
                          <div className="w-16 h-16 rounded-full bg-[#F4EFF7] border border-[#E5DBFB] flex items-center justify-center mb-2 shadow-inner">
                            <span className="text-3xl">🐉</span>
                          </div>
                          <h3 className="text-xs font-black text-[#141779] text-center uppercase tracking-tight">{d.name}</h3>
                          <p className="text-[10px] font-bold text-[#6C4DFF] mt-0.5">Level {d.level} • {d.rarity || "EPIC"}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Fragment Lab */}
            {subTab === "Lab" && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                    DRAGON FRAGMENTS
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {fragments.map((f: any) => {
                    const getDragonType = (d: any) => {
                      const dragId = String(d.id || "").toLowerCase();
                      const skin = String(d.skin || "").toLowerCase();
                      for (const t of ["fire", "water", "wind"]) {
                        if (dragId.startsWith(t) || skin.startsWith(t)) return t;
                      }
                      return "fire";
                    };
                    const matchingDragon = dragons.find((d: any) => getDragonType(d) === f.type);
                    const getUpgradeRequirement = (lvl: number) => {
                      const costs: Record<number, number> = { 1: 5, 2: 10, 3: 15, 4: 25, 5: 50, 6: 75, 7: 100 };
                      return costs[lvl] || 100;
                    };
                    const needed = matchingDragon ? getUpgradeRequirement(matchingDragon.level) : 10;
                    const canCombine = f.count >= needed;
                    const isHatching = hatchingType === f.type;

                    return (
                      <motion.div 
                        key={f.type} 
                        animate={isHatching ? {
                          x: [-5, 5, -5, 5, 0],
                          scale: [1, 1.03, 1]
                        } : {}}
                        transition={{ duration: 0.5, repeat: isHatching ? Infinity : 0 }}
                        className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-3 flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#F4EFF7] border border-[#E5DBFB] flex items-center justify-center">
                            <span className="text-xl">🧩</span>
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-[#141779] capitalize">{f.type} Fragments</h3>
                            <p className="text-[10px] font-bold text-[#6D28D9]">{f.count} / {needed} Needed</p>
                          </div>
                        </div>

                        {canCombine ? (
                          <button 
                            onClick={() => combineFragments(f.type)}
                            disabled={hatchingType !== null}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              isHatching ? "bg-gray-400 text-white" : "bg-[#22C55E] text-white shadow-md active:scale-95"
                            }`}
                          >
                            {isHatching ? "HATCHING..." : (matchingDragon ? "UPGRADE" : "HATCH!")}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-lg">
                            NEED MORE
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* CATEGORY 3: CITIES WORLD DISCOVERY MAP */}
        {activeTab === "Cities" && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-[#6C4DFF]" />
                WORLD DISCOVERY MAP
              </span>
              <span className="text-[11px] font-bold text-[#6C4DFF]">
                {totalCitiesUnlocked} / {cities.length} UNLOCKED
              </span>
            </div>

            <div className="flex flex-col relative pb-4 px-1">
              {/* Vertical Connection Beam */}
              <div className="absolute left-[31px] top-6 bottom-6 w-1 bg-[#E5DBFB] -z-10 rounded-full" />
              
              {cities.map((item, index) => {
                const isLocked = item.status.includes('Locked');
                const isCurrent = item.status.includes('Current');
                return (
                  <div 
                    key={item.id} 
                    onClick={() => navigate("/practice/journey-map", { state: { scrollTo: index } })}
                    className={`flex items-center gap-3.5 mb-4 relative cursor-pointer active:scale-98 transition-all ${isLocked ? 'opacity-60 grayscale-[0.4]' : ''}`}
                  >
                    {/* Node Circle */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCurrent ? 'bg-[#6C4DFF] border-white text-white shadow-[0_4px_16px_rgba(108,77,255,0.4)] scale-110' : 
                      isLocked ? 'bg-gray-100 border-white text-gray-400' : 'bg-[#3520A8] border-white text-white shadow-md'
                    }`}>
                      <MapPin size={20} className={isCurrent ? 'text-white' : isLocked ? 'text-gray-400' : 'text-white'} />
                    </div>

                    {/* Location Card */}
                    <div className={`flex-1 rounded-2xl p-3.5 border-2 transition-all ${
                      isCurrent 
                        ? 'bg-[#F2ECFF] border-[#6C4DFF] shadow-sm' 
                        : 'bg-white border-[#E5DBFB]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-[#141779] uppercase tracking-wide">{item.name}</h3>
                        <ChevronRight size={16} className="text-[#6D28D9]" />
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isCurrent ? 'text-[#6C4DFF]' : isLocked ? 'text-gray-400' : 'text-[#D97706]'}`}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CATEGORY 4: BADGES & TROPHIES SHOWCASE */}
        {activeTab === "Badges" && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={14} className="text-[#D97706]" />
                ACHIEVEMENT VAULT
              </span>
              <span className="text-[11px] font-bold text-[#D97706]">
                {totalBadgesEarned} EARNED
              </span>
            </div>

            {badges.length === 0 ? (
              <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
                <Shield size={44} className="text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-[#141779] mb-1">No Badges Unlocked Yet</h3>
                <p className="text-xs text-[#6D28D9] max-w-[220px]">
                  Keep exploring and opening Epic Mystery Boxes to unlock rare badges!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm relative overflow-hidden"
                    >
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center border shadow-inner" 
                        style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}40` }}
                      >
                        <Icon size={28} style={{ color: item.color }} />
                      </div>
                      <h3 className="text-xs font-black text-[#141779] text-center leading-tight uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] font-medium text-[#6D28D9] text-center leading-snug">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* REWARD DISCOVERY MODAL */}
      <AnimatePresence>
        {rewardData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white border-2 border-[#F59E0B] w-full max-w-xs rounded-3xl p-6 text-center relative shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <PartyPopper size={36} className="text-white" />
                </motion.div>
              </div>
              
              <h2 className="text-xl font-black text-[#141779] mt-7 mb-1 uppercase tracking-wider">
                TREASURE UNLOCKED!
              </h2>
              <p className="text-[#6D28D9] text-xs mb-5">
                You discovered a new reward inside the vault!
              </p>
              
              <div className="bg-[#F4EFF7] rounded-2xl p-5 mb-5 border-2 border-[#E5DBFB] shadow-inner">
                <motion.span 
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl block mb-2"
                >
                  {rewardData.type === 'coins' ? '🪙' : rewardData.type === 'xp' ? '⭐' : '🐉'}
                </motion.span>
                <h3 className="text-lg font-black text-[#141779]">
                  {rewardData.amount > 0 ? `+${rewardData.amount} ` : ''}{rewardData.name}
                </h3>
              </div>
              
              <button 
                onClick={() => setRewardData(null)}
                className="w-full bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white font-black py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-md border border-[#9C7CFF]/40"
              >
                AWESOME!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
