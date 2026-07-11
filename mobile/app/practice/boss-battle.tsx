import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

import { useBossBattleStore, BossConfig, BossBattleQuestion } from "@/hooks/useBossBattleStore";
import { authApi } from "@/app/services/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DamagePopup {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
}

export default function BossBattleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const {
    currentBoss,
    bossHp,
    playerEnergy,
    battleQuestions,
    currentQuestionIndex,
    battleStatus,
    startBattle,
    submitBattleAnswer,
    retryBattle,
    resetBattle,
  } = useBossBattleStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [userWasCorrect, setUserWasCorrect] = useState(false);
  
  // Custom Visual Effects States
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [isProcessingReward, setIsProcessingReward] = useState(false);

  // Animated values for layout
  const shakeVal = useSharedValue(0);
  const bossScale = useSharedValue(1);
  const playerFlash = useSharedValue(0);
  const victoryScale = useSharedValue(0);
  const defeatScale = useSharedValue(0);

  // Initialise Boss if not loaded
  useEffect(() => {
    const subject = String(params.subjectName || "Maths");
    const lessonId = String(params.chapterId || "mock");
    useBossBattleStore.getState().triggerBoss(subject, lessonId);
  }, []);

  // Update loop for particles
  useEffect(() => {
    let animFrame: number;
    const updateParticles = () => {
      // Update sparks
      setSparks((prevSparks) => {
        if (prevSparks.length === 0) return prevSparks;
        return prevSparks
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.1, // gravity
          }))
          .filter((s) => s.y < SCREEN_HEIGHT && s.x > 0 && s.x < SCREEN_WIDTH);
      });

      // Update confetti
      setConfetti((prevConfetti) => {
        if (prevConfetti.length === 0) return prevConfetti;
        return prevConfetti
          .map((c) => ({
            ...c,
            y: c.y + c.vy,
            rotation: c.rotation + 2,
          }))
          .filter((c) => c.y < SCREEN_HEIGHT);
      });

      animFrame = requestAnimationFrame(updateParticles);
    };

    animFrame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Handle battle state transitions
  useEffect(() => {
    if (battleStatus === "victory") {
      victoryScale.value = withTiming(1, { duration: 600 });
      triggerConfetti();
      handleRewardClaims();
    } else if (battleStatus === "failure") {
      defeatScale.value = withTiming(1, { duration: 600 });
    }
  }, [battleStatus]);

  // Visual Triggers
  const triggerShake = () => {
    shakeVal.value = withSequence(
      withTiming(-12, { duration: 40 }),
      withTiming(12, { duration: 40 }),
      withTiming(-12, { duration: 40 }),
      withTiming(12, { duration: 40 }),
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  const triggerBossHitAnimation = () => {
    bossScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    spawnSparks();
  };

  const triggerPlayerFlash = () => {
    playerFlash.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );
  };

  const spawnSparks = () => {
    const colors = ["#ff5252", "#ffeb3b", "#e91e63", "#00e676", "#2979ff"];
    const newSparks: Spark[] = Array.from({ length: 25 }).map((_, i) => {
      const angle = (i / 25) * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      return {
        id: Date.now() + i,
        x: SCREEN_WIDTH / 2,
        y: 180,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
      };
    });
    setSparks((prev) => [...prev, ...newSparks]);
  };

  const triggerConfetti = () => {
    const colors = ["#ffeb3b", "#e91e63", "#00e676", "#2979ff", "#ff9100", "#ff007f", "#00e5ff"];
    const newConfetti: Confetti[] = Array.from({ length: 60 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * SCREEN_WIDTH,
      y: -50 - Math.random() * 100,
      vy: Math.random() * 4 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      rotation: Math.random() * 360,
    }));
    setConfetti(newConfetti);
  };

  const spawnDamagePopup = (text: string, color: string, target: "boss" | "player") => {
    const popup: DamagePopup = {
      id: Date.now(),
      text,
      color,
      x: SCREEN_WIDTH / 2 + (Math.random() * 40 - 20),
      y: target === "boss" ? 150 : 260,
    };
    setDamagePopups((prev) => [...prev, popup]);
    
    // Clear popup after 1s
    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 1000);
  };

  const handleRewardClaims = async () => {
    if (!currentBoss || isProcessingReward) return;
    setIsProcessingReward(true);

    try {
      // Award +1000 Coins, +500 Fuel (equivalent to XP)
      const currentFuel = await AsyncStorage.getItem("nrscholar_fuel");
      const currentCoins = await AsyncStorage.getItem("nrscholar_coins");

      const parsedFuel = currentFuel ? Number(currentFuel) : 350;
      const parsedCoins = currentCoins ? Number(currentCoins) : 420;

      const newFuel = parsedFuel + (currentBoss.rewardXP || 500);
      const newCoins = parsedCoins + (currentBoss.rewardCoins || 1000);
      const newLevel = Math.max(1, Math.floor(newFuel / 500) + 1);

      await AsyncStorage.setItem("nrscholar_fuel", String(newFuel));
      await AsyncStorage.setItem("nrscholar_coins", String(newCoins));
      await AsyncStorage.setItem("nrscholar_level", String(newLevel));

      // Award badge
      const storedBadges = await AsyncStorage.getItem("nrscholar_badges");
      const badgesList = storedBadges ? JSON.parse(storedBadges) : [];
      if (!badgesList.includes(currentBoss.badge)) {
        badgesList.push(currentBoss.badge);
        await AsyncStorage.setItem("nrscholar_badges", JSON.stringify(badgesList));
      }

      // Sync with database
      await authApi.updateStats({ coins: newCoins, fuel: newFuel, level: newLevel });
    } catch (e) {
      console.error("Failed to update stats on boss victory:", e);
    } finally {
      setIsProcessingReward(false);
    }
  };

  // Submit Answer flow
  const handleOptionPress = (option: string) => {
    if (showAnswerFeedback) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentBoss) return;

    const currentQ = battleQuestions[currentQuestionIndex];
    const isAnsCorrect = selectedOption === currentQ.answer;

    setCorrectAnswer(currentQ.answer);
    setUserWasCorrect(isAnsCorrect);
    setShowAnswerFeedback(true);

    // Run Zustand action
    const result = submitBattleAnswer(selectedOption);

    if (isAnsCorrect) {
      triggerBossHitAnimation();
      spawnDamagePopup(`-200 HP`, "#00e676", "boss");
    } else {
      triggerShake();
      triggerPlayerFlash();
      spawnDamagePopup(`-${currentBoss.attackDamage} Energy`, "#ff1744", "player");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswerFeedback(false);
    setCorrectAnswer(null);
  };

  const handleContinueJourney = () => {
    resetBattle();
    
    // Navigate back to practice session with resume params
    router.replace({
      pathname: "/practice/session",
      params: {
        chapterId: String(params.chapterId || "mock"),
        chapterName: String(params.chapterName || "the chapter"),
        subjectId: String(params.subjectId || ""),
        subjectName: String(params.subjectName || "Maths"),
        resumeFrom: String(params.resumeFrom || "0"),
        totalCorrect: String(params.totalCorrect || "0"),
        incorrectTracker: String(params.incorrectTracker || "[]"),
        hasShownReward5: String(params.hasShownReward5 || "false"),
        hasShownReward10: String(params.hasShownReward10 || "false"),
        hasShownReward15: String(params.hasShownReward15 || "false"),
      } as any,
    });
  };

  const handleQuitBattle = () => {
    resetBattle();
    router.replace({
      pathname: "/practice/session",
      params: {
        chapterId: String(params.chapterId || "mock"),
        chapterName: String(params.chapterName || "the chapter"),
        subjectId: String(params.subjectId || ""),
        subjectName: String(params.subjectName || "Maths"),
        resumeFrom: String(params.resumeFrom || "0"),
        totalCorrect: String(params.totalCorrect || "0"),
        incorrectTracker: String(params.incorrectTracker || "[]"),
        hasShownReward5: String(params.hasShownReward5 || "false"),
        hasShownReward10: String(params.hasShownReward10 || "false"),
        hasShownReward15: String(params.hasShownReward15 || "false"),
      } as any,
    });
  };

  if (!currentBoss) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Summoning the Boss...</Text>
      </View>
    );
  }

  // Animation style mappings
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeVal.value }],
  }));

  const bossAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bossScale.value }],
  }));

  const playerCardAnimatedStyle = useAnimatedStyle(() => {
    const borderCol = playerFlash.value === 1 ? "#ff1744" : "rgba(255, 255, 255, 0.15)";
    const bgCol = playerFlash.value === 1 ? "rgba(255, 23, 68, 0.25)" : "rgba(255, 255, 255, 0.08)";
    return {
      borderColor: borderCol,
      backgroundColor: bgCol,
    };
  });

  const victoryModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: victoryScale.value }],
    opacity: victoryScale.value,
  }));

  const defeatModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: defeatScale.value }],
    opacity: defeatScale.value,
  }));

  const currentQ = battleQuestions[currentQuestionIndex];

  return (
    <View style={styles.root}>
      {/* Background space elements */}
      <LinearGradient
        colors={["#0a0826", "#1c0d38", "#03010b"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating stars/symbols */}
      <View style={styles.ambientSymbolsContainer}>
        {["+", "−", "×", "÷", "?", "✏️", "📖", "🐉", "👹", "⭐"].map((char, index) => (
          <Text
            key={index}
            style={[
              styles.ambientChar,
              {
                left: `${10 + (index * 8) % 80}%`,
                top: `${15 + (index * 12) % 70}%`,
                fontSize: index % 2 === 0 ? 24 : 16,
                opacity: 0.1,
              },
            ]}
          >
            {char}
          </Text>
        ))}
      </View>

      <Animated.View style={[styles.mainWrapper, containerAnimatedStyle]}>
        
        {/* Header bar */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity style={styles.quitBtn} onPress={handleQuitBattle}>
            <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.quitBtnText}>Escape</Text>
          </TouchableOpacity>
          <Text style={styles.battleTitleText}>⚔️ BOSS BATTLE ⚔️</Text>
          <View style={{ width: 60 }} />
        </View>

        {battleStatus === "intro" ? (
          /* Intro Screen UI */
          <View style={styles.introScreen}>
            <View style={styles.introCard}>
              <Text style={styles.incomingText}>INCOMING CHALLENGE</Text>
              
              <View style={styles.introAvatarCircle}>
                <Text style={styles.introAvatarEmoji}>{currentBoss.icon}</Text>
              </View>

              <Text style={styles.introBossName}>{currentBoss.name}</Text>
              <Text style={styles.introSubjectText}>
                Subject Guardian of {params.subjectName || "Maths"}
              </Text>

              <View style={styles.rewardsPreview}>
                <Text style={styles.rewardsPreviewTitle}>VICTORY REWARDS</Text>
                <View style={styles.rewardsRow}>
                  <View style={styles.rewardTag}>
                    <Text style={styles.rewardTagEmoji}>🪙</Text>
                    <Text style={styles.rewardTagText}>+{currentBoss.rewardCoins}</Text>
                  </View>
                  <View style={styles.rewardTag}>
                    <Text style={styles.rewardTagEmoji}>⚡</Text>
                    <Text style={styles.rewardTagText}>+{currentBoss.rewardXP} XP</Text>
                  </View>
                </View>
                <View style={styles.badgeRewardContainer}>
                  <Text style={styles.badgeRewardEmoji}>🏆</Text>
                  <Text style={styles.badgeRewardText}>{currentBoss.badge} Badge</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.startFightBtn} activeOpacity={0.8} onPress={startBattle}>
                <Text style={styles.startFightBtnText}>ENTER BATTLE ⚔️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Battle Arena UI */
          <View style={styles.battleArena}>
            
            {/* Boss Aura / Avatar */}
            <View style={styles.bossSection}>
              <Animated.View style={[styles.bossAvatarOuter, bossAnimatedStyle]}>
                <Text style={styles.bossEmoji}>{currentBoss.icon}</Text>
              </Animated.View>
              
              <View style={styles.bossStatsBox}>
                <Text style={styles.bossNameText}>{currentBoss.name}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(bossHp / 1000) * 100}%`, backgroundColor: "#ff1744" }]} />
                  </View>
                  <Text style={styles.barValueText}>HP: {bossHp} / 1000</Text>
                </View>
              </View>
            </View>

            {/* Player Stats / Energy */}
            <View style={styles.playerSection}>
              <Animated.View style={[styles.playerCard, playerCardAnimatedStyle]}>
                <Text style={styles.playerName}>⚡ YOUR ENERGY</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${playerEnergy}%`,
                          backgroundColor: playerEnergy > 50 ? "#00e676" : playerEnergy > 20 ? "#ff9100" : "#ff1744",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValueText}>{playerEnergy} / 100</Text>
                </View>
              </Animated.View>
            </View>

            {/* Current Battle Question Card */}
            {currentQ && (
              <View style={styles.questionSection}>
                <View style={styles.questionCard}>
                  <Text style={styles.questionIndexLabel}>QUESTION {currentQuestionIndex + 1}</Text>
                  <Text style={styles.questionText}>{currentQ.question}</Text>
                </View>

                {/* Question Options */}
                <View style={styles.optionsGrid}>
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrectAns = correctAnswer === option;
                    const isWrongAns = isSelected && correctAnswer !== null && correctAnswer !== option;
                    
                    let buttonStyle = styles.optionBtnDefault;
                    let textStyle = styles.optionTextDefault;

                    if (showAnswerFeedback) {
                      if (isCorrectAns) {
                        buttonStyle = styles.optionBtnCorrect;
                        textStyle = styles.optionTextCorrect;
                      } else if (isWrongAns) {
                        buttonStyle = styles.optionBtnWrong;
                        textStyle = styles.optionTextWrong;
                      } else {
                        buttonStyle = styles.optionBtnDisabled;
                        textStyle = styles.optionTextDisabled;
                      }
                    } else if (isSelected) {
                      buttonStyle = styles.optionBtnSelected;
                      textStyle = styles.optionTextSelected;
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.optionBtn, buttonStyle]}
                        activeOpacity={0.8}
                        onPress={() => handleOptionPress(option)}
                        disabled={showAnswerFeedback}
                      >
                        <Text style={[styles.optionText, textStyle]}>{option}</Text>
                        {showAnswerFeedback && isCorrectAns && (
                          <MaterialIcons name="check-circle" size={24} color="#00e676" />
                        )}
                        {showAnswerFeedback && isWrongAns && (
                          <MaterialIcons name="cancel" size={24} color="#ff1744" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Sticky Action Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              {!showAnswerFeedback ? (
                <TouchableOpacity
                  style={[styles.actionBtn, !selectedOption && { opacity: 0.6 }]}
                  disabled={!selectedOption}
                  activeOpacity={0.8}
                  onPress={handleCheckAnswer}
                >
                  <Text style={styles.actionBtnText}>CAST SPELL ⚡</Text>
                  <MaterialIcons name="bolt" size={24} color="#ffffff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={handleNextQuestion}>
                  <Text style={styles.actionBtnText}>NEXT SPELL 🔮</Text>
                  <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Animated.View>

      {damagePopups.map((pop) => (
        <Animated.View
          key={pop.id}
          style={[styles.damagePopupCard, { left: pop.x, top: pop.y }]}
        >
          <Text style={[styles.damagePopupText, { color: pop.color }]}>{pop.text}</Text>
        </Animated.View>
      ))}

      {/* Particle Sparks */}
      {sparks.map((spark) => (
        <View
          key={spark.id}
          style={[
            styles.sparkCircle,
            {
              left: spark.x,
              top: spark.y,
              width: spark.size,
              height: spark.size,
              borderRadius: spark.size / 2,
              backgroundColor: spark.color,
            },
          ]}
        />
      ))}

      {/* Confetti Rain */}
      {confetti.map((c) => (
        <View
          key={c.id}
          style={[
            styles.confettiPiece,
            {
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size * 1.5,
              backgroundColor: c.color,
              transform: [{ rotate: `${c.rotation}deg` }],
            },
          ]}
        />
      ))}

      {/* Victory Overlay Modal */}
      {battleStatus === "victory" && (
        <View style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={["rgba(10, 4, 30, 0.95)", "rgba(20, 3, 50, 0.98)"]}
            style={[styles.modalScreen, { justifyContent: "center", alignItems: "center" }]}
          >
            <Animated.View style={[styles.victoryCard, victoryModalStyle]}>
              <Text style={styles.victoryHeaderText}>🎉 VICTORY! 🎉</Text>
              <Text style={styles.victoryBossEscaped}>
                {currentBoss.name} has been defeated!
              </Text>

              <View style={styles.victoryBadgeCircle}>
                <Text style={styles.victoryBadgeEmoji}>🏆</Text>
              </View>
              <Text style={styles.badgeNameText}>{currentBoss.badge} Awarded!</Text>

              <View style={styles.victoryRewardsContainer}>
                <View style={styles.victoryRewardItem}>
                  <Text style={styles.victoryRewardEmoji}>🪙</Text>
                  <Text style={styles.victoryRewardVal}>+1000 Coins</Text>
                </View>
                <View style={styles.victoryRewardItem}>
                  <Text style={styles.victoryRewardEmoji}>⚡</Text>
                  <Text style={styles.victoryRewardVal}>+500 XP (Fuel)</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.victoryContinueBtn} activeOpacity={0.8} onPress={handleContinueJourney}>
                <Text style={styles.victoryContinueBtnText}>CONTINUE JOURNEY 🚀</Text>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </View>
      )}

      {/* Defeat Overlay Modal */}
      {battleStatus === "failure" && (
        <View style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={["rgba(30, 4, 10, 0.95)", "rgba(45, 2, 20, 0.98)"]}
            style={[styles.modalScreen, { justifyContent: "center", alignItems: "center" }]}
          >
            <Animated.View style={[styles.defeatCard, defeatModalStyle]}>
              <Text style={styles.defeatHeaderText}>DEFEATED 😢</Text>
              <Text style={styles.defeatBossEscaped}>
                {currentBoss.name} has escaped back to their lair!
              </Text>

              <View style={styles.defeatEmojiCircle}>
                <Text style={styles.defeatEmoji}>{currentBoss.icon}</Text>
              </View>

              <Text style={styles.defeatInstructions}>
                Refill your energy and challenge the Subject Boss again!
              </Text>

              <View style={styles.defeatButtonsContainer}>
                <TouchableOpacity style={styles.retryBtn} activeOpacity={0.8} onPress={retryBattle}>
                  <Text style={styles.retryBtnText}>RETRY BATTLE ⚔️</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.returnBtn} activeOpacity={0.8} onPress={handleContinueJourney}>
                  <Text style={styles.returnBtnText}>RETURN TO LESSON 📖</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0826",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0a0826",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    fontFamily: "Quicksand",
  },
  mainWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  quitBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  quitBtnText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "700",
  },
  battleTitleText: {
    color: "#ffeb3b",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },
  ambientSymbolsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  ambientChar: {
    position: "absolute",
    color: "#ffffff",
    fontWeight: "700",
  },

  /* Intro Screen Styles */
  introScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  introCard: {
    backgroundColor: "rgba(25, 15, 55, 0.85)",
    borderWidth: 2,
    borderColor: "#ff9100",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    width: "100%",
    shadowColor: "#ff9100",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  incomingText: {
    color: "#ff9100",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 20,
  },
  introAvatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 145, 0, 0.15)",
    borderWidth: 2,
    borderColor: "#ff9100",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#ff9100",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  introAvatarEmoji: {
    fontSize: 64,
  },
  introBossName: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    fontFamily: "Quicksand",
  },
  introSubjectText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 28,
  },
  rewardsPreview: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  rewardsPreviewTitle: {
    color: "#ffeb3b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  rewardsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  rewardTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  rewardTagEmoji: {
    fontSize: 14,
  },
  rewardTagText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  badgeRewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 235, 59, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 235, 59, 0.4)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  badgeRewardEmoji: {
    fontSize: 16,
  },
  badgeRewardText: {
    color: "#ffeb3b",
    fontSize: 13,
    fontWeight: "700",
  },
  startFightBtn: {
    backgroundColor: "#ff9100",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#ff9100",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  startFightBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* Battle Arena Styles */
  battleArena: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  bossSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 23, 68, 0.2)",
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    gap: 16,
  },
  bossAvatarOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 23, 68, 0.15)",
    borderWidth: 2,
    borderColor: "#ff1744",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff1744",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  bossEmoji: {
    fontSize: 42,
  },
  bossStatsBox: {
    flex: 1,
  },
  bossNameText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  playerSection: {
    marginTop: 12,
  },
  playerCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
  },
  playerName: {
    color: "#00e676",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 1,
  },
  progressContainer: {
    width: "100%",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  barValueText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    fontWeight: "700",
    alignSelf: "flex-end",
  },
  questionSection: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    marginVertical: 16,
  },
  questionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  questionIndexLabel: {
    color: "#ffeb3b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },
  questionText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  optionsGrid: {
    gap: 12,
  },
  optionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
  },
  optionBtnDefault: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  optionBtnSelected: {
    backgroundColor: "rgba(255, 235, 59, 0.12)",
    borderColor: "#ffeb3b",
  },
  optionBtnCorrect: {
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    borderColor: "#00e676",
  },
  optionBtnWrong: {
    backgroundColor: "rgba(255, 23, 68, 0.15)",
    borderColor: "#ff1744",
  },
  optionBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    opacity: 0.4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  optionTextDefault: {
    color: "#ffffff",
  },
  optionTextSelected: {
    color: "#ffeb3b",
    fontWeight: "700",
  },
  optionTextCorrect: {
    color: "#00e676",
    fontWeight: "700",
  },
  optionTextWrong: {
    color: "#ff1744",
    fontWeight: "700",
  },
  optionTextDisabled: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  footer: {
    width: "100%",
  },
  actionBtn: {
    backgroundColor: "#e91e63",
    paddingVertical: 16,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* Damage popup indicator */
  damagePopupCard: {
    position: "absolute",
    alignItems: "center",
    zIndex: 99,
  },
  damagePopupText: {
    fontSize: 24,
    fontWeight: "900",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  /* Spark shapes */
  sparkCircle: {
    position: "absolute",
    zIndex: 98,
  },

  /* Confetti shapes */
  confettiPiece: {
    position: "absolute",
    zIndex: 98,
  },

  /* Modal screen container */
  modalScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  /* Victory Card Styles */
  victoryCard: {
    backgroundColor: "rgba(10, 30, 20, 0.9)",
    borderWidth: 2.5,
    borderColor: "#00e676",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    width: "86%",
    shadowColor: "#00e676",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  victoryHeaderText: {
    color: "#ffeb3b",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  victoryBossEscaped: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
  },
  victoryBadgeCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    borderWidth: 2,
    borderColor: "#00e676",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  victoryBadgeEmoji: {
    fontSize: 54,
  },
  badgeNameText: {
    color: "#00e676",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
  },
  victoryRewardsContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  victoryRewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  victoryRewardEmoji: {
    fontSize: 20,
  },
  victoryRewardVal: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  victoryContinueBtn: {
    backgroundColor: "#00e676",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#00e676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  victoryContinueBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* Defeat Card Styles */
  defeatCard: {
    backgroundColor: "rgba(35, 10, 15, 0.9)",
    borderWidth: 2.5,
    borderColor: "#ff1744",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    width: "86%",
    shadowColor: "#ff1744",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  defeatHeaderText: {
    color: "#ff1744",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  defeatBossEscaped: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  defeatEmojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 23, 68, 0.15)",
    borderWidth: 2,
    borderColor: "#ff1744",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  defeatEmoji: {
    fontSize: 50,
  },
  defeatInstructions: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 32,
  },
  defeatButtonsContainer: {
    width: "100%",
    gap: 12,
  },
  retryBtn: {
    backgroundColor: "#ff1744",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#ff1744",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  retryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  returnBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
  },
  returnBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
