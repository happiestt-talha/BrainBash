"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const match_events_enum_1 = require("./events/match-events.enum");
const match_service_1 = require("./match.service");
let MatchGateway = class MatchGateway {
    matchService;
    server;
    constructor(matchService) {
        this.matchService = matchService;
    }
    async handleRoomJoin(data, client) {
        const result = await this.matchService.joinRoom(data, client.id);
        client.join(data.roomCode);
        this.server.to(data.roomCode).emit(match_events_enum_1.MatchEvents.ROOM_PLAYER_JOINED, result);
    }
    async handleStartMatch(data) {
        const matchStartedPayload = await this.matchService.startMatch(data.roomCode);
        this.server.to(data.roomCode).emit(match_events_enum_1.MatchEvents.MATCH_STARTED, matchStartedPayload);
        const firstQuestion = await this.matchService.pushNextQuestion(matchStartedPayload.matchId);
        this.server.to(data.roomCode).emit(match_events_enum_1.MatchEvents.QUESTION_PUSH, firstQuestion);
    }
    async handleAnswerSubmit(data, client) {
        const { roomCode, playerId } = await this.matchService.recordAnswer(data, client.id);
        client.emit(match_events_enum_1.MatchEvents.ANSWER_ACK, { questionId: data.questionId, received: true });
        this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.QUESTION_PLAYER_ANSWERED, { playerId });
        const allAnswered = await this.matchService.haveAllPlayersAnswered(data.matchId, data.questionId);
        if (allAnswered) {
            await this.revealAndAdvance(data.matchId, roomCode);
        }
    }
    async revealAndAdvance(matchId, roomCode) {
        const reveal = await this.matchService.revealAnswers(matchId);
        this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.QUESTION_REVEAL, reveal);
        this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.SCOREBOARD_UPDATE, reveal.scores);
        const next = await this.matchService.pushNextQuestion(matchId);
        if (next.matchEnded) {
            this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.MATCH_ENDED, next.finalResults);
        }
        else {
            this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.MATCH_NEXT_QUESTION, { index: next.index });
            this.server.to(roomCode).emit(match_events_enum_1.MatchEvents.QUESTION_PUSH, next);
        }
    }
    handleDisconnect(client) {
        this.matchService.handleDisconnect(client.id);
    }
};
exports.MatchGateway = MatchGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MatchGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(match_events_enum_1.MatchEvents.ROOM_JOIN),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MatchGateway.prototype, "handleRoomJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(match_events_enum_1.MatchEvents.ROOM_START_MATCH),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchGateway.prototype, "handleStartMatch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(match_events_enum_1.MatchEvents.ANSWER_SUBMIT),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MatchGateway.prototype, "handleAnswerSubmit", null);
exports.MatchGateway = MatchGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.FRONTEND_URL, credentials: true },
    }),
    __metadata("design:paramtypes", [match_service_1.MatchService])
], MatchGateway);
//# sourceMappingURL=match.gateway.js.map