import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../services/api";
import { ProgressBar } from "../../components/ui/progress-bar";

const { width } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  background: "#f7f9fb",
  white: "#ffffff",
  outline: "#767683",
  orange: "#ff9f43",
  yellow: "#ffd700",
  blue: "#2d328f",
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Anim values
  const trainTranslateY = useRef(new Animated.Value(0)).current;

  const [fuel, setFuel] = useState(350);
  const [coins, setCoins] = useState(420);
  const [childName, setChildName] = useState("Explorer");
  const [userLevel, setLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(7);
  const [mascotMsg, setMascotMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        try {
          // Fetch current user from backend to get fresh database stats (coins, fuel, level, childName)
          const res = await authApi.getMe();
          if (res.success && res.data?.user) {
            const u = res.data.user;
            setFuel(u.fuel ?? 350);
            setCoins(u.coins ?? 420);
            setLevel(u.level ?? 1);
            setChildName(u.childName || "Explorer");
            setStreakDays(u.streakDays ?? 0);
            
            // Sync to local AsyncStorage so other pages can read the updated values instantly
            await AsyncStorage.setItem("nrscholar_fuel", String(u.fuel ?? 350));
            await AsyncStorage.setItem("nrscholar_coins", String(u.coins ?? 420));
            await AsyncStorage.setItem("nrscholar_level", String(u.level ?? 1));
            await AsyncStorage.setItem("nrscholar_childName", u.childName || "Explorer");
          } else {
            // Fallback to local storage if API call fails
            const storedFuel = await AsyncStorage.getItem("nrscholar_fuel");
            if (storedFuel !== null) setFuel(Number(storedFuel));
            
            const storedCoins = await AsyncStorage.getItem("nrscholar_coins");
            if (storedCoins !== null) setCoins(Number(storedCoins));

            const storedLevel = await AsyncStorage.getItem("nrscholar_level");
            if (storedLevel !== null) setLevel(Number(storedLevel));

            const storedName = await AsyncStorage.getItem("nrscholar_childName");
            if (storedName !== null) setChildName(storedName);
          }
        } catch (e) {
          console.error("Failed to load dashboard progress", e);
        }
      };
      loadProgress();
    }, [])
  );

  const CITIES = [
    "Ahmedabad",
    "Gandhinagar",
    "Mehsana",
    "Patan",
    "Vadodara",
    "Surat",
    "Dwarka",
    "Somnath",
    "Kutch"
  ];

  // Calculate destination progress based on XP/fuel
  const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000];
  let nextLockedIndex = CITIES.length - 1;
  for (let i = 0; i < CITIES.length; i++) {
    if (fuel < xpThresholds[i]) {
      nextLockedIndex = i;
      break;
    }
  }
  const currentCityName = CITIES[nextLockedIndex - 1] || "Ahmedabad";
  const nextCityName = CITIES[nextLockedIndex] || "Gandhinagar";
  const targetFuel = xpThresholds[nextLockedIndex] || (nextLockedIndex * 5000);
  const fuelNeeded = Math.max(0, targetFuel - fuel);
  const prevMilestoneFuel = xpThresholds[nextLockedIndex - 1] || 0;
  const currentLegFuelTotal = Math.max(1, targetFuel - prevMilestoneFuel);
  const currentLegFuelEarned = Math.max(0, fuel - prevMilestoneFuel);
  const currentLegFuelPercentage = Math.min(100, Math.max(0, (currentLegFuelEarned / currentLegFuelTotal) * 100));

  useEffect(() => {
    // Train route sliding animation removed to make it dynamic based on fuel


    // Train bobbing/jitter
    Animated.loop(
      Animated.sequence([
        Animated.timing(trainTranslateY, {
          toValue: -3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(trainTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Background Glows */}
      <View style={styles.glowOverlay1} />
      <View style={styles.glowOverlay2} />

      {/* Top Section */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8} style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.childName}>{childName}</Text>
            <View style={styles.levelRow}>
              <MaterialIcons name="stars" size={14} color={C.secondary} />
              <Text style={styles.levelText}>Explorer Level {userLevel}</Text>
            </View>
          </View>
        </View>

        {/* Currency & Streak Stats */}
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streakDays} Days</Text>
          </View>
          <TouchableOpacity 
            style={styles.coinBadge}
            activeOpacity={0.8}
            onPress={() => router.push("/practice/inventory")}
          >
            <Text style={styles.coinText}>🪙 {coins}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Journey Fuel Bar Card */}
        <View style={styles.fuelCard}>
          <View style={styles.fuelTextRow}>
            <View style={styles.fuelLabelRow}>
              <MaterialIcons name="bolt" size={16} color={C.primary} />
              <Text style={styles.fuelLabel}>JOURNEY FUEL</Text>
            </View>
            <Text style={styles.fuelValue}>🚂 {fuel} Fuel</Text>
          </View>
          <ProgressBar
            progress={currentLegFuelPercentage}
            colors={[C.primary, C.secondaryContainer]}
            trackStyle={styles.progressTrack}
            fillStyle={styles.progressFill}
          />
          <View style={styles.destinationAlertRow}>
            <MaterialIcons name="pin-drop" size={16} color={C.orange} />
            <Text style={styles.destinationText}>
              Next: {nextCityName} • <Text style={styles.boldText}>{fuelNeeded > 0 ? `${fuelNeeded} Fuel Needed` : "Ready!"}</Text>
            </Text>
          </View>
        </View>

        {/* MAIN HERO SECTION: Large Journey Progress Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({
            pathname: "/practice/chapters",
            params: {
              subjectId: "sub1",
              subjectName: "Mathematics",
            }
          })}
        >
          <LinearGradient
            colors={["#e0f7f6", "#ffffff"]}
            style={styles.journeyCard}
          >
            <Text style={styles.routeHeader}>CURRENT ROUTE</Text>
            <View style={styles.routeRow}>
              <Text style={styles.routeCity}>{currentCityName}</Text>
              <MaterialIcons name="double-arrow" size={18} color={C.primary} />
              <Text style={styles.routeCity}>{nextCityName}</Text>
            </View>

            {/* Map Progress Track with Learning Train */}
            <View style={styles.mapTrackArea}>
              <View style={styles.dottedPath} />
              <Animated.View
                style={[
                  styles.trainWrapper,
                  {
                    left: `${currentLegFuelPercentage}%`,
                    transform: [
                      { translateX: -15 },
                      { translateY: trainTranslateY },
                    ],
                  },
                ]}
              >
                <View style={styles.trainBox}>
                  <MaterialIcons name="train" size={24} color={C.white} />
                </View>
              </Animated.View>
            </View>

            <Text style={styles.journeyProgressDesc}>
              {fuelNeeded > 0 ? `Only ${fuelNeeded} Fuel left to reach ${nextCityName}` : `You have reached ${nextCityName}!`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* QUICK ACTIONS BENTO GRID */}
        <View style={styles.bentoSection}>
          <Text style={styles.bentoSectionTitle}>EXPLORER MISSION CONTROLS</Text>
          
          <View style={styles.bentoGrid}>
            {/* Continue Learning */}
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: "#e0e0ff" }]}
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: "/practice/chapters",
                params: {
                  subjectId: "sub1",
                  subjectName: "Mathematics",
                }
              })}
            >
              <View style={[styles.bentoIconBox, { backgroundColor: "rgba(20, 23, 121, 0.15)" }]}>
                <MaterialIcons name="school" size={24} color={C.primary} />
              </View>
              <View>
                <Text style={styles.bentoCardTitle}>📚 Continue Learning</Text>
                <Text style={styles.bentoCardSub}>Math & Science Quests</Text>
              </View>
            </TouchableOpacity>

            {/* Open Rewards */}
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: "#fff0da" }]}
              activeOpacity={0.85}
              onPress={() => router.push("/practice/inventory")}
            >
              <View style={[styles.bentoIconBox, { backgroundColor: "rgba(255, 159, 67, 0.2)" }]}>
                <MaterialIcons name="card-giftcard" size={24} color={C.orange} />
              </View>
              <View>
                <Text style={styles.bentoCardTitle}>🎁 Open Rewards</Text>
                <Text style={styles.bentoCardSub}>XP Boosts & Badges</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bentoGrid}>
            {/* My Journey */}
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: "#d7fdf5" }]}
              activeOpacity={0.85}
              onPress={() => router.push("/practice/journey-map")}
            >
              <View style={[styles.bentoIconBox, { backgroundColor: "rgba(0, 106, 98, 0.15)" }]}>
                <MaterialIcons name="map" size={24} color={C.secondary} />
              </View>
              <View>
                <Text style={styles.bentoCardTitle}>🗺 My Journey</Text>
                <Text style={styles.bentoCardSub}>Explorer Map</Text>
              </View>
            </TouchableOpacity>

            {/* My Collections */}
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: "#ffe8ed" }]}
              activeOpacity={0.85}
              onPress={() => router.push("/practice/collections")}
            >
              <View style={[styles.bentoIconBox, { backgroundColor: "rgba(255, 107, 107, 0.15)" }]}>
                <MaterialIcons name="collections-bookmark" size={24} color="#ff6b6b" />
              </View>
              <View>
                <Text style={styles.bentoCardTitle}>🏆 My Collections</Text>
                <Text style={styles.bentoCardSub}>Unlocked Cards & Badges</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Multiplayer Challenge (Shadow Arena) */}
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/practice/webview" as any,
            params: { path: "/multiplayer-hub" }
          })}
          style={styles.shadowArenaCard}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#141779", "#30007f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shadowArenaGradient}
          >
            <View style={styles.shadowArenaLeft}>
              <View style={styles.shadowArenaIconBox}>
                <Text style={{ fontSize: 22 }}>⚔️</Text>
              </View>
              <View>
                <Text style={styles.shadowArenaTitle}>SHADOW ARENA</Text>
                <Text style={styles.shadowArenaSub}>Challenge Friends 1v1</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#57fae9" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Parent Portal Access Card */}
        <TouchableOpacity
          style={styles.parentPortalCard}
          activeOpacity={0.85}
          onPress={() => router.push("/parent")}
        >
          <View style={styles.parentLeft}>
            <MaterialIcons name="security" size={24} color={C.primary} />
            <View>
              <Text style={styles.parentTitle}>Parent Dashboard</Text>
              <Text style={styles.parentSub}>View stats, DNA, & reports</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={C.primary} />
        </TouchableOpacity>
      </ScrollView>

      {/* FLOATING INTERACTIVE MASCOT */}
      <View style={styles.mascotContainer}>
        {mascotMsg ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: "/practice/webview" as any,
              params: { path: "/evolution" }
            })}
            style={styles.speechBubble}
          >
            <Text style={styles.speechText}>{mascotMsg}</Text>
            <Text style={styles.speechVisit}>Visit ➜</Text>
            <View style={styles.speechArrow} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const quotes = [
              "You're doing great! 🚀",
              "Did you check your missions? 🎯",
              "Keep up the streak! 🔥",
              "I smell mystery boxes... 📦",
              "Let's learn something new! 📚"
            ];
            setMascotMsg(quotes[Math.floor(Math.random() * quotes.length)]);
            setTimeout(() => setMascotMsg(""), 3500);
          }}
          style={styles.mascotButton}
        >
          <Text style={{ fontSize: 32 }}>🐉</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  glowOverlay1: {
    position: "absolute",
    top: "10%",
    right: "-20%",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(87, 250, 233, 0.12)",
    pointerEvents: "none",
  },
  glowOverlay2: {
    position: "absolute",
    bottom: "20%",
    left: "-25%",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    pointerEvents: "none",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: C.secondaryContainer,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  levelText: {
    fontSize: 11,
    color: C.outline,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  streakBadge: {
    backgroundColor: "rgba(255, 159, 67, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.orange,
  },
  coinBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  coinText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  fuelCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  fuelTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fuelLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fuelLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 1,
  },
  fuelValue: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(20, 23, 121, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  destinationAlertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  destinationText: {
    fontSize: 11,
    color: C.outline,
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "700",
    color: C.primary,
  },
  journeyCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  routeHeader: {
    fontSize: 9,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  routeCity: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
  },
  mapTrackArea: {
    height: 64,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0f2f1",
    position: "relative",
    overflow: "hidden",
    marginBottom: 16,
  },
  dottedPath: {
    height: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: C.primary,
    marginHorizontal: 24,
    opacity: 0.5,
  },
  trainWrapper: {
    position: "absolute",
    left: 20,
  },
  trainBox: {
    backgroundColor: C.primary,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1.5,
    borderColor: C.secondaryContainer,
  },
  journeyProgressDesc: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
  },
  bentoSection: {
    gap: 14,
  },
  bentoSectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 1.5,
    paddingHorizontal: 4,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    height: 128,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  bentoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  bentoCardSub: {
    fontSize: 10,
    color: C.outline,
    fontWeight: "600",
  },
  parentPortalCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#eef0f2",
  },
  parentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  parentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.primary,
  },
  parentSub: {
    fontSize: 11,
    color: C.outline,
    fontWeight: "600",
  },
  shadowArenaCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#141779",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  shadowArenaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  shadowArenaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  shadowArenaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  shadowArenaTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 1,
  },
  shadowArenaSub: {
    fontSize: 11,
    color: "#57fae9",
    fontWeight: "700",
    marginTop: 2,
  },
  mascotContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    alignItems: "center",
    zIndex: 999,
  },
  mascotButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  speechBubble: {
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: C.secondaryContainer,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  speechText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  speechVisit: {
    fontSize: 9,
    fontWeight: "700",
    color: C.onSecondaryContainer,
    backgroundColor: C.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  speechArrow: {
    position: "absolute",
    bottom: -6,
    right: 20,
    width: 12,
    height: 12,
    backgroundColor: C.white,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: C.secondaryContainer,
    transform: [{ rotate: "45deg" }],
  },
});
