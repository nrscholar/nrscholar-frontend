import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, BookOpen, Camera, CreditCard, Film, HelpCircle, Lock, MessageSquare, Save, ShieldCheck, Timer, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

function CustomSwitch({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-all duration-300 ${checked ? 'bg-gradient-to-r from-[#006a62] to-[#009b8f]' : 'bg-[#d8dadc]'}`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-[24px] h-[24px] bg-white rounded-full shadow-md"
      />
    </button>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ParentSettings() {
  const navigate = useNavigate();
  const [screenTimeMinutes, setScreenTimeMinutes] = useState(60);
  const [mathRestricted, setMathRestricted] = useState(false);
  const [scienceRestricted, setScienceRestricted] = useState(false);
  const [languageRestricted, setLanguageRestricted] = useState(true);
  const [kidSafeMode, setKidSafeMode] = useState(true);
  const [allowReels, setAllowReels] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [parentPhoto, setParentPhoto] = useState<string>("");

  useEffect(() => {
    async function loadControls() {
      try {
        const res = await apiFetch("/api/parent/controls");
        const json = await res.json();
        if (json.success && json.data?.parentControls) {
          const pc = json.data.parentControls;
          setAllowReels(pc.allowReels);
          setAllowChat(pc.allowChat);
          setScreenTimeMinutes(pc.screenTimeMinutes || 60);
        }
        
        // Load parent photo from profile
        const profileRes = await apiFetch("/api/users/me");
        const profileJson = await profileRes.json();
        if (profileJson.success && profileJson.data?.user?.parentPhoto) {
          setParentPhoto(profileJson.data.user.parentPhoto);
        }
      } catch (err) {
        console.error("Failed to load parental controls", err);
      }
    }
    loadControls();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Str = event.target?.result as string;
        setParentPhoto(base64Str);
        try {
          await apiFetch("/api/users/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parentPhoto: base64Str })
          });
          setToastMessage("Profile photo updated!");
          setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
          console.error("Failed to upload photo", err);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      await apiFetch("/api/parent/controls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value })
      });
    } catch (err) {
      console.error("Failed to update control", err);
    }
  };

  const handleResetJourney = async () => {
    try {
      const res = await apiFetch("/api/parent/reset-journey", {
        method: "POST"
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem("userData");
        setToastMessage("Journey reset successfully! 🚀");
        setShowResetModal(false);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setToastMessage(json.message || "Failed to reset journey");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to reset journey", err);
      setToastMessage("An error occurred while resetting journey.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const isScreenTimeOn = screenTimeMinutes < 9999;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans pb-24 overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="flex items-center justify-between px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
            <ArrowLeft size={22} className="text-[#141779]" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#141779]/20 overflow-hidden bg-white shrink-0">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=Parent&background=random`}
            />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#30007f]">Settings</h1>
        </div>
        <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
          <Bell size={22} className="text-[#141779]" />
        </button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-8 flex flex-col gap-8 max-w-3xl mx-auto w-full"
      >
        {/* Parent Profile Section */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group flex items-center gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#30007f]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="relative z-10 w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center text-3xl overflow-hidden cursor-pointer group/photo">
            {parentPhoto ? (
              <img src={parentPhoto} alt="Parent" className="w-full h-full object-cover" />
            ) : (
              <span>👨‍👩‍👦</span>
            )}
            <label htmlFor="parent-photo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} color="white" />
            </label>
            <input 
              id="parent-photo-upload" 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />
          </div>
          <div className="relative z-10 flex-1">
            <h2 className="text-2xl font-bold text-[#141779]">Parent Profile</h2>
            <p className="text-sm font-semibold text-[#767683] mt-1 flex items-center gap-1">
              <ShieldCheck size={16} className="text-[#006a62]" /> Secure Admin Area
            </p>
          </div>
        </motion.div>

        {/* Screen Time Section */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006a62]/20 to-[#006a62]/5 flex items-center justify-center">
                <Timer size={24} color="#006a62" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#141779]">Screen Time Limit</h2>
                <p className="text-sm text-[#767683] mt-0.5">Manage app usage duration</p>
              </div>
            </div>
            <CustomSwitch checked={isScreenTimeOn} onChange={(v) => {
              const val = v ? 60 : 9999;
              setScreenTimeMinutes(val);
              updateSetting("screenTimeMinutes", val);
            }} />
          </div>
          
          <div className="flex gap-3 relative z-10">
            {[
              { label: "30 Min", value: 30 },
              { label: "1 Hour", value: 60 },
              { label: "Unlimited", value: 9999 }
            ].map((btn) => {
              const isActive = (btn.value === 9999 && !isScreenTimeOn) || (isScreenTimeOn && screenTimeMinutes === btn.value);
              return (
                <button
                  key={btn.value}
                  onClick={() => {
                    setScreenTimeMinutes(btn.value);
                    updateSetting("screenTimeMinutes", btn.value);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-[#006a62] bg-[#006a62] shadow-lg shadow-[#006a62]/20 scale-[1.02]' 
                      : 'border-[#e0e3e5] bg-white hover:border-[#006a62]/50 hover:bg-[#f8fafc]'
                  }`}
                >
                  <span className={`text-[15px] ${isActive ? 'font-bold text-white' : 'font-semibold text-[#464652]'}`}>
                    {btn.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Subject Restrictions */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#30007f]/20 to-[#30007f]/5 flex items-center justify-center">
              <BookOpen size={24} color="#30007f" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#141779]">Subject Focus</h2>
              <p className="text-sm text-[#767683] mt-0.5">Restrict access to certain subjects</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              { label: "Mathematics", state: mathRestricted, set: setMathRestricted, icon: "➗" },
              { label: "Science & Tech", state: scienceRestricted, set: setScienceRestricted, icon: "🔬" },
              { label: "Language Arts", state: languageRestricted, set: setLanguageRestricted, icon: "📚" }
            ].map((subject, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subject.icon}</span>
                  <span className="text-base font-bold text-[#191c1e]">{subject.label}</span>
                </div>
                <CustomSwitch checked={subject.state} onChange={subject.set} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium Bento Grid Controls */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { title: "Kid-Safe Mode", icon: ShieldCheck, color: "#006a62", bg: "#ccf4f0", state: kidSafeMode, set: setKidSafeMode, type: 'switch' },
            { title: "Edu Reels", icon: Film, color: "#f57c00", bg: "#ffe0b2", state: allowReels, set: (v: boolean) => { setAllowReels(v); updateSetting("allowReels", v); }, type: 'switch' },
            { title: "AI Teacher", icon: MessageSquare, color: "#1976d2", bg: "#e3f2fd", state: allowChat, set: (v: boolean) => { setAllowChat(v); updateSetting("allowChat", v); }, type: 'switch' },
            { title: "Update Pin", desc: "Change Access", icon: Lock, color: "#30007f", bg: "#e6e0ff", type: 'button' },
            { title: "Premium Plans", desc: "Free Plan", icon: CreditCard, color: "#b28900", bg: "#fff9c4", action: () => navigate("/parent/subscription"), type: 'button' },
            { title: "Support", desc: "Get Help", icon: HelpCircle, color: "#c2185b", bg: "#f8bbd0", type: 'button' }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4 }}
              onClick={item.action}
              className={`bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center text-center gap-3 transition-all ${item.type === 'button' ? 'cursor-pointer hover:shadow-lg' : ''}`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: item.bg }}>
                <item.icon size={26} color={item.color} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-[15px] font-bold text-[#141779] leading-tight">{item.title}</span>
                {item.type === 'switch' ? (
                  <CustomSwitch checked={item.state!} onChange={item.set!} />
                ) : (
                  <span className="text-[13px] font-semibold text-[#767683] bg-gray-100 px-3 py-1 rounded-full">{item.desc}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Danger Zone: Reset Journey */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowResetModal(true)}
          className="bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl p-6 border-2 border-red-100 shadow-sm flex items-center gap-4 text-left group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-red-200 transition-colors z-10">
            <Trash2 size={26} className="text-red-600" />
          </div>
          <div className="flex-1 z-10">
            <h2 className="text-lg font-bold text-red-700">Factory Reset Journey</h2>
            <p className="text-sm font-medium text-red-900/60 mt-1">Erase all coins, progress, and battle history permanently</p>
          </div>
        </motion.button>
      </motion.main>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-[360px] flex flex-col items-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-rose-600" />
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5 ring-8 ring-red-50/50">
                <Trash2 size={36} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[#191c1e] text-center mb-3">
                Wipe All Data?
              </h2>
              <p className="text-[15px] text-[#464652] text-center leading-relaxed mb-8">
                This action is <span className="font-bold text-red-600">irreversible</span>. It will permanently delete all coins, level achievements, completed chapters, and badges.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleResetJourney}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center"
                >
                  <span className="text-[16px] font-bold text-white tracking-wide">Yes, Wipe Data</span>
                </button>
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="w-full py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <span className="text-[16px] font-bold text-[#464652]">Cancel</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-4 right-4 mx-auto w-fit max-w-[400px] bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 z-50 shadow-2xl border border-gray-700/50"
          >
            <Save size={20} className="text-green-400 shrink-0" />
            <span className="text-[15px] font-semibold tracking-wide text-center leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
