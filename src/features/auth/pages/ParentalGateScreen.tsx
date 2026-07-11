import { AlertCircle, ArrowLeft, CheckCircle, Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

export default function ParentalGateScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"loading" | "set" | "enter" | "reset-step1" | "reset-step2">("loading");
  const [pin, setPin] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function checkPinStatus() {
      try {
        const res = await apiFetch("/api/parent/controls");
        const json = await res.json();
        if (json.success && json.data?.isPinSet) {
          setMode("enter");
        } else {
          setMode("set");
        }
      } catch (err) {
        console.error("Failed to check PIN status", err);
        setMode("set");
      }
    }
    checkPinStatus();
  }, []);

  const addPin = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      
      if (mode === "enter" && nextPin.length === 4) {
        validatePin(nextPin);
      } else if (mode === "reset-step1" && nextPin.length === 4) {
        setTempPin(nextPin);
        setTimeout(() => {
          setPin("");
          setMode("reset-step2");
        }, 300);
      } else if (mode === "reset-step2" && nextPin.length === 4) {
        if (nextPin === tempPin) {
          doResetPin(nextPin);
        } else {
          setErrorMsg("PINs do not match. Try again.");
          setTimeout(() => {
            setPin("");
            setMode("reset-step1");
          }, 1000);
        }
      }
    }
  };

  const removePin = () => {
    setPin(pin.slice(0, -1));
    setErrorMsg("");
  };

  const validatePin = async (enteredPin: string) => {
    try {
      const res = await apiFetch("/api/parent/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin })
      });
      const json = await res.json();
      
      if (json.success) {
        setSuccessMsg("Access Granted");
        setTimeout(() => navigate("/parent/dashboard"), 1000);
      } else {
        const errorDetail = typeof json.detail === 'string' ? json.detail : (json.detail ? JSON.stringify(json.detail) : "");
        setErrorMsg(json.message || errorDetail || "Incorrect PIN");
        setTimeout(() => setPin(""), 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification Failed");
      setTimeout(() => setPin(""), 1000);
    }
  };

  const handleSetPin = async () => {
    if (pin.length === 4) {
      try {
        const res = await apiFetch("/api/parent/set-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin })
        });
        const json = await res.json();
        
        if (json.success) {
          setSuccessMsg("PIN Set Successfully!");
          setTimeout(() => navigate("/parent/dashboard"), 1000);
        } else {
          const errorDetail = typeof json.detail === 'string' ? json.detail : (json.detail ? JSON.stringify(json.detail) : "");
          setErrorMsg(json.message || errorDetail || "Failed to set PIN");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to set PIN");
      }
    }
  };

  const doResetPin = async (newPin: string) => {
    try {
      const res = await apiFetch("/api/parent/set-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin })
      });
      const json = await res.json();
      
      if (json.success) {
        setSuccessMsg("PIN Reset Successfully!");
        setTimeout(() => navigate("/parent/dashboard"), 1000);
      } else {
        const errorDetail = typeof json.detail === 'string' ? json.detail : (json.detail ? JSON.stringify(json.detail) : "");
        setErrorMsg(json.message || errorDetail || "Failed to reset PIN");
        setTimeout(() => { setPin(""); setMode("reset-step1"); }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset PIN");
      setTimeout(() => { setPin(""); setMode("reset-step1"); }, 1000);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (val.length <= 10) {
      setForgotMobile(val);
    }
  };

  const handleVerifyCredentials = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!/^\d{10}$/.test(forgotMobile)) {
      setErrorMsg("Mobile number must be exactly 10 digits.");
      return;
    }
    setIsVerifying(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: forgotMobile, password: forgotPassword })
      });
      const json = await res.json();
      
      if (json.success) {
        setShowForgotModal(false);
        setForgotMobile("");
        setForgotPassword("");
        setSuccessMsg("Identity Verified! Enter new PIN.");
        setPin("");
        setMode("reset-step1");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(json.message || "Invalid mobile number or password.");
      }
    } catch (err) {
      setErrorMsg("Network error verifying identity.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && forgotMobile && forgotPassword && !isVerifying) {
      handleVerifyCredentials(e);
    }
  };

  const handleForgotPin = () => {
    setShowForgotModal(true);
  };

  if (mode === "loading") return <div className="min-h-screen bg-[#f7f9fb]" />;

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[15%] -left-12 w-64 h-64 rounded-full bg-[rgba(0,106,98,0.05)]" />
      <div className="absolute bottom-[20%] -right-24 w-80 h-80 rounded-full bg-[rgba(20,23,121,0.05)]" />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-2xl font-bold text-[#141779] tracking-tight">NR Scholar</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#141779] mb-2">
            {mode === "set" ? "Set Parent PIN" : 
             mode === "enter" ? "Enter Parent PIN" : 
             mode === "reset-step1" ? "Enter New PIN" : 
             "Confirm New PIN"}
          </h2>
          <p className="text-sm font-medium text-[#464652] max-w-[280px]">
            {mode === "set" ? "Create a 4-digit security code to keep parental controls secure." : 
             mode === "enter" ? "Enter your 4-digit security code to access parental controls." : 
             mode === "reset-step1" ? "Enter your new 4-digit PIN." : 
             "Re-enter your new 4-digit PIN to confirm."}
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex gap-5 mb-10">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isFilled ? "bg-[#006a62] border-[#006a62] scale-125" : "border-[#c7c5d4] bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Feedback Messages */}
        <div className="h-8 mb-4 flex items-center justify-center w-full">
          {errorMsg && (
            <div className="flex items-center gap-2 text-[#ba1a1a] bg-[#ffdad6] px-4 py-1.5 rounded-full text-sm font-bold">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 text-[#006a62] bg-[#d0f0ed] px-4 py-1.5 rounded-full text-sm font-bold">
              <CheckCircle size={16} />
              {successMsg}
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="bg-[rgba(255,255,255,0.7)] border-[1.5px] border-[rgba(255,255,255,0.4)] rounded-2xl p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)] w-full max-w-[320px]">
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["", "0", "delete"]
          ].map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between mb-4 last:mb-0">
              {row.map((btn, btnIndex) => (
                <button
                  key={btnIndex}
                  onClick={() => btn === "delete" ? removePin() : btn ? addPin(btn) : null}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    btn ? "hover:bg-[rgba(20,23,121,0.05)]" : ""
                  }`}
                  disabled={!btn}
                >
                  {btn === "delete" ? (
                    <Delete size={24} color="#767683" />
                  ) : (
                    <span className="text-2xl font-bold text-[#141779]">{btn}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Action Button for Set Mode */}
        {mode === "set" && (
          <div className="mt-8 w-full max-w-[320px] flex flex-col gap-4">
            <button
              onClick={handleSetPin}
              disabled={pin.length < 4}
              className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg text-white transition-opacity ${
                pin.length === 4 ? "bg-[#2d328f] hover:opacity-90" : "bg-[#2d328f] opacity-50"
              }`}
            >
              Confirm PIN
            </button>
            <button onClick={() => navigate(-1)} className="text-[#767683] text-sm font-bold hover:underline">
              Skip for now
            </button>
          </div>
        )}

        {/* Forgot Link for Enter Mode */}
        {mode === "enter" && (
          <button 
            onClick={handleForgotPin}
            className="mt-8 text-[#141779] text-sm font-bold hover:underline"
          >
            Forgot PIN?
          </button>
        )}

      </main>

      {/* Forgot PIN Modal */}
      {showForgotModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-[340px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#141779] mb-2">Verify Identity</h3>
            <p className="text-sm text-[#464652] mb-6">Enter your account credentials to reset the Parent PIN.</p>
            
            <div className="flex flex-col gap-4">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={forgotMobile}
                onChange={handleMobileChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                maxLength={10}
                pattern="[0-9]{10}"
                title="Mobile number must be exactly 10 digits"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dadc] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={forgotPassword}
                onChange={(e) => setForgotPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dadc] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                required
              />
              
              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleVerifyCredentials()}
                  disabled={isVerifying || !forgotMobile || !forgotPassword}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#006a62] disabled:opacity-50 transition-opacity flex items-center justify-center"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3.5 rounded-xl font-bold text-[#464652] hover:bg-[#f7f9fb] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
