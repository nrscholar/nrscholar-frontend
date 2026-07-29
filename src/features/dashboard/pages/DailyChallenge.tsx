import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  async function loadChallenge() {
    try {
      const res = await apiFetch("/api/practice/challenge/today");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData({ title: "Solve 5 Math Questions", desc: "Keep up your streak!", xpReward: 50, bonusStars: 5, progress: 0, target: 5, completed: false, claimed: false });
      }
    } catch (err) {
      console.error("Failed to load daily challenge", err);
      setData({ title: "Solve 5 Math Questions", desc: "Keep up your streak!", xpReward: 50, bonusStars: 5, progress: 0, target: 5, completed: false, claimed: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallenge();
  }, []);

  const handleClaim = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await apiFetch("/api/practice/challenge/claim", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        alert(`Success! Claimed +${json.data.xpReward} XP and +${json.data.coinReward} Coins! 🎁`);
        if (json.data && json.data.user) {
          const cached = localStorage.getItem("userData");
          if (cached) {
            const u = JSON.parse(cached);
            u.coins = json.data.user.coins;
            u.xp = json.data.user.xp;
            u.level = json.data.user.level;
            localStorage.setItem("userData", JSON.stringify(u));
          }
          window.dispatchEvent(new Event("userDataUpdated"));
        }
        await loadChallenge();
      } else {
        alert(json.message || "Failed to claim reward");
      }
    } catch (e) {
      console.error(e);
      alert("Error claiming reward");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efff] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efff] p-5 pt-12 font-sans">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 mr-2.5 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[26px] font-extrabold text-[#141779]">Daily Challenge</h1>
      </div>
      
      <div className="bg-white p-6 rounded-[20px] flex flex-col items-center shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
        <h2 className="text-[22px] font-extrabold text-[#141779] text-center mb-2.5">{data.title}</h2>
        <p className="text-base text-[#464652] text-center mb-5">{data.desc || data.description}</p>
        
        <div className="flex gap-5">
          <span className="text-base font-bold text-[#006a62]">⭐ {data.bonusStars} Stars</span>
          <span className="text-base font-bold text-[#006a62]">✨ {data.xpReward} XP</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between text-sm font-bold text-[#141779]">
            <span>Progress</span>
            <span>{data.progress || 0} / {data.target || 1}</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((data.progress || 0) / (data.target || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {data.claimed ? (
        <div className="w-full bg-emerald-100 p-4 rounded-full flex items-center justify-center mt-10 border border-emerald-200 shadow-sm">
          <span className="text-emerald-800 text-lg font-bold">✓ Reward Claimed! 🎉</span>
        </div>
      ) : data.completed ? (
        <button 
          onClick={handleClaim}
          disabled={claiming}
          className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 p-4 rounded-full flex items-center justify-center mt-10 hover:from-amber-500 hover:to-amber-600 transition-all shadow-[0_4px_10px_rgba(245,158,11,0.2)] border border-amber-300 font-extrabold text-slate-900 text-lg animate-pulse"
        >
          <span>Claim Reward 🎁</span>
        </button>
      ) : (
        <button 
          onClick={() => {
            alert("Go ahead and practice questions or fight boss battles to progress!");
            navigate("/practice/chapters");
          }}
          className="w-full bg-[#141779] p-4 rounded-full flex items-center justify-center mt-10 hover:opacity-90 transition-opacity shadow-[0_4px_10px_rgba(20,23,121,0.2)]"
        >
          <span className="text-white text-lg font-bold">Start Activity 🚀</span>
        </button>
      )}
    </div>
  );
}
