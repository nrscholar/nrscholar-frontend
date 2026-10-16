import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface AppLoaderProps {
  message?: string;
  color?: string;
  size?: "small" | "large";
}

export default function AppLoader({
  message = "Loading...",
  color = "#141779",
  size = "large",
}: AppLoaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size={size} color={color} />
        {message ? <Text style={styles.text}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f9fb",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#141779",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(20, 23, 121, 0.06)",
  },
  text: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "700",
    color: "#141779",
    letterSpacing: 0.2,
  },
});
