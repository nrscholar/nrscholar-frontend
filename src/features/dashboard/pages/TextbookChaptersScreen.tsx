import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../api";
import { prefetchPdf } from "../../../utils/pdfCache";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";

export default function TextbookChaptersScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectQuery = searchParams.get("subject") || "English";

  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            setIsSubscribed(Boolean(u.is_subscribed || u.isSubscribed));
          } catch (e) {}
        }
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          setIsSubscribed(Boolean(json.data.user.is_subscribed || json.data.user.isSubscribed));
        }
      } catch (e) {}
    }
    checkSubscription();
  }, []);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await apiFetch(`/api/textbook/chapters?subject=${encodeURIComponent(subjectQuery)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setChapters(json.data);
          // Prefetch first 3 unlocked chapter PDFs in the background
          json.data.slice(0, 3).forEach((ch: any) => {
            if (ch._id) prefetchPdf(ch._id);
          });
        }
      } catch (error) {
        console.error("Error fetching textbook chapters:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, []);

  const groupedChapters = chapters.reduce((acc, chapter) => {
    if (!acc[chapter.unit]) {
      acc[chapter.unit] = [];
    }
    acc[chapter.unit].push(chapter);
    return acc;
  }, {});

  const unitColors = [
    { bg: "bg-[#e5f9d7]", border: "border-[#58cc02]", text: "text-[#58cc02]" },
    { bg: "bg-[#ffeed1]", border: "border-[#ff9600]", text: "text-[#ff9600]" },
    { bg: "bg-[#e1f5fe]", border: "border-[#0288d1]", text: "text-[#0288d1]" },
    { bg: "bg-[#f3e5f5]", border: "border-[#8e24aa]", text: "text-[#8e24aa]" },
    { bg: "bg-[#ffdad6]", border: "border-[#ba1a1a]", text: "text-[#ba1a1a]" },
  ];

  let totalIndexCounter = 0;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] px-6 py-3.5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-xs">
          <ArrowLeft size={22} className="text-[#141779]" />
        </button>
        <h1 className="text-lg font-bold text-[#141779]">{subjectQuery} Chapters</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 pt-6 flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-1">
            Official Textbook Curriculum
          </span>
          <h2 className="text-xl font-black text-[#141779] mb-1">{subjectQuery}</h2>
          <p className="text-xs text-[#464652] font-medium leading-relaxed">Read your official {subjectQuery} textbook chapters and practice!</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded w-1/4 bg-slate-200" />
                  <div className="h-4 rounded w-3/4 bg-slate-300" />
                  <div className="h-3 rounded w-1/5 bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.keys(groupedChapters).map((unit) => {
              return (
                <div key={unit} className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold tracking-widest text-[#006a62] uppercase px-1">
                    {unit}
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    {groupedChapters[unit].map((chapter: any) => {
                      const chIdx = totalIndexCounter++;
                      const isLocked = chIdx >= 1 && !isSubscribed;

                      return (
                        <motion.div
                          key={chapter._id}
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 2 }}
                          onClick={() => {
                            if (isLocked) {
                              setShowSubModal(true);
                            } else {
                              navigate(`/textbook/reader?chapterId=${chapter._id}&title=${encodeURIComponent(chapter.chapterName)}`);
                            }
                          }}
                          className={`bg-white rounded-3xl p-4 border ${isLocked ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80'} shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer flex items-center gap-4`}
                        >
                          <div className={`w-12 h-12 ${isLocked ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-indigo-50 border-indigo-100 text-[#141779]'} rounded-2xl flex items-center justify-center shrink-0 border`}>
                            <BookOpen size={22} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={`text-[10px] font-black ${isLocked ? 'text-amber-800' : 'text-[#006a62]'} uppercase`}>
                                Chapter {chapter.chapterNumber}
                              </p>
                              {isLocked && (
                                <span className="text-[9px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                                  PREMIUM 🔒
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-[#141779] leading-tight truncate">
                              {chapter.chapterName}
                            </h4>
                            <p className="text-xs text-[#767683] font-semibold mt-1">
                              {chapter.pageCount || 12} Pages
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Unified Subscription Lock Modal */}
      <UnifiedConfirmModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onConfirm={() => {
          setShowSubModal(false);
          navigate("/parent/subscription");
        }}
        title="Unlock Full Textbook!"
        message="Chapter 1 is completely free. Accessing Chapter 2 and beyond requires an active StudySaathy Subscription."
        confirmText="Upgrade Subscription →"
        cancelText="Maybe Later"
        variant="warning"
        icon={<Lock size={30} className="text-amber-600" />}
      />
    </div>
  );
}
