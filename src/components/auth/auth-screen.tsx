import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthHeader } from "./auth-header";

export type AuthScreenProps = {
  children: ReactNode;
  /** Pinned to the bottom of the screen. */
  footer?: ReactNode;
};

/** Shared frame for auth screens: a fixed (non-scrolling) page, header, bottom footer. */
export function AuthScreen({ children, footer }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    // "position" slides the whole page up by however much the keyboard covers it.
    <KeyboardAvoidingView
      behavior="position"
      className="flex-1 bg-surface"
      contentContainerStyle={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      {/* Tapping outside a field closes the keyboard. */}
      <Pressable accessible={false} onPress={Keyboard.dismiss} className="flex-1">
        <View
          className="flex-1 px-gutter"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          <AuthHeader />
          {children}
          {footer && <View className="mt-auto items-center pb-2 pt-4">{footer}</View>}
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
