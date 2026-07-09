import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, ArrowLeft, User, Phone } from "lucide-react";
import { apiFetch } from "../../../api";

export default function SignupStep1Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState(searchParams.get("fullName") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validateMobile = (mobile: string) => {
    // Check for exactly 10 digits
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!validateMobile(mobile)) {
      setErrorMsg("Please enter a valid mobile number (10 digits)");
      return;
    }
    
    setErrorMsg("");
    setLoading(true);
    
    try {
      const response = await apiFetch("/api/users/check-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile })
      });
      const data = await response.json();
      setLoading(false);
      
      if (response.status === 422 || (data.detail && data.detail === "Invalid mobile number format")) {
        setErrorMsg("Invalid mobile number format");
        return;
      }
      
      if (data.exists) {
        setErrorMsg("Mobile number already registered");
      } else {
        navigate(`/signup-step2?fullName=${encodeURIComponent(fullName)}&mobile=${encodeURIComponent(mobile)}`);
      }
    } catch (e) {
      setLoading(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#f7f9fb] font-sans relative pb-10">
      
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-[rgba(255,255,255,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/login")} className="w-10 h-10 -ml-2 rounded-full bg-[#e0e0ff] flex items-center justify-center hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <Rocket size={28} color="#141779" />
          <h1 className="text-[22px] font-bold text-[#141779] tracking-[-0.5px]">Studysaathy</h1>
        </div>
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto">
        
        {/* Step Indicator */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#006a62] tracking-[1px]">STEP 1 OF 3</span>
            <span className="text-xs font-bold text-[#767683]">33%</span>
          </div>
          <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
            <div className="h-full bg-[#57fae9] rounded-full w-[33%]" />
          </div>
        </div>

        {/* Glass Content Card */}
        <div className="w-full bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-[28px] font-bold text-[#141779] mb-2 text-center">Create Account</h2>
            <p className="text-base text-[#464652] font-medium text-center">
              Let's set up your parent account to get started.
            </p>
          </div>

          {errorMsg && (
            <div className="w-full bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-6 text-center">
              {errorMsg}
            </div>
          )}

          <form className="flex flex-col gap-5 mb-6" onSubmit={handleNext}>
            
            {/* Parent Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-1">Parent Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-6 pr-14 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <User size={22} color="#c7c5d4" className="absolute right-5" />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-1">Mobile Number</label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobile(val);
                  }}
                  className="w-full h-14 bg-white rounded-full pl-6 pr-14 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <Phone size={22} color="#c7c5d4" className="absolute right-5" />
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>

          {/* Primary Action */}
          <button
            onClick={handleNext}
            disabled={!fullName || !mobile || loading}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!fullName || !mobile || loading) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-white text-lg font-semibold">Next Step</span>
                <Rocket size={22} color="white" />
              </>
            )}
          </button>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-xs font-bold text-[#c7c5d4] text-center max-w-[300px]">
          By continuing, you agree to our terms and conditions.
        </p>

      </main>
    </div>
  );
}
