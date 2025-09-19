// ./edit-controls.tsx
'use client'
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { Pen, X, Check, Trash2, Loader2 } from "lucide-react";
import { alphabetPatterns } from "./patterns";

type EditControlsProps = {
  isEditing: boolean;
  toggleEditMode: () => void;
  selectedBrushValue: number | null;
  setSelectedBrushValue: (value: number | null) => void;
  getColor: (count: number, colors: string[]) => string;
  colors: string[];
  heatmapBg: string;
  onApply: () => void;
  onClear: () => void;
  hasEdits: boolean;
  isApplying: boolean;
  selectedPattern: string | null;
  setSelectedPattern: (patternKey: string | null) => void;
  selectedPatternSize: 'small' | 'large';
  setSelectedPatternSize: (size: 'small' | 'large') => void;
};

const brushOptions = [1, 5, 10, 14];
const patternKeys = Object.keys(alphabetPatterns);

const singleCellPattern = {
  small: [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  large: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

const EditControls: React.FC<EditControlsProps> = ({
  isEditing,
  toggleEditMode,
  selectedBrushValue,
  setSelectedBrushValue,
  getColor,
  colors,
  heatmapBg,
  onApply,
  onClear,
  hasEdits,
  isApplying,
  selectedPattern,
  setSelectedPattern,
  selectedPatternSize,
  setSelectedPatternSize,
}) => {
  const previewMatrix = useMemo(() => {
    if (selectedPattern) {
      return alphabetPatterns[selectedPattern]?.[selectedPatternSize] ?? singleCellPattern.large;
    }
    return singleCellPattern[selectedPatternSize];
  }, [selectedPattern, selectedPatternSize]);

  const previewHeight = previewMatrix.length;
  const previewWidth = previewMatrix[0]?.length ?? 0;

  return (
    <div className="mt-5 w-full flex flex-col justify-center ">
      <div className="inline-flex w-full justify-center">
        <Button variant={"outline"} onClick={toggleEditMode}>
          {isEditing ? (
            <>
              <X size={12} className="mr-1" /> Done
            </>
          ) : (
            <>
              <Pen size={12} className="mr-1" /> Edit
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <div className="mt-4 p-4 border rounded-lg place-self-center min-w-fit" style={{ backgroundColor: heatmapBg }}>
          <div className="flex gap-6">
            <div className="flex flex-col items-center p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-2 font-semibold">PREVIEW</p>
              <div className="flex gap-1">
                {Array.from({ length: previewWidth }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {Array.from({ length: previewHeight }).map((_, rowIndex) => {
                      const cellValue = previewMatrix[rowIndex]?.[colIndex] ?? 0;
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className="size-4 rounded-xs"
                          style={{
                            backgroundColor: cellValue === 1
                              ? getColor(selectedBrushValue ?? 1, colors)
                              : colors[0],
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 flex-grow">
              <div>
                <p className="text-sm mb-3 font-semibold">1. Select Brush Strength</p>
                <div className="flex items-center gap-3">
                  {brushOptions.map(value => (
                    <button
                      key={value}
                      onClick={() => setSelectedBrushValue(value)}
                      className={`p-1 rounded-md transition-transform duration-150 group ${selectedBrushValue === value ? 'ring-2 ring-primary/70 scale-110' : 'ring-1 ring-gray-600'}`}
                      title={`${value} contributions`}
                    >
                      <div className="size-6 rounded-sm group-hover:grayscale-25" style={{ backgroundColor: getColor(value, colors) }}>
                        <span className="group-hover:opacity-100 opacity-0 pointer-events-none">{value}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-3 font-semibold">2. Select Pattern</p>
                <div className="flex gap-2 flex-wrap max-w-2xl">
                  <Button
                    size="sm"
                    variant='outline'
                    className={`transition-transform duration-150 ${!selectedPattern ? 'ring-2 ring-primary/70 scale-105' : 'ring-0 ring-gray-600'}`}
                    onClick={() => setSelectedPattern(null)}
                  >
                    Single
                  </Button>
                  {patternKeys.map(key => (
                    <Button
                      key={key}
                      size="sm"
                      variant='outline'
                      className={`transition-transform duration-150 ${selectedPattern === key ? 'ring-2 ring-primary/70 scale-105' : 'ring-0 ring-gray-600'}`}
                      onClick={() => setSelectedPattern(key)}>
                      {key}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-3 font-semibold">3. Select Size</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedPatternSize === 'small' ? 'default' : 'outline'}
                    onClick={() => setSelectedPatternSize('small')}
                    className={`transition-transform duration-150 ${selectedPatternSize === 'small' ? 'scale-105' : ''}`}
                  >
                    Small
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedPatternSize === 'large' ? 'default' : 'outline'}
                    onClick={() => setSelectedPatternSize('large')}
                    className={`transition-transform duration-150 ${selectedPatternSize === 'large' ? 'scale-105' : ''}`}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-center border-t pt-4">
            <Button onClick={onApply} disabled={!hasEdits || isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" /> Apply Changes
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={onClear} disabled={!hasEdits || isApplying}>
              <Trash2 size={14} className="mr-1" /> Clear Edits
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditControls;
