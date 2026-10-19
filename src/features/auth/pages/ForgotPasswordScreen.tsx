import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Rocket,
  ShieldCheck,
  Check,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

type Step = "REQUEST_OTP" | "VERIFY_OTP" | "RESET_PASSWORD" | "SUCCESS";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();

  // Current step state
  const [step, setStep] = useState<Step>("REQUEST_OTP");
  
  // Step 1: Mobile / Identifier
  const [mobile, setMobile] = useState("");
  
  // Step 2: OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(45);
  const [isResendActive, setIsResendActive] = useState(false);
  const [maskedMobile, setMaskedMobile] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Step 3: Password reset
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 4: Auto-redirect countdown
  const [redirectCount, setRedirectCount] = useState(5);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Countdown timer effect for Step 2 (Resend OTP)
  useEffect(() => {
    let interval: any = null;
    if (step === "VERIFY_OTP" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setIsResendActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Auto-redirect countdown effect on SUCCESS
  useEffect(() => {
    let timer: any = null;
    if (step === "SUCCESS") {
      if (redirectCount > 0) {
        timer = setTimeout(() => setRedirectCount((c) => c - 1), 1000);
      } else {
        navigate("/login");
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, redirectCount, navigate]);

  // Focus first OTP box when entering Step 2
  useEffect(() => {
    if (step === "VERIFY_OTP") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const cleanInput = mobile.trim();
    if (!cleanInput) {
      setErrorMsg("Please enter your registered mobile number or email.");
      return;
    }

    const isEmail = cleanInput.includes("@");
    const digitsOnly = cleanInput.replace(/\D/g, "");

    if (!isEmail) {
      if (digitsOnly.length !== 10) {
        setErrorMsg("Mobile number must be exactly 10 digits.");
        return;
      }
      if (!/^[6-9]/.test(digitsOnly)) {
        setErrorMsg("Mobile number must start with 6, 7, 8, or 9.");
        return;
      }
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: digitsOnly || cleanInput,
          identifier: cleanInput
        })
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setMaskedMobile(data.maskedMobile || (digitsOnly ? `******${digitsOnly.slice(-4)}` : cleanInput));
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        }
        setResendTimer(45);
        setIsResendActive(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setInfoMsg(data.message || "Verification code sent successfully.");
        setStep("VERIFY_OTP");
      } else {
        setErrorMsg(data.detail || data.message || "Unable to send verification code. Please check your credentials.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Unable to connect to the server. Please check your internet connection.");
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!isResendActive || loading) return;
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const cleanInput = mobile.trim();
      const digitsOnly = cleanInput.replace(/\D/g, "");
      const response = await apiFetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: digitsOnly || cleanInput,
          identifier: cleanInput
        })
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        if (data.devOtp) setDevOtp(data.devOtp);
        setResendTimer(45);
        setIsResendActive(false);
        setInfoMsg("A fresh 6-digit OTP has been sent.");
      } else {
        setErrorMsg(data.detail || data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Connection error while resending OTP.");
    }
  };

  // Step 2: Handle OTP input typing, paste, and navigation
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/\D/g, "");
    
    // Support multi-character paste into one box
    if (cleanDigit.length > 1) {
      const fullPasted = cleanDigit.slice(0, 6);
      const nextDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        nextDigits[i] = fullPasted[i] || "";
      }
      setOtpDigits(nextDigits);
      const nextFocus = Math.min(fullPasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanDigit.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-advance
    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const nextDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        nextDigits[i] = pasted[i] || "";
      }
      setOtpDigits(nextDigits);
      const targetFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[targetFocus]?.focus();
    }
  };

  // Step 2: Submit OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the verification code.");
      return;
    }

    setLoading(true);
    try {
      const cleanInput = mobile.trim();
      const digitsOnly = cleanInput.replace(/\D/g, "");
      const response = await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: digitsOnly || cleanInput,
          identifier: cleanInput,
          otp: fullOtp
        })
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setResetToken(data.resetToken || "");
        setInfoMsg("Verification successful! Now set your new password.");
        setStep("RESET_PASSWORD");
      } else {
        setErrorMsg(data.detail || data.message || "Invalid OTP code. Please check and try again.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error verifying code. Please try again.");
    }
  };

  // Step 3: Password Validation Rules
  const hasMinLength = newPassword.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasSpecialChar && passwordsMatch;

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!hasMinLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (!hasSpecialChar) {
      setErrorMsg("Password must contain at least one special character (!@#$%^&*...).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    try {
      const cleanInput = mobile.trim();
      const digitsOnly = cleanInput.replace(/\D/g, "");
      const response = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken: resetToken || undefined,
          mobile: digitsOnly || cleanInput,
          otp: otpDigits.join(""),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim()
        })
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setStep("SUCCESS");
      } else {
        setErrorMsg(data.detail || data.message || "Failed to update password. Session may have expired.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Unable to connect. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden select-none">
      
      {/* Top Hero Banner */}
      <div className="h-[30vh] sm:h-[35vh] w-full relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNKwPrtS83UvIEkqBto7V5ys1m7JDMLjJjFqK1e7Gxjb_ZusQCLoBxC-zdESJR4p2l6cM0dfUm0HvIlji1k3L82ebKyONS4MPuuGm20GFeJq4vQheATDJ3v6ZMRdE34NrakAV89kRMzGdWInjI3o3cYRynpfTHp4nLjdgzQqOtllBc2p6kkd2WsVwQC7jWW_Cr_3HFWqCc8ZKmnhnNh9Jgpy6SGQ04yt44Oh093XOg1MpQtc7yDC1BV90cMzw2JtBk4Niv5xBYw"
          alt="NR Scholar Learning Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fb] via-[rgba(247,249,251,0.55)] to-transparent" />
        
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => {
            if (step === "VERIFY_OTP") setStep("REQUEST_OTP");
            else if (step === "RESET_PASSWORD") setStep("VERIFY_OTP");
            else navigate("/login");
          }}
          className="absolute top-8 left-6 bg-white/80 hover:bg-white rounded-full p-2.5 border border-white/60 shadow-sm backdrop-blur-md transition-all active:scale-95 z-30"
          aria-label="Go Back"
        >
          <ArrowLeft size={22} className="text-[#141779]" />
        </button>

        {/* Floating Motif Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-6 bg-white/80 rounded-full p-3 border border-white/60 backdrop-blur-md shadow-sm"
        >
          <Rocket size={22} className="text-[#141779]" />
        </motion.div>
      </div>

      {/* Main Bottom Sheet / Card */}
      <div className="flex-1 bg-white rounded-t-[36px] -mt-8 border-t border-slate-100 shadow-[0_-10px_35px_rgba(0,0,0,0.08)] relative z-20 flex flex-col items-center pt-6 px-6 pb-8 max-w-lg mx-auto w-full">
        
        {/* Multi-step Breadcrumb Tracker */}
        {step !== "SUCCESS" && (
          <div className="flex items-center justify-center gap-3 mb-6 w-full max-w-[320px]">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === "REQUEST_OTP" ? "bg-[#141779] text-white shadow-sm" : "bg-emerald-100 text-emerald-800"}`}>
                {step === "REQUEST_OTP" ? "1" : <Check size={14} />}
              </div>
              <span className={`text-[11px] font-bold ${step === "REQUEST_OTP" ? "text-[#141779]" : "text-slate-500"}`}>
                Phone
              </span>
            </div>

            <div className={`flex-1 h-[2px] transition-colors ${step === "REQUEST_OTP" ? "bg-slate-200" : "bg-emerald-400"}`} />

            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === "VERIFY_OTP" ? "bg-[#141779] text-white shadow-sm" : step === "RESET_PASSWORD" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>
                {step === "RESET_PASSWORD" ? <Check size={14} /> : "2"}
              </div>
              <span className={`text-[11px] font-bold ${step === "VERIFY_OTP" ? "text-[#141779]" : "text-slate-500"}`}>
                OTP
              </span>
            </div>

            <div className={`flex-1 h-[2px] transition-colors ${step === "RESET_PASSWORD" ? "bg-emerald-400" : "bg-slate-200"}`} />

            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === "RESET_PASSWORD" ? "bg-[#141779] text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}>
                3
              </div>
              <span className={`text-[11px] font-bold ${step === "RESET_PASSWORD" ? "text-[#141779]" : "text-slate-400"}`}>
                Password
              </span>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[360px] bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-2xl mb-4 flex items-center gap-2.5"
          >
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Global Info / Status Banner */}
        {infoMsg && !errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[360px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl mb-4 flex items-center gap-2.5"
          >
            <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </motion.div>
        )}

        {/* Animated Container for Steps */}
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* STEP 1: REQUEST OTP                                       */}
          {/* ========================================================= */}
          {step === "REQUEST_OTP" && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] flex flex-col items-center"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#141779]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#141779]">
                  <KeyRound size={26} />
                </div>
                <h1 className="text-xl font-black text-[#141779] tracking-tight">Forgot Password?</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Enter your registered mobile number and we'll send you a secure verification OTP via SMS.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                    Registered Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 font-bold text-sm pointer-events-none border-r border-slate-200 pr-2">
                      <Phone size={18} className="text-[#141779]" />
                      <span className="text-slate-600 font-extrabold">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setMobile(val);
                      }}
                      className="w-full h-14 bg-slate-50 rounded-2xl pl-24 pr-4 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium tracking-wider"
                      required
                      autoFocus
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 font-medium">
                    Or enter registered email if linked to your account
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 bg-[#141779] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(20,23,121,0.25)] text-white font-bold text-base transition-all active:scale-[0.98] mt-2 ${
                    loading ? "opacity-80 cursor-wait" : "hover:opacity-95"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-bold text-[#141779] hover:underline"
                >
                  Remember your password? Log in
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: VERIFY OTP                                        */}
          {/* ========================================================= */}
          {step === "VERIFY_OTP" && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] flex flex-col items-center"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-[#141779]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#141779]">
                  <ShieldCheck size={26} />
                </div>
                <h1 className="text-xl font-black text-[#141779] tracking-tight">Enter Verification Code</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-bold text-slate-800">+91 {maskedMobile || mobile}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("REQUEST_OTP")}
                  className="text-xs text-[#006a62] font-bold hover:underline mt-1 inline-block"
                >
                  Edit Number
                </button>
              </div>

              {/* Dev Mode Auto-fill pill only in development when credentials are not configured */}
              {import.meta.env.DEV && devOtp && (
                <div
                  onClick={() => {
                    const digits = devOtp.split("").slice(0, 6);
                    setOtpDigits(digits);
                  }}
                  className="cursor-pointer mb-4 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-xl flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Dev Mode: Click to auto-fill ({devOtp})</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-5">
                {/* 6 Digit Split OTP Input */}
                <div className="flex items-center justify-between gap-2 my-1">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-black text-[#141779] bg-slate-50 rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all shadow-inner"
                      required
                    />
                  ))}
                </div>

                {/* Resend Code Section */}
                <div className="flex items-center justify-between px-1 text-xs font-semibold">
                  <span className="text-slate-500">Didn't receive code?</span>
                  {isResendActive ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-[#141779] font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold">
                      Resend in 0:{resendTimer.toString().padStart(2, "0")}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join("").length !== 6}
                  className={`w-full h-14 bg-[#141779] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(20,23,121,0.25)] text-white font-bold text-base transition-all active:scale-[0.98] ${
                    loading || otpDigits.join("").length !== 6
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:opacity-95"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: NEW PASSWORD ENTRY                                */}
          {/* ========================================================= */}
          {step === "RESET_PASSWORD" && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[360px] flex flex-col items-center"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-[#141779]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#141779]">
                  <Lock size={26} />
                </div>
                <h1 className="text-xl font-black text-[#141779] tracking-tight">Create New Password</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Choose a strong, secure password for your NR Scholar account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
                
                {/* New Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={18} className="text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-12 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1.5 hover:bg-slate-200/80 rounded-full transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={18} className="text-slate-500" /> : <EyeOff size={18} className="text-slate-500" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={18} className="text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-12 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 p-1.5 hover:bg-slate-200/80 rounded-full transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <Eye size={18} className="text-slate-500" /> : <EyeOff size={18} className="text-slate-500" />}
                    </button>
                  </div>
                </div>

                {/* Real-time Checklist */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col gap-1.5 text-xs">
                  <div className={`flex items-center gap-2 font-semibold ${hasMinLength ? "text-emerald-700" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? "bg-emerald-100" : "bg-slate-200"}`}>
                      <Check size={11} className={hasMinLength ? "text-emerald-700" : "text-slate-400"} />
                    </div>
                    <span>At least 8 characters</span>
                  </div>

                  <div className={`flex items-center gap-2 font-semibold ${hasSpecialChar ? "text-emerald-700" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasSpecialChar ? "bg-emerald-100" : "bg-slate-200"}`}>
                      <Check size={11} className={hasSpecialChar ? "text-emerald-700" : "text-slate-400"} />
                    </div>
                    <span>At least one special character (!@#$%^&*...)</span>
                  </div>

                  <div className={`flex items-center gap-2 font-semibold ${passwordsMatch ? "text-emerald-700" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? "bg-emerald-100" : "bg-slate-200"}`}>
                      <Check size={11} className={passwordsMatch ? "text-emerald-700" : "text-slate-400"} />
                    </div>
                    <span>Passwords match</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className={`w-full h-14 bg-[#141779] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(20,23,121,0.25)] text-white font-bold text-base transition-all active:scale-[0.98] mt-1 ${
                    loading || !isPasswordValid ? "opacity-60 cursor-not-allowed" : "hover:opacity-95"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SUCCESS CONFIRMATION                              */}
          {/* ========================================================= */}
          {step === "SUCCESS" && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[360px] flex flex-col items-center text-center py-6"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={42} strokeWidth={2.5} />
              </div>

              <h1 className="text-2xl font-black text-[#141779] tracking-tight">
                Password Reset Successful!
              </h1>
              
              <p className="text-xs text-slate-500 font-semibold mt-2 max-w-[280px]">
                Your account password has been updated securely. You can now log in with your new password.
              </p>

              <div className="mt-8 w-full flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-14 bg-[#141779] hover:bg-[#141779]/90 text-white font-bold text-base rounded-2xl shadow-[0_4px_14px_rgba(20,23,121,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Go to Login</span>
                  <ArrowRight size={18} />
                </button>

                <span className="text-[11px] font-bold text-slate-400">
                  Redirecting automatically in {redirectCount}s...
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Visual Decorative Bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mt-auto mb-1" />

      </div>
    </div>
  );
}
