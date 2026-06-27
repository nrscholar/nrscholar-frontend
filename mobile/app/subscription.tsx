import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  onSecondary: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHighest: "#e0e3e5",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
  error: "#ba1a1a",
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isYearly, setIsYearly] = useState(false);
  const toggleAnim = React.useRef(new Animated.Value(0)).current;

  const toggleBilling = () => {
    const nextState = !isYearly;
    setIsYearly(nextState);
    Animated.timing(toggleAnim, {
      toValue: nextState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const circleTranslateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 24],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            activeOpacity={0.7} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="close" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Studysaathy</Text>
          <View style={{ width: 40 }} /> {/* Spacer for centering */}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Choose Your Plan</Text>
          <Text style={styles.heroSub}>Unlock your full potential with Saathy Pro.</Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, !isYearly && styles.activeToggleLabel]}>Monthly</Text>
          <TouchableOpacity 
            style={styles.toggleTrack} 
            activeOpacity={0.8}
            onPress={toggleBilling}
          >
            <Animated.View style={[styles.toggleCircle, { transform: [{ translateX: circleTranslateX }] }]} />
          </TouchableOpacity>
          <View style={styles.yearlyLabelContainer}>
            <Text style={[styles.toggleLabel, isYearly && styles.activeToggleLabel]}>Yearly</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 20%</Text>
            </View>
          </View>
        </View>

        {/* Plan Cards Container */}
        <View style={styles.plansContainer}>
          {/* Basic Plan */}
          <View style={styles.glassCard}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Basic</Text>
                <Text style={styles.planSub}>Free forever</Text>
              </View>
              <Text style={styles.planPrice}>₹0</Text>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={16} color={C.secondary} />
                <Text style={styles.featureText}>AI Tutor access</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={16} color={C.secondary} />
                <Text style={styles.featureText}>Daily Practice</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={16} color={C.secondary} />
                <Text style={styles.featureText}>1 Subject</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.basicBtn} disabled>
              <Text style={styles.basicBtnText}>Current Plan</Text>
            </TouchableOpacity>
          </View>

          {/* Pro Plan (Recommended) */}
          <View style={[styles.glassCard, styles.proCard]}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
            </View>

            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planTitle, { color: C.primary }]}>Pro</Text>
                <Text style={styles.planSub}>Accelerated Learning</Text>
              </View>
              <View style={styles.proPriceWrapper}>
                <View style={styles.proPriceRow}>
                  <Text style={[styles.planPrice, { color: C.primary }]}>
                    {isYearly ? "₹79" : "₹99"}
                  </Text>
                  <Text style={styles.proInterval}>/mo</Text>
                </View>
                {isYearly && (
                  <Text style={styles.billingSubtext}>Billed yearly at ₹950</Text>
                )}
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="auto-awesome" size={18} color={C.secondary} style={styles.orbitGlow} />
                <Text style={[styles.featureText, styles.proFeatureText]}>Unlimited AI Tutor</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="apps" size={18} color={C.secondary} />
                <Text style={[styles.featureText, styles.proFeatureText]}>All Subjects</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="fact-check" size={18} color={C.secondary} />
                <Text style={[styles.featureText, styles.proFeatureText]}>Weekly Tests</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="family-restroom" size={18} color={C.secondary} />
                <Text style={[styles.featureText, styles.proFeatureText]}>Detailed Parent Reports</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="visibility-off" size={18} color={C.secondary} />
                <Text style={[styles.featureText, styles.proFeatureText]}>Ad-free experience</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.proBtn} activeOpacity={0.8}>
              <Text style={styles.proBtnText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Detailed Comparison (Micro Table) */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonHeading}>Feature Breakdown</Text>
          
          <View style={styles.comparisonTable}>
            <View style={styles.tableRow}>
              <Text style={styles.featureLabel}>Interactive Games</Text>
              <View style={styles.badgeRow}>
                <MaterialIcons name="check" size={16} color={C.secondary} style={styles.cellIcon} />
                <MaterialIcons name="check" size={16} color={C.secondary} style={styles.cellIcon} />
              </View>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.featureLabel}>Personalized Roadmap</Text>
              <View style={styles.badgeRow}>
                <MaterialIcons name="remove" size={16} color={C.outlineVariant} style={styles.cellIcon} />
                <MaterialIcons name="check" size={16} color={C.secondary} style={styles.cellIcon} />
              </View>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.featureLabel}>Priority Support</Text>
              <View style={styles.badgeRow}>
                <MaterialIcons name="remove" size={16} color={C.outlineVariant} style={styles.cellIcon} />
                <MaterialIcons name="check" size={16} color={C.secondary} style={styles.cellIcon} />
              </View>
            </View>
          </View>
        </View>

        {/* Footer Policy */}
        <View style={styles.footer}>
          <View style={styles.secureRow}>
            <MaterialIcons name="lock" size={16} color={C.outline} />
            <Text style={styles.footerText}>Cancel anytime. Secure payment.</Text>
          </View>
          <Text style={styles.footerDisclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
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
    borderBottomWidth: 1.5,
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
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    textAlign: "center",
  },

  // Toggle Row
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: C.outline,
  },
  activeToggleLabel: {
    color: C.onSurface,
  },
  toggleTrack: {
    width: 56,
    height: 32,
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yearlyLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  saveBadge: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onSecondaryContainer,
  },

  // Plan Cards
  plansContainer: {
    gap: 20,
    marginBottom: 32,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  proCard: {
    borderWidth: 2,
    borderColor: C.secondary,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  recommendedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: C.secondary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomLeftRadius: 16,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onSecondary,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.onSurface,
  },
  planSub: {
    fontSize: 14,
    color: C.outline,
    fontWeight: "500",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "700",
    color: C.onSurface,
  },
  proPriceWrapper: {
    alignItems: "flex-end",
  },
  proPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  proInterval: {
    fontSize: 16,
    fontWeight: "600",
    color: C.outline,
  },
  billingSubtext: {
    fontSize: 10,
    color: C.secondary,
    fontWeight: "700",
    marginTop: 2,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  proFeatureText: {
    color: C.onSurface,
  },
  orbitGlow: {
    shadowColor: "rgba(42, 221, 205, 0.4)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  basicBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  basicBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.outline,
  },
  proBtn: {
    width: "100%",
    backgroundColor: C.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  proBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },

  // Comparison Section
  comparisonSection: {
    marginBottom: 32,
  },
  comparisonHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(199, 197, 212, 0.3)",
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 32,
  },
  cellIcon: {
    width: 24,
    textAlign: "center",
  },

  // Footer
  footer: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 24,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.outline,
  },
  footerDisclaimer: {
    fontSize: 10,
    color: C.outlineVariant,
    textAlign: "center",
    lineHeight: 14,
  },
});
