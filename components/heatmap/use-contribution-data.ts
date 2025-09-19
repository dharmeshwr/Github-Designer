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
    {
      "date": "2024-09-29",
      "count": 1
    },
    {
      "date": "2024-10-06",
      "count": 1
    },
    {
      "date": "2024-10-13",
      "count": 1
    },
    {
      "date": "2024-09-30",
      "count": 1
    },
    {
      "date": "2024-10-21",
      "count": 1
    },
    {
      "date": "2024-10-01",
      "count": 1
    },
    {
      "date": "2024-10-29",
      "count": 1
    },
    {
      "date": "2024-10-02",
      "count": 1
    },
    {
      "date": "2024-10-30",
      "count": 1
    },
    {
      "date": "2024-10-03",
      "count": 1
    },
    {
      "date": "2024-10-31",
      "count": 1
    },
    {
      "date": "2024-10-04",
      "count": 1
    },
    {
      "date": "2024-10-25",
      "count": 1
    },
    {
      "date": "2024-10-05",
      "count": 1
    },
    {
      "date": "2024-10-12",
      "count": 1
    },
    {
      "date": "2024-10-19",
      "count": 1
    },
    {
      "date": "2024-11-10",
      "count": 1
    },
    {
      "date": "2024-11-17",
      "count": 1
    },
    {
      "date": "2024-11-24",
      "count": 1
    },
    {
      "date": "2024-12-01",
      "count": 1
    },
    {
      "date": "2024-12-08",
      "count": 1
    },
    {
      "date": "2024-11-11",
      "count": 1
    },
    {
      "date": "2024-11-12",
      "count": 1
    },
    {
      "date": "2024-11-13",
      "count": 1
    },
    {
      "date": "2024-11-20",
      "count": 1
    },
    {
      "date": "2024-11-27",
      "count": 1
    },
    {
      "date": "2024-12-04",
      "count": 1
    },
    {
      "date": "2024-11-14",
      "count": 1
    },
    {
      "date": "2024-11-15",
      "count": 1
    },
    {
      "date": "2024-11-16",
      "count": 1
    },
    {
      "date": "2024-11-23",
      "count": 1
    },
    {
      "date": "2024-11-30",
      "count": 1
    },
    {
      "date": "2024-12-07",
      "count": 1
    },
    {
      "date": "2024-12-14",
      "count": 1
    },
    {
      "date": "2024-12-29",
      "count": 1
    },
    {
      "date": "2024-12-23",
      "count": 1
    },
    {
      "date": "2024-12-24",
      "count": 1
    },
    {
      "date": "2024-12-28",
      "count": 1
    },
    {
      "date": "2025-01-05",
      "count": 1
    },
    {
      "date": "2025-01-12",
      "count": 1
    },
    {
      "date": "2025-01-19",
      "count": 1
    },
    {
      "date": "2025-01-01",
      "count": 1
    },
    {
      "date": "2025-01-08",
      "count": 1
    },
    {
      "date": "2025-01-15",
      "count": 1
    },
    {
      "date": "2025-01-23",
      "count": 1
    },
    {
      "date": "2025-01-24",
      "count": 1
    },
    {
      "date": "2025-01-04",
      "count": 1
    },
    {
      "date": "2025-01-11",
      "count": 1
    },
    {
      "date": "2025-01-18",
      "count": 1
    },
    {
      "date": "2025-02-02",
      "count": 1
    },
    {
      "date": "2025-02-09",
      "count": 1
    },
    {
      "date": "2025-02-16",
      "count": 1
    },
    {
      "date": "2025-02-10",
      "count": 1
    },
    {
      "date": "2025-02-11",
      "count": 1
    },
    {
      "date": "2025-02-12",
      "count": 1
    },
    {
      "date": "2025-02-13",
      "count": 1
    },
    {
      "date": "2025-02-14",
      "count": 1
    },
    {
      "date": "2025-02-08",
      "count": 1
    },
    {
      "date": "2025-02-15",
      "count": 1
    },
    {
      "date": "2025-02-22",
      "count": 1
    },
    {
      "date": "2025-03-02",
      "count": 0
    },
    {
      "date": "2025-03-30",
      "count": 0
    },
    {
      "date": "2025-03-03",
      "count": 1
    },
    {
      "date": "2025-03-10",
      "count": 0
    },
    {
      "date": "2025-03-31",
      "count": 1
    },
    {
      "date": "2025-03-04",
      "count": 1
    },
    {
      "date": "2025-03-18",
      "count": 0
    },
    {
      "date": "2025-04-01",
      "count": 0
    },
    {
      "date": "2025-03-05",
      "count": 1
    },
    {
      "date": "2025-03-26",
      "count": 1
    },
    {
      "date": "2025-04-02",
      "count": 1
    },
    {
      "date": "2025-03-06",
      "count": 1
    },
    {
      "date": "2025-04-03",
      "count": 1
    },
    {
      "date": "2025-03-07",
      "count": 1
    },
    {
      "date": "2025-04-04",
      "count": 1
    },
    {
      "date": "2025-03-08",
      "count": 0
    },
    {
      "date": "2025-04-05",
      "count": 0
    },
    {
      "date": "2025-03-09",
      "count": 1
    },
    {
      "date": "2025-03-16",
      "count": 1
    },
    {
      "date": "2025-03-23",
      "count": 1
    },
    {
      "date": "2025-03-19",
      "count": 1
    },
    {
      "date": "2025-03-15",
      "count": 1
    },
    {
      "date": "2025-03-22",
      "count": 1
    },
    {
      "date": "2025-03-29",
      "count": 1
    },
    {
      "date": "2025-04-13",
      "count": 1
    },
    {
      "date": "2025-05-11",
      "count": 1
    },
    {
      "date": "2025-04-14",
      "count": 1
    },
    {
      "date": "2025-04-21",
      "count": 1
    },
    {
      "date": "2025-05-12",
      "count": 1
    },
    {
      "date": "2025-04-15",
      "count": 1
    },
    {
      "date": "2025-04-29",
      "count": 1
    },
    {
      "date": "2025-05-13",
      "count": 1
    },
    {
      "date": "2025-04-16",
      "count": 1
    },
    {
      "date": "2025-05-07",
      "count": 1
    },
    {
      "date": "2025-05-14",
      "count": 1
    },
    {
      "date": "2025-04-17",
      "count": 1
    },
    {
      "date": "2025-05-15",
      "count": 1
    },
    {
      "date": "2025-04-18",
      "count": 1
    },
    {
      "date": "2025-05-16",
      "count": 1
    },
    {
      "date": "2025-04-19",
      "count": 1
    },
    {
      "date": "2025-05-17",
      "count": 1
    },
    {
      "date": "2025-06-01",
      "count": 1
    },
    {
      "date": "2025-06-08",
      "count": 1
    },
    {
      "date": "2025-06-15",
      "count": 1
    },
    {
      "date": "2025-06-22",
      "count": 1
    },
    {
      "date": "2025-06-29",
      "count": 0
    },
    {
      "date": "2025-06-02",
      "count": 0
    },
    {
      "date": "2025-06-03",
      "count": 0
    },
    {
      "date": "2025-06-04",
      "count": 1
    },
    {
      "date": "2025-06-11",
      "count": 1
    },
    {
      "date": "2025-06-18",
      "count": 1
    },
    {
      "date": "2025-06-25",
      "count": 0
    },
    {
      "date": "2025-06-05",
      "count": 0
    },
    {
      "date": "2025-06-06",
      "count": 0
    },
    {
      "date": "2025-06-07",
      "count": 1
    },
    {
      "date": "2025-06-14",
      "count": 1
    },
    {
      "date": "2025-06-21",
      "count": 1
    },
    {
      "date": "2025-06-28",
      "count": 1
    },
    {
      "date": "2025-07-05",
      "count": 0
    },
    {
      "date": "2025-07-13",
      "count": 1
    },
    {
      "date": "2025-07-20",
      "count": 1
    },
    {
      "date": "2025-07-27",
      "count": 1
    },
    {
      "date": "2025-08-03",
      "count": 0
    },
    {
      "date": "2025-07-14",
      "count": 0
    },
    {
      "date": "2025-08-11",
      "count": 0
    },
    {
      "date": "2025-07-15",
      "count": 0
    },
    {
      "date": "2025-08-12",
      "count": 0
    },
    {
      "date": "2025-07-16",
      "count": 1
    },
    {
      "date": "2025-07-23",
      "count": 1
    },
    {
      "date": "2025-07-30",
      "count": 1
    },
    {
      "date": "2025-08-06",
      "count": 0
    },
    {
      "date": "2025-07-17",
      "count": 0
    },
    {
      "date": "2025-07-31",
      "count": 0
    },
    {
      "date": "2025-07-18",
      "count": 0
    },
    {
      "date": "2025-08-08",
      "count": 0
    },
    {
      "date": "2025-07-19",
      "count": 0
    },
    {
      "date": "2025-08-16",
      "count": 0
    },
    {
      "date": "2025-05-25",
      "count": 1
    },
    {
      "date": "2025-05-26",
      "count": 1
    },
    {
      "date": "2025-05-27",
      "count": 1
    },
    {
      "date": "2025-05-28",
      "count": 1
    },
    {
      "date": "2025-05-29",
      "count": 1
    },
    {
      "date": "2025-05-30",
      "count": 1
    },
    {
      "date": "2025-05-31",
      "count": 1
    },
    {
      "date": "2025-07-06",
      "count": 1
    },
    {
      "date": "2025-07-07",
      "count": 1
    },
    {
      "date": "2025-08-04",
      "count": 1
    },
    {
      "date": "2025-07-08",
      "count": 1
    },
    {
      "date": "2025-08-05",
      "count": 1
    },
    {
      "date": "2025-07-09",
      "count": 1
    },
    {
      "date": "2025-07-10",
      "count": 1
    },
    {
      "date": "2025-07-24",
      "count": 1
    },
    {
      "date": "2025-07-11",
      "count": 1
    },
    {
      "date": "2025-08-01",
      "count": 1
    },
    {
      "date": "2025-07-12",
      "count": 1
    },
    {
      "date": "2025-08-09",
      "count": 1
    }
  ],
  totalContributions: 130,
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
