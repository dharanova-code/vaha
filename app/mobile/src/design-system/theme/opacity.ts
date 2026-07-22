export const opacity = {
  active: 0.8,    // 80% opacity on active press/interact state transitions
  disabled: 0.4,  // 40% opacity for disabled/dormant controls
  invisible: 0,
  solid: 1,
} as const;

export type Opacity = typeof opacity;
