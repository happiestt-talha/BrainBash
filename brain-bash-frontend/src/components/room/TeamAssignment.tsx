'use client';

interface Player {
  socketId: string;
  playerName: string;
  team: 'A' | 'B' | null;
}

export function TeamAssignment({
  players,
  onAssign,
}: {
  players: Player[];
  onAssign: (playerId: string, team: 'A' | 'B') => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500">Assign teams (optional)</h3>
      {players.map((p) => (
        <div key={p.socketId} className="flex items-center justify-between">
          <span className="text-sm">{p.playerName}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onAssign(p.socketId, 'A')}
              className={`rounded px-3 py-1 text-xs font-medium ${
                p.team === 'A' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Team A
            </button>
            <button
              onClick={() => onAssign(p.socketId, 'B')}
              className={`rounded px-3 py-1 text-xs font-medium ${
                p.team === 'B' ? 'bg-red-500 text-white' : 'bg-gray-100'
              }`}
            >
              Team B
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}