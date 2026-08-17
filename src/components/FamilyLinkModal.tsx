import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Users, ShieldAlert, RefreshCw } from "lucide-react";
import { apiFetch } from "../api";

interface FamilyLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FamilyLinkModal({ isOpen, onClose }: FamilyLinkModalProps) {
  const [familyCode, setFamilyCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCode = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/users/family-link/generate", { method: "POST" });
      const json = await res.json();
      if (json.success && json.familyCode) {
        setFamilyCode(json.familyCode);
      }
    } catch (e) {
      console.error("Failed to generate Family Link Code", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCode();
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    if (familyCode) {
      navigator.clipboard.writeText(familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/users/family-link/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const json = await res.json();
      if (json.success && json.familyCode) {
        setFamilyCode(json.familyCode);
        if (json.user) {
          const updatedUser = { ...json.user, familyCode: json.familyCode };
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("userDataUpdated"));
        }
      } else {
        setErrorMsg(json.detail || json.message || "Failed to regenerate code.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative select-none"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-14 h-14 bg-indigo-50 text-[#141779] rounded-2xl flex items-center justify-center mb-3">
            <Users size={28} />
          </div>

          <h3 className="text-xl font-black text-[#141779] mb-1">
            Family Link Code
          </h3>
          <p className="text-xs font-semibold text-slate-500 mb-5 leading-relaxed px-2">
            Share this Unique Code with co-parents or link another smartphone to monitor learning reports.
          </p>

          {errorMsg && (
            <div className="w-full text-xs font-bold text-red-500 mb-3 text-center bg-red-50 p-2 rounded-xl border border-red-100">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#141779] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-full bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-4 mb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black tracking-widest text-[#141779] whitespace-nowrap">
                  {familyCode || "FAM-8492"}
                </span>

                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 rounded-xl bg-[#141779] text-white text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              
              <div className="flex gap-2 justify-end border-t border-slate-200/80 pt-2.5 mt-1">
                <button
                  onClick={handleRegenerate}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-[#141779] hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Generate a new random code"
                >
                  <RefreshCw size={14} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold p-3 rounded-xl flex items-start gap-2 text-left w-full">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>
              Anyone with this Family Code and your 4-digit Parent PIN can link their phone to monitor learning reports.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider rounded-2xl mt-5 hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
