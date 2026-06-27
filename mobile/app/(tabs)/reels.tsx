import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// ── Color tokens from Tailwind config ─────────────────────────────────────────
const C = {
  primary: "#141779",
  secondary: "#006a62",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  surfaceContainer: "#eceef0",
  primaryFixed: "#e0e0ff",
  primaryContainer: "#2d328f",
  onPrimaryContainer: "#9ba1ff",
  secondaryFixed: "#57fae9",
  white: "#ffffff",
  background: "#f7f9fb",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // State for interactive checkboxes
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete 2 Math Puzzles", subtitle: "Logic & Numbers", completed: false },
    { id: 2, title: 'Read "The Red Planet"', subtitle: "10 mins • Exploration", completed: false },
    { id: 3, title: "Practice Science Flashcards", subtitle: "5 Cards Done", completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progressPercentage = 65;
  const radius = 34;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <View style={styles.root}>
      {/* ── Top AppBar ── */}
      <BlurView intensity={80} tint="light" style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerLeft} onPress={() => router.push("/profile")}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtG-mTIj_Rfk67hRqHhpCaqyR7xsHMrotItaidGvdxfeeHgQJxuRiCVpXULU83xDTATGjaxUu5iwAad07wqQCCbC4TeEuysIHjtPyfmwCkSM_EnrgTTYYK9BFEmp-FK-qKxsobdXbmCFKSsncwFeE597KWLYJp2_6LRE0_aVoqXiykaS2kGNDOwOwFLKtpyAhOWBRJwvr6RzLmHp5ifhc97yHERbFpJHQ4aZN9Zwyu_s2UewiZQ4zTFn283RXebEtu0PqyfeaEA" }}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>Studysaathy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push("/notifications")}>
            <MaterialIcons name="notifications" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 64 + 16, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainHeading}>
            Your Missions, <Text style={{ color: C.secondary }}>Leo!</Text>
          </Text>
          <Text style={styles.subHeading}>Ready to conquer the stars today?</Text>
        </View>

        {/* Weekly Goal Card */}
        <View style={[styles.glassCard, styles.progressCard]}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>WEEKLY PROGRESS</Text>
            <Text style={styles.progressValue}>{progressPercentage}% Complete</Text>
            <Text style={styles.progressSub}>Almost at the finish line!</Text>
          </View>
          <View style={styles.ringWrapper}>
            <Svg width="80" height="80">
              <Circle
                cx="40"
                cy="40"
                r={radius}
                stroke={C.surfaceContainer}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <Circle
                cx="40"
                cy="40"
                r={radius}
                stroke={C.secondary}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin="40, 40"
              />
            </Svg>
            <View style={styles.ringTextWrap}>
              <Text style={styles.ringText}>{progressPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Task List */}
        <View style={styles.tasksSection}>
          <Text style={styles.tasksTitle}>Daily Missions</Text>
          
          {tasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              activeOpacity={0.9} 
              style={[styles.glassCard, styles.taskItem]}
              onPress={() => toggleTask(task.id)}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxActive]}>
                {task.completed && <MaterialIcons name="check" size={16} color={C.white} />}
              </View>
              <View style={styles.taskTextWrap}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
                  {task.title}
                </Text>
                <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
              </View>
              {task.completed && (
                <MaterialIcons name="check-circle" size={24} color={C.secondary} style={styles.taskCheckIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bonus Challenge Section */}
        <View style={styles.bonusSection}>
          <TouchableOpacity activeOpacity={0.9} style={[styles.bonusCard, styles.glowAccent]}>
            <View style={styles.bonusContent}>
              <View style={styles.bonusTagWrap}>
                <MaterialIcons name="auto-awesome" size={16} color={C.secondaryFixed} />
                <Text style={styles.bonusTag}>STELLAR CHALLENGE</Text>
              </View>
              <Text style={styles.bonusTitle}>Solve 3 Equations</Text>
              <Text style={styles.bonusSubtitle}>Earn 50 Bonus Stars!</Text>
            </View>
            <MaterialIcons name="rocket-launch" size={120} color={C.white} style={styles.bonusBgIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primaryFixed,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
  },
  notificationBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  mainHeading: {
    fontSize: 30,
    fontWeight: '700',
    color: C.primary,
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurfaceVariant,
    marginTop: 4,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderColor: C.glassBorder,
    borderWidth: 1.5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  progressInfo: {
    flex: 1,
    gap: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: C.secondary,
  },
  progressSub: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  ringWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  ringText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.secondary,
  },
  tasksSection: {
    gap: 12,
  },
  tasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    marginBottom: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  taskTextWrap: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: C.primary,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  taskCheckIcon: {
    marginLeft: 'auto',
  },
  bonusSection: {
    marginTop: 8,
  },
  bonusCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  glowAccent: {
    shadowColor: 'rgba(0, 106, 98, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 6,
  },
  bonusContent: {
    zIndex: 10,
    gap: 4,
  },
  bonusTagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bonusTag: {
    fontSize: 12,
    fontWeight: '700',
    color: C.primaryFixed,
    letterSpacing: 1,
  },
  bonusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.white,
  },
  bonusSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onPrimaryContainer,
  },
  bonusBgIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.2,
    zIndex: 1,
  },
});
