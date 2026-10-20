import { ClerkProvider, useAuth, useClerk } from "@clerk/expo";
import { resourceCache } from "@clerk/expo/resource-cache";
import { tokenCache } from "@clerk/expo/token-cache";
// Per-weight imports, so only these five font files are bundled.
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_500Medium } from "@expo-google-fonts/plus-jakarta-sans/500Medium";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans/800ExtraBold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

SplashScreen.preventAutoHideAsync();

// Longest the splash waits for Clerk to restore a session before showing the app
// anyway. If Clerk loads later, the guards switch screens then.
const CLERK_LOAD_TIMEOUT_MS = 3000;

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      // Clerk tries the network once at startup and falls back to the last saved
      // session instead of retrying, so a slow or offline start doesn't stall.
      __experimental_resourceCache={resourceCache}
    >
      <RootNavigator />
    </ClerkProvider>
  );
}

/**
 * Guards routes on the Clerk session. When it changes, Expo Router drops the
 * screens that became protected and redirects, so screens never navigate after
 * sign-in or sign-out.
 */
function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { status } = useClerk();
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  // Clerk is settled once it has loaded, or failed ("error"), or the wait ran out.
  // Waiting on isLoaded alone hung on the splash forever when Clerk failed to load.
  const clerkSettled = isLoaded || status === "error" || clerkTimedOut;
  // The splash stays up until the session is restored, so onboarding never flashes.
  const ready = (fontsLoaded || !!fontError) && clerkSettled;

  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setClerkTimedOut(true), CLERK_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    // The splash covers LogBox, so say why startup went ahead without a session.
    if (status === "error") console.warn("Clerk failed to load; continuing signed out.");
    else if (clerkTimedOut && !isLoaded) console.warn(`Clerk still "${status}" after ${CLERK_LOAD_TIMEOUT_MS}ms; continuing signed out.`);
  }, [status, clerkTimedOut, isLoaded]);

  useEffect(() => {
    if (fontError) console.warn("Fonts failed to load:", fontError);
  }, [fontError]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/sign-up" />
        <Stack.Screen name="(auth)/verify" />
        <Stack.Screen name="(auth)/sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
