export type ConnectionStatus = 'connected' | 'disconnected';
export declare class MatchParticipant {
    id: string;
    matchId: string;
    userId: string;
    guestSessionId: string;
    displayName: string;
    team: 'A' | 'B' | null;
    totalScore: number;
    currentStreak: number;
    bestStreak: number;
    connectionStatus: ConnectionStatus;
    socketId: string;
    joinedAt: Date;
}
