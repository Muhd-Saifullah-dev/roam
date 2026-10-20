import { View } from "react-native";

export type PageIndicatorProps = {
  count: number;
  index: number;
  className?: string;
};

/** Segmented progress for carousels; the active segment is lavender. */
export function PageIndicator({ count, index, className }: PageIndicatorProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Slide ${index + 1} of ${count}`}
      className={`flex-row gap-2 ${className ?? ""}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className={`h-1.5 w-8 rounded-full ${i === index ? "bg-lavender" : "bg-border"}`}
        />
      ))}
    </View>
  );
}
