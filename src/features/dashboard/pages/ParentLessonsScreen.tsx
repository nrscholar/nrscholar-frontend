import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, BookOpen, TrendingUp, Users, Settings, Plus, PlayCircle, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentLessonsScreen() {
  const navigate = useNavigate();
  const [allTopics, setAllTopics] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("For You");
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [username, setUsername] = useState("Parent");
  const [profilePic, setProfilePic] = useState("");

  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await apiFetch('/api/parent/learning-library');
        const data = await res.json();
        if (data.success) {
          setAllTopics(data.data.topics);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard topics", e);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await apiFetch('/api/users/me');
        const json = await res.json();
        if (json.success && json.data?.user) {
          setLevel(json.data.user.parentLevel || 1);
          setXp(json.data.user.parentXp || 0);
          setUsername(json.data.user.parentName || json.data.user.username || "Parent");
          setProfilePic(json.data.user.parentPhoto || "");
        }
      } catch (e) { }
    };
    fetchLibrary();
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans pb-24 overflow-x-hidden relative">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .glow-teal {
            box-shadow: 0 0 15px rgba(0, 106, 98, 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* TopAppBar Navigation */}
      <header className="bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-b border-white/20 w-full top-0 z-50 flex justify-between items-center px-6 py-4 sticky">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/parent/dashboard')} className="p-1 -ml-1 hover:bg-[rgba(20,23,121,0.05)] rounded-full transition-colors">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#2d328f] overflow-hidden bg-white">
            <img
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779]">Daily Parenting Lessons</h1>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer for balance */}
      </header>

      <main className="flex-1 flex flex-col">
        {/* Growth Tracker */}
        <section className="px-6 pt-6 pb-4">
          <div className="glass-card rounded-2xl p-5 glow-teal">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-bold text-[#006a62] uppercase tracking-wider">Growth Status</p>
                <h2 className="text-2xl font-bold text-[#141779]">Level {level} Parent</h2>
              </div>
              <span className="text-[#141779] font-bold text-base">
                {xp} / {getXpForLevel(level + 1)} XP
              </span>
            </div>
            {(() => {
              const xpEnd = getXpForLevel(level + 1);
              const pct = xpEnd > 0
                ? Math.min(100, Math.round((xp / xpEnd) * 100))
                : 100;
              return (
                <div className="w-full h-3 rounded-full overflow-hidden bg-[rgba(20,23,121,0.10)] mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(to right, #141779, #57fae9)"
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </section>

        {/* Search Bar */}
        <section className="px-6 py-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767683]" size={20} />
            <input
              type="text"
              className="w-full bg-[#f2f4f6] border-none rounded-full py-4 pl-12 pr-6 text-base focus:ring-2 focus:ring-[rgba(0,106,98,0.3)] transition-all outline-none"
              placeholder="Search for lessons..."
            />
          </div>
        </section>

        {/* Categories Chips */}
        <section className="py-4">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-6">
            {["For You", "Emotional Intelligence", "Child Psychology", "Communication", "Digital Parenting"].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-all ${activeFilter === filter ? 'bg-[#141779] text-white' : 'bg-[#e6e8ea] text-[#464652] hover:bg-[#e0e3e5]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* First Row: Recommended */}
        <section className="mt-4">
          <div className="px-6 flex justify-between items-center mb-4">
            <h3 className="text-[20px] font-bold text-[#191c1e]">Recommended for You</h3>
            <button onClick={() => navigate('/parent/learning-library')} className="text-[#006a62] font-bold text-sm hover:underline">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 pb-4">
            {allTopics.filter(t => t.status !== "locked" && t.status !== "completed" && (activeFilter === "For You" || t.category === activeFilter)).slice(0, 8).map((topic) => (
              <div
                key={topic.topicId}
                onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId}`)}
                className="w-full flex flex-col rounded-2xl overflow-hidden glass-card group cursor-pointer transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <div className="relative h-28 md:h-36 overflow-hidden bg-gray-200">
                  <img
                    alt={topic.title}
                    src={topic.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 left-2 bg-[#57fae9] text-[#007168] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">+{topic.xp || 30} XP</div>
                  <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px]">{topic.duration || 3} min</div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-3 bg-white/50 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#006a62] text-[9px] font-bold uppercase tracking-widest">{topic.category}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#141779] leading-tight line-clamp-2">{topic.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-white/60 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
        {/* Lessons (Active) */}
        <button className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 bg-[#57fae9] text-[#007168] shadow-sm scale-105 cursor-pointer">
          <BookOpen size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide">Lessons</span>
        </button>
        {/* Growth */}
        <button
          onClick={() => navigate('/parent/roadmap')}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168] cursor-pointer"
        >
          <TrendingUp size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Growth</span>
        </button>
        {/* Community - Hidden until built
        <button
          onClick={() => alert("Community features are coming soon!")}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168] cursor-pointer opacity-80"
        >
          <Users size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Community</span>
        </button>
        */}
        {/* Settings */}
        <button
          onClick={() => navigate('/parent/settings')}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168] cursor-pointer"
        >
          <Settings size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Settings</span>
        </button>
      </nav>
    </div>
  );
}
