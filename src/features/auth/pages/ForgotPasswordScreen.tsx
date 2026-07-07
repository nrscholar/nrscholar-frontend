import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, AtSign, Rocket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setErrorMsg("Please enter your registered mobile number.");
      setMsg("");
      return;
    }
    setErrorMsg("");
    setMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });
      const data = await response.json();
      setLoading(false);
      
      if (data.success) {
        setMsg(data.message || "Request submitted. Please check your phone.");
        setTimeout(() => navigate("/login"), 4000);
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
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
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-6 bg-[rgba(255,255,255,0.7)] rounded-full p-2 border-[1.5px] border-[rgba(255,255,255,0.4)] backdrop-blur-sm z-50 hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} color="#141779" />
        </button>

        {/* Floating Cosmic Element */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 right-6 bg-[rgba(255,255,255,0.7)] rounded-full p-3 border-[1.5px] border-[rgba(255,255,255,0.4)] backdrop-blur-sm"
        >
          <Rocket size={24} color="#141779" />
        </motion.div>
      </div>

      {/* Bottom 60%: Card */}
      <div className="flex-1 bg-white rounded-t-[32px] -mt-6 border-t border-[rgba(255,255,255,0.4)] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-10 flex flex-col items-center pt-8 px-6 pb-6">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-[26px] font-bold text-[#141779] tracking-[-0.5px]">Forgot Password?</h1>
          <p className="text-base text-[#767683] font-medium mt-2 max-w-[280px]">
            Enter your registered mobile number and we'll help you reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[340px] bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}
        
        {msg && (
          <div className="w-full max-w-[340px] bg-[#d0f0ed] text-[#006a62] text-sm font-semibold p-3 rounded-xl mb-4 text-center">
            {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleReset} className="w-full max-w-[340px] flex flex-col gap-4 mb-6">
          <div className="relative flex items-center">
            <AtSign size={20} color="#767683" className="absolute left-4" />
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full h-14 bg-[#eceef0] rounded-full pl-12 pr-4 text-base font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#141779] transition-shadow placeholder:text-[#767683]"
              required
            />
          </div>

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
                  <span className="text-white text-lg font-bold">Send Link</span>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Visual Decorative Spacer */}
        <div className="w-12 h-1 bg-[#e0e3e5] rounded-full mt-auto mb-2" />

      </div>
    </div>
  );
}
