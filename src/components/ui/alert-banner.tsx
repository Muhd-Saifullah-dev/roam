import { CircleAlert, CircleCheck, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

const tones = {
  success: { box: "bg-success-soft", icon: CircleCheck, fg: "text-success", text: "success" },
  danger: { box: "bg-danger-soft", icon: CircleAlert, fg: "text-danger", text: "danger" },
} as const;

export type AlertBannerProps = {
  message: string;
  tone: keyof typeof tones;
  /** Shows a dismiss button when set. */
  onDismiss?: () => void;
  className?: string;
};

export function AlertBanner({ message, tone, onDismiss, className }: AlertBannerProps) {
  const t = tones[tone];

  return (
    <View
      accessibilityRole="alert"
      className={`min-h-14 flex-row items-center gap-3 rounded-md px-4 py-3 ${t.box} ${className ?? ""}`}
    >
      <Icon as={t.icon} size={28} className={t.fg} />
      <Text variant="caption" tone={t.text} className="flex-1">
        {message}
      </Text>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={8}
          onPress={onDismiss}
          className="active:opacity-60"
        >
          <Icon as={X} size={20} className={t.fg} />
        </Pressable>
      )}
    </View>
  );
}
