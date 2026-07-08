import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, Zap, Shield, MapPin, Package, Star, Gift, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";

export default function InventoryScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Badges" | "Cities" | "Items" | "Mystery Boxes" | "Dragon Academy">("Mystery Boxes");

  const [mysteryBoxes, setMysteryBoxes] = useState<any>({});
  const [dragons, setDragons] = useState<any[]>([]);
  const [fragments, setFragments] = useState<any[]>([]);
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  const [hatchingType, setHatchingType] = useState<string | null>(null);
  const [rewardData, setRewardData] = useState<any>(null);

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [userBadges, setUserBadges] = useState<any[]>([]);

  useEffect(() => {
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
        }
      } catch (e) {}
    };
    
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
        body: JSON.stringify({ fragment_type: type })
      });
      if (res.ok) {
        const newDragon = await res.json();
        setTimeout(() => {
          setRewardData({ type: 'dragon', amount: 0, name: newDragon.name });
          setDragons(prev => [...prev, newDragon]);
          setFragments(prev => prev.map(f => f.type === type ? { ...f, count: Math.max(0, f.count - 10) } : f));
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
        body: JSON.stringify({ box_type: type })
      });
      if (res.ok) {
        const data = await res.json();
        // Artificial delay for animation
        setTimeout(() => {
          setRewardData(data);
          setOpeningBox(null);
          // Refetch boxes
          setMysteryBoxes(prev => ({...prev, [type]: Math.max(0, (prev[type] || 0) - 1)}));
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
          // fallback
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

  const xpThresholds = [0, 1000, 2500, 5000, 10000];
  const cities = citiesData.map((cityData, index) => {
    const reqXp = xpThresholds[index] || 0;
    const nextReqXp = xpThresholds[index + 1] || 99999;
    const isUnlocked = xp >= reqXp;
    const isCurrent = isUnlocked && (index === citiesData.length - 1 || xp < nextReqXp);

    let status = "Locked 🔒";
    let rating = "☆☆☆☆☆";
    
    if (isCurrent) {
      status = "Current Location 📍";
      rating = "★★★★★";
    } else if (isUnlocked) {
      status = "Unlocked 🎉";
      rating = "★★★★☆";
    }

    return {
      id: String(index),
      name: cityData.name,
      status,
      rating
    };
  });



  const badges = userBadges.map((b, i) => ({
    id: String(i),
    name: b.name || `Badge ${i+1}`,
    icon: i % 2 === 0 ? Star : Shield,
    desc: b.description || "Earned achievement",
    color: i % 2 === 0 ? "#ffd700" : "#2addcd"
  }));

  const items = [
    { id: "1", name: "Explorer Hat", icon: Package, type: "Avatar Item" },
    { id: "2", name: "Double XP", icon: Zap, type: "XP Booster" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24">
      <header className="px-5 py-4 bg-white border-b border-[#f0f0f0] sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-xl font-bold text-[#141779]">My Inventory</h1>
          <div className="w-10" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-[rgba(255,215,0,0.15)] rounded-2xl p-3 flex items-center gap-3">
            <Coins size={28} color="#ff9f43" />
            <div>
              <p className="text-xl font-bold text-[#141779]">{coins}</p>
              <p className="text-[9px] font-bold text-[#767683] tracking-widest">COINS</p>
            </div>
          </div>
          <div className="flex-1 bg-[rgba(87,250,233,0.2)] rounded-2xl p-3 flex items-center gap-3">
            <Zap size={28} color="#141779" />
            <div>
              <p className="text-xl font-bold text-[#141779]">{xp}</p>
              <p className="text-[9px] font-bold text-[#767683] tracking-widest">XP</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 mt-4">
        <div className="flex bg-white p-1.5 rounded-xl border border-[#f0f0f0] overflow-x-auto gap-2 scrollbar-hide">
          {["Mystery Boxes", "Dragon Academy", "Badges", "Cities", "Items"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-none px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === tab ? "bg-[#141779] text-white" : "text-[#767683] hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 mt-6">
        {activeTab === "Badges" && (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col items-center border border-[#f0f0f0] gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={32} color={item.color} />
                  </div>
                  <h3 className="text-sm font-bold text-[#141779] text-center">{item.name}</h3>
                  <p className="text-xs text-[#767683] text-center">{item.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Cities" && (
          <div className="flex flex-col gap-3">
            {cities.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#f0f0f0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(20,23,121,0.05)] flex items-center justify-center">
                    <MapPin size={20} color="#141779" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#141779]">{item.name}</h3>
                    <p className="text-xs font-semibold text-[#006a62]">{item.status}</p>
                  </div>
                </div>
                <span className="text-[#ffd700] text-lg tracking-widest">{item.rating}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Items" && (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col items-center border border-[#f0f0f0] gap-2">
                  <div className="w-16 h-16 rounded-full bg-[rgba(20,23,121,0.05)] flex items-center justify-center">
                    <Icon size={32} color="#141779" />
                  </div>
                  <h3 className="text-sm font-bold text-[#141779] text-center">{item.name}</h3>
                  <p className="text-xs text-[#767683] text-center">{item.type}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Mystery Boxes" && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#141779] rounded-[24px] p-6 text-center text-white relative overflow-hidden shadow-lg border-2 border-[#57fae9]">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[rgba(255,255,255,0.1)] rounded-full blur-xl"></div>
              <Gift size={48} className="mx-auto mb-3 text-[#57fae9]" />
              <h2 className="text-xl font-bold mb-1">Mystery Boxes</h2>
              <p className="text-xs text-[#b8b8d2]">Open boxes to earn rare dragons, coins, and XP!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["common", "rare", "epic"].map(type => {
                const count = mysteryBoxes[type] || 0;
                let bgColors = "from-[#f0f0f0] to-[#ffffff]";
                let borderColor = "border-[#d0d0d0]";
                if (type === 'rare') { bgColors = "from-[#e0f7fa] to-[#ffffff]"; borderColor = "border-[#00bcd4]"; }
                if (type === 'epic') { bgColors = "from-[#f3e5f5] to-[#ffffff]"; borderColor = "border-[#9c27b0]"; }
                
                return (
                  <motion.div 
                    key={type}
                    animate={openingBox === type ? { 
                      x: [0, -10, 10, -10, 10, -5, 5, 0],
                      y: [0, -5, 5, -5, 5, 0],
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 0.5, repeat: openingBox === type ? Infinity : 0 }}
                    className={`bg-gradient-to-br ${bgColors} rounded-[20px] p-4 border-2 ${borderColor} flex flex-col items-center relative overflow-hidden shadow-sm`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-inner">
                      <Package size={32} color={type === 'epic' ? '#9c27b0' : type === 'rare' ? '#00bcd4' : '#767683'} />
                    </div>
                    <h3 className="text-sm font-bold text-[#141779] uppercase">{type} Box</h3>
                    <p className="text-xs text-[#767683] font-bold mb-3">x{count} Owned</p>
                    
                    <button 
                      onClick={() => openMysteryBox(type)}
                      disabled={count === 0 || openingBox !== null}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        count > 0 && openingBox !== type
                          ? "bg-[#141779] text-white hover:opacity-90 active:scale-95" 
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {openingBox === type ? "Opening..." : "Open"}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "Dragon Academy" && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#141779] rounded-[24px] p-6 text-center text-white relative overflow-hidden shadow-lg border-2 border-[#ff9f43]">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[rgba(255,255,255,0.1)] rounded-full blur-xl"></div>
              <span className="text-5xl block mb-2">🐉</span>
              <h2 className="text-xl font-bold mb-1">Dragon Academy</h2>
              <p className="text-xs text-[#b8b8d2]">Hatch fragments and level up your mystical companions!</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#767683] tracking-widest uppercase mb-3">My Dragons</h2>
              {dragons.length === 0 ? (
                <div className="bg-white rounded-[20px] p-6 text-center border border-[#f0f0f0]">
                  <p className="text-sm text-[#767683]">No dragons hatched yet. Collect fragments!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {dragons.map((d: any) => (
                    <motion.div 
                      key={d.id} 
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" }}
                      className="bg-gradient-to-br from-[#e0e0ff] to-[#ffffff] rounded-[20px] p-4 border-2 border-[#141779] flex flex-col items-center shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
                        <span className="text-3xl">🐉</span>
                      </div>
                      <h3 className="text-[13px] font-bold text-[#141779] text-center">{d.name}</h3>
                      <p className="text-[10px] font-bold text-[#767683]">Level {d.level} • {d.rarity}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#767683] tracking-widest uppercase mb-3">Dragon Fragments</h2>
              <div className="flex flex-col gap-3">
                {fragments.map((f: any) => (
                  <motion.div 
                    key={f.type} 
                    animate={hatchingType === f.type ? {
                      x: [-5, 5, -5, 5, -5, 5, 0],
                      scale: [1, 1.05, 1.05, 1],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                    } : {}}
                    transition={{ duration: 0.5, repeat: hatchingType === f.type ? Infinity : 0 }}
                    className="bg-white rounded-[20px] p-4 border border-[#f0f0f0] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[rgba(20,23,121,0.05)] flex items-center justify-center">
                        <span className="text-xl">🧩</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#141779] capitalize">{f.type} Fragments</h3>
                        <p className="text-xs text-[#767683] font-semibold">{f.count} / 10 Needed</p>
                      </div>
                    </div>
                    {f.count >= 10 && (
                      <button 
                        onClick={() => combineFragments(f.type)}
                        disabled={hatchingType !== null}
                        className={`text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors ${hatchingType === f.type ? "bg-gray-400" : "bg-[#20c997] hover:bg-[#1bb386]"}`}
                      >
                        {hatchingType === f.type ? "Hatching..." : "Hatch!"}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* REWARD MODAL */}
      <AnimatePresence>
        {rewardData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center relative shadow-2xl"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 bg-[#ff9f43] rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <PartyPopper size={48} color="white" />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#141779] mt-8 mb-2">Reward Found!</h2>
              <p className="text-[#767683] text-sm mb-6">You unlocked something special from the Mystery Box.</p>
              
              <div className="bg-[#f7f9fb] rounded-[20px] p-6 mb-6 border-2 border-[#eef0f2]">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl block mb-2"
                >
                  {rewardData.type === 'coins' ? '🪙' : rewardData.type === 'xp' ? '⭐' : '🐉'}
                </motion.span>
                <h3 className="text-xl font-bold text-[#141779]">
                  {rewardData.amount > 0 ? `+${rewardData.amount} ` : ''}{rewardData.name}
                </h3>
              </div>
              
              <button 
                onClick={() => setRewardData(null)}
                className="w-full bg-[#141779] text-white font-bold py-4 rounded-[16px] hover:opacity-90 active:scale-95 transition-all text-lg shadow-[0_4px_12px_rgba(20,23,121,0.2)]"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
