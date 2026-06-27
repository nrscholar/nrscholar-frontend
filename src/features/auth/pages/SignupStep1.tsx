import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, X, User, AtSign } from "lucide-react";

export default function SignupStep1Screen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = () => {
    navigate(`/signup-step2?fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#f7f9fb] font-sans relative pb-10">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(255,255,255,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Rocket size={28} color="#141779" />
          <h1 className="text-[22px] font-bold text-[#141779] tracking-[-0.5px]">Studysaathy</h1>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} color="#767683" />
        </button>
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
            <h2 className="text-[28px] font-bold text-[#141779] mb-2 text-center">Join the Mission</h2>
            <p className="text-base text-[#464652] font-medium text-center">
              Let's set up your parent account to guide your explorer.
            </p>
          </div>

          <form className="flex flex-col gap-5 mb-6">
            
            {/* Parent Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-1">Parent Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. Sarah Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-6 pr-14 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <User size={22} color="#c7c5d4" className="absolute right-5" />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-1">Email or Phone</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="hello@voyage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-6 pr-14 text-base font-medium text-[#191c1e] border border-[#c7c5d4] focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <AtSign size={22} color="#c7c5d4" className="absolute right-5" />
              </div>
            </div>
            
          </form>

          {/* Primary Action */}
          <button
            onClick={handleNext}
            disabled={!fullName || !email}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!fullName || !email) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            <span className="text-white text-lg font-semibold">Next Step</span>
            <Rocket size={22} color="white" />
          </button>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-xs font-bold text-[#c7c5d4] text-center max-w-[300px]">
          By continuing, you agree to our interstellar terms and conditions.
        </p>

      </main>
    </div>
  );
}
