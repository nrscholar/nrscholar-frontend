import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, BookOpen, TrendingUp, Users, Settings, Plus, PlayCircle, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentLessonsScreen() {
  const navigate = useNavigate();
  const [dashboardTopics, setDashboardTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await apiFetch('/api/parent/learning-library');
        const data = await res.json();
        if (data.success) {
          // Just get the top 2 topics based on their sorted order (completed -> active -> locked)
          setDashboardTopics(data.data.topics.slice(0, 2));
        }
      } catch (e) {
        console.error("Failed to fetch dashboard topics", e);
      }
    };
    fetchLibrary();
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
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[rgba(20,23,121,0.05)] rounded-full transition-colors">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-xl font-bold text-[#141779]">Daily Parenting Lessons</h1>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#2d328f] overflow-hidden bg-white">
          <img 
            alt="Parent Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx3LP_Vbf-S9el9t3g-VvRPduHUfdcEv53EnCAKkxcIbsjWt0dQbHoDzOZzP5WYLGpLTxUAuLKb4nRN6lOymsIzFjS-QwVLydx3zVRJfbHD18ji2L0OGXplk5rMt500AicQyIv94ZQ5acFgdw--K4ng7I4uA7HAOzvjyvfC00kpyxOpSUco11uOFI_VmyjEVV8J0a4RqdaO8d1MKNsyDtVI0WvqejlQJ-WWBuYbIS34ndaYBjxmgwpX4tVu8Xs39CfBU-GXghfBA"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Growth Tracker */}
        <section className="px-6 pt-6 pb-4">
          <div className="glass-card rounded-2xl p-5 glow-teal">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-bold text-[#006a62] uppercase tracking-wider">Growth Status</p>
                <h2 className="text-2xl font-bold text-[#141779]">Level 12 Parent</h2>
              </div>
              <span className="text-[#141779] font-bold text-base">2450 / 3000 XP</span>
            </div>
            <div className="w-full bg-[#e0e3e5] rounded-full h-3 overflow-hidden">
              <div className="bg-[#006a62] h-full rounded-full shadow-[0_0_8px_rgba(0,106,98,0.5)] transition-all duration-1000" style={{ width: '75%' }}></div>
            </div>
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
            <button className="bg-[#141779] text-white px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform">For You</button>
            <button className="bg-[#e6e8ea] text-[#464652] px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-[#e0e3e5] active:scale-95 transition-all">Emotional Intelligence</button>
            <button className="bg-[#e6e8ea] text-[#464652] px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-[#e0e3e5] active:scale-95 transition-all">Child Psychology</button>
            <button className="bg-[#e6e8ea] text-[#464652] px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-[#e0e3e5] active:scale-95 transition-all">Communication</button>
            <button className="bg-[#e6e8ea] text-[#464652] px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-[#e0e3e5] active:scale-95 transition-all">Digital Parenting</button>
          </div>
        </section>

        {/* First Row: Recommended */}
        <section className="mt-4">
          <div className="px-6 flex justify-between items-center mb-4">
            <h3 className="text-[20px] font-bold text-[#191c1e]">Recommended for You</h3>
            <button onClick={() => navigate('/parent/learning-library')} className="text-[#006a62] font-bold text-sm hover:underline">See All</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 pb-4">
            {dashboardTopics.map((topic) => (
              <div 
                key={topic.topicId}
                onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId === "1" ? "listening" : "focus"}`)}
                className="flex-shrink-0 w-72 rounded-2xl overflow-hidden glass-card group cursor-pointer transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <div className="relative h-44 overflow-hidden bg-gray-200">
                  <img 
                    alt={topic.title} 
                    src={topic.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-[#57fae9] text-[#007168] px-3 py-1 rounded-full text-xs font-bold shadow-sm">+{topic.xp || 20} XP</div>
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs">{topic.duration || 3} min</div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-4 bg-white/50 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#006a62] text-[10px] font-bold uppercase tracking-widest">{topic.category}</span>
                  </div>
                  <h4 className="text-[17px] font-bold text-[#141779] leading-tight">{topic.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-[100px] right-6 w-14 h-14 rounded-full bg-[#141779] text-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <Plus size={32} />
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[rgba(236,238,240,0.9)] backdrop-blur-2xl border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 h-[80px]">
        {/* Lessons (Active) */}
        <div className="flex flex-col items-center justify-center text-[#141779] bg-[rgba(20,23,121,0.1)] rounded-full px-5 py-2 cursor-pointer active:scale-90 transition-all">
          <BookOpen size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Lessons</span>
        </div>
        {/* Growth */}
        <div 
          onClick={() => navigate('/parent/roadmap')}
          className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90"
        >
          <TrendingUp size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Growth</span>
        </div>
        {/* Community */}
        <div className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90">
          <Users size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Community</span>
        </div>
        {/* Settings */}
        <div 
          onClick={() => navigate('/parent/settings')}
          className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90"
        >
          <Settings size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Settings</span>
        </div>
      </nav>
    </div>
  );
}
