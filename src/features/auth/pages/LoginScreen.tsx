import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BookOpen, Phone, Lock, Eye, EyeOff, ArrowRight, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loginTab, setLoginTab] = useState<"mobile" | "code">("mobile");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [childCode, setChildCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (loginTab === "mobile") {
      if (!mobile.trim() || !password.trim()) {
        setErrorMsg("Please enter your mobile number and password.");
        return;
      }
      setLoading(true);
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
          navigate("/home");
        } else {
          setErrorMsg(data.message || "Invalid credentials.");
        }
      } catch (e) {
        setErrorMsg("Unable to connect. Is the server running?");
        setLoading(false);
      }
    } else {
      if (!childCode.trim()) {
        setErrorMsg("Please enter the child's unique code.");
        return;
      }
      setLoading(true);
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
          sessionStorage.clear();
          navigate("/home");
        } else {
          setErrorMsg(data.message || "Invalid Child Code.");
        }
      } catch (e) {
        setErrorMsg("Unable to connect. Is the server running?");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden">
      
      {/* Top 40%: Vibrant Hero Image */}
      <div className="h-[38vh] w-full relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNKwPrtS83UvIEkqBto7V5ys1m7JDMLjJjFqK1e7Gxjb_ZusQCLoBxC-zdESJR4p2l6cM0dfUm0HvIlji1k3L82ebKyONS4MPuuGm20GFeJq4vQheATDJ3v6ZMRdE34NrakAV89kRMzGdWInjI3o3cYRynpfTHp4nLjdgzQqOtllBc2p6kkd2WsVwQC7jWW_Cr_3HFWqCc8ZKmnhnNh9Jgpy6SGQ04yt44Oh093XOg1MpQtc7yDC1BV90cMzw2JtBk4Niv5xBYw"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fb] via-[rgba(247,249,251,0.5)] to-transparent" />
        
        {/* Floating Cosmic Element */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-6 bg-[rgba(255,255,255,0.7)] rounded-full p-3 border-[1.5px] border-[rgba(255,255,255,0.4)] backdrop-blur-sm"
        >
          <Rocket size={24} color="#141779" />
        </motion.div>
      </div>

      {/* Bottom 60%: Login Card */}
      <div className="flex-1 bg-white rounded-t-[32px] -mt-6 border-t border-[rgba(255,255,255,0.4)] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-10 flex flex-col items-center pt-6 px-6 pb-6">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="w-14 h-14 bg-[#141779] rounded-2xl flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(87,250,233,0.3)]">
            <BookOpen size={28} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-[#141779] tracking-[-0.5px]">NR Scholar</h1>
          <p className="text-xs text-[#767683] font-medium mt-0.5">Welcome back to StudySaathy</p>
        </div>

        {/* Login Method Toggle */}
        <div className="w-full max-w-[340px] bg-gray-100 p-1 rounded-full flex mb-4 border border-gray-200">
          <button
            type="button"
            onClick={() => { setLoginTab("mobile"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginTab === "mobile" ? "bg-[#141779] text-white shadow-sm" : "text-gray-600 hover:text-[#141779]"
            }`}
          >
            <Phone size={14} />
            <span>Mobile Login</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginTab("code"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginTab === "code" ? "bg-[#141779] text-white shadow-sm" : "text-gray-600 hover:text-[#141779]"
            }`}
          >
            <KeyRound size={14} />
            <span>Unique Child Code</span>
          </button>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[340px] bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Fields */}
        <form onSubmit={handleLogin} className="w-full max-w-[340px] flex flex-col gap-4 mb-6">
          {loginTab === "mobile" ? (
            <>
              <div className="relative flex items-center">
                <Phone size={20} color="#767683" className="absolute left-4" />
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full h-14 bg-[#eceef0] rounded-full pl-12 pr-4 text-base font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative flex items-center">
                  <Lock size={20} color="#767683" className="absolute left-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-[#eceef0] rounded-full pl-12 pr-12 text-base font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {showPassword ? <Eye size={20} color="#767683" /> : <EyeOff size={20} color="#767683" />}
                  </button>
                </div>
                <div className="flex justify-end px-2">
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-semibold text-[#006a62] hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <KeyRound size={20} color="#767683" className="absolute left-4" />
                <input
                  type="text"
                  placeholder="e.g. ARY3821"
                  value={childCode}
                  onChange={(e) => setChildCode(e.target.value.toUpperCase())}
                  className="w-full h-14 bg-[#eceef0] rounded-full pl-12 pr-4 text-base font-extrabold tracking-wider uppercase text-[#141779] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683] placeholder:font-normal placeholder:tracking-normal"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 font-medium px-2">
                Enter the unique 6-character child code provided in the parent portal to link device.
              </p>
            </div>
          )}

          {/* Action Area */}
          <div className="flex flex-col gap-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(20,23,121,0.3)] transition-opacity ${loading ? 'opacity-80 cursor-wait' : 'hover:opacity-90'}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-white text-lg font-bold">
                    {loginTab === "mobile" ? "Login" : "Link & Access"}
                  </span>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1">
              <span className="text-sm text-[#767683] font-medium">Don't have an account? </span>
              <button type="button" onClick={() => navigate("/signup-step1")} className="text-sm font-bold text-[#141779] hover:underline">
                Sign up
              </button>
            </div>
          </div>
        </form>

        {/* Visual Decorative Spacer */}
        <div className="w-12 h-1 bg-[#e0e3e5] rounded-full mt-auto mb-2" />

      </div>
    </div>
  );
}
