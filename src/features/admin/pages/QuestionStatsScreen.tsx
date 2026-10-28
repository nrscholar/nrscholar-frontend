import { useEffect, useState, type ReactNode } from "react";
import { BarChart3, Image as ImageIcon, Table2 } from "lucide-react";
import { adminApi, type QuestionStats, type RoundName } from "../adminApi";
import { Card, ErrorNote, Spinner } from "../components/AdminUI";
import { ROUND_LABELS } from "../constants";

// Categorical slots in fixed order (validated: CVD ΔE ≥ 9; aqua < 3:1 on the surface, so every bar carries a value label and there is a table view).
const ROUND_COLOR: Record<RoundName, string> = { quiz: "#2a78d6", boss: "#eb6834", shadow: "#1baf7a" };
const SINGLE = "#2a78d6";
const ROUNDS: RoundName[] = ["quiz", "boss", "shadow"];
const KIND_LABELS: Record<string, string> = {
  picture_mcq: "Picture MCQ", match_pairs: "Match the pairs", fill_letters: "Fill missing letters", ordering: "Put in order",
};
const fmt = (n: number) => n.toLocaleString("en-IN");

export default function QuestionStatsScreen() {
  const [board, setBoard] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [boards, setBoards] = useState<string[]>([]);
  const [classLevels, setClassLevels] = useState<string[]>([]);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [classTable, setClassTable] = useState(false);

  useEffect(() => {
    adminApi.filters(board).then((r) => { setBoards(r.boards); setClassLevels(r.classLevels); }, (e) => setError(e.message));
  }, [board]);
  useEffect(() => {
    setStats(null);
    adminApi.stats(board, classLevel).then(setStats, (e) => setError(e.message));
  }, [board, classLevel]);

  const pending = stats?.drafts.pending;
  const select = "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-primary";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900"><BarChart3 className="h-5 w-5" /> Question Stats</h1>
          <p className="text-sm text-slate-500">Live questions students can get, per round, and how many of them use pictures.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={board} onChange={(e) => { setBoard(e.target.value); setClassLevel(""); }} className={select}>
            <option value="">All boards</option>
            {boards.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className={select}>
            <option value="">All classes</option>
            {classLevels.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <ErrorNote message={error} />}
      {!stats && !error && <div className="flex justify-center py-16"><Spinner /></div>}

      {stats && (
        <>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Tile label="Total questions" value={stats.total} />
            <Tile label="Image based" value={stats.picture} note={stats.total ? `${((stats.picture / stats.total) * 100).toFixed(2)}% of total` : undefined} icon />
            {ROUNDS.map((r) => (
              <Tile key={r} label={`${ROUND_LABELS[r]} round`} value={stats.rounds[r].total} note={`${fmt(stats.rounds[r].picture)} image based`} swatch={ROUND_COLOR[r]} />
            ))}
            <Tile label="Waiting for review" value={pending?.total || 0} note={pending ? `${fmt(pending.picture)} image based` : "none pending"} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <ChartTitle title="Questions per round" sub="All live questions" />
              <Bars rows={ROUNDS.map((r) => ({ label: ROUND_LABELS[r], value: stats.rounds[r].total, tip: `${fmt(stats.rounds[r].picture)} of them image based` }))} />
            </Card>
            <Card>
              <ChartTitle title="Image based questions per round" sub="Picture MCQ, match, fill letters and ordering" />
              <Bars rows={ROUNDS.map((r) => ({ label: ROUND_LABELS[r], value: stats.rounds[r].picture, tip: `of ${fmt(stats.rounds[r].total)} questions in the round` }))} />
            </Card>
          </div>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <ChartTitle title="Questions per class" sub="Split by round" />
              <button onClick={() => setClassTable((t) => !t)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                {classTable ? <><BarChart3 className="h-3.5 w-3.5" /> Chart</> : <><Table2 className="h-3.5 w-3.5" /> Table</>}
              </button>
            </div>
            {classTable ? <ClassTable stats={stats} /> : <ClassChart stats={stats} />}
          </Card>

          <Card>
            <ChartTitle title="Image based questions by type" sub="Live questions in all rounds" />
            <Bars rows={Object.keys(KIND_LABELS).map((k) => ({ label: KIND_LABELS[k], value: stats.kinds[k] || 0 }))} />
          </Card>
        </>
      )}
    </div>
  );
}

function Tile({ label, value, note, swatch, icon }: { label: string; value: number; note?: string; swatch?: string; icon?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {swatch && <span className="h-2.5 w-2.5 rounded-sm" style={{ background: swatch }} />}
        {icon && <ImageIcon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{fmt(value)}</p>
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  );
}

const ChartTitle = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-4">
    <h2 className="font-semibold text-slate-900">{title}</h2>
    <p className="text-xs text-slate-500">{sub}</p>
  </div>
);

/** Floating label that follows the pointer over a mark. */
function useTooltip() {
  const [tip, setTip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);
  const bind = (content: ReactNode) => ({
    onMouseMove: (e: React.MouseEvent) => setTip({ x: e.clientX, y: e.clientY, content }),
    onMouseLeave: () => setTip(null),
  });
  const node = tip && (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
      style={{ left: tip.x, top: tip.y - 10 }}>{tip.content}</div>
  );
  return { bind, node };
}

/** Single-series horizontal bars with the value at the end of each bar. */
function Bars({ rows }: { rows: { label: string; value: number; tip?: string }[] }) {
  const { bind, node } = useTooltip();
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 text-sm"
          {...bind(<><b>{r.label}</b>: {fmt(r.value)}{r.tip && <div className="text-slate-300">{r.tip}</div>}</>)}>
          <span className="truncate text-slate-600">{r.label}</span>
          <div className="flex items-center gap-2 py-1">
            <div className="h-5 rounded-r-[4px]" style={{ width: `${(r.value / max) * 100}%`, minWidth: r.value ? 2 : 0, background: SINGLE }} />
            <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-700">{fmt(r.value)}</span>
          </div>
        </div>
      ))}
      {node}
    </div>
  );
}

