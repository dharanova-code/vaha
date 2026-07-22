export const colors = {
  // Base backgrounds
  background: {
    primary: "#FAF8F5", // Warm Paper - base layer 0
    secondary: "#F5F2EC", // Warm Paper Secondary - layer 1 surfaces
  },
  
  // Typography & content
  text: {
    primary: "#1B3629", // Deep Forest Green - high contrast readability
    muted: "#7A7265", // Natural Stone - metadata, telemetry labels
  },

  // Highlight & accents
  accent: {
    primary: "#C07D53", // Muted Copper
    border: "#E2DFD9", // Soft stone border tint
    focus: "#0EA5E9", // Teal focus highlight
  },

  // Semantic status colors
  semantic: {
    info: "#0EA5E9", // Teal (active sync, loading)
    success: "#10B981", // Emerald (complete sync, verified updates)
    warning: "#F97316", // Orange (pairing request, hardware connecting)
    error: "#EF4444", // Red (diagnostic errors, failures)
  }
} as const;

export type Colors = typeof colors;
