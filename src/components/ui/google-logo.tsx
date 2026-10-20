import { Image } from "expo-image";

// Google has no Lucide icon, so the official G lives as an SVG asset (brand colors stay out of TS).
const source = require("../../../assets/images/google-g.svg");

export type GoogleLogoProps = {
  size?: number;
};

export function GoogleLogo({ size = 20 }: GoogleLogoProps) {
  return (
    <Image
      source={source}
      accessible={false}
      contentFit="contain"
      style={{ width: size, height: size }}
    />
  );
}
