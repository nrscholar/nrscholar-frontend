import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { authApi } from "../services/api";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixedDim: "#2addcd",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  tertiary: "#30007f",
  tertiaryContainer: "#471ba5",
  error: "#ba1a1a",
  surface: "#f7f9fb",
  surfaceContainer: "#eceef0",
  surfaceContainerLow: "#f2f4f6",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  white: "#ffffff",
  background: "#f7f9fb",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export default function AssessmentHistory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Failed to load user in assessment-history", err);
      }
    };
    loadUser();
  }, []);

  const historyData = [
    {
      date: "May 17, 2024",
      items: [
        {
          id: 1,
          title: "Oceans & Marine Life",
          subtitle: "Science • Level 4",
          icon: "waves",
          score: "85%",
          trend: "+12%",
          trendUp: true,
          stars: 210,
        },
      ],
    },
    {
      date: "May 12, 2024",
      items: [
        {
          id: 2,
          title: "Algebraic Thinking",
          subtitle: "Math • Level 3",
          icon: "functions",
          score: "72%",
          trend: "-4%",
          trendUp: false,
          stars: 145,
        },
      ],
    },
    {
      date: "May 05, 2024",
      items: [
        {
          id: 3,
          title: "Solar System Explorer",
          subtitle: "Astronomy • Level 5",
          icon: "rocket-launch",
          score: "98%",
          trend: "+8%",
          trendUp: true,
          stars: 350,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Atmospheric Effect */}
      <View style={[styles.blurBlob, styles.blobTop]} />
      <View style={[styles.blurBlob, styles.blobBottom]} />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment History</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/profile")}>
          <MaterialIcons name="account-circle" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Filter/Search Section */}
        <View style={styles.filterSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={C.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics..."
              placeholderTextColor={C.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.dateBtn} activeOpacity={0.8}>
              <Text style={styles.dateBtnText}>May 2024</Text>
              <MaterialIcons name="calendar-month" size={18} color={C.onSecondaryContainer} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <MaterialIcons name="filter-list" size={20} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* History List Container */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {historyData.map((section, idx) => (
            <View key={idx}>
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <View style={styles.line} />
                <Text style={styles.dateHeaderText}>{section.date}</Text>
                <View style={styles.line} />
              </View>

              {/* Assessment Cards */}
              {section.items.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardLeft}>
                      <View style={styles.iconWrap}>
                        <MaterialIcons name={item.icon as any} size={24} color={C.primary} />
                      </View>
                      <View>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={[styles.scoreText, { color: item.trendUp ? C.secondary : C.onSurfaceVariant }]}>
                        {item.score}
                      </Text>
                      <View style={styles.trendRow}>
                        <MaterialIcons 
                          name={item.trendUp ? "trending-up" : "trending-down"} 
                          size={16} 
                          color={item.trendUp ? C.secondaryFixedDim : C.error} 
                        />
                        <Text style={[styles.trendText, { color: item.trendUp ? C.secondaryFixedDim : C.error }]}>
                          {item.trend}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardBottom}>
                    <View style={styles.starsWrap}>
                      <MaterialIcons name="stars" size={18} color={C.tertiary} />
                      <Text style={styles.starsText}>{item.stars} Stars Earned</Text>
                    </View>
                    <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.7}>
                      <Text style={styles.detailsText}>Details</Text>
                      <MaterialIcons name="chevron-right" size={16} color={C.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/dashboard')}>
          <MaterialIcons name="school" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/assessment-summary')}>
          <MaterialIcons name="insights" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="family-restroom" size={24} color={C.secondary} />
          <Text style={[styles.navText, { color: C.secondary, fontWeight: '700' }]}>Parents</Text>
          <View style={styles.activeDot} />
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
  blurBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.2,
  },
  blobTop: {
    top: '10%',
    left: '15%',
    backgroundColor: C.secondary,
  },
  blobBottom: {
    bottom: '20%',
    right: '10%',
    backgroundColor: C.primary,
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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  filterSection: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand',
    fontWeight: '500',
    color: C.onSurface,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  dateBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSecondaryContainer,
    fontFamily: 'Quicksand',
  },
  filterBtn: {
    padding: 8,
    backgroundColor: C.surfaceContainer,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  scrollList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    gap: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(199, 197, 212, 0.3)',
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.outline,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historyCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 23, 121, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  itemSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Quicksand',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Quicksand',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  starsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.tertiary,
    fontFamily: 'Quicksand',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 249, 251, 0.8)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    width: 60,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    marginTop: 4,
  },
  activeDot: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.secondary,
  },
});
