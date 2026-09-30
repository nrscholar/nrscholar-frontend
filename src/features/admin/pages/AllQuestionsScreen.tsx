import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { adminApi, type Catalog, type CatalogStatus } from "../adminApi";
import { DIFFICULTIES, DIFFICULTY_TONE } from "../constants";
import { Badge, Card, ErrorNote, Spinner } from "../components/AdminUI";

const STATUS: Record<CatalogStatus, { label: string; tone: "amber" | "blue" | "green" | "red" }> = {
  pending: { label: "Pending review", tone: "amber" },
  pool: { label: "In pool", tone: "blue" },
  in_set: { label: "In a set", tone: "green" },
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

export default function AllQuestionsScreen() {
  const [params, setParams] = useSearchParams();
  const f = {
    board: params.get("board") || "",
    classLevel: params.get("classLevel") || "",
    subjectId: params.get("subjectId") || "",
    chapterId: params.get("chapterId") || "",
    status: params.get("status") || "",
    difficulty: params.get("difficulty") || "",
    q: params.get("q") || "",
  };
  const [search, setSearch] = useState(f.q);
  const [boards, setBoards] = useState<string[]>([]);
  const [classLevels, setClassLevels] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [data, setData] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFilter = (next: Partial<typeof f>) => {
    const merged = { ...f, ...next };
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v)));
  };

  useEffect(() => {
    adminApi.filters(f.board, f.classLevel).then(
      (r) => { setBoards(r.boards); setClassLevels(r.classLevels); setSubjects(r.subjects); },
      (e) => setError(e.message)
    );
  }, [f.board, f.classLevel]);

  useEffect(() => {
    if (!f.subjectId) { setChapters([]); return; }
    adminApi.chapters(f.subjectId).then((r) => setChapters(r.chapters.map((c) => ({ id: c.id, name: c.name }))), () => setChapters([]));
  }, [f.subjectId]);

  const key = params.toString();
  useEffect(() => {
    setLoading(true);
    setError(null);
    adminApi.allQuestions(Object.fromEntries(params.entries()))
      .then(setData, (e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const duplicateIds = useMemo(() => new Set(data?.duplicateIds || []), [data]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Questions</h1>
        <p className="text-sm text-slate-500">Every pipeline question (pending, pool and in sets), with a duplicate check inside each chapter. Read-only.</p>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Select label="Board" value={f.board} options={boards.map((b) => ({ value: b, label: b }))}
            onChange={(v) => setFilter({ board: v, classLevel: "", subjectId: "", chapterId: "" })} />
          <Select label="Class" value={f.classLevel} disabled={!f.board} options={classLevels.map((c) => ({ value: c, label: c }))}
            onChange={(v) => setFilter({ classLevel: v, subjectId: "", chapterId: "" })} />
          <Select label="Subject" value={f.subjectId} disabled={!f.classLevel} options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(v) => setFilter({ subjectId: v, chapterId: "" })} />
          <Select label="Chapter" value={f.chapterId} disabled={!f.subjectId} options={chapters.map((c) => ({ value: c.id, label: c.name }))}
            onChange={(v) => setFilter({ chapterId: v })} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select label="Status" value={f.status} options={(Object.keys(STATUS) as CatalogStatus[]).map((s) => ({ value: s, label: STATUS[s].label }))}
            onChange={(v) => setFilter({ status: v })} />
          <Select label="Difficulty" value={f.difficulty} options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
            onChange={(v) => setFilter({ difficulty: v })} />
          <form className="flex min-w-[220px] flex-[2] items-end gap-2" onSubmit={(e) => { e.preventDefault(); setFilter({ q: search.trim() }); }}>
            <label className="block flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search question text
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary" />
            </label>
            <button type="submit" className="rounded-xl border border-slate-300 bg-white p-2.5 hover:bg-slate-50" title="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Card>

      <ErrorNote message={error} />
      {loading && !data && <div className="flex justify-center py-10"><Spinner className="h-8 w-8" /></div>}

      {data && (
        <>
          <Card className={data.duplicates.length ? "border-red-200 bg-red-50/40" : "border-emerald-200 bg-emerald-50/40"}>
            {data.duplicates.length === 0 ? (
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <CheckCircle2 className="h-5 w-5" /> 0 duplicates. All {data.checkedQuestions} questions in this scope are unique within their chapter.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-red-800">
                  <AlertTriangle className="h-5 w-5" /> {data.duplicates.length} near-duplicate pair(s) among {data.checkedQuestions} questions
                </div>
                <ul className="space-y-2">
                  {data.duplicates.map((p) => (
                    <li key={`${p.a.id}-${p.b.id}`} className="rounded-xl bg-white p-3 text-sm">
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Badge tone="red">{Math.round(p.similarity * 100)}% similar</Badge>
                        <Link to={`/admin/question-bank/${p.chapterId}`} className="font-semibold text-blue-700 hover:underline">{p.chapterName}</Link>
                      </div>
                      <div className="text-slate-800">A. {p.a.question} <span className="text-xs text-slate-400">({STATUS[p.a.status].label})</span></div>
                      <div className="text-slate-800">B. {p.b.question} <span className="text-xs text-slate-400">({STATUS[p.b.status].label})</span></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Rejected questions are not counted. The check always covers the selected board / class / subject / chapter, whatever the status or search filter.</p>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm text-slate-600">
              <span>Showing <b>{data.shown}</b> of <b>{data.total}</b> question(s)</span>
              {loading && <Spinner />}
            </div>
            {data.items.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No questions match these filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Question</th>
                      <th className="px-4 py-2">Chapter</th>
                      <th className="px-4 py-2">Difficulty</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Set / Round</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((q, i) => (
                      <tr key={q.id} className={duplicateIds.has(q.id) ? "bg-red-50" : ""}>
                        <td className="px-4 py-2 text-xs text-slate-400">{i + 1}</td>
                        <td className="max-w-xl px-4 py-2">
                          <div className="text-slate-900">{q.question}</div>
                          <div className="text-xs text-emerald-700">✓ {q.answer}</div>
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <Link to={`/admin/question-bank/${q.chapterId}`} className="text-blue-700 hover:underline">{q.chapterName}</Link>
                          <div className="text-slate-400">{q.board} · {q.classLevel} · {q.subject}</div>
                        </td>
                        <td className="px-4 py-2"><Badge tone={DIFFICULTY_TONE[q.difficulty]}>{q.difficulty}</Badge></td>
                        <td className="px-4 py-2"><Badge tone={STATUS[q.statusLabel].tone}>{STATUS[q.statusLabel].label}</Badge></td>
                        <td className="px-4 py-2 text-xs text-slate-600">
                          {q.setNumber ? `Set ${q.setNumber} · ${q.round}` : q.targetRound ? `${q.targetRound} (next set)` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
