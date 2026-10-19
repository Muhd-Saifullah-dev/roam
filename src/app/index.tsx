import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import { Button, Text, Wordmark } from "@/components/ui";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center gap-6 bg-surface-muted px-gutter">
      <Stack.Screen options={{ title: "Roam" }} />
      <View className="gap-2">
        <Wordmark />
        <Text variant="body" tone="secondary">
          Find unforgettable stays for every kind of trip.
        </Text>
      </View>
      <Button title="Open design system" onPress={() => router.push("/design-system")} />
    </View>
  );
}
