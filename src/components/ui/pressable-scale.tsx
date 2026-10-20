import { cssInterop } from "nativewind";
import { useState, type ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { cubicBezier, useReducedMotion } from "react-native-reanimated";

import { motion } from "@/theme";

const AnimatedView = cssInterop(Animated.View, { className: "style" });

// Strong ease-out: the press shows up at once, then settles.
const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

export type PressableScaleProps = Omit<PressableProps, "children" | "style"> & {
  children: ReactNode;
  /** Classes for the box that scales (size, color, radius). */
  className?: string;
};

/**
 * Press feedback for button-like elements: shrinks to 0.97 on press-in with a
 * 120ms Reanimated CSS transition on the UI thread. Reduced motion drops the
 * scale and dims instead.
 */
export function PressableScale({ children, className, disabled, onPressIn, onPressOut, ...props }: PressableScaleProps) {
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      pressRetentionOffset={16}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      {...props}
    >
      <AnimatedView
        className={`${reduced && pressed ? "opacity-85" : ""} ${className ?? ""}`}
        style={{
          transform: [{ scale: pressed && !reduced ? 0.97 : 1 }],
          transitionProperty: "transform",
          transitionDuration: motion.press,
          transitionTimingFunction: EASE_OUT,
        }}
      >
        {children}
      </AnimatedView>
    </Pressable>
  );
}
