import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calculator, Languages, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

export default function TextbookSubjectsScreen() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const [subjRes, controlsRes] = await Promise.all([
          apiFetch("/api/textbook/subjects"),
          apiFetch("/api/parent/controls")
        ]);
        
        const subjJson = await subjRes.json();
        const controlsJson = await controlsRes.json();
        
        let restricted: Record<string, boolean> = {};
        if (controlsJson.success && controlsJson.data?.parentControls?.restrictedSubjects) {
          restricted = controlsJson.data.parentControls.restrictedSubjects;
        }

        if (subjJson.success && subjJson.data) {
          const allowedSubjects = subjJson.data.filter((s: string) => !restricted[s]);
          setSubjects(allowedSubjects);
        }
      } catch (error) {
        console.error("Error fetching textbook subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  // Helper to get nice colors and icons for subjects
  const getSubjectConfig = (subjectName: string) => {
    const s = subjectName.toLowerCase();
    if (s.includes("english")) return { bg: "bg-[#e1f5fe]", border: "border-[#0288d1]", text: "text-[#0288d1]", icon: Languages };
    if (s.includes("math")) return { bg: "bg-[#ffeed1]", border: "border-[#ff9600]", text: "text-[#ff9600]", icon: Calculator };
    if (s.includes("hindi")) return { bg: "bg-[#ffdad6]", border: "border-[#ba1a1a]", text: "text-[#ba1a1a]", icon: Globe };
    // Default fallback
    return { bg: "bg-[#e5f9d7]", border: "border-[#58cc02]", text: "text-[#58cc02]", icon: BookOpen };
  };

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <button onClick={() => navigate("/")} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#141779]">Textbooks</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-2 flex-1 flex flex-col gap-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[#141779] mb-2">Pick a Subject</h2>
          <p className="text-[#464652] font-medium">Which book would you like to read today?</p>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center mt-10 text-[#767683] font-bold">
            No textbooks available yet!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {subjects.map((subject, idx) => {
              const config = getSubjectConfig(subject);
              const Icon = config.icon;
              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  onClick={() => navigate(`/textbook/chapters?subject=${encodeURIComponent(subject)}`)}
                  className={`bg-white rounded-[24px] p-5 border-2 ${config.border} shadow-[0_4px_0_var(--tw-shadow-color)] hover:shadow-[0_6px_0_var(--tw-shadow-color)] active:shadow-none transition-all cursor-pointer flex items-center gap-5`}
                  style={{ '--tw-shadow-color': config.border.replace('border-', '') } as React.CSSProperties}
                >
                  <div className={`w-16 h-16 ${config.bg} rounded-[18px] flex items-center justify-center shrink-0 border-2 ${config.border}`}>
                    <Icon size={32} className={config.text} />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-black text-[#4b4b4b] leading-tight mb-1">
                      {subject}
                    </h3>
                    <p className={`text-sm font-bold ${config.text}`}>
                      Read Chapters ➔
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
