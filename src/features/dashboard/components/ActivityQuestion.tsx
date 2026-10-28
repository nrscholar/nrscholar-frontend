import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SEPARATOR, activityType, imageSrc, optionImage, sameAnswer, type PlayableQuestion, type QuestionImage } from "./questionTypes";

/**
 * Picture and activity questions (mainly for the lower classes), shared by the student
 * mission screen and the admin "student view" preview so both always look the same.
 *
 * Every type is scored the same way as an MCQ: the component reports one string built from
 * what the student did ("Foot | Arm", "eye | nose", ...) and it is compared with `answer`.
 */

const shuffled = <T,>(items: T[]) => {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Pic = ({ img, className }: { img?: QuestionImage; className: string }) =>
  imageSrc(img) ? <img src={imageSrc(img)} alt="" className={`object-contain ${className}`} /> : null;

/** MCQ options as on the mission screen; switches to a picture grid when the options have pictures. */
export function OptionList({ question, options, selected, confirmed, isTimeout = false, onSelect }: {
  question: PlayableQuestion;
  options: string[];
  selected: number | null;
  confirmed: boolean;
  isTimeout?: boolean;
  onSelect: (index: number) => void;
}) {
  const pictures = options.some((o) => optionImage(question, o));
  return (
    <div className={`mb-6 ${pictures ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}`}>
      {options.map((opt, idx) => {
        const isSelected = selected === idx;
        const isCorrect = sameAnswer(opt, question.answer);
        let style = "bg-white border-gray-200 text-[#191c1e] hover:border-[#141779]";
        if (confirmed) {
          if (isTimeout) style = "bg-white border-gray-200 text-[#191c1e] opacity-60";
          else if (isCorrect) style = "bg-emerald-500 border-emerald-600 text-white font-bold";
          else if (isSelected) style = "bg-red-500 border-red-600 text-white font-bold";
        } else if (isSelected) {
          style = "bg-indigo-50 border-[#141779] text-[#141779] font-bold ring-2 ring-[#141779]/20";
        }
        const marks = (
          <>
            {confirmed && !isTimeout && isCorrect && <CheckCircle2 size={20} className="text-white" />}
            {confirmed && !isTimeout && isSelected && !isCorrect && <XCircle size={20} className="text-white" />}
          </>
        );
        return pictures ? (
          <button key={idx} type="button" disabled={confirmed} onClick={() => !confirmed && onSelect(idx)}
            className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 font-semibold text-base shadow-xs transition-all ${style}`}>
            <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-white">
              <Pic img={optionImage(question, opt)} className="h-full w-full" />
            </span>
            <span className="break-words text-center">{opt}</span>
            <span className="absolute right-2 top-2">{marks}</span>
          </button>
        ) : (
          <button key={idx} type="button" disabled={confirmed} onClick={() => !confirmed && onSelect(idx)}
            className={`w-full p-4 rounded-2xl border text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs ${style}`}>
            <span className="flex-1 mr-4 break-words text-left">{opt}</span>
            {marks}
          </button>
        );
      })}
    </div>
  );
}

const cellTone = (confirmed: boolean, ok: boolean) =>
  !confirmed ? "border-gray-200 bg-white" : ok ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50";

/**
 * Match / fill letters / ordering. `onChange` gets the answer string once every part is done
 * (null while incomplete). After `confirmed`, each part shows right/wrong and the correct value.
 */
export function ActivityQuestion({ question, confirmed, onChange }: {
  question: PlayableQuestion;
  confirmed: boolean;
  onChange: (value: string | null) => void;
}) {
  const type = activityType(question);
  const details = question.interaction?.details || {};
  const key = question._id || question.question;
  if (type === "match_pairs") return <MatchPairs key={key} pairs={details.pairs || []} confirmed={confirmed} onChange={onChange} />;
  if (type === "fill_letters") return <FillLetters key={key} items={details.items || []} confirmed={confirmed} onChange={onChange} />;
  if (type === "ordering") return <Ordering key={key} items={details.items || []} confirmed={confirmed} onChange={onChange} />;
  return null;
}

function MatchPairs({ pairs, confirmed, onChange }: { pairs: { left: QuestionImage; right: string }[]; confirmed: boolean; onChange: (v: string | null) => void }) {
  const words = useMemo(() => shuffled(pairs.map((p) => p.right)), [pairs]);
  const [chosen, setChosen] = useState<string[]>(() => pairs.map(() => ""));

  useEffect(() => {
    onChange(chosen.every(Boolean) ? chosen.join(SEPARATOR) : null);
  }, [chosen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {pairs.map((p, i) => {
        const ok = sameAnswer(chosen[i], p.right);
        return (
          <div key={i} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 shadow-xs ${cellTone(confirmed, ok)}`}>
            <Pic img={p.left} className="h-20 w-20" />
            <select value={chosen[i]} disabled={confirmed}
              onChange={(e) => setChosen((c) => c.map((v, j) => (j === i ? e.target.value : v)))}
              className="w-full rounded-xl border border-gray-300 bg-white px-2 py-2 text-base font-semibold text-[#141779] outline-none focus:border-[#141779]">
              <option value="">Choose…</option>
              {words.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            {confirmed && !ok && <span className="text-xs font-bold text-emerald-700">✓ {p.right}</span>}
          </div>
        );
      })}
    </div>
  );
}

function FillLetters({ items, confirmed, onChange }: { items: { label: string; pattern: string; answer: string }[]; confirmed: boolean; onChange: (v: string | null) => void }) {
  const [letters, setLetters] = useState<string[][]>(() => items.map((it) => [...it.pattern].map(() => "")));

  const word = (i: number) => [...items[i].pattern].map((ch, j) => (ch === "_" ? letters[i][j] : ch)).join("");
  useEffect(() => {
    const done = items.every((it, i) => [...it.pattern].every((ch, j) => ch !== "_" || letters[i][j]));
    onChange(done ? items.map((_, i) => word(i)).join(SEPARATOR) : null);
  }, [letters]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLetter = (i: number, j: number, v: string) =>
    setLetters((all) => all.map((row, r) => (r === i ? row.map((x, c) => (c === j ? v.slice(-1).toLowerCase() : x)) : row)));

  return (
    <div className="mb-6 flex flex-col gap-3">
      {items.map((it, i) => {
        const ok = sameAnswer(word(i), it.answer);
        return (
          <div key={i} className={`flex items-center gap-3 rounded-2xl border p-3 shadow-xs ${cellTone(confirmed, ok)}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#141779] text-sm font-black text-white">{it.label}</span>
            <div className="flex flex-wrap items-end gap-1 text-2xl font-black tracking-wide text-[#141779]">
              {[...it.pattern].map((ch, j) =>
                ch === "_" ? (
                  <input key={j} value={letters[i][j]} disabled={confirmed} maxLength={2} autoCapitalize="off" autoComplete="off"
                    onChange={(e) => setLetter(i, j, e.target.value)}
                    className="h-10 w-9 rounded-lg border-b-4 border-[#141779] bg-indigo-50 text-center text-2xl font-black text-[#141779] outline-none disabled:opacity-90" />
                ) : (
                  <span key={j} className="w-6 text-center">{ch}</span>
                ),
              )}
            </div>
            {confirmed && !ok && <span className="ml-auto text-sm font-bold text-emerald-700">✓ {it.answer}</span>}
          </div>
        );
      })}
    </div>
  );
}

function Ordering({ items, confirmed, onChange }: { items: { text: string; image?: QuestionImage }[]; confirmed: boolean; onChange: (v: string | null) => void }) {
  const display = useMemo(() => shuffled(items.map((it, i) => ({ ...it, correct: i + 1 }))), [items]);
  const [picked, setPicked] = useState<number[]>([]); // indexes into `display`, in tap order

  useEffect(() => {
    onChange(picked.length === items.length ? picked.map((d) => display[d].text).join(SEPARATOR) : null);
  }, [picked]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (d: number) => setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  return (
    <div className="mb-6 flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[#767683]">Tap the steps in order. Tap again to undo.</p>
      {display.map((it, d) => {
        const pos = picked.indexOf(d) + 1;
        const ok = pos === it.correct;
        return (
          <button key={d} type="button" disabled={confirmed} onClick={() => toggle(d)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left shadow-xs transition-all ${cellTone(confirmed, ok)} ${!confirmed && pos ? "border-[#141779] ring-2 ring-[#141779]/20" : ""}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-black ${pos ? "bg-[#141779] text-white" : "border-2 border-dashed border-gray-300 text-gray-300"}`}>
              {pos || "?"}
            </span>
            <Pic img={it.image} className="h-12 w-12 shrink-0" />
            <span className="flex-1 text-base font-semibold text-[#191c1e]">{it.text}</span>
            {confirmed && !ok && <span className="text-sm font-bold text-emerald-700">✓ {it.correct}</span>}
          </button>
        );
      })}
    </div>
  );
}
