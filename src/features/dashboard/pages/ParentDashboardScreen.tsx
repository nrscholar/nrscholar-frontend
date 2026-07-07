import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Settings, BrainCircuit, Clock, ChevronRight, Home, Activity } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentDashboardScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("Explorer");
  const [userLevel, setUserLevel] = useState(1);
  const [fuel, setFuel] = useState(350);
  const targetFuel = 500;
  const currentCityName = "Ahmedabad";
  const nextCityName = "Gandhinagar";
  const [strengths, setStrengths] = useState("Quick problem solver in Mathematics.");
  const [weaknesses, setWeaknesses] = useState("Needs more practice in Science concepts.");
  const [risks, setRisks] = useState("Slight drop in engagement this week.");
  const [todayTime, setTodayTime] = useState(0);
  const [solvedToday, setSolvedToday] = useState(0);
  const [todayConfidenceScore, setTodayConfidenceScore] = useState(0);

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          const user = json.data.user;
          setChildName(user.childName || "Explorer");
          setUserLevel(user.level || 1);
          setFuel(user.fuel || 0);
        }
        
        // Fetch dashboard extra info dynamically
        try {
          const repRes = await apiFetch("/api/parent/report");
          const repJson = await repRes.json();
          if (repJson.success && repJson.data) {
            if (repJson.data.strengths) setStrengths(repJson.data.strengths);
            if (repJson.data.weaknesses) setWeaknesses(repJson.data.weaknesses);
            if (repJson.data.risks) setRisks(repJson.data.risks);
            if (repJson.data.todayTimeMinutes !== undefined) setTodayTime(repJson.data.todayTimeMinutes);
            if (repJson.data.todaySolved !== undefined) setSolvedToday(repJson.data.todaySolved);
            if (repJson.data.todayConfidenceScore !== undefined) setTodayConfidenceScore(repJson.data.todayConfidenceScore);
          }
        } catch(e) {}

      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const fuelNeeded = targetFuel - fuel;
  const fuelPercentage = Math.min(100, Math.max(0, (fuel / targetFuel) * 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans relative pb-24 overflow-x-hidden">
      
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-5 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-1 hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(20,23,121,0.2)] overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIUh4mbkBc6p_INhz-RWpzD4E3i4upVIc85YORgArLaPQ-BpyKd__tr7dbgfBFON8CX9MoGTqr0kcDDq0wnqD7D2wSKwaeRjLNdhKTgqAdjxgrdeLOomzwwsL7MiSJ73kYyX4HhssxDlub28Yv1esVfCT5acshzaqsFjNxs7Jo7a1_eZ_-9Pg92fxcErBbW9jY4sd3EZjPVQftnKZa0dNPXJq7tNYuHG7Qb3PWg_UCPSCOyK2eylBugrfkFvCBSoxYXEcgXCaDjA" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-[22px] font-bold text-[#141779]">Parent Space</h1>
        </div>
        <button className="relative p-2 rounded-full hover:bg-[rgba(20,23,121,0.05)] transition-colors">
          <Bell size={24} color="#141779" />
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border border-white" />
        </button>
      </header>

      <main className="px-5 pt-6 flex flex-col gap-6">
        
        {/* Child Summary Hero */}
        <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(87,250,233,0.15)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-[#464652] tracking-[1px] mb-1">STUDENT PROFILE</p>
              <h2 className="text-2xl font-bold text-[#141779]">{childName}'s Journey</h2>
            </div>
            <div className="bg-[#57fae9] px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-[#007168]">Lvl {userLevel} Explorer</span>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-[rgba(242,244,246,0.5)] rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#006a62]">{todayTime}m</span>
              <span className="text-xs font-semibold text-[#767683] mt-0.5">Today's Time</span>
            </div>
            <div className="flex-1 bg-[rgba(242,244,246,0.5)] rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#30007f]">{solvedToday}</span>
              <span className="text-xs font-semibold text-[#767683] mt-0.5">Solved Today</span>
            </div>
            <div className="flex-1 bg-[rgba(242,244,246,0.5)] rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#141779] text-center">{todayConfidenceScore}%</span>
              <span className="text-xs font-semibold text-[#767683] mt-0.5">Confidence</span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-[#141779]">JOURNEY PROGRESS</span>
              <span className="text-[11px] font-bold text-[#141779]">{fuel} / {targetFuel} Fuel</span>
            </div>
            <div className="h-2 bg-[rgba(20,23,121,0.1)] rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-[#006a62] transition-all" style={{ width: `${fuelPercentage}%` }} />
            </div>
            <p className="text-[11px] text-[#767683]">
              {currentCityName} ➡️ {nextCityName} ({fuelNeeded} Fuel remaining)
            </p>
          </div>
        </div>

        {/* Learning DNA */}
        <div id="dna-section" className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#464652] px-1">Cognitive Strengths & Weaknesses</h3>
          
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#006a62]">
            <h4 className="text-[13px] font-bold text-[#006a62] mb-1">💪 Strengths (Fast Processor)</h4>
            <p className="text-xs text-[#464652]">{strengths}</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#ba1a1a]">
            <h4 className="text-[13px] font-bold text-[#ba1a1a] mb-1">⚠️ Weaknesses / Review Needed</h4>
            <p className="text-xs text-[#464652]">{weaknesses}</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#141779]">
            <h4 className="text-[13px] font-bold text-[#141779] mb-1">🔔 Risk Alerts</h4>
            <p className="text-xs text-[#464652]">{risks}</p>
          </div>
        </div>

        {/* Parent Learning Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#464652] px-1">Parent Learning</h3>
          <button 
            onClick={() => navigate('/parent/daily-tip')}
            className="w-full bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#006a62] flex items-center justify-between hover:bg-white active:scale-95 transition-all text-left mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(0,106,98,0.1)] flex items-center justify-center">
                <BrainCircuit size={24} color="#006a62" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#191c1e]">Daily Growth Tip</p>
                  <span className="bg-[#006a62] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Hot</span>
                </div>
                <p className="text-xs font-semibold text-[#767683]">Quick tips for family harmony.</p>
              </div>
            </div>
            <ChevronRight size={20} color="#006a62" />
          </button>
          <button 
            onClick={() => navigate('/parent/lessons')}
            className="w-full bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#141779] flex items-center justify-between hover:bg-white active:scale-95 transition-all text-left mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(20,23,121,0.1)] flex items-center justify-center">
                <BrainCircuit size={24} color="#141779" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#191c1e]">Daily Parenting Lessons</p>
                  <span className="bg-[#30007f] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">New</span>
                </div>
                <p className="text-xs font-semibold text-[#767683]">Bite-sized growth for busy parents.</p>
              </div>
            </div>
            <ChevronRight size={20} color="#141779" />
          </button>
          <button 
            onClick={() => navigate('/parent/challenges')}
            className="w-full bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#30007f] flex items-center justify-between hover:bg-white active:scale-95 transition-all text-left mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(48,0,127,0.1)] flex items-center justify-center">
                <BrainCircuit size={24} color="#30007f" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#191c1e]">Growth Challenges</p>
                  <span className="bg-[#ba1a1a] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Active</span>
                </div>
                <p className="text-xs font-semibold text-[#767683]">Participate to build strong habits.</p>
              </div>
            </div>
            <ChevronRight size={20} color="#30007f" />
          </button>
          <button 
            onClick={() => navigate('/parent/achievements')}
            className="w-full bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] border-l-4 border-l-[#007168] flex items-center justify-between hover:bg-white active:scale-95 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(0,106,98,0.1)] flex items-center justify-center">
                <Activity size={24} color="#007168" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#191c1e]">Parent Achievements</p>
                  <span className="bg-[#007168] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Badges</span>
                </div>
                <p className="text-xs font-semibold text-[#767683]">View your milestones and rewards.</p>
              </div>
            </div>
            <ChevronRight size={20} color="#007168" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/parent/settings')}
              className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center gap-3 hover:bg-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#767683] flex items-center justify-center">
                <Settings size={18} color="white" />
              </div>
              <span className="text-sm font-semibold text-[#464652]">Settings</span>
            </button>
            <button 
              onClick={() => navigate('/parent/learning-dna')}
              className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] flex items-center gap-3 hover:bg-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#006a62] flex items-center justify-center">
                <BrainCircuit size={18} color="white" />
              </div>
              <span className="text-sm font-semibold text-[#464652]">Learning DNA</span>
            </button>
          </div>

          <button 
            onClick={() => navigate('/parent/roadmap')}
            className="w-full bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.4)] flex justify-between items-center hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock size={24} color="#767683" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#191c1e] mb-0.5">Last Activity</h4>
                <p className="text-xs text-[#767683]">Math Apple quest solved • 2 hours ago</p>
              </div>
            </div>
            <ChevronRight size={24} color="#141779" />
          </button>
        </div>

      </main>

      {/* Parent Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-[rgba(247,249,251,0.95)] border-t-[1.5px] border-[rgba(255,255,255,0.4)] flex justify-around items-center px-4 rounded-t-3xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
        <button className="flex flex-col items-center justify-center bg-[#57fae9] px-5 py-2 rounded-2xl">
          <Home size={24} color="#007168" />
          <span className="text-xs font-bold text-[#007168] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center px-5 py-2">
          <Activity size={24} color="#464652" />
          <span className="text-xs font-semibold text-[#464652] mt-1">Reports</span>
        </button>
        <button 
          onClick={() => navigate("/parent/settings")}
          className="flex flex-col items-center justify-center px-5 py-2"
        >
          <Settings size={24} color="#464652" />
          <span className="text-xs font-semibold text-[#464652] mt-1">Settings</span>
        </button>
      </div>

    </div>
  );
}
