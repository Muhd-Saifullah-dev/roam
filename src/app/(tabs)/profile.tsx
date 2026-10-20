import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { View } from "react-native";

import { TabScreen } from "@/components/layout/tab-screen";
import { Avatar, Button, Text } from "@/components/ui";

// Signing out flips the root layout's guard, which returns the guest to onboarding.
export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName ?? email ?? "Guest";

  return (
    <TabScreen contentContainerClassName="gap-8">
      <Text variant="headline">Profile</Text>
      <View className="flex-row items-center gap-4">
        <Avatar size="md" name={name} uri={user?.hasImage ? user.imageUrl : undefined} />
        <View className="flex-1 gap-0.5">
          <Text variant="title" numberOfLines={1}>
            {name}
          </Text>
          {email && email !== name && (
            <Text variant="caption" tone="secondary" weight="regular" numberOfLines={1}>
              {email}
            </Text>
          )}
        </View>
      </View>
      <Button
        title="Sign out"
        variant="secondary"
        loading={signingOut}
        onPress={async () => {
          setSigningOut(true);
          try {
            await signOut();
          } finally {
            setSigningOut(false);
          }
        }}
      />
    </TabScreen>
  );
}
