'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from './useSocket';
import { MatchEvents } from '@/lib/constants';
import { useMatchStore } from '@/store/matchStore';

interface LobbyPlayer {
  socketId: string;
  playerName: string;
  userId: string | null;
  team: 'A' | 'B' | null;
}

// Separate from useMatchState on purpose — lobby events (joining, team
// assignment) are a different lifecycle from in-match events, and mixing
// them into one hook made the match-state hook harder to reason about.
export function useLobby(roomCode: string) {
  const socket = useSocket();
  const router = useRouter();
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const setMatchId = useMatchStore((s) => s.setMatchId);

  useEffect(() => {
    function onPlayerJoined(payload: { players: LobbyPlayer[] }) {
      setPlayers(payload.players);
    }
    function onTeamAssigned(payload: { playerId: string; team: 'A' | 'B' }) {
      setPlayers((prev) =>
        prev.map((p) => (p.socketId === payload.playerId ? { ...p, team: payload.team } : p)),
      );
    }
    function onMatchStarted(payload: { matchId: string; totalQuestions: number; category: string }) {
      setMatchId(payload.matchId, roomCode);
      router.push(`/match/${payload.matchId}`);
    }

    socket.on(MatchEvents.ROOM_PLAYER_JOINED, onPlayerJoined);
    socket.on(MatchEvents.ROOM_TEAM_ASSIGNED, onTeamAssigned);
    socket.on(MatchEvents.MATCH_STARTED, onMatchStarted);

    return () => {
      socket.off(MatchEvents.ROOM_PLAYER_JOINED, onPlayerJoined);
      socket.off(MatchEvents.ROOM_TEAM_ASSIGNED, onTeamAssigned);
      socket.off(MatchEvents.MATCH_STARTED, onMatchStarted);
    };
  }, [socket, roomCode]);

  return { players };
}