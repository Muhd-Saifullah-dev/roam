import { View } from "react-native";

import { Text } from "./text";

export type DividerProps = {
  /** Text in the middle, e.g. "or". */
  label?: string;
  className?: string;
};

export function Divider({ label, className }: DividerProps) {
  return (
    <View className={`flex-row items-center gap-4 ${className ?? ""}`}>
      <View className="h-px flex-1 bg-border" />
      {label && (
        <>
          <Text variant="caption" weight="regular" tone="secondary">
            {label}
          </Text>
          <View className="h-px flex-1 bg-border" />
        </>
      )}
    </View>
  );
}
