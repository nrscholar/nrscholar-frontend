import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NRScholarNavBrand } from "../../../components/NRScholarNavBrand";
import { Rocket, ArrowLeft, Lock, Shield, Eye, EyeOff, CheckCircle2, Circle, XCircle, Sparkles, PartyPopper, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";
import { getSignupState, clearSignupState } from "../signupState";
import { showInteractiveNotification, registerPushNotificationToken } from "../../../services/pushNotificationService";
import { progressFillStyle } from "../../../utils/progressBar";

export default function SignupStep3Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const saved = getSignupState();
  const fullName = searchParams.get("fullName") || saved.fullName || "";
  const rawMobile = searchParams.get("mobile") || saved.mobile || "";
  const cleanMobile = rawMobile.replace(/\D/g, "");
  const email = searchParams.get("email") || saved.email || "";
  const address = searchParams.get("address") || saved.address || "";

  const childName = searchParams.get("childName") || saved.childName || "";
  const selectedClass = searchParams.get("selectedClass") || saved.selectedClass || "";
  const board = searchParams.get("board") || saved.board || "";
  const dob = searchParams.get("dob") || saved.dob || "";
  const gender = searchParams.get("gender") || saved.gender || "";
  const schoolName = searchParams.get("schoolName") || saved.schoolName || "";
  const ageParam = searchParams.get("age") || saved.age || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Real-time password validation criteria
  const hasMinLength = password.length >= 8;
  const isMinLength = hasMinLength;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  // Password matching validation
  const hasConfirmValue = confirmPassword.length > 0;
  const isPasswordMatch = hasConfirmValue && password === confirmPassword;
  const isPasswordMismatch = hasConfirmValue && password !== confirmPassword;

  // Real-time strength score calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", colorBg: "bg-slate-200", colorText: "text-slate-400", width: "0%" };
    let points = 0;
    if (isMinLength) points += 1;
    if (password.length >= 10) points += 1;
    if (hasSpecialChar) points += 1;
    if (hasNumber) points += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;

    if (points <= 2) {
      return { score: 1, label: "Weak", colorBg: "bg-rose-500", colorText: "text-rose-600", width: "33%" };
    } else if (points <= 3) {
      return { score: 2, label: "Moderate", colorBg: "bg-amber-500", colorText: "text-amber-600", width: "66%" };
    } else {
      return { score: 3, label: "Strong", colorBg: "bg-emerald-500", colorText: "text-emerald-600", width: "100%" };
    }
  };

  const strength = getPasswordStrength();

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 8;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 8;
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return Math.max(1, calculatedAge);
  };

  // Auto redirect countdown when success modal is open
  useEffect(() => {
    if (!showSuccessModal) return;

    if (redirectCountdown <= 0) {
      navigate("/home", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSuccessModal, redirectCountdown, navigate]);

  const handleBack = () => {
    const params = new URLSearchParams(searchParams);
    const s = getSignupState();
    Object.entries(s).forEach(([k, v]) => {
      if (v && !params.get(k)) {
        params.set(k, String(v));
      }
    });
    navigate(`/signup-step2?${params.toString()}`);
  };
  const isMatching = confirmPassword.length > 0 && password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinLength) {
      setErrorMsg("Password must be at least 8 characters");
      return;
    }
    if (!hasSpecialChar) {
      setErrorMsg("Password must include at least one special symbol");
      return;
    }
    if (!confirmPassword) {
      setErrorMsg("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (dob && dob > today) {
      setErrorMsg("Child's date of birth cannot be in the future");
      return;
    }
    setErrorMsg("");

    const computedChildAge = dob ? calculateAge(dob) : (ageParam ? parseInt(ageParam, 10) : 8);

    const payload = {
      fullName,
      mobile: cleanMobile,
      email,
      parentEmail: email,
      address,
      password,
      childName,
      childAge: computedChildAge,
      childClass: selectedClass,
      childBoard: board,
      dob,
      childDob: dob,
      gender,
      childGender: gender,
      schoolName,
      childSchool: schoolName,
    };

    try {
      setLoading(true);
      const response = await apiFetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setLoading(false);
      
      if (data.success) {
        // 1. Save auth credentials in localStorage
        localStorage.setItem("userToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(data.data.user));

        // 2. Clear intermediate signup session state
        clearSignupState();

        // 3. Trigger immediate interactive Push Notification
        showInteractiveNotification(
          "Welcome to NR Scholar!",
          "Your account is ready.",
          "/home",
          "success"
        );

        // Register push token in background if permitted
        registerPushNotificationToken().catch(() => {});

        // 4. Open Profile Creation Success Modal
        setShowSuccessModal(true);
      } else {
        setErrorMsg(data.message || data.detail || "Signup failed. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Unable to connect. Is the server running?");
      setLoading(false);
    }
  };

  const isFormValid = isMinLength && hasSpecialChar && isPasswordMatch && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] via-[#f7f9fb] to-[#f7f9fb] font-sans relative pb-10 overflow-hidden">
      
      {/* Blurred decorative blobs */}
      <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-[rgba(87,250,233,0.1)] rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-[200px] h-[200px] bg-[rgba(191,194,255,0.2)] rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <NRScholarNavBrand onBack={handleBack} />
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto relative z-10">
        
        {/* Step Indicator */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#006a62] tracking-[1px]">STEP 3 OF 3</span>
            <span className="text-xs font-bold text-[#006a62]">100%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={progressFillStyle(100)} />
          </div>
        </div>

        <div className="flex flex-col items-center mb-6 w-full text-center">
          <h2 className="text-xl font-bold text-[#1e255e] text-center">
            Create Your Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 text-center mt-1.5 max-w-xs mx-auto">
            Choose a strong password to keep your account safe and secure.
          </p>
        </div>

        

        {/* Glass Form Card */}
        <div className="w-full bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          
          <form className="flex flex-col gap-5 mb-6" onSubmit={handleSignup}>
            
            {/* Create Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-3 mr-2">
                <label className="text-xs font-bold text-[#464652] tracking-[1px]">CREATE PASSWORD</label>
                {password && (
                  <span className={`text-xs font-bold ${strength.colorText}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock size={22} color="#767683" className="absolute left-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-12 pr-12 text-base font-medium text-[#191c1e] border-[1.5px] border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showPassword ? <Eye size={22} color="#767683" /> : <EyeOff size={22} color="#767683" />}
                </button>
              </div>

              {/* Real-time Strength Meter Bar */}
              {password && (
                <div className="w-full px-2 pt-1">
                  <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.colorBg} transition-all duration-300 rounded-full`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#464652] ml-3 tracking-[1px]">CONFIRM PASSWORD</label>
              <div className="relative flex items-center">
                <Shield size={22} color="#767683" className="absolute left-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-14 bg-white rounded-full pl-12 pr-12 text-base font-medium text-[#191c1e] border-[1.5px] transition-colors placeholder:text-[#c7c5d4] focus:outline-none ${
                    isPasswordMatch
                      ? "border-emerald-500 bg-emerald-50/20"
                      : isPasswordMismatch
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-[#c7c5d4] focus:border-[#141779]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showConfirmPassword ? <Eye size={22} color="#767683" /> : <EyeOff size={22} color="#767683" />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>

          {/* Password Validation Rules Checklist */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 px-2">
              {hasMinLength ? (
                <CheckCircle2 size={18} color="#007168" className="fill-[#007168]/10" />
              ) : (
                <Circle size={18} color="#c7c5d4" />
              )}
              <span className={`text-xs font-semibold ${hasMinLength ? "text-[#007168]" : "text-[#767683]"}`}>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2 px-2">
              {hasSpecialChar ? (
                <CheckCircle2 size={18} color="#007168" className="fill-[#007168]/10" />
              ) : (
                <Circle size={18} color="#c7c5d4" />
              )}
              <span className={`text-xs font-semibold ${hasSpecialChar ? "text-[#007168]" : "text-[#767683]"}`}>
                Include a special symbol (!@#$%^&*)
              </span>
            </div>

            <div className="flex items-center gap-2 px-2">
              {hasNumber ? (
                <CheckCircle2 size={18} color="#007168" className="fill-[#007168]/10" />
              ) : (
                <Circle size={18} color="#c7c5d4" />
              )}
              <span className={`text-xs font-semibold ${hasNumber ? "text-[#007168]" : "text-[#767683]"}`}>
                Include at least one number (0-9)
              </span>
            </div>

            <div className="flex items-center gap-2 px-2">
              {isPasswordMatch ? (
                <CheckCircle2 size={18} color="#007168" className="fill-[#007168]/10" />
              ) : isPasswordMismatch ? (
                <XCircle size={18} color="#ba1a1a" />
              ) : (
                <Circle size={18} color="#c7c5d4" />
              )}
              <span
                className={`text-xs font-semibold ${
                  isPasswordMatch
                    ? "text-[#007168]"
                    : isPasswordMismatch
                    ? "text-[#ba1a1a]"
                    : "text-[#767683]"
                }`}
              >
                Passwords must match
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full mt-6">
          {errorMsg && errorMsg !== "Passwords do not match" && (
            <div className="w-full bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-4 text-center animate-fadeIn">
              {errorMsg}
            </div>
          )}
          <button
            onClick={handleSignup}
            disabled={!isFormValid}
            className={`w-full h-[60px] bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_6px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!isFormValid) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-white text-xl font-bold">Submit</span>
                <Rocket size={22} color="white" />
              </>
            )}
          </button>
        </div>

      </main>

      {/* Engaging Profile Creation Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-[400px] bg-white rounded-[32px] p-7 shadow-[0_24px_60px_rgba(20,23,121,0.35)] border border-white flex flex-col items-center text-center overflow-hidden"
            >
              <button type="button" aria-label="Close" onClick={() => navigate("/home", { replace: true })} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[#464652] hover:bg-slate-100 transition-colors"><X size={20} /></button>
              {/* Decorative Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#57fae9]/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#141779]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Cosmic Badge Animation */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#141779] to-[#30007f] flex items-center justify-center shadow-[0_12px_24px_rgba(20,23,121,0.3)]">
                  <Rocket size={40} className="text-[#57fae9] -rotate-45" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#57fae9] flex items-center justify-center shadow-md">
                  <Sparkles size={18} className="text-[#141779]" />
                </div>
              </div>

              {/* Header Title */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
                <PartyPopper size={14} />
                <span>Account Created!</span>
              </div>

              <h3 className="text-2xl font-black text-[#141779] tracking-tight mb-2">
                Welcome to NR Scholar!
              </h3>
              
              <p className="text-sm font-medium text-[#464652] leading-relaxed mb-6">
                Your account is ready.
              </p>

              {/* Child Profile Confirmation Card */}
              <div className="w-full bg-[#f7f9fb] rounded-2xl p-4 border border-[#e0e3e5] mb-6 flex flex-col gap-2.5 text-left">
                <div className="text-[11px] font-bold text-[#767683] uppercase tracking-wider mb-0.5">
                  Registered Profile
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#464652]">Child Name</span>
                  <span className="font-bold text-[#141779]">{childName || "Student"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#464652]">Class & Board</span>
                  <span className="font-bold text-[#141779]">{selectedClass || "Class 3"} • {board || "CBSE"}</span>
                </div>
                {schoolName && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#464652]">School</span>
                    <span className="font-bold text-[#141779] truncate max-w-[180px]">{schoolName}</span>
                  </div>
                )}
              </div>

              {/* Primary Launch Action */}
              <button
                type="button"
                onClick={() => navigate("/home", { replace: true })}
                className="w-full h-14 bg-gradient-to-r from-[#141779] to-[#30007f] hover:opacity-95 text-white font-bold rounded-full shadow-[0_8px_20px_rgba(20,23,121,0.35)] flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]"
              >
                <span>Launch Cosmic Adventure</span>
                <Rocket size={20} color="white" />
              </button>

              {/* Auto Redirect Countdown */}
              <p className="mt-3 text-[11px] font-semibold text-slate-400">
                Entering dashboard in {redirectCountdown}s...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
