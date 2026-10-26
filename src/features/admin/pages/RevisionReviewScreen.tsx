import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, ChevronDown, ChevronRight, Pencil, RotateCcw, X } from "lucide-react";
import { adminApi, type Revision, type RevisionList, type RevisionStatus, type RevisionSummaryRow, type RevisionVerdict } from "../adminApi";
import { Badge, Button, Card, ErrorNote, Spinner } from "../components/AdminUI";

const PAGE_SIZE = 10;

const VERDICT: Record<RevisionVerdict, { label: string; tone: "green" | "blue" | "violet" | "red" }> = {
  ATTACH_PASSAGE: { label: "Passage attached", tone: "blue" },
  STANDALONE: { label: "Made standalone", tone: "green" },
  NEEDS_IMAGE: { label: "Needs image", tone: "violet" },
  REJECT: { label: "AI suggests reject", tone: "red" },
};
const STATUS: Record<RevisionStatus, { label: string; tone: "amber" | "green" | "red" }> = {
  pending: { label: "Pending", tone: "amber" },
  approved: { label: "Approved", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

function Select({ label, value, onChange, options, disabled }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className="block min-w-[140px] flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 disabled:bg-slate-100">
        <option value="">All</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Mcq({ question, options, answer }: { question: string; options: string[]; answer: string }) {
  return (
    <div className="space-y-2">
      <p className="whitespace-pre-line text-sm font-semibold text-slate-900">{question || <span className="text-slate-400">(no question)</span>}</p>
      <ul className="space-y-1">
        {options.map((o, i) => (
          <li key={i} className={`rounded-lg border px-2.5 py-1.5 text-sm ${o === answer ? "border-emerald-300 bg-emerald-50 font-semibold text-emerald-800" : "border-slate-200 text-slate-700"}`}>{o}</li>
        ))}
      </ul>
    </div>
  );
}

function ImagePreview({ image }: { image: Revision["image"] }) {
  if (image.svg) {
    return <img alt="Question illustration" className="max-h-72 w-full rounded-xl border border-slate-200 bg-white object-contain p-2" src={`data:image/svg+xml;utf8,${encodeURIComponent(image.svg)}`} />;
  }
  if (!image.spec) return null;
  return (
    <div className="rounded-xl border border-dashed border-violet-300 bg-violet-50 p-3 text-sm text-violet-900">
      <p className="font-semibold">Image still to be created{image.type ? ` (${image.type})` : ""}</p>
      <p className="mt-1">{image.spec}</p>
    </div>
  );
}

function RevisionCard({ rev, onChange }: { rev: Revision; onChange: (r: Revision) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showPassage, setShowPassage] = useState(true);
  const [draft, setDraft] = useState({ question: rev.proposed.question, options: rev.proposed.options.join("\n"), answer: rev.proposed.answer, passage: rev.passage });
  const v = VERDICT[rev.verdict];
  const isReject = rev.verdict === "REJECT";
  const imageMissing = rev.verdict === "NEEDS_IMAGE" && !rev.image.svg;

  const editsFromDraft = () => ({
    question: draft.question,
    options: draft.options.split("\n").map((o) => o.trim()).filter(Boolean),
    answer: draft.answer,
    passage: draft.passage,
  });

  const run = async (fn: () => Promise<Revision | void>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fn();
      if (res) onChange(res);
      after?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const approve = () => run(() => adminApi.approveRevision(rev.id, editing ? editsFromDraft() : undefined), () => setEditing(false));
  const reject = () => run(() => adminApi.rejectRevision(rev.id));
  const saveEdit = () => run(() => adminApi.editRevision(rev.id, editsFromDraft()), () => setEditing(false));
  const reset = () => run(async () => { await adminApi.resetRevision(rev.id); return { ...rev, status: "pending" } as Revision; });

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={v.tone}>{v.label}</Badge>
        <Badge tone={STATUS[rev.status].tone}>{STATUS[rev.status].label}</Badge>
        {rev.editedByHuman && <Badge tone="slate">Edited</Badge>}
        <span className="text-xs text-slate-500">{rev.board} · {rev.classLevel} · {rev.subject} · {rev.chapterName}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Original ({rev.originalType || "dependent"})</p>
          <Mcq {...rev.original} />
        </div>

        <div className="space-y-3 rounded-xl border border-primary/30 bg-white p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">What the student will see</p>
          {isReject ? (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">AI suggests not using this question. {rev.reason}</p>
          ) : editing ? (
            <div className="space-y-2">
              {rev.passage !== "" || draft.passage ? (
                <label className="block text-xs font-semibold text-slate-600">Passage
                  <textarea value={draft.passage} onChange={(e) => setDraft({ ...draft, passage: e.target.value })} rows={6} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" />
                </label>
              ) : null}
              <label className="block text-xs font-semibold text-slate-600">Question
                <textarea value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">Options (one per line, exactly 4)
                <textarea value={draft.options} onChange={(e) => setDraft({ ...draft, options: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">Correct answer (must match an option exactly)
                <input value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" />
              </label>
            </div>
          ) : (
            <>
              {rev.passage && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/60">
                  <button type="button" onClick={() => setShowPassage((s) => !s)} className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-indigo-800">
                    <span>📖 Read the passage{rev.passagePages ? ` · page ${rev.passagePages}` : ""}</span>
                    {showPassage ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {showPassage && <p className="max-h-60 overflow-auto whitespace-pre-line px-3 pb-3 text-sm leading-relaxed text-slate-800">{rev.passage}</p>}
                </div>
              )}
              <ImagePreview image={rev.image} />
              <Mcq {...rev.proposed} />
            </>
          )}
        </div>
      </div>

      {!isReject && rev.reason && <p className="text-xs text-slate-500">AI note: {rev.reason}</p>}
      <ErrorNote message={error} />

      <div className="flex flex-wrap items-center gap-2">
        {rev.status === "pending" ? (
          <>
            {!isReject && (
              <Button variant="success" onClick={approve} busy={busy} disabled={imageMissing} title={imageMissing ? "Image not created yet" : undefined}>
                <Check className="h-4 w-4" /> Approve
              </Button>
            )}
            <Button variant="danger" onClick={reject} busy={busy}><X className="h-4 w-4" /> {isReject ? "Confirm reject" : "Reject"}</Button>
            {!isReject && (editing ? (
              <>
                <Button variant="secondary" onClick={saveEdit} busy={busy}>Save edit</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /> Edit</Button>
            ))}
          </>
        ) : (
          <>
            <span className="text-xs text-slate-500">{rev.reviewedBy ? `by ${rev.reviewedBy}` : ""}</span>
            <Button variant="ghost" onClick={reset} busy={busy}><RotateCcw className="h-4 w-4" /> Undo</Button>
          </>
        )}
      </div>
    </Card>
  );
}

export default function RevisionReviewScreen() {
  const [params, setParams] = useSearchParams();
  const f = {
    board: params.get("board") || "",
    classLevel: params.get("classLevel") || "",
    subject: params.get("subject") || "",
    chapter: params.get("chapter") || "",
    verdict: params.get("verdict") || "",
    status: params.get("status") || "pending",
    page: params.get("page") || "1",
  };
  const [filters, setFilters] = useState<{ boards: string[]; classLevels: string[]; subjects: string[]; chapters: string[] }>({ boards: [], classLevels: [], subjects: [], chapters: [] });
  const [data, setData] = useState<RevisionList | null>(null);
  const [summary, setSummary] = useState<RevisionSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFilter = (next: Partial<typeof f>) => {
    const merged = { ...f, page: "1", ...next };
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v)));
  };

  useEffect(() => {
    adminApi.revisionFilters(f.board, f.classLevel).then(setFilters, (e) => setError(e.message));
  }, [f.board, f.classLevel]);

  const key = params.toString();
  const loadSummary = () => adminApi.revisionSummary().then(setSummary, () => undefined);
  useEffect(() => {
    setLoading(true);
    setError(null);
    adminApi.revisions({ ...Object.fromEntries(Object.entries(f).filter(([k]) => k !== "page")), status: f.status === "all" ? "" : f.status, page: f.page, limit: String(PAGE_SIZE) })
      .then(setData, (e) => setError(e.message))
      .finally(() => setLoading(false));
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const totals = useMemo(() => {
    const t: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
    summary.filter((r) => (!f.board || r.board === f.board) && (!f.classLevel || r.classLevel === f.classLevel)).forEach((r) => { t[r.status] += r.count; });
    return t;
  }, [summary, f.board, f.classLevel]);

  const replace = (r: Revision) => {
    setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === r.id ? r : x)) } : d));
    loadSummary();
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const pageNo = Number(f.page) || 1;
  const approvable = (data?.items || []).filter((r) => r.status === "pending" && r.verdict !== "REJECT" && !(r.verdict === "NEEDS_IMAGE" && !r.image.svg));

  const approveVisible = async () => {
    if (!approvable.length || !window.confirm(`Approve ${approvable.length} question(s) shown on this page?`)) return;
    setLoading(true);
    try {
      for (const r of approvable) replace(await adminApi.approveRevision(r.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Modified Questions · Review</h1>
        <p className="text-sm text-slate-500">
          AI-modified versions of textbook-dependent questions. Approving or rejecting here only records your decision; live questions are not changed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Badge tone="amber">Pending {totals.pending}</Badge>
        <Badge tone="green">Approved {totals.approved}</Badge>
        <Badge tone="red">Rejected {totals.rejected}</Badge>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Select label="Board" value={f.board} options={filters.boards.map((b) => ({ value: b, label: b }))} onChange={(v) => setFilter({ board: v, classLevel: "", subject: "", chapter: "" })} />
          <Select label="Class" value={f.classLevel} options={filters.classLevels.map((c) => ({ value: c, label: c }))} onChange={(v) => setFilter({ classLevel: v, subject: "", chapter: "" })} />
          <Select label="Subject" value={f.subject} options={filters.subjects.map((s) => ({ value: s, label: s }))} onChange={(v) => setFilter({ subject: v, chapter: "" })} />
          <Select label="Chapter" value={f.chapter} options={filters.chapters.map((c) => ({ value: c, label: c }))} onChange={(v) => setFilter({ chapter: v })} />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Select label="Type" value={f.verdict} options={(Object.keys(VERDICT) as RevisionVerdict[]).map((k) => ({ value: k, label: VERDICT[k].label }))} onChange={(v) => setFilter({ verdict: v })} />
          <Select label="Status" value={f.status === "all" ? "" : f.status} options={(Object.keys(STATUS) as RevisionStatus[]).map((k) => ({ value: k, label: STATUS[k].label }))} onChange={(v) => setFilter({ status: v || "all" })} />
          <Button variant="secondary" onClick={approveVisible} disabled={!approvable.length || loading}>Approve all {approvable.length} on this page</Button>
        </div>
      </Card>

      <ErrorNote message={error} />
      {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner /> Loading…</div>}

      {data && <p className="text-sm text-slate-500">{data.total} question(s) · page {pageNo} of {pages}</p>}
      <div className="space-y-4">
        {data?.items.map((r) => <RevisionCard key={r.id + r.status} rev={r} onChange={replace} />)}
        {data && data.items.length === 0 && !loading && <Card><p className="text-sm text-slate-500">Nothing to review with these filters.</p></Card>}
      </div>

      {data && pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={pageNo <= 1} onClick={() => setParams({ ...Object.fromEntries(params.entries()), page: String(pageNo - 1) })}>Previous</Button>
          <span className="text-sm text-slate-600">{pageNo} / {pages}</span>
          <Button variant="secondary" disabled={pageNo >= pages} onClick={() => setParams({ ...Object.fromEntries(params.entries()), page: String(pageNo + 1) })}>Next</Button>
        </div>
      )}
    </div>
  );
}
