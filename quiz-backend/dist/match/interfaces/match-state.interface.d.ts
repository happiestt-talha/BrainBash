export interface MatchParticipantState {
    playerId: string;
    displayName: string;
    team: 'A' | 'B' | null;
    totalScore: number;
    currentStreak: number;
    connectionStatus: 'connected' | 'disconnected';
}
export interface CurrentQuestionState {
    questionId: string;
    index: number;
    text: string;
    options: string[];
    timeLimitMs: number;
    pushedAt: number;
    answeredPlayerIds: string[];
}
export interface MatchState {
    matchId: string;
    roomId: string;
    status: 'active' | 'completed' | 'abandoned';
    totalQuestions: number;
    currentQuestion: CurrentQuestionState | null;
    participants: MatchParticipantState[];
}
