import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";

type IconBaseProps = {
  as: LucideIcon;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
};

function IconBase({
  as: Component,
  size = 24,
  strokeWidth = 2,
  color,
  fill = "none",
}: IconBaseProps) {
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      fill={fill}
    />
  );
}

/**
 * Lucide icon colored by token classes:
 * `<Icon as={Heart} className="text-ink" fillClassName="text-primary" />`
 */
export const Icon = cssInterop(IconBase, {
  className: { target: false, nativeStyleToProp: { color: true } },
  fillClassName: { target: false, nativeStyleToProp: { color: "fill" } },
});
