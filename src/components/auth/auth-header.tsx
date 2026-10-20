import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";

import { IconButton, Wordmark } from "@/components/ui";

export function AuthHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between pt-2">
      <IconButton
        icon={ChevronLeft}
        size="nav"
        accessibilityLabel="Back"
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      />
      <Wordmark height={20} />
    </View>
  );
}
