import { router } from "expo-router";
import { CalendarHeart } from "lucide-react-native";
import { View } from "react-native";

import { TabScreen } from "@/components/layout/tab-screen";
import { Button, Icon, Text } from "@/components/ui";

// Bookings aren't built yet, so every guest sees the empty state.
export default function TripsScreen() {
  return (
    <TabScreen contentContainerClassName="flex-grow gap-8">
      <Text variant="headline">Trips</Text>
      <View className="flex-1 items-center justify-center gap-4 px-4 pb-20">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
          <Icon as={CalendarHeart} size={36} className="text-ink" />
        </View>
        <View className="items-center gap-2">
          <Text variant="title">No trips yet</Text>
          <Text variant="body" tone="secondary" className="text-center">
            Stays you book will show up here.
          </Text>
        </View>
        <Button title="Find a stay" onPress={() => router.navigate("/home")} />
      </View>
    </TabScreen>
  );
}
