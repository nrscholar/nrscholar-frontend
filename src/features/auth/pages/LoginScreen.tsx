import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BookOpen, AtSign, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter your email and password.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      setLoading(false);
      
      if (data.success) {
        localStorage.setItem("userToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        navigate("/home");
      } else {
        setErrorMsg(data.message || "Invalid credentials.");
      }
    } catch (e) {
      setErrorMsg("Unable to connect. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden">
      
      {/* Top 40%: Vibrant Hero Image */}
      <div className="h-[40vh] w-full relative">
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
      <div className="flex-1 bg-white rounded-t-[32px] -mt-6 border-t border-[rgba(255,255,255,0.4)] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-10 flex flex-col items-center pt-8 px-6 pb-6">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#141779] rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(87,250,233,0.3)]">
            <BookOpen size={32} color="white" />
          </div>
          <h1 className="text-[26px] font-bold text-[#141779] tracking-[-0.5px]">Studysaathy</h1>
          <p className="text-base text-[#767683] font-medium mt-1">Continue your cosmic mission</p>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[340px] bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Fields */}
        <form onSubmit={handleLogin} className="w-full max-w-[340px] flex flex-col gap-4 mb-6">
          <div className="relative flex items-center">
            <AtSign size={20} color="#767683" className="absolute left-4" />
            <input
              type="email"
              placeholder="Explorer Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-[#eceef0] rounded-full pl-12 pr-4 text-base font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <Lock size={20} color="#767683" className="absolute left-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Secret Key"
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
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm font-semibold text-[#006a62] hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

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
                  <span className="text-white text-lg font-bold">Launch Journey</span>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1">
              <span className="text-base text-[#767683] font-medium">New explorer?</span>
              <button type="button" onClick={() => navigate("/signup-step1")} className="text-base font-bold text-[#141779] hover:underline">
                Join the Galaxy
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
