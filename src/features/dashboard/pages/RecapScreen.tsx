import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function RecapScreen() {
  const navigate = useNavigate();
  const [wrongs, setWrongs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/practice/recap");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setWrongs(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch recap questions", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans">
      {/* Top Bar */}
      <header className="flex items-center px-5 py-4 bg-[#f4efff] sticky top-0 z-40 shadow-sm">
        <button onClick={() => navigate(-1)} className="pr-4 hover:opacity-80 transition-opacity">
          <ArrowLeft size={28} color="#141779" strokeWidth={2.5} />
        </button>
        <h1 className="text-[22px] font-extrabold text-[#191c1e]">Needs Recap</h1>
      </header>

      <main className="p-5">
        {wrongs.length === 0 ? (
          <p className="text-center mt-10 text-[#191c1e] text-lg font-bold">
            You're all caught up! No wrong answers to recap! 🌟
          </p>
        ) : (
          <div>
            <p className="text-base text-[#191c1e] font-medium mb-5">
              Here are the {wrongs.length} questions you recently answered incorrectly. Review them below!
            </p>
            {wrongs.map((wrong: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-[rgba(211,202,188,0.15)]">
                <h3 className="text-lg font-extrabold text-[#191c1e] mb-4">
                  {wrong.questionText || "Question Text"}
                </h3>
                
                <div className="bg-[#ffdad6] p-3 rounded-lg mb-2">
                  <span className="text-[15px] font-bold text-[#93000a]">
                    Your Answer: {wrong.userAnswer || "Unknown"}
                  </span>
                </div>

                <div className="bg-[#d0f0ed] p-3 rounded-lg">
                  <span className="text-[15px] font-bold text-[#003733]">
                     Correct Answer: {wrong.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
