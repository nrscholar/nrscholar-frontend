import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, CheckCircle, Clock, Star, StarHalf, Lock, BookOpen, TrendingUp, Users, Settings, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

const filters = [
  "All", 
  "Communication", 
  "Anger Management", 
  "Focus", 
  "Study Habits", 
  "Confidence Building", 
  "Digital Parenting", 
  "Child Psychology", 
  "Emotional Intelligence", 
  "Family Growth", 
  "Advanced Parenting"
];

export default function ParentLearningLibraryScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<any[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 100 });

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await apiFetch('/api/parent/learning-library');
        const data = await res.json();
        if (data.success) {
          setTopics(data.data.topics);
          setProgress(data.data.progress);
        }
      } catch (e) {
        console.error("Failed to fetch library", e);
      }
    };
    fetchLibrary();
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesFilter = activeFilter === "All" || topic.category === activeFilter;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-24 relative overflow-x-hidden">
      
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#141779]/5 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#006a62]/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#30007f]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-md border-b border-white/20 shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#141779]/20">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCstBkn6w9ksxtMwkOffbN6L_dZwRis-GdaNs8bQ2EaV-zmgXw660JP0qg8k0vibC2V7qXnauFt6qv6Sfnl2eGkdi_BWUQgWD9RwAeTV6N9N-yCx6V0nI8neSAVZyccr3vAlwSEeCOYa5Qnf44-NHAV4g47KUXWvBUpEzbDyoA4onsUhL9mVOaXSbHbSuA5z5fYKA_VGvr75guo_TMm1SGkFFRN9Yldx8KXazWLmCp4Ja9VL9LO_nR1_lgyDVSrLOz6MEx2qhRtDA"
            />
          </div>
          <h1 className="text-xl font-bold text-[#141779]">Library</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#141779]/10 transition-colors active:scale-95">
          <Bell size={22} className="text-[#141779]" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="mt-16 px-6 pt-6 relative z-10">
        
        {/* Header Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#141779] tracking-tight">Parent Learning</h2>
          <p className="text-[#464652] font-medium mt-1">Become a Better Parent Every Day</p>

          {/* Progress Bar Card */}
          <div className="mt-6 p-5 bg-white/70 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-sm">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141779]">Learning Progress</span>
              <span className="text-xl font-bold text-[#006a62]">{progress.completed} / {progress.total}</span>
            </div>
            <div className="h-3 w-full bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#006a62] rounded-full shadow-[0_0_8px_rgba(0,106,98,0.4)]" style={{ width: `${(progress.completed / progress.total) * 100}%` }}></div>
            </div>
            <p className="text-xs mt-2 text-[#767683] font-medium italic">{progress.total - progress.completed} more lessons to reach Master Parent level!</p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767683]" size={20} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-none bg-[#eceef0] focus:ring-2 focus:ring-[#141779]/20 transition-all text-base font-medium placeholder:text-[#c7c5d4] outline-none" 
              placeholder="Search parenting topics..." 
              type="text"
            />
          </div>

          {/* Filter Chips */}
          <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {filters.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === filter 
                    ? 'bg-[#141779] text-white shadow-md border-transparent' 
                    : 'bg-white text-[#464652] border border-[#c7c5d4] hover:bg-[#f2f4f6]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Lesson List */}
        <section className="space-y-4 pb-8 mt-6">
          {filteredTopics.map((topic) => {
            
            // Image Logic
            const imageUrl = topic.imageUrl;

            // Completed UI
            if (topic.status === "completed") {
              return (
                <div key={topic.topicId} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId === "1" ? "listening" : "focus"}`)} className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#57fae9]/30 flex-shrink-0">
                    <img className="w-full h-full object-cover opacity-80" alt={topic.title} src={imageUrl} />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#006a62]/20">
                      <CheckCircle className="text-[#007168]" size={28} fill="#57fae9" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#006a62] mb-1">{topic.category}</span>
                      <span className="text-[10px] font-bold text-[#767683]">+{topic.xp || 20} XP</span>
                    </div>
                    <h3 className="font-bold text-[#191c1e] leading-tight truncate">{topic.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Clock size={12} /> {topic.duration || 3} min</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Star size={12} fill="currentColor" /> Beginner</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Active UI
            if (topic.status === "active") {
              return (
                <div key={topic.topicId} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId === "21" ? "focus" : "listening"}`)} className="flex items-center gap-4 p-4 bg-white border-2 border-[#141779]/20 rounded-2xl shadow-md group active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#2d328f] px-3 py-1 rounded-bl-lg">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Current</span>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#e0e0ff] flex-shrink-0">
                    <img className="w-full h-full object-cover" alt={topic.title} src={imageUrl} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#141779] mb-1">{topic.category}</span>
                      <span className="text-[10px] font-bold text-[#767683]">+{topic.xp || 30} XP</span>
                    </div>
                    <h3 className="font-bold text-[#191c1e] leading-tight">{topic.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Clock size={12} /> {topic.duration || 5} min</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><StarHalf size={12} fill="currentColor" /> Intermediate</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Other Lessons (Locked)
            return (
              <div key={topic.topicId} className="flex items-center gap-4 p-4 bg-[#f2f4f6]/50 rounded-2xl opacity-70 grayscale-[0.3] group transition-all">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#eceef0] flex-shrink-0">
                  <img className="w-full h-full object-cover opacity-50" alt={topic.title} src={imageUrl} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Lock className="text-white" size={24} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#767683] mb-1">{topic.category}</span>
                    <span className="text-[10px] font-bold text-[#767683]">+{topic.xp || 20} XP</span>
                  </div>
                  <h3 className="font-bold text-[#464652] leading-tight truncate">{topic.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Clock size={12} /> {topic.duration || 3} min</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Star size={12} /> Beginner</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[rgba(236,238,240,0.9)] backdrop-blur-2xl border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 h-[80px]">
        <div className="flex flex-col items-center justify-center text-[#141779] bg-[rgba(20,23,121,0.1)] rounded-full px-5 py-2 cursor-pointer active:scale-90 transition-all">
          <BookOpen size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Lessons</span>
        </div>
        <div onClick={() => navigate('/parent/roadmap')} className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90">
          <TrendingUp size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Growth</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90">
          <Users size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Community</span>
        </div>
        <div onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center text-[#464652] cursor-pointer hover:bg-[rgba(230,232,234,0.5)] transition-all px-5 py-2 rounded-full active:scale-90">
          <Settings size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Settings</span>
        </div>
      </nav>
      
    </div>
  );
}
