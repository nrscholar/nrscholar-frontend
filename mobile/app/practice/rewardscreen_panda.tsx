import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
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
  secondaryContainer: "#e0f2f1",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  white: "#ffffff",
  background: "#f7f9fb",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
  tertiary: "#30007f",
  purpleGlow: "rgba(206, 189, 255, 0.2)",
};

export default function RewardScreenPanda() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Extract navigation tracking parameters to pass them back
  const { chapterId, chapterName, resumeIndex, totalCorrect, incorrectTracker } = params;

  // Animated values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Floating animation for Mascot
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

  // Glow pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Rotate decorative rings
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Confetti particles
  const confetti = useRef(
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * SCREEN_HEIGHT,
      size: Math.random() * 8 + 6,
      color: ["#57fae9", "#cebdff", "#141779", "#bfc2ff", "#ffffff"][Math.floor(Math.random() * 5)],
    }))
  ).current;

  const handleGo = () => {
    // Navigate back to the practice session resuming from the next index
    router.replace({
      pathname: "/practice/session",
      params: {
        ...params,
        resumeFrom: String(resumeIndex || "5"),
      } as any,
    });
  };

  const handleClose = () => {
    router.back();
  };

  // Rotation interpolation for rings
  const spinRing = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinRingReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <View style={styles.container}>
      {/* Background Radial & Ring Atmospheric Effects */}
      <View style={styles.backgroundAtmosphere}>
        <View style={styles.centerGlow} />
        
        {/* Animated Rings */}
        <Animated.View style={[styles.decorRingOuter, { transform: [{ rotate: spinRing }] }]} />
        <Animated.View style={[styles.decorRingInner, { transform: [{ rotate: spinRingReverse }] }]} />
      </View>

      {/* Floating Confetti (Decorative static placeholders that look like falling confetti) */}
      {confetti.map((c) => (
        <View
          key={c.id}
          style={[
            styles.confettiPiece,
            {
              left: c.left,
              top: c.top,
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
            },
          ]}
        />
      ))}

      {/* Header Area */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="psychology" size={28} color={C.primary} />
          <Text style={styles.headerBranding}>{chapterName || "Explorer"}'s DNA</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Main Content Canvas */}
      <View style={styles.main}>
        {/* Glow burst behind mascot */}
        <View style={styles.mascotGlowBackground} />

        {/* Mascot Container */}
        <Animated.View
          style={[
            styles.mascotAnimationContainer,
            {
              transform: [{ translateY: floatAnim }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.mascotPortal}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw_sheneJmCAej6xb7XjZCcStd5jUlRDQ12qEqp1wBpmk-6kT3Mg0yHhO43rvZAZ-fiiKCXCd6V5VfxGedYYWfWQTQ2m_xjWrU71llyB8ZZO0Wo33Y6Hn_oLGVsdu6Z9IW0aisvLx3DIrFSS4IzHsKR-t9IECOamggRLzZnCVgd8ZndM6MoOwUqZmQDTtAFaJrD8yShDtjqMGnHX2CQgu6rja49fwY1kB5a6YVcr3lREWlou14rt2ZF0THdiMkn1ZP2L_149pR1Q",
              }}
              style={styles.mascotImage}
              resizeMode="contain"
            />
            {/* Embedded glowing energy orbs inside the portal */}
            <View style={styles.orbTopRight} />
            <View style={styles.orbBottomLeft} />
          </View>

          {/* Rarity Badge Overlay */}
          <View style={styles.rarityBadgeContainer}>
            <LinearGradient
              colors={[C.primary, C.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rarityBadge}
            >
              <Text style={styles.rarityBadgeText}>LEGENDARY</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Panda Unlocked!</Text>
          <Text style={styles.subheading}>
            Your cosmic collection just reached a new milestone. The Baby Panda is ready for the journey!
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleGo} style={styles.goBtn}>
            <Text style={styles.goBtnText}>Let's Go!</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleGo} style={styles.dnaBtn}>
            <Text style={styles.dnaBtnText}>View My DNA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  backgroundAtmosphere: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  centerGlow: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: (SCREEN_WIDTH * 1.2) / 2,
    backgroundColor: "rgba(87, 250, 233, 0.12)",
  },
  decorRingOuter: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: "rgba(87, 250, 233, 0.2)",
    borderStyle: "dashed",
  },
  decorRingInner: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: "rgba(48, 0, 127, 0.1)",
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 2,
    opacity: 0.7,
  },
  header: {
    height: 64 + 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBranding: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.glassBg,
    borderWidth: 1,
    borderColor: C.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  mascotGlowBackground: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(87, 250, 233, 0.2)",
    top: "15%",
  },
  mascotAnimationContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  mascotPortal: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: C.glassBg,
    borderWidth: 4,
    borderColor: "rgba(87, 250, 233, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  mascotImage: {
    width: 180,
    height: 180,
    zIndex: 10,
  },
  orbTopRight: {
    position: "absolute",
    top: 16,
    right: 32,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.secondaryFixed,
  },
  orbBottomLeft: {
    position: "absolute",
    bottom: 32,
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.purpleGlow,
  },
  rarityBadgeContainer: {
    position: "absolute",
    bottom: -16,
    zIndex: 20,
  },
  rarityBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: C.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rarityBadgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 36,
    gap: 8,
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
  ctaContainer: {
    width: "100%",
    gap: 12,
  },
  goBtn: {
    width: "100%",
    height: 60,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  goBtnText: {
    color: C.white,
    fontSize: 18,
    fontWeight: "700",
  },
  dnaBtn: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    backgroundColor: C.glassBg,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  dnaBtnText: {
    color: C.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
