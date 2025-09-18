'use client'
import React, { useMemo } from "react";
import { format } from "date-fns";
import Cell from "./cell";

type GridProps = {
  weeksArray: Date[][];
  contributionsCalendar: { date: Date; count: number }[] | null | undefined;
  editedContributions: Record<string, number>;
  isLoading: boolean;
  getColor: (count: number, colors: string[]) => string;
  colors: string[];
  scaledCellSize: number;
  scaledGap: number;
  today: Date;
  viewType: "rolling" | "calendar";
  selectedYear: number | null;
  hoveredCellKey: string | null;
  brushValue: number | null;
};

const HeatmapGrid: React.FC<GridProps> = React.memo((props) => {
  const {
    weeksArray,
    contributionsCalendar,
    editedContributions,
    isLoading,
    getColor,
    colors,
    scaledCellSize,
    scaledGap,
    today,
    viewType,
    selectedYear,
    hoveredCellKey,
    brushValue,
  } = props;

  const contribMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of contributionsCalendar ?? []) {
      m.set(format(c.date, "yyyy-MM-dd"), c.count ?? 0);
    }
    return m;
  }, [contributionsCalendar]);

  return (
    <div className="inline-block">
      <div className="flex" style={{ gap: `${scaledGap}rem` }}>
        <div className="flex flex-col flex-shrink-0" style={{ gap: `${scaledGap}rem`, paddingTop: `${1.25}rem` }}>
        </div>
        <div className="relative">
          <div className="flex" style={{ gap: `${scaledGap}rem` }}>
            {weeksArray.map((weekDays, i) => (
              <div key={i} className="flex flex-col flex-shrink-0" style={{ gap: `${scaledGap}rem` }}>
                {weekDays.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const originalCount = contribMap.get(key) ?? 0;
                  const editedCount = editedContributions[key];
                  const isHovered = key === hoveredCellKey;
                  return (
                    <Cell
                      key={key}
                      day={day}
                      isLoading={isLoading}
                      originalCount={originalCount}
                      editedCount={editedCount}
                      getColor={getColor}
                      colors={colors}
                      scaledCellSize={scaledCellSize}
                      today={today}
                      viewType={viewType}
                      selectedYear={selectedYear}
                      isHovered={isHovered}
                      brushValue={brushValue}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}, (a, b) => {
  return (
    a.weeksArray === b.weeksArray &&
    a.isLoading === b.isLoading &&
    a.colors === b.colors &&
    a.scaledCellSize === b.scaledCellSize &&
    a.scaledGap === b.scaledGap &&
    a.viewType === b.viewType &&
    a.selectedYear === b.selectedYear &&
    a.getColor === b.getColor &&
    a.editedContributions === b.editedContributions &&
    a.hoveredCellKey === b.hoveredCellKey &&
    a.brushValue === b.brushValue
  );
});

export default HeatmapGrid;
