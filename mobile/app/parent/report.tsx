import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle, Line, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { authApi, parentApi } from "../services/api";

const { width } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  tertiary: "#30007f",
  surface: "#ffffff",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHigh: "#e6e8ea",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  white: "#ffffff",
  background: "#f7f9fb",
  error: "#ba1a1a",
  warning: "#f39c12",
  info: "#00bbf9",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export default function StudentReport() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Daily");
  const [user, setUser] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number | null>(null);

  // Animations
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const userRes = await authApi.getMe();
        if (userRes.success) {
          setUser(userRes.data?.user || userRes.data);
        }
        const repRes = await parentApi.getReport();
        if (repRes.success && repRes.data) {
          setReportData(repRes.data);
          // Default to the last index of timeline history if available
          const timeline = repRes.data.dailyTimelineHistory || [];
          if (timeline.length > 0) {
            setSelectedTimelineIndex(timeline.length - 1);
          }
        }
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };
    loadReportData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Loading insights...</Text>
      </View>
    );
  }

  const dailyHistory = reportData?.dailyTimelineHistory || [];
  const subjectBreakdown = reportData?.subjectBreakdown || [];

  // SVG Chart Config
  const chartWidth = 280;
  const chartHeight = 120;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const getX = (index: number) => {
    if (dailyHistory.length <= 1) return paddingLeft;
    return paddingLeft + index * (chartWidth - paddingLeft - paddingRight) / (dailyHistory.length - 1);
  };

  const getY = (score: number) => {
    return paddingTop + (100 - score) * (chartHeight - paddingTop - paddingBottom) / 100;
  };

  // Build SVG Paths
  let masteryPath = "";
  let weaknessPath = "";
  let riskPath = "";
  let masteryAreaPath = "";

  if (dailyHistory.length > 0) {
    masteryPath = dailyHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.masteryScore)}`).join(' ');
    weaknessPath = dailyHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.weaknessScore)}`).join(' ');
    riskPath = dailyHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.riskIndex)}`).join(' ');
    masteryAreaPath = `${masteryPath} L ${getX(dailyHistory.length - 1)} ${chartHeight - paddingBottom} L ${getX(0)} ${chartHeight - paddingBottom} Z`;
  }

  const renderDailyTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Today's Activity */}
        <View style={styles.glassCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleBg}>
              <MaterialIcons name="schedule" size={20} color={C.secondary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Today's Activity</Text>
              <Text style={styles.cardSubtitle}>Great focus today!</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TIME SPENT</Text>
              <Text style={styles.statNum}>
                {reportData?.todayTimeMinutes ?? 0}
                <Text style={styles.statLabel}>m</Text>
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>QUESTIONS</Text>
              <Text style={[styles.statNum, { color: C.secondary }]}>
                {reportData?.todaySolved ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>ACCURACY SCORE</Text>
              <Text style={styles.progressPercent}>{reportData?.todayConfidenceScore ?? 0}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${reportData?.todayConfidenceScore ?? 0}%`, backgroundColor: C.primary }
                ]} 
              />
            </View>
            <Text style={styles.progressDesc}>{reportData?.risks || "+5% higher than yesterday"}</Text>
          </View>
        </View>

        {/* Trend Chart */}
        <View style={styles.glassCard}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="trending-up" size={20} color={C.primary} />
            <Text style={styles.cardTitle}>Daily Mastery & Risk Trend</Text>
          </View>

          {dailyHistory.length === 0 ? (
            <Text style={styles.emptyText}>Solve questions to begin generating trend analytics.</Text>
          ) : (
            <View>
              {/* Legend */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: C.info }]} />
                  <Text style={styles.legendLabel}>Mastery</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: C.warning }]} />
                  <Text style={styles.legendLabel}>Focus</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: C.error }]} />
                  <Text style={styles.legendLabel}>Risk Index</Text>
                </View>
              </View>

              {/* Svg Graph */}
              <View style={styles.svgContainer}>
                <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  <Defs>
                    <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor={C.info} stopOpacity="0.2"/>
                      <Stop offset="100%" stopColor={C.info} stopOpacity="0.0"/>
                    </SvgLinearGradient>
                  </Defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 50, 100].map((val) => (
                    <g key={val}>
                      <Line 
                        x1={paddingLeft} 
                        y1={getY(val)} 
                        x2={chartWidth - paddingRight} 
                        y2={getY(val)} 
                        stroke="#eef0f2" 
                        strokeWidth="1"
                      />
                      <SvgText 
                        x={paddingLeft - 6} 
                        y={getY(val) + 3} 
                        textAnchor="end" 
                        fontSize="8"
                        fontWeight="bold"
                        fill={C.outline}
                      >
                        {val}%
                      </SvgText>
                    </g>
                  ))}

                  {/* Area fill */}
                  {masteryAreaPath ? (
                    <Path d={masteryAreaPath} fill="url(#chartGrad)" />
                  ) : null}

                  {/* Line Paths */}
                  {masteryPath ? <Path d={masteryPath} fill="none" stroke={C.info} strokeWidth="2.5" strokeLinecap="round" /> : null}
                  {weaknessPath ? <Path d={weaknessPath} fill="none" stroke={C.warning} strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" /> : null}
                  {riskPath ? <Path d={riskPath} fill="none" stroke={C.error} strokeWidth="2.5" strokeLinecap="round" /> : null}

                  {/* Nodes & Touch targets */}
                  {dailyHistory.map((pt: any, i: number) => {
                    const isSelected = selectedTimelineIndex === i;
                    return (
                      <g key={i}>
                        <Circle 
                          cx={getX(i)} 
                          cy={getY(pt.masteryScore)} 
                          r={isSelected ? 4.5 : 2.5} 
                          fill={C.info} 
                          stroke={isSelected ? "#fff" : "transparent"}
                          strokeWidth="1.5"
                        />
                        <Circle 
                          cx={getX(i)} 
                          cy={getY(pt.riskIndex)} 
                          r={isSelected ? 4.5 : 2.5} 
                          fill={C.error} 
                          stroke={isSelected ? "#fff" : "transparent"}
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </Svg>

                {/* X Axis Labels */}
                <View style={styles.xAxisRow}>
                  {dailyHistory.map((pt: any, i: number) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => setSelectedTimelineIndex(i)}
                      style={[styles.xAxisBtn, selectedTimelineIndex === i && styles.xAxisBtnActive]}
                    >
                      <Text style={[styles.xAxisText, selectedTimelineIndex === i && styles.xAxisTextActive]}>
                        {pt.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Selected Day Stats Card */}
              {selectedTimelineIndex !== null && dailyHistory[selectedTimelineIndex] && (
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsTitle}>
                    Stats for {dailyHistory[selectedTimelineIndex].date}
                  </Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Mastery</Text>
                      <Text style={[styles.detailValue, { color: C.info }]}>
                        {dailyHistory[selectedTimelineIndex].masteryScore}%
                      </Text>
                    </View>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Focus Area</Text>
                      <Text style={[styles.detailValue, { color: C.warning }]}>
                        {dailyHistory[selectedTimelineIndex].weaknessScore}%
                      </Text>
                    </View>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Risk Index</Text>
                      <Text style={[styles.detailValue, { color: C.error }]}>
                        {dailyHistory[selectedTimelineIndex].riskIndex}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Subject Breakdown */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionHeaderTitle}>Subject Breakdown</Text>
          <View style={styles.subjectsList}>
            {subjectBreakdown.map((sb: any, idx: number) => {
              const icons = ["calculate", "biotech", "translate", "star"];
              const colors = [C.primary, C.secondary, C.tertiary, C.warning];
              const iconName = icons[idx % icons.length];
              const themeColor = colors[idx % colors.length];

              return (
                <View key={idx} style={styles.subjectItem}>
                  <View style={[styles.subjectIconWrap, { backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }]}>
                    <MaterialIcons name={iconName as any} size={20} color={themeColor} />
                  </View>
                  <View style={styles.subjectRight}>
                    <View style={styles.subjectLabelRow}>
                      <Text style={styles.subjectName}>{sb.subject}</Text>
                      <Text style={[styles.subjectScore, { color: themeColor }]}>{sb.accuracy}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { backgroundColor: themeColor, width: `${sb.accuracy}%` }]} />
                    </View>
                  </View>
                </View>
              );
            })}
            {subjectBreakdown.length === 0 && (
              <Text style={styles.emptyText}>Complete lessons to generate subject breakdowns.</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderMonthlyTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.glassCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircleBg, { backgroundColor: `${C.primary}15` }]}>
              <MaterialIcons name="calendar-today" size={20} color={C.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>This Month</Text>
              <Text style={styles.cardSubtitle}>
                {new Date().toLocaleString("default", { month: "long", year: "numeric" })} Overview
              </Text>
            </View>
          </View>

          <View style={styles.monthlyStatsWrapper}>
            <View style={styles.monthlyStatCell}>
              <Text style={styles.monthlyStatLabel}>ACTIVE DAYS</Text>
              <Text style={styles.monthlyStatNum}>
                {reportData?.monthlyStats?.activeDays ?? 0}
                <Text style={styles.monthlyStatDenom}>/{reportData?.monthlyStats?.totalDaysInMonth ?? 30}</Text>
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.monthlyStatCell}>
              <Text style={styles.monthlyStatLabel}>HOURS</Text>
              <Text style={[styles.monthlyStatNum, { color: C.secondary }]}>
                {reportData?.monthlyStats?.timeHours ?? 0}
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.monthlyStatCell}>
              <Text style={styles.monthlyStatLabel}>BOSSES</Text>
              <Text style={[styles.monthlyStatNum, { color: C.error }]}>
                {reportData?.monthlyStats?.bossesDefeated ?? 0}
              </Text>
            </View>
          </View>

          {/* Attention Needed */}
          <View style={styles.attentionBox}>
            <MaterialIcons name="error-outline" size={20} color={C.error} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.attentionTitle}>Attention Needed</Text>
              <Text style={styles.attentionDesc}>
                {reportData?.weaknesses || "Keep practicing to identify areas needing improvement."}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Badges */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionHeaderTitle}>Recent Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
            <View style={[styles.badgeItem, { backgroundColor: "#fffbeb", borderColor: "#fef3c7" }]}>
              <MaterialIcons name="emoji-events" size={28} color="#d97706" />
              <Text style={styles.badgeName}>Math Whiz</Text>
              <Text style={styles.badgeSub}>Recent</Text>
            </View>
            <View style={[styles.badgeItem, { backgroundColor: "#eff6ff", borderColor: "#dbeafe" }]}>
              <MaterialIcons name="local-fire-department" size={28} color="#2563eb" />
              <Text style={styles.badgeName}>7-Day Streak</Text>
              <Text style={styles.badgeSub}>Active</Text>
            </View>
            <View style={[styles.badgeItem, { backgroundColor: "#ecfdf5", borderColor: "#d1fae5" }]}>
              <MaterialIcons name="check-circle" size={28} color="#059669" />
              <Text style={styles.badgeName}>Consistent</Text>
              <Text style={styles.badgeSub}>Earned</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderSixMonthTab = () => {
    const trend = reportData?.sixMonthTrend || [];
    return (
      <View style={styles.tabContent}>
        <View style={styles.glassCard}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="bar-chart" size={22} color={C.tertiary} />
            <View>
              <Text style={styles.cardTitle}>6-Month Trend</Text>
              <Text style={styles.cardSubtitle}>Accuracy score per month</Text>
            </View>
          </View>

          {/* Bar Chart */}
          <View style={styles.barChartContainer}>
            {trend.map((m: any, i: number) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View 
                    style={[
                      styles.barFill, 
                      { height: `${Math.max(4, m.score)}%`, backgroundColor: C.tertiary }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{m.month}</Text>
              </View>
            ))}
            {trend.length === 0 && (
              <Text style={styles.emptyText}>Complete more quests to build your trend!</Text>
            )}
          </View>

          {(() => {
            if (trend.length < 2) return null;
            const first = trend[0]?.score ?? 0;
            const last = trend[trend.length - 1]?.score ?? 0;
            const diff = last - first;
            return (
              <View style={styles.trajectoryBox}>
                <Text style={styles.trajectoryTitle}>
                  {diff >= 0 ? "Upward Trajectory! 🚀" : "Keep Going! 💪"}
                </Text>
                <Text style={styles.trajectoryDesc}>
                  Accuracy {diff >= 0 ? 'increased' : 'changed'} by {Math.abs(diff)}% over 6 months.
                </Text>
              </View>
            );
          })()}
        </View>

        {/* Skill Evolution */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionHeaderTitle}>Skill Evolution</Text>
          <View style={styles.skillsList}>
            {subjectBreakdown.map((sb: any, i: number) => {
              const mastered = sb.accuracy >= 80;
              const improving = sb.accuracy >= 60;
              const statusText = mastered ? "Mastered" : improving ? "Improving" : "Needs Work";
              const statusColor = mastered ? "#059669" : improving ? "#2563eb" : "#d97706";
              const statusBg = mastered ? "#ecfdf5" : improving ? "#eff6ff" : "#fffbeb";

              return (
                <View key={i} style={styles.skillItem}>
                  <View style={styles.skillLeft}>
                    <MaterialIcons name="track-changes" size={18} color={C.secondary} />
                    <Text style={styles.skillName}>{sb.subject}</Text>
                  </View>
                  <View style={[styles.skillPill, { backgroundColor: statusBg }]}>
                    <Text style={[styles.skillPillText, { color: statusColor }]}>{statusText}</Text>
                  </View>
                </View>
              );
            })}
            {subjectBreakdown.length === 0 && (
              <Text style={styles.emptyText}>Play quests to unlock skill status mapping.</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderYearlyTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.glassCard, { alignItems: "center", paddingVertical: 24 }]}>
          <View style={styles.annualBadge}>
            <MaterialIcons name="stars" size={32} color={C.white} />
          </View>
          <Text style={styles.annualTitle}>{new Date().getFullYear()} Annual Review</Text>
          <Text style={styles.annualSubtitle}>Your child's learning journey so far</Text>

          <View style={styles.annualGrid}>
            <View style={[styles.annualBox, { backgroundColor: "#e0e0ff" }]}>
              <Text style={styles.annualBoxLabel}>TOTAL HOURS</Text>
              <Text style={[styles.annualBoxValue, { color: C.primary }]}>
                {reportData?.yearlyStats?.timeHours ?? 0}
              </Text>
            </View>
            <View style={[styles.annualBox, { backgroundColor: "#d7fdf5" }]}>
              <Text style={styles.annualBoxLabel}>LEVELS GAINED</Text>
              <Text style={[styles.annualBoxValue, { color: C.secondary }]}>
                {reportData?.yearlyStats?.levelsGained ?? 0}
              </Text>
            </View>
            <View style={[styles.annualBox, { backgroundColor: "#ffe8ed", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
              <View>
                <Text style={styles.annualBoxLabel}>QUESTIONS SOLVED</Text>
                <Text style={[styles.annualBoxValue, { color: C.tertiary }]}>
                  {reportData?.yearlyStats?.questionsSolved ?? 0}
                </Text>
              </View>
              <MaterialIcons name="done-all" size={36} color="rgba(48, 0, 127, 0.15)" />
            </View>
          </View>
        </View>

        {/* Recommendation Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <MaterialIcons name="emoji-objects" size={20} color="#facc15" />
            <Text style={styles.recommendationTitle}>Strengths & Recommendation</Text>
          </View>
          <Text style={styles.recommendationDesc}>
            {reportData?.strengths || "Keep learning and exploring to unlock personalised recommendations!"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="chevron-left" size={28} color={C.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSubtitle}>ACADEMIC YEAR {new Date().getFullYear() - 1}-{new Date().getFullYear() % 100}</Text>
            <Text style={styles.headerTitle}>Student Report</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="more-vert" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.7} style={styles.profileImageWrap}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsw5QM4ckfgV4r47k9iglGsrwO7NzpEQqaFt2Wapg5Z_iullDNHZxy8K3lBwww8wTKzKsTW4HZXRyvol6fP1If9EMT3e3dkzP8Txldwtfnye-t2qm4J4TE2zMuerwTlchYoY6EmHwK-sdI3eWHPDC4EZCEILl48U94yr2KphtMG5vQoDZPck6qzgiTs5t4IyRDqjUvKFWgeaT59xOPjiNk0I42Nx8wcybHADz8X62nhcVwziGPykMqrGGRBq_KqDJeU99U9Ss8hg" }}
              style={styles.profileImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>A+</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.profileTextWrap}>
            <Text style={styles.studentName}>{user?.childName || "Explorer"}</Text>
            <Text style={styles.studentInfo}>Lvl {user?.level || 1} Explorer</Text>
          </View>
          <View style={styles.overallWrap}>
            <Text style={styles.overallPercent}>92.4%</Text>
            <Text style={styles.overallLabel}>OVERALL</Text>
          </View>
        </View>
      </View>

      {/* Tabs list */}
      <View style={styles.tabsContainer}>
        {["Daily", "Monthly", "6 Months", "Yearly"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: contentFadeAnim }}>
          {activeTab === "Daily" && renderDailyTab()}
          {activeTab === "Monthly" && renderMonthlyTab()}
          {activeTab === "6 Months" && renderSixMonthTab()}
          {activeTab === "Yearly" && renderYearlyTab()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/dashboard')}>
          <MaterialIcons name="analytics" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/learning-dna')}>
          <MaterialIcons name="science" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>DNA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActiveBg} activeOpacity={0.9}>
          <MaterialIcons name="assessment" size={24} color={C.secondary} />
          <Text style={[styles.navText, { color: C.secondary }]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/settings')}>
          <MaterialIcons name="settings" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: C.white,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
    marginTop: 2,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.background,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileImageWrap: {
    position: "relative",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: C.white,
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: C.secondary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.white,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: C.white,
  },
  profileTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
  },
  studentInfo: {
    fontSize: 12,
    fontWeight: "600",
    color: C.outline,
    marginTop: 1,
  },
  overallWrap: {
    alignItems: "flex-end",
  },
  overallPercent: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
  },
  overallLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: C.white,
    elevation: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.outline,
  },
  tabBtnTextActive: {
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  tabContent: {
    gap: 16,
  },
  glassCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconCircleBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 106, 98, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: C.outline,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.background,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.5,
  },
  statNum: {
    fontSize: 22,
    fontWeight: "800",
    color: C.primary,
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: C.background,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "800",
    color: C.tertiary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(48, 0, 127, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressDesc: {
    fontSize: 11,
    fontWeight: "600",
    color: C.outline,
    marginTop: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onSurfaceVariant,
  },
  svgContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  xAxisBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  xAxisBtnActive: {
    backgroundColor: "rgba(20, 23, 121, 0.08)",
  },
  xAxisText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.outline,
  },
  xAxisTextActive: {
    color: C.primary,
  },
  detailsCard: {
    backgroundColor: "rgba(20, 23, 121, 0.04)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(20, 23, 121, 0.08)",
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 8,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailBox: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.outline,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.outline,
    textAlign: "center",
    marginVertical: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 16,
  },
  subjectsList: {
    gap: 12,
  },
  subjectItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subjectIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  subjectRight: {
    flex: 1,
  },
  subjectLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurface,
  },
  subjectScore: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 5,
    backgroundColor: "#eef0f2",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2.5,
  },
  monthlyStatsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.background,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  monthlyStatCell: {
    flex: 1,
    alignItems: "center",
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  monthlyStatLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.outline,
  },
  monthlyStatNum: {
    fontSize: 20,
    fontWeight: "800",
    color: C.primary,
    marginTop: 2,
  },
  monthlyStatDenom: {
    fontSize: 12,
    color: C.outline,
    fontWeight: "600",
  },
  attentionBox: {
    backgroundColor: "#fff7ed",
    borderColor: "#ffedd5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    gap: 10,
  },
  attentionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#c2410c",
  },
  attentionDesc: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9a3412",
    marginTop: 2,
    lineHeight: 15,
  },
  badgesScroll: {
    gap: 12,
  },
  badgeItem: {
    width: 100,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: "700",
    color: C.onSurface,
    marginTop: 6,
    textAlign: "center",
  },
  badgeSub: {
    fontSize: 9,
    fontWeight: "600",
    color: C.outline,
    marginTop: 2,
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 8,
    marginBottom: 16,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barTrack: {
    height: 80,
    width: 14,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.outline,
    marginTop: 6,
  },
  trajectoryBox: {
    alignItems: "center",
  },
  trajectoryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.onSurface,
  },
  trajectoryDesc: {
    fontSize: 11,
    fontWeight: "600",
    color: C.outline,
    marginTop: 2,
    textAlign: "center",
  },
  skillsList: {
    gap: 12,
  },
  skillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: C.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  skillLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skillName: {
    fontSize: 13,
    fontWeight: "600",
    color: C.onSurface,
  },
  skillPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  annualBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  annualTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.onSurface,
  },
  annualSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.outline,
    marginTop: 2,
    marginBottom: 16,
  },
  annualGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  },
  annualBox: {
    flex: 1,
    minWidth: "40%",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  annualBoxLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.5,
  },
  annualBoxValue: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  recommendationCard: {
    backgroundColor: C.primary,
    borderRadius: 20,
    padding: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.white,
  },
  recommendationDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(247, 249, 251, 0.9)",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    height: 80,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  navItemActiveBg: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: C.onSurfaceVariant,
  },
});

