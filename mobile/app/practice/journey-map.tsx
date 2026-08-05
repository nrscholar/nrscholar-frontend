import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle } from "react-native-svg";
import { authApi } from "../services/api";

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
  surfaceContainer: "#eceef0",
  surfaceVariant: "#e0e3e5",
  onSurfaceVariant: "#464652",
};

interface City {
  name: string;
  x: number;
  y: number;
  unlocked: boolean;
  landmark: string;
  fact: string;
  badge: string;
  landmarkImage: string;
}

const CITIES: City[] = [
  {
    name: "Ahmedabad",
    x: 120,
    y: 440,
    unlocked: true,
    landmark: "Sabarmati Riverfront",
    fact: "Ahmedabad is the first UNESCO Heritage City of India and famous for its Sabarmati Ashram.",
    badge: "Heritage City Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3tH0pIe1a7428F2cR018Q2BvX75oM2w_xN64H77W5-4gY8eT",
  },
  {
    name: "Gandhinagar",
    x: 200,
    y: 370,
    unlocked: false,
    landmark: "Akshardham Temple",
    fact: "Gandhinagar is the capital city of Gujarat and is one of the greenest cities in Asia.",
    badge: "Green City Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW4QR3okRxfyDYGBcckUo_5262EP8MttpJ84m9LYCXP3Z5yG-gzcvthx6hMC8ktY4Z1M8lsB53MP1-Aqs2_hCaKFQHdgFPyirRdgDeqNYxSAuBqqRRvdQDwrdU2ZYAoDnl2qgB9BgAiMd04m5MmbeuHQULQz7zAWAI04oTpSrLN9jlcLce2yzi5fJVOEiskVCcjCgRx0tdYPdBBPGhQviMPpUSg-HZDMHwMDvVR-xzutGwo4q0vFDnxib9R5RfbjAgOI_e7pVhDg",
  },
  {
    name: "Mehsana",
    x: 280,
    y: 300,
    unlocked: false,
    landmark: "Modhera Sun Temple",
    fact: "Mehsana is famous for its Sun Temple in Modhera, built in 1026 AD during Solanki rule.",
    badge: "Sun Temple Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOny1jIhktsZ517Es0_GtB_gIdbzcdbuUprQ-WF4tHiUcPsxBv2iGSuJWy4nTnrICPNSMVAh8-5TFcKslbcljo08MTdN76CgF9u4oGJmnvjzQuUjQRKuK9GFYkLvzEJzkTnUgaITJWayZduw8YSC1tiDCbEfXhdzb1wl6dAQLHcdzoYYr5L0Mmmgw0NqfsZ5yLPwbnLZr7sKxvh0GBFEa4liy1bTnvMxsPbihoIq37PDWENubIolbX4KAH5p1mcx0dD2GI55_zbQ",
  },
  {
    name: "Patan",
    x: 180,
    y: 240,
    unlocked: false,
    landmark: "Rani ki Vav",
    fact: "Patan is home to Rani ki Vav, a magnificent stepwell featured on the ₹100 note.",
    badge: "Rani Vav Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA",
  },
  {
    name: "Vadodara",
    x: 100,
    y: 190,
    unlocked: false,
    landmark: "Laxmi Vilas Palace",
    fact: "Vadodara is known as the cultural capital of Gujarat, housing the massive Laxmi Vilas Palace.",
    badge: "Royal Palace Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsw5QM4ckfgV4r47k9iglGsrwO7NzpEQqaFt2Wapg5Z_iullDNHZxy8K3lBwww8wTKzKsTW4HZXRyvol6fP1If9EMT3e3dkzP8Txldwtfnye-t2qm4J4TE2zMuerwTlchYoY6EmHwK-sdI3eWHPDC4EZCEILl48U94yr2KphtMG5vQoDZPck6qzgiTs5t4IyRDqjUvKFWgeaT59xOPjiNk0I42Nx8wcybHADz8X62nhcVwziGPykMqrGGRBq_KqDJeU99U9Ss8hg",
  },
  {
    name: "Surat",
    x: 220,
    y: 140,
    unlocked: false,
    landmark: "Dutch Gardens",
    fact: "Surat is the Diamond City of India, polishing over 90% of the world's rough diamonds.",
    badge: "Diamond City Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIUh4mbkBc6p_INhz-RWpzD4E3i4upVIc85YORgArLaPQ-BpyKd__tr7dbgfBFON8CX9MoGTqr0kcDDq0wnqD7D2wSKwaeRjLNdhKTgqAdjxgrdeLOomzwwsL7MiSJ73kYyX4HhssxDlub28Yv1esVfCT5acshzaqsFjNxs7Jo7a1_eZ_-9Pg92fxcErBbW9jY4sd3EZjPVQftnKZa0dNPXJq7tNYuHG7Qb3PWg_UCPSCOyK2eylBugrfkFvCBSoxYXEcgXCaDjA",
  },
  {
    name: "Dwarka",
    x: 120,
    y: 90,
    unlocked: false,
    landmark: "Dwarkadhish Temple",
    fact: "Dwarka is an ancient holy city associated with Lord Krishna, situated on the Arabian Sea coast.",
    badge: "Ancient Dwarka Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW4QR3okRxfyDYGBcckUo_5262EP8MttpJ84m9LYCXP3Z5yG-gzcvthx6hMC8ktY4Z1M8lsB53MP1-Aqs2_hCaKFQHdgFPyirRdgDeqNYxSAuBqqRRvdQDwrdU2ZYAoDnl2qgB9BgAiMd04m5MmbeuHQULQz7zAWAI04oTpSrLN9jlcLce2yzi5fJVOEiskVCcjCgRx0tdYPdBBPGhQviMPpUSg-HZDMHwMDvVR-xzutGwo4q0vFDnxib9R5RfbjAgOI_e7pVhDg",
  },
  {
    name: "Somnath",
    x: 240,
    y: 50,
    unlocked: false,
    landmark: "Somnath Temple",
    fact: "Somnath houses the first of the twelve holy Jyotirlinga shrines of Lord Shiva.",
    badge: "Somnath Shrine Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOny1jIhktsZ517Es0_GtB_gIdbzcdbuUprQ-WF4tHiUcPsxBv2iGSuJWy4nTnrICPNSMVAh8-5TFcKslbcljo08MTdN76CgF9u4oGJmnvjzQuUjQRKuK9GFYkLvzEJzkTnUgaITJWayZduw8YSC1tiDCbEfXhdzb1wl6dAQLHcdzoYYr5L0Mmmgw0NqfsZ5yLPwbnLZr7sKxvh0GBFEa4liy1bTnvMxsPbihoIq37PDWENubIolbX4KAH5p1mcx0dD2GI55_zbQ",
  },
  {
    name: "Kutch",
    x: 160,
    y: 20,
    unlocked: false,
    landmark: "Rann of Kutch",
    fact: "Kutch features the Great Rann, a massive white salt desert that glows beautifully under full moon.",
    badge: "Desert Explorer Badge",
    landmarkImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySqOarQl_2QVMKQTFpIrfA6OyfRZa9AKi8XKC9IGfZrvtKhpfK50qr2C021sWBJ4nrt0PSTlZCZIPfb1FZzw8-lzBzH3AdnYjbinFoSubThNCyCIVSq4FeMaZFFtiJrvEnmI5zoeY6Ja-QTw5pisfB-TapQ0bYU_nKHb-tlGCN5GN8P5XG_PmreHw5L4xfIueUcuPpfMr-wiA80WIOqC14mkhMFWLMK5dxuYsdrVAKpMwOMDnjPhW2QxcQO_U_QuqT65VvcP3wA",
  },
];

