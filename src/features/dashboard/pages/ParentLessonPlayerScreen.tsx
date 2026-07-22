import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, CheckCircle, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentLessonPlayerScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('id') || 'focus';

  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const [completing, setCompleting] = useState(false);

  const transitioningRef = useRef(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/api/parent/learning-library/${lessonId}`);
        const data = await res.json();
        if (data.success) {
          setLessonData(data.data.topic);
        }
      } catch (e) {
        console.error("Failed to fetch lesson", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

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
    }
  };

  const handleCompleteLesson = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await apiFetch('/api/parent/learning-library/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: lessonId })
      });
    } catch (e) {
      console.error(e);
    }
    navigate('/parent/lessons');
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
    const IconComponent = slide.icon ? (Icons as any)[slide.icon] : null;

    if (slide.type === 'metadata_intro') {
      return (
        <div className="text-center h-full flex flex-col justify-center items-center">
          {slide.imageUrl && (
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-56 object-cover rounded-3xl shadow-md mb-8" />
          )}
          <h4 className="text-[#006a62] font-bold tracking-widest uppercase mb-3 text-sm">{slide.category}</h4>
          <h2 className="text-3xl font-bold text-[#141779] mb-4">{slide.title}</h2>
          <div className="flex items-center justify-center gap-6 text-[#767683] font-medium mt-4">
            {slide.xp && <span className="flex items-center gap-1"><Icons.Star size={18} className="text-[#ffb300]" /> {slide.xp} XP</span>}
            {slide.duration && <span className="flex items-center gap-1"><Icons.Clock size={18} /> {slide.duration} min</span>}
          </div>
        </div>
      );
    }

    if (slide.type === 'info') {
      return (
        <div className="text-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          {slide.title && <h2 className={`text-2xl font-bold mb-6 ${slide.themeText || 'text-[#141779]'}`}>{slide.title}</h2>}
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed text-left max-w-md mx-auto">
            {slide.content?.map((block: any, idx: number) => {
              if (block.type === 'text') return <p key={idx}>{block.value}</p>;
              if (block.type === 'bold') return <p key={idx} className="font-bold text-[#191c1e]">{block.value}</p>;
              if (block.type === 'heading') return <p key={idx} className={`font-bold text-xl py-4 ${slide.themeText || 'text-[#141779]'}`}>{block.value}</p>;
              if (block.type === 'subtitle') return <p key={idx} className="mt-8 mb-2 text-sm text-[#767683] uppercase tracking-widest font-bold">{block.value}</p>;
              if (block.type === 'quotes_list') return (
                <div key={idx} className={`bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm space-y-2 font-semibold italic ${slide.themeText || 'text-[#141779]'}`}>
                  {block.value.map((q: string, i: number) => <p key={i}>{q}</p>)}
                </div>
              );
              if (block.type === 'tags_grid') return (
                <div key={idx} className={`bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm text-sm font-semibold grid grid-cols-2 gap-2 ${slide.themeText || 'text-[#006a62]'}`}>
                  {block.value.map((t: string, i: number) => <span key={i} className="bg-[#f2f4f6] py-2 rounded-lg text-center">{t}</span>)}
                </div>
              );
              if (block.type === 'highlight_box') return (
                <div key={idx} className={`bg-opacity-10 p-5 rounded-2xl border font-bold ${slide.themeBg?.replace('/10', '/20')} ${slide.themeText || 'text-[#141779]'}`}>
                  {block.value}
                </div>
              );
              if (block.type === 'quote_box') return (
                <div key={idx} className={`bg-[#f2f4f6] p-6 rounded-2xl border-l-4 font-bold text-xl italic ${slide.themeText || 'text-[#30007f]'}`} style={{ borderColor: 'currentColor' }}>
                  {block.value}
                </div>
              );
              return null;
            })}
          </div>
        </div>
      );
    }

    if (slide.type === 'quiz') {
      return (
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-[#141779] mb-8 text-center">{slide.title}</h2>
          <div className="space-y-4 mb-8">
            {slide.options?.map((opt: any) => (
              <button 
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id, opt.isCorrect)} 
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  selectedOption === opt.id && !opt.isCorrect ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]' : 
                  (selectedOption === opt.id || (showFeedback && opt.isCorrect)) ? 'border-[#006a62] bg-[#57fae9]/20 text-[#006a62]' : 
                  'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30'
                }`}
              >
                {opt.label && <span className="font-bold block mb-1">{opt.label}</span>}
                <span className="text-lg">{opt.text}</span>
              </button>
            ))}
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${showFeedback ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#006a62] text-white p-5 rounded-2xl shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#57fae9]">
                <CheckCircle size={24} fill="currentColor" className="text-white" />
                <h3 className="font-bold text-xl">{slide.feedback?.title || "Correct!"}</h3>
              </div>
              <p className="text-white/90 font-medium">{slide.feedback?.subtitle}</p>
              <p className="font-bold">{slide.feedback?.text}</p>
            </div>
          </div>
        </div>
      );
    }

    if (slide.type === 'action_list') {
      return (
        <div className="text-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          <h2 className={`text-2xl font-bold mb-6 ${slide.themeText || 'text-[#006a62]'}`}>{slide.title}</h2>
          <div className="space-y-3 mb-8 max-w-md mx-auto text-left">
            {slide.items?.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${slide.themeBg || 'bg-[#006a62]/10'} ${slide.themeText || 'text-[#006a62]'}`}>
                  <Icons.Check size={16} />
                </div>
                <span className="font-bold text-lg text-[#191c1e]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (slide.type === 'mission') {
      return (
        <div className="text-center h-full flex flex-col justify-center">
          {IconComponent && (
            <IllustrationBlock bg={slide.themeBg} text={slide.themeText}>
              <IconComponent size={48} />
            </IllustrationBlock>
          )}
          <h2 className={`text-3xl font-bold mb-4 ${slide.themeText || 'text-[#141779]'}`}>{slide.title}</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c5d4]/40 max-w-md mx-auto mb-8">
            <p className="text-xl font-medium text-[#464652] leading-relaxed">
              {slide.missionText}
            </p>
          </div>
          <button 
            onClick={() => setMissionAccepted(!missionAccepted)}
            className={`mx-auto flex items-center gap-3 px-6 py-4 rounded-full border-2 transition-all ${missionAccepted ? `border-[#006a62] bg-[#57fae9]/20 text-[#006a62]` : 'border-[#c7c5d4] text-[#767683] hover:bg-gray-50'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${missionAccepted ? 'border-[#006a62] bg-[#006a62] text-white' : 'border-[#c7c5d4]'}`}>
              {missionAccepted && <Icons.Check size={14} strokeWidth={3} />}
            </div>
            <span className="font-bold text-lg">{slide.buttonText || "I Accept"}</span>
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between z-50 sticky top-0 bg-[rgba(247,249,251,0.9)] backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[rgba(20,23,121,0.05)] transition-colors">
          <X size={24} className="text-[#141779]" />
        </button>
        <div className="flex-1 mx-4 bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#141779] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
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
              <Icons.MonitorOff size={48} />
            </IllustrationBlock>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Coming Soon</h2>
            <p className="text-gray-500 font-medium px-4">
              We are working hard to prepare this lesson for you. Please check back later!
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
            className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform"
          >
            Go Back
          </button>
        ) : (
          <>
            {slides[currentStep]?.type === 'quiz' ? (
              <button
                onClick={nextStep}
                disabled={!showFeedback}
                className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${showFeedback ? 'bg-[#006a62] text-white hover:bg-[#00524c] active:scale-95' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
              >
                Continue
              </button>
            ) : slides[currentStep]?.type === 'mission' ? (
              <button
                onClick={handleCompleteLesson}
                disabled={!missionAccepted}
                className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${missionAccepted ? 'bg-[#141779] text-white hover:bg-[#0f1159] active:scale-95' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
              >
                Complete Lesson
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform"
              >
                {currentStep === 0 ? "Continue" : "Next"}
              </button>
            )}
          </>
        )}
      </footer>
    </div>
  );
}
