import { Image } from "expo-image";
import { Heart, MapPin, Star, type LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { Pressable, View, type PressableProps } from "react-native";

import { shadows } from "@/theme";

import { Badge } from "./badge";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Text } from "./text";

cssInterop(Image, { className: "style" });

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export type Listing = {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: { label: string; icon: LucideIcon }[];
};

export type ListingCardProps = Omit<PressableProps, "children" | "style"> & {
  listing: Listing;
  saved?: boolean;
  onToggleSave?: () => void;
  className?: string;
};

export function ListingCard({
  listing,
  saved = false,
  onToggleSave,
  className,
  ...props
}: ListingCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={listing.title}
      className={`flex-row items-start gap-3 rounded-xl bg-surface p-3 active:opacity-85 ${className ?? ""}`}
      style={{ boxShadow: shadows.card }}
      {...props}
    >
      {/* Fixed square: the photo never stretches with the text column. */}
      <View className="h-40 w-40 overflow-hidden rounded-lg">
        <Image
          source={{ uri: listing.imageUrl }}
          className="h-full w-full"
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
        />
        {onToggleSave && (
          <IconButton
            icon={Heart}
            size="sm"
            selected={saved}
            accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
            onPress={onToggleSave}
            className="absolute right-2 top-2"
          />
        )}
      </View>

      <View className="flex-1 gap-2">
        <Text variant="title" numberOfLines={2}>
          {listing.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon as={MapPin} size={16} className="text-ink-secondary" />
          <Text variant="caption" tone="secondary" weight="regular" numberOfLines={1}>
            {listing.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon as={Star} size={16} className="text-primary" fillClassName="text-primary" />
          <Text variant="caption">{listing.rating.toFixed(1)}</Text>
          <Text variant="caption" tone="secondary" weight="regular">
            ({listing.reviewCount})
          </Text>
        </View>
        {listing.amenities.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <Badge key={a.label} label={a.label} icon={a.icon} />
            ))}
          </View>
        )}
        <View className="flex-row items-baseline gap-1">
          <Text variant="title">{priceFormat.format(listing.pricePerNight)}</Text>
          <Text variant="caption" tone="secondary" weight="regular">
            / night
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
