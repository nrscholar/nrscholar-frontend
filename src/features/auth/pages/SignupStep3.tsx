import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, ArrowLeft, User, Lock, Shield, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { apiFetch } from "../../../api";


export default function SignupStep3Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinLength || !hasSpecialChar) {
      setErrorMsg("Please meet all password requirements");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    setErrorMsg("");

    const fullName = searchParams.get("fullName") || "";
    const mobile = searchParams.get("mobile") || "";
    const childName = searchParams.get("childName") || "";
    const age = searchParams.get("age") || "";
    const selectedClass = searchParams.get("selectedClass") || "";
    const board = searchParams.get("board") || "";

    const finalData = {
      fullName,
      mobile,
      password,
      childName,
      childAge: age,
      childClass: selectedClass,
      childBoard: board,
    };

    console.log("Signup Payload:", finalData);

    try {
      setLoading(true);
      const response = await apiFetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          mobile,
          password,
          childName,
          childAge: age ? parseInt(age, 10) : null,
          childClass: selectedClass,
          childBoard: board
        })
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
        setErrorMsg(data.message || "Signup failed. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Unable to connect. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] via-[#f7f9fb] to-[#f7f9fb] font-sans relative pb-10 overflow-hidden">
      
      {/* Blurred decorative blobs */}
      <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-[rgba(87,250,233,0.1)] rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-[200px] h-[200px] bg-[rgba(191,194,255,0.2)] rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/signup-step2?${searchParams.toString()}`)} className="w-10 h-10 -ml-2 rounded-full bg-[#e0e0ff] flex items-center justify-center hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <Rocket size={28} color="#141779" />
          <h1 className="text-[22px] font-bold text-[#141779] tracking-[-0.5px]">NR Scholar</h1>
        </div>
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto relative z-10">
        
        {/* Step Indicator */}
        <div className="w-full mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#141779] tracking-[1px]">STEP 3 OF 3</span>
            <span className="text-xs font-bold text-[#141779]">100%</span>
          </div>
          <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#57fae9] rounded-full w-full" />
          </div>
        </div>

        <div className="flex flex-col items-center mb-6 w-full text-center">
          <h2 className="text-[28px] font-bold text-[#141779] tracking-[-0.5px] mb-2">Secure Your Cockpit</h2>
          <p className="text-base text-[#464652] font-medium">Set your access codes for the cosmic journey ahead.</p>
        </div>

        {errorMsg && (
          <div className="w-full bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Glass Form Card */}
        <div className="w-full bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          
          <form className="flex flex-col gap-5 mb-6" onSubmit={handleSignup}>
            
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#464652] ml-3 tracking-[1px]">CREATE PASSWORD</label>
              <div className="relative flex items-center">
                <Lock size={22} color="#767683" className="absolute left-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-12 pr-12 text-base font-medium text-[#191c1e] border-[1.5px] border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showPassword ? <Eye size={22} color="#767683" /> : <EyeOff size={22} color="#767683" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#464652] ml-3 tracking-[1px]">CONFIRM PASSWORD</label>
              <div className="relative flex items-center">
                <Shield size={22} color="#767683" className="absolute left-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-12 pr-12 text-base font-medium text-[#191c1e] border-[1.5px] border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showConfirmPassword ? <Eye size={22} color="#767683" /> : <EyeOff size={22} color="#767683" />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>

          {/* Password Validation Rules */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-2">
              {isMinLength ? (
                <CheckCircle2 size={20} color="#007168" className="fill-transparent" />
              ) : (
                <Circle size={20} color="#c7c5d4" />
              )}
              <span className="text-xs font-bold text-[#464652]">At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2 px-2">
              {hasSpecialChar ? (
                <CheckCircle2 size={20} color="#007168" className="fill-transparent" />
              ) : (
                <Circle size={20} color="#c7c5d4" />
              )}
              <span className="text-xs font-bold text-[#464652]">Include a special symbol</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full mt-6">
          <button
            onClick={handleSignup}
            disabled={!isMinLength || !hasSpecialChar || !confirmPassword || loading}
            className={`w-full h-[60px] bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_6px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!isMinLength || !hasSpecialChar || !confirmPassword || loading) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-white text-xl font-bold">Submit</span>
                <Rocket size={22} color="white" />
              </>
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
