import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSocialSignIn } from "@/components/auth/use-social-sign-in";
import { OnboardingSheet } from "@/components/onboarding/onboarding-sheet";
import { slides, type OnboardingSlideData } from "@/components/onboarding/slides";
import { GlassPill, Wordmark } from "@/components/ui";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const list = useRef<FlatList<OnboardingSlideData>>(null);
  const [index, setIndex] = useState(0);
  const social = useSocialSignIn();

  const openSignUp = () => router.push("/sign-up");
  const next = () =>
    index < slides.length - 1
      ? list.current?.scrollToIndex({ index: index + 1 })
      : openSignUp();

  return (
    <View className="flex-1 bg-surface-muted">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Only the photos slide. */}
      <FlatList
        ref={list}
        data={slides}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index && i >= 0 && i < slides.length) setIndex(i);
        }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            contentFit="cover"
            transition={200}
            accessible={false}
            style={{ width, height }}
          />
        )}
      />

      <OnboardingSheet
        slide={slides[index]}
        index={index}
        count={slides.length}
        width={width}
        onNext={next}
        onGoogle={() => social.start("google")}
        googleLoading={social.pending === "google"}
      />

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0"
        style={{ paddingTop: insets.top }}
      >
        <View
          pointerEvents="box-none"
          className="flex-row items-center justify-between px-gutter pt-2"
        >
          <Wordmark height={32} />
          <GlassPill label="Skip" onPress={openSignUp} />
        </View>
      </View>
    </View>
  );
}
