export interface ScoreResult {
    pointsEarned: number;
    newStreak: number;
    streakBonus: number;
}
export declare class ScoringService {
    private readonly BASE_POINTS;
    private readonly TIMEOUT_PENALTY;
    calculateScore(params: {
        isCorrect: boolean;
        elapsedMs: number;
        timeLimitMs: number;
        currentStreakBefore: number;
    }): ScoreResult;
    calculateTimeoutPenalty(): ScoreResult;
}
