import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../api";
import { ArrowLeft, Bell } from "lucide-react";

export default function WeeklyTestScreen() {
  const navigate = useNavigate();
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [INFO_CARDS, setInfoCards] = useState([
    { emoji: "⏱️", bg: "#d0f0ed", title: "15 Minutes", sub: "Quick & Fun", offset: false },
    { emoji: "📝", bg: "#e8ddff", title: "10 Questions", sub: "Science & Math", offset: true },
    { emoji: "⭐", bg: "#e0e0ff", title: "50 XP", sub: "Earn Rewards", offset: false },
  ]);
  
  useEffect(() => {
    async function fetchTest() {
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
          <button 
            onClick={() => navigate("/profile")} 
            className="w-10 h-10 rounded-full border-2 border-[#e0e0ff] overflow-hidden bg-[#e0e0ff] hover:opacity-80 transition-opacity shrink-0"
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
          <h1 className="text-[22px] font-extrabold text-[#141779] whitespace-nowrap">Weekly Quest</h1>
        </div>

        {/* Right Side: Bell Icon */}
        <button 
          onClick={() => navigate("/notifications")}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative shrink-0"
        >
          <Bell size={18} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
              {unreadCount}
            </span>
          )}
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
