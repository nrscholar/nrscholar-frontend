import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { apiFetch } from "../../../api";

type Step = "mobile" | "otp" | "password" | "success";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState("");
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  // OTP Input reference
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // 30s Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Auto-focus OTP input on entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
        setIsOtpFocused(true);
      }, 200);
    }
  }, [step]);

  // ─────────────────────────────────────────────────────────
  // STEP 1: Send OTP
  // ─────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanMobile = mobile.replace(/\D/g, "");
    if (!cleanMobile) {
      setErrorMsg("Please enter your mobile number.");
      return;
    }
    if (cleanMobile.length !== 10) {
      setErrorMsg("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!/^[6-9]/.test(cleanMobile)) {
      setErrorMsg("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/users/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanMobile }),
      });
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg(data.message || "OTP sent successfully to your mobile number.");
        if (data.reqId) setReqId(data.reqId);
        setOtp("");
        setStep("otp");
        setResendTimer(30);
      } else {
        setErrorMsg(data.detail || data.message || "Failed to send OTP. Please check your mobile number.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  // ─────────────────────────────────────────────────────────
  // STEP 2: Verify OTP
  // ─────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (otp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/users/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile.replace(/\D/g, ""),
          otp: otp.trim(),
          reqId: reqId || undefined
        }),
      });
      const data = await response.json();
      setLoading(false);

      if (data.success && data.resetToken) {
        setResetToken(data.resetToken);
        setSuccessMsg("OTP verified successfully!");
        setStep("password");
      } else {
        setErrorMsg(data.detail || data.message || "Invalid OTP. Please check the code and try again.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resending) return;
    setErrorMsg("");
    setResending(true);

    try {
      const response = await apiFetch("/api/users/forgot-password/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile.replace(/\D/g, ""),
          reqId: reqId || undefined
        }),
      });
      const data = await response.json();
      setResending(false);

      if (data.success) {
        setSuccessMsg(data.message || "OTP resent successfully to your mobile number.");
        if (data.reqId) setReqId(data.reqId);
        setResendTimer(30);
        setOtp("");
        otpInputRef.current?.focus();
      } else {
        setErrorMsg(data.detail || data.message || "Failed to resend OTP.");
      }
    } catch {
      setResending(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  // ─────────────────────────────────────────────────────────
  // STEP 3: Reset Password
  // ─────────────────────────────────────────────────────────
  const isMinLength = newPassword.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isMinLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (!hasSpecialChar) {
      setErrorMsg("Password must include a special symbol (!@#$%^&*).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/users/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword
        }),
      });
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg(data.message || "Your password has been reset successfully!");
        setStep("success");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setErrorMsg(data.detail || data.message || "Failed to reset password.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  // Subtitle per step
  const getSubtitle = () => {
    switch (step) {
      case "mobile":
        return "Enter your registered mobile number to reset password";
      case "otp":
        return `Enter the 6-digit verification code sent to +91 ${mobile}`;
      case "password":
        return "Create a new password for your account";
      case "success":
        return "Password reset completed successfully";
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden">
      
      {/* Top 30%: Hero Header matching LoginScreen */}
      <div className="h-[30vh] min-h-[190px] w-full relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNKwPrtS83UvIEkqBto7V5ys1m7JDMLjJjFqK1e7Gxjb_ZusQCLoBxC-zdESJR4p2l6cM0dfUm0HvIlji1k3L82ebKyONS4MPuuGm20GFeJq4vQheATDJ3v6ZMRdE34NrakAV89kRMzGdWInjI3o3cYRynpfTHp4nLjdgzQqOtllBc2p6kkd2WsVwQC7jWW_Cr_3HFWqCc8ZKmnhnNh9Jgpy6SGQ04yt44Oh093XOg1MpQtc7yDC1BV90cMzw2JtBk4Niv5xBYw"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fb] via-[rgba(247,249,251,0.5)] to-transparent" />
        
        {/* Responsive Mobile-friendly Back Button */}
        <button
          type="button"
          onClick={() => {
            if (step === "otp") {
              setStep("mobile");
              setErrorMsg("");
              setSuccessMsg("");
            } else if (step === "password") {
              setStep("otp");
              setErrorMsg("");
              setSuccessMsg("");
            } else {
              navigate("/login");
            }
          }}
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#141779] hover:bg-white active:scale-95 transition-all"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Bottom Card matching LoginScreen */}
      <div className="flex-1 bg-white rounded-t-[36px] -mt-8 border-t border-slate-100 shadow-[0_-10px_35px_rgba(0,0,0,0.08)] relative z-10 flex flex-col items-center pt-6 px-6 pb-6 select-none">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="w-13 h-13 bg-[#141779] rounded-2xl flex items-center justify-center mb-1.5 shadow-md">
            <BookOpen size={26} color="white" />
          </div>
          <h1 className="text-xl font-black text-[#141779] tracking-tight">NR Scholar</h1>
          <p className="text-xs text-[#767683] font-semibold max-w-[280px] mt-0.5">
            {getSubtitle()}
          </p>
        </div>

        {/* Global Standard Error Message */}
        {errorMsg && (
          <div className="w-full max-w-[350px] bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Global Standard Success Message */}
        {successMsg && !errorMsg && (
          <div className="w-full max-w-[350px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3 rounded-xl mb-4 text-center">
            {successMsg}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 1: ENTER MOBILE NUMBER
           ════════════════════════════════════════════════════════════════════ */}
        {step === "mobile" && (
          <form onSubmit={handleSendOtp} className="w-full max-w-[350px] flex flex-col gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone size={20} className="text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(val);
                    setErrorMsg("");
                  }}
                  className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <button
                type="submit"
                disabled={loading || mobile.replace(/\D/g, "").length !== 10}
                className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-all text-white text-base font-bold uppercase tracking-wider ${
                  loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-98'
                } ${mobile.replace(/\D/g, "").length !== 10 ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-1">
                <span className="text-xs text-[#767683] font-semibold">Remember your password? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-black text-[#141779] hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 2: ENTER OTP
           ════════════════════════════════════════════════════════════════════ */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="w-full max-w-[350px] flex flex-col gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep("mobile");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs font-bold text-[#006a62] hover:underline"
                >
                  Change Number
                </button>
              </div>

              {/* 6-Digit OTP Inputs: Full Mobile SMS Auto-Fill + Native Keypad + Crisp Grid Slots */}
              <div
                className="relative w-full cursor-pointer select-none"
                onClick={() => otpInputRef.current?.focus()}
              >
                {/* Real accessible input for mobile SMS auto-fill and native keyboard */}
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(val);
                    setErrorMsg("");
                  }}
                  onFocus={() => setIsOtpFocused(true)}
                  onBlur={() => setIsOtpFocused(false)}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer caret-transparent"
                  autoFocus
                />

                {/* 6 Responsive Crisp Visual Slots */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 w-full">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const digit = otp[idx] || "";
                    const isCurrent = isOtpFocused && (idx === otp.length || (idx === 5 && otp.length === 6));

                    return (
                      <div
                        key={idx}
                        className={`h-14 sm:h-15 flex items-center justify-center rounded-2xl text-xl sm:text-2xl font-bold transition-all ${
                          digit
                            ? "bg-slate-50 border-2 border-[#141779] text-[#141779] shadow-xs"
                            : isCurrent
                            ? "bg-white border-2 border-[#141779] text-[#141779] shadow-sm ring-4 ring-[#141779]/15"
                            : "bg-slate-50 border border-slate-300 text-slate-800"
                        }`}
                      >
                        {digit ? (
                          digit
                        ) : isCurrent ? (
                          <span className="w-0.5 h-6 bg-[#141779] rounded-full animate-pulse" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-all text-white text-base font-bold uppercase tracking-wider ${
                  loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-98'
                } ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex justify-center items-center">
                {resendTimer > 0 ? (
                  <span className="text-xs text-[#767683] font-semibold">
                    Resend OTP in <span className="text-[#141779] font-bold">{resendTimer}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-xs font-bold text-[#006a62] hover:underline flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <div className="flex justify-center items-center gap-1 mt-1">
                <span className="text-xs text-[#767683] font-semibold">Remember your password? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-black text-[#141779] hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 3: ENTER NEW PASSWORD
           ════════════════════════════════════════════════════════════════════ */}
        {step === "password" && (
          <form onSubmit={handleResetPassword} className="w-full max-w-[350px] flex flex-col gap-4 mb-4">
            
            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock size={20} className="text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-12 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 p-1.5 hover:bg-slate-200/80 rounded-full transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <Eye size={18} className="text-slate-500" /> : <EyeOff size={18} className="text-slate-500" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock size={20} className="text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-12 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
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

            {/* Password Validation Hints */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-1.5 text-[11px] font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <span className={isMinLength ? "text-emerald-600" : "text-slate-400"}>
                  {isMinLength ? "●" : "○"}
                </span>
                <span className={isMinLength ? "text-slate-800" : ""}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={hasSpecialChar ? "text-emerald-600" : "text-slate-400"}>
                  {hasSpecialChar ? "●" : "○"}
                </span>
                <span className={hasSpecialChar ? "text-slate-800" : ""}>At least 1 special character (!@#$%^&*)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={confirmPassword && newPassword === confirmPassword ? "text-emerald-600" : "text-slate-400"}>
                  {confirmPassword && newPassword === confirmPassword ? "●" : "○"}
                </span>
                <span className={confirmPassword && newPassword === confirmPassword ? "text-slate-800" : ""}>Passwords match</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <button
                type="submit"
                disabled={loading || !isMinLength || !hasSpecialChar || newPassword !== confirmPassword}
                className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-all text-white text-base font-bold uppercase tracking-wider ${
                  loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-98'
                } ${(!isMinLength || !hasSpecialChar || newPassword !== confirmPassword) ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-1">
                <span className="text-xs text-[#767683] font-semibold">Remember your password? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-black text-[#141779] hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 4: SUCCESS CONFIRMATION
           ════════════════════════════════════════════════════════════════════ */}
        {step === "success" && (
          <div className="w-full max-w-[350px] flex flex-col gap-4 mt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] text-white text-base font-bold uppercase tracking-wider hover:opacity-90 active:scale-98 transition-all"
            >
              <span>Back to Login</span>
              <ArrowRight size={20} color="white" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
