import { Pressable, View } from "react-native";

import { Text } from "@/components/ui";

export type FooterLinkProps = {
  prompt: string;
  action: string;
  onPress: () => void;
  className?: string;
};

/** "Already have an account? Sign in" style row. */
export function FooterLink({ prompt, action, onPress, className }: FooterLinkProps) {
  return (
    <View className={`flex-row items-center gap-1.5 ${className ?? ""}`}>
      <Text variant="caption" weight="regular" tone="secondary">
        {prompt}
      </Text>
      <Pressable
        accessibilityRole="link"
        hitSlop={8}
        onPress={onPress}
        className="active:opacity-60"
      >
        <Text variant="caption" weight="semibold" className="underline">
          {action}
        </Text>
      </Pressable>
    </View>
  );
}
