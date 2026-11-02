import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Clock, Star, Lock, ArrowLeft, ChevronDown, ChevronUp, Settings, Bell, Globe, BookOpen } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import { getLocalizedCategory, getLocalizedTopicTitle, getCanonicalCategory, getLocalizedCTA } from "../data/parentLessonTranslations";

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

  // Scoped content language strictly for Parent Lessons & See All
  const [contentLanguage, setContentLanguage] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang && ["en", "hi", "gu"].includes(urlLang)) return urlLang;
      const scoped = localStorage.getItem("parent_lessons_content_lang");
      if (scoped && ["en", "hi", "gu"].includes(scoped)) return scoped;
      const saved = localStorage.getItem("preferred_language");
      return (saved || "en").split("-")[0];
    } catch (e) {
      return "en";
    }
  });

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<any[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 100 });
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  // Synchronize state when scoped language event triggers
  useEffect(() => {
    const handleScopedLangChange = (e: any) => {
      const newLang = e?.detail?.lang;
      if (newLang && newLang !== contentLanguage) {
        setContentLanguage(newLang);
        fetchLibrary(newLang);
      }
    };
    window.addEventListener("parentLessonsLanguageChanged", handleScopedLangChange);
    return () => {
      window.removeEventListener("parentLessonsLanguageChanged", handleScopedLangChange);
    };
  }, [contentLanguage]);

  const categoryStats = (topics || []).reduce((acc, topic) => {
    if (!topic) return acc;
    const cat = getCanonicalCategory(topic.originalCategory || topic.category) || "Other";
    if (!acc[cat]) {
      acc[cat] = { completed: 0, total: 0 };
    }
    acc[cat].total += 1;
    if (topic.status === "completed") {
      acc[cat].completed += 1;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  const fetchLibrary = async (langOverride?: string) => {
    try {
      setLoading(true);
      const targetLang = langOverride || contentLanguage;
      const res = await apiFetch(`/api/parent/learning-library?lang=${encodeURIComponent(targetLang)}`, {
        headers: { "Accept-Language": targetLang }
      });
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
      setTimeout(() => setLoading(false), 200);
    }
  };

  useEffect(() => {
    fetchLibrary();

    const handleUserDataUpdate = () => {
      fetchLibrary();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
  }, [contentLanguage]);

  const handleLanguageChange = (newLang: string) => {
    // 1. Immediately update local state
    setContentLanguage(newLang);
    setLangDropdownOpen(false);

    // 2. Persist to scoped storage key ONLY (keep global app language intact)
    try {
      localStorage.setItem("parent_lessons_content_lang", newLang);
      sessionStorage.removeItem("parent_learning_library_cache");
    } catch (e) {}

    // 3. Broadcast scoped event for seamless sync across Parent Lessons & See All
    window.dispatchEvent(new CustomEvent("parentLessonsLanguageChanged", { detail: { lang: newLang } }));

    // 4. Fetch fresh library in newly selected language
    fetchLibrary(newLang);

    // 5. Persist to parent controls in backend (asynchronous / non-blocking)
    try {
      apiFetch('/api/parent/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentLanguage: newLang })
      }).catch(() => {});
    } catch (e) {}
  };

  const filteredTopics = (topics || []).filter(topic => {
    if (!topic) return false;
    const origTitle = String(topic.title || "");
    const localizedTitle = getLocalizedTopicTitle(topic, contentLanguage);
    const query = (searchQuery || "").trim().toLowerCase();

    if (activeFilter === "Completed") {
      const isCompleted = topic.status === "completed";
      const matchesSearch = !query || 
        origTitle.toLowerCase().includes(query) || 
        localizedTitle.toLowerCase().includes(query);
      return isCompleted && matchesSearch;
    }

    const canonFilter = getCanonicalCategory(activeFilter);
    const canonTopicCat = getCanonicalCategory(topic.originalCategory || topic.category);
    const matchesFilter = activeFilter === "All" || canonTopicCat === canonFilter || topic.category === activeFilter;

    const matchesSearch = !query || 
      origTitle.toLowerCase().includes(query) || 
      localizedTitle.toLowerCase().includes(query) ||
      getLocalizedCategory(topic.category, contentLanguage).toLowerCase().includes(query);

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
          <h1 className="text-base sm:text-lg font-black text-[#141779] truncate leading-tight">
            {contentLanguage === "hi" ? "अभिभावक लाइब्रेरी" : contentLanguage === "gu" ? "વાલી લાયબ્રેરી" : "Parent Library"}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dedicated Lesson Language Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/80 text-[#141779] font-bold text-xs shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <Globe size={14} className="text-[#006a62]" />
              <span className="text-xs font-bold">{contentLanguage === "hi" ? "हिन्दी" : contentLanguage === "gu" ? "ગુજરાતી" : "English"}</span>
              <ChevronDown size={14} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in duration-200">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "gu", label: "ગુજરાતી" }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${contentLanguage === lang.code ? 'bg-[#141779] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <h2 className="text-2xl sm:text-3xl font-black text-[#141779] tracking-tight">
                {contentLanguage === "hi" ? "अभिभावक शिक्षण" : contentLanguage === "gu" ? "વાલી શિક્ષણ" : "Parent Learning"}
              </h2>
              <p className="text-xs sm:text-sm text-[#464652] font-semibold mt-0.5">
                {contentLanguage === "hi" ? "हर दिन एक बेहतर अभिभावक बनें" : contentLanguage === "gu" ? "દરરોજ એક વધુ સારા વાલી બનો" : "Become a Better Parent Every Day"}
              </p>

              {/* Progress Bar Card */}
              <div className="mt-3.5 p-4 sm:p-4.5 bg-white/70 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#141779]">
                    {contentLanguage === "hi" ? "सीखने की प्रगति" : contentLanguage === "gu" ? "શીખવાની પ્રગતિ" : "Learning Progress"}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#006a62]">{progress.completed} / {progress.total}</span>
                </div>
                <div className="h-2.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006a62] rounded-full shadow-[0_0_8px_rgba(0,106,98,0.4)]" style={{ width: `${(progress.completed / (progress.total || 1)) * 100}%` }}></div>
                </div>
                <p className="text-xs mt-1.5 text-[#767683] font-medium italic">
                  {contentLanguage === "hi"
                    ? `मास्टर पेरेंट स्तर तक पहुंचने के लिए ${Math.max(0, progress.total - progress.completed)} और पाठ!`
                    : contentLanguage === "gu"
                    ? `માસ્ટર વાલી સ્તર સુધી પહોંચવા માટે વધુ ${Math.max(0, progress.total - progress.completed)} પાઠ!`
                    : `${Math.max(0, progress.total - progress.completed)} more lessons to reach Master Parent level!`}
                </p>
                
                <div className="mt-2.5 pt-2.5 border-t border-[#141779]/10">
                  <button 
                    onClick={() => setShowMore(!showMore)} 
                    className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-[#141779] active:scale-95 transition-all outline-none cursor-pointer"
                  >
                    <span>
                      {showMore
                        ? getLocalizedCTA("hide_details", contentLanguage)
                        : getLocalizedCTA("show_details", contentLanguage)}
                    </span>
                    {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showMore && (
                    <div className="mt-2.5 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      {Object.entries(categoryStats).map(([category, stats]: [string, any]) => (
                        <div key={category} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-[#464652] font-medium">{getLocalizedCategory(category, contentLanguage)}</span>
                          <span className="text-[#006a62] font-bold">
                            {stats.completed}/{stats.total} {contentLanguage === "hi" ? "पाठ" : contentLanguage === "gu" ? "પાઠ" : "lessons"}
                          </span>
                        </div>
                      ))}
                      {Object.keys(categoryStats).length === 0 && (
                        <div className="text-xs text-[#767683] italic">
                          {contentLanguage === "hi" ? "कोई पाठ उपलब्ध नहीं है।" : contentLanguage === "gu" ? "કોઈ પાઠ ઉપલબ્ધ નથી." : "No lessons available."}
                        </div>
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
                  placeholder={contentLanguage === "hi" ? "अभिभावकीय विषय खोजें..." : contentLanguage === "gu" ? "વાલીપણાના વિષયો શોધો..." : "Search parenting topics..."} 
                  type="text"
                />
              </div>

              {/* Filter Chips */}
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
                {filterList.map((filter) => {
                  const label = filter === "All"
                    ? (contentLanguage === "hi" ? "सभी" : contentLanguage === "gu" ? "બધા" : "All")
                    : filter === "Completed"
                    ? (contentLanguage === "hi" ? "पूर्ण" : contentLanguage === "gu" ? "પૂર્ણ થયેલ" : "Completed")
                    : getLocalizedCategory(filter, contentLanguage);

                  return (
                    <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                        activeFilter === filter 
                          ? 'bg-[#141779] text-white shadow-xs border-transparent' 
                          : 'bg-white text-[#464652] border border-[#c7c5d4] hover:bg-[#f2f4f6]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Lesson List */}
            <section className="space-y-3 pb-8 mt-3.5 sm:mt-4">
              {filteredTopics.length === 0 ? (
                <div className="w-full py-12 px-6 text-center flex flex-col items-center justify-center bg-white/50 border border-slate-200/50 rounded-3xl shadow-xs backdrop-blur-xs">
                  <BookOpen size={48} className="text-[#141779]/30 mb-4 animate-pulse" />
                  <p className="text-base font-bold text-[#141779]">
                    {activeFilter === "Completed"
                      ? (contentLanguage === "hi" ? "कोई पूर्ण पाठ नहीं मिला" : contentLanguage === "gu" ? "કોઈ પૂર્ણ થયેલ પાઠ મળ્યો નથી" : "No completed lessons found")
                      : (contentLanguage === "hi" ? "कोई पाठ उपलब्ध नहीं है" : contentLanguage === "gu" ? "કોઈ પાઠ ઉપલબ્ધ નથી" : "No lessons available")}
                  </p>
                </div>
              ) : (
                filteredTopics.map((topic, idx) => {
                  const imageUrl = topic.imageUrl;
                  const itemKey = topic.topicId || topic._id || topic.id || `topic-${idx}`;
                  const displayCategory = getLocalizedCategory(topic.originalCategory || topic.category, contentLanguage);
                  const displayTitle = getLocalizedTopicTitle(topic, contentLanguage);
                  const xpCompletedLabel = contentLanguage === "hi" ? "पूर्ण" : contentLanguage === "gu" ? "પૂર્ણ" : "Completed";
                  const minLabel = contentLanguage === "hi" ? "मिनट" : contentLanguage === "gu" ? "મિનિટ" : "min";
                  const beginnerLabel = contentLanguage === "hi" ? "प्रारंभिक" : contentLanguage === "gu" ? "પ્રારંભિક" : "Beginner";

                  // Completed UI
                  if (topic.status === "completed") {
                    return (
                      <div 
                        key={itemKey} 
                        onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId || topic._id || topic.id}&lang=${encodeURIComponent(contentLanguage)}`)} 
                        className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#57fae9]/30 flex-shrink-0">
                          <img className="w-full h-full object-cover opacity-80" alt={displayTitle} src={imageUrl} />
                          <div className="absolute inset-0 flex items-center justify-center bg-[#006a62]/20">
                            <CheckCircle className="text-[#007168]" size={28} fill="#57fae9" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-black uppercase tracking-wider text-[#006a62] mb-1">{displayCategory}</span>
                            <span className="text-xs font-black text-[#767683]">+{topic.xp || 20} XP ({xpCompletedLabel})</span>
                          </div>
                          <h3 className="font-black text-base text-[#191c1e] leading-snug truncate">{displayTitle}</h3>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 3} {minLabel}</span>
                              <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Star size={12} fill="currentColor" /> {beginnerLabel}</span>
                            </div>
                            <span className="text-xs font-bold text-[#006a62] bg-[#006a62]/10 px-2.5 py-0.5 rounded-full group-hover:bg-[#006a62] group-hover:text-white transition-colors">
                              {getLocalizedCTA("review", contentLanguage)} →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Active UI
                  if (topic.status === "active") {
                    return (
                      <div 
                        key={itemKey} 
                        onClick={() => navigate(`/parent/lessons/player?id=${topic.topicId || topic._id || topic.id}&lang=${encodeURIComponent(contentLanguage)}`)} 
                        className="flex items-center gap-4 p-4 bg-white border border-[#c7c5d4]/40 hover:border-[#141779]/30 rounded-2xl shadow-sm group active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#e0e0ff] flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={displayTitle} src={imageUrl} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-black uppercase tracking-wider text-[#141779] mb-1">{displayCategory}</span>
                            <span className="text-xs font-black text-[#767683]">+{topic.xp || 30} XP</span>
                          </div>
                          <h3 className="font-black text-base text-[#191c1e] leading-snug">{displayTitle}</h3>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 5} {minLabel}</span>
                              <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Star size={12} /> {beginnerLabel}</span>
                            </div>
                            <span className="text-xs font-bold text-white bg-[#141779] px-3 py-0.5 rounded-full shadow-2xs group-hover:bg-[#006a62] transition-colors">
                              {getLocalizedCTA("start_lesson", contentLanguage)} →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Locked UI
                  return (
                    <div key={itemKey} className="flex items-center gap-4 p-4 bg-[#f2f4f6]/50 rounded-2xl opacity-70 grayscale-[0.3] group transition-all">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#eceef0] flex-shrink-0">
                        <img className="w-full h-full object-cover opacity-50" alt={displayTitle} src={imageUrl} />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Lock className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-black uppercase tracking-wider text-[#767683] mb-1">{displayCategory}</span>
                          <span className="text-xs font-black text-[#767683]">+{topic.xp || 20} XP</span>
                        </div>
                        <h3 className="font-black text-base text-[#464652] leading-snug truncate">{displayTitle}</h3>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Clock size={12} /> {topic.duration || 3} {minLabel}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-[#767683]"><Star size={12} /> {beginnerLabel}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {getLocalizedCTA("locked", contentLanguage)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
