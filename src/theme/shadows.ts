// NativeWind maps box-shadow to legacy single-layer shadow props, so shadows
// are RN boxShadow strings applied through the style prop.
export const shadows = {
  card: "0 1px 2px rgba(11, 11, 26, 0.04), 0 4px 16px rgba(11, 11, 26, 0.06)",
  raised: "0 8px 24px rgba(11, 11, 26, 0.10)",
} as const;
