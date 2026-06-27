import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  surface: "#f7f9fb",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  outline: "#767683",
  onSurfaceVariant: "#464652",
  onSurface: "#191c1e",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
};

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.root}>
      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineContainer}>
          {/* Timeline Dashed Line */}
          <View style={styles.dashedLine} />

          {/* Task Reminder */}
          <View style={styles.notifItem}>
            <View style={[styles.iconBox, { backgroundColor: C.primary }]}>
              <MaterialIcons name="alarm" size={20} color={C.white} />
            </View>
            <View style={styles.cardWrapper}>
              <View style={styles.triangle} />
              <TouchableOpacity activeOpacity={0.8} style={styles.glassCard}>
                <Text style={styles.cardTitlePrimary}>Task Reminder</Text>
                <Text style={styles.cardDesc}>Daily Mission: 'The Red Planet' is waiting for you.</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* System Update 1 */}
          <View style={styles.notifItem}>
            <View style={[styles.iconBox, { backgroundColor: C.surfaceContainerHighest }]}>
              <MaterialIcons name="auto-awesome" size={20} color={C.primary} />
            </View>
            <View style={styles.cardWrapper}>
              <View style={styles.triangle} />
              <TouchableOpacity activeOpacity={0.8} style={styles.glassCard}>
                <Text style={styles.cardTitleOutline}>System Update</Text>
                <Text style={styles.cardDescMuted}>New Science lessons added to the Library.</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* System Update 2 (Pill Layout) */}
        <TouchableOpacity activeOpacity={0.8} style={styles.pillCard}>
          <View style={styles.pillIconBox}>
            <MaterialIcons name="auto-awesome" size={24} color={C.outline} />
          </View>
          <View style={styles.pillTextWrap}>
            <Text style={styles.cardTitleOutline}>System Update</Text>
            <Text style={styles.cardDescMuted}>New Science lessons added to the Library.</Text>
          </View>
        </TouchableOpacity>

        {/* Visual Anchor */}
        <View style={styles.visualAnchor}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcg9JTfpWdNOXpWuO22pAh-SmdrVfI0_D7ceGxeDxO3gO-tl8MfHIl2U2sOBoSOnMQxjKkQkUwK6nFeC7BJX9w_D87zfkhtbhlEtizN4c-C_BFnGPHsqutVbgyi8mzN5DIvrn9JnnMETaWneQo-LPHZ1mcXJ_KjTaLb2iDH6eQKZAhFWejwLoV_BrYdrbu2oYvv2-pxHMPTpNHeQbcPAC-aaCDkttqKHBsgbkXzDtN4wyNlmZnXrR4_vboBBJMBA5cEybt9xqJnA" }}
            style={styles.buddyImg}
          />
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
  header: {
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 64,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    marginLeft: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 32,
  },

  // Timeline
  timelineContainer: {
    position: "relative",
    paddingLeft: 4,
    gap: 24,
  },
  dashedLine: {
    position: "absolute",
    left: 23,
    top: 0,
    bottom: 0,
    width: 0,
    borderLeftWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(20, 23, 121, 0.3)", // primary/30
    zIndex: 0,
  },

  // Notif Item (Timeline style)
  notifItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    zIndex: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 4,
  },
  cardWrapper: {
    flex: 1,
    position: "relative",
  },
  triangle: {
    position: "absolute",
    left: -6,
    top: 20,
    width: 16,
    height: 16,
    backgroundColor: C.white,
    transform: [{ rotate: "45deg" }],
    zIndex: 0,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  cardTitlePrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: C.primary,
    marginBottom: 4,
  },
  cardTitleOutline: {
    fontSize: 14,
    fontWeight: "600",
    color: C.outline,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurface,
  },
  cardDescMuted: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },

  // Pill Card Layout
  pillCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: C.glassBg,
    borderRadius: 9999,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  pillIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  pillTextWrap: {
    flex: 1,
  },

  // Visual Anchor
  visualAnchor: {
    marginTop: 32,
    position: "relative",
    width: "100%",
    height: 192, // 48 * 4
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 106, 98, 0.1)", // secondary/10
    borderRadius: 999,
  },
  buddyImg: {
    width: 128,
    height: 128,
    resizeMode: "contain",
    zIndex: 10,
  },
});
