export const radius = {
  none: 0,
  small: 2,   // Internal buttons, checkboxes, inputs, tags
  medium: 4,  // Container cards, modal dialogs, slide-up sheets
} as const;

export type Radius = typeof radius;
