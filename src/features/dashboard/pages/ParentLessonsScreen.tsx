import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Settings, PlayCircle, ArrowLeft, Lock, ChevronDown, Globe, Bell, Check, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import {
  LessonsLanguage,
  getLocalizedCategory,
  getLocalizedTopicTitle,
  getCanonicalCategory,
  PARENT_LESSONS_UI_TEXT
} from "./parentLessonsTranslations";
import { getLocalizedCTA } from "../data/parentLessonTranslations";
import { progressFillStyle } from "../../../utils/progressBar";

export default function ParentLessonsScreen() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [allTopics, setAllTopics] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "For You";
  });
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [username, setUsername] = useState("Parent");
  const [profilePic, setProfilePic] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeFilter]);

  const [contentLanguage, setContentLanguage] = useState<LessonsLanguage>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang === "hi" || urlLang === "gu" || urlLang === "en") return urlLang as LessonsLanguage;
      const session = sessionStorage.getItem("parent_lessons_lang");
      if (session === "hi" || session === "gu" || session === "en") return session as LessonsLanguage;
      const scoped = localStorage.getItem("parent_lessons_content_lang");
      if (scoped === "hi" || scoped === "gu" || scoped === "en") return scoped as LessonsLanguage;
      const base = (i18n?.language || "en").split("-")[0];
      return (base === "hi" || base === "gu") ? (base as LessonsLanguage) : "en";
    } catch {
      return "en";
    }
  });

  const [loading, setLoading] = useState(true);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  const fetchLibrary = useCallback(async (langOverride?: LessonsLanguage) => {
    try {
      setLoading(true);
      const targetLang = langOverride || contentLanguage;
      const res = await apiFetch(`/api/parent/learning-library?lang=${encodeURIComponent(targetLang)}`, {
        headers: { "Accept-Language": targetLang }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.topics)) {
        setAllTopics(data.data.topics);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard topics", e);
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  }, [contentLanguage]);

  // Synchronize state when scoped language event triggers
  useEffect(() => {
    const handleScopedLangChange = (e: any) => {
      const newLang = e?.detail?.lang;
      if (newLang && (newLang === 'en' || newLang === 'hi' || newLang === 'gu') && newLang !== contentLanguage) {
        setContentLanguage(newLang as LessonsLanguage);
        sessionStorage.setItem("parent_lessons_lang", newLang);
        fetchLibrary(newLang as LessonsLanguage);
      }
    };
    window.addEventListener("parentLessonsLanguageChanged", handleScopedLangChange);
    return () => {
      window.removeEventListener("parentLessonsLanguageChanged", handleScopedLangChange);
    };
  }, [contentLanguage, fetchLibrary]);

  useEffect(() => {
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
      } catch (e) {
        console.error("Failed to fetch user data", e);
      }
    };

    fetchUser();
    fetchLibrary();

    const handleUserDataUpdate = () => {
      fetchUser();
      fetchLibrary();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
  }, [fetchLibrary]);

  const handleLanguageChange = (newLang: LessonsLanguage) => {
    setContentLanguage(newLang);
    sessionStorage.setItem("parent_lessons_lang", newLang);
    setLangDropdownOpen(false);

    try {
      localStorage.setItem("parent_lessons_content_lang", newLang);
      sessionStorage.removeItem("parent_learning_library_cache");
    } catch {
      /* ignore storage errors */
    }

    window.dispatchEvent(new CustomEvent("parentLessonsLanguageChanged", { detail: { lang: newLang } }));
    fetchLibrary(newLang);

    try {
      apiFetch('/api/parent/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentLanguage: newLang })
      }).catch(() => {
        /* ignore background sync errors */
      });
    } catch {
      /* ignore api initiation errors */
    }
  };

  const filteredTopics = allTopics.filter(t => {
    if (activeFilter === "Completed") {
      return t.status === "completed";
    }
    if (activeFilter === "For You") {
      return true;
    }
    const canon = getCanonicalCategory(t.originalCategory || t.category);
    return canon === activeFilter || t.category === activeFilter;
  });

  const visibleTopics = isExpanded ? filteredTopics : filteredTopics.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans pb-4 overflow-x-clip relative">
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
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex justify-between items-center px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-sm hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={PARENT_LESSONS_UI_TEXT.back[contentLanguage]}
            title={PARENT_LESSONS_UI_TEXT.back[contentLanguage]}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/80 overflow-hidden bg-white shrink-0 shadow-sm">
            <img
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#141779] truncate leading-tight">
            {PARENT_LESSONS_UI_TEXT.headerTitle[contentLanguage]}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dedicated Lesson Language Selector */}
          <div className="relative shrink-0">
            <button
              id="lessons-language-button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/80 text-[#141779] font-bold text-xs shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <Globe size={14} className="text-[#006a62]" />
              <span className="text-xs font-bold">{contentLanguage === "hi" ? "हिन्दी" : contentLanguage === "gu" ? "ગુજરાતી" : "English"}</span>
              <ChevronDown size={14} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in duration-200">
                {[
                  { code: "en" as const, label: "English", id: "lessons-lang-en" },
                  { code: "hi" as const, label: "हिन्दी", id: "lessons-lang-hi" },
                  { code: "gu" as const, label: "ગુજરાતી", id: "lessons-lang-gu" }
                ].map(lang => (
                  <button
                    key={lang.code}
                    id={lang.id}
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
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-sm hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={PARENT_LESSONS_UI_TEXT.settings[contentLanguage]}
            title={PARENT_LESSONS_UI_TEXT.settings[contentLanguage]}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-sm hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={PARENT_LESSONS_UI_TEXT.notifications[contentLanguage]}
            title={PARENT_LESSONS_UI_TEXT.notifications[contentLanguage]}
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Growth Tracker */}
        <section className="px-5 sm:px-6 pt-2.5 sm:pt-3 pb-1">
          <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_8px_24px_rgba(30,27,75,0.06)] border border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-bold text-[#006a62] uppercase tracking-wider">
                  {PARENT_LESSONS_UI_TEXT.growthStatus[contentLanguage]}
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-[#141779]">
                  {PARENT_LESSONS_UI_TEXT.levelParent(level, contentLanguage)}
                </h2>
              </div>
              <span className="text-[#141779] font-black text-sm sm:text-base">
                {xp} / {getXpForLevel(level + 1)} XP
              </span>
            </div>
            {(() => {
              const xpEnd = getXpForLevel(level + 1);
              const pct = xpEnd > 0
                ? Math.min(100, Math.round((xp / xpEnd) * 100))
                : 100;
              return (
                <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-100 mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={progressFillStyle(pct)}
                  />
                </div>
              );
            })()}
          </div>
        </section>

        {/* Categories Chips */}
        <section className="pt-2 pb-2">
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-5 sm:px-6">
            {[
              { id: "For You", label: contentLanguage === "hi" ? "आपके लिए" : contentLanguage === "gu" ? "તમારા માટે" : "For You" },
              { id: "Completed", label: contentLanguage === "hi" ? "पूर्ण पाठ" : contentLanguage === "gu" ? "પૂર્ણ થયેલા પાઠ" : "Completed" },
              { id: "Communication", label: getLocalizedCategory("Communication", contentLanguage) },
              { id: "Anger Management", label: getLocalizedCategory("Anger Management", contentLanguage) },
              { id: "Child Psychology", label: getLocalizedCategory("Child Psychology", contentLanguage) },
              { id: "Emotional Intelligence", label: getLocalizedCategory("Emotional Intelligence", contentLanguage) },
              { id: "Focus", label: getLocalizedCategory("Focus", contentLanguage) },
              { id: "Study Habits", label: getLocalizedCategory("Study Habits", contentLanguage) },
              { id: "Confidence Building", label: getLocalizedCategory("Confidence Building", contentLanguage) },
              { id: "Digital Parenting", label: getLocalizedCategory("Digital Parenting", contentLanguage) },
              { id: "Family Growth", label: getLocalizedCategory("Family Growth", contentLanguage) },
              { id: "Advanced Parenting", label: getLocalizedCategory("Advanced Parenting", contentLanguage) }
            ].map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${activeFilter === filter.id ? 'bg-[#141779] text-white shadow-sm' : 'bg-[#e6e8ea] text-[#464652] hover:bg-[#e0e3e5]'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* First Row: Recommended / Completed */}
        <section className="mt-2.5 sm:mt-3">
          <div className="px-5 sm:px-6 flex justify-between items-center mb-2.5 sm:mb-3 gap-2">
            <h3 className="text-lg sm:text-xl font-black text-[#191c1e] leading-normal flex-1 min-w-0">
              {activeFilter === "Completed" 
                ? PARENT_LESSONS_UI_TEXT.completedLessonsTitle[contentLanguage]
                : PARENT_LESSONS_UI_TEXT.recommendedForYou[contentLanguage]}
            </h3>
            {filteredTopics.length > 6 && (
              <button 
                onClick={() => setIsExpanded(prev => !prev)} 
                className="text-[#006a62] font-bold text-xs sm:text-sm hover:underline cursor-pointer flex items-center gap-1 group select-none"
              >
                <span>
                  {isExpanded
                    ? (contentLanguage === "hi" ? "कम देखें" : contentLanguage === "gu" ? "ઓછું જુઓ" : "Show Less")
                    : PARENT_LESSONS_UI_TEXT.seeAll[contentLanguage]}
                </span>
                <span className={`transition-transform ${isExpanded ? 'group-hover:-translate-y-0.5' : 'group-hover:translate-x-0.5'}`}>
                  {isExpanded ? '↑' : '→'}
                </span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 px-5 sm:px-6 pb-4">
            {(() => {
              if (loading) {
                return Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="w-full h-full flex flex-col rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-[0_4px_20px_rgba(30,27,75,0.06)]">
                    <div className="relative h-28 sm:h-32 bg-slate-100 animate-pulse"></div>
                    <div className="p-3 bg-white flex-1 space-y-2 border-t border-slate-100">
                      <div className="h-2.5 w-16 animate-skeleton rounded"></div>
                      <div className="h-4 w-3/4 animate-skeleton rounded"></div>
                    </div>
                  </div>
                ));
              }

              if (filteredTopics.length === 0) {
                return (
                  <div className="col-span-2 w-full py-12 px-6 text-center flex flex-col items-center justify-center bg-white/50 border border-slate-200/50 rounded-3xl shadow-sm backdrop-blur-sm">
                    <BookOpen size={48} className="text-[#141779]/30 mb-4 animate-pulse" />
                    <p className="text-base font-bold text-[#141779]">
                      {activeFilter === "Completed"
                        ? PARENT_LESSONS_UI_TEXT.noCompletedTitle[contentLanguage]
                        : PARENT_LESSONS_UI_TEXT.allCompletedTitle[contentLanguage]}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 mt-2 max-w-[280px] leading-relaxed">
                      {activeFilter === "Completed"
                        ? PARENT_LESSONS_UI_TEXT.noCompletedDesc[contentLanguage]
                        : PARENT_LESSONS_UI_TEXT.allCompletedDesc[contentLanguage]}
                    </p>
                    {activeFilter === "Completed" && (
                      <button 
                        onClick={() => setActiveFilter("For You")}
                        className="mt-5 px-5 py-2.5 bg-[#141779] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#30007f] active:scale-95 transition-all cursor-pointer"
                      >
                        {PARENT_LESSONS_UI_TEXT.browseLessonsBtn[contentLanguage]}
                      </button>
                    )}
                  </div>
                );
              }

              return visibleTopics.map((topic) => {
                const isCompleted = topic.status === "completed";
                const isLocked = topic.status === "locked";
                const localizedTitle = getLocalizedTopicTitle(topic.topicId, topic.title, contentLanguage);
                const localizedCategory = getLocalizedCategory(topic.originalCategory || topic.category, contentLanguage);

                return (
                  <div
                    key={topic.topicId}
                    onClick={() => !isLocked && navigate(`/parent/lessons/player?id=${topic.topicId}&lang=${encodeURIComponent(contentLanguage)}`)}
                    className={`bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(30,27,75,0.06)] border border-slate-100 flex flex-col justify-between group transition-all relative ${
                      isLocked ? "opacity-90" : "cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                    }`}
                  >
                    <div className="relative h-28 sm:h-32 overflow-hidden bg-slate-900">
                      <img
                        alt={localizedTitle}
                        src={topic.imageUrl}
                        className={`w-full h-full object-cover transition-transform duration-700 ${!isLocked ? 'group-hover:scale-110' : 'brightness-75'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                      {isCompleted ? (
                        <div 
                          className="absolute top-2 left-2 bg-[#006a62]/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-sm border border-white/20 flex items-center gap-1 z-10"
                          title={PARENT_LESSONS_UI_TEXT.completedBadge[contentLanguage]}
                          aria-label={PARENT_LESSONS_UI_TEXT.completedBadge[contentLanguage]}
                        >
                          <CheckCircle2 size={10} className="text-[#57fae9]" />
                          <span>+0 XP ({contentLanguage === "hi" ? "पूर्ण" : contentLanguage === "gu" ? "પૂર્ણ" : "Completed"})</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-[#141779] backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-sm border border-white/20 z-10">
                          +{topic.xp || 30} XP
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white/10 z-10">
                        {PARENT_LESSONS_UI_TEXT.minuteDuration(topic.duration || 3, contentLanguage)}
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        {!isLocked && <PlayCircle size={36} className="text-white drop-shadow-lg" />}
                      </div>
                      {isLocked && (
                        <div 
                          className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] flex flex-col items-center justify-center text-white z-20 gap-1 p-2 text-center"
                          title={PARENT_LESSONS_UI_TEXT.lockedMessage[contentLanguage]}
                          aria-label={PARENT_LESSONS_UI_TEXT.lockedMessage[contentLanguage]}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                            <Lock size={15} />
                          </div>
                          <span className="text-[9px] font-extrabold text-slate-300 tracking-wider uppercase">
                            {getLocalizedCTA("locked", contentLanguage)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white backdrop-blur-md flex-1 flex flex-col justify-between text-left border-t border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black text-[#006a62] tracking-widest uppercase block mb-0.5">{localizedCategory}</span>
                        </div>
                        <h4 className="text-[11px] sm:text-xs font-bold text-[#141779] leading-snug line-clamp-2">{localizedTitle}</h4>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1.5">
                        {isCompleted ? (
                          <span className="text-[11px] font-black text-[#006a62] flex items-center gap-1 group-hover:underline">
                            {getLocalizedCTA("review_lesson", contentLanguage)} →
                          </span>
                        ) : isLocked ? (
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            {getLocalizedCTA("locked", contentLanguage)}
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-[#141779] group-hover:text-[#006a62] flex items-center gap-1 transition-colors">
                            {getLocalizedCTA("start_lesson", contentLanguage)} →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>
      </main>
    </div>
  );
}
