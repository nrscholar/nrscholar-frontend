import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";

interface ContextQuestion {
  _id?: string;
  passageId?: string;
  passage?: string;
  passagePages?: string;
  image?: { type?: string; svg?: string; url?: string };
}

/**
 * Reading passage and/or illustration shown above a question.
 * The passage opens for the first question that uses it and stays collapsed (tap to open)
 * for the following questions on the same passage. Renders nothing for ordinary questions.
 */
export default function QuestionContext({ question, previous }: { question?: ContextQuestion | null; previous?: ContextQuestion | null }) {
  const sameAsPrevious = !!question?.passageId && previous?.passageId === question.passageId;
  const [open, setOpen] = useState(!sameAsPrevious);

  useEffect(() => {
    setOpen(!sameAsPrevious);
  }, [question?._id, sameAsPrevious]);

  if (!question || (!question.passage && !question.image)) return null;
  const img = question.image;
  const src = img?.url || (img?.svg ? `data:image/svg+xml;utf8,${encodeURIComponent(img.svg)}` : "");

  return (
    <div className="mb-4 space-y-3">
      {question.passage && (
        <div className="overflow-hidden rounded-2xl border-2 border-[#d9dcf5] bg-[#f7f8ff]">
          <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-[#3b3ba8]">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Read the passage
            </span>
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {open && <p className="max-h-60 overflow-auto whitespace-pre-line px-4 pb-4 text-[15px] leading-relaxed text-[#2f2f4f]">{question.passage}</p>}
        </div>
      )}
      {src && <img src={src} alt="Question illustration" className="max-h-72 w-full rounded-2xl border-2 border-[#d9dcf5] bg-white object-contain p-2" />}
    </div>
  );
}
