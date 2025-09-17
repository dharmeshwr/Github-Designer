"use client"
import { useState, useEffect, useMemo } from "react";
import {
  subDays,
  startOfWeek,
  differenceInDays,
  startOfYear,
  endOfYear,
} from "date-fns";

interface ContributionDay {
  date: string;
  count: number;
}

interface ProcessedContributionDay {
  date: Date;
  count: number;
}

interface UseHeatmapDataProps {
  data: ContributionDay[];
  selectedYear: number | null;
}

interface UseHeatmapDataReturn {
  contributions: ProcessedContributionDay[];
  startDate: Date;
  weeks: number;
  viewType: "rolling" | "calendar";
  today: Date;
  getColor: (count: number, colors: string[]) => string;
}

export const useHeatmapData = ({
  data,
  selectedYear
}: UseHeatmapDataProps): UseHeatmapDataReturn => {
  const [contributions, setContributions] = useState<ProcessedContributionDay[]>([]);

  // Memoize today to prevent unnecessary re-renders
  const today = useMemo(() => new Date(), []);

  const { startDate, weeks, viewType } = useMemo(() => {
    if (selectedYear === null) {
      return {
        startDate: subDays(today, 364),
        weeks: 53,
        viewType: "rolling" as const,
      };
    } else {
      const yearStartDate = startOfYear(new Date(selectedYear, 0, 1));
      const yearEndDate = endOfYear(new Date(selectedYear, 0, 1));
      const gridStartDate = startOfWeek(yearStartDate, { weekStartsOn: 0 });
      const numDays = differenceInDays(yearEndDate, gridStartDate) + 1;
      const numWeeks = Math.ceil(numDays / 7);

      return {
        startDate: yearStartDate,
        weeks: numWeeks,
        viewType: "calendar" as const,
      };
    }
  }, [selectedYear, today]);

  useEffect(() => {
    const processedData = data.map((item) => ({
      date: new Date(item.date),
      count: item.count,
    }));
    setContributions(processedData);
  }, [data]);

  const getColor = useMemo(() => {
    return (count: number, colors: string[]) => {
      if (count <= 0) return colors[0];
      if (count <= 2) return colors[1];
      if (count <= 4) return colors[2];
      if (count <= 6) return colors[3];
      return colors[4] || colors[colors.length - 1];
    };
  }, []);

  return {
    contributions,
    startDate,
    weeks,
    viewType,
    today,
    getColor,
  };
};
