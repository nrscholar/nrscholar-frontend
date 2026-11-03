import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { apiRequest } from "./services/api";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixed: "#57fae9",
  secondaryFixedDim: "#2addcd",
  onSecondaryFixed: "#00201d",
  surface: "#f7f9fb",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  primaryFixed: "#e0e0ff",
  outlineVariant: "#c7c5d4",
  outline: "#767683",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export default function HabitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    apiRequest("/api/habits/today", { auth: true }).then((r) => {
      if (r.success) setHabit(r.data);
      else setHabit({ title: "The Magic of Honesty", description: "Leo the Lion found a shiny coin that didn't belong to him. Instead of keeping it, he asked his friends if they lost it. Being honest made Leo feel even braver than his roar!" });
      setLoading(false);
    });
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      alert("Brilliant! +10 Points ✅");
      router.back();
    }, 1000);
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Elements */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAKVn9xa7Ti_J8T-zoZ3ynEZ6mJOWr0fMC42PX8I9NluRtuKibMc07OBY583RokuTgs1t8fEYpqU7uqvKxqNxx9vdeohuaGmnpD-5dtpQwq1M0G8Dp5y7iG3PIL4AElV-CqOp3hfgcWIGlmuas0t5yK4wk1BAZfqt2JN1U3nlvcTTfDxN-6pkHO6S_QogXJjJZf63EkXyTVE2N2e66-WDtl-X9bncG9ElpwT4DLKy-Q1KgiI6K7yOW-IZw7jpf3ZkMJzou82Pg" }}
              style={styles.avatar}
            />
            {/* Back indicator overlaid on avatar or we can just rely on the click */}
            <View style={styles.backOverlay}>
              <MaterialIcons name="arrow-back" size={16} color={C.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NR Scholar</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/notifications")}>
          <MaterialIcons name="notifications" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainHeading}>Good Habits & Values</Text>
          <Text style={styles.subHeading}>Sparkle like a Star today!</Text>
        </View>

        {/* Progress Orbit Tracker */}
        <View style={styles.trackerRow}>
          <View style={styles.trackerItem}>
            <View style={[styles.trackerCircle, { backgroundColor: C.secondaryFixed }]}>
              <MaterialIcons name="star" size={24} color={C.onSecondaryFixed} />
            </View>
            <Text style={styles.trackerLabel}>Day 1</Text>
          </View>
          <View style={styles.trackerItem}>
            <View style={[styles.trackerCircle, { backgroundColor: C.secondaryFixed }]}>
              <MaterialIcons name="star" size={24} color={C.onSecondaryFixed} />
            </View>
            <Text style={styles.trackerLabel}>Day 2</Text>
          </View>
          <View style={styles.trackerItem}>
            <View style={[styles.trackerCircleEmpty, { borderColor: C.secondaryFixedDim }]}>
              <MaterialIcons name="favorite" size={24} color={C.secondaryFixedDim} />
            </View>
            <Text style={styles.trackerLabel}>Today</Text>
          </View>
          <View style={[styles.trackerItem, { opacity: 0.4 }]}>
            <View style={[styles.trackerCircleEmpty, { borderColor: C.outlineVariant }]}>
              <MaterialIcons name="lock" size={24} color={C.outline} />
            </View>
            <Text style={styles.trackerLabel}>Day 4</Text>
          </View>
        </View>

        {/* Daily Lesson Card */}
        <View style={styles.glassCard}>
          <View style={styles.cardIconBox}>
            <MaterialIcons name="auto-awesome" size={36} color={C.primary} />
          </View>
          <Text style={styles.cardTitle}>{habit?.title || "The Magic of Honesty"}</Text>
          <Text style={styles.cardDesc}>
            {habit?.description || "Leo the Lion found a shiny coin that didn't belong to him. Instead of keeping it, he asked his friends if they lost it. Being honest made Leo feel even braver than his roar!"}
          </Text>

          {/* Interaction Button */}
          <TouchableOpacity 
            style={[styles.actionBtn, completed && { backgroundColor: C.secondary }]}
            activeOpacity={0.8}
            onPress={handleComplete}
            disabled={completed}
          >
            <Text style={styles.actionBtnText}>
              {completed ? "Brilliant! +10 Points" : "Complete Story"}
            </Text>
            <MaterialIcons name={completed ? "verified" : "celebration"} size={20} color={C.white} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },
  bgGlow1: {
    position: "absolute",
    top: "25%",
    left: -50,
    width: 150,
    height: 150,
    backgroundColor: "rgba(0, 106, 98, 0.1)",
    borderRadius: 100,
  },
  bgGlow2: {
    position: "absolute",
    bottom: "25%",
    right: -50,
    width: 180,
    height: 180,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    borderRadius: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(0, 106, 98, 0.2)",
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 32,
  },
  titleSection: {
    alignItems: "center",
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: C.secondary,
  },
  trackerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  trackerItem: {
    alignItems: "center",
    gap: 4,
  },
  trackerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.secondaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  trackerCircleEmpty: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  trackerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onSurfaceVariant,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIconBox: {
    width: 64,
    height: 64,
    backgroundColor: C.primaryFixed,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  actionBtn: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: C.primary,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.white,
  },
});
