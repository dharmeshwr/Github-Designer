'use client';

import { useEffect } from 'react';

export function ViewCounter() {
  useEffect(() => {
    fetch("/api/views")
      .then((res) => res.json())
      .catch(console.error);
  }, []);

  return null;
}

