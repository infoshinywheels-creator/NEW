// Shinywheels palette — sampled from the brand logo.
export const COLORS = {
  navy: "#0A1C36",
  deep: "#12314F",
  sky: "#5AC4FF",
  aqua: "#8AE0FE",
  ice: "#E2F4FC",
  yellow: "#FFDB1F",
} as const;

export const BRAND_GRADIENT = `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.aqua})`;

// Font families used in the video. Files are wired up in fonts.ts.
export const FONT_DISPLAY = "SW Display";
export const FONT_TEXT = "SW Text";
