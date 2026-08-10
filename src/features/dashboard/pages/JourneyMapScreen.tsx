import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../api";
import { motion, AnimatePresence } from "framer-motion";
import MapWorld from "../../../components/map/MapWorld";

interface City {
  _id?: string;
  name: string;
  unlocked: boolean;
  landmark: string;
  fact: string;
  badge: string;
  requiredXp: number;
}

export default function JourneyMapScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fuel, setFuel] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [username, setUsername] = useState("");
  const [childPhoto, setChildPhoto] = useState("");
  const [userLevel, setUserLevel] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mapped UI cities for visual representation
  const uiCities = [
    { name: "Egg Village", emoji: "🥚", fallbackXp: 0, reward: "Dragon Egg", rewardColor: "text-secondary-fixed" },
    { name: "Forest Kingdom", emoji: "🐉", fallbackXp: 1000, reward: "Baby Dragon", rewardColor: "text-primary" },
    { name: "Magic Desert", emoji: "🔥", fallbackXp: 2500, reward: "Fire Dragon", rewardColor: "text-orange-500" },
    { name: "Ice Kingdom", emoji: "❄️", fallbackXp: 5000, reward: "Ice Dragon", rewardColor: "text-blue-500" },
    { name: "Dragon Mountain", emoji: "🏔️", fallbackXp: 10000, reward: "Legendary Dragon", rewardColor: "text-purple-500" },
    { name: "Cloud City", emoji: "☁️", fallbackXp: 15000, reward: "Sky Dragon", rewardColor: "text-sky-500" },
    { name: "Crystal Caves", emoji: "💎", fallbackXp: 20000, reward: "Crystal Dragon", rewardColor: "text-teal-400" },
    { name: "Underworld", emoji: "🌋", fallbackXp: 30000, reward: "Shadow Dragon", rewardColor: "text-red-600" },
    { name: "Starry Sky", emoji: "⭐", fallbackXp: 40000, reward: "Star Dragon", rewardColor: "text-yellow-400" },
    { name: "Galactic Core", emoji: "🌌", fallbackXp: 50000, reward: "Cosmic Dragon", rewardColor: "text-indigo-500" },
  ];

  useEffect(() => {
    const fetchJourney = async () => {
      // Fetch user data
      let userFuel = 0;
      let userXp = 0;
      let userCoins = 0;
      let userName = "Explorer";

      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const uRes = await apiFetch("/api/users/me");
          const uData = await uRes.json();
          if (uData.success) {
            userFuel = uData.data.user.fuel !== undefined ? uData.data.user.fuel : 0;
            userXp = uData.data.user.xp !== undefined ? uData.data.user.xp : 0; // Fixed default
            userCoins = uData.data.user.coins !== undefined ? uData.data.user.coins : 0;
            userName = uData.data.user.childName || uData.data.user.fullName || "Explorer";
            setChildPhoto(uData.data.user.childPhoto || "");
            setUserLevel(uData.data.user.level || 1);
          }
        } catch (e) {}
      }
      
      // Fallback
      if (userXp === undefined || userXp === null || userName === "Explorer") {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            userFuel = u.fuel !== undefined ? u.fuel : 0;
            userName = u.childName || u.fullName || u.name || "Explorer";
            userXp = u.xp !== undefined ? u.xp : 0;
            userCoins = u.coins !== undefined ? u.coins : 0;
            setChildPhoto(u.childPhoto || "");
            setUserLevel(u.level || 1);
          } catch(e) {}
        }
      }
      setFuel(userFuel);
      setXp(userXp);
      setCoins(userCoins);
      setUsername(userName);

      const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000, 50000];

      // Fetch cities
      try {
        const cRes = await apiFetch("/api/practice/cities");
        const cData = await cRes.json();
        if (cData.success && cData.data.length > 0) {
          const mapped = cData.data.map((c: any, index: number) => {
            const reqXp = xpThresholds[index] || 0;
            return {
              _id: c._id || c.id,
              name: c.name,
              landmark: c.landmark,
              fact: c.fact,
              badge: c.badge,
              requiredXp: reqXp,
              unlocked: userXp >= reqXp
            };
          });
          setCities(mapped);
        } else {
          // Fallback to static if no cities from API
          setCities(uiCities.map((c, index) => {
            const reqXp = xpThresholds[index] || 0;
            return {
              name: c.name,
              landmark: "", fact: "", badge: "",
              requiredXp: reqXp,
              unlocked: userXp >= reqXp
            };
          }));
        }
      } catch (e) {
        console.error("Failed to fetch cities", e);
        setCities(uiCities.map((c, index) => {
          const reqXp = xpThresholds[index] || 0;
          return {
            name: c.name,
            landmark: "", fact: "", badge: "",
            requiredXp: reqXp,
            unlocked: userXp >= reqXp
          };
        }));
      }

      // Fetch unread notifications
      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}

      setLoading(false);
    };
    fetchJourney();
  }, []);

  useEffect(() => {
    if (!loading && location.state?.scrollTo !== undefined) {
      setTimeout(() => {
        const el = document.getElementById(`city-${location.state.scrollTo}`);
        if (el && scrollRef.current) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [loading, location.state]);

  const getThemeKey = (cityName: string): string => {
    if (!cityName) return "dragon";
    const name = cityName.toLowerCase();
    if (name.includes("desert") || name.includes("forest") || name.includes("egg") || name.includes("mountain") || name.includes("dragon")) return "dragon";
    if (name.includes("lab") || name.includes("science") || name.includes("crystal") || name.includes("quantum")) return "science";
    if (name.includes("arena") || name.includes("champion") || name.includes("podium") || name.includes("habits")) return "social";
    if (name.includes("space") || name.includes("star") || name.includes("galactic") || name.includes("sky") || name.includes("cloud")) return "space";
    if (name.includes("ocean") || name.includes("water") || name.includes("underworld") || name.includes("trench")) return "ocean";
    if (name.includes("ruins") || name.includes("ancient") || name.includes("history") || name.includes("temple")) return "history";
    return "dragon";
  };

  if (loading) {
    return (
      <div className="bg-background text-on-surface flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[430px] h-screen bg-surface-bright flex flex-col overflow-hidden shadow-2xl animate-pulse">
          <header className="fixed top-0 w-full max-w-[430px] z-50 flex justify-between items-center px-4 py-4 bg-surface/80 border-b-[1.5px] border-outline-variant/30 gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest shrink-0" />
              <div className="w-10 h-10 rounded-full bg-surface-container-highest shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-surface-container-highest rounded w-2/3 mb-1" />
                <div className="h-3 bg-surface-container-highest rounded w-1/3" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-surface-container-highest" />
              <div className="w-14 h-8 rounded-full bg-surface-container-highest" />
              <div className="w-14 h-8 rounded-full bg-surface-container-highest" />
            </div>
          </header>
          <main className="flex-1 mt-20 px-6 py-4 flex flex-col items-center gap-10">
            <div className="w-full h-[300px] bg-surface-container rounded-3xl" />
            <div className="w-64 h-32 bg-surface-container rounded-2xl" />
            <div className="w-64 h-32 bg-surface-container rounded-2xl" />
          </main>
        </div>
      </div>
    );
  }

  // Determine Dragon Stage based on XP (aligned with backend /evolution API)
  let dragonStage = "Pristine Egg";
  let dragonModelUrl = "/images/dragons/egg.glb";
  let dragonFallbackImage = "/images/dragons/egg.png";
  let dragonMessage = "Keep learning to hatch your egg!";
  let dragonNextGoal = 2000;
  let companionScale = 0.8;

  if (xp >= 50000) {
    dragonStage = "Cosmic Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "You control the galaxy!";
    dragonNextGoal = 50000;
    companionScale = 1.5;
  } else if (xp >= 40000) {
    dragonStage = "Star Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "A star is born!";
    dragonNextGoal = 50000;
    companionScale = 1.45;
  } else if (xp >= 30000) {
    dragonStage = "Shadow Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "Ruler of the underworld!";
    dragonNextGoal = 40000;
    companionScale = 1.4;
  } else if (xp >= 20000) {
    dragonStage = "Crystal Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "Shining brighter than ever!";
    dragonNextGoal = 30000;
    companionScale = 1.35;
  } else if (xp >= 15000) {
    dragonStage = "Sky Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "Master of the skies!";
    dragonNextGoal = 20000;
    companionScale = 1.3;
  } else if (xp >= 10000) {
    dragonStage = "Legendary Dragon";
    dragonModelUrl = "/images/dragons/legendary_dragon.glb";
    dragonFallbackImage = "/images/dragons/adult.png";
    dragonMessage = "Amazing! Your dragon is legendary!";
    dragonNextGoal = 15000;
    companionScale = 1.25;
  } else if (xp >= 5000) {
    dragonStage = "Ice Dragon";
    dragonModelUrl = "/images/dragons/teen_dragon.glb";
    dragonFallbackImage = "/images/dragons/teen.png";
    dragonMessage = "Your dragon is growing fast!";
    dragonNextGoal = 10000;
    companionScale = 1.2;
  } else if (xp >= 2500) {
    dragonStage = "Fire Dragon";
    dragonModelUrl = "/images/dragons/teen_dragon.glb";
    dragonFallbackImage = "/images/dragons/teen.png";
    dragonMessage = "Your dragon is learning to fly!";
    dragonNextGoal = 5000;
    companionScale = 1.1;
  } else if (xp >= 1000) {
    dragonStage = "Baby Dragon";
    dragonModelUrl = "/images/dragons/baby_dragon.glb";
    dragonFallbackImage = "/images/dragons/baby.png";
    dragonMessage = "Your dragon hatched! Keep learning!";
    dragonNextGoal = 2500;
    companionScale = 0.9;
  } else {
    const percentage = (xp / 1000) * 100;
    if (percentage >= 95) {
      dragonStage = "Hatching Dragon";
      dragonFallbackImage = "/images/dragons/cracked.png";
    } else if (percentage >= 50) {
      dragonStage = "Broken Egg";
      dragonFallbackImage = "/images/dragons/cracked.png";
    } else if (percentage >= 15) {
      dragonStage = "Cracking Egg";
      dragonFallbackImage = "/images/dragons/cracked.png";
    } else {
      dragonStage = "Dragon Egg";
      dragonFallbackImage = "/images/dragons/egg.png";
    }
    dragonModelUrl = "/images/dragons/egg.glb";
    dragonMessage = "Keep learning to start cracking your egg!";
    dragonNextGoal = 1000;
    companionScale = 0.8;
  }

  let startXpOfStage = 0;
  if (xp >= 50000) startXpOfStage = 50000;
  else if (xp >= 40000) startXpOfStage = 40000;
  else if (xp >= 30000) startXpOfStage = 30000;
  else if (xp >= 20000) startXpOfStage = 20000;
  else if (xp >= 15000) startXpOfStage = 15000;
  else if (xp >= 10000) startXpOfStage = 10000;
  else if (xp >= 5000) startXpOfStage = 5000;
  else if (xp >= 2500) startXpOfStage = 2500;
  else if (xp >= 1000) startXpOfStage = 1000;

  return (
    <div className="bg-[#F4F8FF] text-slate-900 font-sans flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-[390px] h-[844px] max-h-screen bg-[#F4F8FF] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Minimal Header (NRscholar Brand Royal Indigo #2D328F) */}
        <header className="fixed top-0 w-full max-w-[390px] z-40 flex justify-between items-center px-4 py-3 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/home')} 
              className="w-8.5 h-8.5 rounded-full bg-indigo-50 hover:bg-indigo-100 active:scale-95 flex items-center justify-center text-[#2D328F] transition-all border border-indigo-100"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xs font-black text-[#2D328F] uppercase tracking-widest leading-none font-headline">
                WORLD MAP
              </h1>
              <p className="text-[9.5px] font-bold text-[#14C8C6] mt-0.5">
                Explorer Level {userLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full text-[10px] font-black text-[#2D328F]">
              <span>⚡ {xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp} XP</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-black text-amber-800">
              <span>🪙 {coins}</span>
            </div>
          </div>
        </header>

        {/* EDGE-TO-EDGE STORYBOOK ADVENTURE WORLD MAP */}
        <main className="flex-1 mt-13 p-0 overflow-y-auto no-scrollbar relative flex items-center justify-center">
          <MapWorld
            themeKey="dragon"
            xp={xp}
            userLevel={userLevel}
            onEnterStage={(stage) => {
              navigate('/practice/chapters');
            }}
          />
        </main>

      </div>
    </div>
  );
}
