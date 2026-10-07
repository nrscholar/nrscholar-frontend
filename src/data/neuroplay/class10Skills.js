// ============================================================================
// CLASS 10 NEUROPLAY MICRO-LESSONS (CONSOLIDATED)
// Consolidated Single-Module Architecture for Class 10
// ============================================================================

export const class10Skills = [
  {
    "id": "skill_c10_108",
    "methodNumber": 108,
    "classLevel": 10,
    "category": {
      "en": "Logic",
      "hi": "तर्कशास्त्र",
      "gu": "તર્કશાસ્ત્ર"
    },
    "title": {
      "en": "Proof by Contradiction (Reductio ad Absurdum)",
      "hi": "विरोधाभास द्वारा प्रमाण (रिडक्टियो एड एब्सर्डम)",
      "gu": "વિરોધાભાસ દ્વારા સાબિતી (રિડક્ટિઓ એડ એબ્સર્ડમ)"
    },
    "description": {
      "en": "Assume the exact opposite of what you want to prove, follow strict logical deductions until hitting an impossible contradiction, proving the original proposition must be true.",
      "hi": "जिसे सिद्ध करना है उसके ठीक विपरीत को सत्य मानें, तार्किक नियमों का पालन करते हुए एक असंभव विरोधाभास तक पहुंचें, जिससे साबित हो जाए कि मूल कथन ही सत्य है।",
      "gu": "જે સાબિત કરવું છે તેનાથી તદ્દન વિપરીત વિધાન સાચું ધારો, તાર્કિક પગલાંઓ અનુસરી અસંભવ વિરોધાભાસ સુધી પહોંચો, જેથી સાબિત થાય કે મૂળ વિધાન જ સાચું છે."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "contradiction_lock",
        "title": {
          "en": "Trying to Prove an Infinite Property by Calculating Endless Decimals?",
          "hi": "अनंत दशमलव की गणना करके किसी गणितीय गुण को सिद्ध करने की असफल कोशिश कर रहे हैं?",
          "gu": "અનંત દશાંશની ગણતરી કરીને ગાણિતિક નિયમ સાબિત કરવાનો અસફળ પ્રયાસ કરો છો?"
        },
        "pain_quotes": [
          {
            "en": "In Class 10 Math, when asked to 'Prove that √2 is irrational', I tried writing out 1.4142135... to show it never terminates, which scored 0 marks!",
            "hi": "कक्षा 10 में जब 'सिद्ध कीजिए कि √2 एक अपरिमेय संख्या है' पूछा गया, तो मैंने 1.4142135... लिखकर दिखाया कि यह खत्म नहीं होता, जिस पर 0 अंक मिले!",
            "gu": "ધોરણ ૧૦ માં 'સાબિત કરો કે √2 અસંમેય સંખ્યા છે' પૂછાયું ત્યારે મેં 1.4142135... લખીને બતાવ્યું કે તે અનંત છે, જેના પર ૦ માર્ક્સ મળ્યા!"
          },
          {
            "en": "You cannot prove a number is irrational by checking infinite decimal digits one by one; you need a formal logical lock!",
            "hi": "आप एक-एक करके अनंत दशमलव अंकों की जांच करके किसी संख्या को अपरिमेय सिद्ध नहीं कर सकते; इसके लिए औपचारिक तार्किक ताले की आवश्यकता है!",
            "gu": "તમે એક પછી એક અનંત દશાંશ અંકો ચકાસીને અસંમેય સાબિત ન કરી શકો; આ માટે ઔપચારિક તાર્કિક સાબિતી જોઈએ!"
          }
        ],
        "body": {
          "en": "Used by Euclid over 2,300 years ago, **Proof by Contradiction** (*Reductio ad Absurdum*) is mathematics' most lethal weapon. If you want to prove Statement $P$ is true, you assume its opposite ($\\neg P$) is true. You then deduce step-by-step until you hit a glaring impossibility (like $1 = 0$ or an odd number being even). Since logic cannot break, your starting assumption must be false—guaranteeing $P$ is undeniably true!",
          "hi": "2300 वर्ष पूर्व यूक्लिड द्वारा प्रयुक्त **विरोधाभास द्वारा प्रमाण (Proof by Contradiction)** गणित का सबसे अचूक अस्त्र है। यदि आपको कथन $P$ सिद्ध करना है, तो आप उसके उल्टे ($\\neg P$) को सत्य मान लेते हैं। फिर तार्किक गणना करते हुए एक असंभव स्थिति (जैसे $1 = 0$ या सम संख्या का विषम होना) पर पहुंचते हैं। चूंकि गणित में विरोधाभास संभव नहीं है, अतः आपकी धारणा गलत थी और $P$ अनिवार्य रूप से सत्य सिद्ध होता है!",
          "gu": "૨૩૦૦ વર્ષ પહેલાં યુક્લિડે વાપરેલી **વિરોધાભાસ દ્વારા સાબિતી** ગણિતનું સૌથી અચૂક હથિયાર છે. જો તમારે વિધાન $P$ સાબિત કરવું હોય, તો તેનાથી ઊંધું ($\\neg P$) સાચું માની લો. પછી તાર્કિક ગણતરી કરતાં અસંભવ પરિણામ (જેમ કે બેકી સંખ્યા એકી બનવી) પર પહોંચો છો. ગણિતમાં વિરોધાભાસ અશક્ય હોવાથી, તમારી ધારણા ખોટી હતી અને $P$ સો ટકા સાચું સાબિત થાય છે!"
        },
        "key_takeaway": {
          "en": "Contradiction Rule: Assume the opposite $\\rightarrow$ Deduce logically until reality breaks $\\rightarrow$ Original claim is crowned true!",
          "hi": "विरोधाभास नियम: उल्टा मान लें $\\rightarrow$ तब तक तार्किक गणना करें जब तक नियम न टूट जाए $\\rightarrow$ मूल कथन सत्य साबित होता है!",
          "gu": "વિરોધાભાસ નિયમ: ઊંધું ધારી લો $\\rightarrow$ ગાણિતિક નિયમ તૂટે ત્યાં સુધી તર્ક ચલાવો $\\rightarrow$ મૂળ વિધાન સાચું સાબિત થાય છે!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "contradiction_lock",
        "title": {
          "en": "Meet Siddharth",
          "hi": "सिद्धार्थ से मिलें",
          "gu": "સિદ્ધાર્થને મળો"
        },
        "story": {
          "en": "Siddharth struggled with the standard 4-mark Class 10 Real Numbers question: 'Prove that $\\sqrt{3}$ is irrational'. He tried drawing number lines and writing decimal approximations, which teachers repeatedly rejected as non-rigorous.",
          "hi": "सिद्धार्थ कक्षा 10 के 4-अंक वाले सवाल से जूझ रहा था: 'सिद्ध कीजिए कि $\\sqrt{3}$ एक अपरिमेय संख्या है'। उसने संख्या रेखा और दशमलव मान लिखने की कोशिश की, जिसे शिक्षकों ने अमान्य कर दिया।",
          "gu": "સિદ્ધાર્થ ધોરણ ૧૦ ના ૪-ગુણના પ્રશ્ન સાથે સંઘર્ષ કરતો હતો: 'સાબિત કરો કે $\\sqrt{3}$ અસંમેય છે'. તેણે સંખ્યા રેખા અને દશાંશ અંદાજો લખ્યા, જેને શિક્ષકોએ અમાન્ય ગણાવ્યા."
        },
        "insight_box": {
          "en": "Contradiction Proof: Siddharth assumed $\\sqrt{3} = a/b$ where $\\gcd(a,b)=1$ (co-prime). Squaring gave $3b^2 = a^2 \\implies a$ is a multiple of 3 ($a=3k$). Substituting gave $3b^2 = 9k^2 \\implies b^2 = 3k^2 \\implies b$ is also a multiple of 3! This contradicted $\\gcd(a,b)=1$. Flawless 100% marks!",
          "hi": "विरोधाभास प्रमाण: सिद्धार्थ ने माना $\\sqrt{3} = a/b$ जहाँ $a, b$ सह-अभाज्य हैं। वर्ग करने पर $3b^2 = a^2 \\implies a$, 3 का गुणज है ($a=3k$)। मान रखने पर $b$ भी 3 का गुणज निकला! यह सह-अभाज्य होने का खंडन करता है। पूरे 100% अंक मिले!",
          "gu": "વિરોધાભાસ સાબિતી: સિદ્ધાર્થે ધાર્યું કે $\\sqrt{3} = a/b$ જ્યાં $a, b$ પરસ્પર અવિભાજ્ય છે. વર્ગ કરતાં $3b^2 = a^2 \\implies a$, 3 નો ગુણક બન્યો. કિંમત મૂકતાં $b$ પણ 3 નો ગુણક નીકળ્યો! આ અવિભાજ્ય હોવાનો વિરોધાભાસ થયો. પૂરા ગુણ મળ્યા!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "contradiction_lock",
        "question": {
          "en": "In mathematical logic, what makes a Proof by Contradiction completely unassailable?",
          "hi": "गणितीय तर्कशास्त्र में, विरोधाभास द्वारा प्रमाण को पूरी तरह से अकाट्य क्या बनाता है?",
          "gu": "ગાણિતિક તર્કશાસ્ત્રમાં, વિરોધાભાસ દ્વારા સાબિતીને સંપૂર્ણપણે અકાટ્ય શું બનાવે છે?"
        },
        "option_a": {
          "en": "The Law of Excluded Middle: A mathematical statement must be either TRUE or FALSE; if assuming FALSE leads to an impossibility, it MUST be TRUE.",
          "hi": "तृतीय वर्जित नियम (Law of Excluded Middle): कथन या तो सत्य होगा या असत्य; यदि असत्य मानने से असंभव परिणाम मिलता है, तो उसे सत्य होना ही होगा।",
          "gu": "તૃતીય વર્જિત નિયમ: વિધાન કાં તો સત્ય હોય કાં તો અસત્ય; જો અસત્ય ધારવાથી અસંભવ વિરોધાભાસ સર્જાય, તો તેને સત્ય હોવું જ પડે."
        },
        "option_b": {
          "en": "It uses very long English sentences that confuse anyone trying to argue.",
          "hi": "यह बहुत लंबे वाक्यों का उपयोग करता है जिससे कोई बहस न कर सके।",
          "gu": "તે ખૂબ લાંબા વાક્યો વાપરે છે જેથી કોઈ દલીલ ન કરી શકે."
        },
        "feedback": {
          "en": "Exact! The Law of the Excluded Middle guarantees there is no third option. Destroying the negation guarantees the truth of the original proposition with 100% certainty!",
          "hi": "एकदम सही! यह नियम सुनिश्चित करता है कि कोई तीसरा विकल्प नहीं है। विपरीत कथन को गलत साबित करते ही मूल कथन स्वतः 100% सत्य सिद्ध हो जाता है!",
          "gu": "સાચો જવાબ! આ નિયમ ખાતરી આપે છે કે ત્રીજો કોઈ વિકલ્પ નથી. વિરોધી વિધાન ખોટું સાબિત થતાં જ મૂળ વિધાન આપોઆપ ૧૦૦% સાચું સાબિત થાય છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "contradiction_lock",
        "question": {
          "en": "To prove by contradiction that 'There are infinitely many prime numbers', what starting assumption must you make?",
          "hi": "विरोधाभास द्वारा यह सिद्ध करने के लिए कि 'अभाज्य संख्याएँ अनंत हैं', आपको शुरुआत में क्या धारणा माननी होगी?",
          "gu": "વિરોધાભાસ દ્વારા 'અવિભાજ્ય સંખ્યાઓ અનંત છે' સાબિત કરવા માટે શરૂઆતમાં કઈ ધારણા બાંધવી પડે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Assume there are only FINITELY many primes: {p₁, p₂, ..., pₙ}.",
              "hi": "मान लें कि अभाज्य संख्याएँ केवल सीमित (Finite) हैं: {p₁, p₂, ..., pₙ}।",
              "gu": "ધારી લો કે અવિભાજ્ય સંખ્યાઓ માત્ર સીમિત (Finite) છે: {p₁, p₂, ..., pₙ}."
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Assume that all odd numbers are prime.",
              "hi": "मान लें कि सभी विषम संख्याएँ अभाज्य होती हैं।",
              "gu": "ધારી લો કે બધી એકી સંખ્યાઓ અવિભાજ્ય છે."
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Assume that 2 is the only prime number in the universe.",
              "hi": "मान लें कि 2 ही ब्रह्मांड की एकमात्र अभाज्य संख्या है।",
              "gu": "ધારી લો કે 2 જ બ્રહ્માંડની એકમાત્ર અવિભાજ્ય સંખ્યા છે."
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Assume that no prime numbers exist at all.",
              "hi": "मान लें कि कोई भी अभाज्य संख्या मौजूद नहीं है।",
              "gu": "ધારી લો કે કોઈ અવિભાજ્ય સંખ્યા અસ્તિત્વમાં જ નથી."
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Flawless! Euclid assumed a finite list of primes, constructed $N = (p_1 p_2 \\dots p_n) + 1$, and proved $N$ must either be a new prime or divisible by a prime not in the list—destroying the finite assumption!",
          "hi": "उत्कृष्ट! यूक्लिड ने सीमित सूची मानी, $N = (p_1 p_2 \\dots p_n) + 1$ बनाया, और साबित किया कि $N$ या तो एक नई अभाज्य संख्या है या सूची से बाहर की किसी संख्या से विभाज्य है—जिससे सीमित होने की धारणा ध्वस्त हो गई!",
          "gu": "શ્રેષ્ઠ! યુક્લિડે સીમિત યાદી ધારી, $N = (p_1 p_2 \\dots p_n) + 1$ બનાવ્યું, અને સાબિત કર્યું કે $N$ કાં તો નવી અવિભાજ્ય સંખ્યા છે અથવા યાદી બહારની સંખ્યા વડે વિભાજ્ય છે—જેથી સીમિત હોવાની ધારણા તૂટી ગઈ!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "contradiction_lock",
        "title": {
          "en": "Contradiction Proof Weapon",
          "hi": "विरोधाभास प्रमाण अस्त्र",
          "gu": "વિરોધાભાસ સાબિતી અસ્ત્ર"
        },
        "body": {
          "en": "Assume the negation is true; deduce algebraically until an impossible paradox emerges, conclusively crowning the original claim.",
          "hi": "विपरीत कथन को सत्य मानें; तब तक बीजगणितीय गणना करें जब तक एक असंभव विरोधाभास सामने न आ जाए, जिससे मूल दावा स्वतः सिद्ध हो जाए।",
          "gu": "વિરોધી વિધાનને સાચું ધારો; જ્યાં સુધી અસંભવ વિરોધાભાસ ન સર્જાય ત્યાં સુધી ગણતરી કરો, જેથી મૂળ વિધાન સંપૂર્ણ સાબિત થાય."
        },
        "tags": [
          {
            "en": "Reductio ad Absurdum",
            "hi": "रिडक्टियो एड एब्सर्डम",
            "gu": "રિડક્ટિઓ એડ એબ્સર્ડમ"
          },
          {
            "en": "Assume Negation",
            "hi": "नकार को सत्य मानें",
            "gu": "વિરોધી સત્ય ધારો"
          },
          {
            "en": "Hit Paradox",
            "hi": "विरोधाभास खोजें",
            "gu": "વિરોધાભાસ શોધો"
          },
          {
            "en": "Excluded Middle",
            "hi": "तृतीय वर्जित नियम",
            "gu": "તૃતીય વર્જિત નિયમ"
          },
          {
            "en": "Irrational Proofs",
            "hi": "अपरिमेय प्रमाण",
            "gu": "અસંમેય સાબિતી"
          },
          {
            "en": "Euclid Rigor",
            "hi": "यूक्लिडियन सटीकता",
            "gu": "યુક્લિડિયન ચોકસાઈ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "contradiction_lock",
        "title": {
          "en": "4 Steps to Execute a Proof by Contradiction",
          "hi": "विरोधाभास द्वारा प्रमाण के 4 चरण",
          "gu": "વિરોધાભાસ સાબિતી કરવાના 4 પગલાં"
        },
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next.",
        "steps": [
          {
            "step": 1,
            "correct_order": 1,
            "text": {
              "en": "Formulate the exact negation of the proposition you want to prove (e.g., 'Assume √5 is rational: a/b').",
              "hi": "जिसे सिद्ध करना है उसके ठीक विपरीत कथन को सूत्रबद्ध करें (जैसे 'मानें √5 परिमेय संख्या a/b है')।",
              "gu": "જે સાબિત કરવું છે તેનાથી વિરોધી વિધાન લખો (દા.ત. 'ધારો કે √5 સંમેય સંખ્યા a/b છે')."
            }
          },
          {
            "step": 2,
            "correct_order": 2,
            "text": {
              "en": "State all foundational axioms of your assumption (e.g., a and b are integers with gcd(a,b) = 1).",
              "hi": "अपनी धारणा के सभी बुनियादी नियमों को लिखें (जैसे a और b पूर्णांक हैं और सह-अभाज्य हैं)।",
              "gu": "તમારી ધારણાના પાયાના નિયમો સ્પષ્ટ કરો (જેમ કે a અને b પૂર્ણાંકો છે અને પરસ્પર અવિભાજ્ય છે)."
            }
          },
          {
            "step": 3,
            "correct_order": 3,
            "text": {
              "en": "Apply rigorous algebraic or logical transformations step-by-step to expose a direct impossibility.",
              "hi": "प्रत्यक्ष असंभवता को उजागर करने के लिए चरण-दर-चरण बीजगणितीय या तार्किक नियमों को लागू करें।",
              "gu": "સ્પષ્ટ અસંભવતા બહાર લાવવા માટે ક્રમશઃ બીજગણિતીય કે તાર્કિક નિયમો લાગુ કરો."
            }
          },
          {
            "step": 4,
            "correct_order": 4,
            "text": {
              "en": "Conclude formally: Since the assumption leads to a contradiction, the original proposition is proven true.",
              "hi": "औपचारिक निष्कर्ष लिखें: चूंकि धारणा विरोधाभास पैदा करती है, अतः मूल कथन सत्य सिद्ध हुआ।",
              "gu": "ઔપચારિક તારણ લખો: ધારણા વિરોધાભાસ સર્જતી હોવાથી, મૂળ વિધાન સાચું સાબિત થાય છે."
            }
          }
        ]
      },
      {
        "type": "daily_mission",
        "icon": "contradiction_lock",
        "title": {
          "en": "Real Numbers Contradiction Master",
          "hi": "वास्तविक संख्याएं विरोधाभास मास्टर",
          "gu": "વાસ્તવિક સંખ્યાઓ વિરોધાભાસ માસ્ટર"
        },
        "mission_text": {
          "en": "Write out the complete 6-step Proof by Contradiction for 'Prove that √7 is irrational' in your math notebook without looking at any reference solution!",
          "hi": "बिना कोई गाइड देखे अपनी नोटबुक में 'सिद्ध कीजिए कि √7 एक अपरिमेय संख्या है' का पूरा 6-चरणीय विरोधाभास प्रमाण लिखें!",
          "gu": "કોઈપણ સંદર્ભ જોયા વિના તમારી નોટબુકમાં 'સાબિત કરો કે √7 અસંમેય સંખ્યા છે' ની પૂરી ૬-પગલાંની વિરોધાભાસ સાબિતી લખો!"
        },
        "commitment_button_text": {
          "en": "I will use Proof by Contradiction to master mathematical rigor!",
          "hi": "मैं गणितीय सटीकता में महारत हासिल करने के लिए विरोधाभास प्रमाण का उपयोग करूँगा!",
          "gu": "હું ગાણિતિક ચોકસાઈ માટે વિરોધાભાસ દ્વારા સાબિતી પદ્ધતિ વાપરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c10_189",
    "methodNumber": 189,
    "classLevel": 10,
    "category": {
      "en": "Higher-Level Cognitive Strategies",
      "hi": "उच्च-स्तरीय संज्ञानात्मक रणनीतियाँ",
      "gu": "ઉચ્ચ-સ્તરીય બોધાત્મક વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Systems Thinking (Feedback Loops & Second-Order Effects)",
      "hi": "सिस्टम थिंकिंग (फीडबैक लूप और द्वितीय-क्रम प्रभाव)",
      "gu": "સિસ્ટમ થિંકિંગ (ફીડબેક લૂપ્સ અને દ્વિતીય-સ્તર અસરો)"
    },
    "description": {
      "en": "Analyze complex interactions not as isolated linear dominoes, but as circular reinforcing/balancing feedback loops with time delays and unintended consequences.",
      "hi": "जटिल घटनाओं को अलग-अलग सीधी रेखाओं के रूप में नहीं, बल्कि समय के अंतराल और अप्रत्याशित परिणामों वाले चक्रीय फीडबैक लूप के रूप में समझें।",
      "gu": "જટિલ પ્રક્રિયાઓને અલગ-અલગ સીધી રેખાઓ તરીકે નહીં, પણ સમયના વિલંબ અને અણધારી અસરોવાળા ચક્રીય ફીડબેક લૂપ્સ તરીકે સમજો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "feedback_loops",
        "title": {
          "en": "Fixing One Problem Only to Trigger a Catastrophic Chain Reaction Elsewhere?",
          "hi": "एक समस्या को ठीक करने के चक्कर में अनजाने में दूसरी बड़ी तबाही शुरू कर देना?",
          "gu": "એક સમસ્યા ઉકેલવા જતાં અજાણતાં બીજી મોટી મુશ્કેલી ઊભી કરી દેવી?"
        },
        "pain_quotes": [
          {
            "en": "I studied for 18 hours straight by skipping sleep to ace Math, but the sleep debt crashed my immune system and I missed my Science and English finals!",
            "hi": "मैंने गणित में टॉप करने के लिए रात भर जागकर 18 घंटे पढ़ाई की, पर नींद की कमी से तबीयत खराब हो गई और विज्ञान व अंग्रेजी की परीक्षा छूट गई!",
            "gu": "મેં ગણિતમાં ટોપ કરવા ઊંઘ છોડીને ૧૮ કલાક વાંચ્યું, પણ ઊંઘના અભાવે બીમાર પડી ગયો અને વિજ્ઞાન-અંગ્રેજીની વાર્ષિક પરીક્ષા ચૂકી ગયો!"
          },
          {
            "en": "Linear thinking assumes 'A causes B'. Systems thinking asks: 'What does B cause back to A after a time delay?'",
            "hi": "रैखिक सोच मानती है 'A से B होता है'। सिस्टम थिंकिंग पूछती है: 'समय बीतने के बाद B वापस A पर क्या असर डालेगा?'",
            "gu": "સરળ વિચાર માને છે 'A થી B થાય છે'. સિસ્ટમ થિંકિંગ પૂછે છે: 'સમય જતાં B પાછો A પર શું પ્રભાવ પાડશે?'"
          }
        ],
        "body": {
          "en": "MIT pioneer Jay Forrester revealed that complex real-world systems (ecosystems, human biology, economies, school grades) are governed by **Feedback Loops**. A **Reinforcing Loop** amplifies change exponentially (snowball effect). A **Balancing Loop** resists change to seek equilibrium. Ignoring delayed second-order effects creates 'solutions' that make the original problem far worse!",
          "hi": "एमआईटी के जय फॉरेस्टर ने साबित किया कि वास्तविक दुनिया की प्रणालियाँ (पारिस्थितिकी तंत्र, मानव शरीर, अर्थव्यवस्था, पढ़ाई) **फीडबैक लूप** द्वारा नियंत्रित होती हैं। एक **प्रबलक लूप (Reinforcing Loop)** बदलाव को तेजी से बढ़ाता है। एक **संतुलन लूप (Balancing Loop)** स्थिरता बनाए रखता है। समय के अंतराल वाले प्रभावों को अनदेखा करने से ऐसे उपाय बनते हैं जो समस्या को और बढ़ा देते हैं!",
          "gu": "એમઆઈટીના સંશોધકોએ સાબિત કર્યું કે વાસ્તવિક દુનિયા (ઇકોસિસ્ટમ, માનવ શરીર, અભ્યાસ) **ફીડબેક લૂપ્સ** દ્વારા ચાલે છે. **રીઈન્ફોર્સિંગ લૂપ** ફેરફારને ઝડપથી વધારે છે. **બેલેન્સિંગ લૂપ** સ્થિરતા જાળવે છે. સમયના વિલંબવાળી અસરો અવગણવાથી એવા ઉપાયો બને છે જે સમસ્યાને વધુ વણસાવી દે છે!"
        },
        "key_takeaway": {
          "en": "Systems Rule: Map the circular feedback loops and time delays $\\rightarrow$ Anticipate second-order consequences before acting!",
          "hi": "सिस्टम नियम: चक्रीय फीडबैक लूप और समय के अंतराल को समझें $\\rightarrow$ कार्य करने से पहले दूरगामी परिणामों का अनुमान लगाएं!",
          "gu": "સિસ્ટમ નિયમ: ચક્રીય ફીડબેક લૂપ્સ અને સમયના વિલંબને સમજો $\\rightarrow$ કોઈપણ પગલું ભરતા પહેલાં દૂરગામી અસરોનો અંદાજ લગાવો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "feedback_loops",
        "title": {
          "en": "Meet Diya",
          "hi": "दीया से मिलें",
          "gu": "દીયાને મળો"
        },
        "story": {
          "en": "Diya wanted to maximize her study output in Class 10. She drank 4 energy drinks a day and cut sleep from 8 hours to 4 hours. Week 1 felt great as her study hours doubled.",
          "hi": "दीया कक्षा 10 में पढ़ाई का समय अधिकतम करना चाहती थी। उसने रोजाना 4 एनर्जी ड्रिंक पी और नींद 8 घंटे से घटाकर 4 घंटे कर दी। पहले हफ्ते सब बहुत अच्छा लगा क्योंकि पढ़ाई के घंटे दोगुने हो गए।",
          "gu": "દીયા ધોરણ ૧૦ માં વાંચનનો સમય વધારવા માંગતી હતી. તેણે રોજના ૪ એનર્જી ડ્રિંક્સ પીધા અને ઊંઘ ૮ કલાકથી ઘટાડીને ૪ કલાક કરી. પહેલા અઠવાડિયે બમણો સમય વાંચવા મળતાં બધું સારું લાગ્યું."
        },
        "insight_box": {
          "en": "Systemic Crash: By Week 3, the delayed biological balancing loop triggered severe burnout, brain fog, and chronic anxiety. Her retention dropped by 70%. She learned that biological systems cannot be treated like linear machines!",
          "hi": "सिस्टम पतन: तीसरे हफ्ते तक शरीर के संतुलन तंत्र ने भारी मानसिक थकान, तनाव और सिरदर्द शुरू कर दिया। उसकी याददाश्त 70% घट गई। उसने सीखा कि जैविक शरीर को मशीन की तरह नहीं चलाया जा सकता!",
          "gu": "સિસ્ટમ પતન: ત્રીજા અઠવાડિયે મગજે ભારે થાક, તણાવ અને વિસ્મૃતિ શરૂ કરી દીધી. તેની યાદશક્તિ ૭૦% ઘટી ગઈ. તે સમજી ગઈ કે માનવ શરીરને મશીનની જેમ ખેંચી શકાતું નથી!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "feedback_loops",
        "question": {
          "en": "What is a 'Second-Order Effect' in Systems Thinking?",
          "hi": "सिस्टम थिंकिंग में 'द्वितीय-क्रम प्रभाव' (Second-Order Effect) क्या होता है?",
          "gu": "સિસ્ટમ થિંકિંગમાં 'દ્વિતીય-સ્તર અસર' (Second-Order Effect) એટલે શું?"
        },
        "option_a": {
          "en": "The downstream, delayed consequence of an action, asking: 'And then what happens as a result of that?'",
          "hi": "किसी कार्य का समय बीतने के बाद होने वाला परिणाम, जो पूछता है: 'और फिर उसके परिणामस्वरूप आगे क्या होगा?'",
          "gu": "કોઈપણ કાર્યનું સમય પછી આવતું પરિણામ, જે પૂછે છે: 'અને પછી તેના પરિણામે આગળ શું થશે?'"
        },
        "option_b": {
          "en": "The second page of an instruction manual.",
          "hi": "निर्देश पुस्तिका का दूसरा पृष्ठ।",
          "gu": "માર્ગદર્શિકા પુસ્તિકાનું બીજું પાનું."
        },
        "feedback": {
          "en": "Exact! First-order thinking asks 'What happens immediately?' Second-order systems thinking asks 'What chain reaction does this trigger across the interconnected network over time?'",
          "hi": "एकदम सही! प्रथम-क्रम सोच पूछती है 'अभी तुरंत क्या होगा?' द्वितीय-क्रम सिस्टम थिंकिंग पूछती है 'समय के साथ यह पूरे नेटवर्क में कौन सी श्रृंखला शुरू करेगा?'",
          "gu": "સાચો જવાબ! પ્રથમ સ્તરનો વિચાર પૂછે છે 'તરત શું થશે?' દ્વિતીય સ્તર સિસ્ટમ થિંકિંગ પૂછે છે 'સમય જતાં આ આખી સિસ્ટમમાં કઈ સાંકળ અસર શરૂ કરશે?'"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "feedback_loops",
        "question": {
          "en": "In Class 10 Biology Ecosystems: A village eradicates all predatory hawks to protect chickens. What is the disastrous systemic consequence?",
          "hi": "कक्षा 10 जीवविज्ञान पारिस्थितिकी तंत्र: एक गाँव मुर्गियों को बचाने के लिए सभी बाजों (शिकारी पक्षियों) को मार देता है। इसका विनाशकारी परिणाम क्या होगा?",
          "gu": "ધોરણ ૧૦ જીવવિજ્ઞાન ઇકોસિસ્ટમ: ગામ મરઘીઓને બચાવવા માટે બધા બાજ પક્ષીઓને મારી નાખે છે. આનું વિનાશક સિસ્ટમિક પરિણામ શું આવશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Rodent and snake populations explode without predators, destroying 80% of the village's grain crops.",
              "hi": "शिकारियों के बिना चूहों और कीटों की आबादी तेजी से बढ़ेगी, जिससे गाँव की 80% अनाज की फसलें बर्बाद हो जाएंगी।",
              "gu": "શિકારી વગર ઉંદરો અને જીવાતોની વસ્તી બેફામ વધશે, જેથી ગામનો ૮૦% અનાજનો પાક નષ્ટ થઈ જશે."
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Chickens learn how to fly and migrate south.",
              "hi": "मुर्गियाँ उड़ना सीख जाएंगी और दक्षिण की ओर चली जाएंगी।",
              "gu": "મરઘીઓ ઊડતાં શીખી જશે અને દક્ષિણ તરફ જતી રહેશે."
            }
          },
          {
            "id": "C",
            "text": {
              "en": "The soil immediately turns into pure gold.",
              "hi": "मिट्टी तुरंत शुद्ध सोने में बदल जाएगी।",
              "gu": "માટી તરત જ સોનામાં ફેરવાઈ જશે."
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Rainfall doubles across the region permanently.",
              "hi": "क्षेत्र में स्थायी रूप से वर्षा दोगुनी हो जाएगी।",
              "gu": "વિસ્તારમાં કાયમ માટે બમણો વરસાદ શરૂ થઈ જશે."
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! In ecological food webs, removing a top predator breaks the balancing feedback loop, triggering population explosions below that destroy the entire resource base.",
          "hi": "बिल्कुल सही! खाद्य जाल में शीर्ष शिकारी को हटाने से संतुलन लूप टूट जाता है, जिससे निचली प्रजातियों की अनियंत्रित वृद्धि पूरे संसाधन आधार को नष्ट कर देती है।",
          "gu": "સાચો જવાબ! ફૂડ વેબમાંથી મુખ્ય શિકારી હટાવવાથી બેલેન્સિંગ લૂપ તૂટી જાય છે, જેથી નીચેની જીવાતોની બેફામ વૃદ્ધિ આખી સિસ્ટમ નષ્ટ કરી દે છે."
        }
      },
      {
        "type": "strategy_pills",
        "icon": "feedback_loops",
        "title": {
          "en": "Systems Loop Navigator",
          "hi": "सिस्टम लूप नेविगेटर",
          "gu": "સિસ્ટમ લૂપ નેવિગેટર"
        },
        "body": {
          "en": "Map circular feedback loops, account for time delays, and predict second-order systemic reactions before making major changes.",
          "hi": "चक्रीय फीडबैक लूप बनाएं, समय के अंतराल को ध्यान में रखें और बड़े बदलाव करने से पहले द्वितीय-क्रम प्रभावों का पूर्वानुमान लगाएं।",
          "gu": "ચક્રીય ફીડબેક લૂપ્સ બનાવો, સમયના વિલંબને ધ્યાનમાં લો અને મોટા ફેરફારો કરતા પહેલાં દ્વિતીય સ્તરની અસરોની આગાહી કરો."
        },
        "tags": [
          {
            "en": "Feedback Loops",
            "hi": "फीडबैक लूप",
            "gu": "ફીડબેક લૂપ્સ"
          },
          {
            "en": "Second-Order Effects",
            "hi": "द्वितीय-क्रम प्रभाव",
            "gu": "દ્વિતીય-સ્તર અસરો"
          },
          {
            "en": "Reinforcing Loop",
            "hi": "प्रबलक लूप",
            "gu": "રીઈન્ફોર્સિંગ લૂપ"
          },
          {
            "en": "Balancing Loop",
            "hi": "संतुलन लूप",
            "gu": "બેલેન્સિંગ લૂપ"
          },
          {
            "en": "Time Delays",
            "hi": "समय का अंतराल",
            "gu": "સમયનો વિલંબ"
          },
          {
            "en": "Holistic Systems",
            "hi": "समग्र प्रणाली",
            "gu": "સમગ્ર સિસ્ટમ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "feedback_loops",
        "title": {
          "en": "4 Steps to Apply Systems Thinking",
          "hi": "सिस्टम थिंकिंग लागू करने के 4 चरण",
          "gu": "સિસ્ટમ થિંકિંગ લાગુ કરવાના 4 પગલાં"
        },
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next.",
        "steps": [
          {
            "step": 1,
            "correct_order": 1,
            "text": {
              "en": "Identify all interconnected components, stocks (accumulations), and flows in the system.",
              "hi": "प्रणाली के सभी परस्पर जुड़े घटकों, संचयों (Stocks) और प्रवाहों (Flows) की पहचान करें।",
              "gu": "સિસ્ટમના તમામ જોડાયેલા ઘટકો, જથ્થા (Stocks) અને પ્રવાહો (Flows) ઓળખો."
            }
          },
          {
            "step": 2,
            "correct_order": 2,
            "text": {
              "en": "Trace circular cause-and-effect loops to see if changes reinforce or balance themselves.",
              "hi": "चक्रीय कारण-और-प्रभाव लूप बनाएं ताकि पता चले कि बदलाव बढ़ता है या संतुलित होता है।",
              "gu": "ચક્રીય કારણ-અસર લૂપ્સ દોરો જેથી ખબર પડે કે ફેરફાર વધે છે કે સંતુલિત થાય છે."
            }
          },
          {
            "step": 3,
            "correct_order": 3,
            "text": {
              "en": "Identify time delays between an action and its full downstream systemic response.",
              "hi": "किसी कार्य और उसके पूर्ण दूरगामी परिणाम के बीच के समय अंतराल की पहचान करें।",
              "gu": "કોઈ પગલું ભરવા અને તેના સંપૂર્ણ દૂરગામી પરિણામ વચ્ચેનો સમય વિલંબ ઓળખો."
            }
          },
          {
            "step": 4,
            "correct_order": 4,
            "text": {
              "en": "Ask 'And then what happens?' to anticipate second-order and unintended side effects.",
              "hi": "'और फिर उसके बाद क्या होगा?' पूछकर अप्रत्याशित दुष्प्रभावों का पहले से अनुमान लगाएं।",
              "gu": "'અને પછી શું થશે?' પૂછીને અણધારી આડઅસરોનો પહેલેથી અંદાજ લગાવો."
            }
          }
        ]
      },
      {
        "type": "daily_mission",
        "icon": "feedback_loops",
        "title": {
          "en": "Habit Loop Systems Mapping",
          "hi": "आदत लूप सिस्टम मैपिंग",
          "gu": "આદત લૂપ સિસ્ટમ મેપિંગ"
        },
        "mission_text": {
          "en": "Map out your daily study routine as a circular system diagram: Study Hours $\\rightarrow$ Sleep Duration $\\rightarrow$ Brain Energy $\\rightarrow$ Next Day Focus. Identify one hidden balancing bottleneck!",
          "hi": "अपनी दैनिक अध्ययन दिनचर्या को एक चक्रीय सिस्टम आरेख के रूप में बनाएं: पढ़ाई के घंटे $\\rightarrow$ नींद $\\rightarrow$ मानसिक ऊर्जा $\\rightarrow$ अगले दिन का ध्यान। एक छिपी रुकावट खोजें!",
          "gu": "તમારા રોજના અભ્યાસને ચક્રીય સિસ્ટમ ડાયાગ્રામ તરીકે દોરો: વાંચનના કલાક $\\rightarrow$ ઊંઘ $\\rightarrow$ માનસિક તાજગી $\\rightarrow$ બીજા દિવસનું ધ્યાન. એક છુપી અડચણ શોધો!"
        },
        "commitment_button_text": {
          "en": "I will use Systems Thinking to anticipate second-order effects!",
          "hi": "मैं दूरगामी प्रभावों का पूर्वानुमान लगाने के लिए सिस्टम थिंकिंग का उपयोग करूँगा!",
          "gu": "હું દૂરગામી અસરોની આગાહી કરવા સિસ્ટમ થિંકિંગ વાપરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c10_198",
    "methodNumber": 198,
    "classLevel": 10,
    "category": {
      "en": "Higher-Level Cognitive Strategies",
      "hi": "उच्च-स्तरीय संज्ञानात्मक रणनीतियाँ",
      "gu": "ઉચ્ચ-સ્તરીય બોધાત્મક વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Constraint Optimisation (Boundary Vertices & Feasible Regions)",
      "hi": "बाधा अनुकूलन (सीमा शीर्ष और साध्य क्षेत्र)",
      "gu": "મર્યાદા ઓપ્ટિમાઇઝેશન (સીમા શિરોબિંદુઓ અને સંભવિત ક્ષેત્રો)"
    },
    "description": {
      "en": "Find the absolute maximum or minimum output of an objective function subject to strict physical, budgetary, or mathematical inequality constraints using the Corner-Point Vertex model.",
      "hi": "कॉर्नर-पॉइंट वर्टेक्स मॉडल का उपयोग करके सख्त भौतिक, बजटीય या गणितीय बाधाओं के अधीन किसी उद्देश्य का अधिकतम या न्यूनतम मान ज्ञात करें।",
      "gu": "કોર્નર-પોઇન્ટ વર્ટેક્સ મોડેલ વાપરીને ભૌતિક, આર્થિક કે ગાણિતિક મર્યાદાઓ વચ્ચે કોઈપણ ઉદ્દેશ્યનું મહત્તમ કે ન્યૂનતમ મૂલ્ય શોધો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "constraint_boundary",
        "title": {
          "en": "Guessing Arbitrary Dimensions When Optimizing Area or Budget Boundaries?",
          "hi": "क्षेत्रफल या बजट को अनुकूलित करते समय मनमाने अंदाजे लगा रहे हैं?",
          "gu": "ક્ષેત્રફળ કે બજેટનું આયોજન કરતી વખતે માત્ર અંદાજ લગાવીને સમય બગાડો છો?"
        },
        "pain_quotes": [
          {
            "en": "When given 40m of fencing to build the largest rectangular field, I randomly tested 5×15, 8×12, and 10×10 on paper without knowing the exact mathematical proof!",
            "hi": "जब 40 मीटर बाड़ से सबसे बड़ा आयताकार मैदान बनाने को कहा गया, तो मैंने बिना गणितीय नियम जाने 5×15, 8×12 के तुक्के लगाए!",
            "gu": "જ્યારે 40 મીટર વાડ વડે સૌથી મોટો લંબચોરસ ખેતર બનાવવાનું કહ્યું, ત્યારે મેં નિયમ જાણ્યા વગર 5×15 અને 8×12 ના અંદાજો લગાવ્યા!"
          },
          {
            "en": "Treating real-world optimization as unconstrained trial-and-error causes massive resource waste and misses the global optimum!",
            "hi": "वास्तविक जीवन के अनुकूलन को बिना नियमों के तुक्केबाज़ी मानना भारी संसाधन बर्बाद करता है और सही समाधान चूक जाता है!",
            "gu": "વાસ્તવિક ઓપ્ટિમાઇઝેશનને નિયમ વગરના અંદાજા તરીકે ગણવાથી સંસાધનોનો બગાડ થાય છે અને શ્રેષ્ઠ ઉકેલ ચૂકી જવાય છે!"
          }
        ],
        "body": {
          "en": "In mathematical optimization and linear programming, every real problem has an **Objective Function** (e.g., Maximize Area $A = x \\cdot y$, Minimize Cost $C = 2x + 3y$) bounded by **Constraint Inequalities** (e.g., $x + y \\le 20, x \\ge 0$). The fundamental **Corner-Point Theorem** proves that the optimal solution ALWAYS lies at one of the vertices (intersections) of the Feasible Region boundary!",
          "hi": "गणितीय अनुकूलन में, प्रत्येक वास्तविक समस्या का एक **उद्देश्य फलन** होता है (जैसे अधिकतम क्षेत्रफल $A = x \\cdot y$, न्यूनतम लागत $C = 2x + 3y$) जो **बाधा असमानताओं** (जैसे $x + y \\le 20$) से घिरा होता है। **कॉर्नर-पॉइंट प्रमेय** साबित करता है कि सर्वोत्तम समाधान हमेशा साध्य क्षेत्र (Feasible Region) की सीमाओं के कोने वाले शीर्ष (Vertices) पर ही स्थित होता है!",
          "gu": "ગાણિતિક ઓપ્ટિમાઇઝેશનમાં દરેક સમસ્યાનું એક **ઉદ્દેશ્ય વિધેય** હોય છે (જેમ કે મહત્તમ ક્ષેત્રફળ $A = x \\cdot y$, ન્યૂનતમ ખર્ચ $C = 2x + 3y$) જે **મર્યાદાઓ** (જેમ કે $x + y \\le 20$) થી બંધાયેલું હોય છે. **કોર્નર-પોઇન્ટ પ્રમેય** સાબિત કરે છે કે શ્રેષ્ઠ ઉકેલ હંમેશા સીમાના ખૂણાના શિરોબિંદુ પર જ મળે છે!"
        },
        "key_takeaway": {
          "en": "Constraint Rule: Define the objective function $\\rightarrow$ Map boundary constraints $\\rightarrow$ Test vertex intersections for the global optimum!",
          "hi": "बाधा नियम: उद्देश्य फलन लिखें $\\rightarrow$ सीमा की बाधाएं बनाएं $\\rightarrow$ सर्वोत्तम समाधान के लिए कोनों के शीर्षों का परीक्षण करें!",
          "gu": "મર્યાદા નિયમ: ઉદ્દેશ્ય વિધેય નક્કી કરો $\\rightarrow$ સીમા મર્યાદાઓ આલેખો $\\rightarrow$ શ્રેષ્ઠ ઉકેલ માટે ખૂણાના શિરોબિંદુઓ ચકાસો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "constraint_boundary",
        "title": {
          "en": "Meet Aman",
          "hi": "अमन से मिलें",
          "gu": "અમનને મળો"
        },
        "story": {
          "en": "Aman was tasked with designing a rectangular garden bed along a brick wall using exactly 36 meters of fencing wire (only 3 sides need wire: $2x + y = 36$). He guessed $x=6, y=24 \\implies \\text{Area} = 144\\text{ m}^2$.",
          "hi": "अमन को एक दीवार के सहारे 36 मीटर तार से आयताकार बगीचा बनाना था (केवल 3 तरफ तार चाहिए: $2x + y = 36$)। उसने तुक्का लगाया $x=6, y=24 \\implies \\text{क्षेत्रफल} = 144\\text{ वर्ग मीटर}$।",
          "gu": "અમનને દીવાલના સહારે 36 મીટર વાડથી લંબચોરસ બગીચો બનાવવાનો હતો (માત્ર ૩ બાજુ વાડ: $2x + y = 36$). તેણે અંદાજ લગાવ્યો $x=6, y=24 \\implies \\text{ક્ષેત્રફળ} = 144\\text{ ચોરસ મીટર}$."
        },
        "insight_box": {
          "en": "Quadratic Vertex Insight: Area $A(x) = x(36 - 2x) = 36x - 2x^2$. The vertex of this parabola occurs at $x = -b/(2a) = -36/(2 \\times -2) = 9$ meters! Dimensions: $x = 9\\text{ m}, y = 18\\text{ m} \\implies \\text{Max Area} = 162\\text{ m}^2$ (an extra $18\\text{ m}^2$ for free)!",
          "hi": "द्विघात शीर्ष समझ: क्षेत्रफल $A(x) = x(36 - 2x) = 36x - 2x^2$। इस परवलय का शीर्ष $x = -b/(2a) = 36/4 = 9$ मीटर पर आता है! विमाएँ: $x = 9\\text{ मी}, y = 18\\text{ मी} \\implies \\text{अधिकतम क्षेत्रफल} = 162\\text{ वर्ग मी}$ (18 वर्ग मी ज्यादा)!",
          "gu": "દ્વિઘાત શિરોબિંદુ સમજ: ક્ષેત્રફળ $A(x) = x(36 - 2x) = 36x - 2x^2$. પરવલયનું શિરોબિંદુ $x = -b/(2a) = 36/4 = 9$ મીટર પર મળે! માપ: $x = 9\\text{ મી}, y = 18\\text{ મી} \\implies \\text{મહત્તમ ક્ષેત્રફળ} = 162\\text{ ચોરસ મીટર}$!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "constraint_boundary",
        "question": {
          "en": "For a fixed perimeter $P = 40\\text{ m}$, which geometric rectangle shape mathematically maximizes enclosed area?",
          "hi": "निश्चित परिमाप $P = 40\\text{ मी}$ के लिए, कौन सा आयताकार आकार संलग्न क्षेत्रफल को अधिकतम करता है?",
          "gu": "નિશ્ચિત પરિમિતિ $P = 40\\text{ મી}$ માટે, કયો લંબચોરસ આકાર ક્ષેત્રફળને મહત્તમ બનાવે છે?"
        },
        "option_a": {
          "en": "A Square (equal sides $10\\text{ m} \\times 10\\text{ m} = 100\\text{ m}^2$; symmetric geometry maximizes area for any perimeter constraint).",
          "hi": "एक वर्ग (समान भुजाएं $10\\text{ मी} \\times 10\\text{ मी} = 100\\text{ वर्ग मी}$; सममित ज्यामिति परिमाप बाधा के लिए क्षेत्रफल अधिकतम करती है)।",
          "gu": "ચોરસ (સરખી બાજુઓ $10\\text{ મી} \\times 10\\text{ મી} = 100\\text{ ચોરસ મીટર}$; સમપ્રમાણ આકાર ક્ષેત્રફળ મહત્તમ કરે છે)."
        },
        "option_b": {
          "en": "A very long thin strip like $1\\text{ m} \\times 19\\text{ m} = 19\\text{ m}^2$.",
          "hi": "एक बहुत लंबा संकीर्ण पट्टा जैसे $1\\text{ मी} \\times 19\\text{ मी} = 19\\text{ वर्ग मी}$।",
          "gu": "ખૂબ લાંબો પાતળો પટ્ટો જેમ કે $1\\text{ મી} \\times 19\\text{ મી} = 19\\text{ ચોરસ મીટર}$."
        },
        "feedback": {
          "en": "Spot on! By AM-GM Inequality (Arithmetic Mean $\\ge$ Geometric Mean), the product $x \\cdot y$ is strictly maximized when $x = y$ (a square)!",
          "hi": "बिल्कुल सही! AM-GM असमिका के अनुसार, जब $x = y$ (वर्ग) होता है, तब गुणनफल $x \\cdot y$ अधिकतम होता है!",
          "gu": "સાચો જવાબ! AM-GM અસમતા મુજબ, જ્યારે $x = y$ (ચોરસ) હોય ત્યારે ગુણાકાર $x \\cdot y$ હંમેશા મહત્તમ બને છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "constraint_boundary",
        "question": {
          "en": "You have ₹100 budget to buy study notebooks ($x$ at ₹20 each) and pens ($y$ at ₹10 each). Constraint: $20x + 10y \\le 100$. To maximize total items ($x + y$) with at least 2 notebooks ($x \\ge 2$), what is the optimal purchase?",
          "hi": "आपके पास ₹100 हैं। नोटबुक ($x$, ₹20 प्रत्येक) और पेन ($y$, ₹10 प्रत्येक) खरीदने हैं। बाधा: $20x + 10y \\le 100$। कम से कम 2 नोटबुक ($x \\ge 2$) के साथ कुल वस्तुएं ($x + y$) अधिकतम करने के लिए क्या खरीदना चाहिए?",
          "gu": "તમારી પાસે ₹100 છે. નોટબુક ($x$, ₹20 પ્રતિ નંગ) અને પેન ($y$, ₹10 પ્રતિ નંગ) ખરીદવી છે. મર્યાદા: $20x + 10y \\le 100$. ઓછામાં ઓછી ૨ નોટબુક ($x \\ge 2$) સાથે કુલ વસ્તુઓ ($x + y$) મહત્તમ કરવા શું ખરીદવું?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Buy 2 notebooks (₹40) and 6 pens (₹60) = 8 total items (Optimal boundary vertex).",
              "hi": "2 नोटबुक (₹40) और 6 पेन (₹60) खरीदें = कुल 8 वस्तुएं (सर्वोत्तम सीमा शीर्ष)।",
              "gu": "૨ નોટબુક (₹40) અને ૬ પેન (₹60) ખરીદો = કુલ ૮ વસ્તુઓ (શ્રેષ્ઠ સીમા શિરોબિંદુ)."
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Buy 5 notebooks (₹100) and 0 pens = 5 total items.",
              "hi": "5 नोटबुक (₹100) और 0 पेन खरीदें = कुल 5 वस्तुएं।",
              "gu": "૫ નોટબુક (₹100) અને ૦ પેન ખરીદો = કુલ ૫ વસ્તુઓ."
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Buy 0 notebooks and 10 pens (violates the x >= 2 constraint).",
              "hi": "0 नोटबुक और 10 पेन खरीदें (यह x >= 2 की शर्त तोड़ता है)।",
              "gu": "૦ નોટબુક અને ૧૦ પેન ખરીદો (આ x >= 2 ની શરત તોડે છે)."
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Buy 1 notebook and 3 pens, keeping ₹50 unspent.",
              "hi": "1 नोटबुक और 3 पेन खरीदें और ₹50 बचाकर रखें।",
              "gu": "૧ નોટબુક અને ૩ પેન ખરીદો અને ₹૫૦ બચાવી રાખો."
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Exact! The feasible region vertices are $(2, 6)$ and $(5, 0)$. Testing total items: at $(5,0) = 5$ items; at $(2,6) = 8$ items. Vertex $(2,6)$ yields the maximum!",
          "hi": "एकदम सही! साध्य क्षेत्र के शीर्ष $(2, 6)$ और $(5, 0)$ हैं। कुल वस्तुएं: $(5,0)$ पर 5; $(2,6)$ पर 8। शीर्ष $(2,6)$ अधिकतम मान देता है!",
          "gu": "સાચું! શક્ય વિસ્તારના શિરોબિંદુઓ $(2, 6)$ અને $(5, 0)$ છે. કુલ વસ્તુઓ: $(5,0)$ પર ૫; $(2,6)$ પર ૮. શિરોબિંદુ $(2,6)$ મહત્તમ જવાબ આપે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "constraint_boundary",
        "title": {
          "en": "Vertex Optimization Engine",
          "hi": "शीर्ष अनुकूलन इंजन",
          "gu": "શિરોબિંદુ ઓપ્ટિમાઇઝેશન એન્જિન"
        },
        "body": {
          "en": "Define linear objective functions and boundary inequalities; evaluate feasible region corner vertices to pinpoint the global optimum.",
          "hi": "उद्देश्य फलन और सीमा असमानताओं को परिभाषित करें; सर्वोत्तम समाधान खोजने के लिए साध्य क्षेत्र के कोने वाले शीर्षों का मूल्यांकन करें।",
          "gu": "ઉદ્દેશ્ય વિધેય અને સીમા અસમતાઓ નક્કી કરો; શ્રેષ્ઠ ઉકેલ શોધવા સંભવિત ક્ષેત્રના ખૂણાના શિરોબિંદુઓનું મૂલ્યાંકન કરો."
        },
        "tags": [
          {
            "en": "Feasible Region",
            "hi": "साध्य क्षेत्र",
            "gu": "સંભવિત ક્ષેત્ર"
          },
          {
            "en": "Corner Vertices",
            "hi": "कोने वाले शीर्ष",
            "gu": "ખૂણાના શિરોબિંદુઓ"
          },
          {
            "en": "Linear Programming",
            "hi": "रैखिक प्रोग्रामन",
            "gu": "રેખીય પ્રોગ્રામિંગ"
          },
          {
            "en": "AM-GM Symmetry",
            "hi": "AM-GM सममिति",
            "gu": "AM-GM સમપ્રમાણતા"
          },
          {
            "en": "Boundary Limits",
            "hi": "सीमा प्रतिबंध",
            "gu": "સીમા મર્યાદાઓ"
          },
          {
            "en": "Global Optimum",
            "hi": "वैश्विक सर्वोत्तम",
            "gu": "શ્રેષ્ઠ ઉકેલ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "constraint_boundary",
        "title": {
          "en": "4 Steps to Solve Constraint Optimisation Problems",
          "hi": "बाधा अनुकूलन हल करने के 4 चरण",
          "gu": "મર્યાદા ઓપ્ટિમાઇઝેશન ઉકેલવાના 4 પગલાં"
        },
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next.",
        "steps": [
          {
            "step": 1,
            "correct_order": 1,
            "text": {
              "en": "Formulate the algebraic Objective Function you wish to maximize or minimize (e.g., Z = ax + by).",
              "hi": "अधिकतम या न्यूनतम करने के लिए बीजगणितीय उद्देश्य फलन लिखें (जैसे Z = ax + by)।",
              "gu": "મહત્તમ કે ન્યૂનતમ કરવા માટેનું બીજગણિતીય ઉદ્દેશ્ય વિધેય લખો (જેમ કે Z = ax + by)."
            }
          },
          {
            "step": 2,
            "correct_order": 2,
            "text": {
              "en": "List all inequality constraints for budgets, time, materials, and non-negativity (x >= 0, y >= 0).",
              "hi": "बजट, समय, सामग्री और गैर-नकारात्मकता (x >= 0, y >= 0) की सभी बाधा असमानताएं लिखें।",
              "gu": "બજેટ, સમય, સાધન અને અઋણ શરતો (x >= 0, y >= 0) ની તમામ મર્યાદાઓ લખો."
            }
          },
          {
            "step": 3,
            "correct_order": 3,
            "text": {
              "en": "Graph or compute the intersection coordinates of all boundary lines to find corner vertices.",
              "hi": "कोने वाले शीर्ष खोजने के लिए सभी सीमा रेखाओं के प्रतिच्छेदन बिंदु ज्ञात करें।",
              "gu": "ખૂણાના શિરોબિંદુઓ શોધવા તમામ સીમા રેખાઓના છેદનબિંદુઓ ગણો."
            }
          },
          {
            "step": 4,
            "correct_order": 4,
            "text": {
              "en": "Substitute each vertex coordinate into the Objective Function; select the global maximum or minimum.",
              "hi": "प्रत्येक शीर्ष मान को उद्देश्य फलन में रखें; और सबसे बड़ा या सबसे छोटा मान चुनें।",
              "gu": "દરેક શિરોબિંદુની કિંમત ઉદ્દેશ્ય વિધેયમાં મૂકો અને સર્વોચ્ચ કે ન્યૂનતમ મૂલ્ય પસંદ કરો."
            }
          }
        ]
      },
      {
        "type": "daily_mission",
        "icon": "constraint_boundary",
        "title": {
          "en": "Max-Area Geometry Trial",
          "hi": "अधिकतम क्षेत्रफल ज्यामिति प्रयोग",
          "gu": "મહત્તમ ક્ષેત્રફળ ભૂમિતિ પ્રયોગ"
        },
        "mission_text": {
          "en": "Solve on paper: You have 60 meters of wire to enclose a 3-sided rectangle against a wall ($2x + y = 60$). Use parabola vertex math ($x = -b/2a$) to find the dimensions of maximum area!",
          "hi": "कागज पर हल करें: दीवार के सहारे 3-तरफा आयत बनाने के लिए 60 मीटर तार है ($2x + y = 60$)। अधिकतम क्षेत्रफल की विमाएँ निकालने के लिए शीर्ष सूत्र ($x = -b/2a$) का उपयोग करें!",
          "gu": "કાગળ પર ગણો: દીવાલ સાથે ૩-બાજુનો લંબચોરસ બનાવવા 60 મીટર વાયર છે ($2x + y = 60$). મહત્તમ ક્ષેત્રફળના માપ શોધવા શિરોબિંદુ સૂત્ર ($x = -b/2a$) વાપરો!"
        },
        "commitment_button_text": {
          "en": "I will use Constraint Optimisation to find mathematical maximums!",
          "hi": "मैं गणितीय अधिकतम मान खोजने के लिए बाधा अनुकूलन का उपयोग करूँगा!",
          "gu": "હું ગાણિતિક મહત્તમ મૂલ્યો શોધવા મર્યાદા ઓપ્ટિમાઇઝેશન વાપરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c10_200",
    "methodNumber": 200,
    "classLevel": 10,
    "category": {
      "en": "Higher-Level Cognitive Strategies",
      "hi": "उच्च-स्तरीय संज्ञानात्मक रणनीतियाँ",
      "gu": "ઉચ્ચ-સ્તરીય બોધાત્મક વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Hypothesis Testing (Falsifiability & Controlled Experiments)",
      "hi": "परिकल्पना परीक्षण (मिथ्याकरणीयता और नियंत्रित प्रयोग)",
      "gu": "પરિકલ્પના પરીક્ષણ (અસત્ય સાબિત થઈ શકે તેવી કસોટી અને પ્રયોગો)"
    },
    "description": {
      "en": "Formulate precise falsifiable claims, state the Null Hypothesis (H₀), isolate a single independent variable, and strictly control all confounding factors to establish true causal relationships.",
      "hi": "सटीक मिथ्याकरणीय परिकल्पनाएं बनाएं, शून्य परिकल्पना (H₀) स्थापित करें, केवल एक स्वतंत्र चर को बदलें और वास्तविक कारण संबंध सिद्ध करने के लिए अन्य सभी कारकों को नियंत्रित रखें।",
      "gu": "ચોક્કસ પરિકલ્પના બનાવો, શૂન્ય પરિકલ્પના (H₀) નક્કી કરો, માત્ર એક સ્વતંત્ર ચલ બદલો અને સાચો કાર્યકારણ સંબંધ સાબિત કરવા અન્ય તમામ પરિબળો નિયંત્રિત રાખો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "hypothesis_flask",
        "title": {
          "en": "Confusing a Coincidence or Hunch with a Proven Scientific Fact?",
          "hi": "किसी एक संयोग या व्यक्तिगत अंदाजे को वैज्ञानिक तथ्य मान लेना?",
          "gu": "કોઈ એક સંજોગ કે માન્યતાને સાચો વૈજ્ઞાનિક નિયમ માની લેવાની ભૂલ કરો છો?"
        },
        "pain_quotes": [
          {
            "en": "I drank green tea before my exam and scored 98%, so I claimed 'Green tea boosts IQ by 30 points!', ignoring that I had studied for 15 hours!",
            "hi": "मैंने परीक्षा से पहले ग्रीन टी पी और 98% अंक आए, तो मैंने दावा किया 'ग्रीन टी बुद्धि बढ़ाती है!', यह भूलकर कि मैंने 15 घंटे पढ़ाई भी की थी!",
            "gu": "મેં પરીક્ષા પહેલાં ગ્રીન ટી પીધી અને 98% આવ્યા, તો મેં દાવો કર્યો 'ગ્રીન ટી બુદ્ધિ વધારે છે!', એ ભૂલીને કે મેં ૧૫ કલાક વાંચ્યું પણ હતું!"
          },
          {
            "en": "A theory that cannot be tested or proven false is not science—it is just an unfalsifiable story!",
            "hi": "जिस सिद्धांत का परीक्षण न किया जा सके या जिसे गलत साबित न किया जा सके, वह विज्ञान नहीं—केवल एक कहानी है!",
            "gu": "જે સિદ્ધાંતની કસોટી ન થઈ શકે કે જેને ખોટો સાબિત ન કરી શકાય, તે વિજ્ઞાન નથી—માત્ર એક વાર્તા છે!"
          }
        ],
        "body": {
          "en": "Philosopher Karl Popper proved that the cornerstone of real science is **Falsifiability**: a hypothesis must make clear predictions that *could* be proven wrong by evidence. In scientific methodology, you state the **Null Hypothesis ($H_0$)** ('The treatment produces no effect') and run a **Controlled Experiment** changing ONLY the single Independent Variable while keeping all control variables identical!",
          "hi": "दार्शनिक कार्ल पॉपर ने साबित किया कि वास्तविक विज्ञान का आधार **मिथ्याकरणीयता (Falsifiability)** है: एक परिकल्पना को ऐसी स्पष्ट भविष्यवाणी करनी चाहिए जिसे साक्ष्यों द्वारा गलत सिद्ध किया जा सके। वैज्ञानिक पद्धति में, आप **शून्य परिकल्पना ($H_0$)** ('उपचार का कोई प्रभाव नहीं है') तय करते हैं और अन्य सभी कारकों को स्थिर रखते हुए केवल एक स्वतंत्र चर का परीक्षण करते हैं!",
          "gu": "તત્વચિંતક કાર્લ પોપરે સાબિત કર્યું કે સાચા વિજ્ઞાનનો પાયો **અસત્ય સાબિત થઈ શકવાની ક્ષમતા (Falsifiability)** છે: પરિકલ્પના એવી હોવી જોઈએ જેને પુરાવા વડે ખોટી સાબિત કરી શકાય. વૈજ્ઞાનિક પદ્ધતિમાં, તમે **શૂન્ય પરિકલ્પના ($H_0$)** ('કોઈ અસર થતી નથી') નક્કી કરો છો અને અન્ય તમામ બાબતો સમાન રાખી માત્ર એક સ્વતંત્ર ચલ ચકાસો છો!"
        },
        "key_takeaway": {
          "en": "Scientific Rule: Formulate a falsifiable hypothesis $\\rightarrow$ Run controlled trials with one isolated variable $\\rightarrow$ Reject H₀ with data!",
          "hi": "वैज्ञानिक नियम: मिथ्याकरणीय परिकल्पना बनाएं $\\rightarrow$ एक चर के साथ नियंत्रित प्रयोग करें $\\rightarrow$ डेटा से H₀ का परीक्षण करें!",
          "gu": "વૈજ્ઞાનિક નિયમ: કસોટીક્ષમ પરિકલ્પના બનાવો $\\rightarrow$ એક જ ચલ સાથે નિયંત્રિત પ્રયોગ કરો $\\rightarrow$ ડેટા વડે H₀ ચકાસો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "hypothesis_flask",
        "title": {
          "en": "Meet Aniket",
          "hi": "अनिकेत से मिलें",
          "gu": "અનિકેતને મળો"
        },
        "story": {
          "en": "Aniket wanted to prove that blue LED light makes plants grow faster for his Class 10 Biology exhibition. He placed one plant under a blue LED in a warm room with extra fertilizer, and another plant under sunlight in a cold garage with no fertilizer.",
          "hi": "अनिकेत विज्ञान मेले में सिद्ध करना चाहता था कि नीली एलईडी लाइट से पौधे तेजी से बढ़ते हैं। उसने एक पौधा गर्म कमरे में अतिरिक्त खाद के साथ नीली एलईडी के नीचे रखा, और दूसरा पौधा बिना खाद के ठंडे गैरेज में धूप में रखा।",
          "gu": "અનિકેત સાયન્સ ફેરમાં સાબિત કરવા માંગતો હતો કે બ્લુ LED લાઈટથી છોડ ઝડપથી વધે છે. તેણે એક છોડ ગરમ રૂમમાં ખાતર સાથે બ્લુ LED નીચે મૂક્યો, અને બીજો છોડ ખાતર વગર ઠંડા ગેરેજમાં સૂર્યપ્રકાશમાં મૂક્યો."
        },
        "insight_box": {
          "en": "Confounded Variables: The blue-light plant grew taller, but judges disqualified it because Temperature and Fertilizer were not controlled. Aniket redesigned with 20 plants identical in soil, water, and temperature, varying ONLY light wavelength to produce real, publishable science!",
          "hi": "गड़बड़ चर: नीली लाइट वाला पौधा बढ़ा, पर जजों ने इसे अमान्य कर दिया क्योंकि तापमान और खाद नियंत्रित नहीं थे। अनिकेत ने मिट्टी, पानी और तापमान को 100% समान रखकर केवल प्रकाश का रंग बदला और सही विज्ञान प्रस्तुत किया!",
          "gu": "ભૂલ ભરેલા ચલ: બ્લુ લાઈટવાળો છોડ વધ્યો ખરો, પણ નિર્ણાયકોએ અમાન્ય રાખ્યો કારણ કે તાપમાન અને ખાતર સમાન નહોતા. અનિકેતે માટી, પાણી અને તાપમાન ૧૦૦% સરખા રાખી માત્ર લાઈટનો રંગ બદલી સાચો પ્રયોગ કર્યો!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "hypothesis_flask",
        "question": {
          "en": "Why is an 'Unfalsifiable Claim' (e.g., 'Invisible, undetectable fairies make plants grow') scientifically meaningless?",
          "hi": "एक 'अमिथ्याकरणीय दावा' (जैसे 'अदृश्य परियाँ पौधों को बढ़ाती हैं') वैज्ञानिक रूप से निरर्थक क्यों है?",
          "gu": "'ચકાસી ન શકાય તેવો દાવો' (દા.ત. 'અદ્રશ્ય પરીઓ છોડને ઉગાડે છે') વૈજ્ઞાનિક રીતે નકામો કેમ ગણાય છે?"
        },
        "option_a": {
          "en": "Because no possible physical observation or experiment can ever prove it wrong; without the risk of being false, it cannot be tested.",
          "hi": "क्योंकि कोई भी भौतिक अवलोकन या प्रयोग इसे कभी गलत सिद्ध नहीं कर सकता; गलत होने के जोखिम के बिना इसका परीक्षण संभव नहीं है।",
          "gu": "કારણ કે કોઈ પ્રયોગ તેને ક્યારેય ખોટો સાબિત ન કરી શકે; ખોટા સાબિત થવાના જોખમ વગર તેની કસોટી અશક્ય છે."
        },
        "option_b": {
          "en": "Because fairies only appear during nighttime.",
          "hi": "क्योंकि परियाँ केवल रात में दिखाई देती हैं।",
          "gu": "કારણ કે પરીઓ માત્ર રાત્રે જ દેખાય છે."
        },
        "feedback": {
          "en": "Spot on! Karl Popper proved that true scientific hypotheses must stick their neck out: they must make risky, specific predictions that can be demolished by contrary evidence.",
          "hi": "बिल्कुल सही! कार्ल पॉपर ने साबित किया कि वास्तविक वैज्ञानिक परिकल्पनाओं को स्पष्ट भविष्यवाणी करनी चाहिए जिसे विपरीत साक्ष्यों द्वारा नकारा जा सके।",
          "gu": "સાચો જવાબ! કાર્લ પોપરે સાબિત કર્યું કે સાચી પરિકલ્પના એવી હોવી જોઈએ જેને વિરુદ્ધ પુરાવા દ્વારા ખોટી સાબિત કરવાનો સ્પષ્ટ અવકાશ હોય."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "hypothesis_flask",
        "question": {
          "en": "To test the hypothesis: 'Chewing gum improves memory recall during math tests', what is the IDEAL experiment design?",
          "hi": "परिकल्पना का परीक्षण करने के लिए: 'च्यूइंग गम चबाने से गणित की परीक्षा में याददाश्त सुधरती है', आदर्श प्रयोग डिजाइन क्या होगा?",
          "gu": "પરિકલ્પના ચકાસવા માટે: 'ચ્યુઇંગ ગમ ચાવવાથી ગણિતની પરીક્ષામાં યાદશક્તિ સુધરે છે', આદર્શ પ્રયોગ ડિઝાઇન કઈ?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Randomly divide 60 identical students into 2 groups: Group A chews gum during test, Group B does not; both take the exact same test in the same quiet room.",
              "hi": "60 समान छात्रों को 2 समूहों में बांटें: समूह A गम चबाएगा, समूह B नहीं; दोनों एक ही शांत कमरे में बिल्कुल समान परीक्षा देंगे।",
              "gu": "૬૦ સરખા વિદ્યાર્થીઓને ૨ જૂથમાં વહેંચો: જૂથ A ગમ ચાવશે, જૂથ B નહીં; બંને એક જ શાંત રૂમમાં સરખી જ પરીક્ષા આપશે."
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Let 1 top student chew gum and compare his score with a struggling student in another school.",
              "hi": "1 टॉपर छात्र को गम चबाने दें और उसके स्कोर की तुलना दूसरे स्कूल के कमजोर छात्र से करें।",
              "gu": "૧ હોશિયાર વિદ્યાર્થીને ગમ ચાવવા દો અને બીજા સ્કૂલના નબળા વિદ્યાર્થી સાથે સરખાવો."
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Ask people on social media if they like chewing gum.",
              "hi": "सोशल मीडिया पर लोगों से पूछें कि क्या उन्हें गम पसंद है।",
              "gu": "સોશિયલ મીડિયા પર લોકોને પૂછો કે તેમને ગમ પસંદ છે કે નહીં."
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Give students 5 different types of candy and change the test questions for each student.",
              "hi": "छात्रों को 5 अलग-अलग मिठाइयाँ दें और हर छात्र के लिए प्रश्न बदल दें।",
              "gu": "વિદ્યાર્થીઓને ૫ અલગ ચોકલેટ આપો અને દરેકના પ્રશ્નો બદલી નાખો."
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Flawless scientific methodology! Large sample size + randomized control group + identical testing conditions isolates Chewing Gum as the SOLE independent variable.",
          "hi": "उत्कृष्ट वैज्ञानिक पद्धति! बड़ा नमूना + यादृच्छिक नियंत्रण समूह + समान परीक्षण स्थितियां च्यूइंग गम को एकमात्र स्वतंत्र चर बनाती हैं।",
          "gu": "શ્રેષ્ઠ વૈજ્ઞાનિક પદ્ધતિ! મોટો સેમ્પલ સાઇઝ + કંટ્રોલ ગ્રૂપ + સમાન પરીક્ષા વાતાવરણ ચ્યુઇંગ ગમને એકમાત્ર સ્વતંત્ર ચલ તરીકે અલગ તારવે છે."
        }
      },
      {
        "type": "strategy_pills",
        "icon": "hypothesis_flask",
        "title": {
          "en": "Scientific Hypothesis Engine",
          "hi": "वैज्ञानिक परिकल्पना इंजन",
          "gu": "વૈજ્ઞાનિક પરિકલ્પના એન્જિન"
        },
        "body": {
          "en": "State precise falsifiable claims; isolate a single independent variable and hold all other conditions strictly constant in controlled trials.",
          "hi": "सटीक मिथ्याकरणीय दावे करें; केवल एक स्वतंत्र चर को बदलें और नियंत्रित परीक्षणों में अन्य सभी स्थितियों को पूरी तरह स्थिर रखें।",
          "gu": "ચોક્કસ કસોટીક્ષમ દાવા કરો; માત્ર એક સ્વતંત્ર ચલ બદલો અને નિયંત્રિત પ્રયોગોમાં બાકીની તમામ સ્થિતિઓ સંપૂર્ણ સ્થિર રાખો."
        },
        "tags": [
          {
            "en": "Falsifiability",
            "hi": "मिथ्याकरणीयता",
            "gu": "કસોટીક્ષમતા"
          },
          {
            "en": "Null Hypothesis H₀",
            "hi": "शून्य परिकल्पना H₀",
            "gu": "શૂન્ય પરિકલ્પના H₀"
          },
          {
            "en": "Control Group",
            "hi": "नियंत्रण समूह",
            "gu": "કંટ્રોલ ગ્રૂપ"
          },
          {
            "en": "Single Variable",
            "hi": "एकल चर",
            "gu": "એક જ ચલ"
          },
          {
            "en": "Statistical Proof",
            "hi": "सांख्यिकीय प्रमाण",
            "gu": "આંકડાકીય સાબિતી"
          },
          {
            "en": "Popper Rigor",
            "hi": "पॉपरियन सटीकता",
            "gu": "પોપેરિયન ચોકસાઈ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "hypothesis_flask",
        "title": {
          "en": "4 Steps to Conduct Rigorous Hypothesis Testing",
          "hi": "कठोर परिकल्पना परीक्षण करने के 4 चरण",
          "gu": "પરિકલ્પના પરીક્ષણ કરવાના 4 પગલાં"
        },
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next.",
        "steps": [
          {
            "step": 1,
            "correct_order": 1,
            "text": {
              "en": "Formulate a clear 'If [Independent Variable changes], then [Dependent Variable changes]' prediction.",
              "hi": "एक स्पष्ट 'यदि [स्वतंत्र चर बदलेगा], तो [आश्रित चर बदलेगा]' भविष्यवाणी बनाएं।",
              "gu": "સ્પષ્ટ 'જો [સ્વતંત્ર ચલ બદલાશે], તો [આધારિત ચલ બદલાશે]' આગાહી બનાવો."
            }
          },
          {
            "step": 2,
            "correct_order": 2,
            "text": {
              "en": "State the Null Hypothesis (H₀): that the independent variable has ZERO measurable effect.",
              "hi": "शून्य परिकल्पना (H₀) तय करें: कि स्वतंत्र चर का कोई मापने योग्य प्रभाव नहीं है।",
              "gu": "શૂન્ય પરિકલ્પના (H₀) નક્કી કરો: કે સ્વતંત્ર ચલની કોઈ માપી શકાય તેવી અસર નથી."
            }
          },
          {
            "step": 3,
            "correct_order": 3,
            "text": {
              "en": "Set up a test group and an identical control group, strictly locking all other confounding variables.",
              "hi": "अन्य सभी चरों को स्थिर रखते हुए एक परीक्षण समूह और एक समान नियंत्रण समूह तैयार करें।",
              "gu": "બાકીના તમામ ચલ સ્થિર રાખી એક પ્રયોગ જૂથ અને સમાન કંટ્રોલ જૂથ તૈયાર કરો."
            }
          },
          {
            "step": 4,
            "correct_order": 4,
            "text": {
              "en": "Collect quantitative data, check for statistical significance, and decide whether to reject H₀.",
              "hi": "मात्रात्मक डेटा एकत्र करें, सांख्यिकीय महत्व की जांच करें और तय करें कि क्या H₀ को खारिज करना है।",
              "gu": "આંકડાકીય ડેટા એકત્ર કરો, ચોકસાઈ તપાસો અને નક્કી કરો કે H₀ ને નકારવી કે નહીં."
            }
          }
        ]
      },
      {
        "type": "daily_mission",
        "icon": "hypothesis_flask",
        "title": {
          "en": "Study Technique Falsification Trial",
          "hi": "अध्ययन तकनीक मिथ्याकरण प्रयोग",
          "gu": "અધ્યયન પદ્ધતિ ચકાસણી પ્રયોગ"
        },
        "mission_text": {
          "en": "Formulate a testable study hypothesis today (e.g., 'Using 2-minute active recall after reading a page increases quiz score vs passive rereading'). Run a 2-page controlled trial to test H₀!",
          "hi": "आज एक परीक्षण योग्य अध्ययन परिकल्पना बनाएं (जैसे '1 पेज पढ़ने के बाद 2 मिनट का एक्टिव रिकॉल टेस्ट स्कोर बढ़ाता है बनाम दोबारा पढ़ना')। 2 पेज पर इसका परीक्षण करें!",
          "gu": "આજે એક કસોટીક્ષમ પરિકલ્પના બનાવો (જેમ કે 'પાનું વાંચ્યા પછી ૨ મિનિટ એક્ટિવ રિકોલ કરવાથી ટેસ્ટ સ્કોર વધે છે')। ૨ પાના પર આનો પ્રયોગ કરી ચકાસો!"
        },
        "commitment_button_text": {
          "en": "I will use Hypothesis Testing to verify claims with data!",
          "hi": "मैं डेटा के साथ दावों को सत्यापित करने के लिए परिकल्पना परीक्षण का उपयोग करूँगा!",
          "gu": "હું ડેટા સાથે દાવાઓની ચકાસણી કરવા પરિકલ્પના પરીક્ષણ વાપરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  }
];
