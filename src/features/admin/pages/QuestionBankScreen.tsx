import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, FileSearch, Link2, ShieldCheck } from "lucide-react";
import { adminApi, type ChapterRow } from "../adminApi";
import { Badge, Button, Card, ErrorNote, PoolProgress, Spinner, VerificationBadge } from "../components/AdminUI";

function Select({ label, value, options, onChange, disabled }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block min-w-[180px] flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-primary disabled:bg-slate-100"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function QuestionBankScreen() {
  const [params, setParams] = useSearchParams();
  const board = params.get("board") || "";
  const classLevel = params.get("classLevel") || "";
  const subjectId = params.get("subjectId") || "";

  const [boards, setBoards] = useState<string[]>([]);
  const [classLevels, setClassLevels] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[] | null>(null);
  const [officialUrl, setOfficialUrl] = useState("");
  const [savedOfficialUrl, setSavedOfficialUrl] = useState("");
  const [verifying, setVerifying] = useState<Set<string>>(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const setFilter = (next: Record<string, string>) => {
    const merged = { board, classLevel, subjectId, ...next };
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v)));
  };

  useEffect(() => {
    adminApi.filters(board, classLevel).then(
      (f) => {
        setBoards(f.boards);
        setClassLevels(f.classLevels);
        setSubjects(f.subjects);
      },
      (e) => setError(e.message)
    );
  }, [board, classLevel]);

  const loadChapters = useCallback(async () => {
    if (!subjectId) {
      setChapters(null);
      return;
    }
    try {
      const data = await adminApi.chapters(subjectId);
      setChapters(data.chapters);
      setOfficialUrl(data.officialSource?.url || "");
      setSavedOfficialUrl(data.officialSource?.url || "");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [subjectId]);

  useEffect(() => {
    setChapters(null);
    loadChapters();
  }, [loadChapters]);

  const verifyOne = async (chapterId: string) => {
    setVerifying((s) => new Set(s).add(chapterId));
    try {
      const v = await adminApi.verify(chapterId);
      setChapters((rows) => rows?.map((r) => (r.id === chapterId ? { ...r, verificationStatus: v.status, verificationScore: v.score ?? null } : r)) || rows);
      return v;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setVerifying((s) => {
        const n = new Set(s);
        n.delete(chapterId);
        return n;
      });
    }
  };

  const verifyAll = async () => {
    if (!chapters) return;
    setBulkRunning(true);
    setError(null);
    const todo = chapters.filter((c) => c.hasPdf && c.verificationStatus !== "verified");
    let ok = 0;
    for (const c of todo) {
      const v = await verifyOne(c.id);
      if (v?.status === "verified") ok++;
    }
    setNotice(`Checked ${todo.length} chapter(s): ${ok} verified.`);
    setBulkRunning(false);
  };

  const saveOfficialUrl = async () => {
    try {
      await adminApi.setOfficialSource(subjectId, officialUrl.trim());
      setSavedOfficialUrl(officialUrl.trim());
      setNotice("Official textbook URL saved. Run verification again.");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const isGseb = board.toLowerCase().includes("gseb");
  const verifiedCount = chapters?.filter((c) => c.verificationStatus === "verified").length || 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Textbook Question Bank</h1>
        <p className="text-sm text-slate-500">
          Verify each chapter PDF against the official board website, build a question pool, approve each question, then build test sets (Quiz · Boss · Shadow).
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <Select label="Board" value={board} options={boards.map((b) => ({ value: b, label: b }))}
            onChange={(v) => setFilter({ board: v, classLevel: "", subjectId: "" })} />
          <Select label="Class" value={classLevel} disabled={!board} options={classLevels.map((c) => ({ value: c, label: c }))}
            onChange={(v) => setFilter({ classLevel: v, subjectId: "" })} />
          <Select label="Subject" value={subjectId} disabled={!classLevel} options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(v) => setFilter({ subjectId: v })} />
        </div>
      </Card>

      <ErrorNote message={error} />
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
          <button className="text-emerald-700" onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {subjectId && (
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Link2 className="h-4 w-4" /> Official textbook PDF {isGseb ? "(required for GSEB)" : "(optional — NCERT links are found automatically)"}
          </div>
          <p className="text-xs text-slate-500">
            {isGseb
              ? "Paste the textbook PDF link published on the GSSTB portal (a Google Drive file link or gsstb.gujarat.gov.in). Each chapter is located inside this book by text comparison."
              : "Only set this if a chapter's NCERT file code differs from the S3 filename."}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/…/view"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <Button variant="secondary" disabled={!officialUrl.trim() || officialUrl.trim() === savedOfficialUrl} onClick={saveOfficialUrl}>
              Save URL
            </Button>
          </div>
        </Card>
      )}

      {subjectId && (
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
            <div className="text-sm text-slate-600">
              {chapters ? (
                <>
                  <b>{chapters.length}</b> chapters · <b className="text-emerald-700">{verifiedCount}</b> verified
                </>
              ) : (
                <Spinner />
              )}
            </div>
            <Button variant="secondary" busy={bulkRunning} disabled={!chapters?.length} onClick={verifyAll}>
              <ShieldCheck className="h-4 w-4" /> Verify all pending
            </Button>
          </div>

          {chapters && chapters.length === 0 && <div className="p-8 text-center text-sm text-slate-500">No chapters for this subject.</div>}

          <ul className="divide-y divide-slate-100">
            {chapters?.map((c) => (
              <li key={c.id} className="grid grid-cols-1 items-center gap-3 px-5 py-4 md:grid-cols-[1fr_180px_260px_auto]">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">{c.name}</div>
                  <div className="truncate text-xs text-slate-500">{c.pdfFilename || "No PDF linked in S3"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge status={c.verificationStatus} />
                  {c.verificationScore != null && c.verificationStatus !== "verified" && (
                    <span className="text-xs text-slate-500">{Math.round(c.verificationScore * 100)}%</span>
                  )}
                </div>
                <div>
                  <PoolProgress available={c.pool.available} required={c.pool.required} compact />
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge tone={c.setsReady ? "green" : "slate"}>{c.setsReady} set{c.setsReady === 1 ? "" : "s"} ready</Badge>
                    {c.pool.canBuild && <Badge tone="blue">Next set can be built</Badge>}
                  </div>
                  {c.latestJob && (c.latestJob.status === "running" || c.latestJob.status === "queued") && (
                    <div className="mt-1"><Badge tone="blue"><Spinner className="h-3 w-3" /> Generating</Badge></div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  {c.hasPdf && c.verificationStatus !== "verified" && (
                    <Button variant="secondary" busy={verifying.has(c.id)} onClick={() => verifyOne(c.id)}>
                      <FileSearch className="h-4 w-4" /> Verify
                    </Button>
                  )}
                  <Link
                    to={`/admin/question-bank/${c.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-container"
                  >
                    Open <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
