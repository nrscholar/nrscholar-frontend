import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Rocket, Sun, Compass, Globe, Moon, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";


const chapterIcons = [Rocket, Sun, Compass, Globe, Moon];

export default function ChaptersScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectName = searchParams.get("subjectName") || "Solar System";

  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Fetch subjects first to get a subjectId
        const subRes = await apiFetch("/api/practice/subjects");
        const subData = await subRes.json();
        let sId = "sub1";
        if (subData.success && subData.data.length > 0) {
          sId = subData.data[0]._id;
        }

        const [chRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/chapters/${sId}`),
          apiFetch(`/api/practice/chapter-progress`)
        ]);
        
        const chData = await chRes.json();
        const pData = await pRes.json();

        if (chData.success) {
          setChapters(chData.data);
        }
        if (pData.success && pData.data) {
          const completedIds = pData.data
            .filter((p: any) => p.completed)
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
  }, []);

  const totalChapters = chapters.length;
  // A chapter is only fully complete if the legacy exact match exists OR the hard level boss is beaten
  const isChapterCompleted = (chapterId: string) => completedChapters.includes(chapterId) || completedChapters.includes(`${chapterId}_hard`);
  const completedChaptersCount = chapters.filter(ch => isChapterCompleted(ch._id)).length;
  const progressPercent = totalChapters > 0 ? (completedChaptersCount / totalChapters) * 100 : 0;
  
  const currentChapterIndex = chapters.findIndex(ch => !isChapterCompleted(ch._id));

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-6 h-16 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-sm">
        <button onClick={() => navigate("/home")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">{subjectName}</h1>
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full border-2 border-white bg-[#2d328f] overflow-hidden hover:opacity-80 transition-opacity">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfj2X6XyApFBA2pBstnJTUCQiXa_6N8Aa5HyJFbmRfUns_QavfAGtkXx8Pf9gAdVWNo3VoZXk0XS5RlpTEZJmYXcySbZBisguP11eKxfswie0FivmvHgHxqpwrdPD_6XhBsZLkcBiKxRDQCmpAU26LfuGIYTvoA2rGBiUGUb2qCMzBmEvvu51A5cZKjZZZOLRCzskphl1WwKDNlmaTHLMDhpMTRg9nS0X6MSpqoK1pDZc_46uN3YyhgErTKiS9ZZf3EcwelgfWVg"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </button>
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
                  <p className="text-sm font-semibold text-[#767683] mb-1">Mission Progress</p>
                  <h2 className="text-2xl font-bold text-[#141779]">{completedChaptersCount}/{totalChapters} Chapters Complete</h2>
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
              {chapters.map((chap, index) => {
                const isCompleted = isChapterCompleted(chap._id);
                const isCurrent = !isCompleted && index === currentChapterIndex;
                const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";
                const IconComponent = chapterIcons[index % chapterIcons.length];

                if (status === "completed") {
                  return (
                    <button key={chap._id} onClick={() => navigate(`/chapter-levels?chapterId=${chap._id}&chapterName=${encodeURIComponent(chap.name)}`)} className="flex items-center gap-4 bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] text-left hover:bg-white transition-colors w-full">
                      <div className="w-12 h-12 rounded-full bg-[rgba(0,106,98,0.1)] border border-[rgba(0,106,98,0.2)] flex items-center justify-center shrink-0">
                        <IconComponent size={24} color="#006a62" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#006a62] tracking-[1px] mb-0.5 uppercase">CHAPTER {index + 1}</p>
                        <h3 className="text-lg font-medium text-[#141779]">{chap.name}</h3>
                      </div>
                      <CheckCircle size={24} color="#006a62" />
                    </button>
                  );
                }

                if (status === "current") {
                  return (
                    <div key={chap._id} onClick={() => navigate(`/chapter-levels?chapterId=${chap._id}&chapterName=${encodeURIComponent(chap.name)}`)} className="relative flex items-center gap-4 bg-[rgba(87,250,233,0.3)] rounded-2xl p-4 border-2 border-[rgba(0,106,98,0.3)] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:opacity-90">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[rgba(0,106,98,0.05)]"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#006a62] flex items-center justify-center shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-10">
                        <IconComponent size={24} color="white" />
                      </div>
                      <div className="flex-1 z-10">
                        <p className="text-xs font-bold text-[#006a62] tracking-[1px] mb-0.5 uppercase">CHAPTER {index + 1}</p>
                        <h3 className="text-lg font-bold text-[#141779]">{chap.name}</h3>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/chapter-levels?chapterId=${chap._id}&chapterName=${encodeURIComponent(chap.name)}`); }} className="bg-[#141779] px-6 py-2 rounded-full z-10 hover:opacity-90 transition-opacity">
                        <span className="text-white text-sm font-semibold">Start</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={chap._id} onClick={() => showToast(`Complete Chapter ${currentChapterIndex + 1} to unlock!`)} className="flex items-center gap-4 bg-[#f2f4f6] opacity-60 rounded-2xl p-4 border border-[rgba(118,118,131,0.1)] cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[rgba(118,118,131,0.1)] flex items-center justify-center shrink-0">
                      <IconComponent size={24} color="#767683" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#767683] tracking-[1px] mb-0.5 uppercase">CHAPTER {index + 1}</p>
                      <h3 className="text-lg font-medium text-[#464652]">{chap.name}</h3>
                    </div>
                    <Lock size={24} color="#767683" />
                  </div>
                );
              })}
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
