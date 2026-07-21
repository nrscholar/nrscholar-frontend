import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Rocket, Sun, Compass, Globe, Moon, CheckCircle, Lock, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";


const chapterIcons = [Rocket, Sun, Compass, Globe, Moon];

export default function ChaptersScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectName = searchParams.get("subjectName") || "Solar System";

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [chapterProgressMap, setChapterProgressMap] = useState<Record<string, any>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            setChildName(u.childName || u.name || "Kid");
            setChildPhoto(u.childPhoto || u.photo || "");
          } catch(e) {}
        }
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          setChildName(meJson.data.user.childName || meJson.data.user.name || "Kid");
          setChildPhoto(meJson.data.user.childPhoto || meJson.data.user.photo || "");
        }
      } catch (e) {}

      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}

      try {
        const [subRes, controlsRes] = await Promise.all([
          apiFetch("/api/practice/subjects"),
          apiFetch("/api/parent/controls")
        ]);
        
        const subData = await subRes.json();
        const controlsData = await controlsRes.json();
        
        let restricted: Record<string, boolean> = {};
        if (controlsData.success && controlsData.data?.parentControls?.restrictedSubjects) {
          restricted = controlsData.data.parentControls.restrictedSubjects;
        }

        if (subData.success && subData.data.length > 0) {
          const allowedSubjects = subData.data.filter((s: any) => !restricted[s.name]);
          
          if (allowedSubjects.length > 0) {
            setSubjects(allowedSubjects);
            const savedSubjectId = sessionStorage.getItem("activeSubjectId");
            const found = allowedSubjects.find((s: any) => s._id === savedSubjectId);
            if (found) {
              setActiveSubject(found);
            } else {
              setActiveSubject(allowedSubjects[0]);
              sessionStorage.setItem("activeSubjectId", allowedSubjects[0]._id);
            }
          } else {
            setSubjects([]);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch subjects");
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!activeSubject) return;
    
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const [chRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/chapters/${activeSubject._id}`),
          apiFetch(`/api/practice/chapter-progress`)
        ]);
        
        const chData = await chRes.json();
        const pData = await pRes.json();

        if (chData.success) {
          setChapters(chData.data);
        } else {
          setChapters([]);
        }
        
        if (pData.success && pData.data) {
          const progMap: Record<string, any> = {};
          pData.data.forEach((p: any) => {
            // handle legacy completed status as chapterCompleted
            if (p.completed && !p.chapterCompleted) p.chapterCompleted = true;
            progMap[p.chapterId] = p;
          });
          setChapterProgressMap(progMap);
          
          const completedIds = pData.data
            .filter((p: any) => p.chapterCompleted || p.completed)
            .map((p: any) => p.chapterId);
          setCompletedChapters(completedIds);
        }
      } catch (e) {
        console.error("Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [activeSubject]);

  const totalChapters = chapters.length;
  // A chapter is only fully complete if the legacy exact match exists OR the hard level boss is beaten
  const isChapterCompleted = (chapterId: string) => completedChapters.includes(chapterId) || completedChapters.includes(`${chapterId}_hard`);
  const completedChaptersCount = chapters.filter(ch => isChapterCompleted(ch._id)).length;
  const progressPercent = totalChapters > 0 ? (completedChaptersCount / totalChapters) * 100 : 0;
  
  const currentChapterIndex = chapters.findIndex(ch => !isChapterCompleted(ch._id));

  const handleToggleChapter = async (chapterId: string, chapterName: string) => {
    const isCompleted = isChapterCompleted(chapterId);
    
    if (isCompleted) {
      if (expandedChapter === chapterId) {
        setExpandedChapter(null);
      } else {
        setExpandedChapter(chapterId);
      }
      return;
    }

    const progress = chapterProgressMap[chapterId] || {};
    
    if (!progress.readingCompleted) {
      navigate(`/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    } else if (!progress.questionsCompleted) {
      navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    } else if (!progress.bossCompleted) {
      navigate(`/boss-battle?worldId=w1&chapterId=${chapterId}&difficulty=easy&returnTo=/practice/journey-map&chapterName=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    }
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10">
      {/* TopAppBar */}
      <header className="flex flex-col bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0">
              <ArrowLeft size={24} color="#141779" />
            </button>
            <button 
              onClick={() => navigate("/profile")} 
              className="w-10 h-10 rounded-full border-2 border-white bg-[#2d328f] overflow-hidden hover:opacity-80 transition-opacity shrink-0"
            >
              {childPhoto ? (
                <img 
                  src={childPhoto} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(childName || "Kid")}&background=random`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
            <h1 className="text-xl font-bold text-[#141779] whitespace-nowrap">Learning Path</h1>
          </div>

          {/* Right Side: Bell Icon */}
          <button 
            onClick={() => navigate("/notifications")}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shrink-0"
          >
            <div className="relative">
              <Bell size={20} className="text-[#141779]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>
        
        {/* Subject Selector Tabs */}
        {subjects.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar px-6 pb-3 gap-3">
            {subjects.map((sub) => {
              const isActive = activeSubject?._id === sub._id;
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubject(sub);
                    sessionStorage.setItem("activeSubjectId", sub._id);
                  }}
                  className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${isActive ? 'bg-[#141779] text-white shadow-md' : 'bg-white text-[#767683] border border-[#e0e3e5] hover:border-[#141779]'}`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="px-6 pt-6 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Progress Summary Card */}
            <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#767683] mb-1">{t('mission_progress')}</p>
                  <h2 className="text-2xl font-bold text-[#141779]">{t('chapters_complete', { completed: completedChaptersCount, total: totalChapters })}</h2>
                </div>
                <div className="relative w-12 h-12 rounded-full border-4 border-[rgba(0,106,98,0.2)] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#006a62]">{Math.round(progressPercent)}%</span>
                  <svg width="48" height="48" viewBox="0 0 48 48" className="absolute -rotate-90 top-[-4px] left-[-4px]">
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke="#006a62"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-full h-2.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#006a62] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Chapter List */}
            <div className="flex flex-col gap-4">
              {chapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-[rgba(255,255,255,0.7)] rounded-2xl p-8 border-[1.5px] border-[rgba(255,255,255,0.8)] text-center mt-4">
                  <Rocket size={40} color="#c7c5d4" className="mb-3" />
                  <p className="text-[#767683] font-medium">{t('new_chapters_launching_soon', { subject: activeSubject?.name })}</p>
                </div>
              ) : (
                chapters.map((chap, index) => {
                  const isCompleted = isChapterCompleted(chap._id);
                  const isCurrent = !isCompleted && index === currentChapterIndex;
                  const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";
                  const IconComponent = chapterIcons[index % chapterIcons.length];
                  
                  const isExpanded = expandedChapter === chap._id;
                  
                  // Question accordion render function for completed chapter
                  const renderQuestions = () => (
                    isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)] w-full text-left">
                        <div className="flex flex-col gap-3">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/chapter-reader?chapterId=${chap._id}&title=${encodeURIComponent(`${index + 1}. ${chap.name}`)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); }} className="bg-white border-2 border-[#141779] text-[#141779] px-4 py-2 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm w-full text-left flex justify-between">
                            <span>Read PDF</span>
                            <span>→</span>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/chapter-questions?chapterId=${chap._id}&chapterName=${encodeURIComponent(`${index + 1}. ${chap.name}`)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); }} className="bg-white border-2 border-[#141779] text-[#141779] px-4 py-2 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm w-full text-left flex justify-between">
                            <span>Practice Questions</span>
                            <span>→</span>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/boss-battle?worldId=w1&chapterId=${chap._id}&difficulty=easy&returnTo=/practice/journey-map&subjectName=${encodeURIComponent(activeSubject?.name || "")}&chapterName=${encodeURIComponent(`${index + 1}. ${chap.name}`)}`); }} className="bg-white border-2 border-[#141779] text-[#141779] px-4 py-2 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm w-full text-left flex justify-between">
                            <span>Boss Round</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )
                  );

                  if (status === "completed") {
                    return (
                      <div key={chap._id} className={`flex flex-col bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] ${isExpanded ? 'shadow-md' : 'hover:bg-white'} transition-all w-full`}>
                        <button onClick={() => handleToggleChapter(chap._id, `${index + 1}. ${chap.name}`)} className="flex items-center gap-4 text-left w-full">
                          <div className="w-12 h-12 rounded-full bg-[rgba(0,106,98,0.1)] border border-[rgba(0,106,98,0.2)] flex items-center justify-center shrink-0">
                            <IconComponent size={24} color="#006a62" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#006a62] tracking-[1px] mb-0.5 uppercase">{t('chapter')} {index + 1}</p>
                            <h3 className="text-lg font-medium text-[#141779]">{chap.name}</h3>
                          </div>
                          <CheckCircle size={24} color="#006a62" />
                        </button>
                        {renderQuestions()}
                      </div>
                    );
                  }

                  if (status === "current") {
                    return (
                      <div key={chap._id} className={`flex flex-col relative bg-[rgba(87,250,233,0.3)] rounded-2xl p-4 border-2 border-[rgba(0,106,98,0.3)] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all ${isExpanded ? 'ring-2 ring-[#006a62]' : 'hover:opacity-95'}`}>
                        {!isExpanded && (
                            <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[rgba(0,106,98,0.05)] pointer-events-none"
                            />
                        )}
                        <div onClick={() => handleToggleChapter(chap._id, `${index + 1}. ${chap.name}`)} className="flex items-center gap-4 cursor-pointer relative z-10 w-full">
                            <div className="w-12 h-12 rounded-full bg-[#006a62] flex items-center justify-center shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                            <IconComponent size={24} color="white" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs font-bold text-[#006a62] tracking-[1px] mb-0.5 uppercase">{t('chapter')} {index + 1}</p>
                            <h3 className="text-lg font-bold text-[#141779]">{chap.name}</h3>
                            </div>
                            {!isExpanded && (
                                <button onClick={(e) => { e.stopPropagation(); handleToggleChapter(chap._id, `${index + 1}. ${chap.name}`); }} className="bg-[#141779] px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                                <span className="text-white text-sm font-semibold">{t('start')}</span>
                                </button>
                            )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={chap._id} className={`flex flex-col bg-[#f2f4f6] opacity-60 rounded-2xl p-4 border border-[rgba(118,118,131,0.1)] transition-all`}>
                      <button onClick={() => { if(!isExpanded) showToast(t('complete_chapter_to_unlock', { chapter: currentChapterIndex + 1 })); }} className="flex items-center gap-4 text-left w-full cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-[rgba(118,118,131,0.1)] flex items-center justify-center shrink-0">
                            <IconComponent size={24} color="#767683" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#767683] tracking-[1px] mb-0.5 uppercase">{t('chapter')} {index + 1}</p>
                            <h3 className="text-lg font-medium text-[#464652]">{chap.name}</h3>
                          </div>
                          <Lock size={24} color="#767683" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#141779] text-white px-6 py-3 rounded-full shadow-lg z-[9999] font-medium text-sm flex items-center gap-2 whitespace-nowrap max-w-[90vw]">
          <Lock size={16} color="white" className="shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
