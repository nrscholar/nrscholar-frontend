import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  background: "#f7f9fb",
  white: "#ffffff",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  orange: "#ff9f43",
  pink: "#ff6b6b",
  purple: "#8e44ad",
};

interface Reward {
  type: string;
  value: string;
  icon: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  color: string;
}

const REWARDS_POOL: Reward[] = [
  { type: "Coins", value: "🪙 100 Coins", icon: "monetization-on", rarity: "Common", color: "#ffd700" },
  { type: "XP Boost", value: "⭐ Double XP Boost (1 Hr)", icon: "flash-on", rarity: "Rare", color: "#2addcd" },
  { type: "Badge", value: "🏅 Sabarmati Riverfront Badge", icon: "workspace-premium", rarity: "Rare", color: "#ff6b6b" },
  { type: "Avatar Item", value: "🎨 Explorer Hat Item", icon: "palette", rarity: "Epic", color: "#8e44ad" },
  { type: "Collectible Card", value: "🧩 Kite Festival Card", icon: "style", rarity: "Legendary", color: "#ff9f43" },
  { type: "Fuel Boost", value: "🚂 +150 Fuel Boost", icon: "bolt", rarity: "Legendary", color: "#141779" },
];

export default function LearningAdventure() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Practice States
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnsweredCorrect, setIsAnsweredCorrect] = useState<boolean | null>(null);
  
  // Animation Scales
  const rewardScale = useRef(new Animated.Value(0)).current;
  const chestScale = useRef(new Animated.Value(1)).current;

  // Mystery Box Modal
  const [mysteryBoxVisible, setMysteryBoxVisible] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState<Reward | null>(null);

  const handleOptionPress = (option: number) => {
    setSelectedOption(option);
    if (option === 5) {
      setIsAnsweredCorrect(true);
      setCorrectAnswers((prev) => {
        const val = prev + 1;
        // Trigger mystery box at 5 correct answers (or simulation trigger for demo)
        if (val === 2) {
          setTimeout(() => {
            setMysteryBoxVisible(true);
          }, 1500);
        }
        return val;
      });

      // Animate Reward Pop-up
      Animated.spring(rewardScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      setIsAnsweredCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnsweredCorrect(null);
    rewardScale.setValue(0);
  };

  const handleOpenChest = () => {
    // Shaking / Scale animation before open
    Animated.sequence([
      Animated.timing(chestScale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(chestScale, { toValue: 0.9, duration: 150, useNativeDriver: true }),
      Animated.timing(chestScale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(chestScale, { toValue: 1.0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      // Pick random reward
      const item = REWARDS_POOL[Math.floor(Math.random() * REWARDS_POOL.length)];
      setUnlockedReward(item);
      setBoxOpened(true);
    });
  };

  const handleCloseMysteryBox = () => {
    setMysteryBoxVisible(false);
    setBoxOpened(false);
    setUnlockedReward(null);
    setCorrectAnswers(0);
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={C.primary} />
          </TouchableOpacity>
          <View style={styles.progressCounterWrap}>
            <Text style={styles.progressCounterTitle}>Ahmedabad Adventure</Text>
            <Text style={styles.progressStreak}>🔥 Streak: 7 Days</Text>
          </View>
          <View style={styles.statsBadge}>
            <Text style={styles.statsBadgeText}>🪙 420</Text>
          </View>
        </View>
        
        {/* Step indicator */}
        <View style={styles.stepTrack}>
          <View style={[styles.stepFill, { width: `${(correctAnswers / 5) * 100 || 20}%` }]} />
        </View>
      </View>

      {/* Main Question Arena */}
      <View style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>MATH QUEST</Text>
          <Text style={styles.questionTitle}>How many apples are there?</Text>

          {/* Visual Question Area */}
          <View style={styles.visualQuestBox}>
            <View style={styles.appleGroup}>
              <Text style={styles.appleEmoji}>🍎🍎</Text>
            </View>
            <Text style={styles.plusSymbol}>+</Text>
            <View style={styles.appleGroup}>
              <Text style={styles.appleEmoji}>🍎🍎🍎</Text>
            </View>
          </View>

          {/* Options */}
          <View style={styles.optionsWrap}>
            {[4, 5, 6].map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === 5;
              let btnStyle: any = styles.optionBtn;
              let txtStyle: any = styles.optionText;

              if (isSelected) {
                if (isCorrect) {
                  btnStyle = [styles.optionBtn, styles.optionCorrect];
                  txtStyle = [styles.optionText, styles.textWhite];
                } else {
                  btnStyle = [styles.optionBtn, styles.optionWrong];
                  txtStyle = [styles.optionText, styles.textWhite];
                }
              }

              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  style={btnStyle}
                  onPress={() => handleOptionPress(opt)}
                  disabled={selectedOption !== null}
                >
                  <Text style={txtStyle}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Feedback Banner */}
        {selectedOption !== null && (
          <View style={styles.feedbackBanner}>
            <View style={styles.feedbackInfo}>
              <MaterialIcons
                name={isAnsweredCorrect ? "check-circle" : "error"}
                size={28}
                color={isAnsweredCorrect ? C.secondary : C.pink}
              />
              <Text style={[styles.feedbackTitle, { color: isAnsweredCorrect ? C.secondary : C.pink }]}>
                {isAnsweredCorrect ? "Awesome Job! Correct!" : "Oops, let's try again!"}
              </Text>
            </View>

            {/* Answer Reward popups */}
            {isAnsweredCorrect && (
              <Animated.View
                style={[
                  styles.rewardPopup,
                  {
                    transform: [{ scale: rewardScale }],
                  },
                ]}
              >
                <View style={styles.rewardBubble}>
                  <Text style={styles.rewardBubbleText}>+10 XP</Text>
                </View>
                <View style={[styles.rewardBubble, { backgroundColor: "#ffd700" }]}>
                  <Text style={styles.rewardBubbleText}>+5 Coins</Text>
                </View>
                <View style={[styles.rewardBubble, { backgroundColor: C.secondaryContainer }]}>
                  <Text style={[styles.rewardBubbleText, { color: C.onSecondaryContainer }]}>+20 Fuel</Text>
                </View>
              </Animated.View>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
              <Text style={styles.nextBtnText}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={18} color={C.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── MYSTERY BOX MODAL ── */}
      <Modal
        visible={mysteryBoxVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMysteryBox}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["rgba(20, 23, 121, 0.96)", "rgba(8, 9, 39, 0.98)"]}
            style={styles.modalGradient}
          >
            {!boxOpened ? (
              <View style={styles.boxWaitContainer}>
                <Text style={styles.mysteryBoxTitle}>🎁 MYSTERY BOX UNLOCKED!</Text>
                <Text style={styles.mysteryBoxSubtitle}>
                  You answered 5 questions correctly! Tap to open your mystery chest!
                </Text>

                <Animated.View style={{ transform: [{ scale: chestScale }] }}>
                  <TouchableOpacity
                    style={styles.chestImageWrap}
                    onPress={handleOpenChest}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA" }}
                      style={styles.chestImage}
                    />
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.tapText}>TAP TO REVEAL REWARDS</Text>
              </View>
            ) : (
              <View style={styles.boxOpenContainer}>
                <MaterialIcons name="stars" size={64} color="#ffd700" style={styles.sparkleIcon} />
                <Text style={styles.rewardRarityText}>
                  {unlockedReward?.rarity} REWARD!
                </Text>
                
                <View style={[styles.rewardRevealCard, { borderColor: unlockedReward?.color }]}>
                  <MaterialIcons
                    name={unlockedReward?.icon as any}
                    size={64}
                    color={unlockedReward?.color}
                  />
                  <Text style={styles.rewardRevealValue}>{unlockedReward?.value}</Text>
                </View>

                <TouchableOpacity
                  style={styles.claimRewardBtn}
                  onPress={handleCloseMysteryBox}
                >
                  <Text style={styles.claimRewardBtnText}>Claim Reward</Text>
                  <MaterialIcons name="done-all" size={20} color={C.white} />
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    backgroundColor: C.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#f0f0f0",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCounterWrap: {
    alignItems: "center",
  },
  progressCounterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
  },
  progressStreak: {
    fontSize: 11,
    fontWeight: "600",
    color: C.orange,
  },
  statsBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsBadgeText: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  stepTrack: {
    height: 8,
    backgroundColor: "rgba(20, 23, 121, 0.1)",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  stepFill: {
    height: "100%",
    backgroundColor: C.secondary,
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  questionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.orange,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  visualQuestBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(236, 238, 240, 0.4)",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  appleGroup: {
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  appleEmoji: {
    fontSize: 28,
  },
  plusSymbol: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    marginHorizontal: 16,
  },
  optionsWrap: {
    gap: 12,
  },
  optionBtn: {
    backgroundColor: "rgba(236, 238, 240, 0.5)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  optionCorrect: {
    backgroundColor: C.secondary,
    borderColor: C.secondary,
  },
  optionWrong: {
    backgroundColor: C.pink,
    borderColor: C.pink,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },
  textWhite: {
    color: C.white,
  },
  feedbackBanner: {
    marginTop: 20,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    gap: 16,
  },
  feedbackInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  rewardPopup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rewardBubble: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardBubbleText: {
    color: C.white,
    fontWeight: "700",
    fontSize: 12,
  },
  nextBtn: {
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 6,
  },
  nextBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  boxWaitContainer: {
    alignItems: "center",
    gap: 16,
  },
  mysteryBoxTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffd700",
    textAlign: "center",
  },
  mysteryBoxSubtitle: {
    fontSize: 14,
    color: C.white,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  chestImageWrap: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  chestImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  tapText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#57fae9",
    letterSpacing: 2,
  },
  boxOpenContainer: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  sparkleIcon: {
    marginBottom: 12,
  },
  rewardRarityText: {
    fontSize: 24,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 1,
  },
  rewardRevealCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 280,
  },
  rewardRevealValue: {
    color: C.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  claimRewardBtn: {
    backgroundColor: C.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    marginTop: 20,
  },
  claimRewardBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
