import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

const selectedTones = {
  lavender: "bg-lavender border-lavender",
  primary: "bg-primary border-primary",
} as const;

// outline: white with a border (forms). filled: muted fill, no border (category filters).
const variants = {
  outline: "border-border bg-surface",
  filled: "border-surface-muted bg-surface-muted",
} as const;

const sizes = {
  md: { box: "h-12 px-5", icon: 20 },
  sm: { box: "h-10 px-3", icon: 18 },
} as const;

export type ChipProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  /** Fill color when selected. */
  tone?: keyof typeof selectedTones;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

export function Chip({
  label,
  icon,
  selected = false,
  tone = "lavender",
  size = "md",
  variant = "outline",
  disabled,
  className,
  ...props
}: ChipProps) {
  const s = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      className={`flex-row items-center gap-2 rounded-full border active:opacity-85 ${s.box} ${
        selected ? selectedTones[tone] : variants[variant]
      } ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      {...props}
    >
      {icon && <Icon as={icon} size={s.icon} className="text-ink" />}
      <Text
        variant={size === "md" ? "body" : "caption"}
        weight={selected ? "semibold" : "medium"}
      >
        {label}
      </Text>
    </Pressable>
  );
}
