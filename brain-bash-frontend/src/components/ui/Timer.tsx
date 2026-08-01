'use client';

import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  pushedAt: number;
  timeLimitMs: number;
  onTimeUp?: () => void;
}

export function Timer({ pushedAt, timeLimitMs, onTimeUp }: TimerProps) {
  const [remainingMs, setRemainingMs] = useState(timeLimitMs);
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    setRemainingMs(timeLimitMs);

    const interval = setInterval(() => {
      const elapsed = Date.now() - pushedAt;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      setRemainingMs(remaining);

      if (remaining === 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeUp?.();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pushedAt, timeLimitMs, onTimeUp]);

  const percentage = (remainingMs / timeLimitMs) * 100;
  const seconds = Math.ceil(remainingMs / 1000);

  const barColor =
    percentage > 50
      ? 'bg-gradient-to-r from-emerald-400 to-green-500'
      : percentage > 20
        ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
        : 'bg-gradient-to-r from-red-500 to-rose-600';

  const isUrgent = percentage <= 20 && percentage > 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span className="text-gray-400">Time left</span>
        <span className={`tabular-nums ${isUrgent ? 'animate-pulse text-lg font-bold text-red-400' : 'text-gray-300'}`}>
          {seconds}s
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-700/50">
        <div
          className={`h-full rounded-full transition-all duration-100 ease-linear ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}