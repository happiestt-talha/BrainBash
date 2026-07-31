export declare class MatchAnswer {
    id: string;
    matchParticipantId: string;
    matchQuestionId: string;
    selectedOptionIndex: number | null;
    isCorrect: boolean;
    answeredAt: Date;
    elapsedMs: number;
    pointsEarned: number;
    streakAtTime: number;
}
