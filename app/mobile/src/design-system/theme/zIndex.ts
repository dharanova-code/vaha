export const zIndex = {
  base: 0,
  surface: 1,
  overlay: 10,
  modal: 100,
  toast: 1000,
} as const;

export type ZIndex = typeof zIndex;
