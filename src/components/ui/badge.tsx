import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Icon } from "./icon";
import { Text, type TextTone } from "./text";

const tones = {
  favorite: { box: "bg-primary-soft", text: "default", icon: "text-ink", fill: "text-primary" },
  success: { box: "bg-success-soft", text: "success", icon: "text-success", fill: undefined },
  danger: { box: "bg-danger-soft", text: "danger", icon: "text-danger", fill: undefined },
  info: { box: "bg-info-soft", text: "info", icon: "text-info", fill: undefined },
  neutral: { box: "bg-surface-muted", text: "default", icon: "text-ink", fill: undefined },
} as const satisfies Record<
  string,
  { box: string; text: TextTone; icon: string; fill: string | undefined }
>;

export type BadgeProps = {
  label: string;
  tone?: keyof typeof tones;
  icon?: LucideIcon;
  className?: string;
};

export function Badge({ label, tone = "neutral", icon, className }: BadgeProps) {
  const t = tones[tone];

  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5 ${t.box} ${className ?? ""}`}
    >
      {icon && <Icon as={icon} size={16} className={t.icon} fillClassName={t.fill} />}
      <Text variant="small" tone={t.text} weight="medium">
        {label}
      </Text>
    </View>
  );
}
