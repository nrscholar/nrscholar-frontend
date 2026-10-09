import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "inbox",
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  const handleAction = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    if (onAction) onAction();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialIcons name={icon} size={42} color="#141779" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionText && onAction ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAction}
          activeOpacity={0.85}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(20, 23, 121, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#141779",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
    color: "#767683",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: "#141779",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
