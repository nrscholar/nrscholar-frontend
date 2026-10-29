import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  KeyRound, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Target, 
  Lightbulb,
  BookOpen,
  PieChart,
  ArrowRight,
  Clock,
  Zap,
  Check
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../api";

export interface DynamicAiInsightCardProps {
  mode: "strengths" | "weakness" | "risk";
  subject: string;
  accuracy: number;
  mistakeCount?: number;
  correctCount?: number;
  recentTrend?: any[];
  incorrectQuestionLogs?: any[];
  studentAttempts?: any[];
  studentName?: string;
  className?: string;
}

// In-memory cache to prevent repeated re-fetching and layout flickers
const insightCache: Record<string, any> = {};

/**
 * Classifies a question into a fine-grained sub-topic based on subject domain taxonomy.
 */
export function classifyQuestionSubtopic(subject: string, questionText: string, chapter: string = "", explanation: string = ""): string {
  const text = `${questionText || ""} ${chapter || ""} ${explanation || ""}`.toLowerCase();
  const normSubj = (subject || "").toLowerCase();

  if (normSubj.includes("math") || normSubj.includes("ગણિત") || normSubj.includes("गणित")) {
    if (["divis", "divide", "quotient", "remainder", "dividend", "ભાગાકાર", "શેષ", "ભાજ્ય", "भागाकार", "शेषफल", "भाग"].some(w => text.includes(w))) {
      return "Division & Remainders";
    }
    if (["fraction", "decimal", "numerator", "denominator", "half", "quarter", "અપૂર્ણાંક", "દશાંશ", "भिन्न", "दशमलव"].some(w => text.includes(w))) {
      return "Fractions & Decimals";
    }
    if (["multipl", "times", "product", "tables", "ગુણાકાર", "ગુણ્યા", "ઘડિયા", "गुणा", "पहाड़े"].some(w => text.includes(w))) {
      return "Multiplication & Tables";
    }
    if (["subtract", "minus", "difference", "less", "take away", "borrow", "બાદબાકી", "દશકો", "घटाव", "उधार"].some(w => text.includes(w))) {
      return "Subtraction & Borrowing";
    }
    if (["add", "plus", "sum", "total", "carry", "સરવાળો", "વદી", "जोड़", "हासिल"].some(w => text.includes(w))) {
      return "Addition & Carryover";
    }
    if (["angle", "triangle", "rectangle", "square", "circle", "perimeter", "area", "shape", "ખૂણો", "પરિમિતિ", "ક્ષેત્રફળ", "ત્રિકોણ", "क्षेत्रफल", "परिमाप", "कोण"].some(w => text.includes(w))) {
      return "Geometry & Measurement";
    }
    if (["word problem", "bought", "sold", "cost", "total amount", "left with", "કૂટપ્રશ્ન", "શાબ્દિક", "शाब्दिक"].some(w => text.includes(w))) {
      return "Multi-Step Word Problems";
    }
    return chapter && chapter !== "Practice Quiz" && chapter !== "General" ? chapter : "Foundational Arithmetic";
  }

  if (normSubj.includes("sci") || normSubj.includes("વિજ્ઞાન") || normSubj.includes("विज्ञान") || normSubj.includes("evs")) {
    if (["plant", "photosynthesis", "leaf", "chlorophyll", "root", "stem", "seed", "વનસ્પતિ", "પ્રકાશસંશ્લેષણ", "પર્ણ", "બીજ", "पौधे", "प्रकाश"].some(w => text.includes(w))) {
      return "Plants & Photosynthesis";
    }
    if (["heart", "digest", "stomach", "skeleton", "bone", "blood", "organ", "brain", "પાચન", "હૃદય", "શરીર", "હાડકાં", "पाचन", "रक्त", "अंग"].some(w => text.includes(w))) {
      return "Human Organ Systems";
    }
    if (["force", "motion", "gravity", "friction", "speed", "energy", "બળ", "ગતિ", "ઘર્ષણ", "ગુરુત્વાકર્ષણ", "ઊર્જા", "बल", "गति", "घर्षण"].some(w => text.includes(w))) {
      return "Force, Energy & Motion";
    }
    if (["matter", "solid", "liquid", "gas", "evaporation", "melting", "પદાર્થ", "ઘન", "પ્રવાહી", "વાયુ", "ઉત્કલન", "पदार्थ", "ठोस", "द्रव"].some(w => text.includes(w))) {
      return "States of Matter";
    }
    if (["animal", "habitat", "bird", "insect", "carnivore", "herbivore", "પ્રાણી", "આવાસ", "ખોરાક", "जानवर", "आवास"].some(w => text.includes(w))) {
      return "Animal Habitats & Ecology";
    }
    return chapter && chapter !== "Practice Quiz" && chapter !== "General" ? chapter : "Natural Science Concepts";
  }

  if (["eng", "guj", "hin", "english", "ગુજરાતી", "हिन्दी"].some(l => normSubj.includes(l))) {
    if (["noun", "pronoun", "verb", "adjective", "adverb", "preposition", "નામ", "સર્વનામ", "ક્રિયાપદ", "વિશેષણ", "સંજ્ઞા", "सर्वनाम", "क्रिया", "विशेषण"].some(w => text.includes(w))) {
      return "Parts of Speech & Grammar";
    }
    if (["tense", "past", "present", "future", "continuous", "કાળ", "ભૂતકાળ", "વર્તમાનકાળ", "ભવિષ્યકાળ", "काल", "वर्तमान", "भूतकाल"].some(w => text.includes(w))) {
      return "Verb Tenses & Conjugation";
    }
    if (["synonym", "antonym", "opposite", "meaning", "vocabulary", "સમાનાર્થી", "વિરોધી", "શબ્દાર્થ", "પર્યાયવાચી", "विलोम", "शब्दार्थ"].some(w => text.includes(w))) {
      return "Vocabulary & Word Nuances";
    }
    if (["sentence", "punctuation", "comma", "full stop", "capital", "question mark", "વાક્ય", "વિરામચિહ્ન", "વિરામચિહ્નો", "विराम चिह्न"].some(w => text.includes(w))) {
      return "Sentence Structure & Punctuation";
    }
    if (["passage", "comprehension", "story", "paragraph", "ગદ્યાર્થગ્રહણ", "ફકરો", "गद्यांश"].some(w => text.includes(w))) {
      return "Reading Comprehension";
    }
    return chapter && chapter !== "Practice Quiz" && chapter !== "General" ? chapter : "Language Structure & Usage";
  }

  return chapter && chapter !== "Practice Quiz" && chapter !== "General" ? chapter : `${subject} Core Concepts`;
}

