import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Timer, BookOpen, ShieldCheck, Lock, Film, MessageSquare, CreditCard, HelpCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";

function CustomSwitch({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full flex items-center px-0.5 transition-colors duration-200 ${checked ? 'bg-[#006a62]' : 'bg-[#d8dadc]'}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-[22px] h-[22px] bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

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
      } catch (err) {
        console.error("Failed to load parental controls", err);
      }
    }
    loadControls();
  }, []);

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
        setToastMessage("Journey reset successfully!");
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
    <div className="min-h-screen bg-[#f7f9fb] font-sans">
      <header className="flex items-center justify-between px-5 h-16 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-xl font-bold text-[#141779]">Settings</h1>
        <button className="w-10 h-10 flex items-center justify-center">
          <Bell size={24} color="#141779" />
        </button>
      </header>

      <main className="p-6 flex flex-col gap-6 max-w-2xl mx-auto pb-20 w-full">
        {/* Screen Time Section */}
        <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <Timer size={22} color="#006a62" />
              <h2 className="text-lg font-bold text-[#141779]">Screen Time</h2>
            </div>
            <CustomSwitch checked={isScreenTimeOn} onChange={(v) => {
              const val = v ? 60 : 9999;
              setScreenTimeMinutes(val);
              updateSetting("screenTimeMinutes", val);
            }} />
          </div>
          
          <div className="flex gap-2.5">
            {[
              { label: "30 Mins", value: 30 },
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
                  className={`flex-1 py-3 rounded-full border-2 transition-colors ${
                    isActive ? 'border-[#006a62] bg-[rgba(0,106,98,0.1)]' : 'border-[#c7c5d4] bg-transparent'
                  }`}
                >
                  <span className={`text-sm ${isActive ? 'font-bold text-[#006a62]' : 'font-semibold text-[#767683]'}`}>
                    {btn.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Restrictions */}
        <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={22} color="#006a62" />
            <h2 className="text-lg font-bold text-[#141779]">Subject Restrictions</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              { label: "Mathematics", state: mathRestricted, set: setMathRestricted },
              { label: "Science & Tech", state: scienceRestricted, set: setScienceRestricted },
              { label: "Language Arts", state: languageRestricted, set: setLanguageRestricted }
            ].map((subject, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-[rgba(255,255,255,0.5)] rounded-xl">
                <span className="text-base font-medium text-[#191c1e]">{subject.label}</span>
                <CustomSwitch checked={subject.state} onChange={subject.set} />
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-[#57fae9] flex items-center justify-center">
              <ShieldCheck size={24} color="#006a62" />
            </div>
            <span className="text-sm font-bold text-[#141779]">Kid-Safe Mode</span>
            <CustomSwitch checked={kidSafeMode} onChange={setKidSafeMode} />
          </div>

          <button className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5 hover:bg-white transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#bfc2ff] flex items-center justify-center">
              <Lock size={24} color="#141779" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#141779]">Update Pin</span>
              <span className="text-xs font-semibold text-[#767683]">Change Access</span>
            </div>
          </button>

          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-[#ffe0b2] flex items-center justify-center">
              <Film size={24} color="#f57c00" />
            </div>
            <span className="text-sm font-bold text-[#141779]">Edu Reels</span>
            <CustomSwitch checked={allowReels} onChange={(v) => {
              setAllowReels(v);
              updateSetting("allowReels", v);
            }} />
          </div>

          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-[#e3f2fd] flex items-center justify-center">
              <MessageSquare size={24} color="#1976d2" />
            </div>
            <span className="text-sm font-bold text-[#141779]">AI Teacher</span>
            <CustomSwitch checked={allowChat} onChange={(v) => {
              setAllowChat(v);
              updateSetting("allowChat", v);
            }} />
          </div>

          <button onClick={() => navigate("/parent/subscription")} className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5 hover:bg-white transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#fff9c4] flex items-center justify-center">
              <CreditCard size={24} color="#fbc02d" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#141779]">Premium Plans</span>
              <span className="text-xs font-semibold text-[#767683]">Free Plan</span>
            </div>
          </button>

          <button className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-2.5 hover:bg-white transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#f8bbd0] flex items-center justify-center">
              <HelpCircle size={24} color="#c2185b" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#141779]">Support & Help</span>
              <span className="text-xs font-semibold text-[#767683]">Request Logs</span>
            </div>
          </button>
        </div>

        {/* Reset Journey Section */}
        <button 
          onClick={() => setShowResetModal(true)}
          className="bg-[rgba(255,218,214,0.2)] rounded-2xl p-6 border-[1.5px] border-[rgba(186,26,26,0.3)] shadow-[0_4px_10px_rgba(0,0,0,0.04)] flex items-center gap-3 text-left hover:bg-[rgba(255,218,214,0.4)] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
            <Trash2 size={24} color="#ba1a1a" />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[#ba1a1a]">Reset Learning Journey</h2>
            <p className="text-[13px] font-semibold text-[#464652] mt-0.5">Clear all coins, progress, and battle history</p>
          </div>
        </button>
      </main>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-[340px] flex flex-col items-center shadow-[0_8px_16px_rgba(0,0,0,0.15)] relative"
            >
              <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mb-4">
                <Trash2 size={32} color="#ba1a1a" />
              </div>
              <h2 className="text-[18px] font-bold text-[#191c1e] text-center leading-6 mb-3">
                Are you sure you want to reset this journey as it lost all the data?
              </h2>
              <p className="text-sm text-[#464652] text-center leading-5 mb-6">
                This will permanently delete all coins, learning progress, level achievements, completed chapters, and badges. This cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-[#c7c5d4] flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[15px] font-semibold text-[#464652]">Cancel</span>
                </button>
                <button 
                  onClick={handleResetJourney}
                  className="flex-1 py-3.5 rounded-xl bg-[#ba1a1a] flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="text-[15px] font-bold text-white">Yes, Reset</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#323232] text-white px-5 py-3 rounded-lg flex items-center gap-3 z-50 shadow-lg min-w-max">
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
