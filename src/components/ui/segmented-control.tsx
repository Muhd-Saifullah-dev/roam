import type { LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { motion, shadows } from "@/theme";

import { Icon } from "./icon";
import { Text } from "./text";

// Matches the container's p-1, so the indicator sits inside the padding.
const INSET = 4;

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const [width, setWidth] = useState(0);
  const segment = width > 0 ? (width - INSET * 2) / options.length : 0;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withTiming(index * segment, { duration: motion.base });
  }, [index, segment, x]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={`flex-row rounded-full bg-surface p-1 ${className ?? ""}`}
      style={{ boxShadow: shadows.card }}
    >
      {segment > 0 && (
        <Animated.View
          style={[
            { position: "absolute", top: INSET, bottom: INSET, left: INSET, width: segment },
            indicatorStyle,
          ]}
        >
          <View className="flex-1 rounded-full bg-ink" />
        </Animated.View>
      )}
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            className="h-12 flex-1 flex-row items-center justify-center gap-2"
          >
            {o.icon && (
              <Icon as={o.icon} size={20} className={selected ? "text-surface" : "text-ink"} />
            )}
            <Text variant="caption" tone={selected ? "inverse" : "default"}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
