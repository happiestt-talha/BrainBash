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
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leaderboard_entry_entity_1 = require("./entities/leaderboard-entry.entity");
const match_participant_entity_1 = require("../match/entities/match-participant.entity");
let LeaderboardService = class LeaderboardService {
    entryRepo;
    participantRepo;
    constructor(entryRepo, participantRepo) {
        this.entryRepo = entryRepo;
        this.participantRepo = participantRepo;
    }
    async recordMatchResults(matchId) {
        const participants = await this.participantRepo.find({
            where: { matchId },
            order: { totalScore: 'DESC' },
        });
        const entries = [];
        for (let i = 0; i < participants.length; i++) {
            const entry = await this.entryRepo.save(this.entryRepo.create({
                matchId,
                matchParticipantId: participants[i].id,
                finalRank: i + 1,
                finalScore: participants[i].totalScore,
            }));
            entries.push(entry);
        }
        return entries;
    }
    async getMatchLeaderboard(matchId) {
        const entries = await this.entryRepo.find({
            where: { matchId },
            order: { finalRank: 'ASC' },
        });
        const withNames = [];
        for (const entry of entries) {
            const participant = await this.participantRepo.findOne({ where: { id: entry.matchParticipantId } });
            withNames.push({
                rank: entry.finalRank,
                score: entry.finalScore,
                displayName: participant?.displayName,
                team: participant?.team,
            });
        }
        return withNames;
    }
    async getFriendGroupLeaderboard(userId) {
        throw new Error('Not implemented — build after friends module');
    }
    async getGlobalLeaderboard() {
        throw new Error('Not implemented');
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leaderboard_entry_entity_1.LeaderboardEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(match_participant_entity_1.MatchParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map