export default function MyJourneyMap() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [fuel, setFuel] = useState(350);
  const [cities, setCities] = useState<City[]>(CITIES);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  // Celebration States
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebratingCity, setCelebratingCity] = useState<City | null>(null);

  // Animations
  const trainTranslateY = useRef(new Animated.Value(0)).current;
  const trainTranslateX = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  // Dynamic destination and train calculations
  const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000];
  const nextLockedCity = cities.find(c => !c.unlocked) || cities[cities.length - 1];
  const nextLockedIndex = cities.findIndex(c => !c.unlocked);
  const targetFuel = nextLockedIndex !== -1 ? (xpThresholds[nextLockedIndex] || (nextLockedIndex * 5000)) : 1000;
  const fuelLeft = Math.max(0, targetFuel - fuel);

  // Train position at the last unlocked city
  const lastUnlockedIdx = [...cities].reverse().findIndex(c => c.unlocked);
  const currentCityIdx = lastUnlockedIdx !== -1 ? (cities.length - 1 - lastUnlockedIdx) : 0;
  const currentCity = cities[currentCityIdx] || cities[0];

  // Load and check milestones dynamically when screen is focused
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadProgress = async () => {
        try {
          let currentFuel = 350;
          
          try {
            const userRes = await authApi.getMe();
            if (userRes.success && userRes.data?.user) {
              const u = userRes.data.user;
              currentFuel = u.fuel ?? 350;
              await AsyncStorage.setItem("nrscholar_fuel", String(currentFuel));
              await AsyncStorage.setItem("nrscholar_coins", String(u.coins ?? 420));
              await AsyncStorage.setItem("nrscholar_level", String(u.level ?? 1));
            } else {
              const storedFuel = await AsyncStorage.getItem("nrscholar_fuel");
              if (storedFuel !== null) {
                currentFuel = Number(storedFuel);
              }
            }
          } catch {
            const storedFuel = await AsyncStorage.getItem("nrscholar_fuel");
            if (storedFuel !== null) {
              currentFuel = Number(storedFuel);
            }
          }

          const storedCities = await AsyncStorage.getItem("nrscholar_unlocked_cities");
          let unlockedList = ["Ahmedabad"];
          if (storedCities !== null) {
            unlockedList = JSON.parse(storedCities);
          } else {
            await AsyncStorage.setItem("nrscholar_unlocked_cities", JSON.stringify(unlockedList));
          }

          // Let's check if the fuel enables unlocking new cities dynamically
          let newlyUnlockedCity: City | null = null;
          const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000];
          const updatedCities = CITIES.map((city, idx) => {
            const requiredFuel = xpThresholds[idx] || (idx * 5000);
            const shouldBeUnlocked = currentFuel >= requiredFuel || unlockedList.includes(city.name);
            
            // Check if this city is newly unlocked
            if (shouldBeUnlocked && !unlockedList.includes(city.name)) {
              unlockedList.push(city.name);
              newlyUnlockedCity = city;
            }
            
            return {
              ...city,
              unlocked: shouldBeUnlocked
            };
          });

          if (newlyUnlockedCity && isMounted) {
            await AsyncStorage.setItem("nrscholar_unlocked_cities", JSON.stringify(unlockedList));
            setCelebratingCity(newlyUnlockedCity);
            setCelebrationVisible(true);
          }

          if (isMounted) {
            setFuel(currentFuel);
            setCities(updatedCities);
          }
        } catch (e) {
          console.error("Failed to load progress from AsyncStorage", e);
        }
      };

      loadProgress();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Float train
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(trainTranslateY, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(trainTranslateY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cloud drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim, {
          toValue: 15,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleFuelBoost = async () => {
    const newFuel = fuel + 150;
    setFuel(newFuel);
    try {
      await AsyncStorage.setItem("nrscholar_fuel", String(newFuel));
      
      const newLevel = Math.max(1, Math.floor(newFuel / 500) + 1);
      await AsyncStorage.setItem("nrscholar_level", String(newLevel));

      // Sync stats dynamically to the database
      try {
        await authApi.updateStats({ fuel: newFuel, level: newLevel });
      } catch (dbErr) {
        console.error("Failed to sync boosted stats to database", dbErr);
      }
      
      let newlyUnlockedCity: City | null = null;
      const storedCities = await AsyncStorage.getItem("nrscholar_unlocked_cities");
      let unlockedList = storedCities ? JSON.parse(storedCities) : ["Ahmedabad"];

      const xpThresholds = [0, 1000, 2500, 5000, 10000, 15000, 20000, 30000, 40000];
      const updatedCities = cities.map((city, idx) => {
        const requiredFuel = xpThresholds[idx] || (idx * 5000);
        const shouldBeUnlocked = newFuel >= requiredFuel || city.unlocked;
        if (shouldBeUnlocked && !city.unlocked) {
          if (!unlockedList.includes(city.name)) unlockedList.push(city.name);
          newlyUnlockedCity = city;
        }
        return {
          ...city,
          unlocked: shouldBeUnlocked
        };
      });

      if (newlyUnlockedCity) {
        await AsyncStorage.setItem("nrscholar_unlocked_cities", JSON.stringify(unlockedList));
        setCities(updatedCities);
        setCelebratingCity(newlyUnlockedCity);
        setCelebrationVisible(true);
      } else {
        setCities(updatedCities);
      }
    } catch (e) {
      console.error("Failed to save fuel boost", e);
    }
  };

  const handleCityPress = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Learning Journey</Text>
          <TouchableOpacity style={styles.boostBtn} onPress={handleFuelBoost}>
            <MaterialIcons name="flash-on" size={16} color={C.white} />
            <Text style={styles.boostText}>+150 Fuel</Text>
          </TouchableOpacity>
        </View>

        {/* Journey Fuel Bar */}
        <View style={styles.fuelContainer}>
          <View style={styles.fuelHeader}>
            <View style={styles.fuelLabelRow}>
              <MaterialIcons name="bolt" size={16} color={C.primary} />
              <Text style={styles.fuelLabel}>JOURNEY FUEL</Text>
            </View>
            <Text style={styles.fuelText}>{fuel} / 500</Text>
          </View>
          <View style={styles.fuelTrack}>
            <LinearGradient
              colors={[C.primary, C.secondaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fuelFill, { width: `${Math.min((fuel / 500) * 100, 100)}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Map Canvas */}
      <View style={styles.mapContainer}>
        {/* Ambient Fog Background effects */}
        <View style={[styles.fogCircle, { top: "15%", left: "5%" }]} />
        <View style={[styles.fogCircle, { bottom: "25%", right: "10%" }]} />

        {/* SVG Route Paths */}
        <Svg style={StyleSheet.absoluteFillObject}>
          {/* Animated/Dotted Travel Route connecting the coords */}
          <Path
            d="M 120 440 C 150 420, 170 390, 200 370 C 230 350, 260 320, 280 300 C 240 280, 210 260, 180 240 C 140 220, 120 210, 100 190 C 140 170, 180 160, 220 140 C 180 120, 140 110, 120 90 C 160 70, 200 60, 240 50 C 210 40, 180 30, 160 20"
            fill="none"
            stroke={C.primary}
            strokeWidth={3}
            strokeDasharray="8,8"
          />

          {/* Render Unlocked Paths/Indicators */}
          {cities.map((city, idx) => (
            <Circle
              key={`dot-${idx}`}
              cx={city.x}
              cy={city.y}
              r={city.unlocked ? 8 : 6}
              fill={city.unlocked ? C.secondary : C.outlineVariant}
            />
          ))}
        </Svg>

        {/* Render Cities Icons & Fog overlay */}
        {cities.map((city, idx) => {
          const isAhmedabad = idx === 0;
          const isCurrent = idx === 0 || (idx === 1 && city.unlocked);

          return (
            <View
              key={city.name}
              style={[
                styles.cityNode,
                {
                  left: city.x - 24,
                  top: city.y - 24,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleCityPress(city)}
                activeOpacity={0.8}
                style={[
                  styles.cityCircle,
                  city.unlocked ? styles.cityUnlocked : styles.cityLocked,
                  isCurrent && styles.cityCurrentGlow,
                ]}
              >
                {city.unlocked ? (
                  <MaterialIcons name="location-on" size={20} color={C.white} />
                ) : (
                  <MaterialIcons name="lock" size={16} color={C.outline} />
                )}

                {/* Cloud & Mystery Fog cover for locked cities */}
                {!city.unlocked && (
                  <Animated.View
                    style={[
                      styles.fogCover,
                      {
                        transform: [{ translateX: cloudAnim }],
                      },
                    ]}
                  >
                    <MaterialIcons name="cloud" size={28} color="rgba(255, 255, 255, 0.7)" />
                  </Animated.View>
                )}
              </TouchableOpacity>
              <Text style={[styles.cityName, city.unlocked ? styles.nameUnlocked : styles.nameLocked]}>
                {city.name}
              </Text>

              {/* Landmark Miniature icon (floating) */}
              {city.unlocked && (
                <View style={styles.landmarkMini}>
                  <MaterialIcons name="temple-hindu" size={12} color={C.secondary} />
                </View>
              )}
            </View>
          );
        })}

        {/* Learning Train Marker (floating / bobbing) */}
        <Animated.View
          style={[
            styles.trainMarker,
            {
              left: currentCity.x - 30,
              top: currentCity.y - 50,
              transform: [{ translateY: trainTranslateY }],
            },
          ]}
        >
          <View style={styles.trainCard}>
            <MaterialIcons name="train" size={20} color={C.white} />
            <View style={styles.trainSmokeBubble} />
          </View>
        </Animated.View>
      </View>

      {/* Next Destination Card (Footer) */}
      <View style={styles.footer}>
        <View style={styles.destinationCard}>
          <View style={styles.destHeader}>
            <View>
              <Text style={styles.destLabel}>NEXT DESTINATION</Text>
              <Text style={styles.destTitle}>{nextLockedCity.name}</Text>
            </View>
            <View style={styles.destFuelBadge}>
              <MaterialIcons name="bolt" size={14} color={C.white} />
              <Text style={styles.destFuelText}>
                {fuelLeft > 0 ? `${fuelLeft} Fuel Left` : "Ready to unlock!"}
              </Text>
            </View>
          </View>

          {/* City Preview */}
          <View style={styles.previewBox}>
            <Image
              source={{ uri: nextLockedCity.landmarkImage }}
              style={styles.previewImage}
            />
            <View style={styles.previewTextWrap}>
              <Text style={styles.previewTitle}>Did You Know?</Text>
              <Text style={styles.previewDesc} numberOfLines={2}>
                {nextLockedCity.fact}
              </Text>
            </View>
          </View>

          {/* Action */}
          <View style={styles.destActionRow}>
            <View style={styles.rewardIcons}>
              <View style={styles.rewardRow}>
                <View style={styles.coinMini}>
                  <Text style={styles.coinText}>₵</Text>
                </View>
                <Text style={styles.rewardText}>+100</Text>
              </View>
              <View style={styles.rewardRow}>
                <MaterialIcons name="stars" size={16} color={C.secondary} />
                <Text style={styles.rewardText}>{nextLockedCity.badge ? "Badge" : "City Badge"}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.startBtn}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: "/practice/chapters",
                params: {
                  subjectId: "sub1",
                  subjectName: "Mathematics",
                }
              })}
            >
              <Text style={styles.startBtnText}>Start Mission</Text>
              <MaterialIcons name="rocket-launch" size={16} color={C.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── CITY DISCOVERY / LANDMARK DETAIL MODAL ── */}
      <Modal
        visible={!!selectedCity}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCity(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCity && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>{selectedCity.name}</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedCity(null)}
                  >
                    <MaterialIcons name="close" size={24} color={C.outline} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll}>
                  <Image
                    source={{ uri: selectedCity.landmarkImage }}
                    style={styles.landmarkBigImage}
                  />

                  <View style={styles.landmarkCard}>
                    <Text style={styles.landmarkLabel}>FAMOUS LANDMARK</Text>
                    <Text style={styles.landmarkTitle}>{selectedCity.landmark}</Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Fun Fact! 📖</Text>
                    <Text style={styles.infoText}>{selectedCity.fact}</Text>
                  </View>

                  <View style={styles.badgeSection}>
                    <Text style={styles.badgeSectionTitle}>REWARD COLLECTION</Text>
                    <View style={styles.badgeContainer}>
                      <LinearGradient
                        colors={[C.primary, C.secondary]}
                        style={styles.badgeGlow}
                      >
                        <MaterialIcons name="workspace-premium" size={32} color={C.secondaryContainer} />
                        <Text style={styles.badgeText}>{selectedCity.badge}</Text>
                      </LinearGradient>
                    </View>
                  </View>
                  
                  {selectedCity.unlocked ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: C.primary,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 14,
                        borderRadius: 16,
                        gap: 8,
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedCity(null);
                        router.push({
                          pathname: "/practice/chapters",
                          params: {
                            subjectId: "sub1",
                            subjectName: "Mathematics",
                          }
                        });
                      }}
                    >
                      <Text style={{ color: C.white, fontSize: 16, fontWeight: "700" }}>
                        Enter Chapter Journey 🚀
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.05)",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 14,
                        borderRadius: 16,
                        gap: 8,
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                    >
                      <MaterialIcons name="lock" size={18} color={C.outline} />
                      <Text style={{ color: C.outline, fontSize: 16, fontWeight: "700" }}>
                        Locked (Needs {CITIES.findIndex(c => c.name === selectedCity.name) * 500} Fuel)
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── CITY UNLOCK CELEBRATION MODAL ── */}
      <Modal
        visible={celebrationVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCelebrationVisible(false)}
      >
        <View style={styles.celebrationOverlay}>
          <LinearGradient
            colors={["rgba(20, 23, 121, 0.95)", "rgba(12, 14, 53, 0.98)"]}
            style={styles.celebrationGradient}
          >
            <MaterialIcons name="stars" size={80} color="#ffd700" style={styles.starGlow} />

            <Text style={styles.celebrationTitle}>🎉 Congratulations!</Text>
            <Text style={styles.celebrationSubtitle}>
              You unlocked {celebratingCity?.name}!
            </Text>

            <View style={styles.rewardsClaimCard}>
              <Text style={styles.rewardsClaimTitle}>YOUR EXPLORER REWARDS</Text>

              <View style={styles.claimRow}>
                <View style={styles.claimItem}>
                  <View style={styles.coinCircleBig}>
                    <Text style={styles.coinTextBig}>₵</Text>
                  </View>
                  <Text style={styles.claimValue}>100 Coins</Text>
                </View>

                <View style={styles.claimItem}>
                  <View style={styles.badgeCircleBig}>
                    <MaterialIcons name="workspace-premium" size={28} color="#ffd700" />
                  </View>
                  <Text style={styles.claimValue}>{celebratingCity?.name} Badge</Text>
                </View>

                <View style={styles.claimItem}>
                  <View style={styles.cardCircleBig}>
                    <MaterialIcons name="style" size={28} color="#57fae9" />
                  </View>
                  <Text style={styles.claimValue}>Collectible Card</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.collectBtn}
              activeOpacity={0.8}
              onPress={() => setCelebrationVisible(false)}
            >
              <Text style={styles.collectBtnText}>Collect Rewards & Continue</Text>
              <MaterialIcons name="double-arrow" size={20} color={C.white} />
            </TouchableOpacity>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.4)",
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 50,
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
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  boostBtn: {
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  boostText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },
  fuelContainer: {
    marginTop: 12,
  },
  fuelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
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
  fuelText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  fuelTrack: {
    height: 10,
    backgroundColor: "rgba(20, 23, 121, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  fuelFill: {
    height: "100%",
    borderRadius: 5,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#e0f7f6",
  },
  fogCircle: {
    position: "absolute",
    width: 250,
    height: 150,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    filter: "blur(30px)",
    pointerEvents: "none",
  },
  cityNode: {
    position: "absolute",
    alignItems: "center",
    width: 48,
    height: 64,
  },
  cityCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  cityUnlocked: {
    backgroundColor: C.secondary,
  },
  cityLocked: {
    backgroundColor: C.outlineVariant,
  },
  cityCurrentGlow: {
    shadowColor: C.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  fogCover: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: "center",
  },
  nameUnlocked: {
    color: C.primary,
  },
  nameLocked: {
    color: C.outline,
  },
  landmarkMini: {
    position: "absolute",
    top: -10,
    right: -6,
    backgroundColor: C.white,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 106, 98, 0.2)",
  },
  trainMarker: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  trainCard: {
    backgroundColor: C.primary,
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: C.secondaryContainer,
  },
  trainSmokeBubble: {
    position: "absolute",
    top: -8,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  footer: {
    padding: 16,
    backgroundColor: "transparent",
  },
  destinationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  destHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  destLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 1,
  },
  destTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
  },
  destFuelBadge: {
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  destFuelText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
  },
  previewBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(236, 238, 240, 0.5)",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  previewTextWrap: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  previewDesc: {
    fontSize: 11,
    color: C.onSurfaceVariant,
    lineHeight: 14,
  },
  destActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardIcons: {
    flexDirection: "row",
    gap: 12,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffd700",
    alignItems: "center",
    justifyContent: "center",
  },
  coinText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "800",
  },
  rewardText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  startBtn: {
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  startBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: C.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.75,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: C.white,
    borderBottomWidth: 1.5,
    borderBottomColor: "#eee",
  },
  modalHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    padding: 20,
  },
  landmarkBigImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  landmarkCard: {
    backgroundColor: C.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    marginBottom: 16,
  },
  landmarkLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  landmarkTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },
  infoSection: {
    gap: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
  },
  infoText: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
  badgeSection: {
    gap: 12,
    marginBottom: 40,
  },
  badgeSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 1,
  },
  badgeContainer: {
    alignItems: "center",
  },
  badgeGlow: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },
  badgeText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  celebrationGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  starGlow: {
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: C.white,
    textAlign: "center",
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: "#57fae9",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 32,
  },
  rewardsClaimCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  rewardsClaimTitle: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 20,
  },
  claimRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  claimItem: {
    alignItems: "center",
    gap: 8,
  },
  coinCircleBig: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffd700",
    alignItems: "center",
    justifyContent: "center",
  },
  coinTextBig: {
    color: C.white,
    fontSize: 24,
    fontWeight: "800",
  },
  badgeCircleBig: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderWidth: 1.5,
    borderColor: "#ffd700",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCircleBig: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(87, 250, 233, 0.2)",
    borderWidth: 1.5,
    borderColor: "#57fae9",
    alignItems: "center",
    justifyContent: "center",
  },
  claimValue: {
    color: C.white,
    fontSize: 12,
    fontWeight: "600",
  },
  collectBtn: {
    backgroundColor: C.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  collectBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
