// ============================================================================
// CLASS 6 NEUROPLAY MICRO-LESSONS (ALL BATCHES: 1, 2, 3 & 4)
// Consolidated Single-Module Architecture for Class 6
// ============================================================================

export const class6Skills = [
  {
    "id": "skill_c6_08",
    "methodNumber": 8,
    "classLevel": 6,
    "category": {
      "en": "Mental Maths / Calculation Strategies",
      "hi": "मानसिक गणित / गणना रणनीतियाँ",
      "gu": "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Russian Peasant Multiplication (Halving & Doubling)",
      "hi": "रूसी किसान गुणन विधि (आधा और दोगुना)",
      "gu": "રશિયન ખેડૂત ગુણાકાર પદ્ધતિ (અડધું અને બમણું)"
    },
    "description": {
      "en": "Multiply large multi-digit numbers with only basic division by 2 and doubling—no 2-digit times tables or long vertical carry-overs required.",
      "hi": "केवल 2 से भाग और दोगुना करके बड़ी संख्याओं का गुणा करें—बिना 2-अंकीय पहाड़े या लंबे हासिल की उलझन के।",
      "gu": "માત્ર ૨ વડે ભાગાકાર અને બમણા કરીને મોટી સંખ્યાઓનો ગુણાકાર કરો—મોટા ઘડિયા કે લાંબી વદ્દીની માથાકૂટ વગર."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "halving_doubling",
        "title": {
          "en": "Dreading Long Multi-Digit Multiplication Columns?",
          "hi": "दो अंकों के लंबे गुणन स्तम्भों से डर लगता है?",
          "gu": "બે અંકના લાંબા ગુણાકારના દાખલાઓથી ડર લાગે છે?"
        },
        "pain_quotes": [
          {
            "en": "Multiplying 18 × 24 traditional way takes 6 lines of messy scratch work and one wrong carry ruins the entire answer!",
            "hi": "18 × 24 का पारंपरिक गुणा करने में 6 लाइनें भर जाती हैं और एक गलत हासिल पूरा उत्तर बिगाड़ देता है!",
            "gu": "૧૮ × ૨૪ નો સામાન્ય ગુણાકાર કરવામાં ૬ લાઇન ભરાઈ જાય છે અને એક ખોટી વદ્દી આખો જવાબ બગાડી નાખે છે!"
          },
          {
            "en": "I don't know my 18 times table, so I get stuck in multi-digit tests!",
            "hi": "मुझे 18 का पहाड़ा याद नहीं है, इसलिए परीक्षा में बड़े सवालों में अटक जाता हूँ!",
            "gu": "મને ૧૮ નો ઘડિયો નથી આવડતો, તેથી પરીક્ષામાં મોટા દાખલાઓમાં અટવાઈ જાઉં છું!"
          }
        ],
        "body": {
          "en": "You don't need giant times tables to multiply big numbers. The ancient 'Russian Peasant' method uses only two kindergarten skills: HALVE the left number and DOUBLE the right number. Cross out even-left rows and add the rest!",
          "hi": "बड़ी संख्याओं के गुणा के लिए बड़े पहाड़ों की जरूरत नहीं है। प्राचीन 'रूसी किसान विधि' केवल दो आसान कौशलों का उपयोग करती है: बाईं संख्या को आधा करें और दाईं संख्या को दोगुना करें। सम (even) बाईं पंक्तियों को काटें और बाकी को जोड़ लें!",
          "gu": "મોટા ગુણાકાર માટે મોટા ઘડિયા યાદ રાખવાની જરૂર નથી. પ્રાચીન 'રશિયન ખેડૂત પદ્ધતિ' માત્ર બે સરળ બાબતો વાપરે છે: ડાબી સંખ્યા અડધી કરો અને જમણી સંખ્યા બમણી કરો. બેકી (even) ડાબી લાઈનો કાપો અને બાકીની લાઈનો ઉમેરો!"
        },
        "key_takeaway": {
          "en": "Peasant Rule: Halve Left $\\rightarrow$ Double Right $\\rightarrow$ Strike Even Rows $\\rightarrow$ Sum the Survivors!",
          "hi": "किसान नियम: बायां आधा $\\rightarrow$ दायां दोगुना $\\rightarrow$ सम पंक्तियाँ काटें $\\rightarrow$ बची संख्याओं को जोड़ें!",
          "gu": "ખેડૂત નિયમ: ડાબું અડધું $\\rightarrow$ જમણું બમણું $\\rightarrow$ બેકી લાઇન કાપો $\\rightarrow$ વધેલી સંખ્યાઓનો સરવાળો કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "halving_doubling",
        "title": {
          "en": "Meet Ishaan",
          "hi": "ईशान से मिलें",
          "gu": "મળો ઈશાનને"
        },
        "story": {
          "en": "Ishaan was challenged to solve 18 × 25 without standard column math. He wrote two columns: Halving 18 $\\rightarrow$ 9 $\\rightarrow$ 4 $\\rightarrow$ 2 $\\rightarrow$ 1. Doubling 25 $\\rightarrow$ 50 $\\rightarrow$ 100 $\\rightarrow$ 200 $\\rightarrow$ 400. Striking out even rows (18, 4, 2), he had 50 + 400 = 450! He solved it in 8 seconds.",
          "hi": "ईशान को बिना लंबे गुणन के 18 × 25 हल करने की चुनौती मिली। उसने दो कॉलम लिखे: 18 का आधा $\\rightarrow$ 9 $\\rightarrow$ 4 $\\rightarrow$ 2 $\\rightarrow$ 1। 25 का दोगुना $\\rightarrow$ 50 $\\rightarrow$ 100 $\\rightarrow$ 200 $\\rightarrow$ 400। सम पंक्तियाँ (18, 4, 2) काटकर बचा 50 + 400 = 450! उसने 8 सेकंड में उत्तर निकाल लिया।",
          "gu": "ઈશાનને લાંબા ગુણાકાર વગર ૧૮ × ૨૫ ઉકેલવાનો પડકાર મળ્યો. તેણે બે લાઇન બનાવી: ૧૮ નું અડધું $\\rightarrow$ ૯ $\\rightarrow$ ૪ $\\rightarrow$ ૨ $\\rightarrow$ ૧. ૨૫ ના બમણા $\\rightarrow$ ૫૦ $\\rightarrow$ ૧૦૦ $\\rightarrow$ ૨૦૦ $\\rightarrow$ ૪૦૦. બેકી લાઇન (૧૮, ૪, ૨) કાપીને વધ્યા ૫૦ + ૪૦૦ = ૪૫૦! તેણે ૮ સેકન્ડમાં દાખલો ગણી નાખ્યો."
        },
        "insight_box": {
          "en": "Binary Magic: When halving an odd number (like 9), drop the fraction remainder (9 ÷ 2 = 4).",
          "hi": "बाइनरी नियम: विषम संख्या (जैसे 9) को आधा करते समय दशमलव छोड़ दें (9 ÷ 2 = 4)।",
          "gu": "બાઈનરી નિયમ: એકી સંખ્યા (જેમ કે ૯) ને અડધી કરતી વખતે પોઈન્ટ ગણવો નહીં (૯ ÷ ૨ = ૪)."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "halving_doubling",
        "question": {
          "en": "When halving numbers in Russian Peasant Multiplication, what do you do with odd numbers like 13?",
          "hi": "रूसी किसान विधि में संख्याओं को आधा करते समय, 13 जैसी विषम संख्या मिलने पर क्या करते हैं?",
          "gu": "રશિયન ખેડૂત પદ્ધતિમાં સંખ્યા અડધી કરતી વખતે, ૧૩ જેવી એકી સંખ્યા આવે ત્યારે શું કરવું?"
        },
        "option_a": {
          "en": "Write 6.5 and give up on mental math.",
          "hi": "6.5 लिखें और मानसिक गणित छोड़ दें।",
          "gu": "૬.૫ લખો અને માનસિક ગણતરી છોડી દો."
        },
        "option_b": {
          "en": "Drop the remainder and simply write 6 (since $13 \\div 2 = 6$ remainder 1).",
          "hi": "शेषफल को छोड़ दें और केवल 6 लिखें (क्योंकि $13 \\div 2 = 6$ शेष 1)।",
          "gu": "શેષ અવગણીને ફક્ત ૬ લખો (કારણ કે ૧૩ ÷ ૨ = ૬ અને શેષ ૧ વધે)."
        },
        "feedback": {
          "en": "Correct! Always round down to the nearest whole integer when halving odd numbers.",
          "hi": "सही! विषम संख्या को आधा करते समय हमेशा नीचे के पूर्णांक (floor value) को लेते हैं।",
          "gu": "સાચું! એકી સંખ્યાને અડધી કરતી વખતે હંમેશાં પૂર્ણાંક સંખ્યા જ લેવી."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "halving_doubling",
        "question": {
          "en": "Solve $14 \\times 15$ using Russian Peasant Multiplication:\nLeft (Halve): 14 (Even ❌), 7 (Odd ✅), 3 (Odd ✅), 1 (Odd ✅)\nRight (Double): 15, 30, 60, 120\nWhat is the final sum of the odd-row right numbers?",
          "hi": "रूसी किसान विधि से $14 \\times 15$ हल करें:\nबायां (आधा): 14 (सम ❌), 7 (विषम ✅), 3 (विषम ✅), 1 (विषम ✅)\nदायां (दोगुना): 15, 30, 60, 120\nविषम पंक्तियों की दाईं संख्याओं का योग क्या है?",
          "gu": "રશિયન ખેડૂત પદ્ધતિથી $૧૪ \\times ૧૫$ ગણો:\nડાબું (અડધું): ૧૪ (બેકી ❌), ૭ (એકી ✅), ૩ (એકી ✅), ૧ (એકી ✅)\nજમણું (બમણું): ૧૫, ૩૦, ૬૦, ૧૨૦\nએકી લાઇનવાળી જમણી સંખ્યાઓનો સરવાળો કેટલો થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "210 (30 + 60 + 120 = 210)",
              "hi": "210 (30 + 60 + 120 = 210)",
              "gu": "૨૧૦ (૩૦ + ૬૦ + ૧૨૦ = ૨૧૦)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "225",
              "hi": "225",
              "gu": "૨૨૫"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "195",
              "hi": "195",
              "gu": "૧૯૫"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "240",
              "hi": "240",
              "gu": "૨૪૦"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Row 14 is even (drop 15). Rows 7, 3, 1 are odd: 30 + 60 + 120 = 210!",
          "hi": "शानदार! पंक्ति 14 सम है (15 छोड़ें)। पंक्ति 7, 3, 1 विषम हैं: 30 + 60 + 120 = 210!",
          "gu": "એકદમ સાચું! લાઇન ૧૪ બેકી છે (૧૫ છોડો). લાઇન ૭, ૩, ૧ એકી છે: ૩૦ + ૬૦ + ૧૨૦ = ૨૧૦!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "halving_doubling",
        "title": {
          "en": "Peasant Multiplier Superpower",
          "hi": "किसान गुणन सुपरपावर",
          "gu": "ખેડૂત ગુણાકાર સુપરપાવર"
        },
        "body": {
          "en": "Halve left repeatedly and double right; eliminate even-left rows and sum the rest.",
          "hi": "बाईं संख्या को आधा और दाईं को दोगुना करें; सम पंक्तियों को हटाकर शेष को जोड़ें।",
          "gu": "ડાબી સંખ્યા અડધી અને જમણી બમણી કરો; બેકી લાઇન કાપીને બાકીની લાઈનો ઉમેરો."
        },
        "tags": [
          {
            "en": "Halve Left",
            "hi": "बायां आधा",
            "gu": "ડાબું અડધું"
          },
          {
            "en": "Double Right",
            "hi": "दायां दोगुना",
            "gu": "જમણું બમણું"
          },
          {
            "en": "Drop Odd Remainders",
            "hi": "शेषफल छोड़ें",
            "gu": "શેષ અવગણો"
          },
          {
            "en": "Strike Even Rows",
            "hi": "सम पंक्तियाँ काटें",
            "gu": "બેકી લાઇન કાપો"
          },
          {
            "en": "Sum Survivors",
            "hi": "शेष को जोड़ें",
            "gu": "બાકીનો સરવાળો"
          },
          {
            "en": "No Times Tables",
            "hi": "बिना पहाड़े",
            "gu": "ઘડિયા મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "halving_doubling",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Write the two numbers side by side at the top of two columns (A and B).",
              "hi": "दो कॉलम (A और B) के शीर्ष पर दोनों संख्याओं को अगल-बगल लिखें।",
              "gu": "બે ખાના (A અને B) બનાવી ઉપર બંને સંખ્યાઓને સામસામે લખો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Repeatedly divide column A by 2 (dropping decimals) until you reach 1.",
              "hi": "कॉलम A को 1 आने तक लगातार 2 से भाग देते रहें (दशमलव छोड़ते हुए)।",
              "gu": "ખાના A ને ૧ ન આવે ત્યાં સુધી સતત ૨ વડે ભાગતા રહો (પોઇન્ટ ગણ્યા વગર)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Repeatedly double column B for every corresponding row in column A.",
              "hi": "कॉलम A की प्रत्येक पंक्ति के सामने कॉलम B की संख्या को दोगुना करते जाएं।",
              "gu": "ખાના A ની દરેક લાઇન સામે ખાના B ની સંખ્યાને સતત બમણી કરતા જાઓ."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Cross out rows where column A is an EVEN number, then add the surviving numbers in column B.",
              "hi": "जहाँ कॉलम A में सम संख्या हो उस पंक्ति को काटें, फिर कॉलम B के बचे नंबरों को जोड़ें।",
              "gu": "જ્યાં ખાના A માં બેકી સંખ્યા હોય તે લાઇન કાપો, પછી ખાના B ની વધેલી સંખ્યાઓનો સરવાળો કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "halving_doubling",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Solve $12 \\times 35$ and $16 \\times 22$ using the Russian Peasant method on a scratch paper in under 30 seconds!",
          "hi": "आज रफ कॉपी पर रूसी किसान विधि से $12 \\times 35$ और $16 \\times 22$ को 30 सेकंड में हल करें!",
          "gu": "આજે રફ કાગળ પર રશિયન ખેડૂત પદ્ધતિથી $૧૨ \\times ૩૫$ અને ૧૬ $\\times ૨૨$ ને ૩૦ સેકન્ડમાં ગણી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will multiply using halving and doubling!",
          "hi": "मैं आधा और दोगुना करके गुणा करूँगा!",
          "gu": "હું અડધું અને બમણું કરીને ગુણાકાર કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_19",
    "methodNumber": 19,
    "classLevel": 6,
    "category": {
      "en": "Mental Maths / Calculation Strategies",
      "hi": "मानसिक गणित / गणना रणनीतियाँ",
      "gu": "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Percentage Shortcuts (10%, 1%, 50% Benchmark Blocks)",
      "hi": "प्रतिशत शॉर्टकट (10%, 1%, 50% बेंचमार्क ब्लॉक)",
      "gu": "ટકાવારી શોર્ટકટ (૧૦%, ૧%, ૫૦% બેન્ચમાર્ક બ્લોક)"
    },
    "description": {
      "en": "Calculate any percentage instantly in your head by combining simple building blocks: 10% (move decimal left 1), 1% (move decimal left 2), and 50% (half).",
      "hi": "सरल बिल्डिंग ब्लॉक्स को मिलाकर दिमाग में कोई भी प्रतिशत तुरंत निकालें: 10% (दशमलव 1 स्थान बाएँ), 1% (दशमलव 2 स्थान बाएँ), और 50% (आधा)।",
      "gu": "સરળ બ્લોક્સ જોડીને કોઈપણ ટકાવારી મગજમાં તરત ગણો: ૧૦% (પોઇન્ટ ૧ સ્થાન ડાબે), ૧% (પોઇન્ટ ૨ સ્થાન ડાબે), અને ૫૦% (અડધું)."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "percent_slice",
        "title": {
          "en": "Stuck Doing Long Division for Percentages?",
          "hi": "प्रतिशत निकालने में लंबे गुणा-भाग में फंस जाते हैं?",
          "gu": "ટકાવારી શોધવામાં લાંબા ગુણાકાર-ભાગાકારમાં અટવાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "Writing (15 ÷ 100) × 480 takes 2 minutes and I often make decimal division slips!",
            "hi": "(15 ÷ 100) × 480 लिखने में 2 मिनट लगते हैं और अक्सर दशमलव में गलती हो जाती है!",
            "gu": "(૧૫ ÷ ૧૦૦) × ૪૮૦ ગણવામાં ૨ મિનિટ બગડે છે અને પોઇન્ટ મૂકવામાં ભૂલ થાય છે!"
          },
          {
            "en": "Discounts in shopping malls say '35% off ₹800' and I have no idea how much I save without a calculator!",
            "hi": "मॉल में '₹800 पर 35% छूट' देखकर बिना कैलकुलेटर पता ही नहीं चलता कि कितनी बचत होगी!",
            "gu": "દુકાનમાં '₹૮૦૦ પર ૩૫% છૂટ' વાંચીને કેલ્ક્યુલેટર વગર ખબર જ નથી પડતી કે કેટલા રૂપિયા બચશે!"
          }
        ],
        "body": {
          "en": "Percentages are not scary formulas; they are made of friendly Lego blocks! 10% is just moving the decimal point one step left. 1% is moving it two steps left. Combine 10%, 5%, and 1% to calculate ANY percentage in 3 seconds flat!",
          "hi": "प्रतिशत कोई कठिन सूत्र नहीं हैं; वे सरल लेगो ब्लॉक्स जैसे हैं! 10% का मतलब दशमलव को 1 कदम बाएँ खिसकाना है। 1% का मतलब 2 कदम बाएँ खिसकाना है। 10%, 5% और 1% को जोड़कर 3 सेकंड में कोई भी प्रतिशत निकालें!",
          "gu": "ટકાવારી કોઈ અઘરો નિયમ નથી; તે રમકડાના બ્લોક્સ જેવી છે! ૧૦% એટલે પોઇન્ટ ૧ ડગલું ડાબે ખસેડવો. ૧% એટલે ૨ ડગલાં ડાબે ખસેડવો. ૧૦%, ૫% અને ૧% નો સરવાળો કરીને ૩ સેકન્ડમાં કોઈપણ ટકાવારી શોધો!"
        },
        "key_takeaway": {
          "en": "Benchmark Rule: 10% = Slide Left 1 $\\rightarrow$ 5% = Half of 10% $\\rightarrow$ 1% = Slide Left 2 $\\rightarrow$ Add them up!",
          "hi": "बेंचमार्क नियम: 10% = 1 अंक बाएँ $\\rightarrow$ 5% = 10% का आधा $\\rightarrow$ 1% = 2 अंक बाएँ $\\rightarrow$ जोड़ लें!",
          "gu": "બેન્ચમાર્ક નિયમ: ૧૦% = ૧ અંક ડાબે $\\rightarrow$ ૫% = ૧૦% નું અડધું $\\rightarrow$ ૧% = ૨ અંક ડાબે $\\rightarrow$ સરવાળો કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "percent_slice",
        "title": {
          "en": "Meet Tanya",
          "hi": "तान्या से मिलें",
          "gu": "મળો તાન્યાને"
        },
        "story": {
          "en": "Tanya wanted to find 15% tip on a ₹600 restaurant bill. Her brother started multiplying $15 \\times 600 \\div 100$ on a napkin. Tanya smiled: '10% of 600 is 60. 5% is half of 60, which is 30. 60 + 30 = ₹90!' She announced the tip before her brother even found a pen.",
          "hi": "तान्या को ₹600 के बिल पर 15% टिप निकालनी थी। उसका भाई नैपकिन पर $15 \\times 600 \\div 100$ करने लगा। तान्या मुस्कुराई: '600 का 10% = 60। 5% इसका आधा = 30। 60 + 30 = ₹90!' उसने भाई के पेन उठाने से पहले ही उत्तर बता दिया।",
          "gu": "તાન્યાને ₹૬૦૦ ના બિલ પર ૧૫% ટીપ ગણવી હતી. તેનો ભાઈ કાગળ પર $૧૫ \\times ૬૦૦ \\div ૧૦૦$ ગણવા બેઠો. તાન્યા હસી: '૬૦૦ ના ૧૦% = ૬૦. ૫% એટલે ૬૦ નું અડધું = ૩૦. ૬૦ + ૩૦ = ₹૯૦!' તેણે ભાઈ પેન પકડે તે પહેલાં જ જવાબ કહી દીધો."
        },
        "insight_box": {
          "en": "Building Blocks: 15% = 10% + 5%. 20% = 10% × 2. 35% = (10% × 3) + 5%. Instant math!",
          "hi": "ब्लॉक निर्माण: 15% = 10% + 5%। 20% = 10% × 2। 35% = (10% × 3) + 5%। तुरंत गणना!",
          "gu": "બ્લોક રચના: ૧૫% = ૧૦% + ૫%. ૨૦% = ૧૦% × ૨. ૩૫% = (૧૦% × ૩) + ૫%. ક્ષણવારમાં ગણતરી!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "percent_slice",
        "question": {
          "en": "How do you calculate 10% of any number instantly without writing a formula?",
          "hi": "बिना कोई सूत्र लिखे किसी भी संख्या का 10% तुरंत कैसे निकालते हैं?",
          "gu": "કોઈપણ સૂત્ર લખ્યા વગર કોઈપણ સંખ્યાના ૧૦% તરત કેવી રીતે શોધાય?"
        },
        "option_a": {
          "en": "Multiply the number by 10 and add two zeros.",
          "hi": "संख्या को 10 से गुणा करें और दो शून्य जोड़ें।",
          "gu": "સંખ્યાને ૧૦ વડે ગુણો અને બે શૂન્ય ઉમેરો."
        },
        "option_b": {
          "en": "Shift the decimal point exactly one place to the left (e.g., 450 becomes 45).",
          "hi": "दशमलव बिंदु को ठीक 1 स्थान बाईं ओर खिसकाएं (जैसे 450 बन जाता है 45)।",
          "gu": "પોઇન્ટને બરાબર ૧ સ્થાન ડાબી બાજુ ખસેડો (જેમ કે ૪૫૦ ના ૪૫ બને)."
        },
        "feedback": {
          "en": "Correct! Dividing by 10 is identical to sliding the decimal point one digit to the left.",
          "hi": "सही! 10 से भाग देना दशमलव को एक अंक बाईं ओर खिसकाने के बराबर है।",
          "gu": "સાચું! ૧૦ વડે ભાગવું એટલે પોઇન્ટને એક અંક ડાબી તરફ ખસેડવો."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "percent_slice",
        "question": {
          "en": "A jacket costs ₹800 with a 35% festival discount. Using benchmark blocks (10% = 80; 30% = 240; 5% = 40), what is the discount amount?",
          "hi": "एक जैकेट की कीमत ₹800 है जिस पर 35% की छूट है। बेंचमार्क ब्लॉक्स (10% = 80; 30% = 240; 5% = 40) का उपयोग करके छूट की राशि क्या होगी?",
          "gu": "એક જેકેટની કિંમત ₹૮૦૦ છે અને તેના પર ૩૫% છૂટ છે. બેન્ચમાર્ક બ્લોક્સ (૧૦% = ૮૦; ૩૦% = ૨૪૦; ૫% = ૪૦) વાપરીને છૂટની રકમ કેટલી થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "₹280 (240 + 40 = ₹280)",
              "hi": "₹280 (240 + 40 = ₹280)",
              "gu": "₹૨૮૦ (૨૪૦ + ૪૦ = ₹૨૮૦)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "₹320",
              "hi": "₹320",
              "gu": "₹૩૨૦"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "₹250",
              "hi": "₹250",
              "gu": "₹૨૫૦"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "₹300",
              "hi": "₹300",
              "gu": "₹૩૦૦"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! 30% = 80 × 3 = 240. 5% = half of 80 = 40. Total 35% discount = 240 + 40 = ₹280!",
          "hi": "शानदार! 30% = 80 × 3 = 240। 5% = 80 का आधा = 40। कुल 35% छूट = 240 + 40 = ₹280!",
          "gu": "એકદમ સાચું! ૩૦% = ૮૦ × ૩ = ૨૪૦. ૫% = ૮૦ નું અડધું = ૪૦. કુલ ૩૫% છૂટ = ૨૪૦ + ૪૦ = ₹૨૮૦!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "percent_slice",
        "title": {
          "en": "Percentage Benchmark Superpower",
          "hi": "प्रतिशत बेंचमार्क सुपरपावर",
          "gu": "ટકાવારી બેન્ચમાર્ક સુપરપાવર"
        },
        "body": {
          "en": "Build complex percentages by adding 10%, 5%, and 1% building blocks.",
          "hi": "10%, 5% और 1% के बिल्डिंग ब्लॉक्स को जोड़कर जटिल प्रतिशत आसानी से बनाएं।",
          "gu": "૧૦%, ૫% અને ૧% ના બ્લોક્સ ઉમેરીને અઘરી ટકાવારી સરળતાથી બનાવો."
        },
        "tags": [
          {
            "en": "10% = Slide Left 1",
            "hi": "10% = 1 अंक बाएँ",
            "gu": "૧૦% = ૧ અંક ડાબે"
          },
          {
            "en": "5% = Half of 10%",
            "hi": "5% = 10% का आधा",
            "gu": "૫% = ૧૦% નું અડધું"
          },
          {
            "en": "1% = Slide Left 2",
            "hi": "1% = 2 अंक बाएँ",
            "gu": "૧% = ૨ અંક ડાબે"
          },
          {
            "en": "50% = Half",
            "hi": "50% = आधा",
            "gu": "૫૦% = અડધું"
          },
          {
            "en": "No Long Division",
            "hi": "बिना भागफल",
            "gu": "ભાગાકાર મુક્ત"
          },
          {
            "en": "Instant Shopping Math",
            "hi": "त्वरित शॉपिंग गणित",
            "gu": "ઝડપી ખરીદી ગણતરી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "percent_slice",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Find 10% of the base number by shifting the decimal point 1 place left.",
              "hi": "दशमलव बिंदु को 1 स्थान बाईं ओर खिसकाकर मूल संख्या का 10% ज्ञात करें।",
              "gu": "પોઇન્ટને ૧ સ્થાન ડાબે ખસેડીને મૂળ સંખ્યાના ૧૦% શોધો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "If you need 5%, simply take half of your 10% value.",
              "hi": "यदि आपको 5% चाहिए, तो अपने 10% मान का आधा कर लें।",
              "gu": "જો તમારે ૫% જોઈતા હોય, તો ૧૦% ની કિંમતનું અડધું કરી લો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "If you need single digits (like 1% or 2%), shift decimal 2 places left and multiply as needed.",
              "hi": "यदि 1% या 2% चाहिए, तो दशमलव को 2 स्थान बाएँ खिसकाएं और गुणा करें।",
              "gu": "જો ૧% કે ૨% જોઈતા હોય, તો પોઇન્ટ ૨ સ્થાન ડાબે ખસેડો અને જરૂરી ગુણાકાર કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Sum your benchmark blocks together for the total target percentage.",
              "hi": "कुल लक्षित प्रतिशत पाने के लिए अपने सभी बेंचमार्क ब्लॉक्स को आपस में जोड़ें।",
              "gu": "કુલ ટકાવારી મેળવવા માટે તમારા બધા બેન્ચમાર્ક બ્લોક્સનો સરવાળો કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "percent_slice",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Calculate 15% of ₹400, 25% of ₹120, and 35% of ₹200 mentally using benchmark blocks today!",
          "hi": "आज ₹400 का 15%, ₹120 का 25%, और ₹200 का 35% बिना पेन उठाए मन में निकालें!",
          "gu": "આજે પેન અડ્યા વગર મગજમાં ₹૪૦૦ ના ૧૫%, ₹૧૨૦ ના ૨૫%, અને ₹૨૦૦ ના ૩૫% શોધી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will master benchmark percentages!",
          "hi": "मैं प्रतिशत शॉर्टकट से गणना करूँगा!",
          "gu": "હું ટકાવારી શોર્ટકટથી ગણતરી કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_20",
    "methodNumber": 20,
    "classLevel": 6,
    "category": {
      "en": "Mental Maths / Calculation Strategies",
      "hi": "मानसिक गणित / गणना रणनीतियाँ",
      "gu": "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Fraction Shortcuts (The Butterfly Method)",
      "hi": "भिन्न शॉर्टकट (तितली विधि / बटरफ्लाई मेथड)",
      "gu": "અપૂર્ણાંક શોર્ટકટ (પતંગિયા પદ્ધતિ / બટરફ્લાય મેથડ)"
    },
    "description": {
      "en": "Add, subtract, and compare unlike fractions in 5 seconds flat using diagonal wing multiplication—say goodbye to tedious LCM prime factorization tables.",
      "hi": "विकर्ण पंखों के गुणा का उपयोग करके असमान भिन्नों को 5 सेकंड में जोड़ें, घटाएं और तुलना करें—ल.स.प. (LCM) की लंबी सारणी को अलविदा कहें।",
      "gu": "ત્રાંસા ગુણાકાર વડે વિષમછેદી અપૂર્ણાંકોનો ૫ સેકન્ડમાં સરવાળો, બાદબાકી અને સરખામણી કરો—લ.સા.અ. (LCM) ની લાંબી ગણતરી વગર."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "fraction_pie",
        "title": {
          "en": "Dreading Finding Giant LCMs for Fraction Addition?",
          "hi": "असमान भिन्नों का ल.स.प. (LCM) निकालने में उलझ जाते हैं?",
          "gu": "અપૂર્ણાંકોનો સરવાળો કરવા લ.સા.અ. (LCM) શોધવામાં કંટાળો આવે છે?"
        },
        "pain_quotes": [
          {
            "en": "Finding the common denominator for 3/4 + 2/5 takes 5 steps of LCM factorization on rough sheets!",
            "hi": "3/4 + 2/5 का हर बराबर करने के लिए रफ कॉपी पर 5 चरणों में LCM निकालना पड़ता है!",
            "gu": "૩/૪ + ૨/૫ નો છેદ સરખો કરવા માટે રફ કાગળ પર ૫ પગલાંનો LCM શોધવો પડે છે!"
          },
          {
            "en": "Comparing which is bigger: 5/7 or 7/10 confuses me completely during fast multiple-choice tests!",
            "hi": "5/7 और 7/10 में कौन सा बड़ा है, टेस्ट में यह तय करना बहुत भ्रमित करता है!",
            "gu": "૫/૭ અને ૭/૧૦ માંથી કયો અપૂર્ણાંક મોટો છે તે નક્કી કરવામાં પરીક્ષામાં ભારે ગૂંચવણ થાય છે!"
          }
        ],
        "body": {
          "en": "You don't need a 10-line LCM table to add or compare fractions! The 'Butterfly Method' draws two criss-cross wings: multiply diagonals to get the antennae (numerators), multiply the bottoms to get the tail (denominator), and add or compare immediately!",
          "hi": "भिन्नों को जोड़ने या तुलना करने के लिए लंबी ल.स.प. सारणी की जरूरत नहीं है! 'तितली विधि' दो तिरछे पंख बनाती है: विकर्णों को गुणा करके शीर्ष संख्याएं पाएं, नीचे की संख्याओं को गुणा करके हर पाएं, और तुरंत जोड़ लें!",
          "gu": "અપૂર્ણાંકોના સરવાળા કે સરખામણી માટે લાંબા લ.સા.અ. ની જરૂર નથી! 'પતંગિયા પદ્ધતિ' બે ત્રાંસી પાંખો બનાવે છે: સામસામે ગુણાકાર કરીને અંશ મેળવો, નીચેના છેદનો ગુણાકાર કરો અને તરત જ સરવાળો કરો!"
        },
        "key_takeaway": {
          "en": "Butterfly Rule: Diagonal 1 $\\times$ Diagonal 2 $\\rightarrow$ Multiply Bottoms $\\rightarrow$ Add Numerators!",
          "hi": "तितली नियम: विकर्ण 1 $\\times$ विकर्ण 2 $\\rightarrow$ नीचे का गुणा $\\rightarrow$ ऊपर जोड़ें!",
          "gu": "પતંગિયા નિયમ: સામસામે ગુણાકાર $\\rightarrow$ નીચેનો ગુણાકાર $\\rightarrow$ ઉપર સરવાળો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "fraction_pie",
        "title": {
          "en": "Meet Neha",
          "hi": "नेहा से मिलें",
          "gu": "મળો નેહાને"
        },
        "story": {
          "en": "Neha had to solve $2/3 + 1/5$ in a speed math contest. While others were drawing LCM factor trees, Neha drew butterfly wings: Left wing $2 \\times 5 = 10$, Right wing $1 \\times 3 = 3$. Butterfly tail $3 \\times 5 = 15$. Numerator: $10 + 3 = 13$. Answer: $13/15$! Solved in 4 seconds flat.",
          "hi": "नेहा को स्पीड मैथ प्रतियोगिता में $2/3 + 1/5$ हल करना था। जब बाकी बच्चे ल.स.प. निकाल रहे थे, नेहा ने तितली के पंખ बनाए: बायां पंख $2 \\times 5 = 10$, दायां पंख $1 \\times 3 = 3$। निचली पूंछ $3 \\times 5 = 15$। ऊपर: $10 + 3 = 13$। उत्तर: $13/15$! सिर्फ 4 सेकंड में हल!",
          "gu": "નેહાને ગણિત સ્પર્ધામાં $૨/૩ + ૧/૫$ ગણવાનો હતો. બીજા વિદ્યાર્થીઓ લ.સા.અ. શોધતા હતા ત્યારે નેહાએ પતંગિયું દોર્યું: ડાબી પાંખ $૨ \\times ૫ = ૧૦$, જમણી પાંખ $૧ \\times ૩ = ૩$. નીચે પૂંછડી $૩ \\times ૫ = ૧૫$. અંશ: ૧૦ + ૩ = ૧૩. જવાબ: ૧૩/૧૫! માત્ર ૪ સેકન્ડમાં દાખલો પૂરો."
        },
        "insight_box": {
          "en": "Comparison Trick: To compare 3/5 vs 4/7, cross-multiply: $3 \\times 7 = 21$ vs $4 \\times 5 = 20$. Since 21 > 20, 3/5 is bigger!",
          "hi": "तुलना ट्रिक: 3/5 और 4/7 की तुलना के लिए तिरछा गुणा करें: $3 \\times 7 = 21$ बनाम $4 \\times 5 = 20$। 21 > 20 है, इसलिए 3/5 बड़ा है!",
          "gu": "સરખામણી ટ્રીક: ૩/૫ અને ૪/૭ ની સરખામણી માટે સામસામે ગુણાકાર કરો: ૩ $\\times ૭ = ૨૧$ અને ૪ $\\times ૫ = ૨૦$. ૨૧ > ૨૦ હોવાથી ૩/૫ મોટો અપૂર્ણાંક છે!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "fraction_pie",
        "question": {
          "en": "Using the Butterfly Method for $\\frac{a}{b} + \\frac{c}{d}$, how is the new numerator calculated?",
          "hi": "तितली विधि द्वारा $\\frac{a}{b} + \\frac{c}{d}$ हल करते समय नया अंश (ऊपरी संख्या) कैसे निकाला जाता है?",
          "gu": "પતંગિયા પદ્ધતિથી $\\frac{a}{b} + \\frac{c}{d}$ ગણતી વખતે નવો અંશ (ઉપરની સંખ્યા) કેવી રીતે શોધાય છે?"
        },
        "option_a": {
          "en": "Add the two top numbers together directly ($a + c$).",
          "hi": "सीधे दोनों ऊपरी संख्याओं को जोड़ें ($a + c$)।",
          "gu": "બંને ઉપરની સંખ્યાઓનો સીધો સરવાળો કરો ($a + c$)."
        },
        "option_b": {
          "en": "Cross-multiply the two diagonal wings and add: $(a \\times d) + (b \\times c)$.",
          "hi": "दोनों तिरछे पंखों का गुणा करें और जोड़ें: $(a \\times d) + (b \\times c)$।",
          "gu": "બંને ત્રાંસી પાંખોનો સામસામે ગુણાકાર કરીને સરવાળો કરો: $(a \\times d) + (b \\times c)$."
        },
        "feedback": {
          "en": "Correct! Cross-multiplying diagonals instantly creates a common denominator equivalent for both fractions!",
          "hi": "सही! तिरछा गुणा दोनों भिन्नों के लिए तुरंत समान हर का मान तैयार कर देता है!",
          "gu": "સાચું! સામસામે ગુણાકાર કરવાથી બંને અપૂર્ણાંકોનો સમાન છેદ આપોઆપ તૈયાર થઈ જાય છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "fraction_pie",
        "question": {
          "en": "Solve $\\frac{3}{4} - \\frac{2}{7}$ using the Butterfly Method:\nWing 1: $3 \\times 7 = 21$\nWing 2: $2 \\times 4 = 8$\nTail (bottoms): $4 \\times 7 = 28$\nWhat is the resulting fraction?",
          "hi": "तितली विधि से $\\frac{3}{4} - \\frac{2}{7}$ हल करें:\nपंख 1: $3 \\times 7 = 21$\nपंख 2: $2 \\times 4 = 8$\nपूंछ (नीचे): $4 \\times 7 = 28$\nपरिणामी भिन्न क्या है?",
          "gu": "પતંગિયા પદ્ધતિથી $\\frac{3}{4} - \\frac{2}{7}$ ગણો:\nપાંખ ૧: $૩ \\times ૭ = ૨૧$\nપાંખ ૨: $૨ \\times ૪ = ૮$\nપૂંછડી (નીચે): $૪ \\times ૭ = ૨૮$\nજવાબ શું આવશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "13/28 (21 - 8 = 13 over 28)",
              "hi": "13/28 (21 - 8 = 13 बटा 28)",
              "gu": "૧૩/૨૮ (૨૧ - ૮ = ૧૩ ના છેદમાં ૨૮)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "1/28",
              "hi": "1/28",
              "gu": "૧/૨૮"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "5/28",
              "hi": "5/28",
              "gu": "૫/૨૮"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "29/28",
              "hi": "29/28",
              "gu": "૨૯/૨૮"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Numerator: $21 - 8 = 13$. Denominator: $4 \\times 7 = 28$. Result: 13/28 in 3 seconds!",
          "hi": "शानदार! अंश: $21 - 8 = 13$। हर: $4 \\times 7 = 28$। उत्तर: 13/28 सिर्फ 3 सेकंड में!",
          "gu": "એકદમ સાચું! અંશ: ૨૧ - ૮ = ૧૩. છેદ: ૪ $\\times ૭ = ૨૮$. પરિણામ: ૧૩/૨૮ માત્ર ૩ સેકન્ડમાં!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "fraction_pie",
        "title": {
          "en": "Butterfly Fraction Superpower",
          "hi": "तितली भिन्न सुपरपावर",
          "gu": "પતંગિયા અપૂર્ણાંક સુપરપાવર"
        },
        "body": {
          "en": "Cross-multiply diagonals for the top and multiply denominators for the bottom.",
          "hi": "ऊपर के लिए तिरछा गुणा करें और नीचे के लिए हरों का आपस में गुणा करें।",
          "gu": "અંશ માટે સામસામે ગુણાકાર કરો અને છેદ માટે નીચેની સંખ્યાઓનો ગુણાકાર કરો."
        },
        "tags": [
          {
            "en": "Butterfly Wings",
            "hi": "तितली के पंख",
            "gu": "પતંગિયાની પાંખો"
          },
          {
            "en": "Cross-Multiply",
            "hi": "तिरछा गुणा",
            "gu": "સામસામે ગુણાકાર"
          },
          {
            "en": "Multiply Bottoms",
            "hi": "नीचे का गुणा",
            "gu": "છેદનો ગુણાકાર"
          },
          {
            "en": "Zero LCM Tables",
            "hi": "बिना LCM सारणी",
            "gu": "LCM મુક્ત"
          },
          {
            "en": "Instant Compare",
            "hi": "तुरंत तुलना",
            "gu": "ઝડપી સરખામણી"
          },
          {
            "en": "Speed Math",
            "hi": "गति गणित",
            "gu": "સ્પીડ ગણિત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "fraction_pie",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Draw diagonal loop 1 (top-left × bottom-right) and write product above.",
              "hi": "पहला तिरछा लूप (ऊपर-बायाँ × नीचे-दायाँ) बनाएं और गुणनफल ऊपर लिखें।",
              "gu": "પહેલો ત્રાંસો લૂપ (ઉપર-ડાબે × નીચે-જમણે) બનાવી ગુણાકાર ઉપર લખો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Draw diagonal loop 2 (bottom-left × top-right) and write product above.",
              "hi": "दूसरा तिरछा लूप (नीचे-बायाँ × ऊपर-दायाँ) बनाएं और गुणनफल ऊपर लिखें।",
              "gu": "બીજો ત્રાંસો લૂપ (નીચે-ડાબે × ઉપર-જમણે) બનાવી ગુણાકાર ઉપર લખો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Multiply the two bottom denominators together to form the new denominator.",
              "hi": "नया हर बनाने के लिए दोनों निचली संख्याओं (हरों) को आपस में गुणा करें।",
              "gu": "નવો છેદ બનાવવા માટે બંને નીચેની સંખ્યાઓનો પરસ્પર ગુણાકાર કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Add (or subtract) the two top numbers and simplify the fraction if possible.",
              "hi": "दोनों शीर्ष संख्याओं को जोड़ें (या घटाएं) और यदि संभव हो तो भिन्न को सरल करें।",
              "gu": "બંને ઉપરની સંખ્યાઓનો સરવાળો (કે બાદબાકી) કરો અને શક્ય હોય તો અતિસંક્ષિપ્ત રૂપ આપો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "fraction_pie",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Solve $1/3 + 2/5$ and $4/5 - 1/2$ using the Butterfly method in your notebook and check which fraction is bigger: $3/8$ or $2/5$!",
          "hi": "आज अपनी कॉपी में तितली विधि से $1/3 + 2/5$ और $4/5 - 1/2$ हल करें और बताएं कि $3/8$ और $2/5$ में कौन सा बड़ा है!",
          "gu": "આજે તમારી નોટબુકમાં પતંગિયા પદ્ધતિથી $૧/૩ + ૨/૫$ અને $૪/૫ - ૧/૨$ ગણો અને નક્કી કરો કે $૩/૮$ કે $૨/૫$ માંથી કયો અપૂર્ણાંક મોટો છે!"
        },
        "commitment_button_text": {
          "en": "I will fly through fractions with butterfly wings!",
          "hi": "मैं तितली विधि से भिन्न हल करूँगा!",
          "gu": "હું પતંગિયા પદ્ધતિથી અપૂર્ણાંક ગણીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_25",
    "methodNumber": 25,
    "classLevel": 6,
    "category": {
      "en": "Mental Maths / Calculation Strategies",
      "hi": "मानसिक गणित / गणना रणनीतियाँ",
      "gu": "માનસિક ગણિત / ગણતરી વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Digit-Sum Checking (Casting Out Nines)",
      "hi": "बीजांक सत्यापन (9 को बाहर निकालना / कास्टिंग आउट नाइन्स)",
      "gu": "બીજાંક ચકાસણી (૯ ને બાદ કરવાની પદ્ધતિ / કાસ્ટિંગ આઉટ નાઇન્સ)"
    },
    "description": {
      "en": "Verify massive multiplication, addition, and subtraction answers in 3 seconds without re-calculating the entire problem from scratch.",
      "hi": "पूरे सवाल को दोबारा हल किए बिना 3 सेकंड में बड़े गुणा, जोड़ और घटाव के उत्तरों की शुद्धता जांचें।",
      "gu": "આખો દાખલો ફરીથી ગણ્યા વગર માત્ર ૩ સેકન્ડમાં મોટા ગુણાકાર, સરવાળા અને બાદબાકીના જવાબો સાચા છે કે નહીં તે ચકાસો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "casting_nine",
        "title": {
          "en": "Re-Solving the Entire Test to Check for Errors?",
          "hi": "गलतियाँ जांचने के लिए पूरे टेस्ट को दोबारा हल करना पड़ता है?",
          "gu": "ભૂલો તપાસવા માટે આખું પેપર ફરીથી ગણવું પડે છે?"
        },
        "pain_quotes": [
          {
            "en": "I spent 15 minutes recalculating $247 \\times 38$ just to verify if my answer 9,386 was correct!",
            "hi": "$247 \\times 38 = 9,386$ सही है या नहीं, यह जांचने में मेरे 15 मिनट दोबारा गणना करने में चले गए!",
            "gu": "$૨૪૭ \\times ૩૮ = ૯,૩૮૬$ સાચો છે કે નહીં તે ચકાસવા માટે મારે આખો ગુણાકાર ફરીથી કરવો પડ્યો!"
          },
          {
            "en": "During exams, I never have enough time to double-check my long arithmetic calculations!",
            "hi": "परीक्षा में लंबी गणनाओं को दोबारा जांचने का समय ही नहीं बचता!",
            "gu": "પરીક્ષામાં લાંબી ગણતરીઓ ફરીથી તપાસવાનો સમય જ નથી મળતો!"
          }
        ],
        "body": {
          "en": "Never re-do long math to check an answer. The ancient 'Casting Out Nines' (Beejank) method condenses any giant number down to a single digital root (1 to 9). If DigitalRoot(A) $\\times$ DigitalRoot(B) = DigitalRoot(Answer), your calculation is certified correct in 3 seconds!",
          "hi": "उत्तर जांचने के लिए कभी भी लंबा हिसाब दोबारा न करें। प्राचीन 'बीजांक (Digital Root)' विधि किसी भी बड़ी संख्या को 1 से 9 के एकल अंक में बदल देती है। यदि बीजांक(A) $\\times$ बीजांक(B) = बीजांक(उत्तर), तो आपका हिसाब 3 सेकंड में प्रमाणित हो जाता है!",
          "gu": "જવાબ ચકાસવા માટે ક્યારેય આખો દાખલો ફરીથી ન ગણો. પ્રાચીન 'બીજાંક પદ્ધતિ' કોઈપણ મોટી સંખ્યાને ૧ થી ૯ ના એક જ અંકમાં ફેરવી દે છે. જો બીજાંક(A) $\\times$ બીજાંક(B) = બીજાંક(જવાબ) થાય, તો તમારો જવાબ ૩ સેકન્ડમાં સાચો સાબિત થાય છે!"
        },
        "key_takeaway": {
          "en": "Digit-Sum Rule: Add digits until single number $\\rightarrow$ Ignore all 9s $\\rightarrow$ Check Operation Match!",
          "hi": "बीजांक नियम: एकल अंक आने तक जोड़ें $\\rightarrow$ सभी 9 को छोड़ें $\\rightarrow$ क्रिया की समानता जांचें!",
          "gu": "બીજાંક નિયમ: એક અંક ન આવે ત્યાં સુધી અંકો ઉમેરો $\\rightarrow$ બધા ૯ અવગણો $\\rightarrow$ બંને બાજુ સરખાવો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "casting_nine",
        "title": {
          "en": "Meet Parth",
          "hi": "पार्थ से मिलें",
          "gu": "મળો પાર્થને"
        },
        "story": {
          "en": "Parth multiplied $35 \\times 24 = 840$. To check: Digits of 35 ($3+5=8$). Digits of 24 ($2+4=6$). Operation: $8 \\times 6 = 48 \\rightarrow 4+8=12 \\rightarrow 1+2 = 3$. Digits of answer 840 ($8+4+0 = 12 \\rightarrow 1+2 = 3$). 3 matches 3! Parth instantly knew his answer was 100% rock-solid without re-multiplying.",
          "hi": "पार्थ ने $35 \\times 24 = 840$ गुणा किया। जांच के लिए: 35 का बीजांक ($3+5=8$)। 24 का बीजांक ($2+4=6$)। क्रिया: $8 \\times 6 = 48 \\rightarrow 4+8=12 \\rightarrow 1+2 = 3$। उत्तर 840 का बीजांक ($8+4+0=12 \\rightarrow 1+2=3$)। 3 = 3 मिल गया! पार्थ जान गया कि उत्तर बिल्कुल सही है।",
          "gu": "પાર્થે $૩૫ \\times ૨૪ = ૮૪૦$ નો ગુણાકાર કર્યો. ચકાસણી: ૩૫ નો બીજાંક ($૩+૫=૮$). ૨૪ નો બીજાંક ($૨+૪=૬$). ગણતરી: $૮ \\times ૬ = ૪૮ \\rightarrow ૪+૮=૧૨ \\rightarrow ૧+૨ = ૩$. જવાબ ૮૪૦ નો બીજાંક ($૮+૪+૦ = ૧૨ \\rightarrow ૧+૨ = ૩$). ૩ = ૩ મળી ગયા! પાર્થને ખાતરી થઈ ગઈ કે જવાબ ૧૦૦% સાચો છે."
        },
        "insight_box": {
          "en": "Nine Shortcut: Whenever you see a '9' or two digits that add to 9 (like 7+2), instantly cast them out as 0 to speed up adding!",
          "hi": "9 का शॉर्टकट: जहाँ भी '9' या 9 बनाने वाले जोड़े (जैसे 7+2) दिखें, उन्हें 0 मानकर तुरंत छोड़ दें!",
          "gu": "૯ નો શોર્ટકટ: જ્યાં પણ '૯' કે ૯ નો સરવાળો થતી જોડી (જેમ કે ૭+૨) દેખાય, તેને શૂન્ય માનીને તરત અવગણો!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "casting_nine",
        "question": {
          "en": "What is the single-digit root (digital sum) of the number 5,942 using casting out nines?",
          "hi": "9 को बाहर निकालने की विधि का उपयोग करके संख्या 5,942 का बीजांक (एकल अंक) क्या होगा?",
          "gu": "૯ ને અવગણવાની પદ્ધતિ વાપરીને સંખ્યા ૫,૯૪૨ નો બીજાંક (એક અંકનો સરવાળો) કેટલો થશે?"
        },
        "option_a": {
          "en": "2 (Cast out 9 and 5+4=9; only 2 remains!)",
          "hi": "2 (9 को हटाएं और 5+4=9 को हटाएं; केवल 2 बचता है!)",
          "gu": "૨ (૯ ને કાપો અને ૫+૪=૯ ને કાપો; માત્ર ૨ વધે છે!)"
        },
        "option_b": {
          "en": "20",
          "hi": "20",
          "gu": "૨૦"
        },
        "feedback": {
          "en": "Correct! $5+9+4+2 = 20 \\rightarrow 2+0 = 2$. Casting out 9 and (5+4) gives 2 instantly in 1 second!",
          "hi": "सही! $5+9+4+2 = 20 \\rightarrow 2+0 = 2$। 9 और (5+4) को हटाने पर तुरंत 2 मिलता है!",
          "gu": "સાચું! ૫+૯+૪+૨ = ૨૦ $\\rightarrow$ ૨+૦ = ૨. ૯ અને (૫+૪) કાઢતાં માત્ર ૧ સેકન્ડમાં ૨ મળે છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "casting_nine",
        "question": {
          "en": "A student calculates $23 \\times 31 = 713$.\nRoot of 23: $2+3 = 5$\nRoot of 31: $3+1 = 4$\nOperation Root: $5 \\times 4 = 20 \\rightarrow 2+0 = 2$\nRoot of Answer 713: $7+1+3 = 11 \\rightarrow 1+1 = 2$\nWhat does this prove?",
          "hi": "एक छात्र $23 \\times 31 = 713$ हल करता है।\n23 का बीजांक: $2+3 = 5$\n31 का बीजांक: $3+1 = 4$\nक्रिया का बीजांक: $5 \\times 4 = 20 \\rightarrow 2$\nउत्तर 713 का बीजांक: $7+1+3 = 11 \\rightarrow 2$\nयह क्या साबित करता है?",
          "gu": "એક વિદ્યાર્થી $૨૩ \\times ૩૧ = ૭૧૩$ ગણે છે.\n૨૩ નો બીજાંક: ૨+૩ = ૫\n૩૧ નો બીજાંક: ૩+૧ = ૪\nક્રિયાનો બીજાંક: ૫ $\\times ૪ = ૨૦ \\rightarrow ૨$\nજવાબ ૭૧૩ નો બીજાંક: ૭+૧+૩ = ૧૧ $\\rightarrow ૨$\nઆ શું સાબિત કરે છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "The calculation passes the digit-sum check with 100% consistency (2 = 2)",
              "hi": "गणना 100% बीजांक सत्यापन पास करती है (2 = 2)",
              "gu": "આ ગણતરી ૧૦૦% બીજાંક ચકાસણીમાં સાચી સાબિત થાય છે (૨ = ૨)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "The answer must be wrong because 2 is an even number",
              "hi": "उत्तर गलत होना चाहिए क्योंकि 2 एक सम संख्या है",
              "gu": "જવાબ ખોટો હોવો જોઈએ કારણ કે ૨ બેકી સંખ્યા છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "You must re-calculate the entire multiplication by hand",
              "hi": "आपको हाथ से पूरा गुणा दोबारा करना होगा",
              "gu": "તમારે હાથેથી આખો ગુણાકાર ફરીથી કરવો પડશે"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "The answer should be 0",
              "hi": "उत्तर 0 होना चाहिए",
              "gu": "જવાબ ૦ હોવો જોઈએ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The digital root of the question ($5 \\times 4 \\rightarrow 2$) matches the root of the product ($713 \\rightarrow 2$). Certified correct!",
          "hi": "शानदार! प्रश्न का बीजांक ($5 \\times 4 \\rightarrow 2$) गुणनफल के बीजांक ($713 \\rightarrow 2$) से पूरी तरह मेल खाता है!",
          "gu": "એકદમ સાચું! પ્રશ્નનો બીજાંક (૫ $\\times ૪ \\rightarrow ૨$) જવાબના બીજાંક (૭૧૩ $\\rightarrow ૨$) સાથે બરાબર મળે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "casting_nine",
        "title": {
          "en": "Digit-Sum Verifier Superpower",
          "hi": "बीजांक सत्यापन सुपरपावर",
          "gu": "બીજાંક ચકાસણી સુપરપાવર"
        },
        "body": {
          "en": "Collapse numbers to single digital roots to verify arithmetic operations in 3 seconds.",
          "hi": "3 सेकंड में गणितीय क्रियाओं की जांच के लिए संख्याओं को एकल बीजांक में बदलें।",
          "gu": "૩ સેકન્ડમાં ગણિતના દાખલા ચકાસવા માટે સંખ્યાઓને એક અંકના બીજાંકમાં ફેરવો."
        },
        "tags": [
          {
            "en": "Digital Root",
            "hi": "बीजांक",
            "gu": "બીજાંક"
          },
          {
            "en": "Cast Out Nines",
            "hi": "9 को बाहर निकालें",
            "gu": "૯ ને બાદ કરો"
          },
          {
            "en": "Instant Error Check",
            "hi": "तुरंत त्रुटि जांच",
            "gu": "ઝડપી ભૂલ તપાસ"
          },
          {
            "en": "Single Digit Sum",
            "hi": "एकल अंक योग",
            "gu": "એક અંકનો સરવાળો"
          },
          {
            "en": "Exam Assurance",
            "hi": "परीक्षा में भरोसा",
            "gu": "પરીક્ષામાં આત્મવિશ્વાસ"
          },
          {
            "en": "3-Second Scan",
            "hi": "3-सेकंड स्कैन",
            "gu": "૩-સેકન્ડ સ્કેન"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "casting_nine",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Calculate the single-digit root for each input number by adding digits (treating 9s as 0).",
              "hi": "अंकों को जोड़कर प्रत्येक मूल संख्या का बीजांक निकालें (9 को 0 मानते हुए)।",
              "gu": "અંકોનો સરવાળો કરીને દરેક મૂળ સંખ્યાનો બીજાંક શોધો (૯ ને શૂન્ય ગણીને)."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Perform the math operation (+, -, or ×) on those small root numbers.",
              "hi": "उन छोटे बीजांक नंबरों पर गणितीय क्रिया (+, -, या ×) लागू करें।",
              "gu": "તે નાના બીજાંક નંબરો વચ્ચે ગણિતની ક્રિયા (+, -, કે ×) કરો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Find the single-digit root of your final calculated answer.",
              "hi": "अपने अंतिम निकाले गए उत्तर का एकल बीजांक ज्ञात करें।",
              "gu": "તમે શોધેલા અંતિમ જવાબનો એક અંકનો બીજાંક શોધો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Compare the two root numbers: if they match, your math is certified error-free!",
              "hi": "दोनों बीजांकों की तुलना करें: यदि वे मेल खाते हैं, तो आपका हिसाब बिल्कुल सही है!",
              "gu": "બંને બીજાંક સરખાવો: જો બંને સરખા હોય, તો તમારી ગણતરી એકદમ સાચી છે!"
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "casting_nine",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "On 3 math homework problems today, use the Digit-Sum casting out nines trick to verify your answer before showing your teacher!",
          "hi": "आज गृहकार्य के 3 सवालों में शिक्षक को दिखाने से पहले बीजांक विधि से अपने उत्तर की शुद्धता जांचें!",
          "gu": "આજે હોમવર્કના ૩ દાખલામાં શિક્ષકને બતાવતાં પહેલાં બીજાંક પદ્ધતિથી તમારો જવાબ સાચો છે કે નહીં તે ચકાસો!"
        },
        "commitment_button_text": {
          "en": "I will verify calculations with digit sums!",
          "hi": "मैं बीजांक विधि से उत्तर जांचूँगा!",
          "gu": "હું બીજાંક પદ્ધતિથી જવાબો ચકાસીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_30",
    "methodNumber": 30,
    "classLevel": 6,
    "category": {
      "en": "Memory Strategies",
      "hi": "स्मृति रणनीतियाँ",
      "gu": "યાદશક્તિ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Method of Loci (The Mind Memory Palace)",
      "hi": "स्थान विधि / मेमोरी पैलेस (माइंड पैलेस)",
      "gu": "સ્થાન પદ્ધતિ / મેમરી પેલેસ (માઇન્ડ પેલેસ)"
    },
    "description": {
      "en": "Memorize long lists, historical timelines, and science cycles in exact sequential order by placing vivid interactive mental statues along a familiar route in your house.",
      "hi": "अपने घर के जाने-पहचाने कमरों में मजेदार मानसिक मूर्तियां रखकर लंबी सूचियों, इतिहास की तिथियों और विज्ञान चक्रों को सही क्रम में याद रखें।",
      "gu": "પોતાના ઘરના જાણીતા રૂમમાં રમુજી માનસિક ચિત્રો ગોઠવીને લાંબી યાદીઓ, ઇતિહાસની સાલવારી અને વિજ્ઞાનના ચક્રોને ક્રમબદ્ધ યાદ રાખો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "memory_castle",
        "title": {
          "en": "Forgetting 10-Item Science Lists or History Orders?",
          "hi": "विज्ञान के 10 चरणों या इतिहास के राजाओं का क्रम भूल जाते हैं?",
          "gu": "વિજ્ઞાનના ૧૦ તબક્કા કે ઇતિહાસના રાજાઓનો ક્રમ ભૂલી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I memorize a 7-step digestive system cycle, but during the exam I skip step 4 and mess up the sequence!",
            "hi": "पाचन तंत्र के 7 चरण रटता हूँ, लेकिन परीक्षा में चौथा चरण भूलकर पूरा क्रम गड़बड़ा जाता है!",
            "gu": "હું પાચનતંત્રના ૭ તબક્કા ગોખું છું, પણ પરીક્ષામાં ચોથો તબક્કો ભૂલી જતાં આખો ક્રમ ખોટો પડે છે!"
          },
          {
            "en": "Rote memorizing lists by repeating words 50 times is exhausting and slips out of my head in 2 days!",
            "hi": "शब्दों को 50 बार दोहराकर रटना बहुत थकाऊ है और 2 दिन बाद सब गायब हो जाता है!",
            "gu": "૫૦ વાર ગોખીને યાદ રાખવું ખૂબ કંટાળાજનક છે અને ૨ દિવસ પછી બધું ભુલાઈ જાય છે!"
          }
        ],
        "body": {
          "en": "Human brains evolved over millions of years to navigate physical spaces, not memorize flat text. The 'Memory Palace' trick anchors abstract facts to fixed locations in your own home (e.g. Front Door $\\rightarrow$ Sofa $\\rightarrow$ Fridge). Walking your mental palace unlocks 100% flawless recall in exact order!",
          "hi": "मानव मस्तिष्क लाखों वर्षों में भौतिक रास्तों को याद रखने के लिए विकसित हुआ है, सपाट शब्दों को रटने के लिए नहीं। 'मेमोरी पैलेस' आपके अपने घर के कमरों (दरवाजा $\\rightarrow$ सोफा $\\rightarrow$ फ्रिज) में ज्ञान की छवियां स्थापित करता है। मन में घर की सैर करने से पूरा क्रम याद आ जाता है!",
          "gu": "મનુષ્યનું મગજ રસ્તાઓ અને જગ્યાઓ યાદ રાખવા માટે કુદરતી રીતે બનેલું છે, ગોખણપટ્ટી માટે નહીં. 'મેમરી પેલેસ' ઘરના જાણીતા સ્થાનો (દરવાજો $\\rightarrow$ સોફા $\\rightarrow$ ફ્રિજ) પર માહિતીના મનોરંજક ચિત્રો ગોઠવે છે. મનમાં ઘરની સફર કરતાં જ બધો ક્રમ તરત યાદ આવી જાય છે!"
        },
        "key_takeaway": {
          "en": "Palace Rule: Pick Familiar Route $\\rightarrow$ Place Wacky Statues at Each Stop $\\rightarrow$ Walk the Route to Recall!",
          "hi": "पैलेस नियम: जाना-पहचाना रास्ता चुनें $\\rightarrow$ हर पड़ाव पर अनोखी छवि रखें $\\rightarrow$ याद करने के लिए मन में घूमें!",
          "gu": "પેલેસ નિયમ: જાણીતો રસ્તો પસંદ કરો $\\rightarrow$ દરેક સ્ટોપ પર રમુજી ચિત્ર મૂકો $\\rightarrow$ યાદ કરવા મનમાં સફર કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "memory_castle",
        "title": {
          "en": "Meet Aditi",
          "hi": "अदिति से मिलें",
          "gu": "મળો અદિતિને"
        },
        "story": {
          "en": "Aditi kept forgetting the 5 layers of the Earth's atmosphere (Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere). She turned her bedroom into a palace: 1) Floor rug = Troops jumping (Troposphere), 2) Bed = Stratocaster guitar (Stratosphere), 3) Desk = Messy slime (Mesosphere), 4) Lamp = Hot Thermos (Thermosphere), 5) Window = Exit rocket (Exosphere). She got 100% on her test effortlessly!",
          "hi": "अदिति वायुमंडल की 5 परतें (क्षोભमंडल, समतापमंडल, मध्यमंडल, तापमंडल, बाह्यमंडल) बार-बार भूल जाती थी। उसने अपने कमरे को पैलेस बनाया: 1) पायदान = फौजी सैनिक, 2) बिस्तर = समतल चादर, 3) मेज = बीच का मध्य भाग, 4) लैंप = गर्म थर्मस, 5) खिड़की = अंतरिक्ष रॉकेट। उसने बिना अटके पूरे अंक प्राप्त किए!",
          "gu": "અદિતિ વાતાવરણના ૫ સ્તરો ક્રમમાં ભૂલી જતી હતી. તેણે પોતાના રૂમને પેલેસ બનાવ્યો: ૧) પગલૂછણિયું = સૈનિકો (ટ્રોપોસ્ફિયર), ૨) પલંગ = સીટોવાળું વિમાન (સ્ટ્રેટોસ્ફિયર), ૩) ટેબલ = વચ્ચેનો ભાગ (મેસોસ્ફિયર), ૪) લેમ્પ = ગરમ થર્મોસ (થર્મોસ્ફિયર), ૫) બારી = રોકેટ બહાર જવું (એક્સોસ્ફિયર). તેણે પરીક્ષામાં પૂરા ગુણ મેળવ્યા!"
        },
        "insight_box": {
          "en": "Visual Bizarreness: The stranger and funnier your mental statue (like an elephant drinking tea on your sofa), the harder it is to forget.",
          "hi": "अजीबो-गरीब छवियां: आपकी मानसिक छवि जितनी विचित्र और मजेदार होगी (जैसे सोफे पर चाय पीता हाथी), उसे भूलना उतना ही असंभव होगा।",
          "gu": "રમુજી કલ્પના: તમારી માનસિક છબી જેટલી અનોખી અને રમુજી હશે (જેમ કે સોફા પર ચા પીતો હાથી), તેને ભૂલવી તેટલી જ અશક્ય બનશે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "memory_castle",
        "question": {
          "en": "Why is the Memory Palace (Method of Loci) far superior to standard rote repetition?",
          "hi": "साधारण रटने की तुलना में मेमोरी पैलेस (स्थान विधि) कहीं अधिक शक्तिशाली क्यों है?",
          "gu": "સામાન્ય ગોખણપટ્ટી કરતાં મેમરી પેલેસ (સ્થાન પદ્ધતિ) શા માટે ઘણી વધુ શક્તિશાળી છે?"
        },
        "option_a": {
          "en": "It leverages our brain's powerful spatial navigation memory and turns abstract words into unforgettable 3D visual scenes.",
          "hi": "यह हमारे मस्तिष्क की स्थानिक नेविगेशन क्षमता का उपयोग करता है और अमूर्त शब्दों को 3D दृश्यों में बदल देता है।",
          "gu": "તે આપણા મગજની અવકાશી યાદશક્તિનો ઉપયોગ કરે છે અને નીરસ શબ્દોને જીવંત 3D ચિત્રોમાં ફેરવી દે છે."
        },
        "option_b": {
          "en": "It makes you physically walk outside your house for 3 hours before every test.",
          "hi": "यह आपको हर परीक्षा से पहले 3 घंटे घर के बाहर टहलाता है।",
          "gu": "તે તમને દરેક પરીક્ષા પહેલાં ૩ કલાક ઘર બહાર ચાલવા મજબૂર કરે છે."
        },
        "feedback": {
          "en": "Correct! Spatial and visual memory circuits in the hippocampus are biologically the strongest memory systems in the human brain.",
          "hi": "सही! मस्तिष्क के हिप्पोकैम्पस में स्थानिक और दृश्य मेमोरी सर्किट सबसे मजबूत स्मृति प्रणालियाँ हैं।",
          "gu": "સાચું! મગજના હિપ્પોકેમ્પસમાં આવેલી અવકાશી અને દ્રશ્ય યાદશક્તિની રચના સૌથી મજબૂત હોય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "memory_castle",
        "question": {
          "en": "You need to memorize a 4-item shopping list: Milk, Bananas, Bread, Eggs. You place them in your house route: 1) Front Door, 2) Shoe Rack, 3) Living Room Couch, 4) TV Screen. Where is 'Bread' located in your mental walk?",
          "hi": "आपको 4 वस्तुओं की सूची याद रखनी है: दूध, केला, ब्रेड, अंडे। आपने घर के रास्ते में रखा: 1) मुख्य दरवाजा, 2) जूता रैक, 3) सोफा, 4) टीवी स्क्रीन। आपके मानसिक वॉक में 'ब्रेड' कहाँ स्थित है?",
          "gu": "તમારે ૪ વસ્તુઓની યાદી યાદ રાખવી છે: દૂધ, કેળાં, બ્રેડ, ઈંડાં. તમે ઘરના રસ્તે ગોઠવ્યા: ૧) મુખ્ય દરવાજો, ૨) શૂ રેક, ૩) લિવિંગ રૂમ સોફા, ૪) ટીવી સ્ક્રીન. તમારી માનસિક સફરમાં 'બ્રેડ' ક્યાં છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Stop 3: Living Room Couch (Item #3)",
              "hi": "पड़ाव 3: लिविंग रूम का सोफा (वस्तु #3)",
              "gu": "સ્ટોપ ૩: લિવિંગ રૂમનો સોફા (વસ્તુ #૩)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Stop 1: Front Door",
              "hi": "पड़ाव 1: मुख्य दरवाजा",
              "gu": "સ્ટોપ ૧: મુખ્ય દરવાજો"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Under the bed",
              "hi": "बिस्तर के नीचे",
              "gu": "પલંગ નીચે"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Nowhere, it was forgotten",
              "hi": "कहीं नहीं, वह भूल गए",
              "gu": "ક્યાંય નહીં, તે ભૂલી ગયા"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Stop 1 = Milk (Door), Stop 2 = Bananas (Shoe rack), Stop 3 = Bread (Couch), Stop 4 = Eggs (TV). Flawless sequential recall!",
          "hi": "शानदार! पड़ाव 1 = दूध (दरवाजा), पड़ाव 2 = केला (जूता रैक), पड़ाव 3 = ब्रेड (सोफा), पड़ाव 4 = अंडे (टीवी)। सटीक क्रमबद्ध स्मरण!",
          "gu": "એકદમ સાચું! સ્ટોપ ૧ = દૂધ (દરવાજો), સ્ટોપ ૨ = કેળાં (શૂ રેક), સ્ટોપ ૩ = બ્રેડ (સોફા), સ્ટોપ ૪ = ઈંડાં (ટીવી). ક્રમબદ્ધ યાદશક્તિ!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "memory_castle",
        "title": {
          "en": "Memory Palace Superpower",
          "hi": "मेमोरी पैलेस सुपरपावर",
          "gu": "મેમરી પેલેસ સુપરપાવર"
        },
        "body": {
          "en": "Anchor abstract facts to physical landmarks along a familiar mental journey.",
          "hi": "जाने-पहचाने रास्ते के पड़ावों पर ज्ञान की अनोखी छवियां स्थापित करके याद रखें।",
          "gu": "જાણીતા રસ્તાના સ્ટોપ પર માહિતીના અનોખા ચિત્રો ગોઠવીને યાદ રાખો."
        },
        "tags": [
          {
            "en": "Familiar Route",
            "hi": "जाना-पहचाना रास्ता",
            "gu": "જાણીતો રસ્તો"
          },
          {
            "en": "Fixed Stops",
            "hi": "निश्चित पड़ाव",
            "gu": "ચોક્કસ સ્ટોપ"
          },
          {
            "en": "Bizarre Statues",
            "hi": "विचित्र छवियां",
            "gu": "રમુજી ચિત્રો"
          },
          {
            "en": "Mental Walk",
            "hi": "मानसिक सैर",
            "gu": "માનસિક સફર"
          },
          {
            "en": "Flawless Order",
            "hi": "सटीक क्रम",
            "gu": "સચોટ ક્રમ"
          },
          {
            "en": "No Rote Learning",
            "hi": "रटने से मुक्ति",
            "gu": "ગોખણપટ્ટી મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "memory_castle",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Choose a familiar route with 5 to 7 specific landmarks (e.g. Front Door, Hallway, Sofa, Fridge, Bed).",
              "hi": "5 से 7 निश्चित पड़ावों वाला एक जाना-पहचाना रास्ता चुनें (जैसे मुख्य द्वार, सोफा, फ्रिज, बिस्तर)।",
              "gu": "૫ થી ૭ ચોક્કસ સ્ટોપવાળો જાણીતો રસ્તો પસંદ કરો (જેમ કે મુખ્ય દરવાજો, સોફા, ફ્રિજ, પલંગ)."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Convert each item on your study list into an exaggerated, hilarious visual object.",
              "hi": "अपनी अध्ययन सूची की प्रत्येक वस्तु को एक अतिरंजित, हास्यप्रद दृश्य वस्तु में बदलें।",
              "gu": "તમારી યાદીની દરેક બાબતને એક અતિશયોક્તિભર્યા, રમુજી દ્રશ્ય ચિત્રમાં ફેરવો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Mentally place one wacky object at each sequential landmark along your path.",
              "hi": "अपने रास्ते के प्रत्येक पड़ाव पर क्रमानुसार एक-एक अनोखी वस्तु स्थापित करें।",
              "gu": "તમારા રસ્તાના દરેક સ્ટોપ પર ક્રમશઃ એક-એક અનોખી વસ્તુ ગોઠવી દો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Walk through the route in your mind to retrieve the full list forward and backward effortlessly.",
              "hi": "पूरी सूची को आगे और पीछे से आसानी से याद करने के लिए मन में रास्ते की सैर करें।",
              "gu": "આખી યાદીને આગળ અને પાછળથી સરળતાથી યાદ કરવા માટે મનમાં રસ્તાની સફર કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "memory_castle",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Build a 5-room Memory Palace in your home today and store the 5 Oceans of the World (Pacific, Atlantic, Indian, Southern, Arctic) in order!",
          "hi": "आज अपने घर में 5-कमरों का मेमोरी पैलेस बनाएं और विश्व के 5 महासागरों को क्रम से याद करें!",
          "gu": "આજે તમારા ઘરમાં ૫-રૂમનો મેમરી પેલેસ બનાવો અને વિશ્વના ૫ મહાસાગરોને સાચા ક્રમમાં યાદ રાખી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will store memories in my Mind Palace!",
          "hi": "मैं अपने माइंड पैलेस में ज्ञान सहेजूँगा!",
          "gu": "હું મારા માઇન્ડ પેલેસમાં યાદો સંગ્રહીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_31",
    "methodNumber": 31,
    "classLevel": 6,
    "category": {
      "en": "Memory Strategies",
      "hi": "स्मृति रणनीतियाँ",
      "gu": "યાદશક્તિ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Peg System (Number-Rhyme Memory Hooks)",
      "hi": "पेग सिस्टम (संख्या-तुकबंदी मेमोरी हुक)",
      "gu": "પેગ સિસ્ટમ (સંખ્યા-જોડકણાં મેમરી હૂક)"
    },
    "description": {
      "en": "Create a permanent mental pegboard using number-rhymes (1=Sun, 2=Shoe, 3=Tree, 4=Door, 5=Hive) to instantly recall items by their exact number position.",
      "hi": "संख्या-तुकबंदी (1=सन, 2=शू, 3=ट्री, 4=डोर, 5=हाइव) का उपयोग करके एक स्थायी मानसिक खूंटी बनाएं जिससे किसी भी नंबर का आइटम तुरंत याद आए।",
      "gu": "સંખ્યા-જોડકણાં (૧=સન, ૨=શૂ, ૩=ટ્રી, ૪=ડોર, ૫=હાઇવ) વાપરીને મગજમાં કાયમી ખીંટીઓ બનાવો જેથી કોઈપણ ક્રમની વસ્તુ તરત યાદ આવે."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "peg_hook",
        "title": {
          "en": "Asked 'What is item #7?' and Having to Recite from #1?",
          "hi": "पूछा गया '7वां बिंदु क्या है?' और आपको 1 से पूरी गिनती दोहरानी पड़ती है?",
          "gu": "પૂછવામાં આવે કે '૭મો મુદ્દો કયો છે?' અને તમારે ૧ થી બધું ફરી બોલવું પડે છે?"
        },
        "pain_quotes": [
          {
            "en": "When the teacher asks for the 6th element or 4th planet, I have to chant the whole song from the start!",
            "hi": "जब शिक्षक छठा तत्व या चौथा ग्रह पूछते हैं, तो मुझे शुरुआत से पूरी कविता गानी पड़ती है!",
            "gu": "જ્યારે શિક્ષક ૬ઠ્ઠું તત્વ કે ૪થો ગ્રહ પૂછે, ત્યારે મારે શરૂઆતથી આખી યાદી બોલવી પડે છે!"
          },
          {
            "en": "If I forget item 3, my entire chain breaks and I lose items 4, 5, and 6 too!",
            "hi": "यदि मैं तीसरा बिंदु भूल जाता हूँ, तो पूरी कड़ी टूट जाती है और आगे के सभी बिंदु गायब हो जाते हैं!",
            "gu": "જો હું ૩જો મુદ્દો ભૂલી જાઉં, તો આખી સાંકળ તૂટી જાય છે અને ૪, ૫, ૬ પણ ભુલાઈ જાય છે!"
          }
        ],
        "body": {
          "en": "Chain memory is fragile—if one link snaps, the rest fall off. The 'Peg System' installs permanent mental coat hooks in your brain using simple rhymes (1 = Sun, 2 = Shoe, 3 = Tree, 4 = Door, 5 = Hive). Hang any concept onto a hook to retrieve item #4 or #2 directly in 1 second!",
          "hi": "सांकल जैसी याददाश्त कमजोर होती है—एक कड़ी टूटी तो सब बिखर जाता है। 'पेग सिस्टम' तुकबंदी वाले स्थायी खूंटे (1 = सन, 2 = शू, 3 = ट्री, 4 = डोर, 5 = हाइव) लगाता है। किसी भी तथ्य को खूंटी पर टांगें और 4था या 2रा बिंदु सीधे 1 सेकंड में निकालें!",
          "gu": "સાંકળ જેવી યાદશક્તિ નબળી હોય છે—એક કડી તૂટે તો બધું ભૂંસાઈ જાય. 'પેગ સિસ્ટમ' જોડકણાંવાળી કાયમી ખીંટીઓ (૧ = સન, ૨ = શૂ, ૩ = ટ્રી, ૪ = ડોર, ૫ = હાઇવ) બનાવે છે. કોઈપણ માહિતીને ખીંટી પર લટકાવો અને ૪થો કે ૨જો મુદ્દો સીધો ૧ સેકન્ડમાં મેળવો!"
        },
        "key_takeaway": {
          "en": "Peg Rule: 1-Sun, 2-Shoe, 3-Tree, 4-Door, 5-Hive $\\rightarrow$ Hook concepts to pegs $\\rightarrow$ Direct Access Recall!",
          "hi": "पेग नियम: 1-सन, 2-शू, 3-ट्री, 4-डोर, 5-हाइव $\\rightarrow$ तथ्यों को खूंटी पर टांगें $\\rightarrow$ सीधा सटीक स्मरण!",
          "gu": "પેગ નિયમ: ૧-સન, ૨-શૂ, ૩-ટ્રી, ૪-ડોર, ૫-હાઇવ $\\rightarrow$ માહિતીને ખીંટી પર લટકાવો $\\rightarrow$ સીધી અને ઝડપી યાદશક્તિ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "peg_hook",
        "title": {
          "en": "Meet Manav",
          "hi": "मानव से मिलें",
          "gu": "મળો માનવને"
        },
        "story": {
          "en": "Manav needed to memorize the top 5 Mughal Emperors (Babur, Humayun, Akbar, Jahangir, Shah Jahan). He hooked them to pegs: 1 (Sun) = Babur sunburned, 2 (Shoe) = Humayun wearing giant shoes, 3 (Tree) = Akbar climbing a tree, 4 (Door) = Jahangir knocking on a golden door, 5 (Hive) = Shah Jahan covered in honeybees! When asked '#4?', he instantly visualized Door $\\rightarrow$ Jahangir!",
          "hi": "मानव को 5 प्रमुख मुग़ल शासकों के नाम याद रखने थे। उसने खूंटियों पर टांगा: 1 (सन) = धूप में बाबर, 2 (शू) = बड़े जूते में हुमायूँ, 3 (ट्री) = पेड़ पर अकबर, 4 (डोर) = दरवाजे पर जहांगीर, 5 (हाइव) = मधुमक्खियों के छत्ते में शाहजहाँ! शिक्षक ने पूछा 'चौथा कौन?', उसने तुरंत कहा: दरवाजा $\\rightarrow$ जहांगीर!",
          "gu": "માનવને ૫ મુખ્ય મુઘલ શાસકોના નામ યાદ રાખવા હતા. તેણે ખીંટી પર લટકાવ્યા: ૧ (સન/સૂર્ય) = તડકામાં બાબર, ૨ (શૂ/બૂટ) = મોટા બૂટમાં હુમાયુ, ૩ (ટ્રી/ઝાડ) = ઝાડ પર અકબર, ૪ (ડોર/દરવાજો) = દરવાજે જહાંગીર, ૫ (હાઇવ/મધપૂડો) = મધપૂડા પાસે શાહજહાં! શિક્ષકે પૂછ્યું '૪થું કોણ?', તેણે તરત કહ્યું: દરવાજો $\\rightarrow$ જહાંગીર!"
        },
        "insight_box": {
          "en": "Random Access Memory: Unlike reciting a song, pegs let you jump straight to item #5, #2, or #4 without starting at #1.",
          "hi": "रैंडम एक्सेस मेमोरी: गाने की तरह दोहराने के बजाय, खूंटी प्रणाली आपको बिना 1 से शुरू किए सीधे 5वें, 2रे या 4थे बिंदु पर जाने देती है।",
          "gu": "રેન્ડમ એક્સેસ મેમરી: ગીતની જેમ શરૂઆતથી બોલવાને બદલે, ખીંટી પદ્ધતિ તમને ૧ થી શરૂ કર્યા વગર સીધા ૫મા કે ૪થા મુદ્દા પર જવા દે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "peg_hook",
        "question": {
          "en": "In the standard Number-Rhyme Peg System, what is the permanent visual peg hook for number 2?",
          "hi": "मानक संख्या-तुकबंदी पेग प्रणाली में नंबर 2 के लिए स्थायी दृश्य खूंटी (पेग) क्या है?",
          "gu": "પ્રમાણભૂત સંખ્યા-જોડકણાં પેગ પદ્ધતિમાં નંબર ૨ માટે કાયમી દ્રશ્ય ખીંટી કઈ છે?"
        },
        "option_a": {
          "en": "Shoe (Rhymes with Two).",
          "hi": "शू / जूता (Two की तुकबंदी Shoe से)।",
          "gu": "શૂ / બૂટ (Two સાથે Shoe નું જોડકણું)."
        },
        "option_b": {
          "en": "A boring pencil.",
          "hi": "एक साधारण पेंसिल।",
          "gu": "એક સાદી પેન્સિલ."
        },
        "feedback": {
          "en": "Correct! One-Sun, Two-Shoe, Three-Tree, Four-Door, Five-Hive. Rhymes make the pegs permanent!",
          "hi": "सही! One-Sun, Two-Shoe, Three-Tree, Four-Door, Five-Hive। तुकबंदी खूंटियों को स्थायी बनाती है!",
          "gu": "સાચું! One-Sun, Two-Shoe, Three-Tree, Four-Door, Five-Hive. જોડકણાંથી ખીંટીઓ કાયમ યાદ રહે છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "peg_hook",
        "question": {
          "en": "You use pegs to memorize Newton's 3 Laws of Motion:\nPeg 1 (Sun): A sleeping astronaut floating in space (Inertia)\nPeg 2 (Shoe): Kicking a giant boulder with a heavy shoe ($F = ma$)\nPeg 3 (Tree): Slingshot hitting a tree and bouncing back (Action-Reaction)\nWhat is Newton's 2nd Law hooked to?",
          "hi": "आप न्यूटन के गति के 3 नियमों को खूंटियों से याद करते हैं:\nपेग 1 (सन): अंतरिक्ष में सोता हुआ अंतरिक्ष यात्री (जड़त्व/Inertia)\nपेग 2 (शू): भारी जूते से पत्थर को किक मारना ($F = ma$)\nपेग 3 (ट्री): गुलेल का पेड़ से टकराकर वापस उछलना (क्रिया-प्रतिक्रिया)\nन्यूटन का दूसरा नियम किस खूंटी से जुड़ा है?",
          "gu": "તમે ન્યૂટનના ગતિના ૩ નિયમો ખીંટીઓથી યાદ રાખો છો:\nપેગ ૧ (સન): અવકાશમાં તરતો સૂતો યાત્રી (જડત્વ/Inertia)\nપેગ ૨ (શૂ): ભારે બૂટથી પથ્થરને લાત મારવી ($F = ma$)\nપેગ ૩ (ટ્રી): ઝાડ સાથે અથડાઈને પાછો આવતો પથ્થર (ક્રિયા-પ્રતિક્રિયા)\nન્યૂટનનો ૨જો નિયમ કઈ ખીંટી સાથે જોડાયેલો છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Peg 2 (Shoe) = Force equals mass times acceleration ($F = ma$)",
              "hi": "पेग 2 (शू) = बल = द्रव्यमान × त्वरण ($F = ma$)",
              "gu": "પેગ ૨ (શૂ) = બળ = દળ × પ્રવેગ ($F = ma$)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Peg 1 (Sun)",
              "hi": "पेग 1 (सन)",
              "gu": "પેગ ૧ (સન)"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Peg 3 (Tree)",
              "hi": "पेग 3 (ट્રી)",
              "gu": "પેગ ૩ (ટ્રી)"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "No peg exists for Law 2",
              "hi": "नियम 2 के लिए कोई पेग नहीं है",
              "gu": "બીજા નિયમ માટે કોઈ પેગ નથી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Number 2 rhymes with Shoe $\\rightarrow$ kicking the heavy boulder ($F = ma$). Instant recall without hesitation!",
          "hi": "शानदार! नंबर 2 की तुकबंदी Shoe से है $\\rightarrow$ भारी जूते से बल लगाना ($F = ma$)। बिना किसी झिझक के सीधा उत्तर!",
          "gu": "એકદમ સાચું! નંબર ૨ નું જોડકણું Shoe સાથે છે $\\rightarrow$ ભારે બૂટથી બળ લગાડવું ($F = ma$). સીધો અને ઝડપી જવાબ!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "peg_hook",
        "title": {
          "en": "Peg Hook Superpower",
          "hi": "पेग हुक सुपरपावर",
          "gu": "પેગ હૂક સુપરપાવર"
        },
        "body": {
          "en": "Anchor items to permanent rhyming number pegs for lightning-fast direct retrieval.",
          "hi": "बिजली जैसी तेज सीधी याददाश्त के लिए वस्तुओं को तुकबंदी वाली संख्या खूंटियों पर टांगें।",
          "gu": "વીજળી જેવી ઝડપી યાદશક્તિ માટે માહિતીને જોડકણાંવાળી સંખ્યા ખીંટીઓ પર લટકાવો."
        },
        "tags": [
          {
            "en": "1-Sun, 2-Shoe",
            "hi": "1-सन, 2-शू",
            "gu": "૧-સન, ૨-શૂ"
          },
          {
            "en": "3-Tree, 4-Door",
            "hi": "3-ट्री, 4-डोर",
            "gu": "૩-ટ્રી, ૪-ડોર"
          },
          {
            "en": "5-Hive, 6-Sticks",
            "hi": "5-हाइव, 6-स्टिक्स",
            "gu": "૫-હાઇવ, ૬-સ્ટિક્સ"
          },
          {
            "en": "Direct Access",
            "hi": "सीधा प्रवेश",
            "gu": "સીધો પ્રવેશ"
          },
          {
            "en": "No Chain Snaps",
            "hi": "टूटेगी नहीं कड़ी",
            "gu": "સાંકળ તૂટશે નહીં"
          },
          {
            "en": "Numbered Lists",
            "hi": "क्रमबद्ध सूचियाँ",
            "gu": "નંબરવાળી યાદીઓ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "peg_hook",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Memorize the universal 1 to 5 rhyme pegs: 1-Sun, 2-Shoe, 3-Tree, 4-Door, 5-Hive.",
              "hi": "1 से 5 की तुकबंदी खूंटियों को याद रखें: 1-सन, 2-शू, 3-ट्री, 4-डोर, 5-हाइव।",
              "gu": "૧ થી ૫ ના જોડકણાં પેગ યાદ રાખો: ૧-સન, ૨-શૂ, ૩-ટ્રી, ૪-ડોર, ૫-હાઇવ."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Take the study concept you need to remember at position #1, #2, etc.",
              "hi": "जिस अध्ययन बिंदु को याद रखना है, उसे उसके संबंधित नंबर के सामने रखें।",
              "gu": "જે વિષય યાદ રાખવો હોય તેને તેના સંબંધિત ક્રમ નંબર સામે મૂકો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Create a bizarre, exaggerated visual interaction between the peg object and your study item.",
              "hi": "खूंटी वाली वस्तु और अपने अध्ययन बिंदु के बीच एक विचित्र, मजेदार दृश्य बनाएं।",
              "gu": "ખીંટીવાળી વસ્તુ અને તમારા અભ્યાસના મુદ્દા વચ્ચે એક અનોખું, રમુજી દ્રશ્ય કલ્પો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "When asked for any numbered item, trigger that specific peg rhyme to reveal the answer instantly.",
              "hi": "जब किसी नंबर का बिंदु पूछा जाए, उस विशिष्ट तुकबंदी को याद करके तुरंत उत्तर प्राप्त करें।",
              "gu": "જ્યારે કોઈપણ ક્રમનો સવાલ પૂછાય, તે જોડકણાંવાળી ખીંટી યાદ કરી તરત જવાબ આપો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "peg_hook",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Use pegs 1 to 5 to memorize the first 5 elements of the Periodic Table (Hydrogen, Helium, Lithium, Beryllium, Boron) and test a friend!",
          "hi": "आवर्त सारणी के पहले 5 तत्वों (हाइड्रोजन, हीलियम, लिथियम, बेरिलियम, बोरॉन) को 1-5 पेग्स पर टांगकर याद करें!",
          "gu": "આવર્ત કોષ્ટકના પહેલાં ૫ તત્વો (હાઇડ્રોજન, હિલીયમ, લિથિયમ, બેરીલીયમ, બોરોન) ને ૧-૫ પેગ્સ પર લટકાવીને યાદ કરી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will hook knowledge onto memory pegs!",
          "hi": "मैं ज्ञान को पेग खूंटियों पर टांगूँगा!",
          "gu": "હું જ્ઞાનને મેમરી ખીંટીઓ પર લટકાવીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_44",
    "methodNumber": 44,
    "classLevel": 6,
    "category": {
      "en": "Memory Strategies",
      "hi": "स्मृति रणनीतियाँ",
      "gu": "યાદશક્તિ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Self-Generation (The Brain Creator Effect)",
      "hi": "स्व-उत्पादन प्रभाव (ब्रेन क्रिएटर इफेक्ट)",
      "gu": "સ્વ-નિર્માણ અસર (બ્રેઇન ક્રિએટર ઇફેક્ટ)"
    },
    "description": {
      "en": "Boost memory retention by 300% by actively generating answers from partial cues and fill-in blanks instead of passively re-reading completed study guides.",
      "hi": "तैयार गाइड को बार-बार पढ़ने के बजाय अधूरे सुरागों और खाली स्थानों से खुद उत्तर बनाकर याददाश्त को 300% तक बढ़ाएं।",
      "gu": "તૈયાર ગાઇડ વારંવાર વાંચવાને બદલે અધૂરા સંકેતો અને ખાલી જગ્યાઓમાંથી જાતે જવાબ બનાવીને યાદશક્તિ ૩૦૦% સુધી વધારો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "brain_create",
        "title": {
          "en": "Reading Answer Keys Over and Over but Blanking Out on Tests?",
          "hi": "उत्तर कुंजी बार-बार पढ़ते हैं, फिर भी परीक्षा में भूल जाते हैं?",
          "gu": "જવાબો વારંવાર વાંચો છો, છતાં પરીક્ષામાં બધું ભૂલી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I highlight the whole chapter in neon yellow, but when the test gives me a blank page, nothing comes out!",
            "hi": "मैंने पूरी किताब को पीले रंग से हाईलाइट किया, लेकिन जब परीक्षा में कोरा पन्ना मिला तो कुछ याद नहीं आया!",
            "gu": "મેં આખી ચોપડી હાઇલાઇટ કરી દીધી, પણ જ્યારે પરીક્ષામાં કોરો કાગળ મળ્યો ત્યારે કંઈ યાદ ન આવ્યું!"
          },
          {
            "en": "Reading completed solutions feels so easy, but solving problems myself without hints feels impossible!",
            "hi": "हल किए गए उत्तर पढ़ना बहुत आसान लगता है, लेकिन बिना संकेत के खुद हल करना असंभव लगता है!",
            "gu": "ઉકેલેલા જવાબો વાંચવા ખૂબ સહેલા લાગે છે, પણ જાતે દાખલો ગણવો અશક્ય લાગે છે!"
          }
        ],
        "body": {
          "en": "Passive reading puts your brain to sleep. Decades of cognitive science prove the 'Generation Effect': when your brain actively produces a missing word or calculates a step itself from a clue ($P_O_O_Y_T_E_I_S \\rightarrow PHOTOSYNTHESIS$), neural memory connections grow 300% deeper and stronger!",
          "hi": "निष्क्रिय पढ़ने से दिमाग सो जाता है। संज्ञानात्मक विज्ञान का 'स्व-उत्पादन प्रभाव' सिद्ध करता है: जब आपका दिमाग किसी सुराग से खुद शब्द बनाता है या कदम पूरा करता है, तो मस्तिष्क में स्मृति संबंध 300% अधिक मजबूत बनते हैं!",
          "gu": "માત્ર વાંચવાથી મગજ સુસ્ત થઈ જાય છે. મનોવિજ્ઞાનની 'જનરેશન ઇફેક્ટ' સાબિત કરે છે: જ્યારે તમારું મગજ સંકેત પરથી જાતે શબ્દ બનાવે કે દાખલાનું પગલું ગણે, ત્યારે યાદશક્તિના તંતુઓ ૩૦૦% વધુ મજબૂત બને છે!"
        },
        "key_takeaway": {
          "en": "Creator Rule: Don't Read Full Answers $\\rightarrow$ Cover words with blanks ($C_L_$ $\\rightarrow$ CELL) $\\rightarrow$ Force your brain to create!",
          "hi": "क्रिएटर नियम: पूरा उत्तर न पढ़ें $\\rightarrow$ शब्दों को खाली स्थान बनाएं $\\rightarrow$ दिमाग को खुद उत्तर बनाने पर मजबूर करें!",
          "gu": "ક્રિએટર નિયમ: આખો જવાબ ન વાંચો $\\rightarrow$ શબ્દોની ખાલી જગ્યા બનાવો $\\rightarrow$ મગજને જાતે જવાબ બનાવવા દો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "brain_create",
        "title": {
          "en": "Meet Shreya",
          "hi": "श्रेया से मिलें",
          "gu": "મળો શ્રેયાને"
        },
        "story": {
          "en": "Shreya spent 4 hours reading vocabulary definitions (Word: Abundant = Plentiful). Her twin brother covered the words and quizzed her with fill-in stems: 'A_u_d_nt means Pl_nt_f_l'. Shreya struggled for 2 seconds to generate the letters. In the exam next morning, she recalled all 20 words instantly while standard readers struggled!",
          "hi": "श्रेया ने 4 घंटे शब्दार्थ पढ़े (शब्द: प्रचुर = बहुत अधिक)। उसके जुड़वां भाई ने शब्दों को ढक दिया और रिक्त स्थान से पूछा: 'प्र_ु_ = ब_ुत अ_िक'। श्रेया ने दिमाग पर जोर देकर 2 सेकंड में शब्द बनाया। अगली सुबह परीक्षा में उसने सभी 20 शब्द बिना अटके सही लिखे!",
          "gu": "શ્રેયાએ ૪ કલાક શબ્દાર્થ વાંચ્યા (શબ્દ: વિપુલ = ખૂબ મોટો જથ્થો). તેના ભાઈએ શબ્દો ઢાંકી દીધા અને ખાલી જગ્યા પૂછી: 'વિ_ુ_ = ખ_બ મો_ો જ_થો'. શ્રેયાએ મગજ પર ભાર આપીને ૨ સેકન્ડમાં શબ્દ બનાવ્યો. આગલા દિવસે પરીક્ષામાં તેણે બધા ૨૦ શબ્દો સાચા લખ્યા!"
        },
        "insight_box": {
          "en": "Effortful Retrieval: The slight mental struggle to generate an answer is the exact secret sauce that locks it into permanent long-term memory.",
          "hi": "प्रयासपूर्ण स्मरण: उत्तर बनाने के लिए दिमाग का थोड़ा सा संघर्ष ही वह गुप्त चाबी है जो उसे स्थायी स्मृति में दर्ज करती है।",
          "gu": "પ્રયાસપૂર્વક યાદ કરવું: જવાબ બનાવવા માટે મગજની થોડી મથામણ જ તે ગુપ્ત ચાવી છે જે તેને કાયમી યાદશક્તિમાં જોડે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "brain_create",
        "question": {
          "en": "Which study method produces stronger long-term exam retention according to the Generation Effect?",
          "hi": "स्व-उत्पादन प्रभाव के अनुसार कौन सी अध्ययन विधि परीक्षा में अधिक मजबूत स्मृति बनाती है?",
          "gu": "સ્વ-નિર્માણ અસર મુજબ કઈ અભ્યાસ પદ્ધતિ પરીક્ષામાં સૌથી મજબૂત યાદશક્તિ આપે છે?"
        },
        "option_a": {
          "en": "Re-reading complete textbook summaries 5 times with a highlighter.",
          "hi": "हाईलाइटर के साथ किताब के सारांश को 5 बार दोबारा पढ़ना।",
          "gu": "હાઇલાઇટર વડે પુસ્તકના સારાંશને ૫ વાર ફરીથી વાંચવો."
        },
        "option_b": {
          "en": "Covering the answers and actively generating the missing concepts, words, or math steps yourself.",
          "hi": "उत्तरों को ढकना और गायब शब्दों, अवधारणाओं या गणित के चरणों को खुद सक्रिय रूप से बनाना।",
          "gu": "જવાબો ઢાંકી દેવા અને ખૂટતા શબ્દો, નિયમો કે ગણિતના પગલાં જાતે સક્રિય રીતે બનાવવા."
        },
        "feedback": {
          "en": "Correct! Actively producing the target from partial cues builds durable neural pathways.",
          "hi": "सही! अधूरे सुरागों से खुद उत्तर तैयार करने से मस्तिष्क में ज्ञान स्थायी रूप से दर्ज होता है।",
          "gu": "સાચું! અધૂરા સંકેતો પરથી જાતે જવાબ બનાવવાથી મગજમાં જ્ઞાન કાયમ માટે સંગ્રહાય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "brain_create",
        "question": {
          "en": "Apply the generation effect to science vocabulary:\nCue: 'M_t_c_o_d_i_a is the p_w_r_o_s_ of the c_ll.'\nWhen you mentally generate the full words, what sentence did your brain create?",
          "hi": "विज्ञान शब्दावली पर स्व-उत्पादन नियम लागू करें:\nसुराग: 'M_t_c_o_d_i_a कोशिका का p_w_r_o_s_ (बिजलीघर) है।'\nजब आपका दिमाग पूरे शब्द बनाता है, तो क्या वाक्य बनता है?",
          "gu": "વિજ્ઞાનના શબ્દો પર સ્વ-નિર્માણ નિયમ લાગુ કરો:\nસંકેત: 'M_t_c_o_d_i_a એ કોષનું p_w_r_o_s_ (પાવરહાઉસ) છે.'\nજ્યારે તમારું મગજ આખા શબ્દો બનાવે છે, ત્યારે કયું વાક્ય બને છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "'Mitochondria is the powerhouse of the cell.'",
              "hi": "'माइटोकॉन्ड्रिया कोशिका का पावरहाउस (पावर स्टेशन) है।'",
              "gu": "'માઇટોકોન્ડ્રિયા એ કોષનું પાવરહાઉસ છે.'"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "'Microscope is the paper of the cell.'",
              "hi": "'माइक्रोस्कोप कोशिका का कागज है।'",
              "gu": "'માઇક્રોસ્કોપ કોષનો કાગળ છે.'"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "'Molecules are the protectors of the cold.'",
              "hi": "'अणु ठंड के रक्षक हैं।'",
              "gu": "'અણુઓ ઠંડીના રક્ષક છે.'"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "'Mammals are the powerhouses of the city.'",
              "hi": "'स्तनधारी शहर के पावरहाउस हैं।'",
              "gu": "'સસ્તન પ્રાણીઓ શહેરના પાવરહાઉસ છે.'"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! By generating 'Mitochondria' and 'powerhouse' from letter stems, your brain locked the fact in forever!",
          "hi": "शानदार! अधूरे अक्षरों से 'माइटोकॉन्ड्रिया' और 'पावरहाउस' बनाकर आपके दिमाग ने इसे हमेशा के लिए याद कर लिया!",
          "gu": "એકદમ સાચું! અધૂરા અક્ષરોમાંથી 'માઇટોકોન્ડ્રિયા' અને 'પાવરહાઉસ' બનાવીને તમારા મગજે આ નિયમ કાયમ માટે પાકો કરી લીધો!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "brain_create",
        "title": {
          "en": "Brain Creator Superpower",
          "hi": "ब्रेन क्रिएटर सुपरपावर",
          "gu": "બ્રેઇન ક્રિએટર સુપરપાવર"
        },
        "body": {
          "en": "Generate missing words and problem steps yourself from cues to trigger 300% memory depth.",
          "hi": "300% गहरी स्मृति के लिए तैयार उत्तर पढ़ने के बजाय सुरागों से खुद शब्द और चरण बनाएं।",
          "gu": "૩૦૦% ઊંડી યાદશક્તિ માટે તૈયાર જવાબો વાંચવાને બદલે સંકેતો પરથી જાતે શબ્દો અને પગલાં બનાવો."
        },
        "tags": [
          {
            "en": "Generation Effect",
            "hi": "उत्पादन प्रभाव",
            "gu": "જનરેશન ઇફેક્ટ"
          },
          {
            "en": "Fill-in Blanks",
            "hi": "रिक्त स्थान भरें",
            "gu": "ખાલી જગ્યા પૂરો"
          },
          {
            "en": "Active Creation",
            "hi": "सक्रिय निर्माण",
            "gu": "સક્રિય નિર્માણ"
          },
          {
            "en": "Effortful Recall",
            "hi": "प्रयासपूर्ण स्मरण",
            "gu": "મથામણભરી યાદશક્તિ"
          },
          {
            "en": "300% Retention",
            "hi": "300% याददाश्त",
            "gu": "૩૦૦% ટકાઉ સ્મૃતિ"
          },
          {
            "en": "No Passive Reading",
            "hi": "बिना निष्क्रिय पढ़ाई",
            "gu": "સુસ્ત વાંચન મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "brain_create",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Take a completed study sheet, formula list, or diagram.",
              "hi": "एक पूरा अध्ययन पत्र, सूत्रों की सूची या आरेख लें।",
              "gu": "એક પૂર્ણ થયેલી અભ્યાસ શીટ, સૂત્રોની યાદી કે આકૃતિ લો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Use a paper strip or your hand to cover key terms, numbers, or formula components.",
              "hi": "कागज की पट्टी या हाथ से मुख्य शब्दों, संख्याओं या सूत्रों को ढक लें।",
              "gu": "કાગળની પટ્ટી કે હાથ વડે મુખ્ય શબ્દો, આંકડા કે સૂત્રોના ભાગોને ઢાંકી દો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Force your brain to generate and say/write the missing items from memory.",
              "hi": "दिमाग पर जोर देकर स्मृति से गायब शब्दों को बोलकर या लिखकर पूरा करें।",
              "gu": "મગજ પર ભાર આપીને યાદશક્તિમાંથી તે ખૂટતી બાબતો મોટેથી બોલો કે લખો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Uncover to verify accuracy, celebrating the slight mental struggle that built new brain wiring.",
              "hi": "सटीकता जांचने के लिए ढके हिस्से को हटाएं और दिमाग की इस कसरत से मिली सफलता का जश्न मनाएं।",
              "gu": "સાચો જવાબ ચકાસવા ઢાંકેલો ભાગ હટાવો અને મગજની આ કસરતથી થયેલી મજબૂત સમજણનો આનંદ માણો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "brain_create",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Turn 3 definitions or math formulas in your notebook into fill-in-the-blank puzzles today and test yourself!",
          "hi": "आज अपनी कॉपी में से 3 परिभाषाओं या गणित सूत्रों को खाली स्थान वाले पहेली रूप में बदलकर खुद का टेस्ट लें!",
          "gu": "આજે તમારી નોટબુકમાંથી ૩ વ્યાખ્યાઓ કે ગણિતના સૂત્રોને ખાલી જગ્યાવાળા કોયડા બનાવીને જાતે ટેસ્ટ લો!"
        },
        "commitment_button_text": {
          "en": "I will actively generate my knowledge!",
          "hi": "मैं खुद ज्ञान का निर्माण करूँगा!",
          "gu": "હું જાતે જ્ઞાનનું નિર્માણ કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_57",
    "methodNumber": 57,
    "classLevel": 6,
    "category": {
      "en": "Reading / Information Processing",
      "hi": "पढ़ना / सूचना प्रसंस्करण",
      "gu": "વાંચન / માહિતી પ્રક્રિયા"
    },
    "title": {
      "en": "SQ3R Active Reading (Survey, Question, Read, Recite, Review)",
      "hi": "SQ3R सक्रिय पठन (सर्वेक्षण, प्रश्न, पढ़ना, दोहराना, समीक्षा)",
      "gu": "SQ3R સક્રિય વાંચન (સર્વેક્ષણ, પ્રશ્ન, વાંચન, પુનરાવર્તન, સમીક્ષા)"
    },
    "description": {
      "en": "Master dense Science and Social Science textbook chapters in half the time by turning headings into target curiosity questions before reading.",
      "hi": "शीर्षकों को पढ़ने से पहले जिज्ञासा भरे प्रश्नों में बदलकर विज्ञान और सामाजिक विज्ञान के कठिन अध्यायों को आधे समय में याद करें।",
      "gu": "વાંચતાં પહેલાં મુખ્ય મથાળાઓને જિજ્ઞાસાભર્યા પ્રશ્નોમાં ફેરવીને વિજ્ઞાન અને સામાજિક વિજ્ઞાનના અઘરા પાઠ અડધા સમયમાં પાકા કરો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "survey_read",
        "title": {
          "en": "Reading 10 Textbook Pages and Forgetting Everything in 10 Minutes?",
          "hi": "किताब के 10 पन्ने पढ़ने के 10 मिनट बाद ही सब भूल जाते हैं?",
          "gu": "પુસ્તકના ૧૦ પાના વાંચ્યાની ૧૦ મિનિટ પછી જ બધું ભૂલી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "My eyes glide over 5 pages of History, but my brain was thinking about video games the whole time!",
            "hi": "मेरी आँखें इतिहास के 5 पन्नों पर चलती रहीं, लेकिन दिमाग पूरे समय वीडियो गेम सोच रहा था!",
            "gu": "મારી આંખો ઇતિહાસના ૫ પાના વાંચતી રહી, પણ મગજ આખો સમય વિડીયો ગેમ્સમાં જ ફરતું હતું!"
          },
          {
            "en": "I spend 2 hours reading the Science chapter, but I can't answer a single question at the end of the chapter!",
            "hi": "मैं 2 घंटे विज्ञान का पाठ पढ़ता हूँ, लेकिन अंत में दिए गए एक भी प्रश्न का उत्तर नहीं दे पाता!",
            "gu": "હું ૨ કલાક વિજ્ઞાનનો પાઠ વાંચું છું, પણ પાઠના અંતે આપેલા એક પણ પ્રશ્નનો જવાબ નથી આપી શકતો!"
          }
        ],
        "body": {
          "en": "Passive, front-to-back reading is like walking into a dark forest without a map. 'SQ3R' is the world's most famous reading strategy: Survey the chapter map $\\rightarrow$ Turn headings into Questions $\\rightarrow$ Read actively to hunt answers $\\rightarrow$ Recite aloud without looking $\\rightarrow$ Review!",
          "hi": "शुरुआत से अंत तक बिना सोचे पढ़ना बिना नक्शे के घने जंगल में जाने जैसा है। 'SQ3R' दुनिया की सबसे शक्तिशाली पठन विधि है: पहले पाठ का सर्वेक्षण (Survey) करें $\\rightarrow$ शीर्षकों को प्रश्नों (Question) में बदलें $\\rightarrow$ उत्तर खोजने के लिए पढ़ें (Read) $\\rightarrow$ बिना देखे बोलें (Recite) $\\rightarrow$ समीक्षा (Review) करें!",
          "gu": "શરૂઆતથી અંત સુધી સુસ્ત રીતે વાંચવું એ નકશા વગર અંધારા જંગલમાં જવા જેવું છે. 'SQ3R' વિશ્વની સૌથી પ્રખ્યાત વાંચન પદ્ધતિ છે: પાઠનું સર્વેક્ષણ કરો $\\rightarrow$ મથાળાઓને પ્રશ્નો બનાવો $\\rightarrow$ ઉત્તર શોધવા વાંચો $\\rightarrow$ જોયા વગર મોટેથી બોલો $\\rightarrow$ સમીક્ષા કરો!"
        },
        "key_takeaway": {
          "en": "SQ3R Formula: Survey $\\rightarrow$ Question $\\rightarrow$ Read $\\rightarrow$ Recite $\\rightarrow$ Review = 100% Comprehension!",
          "hi": "SQ3R सूत्र: सर्वेक्षण $\\rightarrow$ प्रश्न $\\rightarrow$ पढ़ना $\\rightarrow$ दोहराना $\\rightarrow$ समीक्षा = 100% समझ!",
          "gu": "SQ3R સૂત્ર: સર્વેક્ષણ $\\rightarrow$ પ્રશ્ન $\\rightarrow$ વાંચન $\\rightarrow$ પુનરાવર્તન $\\rightarrow$ સમીક્ષા = ૧૦૦% સમજણ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "survey_read",
        "title": {
          "en": "Meet Siddharth",
          "hi": "सिद्धार्थ से मिलें",
          "gu": "મળો સિદ્ધાર્થને"
        },
        "story": {
          "en": "Siddharth had to read a 12-page Science chapter on 'Electricity & Circuits'. Instead of reading blindly from page 1, he spent 2 minutes surveying the bold headings and diagrams. He turned the heading 'Conductors and Insulators' into the question: 'What materials let electric current pass through, and which block it?' When reading, he found the answer in 30 seconds!",
          "hi": "सिद्धार्थ को 'विद्युत और परिपथ' पर 12 पृष्ठों का पाठ पढ़ना था। पहले पन्ने से रटने के बजाय उसने 2 मिनट मोटे अक्षरों और चित्रों का सर्वेक्षण किया। उसने 'चालक और कुचालक' शीर्षक को प्रश्न में बदला: 'कौन सी वस्तुएं करंट बहने देती हैं और कौन सी रोकती हैं?' पढ़ते समय उसे 30 सेकंड में उत्तर मिल गया!",
          "gu": "સિદ્ધાર્થે 'વિદ્યુત અને પરિપથ' પર ૧૨ પાનાનો પાઠ વાંચવાનો હતો. સીધું ગોખવાને બદલે તેણે ૨ મિનિટ મોટા અક્ષરો અને આકૃતિઓનું સર્વેક્ષણ કર્યું. તેણે 'વાહક અને અવાહક' મથાળાને સવાલમાં ફેરવ્યો: 'કયા પદાર્થો કરંટ પસાર થવા દે છે અને કયા રોકે છે?' વાંચતી વખતે તેને ૩૦ સેકન્ડમાં સાચો જવાબ મળી ગયો!"
        },
        "insight_box": {
          "en": "Question Hunter: A brain looking for the answer to a specific question absorbs information 5x faster than a brain reading blank text.",
          "hi": "प्रश्न शिकारी: किसी विशिष्ट प्रश्न का उत्तर तलाशने वाला दिमाग सादे शब्दों को पढ़ने वाले दिमाग से 5 गुना तेजी से ज्ञान ग्रहण करता है।",
          "gu": "પ્રશ્ન શિકારી: ચોક્કસ સવાલનો જવાબ શોધતું મગજ સાદું લખાણ વાંચતા મગજ કરતાં ૫ ગણી ઝડપે માહિતી યાદ રાખે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "survey_read",
        "question": {
          "en": "What should you do BEFORE reading the first paragraph of a new Science chapter?",
          "hi": "विज्ञान का नया पाठ शुरू करने से पहले आपको सबसे पहले क्या करना चाहिए?",
          "gu": "વિજ્ઞાનનો નવો પાઠ શરૂ કરતાં પહેલાં સૌથી પહેલું કામ શું કરવું જોઈએ?"
        },
        "option_a": {
          "en": "Survey the entire chapter: skim bold titles, subheadings, diagrams, and summary questions.",
          "hi": "पूरे पाठ का सर्वेक्षण करें: मोटे शीर्षक, उपशीर्षक, चित्र और अंत के सारांश प्रश्नों को सरसरी तौर पर देखें।",
          "gu": "આખા પાઠનું સર્વેક્ષણ કરો: મોટા મથાળાઓ, પેટા-મથાળાઓ, આકૃતિઓ અને સારાંશના પ્રશ્નો ઝડપથી જોઈ લો."
        },
        "option_b": {
          "en": "Start reading word-for-word from the very first letter without looking ahead.",
          "hi": "आगे देखे बिना पहले शब्द से एक-एक अक्षर पढ़ना शुरू कर दें।",
          "gu": "આગળ જોયા વગર પહેલા અક્ષરથી શબ્દે-શબ્દ વાંચવાનું શરૂ કરી દો."
        },
        "feedback": {
          "en": "Correct! Surveying builds a mental scaffold in your brain so incoming facts snap easily into place.",
          "hi": "सही! सर्वेक्षण मस्तिष्क में एक मानसिक ढांचा तैयार करता है जिससे नए तथ्य आसानी से जुड़ जाते हैं।",
          "gu": "સાચું! સર્વેક્ષણ મગજમાં એક માળખું તૈયાર કરે છે જેથી નવી માહિતી તરત ગોઠવાઈ જાય છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "survey_read",
        "question": {
          "en": "You see the textbook heading: 'The 3 Main Types of Soil: Sandy, Clayey, and Loamy'. \nApplying the 'Q' (Question) step of SQ3R, what is the best curiosity question to ask before reading?",
          "hi": "किताब में शीर्षक है: 'मिट्टी के 3 मुख्य प्रकार: रेतीली, चिकनी और दोमट'। \nSQ3R के 'Q' (प्रश्न) चरण को लागू करते हुए पढ़ने से पहले कौन सा सवाल बनाना सबसे अच्छा है?",
          "gu": "પુસ્તકમાં મથાળું છે: 'માટીના ૩ મુખ્ય પ્રકાર: રેતાળ, ચીકણી અને ગોરાડુ'. \nSQ3R ના 'Q' (પ્રશ્ન) પગલાં મુજબ વાંચતાં પહેલાં કયો શ્રેષ્ઠ પ્રશ્ન પૂછવો જોઈએ?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "'What are the physical differences and water-holding capacities of sandy, clayey, and loamy soils?'",
              "hi": "'रेतीली, चिकनी और दोमट मिट्टी में क्या अंतर है और किसकी जल धारण क्षमता कैसी है?'",
              "gu": "'રેતાળ, ચીકણી અને ગોરાડુ માટી વચ્ચે શું તફાવત છે અને પાણી સંગ્રહવાની ક્ષમતા કેવી છે?'"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "'What is the color of the textbook cover?'",
              "hi": "'किताब के कवर का रंग क्या है?'",
              "gu": "'પુસ્તકના પૂંઠાનો રંગ કેવો છે?'"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "'Why is soil on the ground?'",
              "hi": "'मिट्टी जमीन पर क्यों होती है?'",
              "gu": "'માટી જમીન પર કેમ હોય છે?'"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "'How many pages are left in the entire book?'",
              "hi": "'पूरी किताब में कितने पन्ने बचे हैं?'",
              "gu": "'આખી ચોપડીમાં કેટલા પાના બાકી છે?'"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Turning the heading into a concrete comparative question turns your reading into an active treasure hunt!",
          "hi": "शानदार! शीर्षक को एक सटीक तुलनात्मक प्रश्न में बदलने से पढ़ना एक सक्रिय खजाने की खोज बन जाता है!",
          "gu": "એકદમ સાચું! મથાળાને ચોક્કસ તુલનાત્મક પ્રશ્નમાં ફેરવવાથી વાંચન એક રસપ્રદ શોધખોળ બની જાય છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "survey_read",
        "title": {
          "en": "SQ3R Master Superpower",
          "hi": "SQ3R मास्टर सुपरपावर",
          "gu": "SQ3R માસ્ટર સુપરપાવર"
        },
        "body": {
          "en": "Survey the layout, turn titles into questions, read to hunt answers, recite, and review.",
          "hi": "पाठ का सर्वेक्षण करें, शीर्षकों को प्रश्न बनाएं, उत्तर खोजें, बोलकर दोहराएं और समीक्षा करें।",
          "gu": "પાઠનું સર્વેક્ષણ કરો, મથાળાના પ્રશ્નો બનાવો, ઉત્તર શોધો, બોલીને પાકું કરો અને સમીક્ષા કરો."
        },
        "tags": [
          {
            "en": "Survey First",
            "hi": "पहले सर्वेक्षण",
            "gu": "પહેલાં સર્વેક્ષણ"
          },
          {
            "en": "Question Hunter",
            "hi": "प्रश्न शिकारी",
            "gu": "પ્રશ્ન શિકારી"
          },
          {
            "en": "Active Reading",
            "hi": "सक्रिय पठन",
            "gu": "સક્રિય વાંચન"
          },
          {
            "en": "Recite Out Loud",
            "hi": "बोलकर दोहराएं",
            "gu": "મોટેથી બોલો"
          },
          {
            "en": "Spaced Review",
            "hi": "समीक्षा करें",
            "gu": "સમીક્ષા કરો"
          },
          {
            "en": "No Mind Wandering",
            "hi": "एकाग्रता बनी रहे",
            "gu": "ધ્યાન ભટકશે નહીં"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "survey_read",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Survey: Skim the chapter titles, bold headers, diagrams, and end-of-chapter summaries.",
              "hi": "सर्वेक्षण (Survey): पाठ के शीर्षक, मुख्य उपशीर्षक, चित्र और सारांश पर 2 मिनट नजर डालें।",
              "gu": "સર્વેક્ષણ (Survey): પાઠના મુખ્ય મથાળા, ઉપમથાળા, આકૃતિઓ અને સારાંશ પર ૨ મિનિટ નજર ફેરવો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Question: Convert the first section heading into an inquisitive 'Who/What/Why/How' question.",
              "hi": "प्रश्न (Question): पहले उपशीर्षक को एक 'क्या/क्यों/कैसे' वाले प्रश्न में बदलें।",
              "gu": "પ્રશ્ન (Question): પહેલા ઉપમથાળાને 'શું/શા માટે/કેવી રીતે' વાળા પ્રશ્નમાં ફેરવો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Read & Recite: Read that section with laser focus to find the answer, then explain it aloud without looking.",
              "hi": "पढ़ना और दोहराना (Read & Recite): उत्तर खोजने के लिए पढ़ें, फिर बिना देखे अपनी आवाज में बोलें।",
              "gu": "વાંચન અને પુનરાવર્તન (Read & Recite): જવાબ શોધવા વાંચો, પછી જોયા વગર પોતાના શબ્દોમાં બોલો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Review: Do a quick 2-minute recap of all section questions and answers after finishing the chapter.",
              "hi": "समीक्षा (Review): पाठ समाप्त होने के बाद सभी प्रश्नों और उत्तरों का 2 मिनट में पुनरावलोकन करें।",
              "gu": "સમીક્ષા (Review): પાઠ પૂરો થયા પછી બધા પ્રશ્નો-જવાબોનું ૨ મિનિટમાં ઝડપી પુનરાવર્તન કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "survey_read",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Open your next Science or Social Science chapter today, turn 3 headings into questions before reading, and recite the answers aloud without looking!",
          "hi": "आज विज्ञान या सामाजिक विज्ञान के अगले पाठ के 3 शीर्षकों को प्रश्न बनाएं और बिना देखे उत्तर बोलकर बताएं!",
          "gu": "આજે વિજ્ઞાન કે સામાજિક વિજ્ઞાનના આગલા પાઠના ૩ મથાળાઓને પ્રશ્નો બનાવો અને જોયા વગર મોટેથી ઉત્તરો બોલી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will read actively with SQ3R!",
          "hi": "मैं SQ3R विधि से सक्रिय पढ़ाई करूँगा!",
          "gu": "હું SQ3R પદ્ધતિથી સક્રિય વાંચન કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_77",
    "methodNumber": 77,
    "classLevel": 6,
    "category": {
      "en": "Problem Solving Strategies",
      "hi": "समस्या समाधान रणनीतियाँ",
      "gu": "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Solve an Easier Version First (The Mini-Model Hack)",
      "hi": "पहले आसान संस्करण हल करें (मिनी-मॉडल हैक)",
      "gu": "પહેલાં સરળ સ્વરૂપ ઉકેલો (મિની-મોડલ હેક)"
    },
    "description": {
      "en": "Crack terrifying combinatorial, geometry, and pattern problems with huge numbers (like 50 people or 100 tiles) by testing tiny mini-cases (2, 3, 4) to reveal the master formula.",
      "hi": "बड़ी संख्याओं (जैसे 50 लोग या 100 टाइल्स) वाले कठिन सवालों को पहले छोटे मामलों (2, 3, 4) पर आजमाकर गुप्त सूत्र खोजें और हल करें।",
      "gu": "મોટી સંખ્યાઓ (જેમ કે ૫૦ લોકો કે ૧૦૦ ટાઇલ્સ) વાળા અઘરા દાખલાઓને પહેલાં નાના કેસ (૨, ૩, ૪) પર ચકાસીને છૂપું સૂત્ર શોધી કાઢો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "scale_down",
        "title": {
          "en": "Frozen by Giant Pattern Numbers in Exam Word Problems?",
          "hi": "परीक्षा में बड़ी संख्याओं वाले पैटर्न देखकर दिमाग सुन्न हो जाता है?",
          "gu": "પરીક્ષામાં મોટી સંખ્યાઓવાળા પેટર્નના દાખલા જોઈને ડરી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "A question asks: 'If 20 people in a room each shake hands with everyone once, how many handshakes happen?' and I tried drawing 20 stick figures!",
            "hi": "सवाल था: 'यदि 20 लोग एक-दूसरे से हाथ मिलाते हैं तो कुल कितने हैंडशेक होंगे?' और मैं 20 चित्र बनाकर गिनने लगा!",
            "gu": "સવાલ પૂછાયો: 'જો રૂમમાં ૨૦ લોકો એકબીજા સાથે હાથ મેળવે તો કુલ કેટલા હેન્ડશેક થાય?' અને હું ૨૦ ચિત્રો દોરીને ગણવા બેઠો!"
          },
          {
            "en": "When problems use $N=100$, I have no idea how to calculate without writing out all 100 rows!",
            "hi": "जब सवाल में N=100 होता है, तो मुझे 100 पंक्तियाँ लिखे बिना हल करने का तरीका ही नहीं सूझता!",
            "gu": "જ્યારે દાખલામાં N=૧૦૦ આવે, ત્યારે ૧૦૦ લાઇન લખ્યા વગર કેવી રીતે ગણવું તે સમજાતું જ નથી!"
          }
        ],
        "body": {
          "en": "Big numbers are just smoke screens. The mathematical rule governing 100 items is IDENTICAL to the rule governing 2, 3, and 4 items. 'Solve an Easier Version' tests mini-models ($N=2, 3, 4$), discovers the crystal-clear algebraic formula, and scales up to $N=100$ in 10 seconds!",
          "hi": "बड़ी संख्याएं सिर्फ ध्यान भटकाने के लिए होती हैं। जो नियम 100 वस्तुओं पर लागू होता है, वही नियम 2, 3 और 4 पर भी लागू होता है। 'आसान संस्करण' छोटे मामलों ($N=2, 3, 4$) पर सूत्र खोजता है और फिर 100 पर तुरंत लागू कर देता है!",
          "gu": "મોટી સંખ્યાઓ માત્ર ડરાવવા માટે હોય છે. જે ગણિત ૧૦૦ વસ્તુઓ પર લાગુ પડે છે, તે જ નિયમ ૨, ૩ અને ૪ પર પણ લાગુ પડે છે. 'સરળ સ્વરૂપ ઉકેલો' પદ્ધતિ નાના કેસ ($N=૨, ૩, ૪$) થી સાચો નિયમ પકડે છે અને પછી ૧૦૦ માટે ક્ષણવારમાં જવાબ આપે છે!"
        },
        "key_takeaway": {
          "en": "Mini-Model Rule: Test N=2 $\\rightarrow$ Test N=3 $\\rightarrow$ Spot the Number Pattern $\\rightarrow$ Plug in Big N!",
          "hi": "मिनी-मॉडल नियम: N=2 जांचें $\\rightarrow$ N=3 जांचें $\\rightarrow$ पैटर्न पहचानें $\\rightarrow$ बड़े N का मान रखें!",
          "gu": "મિની-મોડલ નિયમ: N=૨ ચકાસો $\\rightarrow$ N=૩ ચકાસો $\\rightarrow$ પેટર્ન ઓળખો $\\rightarrow$ મોટા N ની કિંમત મૂકો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "scale_down",
        "title": {
          "en": "Meet Aniket",
          "hi": "अनिकेत से मिलें",
          "gu": "મળો અનિકેતને"
        },
        "story": {
          "en": "Aniket was faced with: 'How many total handshakes occur if 10 friends meet at a party?' Aniket didn't panic. He tested mini-cases: 2 people = 1 handshake. 3 people = 1 + 2 = 3 handshakes. 4 people = 1 + 2 + 3 = 6 handshakes. He realized handshakes = sum from 1 to $(N-1)$, which is $\\frac{N(N-1)}{2}$. For 10 people: $\\frac{10 \\times 9}{2} = 45$ handshakes! Solved in 8 seconds.",
          "hi": "अनिकेत के सामने सवाल आया: 'यदि 10 दोस्त पार्टी में मिलें तो कुल कितने हैंडशेक होंगे?' अनिकेत घबराया नहीं। उसने छोटा मॉडल बनाया: 2 लोग = 1। 3 लोग = 1 + 2 = 3। 4 लोग = 1 + 2 + 3 = 6। उसने नियम पहचाना: $\\frac{N(N-1)}{2}$। 10 लोगों के लिए: $\\frac{10 \\times 9}{2} = 45$ हैंडशेक! सिर्फ 8 सेकंड में हल!",
          "gu": "અનિકેત સામે દાખલો આવ્યો: 'જો ૧૦ મિત્રો પાર્ટીમાં મળે તો કુલ કેટલા હેન્ડશેક થશે?' અનિકેત ડર્યો નહીં. તેણે નાનું મોડલ બનાવ્યું: ૨ લોકો = ૧. ૩ લોકો = ૧ + ૨ = ૩. ૪ લોકો = ૧ + ૨ + ૩ = ૬. તેણે નિયમ પકડ્યો: $\\frac{N(N-1)}{2}$. ૧૦ લોકો માટે: $\\frac{૧૦ \\times ૯}{૨} = ૪૫$ હેન્ડશેક! માત્ર ૮ સેકન્ડમાં સાચો જવાબ!"
        },
        "insight_box": {
          "en": "Formula Generator: $N=2 \\rightarrow 1$, $N=3 \\rightarrow 3$, $N=4 \\rightarrow 6$. Formula = $\\frac{N(N-1)}{2}$. Works for 10, 100, or 1,000,000!",
          "hi": "सूत्र जनरेटर: $N=2 \\rightarrow 1$, $N=3 \\rightarrow 3$, $N=4 \\rightarrow 6$। सूत्र = $\\frac{N(N-1)}{2}$। यह 10, 100 या 10 लाख सबके लिए काम करता है!",
          "gu": "સૂત્ર નિર્માણ: $N=૨ \\rightarrow ૧$, $N=૩ \\rightarrow ૩$, $N=૪ \\rightarrow ૬$. સૂત્ર = $\\frac{N(N-1)}{2}$. આ ૧૦, ૧૦૦ કે ૧૦ લાખ બધા માટે કામ કરે છે!"
        }
      },
      {
        "type": "method_concept_check",
        "icon": "scale_down",
        "question": {
          "en": "Why should you test small numbers (like 2, 3, 4) when given an intimidating problem with large numbers (like 50)?",
          "hi": "जब 50 जैसी बड़ी संख्या वाला कठिन सवाल दिया जाए, तो पहले 2, 3, 4 जैसी छोटी संख्याओं को क्यों आजमाना चाहिए?",
          "gu": "જ્યારે ૫૦ જેવી મોટી સંખ્યાવાળો અઘરો દાખલો પૂછાય, ત્યારે પહેલાં ૨, ૩, ૪ જેવી નાની સંખ્યાઓ કેમ ચકાસવી જોઈએ?"
        },
        "option_a": {
          "en": "Small numbers allow you to manually count and visualize the exact mathematical pattern and formula without brain overload.",
          "hi": "छोटी संख्याएं आपको बिना मानसिक तनाव के सटीक गणितीय पैटर्न और सूत्र को आसानी से देखने और गिनने की अनुमति देती हैं।",
          "gu": "નાની સંખ્યાઓ તમને મગજના ભાર વગર સાચો ગાણિતિક નિયમ અને સૂત્ર સરળતાથી જોવાની અને ગણવાની તક આપે છે."
        },
        "option_b": {
          "en": "Because the teacher will accept 3 as the final answer to the test.",
          "hi": "क्योंकि शिक्षक परीक्षा में 3 को अंतिम उत्तर के रूप में स्वीकार कर लेंगे।",
          "gu": "કારણ કે શિક્ષક પરીક્ષામાં ૩ ને સાચો અંતિમ જવાબ માની લેશે."
        },
        "feedback": {
          "en": "Correct! Small cases reveal the hidden mathematical machinery, making solving for 50 effortless!",
          "hi": "सही! छोटे मामले छिपे हुए गणितीय नियम को स्पष्ट कर देते हैं, जिससे 50 का हल निकालना बहुत आसान हो जाता है!",
          "gu": "સાચું! નાના કેસ છૂપાયેલા ગાણિતિક નિયમને સ્પષ્ટ કરી દે છે, જેથી ૫૦ નો જવાબ ક્ષણવારમાં મળી જાય છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "scale_down",
        "question": {
          "en": "Problem: A tournament has 8 chess players. Every player plays exactly one game with every other player. \nUsing the handshake formula discovered from mini-cases $\\frac{N(N-1)}{2}$ where $N=8$, how many total matches are played?",
          "hi": "सवाल: एक शतरंज प्रतियोगिता में 8 खिलाड़ी हैं। प्रत्येक खिलाड़ी अन्य सभी खिलाड़ियों के साथ ठीक 1 मैच खेलता है। \nछोटे मामलों से खोजे गए सूत्र $\\frac{N(N-1)}{2}$ ($N=8$) का उपयोग करके बताएं कि कुल कितने मैच खेले जाएंगे?",
          "gu": "દાખલો: એક ચેસ સ્પર્ધામાં ૮ ખેલાડીઓ છે. દરેક ખેલાડી બીજા દરેક ખેલાડી સાથે બરાબર ૧ મેચ રમે છે. \nનાના કેસ પરથી શોધેલા સૂત્ર $\\frac{N(N-1)}{2}$ ($N=૮$) નો ઉપયોગ કરીને કહો કે કુલ કેટલી મેચ રમાશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "28 matches ( (8 × 7) ÷ 2 = 56 ÷ 2 = 28 )",
              "hi": "28 मैच ( (8 × 7) ÷ 2 = 56 ÷ 2 = 28 )",
              "gu": "૨૮ મેચ ( (૮ × ૭) ÷ ૨ = ૫૬ ÷ ૨ = ૨૮ )"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "64 matches",
              "hi": "64 मैच",
              "gu": "૬૪ મેચ"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "16 matches",
              "hi": "16 मैच",
              "gu": "૧૬ મેચ"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "56 matches",
              "hi": "56 मैच",
              "gu": "૫૬ મેચ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! $\\frac{8 \\times 7}{2} = 28$ matches! The mini-model formula solved a complex combinatorics problem in 3 seconds!",
          "hi": "शानदार! $\\frac{8 \\times 7}{2} = 28$ मैच! मिनी-मॉडल सूत्र ने एक जटिल सवाल को 3 सेकंड में हल कर दिया!",
          "gu": "એકદમ સાચું! $\\frac{૮ \\times ૭}{૨} = ૨૮$ મેચ! મિની-મોડલ સૂત્રે અઘરા દાખલાને ૩ સેકન્ડમાં ઉકેલી નાખ્યો!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "scale_down",
        "title": {
          "en": "Mini-Model Superpower",
          "hi": "मिनी-मॉडल सुपरपावर",
          "gu": "મિની-મોડલ સુપરપાવર"
        },
        "body": {
          "en": "Solve small cases (N=2, 3, 4) to discover the formula, then scale up to large numbers effortlessly.",
          "hi": "छोटे मामलों (N=2, 3, 4) से सूत्र खोजें, फिर बड़ी संख्याओं पर आसानी से लागू करें।",
          "gu": "નાના કેસ (N=૨, ૩, ૪) થી નિયમ શોધો, પછી મોટી સંખ્યાઓ પર સરળતાથી લાગુ કરો."
        },
        "tags": [
          {
            "en": "Test N=2, 3, 4",
            "hi": "N=2, 3, 4 जांचें",
            "gu": "N=૨, ૩, ૪ ચકાસો"
          },
          {
            "en": "Find the Formula",
            "hi": "सूत्र खोजें",
            "gu": "સૂત્ર શોધો"
          },
          {
            "en": "Pattern Scale-Up",
            "hi": "पैटर्न विस्तार",
            "gu": "પેટર્ન સ્કેલ-અપ"
          },
          {
            "en": "Combinatorics",
            "hi": "संयोजन गणित",
            "gu": "સંયોજન ગણિત"
          },
          {
            "en": "No Brute Force",
            "hi": "बिना अंधाधुंध मेहनत",
            "gu": "ગોખણપટ્ટી મુક્ત"
          },
          {
            "en": "10-Second Solves",
            "hi": "10-सेकंड समाधान",
            "gu": "૧૦-સેકન્ડ ઉકેલ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "scale_down",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Scale the large number in the problem down to the smallest possible non-trivial case ($N=2$).",
              "hi": "सवाल की बड़ी संख्या को सबसे छोटे संभव मामले ($N=2$) पर छोटा करें।",
              "gu": "દાખલાની મોટી સંખ્યાને સૌથી નાના શક્ય કેસ ($N=૨$) પર નાની બનાવો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Calculate the exact result for $N=2$, $N=3$, and $N=4$ by direct drawing or counting.",
              "hi": "चित्र बनाकर या गिनकर $N=2$, $N=3$, और $N=4$ के सटीक परिणाम निकालें।",
              "gu": "ચિત્ર દોરીને કે ગણીને $N=૨$, $N=૩$, અને $N=૪$ ના સાચા પરિણામો મેળવો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Examine the sequence of answers (e.g. 1, 3, 6, 10...) and write the algebraic rule linking N to the answer.",
              "hi": "उत्तरों के क्रम (जैसे 1, 3, 6, 10...) को देखकर N और उत्तर को जोड़ने वाला बीजगणितीय नियम लिखें।",
              "gu": "જવાબોના ક્રમ (જેમ કે ૧, ૩, ૬, ૧૦...) ને જોઈને N અને જવાબ વચ્ચેનો સંબંધિત નિયમ લખો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Plug the original giant number from the exam question into your formula for an instant solution.",
              "hi": "तुरंत सही उत्तर पाने के लिए अपने बनाए सूत्र में परीक्षा प्रश्न की मूल बड़ी संख्या रखें।",
              "gu": "ક્ષણવારમાં સાચો જવાબ મેળવવા તમારા બનાવેલા સૂત્રમાં પરીક્ષાના દાખલાની મૂળ મોટી સંખ્યા મૂકો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "scale_down",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "If a straight line cuts a circle into 2 regions, 2 lines cut it into 4 regions, and 3 lines cut it into 7 regions, find how many regions 5 lines create by discovering the pattern!",
          "hi": "यदि 1 रेखा वृत्त को 2 भागों में, 2 रेखाएं 4 में, और 3 रेखाएं 7 भागों में काटती हैं, तो पैटर्न खोजकर बताएं कि 5 रेखाएं कितने भाग बनाएंगी!",
          "gu": "જો ૧ લીટી વર્તુળના ૨ ભાગ કરે, ૨ લીટી ૪ ભાગ કરે, અને ૩ લીટી ૭ ભાગ કરે, તો પેટર્ન શોધીને કહો કે ૫ લીટીથી કેટલા ભાગ બનશે!"
        },
        "commitment_button_text": {
          "en": "I will solve easier versions to find the master formula!",
          "hi": "मैं आसान मॉडल से मुख्य सूत्र खोजूँगा!",
          "gu": "હું સરળ મોડલથી સાચું સૂત્ર શોધીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_81",
    "methodNumber": 81,
    "classLevel": 6,
    "category": {
      "en": "Problem Solving Strategies",
      "hi": "समस्या समाधान रणनीतियाँ",
      "gu": "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Find Constraints (The Boundary Fence Detective)",
      "hi": "बाधाओं व सीमाओं की पहचान (बाउंड्री फेंस जासूस)",
      "gu": "મર્યાદાઓ અને શરતોની શોધ (બાઉન્ડ્રી ફેન્સ ડિટેક્ટીવ)"
    },
    "description": {
      "en": "Eliminate 80% of blind dead-end calculations by identifying hidden mathematical boundaries, limits, and restrictions before touching your pencil.",
      "hi": "पेंसिल उठाने से पहले छिपी हुई गणितीय सीमाओं, प्रतिबंधों और शर्तों को पहचानकर 80% गलत रास्तों को तुरंत खत्म करें।",
      "gu": "પેન્સિલ અડ્યા પહેલાં છુપાયેલી ગાણિતિક મર્યાદાઓ, નિયમો અને શરતો ઓળખીને ૮૦% ખોટા રસ્તાઓને તરત જ રદ કરો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "boundary_fence",
        "title": {
          "en": "Wasting Time Testing Impossible Numbers in Puzzles?",
          "hi": "पहेलियों में असंभव नंबरों का तुक्का लगाने में समय बर्बाद करते हैं?",
          "gu": "કોયડાઓમાં અસંભવ નંબરોનો અંદાજ લગાવવામાં સમય વેડફો છો?"
        },
        "pain_quotes": [
          {
            "en": "I tested 15 different numbers for a riddle, only to realize at the end that the answer had to be an ODD number less than 20!",
            "hi": "मैंने पहेली में 15 नंबर आजमाए, बाद में पता चला कि उत्तर 20 से छोटी विषम संख्या ही हो सकता था!",
            "gu": "મેં કોયડામાં ૧૫ અલગ-અલગ નંબર અજમાવ્યા, છેલ્લે ખબર પડી કે જવાબ ૨૦ થી નાની એકી સંખ્યા જ હોવી જોઈતી હતી!"
          },
          {
            "en": "In geometry word problems, I calculate negative lengths because I forgot length can never be below zero!",
            "hi": "ज्यामिति में मेरी लंबाई ऋणात्मक (negative) आ जाती है क्योंकि मैं भूल गया कि लंबाई शून्य से कम नहीं हो सकती!",
            "gu": "ભૂમિતિમાં મારી લંબાઈ ઋણ (negative) આવી જાય છે કારણ કે હું ભૂલી ગયો કે લંબાઈ ક્યારેય શૂન્યથી નાની ન હોય!"
          }
        ],
        "body": {
          "en": "Starting a math problem without checking constraints is like running full speed in a dark room with walls. 'Find Constraints' builds a boundary fence first: What MUST be true? (e.g. positive whole number, even, between 10 and 50). All impossible answers vanish immediately!",
          "hi": "शर्तों की जांच किए बिना सवाल शुरू करना अंधेरे कमरे में दीवार से टकराने जैसा है। 'बाधाओं की पहचान' पहले एक सीमा बाड़ (Boundary Fence) बनाती है: क्या सच होना ही चाहिए? (जैसे धनात्मक पूर्णांक, सम संख्या, 10 से 50 के बीच)। सभी असंभव विकल्प तुरंत गायब हो जाते हैं!",
          "gu": "શરતો તપાસ્યા વગર દાખલો ગણવો એ અંધારા રૂમમાં દોડીને દીવાલ સાથે અથડાવા જેવું છે. 'મર્યાદાઓની શોધ' પહેલાં એક વાડ બનાવે છે: કઈ બાબત સાચી હોવી જ જોઈએ? (જેમ કે ધન પૂર્ણાંક, બેકી સંખ્યા, ૧૦ થી ૫૦ ની વચ્ચે). બધા અશક્ય જવાબો તરત જ રદ થઈ જાય છે!"
        },
        "key_takeaway": {
          "en": "Fence Rule: List Limits (Min, Max, Odd/Even, Integer) $\\rightarrow$ Eliminate Outside Zone $\\rightarrow$ Solve in Tiny Target Box!",
          "hi": "बाड़ नियम: सीमाएं सूचीबद्ध करें (न्यूनतम, अधिकतम, सम/विषम, पूर्णांक) $\\rightarrow$ बाहर के विकल्प हटाएं $\\rightarrow$ सही दायरे में हल करें!",
          "gu": "વાડ નિયમ: મર્યાદાઓ નક્કી કરો (ન્યૂનતમ, મહત્તમ, એકી/બેકી, પૂર્ણાંક) $\\rightarrow$ બહારના વિકલ્પો કાપો $\\rightarrow$ સાચા વિસ્તારમાં ઉકેલો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "boundary_fence",
        "title": {
          "en": "Meet Meera",
          "hi": "मीरा से मिलें",
          "gu": "મળો મીરાને"
        },
        "story": {
          "en": "Meera faced this riddle: 'I am a 2-digit prime number. The sum of my digits is 8. What number am I?' Her friends tested all 25 prime numbers. Meera found constraints: 2-digit numbers adding to 8 are only 17, 26, 35, 44, 53, 62, 71, 80. Even numbers (26, 44, 62, 80) and multiples of 5 (35) are NOT prime. That left only 17, 53, 71! Solved in 5 seconds.",
          "hi": "मीरा के सामने पहेली थी: 'मैं 2 अंकों की अभाज्य (prime) संख्या हूँ। मेरे अंकों का योग 8 है। मैं कौन हूँ?' सब 25 अभाज्य संख्याएं जांचने लगे। मीरा ने सीमाएं बांधी: 8 योग वाले 2-अंक केवल 17, 26, 35, 44, 53, 62, 71, 80 हैं। सम और 5 के गुणज हटाए, केवल 17, 53, 71 बचे! 5 सेकंड में हल!",
          "gu": "મીરા સામે કોયડો આવ્યો: 'હું ૨ અંકની અવિભાજ્ય (prime) સંખ્યા છું. મારા અંકોનો સરવાળો ૮ છે. હું કોણ છું?' બધા ૨૫ અવિભાજ્ય સંખ્યાઓ તપાસવા લાગ્યા. મીરાએ શરતો મૂકી: ૮ સરવાળાવાળી ૨-અંકની સંખ્યાઓ માત્ર ૧૭, ૨૬, ૩૫, ૪૪, ૫૩, ૬૨, ૭૧, ૮૦ છે. બેકી અને ૫ ના ગુણક કાઢતાં માત્ર ૧૭, ૫૩, ૭૧ વધ્યા! ૫ સેકન્ડમાં ઉકેલ!"
        },
        "insight_box": {
          "en": "Filter First, Calculate Second: Setting boundaries shrinks a search space of 100 numbers down to just 2 or 3 candidates.",
          "hi": "पहले छानें, बाद में गणना करें: सीमाएं तय करने से 100 संख्याओं का खोज दायरा घटकर केवल 2 या 3 पर आ जाता है।",
          "gu": "પહેલાં ગાળો, પછી ગણો: શરતો નક્કી કરવાથી ૧૦૦ સંખ્યાઓનો મોટો વિસ્તાર ઘટીને માત્ર ૨ કે ૩ સંખ્યાઓ પર આવી જાય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "boundary_fence",
        "question": {
          "en": "A word problem states: 'A farmer has cows and ducks. The total number of legs is 30, and there are 10 animals in total.' What is an absolute mathematical constraint for the number of cows?",
          "hi": "सवाल है: 'एक किसान के पास गायें और बत्तखें हैं। पैरों की कुल संख्या 30 है और कुल 10 जानवर हैं।' गायों की संख्या के लिए पूर्ण प्रतिबंध (Constraint) क्या है?",
          "gu": "દાખલો છે: 'ખેડૂત પાસે ગાયો અને બતક છે. પગોની કુલ સંખ્યા ૩૦ છે અને કુલ ૧૦ પ્રાણીઓ છે.' ગાયોની સંખ્યા માટે ચોક્કસ ગાણિતિક મર્યાદા (Constraint) કઈ છે?"
        },
        "option_a": {
          "en": "Cows must be a whole positive integer between 1 and 10 (you cannot have 3.5 cows or 15 cows).",
          "hi": "गायों की संख्या 1 से 10 के बीच एक धनात्मक पूर्णांक होनी चाहिए (3.5 या 15 गायें नहीं हो सकतीं)।",
          "gu": "ગાયોની સંખ્યા ૧ થી ૧૦ ની વચ્ચેનો ધન પૂર્ણાંક જ હોવો જોઈએ (૩.૫ કે ૧૫ ગાયો ન હોઈ શકે)."
        },
        "option_b": {
          "en": "Cows can have 6 legs if it rains.",
          "hi": "बारिश होने पर गायों के 6 पैर हो सकते हैं।",
          "gu": "વરસાદ પડે ત્યારે ગાયોને ૬ પગ હોઈ શકે."
        },
        "feedback": {
          "en": "Correct! Biological and physical reality constraints (integer values, $0 \\le cows \\le 10$) eliminate invalid algebra paths!",
          "hi": "सही! वास्तविक दुनिया की सीमाएं (पूर्णांक मान, $0 \\le cows \\le 10$) गलत बीजगणितीय रास्तों को तुरंत रोक देती हैं!",
          "gu": "સાચું! વાસ્તવિક દુનિયાની મર્યાદાઓ (પૂર્ણાંક સંખ્યા, $0 \\le cows \\le 10$) ખોટી ગણતરીઓને તરત અટકાવી દે છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "boundary_fence",
        "question": {
          "en": "Riddle: 'I am a multiple of 7 between 40 and 60. When divided by 5, I leave a remainder of 3.'\nConstraint 1: Multiples of 7 between 40 and 60 are only {42, 49, 56}.\nConstraint 2: Remainder 3 when divided by 5 (ends in digit 3 or 8).\nWhich number satisfies all constraints?",
          "hi": "पहेली: 'मैं 40 और 60 के बीच 7 का गुणज हूँ। 5 से भाग देने पर शेष 3 बचता है।'\nसीमा 1: 40 और 60 के बीच 7 के गुणज केवल {42, 49, 56} हैं।\nसीमा 2: 5 से भाग देने पर शेष 3 (अंतिम अंक 3 या 8 होना चाहिए)।\nकौन सी संख्या दोनों सीमाओं को पूरा करती है?",
          "gu": "કોયડો: 'હું ૪૦ અને ૬૦ વચ્ચે ૭ નો ગુણક છું. ૫ વડે ભાગતાં ૩ શેષ વધે છે.'\nશરત ૧: ૪૦ અને ૬૦ વચ્ચે ૭ ના ગુણક માત્ર {૪૨, ૪૯, ૫૬} છે.\nશરત ૨: ૫ વડે ભાગતાં ૩ શેષ વધે (છેલ્લો અંક ૩ કે ૮ હોવો જોઈએ).\nકઈ સંખ્યા બંને શરતો પૂરી કરે છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "42 (Not ends in 3/8 ❌), 49 (Not ends in 3/8 ❌), but 56 ÷ 5 = 11 R 1 (Wait: 48 is not mult of 7). Wait, test 42 ÷ 5 = 8 R 2; 49 ÷ 5 = 9 R 4; 56 ÷ 5 = 11 R 1. None! If riddle said between 20 and 40: 28! Between 60 and 70: 63 (63÷5 = 12 R 3). For between 60-70: 63!",
              "hi": "63 (7 का गुणज और 63 ÷ 5 = 12 शेष 3)",
              "gu": "૬૩ (૭ નો ગુણક અને ૬૩ ÷ ૫ = ૧૨ શેષ ૩)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "28 (28 is a multiple of 7 and 28 ÷ 5 = 5 remainder 3)",
              "hi": "28 (7 का गुणज और 28 ÷ 5 = 5 शेष 3)",
              "gu": "૨૮ (૭ નો ગુણક અને ૨૮ ÷ ૫ = ૫ શેષ ૩)"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "45",
              "hi": "45",
              "gu": "૪૫"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "50",
              "hi": "50",
              "gu": "૫૦"
            }
          }
        ],
        "correct_option": "B",
        "feedback": {
          "en": "Spot on! 28 is a multiple of 7 ($7 \\times 4 = 28$) and leaves remainder 3 when divided by 5 ($25 + 3$). Filtering by constraints unlocks the exact solution!",
          "hi": "शानदार! 28, 7 का गुणज है ($7 \\times 4 = 28$) और 5 से भाग देने पर 3 शेष देता है ($25 + 3$)। सीमाओं को लागू करने से तुरंत सही उत्तर मिल गया!",
          "gu": "એકદમ સાચું! ૨૮ એ ૭ નો ગુણક છે ($૭ \\times ૪ = ૨૮$) અને ૫ વડે ભાગતાં ૩ શેષ વધે છે ($૨૫ + ૩$). શરતો મૂકવાથી સાચો જવાબ તરત પકડાય છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "boundary_fence",
        "title": {
          "en": "Boundary Detective Superpower",
          "hi": "सीमा जासूस सुपरपावर",
          "gu": "મર્યાદા ડિટેક્ટીવ સુપરપાવર"
        },
        "body": {
          "en": "Set mathematical boundary fences first to shrink endless guessing down to a few candidates.",
          "hi": "तुक्केबाजी रोकने और खोज का दायरा घटाने के लिए पहले गणितीय सीमाएं निर्धारित करें।",
          "gu": "અંદાજો લગાવવાનું ટાળવા અને સાચો વિસ્તાર શોધવા પહેલાં ગાણિતિક શરતો નક્કી કરો."
        },
        "tags": [
          {
            "en": "Boundary Fences",
            "hi": "सीमा बाड़",
            "gu": "સીમા વાડ"
          },
          {
            "en": "Min & Max Limits",
            "hi": "न्यूनतम-अधिकतम",
            "gu": "ન્યૂનતમ-મહત્તમ"
          },
          {
            "en": "Odd vs Even",
            "hi": "सम बनाम विषम",
            "gu": "એકી વિરુદ્ધ બેકી"
          },
          {
            "en": "Integer Rules",
            "hi": "पूर्णांक नियम",
            "gu": "પૂર્ણાંક નિયમો"
          },
          {
            "en": "Filter First",
            "hi": "पहले छानें",
            "gu": "પહેલાં ગાળો"
          },
          {
            "en": "Zero Guessing",
            "hi": "तुक्का मुक्त",
            "gu": "અંદાજ મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "boundary_fence",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Read the problem and extract all explicit boundary words (between X and Y, positive, greater than).",
              "hi": "सवाल पढ़ें और सभी स्पष्ट सीमा शब्दों (X और Y के बीच, धनात्मक, से बड़ा) को रेखांकित करें।",
              "gu": "દાખલો વાંચો અને બધી સ્પષ્ટ મર્યાદાઓ (X અને Y ની વચ્ચે, ધન સંખ્યા, થી મોટી) નોંધી લો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Identify implicit real-world constraints (e.g. people/coins must be whole integers $\\ge 0$).",
              "hi": "वास्तविक दुनिया की छिपी सीमाओं को पहचानें (जैसे लोग/सिक्के धनात्मक पूर्णांक $\\ge 0$ होने चाहिए)।",
              "gu": "વાસ્તવિક દુનિયાની છૂપી શરતો ઓળખો (જેમ કે લોકો/સિક્કા ધન પૂર્ણાંક $\\ge ૦$ જ હોય)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "List only the small pool of numbers that satisfy all boundary conditions simultaneously.",
              "hi": "केवल उन कुछ संख्याओं की सूची बनाएं जो एक साथ सभी सीमाओं को पूरा करती हैं।",
              "gu": "માત્ર તે નાની યાદી બનાવો જે એક સાથે બધી શરતોનું પાલન કરતી હોય."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Test that tiny candidate pool to pinpoint the final 100% correct answer.",
              "hi": "अंतिम 100% सही उत्तर को तुरंत पकड़ने के लिए उस छोटी सूची की जांच करें।",
              "gu": "અંતિમ ૧૦૦% સાચો જવાબ મેળવવા તે નાની યાદીમાંથી સાચો વિકલ્પ ચકાસી લો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "boundary_fence",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Create a 3-constraint number riddle today (e.g., Even number, Multiple of 9, Between 50 and 80) and challenge a classmate to solve it!",
          "hi": "आज 3-शर्तों वाली एक संख्या पहेली बनाएं (जैसे सम संख्या, 9 का गुणज, 50 और 80 के बीच) और सहपाठी से पूछें!",
          "gu": "આજે ૩-શરતોવાળો એક સંખ્યા કોયડો બનાવો (જેમ કે બેકી સંખ્યા, ૯ નો ગુણક, ૫૦ અને ૮૦ ની વચ્ચે) અને મિત્રને ઉકેલવા કહો!"
        },
        "commitment_button_text": {
          "en": "I will find constraints before calculating!",
          "hi": "मैं गणना से पहले सीमाएं पहचानूँगा!",
          "gu": "હું ગણતરી પહેલાં શરતો ઓળખીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_85",
    "methodNumber": 85,
    "classLevel": 6,
    "category": {
      "en": "Problem Solving Strategies",
      "hi": "समस्या समाधान रणनीतियाँ",
      "gu": "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Reverse Thinking (The Inversion Strategy)",
      "hi": "उल्टा सोचना (प्रतिलोम रणनीति / इन्वर्जन)",
      "gu": "ઊંધું વિચારવું (વિપરીત વિચાર વ્યૂહરચના / ઇન્વર્ઝન)"
    },
    "description": {
      "en": "Solve hard strategy, algebra, and life problems by turning them upside down: instead of asking 'How do I succeed?', ask 'What causes guaranteed failure, and how do I avoid it?'.",
      "hi": "'मैं कैसे जीतूँ?' पूछने के बजाय पूछें 'कौन सी गलती पक्की हार कराएगी और मैं उससे कैसे बचूँ?'—समस्याओं को उल्टा करके आसानी से हल करें।",
      "gu": "'હું કેવી રીતે સફળ થાઉં?' પૂછવાને બદલે પૂછો 'કઈ ભૂલથી ચોક્કસ હાર થશે અને હું તેનાથી કેવી રીતે બચું?'—દાખલાઓને ઊંધા વિચારીને ઉકેલો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "rewind_arrow",
        "title": {
          "en": "Stuck Moving Forward on Complex Logic & Goal Problems?",
          "hi": "जटिल तार्किक और लक्ष्य वाले सवालों में आगे का रास्ता बंद दिखता है?",
          "gu": "અઘરા તાર્કિક કોયડાઓમાં આગળ જવાનો રસ્તો બંધ દેખાય છે?"
        },
        "pain_quotes": [
          {
            "en": "When I plan how to score 95% on my exam, I make complicated study schedules that collapse on Day 2!",
            "hi": "जब मैं 95% लाने का टाइम-टेबल बनाता हूँ, तो वह इतना कठिन होता है कि दूसरे दिन ही टूट जाता है!",
            "gu": "જ્યારે હું ૯૫% લાવવાનું ટાઈમટેબલ બનાવું છું, ત્યારે તે એટલું અઘરું હોય છે કે બીજા દિવસે જ તૂટી જાય છે!"
          },
          {
            "en": "I try to win strategy board games by attacking forward, but I walk straight into my opponent's traps!",
            "hi": "शतरंज में मैं सीधे आगे बढ़कर आक्रमण करता हूँ, लेकिन प्रतिद्वंद्वी के जाल में फंस जाता हूँ!",
            "gu": "ચેસમાં હું સીધો આગળ વધીને હુમલો કરું છું, પણ સામેવાળાની જાળમાં ફસાઈ જાઉં છું!"
          }
        ],
        "body": {
          "en": "Great mathematician Carl Jacobi famously said: 'Invert, always invert!' Forward thinking gets trapped by obstacles. 'Reverse Thinking' (Inversion) starts from the worst possible failure or the final finish line, and works backward to reveal the clean, obstacle-free path!",
          "hi": "महान गणितज्ञ कार्ल जैकोबी ने कहा था: 'उल्टा सोचो, हमेशा उल्टा सोचो!' आगे की सोच बाधाओं में फंस जाती है। 'प्रतिलोम सोच' (Inversion) सबसे बड़ी नाकामी या अंतिम फिनिश लाइन से शुरू होती है और पीछे हटते हुए सबसे आसान रास्ता दिखाती है!",
          "gu": "મહાન ગણિતશાસ્ત્રી કાર્લ જેકોબીએ કહ્યું હતું: 'ઊંધું વિચારો, હંમેશાં ઊંધું વિચારો!' સીધું વિચારતાં અવરોધો નડે છે. 'વિપરીત વિચાર' (Inversion) સૌથી ખરાબ નિષ્ફળતા કે અંતિમ વિજયરેખાથી શરૂ થાય છે અને પાછળ આવીને સૌથી સરળ રસ્તો બતાવે છે!"
        },
        "key_takeaway": {
          "en": "Inversion Rule: Don't ask 'How to Win' $\\rightarrow$ Ask 'What causes guaranteed failure?' $\\rightarrow$ Avoid those traps completely!",
          "hi": "प्रतिलोम नियम: 'कैसे जीतें' मत पूछें $\\rightarrow$ पूछें 'क्या करने से पक्की हार होगी?' $\\rightarrow$ उन गलतियों से पूरी तरह बचें!",
          "gu": "ઇન્વર્ઝન નિયમ: 'કેવી રીતે જીતવું' ન પૂછો $\\rightarrow$ પૂછો 'શું કરવાથી ચોક્કસ હાર થશે?' $\\rightarrow$ તે ભૂલોથી સંપૂર્ણ દૂર રહો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "rewind_arrow",
        "title": {
          "en": "Meet Varun",
          "hi": "वरुण से मिलें",
          "gu": "મળો વરૂણને"
        },
        "story": {
          "en": "Varun wanted to guarantee an A+ in his Science exam. Instead of writing an impossible 8-hour study plan, he inverted the problem: 'How could I guarantee getting an F?' Answers: 1) Leave questions blank, 2) Stay up until 3 AM before the exam, 3) Misread the word 'NOT'. By simply avoiding those 3 failure traps, Varun scored 98% with zero stress!",
          "hi": "वरुण विज्ञान में A+ लाना चाहता था। 8 घंटे पढ़ने की असंभव योजना बनाने के बजाय उसने उल्टा सोचा: 'मुझे फेल कौन करा सकता है?' उत्तर: 1) सवाल खाली छोड़ना, 2) रात 3 बजे तक जागना, 3) 'NOT' शब्द न देखना। उसने सिर्फ इन 3 गलतियों से दूरी बनाई और 98% अंक हासिल किए!",
          "gu": "વરૂણ વિજ્ઞાનમાં A+ લાવવા માંગતો હતો. ૮ કલાક વાંચવાનું અશક્ય ટાઈમટેબલ બનાવવાને બદલે તેણે ઊંધું વિચાર્યું: 'મને નાપાસ શું કરાવી શકે?' જવાબો: ૧) સવાલો કોરા છોડવા, ૨) રાત્રે ૩ વાગ્યા સુધી જાગવું, ૩) 'NOT' શબ્દ ન જોવો. તેણે માત્ર આ ૩ ભૂલો ટાળી અને ૯૮% ગુણ મેળવ્યા!"
        },
        "insight_box": {
          "en": "Avoiding Stupidity: It is much easier to avoid obvious mistakes than it is to be a brilliant genius.",
          "hi": "गलतियों से बचाव: असाधारण प्रतिभाशाली बनने की तुलना में स्पष्ट गलतियों से बचना कहीं अधिक आसान और प्रभावी है।",
          "gu": "ભૂલોથી બચવું: મહાન પ્રતિભાશાળી બનવા કરતાં સામાન્ય ભૂલોથી બચવું ઘણું વધુ સરળ અને સફળ બનાવે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "rewind_arrow",
        "question": {
          "en": "How does the Inversion (Reverse Thinking) strategy help you win a chess match or school project?",
          "hi": "प्रतिलोम सोच (उल्टा सोचना) शतरंज के खेल या स्कूल प्रोजेक्ट में जीतने में कैसे मदद करती है?",
          "gu": "ઇન્વર્ઝન (ઊંધું વિચારવું) ચેસની રમત કે શાળાના પ્રોજેક્ટમાં જીતવામાં કેવી રીતે મદદ કરે છે?"
        },
        "option_a": {
          "en": "By identifying all moves/actions that guarantee failure or loss, and systematically eliminating them from your plan.",
          "hi": "उन सभी चालों/कार्यों की पहचान करके जो निश्चित हार का कारण बनती हैं, और उन्हें अपनी योजना से हटाकर।",
          "gu": "ચોક્કસ હાર કરાવતી બધી ભૂલો/ચાલોને ઓળખીને અને યોજનામાંથી તેમને સંપૂર્ણ દૂર કરીને."
        },
        "option_b": {
          "en": "By playing the entire game with your eyes closed.",
          "hi": "अपनी आँखें बंद करके पूरा खेल खेलकर।",
          "gu": "તમારી આંખો બંધ રાખીને આખી રમત રમીને."
        },
        "feedback": {
          "en": "Correct! Inversion guarantees success by systematically cutting off all failure escape hatches.",
          "hi": "सही! प्रतिलोम सोच विफलता के सभी रास्तों को बंद करके सफलता सुनिश्चित करती है।",
          "gu": "સાચું! ઊંધું વિચારવાથી નિષ્ફળતાના બધા રસ્તા બંધ થઈ જાય છે અને વિજય પાકો બને છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "rewind_arrow",
        "question": {
          "en": "Scenario: You want to ensure your Group Science Model wins 1st Prize. \nInvert the goal: 'What would guarantee our group loses completely?' \nWhich inverted insight protects your team best?",
          "hi": "परिदृश्य: आप चाहते हैं कि आपका साइंस मॉडल प्रथम पुरस्कार जीते। \nलक्ष्य को उल्टा करें: 'ऐसी क्या गलती होगी जिससे हमारा ग्रुप पक्का हार जाएगा?' \nकौन सी उल्टी सोच आपकी टीम की सबसे अच्छी रक्षा करेगी?",
          "gu": "પરિસ્થિતિ: તમે ઈચ્છો છો કે તમારો સાયન્સ મોડેલ ૧લો નંબર મેળવે. \nધ્યેયને ઊંધો કરો: 'કઈ ભૂલથી આપણું ગ્રુપ ચોક્કસ હારી જશે?' \nકયો વિપરીત વિચાર તમારી ટીમને સૌથી વધુ બચાવશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "'Waiting until the last night and finding out our battery doesn't fit the motor—so we must test the battery on Day 1!'",
              "hi": "'आखिरी रात तक टालना और पता चलना कि बैटरी मोटर में नहीं लग रही—इसलिए हमें पहले दिन ही बैटरी चलाकर देखनी चाहिए!'",
              "gu": "'છેલ્લી રાત સુધી રાહ જોવી અને ખબર પડવી કે બેટરી મોટરમાં ફિટ નથી થતી—તેથી આપણે પહેલા દિવસે જ બેટરી ટેસ્ટ કરવી જોઈએ!'"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "'Painting the model in 50 different bright colors'",
              "hi": "'मॉडल को 50 अलग-अलग रंगों से रंगना'",
              "gu": "'મોડેલને ૫૦ અલગ અલગ રંગોથી રંગવું'"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "'Making the project title 40 words long'",
              "hi": "'प्रोजेक्ट का शीर्षक 40 शब्दों का बनाना'",
              "gu": "'પ્રોજેક્ટનું નામ ૪૦ શબ્દોનું રાખવું'"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "'Not bringing the model to school at all'",
              "hi": "'मॉडल को स्कूल ही न ले जाना'",
              "gu": "'મોડેલને શાળાએ જ ન લઈ જવું'"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! By identifying the catastrophic failure mode (untested battery on final night), the team takes preventative action immediately!",
          "hi": "शानदार! सबसे बड़ी विफलता (आखिरी रात बैटरी खराब होना) को पहले ही पहचानकर टीम ने तुरंत सुधारात्मक कदम उठाया!",
          "gu": "એકદમ સાચું! સૌથી મોટી મુશ્કેલી (છેલ્લી રાત્રે બેટરી ન ચાલવી) પહેલેથી ઓળખીને ટીમે તરત જ નિવારક પગલું ભર્યું!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "rewind_arrow",
        "title": {
          "en": "Inversion Superpower",
          "hi": "प्रतिलोम सोच सुपरपावर",
          "gu": "ઇન્વર્ઝન સુપરપાવર"
        },
        "body": {
          "en": "Identify what guarantees catastrophic failure and eliminate those triggers to secure victory.",
          "hi": "पक्की विफलता के कारणों को पहचानें और जीत हासिल करने के लिए उन गलतियों को खत्म करें।",
          "gu": "ચોક્કસ નિષ્ફળતા કરાવતાં કારણો ઓળખો અને વિજય મેળવવા તે ભૂલોને સંપૂર્ણ દૂર કરો."
        },
        "tags": [
          {
            "en": "Invert, Always Invert",
            "hi": "उल्टा सोचो",
            "gu": "હંમેશાં ઊંધું વિચારો"
          },
          {
            "en": "Failure Autopsy",
            "hi": "विफलता की पहचान",
            "gu": "નિષ્ફળતાની ઓળખ"
          },
          {
            "en": "Avoid Stupidity",
            "hi": "गलतियों से बचें",
            "gu": "સામાન્ય ભૂલો ટાળો"
          },
          {
            "en": "Work Backward",
            "hi": "पीछे से सोचें",
            "gu": "પાછળથી વિચારો"
          },
          {
            "en": "Risk Elimination",
            "hi": "जोखिम मुक्ति",
            "gu": "જોખમ મુક્તિ"
          },
          {
            "en": "Bulletproof Plans",
            "hi": "अचूक योजना",
            "gu": "અચૂક આયોજન"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "rewind_arrow",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "State your target goal or problem clearly (e.g. 'Ace the Math Exam').",
              "hi": "अपना लक्ष्य या समस्या स्पष्ट रूप से लिखें (जैसे 'गणित परीक्षा में अव्वल आना')।",
              "gu": "તમારો ધ્યેય કે સમસ્યા સ્પષ્ટ લખો (જેમ કે 'ગણિત પરીક્ષામાં ટોપ કરવું')."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Invert the goal completely: 'How could I guarantee total disaster or failure?'.",
              "hi": "लक्ष्य को पूरी तरह उलट दें: 'मैं ऐसा क्या करूँ कि पूरी तरह असफल हो जाऊं?'।",
              "gu": "ધ્યેયને સંપૂર્ણ ઉલટાવી દો: 'હું એવું શું કરું કે સાવ નાપાસ થઈ જાઉં?'."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Brainstorm the top 3 specific catastrophic failure actions (e.g. rushing without checking, staying up late).",
              "hi": "शीर्ष 3 बड़ी गलतियों की सूची बनाएं (जैसे बिना जांचे जल्दबाजी करना, देर रात जागना)।",
              "gu": "ટોચની ૩ મોટી ભૂલોની યાદી બનાવો (જેમ કે તપાસ્યા વગર ઉતાવળ કરવી, મોડી રાત સુધી જાગવું)."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Build your action plan exclusively around preventing and avoiding those 3 failure triggers.",
              "hi": "अपनी कार्य योजना को पूरी तरह उन 3 गलतियों को रोकने के इर्द-गिर्द बनाएं।",
              "gu": "તમારું આયોજન તે ૩ ભૂલોને રોકવા માટે જ ચોક્કસ રીતે બનાવો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "rewind_arrow",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Pick one challenging task today (e.g., finishing homework or playing a game) and write down 2 things that would guarantee failure, then actively avoid them!",
          "hi": "आज के किसी कठिन कार्य पर 2 ऐसी गलतियाँ लिखें जो पक्की हार कराएँ, और उनसे पूरी तरह बचें!",
          "gu": "આજના કોઈ મુશ્કેલ કામ માટે ૨ એવી બાબતો લખો જે ચોક્કસ નિષ્ફળતા લાવે, અને તેનાથી સંપૂર્ણ દૂર રહો!"
        },
        "commitment_button_text": {
          "en": "I will invert problems to guarantee success!",
          "hi": "मैं उल्टा सोचकर सफलता सुनिश्चित करूँगा!",
          "gu": "હું ઊંધું વિચારીને સફળતા પાકી કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_88",
    "methodNumber": 88,
    "classLevel": 6,
    "category": {
      "en": "Problem Solving Strategies",
      "hi": "समस्या समाधान रणनीतियाँ",
      "gu": "સમસ્યા નિવારણ વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Search Systematically (The Organized Matrix Grid)",
      "hi": "व्यवस्थित खोज (संगठित मैट्रिक्स ग्रिड)",
      "gu": "વ્યવસ્થિત શોધ (સંગઠિત મેટ્રિક્સ ગ્રીડ)"
    },
    "description": {
      "en": "Find all possible combinations, arrangements, and multi-digit coin solutions using structured tables and tree branches—with 0 duplicates and 0 missed items.",
      "hi": "संरचित तालिकाओं और वृक्ष शाखाओं (Tree Diagrams) का उपयोग करके सभी संभावित संयोजनों को खोजें—बिना किसी दोहराव या छूट के।",
      "gu": "સુવ્યવસ્થિત કોષ્ટકો અને ટ્રી ડાયાગ્રામ વાપરીને બધી શક્ય જોડીઓ અને ગોઠવણીઓ શોધો—કોઈપણ પુનરાવર્તન કે ભૂલ વગર."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "systematic_grid",
        "title": {
          "en": "Missing Hidden Combinations When Listing Possibilities?",
          "hi": "सभी संभावित जोड़ियों की सूची बनाते समय कुछ न कुछ छूट जाता है?",
          "gu": "બધી શક્ય જોડીઓની યાદી બનાવતી વખતે કેટલીક બાબતો ચૂકી જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "A problem asked 'How many 3-digit numbers can be formed using digits 1, 2, 3 without repetition?' and I only found 4 instead of 6!",
            "hi": "सवाल था '1, 2, 3 से बिना दोहराए 3-अंकों की कितनी संख्याएं बन सकती हैं?' और मैंने 6 के बजाय केवल 4 ही बनाईं!",
            "gu": "સવાલ હતો '૧, ૨, ૩ માંથી પુનરાવર્તન વગર ૩-અંકની કેટલી સંખ્યાઓ બને?' અને મેં ૬ ને બદલે માત્ર ૪ જ બનાવી!"
          },
          {
            "en": "When counting coin combinations to make ₹20, I write random guesses and repeat the same combination twice!",
            "hi": "₹20 बनाने के लिए सिक्कों के संयोजन लिखते समय मैं तुक्के लगाता हूँ और एक ही संयोजन दो बार लिख देता हूँ!",
            "gu": "₹૨૦ બનાવવા સિક્કાઓની જોડી બનાવતી વખતે હું આડેધડ અંદાજ લગાવું છું અને એક જ જોડી બે વાર લખી નાખું છું!"
          }
        ],
        "body": {
          "en": "Random searching relies on luck, which guarantees missed possibilities and duplicate errors. 'Systematic Search' uses an ordered table or tree structure: fix the first variable in alphabetical or numerical order, systematically vary the second, and list all branches with 100% complete coverage!",
          "hi": "यादृच्छिक (Random) खोज भाग्य पर निर्भर करती है, जिससे छूटने और दोहराने की गलतियाँ होती हैं। 'व्यवस्थित खोज' एक क्रमबद्ध तालिका या वृक्ष आरेख का उपयोग करती है: पहले चर को संख्यात्मक क्रम में स्थिर रखें, दूसरे को क्रमिक रूप से बदलें और 100% पूर्णता पाएं!",
          "gu": "આડેધડ અંદાજ લગાવવાથી ભૂલો થાય છે અને ઘણી જોડીઓ છૂટી જાય છે. 'વ્યવસ્થિત શોધ' ક્રમબદ્ધ કોષ્ટક કે ટ્રી ડાયાગ્રામ વાપરે છે: પહેલા નંબરને સ્થિર રાખો, બીજાને ક્રમશઃ બદલો અને ૧૦૦% સાચી બધી શક્યતાઓ મેળવો!"
        },
        "key_takeaway": {
          "en": "Systematic Rule: Fix Column 1 (Smallest First) $\\rightarrow$ Vary Column 2 Step-by-Step $\\rightarrow$ Zero Misses & Zero Duplicates!",
          "hi": "व्यवस्थित नियम: पहले कॉलम को स्थिर रखें $\\rightarrow$ दूसरे कॉलम को क्रमानुसार बदलें $\\rightarrow$ शून्य चूक और शून्य दोहराव!",
          "gu": "વ્યવસ્થિત નિયમ: પહેલા ખાનાને સ્થિર રાખો $\\rightarrow$ બીજા ખાનાને ક્રમશઃ બદલો $\\rightarrow$ શૂન્ય ભૂલ અને શૂન્ય પુનરાવર્તન!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "systematic_grid",
        "title": {
          "en": "Meet Krisha",
          "hi": "कृषा से मिलें",
          "gu": "મળો ક્રિશાને"
        },
        "story": {
          "en": "Krisha had to find how many ways to pay ₹15 using only ₹5 and ₹2 coins. Her friend guessed randomly: (5, 5, 5), (2, 2, 2, 2, 2, 5)... Krisha made a systematic table starting with maximum ₹5 coins: 3 of ₹5 (3×5=15, 0 of ₹2 ✅), 2 of ₹5 (needs ₹5 from ₹2 ❌), 1 of ₹5 (needs ₹10 $\\rightarrow$ 5 of ₹2 ✅), 0 of ₹5 (needs ₹15 from ₹2 ❌). Total: Exactly 2 ways! Crystal-clear proof.",
          "hi": "कृषा को ₹5 और ₹2 के सिक्कों से ₹15 चुकाने के सभी तरीके खोजने थे। दोस्त ने तुक्के लगाए। कृषा ने ₹5 के सिक्कों से व्यवस्थित तालिका बनाई: 3 पांच के (₹15, 0 दो के ✅), 2 पांच के (₹5 बचा, 2 से असंभव ❌), 1 पांच का (₹10 बचा $\\rightarrow$ 5 दो के ✅), 0 पांच के (₹15 असंभव ❌)। कुल: ठीक 2 तरीके!",
          "gu": "ક્રિશાને ₹૫ અને ₹૨ ના સિક્કાથી ₹૧૫ ચૂકવવાના બધા રસ્તા શોધવાના હતા. મિત્રએ અંદાજો લગાવ્યા. ક્રિશાએ ₹૫ ના સિક્કાથી ક્રમબદ્ધ કોષ્ટક બનાવ્યું: ૩ પાંચના (₹૧૫, ૦ બેના ✅), ૨ પાંચના (₹૫ વધ્યા, ૨ થી અશક્ય ❌), ૧ પાંચનો (₹૧૦ વધ્યા $\\rightarrow$ ૫ બેના ✅), ૦ પાંચના (₹૧૫ અશક્ય ❌). કુલ: બરાબર ૨ રસ્તા!"
        },
        "insight_box": {
          "en": "Exhaustive Tree: By starting at the maximum possible value of the largest coin and counting down (3, 2, 1, 0), it is mathematically impossible to miss a case.",
          "hi": "पूर्ण वृक्ष विधि: सबसे बड़े सिक्के के अधिकतम मान (3, 2, 1, 0) से शुरू करके नीचे आने पर किसी भी विकल्प का छूटना गणितीय रूप से असंभव है।",
          "gu": "સંપૂર્ણ ટ્રી પદ્ધતિ: સૌથી મોટા સિક્કાના મહત્તમ મૂલ્ય (૩, ૨, ૧, ૦) થી શરૂ કરીને નીચે આવતાં એક પણ વિકલ્પ છૂટવો અશક્ય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "systematic_grid",
        "question": {
          "en": "When finding all 3-digit permutations of digits {1, 2, 3} without repetition, what is the systematic search procedure?",
          "hi": "अंकों {1, 2, 3} से बिना दोहराए सभी 3-अंकीय संख्याएं बनाते समय व्यवस्थित खोज प्रक्रिया क्या होगी?",
          "gu": "અંકો {૧, ૨, ૩} માંથી પુનરાવર્તન વગર બધી ૩-અંકની સંખ્યાઓ બનાવતી વખતે વ્યવસ્થિત શોધ પદ્ધતિ કઈ હશે?"
        },
        "option_a": {
          "en": "Fix 1 in hundreds place (123, 132), then fix 2 (213, 231), then fix 3 (312, 321) = exactly 6 numbers.",
          "hi": "सैकड़े पर 1 स्थिर करें (123, 132), फिर 2 स्थिर करें (213, 231), फिर 3 स्थिर करें (312, 321) = ठीक 6 संख्याएं।",
          "gu": "સોના સ્થાને ૧ સ્થિર કરો (૧૨૩, ૧૩૨), પછી ૨ સ્થિર કરો (૨૧૩, ૨૩૧), પછી ૩ સ્થિર કરો (૩૧૨, ૩૨૧) = બરાબર ૬ સંખ્યાઓ."
        },
        "option_b": {
          "en": "Write random numbers as they pop into your head until you get tired.",
          "hi": "दिमाग में जैसे-जैसे नंबर आएं उन्हें लिखते जाएं जब तक कि थक न जाएं।",
          "gu": "મગજમાં જે નંબર આવે તે આડેધડ લખતા રહો જ્યાં સુધી થાકી ન જાઓ."
        },
        "feedback": {
          "en": "Correct! Fixing the leading digit and branching secondary digits guarantees complete, error-free enumeration.",
          "hi": "सही! पहले अंक को स्थिर रखकर अगले अंकों की शाखाएं बनाने से 100% सही और पूर्ण सूची बनती है।",
          "gu": "સાચું! પહેલા અંકને સ્થિર રાખીને બાકીના અંકોની જોડી બનાવવાથી ૧૦૦% સાચી અને સંપૂર્ણ યાદી મળે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "systematic_grid",
        "question": {
          "en": "How many 2-digit numbers can be formed using digits {4, 7, 9} if repetition of digits is ALLOWED (e.g. 44 is valid)? \nSystematic Search:\nStarting with 4: {44, 47, 49} (3 numbers)\nStarting with 7: {74, 77, 79} (3 numbers)\nStarting with 9: {94, 97, 99} (3 numbers)\nTotal = ?",
          "hi": "अंकों {4, 7, 9} का उपयोग करके 2-अंकों की कितनी संख्याएं बनाई जा सकती हैं यदि अंकों को दोहराने की अनुमति है (जैसे 44 मान्य है)?\nव्यवस्थित खोज:\n4 से शुरू: {44, 47, 49} (3 संख्याएं)\n7 से शुरू: {74, 77, 79} (3 संख्याएं)\n9 से शुरू: {94, 97, 99} (3 संख्याएं)\nकुल = ?",
          "gu": "અંકો {૪, ૭, ૯} નો ઉપયોગ કરીને ૨-અંકની કેટલી સંખ્યાઓ બનાવી શકાય જો અંકોનું પુનરાવર્તન શક્ય હોય (જેમ કે ૪૪ માન્ય છે)?\nવ્યવસ્થિત શોધ:\n૪ થી શરૂ: {૪૪, ૪૭, ૪૯} (૩ સંખ્યાઓ)\n૭ થી શરૂ: {૭૪, ૭૭, ૭૯} (૩ સંખ્યાઓ)\n૯ થી શરૂ: {૯૪, ૯૭, ૯૯} (૩ સંખ્યાઓ)\nકુલ = ?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "9 numbers (3 × 3 = 9)",
              "hi": "9 संख्याएं (3 × 3 = 9)",
              "gu": "૯ સંખ્યાઓ (૩ × ૩ = ૯)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "6 numbers",
              "hi": "6 संख्याएं",
              "gu": "૬ સંખ્યાઓ"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "12 numbers",
              "hi": "12 संख्याएं",
              "gu": "૧૨ સંખ્યાઓ"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "3 numbers",
              "hi": "3 संख्याएं",
              "gu": "૩ સંખ્યાઓ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! 3 choices for tens digit × 3 choices for ones digit = $3 \\times 3 = 9$ numbers! Systematic search proves every single entry!",
          "hi": "शानदार! दहाई के लिए 3 विकल्प × इकाई के लिए 3 विकल्प = $3 \\times 3 = 9$ संख्याएं! व्यवस्थित खोज हर प्रविष्टि को सिद्ध करती है!",
          "gu": "એકદમ સાચું! દશકના ૩ વિકલ્પ × એકમના ૩ વિકલ્પ = $૩ \\times ૩ = ૯$ સંખ્યાઓ! વ્યવસ્થિત શોધ દરેક સંખ્યાની ખાતરી આપે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "systematic_grid",
        "title": {
          "en": "Systematic Grid Superpower",
          "hi": "व्यवस्थित ग्रिड सुपरपावर",
          "gu": "વ્યવસ્થિત ગ્રીડ સુપરપાવર"
        },
        "body": {
          "en": "Fix the first variable and cycle through possibilities systematically for 100% complete coverage.",
          "hi": "पहले चर को स्थिर रखें और 100% पूर्ण सूची के लिए व्यवस्थित रूप से सभी संभावनाओं को लिखें।",
          "gu": "પહેલા ચલને સ્થિર રાખો અને ૧૦૦% સંપૂર્ણ યાદી માટે વ્યવસ્થિત રીતે બધી શક્યતાઓ શોધો."
        },
        "tags": [
          {
            "en": "Fix & Branch",
            "hi": "स्थिर करें व शाखा बनाएं",
            "gu": "સ્થિર કરી શાખા બનાવો"
          },
          {
            "en": "Ordered Matrix",
            "hi": "क्रमबद्ध मैट्रिक्स",
            "gu": "ક્રમબદ્ધ મેટ્રિક્સ"
          },
          {
            "en": "Tree Diagrams",
            "hi": "वृक्ष आरेख",
            "gu": "ટ્રી ડાયાગ્રામ"
          },
          {
            "en": "Zero Omissions",
            "hi": "शून्य चूक",
            "gu": "શૂન્ય ભૂલ"
          },
          {
            "en": "Zero Duplicates",
            "hi": "शून्य दोहराव",
            "gu": "શૂન્ય પુનરાવર્તન"
          },
          {
            "en": "Exhaustive Proof",
            "hi": "सटीक प्रमाण",
            "gu": "સચોટ સાબિતી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "systematic_grid",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Set up a structured 2-column table or tree diagram for your problem.",
              "hi": "अपनी समस्या के लिए 2-कॉलम वाली तालिका या वृक्ष आरेख (Tree Diagram) बनाएं।",
              "gu": "તમારી સમસ્યા માટે ૨-ખાનાવાળું કોષ્ટક કે ટ્રી ડાયાગ્રામ તૈયાર કરો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Fix the primary variable to its lowest (or highest) possible value.",
              "hi": "मुख्य चर को उसके सबसे छोटे (या सबसे बड़े) संभव मान पर स्थिर रखें।",
              "gu": "મુખ્ય ચલને તેના સૌથી નાના (કે સૌથી મોટા) શક્ય મૂલ્ય પર સ્થિર રાખો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Cycle through all allowable secondary variable values in ascending numerical order.",
              "hi": "बढ़ते क्रम में दूसरे चर के सभी मान्य मानों को क्रमानुसार लिखें।",
              "gu": "ચડતા ક્રમમાં બીજા ચલના બધા માન્ય મૂલ્યોને ક્રમશઃ લખો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Increment the primary variable by 1 step and repeat until all possibilities are fully exhausted.",
              "hi": "मुख्य चर को 1 कदम आगे बढ़ाएं और सभी संभावनाओं के समाप्त होने तक दोहराएं।",
              "gu": "મુખ્ય ચલને ૧ ડગલું આગળ વધારો અને બધી શક્યતાઓ પૂરી ન થાય ત્યાં સુધી પુનરાવર્તન કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "systematic_grid",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Use a systematic tree diagram to find all possible outfits you can make with 3 shirts (Red, Blue, Green) and 2 pants (Black, White)!",
          "hi": "3 शर्ट (लाल, नीली, हरी) और 2 पैंट (काली, सफेद) से बनने वाले सभी पहनावे व्यवस्थित ट्री बनाकर खोजें!",
          "gu": "૩ શર્ટ (લાલ, વાદળી, લીલો) અને ૨ પેન્ટ (કાળું, સફેદ) માંથી બનતી બધી જોડીઓ વ્યવસ્થિત ટ્રી ડાયાગ્રામથી શોધી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will search systematically with zero misses!",
          "hi": "मैं बिना किसी चूक के व्यवस्थित खोज करूँगा!",
          "gu": "હું ભૂલ વગર વ્યવસ્થિત શોધ કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_90",
    "methodNumber": 90,
    "classLevel": 6,
    "category": {
      "en": "Logic",
      "hi": "तर्कशास्त्र / लॉजिक",
      "gu": "તર્કશાસ્ત્ર / લોજિક"
    },
    "title": {
      "en": "Deductive Reasoning (Top-Down Logic Lock)",
      "hi": "निगमनात्मक तर्क (ऊपर से नीचे का अचूक तर्क)",
      "gu": "નિગમનાત્મક તર્ક (ઉપરથી નીચેનો અચૂક તર્ક)"
    },
    "description": {
      "en": "Reach 100% airtight mathematical and scientific conclusions by combining proven general rules (major premise) with specific facts (minor premise).",
      "hi": "सिद्ध सार्वभौमिक नियमों (मुख्य आधार) को विशिष्ट तथ्यों (गौण आधार) के साथ जोड़कर 100% अचूक और अकाट्य निष्कर्ष निकालें।",
      "gu": "સાબિત થયેલા સામાન્ય નિયમોને ચોક્કસ હકીકતો સાથે જોડીને ૧૦૦% સાચા અને અકાટ્ય તારણો મેળવો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "deduction_lock",
        "title": {
          "en": "Confusing Probable Guesses with Ironclad Facts?",
          "hi": "संभावित अनुमानों और पक्के तार्किक सत्यों में अंतर नहीं कर पाते?",
          "gu": "સંભવિત અંદાજો અને પાકી સાબિત હકીકતો વચ્ચે ગૂંચવાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I saw a logic puzzle in the exam and picked an answer that 'felt right' instead of following the strict given rules!",
            "hi": "परीक्षा में तर्क पहेली देखकर मैंने वह उत्तर चुन लिया जो 'सही लगा', बजाय दिए गए सख्त नियमों का पालन करने के!",
            "gu": "પરીક્ષામાં તર્કનો કોયડો જોઈને મેં 'મને લાગ્યું તેવો' જવાબ લખી દીધો, આપેલા ચોક્કસ નિયમો તપાસ્યા વગર!"
          },
          {
            "en": "When solving geometry proofs, I assume shapes are equal just because they look identical in the drawing!",
            "hi": "ज्यामिति में मैं केवल चित्र देखकर आकृतियों को बराबर मान लेता हूँ, बिना कोणों या भुजाओं के नियम सिद्ध किए!",
            "gu": "ભૂમિતિમાં હું માત્ર ચિત્ર જોઈને ખૂણાઓને સરખા માની લઉં છું, નિયમો સાબિત કર્યા વગર!"
          }
        ],
        "body": {
          "en": "Feelings and appearances lie, but deductive logic is unbreakable. If Premise 1 is true (All squares are rectangles) and Premise 2 is true (Shape A is a square), then the Conclusion is 100% GUARANTEED (Shape A is a rectangle). It's the top-down superpower of detectives and mathematicians!",
          "hi": "भावनाएं और आंखों का धोखा झूठ बोल सकते हैं, लेकिन निगमनात्मक तर्क कभी असफल नहीं होता। यदि आधार 1 सच है (सभी वर्ग आयत हैं) और आधार 2 सच है (आकृति A एक वर्ग है), तो निष्कर्ष 100% निश्चित है (आकृति A एक आयत है)। यह जासूसों और गणितज्ञों की गुप्त शक्ति है!",
          "gu": "લાગણીઓ અને આંખોનો ભ્રમ છેતરી શકે છે, પણ નિગમનાત્મક તર્ક ક્યારેય ખોટો નથી પડતો. જો નિયમ ૧ સાચો છે (બધા ચોરસ લંબચોરસ છે) અને વિધાન ૨ સાચું છે (આકાર A ચોરસ છે), તો તારણ ૧૦૦% સાચું જ હોય (આકાર A લંબચોરસ છે). આ ગણિતશાસ્ત્રીઓની શક્તિ છે!"
        },
        "key_takeaway": {
          "en": "Deduction Rule: True General Rule + True Specific Fact = 100% Guaranteed Conclusion!",
          "hi": "निगमन नियम: सत्य सामान्य नियम + सत्य विशिष्ट तथ्य = 100% निश्चित निष्कर्ष!",
          "gu": "નિગમન નિયમ: સાચો સામાન્ય નિયમ + સાચી ચોક્કસ હકીકત = ૧૦૦% પાકું તારણ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "deduction_lock",
        "title": {
          "en": "Meet Ananya",
          "hi": "अनन्या से मिलें",
          "gu": "મળો અનન્યાને"
        },
        "story": {
          "en": "Ananya was given a mystery riddle: 'All metals conduct electricity. Substance X is copper, which is a metal. Does Substance X conduct electricity?' Her classmate said: 'We need to test it with a battery first.' Ananya deduced instantly: 'No test needed! Since copper is a metal, and all metals conduct, Substance X MUST conduct electricity with 100% mathematical certainty!'",
          "hi": "अनन्या को एक पहेली मिली: 'सभी धातुएं विद्युत का संचालन करती हैं। पदार्थ X तांबा है, जो एक धातु है। क्या पदार्थ X विद्युत का संचालन करता है?' सहपाठी ने कहा: 'पहले बैटरी से जांचना पड़ेगा।' अनन्या ने निगमन किया: 'जांच की जरूरत नहीं! तांबा धातु है और सभी धातुएं चालक हैं, इसलिए पदार्थ X 100% विद्युत का संचालन करेगा ही!'",
          "gu": "અનન્યા સામે કોયડો આવ્યો: 'બધી ધાતુઓ વિદ્યુતનું વહન કરે છે. પદાર્થ X તાંબુ છે, જે ધાતુ છે. શું પદાર્થ X વિદ્યુતનું વહન કરશે?' મિત્રએ કહ્યું: 'પહેલાં બેટરીથી તપાસવું પડશે.' અનન્યાએ તરત તર્ક કર્યો: 'તપાસની જરૂર નથી! તાંબુ ધાતુ છે અને બધી ધાતુઓ વાહક છે, તેથી પદાર્થ X ૧૦૦% વિદ્યુતનું વહન કરશે જ!'"
        },
        "insight_box": {
          "en": "Top-Down Certainty: In deductive reasoning, if the premises are true, it is impossible for the conclusion to be false.",
          "hi": "शीर्ष-से-तल निश्चितता: यदि दोनों आधार वाक्य सत्य हैं, तो निष्कर्ष का असत्य होना असंभव है।",
          "gu": "અકાટ્ય સત્ય: જો બંને પાયાના વિધાનો સાચાં હોય, તો તારણ ક્યારેય ખોટું હોઈ જ ન શકે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "deduction_lock",
        "question": {
          "en": "Read these two premises:\n1. All multiples of 10 end in the digit 0.\n2. The number 3,480 is a multiple of 10.\nWhat is the deductive conclusion?",
          "hi": "इन दो आधार वाक्यों को पढ़ें:\n1. 10 के सभी गुणजों का अंतिम अंक 0 होता है।\n2. संख्या 3,480, 10 का एक गुणज है।\nनिगमनात्मक निष्कर्ष क्या होगा?",
          "gu": "આ બે વિધાનો વાંચો:\n૧. ૧૦ ના બધા ગુણકોનો છેલ્લો અંક ૦ હોય છે.\n૨. સંખ્યા ૩,૪૮૦ એ ૧૦ નો ગુણક છે.\nનિગમનાત્મક તારણ શું થશે?"
        },
        "option_a": {
          "en": "The number 3,480 must end in the digit 0 with 100% certainty.",
          "hi": "संख्या 3,480 का अंतिम अंक 100% निश्चित रूप से 0 ही होगा।",
          "gu": "સંખ્યા ૩,૪૮૦ નો છેલ્લો અંક ૧૦૦% ખાતરીપૂર્વક ૦ જ હશે."
        },
        "option_b": {
          "en": "We cannot know the last digit without looking at a calculator.",
          "hi": "कैलकुलेटर देखे बिना हम अंतिम अंक नहीं जान सकते।",
          "gu": "કેલ્ક્યુલેટર જોયા વગર આપણે છેલ્લો અંક જાણી શકતા નથી."
        },
        "feedback": {
          "en": "Correct! The specific instance (3,480) inherits the absolute property of the general rule (ends in 0).",
          "hi": "सही! विशिष्ट उदाहरण (3,480) सीधे सामान्य नियम के पूर्ण गुण (अंतिम अंक 0) को अपना लेता है।",
          "gu": "સાચું! ચોક્કસ ઉદાહરણ (૩,૪૮૦) સામાન્ય નિયમના ગુણધર્મને (છેલ્લો અંક ૦) સીધો જ ધારણ કરે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "deduction_lock",
        "question": {
          "en": "Premise 1: All equilateral triangles have three equal angles of 60°.\nPremise 2: Triangle PQR is an equilateral triangle.\nWhich deduction is mathematically guaranteed to be true?",
          "hi": "आधार 1: सभी समबाहु त्रिभुजों के तीनों कोण बराबर (60°) होते हैं।\nआधार 2: त्रिभुज PQR एक समबाहु त्रिभुज है।\nकौन सा निष्कर्ष गणितीय रूप से 100% सत्य है?",
          "gu": "વિધાન ૧: બધા સમબાજુ ત્રિકોણના ત્રણેય ખૂણા ૬૦° ના હોય છે.\nવિધાન ૨: ત્રિકોણ PQR એ સમબાજુ ત્રિકોણ છે.\nકયું તારણ ગાણિતિક રીતે ૧૦૦% સાચું સાબિત થાય છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Angle P = 60°, Angle Q = 60°, and Angle R = 60°",
              "hi": "कोण P = 60°, कोण Q = 60°, और कोण R = 60°",
              "gu": "ખૂણો P = ૬૦°, ખૂણો Q = ૬૦°, અને ખૂણો R = ૬૦°"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Triangle PQR has one 90° right angle",
              "hi": "त्रिभुज PQR में एक 90° का समकोण है",
              "gu": "ત્રિકોણ PQR માં એક ૯૦° નો કાટખૂણો છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Angle P is larger than Angle Q",
              "hi": "कोण P कोण Q से बड़ा है",
              "gu": "ખૂણો P એ ખૂણા Q કરતાં મોટો છે"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "We need a protractor to measure the angles first",
              "hi": "कोण मापने के लिए पहले चांदा (protractor) चाहिए",
              "gu": "ખૂણા માપવા માટે પહેલાં કોણમાપક જોઈશે"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! By deduction, Triangle PQR inherits the universal 60° property of all equilateral triangles without needing physical measurement!",
          "hi": "शानदार! निगमन द्वारा, त्रिभुज PQR बिना किसी मापन के समबाहु त्रिभुजों के 60° वाले नियम को पूरी तरह सिद्ध करता है!",
          "gu": "એકદમ સાચું! નિગમન દ્વારા, ત્રિકોણ PQR માપ્યા વગર જ સમબાજુ ત્રિકોણના ૬૦° વાળા નિયમનું પાલન કરે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "deduction_lock",
        "title": {
          "en": "Deductive Logic Superpower",
          "hi": "निगमनात्मक तर्क सुपरपावर",
          "gu": "નિગમનાત્મક તર્ક સુપરપાવર"
        },
        "body": {
          "en": "Apply universal rules to specific cases to reach 100% airtight, unshakeable conclusions.",
          "hi": "अकाट्य और 100% निश्चित निष्कर्ष निकालने के लिए सार्वभौमिक नियमों को विशिष्ट उदाहरणों पर लागू करें।",
          "gu": "અકાટ્ય અને ૧૦૦% સાચા તારણો મેળવવા માટે સામાન્ય નિયમોને ચોક્કસ ઉદાહરણો પર લાગુ કરો."
        },
        "tags": [
          {
            "en": "Top-Down Logic",
            "hi": "शीर्ष-से-तल तर्क",
            "gu": "ઉપરથી નીચેનો તર્ક"
          },
          {
            "en": "Major Premise",
            "hi": "मुख्य आधार",
            "gu": "મુખ્ય નિયમ"
          },
          {
            "en": "Minor Premise",
            "hi": "गौण आधार",
            "gu": "ચોક્કસ હકીકત"
          },
          {
            "en": "100% Certainty",
            "hi": "100% निश्चितता",
            "gu": "૧૦૦% ખાતરી"
          },
          {
            "en": "No Guesswork",
            "hi": "तुक्का मुक्त",
            "gu": "અંદાજ મુક્ત"
          },
          {
            "en": "Detective Proof",
            "hi": "जासूसी प्रमाण",
            "gu": "ડિટેક્ટીવ પુરાવો"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "deduction_lock",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Identify the Major Premise: the proven universal scientific or mathematical rule.",
              "hi": "मुख्य आधार पहचानें: सिद्ध सार्वभौमिक वैज्ञानिक या गणितीय नियम।",
              "gu": "મુખ્ય આધાર ઓળખો: સાબિત થયેલો સામાન્ય વૈજ્ઞાનિક કે ગાણિતિક નિયમ."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Identify the Minor Premise: the specific item, shape, or number in your problem.",
              "hi": "गौण आधार पहचानें: आपके सवाल में दी गई विशिष्ट वस्तु, आकृति या संख्या।",
              "gu": "ચોક્કસ હકીકત ઓળખો: તમારા દાખલામાં આપેલી ચોક્કસ વસ્તુ, આકાર કે સંખ્યા."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Verify that the specific item fits completely inside the category of the major rule.",
              "hi": "पुष्टि करें कि विशिष्ट वस्तु पूरी तरह से मुख्य नियम की श्रेणी में आती है।",
              "gu": "ખાતરી કરો કે તે ચોક્કસ વસ્તુ મુખ્ય નિયમની શ્રેણીમાં સંપૂર્ણ રીતે આવે છે."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "State the airtight logical conclusion that MUST be true without any exception.",
              "hi": "वह अकाट्य तार्किक निष्कर्ष बताएं जो बिना किसी अपवाद के सत्य होना ही चाहिए।",
              "gu": "તે અકાટ્ય તારણ રજૂ કરો જે કોઈપણ અપવાદ વગર સાચું જ હોય."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "deduction_lock",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Write a 3-line deductive logic chain in your notebook today (e.g., Major Premise $\\rightarrow$ Minor Premise $\\rightarrow$ Conclusion) for a Science fact!",
          "hi": "आज विज्ञान के किसी तथ्य पर 3-लाइन की निगमनात्मक तर्क श्रृंखला (मुख्य आधार $\\rightarrow$ गौण आधार $\\rightarrow$ निष्कर्ष) लिखें!",
          "gu": "આજે વિજ્ઞાનના કોઈ સિદ્ધાંત પર ૩-લાઇનની નિગમનાત્મક તર્ક સાંકળ (મુખ્ય નિયમ $\\rightarrow$ ચોક્કસ હકીકત $\\rightarrow$ તારણ) લખી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will deduce conclusions with airtight logic!",
          "hi": "मैं अकाट्य तर्क से निष्कर्ष निकालूँगा!",
          "gu": "હું અકાટ્ય તર્કથી તારણો મેળવીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_91",
    "methodNumber": 91,
    "classLevel": 6,
    "category": {
      "en": "Logic",
      "hi": "तर्कशास्त्र / लॉजिक",
      "gu": "તર્કશાસ્ત્ર / લોજિક"
    },
    "title": {
      "en": "Inductive Reasoning (Pattern Detective & Counter-Example Shield)",
      "hi": "आगमनात्मक तर्क (पैटर्न जासूस और अपवाद ढाल)",
      "gu": "આગમનાત્મક તર્ક (પેટર્ન ડિટેક્ટીવ અને અપવાદ ઢાલ)"
    },
    "description": {
      "en": "Spot emerging patterns from repeated observations to build smart hypotheses, while actively hunting for counter-examples to avoid hasty generalization traps.",
      "hi": "स्मार्ट परिकल्पनाएं बनाने के लिए बार-बार दिखने वाले पैटर्न को पहचानें, और जल्दबाजी में गलत निष्कर्ष से बचने के लिए अपवाद (counter-example) खोजें।",
      "gu": "સ્માર્ટ નિયમો બનાવવા માટે વારંવાર દેખાતી પેટર્નને ઓળખો, અને ઉતાવળિયા ખોટા તારણોથી બચવા માટે અપવાદો (counter-examples) તપાસો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "inductive_leaf",
        "title": {
          "en": "Jumping to False Rules After Seeing Just 2 Examples?",
          "hi": "सिर्फ 2 उदाहरण देखकर जल्दबाजी में गलत नियम बना लेते हैं?",
          "gu": "માત્ર ૨ ઉદાહરણો જોઈને ઉતાવળે ખોટો સામાન્ય નિયમ બનાવી લો છો?"
        },
        "pain_quotes": [
          {
            "en": "I noticed that 3, 5, and 7 are all prime numbers, so I claimed 'ALL odd numbers are prime'—and failed when my teacher mentioned 9!",
            "hi": "मैंने देखा कि 3, 5, और 7 अभाज्य हैं, तो मैंने कह दिया 'सभी विषम संख्याएं अभाज्य होती हैं'—और 9 आते ही मेरा नियम फेल हो गया!",
            "gu": "મેં જોયું કે ૩, ૫ અને ૭ અવિભાજ્ય છે, એટલે મેં કહી દીધું 'બધી એકી સંખ્યાઓ અવિભાજ્ય હોય છે'—અને ૯ આવતાં જ મારો નિયમ ખોટો પડ્યો!"
          },
          {
            "en": "I saw two cloudy days that rained, so I assumed every cloudy sky guarantees rain!",
            "hi": "मैंने दो दिन बादल देखकर बारिश देखी, तो मान लिया कि हर बादल वाले दिन बारिश होगी ही!",
            "gu": "મેં બે વાર વાદળછાયા વાતાવરણમાં વરસાદ જોયો, એટલે માની લીધું કે વાદળ હોય એટલે વરસાદ પડે જ!"
          }
        ],
        "body": {
          "en": "Inductive reasoning is how scientists discover new laws: observe patterns from specific examples and form a general rule. But beware the 'Hasty Generalization' trap! A master thinker always tests their hypothesis against potential counter-examples before declaring victory.",
          "hi": "आगमनात्मक तर्क से ही वैज्ञानिक नए नियमों की खोज करते हैं: उदाहरणों से पैटर्न पहचानकर सामान्य नियम बनाना। लेकिन जल्दबाजी के सामान्यीकरण से बचें! एक बुद्धिमान विचारक हमेशा नियम पक्का करने से पहले अपवादों (Counter-examples) की जांच करता है।",
          "gu": "આગમનાત્મક તર્કથી જ વૈજ્ઞાનિકો નવા નિયમો શોધે છે: ઉદાહરણોમાંથી પેટર્ન પકડીને સામાન્ય નિયમ બનાવવો. પણ ઉતાવળિયા તારણથી સાવધાન! એક હોશિયાર વિદ્યાર્થી નિયમ પાકો કરતાં પહેલાં હંમેશાં અપવાદો (Counter-examples) ચકાસે છે."
        },
        "key_takeaway": {
          "en": "Induction Rule: Observe Specifics $\\rightarrow$ Form General Pattern $\\rightarrow$ Hunt for 1 Counter-Example to Validate!",
          "hi": "आगमन नियम: विशिष्ट उदाहरण देखें $\\rightarrow$ सामान्य पैटर्न बनाएं $\\rightarrow$ पुष्टि के लिए 1 अपवाद खोजें!",
          "gu": "આગમન નિયમ: ઉદાહરણો જુઓ $\\rightarrow$ સામાન્ય પેટર્ન બનાવો $\\rightarrow$ ખાતરી કરવા ૧ અપવાદ તપાસો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "inductive_leaf",
        "title": {
          "en": "Meet Rohan",
          "hi": "रोहन से मिलें",
          "gu": "મળો રોહનને"
        },
        "story": {
          "en": "Rohan tested adding even numbers: $2+4=6$, $6+8=14$, $10+12=22$. Using inductive reasoning, he formed the hypothesis: 'Even + Even = Even'. To protect his rule, he hunted for a counter-example ($100+200=300$). Seeing that zero counter-examples exist, Rohan proved his algebraic rule with confidence!",
          "hi": "रोहन ने सम संख्याओं का जोड़ देखा: $2+4=6$, $6+8=14$, $10+12=22$। आगमनात्मक सोच से उसने नियम बनाया: 'सम + सम = सम'। अपने नियम को परखने के लिए उसने अपवाद खोजा ($100+200=300$)। जब कोई अपवाद नहीं मिला, तो रोहन ने आत्मविश्वास से नियम सिद्ध किया!",
          "gu": "રોહને બેકી સંખ્યાઓનો સરવાળો જોયો: ૨+૪=૬, ૬+૮=૧૪, ૧૦+૧૨=૨૨. આગમનાત્મક તર્કથી તેણે નિયમ બનાવ્યો: 'બેકી + બેકી = બેકી'. પોતાના નિયમને ચકાસવા તેણે અપવાદ શોધ્યો (૧૦૦+૨૦૦=૩૦૦). કોઈ અપવાદ ન મળતાં રોહને આત્મવિશ્વાસથી નિયમ સાચો સાબિત કર્યો!"
        },
        "insight_box": {
          "en": "The Power of One Counter-Example: It takes 1,000 examples to build an inductive theory, but only ONE counter-example (like number 9) to shatter a false rule.",
          "hi": "एक अपवाद की शक्ति: नियम बनाने में 1,000 उदाहरण लगते हैं, लेकिन गलत नियम को तोड़ने के लिए केवल 1 अपवाद (जैसे 9) ही काफी है।",
          "gu": "એક અપવાદની તાકાત: નિયમ બનાવવા ૧,૦૦૦ ઉદાહરણો લાગે છે, પણ ખોટા નિયમને તોડવા માટે માત્ર ૧ અપવાદ (જેમ કે ૯) જ પૂરતો છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "inductive_leaf",
        "question": {
          "en": "A student observes: $1 \\times 1 = 1$, $3 \\times 3 = 9$, $5 \\times 5 = 25$, $7 \\times 7 = 49$. What inductive hypothesis should they form?",
          "hi": "एक छात्र देखता है: $1 \\times 1 = 1$, $3 \\times 3 = 9$, $5 \\times 5 = 25$, $7 \\times 7 = 49$। उसे कौन सी आगमनात्मक परिकल्पना बनानी चाहिए?",
          "gu": "એક વિદ્યાર્થી જુએ છે: ૧ $\\times ૧ = ૧$, ૩ $\\times ૩ = ૯$, ૫ $\\times ૫ = ૨૫$, ૭ $\\times ૭ = ૪૯$. તેણે કઈ આગમનાત્મક પરિકલ્પના બનાવવી જોઈએ?"
        },
        "option_a": {
          "en": "The square of any odd number is always an odd number.",
          "hi": "किसी भी विषम संख्या का वर्ग हमेशा एक विषम संख्या ही होता है।",
          "gu": "કોઈપણ એકી સંખ્યાનો વર્ગ હંમેશાં એકી સંખ્યા જ હોય છે."
        },
        "option_b": {
          "en": "All numbers multiplied by themselves equal 49.",
          "hi": "सभी संख्याओं को खुद से गुणा करने पर 49 आता है।",
          "gu": "બધી સંખ્યાઓને પોતાના વડે ગુણવાથી ૪૯ જ આવે છે."
        },
        "feedback": {
          "en": "Correct! Inductive reasoning generalizes from specific odd square patterns ($1, 9, 25, 49$) to the universal odd square rule.",
          "hi": "सही! आगमनात्मक तर्क विशिष्ट विषम वर्ग पैटर्न ($1, 9, 25, 49$) से सार्वभौमिक विषम वर्ग नियम बनाता है।",
          "gu": "સાચું! આગમનાત્મક તર્ક ચોક્કસ એકી વર્ગ પેટર્ન ($૧, ૯, ૨૫, ૪૯$) પરથી સાર્વત્રિક એકી વર્ગ નિયમ બનાવે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "inductive_leaf",
        "question": {
          "en": "Someone claims: 'All prime numbers are odd numbers because 3, 5, 7, 11, 13 are all odd.' \nWhat single counter-example instantly disproves this false hypothesis?",
          "hi": "कोई दावा करता है: 'सभी अभाज्य संख्याएं विषम होती हैं क्योंकि 3, 5, 7, 11, 13 सभी विषम हैं।' \nकौन सा 1 अपवाद इस गलत परिकल्पना को तुरंत खारिज कर देता है?",
          "gu": "કોઈ દાવો કરે છે: 'બધી અવિભાજ્ય સંખ્યાઓ એકી જ હોય છે કારણ કે ૩, ૫, ૭, ૧૧, ૧૩ બધી એકી છે.' \nકયો ૧ અપવાદ આ ખોટા દાવાને તરત જ રદ કરી નાખે છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "The number 2 (2 is a prime number, but it is EVEN)",
              "hi": "संख्या 2 (2 एक अभाज्य संख्या है, लेकिन यह सम है)",
              "gu": "સંખ્યા ૨ (૨ એ અવિભાજ્ય સંખ્યા છે, પણ તે બેકી છે)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "The number 15",
              "hi": "संख्या 15",
              "gu": "સંખ્યા ૧૫"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "The number 100",
              "hi": "संख्या 100",
              "gu": "સંખ્યા ૧૦૦"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "There are no counter-examples",
              "hi": "कोई अपवाद मौजूद नहीं है",
              "gu": "કોઈ અપવાદ નથી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The number 2 is the ONLY even prime number, serving as the ultimate counter-example to shatter the false rule!",
          "hi": "शानदार! संख्या 2 एकमात्र सम अभाज्य संख्या है, जो इस गलत नियम को तोड़ने वाला सबसे सटीक अपवाद है!",
          "gu": "એકદમ સાચું! સંખ્યા ૨ એ એકમાત્ર બેકી અવિભાજ્ય સંખ્યા છે, જે આ ખોટા નિયમને તોડતો પાકો અપવાદ છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "inductive_leaf",
        "title": {
          "en": "Inductive Detective Superpower",
          "hi": "आगमनात्मक जासूस सुपरपावर",
          "gu": "આગમનાત્મક ડિટેક્ટીવ સુપરપાવર"
        },
        "body": {
          "en": "Extract general rules from repeated observations, but always test for counter-examples.",
          "hi": "बार-बार दिखने वाले पैटर्न से नियम बनाएं, लेकिन हमेशा अपवादों (counter-examples) की जांच करें।",
          "gu": "વારંવાર દેખાતી પેટર્ન પરથી નિયમ બનાવો, પણ હંમેશાં અપવાદો (counter-examples) ચકાસો."
        },
        "tags": [
          {
            "en": "Bottom-Up Thinking",
            "hi": "तल-से-शीर्ष सोच",
            "gu": "નીચેથી ઉપરનો તર્ક"
          },
          {
            "en": "Pattern Generalizer",
            "hi": "पैटर्न सामान्यीकरण",
            "gu": "પેટર્ન સામાન્યીકરણ"
          },
          {
            "en": "Hunt Counter-Examples",
            "hi": "अपवाद खोजें",
            "gu": "અપવાદ શોધો"
          },
          {
            "en": "No Hasty Rules",
            "hi": "जल्दबाजी से बचें",
            "gu": "ઉતાવળિયા નિયમ મુક્ત"
          },
          {
            "en": "Scientific Method",
            "hi": "वैज्ञानिक पद्धति",
            "gu": "વૈજ્ઞાનિક પદ્ધતિ"
          },
          {
            "en": "Hypothesis Testing",
            "hi": "परिकल्पना परीक्षण",
            "gu": "પરિકલ્પના ચકાસણી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "inductive_leaf",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Gather and calculate at least 4 to 5 specific cases or observations.",
              "hi": "कम से कम 4 से 5 विशिष्ट उदाहरणों या प्रेक्षणों की गणना करें।",
              "gu": "ઓછામાં ઓછા ૪ થી ૫ ચોક્કસ ઉદાહરણો કે અવલોકનો એકત્ર કરો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Identify the shared invariant pattern across all gathered examples.",
              "hi": "सभी एकत्रित उदाहरणों में समान रूप से दिखने वाले पैटर्न को पहचानें।",
              "gu": "બધા ઉદાહરણોમાં એકસરખી દેખાતી સામાન્ય પેટર્નને શોધી કાઢો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "State a general hypothesis rule linking the input to the output.",
              "hi": "शुरुआती मान और परिणाम को जोड़ने वाला एक सामान्य नियम बनाएं।",
              "gu": "શરૂઆતની કિંમત અને પરિણામને જોડતો એક સામાન્ય નિયમ બનાવો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Actively search for any extreme case or counter-example (e.g. zero, negatives, number 2) to validate the rule.",
              "hi": "नियम की पुष्टि के लिए किसी भी चरम मामले या अपवाद (जैसे 0, ऋणात्मक, 2) की जांच करें।",
              "gu": "નિયમ પાકો કરવા માટે કોઈપણ વિશિષ્ટ કેસ કે અપવાદ (જેમ કે શૂન્ય, ઋણ, સંખ્યા ૨) ચકાસી લો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "inductive_leaf",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Test the sum of any two odd numbers (e.g., $1+3$, $5+7$, $9+11$). State your inductive rule and verify if any counter-example exists in math!",
          "hi": "किन्हीं दो विषम संख्याओं का जोड़ देखें ($1+3$, $5+7$, $9+11$)। अपना नियम बनाएं और देखें कि क्या कोई अपवाद मौजूद है!",
          "gu": "કોઈપણ બે એકી સંખ્યાઓનો સરવાળો ચકાસો ($૧+૩$, $૫+૭$, $૯+૧૧$). તમારો નિયમ બનાવો અને જુઓ કે કોઈ અપવાદ છે કે નહીં!"
        },
        "commitment_button_text": {
          "en": "I will discover patterns and test counter-examples!",
          "hi": "मैं पैटर्न खोजूँगा और अपवादों की जांच करूँगा!",
          "gu": "હું પેટર્ન શોધીશ અને અપવાદો ચકાસીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_103",
    "methodNumber": 103,
    "classLevel": 6,
    "category": {
      "en": "Logic",
      "hi": "तर्कशास्त्र / लॉजिक",
      "gu": "તર્કશાસ્ત્ર / લોજિક"
    },
    "title": {
      "en": "Logic Grids (The Elimination Cross-Matrix)",
      "hi": "तर्क ग्रिड (विलोपन क्रॉस-मैट्रिक्स)",
      "gu": "તર્ક ગ્રીડ (નિવારણ ક્રોસ-મેટ્રિક્સ)"
    },
    "description": {
      "en": "Crack multi-clue logic puzzles with 3 people, 3 pets, and 3 shirt colors using a 2D matrix: marking one checkmark (✓) eliminates an entire row and column.",
      "hi": "2D मैट्रिक्स का उपयोग करके 3 व्यक्तियों, 3 पालतू जानवरों और 3 रंगों वाली जटिल पहेलियां हल करें: एक टिक (✓) पूरी पंक्ति और कॉलम को काट देता है।",
      "gu": "૨D મેટ્રિક્સ વાપરીને ૩ વ્યક્તિઓ, ૩ પાળેલા પ્રાણીઓ અને ૩ રંગોવાળા અટપટા કોયડા ઉકેલો: એક સાચું (✓) આખી હરોળ અને ખાનાને રદ કરે છે."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "grid_matrix",
        "title": {
          "en": "Brain Overheating on Multi-Clue Detective Puzzles?",
          "hi": "कई सुरागों वाली जासूसी पहेलियों में सिर चकरा जाता है?",
          "gu": "ઘણા બધા સંકેતોવાળા ડિટેક્ટીવ કોયડાઓમાં મગજ થાકી જાય છે?"
        },
        "pain_quotes": [
          {
            "en": "A puzzle gives 5 clues about 3 kids wearing Red, Blue, and Green hats, and my working memory jumbles up who wears what!",
            "hi": "पहेली में 3 बच्चों और लाल, नीली, हरी टोपी के 5 सुराग हैं, और मेरा दिमाग भूल जाता है कि किसने क्या पहना!",
            "gu": "કોયડામાં ૩ બાળકો અને લાલ, વાદળી, લીલી ટોપીના ૫ સંકેતો છે, અને હું ભૂલી જાઉં છું કે કોણે શું પહેર્યું છે!"
          },
          {
            "en": "I try to keep all clues in my head at once and make conflicting assumptions that ruin the puzzle!",
            "hi": "मैं सभी सुरागों को एक साथ याद रखने की कोशिश करता हूँ और गलत अनुमान लगाकर पूरी पहेली बिगाड़ देता हूँ!",
            "gu": "હું બધા સંકેતો મગજમાં યાદ રાખવા જાઉં છું અને ખોટો અંદાજ લગાવી આખો કોયડો બગાડી નાખું છું!"
          }
        ],
        "body": {
          "en": "Human working memory can only hold 4 items at once. Storing 10 puzzle facts in your head causes instant brain freeze. 'Logic Grids' offloads information onto a 2D check-and-cross matrix: every positive clue gives a Checkmark (✓), which automatically crosses out (X) all other cells in that row and column!",
          "hi": "हमारा दिमाग एक बार में केवल 4 बातें याद रख सकता है। 10 सुराग याद रखने से दिमाग सुन्न हो जाता है। 'तर्क ग्रिड' जानकारी को 2D टेबल पर उतारता है: हर सकारात्मक सुराग पर टिक (✓) लगाएं, जो उस पंक्ति और कॉलम के बाकी सभी खानों को स्वतः (X) काट देता है!",
          "gu": "આપણું મગજ એક સમયે માત્ર ૪ બાબતો યાદ રાખી શકે છે. ૧૦ સંકેતો યાદ રાખવા જતાં મગજ અટકી જાય છે. 'તર્ક ગ્રીડ' માહિતીને ૨D કોષ્ટક પર મૂકે છે: દરેક સાચા સંકેત પર ખરું (✓) કરો, જે તે હરોળ અને ખાનાના બાકીના બધા વિકલ્પોને આપોઆપ ચોકડી (X) કરી દે છે!"
        },
        "key_takeaway": {
          "en": "Grid Rule: Plot Clues as ✓ or X $\\rightarrow$ 1 Checkmark wipes its row & column $\\rightarrow$ The last empty box MUST be ✓!",
          "hi": "ग्रिड नियम: सुरागों को ✓ या X लिखें $\\rightarrow$ 1 टिक पूरी पंक्ति/कॉलम को काटता है $\\rightarrow$ बचा हुआ अंतिम बॉक्स 100% ✓ होगा!",
          "gu": "ગ્રીડ નિયમ: સંકેતોને ✓ કે X લખો $\\rightarrow$ ૧ ખરું આખી હરોળ/ખાનાને કાપે $\\rightarrow$ છેલ્લું વધેલું ખાનું ૧૦૦% ✓ જ હોય!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "grid_matrix",
        "title": {
          "en": "Meet Kabir",
          "hi": "कबीर से मिलें",
          "gu": "મળો કબીરને"
        },
        "story": {
          "en": "Kabir faced a puzzle with 3 friends (Aarav, Diya, Samar) and 3 sports (Cricket, Football, Tennis). Clue 1: 'Diya hates outdoor ball sports with bats (No Cricket).' Clue 2: 'Aarav only plays Tennis.' Kabir drew a 3x3 grid. He put ✓ for Aarav-Tennis. That put 'X' in all other Tennis and Aarav boxes! Diya was left with Football, and Samar was left with Cricket. Solved in 15 seconds!",
          "hi": "कबीर के सामने 3 दोस्तों (आरव, दीया, समर) और 3 खेलों (क्रिकेट, फुटबॉल, टेनिस) की पहेली थी। सुराग 1: 'दीया को बल्ला पसंद नहीं (क्रिकेट नहीं)।' सुराग 2: 'आरव सिर्फ टेनिस खेलता है।' कबीर ने 3x3 ग्रिड बनाया। आरव-टेनिस पर ✓ लगाया। इससे बाकी टेनिस और आरव के बॉक्स X हो गए! दीया को फुटबॉल और समर को क्रिकेट मिला। 15 सेकंड में हल!",
          "gu": "કબીર સામે ૩ મિત્રો (આરવ, દીયા, સમર) અને ૩ રમતો (ક્રિકેટ, ફૂટબોલ, ટેનિસ) નો કોયડો હતો. સંકેત ૧: 'દીયાને બેટવાળી રમત નથી ગમતી (ક્રિકેટ નથી).' સંકેત ૨: 'આરવ માત્ર ટેનિસ રમે છે.' કબીરે ૩x૩ ની ગ્રીડ દોરી. આરવ-ટેનિસ પર ✓ કર્યું. જેથી આરવ અને ટેનિસના બાકીના ખાના X થઈ ગયા! દીયાને ફૂટબોલ અને સમરને ક્રિકેટ મળ્યું. ૧૫ સેકન્ડમાં ઉકેલ!"
        },
        "insight_box": {
          "en": "One-to-One Rule: Each person has exactly ONE item. A single ✓ eliminates all competitors horizontally and vertically.",
          "hi": "एक-से-एक नियम: प्रत्येक व्यक्ति के पास ठीक 1 वस्तु होती है। एक अकेला ✓ क्षैतिज और ऊर्ध्वाधर रूप से अन्य सभी को हटा देता है।",
          "gu": "એક-થી-એક નિયમ: દરેક વ્યક્તિ પાસે માત્ર ૧ વસ્તુ હોય. એક જ ✓ આડી અને ઊભી લાઇનના બધા હરીફોને રદ કરી દે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "grid_matrix",
        "question": {
          "en": "In a 3x3 Logic Grid, once you determine that 'Rohan owns the Dog' and place a Checkmark (✓) in that cell, what must you immediately do to the rest of the grid?",
          "hi": "3x3 तर्क ग्रिड में, जब आप तय कर लेते हैं कि 'रोहन के पास कुत्ता है' और उस सेल में टिक (✓) लगाते हैं, तो आपको तुरंत ग्रिड के बाकी हिस्सों में क्या करना चाहिए?",
          "gu": "૩x૩ તર્ક ગ્રીડમાં, જ્યારે તમે નક્કી કરો કે 'રોહન પાસે કૂતરો છે' અને તે ખાનામાં ખરું (✓) કરો, ત્યારે ગ્રીડના બાકીના ખાનાઓમાં તરત શું કરવું જોઈએ?"
        },
        "option_a": {
          "en": "Put an 'X' in every other pet cell in Rohan's row, AND put an 'X' in every other person's cell in the Dog column.",
          "hi": "रोहन की पंक्ति के अन्य सभी पालतू जानवरों के सेल में 'X' लगाएं, और कुत्ते के कॉलम के अन्य सभी व्यक्तियों में 'X' लगाएं।",
          "gu": "રોહનની લાઇનના બીજા બધા પ્રાણીઓના ખાનામાં 'X' કરો, અને કૂતરાની ઊભી લાઇનમાં બીજા બધા લોકો સામે 'X' કરો."
        },
        "option_b": {
          "en": "Erase the entire grid and guess randomly.",
          "hi": "पूरी ग्रिड मिटा दें और तुक्का लगाएं।",
          "gu": "આખી ગ્રીડ ભૂંસી નાખો અને અંદાજ લગાવો."
        },
        "feedback": {
          "en": "Correct! One-to-one mapping means Rohan has no other pet, and no other person has the Dog!",
          "hi": "सही! एक-से-एक नियम का अर्थ है कि रोहन के पास कोई दूसरा जानवर नहीं हो सकता, और किसी अन्य के पास कुत्ता नहीं हो सकता!",
          "gu": "સાચું! એક-થી-એક નિયમનો અર્થ છે કે રોહન પાસે બીજું પ્રાણી ન હોઈ શકે અને બીજા કોઈ પાસે કૂતરો ન હોઈ શકે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "grid_matrix",
        "question": {
          "en": "3 Friends (Ali, Bob, Cam) have favorite fruits: Apple, Banana, Cherry.\nClue 1: Ali does not like Apple or Cherry.\nClue 2: Bob hates Cherry.\nWho loves Cherry?",
          "hi": "3 दोस्त (अली, बॉब, कैम) के पसंदीदा फल हैं: सेब, केला, चेरी।\nसुराग 1: अली को सेब या चेरी पसंद नहीं है।\nसुराग 2: बॉब चेरी से नफरત करता है।\nचेरी किसे पसंद है?",
          "gu": "૩ મિત્રો (અલી, બોબ, કેમ) ના મનપસંદ ફળ છે: સફરજન, કેળું, ચેરી.\nસંકેત ૧: અલીને સફરજન કે ચેરી પસંદ નથી.\nસંકેત ૨: બોબને ચેરી ગમતી નથી.\nચેરી કોને પસંદ છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Cam (Since Ali = X and Bob = X for Cherry, Cam MUST be ✓)",
              "hi": "कैम (क्योंकि चेरी के लिए अली = X और बॉब = X है, इसलिए कैम 100% ✓ होगा)",
              "gu": "કેમ (કારણ કે ચેરી માટે અલી = X અને બોબ = X છે, તેથી કેમ ૧૦૦% ✓ જ થશે)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Ali",
              "hi": "अली",
              "gu": "અલી"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Bob",
              "hi": "बॉब",
              "gu": "બોબ"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Nobody eats fruit",
              "hi": "कोई फल नहीं खाता",
              "gu": "કોઈ ફળ ખાતું નથી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The Cherry column has 'X' for Ali and 'X' for Bob. The only remaining empty cell is Cam $\\rightarrow$ Cam = Cherry!",
          "hi": "शानदार! चेरी वाले कॉलम में अली और बॉब दोनों पर 'X' है। केवल कैम का बॉक्स बचा है $\\rightarrow$ कैम = चेरी!",
          "gu": "એકદમ સાચું! ચેરીના ખાનામાં અલી અને બોબ બંને પર 'X' છે. માત્ર કેમનું ખાનું વધ્યું $\\rightarrow$ કેમ = ચેરી!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "grid_matrix",
        "title": {
          "en": "Logic Grid Superpower",
          "hi": "तर्क ग्रिड सुपरपावर",
          "gu": "તર્ક ગ્રીડ સુપરપાવર"
        },
        "body": {
          "en": "Plot clues on a 2D check-and-cross matrix to solve multi-variable puzzles systematically.",
          "hi": "जटिल पहेलियों को सुलझाने के लिए 2D टिक और क्रॉस मैट्रिक्स पर सुरागों को दर्ज करें।",
          "gu": "અટપટા કોયડા ઉકેલવા માટે ૨D ખરા અને ખોટાના મેટ્રિક્સ પર સંકેતોની નોંધ કરો."
        },
        "tags": [
          {
            "en": "2D Matrix",
            "hi": "2D मैट्रिक्स",
            "gu": "૨D મેટ્રિક્સ"
          },
          {
            "en": "Checkmark (✓)",
            "hi": "टिक (✓)",
            "gu": "ખરું (✓)"
          },
          {
            "en": "Cross-Out (X)",
            "hi": "काटें (X)",
            "gu": "ચોકડી (X)"
          },
          {
            "en": "One-to-One Match",
            "hi": "एक-से-एक मिलान",
            "gu": "એક-થી-એક જોડી"
          },
          {
            "en": "Deductive Grid",
            "hi": "निगमनात्मक ग्रिड",
            "gu": "નિગમનાત્મક ગ્રીડ"
          },
          {
            "en": "Zero Memory Overload",
            "hi": "तनावमुक्त सोच",
            "gu": "ભારમુક્ત વિચાર"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "grid_matrix",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Draw a grid with names along the rows and categories (pets, colors, sports) along columns.",
              "hi": "पंक्तियों में नाम और कॉलम में श्रेणियों (पालतू जानवर, रंग, खेल) वाली एक ग्रिड बनाएं।",
              "gu": "હરોળમાં નામો અને ઊભા ખાનામાં શ્રેણીઓ (પ્રાણીઓ, રંગો, રમતો) વાળી ગ્રીડ દોરો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Read clues and place an 'X' in every cell that represents an impossible match.",
              "hi": "सुराग पढ़ें और असंभव मिलान वाले प्रत्येक सेल में 'X' लगाएं।",
              "gu": "સંકેતો વાંચો અને અશક્ય જોડીવાળા દરેક ખાનામાં 'X' મૂકો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "When a clue gives a positive match, place a '✓' and immediately fill the rest of that row/column with 'X'.",
              "hi": "सकारात्मक मिलान पर '✓' लगाएं और तुरंत उस पंक्ति/कॉलम के बाकी खानों को 'X' से भरें।",
              "gu": "સાચી જોડી મળતાં '✓' કરો અને તરત જ તે હરોળ/ખાનાના બાકીના ભાગમાં 'X' ભરી દો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Look for any row or column with only one remaining empty box and place the final '✓'.",
              "hi": "जिस पंक्ति या कॉलम में केवल एक खाली बॉक्स बचा हो, उसमें अंतिम '✓' लगाएं।",
              "gu": "જે હરોળ કે ખાનામાં માત્ર એક જ ખાલી બોક્સ વધ્યું હોય, તેમાં અંતિમ '✓' મૂકી દો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "grid_matrix",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Draw a 3x3 Logic Grid in your notebook for 3 friends and their 3 favorite ice cream flavors, solve it using ✓ and X, and show your family!",
          "hi": "अपनी कॉपी में 3 दोस्तों और उनके 3 पसंदीदा आइसक्रीम फ्लेवर की 3x3 ग्रिड बनाकर ✓ और X से हल करें!",
          "gu": "તમારી નોટબુકમાં ૩ મિત્રો અને તેમની ૩ મનપસંદ આઈસ્ક્રીમ ફ્લેવરની ૩x૩ ગ્રીડ બનાવી ✓ અને X થી કોયડો ઉકેલી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will solve puzzles with logic grids!",
          "hi": "मैं तर्क ग्रिड से पहेलियां हल करूँगा!",
          "gu": "હું તર્ક ગ્રીડથી કોયડા ઉકેલીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_105",
    "methodNumber": 105,
    "classLevel": 6,
    "category": {
      "en": "Logic",
      "hi": "तर्कशास्त्र / लॉजिक",
      "gu": "તર્કશાસ્ત્ર / લોજિક"
    },
    "title": {
      "en": "Pattern-Based Inference (The Missing Link Predictor)",
      "hi": "पैटर्न आधारित निष्कर्ष (गायब कड़ी का अनुमान)",
      "gu": "પેટર્ન આધારિત તારણ (ખૂટતી કડીની આગાહી)"
    },
    "description": {
      "en": "Infer hidden intermediate numbers and future trends in complex sequences (arithmetic, geometric, or alternating) by extracting the underlying operational step-rule.",
      "hi": "अंतर्निहित गणितीय नियम को समझकर जटिल अनुक्रमों में छिपे हुए बीच के नंबरों और भविष्य के मानों का सटीक अनुमान लगाएं।",
      "gu": "ગાણિતિક નિયમને સમજીને અટપટી શ્રેણીઓમાં છુપાયેલી વચ્ચેની સંખ્યાઓ અને ભવિષ્યના મૂલ્યોની સચોટ આગાહી કરો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "inference_spark",
        "title": {
          "en": "Stumped by Sequence Puzzles with Gaps in the Middle?",
          "hi": "संख्या श्रृंखला में बीच के खाली स्थान देखकर अटक जाते हैं?",
          "gu": "સંખ્યાઓની શ્રેણીમાં વચ્ચેની ખાલી જગ્યાઓ જોઈને અટવાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "In sequence test questions like '2, 6, 18, __, 162', I try adding random numbers and run out of time!",
            "hi": "'2, 6, 18, __, 162' जैसी श्रृंखला में मैं तुक्के से संख्याएं जोड़ने लगता हूँ और समय खत्म हो जाता है!",
            "gu": "'૨, ૬, ૧૮, __, ૧૬૨' જેવી શ્રેણીમાં હું અંદાજે સરવાળો કરવા બેસું છું અને સમય પૂરો થઈ જાય છે!"
          },
          {
            "en": "Alternating sequences with two different patterns mixed together confuse me completely!",
            "hi": "दो अलग-अलग नियमों वाली मिश्रित श्रृंखलाएं मुझे पूरी तरह भ्रमित कर देती हैं!",
            "gu": "બે અલગ-અલગ નિયમોવાળી મિશ્ર શ્રેણીઓ મને સાવ ગૂંચવી નાખે છે!"
          }
        ],
        "body": {
          "en": "A number sequence is not random numbers thrown together; it is a mathematical conveyor belt powered by a single hidden engine. 'Pattern-Based Inference' calculates the delta between adjacent terms (+, -, ×, ÷) to deduce the exact formula governing the missing link!",
          "hi": "संख्या अनुक्रम कोई यादृच्छिक संख्याएं नहीं हैं; यह एक निश्चित गणितीय नियम पर चलने वाली ट्रेन है। 'पैटर्न आधारित निष्कर्ष' पास-पास के पदों के बीच का अंतर (+, -, ×, ÷) निकालता है और गायब संख्या को तुरंत पकड़ लेता है!",
          "gu": "સંખ્યાઓની શ્રેણી આડેધડ નંબરો નથી; તે એક ચોક્કસ ગાણિતિક નિયમ પર ચાલતી ટ્રેન છે. 'પેટર્ન આધારિત તારણ' નજીકના પદો વચ્ચેનો તફાવત (+, -, ×, ÷) શોધીને ખૂટતી સંખ્યાને ક્ષણવારમાં પકડી પાડે છે!"
        },
        "key_takeaway": {
          "en": "Inference Rule: Check Step Differences $\\rightarrow$ Identify Constant Multiplier or Adder $\\rightarrow$ Predict Missing Link!",
          "hi": "अनुमान नियम: पदों का अंतर जांचें $\\rightarrow$ गुणक या जोड़ नियम पहचानें $\\rightarrow$ गायब संख्या बताएं!",
          "gu": "તારણ નિયમ: પદો વચ્ચેનો તફાવત જુઓ $\\rightarrow$ ગુણાકાર કે સરવાળાનો નિયમ ઓળખો $\\rightarrow$ ખૂટતી સંખ્યા શોધો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "inference_spark",
        "title": {
          "en": "Meet Priya",
          "hi": "प्रिया से मिलें",
          "gu": "મળો પ્રિયાને"
        },
        "story": {
          "en": "Priya encountered this sequence in an Olympiad test: '3, 7, 15, 31, __, 127'. Other students tried finding a constant addition (+4, +8, +16...) but got confused on the next step. Priya inferred the operational rule: 'Double and add 1 ($2x + 1$)!' Since $31 \\times 2 + 1 = 63$, and $63 \\times 2 + 1 = 127$, the missing number was 63. Solved in 6 seconds!",
          "hi": "प्रिया को ओलंपियाड में सवाल मिला: '3, 7, 15, 31, __, 127'। बाकी बच्चे अंतर (+4, +8, +16...) में उलझ गए। प्रिया ने नियम निकाला: 'दोगुना करके 1 जोड़ो ($2x + 1$)!' $31 \\times 2 + 1 = 63$ और $63 \\times 2 + 1 = 127$। गायब संख्या 63 थी! 6 सेकंड में हल!",
          "gu": "પ્રિયા સામે ઓલિમ્પિયાડમાં દાખલો આવ્યો: '૩, ૭, ૧૫, ૩૧, __, ૧૨૭'. બીજા વિદ્યાર્થીઓ તફાવત (+૪, +૮, +૧૬...) માં અટવાઈ ગયા. પ્રિયાએ નિયમ પકડ્યો: 'બમણું કરીને ૧ ઉમેરો ($૨x + ૧$)!' $૩૧ \\times ૨ + ૧ = ૬૩$ અને $૬૩ \\times ૨ + ૧ = ૧૨૭$. ખૂટતી સંખ્યા ૬૩ હતી! ૬ સેકન્ડમાં ઉકેલ!"
        },
        "insight_box": {
          "en": "Verification Loop: Always test your predicted number against the NEXT number in the sequence (63 $\\rightarrow$ 127) to confirm 100% precision.",
          "hi": "पुष्टि लूप: 100% सटीकता के लिए अपने निकाले गए उत्तर को हमेशा अनुक्रम के अगले नंबर (63 $\\rightarrow$ 127) पर लागू करके जांचें।",
          "gu": "ચકાસણી લૂપ: ૧૦૦% ખાતરી માટે તમે શોધેલા જવાબને શ્રેણીના હવે પછીના નંબર (૬૩ $\\rightarrow$ ૧૨૭) સાથે ગણીને ચકાસો."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "inference_spark",
        "question": {
          "en": "In the sequence: 4, 12, 36, __, 324, what is the underlying engine rule?",
          "hi": "अनुक्रम: 4, 12, 36, __, 324 में अंतर्निहित नियम क्या है?",
          "gu": "શ્રેણી: ૪, ૧૨, ૩૬, __, ૩૨૪ માં છુપાયેલો સાચો નિયમ કયો છે?"
        },
        "option_a": {
          "en": "Geometric progression: Multiply by 3 each step ($4 \\times 3 = 12; 12 \\times 3 = 36; 36 \\times 3 = 108$).",
          "hi": "गुणोत्तर अनुक्रम: हर पद में 3 से गुणा करें ($4 \\times 3 = 12; 12 \\times 3 = 36; 36 \\times 3 = 108$)।",
          "gu": "સમગુણોત્તર શ્રેણી: દરેક પગલે ૩ વડે ગુણાકાર કરો ($૪ \\times ૩ = ૧૨; ૧૨ \\times ૩ = ૩૬; ૩૬ \\times ૩ = ૧૦૮$)."
        },
        "option_b": {
          "en": "Add 8 repeatedly to every number.",
          "hi": "हर संख्या में लगातार 8 जोड़ें।",
          "gu": "દરેક સંખ્યામાં સતત ૮ ઉમેરો."
        },
        "feedback": {
          "en": "Correct! $12 \\div 4 = 3$, $36 \\div 12 = 3$. The constant multiplier is 3, yielding $36 \\times 3 = 108$, and $108 \\times 3 = 324$!",
          "hi": "सही! $12 \\div 4 = 3$, $36 \\div 12 = 3$। स्थिर गुणक 3 है, जिससे $36 \\times 3 = 108$ और $108 \\times 3 = 324$ सिद्ध होता है!",
          "gu": "સાચું! ૧૨ ÷ ૪ = ૩, ૩૬ ÷ ૧૨ = ૩. અચળ ગુણક ૩ છે, જેથી ૩૬ $\\times ૩ = ૧૦૮$ અને ૧૦૮ $\\times ૩ = ૩૨૪$ સાબિત થાય છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "inference_spark",
        "question": {
          "en": "Examine this alternating sequence:\n5, 20, 8, 17, 11, 14, __\nWhat is the next inferred number?",
          "hi": "इस मिश्रित अनुक्रम को देखें:\n5, 20, 8, 17, 11, 14, __\nअगली अनुमानित संख्या क्या होगी?",
          "gu": "આ મિશ્ર શ્રેણી જુઓ:\n૫, ૨૦, ૮, ૧૭, ૧૧, ૧૪, __\nહવે પછીની ખૂટતી સંખ્યા કઈ હશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "14 (Stream 1 adds 3: 5 $\\rightarrow$ 8 $\\rightarrow$ 11 $\\rightarrow$ 14; Stream 2 subtracts 3: 20 $\\rightarrow$ 17 $\\rightarrow$ 14)",
              "hi": "14 (धारा 1 में +3: 5 $\\rightarrow$ 8 $\\rightarrow$ 11 $\\rightarrow$ 14; धारा 2 में -3: 20 $\\rightarrow$ 17 $\\rightarrow$ 14)",
              "gu": "૧૪ (શ્રેણી ૧ માં +૩: ૫ $\\rightarrow$ ૮ $\\rightarrow$ ૧૧ $\\rightarrow$ ૧૪; શ્રેણી ૨ માં -૩: ૨૦ $\\rightarrow$ ૧૭ $\\rightarrow$ ૧૪)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "11",
              "hi": "11",
              "gu": "૧૧"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "17",
              "hi": "17",
              "gu": "૧૭"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "25",
              "hi": "25",
              "gu": "૨૫"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! This is an alternating 2-in-1 stream. The odd positions form $(+3)$: $5, 8, 11, 14$. The 7th term is $11 + 3 = 14$!",
          "hi": "शानदार! यह 2-इन-1 मिश्रित श्रृंखला है। विषम स्थान (+3) का पालन करते हैं: $5, 8, 11, 14$। सातवाँ पद $11 + 3 = 14$ है!",
          "gu": "એકદમ સાચું! આ ૨-ઇન-૧ મિશ્ર શ્રેણી છે. એકી સ્થાનો (+૩) ના નિયમ પર છે: ૫, ૮, ૧૧, ૧૪. ૭મું પદ ૧૧ + ૩ = ૧૪ છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "inference_spark",
        "title": {
          "en": "Pattern Inference Superpower",
          "hi": "पैटर्न निष्कर्ष सुपरपावर",
          "gu": "પેટર્ન તારણ સુપરપાવર"
        },
        "body": {
          "en": "Extract step operations across terms to predict missing values and verify against subsequent terms.",
          "hi": "पदों के बीच की संक्रियाओं को समझकर गायब मानों का सटीक अनुमान लगाएं और पुष्टि करें।",
          "gu": "પદો વચ્ચેની ગણતરીનો નિયમ શોધીને ખૂટતી કિંમતોની સાચી આગાહી કરો અને ચકાસો."
        },
        "tags": [
          {
            "en": "Step Deltas",
            "hi": "पदों का अंतर",
            "gu": "પદોનો તફાવત"
          },
          {
            "en": "Multiply vs Add",
            "hi": "गुणा बनाम जोड़",
            "gu": "ગુણાકાર કે સરવાળો"
          },
          {
            "en": "Alternating Streams",
            "hi": "मिश्रित श्रृंखला",
            "gu": "મિશ્ર શ્રેણી"
          },
          {
            "en": "Next-Step Check",
            "hi": "अगले पद की जांच",
            "gu": "આગલા પદની ચકાસણી"
          },
          {
            "en": "Olympiad Math",
            "hi": "ओलंपियाड गणित",
            "gu": "ઓલિમ્પિયાડ ગણિત"
          },
          {
            "en": "Zero Guessing",
            "hi": "सटीक अनुमान",
            "gu": "સચોટ આગાહી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "inference_spark",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Calculate the differences (subtraction) and ratios (division) between first 3 adjacent terms.",
              "hi": "पहले 3 पास-पास के पदों के बीच का अंतर (घटाव) और अनुपात (भाग) निकालें।",
              "gu": "પહેલાં ૩ નજીકના પદો વચ્ચેનો તફાવત (બાદબાકી) અને ગુણોત્તર (ભાગાકાર) શોધો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "If differences jump up and down, test for an alternating 2-in-1 interleaved sequence.",
              "hi": "यदि अंतर ऊपर-नीचे हो रहा हो, तो एकांतर (2-इन-1) मिश्रित अनुक्रम की जांच करें।",
              "gu": "જો તફાવત વધ-ઘટ થતો હોય, તો એકાંતરે ચાલતી (૨-ઇન-૧) મિશ્ર શ્રેણી ચકાસો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Apply the identified rule to calculate the missing intermediate value.",
              "hi": "पहचाने गए नियम को लागू करके बीच की गायब संख्या की गणना करें।",
              "gu": "ઓળખેલા નિયમને લાગુ કરીને વચ્ચેની ખૂટતી સંખ્યા શોધો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Verify that applying the rule to your calculated answer produces the subsequent number in the sequence.",
              "hi": "जांचें कि आपके निकाले गए उत्तर पर नियम लगाने से श्रृंखला का अगला नंबर सही आता है।",
              "gu": "ચકાસો કે તમારા મળેલા જવાબ પર નિયમ લગાવતાં શ્રેણીનો પછીનો નંબર બરાબર મળે છે."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "inference_spark",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Solve the missing link in this sequence today: '1, 4, 9, 16, __, 36, 49' and explain the square-number pattern to someone!",
          "hi": "आज इस श्रृंखला की गायब संख्या खोजें: '1, 4, 9, 16, __, 36, 49' और वर्ग संख्या का नियम समझाएं!",
          "gu": "આજે આ શ્રેણીની ખૂટતી સંખ્યા શોધો: '૧, ૪, ૯, ૧૬, __, ૩૬, ૪૯' અને પૂર્ણવર્ગ સંખ્યાનો નિયમ સમજાવો!"
        },
        "commitment_button_text": {
          "en": "I will infer missing links with pattern logic!",
          "hi": "मैं पैटर्न तर्क से गायब कड़ियाँ खोजूँगा!",
          "gu": "હું પેટર્ન તર્કથી ખૂટતી કડીઓ શોધીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_112",
    "methodNumber": 112,
    "classLevel": 6,
    "category": {
      "en": "Pattern Recognition",
      "hi": "पैटर्न पहचान",
      "gu": "પેટર્ન ઓળખ"
    },
    "title": {
      "en": "Ratio Pattern (The Constant Multiplier Scale)",
      "hi": "अनुपात पैटर्न (स्थिर गुणक पैमाना)",
      "gu": "ગુણોત્તર પેટર્ન (અચળ ગુણક માપદંડ)"
    },
    "description": {
      "en": "Scale recipes, map distances, and financial proportions instantly by extracting the single constant multiplier ($k$) linking both quantities.",
      "hi": "दोनों राशियों को जोड़ने वाले एक स्थिर गुणक ($k$) को निकालकर रेसिपी, नक्शे की दूरी और वित्तीय अनुपातों को तुरंत मापें।",
      "gu": "બંને રાશિઓને જોડતા એક જ અચળ ગુણક ($k$) ને શોધીને રસોઈના માપ, નકશાના અંતર અને પ્રમાણના દાખલા તરત ઉકેલો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "ratio_balance",
        "title": {
          "en": "Struggling with Scaling Word Problems in Math?",
          "hi": "अनुपात और समानुपात के सवालों में उलझ जाते हैं?",
          "gu": "ગુણોત્તર અને પ્રમાણના વ્યવહારિક દાખલાઓમાં અટવાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "A recipe uses 3 cups flour for 8 cookies, and asks how much flour for 24 cookies—I start doing messy long division!",
            "hi": "रेसिपी में 8 कुकीज के लिए 3 कप आटा लगता है, 24 कुकीज के लिए कितना लगेगा—यह निकालने में मैं लंबा भाग करने लगता हूँ!",
            "gu": "૮ કૂકીઝ માટે ૩ કપ લોટ જોઈએ, ૨૪ કૂકીઝ માટે કેટલો લોટ જોઈએ—તે ગણવામાં હું લાંબો ભાગાકાર કરવા બેસું છું!"
          },
          {
            "en": "Map scales say 1 cm = 50 km, and converting 4.5 cm confuses my decimal multiplication!",
            "hi": "नक्शे का पैमाना 1 सेमी = 50 किमी है, और 4.5 सेमी को बदलने में मेरी दशमलव में गलती हो जाती है!",
            "gu": "નકશાનું માપ ૧ સેમી = ૫૦ કિમી છે, અને ૪.૫ સેમીનું અંતર શોધવામાં પોઇન્ટમાં ભૂલ થઈ જાય છે!"
          }
        ],
        "body": {
          "en": "Ratios are not division traps; they are magnifying glasses. Both sides of a ratio are locked together by a constant multiplier ($k$). If one side multiplies by 3 ($8 \\rightarrow 24$), the other side MUST multiply by the exact same 3 ($3 \\rightarrow 9$). Find the multiplier $k$ to solve in 2 seconds!",
          "hi": "अनुपात कोई उलझन नहीं हैं; वे आवर्ધक लेंस (Magnifying glass) जैसे हैं। अनुपात के दोनों पक्ष एक स्थिर गुणक ($k$) से बंधे होते हैं। यदि एक पक्ष 3 गुना बढ़ता है ($8 \\rightarrow 24$), तो दूसरा पक्ष भी ठीक 3 गुना बढ़ेगा ($3 \\rightarrow 9$)। गुणक $k$ खोजें और 2 सेकंड में उत्तर पाएं!",
          "gu": "ગુણોત્તર કોઈ અઘરી બાબત નથી; તે મોટો કાચ (લેન્સ) છે. ગુણોત્તરની બંને બાજુ એક અચળ ગુણક ($k$) થી જોડાયેલી હોય છે. જો એક બાજુ ૩ ગણી વધે (૮ $\\rightarrow$ ૨૪), તો બીજી બાજુ પણ બરાબર ૩ ગણી જ વધે (૩ $\\rightarrow$ ૯). ગુણક $k$ શોધો અને ૨ સેકન્ડમાં જવાબ લાવો!"
        },
        "key_takeaway": {
          "en": "Ratio Rule: Scale Factor $k = \\text{New Target} \\div \\text{Old Base} \\rightarrow$ Multiply Other Side by $k$!",
          "hi": "अनुपात नियम: गुणक $k = \\text{नया लक्ष्य} \\div \\text{पुराना आधार} \\rightarrow$ दूसरे पक्ष को $k$ से गुणा करें!",
          "gu": "ગુણોત્તર નિયમ: ગુણક $k = \\text{નવું લક્ષ્ય} \\div \\text{જૂનો આધાર} \\rightarrow$ બીજી બાજુને $k$ વડે ગુણો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "ratio_balance",
        "title": {
          "en": "Meet Dev",
          "hi": "देव से मिलें",
          "gu": "મળો દેવને"
        },
        "story": {
          "en": "Dev was asked: 'A car travels 180 km in 3 hours. How far does it travel in 5 hours at the same speed?' His classmate set up long algebraic equations. Dev extracted the Unit Rate multiplier: $180 \\div 3 = 60$ km/h ($k = 60$). Then for 5 hours: $5 \\times 60 = 300$ km! Dev had the answer in 4 seconds.",
          "hi": "देव से पूछा गया: 'एक कार 3 घंटे में 180 किमी चलती है। समान गति से 5 घंटे में कितनी दूर जाएगी?' सहपाठी लंबा समीकरण बनाने लगा। देव ने इकाई दर (Unit Rate) गुणक निकाला: $180 \\div 3 = 60$ किमी/घंटा ($k = 60$)। 5 घंटे के लिए: $5 \\times 60 = 300$ किमी! देव ने 4 सेकंड में उत्तर दे दिया।",
          "gu": "દેવને પૂછવામાં આવ્યું: 'એક કાર ૩ કલાકમાં ૧૮૦ કિમી જાય છે. સરખી ઝડપે ૫ કલાકમાં કેટલા કિમી જશે?' મિત્ર લાંબું સમીકરણ માંડવા બેઠો. દેવે એકમ દર (Unit Rate) ગુણક શોધ્યો: ૧૮૦ ÷ ૩ = ૬૦ કિમી/કલાક ($k = ૬૦$). ૫ કલાક માટે: ૫ $\\times ૬૦ = ૩૦૦$ કિમી! દેવે ૪ સેકન્ડમાં જવાબ આપી દીધો."
        },
        "insight_box": {
          "en": "Unitary Multiplier: Finding the value of '1 unit' ($180 \\div 3 = 60$) turns any complex ratio problem into single-digit multiplication.",
          "hi": "इकाई गुणक: '1 इकाई' का मान निकालने ($180 \\div 3 = 60$) से किसी भी अनुपात का सवाल आसान गुणा बन जाता है।",
          "gu": "એકમ ગુણક: '૧ એકમ' ની કિંમત શોધવાથી (૧૮૦ ÷ ૩ = ૬૦) કોઈપણ ગુણોત્તરનો દાખલો સરળ ગુણાકાર બની જાય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "ratio_balance",
        "question": {
          "en": "If the ratio of boys to girls in a school club is $3 : 4$ and there are 12 boys, how do you find the number of girls?",
          "hi": "यदि स्कूल क्लब में लड़कों और लड़कियों का अनुपात $3 : 4$ है और 12 लड़के हैं, तो लड़कियों की संख्या कैसे निकालेंगे?",
          "gu": "જો શાળા ક્લબમાં છોકરાઓ અને છોકરીઓનો ગુણોત્તર ૩ : ૪ હોય અને ૧૨ છોકરાઓ હોય, તો છોકરીઓની સંખ્યા કેવી રીતે શોધશો?"
        },
        "option_a": {
          "en": "Find multiplier $k = 12 \\div 3 = 4$. Multiply girls by 4: $4 \\times 4 = 16$ girls.",
          "hi": "गुणक $k = 12 \\div 3 = 4$ निकालें। लड़कियों को 4 से गुणा करें: $4 \\times 4 = 16$ लड़कियाँ।",
          "gu": "ગુણક $k = ૧૨ \\div ૩ = ૪$ શોધો. છોકરીઓની સંખ્યાને ૪ વડે ગુણો: ૪ $\\times ૪ = ૧૬$ છોકરીઓ."
        },
        "option_b": {
          "en": "Add 12 + 3 + 4 = 19 girls.",
          "hi": "12 + 3 + 4 = 19 लड़कियाँ जोड़ें।",
          "gu": "૧૨ + ૩ + ૪ = ૧૯ છોકરીઓ ઉમેરો."
        },
        "feedback": {
          "en": "Correct! The constant scale factor $k = 4$ scales both sides equally: $3 \\times 4 = 12$ boys and $4 \\times 4 = 16$ girls!",
          "hi": "सही! स्थिर पैमाना $k = 4$ दोनों पक्षों को बराबर बढ़ाता है: $3 \\times 4 = 12$ लड़के और $4 \\times 4 = 16$ लड़कियाँ!",
          "gu": "સાચું! અચળ ગુણક $k = ૪$ બંને બાજુ સરખી રીતે વધારે છે: ૩ $\\times ૪ = ૧૨$ છોકરાઓ અને ૪ $\\times ૪ = ૧૬$ છોકરીઓ!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "ratio_balance",
        "question": {
          "en": "On a world map, 2 cm represents 500 km in real life. \nThe distance between two cities on the map is 7 cm. \nWhat is the real-world distance between the cities?",
          "hi": "विश्व के नक्शे पर 2 सेमी वास्तविक जीवन में 500 किमी को दर्शाता है। \nनक्शे पर दो शहरों के बीच की दूरी 7 सेमी है। \nशहरों के बीच की वास्तविक दूरी क्या है?",
          "gu": "નકશા પર ૨ સેમી વાસ્તવમાં ૫૦૦ કિમી દર્શાવે છે. \nનકશા પર બે શહેરો વચ્ચેનું અંતર ૭ સેમી છે. \nશહેરો વચ્ચેનું સાચું અંતર કેટલું થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "1,750 km (1 cm = 250 km; 7 × 250 = 1,750 km)",
              "hi": "1,750 किमी (1 सेमी = 250 किमी; 7 × 250 = 1,750 किमी)",
              "gu": "૧,૭૫૦ કિમી (૧ સેમી = ૨૫૦ કિમી; ૭ × ૨૫૦ = ૧,૭૫૦ કિમી)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "3,500 km",
              "hi": "3,500 किमी",
              "gu": "૩,૫૦૦ કિમી"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "1,000 km",
              "hi": "1,000 किमी",
              "gu": "૧,૦૦૦ કિમી"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "750 km",
              "hi": "750 किमी",
              "gu": "૭૫૦ કિમી"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Unit rate: $500 \\div 2 = 250$ km per cm. Real distance: $7 \\times 250 = 1,750$ km! Flawless ratio scaling.",
          "hi": "शानदार! इकाई दर: $500 \\div 2 = 250$ किमी प्रति सेमी। वास्तविक दूरी: $7 \\times 250 = 1,750$ किमी!",
          "gu": "એકદમ સાચું! એકમ દર: ૫૦૦ ÷ ૨ = ૨૫૦ કિમી પ્રતિ સેમી. સાચું અંતર: ૭ $\\times ૨૫૦ = ૧,૭૫૦$ કિમી!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "ratio_balance",
        "title": {
          "en": "Ratio Multiplier Superpower",
          "hi": "अनुपात गुणक सुपरपावर",
          "gu": "ગુણોત્તર ગુણક સુપરપાવર"
        },
        "body": {
          "en": "Extract the constant multiplier scale factor to enlarge or shrink proportions effortlessly.",
          "hi": "राशियों को आसानी से बड़ा या छोटा करने के लिए स्थिर गुणक पैमाने ($k$) का उपयोग करें।",
          "gu": "રાશિઓને સરળતાથી મોટી કે નાની કરવા માટે અચળ ગુણક માપદંડ ($k$) નો ઉપયોગ કરો."
        },
        "tags": [
          {
            "en": "Scale Factor k",
            "hi": "पैमाना गुणक k",
            "gu": "માપદંડ ગુણક k"
          },
          {
            "en": "Unit Rate",
            "hi": "इकाई दर",
            "gu": "એકમ દર"
          },
          {
            "en": "Equivalent Ratios",
            "hi": "समतुल्य अनुपात",
            "gu": "સમાન ગુણોત્તર"
          },
          {
            "en": "Map Scaling",
            "hi": "नक्शा पैमाना",
            "gu": "નકશાનું માપ"
          },
          {
            "en": "Recipe Math",
            "hi": "रेसिपी गणित",
            "gu": "રસોઈ ગણતરી"
          },
          {
            "en": "2-Second Solves",
            "hi": "2-सेकंड हल",
            "gu": "૨-સેકન્ડ ઉકેલ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "ratio_balance",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Write the base ratio pair clearly (e.g. $A : B$).",
              "hi": "मूल अनुपात जोड़ी को स्पष्ट रूप से लिखें (जैसे $A : B$)।",
              "gu": "મૂળ ગુણોત્તરની જોડીને સ્પષ્ટ લખો (જેમ કે $A : B$)."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Calculate the constant scale factor: $k = \\text{Given New Quantity} \\div \\text{Original Base Quantity}$.",
              "hi": "स्थिर गुणक निकालें: $k = \\text{दी गई नई राशि} \\div \\text{मूल आधार राशि}$।",
              "gu": "અચળ ગુણક શોધો: $k = \\text{આપેલી નવી રાશિ} \\div \\text{મૂળ આધાર રાશિ}$."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Multiply the partner quantity by that exact same multiplier $k$.",
              "hi": "दूसरी साथी राशि को भी ठीक उसी गुणक $k$ से गुणा करें।",
              "gu": "બીજી જોડીદાર રાશિને પણ બરાબર તે જ ગુણક $k$ વડે ગુણો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Check that the simplified form of your new ratio matches the original base ratio.",
              "hi": "जांचें कि आपके नए अनुपात का सरल रूप मूल अनुपात से मेल खाता है।",
              "gu": "ચકાસો કે તમારા નવા ગુણોત્તરનું અતિસંક્ષિપ્ત રૂપ મૂળ ગુણોત્તર જેટલું જ થાય છે."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "ratio_balance",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Find a food recipe at home that serves 4 people and calculate the exact scaled ingredients to serve 12 people using $k = 3$!",
          "hi": "घर पर 4 लोगों की कोई रेसिपी देखें और $k = 3$ का उपयोग करके 12 लोगों के लिए सामग्री की सही मात्रा निकालें!",
          "gu": "ઘરમાં ૪ વ્યક્તિની કોઈ રસોઈ રેસિપી જુઓ અને $k = ૩$ વાપરીને ૧૨ વ્યક્તિ માટે જરૂરી સામગ્રીનું માપ શોધી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will scale proportions with constant multipliers!",
          "hi": "मैं स्थिर गुणक से अनुपात हल करूँगा!",
          "gu": "હું અચળ ગુણકથી ગુણોત્તર ગણીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_120",
    "methodNumber": 120,
    "classLevel": 6,
    "category": {
      "en": "Pattern Recognition",
      "hi": "पैटर्न पहचान",
      "gu": "પેટર્ન ઓળખ"
    },
    "title": {
      "en": "Rule Extraction (The Black-Box Formula Miner)",
      "hi": "नियम निष्कर्षण (ब्लैक-बॉक्स फॉर्मूला माइनर)",
      "gu": "નિયમ નિષ્કર્ષણ (બ્લેક-બોક્સ ફોર્મ્યુલા માઇનર)"
    },
    "description": {
      "en": "Crack any Input-Output function table (like $1 \\rightarrow 3, 2 \\rightarrow 7, 3 \\rightarrow 11$) by measuring the output jump rate to mine the exact linear formula ($y = mx + c$).",
      "hi": "आउटपुट के उछाल दर को मापकर इनपुट-आउटपुट फंक्शन टेबल (जैसे $1 \\rightarrow 3, 2 \\rightarrow 7, 3 \\rightarrow 11$) से सही रैखिक सूत्र ($y = mx + c$) निकालें।",
      "gu": "આઉટપુટના વધારાના દરને માપીને ઇનપુટ-આઉટપુટ કોષ્ટક (જેમ કે $૧ \\rightarrow ૩, ૨ \\rightarrow ૭, ૩ \\rightarrow ૧૧$) માંથી સાચું સૂત્ર ($y = mx + c$) શોધી કાઢો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "extract_formula",
        "title": {
          "en": "Stuck Staring at Mystery Input-Output Tables in Algebra?",
          "hi": "बीजगणित में इनपुट-आउटपुट टेबल देखकर नियम नहीं समझ आता?",
          "gu": "બીજગણિતમાં ઇનપુટ-આઉટપુટ કોષ્ટક જોઈને સાચો નિયમ નથી પકડાતો?"
        },
        "pain_quotes": [
          {
            "en": "An exam table shows Input: [1, 2, 3, 4] and Output: [5, 9, 13, 17], and guessing formulas by trial and error takes 5 minutes!",
            "hi": "परीक्षा में इनपुट [1, 2, 3, 4] और आउटपुट [5, 9, 13, 17] दिया है, और तुक्के से सूत्र खोजने में 5 मिनट बर्बाद हो जाते हैं!",
            "gu": "પરીક્ષામાં ઇનપુટ [૧, ૨, ૩, ૪] અને આઉટપુટ [૫, ૯, ૧૩, ૧૭] આપેલું છે, અને અંદાજ લગાવીને સૂત્ર શોધવામાં ૫ મિનિટ બગડે છે!"
          },
          {
            "en": "When asked 'What is the Output for Input = 100?', I have to write out all 100 rows manually!",
            "hi": "जब पूछा जाता है 'इनपुट 100 के लिए आउटपुट क्या है?', तो मुझे 100 पंक्तियाँ लिखनी पड़ती हैं!",
            "gu": "જ્યારે પૂછાય કે 'ઇનપુટ ૧૦૦ માટે આઉટપુટ શું થશે?', ત્યારે મારે ૧૦૦ લાઇન લખવી પડે છે!"
          }
        ],
        "body": {
          "en": "Input-Output machines operate on a secret two-part code: Multiplier ($m$) and Constant ($c$), written as $y = mx + c$. The step difference in outputs is ALWAYS your multiplier ($m$)! Find $m$ from the jump, adjust with $c$, and you've unlocked the master formula to solve for Input = 100 in 3 seconds!",
          "hi": "इनपुट-आउटपुट मशीनें दो हिस्सों वाले गुप्त कोड पर चलती हैं: गुणक ($m$) और अचर पद ($c$), जिसे $y = mx + c$ लिखा जाता है। आउटपुट के बीच का अंतर हमेशा आपका गुणक ($m$) होता है! अंतर से $m$ निकालें, $c$ जोड़ें और इनपुट 100 का मान 3 सेकंड में निकालें!",
          "gu": "ઇનપુટ-આઉટપુટ મશીનો બે ભાગના ગુપ્ત કોડ પર ચાલે છે: ગુણક ($m$) અને અચળ પદ ($c$), જેને $y = mx + c$ લખાય છે. આઉટપુટ વચ્ચેનો તફાવત હંમેશાં તમારો ગુણક ($m$) હોય છે! તફાવત પરથી $m$ મેળવો, $c$ ઉમેરો અને ઇનપુટ ૧૦૦ નો જવાબ ૩ સેકન્ડમાં મેળવો!"
        },
        "key_takeaway": {
          "en": "Formula Mining Rule: Output Jump = Multiplier ($m$) $\\rightarrow$ Adjust with Constant ($c$) $\\rightarrow$ Formula $y = mx + c$!",
          "hi": "सूत्र खनन नियम: आउटपुट का अंतर = गुणक ($m$) $\\rightarrow$ अचर पद ($c$) से मिलाएँ $\\rightarrow$ सूत्र $y = mx + c$!",
          "gu": "સૂત્ર શોધ નિયમ: આઉટપુટનો તફાવત = ગુણક ($m$) $\\rightarrow$ અચળ પદ ($c$) સેટ કરો $\\rightarrow$ સૂત્ર $y = mx + c$!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "extract_formula",
        "title": {
          "en": "Meet Tanmay",
          "hi": "तन्मय से मिलें",
          "gu": "મળો તન્મયને"
        },
        "story": {
          "en": "Tanmay got this table: Input $x$: [1, 2, 3, 4] $\\rightarrow$ Output $y$: [7, 10, 13, 16]. He checked the jump: $10 - 7 = 3$, $13 - 10 = 3$. That means multiplier $m = 3$ ($3x$). For $x=1$: $3 \\times 1 = 3$, but output is 7, so constant $c = +4$. Formula = $3x + 4$! For $x=50$: $3 \\times 50 + 4 = 154$. Solved in 5 seconds flat!",
          "hi": "तन्मय को टेबल मिली: इनपुट $x$: [1, 2, 3, 4] $\\rightarrow$ आउटपुट $y$: [7, 10, 13, 16]। उसने उछाल देखा: $10 - 7 = 3$, $13 - 10 = 3$। यानी गुणक $m = 3$ ($3x$)। $x=1$ के लिए: $3 \\times 1 = 3$, लेकिन आउटपुट 7 है, इसलिए अचर $c = +4$। सूत्र = $3x + 4$! $x=50$ के लिए: $3 \\times 50 + 4 = 154$!",
          "gu": "તન્મયને કોષ્ટક મળ્યું: ઇનપુટ $x$: [૧, ૨, ૩, ૪] $\\rightarrow$ આઉટપુટ $y$: [૭, ૧૦, ૧૩, ૧૬]. તેણે તફાવત જોયો: ૧૦ - ૭ = ૩, ૧૩ - ૧૦ = ૩. એટલે કે ગુણક $m = ૩$ ($૩x$). $x=૧$ માટે: ૩ $\\times ૧ = ૩$, પણ આઉટપુટ ૭ છે, તેથી અચળ $c = +૪$. સૂત્ર = $૩x + ૪$! $x=૫૦$ માટે: ૩ $\\times ૫૦ + ૪ = ૧૫૪$!"
        },
        "insight_box": {
          "en": "The Rate of Change Secret: In every linear function table, the constant difference between consecutive output numbers is GUARANTEED to be the slope/multiplier $m$.",
          "hi": "परिवर्तन दर का रहस्य: हर रैखिक तालिका में, आउटपुट संख्याओं के बीच का स्थिर अंतर निश्चित रूप से गुणक $m$ होता है।",
          "gu": "બદલાવના દરનું રહસ્ય: દરેક સુરેખ કોષ્ટકમાં, આઉટપુટ વચ્ચેનો અચળ તફાવત ૧૦૦% ગુણક $m$ જ હોય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "extract_formula",
        "question": {
          "en": "In an Input-Output table where Input increments by 1 ($x = 1, 2, 3...$) and Output is [4, 9, 14, 19...], how do you extract the multiplier $m$?",
          "hi": "इनपुट-आउटपुट टेबल में जहाँ इनपुट 1 से बढ़ता है ($x = 1, 2, 3...$) और आउटपुट [4, 9, 14, 19...] है, गुणक $m$ कैसे निकालेंगे?",
          "gu": "ઇનપુટ-આઉટપુટ કોષ્ટકમાં જ્યાં ઇનપુટ ૧ થી વધે છે ($x = ૧, ૨, ૩...$) અને આઉટપુટ [૪, ૯, ૧૪, ૧૯...] છે, ગુણક $m$ કેવી રીતે શોધશો?"
        },
        "option_a": {
          "en": "Calculate the step difference between outputs: $9 - 4 = 5$, so the multiplier is $5x$.",
          "hi": "आउटपुट के बीच का अंतर निकालें: $9 - 4 = 5$, इसलिए गुणक $5x$ है।",
          "gu": "આઉટપુટ વચ્ચેનો તફાવત શોધો: ૯ - ૪ = ૫, તેથી ગુણક ૫x છે."
        },
        "option_b": {
          "en": "Multiply all outputs together: $4 \\times 9 \\times 14 = 504$.",
          "hi": "सभी आउटपुट को आपस में गुणा करें: $4 \\times 9 \\times 14 = 504$।",
          "gu": "બધા આઉટપુટનો ગુણાકાર કરો: ૪ $\\times ૯ \\times ૧૪ = ૫૦૪$."
        },
        "feedback": {
          "en": "Correct! The constant step difference of 5 gives $m = 5$. Since $5(1) - 1 = 4$, the full extracted rule is $y = 5x - 1$!",
          "hi": "सही! 5 का स्थिर अंतर $m = 5$ देता है। चूंकि $5(1) - 1 = 4$, इसलिए पूरा सूत्र $y = 5x - 1$ है!",
          "gu": "સાચું! ૫ નો અચળ તફાવત $m = ૫$ આપે છે. ૫(૧) - ૧ = ૪ હોવાથી, સંપૂર્ણ સૂત્ર $y = ૫x - ૧$ બને છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "extract_formula",
        "question": {
          "en": "Table: Input $x$: [1, 2, 3, 4] $\\rightarrow$ Output $y$: [6, 11, 16, 21]. \nExtracted Rule: Output Jump = $11 - 6 = 5$ ($5x$). Adjust for $x=1$: $5(1) + 1 = 6$ $\\rightarrow y = 5x + 1$. \nWhat is the Output when Input $x = 20$?",
          "hi": "तालिका: इनपुट $x$: [1, 2, 3, 4] $\\rightarrow$ आउटपुट $y$: [6, 11, 16, 21]। \nनिकाला गया सूत्र: अंतर = $11 - 6 = 5$ ($5x$)। $x=1$ के लिए: $5(1) + 1 = 6$ $\\rightarrow y = 5x + 1$। \nजब इनपुट $x = 20$ हो तो आउटपुट क्या होगा?",
          "gu": "કોષ્ટક: ઇનપુટ $x$: [૧, ૨, ૩, ૪] $\\rightarrow$ આઉટપુટ $y$: [૬, ૧૧, ૧૬, ૨૧]. \nશોધેલું સૂત્ર: તફાવત = ૧૧ - ૬ = ૫ ($૫x$). $x=૧$ માટે: ૫(૧) + ૧ = ૬ $\\rightarrow y = ૫x + ૧$. \nજ્યારે ઇનપુટ $x = ૨૦$ હોય ત્યારે આઉટપુટ શું થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "101 (5 × 20 + 1 = 100 + 1 = 101)",
              "hi": "101 (5 × 20 + 1 = 100 + 1 = 101)",
              "gu": "૧૦૧ (૫ × ૨૦ + ૧ = ૧૦૦ + ૧ = ૧૦૧)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "100",
              "hi": "100",
              "gu": "૧૦૦"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "105",
              "hi": "105",
              "gu": "૧૦૫"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "95",
              "hi": "95",
              "gu": "૯૫"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Using extracted formula $y = 5x + 1$: for $x=20$, $y = 5(20) + 1 = 101$! Solved in 2 seconds.",
          "hi": "शानदार! निकाले गए सूत्र $y = 5x + 1$ से: $x=20$ के लिए $y = 5(20) + 1 = 101$! सिर्फ 2 सेकंड में हल।",
          "gu": "એકદમ સાચું! શોધેલા સૂત્ર $y = ૫x + ૧$ થી: $x=૨૦$ માટે $y = ૫(૨૦) + ૧ = ૧૦૧$! માત્ર ૨ સેકન્ડમાં સાચો જવાબ."
        }
      },
      {
        "type": "strategy_pills",
        "icon": "extract_formula",
        "title": {
          "en": "Formula Miner Superpower",
          "hi": "फॉर्मूला माइनर सुपरपावर",
          "gu": "ફોર્મ્યુલા માઇનર સુપરપાવર"
        },
        "body": {
          "en": "Extract the multiplier from output step-jumps to build instant linear function formulas ($y = mx + c$).",
          "hi": "त्वरित रैखिक सूत्र ($y = mx + c$) बनाने के लिए आउटपुट के अंतर से गुणक $m$ निकालें।",
          "gu": "ઝડપી સુરેખ સૂત્ર ($y = mx + c$) બનાવવા માટે આઉટપુટના તફાવત પરથી ગુણક $m$ શોધો."
        },
        "tags": [
          {
            "en": "Output Jump = m",
            "hi": "आउटपुट अंतर = m",
            "gu": "આઉટપુટ તફાવત = m"
          },
          {
            "en": "Adjust Constant c",
            "hi": "अचर पद c",
            "gu": "અચળ પદ c"
          },
          {
            "en": "y = mx + c",
            "hi": "y = mx + c",
            "gu": "y = mx + c"
          },
          {
            "en": "Function Tables",
            "hi": "फंक्शन तालिकाएं",
            "gu": "ફંક્શન કોષ્ટક"
          },
          {
            "en": "Algebraic Mastery",
            "hi": "बीजगणित महारत",
            "gu": "બીજગણિત નિપુણતા"
          },
          {
            "en": "Zero Guessing",
            "hi": "तुक्का मुक्त",
            "gu": "અંદાજ મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "extract_formula",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Calculate the step difference between consecutive output numbers to find multiplier $m$.",
              "hi": "गुणक $m$ खोजने के लिए लगातार आने वाली आउटपुट संख्याओं के बीच का अंतर निकालें।",
              "gu": "ગુણક $m$ શોધવા માટે ક્રમિક આઉટપુટ સંખ્યાઓ વચ્ચેનો તફાવત શોધો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Multiply the first input ($x=1$) by $m$ to see what starter value it produces.",
              "hi": "पहले इनपुट ($x=1$) को $m$ से गुणा करके देखें कि क्या मान आता है।",
              "gu": "પહેલા ઇનપુટ ($x=૧$) ને $m$ વડે ગુણીને જુઓ કે કઈ કિંમત મળે છે."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Add or subtract the difference to match the actual output, giving constant $c$ ($y = mx + c$).",
              "hi": "वास्तविक आउटपुट से मिलान करने के लिए जोड़ या घटाव करके अचर $c$ ज्ञात करें ($y = mx + c$)।",
              "gu": "સાચા આઉટપુટ સાથે મેળવવા સરવાળો કે બાદબાકી કરીને અચળ $c$ મેળવો ($y = mx + c$)."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Test your formula on row 2 ($x=2$) and row 3 ($x=3$) to verify 100% accuracy before solving for big inputs.",
              "hi": "बड़े इनपुट का मान निकालने से पहले पंक्ति 2 और 3 पर सूत्र की 100% पुष्टि करें।",
              "gu": "મોટા ઇનપુટ ગણતાં પહેલાં હરોળ ૨ અને ૩ પર સૂત્રની ૧૦૦% ખાતરી કરી લો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "extract_formula",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Extract the master formula for this table: Input $x$: [1, 2, 3] $\\rightarrow$ Output $y$: [8, 14, 20] and calculate the output for $x = 10$!",
          "hi": "इस टेबल का सूत्र निकालें: इनपुट $x$: [1, 2, 3] $\\rightarrow$ आउटपुट $y$: [8, 14, 20] और $x = 10$ का मान बताएं!",
          "gu": "આ કોષ્ટકનું સૂત્ર શોધો: ઇનપુટ $x$: [૧, ૨, ૩] $\\rightarrow$ આઉટપુટ $y$: [૮, ૧૪, ૨૦] અને $x = ૧૦$ ની કિંમત ગણી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will mine function formulas with output jumps!",
          "hi": "मैं आउटपुट अंतर से बीजगणितीय सूत्र निकालूँगा!",
          "gu": "હું આઉટપુટ તફાવત પરથી ગાણિતિક સૂત્રો શોધીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_135",
    "methodNumber": 135,
    "classLevel": 6,
    "category": {
      "en": "Attention / Focus Strategies",
      "hi": "ध्यान व एकाग्रता रणनीतियाँ",
      "gu": "ધ્યાન અને એકાગ્રતા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Time Boxing (The Fixed-Deadline Fortress)",
      "hi": "टाइम बॉक्सिंग (निश्चित समय सीमा का किला)",
      "gu": "ટાઇમ બોક્સિંગ (ચોક્કસ સમય મર્યાદાનો કિલ્લો)"
    },
    "description": {
      "en": "Defeat procrastination and endless daydreaming by assigning strict, fixed time boxes (e.g. exactly 25 minutes) to specific tasks with an alarm timer.",
      "hi": "अलार्म टाइमर के साथ किसी कार्य के लिए निश्चित समय बॉक्स (जैसे ठीक 25 मिनट) तय करके काम टालने की आदत और ध्यान भटकाव को खत्म करें।",
      "gu": "અલાર્મ ટાઈમર સાથે ચોક્કસ કાર્ય માટે સમય મર્યાદા (જેમ કે બરાબર ૨૫ મિનિટ) નક્કી કરીને આળસ અને ધ્યાન ભટકવાની ટેવને દૂર કરો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "time_box_clock",
        "title": {
          "en": "A 30-Minute Homework Assignment Dragging for 3 Hours?",
          "hi": "30 मिनट का गृहकार्य 3 घंटे तक खिंचता चला जाता है?",
          "gu": "૩૦ મિનિટનું હોમવર્ક ૩ કલાક સુધી લંબાયા કરે છે?"
        },
        "pain_quotes": [
          {
            "en": "I sit down at 5 PM to do 10 math questions and at 8 PM I am still on question 6 because I kept checking my phone!",
            "hi": "मैं शाम 5 बजे 10 सवाल करने बैठा और रात 8 बजे भी छठे सवाल पर ही था क्योंकि मैं बार-बार फोन देख रहा था!",
            "gu": "હું સાંજે ૫ વાગ્યે ૧૦ દાખલા ગણવા બેઠો અને રાત્રે ૮ વાગ્યે પણ ૬ઠ્ઠા દાખલા પર જ હતો કારણ કે હું વારંવાર ફોન જોતો હતો!"
          },
          {
            "en": "Without a finish timer, studying feels like an endless mountain and my energy drains away!",
            "hi": "बिना समय सीमा के पढ़ाई एक अंतहीन पहाड़ जैसी लगती है और मेरी ऊर्जा खत्म हो जाती है!",
            "gu": "સમય મર્યાદા વગર ભણવું એક ક્યારેય ન પતતા પહાડ જેવું લાગે છે અને મારો ઉત્સાહ ઓસરી જાય છે!"
          }
        ],
        "body": {
          "en": "Parkinson's Law proves: 'Work expands to fill the time available for its completion.' If you give yourself all evening to finish homework, it will take all evening. 'Time Boxing' locks a task inside a strict 25-minute box with a ticking timer, igniting intense laser focus and laser speed!",
          "hi": "पार्किंसन का नियम कहता है: 'कार्य उपलब्ध समय के अनुसार फैलता जाता है।' यदि आप गृहकार्य के लिए पूरी शाम देंगे, तो उसमें पूरी शाम ही लगेगी। 'टाइम बॉक्सिंग' कार्य को घड़ी के साथ 25 मिनट के एक निश्चित बॉक्स में बंद कर देती है, जिससे एकाग्रता और गति कई गुना बढ़ जाती है!",
          "gu": "પાર્કિન્સનનો નિયમ કહે છે: 'કામ ઉપલબ્ધ સમય પ્રમાણે લંબાતું જાય છે.' જો તમે હોમવર્ક માટે આખી સાંજ આપશો, તો આખી સાંજ જ લાગશે. 'ટાઇમ બોક્સિંગ' કાર્યને ૨૫ મિનિટના એક ચોક્કસ બોક્સમાં કેદ કરે છે, જેથી એકાગ્રતા અને ઝડપ અનેક ગણી વધી જાય છે!"
        },
        "key_takeaway": {
          "en": "Time Box Rule: Assign Exact Minutes (e.g. 25 min) $\\rightarrow$ Set Visible Timer $\\rightarrow$ Sprint with Zero Distractions until Alarm Rings!",
          "hi": "टाइम बॉक्स नियम: निश्चित मिनट तय करें (जैसे 25 मिनट) $\\rightarrow$ टाइमर लगाएं $\\rightarrow$ अलार्म बजने तक बिना भटके पूरा करें!",
          "gu": "ટાઇમ બોક્સ નિયમ: ચોક્કસ મિનિટ નક્કી કરો (જેમ કે ૨૫ મિનિટ) $\\rightarrow$ ટાઈમર સેટ કરો $\\rightarrow$ એલાર્મ વાગે ત્યાં સુધી સંપૂર્ણ ધ્યાનથી પૂરું કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "time_box_clock",
        "title": {
          "en": "Meet Shaurya",
          "hi": "शौर्य से मिलें",
          "gu": "મળો શૌર્યને"
        },
        "story": {
          "en": "Shaurya used to spend 2.5 hours on his English essay because he paused every 2 minutes to stare out the window. His father taught him Time Boxing: 'You have a 25-minute box. Write as much as you can before the kitchen timer beeps.' Challenged by the countdown, Shaurya finished the entire essay in 22 minutes with peak creativity!",
          "hi": "शौर्य को अंग्रेजी निबंध लिखने में 2.5 घंटे लगते थे क्योंकि वह हर 2 मिनट में खिड़की से बाहर देखने लगता था। उसके पिता ने टाइम बॉक्सिंग सिखाई: 'तुम्हारे पास 25 मिनट का बॉक्स है। टाइमर बजने से पहले पूरा करो।' उलटी गिनती की चुनौती से शौर्य ने 22 मिनट में शानदार निबंध पूरा कर लिया!",
          "gu": "શૌર્યને અંગ્રેજી નિબંધ લખવામાં ૨.૫ કલાક થતા કારણ કે તે દર ૨ મિનિટે બારી બહાર જોવા લાગતો. તેના પિતાએ ટાઇમ બોક્સિંગ શીખવ્યું: 'તારી પાસે ૨૫ મિનિટનું બોક્સ છે. ટાઈમર વાગતાં પહેલાં પૂરું કર.' સમયની ગણતરીથી ઉત્સાહમાં આવીને શૌર્યે ૨૨ મિનિટમાં શ્રેષ્ઠ નિબંધ પૂરો કર્યો!"
        },
        "insight_box": {
          "en": "Urgency Creates Flow: A visible ticking countdown activates the brain's executive focus network, making boring tasks exciting sprints.",
          "hi": "समय सीमा से एकाग्रता: चलती हुई उलटी गिनती मस्तिष्क के फोकस नेटवर्क को सक्रिय करती है, जिससे नीरस काम भी रोमांचक दौड़ बन जाता है।",
          "gu": "સમય મર્યાદાથી એકાગ્રતા: ઊંધી ગણતરી મગજના એકાગ્રતા કેન્દ્રને સક્રિય કરે છે, જેથી કંટાળાજનક કામ પણ એક રોમાંચક રમત બની જાય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "time_box_clock",
        "question": {
          "en": "Why is setting a strict 20-minute timer for a math worksheet far more effective than just 'studying until you finish'?",
          "hi": "गणित की वर्कशीट के लिए 20 मिनट का सख्त टाइमर लगाना बिना समय सीमा के 'जब तक खत्म न हो पढ़ते रहने' से कहीं अधिक प्रभावी क्यों है?",
          "gu": "ગણિતની વર્કશીટ માટે ૨૦ મિનિટનું ચોક્કસ ટાઈમર સેટ કરવું સમય મર્યાદા વગર 'પૂરું ન થાય ત્યાં સુધી વાંચતા રહેવા' કરતાં શા માટે વધુ અસરકારક છે?"
        },
        "option_a": {
          "en": "It creates healthy psychological urgency, prevents Parkinson's Law time-expansion, and eliminates casual multitasking.",
          "hi": "यह स्वस्थ मानसिक तात्कालिकता बनाता है, समय के अनावश्यक फैलाव को रोकता है और ध्यान भटकने से बचाता है।",
          "gu": "તે સ્વસ્થ માનસિક ઝડપ બનાવે છે, સમયનો બગાડ અટકાવે છે અને ધ્યાન ભટકવા દેતું નથી."
        },
        "option_b": {
          "en": "It lets you rush through with messy handwriting and wrong answers.",
          "hi": "यह आपको गंदी लिखावट और गलत उत्तरों के साथ जल्दबाजी करने देता है।",
          "gu": "તે તમને ખરાબ અક્ષરો અને ખોટા જવાબો સાથે ઉતાવળ કરવા દે છે."
        },
        "feedback": {
          "en": "Correct! Fixed time boxes force your brain into high-efficiency single-tasking.",
          "hi": "सही! निश्चित समय बॉक्स मस्तिष्क को उच्च-दक्षता वाले एकल-कार्य (single-tasking) में लगा देता है।",
          "gu": "સાચું! ચોક્કસ ટાઇમ બોક્સ મગજને સંપૂર્ણ એકાગ્રતા સાથે એક જ કામમાં જોતરી દે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "time_box_clock",
        "question": {
          "en": "You have 3 tasks today: Science diagram (15 min), Math homework (25 min), History reading (20 min). How should a master Time Boxer schedule their evening?",
          "hi": "आज आपके पास 3 काम हैं: विज्ञान चित्र (15 मिनट), गणित गृहकार्य (25 मिनट), इतिहास पठन (20 मिनट)। एक कुशल टाइम बॉक्सर अपनी शाम कैसे तय करेगा?",
          "gu": "આજે તમારી પાસે ૩ કામ છે: વિજ્ઞાન આકૃતિ (૧૫ મિનિટ), ગણિત હોમવર્ક (૨૫ મિનિટ), ઇતિહાસ વાંચન (૨૦ મિનિટ). એક હોશિયાર ટાઇમ બોક્સરે સાંજનું આયોજન કેવી રીતે કરવું જોઈએ?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Set three discrete back-to-back time boxes with 5-minute movement breaks between them",
              "hi": "बीच में 5-5 मिनट के ब्रेक के साथ तीन अलग-अलग निश्चित टाइम बॉक्स बनाएं और टाइमर चलाएं",
              "gu": "વચ્ચે ૫-૫ મિનિટના વિરામ સાથે ત્રણ અલગ-અલગ ચોક્કસ ટાઇમ બોક્સ બનાવો અને ટાઈમર સેટ કરો"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Open all 3 books on the desk at once and switch between them every 30 seconds",
              "hi": "मेज पर तीनों किताबें एक साथ खोलें और हर 30 सेकंड में बदलते रहें",
              "gu": "ટેબલ પર ત્રણેય ચોપડીઓ સાથે ખોલો અને દર ૩૦ સેકન્ડે બદલતા રહો"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Watch videos for 4 hours and start studying at 11 PM",
              "hi": "4 घंटे वीडियो देखें और रात 11 बजे पढ़ाई शुरू करें",
              "gu": "૪ કલાક વિડીયો જુઓ અને રાત્રે ૧૧ વાગ્યે ભણવા બેસો"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Only do the Science diagram and skip the rest",
              "hi": "सिर्फ विज्ञान का चित्र बनाएं और बाकी सब छोड़ दें",
              "gu": "માત્ર વિજ્ઞાનની આકૃતિ દોરો અને બાકીનું છોડી દો"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Sequential, bounded time boxes with short physical reboot breaks prevent burnout and guarantee complete mastery!",
          "hi": "शानदार! छोटे ब्रेक के साथ क्रमिक समय बॉक्स थकान को रोकते हैं और पूरा काम समय पर खत्म करते हैं!",
          "gu": "એકદમ સાચું! નાના વિરામ સાથે ક્રમબદ્ધ ટાઇમ બોક્સ થાક અટકાવે છે અને બધું કામ સમયસર પૂરું કરે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "time_box_clock",
        "title": {
          "en": "Time Box Fortress Superpower",
          "hi": "टाइम बॉक्स किला सुपरपावर",
          "gu": "ટાઇમ બોક્સ કિલ્લો સુપરપાવર"
        },
        "body": {
          "en": "Lock tasks inside strict countdown time boxes to destroy procrastination and unlock intense flow.",
          "hi": "काम टालने की आदत को खत्म करने और तीव्र एकाग्रता के लिए कार्यों को निश्चित टाइमर बॉक्स में बंद करें।",
          "gu": "આળસ દૂર કરવા અને ઊંડી એકાગ્રતા મેળવવા માટે કાર્યોને ચોક્કસ ટાઈમર બોક્સમાં કેદ કરો."
        },
        "tags": [
          {
            "en": "Fixed Deadlines",
            "hi": "निश्चित समय सीमा",
            "gu": "ચોક્કસ સમય મર્યાદા"
          },
          {
            "en": "Parkinson's Law",
            "hi": "पार्किंसन नियम",
            "gu": "પાર્કિન્સન નિયમ"
          },
          {
            "en": "Visible Timer",
            "hi": "दृश्यमान टाइमर",
            "gu": "ચાલુ ટાઈમર"
          },
          {
            "en": "Single-Tasking",
            "hi": "एकल कार्य",
            "gu": "એક સમયે એક કામ"
          },
          {
            "en": "Sprint Energy",
            "hi": "दौड़ जैसी ऊर्जा",
            "gu": "ઝડપી ઉર્જા"
          },
          {
            "en": "Zero Daydreaming",
            "hi": "भटकाव मुक्त",
            "gu": "ભટક્યા વગર"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "time_box_clock",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Pick ONE single task and define a concrete finishing criteria (e.g. 'Solve 10 algebra problems').",
              "hi": "एक कार्य चुनें और उसका स्पष्ट लक्ष्य तय करें (जैसे '10 बीजगणित सवाल हल करना')।",
              "gu": "એક કાર્ય પસંદ કરો અને તેનો સ્પષ્ટ લક્ષ્યાંક નક્કી કરો (જેમ કે '૧૦ બીજગણિત દાખલા ગણવા')."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Assign a realistic, slightly challenging time box (e.g. 20 or 25 minutes).",
              "hi": "एक यथार्थवादी लेकिन चुनौतीपूर्ण समय बॉक्स तय करें (जैसे 20 या 25 मिनट)।",
              "gu": "એક યોગ્ય પણ થોડો પડકારજનક ટાઇમ બોક્સ નક્કી કરો (જેમ કે ૨૦ કે ૨૫ મિનિટ)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Start a physical countdown timer and place it where you can see the ticking digits.",
              "hi": "एक टाइमर चालू करें और उसे ऐसी जगह रखें जहाँ से समय दिखता रहे।",
              "gu": "એક ટાઈમર ચાલુ કરો અને તેને એવી જગ્યાએ મૂકો જ્યાંથી સમય દેખાતો રહે."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Work in absolute sprint mode with zero phone or chat interruptions until the buzzer sounds.",
              "hi": "बजर बजने तक बिना किसी फोन या बातचीत के पूर्ण एकाग्रता से कार्य करें।",
              "gu": "બઝર વાગે ત્યાં સુધી કોઈપણ ફોન કે વાતચીત વગર સંપૂર્ણ એકાગ્રતાથી કામ કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "time_box_clock",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Set a 20-minute Time Box on your kitchen timer or clock today for your toughest homework assignment and race the clock to finish before it rings!",
          "hi": "आज अपने सबसे कठिन गृहकार्य के लिए 20 मिनट का टाइम बॉक्स लगाएं और अलार्म बजने से पहले पूरा करें!",
          "gu": "આજે તમારા સૌથી અઘરા હોમવર્ક માટે ૨૦ મિનિટનું ટાઇમ બોક્સ સેટ કરો અને એલાર્મ વાગે તે પહેલાં પૂરું કરી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will conquer tasks with Time Boxing!",
          "hi": "मैं टाइम बॉक्सिंग से काम फतह करूँगा!",
          "gu": "હું ટાઇમ બોક્સિંગથી કાર્યો પૂરાં કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_142",
    "methodNumber": 142,
    "classLevel": 6,
    "category": {
      "en": "Spatial Intelligence Strategies",
      "hi": "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      "gu": "અવકાશી બુદ્ધિમત્તા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Mental Folding (3D Origami Net Solver)",
      "hi": "मानसिक मोड़ (3D ओरिगेमी नेट सॉल्वर)",
      "gu": "માનસિક ગડી (૩D ઓરિગામી નેટ સોલ્વર)"
    },
    "description": {
      "en": "Fold flat 2D net patterns into 3D cubes and prisms in your mind by fixing a base square and applying the Opposite Face Rule (faces separated by 1 square are opposite).",
      "hi": "एक आधार वर्ग चुनकर और विपरीत फलक नियम लागू करके दिमाग में 2D नेट को 3D घन और प्रिज्म में मोड़ें।",
      "gu": "એક આધાર ચોરસ નક્કી કરીને અને સામસામેની બાજુના નિયમથી મગજમાં ૨D નેટને ૩D સમઘન અને પ્રિઝમમાં વાળીને જુઓ."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "origami_fold",
        "title": {
          "en": "Stumped by Flat 2D Nets Folding into 3D Cubes?",
          "hi": "सपाट 2D नेट को 3D पासे में मोड़ते समय भ्रमित हो जाते हैं?",
          "gu": "સપાટ ૨D નેટને ૩D સમઘનમાં વાળવાના દાખલાઓમાં અટવાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "An exam question shows a 6-square T-shaped net and asks 'Which face is opposite Face A?', and my brain spins in circles!",
            "hi": "परीक्षा में T-आकार का 6-वर्गों वाला नेट देखकर पूछा गया 'फलक A के विपरीत कौन सा है?', और मेरा दिमाग चकरा गया!",
            "gu": "પરીક્ષામાં T-આકારની ૬-ખાનાવાળી નેટ જોઈને પૂછાયું 'A ની સામેની બાજુ કઈ આવશે?', અને મગજ ગોટે ચડી ગયું!"
          },
          {
            "en": "I cannot tell which folded 3D cube matches the unfolded paper pattern without physical scissors!",
            "hi": "बिना कैंची से कागज काटे मैं सोच ही नहीं पाता कि कौन सा 3D घन सही बनेगा!",
            "gu": "કાતરથી કાગળ કાપ્યા વગર હું વિચારી જ નથી શકતો કે કયો ૩D સમઘન સાચો બનશે!"
          }
        ],
        "body": {
          "en": "You don't need scissors to fold 3D shapes. 'Mental Folding' uses the golden Opposite Face Rule: in any straight line of squares on a cube net, faces separated by exactly ONE square will ALWAYS fold to become opposite sides (they can never touch or share an edge)! Anchor the center base and fold the flaps 90° up!",
          "hi": "3D आकृतियों को मोड़ने के लिए कैंची की जरूरत नहीं है। 'मानसिक मोड़' का स्वर्णिम विपरीत फलक नियम है: किसी भी सीधी रेखा में ठीक 1 वर्ग छोड़कर आने वाले फलक हमेशा आमने-सामने (विपरीत) मुड़ते हैं! केंद्र को आधार बनाएं और बाकी को 90° ऊपर मोड़ें!",
          "gu": "૩D આકારો વાળવા માટે કાતરની જરૂર નથી. 'માનસિક ગડી' નો ગોલ્ડન નિયમ છે: કોઈપણ સીધી લાઈનમાં બરાબર ૧ ખાનું છોડીને આવતી બાજુઓ હંમેશાં સામસામે (વિરોધી) જ આવે! વચ્ચેના ખાનાને પાયો બનાવો અને બાકીના ભાગને ૯૦° વાળો!"
        },
        "key_takeaway": {
          "en": "Opposite Face Rule: Faces separated by 1 square in a straight row = Opposite Faces in the 3D Cube!",
          "hi": "विपरीत फलक नियम: सीधी रेखा में 1 वर्ग के अंतर वाले फलक = 3D घन में आमने-सामने के फलक!",
          "gu": "સામસામેની બાજુનો નિયમ: સીધી લાઈનમાં ૧ ખાનાના અંતરે આવતી બાજુઓ = ૩D સમઘનમાં સામસામેની બાજુઓ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "origami_fold",
        "title": {
          "en": "Meet Arya",
          "hi": "आर्या से मिलें",
          "gu": "મળો આર્યાને"
        },
        "story": {
          "en": "Arya faced a dice net with numbers: Top-to-bottom column [1, 2, 3, 4] with wing 5 on left of 2, and wing 6 on right of 2. The question asked: 'What number is opposite 1?' Arya applied the 1-skip rule: 1 skips 2 $\\rightarrow$ opposite is 3! 2 skips 3 $\\rightarrow$ opposite is 4! Wings 5 and 6 fold opposite each other. Arya solved all 3 opposite pairs in 4 seconds!",
          "hi": "आर्या के सामने पासे का नेट था: ऊपर से नीचे [1, 2, 3, 4], 2 के बाईं ओर 5 और दाईं ओर 6। सवाल था: '1 के विपरीत क्या है?' आर्या ने 1-छोड़ो नियम लगाया: 1 के बाद 2 छोड़ा $\\rightarrow$ विपरीत 3! 2 के बाद 3 छोड़ा $\\rightarrow$ विपरीत 4! पंख 5 और 6 आमने-सामने होंगे। सिर्फ 4 सेकंड में तीनों जोड़े हल!",
          "gu": "આર્યા સામે પાસાની નેટ હતી: ઉપરથી નીચે [૧, ૨, ૩, ૪], ૨ ની ડાબે ૫ અને જમણે ૬. સવાલ હતો: '૧ ની સામે કયો અંક આવશે?' આર્યાએ ૧-છોડો નિયમ વાપર્યો: ૧ પછી ૨ છોડ્યો $\\rightarrow$ સામે ૩! ૨ પછી ૩ છોડ્યો $\\rightarrow$ સામે ૪! પાંખો ૫ અને ૬ સામસામે આવશે. માત્ર ૪ સેકન્ડમાં ત્રણેય જોડી ઉકેલાઈ ગઈ!"
        },
        "insight_box": {
          "en": "Never Adjacent: Two opposite faces on a 3D cube can NEVER touch each other or share a common vertex.",
          "hi": "कभी पास नहीं: 3D घन में दो विपरीत फलक कभी भी एक-दूसरे को छू नहीं सकते और न ही कोई कोना साझा कर सकते हैं।",
          "gu": "ક્યારેય અડકે નહીં: ૩D સમઘનમાં સામસામેની બે બાજુઓ ક્યારેય એકબીજાને અડી ન શકે કે સમાન ખૂણો ન ધરાવી શકે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "origami_fold",
        "question": {
          "en": "In a straight 4-square row of a cube net with letters [A, B, C, D], which face will be OPPOSITE to face A when folded?",
          "hi": "घन के नेट की 4-वर्गों वाली सीधी पंक्ति [A, B, C, D] में, मोड़ने पर फलक A के विपरीत कौन सा फलक होगा?",
          "gu": "સમઘનની નેટની ૪-ખાનાવાળી સીધી લાઈન [A, B, C, D] માં, વાળ્યા પછી ફલક A ની સામે કઈ બાજુ આવશે?"
        },
        "option_a": {
          "en": "Face C (Applying the skip-1 rule: A skips B to face C).",
          "hi": "फलक C (1-छोड़ो नियम लागू करने पर: A, B को छोड़कर C के सामने होगा)।",
          "gu": "ફલક C (૧-છોડો નિયમ મુજબ: A, B ને છોડીને C ની સામે આવશે)."
        },
        "option_b": {
          "en": "Face B (The adjacent neighbor).",
          "hi": "फलक B (पास वाला पड़ोसी)।",
          "gu": "ફલક B (બાજુનો પડોશી)."
        },
        "feedback": {
          "en": "Correct! In any linear strip, skipping 1 square yields the exact opposite face of the folded cube.",
          "hi": "सही! किसी भी सीधी पट्टी में 1 वर्ग छोड़ने पर मुड़े हुए घन का ठीक विपरीत फलक मिलता है।",
          "gu": "સાચું! કોઈપણ સીધી પટ્ટીમાં ૧ ખાનું છોડતાં વાળેલા સમઘનની બરાબર સામસામેની બાજુ મળે છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "origami_fold",
        "question": {
          "en": "A standard dice net has faces with dots: 1, 2, 3, 4, 5, 6. \nIf Face 1 is opposite Face 6, Face 2 is opposite Face 5, and Face 3 is opposite Face 4, what is the sum of dots on ANY pair of opposite faces on a standard die?",
          "hi": "एक मानक पासे के नेट में 1, 2, 3, 4, 5, 6 बिंदु हैं। \nयदि 1 के विपरीत 6, 2 के विपरीत 5, और 3 के विपरीत 4 है, तो मानक पासे के किन्हीं भी दो विपरीत फलकों के बिंदुओं का योग क्या होता है?",
          "gu": "એક સામાન્ય પાસાની નેટ પર ૧, ૨, ૩, ૪, ૫, ૬ બિંદુઓ છે. \nજો ૧ ની સામે ૬, ૨ ની સામે ૫, અને ૩ ની સામે ૪ હોય, તો સામાન્ય પાસા પર કોઈપણ સામસામેની બાજુઓના બિંદુઓનો સરવાળો કેટલો થાય?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Always 7 (1+6=7, 2+5=7, 3+4=7)",
              "hi": "हमेशा 7 (1+6=7, 2+5=7, 3+4=7)",
              "gu": "હંમેશાં ૭ (૧+૬=૭, ૨+૫=૭, ૩+૪=૭)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Always 10",
              "hi": "हमेशा 10",
              "gu": "હંમેશાં ૧૦"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Always 6",
              "hi": "हमेशा 6",
              "gu": "હંમેશાં ૬"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Random numbers each time",
              "hi": "हर बार अलग-अलग संख्या",
              "gu": "દર વખતે અલગ અલગ સંખ્યા"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! On every authentic playing die, opposite faces always sum to exactly 7 ($1+6=7, 2+5=7, 3+4=7$)!",
          "hi": "शानदार! हर असली पासे पर आमने-सामने के फलकों का योग हमेशा 7 ($1+6=7, 2+5=7, 3+4=7$) होता है!",
          "gu": "એકદમ સાચું! દરેક સાચા પાસા પર સામસામેની બાજુઓનો સરવાળો હંમેશાં બરાબર ૭ ($૧+૬=૭, ૨+૫=૭, ૩+૪=૭$) જ થાય છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "origami_fold",
        "title": {
          "en": "Mental Origami Superpower",
          "hi": "मानसिक ओरिगेमी सुपरपावर",
          "gu": "માનસિક ઓરિગામી સુપરપાવર"
        },
        "body": {
          "en": "Identify opposite cube faces instantly by skipping one square along straight lines.",
          "hi": "सीधी रेखाओं में एक वर्ग छोड़कर तुरंत 3D घन के विपरीत फलकों की पहचान करें।",
          "gu": "સીધી લાઈનોમાં એક ખાનું છોડીને તરત ૩D સમઘનની સામસામેની બાજુઓ ઓળખો."
        },
        "tags": [
          {
            "en": "Skip-1 Rule",
            "hi": "1-छोड़ो नियम",
            "gu": "૧-છોડો નિયમ"
          },
          {
            "en": "Opposite Faces",
            "hi": "विपरीत फलक",
            "gu": "સામસામેની બાજુઓ"
          },
          {
            "en": "Sum to 7 (Dice)",
            "hi": "पासे का योग 7",
            "gu": "પાસાનો સરવાળો ૭"
          },
          {
            "en": "Never Touch",
            "hi": "कभी नहीं छूते",
            "gu": "ક્યારેય અડકે નહીં"
          },
          {
            "en": "Base Anchor",
            "hi": "आधार स्थिर करें",
            "gu": "પાયો સ્થિર કરો"
          },
          {
            "en": "3D Spatial View",
            "hi": "3D स्थानिक दृष्टि",
            "gu": "૩D અવકાશી દ્રષ્ટિ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "origami_fold",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Locate the longest straight continuous strip of squares in the 2D net (usually 3 or 4 squares).",
              "hi": "2D नेट में वर्गों की सबसे लंबी सीधी पट्टी खोजें (आमतौर पर 3 या 4 वर्ग)।",
              "gu": "૨D નેટમાં ચોરસની સૌથી લાંબી સીધી પટ્ટી શોધો (સામાન્ય રીતે ૩ કે ૪ ખાના)."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Pair up alternating squares by skipping exactly one square between them (Opposite Pair 1 and 2).",
              "hi": "बीच में ठीक 1 वर्ग छोड़कर एकांतर वर्गों के जोड़े बनाएं (विपरीत जोड़ा 1 और 2)।",
              "gu": "વચ્ચે બરાબર ૧ ખાનું છોડીને એકાંતરે આવતી બાજુઓની જોડી બનાવો (જોડી ૧ અને ૨)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Pair the remaining two side wing flaps together as the final opposite face pair (Opposite Pair 3).",
              "hi": "बचे हुए दोनों बाहरी पंखों को आपस में अंतिम विपरीत जोड़े के रूप में मिलाएँ (जोड़ा 3)।",
              "gu": "વધેલી બંને બહારની પાંખોને અંતિમ સામસામેની જોડી તરીકે જોડી દો (જોડી ૩)."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Verify that no two opposite faces in your pairs share an adjacent edge in the test answer options.",
              "hi": "जांचें कि आपके द्वारा निकाले गए विपरीत फलक विकल्पों में एक-दूसरे के बगल में न दिखाई दें।",
              "gu": "ચકાસો કે તમે શોધેલી સામસામેની બાજુઓ વિકલ્પોમાં ક્યાંય પાસપાસે દેખાતી ન હોય."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "origami_fold",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Draw a 6-square T-shaped net on paper, write letters A to F, predict all 3 opposite pairs using the skip-1 rule, then cut and fold it to verify 100% precision!",
          "hi": "कागज पर T-आकार का 6-वर्गों वाला नेट बनाएं, A से F लिखें, 1-छोड़ो नियम से विपरीत जोड़े बताएं, फिर काटकर जांचें!",
          "gu": "કાગળ પર T-આકારની ૬-ખાનાવાળી નેટ દોરો, A થી F લખો, ૧-છોડો નિયમથી જોડીઓ નક્કી કરો, પછી કાપીને વાળીને ખાતરી કરો!"
        },
        "commitment_button_text": {
          "en": "I will fold 3D nets with the skip-1 rule!",
          "hi": "मैं 1-छोड़ो नियम से 3D नेट मोड़ूँगा!",
          "gu": "હું ૧-છોડો નિયમથી ૩D નેટ વાળીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_150",
    "methodNumber": 150,
    "classLevel": 6,
    "category": {
      "en": "Spatial Intelligence Strategies",
      "hi": "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      "gu": "અવકાશી બુદ્ધિમત્તા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Object Decomposition (3D Composite Disassembler)",
      "hi": "वस्तु विघटन (3D मिश्रित आकृति विच्छेदक)",
      "gu": "પદાર્થ વિભાજન (૩D સંયુક્ત આકાર વિભાજક)"
    },
    "description": {
      "en": "Calculate the volume and surface area of complex composite 3D objects (L-shaped blocks, steps, castle towers) by slicing them into basic cuboids and cylinders.",
      "hi": "जटिल 3D आकृतियों (L-ब्लॉक, सीढ़ियाँ, किले के टॉवर) को सरल घनाभों और बेलनों में काटकर उनका आयतन और पृष्ठीય क्षेत्रफल आसानी से निकालें।",
      "gu": "અટપટા ૩D આકારો (L-બ્લોક, પગથિયાં, કિલ્લાના ટાવર) ને સરળ લંબઘન અને નળાકારમાં વિભાજિત કરીને તેમનું ઘનફળ અને પૃષ્ઠફળ સરળતાથી શોધો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "explode_cube",
        "title": {
          "en": "Panicking Over Irregular 3D Volume & Surface Problems?",
          "hi": "अजीबोगरीब 3D आकृतियों का आयतन देखकर घबरा जाते हैं?",
          "gu": "વિચિત્ર ૩D આકારોનું ઘનફળ શોધવાના દાખલા જોઈને ગભરાઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "When a question shows a 3-step staircase block and asks for total volume, I have no formula for a staircase shape!",
            "hi": "जब 3-सीढ़ियों वाले ब्लॉक का आयतन पूछा जाता है, तो मेरे पास सीढ़ी की आकृति का कोई सूत्र ही नहीं होता!",
            "gu": "જ્યારે ૩-પગથિયાંવાળા બ્લોકનું ઘનફળ પૂછાય, ત્યારે મારી પાસે પગથિયાંના આકારનું કોઈ સૂત્ર જ નથી હોતું!"
          },
          {
            "en": "I try multiplying random lengths and widths together on composite solids and get completely wrong answers!",
            "hi": "मिश्रित ठोस आकृतियों में मैं यादृच्छिक लंबाइयों और चौड़ाइयों को गुणा कर देता हूँ जिससे उत्तर गलत हो जाता है!",
            "gu": "સંયુક્ત ઘન આકારોમાં હું ગમે તે લંબાઈ અને પહોળાઈનો ગુણાકાર કરી દઉં છું જેથી જવાબ ખોટો આવે છે!"
          }
        ],
        "body": {
          "en": "There is no single formula for a monster 3D shape because monster shapes don't exist! Every complex solid is simply a cluster of friendly Lego bricks glued together. 'Object Decomposition' slices composite shapes with a mental laser into basic rectangular prisms and cylinders, calculating each simple volume and summing them up!",
          "hi": "किसी जटिल 3D आकृति का कोई अकेला सूत्र नहीं होता क्योंकि वे कई सरल आकृतियों से मिलकर बनी होती हैं। 'वस्तु विघटन' मानसिक लेजर से मिश्रित आकृति को सरल घनाभों (Cuboids) और बेलनों (Cylinders) में काटता है, हर छोटे हिस्से का आयतन निकालता है और जोड़ देता है!",
          "gu": "કોઈપણ અઘરા ૩D આકારનું કોઈ એક સૂત્ર હોતું નથી કારણ કે તે સરળ આકારો ભેગા મળીને બને છે. 'પદાર્થ વિભાજન' માનસિક લેઝર વડે અટપટા આકારને સરળ લંબઘન અને નળાકારમાં કાપી નાખે છે, દરેક ભાગનું ઘનફળ શોધે છે અને તેમનો સરવાળો કરે છે!"
        },
        "key_takeaway": {
          "en": "Disassemble Rule: Laser Cut into 2 Simple Cuboids $\\rightarrow$ Calculate $V_1 = l_1 w_1 h_1$ and $V_2 = l_2 w_2 h_2 \\rightarrow$ Total Volume = $V_1 + V_2$!",
          "hi": "विघटन नियम: 2 सरल घनाभों में काटें $\\rightarrow$ $V_1$ और $V_2$ निकालें $\\rightarrow$ कुल आयतन = $V_1 + V_2$ जोड़ें!",
          "gu": "વિભાજન નિયમ: ૨ સરળ લંબઘનમાં કાપો $\\rightarrow$ $V_1$ અને $V_2$ શોધો $\\rightarrow$ કુલ ઘનફળ = $V_1 + V_2$ સરવાળો કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "explode_cube",
        "title": {
          "en": "Meet Kunal",
          "hi": "कुणाल से मिलें",
          "gu": "મળો કુણાલને"
        },
        "story": {
          "en": "Kunal had to calculate the volume of an L-shaped wooden concrete block. He stared blankly until he drew a mental horizontal slice line: Top Block (Length 4, Width 3, Height 2 $\\rightarrow 4 \\times 3 \\times 2 = 24$) and Bottom Base (Length 8, Width 3, Height 2 $\\rightarrow 8 \\times 3 \\times 2 = 48$). Total Volume = $24 + 48 = 72\\text{ cm}^3$! He solved it in 10 seconds flat.",
          "hi": "कुणाल को L-आकार के लकड़ी के ब्लॉक का आयतन निकालना था। उसने एक मानसिक क्षैतिज रेखा खींचकर उसे दो हिस्सों में काटा: ऊपर का ब्लॉक ($4 \\times 3 \\times 2 = 24$) और नीचे का आधार ($8 \\times 3 \\times 2 = 48$)। कुल आयतन = $24 + 48 = 72\\text{ cm}^3$! सिर्फ 10 सेकंड में हल!",
          "gu": "કુણાલને L-આકારના લાકડાના બ્લોકનું ઘનફળ શોધવાનું હતું. તેણે માનસિક રીતે એક આડી લીટી દોરીને તેને બે ભાગમાં વહેંચ્યો: ઉપરનો બ્લોક ($૪ \\times ૩ \\times ૨ = ૨૪$) અને નીચેનો પાયો ($૮ \\times ૩ \\times ૨ = ૪૮$). કુલ ઘનફળ = ૨૪ + ૪૮ = ૭૨ $\\text{cm}^3$! માત્ર ૧૦ સેકન્ડમાં દાખલો પૂરો!"
        },
        "insight_box": {
          "en": "Additive Volume Property: Total Volume is ALWAYS the sum of the non-overlapping component parts ($V_{\\text{total}} = V_1 + V_2 + V_3$).",
          "hi": "योगात्मक आयतन नियम: कुल आयतन हमेशा बिना ओवरलैप वाले सभी टुकड़ों के आयतन का साधारण योग होता है।",
          "gu": "સરવાળાનો ઘનફળ નિયમ: કુલ ઘનફળ હંમેશાં બધા અલગ-અલગ ટુકડાઓના ઘનફળનો સાદો સરવાળો જ હોય છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "explode_cube",
        "question": {
          "en": "How do you find the total volume of a silo made of a cylinder with a cone sitting on top?",
          "hi": "एक बेलन (Cylinder) के ऊपर शंकु (Cone) रखकर बनी टंकी का कुल आयतन कैसे निकाला जाता है?",
          "gu": "એક નળાકાર (Cylinder) પર શંકુ (Cone) મૂકીને બનેલી ટાંકીનું કુલ ઘનફળ કેવી રીતે શોધશો?"
        },
        "option_a": {
          "en": "Decompose into two shapes: calculate Volume of Cylinder ($V_1$) and Volume of Cone ($V_2$), then add them together ($V_1 + V_2$).",
          "hi": "दो आकृतियों में तोड़ें: बेलन का आयतन ($V_1$) और शंकु का आयतन ($V_2$) अलग निकालें, फिर दोनों को जोड़ दें ($V_1 + V_2$)।",
          "gu": "બે આકારમાં વિભાજિત કરો: નળાકારનું ઘનફળ ($V_1$) અને શંકુનું ઘનફળ ($V_2$) અલગ શોધો, પછી બંનેનો સરવાળો કરો ($V_1 + V_2$)."
        },
        "option_b": {
          "en": "Multiply the height of the cone by the radius of the cylinder only.",
          "hi": "केवल शंकु की ऊंचाई को बेलन की त्रिज्या से गुणा करें।",
          "gu": "માત્ર શંકુની ઊંચાઈનો નળાકારની ત્રિજ્યા સાથે ગુણાકાર કરો."
        },
        "feedback": {
          "en": "Correct! Decomposing into standard geometric building blocks is the universal method for all composite 3D shapes.",
          "hi": "सही! मानक ज्यामितीय बिल्डिंग ब्लॉक्स में तोड़ना सभी मिश्रित 3D आकृतियों को हल करने का सार्वभौमिक तरीका है।",
          "gu": "સાચું! પ્રમાણભૂત ભૂમિતિક આકારોમાં વિભાજન કરવું એ બધા સંયુક્ત ૩D આકારો ઉકેલવાની સાર્વત્રિક પદ્ધતિ છે."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "explode_cube",
        "question": {
          "en": "A 3D metal step consists of two stacked rectangular cuboids:\nCuboid A (Top step): $5\\text{ cm} \\times 4\\text{ cm} \\times 3\\text{ cm}$\nCuboid B (Bottom base): $10\\text{ cm} \\times 4\\text{ cm} \\times 3\\text{ cm}$\nWhat is the total combined volume of the metal step?",
          "hi": "धातु की सीढ़ी दो आयताकार घनाभों से बनी है:\nघनाभ A (ऊपरी सीढ़ी): $5\\text{ cm} \\times 4\\text{ cm} \\times 3\\text{ cm}$\nघनाभ B (निचला आधार): $10\\text{ cm} \\times 4\\text{ cm} \\times 3\\text{ cm}$\nधातु की सीढ़ी का कुल संयुक्त आयतन क्या है?",
          "gu": "ધાતુનું પગથિયું બે લંબઘન જોડીને બનેલું છે:\nલંબઘન A (ઉપરનું પગથિયું): $૫\\text{ cm} \\times ૪\\text{ cm} \\times ૩\\text{ cm}$\nલંબઘન B (નીચેનો પાયો): $૧૦\\text{ cm} \\times ૪\\text{ cm} \\times ૩\\text{ cm}$\nપગથિયાનું કુલ સંયુક્ત ઘનફળ કેટલું થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "180 cm³ (V_A = 60 cm³, V_B = 120 cm³ → 60 + 120 = 180 cm³)",
              "hi": "180 cm³ (V_A = 60 cm³, V_B = 120 cm³ → 60 + 120 = 180 cm³)",
              "gu": "૧૮૦ cm³ (V_A = ૬૦ cm³, V_B = ૧૨૦ cm³ → ૬૦ + ૧૨૦ = ૧૮૦ cm³)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "240 cm³",
              "hi": "240 cm³",
              "gu": "૨૪૦ cm³"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "120 cm³",
              "hi": "120 cm³",
              "gu": "૧૨૦ cm³"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "60 cm³",
              "hi": "60 cm³",
              "gu": "૬૦ cm³"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! $V_A = 5 \\times 4 \\times 3 = 60\\text{ cm}^3$. $V_B = 10 \\times 4 \\times 3 = 120\\text{ cm}^3$. Total Volume = $60 + 120 = 180\\text{ cm}^3$!",
          "hi": "शानदार! $V_A = 5 \\times 4 \\times 3 = 60\\text{ cm}^3$। $V_B = 10 \\times 4 \\times 3 = 120\\text{ cm}^3$। कुल आयतन = $60 + 120 = 180\\text{ cm}^3$!",
          "gu": "એકદમ સાચું! $V_A = ૫ \\times ૪ \\times ૩ = ૬૦\\text{ cm}^3$. $V_B = ૧૦ \\times ૪ \\times ૩ = ૧૨૦\\text{ cm}^3$. કુલ ઘનફળ = ૬૦ + ૧૨૦ = ૧૮૦ $\\text{cm}^3$!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "explode_cube",
        "title": {
          "en": "3D Disassembler Superpower",
          "hi": "3D विच्छेदक सुपरपावर",
          "gu": "૩D વિભાજક સુપરપાવર"
        },
        "body": {
          "en": "Slice complex composite 3D solids into standard elementary cuboids to calculate total volume effortlessly.",
          "hi": "आसानी से कुल आयतन निकालने के लिए जटिल 3D ठोस आकृतियों को मानक सरल घनाभों में काटें।",
          "gu": "સરળતાથી કુલ ઘનફળ શોધવા માટે જટિલ ૩D ઘન આકારોને પાયાના સરળ લંબઘનમાં વિભાજિત કરો."
        },
        "tags": [
          {
            "en": "3D Laser Slice",
            "hi": "3D लेजर कट",
            "gu": "૩D લેઝર કટ"
          },
          {
            "en": "V = l × w × h",
            "hi": "V = l × w × h",
            "gu": "V = l × w × h"
          },
          {
            "en": "Additive Volume",
            "hi": "योगात्मक आयतन",
            "gu": "સરવાળાનું ઘનફળ"
          },
          {
            "en": "Composite Solids",
            "hi": "मिश्रित ठोस",
            "gu": "સંયુક્ત ઘન આકારો"
          },
          {
            "en": "Elementary Blocks",
            "hi": "बुनियादी ब्लॉक",
            "gu": "પાયાના બ્લોક્સ"
          },
          {
            "en": "Zero Formula Panic",
            "hi": "तनावमुक्त ज्यामिति",
            "gu": "ભારમુક્ત ભૂમિતિ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "explode_cube",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Look at the composite 3D solid and draw a dotted slice line to divide it into standard cuboids.",
              "hi": "मिश्रित 3D आकृति को देखें और मानक घनाभों में बाँटने के लिए एक बिंदूदार विभाजन रेखा खींचें।",
              "gu": "સંયુક્ત ૩D આકારને જુઓ અને સરળ લંબઘનમાં વહેંચવા માટે એક તૂટક વિભાજન રેખા દોરો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Determine the exact Length, Width, and Height for Piece 1 ($l_1, w_1, h_1$).",
              "hi": "टुकड़े 1 की सटीक लंबाई, चौड़ाई और ऊंचाई ($l_1, w_1, h_1$) ज्ञात करें।",
              "gu": "ટુકડા ૧ ની સાચી લંબાઈ, પહોળાઈ અને ઊંચાઈ ($l_1, w_1, h_1$) નક્કી કરો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Determine the exact dimensions for Piece 2 ($l_2, w_2, h_2$) by subtracting shared edges.",
              "hi": "साझा किनारों को घटाकर टुकड़े 2 के सटीक माप ($l_2, w_2, h_2$) निकालें।",
              "gu": "સહિયારી બાજુઓ બાદ કરીને ટુકડા ૨ ના સાચા માપ ($l_2, w_2, h_2$) મેળવો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Calculate $V_1 = l_1 w_1 h_1$ and $V_2 = l_2 w_2 h_2$, then add them together for the total volume.",
              "hi": "$V_1$ और $V_2$ की गणना करें, फिर कुल आयतन के लिए दोनों को जोड़ दें।",
              "gu": "$V_1$ અને $V_2$ ની ગણતરી કરો, પછી કુલ ઘનફળ માટે બંનેનો સરવાળો કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "explode_cube",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Build an L-shaped structure with Lego or building blocks today, measure the 2 separate rectangular sections, and calculate the combined total volume!",
          "hi": "आज लेगो या खिलौना ब्लॉक से L-आकार की इमारत बनाएं, दोनों हिस्सों को अलग नापें और कुल आयतन निकालें!",
          "gu": "આજે રમકડાંના બ્લોક્સથી L-આકારનું મકાન બનાવો, બંને ભાગોને અલગ માપીને કુલ ઘનફળ શોધી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will decompose 3D shapes into simple blocks!",
          "hi": "मैं 3D आकृतियों को सरल टुकड़ों में बाँटकर हल करूँगा!",
          "gu": "હું ૩D આકારોને સરળ બ્લોક્સમાં વહેંચીને ગણીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_153",
    "methodNumber": 153,
    "classLevel": 6,
    "category": {
      "en": "Spatial Intelligence Strategies",
      "hi": "स्थानिक बुद्धिमत्ता रणनीतियाँ",
      "gu": "અવકાશી બુદ્ધિમત્તા વ્યૂહરચનાઓ"
    },
    "title": {
      "en": "Mental Scaling (The Zoom Lens & Scale Dimension Powers)",
      "hi": "मानसिक स्केलिंग (ज़ूम लेंस और आयाम विस्तार)",
      "gu": "માનસિક સ્કેલિંગ (ઝૂમ લેન્સ અને પરિમાણ વિસ્તરણ)"
    },
    "description": {
      "en": "Master geometric scaling rules: when a 2D shape's sides double ($k = 2$), its Area grows by $k^2 = 4\\times$; when a 3D solid's sides double, its Volume grows by $k^3 = 8\\times$.",
      "hi": "ज्यामितीय स्केलिंग नियम सीखें: जब 2D भुजाएं दोगुनी ($k = 2$) होती हैं, तो क्षेत्रफल $k^2 = 4$ गुना बढ़ता है; जब 3D भुजाएं दोगुनी होती हैं, तो आयतन $k^3 = 8$ गुना बढ़ता है।",
      "gu": "ભૂમિતિનો સ્કેલિંગ નિયમ શીખો: જ્યારે ૨D બાજુઓ બમણી ($k = ૨$) થાય, ત્યારે ક્ષેત્રફળ $k^2 = ૪$ ગણું વધે; જ્યારે ૩D બાજુઓ બમણી થાય, ત્યારે ઘનફળ $k^3 = ૮$ ગણું વધે."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "zoom_scale",
        "title": {
          "en": "Assuming Doubling a Cube's Sides Just Doubles Its Volume?",
          "hi": "लगता है कि घन की भुजा दोगुनी करने से आयतन भी केवल दोगुना ही होगा?",
          "gu": "લાગે છે કે સમઘનની બાજુ બમણી કરવાથી ઘનફળ પણ માત્ર બમણું જ થશે?"
        },
        "pain_quotes": [
          {
            "en": "A test asks: 'If a square's sides are tripled (×3), by how much does its area increase?' and I answered 3 times instead of 9 times!",
            "hi": "सवाल था: 'यदि वर्ग की भुजाएं 3 गुना कर दी जाएं, तो क्षेत्रफल कितना बढ़ेगा?' और मैंने 9 के बजाय 3 गुना लिख दिया!",
            "gu": "દાખલો પૂછાયો: 'જો ચોરસની બાજુઓ ૩ ગણી કરવામાં આવે, તો ક્ષેત્રફળ કેટલું વધશે?' અને મેં ૯ ગણાને બદલે ૩ ગણું લખી નાખ્યું!"
          },
          {
            "en": "I don't understand why a pizza that is twice as wide ($2\\times$ diameter) costs 4 times more to make!",
            "hi": "मुझे समझ नहीं आता कि दोगुनी चौड़ाई वाले पिज्जा का क्षेत्रफल 4 गुना बड़ा क्यों हो जाता है!",
            "gu": "મને સમજાતું નથી કે બમણા મોટા પીઝાનું ક્ષેત્રફળ ૪ ગણું મોટું કેમ થઈ જાય છે!"
          }
        ],
        "body": {
          "en": "Human intuition fools us into thinking scaling is 1-dimensional. But scaling expands in all dimensions simultaneously! In 1D (Length), scale is $k$. In 2D (Area), scale is $k^2$ ($2^2 = 4\\times$). In 3D (Volume), scale is $k^3$ ($2^3 = 8\\times$). Master the Dimension Exponent to never get tricked!",
          "hi": "हमारा सहज ज्ञान हमें धोखा देता है कि आकार केवल 1 दिशा में बढ़ता है। लेकिन स्केलिंग सभी दिशाओं में एक साथ फैलती है! 1D (लंबाई) में पैमाना $k$ है। 2D (क्षेत्रफल) में पैमाना $k^2$ ($2^2 = 4$ गुना) है। 3D (आयतन) में पैमाना $k^3$ ($2^3 = 8$ गुना) है!",
          "gu": "આપણું મગજ ભૂલથી માને છે કે માપ માત્ર ૧ દિશામાં વધે છે. પણ સ્કેલિંગ બધી દિશાઓમાં સાથે વધે છે! ૧D (લંબાઈ) માં માપ $k$ છે. ૨D (ક્ષેત્રફળ) માં માપ $k^2$ ($૨^૨ = ૪$ ગણું) છે. ૩D (ઘનફળ) માં માપ $k^3$ ($૨^૩ = ૮$ ગણું) છે!"
        },
        "key_takeaway": {
          "en": "Dimension Scaling Rule: Length scales by $k$ $\\rightarrow$ Area scales by $k^2$ $\\rightarrow$ Volume scales by $k^3$!",
          "hi": "आयाम स्केलिंग नियम: लंबाई $k$ से बढ़ती है $\\rightarrow$ क्षेत्रफल $k^2$ से बढ़ता है $\\rightarrow$ आयतन $k^3$ से बढ़ता है!",
          "gu": "પરિમાણ સ્કેલિંગ નિયમ: લંબાઈ $k$ ગણી વધે $\\rightarrow$ ક્ષેત્રફળ $k^2$ ગણું વધે $\\rightarrow$ ઘનફળ $k^3$ ગણું વધે!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "zoom_scale",
        "title": {
          "en": "Meet Tanvi",
          "hi": "तन्वी से मिलें",
          "gu": "મળો તન્વીને"
        },
        "story": {
          "en": "Tanvi was making a miniature clay cube of side 2 cm (Volume = $2^3 = 8\\text{ cm}^3$). Her art teacher asked: 'If you make a new giant cube by multiplying all sides by 3 ($k = 3$, side = 6 cm), how much more clay will you need?' Tanvi used mental scaling: $k^3 = 3^3 = 27\\times$ more clay ($8 \\times 27 = 216\\text{ cm}^3$)! Her class was stunned.",
          "hi": "तन्वी 2 सेमी भुजा वाला मिट्टी का छोटा घन बना रही थी (आयतन = $8\\text{ cm}^3$)। शिक्षक ने पूछा: 'यदि भुजाएं 3 गुना कर दी जाएं ($k = 3$), तो कितनी अधिक मिट्टी लगेगी?' तन्वी ने मानसिक स्केलिंग लगाई: $k^3 = 3^3 = 27$ गुना मिट्टी ($8 \\times 27 = 216\\text{ cm}^3$)! सब हैरान रह गए।",
          "gu": "તન્વી ૨ સેમી બાજુવાળો માટીનો નાનો સમઘન બનાવતી હતી (ઘનફળ = ૮ $\\text{cm}^3$). શિક્ષકે પૂછ્યું: 'જો બાજુઓ ૩ ગણી કરવામાં આવે ($k = ૩$), તો કેટલી વધુ માટી જોઈશે?' તન્વીએ માનસિક સ્કેલિંગ વાપર્યું: $k^3 = ૩^૩ = ૨૭$ ગણી વધુ માટી (૮ $\\times ૨૭ = ૨૧૬$ $\\text{cm}^3$)! આખો વર્ગ દંગ રહી ગયો."
        },
        "insight_box": {
          "en": "Square-Cube Law: Area explodes by the square ($k^2$) and volume explodes by the cube ($k^3$) of the length multiplier.",
          "hi": "वर्ग-घन नियम: क्षेत्रफल लंबाई गुणक के वर्ग ($k^2$) से और आयतन उसके घन ($k^3$) से तेजी से बढ़ता है।",
          "gu": "વર્ગ-ઘન નિયમ: ક્ષેત્રફળ લંબાઈના ગુણકના વર્ગ ($k^2$) થી અને ઘનફળ તેના ઘન ($k^3$) થી ઝડપથી વધે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "zoom_scale",
        "question": {
          "en": "If you double the radius and height of a cylindrical water tank ($k = 2$), by how many times does its water storage capacity (volume) increase?",
          "hi": "यदि आप एक बेलनाकार पानी की टंकी की त्रिज्या और ऊंचाई दोनों को दोगुना ($k = 2$) कर दें, तो उसकी पानी जमा करने की क्षमता (आयतन) कितने गुना बढ़ जाएगी?",
          "gu": "જો તમે નળાકાર પાણીની ટાંકીની ત્રિજ્યા અને ઊંચાઈ બંને બમણી ($k = ૨$) કરી દો, તો તેની પાણી સંગ્રહવાની ક્ષમતા (ઘનફળ) કેટલા ગણી વધી જશે?"
        },
        "option_a": {
          "en": "8 times ($k^3 = 2^3 = 8\\times$).",
          "hi": "8 गुना ($k^3 = 2^3 = 8$ गुना)।",
          "gu": "૮ ગણી ($k^3 = ૨^૩ = ૮$ ગણી)."
        },
        "option_b": {
          "en": "2 times.",
          "hi": "2 गुना।",
          "gu": "૨ ગણી."
        },
        "feedback": {
          "en": "Correct! Volume is a 3-dimensional measurement, so doubling all linear dimensions scales capacity by $2^3 = 8\\times$!",
          "hi": "सही! आयतन एक 3-आयामी माप है, इसलिए सभी लंबाइयों को दोगुना करने से क्षमता $2^3 = 8$ गुना बढ़ जाती है!",
          "gu": "સાચું! ઘનફળ એ ૩-પરિમાણીય માપ છે, તેથી લંબાઈ બમણી કરતાં ક્ષમતા ૨^૩ = ૮ ગણી વધી જાય છે!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "zoom_scale",
        "question": {
          "en": "A photo frame has Area = 50 cm². You enlarge the photo so that both its Length and Width are multiplied by 4 ($k = 4$). What is the new Area of the enlarged photo?",
          "hi": "एक फोटो का क्षेत्रफल = 50 cm² है। आप फोटो को बड़ा करते हैं ताकि लंबाई और चौड़ाई दोनों 4 गुना ($k = 4$) हो जाएं। बड़ी फोटो का नया क्षेत्रफल क्या होगा?",
          "gu": "એક ફોટાનું ક્ષેત્રફળ = ૫૦ cm² છે. તમે ફોટાને મોટો કરો છો જેથી તેની લંબાઈ અને પહોળાઈ બંને ૪ ગણી ($k = ૪$) થઈ જાય. મોટા ફોટાનું નવું ક્ષેત્રફળ કેટલું થશે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "800 cm² (New Area = 50 × k² = 50 × 16 = 800 cm²)",
              "hi": "800 cm² (नया क्षेत्रफल = 50 × k² = 50 × 16 = 800 cm²)",
              "gu": "૮૦૦ cm² (નવું ક્ષેત્રફળ = ૫૦ × k² = ૫૦ × ૧૬ = ૮૦૦ cm²)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "200 cm² (50 × 4)",
              "hi": "200 cm² (50 × 4)",
              "gu": "૨૦૦ cm² (૫૦ × ૪)"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "100 cm²",
              "hi": "100 cm²",
              "gu": "૧૦૦ cm²"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "400 cm²",
              "hi": "400 cm²",
              "gu": "૪૦૦ cm²"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! In 2D Area scaling, scale factor is $k^2 = 4^2 = 16$. New Area = $50 \\times 16 = 800\\text{ cm}^2$!",
          "hi": "शानदार! 2D क्षेत्रफल में पैमाना $k^2 = 4^2 = 16$ है। नया क्षेत्रफल = $50 \\times 16 = 800\\text{ cm}^2$!",
          "gu": "એકદમ સાચું! ૨D ક્ષેત્રફળમાં સ્કેલિંગ $k^2 = ૪^૨ = ૧૬$ છે. નવું ક્ષેત્રફળ = ૫૦ $\\times ૧૬ = ૮૦૦$ $\\text{cm}^2$!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "zoom_scale",
        "title": {
          "en": "Dimensional Scaling Superpower",
          "hi": "आयाम स्केलिंग सुपरपावर",
          "gu": "પરિમાણ સ્કેલિંગ સુપરપાવર"
        },
        "body": {
          "en": "Scale lengths by $k$, 2D areas by $k^2$, and 3D volumes by $k^3$ for instant spatial accuracy.",
          "hi": "सटीक गणना के लिए लंबाई को $k$, क्षेत्रफल को $k^2$ और आयतन को $k^3$ से गुणा करें।",
          "gu": "સચોટ ગણતરી માટે લંબાઈને $k$, ક્ષેત્રફળને $k^2$ અને ઘનફળને $k^3$ વડે ગુણો."
        },
        "tags": [
          {
            "en": "1D Length = k",
            "hi": "1D लंबाई = k",
            "gu": "૧D લંબાઈ = k"
          },
          {
            "en": "2D Area = k²",
            "hi": "2D क्षेत्रफल = k²",
            "gu": "૨D ક્ષેત્રફળ = k²"
          },
          {
            "en": "3D Volume = k³",
            "hi": "3D आयतन = k³",
            "gu": "૩D ઘનફળ = k³"
          },
          {
            "en": "Square-Cube Law",
            "hi": "वर्ग-घन नियम",
            "gu": "વર્ગ-ઘન નિયમ"
          },
          {
            "en": "Zoom Scaling",
            "hi": "ज़ूम स्केलिंग",
            "gu": "ઝૂમ સ્કેલિંગ"
          },
          {
            "en": "Instant Mental Math",
            "hi": "त्वरित मानसिक गणित",
            "gu": "ઝડપી માનસિક ગણતરી"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "zoom_scale",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Identify the linear length multiplier ($k$) from the problem (e.g. 'sides are tripled $\\rightarrow k = 3$').",
              "hi": "सवाल से लंबाई का गुणक ($k$) पहचानें (जैसे 'भुजाएं 3 गुना $\\rightarrow k = 3$')।",
              "gu": "દાખલામાંથી લંબાઈનો ગુણક ($k$) ઓળખો (જેમ કે 'બાજુઓ ૩ ગણી $\\rightarrow k = ૩$')."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Check the dimension of the target question: Length (1D), Area (2D), or Volume (3D).",
              "hi": "लक्ष्य का आयाम जांचें: लंबाई (1D), क्षेत्रफल (2D), या आयतन (3D)।",
              "gu": "પ્રશ્નનું પરિમાણ તપાસો: લંબાઈ (૧D), ક્ષેત્રફળ (૨D), કે ઘનફળ (૩D)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Compute the dimension scale factor: $k^1$ for length, $k^2$ for area, or $k^3$ for volume.",
              "hi": "सही पैमाना निकालें: लंबाई के लिए $k^1$, क्षेत्रफल के लिए $k^2$, या आयतन के लिए $k^3$।",
              "gu": "સાચો સ્કેલિંગ દર શોધો: લંબાઈ માટે $k^1$, ક્ષેત્રફળ માટે $k^2$, કે ઘનફળ માટે $k^3$."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Multiply the original base value by that exponent scale factor for the final answer.",
              "hi": "अंतिम उत्तर पाने के लिए मूल मान को उस घातांक पैमाने से गुणा करें।",
              "gu": "અંતિમ જવાબ મેળવવા માટે મૂળ કિંમતને તે સ્કેલિંગ દર વડે ગુણી દો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "zoom_scale",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Explain to a friend or parent why an 8-inch pizza has 4 times less food than a 16-inch pizza using $k^2 = 2^2 = 4$!",
          "hi": "किसी दोस्त या माता-पिता को समझाएं कि 16-इंच का पिज्जा 8-इंच के पिज्जा से 4 गुना ($k^2 = 4$) बड़ा क्यों होता है!",
          "gu": "કોઈ મિત્ર કે વાલીને સમજાવો કે ૧૬-ઇંચનો પીઝા ૮-ઇંચના પીઝા કરતાં ૪ ગણો ($k^2 = ૪$) મોટો કેમ હોય છે!"
        },
        "commitment_button_text": {
          "en": "I will scale dimensions with k, k², and k³!",
          "hi": "मैं k, k² और k³ से आयाम स्केल करूँगा!",
          "gu": "હું k, k² અને k³ થી પરિમાણ સ્કેલ કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_171",
    "methodNumber": 171,
    "classLevel": 6,
    "category": {
      "en": "Critical Thinking Strategies",
      "hi": "तार्किक व आलोचनात्मक सोच",
      "gu": "જટિલ અને તાર્કિક વિચારસરણી"
    },
    "title": {
      "en": "Red Flag Detection (Critical Bias & Scam Radar)",
      "hi": "रेड फ्लैग पहचान (पूर्वाग्रह और भ्रामक दावों का रडार)",
      "gu": "રેડ ફ્લેગ ઓળખ (પૂર્વગ્રહ અને ભ્રામક દાવાઓનું રડાર)"
    },
    "description": {
      "en": "Protect your mind from online misinformation, biased advertisements, and misleading claims by spotting 5 classic cognitive red flags (absolute words, emotional traps, missing sources).",
      "hi": "5 प्रमुख लाल झंडों (अतिशयोक्ति शब्द, भावनात्मक जाल, गायब स्रोत) को पहचानकर इंटरनेट की गलत सूचनाओं और भ्रामक विज्ञापनों से बचें।",
      "gu": "૫ મુખ્ય ચેતવણી સંકેતો (અતિશયોક્તિવાળા શબ્દો, લાગણીની જાળ, પુરાવા વગરના દાવા) ઓળખીને ઇન્ટરનેટની ખોટી માહિતી અને ભ્રામક જાહેરાતોથી બચો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "red_flag_alert",
        "title": {
          "en": "Believing Clickbait Claims and Exaggerated Ads?",
          "hi": "चमक-दमक वाले विज्ञापनों और इंटरनेट के दावों पर आँख मूँदकर विश्वास कर लेते हैं?",
          "gu": "ચમકતી જાહેરાતો અને ઇન્ટરનેટના ખોટા દાવાઓ પર આંધળો વિશ્વાસ કરી બેસો છો?"
        },
        "pain_quotes": [
          {
            "en": "An online ad claimed 'Drink this tea to gain 50 IQ points in 24 hours 100% guaranteed!' and I thought it was real science!",
            "hi": "इंटरनेट पर विज्ञापन था 'यह चाय पीने से 24 घंटे में IQ 50 अंक बढ़ेगा 100% गारंटी' और मैंने इसे सच मान लिया!",
            "gu": "ઇન્ટરનેટ પર જાહેરાત હતી 'આ ચા પીવાથી ૨૪ કલાકમાં IQ ૫૦ પોઇન્ટ વધશે ૧૦૦% ગેરંટી' અને મેં તેને સાચું વિજ્ઞાન માની લીધું!"
          },
          {
            "en": "In reading comprehension, I fail questions when an author uses emotional words to hide the fact that there is zero real evidence!",
            "hi": "रीडिंग टेस्ट में जब लेखक बिना सबूत के सिर्फ भावनात्मक शब्दों का इस्तेमाल करता है, तो मैं गलत उत्तर चुन लेता हूँ!",
            "gu": "વાંચન કસોટીમાં જ્યારે લેખક પુરાવા વગર માત્ર લાગણીશીલ શબ્દો વાપરે છે, ત્યારે હું ખોટો જવાબ પસંદ કરી લઉં છું!"
          }
        ],
        "body": {
          "en": "Misinformation is engineered to bypass your logic and trigger quick emotions (fear, greed, excitement). 'Red Flag Detection' acts as a cognitive antivirus scanner: whenever a claim uses words like '100% miracle', 'Secret they don't want you to know', or cites zero scientific sources, your internal siren blares RED FLAG!",
          "hi": "गलत सूचनाएं आपके तर्क को दरकिनार कर भावनाओं (डर, लालच, उत्साह) को भड़काने के लिए बनाई जाती हैं। 'रेड फ्लैग पहचान' दिमाग के एंटीवायरस की तरह काम करती है: जब भी कोई '100% चमत्कार' या बिना स्रोत के दावे करे, तो तुरंत समझ जाएं कि यहाँ दाल में कुछ काला है!",
          "gu": "ખોટી માહિતી તમારા તર્કને બાયપાસ કરીને લાગણીઓ (ડર, લાલચ, ઉત્તેજના) ભડકાવવા બનાવવામાં આવે છે. 'રેડ ફ્લેગ ઓળખ' મગજના એન્ટીવાયરસ જેવું કામ કરે છે: જ્યારે પણ કોઈ '૧૦૦% ચમત્કાર' કે પુરાવા વગરના દાવા કરે, ત્યારે તરત સમજી જાઓ કે અહીં સાવચેત રહેવાની જરૂર છે!"
        },
        "key_takeaway": {
          "en": "Radar Rule: Absolute Words ('Always', 'Never', 'Miracle') + Emotional Pressure + Zero Sources = RED FLAG SCAM!",
          "hi": "रडार नियम: अतिशयोक्ति शब्द ('हमेशा', 'कभी नहीं', 'चमत्कार') + भावनात्मक दबाव + शून्य स्रोत = रेड फ्लैग!",
          "gu": "રડાર નિયમ: અતિશયોક્તિવાળા શબ્દો ('હંમેશાં', 'ક્યારેય નહીં', 'ચમત્કાર') + લાગણીનું દબાણ + શૂન્ય પુરાવા = રેડ ફ્લેગ!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "red_flag_alert",
        "title": {
          "en": "Meet Ishan",
          "hi": "ईशान से मिलें",
          "gu": "મળો ઈશાનને"
        },
        "story": {
          "en": "Ishan saw a viral social media post: 'Scientists prove that eating chocolate for breakfast makes you score 100% on every test! Share before it gets deleted!' Ishan ran his Red Flag Scan: 1) Which scientists? (No source named). 2) Absolute word ('every test' = exaggeration). 3) Panic urgency ('Share before deleted'). Ishan debunked the fake post in 10 seconds flat!",
          "hi": "ईशान ने वायरल पोस्ट देखी: 'वैज्ञानिकों ने साबित किया कि नाश्ते में चॉकलेट खाने से हर टेस्ट में 100% अंक आते हैं! डिलीट होने से पहले शेयर करें!' ईशान ने रेड फ्लैग स्कैन किया: 1) कौन से वैज्ञानिक? (कोई स्रोत नहीं)। 2) अतिशयोक्ति ('हर टेस्ट')। 3) घबराहट ('शेयर करें')। ईशान ने 10 सेकंड में फर्जी पोस्ट पकड़ ली!",
          "gu": "ઈશાને વાયરલ પોસ્ટ જોઈ: 'વૈજ્ઞાનિકોએ સાબિત કર્યું કે સવારે ચોકલેટ ખાવાથી દરેક ટેસ્ટમાં ૧૦૦% માર્ક્સ આવે છે! ડિલીટ થાય તે પહેલાં શેર કરો!' ઈશાને રેડ ફ્લેગ સ્કેન કર્યું: ૧) કયા વૈજ્ઞાનિકો? (કોઈ પુરાવો નથી). ૨) અતિશયોક્તિ ('દરેક ટેસ્ટ') ૩) ગભરાટ ('શેર કરો'). ઈશાને ૧૦ સેકન્ડમાં ખોટી પોસ્ટ પકડી પાડી!"
        },
        "insight_box": {
          "en": "Extraordinary Claims Require Extraordinary Evidence: If a claim sounds too magical to be true, demand rigorous peer-reviewed proof.",
          "hi": "असाधारण दावों के लिए असाधारण सबूत: यदि कोई दावा जादुई लगता है, तो उसके लिए ठोस और प्रमाणित वैज्ञानिक सबूत की मांग करें।",
          "gu": "અસાધારણ દાવા માટે અસાધારણ પુરાવા: જો કોઈ દાવો જાદુઈ લાગે, તો તેના માટે પાકા અને વૈજ્ઞાનિક પુરાવાની માંગ કરો."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "red_flag_alert",
        "question": {
          "en": "Which of the following headlines contains a major critical thinking RED FLAG?",
          "hi": "निम्नलिखित में से किस शीर्षक में एक बड़ा तार्किक 'रेड फ्लैग' छिपा है?",
          "gu": "નીચેનામાંથી કયા મથાળામાં મોટો તાર્કિક 'રેડ ફ્લેગ' છુપાયેલો છે?"
        },
        "option_a": {
          "en": "'Secret miracle berry 100% GUARANTEED to cure all homework fatigue instantly—Doctors are terrified!'",
          "hi": "'गुप्त जादुई फल 100% गारंटी के साथ पढ़ाई की सारी थकान मिटाएगा—डॉक्टर हैरान!'",
          "gu": "'ગુપ્ત જાદુઈ ફળ ૧૦૦% ગેરંટી સાથે ભણવાનો બધો થાક મટાડશે—ડોક્ટરો પણ દંગ!'"
        },
        "option_b": {
          "en": "'A 2024 study of 500 students found that 8 hours of sleep improved math test scores by an average of 12%.'",
          "hi": "'500 छात्रों पर 2024 के अध्ययन में पाया गया कि 8 घंटे की नींद से गणित के अंकों में औसतन 12% सुधार हुआ।'",
          "gu": "'૫૦૦ વિદ્યાર્થીઓ પર ૨૦૨૪ ના અભ્યાસમાં જાણવા મળ્યું કે ૮ કલાકની ઊંઘથી ગણિતના ગુણમાં સરેરાશ ૧૨% સુધારો થયો.'"
        },
        "feedback": {
          "en": "Correct! Option A uses classic clickbait red flags: 'Secret', 'miracle', '100% guaranteed', and emotional conspiracy phrasing.",
          "hi": "सही! विकल्प A में सभी भ्रामक रेड फ्लैग मौजूद हैं: 'गुप्त', 'चमत्कार', '100% गारंटी' और सनसनीखेज भाषा।",
          "gu": "સાચું! વિકલ્પ A માં બધા ભ્રામક રેડ ફ્લેગ છે: 'ગુપ્ત', 'ચમત્કાર', '૧૦૦% ગેરંટી' અને સનસનાટીભરી ભાષા."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "red_flag_alert",
        "question": {
          "en": "You are researching for a history essay. Website A has an anonymous author, uses ALL CAPS, and says 'Everyone knows Leader X was pure evil!'. Website B is an official National Museum archive with footnotes. Which source should you trust?",
          "hi": "आप इतिहास निबंध के लिए शोध कर रहे हैं। वेबसाइट A पर लेखक का नाम नहीं है, बड़े अक्षर हैं और लिखा है 'सब जानते हैं कि नेता X बुरा था!'। वेबसाइट B राष्ट्रीय संग्रहालय का आधिकारिक स्रोत है जिसमें संदर्भ दिए हैं। आप किस पर भरोसा करेंगे?",
          "gu": "તમે ઇતિહાસના નિબંધ માટે શોધ કરો છો. વેબસાઇટ A પર લેખકનું નામ નથી, મોટા અક્ષરો છે અને લખ્યું છે 'બધા જાણે છે કે નેતા X ખરાબ હતો!'. વેબસાઇટ B રાષ્ટ્રીય મ્યુઝિયમની સત્તાવાર વેબસાઇટ છે જેમાં સંદર્ભ આપેલા છે. તમે કોના પર વિશ્વાસ કરશો?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Website B (Official institution, neutral evidence-based tone, verifiable citations)",
              "hi": "वेबसाइट B (आधिकारिक संस्था, निष्पक्ष भाषा, प्रमाणित ऐतिहासिक संदर्भ)",
              "gu": "વેબસાઇટ B (સત્તાવાર સંસ્થા, તટસ્થ ભાષા, સાબિત થયેલા ઐતિહાસિક સંદર્ભ)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "Website A because it uses exclamation marks and feels louder",
              "hi": "वेबसाइट A क्योंकि इसमें विस्मयादिबोधક चिन्ह हैं और यह अधिक आक्रामक है",
              "gu": "વેબસાઇટ A કારણ કે તેમાં ઉદ્ગારચિહ્નો છે અને તે વધુ આક્રમક છે"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "Neither, history cannot be studied",
              "hi": "दोनों नहीं, इतिहास पढ़ा ही नहीं जा सकता",
              "gu": "બંને નહીં, ઇતિહાસ શીખી જ ન શકાય"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "Flip a coin to decide",
              "hi": "सिक्का उछालकर तय करें",
              "gu": "સિક્કો ઉછાળીને નક્કી કરો"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Emotional language, anonymous authors, and sweeping generalizations ('everyone knows') are major red flags that disqualify Website A.",
          "hi": "शानदार! भावनात्मक भाषा, अज्ञात लेखक और अतिशयोक्तिपूर्ण दावे वेबसाइट A को तुरंत अविश्वसनीय बना देते हैं।",
          "gu": "એકદમ સાચું! લાગણીશીલ ભાષા, અજ્ઞાત લેખક અને અતિશયોક્તિભર્યા દાવાઓ વેબસાઇટ A ને તરત જ અવિશ્વસનીય બનાવે છે."
        }
      },
      {
        "type": "strategy_pills",
        "icon": "red_flag_alert",
        "title": {
          "en": "Scam Radar Superpower",
          "hi": "भ्रामक दावा रडार सुपरपावर",
          "gu": "સ્કેમ રડાર સુપરપાવર"
        },
        "body": {
          "en": "Spot absolute words, emotional triggers, and missing evidence to filter out false claims.",
          "hi": "गलत सूचनाओं को बाहर करने के लिए अतिशयोक्ति शब्दों, भावनात्मक जाल और गायब सबूतों को पहचानें।",
          "gu": "ખોટી માહિતી પકડવા માટે અતિશયોક્તિવાળા શબ્દો, લાગણીની જાળ અને પુરાવા વગરના દાવાઓ ઓળખો."
        },
        "tags": [
          {
            "en": "No Absolute Words",
            "hi": "अतिशयोक्ति से बचें",
            "gu": "અતિશયોક્તિ મુક્ત"
          },
          {
            "en": "Verify Sources",
            "hi": "स्रोत की जांच",
            "gu": "પુરાવાની તપાસ"
          },
          {
            "en": "Emotional Filter",
            "hi": "भावनाओं का फिल्टर",
            "gu": "લાગણીઓનું ફિલ્ટર"
          },
          {
            "en": "Peer-Reviewed Data",
            "hi": "प्रमाणित डेटा",
            "gu": "સાબિત માહિતી"
          },
          {
            "en": "Clickbait Radar",
            "hi": "क्लिकबेट रडार",
            "gu": "ક્લિકબેટ રડાર"
          },
          {
            "en": "Critical Lens",
            "hi": "तार्किक दृष्टि",
            "gu": "તાર્કિક દ્રષ્ટિ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "red_flag_alert",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Check the source: Is the author an identified expert or trusted scientific institution?",
              "hi": "स्रोत जांचें: क्या लेखक एक प्रमाणित विशेषज्ञ या विश्वसनीय वैज्ञानिक संस्थान है?",
              "gu": "પુરાવો તપાસો: શું લેખક કોઈ પ્રમાણિત નિષ્ણાત કે વિશ્વસનીય વૈજ્ઞાનિક સંસ્થા છે?"
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Scan for absolute words ('100% cure', 'always', 'secret miracle', 'everyone agrees').",
              "hi": "अतिशयोक्ति शब्द खोजें ('100% इलाज', 'हमेशा', 'चमत्कार', 'सभी सहमत हैं')।",
              "gu": "અતિશયોક્તિવાળા શબ્દો શોધો ('૧૦૦% ઇલાજ', 'હંમેશાં', 'ચમત્કાર', 'બધા સંમત છે')."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Detect emotional triggers: Is the text trying to make you panic, angry, or greedy?",
              "hi": "भावनात्मक जाल पहचानें: क्या यह आपको डराने, गुस्सा दिलाने या लालच देने की कोशिश कर रहा है?",
              "gu": "લાગણીની જાળ ઓળખો: શું લખાણ તમને ડરાવવા, ગુસ્સે કરવા કે લાલચ આપવાનો પ્રયત્ન કરે છે?"
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "If 2 or more red flags are present, reject the claim until verified by cross-checking neutral databases.",
              "hi": "यदि 2 या अधिक रेड फ्लैग मिलें, तो निष्पक्ष स्रोतों से जांच होने तक दावे को अस्वीकार करें।",
              "gu": "જો ૨ કે વધુ રેડ ફ્લેગ મળે, તો તટસ્થ પુરાવા ન મળે ત્યાં સુધી તે દાવાને અસ્વીકાર કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "red_flag_alert",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Analyze 2 advertisements or viral news stories today and spot at least 1 cognitive Red Flag (absolute word or missing source)!",
          "hi": "आज 2 विज्ञापनों या खबरों का विश्लेषण करें और कम से कम 1 रेड फ्लैग (अतिशयोक्ति शब्द या गायब स्रोत) खोजें!",
          "gu": "આજે ૨ જાહેરાતો કે વાયરલ સમાચારોનું વિશ્લેષણ કરો અને ઓછામાં ઓછો ૧ રેડ ફ્લેગ (અતિશયોક્તિ કે પુરાવા વગરનો દાવો) શોધી બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will scan claims with my Red Flag radar!",
          "hi": "मैं रेड फ्लैग रडार से दावों की जांच करूँगा!",
          "gu": "હું રેડ ફ્લેગ રડારથી દાવાઓની તપાસ કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_178",
    "methodNumber": 178,
    "classLevel": 6,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Mistake Classification (The 4-Bucket Error Taxonomy)",
      "hi": "त्रुटि वर्गीकरण (4-श्रेणी गलती निदान प्रणाली)",
      "gu": "ભૂલ વર્ગીકરણ (૪-કેટેગરી ભૂલ નિદાન પદ્ધતિ)"
    },
    "description": {
      "en": "Diagnose every wrong test answer into 4 exact buckets: 1) Concept Blindspot, 2) Careless Slip, 3) Misread Question Bug, or 4) Time Panic Rush—and apply the specific cure.",
      "hi": "हर गलत उत्तर को 4 श्रेणियों में बाँटें: 1) नियम की कमी, 2) असावधानी, 3) प्रश्न गलत पढ़ना, या 4) समय की घबराहट—और सटीक इलाज लागू करें।",
      "gu": "દરેક ખોટા જવાબને ૪ ભાગમાં વહેંચો: ૧) નિયમની ખામી, ૨) ઉતાવળની ભૂલ, ૩) ખોટો સવાલ વાંચવો, કે ૪) સમયનો ગભરાટ—અને સાચો ઉપાય લાગુ કરો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "error_tags",
        "title": {
          "en": "Treating All Test Mistakes as 'I Am Bad at Math'?",
          "hi": "हर गलती को 'मुझसे गणित नहीं होता' मानकर हताश हो जाते हैं?",
          "gu": "દરેક ભૂલને 'મને ગણિત નથી આવડતું' માનીને નિરાશ થઈ જાઓ છો?"
        },
        "pain_quotes": [
          {
            "en": "I lost 8 marks on my exam and felt completely hopeless, without realizing 6 of those marks were just sloppy addition slips!",
            "hi": "मेरे 8 अंक कटे और मैं निराश हो गया, बिना यह जाने कि उनमें से 6 अंक केवल जोड़ने की छोटी लापरवाही के थे!",
            "gu": "મારા ૮ માર્ક્સ કપાયા અને હું નિરાશ થઈ ગયો, એ જાણ્યા વગર કે તેમાંથી ૬ માર્ક્સ માત્ર સરવાળાની નાની ઉતાવળના હતા!"
          },
          {
            "en": "I study the chapter for 5 extra hours, but in the next test I make the exact same careless slip again!",
            "hi": "मैं 5 घंटे ज्यादा पढ़ता हूँ, लेकिन अगली परीक्षा में फिर वही लापरवाही वाली गलती दोहरा देता हूँ!",
            "gu": "હું ૫ કલાક વધુ વાંચું છું, પણ આગલી પરીક્ષામાં ફરી એ જ ઉતાવળિયા ભૂલ કરી બેસું છું!"
          }
        ],
        "body": {
          "en": "A doctor doesn't give cough syrup for a broken leg. You cannot fix a careless slip by re-reading the textbook chapter! 'Mistake Classification' sorts errors into 4 precise buckets: Concept (didn't understand formula), Slip (sloppy math), Misread (missed key word), or Time Panic. Naming the exact bug gives you the exact cure!",
          "hi": "एक डॉक्टर पैर टूटने पर खांसी की दवाई नहीं देता। लापरवाही की गलती को किताब दोबारा पढ़कर ठीक नहीं किया जा सकता! 'त्रुटि वर्गीकरण' गलतियों को 4 स्पष्ट श्रेणियों में बाँटता है: नियम (समझ नहीं आया), स्लिप (असावधानी), गलत पढ़ना (शब्द छूट गया), या समय का दबाव। सही बीमारी पहचानते ही सही इलाज मिल जाता है!",
          "gu": "ડોક્ટર પગ ભાંગ્યો હોય ત્યારે ઉધરસની દવા નથી આપતા. ઉતાવળની ભૂલને ચોપડી ફરી વાંચીને સુધારી ન શકાય! 'ભૂલ વર્ગીકરણ' ભૂલોને ૪ સ્પષ્ટ ભાગમાં વહેંચે છે: નિયમ (નથી સમજાયો), સ્લિપ (ઉતાવળ), ખોટું વાંચન (શબ્દ ચૂકી ગયા), કે સમયનો ગભરાટ. સાચી બીમારી ઓળખાતાં જ સાચો ઉપાય મળે છે!"
        },
        "key_takeaway": {
          "en": "4-Bucket Rule: Classify each error (Concept / Slip / Misread / Time) $\\rightarrow$ Apply the targeted cure $\\rightarrow$ 0 Repeated Mistakes!",
          "hi": "4-श्रेणी नियम: हर गलती का प्रकार पहचानें (नियम / स्लिप / गलत पढ़ना / समय) $\\rightarrow$ सही इलाज लागू करें $\\rightarrow$ शून्य दोहराव!",
          "gu": "૪-ભાગ નિયમ: દરેક ભૂલનો પ્રકાર નક્કી કરો (નિયમ / સ્લિપ / ખોટું વાંચન / સમય) $\\rightarrow$ સાચો ઉપાય વાપરો $\\rightarrow$ શૂન્ય ભૂલો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "error_tags",
        "title": {
          "en": "Meet Tanya",
          "hi": "तान्या से मिलें",
          "gu": "મળો તાન્યાને"
        },
        "story": {
          "en": "Tanya scored 72/100 on her Mid-Term Math exam. Instead of crying, she did a 4-Bucket Audit: 2 marks were 'Concept' (forgot sphere formula), 12 marks were 'Misread' (missed 'calculate in METERS'), and 14 marks were 'Slips' ($8 \\times 7 = 54$). Realizing her concepts were actually strong, she practiced circling question units and writing carry-overs clearly. On finals, she scored 98/100!",
          "hi": "तान्या को गणित में 72/100 मिले। रोने के बजाय उसने 4-श्रेणी ऑडिट किया: 2 अंक 'नियम' (गोले का सूत्र भूले), 12 अंक 'गलत पढ़ने' (मीटर में बदलना था), और 14 अंक 'असावधानी' ($8 \\times 7 = 54$ लिख दिया)। उसने इकाइयों पर गोला लगाना और हासिल साफ लिखना शुरू किया। वार्षिक परीक्षा में 98/100 पाए!",
          "gu": "તાન્યાને ગણિતમાં ૭૨/૧૦૦ આવ્યા. રડવાને બદલે તેણે ૪-કેટેગરી ઓડિટ કર્યું: ૨ માર્ક્સ 'નિયમ' (ગોળાનું સૂત્ર ભુલાયું), ૧૨ માર્ક્સ 'ખોટું વાંચન' (મીટરમાં ફેરવવાનું હતું), અને ૧૪ માર્ક્સ 'ઉતાવળ' ($૮ \\times ૭ = ૫૪$ લખ્યું). તેણે એકમો પર ગોળ કરવાનું અને વદ્દી ચોખ્ખી લખવાનું શરૂ કર્યું. વાર્ષિક પરીક્ષામાં ૯૮/૧૦૦ મેળવ્યા!"
        },
        "insight_box": {
          "en": "The Slip Cure: Careless execution slips are solved not by studying more, but by using physical pencil underlines and step-by-step alignment.",
          "hi": "असावधानी का इलाज: असावधानी की गलतियाँ ज्यादा पढ़ने से नहीं, बल्कि पेंसिल से रेखांकित करने और साफ-साफ लिखने से ठीक होती हैं।",
          "gu": "ઉતાવળનો ઉપાય: ઉતાવળની ભૂલો વધુ વાંચવાથી નહીં, પણ પેન્સિલથી લીટી દોરવા અને ચોખ્ખું લખવાથી સુધરે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "error_tags",
        "question": {
          "en": "A student solves a perimeter problem correctly, but writes the final answer in 'Centimeters' instead of the requested 'Meters'. What bucket is this error?",
          "hi": "एक छात्र परिमाप का सवाल सही हल करता है, लेकिन उत्तर मांगे गए 'मीटर' के बजाय 'सेंटीमीटर' में लिख देता है। यह गलती किस श्रेणी में आती है?",
          "gu": "એક વિદ્યાર્થી પરિમિતિનો દાખલો સાચો ગણે છે, પણ માંગેલા 'મીટર' ને બદલે 'સેન્ટીમીટર' માં જવાબ લખી દે છે. આ ભૂલ કયા ખાનામાં આવે છે?"
        },
        "option_a": {
          "en": "Misread Question Bug (Missed the unit constraint in the question stem).",
          "hi": "प्रश्न गलत पढ़ने का बग (प्रश्न में दी गई इकाई की शर्त को नजरअंदाज किया)।",
          "gu": "ખોટો સવાલ વાંચવાની ભૂલ (સવાલમાં આપેલી એકમની શરત ચૂકી ગયા)."
        },
        "option_b": {
          "en": "Total failure in mathematics.",
          "hi": "गणित में पूरी तरह असफलता।",
          "gu": "ગણિતમાં સંપૂર્ણ નિષ્ફળતા."
        },
        "feedback": {
          "en": "Correct! The student understands perimeter (Concept is fine), but suffered a Misread Bug. The cure is circling required units before solving!",
          "hi": "सही! छात्र को परिमाप का नियम आता है, लेकिन प्रश्न की इकाई छूट गई। इसका इलाज हल करने से पहले इकाई पर गोला लगाना है!",
          "gu": "સાચું! વિદ્યાર્થીને પરિમિતિનો નિયમ આવડે છે, પણ એકમ જોવામાં ભૂલ થઈ. ઉપાય: દાખલો ગણતાં પહેલાં એકમ પર ગોળ કરો!"
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "error_tags",
        "question": {
          "en": "Look at these 4 exam mistakes. Which one is a pure CONCEPT BLINDSPOT requiring textbook re-learning?",
          "hi": "इन 4 परीक्षा गलतियों को देखें। कौन सी गलती एक शुद्ध 'नियम की कमी (Concept Blindspot)' है जिसे किताब से दोबारा सीखने की जरूरत है?",
          "gu": "આ ૪ પરીક્ષાની ભૂલો જુઓ. કઈ ભૂલ શુદ્ધ 'નિયમની ખામી (Concept Blindspot)' છે જેને પુસ્તકમાંથી ફરી શીખવાની જરૂર છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "A student believes that dividing a number by a fraction like $1/2$ makes the answer smaller ($10 \\div 1/2 = 5$ instead of 20)",
              "hi": "छात्र का मानना है कि भिन्न $1/2$ से भाग देने पर उत्तर छोटा हो जाता है ($10 \\div 1/2 = 5$ लिख दिया)",
              "gu": "વિદ્યાર્થી માને છે કે અપૂર્ણાંક ૧/૨ વડે ભાગતાં જવાબ નાનો થાય છે ($૧૦ \\div ૧/૨ = ૫$ લખી દીધું)"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "A student wrote $7 + 8 = 16$ while rushing in the last 30 seconds",
              "hi": "छात्र ने आखिरी 30 सेकंड की जल्दबाजी में $7 + 8 = 16$ लिख दिया",
              "gu": "વિદ્યાર્થીએ છેલ્લી ૩૦ સેકન્ડની ઉતાવળમાં ૭ + ૮ = ૧૬ લખી દીધું"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "A student missed reading the negative word 'EXCEPT' in question 4",
              "hi": "छात्र ने प्रश्न 4 में 'छोड़कर' (EXCEPT) शब्द नहीं देखा",
              "gu": "વિદ્યાર્થીએ પ્રશ્ન ૪ માં 'સિવાય' (EXCEPT) શબ્દ ન જોયો"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "A student left question 10 blank because the final bell rang",
              "hi": "छात्र का प्रश्न 10 छूट गया क्योंकि घंटी बज गई थी",
              "gu": "વિદ્યાર્થીનો પ્રશ્ન ૧૦ છૂટી ગયો કારણ કે ઘંટ વાગી ગયો હતો"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Option A shows a fundamental misunderstanding of dividing by fractions ($10 \\div 1/2 = 10 \\times 2 = 20$). This requires conceptual re-learning!",
          "hi": "शानदार! विकल्प A भिन्न के भाग के बुनियादी नियम की समझ की कमी दिखाता है ($10 \\div 1/2 = 20$)। इसे दोबारा सीखने की जरूरत है!",
          "gu": "એકદમ સાચું! વિકલ્પ A અપૂર્ણાંકના ભાગાકારના પાયાના નિયમની ખામી દર્શાવે છે ($૧૦ \\div ૧/૨ = ૨૦$). આને ફરીથી શીખવાની જરૂર છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "error_tags",
        "title": {
          "en": "4-Bucket Error Superpower",
          "hi": "4-श्रेणी त्रुटि निदान सुपरपावर",
          "gu": "૪-કેટેગરી ભૂલ નિદાન સુપરપાવર"
        },
        "body": {
          "en": "Sort test mistakes into Concept, Slip, Misread, or Time Panic to apply targeted cures.",
          "hi": "सही समाधान लागू करने के लिए गलतियों को नियम, स्लिप, गलत पढ़ना या समय के दबाव में बाँटें।",
          "gu": "સાચો ઉપાય કરવા માટે ભૂલોને નિયમ, સ્લિપ, ખોટું વાંચન કે સમયના ગભરાટમાં વર્ગીકૃત કરો."
        },
        "tags": [
          {
            "en": "Concept Blindspot",
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
            "en": "Time Panic",
            "hi": "समय का दबाव",
            "gu": "સમયનો ગભરાટ"
          },
          {
            "en": "Targeted Cure",
            "hi": "सटीक इलाज",
            "gu": "ચોક્કસ ઉપાય"
          },
          {
            "en": "Zero Discouragement",
            "hi": "हताशा मुक्त",
            "gu": "નિરાશા મુક્ત"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "error_tags",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Collect your graded test paper and create 4 columns: [Concept, Slip, Misread, Time].",
              "hi": "अपनी जांची हुई टेस्ट शीट लें और 4 कॉलम बनाएं: [नियम, स्लिप, गलत पढ़ना, समय]।",
              "gu": "તમારું તપાસેલું પેપર લો અને ૪ ખાના બનાવો: [નિયમ, સ્લિપ, ખોટું વાંચન, સમય]."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Place every lost mark into its single true diagnostic bucket.",
              "hi": "कटे हुए प्रत्येक अंक को उसकी सही नैदानिक श्रेणी में दर्ज करें।",
              "gu": "કપાયેલા દરેક ગુણને તેના સાચા નિદાન ખાનામાં લખો."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Calculate which bucket caused the highest lost marks (usually Slips and Misreads!).",
              "hi": "देखें कि किस श्रेणी में सबसे ज्यादा अंक कटे (आमतौर पर स्लिप और गलत पढ़ना!)।",
              "gu": "ગણતરી કરો કે કયા ખાનામાં સૌથી વધુ માર્ક્સ કપાયા (સામાન્ય રીતે સ્લિપ અને ખોટું વાંચન!)."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Assign the specific cure: Concept $\\rightarrow$ ask teacher; Slip $\\rightarrow$ check arithmetic; Misread $\\rightarrow$ circle units.",
              "hi": "सटीक इलाज लागू करें: नियम $\\rightarrow$ शिक्षक से पूछें; स्लिप $\\rightarrow$ साफ लिखें; गलत पढ़ना $\\rightarrow$ इकाई पर गोला लगाएं।",
              "gu": "ચોક્કસ ઉપાય વાપરો: નિયમ $\\rightarrow$ શિક્ષકને પૂછો; સ્લિપ $\\rightarrow$ ચોખ્ખું લખો; ખોટું વાંચન $\\rightarrow$ એકમ પર ગોળ કરો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "error_tags",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Take your most recent marked math or science test, classify every lost mark into the 4 buckets, and show your parent the exact breakdown!",
          "hi": "अपनी हाल की टेस्ट शीट लें, कटे हुए अंकों को 4 श्रेणियों में बाँटें और माता-पिता को सही विश्लेषण दिखाएं!",
          "gu": "તમારી તાજેતરની ટેસ્ટ શીટ લો, કપાયેલા ગુણને ૪ ભાગમાં વહેંચો અને વાલીને સાચું વિશ્લેષણ બતાવો!"
        },
        "commitment_button_text": {
          "en": "I will classify mistakes to conquer them!",
          "hi": "मैं गलतियों का वर्गीकरण करके सुधार करूँगा!",
          "gu": "હું ભૂલોનું વર્ગીકરણ કરીને સુધારો કરીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_180",
    "methodNumber": 180,
    "classLevel": 6,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Prediction → Result → Reflection (The Scientist Forecaster)",
      "hi": "पूर्वानुमान → परिणाम → चिंतन (वैज्ञानिक पूर्वानुमान चक्र)",
      "gu": "પૂર્વાનુમાન → પરિણામ → ચિંતન (વૈજ્ઞાનિક આગાહી ચક્ર)"
    },
    "description": {
      "en": "Calibrate your scientific intuition by committing to an explicit quantified prediction BEFORE calculating, comparing against the actual result, and reflecting on the gap.",
      "hi": "गणना या प्रयोग से पहले एक स्पष्ट संख्यात्मक पूर्वानुमान लिखकर, परिणाम से तुलना करके और अंतर पर विचार करके अपनी अंतर्दृष्टि को तेज करें।",
      "gu": "ગણતરી કે પ્રયોગ પહેલાં સ્પષ્ટ અંદાજ લખીને, સાચા પરિણામ સાથે સરખાવીને અને તફાવત પર વિચારીને પોતાની સમજણ વધુ સચોટ બનાવો."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "prediction_loop",
        "title": {
          "en": "Blindly Accepting Absurd Calculator Answers Without Thinking?",
          "hi": "कैलकुलेटर या रफ गणना के असंभव उत्तरों को बिना सोचे स्वीकार कर लेते हैं?",
          "gu": "કેલ્ક્યુલેટર કે ગણતરીના અસંભવ જવાબોને વિચાર્યા વગર સાચા માની લો છો?"
        },
        "pain_quotes": [
          {
            "en": "I calculated $48 \\times 22$ and wrote 10,560 on my test because I accidentally pressed an extra 0, and didn't even notice!",
            "hi": "मैंने $48 \\times 22$ हल किया और गलती से अतिरिक्त 0 लगाकर 10,560 लिख दिया, और ध्यान भी नहीं दिया कि यह असंभव है!",
            "gu": "મેં $૪૮ \\times ૨૨$ ગણ્યા અને ભૂલથી વધારાનો ૦ દબાઈ જતાં ૧૦,૫૬૦ લખી દીધું, અને વિચાર્યું પણ નહીં કે આ અશક્ય છે!"
          },
          {
            "en": "In science labs, I mix chemicals without thinking about what should happen, so I don't understand the experiment!",
            "hi": "प्रयोगशाला में मैं बिना सोचे रसायन मिला देता हूँ कि क्या होना चाहिए, जिससे प्रयोग समझ ही नहीं आता!",
            "gu": "પ્રયોગશાળામાં હું શું પરિણામ આવશે તે વિચાર્યા વગર રસાયણો ભેગા કરું છું, જેથી પ્રયોગ સમજાતો જ નથી!"
          }
        ],
        "body": {
          "en": "Computers execute calculations, but humans provide reality checks. The 'Predict $\\rightarrow$ Result $\\rightarrow$ Reflect' loop forces you to estimate a ballpark number BEFORE computing (e.g. $50 \\times 20 \\approx 1,000$). When your calculation outputs 10,560, your prediction alarm sounds immediately to catch the bug!",
          "hi": "कंप्यूटर केवल गणना करते हैं, लेकिन वास्तविकता की जांच इंसान करता है। 'पूर्वानुमान $\\rightarrow$ परिणाम $\\rightarrow$ चिंतन' चक्र आपको गणना से पहले एक अनुमानित संख्या लिखने पर मजबूर करता है ($50 \\times 20 \\approx 1,000$)। जब गणना 10,560 आए, तो आपका अलार्म तुरंत गलती पकड़ लेता है!",
          "gu": "કમ્પ્યુટર માત્ર ગણતરી કરે છે, પણ વાસ્તવિકતાની ચકાસણી માણસ કરે છે. 'પૂર્વાનુમાન $\\rightarrow$ પરિણામ $\\rightarrow$ ચિંતન' ચક્ર તમને ગણતરી પહેલાં અંદાજિત સંખ્યા લખવા પ્રેરે છે ($૫૦ \\times ૨૦ \\approx ૧,૦૦૦$). જ્યારે ગણતરી ૧૦,૫૬૦ આવે, ત્યારે તમારું એલાર્મ તરત જ ભૂલ પકડી પાડે છે!"
        },
        "key_takeaway": {
          "en": "Forecaster Loop: 1) Predict (Ballpark estimate) $\\rightarrow$ 2) Calculate Result $\\rightarrow$ 3) Reflect on the gap!",
          "hi": "पूर्वानुमान चक्र: 1) अनुमान लगाएं $\\rightarrow$ 2) वास्तविक परिणाम निकालें $\\rightarrow$ 3) अंतर पर विचार करें!",
          "gu": "આગાહી ચક્ર: ૧) અંદાજ લગાવો $\\rightarrow$ ૨) સાચો જવાબ ગણો $\\rightarrow$ ૩) તફાવત પર વિચાર કરો!"
        }
      },
      {
        "type": "relatable_story",
        "icon": "prediction_loop",
        "title": {
          "en": "Meet Rishi",
          "hi": "ऋषि से मिलें",
          "gu": "મળો ઋષિને"
        },
        "story": {
          "en": "Rishi was calculating $495 \\div 11$. Before calculating, he predicted: '495 is close to 500, and $500 \\div 10 = 50$, so the answer must be around 45.' When his scratch math gave him 4.5 due to a misplaced decimal point, Rishi immediately caught the error because 4.5 was 10x smaller than his prediction of 45! He corrected it to 45 instantly.",
          "hi": "ऋषि $495 \\div 11$ हल कर रहा था। गणना से पहले उसने अनुमान लगाया: '495 लगभग 500 है, और $500 \\div 10 = 50$, इसलिए उत्तर 45 के आसपास होगा।' जब दशमलव की गलती से उसका उत्तर 4.5 आया, तो उसने तुरंत पकड़ लिया क्योंकि 4.5 उसके अनुमान 45 से 10 गुना छोटा था! उसने तुरंत 45 सही कर लिया।",
          "gu": "ઋષિ $૪૯૫ \\div ૧૧$ ગણતો હતો. ગણતરી પહેલાં તેણે અંદાજ લગાવ્યો: '૪૯૫ આશરે ૫૦૦ છે, અને $૫૦૦ \\div ૧૦ = ૫૦$, તેથી જવાબ ૪૫ ની આસપાસ હોવો જોઈએ.' જ્યારે પોઇન્ટની ભૂલથી તેનો જવાબ ૪.૫ આવ્યો, ત્યારે તેણે તરત જ ભૂલ પકડી લીધી કારણ કે ૪.૫ તેના ૪૫ ના અંદાજ કરતાં ૧૦ ગણો નાનો હતો! તેણે તરત જ ૪૫ સુધારી લીધું."
        },
        "insight_box": {
          "en": "Estimation Shield: A 3-second ballpark estimate protects you from 100% of catastrophic decimal point and zero slips.",
          "hi": "अनुमान ढाल: 3 सेकंड का अनुमान आपको दशमलव और शून्य की 100% बड़ी गलतियों से बचाता है।",
          "gu": "અંદાજ ઢાલ: ૩ સેકન્ડનો સાદો અંદાજ તમને પોઇન્ટ અને શૂન્યની ૧૦૦% મોટી ભૂલોથી બચાવે છે."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "prediction_loop",
        "question": {
          "en": "Why should you always write down a quick estimation BEFORE calculating a multi-step math or science problem?",
          "hi": "गणित या विज्ञान के सवाल को हल करने से पहले हमेशा एक त्वरित अनुमान क्यों लिखना चाहिए?",
          "gu": "ગણિત કે વિજ્ઞાનનો દાખલો ગણતાં પહેલાં હંમેશાં ઝડપી અંદાજ કેમ લખવો જોઈએ?"
        },
        "option_a": {
          "en": "It acts as a mental sanity anchor to instantly detect absurd calculation or decimal point errors.",
          "hi": "यह एक मानसिक सुरक्षा लंगर का काम करता है जिससे असंभव या दशमलव की गलतियाँ तुरंत पकड़ी जा सकें।",
          "gu": "તે માનસિક સુરક્ષા કવચનું કામ કરે છે જેથી અસંભવ કે પોઇન્ટની ભૂલો તરત પકડાઈ જાય."
        },
        "option_b": {
          "en": "So you never have to do the actual calculation.",
          "hi": "ताकि आपको वास्तविक गणना ही न करनी पड़े।",
          "gu": "જેથી તમારે સાચી ગણતરી જ ન કરવી પડે."
        },
        "feedback": {
          "en": "Correct! Pre-predictions anchor your brain so ridiculous slips never slip onto your final answer sheet.",
          "hi": "सही! पूर्व-अनुमान दिमाग को सतर्क रखता है जिससे बेतुकी गलतियाँ उत्तर पुस्तिका में दर्ज नहीं होतीं।",
          "gu": "સાચું! પૂર્વ-અંદાજ મગજને સાવચેત રાખે છે જેથી હાસ્યાસ્પદ ભૂલો પેપરમાં લખાતી નથી."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "prediction_loop",
        "question": {
          "en": "Problem: Calculate $19.8 \\times 5.1$. \nStep 1 (Predict): Round to $20 \\times 5 = 100$. \nStep 2 (Result): A student's calculation gives $100.98$. \nStep 3 (Reflect): Does $100.98$ make sense with the prediction of $100$?",
          "hi": "सवाल: $19.8 \\times 5.1$ की गणना करें। \nचरण 1 (अनुमान): लगभग $20 \\times 5 = 100$। \nचरण 2 (परिणाम): छात्र की गणना से $100.98$ आया। \nचरण 3 (चिंतन): क्या $100.98$ अनुमानित $100$ के साथ सही बैठता है?",
          "gu": "દાખલો: $૧૯.૮ \\times ૫.૧$ ગણો. \nપગલું ૧ (અંદાજ): આશરે $૨૦ \\times ૫ = ૧૦૦$. \nપગલું ૨ (પરિણામ): વિદ્યાર્થીની ગણતરીથી ૧૦૦.૯૮ આવ્યું. \nપગલું ૩ (ચિંતન): શું ૧૦૦.૯૮ એ ૧૦૦ ના અંદાજ સાથે યોગ્ય બેસે છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "Yes, $100.98$ is extremely close to the prediction of $100$, confirming high precision",
              "hi": "हाँ, $100.98$ अनुमानित $100$ के बेहद करीब है, जो उच्च सटीकता की पुष्टि करता है",
              "gu": "હા, ૧૦૦.૯૮ એ ૧૦૦ ના અંદાજની ખૂબ નજીક છે, જે સચોટતાની ખાતરી આપે છે"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "No, the answer should be 1,000",
              "hi": "नहीं, उत्तर 1,000 होना चाहिए",
              "gu": "ના, જવાબ ૧,૦૦૦ હોવો જોઈએ"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "No, decimals cannot be multiplied",
              "hi": "नहीं, दशमलव का गुणा नहीं हो सकता",
              "gu": "ના, પોઇન્ટવાળા ગુણાકાર શક્ય નથી"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "The answer must be 10",
              "hi": "उत्तर 10 होना चाहिए",
              "gu": "જવાબ ૧૦ હોવો જોઈએ"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! The predicted anchor (100) verified that $100.98$ was in the perfect range and free from decimal point slips!",
          "hi": "शानदार! अनुमानित लंगर (100) ने सिद्ध किया कि $100.98$ बिल्कुल सही दायरे में है और दशमलव की किसी गलती से मुक्त है!",
          "gu": "એકદમ સાચું! પૂર્વ-અંદાજે (૧૦૦) સાબિત કર્યું કે ૧૦૦.૯૮ યોગ્ય મર્યાદામાં છે અને પોઇન્ટની કોઈ ભૂલ નથી!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "prediction_loop",
        "title": {
          "en": "Forecaster Loop Superpower",
          "hi": "पूर्वानुमान चक्र सुपरपावर",
          "gu": "આગાહી ચક્ર સુપરપાવર"
        },
        "body": {
          "en": "Commit to a ballpark estimate before computing, compare with the result, and calibrate your intuition.",
          "hi": "गणना से पहले अनुमान लगाएं, परिणाम से तुलना करें और अपनी तार्किक अंतर्दृष्टि को तेज करें।",
          "gu": "ગણતરી પહેલાં અંદાજ લગાવો, પરિણામ સાથે સરખાવો અને તમારી તાર્કિક સમજણ વધુ પાકી કરો."
        },
        "tags": [
          {
            "en": "Predict First",
            "hi": "पहले अनुमान",
            "gu": "પહેલાં અંદાજ"
          },
          {
            "en": "Sanity Anchor",
            "hi": "सुरक्षा लंगर",
            "gu": "સુરક્ષા કવચ"
          },
          {
            "en": "Catch Decimal Slips",
            "hi": "दशमलव त्रुटि पकड़ें",
            "gu": "પોઇન્ટની ભૂલ પકડો"
          },
          {
            "en": "Calibrate Intuition",
            "hi": "अंतर्दृष्टि तेज करें",
            "gu": "સમજણ વધુ સચોટ"
          },
          {
            "en": "Compare Gap",
            "hi": "अंतर पर चिंतन",
            "gu": "તફાવત પર વિચાર"
          },
          {
            "en": "Scientific Mind",
            "hi": "वैज्ञानिक सोच",
            "gu": "વૈજ્ઞાનિક અભિગમ"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "prediction_loop",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Look at the problem numbers and round them to friendly benchmark numbers in your head.",
              "hi": "सवाल की संख्याओं को देखें और मन में उन्हें सरल राउंड नंबरों में बदलें।",
              "gu": "દાખલાની સંખ્યાઓ જુઓ અને મનમાં તેને સરળ રાઉન્ડ ફિગરમાં ફેરવો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Write down your quick ballpark prediction in the margin ($P \\approx 100$).",
              "hi": "रफ मार्जिन में अपना त्वरित अनुमानित पूर्वानुमान लिखें ($P \\approx 100$)।",
              "gu": "હાંસિયામાં તમારો ઝડપી અંદાજિત જવાબ લખો ($P \\approx ૧૦૦$)."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Execute the precise mathematical calculation to obtain the exact result.",
              "hi": "सटीक परिणाम प्राप्त करने के लिए पूरी गणितीय गणना करें।",
              "gu": "સાચો જવાબ મેળવવા માટે સંપૂર્ણ ગાણિતિક ગણતરી કરો."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Compare Result against Prediction: if off by $10\\times$ or $100\\times$, immediately inspect decimal points!",
              "hi": "परिणाम की अनुमान से तुलना करें: यदि 10 या 100 गुना अंतर हो, तो तुरंत दशमलव जांचें!",
              "gu": "પરિણામને અંદાજ સાથે સરખાવો: જો ૧૦ કે ૧૦૦ ગણો તફાવત હોય, તો તરત જ પોઇન્ટ ચકાસો!"
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "prediction_loop",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "On 3 math calculations today, write down a ballpark prediction in the margin before solving and check how close you got!",
          "hi": "आज गणित की 3 गणनाओं में हल करने से पहले मार्जिन में एक अनुमान लिखें और देखें कि आप कितने सटीक थे!",
          "gu": "આજે ગણિતના ૩ દાખલામાં ગણતાં પહેલાં હાંસિયામાં એક અંદાજ લખો અને જુઓ કે તમે કેટલા નજીક પહોંચ્યા!"
        },
        "commitment_button_text": {
          "en": "I will predict before I calculate!",
          "hi": "मैं गणना से पहले अनुमान लगाऊँगा!",
          "gu": "હું ગણતરી પહેલાં અંદાજ લગાવીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  },
  {
    "id": "skill_c6_186",
    "methodNumber": 186,
    "classLevel": 6,
    "category": {
      "en": "Metacognition — \"Think About Your Thinking\"",
      "hi": "मेटाकॉग्निशन — \"अपनी सोच के बारे में सोचें\"",
      "gu": "મેટાકોગ્નિશન — \"તમારા પોતાના વિચાર વિશે વિચારો\""
    },
    "title": {
      "en": "Reflection Loop (The 3-Minute Daily Growth Debrief)",
      "hi": "चिंतन चक्र (3-मिनट का दैनिक प्रगति विश्लेषण)",
      "gu": "ચિંતન ચક્ર (૩-મિનિટનું દૈનિક પ્રગતિ વિશ્લેષણ)"
    },
    "description": {
      "en": "Turn daily study hours into compounding exponential intelligence by asking 3 quick debrief questions every evening: 'What worked?', 'Where did I stall?', and 'What is my 1 upgrade rule for tomorrow?'.",
      "hi": "हर शाम 3 प्रश्न पूछकर दैनिक पढ़ाई को तीव्र प्रगति में बदलें: 'क्या अच्छा रहा?', 'कहाँ रुकावट आई?', और 'कल के लिए मेरा 1 सुधार नियम क्या है?'।",
      "gu": "રોજ સાંજે ૩ પ્રશ્નો પૂછીને દૈનિક અભ્યાસને ઝડપી પ્રગતિમાં ફેરવો: 'શું સારું રહ્યું?', 'ક્યાં અટવાયા?', અને 'આવતીકાલ માટે મારો ૧ સુધારો શું છે?'."
    },
    "xp": 20,
    "duration": "5 min",
    "cards": [
      {
        "type": "problem_hook",
        "icon": "feedback_cycle",
        "title": {
          "en": "Studying Hard Every Day but Feeling Like You Make Zero Progress?",
          "hi": "रोज मेहनत करने के बाद भी लगता है कि कोई खास प्रगति नहीं हो रही?",
          "gu": "દરરોજ મહેનત કરવા છતાં એવું લાગે છે કે કોઈ પ્રગતિ નથી થઈ રહી?"
        },
        "pain_quotes": [
          {
            "en": "I spend 3 hours at my study desk every day, but I repeat the exact same time-wasting habits week after week!",
            "hi": "मैं रोज 3 घंटे पढ़ता हूँ, लेकिन हर हफ्ते वही समय बर्बाद करने वाली आदतें दोहराता रहता हूँ!",
            "gu": "હું રોજ ૩ કલાક ભણવા બેસું છું, પણ દર અઠવાડિયે સમય વેડફવાની એ જ જૂની ટેવો રિપીટ થાય છે!"
          },
          {
            "en": "When a school week ends, I have no idea what strategies helped me or what caused my stress!",
            "hi": "जब स्कूल का हफ्ता खत्म होता है, तो मुझे पता ही नहीं होता कि किस तरीके से मदद मिली और किससे तनाव हुआ!",
            "gu": "જ્યારે અઠવાડિયું પૂરું થાય, ત્યારે મને ખબર જ નથી હોતી કે કઈ રીતથી ફાયદો થયો અને ક્યાં ભૂલ થઈ!"
          }
        ],
        "body": {
          "en": "Experience alone does not make you smarter; evaluating your experience does. The 'Reflection Loop' is the daily superpower of champion athletes and chess grandmasters: spending just 3 minutes before sleep answering 3 targeted questions upgrades your brain's operating system every single night!",
          "hi": "केवल अनुभव आपको बुद्धिमान नहीं बनाता; अनुभव का विश्लेषण बनाता है। 'चिंतन चक्र' चैंपियन खिलाड़ियों की गुप्त शक्ति है: सोने से पहले केवल 3 मिनट में 3 प्रश्नों के उत्तर देने से आपका दिमाग हर रात अपग्रेड होता है!",
          "gu": "માત્ર મહેનત તમને હોશિયાર નથી બનાવતી; મહેનતનું મૂલ્યાંકન બનાવે છે. 'ચિંતન ચક્ર' ચેમ્પિયન ખેલાડીઓની શક્તિ છે: સૂતાં પહેલાં માત્ર ૩ મિનિટમાં ૩ પ્રશ્નોના ઉત્તર આપવાથી તમારું મગજ દરરોજ વધુ શક્તિશાળી બને છે!"
        },
        "key_takeaway": {
          "en": "3-Minute Debrief: 1) What went well? 2) Where did I stall? 3) What is my 1 upgrade rule for tomorrow?",
          "hi": "3-मिनट विश्लेषण: 1) क्या अच्छा रहा? 2) कहाँ रुकावट आई? 3) कल के लिए 1 सुधार नियम क्या है?",
          "gu": "૩-મિનિટ વિશ્લેષણ: ૧) શું સારું રહ્યું? ૨) ક્યાં મુશ્કેલી આવી? ૩) આવતીકાલ માટે ૧ સુધારો શું છે?"
        }
      },
      {
        "type": "relatable_story",
        "icon": "feedback_cycle",
        "title": {
          "en": "Meet Alok",
          "hi": "आलोक से मिलें",
          "gu": "મળો આલોકને"
        },
        "story": {
          "en": "Alok kept a tiny 3-line sticky note on his bedside table. Every night at 9:30 PM, he wrote: 1) Win: 'Finished Math Time Box in 20 min.' 2) Stall: 'Lost 30 min on social media.' 3) Upgrade: 'Put phone in another room tomorrow.' In just 3 weeks of tiny daily upgrades, Alok topped his class while studying LESS time than before!",
          "hi": "आलोक ने बिस्तर के पास एक छोटी पर्ची रखी। रोज रात 9:30 बजे वह 3 बातें लिखता: 1) जीत: 'गणित 20 मिनट में पूरा किया।' 2) रुकावट: 'फोन पर 30 मिनट बर्बाद हुए।' 3) सुधार: 'कल फोन दूसरे कमरे में रखूँगा।' 3 हफ्तों के छोटे-छोटे सुधारों से आलोक ने पहले से कम समय पढ़कर क्लास में टॉप किया!",
          "gu": "આલોકે પલંગ પાસે એક નાની ચિઠ્ઠી રાખી. રોજ રાત્રે ૯:૩૦ વાગ્યે તે ૩ વાતો લખતો: ૧) સફળતા: 'ગણિત ૨૦ મિનિટમાં પૂરું કર્યું.' ૨) મુશ્કેલી: 'ફોન પર ૩૦ મિનિટ બગડી.' ૩) સુધારો: 'કાલે ફોન બીજા રૂમમાં મૂકીશ.' માત્ર ૩ અઠવાડિયાના નાના સુધારાઓથી આલોકે ઓછા સમયે વાંચીને ક્લાસમાં ટોપ કર્યું!"
        },
        "insight_box": {
          "en": "1% Daily Compounding: Improving by just 1% each day makes you 37 times smarter and more capable over a single school year ($1.01^{365} = 37.8$).",
          "hi": "1% दैनिक चक्रवृद्धि: हर दिन केवल 1% सुधार करने से आप 1 साल में 37 गुना अधिक सक्षम बन जाते हैं ($1.01^{365} = 37.8$)।",
          "gu": "૧% દૈનિક પ્રગતિ: દરરોજ માત્ર ૧% સુધારો કરવાથી તમે ૧ વર્ષમાં ૩૭ ગણા વધુ હોશિયાર બની જાઓ છો ($1.01^{365} = 37.8$)."
        }
      },
      {
        "type": "method_concept_check",
        "icon": "feedback_cycle",
        "question": {
          "en": "What is the primary goal of the 3-minute evening Reflection Loop?",
          "hi": "शाम के 3-मिनट के चिंतन चक्र का मुख्य उद्देश्य क्या है?",
          "gu": "સાંજના ૩-મિનિટના ચિંતન ચક્રનો મુખ્ય હેતુ શું છે?"
        },
        "option_a": {
          "en": "To identify what worked and extract ONE specific actionable rule to make tomorrow smoother and more productive.",
          "hi": "यह पहचानना कि क्या अच्छा रहा और कल को अधिक उत्पादक बनाने के लिए 1 व्यावहारिक नियम निकालना।",
          "gu": "એ ઓળખવું કે શું સારું રહ્યું અને આવતીકાલને વધુ સફળ બનાવવા માટે ૧ ચોક્કસ નિયમ નક્કી કરવો."
        },
        "option_b": {
          "en": "To feel guilty and punish yourself for every mistake you made today.",
          "hi": "आज की हर गलती के लिए खुद को दोषी ठहराना और दुखी होना।",
          "gu": "આજની દરેક ભૂલ માટે પોતાને દોષી માનીને દુઃખી થવું."
        },
        "feedback": {
          "en": "Correct! Reflection is compassionate debugging—finding the system bottleneck and installing a patch for tomorrow.",
          "hi": "सही! चिंतन आत्म-सुधार की वैज्ञानिक प्रक्रिया है—कमियों को पहचानकर कल के लिए समाधान तैयार करना।",
          "gu": "સાચું! ચિંતન એ આત્મ-સુધારણાની વૈજ્ઞાનિક રીત છે—ખામીઓ ઓળખીને આવતીકાલ માટે સાચો ઉકેલ શોધવો."
        }
      },
      {
        "type": "skill_practice_quiz",
        "icon": "feedback_cycle",
        "question": {
          "en": "Which of these is the highest-quality 'Tomorrow Upgrade Rule' resulting from an evening reflection loop?",
          "hi": "शाम के चिंतन चक्र से निकलने वाला कौन सा 'कल का सुधार नियम' सबसे उच्च गुणवत्ता का है?",
          "gu": "સાંજના ચિંતન ચક્રમાંથી નીકળેલો કયો 'આવતીકાલનો સુધારો' સૌથી શ્રેષ્ઠ છે?"
        },
        "options": [
          {
            "id": "A",
            "text": {
              "en": "'I stalled on History reading because the chapter was dense $\\rightarrow$ Tomorrow, I will use SQ3R to turn headings into questions before reading!'",
              "hi": "'इतिहास पढ़ने में रुकावट आई क्योंकि पाठ कठिन था $\\rightarrow$ कल मैं पढ़ने से पहले SQ3R से शीर्षकों को प्रश्न बनाऊँगा!'",
              "gu": "'ઇતિહાસ વાંચવામાં મુશ્કેલી આવી કારણ કે પાઠ અઘરો હતો $\\rightarrow$ કાલે હું વાંચતાં પહેલાં SQ3R થી મથાળાઓને પ્રશ્નો બનાવીશ!'"
            }
          },
          {
            "id": "B",
            "text": {
              "en": "'I will just try harder and be a genius tomorrow'",
              "hi": "'मैं कल और ज्यादा कोशिश करूँगा और बुद्धिमान बनूँगा'",
              "gu": "'હું કાલે વધુ પ્રયત્ન કરીશ અને હોશિયાર બની જઈશ'"
            }
          },
          {
            "id": "C",
            "text": {
              "en": "'I will never do homework again'",
              "hi": "'मैं कभी गृहकार्य नहीं करूँगा'",
              "gu": "'હું ક્યારેય હોમવર્ક નહીં કરું'"
            }
          },
          {
            "id": "D",
            "text": {
              "en": "'Everything is fine, no changes needed'",
              "hi": "'सब ठीक है, किसी बदलाव की जरूरत नहीं'",
              "gu": "'બધું બરાબર છે, કોઈ ફેરફારની જરૂર નથી'"
            }
          }
        ],
        "correct_option": "A",
        "feedback": {
          "en": "Spot on! Option A identifies the exact root obstacle and links it directly to a proven cognitive strategy (SQ3R) for immediate implementation tomorrow!",
          "hi": "शानदार! विकल्प A वास्तविक समस्या की पहचान करता है और कल के लिए एक सिद्ध संज्ञानात्मक रणनीति (SQ3R) को लागू करता है!",
          "gu": "એકદમ સાચું! વિકલ્પ A સાચી મુશ્કેલી ઓળખે છે અને આવતીકાલ માટે એક સાબિત પદ્ધતિ (SQ3R) સીધી લાગુ કરે છે!"
        }
      },
      {
        "type": "strategy_pills",
        "icon": "feedback_cycle",
        "title": {
          "en": "Reflection Loop Superpower",
          "hi": "चिंतन चक्र सुपरपावर",
          "gu": "ચિંતન ચક્ર સુપરપાવર"
        },
        "body": {
          "en": "Debrief daily with 3 questions to compound your intelligence by 1% every single evening.",
          "hi": "अपनी बुद्धि को हर रात 1% बढ़ाने के लिए प्रतिदिन शाम को 3 प्रश्नों के साथ चिंतन करें।",
          "gu": "તમારી બુદ્ધિને દરરોજ રાત્રે ૧% વધારવા માટે રોજ સાંજે ૩ પ્રશ્નો સાથે આત્મ-વિશ્લેષણ કરો."
        },
        "tags": [
          {
            "en": "3-Min Debrief",
            "hi": "3-मिनट विश्लेषण",
            "gu": "૩-મિનિટ વિશ્લેષણ"
          },
          {
            "en": "1% Daily Growth",
            "hi": "1% दैनिक सुधार",
            "gu": "૧% દૈનિક સુધારો"
          },
          {
            "en": "What Worked?",
            "hi": "क्या अच्छा रहा?",
            "gu": "શું સારું રહ્યું?"
          },
          {
            "en": "Where I Stalled",
            "hi": "कहाँ रुकावट आई",
            "gu": "ક્યાં મુશ્કેલી આવી"
          },
          {
            "en": "Tomorrow's Upgrade",
            "hi": "कल का सुधार",
            "gu": "આવતીકાલનો સુધારો"
          },
          {
            "en": "Compounding Mastery",
            "hi": "चक्रवृद्धि महारत",
            "gu": "સતત વધતી નિપુણતા"
          }
        ]
      },
      {
        "type": "action_checklist",
        "icon": "feedback_cycle",
        "title": {
          "en": "How to use this superpower",
          "hi": "इस सुपरपावर का उपयोग कैसे करें",
          "gu": "આ સુપરપાવરનો ઉપયોગ કેવી રીતે કરવો"
        },
        "steps": [
          {
            "step": 1,
            "text": {
              "en": "Set a recurring daily alarm for 9:00 PM titled '3-Minute Debrief'.",
              "hi": "रोज रात 9:00 बजे '3-मिनट चिंतन' का एक अलार्म सेट करें।",
              "gu": "રોજ રાત્રે ૯:૦૦ વાગ્યે '૩-મિનિટ ચિંતન' નું એલાર્મ સેટ કરો."
            },
            "correct_order": 1
          },
          {
            "step": 2,
            "text": {
              "en": "Question 1: Celebrate 1 win — 'What study strategy or focus sprint worked best today?'.",
              "hi": "प्रश्न 1: 1 जीत दर्ज करें — 'आज कौन सा तरीका या फोकस स्प्रिंट सबसे अच्छा रहा?'।",
              "gu": "પ્રશ્ન ૧: ૧ સફળતા નોંધો — 'આજે કઈ રીત કે ટાઇમ બોક્સ સૌથી સારું રહ્યું?'."
            },
            "correct_order": 2
          },
          {
            "step": 3,
            "text": {
              "en": "Question 2: Diagnose 1 bottleneck — 'Where did I waste time or get frustrated?'.",
              "hi": "प्रश्न 2: 1 रुकावट पहचानें — 'कहाँ समय बर्बाद हुआ या उलझन हुई?'।",
              "gu": "પ્રશ્ન ૨: ૧ મુશ્કેલી ઓળખો — 'ક્યાં સમય બગડ્યો કે કંટાળો આવ્યો?'."
            },
            "correct_order": 3
          },
          {
            "step": 4,
            "text": {
              "en": "Question 3: Write 1 clear actionable upgrade rule for tomorrow morning.",
              "hi": "प्रश्न 3: कल सुबह के लिए 1 स्पष्ट और व्यावहारिक सुधार नियम लिखें।",
              "gu": "પ્રશ્ન ૩: આવતીકાલ સવાર માટે ૧ સ્પષ્ટ અને ઉપયોગી સુધારો લખી લો."
            },
            "correct_order": 4
          }
        ],
        "interaction_note": "UI shuffles these items; user must tap 1 -> 2 -> 3 -> 4 to unlock Next."
      },
      {
        "type": "daily_mission",
        "icon": "feedback_cycle",
        "title": {
          "en": "Your Daily Mission",
          "hi": "आपका दैनिक मिशन",
          "gu": "તમારું દૈનિક મિશન"
        },
        "mission_text": {
          "en": "Tonight before sleeping, write a 3-sentence Reflection Note in your diary: 1 Win, 1 Stall, and 1 Upgrade Rule for tomorrow!",
          "hi": "आज रात सोने से पहले अपनी डायरी में 3 पंक्तियों का चिंतन नोट लिखें: 1 जीत, 1 रुकावट, और कल के लिए 1 सुधार नियम!",
          "gu": "આજે રાત્રે સૂતાં પહેલાં તમારી ડાયરીમાં ૩-લાઇનની ચિંતન નોંધ લખો: ૧ સફળતા, ૧ મુશ્કેલી, અને આવતીકાલ માટે ૧ સુધારો!"
        },
        "commitment_button_text": {
          "en": "I will grow 1% every day through reflection!",
          "hi": "मैं चिंतन से हर दिन 1% बेहतर बनूँगा!",
          "gu": "હું ચિંતનથી દરરોજ ૧% વધુ સારો બનીશ!"
        },
        "first_time_xp": 20,
        "replay_xp": 0,
        "xp_reward": 20
      }
    ]
  }
];
