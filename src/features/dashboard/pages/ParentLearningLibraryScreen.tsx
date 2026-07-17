import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, CheckCircle, Clock, Star, StarHalf, Lock, BookOpen, TrendingUp, Users, Settings, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "../../../api";

const filters = [
  "All",
  "Completed",
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
  const [showMore, setShowMore] = useState(false);

  const categoryStats = topics.reduce((acc, topic) => {
    const cat = topic.category || "Other";
    if (!acc[cat]) {
      acc[cat] = { completed: 0, total: 0 };
    }
    acc[cat].total += 1;
    if (topic.status === "completed") {
      acc[cat].completed += 1;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

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
    if (activeFilter === "Completed") {
      return topic.status === "completed" && topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (topic.status === "completed") {
      return false;
    }
    const matchesFilter = activeFilter === "All" || topic.category === activeFilter;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unlockedTopicIds = new Set<string>();
  const seenCategories = new Set<string>();
  topics.forEach(topic => {
    if (topic.status !== "completed") {
      const cat = topic.category || "Other";
      if (!seenCategories.has(cat)) {
        seenCategories.add(cat);
        unlockedTopicIds.add(topic.topicId);
      }
    }
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
            
            <div className="mt-3 pt-3 border-t border-[#141779]/10">
              <button 
                onClick={() => setShowMore(!showMore)} 
                className="w-full flex items-center justify-between text-sm font-bold text-[#141779] active:scale-95 transition-all outline-none"
              >
                <span>{showMore ? "Hide Details" : "Show More Details"}</span>
                {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showMore && (
                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {Object.entries(categoryStats).map(([category, stats]: [string, any]) => (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span className="text-[#464652] font-medium">{category}</span>
                      <span className="text-[#006a62] font-bold">{stats.completed}/{stats.total} lessons</span>
                    </div>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <div className="text-sm text-[#767683] italic">No lessons available.</div>
                  )}
                </div>
              )}
            </div>
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
          {filteredTopics.map((topic, index) => {
            
            // Image Logic
            const imageUrl = topic.imageUrl;

            // Completed UI
            if (topic.status === "completed") {
              return (
                <div key={topic.topicId} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId}`)} className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
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
            if (unlockedTopicIds.has(topic.topicId)) {
              return (
                <div key={topic.topicId} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId}`)} className="flex items-center gap-4 p-4 bg-white border border-[#c7c5d4]/40 hover:border-[#141779]/30 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#e0e0ff] flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={topic.title} src={imageUrl} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#141779] mb-1">{topic.category}</span>
                      <span className="text-[10px] font-bold text-[#767683]">+{topic.xp || 30} XP</span>
                    </div>
                    <h3 className="font-bold text-[#191c1e] leading-tight">{topic.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#767683]"><Clock size={12} /> {topic.duration || 5} min</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Locked UI
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
        {/* Community */}
        <button
          onClick={() => alert("Community features are coming soon!")}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168] cursor-pointer opacity-80"
        >
          <Users size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Community</span>
        </button>
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
