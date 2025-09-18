// ./edit-controls.tsx
'use client'
import React from "react";
import { Button } from "../ui/button";
// --- NEW: Import a loader icon ---
import { Pen, X, Check, Trash2, Loader2 } from "lucide-react";

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
  // --- NEW PROP ---
  isApplying: boolean;
};

const brushOptions = [0, 2, 4, 6, 8];

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
  // --- NEW PROP ---
  isApplying,
}) => {
  return (
    <div className="mt-5 w-fit">
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
        <div className="mt-4 p-4 border rounded-lg w-fit" style={{ backgroundColor: heatmapBg }}>
          <p className="text-sm text-center mb-3 font-semibold">Select a contribution level to paint</p>
          <div className="flex items-center justify-center gap-3">
            {brushOptions.map(value => (
              <button
                key={value}
                onClick={() => setSelectedBrushValue(value)}
                className={`p-1 rounded-md transition-transform duration-150 ${selectedBrushValue === value ? 'ring-2 ring-blue-500 scale-110' : 'ring-1 ring-gray-600'}`}
                title={`${value} contributions`}
              >
                <div className="size-6 rounded-sm" style={{ backgroundColor: getColor(value, colors) }} />
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            {/* --- MODIFIED BUTTON --- */}
            <Button onClick={onApply} disabled={!hasEdits || isApplying} >
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
            {/* --- END MODIFICATION --- */}
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
