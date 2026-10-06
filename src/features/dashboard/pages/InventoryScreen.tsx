import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, Zap, Shield, MapPin, Package, Star, Gift, PartyPopper, Lock, Sparkles, Trophy, ChevronRight, Compass, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"Mystery Boxes" | "Dragon Academy" | "Journey" | "Badges">("Mystery Boxes");

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
  const [streakDays, setStreakDays] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

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
        setStreakDays(u.streakDays || u.streak_days || u.streak || 0);
        setUserLevel(u.level || Math.max(1, Math.floor((u.xp || 0) / 500) + 1));
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
        setStreakDays(u.streakDays || u.streak_days || u.streak || 0);
        setUserLevel(u.level || Math.max(1, Math.floor((u.xp || 0) / 500) + 1));
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
  const [journeyNodes, setJourneyNodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchCitiesAndJourney = async () => {
      try {
        const jRes = await apiFetch("/api/journey/progress");
        if (jRes.ok) {
          const jData = await jRes.json();
          if (jData.success && jData.data?.nodes?.length > 0) {
            setJourneyNodes(jData.data.nodes);
          }
        }
      } catch (e) {}

      try {
        const response = await apiFetch("/api/practice/cities");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setCitiesData(data.data);
        } else {
          setCitiesData([
            { name: "Egg Village", requiredFuel: 0 },
            { name: "Hatchling Haven", requiredFuel: 500 },
            { name: "Forest Kingdom", requiredFuel: 1000 },
            { name: "Magic Desert", requiredFuel: 2500 },
            { name: "Ice Kingdom", requiredFuel: 5000 },
            { name: "Dragon Mountain", requiredFuel: 10000 },
            { name: "Cloud City", requiredFuel: 15000 },
            { name: "Crystal Caves", requiredFuel: 20000 },
            { name: "Underworld", requiredFuel: 30000 },
            { name: "Galactic Core", requiredFuel: 50000 },
            { name: "Stone Age Hunter", requiredFuel: 65000 },
            { name: "Bronze Craftsman", requiredFuel: 80000 },
            { name: "Civilization Leader", requiredFuel: 100000 },
          ]);
        }
      } catch (e) {}
    };
    fetchCitiesAndJourney();
  }, []);

  const xpThresholds = [0, 500, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 50000, 65000, 80000, 100000];
  const cities = journeyNodes.length > 0
    ? journeyNodes.map((node, index) => {
        const minClass = node.minClass || (index < 3 ? 1 : index < 6 ? 2 : index < 9 ? 3 : 4);
        let status = t('status_locked', "Locked 🔒");
        if (node.isFutureClass) {
          status = t('unlocks_at_class_short', { count: minClass, defaultValue: `Unlocks at Class ${minClass} 🔒` });
        } else if (node.completed || node.isPriorClass) {
          status = t('status_completed', "Completed 🎉");
        } else if (node.unlocked) {
          status = t('status_current_location', "Current Location 📍");
        }

        return {
          id: String(index),
          name: node.name || node.title,
          minClass,
          isFutureClass: Boolean(node.isFutureClass),
          status
        };
      })
    : citiesData.map((cityData, index) => {
        const minClass = index < 3 ? 1 : index < 6 ? 2 : index < 9 ? 3 : 4;
        const reqXp = xpThresholds[index] || 0;
        const nextReqXp = xpThresholds[index + 1] || 99999;
        const isUnlocked = xp >= reqXp;
        const isCurrent = isUnlocked && (index === citiesData.length - 1 || xp < nextReqXp);

        let status = t('status_locked', "Locked 🔒");
        if (isCurrent) {
          status = t('status_current_location', "Current Location 📍");
        } else if (isUnlocked) {
          status = t('status_completed', "Completed 🎉");
        }

        return {
          id: String(index),
          name: cityData.name,
          minClass,
          isFutureClass: !isUnlocked,
          status
        };
      });

  const translateBadgeText = (text: string, defaultVal: string) => {
    if (!text) return defaultVal || "";
    const trimmed = text.trim();

    // Badge Title mappings
    if (/First Steps/i.test(trimmed) || /first_steps/i.test(trimmed)) return t("badge_first_steps", "First Steps");
    if (/Week On Fire/i.test(trimmed) || /week_on_fire/i.test(trimmed)) return t("badge_week_on_fire", "Week On Fire");
    if (/Monthly Master/i.test(trimmed) || /monthly_master/i.test(trimmed)) return t("badge_monthly_master", "Monthly Master");
    if (/Rising Scholar/i.test(trimmed) || /rising_scholar/i.test(trimmed)) return t("badge_rising_scholar", "Rising Scholar");
    if (/Challenger/i.test(trimmed) || /challenger/i.test(trimmed)) return t("badge_challenger", "Challenger");
    if (/Supporter/i.test(trimmed) || /supporter/i.test(trimmed)) return t("badge_supporter", "Supporter");
    if (/Science Prodigy/i.test(trimmed) || /science_prodigy/i.test(trimmed) || /વિજ્ઞાન નિષ્ણાત/i.test(trimmed) || /विज्ञान विशेषज्ञ/i.test(trimmed)) return t("badge_science_prodigy", "Science Prodigy");
    if (/Math Ace/i.test(trimmed) || /math_ace/i.test(trimmed) || /ગણિત એસ/i.test(trimmed) || /गणित ऐस/i.test(trimmed)) return t("badge_math_ace", "Math Ace");
    if (/Arena Master/i.test(trimmed) || /arena_master/i.test(trimmed) || /એરેના માસ્ટર/i.test(trimmed) || /एरिना मास्टर/i.test(trimmed)) return t("badge_arena_master", "Arena Master");
    if (/Streak Master/i.test(trimmed) || /streak_master/i.test(trimmed) || /સ્ટ્રીક માસ્ટર/i.test(trimmed) || /स्ट्राइक मास्टर/i.test(trimmed)) return t("badge_streak_master", "Streak Master");
    if (/Rare Badge/i.test(trimmed) || /rare_badge/i.test(trimmed) || /દુર્લભ બેજ/i.test(trimmed) || /दुर्लभ बैज/i.test(trimmed)) return t("badge_rare_badge", "Rare Badge");
    if (/Epic Badge/i.test(trimmed) || /epic_badge/i.test(trimmed) || /એપિક બેજ/i.test(trimmed) || /एपिक बैज/i.test(trimmed)) return t("badge_epic_badge", "Epic Badge");

    // Badge Description mappings
    if (/Found in an Epic/i.test(trimmed) || /Epic Mystery Box/i.test(trimmed) || /એપિક મિસ્ટ્રી બોક્સમાં/i.test(trimmed) || /एपिक मिस्ट्री बॉक्स/i.test(trimmed)) {
      return t("desc_found_epic_box", "Found in an Epic Mystery Box!");
    }
    if (/3\+ Day Daily Streak/i.test(trimmed) || /Streak Champion/i.test(trimmed) || /3\+ દિવસ/i.test(trimmed) || /3\+ दिनों/i.test(trimmed)) {
      return t("desc_streak_master", "3+ Day Daily Streak Champion");
    }
    if (/Level 5\+ Explorer/i.test(trimmed) || /Level 5\+/i.test(trimmed) || /લેવલ 5\+/i.test(trimmed) || /लेवल 5\+/i.test(trimmed)) {
      return t("desc_arena_master", "Level 5+ Explorer Master");
    }
    if (/Master of Mathematics/i.test(trimmed) || /50 math/i.test(trimmed) || /ગણિતના માસ્ટર/i.test(trimmed) || /गणित के मास्टर/i.test(trimmed)) {
      return t("desc_math_ace", "Master of Mathematics");
    }
    if (/Master of Science/i.test(trimmed) || /વિજ્ઞાન અને પ્રકૃતિ/i.test(trimmed) || /विज्ञान और प्रकृति/i.test(trimmed)) {
      return t("desc_science_prodigy", "Master of Science & Nature");
    }
    if (/Earned achievement/i.test(trimmed) || /સિદ્ધિ મેળવેલ/i.test(trimmed) || /उपलब्धि हासिल की/i.test(trimmed)) {
      return t("desc_earned_achievement", "Earned achievement");
    }

    const direct = t(trimmed, "");
    if (direct && direct !== trimmed) return direct;

    const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    return t(key, { defaultValue: t(trimmed.toLowerCase().replace(/ /g, '_'), { defaultValue: defaultVal || trimmed }) });
  };

  // Synthesize dynamic milestone badges matching ProgressScreen & ProfileScreen stats
  const hasMathAce = userBadges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("math") : b?.name?.toLowerCase().includes("math"));
  const isStreakUnlocked = streakDays >= 3 || userBadges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("streak") : b?.name?.toLowerCase().includes("streak"));
  const hasScienceProdigy = userBadges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("science") : b?.name?.toLowerCase().includes("science"));
  const hasArenaMaster = userLevel >= 5 || userBadges.some((b: any) => typeof b === 'string' ? b.toLowerCase().includes("arena") : b?.name?.toLowerCase().includes("arena"));

  const synthesizedMilestoneBadges: any[] = [];
  
  if (isStreakUnlocked && !userBadges.some((b: any) => (typeof b === 'string' ? b : b?.name || '').toLowerCase().includes('streak'))) {
    synthesizedMilestoneBadges.push({
      id: "streak_master",
      name: "Streak Master",
      icon: Flame,
      desc: "3+ Day Daily Streak Champion",
      color: "#F59E0B"
    });
  }
  if (hasArenaMaster && !userBadges.some((b: any) => (typeof b === 'string' ? b : b?.name || '').toLowerCase().includes('arena'))) {
    synthesizedMilestoneBadges.push({
      id: "arena_master",
      name: "Arena Master",
      icon: Shield,
      desc: "Level 5+ Explorer Master",
      color: "#8B5CF6"
    });
  }
  if (hasMathAce && !userBadges.some((b: any) => (typeof b === 'string' ? b : b?.name || '').toLowerCase().includes('math'))) {
    synthesizedMilestoneBadges.push({
      id: "math_ace",
      name: "Math Ace",
      icon: Trophy,
      desc: "Master of Mathematics",
      color: "#10B981"
    });
  }
  if (hasScienceProdigy && !userBadges.some((b: any) => (typeof b === 'string' ? b : b?.name || '').toLowerCase().includes('science'))) {
    synthesizedMilestoneBadges.push({
      id: "science_prodigy",
      name: "Science Prodigy",
      icon: Star,
      desc: "Master of Science & Nature",
      color: "#06B6D4"
    });
  }

  const customBadges = userBadges.map((b, i) => ({
    id: b.id || `custom_${i}`,
    name: typeof b === 'string' ? b : b.name || `Badge ${i+1}`,
    icon: i % 2 === 0 ? Star : Shield,
    desc: typeof b === 'string' ? "Earned achievement" : b.description || "Earned achievement",
    color: i % 2 === 0 ? "#D97706" : "#0284C7"
  }));

  const badges = [...customBadges, ...synthesizedMilestoneBadges];

  // Dynamic Collection Statistics
  const totalBoxesOwned = (mysteryBoxes.common || 0) + (mysteryBoxes.rare || 0) + (mysteryBoxes.epic || 0);
  const totalDragonsHatched = dragons.length;
  const totalCitiesUnlocked = cities.filter(c => !c.status.includes('Locked')).length;
  const totalBadgesEarned = badges.length;

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
          
          <div className="flex items-center  gap-1.5">
            <Sparkles size={16} className="text-[#6C4DFF] animate-pulse" />
            <h1 className="text-[16px] font-black tracking-widest uppercase text-[#141779]">
              {t('my_treasure_vault', 'MY TREASURE VAULT')}
            </h1>
          </div>

          <div className="w-9 flex justify-end">
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
              <div className="flex-1 bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/50 flex items-center justify-center shrink-0">
                  <Coins size={18} className="text-[#D97706]" />
                </div>
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-base font-black text-[#141779] leading-none">{coins.toLocaleString()}</span>
                  <span className="text-[12px] font-extrabold text-[#D97706] tracking-wider uppercase leading-none">{t('coins_upper', 'COINS')}</span>
                </div>
              </div>

              {/* XP HUD */}
              <div className="flex-1 bg-[#F0F9FF] border border-[#0EA5E9]/40 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/20 border border-[#0EA5E9]/50 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-[#0284C7]" />
                </div>
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-base font-black text-[#141779] leading-none">{xp.toLocaleString()}</span>
                  <span className="text-[12px] font-extrabold text-[#0284C7] tracking-wider uppercase leading-none">{t('xp_upper', 'XP')}</span>
                </div>
              </div>
            </div>

            {/* Collection Level & Progress Bar */}
            <div className="bg-[#F4EFF7] border border-[#E5DBFB] rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#141779] flex items-center gap-1.5">
                  <Compass size={13} className="text-[#6C4DFF]" />
                  {t('collection_progress', 'COLLECTION PROGRESS')}
                </span>
                <span className="text-[11px] font-black text-[#6C4DFF]">
                  {t('vault_power', { score: collectionScore, defaultValue: `${collectionScore}% VAULT POWER` })}
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
              { id: "Mystery Boxes", label: t('boxes_tab', 'BOXES'), icon: Gift },
              { id: "Dragon Academy", label: t('dragons_tab', 'DRAGONS'), icon: Sparkles },
              { id: "Journey", label: t('journey_tab', 'JOURNEY'), icon: MapPin },
              { id: "Badges", label: t('badges_tab', 'BADGES'), icon: Trophy },
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
                {t('featured_vault', '✨ FEATURED VAULT')}
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
                {t('mystery_reward_vault', 'MYSTERY REWARD VAULT')}
              </h2>
              <p className="text-xs text-[#EAE2FB] font-medium mt-0.5">
                {t('open_boxes_desc', 'Open boxes to discover rare dragons, coins, and XP!')}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold text-[#EAE2FB]">
                <span>{t('box_collection', 'BOX COLLECTION')}</span>
                <span className="text-[#FFD45A] font-black">{t('boxes_ready', { count: totalBoxesOwned, defaultValue: `${totalBoxesOwned} BOXES READY` })}</span>
              </div>
            </div>

            {/* 2-Column Collectible Rarity Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: "common", name: t('common_box', 'COMMON BOX'), rarity: t('common', 'COMMON'), color: "#64748B", border: "border-slate-300", glow: "shadow-sm", bg: "bg-white", text: "text-slate-700" },
                { type: "rare", name: t('rare_box', 'RARE BOX'), rarity: t('rare', 'RARE'), color: "#0284C7", border: "border-sky-300", glow: "shadow-sm", bg: "bg-white", text: "text-sky-700" },
                { type: "epic", name: t('epic_box', 'EPIC BOX'), rarity: t('epic', 'EPIC'), color: "#9333EA", border: "border-purple-300", glow: "shadow-sm", bg: "bg-white", text: "text-purple-700" },
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
                      {t('owned_count', { count, defaultValue: `x${count} OWNED` })}
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
                      {isOpening ? t('opening', 'OPENING...') : count > 0 ? t('open_vault', 'OPEN VAULT') : t('locked_upper', 'LOCKED')}
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
                {t('mystical_dragons', '🐉 MYSTICAL DRAGONS')}
              </div>

              <span className="text-5xl block my-2 drop-shadow-[0_0_15px_rgba(255,212,90,0.6)]">🐉</span>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                {t('dragon_academy', 'DRAGON ACADEMY')}
              </h2>
              <p className="text-xs text-[#EAE2FB] font-medium mt-0.5">
                {t('hatch_fragments_desc', 'Hatch fragments and level up your companions!')}
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
                {t('dragon_journey_tab', 'Dragon Journey 🗺️')}
              </button>
              <button
                onClick={() => setSubTab("Lab")}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  subTab === "Lab"
                    ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md border border-[#9C7CFF]/40"
                    : "text-[#6D28D9] hover:text-[#141779]"
                }`}
              >
                {t('fragment_lab_tab', 'Fragment Lab 🧪')}
              </button>
            </div>

            {/* Sub-Tab 1: Dragon Journey */}
            {subTab === "Journey" && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                    {t('my_dragon_companions', 'MY DRAGON COMPANIONS')}
                  </span>
                  <span className="text-[11px] font-bold text-[#D97706]">
                    {t('dragons_hatched_count', { count: dragons.length, defaultValue: `${dragons.length} HATCHED` })}
                  </span>
                </div>

                {dragons.length === 0 ? (
                  <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-xs text-[#6D28D9]">{t('no_dragons_hatched', 'No dragons hatched yet. Collect fragments in mystery boxes!')}</p>
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
                              {t('new_badge', 'NEW')}
                            </span>
                          )}
                          <div className="w-16 h-16 rounded-full bg-[#F4EFF7] border border-[#E5DBFB] flex items-center justify-center mb-2 shadow-inner">
                            <span className="text-3xl">🐉</span>
                          </div>
                          <h3 className="text-xs font-black text-[#141779] text-center uppercase tracking-tight">{t(d.name.toLowerCase().replace(/ /g, '_'), { defaultValue: d.name })}</h3>
                          <p className="text-[10px] font-bold text-[#6C4DFF] mt-0.5">{t('level_label', 'Level')} {d.level} • {t((d.rarity || 'EPIC').toLowerCase(), d.rarity || 'EPIC')}</p>
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
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#6C4DFF]" />
                    {t('dragon_fragments', 'DRAGON FRAGMENTS')}
                  </span>
                </div>

                {(!fragments || fragments.length === 0) ? (
                  <div className="bg-white border-2 border-dashed border-[#E5DBFB] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#F4EFF7] border border-[#E5DBFB] flex items-center justify-center mb-3 shadow-inner">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <h4 className="text-xs font-black text-[#141779] mb-1 uppercase tracking-wide">
                      {t('no_fragments_yet', 'No Fragments Collected Yet')}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#767683] max-w-[260px] leading-relaxed">
                      {t('no_fragments_desc', 'Open Mystery Boxes & complete daily learning missions to collect rare dragon fragments!')}
                    </p>
                  </div>
                ) : (
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
                              <h3 className="text-xs font-black text-[#141779] capitalize">{t(f.type.toLowerCase() + '_fragments', { defaultValue: `${f.type} Fragments` })}</h3>
                              <p className="text-[10px] font-bold text-[#6D28D9]">{t('fragments_needed', { count: f.count, needed, defaultValue: `${f.count} / ${needed} Needed` })}</p>
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
                              {isHatching ? t('hatching', 'HATCHING...') : (matchingDragon ? t('upgrade', 'UPGRADE') : t('hatch', 'HATCH!'))}
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-lg">
                              {t('need_more', 'NEED MORE')}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* CATEGORY 3: JOURNEY WORLD DISCOVERY MAP */}
        {activeTab === "Journey" && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-black text-[#141779] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-[#6C4DFF]" />
                {t('world_discovery_map', 'WORLD DISCOVERY MAP')}
              </span>
              <span className="text-[11px] font-bold text-[#6C4DFF]">
                {t('cities_unlocked_count', { count: totalCitiesUnlocked, total: cities.length, defaultValue: `${totalCitiesUnlocked} / ${cities.length} UNLOCKED` })}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {Array.from(new Set(cities.map(c => c.minClass))).sort((a, b) => a - b).map((cNum) => {
                const classCities = cities.filter(c => c.minClass === cNum);
                const userClassNum = userLevel || 1;
                const isCompletedClass = cNum < userClassNum;
                const isCurrentClass = cNum === userClassNum;
                const isLockedClass = cNum > userClassNum;

                const classHeaders: Record<number, string> = {
                  1: "Class 1 • Hatchling Realm 🥚",
                  2: "Class 2 • Desert Realm 🔥",
                  3: "Class 3 • Cloud Realm ☁️",
                  4: "Class 4 • Cosmos Realm 🌌"
                };

                return (
                  <div key={cNum} className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-3.5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5DBFB] gap-2 w-full">
                      <span className="text-[11px] font-black text-[#141779] uppercase tracking-wide truncate flex-1 min-w-0">
                        {classHeaders[cNum] || `Class ${cNum} Realm 🎓`}
                      </span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap ${
                        isCompletedClass ? "bg-indigo-50 text-[#141779] border border-indigo-200" : isCurrentClass ? "bg-indigo-100 text-[#141779] border border-indigo-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {isCompletedClass ? "✓ Completed" : isCurrentClass ? "⚡ Active Class" : `🔒 Class ${cNum}`}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {classCities.map((item) => {
                        const isLocked = item.status.includes('Locked') || isLockedClass;
                        const isCurrent = item.status.includes('Current') && isCurrentClass;
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => navigate("/practice/journey-map", { state: { scrollTo: item.id } })}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer active:scale-98 ${
                              isCurrent 
                                ? 'bg-[#F2ECFF] border-[#6C4DFF] shadow-xs' 
                                : isLocked 
                                ? 'bg-slate-50 border-slate-200 opacity-60' 
                                : 'bg-white border-[#E5DBFB] hover:border-[#6C4DFF]'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${
                              isCurrent ? 'bg-[#6C4DFF] border-white text-white shadow-sm' :
                              isLocked ? 'bg-slate-200 border-white text-slate-400' : 'bg-[#3520A8] border-white text-white'
                            }`}>
                              <MapPin size={18} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-black text-[#141779] uppercase tracking-wide truncate">
                                {t(item.name.toLowerCase().trim().replace(/\s+/g, '_'), { defaultValue: item.name })}
                              </h3>
                              <p className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                                isCurrent ? 'text-[#6C4DFF]' : isLocked ? 'text-slate-400' : 'text-[#D97706]'
                              }`}>
                                {item.status}
                              </p>
                            </div>

                            <ChevronRight size={16} className="text-[#6D28D9] shrink-0" />
                          </div>
                        );
                      })}
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
                {t('achievement_vault', 'ACHIEVEMENT VAULT')}
              </span>
              <span className="text-[11px] font-bold text-[#D97706]">
                {t('badges_earned_count', { count: totalBadgesEarned, defaultValue: `${totalBadgesEarned} EARNED` })}
              </span>
            </div>

            {badges.length === 0 ? (
              <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
                <Shield size={44} className="text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-[#141779] mb-1">{t('no_badges_unlocked', 'No Badges Unlocked Yet')}</h3>
                <p className="text-xs text-[#6D28D9] max-w-[220px]">
                  {t('keep_exploring_badges', 'Keep exploring and opening Epic Mystery Boxes to unlock rare badges!')}
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
                      <h3 className="text-xs font-black text-[#141779] text-center leading-tight uppercase tracking-tight">{translateBadgeText(item.name, item.name)}</h3>
                      <p className="text-[10px] font-medium text-[#6D28D9] text-center leading-snug">{translateBadgeText(item.desc, item.desc)}</p>
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
              className="bg-white border-2 border-[#F59E0B] w-full max-w-xs rounded-3xl p-6 pt-9 text-center relative shadow-2xl mt-6"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <PartyPopper size={36} className="text-white" />
                </motion.div>
              </div>
              
              <h2 className="text-xl font-black text-[#141779] mt-6 mb-1 uppercase tracking-wider">
                {t('treasure_unlocked', 'TREASURE UNLOCKED!')}
              </h2>
              <p className="text-[#6D28D9] text-xs mb-5">
                {t('discovered_reward_desc', 'You discovered a new reward inside the vault!')}
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
                  {rewardData.amount > 0 ? `+${rewardData.amount} ` : ''}{t(rewardData.name?.toLowerCase()?.replace(/ /g, '_') || 'reward', { defaultValue: rewardData.name })}
                </h3>
              </div>
              
              <button 
                onClick={() => setRewardData(null)}
                className="w-full bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white font-black py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-md border border-[#9C7CFF]/40"
              >
                {t('awesome', 'AWESOME!')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
