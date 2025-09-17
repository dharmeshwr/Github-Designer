'use client'

import "./index.css"
import { useRef, useMemo } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  differenceInDays,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useHeatmapData } from "./use-heatmap-data";
import { useHorizantalScroll } from "@/hooks/use-horizantal-scroll";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useContributionData } from "./use-contribution-data";

const themeColors = {
  light: {
    background: "#ffffff",
    levels: ["#f0f1f5", "#adecbc", "#4cc06b", "#2da44e", "#126328"],
  },
  dark: {
    background: "#0d1017",
    levels: ["#131b23", "#033c16", "#196c2d", "#2ea041", "#58d165"],
  },
};

const SCALE_FACTOR = 1.4;
const BASE_CELL_SIZE = 0.75;
const BASE_CELL_GAP = 0.25;
const BASE_WEEK_WIDTH = BASE_CELL_SIZE + BASE_CELL_GAP;

const Heatmap = () => {
  const heatmapContainer = useRef(null);
  const { resolvedTheme } = useTheme();
  useHorizantalScroll(heatmapContainer);
  const [selectedPeriod, setSelectedPeriod] = useLocalStorage<string>(
    "heatmap_period",
    "rolling"
  );
  const selectedYear =
    selectedPeriod === "rolling" ? null : parseInt(selectedPeriod);

  const { contributionsData, isLoading } = useContributionData(selectedPeriod);

  const {
    contributions,
    startDate,
    weeks,
    viewType,
    today,
    getColor,
  } = useHeatmapData({ data: contributionsData, selectedYear });

  const effectiveTheme = (resolvedTheme || "light") as "light" | "dark";
  const colors = themeColors[effectiveTheme].levels;
  const heatmapBg = themeColors[effectiveTheme].background;

  const scaledCellSize = BASE_CELL_SIZE * SCALE_FACTOR;
  const scaledGap = BASE_CELL_GAP * SCALE_FACTOR;
  const scaledWeekWidth = BASE_WEEK_WIDTH * SCALE_FACTOR;
  const scaledFontSize = (0.75 * SCALE_FACTOR) / 1.1;
  const scaledLabelHeight = scaledCellSize;
  const scaledLabelWidth = 1.5 * SCALE_FACTOR;

  const handleYearChange = (value: string) => {
    setSelectedPeriod(value);
  };

  // Memoize the calculation of week elements to prevent re-running on every render
  const memoizedWeeks = useMemo(() => {
    const weeksArray = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    for (let i = 0; i < weeks; i++) {
      const weekDays = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
      });

      weeksArray.push(
        <div
          key={i}
          className="flex flex-col flex-shrink-0"
          style={{ gap: `${scaledGap}rem` }}
        >
          {weekDays.map((day, index) => {
            if (
              (viewType === "rolling" && isAfter(day, today)) ||
              (viewType !== "rolling" &&
                selectedYear &&
                day.getFullYear() !== selectedYear)
            ) {
              return (
                <div
                  key={index}
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
                  key={index}
                  className="loading-cell rounded-xs"
                  style={{
                    backgroundColor: colors[0],
                    width: `${scaledCellSize}rem`,
                    height: `${scaledCellSize}rem`,
                  }}
                />
              );
            }

            const contribution = contributions.find((c) => isSameDay(c.date, day));
            const count = contribution?.count || 0;
            const isFutureDate = isAfter(day, today);

            let color = colors[0];
            let title = `No contributions on ${format(day, "PPP")}`;

            if (viewType === 'rolling' || !isFutureDate) {
              color = getColor(count, colors);
              title = `${count} contributions on ${format(day, "PPP")}`;
            }

            return (
              <div
                key={index}
                className="rounded-xs"
                style={{
                  backgroundColor: color,
                  width: `${scaledCellSize}rem`,
                  height: `${scaledCellSize}rem`,
                }}
                title={title}
              />
            );
          })}
        </div>
      );
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    return weeksArray;
  }, [weeks, startDate, viewType, today, selectedYear, isLoading, contributions, colors, scaledCellSize, scaledGap, getColor]);

  // Memoize the calculation of month labels
  const memoizedMonthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    const gridStartDate = startOfWeek(startDate, { weekStartsOn: 0 });

    if (viewType === 'rolling') {
      let currentRollingDate = gridStartDate;
      for (let i = 0; i < weeks; i++) {
        const month = currentRollingDate.getMonth();
        if (month !== lastMonth) {
          labels.push(
            <span
              key={i}
              className="absolute"
              style={{
                left: `${i * scaledWeekWidth}rem`,
                fontSize: `${scaledFontSize}rem`
              }}
            >
              {format(currentRollingDate, "MMM")}
            </span>
          );
        }
        lastMonth = month;
        currentRollingDate = addDays(currentRollingDate, 7);
      }
      return labels;
    }

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstDayOfMonth = new Date(selectedYear!, monthIndex, 1);
      const diffInDays = differenceInDays(firstDayOfMonth, gridStartDate);
      const weekIndex = Math.floor(diffInDays / 7);

      if (weekIndex >= 0 && weekIndex < weeks) {
        labels.push(
          <span
            key={monthIndex}
            className="absolute"
            style={{
              left: `${weekIndex * scaledWeekWidth}rem`,
              fontSize: `${scaledFontSize}rem`
            }}
          >
            {format(firstDayOfMonth, "MMM")}
          </span>
        );
      }
    }
    return labels;
  }, [startDate, weeks, viewType, selectedYear, scaledWeekWidth, scaledFontSize]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full flex justify-center min-w-[300px]">
      <div
        className="p-4 border rounded-lg w-fit max-w-full"
        style={{ backgroundColor: heatmapBg }}
      >
        <div className="flex justify-end mb-4">
          <Select value={selectedPeriod} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="h-[250px]" style={{ backgroundColor: heatmapBg }}>
              <SelectItem value="rolling">Last 12 months</SelectItem>
              {Array.from({ length: today.getFullYear() - 1999 }, (_, i) => {
                const year = today.getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full overflow-x-auto" ref={heatmapContainer}>
          <div className="inline-block">
            <div
              className="flex"
              style={{ gap: `${scaledGap}rem` }}
            >
              <div
                className="flex flex-col flex-shrink-0"
                style={{
                  gap: `${scaledGap}rem`,
                  marginRight: `${scaledGap}rem`,
                  paddingTop: `${1.25 * SCALE_FACTOR}rem`
                }}
              >
                {dayLabels.map((day, index) => (
                  <span
                    key={index}
                    className="flex items-center"
                    style={{
                      fontSize: `${scaledFontSize}rem`,
                      width: `${scaledLabelWidth}rem`,
                      height: `${scaledLabelHeight}rem`
                    }}
                  >
                    {index % 2 !== 0 ? day : ""}
                  </span>
                ))}
              </div>

              <div className="relative">
                <div style={{ height: `${1.25 * SCALE_FACTOR}rem` }}>
                  {/* Use the memoized value */}
                  {memoizedMonthLabels}
                </div>
                <div
                  className="flex"
                  style={{ gap: `${scaledGap}rem` }}
                >
                  {/* Use the memoized value */}
                  {memoizedWeeks}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-4 justify-end flex items-center text-gray-500"
          style={{
            gap: `${scaledGap}rem`,
            fontSize: `${scaledFontSize}rem`
          }}
        >
          <span>Less</span>
          {colors.map((color, index) => (
            <div
              key={index}
              className="rounded-xs"
              style={{
                backgroundColor: color,
                width: `${scaledCellSize}rem`,
                height: `${scaledCellSize}rem`
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
