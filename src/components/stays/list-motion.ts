import { Easing, FadeIn, FadeInDown, FadeOut, LinearTransition, ReduceMotion } from "react-native-reanimated";

import { motion } from "@/theme";

// Layout animations for stay lists. Built once at module scope: inline builders
// are rebuilt on every render. With reduced motion, fades still run (they explain
// the change) and movement is dropped.

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

/** A card appearing after a filter change. */
export const listEnter = FadeIn.duration(motion.reflow).easing(EASE_OUT).reduceMotion(ReduceMotion.Never);

/** A card leaving after a filter change. */
export const listExit = FadeOut.duration(motion.fast).easing(EASE_OUT).reduceMotion(ReduceMotion.Never);

/** Cards that stay slide into their new places. */
export const listReflow = LinearTransition.duration(motion.reflow).easing(EASE_IN_OUT).reduceMotion(ReduceMotion.System);

const MAX_STAGGERED = 5;

/** A search result arriving: rises in, rows a beat apart. Reduced motion: fade only. */
export function resultEnter(index: number, reduced: boolean) {
  const delay = Math.min(index, MAX_STAGGERED) * motion.stagger;
  const base = reduced ? FadeIn : FadeInDown;
  return base.duration(motion.base).delay(delay).easing(EASE_OUT).reduceMotion(ReduceMotion.Never);
}
