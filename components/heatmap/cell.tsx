'use client'
import React from "react";
import { format, isAfter } from "date-fns";

type CellProps = {
  day: Date;
  isLoading: boolean;
  originalCount: number;
  editedCount?: number;
  getColor: (count: number, colors: string[]) => string;
  colors: string[];
  scaledCellSize: number;
  today: Date;
  viewType: "rolling" | "calendar";
  selectedYear: number | null;
  isHovered: boolean;
  // --- NEW PROP ---
  isPatternHovered: boolean;
  brushValue: number | null;
};
const Cell: React.FC<CellProps> = React.memo(
  ({
    day,
    isLoading,
    originalCount,
    editedCount,
    getColor,
    colors,
    scaledCellSize,
    today,
    viewType,
    selectedYear,
    isHovered,
    isPatternHovered, // Destructure new prop
    brushValue,
  }) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const isFutureDate = isAfter(day, today);
    const currentCount = editedCount ?? originalCount;


    let finalDisplayCount = currentCount;
    // --- MODIFIED LOGIC ---
    if ((isHovered || isPatternHovered) && brushValue !== null && !isFutureDate) {
      finalDisplayCount = currentCount + brushValue;
    }

    let color = colors[0];
    if (viewType === "rolling" || !isFutureDate) {
      color = getColor(finalDisplayCount, colors);
    }

    if (
      (viewType === "rolling" && isAfter(day, today)) ||
      (viewType !== "rolling" && selectedYear && day.getFullYear() !== selectedYear)
    ) {
      return (
        <div
          style={{
            width: `${scaledCellSize}rem`,
            height: `${scaledCellSize}rem`,
          }}
        />
      );
    }

    if (isLoading) {
      return (
        <div
          data-date={dateKey}
          className="loading-cell rounded-xs heatmap-cell"
          style={{
            backgroundColor: colors[0],
            width: `${scaledCellSize}rem`,
            height: `${scaledCellSize}rem`,
          }}
        />
      );
    }

    return (
      <div
        data-date={dateKey}
        data-count={originalCount} // Keep original count for calculating delta later
        className="rounded-xs heatmap-cell"
        style={{
          backgroundColor: color,
          width: `${scaledCellSize}rem`,
          height: `${scaledCellSize}rem`,
        }}
      />
    );
  },
  (prev, next) => {
    return (
      prev.scaledCellSize === next.scaledCellSize &&
      prev.isLoading === next.isLoading &&
      prev.originalCount === next.originalCount &&
      prev.editedCount === next.editedCount &&
      prev.viewType === next.viewType &&
      prev.selectedYear === next.selectedYear &&
      prev.colors === next.colors &&
      prev.isHovered === next.isHovered &&
      prev.isPatternHovered === next.isPatternHovered && // Add to memo check
      prev.brushValue === next.brushValue
    );
  }
);

export default Cell;
