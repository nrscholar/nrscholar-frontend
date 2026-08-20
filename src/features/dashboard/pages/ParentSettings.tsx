import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, BookOpen, Camera, Save, ShieldCheck, Timer, Trash2, UserRound, GraduationCap, Cake, ChevronDown, Check, Plus, Globe, LogOut, Edit3, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, clearAuthSession } from "../../../api";
import { useTranslation } from "react-i18next";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options = [], onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="flex flex-col gap-1 md:gap-2 flex-1 relative min-w-0">
      <label className="text-xs md:text-sm font-semibold text-[#767683] ml-1 md:ml-2 truncate">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 md:h-14 bg-white rounded-xl md:rounded-2xl pl-8 md:pl-12 pr-7 md:pr-10 text-xs md:text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none flex items-center justify-start text-left relative shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="absolute left-2.5 md:left-4 z-10 flex items-center h-full top-0">
          <Icon className="w-4 h-4 md:w-[22px] md:h-[22px]" color={iconColor} />
        </div>
        <span className={`truncate w-full ${value ? "text-[#191c1e]" : "text-[#c7c5d4]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className="absolute right-2 md:right-3 w-4 h-4 md:w-6 md:h-6" color="#767683" />
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
                {safeOptions.map((opt: string) => (
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

const LanguageDropdown = ({ value, onChange, options = [] }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];
  const selectedLabel = safeOptions.find((o: any) => o.value === value)?.label || value;

  return (
    <div className={`relative shrink-0 sm:w-48 w-full ${isOpen ? 'z-30' : 'z-10'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-[#f0f4f8] rounded-xl px-4 text-sm font-bold text-[#191c1e] border-2 border-transparent hover:border-[#141779]/20 focus:border-[#141779] outline-none flex items-center justify-between shadow-sm transition-all"
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={18} className={`text-[#767683] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
              className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 z-50 flex flex-col w-full overflow-hidden"
            >
              <div className="overflow-y-auto w-full max-h-[200px]">
                {safeOptions.map((opt: any) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 border-b border-[#f2f4f6] last:border-0 hover:bg-[#141779]/5 transition-colors text-left"
                  >
                    <span className={`text-sm ${value === opt.value ? 'font-bold text-[#141779]' : 'font-medium text-[#464652]'}`}>
                      {opt.label}
                    </span>
                    {value === opt.value && <Check size={16} className="text-[#141779]" />}
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
  const { t, i18n } = useTranslation();
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [contentLanguage, setContentLanguage] = useState("en");

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [childIdToDelete, setChildIdToDelete] = useState<string | null>(null);
  const [regenConfirmOpen, setRegenConfirmOpen] = useState(false);
  const [childIdToRegen, setChildIdToRegen] = useState<string | null>(null);

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
              if (pc.contentLanguage) {
                setContentLanguage(pc.contentLanguage);
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
              setParentName(u.parentName || u.fullName || u.username || u.name || "");
              setParentPhoto(u.parentPhoto || "");
              
              const kids = u.children || [];
              const k1 = kids.find((k: any) => k.childId === "child_1") || kids[0];
              const fallbackAge1 = k1?.childAge || u.childAge;
              if (k1) {
                setChild1Name(k1.childName || u.childName || "");
                setChild1Class(k1.childClass || u.childClass || "");
                setChild1Age(fallbackAge1 ? (typeof fallbackAge1 === 'string' && fallbackAge1.includes('Years') ? fallbackAge1 : `${fallbackAge1} Years`) : "");
                setChild1Board(k1.childBoard || u.childBoard || "");
                setChild1Photo(k1.childPhoto || u.childPhoto || "");
                setChild1Code(k1.uniqueCode || u.uniqueCode || "");
              } else {
                setChild1Name(u.childName || "");
                setChild1Class(u.childClass || "");
                setChild1Age(u.childAge ? `${u.childAge} Years` : "");
                setChild1Board(u.childBoard || "");
                setChild1Photo(u.childPhoto || "");
              }

              const k2 = kids.length > 1 ? (kids.find((k: any) => k.childId === "child_2") || kids[1]) : null;
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

    const handleUserDataUpdate = () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUser(u);
          // Re-hydrate ALL child state vars so edit-form fields reflect the latest data
          const kids = u.children || [];
          const k1 = kids.find((k: any) => k.childId === "child_1") || kids[0];
          if (k1) {
            setChild1Name(k1.childName || "");
            setChild1Class(k1.childClass || "");
            const age1 = k1.childAge;
            setChild1Age(age1 ? (typeof age1 === "string" && age1.includes("Years") ? age1 : `${age1} Years`) : "");
            setChild1Board(k1.childBoard || "");
            setChild1Photo(k1.childPhoto || "");
            setChild1Code(k1.uniqueCode || "");
          }
          const k2 = kids.length > 1 ? (kids.find((k: any) => k.childId === "child_2") || kids[1]) : null;
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
            setChild2Name(""); setChild2Class(""); setChild2Age("");
            setChild2Board(""); setChild2Photo(""); setChild2Code("");
          }
        } catch(e) {}
      }
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => window.removeEventListener("userDataUpdated", handleUserDataUpdate);
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
        window.dispatchEvent(new Event("userDataUpdated"));

        // Fully refresh ALL child field states from the API response
        const kids = finalUser.children || [];
        const k1 = kids.find((k: any) => k.childId === "child_1") || kids[0];
        if (k1) {
          setChild1Name(k1.childName || "");
          setChild1Class(k1.childClass || "");
          const a1 = k1.childAge;
          setChild1Age(a1 ? (typeof a1 === "string" && a1.includes("Years") ? a1 : `${a1} Years`) : "");
          setChild1Board(k1.childBoard || "");
          setChild1Photo(k1.childPhoto || "");
          setChild1Code(k1.uniqueCode || "");
        }
        const k2 = kids.length > 1 ? (kids.find((k: any) => k.childId === "child_2") || kids[1]) : null;
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
          setChild2Name(""); setChild2Class(""); setChild2Age("");
          setChild2Board(""); setChild2Photo(""); setChild2Code("");
        }
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

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const requestDeleteChild = (childId: string) => {
    setChildIdToDelete(childId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChild = async () => {
    if (!childIdToDelete) return;
    const childId = childIdToDelete;
    setDeleteConfirmOpen(false);
    setChildIdToDelete(null);
    try {
      const res = await apiFetch(`/api/users/children/${childId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        const u = json.data.user;
        // Write to localStorage FIRST before updating any state,
        // so the handleUserDataUpdate listener sees the correct post-delete data.
        localStorage.setItem("userData", JSON.stringify(u));
        setUser(u);

        // Always clear child2 state first to avoid showing ghost data
        setHasChild2(false);
        setChild2Name(""); setChild2Class(""); setChild2Age("");
        setChild2Board(""); setChild2Photo(""); setChild2Code("");

        // Re-hydrate from fresh API response — never from stale pre-delete localStorage
        const kids = u.children || [];
        const k1 = kids.find((k: any) => k.childId === "child_1") || kids[0];
        if (k1) {
          setChild1Name(k1.childName || "");
          setChild1Class(k1.childClass || "");
          setChild1Age(k1.childAge ? `${k1.childAge} Years` : "");
          setChild1Board(k1.childBoard || "");
          setChild1Photo(k1.childPhoto || "");
          setChild1Code(k1.uniqueCode || "");
        }
        const k2 = kids.length > 1 ? kids.find((k: any) => k.childId === "child_2") : null;
        if (k2) {
          setHasChild2(true);
          setChild2Name(k2.childName || "");
          setChild2Class(k2.childClass || "");
          setChild2Age(k2.childAge ? `${k2.childAge} Years` : "");
          setChild2Board(k2.childBoard || "");
          setChild2Photo(k2.childPhoto || "");
          setChild2Code(k2.uniqueCode || "");
        }

        setToastMessage("Child profile deleted successfully! 🗑️");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage(json.message || "Failed to delete child profile");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (e: any) {
      console.error(e);
      setToastMessage(e.message || "Failed to delete child profile");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const deleteChild2Click = () => {
    const kids = user?.children || [];
    const hasSavedChild2 = kids.some((k: any) => k.childId === "child_2");
    if (hasSavedChild2) {
      requestDeleteChild("child_2");
    } else {
      setHasChild2(false);
      setChild2Name("");
      setChild2Class("");
      setChild2Age("");
      setChild2Board("");
      setChild2Photo("");
      setChild2Code("");
    }
  };

  const requestRegenCode = (childId: string) => {
    setChildIdToRegen(childId);
    setRegenConfirmOpen(true);
  };

  const confirmRegenCode = async () => {
    if (!childIdToRegen) return;
    const childId = childIdToRegen;
    setRegenConfirmOpen(false);
    setChildIdToRegen(null);
    try {
      if (childId === "family") {
        const res = await apiFetch("/api/users/family-link/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const json = await res.json();
        if (json.success && json.familyCode) {
          if (json.user) {
            const updatedUser = { ...json.user, familyCode: json.familyCode };
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setUser(updatedUser);
            window.dispatchEvent(new Event("userDataUpdated"));
          }
          setToastMessage("Family code regenerated successfully! 🔑");
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setToastMessage(json.detail || json.message || "Failed to regenerate code.");
          setTimeout(() => setToastMessage(null), 3000);
        }
      } else {
        const res = await apiFetch("/api/users/child-code/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId })
        });
        const json = await res.json();
        if (json.success && json.uniqueCode) {
          if (childId === "child_1") {
            setChild1Code(json.uniqueCode);
          } else {
            setChild2Code(json.uniqueCode);
          }
          if (json.user) {
            localStorage.setItem("userData", JSON.stringify(json.user));
            setUser(json.user);
            window.dispatchEvent(new Event("userDataUpdated"));
          }
          setToastMessage("Device code regenerated successfully! 🔑");
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setToastMessage(json.detail || json.message || "Failed to regenerate code.");
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
    } catch (e) {
      setToastMessage("Error connecting to server.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const isScreenTimeOn = screenTimeMinutes > 0 && screenTimeMinutes < 9999;

  return (
  <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans">
    {/* Header */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (activeTab === "profile") {
              setActiveTab("main");
            } else {
              navigate(-1);
            }
          }} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-[#141779]" />
        </button>
        <div className="w-9 h-9 rounded-full border border-[#141779]/20 overflow-hidden bg-white shrink-0 shadow-xs">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover"
            src={parentPhoto || `https://ui-avatars.com/api/?name=Parent&background=random`}
          />
        </div>
        <h1 className="text-xl font-black text-[#141779] tracking-tight">
          {activeTab === "profile" ? "Profile Settings" : t("settings")}
        </h1>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#141779] transition-all">
        <Bell size={20} />
      </button>
    </header>

    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto pt-20 pb-32 px-5 flex flex-col gap-6 relative z-10"
    >
      {activeTab === "main" ? (
        <>
          {/* Profile Settings Option Card */}
          <motion.div
            variants={itemVariants}
            onClick={() => setActiveTab("profile")}
            className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779]">
                <UserRound size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#141779]">Profile Settings</h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">Manage parent and kids profiles</p>
              </div>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 group-hover:translate-x-1 transition-transform relative z-10">
              <ArrowLeft size={18} className="text-[#141779] rotate-180" />
            </div>
          </motion.div>

          {/* Screen Time Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006a62]">
                  <Timer size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#141779]">Screen Time Limit</h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">Manage app usage duration</p>
                </div>
              </div>
              <CustomSwitch checked={isScreenTimeOn} onChange={(v) => {
                const val = v ? 60 : 9999;
                setScreenTimeMinutes(val);
                updateSetting("screenTimeMinutes", val);
              }} />
            </div>
            
            {isScreenTimeOn ? (
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-[#006a62]">{screenTimeMinutes} <span className="text-xs font-extrabold text-slate-600">Minutes / Day</span></span>
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
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a62]"
                />
                <div className="flex justify-between text-xs font-black text-slate-500 px-1">
                  <span>5m</span>
                  <span>30m</span>
                  <span>60m</span>
                  <span>90m</span>
                  <span>120m</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="font-black text-[#141779] text-sm">Screen Time is Unlimited</p>
                <p className="text-xs font-bold text-slate-600 mt-1">Your child can use the app without any time restrictions.</p>
              </div>
            )}
          </motion.div>

          {/* Subject Restrictions */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#30007f]">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#141779]">Subject Focus</h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">Restrict access to certain subjects</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-1">
              {subjects.length > 0 ? subjects.map((subject, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {subject.toLowerCase().includes("math") ? "➗" : 
                       subject.toLowerCase().includes("science") ? "🔬" : 
                       subject.toLowerCase().includes("english") || subject.toLowerCase().includes("language") ? "📚" : "📖"}
                    </span>
                    <span className="text-sm font-black text-[#141779]">{subject}</span>
                  </div>
                  <CustomSwitch 
                    checked={!restrictedSubjects[subject]} 
                    onChange={(v) => toggleSubjectRestriction(subject, !v)} 
                  />
                </div>
              )) : (
                <div className="text-center py-4 text-slate-500 font-bold text-xs">
                  No subjects found for current standard.
                </div>
              )}
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4 relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779]">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#141779]">{t("language_settings")}</h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{t("manage_language_pref")}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-[#141779]">{t("app_language")}</span>
                  <span className="text-xs font-bold text-slate-600">{t("select_language")}</span>
                </div>
                <LanguageDropdown 
                  value={(i18n?.language || "en").split('-')[0]}
                  onChange={(val: string) => i18n.changeLanguage(val)}
                  options={[
                    { value: "en", label: "English" },
                    { value: "hi", label: "हिंदी (Hindi)" },
                    { value: "gu", label: "ગુજરાતી (Gujarati)" }
                  ]}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-[#141779]">{t("lessons_language")}</span>
                  <span className="text-xs font-bold text-slate-600">{t("select_language")}</span>
                </div>
                <LanguageDropdown 
                  value={contentLanguage}
                  onChange={(val: string) => {
                    setContentLanguage(val);
                    updateSetting("contentLanguage", val);
                  }}
                  options={[
                    { value: "en", label: "English" },
                    { value: "hi", label: "हिंदी (Hindi)" },
                    { value: "gu", label: "ગુજરાતી (Gujarati)" }
                  ]}
                />
              </div>
            </div>
          </motion.div>

          {/* Family Link Code Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006a62] shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#141779]">Family Link & Devices</h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">Connect co-parents (Father & Mother) or extra devices</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider truncate">Your Family Link Code</span>
                <span className="text-xl font-black text-[#141779] tracking-widest whitespace-nowrap">{user?.familyCode || "FAM-8492"}</span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (user?.familyCode) {
                      navigator.clipboard.writeText(user.familyCode);
                      setToastMessage("Family Code copied!");
                      setTimeout(() => setToastMessage(null), 2500);
                    }
                  }}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-[#141779] hover:bg-[#1e23a0] text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Copy Code</span>
                </button>

                <button
                  title="Regenerate Code"
                  onClick={() => requestRegenCode("family")}
                  className="h-10 px-3 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-700 hover:text-[#141779] text-xs font-black active:scale-95 flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Logout Option */}
          <motion.button 
            variants={itemVariants}
            onClick={() => setShowLogoutModal(true)}
            className="bg-rose-50 hover:bg-rose-100 rounded-[24px] p-6 border border-rose-200 shadow-sm flex items-center gap-4 text-left transition-colors w-full"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <LogOut size={24} className="text-rose-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-rose-700">Logout</h2>
              <p className="text-xs font-bold text-rose-800/70 mt-0.5">Sign out of your account</p>
            </div>
          </motion.button>
        </>
      ) : (
        <>
          {/* Parent Profile Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <h3 className="text-lg font-black text-[#141779] flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#006a62]" /> Parent Profile
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-20 h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center text-3xl overflow-hidden cursor-pointer group/parentphoto shrink-0">
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
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Parent Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Enter Parent Name"
                  className="w-full h-12 bg-slate-50 rounded-2xl px-5 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-xs"
                />
              </div>
            </div>
          </motion.div>

          {/* Child 1 Profile Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#141779] flex items-center gap-2">
                <UserRound size={20} className="text-[#141779]" /> Child 1 Profile
              </h3>
              {hasChild2 && (
                <button 
                  type="button" 
                  onClick={() => requestDeleteChild("child_1")} 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete this child profile"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Child 1 Photo */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer group/c1photo">
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
                <span className="text-[11px] font-black text-slate-500 mt-1.5">Tap photo to edit</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Name</label>
                <input
                  type="text"
                  value={child1Name}
                  onChange={(e) => setChild1Name(e.target.value)}
                  placeholder="Enter Child Name"
                  className="w-full h-12 bg-slate-50 rounded-2xl px-5 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-xs"
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

              <div className="flex gap-3 w-full relative z-10">
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

              <div className="flex flex-col gap-2 mt-1">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Device Code (Scholar Login)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-lg font-black tracking-widest text-[#141779]">
                    {child1Code || "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={() => requestRegenCode("child_1")}
                    className="px-3 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-[#141779] border border-indigo-100 hover:bg-indigo-100 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Child 2 Profile Card (if exists) */}
          {hasChild2 ? (
            <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-[#141779] flex items-center gap-2">
                  <UserRound size={20} className="text-[#141779]" /> Child 2 Profile
                </h3>
                <button 
                  type="button" 
                  onClick={deleteChild2Click} 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove second child details"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer group/c2photo">
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
                  <span className="text-[11px] font-black text-slate-500 mt-1.5">Tap photo to edit</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Name</label>
                  <input
                    type="text"
                    value={child2Name}
                    onChange={(e) => setChild2Name(e.target.value)}
                    className="w-full h-12 bg-slate-50 rounded-2xl px-5 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-xs"
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

                <div className="flex gap-3 w-full relative z-10">
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

                <div className="flex flex-col gap-2 mt-1">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Device Code (Scholar Login)</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-lg font-black tracking-widest text-[#141779]">
                      {child2Code || "N/A"}
                    </span>
                    <button
                      type="button"
                      onClick={() => requestRegenCode("child_2")}
                      className="px-3 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-[#141779] border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
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
              className="w-full py-4 border-2 border-dashed border-[#141779]/30 rounded-[24px] text-[#141779] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#141779]/5 transition-all bg-white"
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
              className="w-full h-14 bg-[#141779] hover:bg-[#1e23a0] rounded-full flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all disabled:opacity-70 text-white font-black text-base"
            >
              <span>{isSavingProfile ? "Saving Profiles..." : "Save Profiles"}</span>
              {!isSavingProfile && <Save size={20} color="white" />}
            </button>
          </motion.div>
        </>
      )}
    </motion.main>

    {/* Reset Modal */}
    <AnimatePresence>
      {showResetModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-[360px] flex flex-col items-center shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
              <Trash2 size={32} className="text-rose-600" />
            </div>
            <h2 className="text-lg font-black text-[#141779] text-center mb-2">
              Wipe All Data?
            </h2>
            <p className="text-xs text-slate-600 font-bold text-center leading-relaxed mb-6">
              This action is <span className="font-black text-rose-600">irreversible</span>. It will permanently delete all coins, level achievements, completed chapters, and badges.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={handleResetJourney}
                className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center"
              >
                Yes, Wipe Data
              </button>
              <button 
                onClick={() => setShowResetModal(false)}
                className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm transition-colors flex items-center justify-center"
              >
                Cancel
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
          className="fixed bottom-10 left-4 right-4 mx-auto w-fit max-w-[400px] bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-full flex items-center justify-center gap-3 z-50 shadow-2xl border border-slate-700/50"
        >
          <Save size={18} className="text-teal-400 shrink-0" />
          <span className="text-xs font-black tracking-wide text-center leading-tight">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Custom Logout Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200">
          <h3 className="text-lg font-black text-[#141779] text-center mb-2">{t('logout') || 'Logout'}</h3>
          <p className="text-xs font-bold text-slate-600 text-center mb-6">
            Are you sure you want to logout?
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-rose-600 text-white rounded-full font-black text-sm shadow-md hover:bg-rose-700 transition-colors"
            >
              Yes, Logout
            </button>
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-full font-black text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Custom Delete Confirmation Modal */}
    {deleteConfirmOpen && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-5 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <Trash2 size={28} />
          </div>
          
          <div>
            <h3 className="text-lg font-black text-[#141779]">Delete Profile</h3>
            <p className="text-xs font-bold text-slate-600 mt-2">
              Are you sure you want to delete this child profile? All progress for this child will be lost.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              type="button"
              onClick={confirmDeleteChild}
              className="w-full py-3 bg-rose-600 text-white rounded-full font-black text-sm shadow-md hover:bg-rose-700 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setChildIdToDelete(null);
              }}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-full font-black text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Custom Regenerate Code Confirmation Modal */}
    {regenConfirmOpen && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-5 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-4 font-sans">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-[#141779]">
            <RefreshCw size={28} />
          </div>
          
          <div>
            <h3 className="text-lg font-black text-[#141779]">
              {childIdToRegen === "family" ? "Regenerate Family Code" : "Regenerate Code"}
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-2">
              {childIdToRegen === "family"
                ? "Are you sure you want to regenerate a new random Family Link Code? All co-parents using the old code will need to link again."
                : "Are you sure you want to regenerate a new random device code for this child? The old code will stop working immediately."
              }
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              type="button"
              onClick={confirmRegenCode}
              className="w-full py-3 bg-[#141779] text-white rounded-full font-black text-sm shadow-md hover:opacity-90 transition-opacity"
            >
              Yes, Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                setRegenConfirmOpen(false);
                setChildIdToRegen(null);
              }}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-full font-black text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
