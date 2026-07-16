import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ProgressBarProps {
  progress: number;
  colors: [string, string, ...string[]];
  trackStyle?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
}

export const ProgressBar = ({ progress, colors, trackStyle, fillStyle }: ProgressBarProps) => {
  return (
    <View style={[{ height: 10, backgroundColor: "rgba(20, 23, 121, 0.1)", borderRadius: 5, overflow: "hidden" }, trackStyle]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{ height: "100%", width: `${progress}%`, borderRadius: 5 }, fillStyle]}
      />
    </View>
  );
};
