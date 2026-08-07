export const layout = {
  mobileMargin: 16,       // Expanded mobile margin for full-bleed edge layouts
  tabletMargin: 32,       // Tablet margin
  measureLimit: 560,      // Max width to keep 60-70 chars reading rhythm
  breakpoint: 600,        // Mobile/Tablet boundary breakpoint
} as const;

export type Layout = typeof layout;
