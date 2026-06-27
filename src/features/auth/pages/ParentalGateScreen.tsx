import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle, Delete } from "lucide-react";

export default function ParentalGateScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"loading" | "set" | "enter">("loading");
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check local storage for PIN
    const savedPin = localStorage.getItem("studysaathy_parent_pin");
    if (savedPin) {
      setMode("enter");
    } else {
      setMode("set");
    }
  }, []);

  const addPin = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      
      if (mode === "enter" && nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const removePin = () => {
    setPin(pin.slice(0, -1));
    setErrorMsg("");
  };

  const validatePin = (enteredPin: string) => {
    const savedPin = localStorage.getItem("studysaathy_parent_pin");
    if (enteredPin === savedPin) {
      setSuccessMsg("Access Granted");
      setTimeout(() => navigate("/parent/dashboard"), 1000);
    } else {
      setErrorMsg("Incorrect PIN");
      setTimeout(() => setPin(""), 1000);
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4) {
      localStorage.setItem("studysaathy_parent_pin", pin);
      setSuccessMsg("PIN Set Successfully!");
      setTimeout(() => navigate("/parent/dashboard"), 1000);
    }
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
          <h1 className="text-2xl font-bold text-[#141779] tracking-tight">Studysaathy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#141779] mb-2">
            {mode === "set" ? "Set Parent PIN" : "Enter Parent PIN"}
          </h2>
          <p className="text-sm font-medium text-[#464652] max-w-[280px]">
            {mode === "set"
              ? "Create a 4-digit security code to keep parental controls secure."
              : "Enter your 4-digit security code to access parental controls."}
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
          <button className="mt-8 text-[#141779] text-sm font-bold hover:underline">
            Forgot PIN?
          </button>
        )}

      </main>
    </div>
  );
}
