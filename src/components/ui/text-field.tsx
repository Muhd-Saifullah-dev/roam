import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useState, type ReactNode } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { Icon } from "./icon";

// Adds token classes for the placeholder and selection colors.
const StyledTextInput = cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  selectionClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
});

export type TextFieldProps = Omit<TextInputProps, "style" | "secureTextEntry"> & {
  icon?: LucideIcon;
  /** Element after the input, e.g. a filters button. Ignored when `secure`. */
  trailing?: ReactNode;
  /** Password field with a show/hide toggle. */
  secure?: boolean;
  className?: string;
};

export function TextField({
  icon,
  trailing,
  secure = false,
  editable = true,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View
      className={`h-14 flex-row items-center gap-3 rounded-lg px-4 ${
        focused
          ? "border-2 border-lavender-strong bg-lavender-soft"
          : "border-2 border-surface-muted bg-surface-muted"
      } ${editable ? "" : "opacity-40"} ${className ?? ""}`}
    >
      {icon && <Icon as={icon} className="text-ink" />}
      <StyledTextInput
        className="h-full flex-1 font-sans text-body text-ink"
        placeholderClassName="text-ink-secondary"
        selectionClassName="text-lavender-strong"
        editable={editable}
        secureTextEntry={secure && hidden}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {secure ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          hitSlop={8}
          onPress={() => setHidden((h) => !h)}
          className="active:opacity-60"
        >
          <Icon as={hidden ? EyeOff : Eye} className="text-ink" />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
