import { useEffect } from "react";

export function useHorizantalScroll(container: any) {
  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const handleWheel = (e: any) => {
      e.preventDefault();
      const scrollAmount = e.deltaY;
      element.scrollLeft += scrollAmount;
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [container]);
}
