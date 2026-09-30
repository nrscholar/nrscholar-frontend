import { Check } from "lucide-react";
import type { PoolStatus, RoundName } from "../adminApi";
import { DIFFICULTIES, ROUND_LABELS, ROUND_ORDER } from "../constants";

/** Next set, round by round: Quiz → Boss → Shadow. The current round is the one being generated. */
export default function RoundCards({ pool, setNumber }: { pool: PoolStatus; setNumber: number }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">Set {setNumber}</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {ROUND_ORDER.map((name: RoundName) => {
          const r = pool.rounds[name];
          const need = DIFFICULTIES.reduce((n, d) => n + r.required[d], 0);
          const have = DIFFICULTIES.reduce((n, d) => n + Math.min(r.available[d], r.required[d]), 0);
          const waiting = DIFFICULTIES.reduce((n, d) => n + Math.min(r.pending[d], Math.max(0, r.required[d] - r.available[d])), 0);
          const current = pool.currentRound === name;
          return (
            <div key={name}
              className={`rounded-xl border p-3 ${current ? "border-primary bg-primary-fixed/30 ring-2 ring-primary-fixed" : r.ready ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{current ? "▶ " : ""}{ROUND_LABELS[name]}</span>
                {r.ready && <Check className="h-4 w-4 text-emerald-600" />}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {DIFFICULTIES.filter((d) => r.required[d]).map((d) => `${r.required[d]}${d[0]}`).join(" · ")}
              </div>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="bg-emerald-500" style={{ width: `${(have / need) * 100}%` }} />
                <div className="bg-amber-300" style={{ width: `${(waiting / need) * 100}%` }} />
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {have}/{need} approved{waiting > 0 && <span className="text-amber-600"> · {waiting} in review</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
