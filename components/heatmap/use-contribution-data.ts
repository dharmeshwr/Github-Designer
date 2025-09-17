'use client'
import { useState, useEffect, useRef } from "react";

interface ContributionDay {
  date: string;
  count: number;
}

const fallbackData: ContributionDay[] = [
  { date: "2025-10-13", count: 3 },
  { date: "2025-05-12", count: 1 },
  { date: "2025-09-11", count: 2 },
  { date: "2025-09-10", count: 5 },
  { date: "2024-09-13", count: 2 },
  { date: "2024-09-15", count: 0 },
  { date: "2024-09-20", count: 4 },
  { date: "2024-10-01", count: 1 },
  { date: "2024-10-05", count: 3 },
  { date: "2024-10-10", count: 0 },
];

export const useContributionData = (selectedPeriod: string) => {
  const [data, setData] = useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentPeriodRef = useRef<string>(selectedPeriod);

  useEffect(() => {
    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    currentPeriodRef.current = selectedPeriod;

    const fetchContributions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.time(`Fetching contributions for ${selectedPeriod}`);

        const res = await fetch(`/api/user/contributions/?year=${selectedPeriod}`, {
          method: "GET",
          credentials: "include",
          signal
        });

        console.timeEnd(`Fetching contributions for ${selectedPeriod}`);

        if (signal.aborted) {
          return;
        }

        if (res.ok) {
          const json = await res.json();
          const calendar = json.calendar;

          if (calendar) {
            if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
              setData(calendar);
            }
          } else {
            console.warn("API response missing calendar data, using fallback.");
            if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
              setData(fallbackData);
            }
          }
        } else {
          console.warn(`Contributions fetch failed: ${res.status}`);
          setError(`Failed to fetch data: ${res.status}`);
          if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
            setData(fallbackData);
          }
        }
      } catch (err) {
        // Don't set error if request was aborted
        if (!signal.aborted) {
          console.error("Error fetching contributions:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
          if (currentPeriodRef.current === selectedPeriod) {
            setData(fallbackData);
          }
        }
      } finally {
        // Only set loading to false if this is still the current request
        if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchContributions();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedPeriod]);

  return { contributionsData: data, isLoading, error };
};
