'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useLobby } from '@/hooks/useLobby';
import { useAuth } from '@/hooks/useAuth';
import { RoomCodeDisplay } from '@/components/room/RoomCodeDisplay';
import { PlayerList } from '@/components/room/PlayerList';
import { TeamAssignment } from '@/components/room/TeamAssignment';

export default function LobbyPage() {
  const params = useParams();
  const code = params.code as string;

  const { user, guest } = useAuth();
  const { joinRoom, assignTeam, startMatch } = useRoom();
  const { players } = useLobby(code);

  const displayName = user?.displayName ?? guest?.displayName ?? '';
  const isHost = players.find(p => p.playerName === displayName)?.isHost ?? false;

  useEffect(() => {
    if (displayName) {
      joinRoom(code, displayName, user?.id);
    }
  }, [displayName]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-8">
      <RoomCodeDisplay code={code} />
      <PlayerList players={players} />

      {isHost && (
        <>
          <TeamAssignment
            players={players}
            onAssign={(playerId, team) => assignTeam(code, playerId, team)}
          />
          <button
            onClick={() => startMatch(code)}
            disabled={players.length < 2}
            className="rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {players.length < 2 ? 'Waiting for more players...' : 'Start match'}
          </button>
        </>
      )}
    </div>
  );
}