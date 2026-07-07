import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Flame, ShieldCheck, BookOpen, Heart, Brain, CheckCircle, Star, Zap, ArrowLeft } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentDailyTipScreen() {
  const navigate = useNavigate();
  const [childName, setChildName] = useState("Explorer");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    { instead: '"Study now."', try: '"Let\'s study together for 10 minutes."', benefit: "Builds cooperation instead of resistance." },
    { instead: '"You\'re doing it wrong."', try: '"Let\'s look at this part again together."', benefit: "Encourages growth mindset and reduces anxiety." },
    { instead: '"Stop playing games."', try: '"10 more minutes of game, then we read a book!"', benefit: "Provides clear boundaries and transitions." }
  ];
  useEffect(() => {
    // Add particle styles dynamically
    const style = document.createElement('style');
    style.id = "particle-styles";
    style.innerHTML = `
      @keyframes float {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(30px, 40px) scale(1.2); opacity: 0.6; }
      }
      .score-ring {
          background: conic-gradient(from 0deg, #57fae9 0%, #006a62 72%, transparent 72%);
      }
      .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
      }
      .no-scrollbar::-webkit-scrollbar {
          display: none;
      }
      .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById("particle-styles");
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    // Rotate tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setTipIndex(dayOfYear % tips.length);

    async function fetchUser() {
      try {
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          setChildName(json.data.user.childName || "Explorer");
          setLevel(json.data.user.level || 1);
          setStreak(json.data.user.streakDays || 0);
        }
      } catch (e) {}
    }
    fetchUser();
  }, []);

  const tip = tips[tipIndex];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex flex-col min-h-screen w-full relative overflow-hidden font-sans">
      
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[rgba(247,249,251,0.8)] backdrop-blur-lg border-b-[1.5px] border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-[#e0e3e5] rounded-full transition-colors">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-[20px] font-bold text-[#141779] tracking-tight">Cosmic Explorer Parent</h1>
        </div>
        <button onClick={() => navigate('/parent/settings')} className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined text-[#141779] text-2xl">account_circle</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-20 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col items-center justify-start gap-6 relative z-10">
        
        {/* Today's Tip Section */}
        <section className="w-full glass-panel rounded-2xl p-5 flex flex-col gap-4 shadow-md border-[#141779]/10 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-[#006a62]" size={24} fill="currentColor" />
            <h2 className="text-[#191c1e] font-bold text-lg tracking-tight">Today's Parenting Tip</h2>
          </div>
          <div className="bg-[#f2f4f6] rounded-xl p-4 flex flex-col gap-3 border border-[#c7c5d4]/20">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#464652] uppercase tracking-wider">Instead of:</span>
              <p className="text-[#464652] italic text-base">{tip.instead}</p>
            </div>
            <div className="h-[1px] w-full bg-[#c7c5d4]/30"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#006a62] uppercase tracking-wider">Try:</span>
              <p className="text-[#141779] font-semibold text-base">{tip.try}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#006a62]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <p className="text-sm font-medium">{tip.benefit}</p>
          </div>
          <button className="w-full bg-[#141779] text-white py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
            Learn More
          </button>
        </section>

        {/* Family Growth Score Section */}
        <section className="w-full flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background decorative glow */}
            <div className="absolute inset-0 bg-[#57fae9]/20 rounded-full blur-3xl animate-pulse"></div>
            {/* Progress Ring */}
            <div className="w-44 h-44 rounded-full score-ring flex items-center justify-center relative p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-[#006a62] font-bold text-[42px] leading-none">72%</span>
                <span className="text-[#464652] font-bold text-[12px] uppercase tracking-wider mt-1">Growth Score</span>
              </div>
            </div>
            {/* Small orbiting icon */}
            <div className="absolute top-0 right-0 p-2 bg-[#006a62] text-white rounded-full shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            </div>
          </div>
          <p className="mt-4 text-[#191c1e] font-semibold text-center text-base">You're soaring! Family harmony is up <span className="text-[#006a62] font-bold">12%</span> this week.</p>
        </section>

        {/* Combined Journey / Streak Section */}
        <section className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between shadow-sm overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#471ba5]/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center shadow-inner">
              <Flame size={24} />
            </div>
            <div>
              <h3 className="text-[#191c1e] font-bold text-base">{streak} Day Streak</h3>
              <p className="text-[#464652] text-sm">Consistency is Key!</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#141779] relative z-10">
            <span className="text-lg font-bold">P3 + C4</span>
            <Zap size={18} fill="currentColor" />
          </div>
        </section>

        {/* Parent vs Child Split View */}
        <section className="w-full grid grid-cols-2 gap-4">
          {/* Parent Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-md border-[#141779]/10">
            <div className="flex items-center justify-between">
              <span className="text-[#2d328f] font-bold text-xs">PARENT</span>
              <ShieldCheck className="text-[#141779]" size={18} />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#2d328f] overflow-hidden mb-2 border-2 border-white">
                <img 
                  alt="Parent Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxFwA5mghetcyfhwNY6SqcHUH0a0GCzUZGaFte8NvM-rlNJgQKaXzTbMDC1lgvI2Q7N3xxHQLrcd446FzhjYDVIMAK1WyB16VVSu11EvzEG73tXmQOKekdRHk49kKSSaMy2VsIy4AZnhFpgaqWTQKpvXbALSOM15vkRc_xrYswjkwTN2mSaBYv73rMvB9G4GbnkR7CM688GnA8iQC3LMaNo3JaNSuXbfNvdicPYLiju4Km6cWh5PKPmGROZJQhBTKYJphf3LS5IA" 
                />
              </div>
              <h4 className="text-[#191c1e] font-bold text-base leading-tight">Growth Coach</h4>
              <p className="text-[#464652] text-xs mb-2">LVL 12</p>
              <div className="w-full bg-[#eceef0] rounded-full h-2 relative">
                <div className="absolute h-full bg-[#141779] rounded-full" style={{width: '81%'}}></div>
              </div>
              <p className="text-[#464652] text-[10px] mt-1 font-semibold">2450/3000 XP</p>
            </div>
          </div>

          {/* Child Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-md border-[#006a62]/10">
            <div className="flex items-center justify-between">
              <span className="text-[#006a62] font-bold text-xs">CHILD</span>
              <span className="material-symbols-outlined text-[#006a62] text-[18px]">child_care</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#57fae9] overflow-hidden mb-2 border-2 border-white">
                <img 
                  alt="Child Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjEjpfprZ9MbdPrDlEF7R-TEPBCGkbaZn_u3R-LWHh58sy5TZeb2Lz4wuoyeaJ5iQDG4Ul_9xJwulIQgtpy-1qn2cMYy1VgouTmA-byS2DJ2p1RnaOTJBYOgBApXnDiTYFC3OlNomEsmGLJmyhvVe6xNv3OkbANjhEW3M22gK9BB4faHC1a1MVNDgqGOQKDheJGiBmZ8f4EpzMxLXaeD7G98z5IPzSvIeM3Rndd-WOMHUC5YiTwakmONVOMpst58VO7if2QlaRRg" 
                />
              </div>
              <h4 className="text-[#191c1e] font-bold text-base leading-tight">{childName}</h4>
              <p className="text-[#464652] text-xs mb-2">LVL {level}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-[#006a62] text-[14px]">pets</span>
                <span className="text-[10px] font-bold text-[#464652]">Baby Dragon</span>
              </div>
              <div className="flex items-center gap-1 text-[#006a62] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">forest</span>
                <span>Forest Kingdom</span>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="w-full flex flex-col gap-3 pb-8">
          <h2 className="text-[#191c1e] font-bold text-xl tracking-tight">Family Milestones</h2>
          <div className="flex flex-col gap-3">
            {/* Milestone Card 1 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-[#c7c5d4]/30">
              <div className="w-12 h-12 bg-[#471ba5]/20 rounded-full flex items-center justify-center text-[#30007f]">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <h5 className="text-[#191c1e] font-bold text-sm">7 Days Reading Together</h5>
                <p className="text-[#464652] text-xs">Completed Yesterday!</p>
              </div>
              <CheckCircle className="text-[#006a62]" size={24} />
            </div>
            
            {/* Milestone Card 2 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-[#c7c5d4]/30">
              <div className="w-12 h-12 bg-[#57fae9]/20 rounded-full flex items-center justify-center text-[#006a62]">
                <Heart fill="currentColor" size={24} />
              </div>
              <div className="flex-1">
                <h5 className="text-[#191c1e] font-bold text-sm">10 Days No Shouting</h5>
                <p className="text-[#464652] text-xs">3 Days to reach goal</p>
                <div className="w-full bg-[#eceef0] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#006a62] w-[70%]"></div>
                </div>
              </div>
            </div>
            
            {/* Milestone Card 3 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-[#c7c5d4]/30">
              <div className="w-12 h-12 bg-[#2d328f]/20 rounded-full flex items-center justify-center text-[#141779]">
                <Brain size={24} />
              </div>
              <div className="flex-1">
                <h5 className="text-[#191c1e] font-bold text-sm">15 Days Learning Streak</h5>
                <p className="text-[#464652] text-xs">Master of Consistency</p>
              </div>
              <Star className="text-[#006a62]" size={24} fill="currentColor" />
            </div>
          </div>
        </section>

      </main>

      {/* Ambient particles container */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-[#57fae9]/10 rounded-full blur-xl"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite alternate ease-in-out`
            }}
          />
        ))}
      </div>

    </div>
  );
}
