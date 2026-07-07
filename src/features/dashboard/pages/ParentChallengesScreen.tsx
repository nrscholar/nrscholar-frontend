import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, VolumeX, Heart, Star, ShieldCheck, Gift, Ear, Sparkles, BookOpen, Lock, TrendingUp, Users, Settings, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentChallengesScreen() {
  const navigate = useNavigate();
  const [claimState, setClaimState] = useState<"idle" | "processing" | "claimed">("idle");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          setLevel(json.data.user.level || 1);
          setStreak(json.data.user.streakDays || 0);
          setTotalXP(json.data.user.coins || 0); // Using coins as a proxy for XP if XP not available
        }
      } catch (e) {}
    }
    fetchUser();
  }, []);

  const handleClaim = () => {
    setClaimState("processing");
    setTimeout(() => {
      setClaimState("claimed");
    }, 1500);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen flex flex-col items-center overflow-hidden font-sans relative">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .progress-bar-glow {
            box-shadow: 0 0 12px rgba(87, 250, 233, 0.4);
        }
        .cosmic-gradient {
            background: linear-gradient(135deg, #141779 0%, #30007f 100%);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top App Bar */}
      <header className="w-full top-0 z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft className="text-[#141779] font-bold" size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#141779]">Growth Challenges</h1>
        </div>
        <button onClick={() => navigate('/parent/settings')} className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden active:scale-95 transition-transform">
          <img 
            className="w-full h-full object-cover" 
            alt="Parent Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhR1ehItv5Vir60De5iukS8hVmEF98CWJiONV67Aoo0HiezC3ii_tXNIjFjLSDHZf86QHoIDykvC69j1eA9Z959BJvVOMtkcOzLZ01QauAQHMv1fLp08Bz_FFd3_dqvuiWeJhluT2jf8RqAD4BdtdC1592jrhvb5jlV9JKOKetm670SfEIFoUSmpuVZDfJkU2I0iImKBb3yIydMknGdV5x9FHnpW6wxByXUYhX0wwlyc8nQRNzRMeuc5jSHG_XehwlkVWUoOjRTg"
          />
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col px-6 py-4 overflow-y-auto no-scrollbar pb-32">
        
        {/* Growth Status Header */}
        <section className="cosmic-gradient rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#e0e0ff] text-xs font-bold tracking-widest uppercase">LEVEL {level} EXPLORER</p>
                <h2 className="text-3xl font-bold">{totalXP} XP</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/30">
                <span className="text-orange-400">🔥</span>
                <span className="font-bold text-sm">{streak} Day Streak</span>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>Progress to Level 13</span>
                <span>75%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#57fae9] w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Decorative Orbit */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-white/5 rounded-full"></div>
        </section>

        {/* Active Challenges Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#141779]">Active Challenges</h3>
          <span className="text-[#006a62] font-bold text-sm">2 of 3 Active</span>
        </div>

        {/* Challenges Grid/List */}
        <div className="flex flex-col gap-4">
          
          {/* Challenge 1: No Shouting */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#141779]/10 rounded-full flex items-center justify-center text-[#141779]">
                <VolumeX size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#141779]">7 Day No Shouting Challenge</h4>
                <p className="text-[#464652] text-sm">Keep it calm, keep it kind.</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#464652]">
                <span>Day 4 / 7 Complete</span>
                <span className="text-[#006a62]">57%</span>
              </div>
              <div className="h-3 w-full bg-[#e0e3e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#006a62] progress-bar-glow w-[57%] rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-[#f2f4f6] p-2 rounded-full px-4 border border-[#c7c5d4]/30">
              <div className="flex items-center gap-2">
                <Star className="text-[#141779]" size={18} fill="currentColor" />
                <span className="text-xs font-bold text-[#141779]">+200 XP</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#006a62]" size={18} fill="currentColor" />
                <span className="text-xs font-bold text-[#464652]">Calm Parent Badge</span>
              </div>
            </div>
          </div>

          {/* Challenge 2: Appreciation */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#30007f]/10 rounded-full flex items-center justify-center text-[#30007f]">
                <Heart size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#141779]">7 Day Appreciation Challenge</h4>
                <p className="text-[#464652] text-sm">3 daily compliments to your child.</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#464652]">
                <span>Day 2 / 7 Complete</span>
                <span className="text-[#006a62]">28%</span>
              </div>
              <div className="h-3 w-full bg-[#e0e3e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#006a62] progress-bar-glow w-[28%] rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-[#f2f4f6] p-2 rounded-full px-4 border border-[#c7c5d4]/30">
              <div className="flex items-center gap-2">
                <Star className="text-[#141779]" size={18} fill="currentColor" />
                <span className="text-xs font-bold text-[#141779]">+150 XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="text-[#30007f]" size={18} fill="currentColor" />
                <span className="text-xs font-bold text-[#464652]">Heart Badge</span>
              </div>
            </div>
          </div>

          {/* Challenge 3: Completed State */}
          <div className="border-2 border-dashed border-[#006a62]/40 bg-[#006a62]/5 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4 opacity-70">
              <div className="w-12 h-12 bg-[#006a62]/20 rounded-full flex items-center justify-center text-[#006a62]">
                <Ear size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#141779]">5 Day Active Listening</h4>
                <p className="text-[#464652] text-sm">100% Focused interaction.</p>
              </div>
              <span className="bg-[#006a62] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">COMPLETED</span>
            </div>
            <button 
              onClick={handleClaim}
              disabled={claimState !== "idle"}
              className={`w-full font-bold py-3 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                claimState === "claimed" 
                  ? "bg-green-600 text-white shadow-green-600/30" 
                  : claimState === "processing"
                  ? "bg-[#006a62]/70 text-white cursor-wait"
                  : "bg-[#006a62] text-white shadow-[#006a62]/30"
              }`}
            >
              {claimState === "idle" && (
                <>
                  <Sparkles size={20} fill="currentColor" />
                  CLAIM REWARDS
                </>
              )}
              {claimState === "processing" && (
                <>
                  <Sparkles className="animate-spin" size={20} />
                  PROCESSING...
                </>
              )}
              {claimState === "claimed" && (
                <>
                  <ShieldCheck size={20} />
                  REWARDS CLAIMED!
                </>
              )}
            </button>
          </div>

          {/* Upcoming Section */}
          <h3 className="text-lg font-bold text-[#141779] mt-4">Upcoming Challenges</h3>
          
          <div className="bg-[#e0e3e5]/50 border border-[#c7c5d4]/30 rounded-2xl p-5 flex items-center gap-4 grayscale opacity-60">
            <div className="w-12 h-12 bg-[#767683]/20 rounded-full flex items-center justify-center text-[#767683]">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#141779]">7 Day Family Reading</h4>
              <p className="text-[#464652] text-sm italic">Unlocks at Level 13</p>
            </div>
            <Lock className="text-[#767683]" size={24} />
          </div>

        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full flex justify-around items-center py-3 px-4 bg-[rgba(255,255,255,0.7)] backdrop-blur-xl border-t border-white/20 shadow-lg rounded-t-xl z-50">
        <button onClick={() => navigate('/parent/lessons')} className="flex flex-col items-center justify-center text-[#464652] hover:bg-[#2d328f]/10 p-2 rounded-xl transition-all">
          <BookOpen size={24} />
          <span className="text-[11px] font-bold mt-1">Lessons</span>
        </button>
        <button onClick={() => navigate('/parent/roadmap')} className="flex flex-col items-center justify-center text-[#006a62] p-2 rounded-xl scale-110 active:scale-95 transition-transform">
          <TrendingUp size={24} />
          <span className="text-[11px] font-bold mt-1">Growth</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#464652] hover:bg-[#2d328f]/10 p-2 rounded-xl transition-all">
          <Users size={24} />
          <span className="text-[11px] font-bold mt-1">Community</span>
        </button>
        <button onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center text-[#464652] hover:bg-[#2d328f]/10 p-2 rounded-xl transition-all">
          <Settings size={24} />
          <span className="text-[11px] font-bold mt-1">Settings</span>
        </button>
      </nav>

    </div>
  );
}
