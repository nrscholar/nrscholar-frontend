import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../api";

export default function TextbookChaptersScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectQuery = searchParams.get("subject") || "English";

  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await apiFetch(`/api/textbook/chapters?subject=${encodeURIComponent(subjectQuery)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setChapters(json.data);
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

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <button onClick={() => navigate("/textbook/subjects")} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#141779]">{subjectQuery} Chapters</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-2 flex-1 flex flex-col gap-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-black text-[#141779] mb-2">{subjectQuery}</h2>
          <p className="text-[#464652] font-medium">Read your {subjectQuery} textbook here!</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 ml-2 animate-pulse" />
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-[24px] p-4 border-2 border-gray-100 shadow-sm flex items-center gap-4 animate-pulse">
                    <div className="w-14 h-14 bg-gray-200 rounded-[16px] shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.keys(groupedChapters).map((unit, index) => {
              const color = unitColors[index % unitColors.length];
              return (
                <div key={unit} className="flex flex-col gap-4">
                  <h3 className={`text-lg font-bold ${color.text} uppercase tracking-wide px-2`}>
                    {unit}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {groupedChapters[unit].map((chapter: any) => (
                      <motion.div
                        key={chapter._id}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 2 }}
                        onClick={() => navigate(`/textbook/reader?chapterId=${chapter._id}&title=${encodeURIComponent(chapter.chapterName)}`)}
                        className={`bg-white rounded-[24px] p-4 border-2 ${color.border} shadow-[0_4px_0_var(--tw-shadow-color)] hover:shadow-[0_6px_0_var(--tw-shadow-color)] active:shadow-none transition-all cursor-pointer flex items-center gap-4`}
                        style={{ '--tw-shadow-color': color.border.replace('border-', '') } as React.CSSProperties}
                      >
                        <div className={`w-14 h-14 ${color.bg} rounded-[16px] flex items-center justify-center shrink-0 border-2 ${color.border}`}>
                          <BookOpen size={24} className={color.text} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${color.text} uppercase mb-1`}>
                            Chapter {chapter.chapterNumber}
                          </p>
                          <h4 className="text-[18px] font-black text-[#4b4b4b] leading-tight">
                            {chapter.chapterName}
                          </h4>
                          <p className="text-xs text-[#afafaf] font-bold mt-1">
                            {chapter.pageCount} Pages
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
