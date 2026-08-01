'use client';

import { useEffect, useState } from 'react';

export function Timer({ pushedAt, timeLimitMs }: { pushedAt: number; timeLimitMs: number }) {
  const [remainingMs, setRemainingMs] = useState(timeLimitMs);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - pushedAt;
      setRemainingMs(Math.max(0, timeLimitMs - elapsed));
    }, 100);
    return () => clearInterval(interval);
  }, [pushedAt, timeLimitMs]);

  const percentage = (remainingMs / timeLimitMs) * 100;
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm text-gray-500">
        <span>Time left</span>
        <span>{seconds}s</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-100 ${
            percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}