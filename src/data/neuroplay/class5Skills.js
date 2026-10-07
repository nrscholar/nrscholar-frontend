/**
 * NeuroPlay - Class 5 Skills (Ages 9–11)
 * Batch 1: Mental Maths, Calculation & Memory Strategies
 * Consolidated module with embedded multi-language support (EN, HI, GU).
 */

export const class5Skills = [
  {
    id: "skill_c5_02",
    methodNumber: 2,
    classLevel: 5,
    category: {
      en: "Mental Maths / Calculation Strategies",
      hi: "मानसिक गणित / गणना रणनीतियाँ",
      gu: "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    title: {
      en: "Vedic Mathematics (Vertically & Crosswise)",
      hi: "वैदिक गणित (ऊर्ध्व-तिर्यग्भ्यां / क्रॉस मल्टीप्लाई)",
      gu: "વૈદિક ગણિત (ઊર્ધ્વ-તિર્યગ્ભ્યામ્ / ક્રોસ ગુણાકાર)"
    },
    description: {
      en: "Multiply 2-digit numbers in a single mental line using the criss-cross lightning pattern.",
      hi: "क्रिस-क्रॉस पैटर्न का उपयोग करके 2-अंकों की संख्याओं का एक ही पंक्ति में मानसिक गुणा करें।",
      gu: "ક્રિસ-ક્રોસ પેટર્નનો ઉપયોગ કરીને ૨-અંકની સંખ્યાઓનો એક જ લીટીમાં માનસિક ગુણાકાર કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "vedic_sutra",
        title: {
          en: "Writing 4 Long Lines for a Simple 2-Digit Multiplication?",
          hi: "सरल 2-अंकीय गुणा के लिए 4 लंबी पंक्तियाँ लिख रहे हैं?",
          gu: "સરળ ૨-અંકના ગુણાકાર માટે ૪ લાંબી લીટીઓ લખવી પડે છે?"
        },
        pain_quotes: [
          {
            en: "Long column multiplication takes forever and carryover errors ruin my answers!",
            hi: "पारंपरिक गुणा में बहुत समय लगता है और हासिल जोड़ने की गलती से पूरा उत्तर गलत हो जाता है!",
            gu: "પરંપરાગત ગુણાકારમાં બહુ સમય બગડે છે અને વદ્દી ઉમેરવાની ભૂલથી આખો દાખલો ખોટો પડે છે!"
          },
          {
            en: "By the time I finish 23 × 14, my classmates are already on the next page!",
            hi: "जब तक मैं 23 × 14 पूरा करता हूँ, मेरे सहपाठी अगले पन्ने पर पहुँच चुके होते हैं!",
            gu: "હું ૨૩ × ૧૪ પૂરું કરું ત્યાં સુધીમાં તો બીજા બાળકો આગળના પાને પહોંચી જાય છે!"
          }
        ],
        body: {
          en: "Traditional column multiplication forces you to write multiple partial products before adding. The Vedic 'Vertically & Crosswise' (Urdhva-Tiryagbhyam) sutra computes units, cross-products, and tens in 1 single line!",
          hi: "पारंपरिक विधि में आपको जोड़ने से पहले कई पंक्तियाँ लिखनी पड़ती हैं। वैदिक 'ऊर्ध्व-तिर्यग्भ्यां' सूत्र केवल 1 पंक्ति में इकाई, क्रॉस-उत्पाद और दहाई की गणना कर देता है!",
          gu: "પરંપરાગત રીતમાં સરવાળો કરતાં પહેલાં ઘણી લીટીઓ લખવી પડે છે. વૈદિક 'ઊર્ધ્વ-તિર્યગ્ભ્યામ્' સૂત્ર માત્ર ૧ જ લીટીમાં એકમ, ક્રોસ-ગુણાકાર અને દશકની ગણતરી કરી દે છે!"
        },
        key_takeaway: {
          en: "Criss-Cross Rule: Multiply Right (Units) → Cross & Add → Multiply Left (Tens)!",
          hi: "क्रिस-क्रॉस नियम: दायाँ गुणा (इकाई) → क्रॉस गुणा व जोड़ → बायाँ गुणा (दहाई)!",
          gu: "ક્રિસ-ક્રોસ નિયમ: જમણો ગુણાકાર (એકમ) → ક્રોસ ગુણાકાર અને સરવાળો → ડાબો ગુણાકાર (દશક)!"
        }
      },
      {
        type: "relatable_story",
        icon: "vedic_sutra",
        title: {
          en: "Meet Kabir",
          hi: "कबीर से मिलें",
          gu: "મળો કબીરને"
        },
        story: {
          en: "Kabir took 2 minutes to solve 21 × 13 using long rows. His Vedic math mentor showed him the 3-step lightning shortcut: 1) Right: 1×3=3; 2) Cross: (2×3)+(1×1)=7; 3) Left: 2×1=2. Answer: 273 in 4 seconds!",
          hi: "कबीर को 21 × 13 हल करने में 2 मिनट लगते थे। उनके शिक्षक ने 3-चरणीय वैदिक ट्रिक सिखाई: 1) दायाँ: 1×3=3; 2) क्रॉस: (2×3)+(1×1)=7; 3) बायाँ: 2×1=2। उत्तर: 4 सेकंड में 273!",
          gu: "કબીરને ૨૧ × ૧૩ ઉકેલવામાં ૨ મિનિટ થતી હતી. તેના શિક્ષકે ૩-પગલાંવાળી વૈદિક ટ્રીક શીખવી: ૧) જમણે: ૧×૩=૩; ૨) ક્રોસ: (૨×૩)+(૧×૧)=૭; ૩) ડાબે: ૨×૧=૨. જવાબ: ૪ સેકન્ડમાં ૨૭૩!"
        },
        insight_box: {
          en: "3-Step Sutra: | (Right vertical) → X (Cross & add) → | (Left vertical).",
          hi: "3-चरणीय सूत्र: | (दायाँ लंबवत) → X (क्रॉस गुणा और जोड़) → | (बायाँ लंबवत)।",
          gu: "૩-પગલાંનું સૂત્ર: | (જમણો ઊભો) → X (ક્રોસ ગુણાકાર અને સરવાળો) → | (ડાબો ઊભો)."
        }
      },
      {
        type: "method_concept_check",
        icon: "vedic_sutra",
        question: {
          en: "To multiply 31 × 12 using Vedic Vertically & Crosswise, what is the middle cross-product step?",
          hi: "31 × 12 को वैदिक विधि से हल करते समय बीच का क्रॉस-उत्पाद चरण क्या होगा?",
          gu: "૩૧ × ૧૨ ને વૈદિક પદ્ધતિથી ઉકેલતી વખતે વચ્ચેનું ક્રોસ-ગુણાકારનું પગલું શું થશે?"
        },
        option_a: {
          en: "Multiply only 3 × 1 = 3.",
          hi: "केवल 3 × 1 = 3 का गुणा करें।",
          gu: "માત્ર ૩ × ૧ = ૩ નો ગુણાકાર કરવો."
        },
        option_b: {
          en: "Cross multiply and add: (3 × 2) + (1 × 1) = 6 + 1 = 7.",
          hi: "क्रॉस गुणा करके जोड़ें: (3 × 2) + (1 × 1) = 6 + 1 = 7।",
          gu: "ક્રોસ ગુણાકાર કરી સરવાળો કરો: (૩ × ૨) + (૧ × ૧) = ૬ + ૧ = ૭."
        },
        feedback: {
          en: "Correct! The middle digit comes from the criss-cross sum: (3×2) + (1×1) = 7.",
          hi: "सही! बीच का अंक क्रॉस गुणा के योग से आता है: (3×2) + (1×1) = 7।",
          gu: "સાચું! વચ્ચેનો અંક ક્રોસ ગુણાકારના સરવાળામાંથી આવે છે: (૩×૨) + (૧×૧) = ૭."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "vedic_sutra",
        question: {
          en: "Calculate 31 × 23 in one line using the Vedic criss-cross sutra. What is the final product?",
          hi: "वैदिक क्रिस-क्रॉस सूत्र का उपयोग करके 31 × 23 का मान एक पंक्ति में ज्ञात करें:",
          gu: "વૈદિક ક્રિસ-ક્રોસ સૂત્રનો ઉપયોગ કરીને ૩૧ × ૨૩ નો જવાબ એક જ લીટીમાં શોધો:"
        },
        options: [
          {
            id: "A",
            text: {
              en: "613",
              hi: "613",
              gu: "613"
            }
          },
          {
            id: "B",
            text: {
              en: "713 (Right: 1×3=3; Cross: 3×3+1×2=11 [write 1, carry 1]; Left: 3×2+1=7)",
              hi: "713 (दायाँ: 1×3=3; क्रॉस: 3×3+1×2=11 [लिखें 1, हासिल 1]; बायाँ: 3×2+1=7)",
              gu: "713 (જમણે: ૧×૩=૩; ક્રોસ: ૩×૩+૧×૨=૧૧ [૧ લખો, ૧ વદ્દી]; ડાબે: ૩×૨+૧=૭)"
            }
          },
          {
            id: "C",
            text: {
              en: "723",
              hi: "723",
              gu: "723"
            }
          },
          {
            id: "D",
            text: {
              en: "813",
              hi: "813",
              gu: "813"
            }
          }
        ],
        correct_option: "B",
        feedback: {
          en: "Brilliant! Step 1: 1×3=3. Step 2: (3×3)+(1×2)=11 (write 1, carry 1). Step 3: (3×2)+1=7. Total = 713!",
          hi: "शानदार! चरण 1: 1×3=3। चरण 2: (3×3)+(1×2)=11 (1 लिखें, हासिल 1)। चरण 3: (3×2)+1=7। कुल = 713!",
          gu: "ઉત્તમ! પગલું ૧: ૧×૩=૩. પગલું ૨: (૩×૩)+(૧×૨)=૧૧ (૧ લખો, ૧ વદ્દી). પગલું ૩: (૩×૨)+૧=૭. કુલ = ૭૧૩!"
        }
      },
      {
        type: "strategy_pills",
        icon: "vedic_sutra",
        title: {
          en: "Criss-Cross Superpower",
          hi: "क्रिस-क्रॉस सुपरपावर",
          gu: "ક્રિસ-ક્રોસ સુપરપાવર"
        },
        body: {
          en: "Multiply straight down on the ends, criss-cross in the middle.",
          hi: "किनारों पर सीधा गुणा करें और बीच में क्रॉस गुणा करके जोड़ें।",
          gu: "છેડા પર સીધો ગુણાકાર કરો અને વચ્ચે ક્રોસ ગુણાકાર કરી સરવાળો કરો."
        },
        tags: [
          { en: "Right Vertical", hi: "दायाँ लंबवत", gu: "જમણો ઊભો" },
          { en: "Cross Multiply", hi: "क्रॉस गुणा", gu: "ક્રોસ ગુણાકાર" },
          { en: "Add Cross Sums", hi: "क्रॉस योग जोड़ें", gu: "ક્રોસ સરવાળો" },
          { en: "Left Vertical", hi: "बायाँ लंबवत", gu: "ડાબો ઊભો" },
          { en: "Carry Forward", hi: "हासिल जोड़ें", gu: "વદ્દી ઉમેરો" },
          { en: "One-Line Math", hi: "एक-पंक्ति गणना", gu: "એક લીટી ગણતરી" }
        ]
      },
      {
        type: "action_checklist",
        icon: "vedic_sutra",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Multiply the rightmost units digits vertically and write the last digit.",
              hi: "दाईं ओर के इकाई अंकों का लंबवत गुणा करें और अंतिम अंक लिखें।",
              gu: "જમણી બાજુના એકમના અંકોનો ઊભો ગુણાકાર કરો અને છેલ્લો અંક લખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Cross-multiply outer and inner digits, add the products, plus any carry.",
              hi: "क्रॉस गुणा करें, दोनों उत्पादों को जोड़ें और पिछली हासिल जोड़ें।",
              gu: "ક્રોસ ગુણાકાર કરો, બંને પરિણામોનો સરવાળો કરો અને આગળની વદ્દી ઉમેરો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Write the middle digit and carry forward the tens value if any.",
              hi: "बीच का अंक लिखें और यदि दहाई का अंक बचे तो उसे हासिल के रूप में आगे ले जाएं।",
              gu: "વચ્ચેનો અંક લખો અને જો દશકનો અંક વધે તો તેને વદ્દી તરીકે આગળ લઈ જાઓ."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Multiply the leftmost tens digits vertically and add the final carry.",
              hi: "बाईं ओर के दहाई अंकों का लंबवत गुणा करें और अंतिम हासिल जोड़कर लिखें।",
              gu: "ડાબી બાજુના દશકના અંકોનો ઊભો ગુણાકાર કરો અને છેલ્લી વદ્દી ઉમેરી જવાબ પૂરો કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "vedic_sutra",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Solve 3 multiplication problems (like 22 × 14, 32 × 21, 41 × 12) mentally in 1 line using the criss-cross sutra!",
          hi: "वैदिक क्रिस-क्रॉस सूत्र का उपयोग करके 1 ही पंक्ति में 3 गुणा सवाल (जैसे 22 × 14, 32 × 21, 41 × 12) हल करें!",
          gu: "વૈદિક ક્રિસ-ક્રોસ સૂત્રનો ઉપયોગ કરીને ૧ જ લીટીમાં ૩ ગુણાકારના દાખલા (જેમ કે ૨૨ × ૧૪, ૩૨ × ૨૧, ૪૧ × ૧૨) ઉકેલો!"
        },
        commitment_button_text: {
          en: "I will master Vedic criss-cross multiplication!",
          hi: "मैं वैदिक क्रिस-क्रॉस गुणा में महारत हासिल करूँगा!",
          gu: "હું વૈદિક ક્રિસ-ક્રોસ ગુણાકારમાં નિપુણ બનીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_07",
    methodNumber: 7,
    classLevel: 5,
    category: {
      en: "Mental Maths / Calculation Strategies",
      hi: "मानसिक गणित / गणना रणनीतियाँ",
      gu: "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    title: {
      en: "Napier's Bones Concepts (Lattice Strips)",
      hi: "नेपियर्स बोन्स (लैटिस स्ट्रिप्स / विकर्ण जोड़)",
      gu: "નેપિયર્સ બોન્સ (લેટિસ પટ્ટીઓ / વિકર્ણ સરવાળો)"
    },
    description: {
      en: "Break multi-digit multiplication into easy single-digit products separated into tens/units diagonal tracks.",
      hi: "विकर्ण पट्टियों की मदद से बड़े गुणा को आसान एकल-अंकीय गुणा और विकर्ण जोड़ में बदलें।",
      gu: "વિકર્ણ પટ્ટીઓની મદદથી મોટા ગુણાકારને સરળ એક-અંકના ગુણાકાર અને વિકર્ણ સરવાળામાં ફેરવો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "lattice_bones",
        title: {
          en: "Confused by Mid-Calculation Carries in Big Multiplication?",
          hi: "बड़े गुणा के दौरान बीच में हासिल जोड़ने से उलझन होती है?",
          gu: "મોટા ગુણાકાર વચ્ચે વદ્દીઓ ઉમેરવામાં ગૂંચવણ થાય છે?"
        },
        pain_quotes: [
          {
            en: "When multiplying 468 × 7, I forget the carry numbers while multiplying the next digit!",
            hi: "468 × 7 करते समय अगले अंक का गुणा करते हुए मैं पिछली हासिल भूल जाता हूँ!",
            gu: "૪૬૮ × ૭ કરતી વખતે આગળના અંકનો ગુણાકાર કરતાં જૂની વદ્દી ભૂલાઈ જાય છે!"
          },
          {
            en: "Mixing up multiplication and addition in the middle of a problem causes big blunders!",
            hi: "सवाल के बीच में गुणा और जोड़ को मिलाने से बड़ी गलतियाँ हो जाती हैं!",
            gu: "દાખલાની વચ્ચે ગુણાકાર અને સરવાળો ભેગા થઈ જવાથી મોટી ભૂલો થાય છે!"
          }
        ],
        body: {
          en: "John Napier invented 'Bones' (lattice rods) to split multiplication and addition into two separate, stress-free stages. Write all single-digit products first, then slide down the diagonal channels!",
          hi: "जॉन नेपियर ने गुणा और जोड़ को दो अलग-अलग सरल चरणों में बांटने के लिए 'नेपियर्स बोन्स' का आविष्कार किया। पहले सभी एकल उत्पाद लिखें, फिर विकर्ण पट्टियों में जोड़ें!",
          gu: "જોન નેપિયરે ગુણાકાર અને સરવાળાને બે અલગ અને સરળ તબક્કામાં વહેંચવા 'નેપિયર્સ બોન્સ' ની શોધ કરી. પહેલાં બધા ગુણાકાર લખો, પછી ત્રાંસી પટ્ટીઓમાં સરવાળો કરો!"
        },
        key_takeaway: {
          en: "Napier's Rule: Multiply first into split [Tens | Units] boxes, then add along diagonals!",
          hi: "नेपियर नियम: पहले [दहाई | इकाई] बॉक्स में गुणा लिखें, फिर विकर्ण के साथ जोड़ें!",
          gu: "નેપિયર નિયમ: પહેલાં [દશક | એકમ] ખાનામાં ગુણાકાર લખો, પછી ત્રાંસી લીટીમાં સરવાળો કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "lattice_bones",
        title: {
          en: "Meet Riya",
          hi: "रिया से मिलें",
          gu: "મળો રિયાને"
        },
        story: {
          en: "Riya always fumbled with 46 × 7 because carrying 4 while doing 4×7 confused her. Using Napier's strips: 4×7=[2|8] and 6×7=[4|2]. The diagonal channels gave: 2, (8+4=12 → carry 1 to 2 = 3), 2. Answer: 322 cleanly!",
          hi: "रिया 46 × 7 में हमेशा उलझ जाती थी क्योंकि 4×7 करते समय हासिल 4 जोड़ना कठिन लगता था। नेपियर स्ट्रिप्स से: 4×7=[2|8] और 6×7=[4|2]। विकर्ण जोड़ से: 322 बिना किसी भ्रम के मिल गया!",
          gu: "રિયા ૪૬ × ૭ માં હંમેશાં ગૂંચવાઈ જતી કારણ કે ૪×૭ કરતી વખતે વદ્દી ૪ ઉમેરવામાં ભૂલ થતી. નેપિયર પટ્ટીથી: ૪×૭=[૨|૮] અને ૬×૭=[૪|૨]. ત્રાંસા સરવાળાથી સીધો જવાબ ૩૨૨ મળી ગયો!"
        },
        insight_box: {
          en: "Separation Principle: Do ALL multiplications first, then do ALL additions along the diagonal slide.",
          hi: "विभाजन सिद्धांत: पहले सारे गुणा पूरे करें, फिर विकर्ण ढलान पर सारे जोड़ करें।",
          gu: "વિભાજન સિદ્ધાંત: પહેલાં બધા ગુણાકાર પતાવો, પછી ત્રાંસી પટ્ટી પર બધા સરવાળા કરો."
        }
      },
      {
        type: "method_concept_check",
        icon: "lattice_bones",
        question: {
          en: "In a Napier lattice box for 8 × 7, how is 56 split across the diagonal slash (/)?",
          hi: "8 × 7 के लिए नेपियर लैटिस बॉक्स में 56 को विकर्ण रेखा (/) पर कैसे लिखा जाता है?",
          gu: "૮ × ૭ માટે નેપિયર લેટિસ બોક્સમાં ૫૬ ને ત્રાંસી રેખા (/) પર કેવી રીતે લખવામાં આવે છે?"
        },
        option_a: {
          en: "Write 56 in the top corner.",
          hi: "ऊपरी कोने में 56 लिखें।",
          gu: "ઉપરના ખૂણામાં ૫૬ લખો."
        },
        option_b: {
          en: "Top-left triangle gets 5 (Tens) and bottom-right triangle gets 6 (Units).",
          hi: "ऊपर-बाएँ त्रिभुज में 5 (दहाई) और नीचे-दाएँ त्रिभुज में 6 (इकाई)।",
          gu: "ઉપર-ડાબા ત્રિકોણમાં ૫ (દશક) અને નીચે-જમણા ત્રિકોણમાં ૬ (એકમ)."
        },
        feedback: {
          en: "Correct! The diagonal slash splits the product into Tens (top-left) and Units (bottom-right).",
          hi: "सही! विकर्ण रेखा उत्पाद को दहाई (ऊपर-बाएँ) और इकाई (नीचे-दाएँ) में बांटती है।",
          gu: "સાચું! ત્રાંસી લીટી ગુણાકારને દશક (ઉપર-ડાબે) અને એકમ (નીચે-જમણે) માં વહેંચે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "lattice_bones",
        question: {
          en: "Multiply 53 × 6 using Napier's strips: \n5 × 6 = [3|0] and 3 × 6 = [1|8]. \nAdding diagonals: Units = 8, Tens diagonal = 0 + 1 = 1, Hundreds = 3. What is the product?",
          hi: "नेपियर स्ट्रिप्स का उपयोग करके 53 × 6 का मान ज्ञात करें: \n5 × 6 = [3|0] और 3 × 6 = [1|8]। \nविकर्ण जोड़: इकाई = 8, दहाई = 0 + 1 = 1, सैकड़ा = 3। कुल गुणनफल क्या है?",
          gu: "નેપિયર પટ્ટીથી ૫૩ × ૬ નો ગુણાકાર કરો: \n૫ × ૬ = [૩|૦] અને ૩ × ૬ = [૧|૮]. \nત્રાંસો સરવાળો: એકમ = ૮, દશક = ૦ + ૧ = ૧, સો = ૩. અંતિમ જવાબ શું થશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "318",
              hi: "318",
              gu: "318"
            }
          },
          {
            id: "B",
            text: {
              en: "308",
              hi: "308",
              gu: "308"
            }
          },
          {
            id: "C",
            text: {
              en: "328",
              hi: "328",
              gu: "328"
            }
          },
          {
            id: "D",
            text: {
              en: "381",
              hi: "381",
              gu: "381"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! Reading the diagonal channels from left to right gives 3, 1, 8 = 318!",
          hi: "बिल्कुल सही! विकर्ण चैनलों को बाएँ से दाएँ पढ़ने पर 3, 1, 8 = 318 प्राप्त होता है!",
          gu: "એકદમ સાચું! ત્રાંસી પટ્ટીઓને ડાબેથી જમણે વાંચતાં ૩, ૧, ૮ = ૩૧૮ મળે છે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "lattice_bones",
        title: {
          en: "Napier Bones Superpower",
          hi: "नेपियर्स बोन्स सुपरपावर",
          gu: "નેપિયર્સ બોન્સ સુપરપાવર"
        },
        body: {
          en: "Split tens and units into diagonal channels to eliminate carryover confusion.",
          hi: "हासिल के भ्रम को मिटाने के लिए दहाई और इकाई को विकर्ण चैनलों में विभाजित करें।",
          gu: "વદ્દીની ગૂંચવણ દૂર કરવા દશક અને એકમને ત્રાંસી પટ્ટીઓમાં વિભાજિત કરો."
        },
        tags: [
          { en: "Lattice Grid", hi: "लैटिस ग्रिड", gu: "લેટિસ ગ્રીડ" },
          { en: "Tens-Units Split", hi: "दहाई-इकाई विभाजन", gu: "દશક-એકમ ભાગ" },
          { en: "Diagonal Tracks", hi: "विकर्ण ट्रैक", gu: "ત્રાંસા ટ્રેક" },
          { en: "Zero Stress", hi: "तनावमुक्त गणना", gu: "ચિંતામુક્ત ગણતરી" },
          { en: "Slide & Add", hi: "स्लाइड व जोड़", gu: "સ્લાઇડ અને સરવાળો" },
          { en: "Big Multiplier", hi: "बड़ा गुणा", gu: "મોટો ગુણાકાર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "lattice_bones",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Draw the grid boxes with a diagonal slash (/) from top-right to bottom-left.",
              hi: "ऊपर-दाएँ से नीचे-बाएँ विकर्ण रेखा (/) खींचकर ग्रिड बॉक्स बनाएं।",
              gu: "ઉપર-જમણેથી નીચે-ડાબે ત્રાંસી લીટી (/) દોરીને ગ્રીડ બોક્સ બનાવો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Fill each box with single-digit multiplication (Tens above slash, Units below).",
              hi: "प्रत्येक बॉक्स में एकल गुणा भरें (रेखा के ऊपर दहाई, नीचे इकाई)।",
              gu: "દરેક બોક્સમાં ગુણાકાર લખો (લીટીની ઉપર દશક, નીચે એકમ)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Add the numbers inside each diagonal channel starting from bottom-right.",
              hi: "नीचे-दाएँ कोने से शुरू करके प्रत्येक विकर्ण चैनल के अंकों को जोड़ें।",
              gu: "નીચે-જમણા ખૂણેથી શરૂ કરીને દરેક ત્રાંસી પટ્ટીના અંકોનો સરવાળો કરો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Carry any two-digit sums to the next diagonal left, then read the answer digits.",
              hi: "दोहरे अंकों के जोड़ की हासिल को बाईं विकर्ण में जोड़ें और अंतिम उत्तर पढ़ें।",
              gu: "બે અંકના સરવાળાની વદ્દીને ડાબી પટ્ટીમાં ઉમેરો અને અંતિમ જવાબ વાંચો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "lattice_bones",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Draw a 2-box Napier strip on paper and solve 64 × 8 using diagonal channel addition!",
          hi: "कागज पर 2-बॉक्स की नेपियर पट्टी बनाएं और विकर्ण जोड़ से 64 × 8 हल करें!",
          gu: "કાગળ પર ૨-ખાનાવાળી નેપિયર પટ્ટી દોરો અને ત્રાંસા સરવાળાથી ૬૪ × ૮ ઉકેલો!"
        },
        commitment_button_text: {
          en: "I will use Napier's lattice tracks!",
          hi: "मैं नेपियर्स लैटिस ट्रैक का उपयोग करूँगा!",
          gu: "હું નેપિયર્સ લેટિસ ટ્રેકનો ઉપયોગ કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_16",
    methodNumber: 16,
    classLevel: 5,
    category: {
      en: "Mental Maths / Calculation Strategies",
      hi: "मानसिक गणित / गणना रणनीतियाँ",
      gu: "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    title: {
      en: "Near-Base Calculation (Nikhilam Base 100)",
      hi: "निकट-आधार गणना (निखिलं आधार 100)",
      gu: "નજીક-આધાર ગણતરી (નિખિલમ્ આધાર ૧૦૦)"
    },
    description: {
      en: "Multiply numbers close to 100 (like 96 × 97 or 104 × 103) instantly using deficiency and surplus differences.",
      hi: "100 के करीब की संख्याओं (जैसे 96 × 97 या 104 × 103) का अंतर विधि से तुरंत मानसिक गुणा करें।",
      gu: "૧૦૦ ની નજીકની સંખ્યાઓ (જેમ કે ૯૬ × ૯૭ અથવા ૧૦૪ × ૧૦૩) નો તફાવત પદ્ધતિથી ઝડપી માનસિક ગુણાકાર કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "magnet_base",
        title: {
          en: "Sweating Over 98 × 94 in Standard Column Math?",
          hi: "98 × 94 को लंबे पारंपरिक तरीके से गुणा करने में पसीना छूटता है?",
          gu: "૯૮ × ૯૪ નો લાંબી રીતે ગુણાકાર કરવામાં થાકી જાઓ છો?"
        },
        pain_quotes: [
          {
            en: "Multiplying big numbers in the 90s takes 6 lines of pencil scratching!",
            hi: "90 के दशक की बड़ी संख्याओं का गुणा करने में 6 पंक्तियाँ भर जाती हैं!",
            gu: "૯૦ ની આસપાસની મોટી સંખ્યાઓનો ગુણાકાર કરવામાં અડધું પેજ ભરાઈ જાય છે!"
          },
          {
            en: "One subtraction error in partial products and all that hard work is wasted!",
            hi: "गुणा की बीच की एक छोटी सी गलती पूरी मेहनत पर पानी फेर देती है!",
            gu: "વચ્ચે એક નાની બાદબાકીની ભૂલ થાય તો આખી મહેનત પાણીમાં જાય છે!"
          }
        ],
        body: {
          en: "Numbers near 100 have tiny 'deficiencies' (e.g. 96 is -4, 97 is -3). Vedic Base Math turns giant 2-digit multiplication into simple single-digit subtraction and multiplication!",
          hi: "100 के पास की संख्याओं में बहुत छोटा अंतर होता है (जैसे 96 में -4, 97 में -3)। आधार विधि बड़े गुणा को केवल 1 सरल घटाव और 1 छोटे गुणा में बदल देती है!",
          gu: "૧૦૦ ની નજીકની સંખ્યાઓમાં ખૂબ નાનો તફાવત હોય છે (જેમ કે ૯૬ માં -૪, ૯૭ માં -૩). આધાર પદ્ધતિ મોટા ગુણાકારને માત્ર ૧ સરળ બાદબાકી અને ૧ નાના ગુણાકારમાં ફેરવી દે છે!"
        },
        key_takeaway: {
          en: "Base 100 Rule: Left Part = Cross-Subtract Deficiencies; Right Part = Multiply Deficiencies!",
          hi: "आधार 100 नियम: बायाँ भाग = क्रॉस घटाव; दायाँ भाग = अंतर का गुणा!",
          gu: "આધાર ૧૦૦ નિયમ: ડાબો ભાગ = ક્રોસ બાદબાકી; જમણો ભાગ = તફાવતનો ગુણાકાર!"
        }
      },
      {
        type: "relatable_story",
        icon: "magnet_base",
        title: {
          en: "Meet Aryan",
          hi: "आर्यन से मिलें",
          gu: "મળો આર્યનને"
        },
        story: {
          en: "Aryan saw 96 × 97 on a speed test. He spotted Base 100: 96 is (-4) and 97 is (-3). Left side: 96 - 3 = 93. Right side: (-4) × (-3) = 12. He wrote 9312 in 3 seconds while others were still setting up columns!",
          hi: "आर्यन ने टेस्ट में 96 × 97 देखा। उसने आधार 100 पहचाना: 96 है (-4) और 97 है (-3)। बायाँ भाग: 96 - 3 = 93। दायाँ भाग: (-4) × (-3) = 12। उसने 3 सेकंड में 9312 लिख दिया!",
          gu: "આર્યને ટેસ્ટમાં ૯૬ × ૯૭ જોયું. તેણે આધાર ૧૦૦ પકડ્યો: ૯૬ છે (-૪) અને ૯૭ છે (-૩). ડાબો ભાગ: ૯૬ - ૩ = ૯૩. જમણો ભાગ: (-૪) × (-૩) = ૧૨. તેણે ૩ સેકન્ડમાં ૯૩૧૨ લખી દીધું!"
        },
        insight_box: {
          en: "Cross Magic: (96 - 3) and (97 - 4) BOTH give 93! You can cross-subtract either way.",
          hi: "क्रॉस जादू: (96 - 3) और (97 - 4) दोनों 93 ही देते हैं! आप किसी भी तरफ से घटा सकते हैं।",
          gu: "ક્રોસ જાદુ: (૯૬ - ૩) અને (૯૭ - ૪) બંને ૯૩ જ આપે છે! તમે કોઈપણ બાજુથી બાદ કરી શકો છો."
        }
      },
      {
        type: "method_concept_check",
        icon: "magnet_base",
        question: {
          en: "To multiply 98 × 95 using Near-Base 100, what are their deficiencies from 100?",
          hi: "98 × 95 को आधार 100 विधि से हल करते समय 100 से उनका अंतर (कमी) क्या होगा?",
          gu: "૯૮ × ૯૫ ને આધાર ૧૦૦ પદ્ધતિથી ઉકેલતી વખતે ૧૦૦ થી તેમની ખામી (તફાવત) શું થશે?"
        },
        option_a: {
          en: "-8 and -5.",
          hi: "-8 और -5।",
          gu: "-૮ અને -૫."
        },
        option_b: {
          en: "-2 and -5 (98 is 100-2, 95 is 100-5).",
          hi: "-2 and -5 (98 है 100-2, 95 है 100-5)।",
          gu: "-૨ અને -૫ (૯૮ એટલે ૧૦૦-૨, ૯૫ એટલે ૧૦૦-૫)."
        },
        feedback: {
          en: "Correct! 98 is 2 below 100 (-2) and 95 is 5 below 100 (-5).",
          hi: "सही! 98 में 100 से 2 कम (-2) है और 95 में 100 से 5 कम (-5) है।",
          gu: "સાચું! ૯૮ માં ૧૦૦ થી ૨ ઓછા (-૨) છે અને ૯૫ માં ૧૦૦ થી ૫ ઓછા (-૫) છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "magnet_base",
        question: {
          en: "Solve 94 × 98 using Base 100: \nDeficiencies: 94 is (-6), 98 is (-2). \nLeft: 94 - 2 = 92. Right: (-6) × (-2) = 12. What is the product?",
          hi: "आधार 100 विधि से 94 × 98 का मान ज्ञात करें: \nअंतर: 94 है (-6), 98 है (-2)। \nबायाँ: 94 - 2 = 92। दायाँ: (-6) × (-2) = 12। गुणनफल क्या है?",
          gu: "આધાર ૧૦૦ પદ્ધતિથી ૯૪ × ૯૮ નો જવાબ શોધો: \nતફાવત: ૯૪ છે (-૬), ૯૮ છે (-૨). \nડાબે: ૯૪ - ૨ = ૯૨. જમણે: (-૬) × (-૨) = ૧૨. અંતિમ ગુણાકાર શું થશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "9212",
              hi: "9212",
              gu: "9212"
            }
          },
          {
            id: "B",
            text: {
              en: "9112",
              hi: "9112",
              gu: "9112"
            }
          },
          {
            id: "C",
            text: {
              en: "9208",
              hi: "9208",
              gu: "9208"
            }
          },
          {
            id: "D",
            text: {
              en: "9312",
              hi: "9312",
              gu: "9312"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Genius! Left side: 94 - 2 = 92. Right side: 6 × 2 = 12. Combined = 9212!",
          hi: "शानदार! बायाँ भाग: 94 - 2 = 92। दायाँ भाग: 6 × 2 = 12। संयुक्त उत्तर = 9212!",
          gu: "અદ્ભુત! ડાબો ભાગ: ૯૪ - ૨ = ૯૨. જમણો ભાગ: ૬ × ૨ = ૧૨. ભેગા કરતાં = ૯૨૧૨!"
        }
      },
      {
        type: "strategy_pills",
        icon: "magnet_base",
        title: {
          en: "Base 100 Magnet Superpower",
          hi: "आधार 100 मैग्नेट सुपरपावर",
          gu: "આધાર ૧૦૦ મેગ્નેટ સુપરપાવર"
        },
        body: {
          en: "Find differences from 100, cross-subtract for left, multiply for right.",
          hi: "100 से अंतर निकालें, बाएँ के लिए क्रॉस घटाएं, दाएँ के लिए अंतर का गुणा करें।",
          gu: "૧૦૦ થી તફાવત શોધો, ડાબા માટે ક્રોસ બાદબાકી કરો, જમણા માટે તફાવત ગુણો."
        },
        tags: [
          { en: "Base 100", hi: "आधार 100", gu: "આધાર ૧૦૦" },
          { en: "Deficiency Magic", hi: "अंतर का जादू", gu: "તફાવતનો જાદુ" },
          { en: "Cross Subtract", hi: "क्रॉस घटाव", gu: "ક્રોસ બાદબાકી" },
          { en: "Multiply Gaps", hi: "अंतर का गुणा", gu: "તફાવત ગુણાકાર" },
          { en: "2-Digit Right", hi: "2-अंकीय दायाँ भाग", gu: "૨-અંક જમણો ભાગ" },
          { en: "Instant Product", hi: "त्वरित गुणनफल", gu: "ઝડપી ગુણાકાર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "magnet_base",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Write the deficiency of each number from 100 (e.g., 95 is -5, 98 is -2).",
              hi: "100 से प्रत्येक संख्या की कमी लिखें (जैसे 95 है -5, 98 है -2)।",
              gu: "૧૦૦ થી દરેક સંખ્યાની ખામી લખો (જેમ કે ૯૫ છે -૫, ૯૮ છે -૨)."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Cross-subtract: Subtract one number's deficiency from the other number (95 - 2 = 93).",
              hi: "क्रॉस घटाएं: एक संख्या में से दूसरी संख्या की कमी घटाएं (95 - 2 = 93)।",
              gu: "ક્રોસ બાદબાકી કરો: એક સંખ્યામાંથી બીજી સંખ્યાની ખામી બાદ કરો (૯૫ - ૨ = ૯૩)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Multiply the two deficiencies together to get the right 2-digit part (5 × 2 = 10).",
              hi: "दाएँ 2-अंक प्राप्त करने के लिए दोनों कमियों का आपस में गुणा करें (5 × 2 = 10)।",
              gu: "જમણા ૨ અંક મેળવવા બંને ખામીઓનો આપસમાં ગુણાકાર કરો (૫ × ૨ = ૧૦)."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Join the left and right parts side-by-side to get the final answer (9310).",
              hi: "अंतिम उत्तर पाने के लिए बाएँ और दाएँ भाग को जोड़कर लिखें (9310)।",
              gu: "અંતિમ જવાબ મેળવવા ડાબા અને જમણા ભાગને જોડીને લખો (૯૩૧૦)."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "magnet_base",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Calculate 92 × 97 in your head using Base 100 and write the 4-digit answer in under 5 seconds!",
          hi: "आधार 100 विधि का उपयोग करके मन में 92 × 97 की गणना करें और 5 सेकंड के अंदर उत्तर लिखें!",
          gu: "આધાર ૧૦૦ પદ્ધતિનો ઉપયોગ કરીને મનમાં ૯૨ × ૯૭ ગણો અને ૫ સેકન્ડમાં ૪ અંકનો જવાબ લખો!"
        },
        commitment_button_text: {
          en: "I will use Base 100 shortcuts!",
          hi: "मैं आधार 100 शॉर्टकट का उपयोग करूँगा!",
          gu: "હું આધાર ૧૦૦ શોર્ટકટનો ઉપયોગ કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_22",
    methodNumber: 22,
    classLevel: 5,
    category: {
      en: "Mental Maths / Calculation Strategies",
      hi: "मानसिक गणित / गणना रणनीतियाँ",
      gu: "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    title: {
      en: "Front-End Estimation (Leading-Digit Anchor)",
      hi: "फ्रंट-एंड अनुमान (प्रमुख अंक एंकर)",
      gu: "ફ્રન્ટ-એન્ડ અંદાજ (પ્રથમ અંક એન્કર)"
    },
    description: {
      en: "Extract the highest place-value leading digits to make rapid, reliable sanity-checks before exact calculations.",
      hi: "सटीक गणना से पहले प्रमुख अंकों (उच्चतम स्थानीय मान) को जोड़कर तेजी से सही अनुमान लगाएं।",
      gu: "ચોક્કસ ગણતરી પહેલાં પ્રથમ અંકો (સૌથી મોટા સ્થાનકિંમત) ઉમેરીને ઝડપી અને સાચો અંદાજ લગાવો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "front_estimate",
        title: {
          en: "Doing Full Scratchpad Work Just to Check a Quick Total?",
          hi: "केवल कुल योग का अंदाजा लगाने के लिए भी पूरा रफ काम करना पड़ता है?",
          gu: "માત્ર અંદાજ મેળવવા માટે પણ આખો સરવાળો રફ કાગળ પર કરવો પડે છે?"
        },
        pain_quotes: [
          {
            en: "In multiple-choice tests, I waste 3 minutes adding 4,820 + 3,190 when 4 options are thousands apart!",
            hi: "बहुविकल्पीय टेस्ट में मैं 4,820 + 3,190 जोड़ने में 3 मिनट बर्बाद कर देता हूँ, जबकि विकल्प बहुत दूर-दूर होते हैं!",
            gu: "પરીક્ષામાં જ્યારે વિકલ્પો ખૂબ દૂર હોય ત્યારે પણ ૪,૮૨૦ + ૩,૧૯૦ નો સરવાળો કરવામાં ૩ મિનિટ બગડી જાય છે!"
          },
          {
            en: "I have no idea if my final big answer is reasonable or completely off by thousands!",
            hi: "मुझे पता ही नहीं चलता कि मेरा बड़ा उत्तर सही दायरे में है या हजारों का अंतर आ गया है!",
            gu: "મને ખબર જ નથી પડતી કે મારો મોટો જવાબ સાચો છે કે હજારોની ભૂલ થઈ ગઈ છે!"
          }
        ],
        body: {
          en: "Front-End Estimation focuses purely on the largest leading digits (the Thousands and Hundreds). It gives you an instant ballpark anchor in 2 seconds, saving your energy for hard questions!",
          hi: "फ्रंट-एंड अनुमान सबसे बड़े अंकों (हजार और सैकड़ा) पर ध्यान केंद्रित करता है। यह 2 सेकंड में आपको सही अनुमानित दायरा देता है और आपका समय बचाता है!",
          gu: "ફ્રન્ટ-એન્ડ અંદાજ સૌથી મોટા અંકો (હજાર અને સો) પર ધ્યાન કેન્દ્રિત કરે છે. તે ૨ સેકન્ડમાં તમને સાચો અંદાજ આપે છે અને તમારો કિંમતી સમય બચાવે છે!"
        },
        key_takeaway: {
          en: "Front-End Rule: Add the leading digits first (4,000 + 3,000 = 7,000), then adjust with the next column!",
          hi: "फ्रंट-एंड नियम: पहले सबसे आगे के अंक जोड़ें (4,000 + 3,000 = 7,000), फिर अगले कॉलम से समायोजित करें!",
          gu: "ફ્રન્ટ-એન્ડ નિયમ: પહેલાં સૌથી આગળના અંકો ઉમેરો (૪,૦૦૦ + ૩,૦૦૦ = ૭,૦૦૦), પછી બાજુના અંકથી સેટ કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "front_estimate",
        title: {
          en: "Meet Tanya",
          hi: "तान्या से मिलें",
          gu: "મળો તાન્યાને"
        },
        story: {
          en: "Tanya went shopping with ₹1,000. Her items were ₹489, ₹312, and ₹195. Instead of slow addition, she used Front-End: 400 + 300 + 100 = ₹800, plus remaining 90+10+95 ≈ ₹195 → Total ≈ ₹995. She knew she had enough money instantly!",
          hi: "तान्या ₹1,000 लेकर खरीदारी करने गई। सामान ₹489, ₹312 और ₹195 का था। उसने फ्रंट-एंड इस्तेमाल किया: 400 + 300 + 100 = ₹800, और बाकी 90+10+95 ≈ ₹195 → कुल ≈ ₹995। उसे तुरंत पता चल गया कि पैसे पर्याप्त हैं!",
          gu: "તાન્યા ₹૧,૦૦૦ લઈને ખરીદી કરવા ગઈ. વસ્તુઓ ₹૪૮૯, ₹૩૧૨ અને ₹૧૯૫ ની હતી. તેણે ફ્રન્ટ-એન્ડ વાપર્યું: ૪૦૦ + ૩૦૦ + ૧૦૦ = ₹૮૦૦, અને બાકીના ૯૦+૧૦+૯૫ ≈ ₹૧૯૫ → કુલ ≈ ₹૯૯૫. તેને તરત ખબર પડી ગઈ કે પૈસા પૂરતા છે!"
        },
        insight_box: {
          en: "Anchor First: Big digits control 90% of the number's true value. Lock them first.",
          hi: "एंकर सिद्धांत: सबसे बड़े अंक संख्या के 90% मान को नियंत्रित करते हैं। पहले उन्हें लॉक करें।",
          gu: "એન્કર સિદ્ધાંત: સૌથી આગળના અંકો સંખ્યાના ૯૦% મૂલ્યને નક્કી કરે છે. પહેલાં તેને લોક કરો."
        }
      },
      {
        type: "method_concept_check",
        icon: "front_estimate",
        question: {
          en: "What is the Front-End leading-digit estimate for 6,240 + 2,890?",
          hi: "6,240 + 2,890 के लिए फ्रंट-एंड प्रमुख अंक अनुमान क्या होगा?",
          gu: "૬,૨૪૦ + ૨,૮૯૦ માટે ફ્રન્ટ-એન્ડ પ્રથમ અંક અંદાજ શું થશે?"
        },
        option_a: {
          en: "Start with 6,000 + 2,000 = 8,000, then adjust with 200 + 900 (≈ 1,100) to get ≈ 9,100.",
          hi: "6,000 + 2,000 = 8,000 से शुरू करें, फिर 200 + 900 (≈ 1,100) जोड़कर ≈ 9,100 प्राप्त करें।",
          gu: "૬,૦૦૦ + ૨,૦૦૦ = ૮,૦૦૦ થી શરૂ કરો, પછી ૨૦૦ + ૯૦૦ (≈ ૧,૧૦૦) ઉમેરીને ≈ ૯,૧૦૦ મેળવો."
        },
        option_b: {
          en: "Add units first: 0 + 0 = 0.",
          hi: "पहले इकाई जोड़ें: 0 + 0 = 0।",
          gu: "પહેલાં એકમ ઉમેરો: ૦ + ૦ = ૦."
        },
        feedback: {
          en: "Correct! Front-end estimation starts at the highest place value to form an immediate reliable anchor.",
          hi: "सही! फ्रंट-एंड अनुमान उच्चतम स्थानीय मान से शुरू होकर तुरंत एक सटीक एंकर देता है।",
          gu: "સાચું! ફ્રન્ટ-એન્ડ અંદાજ સૌથી મોટી સ્થાનકિંમતથી શરૂ થઈને તાત્કાલિક સાચો અંદાજ આપે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "front_estimate",
        question: {
          en: "A school library receives 495 Science books and 512 Story books. Using front-end estimation, which option is the closest reasonable total?",
          hi: "एक स्कूल लाइब्रेरी में 495 विज्ञान की किताबें और 512 कहानियों की किताबें आती हैं। फ्रंट-एंड अनुमान से कौन सा विकल्प सबसे सही है?",
          gu: "એક શાળા પુસ્તકાલયમાં ૪૯૫ વિજ્ઞાનનાં પુસ્તકો અને ૫૧૨ વાર્તાનાં પુસ્તકો આવે છે. ફ્રન્ટ-એન્ડ અંદાજ મુજબ કયો વિકલ્પ સૌથી નજીકનો છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "≈ 700 books",
              hi: "≈ 700 किताबें",
              gu: "≈ ૭૦૦ પુસ્તકો"
            }
          },
          {
            id: "B",
            text: {
              en: "≈ 1,000 books (400 + 500 = 900; 95 + 12 ≈ 100 → 1,000)",
              hi: "≈ 1,000 किताबें (400 + 500 = 900; 95 + 12 ≈ 100 → 1,000)",
              gu: "≈ ૧,૦૦૦ પુસ્તકો (૪૦૦ + ૫૦૦ = ૯૦૦; ૯૫ + ૧૨ ≈ ૧૦૦ → ૧,૦૦૦)"
            }
          },
          {
            id: "C",
            text: {
              en: "≈ 1,400 books",
              hi: "≈ 1,400 किताबें",
              gu: "≈ ૧,૪૦૦ પુસ્તકો"
            }
          },
          {
            id: "D",
            text: {
              en: "≈ 1,800 books",
              hi: "≈ 1,800 किताबें",
              gu: "≈ ૧,૮૦૦ પુસ્તકો"
            }
          }
        ],
        correct_option: "B",
        feedback: {
          en: "Spot on! 400 + 500 = 900, plus the remaining parts (95 + 12 ≈ 107) puts the total right at ~1,000 (exact: 1,007).",
          hi: "शानदार! 400 + 500 = 900, और शेष भाग (95 + 12 ≈ 107) कुल योग को ~1,000 (सटीक: 1,007) पर लाता है।",
          gu: "એકદમ સાચું! ૪૦૦ + ૫૦૦ = ૯૦૦, અને બાકીનો ભાગ (૯૫ + ૧૨ ≈ ૧૦૭) મળીને કુલ ~૧,૦૦૦ (ચોક્કસ: ૧,૦૦૭) થાય છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "front_estimate",
        title: {
          en: "Front-End Anchor Superpower",
          hi: "फ्रंट-एंड एंकर सुपरपावर",
          gu: "ફ્રન્ટ-એન્ડ એન્કર સુપરપાવર"
        },
        body: {
          en: "Add the biggest place-values first to lock the ballpark range in seconds.",
          hi: "सेकंडों में अनुमानित दायरा तय करने के लिए सबसे पहले बड़े अंकों को जोड़ें।",
          gu: "સેકન્ડોમાં અંદાજ મેળવવા સૌથી પહેલાં મોટા સ્થાનકિંમતના અંકો ઉમેરો."
        },
        tags: [
          { en: "Lead Digits", hi: "प्रमुख अंक", gu: "મુખ્ય અંકો" },
          { en: "Big Values First", hi: "बड़े मान पहले", gu: "મોટી કિંમત પહેલાં" },
          { en: "Sanity Check", hi: "सटीकता जांच", gu: "સાચી ચકાસણી" },
          { en: "Eliminate Wrong", hi: "गलत विकल्प हटाएं", gu: "ખોટા વિકલ્પ દૂર" },
          { en: "Fast Ballpark", hi: "त्वरित दायरा", gu: "ઝડપી અંદાજ" },
          { en: "Mental Anchor", hi: "मानसिक एंकर", gu: "માનસિક એન્કર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "front_estimate",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Look at the leftmost leading digits (highest place value) of all numbers.",
              hi: "सभी संख्याओं के सबसे बाईं ओर के प्रमुख अंकों (उच्चतम स्थानीय मान) को देखें।",
              gu: "બધી સંખ્યાઓના સૌથી ડાબી બાજુના પ્રથમ અંકો (સૌથી મોટી સ્થાનકિંમત) જુઓ."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Add or multiply those leading values to establish the base ballpark anchor.",
              hi: "आधार अनुमानित एंकर बनाने के लिए उन प्रमुख अंकों को जोड़ें या गुणा करें।",
              gu: "મુખ્ય અંદાજ બાંધવા તે પ્રથમ અંકોનો સરવાળો કે ગુણાકાર કરો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Inspect the second column to adjust upward or downward as needed.",
              hi: "जरूरत के अनुसार अनुमान को ऊपर या नीचे समायोजित करने के लिए दूसरे कॉलम को देखें।",
              gu: "જરૂર મુજબ અંદાજને થોડો વધારવા કે ઘટાડવા બીજા સ્થાનના અંકો જુઓ."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Instantly eliminate answer choices that fall far outside your ballpark anchor.",
              hi: "अपने अनुमानित दायरे से बहुत दूर के उत्तर विकल्पों को तुरंत हटा दें।",
              gu: "તમારા અંદાજ કરતાં ખૂબ દૂરના જવાબોને તરત જ રદ કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "front_estimate",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Use front-end estimation on 3 grocery prices or large test numbers before doing any exact math!",
          hi: "सटीक गणित करने से पहले किराने के 3 सामानों या बड़ी संख्याओं पर फ्रंट-एंड अनुमान लगाएं!",
          gu: "ચોક્કસ ગણતરી કરતાં પહેલાં ખરીદીની ૩ કિંમતો કે મોટા દાખલાઓ પર ફ્રન્ટ-એન્ડ અંદાજ લગાવો!"
        },
        commitment_button_text: {
          en: "I will anchor calculations with front-end estimation!",
          hi: "मैं फ्रंट-एंड अनुमान से गणना को एंकर करूँगा!",
          gu: "હું ફ્રન્ટ-એન્ડ અંદાજથી ગણતરીને એન્કર કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_40",
    methodNumber: 40,
    classLevel: 5,
    category: {
      en: "Memory Strategies",
      hi: "स्मृति रणनीतियाँ",
      gu: "સ્મૃતિ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Spaced Repetition (Expanding Time-Vault)",
      hi: "स्पेस्ड रिपीटिशन (समय-अंतराल दोहराव / टाइम वॉल्ट)",
      gu: "સ્પેસ્ડ રિપીટીશન (સમય-અંતરાલ પુનરાવર્તન / ટાઇમ વૉલ્ટ)"
    },
    description: {
      en: "Review newly learned concepts at expanding intervals (1 day, 3 days, 7 days, 14 days) to permanently beat the forgetting curve.",
      hi: "भूलने के वक्र को हराने के लिए नए पाठों को बढ़ते अंतराल (1 दिन, 3 दिन, 7 दिन, 14 दिन) पर दोहराएं।",
      gu: "વિસરાઈ જવાની વક્રરેખાને હરાવવા નવા પાઠોને વધતા સમય-અંતરે (૧ દિવસ, ૩ દિવસ, ૭ દિવસ, ૧૪ દિવસ) પુનરાવર્તિત કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "spaced_calendar",
        title: {
          en: "Studying 4 Hours for an Exam Only to Forget Everything 2 Weeks Later?",
          hi: "परीक्षा के लिए 4 घंटे पढ़ाई की और 2 सप्ताह बाद सब कुछ भूल गए?",
          gu: "પરીક્ષા માટે ૪ કલાક વાંચ્યું અને ૨ અઠવાડિયા પછી બધું ભૂલાઈ ગયું?"
        },
        pain_quotes: [
          {
            en: "I cram all night before a unit test, but by the midterms I can't remember a single formula!",
            hi: "मैं टेस्ट से पहले पूरी रात रटता हूँ, लेकिन मिडटर्म तक एक भी सूत्र याद नहीं रहता!",
            gu: "હું ટેસ્ટ પહેલાં આખી રાત ગોખું છું, પણ સત્રાંત પરીક્ષા સુધીમાં એક પણ સૂત્ર યાદ રહેતું નથી!"
          },
          {
            en: "Rereading my textbook 5 times in one afternoon feels exhausting and doesn't stick!",
            hi: "एक ही दोपहर में किताब को 5 बार पढ़ना बहुत थकाऊ लगता है और याद भी नहीं रहता!",
            gu: "એક જ બપોરે ચોપડી ૫ વાર વાંચવાથી મગજ થાકી જાય છે અને યાદ પણ રહેતું નથી!"
          }
        ],
        body: {
          en: "Cramming in one single block causes rapid forgetting. Human memory requires 'Spaced Intervals'—refreshing the memory right as it starts to fade doubles its neural strength every time!",
          hi: "एक ही बार में सब रटने से जानकारी जल्दी भूल जाती है। मानव स्मृति को 'समय अंतराल' की जरूरत होती है—जब स्मृति धुंधली होने लगे, तभी दोहराने से वह दोगुनी मजबूत हो जाती है!",
          gu: "એક જ વારમાં બધું ગોખી નાખવાથી યાદશક્તિ ઝડપથી ભૂલી જાય છે. માનવ સ્મૃતિને 'સમય અંતરાલ' ની જરૂર હોય છે—જ્યારે યાદશક્તિ ઝાંખી થવા લાગે ત્યારે રિવિઝન કરવાથી તે બમણી પાકી થાય છે!"
        },
        key_takeaway: {
          en: "Spaced Rule: Review on Day 1 → Day 3 → Day 7 → Day 14 to lock knowledge permanently in long-term memory!",
          hi: "स्पेस्ड नियम: ज्ञान को हमेशा के लिए लॉक करने के लिए दिन 1 → दिन 3 → दिन 7 → दिन 14 पर दोहराएं!",
          gu: "સ્પેસ્ડ નિયમ: જ્ઞાનને કાયમ માટે સાચવવા દિવસ ૧ → દિવસ ૩ → દિવસ ૭ → દિવસ ૧૪ પર પુનરાવર્તન કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "spaced_calendar",
        title: {
          en: "Meet Meera",
          hi: "मीरा से मिलें",
          gu: "મળો મીરાને"
        },
        story: {
          en: "Meera studied 30 Science terms in one 4-hour cram session. Two weeks later, she scored 40% on a surprise quiz. Her mentor gave her a '1-3-7-14 Day Review Calendar'. Spending just 5 minutes per interval, she remembered all 30 terms months later!",
          hi: "मीरा ने एक ही दिन 4 घंटे रटकर 30 विज्ञान शब्द याद किए। दो सप्ताह बाद सरप्राइज टेस्ट में उसके सिर्फ 40% आए। फिर उसने '1-3-7-14 दिन का कैलेंडर' अपनाया। हर अंतराल पर सिर्फ 5 मिनट देकर उसे महीनों बाद भी सब याद रहा!",
          gu: "મીરાએ એક જ દિવસે ૪ કલાક વાંચીને ૩૦ વિજ્ઞાનના શબ્દો પાકા કર્યા. બે અઠવાડિયા પછી અચાનક ટેસ્ટમાં ૪૦% જ આવ્યા. પછી તેણે '૧-૩-૭-૧૪ દિવસનું કેલેન્ડર' અપનાવ્યું. દરેક વખતે માત્ર ૫ મિનિટ આપીને તેને મહિનાઓ પછી પણ બધું યાદ રહ્યું!"
        },
        insight_box: {
          en: "The Spacing Effect: 5 minutes × 4 spaced sessions beats 1 marathon 4-hour cramming session every single time.",
          hi: "स्पेसिंग प्रभाव: 5 मिनट के 4 अलग-अलग सत्र 4 घंटे के लगातार रटने से कहीं ज्यादा असरदार होते हैं।",
          gu: "સ્પેસિંગ અસર: ૫ મિનિટના ૪ અલગ-અલગ સત્રો ૪ કલાકના સળંગ ગોખણપટ્ટી કરતાં અનેક ગણા વધુ અસરકારક છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "spaced_calendar",
        question: {
          en: "Which study routine guarantees long-term retention with the least mental fatigue?",
          hi: "कौन सी अध्ययन दिनचर्या न्यूनतम मानसिक थकान के साथ लंबे समय तक याद रखने की गारंटी देती है?",
          gu: "કઈ અભ્યાસ પદ્ધતિ ઓછામાં ઓછા થાક સાથે લાંબા સમય સુધી યાદ રાખવાની ખાતરી આપે છે?"
        },
        option_a: {
          en: "Studying for 5 hours non-stop the night before the final exam.",
          hi: "अंतिम परीक्षा से पहले वाली रात 5 घंटे बिना रुके पढ़ाई करना।",
          gu: "પરીક્ષાની આગલી રાતે ૫ કલાક સળંગ વાંચવું."
        },
        option_b: {
          en: "Reviewing for 10 minutes across expanding intervals: Day 1, Day 3, Day 7, and Day 14.",
          hi: "बढ़ते अंतरालों पर 10-10 मिनट दोहराना: दिन 1, दिन 3, दिन 7 और दिन 14।",
          gu: "વધતા સમય-અંતરે ૧૦-૧૦ મિનિટ રિવિઝન કરવું: દિવસ ૧, દિવસ ૩, દિવસ ૭ અને દિવસ ૧૪."
        },
        feedback: {
          en: "Correct! Spaced reviews reset the forgetting curve, building durable neural pathways without burnout.",
          hi: "सही! समय-अंतराल दोहराव भूलने के वक्र को रीसेट करता है और बिना थकान के मजबूत याददाश्त बनाता है।",
          gu: "સાચું! સ્પેસ્ડ રિવિઝન વિસરાઈ જવાની વક્રરેખાને રીસેટ કરે છે અને થાક્યા વગર પાકી યાદશક્તિ બનાવે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "spaced_calendar",
        question: {
          en: "You learned 15 tricky plant adaptation terms on Monday (Day 1). What is the optimal Spaced Repetition schedule for the next review sessions?",
          hi: "आपने सोमवार (दिन 1) को 15 कठिन पौधे अनुकूलन शब्द सीखे। अगले दोहराव सत्रों के लिए सबसे सही समय-सारणी क्या है?",
          gu: "તમે સોમવારે (દિવસ ૧) વનસ્પતિ અનુકૂલનના ૧૫ અઘરા શબ્દો શીખ્યા. હવે પછીના રિવિઝન માટે સૌથી આદર્શ સમયપત્રક કયું છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Tuesday (Day 2), Thursday (Day 4), and next Monday (Day 8)",
              hi: "मंगलवार (दिन 2), गुरुवार (दिन 4), और अगला सोमवार (दिन 8)",
              gu: "મંગળવાર (દિવસ ૨), ગુરુવાર (દિવસ ૪), અને આવતો સોમવાર (દિવસ ૮)"
            }
          },
          {
            id: "B",
            text: {
              en: "Never review until the night before the final exam",
              hi: "अंतिम परीक्षा की रात से पहले कभी न दोहराएं",
              gu: "છેલ્લી પરીક્ષાની આગલી રાત સુધી ક્યારેય ન વાંચવું"
            }
          },
          {
            id: "C",
            text: {
              en: "Study for 6 hours continuously on Tuesday and never again",
              hi: "मंगलवार को लगातार 6 घंटे पढ़ें और फिर कभी नहीं",
              gu: "મંગળવારે સળંગ ૬ કલાક વાંચવું અને પછી ક્યારેય નહીં"
            }
          },
          {
            id: "D",
            text: {
              en: "Review 10 times in 1 hour on Monday only",
              hi: "सोमवार को ही 1 घंटे में 10 बार पढ़ें",
              gu: "સોમવારે જ ૧ કલાકમાં ૧૦ વાર વાંચવું"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Perfect! Reviewing after 1 day (Day 2), 3 days (Day 4), and 7 days (Day 8) expands memory retention exponentially.",
          hi: "शानदार! 1 दिन (दिन 2), 3 दिन (दिन 4), और 7 दिन (दिन 8) के बाद दोहराने से स्मृति घातीय रूप से मजबूत होती है।",
          gu: "ઉત્તમ! ૧ દિવસ (દિવસ ૨), ૩ દિવસ (દિવસ ૪), અને ૭ દિવસ (દિવસ ૮) પછી પુનરાવર્તન કરવાથી યાદશક્તિ અનેક ગણી મજબૂત બને છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "spaced_calendar",
        title: {
          en: "Time-Vault Superpower",
          hi: "टाइम-वॉल्ट सुपरपावर",
          gu: "ટાઇમ-વૉલ્ટ સુપરપાવર"
        },
        body: {
          en: "Review right before you forget to make memories permanent.",
          hi: "भूलने से ठीक पहले दोहराएं ताकि यादें हमेशा के लिए पक्की हो जाएं।",
          gu: "ભૂલી જતાં પહેલાં જ રિવિઝન કરો જેથી યાદશક્તિ કાયમ માટે પાકી થઈ જાય."
        },
        tags: [
          { en: "Expanding Intervals", hi: "बढ़ते अंतराल", gu: "વધતા અંતરાલ" },
          { en: "Beat Forgetting", hi: "भूलना बंद", gu: "વિસરાવું બંધ" },
          { en: "1-3-7-14 Days", hi: "1-3-7-14 दिन", gu: "૧-૩-૭-૧૪ દિવસ" },
          { en: "5-Min Check", hi: "5-मिनट जांच", gu: "૫-મિનિટ ચેક" },
          { en: "Long-Term Vault", hi: "स्थायी मेमोरी", gu: "કાયમી મેમરી" },
          { en: "Zero Cramming", hi: "बिना रटना", gu: "ગોખણપટ્ટી મુક્ત" }
        ]
      },
      {
        type: "action_checklist",
        icon: "spaced_calendar",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Learn the core concepts today (Day 1) and note the date on your study log.",
              hi: "आज (दिन 1) मुख्य अवधारणाएं सीखें और अपनी स्टडी डायरी में तारीख नोट करें।",
              gu: "આજે (દિવસ ૧) મુખ્ય સંકલ્પનાઓ શીખો અને તમારી ડાયરીમાં તારીખ નોંધો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Do a quick 5-minute recall review the very next day (Day 2).",
              hi: "अगले ही दिन (दिन 2) त्वरित 5 मिनट का दोहराव करें।",
              gu: "બીજા જ દિવસે (દિવસ ૨) ઝડપી ૫ મિનિટનું રિવિઝન કરો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Test yourself again after 3 days (Day 5) on key definitions and formulas.",
              hi: "3 दिन बाद (दिन 5) मुख्य परिभाषाओं और सूत्रों पर स्वयं का टेस्ट लें।",
              gu: "૩ દિવસ પછી (દિવસ ૫) મુખ્ય વ્યાખ્યાઓ અને સૂત્રો પર જાતે ટેસ્ટ લો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Do a final consolidation review after 1 week (Day 12) to lock into permanent memory.",
              hi: "स्थायी याददाश्त में लॉक करने के लिए 1 सप्ताह बाद (दिन 12) अंतिम समीक्षा करें।",
              gu: "કાયમી યાદશક્તિમાં લોક કરવા ૧ અઠવાડિયા પછી (દિવસ ૧૨) અંતિમ રિવિઝન કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "spaced_calendar",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Pick one difficult topic from 3 days ago and spend exactly 5 minutes testing yourself on it today!",
          hi: "3 दिन पहले का एक कठिन विषय चुनें और आज उस पर खुद का टेस्ट लेने में ठीक 5 मिनट लगाएं!",
          gu: "૩ દિવસ પહેલાંનો કોઈ એક અઘરો વિષય પસંદ કરો અને આજે ૫ મિનિટ જાતે તેનો ટેસ્ટ લો!"
        },
        commitment_button_text: {
          en: "I will follow the Spaced Repetition calendar!",
          hi: "मैं समय-अंतराल दोहराव कैलेंडर का पालन करूँगा!",
          gu: "હું સ્પેસ્ડ રિપીટીશન કેલેન્ડરનું પાલન કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_41",
    methodNumber: 41,
    classLevel: 5,
    category: {
      en: "Memory Strategies",
      hi: "स्मृति रणनीतियाँ",
      gu: "સ્મૃતિ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Active Recall (Brain Flash Retrieval)",
      hi: "सक्रिय स्मरण (एक्टिव रिकॉल / ब्रेन फ्लैश)",
      gu: "સક્રિય સ્મરણ (એક્ટિવ રીકૉલ / બ્રેઇન ફ્લેશ)"
    },
    description: {
      en: "Close your notes and force your brain to pull information from memory instead of passively rereading.",
      hi: "किताब बंद करके निष्क्रिय पढ़ने के बजाय जानकारी को याददाश्त से बाहर निकालने का अभ्यास करें।",
      gu: "પુસ્તક બંધ કરીને માત્ર વાંચવાને બદલે માહિતીને યાદશક્તિમાંથી બહાર કાઢવાનો અભ્યાસ કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "brain_flash",
        title: {
          en: "Highlighting Textbooks in Neon Yellow but Going Blank in Tests?",
          hi: "पूरी किताब को हाइलाइटर से रंग दिया फिर भी टेस्ट में सब गायब?",
          gu: "આખી ચોપડી હાઈલાઈટરથી રંગી નાખી છતાં પરીક્ષામાં બધું ભૂલાઈ ગયું?"
        },
        pain_quotes: [
          {
            en: "When I reread my notebook it feels so familiar, but when the exam paper arrives I freeze!",
            hi: "नोट्स दोबारा पढ़ते समय सब आसान लगता है, लेकिन परीक्षा का पेपर आते ही दिमाग सुन्न हो जाता है!",
            gu: "નોટ્સ ફરી વાંચતી વખતે બધું આવડતું હોય તેવું લાગે છે, પણ પેપર સામે આવતાં જ મગજ ખાલી થઈ જાય છે!"
          },
          {
            en: "Passively looking at answers tricks my brain into thinking I know them when I actually don't!",
            hi: "उत्तरों को केवल देखने से दिमाग को यह भ्रम हो जाता है कि मुझे सब याद है!",
            gu: "જવાબો માત્ર જોવાથી મગજને ખોટો વહેમ થાય છે કે મને બધું આવડે છે!"
          }
        ],
        body: {
          en: "Passive rereading creates an 'Illusion of Competence'. Your brain only builds real memory muscles when it is forced to retrieve information with the book CLOSED.",
          hi: "केवल पढ़ने से 'याद होने का भ्रम' पैदा होता है। दिमाग की असली ताकत तभी बढ़ती है जब वह किताब बंद करके जानकारी को बाहर खींचने की मेहनत करता है।",
          gu: "માત્ર વાંચવાથી 'આવડવાનો વહેમ' પેદા થાય છે. મગજની ખરી તાકાત ત્યારે જ વધે છે જ્યારે તે ચોપડી બંધ કરીને યાદશક્તિમાંથી માહિતી બહાર કાઢવાની મહેનત કરે છે."
        },
        key_takeaway: {
          en: "Active Recall Rule: Read once → Close the book → Test yourself by writing or speaking from memory!",
          hi: "सक्रिय स्मरण नियम: एक बार पढ़ें → किताब बंद करें → याददाश्त से लिखकर या बोलकर खुद का टेस्ट लें!",
          gu: "સક્રિય સ્મરણ નિયમ: એક વાર વાંચો → ચોપડી બંધ કરો → યાદશક્તિમાંથી લખી કે બોલીને જાતે ટેસ્ટ લો!"
        }
      },
      {
        type: "relatable_story",
        icon: "brain_flash",
        title: {
          en: "Meet Dev",
          hi: "देव से मिलें",
          gu: "મળો દેવને"
        },
        story: {
          en: "Dev spent 2 hours highlighting chapters in green and yellow. On the Science test, he could picture the yellow page but couldn't recall the answers. He switched to 'Blank Sheet Brain Dump'—closing the book and writing down everything from memory. His score jumped from 60% to 95%!",
          hi: "देव ने 2 घंटे रंग-बिरंगे हाइलाइटर से नोट्स रंगे। टेस्ट में उसे पीला पन्ना तो याद आया पर उत्तर नहीं। फिर उसने 'ब्लैंक शीट ब्रेन डंप' अपनाया—किताब बंद करके याद से खाली पन्ने पर सब लिखना शुरू किया। उसके अंक 60% से 95% हो गए!",
          gu: "દેવે ૨ કલાક રંગબેરંગી હાઈલાઈટરથી ચોપડી રંગી. ટેસ્ટમાં તેને પીળું પાનું તો યાદ આવ્યું પણ જવાબ નહીં. પછી તેણે 'ખાલી કાગળ બ્રેઈન ડમ્પ' અપનાવ્યો—ચોપડી બંધ કરીને યાદશક્તિમાંથી કાગળ પર લખવાનું શરૂ કર્યું. તેનું પરિણામ ૬૦% થી વધીને ૯૫% થઈ ગયું!"
        },
        insight_box: {
          en: "Retrieval Strength: The harder your brain works to pull a memory out, the stronger that memory becomes.",
          hi: "स्मरण शक्ति: जानकारी को याददाश्त से बाहर निकालने में दिमाग जितनी मेहनत करता है, वह उतनी ही पक्की होती है।",
          gu: "સ્મરણ શક્તિ: માહિતીને યાદમાંથી બહાર કાઢવા મગજ જેટલી મહેનત કરશે, તેટલી જ તે કાયમ માટે પાકી થશે."
        }
      },
      {
        type: "method_concept_check",
        icon: "brain_flash",
        question: {
          en: "Which study habit produces the strongest memory retention for tomorrow's test?",
          hi: "कल के टेस्ट के लिए कौन सी अध्ययन आदत सबसे मजबूत याददाश्त बनाती है?",
          gu: "આવતીકાલની પરીક્ષા માટે કઈ અભ્યાસ આદત સૌથી પાકી યાદશક્તિ બનાવે છે?"
        },
        option_a: {
          en: "Rereading the chapter summary 4 times with the answers in plain sight.",
          hi: "उत्तर सामने रखकर पाठ का सारांश 4 बार पढ़ना।",
          gu: "જવાબ સામે રાખીને પાઠનો સારાંશ ૪ વાર વાંચવો."
        },
        option_b: {
          en: "Closing the book and answering practice questions or writing bullet points from memory.",
          hi: "किताब बंद करके अभ्यास प्रश्नों के उत्तर देना या याददाश्त से मुख्य बिंदु लिखना।",
          gu: "ચોપડી બંધ કરીને પ્રશ્નોના જવાબ આપવા અથવા યાદશક્તિમાંથી મુખ્ય મુદ્દા લખવા."
        },
        feedback: {
          en: "Correct! Actively retrieving answers from memory strengthens neural pathways far more than passive rereading.",
          hi: "सही! याददाश्त से जानकारी को सक्रिय रूप से बाहर निकालना केवल पढ़ने की तुलना में कहीं अधिक प्रभावी है।",
          gu: "સાચું! માત્ર વાંચવા કરતાં યાદશક્તિમાંથી સક્રિય રીતે જવાબ બહાર કાઢવાથી મગજ વધુ મજબૂત બને છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "brain_flash",
        question: {
          en: "You have just finished reading a page about the Water Cycle (Evaporation, Condensation, Precipitation, Collection). What is the BEST Active Recall action?",
          hi: "आपने जल चक्र (वाष्पीकरण, संघनन, वर्षण, संग्रहण) के बारे में एक पृष्ठ पढ़ा है। सबसे अच्छी सक्रिय स्मरण क्रिया क्या है?",
          gu: "તમે હમણાં જ જળચક્ર (બાષ્પીભવન, ઘનીભવન, વરસાદ, સંગ્રહ) વિશે એક પાનું વાંચ્યું. સૌથી શ્રેષ્ઠ એક્ટિવ રીકૉલ પગલું કયું છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Highlight all four bold words with a pink pen",
              hi: "गुलाबी पेन से सभी चार शब्दों को हाइलाइट करें",
              gu: "ગુલાબી પેનથી ચારેય શબ્દોને હાઈલાઈટ કરવા"
            }
          },
          {
            id: "B",
            text: {
              en: "Close the book and draw/explain the 4 stages on a blank paper from memory",
              hi: "किताब बंद करें और कोरे कागज पर याददाश्त से चारों चरणों का चित्र बनाएं व समझाएं",
              gu: "ચોપડી બંધ કરો અને કોરા કાગળ પર યાદશક્તિમાંથી ચારેય તબક્કા દોરીને સમજાવો"
            }
          },
          {
            id: "C",
            text: {
              en: "Leave the book open and read it one more time",
              hi: "किताब खुली रखकर एक बार और पढ़ें",
              gu: "ચોપડી ખુલ્લી રાખીને ફરી એક વાર વાંચવી"
            }
          },
          {
            id: "D",
            text: {
              en: "Look at the diagram for 5 seconds without thinking",
              hi: "बिना सोचे 5 सेकंड के लिए चित्र को देखें",
              gu: "વિચાર્યા વગર ૫ સેકન્ડ ચિત્ર તરફ જોવું"
            }
          }
        ],
        correct_option: "B",
        feedback: {
          en: "Masterful! Testing your own recall with a closed book forces genuine cognitive retrieval and solidifies learning.",
          hi: "शानदार! बंद किताब के साथ खुद का टेस्ट लेने से याददाश्त की असली परीक्षा होती है और ज्ञान पक्का होता है।",
          gu: "ઉત્તમ! બંધ પુસ્તકે જાતે ટેસ્ટ લેવાથી સાચી સ્મરણ શક્તિ વિકસે છે અને જ્ઞાન કાયમી બને છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "brain_flash",
        title: {
          en: "Brain Flash Superpower",
          hi: "ब्रेन फ्लैश सुपरपावर",
          gu: "બ્રેઇન ફ્લેશ સુપરપાવર"
        },
        body: {
          en: "Close the book and pull knowledge out of your brain to make it bulletproof.",
          hi: "किताब बंद करें और दिमाग से जानकारी बाहर निकालें ताकि वह कभी न भूले।",
          gu: "પુસ્તક બંધ કરો અને મગજમાંથી માહિતી બહાર ખેંચો જેથી તે ક્યારેય ન ભુલાય."
        },
        tags: [
          { en: "Close Book", hi: "किताब बंद", gu: "પુસ્તક બંધ" },
          { en: "Self-Testing", hi: "स्वयं-जांच", gu: "સ્વ-પરીક્ષણ" },
          { en: "Flash Retrieval", hi: "त्वरित स्मरण", gu: "ઝડપી સ્મરણ" },
          { en: "Blank Sheet Dump", hi: "ब्लैंक शीट डंप", gu: "કોરા કાગળ ટેસ્ટ" },
          { en: "Active Flashcards", hi: "फ्लैशकार्ड्स", gu: "ફ્લેશકાર્ડ્સ" },
          { en: "Zero Illusion", hi: "भ्रम मुक्त", gu: "વહેમ મુક્ત" }
        ]
      },
      {
        type: "action_checklist",
        icon: "brain_flash",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Read a section of your textbook actively for 5-10 minutes.",
              hi: "अपनी पाठ्यपुस्तक का एक भाग 5-10 मिनट तक ध्यान से पढ़ें।",
              gu: "તમારી ચોપડીનો એક ફકરો ૫-૧૦ મિનિટ ધ્યાનથી વાંચો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Completely close the book and push notes out of sight.",
              hi: "किताब को पूरी तरह बंद करें और नोट्स को नजरों से दूर रखें।",
              gu: "ચોપડી સંપૂર્ણપણે બંધ કરો અને નોટ્સ નજરથી દૂર મૂકો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Write down or say aloud every key concept, formula, and step you remember.",
              hi: "जो भी याद आए, उन सभी मुख्य बिंदुओं, सूत्रों और चरणों को लिखें या बोलें।",
              gu: "યાદ આવે તે બધા મુખ્ય મુદ્દા, સૂત્રો અને પગલાં કાગળ પર લખો અથવા મોટેથી બોલો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Open the book only to check what you missed and immediately test that gap again.",
              hi: "किताब खोलकर केवल छूटी हुई चीजें देखें और तुरंत उस अंतर की दोबारा जांच करें।",
              gu: "ચોપડી ખોલીને માત્ર જે ભૂલાઈ ગયું તે જુઓ અને તરત જ તે મુદ્દાનો ફરી ટેસ્ટ લો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "brain_flash",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Take one topic from today's homework, close the book, and write down 5 key facts from pure memory!",
          hi: "आज के गृहकार्य से एक विषय चुनें, किताब बंद करें और केवल याददाश्त से 5 मुख्य बातें लिखें!",
          gu: "આજના ગૃહકાર્યમાંથી એક વિષય પસંદ કરો, ચોપડી બંધ કરો અને માત્ર યાદશક્તિમાંથી ૫ મુખ્ય વાતો લખો!"
        },
        commitment_button_text: {
          en: "I will test my memory with Active Recall!",
          hi: "मैं सक्रिय स्मरण से अपनी याददाश्त परखूँगा!",
          gu: "હું એક્ટિવ રીકૉલથી મારી યાદશક્તિ ચકાસીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_45",
    methodNumber: 45,
    classLevel: 5,
    category: {
      en: "Memory Strategies",
      hi: "स्मृति रणनीतियाँ",
      gu: "સ્મૃતિ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Retrieval Cues (Mental Anchor Hooks)",
      hi: "पुनर्प्राप्ति संकेत (रिट्रीवल क्यूज / मेमोरी हुक)",
      gu: "પુનઃપ્રાપ્તિ સંકેતો (રીટ્રીવલ ક્યૂઝ / મેમરી હૂક)"
    },
    description: {
      en: "Anchor complex lists and definitions to vivid trigger words, acronym hooks, and visual mental peg keys.",
      hi: "जटिल सूचियों और परिभाषाओं को जीवंत स्मृति हुक, संक्षिप्त शब्दों (एक्रोनिम) और एंकर से जोड़ें।",
      gu: "અટપટી યાદીઓ અને વ્યાખ્યાઓને જીવંત સંકેત શબ્દો, ટૂંકાક્ષરી (એક્રોનિમ) અને મેમરી હૂક સાથે જોડો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "clue_key",
        title: {
          en: "Knowing the Answer is in Your Head but Unable to Unlock It?",
          hi: "पता है कि उत्तर दिमाग में है, लेकिन याद करने का ताला नहीं खुल रहा?",
          gu: "ખબર છે કે જવાબ મગજમાં છે, પણ યાદ કરવાનું તાળું ખૂલતું નથી?"
        },
        pain_quotes: [
          {
            en: "It's on the tip of my tongue, but I just can't pull the word out during the test!",
            hi: "उत्तर मेरी जीभ पर है, लेकिन टेस्ट के दौरान शब्द याद ही नहीं आ रहा!",
            gu: "જવાબ જીભના ટેરવે છે, પણ પરીક્ષા વખતે બરાબર શબ્દ બહાર આવતો જ નથી!"
          },
          {
            en: "When memorizing a 5-item list, I always forget item #3 because there's no hook connecting them!",
            hi: "5 चीजों की सूची में मैं हमेशा तीसरा बिंदु भूल जाता हूँ क्योंकि कोई जोड़ने वाला हुक नहीं होता!",
            gu: "૫ મુદ્દાની યાદીમાં હું હંમેશાં ત્રીજો મુદ્દો ભૂલી જાઉં છું કારણ કે તેમને જોડતો કોઈ હૂક નથી હોતો!"
          }
        ],
        body: {
          en: "Memories aren't lost; they are just unindexed. A 'Retrieval Cue' acts as a search key in your brain's filing cabinet, pulling the complete stored memory out in a split second!",
          hi: "यादें खोती नहीं हैं, बस उन्हें खोजने का ताला चाहिए। एक 'मेमोरी हुक' दिमाग की अलमारी में सर्च-की का काम करता है और पलक झपकते ही पूरी जानकारी बाहर निकाल देता है!",
          gu: "યાદો ખોવાઈ જતી નથી, માત્ર તેને શોધવાની ચાવી જોઈએ. એક 'મેમરી હૂક' મગજના કબાટમાં સર્ચ કી જેવું કામ કરે છે અને પલકવારમાં આખી માહિતી બહાર લાવી દે છે!"
        },
        key_takeaway: {
          en: "Cue Hook Rule: Link every complex fact to a catchy trigger word, acronym, or vivid mental image!",
          hi: "मेमोरी हुक नियम: हर कठिन तथ्य को एक मजेदार कोड शब्द, संक्षिप्त नाम या चित्र से जोड़ें!",
          gu: "મેમરી હૂક નિયમ: દરેક અઘરી માહિતીને એક મજેદાર કોડ વર્ડ, ટૂંકાક્ષરી કે ચિત્ર સાથે જોડો!"
        }
      },
      {
        type: "relatable_story",
        icon: "clue_key",
        title: {
          en: "Meet Vivaan",
          hi: "विवान से मिलें",
          gu: "મળો વિવાનને"
        },
        story: {
          en: "Vivaan kept mixing up the 8 planets in order (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune). His teacher gave him the retrieval cue sentence: 'My Very Energetic Monkey Just Served Us Nachos!'. The first letters (M-V-E-M-J-S-U-N) unlocked all 8 planets effortlessly forever!",
          hi: "विवान हमेशा सौरमंडल के 8 ग्रहों का क्रम भूल जाता था। उसके शिक्षक ने एक मेमोरी हुक दिया: 'My Very Energetic Monkey Just Served Us Nachos!'। इसके पहले अक्षरों (M-V-E-M-J-S-U-N) ने सभी 8 ग्रहों को हमेशा के लिए याद करा दिया!",
          gu: "વિવાન હંમેશાં ૮ ગ્રહોનો સાચો ક્રમ ભૂલી જતો હતો. તેના શિક્ષકે એક મેમરી હૂક વાક્ય આપ્યું: 'My Very Energetic Monkey Just Served Us Nachos!'. તેના પહેલા અક્ષરો (M-V-E-M-J-S-U-N) થી બધા ૮ ગ્રહો કાયમ માટે સરળતાથી યાદ રહી ગયા!"
        },
        insight_box: {
          en: "Index Key: Your brain loves silly sentences and acronyms. They act as instant search handles for large facts.",
          hi: "सर्च हैंडल: दिमाग को मजेदार वाक्य और संक्षिप्त नाम बहुत पसंद हैं। वे बड़ी जानकारी को तुरंत खींच लाते हैं।",
          gu: "સર્ચ હેન્ડલ: મગજને રમૂજી વાક્યો અને ટૂંકાક્ષરી ખૂબ ગમે છે. તે મોટી માહિતીને ક્ષણવારમાં બહાર ખેંચી લાવે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "clue_key",
        question: {
          en: "Why is an acronym like 'VIBGYOR' such an effective retrieval cue for rainbow colors?",
          hi: "इंद्रधनुष के रंगों के लिए 'VIBGYOR' जैसा संक्षिप्त शब्द इतना असरदार मेमोरी हुक क्यों है?",
          gu: "મેઘધનુષના રંગો માટે 'VIBGYOR' જેવો ટૂંકાક્ષરી શબ્દ આટલો અસરકારક મેમરી હૂક કેમ છે?"
        },
        option_a: {
          en: "Because each letter triggers the first letter of a color in exact physical order.",
          hi: "क्योंकि प्रत्येक अक्षर सही क्रम में एक रंग के पहले अक्षर को ट्रिगर करता है।",
          gu: "કારણ કે દરેક અક્ષર ચોક્કસ ક્રમમાં એક રંગના પ્રથમ અક્ષરને યાદ કરાવી દે છે."
        },
        option_b: {
          en: "Because rainbow colors don't have real names.",
          hi: "क्योंकि इंद्रधनुष के रंगों के कोई वास्तविक नाम नहीं होते।",
          gu: "કારણ કે મેઘધનુષના રંગોના કોઈ સાચા નામ નથી હોતા."
        },
        feedback: {
          en: "Correct! 'VIBGYOR' anchors 7 separate color names into one single memorable 7-letter key.",
          hi: "सही! 'VIBGYOR' सात अलग-अलग रंगों को एक आसान 7-अक्षर की चाबी में बदल देता है।",
          gu: "સાચું! 'VIBGYOR' સાત અલગ-અલગ રંગોના નામોને એક જ યાદ રહી જાય તેવી ૭-અક્ષરની ચાવીમાં જોડી દે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "clue_key",
        question: {
          en: "You need to remember the 4 stages of a butterfly's life cycle: Egg, Caterpillar (Larva), Pupa (Chrysalis), and Adult Butterfly. Which retrieval cue phrase best locks in the order (E-C-P-B)?",
          hi: "आपको तितली के जीवन चक्र के 4 चरणों को याद रखना है: Egg (अंडा), Caterpillar (इल्ली), Pupa (प्यूपा), Butterfly (तितली)। कौन सा मेमोरी हुक (E-C-P-B) सबसे अच्छा काम करेगा?",
          gu: "તમારે પતંગિયાના જીવનચક્રના ૪ તબક્કા યાદ રાખવા છે: Egg (ઈંડું), Caterpillar (ઈયળ), Pupa (પ્યુપા), Butterfly (પતંગિયું). કયું મેમરી હૂક વાક્ય (E-C-P-B) ક્રમ સાચવવા શ્રેષ્ઠ છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "'Every Cute Puppy Barks' (E-C-P-B)",
              hi: "'Every Cute Puppy Barks' (E-C-P-B)",
              gu: "'Every Cute Puppy Barks' (E-C-P-B)"
            }
          },
          {
            id: "B",
            text: {
              en: "'Butterflies fly high in the blue sky'",
              hi: "'Butterflies fly high in the blue sky'",
              gu: "'Butterflies fly high in the blue sky'"
            }
          },
          {
            id: "C",
            text: {
              en: "'Plants need water and sunlight'",
              hi: "'Plants need water and sunlight'",
              gu: "'Plants need water and sunlight'"
            }
          },
          {
            id: "D",
            text: {
              en: "'Read the chapter 5 times'",
              hi: "'Read the chapter 5 times'",
              gu: "'Read the chapter 5 times'"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! 'Every Cute Puppy Barks' uses the first letters (E-C-P-B) as an infallible retrieval cue for Egg → Caterpillar → Pupa → Butterfly!",
          hi: "शानदार! 'Every Cute Puppy Barks' के पहले अक्षर (E-C-P-B) अंडा → इल्ली → प्यूपा → तितली के क्रम को तुरंत याद दिला देते हैं!",
          gu: "એકદમ સાચું! 'Every Cute Puppy Barks' ના પહેલા અક્ષરો (E-C-P-B) ઈંડું → ઈયળ → પ્યુપા → પતંગિયું નો ક્રમ તરત જ યાદ કરાવી દે છે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "clue_key",
        title: {
          en: "Anchor Cue Superpower",
          hi: "एंकर क्यू सुपरपावर",
          gu: "એન્કર ક્યૂ સુપરપાવર"
        },
        body: {
          en: "Create catchy acronyms and silly sentences to unlock long lists instantly.",
          hi: "लंबी सूचियों को तुरंत याद करने के लिए मजेदार संक्षिप्त नाम और कोड वाक्य बनाएं।",
          gu: "લાંબી યાદીઓને તાત્કાલિક યાદ કરવા માટે મજેદાર ટૂંકાક્ષરી અને કોડ વાક્યો બનાવો."
        },
        tags: [
          { en: "Memory Hook", hi: "मेमोरी हुक", gu: "મેમરી હૂક" },
          { en: "Acronym Key", hi: "एक्रोनिम चाबी", gu: "એક્રોનિમ ચાવી" },
          { en: "Silly Phrases", hi: "मजेदार वाक्य", gu: "રમૂજી વાક્ય" },
          { en: "First-Letter Code", hi: "प्रथम-अक्षर कोड", gu: "પ્રથમ-અક્ષર કોડ" },
          { en: "Search Handle", hi: "सर्च हैंडल", gu: "સર્ચ હેન્ડલ" },
          { en: "Instant Unlock", hi: "त्वरित अनलॉक", gu: "ઝડપી અનલૉક" }
        ]
      },
      {
        type: "action_checklist",
        icon: "clue_key",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Write down the list of items you need to remember in exact order.",
              hi: "उन चीजों की सूची लिखें जिन्हें आपको ठीक उसी क्रम में याद रखना है।",
              gu: "તમારે જે મુદ્દા ક્રમમાં યાદ રાખવા છે તેની યાદી લખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Circle the first letter of each item (e.g. M-V-E-M-J-S-U-N).",
              hi: "प्रत्येक बिंदु के पहले अक्षर पर गोला लगाएं (जैसे M-V-E-M-J-S-U-N)।",
              gu: "દરેક મુદ્દાના પહેલા અક્ષર પર ગોળ કરો (જેમ કે M-V-E-M-J-S-U-N)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Create a memorable silly sentence where each word begins with those letters.",
              hi: "एक मजेदार वाक्य बनाएं जिसमें प्रत्येक शब्द उन्हीं अक्षरों से शुरू हो।",
              gu: "એક રમૂજી વાક્ય બનાવો જેમાં દરેક શબ્દ તે જ અક્ષરોથી શરૂ થતો હોય."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Picture the silly phrase vividly in your mind to unlock the full list anytime.",
              hi: "पूरी सूची को कभी भी याद करने के लिए उस मजेदार वाक्य की स्पष्ट कल्पना करें।",
              gu: "આખી યાદી ગમે ત્યારે યાદ કરવા તે રમૂજી વાક્યની મનમાં જીવંત કલ્પના કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "clue_key",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Create a funny 4-word acronym sentence for any list in Science or Social Studies today and share it with a friend!",
          hi: "आज विज्ञान या सामाजिक विज्ञान की किसी भी सूची के लिए 4-शब्दों का मजेदार कोड वाक्य बनाएं और मित्र को सुनाएं!",
          gu: "આજે વિજ્ઞાન કે સામાજિક વિજ્ઞાનની કોઈપણ યાદી માટે ૪-શબ્દોનું મજેદાર કોડ વાક્ય બનાવો અને મિત્ર સાથે શેર કરો!"
        },
        commitment_button_text: {
          en: "I will unlock facts with retrieval cues!",
          hi: "मैं मेमोरी हुक से ज्ञान अनलॉक करूँगा!",
          gu: "હું મેમરી હૂકથી જ્ઞાન અનલૉક કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_50",
    methodNumber: 50,
    classLevel: 5,
    category: {
      en: "Reading / Information Processing",
      hi: "पढ़ना / सूचना प्रसंस्करण",
      gu: "વાંચન / માહિતી પ્રક્રિયા"
    },
    title: {
      en: "Skimming (Eagle-Eye Flight)",
      hi: "स्किमिंग (चील की नजर / मुख्य विचार स्कैन)",
      gu: "સ્કિમિંગ (ગરુડ દ્રષ્ટિ / મુખ્ય વિચાર સ્કેન)"
    },
    description: {
      en: "Glide rapidly over headings, first sentences, and concluding paragraphs to extract the core message in 30 seconds before deep reading.",
      hi: "गहराई से पढ़ने से पहले 30 सेकंड में मुख्य संदेश जानने के लिए शीर्षकों, पहले वाक्यों और निष्कर्ष पर तेजी से नजर दौड़ाएं।",
      gu: "ઊંડાણપૂર્વક વાંચતા પહેલાં ૩૦ સેકન્ડમાં મુખ્ય સંદેશ જાણવા માટે શીર્ષકો, પ્રથમ વાક્યો અને નિષ્કર્ષ પર ઝડપથી નજર ફેરવો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "fast_forward_scan",
        title: {
          en: "Reading Every Single Word Slowly and Running Out of Time?",
          hi: "हर एक शब्द को धीरे-धीरे पढ़ते हुए समय खत्म हो जाता है?",
          gu: "દરેક શબ્દને ધીમે-ધીમે વાંચતાં સમય પૂરો થઈ જાય છે?"
        },
        pain_quotes: [
          {
            en: "In reading comprehension tests, I spend 15 minutes reading the passage and have only 2 minutes left for questions!",
            hi: "कॉम्प्रिहेंशन टेस्ट में मुझे गद्यांश पढ़ने में 15 मिनट लग जाते हैं और प्रश्नों के लिए सिर्फ 2 मिनट बचते हैं!",
            gu: "વાંચન કસોટીમાં ફકરો વાંચવામાં જ ૧૫ મિનિટ નીકળી જાય છે અને પ્રશ્નો માટે માત્ર ૨ મિનિટ બચે છે!"
          },
          {
            en: "I read long chapters word-by-word without knowing what the main point is until the very end!",
            hi: "मैं अंत तक जाने बिना एक-एक शब्द पढ़ता रहता हूँ और मुख्य विचार समझ ही नहीं आता!",
            gu: "હું છેલ્લે સુધી ખબર પડ્યા વગર એક-એક શબ્દ વાંચતો રહું છું અને મુખ્ય વિચાર સમજાતો જ નથી!"
          }
        ],
        body: {
          en: "Reading word-by-word on your first pass is like walking with your eyes fixed on the floor. 'Skimming' is flying above the landscape to map out the big ideas first!",
          hi: "पहली बार में एक-एक शब्द पढ़ना जमीन पर नजर गड़ाकर चलने जैसा है। 'स्किमिंग' आकाश से उड़ते हुए पहले पूरे नक्शे को समझना है!",
          gu: "પહેલી જ વારમાં એક-એક શબ્દ વાંચવો એ જમીન પર નજર રાખીને ચાલવા જેવું છે. 'સ્કિમિંગ' આકાશમાંથી ઊડતાં પહેલાં આખા નકશાને સમજી લેવા જેવું છે!"
        },
        key_takeaway: {
          en: "Eagle-Eye Rule: Read Title → Headings → First Sentence of each paragraph → Final Summary!",
          hi: "चील की नजर नियम: शीर्षक → उपशीर्षक → प्रत्येक अनुच्छेद का पहला वाक्य → अंतिम सारांश!",
          gu: "ગરુડ દ્રષ્ટિ નિયમ: શીર્ષક → પેટાશીર્ષક → દરેક ફકરાનું પહેલું વાક્ય → અંતિમ સારાંશ!"
        }
      },
      {
        type: "relatable_story",
        icon: "fast_forward_scan",
        title: {
          en: "Meet Aarav",
          hi: "आरव से मिलें",
          gu: "મળો આરવને"
        },
        story: {
          en: "Aarav had 10 minutes in the library to find information on Renewable Energy. He tried reading every word of a 6-page chapter and only reached page 2. His tutor taught him Eagle-Eye Skimming: in 45 seconds, he read the bold headings and first sentences and found the exact page on Solar Power!",
          hi: "आरव के पास लाइब्रेरी में 'नवीकरणीय ऊर्जा' पर जानकारी खोजने के लिए 10 मिनट थे। उसने 6 पन्नों के अध्याय का हर शब्द पढ़ना शुरू किया और सिर्फ पेज 2 तक पहुँच सका। शिक्षक ने स्किमिंग सिखाई: 45 सेकंड में शीर्षकों और पहले वाक्यों को देखकर उसने सीधे सौर ऊर्जा वाला पन्ना खोज लिया!",
          gu: "આરવ પાસે પુસ્તકાલયમાં 'પુનઃપ્રાપ્ય ઊર્જા' પર માહિતી શોધવા ૧૦ મિનિટ હતી. તેણે ૬ પાનાના પ્રકરણનો દરેક શબ્દ વાંચવાનું શરૂ કર્યું અને માત્ર પેજ ૨ સુધી પહોંચી શક્યો. શિક્ષકે સ્કિમિંગ શીખવ્યું: ૪૫ સેકન્ડમાં હેડિંગ્સ અને પહેલા વાક્યો જોઈને તેણે સીધું સૌર ઊર્જાવાળું પાનું શોધી લીધું!"
        },
        insight_box: {
          en: "Top-Down Navigation: Authors put 80% of their main idea in the title and the first line of each paragraph.",
          hi: "शीर्ष-से-आधार सिद्धांत: लेखक अपने मुख्य विचार का 80% भाग शीर्षक और प्रत्येक अनुच्छेद की पहली पंक्ति में रखते हैं।",
          gu: "ટોપ-ડાઉન સિદ્ધાંત: લેખકો પોતાના મુખ્ય વિચારનો ૮૦% ભાગ શીર્ષક અને દરેક ફકરાની પહેલી લીટીમાં મૂકે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "fast_forward_scan",
        question: {
          en: "What is the primary goal of Skimming before reading a long passage in detail?",
          hi: "विस्तार से पढ़ने से पहले किसी लंबे गद्यांश की स्किमिंग करने का मुख्य उद्देश्य क्या है?",
          gu: "વિગતવાર વાંચતા પહેલાં કોઈ લાંબા ફકરાનું સ્કિમિંગ કરવાનો મુખ્ય હેતુ શું છે?"
        },
        option_a: {
          en: "To memorize every single date and number in the text.",
          hi: "पाठ में दी गई हर तारीख और संख्या को याद करना।",
          gu: "પાઠમાં આપેલી દરેક તારીખ અને સંખ્યા ગોખી લેવી."
        },
        option_b: {
          en: "To get the overall gist and structural map of the text in under 1 minute.",
          hi: "1 मिनट से कम समय में पूरे पाठ का मुख्य विचार और ढांचा समझ लेना।",
          gu: "૧ મિનિટથી ઓછા સમયમાં આખા પાઠનો મુખ્ય વિચાર અને માળખું સમજી લેવું."
        },
        feedback: {
          en: "Correct! Skimming provides an instant mental road-map so your brain knows where to look for details later.",
          hi: "सही! स्किमिंग दिमाग को एक मानसिक नक्शा देती है ताकि बाद में विवरण खोजना आसान हो सके।",
          gu: "સાચું! સ્કિમિંગ મગજને એક નકશો આપે છે જેથી પછીથી વિગતો શોધવી સરળ બને છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "fast_forward_scan",
        question: {
          en: "You have 30 seconds to skim a 3-paragraph article: \n- Title: 'Electric Cars on the Rise' \n- Para 1 First Line: 'Electric vehicles produce zero tailpipe emissions.' \n- Para 2 First Line: 'Battery charging networks are expanding across major highways.' \n- Para 3 First Line: 'In conclusion, cleaner transport will define our future.' \nWhat is the main idea of this article?",
          hi: "30 सेकंड में स्किम करें: \n- शीर्षक: 'इलेक्ट्रिक कारों का उदय' \n- पहला वाक्य: 'इलेक्ट्रिक वाहन शून्य प्रदूषण करते हैं।' \n- दूसरा वाक्य: 'हाईवे पर चार्जिंग नेटवर्क बढ़ रहे हैं।' \n- तीसरा वाक्य: 'निष्कर्षतः, स्वच्छ परिवहन हमारा भविष्य है।' \nइस लेख का मुख्य विचार क्या है?",
          gu: "૩૦ સેકન્ડમાં સ્કિમ કરો: \n- શીર્ષક: 'ઇલેક્ટ્રિક કારનો ઉદય' \n- પહેલું વાક્ય: 'ઇલેક્ટ્રિક વાહનો શૂન્ય પ્રદૂષણ ફેલાવે છે.' \n- બીજું વાક્ય: 'હાઇવે પર ચાર્જિંગ નેટવર્ક વધી રહ્યું છે.' \n- ત્રીજું વાક્ય: 'નિષ્કર્ષમાં, સ્વચ્છ વાહનવ્યવહાર આપણું ભવિષ્ય છે.' \nઆ લેખનો મુખ્ય વિચાર શું છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Gasoline cars are cheaper than electric cars",
              hi: "पेट्रोल कारें इलेक्ट्रिक कारों से सस्ती हैं",
              gu: "પેટ્રોલ કાર ઇલેક્ટ્રિક કાર કરતાં સસ્તી છે"
            }
          },
          {
            id: "B",
            text: {
              en: "Electric cars are growing rapidly as a cleaner future for transportation",
              hi: "इलेक्ट्रिक कारें स्वच्छ परिवहन के भविष्य के रूप में तेजी से बढ़ रही हैं",
              gu: "ઇલેક્ટ્રિક કાર સ્વચ્છ પરિવહનના ભવિષ્ય તરીકે ઝડપથી વધી રહી છે"
            }
          },
          {
            id: "C",
            text: {
              en: "Bicycles are replacing all four-wheelers",
              hi: "साइकिलें सभी चार पहिया वाहनों की जगह ले रही हैं",
              gu: "સાયકલો બધાં ચાર પૈડાંવાળા વાહનોની જગ્યા લઈ રહી છે"
            }
          },
          {
            id: "D",
            text: {
              en: "How to repair a car battery at home",
              hi: "घर पर कार की बैटरी की मरम्मत कैसे करें",
              gu: "ઘરે કારની બેટરી કેવી રીતે રીપેર કરવી"
            }
          }
        ],
        correct_option: "B",
        feedback: {
          en: "Brilliant! Skimming the title and leading sentences reveals the core theme in seconds without reading every word!",
          hi: "शानदार! शीर्षक और पहले वाक्यों को स्किम करने से बिना हर शब्द पढ़े मुख्य विषय सेकंडों में समझ आ गया!",
          gu: "ઉત્તમ! શીર્ષક અને પહેલા વાક્યો સ્કિમ કરવાથી આખો ફકરો વાંચ્યા વગર મુખ્ય વિષય સેકન્ડોમાં સમજાઈ ગયો!"
        }
      },
      {
        type: "strategy_pills",
        icon: "fast_forward_scan",
        title: {
          en: "Eagle-Eye Superpower",
          hi: "चील की नजर सुपरपावर",
          gu: "ગરુડ દ્રષ્ટિ સુપરપાવર"
        },
        body: {
          en: "Fly high over the text to map out the big ideas before diving in.",
          hi: "विस्तार में जाने से पहले मुख्य विचारों का नक्शा बनाने के लिए ऊपर से सरसरी नजर डालें।",
          gu: "ઊંડાણમાં ઉતરતા પહેલાં મુખ્ય વિચારોનો નકશો બાંધવા ઉપરથી ઝડપી નજર ફેરવો."
        },
        tags: [
          { en: "Read Title", hi: "शीर्षक पढ़ें", gu: "શીર્ષક વાંચો" },
          { en: "Headings First", hi: "उपशीर्षक पहले", gu: "હેડિંગ્સ પહેલાં" },
          { en: "First Sentence", hi: "पहला वाक्य", gu: "પ્રથમ વાક્ય" },
          { en: "Bold Words", hi: "मोटे शब्द", gu: "ઘાટા અક્ષરો" },
          { en: "Conclusion Check", hi: "निष्कर्ष जांच", gu: "નિષ્કર્ષ તપાસ" },
          { en: "30-Sec Gist", hi: "30-सेकंड सार", gu: "૩૦-સેકન્ડ સાર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "fast_forward_scan",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Read the title and any subheadings to identify the broad topic.",
              hi: "मुख्य विषय की पहचान करने के लिए शीर्षक और उपशीर्षक पढ़ें।",
              gu: "મુખ્ય વિષય ઓળખવા માટે શીર્ષક અને પેટાશીર્ષકો વાંચો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Read ONLY the first sentence of each paragraph to track idea progression.",
              hi: "विचारों के प्रवाह को समझने के लिए केवल प्रत्येक अनुच्छेद का पहला वाक्य पढ़ें।",
              gu: "વિચારોનો પ્રવાહ સમજવા માત્ર દરેક ફકરાનું પહેલું જ વાક્ય વાંચો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Glance at bold terms, bullet points, charts, or diagrams.",
              hi: "मोटे अक्षरों, बुलेट बिंदुओं, चार्ट या चित्रों पर त्वरित नजर डालें।",
              gu: "ઘાટા અક્ષરો, મુદ્દાઓ, ચાર્ટ કે ચિત્રો પર ઝડપી નજર નાખો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Read the final paragraph or summary sentence to lock in the main takeaway.",
              hi: "मुख्य निष्कर्ष को समझने के लिए अंतिम अनुच्छेद या सारांश वाक्य पढ़ें।",
              gu: "મુખ્ય તારણ સમજવા માટે છેલ્લો ફકરો અથવા સારાંશ વાક્ય વાંચો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "fast_forward_scan",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Pick any 2-page news article or textbook chapter today and skim it in 60 seconds using the Eagle-Eye rule!",
          hi: "आज 2-पेज का कोई समाचार लेख या पाठ्यपुस्तक अध्याय चुनें और चील की नजर नियम से 60 सेकंड में स्किम करें!",
          gu: "આજે ૨ પાનાનો કોઈ સમાચાર લેખ કે પાઠ પસંદ કરો અને ગરુડ દ્રષ્ટિ નિયમથી ૬૦ સેકન્ડમાં સ્કિમ કરો!"
        },
        commitment_button_text: {
          en: "I will skim for big ideas first!",
          hi: "मैं पहले मुख्य विचारों को स्किम करूँगा!",
          gu: "હું પહેલાં મુખ્ય વિચારો સ્કિમ કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_66",
    methodNumber: 66,
    classLevel: 5,
    category: {
      en: "Reading / Information Processing",
      hi: "पढ़ना / सूचना प्रसंस्करण",
      gu: "વાંચન / માહિતી પ્રક્રિયા"
    },
    title: {
      en: "Signal-Word Detection (Traffic Signal Words)",
      hi: "संकेत-शब्द पहचान (ट्रैफिक सिग्नल शब्द)",
      gu: "સંકેત-શબ્દ ઓળખ (ટ્રાફિક સિગ્નલ શબ્દો)"
    },
    description: {
      en: "Spot transition keywords (However, Because, Therefore, In contrast) that act as road signs steering the author's logic.",
      hi: "संक्रमण शब्दों (हालाँकि, क्योंकि, इसलिए, इसके विपरीत) को पहचानें जो लेखक के तर्क को मोड़ने वाले रोड साइन की तरह काम करते हैं।",
      gu: "સંક્રમણ શબ્દો (જોકે, કારણ કે, તેથી, આનાથી વિપરીત) ને ઓળખો જે લેખકના તર્કને દિશા આપતા રોડ સાઇન જેવા છે."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "traffic_signal_words",
        title: {
          en: "Missing the 'Plot Twist' in Reading Passages?",
          hi: "पैसेज पढ़ते समय लेखक के विचार का अचानक यू-टर्न छूट जाता है?",
          gu: "ફકરો વાંચતી વખતે લેખકના વિચારનો અચાનક વળાંક ચૂકી જાઓ છો?"
        },
        pain_quotes: [
          {
            en: "I thought the author liked plastic bags until a question asked for the counterargument!",
            hi: "मुझे लगा कि लेखक प्लास्टिक बैग के पक्ष में है, जब तक कि प्रश्न में उसका विरोध नहीं पूछा गया!",
            gu: "મને લાગ્યું કે લેખક પ્લાસ્ટિક બેગની તરફેણમાં છે, જ્યાં સુધી પ્રશ્નમાં તેનો વિરોધ ન પૂછાયો!"
          },
          {
            en: "I breeze past words like 'Although' and 'However' without realizing the sentence just flipped 180 degrees!",
            hi: "मैं 'हालाँकि' और 'लेकिन' जैसे शब्दों पर ध्यान दिए बिना आगे बढ़ जाता हूँ और पूरा अर्थ बदल जाता है!",
            gu: "હું 'જોકે' અને 'પરંતુ' જેવા શબ્દો પર ધ્યાન આપ્યા વિના વાંચી લઉં છું અને આખો અર્થ બદલાઈ જાય છે!"
          }
        ],
        body: {
          en: "Signal words are the traffic lights of reading. Words like 'Furthermore' mean Green Light (add more), while 'However' and 'On the other hand' mean Red Light / Sharp U-Turn (opposite idea).",
          hi: "संकेत शब्द पढ़ने के ट्रैफिक सिग्नल हैं। 'इसके अतिरिक्त' का अर्थ है हरी बत्ती (और जानकारी), जबकि 'हालाँकि' और 'लेकिन' का अर्थ है लाल बत्ती/यू-टर्न (विपरीत विचार)।",
          gu: "સંકેત શબ્દો વાંચનના ટ્રાફિક સિગ્નલ છે. 'આ ઉપરાંત' નો અર્થ છે લીલી બત્તી (વધુ માહિતી), જ્યારે 'જોકે' અને 'પરંતુ' નો અર્થ છે લાલ બત્તી/યુ-ટર્ન (વિરોધી વિચાર)."
        },
        key_takeaway: {
          en: "Traffic Rule: Spot Continuation words (And, Also) vs. Turnaround words (However, But, Although)!",
          hi: "ट्रैफिक नियम: आगे बढ़ने वाले शब्दों (और, भी) बनाम विचार मोड़ने वाले शब्दों (लेकिन, हालाँकि) को पहचानें!",
          gu: "ટ્રાફિક નિયમ: આગળ વધારતા શબ્દો (અને, પણ) વિરુદ્ધ વિચાર વાળતા શબ્દો (પરંતુ, જોકે) ને પકડો!"
        }
      },
      {
        type: "relatable_story",
        icon: "traffic_signal_words",
        title: {
          en: "Meet Ishita",
          hi: "इशिता से मिलें",
          gu: "મળો ઇશિતાને"
        },
        story: {
          en: "Ishita read: 'Cheetahs run faster than any land animal. However, they tire within 60 seconds.' She only remembered the speed and failed the test question asking why cheetahs often lose their prey! Once she began circling 'However', she never missed an author's twist again.",
          hi: "इशिता ने पढ़ा: 'चीता सबसे तेज दौड़ता है। हालाँकि, वह 60 सेकंड में थक जाता है।' उसने सिर्फ गति याद रखी और शिकार छूटने वाला सवाल गलत कर दिया! जब उसने 'हालाँकि' पर गोला लगाना शुरू किया, तो उसकी कभी कोई गलती नहीं हुई।",
          gu: "ઇશિતાએ વાંચ્યું: 'ચિત્તો સૌથી ઝડપી દોડે છે. જોકે, તે ૬૦ સેકન્ડમાં થાકી જાય છે.' તેણે માત્ર ઝડપ યાદ રાખી અને શિકાર છૂટી જવાનો સવાલ ખોટો પડ્યો! જ્યારે તેણે 'જોકે' પર ગોળ કરવાનું શરૂ કર્યું, ત્યારે કોઈ ભૂલ ન થઈ."
        },
        insight_box: {
          en: "Signal Decoder: 'However' warns you that the REAL important point or exception is arriving in the next sentence.",
          hi: "सिग्नल डिकोडर: 'हालाँकि/लेकिन' चेतावनी देता है कि असली मुख्य बिंदु या अपवाद अगले वाक्य में आने वाला है।",
          gu: "સિગ્નલ ડીકોડર: 'જોકે/પરંતુ' ચેતવણી આપે છે કે સાચો મુખ્ય મુદ્દો કે અપવાદ હવે પછીના વાક્યમાં આવવાનો છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "traffic_signal_words",
        question: {
          en: "In the sentence: 'Solar energy is completely free; THEREFORE, many schools are installing solar panels.', what does the signal word 'THEREFORE' indicate?",
          hi: "वाक्य में: 'सौर ऊर्जा पूरी तरह मुफ्त है; इसलिए, कई स्कूल सोलर पैनल लगा रहे हैं।' शब्द 'इसलिए' क्या दर्शाता है?",
          gu: "વાક્યમાં: 'સૌર ઊર્જા તદ્દન મફત છે; તેથી, ઘણી શાળાઓ સોલર પેનલ લગાવી રહી છે.' શબ્દ 'તેથી' શું દર્શાવે છે?"
        },
        option_a: {
          en: "Cause → Effect (A direct result/conclusion of the first fact).",
          hi: "कारण → परिणाम (पहले तथ्य का सीधा निष्कर्ष या परिणाम)।",
          gu: "કારણ → પરિણામ (પહેલી હકીકતનું સીધું તારણ કે પરિણામ)."
        },
        option_b: {
          en: "A sudden disagreement with solar power.",
          hi: "सौर ऊर्जा से अचानक असहमति।",
          gu: "સૌર ઊર્જા સાથે અચાનક અસંમતિ."
        },
        feedback: {
          en: "Correct! 'Therefore' signals an Effect/Result arising logically from the preceding Cause.",
          hi: "सही! 'इसलिए' पिछले कारण से निकलने वाले परिणाम या निष्कर्ष का संकेत देता है।",
          gu: "સાચું! 'તેથી' આગળના કારણમાંથી નીકળતા તાર્કિક પરિણામ કે નિષ્કર્ષનો સંકેત આપે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "traffic_signal_words",
        question: {
          en: "Read this statement: 'Heavy rains flooded the valley. IN CONTRAST, the neighboring plateau remained dry and sunny.' \nWhat does the signal phrase 'IN CONTRAST' tell the reader?",
          hi: "वाक्य पढ़ें: 'भारी बारिश से घाटी में बाढ़ आ गई। इसके विपरीत, पड़ोसी पठार सूखा और धूप वाला रहा।' \nसंकेत पद 'इसके विपरीत' पाठक को क्या बताता है?",
          gu: "વાક્ય વાંચો: 'ભારે વરસાદથી ખીણમાં પૂર આવ્યું. આનાથી વિપરીત, બાજુનો ઉચ્ચપ્રદેશ સૂકો અને તડકાવાળો રહ્યો.' \nસંકેત શબ્દસમૂહ 'આનાથી વિપરીત' વાચકને શું જણાવે છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "The two geographic regions experienced opposite weather conditions",
              hi: "दोनों भौगोलिक क्षेत्रों में बिल्कुल विपरीत मौसम रहा",
              gu: "બંને ભૌગોલિક વિસ્તારોમાં તદ્દન વિરોધી હવામાન રહ્યું"
            }
          },
          {
            id: "B",
            text: {
              en: "Both regions had identical rainfall",
              hi: "दोनों क्षेत्रों में एक समान बारिश हुई",
              gu: "બંને વિસ્તારોમાં સરખો વરસાદ પડ્યો"
            }
          },
          {
            id: "C",
            text: {
              en: "The valley has no water",
              hi: "घाटी में कोई पानी नहीं है",
              gu: "ખીણમાં કોઈ પાણી નથી"
            }
          },
          {
            id: "D",
            text: {
              en: "The plateau flooded first",
              hi: "पठार में पहले बाढ़ आई",
              gu: "ઉચ્ચપ્રદેશમાં પહેલાં પૂર આવ્યું"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Masterful! 'In Contrast' is a comparative turnaround signal showing two opposing realities side-by-side.",
          hi: "शानदार! 'इसके विपरीत' एक तुलनात्मक सिग्नल है जो दो विरोधी स्थितियों को आमने-सामने दिखाता है।",
          gu: "ઉત્તમ! 'આનાથી વિપરીત' એક તુલનાત્મક સંકેત છે જે બે વિરોધી પરિસ્થિતિઓને સામસામે મૂકે છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "traffic_signal_words",
        title: {
          en: "Signal Decoder Superpower",
          hi: "सिग्नल डिकोडर सुपरपावर",
          gu: "સિગ્નલ ડીકોડર સુપરપાવર"
        },
        body: {
          en: "Watch for transition road signs to anticipate twists and conclusions.",
          hi: "विचारों के मोड़ और निष्कर्षों को पहले ही भांपने के लिए रोड साइन शब्दों पर नजर रखें।",
          gu: "વિચારોના વળાંક અને નિષ્કર્ષને પહેલેથી પારખવા માટે રોડ સાઇન શબ્દો પર નજર રાખો."
        },
        tags: [
          { en: "However (U-Turn)", hi: "हालाँकि (यू-टर्न)", gu: "જોકે (યુ-ટર્ન)" },
          { en: "Therefore (Result)", hi: "इसलिए (परिणाम)", gu: "તેથી (પરિણામ)" },
          { en: "Because (Reason)", hi: "क्योंकि (कारण)", gu: "કારણ કે (કારણ)" },
          { en: "In Contrast (Opposite)", hi: "इसके विपरीत (अंतर)", gu: "વિપરીત (તફાવત)" },
          { en: "Furthermore (Add)", hi: "इसके अलावा (जोड़ें)", gu: "ઉપરાંત (ઉમેરો)" },
          { en: "Traffic Lights", hi: "ट्रैफिक लाइट", gu: "ટ્રાફિક લાઇટ" }
        ]
      },
      {
        type: "action_checklist",
        icon: "traffic_signal_words",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Scan sentences for transition words (However, Therefore, Although, Because).",
              hi: "वाक्यों में संक्रमण शब्दों (हालाँकि, इसलिए, यद्यपि, क्योंकि) को पहचानें।",
              gu: "વાક્યોમાં સંક્રમણ શબ્દો (જોકે, તેથી, જોકે, કારણ કે) ને પકડો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Mentally classify the signal: Green (Add info), Yellow (Cause/Effect), or Red (U-Turn).",
              hi: "सिग्नल को वर्गीकृत करें: हरा (अधिक जानकारी), पीला (कारण/परिणाम), या लाल (विचार पलटना)।",
              gu: "સિગ્નલને ઓળખો: લીલો (વધુ માહિતી), પીળો (કારણ/પરિણામ), કે લાલ (વિચાર પલટવો)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Pay special attention to the clause immediately following the signal word.",
              hi: "संकेत शब्द के ठीक बाद आने वाले हिस्से पर विशेष ध्यान दें।",
              gu: "સંકેત શબ્દ પછી તરત આવતા વાક્યના ભાગ પર ખાસ ધ્યાન આપો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Verify how the signal alters the main argument or answers the test question.",
              hi: "जांचें कि सिग्नल ने मुख्य तर्क को कैसे बदला या प्रश्न का सही उत्तर दिया।",
              gu: "ચકાસો કે તે સંકેતે મુખ્ય દલીલને કેવી રીતે બદલી કે પ્રશ્નનો સાચો જવાબ આપ્યો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "traffic_signal_words",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Find 3 signal words ('However', 'Therefore', 'Because') in your English or Science textbook today and explain the logic shift to someone!",
          hi: "आज अपनी अंग्रेजी या विज्ञान की किताब में 3 संकेत शब्द ('हालाँकि', 'इसलिए', 'क्योंकि') खोजें और तर्क समझें!",
          gu: "આજે તમારા અંગ્રેજી કે વિજ્ઞાનના પુસ્તકમાંથી ૩ સંકેત શબ્દો ('જોકે', 'તેથી', 'કારણ કે') શોધો અને તેનો અર્થ સમજો!"
        },
        commitment_button_text: {
          en: "I will navigate with signal words!",
          hi: "मैं संकेत शब्दों से सही अर्थ समझूँगा!",
          gu: "હું સંકેત શબ્દોથી સાચો અર્થ સમજીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_69",
    methodNumber: 69,
    classLevel: 5,
    category: {
      en: "Problem Solving Strategies",
      hi: "समस्या समाधान रणनीतियाँ",
      gu: "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Work Backwards (Rewind the Tape)",
      hi: "पीछे की ओर से हल करें (फिल्म रिवाइंड करें)",
      gu: "પાછળથી ઉકેલો (ફિલ્મ રીવાઇન્ડ કરો)"
    },
    description: {
      en: "Solve multi-step mystery number and reverse-timeline problems by starting at the final result and executing inverse operations in reverse order.",
      hi: "अंतिम परिणाम से शुरू करके और उल्टे क्रम में विपरीत क्रियाएं (+ का -, × का ÷) करके कठिन सवाल हल करें।",
      gu: "અંતિમ પરિણામથી શરૂ કરીને અને ઉલટા ક્રમમાં વિરોધી ક્રિયાઓ (+ નું -, × નું ÷) કરીને અઘરા દાખલા ઉકેલો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "reverse_arrow",
        title: {
          en: "Stuck on Mystery Number & Journey Problems?",
          hi: "रहस्यमयी संख्या और समय-सारणी वाले सवालों में उलझ गए हैं?",
          gu: "રહસ્યમય સંખ્યા અને સમય-સારણીવાળા દાખલાઓમાં અટવાઈ જાઓ છો?"
        },
        pain_quotes: [
          {
            en: "A problem gives 5 steps of changes and the final answer 24, but asks where I started!",
            hi: "सवाल में 5 बदलाव और अंतिम उत्तर 24 दिया है, लेकिन पूछा है कि शुरुआत कहाँ से हुई थी!",
            gu: "દાખલામાં ૫ ફેરફાર અને છેલ્લો જવાબ ૨૪ આપ્યો છે, પણ પૂછ્યું છે કે શરૂઆત ક્યાંથી થઈ હતી!"
          },
          {
            en: "Guessing random starting numbers takes 10 tries and wastes precious exam time!",
            hi: "शुरुआती संख्या का तुक्का लगाने में 10 बार कोशिश करनी पड़ती है और समय बर्बाद होता है!",
            gu: "શરૂઆતની સંખ્યાનો અંદાજ લગાવવામાં ૧૦ વાર પ્રયત્ન કરવો પડે છે અને સમય બગડે છે!"
          }
        ],
        body: {
          en: "Forward thinking fails when the beginning is unknown. 'Working Backwards' is like hitting the REWIND button on a movie—every addition turns into subtraction, and every multiplication turns into division!",
          hi: "जब शुरुआत अज्ञात हो तो आगे की सोच विफल हो जाती है। 'पीछे से हल करना' फिल्म को रिवाइंड करने जैसा है—हर जोड़ घटाव बन जाता है और हर गुणा भाग बन जाता है!",
          gu: "જ્યારે શરૂઆત ખબર ન હોય ત્યારે સીધું વિચારવું મુશ્કેલ બને છે. 'પાછળથી ઉકેલવું' એ ફિલ્મ રીવાઇન્ડ કરવા જેવું છે—દરેક સરવાળો બાદબાકી બને છે અને દરેક ગુણાકાર ભાગાકાર બને છે!"
        },
        key_takeaway: {
          en: "Rewind Rule: Start at End Result → Flip every sign (+ $\\leftrightarrow$ -, $\\times$ $\\leftrightarrow$ $\\div$) → Arrive at Start!",
          hi: "रिवाइंड नियम: अंतिम परिणाम से शुरू करें → हर चिन्ह को उलटें (+ $\\leftrightarrow$ -, $\\times$ $\\leftrightarrow$ $\\div$) → शुरुआत तक पहुँचें!",
          gu: "રીવાઇન્ડ નિયમ: અંતિમ પરિણામથી શરૂ કરો → દરેક ચિહ્ન ઉલટાવો (+ $\\leftrightarrow$ -, $\\times$ $\\leftrightarrow$ $\\div$) → શરૂઆત મેળવો!"
        }
      },
      {
        type: "relatable_story",
        icon: "reverse_arrow",
        title: {
          en: "Meet Rohan",
          hi: "रोहन से मिलें",
          gu: "મળો રોહનને"
        },
        story: {
          en: "Rohan faced this riddle: 'I think of a number. I double it (×2), then add 6 (+6), and the answer is 26. What was my number?' Rohan guessed 5, 8, 12 with no luck. Then he rewound: 26 - 6 = 20, then 20 ÷ 2 = 10! Solved in 4 seconds flat.",
          hi: "रोहन के सामने पहेली थी: 'मैंने एक संख्या सोची। उसे दोगुना किया (×2), फिर 6 जोड़ा (+6), और उत्तर 26 आया। संख्या क्या थी?' रोहन ने तुक्के लगाए। फिर उसने रिवाइंड किया: 26 - 6 = 20, फिर 20 ÷ 2 = 10! सिर्फ 4 सेकंड में हल!",
          gu: "રોહન સામે કોયડો આવ્યો: 'મેં એક સંખ્યા ધારી. તેને બમણી કરી (×૨), પછી ૬ ઉમેર્યા (+૬), અને જવાબ ૨૬ આવ્યો. સંખ્યા કઈ હતી?' રોહને અંદાજો લગાવ્યા. પછી તેણે રીવાઇન્ડ કર્યું: ૨૬ - ૬ = ૨૦, પછી ૨૦ ÷ ૨ = ૧૦! માત્ર ૪ સેકન્ડમાં ઉકેલ!"
        },
        insight_box: {
          en: "Inverse Operation Rule: The opposite of ADD is SUBTRACT; the opposite of MULTIPLY is DIVIDE.",
          hi: "विपरीत संक्रिया नियम: जोड़ का उल्टा घटाव है; गुणा का उल्टा भाग है।",
          gu: "વિરોધી ક્રિયા નિયમ: સરવાળાનું ઊંધું બાદબાકી છે; ગુણાકારનું ઊંધું ભાગાકાર છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "reverse_arrow",
        question: {
          en: "If a riddle says: 'Start $\\rightarrow$ Multiply by 4 $\\rightarrow$ Subtract 10 $\\rightarrow$ End with 30', how do you rewind step 1?",
          hi: "यदि पहेली कहे: 'शुरुआत $\\rightarrow$ 4 से गुणा $\\rightarrow$ 10 घटाएं $\\rightarrow$ अंत 30 पर', तो पहला रिवाइंड कदम क्या होगा?",
          gu: "જો કોયડો કહે: 'શરૂઆત $\\rightarrow$ ૪ વડે ગુણો $\\rightarrow$ ૧૦ બાદ કરો $\\rightarrow$ અંત ૩૦', તો પહેલું રીવાઇન્ડ પગલું શું હશે?"
        },
        option_a: {
          en: "Multiply 30 by 4 = 120.",
          hi: "30 को 4 से गुणा करें = 120।",
          gu: "૩૦ નો ૪ વડે ગુણાકાર કરવો = ૧૨૦."
        },
        option_b: {
          en: "Take the end (30) and do the opposite of Subtract 10: add 10 to get 40 (30 + 10 = 40).",
          hi: "अंतिम संख्या (30) लें और 10 घटाने का उल्टा करें: 10 जोड़कर 40 प्राप्त करें (30 + 10 = 40)।",
          gu: "છેલ્લી સંખ્યા (૩૦) લો અને ૧૦ બાદ કરવાનું ઊંધું કરો: ૧૦ ઉમેરીને ૪૦ મેળવો (૩૦ + ૧૦ = ૪૦)."
        },
        feedback: {
          en: "Correct! The last operation was (-10), so the first rewind step is (+10): 30 + 10 = 40, followed by 40 ÷ 4 = 10.",
          hi: "सही! अंतिम क्रिया (-10) थी, इसलिए पहला रिवाइंड कदम (+10) होगा: 30 + 10 = 40, और फिर 40 ÷ 4 = 10।",
          gu: "સાચું! છેલ્લી ક્રિયા (-૧૦) હતી, તેથી પહેલું રીવાઇન્ડ પગલું (+૧૦) થશે: ૩૦ + ૧૦ = ૪૦, અને પછી ૪૦ ÷ ૪ = ૧૦."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "reverse_arrow",
        question: {
          en: "A baker packed cookies: He gave half (÷2) to a school, then baked 10 more (+10), then sold 15 (-15). He now has 25 cookies left. How many cookies did he start with?",
          hi: "एक बेकर ने कुकीज बनाईं: उसने आधी (÷2) स्कूल को दीं, फिर 10 और बनाईं (+10), फिर 15 बेचीं (-15)। अब उसके पास 25 कुकीज बची हैं। उसने कितनी कुकीज से शुरुआत की थी?",
          gu: "એક બેકરે કૂકીઝ બનાવી: તેણે અડધી (÷૨) શાળાને આપી, પછી ૧૦ નવી બનાવી (+૧૦), પછી ૧૫ વેચી (-૧૫). હવે તેની પાસે ૨૫ કૂકીઝ વધી છે. શરૂઆતમાં કેટલી કૂકીઝ હતી?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "60 cookies (25 + 15 = 40; 40 - 10 = 30; 30 × 2 = 60)",
              hi: "60 कुकीज (25 + 15 = 40; 40 - 10 = 30; 30 × 2 = 60)",
              gu: "૬૦ કૂકીઝ (૨૫ + ૧૫ = ૪૦; ૪૦ - ૧૦ = ૩૦; ૩૦ × ૨ = ૬૦)"
            }
          },
          {
            id: "B",
            text: {
              en: "50 cookies",
              hi: "50 कुकीज",
              gu: "૫૦ કૂકીઝ"
            }
          },
          {
            id: "C",
            text: {
              en: "40 cookies",
              hi: "40 कुकीज",
              gu: "૪૦ કૂકીઝ"
            }
          },
          {
            id: "D",
            text: {
              en: "30 cookies",
              hi: "30 कुकीज",
              gu: "૩૦ કૂકીઝ"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! Step 1: 25 + 15 = 40. Step 2: 40 - 10 = 30. Step 3: 30 × 2 = 60 cookies!",
          hi: "बिल्कुल सही! चरण 1: 25 + 15 = 40। चरण 2: 40 - 10 = 30। चरण 3: 30 × 2 = 60 कुकीज!",
          gu: "એકદમ સાચું! પગલું ૧: ૨૫ + ૧૫ = ૪૦. પગલું ૨: ૪૦ - ૧૦ = ૩૦. પગલું ૩: ૩૦ × ૨ = ૬૦ કૂકીઝ!"
        }
      },
      {
        type: "strategy_pills",
        icon: "reverse_arrow",
        title: {
          en: "Rewind Tape Superpower",
          hi: "रिवाइंड टेप सुपरपावर",
          gu: "રીવાઇન્ડ ટેપ સુપરપાવર"
        },
        body: {
          en: "Start from the finish line and invert every operation to unlock the beginning.",
          hi: "अंतिम छोर से शुरुआत करें और शुरुआती मान पाने के लिए हर क्रिया को उलट दें।",
          gu: "છેલ્લા પરિણામથી શરૂ કરો અને શરૂઆતની કિંમત મેળવવા દરેક ક્રિયા ઉલટાવો."
        },
        tags: [
          { en: "Start at End", hi: "अंत से शुरू", gu: "અંતથી શરૂ" },
          { en: "Flip + to -", hi: "+ को - करें", gu: "+ ને - કરો" },
          { en: "Flip × to ÷", hi: "× को ÷ करें", gu: "× ને ÷ કરો" },
          { en: "Reverse Steps", hi: "उल्टे कदम", gu: "ઉલટા પગલાં" },
          { en: "Mystery Numbers", hi: "रहस्यमयी संख्या", gu: "રહસ્યમય સંખ્યા" },
          { en: "Zero Guessing", hi: "बिना तुक्का", gu: "અંદાજ મુક્ત" }
        ]
      },
      {
        type: "action_checklist",
        icon: "reverse_arrow",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Write down the final ending number given in the problem.",
              hi: "प्रश्न में दिया गया अंतिम परिणामी नंबर लिखें।",
              gu: "દાખલામાં આપેલો છેલ્લો પરિણામી નંબર લખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "List the forward operations in chronological order.",
              hi: "शुरुआत से अंत तक की सभी संक्रियाओं को क्रम में सूचीबद्ध करें।",
              gu: "શરૂઆતથી અંત સુધીની બધી ક્રિયાઓને ક્રમમાં લખો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Work backward from the last step, performing the exact opposite operation (+ $\\rightarrow$ -, $\\times$ $\\rightarrow$ $\\div$).",
              hi: "अंतिम संक्रिया से पीछे की ओर बढ़ें और विपरीत संक्रिया लागू करें (+ का -, × का ÷)।",
              gu: "છેલ્લી ક્રિયાથી પાછળ આવો અને વિરોધી ક્રિયા લાગુ કરો (+ નું -, × નું ÷)."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Test your calculated starting number moving forward to verify 100% accuracy.",
              hi: "100% सटीकता की पुष्टि के लिए प्राप्त शुरुआती संख्या को आगे की दिशा में चलाकर जांचें।",
              gu: "૧૦૦% ખાતરી કરવા માટે મેળવેલી શરૂઆતની સંખ્યાને આગળની દિશામાં ગણીને ચકાસો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "reverse_arrow",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Create a 3-step mystery number riddle (e.g. ×3, +5, ÷2 = 10) and challenge a classmate or parent to solve it backward!",
          hi: "3-चरणों वाली एक पहेली बनाएं (जैसे ×3, +5, ÷2 = 10) और किसी दोस्त या माता-पिता को पीछे से हल करने की चुनौती दें!",
          gu: "૩-પગલાંવાળો એક કોયડો બનાવો (જેમ કે ×૩, +૫, ÷૨ = ૧૦) અને મિત્ર કે વાલીને પાછળથી ઉકેલવા કહો!"
        },
        commitment_button_text: {
          en: "I will rewind problems to solve them backward!",
          hi: "मैं पीछे की ओर से सवाल हल करूँगा!",
          gu: "હું પાછળથી ગણીને દાખલા ઉકેલીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_76",
    methodNumber: 76,
    classLevel: 5,
    category: {
      en: "Problem Solving Strategies",
      hi: "समस्या समाधान रणनीतियाँ",
      gu: "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Simplify the Problem (Scale-Down Model)",
      hi: "समस्या को सरल बनाएं (छोटा मॉडल बनाएं)",
      gu: "સમસ્યાને સરળ બનાવો (નાનું મોડલ બનાવો)"
    },
    description: {
      en: "Swap giant, intimidating numbers with tiny friendly numbers (like 10 and 2) to uncover the hidden formula, then plug back the original values.",
      hi: "छिपे हुए सूत्र को समझने के लिए बड़ी कठिन संख्याओं की जगह छोटी संख्याएं (जैसे 10 और 2) रखकर नियम खोजें।",
      gu: "છુપાયેલા સૂત્રને સમજવા મોટી અઘરી સંખ્યાઓની જગ્યાએ નાની સંખ્યાઓ (જેમ કે ૧૦ અને ૨) મૂકીને નિયમ શોધો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "scale_down_puzzle",
        title: {
          en: "Intimidated by Giant Numbers in Word Problems?",
          hi: "इबारती सवालों में 4-अंकीय और 5-अंकीय संख्याएं देखकर डर लगता है?",
          gu: "વ્યવહારિક દાખલાઓમાં ૪-અંક અને ૫-અંકની મોટી સંખ્યાઓ જોઈને ડર લાગે છે?"
        },
        pain_quotes: [
          {
            en: "When a problem says '5,760 tiles packed into 120 crates', my brain freezes and I don't know whether to multiply or divide!",
            hi: "जब सवाल में '5,760 टाइल्स 120 क्रेट्स में' आता है, तो समझ नहीं आता कि गुणा करें या भाग!",
            gu: "જ્યારે દાખલામાં '૫,૭૬૦ ટાઇલ્સ ૧૨૦ પેટીમાં' આવે, ત્યારે સમજાતું નથી કે ગુણાકાર કરવો કે ભાગાકાર!"
          },
          {
            en: "Huge numbers distract me from seeing the actual relationship between quantities!",
            hi: "बड़ी संख्याएं मुझे राशियों के बीच के असली संबंध को समझने से भटका देती हैं!",
            gu: "મોટી સંખ્યાઓ મને દાખલાના સાચા નિયમને સમજવામાં ગૂંચવી નાખે છે!"
          }
        ],
        body: {
          en: "Big numbers are just disguises. The mathematical operation (addition, subtraction, multiplication, or division) is IDENTICAL whether the numbers are 5,000 or 10. Scale down the problem to see the crystal-clear pattern!",
          hi: "बड़ी संख्याएं केवल एक मुखौटा हैं। गणितीय क्रिया वही रहती है चाहे संख्या 5,000 हो या 10। पैटर्न को साफ देखने के लिए समस्या को छोटा बनाएं!",
          gu: "મોટી સંખ્યાઓ માત્ર એક મુખવટો છે. ગણતરીનો નિયમ એ જ રહે છે ભલે સંખ્યા ૫,૦૦૦ હોય કે ૧૦. સાચો નિયમ પકડવા દાખલાને નાનો બનાવો!"
        },
        key_takeaway: {
          en: "Scale-Down Rule: Replace big numbers with 10 & 2 $\\rightarrow$ Find the operation $\\rightarrow$ Solve with real numbers!",
          hi: "छोटा मॉडल नियम: बड़ी संख्याओं को 10 और 2 से बदलें $\\rightarrow$ क्रिया खोजें $\\rightarrow$ असली संख्याओं से हल करें!",
          gu: "નાનું મોડલ નિયમ: મોટી સંખ્યાઓને ૧૦ અને ૨ થી બદલો $\\rightarrow$ સાચી ક્રિયા શોધો $\\rightarrow$ મૂળ સંખ્યાઓથી ગણો!"
        }
      },
      {
        type: "relatable_story",
        icon: "scale_down_puzzle",
        title: {
          en: "Meet Priya",
          hi: "प्रिया से मिलें",
          gu: "મળો પ્રિયાને"
        },
        story: {
          en: "Priya got stuck on: 'A warehouse has 4,800 bricks stacked equally across 120 pallets. How many bricks per pallet?' She scaled down: 'What if there were 20 bricks on 4 pallets?' That is obviously 20 ÷ 4 = 5. Realizing it was pure division, she calculated 4,800 ÷ 120 = 40 bricks instantly!",
          hi: "प्रिया एक सवाल में अटक गई: 'एक गोदाम में 4,800 ईंटें 120 पैलेट्स में बराबर रखी हैं। प्रति पैलेट कितनी ईंटें हैं?' उसने छोटा मॉडल बनाया: 'अगर 20 ईंटें 4 पैलेट्स पर हों?' यानी 20 ÷ 4 = 5। समझ आ गया कि भाग करना है, उसने तुरंत 4,800 ÷ 120 = 40 हल कर लिया!",
          gu: "પ્રિયા એક દાખલામાં અટવાઈ: 'ગોડાઉનમાં ૪,૮૦૦ ઈંટો ૧૨૦ સ્ટેન્ડ પર સરખી ગોઠવી છે. દરેક સ્ટેન્ડ પર કેટલી ઈંટ?' તેણે નાનું મોડલ બનાવ્યું: 'જો ૨૦ ઈંટ ૪ સ્ટેન્ડ પર હોત તો?' એટલે કે ૨૦ ÷ ૪ = ૫. ભાગાકારનો નિયમ પકડાતાં જ તેણે ૪,૮૦૦ ÷ ૧૨૦ = ૪૦ તરત ગણી નાખ્યું!"
        },
        insight_box: {
          en: "Formula Isolator: Easy numbers strip away cognitive overload, revealing the exact mathematical formula.",
          hi: "सरल सूत्र: आसान संख्याएं मानसिक तनाव को हटाकर सही गणितीय सूत्र को उजागर करती हैं।",
          gu: "સરળ સૂત્ર: સરળ સંખ્યાઓ મગજનો ભાર ઘટાડીને સાચું ગણિત સ્પષ્ટ કરી આપે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "scale_down_puzzle",
        question: {
          en: "Why does temporarily replacing big numbers with simple numbers (like 10 and 2) help solve hard word problems?",
          hi: "कठिन इबारती सवालों में बड़ी संख्याओं को अस्थायी रूप से 10 और 2 जैसी सरल संख्याओं से बदलने से क्या मदद मिलती है?",
          gu: "અઘરા વ્યવહારિક દાખલાઓમાં મોટી સંખ્યાઓને બદલે ૧૦ અને ૨ જેવી સરળ સંખ્યાઓ મૂકવાથી શું ફાયદો થાય છે?"
        },
        option_a: {
          en: "It immediately reveals whether you need to add, subtract, multiply, or divide.",
          hi: "यह तुरंत स्पष्ट कर देता है कि जोड़ना, घटाना, गुणा करना है या भाग देना है।",
          gu: "તે તરત સ્પષ્ટ કરી દે છે કે સરવાળો, બાદબાકી, ગુણાકાર કે ભાગાકાર કરવો."
        },
        option_b: {
          en: "It lets you write 10 as the final answer on your test sheet.",
          hi: "यह आपको टेस्ट में अंतिम उत्तर के रूप में 10 लिखने देता है।",
          gu: "તે તમને પરીક્ષામાં અંતિમ જવાબ તરીકે ૧૦ લખવા દે છે."
        },
        feedback: {
          en: "Correct! Simple numbers illuminate the logical structure without calculation clutter.",
          hi: "सही! सरल संख्याएं बिना गणना के भारी बोझ के तार्किक संबंध को एकदम स्पष्ट कर देती हैं।",
          gu: "સાચું! સરળ સંખ્યાઓ ગણતરીના ભાર વગર સાચા તાર્કિક સંબંધને એકદમ સ્પષ્ટ કરી દે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "scale_down_puzzle",
        question: {
          en: "Problem: 'A factory machine produces 3,600 bolts in 45 minutes. How many bolts does it make in 12 minutes?' \nScale-down test: 10 bolts in 2 min $\\rightarrow$ rate is 10 ÷ 2 = 5 bolts/min $\\rightarrow$ in 3 min: 5 × 3 = 15. \nNow apply to the real numbers: (3,600 ÷ 45) × 12 = ?",
          hi: "सवाल: 'एक मशीन 45 मिनट में 3,600 बोल्ट बनाती है। वह 12 मिनट में कितने बोल्ट बनाएगी?' \nछोटा मॉडल: 2 मिनट में 10 बोल्ट $\\rightarrow$ दर = 10 ÷ 2 = 5 बोल्ट/मिनट $\\rightarrow$ 3 मिनट में: 5 × 3 = 15। \nअसली संख्याओं पर लागू करें: (3,600 ÷ 45) × 12 = ?",
          gu: "દાખલો: 'એક મશીન ૪૫ મિનિટમાં ૩,૬૦૦ બોલ્ટ બનાવે છે. તે ૧૨ મિનિટમાં કેટલા બોલ્ટ બનાવશે?' \nનાનું મોડલ: ૨ મિનિટમાં ૧૦ બોલ્ટ $\\rightarrow$ દર = ૧૦ ÷ ૨ = ૫ બોલ્ટ/મિનિટ $\\rightarrow$ ૩ મિનિટમાં: ૫ × ૩ = ૧૫. \nમૂળ સંખ્યાઓ પર ગણો: (૩,૬૦૦ ÷ ૪૫) × ૧૨ = ?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "960 bolts (3,600 ÷ 45 = 80 per min; 80 × 12 = 960)",
              hi: "960 बोल्ट (3,600 ÷ 45 = 80 प्रति मिनट; 80 × 12 = 960)",
              gu: "૯૬૦ બોલ્ટ (૩,૬૦૦ ÷ ૪૫ = ૮૦ પ્રતિ મિનિટ; ૮૦ × ૧૨ = ૯૬૦)"
            }
          },
          {
            id: "B",
            text: {
              en: "800 bolts",
              hi: "800 बोल्ट",
              gu: "૮૦૦ બોલ્ટ"
            }
          },
          {
            id: "C",
            text: {
              en: "720 bolts",
              hi: "720 बोल्ट",
              gu: "૭૨૦ બોલ્ટ"
            }
          },
          {
            id: "D",
            text: {
              en: "1,200 bolts",
              hi: "1,200 बोल्ट",
              gu: "૧,૨૦૦ બોલ્ટ"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! The scale-down model proved: 1) Divide total by time to find rate (3,600 ÷ 45 = 80), 2) Multiply rate by target time (80 × 12 = 960)!",
          hi: "शानदार! छोटे मॉडल ने सिद्ध किया: 1) दर निकालने के लिए भाग करें (3,600 ÷ 45 = 80), 2) लक्षित समय से गुणा करें (80 × 12 = 960)!",
          gu: "એકદમ સાચું! નાના મોડલે સાબિત કર્યું: ૧) દર શોધવા ભાગાકાર કરો (૩,૬૦૦ ÷ ૪૫ = ૮૦), ૨) સમય સાથે ગુણાકાર કરો (૮૦ × ૧૨ = ૯૬૦)!"
        }
      },
      {
        type: "strategy_pills",
        icon: "scale_down_puzzle",
        title: {
          en: "Scale-Down Model Superpower",
          hi: "छोटा मॉडल सुपरपावर",
          gu: "નાનું મોડલ સુપરપાવર"
        },
        body: {
          en: "Swap giant numbers with friendly numbers to reveal the formula instantly.",
          hi: "सही सूत्र को तुरंत देखने के लिए बड़ी संख्याओं को सरल संख्याओं से बदलें।",
          gu: "સાચું સૂત્ર તરત પકડવા માટે મોટી સંખ્યાઓને સરળ સંખ્યાઓથી બદલો."
        },
        tags: [
          { en: "Use 10 & 2", hi: "10 और 2 का प्रयोग", gu: "૧૦ અને ૨ નો ઉપયોગ" },
          { en: "Find the Formula", hi: "सूत्र खोजें", gu: "સૂત્ર શોધો" },
          { en: "No Overload", hi: "तनावमुक्त सोच", gu: "ભારમુક્ત વિચાર" },
          { en: "Spot Multiply vs Divide", hi: "गुणा या भाग पहचानें", gu: "ગુણાકાર કે ભાગાકાર" },
          { en: "Plug Back Numbers", hi: "असली मान रखें", gu: "મૂળ કિંમત મૂકો" },
          { en: "Clear Logic", hi: "स्पष्ट तर्क", gu: "સ્પષ્ટ તર્ક" }
        ]
      },
      {
        type: "action_checklist",
        icon: "scale_down_puzzle",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Underline the giant, complicated numbers in the word problem.",
              hi: "इबारती सवाल में दी गई बड़ी और कठिन संख्याओं को रेखांकित करें।",
              gu: "વ્યવહારિક દાખલામાં આપેલી મોટી અને અઘરી સંખ્યાઓ નીચે લીટી કરો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Rewrite the problem using super simple numbers (like 10 and 2).",
              hi: "बहुत सरल संख्याओं (जैसे 10 और 2) का उपयोग करके सवाल को दोबारा सोचें।",
              gu: "ખૂબ સરળ સંખ્યાઓ (જેમ કે ૧૦ અને ૨) નો ઉપયોગ કરીને દાખલાને ફરીથી વિચારો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Identify the obvious arithmetic operation needed (+, -, ×, or ÷).",
              hi: "पहचानें कि इस सरल मॉडल में कौन सी संक्रिया (+, -, ×, या ÷) सही बैठती है।",
              gu: "ઓળખો કે આ સરળ મોડલમાં કઈ ક્રિયા (+, -, ×, કે ÷) સાચી બેસે છે."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Plug the original big numbers into that exact formula and calculate.",
              hi: "उसी सूत्र में मूल बड़ी संख्याएं रखें और सटीक उत्तर निकालें।",
              gu: "તે જ સૂત્રમાં મૂળ મોટી સંખ્યાઓ મૂકો અને ચોક્કસ જવાબ ગણો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "scale_down_puzzle",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Find a multi-digit word problem in your math homework today, scale it down to 10 and 2 first, and write down the formula!",
          hi: "आज अपने गणित के गृहकार्य में एक बड़े अंकों वाला सवाल चुनें, पहले 10 और 2 रखकर सूत्र लिखें!",
          gu: "આજે ગણિતના ગૃહકાર્યમાંથી એક મોટા અંકોવાળો દાખલો પસંદ કરો, પહેલાં ૧૦ અને ૨ મૂકીને સૂત્ર લખો!"
        },
        commitment_button_text: {
          en: "I will simplify problems with scale-down models!",
          hi: "मैं छोटे मॉडल से सवाल आसान बनाऊंगा!",
          gu: "હું નાના મોડલથી દાખલા સરળ બનાવીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_78",
    methodNumber: 78,
    classLevel: 5,
    category: {
      en: "Problem Solving Strategies",
      hi: "समस्या समाधान रणनीतियाँ",
      gu: "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Use an Analogy (Bridge to the Familiar)",
      hi: "सादृश्य का उपयोग (परिचित से जोड़ें / एनालॉजी ब्रिज)",
      gu: "સાદૃશ્યનો ઉપયોગ (પરિચિત સાથે જોડો / એનાલોજી બ્રિજ)"
    },
    description: {
      en: "Map unfamiliar complex concepts (like electrical circuits or cell biology) to intuitive everyday systems (like water pipes or school buildings).",
      hi: "अपरिचित जटिल अवधारणाओं (जैसे विद्युत परिपथ या कोशिका) को परिचित दैनिक प्रणालियों (जैसे पानी के पाइप या स्कूल) से जोड़कर समझें।",
      gu: "અપરિચિત અઘરી સંકલ્પનાઓ (જેમ કે વિદ્યુત પરિપથ કે કોષ) ને પરિચિત દૈનિક ઉદાહરણો (જેમ કે પાણીના પાઇપ કે શાળા) સાથે જોડીને સમજો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "bridge_analogy",
        title: {
          en: "Struggling to Grasp Abstract Science & Math Concepts?",
          hi: "अमूर्त विज्ञान और गणित की अवधारणाओं को समझने में कठिनाई होती है?",
          gu: "વિજ્ઞાન અને ગણિતની અટપટી સંકલ્પનાઓ સમજવામાં મુશ્કેલી પડે છે?"
        },
        pain_quotes: [
          {
            en: "I can't see electricity moving inside wires, so circuit questions feel like impossible magic!",
            hi: "मुझे तारों में बिजली बहती नहीं दिखती, इसलिए परिपथ के सवाल जादू जैसे लगते हैं!",
            gu: "મને વાયરમાં વીજળી વહેતી દેખાતી નથી, એટલે સર્કિટના પ્રશ્નો જાદુ જેવા લાગે છે!"
          },
          {
            en: "Memorizing organelle functions in a cell without understanding what they actually DO is frustrating!",
            hi: "कोशिका के अंगों के काम को बिना समझे सिर्फ रटना बहुत निराशाजनक होता है!",
            gu: "કોષના અંગોના કાર્યોને સમજ્યા વગર માત્ર ગોખવું ખૂબ કંટાળાજનક લાગે છે!"
          }
        ],
        body: {
          en: "Your brain understands new things by connecting them to things it ALREADY knows. An 'Analogy Bridge' translates invisible concepts (like electric current) into visible systems (like water flowing through a garden hose).",
          hi: "दिमाग नई चीजों को उन्हीं चीजों से जोड़कर समझता है जिन्हें वह पहले से जानता है। एक 'एनालॉजी ब्रिज' अदृश्य अवधारणाओं (जैसे करंट) को दृश्य प्रणालियों (जैसे पाइप में पानी का बहाव) में बदल देता है।",
          gu: "મગજ નવી બાબતોને તે જ બાબતો સાથે જોડીને સમજે છે જેને તે પહેલેથી જાણે છે. એક 'એનાલોજી બ્રિજ' અદ્રશ્ય બાબતો (જેમ કે કરંટ) ને દ્રશ્ય ઉદાહરણો (જેમ કે પાઇપમાં પાણીનો પ્રવાહ) માં ફેરવી દે છે."
        },
        key_takeaway: {
          en: "Analogy Rule: Find the familiar twin system $\\rightarrow$ Map the corresponding parts $\\rightarrow$ Solve with intuition!",
          hi: "एनालॉजी नियम: परिचित जुड़वां प्रणाली खोजें $\\rightarrow$ हिस्सों की तुलना करें $\\rightarrow$ सहज ज्ञान से हल करें!",
          gu: "એનાલોજી નિયમ: પરિચિત ઉદાહરણ શોધો $\\rightarrow$ ભાગોની સરખામણી કરો $\\rightarrow$ સરળતાથી સમજી લો!"
        }
      },
      {
        type: "relatable_story",
        icon: "bridge_analogy",
        title: {
          en: "Meet Kian",
          hi: "कियान से मिलें",
          gu: "મળો કિયાનને"
        },
        story: {
          en: "Kian couldn't understand why adding a resistor makes a light bulb dimmer. His science teacher built an Analogy Bridge: The battery is a water pump, the wire is a wide pipe, and the resistor is a pinched narrow spot. If water slows down, the waterwheel turns slower! It instantly made total sense.",
          hi: "कियान समझ नहीं पा रहा था कि प्रतिरोधक (रेजिस्टर) लगाने से बल्ब धीमा क्यों हो जाता है। शिक्षक ने वाटर पाइप एनालॉजी दी: बैटरी = पानी का पंप, तार = चौड़ा पाइप, रेजिस्टर = संकरा पाइप। जब पानी धीमा होगा तो पहिया भी धीमा घूमेगा! सब कुछ तुरंत समझ आ गया।",
          gu: "કિયાનને સમજાતું ન હતું કે અવરોધક (રેઝિસ્ટર) લગાવવાથી બલ્બ ધીમો કેમ થાય છે. શિક્ષકે વોટર પાઇપ એનાલોજી આપી: બેટરી = પાણીનો પંપ, વાયર = પહોળો પાઇપ, રેઝિસ્ટર = સાંકડો પાઇપ. જો પાણી ધીમું થાય તો ચક્ર પણ ધીમું ફરે! બધું તરત સમજાઈ ગયું."
        },
        insight_box: {
          en: "Mental Model Mapping: Battery $\\rightarrow$ Pump; Voltage $\\rightarrow$ Pressure; Current $\\rightarrow$ Flow; Resistor $\\rightarrow$ Narrow Pipe.",
          hi: "मानसिक मॉडल तुलना: बैटरी $\\rightarrow$ पंप; वोल्टेज $\\rightarrow$ दबाव; करंट $\\rightarrow$ जल प्रवाह; रेजिस्टर $\\rightarrow$ संकरा पाइप।",
          gu: "માનસિક મોડલ સરખામણી: બેટરી $\\rightarrow$ પંપ; વોલ્ટેજ $\\rightarrow$ દબાણ; કરંટ $\\rightarrow$ પાણીનો પ્રવાહ; રેઝિસ્ટર $\\rightarrow$ સાંકડો પાઇપ."
        }
      },
      {
        type: "method_concept_check",
        icon: "bridge_analogy",
        question: {
          en: "If you compare a biological plant cell to a bustling Factory City, which cell organelle acts as the 'City Power Plant'?",
          hi: "यदि आप एक पौधे की कोशिका की तुलना एक कारखाने वाले शहर से करें, तो कौन सा कोशिकांग 'शहर के पावर प्लांट (ऊर्जा घर)' की तरह काम करता है?",
          gu: "જો તમે વનસ્પતિ કોષની સરખામણી એક કારખાનાવાળા શહેર સાથે કરો, તો કયું અંગિકા 'શહેરના પાવર પ્લાન્ટ (ઊર્જા ઘર)' તરીકે કામ કરે છે?"
        },
        option_a: {
          en: "Mitochondria (produces energy packets for the whole cell).",
          hi: "माइटोकॉन्ड्रिया (पूरी कोशिका के लिए ऊर्जा का उत्पादन करता है)।",
          gu: "માઇટોકોન્ડ્રિયા / કણાભસૂત્ર (આખા કોષ માટે ઊર્જાનું ઉત્પાદન કરે છે)."
        },
        option_b: {
          en: "The cell wall (outer boundary bricks).",
          hi: "कोशिका भित्ति (बाहरी सुरक्षा दीवार)।",
          gu: "કોષદીવાલ (બહારની રક્ષણાત્મક દીવાલ)."
        },
        feedback: {
          en: "Correct! The Mitochondria is the cellular Power Plant that generates ATP energy for all functions.",
          hi: "सही! माइटोकॉन्ड्रिया कोशिका का बिजली घर है जो सभी कार्यों के लिए ऊर्जा बनाता है।",
          gu: "સાચું! કણાભસૂત્ર (માઇટોકોન્ડ્રિયા) કોષનું પાવર હાઉસ છે જે તમામ કાર્યો માટે ઊર્જા બનાવે છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "bridge_analogy",
        question: {
          en: "A computer CPU processes commands, the RAM holds active working files, and the Hard Drive stores long-term files. \nUsing a 'Study Room Analogy', what corresponds to the RAM (active working memory)?",
          hi: "कंप्यूटर का CPU काम करता है, RAM चालू फाइलों को रखती है, और हार्ड ड्राइव स्थायी फाइलों को। \n'स्टडी रूम सादृश्य' में RAM (सक्रिय मेमोरी) की तुलना किससे होगी?",
          gu: "કમ્પ્યુટરનું CPU કામ કરે છે, RAM ચાલુ ફાઇલો રાખે છે, અને હાર્ડ ડ્રાઇવ કાયમી ફાઇલો સાચવે છે. \n'સ્ટડી રૂમ સાદૃશ્ય' માં RAM ની સરખામણી કોની સાથે થશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "The closed bookshelf in the corner",
              hi: "कोने में बंद किताबों की अलमारी",
              gu: "ખૂણામાં બંધ કબાટ"
            }
          },
          {
            id: "B",
            text: {
              en: "The flat desktop surface where your open notebooks currently lie",
              hi: "स्टडी टेबल की खुली सतह जहाँ अभी आपकी खुली किताबें रखी हैं",
              gu: "સ્ટડી ટેબલની ખુલ્લી સપાટી જ્યાં અત્યારે તમારી ખુલ્લી નોટ્સ પડી છે"
            }
          },
          {
            id: "C",
            text: {
              en: "The trash bin under the table",
              hi: "टेबल के नीचे का डस्टबिन",
              gu: "ટેબલ નીચેની કચરાપેટી"
            }
          },
          {
            id: "D",
            text: {
              en: "The electric wall plug",
              hi: "बिजली का स्विच बोर्ड",
              gu: "વીજળીનો સ્વિચ બોર્ડ"
            }
          }
        ],
        correct_option: "B",
        feedback: {
          en: "Spot on! RAM is like your open desk surface (quick temporary workspace), while the Hard Drive is the big storage bookshelf.",
          hi: "शानदार! RAM आपकी खुली टेबल की तरह है (त्वरित काम करने की जगह), जबकि हार्ड ड्राइव बड़ी किताबों की अलमारी है।",
          gu: "એકદમ સાચું! RAM એ તમારી ખુલ્લી ટેબલ જેવી છે (ઝડપી કામ કરવાની જગ્યા), જ્યારે હાર્ડ ડ્રાઇવ એ મોટો કબાટ છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "bridge_analogy",
        title: {
          en: "Analogy Bridge Superpower",
          hi: "एनालॉजी ब्रिज सुपरपावर",
          gu: "એનાલોજી બ્રિજ સુપરપાવર"
        },
        body: {
          en: "Build a bridge from the unknown to the known to make ideas crystal clear.",
          hi: "कठिन विचारों को तुरंत समझने के लिए अज्ञात की तुलना ज्ञात से करें।",
          gu: "અઘરા વિચારોને સરળતાથી સમજવા અજ્ઞાતની સરખામણી જાણીતા સાથે કરો."
        },
        tags: [
          { en: "Bridge to Known", hi: "ज्ञात से जोड़ें", gu: "જાણીતા સાથે જોડો" },
          { en: "Water Pipe Model", hi: "वाटर पाइप मॉडल", gu: "વોટર પાઇપ મોડલ" },
          { en: "Cell as City", hi: "कोशिका-शहर", gu: "કોષ એક શહેર" },
          { en: "Visual Metaphor", hi: "दृश्य रूपक", gu: "દ્રશ્ય રૂપક" },
          { en: "Intuitive Logic", hi: "सहज ज्ञान", gu: "સરળ તર્ક" },
          { en: "No Blind Rote", hi: "रटना बंद", gu: "ગોખણપટ્ટી મુક્ત" }
        ]
      },
      {
        type: "action_checklist",
        icon: "bridge_analogy",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Identify the difficult or abstract concept you are struggling to picture.",
              hi: "उस अमूर्त या कठिन अवधारणा की पहचान करें जिसकी आप कल्पना नहीं कर पा रहे हैं।",
              gu: "તે અટપટી સંકલ્પનાને ઓળખો જેની તમે કલ્પના નથી કરી શકતા."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Ask: 'What real-world object or system behaves similarly to this?'",
              hi: "पूछें: 'दैनिक जीवन की कौन सी वस्तु या प्रणाली इसके समान व्यवहार करती है?'",
              gu: "પૂછો: 'રોજિંદા જીવનની કઈ વસ્તુ કે વ્યવસ્થા આના જેવું કામ કરે છે?'"
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Create a side-by-side mapping table connecting each part to its familiar twin.",
              hi: "प्रत्येक हिस्से को उसके परिचित जुड़वां से जोड़ते हुए एक तुलना तालिका बनाएं।",
              gu: "દરેક ભાગને તેના પરિચિત ઉદાહરણ સાથે જોડતી એક સરખામણી બનાવો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Use the familiar system's simple rules to reason out answers to complex questions.",
              hi: "जटिल सवालों के जवाब देने के लिए परिचित प्रणाली के सरल नियमों का उपयोग करें।",
              gu: "અઘરા સવાલોના જવાબ આપવા પરિચિત વ્યવસ્થાના સરળ નિયમોનો ઉપયોગ કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "bridge_analogy",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Explain one science concept (like the human heart, photosynthesis, or gravity) to someone using an everyday analogy!",
          hi: "दैनिक जीवन के किसी उदाहरण का उपयोग करके किसी को विज्ञान की एक अवधारणा (जैसे हृदय या गुरुत्वाकर्षण) समझाएं!",
          gu: "રોજિંદા જીવનના કોઈ ઉદાહરણથી કોઈને વિજ્ઞાનની એક સંકલ્પના (જેમ કે હૃદય કે ગુરુત્વાકર્ષણ) સમજાવો!"
        },
        commitment_button_text: {
          en: "I will build mental analogy bridges!",
          hi: "मैं सादृश्य पुलों से ज्ञान समझूँगा!",
          gu: "હું એનાલોજી બ્રિજથી જ્ઞાન સમજીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_87",
    methodNumber: 87,
    classLevel: 5,
    category: {
      en: "Problem Solving Strategies",
      hi: "समस्या समाधान रणनीतियाँ",
      gu: "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Decompose → Solve → Recombine (Chunk & Conquer)",
      hi: "विभाजित करें → हल करें → पुनर्संयोजित करें (टुकड़े और विजय)",
      gu: "વિભાજિત કરો → ઉકેલો → પુનઃજોડો (ટુકડા અને વિજય)"
    },
    description: {
      en: "Chop intimidating multi-step geometry and arithmetic monsters into tiny bite-sized sub-tasks, solve each independently, and merge for the final victory.",
      hi: "विशाल बहु-चरणीय समस्याओं को छोटे-छोटे स्वतंत्र उप-कार्यों में काटें, प्रत्येक को हल करें और कुल उत्तर के लिए जोड़ें।",
      gu: "મોટી અઘરી ભૂમિતિ અને ગણતરીની સમસ્યાઓને નાના સ્વતંત્ર ભાગોમાં વહેંચો, દરેકને ઉકેલો અને અંતિમ જવાબ માટે જોડો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "split_merge_cubes",
        title: {
          en: "Overwhelmed by Massive Multi-Part Geometry & Word Puzzles?",
          hi: "विशाल बहु-चरणीय रेखागणित और इबारती सवालों को देखकर घबरा जाते हैं?",
          gu: "મોટા બહુ-પગલાંવાળા ભૂમિતિ અને કોયડાઓ જોઈને ગભરાઈ જાઓ છો?"
        },
        pain_quotes: [
          {
            en: "An irregular L-shaped floor plan looks impossible because there's no single formula for it!",
            hi: "अजीब एल-आकार वाले फर्श का क्षेत्रफल निकालना असंभव लगता है क्योंकि इसका कोई सीधा सूत्र नहीं है!",
            gu: "અનિયમિત એલ-આકારના ક્ષેત્રફળનો દાખલો અશક્ય લાગે છે કારણ કે તેનું કોઈ સીધું સૂત્ર નથી!"
          },
          {
            en: "I try to swallow a 4-step word problem all in one bite and end up completely lost!",
            hi: "मैं 4-चरणों वाले सवाल को एक ही बार में हल करने की कोशिश करता हूँ और पूरी तरह भटक जाता हूँ!",
            gu: "હું ૪-પગલાંવાળા દાખલાને એક જ સાથે ગણવા જાઉં છું અને સાવ અટવાઈ જાઉં છું!"
          }
        ],
        body: {
          en: "No one eats a whole watermelon in one gulp; you slice it into manageable wedges. 'Decomposition' draws clean cut-lines through big problems so you only solve friendly simple shapes or mini-tasks one at a time.",
          hi: "कोई भी पूरा तरबूज एक बार में नहीं खाता; हम उसके टुकड़े करते हैं। 'विभाजन' बड़ी समस्याओं को आसान छोटे भागों में काट देता है ताकि आप एक बार में सिर्फ एक सरल भाग हल करें।",
          gu: "કોઈ આખું તરબૂચ એક જ વારમાં ખાઈ શકતું નથી; આપણે તેની ચીરીઓ કરીએ છીએ. 'વિભાજન' મોટી સમસ્યાઓને સરળ ભાગોમાં કાપે છે જેથી તમે એક સમયે માત્ર એક સરળ ભાગ જ ઉકેલો."
        },
        key_takeaway: {
          en: "Decompose Rule: Chop into Part A + Part B $\\rightarrow$ Solve each mini-part $\\rightarrow$ Recombine for Total!",
          hi: "विभाजन नियम: भाग A + भाग B में काटें $\\rightarrow$ प्रत्येक छोटा भाग हल करें $\\rightarrow$ कुल के लिए जोड़ें!",
          gu: "વિભાજન નિયમ: ભાગ A + ભાગ B માં કાપો $\\rightarrow$ દરેક નાનો ભાગ ઉકેલો $\\rightarrow$ કુલ મેળવવા સરવાળો કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "split_merge_cubes",
        title: {
          en: "Meet Ananya",
          hi: "अनन्या से मिलें",
          gu: "મળો અનન્યાને"
        },
        story: {
          en: "Ananya had to find the area of an irregular L-shaped courtyard. Instead of panicking, she drew a single dotted line that split it into Rectangle A (6 m × 4 m = 24 m²) and Rectangle B (3 m × 2 m = 6 m²). Recombining gave 24 + 6 = 30 m² in less than 30 seconds!",
          hi: "अनन्या को एक अनियमित एल-आकार के आंगन का क्षेत्रफल निकालना था। घबराने के बजाय उसने एक बिंदुदार रेखा खींचकर उसे आयत A (6 × 4 = 24 वर्ग मी) और आयत B (3 × 2 = 6 वर्ग मी) में बांट दिया। दोनों को जोड़कर 24 + 6 = 30 वर्ग मी निकाल लिया!",
          gu: "અનન્યાએ એક અનિયમિત એલ-આકારના આંગણાનું ક્ષેત્રફળ શોધવાનું હતું. ગભરાવાને બદલે તેણે એક તૂટક લીટી દોરીને તેને લંબચોરસ A (૬ × ૪ = ૨૪ ચો.મી.) અને લંબચોરસ B (૩ × ૨ = ૬ ચો.મી.) માં વહેંચી દીધું. બંનેને જોડીને ૨૪ + ૬ = ૩૦ ચો.મી. માત્ર ૩૦ સેકન્ડમાં શોધી લીધું!"
        },
        insight_box: {
          en: "Dotted-Line Magic: One simple cut turns one terrifying monster shape into two friendly rectangles.",
          hi: "बिंदुदार रेखा का जादू: एक साधारण कट भयानक जटिल आकृति को दो सरल आयतों में बदल देता है।",
          gu: "તૂટક લીટીનો જાદુ: એક નાનકડી લીટી અઘરા આકારને બે સરળ લંબચોરસમાં ફેરવી દે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "split_merge_cubes",
        question: {
          en: "To find the total area of a T-shaped figure, what is the smartest first move?",
          hi: "टी (T) आकार की आकृति का कुल क्षेत्रफल निकालने के लिए सबसे स्मार्ट पहला कदम क्या है?",
          gu: "ટી (T) આકારની આકૃતિનું કુલ ક્ષેત્રફળ શોધવા માટે સૌથી સ્માર્ટ પહેલું પગલું કયું છે?"
        },
        option_a: {
          en: "Draw a dotted horizontal cut to decompose the 'T' into two simple rectangular bars (Top bar + Stem bar).",
          hi: "टी (T) को दो सरल आयताकार पट्टियों (ऊपरी पट्टी + खड़ी पट्टी) में बांटने के लिए एक बिंदुदार रेखा खींचें।",
          gu: "T ને બે સરળ લંબચોરસ પટ્ટીઓ (ઉપરની પટ્ટી + ઊભી પટ્ટી) માં વહેંચવા માટે એક તૂટક લીટી દોરો."
        },
        option_b: {
          en: "Multiply all side lengths together in one giant multiplication.",
          hi: "सभी भुजाओं की लंबाइयों का एक साथ बड़ा गुणा कर दें।",
          gu: "બધી બાજુઓની લંબાઈનો એક સાથે મોટો ગુણાકાર કરી નાખો."
        },
        feedback: {
          en: "Correct! Decomposing the T-shape into 2 standard rectangles lets you calculate Area A + Area B easily.",
          hi: "सही! T-आकार को 2 सरल आयतों में बांटने से क्षेत्रफल A + क्षेत्रफल B निकालना बहुत आसान हो जाता है।",
          gu: "સાચું! T-આકારને ૨ સરળ લંબચોરસમાં વહેંચવાથી ક્ષેત્રફળ A + ક્ષેત્રફળ B ગણવું ખૂબ સરળ બને છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "split_merge_cubes",
        question: {
          en: "An irregular garden is decomposed into: \n- Rectangle 1: Length = 8 m, Width = 5 m \n- Rectangle 2: Length = 4 m, Width = 3 m \nWhat is the total recombined area of the garden?",
          hi: "एक बगीचे को दो भागों में बांटा गया है: \n- आयत 1: लंबाई = 8 मी, चौड़ाई = 5 मी \n- आयत 2: लंबाई = 4 मी, चौड़ाई = 3 मी \nबगीचे का कुल क्षेत्रफल क्या है?",
          gu: "એક બગીચાને બે ભાગમાં વહેંચવામાં આવ્યો: \n- લંબચોરસ ૧: લંબાઈ = ૮ મી, પહોળાઈ = ૫ મી \n- લંબચોરસ ૨: લંબાઈ = ૪ મી, પહોળાઈ = ૩ મી \nબગીચાનું કુલ ક્ષેત્રફળ કેટલું થશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "52 m² (Area 1 = 8 × 5 = 40; Area 2 = 4 × 3 = 12; Total = 40 + 12 = 52 m²)",
              hi: "52 वर्ग मी (क्षेत्रफल 1 = 8 × 5 = 40; क्षेत्रफल 2 = 4 × 3 = 12; कुल = 40 + 12 = 52)",
              gu: "૫૨ ચો.મી. (ક્ષેત્રફળ ૧ = ૮ × ૫ = ૪૦; ક્ષેત્રફળ ૨ = ૪ × ૩ = ૧૨; કુલ = ૪૦ + ૧૨ = ૫૨)"
            }
          },
          {
            id: "B",
            text: {
              en: "48 m²",
              hi: "48 वर्ग मी",
              gu: "૪૮ ચો.મી."
            }
          },
          {
            id: "C",
            text: {
              en: "60 m²",
              hi: "60 वर्ग मी",
              gu: "૬૦ ચો.મી."
            }
          },
          {
            id: "D",
            text: {
              en: "40 m²",
              hi: "40 वर्ग मी",
              gu: "૪૦ ચો.મી."
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Genius! Area 1 = 40 m², Area 2 = 12 m². Recombining: 40 + 12 = 52 m² cleanly!",
          hi: "शानदार! क्षेत्रफल 1 = 40 वर्ग मी, क्षेत्रफल 2 = 12 वर्ग मी। दोनों को जोड़कर: 40 + 12 = 52 वर्ग मी!",
          gu: "અદ્ભુત! ક્ષેત્રફળ ૧ = ૪૦ ચો.મી., ક્ષેત્રફળ ૨ = ૧૨ ચો.મી. બંનેનો સરવાળો: ૪૦ + ૧૨ = ૫૨ ચો.મી.!"
        }
      },
      {
        type: "strategy_pills",
        icon: "split_merge_cubes",
        title: {
          en: "Chunk & Conquer Superpower",
          hi: "टुकड़े और विजय सुपरपावर",
          gu: "ટુકડા અને વિજય સુપરપાવર"
        },
        body: {
          en: "Cut big complex problems into small pieces, solve each, and merge the answers.",
          hi: "बड़ी समस्याओं को छोटे-छोटे टुकड़ों में काटें, प्रत्येक को हल करें और उत्तर जोड़ें।",
          gu: "મોટી સમસ્યાઓને નાના ટુકડાઓમાં કાપો, દરેકને ઉકેલો અને જવાબો જોડો."
        },
        tags: [
          { en: "Dotted Cut Lines", hi: "बिंदुदार कट रेखाएं", gu: "તૂટક કટ લીટીઓ" },
          { en: "Part A + Part B", hi: "भाग A + भाग B", gu: "ભાગ A + ભાગ B" },
          { en: "Independent Solving", hi: "स्वतंत्र समाधान", gu: "સ્વતંત્ર ઉકેલ" },
          { en: "Recombine Sum", hi: "पुनर्संयोजन योग", gu: "સરવાળો કરો" },
          { en: "Irregular Shapes", hi: "अनियमित आकृतियां", gu: "અનિયમિત આકારો" },
          { en: "Divide & Conquer", hi: "बांटो और जीतो", gu: "ભાગલા પાડો અને જીતો" }
        ]
      },
      {
        type: "action_checklist",
        icon: "split_merge_cubes",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Inspect the complex shape or multi-step problem for natural break lines.",
              hi: "जटिल आकृति या बड़े सवाल में स्वाभाविक विभाजन रेखाओं की पहचान करें।",
              gu: "અઘરા આકાર કે મોટા દાખલામાં કુદરતી ભાગલાની લીટીઓ ઓળખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Draw dotted lines to decompose it into standard simple units (Rectangle A, B).",
              hi: "इसे सरल मानक इकाइयों (आयत A, B) में बांटने के लिए बिंदुदार रेखाएं खींचें।",
              gu: "તેને સરળ એકમો (લંબચોરસ A, B) માં વહેંચવા માટે તૂટક લીટીઓ દોરો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Calculate the solution for each simple sub-part independently.",
              hi: "प्रत्येक छोटे भाग के लिए स्वतंत्र रूप से समाधान की गणना करें।",
              gu: "દરેક નાના ભાગ માટે સ્વતંત્ર રીતે ઉકેલની ગણતરી કરો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Recombine (add or subtract) the individual answers to obtain the grand total.",
              hi: "कुल उत्तर प्राप्त करने के लिए अलग-अलग परिणामों को जोड़ें या घटाएं।",
              gu: "કુલ જવાબ મેળવવા માટે છૂટાછવાયા પરિણામોનો સરવાળો કે બાદબાકી કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "split_merge_cubes",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Draw an L-shape or T-shape floor plan on scrap paper, cut it into 2 rectangles with a dotted line, and calculate the combined area!",
          hi: "कागज पर एक L या T आकार का नक्शा बनाएं, बिंदुदार रेखा से 2 आयतों में काटें और कुल क्षेत्रफल निकालें!",
          gu: "કાગળ પર L કે T આકારનો નકશો દોરો, તૂટક લીટીથી ૨ લંબચોરસમાં કાપો અને કુલ ક્ષેત્રફળ ગણો!"
        },
        commitment_button_text: {
          en: "I will chunk and conquer complex problems!",
          hi: "मैं विभाजित करके बड़ी समस्याएं हल करूँगा!",
          gu: "હું વિભાજિત કરીને મોટી સમસ્યાઓ ઉકેલીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_93",
    methodNumber: 93,
    classLevel: 5,
    category: {
      en: "Logic",
      hi: "तर्क",
      gu: "તર્ક"
    },
    title: {
      en: "If–Then Reasoning (Conditional Chain)",
      hi: "यदि-तो तर्क (शर्त-परिणाम श्रृंखला)",
      gu: "જો-તો તર્ક (શરતી સાંકળ તર્ક)"
    },
    description: {
      en: "Master conditional logic chains (If Condition A is met, then Result B must follow) to avoid jumping to false conclusions.",
      hi: "गलत निष्कर्षों से बचने के लिए शर्त और परिणाम की तार्किक श्रृंखला (यदि A सत्य है, तो B अवश्य होगा) में महारत हासिल करें।",
      gu: "ખોટા તારણોથી બચવા માટે શરત અને પરિણામની તાર્કિક સાંકળ (જો A સાચું છે, તો B ચોક્કસ થશે) માં નિપુણ બનો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "if_then_branch",
        title: {
          en: "Confusing Conditions and Jumping to False Assumptions?",
          hi: "शर्तों को समझे बिना गलत अनुमान लगाने की आदत है?",
          gu: "શરતો સમજ્યા વિના ખોટા અનુમાન લગાવવાની આદત છે?"
        },
        pain_quotes: [
          {
            en: "A rule says 'If it rains, school is closed.' When school is closed on a Sunday, I falsely assume it must be raining!",
            hi: "नियम है 'यदि बारिश होगी तो स्कूल बंद रहेगा।' जब रविवार को स्कूल बंद होता है, तो मैं मान लेता हूँ कि बारिश हो रही है!",
            gu: "નિયમ છે 'જો વરસાદ પડશે તો શાળા બંધ રહેશે.' જ્યારે રવિવારે શાળા બંધ હોય, ત્યારે હું માની લઉં છું કે વરસાદ પડતો જ હશે!"
          },
          {
            en: "I mix up the trigger condition with the outcome in science and logic questions!",
            hi: "विज्ञान और तर्क के प्रश्नों में मैं कारण और परिणाम को आपस में मिला देता हूँ!",
            gu: "વિજ્ઞાન અને તર્કના પ્રશ્નોમાં હું કારણ અને પરિણામને ભેગા કરી નાખું છું!"
          }
        ],
        body: {
          en: "If–Then logic is like a one-way bridge: If the Trigger condition happens, the Outcome is guaranteed. But the reverse is NOT automatically true. Tracking the conditional arrow prevents silly logic traps!",
          hi: "यदि-तो तर्क एक तरफा पुल की तरह है: यदि 'शर्त' पूरी होती है, तो 'परिणाम' पक्का है। लेकिन इसका उल्टा अपने आप सच नहीं होता। इस तीर को समझना तार्किक जालों से बचाता है!",
          gu: "જો-તો તર્ક એકતરફી પુલ જેવો છે: જો 'શરત' પૂરી થાય, તો 'પરિણામ' નક્કી છે. પરંતુ તેનું ઊંધું આપોઆપ સાચું થતું નથી. આ તીરને સમજવાથી તાર્કિક ભૂલો અટકે છે!"
        },
        key_takeaway: {
          en: "Condition Rule: If Trigger (A) $\\rightarrow$ Then Outcome (B). Check if the trigger condition is actually true first!",
          hi: "शर्त नियम: यदि कारण (A) $\\rightarrow$ तो परिणाम (B)। पहले जांचें कि क्या मुख्य कारण वास्तव में पूरा हुआ है!",
          gu: "શરત નિયમ: જો કારણ (A) $\\rightarrow$ તો પરિણામ (B). પહેલાં ચકાસો કે મુખ્ય શરત ખરેખર પૂરી થઈ છે કે નહીં!"
        }
      },
      {
        type: "relatable_story",
        icon: "if_then_branch",
        title: {
          en: "Meet Shaurya",
          hi: "शौर्य से मिलें",
          gu: "મળો શૌર્યને"
        },
        story: {
          en: "Shaurya read the science rule: 'If an animal is a bird, then it has feathers.' In a quiz, when asked if bats are birds, he reasoned: 'Bats fly, so they must be birds.' His teacher showed him the If–Then test: Do bats have feathers? No (they have fur). Therefore, they are NOT birds! Testing the condition made his logic razor sharp.",
          hi: "शौर्य ने नियम पढ़ा: 'यदि कोई जीव पक्षी है, तो उसके पंख (पर) होते हैं।' क्विज में पूछा गया कि क्या चमगादड़ पक्षी है, उसने सोचा: 'चमगादड़ उड़ता है, तो पक्षी होगा।' शिक्षक ने समझाया: क्या चमगादड़ के पंख हैं? नहीं (उसके बाल होते हैं)। अतः वह पक्षी नहीं है! इस तर्क से उसकी सोच एकदम सटीक हो गई।",
          gu: "શૌર્યે નિયમ વાંચ્યો: 'જો કોઈ પ્રાણી પક્ષી છે, તો તેને પીંછા હોય છે.' ક્વિઝમાં પૂછાયું કે શું ચામાચીડિયું પક્ષી છે, તેણે વિચાર્યું: 'ચામાચીડિયું ઊડે છે, એટલે પક્ષી હશે.' શિક્ષકે સમજાવ્યું: શું ચામાચીડિયાને પીંછા છે? ના (તેને રૂંવાટી હોય છે). તેથી તે પક્ષી નથી! આ તર્કથી તેની વિચારસરણી પાકી થઈ ગઈ."
        },
        insight_box: {
          en: "Condition Test: Check the prerequisite feature first before declaring the final category.",
          hi: "शर्त परीक्षण: अंतिम निष्कर्ष निकालने से पहले मुख्य आवश्यक लक्षण की पुष्टि करें।",
          gu: "શરત ચકાસણી: અંતિમ તારણ કાઢતા પહેલાં મુખ્ય જરૂરી લક્ષણની ખાતરી કરો."
        }
      },
      {
        type: "method_concept_check",
        icon: "if_then_branch",
        question: {
          en: "Rule: 'If a shape is a Square, then it must have 4 equal sides.' \nYou see a shape that has 4 equal sides. Can you automatically conclude it MUST be a square?",
          hi: "नियम: 'यदि कोई आकृति वर्ग (Square) है, तो उसकी 4 समान भुजाएं होंगी।' \nआप 4 समान भुजाओं वाली आकृति देखते हैं। क्या आप निश्चित रूप से कह सकते हैं कि वह वर्ग ही है?",
          gu: "નિયમ: 'જો કોઈ આકાર ચોરસ (Square) છે, તો તેની ૪ સમાન બાજુઓ હશે.' \nતમે ૪ સમાન બાજુઓવાળો આકાર જુઓ છો. શું તમે ચોક્કસ કહી શકો કે તે ચોરસ જ છે?"
        },
        option_a: {
          en: "No, because a Rhombus also has 4 equal sides but doesn't have 90° angles.",
          hi: "नहीं, क्योंकि समचतुर्भुज (Rhombus) की भी 4 समान भुजाएं होती हैं लेकिन 90° के कोण नहीं होते।",
          gu: "ના, કારણ કે સમબાજુ ચતુષ્કોણ (Rhombus) ની પણ ૪ સમાન બાજુઓ હોય છે પણ ૯૦° ના ખૂણા નથી હોતા."
        },
        option_b: {
          en: "Yes, every shape with 4 equal sides is guaranteed to be a square.",
          hi: "हाँ, 4 समान भुजाओं वाली हर आकृति का वर्ग होना तय है।",
          gu: "હા, ૪ સમાન બાજુઓવાળો દરેક આકાર ચોરસ જ હોય છે."
        },
        feedback: {
          en: "Correct! If Square $\\rightarrow$ 4 equal sides is true. But 4 equal sides $\\rightarrow$ Square is NOT automatically true because a Rhombus also qualifies!",
          hi: "सही! वर्ग $\\rightarrow$ 4 समान भुजाएं सच है। लेकिन 4 समान भुजाएं $\\rightarrow$ वर्ग अपने आप सच नहीं है क्योंकि वह समचतुर्भुज भी हो सकता है!",
          gu: "સાચું! ચોરસ $\\rightarrow$ ૪ સમાન બાજુઓ સાચું છે. પણ ૪ સમાન બાજુઓ $\\rightarrow$ ચોરસ આપોઆપ સાચું નથી કારણ કે તે સમબાજુ ચતુષ્કોણ પણ હોઈ શકે!"
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "if_then_branch",
        question: {
          en: "Rule 1: If an object is made of pure iron, then it is attracted to a magnet. \nFact: Object X is NOT attracted to a magnet. \nWhat logical conclusion is 100% certain?",
          hi: "नियम 1: यदि कोई वस्तु शुद्ध लोहे की है, तो वह चुंबक से आकर्षित होगी। \nतथ्य: वस्तु X चुंबक से आकर्षित नहीं होती है। \nकौन सा तार्किक निष्कर्ष 100% निश्चित है?",
          gu: "નિયમ ૧: જો કોઈ વસ્તુ શુદ્ધ લોખંડની છે, તો તે ચુંબક તરફ આકર્ષાશે. \nહકીકત: વસ્તુ X ચુંબક તરફ આકર્ષાતી નથી. \nકયું તાર્કિક તારણ ૧૦૦% સાચું છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Object X is NOT made of pure iron",
              hi: "वस्तु X शुद्ध लोहे की नहीं बनी है",
              gu: "વસ્તુ X શુદ્ધ લોખંડની બનેલી નથી"
            }
          },
          {
            id: "B",
            text: {
              en: "Object X is a piece of wood",
              hi: "वस्तु X लकड़ी का टुकड़ा है",
              gu: "વસ્તુ X લાકડાનો ટુકડો છે"
            }
          },
          {
            id: "C",
            text: {
              en: "The magnet is broken",
              hi: "चुंबक खराब है",
              gu: "ચુંબક તૂટેલું છે"
            }
          },
          {
            id: "D",
            text: {
              en: "Object X will become iron tomorrow",
              hi: "वस्तु X कल लोहा बन जाएगी",
              gu: "વસ્તુ X આવતીકાલે લોખંડ બની જશે"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Genius! If Iron $\\rightarrow$ Attracted. Therefore: Not Attracted $\\rightarrow$ NOT Iron (Contrapositive logic).",
          hi: "शानदार! यदि लोहा $\\rightarrow$ आकर्षित। अतः: आकर्षित नहीं $\\rightarrow$ लोहा नहीं (विपरीत तर्क)।",
          gu: "અદ્ભુત! જો લોખંડ $\\rightarrow$ આકર્ષણ. તેથી: આકર્ષણ નથી $\\rightarrow$ લોખંડ નથી (કોન્ટ્રાપોઝિટિવ તર્ક)."
        }
      },
      {
        type: "strategy_pills",
        icon: "if_then_branch",
        title: {
          en: "If–Then Chain Superpower",
          hi: "यदि-तो श्रृंखला सुपरपावर",
          gu: "જો-તો સાંકળ સુપરપાવર"
        },
        body: {
          en: "Follow the logical arrow strictly and test the trigger condition first.",
          hi: "तार्किक तीर का सख्ती से पालन करें और पहले मुख्य शर्त की पुष्टि करें।",
          gu: "તાર્કિક તીરનું ચુસ્તપણે પાલન કરો અને પહેલાં મુખ્ય શરતની ખાતરી કરો."
        },
        tags: [
          { en: "If A Then B", hi: "यदि A तो B", gu: "જો A તો B" },
          { en: "Check Condition", hi: "शर्त जांचें", gu: "શરત ચકાસો" },
          { en: "No False Jumps", hi: "बिना अनुमान", gu: "ખોટા અનુમાન મુક્ત" },
          { en: "Logic Arrow", hi: "तर्क तीर", gu: "તર્ક તીર" },
          { en: "Test Counterexample", hi: "अपवाद खोजें", gu: "અપવાદ શોધો" },
          { en: "Razor Sharp", hi: "सटीक सोच", gu: "ચોક્કસ વિચાર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "if_then_branch",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Identify the 'IF' condition (Trigger) and the 'THEN' outcome (Result).",
              hi: "'यदि' वाली शर्त (कारण) और 'तो' वाले परिणाम (निष्कर्ष) को अलग-अलग पहचानें।",
              gu: "'જો' વાળી શરત (કારણ) અને 'તો' વાળા પરિણામ (નિષ્કર્ષ) ને અલગ-અલગ ઓળખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Check whether the real-world scenario actually satisfies the 'IF' condition.",
              hi: "जांचें कि क्या वास्तविक स्थिति 'यदि' वाली शर्त को वास्तव में पूरा करती है।",
              gu: "ચકાસો કે વાસ્તવિક પરિસ્થિતિ 'જો' વાળી શરતને ખરેખર પૂરી કરે છે કે નહીં."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Apply the 'THEN' outcome ONLY when the trigger condition is fully met.",
              hi: "'तो' वाला परिणाम केवल तभी लागू करें जब मुख्य शर्त पूरी तरह से सच हो।",
              gu: "'તો' વાળું પરિણામ ત્યારે જ લાગુ કરો જ્યારે મુખ્ય શરત સંપૂર્ણપણે સાચી હોય."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Beware of reversing the arrow (Result true does not mean Trigger was the only cause).",
              hi: "तीर को उल्टा करने से बचें (परिणाम सच होने का मतलब यह नहीं कि सिर्फ वही एक कारण था)।",
              gu: "તીરને ઉલટાવવાથી બચો (પરિણામ સાચું હોવાનો અર્થ એ નથી કે માત્ર તે જ એક કારણ હતું)."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "if_then_branch",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Write down 2 'If–Then' rules from science or daily life today (e.g. If water reaches 100°C $\\rightarrow$ then it boils) and test if the reverse holds true!",
          hi: "आज विज्ञान या दैनिक जीवन से 2 'यदि-तो' नियम लिखें और जांचें कि क्या उनका उल्टा सच होता है!",
          gu: "આજે વિજ્ઞાન કે રોજિંદા જીવનમાંથી ૨ 'જો-તો' નિયમો લખો અને ચકાસો કે શું તેનું ઊંધું સાચું પડે છે!"
        },
        commitment_button_text: {
          en: "I will think in clear If–Then logic chains!",
          hi: "मैं स्पष्ट यदि-तो तर्क से सोचूँगा!",
          gu: "હું સ્પષ્ટ જો-તો તર્કથી વિચારીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_106",
    methodNumber: 106,
    classLevel: 5,
    category: {
      en: "Logic",
      hi: "तर्क",
      gu: "તર્ક"
    },
    title: {
      en: "Rule Discovery (Function Machine Detective)",
      hi: "नियम खोज (फंक्शन मशीन डिटेक्टिव)",
      gu: "નિયમ શોધ (ફંક્શન મશીન ડિટેક્ટિવ)"
    },
    description: {
      en: "Inspect input-output pairs to crack the hidden mathematical or logical formula and predict unknown outputs with 100% certainty.",
      hi: "छिपे हुए गणितीय या तार्किक नियम को खोजने के लिए इनपुट-आउटपुट जोड़ियों की जांच करें।",
      gu: "છુપાયેલા ગણિત કે તાર્કિક નિયમને શોધવા ઇનપુટ-આઉટપુટ જોડીઓની તપાસ કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "detective_rule",
        title: {
          en: "Stumped by Input-Output 'Magic Function Machines'?",
          hi: "इनपुट-आउटपुट 'जादुई मशीन' के सवालों में नियम नहीं ढूंढ पाते?",
          gu: "ઇનપુટ-આઉટપુટ 'જાદુઈ મશીન' ના દાખલાઓમાં નિયમ નથી પકડી શકતા?"
        },
        pain_quotes: [
          {
            en: "I see In: 2 $\\rightarrow$ Out: 7, In: 3 $\\rightarrow$ Out: 10, and my mind goes blank!",
            hi: "इनपुट 2 पर 7 और 3 पर 10 देखकर मुझे समझ नहीं आता कि अंदर क्या जादू हुआ!",
            gu: "ઇનપુટ ૨ પર ૭ અને ૩ પર ૧૦ જોઈને મને સમજાતું નથી કે અંદર કયો જાદુ થયો!"
          },
          {
            en: "I test only the first pair, guess '+5', and get the third question wrong!",
            hi: "मैं सिर्फ पहली जोड़ी देखकर '+5' का अंदाजा लगा लेता हूँ और तीसरा सवाल गलत हो जाता है!",
            gu: "હું માત્ર પહેલી જોડી જોઈને '+૫' નો અંદાજ લગાવું છું અને ત્રીજો સવાલ ખોટો પડે છે!"
          }
        ],
        body: {
          en: "Every function machine follows ONE strict rule for all inputs (e.g. Multiply by 3, then Add 1). You must test your rule hypothesis across ALL known pairs before declaring victory!",
          hi: "हर फंक्शन मशीन सभी इनपुट के लिए एक ही सख्त नियम का पालन करती है (जैसे 3 से गुणा, फिर 1 जोड़ें)। नियम को अंतिम मानने से पहले सभी ज्ञात जोड़ियों पर परखना जरूरी है!",
          gu: "દરેક ફંક્શન મશીન બધા ઇનપુટ માટે એક જ નિયમનું પાલન કરે છે (જેમ કે ૩ વડે ગુણાકાર, પછી ૧ ઉમેરો). નિયમ સાચો માનતા પહેલાં બધી જોડીઓ પર ચકાસવો જરૂરી છે!"
        },
        key_takeaway: {
          en: "Detective Rule: Look at Gap $\\rightarrow$ Hypothesize $(\\times N \\pm M)$ $\\rightarrow$ Test on Pair 2 $\\rightarrow$ Apply to Unknown!",
          hi: "डिटेक्टिव नियम: अंतर देखें $\\rightarrow$ नियम $(\\times N \\pm M)$ बनाएं $\\rightarrow$ जोड़ी 2 पर परखें $\\rightarrow$ अज्ञात पर लगाएं!",
          gu: "ડિટેક્ટિવ નિયમ: તફાવત જુઓ $\\rightarrow$ નિયમ $(\\times N \\pm M)$ ધારો $\\rightarrow$ જોડી ૨ પર ચકાસો $\\rightarrow$ અજ્ઞાત પર લાગુ કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "detective_rule",
        title: {
          en: "Meet Navya",
          hi: "नव्या से मिलें",
          gu: "મળો નવ્યાને"
        },
        story: {
          en: "Navya saw the Function Table: [In: 2 $\\rightarrow$ Out: 7], [In: 4 $\\rightarrow$ Out: 13], [In: 5 $\\rightarrow$ Out: ?]. She noticed outputs jump by +3 when inputs jump by +1. She tested 'Multiply by 3, Add 1': 2×3+1=7 (Yes!), 4×3+1=13 (Yes!). For 5: 5×3+1 = 16! She cracked the code in 10 seconds.",
          hi: "नव्या ने टेबल देखी: [इन: 2 $\\rightarrow$ आउट: 7], [इन: 4 $\\rightarrow$ आउट: 13], [इन: 5 $\\rightarrow$ आउट: ?]। उसने देखा कि इनपुट 1 बढ़ने पर आउटपुट 3 बढ़ता है। उसने जांचा '3 से गुणा, 1 जोड़ें': 2×3+1=7, 4×3+1=13। 5 के लिए: 5×3+1 = 16! उसने कोड चुटकियों में सुलझा लिया।",
          gu: "નવ્યાએ ટેબલ જોયું: [ઇન: ૨ $\\rightarrow$ આઉટ: ૭], [ઇન: ૪ $\\rightarrow$ આઉટ: ૧૩], [ઇન: ૫ $\\rightarrow$ આઉટ: ?]. તેણે જોયું કે ઇનપુટ ૧ વધતાં આઉટપુટ ૩ વધે છે. તેણે ચકાસ્યું '૩ વડે ગુણો, ૧ ઉમેરો': ૨×૩+૧=૭, ૪×૩+૧=૧૩. ૫ માટે: ૫×૩+૧ = ૧૬! તેણે ૧૦ સેકન્ડમાં કોડ ઉકેલી નાખ્યો."
        },
        insight_box: {
          en: "Growth Engine: The jump in output reveals the multiplier $(N)$, and the leftover gap gives the addition/subtraction $(M)$.",
          hi: "ग्रोथ इंजन: आउटपुट में आने वाला अंतर गुणक $(N)$ बताता है, और बाकी अंतर जोड़/घटाव $(M)$ बताता है।",
          gu: "ગ્રોથ એન્જિન: આઉટપુટનો તફાવત ગુણક $(N)$ જણાવે છે, અને બાકી રહેલો ભાગ સરવાળો/બાદબાકી $(M)$ દર્શાવે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "detective_rule",
        question: {
          en: "In a function table: In: 3 $\\rightarrow$ Out: 11; In: 5 $\\rightarrow$ Out: 17; In: 6 $\\rightarrow$ Out: 20. What is the hidden rule?",
          hi: "फंक्शन टेबल में: इन: 3 $\\rightarrow$ आउट: 11; इन: 5 $\\rightarrow$ आउट: 17; इन: 6 $\\rightarrow$ आउट: 20। छिपा हुआ नियम क्या है?",
          gu: "ફંક્શન ટેબલમાં: ઇન: ૩ $\\rightarrow$ આઉટ: ૧૧; ઇન: ૫ $\\rightarrow$ આઉટ: ૧૭; ઇન: ૬ $\\rightarrow$ આઉટ: ૨૦. છુપાયેલો નિયમ કયો છે?"
        },
        option_a: {
          en: "Multiply Input by 3, then Add 2 $(3x + 2)$.",
          hi: "इनपुट को 3 से गुणा करें, फिर 2 जोड़ें $(3x + 2)$।",
          gu: "ઇનપુટને ૩ વડે ગુણો, પછી ૨ ઉમેરો $(3x + 2)$."
        },
        option_b: {
          en: "Just add 8 to every input $(x + 8)$.",
          hi: "हर इनपुट में केवल 8 जोड़ें $(x + 8)$।",
          gu: "દરેક ઇનપુટમાં માત્ર ૮ ઉમેરો $(x + 8)$."
        },
        feedback: {
          en: "Correct! Test it: 3×3+2 = 11, 5×3+2 = 17, 6×3+2 = 20. The rule $(3x + 2)$ works on every pair!",
          hi: "सही! जांचें: 3×3+2 = 11, 5×3+2 = 17, 6×3+2 = 20। नियम $(3x + 2)$ हर जोड़ी पर खरा उतरता है!",
          gu: "સાચું! ચકાસો: ૩×૩+૨ = ૧૧, ૫×૩+૨ = ૧૭, ૬×૩+૨ = ૨૦. નિયમ $(3x + 2)$ દરેક જોડી પર સાચો પડે છે!"
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "detective_rule",
        question: {
          en: "Function Rule: $y = 4x - 3$. \nIf the Input $x = 8$, what is the Output $y$?",
          hi: "फंक्शन नियम: $y = 4x - 3$। \nयदि इनपुट $x = 8$ है, तो आउटपुट $y$ क्या होगा?",
          gu: "ફંક્શન નિયમ: $y = 4x - 3$. \nજો ઇનપુટ $x = 8$ હોય, તો આઉટપુટ $y$ શું થશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "29 (4 × 8 = 32; 32 - 3 = 29)",
              hi: "29 (4 × 8 = 32; 32 - 3 = 29)",
              gu: "૨૯ (૪ × ૮ = ૩૨; ૩૨ - ૩ = ૨૯)"
            }
          },
          {
            id: "B",
            text: {
              en: "32",
              hi: "32",
              gu: "૩૨"
            }
          },
          {
            id: "C",
            text: {
              en: "35",
              hi: "35",
              gu: "૩૫"
            }
          },
          {
            id: "D",
            text: {
              en: "28",
              hi: "28",
              gu: "૨૮"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Masterful! 4 × 8 = 32, and 32 - 3 = 29. The rule produces 29 with 100% accuracy!",
          hi: "शानदार! 4 × 8 = 32, और 32 - 3 = 29। नियम से सटीक उत्तर 29 मिलता है!",
          gu: "ઉત્તમ! ૪ × ૮ = ૩૨, અને ૩૨ - ૩ = ૨૯. નિયમથી ચોક્કસ જવાબ ૨૯ મળે છે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "detective_rule",
        title: {
          en: "Function Detective Superpower",
          hi: "फंक्शन डिटेक्टिव सुपरपावर",
          gu: "ફંક્શન ડિટેક્ટિવ સુપરપાવર"
        },
        body: {
          en: "Find the multiplier from output jumps, test on all pairs, and solve the unknown.",
          hi: "आउटपुट के अंतर से गुणक खोजें, सभी जोड़ियों पर जांचें और अज्ञात मान निकालें।",
          gu: "આઉટપુટના તફાવત પરથી ગુણક શોધો, બધી જોડીઓ પર ચકાસો અને અજ્ઞાત કિંમત શોધો."
        },
        tags: [
          { en: "Input to Output", hi: "इनपुट से आउटपुट", gu: "ઇનપુટથી આઉટપુટ" },
          { en: "Find Multiplier", hi: "गुणक खोजें", gu: "ગુણક શોધો" },
          { en: "Test All Pairs", hi: "सभी जोड़ियां जांचें", gu: "બધી જોડી ચકાસો" },
          { en: "Crack the Formula", hi: "सूत्र डिकोड करें", gu: "સૂત્ર ડીકોડ કરો" },
          { en: "No Single Guess", hi: "बिना तुक्का", gu: "અંદાજ મુક્ત" },
          { en: "100% Certainty", hi: "100% सटीकता", gu: "૧૦૦% ચોક્કસાઈ" }
        ]
      },
      {
        type: "action_checklist",
        icon: "detective_rule",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Look at the differences between consecutive outputs when inputs increase by 1.",
              hi: "जब इनपुट 1 बढ़ता है तो लगातार आउटपुट के बीच का अंतर देखें।",
              gu: "જ્યારે ઇનપુટ ૧ વધે છે ત્યારે સતત આવતા આઉટપુટ વચ્ચેનો તફાવત જુઓ."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Formulate a candidate formula: Multiply input by that jump factor $(N)$.",
              hi: "संभावित नियम बनाएं: इनपुट को उस अंतर $(N)$ से गुणा करें।",
              gu: "સંભવિત નિયમ બનાવો: ઇનપુટને તે તફાવત $(N)$ વડે ગુણો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Calculate what number $(M)$ must be added or subtracted to match the real output.",
              hi: "देखें कि असली आउटपुट तक पहुँचने के लिए कितना $(M)$ जोड़ना या घटाना है।",
              gu: "જુઓ કે સાચા આઉટપુટ સુધી પહોંચવા કેટલા $(M)$ ઉમેરવા કે બાદ કરવા પડશે."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Verify the rule on every single row before calculating the missing question mark.",
              hi: "लापता प्रश्नवाचक चिह्न निकालने से पहले हर पंक्ति पर नियम की पुष्टि करें।",
              gu: "પ્રશ્નાર્થ ચિહ્નની કિંમત શોધતા પહેલાં દરેક હરોળ પર નિયમ સાચો છે કે નહીં તે ચકાસો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "detective_rule",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Create a 4-row Function Machine table with a secret rule (e.g. $y = 5x - 2$) and have a family member guess your rule!",
          hi: "एक गुप्त नियम (जैसे $y = 5x - 2$) वाली 4-पंक्तियों की फंक्शन टेबल बनाएं और घर में किसी से नियम खोजने को कहें!",
          gu: "એક ગુપ્ત નિયમ (જેમ કે $y = 5x - 2$) વાળી ૪-હરોળની ફંક્શન ટેબલ બનાવો અને ઘરના સભ્યને નિયમ શોધવા કહો!"
        },
        commitment_button_text: {
          en: "I will discover function rules like a detective!",
          hi: "मैं जासूस की तरह गणितीय नियम खोजूँगा!",
          gu: "હું ડિટેક્ટિવની જેમ ગણિતના નિયમો શોધીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_117",
    methodNumber: 117,
    classLevel: 5,
    category: {
      en: "Pattern Recognition",
      hi: "पैटर्न पहचान",
      gu: "ભાત ઓળખ (પેટર્ન)"
    },
    title: {
      en: "Transformation Pattern (Morph Tracker)",
      hi: "रूपांतरण पैटर्न (मॉर्फ ट्रैकर / आकृति बदलाव)",
      gu: "રૂપાંતરણ પેટર્ન (મોર્ફ ટ્રેકર / આકાર પરિવર્તન)"
    },
    description: {
      en: "Isolate and track multiple simultaneous visual transformations (shape, shading, rotation, and count) one feature at a time.",
      hi: "एक साथ होने वाले कई दृश्य बदलावों (आकार, छायांकन, घूर्णन और संख्या) को एक-एक करके ट्रैक करें।",
      gu: "એક સાથે થતા ઘણા દ્રશ્ય ફેરફારો (આકાર, રંગ/શેડ, પરિભ્રમણ અને સંખ્યા) ને એક પછી એક અલગ કરીને ટ્રેક કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "morph_shape",
        title: {
          en: "Dizzy When Shapes Change Shape, Color, AND Rotation All at Once?",
          hi: "जब आकृतियाँ एक साथ आकार, रंग और दिशा बदलती हैं तो चक्कर आने लगते हैं?",
          gu: "જ્યારે આકારો એક સાથે આકાર, રંગ અને દિશા બદલે ત્યારે ચક્કર આવી જાય છે?"
        },
        pain_quotes: [
          {
            en: "In pattern tests, a triangle turns into a square, shades black, and flips upside down—I can't track it all!",
            hi: "पैटर्न टेस्ट में त्रिभुज चौकोर बनता है, काला रंग भरता है और उल्टा भी हो जाता है—सब एक साथ नहीं संभलता!",
            gu: "પેટર્ન ટેસ્ટમાં ત્રિકોણ ચોરસ બને છે, કાળો રંગ ભરાય છે અને ઊંધો પણ થાય છે—બધું એક સાથે પકડાતું નથી!"
          },
          {
            en: "Looking at the whole messy picture at once makes me guess blindly and pick the wrong option!",
            hi: "पूरे चित्र को एक साथ देखने से सिर्फ तुक्का लगता है और गलत विकल्प चुन जाता है!",
            gu: "આખા ચિત્રને એક સાથે જોવાથી માત્ર અંદાજો મરાય છે અને ખોટો વિકલ્પ પસંદ થઈ જાય છે!"
          }
        ],
        body: {
          en: "Complex patterns are built by layering simple independent rules. 'Morph Tracking' separates the problem into 3 separate layers: 1) Shape Layer, 2) Shading Layer, 3) Rotation Layer. Solve one layer at a time to find the guaranteed match!",
          hi: "जटिल पैटर्न सरल स्वतंत्र नियमों को मिलाकर बनते हैं। 'मॉर्फ ट्रैकिंग' समस्या को 3 परतों में बांटती है: 1) आकार परत, 2) छायांकन परत, 3) घूर्णन परत। एक बार में एक परत हल करें!",
          gu: "અટપટી પેટર્ન સરળ સ્વતંત્ર નિયમો ભેગા કરીને બને છે. 'મોર્ફ ટ્રેકિંગ' સમસ્યાને ૩ ભાગમાં વહેંચે છે: ૧) આકાર, ૨) શેડિંગ/રંગ, ૩) પરિભ્રમણ. એક સમયે એક જ ભાગ ઉકેલો!"
        },
        key_takeaway: {
          en: "Isolate Layers: Track Shape Morph $\\rightarrow$ Track Shading Rule $\\rightarrow$ Track Rotation Angle!",
          hi: "परत विभाजन: पहले आकार बदलाव $\\rightarrow$ फिर रंग/छाया नियम $\\rightarrow$ फिर घूर्णन कोण ट्रैक करें!",
          gu: "પડ વિભાજન: પહેલાં આકાર ફેરફાર $\\rightarrow$ પછી શેડિંગ/રંગ નિયમ $\\rightarrow$ પછી પરિભ્રમણ કોણ ટ્રેક કરો!"
        }
      },
      {
        type: "relatable_story",
        icon: "morph_shape",
        title: {
          en: "Meet Varun",
          hi: "वरुण से मिलें",
          gu: "મળો વરુણને"
        },
        story: {
          en: "Varun struggled with a 4-step sequence: Step 1: White Triangle (3 sides) pointing UP; Step 2: Striped Square (4 sides) pointing RIGHT; Step 3: Black Pentagon (5 sides) pointing DOWN. Varun broke it down: Sides = 3 $\\rightarrow$ 4 $\\rightarrow$ 5 $\\rightarrow$ 6 (Hexagon); Shading = White $\\rightarrow$ Striped $\\rightarrow$ Black $\\rightarrow$ White; Direction = 90° clockwise (LEFT). He found the exact choice in 5 seconds!",
          hi: "वरुण एक पहेली में उलझ गया: चरण 1: सफेद त्रिभुज (ऊपर); चरण 2: धारीदार वर्ग (दाएँ); चरण 3: काला पंचकोण (नीचे)। वरुण ने अलग-अलग देखा: भुजाएं = 3 $\\rightarrow$ 4 $\\rightarrow$ 5 $\\rightarrow$ 6 (षट्कोण); रंग = सफेद $\\rightarrow$ धारी $\\rightarrow$ काला $\\rightarrow$ सफेद; दिशा = 90° दक्षिणावर्त (बायाँ)। 5 सेकंड में सही उत्तर मिल गया!",
          gu: "વરુણ એક કોયડામાં અટવાયો: પગલું ૧: સફેદ ત્રિકોણ (ઉપર); પગલું ૨: પટ્ટાવાળો ચોરસ (જમણે); પગલું ૩: કાળો પંચકોણ (નીચે). વરુણે અલગ-અલગ જોયું: બાજુઓ = ૩ $\\rightarrow$ ૪ $\\rightarrow$ ૫ $\\rightarrow$ ૬ (ષટ્કોણ); રંગ = સફેદ $\\rightarrow$ પટ્ટા $\\rightarrow$ કાળો $\\rightarrow$ સફેદ; દિશા = ૯૦° ઘડિયાળની દિશા (ડાબે). ૫ સેકન્ડમાં સાચો જવાબ મળી ગયો!"
        },
        insight_box: {
          en: "Layer Separation: Never look at everything simultaneously. Eliminate wrong options layer by layer.",
          hi: "परत पृथक्करण: कभी भी सब कुछ एक साथ न देखें। एक-एक परत देखकर गलत विकल्पों को हटाते जाएं।",
          gu: "પડ અલગ કરો: ક્યારેય બધું એક સાથે ન જુઓ. એક-એક ભાગ જોઈને ખોટા જવાબો રદ કરતા જાઓ."
        }
      },
      {
        type: "method_concept_check",
        icon: "morph_shape",
        question: {
          en: "When a geometric sequence changes both Shape (+1 side each step) AND Shading (alternating White/Black), what is the best strategy?",
          hi: "जब कोई ज्यामितीय श्रृंखला आकार (+1 भुजा हर चरण में) और छायांकन (सफेद/काला बारी-बारी) दोनों बदलती है, तो सबसे अच्छी रणनीति क्या है?",
          gu: "જ્યારે કોઈ ભૌમિતિક શ્રેણી આકાર (+૧ બાજુ દરેક પગલે) અને શેડિંગ (વારાફરતી સફેદ/કાળો) બંને બદલે છે, ત્યારે શ્રેષ્ઠ યુક્તિ કઈ છે?"
        },
        option_a: {
          en: "First find the shape with the correct number of sides to eliminate wrong options, then check the shading.",
          hi: "पहले सही भुजाओं वाली आकृति खोजकर गलत विकल्प हटाएं, फिर रंग/छायांकन की जांच करें।",
          gu: "પહેલાં સાચી બાજુઓવાળો આકાર શોધીને ખોટા વિકલ્પો રદ કરો, પછી શેડિંગ/રંગ તપાસો."
        },
        option_b: {
          en: "Stare at all 4 answer choices until one feels lucky.",
          hi: "चारों विकल्पों को तब तक देखते रहें जब तक कोई एक सही न लगने लगे।",
          gu: "ચારેય વિકલ્પો તરફ ત્યાં સુધી તાકી રહો જ્યાં સુધી કોઈ એક સાચો ન લાગે."
        },
        feedback: {
          en: "Correct! Isolating features (sides first, then shading) eliminates 75% of distractors immediately.",
          hi: "सही! विशेषताओं को अलग-अलग देखने (पहले भुजाएं, फिर छायांकन) से 75% गलत विकल्प तुरंत हट जाते हैं।",
          gu: "સાચું! વિશેષતાઓને અલગ-અલગ જોવાથી (પહેલાં બાજુઓ, પછી શેડિંગ) ૭૫% ખોટા વિકલ્પો તરત જ નીકળી જાય છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "morph_shape",
        question: {
          en: "Sequence: \nStep 1: 1 Black Dot inside Circle \nStep 2: 2 Striped Dots inside Square \nStep 3: 3 White Dots inside Triangle \nStep 4: ? \n(Rules: Outer Shape sides: 0 $\\rightarrow$ 4 $\\rightarrow$ 3 $\\rightarrow$ 4? Or count: Dots = 1 $\\rightarrow$ 2 $\\rightarrow$ 3 $\\rightarrow$ 4; Shading: Black $\\rightarrow$ Striped $\\rightarrow$ White $\\rightarrow$ Black). \nWhat must Step 4 contain?",
          hi: "श्रृंखला: \nचरण 1: वृत्त में 1 काला बिंदु \nचरण 2: वर्ग में 2 धारीदार बिंदु \nचरण 3: त्रिभुज में 3 सफेद बिंदु \nचरण 4: ? \n(बिंदुओं की संख्या = 1 $\\rightarrow$ 2 $\\rightarrow$ 3 $\\rightarrow$ 4; छायांकन = काला $\\rightarrow$ धारीदार $\\rightarrow$ सफेद $\\rightarrow$ काला)। \nचरण 4 में क्या होना चाहिए?",
          gu: "શ્રેણી: \nપગલું ૧: વર્તુળમાં ૧ કાળું ટપકું \nપગલું ૨: ચોરસમાં ૨ પટ્ટાવાળા ટપકાં \nપગલું ૩: ત્રિકોણમાં ૩ સફેદ ટપકાં \nપગલું ૪: ? \n(ટપકાંની સંખ્યા = ૧ $\\rightarrow$ ૨ $\\rightarrow$ ૩ $\\rightarrow$ ૪; શેડિંગ = કાળો $\\rightarrow$ પટ્ટા $\\rightarrow$ સફેદ $\\rightarrow$ કાળો). \nપગલાં ૪ માં શું હોવું જોઈએ?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "4 Black Dots inside a shape",
              hi: "आकृति के अंदर 4 काले बिंदु",
              gu: "આકારની અંદર ૪ કાળાં ટપકાં"
            }
          },
          {
            id: "B",
            text: {
              en: "3 Striped Dots",
              hi: "3 धारीदार बिंदु",
              gu: "૩ પટ્ટાવાળાં ટપકાં"
            }
          },
          {
            id: "C",
            text: {
              en: "5 White Dots",
              hi: "5 सफेद बिंदु",
              gu: "૫ સફેદ ટપકાં"
            }
          },
          {
            id: "D",
            text: {
              en: "2 Black Dots",
              hi: "2 काले बिंदु",
              gu: "૨ કાળાં ટપકાં"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! Count must be 4 dots, and shading cycle (Black $\\rightarrow$ Striped $\\rightarrow$ White) resets to Black!",
          hi: "शानदार! बिंदुओं की संख्या 4 होगी, और रंग चक्र (काला $\\rightarrow$ धारी $\\rightarrow$ सफेद) वापस काले पर आएगा!",
          gu: "એકદમ સાચું! ટપકાંની સંખ્યા ૪ થશે, અને રંગ ચક્ર (કાળો $\\rightarrow$ પટ્ટા $\\rightarrow$ સફેદ) પાછો કાળા પર આવશે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "morph_shape",
        title: {
          en: "Morph Tracker Superpower",
          hi: "मॉर्फ ट्रैकर सुपरपावर",
          gu: "મોર્ફ ટ્રેકર સુપરપાવર"
        },
        body: {
          en: "Separate complex patterns into shape, shading, and count layers to solve with ease.",
          hi: "आसानी से हल करने के लिए जटिल पैटर्न को आकार, रंग और संख्या की परतों में बांटें।",
          gu: "સરળતાથી ઉકેલવા માટે અટપટી પેટર્નને આકાર, રંગ અને સંખ્યાના ભાગોમાં વહેંચો."
        },
        tags: [
          { en: "Track Shapes", hi: "आकार ट्रैक करें", gu: "આકાર ટ્રેક કરો" },
          { en: "Track Shading", hi: "रंग चक्र देखें", gu: "રંગ ચક્ર જુઓ" },
          { en: "Count Increments", hi: "संख्या बढ़ोतरी", gu: "સંખ્યા વધારો" },
          { en: "Spin Angles", hi: "घूर्णन कोण", gu: "પરિભ્રમણ કોણ" },
          { en: "Layer by Layer", hi: "परत-दर-परत", gu: "એક પછી એક ભાગ" },
          { en: "Pattern Master", hi: "पैटर्न मास्टर", gu: "પેટર્ન માસ્ટર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "morph_shape",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Look at the main shape across steps and determine the side-count or form progression.",
              hi: "सभी चरणों में मुख्य आकृति को देखें और भुजाओं की संख्या में बदलाव पहचानें।",
              gu: "બધા પગલાંમાં મુખ્ય આકાર જુઓ અને બાજુઓની સંખ્યામાં ફેરફાર ઓળખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Track the shading/fill rule (e.g. White $\\rightarrow$ Gray $\\rightarrow$ Black cycle).",
              hi: "छायांकन/रंग नियम को ट्रैक करें (जैसे सफेद $\\rightarrow$ धूसर $\\rightarrow$ काला चक्र)।",
              gu: "શેડિંગ/રંગ નિયમ ટ્રેક કરો (જેમ કે સફેદ $\\rightarrow$ રાખોડી $\\rightarrow$ કાળો ચક્ર)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Check the internal element count or rotation angle (e.g. 90° clockwise).",
              hi: "अंदरूनी तत्वों की संख्या या घूर्णन कोण (जैसे 90° दक्षिणावर्त) की जांच करें।",
              gu: "અંદરના તત્વોની સંખ્યા કે પરિભ્રમણ કોણ (જેમ કે ૯૦° ઘડિયાળની દિશા) ચકાસો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Combine your 3 layer predictions to select the single matching option.",
              hi: "एकमात्र सही विकल्प चुनने के लिए अपनी तीनों परतों के निष्कर्षों को मिलाएं।",
              gu: "એકમાત્ર સાચો વિકલ્પ પસંદ કરવા માટે તમારા ત્રણેય તારણોને ભેગા કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "morph_shape",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Draw a 4-step transformation pattern in your notebook using 2 changing rules (shape sides + shading) and challenge a friend!",
          hi: "अपनी कॉपी में 2 नियमों (आकार + रंग) वाला 4-चरणीय पैटर्न बनाएं और दोस्त से हल करवाएं!",
          gu: "તમારી નોટબુકમાં ૨ નિયમો (આકાર + રંગ) વાળી ૪-પગલાંની પેટર્ન દોરો અને મિત્ર સાથે ઉકેલો!"
        },
        commitment_button_text: {
          en: "I will track transformation layers!",
          hi: "मैं रूपांतरण परतों को ट्रैक करूँगा!",
          gu: "હું રૂપાંતરણના પડો ટ્રેક કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_130",
    methodNumber: 130,
    classLevel: 5,
    category: {
      en: "Attention / Focus Strategies",
      hi: "ध्यान / एकाग्रता रणनीतियाँ",
      gu: "ધ્યાન / એકાગ્રતા વ્યૂહરચનાઓ"
    },
    title: {
      en: "Rule Switching (Cognitive Gear Shift)",
      hi: "नियम बदलना (संज्ञानात्मक गियर शिफ्ट)",
      gu: "નિયમ બદલવો (જ્ઞાનાત્મક ગિયર શિફ્ટ)"
    },
    description: {
      en: "Flexibly switch mental sorting rules on command (e.g., sort by color $\\rightarrow$ switch to sort by shape) without sticking to old habits.",
      hi: "पुरानी आदत में अटके बिना दिए गए निर्देश पर मानसिक छंटनी नियम (जैसे रंग $\\rightarrow$ आकार) को तुरंत बदलें।",
      gu: "જૂની આદતમાં અટક્યા વિના આપેલા નિર્દેશ પર વર્ગીકરણ નિયમ (જેમ કે રંગ $\\rightarrow$ આકાર) ને તાત્કાલિક બદલો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "gear_shift",
        title: {
          en: "Brain Stuck When Game Rules Suddenly Flip?",
          hi: "जब खेल या परीक्षा में नियम अचानक बदलते हैं तो दिमाग पिछले नियम पर ही अटका रहता है?",
          gu: "જ્યારે રમત કે પરીક્ષામાં નિયમો અચાનક બદલાય ત્યારે મગજ જૂના નિયમ પર જ ચોંટી રહે છે?"
        },
        pain_quotes: [
          {
            en: "In sorting games, after sorting 10 cards by Color, when the prompt switches to 'Sort by Shape', I keep sorting by color!",
            hi: "रंग के आधार पर 10 कार्ड छांटने के बाद जब 'आकार के आधार पर छांटो' आता है, तो मैं गलती से रंग ही देखता रहता हूँ!",
            gu: "રંગ મુજબ ૧૦ કાર્ડ વહેંચ્યા પછી જ્યારે 'આકાર મુજબ વહેંચો' આવે, ત્યારે હું ભૂલથી રંગ જ જોતો રહું છું!"
          },
          {
            en: "My brain has mental friction when switching from Math word problems to English grammar rules!",
            hi: "गणित के सवालों से अंग्रेजी व्याकरण पर जाते समय मेरा दिमाग धीमा पड़ जाता है!",
            gu: "ગણિતના દાખલામાંથી અંગ્રેજી વ્યાકરણ પર જતાં મારું મગજ ધીમું પડી જાય છે!"
          }
        ],
        body: {
          en: "Psychologists call this 'Perseveration'—the brain's tendency to repeat the old rule because it's comfortable. 'Cognitive Gear Shifting' presses the mental clutch, drops the old rule, and shifts cleanly into the new gear!",
          hi: "वैज्ञानिक इसे 'जड़ता' कहते हैं—आराम के कारण पुराने नियम को दोहराते रहना। 'गियर शिफ्टिंग' मानसिक क्लच दबाकर पुराने नियम को छोड़ती है और नए गियर में प्रवेश करती है!",
          gu: "વૈજ્ઞાનિકો તેને 'જડતા' કહે છે—સગવડના કારણે જૂના નિયમને વળગી રહેવું. 'ગિયર શિફ્ટિંગ' માનસિક ક્લચ દબાવીને જૂનો નિયમ છોડે છે અને નવા ગિયરમાં સ્મૂધ પ્રવેશે છે!"
        },
        key_takeaway: {
          en: "Gear Shift Rule: Freeze old rule (Clutch In) $\\rightarrow$ Name new rule aloud (Shift Gear) $\\rightarrow$ Go (Clutch Out)!",
          hi: "गियर शिफ्ट नियम: पुराना नियम रोकें (क्लच दबाएं) $\\rightarrow$ नया नियम जोर से बोलें (गियर बदलें) $\\rightarrow$ आगे बढ़ें!",
          gu: "ગિયર શિફ્ટ નિયમ: જૂનો નિયમ રોકો (ક્લચ દબાવો) $\\rightarrow$ નવો નિયમ મોટેથી બોલો (ગિયર બદલો) $\\rightarrow$ આગળ વધો!"
        }
      },
      {
        type: "relatable_story",
        icon: "gear_shift",
        title: {
          en: "Meet Zayn",
          hi: "जैन से मिलें",
          gu: "મળો ઝૈનને"
        },
        story: {
          en: "Zayn was playing the 'Stroop Color-Word Challenge': When the word 'RED' was printed in BLUE ink, Rule 1 was 'Read the Word', but Level 2 switched to 'Name the Ink Color'. Zayn kept saying 'RED' instead of 'BLUE'! He learned to pause for 1 second and whisper the active rule: 'Ink Color!'. He instantly scored a perfect streak.",
          hi: "जैन 'स्ट्रूप कलर चैलेंज' खेल रहा था: जब 'RED' शब्द नीले रंग में लिखा था, तो लेवल 2 में नियम था 'रंग का नाम बोलो'। जैन बार-बार 'RED' पढ़ रहा था! उसने 1 सेकंड रुककर सक्रिय नियम बुदबुदाना सीखा: 'रंग देखो!'। उसने तुरंत शत-प्रतिशत स्कोर बना लिया।",
          gu: "ઝૈન 'સ્ટ્રૂપ કલર ચેલેન્જ' રમી રહ્યો હતો: જ્યારે 'RED' શબ્દ વાદળી રંગમાં લખ્યો હતો, ત્યારે લેવલ ૨ નો નિયમ હતો 'શાહીનો રંગ બોલો'. ઝૈન વારંવાર 'RED' બોલી જતો હતો! તેણે ૧ સેકન્ડ રોકાઈને સક્રિય નિયમ બોલવાનું શીખ્યું: 'રંગ જુઓ!'. તેણે તરત જ પૂરા માર્ક્સ મેળવી લીધા."
        },
        insight_box: {
          en: "Verbal Override: Saying the active rule aloud forces your executive brain network to override muscle memory habits.",
          hi: "मौखिक नियंत्रण: नए नियम को बोलकर दोहराने से दिमाग पुरानी आदत को तुरंत रोक देता है।",
          gu: "મૌખિક નિયંત્રણ: નવા નિયમને બોલીને યાદ કરવાથી મગજ જૂની ટેવને તરત જ અટકાવી દે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "gear_shift",
        question: {
          en: "You are sorting cards: \nRule 1: 'Tap Left for Even numbers, Tap Right for Odd numbers.' \nSuddenly the screen announces: 'RULE SWITCH: Tap Left for Greater than 50, Tap Right for Less than 50.' \nCard shows: 48. What is the correct action?",
          hi: "आप कार्ड छांट रहे हैं: \nनियम 1: 'सम संख्या के लिए बायाँ, विषम के लिए दायाँ।' \nअचानक नियम बदला: '50 से बड़ी संख्या के लिए बायाँ, 50 से छोटी के लिए दायाँ।' \nकार्ड पर संख्या है: 48। सही क्रिया क्या है?",
          gu: "તમે કાર્ડ વર્ગીકૃત કરી રહ્યા છો: \nનિયમ ૧: 'બેકી સંખ્યા માટે ડાબે, એકી માટે જમણે.' \nઅચાનક નિયમ બદલાયો: '૫૦ થી મોટી માટે ડાબે, ૫૦ થી નાની માટે જમણે.' \nકાર્ડ પર સંખ્યા છે: ૪૮. સાચી ક્રિયા કઈ છે?"
        },
        option_a: {
          en: "Tap Right (because 48 is Less than 50 under the NEW rule).",
          hi: "दायाँ दबाएं (क्योंकि नए नियम के तहत 48, 50 से कम है)।",
          gu: "જમણું દબાવો (કારણ કે નવા નિયમ મુજબ ૪૮ એ ૫૦ કરતાં નાની છે)."
        },
        option_b: {
          en: "Tap Left (because 48 is an Even number under the OLD rule).",
          hi: "बायाँ दबाएं (क्योंकि पुराने नियम के तहत 48 सम संख्या थी)।",
          gu: "ડાબું દબાવો (કારણ કે જૂના નિયમ મુજબ ૪૮ બેકી સંખ્યા હતી)."
        },
        feedback: {
          en: "Correct! The old 'Even/Odd' rule is dead. Under the NEW rule, 48 is Less than 50 $\\rightarrow$ Tap Right!",
          hi: "सही! पुराना नियम खत्म हो चुका है। नए नियम के तहत 48, 50 से छोटा है $\\rightarrow$ दायाँ दबाएं!",
          gu: "સાચું! જૂનો નિયમ પૂરો થઈ ગયો છે. નવા નિયમ મુજબ ૪૮ એ ૫૦ કરતાં નાની છે $\\rightarrow$ જમણું દબાવો!"
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "gear_shift",
        question: {
          en: "Task: Name the Shape of the big outer boundary, IGNORE the small inside icons. \nImage: A giant Circle containing 5 tiny Triangles. \nWhat is the correct answer under this rule?",
          hi: "कार्य: बाहरी बड़ी आकृति का नाम बताएं, अंदर के छोटे चित्रों को अनदेखा करें। \nचित्र: एक बड़ा वृत्त (Circle) जिसके अंदर 5 छोटे त्रिभुज हैं। \nइस नियम के तहत सही उत्तर क्या है?",
          gu: "કાર્ય: બહારની મોટી આકૃતિનું નામ આપો, અંદરના નાના ચિત્રોને અવગણો. \nચિત્ર: એક મોટું વર્તુળ (Circle) જેની અંદર ૫ નાના ત્રિકોણ છે. \nઆ નિયમ મુજબ સાચો જવાબ શું છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Circle (Big outer shape rule)",
              hi: "वृत्त (Circle - बाहरी आकृति नियम)",
              gu: "વર્તુળ (Circle - બહારનો આકાર નિયમ)"
            }
          },
          {
            id: "B",
            text: {
              en: "Triangle",
              hi: "त्रिभुज",
              gu: "ત્રિકોણ"
            }
          },
          {
            id: "C",
            text: {
              en: "Five triangles",
              hi: "पांच त्रिभुज",
              gu: "પાંચ ત્રિકોણ"
            }
          },
          {
            id: "D",
            text: {
              en: "Square",
              hi: "वर्ग",
              gu: "ચોરસ"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! The active rule targets the outer container, so 'Circle' is the correct response while ignoring the distractor triangles.",
          hi: "शानदार! सक्रिय नियम बाहरी आकृति पर ध्यान देने का है, इसलिए छोटे त्रिभुजों को छोड़कर 'वृत्त' सही उत्तर है।",
          gu: "એકદમ સાચું! સક્રિય નિયમ બહારના આકાર પર ધ્યાન આપવાનો છે, તેથી નાના ત્રિકોણોને અવગણીને 'વર્તુળ' સાચો જવાબ છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "gear_shift",
        title: {
          en: "Gear Shift Superpower",
          hi: "गियर शिफ्ट सुपरपावर",
          gu: "ગિયર શિફ્ટ સુપરપાવર"
        },
        body: {
          en: "Drop the old rule, state the new rule aloud, and execute with zero habit lag.",
          hi: "पुराने नियम को छोड़ें, नया नियम जोर से बोलें और बिना किसी भ्रम के आगे बढ़ें।",
          gu: "જૂનો નિયમ છોડો, નવો નિયમ મોટેથી બોલો અને કોઈપણ ગૂંચવણ વગર આગળ વધો."
        },
        tags: [
          { en: "Drop Old Rule", hi: "पुराना नियम छोड़ें", gu: "જૂનો નિયમ છોડો" },
          { en: "Say New Rule", hi: "नया नियम बोलें", gu: "નવો નિયમ બોલો" },
          { en: "Zero Habit Lag", hi: "आदत से मुक्ति", gu: "ટેવમાંથી મુક્તિ" },
          { en: "Mental Flexibility", hi: "मानसिक लचीलापन", gu: "માનસિક લવચીકતા" },
          { en: "Ignore Distractors", hi: "भटकाव अनदेखा", gu: "વિક્ષેપ અવગણો" },
          { en: "Quick Reflexes", hi: "त्वरित प्रतिक्रिया", gu: "ઝડપી પ્રતિક્રિયા" }
        ]
      },
      {
        type: "action_checklist",
        icon: "gear_shift",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Recognize the instant the task, prompt, or sorting criteria changes.",
              hi: "उस क्षण को पहचानें जब कार्य, निर्देश या छंटनी का नियम बदलता है।",
              gu: "તે ક્ષણને ઓળખો જ્યારે કાર્ય, સૂચના કે વર્ગીકરણનો નિયમ બદલાય છે."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Take a 1-second mental pause to stop autopilot momentum.",
              hi: "ऑटोपायलट आदत को रोकने के लिए 1 सेकंड का मानसिक विराम लें।",
              gu: "ઓટોપાયલટ ટેવને રોકવા માટે ૧ સેકન્ડનો માનસિક વિરામ લો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Whisper the new rule keywords clearly (e.g. 'Sort by SIZE now!').",
              hi: "नए नियम के मुख्य शब्दों को स्पष्ट रूप से बुदबुदाएं (जैसे 'अब आकार देखो!')।",
              gu: "નવા નિયમના મુખ્ય શબ્દો સ્પષ્ટપણે બોલો (જેમ કે 'હવે કદ જુઓ!')."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Execute the next 2 decisions deliberately under the new rule.",
              hi: "नए नियम के तहत अगले 2 निर्णय पूरी सावधानी से लें।",
              gu: "નવા નિયમ હેઠળ હવે પછીના ૨ નિર્ણયો પૂરી સાવધાનીથી લો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "gear_shift",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Play a quick sorting game with a deck of cards: Sort 10 cards by Red/Black, then instantly switch to Number vs Face cards without a single mistake!",
          hi: "ताश के पत्तों के साथ खेलें: 10 पत्ते लाल/काले के आधार पर छांटें, फिर बिना गलती के संख्या बनाम चित्र पत्तों पर स्विच करें!",
          gu: "પત્તાની રમતમાં: ૧૦ પત્તા લાલ/કાળા મુજબ વહેંચો, પછી ભૂલ કર્યા વિના સંખ્યા વિરુદ્ધ ચિત્રવાળા પત્તા પર સ્વિચ કરો!"
        },
        commitment_button_text: {
          en: "I will shift cognitive gears smoothly!",
          hi: "मैं मानसिक गियर आसानी से बदलूँगा!",
          gu: "હું માનસિક ગિયર સરળતાથી બદલીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_134",
    methodNumber: 134,
    classLevel: 5,
    category: {
      en: "Attention / Focus Strategies",
      hi: "ध्यान / एकाग्रता रणनीतियाँ",
      gu: "ધ્યાન / એકાગ્રતા વ્યૂહરચનાઓ"
    },
    title: {
      en: "Pomodoro (Sprint & Recharge Sprints)",
      hi: "पोमोडोरो (25-मिनट स्प्रिंट और 5-मिनट रिचार्ज)",
      gu: "પોમોડોરો (૨૫-મિનિટ સ્પ્રિન્ટ અને ૫-મિનિટ રિચાર્જ)"
    },
    description: {
      en: "Divide study sessions into 25-minute laser-focus sprints followed by mandatory 5-minute brain rest breaks to destroy procrastination.",
      hi: "टालमटोल खत्म करने और ऊर्जा बनाए रखने के लिए पढ़ाई को 25 मिनट की एकाग्रता और 5 मिनट के आराम में बांटें।",
      gu: "આળસ દૂર કરવા અને ઊર્જા જાળવવા અભ્યાસને ૨૫ મિનિટની એકાગ્રતા અને ૫ મિનિટના આરામમાં વહેંચો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "tomato_timer",
        title: {
          en: "Staring at a 3-Hour Study Mountain and Procrastinating?",
          hi: "3 घंटे की लंबी पढ़ाई का पहाड़ देखकर टालमटोल करने लगते हैं?",
          gu: "૩ કલાકના લાંબા અભ્યાસનો પહાડ જોઈને આળસ ચડી જાય છે?"
        },
        pain_quotes: [
          {
            en: "When I sit down to study for 2 hours, I get exhausted and start checking my phone by minute 15!",
            hi: "जब मैं 2 घंटे पढ़ने बैठता हूँ, तो 15 मिनट में ही थककर फोन देखने लगता हूँ!",
            gu: "જ્યારે હું ૨ કલાક વાંચવા બેસું છું, ત્યારે ૧૫ મિનિટમાં જ થાકીને ફોન જોવા લાગું છું!"
          },
          {
            en: "The thought of studying non-stop all evening makes me put off starting until 9 PM!",
            hi: "शाम भर लगातार पढ़ने के डर से मैं रात 9 बजे तक पढ़ाई शुरू ही नहीं करता!",
            gu: "આખી સાંજ સળંગ વાંચવાના ડરથી હું રાત્રે ૯ વાગ્યા સુધી ભણવાનું શરૂ જ નથી કરતો!"
          }
        ],
        body: {
          en: "The human brain cannot maintain peak concentration for 3 hours straight. The 'Pomodoro Technique' (invented by Francesco Cirillo) turns an endless marathon into a fun 25-minute sprint with a guaranteed 5-minute reward break!",
          hi: "मानव मस्तिष्क लगातार 3 घंटे तक एकाग्र नहीं रह सकता। 'पोमोडोरो तकनीक' अंतहीन मैराथन को 25 मिनट की मजेदार दौड़ और 5 मिनट के पक्के आराम में बदल देती है!",
          gu: "માનવ મગજ સળંગ ૩ કલાક સુધી એકાગ્ર રહી શકતું નથી. 'પોમોડોરો પદ્ધતિ' અનંત મેરેથોનને ૨૫ મિનિટની મજેદાર દોડ અને ૫ મિનિટના પાકા આરામમાં ફેરવી દે છે!"
        },
        key_takeaway: {
          en: "Pomodoro Rule: 25 Minutes Full Focus (Timer ON) $\\rightarrow$ 5 Minutes Recharge (Screen OFF) $\\rightarrow$ Repeat!",
          hi: "पोमोडोरो नियम: 25 मिनट पूरा ध्यान (टाइमर ऑन) $\\rightarrow$ 5 मिनट रिचार्ज (स्क्रीन बंद) $\\rightarrow$ दोहराएं!",
          gu: "પોમોડોરો નિયમ: ૨૫ મિનિટ પૂરી એકાગ્રતા (ટાઈમર ચાલુ) $\\rightarrow$ ૫ મિનિટ રિચાર્જ (સ્ક્રીન બંધ) $\\rightarrow$ પુનરાવર્તન!"
        }
      },
      {
        type: "relatable_story",
        icon: "tomato_timer",
        title: {
          en: "Meet Samarth",
          hi: "समर्थ से मिलें",
          gu: "મળો સમર્થને"
        },
        story: {
          en: "Samarth used to sit at his desk for 3 sluggish hours, daydreaming and getting only 4 math problems done. He tried 1 Pomodoro: set a timer for 25 minutes, put his phone in another room, and raced the clock. He finished all 8 math problems in that single 25-minute sprint, then enjoyed a guilt-free 5-minute dance break!",
          hi: "समर्थ 3 घंटे टेबल पर सुस्त बैठकर सपने देखता रहता था और सिर्फ 4 सवाल कर पाता था। उसने 1 पोमोडोरो आजमाया: 25 मिनट का टाइमर लगाया, फोन दूसरे कमरे में रखा और काम शुरू किया। उसने सिर्फ 25 मिनट में सभी 8 सवाल खत्म कर लिए और फिर 5 मिनट का मजेदार ब्रेक लिया!",
          gu: "સમર્થ ૩ કલાક ટેબલ પર સુસ્ત બેસીને વિચારોમાં ખોવાયેલો રહેતો અને માત્ર ૪ દાખલા ગણી શકતો. તેણે ૧ પોમોડોરો અજમાવ્યો: ૨૫ મિનિટનું ટાઈમર લગાવ્યું, ફોન બીજા રૂમમાં મૂક્યો અને કામ શરૂ કર્યું. તેણે માત્ર ૨૫ મિનિટમાં બધા ૮ દાખલા પૂરા કર્યા અને પછી ૫ મિનિટનો મસ્ત બ્રેક લીધો!"
        },
        insight_box: {
          en: "Urgency Effect: A ticking 25-minute timer creates friendly urgency, turning work into an exciting game.",
          hi: "समय का जादू: 25 मिनट का टिक-टिक करता टाइमर काम को एक रोमांचक खेल में बदल देता है।",
          gu: "સમયનો જાદુ: ૨૫ મિનિટનું ટિક-ટિક કરતું ટાઈમર અભ્યાસને એક રોમાંચક રમતમાં ફેરવી દે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "tomato_timer",
        question: {
          en: "During the 5-minute recharge break between two 25-minute Pomodoro sprints, what is the BEST activity for your brain?",
          hi: "दो 25-मिनट के पोमोडोरो स्प्रिंट के बीच 5-मिनट के ब्रेक के दौरान आपके दिमाग के लिए सबसे अच्छी गतिविधि क्या है?",
          gu: "બે ૨૫-મિનિટના પોમોડોરો સત્રો વચ્ચે ૫-મિનિટના બ્રેક દરમિયાન તમારા મગજ માટે સૌથી શ્રેષ્ઠ પ્રવૃત્તિ કઈ છે?"
        },
        option_a: {
          en: "Stand up, stretch, drink water, or look out the window (No screens).",
          hi: "खड़े हों, स्ट्रेच करें, पानी पिएं या खिड़की से बाहर देखें (कोई स्क्रीन नहीं)।",
          gu: "ઊભા થાઓ, સ્ટ્રેચિંગ કરો, પાણી પીઓ કે બારી બહાર જુઓ (કોઈ સ્ક્રીન નહીં)."
        },
        option_b: {
          en: "Play a fast video game on your phone.",
          hi: "फोन पर तेज वीडियो गेम खेलें।",
          gu: "ફોન પર વિડીયો ગેમ રમો."
        },
        feedback: {
          en: "Correct! Physical movement and looking into the distance recharges eye muscles and dopamine without screen fatigue.",
          hi: "सही! शारीरिक हलचल और दूर देखना आंखों और दिमाग को बिना स्क्रीन की थकान के पूरी तरह तरोताजा कर देता है।",
          gu: "સાચું! શારીરિક હલનચલન અને દૂર જોવાથી આંખો અને મગજ સ્ક્રીનના થાક વગર સંપૂર્ણ તાજાં થઈ જાય છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "tomato_timer",
        question: {
          en: "You have a 1-hour study block before dinner. How should you structure it using the Pomodoro technique?",
          hi: "रात के खाने से पहले आपके पास 1 घंटे का पढ़ाई का समय है। पोमोडोरो तकनीक का उपयोग करके इसे कैसे व्यवस्थित करें?",
          gu: "રાત્રિભોજન પહેલાં તમારી પાસે ૧ કલાકનો અભ્યાસ સમય છે. પોમોડોરો પદ્ધતિથી તેનું આયોજન કેવી રીતે કરવું?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "25 min Study $\\rightarrow$ 5 min Break $\\rightarrow$ 25 min Study $\\rightarrow$ 5 min Wrap-up",
              hi: "25 मिनट पढ़ाई $\\rightarrow$ 5 मिनट ब्रेक $\\rightarrow$ 25 मिनट पढ़ाई $\\rightarrow$ 5 मिनट समापन",
              gu: "૨૫ મિનિટ અભ્યાસ $\\rightarrow$ ૫ મિનિટ બ્રેક $\\rightarrow$ ૨૫ મિનિટ અભ્યાસ $\\rightarrow$ ૫ મિનિટ પૂર્ણતા"
            }
          },
          {
            id: "B",
            text: {
              en: "60 minutes continuous reading without lifting your head",
              hi: "बिना सिर उठाए 60 मिनट लगातार पढ़ना",
              gu: "માથું ઊંચું કર્યા વગર ૬૦ મિનિટ સળંગ વાંચવું"
            }
          },
          {
            id: "C",
            text: {
              en: "50 minutes playing and 10 minutes rushing homework",
              hi: "50 मिनट खेलना और 10 मिनट में जल्दी-जल्दी काम निपटाना",
              gu: "૫૦ મિનિટ રમવું અને ૧૦ મિનિટમાં ઉતાવળે ગૃહકાર્ય કરવું"
            }
          },
          {
            id: "D",
            text: {
              en: "10 min study followed by 50 min TV break",
              hi: "10 मिनट पढ़ाई और 50 मिनट टीवी देखना",
              gu: "૧૦ મિનિટ વાંચવું અને ૫૦ મિનિટ ટીવી જોવું"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Masterful! Two 25-minute sprints with a 5-minute break perfectly fills the 60-minute window with maximum productivity.",
          hi: "शानदार! 5 मिनट के ब्रेक के साथ 25-25 मिनट के दो स्प्रिंट 60 मिनट में अधिकतम उत्पादकता देते हैं।",
          gu: "ઉત્તમ! ૫ મિનિટના બ્રેક સાથે ૨૫-૨૫ મિનિટના બે સ્પ્રિન્ટ ૬૦ મિનિટમાં સૌથી વધુ પરિણામ આપે છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "tomato_timer",
        title: {
          en: "Pomodoro Sprint Superpower",
          hi: "पोमोडोरो स्प्रिंट सुपरपावर",
          gu: "પોમોડોરો સ્પ્રિન્ટ સુપરપાવર"
        },
        body: {
          en: "Work in 25-minute sprint blocks with 5-minute recharge breaks to stay unstoppable.",
          hi: "हमेशा तरोताजा रहने के लिए 25 मिनट के स्प्रिंट और 5 मिनट के ब्रेक में काम करें।",
          gu: "હંમેશાં તાજા રહેવા માટે ૨૫ મિનિટના સ્પ્રિન્ટ અને ૫ મિનિટના બ્રેકમાં કામ કરો."
        },
        tags: [
          { en: "25-Min Sprint", hi: "25-मिनट स्प्रिंट", gu: "૨૫-મિનિટ સ્પ્રિન્ટ" },
          { en: "5-Min Rest", hi: "5-मिनट आराम", gu: "૫-મિનિટ આરામ" },
          { en: "Timer Running", hi: "टाइमर ऑन", gu: "ટાઈમર ચાલુ" },
          { en: "No Procrastination", hi: "टालमटोल खत्म", gu: "આળસ મુક્ત" },
          { en: "Laser Focus", hi: "गहरी एकाग्रता", gu: "ઊંડી એકાગ્રતા" },
          { en: "Guaranteed Break", hi: "पक्का इनाम", gu: "પાકો આરામ" }
        ]
      },
      {
        type: "action_checklist",
        icon: "tomato_timer",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Pick ONE specific task (e.g. Chapter 4 Science questions) and clear your desk.",
              hi: "एक विशिष्ट कार्य चुनें (जैसे विज्ञान अध्याय 4 के प्रश्न) और टेबल साफ करें।",
              gu: "એક ચોક્કસ કાર્ય પસંદ કરો (જેમ કે વિજ્ઞાન પાઠ ૪ ના પ્રશ્નો) અને ટેબલ સાફ કરો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Set a timer for exactly 25 minutes and press START.",
              hi: "ठीक 25 मिनट का टाइमर लगाएं और स्टार्ट दबाएं।",
              gu: "બરાબર ૨૫ મિનિટનું ટાઈમર સેટ કરો અને સ્ટાર્ટ દબાવો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Work with zero interruptions until the timer rings.",
              hi: "जब तक टाइमर न बजे, बिना किसी भटकाव के पूरी लगन से काम करें।",
              gu: "જ્યાં સુધી ટાઈમર ન વાગે ત્યાં સુધી કોઈપણ વિક્ષેપ વિના લગનથી કામ કરો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Step away from your desk for a 5-minute stretch, water, or fresh air break.",
              hi: "5 मिनट के स्ट्रेच, पानी या ताजी हवा के ब्रेक के लिए टेबल से दूर जाएं।",
              gu: "૫ મિનિટના સ્ટ્રેચિંગ, પાણી કે તાજી હવાના બ્રેક માટે ટેબલથી દૂર જાઓ."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "tomato_timer",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Complete 1 full Pomodoro sprint (25 min focus + 5 min screen-free break) for your homework today!",
          hi: "आज अपने गृहकार्य के लिए 1 पूरा पोमोडोरो स्प्रिंट (25 मिनट ध्यान + 5 मिनट स्क्रीन-मुक्त ब्रेक) पूरा करें!",
          gu: "આજે તમારા ગૃહકાર્ય માટે ૧ પૂરું પોમોડોરો સ્પ્રિન્ટ (૨૫ મિનિટ એકાગ્રતા + ૫ મિનિટ સ્ક્રીન-મુક્ત બ્રેક) પૂર્ણ કરો!"
        },
        commitment_button_text: {
          en: "I will power through with Pomodoro sprints!",
          hi: "मैं पोमोडोरो स्प्रिंट से पढ़ाई करूँगा!",
          gu: "હું પોમોડોરો સ્પ્રિન્ટથી અભ્યાસ કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_140",
    methodNumber: 140,
    classLevel: 5,
    category: {
      en: "Attention / Focus Strategies",
      hi: "ध्यान / एकाग्रता रणनीतियाँ",
      gu: "ધ્યાન / એકાગ્રતા વ્યૂહરચનાઓ"
    },
    title: {
      en: "Priority-First Strategy (Eat the Big Frog)",
      hi: "प्राथमिकता-प्रथम रणनीति (सबसे बड़ा मेंढक पहले खाएं)",
      gu: "પ્રાથમિકતા-પ્રથમ વ્યૂહરચના (સૌથી મોટો દેડકો પહેલાં ખાઓ)"
    },
    description: {
      en: "Tackle your hardest, most important assignment first when mental energy is at 100% before doing easy minor tasks.",
      hi: "जब मानसिक ऊर्जा 100% हो, तो आसान कामों से पहले सबसे कठिन और महत्वपूर्ण काम को निपटाएं।",
      gu: "જ્યારે માનસિક ઊર્જા ૧૦૦% હોય, ત્યારે સરળ કામો પહેલાં સૌથી અઘરું અને મહત્વનું કામ પૂરું કરો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "urgent_first",
        title: {
          en: "Doing Easy Busywork All Evening While the Big Project Looms?",
          hi: "शाम भर आसान छोटे-मोटे काम करते रहे और बड़ा मुख्य प्रोजेक्ट अटका रहा?",
          gu: "આખી સાંજ નાનાં-મોટાં સહેલાં કામો કર્યા અને મોટો મુખ્ય પ્રોજેક્ટ બાકી રહી ગયો?"
        },
        pain_quotes: [
          {
            en: "I spend 40 minutes sharpening pencils and arranging folders to avoid starting my tough math essay!",
            hi: "कठिन गणित असाइनमेंट से बचने के लिए मैं 40 मिनट पेंसिल छीलने और फाइलें जमाने में लगा देता हूँ!",
            gu: "અઘરું ગણિતનું કામ ટાળવા હું ૪૦ મિનિટ પેન્સિલ છોલવામાં અને ફાઈલો ગોઠવવામાં બગાડું છું!"
          },
          {
            en: "By 8 PM when I finally open the hard assignment, my brain is too exhausted to think!",
            hi: "रात 8 बजे जब मैं आखिरकार कठिन काम खोलता हूँ, तब तक मेरा दिमाग थक चुका होता है!",
            gu: "રાત્રે ૮ વાગ્યે જ્યારે હું અઘરું કામ ખોલું છું, ત્યારે મગજ સાવ થાકી ગયું હોય છે!"
          }
        ],
        body: {
          en: "Your willpower is highest at the beginning of your study session. Mark Twain said: 'If you have to eat a live frog, do it first thing in the morning!' Knock out the hardest task first, and the rest of your evening feels effortless.",
          hi: "आपकी मानसिक शक्ति पढ़ाई की शुरुआत में सबसे अधिक होती है। सबसे कठिन काम ('बड़ा मेंढक') सबसे पहले खत्म करें, बाकी की शाम एकदम आसान और तनावमुक्त हो जाएगी!",
          gu: "તમારી માનસિક શક્તિ અભ્યાસની શરૂઆતમાં સૌથી વધુ હોય છે. સૌથી અઘરું કામ ('મોટો દેડકો') સૌથી પહેલાં પૂરું કરો, બાકીની સાંજ એકદમ હળવી અને ચિંતામુક્ત થઈ જશે!"
        },
        key_takeaway: {
          en: "Priority Rule: High-Value Hard Task FIRST $\\rightarrow$ Medium Tasks $\\rightarrow$ Easy Admin/Trivia last!",
          hi: "प्राथमिकता नियम: सबसे कठिन व महत्वपूर्ण काम पहले $\\rightarrow$ मध्यम काम $\\rightarrow$ आसान काम अंत में!",
          gu: "પ્રાથમિકતા નિયમ: સૌથી અઘરું અને મહત્વનું કામ પહેલાં $\\rightarrow$ મધ્યમ કામ $\\rightarrow$ સરળ કામ છેલ્લે!"
        }
      },
      {
        type: "relatable_story",
        icon: "urgent_first",
        title: {
          en: "Meet Tanmay",
          hi: "तन्मय से मिलें",
          gu: "મળો તન્મયને"
        },
        story: {
          en: "Tanmay had 3 tasks: 1) Draw a title page (easy, 10 min), 2) Pack school bag (easy, 5 min), 3) Solve 10 fraction word problems (hard, 35 min). He spent 1 hour doodling the title page, got tired, and cried over fractions at 10 PM. The next day, he ate the frog first: tackled fractions at 5 PM when fresh, finished in 25 min, and enjoyed his evening!",
          hi: "तन्मय के पास 3 काम थे: 1) कवर पेज सजाना (आसान), 2) बैग पैक करना (आसान), 3) भिन्न के 10 कठिन सवाल (मुश्किल)। उसने 1 घंटा कवर पेज में लगाया और रात 10 बजे रोने लगा। अगले दिन उसने पहले भिन्न के सवाल हल किए, 25 मिनट में खत्म किया और मजे से शाम बिताई!",
          gu: "તન્મય પાસે ૩ કામ હતા: ૧) કવર પેજ સજાવવું (સરળ), ૨) દફતર ભરવું (સરળ), ૩) અપૂર્ણાંકના ૧૦ અઘરા દાખલા (મુશ્કેલ). તેણે ૧ કલાક કવર પેજમાં બગાડ્યો અને રાત્રે ૧૦ વાગ્યે રડવા લાગ્યો. બીજા દિવસે તેણે પહેલાં દાખલા ગણ્યા, ૨૫ મિનિટમાં પતાવ્યા અને મજાથી સાંજ માણી!"
        },
        insight_box: {
          en: "Energy Matching: Match your biggest brain-drain tasks to your peak energy window.",
          hi: "ऊर्जा मिलान: अपने सबसे भारी मानसिक कार्यों को अपनी उच्चतम ऊर्जा वाले समय में ही करें।",
          gu: "ઊર્જા મેળવણી: તમારા સૌથી અઘરા માનસિક કાર્યોને તમારી સર્વોચ્ચ ઊર્જાવાળા સમયે જ કરો."
        }
      },
      {
        type: "method_concept_check",
        icon: "urgent_first",
        question: {
          en: "You have 3 homework items: \nItem 1: Memorize 12 new Sanskrit vocabulary words (Hard & Urgent) \nItem 2: Color a map border (Easy & Low stakes) \nItem 3: Read 1 short moral story (Medium) \nIn what order should you execute them?",
          hi: "आपके पास गृहकार्य के 3 काम हैं: \n1: संस्कृत के 12 नए शब्द याद करना (कठिन व जरूरी) \n2: नक्शे में रंग भरना (आसान) \n3: 1 छोटी कहानी पढ़ना (मध्यम) \nउन्हें किस क्रम में करना चाहिए?",
          gu: "તમારી પાસે ગૃહકાર્યના ૩ કામ છે: \n૧: સંસ્કૃતના ૧૨ નવા શબ્દો પાકા કરવા (અઘરું અને જરૂરી) \n૨: નકશામાં રંગ પૂરવો (સરળ) \n૩: ૧ નાની વાર્તા વાંચવી (મધ્યમ) \nતેમને કયા ક્રમમાં કરવા જોઈએ?"
        },
        option_a: {
          en: "Item 1 (Sanskrit words) $\\rightarrow$ Item 3 (Story) $\\rightarrow$ Item 2 (Color map).",
          hi: "काम 1 (संस्कृत शब्द) $\\rightarrow$ काम 3 (कहानी) $\\rightarrow$ काम 2 (नक्शा रंगना)।",
          gu: "કામ ૧ (સંસ્કૃત શબ્દો) $\\rightarrow$ કામ ૩ (વાર્તા) $\\rightarrow$ કામ ૨ (નકશો રંગવો)."
        },
        option_b: {
          en: "Item 2 (Color map) $\\rightarrow$ Item 3 (Story) $\\rightarrow$ Item 1 (Sanskrit words).",
          hi: "काम 2 (नक्शा रंगना) $\\rightarrow$ काम 3 (कहानी) $\\rightarrow$ काम 1 (संस्कृत शब्द)।",
          gu: "કામ ૨ (નકશો રંગવો) $\\rightarrow$ કામ ૩ (વાર્તા) $\\rightarrow$ કામ ૧ (સંસ્કૃત શબ્દો)."
        },
        feedback: {
          en: "Correct! Tackle the hardest high-focus task (Sanskrit words) first while your brain is 100% charged.",
          hi: "सही! सबसे कठिन काम (संस्कृत शब्द) सबसे पहले करें जब दिमाग पूरी तरह तरोताजा हो।",
          gu: "સાચું! સૌથી અઘરું કામ (સંસ્કૃત શબ્દો) સૌથી પહેલાં કરો જ્યારે મગજ ૧૦૦% તાજું હોય."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "urgent_first",
        question: {
          en: "Why is 'Eating the Big Frog First' psychologically proven to reduce evening anxiety?",
          hi: "'सबसे बड़ा मेंढक पहले खाना' शाम की चिंता और तनाव को कैसे कम करता है?",
          gu: "'સૌથી મોટો દેડકો પહેલાં ખાવો' એ સાંજની ચિંતા અને તણાવને કેવી રીતે ઘટાડે છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "Once the hardest task is done, the rest of the evening feels easy and guilt-free",
              hi: "एक बार कठिन काम पूरा होने पर बाकी की शाम आसान और तनावमुक्त महसूस होती है",
              gu: "એક વાર અઘરું કામ પૂરું થઈ જાય પછી બાકીની સાંજ હળવી અને ચિંતામુક્ત લાગે છે"
            }
          },
          {
            id: "B",
            text: {
              en: "It makes you sleep 12 hours",
              hi: "यह आपको 12 घंटे सोने देता है",
              gu: "તે તમને ૧૨ કલાક ઊંઘવા દે છે"
            }
          },
          {
            id: "C",
            text: {
              en: "It cancels all school tests",
              hi: "यह सभी स्कूल टेस्ट रद्द कर देता है",
              gu: "તે બધી સ્કૂલ ટેસ્ટ રદ કરી દે છે"
            }
          },
          {
            id: "D",
            text: {
              en: "Frogs are green",
              hi: "मेंढक हरे होते हैं",
              gu: "દેડકા લીલા હોય છે"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Spot on! Eliminating the heaviest mental burden early frees your mind and eliminates procrastination guilt.",
          hi: "शानदार! सबसे भारी मानसिक बोझ पहले ही हटा देने से मन हल्का होता है और टालमटोल की चिंता खत्म हो जाती है।",
          gu: "એકદમ સાચું! સૌથી મોટો માનસિક બોજ પહેલાં જ હટાવી દેવાથી મન હળવું થાય છે અને ચિંતા મુક્ત થવાય છે."
        }
      },
      {
        type: "strategy_pills",
        icon: "urgent_first",
        title: {
          en: "Priority-First Superpower",
          hi: "प्राथमिकता-प्रथम सुपरपावर",
          gu: "પ્રાથમિકતા-પ્રથમ સુપરપાવર"
        },
        body: {
          en: "Eat your biggest frog first to turn the rest of your study into a smooth breeze.",
          hi: "बाकी की पढ़ाई को आसान बनाने के लिए सबसे कठिन काम सबसे पहले निपटाएं।",
          gu: "બાકીના અભ્યાસને સરળ બનાવવા સૌથી અઘરું કામ સૌથી પહેલાં પતાવી દો."
        },
        tags: [
          { en: "Eat Big Frog", hi: "बड़ा मेंढक पहले", gu: "મોટો દેડકો પહેલાં" },
          { en: "Fresh Brain Energy", hi: "ताजा मानसिक ऊर्जा", gu: "તાજી માનસિક ઊર્જા" },
          { en: "High Impact", hi: "उच्च महत्व", gu: "ઉચ્ચ મહત્વ" },
          { en: "Zero Guilt", hi: "चिंता मुक्त", gu: "ચિંતા મુક્ત" },
          { en: "Easy Tasks Last", hi: "आसान काम बाद में", gu: "સરળ કામ છેલ્લે" },
          { en: "Productivity Champ", hi: "उत्पादकता चैंपियन", gu: "પરિણામ ચેમ્પિયન" }
        ]
      },
      {
        type: "action_checklist",
        icon: "urgent_first",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "List all homework and study tasks for today on a single notepad.",
              hi: "आज के सभी गृहकार्य और अध्ययन कार्यों को एक कॉपी में लिखें।",
              gu: "આજના બધા ગૃહકાર્ય અને અભ્યાસના કામો એક નોટમાં લખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Circle the single hardest, most intimidating task (your Big Frog).",
              hi: "सबसे कठिन और भारी काम पर गोला लगाएं (आपका बड़ा मेंढक)।",
              gu: "સૌથી અઘરા અને ભારે કામ પર ગોળ કરો (તમારો મોટો દેડકો)."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Attack that Big Frog in your very first study sprint without delay.",
              hi: "बिना किसी देरी के अपने पहले ही पढ़ाई सत्र में उस सबसे कठिन काम को पूरा करें।",
              gu: "કોઈપણ વિલંબ વિના તમારા પહેલા જ સત્રમાં તે સૌથી અઘરા કામને પૂરું કરો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Glide through the remaining easy tasks with energy and confidence.",
              hi: "बाकी बचे आसान कामों को ऊर्जा और आत्मविश्वास के साथ तेजी से पूरा करें।",
              gu: "બાકી વધેલા સરળ કામોને ઉત્સાહ અને આત્મવિશ્વાસ સાથે ઝડપથી પૂરા કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "urgent_first",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Identify your #1 hardest homework assignment today and complete it before touching anything else!",
          hi: "आज अपने सबसे कठिन गृहकार्य की पहचान करें और बाकी कुछ भी छूने से पहले उसे पूरा करें!",
          gu: "આજે તમારા સૌથી અઘરા ગૃહકાર્યને ઓળખો અને બીજું કંઈ પણ અડ્યા પહેલાં તેને પૂરું કરો!"
        },
        commitment_button_text: {
          en: "I will eat my biggest frog first!",
          hi: "मैं सबसे कठिन काम पहले करूँगा!",
          gu: "હું સૌથી અઘરું કામ પહેલાં કરીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_141",
    methodNumber: 141,
    classLevel: 5,
    category: {
      en: "Spatial Intelligence Strategies",
      hi: "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      gu: "સ્થાનિક બુદ્ધિ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Mental Rotation (3D Object Spinner)",
      hi: "मानसिक घूर्णन (3D वस्तु स्पिनर)",
      gu: "માનસિક પરિભ્રમણ (3D ઓબ્જેક્ટ સ્પિનર)"
    },
    description: {
      en: "Mentally spin 3D isometric block figures in space by tracking a single unique anchor feature (like a colored face or protruding cube).",
      hi: "एक मुख्य एंकर (जैसे रंगीन फलक या उभरे हुए घन) को ट्रैक करके 3D आकृतियों को मन में घुमाकर पहचानें।",
      gu: "એક મુખ્ય એન્કર (જેમ કે રંગીન સપાટી કે ઉપસેલો ક્યુબ) ટ્રેક કરીને 3D આકારોને મનમાં ફેરવીને ઓળખો."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "rotate_3d",
        title: {
          en: "Getting Confused by 3D Shapes Turned at Odd Angles?",
          hi: "अलग-अलग कोणों पर घूमी हुई 3D आकृतियों को देखकर सिर चकरा जाता है?",
          gu: "અલગ-અલગ ખૂણે ફરેલા 3D આકારો જોઈને માથું ઘૂમવા લાગે છે?"
        },
        pain_quotes: [
          {
            en: "When an L-shaped 3D block rotates 90° sideways, I can't tell which option is the same shape!",
            hi: "जब कोई L-आकार का 3D ब्लॉक तिरछा घूमता है, तो मैं पहचान नहीं पाता कि कौन सा विकल्प सही है!",
            gu: "જ્યારે L-આકારનો 3D બ્લોક ત્રાંસો ફરે છે, ત્યારે હું ઓળખી નથી શકતો કે કયો વિકલ્પ સાચો છે!"
          },
          {
            en: "I try to rotate the entire complicated block in my head at once and lose my orientation!",
            hi: "मैं पूरे जटिल ब्लॉक को एक साथ मन में घुमाने की कोशिश करता हूँ और दिशा भूल जाता हूँ!",
            gu: "હું આખા અટપટા બ્લોકને એક સાથે મનમાં ફેરવવાની કોશિશ કરું છું અને દિશા ભૂલી જાઉં છું!"
          }
        ],
        body: {
          en: "Rotating an entire 3D object in your mind creates high working-memory overload. 'Anchor Feature Tracking' locks onto ONE distinct landmark (e.g. the single red corner cube) and follows ONLY that anchor as it spins!",
          hi: "पूरे 3D ऑब्जेक्ट को एक साथ घुमाने से दिमाग पर भारी बोझ पड़ता है। 'एंकर ट्रैकिंग' किसी एक अनोखे हिस्से (जैसे लाल कोने वाला घन) को चुनती है और घूमते समय केवल उसी पर नजर रखती है!",
          gu: "આખા 3D ઓબ્જેક્ટને એક સાથે ફેરવવાથી મગજ પર ભારે બોજ પડે છે. 'એન્કર ટ્રેકિંગ' કોઈ એક અનોખા ભાગ (જેમ કે લાલ ખૂણાવાળો ક્યુબ) ને પકડે છે અને ફરતી વખતે માત્ર તેના પર જ નજર રાખે છે!"
        },
        key_takeaway: {
          en: "Anchor Spinner Rule: Pick 1 Landmark Cube $\\rightarrow$ Track its 90°/180° rotation path $\\rightarrow$ Match orientation!",
          hi: "एंकर स्पिनर नियम: 1 मुख्य घन चुनें $\\rightarrow$ उसके 90°/180° घूमने के रास्ते को ट्रैक करें $\\rightarrow$ सही विकल्प खोजें!",
          gu: "એન્કર સ્પિનર નિયમ: ૧ મુખ્ય ક્યુબ પસંદ કરો $\\rightarrow$ તેના ૯૦°/૧૮૦° ફરવાના રસ્તાને ટ્રેક કરો $\\rightarrow$ સાચો વિકલ્પ શોધો!"
        }
      },
      {
        type: "relatable_story",
        icon: "rotate_3d",
        title: {
          en: "Meet Rithvik",
          hi: "ऋत्विक से मिलें",
          gu: "મળો ઋત્વિકને"
        },
        story: {
          en: "Rithvik had a spatial test showing a 3D staircase block rotated 90° clockwise. Instead of rotating the whole block, he focused on the 'Top Step Dot'. As the staircase spun 90° right, the Top Step moved from Top (12:00) to Right (3:00). He immediately eliminated 3 options where the step was pointing elsewhere!",
          hi: "ऋत्विक के सामने 3D सीढ़ीदार ब्लॉक था जिसे 90° दक्षिणावर्त घुमाया गया था। उसने पूरी सीढ़ी घुमाने के बजाय 'ऊपरी पायदान के बिंदु' पर ध्यान दिया। जैसे ही सीढ़ी दाईं ओर घूमी, पायदान ऊपर (12 बजे) से दाएँ (3 बजे) आ गया। उसने 5 सेकंड में सही उत्तर चुन लिया!",
          gu: "ઋત્વિક સામે 3D સીડીવાળો બ્લોક હતો જેને ૯૦° ઘડિયાળની દિશામાં ફેરવવામાં આવ્યો હતો. તેણે આખી સીડી ફેરવવાને બદલે 'ટોચના પગથિયાંના ટપકાં' પર ધ્યાન આપ્યું. સીડી જમણી તરફ ફરતાં જ પગથિયું ઉપરથી જમણે આવી ગયું. તેણે ૫ સેકન્ડમાં સાચો જવાબ પકડી લીધો!"
        },
        insight_box: {
          en: "Clock Anchor: Track whether your landmark cube moves Top (12:00) $\\rightarrow$ Right (3:00) $\\rightarrow$ Bottom (6:00) $\\rightarrow$ Left (9:00).",
          hi: "घड़ी एंकर: देखें कि आपका मुख्य हिस्सा ऊपर (12:00) $\\rightarrow$ दाएँ (3:00) $\\rightarrow$ नीचे (6:00) $\\rightarrow$ बाएँ (9:00) कहाँ जाता है।",
          gu: "ઘડિયાળ એન્કર: જુઓ કે તમારો મુખ્ય ભાગ ઉપર (૧૨:૦૦) $\\rightarrow$ જમણે (૩:૦૦) $\\rightarrow$ નીચે (૬:૦૦) $\\rightarrow$ ડાબે (૯:૦૦) ક્યાં જાય છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "rotate_3d",
        question: {
          en: "An arrow points straight UP on the top face of a 3D cube. If the cube is rotated 90° clockwise around its center, where does the arrow point now?",
          hi: "एक 3D घन के ऊपरी फलक पर एक तीर सीधे ऊपर की ओर है। यदि घन को 90° दक्षिणावर्त (घड़ी की दिशा में) घुमाया जाए, तो तीर अब कहाँ होगा?",
          gu: "એક 3D ક્યુબની ઉપરની સપાટી પર એક તીર સીધું ઉપર તરફ છે. જો ક્યુબને ૯૦° ઘડિયાળની દિશામાં ફેરવવામાં આવે, તો તીર હવે ક્યાં હશે?"
        },
        option_a: {
          en: "Pointing to the RIGHT (East / 3:00 position).",
          hi: "दाईं ओर (पूर्व / 3 बजे की स्थिति में)।",
          gu: "જમણી તરફ (પૂર્વ / ૩ વાગ્યાની સ્થિતિમાં)."
        },
        option_b: {
          en: "Pointing straight DOWN.",
          hi: "सीधे नीचे की ओर।",
          gu: "સીધું નીચે તરફ."
        },
        feedback: {
          en: "Correct! A 90° clockwise quarter-turn moves the top orientation (12:00) directly to the right (3:00).",
          hi: "सही! 90° दक्षिणावर्त घुमाव शीर्ष स्थिति (12:00) को सीधे दाईं ओर (3:00) ले जाता है।",
          gu: "સાચું! ૯૦° ઘડિયાળની દિશામાં પરિભ્રમણ ટોચની સ્થિતિ (૧૨:૦૦) ને સીધી જમણી બાજુ (૩:૦૦) લઈ જાય છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "rotate_3d",
        question: {
          en: "A 3D 'T-block' stands upright with its crossbar on top. It is rotated 180° in space. \nWhere is the crossbar located now?",
          hi: "एक 3D 'T-ब्लॉक' सीधा खड़ा है और उसकी आड़ी पट्टी ऊपर है। इसे अंतरिक्ष में 180° घुमाया जाता है। \nअब वह आड़ी पट्टी कहाँ स्थित होगी?",
          gu: "એક 3D 'T-બ્લોક' સીધો ઊભો છે અને તેની આડી પટ્ટી ઉપર છે. તેને ૧૮૦° ફેરવવામાં આવે છે. \nહવે તે આડી પટ્ટી ક્યાં હશે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "At the BOTTOM (Upside down inverted T)",
              hi: "नीचे की ओर (उल्टा T आकार)",
              gu: "નીચે તરફ (ઊંધો T આકાર)"
            }
          },
          {
            id: "B",
            text: {
              en: "On the left side vertically",
              hi: "बाईं ओर लंबवत",
              gu: "ડાબી બાજુ ઊભી"
            }
          },
          {
            id: "C",
            text: {
              en: "Still on the top unchanged",
              hi: "अभी भी ऊपर ही बिना बदलाव के",
              gu: "હજુ પણ ઉપર જ કોઈ ફેરફાર વગર"
            }
          },
          {
            id: "D",
            text: {
              en: "On the right side vertically",
              hi: "दाईं ओर लंबवत",
              gu: "જમણી બાજુ ઊભી"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Brilliant! A 180° half-turn inverts top to bottom completely, turning an upright 'T' into an upside-down '⊥'!",
          hi: "शानदार! 180° का आधा घुमाव ऊपर को पूरी तरह नीचे कर देता है, जिससे सीधा 'T' उल्टा '⊥' बन जाता है!",
          gu: "ઉત્તમ! ૧૮૦° નું અડધું પરિભ્રમણ ઉપરને પૂરેપૂરું નીચે કરી દે છે, જેથી સીધો 'T' ઊંધો '⊥' બની જાય છે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "rotate_3d",
        title: {
          en: "3D Spinner Superpower",
          hi: "3D स्पिनर सुपरपावर",
          gu: "3D સ્પિનર સુપરપાવર"
        },
        body: {
          en: "Track one landmark anchor cube around the clock face to rotate 3D figures with ease.",
          hi: "3D आकृतियों को आसानी से घुमाने के लिए घड़ी के अनुसार एक मुख्य घन को ट्रैक करें।",
          gu: "3D આકારોને સરળતાથી ફેરવવા માટે ઘડિયાળ મુજબ એક મુખ્ય ક્યુબને ટ્રેક કરો."
        },
        tags: [
          { en: "Landmark Cube", hi: "मुख्य घन", gu: "મુખ્ય ક્યુબ" },
          { en: "Clock Face (12-3-6-9)", hi: "घड़ी दिशा (12-3-6-9)", gu: "ઘડિયાળ દિશા (૧૨-૩-૬-૯)" },
          { en: "90 Degree Quarter", hi: "90° चौथाई घुमाव", gu: "૯૦° ચોથો ભાગ" },
          { en: "180 Degree Half", hi: "180° आधा घुमाव", gu: "૧૮૦° અડધો ભાગ" },
          { en: "Anchor Tracking", hi: "एंकर ट्रैकिंग", gu: "એન્કર ટ્રેકિંગ" },
          { en: "Spatial Master", hi: "स्थानिक मास्टर", gu: "સ્થાનિક માસ્ટર" }
        ]
      },
      {
        type: "action_checklist",
        icon: "rotate_3d",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Identify one unique protruding cube, colored face, or distinct notch on the 3D figure.",
              hi: "3D आकृति पर एक अनोखा उभरा हुआ घन, रंगीन फलक या कोना पहचानें।",
              gu: "3D આકૃતિ પર એક અનોખો ઉપસેલો ક્યુબ, રંગીન સપાટી કે ખૂણો ઓળખો."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Note the starting direction of that landmark (Top, Right, Bottom, or Left).",
              hi: "उस मुख्य हिस्से की शुरुआती दिशा (ऊपर, दाएँ, नीचे या बाएँ) नोट करें।",
              gu: "તે મુખ્ય ભાગની શરૂઆતની દિશા (ઉપર, જમણે, નીચે કે ડાબે) નોંધી લો."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Rotate ONLY that landmark cube by the specified angle (e.g. 90° clockwise $\\rightarrow$ Top moves to Right).",
              hi: "केवल उस मुख्य हिस्से को बताए गए कोण पर घुमाएं (जैसे 90° दक्षिणावर्त $\\rightarrow$ ऊपर से दाएँ)।",
              gu: "માત્ર તે મુખ્ય ભાગને આપેલા ખૂણે ફેરવો (જેમ કે ૯૦° ઘડિયાળ દિશા $\\rightarrow$ ઉપરથી જમણે)."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Eliminate answer choices where the landmark does not land in that exact predicted position.",
              hi: "उन विकल्पों को तुरंत हटा दें जहाँ मुख्य हिस्सा उस सटीक स्थान पर नहीं है।",
              gu: "તે વિકલ્પોને તરત રદ કરો જ્યાં મુખ્ય ભાગ તે ચોક્કસ સ્થાને નથી."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "rotate_3d",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Take a Rubik's cube or cereal box, place a sticker on one corner, rotate it 90° and 180°, and predict where the sticker lands before turning!",
          hi: "एक रूबिक क्यूब या डिब्बा लें, एक कोने पर स्टिकर लगाएं, उसे 90° और 180° घुमाकर स्टिकर की स्थिति पहले ही बताएं!",
          gu: "એક રૂબિક્સ ક્યુબ કે બોક્સ લો, એક ખૂણે સ્ટીકર લગાવો, તેને ૯૦° અને ૧૮૦° ફેરવીને સ્ટીકર ક્યાં આવશે તે પહેલેથી કહો!"
        },
        commitment_button_text: {
          en: "I will spin 3D objects with anchor tracking!",
          hi: "मैं 3D आकृतियों को आसानी से घुमाऊंगा!",
          gu: "હું 3D આકારોને સરળતાથી ફેરવી શકીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    id: "skill_c5_144",
    methodNumber: 144,
    classLevel: 5,
    category: {
      en: "Spatial Intelligence Strategies",
      hi: "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      gu: "સ્થાનિક બુદ્ધિ વ્યૂહરચનાઓ"
    },
    title: {
      en: "Perspective Taking (Observer Viewpoint Switch)",
      hi: "दृष्टिकोण लेना (दर्शक का नजरिया / व्यूप्वाइंट स्विच)",
      gu: "દ્રષ્ટિકોણ લેવો (જોનારનો નજરિયો / વ્યુપોઇન્ટ સ્વિચ)"
    },
    description: {
      en: "Mentally project your visual viewpoint into another person's position (Top View, Front View, or Opponent View) to perceive spatial scenes accurately.",
      hi: "स्थानिक दृश्यों को सही ढंग से समझने के लिए अपनी नजर को दूसरे व्यक्ति की स्थिति (शीर्ष, सामने या विपरीत दिशा) से देखें।",
      gu: "સ્થાનિક દ્રશ્યોને સાચી રીતે સમજવા માટે તમારી નજરને બીજી વ્યક્તિની સ્થિતિ (ઉપરથી, સામેથી કે વિરુદ્ધ દિશામાંથી) થી જુઓ."
    },
    xp: 20,
    duration: "5 min",
    cards: [
      {
        type: "problem_hook",
        icon: "viewpoint_eyes",
        title: {
          en: "Confused When Asked 'What Does Person B See Across the Table?'",
          hi: "जब पूछा जाए कि 'सामने बैठे व्यक्ति को क्या दिख रहा है?', तो उलझन होती है?",
          gu: "જ્યારે પૂછવામાં આવે કે 'સામે બેઠેલી વ્યક્તિને શું દેખાય છે?', ત્યારે ગૂંચવણ થાય છે?"
        },
        pain_quotes: [
          {
            en: "I always pick what I see from my own chair instead of imagining the view from across the room!",
            hi: "मैं सामने वाले का नजरिया सोचने के बजाय वही चुन लेता हूँ जो मुझे अपनी कुर्सी से दिख रहा है!",
            gu: "હું સામેવાળાનો નજરિયો વિચારવાને બદલે જે મારી ખુરશી પરથી દેખાય છે તે જ પસંદ કરી લઉં છું!"
          },
          {
            en: "Switching between Top View (Bird's Eye) and Front View on map tests mixes up left and right!",
            hi: "नक्शे के टेस्ट में ऊपर के दृश्य (Bird's Eye) और सामने के दृश्य में दायाँ और बायाँ गड़बड़ हो जाता है!",
            gu: "નકશાની પરીક્ષામાં ઉપરના દ્રશ્ય અને સામેના દ્રશ્યમાં ડાબું અને જમણું ઊંધું થઈ જાય છે!"
          }
        ],
        body: {
          en: "Our brains are naturally egocentric—we default to our own eyeballs. 'Perspective Taking' mentally teleports you into the other observer's shoes, flipping left-right coordinates relative to THEIR point of view!",
          hi: "हमारा दिमाग स्वाभाविक रूप से केवल अपनी आंखों से देखता है। 'दृष्टिकोण परिवर्तन' आपको मानसिक रूप से दूसरे व्यक्ति की कुर्सी पर बैठा देता है और उसके नजरिए से दायाँ-बायाँ उलट देता है!",
          gu: "આપણું મગજ સ્વાભાવિક રીતે માત્ર પોતાની આંખોથી જ જુએ છે. 'દ્રષ્ટિકોણ પરિવર્તન' તમને માનસિક રીતે સામેવાળી વ્યક્તિની ખુરશી પર બેસાડી દે છે અને તેના નજરિયાથી ડાબું-જમણું વિચારે છે!"
        },
        key_takeaway: {
          en: "Viewpoint Rule: Teleport into Observer's Shoes $\\rightarrow$ Align your Left/Right to THEIR chest $\\rightarrow$ Identify the view!",
          hi: "नजरिया नियम: दर्शक के स्थान पर जाएं $\\rightarrow$ अपने दाएँ/बाएँ को उनके अनुसार संरेखित करें $\\rightarrow$ दृश्य पहचानें!",
          gu: "નજરિયા નિયમ: જોનારની જગ્યાએ જાઓ $\\rightarrow$ તમારા ડાબા/જમણાને તેમના શરીર મુજબ ગોઠવો $\\rightarrow$ દ્રશ્ય ઓળખો!"
        }
      },
      {
        type: "relatable_story",
        icon: "viewpoint_eyes",
        title: {
          en: "Meet Krisha",
          hi: "कृषा से मिलें",
          gu: "મળો કૃષાને"
        },
        story: {
          en: "Krisha sat opposite her friend Meera with a red cup on the left and a blue cup on the right from Krisha's view. A test question asked: 'From Meera's view, which cup is on her RIGHT?' Krisha mentally sat in Meera's chair, looked across the table, and realized that Krisha's left cup (Red) was on Meera's RIGHT! She nailed the question.",
          hi: "कृषा अपनी सहेली मीरा के सामने बैठी थी। कृषा के नजरिए से लाल कप बाईं ओर और नीला कप दाईं ओर था। प्रश्न पूछा: 'मीरा के दाईं ओर कौन सा कप है?' कृषा ने मीरा की कुर्सी पर बैठकर सोचा और समझ गई कि उसका बायाँ (लाल कप) मीरा का दायाँ है! उसने सही उत्तर दिया।",
          gu: "કૃષા તેની બહેનપણી મીરા સામે બેઠી હતી. કૃષાના નજરિયાથી લાલ કપ ડાબી બાજુ અને વાદળી કપ જમણી બાજુ હતો. પ્રશ્ન પૂછાયો: 'મીરાની જમણી બાજુ કયો કપ છે?' કૃષાએ મીરાની ખુરશી પર બેસીને વિચાર્યું અને સમજી ગઈ કે તેનો ડાબો (લાલ કપ) મીરાનો જમણો છે! તેણે સાચો જવાબ આપ્યો."
        },
        insight_box: {
          en: "Opposite Seat Rule: Facing someone across a table swaps their Left and Right 180° relative to yours.",
          hi: "आमने-सामने का नियम: मेज के उस पार बैठा व्यक्ति आपके दाएँ-बाएँ को 180° उलट देता है।",
          gu: "સામસામેનો નિયમ: ટેબલની સામે બેઠેલી વ્યક્તિ તમારા ડાબા-જમણાને ૧૮૦° ઉલટાવી દે છે."
        }
      },
      {
        type: "method_concept_check",
        icon: "viewpoint_eyes",
        question: {
          en: "A tall cylinder stands in front of a short cube. When looking from the TOP (Bird's Eye View), what does the observer see?",
          hi: "एक छोटे घन के आगे एक लंबा बेलन (सिलेंडर) खड़ा है। ऊपर से देखने पर (Bird's Eye View) दर्शक को क्या दिखाई देगा?",
          gu: "એક નાના ક્યુબની આગળ એક ઊંચો નળાકાર (સિલિન્ડર) ઊભો છે. ઉપરથી જોતાં (Bird's Eye View) જોનારને શું દેખાશે?"
        },
        option_a: {
          en: "A Circle and a Square resting side-by-side / overlapping on a 2D flat plane.",
          hi: "एक वृत्त (सर्कल) और एक वर्ग (स्क्वायर) 2D समतल पर एक-दूसरे के पास।",
          gu: "એક વર્તુળ અને એક ચોરસ 2D સપાટી પર એકબીજાની પાસે."
        },
        option_b: {
          en: "3D height lines and shadows extending into the distance.",
          hi: "लंबी 3D ऊंचाई की रेखाएं और छाया।",
          gu: "લાંબી 3D ઊંચાઈની રેખાઓ અને પડછાયા."
        },
        feedback: {
          en: "Correct! From the Top View, 3D heights collapse into 2D geometric footprints (Cylinder $\\rightarrow$ Circle, Cube $\\rightarrow$ Square).",
          hi: "सही! ऊपर से देखने पर 3D ऊंचाई 2D आकृतियों (सिलेंडर $\\rightarrow$ वृत्त, घन $\\rightarrow$ वर्ग) में बदल जाती है।",
          gu: "સાચું! ઉપરથી જોતાં 3D ઊંચાઈ 2D આકારો (નળાકાર $\\rightarrow$ વર્તુળ, ક્યુબ $\\rightarrow$ ચોરસ) માં ફેરવાઈ જાય છે."
        }
      },
      {
        type: "skill_practice_quiz",
        icon: "viewpoint_eyes",
        question: {
          en: "You are standing at the South side of a table. A Toy Car is placed facing East (pointing to your right). \nObserver B stands on the North side facing South. \nFrom Observer B's perspective, which direction is the toy car pointing?",
          hi: "आप मेज के दक्षिण में खड़े हैं। एक खिलौना कार पूर्व की ओर (आपके दाईं ओर) मुंह करके रखी है। \nदर्शक B उत्तर की ओर दक्षिण की तरफ मुंह करके खड़ा है। \nदर्शक B के नजरिए से कार किस दिशा (उसके दाएँ या बाएँ) में इशारा कर रही है?",
          gu: "તમે ટેબલની દક્ષિણે ઊભા છો. એક રમકડાની કાર પૂર્વ તરફ (તમારી જમણી બાજુ) છે. \nજોનાર B ઉત્તરમાં દક્ષિણ તરફ મુખ રાખીને ઊભો છે. \nજોનાર B ના નજરિયાથી કાર કઈ તરફ (તેની જમણી કે ડાબી બાજુ) છે?"
        },
        options: [
          {
            id: "A",
            text: {
              en: "To Observer B's LEFT",
              hi: "दर्शक B के बाईं ओर (Left)",
              gu: "જોનાર B ની ડાબી બાજુ (Left)"
            }
          },
          {
            id: "B",
            text: {
              en: "To Observer B's RIGHT",
              hi: "दर्शक B के दाईं ओर (Right)",
              gu: "જોનાર B ની જમણી બાજુ (Right)"
            }
          },
          {
            id: "C",
            text: {
              en: "Directly into Observer B's eyes",
              hi: "सीधे दर्शक B की आंखों में",
              gu: "સીધી જોનાર B ની આંખોમાં"
            }
          },
          {
            id: "D",
            text: {
              en: "Pointing backwards away from table",
              hi: "मेज से पीछे की ओर",
              gu: "ટેબલથી પાછળ તરફ"
            }
          }
        ],
        correct_option: "A",
        feedback: {
          en: "Masterful! East is YOUR right, but for someone facing South (opposite you), East is to THEIR LEFT!",
          hi: "शानदार! पूर्व आपका दायाँ है, लेकिन आपके सामने खड़े व्यक्ति (दक्षिण मुखी) के लिए पूर्व उसका बायाँ होगा!",
          gu: "ઉત્તમ! પૂર્વ તમારો જમણો હાથ છે, પણ તમારી સામે ઊભેલી વ્યક્તિ માટે પૂર્વ તેનો ડાબો હાથ થશે!"
        }
      },
      {
        type: "strategy_pills",
        icon: "viewpoint_eyes",
        title: {
          en: "Viewpoint Teleport Superpower",
          hi: "व्यूप्वाइंट टेलीपोर्ट सुपरपावर",
          gu: "વ્યુપોઇન્ટ ટેલીપોર્ટ સુપરપાવર"
        },
        body: {
          en: "Step into the observer's shoes and align your left-right compass to their perspective.",
          hi: "सटीक दिशा जानने के लिए दर्शक की स्थिति में जाएं और उनके दाएँ-बाएँ से देखें।",
          gu: "સાચી દિશા જાણવા માટે જોનારની જગ્યાએ જાઓ અને તેના ડાબા-જમણાથી જુઓ."
        },
        tags: [
          { en: "Observer's Shoes", hi: "दर्शक का स्थान", gu: "જોનારની જગ્યા" },
          { en: "Top View Footprint", hi: "शीर्ष दृश्य", gu: "ઉપરથી દ્રશ્ય" },
          { en: "Front vs Side", hi: "सामने बनाम बगल", gu: "સામે વિરુદ્ધ બાજુ" },
          { en: "Swap Left & Right", hi: "दायाँ-बायाँ उल्टा", gu: "ડાબું-જમણું ઉલટું" },
          { en: "Mental Teleport", hi: "मानसिक टेलीपोर्ट", gu: "માનસિક ટેલીપોર્ટ" },
          { en: "Spatial Perspective", hi: "स्थानिक नजरिया", gu: "સ્થાનિક નજરિયો" }
        ]
      },
      {
        type: "action_checklist",
        icon: "viewpoint_eyes",
        title: {
          en: "How to use this superpower",
          hi: "इस सुपरपावर का उपयोग कैसे करें",
          gu: "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        steps: [
          {
            step: 1,
            text: {
              en: "Locate where the target observer is positioned (North, South, East, West, or Top).",
              hi: "पहचानें कि दर्शक कहाँ खड़ा है (उत्तर, दक्षिण, पूर्व, पश्चिम या ऊपर)।",
              gu: "ઓળખો કે જોનાર ક્યાં ઊભો છે (ઉત્તર, દક્ષિણ, પૂર્વ, પશ્ચિમ કે ઉપર)."
            },
            correct_order: 1
          },
          {
            step: 2,
            text: {
              en: "Mentally rotate your body orientation so your chest faces the exact direction they are looking.",
              hi: "मानसिक रूप से खुद को घुमाएं ताकि आपका सीना उसी दिशा में हो जिधर वे देख रहे हैं।",
              gu: "માનસિક રીતે તમારી જાતને ફેરવો જેથી તમારો ચહેરો તે જ દિશામાં હોય જ્યાં તેઓ જોઈ રહ્યા છે."
            },
            correct_order: 2
          },
          {
            step: 3,
            text: {
              en: "Re-map Left and Right relative to that new observer position.",
              hi: "उस नई दर्शक स्थिति के सापेक्ष दाएँ और बाएँ को फिर से तय करें।",
              gu: "તે નવી જોનારની સ્થિતિ મુજબ ડાબા અને જમણાને ફરીથી નક્કી કરો."
            },
            correct_order: 3
          },
          {
            step: 4,
            text: {
              en: "Select the scene or object arrangement matching that aligned viewpoint.",
              hi: "उस संरेखित दृष्टिकोण से मेल खाने वाले दृश्य या व्यवस्था का चयन करें।",
              gu: "તે ગોઠવાયેલા દ્રષ્ટિકોણ સાથે મેળ ખાતા દ્રશ્ય કે ગોઠવણીની પસંદગી કરો."
            },
            correct_order: 4
          }
        ],
        interaction_note: "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        type: "daily_mission",
        icon: "viewpoint_eyes",
        title: {
          en: "Your Daily Mission",
          hi: "आपका दैनिक मिशन",
          gu: "તમારું દૈનિક મિશન"
        },
        mission_text: {
          en: "Place 3 different objects on the dining table, sit opposite a family member, and describe what is on their left and right without standing up!",
          hi: "मेज पर 3 अलग-अलग वस्तुएं रखें, किसी के सामने बैठें और बिना उठे बताएं कि उनके दाएँ और बाएँ क्या है!",
          gu: "ટેબલ પર ૩ અલગ-અલગ વસ્તુઓ મૂકો, કોઈની સામે બેસો અને ઊભા થયા વગર કહો કે તેમના ડાબા અને જમણા હાથે શું છે!"
        },
        commitment_button_text: {
          en: "I will master perspective taking!",
          hi: "मैं हर नजरिए से देखना सीखूंगा!",
          gu: "હું દરેક નજરિયાથી જોતાં શીખીશ!"
        },
        first_time_xp: 20,
        replay_xp: 0,
        xp_reward: 20
      }
    ]
  },
  {
    "id": "skill_c5_145",
    "methodNumber": 145,
    "classLevel": 5,
    "category": {
      "en": "Spatial Intelligence Strategies",
      "hi": "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      "gu": "અવકાશી બુદ્ધિમત્તા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Spatial Chunking (Zone Grid Method)",
      "hi": "स्थानिक चंकिंग (ज़ोन ग्रिड विधि)",
      "gu": "સ્થાનિક ચંકિંગ (ઝોન ગ્રીડ પદ્ધતિ)"
    },
    "description": {
      "en": "Break complex 2D grids, busy maps, and tangram puzzles into bite-sized 2x2 quadrants or zones to find target items effortlessly without visual overload.",
      "hi": "जटिल ग्रिड, घने नक्शों और पहेलियों को छोटे 2x2 ज़ोन में बांटकर बिना भटके लक्ष्य को आसानी से खोजें।",
      "gu": "જટિલ ગ્રીડ, ગીચ નકશાઓ અને કોયડાઓને નાના ૨x૨ ઝોનમાં વિભાજિત કરીને આંખો થાક્યા વગર લક્ષ્ય સરળતાથી શોધો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "spatial_grid",
        "title": {
          "en": "Drowning in Busy Maps & Crowded Grids?",
          "hi": "घने नक्शों और भीड़भाड़ वाले ग्रिड में आँखें चकरा जाती हैं?",
          "gu": "ગીચ નકશાઓ અને ભરેલી ગ્રીડમાં આંખો અટવાઈ જાય છે?"
        },
        "pain_quotes": [
          {
            "en": "When looking at a 6x6 puzzle grid, my eyes wander randomly and I miss hidden shapes!",
            "hi": "जब 6x6 का बड़ा ग्रिड देखता हूँ, तो आँखें भटकती हैं और छिपी हुई आकृतियाँ छूट जाती हैं!",
            "gu": "જ્યારે ૬x૬ ની મોટી ગ્રીડ જોઉં છું, ત્યારે આંખો ભટકે છે અને છુપાયેલા આકારો ચૂકી જવાય છે!"
          },
          {
            "en": "Finding landmarks on a dense city map feels dizzying and takes forever!",
            "hi": "घने शहर के नक्शे पर कोई जगह ढूंढना बहुत सिरदर्द वाला और धीमा काम लगता है!",
            "gu": "ગીચ નકશા પર કોઈ સ્થળ શોધવું ખૂબ માથાનો દુખાવો અને ધીમું કામ લાગે છે!"
          }
        ],
        "body": {
          "en": "Scanning a complex scene all at once overwhelms working memory. 'Spatial Chunking' splits big visual spaces into 4 bite-sized quadrants (Top-Left, Top-Right, Bottom-Left, Bottom-Right) so you inspect one mini-zone with laser focus at a time!",
          "hi": "एक साथ पूरे दृश्य को स्कैन करने से दिमाग पर भारी दबाव पड़ता है। 'स्थानिक चंकिंग' बड़े दृश्य को 4 छोटे हिस्सों (ऊपर-बाएँ, ऊपर-दाएँ, नीचे-बाएँ, नीचे-दाएँ) में बांटता है ताकि आप एक बार में एक ज़ोन पर पूरा ध्यान दे सकें!",
          "gu": "એક સાથે આખા દ્રશ્યને સ્કેન કરવાથી મગજ પર ભાર વધે છે. 'સ્થાનિક ચંકિંગ' મોટા વિસ્તારને ૪ નાના ભાગોમાં (ઉપર-ડાબે, ઉપર-જમણે, નીચે-ડાબે, નીચે-જમણે) વહેંચે છે જેથી તમે એક સમયે એક ઝોન પર ધ્યાન કેન્દ્રિત કરી શકો!"
        },
        "key_takeaway": {
          "en": "Quadrant Rule: Split the giant grid into 4 mini-zones $\\rightarrow$ Scan zone by zone $\\rightarrow$ Zero visual fatigue!",
          "hi": "चतुर्थांश नियम: बड़े ग्रिड को 4 छोटे ज़ोन में बाँटें $\\rightarrow$ एक-एक ज़ोन स्कैन करें $\\rightarrow$ बिना किसी थकान के खोजें!",
          "gu": "ચતુર્થાંશ નિયમ: મોટી ગ્રીડને ૪ નાના ઝોનમાં વહેંચો $\\rightarrow$ વારાફરતી ઝોન સ્કેન કરો $\\rightarrow$ થાક વગર સરળ શોધ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "spatial_grid",
        "title": {
          "en": "Meet Ananya",
          "hi": "अनन्या से मिलें",
          "gu": "મળો અનન્યાને"
        },
        "story": {
          "en": "Ananya took 90 seconds to count stars in a crowded 64-block picture puzzle and kept miscounting duplicates. Her teacher taught her to draw mental crosshairs dividing the image into 4 quadrants (16 blocks each). She counted each zone cleanly and found the exact total in 18 seconds!",
          "hi": "अनन्या को 64-ब्लॉक की पहेली में तारे गिनने में 90 सेकंड लगते थे और वह बार-बार गिनती भूल जाती थी। शिक्षक ने उसे मानसिक रूप से 4 ज़ोन (16-16 ब्लॉक) में बाँटना सिखाया। उसने हर ज़ोन को अलग गिना और 18 सेकंड में सही जवाब दे दिया!",
          "gu": "અનન્યાને ૬૪-ખાનાવાળી પઝલમાં તારાઓ ગણવામાં ૯૦ સેકન્ડ લાગતી અને વારંવાર ભૂલ થતી. શિક્ષકે તેને માનસિક રીતે ૪ ઝોન (૧૬-૧૬ ખાના) બનાવવાનું શીખવ્યું. તેણે દરેક ઝોન શાંતિથી ગણ્યો અને ૧૮ સેકન્ડમાં સાચો જવાબ આપ્યો!"
        },
        "insight_box": {
          "en": "Chunking Power: 4 small 16-block scans are 5x faster and 100% more accurate than 1 giant 64-block scan.",
          "hi": "चंकिंग शक्ति: 4 छोटे ज़ोन की स्कैनिंग 1 बड़े 64-ब्लॉक के स्कैन से 5 गुना तेज़ और 100% सटीक होती है।",
          "gu": "ચંકિંગ પાવર: ૪ નાના ઝોનનું સ્કેનિંગ ૧ મોટા ૬૪-ખાનાના સ્કેન કરતાં ૫ ગણું ઝડપી અને ૧૦૦% સચોટ છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "spatial_grid",
        "question": {
          "en": "How should you inspect a large, crowded diagram or map containing 36 symbols?",
          "hi": "36 प्रतीकों वाले एक बड़े, घने आरेख या नक्शे का निरीक्षण कैसे करना चाहिए?",
          "gu": "૩૬ પ્રતીકોવાળા મોટા, ગીચ ચિત્ર કે નકશાનું નિરીક્ષણ કેવી રીતે કરવું જોઈએ?"
        },
        "option_a": {
          "en": "Let your eyes wander freely back and forth across the entire page.",
          "hi": "अपनी आँखों को पूरे पृष्ठ पर इधर-उधर स्वतंत्र रूप से घुमाएँ।",
          "gu": "તમારી આંખોને આખા પેજ પર ગમે ત્યાં આમતેમ દોડાવો."
        },
        "option_b": {
          "en": "Mentally split the map into 4 quadrants (Zones 1 to 4) and systematically inspect one quadrant at a time.",
          "hi": "मानसिक रूप से नक्शे को 4 ज़ोन (ज़ोन 1 से 4) में बाँटें और व्यवस्थित रूप से एक बार में एक ज़ोन की जाँच करें।",
          "gu": "માનસિક રીતે નકશાને ૪ ઝોન (ઝોન ૧ થી ૪) માં વહેંચો અને વ્યવસ્થિત રીતે એક સમયે એક ઝોન તપાસો."
        },
        "feedback": {
          "en": "Correct! Spatial chunking eliminates duplicate counting and prevents working memory overload.",
          "hi": "सही! स्थानिक चंकिंग दोबारा गिनती होने से बचाती है और मस्तिष्क पर दबाव घटाती है।",
          "gu": "સાચું! સ્થાનિક ચંકિંગ બેવડી ગણતરી અટકાવે છે અને મગજનો ભાર ઘટાડે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "spatial_grid",
        "question": {
          "en": "A 4x4 grid contains triangles: Top-Left (2), Top-Right (1), Bottom-Left (3), Bottom-Right (2). How does spatial chunking help find the total triangles effortlessly?",
          "hi": "एक 4x4 ग्रिड में त्रिभुज हैं: ऊपर-बाएँ (2), ऊपर-दाएँ (1), नीचे-बाएँ (3), नीचे-दाएँ (2)। स्थानिक चंकिंग से कुल त्रिभुज आसानी से कैसे मिलेंगे?",
          "gu": "૪x૪ ગ્રીડમાં ત્રિકોણ છે: ઉપર-ડાબે (૨), ઉપર-જમણે (૧), નીચે-ડાબે (૩), નીચે-જમણે (૨). સ્થાનિક ચંકિંગથી કુલ ત્રિકોણ સરળતાથી કેવી રીતે મળે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Sum the 4 quadrant sub-totals: 2 + 1 + 3 + 2 = 8 triangles",
              "hi": "चारों ज़ोन के उप-योग जोड़ें: 2 + 1 + 3 + 2 = 8 त्रिभुज",
              "gu": "૪ ઝોનનો પેટા-સરવાળો કરો: ૨ + ૧ + ૩ + ૨ = ૮ ત્રિકોણ"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Count all 16 boxes diagonally in a spiral = 6 triangles",
              "hi": "सभी 16 बॉक्स को तिरछे चक्रव्यूह में गिनें = 6 त्रिभुज",
              "gu": "બધા ૧૬ ખાનાને ત્રાંસા ચક્રમાં ગણો = ૬ ત્રિકોણ"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Only count the top half = 3 triangles",
              "hi": "केवल ऊपरी आधे हिस्से को गिनें = 3 त्रिभुज",
              "gu": "માત્ર ઉપરનો અડધો ભાગ ગણો = ૩ ત્રિકોણ"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Guess without looking = 10 triangles",
              "hi": "बिना देखे अनुमान लगाएं = 10 त्रिभुज",
              "gu": "જોયા વગર અંદાજ લગાવો = ૧૦ ત્રિકોણ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Chunking turns a messy visual task into a crystal-clear 4-number addition: 2 + 1 + 3 + 2 = 8 triangles!",
          "hi": "शानदार! चंकिंग ने उलझी हुई तस्वीर को 4 संख्याओं के आसान जोड़ में बदल दिया: 2 + 1 + 3 + 2 = 8 त्रिभुज!",
          "gu": "એકદમ સાચું! ચંકિંગે અટપટા ચિત્રને ૪ સંખ્યાઓના સરળ સરવાળામાં ફેરવી દીધું: ૨ + ૧ + ૩ + ૨ = ૮ ત્રિકોણ!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "spatial_grid",
        "title": {
          "en": "Spatial Chunking Superpower",
          "hi": "स्थानिक चंकिंग सुपरपावर",
          "gu": "સ્થાનિક ચંકિંગ સુપરપાવર"
        },
        "body": {
          "en": "Split crowded visual fields into 4 distinct quadrants to spot objects instantly.",
          "hi": "भीड़भाड़ वाले दृश्यों को 4 स्पष्ट ज़ोन में बाँटकर चीज़ों को तुरंत पहचानें।",
          "gu": "ગીચ દ્રશ્યોને ૪ સ્પષ્ટ ઝોનમાં વહેંચીને વસ્તુઓને ક્ષણવારમાં શોધો."
        },
        "tags": [
          {
            "en": "4 Quadrants",
            "hi": "4 चतुर्थांश",
            "gu": "૪ ચતુર્થાંશ"
          },
          {
            "en": "Zone Scanning",
            "hi": "ज़ोन स्कैनिंग",
            "gu": "ઝોન સ્કેનિંગ"
          },
          {
            "en": "Zero Clutter",
            "hi": "शून्य भ्रम",
            "gu": "શૂન્ય ગૂંચવણ"
          },
          {
            "en": "Sub-Totals",
            "hi": "उप-योग",
            "gu": "પેટા-સરવાળો"
          },
          {
            "en": "Map Navigation",
            "hi": "नक्शा पढ़ना",
            "gu": "નકશો વાંચન"
          },
          {
            "en": "Laser Focus",
            "hi": "सटीक ध्यान",
            "gu": "સચોટ ધ્યાન"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "spatial_grid",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Mentally superimpose a '+' crosshair over the image or map to create 4 zones.",
              "hi": "चित्र या नक्शे पर 4 ज़ोन बनाने के लिए मानसिक रूप से '+' का क्रॉस बनाएँ।",
              "gu": "ચિત્ર કે નકશા પર ૪ ઝોન બનાવવા માનસિક રીતે '+' નું નિશાન કલ્પો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Scan Zone 1 (Top-Left) completely and record or note its count/item.",
              "hi": "ज़ोन 1 (ऊपर-बाएँ) को पूरी तरह स्कैन करें और उसकी संख्या/वस्तु नोट करें।",
              "gu": "ઝોન ૧ (ઉપર-ડાબે) ને સંપૂર્ણ સ્કેન કરો અને તેની વિગત નોંધી લો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Move clockwise through Zone 2 (Top-Right), Zone 3 (Bottom-Right), and Zone 4 (Bottom-Left).",
              "hi": "घड़ी की दिशा में ज़ोन 2, ज़ोन 3 और ज़ोन 4 को क्रमिक रूप से स्कैन करें।",
              "gu": "ઘડિયાળના કાંટાની દિશામાં ઝોન ૨, ઝોન ૩ અને ઝોન ૪ ને ક્રમશઃ સ્કેન કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Combine your 4 quadrant results together for the final verified total.",
              "hi": "अंतिम सत्यापित कुल परिणाम के लिए चारों ज़ोन के परिणामों को एक साथ जोड़ें।",
              "gu": "અંતિમ ખાતરીપૂર્વકના જવાબ માટે ચારેય ઝોનના પરિણામોનો સરવાળો કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "spatial_grid",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Open any crowded geography map or search-and-find puzzle today, divide it into 4 quadrants, and find 5 items zone by zone!",
          "hi": "आज भूगोल का कोई नक्शा या पहेली खोलें, उसे 4 ज़ोन में बाँटें और एक-एक ज़ोन करके 5 वस्तुएं खोजें!",
          "gu": "આજે ભૂગોળનો કોઈ નકશો કે પઝલ ખોલો, તેને ૪ ઝોનમાં વહેંચો અને એક-એક ઝોન કરીને ૫ વસ્તુઓ શોધો!"
        },
        "commitment_button_text": {
          "en": "I will chunk big spaces into zones!",
          "hi": "मैं बड़े स्थानों को ज़ोन में बाँटकर देखूँगा!",
          "gu": "હું મોટા વિસ્તારોને ઝોનમાં વહેંચીને જોઈશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_148",
    "methodNumber": 148,
    "classLevel": 5,
    "category": {
      "en": "Spatial Intelligence Strategies",
      "hi": "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      "gu": "અવકાશી બુદ્ધિમત્તા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Coordinate Thinking (Hallway First, Elevator Second)",
      "hi": "निर्देशांक सोच (पहले गलियारा, फिर लिफ्ट)",
      "gu": "યામ પદ્ધતિ વિચાર (પહેલાં ગેલેરી, પછી લિફ્ટ)"
    },
    "description": {
      "en": "Master grid navigation and (X, Y) coordinate plotting using the universal rule: walk horizontal across the hallway (X) first, then take the elevator vertical (Y).",
      "hi": "सार्वभौमिक नियम का उपयोग करके ग्रिड नेविगेशन में महारत हासिल करें: पहले क्षैतिज गलियारा (X) चलें, फिर ऊर्ध्वाधर लिफ्ट (Y) लें।",
      "gu": "સાર્વત્રિક નિયમથી ગ્રીડ નેવિગેશન શીખો: પહેલાં આડી ગેલેરીમાં (X) ચાલો, પછી ઊભી લિફ્ટમાં (Y) ઉપર જાઓ."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "coordinate_map",
        "title": {
          "en": "Confusing (X, Y) Coordinates and Plotting Points?",
          "hi": "(X, Y) निर्देशांकों में पहले कौन सा आता है, भूल जाते हैं?",
          "gu": "(X, Y) યામમાં પહેલાં કયું આવે તે ભૂલી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I always mix up (3, 5) and (5, 3) and place my dots in the wrong grid box!",
            "hi": "मैं हमेशा (3, 5) और (5, 3) में भ्रमित हो जाता हूँ और बिंदु गलत जगह लगा देता हूँ!",
            "gu": "હું હંમેશાં (૩, ૫) અને (૫, ૩) માં ગૂંચવાઈ જાઉં છું અને બિંદુ ખોટી જગ્યાએ મૂકું છું!"
          },
          {
            "en": "When reading maps with letters and numbers, I don't know whether to look across or up first!",
            "hi": "अक्षरों और संख्याओं वाले नक्शों को पढ़ते समय समझ नहीं आता कि पहले दाएं देखें या ऊपर!",
            "gu": "અક્ષરો અને નંબરોવાળા નકશા વાંચતી વખતે સમજાતું નથી કે પહેલાં આડા જવું કે ઊભા!"
          }
        ],
        "body": {
          "en": "Mixing up horizontal (X) and vertical (Y) coordinates leads to landing on the completely wrong island. Remember the golden memory hook: You must walk along the ground hallway (X) before you can get inside the elevator and travel up (Y)!",
          "hi": "क्षैतिज (X) और ऊर्ध्वाधर (Y) निर्देशांकों को मिलाने से आप गलत स्थान पर पहुँच जाते हैं। याद रखें: लिफ्ट (Y) में चढ़कर ऊपर जाने से पहले आपको जमीन के गलियारे (X) में चलना होगा!",
          "gu": "આડા (X) અને ઊભા (Y) યામની ગડબડથી તમે ખોટી જગ્યાએ પહોંચી જાઓ છો. યાદ રાખો: લિફ્ટમાં (Y) ચડીને ઉપર જતાં પહેલાં તમારે જમીનની ગેલેરીમાં (X) આગળ ચાલવું પડે!"
        },
        "key_takeaway": {
          "en": "Golden Grid Rule: (X, Y) = Walk along Hallway (Across) $\\rightarrow$ Fly in Elevator (Up)!",
          "hi": "गोल्डन ग्रिड नियम: (X, Y) = गलियारे में चलें (दाएं) $\\rightarrow$ लिफ्ट में उड़ें (ऊपर)!",
          "gu": "ગોલ્ડન ગ્રીડ નિયમ: (X, Y) = ગેલેરીમાં ચાલો (આડા) $\\rightarrow$ લિફ્ટમાં જાઓ (ઊભા)!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "coordinate_map",
        "title": {
          "en": "Meet Kabir",
          "hi": "कबीर से मिलें",
          "gu": "મળો કબીરને"
        },
        "story": {
          "en": "Kabir was playing a treasure island coordinate game. The clue was '(4, 2)'. Kabir went up 4 and across 2, landing on a volcanic swamp! His sister reminded him: 'Hallway first (go right 4), Elevator second (go up 2)!' Kabir corrected his path and uncovered the golden chest.",
          "hi": "कबीर खजाने का गेम खेल रहा था। सुराग था '(4, 2)'। कबीर ऊपर 4 गया और दाएं 2, और दलदल में गिर गया! उसकी बहन ने याद दिलाया: 'पहले गलियारा (दाएं 4), फिर लिफ्ट (ऊपर 2)!' कबीर ने सही रास्ता लिया और खजाना पा लिया।",
          "gu": "કબીર ખજાનાની રમત રમતો હતો. કડી હતી '(૪, ૨)'. કબીર ઉપર ૪ ગયો અને જમણે ૨, અને કાદવમાં ફસાયો! તેની બહેને યાદ અપાવ્યું: 'પહેલાં ગેલેરી (જમણે ૪), પછી લિફ્ટ (ઉપર ૨)!' કબીરે રસ્તો સુધાર્યો અને ખજાનો શોધી લીધો."
        },
        "insight_box": {
          "en": "Alphabet Rule: In the alphabet, X comes before Y. On the grid, X (horizontal) always comes before Y (vertical).",
          "hi": "वर्णमाला नियम: ABCD में X पहले और Y बाद में आता है। ग्रिड पर भी X (क्षैतिज) हमेशा Y (ऊर्ध्वाधर) से पहले आता है।",
          "gu": "મૂળાક્ષર નિયમ: અંગ્રેજીમાં X પહેલાં અને Y પછી આવે. ગ્રીડ પર પણ X (આડી ધરી) હંમેશાં Y (ઊભી ધરી) પહેલાં આવે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "coordinate_map",
        "question": {
          "en": "To plot the coordinate point (6, 3) starting from origin (0, 0), what are your exact physical moves?",
          "hi": "मूल बिंदु (0, 0) से निर्देशांक बिंदु (6, 3) को अंकित करने के लिए आपके सही कदम क्या होंगे?",
          "gu": "ઉગમબિંદુ (૦, ૦) થી યામ બિંદુ (૬, ૩) દર્શાવવા માટે તમારા સાચાં પગલાં કયા હશે?"
        },
        "option_a": {
          "en": "Go up 6 units, then move right 3 units.",
          "hi": "पहले 6 इकाई ऊपर जाएं, फिर 3 इकाई दाएं जाएं।",
          "gu": "પહેલાં ૬ એકમ ઉપર જાઓ, પછી ૩ એકમ જમણે જાઓ."
        },
        "option_b": {
          "en": "Walk across horizontally 6 units right (X), then travel up vertically 3 units (Y).",
          "hi": "पहले क्षैतिज रूप से 6 इकाई दाएं (X) चलें, फिर ऊर्ध्वाधर रूप से 3 इकाई ऊपर (Y) जाएं।",
          "gu": "પહેલાં આડી દિશામાં ૬ એકમ જમણે (X) ચાલો, પછી ઊભી દિશામાં ૩ એકમ ઉપર (Y) જાઓ."
        },
        "feedback": {
          "en": "Correct! Always execute X (horizontal hallway) before Y (vertical elevator).",
          "hi": "सही! हमेशा Y (ऊर्ध्वाधर लिफ्ट) से पहले X (क्षैतिज गलियारा) चलें।",
          "gu": "સાચું! હંમેશાં Y (ઊભી લિફ્ટ) પહેલાં X (આડી ગેલેરી) પર ચાલવું."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "coordinate_map",
        "question": {
          "en": "On a school map grid, the Library is at (2, 5) and the Science Lab is at (5, 2). How do you explain the difference between these two locations?",
          "hi": "स्कूल के ग्रिड नक्शे पर, पुस्तकालय (2, 5) पर है और विज्ञान प्रयोगशाला (5, 2) पर है। दोनों स्थानों के अंतर को आप कैसे समझाएंगे?",
          "gu": "શાળાના નકશા પર પુસ્તકાલય (૨, ૫) પર છે અને વિજ્ઞાન પ્રયોગશાળા (૫, ૨) પર છે. બંને વચ્ચેનો તફાવત કેવી રીતે સમજાવશો?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Library is 2 steps across & 5 floors up; Lab is 5 steps across & 2 floors up",
              "hi": "पुस्तकालय 2 कदम दाएं और 5 मंजिल ऊपर है; लैब 5 कदम दाएं और 2 मंजिल ऊपर है",
              "gu": "પુસ્તકાલય ૨ ડગલાં આડું અને ૫ માળ ઊંચે છે; લેબ ૫ ડગલાં આડી અને ૨ માળ ઊંચે છે"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "They are in the exact same room",
              "hi": "वे दोनों बिल्कुल एक ही कमरे में हैं",
              "gu": "તે બંને એક જ રૂમમાં છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Library is at the top right corner only",
              "hi": "पुस्तकालय केवल सबसे ऊपरी दाएं कोने में है",
              "gu": "પુસ્તકાલય માત્ર જમણા ખૂણામાં છે"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Lab has no coordinates",
              "hi": "लैब का कोई निर्देशांक नहीं है",
              "gu": "લેબના કોઈ યામ નથી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! In (2, 5), X=2 and Y=5. In (5, 2), X=5 and Y=2. Order changes everything!",
          "hi": "शानदार! (2, 5) में X=2 और Y=5 है। (5, 2) में X=5 और Y=2 है। क्रम बदलने से स्थान पूरी तरह बदल जाता है!",
          "gu": "એકદમ સાચું! (૨, ૫) માં X=૨ અને Y=૫ છે. (૫, ૨) માં X=૫ અને Y=૨ છે. ક્રમ બદલાતાં આખું સ્થાન બદલાઈ જાય છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "coordinate_map",
        "title": {
          "en": "Coordinate Navigator Superpower",
          "hi": "निर्देशांक नेविगेटर सुपरपावर",
          "gu": "યામ નેવિગેટર સુપરપાવર"
        },
        "body": {
          "en": "Always move along the horizontal X-axis first, then ascend the vertical Y-axis.",
          "hi": "हमेशा पहले क्षैतिज X-अक्ष पर चलें, फिर ऊर्ध्वाधर Y-अक्ष पर ऊपर बढ़ें।",
          "gu": "હંમેશાં પહેલાં આડી X-ધરી પર ચાલો, પછી ઊભી Y-ધરી પર ઉપર જાઓ."
        },
        "tags": [
          {
            "en": "(X, Y) Order",
            "hi": "(X, Y) क्रम",
            "gu": "(X, Y) ક્રમ"
          },
          {
            "en": "Hallway First (X)",
            "hi": "पहले गलियारा (X)",
            "gu": "પહેલાં ગેલેરી (X)"
          },
          {
            "en": "Elevator Second (Y)",
            "hi": "फिर लिफ्ट (Y)",
            "gu": "પછી લિફ્ટ (Y)"
          },
          {
            "en": "Origin (0,0)",
            "hi": "मूल बिंदु (0,0)",
            "gu": "ઉગમબિંદુ (૦,૦)"
          },
          {
            "en": "Grid Accuracy",
            "hi": "ग्रिड सटीकता",
            "gu": "ગ્રીડ ચોકસાઈ"
          },
          {
            "en": "Map Mastery",
            "hi": "नक्शा महारत",
            "gu": "નકશા નિપુણતા"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "coordinate_map",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Place your pencil at the Origin point (0, 0) at the bottom-left.",
              "hi": "अपनी पेंसिल को नीचे-बाएँ मूल बिंदु (0, 0) पर रखें।",
              "gu": "તમારી પેન્સિલને નીચે-ડાબી બાજુ ઉગમબિંદુ (૦, ૦) પર મૂકો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Read the first number (X) and move horizontally along the bottom line to that column.",
              "hi": "पहला नंबर (X) पढ़ें और नीचे की रेखा के साथ उस कॉलम तक क्षैतिज रूप से बढ़ें।",
              "gu": "પહેલો નંબર (X) વાંચો અને નીચેની લાઇન પર તે ખાના સુધી આડા ચાલો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Read the second number (Y) and move vertically straight up to that row.",
              "hi": "दूसरा नंबर (Y) पढ़ें और उस पंक्ति तक सीधे ऊपर की ओर बढ़ें।",
              "gu": "બીજો નંબર (Y) વાંચો અને તે હરોળ સુધી સીધા ઊભા ઉપર જાઓ."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Draw your dot and label it with (X, Y) to complete the plot.",
              "hi": "बिंदु लगाएं और प्लॉट पूरा करने के लिए उस पर (X, Y) का नाम लिखें।",
              "gu": "બિંદુ દોરો અને પ્લોટ પૂર્ણ કરવા માટે તેના પર (X, Y) નું લેબલ લગાવો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "coordinate_map",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Draw a simple 5x5 grid in your notebook, hide 3 treasure stars at (1, 4), (3, 2), and (5, 5), and have a friend find them using X then Y!",
          "hi": "अपनी कॉपी में 5x5 का ग्रिड बनाएं, (1, 4), (3, 2), और (5, 5) पर खजाना छिपाएं और दोस्त से X फिर Y का उपयोग करके खोजने को कहें!",
          "gu": "તમારી નોટબુકમાં ૫x૫ ની ગ્રીડ દોરો, (૧, ૪), (૩, ૨), અને (૫, ૫) પર ૩ સ્ટાર છુપાવો અને મિત્રને X પછી Y થી શોધવા કહો!"
        },
        "commitment_button_text": {
          "en": "I will navigate with Hallway then Elevator!",
          "hi": "मैं पहले गलियारा फिर लिफ्ट नियम अपनाऊँगा!",
          "gu": "હું પહેલાં ગેલેરી પછી લિફ્ટ નિયમ વાપરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_156",
    "methodNumber": 156,
    "classLevel": 5,
    "category": {
      "en": "Critical Thinking Strategies",
      "hi": "तार्किक व आलोचनात्मक सोच",
      "gu": "જટિલ અને તાર્કિક વિચારસરણી"
    },
    "title": {
      "en": "Fact vs Opinion (Evidence Detective)",
      "hi": "तथ्य बनाम राय (प्रमाण जासूस)",
      "gu": "હકીકત વિરુદ્ધ અભિપ્રાય (પુરાવા ડિટેક્ટીવ)"
    },
    "description": {
      "en": "Distinguish verifiable facts (proven with measurements, records, and science) from subjective opinions (feelings, beliefs, and emotional adjectives like 'best' or 'boring').",
      "hi": "मापन और विज्ञान द्वारा सिद्ध तथ्यों को व्यक्तिगत भावनाओं और 'सर्वश्रेष्ठ' या 'उबाऊ' जैसे विशेषणों वाली रायों से अलग पहचानें।",
      "gu": "પુરાવા અને વિજ્ઞાન દ્વારા સાબિત હકીકતોને અંગત લાગણીઓ અને 'શ્રેષ્ઠ' કે 'કંટાળાજનક' જેવા અભિપ્રાયોથી અલગ તારવો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "fact_scale",
        "title": {
          "en": "Believing Everyone's Loud Opinions as Cold Facts?",
          "hi": "दूसरों की भावनाओं को ठोस सच्चाई मान लेते हैं?",
          "gu": "બીજાના અભિપ્રાયોને સાચી હકીકત માની બેસો છો?"
        },
        "pain_quotes": [
          {
            "en": "Someone said 'Math is the hardest subject in the universe', and I believed it was an absolute truth!",
            "hi": "किसी ने कहा 'गणित दुनिया का सबसे कठिन विषय है', और मैंने मान लिया कि यह सार्वभौमिक सत्य है!",
            "gu": "કોઈએ કહ્યું 'ગણિત સૌથી અઘરો વિષય છે', અને મેં માની લીધું કે આ સનાતન સત્ય છે!"
          },
          {
            "en": "In reading comprehension tests, I get confused between what is provable evidence and what is just the author's personal feeling!",
            "hi": "रीडिंग टेस्ट में मैं उलझ जाता हूँ कि कौन सा साबित करने योग्य सबूत है और कौन सी केवल लेखक की भावना!",
            "gu": "વાંચન કસોટીમાં હું ગૂંચવાઈ જાઉં છું કે કયો સાબિત પુરાવો છે અને કઈ માત્ર લેખકની લાગણી!"
          }
        ],
        "body": {
          "en": "Opinions sound powerful when spoken loudly, but they cannot be measured or universally proven. 'Fact vs Opinion' uses the Evidence Test: If a statement can be verified with scientific tools, records, or counters, it's a FACT; if it contains feelings or judgment words ('awesome', 'ugly', 'delicious'), it's an OPINION!",
          "hi": "जब राय ज़ोर से बोली जाती है तो वह सच लगती है, लेकिन उसे मापा या साबित नहीं किया जा सकता। 'प्रमाण परीक्षण' अपनाएं: यदि बात को विज्ञान, अभिलेख या माप से सिद्ध किया जा सके तो वह तथ्य (FACT) है; यदि उसमें भावनाएं या 'सर्वश्रेष्ठ', 'खराब' जैसे शब्द हों तो वह राय (OPINION) है!",
          "gu": "અભિપ્રાય મોટેથી બોલાય ત્યારે સાચો લાગે છે, પણ તેને માપી શકાતો નથી. 'પુરાવા કસોટી' વાપરો: જો વિધાનને વિજ્ઞાન, રેકોર્ડ કે માપનથી સાબિત કરી શકાય તો તે હકીકત (FACT) છે; જો તેમાં 'શ્રેષ્ઠ', 'ખરાબ' જેવા ભાવનાત્મક શબ્દો હોય તો તે અભિપ્રાય (OPINION) છે!"
        },
        "key_takeaway": {
          "en": "Evidence Rule: Can it be proven with numbers and cameras? $\\rightarrow$ FACT. Is it a personal taste or feeling? $\\rightarrow$ OPINION.",
          "hi": "प्रमाण नियम: क्या इसे संख्याओं और सबूत से साबित किया जा सकता है? $\\rightarrow$ तथ्य। क्या यह व्यक्तिगत पसंद या भावना है? $\\rightarrow$ राय।",
          "gu": "પુરાવા નિયમ: શું તેને આંકડા અને સાબિતીથી માપી શકાય? $\\rightarrow$ હકીકત. શું તે અંગત પસંદ કે લાગણી છે? $\\rightarrow$ અભિપ્રાય."
        }
      },
      {
        "type": "relatable_story",
        "icon": "fact_scale",
        "title": {
          "en": "Meet Dev",
          "hi": "देव से मिलें",
          "gu": "મળો દેવને"
        },
        "story": {
          "en": "Dev read an advertisement: 'SuperJuice has 50mg Vitamin C per bottle, making it the tastiest drink on Earth!' Dev assumed the whole sentence was 100% true science. His friend pointed out: '50mg Vitamin C' is a verifiable FACT, but 'tastiest drink' is pure OPINION! Dev avoided falling for the sales hype.",
          "hi": "देव ने विज्ञापन पढ़ा: 'सुपरजूस में 50mg विटामिन सी है, जिससे यह पृथ्वी का सबसे स्वादिष्ट पेय है!' देव ने मान लिया कि पूरा वाक्य 100% वैज्ञानिक सच है। उसके दोस्त ने समझाया: '50mg विटामिन सी' एक प्रमाणित तथ्य है, लेकिन 'सबसे स्वादिष्ट' केवल एक राय है!",
          "gu": "દેવે જાહેરાત વાંચી: 'સુપરજ્યુસમાં બોટલ દીઠ ૫૦mg વિટામિન સી છે, જે તેને પૃથ્વીનું સૌથી સ્વાદિષ્ટ પીણું બનાવે છે!' દેવે આખું વાક્ય સાચું માની લીધું. મિત્રે સમજાવ્યું: '૫૦mg વિટામિન સી' સાબિત હકીકત છે, પણ 'સૌથી સ્વાદિષ્ટ' માત્ર એક અભિપ્રાય છે!"
        },
        "insight_box": {
          "en": "Adjective Clue: Words like 'best', 'worst', 'tastiest', 'fun', and 'boring' are dead giveaways of opinions.",
          "hi": "विशेषण सुराग: 'सबसे अच्छा', 'सबसे बुरा', 'स्वादिष्ट', 'मज़ेदार' और 'उबाऊ' जैसे शब्द हमेशा राय दर्शाते हैं।",
          "gu": "વિશેષણ સંકેત: 'શ્રેષ્ઠ', 'ખરાબ', 'સ્વાદિષ્ટ', 'મનોરંજક' અને 'કંટાળાજનક' જેવા શબ્દો અભિપ્રાયની ઓળખ છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "fact_scale",
        "question": {
          "en": "Which of the following statements is a 100% verifiable scientific FACT?",
          "hi": "निम्नलिखित में से कौन सा कथन 100% सत्यापन योग्य वैज्ञानिक तथ्य (FACT) है?",
          "gu": "નીચેનામાંથી કયું વિધાન ૧૦૦% સાબિત થયેલી વૈજ્ઞાનિક હકીકત (FACT) છે?"
        },
        "option_a": {
          "en": "Lions are much scarier and cooler than tigers.",
          "hi": "शेर बाघों की तुलना में बहुत अधिक डरावने और शानदार होते हैं।",
          "gu": "સિંહ વાઘ કરતાં વધુ ડરામણા અને અદ્ભુત હોય છે."
        },
        "option_b": {
          "en": "Water boils at 100 degrees Celsius at standard sea-level atmospheric pressure.",
          "hi": "पानी समुद्र तल के मानक वायुमंडलीय दबाव पर 100 डिग्री सेल्सियस पर उबलता है।",
          "gu": "દરિયાઈ સપાટીના સામાન્ય દબાણે પાણી ૧૦૦ ડિગ્રી સેલ્સિયસ પર ઊકળે છે."
        },
        "feedback": {
          "en": "Correct! Boiling point is measured with a thermometer (Fact), whereas 'cooler/scarier' is an emotional judgment (Opinion).",
          "hi": "सही! क्वथनांक थर्मामीटर से मापा जा सकता है (तथ्य), जबकि 'डरावना/शानदार' केवल एक राय है।",
          "gu": "સાચું! ઉત્કલનબિંદુ થર્મોમીટરથી માપી શકાય (હકીકત), જ્યારે 'ડરામણું/અદ્ભુત' એ માત્ર અભિપ્રાય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "fact_scale",
        "question": {
          "en": "Look at these four statements about the Solar System. Which one is an OPINION rather than a FACT?",
          "hi": "सौर मंडल के बारे में इन चार कथनों को देखें। कौन सा कथन तथ्य के बजाय एक राय (OPINION) है?",
          "gu": "સૂર્યમંડળ વિશેના આ ચાર વિધાનો જુઓ. કયું વિધાન હકીકતને બદલે એક અભિપ્રાય (OPINION) છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Saturn has visible rings made mostly of ice and rock particles.",
              "hi": "शनि के पास मुख्य रूप से बर्फ और चट्टान के कणों से बने दृश्यमान छल्ले हैं।",
              "gu": "શનિ પાસે મુખ્યત્વે બરફ અને પથ્થરના કણોથી બનેલા વલયો છે."
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Jupiter is the most beautiful planet to observe through a telescope.",
              "hi": "दूरबीन से देखने पर बृहस्पति सबसे सुंदर ग्रह लगता है।",
              "gu": "ટેલિસ્કોપથી જોતાં ગુરુ સૌથી સુંદર ગ્રહ લાગે છે."
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Earth takes approximately 365.25 days to complete one orbit around the Sun.",
              "hi": "पृथ्वी को सूर्य के चारों ओर एक चक्कर पूरा करने में लगभग 365.25 दिन लगते हैं।",
              "gu": "પૃથ્વીને સૂર્યની આસપાસ એક પરિભ્રમણ પૂરું કરતાં આશરે ૩૬૫.૨૫ દિવસ લાગે છે."
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Mars has two moons named Phobos and Deimos.",
              "hi": "मंगल के दो चंद्रमा हैं जिनका नाम फोबोस और डीमोस है।",
              "gu": "મંગળ પાસે ફોબોસ અને ડીમોસ નામના બે ચંદ્રો છે."
            }
          }
        ],
        "correct_option": "B",
        "feedback": {
          "en": "Spot on! 'Most beautiful' depends on personal perception and cannot be scientifically measured, making Option B an opinion.",
          "hi": "शानदार! 'सबसे सुंदर' व्यक्तिगत पसंद पर निर्भर करता है और इसे मापा नहीं जा सकता, इसलिए विकल्प B एक राय है।",
          "gu": "એકદમ સાચું! 'સૌથી સુંદર' એ વ્યક્તિગત પસંદગી છે અને તેને માપી શકાતી નથી, તેથી વિકલ્પ B અભિપ્રાય છે."
        }
      },
      {
        "type": "strategy_pills",
        "icon": "fact_scale",
        "title": {
          "en": "Evidence Detective Superpower",
          "hi": "प्रमाण जासूस सुपरपावर",
          "gu": "પુરાવા ડિટેક્ટીવ સુપરપાવર"
        },
        "body": {
          "en": "Filter claims: Test if a statement relies on measurable evidence or personal feelings.",
          "hi": "दावों की जांच करें: देखें कि कथन मापने योग्य सबूत पर आधारित है या व्यक्तिगत भावना पर।",
          "gu": "દાવાઓને ચકાસો: જુઓ કે વિધાન માપી શકાય તેવા પુરાવા પર છે કે અંગત લાગણી પર."
        },
        "tags": [
          {
            "en": "Measurable Proof",
            "hi": "मापने योग्य सबूत",
            "gu": "માપી શકાય તેવો પુરાવો"
          },
          {
            "en": "Emotional Words",
            "hi": "भावनात्मक शब्द",
            "gu": "લાગણીશીલ શબ્દો"
          },
          {
            "en": "Fact = Proven",
            "hi": "तथ्य = सिद्ध",
            "gu": "હકીકત = સાબિત"
          },
          {
            "en": "Opinion = Feeling",
            "hi": "राय = भावना",
            "gu": "અભિપ્રાય = લાગણી"
          },
          {
            "en": "Adjective Alert",
            "hi": "विशेषण चेतावनी",
            "gu": "વિશેષણ ચેતવણી"
          },
          {
            "en": "Critical Lens",
            "hi": "तार्किक दृष्टि",
            "gu": "તાર્કિક નજર"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "fact_scale",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Read the statement carefully and highlight any judgment adjectives ('best', 'boring', 'greatest').",
              "hi": "कथन को ध्यान से पढ़ें और राय वाले विशेषणों ('सर्वश्रेष्ठ', 'उबाऊ', 'महान') को पहचानें।",
              "gu": "વિધાન ધ્યાનથી વાંચો અને અભિપ્રાય દર્શાવતા વિશેષણો ('શ્રેષ્ઠ', 'કંટાળાજનક', 'મહાન') શોધો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Ask: 'Can this claim be tested and verified with numbers, tools, or historical records?'",
              "hi": "पूछें: 'क्या इस दावे को संख्याओं, उपकरणों या ऐतिहासिक रिकॉर्ड से सत्यापित किया जा सकता है?'",
              "gu": "પૂછો: 'શું આ દાવાને આંકડા, સાધનો કે ઐતિહાસિક રેકોર્ડથી ચકાસી શકાય છે?'"
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "If provable across all observers without dispute, classify as a FACT.",
              "hi": "यदि बिना किसी विवाद के सभी के लिए साबित किया जा सके, तो इसे तथ्य (FACT) के रूप में वर्गीकृत करें।",
              "gu": "જો કોઈ પણ વિવાદ વગર બધા માટે સાબિત થઈ શકે, તો તેને હકીકત (FACT) તરીકે વર્ગીકૃત કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "If it reflects personal preference or belief, classify as an OPINION.",
              "hi": "यदि यह व्यक्तिगत पसंद या विश्वास को दर्शाता है, तो इसे राय (OPINION) के रूप में वर्गीकृत करें।",
              "gu": "જો તે વ્યક્તિગત પસંદ કે માન્યતા દર્શાવે છે, તો તેને અભિપ્રાય (OPINION) તરીકે વર્ગીકૃત કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "fact_scale",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Read a news article or product ad today, circle 2 verifiable FACTS in blue, and underline 2 subjective OPINIONS in red!",
          "hi": "आज कोई अखबार या विज्ञापन पढ़ें, 2 तथ्यों पर नीला गोला लगाएं और 2 रायों को लाल रंग से रेखांकित करें!",
          "gu": "આજે કોઈ સમાચાર કે જાહેરાત વાંચો, ૨ સાચી હકીકતો પર વાદળી ગોળ કરો અને ૨ અભિપ્રાયો નીચે લાલ લીટી દોરો!"
        },
        "commitment_button_text": {
          "en": "I will separate facts from opinions!",
          "hi": "मैं तथ्य और राय में अंतर पहचानूँगा!",
          "gu": "હું હકીકત અને અભિપ્રાય વચ્ચેનો તફાવત ઓળખીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_164",
    "methodNumber": 164,
    "classLevel": 5,
    "category": {
      "en": "Critical Thinking Strategies",
      "hi": "तार्किक व आलोचनात्मक सोच",
      "gu": "જટિલ અને તાર્કિક વિચારસરણી"
    },
    "title": {
      "en": "Pros vs Cons (Decision Balance Scale)",
      "hi": "पक्ष बनाम विपक्ष (निर्णय संतुलन पैमाना)",
      "gu": "લાભ વિરુદ્ધ ગેરલાભ (નિર્ણય ત્રાજવું)"
    },
    "description": {
      "en": "Make smart choices without impulsive regret by mapping benefits (+) and drawbacks (-) onto a two-column T-Chart before deciding.",
      "hi": "जल्दबाजी में गलत फैसलों से बचने के लिए निर्णय लेने से पहले फायदों (+) और नुकसानों (-) को दो कॉलम वाले टी-चार्ट पर तौलें।",
      "gu": "ઉતાવળિયા નિર્ણયોના પસ્તાવાથી બચવા માટે નિર્ણય લેતાં પહેલાં ફાયદા (+) અને ગેરફાયદા (-) ને બે ખાનાવાળા T-ચાર્ટ પર સરખાવો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "balance_pros_cons",
        "title": {
          "en": "Making Impulsive Choices and Regretting Them Later?",
          "hi": "जल्दबाजी में फैसले लेते हैं और बाद में पछताते हैं?",
          "gu": "ઉતાવળે નિર્ણયો લઈને પછીથી પસ્તાવો થાય છે?"
        },
        "pain_quotes": [
          {
            "en": "I bought a cool-looking toy on impulse, only to realize it broke on day 1 and wasted all my pocket money!",
            "hi": "मैंने चमक-दमक देखकर खिलौना खरीद लिया, पर वह पहले दिन ही टूट गया और पॉकेट मनी बर्बाद हो गई!",
            "gu": "મેં દેખાવ જોઈને રમકડું ખરીદી લીધું, પણ તે પહેલા જ દિવસે તૂટી ગયું અને પૈસા વેડફાયા!"
          },
          {
            "en": "I agreed to join 3 after-school clubs at once and now have zero time for homework or play!",
            "hi": "मैंने एक साथ 3 क्लबों में नाम लिखवा लिया और अब होमवर्क या खेलने का समय ही नहीं बचा!",
            "gu": "મેં એક સાથે ૩ ક્લબમાં ભાગ લઈ લીધો અને હવે હોમવર્ક કે રમવાનો સમય જ નથી બચ્યો!"
          }
        ],
        "body": {
          "en": "Our brains easily get excited by immediate fun while blinding us to hidden consequences. 'Pros vs Cons' puts your options on a mental balance scale: list all the positive gains (+) on the left and all the costs/risks (-) on the right to make wise, regret-free decisions!",
          "hi": "हमारा दिमाग तुरंत मिलने वाले मजे से उत्तेजित हो जाता है और छिपे हुए नुकसानों को नजरअंदाज कर देता है। 'पक्ष बनाम विपक्ष' आपके विकल्पों को तराजू पर रखता है: सभी फायदे (+) बाईं ओर और सभी जोखिम (-) दाईं ओर लिखकर समझदारी भरा फैसला लें!",
          "gu": "આપણું મગજ ક્ષણિક મજા જોઈને ઉત્સાહિત થઈ જાય છે અને છુપાયેલા જોખમોને ભૂલી જાય છે. 'લાભ વિરુદ્ધ ગેરલાભ' વિકલ્પોને ત્રાજવે તોળે છે: બધા ફાયદા (+) ડાબી બાજુ અને બધા ગેરફાયદા (-) જમણી બાજુ લખીને સમજદારીથી નિર્ણય લો!"
        },
        "key_takeaway": {
          "en": "Balance Scale Rule: Write Pros (+) $\\leftrightarrow$ Write Cons (-) $\\rightarrow$ Weigh the heavy side before choosing!",
          "hi": "संतुलन नियम: पक्ष (+) लिखें $\\leftrightarrow$ विपक्ष (-) लिखें $\\rightarrow$ भारी पक्ष को तौलकर ही चुनाव करें!",
          "gu": "સંતુલન નિયમ: લાભ (+) લખો $\\leftrightarrow$ ગેરલાભ (-) લખો $\\rightarrow$ ભારે પલ્લાને સરખાવીને જ પસંદગી કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "balance_pros_cons",
        "title": {
          "en": "Meet Aarav",
          "hi": "आरव से मिलें",
          "gu": "મળો આરવને"
        },
        "story": {
          "en": "Aarav had to decide whether to adopt a puppy. His heart screamed 'YES! So cute!' But he drew a Pros & Cons chart. Pros: Playful friend, exercise (+2). Cons: Daily 6 AM walks, training messes, vet bills (-3). Realizing his family was too busy this month, they waited until summer vacation—a perfect, stress-free decision!",
          "hi": "आरव को पिल्ला गोद लेने का फैसला करना था। उसका दिल बोला 'हाँ! कितना प्यारा है!' लेकिन उसने पक्ष-विपक्ष चार्ट बनाया। पक्ष: वफादार दोस्त, खेलना (+2)। विपक्ष: सुबह 6 बजे सैर, सफाई, डॉक्टर का खर्च (-3)। यह समझकर कि अभी समय कम है, उन्होंने छुट्टियों तक इंतज़ार किया—एक सही फैसला!",
          "gu": "આરવે ગલૂડિયું દત્તક લેવાનો નિર્ણય કરવાનો હતો. તેનું મન બોલ્યું 'હા! કેટલું વહાલું છે!' પણ તેણે લાભ-ગેરલાભનો ચાર્ટ બનાવ્યો. લાભ: રમતીયાળ મિત્ર, કસરત (+૨). ગેરલાભ: સવારે ૬ વાગ્યે ચાલવું, સફાઈ, ડોક્ટરનો ખર્ચ (-૩). અત્યારે પરીક્ષાનો સમય હોવાથી તેમણે વેકેશન સુધી રાહ જોઈ—એક ઉત્તમ નિર્ણય!"
        },
        "insight_box": {
          "en": "Weight over Quantity: One huge Con (like failing an exam) can outweigh 5 tiny Pros.",
          "hi": "वजन का महत्व: एक बड़ा नुकसान (जैसे परीक्षा में पिछड़ना) 5 छोटे फायदों पर भारी पड़ सकता है।",
          "gu": "વજનનું મહત્વ: એક મોટો ગેરલાભ (જેમ કે પરીક્ષામાં નુકસાન) ૫ નાના ફાયદાઓ પર ભારે પડી શકે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "balance_pros_cons",
        "title": {
          "en": "Decision Balance Test",
          "hi": "निर्णय संतुलन परीक्षण",
          "gu": "નિર્ણય સંતુલન કસોટી"
        },
        "question": {
          "en": "Why is drawing a 2-column Pros & Cons chart better than making a quick gut decision?",
          "hi": "जल्दबाजी में फैसला लेने की तुलना में 2-कॉलम वाला पक्ष और विपक्ष चार्ट बनाना बेहतर क्यों है?",
          "gu": "ઉતાવળે નિર્ણય લેવા કરતાં ૨-ખાનાવાળો લાભ અને ગેરલાભ ચાર્ટ બનાવવો શા માટે સારો છે?"
        },
        "option_a": {
          "en": "It forces you to see hidden drawbacks and long-term costs before spending time or money.",
          "hi": "यह समय या पैसा खर्च करने से पहले छिपे हुए नुकसानों और भविष्य के परिणामों को स्पष्ट दिखाता है।",
          "gu": "તે સમય કે પૈસા ખર્ચતાં પહેલાં છુપાયેલા ગેરફાયદા અને ભવિષ્યના પરિણામો સ્પષ્ટ બતાવે છે."
        },
        "option_b": {
          "en": "It guarantees that whichever list has more words is automatically the right choice.",
          "hi": "यह गारंटी देता है कि जिस सूची में अधिक शब्द होंगे, वह हमेशा सही चुनाव होगा।",
          "gu": "તે ખાતરી આપે છે કે જે યાદીમાં વધુ શબ્દો હશે તે આપોઆપ સાચો વિકલ્પ બનશે."
        },
        "feedback": {
          "en": "Correct! Pros vs Cons prevents emotional blind spots by bringing hidden costs into plain sight.",
          "hi": "सही! पक्ष बनाम विपक्ष भावनाओं के अंधेपन को दूर करके छिपे हुए नुकसानों को सामने लाता है।",
          "gu": "સાચું! લાભ વિરુદ્ધ ગેરલાભ પદ્ધતિ લાગણીઓની આંધળી દોટ અટકાવી છુપાયેલા જોખમો સામે લાવે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "balance_pros_cons",
        "question": {
          "en": "Meera is deciding whether to stay up late until midnight to finish a video game level before school tomorrow. \nPros: Fun gaming moment (+1). \nCons: Waking up exhausted, headache during math test, scolding from teacher (-3). \nWhat is the logical decision?",
          "hi": "मीरा फैसला कर रही है कि क्या कल स्कूल से पहले वीडियो गेम लेवल खत्म करने के लिए देर रात 12 बजे तक जागना चाहिए। \nपक्ष: खेल का रोमांच (+1)। \nविपक्ष: भारी थकान, गणित टेस्ट में सिरदर्द, शिक्षक से डांट (-3)। \nतार्किक निर्णय क्या है?",
          "gu": "મીરા નક્કી કરે છે કે શું આવતીકાલે શાળા હોવા છતાં વિડીયો ગેમ રમવા મોડી રાત સુધી જાગવું જોઈએ. \nલાભ: રમતની મજા (+૧). \nગેરલાભ: સવારે અતિશય થાક, ગણિત ટેસ્ટમાં માથાનો દુખાવો, શિક્ષકનો ઠપકો (-૩). \nતાર્કિક નિર્ણય કયો છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Sleep on time now; play the game over the weekend when the Cons disappear",
              "hi": "अभी समय पर सो जाएं; सप्ताहांत पर खेलें जब नुकसान शून्य हो जाएं",
              "gu": "અત્યારે સમયસર ઊંઘી જાઓ; વીકેન્ડ પર રમો જ્યારે કોઈ નુકસાન ન હોય"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Stay up until 2 AM to play even more",
              "hi": "और अधिक खेलने के लिए रात 2 बजे तक जागें",
              "gu": "વધુ રમવા માટે રાત્રે ૨ વાગ્યા સુધી જાગો"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Skip school tomorrow completely",
              "hi": "कल स्कूल जाना पूरी तरह छोड़ दें",
              "gu": "કાલે શાળાએ જવાનું જ માંડી વાળો"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Play games during the math exam",
              "hi": "गणित की परीक्षा के दौरान गेम खेलें",
              "gu": "ગણિતની પરીક્ષા વખતે ગેમ રમો"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The heavy Cons (-3) far outweigh the single Pro (+1). Postponing to the weekend is the master move!",
          "hi": "शानदार! भारी नुकसान (-3) अकेले फायदे (+1) से कहीं बड़ा है। सप्ताहांत तक टालना सबसे समझदारी भरा कदम है!",
          "gu": "એકદમ સાચું! મોટો ગેરલાભ (-૩) એક નાના લાભ (+૧) કરતાં ઘણો ભારે છે. સપ્તાહાંત સુધી મુલતવી રાખવું શ્રેષ્ઠ નિર્ણય છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "balance_pros_cons",
        "title": {
          "en": "Decision Balance Superpower",
          "hi": "निर्णय संतुलन सुपरपावर",
          "gu": "નિર્ણય સંતુલન સુપરપાવર"
        },
        "body": {
          "en": "Weigh positive gains against future drawbacks before committing to any major action.",
          "hi": "किसी भी बड़े काम को करने से पहले फायदों और भविष्य के नुकसानों को तराजू में तौलें।",
          "gu": "કોઈપણ મોટો નિર્ણય લેતાં પહેલાં ફાયદા અને ભવિષ્યના જોખમોને ત્રાજવે તોળો."
        },
        "tags": [
          {
            "en": "T-Chart Mapping",
            "hi": "टी-चार्ट विधि",
            "gu": "T-ચાર્ટ પદ્ધતિ"
          },
          {
            "en": "Pros (+)",
            "hi": "पक्ष (+)",
            "gu": "લાભ (+)"
          },
          {
            "en": "Cons (-)",
            "hi": "विपक्ष (-)",
            "gu": "ગેરલાભ (-)"
          },
          {
            "en": "Weigh the Impact",
            "hi": "प्रभाव का वजन",
            "gu": "અસરનું વજન"
          },
          {
            "en": "Zero Regret",
            "hi": "पछतावा मुक्त",
            "gu": "પસ્તાવા મુક્ત"
          },
          {
            "en": "Smart Choices",
            "hi": "समझदार निर्णय",
            "gu": "સમજદારીભરી પસંદગી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "balance_pros_cons",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Draw a 'T' on paper with 'Pros (+)' on the left and 'Cons (-)' on the right.",
              "hi": "कागज पर 'T' बनाएं, बाईं ओर 'पक्ष (+)' और दाईं ओर 'विपक्ष (-)' लिखें।",
              "gu": "કાગળ પર 'T' દોરો, ડાબી બાજુ 'લાભ (+)' અને જમણી બાજુ 'ગેરલાભ (-)' લખો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Brainstorm at least 3 genuine benefits and 3 real risks or costs.",
              "hi": "कम से कम 3 वास्तविक लाभ और 3 वास्तविक जोखिम या लागतें सूचीबद्ध करें।",
              "gu": "ઓછામાં ઓછા ૩ સાચા ફાયદા અને ૩ સાચા જોખમો કે ખર્ચની યાદી બનાવો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Rate the severity/importance of each point (1 star = small, 3 stars = game-changer).",
              "hi": "प्रत्येक बिंदु के महत्व को रेट करें (1 स्टार = छोटा, 3 स्टार = निर्णायक)।",
              "gu": "દરેક મુદ્દાના મહત્વનું મૂલ્યાંકન કરો (૧ સ્ટાર = નાનો, ૩ સ્ટાર = અત્યંત મહત્વનો)."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Select the option with the highest total positive value and lowest catastrophic risk.",
              "hi": "उच्चतम सकारात्मक मूल्य और न्यूनतम जोखिम वाले विकल्प का चयन करें।",
              "gu": "સૌથી વધુ સકારાત્મક મૂલ્ય અને સૌથી ઓછા જોખમવાળા વિકલ્પની પસંદગી કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "balance_pros_cons",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Pick one decision you face today (e.g., how to spend free time or buying a snack) and write a 2-minute Pros & Cons T-Chart before choosing!",
          "hi": "आज के किसी एक निर्णय पर (जैसे खाली समय बिताना या नाश्ता चुनना) 2 मिनट का पक्ष-विपक्ष टी-चार्ट बनाएं!",
          "gu": "આજના કોઈ એક નિર્ણય માટે (જેમ કે નવરાશનો સમય કે નાસ્તો પસંદ કરવો) ૨ મિનિટનો T-ચાર્ટ બનાવીને પછી જ નક્કી કરો!"
        },
        "commitment_button_text": {
          "en": "I will weigh Pros and Cons before deciding!",
          "hi": "मैं निर्णय लेने से पहले पक्ष-विपक्ष तौलूँगा!",
          "gu": "હું નિર્ણય લેતાં પહેલાં લાભ-ગેરલાભ સરખાવીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_175",
    "methodNumber": 175,
    "classLevel": 5,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Self-Explanation (The Rubber Duck Teacher)",
      "hi": "स्वयं को समझाना (रबर डक शिक्षक)",
      "gu": "જાતે સમજાવવું (રબર ડક શિક્ષક)"
    },
    "description": {
      "en": "Turn passive reading into deep mastery by explaining the 'why' and 'how' of every step out loud to an imaginary listener as if you are the teacher.",
      "hi": "हर चरण के 'क्यों' और 'कैसे' को शिक्षक की तरह बोलकर समझाएं ताकि याददाश्त और समझ गहरी हो सके।",
      "gu": "દરેક પગલાના 'કેમ' અને 'કેવી રીતે' ને શિક્ષકની જેમ મોટેથી જાતે સમજાવો જેથી સમજણ ઊંડી અને પાકી બને."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "explain_bubble",
        "title": {
          "en": "Nodding While Reading but Forgetting Everything in the Exam?",
          "hi": "पढ़ते समय सब समझ आता है, पर परीक्षा में सब गायब हो जाता है?",
          "gu": "વાંચતી વખતે બધું આવડે છે એવું લાગે, પણ પરીક્ષામાં બધું ભૂલી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I re-read the science chapter 4 times, but when the exam asked 'Why does photosynthesis occur?', my mind went blank!",
            "hi": "मैंने विज्ञान का अध्याय 4 बार पढ़ा, पर परीक्षा में 'प्रकाश संश्लेषण क्यों होता है?' आते ही दिमाग खाली हो गया!",
            "gu": "મેં વિજ્ઞાનનો પાઠ ૪ વાર વાંચ્યો, પણ પરીક્ષામાં સવાલ આવતાં જ મગજ સાવ કોરું થઈ ગયું!"
          },
          {
            "en": "I thought I understood the math formula until I tried solving a problem alone without looking at the example!",
            "hi": "मुझे लगा कि सूत्र समझ आ गया है, लेकिन जब बिना उदाहरण देखे सवाल किया तो अटक गया!",
            "gu": "મને લાગ્યું કે દાખલો આવડી ગયો, પણ જ્યારે ઉદાહરણ વગર જાતે ગણવા બેઠો ત્યારે અટવાઈ ગયો!"
          }
        ],
        "body": {
          "en": "Silent reading creates an 'Illusion of Competence'—your brain recognizes the text and tricks you into thinking you've mastered it. 'Self-Explanation' forces you to teach the step in your own simple words. If you can't explain it simply, you found the hidden gap to fix!",
          "hi": "शांत पढ़ने से 'समझ का भ्रम' पैदा होता है—दिमाग सिर्फ शब्दों को पहचानकर आपको धोखा देता है। 'स्वयं को समझाना' आपको शिक्षक की तरह अपने शब्दों में बोलने पर मजबूर करता है। जहाँ आप अटकें, वहीं समझ की असली कमी पकड़ी जाती है!",
          "gu": "શાંતિથી વાંચવાથી 'આવડી જવાનો ભ્રમ' થાય છે—મગજ માત્ર શબ્દો ઓળખીને તમને છેતરે છે. 'જાતે સમજાવવું' તમને શિક્ષકની જેમ પોતાના શબ્દોમાં બોલવા પ્રેરે છે. જ્યાં તમે અટકો, ત્યાં જ સાચી ખામી પકડાઈ જાય છે!"
        },
        "key_takeaway": {
          "en": "Teacher Rule: Read 1 step $\\rightarrow$ Explain 'Why this works' in your own words $\\rightarrow$ Lock in permanent mastery!",
          "hi": "शिक्षक नियम: 1 कदम पढ़ें $\\rightarrow$ अपने शब्दों में समझाएं 'यह क्यों सही है' $\\rightarrow$ स्थायी समझ हासिल करें!",
          "gu": "શિક્ષક નિયમ: ૧ પગલું વાંચો $\\rightarrow$ પોતાના શબ્દોમાં બોલો 'આ શા માટે સાચું છે' $\\rightarrow$ પાકી સમજણ મેળવો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "explain_bubble",
        "title": {
          "en": "Meet Tanvi",
          "hi": "तन्वी से मिलें",
          "gu": "મળો તન્વીને"
        },
        "story": {
          "en": "Tanvi placed a little toy duck on her study desk. Whenever she learned a tough fraction problem, she whispered the explanation to the duck: 'First, I make the denominators matching because you can only add equal-sized pizza slices!' By teaching her duck, Tanvi scored 100% on her finals!",
          "hi": "तन्वी ने अपनी मेज पर एक छोटी खिलौना बत्तख रखी। जब भी वह भिन्न (fraction) का सवाल हल करती, वह बत्तख को समझाती: 'पहले हर (denominator) को बराबर करो क्योंकि हम सिर्फ बराबर टुकड़े ही जोड़ सकते हैं!' बत्तख को सिखाते हुए तन्वी ने गणित में पूरे 100% अंक पाए!",
          "gu": "તન્વીએ ટેબલ પર એક નાનું રમકડું મૂક્યું. જ્યારે પણ તે અપૂર્ણાંકનો દાખલો ગણતી, તે રમકડાને સમજાવતી: 'પહેલાં છેદ સરખા કરો કારણ કે સરખા ટુકડા જ ઉમેરી શકાય!' રમકડાને શીખવતાં શીખવતાં તન્વીને ગણિતમાં ૧૦૦% ગુણ આવ્યા!"
        },
        "insight_box": {
          "en": "Feynman Technique: If you can explain a concept to a 9-year-old without jargon, you truly own the knowledge.",
          "hi": "फाइनमैन तकनीक: यदि आप किसी विचार को बिना कठिन शब्दों के किसी बच्चे को समझा सकते हैं, तो आप उसके असली मालिक हैं।",
          "gu": "ફાઇનમેન પદ્ધતિ: જો તમે કોઈ સિદ્ધાંતને અઘરા શબ્દો વગર સરળ રીતે સમજાવી શકો, તો તમે તેના સાચા માસ્ટર છો."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "explain_bubble",
        "question": {
          "en": "What should you do immediately after reading a complex science concept in your book?",
          "hi": "किताब में विज्ञान का कोई जटिल सिद्धांत पढ़ने के तुरंत बाद आपको क्या करना चाहिए?",
          "gu": "પુસ્તકમાં વિજ્ઞાનનો કોઈ અઘરો સિદ્ધાંત વાંચ્યા પછી તરત તમારે શું કરવું જોઈએ?"
        },
        "option_a": {
          "en": "Close the book and explain in your own voice WHY and HOW the process works.",
          "hi": "किताब बंद करें और अपनी आवाज में समझाएं कि यह प्रक्रिया 'क्यों' और 'कैसे' काम करती है।",
          "gu": "પુસ્તક બંધ કરો અને પોતાના અવાજમાં મોટેથી બોલો કે આ પ્રક્રિયા 'શા માટે' અને 'કેવી રીતે' થાય છે."
        },
        "option_b": {
          "en": "Highlight every sentence with 3 different colored pens.",
          "hi": "हर वाक्य को 3 अलग-अलग रंगों के पेन से हाईलाइट करें।",
          "gu": "દરેક વાક્યને ૩ અલગ અલગ રંગની પેનથી રંગી નાખો."
        },
        "feedback": {
          "en": "Correct! Speaking the underlying reasoning in your own words triggers deep neural encoding.",
          "hi": "सही! अपने शब्दों में अंतर्निहित तर्क को बोलने से मस्तिष्क में ज्ञान स्थायी रूप से दर्ज होता है।",
          "gu": "સાચું! પોતાના શબ્દોમાં કારણ સ્પષ્ટ બોલવાથી મગજમાં જ્ઞાન કાયમ માટે સંગ્રહાય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "explain_bubble",
        "question": {
          "en": "Which of these is a high-quality 'Self-Explanation' when solving: $3/4 + 1/8$?",
          "hi": "भिन्न $3/4 + 1/8$ को हल करते समय कौन सा 'स्वयं-स्पष्टीकरण' सबसे उच्च गुणवत्ता का है?",
          "gu": "$3/4 + 1/8$ નો સરવાળો કરતી વખતે કઈ 'જાતે સમજૂતી' સૌથી શ્રેષ્ઠ છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "'I convert 3/4 to 6/8 by multiplying top and bottom by 2 so both fractions have equal-sized eighths, then 6/8 + 1/8 = 7/8.'",
              "hi": "'मैं 3/4 को ऊपर-नीचे 2 से गुणा करके 6/8 बनाता हूँ ताकि दोनों के हिस्से बराबर 8 हो जाएँ, फिर 6/8 + 1/8 = 7/8।'",
              "gu": "'હું ૩/૪ ને ઉપર-નીચે ૨ વડે ગુણીને ૬/૮ બનાવું છું જેથી બંનેના છેદ સરખા ૮ થાય, પછી ૬/૮ + ૧/૮ = ૭/૮ થાય.'"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "'I just add 3+1 and 4+8 to get 4/12.'",
              "hi": "'मैं बस 3+1 और 4+8 जोड़कर 4/12 लिख देता हूँ।'",
              "gu": "'હું ફક્ત ૩+૧ અને ૪+૮ ઉમેરીને ૪/૧૨ લખી દઉં છું.'"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "'I hope the answer is 7/8 because 7 is my lucky number.'",
              "hi": "'मुझे उम्मीद है कि उत्तर 7/8 होगा क्योंकि 7 मेरा लकी नंबर है।'",
              "gu": "'મને લાગે છે કે જવાબ ૭/૮ હશે કારણ કે ૭ મારો લકી નંબર છે.'"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "'I will skip fractions and do something else.'",
              "hi": "'मैं भिन्न छोड़ दूंगा और कुछ और करूँगा।'",
              "gu": "'હું અપૂર્ણાંક છોડી દઈશ અને બીજું કંઈક કરીશ.'"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Option A explains the 'WHY' (equal-sized pieces) and the 'HOW' (common denominator), demonstrating true mastery!",
          "hi": "शानदार! विकल्प A 'क्यों' (बराबर टुकड़े) और 'कैसे' (समान हर) दोनों को गहराई से समझाता है!",
          "gu": "એકદમ સાચું! વિકલ્પ A 'શા માટે' (સરખા ભાગ) અને 'કેવી રીતે' (સરખો છેદ) બંને સાચી રીતે સમજાવે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "explain_bubble",
        "title": {
          "en": "Self-Explanation Superpower",
          "hi": "स्वयं-स्पष्टीकरण सुपरपावर",
          "gu": "જાતે સમજાવવાની સુપરપાવર"
        },
        "body": {
          "en": "Teach every step out loud to expose hidden gaps and build indestructible understanding.",
          "hi": "छिपी हुई कमियों को पकड़ने और गहरी समझ बनाने के लिए हर कदम को बोलकर समझाएं।",
          "gu": "છુપાયેલી ખામીઓ પકડવા અને ઊંડી સમજણ બનાવવા માટે દરેક પગલું મોટેથી બોલીને સમજાવો."
        },
        "tags": [
          {
            "en": "Teach Out Loud",
            "hi": "बोलकर सिखाएं",
            "gu": "મોટેથી શીખવો"
          },
          {
            "en": "Explain 'Why'",
            "hi": "'क्यों' समझाएं",
            "gu": "'શા માટે' સમજાવો"
          },
          {
            "en": "Spot Hidden Gaps",
            "hi": "कमियां पकड़ें",
            "gu": "ખામીઓ પકડો"
          },
          {
            "en": "Rubber Duck",
            "hi": "रबर डक विधि",
            "gu": "રબર ડક પદ્ધતિ"
          },
          {
            "en": "No Jargon",
            "hi": "सरल भाषा",
            "gu": "સરળ ભાષા"
          },
          {
            "en": "Deep Encoding",
            "hi": "गहरी स्मृति",
            "gu": "ઊંડી યાદશક્તિ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "explain_bubble",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Read a paragraph or mathematical problem step.",
              "hi": "एक पैराग्राफ या गणितीय सवाल का एक चरण पढ़ें।",
              "gu": "એક ફકરો કે દાખલાનું એક પગલું વાંચો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Look away from the book or screen completely.",
              "hi": "किताब या स्क्रीन से अपनी आँखें पूरी तरह हटा लें।",
              "gu": "પુસ્તક કે સ્ક્રીન પરથી તમારી નજર સંપૂર્ણ હટાવી લો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Explain the step aloud in your own words: 'This works because...'",
              "hi": "अपने शब्दों में बोलकर समझाएं: 'यह इसलिए काम करता है क्योंकि...'",
              "gu": "પોતાના અવાજમાં મોટેથી બોલો: 'આ એટલા માટે સાચું છે કારણ કે...'"
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "If you hesitate or stumble, re-read that exact sentence to fix the gap immediately.",
              "hi": "यदि आप झिझकते हैं या अटकते हैं, तो उस कमी को तुरंत ठीक करने के लिए दोबारा पढ़ें।",
              "gu": "જો તમે અચકાઓ કે અટકો, તો તરત જ તે વાક્ય ફરીથી વાંચીને ખામી સુધારી લો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "explain_bubble",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Choose 1 difficult homework question today and explain your complete solution aloud to a toy or mirror before writing down the answer!",
          "hi": "आज गृहकार्य का 1 कठिन प्रश्न चुनें और उत्तर लिखने से पहले किसी खिलौने या आईने के सामने पूरा हल बोलकर समझाएं!",
          "gu": "આજે હોમવર્કનો ૧ અઘરો સવાલ પસંદ કરો અને ઉત્તર લખતાં પહેલાં કોઈ રમકડાં કે અરીસા સામે આખો દાખલો મોટેથી સમજાવો!"
        },
        "commitment_button_text": {
          "en": "I will explain my thinking out loud!",
          "hi": "मैं अपनी सोच को बोलकर समझाऊँगा!",
          "gu": "હું મારી વિચારસરણી મોટેથી સમજાવીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_177",
    "methodNumber": 177,
    "classLevel": 5,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Error Analysis (Mistake Autopsy)",
      "hi": "त्रुटि विश्लेषण (गलतियों का पोस्टमार्टम)",
      "gu": "ભૂલ વિશ્લેષણ (ભૂલોનું પોસ્ટમોર્ટમ)"
    },
    "description": {
      "en": "Turn every red 'X' on your test into an XP goldmine by classifying mistakes into 3 buckets: Concept Gap, Careless Slip, or Question Misread.",
      "hi": "टेस्ट में हुई हर गलती को 3 श्रेणियों में बाँटें: समझ की कमी, असावधानी का स्लिप, या प्रश्न गलत पढ़ना—और दोबारा कभी न दोहराएं।",
      "gu": "ટેસ્ટની દરેક લાલ ચોકડીને ૩ ભાગમાં વહેંચીને શીખો: નિયમની ખામી, ઉતાવળની ભૂલ, કે ખોટો સવાલ વાંચવો—જેથી ભૂલ ક્યારેય ન પુનરાવર્તિત થાય."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "magnifier_error",
        "title": {
          "en": "Hiding Your Wrong Test Papers in Shame?",
          "hi": "गलत उत्तर वाली टेस्ट शीट को शर्म से छिपा देते हैं?",
          "gu": "ખોટા જવાબોવાળી ટેસ્ટ શીટ જોઈને શરમથી છુપાવી દો છો?"
        },
        "pain_quotes": [
          {
            "en": "When I see a red cross on my paper, I feel bad and immediately shove it deep into my school bag!",
            "hi": "जब मैं अपनी कॉपी पर लाल क्रॉस देखता हूँ, तो बुरा लगता है और मैं उसे तुरंत बस्ते में छिपा देता हूँ!",
            "gu": "જ્યારે હું પેપર પર લાલ ચોકડી જોઉં છું, ત્યારે મને ખરાબ લાગે છે અને પેપર દફતરમાં છુપાવી દઉં છું!"
          },
          {
            "en": "I keep losing marks on the exact same type of math problem in every single unit test!",
            "hi": "मैं हर यूनिट टेस्ट में बिल्कुल एक ही तरह के गणित के सवाल में बार-बार नंबर कटवाता हूँ!",
            "gu": "હું દરેક ટેસ્ટમાં એક જ સરખા દાખલામાં વારંવાર માર્ક્સ ગુમાવી બેસું છું!"
          }
        ],
        "body": {
          "en": "A red cross isn't a badge of failure; it is a GPS coordinate pointing directly to what you haven't mastered yet. 'Error Analysis' performs an autopsy on every wrong answer to discover WHY you slipped. Once you name the bug, it never bites you again!",
          "hi": "लाल क्रॉस असफलता का प्रतीक नहीं है; यह एक जीपीएस सिग्नल है जो बताता है कि आपको क्या सीखना बाकी है। 'त्रुटि विश्लेषण' हर गलत उत्तर का पोस्टमार्टम करता है ताकि पता चले कि गलती क्यों हुई। जब बग की पहचान हो जाती है, तो वह दोबारा कभी परेशान नहीं करता!",
          "gu": "લાલ ચોકડી નિષ્ફળતા નથી; તે એક GPS સંકેત છે જે દર્શાવે છે કે ક્યાં સુધારો કરવાનો છે. 'ભૂલ વિશ્લેષણ' દરેક ખોટા જવાબનું પોસ્ટમોર્ટમ કરે છે જેથી ભૂલનું સાચું કારણ પકડાય. એકવાર ભૂલ ઓળખાઈ જાય, પછી તે ક્યારેય પુનરાવર્તિત થતી નથી!"
        },
        "key_takeaway": {
          "en": "Autopsy Rule: Wrong Answer $\\rightarrow$ Classify Bug (Concept / Careless / Misread) $\\rightarrow$ Fix the Root Cause!",
          "hi": "पोस्टमार्टम नियम: गलत उत्तर $\\rightarrow$ बग पहचानें (नियम / लापरवाही / गलत पढ़ना) $\\rightarrow$ जड़ से सुधारें!",
          "gu": "પોસ્ટમોર્ટમ નિયમ: ખોટો જવાબ $\\rightarrow$ ભૂલનો પ્રકાર શોધો (નિયમ / ઉતાવળ / ખોટો સવાલ) $\\rightarrow$ મૂળમાંથી સુધારો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "magnifier_error",
        "title": {
          "en": "Meet Varun",
          "hi": "वरुण से मिलें",
          "gu": "મળો વરૂણને"
        },
        "story": {
          "en": "Varun got 14/20 on his Science test. Instead of pouting, he created an 'Error Logbook'. Question 3 was a 'Misread Bug' (he missed the word NOT). Question 5 was a 'Careless Math Slip' ($7 \\times 8 = 54$ instead of 56). Question 6 was a 'Concept Gap'. By fixing those exact 3 triggers, Varun scored 20/20 on the very next exam!",
          "hi": "वरुण को विज्ञान टेस्ट में 14/20 मिले। दुखी होने के बजाय उसने 'त्रुटि लॉगबुक' बनाई। प्रश्न 3 में 'गलत पढ़ने का बग' था (उसने NOT शब्द नहीं देखा)। प्रश्न 5 में 'लापरवाही' थी ($7 \\times 8 = 54$ लिख दिया)। प्रश्न 6 में 'नियम की कमी' थी। तीनों को सुधारकर अगले टेस्ट में 20/20 पाए!",
          "gu": "વરૂણને વિજ્ઞાનમાં ૧૪/૨૦ આવ્યા. નિરાશ થવાને બદલે તેણે 'ભૂલ ડાયરી' બનાવી. પ્રશ્ન ૩ માં 'ખોટો સવાલ વાંચ્યો હતો' (તેણે NOT શબ્દ ન જોયો). પ્રશ્ન ૫ માં 'ઉતાવળની ભૂલ' હતી ($૭ \\times ૮ = ૫૪$ લખ્યું). પ્રશ્ન ૬ માં 'નિયમ નહોતો આવડતો'. આ ત્રણેય સુધારીને આગલી ટેસ્ટમાં ૨૦/૨૦ મેળવ્યા!"
        },
        "insight_box": {
          "en": "Error Classification: 70% of exam mistakes are not lack of intelligence, but careless rush and misread words.",
          "hi": "त्रुटि वर्गीकरण: परीक्षा में 70% गलतियाँ समझ की कमी से नहीं, बल्कि जल्दबाजी और प्रश्न गलत पढ़ने से होती हैं।",
          "gu": "ભૂલનું વર્ગીકરણ: પરીક્ષામાં ૭૦% ભૂલો બુદ્ધિની ખામીથી નહીં, પણ ઉતાવળ અને ખોટો સવાલ વાંચવાથી થાય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "magnifier_error",
        "question": {
          "en": "A student calculates $45 + 38 = 73$ because they forgot to add the carried-over '1' from $5+8=13$. What type of error is this?",
          "hi": "एक छात्र $45 + 38 = 73$ लिखता है क्योंकि वह $5+8=13$ से हासिल का '1' जोड़ना भूल गया। यह किस प्रकार की त्रुटि है?",
          "gu": "એક વિદ્યાર્થી $૪૫ + ૩૮ = ૭૩$ લખે છે કારણ કે તે ૫+૮=૧૩ ની વદ્દી '૧' ઉમેરવાનું ભૂલી ગયો. આ કયા પ્રકારની ભૂલ છે?"
        },
        "option_a": {
          "en": "A Careless Execution Slip (they know the addition concept, but rushed without tracking carry-overs).",
          "hi": "असावधानी की चूक (उन्हें जोड़ना आता है, लेकिन हासिल पर ध्यान दिए बिना जल्दबाजी की)।",
          "gu": "ઉતાવળની ભૂલ (તેમને સરવાળો આવડે છે, પણ વદ્દી ગણવામાં ઉતાવળ કરી)."
        },
        "option_b": {
          "en": "Proof that the student can never learn mathematics.",
          "hi": "सबूत कि छात्र कभी गणित नहीं सीख सकता।",
          "gu": "સાબિતી કે વિદ્યાર્થી ક્યારેય ગણિત શીખી નહીં શકે."
        },
        "feedback": {
          "en": "Correct! Identifying it as a 'Careless Carry-Over Slip' means the cure is simply circling carry-overs clearly!",
          "hi": "सही! इसे 'लापरवाही की हासिल चूक' के रूप में पहचानने का मतलब है कि समाधान केवल हासिल को स्पष्ट लिखना है!",
          "gu": "સાચું! આને 'વદ્દીની ઉતાવળિયા ભૂલ' તરીકે ઓળખવાથી ઉપાય સરળ બને છે: વદ્દી સ્પષ્ટ લખો!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "magnifier_error",
        "question": {
          "en": "Exam Question: 'Which of these is NOT a mammal?' \nStudent Answer: 'Dog' (Marked Wrong ❌). \nWhat was the root cause of this mistake?",
          "hi": "परीक्षा प्रश्न: 'इनमें से कौन सा स्तनपायी (mammal) नहीं है?' \nछात्र का उत्तर: 'कुत्ता' (गलत ❌)। \nइस गलती का मूल कारण क्या था?",
          "gu": "પરીક્ષાનો પ્રશ્ન: 'નીચેનામાંથી કયું સસ્તન પ્રાણી (mammal) નથી?' \nવિદ્યાર્થીનો જવાબ: 'કૂતરો' (ખોટો ❌). \nઆ ભૂલનું મૂળ કારણ શું હતું?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Misread Bug: The student rushed and overlooked the negative word 'NOT'",
              "hi": "गलत पढ़ने का बग: छात्र ने जल्दबाजी की और नकारात्मक शब्द 'नहीं' (NOT) को नजरअंदाज कर दिया",
              "gu": "ખોટો સવાલ વાંચ્યો: વિદ્યાર્થીએ ઉતાવળ કરી અને 'નથી' (NOT) શબ્દ જોયો નહીં"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "The student doesn't know what a dog is",
              "hi": "छात्र को नहीं पता कि कुत्ता क्या होता है",
              "gu": "વિદ્યાર્થીને ખબર નથી કે કૂતરો શું છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "The teacher made a printing error",
              "hi": "शिक्षक ने छपाई में गलती की थी",
              "gu": "શિક્ષકે પ્રિન્ટિંગમાં ભૂલ કરી હતી"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "The student calculated numbers incorrectly",
              "hi": "छात्र ने संख्याओं की गलत गणना की",
              "gu": "વિદ્યાર્થીએ આંકડાની ખોટી ગણતરી કરી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Missing 'NOT' or 'EXCEPT' is the #1 reading bug on upper-primary exams. Circle signal words in the question stem!",
          "hi": "शानदार! 'नहीं' (NOT) या 'छोड़कर' (EXCEPT) को छोड़ देना सबसे आम गलती है। प्रश्न में ऐसे शब्दों पर हमेशा गोला लगाएँ!",
          "gu": "એકદમ સાચું! 'નથી' (NOT) કે 'સિવાય' જેવા શબ્દો ચૂકી જવા એ સૌથી મોટી ભૂલ છે. સવાલમાં આવા શબ્દો પર હંમેશાં ગોળ કરો!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "magnifier_error",
        "title": {
          "en": "Mistake Autopsy Superpower",
          "hi": "त्रुटि पोस्टमार्टम सुपरपावर",
          "gu": "ભૂલ પોસ્ટમોર્ટમ સુપરપાવર"
        },
        "body": {
          "en": "Categorize every error into Concept, Careless, or Misread to eliminate repeat mistakes.",
          "hi": "गलतियों को नियम, असावधानी या गलत पढ़ने में बाँटें ताकि दोबारा कभी वही गलती न हो।",
          "gu": "ભૂલોને નિયમ, ઉતાવળ કે ખોટા વાંચનમાં વહેંચો જેથી ફરી ક્યારેય એ જ ભૂલ ન થાય."
        },
        "tags": [
          {
            "en": "Error Autopsy",
            "hi": "त्रुटि पोस्टमार्टम",
            "gu": "ભૂલ પોસ્ટમોર્ટમ"
          },
          {
            "en": "Concept Gap",
            "hi": "नियम की कमी",
            "gu": "નિયમની ખામી"
          },
          {
            "en": "Careless Slip",
            "hi": "असावधानी की चूक",
            "gu": "ઉતાવળની ભૂલ"
          },
          {
            "en": "Misread Bug",
            "hi": "गलत पढ़ना",
            "gu": "ખોટો સવાલ વાંચવો"
          },
          {
            "en": "Error Logbook",
            "hi": "गलतियों की डायरी",
            "gu": "ભૂલ ડાયરી"
          },
          {
            "en": "Red Cross $\\rightarrow$ Gold",
            "hi": "रेड क्रॉस $\\rightarrow$ सोना",
            "gu": "લાલ ચોકડી $\\rightarrow$ સોનું"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "magnifier_error",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Look at your marked test paper and locate every question with a red 'X'.",
              "hi": "अपनी जांची हुई टेस्ट शीट देखें और लाल 'X' वाले हर सवाल को खोजें।",
              "gu": "તમારું તપાસેલું પેપર જુઓ અને લાલ 'X' વાળા દરેક સવાલને શોધો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Diagnose the bug: write 'C' (Concept), 'S' (Slip), or 'M' (Misread Question) next to it.",
              "hi": "बग पहचानें: उसके बगल में 'C' (नियम), 'S' (लापरवाही), या 'M' (गलत पढ़ा) लिखें।",
              "gu": "ભૂલ ઓળખો: તેની બાજુમાં 'C' (નિયમ), 'S' (ઉતાવળ), કે 'M' (ખોટો સવાલ) લખો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Write down the exact one-sentence correction explaining what to do next time.",
              "hi": "अगली बार क्या करना है, यह समझाते हुए एक वाक्य का सही नियम लिखें।",
              "gu": "આવતી વખતે શું ધ્યાન રાખવું તે સમજાવતો એક વાક્યનો સાચો નિયમ લખો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Re-solve the problem cleanly from scratch without looking at the answer key.",
              "hi": "उत्तर कुंजी देखे बिना उस प्रश्न को नए सिरे से पूरी तरह सही हल करें।",
              "gu": "જવાબ જોયા વગર તે દાખલાને શરૂઆતથી જાતે સાચી રીતે ફરી ગણો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "magnifier_error",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Find any past worksheet with a wrong answer today, diagnose it as Concept / Slip / Misread, and solve it 100% correctly in your notebook!",
          "hi": "आज अपनी पुरानी वर्कशीट में से 1 गलत उत्तर खोजें, उसका बग पहचानें और कॉपी में 100% सही हल करें!",
          "gu": "આજે જૂની વર્કશીટમાંથી ૧ ખોટો જવાબ શોધો, ભૂલનો પ્રકાર નક્કી કરો અને નોટબુકમાં ૧૦૦% સાચો ગણી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will turn mistakes into mastery!",
          "hi": "मैं गलतियों से सीखकर निपुण बनूँगा!",
          "gu": "હું ભૂલોમાંથી શીખીને હોશિયાર બનીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_185",
    "methodNumber": 185,
    "classLevel": 5,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Self-Questioning (The Internal Co-Pilot)",
      "hi": "स्व-प्रश्न पूछना (आंतरिक सह-पायलट)",
      "gu": "જાતને પ્રશ્ન પૂછવા (આંતરિક સહ-પાયલટ)"
    },
    "description": {
      "en": "Steer your brain like a jet pilot by asking 3 crucial checkpoint questions: 'What am I solving?', 'Does this intermediate step make sense?', and 'Did I answer the full prompt?'.",
      "hi": "पायलट की तरह दिमाग को 3 चेकपॉइंट प्रश्नों से नियंत्रित करें: 'मैं क्या खोज रहा हूँ?', 'क्या यह कदम सही है?', और 'क्या मैंने पूरा उत्तर दिया?'।",
      "gu": "પાયલટની જેમ મગજને ૩ મહત્વના સવાલોથી ચલાવો: 'હું શું શોધી રહ્યો છું?', 'શું આ પગલું યોગ્ય છે?', અને 'શું મેં પૂરો જવાબ આપ્યો?'."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "question_mirror",
        "title": {
          "en": "Rushing on Autopilot and Answering the Wrong Question?",
          "hi": "ऑटोपायलट पर दौड़ते हैं और पूछा कुछ और, जवाब कुछ और देते हैं?",
          "gu": "ઉતાવળમાં દોડીને પૂછ્યું હોય કંઈક અને જવાબ બીજો જ આપી દો છો?"
        },
        "pain_quotes": [
          {
            "en": "A word problem asked for 'the change left over', but I stopped after finding the total cost and lost all marks!",
            "hi": "सवाल में पूछा था 'बचे हुए पैसे', लेकिन मैंने कुल खर्च निकालकर ही छोड़ दिया और सारे अंक कट गए!",
            "gu": "દાખલામાં પૂછ્યું હતું 'વધેલા રૂપિયા', પણ મેં કુલ ખર્ચ શોધીને જ દાખલો પૂરો માની લીધો અને માર્ક્સ કપાયા!"
          },
          {
            "en": "I calculate answers like 'a bus travels at 5,000 km/h' and don't even notice how absurd it is!",
            "hi": "मैं गणना करके लिख देता हूँ कि 'बस 5,000 किमी/घंटा दौड़ती है' और ध्यान भी नहीं देता कि यह कितना असंभव है!",
            "gu": "હું ગણતરી કરીને લખી દઉં છું કે 'બસ ૫,૦૦૦ કિમી/કલાક દોડે છે' અને વિચારતો પણ નથી કે આ કેટલું અશક્ય છે!"
          }
        ],
        "body": {
          "en": "When we race on autopilot, our brains forget to monitor reality. 'Self-Questioning' acts like an Internal Co-Pilot checking the cockpit instruments: Before, During, and After solving, you ask powerful prompt questions to ensure zero silly errors!",
          "hi": "जब हम बिना सोचे दौड़ते हैं, तो दिमाग वास्तविकता को परखना भूल जाता है। 'स्व-प्रश्न' कॉकपिट में बैठे सह-पायलट की तरह है: हल करने से पहले, दौरान और बाद में 3 महत्वपूर्ण सवाल पूछकर गलतियों को शून्य करें!",
          "gu": "જ્યારે આપણે વિચાર્યા વગર ઉતાવળ કરીએ છીએ, ત્યારે મગજ વાસ્તવિકતા ચકાસવાનું ભૂલી જાય છે. 'જાતને પ્રશ્ન પૂછવા' એ પ્લેનના સહ-પાયલટ જેવું છે: દાખલો ગણતાં પહેલાં, વચ્ચે અને અંતે ૩ પ્રશ્નો પૂછીને ભૂલો સાવ શૂન્ય કરો!"
        },
        "key_takeaway": {
          "en": "3 Co-Pilot Questions: 1) What is target? 2) Does step make sense? 3) Did I answer the full prompt?",
          "hi": "3 सह-पायलट प्रश्न: 1) लक्ष्य क्या है? 2) क्या यह कदम तार्किक है? 3) क्या पूरा उत्तर दे दिया?",
          "gu": "૩ સહ-પાયલટ પ્રશ્નો: ૧) લક્ષ્ય શું છે? ૨) શું આ પગલું તાર્કિક છે? ૩) શું મેં પૂરો જવાબ આપ્યો?"
        }
      },
      {
        "type": "relatable_story",
        "icon": "question_mirror",
        "title": {
          "en": "Meet Sahil",
          "hi": "साहिल से मिलें",
          "gu": "મળો સાહિલને"
        },
        "story": {
          "en": "Sahil got a 2-part exam question: 'A rope is 12m long. 3.5m is cut off. How much is left, and what is the cost of the remaining rope at ₹10 per meter?' Sahil calculated 12 - 3.5 = 8.5m and rushed to the next question! At the last minute, his co-pilot asked: 'Did I answer the whole prompt?' He spotted the missing cost part and added $8.5 \\times 10 = ₹85$!",
          "hi": "साहिल के सामने 2-भागों वाला सवाल आया: '12 मीटर लंबी रस्सी में से 3.5 मीटर काटी गई। कितनी बची, और ₹10 प्रति मीटर की दर से बाकी रस्सी की कीमत क्या होगी?' साहिल ने 12 - 3.5 = 8.5 मीटर निकाला और आगे बढ़ गया! आखिरी मिनट में उसके सह-पायलट ने पूछा: 'क्या पूरा उत्तर दिया?' उसने तुरंत $8.5 \\times 10 = ₹85$ लिखकर पूरे अंक बचाए!",
          "gu": "સાહિલ સામે ૨ ભાગવાળો સવાલ આવ્યો: '૧૨ મીટર દોરડામાંથી ૩.૫ મીટર કાપ્યું. કેટલું વધ્યું, અને ₹૧૦ પ્રતિ મીટરના ભાવે વધેલા દોરડાની કિંમત કેટલી?' સાહિલે ૧૨ - ૩.૫ = ૮.૫ મીટર શોધી આગળ જવા માંડ્યું! છેલ્લી ઘડીએ સહ-પાયલટે પૂછ્યું: 'શું આખો જવાબ આપ્યો?' તેણે તરત $૮.૫ \\times ૧૦ = ₹૮૫$ લખીને પૂરા માર્ક્સ બચાવ્યા!"
        },
        "insight_box": {
          "en": "Sanity Check: Always ask: 'Can a human weigh 800 kg or a book cost ₹5,000,000?' If the number looks ridiculous, re-check calculations.",
          "hi": "तार्किकता जांच: हमेशा पूछें: 'क्या किसी बच्चे का वजन 800 किलो हो सकता है?' यदि उत्तर असंभव लगे तो गणना दोबारा जांचें।",
          "gu": "વાસ્તવિકતા ચકાસણી: હંમેશાં પૂછો: 'શું કોઈ બાળકનું વજન ૮૦૦ કિલો હોઈ શકે?' જો જવાબ અસંભવ લાગે તો ગણતરી ફરી ચકાસો."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "question_mirror",
        "question": {
          "en": "When you finish calculating a word problem about calculating the age of a Class 5 student and get the answer '142 years old', what should your internal co-pilot do?",
          "hi": "जब आप कक्षा 5 के छात्र की उम्र का सवाल हल करते हैं और उत्तर '142 वर्ष' आता है, तो आपके आंतरिक सह-पायलट को क्या करना चाहिए?",
          "gu": "જ્યારે તમે ધોરણ ૫ ના વિદ્યાર્થીની ઉંમરનો દાખલો ગણો અને જવાબ '૧૪૨ વર્ષ' આવે, ત્યારે તમારા સહ-પાયલટે શું કરવું જોઈએ?"
        },
        "option_a": {
          "en": "Trigger a Reality Check: 'A 5th grader cannot be 142 years old—I must have multiplied instead of subtracted!' and re-calculate.",
          "hi": "वास्तविकता जांच सक्रिय करें: 'कक्षा 5 का बच्चा 142 साल का नहीं हो सकता—मैंने घटाने की जगह गुणा कर दिया होगा!' और दोबारा गणना करें।",
          "gu": "વાસ્તવિકતા ચકાસો: 'ધોરણ ૫ નો વિદ્યાર્થી ૧૪૨ વર્ષનો ન હોઈ શકે—મેં બાદબાકીને બદલે ગુણાકાર કર્યો હશે!' અને ફરી ગણો."
        },
        "option_b": {
          "en": "Write 142 on the test paper and smile happily.",
          "hi": "टेस्ट पेपर पर 142 लिखकर खुशी-खुशी आगे बढ़ जाएं।",
          "gu": "પેપરમાં ૧૪૨ લખીને ખુશ થઈને આગળ વધી જાઓ."
        },
        "feedback": {
          "en": "Correct! Self-questioning prevents submitting mathematically impossible answers.",
          "hi": "सही! स्व-प्रश्न पूछने से असंभव और बेतुके उत्तर जमा करने से बचा जा सकता है।",
          "gu": "સાચું! જાતને પ્રશ્ન પૂછવાથી અસંભવ અને હાસ્યાસ્પદ જવાબો લખવાથી બચી શકાય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "question_mirror",
        "question": {
          "en": "A recipe uses 250ml milk for 4 pancakes. You need to make 12 pancakes. \nCo-Pilot Step 1: 'What is the scale multiplier?' (12 ÷ 4 = 3). \nCo-Pilot Step 2: 'What is the operation?' (250 × 3 = 750ml). \nCo-Pilot Step 3: 'Does 750ml make sense for 12 pancakes?'",
          "hi": "एक रेसिपी में 4 पैनकेक के लिए 250ml दूध लगता है। आपको 12 पैनकेक बनाने हैं। \nसह-पायलट 1: 'कितने गुना बनाना है?' (12 ÷ 4 = 3)। \nसह-पायलट 2: 'क्रिया क्या है?' (250 × 3 = 750ml)। \nसह-पायलट 3: 'क्या 12 पैनकेक के लिए 750ml दूध तार्किक है?'",
          "gu": "એક રેસિપીમાં ૪ પેનકેક માટે ૨૫૦ml દૂધ જોઈએ. તમારે ૧૨ પેનકેક બનાવવાં છે. \nસહ-પાયલટ ૧: 'કેટલા ગણું કરવું પડે?' (૧૨ ÷ ૪ = ૩). \nસહ-પાયલટ ૨: 'ગણતરી શું થાય?' (૨૫૦ × ૩ = ૭૫૦ml). \nસહ-પાયલટ ૩: 'શું ૧૨ પેનકેક માટે ૭૫૦ml દૂધ તાર્કિક છે?'"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Yes, exactly 750ml (since 3 times more pancakes require 3 times more milk)",
              "hi": "हाँ, बिल्कुल 750ml (क्योंकि 3 गुना अधिक पैनकेक के लिए 3 गुना अधिक दूध चाहिए)",
              "gu": "હા, બરાબર ૭૫૦ml (કારણ કે ૩ ગણાં પેનકેક માટે ૩ ગણું દૂધ જોઈએ)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "No, 250ml is enough for any number",
              "hi": "नहीं, किसी भी संख्या के लिए 250ml ही काफी है",
              "gu": "ના, ગમે તેટલા પેનકેક માટે ૨૫૦ml જ પૂરતું છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "12,000 liters of milk",
              "hi": "12,000 लीटर दूध",
              "gu": "૧૨,૦૦૦ લિટર દૂધ"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "10ml milk",
              "hi": "10ml दूध",
              "gu": "૧૦ml દૂધ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The co-pilot verified both the multiplier ratio (3x) and the mathematical sanity of 750ml!",
          "hi": "शानदार! सह-पायलट ने 3 गुना अनुपात और 750ml की तार्किकता दोनों की पुष्टि की!",
          "gu": "એકદમ સાચું! સહ-પાયલટે ૩ ગણા ગુણોત્તર અને ૭૫૦ml ની વાસ્તવિકતા બંને ચકાસી લીધા!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "question_mirror",
        "title": {
          "en": "Internal Co-Pilot Superpower",
          "hi": "आंतरिक सह-पायलट सुपरपावर",
          "gu": "આંતરિક સહ-પાયલટ સુપરપાવર"
        },
        "body": {
          "en": "Run mental check-in questions before, during, and after every problem to ensure perfection.",
          "hi": "हर सवाल के पहले, दौरान और बाद में सवाल पूछकर अपनी सोच को हमेशा सही दिशा दें।",
          "gu": "દરેક દાખલાના પહેલાં, વચ્ચે અને છેલ્લે પ્રશ્નો પૂછીને તમારી વિચારસરણીને સાચી દિશા આપો."
        },
        "tags": [
          {
            "en": "Internal Co-Pilot",
            "hi": "आंतरिक सह-पायलट",
            "gu": "આંતરિક સહ-પાયલટ"
          },
          {
            "en": "What am I finding?",
            "hi": "लक्ष्य क्या है?",
            "gu": "હું શું શોધું છું?"
          },
          {
            "en": "Sanity Check",
            "hi": "तार्किकता जांच",
            "gu": "વાસ્તવિકતા ચકાસણી"
          },
          {
            "en": "Did I finish all?",
            "hi": "क्या सब पूरा हुआ?",
            "gu": "શું બધું પૂરું થયું?"
          },
          {
            "en": "No Silly Mistakes",
            "hi": "शून्य सिली गलतियाँ",
            "gu": "શૂન્ય સિલી ભૂલો"
          },
          {
            "en": "Active Monitor",
            "hi": "सक्रिय निगरानी",
            "gu": "સક્રિય મોનિટરિંગ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "question_mirror",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Before starting, ask: 'What exact target quantity/unit is this question asking for?'",
              "hi": "शुरू करने से पहले पूछें: 'यह सवाल मुझसे वास्तव में कौन सी संख्या या इकाई मांग रहा है?'",
              "gu": "શરૂ કરતાં પહેલાં પૂછો: 'આ સવાલ મારી પાસે ખરેખર કઈ રકમ કે એકમ માંગે છે?'"
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "During solving, ask: 'Does my intermediate calculation make logical sense?'",
              "hi": "हल करते समय पूछें: 'क्या मेरी बीच की गणना तार्किक और उचित लग रही है?'",
              "gu": "ગણતરી કરતી વખતે પૂછો: 'શું મારી વચ્ચેની ગણતરી તાર્કિક અને યોગ્ય લાગે છે?'"
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "After getting the answer, ask: 'Is this number physically realistic in the real world?'",
              "hi": "उत्तर मिलने के बाद पूछें: 'क्या यह संख्या वास्तविक दुनिया में संभव है?'",
              "gu": "જવાબ મળ્યા પછી પૂછો: 'શું આ સંખ્યા વાસ્તવિક દુનિયામાં શક્ય છે?'"
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Final scan: 'Did I answer every sub-part and write the correct units (cm, kg, ₹)?'",
              "hi": "अंतिम जांच: 'क्या मैंने सभी उप-भागों का उत्तर दिया और सही इकाइयाँ (cm, kg, ₹) लिखीं?'",
              "gu": "છેલ્લી ચકાસણી: 'શું મેં બધા પેટા-પ્રશ્નોના ઉત્તર આપ્યા અને સાચા એકમો (cm, kg, ₹) લખ્યા?'"
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "question_mirror",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "On 3 math or science problems today, pause right before submitting and ask: 'Does this answer make real-world sense and did I write the unit?'",
          "hi": "आज 3 गणित या विज्ञान के सवालों में उत्तर लिखने से पहले पूछें: 'क्या यह उत्तर तार्किक है और क्या मैंने इकाई लिखी है?'",
          "gu": "આજે ગણિત કે વિજ્ઞાનના ૩ દાખલામાં જવાબ લખતાં પહેલાં પૂછો: 'શું આ જવાબ વાસ્તવિક છે અને મેં એકમ લખ્યો છે?'"
        },
        "commitment_button_text": {
          "en": "I will activate my internal co-pilot!",
          "hi": "मैं अपना आंतरिक सह-पायलट चालू रखूँगा!",
          "gu": "હું મારો આંતરિક સહ-પાયલટ સક્રિય રાખીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c5_191",
    "methodNumber": 191,
    "classLevel": 5,
    "category": {
      "en": "Higher-Level Cognitive Strategies",
      "hi": "उच्च-स्तरीय संज्ञानात्मक रणनीतियाँ",
      "gu": "ઉચ્ચ-સ્તરીય જ્ઞાનાત્મક વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Decomposition (Lego Brick Breakdown)",
      "hi": "विघटन (लेगो ब्लॉक में तोड़ना)",
      "gu": "વિભાજન (લેગો બ્લોકમાં તોડવું)"
    },
    "description": {
      "en": "Conquer giant, intimidating multi-step projects and complex geometry problems by breaking them down into tiny, bite-sized manageable Lego bricks.",
      "hi": "विशाल प्रोजेक्ट्स और जटिल ज्यामितीय सवालों को छोटे-छोटे, प्रबंधनीय लेगो ब्लॉक्स में तोड़कर आसानी से हल करें।",
      "gu": "વિશાળ પ્રોજેક્ટ્સ અને અટપટા ભૂમિતિના દાખલાઓને નાના-નાના, સરળ લેગો બ્લોક્સમાં વિભાજિત કરીને સહેલાઈથી ઉકેલો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "breakdown_blocks",
        "title": {
          "en": "Frozen by Giant Projects and Monster Math Shapes?",
          "hi": "विशाल प्रोजेक्ट और जटिल आकृतियाँ देखकर दिमाग सुन्न हो जाता है?",
          "gu": "મોટા પ્રોજેક્ટ્સ અને વિચિત્ર ભૌમિતિક આકારો જોઈને ડરી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "When the teacher assigns a 2-week Science exhibition model, I get overwhelmed and procrastinate until the final night!",
            "hi": "जब 2-सप्ताह का विज्ञान मॉडल मिलता है, तो मैं घबरा जाता हूँ और आखिरी रात तक टालता रहता हूँ!",
            "gu": "જ્યારે ૨ અઠવાડિયાનો વિજ્ઞાન પ્રોજેક્ટ મળે, ત્યારે હું ડરી જાઉં છું અને છેલ્લી રાત સુધી કામ ટાળ્યા કરું છું!"
          },
          {
            "en": "When finding the area of an irregular L-shaped or T-shaped figure, I freeze because there's no single formula for it!",
            "hi": "जब L-आकार या T-आकार की अनियमित आकृति का क्षेत्रफल निकालना होता है, तो कोई सीधा सूत्र न होने से मैं अटक जाता हूँ!",
            "gu": "જ્યારે L-આકાર કે T-આકારની વિચિત્ર આકૃતિનું ક્ષેત્રફળ શોધવાનું હોય, ત્યારે કોઈ સીધું સૂત્ર ન હોવાથી હું અટવાઈ જાઉં છું!"
          }
        ],
        "body": {
          "en": "Monster tasks feel impossible because our working memory tries to swallow the entire mountain in one gulp. 'Decomposition' is the master skill of computer scientists and engineers: break any giant problem down into tiny, simple Lego bricks, solve each brick one by one, and assemble the victory!",
          "hi": "विशाल कार्य इसलिए असंभव लगते हैं क्योंकि हमारा दिमाग पूरे पहाड़ को एक घूंट में निगलने की कोशिश करता है। 'विघटन' वैज्ञानिकों की गुप्त सुपरपावर है: किसी भी बड़ी समस्या को छोटे-छोटे लेगो ब्लॉक्स में तोड़ें, एक-एक करके हल करें और जीत हासिल करें!",
          "gu": "મોટા કામ એટલા માટે અઘરા લાગે છે કારણ કે આપણું મગજ આખા પહાડને એક જ ઘૂંટડામાં ગળવાનો પ્રયત્ન કરે છે. 'વિભાજન' એ વૈજ્ઞાનિકોની ગુપ્ત શક્તિ છે: કોઈપણ મોટી સમસ્યાને નાના લેગો બ્લોક્સમાં તોડો, એક પછી એક ઉકેલો અને સરળતાથી સફળ થાઓ!"
        },
        "key_takeaway": {
          "en": "Lego Rule: Monster Problem $\\rightarrow$ Slice into 3 Simple Bricks $\\rightarrow$ Solve each brick $\\rightarrow$ Combine!",
          "hi": "लेगो नियम: विशाल समस्या $\\rightarrow$ 3 सरल टुकड़ों में तोड़ें $\\rightarrow$ हर टुकड़े को हल करें $\\rightarrow$ जोड़कर जीतें!",
          "gu": "લેગો નિયમ: મોટી સમસ્યા $\\rightarrow$ ૩ સરળ ટુકડામાં વહેંચો $\\rightarrow$ દરેક ટુકડો ઉકેલો $\\rightarrow$ ભેગા કરીને જીતો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "breakdown_blocks",
        "title": {
          "en": "Meet Riya",
          "hi": "रिया से मिलें",
          "gu": "મળો રિયાને"
        },
        "story": {
          "en": "Riya had to find the area of an irregular 8-sided compound shape. She panicked because textbooks only teach rectangle and triangle formulas. Then she decomposed the shape: she drew two dotted lines, splitting it into 2 simple rectangles and 1 right triangle! She calculated the 3 tiny areas ($20 + 30 + 10$) and found the total area 60 $cm^2$ in 20 seconds flat.",
          "hi": "रिया को एक 8-भुजाओं वाली अनियमित आकृति का क्षेत्रफल निकालना था। वह घबरा गई क्योंकि किताब में सिर्फ आयत और त्रिभुज का सूत्र था। फिर उसने आकृति को तोड़ा: दो बिंदूदार रेखाएं खींचकर उसे 2 सरल आयतों और 1 त्रिभुज में बाँट दिया! उसने तीनों छोटे क्षेत्रफलों ($20 + 30 + 10$) को जोड़कर 60 $cm^2$ तुरंत निकाल लिया।",
          "gu": "રિયાને ૮-બાજુવાળી વિચિત્ર આકૃતિનું ક્ષેત્રફળ શોધવાનું હતું. તે ગભરાઈ ગઈ કારણ કે પુસ્તકમાં માત્ર લંબચોરસ અને ત્રિકોણના જ સૂત્રો હતા. પછી તેણે આકૃતિનું વિભાજન કર્યું: બે તૂટક રેખાઓ દોરીને તેને ૨ સરળ લંબચોરસ અને ૧ ત્રિકોણમાં વહેંચી દીધી! તેણે ત્રણેય નાના ક્ષેત્રફળો ($૨૦ + ૩૦ + ૧૦$) ઉમેરીને ૬૦ $cm^2$ સેકન્ડોમાં શોધી લીધું."
        },
        "insight_box": {
          "en": "Divide and Conquer: No problem is too hard if you divide it into small enough pieces.",
          "hi": "विभाजन और विजय: कोई भी समस्या बहुत कठिन नहीं है यदि आप उसे पर्याप्त छोटे टुकड़ों में बाँट लें।",
          "gu": "વિભાજન અને વિજય: કોઈપણ સમસ્યા અઘરી નથી જો તમે તેને પૂરતા નાના ટુકડાઓમાં વહેંચી નાખો."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "breakdown_blocks",
        "question": {
          "en": "How do you calculate the area of an irregular compound L-shaped room?",
          "hi": "एक L-आकार के अनियमित कमरे का क्षेत्रफल कैसे निकाला जाता है?",
          "gu": "L-આકારના અનિયમિત રૂમનું ક્ષેત્રફળ કેવી રીતે શોધશો?"
        },
        "option_a": {
          "en": "Decompose the L-shape with a cut line into two simple rectangles, find the area of each, and add them together.",
          "hi": "L-आकार को एक रेखा खींचकर दो सरल आयतों में तोड़ें, दोनों का क्षेत्रफल अलग निकालें और उन्हें जोड़ दें।",
          "gu": "L-આકારને એક લીટી દોરીને બે સરળ લંબચોરસમાં વહેંચો, બંનેનું ક્ષેત્રફળ શોધો અને તેમનો સરવાળો કરો."
        },
        "option_b": {
          "en": "Multiply all 6 outer wall lengths together at once.",
          "hi": "सभी 6 बाहरी दीवारों की लंबाई को एक साथ गुणा कर दें।",
          "gu": "બધી ૬ બહારની દીવાલોની લંબાઈનો એક સાથે ગુણાકાર કરી દો."
        },
        "feedback": {
          "en": "Correct! Decomposition converts an unsolvable irregular shape into basic elementary rectangles.",
          "hi": "सही! विघटन एक कठिन अनियमित आकृति को बुनियादी सरल आयतों में बदल देता है।",
          "gu": "સાચું! વિભાજન પદ્ધતિ અઘરી વિચિત્ર આકૃતિને પાયાના સરળ લંબચોરસમાં ફેરવી આપે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "breakdown_blocks",
        "question": {
          "en": "You have a large 10-page Social Studies history project due in 5 days. How does decomposition make this effortless and stress-free?",
          "hi": "आपको 5 दिनों में सामाजिक विज्ञान का 10 पृष्ठों का बड़ा इतिहास प्रोजेक्ट जमा करना है। विघटन इसे तनावमुक्त कैसे बनाता है?",
          "gu": "તમારે ૫ દિવસમાં સામાજિક વિજ્ઞાનનો ૧૦ પેજનો મોટો ઇતિહાસ પ્રોજેક્ટ જમા કરાવવાનો છે. વિભાજન તેને ભારમુક્ત કેવી રીતે બનાવે છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Decompose into a daily milestone: Complete 2 pages every afternoon (2 pages × 5 days = 10 pages)",
              "hi": "दैनिक लक्ष्य में तोड़ें: हर दोपहर केवल 2 पृष्ठ पूरे करें (2 पृष्ठ × 5 दिन = 10 पृष्ठ)",
              "gu": "દૈનિક લક્ષ્યમાં વહેંચો: દરરોજ બપોરે માત્ર ૨ પેજ પૂરાં કરો (૨ પેજ × ૫ દિવસ = ૧૦ પેજ)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Wait until the 5th night and stay awake for 12 hours straight panicking",
              "hi": "5वीं रात तक इंतज़ार करें और घबराहट में लगातार 12 घंटे जागें",
              "gu": "૫મી રાત સુધી રાહ જુઓ અને ગભરાટમાં આખી રાત જાગો"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Copy 10 random pages from an old dictionary",
              "hi": "पुरानी डिक्शनरी से 10 यादृच्छिक पृष्ठ कॉपी कर लें",
              "gu": "જૂની ડિક્શનરીમાંથી ૧૦ પેજ જેમ તેમ ઉતારી લો"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Give up and tell the teacher you lost your notebook",
              "hi": "हार मान लें और शिक्षक से कहें कि कॉपी खो गई है",
              "gu": "હિંમત હારી જાઓ અને શિક્ષકને કહો કે નોટબુક ખોવાઈ ગઈ છે"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Breaking a 10-page mountain into 2 pages per day eliminates stress and guarantees peak quality!",
          "hi": "शानदार! 10 पृष्ठों के पहाड़ को प्रतिदिन 2 पृष्ठों में तोड़ने से तनाव दूर होता है और काम बेहतरीन होता है!",
          "gu": "એકદમ સાચું! ૧૦ પેજના પહાડને રોજના ૨ પેજમાં વહેંચવાથી ચિંતા દૂર થાય છે અને કામ શ્રેષ્ઠ બને છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "breakdown_blocks",
        "title": {
          "en": "Decomposition Superpower",
          "hi": "विघटन सुपरपावर",
          "gu": "વિભાજન સુપરપાવર"
        },
        "body": {
          "en": "Slice overwhelming challenges into bite-sized atomic pieces to conquer them effortlessly.",
          "hi": "बड़ी चुनौतियों को छोटे-छोटे टुकड़ों में काटकर आसानी से फतह करें।",
          "gu": "મોટા પડકારોને નાના-નાના ટુકડાઓમાં વહેંચીને સહેલાઈથી પાર પાડો."
        },
        "tags": [
          {
            "en": "Lego Breakdown",
            "hi": "लेगो विभाजन",
            "gu": "લેગો વિભાજન"
          },
          {
            "en": "Divide & Conquer",
            "hi": "बांटो और जीतो",
            "gu": "ભાગલા પાડીને જીતો"
          },
          {
            "en": "Compound Shapes",
            "hi": "जटिल आकृतियाँ",
            "gu": "સંયુક્ત આકારો"
          },
          {
            "en": "Daily Milestones",
            "hi": "दैनिक मील के पत्थर",
            "gu": "દૈનિક લક્ષ્યો"
          },
          {
            "en": "Zero Overwhelm",
            "hi": "शून्य तनाव",
            "gu": "શૂન્ય ગભરાટ"
          },
          {
            "en": "Atomic Sub-Tasks",
            "hi": "छोटे उप-कार्य",
            "gu": "નાના પેટા-કાર્યો"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "breakdown_blocks",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Look at the giant task or complex shape and identify where natural cut-lines exist.",
              "hi": "विशाल कार्य या जटिल आकृति को देखें और पहचानें कि कहाँ स्वाभाविक विभाजन रेखाएँ हैं।",
              "gu": "મોટા કામ કે જટિલ આકારને જુઓ અને ઓળખો કે ક્યાંથી સરળ ટુકડા કરી શકાય તેમ છે."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Slice the monster into 3 to 4 tiny, bite-sized sub-tasks or basic elementary shapes.",
              "hi": "समस्या को 3 से 4 छोटे उप-कार्यों या बुनियादी सरल आकृतियों में विभाजित करें।",
              "gu": "સમસ્યાને ૩ થી ૪ નાના પેટા-કાર્યો કે પાયાના સરળ આકારોમાં વિભાજિત કરો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Solve or execute each small piece one by one with 100% focus.",
              "hi": "पूरे ध्यान के साथ एक-एक करके हर छोटे टुकड़े को हल या पूरा करें।",
              "gu": "સંપૂર્ણ ધ્યાન સાથે એક પછી એક દરેક નાના ટુકડાને ઉકેલો કે પૂર્ણ કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Combine all sub-solutions together to complete the master puzzle or project.",
              "hi": "मुख्य पहेली या प्रोजेक्ट को पूरा करने के लिए सभी उप-परिणामों को एक साथ जोड़ें।",
              "gu": "મુખ્ય કોયડો કે પ્રોજેક્ટ પૂરો કરવા માટે બધા પેટા-પરિણામોને એક સાથે જોડી દો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "breakdown_blocks",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Take your biggest homework assignment or messy room cleanup today, break it down into 3 numbered mini-tasks on paper, and check them off one by one!",
          "hi": "आज अपने सबसे बड़े गृहकार्य या कमरे की सफाई को कागज पर 3 छोटे कार्यों में बाँटें और एक-एक करके पूरा करें!",
          "gu": "આજે તમારા સૌથી મોટા હોમવર્ક કે રૂમની સફાઈને કાગળ પર ૩ નાના કામોમાં વહેંચો અને એક પછી એક પૂરાં કરો!"
        },
        "commitment_button_text": {
          "en": "I will decompose big problems into Lego bricks!",
          "hi": "मैं बड़ी समस्याओं को लेगो ब्लॉक में तोड़ूँगा!",
          "gu": "હું મોટી સમસ્યાઓને લેગો બ્લોકમાં વહેંચીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  }
];
