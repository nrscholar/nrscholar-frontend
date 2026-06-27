import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { practiceApi, SubjectData } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";


// Color tokens from the new Tailwind config
const C = {
  background: "#f7f9fb",
  surface: "#f7f9fb",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  primary: "#141779",
  onPrimary: "#ffffff",
  primaryContainer: "#2d328f",
  secondary: "#006a62",
  secondaryFixedDim: "#2addcd",
  outline: "#767683",
  surfaceContainerHighest: "#e0e3e5",
  surfaceContainer: "#eceef0",
  tertiary: "#30007f",
  tertiaryFixed: "#e8ddff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

const FILTERS = ["All", "Books", "Videos", "Flashcards"];

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Responsive grid calculation
  let cols = 2;
  if (SCREEN_WIDTH >= 1024) cols = 8;
  else if (SCREEN_WIDTH >= 768) cols = 4;
  
  const gridGap = 12;
  const gridPadding = 48; // 24 padding horizontal on each side
  const availableWidth = SCREEN_WIDTH - gridPadding - (gridGap * (cols - 1));
  const cardWidth = Math.floor(availableWidth / cols);

  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await practiceApi.getSubjects();
      if (res.success && res.data) {
        setSubjects(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubject = (subject: SubjectData) => {
    router.push({
      pathname: "/practice/chapters",
      params: {
        subjectId: subject._id,
        subjectName: subject.name,
        subjectColor: subject.color,
      },
    });
  };

  return (
    <View style={[styles.root]}>
      {/* ── Top AppBar ── */}
      <BlurView intensity={80} tint="light" style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuBtn}>
              <MaterialIcons name="menu" size={24} color={C.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>StudySaathy</Text>
          </View>
          <View style={styles.headerAvatarContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJYwNiSB986HtSgkomFfzeNi7Dhcw9FJ_ws0Oyd92PpR1Jk7OyK80FUbtCA-AV1haYDpad5VdR3__JY07nODpL2_BrXQyC3VClClbGWKfn0daahUMIZiPS9OtJOW6o3TVJT1-EkNMXb1yvDs2AC4JuWZ8nNOIqPHIbBtLUu-OaPz1a20A3j5VVFIBeBdghCA0B1npufxXzO3ifNHQfb9NmwgARwAJw2w4f9uaZxlbBCUa6IMlg_tjAArAbhJnKMzBVicDuAwsE4A" }}
              style={styles.headerAvatar}
            />
          </View>
        </View>
      </BlurView>

      {/* ── Main Canvas ── */}
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 64 + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.glassPanel, styles.searchBox, styles.cosmicShadow]}>
            <MaterialIcons name="search" size={20} color={C.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your cosmos..."
              placeholderTextColor={C.outline + "99"}
            />
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersWrapper}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTERS.map(filter => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  isActive ? styles.filterBtnActive : styles.filterBtnInactive,
                  isActive && styles.activeGlow
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text style={isActive ? styles.filterTextActive : styles.filterTextInactive}>
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>
          
          <TouchableOpacity activeOpacity={0.9} style={[styles.glassPanel, styles.continueCard, styles.cosmicShadow]}>
            <View style={styles.continueImageWrap}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpk0RxIptAzLbM-4VDNdjVv0v5njIMlAi9L8GGXpxPm6UzCQxEoUI3P-MP1L2JwhXwvxXDFE2E7-YSNIwdQVv7RS4UmILDwNphtd4tFGd3KtjSsSpuAp8v0Ic99mKLYHCOwTSqs6hTy0u10ydtwph1gTfjuWLCh0Arhrtud5gHrBnyVpWp-KaB934MzEfmnlm6ktdR9xmh-cb6nIDLBZ2tHMA_U729NDSeddb38-KLNyD8U-jsdvMJ5efVCHt8kwUD35pNAP6kLg" }}
                style={styles.continueImage}
              />
            </View>
            <View style={styles.continueInfo}>
              <Text style={styles.continueTag}>ACTIVE MISSION</Text>
              <Text style={styles.continueTitle}>The Solar System</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% Explored</Text>
            </View>
            <View style={styles.rocketIconWrap}>
              <MaterialIcons name="rocket-launch" size={60} color={C.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Your Collection */}
        <View style={[styles.section, { flex: 1 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Your Collection</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
          ) : subjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No collections found.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {subjects.map((sub, idx) => {
                // Determine icon background tint based on color
                const iconBg = sub.color ? (sub.color + '30') : 'rgba(180,180,255,0.3)';
                
                return (
                  <TouchableOpacity
                    key={sub._id}
                    style={[styles.glassPanel, styles.gridCard, styles.cosmicShadow, { width: cardWidth }]}
                    activeOpacity={0.9}
                    onPress={() => handleSelectSubject(sub)}
                  >
                    <View style={[styles.gridIconWrap, { backgroundColor: iconBg }]}>
                      {sub.icon ? (
                        <Text style={{ fontSize: 36 }}>{sub.icon}</Text>
                      ) : (
                        <MaterialIcons name="menu-book" size={32} color={C.tertiary} />
                      )}
                    </View>
                    <View style={styles.gridTextWrap}>
                      <View style={styles.cardTagWrap}>
                        <Text style={styles.cardTagText}>SUBJECT</Text>
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={1}>{sub.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
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
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(20, 23, 121, 0.2)', // primary/20
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 24,
  },
  glassPanel: {
    backgroundColor: C.glassBg,
    borderColor: C.glassBorder,
    borderWidth: 1.5,
  },
  cosmicShadow: {
    shadowColor: 'rgba(20, 23, 121, 0.25)', // Increased alpha for visibility in RN
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeGlow: {
    shadowColor: 'rgba(87, 250, 233, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    padding: 0,
    height: 24,
  },
  filtersWrapper: {
    flexGrow: 0,
    marginBottom: 4,
  },
  filtersScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  filterBtnActive: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
  },
  filterBtnInactive: {
    backgroundColor: C.glassBg,
    borderColor: C.glassBorder,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
  },
  filterTextActive: {
    color: C.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextInactive: {
    color: C.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.secondary,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    overflow: 'hidden',
  },
  continueImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 50, 143, 0.1)',
    overflow: 'hidden',
  },
  continueImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  continueInfo: {
    flex: 1,
    zIndex: 2,
  },
  continueTag: {
    fontSize: 10,
    fontWeight: '700',
    color: C.secondary,
    letterSpacing: 1,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
    marginTop: 2,
    marginBottom: 8,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: C.surfaceContainer,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.secondaryFixedDim,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.outline,
    textAlign: 'right',
    marginTop: 6,
  },
  rocketIconWrap: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.1,
    zIndex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  gridIconWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridTextWrap: {
    marginTop: 4,
  },
  cardTagWrap: {
    alignSelf: 'flex-start',
    backgroundColor: C.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 6,
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.outline,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  }
});
