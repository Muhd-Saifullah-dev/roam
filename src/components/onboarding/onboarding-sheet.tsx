import { ArrowRight, MapPin } from "lucide-react-native";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, GlassPill, GoogleLogo, PageIndicator, Text } from "@/components/ui";
import { motion } from "@/theme";

import { SheetCurve } from "./sheet-curve";
import type { OnboardingSlideData } from "./slides";

export type OnboardingSheetProps = {
  slide: OnboardingSlideData;
  index: number;
  count: number;
  width: number;
  onNext: () => void;
  onGoogle: () => void;
  /** True while Google sign-in is open. */
  googleLoading?: boolean;
};

/** Fixed footer over the photos; only the chip and copy change per slide. */
export function OnboardingSheet({
  slide,
  index,
  count,
  width,
  onNext,
  onGoogle,
  googleLoading,
}: OnboardingSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0">
      <Animated.View
        key={`chip-${index}`}
        entering={FadeIn.duration(motion.base)}
        pointerEvents="none"
        className="px-gutter pb-4"
      >
        <GlassPill tone="dark" icon={MapPin} label={slide.location} />
      </Animated.View>

      <SheetCurve width={width} className="text-surface" />
      <View className="bg-surface px-gutter" style={{ paddingBottom: insets.bottom }}>
        <View className="pb-2">
          <PageIndicator count={count} index={index} />
          <Animated.View key={`copy-${index}`} entering={FadeIn.duration(motion.base)}>
            <Text variant="hero" className="mt-5">
              {slide.headline}
            </Text>
            <Text variant="subtitle" weight="regular" tone="secondary" className="mt-3">
              {slide.body}
            </Text>
          </Animated.View>
          <View className="mt-6 gap-3">
            <Button title="Get started" trailingIcon={ArrowRight} onPress={onNext} />
            <Button
              title="Continue with Google"
              variant="secondary"
              leading={<GoogleLogo />}
              loading={googleLoading}
              onPress={onGoogle}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
