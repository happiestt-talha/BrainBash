"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
let ScoringService = class ScoringService {
    BASE_POINTS = 1000;
    TIMEOUT_PENALTY = -200;
    calculateScore(params) {
        if (!params.isCorrect) {
            return { pointsEarned: 0, newStreak: 0, streakBonus: 0 };
        }
        const clampedElapsed = Math.min(params.elapsedMs, params.timeLimitMs);
        const speedFactor = 1 - clampedElapsed / params.timeLimitMs / 2;
        const speedPoints = Math.round(this.BASE_POINTS * speedFactor);
        const newStreak = params.currentStreakBefore + 1;
        let streakBonus = 0;
        if (newStreak >= 5)
            streakBonus = 200;
        else if (newStreak >= 3)
            streakBonus = 100;
        else if (newStreak >= 2)
            streakBonus = 50;
        return { pointsEarned: speedPoints + streakBonus, newStreak, streakBonus };
    }
    calculateTimeoutPenalty() {
        return {
            pointsEarned: this.TIMEOUT_PENALTY,
            newStreak: 0,
            streakBonus: 0,
        };
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)()
], ScoringService);
//# sourceMappingURL=scoring.service.js.map