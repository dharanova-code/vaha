import { Platform } from "react-native";

export const typography = {
  fonts: {
    // Serif for emotional anchors (greetings, quotes, capture titles)
    serif: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia",
    }),
    // Sans-serif for transcripts, metadata, controls, search fields
    sans: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "sans-serif",
    }),
    // Monospace for telemetry values, timestamps, and connection logs
    mono: Platform.select({
      ios: "Courier New",
      android: "monospace",
      default: "monospace",
    }),
  },
  sizes: {
    displayLg: 36,
    headlineLg: 24,
    bodyMd: 16,
    labelSm: 13,
    metaSm: 12,
  },
  lineHeights: {
    displayLg: 44,
    headlineLg: 32,
    bodyMd: 26,
    labelSm: 18,
    metaSm: 16,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

export type Typography = typeof typography;