/**
 * Helper to localize subtopics and core concepts across languages
 */
export function localizeSubtopic(name: string, lang: string): string {
  if (!name) return "";
  if (lang === "gu") {
    if (name.includes("Core Concepts")) return name.replace("Core Concepts", "મુખ્ય વિભાવનાઓ");
    if (name === "Fractions & Decimals") return "અપૂર્ણાંક અને દશાંશ";
    if (name === "Multiplication & Tables") return "ગુણાકાર અને ઘડિયા";
    if (name === "Subtraction & Borrowing") return "બાદબાકી અને દસકો";
    if (name === "Addition & Carryover") return "સરવાળો અને વદ્દી";
    if (name === "Geometry & Measurement") return "ભૂમિતિ અને માપન";
    if (name === "Multi-Step Word Problems") return "બહુ-પગલાં કૂટપ્રશ્નો";
    if (name === "Foundational Arithmetic") return "મૂળભૂત અંકગણિત";
    if (name === "Plants & Photosynthesis") return "વનસ્પતિ અને પ્રકાશસંશ્લેષણ";
    if (name === "Human Organ Systems") return "માનવ અંગ પ્રણાલીઓ";
    if (name === "Force, Energy & Motion") return "બળ, ઊર્જા અને ગતિ";
    if (name === "States of Matter") return "દ્રવ્યની સ્થિતિઓ";
    if (name === "Animal Habitats & Ecology") return "પ્રાણી આવાસ અને પર્યાવરણ";
    if (name === "Natural Science Concepts") return "પ્રાકૃતિક વિજ્ઞાન વિભાવનાઓ";
    if (name === "Parts of Speech & Grammar") return "શબ્દભેદ અને વ્યાકરણ";
    if (name === "Verb Tenses & Conjugation") return "ક્રિયાપદ કાળ અને રૂપ";
    if (name === "Vocabulary & Word Nuances") return "શબ્દભંડોળ અને અર્થ";
    if (name === "Sentence Structure & Punctuation") return "વાક્ય રચના અને વિરામચિહ્નો";
    if (name === "Reading Comprehension") return "વાંચન અને અર્થગ્રહણ";
    if (name === "Language Structure & Usage") return "ભાષા રચના અને ઉપયોગ";
    if (name === "Foundational Concepts") return "મૂળભૂત વિભાવનાઓ";
  } else if (lang === "hi") {
    if (name.includes("Core Concepts")) return name.replace("Core Concepts", "मूल अवधारणाएं");
    if (name === "Fractions & Decimals") return "भिन्न और दशमलव";
    if (name === "Multiplication & Tables") return "गुणा और पहाड़े";
    if (name === "Subtraction & Borrowing") return "घटाव और उधार";
    if (name === "Addition & Carryover") return "जोड़ और हासिल";
    if (name === "Geometry & Measurement") return "ज्यामिति और मापन";
    if (name === "Multi-Step Word Problems") return "बहु-चरणीय शाब्दिक प्रश्न";
    if (name === "Foundational Arithmetic") return "मूलभूत अंकगणित";
    if (name === "Plants & Photosynthesis") return "पौधे और प्रकाश संश्लेषण";
    if (name === "Human Organ Systems") return "मानव अंग प्रणालियाँ";
    if (name === "Force, Energy & Motion") return "बल, ऊर्जा और गति";
    if (name === "States of Matter") return "पदार्थ की अवस्थाएँ";
    if (name === "Animal Habitats & Ecology") return "पशु आवास और पर्यावरण";
    if (name === "Natural Science Concepts") return "प्राकृतिक विज्ञान अवधारणाएं";
    if (name === "Parts of Speech & Grammar") return "शब्द भेद और व्याकरण";
    if (name === "Verb Tenses & Conjugation") return "काल और क्रिया रूप";
    if (name === "Vocabulary & Word Nuances") return "शब्दावली और अर्थ";
    if (name === "Sentence Structure & Punctuation") return "वाक्य रचना और विराम चिह्न";
    if (name === "Reading Comprehension") return "पठन और बोध";
    if (name === "Language Structure & Usage") return "भाषा संरचना और उपयोग";
    if (name === "Foundational Concepts") return "मूलभूत अवधारणाएं";
  }
  return name;
}

/**
 * Granular diagnostic analyzer for client fallback.
 */
