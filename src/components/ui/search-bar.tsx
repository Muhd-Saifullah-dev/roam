import { ArrowUpRight, Sparkles } from "lucide-react-native";
import type { Ref } from "react";
import { View, type TextInput, type TextInputProps } from "react-native";

import { Icon } from "./icon";
import { PressableScale } from "./pressable-scale";
import { StyledTextInput } from "./styled-text-input";

export type SearchBarProps = Omit<TextInputProps, "style" | "onSubmitEditing"> & {
  ref?: Ref<TextInput>;
  /** Runs on the keyboard's search key and on the arrow button. */
  onSubmit: () => void;
  className?: string;
};

/** Lavender one-sentence search: "quiet pet friendly cabin with hot tub". */
export function SearchBar({ ref, onSubmit, className, ...props }: SearchBarProps) {
  return (
    <View
      className={`h-search-bar flex-row items-center gap-3 rounded-full bg-lavender pl-5 pr-2 ${className ?? ""}`}
    >
      <Icon as={Sparkles} size={22} className="text-ink" />
      <StyledTextInput
        ref={ref}
        // p-0: Android adds default vertical padding that pushes the text off center.
        className="h-full flex-1 p-0 font-sans text-body text-ink"
        textAlignVertical="center"
        placeholderClassName="text-ink"
        selectionClassName="text-lavender-strong"
        accessibilityLabel="Describe your stay"
        returnKeyType="search"
        autoCorrect={false}
        onSubmitEditing={onSubmit}
        {...props}
      />
      <PressableScale
        accessibilityLabel="Search"
        hitSlop={8}
        onPress={onSubmit}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface"
      >
        <Icon as={ArrowUpRight} size={24} className="text-ink" />
      </PressableScale>
    </View>
  );
}
