import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain, CheckCircle2, Star, Zap, ArrowLeft, Trophy, Target, Bell, Settings,
  BookOpen, Sparkles, ChevronDown, ChevronRight, X, Lightbulb, Info, TrendingUp
} from "lucide-react";
import { apiFetch } from "../../../api";
import { getActiveUserContext } from "../../../utils/sessionCache";
import { useTranslation } from "react-i18next";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import { useLockBodyScroll } from "../../../utils/useLockBodyScroll";

interface Tip {
  // Structured JSON fields
  dayBadge?: string;
  categoryTag?: string;
  subjectFocus?: string | null;
  tipTitle?: string;
  tipDescription?: string;
  actionStep?: string;
  whyItMatters?: string;
  xpReward?: number;
  recommendedRoute?: string;

  // Backward-compatible fields
  instead?: string;
  try?: string;
  benefit?: string;
  title?: string;
  description?: string;
  rewardPoints?: number;
  category?: string;
  status?: string;
  subject?: string;
}

interface Milestone {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  iconBg: string;
  iconColor: string;
}

interface SubjectAnalytics {
  subject: string;
  accuracy: number;
  progress?: number;
  chaptersCompleted?: number;
  totalChapters?: number;
  isStrength?: boolean;
  isWeakness?: boolean;
  isRisk?: boolean;
  consecutiveDaysBelow70?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
}

interface PriorityInsight {
  id: string;
  priority: "urgent" | "moderate" | "low";
  subject?: string;
  accuracy?: number;
  title: string;
  observation: string;
  actionStep: string;
  whyItMatters: string;
  route?: string;
  actionLabel?: string;
  badgeTag: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  diagnosticSummary?: string;
  planSteps?: Array<{ days: string; title: string; action: string }>;
  headline?: string;
  quickTakeaway?: string;
}

function getSubjectDomain(subjectName: string): "math" | "gujarati" | "english" | "science" | "hindi" | "social" | "general" {
  const s = (subjectName || "").toLowerCase().trim();
  if (s.includes("math") || s.includes("ganit") || s.includes("ગણિત") || s.includes("arithmetic") || s.includes("ankganit")) return "math";
  if (s.includes("gujarat") || s.includes("ગુજરાતી") || s.includes("guj")) return "gujarati";
  if (s.includes("english") || s.includes("eng") || s.includes("અંગ્રેજી")) return "english";
  if (s.includes("sci") || s.includes("evs") || s.includes("vigyan") || s.includes("વિજ્ઞાન") || s.includes("environ")) return "science";
  if (s.includes("hind") || s.includes("हिन्दी") || s.includes("હિન્દી")) return "hindi";
  if (s.includes("social") || s.includes("sst") || s.includes("samaj") || s.includes("સામાજિક") || s.includes("history") || s.includes("geography")) return "social";
  return "general";
}

function getLocalizedSubjectName(subjectName: string, lang: string = "gu"): string {
  const dom = getSubjectDomain(subjectName);
  if (lang === "gu") {
    if (dom === "hindi") return "હિન્દી";
    if (dom === "math") return "ગણિત";
    if (dom === "gujarati") return "ગુજરાતી";
    if (dom === "english") return "અંગ્રેજી";
    if (dom === "science") return "વિજ્ઞાન";
    if (dom === "social") return "સામાજિક વિજ્ઞાન";
  } else if (lang === "hi") {
    if (dom === "hindi") return "हिन्दी";
    if (dom === "math") return "गणित";
    if (dom === "gujarati") return "गुजराती";
    if (dom === "english") return "अंग्रेजी";
    if (dom === "science") return "विज्ञान";
    if (dom === "social") return "सामाजिक विज्ञान";
  }
  return subjectName;
}

