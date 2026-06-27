import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixed: "#57fae9",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  white: "#ffffff",
  purple: "#30007f",
  gold: "#FFD700",
  glassBg: "rgba(255, 255, 255, 0.1)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
};

export default function RewardScreenMysteryBox() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Extract navigation tracking parameters to pass them back
  const { chapterId, chapterName, resumeIndex, totalCorrect, incorrectTracker } = params;

  const [revealed, setRevealed] = useState(false);
  
  // Animated Values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Float animation for the card
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Pulse animation for the "Tap to Reveal" text
  useEffect(() => {
    if (!revealed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [pulseAnim, revealed]);

  // Particle simulation (simple random elements)
  const particles = useRef(
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * (SCREEN_HEIGHT * 0.7) + 50,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 2000,
    }))
  ).current;

  const triggerReveal = () => {
    if (revealed) {
      // If already revealed, "CLAIM REWARD" acts as continue/resume
      handleClaim();
      return;
    }

    // Flip and scale animation
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setRevealed(true);
    });
  };

  const handleClaim = () => {
    // Navigate back to the practice session resuming from the next index
    router.replace({
      pathname: "/practice/session",
      params: {
        ...params,
        resumeFrom: String(resumeIndex || "5"),
      } as any,
    });
  };

  // Interpolate rotation for 3D flip card
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#30007f", "#141779"]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Decorative Floating Particles */}
      {particles.map((p) => (
        <View
          key={p.id}
          style={[
            styles.particle,
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            },
          ]}
        />
      ))}

      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.title}>Amazing Job!</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Main Mystery Box Card Area */}
      <View style={styles.main}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { translateY: floatAnim },
                { rotateY: spin },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={triggerReveal}
            style={styles.cardTouch}
          >
            {!revealed ? (
              // FRONT OF CARD: Mystery Box
              <LinearGradient
                colors={["#cebdff", "#2d328f", "#471ba5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardInnerFront}
              >
                <View style={styles.questionCircle}>
                  <MaterialIcons name="help" size={80} color={C.secondaryFixed} />
                </View>
                
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Text style={styles.tapToRevealText}>TAP TO REVEAL</Text>
                </Animated.View>

                {/* Corner Star Accents */}
                <MaterialCommunityIcons name="star" size={32} color={C.secondaryFixed} style={styles.starTopLeft} />
                <MaterialCommunityIcons name="star" size={32} color={C.secondaryFixed} style={styles.starBottomRight} />
              </LinearGradient>
            ) : (
              // BACK OF CARD: Revealed Reward
              <View style={styles.cardInnerBack}>
                <View style={styles.revealedIconCircle}>
                  <MaterialIcons name="pets" size={90} color={C.secondaryFixed} />
                </View>
                <Text style={styles.rewardTier}>LEGENDARY PET!</Text>
                <Text style={styles.rewardName}>Cosmic Dragon</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer Area */}
      <View style={styles.footer}>
        {!revealed ? (
          <>
            <Text style={styles.possibleRewardsTitle}>Possible Rewards</Text>
            
            <View style={styles.rewardsRow}>
              {/* Reward 1 */}
              <View style={styles.rewardCard}>
                <View style={[styles.rewardIconBg, { backgroundColor: "#fbc02d" }]}>
                  <MaterialIcons name="monetization-on" size={24} color={C.white} />
                </View>
                <Text style={styles.rewardCardLabel}>Coins</Text>
              </View>

              {/* Reward 2 */}
              <View style={styles.rewardCard}>
                <View style={[styles.rewardIconBg, { backgroundColor: "#1e88e5" }]}>
                  <MaterialIcons name="electric-bolt" size={24} color={C.white} />
                </View>
                <Text style={styles.rewardCardLabel}>XP Boost</Text>
              </View>

              {/* Reward 3 */}
              <View style={styles.rewardCard}>
                <View style={[styles.rewardIconBg, { backgroundColor: "#8e24aa" }]}>
                  <MaterialIcons name="pets" size={24} color={C.white} />
                </View>
                <Text style={styles.rewardCardLabel}>Rare Pet</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.rewardSuccessMsgContainer}>
            <Text style={styles.rewardSuccessMsg}>Added to your Study Buddy collection!</Text>
          </View>
        )}

        {/* CTA Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={triggerReveal}
          style={[
            styles.ctaButton,
            revealed ? styles.ctaButtonClaim : styles.ctaButtonReveal,
          ]}
        >
          <MaterialIcons name="auto-awesome" size={24} color={revealed ? C.white : C.secondary} />
          <Text style={[styles.ctaButtonText, revealed && { color: C.white }]}>
            {revealed ? "CLAIM REWARD" : "REVEAL REWARD"}
          </Text>
          <MaterialIcons name="auto-awesome" size={24} color={revealed ? C.white : C.secondary} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 999,
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: C.white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  headerLine: {
    height: 4,
    width: 96,
    backgroundColor: C.secondaryFixed,
    borderRadius: 999,
    marginTop: 8,
    shadowColor: C.secondaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 10,
  },
  cardContainer: {
    width: 280,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    shadowColor: C.secondaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTouch: {
    flex: 1,
  },
  cardInnerFront: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardInnerBack: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: C.secondaryFixed,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.secondaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 10,
  },
  questionCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  tapToRevealText: {
    fontSize: 22,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 2,
  },
  starTopLeft: {
    position: "absolute",
    top: -4,
    left: -4,
  },
  starBottomRight: {
    position: "absolute",
    bottom: -4,
    right: -4,
  },
  revealedIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(87, 250, 233, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  rewardTier: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 32,
    zIndex: 10,
  },
  possibleRewardsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 16,
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  rewardCard: {
    flex: 1,
    backgroundColor: C.glassBg,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  rewardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  rewardSuccessMsgContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  rewardSuccessMsg: {
    fontSize: 16,
    fontWeight: "600",
    color: C.secondaryFixed,
    textAlign: "center",
  },
  ctaButton: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonReveal: {
    backgroundColor: C.secondaryFixed,
    shadowColor: C.secondaryFixed,
  },
  ctaButtonClaim: {
    backgroundColor: C.primary,
    shadowColor: C.primary,
    borderWidth: 2,
    borderColor: C.secondaryFixed,
  },
  ctaButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00201d",
  },
});
