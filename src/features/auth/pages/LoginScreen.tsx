import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BookOpen, Phone, Lock, Eye, EyeOff, ArrowRight, KeyRound, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState<"parent" | "child" | "family_code">("child");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [childCode, setChildCode] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (loginRole === "family_code") {
      if (!familyCode.trim()) {
        setErrorMsg("Please enter the 6-character Family Link Code (e.g. FAM-8492).");
        setLoading(false);
        return;
      }
      try {
        const response = await apiFetch("/api/users/family-link/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ familyCode: familyCode.trim(), pin: parentPin.trim() })
        });
        const data = await response.json();
        setLoading(false);
        if (data.success) {
          localStorage.setItem("userToken", data.data.token);
          if (data.data.refreshToken) {
            localStorage.setItem("refreshToken", data.data.refreshToken);
          }
          localStorage.setItem("userData", JSON.stringify(data.data.user));
          localStorage.setItem("deviceRole", "parent");
          sessionStorage.clear();
          navigate("/parent/gate");
        } else {
          setErrorMsg(data.message || "Invalid Family Link Code or PIN.");
        }
      } catch (e) {
        setErrorMsg("Unable to connect. Is the server running?");
        setLoading(false);
      }
      return;
    }

    if (loginRole === "child" && childCode.trim()) {
      try {
        const response = await apiFetch("/api/users/login-child-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: childCode.trim() })
        });
        const data = await response.json();
        setLoading(false);
        if (data.success) {
          localStorage.setItem("userToken", data.data.token);
          if (data.data.refreshToken) {
            localStorage.setItem("refreshToken", data.data.refreshToken);
          }
          localStorage.setItem("userData", JSON.stringify(data.data.user));
          localStorage.setItem("deviceRole", "child");
          sessionStorage.clear();
          navigate("/home");
        } else {
          setErrorMsg(data.message || "Invalid Child Code.");
        }
      } catch (e) {
        setErrorMsg("Unable to connect. Is the server running?");
        setLoading(false);
      }
      return;
    }

    // Standard Mobile + Password Login
    if (!mobile.trim() || !password.trim()) {
      setErrorMsg("Please enter your mobile number and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        localStorage.setItem("userToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        sessionStorage.clear();

        if (loginRole === "parent") {
          localStorage.setItem("deviceRole", "parent");
          navigate("/parent/gate");
        } else {
          localStorage.setItem("deviceRole", "child");
          navigate("/home");
        }
      } else {
        setErrorMsg(data.message || "Invalid mobile number or password.");
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
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="w-13 h-13 bg-[#141779] rounded-2xl flex items-center justify-center mb-1.5 shadow-md">
            <BookOpen size={26} color="white" />
          </div>
          <h1 className="text-xl font-black text-[#141779] tracking-tight">NR Scholar</h1>
          <p className="text-xs text-[#767683] font-semibold">Select your role & log in to start</p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div className="w-full max-w-[350px] bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-4 border border-slate-200/80">
          <button
            type="button"
            onClick={() => { setLoginRole("child"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              loginRole === "child" ? "bg-[#141779] text-white shadow-md" : "text-slate-600 hover:text-[#141779]"
            }`}
          >
            <span>Scholar 🎓</span>
          </button>

          <button
            type="button"
            onClick={() => { setLoginRole("parent"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              loginRole === "parent" ? "bg-[#141779] text-white shadow-md" : "text-slate-600 hover:text-[#141779]"
            }`}
          >
            <span>Parent 👨‍👩‍👧</span>
          </button>

          <button
            type="button"
            onClick={() => { setLoginRole("family_code"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              loginRole === "family_code" ? "bg-[#141779] text-white shadow-md" : "text-slate-600 hover:text-[#141779]"
            }`}
          >
            <span>Family 🔑</span>
          </button>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[350px] bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="w-full max-w-[350px] flex flex-col gap-3.5 mb-6">
          {loginRole === "family_code" ? (
            <>
              <div className="relative flex items-center">
                <Users size={18} color="#767683" className="absolute left-4" />
                <input
                  type="text"
                  placeholder="Family Code (e.g. FAM-8492)"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                  className="w-full h-13 bg-[#eceef0] rounded-2xl pl-11 pr-4 text-sm font-black tracking-wider uppercase text-[#141779] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:font-medium placeholder:tracking-normal"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <Lock size={18} color="#767683" className="absolute left-4" />
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Parent 4-Digit PIN"
                  value={parentPin}
                  onChange={(e) => setParentPin(e.target.value)}
                  className="w-full h-13 bg-[#eceef0] rounded-2xl pl-11 pr-4 text-sm font-black tracking-widest text-[#141779] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:font-medium placeholder:tracking-normal"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 font-semibold px-2">
                Enter the 6-digit Family Link Code generated from Parent Settings on your main device.
              </p>
            </>
          ) : (
            <>
              <div className="relative flex items-center">
                <Phone size={18} color="#767683" className="absolute left-4" />
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full h-13 bg-[#eceef0] rounded-2xl pl-11 pr-4 text-sm font-bold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="relative flex items-center">
                  <Lock size={18} color="#767683" className="absolute left-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-13 bg-[#eceef0] rounded-2xl pl-11 pr-11 text-sm font-bold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {showPassword ? <Eye size={18} color="#767683" /> : <EyeOff size={18} color="#767683" />}
                  </button>
                </div>
                <div className="flex justify-end px-2">
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-bold text-[#006a62] hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </div>

              {loginRole === "child" && (
                <div className="mt-1 pt-3 border-t border-slate-200/80">
                  <p className="text-[11px] font-bold text-slate-500 mb-2 px-1">Or log in with Unique Child Code:</p>
                  <div className="relative flex items-center">
                    <KeyRound size={18} color="#767683" className="absolute left-4" />
                    <input
                      type="text"
                      placeholder="e.g. ARY3821"
                      value={childCode}
                      onChange={(e) => setChildCode(e.target.value.toUpperCase())}
                      className="w-full h-12 bg-[#eceef0] rounded-2xl pl-11 pr-4 text-xs font-black tracking-wider uppercase text-[#141779] focus:outline-none focus:ring-2 focus:ring-[#141779] placeholder:font-normal placeholder:tracking-normal"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Button */}
          <div className="flex flex-col gap-3.5 mt-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-13 bg-[#141779] rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#101362] active:scale-98 transition-all ${loading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-white text-sm font-black uppercase tracking-wider">
                    {loginRole === "parent" ? "Access Parent Portal" : loginRole === "family_code" ? "Link Family Device" : "Start Learning"}
                  </span>
                  <ArrowRight size={18} color="white" />
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1">
              <span className="text-xs text-[#767683] font-semibold">Don't have an account? </span>
              <button type="button" onClick={() => navigate("/signup-step1")} className="text-xs font-black text-[#141779] hover:underline">
                Sign up
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
