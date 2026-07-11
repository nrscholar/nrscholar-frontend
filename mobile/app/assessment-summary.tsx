import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const C = {
  primary: "#141779",
  primaryContainer: "#2d328f",
  primaryFixedDim: "#bfc2ff",
  primaryFixed: "#e0e0ff",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  surface: "#f7f9fb",
  surfaceContainerHighest: "#e0e3e5",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
  background: "#f7f9fb",
  tertiary: "#30007f",
};

const CONFETTI_COLORS = ['#57fae9', '#141779', '#bfc2ff', '#006a62', '#ffdad6'];
const NUM_CONFETTI = 40;

const ConfettiPiece = ({ index }: { index: number }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const left = useRef(Math.random() * width).current;
  const color = useRef(CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]).current;
  const isCircle = useRef(Math.random() > 0.5).current;
  const duration = useRef(Math.random() * 3000 + 3000).current;
  
  useEffect(() => {
    // initial delay before first fall to stagger them
    setTimeout(() => {
      Animated.loop(
        Animated.timing(fallAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      ).start();
    }, Math.random() * 3000);
  }, [fallAnim, duration]);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, height + 50],
  });

  const rotate = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top: -20,
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: isCircle ? 4 : 2,
        transform: [{ translateY }, { rotate }],
        zIndex: 0,
      }}
    />
  );
};

export default function AssessmentSummary() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Floating animation for rocket
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const masteryProgress = 92;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (masteryProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Confetti Background Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </View>

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="menu" size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NR Scholar</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPi330Jn0m4Ju-QdTyxElmKEzS1nvZXgLAUHgkcNZ9oDk1LWGslJRxi9Gp57yzRvs7gZoIuC3Nhuh1HsMVlYVxj93yJo_RavUo85gHvTsBuic6vl8zGcYonFP4bfQLsMx83i_Gq2Ka1yV_p0I8anRK9yJgn7Vfo2rLoKxCDpx-YZ5eHc2zqYcUTsi2qplbVnpM5PzFxVkkOZFtx86zCQJf_RyQkl_LgxogY7aw88XZ3BM8BbWILHWDY3oWI002qj_WgT5tJ8Uxxw" }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Celebratory Header */}
        <View style={styles.heroSection}>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <MaterialIcons name="rocket-launch" size={64} color={C.secondary} />
          </Animated.View>
          <Text style={styles.heroTitle}>Great Job, Explorer!</Text>
          <Text style={styles.heroSubtitle}>Daily Quest Completed Successfully</Text>
        </View>

        {/* Central Summary Card (Bento Style) */}
        <View style={styles.bentoGrid}>
          {/* Topic Card */}
          <View style={[styles.glassCard, styles.topicCard]}>
            <View style={styles.topicIconWrap}>
              <MaterialIcons name="wb-sunny" size={24} color={C.secondary} />
            </View>
            <View>
              <Text style={styles.topicLabel}>COMPLETED TOPIC</Text>
              <Text style={styles.topicTitle}>Solar System</Text>
            </View>
          </View>

          <View style={styles.middleRow}>
            {/* Mastery Score */}
            <View style={[styles.glassCard, styles.masteryCard]}>
              <View style={styles.gaugeContainer}>
                <Svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: [{ rotate: "-90deg" }] }}>
                  <Circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={C.surfaceContainerHighest}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <Circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={C.secondary}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </Svg>
                <View style={styles.gaugeTextWrap}>
                  <Text style={styles.gaugePercent}>92%</Text>
                  <Text style={styles.gaugeLabel}>Mastery</Text>
                </View>
              </View>
            </View>

            {/* Rewards Column */}
            <View style={styles.rewardsCol}>
              <View style={[styles.glassCard, styles.rewardCard]}>
                <View style={[styles.rewardIconWrap, { backgroundColor: '#fef3c7' }]}>
                  <MaterialIcons name="stars" size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.rewardNum}>240</Text>
                  <Text style={styles.rewardLabel}>Stars Earned</Text>
                </View>
              </View>

              <View style={[styles.glassCard, styles.rewardCard]}>
                <View style={[styles.rewardIconWrap, { backgroundColor: C.primaryFixed }]}>
                  <MaterialIcons name="psychology" size={20} color={C.primary} />
                </View>
                <View>
                  <Text style={styles.rewardNum}>9/10</Text>
                  <Text style={styles.rewardLabel}>Confidence</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Concepts Learned Grid */}
          <View style={[styles.glassCard, styles.conceptsCard]}>
            <Text style={styles.conceptsTitle}>Concepts Mastered</Text>
            <View style={styles.chipsContainer}>
              {['The Sun', 'Planets', 'Gravity'].map((concept, idx) => (
                <View key={idx} style={styles.chip}>
                  <MaterialIcons name="check-circle" size={16} color={C.onSecondaryContainer} />
                  <Text style={styles.chipText}>{concept}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryBtnText}>Review Questions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(247, 249, 251, 0.8)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 50,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primaryContainer,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starGlow: {
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  bentoGrid: {
    width: '100%',
    maxWidth: 430,
    gap: 16,
    marginBottom: 24,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  topicIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    letterSpacing: 1,
    marginBottom: 2,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  middleRow: {
    flexDirection: 'row',
    gap: 16,
  },
  masteryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  gaugeContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercent: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  gaugeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  rewardsCol: {
    flex: 1,
    gap: 16,
  },
  rewardCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  rewardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardNum: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  conceptsCard: {
    padding: 16,
  },
  conceptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
    fontFamily: 'Quicksand',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(87, 250, 233, 0.3)',
    borderRadius: 9999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSecondaryContainer,
    fontFamily: 'Quicksand',
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 430,
    gap: 12,
    marginTop: 'auto',
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    backgroundColor: C.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    fontFamily: 'Quicksand',
  },
  secondaryBtn: {
    width: '100%',
    height: 56,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.primaryFixedDim,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
});
