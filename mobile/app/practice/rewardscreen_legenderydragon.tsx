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
  backgroundStart: "#1a1a2e",
  backgroundEnd: "#0d0d1a",
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixedDim: "#2addcd",
  onSecondaryFixed: "#00201d",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
};

export default function RewardScreenLegenderyDragon() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Extract navigation tracking parameters to pass them back
  const { chapterId, chapterName, resumeIndex, totalCorrect, incorrectTracker } = params;

  // Animated values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowPulseAnim = useRef(new Animated.Value(1)).current;

  // Floating drift animation for Mascot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Orbit rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 18000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Glow pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1.1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowPulseAnim]);

  // Static star coordinate generator
  const stars = useRef(
    Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * SCREEN_HEIGHT,
      size: Math.random() * 3 + 1,
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
      colors={[C.backgroundStart, C.backgroundEnd]}
      style={styles.container}
    >
      {/* Star Field Background */}
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

      {/* Suppressed Header Overlay */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <MaterialIcons name="close" size={24} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.main}>
        {/* Rarity Header */}
        <View style={styles.rarityHeader}>
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityBadgeText}>LEGENDARY REWARD</Text>
          </View>
        </View>

        {/* Centerpiece: Galaxy Dragon */}
        <View style={styles.centerpieceContainer}>
          {/* Background Orbit rings */}
          <Animated.View style={[styles.orbitOuter, { transform: [{ rotate: spinRing }] }]} />
          <Animated.View style={[styles.orbitInner, { transform: [{ rotate: spinRingReverse }] }]} />

          {/* Glow Aura */}
          <Animated.View style={[styles.glowAura1, { transform: [{ scale: glowPulseAnim }] }]} />
          <Animated.View style={[styles.glowAura2, { transform: [{ scale: glowPulseAnim }] }]} />

          {/* Hero Image */}
          <Animated.View
            style={[
              styles.heroImageContainer,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
          >
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida/AP1WRLtxNmFFxdyNKWzAzUs6bqJjyxuK6n8nhC6YyaGh83xYah62EqI3147taEVD7PCw0ECPSMHIVoxIiK8nRLBucsbBLs8nGcfz8DBQIuUKeRlk4PKRncRq8jdXJpUojn5J4s_f7YgZRfV4AbRljptg2vnnvO8Jqo-sRIyQVUn95O1BGLxhk3XQdMNvvsqA0qQYl25bgUVN-piXsJ18K39SHeTmzNK4F8AL9p30pKlyfa-z3HrojD3CQCtVIA",
              }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Content & Texts */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            Galaxy Dragon {"\n"}
            <Text style={styles.highlightText}>Unlocked!</Text>
          </Text>
          <Text style={styles.description}>
            You've reached a celestial milestone. This majestic creature now resides in your DNA collection.
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionCluster}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleGo} style={styles.goBtn}>
            <Text style={styles.goBtnText}>Let's Go!</Text>
            <MaterialIcons name="rocket-launch" size={20} color={C.onSecondaryFixed} style={styles.btnIcon} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleGo} style={styles.dnaBtn}>
            <Text style={styles.dnaBtnText}>View My DNA</Text>
            <MaterialIcons name="fingerprint" size={20} color={C.white} style={styles.btnIcon} />
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
    opacity: 0.4,
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
  rarityHeader: {
    marginBottom: 16,
  },
  rarityBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(87, 250, 233, 0.3)",
    backgroundColor: "rgba(87, 250, 233, 0.05)",
    shadowColor: C.secondaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  rarityBadgeText: {
    color: C.secondaryFixedDim,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },
  centerpieceContainer: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: -8,
  },
  orbitOuter: {
    position: "absolute",
    width: "85%",
    height: "85%",
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  orbitInner: {
    position: "absolute",
    width: "70%",
    height: "70%",
    borderRadius: 98,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  glowAura1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(20, 23, 121, 0.2)",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 5,
  },
  glowAura2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(0, 106, 98, 0.15)",
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  heroImageContainer: {
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    shadowColor: C.secondaryFixedDim,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: C.white,
    textAlign: "center",
  },
  highlightText: {
    color: C.secondaryFixedDim,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionCluster: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
  goBtn: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: C.secondaryFixedDim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.secondaryFixedDim,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  goBtnText: {
    color: C.onSecondaryFixed,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dnaBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
  },
  btnIcon: {
    marginLeft: 8,
  },
});
