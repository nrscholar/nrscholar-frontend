import { useState } from "react";
import { X, Plus, Check, Sparkles, Copy, CheckCircle2, KeyRound } from "lucide-react";
import { apiFetch } from "../api";

interface ChildProfile {
  childId: string;
  childName: string;
  childAge?: number;
  childClass?: string;
  childBoard?: string;
  childPhoto?: string;
  uniqueCode?: string;
}

interface ChildSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdated: (user: any) => void;
}

export default function ChildSwitcherModal({ isOpen, onClose, user, onUserUpdated }: ChildSwitcherModalProps) {
  const [switching, setSwitching] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [linkError, setLinkError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("Class 1");
  const [newAge, setNewAge] = useState(6);
  const [newBoard, setNewBoard] = useState("CBSE");

  if (!isOpen) return null;

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLinkByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkCode.trim() || linking) return;
    setLinking(true);
    setLinkError("");
    try {
      const res = await apiFetch("/api/users/login-child-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: linkCode.trim() })
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        localStorage.setItem("userToken", json.data.token);
        localStorage.setItem("userData", JSON.stringify(json.data.user));
        sessionStorage.clear();
        onUserUpdated(json.data.user);
        setShowLinkForm(false);
        setLinkCode("");
        onClose();
        window.location.reload();
      } else {
        setLinkError(json.message || "Invalid Child Code.");
      }
    } catch (err) {
      setLinkError("Failed to link child code.");
    } finally {
      setLinking(false);
    }
  };

  const children: ChildProfile[] = user?.children || [
    {
      childId: "child_1",
      childName: user?.childName || "Child 1",
      childClass: user?.childClass || "Class 3",
      childAge: user?.childAge || 8,
      childBoard: user?.childBoard || "CBSE",
      childPhoto: user?.childPhoto || ""
    }
  ];

  const activeChildId = user?.activeChildId || children[0]?.childId || "child_1";

  const handleSwitch = async (childId: string) => {
    if (childId === activeChildId || switching) return;
    setSwitching(childId);
    try {
      const res = await apiFetch("/api/users/active-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId })
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        localStorage.setItem("userData", JSON.stringify(json.data.user));
        sessionStorage.clear(); // Clear cached subject/chapter progress for previous child
        onUserUpdated(json.data.user);
        onClose();
        window.location.reload();
      }
    } catch (e) {
      console.error("Failed to switch child", e);
    } finally {
      setSwitching(null);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || adding) return;
    setAdding(true);
    try {
      const res = await apiFetch("/api/users/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: newName.trim(),
          childClass: newClass,
          childAge: Number(newAge),
          childBoard: newBoard
        })
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        localStorage.setItem("userData", JSON.stringify(json.data.user));
        sessionStorage.clear(); // Clear cached progress
        onUserUpdated(json.data.user);
        setShowAddForm(false);
        setNewName("");
        onClose();
        window.location.reload();
      }
    } catch (e) {
      console.error("Failed to add child", e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f114a]/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-md w-full max-h-[90vh] flex flex-col p-4 sm:p-6 shadow-2xl relative border border-white/60">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#141779]">Switch Child Profile</h3>
            <p className="text-[11px] sm:text-xs text-[#767683] font-semibold mt-0.5">Select active child to customize learning path</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
          
          {/* Child Cards */}
          {!showAddForm && !showLinkForm ? (
            <div className="space-y-3">
              {children.map((c) => {
                const isActive = c.childId === activeChildId;
                const isPending = switching === c.childId;

                return (
                  <div
                    key={c.childId}
                    onClick={() => handleSwitch(c.childId)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all gap-3 ${
                      isActive 
                        ? "border-[#141779] bg-[#141779]/5 shadow-sm" 
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shadow-inner overflow-hidden shrink-0 ${
                        isActive ? "bg-[#141779] text-white" : "bg-gray-100 text-[#141779]"
                      }`}>
                        {c.childPhoto ? (
                          <img src={c.childPhoto} alt={c.childName} className="w-full h-full object-cover" />
                        ) : (
                          c.childName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-[#141779] text-sm sm:text-base truncate">{c.childName}</h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#141779] border border-indigo-100 text-[10px] font-bold">
                            {c.childClass || "Class 3"}
                          </span>
                          {c.uniqueCode && (
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(c.uniqueCode!, e)}
                              className="text-[10px] text-[#141779] bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono transition-colors"
                              title="Click to copy unique child code"
                            >
                              {copiedCode === c.uniqueCode ? (
                                <>
                                  <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                                  <span className="text-emerald-600 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={10} className="shrink-0" />
                                  <span>Code: {c.uniqueCode}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center shrink-0">
                      {isPending ? (
                        <div className="w-5 h-5 border-2 border-[#141779] border-t-transparent rounded-full animate-spin" />
                      ) : isActive ? (
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#141779] text-white flex items-center justify-center shadow-xs">
                          <Check size={16} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#141779] bg-gray-100 px-3 py-1.5 rounded-full hover:bg-[#141779] hover:text-white transition-colors">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {children.length < 2 && (
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => { setShowAddForm(true); setShowLinkForm(false); }}
                    className="w-full py-3 sm:py-3.5 border-2 border-dashed border-indigo-200 rounded-2xl text-[#141779] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-indigo-50/50 hover:border-[#141779] transition-all"
                  >
                    <Plus size={18} />
                    <span>Add Second Child Profile</span>
                  </button>
                  
                  <button
                    onClick={() => { setShowLinkForm(true); setShowAddForm(false); }}
                    className="w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-all"
                  >
                    <KeyRound size={14} className="text-[#141779]" />
                    <span>Link existing child via Unique Code</span>
                  </button>
                </div>
              )}
            </div>
          ) : showLinkForm ? (
            /* Link via Unique Child Code Form */
            <form onSubmit={handleLinkByCode} className="space-y-4">
              <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-[#141779] flex items-center gap-2">
                <KeyRound size={16} className="text-indigo-600 shrink-0" />
                <span>Enter a 6-character Unique Child Code to link an existing child to this device.</span>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#141779] uppercase tracking-wider mb-1">Unique Child Code</label>
                <input
                  type="text"
                  required
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ARY3821 or ANA6942"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 font-extrabold text-base tracking-wider uppercase text-[#141779] focus:outline-none focus:border-[#141779]"
                />
              </div>

              {linkError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg">{linkError}</p>
              )}

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkForm(false)}
                  className="flex-1 h-11 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking || !linkCode.trim()}
                  className="flex-1 h-11 bg-[#141779] text-white text-xs sm:text-sm font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {linking ? "Linking..." : "Link Child"}
                </button>
              </div>
            </form>
          ) : (
            /* Add Second Child Form */
            <form onSubmit={handleAddChild} className="space-y-4">
              <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-[#141779] flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600 shrink-0" />
                <span>Add a second child to manage learning under 1 parent account.</span>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#141779] uppercase tracking-wider mb-1">Child's Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ananya"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 font-semibold text-sm focus:outline-none focus:border-[#141779]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#141779] uppercase tracking-wider mb-1">Grade / Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 h-12 rounded-xl border border-gray-200 font-semibold text-sm focus:outline-none focus:border-[#141779] bg-white"
                  >
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#141779] uppercase tracking-wider mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={3}
                    max={16}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-4 h-12 rounded-xl border border-gray-200 font-semibold text-sm focus:outline-none focus:border-[#141779]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 font-bold text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 h-11 rounded-xl bg-[#141779] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#101362] flex items-center justify-center gap-2"
                >
                  {adding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save Child"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
