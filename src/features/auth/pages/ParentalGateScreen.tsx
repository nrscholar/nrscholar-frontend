import { NRScholarNavBrand } from "../../../components/NRScholarNavBrand";
import { AlertCircle, ArrowLeft, CheckCircle, Delete, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { formatMobileDisplay, parseMobileInput } from "../../../utils/mobileFormatter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";
import { showInteractiveNotification } from "../../../services/pushNotificationService";

export default function ParentalGateScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetPath = searchParams.get("returnTo") || "/parent/dashboard";
  const { t } = useTranslation();
  // Default to loading to prevent premature enter-mode flashing; check API for authoritative isPinSet
  const [mode, setMode] = useState<"loading" | "set-step1" | "set-step2" | "enter" | "reset-step1" | "reset-step2">("loading");
  const [pin, setPin] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const forgotMobileInputRef = useRef<HTMLInputElement | null>(null);
  const nextForgotMobileCursorRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (nextForgotMobileCursorRef.current !== null && forgotMobileInputRef.current) {
      const pos = nextForgotMobileCursorRef.current;
      forgotMobileInputRef.current.setSelectionRange(pos, pos);
      nextForgotMobileCursorRef.current = null;
    }
  });

  useEffect(() => {
    async function checkPinStatus() {
      try {
        const res = await apiFetch("/api/parent/controls");
        const json = await res.json();
        if (json.success && json.data?.isPinSet) {
          localStorage.setItem("isParentPinSet", "true");
          setMode("enter");
        } else {
          localStorage.setItem("isParentPinSet", "false");
          setMode("set-step1");
        }
      } catch (err) {
        console.error("Failed to check PIN status", err);
        const fallback = localStorage.getItem("isParentPinSet") === "true";
        setMode(fallback ? "enter" : "set-step1");
      }
    }
    checkPinStatus();
  }, []);

  const addPin = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg("");
      
      if (mode === "enter" && nextPin.length === 4) {
        validatePin(nextPin);
      } else if (mode === "set-step1" && nextPin.length === 4) {
        setTempPin(nextPin);
        setTimeout(() => {
          setPin("");
          setMode("set-step2");
        }, 300);
      } else if (mode === "set-step2" && nextPin.length === 4) {
        if (nextPin === tempPin) {
          handleSetPin(nextPin);
        } else {
          setErrorMsg("PINs do not match. Try again.");
          setTimeout(() => {
            setPin("");
            setMode("set-step1");
          }, 1000);
        }
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
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/parent/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin })
      });
      const json = await res.json();
      
      if (json.success) {
        sessionStorage.setItem("parentPinVerified", "true");
        setErrorMsg("");
        setSuccessMsg("Access Granted");
        showInteractiveNotification(
          "Parent Access Granted 🔐",
          "Parent PIN verified successfully! Welcome to Parent Zone.",
          targetPath,
          "success"
        );
        setTimeout(() => navigate(targetPath, { replace: true }), 600);
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

  const handleSetPin = async (newPin: string) => {
    try {
      const res = await apiFetch("/api/parent/set-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin })
      });
      const json = await res.json();
      
      if (json.success) {
        localStorage.setItem("isParentPinSet", "true");
        sessionStorage.setItem("parentPinVerified", "true");
        try {
          const raw = localStorage.getItem("userData");
          if (raw) {
            const u = JSON.parse(raw);
            u.isPinSet = true;
            u.is_pin_set = true;
            localStorage.setItem("userData", JSON.stringify(u));
          }
        } catch {}
        setSuccessMsg("PIN Set Successfully!");
        showInteractiveNotification(
          "Security PIN Created 🛡️",
          "Parent security PIN set successfully!",
          targetPath,
          "success"
        );
        setTimeout(() => navigate(targetPath, { replace: true }), 1000);
      } else {
        const errorDetail = typeof json.detail === 'string' ? json.detail : (json.detail ? JSON.stringify(json.detail) : "");
        setErrorMsg(json.message || errorDetail || "Failed to set PIN");
        setTimeout(() => { setPin(""); setMode("set-step1"); }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to set PIN");
      setTimeout(() => { setPin(""); setMode("set-step1"); }, 1000);
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
        localStorage.setItem("isParentPinSet", "true");
        sessionStorage.setItem("parentPinVerified", "true");
        try {
          const raw = localStorage.getItem("userData");
          if (raw) {
            const u = JSON.parse(raw);
            u.isPinSet = true;
            u.is_pin_set = true;
            localStorage.setItem("userData", JSON.stringify(u));
          }
        } catch {}
        setSuccessMsg("PIN Reset Successfully!");
        showInteractiveNotification(
          "PIN Reset Successful 🛡️",
          "Your parent PIN has been reset successfully!",
          targetPath,
          "success"
        );
        setTimeout(() => navigate(targetPath, { replace: true }), 1000);
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
    const { clean, nextCursor } = parseMobileInput(
      e.target.value,
      forgotMobile,
      e.target.selectionStart ?? e.target.value.length
    );
    setForgotMobile(clean);
    nextForgotMobileCursorRef.current = nextCursor;
  };

  const handleVerifyCredentials = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!/^\d{10}$/.test(forgotMobile)) {
      setForgotError(t('mobile_10_digits_error', 'Mobile number must be exactly 10 digits.'));
      return;
    }
    setIsVerifying(true);
    setForgotError("");
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
        setForgotError(json.message || t('invalid_mobile_or_password', 'Invalid mobile number or password.'));
      }
    } catch (err) {
      setForgotError(t('network_error_verifying', 'Network error verifying identity.'));
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
    setForgotError("");
    setShowForgotPassword(false);
    setShowForgotModal(true);
  };

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const isCoParent = Boolean(
    currentUser?.isSecondaryParent ||
    currentUser?.isCoParent ||
    currentUser?.role === "co_parent" ||
    currentUser?.role === "secondary_parent" ||
    currentUser?.primary_parent_id
  );

  const handleBack = () => {
    const isPinVerified = sessionStorage.getItem("parentPinVerified") === "true";
    if (isCoParent) {
      if (isPinVerified) {
        navigate("/parent/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/home", { replace: true });
    }
  };

  if (mode === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-x-clip">
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-[#f7f9fb]/90 backdrop-blur-md">
          <NRScholarNavBrand onBack={handleBack} />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 z-10">
          <div className="h-7 w-44 rounded-xl animate-skeleton mb-3"></div>
          <div className="h-4 w-60 rounded-lg animate-skeleton mb-8"></div>
          <div className="flex gap-5 mb-10">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full border-2 border-[#c7c5d4]" />
            ))}
          </div>
          <div className="bg-[rgba(255,255,255,0.7)] border-[1.5px] border-[rgba(255,255,255,0.4)] rounded-2xl p-6 w-full max-w-[320px] flex flex-col gap-4">
            {[1, 2, 3, 4].map((r) => (
              <div key={r} className="flex justify-between">
                {[1, 2, 3].map((c) => (
                  <div key={c} className="w-14 h-14 rounded-full animate-skeleton" />
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative overflow-x-clip">
      {/* Decorative Background */}
      <div className="absolute top-[15%] -left-12 w-64 h-64 rounded-full bg-[rgba(0,106,98,0.05)]" />
      <div className="absolute bottom-[20%] -right-24 w-80 h-80 rounded-full bg-[rgba(20,23,121,0.05)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-[#f7f9fb]/90 backdrop-blur-md">
          <NRScholarNavBrand onBack={handleBack} />
        </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#141779] mb-2">
            {mode === "set-step1" ? t('set_parent_pin', 'Set Parent PIN') : 
             mode === "set-step2" ? t('confirm_parent_pin', 'Confirm Parent PIN') : 
             mode === "enter" ? t('enter_parent_pin', 'Enter Parent PIN') : 
             mode === "reset-step1" ? t('enter_new_pin', 'Enter New PIN') : 
             t('confirm_new_pin', 'Confirm New PIN')}
          </h2>
          <p className="text-sm font-medium text-[#464652] max-w-[280px]">
            {mode === "set-step1" ? t('create_pin_desc', 'Create a 4-digit security code to keep parental controls secure.') : 
             mode === "set-step2" ? t('reenter_pin_confirm', 'Re-enter your 4-digit PIN to confirm.') : 
             mode === "enter" ? t('enter_pin_access_desc', 'Enter your 4-digit security code to access parental controls.') : 
             mode === "reset-step1" ? t('enter_new_pin_desc', 'Enter your new 4-digit PIN.') : 
             t('reenter_new_pin_confirm', 'Re-enter your new 4-digit PIN to confirm.')}
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
              {t(errorMsg.toLowerCase().replace(/[^a-z0-9]/g, '_'), { defaultValue: errorMsg })}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 text-[#006a62] bg-[#d0f0ed] px-4 py-1.5 rounded-full text-sm font-bold">
              <CheckCircle size={16} />
              {t(successMsg.toLowerCase().replace(/[^a-z0-9]/g, '_'), { defaultValue: successMsg })}
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
                  id={btn === "delete" ? "pin-btn-delete" : btn ? `pin-btn-${btn}` : undefined}
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
        {(mode === "set-step1" || mode === "set-step2") && (
          <div className="mt-8 w-full max-w-[320px] flex flex-col gap-4">
            <button onClick={() => navigate(-1)} className="text-[#767683] text-sm font-bold hover:underline">
              {t('skip_for_now', 'Skip for now')}
            </button>
          </div>
        )}

        {/* Forgot Link for Enter Mode */}
        {mode === "enter" && (
          <button 
            onClick={handleForgotPin}
            className="mt-8 text-[#141779] text-sm font-bold hover:underline"
          >
            {t('forgot_pin_q', 'Forgot PIN?')}
          </button>
        )}

      </main>

      {/* Forgot PIN Modal */}
      {showForgotModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl w-full max-w-[340px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button type="button" aria-label="Close" onClick={() => setShowForgotModal(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#464652] hover:bg-[#f2f4f6] transition-colors"><X size={20} /></button>
            <h3 className="text-xl font-bold text-[#141779] mb-2">{t('verify_identity', 'Verify Identity')}</h3>
            <p className="text-sm text-[#464652] mb-6">{t('verify_credentials_desc', 'Enter your account credentials to reset the Parent PIN.')}</p>
            
            <div className="flex flex-col gap-4">
              <input
                ref={forgotMobileInputRef}
                type="tel"
                placeholder={t('mobile_number_placeholder', 'Enter mobile number')}
                value={formatMobileDisplay(forgotMobile)}
                onChange={(e) => { handleMobileChange(e); setForgotError(""); }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                maxLength={11}
                title="Mobile number must be exactly 10 digits"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dadc] focus:outline-none focus:border-[#141779] focus:ring-1 focus:ring-[#141779]"
                required
              />
              <div className="relative">
                <input
                  type={showForgotPassword ? "text" : "password"}
                  placeholder={t('password_placeholder', 'Password')}
                  value={forgotPassword}
                  onChange={(e) => { setForgotPassword(e.target.value); setForgotError(""); }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#d8dadc] focus:outline-none focus:border-[#141779] focus:ring-1 focus:ring-[#141779]"
                  required
                />
                <button
                  type="button"
                  aria-label={showForgotPassword ? t('hide_password', 'Hide password') : t('show_password', 'Show password')}
                  onClick={() => setShowForgotPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#141779] transition-colors"
                >
                  {showForgotPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {forgotError && (
                <div className="flex items-center gap-2 text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-xl text-xs font-bold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleVerifyCredentials()}
                  disabled={isVerifying || !forgotMobile || !forgotPassword}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#141779] disabled:opacity-50 transition-opacity flex items-center justify-center"
                >
                  {isVerifying ? t('verifying', 'Verifying...') : t('verify_btn', 'Verify')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3.5 rounded-xl font-bold text-[#464652] hover:bg-[#f7f9fb] transition-colors"
                >
                  {t('cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