export function computeDeepSubjectInsights(
  subject: string,
  mistakes: any[] = [],
  accuracy: number = 0,
  correctCount: number = 0,
  mistakeCount: number = 0,
  studentName: string = "Explorer",
  lang: string = "en"
) {
  const normSubj = (subject || "").toLowerCase();
  let canonicalTopics: string[] = [];

  if (normSubj.includes("math") || normSubj.includes("ગણિત") || normSubj.includes("गणित")) {
    canonicalTopics = ["Addition & Carryover", "Subtraction & Borrowing", "Multiplication & Tables", "Division & Remainders", "Fractions & Decimals"];
  } else if (normSubj.includes("sci") || normSubj.includes("વિજ્ઞાન") || normSubj.includes("विज्ञान") || normSubj.includes("evs")) {
    canonicalTopics = ["Plants & Photosynthesis", "Human Organ Systems", "Force, Energy & Motion", "States of Matter", "Animal Habitats & Ecology"];
  } else if (["eng", "guj", "hin", "english", "ગુજરાતી", "हिन्दी"].some(l => normSubj.includes(l))) {
    canonicalTopics = ["Parts of Speech & Grammar", "Verb Tenses & Conjugation", "Vocabulary & Word Nuances", "Sentence Structure & Punctuation", "Reading Comprehension"];
  } else {
    canonicalTopics = [`${subject} Fundamentals`, `${subject} Applications`, `${subject} Complex Reasoning`];
  }

  const subtopicCounts: Record<string, number> = {};
  mistakes.forEach(m => {
    const rawSt = classifyQuestionSubtopic(subject, m?.questionText, m?.chapter, m?.explanation);
    const st = localizeSubtopic(rawSt, lang);
    subtopicCounts[st] = (subtopicCounts[st] || 0) + 1;
  });

  const localizedCanonical = canonicalTopics.map(t => localizeSubtopic(t, lang));
  const totalMistakes = mistakes.length || Math.max(1, mistakeCount);
  const sortedSubtopics = Object.keys(subtopicCounts).sort((a, b) => subtopicCounts[b] - subtopicCounts[a]);
  const weakConcepts = sortedSubtopics.length > 0 ? sortedSubtopics : [localizedCanonical[localizedCanonical.length - 1]];
  const strongConcepts = localizedCanonical.filter(t => !weakConcepts.includes(t));
  if (strongConcepts.length === 0) {
    strongConcepts.push(localizedCanonical[0], localizedCanonical[1]);
  }

  const subTopicBreakdown = weakConcepts.map(st => {
    const count = subtopicCounts[st] || Math.max(1, mistakeCount);
    const pct = Math.round((count / totalMistakes) * 100);
    const status = pct >= 50 || count >= 3 ? "Critical Gap" : pct >= 25 ? "Needs Practice" : "Minor Slip";
    return {
      subTopic: st,
      mistakeCount: count,
      errorShare: `${pct}%`,
      errorSharePct: pct,
      status,
      insight: `${count} mistakes (${pct}% error share) in ${st}.`
    };
  });

  const defaultWeak = lang === "gu" ? "મૂળભૂત વિભાવનાઓ" : lang === "hi" ? "मूलभूत अवधारणाएं" : "Foundational Concepts";
  const primaryWeak = weakConcepts[0] || defaultWeak;
  const topWeakPct = subTopicBreakdown[0]?.errorSharePct || 80;
  const strongJoined = strongConcepts.slice(0, 3).join(", ");

  let failurePointText = `Strong in ${strongJoined}; ${topWeakPct}% of errors concentrated in ${primaryWeak}.`;
  if (lang === "gu") {
    failurePointText = `${strongJoined} માં મજબૂત પકડ; ${topWeakPct}% ભૂલો ${primaryWeak} માં કેન્દ્રિત.`;
  } else if (lang === "hi") {
    failurePointText = `${strongJoined} में मजबूत पकड़; ${topWeakPct}% गलतियां ${primaryWeak} में केंद्रित।`;
  }

  const isDeep = accuracy < 50;
  const planType = isDeep
    ? (lang === "gu" ? "15-દિવસીય પુનઃપ્રાપ્તિ યોજના" : lang === "hi" ? "15-दिवसीय सुधार योजना" : "15-Day Recovery Plan")
    : (lang === "gu" ? "7-દિવસીય પુનઃપ્રાપ્તિ સ્પ્રિન્ટ" : lang === "hi" ? "7-दिवसीय सुधार स्प्रिंट" : "7-Day Recovery Sprint");

  const planSteps = isDeep
    ? [
        {
          days: lang === "gu" ? "દિવસ 1–5" : lang === "hi" ? "दिन 1–5" : "Days 1–5",
          title: lang === "gu" ? `${primaryWeak} પુનઃનિર્માણ` : lang === "hi" ? `${primaryWeak} पुनर्निर्माण` : `${primaryWeak} Rebuilding`,
          action: lang === "gu" ? `${primaryWeak} ના મૂળ નિયમો પર દૈનિક 10 મિનિટ માઇક્રો-ડ્રિલ્સ.` : lang === "hi" ? `${primaryWeak} के मूल नियमों पर 10 मिनट का दैनिक अभ्यास।` : `10 min daily micro-drills on core rules of ${primaryWeak}.`
        },
        {
          days: lang === "gu" ? "દિવસ 6–10" : lang === "hi" ? "दिन 6–10" : "Days 6–10",
          title: lang === "gu" ? "લક્ષિત પુનઃપ્રયાસ" : lang === "hi" ? "लक्षित पुनः प्रयास" : "Targeted Retries",
          action: lang === "gu" ? "સહાયક સંકેતો સાથે છૂટી ગયેલા પ્રશ્નોનો ફરીથી પ્રયાસ કરો." : lang === "hi" ? "संकेतों के साथ छूटे हुए प्रश्नों का पुनः प्रयास करें।" : "Re-attempt missed questions with step hints."
        },
        {
          days: lang === "gu" ? "દિવસ 11–15" : lang === "hi" ? "दिन 11–15" : "Days 11–15",
          title: lang === "gu" ? "માઇલસ્ટોન ક્વિઝ" : lang === "hi" ? "मील का पत्थर क्विज़" : "Milestone Quizzes",
          action: lang === "gu" ? "ચોકસાઈને 70% થી વધુ લઈ જવા માટે સમયબદ્ધ બેન્ચમાર્ક ક્વિઝ." : lang === "hi" ? "सटीकता को 70% से ऊपर ले जाने के लिए समयबद्ध बेंचमार्क क्विज़।" : "Timed benchmark quizzes to push accuracy above 70%."
        }
      ]
    : [
        {
          days: lang === "gu" ? "દિવસ 1–3" : lang === "hi" ? "दिन 1–3" : "Days 1–3",
          title: lang === "gu" ? "નિદાન સમીક્ષા" : lang === "hi" ? "नैदानिक समीक्षा" : "Diagnostic Review",
          action: lang === "gu" ? `${primaryWeak} માં મુશ્કેલ નિયમો ઓળખવા માટે ચૂકી ગયેલા પ્રશ્નોની સમીક્ષા કરો.` : lang === "hi" ? `${primaryWeak} में छूटे हुए प्रश्नों की समीक्षा करके कठिन नियमों को समझें।` : `Review missed questions in ${primaryWeak} to isolate trap rules.`
        },
        {
          days: lang === "gu" ? "દિવસ 4–5" : lang === "hi" ? "दिन 4–5" : "Days 4–5",
          title: lang === "gu" ? "કેન્દ્રિત અભ્યાસ" : lang === "hi" ? "केंद्रित अभ्यास" : "Focused Practice",
          action: lang === "gu" ? `${primaryWeak} પર 6–8 લક્ષિત પ્રશ્નોનો અભ્યાસ કરો.` : lang === "hi" ? `${primaryWeak} पर 6–8 लक्षित प्रश्नों का अभ्यास करें।` : `Practice 6–8 targeted questions on ${primaryWeak}.`
        },
        {
          days: lang === "gu" ? "દિવસ 6–7" : lang === "hi" ? "दिन 6–7" : "Days 6–7",
          title: lang === "gu" ? "ઝડપ બેન્ચમાર્ક" : lang === "hi" ? "गति बेंचमार्क" : "Speed Benchmark",
          action: lang === "gu" ? "70% થી વધુ સ્કોર જાળવવા 10-પ્રશ્નોની ઝડપી ક્વિઝ." : lang === "hi" ? "70% से अधिक स्कोर बनाए रखने के लिए 10-प्रश्नों की गति क्विज़।" : "10-question speed quiz to lock score above 70%."
        }
      ];

  let conceptualKeys = [
    lang === "gu"
      ? "પગલું ચકાસણી: ગણતરી કરતા પહેલા લક્ષ્ય પ્રશ્નમાંથી આપેલો ડેટા અલગ કરો."
      : lang === "hi"
      ? "चरण सत्यापन: गणना करने से पहले दिए गए डेटा को लक्ष्य प्रश्न से अलग करें।"
      : "Step Verification: Separate given data from target question before computing.",
    lang === "gu"
      ? "ઊલટો તાળો: સબમિટ કરતા પહેલા જવાબ ચકાસવા માટે ઊલટી ગણતરી લાગુ કરો."
      : lang === "hi"
      ? "उलटी जाँच: जमा करने से पहले उत्तर की पुष्टि के लिए उल्टे तर्क का प्रयोग करें।"
      : "Inverse Check: Apply inverse reasoning to verify answer before submission."
  ];

  if (primaryWeak.includes("Division") || primaryWeak.includes("ભાગાકાર") || primaryWeak.includes("भाग")) {
    conceptualKeys = [
      lang === "gu"
        ? "શેષ નિયમ: ભાગાકારમાં, શેષ હંમેશા ભાજક કરતાં ઓછી હોવી જોઈએ (R < D)."
        : lang === "hi"
        ? "शेषफल नियम: भाग में, शेषफल हमेशा भाजक से कम होना चाहिए (R < D)।"
        : "Remainder Rule: In division, Remainder must always be strictly less than Divisor (R < D).",
      lang === "gu"
        ? "ચકાસણી તપાસ: ભાજ્ય = (ભાજક × ભાગફળ) + શેષ."
        : lang === "hi"
        ? "सत्यापन जाँच: भाज्य = (भाजक × भागफल) + शेषफल।"
        : "Verification Check: Dividend = (Divisor × Quotient) + Remainder."
    ];
  } else if (primaryWeak.includes("Fraction") || primaryWeak.includes("અપૂર્ણાંક") || primaryWeak.includes("भिन्न")) {
    conceptualKeys = [
      lang === "gu"
        ? "સામાન્ય છેદ: અપૂર્ણાંકો ત્યારે જ ઉમેરી કે બાદ કરી શકાય જ્યારે છેદ સમાન હોય."
        : lang === "hi"
        ? "समान हर: भिन्नों को तभी जोड़ा या घटाया जा सकता है जब हर समान हों।"
        : "Common Denominator: Fractions can only be added or subtracted when denominators match.",
      lang === "gu"
        ? "સમતુલ્ય નિયમ: અંશ અને છેદને સમાન સંખ્યાથી ગુણવાથી મૂલ્ય જળવાઈ રહે છે."
        : lang === "hi"
        ? "समतुल्यता नियम: अंश और हर को समान संख्या से गुणा करने पर मान स्थिर रहता है।"
        : "Equivalence Rule: Multiplying numerator and denominator by same number preserves value."
    ];
  }

  return {
    diagnosticSummary: failurePointText,
    primaryFailurePointText: failurePointText,
    failurePoint: primaryWeak,
    subTopicBreakdown,
    strongConcepts,
    weakConcepts,
    conceptualKeys,
    planType,
    planSteps,
    stabilityGuidance: lang === "gu"
      ? `${correctCount} પ્રશ્નો ઉકેલવા સાથે ${accuracy}% ચોકસાઈ સાથે મજબૂત વિભાવનાત્મક સ્થિરતા.`
      : lang === "hi"
      ? `${correctCount} प्रश्नों के हल के साथ ${accuracy}% सटीकता पर मजबूत वैचारिक स्थिरता।`
      : `Strong conceptual stability with ${accuracy}% accuracy across ${correctCount} questions solved.`,
    maintenanceKey: lang === "gu"
      ? "અઠવાડિયે 2 હળવા સમીક્ષા સત્રો (10–15 મિનિટ). થાક વગર યાદશક્તિ જાળવે છે."
      : lang === "hi"
      ? "सप्ताह में 2 हल्के समीक्षा सत्र (10–15 मिनट)। बिना थकान के स्मरण शक्ति सुरक्षित रखता है।"
      : "2 light review sessions weekly (10–15 mins). Protects recall without study fatigue.",
    dropPreventionStrategy: lang === "gu"
      ? "દબાણ હેઠળ સ્મરણ શક્તિ ચકાસવા સાપ્તાહિક 10-મિનિટની મિશ્ર-વિષય ક્વિઝ."
      : lang === "hi"
      ? "दबाव में स्मरण शक्ति का परीक्षण करने के लिए साप्ताहिक 10-मिनट की मिश्रित-विषय क्विज़।"
      : "Weekly 10-min mixed-topic quiz to test recall under pressure.",
    masteryMilestones: [
      {
        phase: lang === "gu" ? "તબક્કો 1" : lang === "hi" ? "चरण 1" : "Milestone 1",
        title: lang === "gu" ? "ઝડપ અને ચોકસાઈ" : lang === "hi" ? "गति और सटीकता" : "Speed & Accuracy",
        action: lang === "gu" ? "શ્રેષ્ઠ લક્ષ્ય સમયમાં ≥85% ચોકસાઈ જાળવો." : lang === "hi" ? "इष्टतम लक्ष्य समय के भीतर ≥85% सटीकता बनाए रखें।" : `Maintain ≥85% accuracy within optimal target time.`
      },
      {
        phase: lang === "gu" ? "તબક્કો 2" : lang === "hi" ? "चरण 2" : "Milestone 2",
        title: lang === "gu" ? "મિશ્ર વિભાવનાઓ" : lang === "hi" ? "मिश्रित अवधारणाएं" : "Interleaved Concepts",
        action: lang === "gu" ? "અભ્યાસક્રમના એકમોમાંથી મિશ્ર પ્રશ્નો ઉકેલો." : lang === "hi" ? "पाठ्यक्रम इकाइयों के मिश्रित बहु-अध्याय प्रश्न हल करें।" : "Solve mixed multi-chapter questions across syllabus units."
      },
      {
        phase: lang === "gu" ? "તબક્કો 3" : lang === "hi" ? "चरण 3" : "Milestone 3",
        title: lang === "gu" ? "દીર્ઘકાલીન યાદશક્તિ" : lang === "hi" ? "दीर्घकालिक स्मरण" : "Recall Defense",
        action: lang === "gu" ? "દીર્ઘકાલીન સ્મરણ મજબૂત કરવા બોલીને તર્ક સ્પષ્ટ કરો." : lang === "hi" ? "दीर्घकालिक स्मृति को मजबूत करने के लिए तर्क को बोलकर स्पष्ट करें।" : "Verbalize reasoning out loud to solidify long-term memory."
      }
    ]
  };
}

