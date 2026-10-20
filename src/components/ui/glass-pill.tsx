import { BlurView } from "expo-blur";
import type { LucideIcon } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

const tones = {
  light: { blur: "light", box: "", tint: "bg-glass", text: "default", icon: "text-ink" },
  dark: { blur: "dark", box: "border border-rim", tint: "bg-scrim", text: "inverse", icon: "text-surface" },
} as const;

export type GlassPillProps = {
  label: string;
  icon?: LucideIcon;
  /** light for controls on photos (Skip), dark for labels on photos (a location). */
  tone?: keyof typeof tones;
  /** Makes the pill a button. */
  onPress?: () => void;
  className?: string;
};

/** Frosted pill that floats on photos. */
export function GlassPill({ label, icon, tone = "light", onPress, className }: GlassPillProps) {
  const t = tones[tone];
  const box = `h-10 flex-row items-center gap-2 self-start overflow-hidden rounded-full px-4 ${t.box} ${className ?? ""}`;
  const content = (
    <>
      {/* Android blur needs a BlurTargetView; there the tint alone is used. */}
      {Platform.OS === "ios" && (
        <BlurView intensity={30} tint={t.blur} style={StyleSheet.absoluteFill} />
      )}
      <View className={`absolute inset-0 ${t.tint}`} />
      {icon && (
        <Icon as={icon} size={18} strokeWidth={2.5} className={t.icon} />
      )}
      <Text variant="caption" tone={t.text}>
        {label}
      </Text>
    </>
  );

  if (!onPress) return <View className={box}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`${box} active:opacity-85`}
    >
      {content}
    </Pressable>
  );
}
