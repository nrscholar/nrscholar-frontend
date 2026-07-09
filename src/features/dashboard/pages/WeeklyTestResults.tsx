import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, Home, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../api";

const SKILLS = [
  { icon: "➕", label: "Quick Addition", xp: "+15 XP", xpColor: "text-[#30007f]", progress: 0.8, progressColor: "bg-[#30007f]", iconBg: "bg-[#e8ddff]" },
  { icon: "🔢", label: "Number Logic", xp: "+10 XP", xpColor: "text-[#006a62]", progress: 0.45, progressColor: "bg-[#006a62]", iconBg: "bg-[#cce8e4]" },
];

const getScoreMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1) return { title: "Perfect Score! 🏆", sub: "You're an absolute star!" };
  if (pct >= 0.8) return { title: "Great improvement!", sub: "You're becoming a real scholar!" };
  if (pct >= 0.6) return { title: "Good effort! 💪", sub: "Keep practising every day!" };
  return { title: "Nice try! 🌱", sub: "Every attempt makes you stronger!" };
};

const getBuddyMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1) return `"Wow, a perfect 10! You're unstoppable! Let's try an even harder challenge next week!"`;
  if (pct >= 0.8) return `"Whoa! That's ${score} out of ${total}! Your skills are growing like a beanstalk. Ready for more?"`;
  if (pct >= 0.6) return `"You got ${score} right! With a little more practice, you'll be at the top. Keep going!"`;
  return `"You scored ${score} this time. Don't worry — every great scholar starts somewhere. Try again!"`;
};

export default function WeeklyTestResultsScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const score = Number(searchParams.get("score") ?? 8);
  const total = Number(searchParams.get("total") ?? 10);
  const starsEarned = Math.round((score / total) * 50);
  const msg = getScoreMessage(score, total);
  const buddyMsg = getBuddyMessage(score, total);

  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
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

      <main className="px-6 pt-3 flex flex-col items-center overflow-x-hidden">
        {/* Hero Celebration */}
        <div className="flex flex-col items-center w-full relative mb-8">
          {/* Glow Blobs */}
          <div className="absolute -top-10 -right-20 w-64 h-64 rounded-full bg-[#e0e0ff] opacity-30 -z-10" />
          <div className="absolute top-40 -left-20 w-48 h-48 rounded-full bg-[#d0f0ed] opacity-40 -z-10" />

          {/* Star Card */}
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-40 h-40 bg-[#e8ddff] rounded-3xl flex items-center justify-center shadow-[0_16px_30px_rgba(25,28,30,0.07)]"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyUvebv2BdvNRiuk9vxbhiA77xkXBAyqSvwsKAAoxwbT-gqMrPXi73brPL5k6cPw_7mv2oty2chuipoFdgHSiXYFEGNyEu2_NRmQlwi90ury6qcxq9biyOky6-LwYC-9Ma_6TdWG4z6llSm67s3jKHqL7KHjxaOR0T4Euhw7xkCK2vzL2eD5_SjEZFSSY5qhahz7XVATTQXbi3ut_RdWV2PRzXe-c6adNP8eqJ4RiigQYMG0Nn3KV99T0mcERtlbew55Eeu5O-oA"
                alt="Star"
                className="w-[110px] h-[110px] -rotate-3"
              />
            </motion.div>
            <span className="absolute -top-3 -right-3 text-[32px] animate-bounce">✨</span>
            <span className="absolute top-1/2 -left-6 text-[26px] animate-pulse">🎉</span>
          </div>

          <h2 className="text-4xl font-black text-[#141779] tracking-[-0.8px] text-center leading-[44px] mb-1.5">
            {msg.title}
          </h2>
          <p className="text-[17px] font-medium text-[#006a62] text-center mb-7">
            {msg.sub}
          </p>

          {/* Bento Row */}
          <div className="flex gap-3.5 w-full mb-7">
            {/* Score Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center justify-center border-b-4 border-[rgba(211,202,188,0.2)] shadow-[0_12px_24px_rgba(25,28,30,0.05)]">
              <span className="text-[10px] font-bold text-[#64748b] tracking-[1.5px] mb-2">YOUR SCORE</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-[#141779] leading-[72px]">{score}</span>
                <span className="text-2xl font-bold text-[#94a3b8]">/ {total}</span>
              </div>
            </div>

            {/* Stars Card */}
            <div className="flex-1 bg-[#e0e0ff] rounded-2xl p-6 flex flex-col items-center justify-center border-b-4 border-[rgba(20,23,121,0.2)] shadow-[0_12px_24px_rgba(25,28,30,0.05)] -rotate-2">
              <span className="text-[10px] font-bold text-[#0a0c45] tracking-[1.5px] mb-2">STARS EARNED</span>
              <div className="flex items-center gap-2">
                <span className="text-6xl font-black text-[#0a0c45] leading-[72px]">{starsEarned}</span>
                <span className="text-[40px]">⭐</span>
              </div>
            </div>
          </div>

          {/* Buddy Bubble */}
          <div className="w-full bg-[rgba(255,255,255,0.85)] rounded-2xl p-5 border border-[rgba(255,255,255,0.6)] shadow-[0_12px_24px_rgba(25,28,30,0.05)] mb-7 relative">
            <div className="flex gap-3.5 items-start">
              <div className="w-12 h-12 rounded-full bg-[#cce8e4] flex items-center justify-center shrink-0">
                <span className="text-[22px]">🤖</span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[15px] font-bold text-[#191c1e] mb-1">Professor Paws says:</span>
                <p className="text-sm text-[#464652] leading-[22px]">{buddyMsg}</p>
              </div>
            </div>
            <div className="absolute -bottom-2.5 left-9 w-5 h-5 bg-[rgba(255,255,255,0.85)] rotate-45 border-r border-b border-[rgba(255,255,255,0.6)]" />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate("/weekly-test-questions")}
              className="flex-1 bg-[#141779] py-[18px] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_0_#141779] hover:opacity-90 transition-opacity"
            >
              <RotateCcw size={20} color="white" />
              <span className="text-white text-base font-extrabold">Try Again</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-[#006a62] py-[18px] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_0_#006a62] hover:opacity-90 transition-opacity"
            >
              <Home size={20} color="white" />
              <span className="text-white text-base font-extrabold">Go to Home</span>
            </button>
          </div>
        </div>

        {/* Skills Levelled Up */}
        <div className="w-full">
          <h3 className="text-[22px] font-extrabold text-[#191c1e] mb-5">Skills Levelled Up</h3>
          
          <div className="flex flex-col gap-3.5">
            {SKILLS.map((skill, i) => (
              <div key={i} className="bg-white rounded-[18px] p-4.5 flex items-center gap-4 shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${skill.iconBg}`}>
                  <span className="text-[22px]">{skill.icon}</span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-[#191c1e]">{skill.label}</span>
                    <span className={`text-[13px] font-bold ${skill.xpColor}`}>{skill.xp}</span>
                  </div>
                  <div className="h-3 bg-[#f5f5f5] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${skill.progressColor}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
