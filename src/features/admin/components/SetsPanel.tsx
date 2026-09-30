import { useState } from "react";
import { Layers } from "lucide-react";
import { adminApi, type ChapterDetail, type RoundName, type Tier } from "../adminApi";
import { DIFFICULTIES } from "../constants";
import { Badge, Button, ErrorNote } from "./AdminUI";

const ROUND_LABELS: Record<RoundName, string> = { quiz: "Quiz", boss: "Boss", shadow: "Shadow" };

function describe(round: Partial<Record<string, number>>) {
  return DIFFICULTIES.filter((d) => round[d]).map((d) => `${round[d]} ${d}`).join(" · ");
}

export default function SetsPanel({ detail, onChanged }: { detail: ChapterDetail; onChanged: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { tierInfo, tiers, pool, sets } = detail;
  const tier = tiers[tierInfo.tier];
  const nextNumber = (sets.length ? Math.max(...sets.map((s) => s.setNumber)) : 0) + 1;

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const short = DIFFICULTIES.filter((d) => pool.available[d] < pool.required[d])
    .map((d) => `${pool.required[d] - pool.available[d]} ${d}`)
    .join(", ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Set size
          <select
            value={tierInfo.source === "override" ? tierInfo.tier : "auto"}
            disabled={busy !== null}
            onChange={(e) => run("tier", () => adminApi.setTier(detail.chapter.id, e.target.value === "auto" ? null : (e.target.value as Tier)))}
            className="mt-1 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900"
          >
            <option value="auto">
              Automatic — {tiers[tierInfo.autoTier].label}{tierInfo.pageCount ? `, PDF has ${tierInfo.pageCount} pages` : ""}
            </option>
            {(Object.keys(tiers) as Tier[]).map((t) => (
              <option key={t} value={t}>{tiers[t].label}</option>
            ))}
          </select>
        </label>
        <p className="pb-2 text-xs text-slate-500">
          One set = {Object.values(tier.rounds).reduce((n, r) => n + Object.values(r).reduce((a, b) => a + (b || 0), 0), 0)} unique questions
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {(Object.keys(tier.rounds) as RoundName[]).map((r) => (
          <div key={r} className="rounded-xl bg-slate-50 px-3 py-2">
            <div className="text-sm font-bold text-slate-800">{ROUND_LABELS[r]}</div>
            <div className="text-xs text-slate-600">{describe(tier.rounds[r])}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="success" disabled={!pool.canBuild} busy={busy === "build"}
          onClick={() => run("build", () => adminApi.buildSet(detail.chapter.id))}>
          <Layers className="h-4 w-4" /> Build Set {nextNumber}
        </Button>
        <span className="text-xs text-slate-500">
          {pool.canBuild
            ? "Picks unused approved questions from the pool and publishes them to Quiz, Boss and Shadow."
            : `Pool needs ${short} more approved question(s). Generate and approve them in steps 2–3.`}
        </span>
      </div>
      <ErrorNote message={error} />

      {sets.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {sets.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
              <span className="font-semibold text-slate-800">Set {s.setNumber}</span>
              <span className="text-xs text-slate-500">
                {s.counts ? (Object.keys(ROUND_LABELS) as RoundName[]).map((r) => `${ROUND_LABELS[r]} ${s.counts?.[r] ?? 0}`).join(" · ") : ""}
              </span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                {s.readyAt && new Date(s.readyAt).toLocaleDateString()}
                <Badge tone={s.status === "ready" ? "green" : "amber"}>{s.status === "ready" ? "Ready for students" : "Building"}</Badge>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
