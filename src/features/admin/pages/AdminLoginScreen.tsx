import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BookCheck } from "lucide-react";
import { adminApi, adminSession } from "../adminApi";
import { Button, ErrorNote } from "../components/AdminUI";

export default function AdminLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (adminSession.token()) return <Navigate to="/admin/question-bank" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await adminApi.login(email.trim(), password);
      navigate("/admin/question-bank", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-tertiary-container p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-2 pb-2 text-center">
          <div className="rounded-2xl bg-primary-fixed p-3 text-primary">
            <BookCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Question Bank Admin</h1>
          <p className="text-sm text-slate-500">Sign in with your Content Admin account</p>
        </div>
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          />
        </label>
        <ErrorNote message={error} />
        <Button type="submit" busy={busy} className="w-full py-2.5">
          Sign in
        </Button>
      </form>
    </div>
  );
}
