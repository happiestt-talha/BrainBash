export interface QuestionPushPayload {
  questionId: string;
  index: number;
  text: string;
  options: string[];
  timeLimitMs: number;
  serverTimestamp: number;
}

export interface RevealResult {
  playerId: string;
  selectedOption: number | null;
  correct: boolean;
  pointsEarned: number;
  streakCount: number;
}

export interface RevealPayload {
  questionId: string;
  correctOption: number;
  results: RevealResult[];
  scores: ScoreEntry[];
}

export interface ScoreEntry {
  playerId: string;
  totalScore: number;
  team: 'A' | 'B' | null;
}

export interface MatchEndedPayload {
  finalScores: ScoreEntry[];
  winnerId: string | null;
}

export interface PlayerJoinedPayload {
  players: { socketId: string; playerName: string; userId: string | null; team: 'A' | 'B' | null }[];
}