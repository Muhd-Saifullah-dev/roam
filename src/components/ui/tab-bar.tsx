import { BlurView } from "expo-blur";
import type { LucideIcon } from "lucide-react-native";
import type { RefObject } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { shadows } from "@/theme";

import { Icon } from "./icon";
import { Text } from "./text";

export type TabBarItem<K extends string> = {
  key: K;
  label: string;
  icon: LucideIcon;
};

export type TabBarProps<K extends string> = {
  items: TabBarItem<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Android only: the BlurTargetView behind the bar. Without it Android shows the glass tint only. */
  blurTarget?: RefObject<View | null>;
  className?: string;
};

/** Floating glass bottom navigation. Controlled; not tied to a navigator. */
export function TabBar<K extends string>({
  items,
  value,
  onChange,
  blurTarget,
  className,
}: TabBarProps<K>) {
  return (
    // Shadow on the outer view: the inner view clips (BlurView ignores borderRadius).
    <View className={`rounded-full ${className ?? ""}`} style={{ boxShadow: shadows.raised }}>
      <View
        accessibilityRole="tablist"
        className="h-tab-bar flex-row items-center overflow-hidden rounded-full border-2 border-surface px-2"
      >
        <BlurView
          intensity={40}
          tint="light"
          blurTarget={blurTarget}
          // Android blur needs a target; without one, "none" avoids the fallback warning.
          blurMethod={blurTarget ? "dimezisBlurViewSdk31Plus" : "none"}
          style={StyleSheet.absoluteFill}
        />
        <View className="absolute inset-0 bg-glass" />
        {items.map((item) => {
          const selected = item.key === value;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              onPress={() => onChange(item.key)}
              className="flex-1 items-center justify-center active:opacity-85"
            >
              <View
                // Same square size for every tab keeps icons aligned; only the active one is a yellow circle.
                className={`h-tab-active w-tab-active items-center justify-center gap-0.5 ${
                  selected ? "rounded-full bg-primary" : ""
                }`}
              >
                <Icon
                  as={item.icon}
                  size={24}
                  className="text-ink"
                  fillClassName={selected ? "text-ink" : undefined}
                />
                <Text variant="small" weight="medium">
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
