import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { clearSignupState, getSignupState, saveSignupState } from "../signupState";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, User, Phone, Mail, MapPin } from "lucide-react";
import { NRScholarNavBrand } from "../../../components/NRScholarNavBrand";
import { apiFetch } from "../../../api";
import { formatMobileDisplay, parseMobileInput } from "../../../utils/mobileFormatter";
import { progressFillStyle } from "../../../utils/progressBar";

export default function SignupStep1Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const saved = getSignupState();
  const [fullName, setFullName] = useState(() => searchParams.get("fullName") || saved.fullName || "");
  const [mobile, setMobile] = useState(() => {
    const raw = searchParams.get("mobile") || saved.mobile || "";
    return raw.replace(/\D/g, "").slice(0, 10);
  });
  const [email, setEmail] = useState(() => searchParams.get("email") || saved.email || "");
  const [address, setAddress] = useState(() => searchParams.get("address") || saved.address || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextCursorPosRef = useRef<number | null>(null);

  // Restore cursor position after formatting state update to prevent cursor jumping
  useLayoutEffect(() => {
    if (nextCursorPosRef.current !== null && inputRef.current) {
      const pos = nextCursorPosRef.current;
      inputRef.current.setSelectionRange(pos, pos);
      nextCursorPosRef.current = null;
    }
  });

  // Automatically persist any edits to session storage so hardware back button retains state
  useEffect(() => {
    saveSignupState({
      fullName,
      mobile,
      email,
      address
    });
  }, [fullName, mobile, email, address]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { clean, nextCursor } = parseMobileInput(
      e.target.value,
      mobile,
      e.target.selectionStart ?? e.target.value.length
    );
    setMobile(clean);
    nextCursorPosRef.current = nextCursor;
  };

  const validateEmail = (mail: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(mail.trim());
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
    if (!email.trim()) {
      setErrorMsg("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address (e.g. parent@example.com)");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter your street address");
      return;
    }
    if (address.trim().length < 5) {
      setErrorMsg("Please enter a complete street address");
      return;
    }
    
    setErrorMsg("");
    setLoading(true);
    
    try {
      const response = await apiFetch("/api/users/check-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: cleanMobile,
          email: email.trim().toLowerCase(),
          parentEmail: email.trim().toLowerCase()
        })
      });
      const data = await response.json();
      setLoading(false);
      
      if (response.status === 422 || (data.detail && data.detail === "Invalid mobile number format")) {
        setErrorMsg("Invalid mobile number format");
        return;
      }
      
      if (data.exists) {
        setErrorMsg(data.message || "Mobile number or email already registered");
      } else {
        saveSignupState({
          fullName: fullName.trim(),
          mobile: cleanMobile,
          email: email.trim().toLowerCase(),
          address: address.trim()
        });

        const params = new URLSearchParams(searchParams);
        params.set("fullName", fullName.trim());
        params.set("mobile", cleanMobile);
        params.set("email", email.trim().toLowerCase());
        params.set("address", address.trim());
        navigate(`/signup-step2?${params.toString()}`);
      }
    } catch (e) {
      setLoading(false);
      setErrorMsg("Unable to connect. Is the server running?");
    }
  };

  const isFormValid = Boolean(fullName.trim() && mobile.length === 10 && email.trim() && address.trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#f7f9fb] font-sans relative pb-10">
      
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-[rgba(255,255,255,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40">
        <NRScholarNavBrand onBack={() => { clearSignupState(); navigate("/login"); }} />
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto">
        
        {/* Step Indicator */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#006a62] tracking-[1px]">STEP 1 OF 3</span>
            <span className="text-xs font-bold text-[#767683]">33%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={progressFillStyle(33)} />
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

          <form className="flex flex-col gap-4 mb-6" onSubmit={handleNext}>
            
            {/* Parent Name */}
            <div className="flex flex-col gap-1.5">
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

            {/* Mobile Number with 5-5 Grouping */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-1">Mobile Number</label>
              <div className="relative w-full flex items-center">
                {/* Leading Icon (Left side, primary blue #1E255E) */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <Phone size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter mobile number"
                  value={formatMobileDisplay(mobile)}
                  maxLength={11}
                  onChange={handleMobileChange}
                  className="w-full h-14 bg-white rounded-full pl-11 pr-4 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20 focus:border-[#1E255E] transition-all placeholder:text-[#c7c5d4]"
                />
              </div>
            </div>

            {/* Parent Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-1">Parent Email</label>
              <div className="relative w-full flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <Mail size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-11 pr-4 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20 focus:border-[#1E255E] transition-all placeholder:text-[#c7c5d4]"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#767683] ml-1">Street Address</label>
              <div className="relative w-full flex items-start">
                <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none text-[#1E255E]">
                  <MapPin size={20} strokeWidth={2} className="text-[#1E255E]" />
                </div>
                <textarea
                  rows={2}
                  placeholder="Enter Street Address, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white rounded-2xl pl-11 pr-4 py-3.5 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:ring-2 focus:ring-[#1E255E]/20 focus:border-[#1E255E] transition-all placeholder:text-[#c7c5d4] resize-none"
                />
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>

          {/* Primary Action */}
          <button
            onClick={handleNext}
            disabled={!isFormValid || loading}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!isFormValid || loading) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
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
