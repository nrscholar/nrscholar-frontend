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
 * Reading passage and/or illustration of a question.
 * The passage opens for the first question that uses it and stays collapsed (tap to open)
 * for the following questions on the same passage. Renders nothing for ordinary questions.
 * `part` renders only the passage (above the question card) or only the picture (inside it).
 */
export default function QuestionContext({ question, previous, part }: {
  question?: ContextQuestion | null;
  previous?: ContextQuestion | null;
  part?: "passage" | "image";
}) {
  const sameAsPrevious = !!question?.passageId && previous?.passageId === question.passageId;
  const [open, setOpen] = useState(!sameAsPrevious);

  useEffect(() => {
    setOpen(!sameAsPrevious);
  }, [question?._id, sameAsPrevious]);

  const img = question?.image;
  const src = img?.url || (img?.svg ? `data:image/svg+xml;utf8,${encodeURIComponent(img.svg)}` : "");
  const passage = part !== "image" && question?.passage;
  const picture = part !== "passage" && src;
  if (!passage && !picture) return null;

  if (part === "image") {
    // Sized to leave room for the options on a phone screen.
    return <img src={src} alt="Question illustration" className="mx-auto mt-3 block max-h-[min(7.5rem,17vh)] w-auto max-w-full object-contain sm:max-h-40" />;
  }

  return (
    <div className="space-y-3">
      {passage && (
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
      {picture && <img src={src} alt="Question illustration" className="max-h-44 w-full rounded-2xl border-2 border-[#d9dcf5] bg-white object-contain p-2" />}
    </div>
  );
}
