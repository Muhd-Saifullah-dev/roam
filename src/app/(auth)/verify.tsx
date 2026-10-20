import { useSignIn, useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { AuthScreen } from "@/components/auth/auth-screen";
import { FooterLink } from "@/components/auth/footer-link";
import { Button, CodeInput, Text } from "@/components/ui";
import { authError } from "@/lib/auth/clerk-errors";

const RESEND_SECONDS = 30;

type Flow = "sign-up" | "sign-in";

export default function VerifyScreen() {
  const router = useRouter();
  const { email = "", flow = "sign-up" } = useLocalSearchParams<{ email: string; flow: Flow }>();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  // A code was just sent, so resending starts on cooldown.
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const fail = (message: string) => {
    setError(message);
    setCode("");
  };

  // The root layout's guard redirects to /home once the session is active, so
  // finalize only needs to catch session tasks (none are enabled yet).
  const finalizeParams = {
    navigate: ({ session }: { session: { currentTask?: unknown } }) => {
      if (session.currentTask) {
        Alert.alert("One more step", "Your account needs extra setup. Contact support to finish.");
      }
    },
  };

  const submit = async (value = code) => {
    if (loading || value.length < 6) return;
    setLoading(true);
    const resource = flow === "sign-in" ? signIn : signUp;
    const { error: verifyError } =
      flow === "sign-in"
        ? await signIn.emailCode.verifyCode({ code: value })
        : await signUp.verifications.verifyEmailCode({ code: value });
    const finalError =
      !verifyError && resource.status === "complete"
        ? (await resource.finalize(finalizeParams)).error
        : null;
    setLoading(false);
    if (verifyError || finalError) return fail(authError(verifyError ?? finalError).message);
    if (resource.status !== "complete") {
      fail("We couldn't finish signing you in. Try again or contact support.");
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
    setError(undefined);
    const { error: sendError } =
      flow === "sign-in"
        ? await signIn.emailCode.sendCode()
        : await signUp.verifications.sendEmailCode();
    if (sendError) setError(authError(sendError).message);
  };

  return (
    <AuthScreen
      footer={<FooterLink prompt="Wrong email?" action="Change it" onPress={() => router.back()} />}
    >
      <Text variant="hero" className="mt-6">
        Check your email
      </Text>
      <Text variant="subtitle" weight="regular" tone="secondary" className="mt-3">
        We sent a 6-digit code to{" "}
        <Text variant="subtitle" weight="semibold">
          {email}
        </Text>
        . Enter it below to verify your account.
      </Text>

      <CodeInput
        value={code}
        onChangeText={(value) => {
          setCode(value);
          if (error) setError(undefined);
        }}
        onComplete={submit}
        error={error}
        autoFocus
        className="mt-6"
      />

      <Button
        title="Verify"
        loading={loading}
        disabled={code.length < 6}
        onPress={() => submit()}
        className="mt-6"
      />

      <View className="mt-5 items-center">
        {cooldown > 0 ? (
          <Text variant="caption" weight="regular" tone="secondary">
            Resend in 0:{String(cooldown).padStart(2, "0")}
          </Text>
        ) : (
          <FooterLink prompt="Didn't get a code?" action="Resend code" onPress={resend} />
        )}
      </View>
    </AuthScreen>
  );
}
