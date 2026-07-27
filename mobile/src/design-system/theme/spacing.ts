export const spacing = {
  space1: 4,   // Micro-adjustments
  space2: 8,   // Tight component spacing, input padding
  space3: 12,  // Mid-level grouping spacing
  space4: 16,  // Standard card padding, gap between related items
  space6: 24,  // Outer screen margins, distinct section boundaries
  space8: 32,  // Deep spacing, header top margins
  space12: 48, // Breathing room, empty state gaps
} as const;

export type Spacing = typeof spacing;
