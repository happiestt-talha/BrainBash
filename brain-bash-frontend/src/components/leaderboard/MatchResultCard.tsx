'use client';

interface ResultEntry {
  rank: number;
  score: number;
  displayName: string;
  team: 'A' | 'B' | null;
}

export function MatchResultCard({ entry }: { entry: ResultEntry }) {
  const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        entry.rank === 1 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-gray-400">{medal ?? `#${entry.rank}`}</span>
        <span className="font-medium">{entry.displayName}</span>
        {entry.team && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">Team {entry.team}</span>
        )}
      </div>
      <span className="text-xl font-bold">{entry.score}</span>
    </div>
  );
}