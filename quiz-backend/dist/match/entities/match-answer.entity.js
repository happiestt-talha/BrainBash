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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchAnswer = void 0;
const typeorm_1 = require("typeorm");
let MatchAnswer = class MatchAnswer {
    id;
    matchParticipantId;
    matchQuestionId;
    selectedOptionIndex;
    isCorrect;
    answeredAt;
    elapsedMs;
    pointsEarned;
    streakAtTime;
};
exports.MatchAnswer = MatchAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MatchAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MatchAnswer.prototype, "matchParticipantId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MatchAnswer.prototype, "matchQuestionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MatchAnswer.prototype, "selectedOptionIndex", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], MatchAnswer.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MatchAnswer.prototype, "answeredAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchAnswer.prototype, "elapsedMs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchAnswer.prototype, "pointsEarned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchAnswer.prototype, "streakAtTime", void 0);
exports.MatchAnswer = MatchAnswer = __decorate([
    (0, typeorm_1.Entity)('match_answers')
], MatchAnswer);
//# sourceMappingURL=match-answer.entity.js.map