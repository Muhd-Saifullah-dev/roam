import { Minus, Plus, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

export type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
  min?: number;
  max?: number;
  className?: string;
};

function StepButton({
  icon,
  disabled,
  onPress,
}: {
  icon: LucideIcon;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`h-10 w-10 items-center justify-center rounded-full active:bg-surface-muted ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <Icon as={icon} size={20} className="text-ink" />
    </Pressable>
  );
}

export function Stepper({
  value,
  onChange,
  accessibilityLabel,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  className,
}: StepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ now: value, min, max: Number.isFinite(max) ? max : undefined }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment" && canIncrease) onChange(value + 1);
        if (e.nativeEvent.actionName === "decrement" && canDecrease) onChange(value - 1);
      }}
      className={`h-14 flex-row items-center gap-3 self-start rounded-full border border-border bg-surface px-2 ${
        className ?? ""
      }`}
    >
      <StepButton icon={Minus} disabled={!canDecrease} onPress={() => onChange(value - 1)} />
      <Text variant="title" className="min-w-8 text-center">
        {value}
      </Text>
      <StepButton icon={Plus} disabled={!canIncrease} onPress={() => onChange(value + 1)} />
    </View>
  );
}
