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
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixedDim: "#2addcd",
  onSecondary: "#ffffff",
  white: "#ffffff",
  black: "#000000",
  tertiary: "#30007f",
  onTertiary: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
};

export default function RewardScreenLegenderyBot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Extract navigation tracking parameters to pass them back
  const { chapterId, chapterName, resumeIndex, totalCorrect, incorrectTracker } = params;

  // Animated values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowPulseAnim = useRef(new Animated.Value(1)).current;

  // Bounce animation for the Rarity Badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  // Orbit rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Robot character entrance animation (pop-up)
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Glow pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowPulseAnim]);

  // Cosmic star elements
  const stars = useRef(
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * SCREEN_HEIGHT,
      size: Math.random() * 3 + 1,
    }))
  ).current;

  // Confetti particles
  const confetti = useRef(
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * (SCREEN_HEIGHT * 0.8),
      size: Math.random() * 6 + 4,
      color: ["#2addcd", "#bfc2ff", "#57fae9", "#ffffff", "#141779"][Math.floor(Math.random() * 5)],
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

  // Rotation interpolations
  const spinRing = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinRingReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <LinearGradient
      colors={[C.primary, C.black]}
      style={styles.container}
    >
      {/* Background Starfield */}
      {stars.map((s) => (
        <View
          key={s.id}
          style={[
            styles.star,
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
            },
          ]}
        />
      ))}

      {/* Decorative Confetti */}
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

      {/* Header Overlay */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <MaterialIcons name="close" size={24} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.main}>
        {/* Rarity Badge */}
        <Animated.View style={[styles.rarityBadgeContainer, { transform: [{ translateY: bounceAnim }] }]}>
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityBadgeText}>LEGENDARY</Text>
          </View>
        </Animated.View>

        {/* Character Frame Container */}
        <View style={styles.characterFrame}>
          {/* Glowing Orbit Rings */}
          <Animated.View style={[styles.orbitRingOuter, { transform: [{ rotate: spinRing }] }]} />
          <Animated.View style={[styles.orbitRingInner, { transform: [{ rotate: spinRingReverse }] }]} />

          {/* Central Glow */}
          <Animated.View style={[styles.centralGlow, { transform: [{ scale: glowPulseAnim }] }]} />

          {/* Explorer Bot Mascot */}
          <Animated.View style={[styles.mascotWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFQ2_26offeAptiLsNdE5xD06gZ2REsgrYDFnFMtbFDO9Av4lWZ1H2LYpNh4LWoog0cHhckLxorNWGA33F7pCrt9KDW4ZT54G6JCy7zwBXbXFwM52CxAUqk6zXHdoJqHOdTP7eZdShlD_v9EAi-qs4TOCuaCE7f95c4R6aK0vPK6jnODxNm885lpKPY4i28itxRS01vdCbRi7M7-KkBTvMd5dEzN3uezstrVl73cP_tg2LjbAurzIam31E_dm_TCGJZF9F5dHxwg",
              }}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Text Block */}
        <View style={styles.textBlock}>
          <Text style={styles.heading}>Explorer Bot Unlocked!</Text>
          <Text style={styles.description}>
            You've discovered a new cosmic companion! This advanced AI bot will help you navigate the stars and boost your DNA research speed.
          </Text>
        </View>

        {/* Interaction CTAs */}
        <View style={styles.ctaCluster}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleGo} style={styles.goBtn}>
            <Text style={styles.goBtnText}>Let's Go!</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleGo} style={styles.dnaBtn}>
            <Text style={styles.dnaBtnText}>View My DNA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  star: {
    position: "absolute",
    backgroundColor: C.white,
    borderRadius: 999,
    opacity: 0.5,
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 2,
    opacity: 0.6,
  },
  header: {
    height: 64 + 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.glassBg,
    borderWidth: 1.5,
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
  rarityBadgeContainer: {
    marginBottom: 16,
  },
  rarityBadge: {
    backgroundColor: C.tertiary,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: C.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  rarityBadgeText: {
    color: C.onTertiary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  characterFrame: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  orbitRingOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 140,
    borderWidth: 1.5,
    borderColor: "rgba(42, 221, 205, 0.15)",
  },
  orbitRingInner: {
    position: "absolute",
    width: "85%",
    height: "85%",
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "rgba(42, 221, 205, 0.1)",
  },
  centralGlow: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: 84,
    backgroundColor: "rgba(0, 106, 98, 0.25)",
    shadowColor: C.secondaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  mascotWrapper: {
    width: "80%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
    shadowColor: C.secondaryFixedDim,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: C.white,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  ctaCluster: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
  goBtn: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: C.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 106, 98, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  goBtnText: {
    color: C.onSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  dnaBtn: {
    width: "100%",
    height: 56,
    borderRadius: 30,
    backgroundColor: C.glassBg,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  dnaBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
