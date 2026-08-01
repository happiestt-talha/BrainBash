'use client';

import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useMatchStore } from '@/store/matchStore';
import { MatchEvents } from '@/lib/constants';
import {
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
  const {
    setQuestion,
    markPlayerAnswered,
    setReveal,
    setScores,
    setMatchEnded,
  } = useMatchStore();

  useEffect(() => {
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
  }, [socket]);

  function submitAnswer(matchId: string, questionId: string, selectedOption: number) {
    useMatchStore.getState().submitMyAnswer(selectedOption);
    socket.emit(MatchEvents.ANSWER_SUBMIT, { matchId, questionId, selectedOption });
  }

  return { submitAnswer };
}