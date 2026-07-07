import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Globe, BookOpen, Flame, Lock, GraduationCap, Users, X, TrendingUp, Settings, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentAchievementsScreen() {
  const navigate = useNavigate();
  const [activeAchievement, setActiveAchievement] = useState<string | null>(null);
  const [badgesEarned, setBadgesEarned] = useState(3);
  const [globalRank, setGlobalRank] = useState(142);
  const [streakDays, setStreakDays] = useState(0);
  const [testsCompleted, setTestsCompleted] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const uRes = await apiFetch("/api/users/me");
        const uJson = await uRes.json();
        let streak = 0;
        if (uJson.success && uJson.data?.user) {
          streak = uJson.data.user.streakDays || 0;
          setStreakDays(streak);
          setGlobalRank(Math.max(1, 5000 - (uJson.data.user.totalStars || 0) * 10));
        }

        const rRes = await apiFetch("/api/parent/report");
        const rJson = await rRes.json();
        if (rJson.success && rJson.data) {
          setTestsCompleted(rJson.data.totalTests || 0);
          
          let earned = 0;
          if (rJson.data.totalTests > 0) earned++;
          if (streak >= 7) earned++;
          if (rJson.data.totalTests >= 10) earned++;
          setBadgesEarned(earned);
        }
      } catch (e) {}
    }
    fetchStats();
  }, []);

  const achievementsData: Record<string, { title: string, icon: any, iconBg: string, iconColor: string, date: string, desc: string, progress: number, progressText: string }> = {
    lesson: {
      title: "First Steps",
      icon: BookOpen,
      iconBg: testsCompleted > 0 ? "bg-gradient-to-br from-[#006a62] to-[#141779]" : "bg-[#e0e3e5] grayscale",
      iconColor: testsCompleted > 0 ? "text-white" : "text-[#767683]",
      date: testsCompleted > 0 ? "Unlocked!" : "Locked",
      desc: "Successfully completed your first parenting module or test. The journey of a thousand miles begins here!",
      progress: testsCompleted > 0 ? 100 : 0,
      progressText: testsCompleted > 0 ? "1/1 Modules" : "0/1 Modules"
    },
    streak7: {
      title: "Week On Fire",
      icon: Flame,
      iconBg: streakDays >= 7 ? "bg-gradient-to-br from-[#30007f] to-[#2d328f]" : "bg-[#e0e3e5] grayscale",
      iconColor: streakDays >= 7 ? "text-white" : "text-[#767683]",
      date: streakDays >= 7 ? "Unlocked!" : "Locked",
      desc: "Maintained a consistent learning rhythm for 7 consecutive days. You are building amazing habits!",
      progress: Math.min(100, (streakDays / 7) * 100),
      progressText: `${Math.min(7, streakDays)}/7 Days`
    },
    lesson10: {
      title: "Rising Scholar",
      icon: GraduationCap,
      iconBg: testsCompleted >= 10 ? "bg-gradient-to-br from-[#57fae9] to-[#006a62]" : "bg-[#e0e3e5] grayscale",
      iconColor: testsCompleted >= 10 ? "text-[#007168]" : "text-[#767683]",
      date: testsCompleted >= 10 ? "Unlocked!" : "Locked",
      desc: "You have completed 10 lessons or tests! Your dedication to growth is making a real difference at home.",
      progress: Math.min(100, (testsCompleted / 10) * 100),
      progressText: `${Math.min(10, testsCompleted)}/10 Lessons`
    }
  };

  const showDetails = (key: string) => {
    setActiveAchievement(key);
  };

  const hideDetails = () => {
    setActiveAchievement(null);
  };

  return (
    <div className="flex flex-col items-center justify-start text-[#191c1e] bg-[#f7f9fb] h-screen overflow-hidden font-sans">
      <style>{`
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .badge-glow {
            filter: drop-shadow(0 0 8px rgba(0, 106, 98, 0.4));
        }
        .hexagon {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-b border-[#c7c5d4]/30 shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft className="text-[#141779] font-bold" size={24} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#141779]/20">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9JzpVuteLhnBmiRka1Pw7sOhA3jsE1Zn0vKjGHb1PC2lOUIJHYy7DL9s3F4MPBK0JAg6m9Vy17DJFKVI1L4hFeaav-1fNzAW6AwLOohI3hsbUcv4Ee56iFKwGbpiZzK6hunCaJNJyZ6IFIlifZHcOkry0SpStAklSQAycDOSc-zHKuaodDemfTodaYrM0_VBmeyOX3cXzGV_N9ekKi0ugCna0gA9nSrDpDOoGnCbGHBsQF4zj8r9bzThYRkzxW9ujcYa2IT9hMg"
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779] tracking-tight">Achievements</h1>
        </div>
        <button className="text-[#141779] hover:bg-[#e6e8ea] transition-colors p-2 rounded-full active:scale-95">
          <Bell size={24} />
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[430px] h-full pt-20 pb-24 px-6 flex flex-col items-center overflow-y-auto no-scrollbar relative">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#006a62]/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#141779]/10 rounded-full blur-[80px] -z-10"></div>
        
        {/* Header Section */}
        <section className="w-full mt-4 mb-6">
          <h2 className="text-2xl font-bold text-[#141779] mb-4 text-center">Parent Achievements</h2>
          <div className="glass-panel rounded-xl p-5 flex justify-around items-center shadow-sm">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#464652] mb-1">Badges Earned</p>
              <div className="flex items-center justify-center gap-1">
                <GraduationCap className="text-[#006a62]" size={24} />
                <span className="text-2xl font-bold text-[#141779]">{badgesEarned}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-[#c7c5d4]/50"></div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#464652] mb-1">Global Rank</p>
              <div className="flex items-center justify-center gap-1">
                <Globe className="text-[#30007f]" size={24} />
                <span className="text-2xl font-bold text-[#141779]">#{globalRank}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Chips */}
        <section className="w-full mb-8 overflow-x-auto no-scrollbar flex gap-3 pb-2">
          <button className="whitespace-nowrap px-6 py-2 rounded-full bg-[#141779] text-white font-bold text-sm shadow-md transition-all active:scale-95">All</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Communication</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Patience</button>
          <button className="whitespace-nowrap px-6 py-2 rounded-full glass-panel text-[#464652] font-bold text-sm hover:bg-[#e6e8ea] transition-all active:scale-95">Consistency</button>
        </section>

        {/* Achievement Wall */}
        <section className="w-full grid grid-cols-3 gap-y-10 gap-x-4 mb-8">
          {/* Unlocked: First Lesson */}
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => showDetails('lesson')}>
            <div className={`hexagon w-20 h-20 ${achievementsData.lesson.iconBg} flex items-center justify-center shadow-lg badge-glow group-active:scale-95 transition-transform`}>
              <BookOpen className={achievementsData.lesson.iconColor} size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#141779]">First Steps</p>
          </div>
          
          {/* Unlocked: 7 Day Streak */}
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => showDetails('streak7')}>
            <div className={`hexagon w-20 h-20 ${achievementsData.streak7.iconBg} flex items-center justify-center shadow-lg badge-glow group-active:scale-95 transition-transform`}>
              <Flame className={achievementsData.streak7.iconColor} size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#141779]">Week On Fire</p>
          </div>
          
          {/* Locked: 30 Day Streak */}
          <div className="flex flex-col items-center opacity-50 grayscale">
            <div className="hexagon w-20 h-20 bg-[#e0e3e5] flex items-center justify-center border-2 border-dashed border-[#767683]">
              <Lock className="text-[#767683]" size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#767683]">Monthly Master</p>
          </div>
          
          {/* Unlocked: 10 Lessons */}
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => showDetails('lesson10')}>
            <div className={`hexagon w-20 h-20 ${achievementsData.lesson10.iconBg} flex items-center justify-center shadow-lg badge-glow group-active:scale-95 transition-transform`}>
              <GraduationCap className={achievementsData.lesson10.iconColor} size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#141779]">Rising Scholar</p>
          </div>
          
          {/* Locked: 5 Challenges */}
          <div className="flex flex-col items-center opacity-50 grayscale">
            <div className="hexagon w-20 h-20 bg-[#e0e3e5] flex items-center justify-center border-2 border-dashed border-[#767683]">
              <Lock className="text-[#767683]" size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#767683]">Challenger</p>
          </div>
          
          {/* Locked: Community */}
          <div className="flex flex-col items-center opacity-50 grayscale">
            <div className="hexagon w-20 h-20 bg-[#e0e3e5] flex items-center justify-center border-2 border-dashed border-[#767683]">
              <Users className="text-[#767683]" size={32} />
            </div>
            <p className="text-xs font-bold text-center mt-3 text-[#767683]">Supporter</p>
          </div>
        </section>

        {/* Dynamic Detail Card */}
        {activeAchievement && (
          <section className="w-full glass-panel rounded-xl p-6 shadow-xl border-[#006a62]/30 animate-fade-in-up">
            <div className="flex items-start gap-4 mb-4">
              <div className={`hexagon w-16 h-16 flex items-center justify-center shadow-md ${achievementsData[activeAchievement].iconBg}`}>
                {React.createElement(achievementsData[activeAchievement].icon, {
                  className: `${achievementsData[activeAchievement].iconColor}`,
                  size: 28
                })}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#141779]">
                  {achievementsData[activeAchievement].title}
                </h3>
                <p className="text-xs text-[#006a62] font-semibold">
                  {achievementsData[activeAchievement].date}
                </p>
              </div>
              <button 
                className="text-[#464652] hover:text-[#ba1a1a] transition-colors" 
                onClick={hideDetails}
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-[#464652] mb-4 leading-relaxed">
              {achievementsData[activeAchievement].desc}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-[#141779]">Progress</span>
                <span className="text-xs text-[#464652]">
                  {achievementsData[activeAchievement].progressText}
                </span>
              </div>
              <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#006a62] transition-all duration-1000 ease-out" 
                  style={{ width: `${achievementsData[activeAchievement].progress}%` }}
                ></div>
              </div>
            </div>
          </section>
        )}

        <div className="w-full h-12"></div> {/* Spacer */}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full rounded-t-xl z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-t border-[#c7c5d4]/30 shadow-lg flex justify-around items-center px-2 py-3">
        <button onClick={() => navigate('/parent/lessons')} className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <BookOpen className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Lessons</span>
        </button>
        <button onClick={() => navigate('/parent/roadmap')} className="flex flex-col items-center justify-center bg-[#57fae9] text-[#007168] rounded-full px-5 py-2 hover:bg-[#e0e3e5] transition-all active:scale-90 shadow-sm">
          <TrendingUp className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Growth</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <Users className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Community</span>
        </button>
        <button onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center text-[#464652] px-5 py-1 hover:bg-[#e0e3e5] transition-all active:scale-90 rounded-lg">
          <Settings className="mb-1" size={24} />
          <span className="text-[11px] font-semibold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
