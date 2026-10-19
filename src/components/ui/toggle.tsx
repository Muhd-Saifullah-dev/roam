import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { motion, shadows } from "@/theme";

// Track w-14 (56) minus p-1 on both sides (8) minus thumb w-6 (24).
const TRAVEL = 24;

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  className?: string;
};

export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  className,
}: ToggleProps) {
  const x = useSharedValue(value ? TRAVEL : 0);
  useEffect(() => {
    x.value = withTiming(value ? TRAVEL : 0, { duration: motion.fast });
  }, [value, x]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      className={`h-8 w-14 justify-center rounded-full p-1 ${value ? "bg-primary" : "bg-border"} ${
        disabled ? "opacity-40" : ""
      } ${className ?? ""}`}
    >
      <Animated.View style={thumbStyle}>
        <View className="h-6 w-6 rounded-full bg-surface" style={{ boxShadow: shadows.card }} />
      </Animated.View>
    </Pressable>
  );
}
