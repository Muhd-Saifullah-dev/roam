import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { shadows } from "@/theme";

import { Icon } from "./icon";

const sizes = {
  md: { box: "h-14 w-14", icon: 24, shadow: shadows.card },
  // Small buttons float on photos, so they sit higher.
  sm: { box: "h-9 w-9", icon: 18, shadow: shadows.raised },
  // Header navigation (back) on plain screens: outlined, flat.
  nav: { box: "h-11 w-11 border border-border", icon: 22, shadow: undefined },
} as const;

export type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon: LucideIcon;
  accessibilityLabel: string;
  size?: keyof typeof sizes;
  /** Fills the icon with the primary color, e.g. a saved heart. */
  selected?: boolean;
  className?: string;
};

export function IconButton({
  icon,
  size = "md",
  selected = false,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const s = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected }}
      disabled={disabled}
      className={`items-center justify-center rounded-full bg-surface active:opacity-85 ${s.box} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      style={{ boxShadow: s.shadow }}
      {...props}
    >
      <Icon
        as={icon}
        size={s.icon}
        className={selected ? "text-primary" : "text-ink"}
        fillClassName={selected ? "text-primary" : undefined}
      />
    </Pressable>
  );
}
