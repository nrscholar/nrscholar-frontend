import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { practiceApi, QuestionData, authApi } from "../services/api";
import { notifyTestCleared } from "../services/notifications";
import { DraggableOption } from "../components/DraggableOption";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBossBattleStore } from "@/hooks/useBossBattleStore";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  surface: "#f7f9fb",
  surfaceContainerLowest: "#ffffff",
  surfaceContainer: "#eceef0",
  surfaceVariant: "#e0e3e5",
  onSurfaceVariant: "#464652",
  onSurface: "#191c1e",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  tertiaryContainer: "#d0f0ed", // subtle green for correct
};

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { chapterId, chapterName, resumeFrom, totalCorrect: paramTotalCorrect, incorrectTracker: paramIncorrectTracker, subjectId, subjectName } = params;
  const insets = useSafeAreaInsets();
  
  const [bossTriggeredState, setBossTriggeredState] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [incorrectTracker, setIncorrectTracker] = useState<any[]>([]);

  const [hasShownReward5, setHasShownReward5] = useState(false);
  const [hasShownReward10, setHasShownReward10] = useState(false);
  const [hasShownReward15, setHasShownReward15] = useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const [droppedItems, setDroppedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (chapterId) loadQuestions();
    else setLoading(false);
  }, [chapterId]);

  useEffect(() => {
    if (questions.length > 0 && resumeFrom) {
      const targetIdx = Number(resumeFrom);
      let tc = totalCorrect;
      let it = incorrectTracker;
      if (paramTotalCorrect) tc = Number(paramTotalCorrect);
      if (paramIncorrectTracker) {
        try {
          it = JSON.parse(String(paramIncorrectTracker));
        } catch (e) {
          console.error("Failed parsing paramIncorrectTracker", e);
        }
      }
      
      if (params.hasShownReward5 === "true") setHasShownReward5(true);
      if (params.hasShownReward10 === "true") setHasShownReward10(true);
      if (params.hasShownReward15 === "true") setHasShownReward15(true);

      if (targetIdx >= questions.length) {
        submitAndComplete(tc, it);
      } else {
        setCurrentQ(targetIdx);
        setTotalCorrect(tc);
        setIncorrectTracker(it);
      }
    }
  }, [questions, resumeFrom]);

  const loadQuestions = async () => {
    try {
      const res = await practiceApi.getQuestions(String(chapterId));
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const q = questions[currentQ];
  const qOptions = q?.interaction?.details?.options || q?.options || [];
  const qAnswer = q?.interaction?.details?.answer || q?.answer || "";
  const qText = q?.interaction?.details?.question || q?.question || "";
  const sceneTitle = q?.title || "Mission";
  const interactionType = q?.interaction?.type;
  const isDragObjects = interactionType === "drag_objects";

  useEffect(() => {
    if (isDragObjects) {
      setBasketCount(q?.interaction?.details?.initialCount || 0);
      setDroppedItems({});
      setSelectedOption(null);
    }
  }, [currentQ, questions]);
  
  const isCorrect = q && selectedOption !== null && qOptions[selectedOption] === qAnswer;
  const progressPercent = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;

  const handleOptionPress = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setShowFeedback(true);
    
    const isAnsCorrect = qOptions[selectedOption] === qAnswer;
    if (isAnsCorrect) {
      setTotalCorrect(prev => prev + 1);
    } else {
      setIncorrectTracker(prev => [...prev, {
        questionId: q._id,
        questionText: qText,
        userAnswer: qOptions[selectedOption],
        correctAnswer: qAnswer
      }]);
    }

    const { triggered } = useBossBattleStore.getState().recordAnswer(
      String(chapterId || "mock"),
      String(subjectName || params.subjectName || "Maths"),
      isAnsCorrect
    );
    
    if (triggered) {
      setBossTriggeredState(true);
    }
  };

  const handleNext = () => {
    // 5 right answers -> rewardscreen_panda
    if (totalCorrect >= 5 && !hasShownReward5) {
      router.replace({
        pathname: "/practice/rewardscreen_panda" as any,
        params: {
          ...params,
          resumeIndex: String(currentQ + 1), // Resume on the next question
          totalCorrect: String(totalCorrect),
          incorrectTracker: JSON.stringify(incorrectTracker),
          hasShownReward5: "true",
          hasShownReward10: hasShownReward10 ? "true" : "false",
          hasShownReward15: hasShownReward15 ? "true" : "false",
        } as any
      });
      return;
    }

    // 10 right answers -> rewardscreen_legenderybot
    if (totalCorrect >= 10 && !hasShownReward10) {
      router.replace({
        pathname: "/practice/rewardscreen_legenderybot" as any,
        params: {
          ...params,
          resumeIndex: String(currentQ + 1),
          totalCorrect: String(totalCorrect),
          incorrectTracker: JSON.stringify(incorrectTracker),
          hasShownReward5: hasShownReward5 ? "true" : "false",
          hasShownReward10: "true",
          hasShownReward15: hasShownReward15 ? "true" : "false",
        } as any
      });
      return;
    }

    // 15 right answers -> rewardscreen_legenderydragon
    if (totalCorrect >= 15 && !hasShownReward15) {
      router.replace({
        pathname: "/practice/rewardscreen_legenderydragon" as any,
        params: {
          ...params,
          resumeIndex: String(currentQ + 1),
          totalCorrect: String(totalCorrect),
          incorrectTracker: JSON.stringify(incorrectTracker),
          hasShownReward5: hasShownReward5 ? "true" : "false",
          hasShownReward10: hasShownReward10 ? "true" : "false",
          hasShownReward15: "true",
        } as any
      });
      return;
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(p => p + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      submitAndComplete();
    }
  };

  const checkIfLastChapter = async (): Promise<boolean> => {
    if (!params.subjectId) return false;
    try {
      const res = await practiceApi.getChapters(String(params.subjectId));
      if (res.success && res.data && res.data.length > 0) {
        const lastChapter = res.data[res.data.length - 1];
        return lastChapter._id === chapterId;
      }
    } catch (e) {
      console.error("Failed to check if last chapter", e);
    }
    return false;
  };

  const submitAndComplete = async (customTotalCorrect?: number, customTracker?: any[]) => {
    setLoading(true);
    const tc = customTotalCorrect !== undefined ? customTotalCorrect : totalCorrect;
    const tracker = customTracker !== undefined ? customTracker : incorrectTracker;

    // Earn fuel and coins (e.g. +30 Fuel, +10 Coins per correct answer)
    const earnedFuel = tc * 30;
    const earnedCoins = tc * 10;
    let newFuel = 350 + earnedFuel;
    let newCoins = 420 + earnedCoins;
    let newLevel = 1;
    try {
      const currentFuel = await AsyncStorage.getItem("studysaathy_fuel");
      newFuel = (currentFuel ? Number(currentFuel) : 350) + earnedFuel;
      await AsyncStorage.setItem("studysaathy_fuel", String(newFuel));
      
      const currentCoins = await AsyncStorage.getItem("studysaathy_coins");
      newCoins = (currentCoins ? Number(currentCoins) : 420) + earnedCoins;
      await AsyncStorage.setItem("studysaathy_coins", String(newCoins));

      newLevel = Math.max(1, Math.floor(newFuel / 500) + 1);
      await AsyncStorage.setItem("studysaathy_level", String(newLevel));

      if (chapterId) {
        const storedCompleted = await AsyncStorage.getItem("studysaathy_completed_chapters");
        const completedList = storedCompleted ? JSON.parse(storedCompleted) : [];
        if (!completedList.includes(chapterId)) {
          completedList.push(chapterId);
          await AsyncStorage.setItem("studysaathy_completed_chapters", JSON.stringify(completedList));
        }
      }

      // Sync stats dynamically to the database
      try {
        await authApi.updateStats({ coins: newCoins, fuel: newFuel, level: newLevel });
      } catch (dbErr) {
        console.error("Failed to update stats in database", dbErr);
      }
    } catch (e) {
      console.error("Failed to save session earnings to AsyncStorage", e);
    }

    try {
      const isLast = await checkIfLastChapter();
      if (isLast && params.hasShownMathChampaign !== "true") {
        router.replace({
          pathname: "/practice/reward_mathchampaign" as any,
          params: {
            ...params,
            resumeIndex: String(questions.length),
            totalCorrect: String(tc),
            incorrectTracker: JSON.stringify(tracker),
            hasShownReward5: hasShownReward5 ? "true" : "false",
            hasShownReward10: hasShownReward10 ? "true" : "false",
            hasShownReward15: hasShownReward15 ? "true" : "false",
            hasShownMathChampaign: "true",
          } as any
        });
        return;
      }
    } catch (err) {
      console.error("Error checking last chapter", err);
    }

    try {
      await practiceApi.submitResult(String(chapterId), questions.length, tc, tracker);
      const score = Math.round((tc / questions.length) * 100);
      const chapter = String(chapterName || "the chapter");
      try {
        const userRes = await authApi.getMe();
        const childName = userRes.data?.childName || userRes.data?.fullName || "Your child";
        await notifyTestCleared(childName, chapter, score);
      } catch {}

      router.replace({
        pathname: "/practice/results",
        params: { correct: tc, total: questions.length }
      });
    } catch (e) {
      console.error(e);
      router.replace({
         pathname: "/practice/results",
         params: { correct: tc, total: questions.length }
      });
    }
  };

  if (loading && questions.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No questions found for this chapter.</Text>
        <TouchableOpacity style={styles.backBtnInline} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine styles for options based on feedback state
  const getPodStyle = (idx: number) => {
    if (!showFeedback) {
      return idx === selectedOption ? styles.podActive : styles.podDefault;
    }
    const isThisCorrect = qOptions[idx] === qAnswer;
    if (isThisCorrect) return styles.podCorrect;
    if (idx === selectedOption && !isThisCorrect) return styles.podWrong;
    return styles.podDefault;
  };

  const getLetterStyle = (idx: number) => {
    if (!showFeedback) {
      return idx === selectedOption ? styles.letterActive : styles.letterDefault;
    }
    const isThisCorrect = qOptions[idx] === qAnswer;
    if (isThisCorrect) return styles.letterCorrect;
    if (idx === selectedOption && !isThisCorrect) return styles.letterWrong;
    return styles.letterDefault;
  };
  
  

  const handleTapObject = (idx: number) => {
    if (showFeedback) return;
    
    // Toggle state: if already tapped, remove it
    if (droppedItems[idx]) {
      setBasketCount(prev => Math.max(0, prev - 1));
      setDroppedItems(prev => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      // If we go below target count, reset selection
      const target = q?.interaction?.details?.targetCount || 0;
      if (basketCount - 1 < target) {
        setSelectedOption(null);
      }
    } else {
      const target = q?.interaction?.details?.targetCount || 0;
      // Limit to target count
      if (basketCount >= target) return;
      
      setBasketCount(prev => {
        const newCount = prev + 1;
        if (newCount === target) {
          setSelectedOption(0); // enable Check Answer
        }
        return newCount;
      });
      setDroppedItems(prev => ({ ...prev, [idx]: true }));
    }
  };

  const handleResetBasket = () => {
    if (showFeedback) return;
    setBasketCount(q?.interaction?.details?.initialCount || 0);
    setDroppedItems({});
    setSelectedOption(null);
  };

  return (
    <View style={styles.root}>
      {/* Ambient Backgrounds */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Studysaathy</Text>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialIcons name="track-changes" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Area */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>{sceneTitle} - {currentQ + 1} of {questions.length}</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}% Complete</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Card */}
        <View style={styles.questionCard}>
          <MaterialIcons name="rocket-launch" size={48} color={C.secondary} style={styles.questionIcon} />
          <Text style={styles.questionText}>{qText}</Text>
        </View>

        {/* Choice Pods / Drag Drop Zone */}
        {isDragObjects ? (
          <View style={styles.dragDropContainer}>
            {/* The Collection Box / Basket */}
            <View style={[
              styles.dropZone, 
              { 
                borderColor: "#8B4513", 
                backgroundColor: "#FDF5E6", 
                borderStyle: "solid",
                borderWidth: 3,
                height: 160,
                position: 'relative'
              },
              basketCount >= (q?.interaction?.details?.targetCount || 0) && { borderColor: C.secondary, backgroundColor: "rgba(0, 106, 98, 0.05)" }
            ]}>
              <Text style={[styles.dropZoneText, { color: "#8B4513" }]}>
                Basket ({basketCount} / {q?.interaction?.details?.targetCount})
              </Text>
              
              {/* Emojis in the basket */}
              <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12, gap: 8, paddingHorizontal: 16}}>
                {Array.from({ length: basketCount }).map((_, i) => (
                  <TouchableOpacity 
                    key={`basket-${i}`} 
                    activeOpacity={0.7}
                    onPress={() => {
                      // Remove last item when clicked inside basket
                      const activeIndices = Object.keys(droppedItems).filter(k => droppedItems[Number(k)]).map(Number);
                      if (activeIndices.length > 0) {
                        const lastIdx = activeIndices[activeIndices.length - 1];
                        handleTapObject(lastIdx);
                      }
                    }}
                  >
                    <Text style={{fontSize: 42}}>{q?.interaction?.details?.objectEmoji}</Text>
                  </TouchableOpacity>
                ))}
                {basketCount === 0 && (
                  <Text style={{color: "#8B4513", fontStyle: "italic", opacity: 0.6, fontSize: 16}}>Tap items below to add them!</Text>
                )}
              </View>

              {/* Reset Button */}
              {basketCount > 0 && !showFeedback && (
                <TouchableOpacity 
                  onPress={handleResetBasket} 
                  style={{
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    backgroundColor: 'rgba(139, 69, 19, 0.1)', 
                    paddingVertical: 4, 
                    paddingHorizontal: 8, 
                    borderRadius: 8
                  }}
                >
                  <Text style={{color: '#8B4513', fontSize: 12, fontWeight: '700'}}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* The Item Pool */}
            <View style={{alignItems: 'center', marginVertical: 10}}>
              <Text style={{color: C.onSurfaceVariant, fontSize: 16, fontWeight: '600'}}>Tap to collect:</Text>
            </View>

            <View style={styles.draggableGrid}>
              {Array.from({ length: q?.interaction?.details?.draggablesCount || 0 }).map((_, idx) => {
                const isCollected = droppedItems[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => handleTapObject(idx)}
                    disabled={showFeedback}
                    style={[
                      styles.podBase,
                      {
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: isCollected ? 'rgba(0, 106, 98, 0.2)' : C.primary,
                        backgroundColor: isCollected ? 'rgba(0, 106, 98, 0.05)' : C.surfaceContainerLowest,
                        opacity: isCollected ? 0.3 : 1,
                        margin: 6
                      }
                    ]}
                  >
                    <Text style={{fontSize: 36}}>{q?.interaction?.details?.objectEmoji || "🍎"}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.optionsGrid}>
            {qOptions.map((opt: string, idx: number) => {
              const isSelected = idx === selectedOption;
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isThisCorrect = showFeedback && opt === qAnswer;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.podBase, getPodStyle(idx)]}
                  activeOpacity={0.8}
                  onPress={() => handleOptionPress(idx)}
                  disabled={showFeedback}
                >
                  <View style={styles.podLeft}>
                    <View style={[styles.letterCircle, getLetterStyle(idx)]}>
                      <Text style={[styles.letterText, (isSelected || isThisCorrect) && { color: C.white }]}>{letter}</Text>
                    </View>
                    <Text style={styles.podText}>{opt}</Text>
                  </View>
                  
                  {/* Check Indicator */}
                  {(isSelected || isThisCorrect) && (
                    <View style={[styles.checkIndicator, showFeedback && !isThisCorrect && { backgroundColor: C.onErrorContainer }]}>
                      <MaterialIcons name={showFeedback && !isThisCorrect ? "close" : "check"} size={16} color={C.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Feedback Message */}
        {showFeedback && (
          <View style={[styles.feedbackMsg, { backgroundColor: isCorrect ? C.tertiaryContainer : C.errorContainer }]}>
            <Text style={[styles.feedbackMsgText, { color: isCorrect ? C.secondary : C.onErrorContainer }]}>
              {isCorrect ? "Correct! Brilliant job! ⭐" : `Not quite! The correct answer is ${qAnswer} 💪`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        {!showFeedback ? (
          <TouchableOpacity 
            style={[styles.actionBtn, (selectedOption === null && !isDragObjects) && { opacity: 0.6 }]} 
            activeOpacity={0.8} 
            onPress={() => {
              if (isDragObjects) {
                // Check if basket hit target
                const target = q?.interaction?.details?.targetCount;
                const isDragCorrect = target && basketCount >= target;
                if (isDragCorrect) {
                  setShowFeedback(true);
                  setTotalCorrect(prev => prev + 1);
                } else {
                  setShowFeedback(true);
                  setIncorrectTracker(prev => [...prev, {
                    questionId: q._id,
                    questionText: qText,
                    userAnswer: `Dragged ${basketCount}`,
                    correctAnswer: `Target ${target || 0}`
                  }]);
                }

                const { triggered } = useBossBattleStore.getState().recordAnswer(
                  String(chapterId || "mock"),
                  String(subjectName || params.subjectName || "Maths"),
                  !!isDragCorrect
                );
                
                if (triggered) {
                  setBossTriggeredState(true);
                }
              } else {
                handleCheck();
              }
            }}
            disabled={(selectedOption === null && !isDragObjects) || (isDragObjects && basketCount === 0)}
          >
            <Text style={styles.actionBtnText}>Check Answer</Text>
            <MaterialIcons name="arrow-forward" size={24} color={C.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {currentQ < questions.length - 1 ? "Next Question" : "Finish 🚀"}
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color={C.white} />
          </TouchableOpacity>
        )}
      </View>

      {bossTriggeredState && (
        <BossEntranceOverlay
          subjectName={String(subjectName || params.subjectName || "Maths")}
          onStartBattle={() => {
            setBossTriggeredState(false);
            router.replace({
              pathname: "/practice/boss-battle",
              params: {
                chapterId: String(chapterId || "mock"),
                chapterName: String(chapterName || "the chapter"),
                subjectId: String(subjectId || ""),
                subjectName: String(subjectName || params.subjectName || "Maths"),
                resumeFrom: String(currentQ + 1),
                totalCorrect: String(totalCorrect),
                incorrectTracker: JSON.stringify(incorrectTracker),
                hasShownReward5: hasShownReward5 ? "true" : "false",
                hasShownReward10: hasShownReward10 ? "true" : "false",
                hasShownReward15: hasShownReward15 ? "true" : "false",
              } as any,
            });
          }}
        />
      )}
    </View>
  );
}

function BossEntranceOverlay({ subjectName, onStartBattle }: { subjectName: string; onStartBattle: () => void }) {
  // Map subject to boss details
  const subjectKey = subjectName.toLowerCase().replace(/\s+/g, "_");
  let bossName = "Math Monster";
  let bossIcon = "👹";
  
  if (subjectKey.includes("math")) {
    bossName = "Math Monster";
    bossIcon = "👹";
  } else if (subjectKey.includes("english") || subjectKey.includes("grammar")) {
    bossName = "Grammar Dragon";
    bossIcon = "🐉";
  } else if (subjectKey.includes("science")) {
    bossName = "Science Beast";
    bossIcon = "🦁";
  } else if (subjectKey.includes("read")) {
    bossName = "Book Guardian";
    bossIcon = "🦉";
  } else if (subjectKey.includes("moral") || subjectKey.includes("kind")) {
    bossName = "Kindness Guardian";
    bossIcon = "🦄";
  }

  // Animation values
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 400 });
    // Screen shake looping sequence
    shake.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 40 }),
        withTiming(8, { duration: 40 }),
        withTiming(-8, { duration: 40 }),
        withTiming(0, { duration: 40 })
      ),
      15, // Repeat 15 times
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: shake.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={["#0c0e3d", "#1c0d35", "#30007f"]}
        style={[styles.overlayContainer, { justifyContent: "center", alignItems: "center" }]}
      >
        {/* Floating particles background */}
        <View style={styles.particlesContainer}>
          {Array.from({ length: 15 }).map((_, i) => (
            <Text
              key={i}
              style={[
                styles.particleText,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: Math.random() * 20 + 20,
                  opacity: 0.15,
                },
              ]}
            >
              {["+", "-", "×", "÷", "📚", "🚀", "💡", "⭐"][i % 8]}
            </Text>
          ))}
        </View>

        <Reanimated.View style={[styles.bossEntranceCard, animatedStyle]}>
          <Text style={styles.alertText}>🚨 ALERT! BOSS APPROACHING! 🚨</Text>
          
          <View style={styles.bossAvatarCircle}>
            <Text style={styles.bossAvatarEmoji}>{bossIcon}</Text>
          </View>

          <Text style={styles.bossTitleText}>{bossName}</Text>
          <Text style={styles.bossSubtitleText}>HAS APPEARED!</Text>

          <View style={styles.bossHpMiniBar}>
            <View style={styles.bossHpMiniFill} />
          </View>
          <Text style={styles.bossHpMiniText}>HP: 1000 / 1000</Text>

          <TouchableOpacity style={styles.fightButton} activeOpacity={0.8} onPress={onStartBattle}>
            <Text style={styles.fightButtonText}>START BATTLE ⚔️</Text>
          </TouchableOpacity>
        </Reanimated.View>
      </LinearGradient>
    </View>
  );
}

import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },
  centered: {
    flex: 1,
    backgroundColor: C.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 18, color: C.onSurface, marginBottom: 20 },
  backBtnInline: { backgroundColor: C.primary, padding: 12, borderRadius: 20 },
  backBtnText: { color: C.white, fontWeight: "700" },
  
  // Backgrounds
  bgGlowTop: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: "rgba(0, 106, 98, 0.1)",
    borderRadius: 80,
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 240,
    height: 240,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    borderRadius: 120,
  },

  // Header
  header: {
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 64,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },

  // Progress
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "600",
    color: C.secondary,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: C.surfaceContainer,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.secondary,
    borderRadius: 6,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 32,
  },

  // Question Card
  questionCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 32,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  questionIcon: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 26,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
    lineHeight: 34,
  },

  // Choice Pods
  optionsGrid: {
    gap: 16,
  },
  podBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  podDefault: {
    backgroundColor: C.glassBg,
    borderColor: C.glassBorder,
  },
  podActive: {
    backgroundColor: C.secondaryContainer,
    borderColor: C.secondary,
    transform: [{ scale: 1.02 }],
  },
  podCorrect: {
    backgroundColor: C.tertiaryContainer,
    borderColor: C.secondary,
  },
  podWrong: {
    backgroundColor: C.errorContainer,
    borderColor: C.onErrorContainer,
  },
  podLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  letterDefault: {
    backgroundColor: C.surfaceVariant,
  },
  letterActive: {
    backgroundColor: C.primary,
  },
  letterCorrect: {
    backgroundColor: C.secondary,
  },
  letterWrong: {
    backgroundColor: C.onErrorContainer,
  },
  letterText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurfaceVariant,
  },
  podText: {
    fontSize: 18,
    fontWeight: "500",
    color: C.onSurface,
    flexShrink: 1,
  },
  checkIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.secondary,
    alignItems: "center",
    justifyContent: "center",
  },

  // Drag and Drop
  dragDropContainer: {
    gap: 24,
  },
  dropZone: {
    height: 120,
    borderWidth: 2,
    borderColor: C.onSurfaceVariant,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surfaceContainerLowest,
  },
  dropZoneText: {
    fontSize: 20,
    fontWeight: "700",
    color: C.onSurfaceVariant,
  },
  draggableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },

  feedbackMsg: {
    padding: 16,
    borderRadius: 12,
    marginTop: -8,
  },
  feedbackMsgText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  actionBtn: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: C.primary,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.white,
    letterSpacing: 0.5,
  },
  overlayContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  particleText: {
    position: "absolute",
    color: "#ffffff",
    fontWeight: "700",
  },
  bossEntranceCard: {
    backgroundColor: "rgba(20, 10, 40, 0.85)",
    borderWidth: 2,
    borderColor: "#ba1a1a",
    borderRadius: 24,
    padding: 32,
    width: "88%",
    alignItems: "center",
    shadowColor: "#ba1a1a",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  alertText: {
    color: "#ffdad6",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 24,
  },
  bossAvatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ba1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  bossAvatarEmoji: {
    fontSize: 64,
  },
  bossTitleText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "Quicksand",
  },
  bossSubtitleText: {
    color: "#ffdad6",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 24,
  },
  bossHpMiniBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  bossHpMiniFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ba1a1a",
  },
  bossHpMiniText: {
    color: "#ffdad6",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 32,
  },
  fightButton: {
    backgroundColor: "#ba1a1a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    shadowColor: "#ba1a1a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  fightButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