function getDomainPedagogy(
  domain: string,
  priority: "urgent" | "moderate" | "low",
  subName: string,
  acc: number,
  errors: number,
  child: string,
  lang: string
) {
  const isGu = lang === "gu";
  const isHi = lang === "hi";
  const localizedSub = getLocalizedSubjectName(subName, lang);

  if (priority === "urgent") {
    if (domain === "hindi") {
      return {
        title: isGu ? "હિન્દી: માત્રા અને જોડણી સુધારણા" : isHi ? "हिन्दी: मात्रा और वर्तनी सुधार" : "Hindi: Matra & Spelling Practice",
        observation: isGu
          ? `${child} એ હિન્દીમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). હ્રસ્વ અને દીર્ઘ માત્રા (ઇ/ઈ, ઉ/ઊ) વચ્ચેનો તફાવત સમજવામાં થોડી પ્રેક્ટિસની જરૂર છે.`
          : isHi
          ? `${child} ने हिन्दी में ${acc}% स्कोर किया है (${errors} गलतियां)। छोटी और बड़ी मात्राओं (इ/ई, उ/ऊ) के उच्चारण में थोड़ा अभ्यास आवश्यक है।`
          : `${child} scored ${acc}% in Hindi with ${errors} misses. Differentiating short and long vowel matras (इ vs ई, उ vs ऊ) needs practice.`,
        actionStep: isGu
          ? `રોજ 3 શબ્દો મોટેથી સાથે બોલીને વાંચો જેથી ${child} ટૂંકા અને લાંબા અવાજનો તફાવત સરળતાથી સમજી શકે.`
          : isHi
          ? `प्रतिदिन 3 शब्दों को साथ में बोलकर पढ़ें ताकि ${child} छोटी और बड़ी मात्रा का अंतर आसानी से समझ सके।`
          : `Pronounce 3 vowel-pair words together aloud so ${child} clearly hears the difference between short and long sounds.`,
        whyItMatters: isGu
          ? `સાથે બોલીને વાંચવાથી બાળક અવાજનો ભેદ ઝડપથી પકડી શકે છે અને જોડણીની ભૂલો દૂર થાય છે.`
          : isHi
          ? `बोलकर पढ़ने से बच्चा ध्वनियों का अंतर आसानी से पहचानता है और वर्तनी की गलतियां दूर होती हैं।`
          : `Listening and speaking together helps children recognize vowel sounds easily and avoid spelling mistakes.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "માત્રા ઉચ્ચારણ", action: "રોજ 5 મિનિટ ટૂંકા અને લાંબા અવાજોની સરખામણી સાથે મોટેથી વાચન." },
              { days: "દિવસ 6–10", title: "વાક્ય અભ્યાસ", action: "ખોટા પડેલા શબ્દોને સાચા વાક્યોમાં લખવાનો સરળ અભ્યાસ." },
              { days: "દિવસ 11–15", title: "ઝડપી ક્વિઝ", action: "75%+ સ્કોર માટે 10 પ્રશ્નોની ઝડપી ક્વિઝ પૂર્ણ કરવી." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "मात्रा उच्चारण", action: "प्रतिदिन 5 मिनट मात्राओं की बोलकर पहचान।" },
              { days: "दिन 6–10", title: "वाक्य अभ्यास", action: "गलत हुए शब्दों को सही वाक्यों में लिखने का अभ्यास।" },
              { days: "दिन 11–15", title: "स्पीड क्विज़", action: "75%+ सटीकता के लिए 10 प्रश्नों की क्विज़।" }
            ]
          : [
              { days: "Days 1–5", title: "Matra Sound Practice", action: "5 mins daily comparing short and long vowel sounds aloud." },
              { days: "Days 6–10", title: "Sentence Practice", action: "Write sentences using missed words with correct matras." },
              { days: "Days 11–15", title: "Accuracy Quiz", action: "Complete a 10-question quiz aiming for 75%+ score." }
            ]
      };
    }

    if (domain === "math") {
      return {
        title: isGu ? "ગણિત: વદી અને દશકાના નિયમો" : isHi ? "गणित: हासिल और उधार के नियम" : "Mathematics: Place-Value & Carryover Practice",
        observation: isGu
          ? `${child} એ ગણિતમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). મોટી સંખ્યાના સરવાળામાં વદી અને બાદબાકીમાં દશકો લેતી વખતે ઉતાવળમાં ભૂલો થાય છે.`
          : isHi
          ? `${child} ने गणित में ${acc}% स्कोर किया है (${errors} गलतियां)। जोड़ में हासिल और घटाव में उधार लेते समय जल्दबाजी में गलतियां हो रही हैं।`
          : `${child} scored ${acc}% in Mathematics with ${errors} misses. Multi-digit addition with carryover and subtraction with borrowing need practice.`,
        actionStep: isGu
          ? `સાથે બેસીને 2 દાખલા કાગળ પર ગણો અને વદી/દશકાના અંકો અલગ ખાનામાં લખાવો.`
          : isHi
          ? `साथ बैठकर 2 सवाल कागज़ पर हल करें और हासिल वाले अंकों को अलग रंग से लिखें।`
          : `Solve 2 multi-step arithmetic problems on paper together with column alignment.`,
        whyItMatters: isGu
          ? `કાગળ પર સ્ટેપ-બાય-સ્ટેપ લખવાથી બાળકના મન પર બોજ પડતો નથી અને ગણતરી ચોક્કસ બને છે.`
          : isHi
          ? `कागज़ पर चरणबद्ध लिखने से बच्चे का भ्रम दूर होता है और गणना सटीक होती है।`
          : `Writing down steps on paper prevents rushing and helps the child calculate with confidence.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "વદી-દશકા અભ્યાસ", action: "રોજ 10 મિનિટ કાગળ પર સરવાળા-બાદબાકીની પ્રેક્ટિસ." },
              { days: "દિવસ 6–10", title: "કૂટપ્રશ્નો", action: "પ્રશ્ન વાંચી શું આપ્યું છે અને શું શોધવાનું છે તે અલગ તારવવું." },
              { days: "દિવસ 11–15", title: "ચોકસાઈ ચકાસણી", action: "75%+ સ્કોર માટે ઝડપી દાખલા ગણતરી." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "हासिल-उधार अभ्यास", action: "रोज 10 मिनट कागज़ पर गणना का अभ्यास।" },
              { days: "दिन 6–10", title: "इबारती सवाल", action: "पहले प्रश्न समझें और फिर हल करें।" },
              { days: "दिन 11–15", title: "सटीकता जांच", action: "75%+ स्कोर के लिए त्वरित अभ्यास।" }
            ]
          : [
              { days: "Days 1–5", title: "Regrouping Practice", action: "10 mins daily multi-digit addition & subtraction on paper." },
              { days: "Days 6–10", title: "Word Problem Steps", action: "Identify what is given vs. what needs to be calculated." },
              { days: "Days 11–15", title: "Speed & Accuracy Check", action: "10-question timed practice aiming for 75%+ score." }
            ]
      };
    }

    if (domain === "gujarati") {
      return {
        title: isGu ? "ગુજરાતી: જોડણી અને કાળના નિયમો" : isHi ? "गुजराती: वर्तनी और काल नियम" : "Gujarati: Jodani (જોડણી) & Vowel Rule Recovery",
        observation: isGu
          ? `${child} એ ગુજરાતીમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). હ્રસ્વ-દીર્ઘ જોડણી અને કાળના વાક્યોમાં થોડી અડચણ છે.`
          : isHi
          ? `${child} ने गुजराती में ${acc}% स्कोर किया है (${errors} गलतियां)। वर्तनी और व्याकरण के नियमों में थोड़ा अभ्यास आवश्यक है।`
          : `${child} scored ${acc}% in Gujarati across ${errors} misses. Vowel duration (હ્રસ્વ/દીર્ઘ) and sentence verb concord need attention.`,
        actionStep: isGu
          ? `ગુજરાતી વાર્તાનો 1 ફકરો સાથે મોટેથી વાંચો અને હ્રસ્વ (િ) અને દીર્ઘ (ી) વાળા શબ્દો જુઓ.`
          : isHi
          ? `कहानी का 1 पैराग्राफ साथ में बोलकर पढ़ें और मुख्य शब्दों पर ध्यान दें।`
          : `Read 1 short Gujarati story paragraph aloud together to contrast હ્રસ્વ (િ) and દીર્ઘ (ી) sounds.`,
        whyItMatters: isGu
          ? `સાથે મોટેથી વાંચવાથી બાળક શબ્દોનો સાચો અવાજ અને સાચી જોડણી કાયમ માટે યાદ રાખી શકે છે.`
          : isHi
          ? `बोलकर पढ़ने से भाषा की समझ और वर्तनी दोनों मजबूत होती हैं।`
          : `Reading aloud connects spoken sounds to spelling rules, strengthening vocabulary retention.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "જોડણી ઓળખ", action: "રોજ 5 મિનિટ હ્રસ્વ-દીર્ઘ શબ્દોનું મોટેથી વાચન." },
              { days: "દિવસ 6–10", title: "વ્યાકરણ મહાવરો", action: "સમાનાર્થી અને વિરોધી શબ્દોની સરળ પ્રેક્ટિસ." },
              { days: "દિવસ 11–15", title: "ગદ્યાર્થગ્રહણ", action: "વાંચીને પ્રશ્નોના સાચા જવાબ આપવાની પ્રેક્ટિસ." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "वर्तनी पहचान", action: "रोज 5 मिनट मात्राओं का बोलकर पठन।" },
              { days: "दिन 6–10", title: "व्याकरण अभ्यास", action: "समानार्थी और विलोम शब्दों का अभ्यास।" },
              { days: "दिन 11–15", title: "गद्यांश समझ", action: "पढ़कर प्रश्नों के उत्तर देने का अभ्यास।" }
            ]
          : [
              { days: "Days 1–5", title: "Jodani Phonetic Anchoring", action: "5–10 mins daily reading aloud focusing on matra rules." },
              { days: "Days 6–10", title: "Grammar Retries", action: "Practice synonyms and antonyms with contextual hints." },
              { days: "Days 11–15", title: "Reading Benchmark", action: "Short passage comprehension aiming for 75%+ score." }
            ]
      };
    }

    if (domain === "english") {
      return {
        title: isGu ? "અંગ્રેજી: કાળ અને ક્રિયાપદ સંબંધ" : isHi ? "अंग्रेजी: काल और क्रिया रूप सुधार" : "English: Tense Consistency & Grammar Concord",
        observation: isGu
          ? `${child} એ અંગ્રેજીમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). ભૂતકાળ અને વર્તમાનકાળના ક્રિયાપદો પસંદ કરવામાં ઉતાવળ થાય છે.`
          : isHi
          ? `${child} ने अंग्रेजी में ${acc}% स्कोर किया है (${errors} गलतियां)। समय सूचक शब्दों और क्रिया के रूपों में अभ्यास की आवश्यकता है।`
          : `${child} scored ${acc}% in English across ${errors} mistakes. Identifying time anchor words (yesterday, every day) will clarify verb tense selection.`,
        actionStep: isGu
          ? `2 વાક્યો સાથે વાંચો અને સમય દર્શાવતા શબ્દ (yesterday, tomorrow) પર અંડરલાઈન કરાવો.`
          : isHi
          ? `2 वाक्य साथ में पढ़ें और समय बताने वाले शब्दों (yesterday, always) को रेखांकित करें।`
          : `Read 2 sentences together and spot the time clue word before picking the correct verb tense.`,
        whyItMatters: isGu
          ? `સમય દર્શાવતા શબ્દો ઓળખવાથી બાળકની વ્યાકરણની ગૂંચવણ તરત જ દૂર થઈ જાય છે.`
          : isHi
          ? `समय सूचक शब्दों की पहचान से काल संबंधी गलतियां आसानी से दूर हो जाती हैं।`
          : `Time clue words give instant context and avoid grammar confusion.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "કાળ ઓળખ", action: "વાક્યોમાં સમયસૂચક શબ્દો શોધી ક્રિયાપદ નક્કી કરવું." },
              { days: "દિવસ 6–10", title: "ખાલી જગ્યા પૂરો", action: "ખોટા પડેલા પ્રશ્નો ફરીથી હલ કરવાનો મહાવરો." },
              { days: "દિવસ 11–15", title: "ઝડપી ક્વિઝ", action: "75%+ ચોકસાઈ માટે ટૂંકી ક્વિઝ પૂર્ણ કરવી." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "काल पहचान", action: "वाक्यों में समय सूचक शब्द पहचान कर क्रिया चुनें।" },
              { days: "दिन 6–10", title: "रिक्त स्थान", action: "गलत हुए प्रश्नों को पुनः हल करें।" },
              { days: "दिन 11–15", title: "क्विज़", action: "75%+ सटीकता के लिए अभ्यास क्विज़।" }
            ]
          : [
              { days: "Days 1–5", title: "Tense Clues", action: "Spot time words (yesterday, always) in short sentences." },
              { days: "Days 6–10", title: "Fill-in-the-Blanks", action: "Re-solve missed questions with simple hints." },
              { days: "Days 11–15", title: "Reading Benchmark", action: "Short passage quiz aiming for 70%+ score." }
            ]
      };
    }

    if (domain === "science") {
      return {
        title: isGu ? "વિજ્ઞાન: વિભાવનાઓ અને પ્રક્રિયાઓ" : isHi ? "विज्ञान: अवधारणाएं और प्रक्रियाएं" : "Science: Practical Understanding",
        observation: isGu
          ? `${child} એ વિજ્ઞાનમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). વૈજ્ઞાનિક શબ્દો અને કુદરતી ચક્રો સમજવામાં થોડી અડચણ છે.`
          : isHi
          ? `${child} ने विज्ञान में ${acc}% स्कोर किया है (${errors} गलतियां)। वैज्ञानिक शब्दों और प्राकृतिक नियमों को समझने में थोड़ी मदद चाहिए।`
          : `${child} scored ${acc}% in Science with ${errors} misses. Connecting concepts to real-world observations will build confidence.`,
        actionStep: isGu
          ? `આજનો વિષય ઘરના સરળ પ્રયોગ દ્વારા સમજાવો (દા.ત. પાંદડાની રચના કે વરાળનું બનવું).`
          : isHi
          ? `दैनिक घरेलू उदाहरणों (जैसे पानी का उबलना या पौधों की पत्तियां) से अवधारणा स्पष्ट करें।`
          : `Explain today's topic with a simple household example (like steam or leaves).`,
        whyItMatters: isGu
          ? `આંખે જોયેલી પ્રક્રિયા બાળક ક્યારેય ભૂલતું નથી અને ગોખણપટ્ટી વગર સાચો જવાબ આપે છે.`
          : isHi
          ? `प्रत्यक्ष उदाहरणों से बच्चे बिना रटे लंबे समय तक नियम याद रखते हैं।`
          : `Real-world examples make science easy to remember without rote memorization.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "ચિત્ર સમજ", action: "મુખ્ય પ્રક્રિયાઓ ચિત્ર કે આકૃતિ દ્વારા સમજવી." },
              { days: "દિવસ 6–10", title: "પ્રશ્નોત્તરી મહાવરો", action: "ખોટા પડેલા પ્રશ્નોના કારણો સમજી ફરી પ્રેક્ટિસ કરવી." },
              { days: "દિવસ 11–15", title: "વિજ્ઞાન પડકાર", action: "75%+ સ્કોર માટે ઝડપી ક્વિઝ પૂર્ણ કરવી." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "चित्र समझ", action: "मुख्य प्रक्रियाओं को चित्र या आरेख से समझें।" },
              { days: "दिन 6–10", title: "प्रश्नोत्तरी अभ्यास", action: "गलत प्रश्नों को समझकर पुनः हल करें।" },
              { days: "दिन 11–15", title: "विज्ञान चुनौती", action: "75%+ स्कोर के लिए त्वरित क्विज़।" }
            ]
          : [
              { days: "Days 1–5", title: "Visual Mapping", action: "Map natural processes using simple diagrams." },
              { days: "Days 6–10", title: "Review Mistakes", action: "Re-solve missed questions with simple explanations." },
              { days: "Days 11–15", title: "Science Challenge", action: "8-question challenge targeting 75%+ score." }
            ]
      };
    }

    if (domain === "social") {
      return {
        title: isGu ? "સામાજિક વિજ્ઞાન: સમયરેખા અને નકશા સમજણ" : isHi ? "सामाजिक विज्ञान: समयरेखा और मानचित्र" : "Social Studies: Timeline & Map Practice",
        observation: isGu
          ? `${child} એ સામાજિક વિજ્ઞાનમાં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). ઐતિહાસિક ક્રમ અને નકશાના પ્રશ્નોમાં થોડી ગૂંચવણ છે.`
          : isHi
          ? `${child} ने सामाजिक विज्ञान में ${acc}% स्कोर किया है (${errors} गलतियां)। ऐतिहासिक घटनाओं के क्रम और मानचित्र को समझने में अभ्यास चाहिए।`
          : `${child} scored ${acc}% in Social Studies with ${errors} misses. Understanding events in order will restore confidence.`,
        actionStep: isGu
          ? `મુખ્ય ઘટનાઓને કાગળ પર 1, 2, 3 ક્રમમાં વાર્તાની જેમ લખાવો.`
          : isHi
          ? `प्रमुख घटनाओं को कागज़ पर 1, 2, 3 क्रम में कहानी की तरह लिखें।`
          : `Write down major events in 1, 2, 3 story order on paper.`,
        whyItMatters: isGu
          ? `વાર્તા રૂપે ઘટનાક્રમ યાદ રાખવાથી ગોખવાની જરૂર રહેતી નથી અને યાદશક્તિ વધે છે.`
          : isHi
          ? `कहानी के रूप में क्रम याद रखने से रटने की ज़रूरत नहीं होती और समझ गहरी होती है।`
          : `Story-based ordering makes history natural to remember without rote memorization.`,
        planSteps: isGu
          ? [
              { days: "દિવસ 1–5", title: "વાર્તા ક્રમ", action: "મુખ્ય ઘટનાઓ વાર્તા સ્વરૂપે ક્રમબદ્ધ યાદ રાખવી." },
              { days: "દિવસ 6–10", title: "નકશા અભ્યાસ", action: "રાજ્યો અને ભૌગોલિક સ્થાનો નકશામાં ઓળખવા." },
              { days: "દિવસ 11–15", title: "યુનિટ ટેસ્ટ", action: "75%+ સ્કોર માટે સમયબદ્ધ ટેસ્ટ પૂર્ણ કરવો." }
            ]
          : isHi
          ? [
              { days: "दिन 1–5", title: "कहानी क्रम", action: "प्रमुख घटनाओं को कहानी की तरह याद रखें।" },
              { days: "दिन 6–10", title: "मानचित्र अभ्यास", action: "राज्यों और मुख्य स्थानों को मानचित्र पर देखें।" },
              { days: "दिन 11–15", title: "यूनिट टेस्ट", action: "75%+ स्कोर के लिए टेस्ट पूरा करें।" }
            ]
          : [
              { days: "Days 1–5", title: "Story Chronology", action: "Link major events into a simple narrative flow." },
              { days: "Days 6–10", title: "Map Practice", action: "Review geography questions on a map." },
              { days: "Days 11–15", title: "Unit Test", action: "10-question quiz aiming for 75%+ score." }
            ]
      };
    }

    // General fallback
    return {
      title: isGu ? `${localizedSub}: પાયાની વિભાવનાઓ` : isHi ? `${localizedSub}: बुनियादी अवधारणाएं` : `${localizedSub}: Foundation Recovery`,
      observation: isGu
        ? `${child} એ ${localizedSub} માં ${acc}% સ્કોર કર્યો છે (${errors} ભૂલો). પાયાના પ્રશ્નોમાં થોડું માર્ગદર્શન જરૂરી છે.`
        : isHi
        ? `${child} ने ${localizedSub} में ${acc}% स्कोर किया है (${errors} गलतियां)। बुनियादी सवालों में थोड़ा मार्गदर्शन उपयोगी रहेगा।`
        : `${child} scored ${acc}% in ${localizedSub} with ${errors} misses. Core concept review will restore confidence.`,
      actionStep: isGu
        ? `અઘરા પ્રશ્નને 2 નાના પ્રશ્નોમાં વહેંચીને સાથે ઉકેલો.`
        : isHi
        ? `कठिन सवाल को 2 छोटे भागों में बांटकर हल करें।`
        : `Break down 1 complex question into 2 simpler sub-questions together.`,
      whyItMatters: isGu
        ? `નાના પગલાંમાં સમજાવવાથી બાળક પર દબાણ આવતું નથી અને સાચો તર્ક વિકસે છે.`
        : isHi
        ? `छोटे चरणों में समझाने से बच्चे पर तनाव नहीं होता और समझ पक्की होती है।`
        : `Breaking problems into smaller steps eliminates frustration and builds logical reasoning.`,
      planSteps: isGu
        ? [
            { days: "દિવસ 1–5", title: "પાયાની સમજ", action: "રોજ 10 મિનિટ મુખ્ય નિયમોનું રિવિઝન." },
            { days: "દિવસ 6–10", title: "ભૂલ સુધારણા", action: "અગાઉ ખોટા પડેલા પ્રશ્નો ફરી હલ કરવા." },
            { days: "દિવસ 11–15", title: "માઇલસ્ટોન ટેસ્ટ", action: "70%+ ચોકસાઈ માટે લક્ષિત ક્વિઝ." }
          ]
        : isHi
        ? [
            { days: "दिन 1–5", title: "बुनियादी समझ", action: "रोज 10 मिनट मुख्य नियमों का दोहराव।" },
            { days: "दिन 6–10", title: "त्रुटि सुधार", action: "पहले गलत हुए प्रश्नों को पुनः हल करें।" },
            { days: "दिन 11–15", title: "माइलस्टोन टेस्ट", action: "70%+ सटीकता के लिए अभ्यास क्विज़।" }
          ]
        : [
            { days: "Days 1–5", title: "Core Review", action: "10 mins daily review focusing on core definitions." },
            { days: "Days 6–10", title: "Error Retries", action: "Re-solve previously missed questions with hints." },
            { days: "Days 11–15", title: "Milestone Quiz", action: "5-question quiz aiming for 70%+ score." }
          ]
    };
  }

  if (priority === "moderate") {
    return {
      title: isGu ? `${localizedSub}: નિયમિત મહાવરો અને ઝડપ` : isHi ? `${localizedSub}: नियमित अभ्यास और गति` : `${localizedSub}: Strategy Reinforcement`,
      observation: isGu
        ? `${child} ${localizedSub} માં ${acc}% ચોકસાઈ સાથે સારું પ્રદર્શન કરી રહ્યું છે. થોડી વધુ પ્રેક્ટિસથી સ્કોર 75% થી ઉપર પહોંચી જશે.`
        : isHi
        ? `${child} ${localizedSub} में ${acc}% सटीकता के साथ अच्छा प्रदर्शन कर रहा है। थोड़े और अभ्यास से स्कोर 75% से ऊपर चला जाएगा।`
        : `${child} maintains a solid ${acc}% baseline in ${localizedSub}. Targeted practice will push accuracy past 75%.`,
      actionStep: isGu
        ? `રોજ 2 પ્રશ્નો મોટેથી વિચારીને ગણવા કહો જેથી બાળક પોતાની ભૂલ જાતે પકડી શકે.`
        : isHi
        ? `रोज 2 सवालों को बोलकर हल करने को कहें ताकि बच्चा अपनी गलती खुद पहचान सके।`
        : `Encourage ${child} to verbalize their steps out loud while solving 2 problems.`,
      whyItMatters: isGu
        ? `મોટેથી વિચારીને બોલવાથી વિચારવાની ઝડપ અને ચોકસાઈ બંને વધે છે.`
        : isHi
        ? `बोलकर हल करने से सोचने की गति और सटीकता दोनों बढ़ती हैं।`
        : `Verbalizing steps turns intermediate understanding into permanent cognitive habits.`,
      planSteps: isGu
        ? [
            { days: "દિવસ 1–5", title: "ચોકસાઈ મહાવરો", action: "ઉતાવળમાં થતી ભૂલો અટકાવવા સ્ટેપ-બાય-સ્ટેપ લખવાની પ્રેક્ટિસ." },
            { days: "દિવસ 6–10", title: "ઝડપી પ્રશ્નોત્તરી", action: "10 મિનિટની ક્વિઝ દ્વારા સમય મર્યાદામાં સાચો જવાબ આપવાનો મહાવરો." }
          ]
        : isHi
        ? [
            { days: "दिन 1–5", title: "सटीकता अभ्यास", action: "जल्दबाजी रोकने के लिए चरणबद्ध लिखने का अभ्यास।" },
            { days: "दिन 6–10", title: "क्विज़ अभ्यास", action: "समय सीमा में सही उत्तर देने का अभ्यास।" }
          ]
        : [
            { days: "Days 1–5", title: "Precision Drills", action: "Review intermediate questions to eliminate careless slips." },
            { days: "Days 6–10", title: "Speed Practice", action: "Timed 10-minute quiz sprints with focus on reading precision." }
          ]
    };
  }

  // priority === "low"
  return {
    title: isGu ? `${localizedSub}: ઉત્તમ પકડ અને આત્મવિશ્વાસ` : isHi ? `${localizedSub}: उत्कृष्ट समझ और आत्मविश्वास` : `Mastery in ${localizedSub}`,
    observation: isGu
      ? `${child} એ ${localizedSub} માં ${acc}% ચોકસાઈ સાથે શાનદાર પરિણામ મેળવ્યું છે! વિષયમાં ઉત્સાહ અને પકડ ખૂબ મજબૂત છે.`
      : isHi
      ? `${child} ने ${localizedSub} में ${acc}% सटीकता के साथ शानदार परिणाम प्राप्त किया है! विषय में आत्मविश्वास बहुत मजबूत है।`
      : `${child} demonstrates outstanding mastery in ${localizedSub} with ${acc}% accuracy! Retention and confidence are at peak levels.`,
    actionStep: isGu
      ? `બાળકને પૂછો: "આ દાખલો કેમ ગણ્યો એ મને પણ શીખવ!" શીખવવાથી જ્ઞાન કાયમ માટે પાકું થાય છે.`
      : isHi
      ? `बच्चे से कहें: "यह सवाल कैसे हल किया, मुझे भी सिखाओ!" सिखाने से समझ हमेशा के लिए पक्की होती है।`
      : `Ask ${child}: "Can you teach me how you solved that question?" Teaching deepens retention.`,
    whyItMatters: isGu
      ? `બાળક જ્યારે બીજાને શીખવે છે ત્યારે તેનો આત્મવિશ્વાસ બમણો થઈ જાય છે.`
      : isHi
      ? `दूसरों को सिखाने से बच्चे का आत्मविश्वास दोगुना हो जाता है।`
      : `Explaining concepts to others builds lasting memory and self-confidence.`,
    planSteps: isGu
      ? [
          { days: "દિવસ 1–7", title: "જ્ઞાન જાળવણી", action: "અઠવાડિયામાં એકવાર હળવી ક્વિઝથી વિષયમાં રુચિ જાળવી રાખો." }
        ]
      : isHi
      ? [
          { days: "दिन 1–7", title: "ज्ञान स्थिरता", action: "सप्ताह में एक बार हल्की क्विज़ से रुचि बनाए रखें।" }
        ]
      : [
          { days: "Days 1–7", title: "Spaced Recall", action: "Weekly light review quizzes to protect recall without fatigue." }
        ]
  };
}

function getInsightHeadlineAndTakeaway(insight: PriorityInsight, lang: string = "gu"): { headline: string; takeaway: string } {
  if (insight.headline && insight.quickTakeaway) {
    return { headline: insight.headline, takeaway: insight.quickTakeaway };
  }
  const rawSubj = insight.subject || insight.title.split(":")[0] || "General";
  const acc = insight.accuracy !== undefined ? Math.round(insight.accuracy) : null;
  const dom = getSubjectDomain(rawSubj);
  const isGu = lang === "gu";
  const isHi = lang === "hi";
  const subj = getLocalizedSubjectName(rawSubj, lang);
  const accStr = acc !== null ? (isGu ? `${acc}% ચોકસાઈ` : isHi ? `${acc}% सटीकता` : `${acc}% Accuracy`) : (isGu ? "ધ્યાન આપવાની જરૂર" : isHi ? "ध्यान देने की आवश्यकता" : "Needs Review");

  if (insight.priority === "urgent") {
    if (dom === "hindi") {
      return {
        headline: isGu ? `⚠️ હિન્દી: ${accStr} — માત્રા અને જોડણી સુધારવાની જરૂર` : isHi ? `⚠️ हिन्दी: ${accStr} — मात्रा और वर्तनी अभ्यास आवश्यक` : `⚠️ Hindi: ${accStr} — Matra & Spelling Practice Needed`,
        takeaway: isGu ? "હ્રસ્વ અને દીર્ઘ માત્રા (ઇ/ઈ, ઉ/ઊ) ના સાચા ઉચ્ચાર પર ધ્યાન આપો." : isHi ? "छोटी और बड़ी मात्राओं के सही उच्चारण पर ध्यान दें।" : "Practice short vs. long vowel sounds (इ vs ई) aloud together."
      };
    }
    if (dom === "math") {
      return {
        headline: isGu ? `⚠️ ગણિત: ${accStr} — વદી અને દશકાના નિયમો સમજાવવાની જરૂર` : isHi ? `⚠️ गणित: ${accStr} — हासिल और उधार के नियम स्पष्ट करें` : `⚠️ Mathematics: ${accStr} — Place-Value & Regrouping Review`,
        takeaway: isGu ? "કાગળ પર ખાના દોરીને ગણતરી કરવાથી ભૂલો તરત ઘટી જશે." : isHi ? "कागज़ पर चरणबद्ध लिखकर गणना करने से गलतियां कम होंगी।" : "Writing down steps on paper prevents arithmetic slips."
      };
    }
    if (dom === "gujarati") {
      return {
        headline: isGu ? `⚠️ ગુજરાતી: ${accStr} — જોડણી અને કાળના નિયમો સુધારવાની જરૂર` : isHi ? `⚠️ Gujarati: ${accStr} — वर्तनी और काल नियम अभ्यास` : `⚠️ Gujarati: ${accStr} — Quick Jodani & Vowel Review Needed`,
        takeaway: isGu ? "વાર્તા મોટેથી વાંચવાથી હ્રસ્વ-દીર્ઘનો ભેદ આપોઆપ સ્પષ્ટ થઈ જશે." : isHi ? "बोलकर कहानी पढ़ने से वर्तनी का अंतर स्पष्ट होगा।" : "Reading aloud clarifies short (િ) vs long (ી) sound rules."
      };
    }
    if (dom === "english") {
      return {
        headline: isGu ? `⚠️ અંગ્રેજી: ${accStr} — કાળ અને ક્રિયાપદ સંબંધ સુધારવાની જરૂર` : isHi ? `⚠️ अंग्रेजी: ${accStr} — काल और क्रिया रूप अभ्यास` : `⚠️ English: ${accStr} — Verb Tense & Sentence Practice`,
        takeaway: isGu ? "વાક્યમાં સમયસૂચક શબ્દો (yesterday, always) ઓળખવાથી કાળ સાચો પડશે." : isHi ? "समय सूचक शब्दों की पहचान से काल सही होगा।" : "Spotting time clue words (yesterday, always) anchors tense accuracy."
      };
    }
    if (dom === "science") {
      return {
        headline: isGu ? `⚠️ વિજ્ઞાન: ${accStr} — વૈજ્ઞાનિક વિભાવનાઓ સરળ રીતે સમજાવવાની જરૂર` : isHi ? `⚠️ विज्ञान: ${accStr} — वैज्ञानिक अवधारणाएं स्पष्ट करें` : `⚠️ Science: ${accStr} — Concept Clarification`,
        takeaway: isGu ? "ઘરના રોજિંદા ઉદાહરણોથી વિજ્ઞાન કાયમ યાદ રહી જાય છે." : isHi ? "दैनिक घरेलू उदाहरणों से विज्ञान की समझ गहरी होती है।" : "Everyday household examples make science easy to remember."
      };
    }
    if (dom === "social") {
      return {
        headline: isGu ? `⚠️ સામાજિક વિજ્ઞાન: ${accStr} — સમયરેખા અને નકશા સમજણ જરૂરી` : isHi ? `⚠️ सामाजिक विज्ञान: ${accStr} — समयरेखा और मानचित्र समझ जरूरी` : `⚠️ Social Studies: ${accStr} — Timeline & Map Practice`,
        takeaway: isGu ? "તારીખો ગોખવા કરતાં ઘટનાઓ વાર્તાની જેમ ક્રમબદ્ધ સમજવી સરળ છે." : isHi ? "तारीखें रटने के बजाय घटनाओं को कहानी की तरह समझें।" : "Connecting events like a story makes history easy to remember."
      };
    }
    return {
      headline: isGu ? `⚠️ ${subj}: ${accStr} — વિભાવનાઓનું ઝડપી પુનરાવર્તન જરૂરી` : isHi ? `⚠️ ${subj}: ${accStr} — अवधारणाओं का त्वरित अभ्यास जरूरी` : `⚠️ ${subj}: ${accStr} — Quick Concept Review Needed`,
      takeaway: isGu ? "પ્રશ્નને નાના ભાગોમાં વહેંચીને સમજાવવાથી બાળકનો આત્મવિશ્વાસ વધશે." : isHi ? "सवालों को छोटे चरणों में समझाने से बच्चे का आत्मविश्वास बढ़ेगा।" : "Solving questions step-by-step restores learning confidence."
    };
  } else if (insight.priority === "moderate") {
    return {
      headline: isGu ? `⚡ ${subj}: ${accStr} — નિયમિત મહાવરો જાળવી રાખો` : isHi ? `⚡ ${subj}: ${accStr} — नियमित अभ्यास बनाए रखें` : `⚡ ${subj}: ${accStr} — Strategy Reinforcement`,
      takeaway: isGu ? "રોજ 10 મિનિટ પ્રેક્ટિસ કરવાથી સ્કોર 75% થી ઉપર પહોંચી જશે." : isHi ? "रोज 10 मिनट अभ्यास से स्कोर 75% से ऊपर पहुंच जाएगा।" : "Consistent 10-minute micro-drills will push accuracy past 75%."
    };
  } else {
    return {
      headline: isGu ? `✨ ${subj}: ${accStr} — વિષયમાં ઉત્તમ પકડ અને આત્મવિશ્વાસ` : isHi ? `✨ ${subj}: ${accStr} — विषय में मजबूत पकड़ और आत्मविश्वास` : `✨ ${subj}: ${accStr} — Peak Subject Mastery`,
      takeaway: isGu ? "બાળક આ વિષયમાં ખૂબ સરસ કરી રહ્યું છે! ઉત્સાહ વધારતા રહો." : isHi ? "बच्चा इस विषय में बहुत अच्छा कर रहा है! उत्साहवर्धन जारी रखें।" : "Outstanding performance! Encourage them to explain methods to others."
    };
  }
}

function getPriorityInsights(
  subjects: SubjectAnalytics[],
  child: string,
  overallAcc: number,
  t: (key: string, def?: any) => string,
  tipData?: Tip | null,
  lang: string = "gu"
): Record<"urgent" | "moderate" | "low", PriorityInsight[]> {
  const result: Record<"urgent" | "moderate" | "low", PriorityInsight[]> = {
    urgent: [],
    moderate: [],
    low: []
  };

  subjects.forEach(sub => {
    const acc = Math.round(sub.accuracy ?? 0);
    const subName = sub.subject || "Subject";
    const errors = sub.wrongAnswers ?? (acc < 50 ? 5 : 2);
    const domain = getSubjectDomain(subName);

    if (acc < 50 || sub.isRisk || (sub.consecutiveDaysBelow70 && sub.consecutiveDaysBelow70 >= 2)) {
      const p = getDomainPedagogy(domain, "urgent", subName, acc, errors, child, lang);
      result.urgent.push({
        id: `urgent-${subName}`,
        priority: "urgent",
        subject: subName,
        accuracy: acc,
        title: p.title,
        observation: p.observation,
        actionStep: p.actionStep,
        whyItMatters: p.whyItMatters,
        badgeTag: t("priority_urgent", "Urgent Priority"),
        badgeBg: "bg-rose-50",
        badgeBorder: "border-rose-200",
        badgeText: "text-rose-700",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-700",
        diagnosticSummary: `${subName}: ${acc}% accuracy`,
        planSteps: p.planSteps
      });
    } else if (acc < 75) {
      const p = getDomainPedagogy(domain, "moderate", subName, acc, errors, child, lang);
      result.moderate.push({
        id: `mod-${subName}`,
        priority: "moderate",
        subject: subName,
        accuracy: acc,
        title: p.title,
        observation: p.observation,
        actionStep: p.actionStep,
        whyItMatters: p.whyItMatters,
        badgeTag: t("priority_moderate", "Moderate Focus"),
        badgeBg: "bg-amber-50",
        badgeBorder: "border-amber-200",
        badgeText: "text-amber-800",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-700",
        diagnosticSummary: `${subName}: ${acc}% accuracy`,
        planSteps: p.planSteps
      });
    } else {
      const p = getDomainPedagogy(domain, "low", subName, acc, errors, child, lang);
      result.low.push({
        id: `low-${subName}`,
        priority: "low",
        subject: subName,
        accuracy: acc,
        title: p.title,
        observation: p.observation,
        actionStep: p.actionStep,
        whyItMatters: p.whyItMatters,
        badgeTag: t("priority_low", "Low Priority · Steady"),
        badgeBg: "bg-teal-50",
        badgeBorder: "border-teal-200",
        badgeText: "text-[#006a62]",
        iconBg: "bg-teal-100",
        iconColor: "text-[#006a62]",
        diagnosticSummary: `${subName}: High mastery at ${acc}%`,
        planSteps: p.planSteps
      });
    }
  });

  // Fallback defaults if a tab has no subjects
  const isGu = lang === "gu";
  const isHi = lang === "hi";
  if (result.urgent.length === 0) {
    result.urgent.push({
      id: "urgent-fallback",
      priority: "urgent",
      title: isGu ? "તમામ વિષયો સુરક્ષિત છે" : isHi ? "सभी विषय सुरक्षित हैं" : "All Subjects Secure",
      observation: isGu ? `${child} ના તમામ વિષયોમાં પરિણામ સારું છે. કોઈ તાત્કાલિક જોખમ નથી.` : isHi ? `${child} के सभी मूल्यांकन किए गए विषयों में प्रदर्शन जोखिम सीमा से ऊपर और सुरक्षित है।` : `All evaluated subjects for ${child} are performing above risk thresholds.`,
      actionStep: isGu ? "નિયમિત પ્રેક્ટિસ ચાલુ રાખો." : isHi ? "दैनिक अभ्यास की दिनचर्या जारी रखें।" : "Keep up the daily practice routine.",
      whyItMatters: isGu ? "રોજિંદો અભ્યાસ જ્ઞાનને સ્થિર રાખે છે." : isHi ? "निरंतर आदतें सीखने की गति को बनाए रखती हैं।" : "Consistent habits maintain learning momentum.",
      badgeTag: t("priority_urgent", "Urgent Priority"),
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-700",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
      headline: isGu ? "✅ કોઈ તાત્કાલિક ચેતવણી નથી" : isHi ? "✅ कोई जरूरी चेतावनी नहीं" : "✅ No Urgent Warnings",
      quickTakeaway: isGu ? "બધા વિષયોમાં પરિણામ સંતોષકારક છે." : isHi ? "सभी विषयों में प्रदर्शन स्वस्थ स्तर पर है।" : "All subjects are performing at a healthy level."
    });
  }

  if (result.moderate.length === 0) {
    result.moderate.push({
      id: "mod-habit",
      priority: "moderate",
      title: isGu ? "દૈનિક અભ્યાસની સુનિશ્ચિતતા" : isHi ? "दैनिक अध्ययन की निरंतरता" : "Daily Study Rhythm",
      observation: isGu ? `શાળા પછી રોજના 10 મિનિટનો નિશ્ચિત સમય બાળકનો ઉત્સાહ વધારે છે.` : isHi ? `दैनिक 10 मिनट का निश्चित समय ${child} के लिए अध्ययन की झिझक कम करता है।` : `Predictable daily study windows reduce hesitation for ${child}.`,
      actionStep: isGu ? "રોજ સાંજે 10 મિનિટ એકસાથે બેસીને વાતો કે અભ્યાસ કરો." : isHi ? "रोजाना 10 मिनट का तनावमुक्त अध्ययन समय निर्धारित करें।" : "Agree on a fixed, pressure-free 10-minute daily learning window.",
      whyItMatters: isGu ? "નિયમિત ટેવ બાળકના મગજને સક્રિય રાખે છે." : isHi ? "नियमित दिनचर्या से पढ़ाई का तनाव खत्म होता है।" : "Consistent routines eliminate daily study friction.",
      badgeTag: t("priority_moderate", "Moderate Focus"),
      badgeBg: "bg-amber-50",
      badgeBorder: "border-amber-200",
      badgeText: "text-amber-800",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      headline: isGu ? "⚡ દૈનિક અભ્યાસ લય જાળવો" : isHi ? "⚡ दैनिक अध्ययन की लय बनाए रखें" : "⚡ Maintain Daily Study Rhythm",
      quickTakeaway: isGu ? "રોજ 10 મિનિટનો સમય બાળકના ઉત્સાહમાં વધારો કરે છે." : isHi ? "नियमित समय निर्धारित करने से स्थायी अध्ययन की आदतें बनती हैं।" : "A fixed daily time window builds lasting study habits."
    });
  }

  if (result.low.length === 0) {
    result.low.push({
      id: "low-mindset",
      priority: "low",
      title: isGu ? "બાળકના પ્રયત્નોની પ્રશંસા" : isHi ? "प्रयास और जिज्ञासा की सराहना" : "Praise Effort & Curiosity",
      observation: isGu ? `${child} ના સારા પ્રયત્નો અને મહેનતની પ્રશંસા કરવાથી તેનો આત્મવિશ્વાસ વધે છે.` : isHi ? `${child} के सही प्रयासों और कड़ी मेहनत की सराहना करने से आत्मविश्वास बढ़ता है।` : `${child} responds best when hard work is praised over perfection.`,
      actionStep: isGu ? `કહો: "તેં ખૂબ સરસ પ્રયત્ન કર્યો, મને તારા પર ગર્વ છે!"` : isHi ? `कहें: "मुझे बहुत गर्व है कि आपने आज इतनी लगन से कोशिश की!"` : `Tell ${child}: "I love how persistent you were today!"`,
      whyItMatters: isGu ? "પ્રશંસાથી બાળક અઘરા વિષયોથી ડર્યા વગર શીખવા તૈયાર થાય છે." : isHi ? "प्रयास की सराहना से बच्चे में सीखने का हौसला मजबूत होता है।" : "Validating effort builds lifelong academic resilience.",
      badgeTag: t("priority_low", "Low Priority · Steady"),
      badgeBg: "bg-teal-50",
      badgeBorder: "border-teal-200",
      badgeText: "text-[#006a62]",
      iconBg: "bg-teal-100",
      iconColor: "text-[#006a62]",
      headline: isGu ? "✨ પ્રયત્નો અને મહેનતની પ્રશંસા કરો" : isHi ? "✨ दैनिक प्रयासों की सराहना करें" : "✨ Celebrate Daily Effort",
      quickTakeaway: isGu ? "પ્રશંસા કરવાથી બાળકનો આત્મવિશ્વાસ બમણો થાય છે." : isHi ? "प्रयासों की सराहना सीखने के लिए आंतरिक प्रेरणा बनाती है।" : "Praising effort builds intrinsic learning motivation."
    });
  }

  return result;
}

export default function ParentDailyTipScreen() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("gu") ? "gu" : i18n.language?.startsWith("hi") ? "hi" : "en";
  const navigate = useNavigate();

  // Cached data helper
  const cachedTip = (() => {
    try {
      const ctx = getActiveUserContext();
      const raw = sessionStorage.getItem(`parent_daily_tip_cache_${ctx.childId || "default"}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  // User data state
  const [childName, setChildName] = useState(cachedTip?.childName || "Explorer");
  const [parentLevel, setParentLevel] = useState(cachedTip?.parentLevel || 1);
  const [childLevel, setChildLevel] = useState(cachedTip?.childLevel || 1);
  const [xp, setXp] = useState(cachedTip?.xp || 0);
  const [totalStars, setTotalStars] = useState(cachedTip?.totalStars || 0);
  const [streak, setStreak] = useState(cachedTip?.streak || 0);
  const [totalTests, setTotalTests] = useState(cachedTip?.totalTests || 0);
  const [accuracy, setAccuracy] = useState(cachedTip?.accuracy || 0);
  const [childCity, setChildCity] = useState(cachedTip?.childCity || "Egg Village");
  const [childShadowFights, setChildShadowFights] = useState<number>(cachedTip?.childShadowFights || 0);
  const [childNeuroPlayCount, setChildNeuroPlayCount] = useState<number>(cachedTip?.childNeuroPlayCount || 0);
  const [parentLessonsCount, setParentLessonsCount] = useState<number>(cachedTip?.parentLessonsCount || 0);
  const [parentChallengesCount, setParentChallengesCount] = useState<number>(cachedTip?.parentChallengesCount || 0);

  // Daily tip from backend (no fake static tip fallback)
  const [tip, setTip] = useState<Tip | null>(cachedTip?.tip || null);
  const [metrics, setMetrics] = useState<any>(cachedTip?.metrics || null);

  // Header notifications & child switcher modal
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);

  // Dynamic Priority Insights State
  const [subjectBreakdown, setSubjectBreakdown] = useState<SubjectAnalytics[]>(cachedTip?.subjectBreakdown || []);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(cachedTip?.overallAccuracy || 0);
  const [priorityTab, setPriorityTab] = useState<"urgent" | "moderate" | "low">("urgent");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);
  const [deepAiPlans, setDeepAiPlans] = useState<Record<string, any>>({});
  const [selectedInsightModal, setSelectedInsightModal] = useState<PriorityInsight | null>(null);
  const [showGrowthScoreModal, setShowGrowthScoreModal] = useState<boolean>(false);

  // Prevent background scrolling while diagnostic insight modal or growth score modal is active
  useLockBodyScroll(Boolean(selectedInsightModal || showGrowthScoreModal));

  // Handle Escape key to close open modals
  useEffect(() => {
    if (!selectedInsightModal && !showGrowthScoreModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedInsightModal(null);
        setShowGrowthScoreModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInsightModal, showGrowthScoreModal]);

  // ── Level XP thresholds ──────────────────────────────────────────────────
  function getXpForLevel(lvl: number): number {
    if (lvl <= 1) return 0;
    if (lvl === 2) return 100;
    if (lvl === 3) return 250;
    return Math.floor(250 * Math.pow(1.5, lvl - 3));
  }

  const roadmapXp = xp;
  const stageName =
    roadmapXp >= 5000 ? t("master_parent", "Master Parent") :
    roadmapXp >= 2500 ? t("mindful_parent", "Mindful Parent") :
    roadmapXp >= 1200 ? t("growth_coach", "Growth Coach") :
    roadmapXp >= 500  ? t("calm_parent", "Calm Parent")   : t("new_parent", "New Parent");

  const xpForCurrentLevel = getXpForLevel(parentLevel);
  const xpForNextLevel    = getXpForLevel(parentLevel + 1);
  const levelProgress = xpForNextLevel > xpForCurrentLevel
    ? Math.min(100, Math.round(((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100))
    : 100;

  // ── Growth Score Starting Rule & Badge Mapping ────────────────────────────
  // New users/parents start at 0% Growth Score.
  // Complete Score Range & Badge Mapping:
  // 0% - 30%: Tag = "New Parent" (Indigo Pill), Subtitle = "Begin your journey — complete lessons to grow! 🌱"
  // 31% - 50%: Tag = "Active Parent" (Indigo/Blue Pill), Subtitle = "Good progress! Every day counts. 💪"
  // 51% - 70%: Tag = "Mindful Parent" (Emerald / Teal), Subtitle = "You're soaring! Keep the momentum going! 🚀"
  // 71% - 85%: Tag = "Growth Coach" (Amber / Gold), Subtitle = "Phenomenal dedication! You are inspiring your child. ⭐"
  // 86% - 100%: Tag = "Master Parent" (Purple / Violet), Subtitle = "Outstanding! You're in the top 5% of dedicated parents! 🏆"

  const hasRealData = metrics?.hasRealData ?? (totalTests > 0 || accuracy > 0);
  const rawGrowthScore = (metrics?.growthScore !== undefined && metrics?.growthScore !== null)
    ? Number(metrics.growthScore)
    : 0;

  const growthScore = Math.min(100, Math.max(0, rawGrowthScore));

  const getGrowthBadgeInfo = (score: number) => {
    if (score <= 30) {
      return {
        tag: t("tag_new_parent", "New Parent"),
        subtitle: t("growth_subtitle_0_30", "Begin your journey — complete lessons to grow! 🌱"),
        pillClass: "bg-indigo-50 border-indigo-200 text-indigo-700",
        dialColorClass: "text-[#141779]",
        textColorClass: "text-[#141779]",
      };
    } else if (score <= 50) {
      return {
        tag: t("tag_active_parent", "Active Parent"),
        subtitle: t("growth_subtitle_31_50", "Good progress! Every day counts. 💪"),
        pillClass: "bg-blue-50 border-blue-200 text-blue-700",
        dialColorClass: "text-blue-600",
        textColorClass: "text-blue-700",
      };
    } else if (score <= 70) {
      return {
        tag: t("tag_mindful_parent", "Mindful Parent"),
        subtitle: t("growth_subtitle_51_70", "You're soaring! Keep the momentum going! 🚀"),
        pillClass: "bg-teal-50 border-teal-200 text-[#006a62]",
        dialColorClass: "text-[#006a62]",
        textColorClass: "text-[#006a62]",
      };
    } else if (score <= 85) {
      return {
        tag: t("tag_growth_coach", "Growth Coach"),
        subtitle: t("growth_subtitle_71_85", "Phenomenal dedication! You are inspiring your child. ⭐"),
        pillClass: "bg-amber-50 border-amber-200 text-amber-700",
        dialColorClass: "text-amber-500",
        textColorClass: "text-amber-600",
      };
    } else {
      return {
        tag: t("tag_master_parent", "Master Parent"),
        subtitle: t("growth_subtitle_86_100", "Outstanding! You're in the top 5% of dedicated parents! 🏆"),
        pillClass: "bg-purple-50 border-purple-200 text-purple-700",
        dialColorClass: "text-purple-600",
        textColorClass: "text-purple-700",
      };
    }
  };

  const badgeInfo = getGrowthBadgeInfo(growthScore);
  const displayGrowthTag = metrics?.growthTag || badgeInfo.tag;
  const displayGrowthSubtitle = metrics?.growthSubtitle || badgeInfo.subtitle;

  // ── Priority Insights Evaluation & Deep AI Handler ────────────────────────
  const priorityInsights = getPriorityInsights(
    subjectBreakdown,
    childName,
    overallAccuracy || accuracy,
    t,
    tip,
    currentLang
  );

  const activeInsights = priorityInsights[priorityTab] || [];

  const handleGenerateDeepPlan = async (insight: PriorityInsight) => {
    if (expandedPlanId === insight.id) {
      setExpandedPlanId(null);
      return;
    }
    setExpandedPlanId(insight.id);

    if (deepAiPlans[insight.id] || !insight.subject) {
      return;
    }

    setAiGeneratingId(insight.id);
    try {
      const ctx = getActiveUserContext();
      const res = await apiFetch("/api/parent/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: insight.subject,
          accuracy: insight.accuracy,
          childName: childName,
          childId: ctx.childId,
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDeepAiPlans(prev => ({ ...prev, [insight.id]: data.data }));
      }
    } catch (e) {
      console.warn("AI deep plan generation fallback:", e);
    } finally {
      setAiGeneratingId(null);
    }
  };

  // ── Child Milestones (Active Child Cumulative Progress) ───────────────────
  const childMilestones: Milestone[] = [
    {
      icon: <Trophy size={20} />,
      title: t("quizzes_completed_fmt", { count: totalTests, defaultValue: `Quizzes completed: ${totalTests}` }),
      subtitle: t("quizzes_completed_desc", { child: childName, count: totalTests, defaultValue: `${childName} has completed ${totalTests} total practice quizzes & chapter tests.` }),
      count: totalTests,
      iconBg: "bg-indigo-100",
      iconColor: "text-[#141779]",
    },
    {
      icon: <Zap size={20} />,
      title: t("shadow_fights_played_fmt", { count: childShadowFights, defaultValue: `Shadow Fights played: ${childShadowFights}` }),
      subtitle: t("shadow_fights_played_desc", { child: childName, count: childShadowFights, defaultValue: `${childName} has played ${childShadowFights} total 1v1 battle arena fights.` }),
      count: childShadowFights,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    {
      icon: <Brain size={20} />,
      title: t("neuroplay_finished_fmt", { count: childNeuroPlayCount, defaultValue: `Activities finished: ${childNeuroPlayCount}` }),
      subtitle: t("neuroplay_finished_desc", { child: childName, count: childNeuroPlayCount, defaultValue: `${childName} has finished ${childNeuroPlayCount} total cognitive & reading activities.` }),
      count: childNeuroPlayCount,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
  ];

  // ── Parent Milestones (Parent Cumulative Progress) ────────────────────────
  const parentMilestones: Milestone[] = [
    {
      icon: <BookOpen size={20} />,
      title: t("parent_lessons_completed_fmt", { count: parentLessonsCount, defaultValue: `Lessons completed: ${parentLessonsCount}` }),
      subtitle: t("parent_lessons_completed_desc", { count: parentLessonsCount, defaultValue: `Parent has completed ${parentLessonsCount} total academy learning lessons.` }),
      count: parentLessonsCount,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      icon: <Target size={20} />,
      title: t("growth_missions_completed_fmt", { count: parentChallengesCount, defaultValue: `Growth Missions completed: ${parentChallengesCount}` }),
      subtitle: t("growth_missions_completed_desc", { count: parentChallengesCount, defaultValue: `Parent has completed ${parentChallengesCount} total positive growth challenges.` }),
      count: parentChallengesCount,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
  ];

  // ── Fetch all data in Parallel ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchAll() {
      const nextCache: any = cachedTip ? { ...cachedTip } : {};
      const ctx = getActiveUserContext();
      const childParam = ctx.childId ? `childId=${encodeURIComponent(ctx.childId)}` : "";
      const classParam = ctx.classLevel ? `classLevel=${encodeURIComponent(ctx.classLevel)}` : "";
      const qParams = [childParam, classParam].filter(Boolean).join("&");

      const tipPromise = apiFetch(`/api/parent/daily-tip${qParams ? `?${qParams}` : ""}`)
        .then(res => res.json())
        .then(tJson => {
          if (tJson.success && tJson.data) {
            setTip(tJson.data);
            if (tJson.data.childName) {
              setChildName(tJson.data.childName);
            }
            if (tJson.data.metrics) {
              setMetrics(tJson.data.metrics);
              nextCache.metrics = tJson.data.metrics;
              if (tJson.data.metrics.accuracy !== null && tJson.data.metrics.accuracy !== undefined) {
                setAccuracy(tJson.data.metrics.accuracy);
                nextCache.accuracy = tJson.data.metrics.accuracy;
              }
              if (tJson.data.metrics.streak !== undefined) {
                setStreak(tJson.data.metrics.streak);
              }
              if (tJson.data.metrics.totalStars !== undefined) {
                setTotalStars(tJson.data.metrics.totalStars);
              }
              if (tJson.data.metrics.totalTests !== undefined) {
                setTotalTests(tJson.data.metrics.totalTests);
              }
            }
            nextCache.tip = tJson.data;
          }
        })
        .catch(() => {});

      const statsPromise = (async () => {
        try {
          const [uRes, gRes, rRes, cRes, libRes, chalRes] = await Promise.all([
            apiFetch("/api/users/me").catch(() => null),
            apiFetch("/api/practice/gamification").catch(() => null),
            apiFetch(`/api/parent/report${qParams ? `?${qParams}` : ""}`).catch(() => null),
            apiFetch("/api/practice/cities").catch(() => null),
            apiFetch("/api/parent/learning-library").catch(() => null),
            apiFetch("/api/parent/challenges").catch(() => null),
          ]);

          let activeNeuroSkills = 0;

          if (uRes) {
            const uJson = await uRes.json();
            if (uJson.success && uJson.data?.user) {
              const u = uJson.data.user;
              const childObj = (u.children && u.children[0]) || {};
              const activeChildObj = (u.children || []).find((c: any) => c.childId === (ctx.childId || u.activeChildId)) || childObj;

              const parentXpVal = u.parentXp !== undefined ? u.parentXp : 0;
              const parentLevelVal = u.parentLevel !== undefined ? u.parentLevel : 1;
              const effectiveStars = (u.parentStars || 0) + (u.totalStars || 0) + (u.stars || 0);
              const effectiveStreak = u.parentStreak !== undefined ? u.parentStreak : 0;

              setUserData(u);
              setChildName(activeChildObj.childName || u.childName || "Explorer");
              setParentLevel(parentLevelVal);
              setChildLevel(activeChildObj.level || 1);
              setXp(parentXpVal);
              setTotalStars(effectiveStars);
              setStreak(effectiveStreak);

              const neuroSkills = activeChildObj.neuroplayCompletedSkills || u.neuroplayCompletedSkills || [];
              activeNeuroSkills = Array.isArray(neuroSkills) ? neuroSkills.length : 0;
              setChildNeuroPlayCount(activeNeuroSkills);

              nextCache.childName = activeChildObj.childName || u.childName || "Explorer";
              nextCache.parentLevel = parentLevelVal;
              nextCache.childLevel = activeChildObj.level || 1;
              nextCache.xp = parentXpVal;
              nextCache.totalStars = effectiveStars;
              nextCache.streak = effectiveStreak;
              nextCache.childNeuroPlayCount = activeNeuroSkills;
            }
          }

          if (gRes) {
            const gJson = await gRes.json();
            if (gJson.success && gJson.data?.level) {
              setChildLevel(gJson.data.level);
              nextCache.childLevel = gJson.data.level;
            }
          }

          if (rRes) {
            const rJson = await rRes.json();
            if (rJson.success && rJson.data) {
              const tests = (rJson.data.totalChaptersCompleted !== undefined && rJson.data.totalChaptersCompleted > 0)
                ? rJson.data.totalChaptersCompleted
                : (rJson.data.totalTests !== undefined ? rJson.data.totalTests : 0);
              const acc = (rJson.data.overallAccuracy !== undefined && rJson.data.overallAccuracy !== null)
                ? rJson.data.overallAccuracy
                : (rJson.data.weeklyConfidenceScore || 0);
              setTotalTests(tests);
              if (acc > 0) {
                setAccuracy(acc);
                nextCache.accuracy = acc;
              }
              setOverallAccuracy(acc);
              nextCache.overallAccuracy = acc;
              nextCache.totalTests = tests;

              if (Array.isArray(rJson.data.subjectBreakdown) && rJson.data.subjectBreakdown.length > 0) {
                setSubjectBreakdown(rJson.data.subjectBreakdown);
                nextCache.subjectBreakdown = rJson.data.subjectBreakdown;
              }

              const shadowFights = rJson.data.bossAnalytics?.totalAttempts ?? rJson.data.bossesWon ?? 0;
              setChildShadowFights(shadowFights);
              nextCache.childShadowFights = shadowFights;

              const readingActs = rJson.data.readingAnalytics?.chaptersRead || 0;
              const totalActs = activeNeuroSkills + readingActs;
              setChildNeuroPlayCount(totalActs);
              nextCache.childNeuroPlayCount = totalActs;
            }
          }

          if (cRes) {
            const cJson = await cRes.json();
            if (cJson.success && Array.isArray(cJson.data) && cJson.data.length > 0) {
              const cityName = cJson.data[0]?.name || "Egg Village";
              setChildCity(cityName);
              nextCache.childCity = cityName;
            }
          }

          if (libRes) {
            const libJson = await libRes.json();
            if (libJson.success && libJson.data?.topics) {
              const topics: any[] = libJson.data.topics || [];
              const completedLessons = topics.filter((t: any) => t.status === "completed").length;
              setParentLessonsCount(completedLessons);
              nextCache.parentLessonsCount = completedLessons;
            }
          }

          if (chalRes) {
            const chalJson = await chalRes.json();
            if (chalJson.success && chalJson.data?.challenges) {
              const chals: any[] = chalJson.data.challenges || [];
              const completedMissions = chals.filter((c: any) => c.isCompleted || c.claimed || (c.completedDays && c.totalDays && c.completedDays >= c.totalDays)).length;
              setParentChallengesCount(completedMissions);
              nextCache.parentChallengesCount = completedMissions;
            }
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      })();

      const notifPromise = apiFetch("/api/notifications?role=parent")
        .then(res => res.json())
        .then(nJson => {
          if (nJson.success && Array.isArray(nJson.data)) {
            setUnreadCount(nJson.data.filter((n: any) => !n.isRead).length);
          }
        })
        .catch(() => {});

      await Promise.all([tipPromise, statsPromise, notifPromise]);
      const cacheKey = `parent_daily_tip_cache_${ctx.childId || "default"}`;
      sessionStorage.setItem(cacheKey, JSON.stringify(nextCache));
    }

    fetchAll();

    const handleUserDataUpdate = () => {
      const ctx = getActiveUserContext();
      sessionStorage.removeItem(`parent_daily_tip_cache_${ctx.childId || "default"}`);
      fetchAll();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-clip font-sans max-w-md mx-auto">

      {/* ── Top Header matching Parent Space Header exactly ── */}
      <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 shadow-[0_12px_40px_rgba(20,23,121,0.14)] w-full">
        {/* Left Side: Back button + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex flex-col min-w-0 justify-center">
            <h1 className="text-base sm:text-lg font-black text-[#141779] leading-tight truncate">
              {t("parent_dashboard", "Parent Dashboard")}
            </h1>
            <div className="flex items-center gap-1.5 min-w-0 mt-0.5">
              <span className="text-xs sm:text-[13px] text-slate-500 font-semibold truncate">
                {childName ? `${childName} • ` : ""}{t("parent_guidance", "Parent Guidance")}
              </span>
              <button
                type="button"
                onClick={() => setShowSwitcher(true)}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#141779] text-[10px] font-black border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
                title={t("switch_child_profile", "Switch Student Profile")}
              >
                <span>{t("switch", "Switch")}</span>
                <ChevronDown size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Settings & Notification Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Main Content Container with Clearance for Bottom Navigation ── */}
      <main className="flex-1 px-4 pt-3.5 pb-4 flex flex-col gap-3.5 relative z-10 max-w-md mx-auto w-full">

        {/* ── 1. Dynamic LLM Priority Insight Card (Unified High-End Container) ── */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_24px_rgba(20,23,121,0.05)] flex flex-col gap-4">
          
          {/* Card Header: AI Priority Insights Title & Subtitle */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#141779] via-[#103078] to-[#006a62] flex items-center justify-center text-white shadow-sm shrink-0">
                <Brain size={20} className="text-teal-200" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[#141779] font-black text-base sm:text-lg leading-tight tracking-tight">
                    {t("ai_priority_insights", "AI Priority Insights")}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-[#006a62] flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span>LLM Active</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-snug">
                  {t("ai_insights_eval_desc", {
                    child: childName || (currentLang === "gu" ? "બાળક" : currentLang === "hi" ? "बच्चा" : "Student"),
                    defaultValue: `${childName || "Student"}'s performance insights`
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Child Subject Analytics Bar Graph Strip (Streamlined & Generous Whitespace) */}
          {subjectBreakdown.length > 0 && (
            <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#141779] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#006a62]" />
                  {t("subject_accuracy_analytics", "Subject Accuracy Analytics")}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {childName}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                {subjectBreakdown.map((s, idx) => {
                  const sAcc = Math.round(s.accuracy ?? 0);
                  const isUrgent = sAcc < 50 || s.isRisk;
                  const isMod = sAcc >= 50 && sAcc < 75;
                  const barColor = isUrgent
                    ? "bg-rose-500"
                    : isMod
                    ? "bg-amber-500"
                    : "bg-[#006a62]";
                  const badgeColor = isUrgent
                    ? "text-rose-700 bg-rose-50 border-rose-200"
                    : isMod
                    ? "text-amber-800 bg-amber-50 border-amber-200"
                    : "text-[#006a62] bg-teal-50 border-teal-200";

                  return (
                    <div key={`sub-bar-${idx}`} className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-2xs flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 truncate font-black text-xs">{getLocalizedSubjectName(s.subject, currentLang)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${badgeColor}`}>
                          {sAcc}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-700`}
                          style={{ width: `${Math.max(6, Math.min(100, sAcc))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Segmented Priority Tabs: Urgent / Moderate / Low (Clean Subtle Border & Light Tint, Zero Solid Fills) */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {/* Urgent Tab */}
            <button
              type="button"
              onClick={() => setPriorityTab("urgent")}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                priorityTab === "urgent"
                  ? "bg-rose-50/90 border-rose-300 text-rose-700 shadow-2xs"
                  : "border-transparent text-slate-500 hover:text-rose-700 hover:bg-white/70"
              }`}
            >
              <span>🚨</span>
              <span>{t("priority_urgent", "Urgent")}</span>
              {priorityInsights.urgent.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black border ${
                  priorityTab === "urgent"
                    ? "bg-rose-100 text-rose-700 border-rose-200"
                    : "bg-slate-200/80 text-slate-600 border-transparent"
                }`}>
                  {priorityInsights.urgent.length}
                </span>
              )}
            </button>

            {/* Moderate Tab */}
            <button
              type="button"
              onClick={() => setPriorityTab("moderate")}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                priorityTab === "moderate"
                  ? "bg-amber-50/90 border-amber-300 text-amber-700 shadow-2xs"
                  : "border-transparent text-slate-500 hover:text-amber-700 hover:bg-white/70"
              }`}
            >
              <span>⚠️</span>
              <span>{t("priority_moderate", "Moderate")}</span>
              {priorityInsights.moderate.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black border ${
                  priorityTab === "moderate"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-slate-200/80 text-slate-600 border-transparent"
                }`}>
                  {priorityInsights.moderate.length}
                </span>
              )}
            </button>

            {/* Low Tab */}
            <button
              type="button"
              onClick={() => setPriorityTab("low")}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                priorityTab === "low"
                  ? "bg-teal-50/90 border-teal-300 text-[#006a62] shadow-2xs"
                  : "border-transparent text-slate-500 hover:text-[#006a62] hover:bg-white/70"
              }`}
            >
              <span>✨</span>
              <span>{t("priority_low", "Low")}</span>
              {priorityInsights.low.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black border ${
                  priorityTab === "low"
                    ? "bg-teal-100 text-[#006a62] border-teal-200"
                    : "bg-slate-200/80 text-slate-600 border-transparent"
                }`}>
                  {priorityInsights.low.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Priority Insights Display (Clean, Spacious, Zero Reading Fatigue) */}
          <div className="flex flex-col gap-3">
            {activeInsights.length === 0 ? (
              <div className="bg-slate-50/80 rounded-2xl p-5 text-center border border-slate-200/70">
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  {priorityTab === "urgent"
                    ? t("no_urgent_alerts", "No urgent issues detected! All foundational concepts are stable.")
                    : priorityTab === "moderate"
                    ? t("no_moderate_alerts", "No moderate interventions required right now.")
                    : t("no_low_alerts", "Keep practicing to generate more mastery benchmarks.")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activeInsights.map((insight) => {
                  const { headline } = getInsightHeadlineAndTakeaway(insight, currentLang);
                  const isExpanded = expandedPlanId === insight.id;
                  const isAiGenerating = aiGeneratingId === insight.id;
                  const dynamicPlan = deepAiPlans[insight.id];
                  const activePlanSteps = dynamicPlan?.planSteps || insight.planSteps;

                  const priorityBadgeConfig = insight.priority === "urgent"
                    ? {
                        bg: "bg-rose-50",
                        border: "border-rose-200",
                        text: "text-rose-700",
                        dot: "bg-rose-500",
                        icon: "🚨",
                        label: t("priority_urgent", "Urgent Priority")
                      }
                    : insight.priority === "moderate"
                    ? {
                        bg: "bg-amber-50",
                        border: "border-amber-200",
                        text: "text-amber-800",
                        dot: "bg-amber-500",
                        icon: "⚠️",
                        label: t("priority_moderate", "Moderate Focus")
                      }
                    : {
                        bg: "bg-teal-50",
                        border: "border-teal-200",
                        text: "text-[#006a62]",
                        dot: "bg-teal-500",
                        icon: "✨",
                        label: t("priority_low", "Steady Mastery")
                      };

                  return (
                    <div
                      key={insight.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(20,23,121,0.03)] hover:border-slate-300 transition-all p-4 sm:p-5 flex flex-col gap-3"
                    >
                      {/* Top Row: Priority Badge + Accuracy Pill */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${priorityBadgeConfig.bg} ${priorityBadgeConfig.border} ${priorityBadgeConfig.text}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${priorityBadgeConfig.dot} ${insight.priority === "urgent" ? "animate-pulse" : ""}`} />
                          <span>{priorityBadgeConfig.label}</span>
                        </div>

                        {insight.accuracy !== undefined && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-black text-slate-700">
                            <Target size={12} className="text-[#141779]" />
                            <span>{insight.accuracy}% {t("accuracy_short", "Acc.")}</span>
                          </div>
                        )}
                      </div>

                      {/* Main Insight Title & Observation (Generous Whitespace, No Ellipsis) */}
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-black text-[#141779] leading-snug">
                          {headline}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed pt-0.5">
                          {insight.observation}
                        </p>
                      </div>

                      {/* Action Step Callout (Elevated Box) */}
                      {insight.actionStep && (
                        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006a62] shrink-0 mt-0.5">
                            <Target size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] block">
                              {t("action_step", "Action Step")}
                            </span>
                            <p className="text-xs sm:text-[13px] text-slate-800 font-semibold leading-relaxed mt-0.5">
                              {insight.actionStep}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Interactive Diagnostic Plan Toggle Button */}
                      <div className="pt-0.5 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleGenerateDeepPlan(insight)}
                          className={`min-h-[44px] w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-between transition-all cursor-pointer select-none active:scale-[0.99] ${
                            isExpanded
                              ? "bg-[#141779] text-white shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 text-[#141779] border border-slate-200/80"
                          }`}
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-2">
                            {isAiGenerating ? (
                              <Sparkles size={14} className="animate-spin text-amber-300" />
                            ) : (
                              <Brain size={14} className={isExpanded ? "text-teal-200" : "text-[#006a62]"} />
                            )}
                            <span>
                              {isExpanded
                                ? t("hide_ai_plan", "Hide Diagnostic Plan")
                                : t("deep_ai_diagnostic_plan", "Deep AI Diagnostic Plan")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isExpanded ? "bg-white/20 text-white" : "bg-white border border-slate-200 text-slate-600"
                            }`}>
                              {activePlanSteps && activePlanSteps.length > 0 ? `${activePlanSteps.length} Phases` : "Phased Plan"}
                            </span>
                            <ChevronDown
                              size={15}
                              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </div>
                        </button>

                        {/* Smooth Transition Expandable Plan Container */}
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                          }`}
                        >
                          <div className="overflow-hidden space-y-2.5 pt-1">
                            {/* Why it matters */}
                            {insight.whyItMatters && (
                              <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/60 flex items-start gap-2.5">
                                <CheckCircle2 size={15} className="text-[#006a62] shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] block">
                                    {t("why_it_matters", "Why This Matters")}
                                  </span>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                                    {insight.whyItMatters}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Phased Roadmap Steps */}
                            {activePlanSteps && activePlanSteps.length > 0 && (
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between px-0.5">
                                  <span className="text-[11px] font-black uppercase tracking-wider text-[#141779] flex items-center gap-1.5">
                                    <Sparkles size={11} className="text-[#d97706]" />
                                    {insight.priority === "urgent"
                                      ? t("15_day_recovery_plan", "15-Day Remediation Roadmap")
                                      : t("milestone_practice_plan", "Milestone Action Plan")}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    {insight.subject || "Subject"}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {activePlanSteps.map((step: any, sIdx: number) => (
                                    <div
                                      key={`step-${sIdx}`}
                                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
                                    >
                                      <span className="font-black text-[#141779] shrink-0 text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs mt-0.5">
                                        {step.days || `Phase ${sIdx + 1}`}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <h5 className="text-xs sm:text-[13px] font-black text-slate-900 leading-tight">
                                          {step.title}
                                        </h5>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                                          {step.action}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Interactive Minimalist Details Modal (Tap-to-Expand) ── */}
        {selectedInsightModal && (() => {
          const dynamicPlan = deepAiPlans[selectedInsightModal.id];
          const activePlanSteps = dynamicPlan?.planSteps || selectedInsightModal.planSteps;

          return (
            <div
              className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 pb-24 sm:p-4 sm:pb-6 overscroll-contain touch-none select-none animate-in fade-in duration-150"
              style={{
                zIndex: 99999,
                paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
              }}
              onClick={() => setSelectedInsightModal(null)}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[75vh] sm:max-h-[82vh] overflow-hidden select-text animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 touch-auto my-auto"
                style={{
                  zIndex: 100000,
                  maxHeight: "min(78vh, calc(100dvh - 120px - env(safe-area-inset-bottom, 0px)))"
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {/* Mobile Touch Grab Bar */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

                {/* Modal Header */}
                <div className={`px-4 sm:px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
                  selectedInsightModal.priority === "urgent"
                    ? "bg-rose-50/70 border-rose-100"
                    : selectedInsightModal.priority === "moderate"
                    ? "bg-amber-50/70 border-amber-100"
                    : "bg-teal-50/70 border-teal-100"
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-2xs ${
                      selectedInsightModal.priority === "urgent"
                        ? "bg-rose-100 text-rose-700"
                        : selectedInsightModal.priority === "moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-teal-100 text-[#006a62]"
                    }`}>
                      {selectedInsightModal.priority === "urgent" ? "🚨" : selectedInsightModal.priority === "moderate" ? "⚠️" : "✨"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                          {getLocalizedSubjectName(selectedInsightModal.subject || selectedInsightModal.title, currentLang)}
                        </h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${selectedInsightModal.badgeBg} ${selectedInsightModal.badgeBorder} ${selectedInsightModal.badgeText}`}>
                          {selectedInsightModal.badgeTag}
                        </span>
                      </div>
                      {selectedInsightModal.accuracy !== undefined && (
                        <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                          {t("accuracy_label", "Accuracy")}: <span className="font-black text-slate-800">{selectedInsightModal.accuracy}%</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInsightModal(null)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                    aria-label={t("close", "Close")}
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div
                  className="flex-1 min-h-0 p-4 sm:p-5 pb-8 sm:pb-8 space-y-3.5 overflow-y-auto overscroll-contain scroll-smooth"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {/* 1. Diagnostic Breakdown */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Brain size={12} className="text-[#141779]" />
                      {t("diagnostic_breakdown", "Pedagogical Observation")}
                    </span>
                    <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
                      {selectedInsightModal.observation}
                    </p>
                  </div>

                  {/* 2. Action Step & Why It Matters */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-black text-indigo-700 shrink-0 flex items-center gap-1 mt-0.5">
                        <Target size={13} className="text-indigo-600" />
                        {t("action_step", "Action")}:
                      </span>
                      <span className="text-slate-800 font-semibold leading-relaxed">
                        {selectedInsightModal.actionStep}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs pt-2 border-t border-slate-100">
                      <span className="font-black text-[#006a62] shrink-0 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={13} className="text-[#006a62]" />
                        {t("why_it_matters", "Why")}:
                      </span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {selectedInsightModal.whyItMatters}
                      </span>
                    </div>
                  </div>

                  {/* 3. 3-Phase Day 1-15 Remediation Milestones */}
                  {activePlanSteps && activePlanSteps.length > 0 && (
                    <div className="space-y-2 pt-1 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#141779] flex items-center gap-1.5">
                        <Sparkles size={11} className="text-[#006a62]" />
                        {selectedInsightModal.accuracy !== undefined && selectedInsightModal.accuracy < 50
                          ? t("day_15_roadmap", "15-Day Remediation Milestones")
                          : t("day_7_sprint", "Targeted Mastery Milestones")}
                      </span>
                      <div className="space-y-2">
                        {activePlanSteps.map((step: any, sIdx: number) => (
                          <div
                            key={`modal-step-${sIdx}`}
                            className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
                          >
                            <span className="font-black text-[#141779] shrink-0 text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs mt-0.5">
                              {step.days || `Phase ${sIdx + 1}`}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-black text-slate-900 leading-tight">
                                {step.title}
                              </h5>
                              <p className="text-[11px] text-slate-600 font-medium leading-snug mt-0.5">
                                {step.action}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-3 sm:p-4 border-t border-slate-100 bg-white sm:bg-slate-50/60 flex items-center justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedInsightModal(null)}
                    className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-[#141779] hover:bg-[#1a1f9c] text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center"
                  >
                    {t("close", "Close")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Growth Score Breakdown Modal ── */}
        {showGrowthScoreModal && (() => {
          const breakdownPillars = [
            {
              icon: <Brain className="w-5 h-5 text-indigo-600" />,
              iconBg: "bg-indigo-50 border-indigo-200/80",
              title: currentLang === "gu"
                ? "બાળકની ક્વિઝ અને પ્રેક્ટિસ ચોકસાઈ"
                : currentLang === "hi"
                ? "बच्चे की क्विज़ और अभ्यास सटीकता"
                : "Child Practice & Quiz Accuracy",
              weight: "35%",
              badge: currentLang === "gu" ? "મુખ્ય પાયો" : currentLang === "hi" ? "मुख्य आधार" : "Core Pillar",
              badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
              description: currentLang === "gu"
                ? `${childName || "બાળક"} દ્વારા ક્વિઝ અને પ્રેક્ટિસ સત્રોમાં આપેલા સાચા જવાબો અને સુધરેલી ચોકસાઈ.`
                : currentLang === "hi"
                ? `${childName || "बच्चे"} द्वारा क्विज़ और अभ्यास में दिए गए सही उत्तर एवं सटीकता में सुधार।`
                : `Accuracy and correct answers achieved by ${childName || "your child"} during chapter quizzes and practice drills.`
            },
            {
              icon: <BookOpen className="w-5 h-5 text-teal-600" />,
              iconBg: "bg-teal-50 border-teal-200/80",
              title: currentLang === "gu"
                ? "પેરેન્ટ એકેડેમી પાઠ અને માર્ગદર્શન"
                : currentLang === "hi"
                ? "पैरेंट एकेडमी पाठ और मार्गदर्शन"
                : "Parent Academy Lessons",
              weight: "25%",
              badge: currentLang === "gu" ? "પેરેન્ટ ભૂમિકા" : currentLang === "hi" ? "अभिभावक भूमिका" : "Parent Role",
              badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
              description: currentLang === "gu"
                ? "તમે પૂર્ણ કરેલા માર્ગદર્શન મોડ્યુલ્સ અને બાળકની મુશ્કેલીઓ ઉકેલવા લીધેલા પગલાં."
                : currentLang === "hi"
                ? "आपके द्वारा पूरे किए गए पैरेंटिंग पाठ और बच्चे की समस्याओं को हल करने के उपाय।"
                : "Parenting micro-lessons completed and guidance actions taken to support your child."
            },
            {
              icon: <Zap className="w-5 h-5 text-amber-600" />,
              iconBg: "bg-amber-50 border-amber-200/80",
              title: currentLang === "gu"
                ? "દૈનિક સાતત્ય અને સ્ટ્રીક"
                : currentLang === "hi"
                ? "दैनिक निरंतरता और स्ट्रीक"
                : "Daily Practice Consistency",
              weight: "20%",
              badge: currentLang === "gu" ? "આદત નિર્માણ" : currentLang === "hi" ? "आदत निर्माण" : "Habit Building",
              badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
              description: currentLang === "gu"
                ? "દરરોજ અભ્યાસ કરવાની ટેવ અને એપ પર નિયમિત સક્રિયતા."
                : currentLang === "hi"
                ? "प्रतिदिन पढ़ाई करने की नियमित आदत और ऐप पर दैनिक उपस्थिति।"
                : "Building a regular, unbroken study habit through daily practice and engagement."
            },
            {
              icon: <Target className="w-5 h-5 text-purple-600" />,
              iconBg: "bg-purple-50 border-purple-200/80",
              title: currentLang === "gu"
                ? "સિદ્ધિઓ અને એક્ટિવિટી સ્તર"
                : currentLang === "hi"
                ? "उपलब्धियां और एक्टिविटी स्तर"
                : "Parent XP & Milestones",
              weight: "20%",
              badge: currentLang === "gu" ? "સિદ્ધિઓ" : currentLang === "hi" ? "उपलब्धियां" : "Achievements",
              badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
              description: currentLang === "gu"
                ? "દૈનિક પડકારો અને સીમાચિહ્નો પાર કરીને મેળવેલ XP અને પ્રોત્સાહક બેજ."
                : currentLang === "hi"
                ? "दैनिक चुनौतियों और माइलस्टोन को पूरा करके अर्जित XP और स्तर।"
                : "Experience points earned and family milestones unlocked across learning activities."
            }
          ];

          return (
            <div
              className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 pb-24 sm:p-4 sm:pb-6 animate-in fade-in duration-200 overflow-y-auto overscroll-contain select-none"
              style={{
                zIndex: 99999,
                paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
              }}
              onClick={() => setShowGrowthScoreModal(false)}
            >
              <div
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[75vh] sm:max-h-[82vh] my-auto animate-in zoom-in-95 duration-200 select-text"
                style={{
                  zIndex: 100000,
                  maxHeight: "min(78vh, calc(100dvh - 120px - env(safe-area-inset-bottom, 0px)))"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Accent Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#141779] via-[#006a62] to-amber-500" />

                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-[#141779]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#141779] leading-tight">
                        {currentLang === "gu"
                          ? "ગ્રોથ સ્કોર કેવી રીતે ગણાય છે?"
                          : currentLang === "hi"
                          ? "ग्रोथ स्कोर कैसे काम करता है?"
                          : "How Growth Score Works"}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">
                        {currentLang === "gu"
                          ? "તમારા પરિવારની શીખવાની ગતિનું મૂલ્યાંકન"
                          : currentLang === "hi"
                          ? "पारिवारिक सीखने की निरंतर प्रगति का माप"
                          : "A holistic measure of your family's learning momentum"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGrowthScoreModal(false)}
                    aria-label={t("close", "Close")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                  {/* Current Score Summary Card */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/50 border border-indigo-100 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                        <span className={`text-base sm:text-lg font-black ${badgeInfo.textColorClass}`}>
                          {growthScore}%
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                            {t("growth_score", "Growth Score")}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-black ${badgeInfo.pillClass}`}>
                            {displayGrowthTag}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {displayGrowthSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pillars Introduction */}
                  <div className="px-0.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                      {currentLang === "gu"
                        ? "4 મુખ્ય પરિબળો પર આધારિત:"
                        : currentLang === "hi"
                        ? "4 मुख्य स्तंभों पर आधारित:"
                        : "Calculated from 4 core pillars:"}
                    </h4>
                  </div>

                  {/* 4 Pillars List */}
                  <div className="space-y-2.5">
                    {breakdownPillars.map((pillar, idx) => (
                      <div
                        key={`growth-pillar-${idx}`}
                        className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-start gap-3 shadow-2xs"
                      >
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${pillar.iconBg}`}>
                          {pillar.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h5 className="text-xs sm:text-[13px] font-black text-[#141779] leading-snug flex-1 min-w-0">
                              {pillar.title}
                            </h5>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 whitespace-nowrap self-start mt-0.5 ${pillar.badgeColor}`}>
                              {pillar.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Friendly Pro-Tip */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                      {currentLang === "gu"
                        ? "મહત્વપૂર્ણ ટિપ: દરરોજ સંપૂર્ણ સ્કોર લાવવો જરૂરી નથી! માત્ર 10 મિનિટ નિયમિત પ્રેક્ટિસ અને 1 પેરેન્ટ ગાઈડ વાંચવાથી તમારો ગ્રોથ સ્કોર સતત ઊંચો રહે છે."
                        : currentLang === "hi"
                        ? "सरल टिप: हर दिन पूर्ण स्कोर होना आवश्यक नहीं है! बस 10 मिनट का नियमित अभ्यास और 1 पैरेंट टिप आपके ग्रोथ स्कोर को लगातार बढ़ाए रखती है।"
                        : "Pro-Tip: You don't need perfection every day! Just 10 minutes of daily child practice and reading 1 quick parent guide keeps your score climbing."}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white sm:bg-slate-50/60 flex items-center justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowGrowthScoreModal(false)}
                    className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-[#141779] hover:bg-[#1a1f9c] text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center"
                  >
                    {t("got_it", "Got it!")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── 2. Growth Score Section ── */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex items-center gap-3.5 sm:gap-4 overflow-hidden">
          {/* Dial circle */}
          <button
            type="button"
            onClick={() => setShowGrowthScoreModal(true)}
            title={t("view_growth_breakdown", "Tap to view breakdown")}
            aria-label={t("how_growth_score_works", "How Growth Score works")}
            className="relative w-20 h-20 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141779] rounded-full"
            style={{ width: "76px", height: "76px", minWidth: "76px", minHeight: "76px", maxWidth: "76px", maxHeight: "76px" }}
          >
            <svg className="w-full h-full -rotate-90 transition-transform group-hover:scale-105 duration-300" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${badgeInfo.dialColorClass} transition-all duration-1000 ease-out`}
                strokeDasharray={`${Math.min(100, Math.max(0, growthScore))}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className={`${badgeInfo.textColorClass} font-black text-lg sm:text-xl leading-none`}>
                {growthScore}%
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
                {currentLang === "gu" ? "સ્કોર" : currentLang === "hi" ? "स्कोर" : "Score"}
              </span>
            </div>
          </button>

          {/* Details body */}
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-[#141779] uppercase tracking-wider shrink-0">
                {t("growth_score", "Growth Score")}
              </span>
              {/* Badge with Info icon on the right side - bundled tightly so it never wraps to a separate line */}
              <button
                type="button"
                onClick={() => setShowGrowthScoreModal(true)}
                title={t("how_growth_score_works", "How Growth Score works")}
                aria-label={t("how_growth_score_works", "How Growth Score works")}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] sm:text-xs font-black cursor-pointer transition-all hover:shadow-2xs active:scale-[0.98] shrink-0 ${badgeInfo.pillClass}`}
              >
                <span>{displayGrowthTag}</span>
                <Info className="w-3 h-3 opacity-75" />
              </button>
            </div>

            <p className="text-slate-600 font-medium text-xs sm:text-[13px] leading-snug">
              {displayGrowthSubtitle}
            </p>
          </div>
        </section>

        {/* ── 4. Family Milestones Section ── */}
        <section className="w-full flex flex-col gap-3 pb-2">
          {/* Main Section Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[#141779] font-black text-sm sm:text-base tracking-tight">
              {t("family_milestones", "Family Milestones")}
            </h2>
            <span className="text-xs font-black text-[#006a62] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              {t("all_time_totals", "All-Time Totals")}
            </span>
          </div>

          {/* Child Milestones (First part) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-1 pt-0.5">
              <span className="text-sm">🧒</span>
              <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-700">
                {t("child_milestones_title", { child: childName, defaultValue: `${childName}'s Milestones` })}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {childMilestones.map((m, i) => (
                <div
                  key={`child-milestone-${i}`}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all shadow-2xs"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 ${m.iconBg} ${m.iconColor} rounded-xl flex items-center justify-center shrink-0 shadow-2xs`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-[#141779] font-black text-xs sm:text-sm truncate">{m.title}</h5>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-[#141779] border border-slate-200 text-xs font-black shrink-0 shadow-2xs">
                        {m.count}
                      </span>
                    </div>
                    <p className="text-slate-500 font-semibold text-xs sm:text-[13px] mt-0.5 leading-snug">{m.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parent Milestones (Following part) */}
          <div className="flex flex-col gap-2 pt-1.5">
            <div className="flex items-center gap-1.5 px-1 pt-0.5">
              <span className="text-sm">👨‍👩‍👧</span>
              <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-700">
                {t("parent_growth_milestones", "Parent Growth Milestones")}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {parentMilestones.map((m, i) => (
                <div
                  key={`parent-milestone-${i}`}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all shadow-2xs"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 ${m.iconBg} ${m.iconColor} rounded-xl flex items-center justify-center shrink-0 shadow-2xs`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-[#141779] font-black text-xs sm:text-sm truncate">{m.title}</h5>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-[#141779] border border-slate-200 text-xs font-black shrink-0 shadow-2xs">
                        {m.count}
                      </span>
                    </div>
                    <p className="text-slate-500 font-semibold text-xs sm:text-[13px] mt-0.5 leading-snug">{m.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Child Switcher Modal */}
      <ChildSwitcherModal
        isOpen={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        user={userData}
        onUserUpdated={(u) => setUserData(u)}
        onSwitched={() => {
          Object.keys(sessionStorage).forEach((k) => {
            if (k.startsWith("parent_daily_tip_cache")) {
              sessionStorage.removeItem(k);
            }
          });
          window.location.reload();
        }}
      />
    </div>
  );
}

