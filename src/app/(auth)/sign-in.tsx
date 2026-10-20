import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowRight, Mail } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { AppleLogoPlaceholder } from "@/components/auth/apple-logo-placeholder";
import { AuthScreen } from "@/components/auth/auth-screen";
import { FooterLink } from "@/components/auth/footer-link";
import { useAuthForm } from "@/components/auth/use-auth-form";
import { useSocialSignIn } from "@/components/auth/use-social-sign-in";
import { validateEmail } from "@/components/auth/validation";
import { Button, Divider, GoogleLogo, Text, TextField } from "@/components/ui";
import { authError } from "@/lib/auth/clerk-errors";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const form = useAuthForm({ email: validateEmail });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading || !form.validate()) return;
    setLoading(true);
    const email = form.values.email.trim();
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    setLoading(false);
    if (error) {
      form.setError("email", authError(error).message);
      return;
    }
    router.push({ pathname: "/verify", params: { email, flow: "sign-in" } });
  };

  const social = useSocialSignIn();

  return (
    <AuthScreen
      footer={
        <FooterLink
          prompt="New to roam?"
          action="Sign up"
          onPress={() => router.replace("/sign-up")}
        />
      }
    >
      <Text variant="hero" className="mt-6">
        Welcome back
      </Text>
      <Text variant="subtitle" weight="regular" tone="secondary" className="mt-3">
        Sign in to see your saved stays and pick up where you left off.
      </Text>

      <View className="mt-6 gap-3">
        <TextField
          icon={Mail}
          label="Email address"
          placeholder="you@example.com"
          value={form.values.email}
          onChangeText={form.setField("email")}
          error={form.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>


      <Button
        title="Sign in"
        trailingIcon={ArrowRight}
        loading={loading}
        onPress={submit}
        className="mt-6"
      />

      <Divider label="or" className="my-4" />

      <View className="gap-3">
        <Button
          title="Continue with Google"
          variant="secondary"
          size="compact"
          leading={<GoogleLogo />}
          loading={social.pending === "google"}
          disabled={social.pending === "apple"}
          onPress={() => social.start("google")}
        />
        <Button
          title="Continue with Apple"
          variant="secondary"
          size="compact"
          leading={<AppleLogoPlaceholder />}
          loading={social.pending === "apple"}
          disabled={social.pending === "google"}
          onPress={() => social.start("apple")}
        />
      </View>
    </AuthScreen>
  );
}
