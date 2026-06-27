import { Tabs, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authApi } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

function CustomTabBar({ state, navigation, controls }: any) {
  const insets = useSafeAreaInsets();

  // Match the keys with the route names and assign HTML-based icons
  const visibleItems = [
    { name: "index", label: "Home", icon: "home" },
    ...(controls.allowChat ? [{ name: "chat", label: "AI Chat", icon: "chat" }] : []),
    { name: "practice", label: "Library", icon: "menu-book" },
    ...(controls.allowReels ? [{ name: "reels", label: "Tasks", icon: "assignment-turned-in" }] : []),
    { name: "rewards", label: "Progress", icon: "leaderboard" },
  ];

  return (
    <BlurView intensity={60} tint="light" style={[styles.navBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {visibleItems.map((item) => {
        const routeIndex = state.routes.findIndex((r: any) => r.name === item.name);
        const isFocused = state.index === routeIndex;

        const onPress = () => {
          if (routeIndex === -1) return;
          const event = navigation.emit({
            type: "tabPress",
            target: state.routes[routeIndex]?.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.name);
          }
        };

        return (
          <TouchableOpacity
            key={item.name}
            onPress={onPress}
            activeOpacity={0.75}
            style={[styles.navItem, isFocused && styles.navItemActive]}
          >
            <MaterialIcons 
              name={item.icon as any} 
              size={24} 
              color={isFocused ? "#007168" : "#464652"} 
            />
            <Text style={[styles.navLabel, { color: isFocused ? "#007168" : "#464652" }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

export default function TabLayout() {
  const [controls, setControls] = useState({ allowChat: true, allowReels: true });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.parentControls) {
        setControls(res.data.parentControls);
      }
    } catch (e) {
      console.log("Layout load settings error", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f9fb", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#141779" size="large" />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} controls={controls} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" options={{ href: controls.allowChat ? undefined : null }} />
      <Tabs.Screen name="reels" options={{ href: controls.allowReels ? undefined : null }} />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="rewards" />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(247, 249, 251, 0.6)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 20,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: '#57fae9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
