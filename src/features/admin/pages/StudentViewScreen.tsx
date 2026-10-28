import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Eye, RotateCcw } from "lucide-react";
import { adminApi, type ChapterDetail, type Draft, type DraftStatus } from "../adminApi";
import QuestionContext from "../../dashboard/components/QuestionContext";
import { ActivityQuestion, OptionList } from "../../dashboard/components/ActivityQuestion";
import { activityType, sameAnswer } from "../../dashboard/components/questionTypes";

const STATUSES: DraftStatus[] = ["pending", "approved"];

/**
 * A chapter's questions played one after another exactly as a student meets them on the
 * mission screen (same components and layout). Admin preview only: nothing is saved.
 */
export default function StudentViewScreen() {
  const { chapterId = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") as DraftStatus) || "pending";
  const [detail, setDetail] = useState<ChapterDetail | null>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<Record<string, boolean>>({});

  useEffect(() => { adminApi.chapter(chapterId).then(setDetail, (e) => setError(e.message)); }, [chapterId]);
  useEffect(() => {
    setDrafts(null);
    adminApi.drafts(chapterId, status).then((list) => {
      setDrafts(list);
      setScore({});
      const start = list.findIndex((d) => d.id === params.get("q"));
      setIndex(start >= 0 ? start : 0);
    }, (e) => setError(e.message));
  }, [chapterId, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = drafts?.length || 0;
  const done = drafts !== null && index >= total && total > 0;
  const current = drafts && index < total ? drafts[index] : null;
  const correct = Object.values(score).filter(Boolean).length;

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-3xl border border-slate-200 bg-[#f7f9fb] font-sans text-[#191c1e]">
      <header className="sticky top-14 z-10 flex rounded-t-3xl items-center justify-between gap-3 border-b border-gray-200 bg-[rgba(247,249,251,0.85)] px-3 py-3 shadow-xs backdrop-blur-md sm:px-6">
        <button onClick={() => navigate(`/admin/question-bank/${chapterId}`)} title="Back to review"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-xs transition-all hover:bg-gray-50 active:scale-95">
          <ArrowLeft size={18} className="text-[#141779]" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-black text-[#141779]">{detail?.chapter.name || "Chapter"}</p>
          <p className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#767683]">
            <Eye size={12} /> Student view · preview only
          </p>
        </div>
        <div className="flex shrink-0 rounded-full border border-gray-200 bg-white p-1 text-xs font-bold">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setParams({ status: s })}
              className={`rounded-full px-3 py-1 capitalize ${status === s ? "bg-[#141779] text-white" : "text-[#767683]"}`}>
              {s}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-6 py-6">
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        {drafts === null && !error && <p className="py-16 text-center text-sm font-bold text-[#767683] animate-pulse">Loading questions…</p>}
        {drafts?.length === 0 && <p className="py-16 text-center text-sm font-bold text-[#767683]">No {status} questions in this chapter.</p>}

        {current && (
          <PlayQuestion key={`${current.id}-${index}`} draft={current} number={index + 1} total={total}
            onAnswered={(ok) => setScore((s) => ({ ...s, [current.id]: ok }))}
            onNext={() => setIndex((i) => i + 1)}
            onBack={index > 0 ? () => setIndex((i) => i - 1) : undefined} />
        )}

        {done && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-400 bg-emerald-100 text-4xl shadow-lg">🌟</div>
            <h2 className="mb-2 text-2xl font-black text-[#141779]">Quiz complete!</h2>
            <p className="mb-8 text-sm font-medium text-[#464652]">You got {correct} of {total} questions right.</p>
            <button onClick={() => { setScore({}); setIndex(0); }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#141779] py-4 text-base font-black text-white shadow-lg hover:bg-[#101362] active:scale-95">
              <RotateCcw size={18} /> PLAY AGAIN
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function PlayQuestion({ draft, number, total, onAnswered, onNext, onBack }: {
  draft: Draft; number: number; total: number;
  onAnswered: (correct: boolean) => void; onNext: () => void; onBack?: () => void;
}) {
  const activity = activityType(draft);
  // Like the student API: options shuffled, pictures looked up by option text.
  const options = useMemo(() => [...draft.options].sort(() => Math.random() - 0.5), [draft.options]);
  const question = useMemo(() => ({
    ...draft,
    _id: draft.id,
    optionImages: draft.optionImages && Object.fromEntries(draft.options.map((o, i) => [o, draft.optionImages![i]])),
  }), [draft]);
  const [selected, setSelected] = useState<number | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const ready = activity ? value !== null : selected !== null;
  const correct = activity ? sameAnswer(value, draft.answer) : selected !== null && sameAnswer(options[selected], draft.answer);

  const check = () => {
    if (confirmed) return onNext();
    if (!ready) return;
    setConfirmed(true);
    onAnswered(correct);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#767683]">
        <span className="flex items-center gap-1.5 font-extrabold text-[#141779]">
          {onBack && (
            <button onClick={onBack} title="Previous question" className="-ml-1 rounded-full p-0.5 hover:bg-gray-200"><ChevronLeft size={16} /></button>
          )}
          🎯 Quiz Phase
        </span>
        <span>Question {number} of {total}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-[#141779] transition-all duration-300" style={{ width: `${(number / total) * 100}%` }} />
      </div>

      <div className="mt-4"><QuestionContext question={question} /></div>
      <div className="relative my-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#006a62]">
          Question #{number}
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-[#141779]">{draft.difficulty}</span>
        </span>
        <h3 className="text-lg font-bold leading-snug text-[#141779]">{draft.question}</h3>
      </div>

      {activity ? (
        <ActivityQuestion question={question} confirmed={confirmed} onChange={setValue} />
      ) : (
        <OptionList question={question} options={options} selected={selected} confirmed={confirmed} onSelect={setSelected} />
      )}

      {confirmed && (
        <div className={`mb-4 rounded-2xl border p-4 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <p className={`font-black ${correct ? "text-emerald-700" : "text-red-700"}`}>{correct ? "🎉 You got it right!" : "Not quite — look at the correct answer."}</p>
          {draft.explanation && <p className="mt-1 text-sm font-medium text-[#464652]">{draft.explanation}</p>}
        </div>
      )}

      <button disabled={!ready && !confirmed} onClick={check}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black shadow-lg transition-all active:scale-95 ${!ready && !confirmed
          ? "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none"
          : !confirmed ? "bg-[#141779] text-white hover:bg-[#101362]"
            : correct ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-red-600 text-white hover:bg-red-700"}`}>
        {confirmed ? (number < total ? "CONTINUE →" : "SEE RESULT →") : "CHECK ANSWER"}
      </button>
    </>
  );
}
