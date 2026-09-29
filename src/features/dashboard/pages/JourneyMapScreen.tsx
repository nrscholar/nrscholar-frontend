import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../api";
import MapWorld from "../../../components/map/MapWorld";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    { name: "Hatchling Haven", emoji: "🐣", fallbackXp: 500, reward: "Hatchling Dragon", rewardColor: "text-amber-500" },
    { name: "Forest Kingdom", emoji: "🐉", fallbackXp: 1000, reward: "Baby Dragon", rewardColor: "text-primary" },
    { name: "Magic Desert", emoji: "🔥", fallbackXp: 2500, reward: "Fire Dragon", rewardColor: "text-orange-500" },
    { name: "Ice Kingdom", emoji: "❄️", fallbackXp: 5000, reward: "Ice Dragon", rewardColor: "text-blue-500" },
    { name: "Dragon Mountain", emoji: "🏔️", fallbackXp: 10000, reward: "Legendary Dragon", rewardColor: "text-purple-500" },
    { name: "Cloud City", emoji: "☁️", fallbackXp: 15000, reward: "Sky Dragon", rewardColor: "text-sky-500" },
    { name: "Crystal Caves", emoji: "💎", fallbackXp: 20000, reward: "Crystal Dragon", rewardColor: "text-teal-400" },
    { name: "Underworld", emoji: "🌋", fallbackXp: 30000, reward: "Shadow Dragon", rewardColor: "text-red-600" },
    { name: "Galactic Core", emoji: "🌌", fallbackXp: 50000, reward: "Cosmic Dragon", rewardColor: "text-indigo-500" },
    { name: "Stone Age Hunter", emoji: "🏹", fallbackXp: 65000, reward: "Hunter Dragon", rewardColor: "text-amber-700" },
    { name: "Bronze Craftsman", emoji: "🔨", fallbackXp: 80000, reward: "Bronze Dragon", rewardColor: "text-amber-600" },
    { name: "Civilization Leader", emoji: "👑", fallbackXp: 100000, reward: "Apex Dragon", rewardColor: "text-yellow-500" },
  ];

  const [journeyData, setJourneyData] = useState<any>(null);

  useEffect(() => {
    const fetchJourney = async () => {
      // Fetch user data
      let userFuel = 0;
      let userXp = 0;
      let userCoins = 0;
      let userName = "Explorer";
      let activeChildClass = "";
      let activeChildBoard = "";
      let activeChildId = "";

      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const uRes = await apiFetch("/api/users/me");
          const uData = await uRes.json();
          if (uData.success) {
            const u = uData.data.user;
            userFuel = u.fuel !== undefined ? u.fuel : 0;
            userXp = u.xp !== undefined ? u.xp : 0;
            userCoins = u.coins !== undefined ? u.coins : 0;
            userName = u.childName || u.fullName || "Explorer";
            setChildPhoto(u.childPhoto || "");
            setUserLevel(u.level || 1);
            activeChildClass = u.childClass || "";
            activeChildBoard = u.childBoard || "";
            activeChildId = u.activeChildId || "";
          }
        } catch (e) {}
      }
      
      setFuel(userFuel);
      setXp(userXp);
      setCoins(userCoins);
      setUsername(userName);

      // Fetch 3-tier multi-year journey progress
      try {
        let url = "/api/journey/progress";
        const params = new URLSearchParams();
        if (activeChildClass) params.append("classLevel", activeChildClass);
        if (activeChildBoard) params.append("board", activeChildBoard);
        if (activeChildId) params.append("child_id", activeChildId);
        
        const q = params.toString();
        if (q) {
          url += `?${q}`;
        }
        
        const jRes = await apiFetch(url);
        if (jRes.ok) {
          const jData = await jRes.json();
          if (jData.success && jData.data) {
            setJourneyData(jData.data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch journey progress", e);
      }

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
      <div className="bg-[#F7F9FB] text-slate-900 font-sans flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[430px] h-screen bg-gradient-to-b from-[#EEF2FF] via-[#F5F3FF] to-[#FFFFFF] flex flex-col overflow-hidden shadow-2xl animate-pulse">
          
          {/* Header Skeleton */}
          <header className="shrink-0 w-full z-50 flex justify-between items-center px-4 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-full bg-slate-200 shrink-0" />
              <div className="w-9 h-9 rounded-full bg-indigo-200 shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-28 h-3.5 rounded-md bg-slate-200" />
                <div className="w-16 h-2.5 rounded-md bg-slate-200" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-7 rounded-full bg-teal-100/70 shrink-0" />
              <div className="w-16 h-7 rounded-full bg-indigo-100/70 shrink-0" />
            </div>
          </header>

          {/* Map Body Skeleton */}
          <main className="flex-1 w-full p-4 overflow-hidden relative flex flex-col items-center pt-8">
            {/* Vertical dashed line skeleton */}
            <div className="absolute top-12 bottom-20 w-1 bg-indigo-200/50 rounded-full" />

            {/* Node Cards Skeleton */}
            <div className="w-full flex flex-col gap-8 relative z-10">
              {/* Card 1 (Left aligned) */}
              <div className="flex justify-start w-full">
                <div className="w-[78%] bg-white/90 border border-slate-200 rounded-3xl p-4 shadow-sm flex gap-3 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-teal-200/80 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-16 h-3 rounded bg-teal-200/60" />
                    <div className="w-28 h-4 rounded bg-slate-200" />
                    <div className="w-full h-2 rounded-full bg-slate-200 mt-1" />
                    <div className="w-20 h-5 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* Card 2 (Right aligned) */}
              <div className="flex justify-end w-full">
                <div className="w-[78%] bg-white/90 border border-slate-200 rounded-3xl p-4 shadow-sm flex gap-3 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-200/80 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-16 h-3 rounded bg-indigo-200/60" />
                    <div className="w-32 h-4 rounded bg-slate-200" />
                    <div className="w-full h-2 rounded-full bg-slate-200 mt-1" />
                    <div className="w-20 h-5 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* Card 3 (Left aligned) */}
              <div className="flex justify-start w-full">
                <div className="w-[78%] bg-white/90 border border-slate-200 rounded-3xl p-4 shadow-sm flex gap-3 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-16 h-3 rounded bg-slate-200" />
                    <div className="w-28 h-4 rounded bg-slate-200" />
                    <div className="w-full h-2 rounded-full bg-slate-200 mt-1" />
                    <div className="w-20 h-5 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Button Skeleton */}
            <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-400/80 shadow-lg" />
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
    <div className="bg-[#F7F9FB] text-slate-900 font-sans flex items-center justify-center h-screen">
      <div className="relative w-full max-w-[430px] h-screen bg-[#F7F9FB] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <header className="shrink-0 w-full z-50 flex justify-between items-center px-4 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/home')} 
              className="w-8.5 h-8.5 rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 flex items-center justify-center text-[#141779] transition-all border border-slate-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#141779] text-white flex items-center justify-center font-black text-xs border-2 border-white shadow-xs">
              {journeyData?.classLevel || userLevel}
            </div>
            <div>
              <h1 className="text-sm font-black text-[#141779] uppercase tracking-wider leading-none">
                {journeyData?.tierTitle ? t(journeyData.tierTitle.toLowerCase().replace(/ /g, '_'), { defaultValue: journeyData.tierTitle }) : t('growth_journey', 'Growth Journey')}
              </h1>
              <p className="text-[10px] font-bold text-[#006a62] mt-0.5">
                {journeyData?.character ? t(journeyData.character.toLowerCase().replace(/ /g, '_'), { defaultValue: journeyData.character }) : t('explorer', 'Explorer')} {journeyData?.rank && journeyData.rank !== "None" ? `(${journeyData.rank})` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full text-[10px] font-black text-[#006a62]">
              <span>📚 {journeyData ? `${journeyData.completedChapters}/${journeyData.totalTierChapters}` : "0/0"} ({journeyData?.progressPercentage || 0}%)</span>
            </div>
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full text-[10px] font-black text-[#141779]">
              <span>⭐ {xp} XP</span>
            </div>
          </div>
        </header>

        {/* Evolving Character Alert Banner */}
        {journeyData?.isEvolved && (
          <div className="shrink-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
            ✨ DRAGON EVOLVED INTO SCIENTIST! 🔬
          </div>
        )}

        {/* Growth Journey Roadmap View */}
        <main className="flex-1 w-full overflow-y-auto no-scrollbar relative">
          <MapWorld
            themeKey={journeyData?.tierKey === "scientist" ? "science" : journeyData?.tierKey === "social_proof" ? "social" : "dragon"}
            xp={xp}
            userLevel={userLevel}
            nodes={journeyData?.nodes}
            progressPercentage={journeyData?.progressPercentage}
            onEnterStage={(stage) => {
              navigate('/practice/chapters');
            }}
          />
        </main>
      </div>
    </div>
  );
}
