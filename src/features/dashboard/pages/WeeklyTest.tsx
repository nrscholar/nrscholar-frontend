import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../api";
import { ArrowLeft } from "lucide-react";

export default function WeeklyTestScreen() {
  const navigate = useNavigate();

  const [INFO_CARDS, setInfoCards] = useState([
    { emoji: "⏱️", bg: "#d0f0ed", title: "15 Minutes", sub: "Quick & Fun", offset: false },
    { emoji: "📝", bg: "#e8ddff", title: "10 Questions", sub: "Science & Math", offset: true },
    { emoji: "⭐", bg: "#e0e0ff", title: "50 XP", sub: "Earn Rewards", offset: false },
  ]);
  
  useEffect(() => {
    async function fetchTest() {
      try {
        const res = await apiFetch("/api/practice/weekly-test");
        const json = await res.json();
        if (json.success && json.data?.infoCards) {
          setInfoCards(json.data.infoCards);
        }
      } catch (e) {}
    }
    fetchTest();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans pb-10">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-[22px] font-extrabold text-[#141779]">Weekly Quest</h1>
        </div>
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden bg-[#e0e0ff] hover:opacity-80 transition-opacity">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAKpSAluWywp3vdD2mwMWzOmh1M2-26A0Q1Hd3GWlgSKixYxQz78sPhRMymy2vFlwgX07glcvgPYkGRAhIYNlpdcDEjJBAK5ELpJCuM-8qkswYzIY28VN1yaieXrQ8PtFjqu4nM8EnvsHQorCB8l1TqsH1J4aLniQ5KgYTdJYKkdkXEsRcxSSP2UFgHy2t2BWgmKvOoQqKoXuV_yIRW518Sn1qEO7wKGvfQ5FiWCyRPyOn1qB5mw3E1iS0wPrek4CiBJVwGgxelg"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </header>

      <main className="px-6 pt-2 flex flex-col items-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-10 w-full relative">
          <div className="absolute -top-10 w-[200px] h-[200px] rounded-full bg-[#e0e0ff] opacity-30 z-0" />
          
          <div className="w-[100px] h-[100px] bg-white rounded-[22px] flex items-center justify-center border border-[rgba(211,202,188,0.15)] shadow-[0_20px_30px_rgba(25,28,30,0.06)] -rotate-2 mb-6 relative z-10">
            <span className="text-[52px]">🧪</span>
          </div>

          <h2 className="text-[44px] font-black text-[#141779] tracking-[-1px] text-center leading-[50px] mb-2.5 relative z-10">
            Weekly Test
          </h2>
          <p className="text-[17px] font-medium text-[#464652] text-center leading-[26px] max-w-[280px] relative z-10">
            Show what you've learned this week!
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="flex gap-3 mb-10 w-full">
          {INFO_CARDS.map((card, i) => (
            <div
              key={i}
              className={`flex-1 bg-white rounded-[18px] py-6 px-2 flex flex-col items-center border border-[rgba(211,202,188,0.15)] shadow-[0_10px_20px_rgba(25,28,30,0.05)] ${card.offset ? 'mt-4' : ''}`}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: card.bg }}
              >
                <span className="text-[22px]">{card.emoji}</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#191c1e] text-center mb-1 leading-tight">{card.title}</h3>
              <p className="text-xs font-medium text-[#464652] text-center">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full max-w-[400px] flex flex-col items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/weekly-test-questions")}
            className="w-full bg-[#141779] py-5 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(20,23,121,0.3)] hover:opacity-90 transition-opacity"
          >
            <span className="text-white text-[22px] font-extrabold tracking-[0.2px]">Start Test  ▶</span>
          </button>
          <span className="text-[11px] font-bold text-[#827656] tracking-[2px] uppercase">READY WHEN YOU ARE!</span>
        </div>

        {/* Buddy Quote Card */}
        <div className="w-full max-w-[400px]">
          <div className="bg-[rgba(208,240,237,0.8)] rounded-[18px] p-5 mb-3 relative">
            <p className="text-[15px] font-medium text-[#003733] leading-[22px]">
              "You're going to do great today! Just take your time." 🌟
            </p>
            <div className="absolute -bottom-2.5 right-9 w-5 h-5 bg-[rgba(208,240,237,0.8)] rotate-45" />
          </div>
          <div className="flex justify-end pr-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiR2BgZnP9U1oq6qPpVV5d-S3bN6f7WIWUI8SXKsNlLmtPAgl1G3k508oG90n7IoW7ZyLGz0gKcwmptnTlcO5j3qDspH7m57V92MPAZxJrRbX12Uz2Jtux-vGqQj-APsavBI-NHYm0blBPmnxKk4SIVXQGCgWoiUpUoh2TvCAiAV8924abDM_gN9LAmUeMkYN6TO_H9e299jCpv__KD5iiuokBoj7ylZaa7dLqsBnt76T91tTFDNKo0d0VOP2YzaRgKNbwrauiRQ"
              alt="Buddy Avatar"
              className="w-14 h-14 rounded-full border-[3px] border-white shadow-[0_4px_8px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
