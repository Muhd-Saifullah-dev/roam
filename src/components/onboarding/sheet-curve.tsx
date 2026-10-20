import { cssInterop } from "nativewind";
import Svg, { Path } from "react-native-svg";

// Top edge of the onboarding sheet: high rounded corner on the left, a gentle
// dip toward the right, then a rounded corner into the right side.
const WIDTH = 393;
const HEIGHT = 56;
const PATH =
  "M0 56 L0 32 C0 14 14 0 32 0 C140 2 280 16 345 30 C375 36 393 44 393 56 Z";

function SheetCurveSvg({ width, color }: { width: number; color?: string }) {
  return (
    <Svg
      width={width}
      height={(width / WIDTH) * HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
    >
      <Path d={PATH} fill={color} />
    </Svg>
  );
}

/** Width in px; fill comes from a text color class, e.g. `text-surface`. */
export const SheetCurve = cssInterop(SheetCurveSvg, {
  className: { target: false, nativeStyleToProp: { color: true } },
});
