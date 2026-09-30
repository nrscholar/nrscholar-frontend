import { useState } from "react";
import { ClipboardCopy, Download, Upload } from "lucide-react";
import { adminApi, type ClaudeContext, type ImportResult, type RoundName } from "../adminApi";
import { DIFFICULTIES, ROUND_LABELS } from "../constants";
import { Badge, Button, ErrorNote } from "./AdminUI";

function buildPrompt(ctx: ClaudeContext) {
  const batchIsAll = DIFFICULTIES.every((d) => ctx.askNow[d] === ctx.remaining[d]);
  const more = batchIsAll
    ? ""
    : `\n(This is one batch. In total the next set still needs Easy ${ctx.remaining.Easy}, Medium ${ctx.remaining.Medium}, Hard ${ctx.remaining.Hard}; the next Copy prompt will ask for the rest.)`;
  const avoid = ctx.avoidQuestions.length ? ctx.avoidQuestions.map((q) => `- ${q}`).join("\n") : "(none yet)";
  return `Use the nrscholar-question-generator skill.

Chapter: ${ctx.chapter}
Board / Class / Subject: ${ctx.board} / ${ctx.classLevel} / ${ctx.subject}
Chapter ID: ${ctx.chapterId}
Set ${ctx.setNumber} · ${ctx.currentRound ? ROUND_LABELS[ctx.currentRound] : ""} round${ctx.currentRound === "boss" ? " (Boss round: every question must be Hard)" : ""}
Generate now: Easy ${ctx.askNow.Easy}, Medium ${ctx.askNow.Medium}, Hard ${ctx.askNow.Hard}${more}

Questions already in the bank (do not repeat or rephrase):
${avoid}

The chapter PDF is attached. Reply with the JSON block only.`;
}

/** Accepts Claude's reply as-is: a ```json fenced block, an object with `questions`, or a bare array. */
function parseClaudeJson(text: string): unknown[] {
  if (text.trim().startsWith("Use the nrscholar-question-generator skill")) {
    throw new Error("this is the prompt. Paste the prompt into the Claude chat, then paste Claude's JSON reply here.");
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced ? fenced[1] : text).trim();
  const parsed = JSON.parse(body);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
  throw new Error("JSON must have a `questions` list");
}

export default function ClaudeImportPanel({ chapterId, pdfUrl, disabled, currentRound, onImported }: {
  chapterId: string;
  pdfUrl: string | null;
  disabled: boolean;
  currentRound: RoundName | null;
  onImported: () => void;
}) {
  // The round the copied prompt asked for; the import is tagged with it.
  const [promptRound, setPromptRound] = useState<RoundName | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const copyPrompt = async () => {
    setBusy("prompt");
    setError(null);
    try {
      const ctx = await adminApi.claudeContext(chapterId);
      setPromptRound(ctx.currentRound);
      await navigator.clipboard.writeText(buildPrompt(ctx));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const runImport = async () => {
    setError(null);
    let questions: unknown[];
    try {
      questions = parseClaudeJson(text);
    } catch (e) {
      setError(`Could not read the JSON: ${(e as Error).message}`);
      return;
    }
    setBusy("import");
    try {
      const r = await adminApi.importQuestions(chapterId, questions, promptRound || currentRound);
      setResult(r);
      if (r.acceptedCount) setText("");
      onImported();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-violet-200 bg-violet-50/40 p-4">
      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
        <li>Download the chapter PDF and attach it in Claude (with the <b>nrscholar-question-generator</b> skill enabled).</li>
        <li>Click <b>Copy prompt</b> and paste it into the same Claude chat.</li>
        <li>Paste Claude&apos;s JSON reply below and click <b>Import</b>. The same rules are re-checked; passing questions go to Pending.</li>
      </ol>
      <div className="flex flex-wrap gap-2">
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Download PDF
          </a>
        )}
        <Button variant="secondary" busy={busy === "prompt"} disabled={disabled} onClick={copyPrompt}>
          <ClipboardCopy className="h-4 w-4" /> {copied ? "Copied!" : `Copy prompt${currentRound ? ` · ${ROUND_LABELS[currentRound]} round` : ""}`}
        </Button>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} disabled={disabled}
        placeholder={'Step 3: paste Claude\'s JSON reply here (not the prompt), e.g.\n```json\n{ "questions": [ ... ] }\n```'}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-primary disabled:bg-slate-100" />
      <Button disabled={disabled || !text.trim()} busy={busy === "import"} onClick={runImport}>
        <Upload className="h-4 w-4" /> Import
      </Button>
      <ErrorNote message={error} />
      {result && (
        <div className="space-y-2 rounded-xl bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green">{result.acceptedCount} added to Pending · {ROUND_LABELS[result.round]} round</Badge>
            {result.rejected.length > 0 && <Badge tone="red">{result.rejected.length} rejected</Badge>}
            <span className="text-xs text-slate-500">
              Still open: {DIFFICULTIES.map((d) => `${d} ${result.remaining[d]}`).join(" · ")}
            </span>
          </div>
          {!result.quoteCheckable && (
            <p className="text-xs text-amber-700">This PDF&apos;s text is not machine-readable, so quotes could not be auto-checked. Verify each quote against the PDF while reviewing.</p>
          )}
          {result.rejected.length > 0 && (
            <ul className="max-h-48 space-y-1 overflow-auto text-xs">
              {result.rejected.map((r) => (
                <li key={r.index} className="rounded bg-red-50 px-2 py-1">
                  <span className="text-slate-800">#{r.index + 1} {r.question}</span>
                  <span className="text-red-700"> — {r.reasons.join("; ")}</span>
                </li>
              ))}
            </ul>
          )}
          {result.rejected.length > 0 && DIFFICULTIES.some((d) => result.remaining[d] > 0) && (
            <p className="text-xs text-slate-500">Ask Claude to replace the rejected ones (give it the reasons), then import again.</p>
          )}
          {DIFFICULTIES.every((d) => result.remaining[d] === 0) && (
            <p className="text-xs font-semibold text-emerald-700">All slots for this chapter are filled. Review them in the Pending tab below.</p>
          )}
        </div>
      )}
    </div>
  );
}
