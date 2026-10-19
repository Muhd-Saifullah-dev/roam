import { Text as RNText, type TextProps as RNTextProps } from "react-native";

const weights = {
  regular: "font-sans",
  medium: "font-sans-medium",
  semibold: "font-sans-semibold",
  bold: "font-sans-bold",
  extrabold: "font-sans-extrabold",
} as const;

const variants = {
  display: { size: "text-display", weight: "bold" },
  heading: { size: "text-heading", weight: "bold" },
  title: { size: "text-title", weight: "bold" },
  subtitle: { size: "text-subtitle", weight: "semibold" },
  body: { size: "text-body", weight: "regular" },
  button: { size: "text-button", weight: "medium" },
  caption: { size: "text-caption", weight: "medium" },
  small: { size: "text-small", weight: "regular" },
} as const satisfies Record<string, { size: string; weight: keyof typeof weights }>;

const tones = {
  default: "text-ink",
  secondary: "text-ink-secondary",
  inverse: "text-surface",
  primary: "text-primary",
  lavender: "text-lavender-strong",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;
export type TextWeight = keyof typeof weights;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Overrides the variant's weight. Font classes must not be passed in className. */
  weight?: TextWeight;
  className?: string;
};

export function Text({
  variant = "body",
  tone = "default",
  weight,
  className,
  ...props
}: TextProps) {
  const v = variants[variant];

  return (
    <RNText
      className={`${weights[weight ?? v.weight]} ${v.size} ${tones[tone]} ${className ?? ""}`}
      {...props}
    />
  );
}
