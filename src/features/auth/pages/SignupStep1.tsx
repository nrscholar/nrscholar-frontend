import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, ArrowLeft, User, Phone } from "lucide-react";
import { NRScholarNavBrand } from "../../../components/NRScholarNavBrand";
import { apiFetch } from "../../../api";

const formatPhoneNumber = (value: string): string => {
  const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
  if (cleanDigits.length <= 5) return cleanDigits;
  return `${cleanDigits.slice(0, 5)} - ${cleanDigits.slice(5)}`;
};

export default function SignupStep1Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState(searchParams.get("fullName") || "");
  const [mobile, setMobile] = useState(formatPhoneNumber(searchParams.get("mobile") || ""));
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validateMobile = (mobile: string) => {
    // Check for exactly 10 digits starting with 6, 7, 8, or 9
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const input = e.currentTarget;
      const { selectionStart, selectionEnd } = input;
      // If cursor is right after separator " - " (positions 6, 7, 8) without active selection
      if (
        selectionStart !== null &&
        selectionStart === selectionEnd &&
        selectionStart > 5 &&
        selectionStart <= 8
      ) {
        e.preventDefault();
        const clean = mobile.replace(/\D/g, '');
        // Delete the 5th digit (at index 4)
        const newDigits = clean.slice(0, 4) + clean.slice(5);
        const formatted = formatPhoneNumber(newDigits);
        setMobile(formatted);
        setTimeout(() => {
          input.setSelectionRange(4, 4);
        }, 0);
      }
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!fullName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!cleanMobile) {
      setErrorMsg("Please enter your mobile number");
      return;
    }
    if (cleanMobile.length !== 10) {
      setErrorMsg("Mobile number must be exactly 10 digits");
      return;
    }
    if (!/^[6-9]/.test(cleanMobile)) {
      setErrorMsg("Mobile number must start with 6, 7, 8, or 9");
      return;
    }
    
    setErrorMsg("");
    setLoading(true);
    
    try {
      const response = await apiFetch("/api/users/check-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanMobile })
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
        navigate(`/signup-step2?fullName=${encodeURIComponent(fullName.trim())}&mobile=${encodeURIComponent(cleanMobile)}`);
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
        <NRScholarNavBrand onBack={() => navigate("/login")} />
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
              <div className="relative w-full flex items-center">
                {/* Leading Icon (Left side, primary blue #1E255E) */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <User size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-11 pr-4 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20 focus:border-[#1E255E] transition-all placeholder:text-[#c7c5d4]"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-1">Mobile Number</label>
              <div className="relative w-full flex items-center">
                {/* Leading Icon (Left side, primary blue #1E255E) */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <Phone size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  maxLength={13}
                  onChange={(e) => setMobile(formatPhoneNumber(e.target.value))}
                  onKeyDown={handleMobileKeyDown}
                  className="w-full h-14 bg-white rounded-full pl-11 pr-4 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20 focus:border-[#1E255E] transition-all placeholder:text-[#c7c5d4]"
                />
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>

          {/* Primary Action */}
          <button
            onClick={handleNext}
            disabled={!fullName.trim() || mobile.replace(/\D/g, "").length !== 10 || loading}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!fullName.trim() || mobile.replace(/\D/g, '').length !== 10 || loading) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
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
