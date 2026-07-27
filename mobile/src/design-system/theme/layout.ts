export const layout = {
  mobileMargin: 24,       // Locked mobile margin
  tabletMargin: 40,       // Tablet margin
  measureLimit: 560,      // Max width to keep 60-70 chars reading rhythm (EB Garamond/Inter text reading blocks)
  breakpoint: 600,        // Mobile/Tablet boundary breakpoint
} as const;

export type Layout = typeof layout;