/**
 * Utility to split dense text into punchy bullet points.
 */
function toPunchyBullets(text: string, maxItems: number = 3): string[] {
  if (!text) return [];
  if (text.includes("\n") || text.includes("•")) {
    const raw = text.split(/[\n•]/).map(s => s.trim()).filter(s => s.length > 5);
    if (raw.length > 0) return raw.slice(0, maxItems);
  }
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
  
  if (sentences.length > 0) {
    return sentences.slice(0, maxItems);
  }
  return [text];
}

/**
 * Parses key rule strings into structured { label, detail } for high-contrast scannability.
 */
function parseKeyRule(rule: string): { label?: string; detail: string } {
  if (!rule) return { detail: "" };
  const colonIdx = rule.indexOf(":");
  if (colonIdx > 0 && colonIdx < 35) {
    return {
      label: rule.substring(0, colonIdx).trim(),
      detail: rule.substring(colonIdx + 1).trim()
    };
  }
  const dashIdx = rule.indexOf(" — ");
  if (dashIdx > 0 && dashIdx < 35) {
    return {
      label: rule.substring(0, dashIdx).trim(),
      detail: rule.substring(dashIdx + 3).trim()
    };
  }
  return { detail: rule.trim() };
}

/**
 * Deconstructs failure point statements into structured takeaway components.
 */
