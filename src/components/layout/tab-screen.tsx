import type { Ref } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBarInset } from "./tab-bar-inset";

export type TabScreenProps = Omit<ScrollViewProps, "contentInsetAdjustmentBehavior"> & {
  ref?: Ref<ScrollView>;
  contentContainerClassName?: string;
};

/**
 * Root of every tab screen. Pads for the status bar on top and, at the bottom,
 * for the floating tab bar, so the last item always scrolls clear of it.
 */
export function TabScreen({ ref, contentContainerClassName, contentContainerStyle, children, ...props }: TabScreenProps) {
  const insets = useSafeAreaInsets();
  const barInset = useTabBarInset();

  return (
    <ScrollView
      ref={ref}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      className="flex-1 bg-surface"
      contentContainerClassName={`px-gutter pb-8 pt-4 ${contentContainerClassName ?? ""}`}
      contentContainerStyle={[{ marginTop: insets.top }, contentContainerStyle]}
      // Lets the scroll indicator stop above the bar.
      scrollIndicatorInsets={{ bottom: barInset }}
      {...props}
    >
      {children}
      <View style={{ height: barInset }} />
    </ScrollView>
  );
}
