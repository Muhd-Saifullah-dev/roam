import { BlurView } from "expo-blur";
import type { LucideIcon } from "lucide-react-native";
import { useState, type RefObject } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { shadows } from "@/theme";

import { Icon } from "./icon";
import { Text } from "./text";

export type TabBarItem<K extends string> = {
  key: K;
  label: string;
  icon: LucideIcon;
  /** Fill the icon when active. Only for solid shapes (House, User); open ones like Search turn into blobs. */
  filled?: boolean;
};

export type TabBarProps<K extends string> = {
  items: TabBarItem<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Android only: the BlurTargetView behind the bar. Without it Android shows the glass tint only. */
  blurTarget?: RefObject<View | null>;
  className?: string;
};

/**
 * Floating glass bottom navigation, as in the design: the active tab is a yellow
 * circle holding its icon and label; the others show an ink icon over a label.
 * Tab switches don't animate. Controlled; not tied to a navigator.
 */
export function TabBar<K extends string>({
  items,
  value,
  onChange,
  blurTarget,
  className,
}: TabBarProps<K>) {
  // Half the measured size, so the active background is always a true circle
  // (it doesn't rely on a 9999 radius being clamped).
  const [radius, setRadius] = useState<number>();

  return (
    // Shadow on the outer view: the inner view clips (BlurView ignores borderRadius).
    <View className={`rounded-full ${className ?? ""}`} style={{ boxShadow: shadows.raised }}>
      <View
        accessibilityRole="tablist"
        className="h-tab-bar flex-row items-center overflow-hidden rounded-full border-2 border-surface px-1"
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
              className="h-full flex-1 items-center justify-center active:opacity-85"
            >
              <View
                // Same square for every tab keeps icons aligned; only the active one gets a yellow circle.
                // aspect-square keeps it square even if the slot is narrower than the token.
                onLayout={(e) => setRadius(e.nativeEvent.layout.height / 2)}
                className="aspect-square h-tab-active items-center justify-center gap-0.5"
              >
                {/* Its own view, mounted for the active tab only. Adding a background to an
                    existing view on Android can drop its rounded corners and show a square. */}
                {selected && (
                  <View
                    className="absolute inset-0 rounded-full bg-primary"
                    style={radius ? { borderRadius: radius } : undefined}
                  />
                )}
                <Icon
                  as={item.icon}
                  size={24}
                  className="text-ink"
                  fillClassName={selected && item.filled ? "text-ink" : undefined}
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
