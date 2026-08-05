import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
};

export default function RewardInventory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"Badges" | "Cities" | "Items">("Badges");
  const [coins, setCoins] = useState(420);
  const [fuel, setFuel] = useState(350);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedCoins = await AsyncStorage.getItem("nrscholar_coins");
        if (storedCoins !== null) setCoins(Number(storedCoins));
        const storedFuel = await AsyncStorage.getItem("nrscholar_fuel");
        if (storedFuel !== null) setFuel(Number(storedFuel));
      } catch (e) {
        console.error("Failed to load inventory stats", e);
      }
    };
    loadStats();
  }, []);

  const badges = [
    { id: "1", name: "Heritage Explorer", icon: "workspace-premium", desc: "Unlocked Ahmedabad", color: "#ffd700" },
    { id: "2", name: "Green Explorer", icon: "park", desc: "Unlocked Gandhinagar", color: "#2addcd" },
    { id: "3", name: "Math Master", icon: "calculate", desc: "5 correct math answers", color: "#ff6b6b" },
    { id: "4", name: "Streak Hero", icon: "local-fire-department", desc: "7 Days Learning Streak", color: "#ff9f43" },
  ];

  const cities = [
    { id: "1", name: "Ahmedabad", status: "Current Location 📍", rating: "★★★★★" },
    { id: "2", name: "Gandhinagar", status: "Unlocked 🎉", rating: "★★★★☆" },
    { id: "3", name: "Mehsana", status: "Locked 🔒", rating: "☆☆☆☆☆" },
    { id: "4", name: "Patan", status: "Locked 🔒", rating: "☆☆☆☆☆" },
  ];

  const items = [
    { id: "1", name: "Explorer Hat", icon: "face", type: "Avatar Item" },
    { id: "2", name: "Steam Engine Sticker", icon: "train", type: "Train Cosmetic" },
    { id: "3", name: "Double XP (30 Min)", icon: "trending-up", type: "XP Booster" },
    { id: "4", name: "Fuel Refill (+100)", icon: "bolt", type: "Fuel Booster" },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Inventory</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Currency summary card */}
        <View style={styles.currencyRow}>
          <View style={styles.currencyCard}>
            <Text style={styles.coinLogo}>₵</Text>
            <View>
              <Text style={styles.currencyVal}>{coins}</Text>
              <Text style={styles.currencyLbl}>COINS</Text>
            </View>
          </View>
          <View style={[styles.currencyCard, { backgroundColor: "rgba(87, 250, 233, 0.2)" }]}>
            <MaterialIcons name="bolt" size={24} color={C.primary} />
            <View>
              <Text style={styles.currencyVal}>{fuel}</Text>
              <Text style={styles.currencyLbl}>FUEL</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Badges", "Cities", "Items"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Lists */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {activeTab === "Badges" && (
          <View style={styles.grid}>
            {badges.map((item) => (
              <View key={item.id} style={styles.badgeCard}>
                <View style={[styles.badgeIconBg, { backgroundColor: item.color + "15" }]}>
                  <MaterialIcons name={item.icon as any} size={36} color={item.color} />
                </View>
                <Text style={styles.badgeName}>{item.name}</Text>
                <Text style={styles.badgeDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Cities" && (
          <View style={styles.column}>
            {cities.map((item) => (
              <View key={item.id} style={styles.cityRowItem}>
                <View style={styles.cityLeft}>
                  <MaterialIcons name="location-city" size={24} color={C.primary} />
                  <View>
                    <Text style={styles.cityNameText}>{item.name}</Text>
                    <Text style={styles.cityStatus}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.starsText}>{item.rating}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Items" && (
          <View style={styles.grid}>
            {items.map((item) => (
              <View key={item.id} style={styles.badgeCard}>
                <View style={styles.badgeIconBg}>
                  <MaterialIcons name={item.icon as any} size={32} color={C.primary} />
                </View>
                <Text style={styles.badgeName}>{item.name}</Text>
                <Text style={styles.badgeDesc}>{item.type}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    borderBottomWidth: 1.5,
    borderBottomColor: "#f0f0f0",
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
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  currencyRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  currencyCard: {
    flex: 1,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinLogo: {
    fontSize: 24,
    fontWeight: "900",
    color: C.orange,
  },
  currencyVal: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  currencyLbl: {
    fontSize: 9,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: C.white,
    padding: 6,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: C.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.outline,
  },
  tabTextActive: {
    color: C.white,
  },
  listContainer: {
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    backgroundColor: C.white,
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    gap: 8,
  },
  badgeIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
  },
  badgeDesc: {
    fontSize: 11,
    color: C.outline,
    textAlign: "center",
  },
  column: {
    gap: 12,
  },
  cityRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  cityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cityNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.primary,
  },
  cityStatus: {
    fontSize: 11,
    color: C.secondary,
    fontWeight: "600",
  },
  starsText: {
    fontSize: 14,
    color: C.yellow,
    fontWeight: "700",
  },
});
