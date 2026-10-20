import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useState, type ReactNode, type Ref } from "react";
import { Pressable, View, type TextInput, type TextInputProps } from "react-native";

import { Icon } from "./icon";
import { StyledTextInput } from "./styled-text-input";
import { Text } from "./text";

export type TextFieldProps = Omit<TextInputProps, "style" | "secureTextEntry"> & {
  ref?: Ref<TextInput>;
  icon?: LucideIcon;
  /** Label above the input, inside the box (form fields). */
  label?: string;
  /** Error message below the box; also turns the border red. */
  error?: string;
  /** Element after the input, e.g. a filters button. Ignored when `secure`. */
  trailing?: ReactNode;
  /** Password field with a show/hide toggle. */
  secure?: boolean;
  className?: string;
};

export function TextField({
  ref,
  icon,
  label,
  error,
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

  const border = error
    ? "border-2 border-danger bg-surface-muted"
    : focused
      ? "border-2 border-lavender-strong bg-lavender-soft"
      : "border-2 border-surface-muted bg-surface-muted";

  const input = (
    <StyledTextInput
      ref={ref}
      // p-0: Android adds default vertical padding, which pushes text out of the short labeled input.
      className={`${label ? "h-6" : "h-full flex-1"} p-0 font-sans text-body text-ink`}
      textAlignVertical="center"
      placeholderClassName="text-ink-secondary"
      selectionClassName="text-lavender-strong"
      accessibilityLabel={label}
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
  );

  return (
    <View className={className}>
      <View
        className={`flex-row items-center rounded-lg ${
          label ? "gap-5 px-5 py-2" : "h-14 gap-3 px-4"
        } ${border} ${editable ? "" : "opacity-40"}`}
      >
        {icon && <Icon as={icon} className="text-ink" />}
        {label ? (
          <View className="flex-1">
            <Text variant="caption">{label}</Text>
            {input}
          </View>
        ) : (
          input
        )}
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
      {error && (
        <Text variant="small" tone="danger" className="mt-1.5 px-1">
          {error}
        </Text>
      )}
    </View>
  );
}
