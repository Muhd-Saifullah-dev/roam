import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowRight, Mail, User } from "lucide-react-native";
import { useRef, useState } from "react";
import { TextInput, View } from "react-native";

import { AppleLogoPlaceholder } from "@/components/auth/apple-logo-placeholder";
import { AuthScreen } from "@/components/auth/auth-screen";
import { FooterLink } from "@/components/auth/footer-link";
import { useAuthForm } from "@/components/auth/use-auth-form";
import { useSocialSignIn } from "@/components/auth/use-social-sign-in";
import { validateEmail, validateName } from "@/components/auth/validation";
import { Button, Divider, GoogleLogo, Text, TextField } from "@/components/ui";
import { authError } from "@/lib/auth/clerk-errors";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const form = useAuthForm({ name: validateName, email: validateEmail });
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);

  const submit = async () => {
    if (loading || !form.validate()) return;
    setLoading(true);
    const email = form.values.email.trim();
    // "Jane van Doe" → first "Jane", last "van Doe".
    const [firstName, ...rest] = form.values.name.trim().split(/\s+/);
    const lastName = rest.join(" ") || undefined;
    let { error } = await signUp.create({ emailAddress: email, firstName, lastName });
    if (!error) ({ error } = await signUp.verifications.sendEmailCode());
    setLoading(false);
    if (error) {
      const { field, message } = authError(error);
      form.setError(field === "name" ? "name" : "email", message);
      return;
    }
    router.push({ pathname: "/verify", params: { email, flow: "sign-up" } });
  };

  const social = useSocialSignIn();

  return (
    <AuthScreen
      footer={
        <FooterLink
          prompt="Already have an account?"
          action="Sign in"
          onPress={() => router.replace("/sign-in")}
        />
      }
    >
      <Text variant="hero" className="mt-6">
        Create your account
      </Text>
      <Text variant="subtitle" weight="regular" tone="secondary" className="mt-3">
        Join roam to save your stays, get personalized recommendations and access them across all
        your devices.
      </Text>

      <View className="mt-6 gap-3">
        <TextField
          icon={User}
          label="Full name"
          placeholder="e.g. Adrian Hajdin"
          value={form.values.name}
          onChangeText={form.setField("name")}
          error={form.errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
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
        title="Create account"
        trailingIcon={ArrowRight}
        loading={loading}
        onPress={submit}
        className="mt-6"
      />
      {/* Clerk bot protection mounts its challenge here. */}
      <View nativeID="clerk-captcha" />

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
