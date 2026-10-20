import { cssInterop } from "nativewind";
import type { ComponentProps, ComponentType, Ref } from "react";
import { TextInput } from "react-native";

// Adds token classes for the placeholder and selection colors.
const InteropTextInput = cssInterop(TextInput, {
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

// cssInterop forwards refs at runtime; its types just drop `ref`.
export const StyledTextInput = InteropTextInput as ComponentType<
  ComponentProps<typeof InteropTextInput> & { ref?: Ref<TextInput> }
>;
