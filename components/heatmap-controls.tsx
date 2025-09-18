'use client'

import { useScale } from "@/contexts/scale-context";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

export const HeatmapControls = () => {
  const { scaleFactor, increaseScale, decreaseScale } = useScale();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={decreaseScale}
        disabled={scaleFactor <= 1.4}
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={increaseScale}
        disabled={scaleFactor >= 5}
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