function splitFailurePoint(text: string, defaultWeak: string = "", strongConcepts: string[] = []): { bottleneck: string; strongNote: string } {
  if (!text) {
    return {
      bottleneck: defaultWeak ? `Focus on mastering ${defaultWeak}.` : "Targeted concept practice recommended.",
      strongNote: strongConcepts.length > 0 ? `Strong base in ${strongConcepts.slice(0, 2).join(", ")}` : ""
    };
  }
  
  // Split on semicolon if present (e.g. "Strong in A, B; 80% errors in C")
  if (text.includes(";")) {
    const parts = text.split(";");
    const part0 = parts[0].trim();
    const part1 = parts[1].trim();
    if (part0.toLowerCase().includes("strong") || part0.toLowerCase().includes("મજબૂત") || part0.toLowerCase().includes("मजबूत")) {
      return { bottleneck: part1, strongNote: part0 };
    }
    return { bottleneck: part0, strongNote: part1 };
  }

  return {
    bottleneck: text,
    strongNote: strongConcepts.length > 0 ? `Solid foundation in ${strongConcepts.slice(0, 2).join(", ")}` : ""
  };
}

export const DynamicAiInsightCard: React.FC<DynamicAiInsightCardProps> = ({
  mode,
  subject,
  accuracy,
  mistakeCount = 0,
  correctCount = 0,
  recentTrend = [],
  incorrectQuestionLogs = [],
  studentAttempts = [],
  studentName = "Explorer",
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<any>(null);

  const currentLang = (i18n.language || "en").split("-")[0];
  const isDeepRecovery = accuracy < 50;

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `${mode}_${subject}_${accuracy}_${mistakeCount}_${correctCount}_${currentLang}`;

    if (insightCache[cacheKey]) {
      setInsight(insightCache[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Perform live backend LLM / deep data engine call with graceful client fallback
    apiFetch("/api/parent/ai-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        subject,
        accuracy,
        mistakeCount,
        correctCount,
        recentTrend,
        incorrectQuestionLogs,
        studentAttempts,
        studentName,
        language: currentLang,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json && json.success && json.data) {
          insightCache[cacheKey] = json.data;
          setInsight(json.data);
        } else {
          const fallback = computeDeepSubjectInsights(subject, incorrectQuestionLogs, accuracy, correctCount, mistakeCount, studentName, currentLang);
          insightCache[cacheKey] = fallback;
          setInsight(fallback);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback = computeDeepSubjectInsights(subject, incorrectQuestionLogs, accuracy, correctCount, mistakeCount, studentName, currentLang);
        insightCache[cacheKey] = fallback;
        setInsight(fallback);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mode, subject, accuracy, mistakeCount, correctCount, currentLang]);

  // Visual Theme Config based on mode
  const isStrengths = mode === "strengths";
  const isRisk = mode === "risk";

  // Trigger Button Styles
  const buttonStyle = isStrengths
    ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-indigo-50/40 hover:from-emerald-100/90 hover:to-teal-100/70 border-emerald-200/90 text-[#006a62]"
    : isRisk
    ? "bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-indigo-50/40 hover:from-amber-100/90 hover:to-indigo-100/70 border-amber-200/90 text-[#b45309]"
    : "bg-gradient-to-r from-rose-50/90 via-rose-50/50 to-indigo-50/40 hover:from-rose-100/90 hover:to-indigo-100/70 border-rose-200/90 text-[#dc2626]";

  const iconContainerStyle = isStrengths
    ? "bg-emerald-500/15 text-[#006a62]"
    : isRisk
    ? "bg-amber-500/15 text-[#b45309]"
    : "bg-rose-500/15 text-[#dc2626]";

  const pillBadgeStyle = isStrengths
    ? "bg-white/95 text-[#006a62] border-emerald-200/80 shadow-2xs"
    : isRisk
    ? "bg-white/95 text-[#b45309] border-amber-200/80 shadow-2xs"
    : "bg-white/95 text-[#dc2626] border-rose-200/80 shadow-2xs";

  const buttonTitle = isStrengths
    ? t("view_deep_ai_insight", "View Deep AI Insight")
    : t("view_deep_ai_recovery", "View Deep AI Recovery Plan");

  const buttonPillLabel = isStrengths
    ? t("stability_keys", "Stability Keys")
    : isDeepRecovery
    ? t("day_15_roadmap", "15-Day Roadmap")
    : t("day_7_sprint", "7-Day Sprint");

  return (
    <>
      {/* 1. Sleek Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full mt-2.5 flex items-center justify-between px-3.5 py-2.5 rounded-xl border shadow-2xs active:scale-[0.98] transition-all cursor-pointer group ${buttonStyle} ${className}`}
        aria-label={buttonTitle}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${iconContainerStyle}`}>
            <Sparkles size={13} className="animate-pulse" />
          </div>
          <span className="text-xs font-black truncate tracking-tight">
            {buttonTitle}
          </span>
        </div>

        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform ${pillBadgeStyle}`}>
          <span>{buttonPillLabel}</span>
          <ChevronRight size={12} className="opacity-80" />
        </span>
      </button>

      {/* 2. Premium Deep AI Insight Modal / Dialog */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-3 pb-[92px] sm:p-4 animate-in fade-in duration-200 overscroll-contain select-none"
          style={{
            zIndex: 60,
            paddingBottom: "calc(5.75rem + env(safe-area-inset-bottom, 0px))"
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[72vh] sm:max-h-[82vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 mb-1 sm:mb-0 select-text"
            style={{
              maxHeight: "min(72vh, calc(100dvh - 128px - env(safe-area-inset-bottom, 0px)))"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Touch Grab Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className={`px-4 sm:px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
              isStrengths
                ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-100"
                : isRisk
                ? "bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border-amber-100"
                : "bg-gradient-to-r from-rose-50/90 via-rose-50/40 to-white border-rose-100"
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                  isStrengths 
                    ? "bg-emerald-600 text-white" 
                    : isRisk 
                    ? "bg-amber-600 text-white" 
                    : "bg-[#dc2626] text-white"
                }`}>
                  {isStrengths ? <Trophy size={18} /> : isRisk ? <AlertTriangle size={18} /> : <Target size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                      {subject}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
                      isStrengths
                        ? "bg-emerald-100/90 text-[#006a62] border-emerald-200"
                        : isRisk
                        ? "bg-amber-100/90 text-[#b45309] border-amber-200"
                        : "bg-rose-100/90 text-[#dc2626] border-rose-200"
                    }`}>
                      {isStrengths 
                        ? t("status_top_performing", "Top Performing") 
                        : isRisk 
                        ? t("status_risk_day1", "At Risk (Day 1)") 
                        : t("status_needs_improvement", "Needs Focus")}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                    <Zap size={11} className={isStrengths ? "text-emerald-500" : isRisk ? "text-amber-500" : "text-rose-500"} />
                    <span>{t("instant_telemetry", "AI Diagnostic Telemetry")}</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Metrics Bar (Elevated Micro-Pill Strip) */}
            <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-b border-slate-100/80 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-xs font-black">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    accuracy >= 70 ? "bg-emerald-500 ring-2 ring-emerald-100" : accuracy >= 50 ? "bg-amber-500 ring-2 ring-amber-100" : "bg-rose-500 ring-2 ring-rose-100"
                  }`} />
                  <span className={accuracy >= 70 ? "text-[#006a62]" : accuracy >= 50 ? "text-[#b45309]" : "text-[#dc2626]"}>
                    {accuracy}% {t("accuracy_short", "Acc.")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-xs font-black text-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {isStrengths ? t("correct_short", "Solved") : t("errors_short", "Errors")}:
                  </span>
                  <span>{isStrengths ? correctCount : mistakeCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/90 border border-indigo-100/90 text-[11px] font-bold text-[#141779] shadow-2xs shrink-0">
                <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                <span>{isStrengths ? t("mastery_locked", "Mastery Active") : isDeepRecovery ? t("day_15_roadmap", "15-Day Plan") : t("day_7_sprint", "7-Day Sprint")}</span>
              </div>
            </div>

            {/* Scrollable Insight Content */}
            <div
              className="flex-1 min-h-0 p-4 sm:p-5 pb-8 sm:pb-8 space-y-3 sm:space-y-3.5 overflow-y-auto overscroll-contain scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {loading ? (
                /* Shimmer Skeleton Loader */
                <div className="space-y-3 animate-pulse">
                  <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                    <div className="h-3.5 w-32 bg-slate-200 rounded-md" />
                    <div className="h-2.5 w-full bg-slate-200 rounded-md" />
                    <div className="h-2.5 w-4/5 bg-slate-200 rounded-md" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                    <div className="h-3.5 w-40 bg-slate-200 rounded-md" />
                    <div className="h-2.5 w-full bg-slate-200 rounded-md" />
                  </div>
                  <div className="text-center py-2 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                    <Sparkles size={14} className="animate-spin text-indigo-500" />
                    <span>{t("analyzing_telemetry", "Synthesizing AI telemetry...")}</span>
                  </div>
                </div>
              ) : !insight ? (
                <div className="text-center py-8 text-slate-500 font-medium text-xs">
                  {t("no_insight_available", "Insight currently updating. Please check back shortly.")}
                </div>
              ) : isStrengths ? (
                /* ================= STRENGTHS MODAL VIEW ================= */
                <div className="space-y-3 sm:space-y-3.5">
                  {/* Card 1: Core Mastery Executive Takeaway */}
                  <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white rounded-2xl p-3.5 sm:p-4 border border-emerald-200/80 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-xs text-[#006a62]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-600/15 flex items-center justify-center shrink-0">
                          <Sparkles size={13} className="text-[#006a62]" />
                        </div>
                        <span>{t("core_takeaway", "Core Takeaway")}</span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100/80 text-[#006a62] border border-emerald-200/80">
                        {t("high_retention", "High Retention")}
                      </span>
                    </div>

                    {/* Bite-sized punchy takeaway bullets */}
                    <ul className="space-y-1.5 pl-1">
                      {toPunchyBullets(insight.stabilityGuidance || `${studentName} maintains solid conceptual stability with ${accuracy}% accuracy.`).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Mastered Concept Chips */}
                    {Array.isArray(insight.strongConcepts) && insight.strongConcepts.length > 0 && (
                      <div className="pt-2 border-t border-emerald-100/80 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                          {t("mastered_concepts", "Mastered")}:
                        </span>
                        {insight.strongConcepts.map((sc: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/70 text-[#006a62] border border-emerald-200/70 flex items-center gap-1">
                            <Check size={10} className="stroke-[3]" />
                            <span>{sc}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 2: Twin Action Pillars (Side-by-Side Retention & Defense) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Pillar A: Retention Cadence */}
                    <div className="bg-teal-50/60 rounded-xl p-3 border border-teal-200/70 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-teal-800">
                        <Clock size={13} className="text-teal-700 shrink-0" />
                        <span>{t("retention_cadence", "Practice Cadence")}</span>
                      </div>
                      <ul className="space-y-1">
                        {toPunchyBullets(insight.maintenanceKey || "2 review sessions weekly (10–15 mins). Protects recall without burnout.").map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pillar B: Score Defense */}
                    <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-200/70 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-indigo-900">
                        <ShieldCheck size={13} className="text-indigo-600 shrink-0" />
                        <span>{t("score_defense", "Score Defense")}</span>
                      </div>
                      <ul className="space-y-1">
                        {toPunchyBullets(insight.dropPreventionStrategy || "Weekly 10-min mixed-topic quiz to test recall under pressure.").map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card 3: Next Mastery Milestones (Clean 3-Step Progression) */}
                  {Array.isArray(insight.masteryMilestones) && insight.masteryMilestones.length > 0 && (
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 font-black text-xs text-slate-800">
                          <Trophy size={14} className="text-amber-500" />
                          <span>{t("mastery_milestones", "Mastery Progression")}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/70">
                          {t("three_phase_goal", "3-Phase Goal")}
                        </span>
                      </div>

                      <div className="space-y-2 pt-0.5">
                        {insight.masteryMilestones.map((ms: any, mIdx: number) => (
                          <div key={mIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {mIdx + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-black text-slate-800 leading-tight">
                                {ms.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                                {ms.action}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ================= WEAKNESSES & RISKS MODAL VIEW ================= */
                <div className="space-y-3 sm:space-y-3.5">
                  {/* Card 1: Primary Diagnostic Bottleneck */}
                  {(() => {
                    const failureDeconstruction = splitFailurePoint(
                      insight.primaryFailurePointText || insight.diagnosticSummary || insight.mistakePatternAnalysis,
                      insight.failurePoint,
                      insight.strongConcepts || []
                    );

                    return (
                      <div className={`rounded-2xl p-3.5 sm:p-4 border shadow-2xs space-y-2.5 ${
                        isRisk 
                          ? "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/30 border-amber-200/80" 
                          : "bg-gradient-to-br from-rose-50/80 via-white to-amber-50/30 border-rose-200/80"
                      }`}>
                        {/* Header Banner */}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1.5 font-black text-xs ${isRisk ? "text-[#b45309]" : "text-[#dc2626]"}`}>
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>{t("root_bottleneck", "Root Bottleneck Identified")}</span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            isRisk 
                              ? "bg-amber-100 text-[#b45309] border-amber-200" 
                              : "bg-rose-100 text-[#dc2626] border-rose-200"
                          }`}>
                            {mistakeCount} {t("errors_tracked", "Errors Tracked")}
                          </span>
                        </div>

                        {/* High-Impact Focus Box */}
                        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {t("primary_focus_area", "Primary Focus Area")}:
                            </span>
                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                              isRisk ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-900"
                            }`}>
                              {insight.failurePoint || "Key Topic Review"}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-slate-800 leading-snug">
                            {failureDeconstruction.bottleneck}
                          </p>
                          
                          {failureDeconstruction.strongNote && (
                            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-0.5">
                              <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                              <span>{failureDeconstruction.strongNote}</span>
                            </p>
                          )}
                        </div>

                        {/* Concept Quick Tags - Dedicated rows for proper alignment */}
                        <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                          {Array.isArray(insight.strongConcepts) && insight.strongConcepts.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider shrink-0 mt-0.5 min-w-[70px]">
                                {t("strong_base", "Solid Base")}:
                              </span>
                              <div className="flex flex-wrap gap-1.5 items-center min-w-0 flex-1">
                                {insight.strongConcepts.slice(0, 3).map((sc: string, i: number) => (
                                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <Check size={10} className="stroke-[3] text-emerald-600" />
                                    <span>{sc}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {Array.isArray(insight.weakConcepts) && insight.weakConcepts.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider shrink-0 mt-0.5 min-w-[70px]">
                                {t("review_area", "Review")}:
                              </span>
                              <div className="flex flex-wrap gap-1.5 items-center min-w-0 flex-1">
                                {insight.weakConcepts.slice(0, 2).map((wc: string, i: number) => (
                                  <span key={i} className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                    <AlertTriangle size={10} className="shrink-0 text-rose-600" />
                                    <span>{wc}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 2: Sub-Topic Error Distribution (Clean scannable progress bars) */}
                  {Array.isArray(insight.subTopicBreakdown) && insight.subTopicBreakdown.length > 0 && (
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-black text-slate-800 border-b border-slate-100 pb-2">
                        <span className="flex items-center gap-1.5">
                          <PieChart size={13} className={isRisk ? "text-amber-600" : "text-rose-600"} />
                          <span>{t("granular_subtopic_breakdown", "Sub-Topic Mistake Breakdown")}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{t("error_share", "Share")}</span>
                      </div>

                      <div className="space-y-2">
                        {insight.subTopicBreakdown.map((item: any, idx: number) => {
                          const isCritical = item.status === "Critical Gap";
                          return (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-800">
                                  {item.subTopic}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                    isCritical 
                                      ? "bg-rose-50 text-rose-700 border-rose-200" 
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}>
                                    {item.status === "Critical Gap" ? t("critical_gap", "Critical Gap") : item.status === "Needs Practice" ? t("needs_practice", "Needs Practice") : t("minor_slip", "Minor Slip")}
                                  </span>
                                  <span className="text-xs font-black text-slate-700">
                                    {item.errorShare}
                                  </span>
                                </div>
                              </div>

                              {/* Clean Slim Progress Bar */}
                              <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    isCritical 
                                      ? "bg-gradient-to-r from-rose-500 to-amber-500" 
                                      : "bg-gradient-to-r from-amber-400 to-amber-500"
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(12, item.errorSharePct || 25))}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Card 3: Key Conceptual Anchors (Core Mental Models & Rules) */}
                  {Array.isArray(insight.conceptualKeys) && insight.conceptualKeys.length > 0 && (
                    <div className="bg-indigo-50/40 rounded-2xl p-3.5 sm:p-4 border border-indigo-100/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-indigo-100/80 pb-1.5">
                        <div className="flex items-center gap-1.5 font-black text-xs text-indigo-950">
                          <BookOpen size={13} className="text-indigo-600" />
                          <span>{t("conceptual_keys_label", "Key Rules to Remember")}</span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                          {t("anchor_rules", "Anchor Rules")}
                        </span>
                      </div>

                      <div className="space-y-2 pt-0.5">
                        {insight.conceptualKeys.map((keyRule: string, kIdx: number) => {
                          const { label, detail } = parseKeyRule(keyRule);
                          return (
                            <div key={kIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {kIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                {label ? (
                                  <p className="text-slate-800">
                                    <strong className="font-black text-indigo-950">{label}: </strong>
                                    <span className="text-slate-600 font-medium">{detail}</span>
                                  </p>
                                ) : (
                                  <p className="text-slate-700 font-medium">{detail}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Card 4: Structured Actionable Recovery Roadmap */}
                  {Array.isArray(insight.planSteps) && insight.planSteps.length > 0 && (
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5 font-black text-xs text-slate-800">
                          <Target size={14} className={isRisk ? "text-amber-600" : "text-[#dc2626]"} />
                          <span>{insight.planType || buttonPillLabel}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          isRisk 
                            ? "bg-amber-50 text-[#b45309] border-amber-200" 
                            : "bg-rose-50 text-[#dc2626] border-rose-200"
                        }`}>
                          {isDeepRecovery ? t("fifteen_day_milestone", "15-Day Milestone") : t("seven_day_sprint", "7-Day Sprint")}
                        </span>
                      </div>

                      {/* Phase Step Cards */}
                      <div className="space-y-2 pt-0.5">
                        {insight.planSteps.map((step: any, sIdx: number) => (
                          <div key={sIdx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                            <div className={`w-5 h-5 rounded-full text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                              isRisk ? "bg-amber-600" : "bg-[#dc2626]"
                            }`}>
                              {sIdx + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                  isRisk ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-900"
                                }`}>
                                  {step.days}
                                </span>
                                <h5 className="text-xs font-black text-slate-800 leading-tight">
                                  {step.title}
                                </h5>
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium leading-snug mt-1">
                                {step.action}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card 5: Parent Coaching Callout */}
                  <div className="bg-gradient-to-r from-amber-50/60 to-indigo-50/30 rounded-xl p-3 border border-amber-200/70 shadow-2xs flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                      <Lightbulb size={13} />
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-snug">
                      <strong className="text-slate-800 font-black">{t("coach_tip_label", "Coach Tip")}: </strong>
                      {t("parent_coaching_tip_desc", "Keep sessions short (10–12 min). Focus on the core rule key above over answering speed.")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`w-full py-2.5 px-5 rounded-xl font-black text-xs text-white shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                  isStrengths 
                    ? "bg-[#006a62] hover:bg-[#00544d] shadow-emerald-700/20" 
                    : isRisk 
                    ? "bg-[#b45309] hover:bg-[#92400e] shadow-amber-700/20" 
                    : "bg-[#dc2626] hover:bg-[#b91c1c] shadow-rose-700/20"
                }`}
              >
                {t("got_it_close", "Understood")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicAiInsightCard;
