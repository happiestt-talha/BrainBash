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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_state_store_1 = require("./match-state.store");
const scoring_service_1 = require("../scoring/scoring.service");
const match_entity_1 = require("./entities/match.entity");
const match_participant_entity_1 = require("./entities/match-participant.entity");
const match_question_entity_1 = require("./entities/match-question.entity");
const match_answer_entity_1 = require("./entities/match-answer.entity");
const room_entity_1 = require("../rooms/entities/room.entity");
const question_entity_1 = require("../questions/entities/question.entity");
const DEFAULT_TIME_LIMIT_MS = 15000;
const QUESTIONS_PER_MATCH = 10;
let MatchService = class MatchService {
    stateStore;
    scoringService;
    matchRepo;
    participantRepo;
    matchQuestionRepo;
    matchAnswerRepo;
    roomRepo;
    questionRepo;
    constructor(stateStore, scoringService, matchRepo, participantRepo, matchQuestionRepo, matchAnswerRepo, roomRepo, questionRepo) {
        this.stateStore = stateStore;
        this.scoringService = scoringService;
        this.matchRepo = matchRepo;
        this.participantRepo = participantRepo;
        this.matchQuestionRepo = matchQuestionRepo;
        this.matchAnswerRepo = matchAnswerRepo;
        this.roomRepo = roomRepo;
        this.questionRepo = questionRepo;
    }
    async joinRoom(data, socketId) {
        const room = await this.roomRepo.findOne({ where: { code: data.roomCode.toUpperCase() } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const lobbyKey = `room:${data.roomCode}:lobby`;
        const existing = (await this.stateStore['redis'].getJson(lobbyKey)) ?? [];
        const newPlayer = {
            socketId,
            playerName: data.playerName,
            userId: data.userId ?? null,
            team: null,
        };
        existing.push(newPlayer);
        await this.stateStore['redis'].setJson(lobbyKey, existing, 60 * 60 * 2);
        return { players: existing };
    }
    async startMatch(roomCode) {
        const room = await this.roomRepo.findOne({ where: { code: roomCode.toUpperCase() } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const lobbyKey = `room:${roomCode}:lobby`;
        const lobbyPlayers = (await this.stateStore['redis'].getJson(lobbyKey)) ?? [];
        const match = await this.matchRepo.save(this.matchRepo.create({
            roomId: room.id,
            totalQuestions: QUESTIONS_PER_MATCH,
            status: 'active',
        }));
        const questionPool = await this.questionRepo.find({
            where: { categoryId: room.categoryId, validated: true },
            take: 50,
        });
        const shuffled = questionPool.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_MATCH);
        const matchQuestions = [];
        for (let i = 0; i < shuffled.length; i++) {
            const mq = await this.matchQuestionRepo.save(this.matchQuestionRepo.create({
                matchId: match.id,
                questionId: shuffled[i].id,
                questionIndex: i,
                pushedAt: null,
                timeLimitMs: DEFAULT_TIME_LIMIT_MS,
            }));
            matchQuestions.push(mq);
        }
        const participants = [];
        for (const p of lobbyPlayers) {
            const participant = await this.participantRepo.save(this.participantRepo.create({
                matchId: match.id,
                userId: p.userId,
                displayName: p.playerName,
                team: p.team,
                socketId: p.socketId,
            }));
            participants.push({
                playerId: participant.id,
                displayName: participant.displayName,
                team: participant.team,
                totalScore: 0,
                currentStreak: 0,
                connectionStatus: 'connected',
            });
        }
        const state = {
            matchId: match.id,
            roomId: room.id,
            status: 'active',
            totalQuestions: matchQuestions.length,
            currentQuestion: null,
            participants,
        };
        await this.stateStore.set(match.id, state);
        await this.stateStore['redis'].setJson(`match:${match.id}:questions`, matchQuestions, 60 * 60 * 6);
        return { matchId: match.id, totalQuestions: matchQuestions.length, category: room.categoryId };
    }
    async pushNextQuestion(matchId) {
        const state = await this.stateStore.get(matchId);
        if (!state)
            throw new common_1.NotFoundException('Match state not found');
        const matchQuestions = await this.stateStore['redis'].getJson(`match:${matchId}:questions`);
        if (!matchQuestions)
            throw new common_1.NotFoundException('Match questions not found');
        const nextIndex = state.currentQuestion ? state.currentQuestion.index + 1 : 0;
        if (nextIndex >= matchQuestions.length) {
            return { matchEnded: true, finalResults: await this.buildFinalResults(matchId) };
        }
        const mq = matchQuestions[nextIndex];
        const question = await this.questionRepo.findOne({ where: { id: mq.questionId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const pushedAt = Date.now();
        await this.matchQuestionRepo.update(mq.id, { pushedAt });
        state.currentQuestion = {
            questionId: question.id,
            index: nextIndex,
            text: question.text,
            options: question.options,
            timeLimitMs: mq.timeLimitMs,
            pushedAt,
            answeredPlayerIds: [],
        };
        await this.stateStore.set(matchId, state);
        return {
            matchEnded: false,
            questionId: question.id,
            index: nextIndex,
            text: question.text,
            options: question.options,
            timeLimitMs: mq.timeLimitMs,
            serverTimestamp: pushedAt,
        };
    }
    async recordAnswer(data, socketId) {
        const state = await this.stateStore.get(data.matchId);
        if (!state || !state.currentQuestion)
            throw new common_1.NotFoundException('No active question');
        const participant = await this.participantRepo.findOne({ where: { socketId } });
        if (!participant)
            throw new common_1.NotFoundException('Participant not found');
        if (state.currentQuestion.answeredPlayerIds.includes(participant.id)) {
            const room = await this.matchRepo.findOne({ where: { id: data.matchId } });
            return { roomCode: (await this.roomRepo.findOne({ where: { id: room?.roomId } }))?.code ?? '', playerId: participant.id };
        }
        const question = await this.questionRepo.findOne({ where: { id: data.questionId } });
        const isCorrect = question?.correctOptionIndex === data.selectedOption;
        const now = Date.now();
        const elapsedMs = Math.min(now - state.currentQuestion.pushedAt, state.currentQuestion.timeLimitMs);
        const scoreResult = this.scoringService.calculateScore({
            isCorrect,
            elapsedMs,
            timeLimitMs: state.currentQuestion.timeLimitMs,
            currentStreakBefore: participant.currentStreak,
        });
        const matchQuestions = await this.stateStore['redis'].getJson(`match:${data.matchId}:questions`);
        const currentMq = matchQuestions?.find((mq) => mq.questionId === data.questionId);
        await this.matchAnswerRepo.save(this.matchAnswerRepo.create({
            matchParticipantId: participant.id,
            matchQuestionId: currentMq?.id ?? '',
            selectedOptionIndex: data.selectedOption,
            isCorrect,
            elapsedMs,
            pointsEarned: scoreResult.pointsEarned,
            streakAtTime: scoreResult.newStreak,
        }));
        participant.totalScore += scoreResult.pointsEarned;
        participant.currentStreak = scoreResult.newStreak;
        participant.bestStreak = Math.max(participant.bestStreak, scoreResult.newStreak);
        await this.participantRepo.save(participant);
        state.currentQuestion.answeredPlayerIds.push(participant.id);
        const stateParticipant = state.participants.find((p) => p.playerId === participant.id);
        if (stateParticipant) {
            stateParticipant.totalScore = participant.totalScore;
            stateParticipant.currentStreak = participant.currentStreak;
        }
        await this.stateStore.set(data.matchId, state);
        const room = await this.roomRepo.findOne({ where: { id: state.roomId } });
        return { roomCode: room?.code ?? '', playerId: participant.id };
    }
    async haveAllPlayersAnswered(matchId, questionId) {
        const state = await this.stateStore.get(matchId);
        if (!state || !state.currentQuestion)
            return false;
        return state.currentQuestion.answeredPlayerIds.length >= state.participants.length;
    }
    async revealAnswers(matchId) {
        const state = await this.stateStore.get(matchId);
        if (!state || !state.currentQuestion)
            throw new common_1.NotFoundException('No active question');
        const question = await this.questionRepo.findOne({ where: { id: state.currentQuestion.questionId } });
        const matchQuestions = await this.stateStore['redis'].getJson(`match:${matchId}:questions`);
        const currentMq = matchQuestions?.find((mq) => mq.questionId === state.currentQuestion.questionId);
        const answers = await this.matchAnswerRepo.find({
            where: { matchQuestionId: currentMq?.id },
        });
        const results = answers.map((a) => ({
            playerId: a.matchParticipantId,
            selectedOption: a.selectedOptionIndex,
            correct: a.isCorrect,
            pointsEarned: a.pointsEarned,
            streakCount: a.streakAtTime,
        }));
        const scores = state.participants.map((p) => ({
            playerId: p.playerId,
            totalScore: p.totalScore,
            team: p.team,
        }));
        return {
            questionId: question?.id,
            correctOption: question?.correctOptionIndex,
            results,
            scores,
        };
    }
    async buildFinalResults(matchId) {
        const state = await this.stateStore.get(matchId);
        if (!state)
            return null;
        const sorted = [...state.participants].sort((a, b) => b.totalScore - a.totalScore);
        await this.matchRepo.update(matchId, { status: 'completed', endedAt: new Date() });
        return {
            finalScores: sorted,
            winnerId: sorted[0]?.playerId ?? null,
        };
    }
    async handleDisconnect(socketId) {
        const participant = await this.participantRepo.findOne({ where: { socketId } });
        if (!participant)
            return;
        participant.connectionStatus = 'disconnected';
        await this.participantRepo.save(participant);
        const state = await this.stateStore.get(participant.matchId);
        if (state) {
            const stateParticipant = state.participants.find((p) => p.playerId === participant.id);
            if (stateParticipant)
                stateParticipant.connectionStatus = 'disconnected';
            await this.stateStore.set(participant.matchId, state);
        }
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(3, (0, typeorm_1.InjectRepository)(match_participant_entity_1.MatchParticipant)),
    __param(4, (0, typeorm_1.InjectRepository)(match_question_entity_1.MatchQuestion)),
    __param(5, (0, typeorm_1.InjectRepository)(match_answer_entity_1.MatchAnswer)),
    __param(6, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(7, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [match_state_store_1.MatchStateStore,
        scoring_service_1.ScoringService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MatchService);
//# sourceMappingURL=match.service.js.map