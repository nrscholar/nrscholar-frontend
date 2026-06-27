import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, Swords, Shield, ShieldAlert, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";

export default function ChapterLevelsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chapterId = searchParams.get("chapterId") || "";
  const chapterName = searchParams.get("chapterName") || "Chapter Challenge";

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const pRes = await apiFetch(`/api/practice/chapter-progress`);
        const pJson = await pRes.json();
        if (pJson.success && pJson.data) {
          setProgressData(pJson.data);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const easyCompleted = progressData.some(p => (p.chapterId === `${chapterId}_easy` || p.chapterId === chapterId) && p.completed);
  const mediumCompleted = progressData.some(p => p.chapterId === `${chapterId}_medium` && p.completed);

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24 relative">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#141779]">{chapterName}</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-6 flex-1 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-black text-[#141779] mb-2">Select Your Path</h2>
          <p className="text-[#464652] font-medium">Complete challenges to earn XP and defeat bosses!</p>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Easy Challenge */}
            <div 
                onClick={() => navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(chapterName)}&level=easy`)}
                className="bg-white rounded-[24px] p-5 border-2 border-[#58cc02] shadow-[0_4px_0_#58cc02] cursor-pointer hover:-translate-y-1 hover:shadow-[0_6px_0_#58cc02] active:translate-y-1 active:shadow-none transition-all flex items-center gap-4 relative overflow-hidden"
            >
                <div className="w-16 h-16 bg-[#e5f9d7] rounded-full flex items-center justify-center shrink-0 border-2 border-[#58cc02]">
                    <Shield size={32} color="#58cc02" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-[#58cc02] tracking-widest uppercase mb-1">Beginner</p>
                    <h3 className="text-[20px] font-black text-[#4b4b4b] leading-tight mb-1">Easy Challenge</h3>
                    <p className="text-sm font-bold text-[#afafaf]">6 Questions + 1 Boss</p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#58cc02] opacity-10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            </div>

            {/* Intermediate Challenge */}
            <div 
                onClick={() => easyCompleted && navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(chapterName)}&level=medium`)}
                className={`bg-white rounded-[24px] p-5 border-2 ${easyCompleted ? 'border-[#ff9600] shadow-[0_4px_0_#ff9600] cursor-pointer hover:-translate-y-1 hover:shadow-[0_6px_0_#ff9600] active:translate-y-1 active:shadow-none' : 'border-[#d0d0d0] shadow-[0_4px_0_#d0d0d0] opacity-70 cursor-not-allowed'} transition-all flex items-center gap-4 relative overflow-hidden`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 ${easyCompleted ? 'bg-[#ffeed1] border-[#ff9600]' : 'bg-[#e5e5e5] border-[#afafaf]'}`}>
                    {easyCompleted ? <Swords size={32} color="#ff9600" /> : <Lock size={32} color="#afafaf" />}
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-bold tracking-widest uppercase mb-1 ${easyCompleted ? 'text-[#ff9600]' : 'text-[#afafaf]'}`}>Explorer</p>
                    <h3 className="text-[20px] font-black text-[#4b4b4b] leading-tight mb-1">Intermediate</h3>
                    <p className="text-sm font-bold text-[#afafaf]">6 Questions + 1 Boss</p>
                </div>
                <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 ${easyCompleted ? 'bg-[#ff9600]' : 'bg-[#afafaf]'}`}></div>
            </div>

            {/* Hard Challenge */}
            <div 
                onClick={() => mediumCompleted && navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(chapterName)}&level=hard`)}
                className={`bg-white rounded-[24px] p-5 border-2 ${mediumCompleted ? 'border-[#ba1a1a] shadow-[0_4px_0_#ba1a1a] cursor-pointer hover:-translate-y-1 hover:shadow-[0_6px_0_#ba1a1a] active:translate-y-1 active:shadow-none' : 'border-[#d0d0d0] shadow-[0_4px_0_#d0d0d0] opacity-70 cursor-not-allowed'} transition-all flex items-center gap-4 relative overflow-hidden`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 ${mediumCompleted ? 'bg-[#ffdad6] border-[#ba1a1a]' : 'bg-[#e5e5e5] border-[#afafaf]'}`}>
                    {mediumCompleted ? <ShieldAlert size={32} color="#ba1a1a" /> : <Lock size={32} color="#afafaf" />}
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-bold tracking-widest uppercase mb-1 ${mediumCompleted ? 'text-[#ba1a1a]' : 'text-[#afafaf]'}`}>Master</p>
                    <h3 className="text-[20px] font-black text-[#4b4b4b] leading-tight mb-1">Hard Challenge</h3>
                    <p className="text-sm font-bold text-[#afafaf]">8 Questions + 1 Boss</p>
                </div>
                <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 ${mediumCompleted ? 'bg-[#ba1a1a]' : 'bg-[#afafaf]'}`}></div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
