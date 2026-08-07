export const radius = {
  none: 0,
  small: 8,   // Internal buttons, checkboxes, inputs, tags
  medium: 16,  // Container cards, modal dialogs, slide-up sheets
} as const;

export type Radius = typeof radius;
