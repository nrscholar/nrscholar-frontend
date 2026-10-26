import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Clock, Star, Lock, ArrowLeft, ChevronDown, ChevronUp, Settings, Bell } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

const filterKeys: Record<string, string> = {
  "All": "all",
  "Completed": "completed",
  "Communication": "communication",
  "Anger Management": "anger_management",
  "Child Psychology": "child_psychology",
  "Emotional Intelligence": "emotional_intelligence",
  "Focus": "focus",
  "Study Habits": "study_habits",
  "Confidence Building": "confidence_building",
  "Digital Parenting": "digital_parenting",
  "Family Growth": "family_growth",
  "Advanced Parenting": "advanced_parenting"
};

const filterList = [
  "All",
  "Completed",
  "Communication", 
  "Anger Management", 
  "Child Psychology", 
  "Emotional Intelligence", 
  "Focus", 
  "Study Habits", 
  "Confidence Building", 
  "Digital Parenting", 
  "Family Growth", 
  "Advanced Parenting"
];

export default function ParentLearningLibraryScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getInitialLibraryData = () => {
    try {
      const cached = sessionStorage.getItem("parent_learning_library_cache");
      return cached ? JSON.parse(cached) : null;
    } catch (e) { return null; }
  };

  const initialLib = getInitialLibraryData();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<any[]>(initialLib?.topics || []);
  const [progress, setProgress] = useState(initialLib?.progress || { completed: 0, total: 100 });
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(!initialLib);

  const categoryStats = (topics || []).reduce((acc, topic) => {
    if (!topic) return acc;
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
        if (topics.length === 0) {
          setLoading(true);
        }
        const res = await apiFetch('/api/parent/learning-library');
        const data = await res.json();
        if (data && data.success && data.data) {
          setTopics(Array.isArray(data.data.topics) ? data.data.topics : []);
          if (data.data.progress) {
            setProgress(data.data.progress);
          }
          sessionStorage.setItem("parent_learning_library_cache", JSON.stringify(data.data));
        }
      } catch (e) {
        console.error("Failed to fetch library", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();

    const handleUserDataUpdate = () => {
      fetchLibrary();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
  }, []);

  const filteredTopics = (topics || []).filter(topic => {
    if (!topic) return false;
    const title = String(topic.title || "");
    const query = (searchQuery || "").toLowerCase();
    if (activeFilter === "Completed") {
      return topic.status === "completed" && title.toLowerCase().includes(query);
    }
    const matchesFilter = activeFilter === "All" || topic.category === activeFilter;
    const matchesSearch = title.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans pb-4 relative overflow-x-clip">
      
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#141779]/5 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#006a62]/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#30007f]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Top App Bar */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex justify-between items-center px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-200/80 bg-white shrink-0 shadow-2xs">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCstBkn6w9ksxtMwkOffbN6L_dZwRis-GdaNs8bQ2EaV-zmgXw660JP0qg8k0vibC2V7qXnauFt6qv6Sfnl2eGkdi_BWUQgWD9RwAeTV6N9N-yCx6V0nI8neSAVZyccr3vAlwSEeCOYa5Qnf44-NHAV4g47KUXWvBUpEzbDyoA4onsUhL9mVOaXSbHbSuA5z5fYKA_VGvr75guo_TMm1SGkFFRN9Yldx8KXazWLmCp4Ja9VL9LO_nR1_lgyDVSrLOz6MEx2qhRtDA"
            />
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#141779] truncate leading-tight">{t("library", "Library")}</h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button 
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-5 sm:px-6 pt-2.5 sm:pt-3 relative z-10">
        {loading ? (
          <div className="space-y-4">
            {/* Title Section Skeleton */}
            <div className="space-y-1.5">
              <div className="h-7 w-48 rounded-xl animate-skeleton"></div>
              <div className="h-3.5 w-56 rounded-lg animate-skeleton"></div>
            </div>

            {/* Progress Card Skeleton */}
            <div className="p-4 bg-white/70 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-32 rounded-lg animate-skeleton"></div>
                <div className="h-5 w-14 rounded-lg animate-skeleton"></div>
              </div>
              <div className="h-2.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
                <div className="h-full w-2/5 rounded-full animate-skeleton"></div>
              </div>
              <div className="h-2.5 w-48 rounded-md animate-skeleton"></div>
              <div className="pt-2.5 border-t border-[#141779]/10 flex justify-between items-center">
                <div className="h-3.5 w-28 rounded-md animate-skeleton"></div>
                <div className="h-3.5 w-3.5 rounded-full animate-skeleton"></div>
              </div>
            </div>

            {/* Search Capsule Skeleton */}
            <div className="h-11 w-full bg-[#eceef0] rounded-full flex items-center px-4 gap-3">
              <div className="w-4 h-4 rounded-full animate-skeleton shrink-0"></div>
              <div className="h-3.5 w-40 rounded-md animate-skeleton"></div>
            </div>

            {/* Filter Chips Skeleton */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
              {[70, 95, 110, 100, 85].map((w, idx) => (
                <div 
                  key={idx} 
                  className="h-8 rounded-full shrink-0 animate-skeleton" 
                  style={{ width: `${w}px` }}
                ></div>
              ))}
            </div>

            {/* Topic Cards Grid Skeleton */}
            <div className="space-y-3 pt-1 pb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3.5 p-3.5 bg-white/80 backdrop-blur-md border border-[#c7c5d4]/40 rounded-2xl shadow-xs">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl animate-skeleton shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-20 rounded-md animate-skeleton"></div>
                      <div className="h-3 w-10 rounded-md animate-skeleton"></div>
                    </div>
                    <div className="h-4 w-4/5 rounded-md animate-skeleton"></div>
                    <div className="flex items-center gap-2.5 pt-0.5">
                      <div className="h-2.5 w-14 rounded-md animate-skeleton"></div>
                      <div className="h-2.5 w-14 rounded-md animate-skeleton"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>

        
        {/* Header Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141779] tracking-tight">{t("parent_learning", "Parent Learning")}</h2>
          <p className="text-xs sm:text-sm text-[#464652] font-semibold mt-0.5">{t("become_better_parent", "Become a Better Parent Every Day")}</p>

          {/* Progress Bar Card */}
          <div className="mt-3.5 p-4 sm:p-4.5 bg-white/70 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141779]">{t("learning_progress", "Learning Progress")}</span>
              <span className="text-lg sm:text-xl font-bold text-[#006a62]">{progress.completed} / {progress.total}</span>
            </div>
            <div className="h-2.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#006a62] rounded-full shadow-[0_0_8px_rgba(0,106,98,0.4)]" style={{ width: `${(progress.completed / progress.total) * 100}%` }}></div>
            </div>
            <p className="text-xs mt-1.5 text-[#767683] font-medium italic">
              {t("more_lessons_master", { count: progress.total - progress.completed, defaultValue: `${progress.total - progress.completed} more lessons to reach Master Parent level!` })}
            </p>
            
            <div className="mt-2.5 pt-2.5 border-t border-[#141779]/10">
              <button 
                onClick={() => setShowMore(!showMore)} 
                className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-[#141779] active:scale-95 transition-all outline-none"
              >
                <span>{showMore ? t("hide_details", "Hide Details") : t("show_more_details", "Show More Details")}</span>
                {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showMore && (
                <div className="mt-2.5 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  {Object.entries(categoryStats).map(([category, stats]: [string, any]) => (
                    <div key={category} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-[#464652] font-medium">{String(t(filterKeys[category] || String(category || "other").toLowerCase().replace(/\s+/g, "_"), category || "Other"))}</span>
                      <span className="text-[#006a62] font-bold">{stats.completed}/{stats.total} {String(t("lessons_lower", "lessons"))}</span>
                    </div>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <div className="text-xs text-[#767683] italic">{t("no_lessons_avail", "No lessons available.")}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767683]" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full border-none bg-[#eceef0] focus:ring-2 focus:ring-[#141779]/20 transition-all text-xs sm:text-sm font-medium placeholder:text-[#c7c5d4] outline-none" 
              placeholder={t("search_parenting_topics", "Search parenting topics...")} 
              type="text"
            />
          </div>

          {/* Filter Chips */}
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
            {filterList.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === filter 
                    ? 'bg-[#141779] text-white shadow-xs border-transparent' 
                    : 'bg-white text-[#464652] border border-[#c7c5d4] hover:bg-[#f2f4f6]'
                }`}
              >
                {String(t(filterKeys[filter] || String(filter || "").toLowerCase().replace(/\s+/g, "_"), filter))}
              </button>
            ))}
          </div>
        </section>

        {/* Lesson List */}
        <section className="space-y-3 pb-4 mt-3.5 sm:mt-4">
          {filteredTopics.map((topic, idx) => {
            const imageUrl = topic.imageUrl;
            const itemKey = topic.topicId || topic._id || `topic-${idx}`;
            const catDisplay = topic.category || "Other";
            const catKey = filterKeys[catDisplay] || String(catDisplay).toLowerCase().replace(/\s+/g, "_");

            // Completed UI
            if (topic.status === "completed") {
              return (
                <div key={itemKey} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId || topic._id}`)} className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#57fae9]/30 flex-shrink-0">
                    <img className="w-full h-full object-cover opacity-80" alt={String(topic.title || "Topic")} src={imageUrl} />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#006a62]/20">
                      <CheckCircle className="text-[#007168]" size={28} fill="#57fae9" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black uppercase tracking-wider text-[#006a62] mb-1">{String(t(catKey, catDisplay))}</span>
                      <span className="text-xs font-black text-[#767683]">+{topic.xp || 20} XP</span>
                    </div>
                    <h3 className="font-black text-base text-[#191c1e] leading-snug truncate">{String(topic.title || "")}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 3} min</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Star size={12} fill="currentColor" /> {t("beginner", "Beginner")}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Active UI
            if (topic.status === "active") {
              return (
                <div key={itemKey} onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId || topic._id}`)} className="flex items-center gap-4 p-4 bg-white border border-[#c7c5d4]/40 hover:border-[#141779]/30 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#e0e0ff] flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={String(topic.title || "Topic")} src={imageUrl} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black uppercase tracking-wider text-[#141779] mb-1">{String(t(catKey, catDisplay))}</span>
                      <span className="text-xs font-black text-[#767683]">+{topic.xp || 30} XP</span>
                    </div>
                    <h3 className="font-black text-base text-[#191c1e] leading-snug">{String(topic.title || "")}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 5} min</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Locked UI
            return (
              <div key={itemKey} className="flex items-center gap-4 p-4 bg-[#f2f4f6]/50 rounded-2xl opacity-70 grayscale-[0.3] group transition-all">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#eceef0] flex-shrink-0">
                  <img className="w-full h-full object-cover opacity-50" alt={String(topic.title || "Topic")} src={imageUrl} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Lock className="text-white" size={24} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase tracking-wider text-[#767683] mb-1">{String(t(catKey, catDisplay))}</span>
                    <span className="text-xs font-black text-[#767683]">+{topic.xp || 20} XP</span>
                  </div>
                  <h3 className="font-black text-base text-[#464652] leading-snug truncate">{String(topic.title || "")}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 3} min</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Star size={12} /> {t("beginner", "Beginner")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
        </>
        )}
      </main>
    </div>
  );
}


