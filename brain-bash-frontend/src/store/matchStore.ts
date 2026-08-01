import { create } from 'zustand';
import { QuestionPushPayload, RevealPayload, ScoreEntry, MatchEndedPayload } from '@/types/match.types';

interface MatchStoreState {
  matchId: string | null;
  roomCode: string | null;
  currentQuestion: QuestionPushPayload | null;
  myAnswer: number | null;
  hasAnswered: boolean;
  answeredPlayerIds: string[];
  lastReveal: RevealPayload | null;
  scores: ScoreEntry[];
  matchEnded: MatchEndedPayload | null;
  myStreak: number;

  setMatchId: (matchId: string, roomCode: string) => void;
  setQuestion: (q: QuestionPushPayload) => void;
  submitMyAnswer: (option: number) => void;
  markPlayerAnswered: (playerId: string) => void;
  setReveal: (reveal: RevealPayload) => void;
  setScores: (scores: ScoreEntry[]) => void;
  setMatchEnded: (payload: MatchEndedPayload) => void;
  reset: () => void;
}

export const useMatchStore = create<MatchStoreState>((set) => ({
  matchId: null,
  roomCode: null,
  currentQuestion: null,
  myAnswer: null,
  hasAnswered: false,
  answeredPlayerIds: [],
  lastReveal: null,
  scores: [],
  matchEnded: null,
  myStreak: 0,

  setMatchId: (matchId, roomCode) => set({ matchId, roomCode }),

  setQuestion: (q) =>
    set({
      currentQuestion: q,
      myAnswer: null,
      hasAnswered: false,
      answeredPlayerIds: [],
      lastReveal: null,
    }),

  submitMyAnswer: (option) => set({ myAnswer: option, hasAnswered: true }),

  markPlayerAnswered: (playerId) =>
    set((state) => ({
      answeredPlayerIds: state.answeredPlayerIds.includes(playerId)
        ? state.answeredPlayerIds
        : [...state.answeredPlayerIds, playerId],
    })),

  setReveal: (reveal) => set({ lastReveal: reveal }),

  setScores: (scores) => set({ scores }),

  setMatchEnded: (payload) => set({ matchEnded: payload }),

  reset: () =>
    set({
      matchId: null,
      roomCode: null,
      currentQuestion: null,
      myAnswer: null,
      hasAnswered: false,
      answeredPlayerIds: [],
      lastReveal: null,
      scores: [],
      matchEnded: null,
      myStreak: 0,
    }),
}));