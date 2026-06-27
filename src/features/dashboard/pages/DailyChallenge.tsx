import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await apiFetch("/api/practice/challenge/today");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setData({ title: "Solve 5 Math Questions", desc: "Keep up your streak!", xpReward: 50, bonusStars: 5 });
        }
      } catch (err) {
        console.error("Failed to load daily challenge", err);
        setData({ title: "Solve 5 Math Questions", desc: "Keep up your streak!", xpReward: 50, bonusStars: 5 });
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, []);

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
      </div>
      
      <button 
        onClick={() => {
          alert("Challenge Started! Good luck!");
          navigate(-1);
        }}
        className="w-full bg-[#141779] p-4 rounded-full flex items-center justify-center mt-10 hover:opacity-90 transition-opacity shadow-[0_4px_10px_rgba(20,23,121,0.2)]"
      >
        <span className="text-white text-lg font-bold">Start Activity 🚀</span>
      </button>
    </div>
  );
}
