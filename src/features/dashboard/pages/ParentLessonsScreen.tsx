import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, BookOpen, TrendingUp, Users, Settings, Plus, PlayCircle, ArrowLeft, Lock, ChevronDown, Globe, CheckCircle } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

export default function ParentLessonsScreen() {
  const { t, i18n } = useTranslation();
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
  const [contentLanguage, setContentLanguage] = useState(() => (i18n?.language || "en").split("-")[0]);
  const [loading, setLoading] = useState(true);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  const fetchLibrary = async (langOverride?: string) => {
    try {
      setLoading(true);
      const targetLang = langOverride || contentLanguage;
      const res = await apiFetch('/api/parent/learning-library', {
        headers: { "accept-language": targetLang }
      });
      const data = await res.json();
      if (data.success) {
        setAllTopics(data.data.topics);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard topics", e);
    } finally {
      setTimeout(() => setLoading(false), 350);
    }
  };

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
    const fetchControls = async () => {
      try {
        const res = await apiFetch('/api/parent/controls');
        const json = await res.json();
        if (json.success && json.data?.parentControls?.contentLanguage) {
          const storedLang = json.data.parentControls.contentLanguage;
          setContentLanguage(storedLang);
          fetchLibrary(storedLang);
        } else {
          fetchLibrary();
        }
      } catch (e) {
        fetchLibrary();
      }
    };
    fetchUser();
    fetchControls();

    const handleUserDataUpdate = () => {
      fetchUser();
      fetchLibrary();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
  }, []);

  const handleLanguageChange = async (newLang: string) => {
    setContentLanguage(newLang);
    setLangDropdownOpen(false);
    try {
      await apiFetch('/api/parent/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentLanguage: newLang })
      });
    } catch (e) {}
    fetchLibrary(newLang);
  };

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
      <header className="bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] w-full top-0 z-50 flex justify-between items-center px-6 py-3.5 sticky gap-4 shadow-[0_12px_40px_rgba(20,23,121,0.14)]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-[rgba(20,23,121,0.05)] rounded-full transition-colors flex-shrink-0">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <div className="w-9 h-9 rounded-full border-2 border-[#2d328f] overflow-hidden bg-white flex-shrink-0">
            <img
              alt="Parent Avatar"
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg font-bold text-[#141779] truncate">{t("lessons") || "Daily Parenting Lessons"}</h1>
        </div>

        {/* Dedicated Lesson Language Selector */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#141779]/20 text-[#141779] font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Globe size={14} className="text-[#006a62]" />
            <span>{contentLanguage === "hi" ? "हिन्दी" : contentLanguage === "gu" ? "ગુજરાતી" : "English"}</span>
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
                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${contentLanguage === lang.code ? 'bg-[#141779] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Growth Tracker */}
        <section className="px-6 pt-6 pb-4">
          <div className="glass-card rounded-2xl p-5 glow-teal">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-bold text-[#006a62] uppercase tracking-wider">
                  {contentLanguage === "hi" ? "विकास की स्थिति" : contentLanguage === "gu" ? "વિકાસ સ્થિતિ" : "Growth Status"}
                </p>
                <h2 className="text-2xl font-bold text-[#141779]">
                  {contentLanguage === "hi" ? `स्तर ${level} अभिभावक` : contentLanguage === "gu" ? `સ્તર ${level} વાલી` : `Level ${level} Parent`}
                </h2>
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
                      background: "linear-gradient(to right, #141779, #2d328f)"
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </section>

        {/* Categories Chips */}
        <section className="py-4">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-6">
            {[
              { id: "For You", label: contentLanguage === "hi" ? "आपके लिए" : contentLanguage === "gu" ? "તમારા માટે" : "For You" },
              { id: "Completed", label: contentLanguage === "hi" ? "पूर्ण पाठ" : contentLanguage === "gu" ? "પૂર્ણ થયેલા પાઠ" : "Completed" },
              { id: "Communication", label: contentLanguage === "hi" ? "संचार एवं बातचीत" : contentLanguage === "gu" ? "સંચાર અને વાતચીત" : "Communication" },
              { id: "Anger Management", label: contentLanguage === "hi" ? "क्रोध नियंत्रण" : contentLanguage === "gu" ? "ક્રોધ નિયંત્રણ" : "Anger Management" },
              { id: "Child Psychology", label: contentLanguage === "hi" ? "बाल मनोविज्ञान" : contentLanguage === "gu" ? "બાળ મનોવિજ્ઞાન" : "Child Psychology" },
              { id: "Emotional Intelligence", label: contentLanguage === "hi" ? "भावनात्मक बुद्धिमत्ता" : contentLanguage === "gu" ? "ભાવનાત્મક બુદ્ધિમત્તા" : "Emotional Intelligence" },
              { id: "Focus", label: contentLanguage === "hi" ? "एकाग्रता एवं ध्यान" : contentLanguage === "gu" ? "એકાગ્રતા અને ધ્યાન" : "Focus" },
              { id: "Study Habits", label: contentLanguage === "hi" ? "अध्ययन की आदतें" : contentLanguage === "gu" ? "અભ્યાસની ટેવો" : "Study Habits" },
              { id: "Confidence Building", label: contentLanguage === "hi" ? "आत्मविश्वास निर्माण" : contentLanguage === "gu" ? "આત્મવિશ્વાસ નિર્માણ" : "Confidence Building" },
              { id: "Digital Parenting", label: contentLanguage === "hi" ? "डिजिटल पैरेंटिंग" : contentLanguage === "gu" ? "ડિજિટલ પેરિન્ટિંગ" : "Digital Parenting" },
              { id: "Family Growth", label: contentLanguage === "hi" ? "पारिवारिक विकास" : contentLanguage === "gu" ? "પારિવારિક વિકાસ" : "Family Growth" },
              { id: "Advanced Parenting", label: contentLanguage === "hi" ? "उन्नत पैरेंटिंग" : contentLanguage === "gu" ? "ઉન્નત પેરિન્ટિંગ" : "Advanced Parenting" }
            ].map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-all ${activeFilter === filter.id ? 'bg-[#141779] text-white' : 'bg-[#e6e8ea] text-[#464652] hover:bg-[#e0e3e5]'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* First Row: Recommended */}
        <section className="mt-4">
          <div className="px-6 flex justify-between items-center mb-4 gap-2">
            <h3 className="text-[20px] font-bold text-[#191c1e] leading-normal flex-1 min-w-0 py-1">
              {activeFilter === "Completed" 
                ? (contentLanguage === "hi" ? "पूर्ण किए गए पाठ" : contentLanguage === "gu" ? "પૂર્ણ થયેલા પાઠ" : "Completed Lessons") 
                : (contentLanguage === "hi" ? "आपके लिए अनुशंसित" : contentLanguage === "gu" ? "તમારા માટે ભલામણ કરેલ" : "Recommended for You")}
            </h3>
            <button onClick={() => navigate('/parent/learning-library')} className="text-[#006a62] font-bold text-sm hover:underline">
              {contentLanguage === "hi" ? "सभी देखें" : contentLanguage === "gu" ? "બધું જુઓ" : "See All"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 pb-4">
            {(() => {
              if (loading) {
                return Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="w-full h-full flex flex-col rounded-2xl overflow-hidden glass-card border border-white/40 shadow-xs">
                    <div className="relative h-28 md:h-36 animate-skeleton"></div>
                    <div className="p-3 bg-white/60 backdrop-blur-md flex-1 space-y-2">
                      <div className="h-2.5 w-16 animate-skeleton rounded"></div>
                      <div className="h-4 w-3/4 animate-skeleton rounded"></div>
                    </div>
                  </div>
                ));
              }

              const filtered = allTopics.filter(t => {
                if (activeFilter === "Completed") {
                  return t.status === "completed";
                }
                // Exclude completed lessons from main page / "For You" / Category tabs
                if (t.status === "completed") {
                  return false;
                }
                const matchesCategory = activeFilter === "For You" ||
                  t.category === activeFilter ||
                  t.originalCategory === activeFilter;
                return matchesCategory;
              });

              if (filtered.length === 0) {
                return (
                  <div className="col-span-2 w-full py-12 px-6 text-center flex flex-col items-center justify-center bg-white/50 border border-slate-200/50 rounded-3xl shadow-xs backdrop-blur-xs">
                    <BookOpen size={48} className="text-[#141779]/30 mb-4 animate-pulse" />
                    <p className="text-base font-bold text-[#141779]">
                      {activeFilter === "Completed" ? (
                        contentLanguage === "hi" 
                          ? "कोई पूर्ण पाठ नहीं" 
                          : contentLanguage === "gu" 
                          ? "કોઈ પૂર્ણ થયેલ પાઠ નથી" 
                          : "No Completed Lessons Yet"
                      ) : (
                        contentLanguage === "hi" 
                          ? "सभी पाठ पूर्ण हो चुके हैं!" 
                          : contentLanguage === "gu" 
                          ? "બધા પાઠ પૂર્ણ થયા!" 
                          : "All Lessons Completed!"
                      )}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 mt-2 max-w-[280px] leading-relaxed">
                      {activeFilter === "Completed" ? (
                        contentLanguage === "hi"
                          ? "आपने अभी तक कोई पाठ पूरा नहीं किया है। सीखना शुरू करने के लिए 'आपके लिए' पर जाएं!"
                          : contentLanguage === "gu"
                          ? "તમે હજુ સુધી કોઈ પાઠ પૂર્ણ કર્યો નથી. શીખવાનું શરૂ કરવા માટે 'તમારા માટે' પર જાઓ!"
                          : "You haven't completed any lessons yet. Start learning from the 'For You' tab to see them here!"
                      ) : (
                        contentLanguage === "hi"
                          ? "आपने इस अनुभाग के सभी पाठ पूर्ण कर लिए हैं। अपने पूर्ण पाठों की समीक्षा करने के लिए 'पूर्ण पाठ' टैब पर जाएं!"
                          : contentLanguage === "gu"
                          ? "તમે આ વિભાગના બધા પાઠ પૂર્ણ કર્યા છે. તમારા પૂર્ણ થયેલા પાઠની સમીક્ષા કરવા માટે 'પૂર્ણ થયેલા પાઠ' ટેબ પર જાઓ!"
                          : "You have completed all lessons in this section. Visit the 'Completed' tab to re-read them anytime!"
                      )}
                    </p>
                    {activeFilter === "Completed" && (
                      <button 
                        onClick={() => setActiveFilter("For You")}
                        className="mt-5 px-5 py-2.5 bg-[#141779] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#30007f] active:scale-95 transition-all"
                      >
                        {contentLanguage === "hi" ? "पाठ ब्राउज़ करें" : contentLanguage === "gu" ? "પાઠ બ્રાઉઝ કરો" : "Browse Lessons"}
                      </button>
                    )}
                  </div>
                );
              }

              return filtered.map((topic, index) => {
                const isCompleted = topic.status === "completed";
                const isLocked = topic.status === "locked";
                return (
                  <div
                    key={topic.topicId}
                    onClick={() => !isLocked && navigate(`/parent/lessons/player?id=${topic.topicId}`)}
                    className={`w-full h-full flex flex-col rounded-2xl overflow-hidden glass-card group transition-all ${isLocked ? 'opacity-70 grayscale' : 'cursor-pointer hover:shadow-xl active:scale-[0.98]'}`}
                  >
                    <div className="relative h-28 md:h-36 overflow-hidden bg-gray-200">
                      <img
                        alt={topic.title}
                        src={topic.imageUrl}
                        className={`w-full h-full object-cover ${!isLocked ? 'group-hover:scale-110' : ''} transition-transform duration-700`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {isCompleted ? (
                        <div className="absolute top-2 left-2 bg-[#006a62]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border border-white/20 flex items-center gap-1">
                          <CheckCircle size={10} className="text-[#57fae9]" />
                          <span>+{topic.xp || 30} XP ({contentLanguage === "hi" ? "पूर्ण" : contentLanguage === "gu" ? "પૂર્ણ" : "Completed"})</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-[#141779] text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border border-white/20">+{topic.xp || 30} XP</div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px]">{topic.duration || 3} min</div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!isLocked && <PlayCircle size={48} className="text-white drop-shadow-lg" />}
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                          <Lock size={32} className="text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white/50 backdrop-blur-md flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#006a62] text-[9px] font-bold uppercase tracking-widest">{topic.category}</span>
                        </div>
                        <h4 className="text-[14px] font-bold text-[#141779] leading-[1.6] pt-2 pb-1">{topic.title}</h4>
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
