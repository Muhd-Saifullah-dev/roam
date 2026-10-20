import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { View } from "react-native";

import { Text } from "./text";

cssInterop(Image, { className: "style" });

const sizes = {
  lg: { box: "h-avatar w-avatar", text: "heading" },
  md: { box: "h-16 w-16", text: "title" },
} as const;

export type AvatarProps = {
  /** Photo URL. Without one, the initials of `name` show on yellow. */
  uri?: string;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?";
}

export function Avatar({ uri, name, size = "lg", className }: AvatarProps) {
  const s = sizes[size];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      className={`items-center justify-center overflow-hidden rounded-full bg-primary-soft ${s.box} ${className ?? ""}`}
    >
      {uri ? (
        <Image source={{ uri }} className="h-full w-full" contentFit="cover" transition={200} />
      ) : (
        <Text variant={s.text}>{initials(name)}</Text>
      )}
    </View>
  );
}
