import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, Check, ChevronDown, ExternalLink, FileText, Pencil, ShieldCheck, Sparkles, X,
} from "lucide-react";
import {
  adminApi, type ChapterDetail, type Difficulty, type Draft, type DraftEdits, type DraftStatus, type Job, type RoundName,
} from "../adminApi";
import {
  Badge, Button, Card, ErrorNote, Spinner, VerificationBadge,
} from "../components/AdminUI";
import { DIFFICULTIES, DIFFICULTY_TONE, ROUND_LABELS } from "../constants";
import RoundCards from "../components/RoundCards";
import ClaudeImportPanel from "../components/ClaudeImportPanel";
import SetsPanel from "../components/SetsPanel";

const ACTIVE = ["queued", "running"];

export default function ChapterReviewScreen() {
  const { chapterId = "" } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ChapterDetail | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [tab, setTab] = useState<DraftStatus>("pending");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [pdfPage, setPdfPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [generator, setGenerator] = useState<"claude" | "gemini">("claude");
  // Round the admin clicked in step 2; null follows the automatic Quiz → Boss → Shadow order.
  const [pickedRound, setPickedRound] = useState<RoundName | null>(null);

  const loadDetail = useCallback(async () => {
    try {
      const d = await adminApi.chapter(chapterId);
      setDetail(d);
      setJob(d.latestJob);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [chapterId]);

  const loadDrafts = useCallback(async () => {
    try {
      setDrafts(await adminApi.drafts(chapterId, tab));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [chapterId, tab]);

  useEffect(() => { loadDetail(); }, [loadDetail]);
  useEffect(() => { loadDrafts(); }, [loadDrafts]);

  // Poll a running job; new drafts appear for review as each batch passes verification.
  const jobRunning = !!job && ACTIVE.includes(job.status);
  const jobId = job?.id;
  useEffect(() => {
    if (!jobRunning || !jobId) return;
    const t = setInterval(async () => {
      try {
        const j = await adminApi.job(jobId);
        setJob(j);
        loadDrafts();
        if (!ACTIVE.includes(j.status)) loadDetail();
      } catch { /* keep polling */ }
    }, 3000);
    return () => clearInterval(t);
  }, [jobRunning, jobId, loadDrafts, loadDetail]);

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const onDraftChanged = (updated: Draft) => {
    setDrafts((list) => (updated.status === tab ? list.map((d) => (d.id === updated.id ? updated : d)) : list.filter((d) => d.id !== updated.id)));
    loadDetail();
  };

  if (!detail) {
    return <div className="flex justify-center py-20">{error ? <ErrorNote message={error} /> : <Spinner className="h-8 w-8" />}</div>;
  }

  const verification = detail.verification;
  const verified = verification?.status === "verified";
  const activeRound = pickedRound ?? detail.pool.currentRound;
  const remainingTotal = activeRound ? DIFFICULTIES.reduce((n, d) => n + detail.pool.rounds[activeRound].toGenerate[d], 0) : 0;
  const shown = difficulty ? drafts.filter((d) => d.difficulty === difficulty) : drafts;
  const pdfSrc = detail.pdfViewUrl ? `${detail.pdfViewUrl}#page=${pdfPage}` : null;

  return (
    <div className="space-y-5">
      <div>
        <button onClick={() => navigate(-1)} className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{detail.chapter.name}</h1>
        <p className="text-sm text-slate-500">{detail.board} · {detail.classLevel} · {detail.subject}</p>
      </div>

      <ErrorNote message={error} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          {/* Step 1 — official verification */}
          <Card className="space-y-3">
            <StepTitle n={1} title="Verify PDF with official website" done={verified} />
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={verification?.status || (detail.s3Key ? "unchecked" : "no_pdf")} />
              {verification?.method && <span className="text-xs text-slate-500">method: {verification.method}</span>}
            </div>
            {verification?.message && <p className="text-sm text-slate-700">{verification.message}</p>}
            {verification?.officialUrl && (
              <a href={verification.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all text-xs text-blue-700 hover:underline">
                <ExternalLink className="h-3 w-3" /> {verification.officialUrl}
              </a>
            )}
            {verification?.checkedAt && (
              <p className="text-xs text-slate-400">Checked {new Date(verification.checkedAt).toLocaleString()} by {verification.checkedBy}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant={verified ? "secondary" : "primary"} disabled={!detail.s3Key} busy={busy === "verify"}
                onClick={() => run("verify", async () => { await adminApi.verify(chapterId); await loadDetail(); })}>
                <ShieldCheck className="h-4 w-4" /> {verification ? "Re-verify" : "Verify now"}
              </Button>
            </div>
            {(verification?.status === "needs_manual_review" || verification?.status === "not_found") && (
              <ManualVerify onSubmit={(note) => run("manual", async () => { await adminApi.verifyManually(chapterId, note); await loadDetail(); })} busy={busy === "manual"} />
            )}
          </Card>

          {/* Step 2 — AI generation */}
          <Card className="space-y-4">
            <StepTitle n={2} title="Generate questions from the PDF" done={remainingTotal === 0} />
            <RoundCards pool={detail.pool} setNumber={detail.sets.length + 1} selected={activeRound}
              onSelect={(r) => setPickedRound(r === detail.pool.currentRound ? null : r)} />
            <p className="text-sm text-slate-600">
              {activeRound
                ? <>Now generating the <b>{ROUND_LABELS[activeRound]}</b> round ({detail.tiers[detail.pool.tier].label}).{" "}
                    {pickedRound
                      ? <button onClick={() => setPickedRound(null)} className="text-blue-700 hover:underline">Back to automatic order</button>
                      : "Click another round above to generate for it instead."}</>
                : "All three rounds have their questions. Finish the review, then build the set in step 4."}
            </p>
            <p className="text-xs text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> approved in pool &nbsp;
              <span className="inline-block h-2 w-2 rounded-full bg-amber-300" /> waiting for review. Rejected questions free up their slot for regeneration.
            </p>
            <div className="flex w-fit rounded-xl bg-slate-100 p-1 text-sm">
              {([["claude", "Claude (skill)"], ["gemini", "Gemini (automatic)"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setGenerator(key)}
                  className={`rounded-lg px-3 py-1.5 font-semibold ${generator === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                  {label}
                </button>
              ))}
            </div>
            {!verified && <p className="text-xs text-amber-700">Verify the PDF first (step 1).</p>}
            {remainingTotal === 0 && (
              <p className="text-xs text-emerald-700">
                {activeRound ? `The ${ROUND_LABELS[activeRound]} round has (or is reviewing) all its questions. Pick another round above.` : "The pool has (or is reviewing) enough questions for the next set."}
              </p>
            )}
            {generator === "claude" ? (
              <ClaudeImportPanel chapterId={chapterId} pdfUrl={detail.pdfViewUrl} disabled={!verified || remainingTotal === 0}
                currentRound={activeRound}
                onImported={() => { setTab("pending"); loadDetail(); loadDrafts(); }} />
            ) : (
              <>
                <Button disabled={!verified || jobRunning || remainingTotal === 0} busy={busy === "generate"}
                  onClick={() => run("generate", async () => { setJob(await adminApi.generate(chapterId, pickedRound)); setTab("pending"); })}>
                  <Sparkles className="h-4 w-4" />
                  {remainingTotal === 0 ? "This round is full" : `Generate ${remainingTotal} ${activeRound ? ROUND_LABELS[activeRound] : ""} question${remainingTotal > 1 ? "s" : ""}`}
                </Button>
                {job && <JobPanel job={job} />}
              </>
            )}
          </Card>

          {/* Step 3 — human review */}
          <Card className="space-y-4">
            <StepTitle n={3} title="Review — only approved questions enter the pool" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1 text-sm">
                {(["pending", "approved", "rejected"] as DraftStatus[]).map((s) => {
                  const n = DIFFICULTIES.reduce((sum, d) => sum + (detail.draftCounts[s]?.[d] || 0), 0);
                  return (
                    <button key={s} onClick={() => setTab(s)}
                      className={`rounded-lg px-3 py-1.5 font-semibold capitalize ${tab === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                      {s} <span className="text-xs text-slate-400">{n}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-1">
                {(["", ...DIFFICULTIES] as (Difficulty | "")[]).map((d) => (
                  <button key={d || "all"} onClick={() => setDifficulty(d)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${difficulty === d ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                    {d || "All"}
                  </button>
                ))}
              </div>
            </div>

            {shown.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                {tab === "pending" ? (jobRunning ? "Questions will appear here as they pass verification…" : "Nothing waiting for review.") : `No ${tab} questions.`}
              </div>
            )}
            <div className="space-y-3">
              {shown.map((d) => (
                <DraftCard key={d.id} draft={d} onChanged={onDraftChanged} onShowPage={setPdfPage} />
              ))}
            </div>
          </Card>

          {/* Step 4 — build test sets */}
          <Card className="space-y-3">
            <StepTitle n={4} title="Build test sets (Quiz · Boss · Shadow)" done={detail.sets.length > 0 && !detail.pool.canBuild} />
            <SetsPanel detail={detail} onChanged={() => { loadDetail(); loadDrafts(); }} />
          </Card>
        </div>

        {/* Source PDF */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> Chapter PDF · page {pdfPage}</span>
              {detail.pdfViewUrl && (
                <a href={detail.pdfViewUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-700 hover:underline">Open</a>
              )}
            </div>
            {pdfSrc ? (
              <iframe key={pdfSrc} src={pdfSrc} title="Chapter PDF" className="h-[75vh] w-full bg-slate-100" />
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">No PDF linked to this chapter.</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ n, title, done }: { n: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-emerald-600 text-white" : "bg-primary-fixed text-primary"}`}>
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </span>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function ManualVerify({ onSubmit, busy }: { onSubmit: (note: string) => void; busy: boolean }) {
  const [note, setNote] = useState("");
  return (
    <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs text-amber-900">
        Automatic comparison was not possible. Open both PDFs, compare them yourself, and describe what you checked.
      </p>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
        placeholder="e.g. Compared all 14 pages with GSSTB Std 8 Science 2026 edition, identical."
        className="w-full rounded-lg border border-amber-300 bg-white px-2 py-1.5 text-sm outline-none" />
      <Button variant="secondary" disabled={note.trim().length < 10} busy={busy} onClick={() => onSubmit(note.trim())}>
        Mark as verified
      </Button>
    </div>
  );
}

function JobPanel({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const running = ACTIVE.includes(job.status);
  const tone = job.status === "completed" ? "green" : job.status === "failed" ? "red" : job.status === "partial" ? "amber" : "blue";
  return (
    <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tone}>{running && <Spinner className="h-3 w-3" />} {job.status}</Badge>
        {job.round ? <span className="text-xs text-slate-500">round {job.round}</span> : null}
        {job.model && <span className="text-xs text-slate-500">{job.model} → verified by {job.verifierModel}</span>}
      </div>
      <p className="text-slate-700">{job.message}</p>
      {job.targets && (
        <p className="text-xs text-slate-600">
          Accepted: {DIFFICULTIES.map((d) => `${d} ${job.accepted?.[d] || 0}/${job.targets[d]}`).join(" · ")}
          {job.rejectedCount ? ` · ${job.rejectedCount} auto-rejected` : ""}
        </p>
      )}
      {job.sourceTextMethod === "ai_transcription" && (
        <p className="flex items-center gap-1 text-xs text-amber-700">
          <AlertTriangle className="h-3 w-3" /> PDF text was not machine-readable, so source quotes were checked against an AI transcription. Check quotes against the PDF carefully.
        </p>
      )}
      {!!job.rejections?.length && (
        <div>
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} /> Why questions were auto-rejected
          </button>
          {open && (
            <ul className="mt-2 max-h-64 space-y-2 overflow-auto">
              {job.rejections.slice().reverse().map((r, i) => (
                <li key={i} className="rounded-lg bg-white p-2 text-xs">
                  <div className="text-slate-800">{r.question}</div>
                  <div className="mt-1 text-red-700">
                    [{r.difficulty} · {r.stage}] {r.reasons.join("; ")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function DraftCard({ draft, onChanged, onShowPage }: { draft: Draft; onChanged: (d: Draft) => void; onShowPage: (p: number) => void }) {
  const [mode, setMode] = useState<"view" | "edit" | "reject">("view");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [form, setForm] = useState<Required<DraftEdits>>({
    question: draft.question, options: [...draft.options], answer: draft.answer, explanation: draft.explanation, difficulty: draft.difficulty,
  });
  const rejectInput = useRef<HTMLInputElement>(null);

  useEffect(() => { if (mode === "reject") rejectInput.current?.focus(); }, [mode]);

  const act = async (key: string, fn: () => Promise<Draft>) => {
    setBusy(key);
    setError(null);
    try {
      const updated = await fn();
      setMode("view");
      onChanged(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const setOption = (i: number, value: string) => {
    const options = [...form.options];
    const wasAnswer = form.options[i] === form.answer;
    options[i] = value;
    setForm({ ...form, options, answer: wasAnswer ? value : form.answer });
  };

  // Send only what the reviewer actually changed, so unedited approvals stay unedited.
  const changes = (): DraftEdits => {
    const out: DraftEdits = {};
    if (form.question !== draft.question) out.question = form.question;
    if (form.options.join("\u0000") !== draft.options.join("\u0000")) out.options = form.options;
    if (form.answer !== draft.answer) out.answer = form.answer;
    if (form.explanation !== draft.explanation) out.explanation = form.explanation;
    if (form.difficulty !== draft.difficulty) out.difficulty = form.difficulty;
    return out;
  };

  const v = draft.verification;
  const pending = draft.status === "pending";

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={DIFFICULTY_TONE[draft.difficulty]}>{draft.difficulty}</Badge>
        {draft.targetRound && <Badge tone="slate">{ROUND_LABELS[draft.targetRound]} round</Badge>}
        {v && v.correct_option_count === 1 && v.answerable_from_chapter && (
          <Badge tone="green"><Check className="h-3 w-3" /> Verifier agreed</Badge>
        )}
        {draft.quoteScore != null && (
          <Badge tone={draft.quoteScore >= 0.99 ? "green" : "amber"}>Quote match {Math.round(draft.quoteScore * 100)}%</Badge>
        )}
        {(draft.sourceTextMethod === "ai_transcription" || draft.sourceTextMethod === "unchecked") && <Badge tone="amber">Check quote in PDF</Badge>}
        {draft.generator?.startsWith("claude") && <Badge tone="violet">Claude skill</Badge>}
        {draft.editedByHuman && <Badge tone="slate">Edited</Badge>}
      </div>

      {mode === "edit" ? (
        <div className="space-y-2">
          <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={2}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm font-semibold outline-none focus:border-primary" />
          {form.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2">
              <input type="radio" checked={form.answer === opt} onChange={() => setForm({ ...form, answer: opt })} title="Correct answer" />
              <input value={opt} onChange={(e) => setOption(i, e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-primary" />
            </label>
          ))}
          <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Explanation"
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-primary" />
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm">
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      ) : (
        <>
          <p className="font-semibold text-slate-900">{draft.question}</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {draft.options.map((opt, i) => (
              <li key={i} className={`rounded-lg px-3 py-1.5 text-sm ${opt === draft.answer ? "bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-200" : "bg-slate-50 text-slate-700"}`}>
                {String.fromCharCode(65 + i)}. {opt}
              </li>
            ))}
          </ul>
          {draft.explanation && <p className="mt-2 text-sm text-slate-600">{draft.explanation}</p>}
        </>
      )}

      <blockquote className="mt-3 border-l-4 border-primary-fixed-dim bg-primary-fixed/30 px-3 py-2 text-sm italic text-slate-700">
        “{draft.sourceQuote}”
        <button onClick={() => onShowPage(draft.sourcePage)} className="ml-2 not-italic text-xs font-semibold text-blue-700 hover:underline">
          page {draft.sourcePage} →
        </button>
      </blockquote>
      {v?.issues && <p className="mt-2 text-xs text-amber-700">Verifier note: {v.issues}</p>}
      {draft.status === "rejected" && <p className="mt-2 text-xs text-red-700">Rejected: {draft.rejectReason} ({draft.reviewedBy})</p>}
      {draft.status === "approved" && (
        <p className="mt-2 text-xs text-emerald-700">
          Approved by {draft.reviewedBy} · {draft.setNumber ? `Set ${draft.setNumber}, ${draft.round} round` : "waiting for the set to be built"}
        </p>
      )}

      {error && <div className="mt-2"><ErrorNote message={error} /></div>}

      {pending && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {mode === "view" && (
            <>
              <Button variant="success" busy={busy === "approve"} onClick={() => act("approve", () => adminApi.approve(draft.id))}>
                <Check className="h-4 w-4" /> Approve
              </Button>
              <Button variant="secondary" onClick={() => setMode("edit")}><Pencil className="h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={() => setMode("reject")}><X className="h-4 w-4" /> Reject</Button>
            </>
          )}
          {mode === "edit" && (
            <>
              <Button variant="success" busy={busy === "approve"} onClick={() => act("approve", () => adminApi.approve(draft.id, changes()))}>
                <Check className="h-4 w-4" /> Save & approve
              </Button>
              <Button variant="secondary" busy={busy === "save"} onClick={() => act("save", () => adminApi.updateDraft(draft.id, changes()))}>
                Save
              </Button>
              <Button variant="ghost" onClick={() => setMode("view")}>Cancel</Button>
            </>
          )}
          {mode === "reject" && (
            <>
              <input ref={rejectInput} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (e.g. two options could be correct)"
                onKeyDown={(e) => e.key === "Enter" && act("reject", () => adminApi.reject(draft.id, reason))}
                className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-red-400" />
              <Button variant="danger" busy={busy === "reject"} onClick={() => act("reject", () => adminApi.reject(draft.id, reason))}>
                Confirm reject
              </Button>
              <Button variant="ghost" onClick={() => setMode("view")}>Cancel</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
