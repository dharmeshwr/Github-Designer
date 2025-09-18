export const themeColors = {
  light: {
    background: "#ffffff",
    levels: ["#f0f1f5", "#adecbc", "#4cc06b", "#2da44e", "#126328"],
  },
  dark: {
    background: "#0d1017",
    levels: ["#131b23", "#033c16", "#196c2d", "#2ea041", "#58d165"],
  },
};

export const BASE_CELL_SIZE = 0.75;
export const BASE_CELL_GAP = 0.25;
export const BASE_WEEK_WIDTH = BASE_CELL_SIZE + BASE_CELL_GAP;

export const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getScaledValues = (SCALE_FACTOR: number) => ({
  scaledCellSize: BASE_CELL_SIZE * SCALE_FACTOR,
  scaledGap: BASE_CELL_GAP * SCALE_FACTOR,
  scaledWeekWidth: BASE_WEEK_WIDTH * SCALE_FACTOR,
  scaledFontSize: (0.75 * SCALE_FACTOR) / 1.1,
  scaledLabelHeight: BASE_CELL_SIZE * SCALE_FACTOR,
  scaledLabelWidth: 1.5 * SCALE_FACTOR,
});
