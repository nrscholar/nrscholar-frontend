import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  X, CheckCircle, Check, Star, Clock, BrainCircuit, MessageSquare, CheckSquare, 
  Heart, Eye, Award, Smartphone, ShieldCheck, Flame, BookOpen, Sparkles, 
  Ear, VolumeX, Lightbulb, Target, Zap, Shield, Trophy, MonitorOff, Languages, ChevronDown
} from "lucide-react";

const LessonIcons: Record<string, any> = {
  Star, Clock, BrainCircuit, MessageSquare, CheckSquare, 
  Heart, Eye, Award, Smartphone, ShieldCheck, Flame, BookOpen, Sparkles, 
  Ear, VolumeX, Lightbulb, Target, Zap, Shield, Trophy, X, CheckCircle, Check, MonitorOff
};
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import { getLocalizedCTA } from "../data/parentLessonTranslations";

export default function ParentLessonPlayerScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get('id') || 'focus';

  // Scoped content language management
  const [scopedLang, setScopedLang] = useState<string>(() => {
    return searchParams.get('lang') || localStorage.getItem("parent_lessons_content_lang") || "en";
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const [completing, setCompleting] = useState(false);

  const transitioningRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for language changes from other views (e.g. ParentLessonsScreen or ParentLearningLibraryScreen)
  useEffect(() => {
    const handleLangSync = (e: any) => {
      if (e.detail?.lang && e.detail.lang !== scopedLang) {
        setScopedLang(e.detail.lang);
      }
    };
    window.addEventListener("parentLessonsLanguageChanged", handleLangSync);
    return () => window.removeEventListener("parentLessonsLanguageChanged", handleLangSync);
  }, [scopedLang]);

  // Robust content language resolver
  const resolveLocalized = (val: any, lang: string): any => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      return val.map(item => resolveLocalized(item, lang));
    }
    if (typeof val === "object") {
      if (val[lang] !== undefined) return resolveLocalized(val[lang], lang);
      if (val["en"] !== undefined) return resolveLocalized(val["en"], lang);
      if (val["hi"] !== undefined) return resolveLocalized(val["hi"], lang);
      if (val["gu"] !== undefined) return resolveLocalized(val["gu"], lang);
      for (const k of Object.keys(val)) {
        if (typeof val[k] === "string" || Array.isArray(val[k])) {
          return resolveLocalized(val[k], lang);
        }
      }
    }
    return String(val);
  };

  const fetchLesson = async (langOverride?: string) => {
    try {
      setLoading(true);
      const targetLang = langOverride || scopedLang;
      const res = await apiFetch(`/api/parent/learning-library/${lessonId}?lang=${encodeURIComponent(targetLang)}`, {
        headers: { "Accept-Language": targetLang }
      });
      const data = await res.json();
      if (data.success && data.data?.topic) {
        setLessonData(data.data.topic);
      }
    } catch (e) {
      console.error("Failed to fetch lesson", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId, scopedLang]);

  const handleLanguageChange = (newLang: string) => {
    setScopedLang(newLang);
    setLangDropdownOpen(false);

    try {
      localStorage.setItem("parent_lessons_content_lang", newLang);
    } catch (e) {}

    // Update query params cleanly
    setSearchParams({ id: lessonId, lang: newLang }, { replace: true });

    // Broadcast for sync across Parent Lessons & See All screens
    window.dispatchEvent(new CustomEvent("parentLessonsLanguageChanged", { detail: { lang: newLang } }));

    // Fetch fresh lesson in newly selected language
    fetchLesson(newLang);

    // Sync parent controls in background (non-blocking)
    try {
      apiFetch('/api/parent/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentLanguage: newLang })
      }).catch(() => {});
    } catch (e) {}
  };

  const slides = lessonData?.slides || [];
  const totalSteps = slides.length > 0 ? slides.length : 1;
  const progress = (currentStep / (totalSteps - 1 || 1)) * 100;

  const nextStep = () => {
    if (transitioningRef.current) return;
    if (currentStep < totalSteps - 1) {
      transitioningRef.current = true;
      setAnimateIn(false);
      setTimeout(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          return next < totalSteps ? next : prev;
        });
        setSelectedOption(null);
        setShowFeedback(false);
        setAnimateIn(true);
        transitioningRef.current = false;
      }, 300);
    } else {
      handleCompleteLesson();
    }
  };

  const handleCompleteLesson = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      // Invalidate session cache immediately
      sessionStorage.removeItem("parent_learning_library_cache");
      sessionStorage.removeItem("parent_roadmap_cache");
      const res = await apiFetch('/api/parent/learning-library/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topicId: lessonId,
          acceptMission: missionAccepted
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.user) {
          localStorage.setItem("userData", JSON.stringify(json.data.user));
        }
      }
      window.dispatchEvent(new Event("userDataUpdated"));
    } catch (e) {
      console.error(e);
      window.dispatchEvent(new Event("userDataUpdated"));
    }
    navigate(-1);
  };

  const handleOptionSelect = (option: string, isCorrect: boolean) => {
    if (showFeedback) return;
    setSelectedOption(option);
    if (isCorrect) {
      setShowFeedback(true);
    } else {
      setTimeout(() => setSelectedOption(null), 1000);
    }
  };

  const IllustrationBlock = ({ children, bg, text }: { children: React.ReactNode, bg?: string, text?: string }) => (
    <div className={`w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ${bg || 'bg-gray-100'} ${text || 'text-gray-800'} relative`}>
      <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md"></div>
      <div className="relative z-10 scale-125">{children}</div>
    </div>
  );

  const renderSlide = (slide: any) => {
    const IconComponent = slide.icon ? (LessonIcons[slide.icon] || Sparkles) : null;

    if (slide.type === 'metadata_intro') {
      const categoryText = resolveLocalized(slide.category, scopedLang);
      const titleText = resolveLocalized(slide.title, scopedLang);

      return (
        <div className="text-center h-full flex flex-col justify-center items-center">
          {slide.imageUrl && (
            <img src={slide.imageUrl} alt={titleText} className="w-full h-56 object-cover rounded-3xl shadow-md mb-8" />
          )}
          <h4 className="text-[#006a62] font-bold tracking-widest uppercase mb-3 text-sm">{categoryText}</h4>
          <h2 className="text-3xl font-bold text-[#141779] mb-4">{titleText}</h2>
          <div className="flex items-center justify-center gap-6 text-[#767683] font-medium mt-4">
            {slide.xp && <span className="flex items-center gap-1"><Star size={18} className="text-[#ffb300]" /> {slide.xp} XP</span>}
            {slide.duration && (
              <span className="flex items-center gap-1">
                <Clock size={18} /> {slide.duration} {scopedLang === 'gu' ? 'મિનિટ' : scopedLang === 'hi' ? 'मिनट' : 'min'}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (slide.type === 'info') {
      const titleText = resolveLocalized(slide.title, scopedLang);

      return (
        <div className="text-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          {titleText && <h2 className={`text-2xl font-bold mb-6 ${slide.themeText || 'text-[#141779]'}`}>{titleText}</h2>}
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed text-left max-w-md mx-auto">
            {slide.content?.map((block: any, idx: number) => {
              const val = resolveLocalized(block.value, scopedLang);

              if (block.type === 'text') return <p key={idx}>{val}</p>;
              if (block.type === 'bold') return <p key={idx} className="font-bold text-[#191c1e]">{val}</p>;
              if (block.type === 'heading') return <p key={idx} className={`font-bold text-xl py-4 ${slide.themeText || 'text-[#141779]'}`}>{val}</p>;
              if (block.type === 'subtitle') return <p key={idx} className="mt-8 mb-2 text-sm text-[#767683] uppercase tracking-widest font-bold">{val}</p>;
              if (block.type === 'quotes_list') {
                const quotes = Array.isArray(val) ? val : [val];
                return (
                  <div key={idx} className={`bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm space-y-2 font-semibold italic ${slide.themeText || 'text-[#141779]'}`}>
                    {quotes.map((q: any, i: number) => <p key={i}>{resolveLocalized(q, scopedLang)}</p>)}
                  </div>
                );
              }
              if (block.type === 'tags_grid') {
                const tags = Array.isArray(val) ? val : [val];
                return (
                  <div key={idx} className={`bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm text-sm font-semibold grid grid-cols-2 gap-2 ${slide.themeText || 'text-[#006a62]'}`}>
                    {tags.map((t: any, i: number) => <span key={i} className="bg-[#f2f4f6] py-2 rounded-lg text-center">{resolveLocalized(t, scopedLang)}</span>)}
                  </div>
                );
              }
              if (block.type === 'highlight_box') return (
                <div key={idx} className={`bg-opacity-10 p-5 rounded-2xl border font-bold ${slide.themeBg?.replace('/10', '/20')} ${slide.themeText || 'text-[#141779]'}`}>
                  {val}
                </div>
              );
              if (block.type === 'quote_box') return (
                <div key={idx} className={`bg-[#f2f4f6] p-6 rounded-2xl border-l-4 font-bold text-xl italic ${slide.themeText || 'text-[#30007f]'}`} style={{ borderColor: 'currentColor' }}>
                  {val}
                </div>
              );
              return null;
            })}
          </div>
        </div>
      );
    }

    if (slide.type === 'quiz') {
      const titleText = resolveLocalized(slide.title, scopedLang);
      const feedbackTitle = resolveLocalized(slide.feedback?.title, scopedLang) || (scopedLang === 'gu' ? 'સાચો જવાબ!' : scopedLang === 'hi' ? 'सही जवाब!' : t("correct", "Correct!"));
      const feedbackSubtitle = resolveLocalized(slide.feedback?.subtitle, scopedLang);
      const feedbackText = resolveLocalized(slide.feedback?.text, scopedLang);

      return (
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-[#141779] mb-8 text-center">{titleText}</h2>
          <div className="space-y-4 mb-8">
            {slide.options?.map((opt: any) => {
              const optLabel = resolveLocalized(opt.label, scopedLang);
              const optText = resolveLocalized(opt.text, scopedLang);

              return (
                <button 
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id, opt.isCorrect)} 
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedOption === opt.id && !opt.isCorrect ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]' : 
                    (selectedOption === opt.id || (showFeedback && opt.isCorrect)) ? 'border-[#006a62] bg-[#57fae9]/20 text-[#006a62]' : 
                    'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30 cursor-pointer'
                  }`}
                >
                  {optLabel && <span className="font-bold block mb-1">{optLabel}</span>}
                  <span className="text-lg block break-words w-full">{optText}</span>
                </button>
              );
            })}
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${showFeedback ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#006a62] text-white p-5 rounded-2xl shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#57fae9]">
                <CheckCircle size={24} fill="currentColor" className="text-white" />
                <h3 className="font-bold text-xl">{feedbackTitle}</h3>
              </div>
              {feedbackSubtitle && <p className="text-white/90 font-medium">{feedbackSubtitle}</p>}
              {feedbackText && <p className="font-bold">{feedbackText}</p>}
            </div>
          </div>
        </div>
      );
    }

    if (slide.type === 'action_list') {
      const titleText = resolveLocalized(slide.title, scopedLang);
      const items = Array.isArray(slide.items) ? slide.items : [];

      return (
        <div className="text-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          <h2 className={`text-2xl font-bold mb-6 ${slide.themeText || 'text-[#006a62]'}`}>{titleText}</h2>
          <div className="space-y-3 mb-8 max-w-md mx-auto text-left">
            {items.map((item: any, idx: number) => {
              const itemText = resolveLocalized(item, scopedLang);
              return (
                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${slide.themeBg || 'bg-[#006a62]/10'} ${slide.themeText || 'text-[#006a62]'}`}>
                    <Check size={16} />
                  </div>
                  <span className="font-bold text-lg text-[#191c1e]">{itemText}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (slide.type === 'mission') {
      const titleText = resolveLocalized(slide.title, scopedLang);
      const missionText = resolveLocalized(slide.missionText, scopedLang);
      const rawBtnText = resolveLocalized(slide.buttonText, scopedLang);
      const buttonLabel = missionAccepted 
        ? getLocalizedCTA("mission_accepted", scopedLang)
        : (rawBtnText || getLocalizedCTA("accept_mission", scopedLang));

      return (
        <div className="text-center h-full flex flex-col justify-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          <h2 className={`text-3xl font-bold mb-4 ${slide.themeText || 'text-[#141779]'}`}>{titleText}</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c5d4]/40 max-w-md mx-auto mb-8">
            <p className="text-xl font-medium text-[#464652] leading-relaxed">
              {missionText}
            </p>
          </div>
          <button 
            onClick={() => setMissionAccepted(!missionAccepted)}
            className={`mx-auto flex items-center gap-3 px-6 py-4 rounded-full border-2 transition-all cursor-pointer ${missionAccepted ? `border-[#006a62] bg-[#57fae9]/20 text-[#006a62]` : 'border-[#c7c5d4] text-[#767683] hover:bg-gray-50'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${missionAccepted ? 'border-[#006a62] bg-[#006a62] text-white' : 'border-[#c7c5d4]'}`}>
              {missionAccepted && <Check size={14} strokeWidth={3} />}
            </div>
            <span className="font-bold text-lg">{buttonLabel}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="text-center">
        {IconComponent && (
          <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
            <IconComponent size={48} />
          </IllustrationBlock>
        )}
        <h2 className={`text-2xl font-bold mb-6 ${slide.themeText || 'text-[#141779]'}`}>
          {resolveLocalized(slide.title, scopedLang) || resolveLocalized(lessonData?.title, scopedLang) || (scopedLang === 'gu' ? 'પાઠ વિગતો' : scopedLang === 'hi' ? 'पाठ विवरण' : t("lesson_details", "Lesson Details"))}
        </h2>
        {slide.text && <p className="text-lg text-[#464652] leading-relaxed max-w-md mx-auto mb-4">{resolveLocalized(slide.text, scopedLang)}</p>}
        {slide.description && <p className="text-lg text-[#464652] leading-relaxed max-w-md mx-auto mb-4">{resolveLocalized(slide.description, scopedLang)}</p>}
        {Array.isArray(slide.content) && (
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed text-left max-w-md mx-auto">
            {slide.content.map((block: any, idx: number) => (
              <p key={idx}>{typeof block === 'string' ? resolveLocalized(block, scopedLang) : resolveLocalized(block.value || block, scopedLang)}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col">
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex items-center justify-between px-3 sm:px-6 h-16 w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
          aria-label={scopedLang === 'gu' ? 'પાછા જાઓ' : scopedLang === 'hi' ? 'वापस जाएं' : 'Close'}
        >
          <X size={19} />
        </button>

        <div className="flex-1 mx-3 sm:mx-4 flex flex-col justify-center">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-[#767683] mb-1 px-0.5">
            <span>
              {scopedLang === 'gu' ? `પગલું ${currentStep + 1} / ${totalSteps}` : scopedLang === 'hi' ? `चरण ${currentStep + 1} / ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#141779] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Localized Language Selector */}
        <div className="relative shrink-0" ref={langDropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 text-[#141779] font-bold text-xs cursor-pointer transition-all active:scale-95"
            aria-label="Change lesson language"
          >
            <Languages size={15} />
            <span className="uppercase">{scopedLang === 'gu' ? 'ગુ' : scopedLang === 'hi' ? 'हि' : 'EN'}</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${scopedLang === lang.code ? 'bg-[#141779] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 pb-32 flex flex-col justify-center relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 w-full max-w-md mx-auto">
            <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-3xl"></div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-full space-y-4">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded mx-auto"></div>
              <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded mx-auto"></div>
            </div>
          </div>
        ) : !slides.length ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <IllustrationBlock bg="bg-gray-200" text="text-gray-500">
              <MonitorOff size={48} />
            </IllustrationBlock>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {scopedLang === 'gu' ? 'સામગ્રી ટૂંક સમયમાં આવી રહી છે' : scopedLang === 'hi' ? 'सामग्री जल्द ही आ रही है' : t("content_coming_soon", "Content Coming Soon")}
            </h2>
            <p className="text-gray-500 font-medium px-4">
              {scopedLang === 'gu' ? 'અમે તમારા માટે આ પાઠ તૈયાર કરવા માટે સખત મહેનત કરી રહ્યા છીએ. કૃપા કરીને થોડીવાર પછી ફરી તપાસો!' : scopedLang === 'hi' ? 'हम आपके लिए यह पाठ तैयार करने के लिए काम कर रहे हैं। कृपया कुछ समय बाद पुनः प्रयास करें!' : t("preparing_lesson_sub", "We are working hard to prepare this lesson for you. Please check back later!")}
            </p>
          </div>
        ) : (
          <div className={`transition-all duration-300 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {renderSlide(slides[currentStep])}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-5 bg-[rgba(247,249,251,0.95)] backdrop-blur-md border-t border-[#c7c5d4]/30 z-50">
        {!slides.length || loading ? (
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform cursor-pointer"
          >
            {getLocalizedCTA("go_back", scopedLang)}
          </button>
        ) : (
          <>
            {slides[currentStep]?.type === 'quiz' ? (
              <button
                onClick={nextStep}
                disabled={!showFeedback}
                className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${showFeedback ? 'bg-[#006a62] text-white hover:bg-[#00524c] active:scale-95 cursor-pointer' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
              >
                {!showFeedback 
                  ? getLocalizedCTA("select_answer", scopedLang)
                  : (currentStep === totalSteps - 1 
                      ? getLocalizedCTA("finish_lesson", scopedLang)
                      : getLocalizedCTA("continue", scopedLang))}
              </button>
            ) : slides[currentStep]?.type === 'mission' ? (
              <button
                onClick={handleCompleteLesson}
                disabled={!missionAccepted}
                className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${missionAccepted ? 'bg-[#141779] text-white hover:bg-[#0f1159] active:scale-95 cursor-pointer' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
              >
                {getLocalizedCTA("complete_lesson", scopedLang)}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform cursor-pointer"
              >
                {currentStep === totalSteps - 1 
                  ? getLocalizedCTA("finish_lesson", scopedLang) 
                  : (currentStep === 0 
                      ? getLocalizedCTA("continue", scopedLang) 
                      : getLocalizedCTA("next", scopedLang))}
              </button>
            )}
          </>
        )}
      </footer>
    </div>
  );
}
