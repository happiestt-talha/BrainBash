'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useMatchStore } from '@/store/matchStore';
import { MatchEvents } from '@/lib/constants';
import type {
  QuestionPushPayload,
  RevealPayload,
  ScoreEntry,
  MatchEndedPayload,
} from '@/types/match.types';

// The ONLY place that subscribes to raw socket events for match state.
// Every component reads from useMatchStore, never from the socket directly —
// this avoids duplicate listeners and cleanup bugs across QuestionCard,
// LiveScoreboard, etc.
export function useMatchState() {
  const socket = useSocket();
  const params = useParams();
  const {
    setQuestion,
    markPlayerAnswered,
    setReveal,
    setScores,
    setMatchEnded,
  } = useMatchStore();

  useEffect(() => {
    const matchId = params?.matchId as string | undefined;

    // Ensure matchId is always set in the store — it may have been lost
    // during the Next.js page transition from lobby → match.
    if (matchId && !useMatchStore.getState().matchId) {
      useMatchStore.getState().setMatchId(matchId, '');
    }

    if (matchId) {
      socket.emit(MatchEvents.MATCH_STATE_SYNC, { matchId });
    }

    function onQuestionPush(payload: QuestionPushPayload) {
      setQuestion(payload);
    }
    function onPlayerAnswered(payload: { playerId: string }) {
      markPlayerAnswered(payload.playerId);
    }
    function onReveal(payload: RevealPayload) {
      setReveal(payload);
    }
    function onScoreboardUpdate(payload: ScoreEntry[]) {
      setScores(payload);
    }
    function onMatchEnded(payload: MatchEndedPayload) {
      setMatchEnded(payload);
    }

    socket.on(MatchEvents.QUESTION_PUSH, onQuestionPush);
    socket.on(MatchEvents.QUESTION_PLAYER_ANSWERED, onPlayerAnswered);
    socket.on(MatchEvents.QUESTION_REVEAL, onReveal);
    socket.on(MatchEvents.SCOREBOARD_UPDATE, onScoreboardUpdate);
    socket.on(MatchEvents.MATCH_ENDED, onMatchEnded);

    return () => {
      socket.off(MatchEvents.QUESTION_PUSH, onQuestionPush);
      socket.off(MatchEvents.QUESTION_PLAYER_ANSWERED, onPlayerAnswered);
      socket.off(MatchEvents.QUESTION_REVEAL, onReveal);
      socket.off(MatchEvents.SCOREBOARD_UPDATE, onScoreboardUpdate);
      socket.off(MatchEvents.MATCH_ENDED, onMatchEnded);
    };
  }, [socket, params?.matchId]);
}