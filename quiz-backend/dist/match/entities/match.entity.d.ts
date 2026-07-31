export type MatchStatus = 'active' | 'completed' | 'abandoned';
export declare class Match {
    id: string;
    roomId: string;
    totalQuestions: number;
    status: MatchStatus;
    startedAt: Date;
    endedAt: Date;
}
