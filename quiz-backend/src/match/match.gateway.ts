import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchEvents } from './events/match-events.enum';
import { MatchService } from './match.service';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
})
export class MatchGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private matchService: MatchService) {}

  // Gateway stays thin on purpose — every method just delegates to
  // MatchService, which owns the actual state machine.

  @SubscribeMessage(MatchEvents.ROOM_JOIN)
  async handleRoomJoin(
    @MessageBody() data: { roomCode: string; playerName: string; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.matchService.joinRoom(data, client.id);
    client.join(data.roomCode);
    this.server.to(data.roomCode).emit(MatchEvents.ROOM_PLAYER_JOINED, result);
  }

  @SubscribeMessage(MatchEvents.ROOM_START_MATCH)
  async handleStartMatch(@MessageBody() data: { roomCode: string }) {
    const matchStartedPayload = await this.matchService.startMatch(data.roomCode);
    this.server.to(data.roomCode).emit(MatchEvents.MATCH_STARTED, matchStartedPayload);

    const firstQuestion = await this.matchService.pushNextQuestion(matchStartedPayload.matchId);
    this.server.to(data.roomCode).emit(MatchEvents.QUESTION_PUSH, firstQuestion);
  }

  @SubscribeMessage(MatchEvents.ANSWER_SUBMIT)
  async handleAnswerSubmit(
    @MessageBody() data: { matchId: string; questionId: string; selectedOption: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomCode, playerId } = await this.matchService.recordAnswer(data, client.id);

    client.emit(MatchEvents.ANSWER_ACK, { questionId: data.questionId, received: true });
    this.server.to(roomCode).emit(MatchEvents.QUESTION_PLAYER_ANSWERED, { playerId });

    // if everyone in the match has answered, reveal immediately rather than waiting for timeout
    const allAnswered = await this.matchService.haveAllPlayersAnswered(data.matchId, data.questionId);
    if (allAnswered) {
      await this.revealAndAdvance(data.matchId, roomCode);
    }
  }

  private async revealAndAdvance(matchId: string, roomCode: string) {
    const reveal = await this.matchService.revealAnswers(matchId);
    this.server.to(roomCode).emit(MatchEvents.QUESTION_REVEAL, reveal);
    this.server.to(roomCode).emit(MatchEvents.SCOREBOARD_UPDATE, reveal.scores);

    const next = await this.matchService.pushNextQuestion(matchId);
    if (next.matchEnded) {
      this.server.to(roomCode).emit(MatchEvents.MATCH_ENDED, next.finalResults);
    } else {
      this.server.to(roomCode).emit(MatchEvents.MATCH_NEXT_QUESTION, { index: next.index });
      this.server.to(roomCode).emit(MatchEvents.QUESTION_PUSH, next);
    }
  }

  handleDisconnect(client: Socket) {
    this.matchService.handleDisconnect(client.id);
    // TODO: emit PLAYER_DISCONNECTED to the room once matchService can map
    // socket.id -> roomCode/playerId (needs a small in-memory or Redis map)
  }
}