import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View, type PressableProps } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

export type PolicyCardProps = Omit<PressableProps, "children" | "style"> & {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function PolicyCard({ icon, title, description, className, ...props }: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      className={`flex-row items-center gap-4 rounded-lg bg-lavender-soft p-4 active:opacity-85 ${className ?? ""}`}
      {...props}
    >
      <View className="h-12 w-12 items-center justify-center rounded-md bg-lavender-muted">
        <Icon as={icon} className="text-lavender-strong" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="subtitle">{title}</Text>
        <Text variant="small" tone="secondary" numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Icon as={ChevronRight} size={20} className="text-lavender-strong" />
    </Pressable>
  );
}
