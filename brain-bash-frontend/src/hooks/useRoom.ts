'use client';

import { useSocket } from './useSocket';
import { MatchEvents } from '@/lib/constants';
import { useMatchStore } from '@/store/matchStore';
import { api } from '@/lib/api';

export function useRoom() {
  const socket = useSocket();

  async function createRoom(categoryId: string, difficulty: string, hostDisplayName: string) {
    const room: any = await api.createRoom(categoryId, difficulty, hostDisplayName);
    return room; // { id, code, categoryId, difficulty, status, ... }
  }

  function joinRoom(roomCode: string, playerName: string, userId?: string) {
    socket.emit(MatchEvents.ROOM_JOIN, { roomCode, playerName, userId });
  }

  function assignTeam(roomCode: string, playerId: string, team: 'A' | 'B') {
    socket.emit(MatchEvents.ROOM_ASSIGN_TEAM, { roomCode, playerId, team });
  }

  function startMatch(roomCode: string) {
    socket.emit(MatchEvents.ROOM_START_MATCH, { roomCode });
  }

  return { createRoom, joinRoom, assignTeam, startMatch };
}