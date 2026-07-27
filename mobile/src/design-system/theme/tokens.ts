import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { elevation } from "./elevation";
import { motion } from "./motion";
import { opacity } from "./opacity";
import { zIndex } from "./zIndex";
import { layout } from "./layout";

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  elevation,
  motion,
  opacity,
  zIndex,
  layout,
} as const;

export type Theme = typeof theme;
export { colors, typography, spacing, radius, elevation, motion, opacity, zIndex, layout };
