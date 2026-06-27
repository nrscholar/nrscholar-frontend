import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert,
  Image,
  ScrollView
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { authApi, removeToken } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondary: "#ffffff",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHighest: "#e0e3e5",
  outline: "#767683",
  onSurfaceVariant: "#464652",
  onSurface: "#191c1e",
  error: "#ba1a1a",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.data?.user || res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive",
        onPress: async () => {
          await removeToken();
          router.replace("/login");
        }
      }
    ]);
  };

  return (
    <View style={styles.root}>
      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} /> {/* Spacer for centering */}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 100) }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFdm4gfOE1-GzTC6d-QUoqHFtqi21kkOcBjm9mzoawwKvqW3oQBfSmHbT-V38pzDohty7kgWDihAipg3ey_YbvNuXF6QxrW8sO_5USchFH3L5by9AXnOrxoGmEhz_fXlzMc3XBy9VsCdkrzp_5PqRiHEnNisKzaj-N4ufGtKTHZZuEf5gXUoIRuoYPAuwaMiuJn5w45vOge2n3MW_FnmvdUv0aN3EaojKJWU8AlFpyqn0WDBhYxlDqjha91bzeopk2nHTuUx0S5A" }} 
                    style={styles.avatarImg} 
                  />
                </View>
                <View style={styles.lvlBadge}>
                  <MaterialIcons name="military-tech" size={14} color={C.onSecondary} />
                  <Text style={styles.lvlText}>LVL {user?.level || 1}</Text>
                </View>
              </View>

              <View style={styles.nameSection}>
                <Text style={styles.name}>{user?.childName || user?.fullName?.split(' ')[0] || "Explorer"}</Text>
                <Text style={styles.role}>Explorer Extraordinaire</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <MaterialIcons name="star" size={24} color={C.secondary} style={styles.statIcon} />
                <Text style={styles.statValue}>{user?.totalStars ?? 0}</Text>
                <Text style={styles.statLabel}>Stars</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="verified" size={24} color={C.secondary} style={styles.statIcon} />
                <Text style={styles.statValue}>{user?.badges?.length ?? Math.max(0, Math.floor((user?.fuel ?? 350) / 100) - 2)}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="bolt" size={24} color={C.secondary} style={styles.statIcon} />
                <Text style={styles.statValue}>{user?.streakDays ?? 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>

            {/* Settings List */}
            <View style={styles.settingsList}>
              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.8}
                onPress={() => router.push("/parent")}
              >
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="family-restroom" size={24} color={C.primary} />
                  <Text style={styles.settingsItemText}>Parental Controls</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={C.outline} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.8}>
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="help-center" size={24} color={C.primary} />
                  <Text style={styles.settingsItemText}>Help Center</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={C.outline} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingsItem, { marginTop: 16 }]} 
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="logout" size={24} color={C.error} />
                  <Text style={[styles.settingsItemText, { color: C.error }]}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },
  header: {
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 64,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 32,
  },

  // Profile Header
  profileHeader: {
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: C.secondaryContainer,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: C.white,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  lvlBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lvlText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onSecondary,
    letterSpacing: 1,
  },
  nameSection: {
    alignItems: "center",
  },
  name: {
    fontSize: 30,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },
  role: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onSurfaceVariant,
    letterSpacing: 1,
  },

  // Settings List
  settingsList: {
    gap: 12,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.glassBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingsItemText: {
    fontSize: 18,
    fontWeight: "500",
    color: C.onSurface,
  },
});
