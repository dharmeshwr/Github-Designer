// ./index.tsx
'use client'
import "./index.css";
import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useHeatmapData } from "./use-heatmap-data";
import { useHorizantalScroll } from "@/hooks/use-horizantal-scroll";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useContributionData } from "./use-contribution-data";
import { themeColors, dayLabels, getScaledValues } from "./config";
import { useScale } from "@/contexts/scale-context";
import HeatmapGrid from "./grid";
import EditControls from "./edit-controls";
import { toast } from "sonner";
import { alphabetPatterns } from "./patterns";

const Heatmap = () => {
  const heatmapContainer = useRef<HTMLDivElement | null>(null);
  useHorizantalScroll(heatmapContainer);

  const { resolvedTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useLocalStorage<string>("heatmap_period", "rolling");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrushValue, setSelectedBrushValue] = useState<number | null>(1);
  const [isApplying, setIsApplying] = useState(false);

  const { contributions, isLoading } = useContributionData(selectedPeriod);

  // --- NEW: State for hover details text ---
  const [hoveredCellDetails, setHoveredCellDetails] = useState<string | null>(null);

  const transformedContributions = useMemo(() => {
    return contributions?.calendar?.map(contribution => ({
      ...contribution,
      date: new Date(contribution.date),
    })) ?? [];
  }, [contributions]);

  const contribMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of transformedContributions ?? []) {
      m.set(format(c.date, "yyyy-MM-dd"), c.count ?? 0);
    }
    return m;
  }, [transformedContributions]);

  const [editedContributions, setEditedContributions] = useState<Record<string, number>>({});
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);

  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedPatternSize, setSelectedPatternSize] = useState<'small' | 'large'>('large');
  const [patternPreviewCells, setPatternPreviewCells] = useState<Set<string>>(new Set());

  const selectedBrushRef = useRef<number | null>(null);
  selectedBrushRef.current = selectedBrushValue;

  const selectedYear = selectedPeriod === "rolling" ? null : parseInt(selectedPeriod);
  const { startDate, weeks, viewType, today, getColor } = useHeatmapData({ selectedYear });

  const effectiveTheme = (resolvedTheme || "light") as "light" | "dark";
  const colors = themeColors[effectiveTheme].levels;
  const heatmapBg = themeColors[effectiveTheme].background;

  const { scaleFactor } = useScale();
  const { scaledCellSize, scaledGap, scaledWeekWidth } = getScaledValues(scaleFactor);

  const weeksArray = useMemo(() => {
    const array: Date[][] = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });
    for (let i = 0; i < weeks; i++) {
      const weekDays = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
      });
      array.push(weekDays);
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    return array;
  }, [startDate, weeks]);

  const weeksMap = useMemo(() => {
    const map = new Map<string, { weekIndex: number; dayIndex: number }>();
    weeksArray.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        map.set(format(day, "yyyy-MM-dd"), { weekIndex, dayIndex });
      });
    });
    return map;
  }, [weeksArray]);

  const monthLabels = useMemo(() => {
    const labels: React.ReactNode[] = [];
    const gridStartDate = startOfWeek(startDate, { weekStartsOn: 0 });
    if (viewType === 'rolling') {
      let lastMonth = -1;
      let currentRollingDate = gridStartDate;
      for (let i = 0; i < weeks; i++) {
        const month = currentRollingDate.getMonth();
        if (month !== lastMonth) {
          labels.push(
            <span key={i} className="absolute" style={{ left: `${i * scaledWeekWidth}rem` }}>
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
          <span key={monthIndex} className="absolute" style={{ left: `${weekIndex * scaledWeekWidth}rem` }}>
            {format(firstDayOfMonth, "MMM")}
          </span>
        );
      }
    }
    return labels;
  }, [startDate, weeks, viewType, selectedYear, scaledWeekWidth]);

  const toggleEditMode = useCallback(() => {
    setIsEditing(prev => {
      const newIsEditing = !prev;
      if (newIsEditing && Object.keys(editedContributions).length === 0) {
        const initialEdits: Record<string, number> = {};
        transformedContributions.forEach(c => {
          initialEdits[format(c.date, "yyyy-MM-dd")] = c.count;
        });
        setEditedContributions(initialEdits);
      }
      return newIsEditing;
    });
  }, [editedContributions, transformedContributions, setEditedContributions]);

  const handleClearEdits = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all your pending edits?")) {
      const initialEdits: Record<string, number> = {};
      transformedContributions.forEach(c => {
        initialEdits[format(c.date, "yyyy-MM-dd")] = c.count;
      });
      setEditedContributions(initialEdits);
    }
  }, [setEditedContributions, transformedContributions]);

  const handleApplyChanges = async () => {
    const changesToSend: { date: string; count: number }[] = [];
    Object.entries(editedContributions).forEach(([date, newCount]) => {
      const originalCount = contribMap.get(date) ?? 0;
      if (newCount !== originalCount) {
        changesToSend.push({ date, count: newCount });
      }
    });

    if (changesToSend.length === 0) {
      toast.info("No changes to apply.");
      return;
    }

    setIsApplying(true);
    const toastId = toast.loading("Applying your changes...", {
      description: "Don't refresh the page !!!, This can take a while. Feel free to grab a coffee!",
    });

    try {
      const response = await fetch('/api/user/contributions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changesToSend),
      });

      if (!response.ok) {
        throw new Error(response.statusText || `HTTP error ${response.status}`);
      }
      if (!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let totalRequested = changesToSend.reduce((sum, c) => sum + c.count, 0);
      let totalCreated = 0;
      let done = false;
      while (!done) {
        const { done: readDone, value } = await reader.read();
        done = readDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        let events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const event of events) {
          const lines = event.split('\n');
          let dataLines = lines.filter(line => line.startsWith('data: ')).map(line => line.slice(6));
          if (dataLines.length > 0) {
            let dataStr = dataLines.join('\n');
            try {
              const msg = JSON.parse(dataStr);
              if (msg.type === 'commit_created') {
                totalCreated++;
                toast.loading(`Applied ${totalCreated}/${totalRequested} commits...`, {
                  id: toastId,
                  description: "Don't refresh the page !!!, This can take a while. Feel free to grab a coffee !",
                });
              } else if (msg.type === 'done') {
                toast.success("Changes applied successfully!", { id: toastId });
              } else if (msg.type === 'error') {
                throw new Error(msg.error);
              }
            } catch (parseErr) {
              console.error("Failed to parse SSE data:", parseErr);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to apply changes:", error);
      toast.error(`Error: ${(error as Error).message || 'Failed to apply changes'}`, { id: toastId });
    } finally {
      setIsApplying(false);
    }
  };

  const getPatternCells = useCallback((startCellKey: string, patternKey: string | null, patternSize: 'small' | 'large'): Set<string> => {
    const cells = new Set<string>();
    if (!patternKey || !startCellKey) return cells;
    const patternData = alphabetPatterns[patternKey];
    const startCellCoords = weeksMap.get(startCellKey);
    if (!patternData || !startCellCoords) return cells;
    const patternMatrix = patternData[patternSize];
    if (!patternMatrix || patternMatrix.length === 0) return cells;
    const patternHeight = patternMatrix.length;
    const patternWidth = patternMatrix[0].length;
    const rowOffset = Math.floor(patternHeight / 2);
    const colOffset = Math.floor(patternWidth / 2);
    patternMatrix.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        if (cellValue === 1) {
          const targetWeekIndex = (startCellCoords.weekIndex - colOffset) + colIndex;
          const targetDayIndex = (startCellCoords.dayIndex - rowOffset) + rowIndex;
          if (
            targetWeekIndex >= 0 && targetWeekIndex < weeksArray.length &&
            targetDayIndex >= 0 && targetDayIndex < 7 &&
            weeksArray[targetWeekIndex]?.[targetDayIndex]
          ) {
            const targetDate = weeksArray[targetWeekIndex][targetDayIndex];
            cells.add(format(targetDate, "yyyy-MM-dd"));
          }
        }
      });
    });
    return cells;
  }, [weeksArray, weeksMap]);

  useEffect(() => {
    const container = heatmapContainer.current;
    if (!container || !isEditing) return;

    const getTargetInfo = (ev: MouseEvent) => {
      const target = (ev.target as Element).closest?.('.heatmap-cell') as HTMLElement | null;
      if (!target || selectedBrushRef.current === null) return null;
      const dateKey = target.dataset.date!;
      const originalCount = contribMap.get(dateKey) ?? 0;
      const currentEditedCount = editedContributions[dateKey];
      const countBeforeClick = currentEditedCount !== undefined ? currentEditedCount : originalCount;
      return { dateKey, countBeforeClick, originalCount };
    };

    const handleLeftClick = (ev: MouseEvent) => {
      const info = getTargetInfo(ev);
      if (!info) return;
      if (selectedPattern) {
        const patternCells = getPatternCells(info.dateKey, selectedPattern, selectedPatternSize);
        setEditedContributions(prev => {
          const newEdits = { ...prev };
          patternCells.forEach(cellKey => {
            const originalCount = contribMap.get(cellKey) ?? 0;
            const currentCount = newEdits[cellKey] ?? originalCount;
            // --- MODIFIED: Clamp new count to a max of 20 ---
            newEdits[cellKey] = Math.min(20, currentCount + selectedBrushRef.current!);
          });
          return newEdits;
        });
      } else {
        // --- MODIFIED: Clamp new count to a max of 20 ---
        const newCount = Math.min(20, info.countBeforeClick + selectedBrushRef.current!);
        setEditedContributions(prev => ({ ...prev, [info.dateKey]: newCount }));
      }
    };

    const handleRightClick = (ev: MouseEvent) => {
      ev.preventDefault();
      const info = getTargetInfo(ev);
      if (!info) return;
      if (selectedPattern) {
        const patternCells = getPatternCells(info.dateKey, selectedPattern, selectedPatternSize);
        setEditedContributions(prev => {
          const newEdits = { ...prev };
          patternCells.forEach(cellKey => {
            const originalCount = contribMap.get(cellKey) ?? 0;
            const currentCount = newEdits[cellKey] ?? originalCount;
            // --- MODIFIED: Clamp new count to be no less than original ---
            newEdits[cellKey] = Math.max(originalCount, currentCount - selectedBrushRef.current!);
          });
          return newEdits;
        });
      } else {
        // --- MODIFIED: Clamp new count to be no less than original ---
        const newCount = Math.max(info.originalCount, info.countBeforeClick - selectedBrushRef.current!);
        setEditedContributions(prev => ({ ...prev, [info.dateKey]: newCount }));
      }
    };

    container.addEventListener('click', handleLeftClick);
    container.addEventListener('contextmenu', handleRightClick);

    return () => {
      container.removeEventListener('click', handleLeftClick);
      container.removeEventListener('contextmenu', handleRightClick);
    };
  }, [isEditing, editedContributions, contribMap, setEditedContributions, selectedPattern, selectedPatternSize, getPatternCells]);

  useEffect(() => {
    const container = heatmapContainer.current;
    if (!container) {
      return;
    }
    const handleMouseMove = (ev: MouseEvent) => {
      const target = (ev.target as Element).closest?.('.heatmap-cell') as HTMLElement | null;
      if (target) {
        const dateKey = target.dataset.date!;

        // --- NEW: Update hover details text ---
        const editedCount = editedContributions[dateKey];
        const originalCount = contribMap.get(dateKey) ?? 0;
        const currentCount = editedCount !== undefined ? editedCount : originalCount;
        const formattedDate = format(new Date(dateKey), "MMM d, yyyy");
        setHoveredCellDetails(`${currentCount} contributions on ${formattedDate}`);

        if (dateKey !== hoveredCellKey) {
          setHoveredCellKey(dateKey);
          if (isEditing && selectedPattern) {
            setPatternPreviewCells(getPatternCells(dateKey, selectedPattern, selectedPatternSize));
          } else {
            if (patternPreviewCells.size > 0) setPatternPreviewCells(new Set());
          }
        }
      } else {
        if (hoveredCellKey) setHoveredCellKey(null);
        if (isEditing && patternPreviewCells.size > 0) setPatternPreviewCells(new Set());
        setHoveredCellDetails(null);
      }
    };
    const handleMouseLeave = () => {
      setHoveredCellKey(null);
      if (isEditing) setPatternPreviewCells(new Set());
      setHoveredCellDetails(null);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEditing, hoveredCellKey, selectedPattern, selectedPatternSize, getPatternCells, patternPreviewCells.size, editedContributions, contribMap]);

  useEffect(() => {
    const container = heatmapContainer.current;
    if (!container) return;
    if (isEditing) container.classList.add('heatmap-editing');
    else container.classList.remove('heatmap-editing');
  }, [isEditing]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-w-[300px] font-sans">
      <div className="p-4 border rounded-lg w-fit max-w-full" style={{ backgroundColor: heatmapBg }}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-300">
            {isLoading ? (
              <span>Fetching contributions...</span>
            ) : (
              <span className="font-semibold">
                {hoveredCellDetails ? (
                  hoveredCellDetails
                ) : (
                  <>
                    {contributions?.totalContributions || 0} contributions
                    {selectedPeriod === 'rolling' ? ' in the last year' : ` in ${selectedPeriod}`}
                  </>
                )}
              </span>
            )}
          </div>
          <Select value={selectedPeriod} onValueChange={(value: string) => {
            const hasUnappliedEdits = Object.entries(editedContributions).some(([date, count]) => (contribMap.get(date) ?? 0) !== count);
            if (hasUnappliedEdits && !window.confirm("You have unapplied edits. Switching periods will discard them. Are you sure?")) {
              return;
            }
            setEditedContributions({});
            setSelectedPeriod(value);
          }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select period" /></SelectTrigger>
            <SelectContent className="h-[250px]" style={{ backgroundColor: heatmapBg }}>
              <SelectItem value="rolling">Last 12 months</SelectItem>
              {Array.from({ length: today.getFullYear() - 1999 }, (_, i) => {
                const year = today.getFullYear() - i;
                return (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>);
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full overflow-x-auto" ref={heatmapContainer}>
          <div className="inline-block">
            <div className="flex" style={{ gap: `${scaledGap}rem` }}>
              <div className="flex flex-col flex-shrink-0" style={{ gap: `${scaledGap}rem`, paddingTop: `${1.25 * scaleFactor}rem` }}>
                {dayLabels.map((day, index) => (
                  <span key={index} className="flex items-center" style={{ width: `3rem`, height: `${scaledCellSize}rem` }}>
                    {index % 2 !== 0 ? day : ""}
                  </span>
                ))}
              </div>
              <div className="relative">
                <div style={{ height: `${1.25 * scaleFactor}rem` }}>{monthLabels}</div>
                <HeatmapGrid
                  weeksArray={weeksArray}
                  contributionsCalendar={transformedContributions}
                  editedContributions={editedContributions}
                  isLoading={isLoading}
                  getColor={getColor}
                  colors={colors}
                  scaledCellSize={scaledCellSize}
                  scaledGap={scaledGap}
                  today={today}
                  viewType={viewType}
                  selectedYear={selectedYear}
                  hoveredCellKey={hoveredCellKey}
                  brushValue={selectedBrushValue}
                  patternPreviewCells={patternPreviewCells}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 justify-end flex items-center text-gray-500 gap-1">
          <span>Less</span>
          {colors.map((color, index) => (
            <div key={index} className="rounded-xs size-4" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </div>
      <EditControls
        isEditing={isEditing}
        toggleEditMode={toggleEditMode}
        selectedBrushValue={selectedBrushValue}
        setSelectedBrushValue={setSelectedBrushValue}
        getColor={getColor}
        colors={colors}
        heatmapBg={heatmapBg}
        onApply={handleApplyChanges}
        onClear={handleClearEdits}
        hasEdits={Object.entries(editedContributions).some(([date, count]) => (contribMap.get(date) ?? 0) !== count)}
        isApplying={isApplying}
        selectedPattern={selectedPattern}
        setSelectedPattern={setSelectedPattern}
        selectedPatternSize={selectedPatternSize}
        setSelectedPatternSize={setSelectedPatternSize}
      />
    </div>
  );
};

export default Heatmap;
