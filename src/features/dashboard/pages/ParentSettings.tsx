import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, BookOpen, Camera, Save, ShieldCheck, Timer, Trash2, UserRound, GraduationCap, Cake, ChevronDown, Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options, onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 flex-1 relative">
      <label className="text-sm font-semibold text-[#767683] ml-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 bg-white rounded-2xl pl-12 pr-10 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none flex items-center justify-start text-left relative shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="absolute left-4 z-10 flex items-center h-full top-0">
          <Icon size={22} color={iconColor} />
        </div>
        <span className={`truncate ${value ? "text-[#191c1e]" : "text-[#c7c5d4]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={24} color="#767683" className="absolute right-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-50 flex flex-col max-h-[250px] overflow-hidden"
            >
              <div className="overflow-y-auto w-full scrollbar-hide">
                {options.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(opt);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 border-b border-[#f2f4f6] last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-base ${value === opt ? 'font-bold text-[#141779]' : 'font-medium text-[#464652]'}`}>
                      {opt}
                    </span>
                    {value === opt && <Check size={18} color="#141779" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"main" | "profile">("main");
  const [user, setUser] = useState<any>(null);
  
  const [screenTimeMinutes, setScreenTimeMinutes] = useState(0);
  const [kidSafeMode, setKidSafeMode] = useState(true);
  const [allowReels, setAllowReels] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [restrictedSubjects, setRestrictedSubjects] = useState<Record<string, boolean>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Parent Profile States
  const [parentName, setParentName] = useState("");
  const [parentPhoto, setParentPhoto] = useState<string>("");

  // Child 1 Profile States
  const [child1Name, setChild1Name] = useState("");
  const [child1Class, setChild1Class] = useState("");
  const [child1Age, setChild1Age] = useState("");
  const [child1Board, setChild1Board] = useState("");
  const [child1Photo, setChild1Photo] = useState("");
  const [child1Code, setChild1Code] = useState("");

  // Child 2 Profile States
  const [hasChild2, setHasChild2] = useState(false);
  const [child2Name, setChild2Name] = useState("");
  const [child2Class, setChild2Class] = useState("");
  const [child2Age, setChild2Age] = useState("");
  const [child2Board, setChild2Board] = useState("");
  const [child2Photo, setChild2Photo] = useState("");
  const [child2Code, setChild2Code] = useState("");

  const classes = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const ages = ["4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years", "11 Years", "12 Years", "13 Years", "14 Years", "15 Years"];
  const boards = ["CBSE (NCERT)", "GSEB", "ICSE", "State Board", "IB", "IGCSE"];

  useEffect(() => {
    async function loadControls() {
      try {
        const controlsPromise = (async () => {
          try {
            const res = await apiFetch("/api/parent/controls");
            const json = await res.json();
            if (json.success && json.data?.parentControls) {
              const pc = json.data.parentControls;
              setAllowReels(pc.allowReels);
              setAllowChat(pc.allowChat);
              setScreenTimeMinutes(pc.screenTimeMinutes !== undefined ? pc.screenTimeMinutes : 0);
              if (pc.restrictedSubjects) {
                setRestrictedSubjects(pc.restrictedSubjects);
              }
            }
          } catch (e) {
            console.error("Failed to load parent controls", e);
          }
        })();

        const profilePromise = (async () => {
          try {
            const profileRes = await apiFetch("/api/users/me");
            const profileJson = await profileRes.json();
            if (profileJson.success && profileJson.data?.user) {
              const u = profileJson.data.user;
              setUser(u);
              setParentName(u.fullName || "");
              setParentPhoto(u.parentPhoto || "");
              
              const kids = u.children || [];
              const k1 = kids.find((k: any) => k.childId === "child_1") || kids[0];
              if (k1) {
                setChild1Name(k1.childName || "");
                setChild1Class(k1.childClass || "");
                setChild1Age(k1.childAge ? `${k1.childAge} Years` : "");
                setChild1Board(k1.childBoard || "");
                setChild1Photo(k1.childPhoto || "");
                setChild1Code(k1.uniqueCode || "");
              } else {
                setChild1Name(u.childName || "");
                setChild1Class(u.childClass || "");
                setChild1Age(u.childAge ? `${u.childAge} Years` : "");
                setChild1Board(u.childBoard || "");
                setChild1Photo(u.childPhoto || "");
              }

              const k2 = kids.find((k: any) => k.childId === "child_2") || (kids.length > 1 ? kids[1] : null);
              if (k2) {
                setHasChild2(true);
                setChild2Name(k2.childName || "");
                setChild2Class(k2.childClass || "");
                setChild2Age(k2.childAge ? `${k2.childAge} Years` : "");
                setChild2Board(k2.childBoard || "");
                setChild2Photo(k2.childPhoto || "");
                setChild2Code(k2.uniqueCode || "");
              } else {
                setHasChild2(false);
              }
            }
          } catch (e) {
            console.error("Failed to load profile", e);
          }
        })();

        const subjectsPromise = (async () => {
          try {
            const subjRes = await apiFetch("/api/practice/subjects");
            const subjJson = await subjRes.json();
            if (subjJson.success && subjJson.data) {
              const names: string[] = Array.from(new Set(subjJson.data.map((s: any) => s.name)));
              setSubjects(names);
              setRestrictedSubjects(prev => {
                const newState = { ...prev };
                names.forEach((s: string) => {
                  if (newState[s] === undefined) {
                    newState[s] = false;
                  }
                });
                return newState;
              });
            }
          } catch (e) {
            console.error("Failed to load subjects", e);
          }
        })();

        await Promise.allSettled([controlsPromise, profilePromise, subjectsPromise]);
      } catch (err) {
        console.error("Failed to load parental controls", err);
      }
    }
    loadControls();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setParentPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChild1PhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChild1Photo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChild2PhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChild2Photo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveProfiles = async () => {
    setIsSavingProfile(true);
    try {
      // 1. Save Parent Profile
      const parentRes = await apiFetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: parentName,
          parentPhoto: parentPhoto
        })
      });
      const parentData = await parentRes.json();
      if (!parentData.success) {
        throw new Error(parentData.message || "Failed to update parent profile");
      }

      // 2. Save Child 1
      const age1Num = child1Age ? parseInt(child1Age.split(" ")[0]) : null;
      const child1Res = await apiFetch("/api/users/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: "child_1",
          childName: child1Name,
          childClass: child1Class,
          childAge: age1Num,
          childBoard: child1Board,
          childPhoto: child1Photo
        })
      });
      const child1Data = await child1Res.json();
      if (!child1Data.success) {
        throw new Error(child1Data.message || "Failed to update child 1 profile");
      }

      // 3. Save Child 2 (if enabled)
      let finalUser = child1Data.data?.user || parentData.data?.user;
      if (hasChild2) {
        const age2Num = child2Age ? parseInt(child2Age.split(" ")[0]) : null;
        const child2Res = await apiFetch("/api/users/children", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childId: "child_2",
            childName: child2Name,
            childClass: child2Class,
            childAge: age2Num,
            childBoard: child2Board,
            childPhoto: child2Photo
          })
        });
        const child2Data = await child2Res.json();
        if (!child2Data.success) {
          throw new Error(child2Data.message || "Failed to update child 2 profile");
        }
        finalUser = child2Data.data?.user;
      }

      if (finalUser) {
        localStorage.setItem("userData", JSON.stringify(finalUser));
        setUser(finalUser);
        
        // Refresh code values from backend response
        const kids = finalUser.children || [];
        const k1 = kids.find((k: any) => k.childId === "child_1");
        if (k1 && k1.uniqueCode) setChild1Code(k1.uniqueCode);
        const k2 = kids.find((k: any) => k.childId === "child_2");
        if (k2 && k2.uniqueCode) setChild2Code(k2.uniqueCode);
      }

      setToastMessage("All profiles updated successfully! 🎉");
      setTimeout(() => setToastMessage(null), 3000);
      
      // Go back to main settings tab
      setTimeout(() => {
        setActiveTab("main");
      }, 1000);
    } catch (e: any) {
      console.error(e);
      setToastMessage(e.message || "Failed to update profiles");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      await apiFetch("/api/parent/controls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value })
      });
      if (key === "screenTimeMinutes") {
        window.dispatchEvent(new Event("screenTimeLimitChanged"));
      }
    } catch (err) {
      console.error("Failed to update control", err);
    }
  };

  const toggleSubjectRestriction = (subject: string, isRestricted: boolean) => {
    const updated = { ...restrictedSubjects, [subject]: isRestricted };
    
    // Auto-map aliases to ensure broad restriction across textbooks and practice
    const lower = subject.toLowerCase();
    if (lower.includes("math")) {
      updated["Maths"] = isRestricted;
      updated["Mathematics"] = isRestricted;
      updated["Math"] = isRestricted;
    } else if (lower.includes("sci")) {
      updated["Science"] = isRestricted;
      updated["Sci"] = isRestricted;
    } else if (lower.includes("eng")) {
      updated["English"] = isRestricted;
      updated["Eng"] = isRestricted;
    }

    setRestrictedSubjects(updated);
    updateSetting("restrictedSubjects", updated);
  };

  const handleResetJourney = async () => {
    try {
      const res = await apiFetch("/api/parent/reset-journey", {
        method: "POST"
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem("userData");
        sessionStorage.clear();
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

  const isScreenTimeOn = screenTimeMinutes > 0 && screenTimeMinutes < 9999;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans pb-24 overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="flex items-center justify-between px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (activeTab === "profile") {
                setActiveTab("main");
              } else {
                navigate(-1);
              }
            }} 
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft size={22} className="text-[#141779]" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#141779]/20 overflow-hidden bg-white shrink-0">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=Parent&background=random`}
            />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#30007f]">
            {activeTab === "profile" ? "Profile Settings" : t("settings")}
          </h1>
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
        {activeTab === "main" ? (
          <>
            {/* Profile Settings Option Card (First) */}
            <motion.div
              variants={itemVariants}
              onClick={() => setActiveTab("profile")}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#141779]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#141779]/20 to-[#141779]/5 flex items-center justify-center">
                  <UserRound size={24} color="#141779" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#141779]">Profile Settings</h2>
                  <p className="text-sm text-[#767683] mt-0.5">Manage parent and kids profiles</p>
                </div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm group-hover:translate-x-1 transition-transform relative z-10">
                <ArrowLeft size={18} className="text-[#141779] rotate-180" />
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
              
              {isScreenTimeOn ? (
                <div className="mt-4 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-[#006a62]">{screenTimeMinutes} <span className="text-sm text-[#767683] font-semibold">Minutes / Day</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    step="5" 
                    value={screenTimeMinutes} 
                    onChange={(e) => setScreenTimeMinutes(parseInt(e.target.value))}
                    onMouseUp={() => updateSetting("screenTimeMinutes", screenTimeMinutes)}
                    onTouchEnd={() => updateSetting("screenTimeMinutes", screenTimeMinutes)}
                    className="w-full h-3 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#006a62]"
                  />
                  <div className="flex justify-between text-xs font-bold text-[#c7c5d4] mt-2 px-1">
                    <span>5m</span>
                    <span>30m</span>
                    <span>60m</span>
                    <span>90m</span>
                    <span>120m</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 relative z-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                  <p className="font-bold text-[#464652]">Screen Time is Unlimited</p>
                  <p className="text-sm text-[#767683] mt-1">Your child can use the app without any time restrictions.</p>
                </div>
              )}
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
                {subjects.length > 0 ? subjects.map((subject, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {subject.toLowerCase().includes("math") ? "➗" : 
                         subject.toLowerCase().includes("science") ? "🔬" : 
                         subject.toLowerCase().includes("english") || subject.toLowerCase().includes("language") ? "📚" : "📖"}
                      </span>
                      <span className="text-base font-bold text-[#191c1e]">{subject}</span>
                    </div>
                    <CustomSwitch 
                      checked={!restrictedSubjects[subject]} 
                      onChange={(v) => toggleSubjectRestriction(subject, !v)} 
                    />
                  </div>
                )) : (
                  <div className="text-center py-4 text-[#767683] font-medium text-sm">
                    No subjects found for current standard.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Parent Profile Card */}
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#30007f]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
              <h3 className="text-lg font-bold text-[#141779] mb-4 flex items-center gap-2 relative z-10">
                <ShieldCheck size={20} className="text-[#006a62]" /> Parent Profile
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center text-3xl overflow-hidden cursor-pointer group/parentphoto shrink-0">
                  {parentPhoto ? (
                    <img src={parentPhoto} alt="Parent" className="w-full h-full object-cover" />
                  ) : (
                    <span>👨‍👩‍👦</span>
                  )}
                  <label htmlFor="parent-photo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/parentphoto:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={22} color="white" />
                  </label>
                  <input 
                    id="parent-photo-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </div>
                
                <div className="flex-1 w-full flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#767683] ml-2">Parent Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Enter Parent Name"
                    className="w-full h-14 bg-white rounded-2xl px-5 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              </div>
            </motion.div>

            {/* Child 1 Profile Card */}
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative group">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-[#141779] flex items-center gap-2">
                  <UserRound size={20} className="text-[#141779]" /> Child 1 Profile
                </h3>
              </div>
              
              <div className="flex flex-col gap-5">
                {/* Child 1 Photo */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group/c1photo">
                    {child1Photo ? (
                      <img src={child1Photo} alt="Child 1" className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(child1Name || "Kid")}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                    <label htmlFor="child1-photo-upload" className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover/c1photo:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} color="white" />
                    </label>
                    <input 
                      id="child1-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleChild1PhotoUpload} 
                      className="hidden" 
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#767683] mt-1.5">Tap photo to edit</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#767683] ml-2">Child Name</label>
                  <input
                    type="text"
                    value={child1Name}
                    onChange={(e) => setChild1Name(e.target.value)}
                    className="w-full h-14 bg-white rounded-2xl px-5 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>

                <CustomDropdown
                  label="Education Board"
                  icon={BookOpen}
                  iconColor="#006a62"
                  value={child1Board}
                  options={boards}
                  onSelect={setChild1Board}
                  placeholder="Select Board"
                />

                <div className="flex gap-3 w-full">
                  <CustomDropdown
                    label="Class / Grade"
                    icon={GraduationCap}
                    iconColor="#30007f"
                    value={child1Class}
                    options={classes}
                    onSelect={setChild1Class}
                    placeholder="Select"
                  />

                  <CustomDropdown
                    label="Age"
                    icon={Cake}
                    iconColor="#141779"
                    value={child1Age}
                    options={ages}
                    onSelect={setChild1Age}
                    placeholder="Select"
                  />
                </div>
              </div>
            </motion.div>

            {/* Child 2 Profile Card (if exists or enabled) */}
            {hasChild2 ? (
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative group">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-[#141779] flex items-center gap-2">
                    <UserRound size={20} className="text-[#141779]" /> Child 2 Profile
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => setHasChild2(false)} 
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove second child details from this form"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-5">
                  {/* Child 2 Photo */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group/c2photo">
                      {child2Photo ? (
                        <img src={child2Photo} alt="Child 2" className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(child2Name || "Kid")}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                      )}
                      <label htmlFor="child2-photo-upload" className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover/c2photo:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={20} color="white" />
                      </label>
                      <input 
                        id="child2-photo-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleChild2PhotoUpload} 
                        className="hidden" 
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#767683] mt-1.5">Tap photo to edit</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#767683] ml-2">Child Name</label>
                    <input
                      type="text"
                      value={child2Name}
                      onChange={(e) => setChild2Name(e.target.value)}
                      className="w-full h-14 bg-white rounded-2xl px-5 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none shadow-sm hover:shadow-md transition-shadow"
                    />
                  </div>

                  <CustomDropdown
                    label="Education Board"
                    icon={BookOpen}
                    iconColor="#006a62"
                    value={child2Board}
                    options={boards}
                    onSelect={setChild2Board}
                    placeholder="Select Board"
                  />

                  <div className="flex gap-3 w-full">
                    <CustomDropdown
                      label="Class / Grade"
                      icon={GraduationCap}
                      iconColor="#30007f"
                      value={child2Class}
                      options={classes}
                      onSelect={setChild2Class}
                      placeholder="Select"
                    />

                    <CustomDropdown
                      label="Age"
                      icon={Cake}
                      iconColor="#141779"
                      value={child2Age}
                      options={ages}
                      onSelect={setChild2Age}
                      placeholder="Select"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Add Second Child Trigger Button */
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={() => {
                  setHasChild2(true);
                  setChild2Name("");
                  setChild2Class("Class 1");
                  setChild2Age("6 Years");
                  setChild2Board("CBSE (NCERT)");
                  setChild2Photo("");
                  setChild2Code("");
                }}
                className="w-full py-5 border-2 border-dashed border-[#141779]/30 rounded-3xl text-[#141779] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#141779]/5 hover:border-[#141779] transition-all bg-white/40"
              >
                <Plus size={20} />
                <span>Add Second Child Profile</span>
              </motion.button>
            )}

            {/* Save Profiles Button */}
            <motion.div variants={itemVariants} className="mt-2">
              <button
                onClick={handleSaveProfiles}
                disabled={isSavingProfile}
                className="w-full h-14 bg-[#141779] rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.2)] hover:shadow-[0_6px_20px_rgba(20,23,121,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 text-white font-bold text-lg"
              >
                <span>{isSavingProfile ? "Saving Profiles..." : "Save Profiles"}</span>
                {!isSavingProfile && <Save size={20} color="white" />}
              </button>
            </motion.div>
          </>
        )}
      </motion.main>

        {/* HIDDEN: All Bento Grid Controls — Kid-Safe Mode, Edu Reels, AI Teacher, Premium Plans, Support, Update Pin kept for future use */}

        {/* HIDDEN: Factory Reset Journey — kept for future use */}
        {/*
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
        */}
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
