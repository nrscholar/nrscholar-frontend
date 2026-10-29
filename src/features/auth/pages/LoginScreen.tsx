import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BookOpen, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginAsParent, setLoginAsParent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

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
    if (!password.trim()) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: cleanMobile,
          password: password.trim(),
          loginAsParent
        })
      });
      const data = await response.json();
      setLoading(false);

      if (data.success && data.data) {
        localStorage.setItem("userToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        sessionStorage.clear();

        // Smart Role / PIN Redirection:
        const isCoParentUser = Boolean(
          data.data.user?.isSecondaryParent ||
          data.data.user?.isCoParent ||
          data.data.user?.role === "co_parent" ||
          data.data.user?.role === "secondary_parent" ||
          data.data.user?.primary_parent_id
        );

        const hasPinSet = Boolean(data.data.user?.isPinSet || data.data.user?.is_pin_set);
        localStorage.setItem("isParentPinSet", hasPinSet ? "true" : "false");

        let targetRoute = data.data.suggestedRoute || (loginAsParent ? "/parent/gate" : "/home");
        let deviceRole = data.data.deviceRole || (targetRoute.startsWith("/parent") ? "parent" : "child");

        if (isCoParentUser) {
          // Co-Parents must ALWAYS route to /parent/gate to set up (first time) or verify (subsequent) PIN
          targetRoute = "/parent/gate";
          deviceRole = "parent";
          sessionStorage.removeItem("parentPinVerified");
        }

        localStorage.setItem("deviceRole", deviceRole);
        navigate(targetRoute);
      } else {
        setErrorMsg(data.detail || data.message || "Invalid mobile number or password.");
      }
    } catch (e) {
      setErrorMsg("Unable to connect. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden">
      
      {/* Top 35%: Hero Header */}
      <div className="h-[35vh] w-full relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNKwPrtS83UvIEkqBto7V5ys1m7JDMLjJjFqK1e7Gxjb_ZusQCLoBxC-zdESJR4p2l6cM0dfUm0HvIlji1k3L82ebKyONS4MPuuGm20GFeJq4vQheATDJ3v6ZMRdE34NrakAV89kRMzGdWInjI3o3cYRynpfTHp4nLjdgzQqOtllBc2p6kkd2WsVwQC7jWW_Cr_3HFWqCc8ZKmnhnNh9Jgpy6SGQ04yt44Oh093XOg1MpQtc7yDC1BV90cMzw2JtBk4Niv5xBYw"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fb] via-[rgba(247,249,251,0.5)] to-transparent" />
        
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-6 bg-white/80 rounded-full p-3 border border-white/50 backdrop-blur-sm shadow-md"
        >
          <Rocket size={24} color="#141779" />
        </motion.div>
      </div>

      {/* Bottom 65%: Login Card */}
      <div className="flex-1 bg-white rounded-t-[36px] -mt-8 border-t border-slate-100 shadow-[0_-10px_35px_rgba(0,0,0,0.08)] relative z-10 flex flex-col items-center pt-6 px-6 pb-6 select-none">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="w-13 h-13 bg-[#141779] rounded-2xl flex items-center justify-center mb-1.5 shadow-md">
            <BookOpen size={26} color="white" />
          </div>
          <h1 className="text-xl font-black text-[#141779] tracking-tight">NR Scholar</h1>
          <p className="text-xs text-[#767683] font-semibold">Welcome back! Sign in to continue</p>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[350px] bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* STREAMLINED UNIFIED LOGIN FORM */}
        <form onSubmit={handleLogin} className="w-full max-w-[350px] flex flex-col gap-4 mb-6">
          
          {/* Phone Number */}
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
                }}
                className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-600 px-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={20} className="text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-12 text-sm font-bold text-[#141779] border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#141779]/20 focus:border-[#141779] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
                required
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
            <div className="flex justify-end px-1 mt-0.5">
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-bold text-[#006a62] hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Single Checkbox: "Login as Parent" */}
          <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/90 cursor-pointer select-none transition-all">
            <input
              type="checkbox"
              checked={loginAsParent}
              onChange={(e) => setLoginAsParent(e.target.checked)}
              className="w-5 h-5 rounded-md text-[#141779] border-slate-300 focus:ring-[#141779] accent-[#141779] cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={16} className={loginAsParent ? "text-[#141779]" : "text-slate-400"} />
                Login as Parent
              </span>
              <span className="text-[10.5px] text-slate-400 font-medium">
                Verify PIN to access Parent Dashboard & controls
              </span>
            </div>
          </label>

          {/* Action Button */}
          <div className="flex flex-col gap-3.5 mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-all ${
                loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-98'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-white text-base font-bold uppercase tracking-wider">
                    {loginAsParent ? "Proceed to Parent Gate" : "Log In"}
                  </span>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1">
              <span className="text-xs text-[#767683] font-semibold">Don't have an account? </span>
              <button type="button" onClick={() => navigate("/signup-step1")} className="text-xs font-black text-[#141779] hover:underline">
                Sign up
              </button>
            </div>

            <div className="flex justify-center items-center pt-1">
              <button
                type="button"
                onClick={() => navigate("/splash")}
                className="text-[11px] font-bold text-slate-400 hover:text-[#141779] transition-colors flex items-center gap-1"
              >
                <span>✨ Explore App Journeys (Class 1–10)</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
