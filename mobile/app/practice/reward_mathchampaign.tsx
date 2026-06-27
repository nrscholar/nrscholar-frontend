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
  secondaryFixed: "#57fae9",
  onSecondaryContainer: "#007168",
  white: "#ffffff",
  black: "#000000",
  cosmicBase: "#0c0e35",
  goldStart: "#ffd700",
  goldEnd: "#ffcc00",
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
};

export default function RewardMathChampaign() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Extract navigation tracking parameters to pass them back
  const { chapterId, chapterName, resumeIndex, totalCorrect, incorrectTracker } = params;

  // Animated values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const badgePulseAnim = useRef(new Animated.Value(1)).current;

  // Float animation for surrounding stars
  const runFloat = (anim: Animated.Value, distance: number, duration: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: distance,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    runFloat(floatAnim1, -15, 2000);
    runFloat(floatAnim2, -25, 2500);
    runFloat(floatAnim3, -10, 1800);
  }, []);

  // Rotate shine animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Badge pulse / tilt simulation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [badgePulseAnim]);

  // Ambient particles
  const particles = useRef(
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      top: Math.random() * SCREEN_HEIGHT,
      size: Math.random() * 3 + 1,
    }))
  ).current;

  const handleCollect = () => {
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

  // Rotation interpolation for radial shine
  const spinShine = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={[C.primary, C.cosmicBase]}
      style={styles.container}
    >
      {/* Background Particles */}
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

      {/* Header Anchor */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleClose}>
          <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="stars" size={20} color={C.secondaryFixed} />
          <Text style={styles.headerTitleText}>NEW UNLOCK</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* Main Reveal Canvas */}
      <View style={styles.main}>
        
        {/* Rarity Tag */}
        <View style={styles.rarityTagContainer}>
          <LinearGradient
            colors={[C.goldStart, C.goldEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rarityTag}
          >
            <MaterialIcons name="auto-awesome" size={16} color={C.primary} style={styles.rarityIcon} />
            <Text style={styles.rarityTagText}>RARE BADGE</Text>
          </LinearGradient>
        </View>

        {/* Central Badge Spotlight */}
        <View style={styles.badgeSpotlight}>
          
          {/* Radial Shine Layer */}
          <Animated.View style={[styles.badgeShine, { transform: [{ rotate: spinShine }] }]}>
            <LinearGradient
              colors={["transparent", "rgba(87, 250, 233, 0.15)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          {/* Floating Stars */}
          <Animated.View style={[styles.floatingStar1, { transform: [{ translateY: floatAnim1 }] }]}>
            <MaterialIcons name="star" size={32} color={C.secondaryFixed} />
          </Animated.View>
          <Animated.View style={[styles.floatingStar2, { transform: [{ translateY: floatAnim2 }] }]}>
            <MaterialIcons name="star" size={24} color={C.secondaryFixed} />
          </Animated.View>
          <Animated.View style={[styles.floatingStar3, { transform: [{ translateY: floatAnim3 }] }]}>
            <MaterialIcons name="star" size={18} color="rgba(87, 250, 233, 0.5)" />
          </Animated.View>

          {/* Badge Card Wrapper */}
          <Animated.View
            style={[
              styles.badgeCard,
              {
                transform: [{ scale: badgePulseAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(20, 23, 121, 0.4)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRHcKf0YYUdWtSVgiFjyLzgE1kfrmmZWWzbveF9vkixJAqjrF0XMH3oCXrixUC2_HUTVTURn2DC-nEzuWliaHK3DkO7Ht1cmKa2gliF3ZUMeRcVd5DU5okkJIEX2Kqf-QrWeLu1YzYJafK0AI6N3Yjzhd40gNeonYhWmVHbnJiGH4v-zoJl9wP_Sv88krUYwFx-Z2ckgWuS490qD8NtGOp-WGNeo7T_WYS-N4TFygSvNnlHZk8jv9cS0PyLQr8Ca4G_zNk4mEPlw",
              }}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </Animated.View>

        </View>

        {/* Content Details */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Math Champion</Text>
          <Text style={styles.subheading}>
            You mastered the Equation Galaxy with perfect accuracy!
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.btnContainer}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleCollect} style={styles.collectBtn}>
            <Text style={styles.collectBtnText}>Collect</Text>
            <MaterialIcons name="double-arrow" size={20} color={C.onSecondaryContainer} />
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
  particle: {
    position: "absolute",
    backgroundColor: "#57fae9",
    borderRadius: 999,
    opacity: 0.3,
  },
  header: {
    height: 64 + 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitleText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.white,
    letterSpacing: 0.5,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  rarityTagContainer: {
    marginBottom: 24,
  },
  rarityTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: C.goldStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  rarityIcon: {
    marginRight: 6,
  },
  rarityTagText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  badgeSpotlight: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 36,
  },
  badgeShine: {
    position: "absolute",
    width: "150%",
    height: "150%",
    borderRadius: 210,
    opacity: 0.4,
  },
  floatingStar1: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  floatingStar2: {
    position: "absolute",
    bottom: 40,
    right: 10,
  },
  floatingStar3: {
    position: "absolute",
    top: 30,
    right: 20,
  },
  badgeCard: {
    width: 220,
    height: 220,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    backgroundColor: C.glassBg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  badgeImage: {
    width: 170,
    height: 170,
    shadowColor: C.goldStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    gap: 8,
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: C.white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subheading: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  btnContainer: {
    width: "100%",
    maxWidth: 280,
  },
  collectBtn: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: C.secondaryFixed,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "rgba(42, 221, 205, 0.4)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  collectBtnText: {
    color: C.onSecondaryContainer,
    fontSize: 20,
    fontWeight: "700",
  },
});
