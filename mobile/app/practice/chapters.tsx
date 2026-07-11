import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { practiceApi, authApi, ChapterData } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  primary: "#141779",
  primaryContainer: "#2d328f",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHighest: "#e0e3e5",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
};

const chapterIcons = ["rocket-launch", "wb-sunny", "routine", "public", "mode-night"];

export default function ChaptersScreen() {
  const router = useRouter();
  const { subjectId, subjectName } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        try {
          const storedCompleted = await AsyncStorage.getItem("nrscholar_completed_chapters");
          if (storedCompleted !== null) {
            setCompletedChapters(JSON.parse(storedCompleted));
          }
        } catch (e) {
          console.error("Failed to load completed chapters progress", e);
        }
      };
      loadProgress();
    }, [])
  );

  useEffect(() => {
    if (subjectId) {
      loadData();
    } else {
      setLoading(false);
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [subjectId]);

  const loadData = async () => {
    try {
      const [chapRes, userRes] = await Promise.all([
        practiceApi.getChapters(String(subjectId)),
        authApi.getMe()
      ]);
      if (chapRes.success && chapRes.data) {
        setChapters(chapRes.data);
      }
      if (userRes.success) {
        setUser(userRes.data?.user || userRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = subjectName || "Solar System";
  
  // Calculate completed count and active index dynamically
  const completedChaptersCount = chapters.length > 0
    ? chapters.filter(ch => completedChapters.includes(ch._id)).length
    : 2;

  const totalChapters = chapters.length || 5;
  const progressPercent = totalChapters > 0 ? (completedChaptersCount / totalChapters) * 100 : 40;

  const currentChapterIndex = chapters.length > 0
    ? chapters.findIndex(ch => !completedChapters.includes(ch._id))
    : 2;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <View style={styles.root}>
      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{displayTitle}</Text>
          <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8} style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfj2X6XyApFBA2pBstnJTUCQiXa_6N8Aa5HyJFbmRfUns_QavfAGtkXx8Pf9gAdVWNo3VoZXk0XS5RlpTEZJmYXcySbZBisguP11eKxfswie0FivmvHgHxqpwrdPD_6XhBsZLkcBiKxRDQCmpAU26LfuGIYTvoA2rGBiUGUb2qCMzBmEvvu51A5cZKjZZZOLRCzskphl1WwKDNlmaTHLMDhpMTRg9nS0X6MSpqoK1pDZc_46uN3YyhgErTKiS9ZZf3EcwelgfWVg" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Progress Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryTextWrap}>
                  <Text style={styles.summaryLabel}>Mission Progress</Text>
                  <Text style={styles.summaryTitle}>{completedChaptersCount}/{totalChapters} Chapters Complete</Text>
                </View>
                <View style={styles.circularProgressContainer}>
                  <Text style={styles.circularProgressText}>{Math.round(progressPercent)}%</Text>
                  <Svg width="48" height="48" viewBox="0 0 48 48" style={styles.svgRing}>
                    <Circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke={C.secondary}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.linearProgressTrack}>
                <View style={[styles.linearProgressFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>

            {/* Chapter List */}
            <View style={styles.chapterList}>
              {chapters.length === 0 ? (
                // Fallback UI matching the HTML exactly if API returns no chapters
                <>
                  <ChapterCard status="completed" index={0} title="Introduction to Planets" icon="rocket-launch" router={router} subjectId={subjectId} subjectName={displayTitle} />
                  <ChapterCard status="completed" index={1} title="The Mighty Sun" icon="wb-sunny" router={router} subjectId={subjectId} subjectName={displayTitle} />
                  <ChapterCard status="current" index={2} title="Mercury & Venus" icon="routine" pulseAnim={pulseAnim} router={router} subjectId={subjectId} subjectName={displayTitle} />
                  <ChapterCard status="locked" index={3} title="Earth: Our Home" icon="public" router={router} subjectId={subjectId} subjectName={displayTitle} />
                  <ChapterCard status="locked" index={4} title="Mars: The Red Planet" icon="mode-night" router={router} subjectId={subjectId} subjectName={displayTitle} />
                </>
              ) : (
                chapters.map((chap, index) => {
                  const isCompleted = completedChapters.includes(chap._id);
                  const isCurrent = !isCompleted && (index === currentChapterIndex || (currentChapterIndex === -1 && index === chapters.length - 1));
                  const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";
                  const iconName = chapterIcons[index % chapterIcons.length];
                  return (
                    <ChapterCard 
                      key={chap._id}
                      status={status} 
                      index={index} 
                      title={chap.name} 
                      icon={iconName}
                      chapterId={chap._id}
                      subjectId={subjectId}
                      subjectName={displayTitle}
                      pulseAnim={pulseAnim}
                      router={router}
                    />
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const ChapterCard = ({ status, index, title, icon, chapterId, subjectId, subjectName, pulseAnim, router }: any) => {
  const handlePress = () => {
    if (status !== "locked") {
      router.push({
        pathname: "/practice/session",
        params: { 
          chapterId: chapterId || "mock", 
          chapterName: title,
          subjectId: subjectId ? String(subjectId) : "",
          subjectName: subjectName || ""
        }
      });
    }
  };

  if (status === "completed") {
    return (
      <TouchableOpacity style={styles.cardCompleted} activeOpacity={0.8} onPress={handlePress}>
        <View style={styles.iconBoxCompleted}>
          <MaterialIcons name={icon as any} size={24} color={C.secondary} />
        </View>
        <View style={styles.cardTextWrap}>
          <Text style={styles.cardLabelCompleted}>CHAPTER {index + 1}</Text>
          <Text style={styles.cardTitleCompleted}>{title}</Text>
        </View>
        <MaterialIcons name="check-circle" size={24} color={C.secondary} />
      </TouchableOpacity>
    );
  }

  if (status === "current") {
    return (
      <View style={styles.cardCurrent}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.iconBoxCurrent}>
          <MaterialIcons name={icon as any} size={24} color={C.white} />
        </View>
        <View style={styles.cardTextWrap}>
          <Text style={styles.cardLabelCurrent}>CHAPTER {index + 1}</Text>
          <Text style={styles.cardTitleCurrent}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.8} onPress={handlePress}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // locked
  return (
    <View style={styles.cardLocked}>
      <View style={styles.iconBoxLocked}>
        <MaterialIcons name={icon as any} size={24} color={C.outline} />
      </View>
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardLabelLocked}>CHAPTER {index + 1}</Text>
        <Text style={styles.cardTitleLocked}>{title}</Text>
      </View>
      <MaterialIcons name="lock" size={24} color={C.outline} />
    </View>
  );
};

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
    paddingHorizontal: 24,
    height: 64,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.white,
    overflow: "hidden",
    backgroundColor: C.primaryContainer,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  
  // Progress Summary Card
  summaryCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 16,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.outline,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
  },
  circularProgressContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "rgba(0, 106, 98, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circularProgressText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.secondary,
  },
  svgRing: {
    position: "absolute",
    transform: [{ rotate: "-90deg" }],
  },
  linearProgressTrack: {
    width: "100%",
    height: 10,
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 5,
    overflow: "hidden",
  },
  linearProgressFill: {
    height: "100%",
    backgroundColor: C.secondary,
    borderRadius: 5,
  },

  // Chapter List
  chapterList: {
    gap: 16,
  },
  cardTextWrap: {
    flex: 1,
  },

  // Completed Card
  cardCompleted: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
  },
  iconBoxCompleted: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 106, 98, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 106, 98, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelCompleted: {
    fontSize: 12,
    fontWeight: "700",
    color: C.secondary,
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  cardTitleCompleted: {
    fontSize: 18,
    fontWeight: "500",
    color: C.primary,
  },

  // Current Card
  cardCurrent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(87, 250, 233, 0.3)",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: "rgba(0, 106, 98, 0.3)",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  pulseCircle: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(0, 106, 98, 0.05)",
  },
  iconBoxCurrent: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  cardLabelCurrent: {
    fontSize: 12,
    fontWeight: "700",
    color: C.secondary,
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: "uppercase",
    zIndex: 10,
  },
  cardTitleCurrent: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
    zIndex: 10,
  },
  startBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
    zIndex: 10,
  },
  startBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "600",
  },

  // Locked Card
  cardLocked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceContainerLow,
    opacity: 0.6,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(118, 118, 131, 0.1)",
  },
  iconBoxLocked: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(118, 118, 131, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelLocked: {
    fontSize: 12,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  cardTitleLocked: {
    fontSize: 18,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },
});
