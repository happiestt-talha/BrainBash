import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
export declare class MatchGateway implements OnGatewayDisconnect {
    private matchService;
    server: Server;
    constructor(matchService: MatchService);
    handleRoomJoin(data: {
        roomCode: string;
        playerName: string;
        userId?: string;
    }, client: Socket): Promise<void>;
    handleAssignTeam(data: {
        roomCode: string;
        playerId: string;
        team: 'A' | 'B';
    }): Promise<void>;
    handleStartMatch(data: {
        roomCode: string;
    }): Promise<void>;
    handleAnswerSubmit(data: {
        matchId: string;
        questionId: string;
        selectedOption: number;
    }, client: Socket): Promise<void>;
    private revealAndAdvance;
    handleDisconnect(client: Socket): void;
}
