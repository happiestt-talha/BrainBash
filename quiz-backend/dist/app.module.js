"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const redis_module_1 = require("./redis/redis.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const rooms_module_1 = require("./rooms/rooms.module");
const match_module_1 = require("./match/match.module");
const teams_module_1 = require("./teams/teams.module");
const scoring_module_1 = require("./scoring/scoring.module");
const questions_module_1 = require("./questions/questions.module");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: true,
            }),
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
            match_module_1.MatchModule,
            teams_module_1.TeamsModule,
            scoring_module_1.ScoringModule,
            questions_module_1.QuestionsModule,
            leaderboard_module_1.LeaderboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map