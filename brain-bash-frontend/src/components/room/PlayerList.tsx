'use client';

interface Player {
  socketId: string;
  playerName: string;
  team: 'A' | 'B' | null;
}

export function PlayerList({ players }: { players: Player[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-500">Players ({players.length})</h3>
      {players.map((p) => (
        <div key={p.socketId} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span>{p.playerName}</span>
          {p.team && (
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                p.team === 'A' ? 'bg-blue-500' : 'bg-red-500'
              }`}
            >
              Team {p.team}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}