import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

import { authError } from "@/lib/auth/clerk-errors";

export type SocialProvider = "google" | "apple";

const STRATEGY = { google: "oauth_google", apple: "oauth_apple" } as const;
const NAME = { google: "Google", apple: "Apple" } as const;

/**
 * Browser SSO through Clerk. On success the root layout's guard redirects to
 * /home, so nothing navigates here. Closing the browser sheet is not an error.
 */
export function useSocialSignIn() {
  const { startSSOFlow } = useSSO();
  const [pending, setPending] = useState<SocialProvider | null>(null);

  const start = async (provider: SocialProvider) => {
    if (pending) return;
    setPending(provider);
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: STRATEGY[provider],
      });
      if (createdSessionId && setActive) {
        // SSO is the one flow that still activates its session with setActive.
        await setActive({ session: createdSessionId });
      } else if (signUp?.status === "missing_requirements") {
        Alert.alert(
          "Couldn't finish sign-up",
          `Your ${NAME[provider]} account didn't share everything roam needs. Sign up with your email instead.`,
        );
      }
    } catch (error) {
      Alert.alert("Sign-in failed", authError(error).message);
    } finally {
      setPending(null);
    }
  };

  return { start, pending };
}
