'use client'

import { createContext, useState, useContext, ReactNode } from "react";

interface ScaleContextType {
  scaleFactor: number;
  increaseScale: () => void;
  decreaseScale: () => void;
}

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export const ScaleProvider = ({ children }: { children: ReactNode }) => {
  const [scaleFactor, setScaleFactor] = useState(1.4);

  const increaseScale = () => {
    setScaleFactor((prev) => Math.min(5, prev + 1));
  };

  const decreaseScale = () => {
    setScaleFactor((prev) => Math.max(1.4, prev - 1));
  };

  return (
    <ScaleContext.Provider value={{ scaleFactor, increaseScale, decreaseScale }}>
      {children}
    </ScaleContext.Provider>
  );
};

export const useScale = () => {
  const context = useContext(ScaleContext);
  if (context === undefined) {
    throw new Error("useScale must be used within a ScaleProvider");
  }
  return context;
};
