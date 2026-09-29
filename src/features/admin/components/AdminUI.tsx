import { useEffect, type ReactNode } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { BookCheck, Loader2, LogOut } from "lucide-react";
import { adminSession, type CountsByStatus, type Difficulty } from "../adminApi";
import { DIFFICULTIES } from "../constants";

export function AdminProtectedRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    const onLogout = () => navigate("/admin/login", { replace: true });
    window.addEventListener("admin-logout", onLogout);
    return () => window.removeEventListener("admin-logout", onLogout);
  }, [navigate]);

  if (!adminSession.token()) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

function AdminHeader() {
  const navigate = useNavigate();
  const user = adminSession.user();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/admin/question-bank" className="flex items-center gap-2 font-bold text-primary">
          <BookCheck className="h-5 w-5" />
          NR Scholar · Question Bank
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">{user?.email}</span>
          <button
            onClick={() => {
              adminSession.clear();
              navigate("/admin/login", { replace: true });
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

type Tone = "green" | "red" | "amber" | "blue" | "slate" | "violet";
const TONES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${TONES[tone]}`}>{children}</span>;
}

const VERIFICATION_LABELS: Record<string, [Tone, string]> = {
  verified: ["green", "Verified"],
  mismatch: ["red", "Mismatch"],
  not_found: ["amber", "Not on official site"],
  needs_official_url: ["amber", "Needs official URL"],
  needs_manual_review: ["amber", "Manual review"],
  no_pdf: ["slate", "No PDF"],
  error: ["red", "Error"],
  unchecked: ["slate", "Not checked"],
};

export function VerificationBadge({ status }: { status: string }) {
  const [tone, label] = VERIFICATION_LABELS[status] || ["slate", status];
  return <Badge tone={tone}>{label}</Badge>;
}

/** approved / pending progress against the 10-5-10 plan, one bar per difficulty. */
export function PlanProgress({ counts, plan, compact = false }: { counts: CountsByStatus; plan: Record<Difficulty, number>; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-3 ${compact ? "gap-2" : "gap-4"}`}>
      {DIFFICULTIES.map((d) => {
        const approved = counts.approved?.[d] || 0;
        const pending = (counts.pending?.[d] || 0) + (counts.approving?.[d] || 0);
        const total = plan[d];
        return (
          <div key={d}>
            <div className={`mb-1 flex justify-between ${compact ? "text-[11px]" : "text-xs"} font-semibold text-slate-600`}>
              <span>{d}</span>
              <span>
                {approved}/{total}
                {pending > 0 && <span className="text-amber-600"> +{pending}</span>}
              </span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="bg-emerald-500" style={{ width: `${Math.min(100, (approved / total) * 100)}%` }} />
              <div className="bg-amber-300" style={{ width: `${Math.min(100 - (approved / total) * 100, (pending / total) * 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  busy,
  type = "button",
  className = "",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  disabled?: boolean;
  busy?: boolean;
  type?: "button" | "submit";
  className?: string;
  title?: string;
}) {
  const styles = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "text-slate-600 hover:bg-slate-100",
  }[variant];
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</div>;
}
