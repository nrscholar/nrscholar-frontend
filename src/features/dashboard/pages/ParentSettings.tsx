import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, BookOpen, Camera, Save, ShieldCheck, Timer, Trash2, UserRound, GraduationCap, Cake, ChevronDown, Check, Plus, Globe, LogOut, Edit3, RefreshCw, X, Lock, Sparkles, Flame, Trophy, AlertTriangle, Phone, Eye, EyeOff, Users, CheckCircle2, User, Circle, Shield, Loader2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, clearAuthSession, logoutUser } from "../../../api";
import { useTranslation } from "react-i18next";
import { translateNotificationTitle, translateNotificationMessage } from "../../../utils/notificationTranslator";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { showNotificationToast } from "../../../components/GlobalNotificationBanner";
import { useLockBodyScroll } from "../../../utils/useLockBodyScroll";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options = [], onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];
  const isBoard = label ? label.toLowerCase().includes("board") : false;
  const supportedBoards = ["CBSE (NCERT)", "GSEB", "CBSE"];

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
                {safeOptions.map((opt: string) => {
                  const isLocked = isBoard && !supportedBoards.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isLocked}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isLocked) return;
                        onSelect(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 border-b border-[#f2f4f6] last:border-0 transition-colors ${isLocked ? 'opacity-40 cursor-not-allowed bg-slate-50/50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-base ${isLocked ? 'text-slate-400 font-medium' : value === opt ? 'font-bold text-[#141779]' : 'font-medium text-[#464652]'}`}>
                          {opt}
                        </span>
                        {isLocked && (
                          <span className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock size={10} /> Locked
                          </span>
                        )}
                      </div>
                      {value === opt && !isLocked && <Check size={18} color="#141779" />}
                    </button>
                  );
                })}
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [contentLanguage, setContentLanguage] = useState("en");

  // Notifications State & Formatters
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const formatNotifTitle = (title: string) => translateNotificationTitle(title, t);
  const formatNotifMsg = (msg: string) => {
    const activeC = (user?.children || []).find((c: any) => c.childId === user?.activeChildId);
    return translateNotificationMessage(msg, t, activeC?.childName || user?.childName);
  };

  const fetchNotifications = async (targetChildId?: string) => {
    try {
      let activeChildId = targetChildId || user?.activeChildId;
      if (!activeChildId) {
        try {
          const stored = localStorage.getItem("userData");
          if (stored) {
            const u = JSON.parse(stored);
            activeChildId = u.activeChildId || u.children?.[0]?.childId || u.childId;
          }
        } catch (e) { }
      }
      const notifUrl = `/api/notifications?role=parent${activeChildId ? `&childId=${encodeURIComponent(activeChildId)}` : ""}`;
      const res = await apiFetch(notifUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setNotifications(json.data);
          const unread = json.data.filter((n: any) => !n.isRead).length;
          setUnreadNotifCount(unread);
        }
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  const markAllNotifsRead = async () => {
    try {
      let activeChildId = user?.activeChildId;
      if (!activeChildId) {
        try {
          const stored = localStorage.getItem("userData");
          if (stored) {
            const u = JSON.parse(stored);
            activeChildId = u.activeChildId || u.children?.[0]?.childId || u.childId;
          }
        } catch (e) { }
      }
      const markUrl = `/api/notifications/mark-all-read?role=parent${activeChildId ? `&childId=${encodeURIComponent(activeChildId)}` : ""}`;
      await apiFetch(markUrl, { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
    } catch (e) { }
  };

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

  // Secondary Parent / Co-Parent States
  const [secondaryParents, setSecondaryParents] = useState<any[]>([]);
  const [showAddCoParent, setShowAddCoParent] = useState(false);
  const [coParentName, setCoParentName] = useState("");
  const [coParentRel, setCoParentRel] = useState("Mother");
  const [coParentMobile, setCoParentMobile] = useState("");
  const [coParentPassword, setCoParentPassword] = useState("");
  const [coParentConfirmPassword, setCoParentConfirmPassword] = useState("");
  const [showCoParentPassword, setShowCoParentPassword] = useState(false);
  const [showCoParentConfirmPassword, setShowCoParentConfirmPassword] = useState(false);
  const [isSavingCoParent, setIsSavingCoParent] = useState(false);
  const [coParentError, setCoParentError] = useState("");
  const [coParentDeleteId, setCoParentDeleteId] = useState<string | null>(null);
  const [showDeleteCoParentModal, setShowDeleteCoParentModal] = useState(false);
  const [isCheckingCoParentMobile, setIsCheckingCoParentMobile] = useState(false);
  const [isCoParentMobileRegisteredInDb, setIsCoParentMobileRegisteredInDb] = useState(false);

  useLockBodyScroll(Boolean(showAddCoParent || showNotifications));

  // Debounced real-time check for co-parent phone number global registration
  useEffect(() => {
    const cleanM = coParentMobile.replace(/\D/g, "");
    if (cleanM.length !== 10 || !/^[6-9]/.test(cleanM)) {
      setIsCoParentMobileRegisteredInDb(false);
      setIsCheckingCoParentMobile(false);
      return;
    }

    const primaryM = (user?.mobile || "").replace(/\D/g, "").slice(-10);
    const isSameAsPrimaryLocal = primaryM.length === 10 && cleanM === primaryM;
    const isDuplicateCoParentLocal = secondaryParents.some(
      (sp: any) => (sp.mobile || "").replace(/\D/g, "").slice(-10) === cleanM
    );

    if (isSameAsPrimaryLocal || isDuplicateCoParentLocal) {
      setIsCoParentMobileRegisteredInDb(true);
      setIsCheckingCoParentMobile(false);
      return;
    }

    let isCancelled = false;
    setIsCheckingCoParentMobile(true);

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch("/api/users/check-mobile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: cleanM })
        });
        const data = await res.json();
        if (!isCancelled) {
          if (data && data.exists) {
            setIsCoParentMobileRegisteredInDb(true);
          } else {
            setIsCoParentMobileRegisteredInDb(false);
          }
        }
      } catch (err) {
        console.error("Error checking mobile uniqueness:", err);
      } finally {
        if (!isCancelled) {
          setIsCheckingCoParentMobile(false);
        }
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [coParentMobile, user?.mobile, secondaryParents]);

  const isCoParent = Boolean(
    user?.isSecondaryParent ||
    user?.isCoParent ||
    user?.role === "co_parent" ||
    user?.role === "secondary_parent" ||
    user?.primary_parent_id
  );

  const fetchSecondaryParents = async () => {
    try {
      const res = await apiFetch("/api/users/parent/secondary-parents");
      const json = await res.json();
      if (json.success && json.data?.secondaryParents) {
        setSecondaryParents(json.data.secondaryParents);
      }
    } catch (e) {
      console.error("Failed to load secondary parents", e);
    }
  };

  const handleAddCoParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCoParent) {
      setCoParentError("To add a new child or modify family settings, please log in using the Primary Parent account.");
      return;
    }
    setCoParentError("");
    const cleanM = coParentMobile.replace(/\D/g, "");
    if (!cleanM || cleanM.length !== 10) {
      setCoParentError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!/^[6-9]/.test(cleanM)) {
      setCoParentError("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }

    const primaryM = (user?.mobile || "").replace(/\D/g, "").slice(-10);
    if (primaryM.length === 10 && cleanM === primaryM) {
      setCoParentError("This phone number is already registered in the system");
      setIsCoParentMobileRegisteredInDb(true);
      return;
    }

    if (secondaryParents.some((sp: any) => (sp.mobile || "").replace(/\D/g, "").slice(-10) === cleanM)) {
      setCoParentError("This phone number is already registered in the system");
      setIsCoParentMobileRegisteredInDb(true);
      return;
    }

    if (isCoParentMobileRegisteredInDb) {
      setCoParentError("This phone number is already registered in the system");
      return;
    }

    const isMinLength = coParentPassword.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(coParentPassword);

    if (!isMinLength || !hasSpecialChar) {
      setCoParentError("Please meet all password requirements (at least 8 characters and a special symbol).");
      return;
    }

    if (coParentPassword !== coParentConfirmPassword) {
      setCoParentError("Passwords do not match.");
      return;
    }

    setIsSavingCoParent(true);
    try {
      const res = await apiFetch("/api/users/parent/secondary-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: coParentName.trim() || "Co-Parent",
          mobile: cleanM,
          password: coParentPassword.trim(),
          relationship: coParentRel
        })
      });
      const json = await res.json();
      setIsSavingCoParent(false);
      if (res.ok && json.success) {
        showNotificationToast({
          title: "Co-Parent Added",
          message: `${coParentRel} credentials created successfully! 👨‍👩‍👧`,
          type: "success"
        });
        setShowAddCoParent(false);
        setCoParentName("");
        setCoParentMobile("");
        setCoParentPassword("");
        setCoParentConfirmPassword("");
        setIsCoParentMobileRegisteredInDb(false);
        setIsCheckingCoParentMobile(false);
        fetchSecondaryParents();
        if (json.data?.user) {
          localStorage.setItem("userData", JSON.stringify(json.data.user));
          setUser(json.data.user);
          window.dispatchEvent(new Event("userDataUpdated"));
        }
      } else {
        const errorMsg = json.detail || json.message || "Failed to create co-parent account.";
        setCoParentError(errorMsg);
        if (errorMsg === "This phone number is already registered in the system" || /already registered/i.test(errorMsg)) {
          setIsCoParentMobileRegisteredInDb(true);
        }
      }
    } catch (e: any) {
      setIsSavingCoParent(false);
      setCoParentError("Connection error while creating co-parent account. Please try again.");
    }
  };

  const confirmDeleteCoParent = async () => {
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
    if (!coParentDeleteId) return;
    const parentId = coParentDeleteId;
    setShowDeleteCoParentModal(false);
    setCoParentDeleteId(null);
    try {
      const res = await apiFetch(`/api/users/parent/secondary-parent/${parentId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        showNotificationToast({
          title: "Co-Parent Removed",
          message: "Secondary parent removed from household.",
          type: "success"
        });
        fetchSecondaryParents();
        if (json.data?.user) {
          localStorage.setItem("userData", JSON.stringify(json.data.user));
          setUser(json.data.user);
          window.dispatchEvent(new Event("userDataUpdated"));
        }
      } else {
        showNotificationToast({
          title: "Removal Failed",
          message: json.detail || json.message || "Failed to remove co-parent.",
          type: "warning"
        });
      }
    } catch (e) {
      showNotificationToast({
        title: "Error",
        message: "Failed to connect to server.",
        type: "error"
      });
    }
  };

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
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
        fetchNotifications();
        fetchSecondaryParents();
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
          fetchNotifications(u.activeChildId);
          fetchSecondaryParents();
        } catch (e) { }
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
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
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

      showNotificationToast({
        title: "Settings Saved",
        message: "All profiles updated successfully! 🎉",
        type: "success"
      });

      // Go back to main settings tab
      setTimeout(() => {
        setActiveTab("main");
      }, 1000);
    } catch (e: any) {
      console.error(e);
      showNotificationToast({
        title: "Update Failed",
        message: e.message || "Failed to update profiles",
        type: "error"
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
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
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
    try {
      const res = await apiFetch("/api/parent/reset-journey", {
        method: "POST"
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem("userData");
        sessionStorage.clear();
        showNotificationToast({
          title: "Reset Successful",
          message: "Journey reset successfully! 🚀",
          type: "success"
        });
        setShowResetModal(false);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        showNotificationToast({
          title: "Reset Failed",
          message: json.message || "Failed to reset journey",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Failed to reset journey", err);
      showNotificationToast({
        title: "Error",
        message: "An error occurred while resetting journey.",
        type: "error"
      });
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logoutUser(navigate);
  };

  const requestDeleteChild = (childId: string) => {
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
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

        showNotificationToast({
          title: "Profile Deleted",
          message: "Child profile deleted successfully! 🗑️",
          type: "success"
        });
      } else {
        showNotificationToast({
          title: "Delete Failed",
          message: json.message || "Failed to delete child profile",
          type: "error"
        });
      }
    } catch (e: any) {
      console.error(e);
      showNotificationToast({
        title: "Delete Failed",
        message: e.message || "Failed to delete child profile",
        type: "error"
      });
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
    if (isCoParent) {
      showNotificationToast({
        title: "Permission Denied",
        message: "To add a new child or modify family settings, please log in using the Primary Parent account.",
        type: "warning"
      });
      return;
    }
    setChildIdToRegen(childId);
    setRegenConfirmOpen(true);
  };

  const confirmRegenCode = async () => {
    if (!childIdToRegen) return;
    const childId = childIdToRegen;
    setRegenConfirmOpen(false);
    setChildIdToRegen(null);
    try {
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
        showNotificationToast({
          title: "Code Regenerated",
          message: "Device code regenerated successfully! 🔑",
          type: "success"
        });
      } else {
        showNotificationToast({
          title: "Regenerate Failed",
          message: json.detail || json.message || "Failed to regenerate code.",
          type: "warning"
        });
      }
    } catch (e) {
      showNotificationToast({
        title: "Connection Error",
        message: "Error connecting to server.",
        type: "error"
      });
    }
  };

  const isScreenTimeOn = screenTimeMinutes > 0 && screenTimeMinutes < 9999;

  return (
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-clip font-sans">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] flex items-center justify-between px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              if (activeTab === "profile") {
                setActiveTab("main");
              } else {
                navigate(-1);
              }
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/80 overflow-hidden bg-white shrink-0 shadow-2xs">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src={parentPhoto || `https://ui-avatars.com/api/?name=Parent&background=random`}
            />
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">
            {activeTab === "profile" ? t("profile_settings", "Profile Settings") : t("settings", "Settings")}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("main")}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 shadow-2xs text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => {
              setShowNotifications(true);
              markAllNotifsRead();
            }}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg mx-auto pt-3 sm:pt-4 pb-4 px-4 sm:px-5 flex flex-col gap-3.5 relative z-10"
      >
        {activeTab === "main" ? (
          <>
            {/* Profile Settings Option Card */}
            <motion.div
              variants={itemVariants}
              onClick={() => setActiveTab("profile")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#141779]">{t('profile_settings', 'Profile Settings')}</h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{t('manage_parent_kids_profiles', 'Manage parent and kids profiles')}</p>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 group-hover:translate-x-1 transition-transform relative z-10 shrink-0">
                <ArrowLeft size={16} className="text-[#141779] rotate-180" />
              </div>
            </motion.div>

            {/* Screen Time Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006a62] shrink-0">
                    <Timer size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#141779]">{t('screen_time_limit', 'Screen Time Limit')}</h2>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">{t('manage_app_usage_duration', 'Manage app usage duration')}</p>
                  </div>
                </div>
                <CustomSwitch checked={isScreenTimeOn} onChange={(v) => {
                  const val = v ? 60 : 9999;
                  setScreenTimeMinutes(val);
                  updateSetting("screenTimeMinutes", val);
                }} />
              </div>

              {isScreenTimeOn ? (
                <div className="mt-1 flex flex-col gap-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl sm:text-3xl font-black text-[#006a62]">{screenTimeMinutes} <span className="text-xs font-extrabold text-slate-600">{t('minutes_per_day', 'Minutes / Day')}</span></span>
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
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a62]"
                  />
                  <div className="flex justify-between text-[11px] font-black text-slate-500 px-1">
                    <span>5m</span>
                    <span>30m</span>
                    <span>60m</span>
                    <span>90m</span>
                    <span>120m</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p className="font-black text-[#141779] text-xs sm:text-sm">{t('screen_time_unlimited', 'Screen Time is Unlimited')}</p>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{t('screen_time_unlimited_sub', 'Your child can use the app without any time restrictions.')}</p>
                </div>
              )}
            </motion.div>

            {/* Subject Restrictions */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#30007f] shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#141779]">{t('subject_focus', 'Subject Focus')}</h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{t('restrict_access_subjects', 'Restrict access to certain subjects')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-0.5">
                {subjects.length > 0 ? subjects.map((subject, i) => (
                  <div key={i} className="flex justify-between items-center p-3 sm:p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">
                        {subject.toLowerCase().includes("math") ? "➗" :
                          subject.toLowerCase().includes("science") ? "🔬" :
                            subject.toLowerCase().includes("english") || subject.toLowerCase().includes("language") ? "📚" : "📖"}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#141779]">{t(subject.toLowerCase(), { defaultValue: subject })}</span>
                    </div>
                    <CustomSwitch
                      checked={!restrictedSubjects[subject]}
                      onChange={(v) => toggleSubjectRestriction(subject, !v)}
                    />
                  </div>
                )) : (
                  <div className="text-center py-3 text-slate-500 font-bold text-xs">
                    {t('no_subjects_found', 'No subjects found for current standard.')}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Language Settings */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5 relative z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#141779]">{t("language_settings", "Language Settings")}</h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{t("manage_language_pref", "Manage app & lesson language preferences")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-[#141779]">{t("app_language", "App Display Language")}</span>
                    <span className="text-xs font-bold text-slate-600">{t("select_language", "Select your preferred language")}</span>
                  </div>
                  <LanguageDropdown
                    value={(i18n?.language || "en").split('-')[0]}
                    onChange={(val: string) => {
                      localStorage.setItem('i18nextLng', val);
                      localStorage.setItem('userLanguage', val);
                      if (i18n && typeof i18n.changeLanguage === 'function') {
                        i18n.changeLanguage(val);
                      }
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

            {/* Logout Option */}
            <motion.button
              variants={itemVariants}
              onClick={() => setShowLogoutModal(true)}
              disabled={isLoggingOut}
              className="bg-rose-50/90 hover:bg-rose-100 rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-2xs flex items-center gap-3.5 text-left transition-colors w-full disabled:opacity-60 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut size={20} className="text-rose-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-black text-rose-700">
                  {isLoggingOut ? t('logging_out', 'Logging out...') : (t('logout') || "Logout")}
                </h2>
                <p className="text-xs font-bold text-rose-800/70 mt-0.5">{t('sign_out_account', 'Sign out of your account')}</p>
              </div>
            </motion.button>
          </>
        ) : (
          <>
            {/* Informational Banner for Co-Parents */}
            {isCoParent && (
              <motion.div variants={itemVariants} className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-2xs mb-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-amber-950">Co-Parent (View-Only Access)</span>
                    <span className="text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900">Restricted</span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 font-medium leading-relaxed">
                    To add a new child or modify family settings, please log in using the Primary Parent account.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Parent Profile Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
              <h3 className="text-base sm:text-lg font-black text-[#141779] flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#006a62]" /> {t("parent_profile", "Parent Profile")}
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center text-3xl overflow-hidden cursor-pointer group/parentphoto shrink-0">
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

                <div className="flex-1 w-full flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">{t("parent_name_label", "Parent Name")}</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={t("enter_parent_name", "Enter Parent Name")}
                    className="w-full h-11 bg-slate-50 rounded-xl px-4 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-2xs"
                  />
                </div>
              </div>
            </motion.div>

            {/* Child 1 Profile Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-black text-[#141779] flex items-center gap-2">
                  <UserRound size={20} className="text-[#141779]" /> {t("child_1_profile", "Child 1 Profile")}
                </h3>
                {hasChild2 && !isCoParent && (
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

              <div className="flex flex-col gap-3.5">
                {/* Child 1 Photo */}
                <div className="flex flex-col items-center">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer group/c1photo">
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
                  <span className="text-xs font-black text-slate-500 mt-1">{t("tap_photo_to_edit", "Tap photo to edit")}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">{t("child_name_label", "Child Name")}</label>
                  <input
                    type="text"
                    value={child1Name}
                    onChange={(e) => setChild1Name(e.target.value)}
                    placeholder={t("enter_child_name", "Enter Child Name")}
                    className="w-full h-11 bg-slate-50 rounded-xl px-4 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-2xs"
                  />
                </div>

                <CustomDropdown
                  label={t("education_board", "Education Board")}
                  icon={BookOpen}
                  iconColor="#006a62"
                  value={child1Board}
                  options={boards}
                  onSelect={setChild1Board}
                  placeholder={t("select_board", "Select Board")}
                />

                <div className="flex gap-3 w-full relative z-10">
                  <CustomDropdown
                    label={t("class_grade", "Class / Grade")}
                    icon={GraduationCap}
                    iconColor="#30007f"
                    value={child1Class}
                    options={classes}
                    onSelect={setChild1Class}
                    placeholder={t("select", "Select")}
                  />

                  <CustomDropdown
                    label={t("age", "Age")}
                    icon={Cake}
                    iconColor="#141779"
                    value={child1Age}
                    options={ages}
                    onSelect={setChild1Age}
                    placeholder={t("select", "Select")}
                  />
                </div>

                <div className="flex flex-col gap-1.5 mt-0.5">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">{t("child_device_code_label", "Child Device Code (Scholar Login)")}</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black tracking-widest text-[#141779]">
                      {child1Code || "N/A"}
                    </span>
                    {!isCoParent ? (
                      <button
                        type="button"
                        onClick={() => requestRegenCode("child_1")}
                        className="px-3 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-[#141779] border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        {t("regenerate", "Regenerate")}
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Lock size={12} /> View-only
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Child 2 Profile Card (if exists) */}
            {hasChild2 ? (
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-black text-[#141779] flex items-center gap-2">
                    <UserRound size={20} className="text-[#141779]" /> Child 2 Profile
                  </h3>
                  {!isCoParent && (
                    <button
                      type="button"
                      onClick={deleteChild2Click}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove second child details"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer group/c2photo">
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
                    <span className="text-xs font-black text-slate-500 mt-1">Tap photo to edit</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Name</label>
                    <input
                      type="text"
                      value={child2Name}
                      onChange={(e) => setChild2Name(e.target.value)}
                      className="w-full h-11 bg-slate-50 rounded-xl px-4 text-sm font-extrabold text-slate-800 border border-slate-200 focus:border-[#141779] outline-none shadow-2xs"
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

                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider ml-1">Child Device Code (Scholar Login)</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                      <span className="text-base sm:text-lg font-black tracking-widest text-[#141779]">
                        {child2Code || "N/A"}
                      </span>
                      {!isCoParent ? (
                        <button
                          type="button"
                          onClick={() => requestRegenCode("child_2")}
                          className="px-3 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-[#141779] border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          Regenerate
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Lock size={12} /> View-only
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : isCoParent ? (
              <motion.div variants={itemVariants} className="w-full flex flex-col gap-1.5">
                <button
                  type="button"
                  disabled
                  title="To add a new child or modify family settings, please log in using the Primary Parent account."
                  className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-black text-sm flex items-center justify-center gap-2 bg-slate-50 cursor-not-allowed opacity-80"
                >
                  <Lock size={18} className="text-slate-400" />
                  <span>Add Second Child Profile</span>
                </button>
                <p className="text-xs text-center text-amber-800 font-semibold flex items-center justify-center gap-1">
                  <AlertTriangle size={12} />
                  To add a new child or modify family settings, please log in using the Primary Parent account.
                </p>
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
                className="w-full py-3.5 border-2 border-dashed border-[#141779]/30 rounded-2xl text-[#141779] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#141779]/5 transition-all bg-white cursor-pointer"
              >
                <Plus size={20} />
                <span>Add Second Child Profile</span>
              </motion.button>
            )}

            {/* Secondary Parent / Guardian (Co-Parent) Card - Clean & Proportional */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0">
                    <Users size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-[#141779] truncate">
                      Co-Parents & Guardians
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      Manage independent logins for co-parents & family guardians
                    </p>
                  </div>
                </div>

                {isCoParent ? (
                  <button
                    type="button"
                    disabled
                    title="To add a new child or modify family settings, please log in using the Primary Parent account."
                    className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 cursor-not-allowed shrink-0"
                  >
                    <Lock size={13} />
                    <span>Primary Parent Only</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCoParentError("");
                      setCoParentName("");
                      setCoParentMobile("");
                      setCoParentPassword("");
                      setCoParentConfirmPassword("");
                      setCoParentRel("Mother");
                      setShowAddCoParent(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#141779] hover:bg-[#1c1970] active:scale-95 text-white rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Plus size={15} />
                    <span>Add Co-Parent</span>
                  </button>
                )}
              </div>

              {/* Display Existing Secondary Parents */}
              {secondaryParents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {secondaryParents.map((sp: any) => (
                    <div key={sp.parentId} className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-[#141779] flex items-center justify-center font-black text-xs shrink-0">
                          {sp.fullName ? sp.fullName.slice(0, 1).toUpperCase() : "P"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-black text-slate-900 truncate">{sp.fullName}</span>
                            <span className="text-xs font-black uppercase tracking-wider bg-indigo-50 text-[#141779] px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                              {sp.relationship}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5 truncate">
                            <Phone size={10} className="text-slate-400 shrink-0" /> +91 {sp.mobile}
                          </span>
                        </div>
                      </div>
                      {!isCoParent && (
                        <button
                          type="button"
                          onClick={() => {
                            setCoParentDeleteId(sp.parentId);
                            setShowDeleteCoParentModal(true);
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                          title="Remove secondary parent"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2.5 px-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                  <span>No secondary co-parent accounts linked yet.</span>
                </div>
              )}
            </motion.div>

            {/* Save Profiles Button */}
            <motion.div variants={itemVariants} className="mt-1">
              {isCoParent ? (
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    disabled
                    title="To add a new child or modify family settings, please log in using the Primary Parent account."
                    className="w-full h-12 sm:h-13 bg-slate-200 text-slate-400 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 font-black text-sm sm:text-base cursor-not-allowed opacity-80"
                  >
                    <Lock size={18} />
                    <span>View-Only Mode</span>
                  </button>
                  <p className="text-xs text-center text-amber-800 font-semibold">
                    To add a new child or modify family settings, please log in using the Primary Parent account.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveConfirmModal(true)}
                  disabled={isSavingProfile}
                  className="w-full h-12 sm:h-13 bg-[#141779] hover:bg-[#1e23a0] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all disabled:opacity-70 text-white font-black text-sm sm:text-base cursor-pointer"
                >
                  <span>{isSavingProfile ? "Saving Profiles..." : "Save Profiles"}</span>
                  {!isSavingProfile && <Save size={18} color="white" />}
                </button>
              )}
            </motion.div>
          </>
        )}
      </motion.main>

      {/* Delete Co-Parent Modal */}
      <UnifiedConfirmModal
        isOpen={showDeleteCoParentModal}
        onClose={() => setShowDeleteCoParentModal(false)}
        onConfirm={confirmDeleteCoParent}
        title="Remove Co-Parent?"
        message="Are you sure you want to remove this secondary parent from your family household? Their login credentials will be revoked."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 size={28} className="text-rose-500" />}
      />

      {/* Save Profile Confirmation Modal */}
      <UnifiedConfirmModal
        isOpen={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        onConfirm={() => {
          setShowSaveConfirmModal(false);
          handleSaveProfiles();
        }}
        title="Save Profile Changes?"
        message="Are you sure you want to save all changes made to your parent and child profiles?"
        confirmText="Yes, Save Profiles"
        cancelText="Cancel"
        variant="primary"
        loading={isSavingProfile}
        icon={<Save size={28} className="text-[#141779]" />}
      />

      {/* Reset Modal */}
      <UnifiedConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetJourney}
        title="Wipe All Data?"
        message={
          <span>
            This action is <span className="font-black text-rose-600">irreversible</span>. It will permanently delete all coins, level achievements, completed chapters, and badges.
          </span>
        }
        confirmText="Yes, Wipe Data"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 size={28} className="text-rose-600" />}
      />

      {/* Custom Logout Modal */}
      <UnifiedConfirmModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
        title={t('logout') || "Logout"}
        message={t('logout_confirm_msg', 'Are you sure you want to log out? You will need your credentials to log back in.')}
        confirmText={isLoggingOut ? t('logging_out', 'Logging out...') : (t('yes_logout', 'Yes, Logout'))}
        cancelText={t('cancel', 'Cancel')}
        variant="danger"
        icon={<LogOut size={28} className="text-rose-600" />}
      />

      {/* Custom Delete Confirmation Modal */}
      <UnifiedConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setChildIdToDelete(null);
        }}
        onConfirm={confirmDeleteChild}
        title="Delete Profile"
        message="Are you sure you want to delete this child profile? All progress for this child will be permanently lost."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 size={28} className="text-rose-600" />}
      />

      {/* Custom Regenerate Code Confirmation Modal */}
      <UnifiedConfirmModal
        isOpen={regenConfirmOpen}
        onClose={() => {
          setRegenConfirmOpen(false);
          setChildIdToRegen(null);
        }}
        onConfirm={confirmRegenCode}
        title="Regenerate Device Code"
        message="Are you sure you want to regenerate a new random device code for this child? The old code will stop working immediately."
        confirmText="Yes, Regenerate"
        cancelText="Cancel"
        variant="primary"
        icon={<RefreshCw size={28} className="text-[#141779]" />}
      />

      {/* Delete Co-Parent Confirmation Modal */}
      <UnifiedConfirmModal
        isOpen={showDeleteCoParentModal}
        onClose={() => {
          setShowDeleteCoParentModal(false);
          setCoParentDeleteId(null);
        }}
        onConfirm={confirmDeleteCoParent}
        title="Remove Co-Parent"
        message="Are you sure you want to remove this secondary parent? They will no longer be able to log in to access this household."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 size={28} className="text-rose-600" />}
      />

      {/* Add Co-Parent / Guardian Modal */}
      <AnimatePresence>
        {showAddCoParent && (() => {
          const cleanInputM = coParentMobile.replace(/\D/g, "");
          const primaryCleanM = (user?.mobile || "").replace(/\D/g, "").slice(-10);
          const isSameAsPrimary = cleanInputM.length === 10 && primaryCleanM.length === 10 && cleanInputM === primaryCleanM;
          const isDuplicateCoParent = cleanInputM.length === 10 && secondaryParents.some(
            (sp: any) => (sp.mobile || "").replace(/\D/g, "").slice(-10) === cleanInputM
          );
          const isDuplicateNumber = isSameAsPrimary || isDuplicateCoParent || isCoParentMobileRegisteredInDb;
          const isPhoneValid = cleanInputM.length === 10 && /^[6-9]/.test(cleanInputM) && !isDuplicateNumber && !isCheckingCoParentMobile;

          // Exact same validation rules as signup (SignupStep3.tsx)
          const isMinLength = coParentPassword.length >= 8;
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(coParentPassword);
          const passwordsMatch = coParentPassword.length > 0 && coParentPassword === coParentConfirmPassword;
          const isFormValid = isPhoneValid && coParentName.trim().length > 0 && isMinLength && hasSpecialChar && passwordsMatch;

          return (
            <div 
              className="fixed inset-0 bg-[#0f114a]/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-200"
              style={{ touchAction: "none" }}
              onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
                className="bg-white rounded-2xl max-w-sm w-full flex flex-col p-4 sm:p-5 shadow-2xl relative border border-white/60 overflow-hidden text-slate-900 max-h-[92vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shrink-0 text-base">
                      👨‍👩‍👧
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#141779] leading-tight">
                        Add Co-Parent
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Create login credentials for guardian
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCoParent(false);
                      setCoParentError("");
                      setIsCoParentMobileRegisteredInDb(false);
                      setIsCheckingCoParentMobile(false);
                    }}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleAddCoParent} className="py-3 space-y-3">
                  {/* Server Error Alert Banner */}
                  {coParentError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-rose-700 font-bold leading-tight">{coParentError}</span>
                    </div>
                  )}

                  {/* Relationship Pills */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-0.5">
                      Relationship
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: "Mother", label: "Mother" },
                        { id: "Father", label: "Father" },
                        { id: "Guardian", label: "Guardian" },
                        { id: "Tutor", label: "Tutor" },
                      ].map((rel) => {
                        const isSelected = coParentRel === rel.id;
                        return (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => setCoParentRel(rel.id)}
                            className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${isSelected
                                ? "bg-[#141779] text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-[#141779]"
                              }`}
                          >
                            {rel.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={coParentName}
                      onChange={(e) => {
                        setCoParentName(e.target.value);
                        if (coParentError) setCoParentError("");
                      }}
                      className="w-full h-9 bg-slate-50 rounded-xl px-3 text-xs font-bold text-slate-900 border border-slate-200 focus:bg-white focus:border-[#141779] outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Mobile Number with Live Registered Check */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-black text-slate-500 uppercase tracking-wider ml-0.5">
                        Mobile Number
                      </label>
                      {cleanInputM.length > 0 && (
                        <span className={`font-bold ${isDuplicateNumber ? "text-amber-600" : isPhoneValid ? "text-emerald-600" : "text-slate-400"}`}>
                          {cleanInputM.length}/10
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-black text-slate-400 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={coParentMobile}
                        onChange={(e) => {
                          setCoParentMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                          if (coParentError) setCoParentError("");
                        }}
                        className={`w-full h-9 bg-slate-50 rounded-xl pl-10 pr-8 text-xs font-bold text-slate-900 border transition-colors outline-none focus:bg-white ${isDuplicateNumber
                            ? "border-amber-400 bg-amber-50/30 focus:border-amber-500"
                            : cleanInputM.length === 10 && /^[6-9]/.test(cleanInputM) && !isCheckingCoParentMobile
                              ? "border-emerald-300 focus:border-emerald-500"
                              : "border-slate-200 focus:border-[#141779]"
                          }`}
                        required
                      />
                      {isCheckingCoParentMobile && (
                        <span className="absolute right-2.5 flex items-center text-slate-400">
                          <Loader2 size={14} className="animate-spin text-[#141779]" />
                        </span>
                      )}
                    </div>

                    {/* Duplicate Phone Number Warning Callout */}
                    {isDuplicateNumber && (
                      <p className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded-lg p-2 leading-tight">
                        ⚠️ This phone number is already registered in the system
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-0.5">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showCoParentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={coParentPassword}
                        onChange={(e) => {
                          setCoParentPassword(e.target.value);
                          if (coParentError) setCoParentError("");
                        }}
                        className="w-full h-9 bg-slate-50 rounded-xl pl-3 pr-9 text-xs font-bold text-slate-900 border border-slate-200 focus:bg-white focus:border-[#141779] outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCoParentPassword(!showCoParentPassword)}
                        className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showCoParentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-0.5">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showCoParentConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={coParentConfirmPassword}
                        onChange={(e) => {
                          setCoParentConfirmPassword(e.target.value);
                          if (coParentError) setCoParentError("");
                        }}
                        className="w-full h-9 bg-slate-50 rounded-xl pl-3 pr-9 text-xs font-bold text-slate-900 border border-slate-200 focus:bg-white focus:border-[#141779] outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCoParentConfirmPassword(!showCoParentConfirmPassword)}
                        className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showCoParentConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Validation Rules (Exactly matching SignupStep3) */}
                  <div className="flex flex-col gap-1.5 pt-1 pb-1 bg-slate-50/60 rounded-xl p-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      {isMinLength ? (
                        <CheckCircle2 size={16} color="#007168" className="fill-transparent shrink-0" />
                      ) : (
                        <Circle size={16} color="#c7c5d4" className="shrink-0" />
                      )}
                      <span className={`text-xs font-bold ${isMinLength ? "text-emerald-700" : "text-[#767683]"}`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSpecialChar ? (
                        <CheckCircle2 size={16} color="#007168" className="fill-transparent shrink-0" />
                      ) : (
                        <Circle size={16} color="#c7c5d4" className="shrink-0" />
                      )}
                      <span className={`text-xs font-bold ${hasSpecialChar ? "text-emerald-700" : "text-[#767683]"}`}>
                        Include a special symbol
                      </span>
                    </div>
                    {coParentConfirmPassword.length > 0 && (
                      <div className="flex items-center gap-2">
                        {passwordsMatch ? (
                          <CheckCircle2 size={16} color="#007168" className="fill-transparent shrink-0" />
                        ) : (
                          <Circle size={16} color="#ef4444" className="shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${passwordsMatch ? "text-emerald-700" : "text-rose-600"}`}>
                          {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCoParent(false);
                        setCoParentError("");
                        setIsCoParentMobileRegisteredInDb(false);
                        setIsCheckingCoParentMobile(false);
                      }}
                      className="flex-1 h-9 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingCoParent || !isFormValid}
                      className="flex-1 h-9 bg-[#141779] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#1c1970] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingCoParent ? "Saving..." : "Save Co-Parent"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>


      {/* Notifications Side Panel / Modal Drawer */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex justify-end animate-in fade-in duration-200"
          style={{ touchAction: "none" }}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div 
            className="w-full sm:w-[420px] h-full bg-[#f7f9fb] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            style={{ overscrollBehavior: "contain" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200/80 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779]">
                  <Bell size={18} />
                </div>
                <h2 className="text-xl font-black text-[#141779]">
                  {t("notifications", "Notifications")}
                </h2>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] mb-3 shadow-xs">
                    <Bell size={28} className="opacity-70" />
                  </div>
                  <p className="text-base font-bold text-[#141779]">
                    {t("no_notifications_yet", "No notifications yet!")}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1 max-w-[240px]">
                    {t("no_recent_activity", "No recent activity to show.")}
                  </p>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  let iconBadge = <Bell size={18} />;
                  let badgeStyle = "bg-indigo-50 text-[#141779] border-indigo-100";

                  if (notif.type === "gamification") {
                    iconBadge = <Sparkles size={18} />;
                    badgeStyle = "bg-teal-50 text-teal-700 border-teal-200";
                  } else if (notif.type === "habit") {
                    iconBadge = <Flame size={18} />;
                    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                  } else if (notif.type === "learning") {
                    iconBadge = <BookOpen size={18} />;
                    badgeStyle = "bg-indigo-50 text-[#141779] border-indigo-200";
                  } else if (notif.type === "reward" || notif.type === "spin") {
                    iconBadge = <Trophy size={18} />;
                    badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
                  } else if (notif.type === "warning" || notif.type === "risk") {
                    iconBadge = <AlertTriangle size={18} />;
                    badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
                  }

                  return (
                    <div
                      key={notif._id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(20,23,121,0.04)] hover:shadow-md hover:border-indigo-200/80 transition-all flex items-start gap-3.5 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${badgeStyle}`}>
                        {iconBadge}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-[15px] font-bold text-[#141779] leading-snug">
                            {formatNotifTitle(notif.title)}
                          </h4>
                          {notif.createdAt && (
                            <span className="text-xs font-semibold text-slate-500 shrink-0 mt-0.5">
                              {new Date(notif.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-medium text-[#191c1e] leading-relaxed mt-1">
                          {formatNotifMsg(notif.message)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
