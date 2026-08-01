'use client';

import { useMatchStore } from '@/store/matchStore';

export function LiveScoreboard() {
  const { scores, answeredPlayerIds } = useMatchStore();

  const sorted = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-500">Scoreboard</h3>
      {sorted.map((entry, i) => (
        <div key={entry.playerId} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 text-gray-400">{i + 1}.</span>
            <span>{entry.playerId}</span>
            {entry.team && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">Team {entry.team}</span>
            )}
            {answeredPlayerIds.includes(entry.playerId) && (
              <span className="text-xs text-green-500">✓ answered</span>
            )}
          </div>
          <span className="font-semibold">{entry.totalScore}</span>
        </div>
      ))}
    </div>
  );
}