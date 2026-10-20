import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { Text } from "./text";

export type CodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** Called once all digits are entered. */
  onComplete?: (value: string) => void;
  length?: number;
  error?: string;
  autoFocus?: boolean;
  className?: string;
};

/** One-time code boxes over a single hidden input, so paste and autofill work. */
export function CodeInput({
  value,
  onChangeText,
  onComplete,
  length = 6,
  error,
  autoFocus = false,
  className,
}: CodeInputProps) {
  const input = useRef<TextInput>(null);
  const [focused, setFocused] = useState(autoFocus);

  return (
    <View className={className}>
      <Pressable
        accessibilityLabel={`Verification code, ${length} digits`}
        onPress={() => input.current?.focus()}
        className="flex-row gap-2"
      >
        {Array.from({ length }, (_, i) => {
          const active = focused && i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              className={`h-14 flex-1 items-center justify-center rounded-lg border-2 ${
                error
                  ? "border-danger bg-surface-muted"
                  : active
                    ? "border-lavender-strong bg-lavender-soft"
                    : "border-surface-muted bg-surface-muted"
              }`}
            >
              <Text variant="title">{value[i] ?? ""}</Text>
            </View>
          );
        })}
        <TextInput
          ref={input}
          value={value}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, "").slice(0, length);
            onChangeText(digits);
            if (digits.length === length) onComplete?.(digits);
          }}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={length}
          caretHidden
          // Invisible but focusable; the boxes show the value.
          className="absolute inset-0"
          style={{ opacity: 0 }}
        />
      </Pressable>
      {error && (
        <Text variant="small" tone="danger" className="mt-1.5 px-1">
          {error}
        </Text>
      )}
    </View>
  );
}
