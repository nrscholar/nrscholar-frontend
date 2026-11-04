import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NRScholarNavBrand } from "../../../components/NRScholarNavBrand";
import { Rocket, ArrowLeft, Sparkles, UserRound, GraduationCap, ChevronDown, Check, BookOpen, Lock, Calendar, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSignupState, saveSignupState } from "../signupState";
import { showInteractiveNotification } from "../../../services/pushNotificationService";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options, onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const isBoard = label.toLowerCase().includes("board");
  const supportedBoards = ["CBSE (NCERT)", "GSEB", "CBSE"];

  return (
    <div className="flex flex-col gap-1.5 flex-1 relative min-w-0">
      <label className="text-sm font-semibold text-[#767683] ml-3 sm:ml-4 truncate">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-11 pr-8 sm:pl-12 sm:pr-10 text-sm sm:text-base font-medium text-[#191c1e] border-2 border-white flex items-center justify-start text-left relative focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20"
      >
        <div className="absolute left-3.5 sm:left-4 z-10 flex items-center h-full top-0 pointer-events-none text-[#1E255E]">
          <Icon size={20} strokeWidth={2} color={iconColor || "#1E255E"} className="text-[#1E255E]" />
        </div>
        <span className={`block flex-1 min-w-0 truncate ${value ? "text-[#191c1e]" : "text-[#c7c5d4]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={20} className="absolute right-3.5 sm:right-4 text-[#767683] pointer-events-none" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-6 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-[320px] bg-white rounded-3xl p-6 max-h-[65vh] flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#141779] mb-1 text-center">Select {label}</h3>
                {isBoard && (
                  <p className="text-[11px] font-semibold text-slate-400 text-center mb-3">
                    Only CBSE & GSEB are currently active
                  </p>
                )}
                <div className="overflow-y-auto pr-1">
                  {options.map((opt: string) => {
                    const isLocked = isBoard && !supportedBoards.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          if (isLocked) return;
                          onSelect(opt);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between py-3.5 px-2 border-b border-[#f2f4f6] last:border-0 rounded-xl transition-colors ${
                          isLocked ? 'opacity-40 cursor-not-allowed bg-slate-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-base ${isLocked ? 'text-slate-400 font-medium' : value === opt ? 'font-bold text-[#141779]' : 'font-medium text-[#464652]'}`}>
                            {opt}
                          </span>
                          {isLocked && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock size={10} /> Locked
                            </span>
                          )}
                        </div>
                        {value === opt && !isLocked && <Check size={20} color="#141779" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SignupStep2Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Format today's local date (YYYY-MM-DD) so future dates are strictly prohibited
  const getTodayLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isFutureDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const maxIso = new Date().toISOString().split("T")[0];
    const localStr = getTodayLocalDate();
    const threshold = localStr > maxIso ? localStr : maxIso;
    return dateStr > threshold;
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const minDateStr = new Date(new Date().getFullYear() - 20, 0, 1).toISOString().split("T")[0];

  const saved = getSignupState();
  const [childName, setChildName] = useState(() => searchParams.get("childName") || saved.childName || "");
  const [selectedClass, setSelectedClass] = useState(() => searchParams.get("selectedClass") || saved.selectedClass || "");
  const [selectedBoard, setSelectedBoard] = useState(() => searchParams.get("board") || saved.board || "");
  const [dob, setDob] = useState(() => {
    const raw = searchParams.get("dob") || saved.dob || "";
    return raw && !isFutureDate(raw) ? raw : "";
  });
  const [gender, setGender] = useState(() => searchParams.get("gender") || saved.gender || "");
  const [schoolName, setSchoolName] = useState(() => searchParams.get("schoolName") || saved.schoolName || "");
  const [errorMsg, setErrorMsg] = useState("");
  const dobInputRef = useRef<HTMLInputElement>(null);
  const [isDobFocused, setIsDobFocused] = useState(false);

  // Formats stored ISO date (YYYY-MM-DD) into clean presentation (DD/MM/YYYY)
  const formatDateDisplay = (isoDate: string): string => {
    if (!isoDate) return "";
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}/${m}/${y}`;
    }
    return isoDate;
  };

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const boards = ["CBSE (NCERT)", "GSEB", "ICSE", "State Board", "IB", "IGCSE"];

  // Automatically persist child data to sessionStorage so navigating back/forward retains all inputs
  useEffect(() => {
    saveSignupState({
      childName,
      selectedClass,
      board: selectedBoard,
      dob,
      gender,
      schoolName
    });
  }, [childName, selectedClass, selectedBoard, dob, gender, schoolName]);

  // Helper to dynamically calculate child's age in years from Date of Birth
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    if (birthDate > today) return 0;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  // Robust cross-platform validation helper to strictly block future dates on mobile (iOS/Android) and desktop
  const validateAndSetDob = (selectedDate: string, inputElement?: HTMLInputElement | null) => {
    const isRangeOverflow = Boolean(inputElement?.validity?.rangeOverflow);

    if (isRangeOverflow || (selectedDate && isFutureDate(selectedDate))) {
      setErrorMsg("Date of birth cannot be in the future");
      setDob("");
      if (inputElement) inputElement.value = "";
      if (dobInputRef.current) dobInputRef.current.value = "";
      try {
        showInteractiveNotification(
          "Invalid Date of Birth",
          "Date of birth cannot be in the future",
          undefined,
          "error"
        );
      } catch {}
      return;
    }

    if (errorMsg === "Date of birth cannot be in the future") {
      setErrorMsg("");
    }
    setDob(selectedDate);
    if (inputElement && inputElement.value !== selectedDate) {
      inputElement.value = selectedDate;
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetDob(e.target.value, e.target);
  };

  const handleDobInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    validateAndSetDob(target.value, target);
  };

  const handleBack = () => {
    saveSignupState({
      childName,
      selectedClass,
      board: selectedBoard,
      dob,
      gender,
      schoolName
    });
    const params = new URLSearchParams(searchParams);
    const s = getSignupState();
    if (s.fullName) params.set("fullName", s.fullName);
    if (s.mobile) params.set("mobile", s.mobile);
    if (s.email) params.set("email", s.email);
    if (s.address) params.set("address", s.address);
    navigate(`/signup-step1?${params.toString()}`);
  };

  const handleNext = () => {
    if (!childName.trim()) {
      setErrorMsg("Please enter child's name");
      return;
    }
    if (!selectedBoard) {
      setErrorMsg("Please select an education board");
      return;
    }
    if (!selectedClass) {
      setErrorMsg("Please select class/grade");
      return;
    }
    const currentInputValue = dobInputRef.current?.value || dob;
    if (!currentInputValue) {
      setErrorMsg("Please select child's date of birth");
      return;
    }
    if (isFutureDate(currentInputValue) || Boolean(dobInputRef.current?.validity?.rangeOverflow)) {
      setErrorMsg("Date of birth cannot be in the future");
      setDob("");
      if (dobInputRef.current) dobInputRef.current.value = "";
      try {
        showInteractiveNotification(
          "Invalid Date of Birth",
          "Date of birth cannot be in the future",
          undefined,
          "error"
        );
      } catch {}
      return;
    }
    if (!gender) {
      setErrorMsg("Please select child's gender");
      return;
    }
    if (!schoolName.trim()) {
      setErrorMsg("Please enter child's school name");
      return;
    }

    setErrorMsg("");
    const ageYears = calculateAge(dob);

    saveSignupState({
      childName: childName.trim(),
      selectedClass,
      board: selectedBoard,
      dob,
      gender,
      schoolName: schoolName.trim(),
      age: ageYears > 0 ? `${ageYears} Years` : ""
    });

    const params = new URLSearchParams(searchParams);
    params.set("childName", childName.trim());
    params.set("selectedClass", selectedClass);
    params.set("board", selectedBoard);
    params.set("dob", dob);
    params.set("gender", gender);
    params.set("schoolName", schoolName.trim());
    params.set("age", ageYears > 0 ? `${ageYears} Years` : "");

    navigate(`/signup-step3?${params.toString()}`);
  };

  const isDobValid = Boolean(dob && dob <= getTodayLocalDate());
  const isFormValid = childName.trim() && selectedBoard && selectedClass && isDobValid && gender && schoolName.trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#e8ddff] font-sans relative pb-10 overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute top-[25%] right-4 opacity-15 rotate-12 pointer-events-none">
        <Sparkles size={120} color="#006a62" />
      </div>
      <div className="absolute bottom-[25%] left-4 opacity-15 -rotate-12 pointer-events-none">
        <Rocket size={80} color="#30007f" />
      </div>

      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-[rgba(255,255,255,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-2 rounded-full bg-[#e0e0ff] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} color="#141779" />
          </button>
          <Rocket size={28} color="#141779" />
          <h1 className="text-[22px] font-bold text-[#141779] tracking-[-0.5px]">NR Scholar</h1>
        </div>
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto relative z-10">
        
        {/* Step Indicator */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#006a62] tracking-[1px]">STEP 2 OF 3</span>
            <span className="text-xs font-bold text-[#767683]">66%</span>
          </div>
          <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
            <div className="h-full bg-[#57fae9] rounded-full w-[66%]" />
          </div>
        </div>

        {/* Glass Content Card */}
        <div className="w-full bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
          
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-[28px] font-bold text-[#141779] mb-2 text-center">About Your Child</h2>
            <p className="text-base text-[#464652] font-medium text-center">
              Tell us about your child to personalize their learning journey.
            </p>
          </div>

          {errorMsg && (
            <div className="w-full bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-5 text-center">
              {errorMsg}
            </div>
          )}

          <form className="flex flex-col gap-4 mb-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            
            {/* Child's Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-4">Child's Name</label>
              <div className="relative w-full flex items-center">
                {/* Leading Icon (Left side, primary blue #1E255E) */}
                <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <UserRound size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Child Name"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-11 sm:pl-12 pr-5 text-base font-medium text-[#191c1e] border-2 border-white focus:outline-none focus:border-[#1E255E] focus:ring-2 focus:ring-[#1E255E]/20 transition-all placeholder:text-[#c7c5d4]"
                />
              </div>
            </div>

            {/* Board Selection */}
            <div className="flex flex-col gap-1.5">
              <CustomDropdown
                label="Education Board"
                icon={BookOpen}
                iconColor="#1E255E"
                value={selectedBoard}
                options={boards}
                onSelect={setSelectedBoard}
                placeholder="Select Board"
              />
            </div>

            {/* Side-by-Side Row for Class/Grade and Date of Birth */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 items-start">
              {/* Class Selection */}
              <div className="flex flex-col min-w-0">
                <CustomDropdown
                  label="Class/Grade"
                  icon={GraduationCap}
                  iconColor="#30007f"
                  value={selectedClass}
                  options={classes}
                  onSelect={setSelectedClass}
                  placeholder="Select"
                />
              </div>

              {/* Date of Birth (DOB) Selector */}
              <div className="flex flex-col gap-1.5 min-w-0 relative">
                <div className="flex items-center justify-between ml-3 mr-1">
                  <label className="text-sm font-semibold text-[#767683] truncate">Date of Birth</label>
                  {dob && calculateAge(dob) > 0 && (
                    <span className="text-[10px] font-bold text-[#006a62] bg-[#57fae9]/30 px-1.5 py-0.5 rounded-full shrink-0">
                      {calculateAge(dob)}y
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  {/* Presentation layer displaying 'DOB' in #c7c5d4 when empty matching other placeholders */}
                  <div
                    className={`w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-9 pr-7 sm:pl-11 sm:pr-9 text-xs sm:text-sm md:text-base font-medium border-2 flex items-center justify-start text-left relative pointer-events-none transition-colors ${
                      errorMsg.includes("future")
                        ? "border-[#ba1a1a] bg-[#ffdad6]/20"
                        : isDobFocused
                        ? "border-[#141779]"
                        : "border-white"
                    }`}
                  >
                    <div className="absolute left-3 sm:left-4 z-10 flex items-center h-full top-0">
                      <Calendar size={18} className="sm:w-5 sm:h-5" color="#141779" />
                    </div>
                    <span className={`block flex-1 min-w-0 truncate ${dob ? "text-[#191c1e]" : "text-[#c7c5d4]"}`}>
                      {dob ? formatDateDisplay(dob) : "DOB"}
                    </span>
                    <ChevronDown size={18} className="absolute right-2 sm:right-3 sm:w-5 sm:h-5" color="#767683" />
                  </div>

                  {/* Functional native HTML5 date input transparently layered on top */}
                  <input
                    ref={dobInputRef}
                    type="date"
                    value={dob}
                    max={new Date().toISOString().split('T')[0]}
                    min={minDateStr}
                    onChange={handleDobChange}
                    onInput={handleDobInput}
                    onFocus={() => setIsDobFocused(true)}
                    onBlur={(e) => {
                      setIsDobFocused(false);
                      // Extra validation check on blur when native mobile picker closes
                      validateAndSetDob(e.target.value, e.target);
                    }}
                    onClick={(e) => {
                      try {
                        (e.currentTarget as any).showPicker?.();
                      } catch {}
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Date of Birth (DOB)"
                  />
                </div>
                {errorMsg && errorMsg.includes("future") && (
                  <p className="text-[11px] font-semibold text-[#ba1a1a] ml-3 animate-pulse">
                    Date of birth cannot be in the future
                  </p>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-4">Child's Gender</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[rgba(255,255,255,0.4)] rounded-full border-2 border-white">
                {(["Male", "Female", "Other"] as const).map((g) => {
                  const isSelected = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`h-11 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-[#141779] text-white shadow-[0_2px_8px_rgba(20,23,121,0.25)]"
                          : "text-[#464652] hover:bg-white/60"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* School Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-4">School Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-12 pr-6 text-base font-medium text-[#191c1e] border-2 border-white focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <School size={22} color="#006a62" className="absolute left-4" />
              </div>
            </div>
            
          </form>

          {/* Primary Action */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!isFormValid) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            <span className="text-white text-lg font-semibold">Next Step</span>
            <Rocket size={22} color="white" />
          </button>
        </div>

        {/* Decorative Astronaut Image Badge */}
        <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-[rgba(42,221,205,0.15)] rounded-full border border-[rgba(255,255,255,0.4)]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO0uywXKeZFaBqTF0zxGYLlyFO5nR80YlXpDdDN-LCQQy02I46kxfNyZ_ABhaGtIpEj0rOByCUZ_exo_fZrWr1cMy6PDImMjt5Sb8TrJPYa8qz8QeYsSdo-0OwIMhnONQQfJUiM-qKOfYsDC6_TtusgxaiiYmoLaoCJzmQ1dIIKpgT_33IqngfJSAgfBPjexpOA7XmxxMUzeygwSz2xTNeeQmgK1GLBr1GKslEWUMfqNpVqmFJlUKqXLQgbyey9OnEtMGqDdBW-g" 
            alt="Astronaut Badge"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <span className="text-sm font-semibold text-[#005049] flex-1">
            Your learning journey is almost ready!
          </span>
        </div>

      </main>
    </div>
  );
}