function ClassChart({ stats }: { stats: QuestionStats }) {
  const { bind, node } = useTooltip();
  const max = Math.max(1, ...stats.byClass.map((c) => c.total));
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-slate-600">
        {ROUNDS.map((r) => (
          <span key={r} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: ROUND_COLOR[r] }} />{ROUND_LABELS[r]}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        {stats.byClass.map((c) => (
          <div key={c.classLevel} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 text-sm">
            <span className="truncate text-slate-600">{c.classLevel === "?" ? "No class" : c.classLevel}</span>
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex h-5 gap-[2px]" style={{ width: `${(c.total / max) * 100}%`, minWidth: 2 }}>
                {ROUNDS.filter((r) => c[r] > 0).map((r, i, shown) => (
                  <div key={r} className={i === shown.length - 1 ? "rounded-r-[4px]" : ""}
                    style={{ flexGrow: c[r], flexBasis: 0, background: ROUND_COLOR[r] }}
                    {...bind(<><b>{c.classLevel} · {ROUND_LABELS[r]}</b>: {fmt(c[r])}</>)} />
                ))}
              </div>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-700"
                {...bind(<><b>{c.classLevel}</b>: {fmt(c.total)} total · {fmt(c.picture)} image based</>)}>{fmt(c.total)}</span>
            </div>
          </div>
        ))}
      </div>
      {node}
    </div>
  );
}

function ClassTable({ stats }: { stats: QuestionStats }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="py-2 pr-3">Class</th>
            {ROUNDS.map((r) => <th key={r} className="py-2 pr-3 text-right">{ROUND_LABELS[r]}</th>)}
            <th className="py-2 pr-3 text-right">Total</th>
            <th className="py-2 text-right">Image based</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {stats.byClass.map((c) => (
            <tr key={c.classLevel} className="border-t border-slate-100">
              <td className="py-1.5 pr-3 text-slate-700">{c.classLevel === "?" ? "No class" : c.classLevel}</td>
              {ROUNDS.map((r) => <td key={r} className="py-1.5 pr-3 text-right">{fmt(c[r])}</td>)}
              <td className="py-1.5 pr-3 text-right font-semibold">{fmt(c.total)}</td>
              <td className="py-1.5 text-right">{fmt(c.picture)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
