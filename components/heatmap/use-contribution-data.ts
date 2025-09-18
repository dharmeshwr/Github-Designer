'use client'
import { useState, useEffect, useRef } from "react";

interface Contribution {
  date: string;
  count: number;
}

interface ContributionData {
  calendar: Contribution[];
  totalContributions: number;
  year: string;
  from: string;
  to: string;
}

const fallbackData: ContributionData = {
  calendar: [
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
  ],
  totalContributions: 21,
  year: "2024",
  from: "",
  to: ""
};

const initialState: ContributionData = {
  calendar: [],
  totalContributions: 0,
  year: '',
  from: '',
  to: ''
};


export const useContributionData = (selectedPeriod: string) => {
  const [data, setData] = useState<ContributionData>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentPeriodRef = useRef<string>(selectedPeriod);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    currentPeriodRef.current = selectedPeriod;

    const fetchContributions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/user/contributions/?year=${selectedPeriod}`, {
          method: "GET",
          credentials: "include",
          signal
        });

        if (signal.aborted) {
          return;
        }

        if (res.ok) {
          const json: ContributionData = await res.json();

          if (json && json.calendar) {
            if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
              setData(json);
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
        if (!signal.aborted) {
          console.error("Error fetching contributions:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
          if (currentPeriodRef.current === selectedPeriod) {
            setData(fallbackData);
          }
        }
      } finally {
        if (currentPeriodRef.current === selectedPeriod && !signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedPeriod]);

  return { contributions: data, isLoading, error };
};
