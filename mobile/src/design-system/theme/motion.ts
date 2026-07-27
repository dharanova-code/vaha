export const motion = {
  durations: {
    fast: 120,      // standard hover/active press state updates
    standard: 200,  // dialog transitions, sheets sliding up
  },
  pulseSync: 2500,  // Sinusoidal breathing period (in ms) for sync states
} as const;

export type Motion = typeof motion;
