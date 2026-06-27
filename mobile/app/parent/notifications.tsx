import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { getNotifications, markAllRead, clearAll } from "../services/notifications";

const { width, height } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "rgba(87, 250, 233, 0.15)",
  onSecondaryContainer: "#007168",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  surface: "#f7f9fb",
  surfaceBright: "#f7f9fb",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.75)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
};

const CATEGORIES = {
  timer: {
    icon: "timer" as const,
    bgColor: "rgba(0, 106, 98, 0.1)",
    color: C.secondary,
  },
  lock: {
    icon: "lock" as const,
    bgColor: "rgba(0, 106, 98, 0.1)",
    color: C.secondary,
  },
  "bar-chart": {
    icon: "bar-chart" as const,
    bgColor: "rgba(0, 106, 98, 0.1)",
    color: C.secondary,
  },
  verified: {
    icon: "verified" as const,
    bgColor: "rgba(0, 106, 98, 0.1)",
    color: C.secondary,
  },
  notifications: {
    icon: "notifications" as const,
    bgColor: "rgba(20, 23, 121, 0.1)",
    color: C.primary,
  },
};

export default function ParentalAlertsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values for subtle drift background circles
  const driftAnim1 = useRef(new Animated.Value(0)).current;
  const driftAnim2 = useRef(new Animated.Value(0)).current;

  // State
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Drifting background animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim1, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(driftAnim1, {
          toValue: 0,
          duration: 25000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim2, {
          toValue: 1,
          duration: 30000,
          useNativeDriver: true,
        }),
        Animated.timing(driftAnim2, {
          toValue: 0,
          duration: 30000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    loadAlerts();
  }, []);

  const loadAlerts = () => {
    // Fetch real notifications for role "parent"
    const realNotifs = getNotifications("parent");

    // Format database notifications
    const formattedReal = realNotifs.map((n) => {
      let iconName: keyof typeof CATEGORIES = "notifications";
      if (n.category === "control") {
        iconName = n.title.toLowerCase().includes("time") ? "timer" : "lock";
      } else if (n.category === "test") {
        iconName = "bar-chart";
      } else if (n.category === "exam" || n.category === "streak") {
        iconName = "verified";
      }

      return {
        id: n.id,
        title: n.title,
        body: n.body,
        timestamp: n.timestamp,
        iconName,
        read: n.read,
        timeLabel: timeAgo(n.timestamp),
        isToday: Date.now() - n.timestamp < 86400000,
      };
    });

    // High fidelity template alerts matching user HTML design
    const mockAlerts = [
      {
        id: "mock-1",
        title: "Screen Time Alert",
        body: "Your child has reached their 30-minute daily learning limit.",
        timestamp: Date.now() - 3600000 * 2, // 2 hours ago
        iconName: "timer" as const,
        read: false,
        timeLabel: "10:45 AM",
        isToday: true,
      },
      {
        id: "mock-2",
        title: "Security Update",
        body: "Your Parental PIN was successfully changed via mobile device.",
        timestamp: Date.now() - 3600000 * 5, // 5 hours ago
        iconName: "lock" as const,
        read: false,
        timeLabel: "08:20 AM",
        isToday: true,
      },
      {
        id: "mock-3",
        title: "New Activity Report",
        body: "The weekly learning summary for Explorer Leo is ready to view.",
        timestamp: Date.now() - 86400000, // yesterday
        iconName: "bar-chart" as const,
        read: true,
        timeLabel: "Yesterday",
        isToday: false,
      },
      {
        id: "mock-4",
        title: "Mission Accomplished",
        body: "Leo completed the \"Solar System Odyssey\" module with 95% accuracy!",
        timestamp: Date.now() - 86400000 * 3, // 3 days ago
        iconName: "verified" as const,
        read: true,
        timeLabel: "Sat",
        isToday: false,
      },
    ];

    // Combine: database items first, followed by default design cues
    const combined = [...formattedReal];
    mockAlerts.forEach((mock) => {
      // Avoid inserting duplicates if mock alert key is somehow mapped
      if (!combined.some((c) => c.title === mock.title && c.body === mock.body)) {
        combined.push(mock);
      }
    });

    setItems(combined);
  };

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Grouping
  const todayAlerts = items.filter((item) => item.isToday || Date.now() - item.timestamp < 86400000);
  const earlierAlerts = items.filter((item) => !item.isToday && Date.now() - item.timestamp >= 86400000);

  // Background Drift Transforms
  const driftX1 = driftAnim1.interpolate({ inputRange: [0, 1], outputRange: [-20, 40] });
  const driftY1 = driftAnim1.interpolate({ inputRange: [0, 1], outputRange: [20, -50] });

  const driftX2 = driftAnim2.interpolate({ inputRange: [0, 1], outputRange: [50, -30] });
  const driftY2 = driftAnim2.interpolate({ inputRange: [0, 1], outputRange: [-30, 40] });

  const handleClearAll = () => {
    Alert.alert("Clear Alerts", "Are you sure you want to clear all parent notifications?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          clearAll("parent");
          setItems([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Drifting soft background glows */}
      <Animated.View style={[styles.glowCircle1, { transform: [{ translateX: driftX1 }, { translateY: driftY1 }] }]} />
      <Animated.View style={[styles.glowCircle2, { transform: [{ translateX: driftX2 }, { translateY: driftY2 }] }]} />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color={C.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Parental Alerts</Text>
          </View>

          <TouchableOpacity
            style={styles.moreBtn}
            activeOpacity={0.7}
            onPress={handleClearAll}
          >
            <MaterialIcons name="more-vert" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Scroll View */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 40) + 90 }, // Extra padding for simulated bottom navbar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Group */}
        {todayAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today</Text>
            <View style={styles.listContainer}>
              {todayAlerts.map((item) => {
                const cat = CATEGORIES[item.iconName as keyof typeof CATEGORIES] || CATEGORIES.notifications;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    style={[styles.glassCard, !item.read && styles.unreadBorder]}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
                      <MaterialIcons name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardTime}>{item.timeLabel}</Text>
                      </View>
                      <Text style={styles.cardBody}>{item.body}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Earlier Group */}
        {earlierAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earlier</Text>
            <View style={styles.listContainer}>
              {earlierAlerts.map((item) => {
                const cat = CATEGORIES[item.iconName as keyof typeof CATEGORIES] || CATEGORIES.notifications;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    style={[styles.glassCard, styles.earlierCard, !item.read && styles.unreadBorder]}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
                      <MaterialIcons name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardTime}>{item.timeLabel}</Text>
                      </View>
                      <Text style={styles.cardBody}>{item.body}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Caught Up cosmic banner */}
        <View style={styles.emptyContainer}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM0vvfTag7Cx1NUBqUsnpK7m6714DuIU8pSG1yQYsI9I8RKVQCLbcrMkdJIljkHUGWO_FRNYZ_ucUCGw9I05Tc2ZucgSWVpKpxrNbHJACymaT-DYSvBl0G4KJbtNrZmHoRUlnyyqXF2zbsYg6iA1lze87W_He-eAFzr6wsuQcj2iRsTpfnA14hUvtA0RgT-VPebil0R6z_79PsxJjNgRy8lfeSJqwb3hMT6Hr5fav7xx95_poPS3DjWh_rWW4rePH5zJg2bhg0XA",
            }}
            style={styles.cosmicImg}
          />
          <Text style={styles.emptyText}>You're all caught up, Commander.</Text>
        </View>
      </ScrollView>

      {/* Simulated Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {/* Learning */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/(tabs)")}
        >
          <MaterialIcons name="school" size={24} color={C.outline} />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>

        {/* Insights */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/progress")}
        >
          <MaterialIcons name="insights" size={24} color={C.outline} />
          <Text style={styles.navText}>Insights</Text>
        </TouchableOpacity>

        {/* Parents (Active) */}
        <TouchableOpacity
          style={styles.navItemActive}
          activeOpacity={0.7}
          onPress={() => router.replace("/parent/dashboard")}
        >
          <MaterialIcons name="family-restroom" size={26} color={C.secondary} />
          <Text style={styles.navTextActive}>Parents</Text>
          <View style={styles.activeDot} />
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/(tabs)/profile")}
        >
          <MaterialIcons name="settings" size={24} color={C.outline} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surfaceBright,
  },
  glowCircle1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(20, 23, 121, 0.02)",
    top: height * 0.15,
    left: -50,
    zIndex: 0,
  },
  glowCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0, 106, 98, 0.02)",
    bottom: height * 0.2,
    right: -100,
    zIndex: 0,
  },
  header: {
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 64,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  moreBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    zIndex: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.outline,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingHorizontal: 8,
    fontFamily: "Quicksand",
  },
  listContainer: {
    gap: 16,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadBorder: {
    borderColor: C.secondary,
    borderWidth: 1.5,
  },
  earlierCard: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 10,
    color: C.outline,
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  cardBody: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "Quicksand",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    opacity: 0.5,
    gap: 10,
  },
  cosmicImg: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.5,
    fontFamily: "Quicksand",
  },

  // Bottom Nav styling matching HTML high fidelity
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(247, 249, 251, 0.9)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.outline,
    marginTop: 4,
    fontFamily: "Quicksand",
  },
  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    transform: [{ scale: 1.1 }],
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: "700",
    color: C.secondary,
    marginTop: 2,
    fontFamily: "Quicksand",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.secondary,
    marginTop: 4,
  },
});
