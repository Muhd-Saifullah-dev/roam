import { Image } from "expo-image";
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import { cssInterop, useUnstableNativeVariable } from "nativewind";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { shadows } from "@/theme";

import { Icon } from "./icon";
import { Text } from "./text";

cssInterop(Image, { className: "style" });

export type StayCardProps = {
  title: string;
  location: string;
  rating: number;
  imageUrl: string;
  className?: string;
};

/** Large photo card: rating on top, location and title over a dark fade at the bottom. */
export function StayCard({ title, location, rating, imageUrl, className }: StayCardProps) {
  // SVG stops can't take classes; read the token's value instead.
  const ink = useUnstableNativeVariable("--color-ink") as string | undefined;

  return (
    <View
      accessible
      accessibilityLabel={`${title}, ${location}, rated ${rating.toFixed(1)}`}
      className={`h-stay-card overflow-hidden rounded-2xl bg-surface-muted ${className ?? ""}`}
    >
      <Image
        source={{ uri: imageUrl }}
        className="absolute inset-0"
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
      />
      {ink && (
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="stay-card-fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.4" stopColor={ink} stopOpacity={0} />
              <Stop offset="1" stopColor={ink} stopOpacity={0.7} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#stay-card-fade)" />
        </Svg>
      )}

      <View className="absolute right-3 top-3 h-10 flex-row items-center gap-1.5 rounded-full bg-surface px-3">
        <Icon as={Star} size={18} className="text-ink" fillClassName="text-ink" />
        <Text variant="title">{rating.toFixed(1)}</Text>
      </View>

      <View className="absolute inset-x-5 bottom-5 flex-row items-end gap-3">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-1.5">
            <Icon as={MapPin} size={18} className="text-surface" />
            <Text variant="caption" weight="regular" tone="inverse" numberOfLines={1}>
              {location}
            </Text>
          </View>
          <Text variant="heading" tone="inverse" numberOfLines={2}>
            {title}
          </Text>
        </View>
        {/* Decorative until stays have a detail screen. */}
        <View
          className="h-14 w-14 items-center justify-center rounded-full bg-surface"
          style={{ boxShadow: shadows.card }}
        >
          <Icon as={ChevronRight} size={24} className="text-ink" />
        </View>
      </View>
    </View>
  );
}
