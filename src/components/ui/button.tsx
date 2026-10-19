import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  primary: "bg-primary",
  secondary: "bg-surface border border-border",
} as const;

const sizes = {
  md: "h-14 px-6",
  sm: "h-9 px-4",
} as const;

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  /** Element before the label, e.g. a provider logo. */
  leading?: ReactNode;
  /** Icon pinned to the trailing edge, e.g. ArrowRight. */
  trailingIcon?: LucideIcon;
  className?: string;
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leading,
  trailingIcon,
  className,
  ...props
}: ButtonProps) {
  const inactive = !!disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={`flex-row items-center justify-center gap-3 rounded-full active:opacity-85 ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator className="text-ink" />
      ) : (
        <>
          {leading}
          <Text variant="button">{title}</Text>
          {trailingIcon && (
            <View className={`absolute ${size === "md" ? "right-6" : "right-4"}`}>
              <Icon as={trailingIcon} size={size === "md" ? 24 : 18} className="text-ink" />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
