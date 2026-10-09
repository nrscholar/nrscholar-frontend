import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  elevation?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  backgroundColor = "#ffffff",
  textColor = "#141779",
  elevation = true,
}: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Platform.OS === "android" ? (StatusBar.currentHeight || 24) : 12),
          backgroundColor,
        },
        elevation && styles.shadow,
      ]}
    >
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightContainer}>
          {rightAction || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(20, 23, 121, 0.06)",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#141779",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#767683",
    marginTop: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
