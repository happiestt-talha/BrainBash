export type RoomStatus = 'lobby' | 'in_progress' | 'ended';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export declare class Room {
    id: string;
    code: string;
    hostUserId: string;
    hostGuestSessionId: string;
    categoryId: string;
    difficulty: Difficulty;
    maxPlayers: number;
    status: RoomStatus;
    createdAt: Date;
    startedAt: Date;
}
