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
    { date: "2024-10-20", count: 1 },
    { date: "2024-10-27", count: 1 },
    { date: "2024-10-21", count: 1 },
    { date: "2024-11-04", count: 1 },
    { date: "2024-10-22", count: 1 },
    { date: "2024-11-05", count: 1 },
    { date: "2024-10-23", count: 1 },
    { date: "2024-10-30", count: 1 },
    { date: "2024-11-17", count: 1 },
    { date: "2024-11-24", count: 1 },
    { date: "2024-12-01", count: 1 },
    { date: "2024-11-18", count: 1 },
    { date: "2024-12-02", count: 1 },
    { date: "2024-11-19", count: 1 },
    { date: "2024-11-26", count: 1 },
    { date: "2024-11-20", count: 1 },
    { date: "2024-12-04", count: 1 },
    { date: "2024-12-15", count: 1 },
    { date: "2024-12-22", count: 1 },
    { date: "2024-12-29", count: 1 },
    { date: "2025-01-05", count: 0 },
    { date: "2024-12-23", count: 1 },
    { date: "2024-12-30", count: 0 },
    { date: "2024-12-24", count: 1 },
    { date: "2024-12-31", count: 0 },
    { date: "2024-12-18", count: 1 },
    { date: "2024-12-25", count: 1 },
    { date: "2025-01-01", count: 1 },
    { date: "2025-01-08", count: 0 },
    { date: "2025-01-12", count: 1 },
    { date: "2025-02-02", count: 1 },
    { date: "2025-01-13", count: 1 },
    { date: "2025-01-20", count: 1 },
    { date: "2025-02-03", count: 1 },
    { date: "2025-01-14", count: 1 },
    { date: "2025-01-28", count: 1 },
    { date: "2025-02-04", count: 1 },
    { date: "2025-01-15", count: 1 },
    { date: "2025-02-05", count: 1 },
    { date: "2025-02-16", count: 1 },
    { date: "2025-03-09", count: 1 },
    { date: "2025-02-17", count: 1 },
    { date: "2025-03-03", count: 1 },
    { date: "2025-02-18", count: 1 },
    { date: "2025-02-25", count: 1 },
    { date: "2025-02-19", count: 1 },
    { date: "2025-03-05", count: 1 },
    { date: "2025-03-26", count: 1 },
    { date: "2025-04-09", count: 1 },
    { date: "2025-03-27", count: 1 },
    { date: "2025-04-10", count: 1 },
    { date: "2025-03-28", count: 1 },
    { date: "2025-04-04", count: 1 },
    { date: "2025-04-11", count: 1 },
    { date: "2025-04-18", count: 0 },
    { date: "2025-03-29", count: 1 },
    { date: "2025-04-05", count: 1 },
    { date: "2025-04-12", count: 1 },
    { date: "2025-04-19", count: 0 },
    { date: "2025-04-02", count: 0 },
    { date: "2025-04-16", count: 0 },
    { date: "2025-04-03", count: 0 },
    { date: "2025-04-17", count: 0 },
    { date: "2025-04-25", count: 1 },
    { date: "2025-04-26", count: 1 },
    { date: "2025-04-30", count: 1 },
    { date: "2025-05-07", count: 1 },
    { date: "2025-04-24", count: 1 },
    { date: "2025-05-15", count: 1 },
    { date: "2025-05-02", count: 1 },
    { date: "2025-05-09", count: 1 },
    { date: "2025-05-16", count: 1 },
    { date: "2025-05-17", count: 1 },
    { date: "2025-05-21", count: 1 },
    { date: "2025-05-28", count: 1 },
    { date: "2025-06-04", count: 1 },
    { date: "2025-06-11", count: 0 },
    { date: "2025-05-29", count: 1 },
    { date: "2025-06-05", count: 0 },
    { date: "2025-05-30", count: 1 },
    { date: "2025-06-06", count: 0 },
    { date: "2025-05-31", count: 1 },
    { date: "2025-06-07", count: 0 },
    { date: "2025-06-18", count: 1 },
    { date: "2025-06-25", count: 1 },
    { date: "2025-07-02", count: 1 },
    { date: "2025-07-09", count: 0 },
    { date: "2025-06-19", count: 1 },
    { date: "2025-06-20", count: 1 },
    { date: "2025-06-27", count: 1 },
    { date: "2025-06-21", count: 1 },
    { date: "2025-06-28", count: 1 },
    { date: "2025-07-05", count: 1 },
    { date: "2025-07-12", count: 0 },
    { date: "2025-07-16", count: 1 },
    { date: "2025-07-23", count: 1 },
    { date: "2025-07-30", count: 1 },
    { date: "2025-07-17", count: 1 },
    { date: "2025-07-31", count: 1 },
    { date: "2025-07-18", count: 1 },
    { date: "2025-07-25", count: 1 },
    { date: "2025-07-19", count: 1 },
    { date: "2025-08-02", count: 1 },
    { date: "2025-08-20", count: 1 },
    { date: "2025-08-21", count: 1 },
    { date: "2025-08-23", count: 1 }
  ],
  totalContributions: 109,
  year: "2025",
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
