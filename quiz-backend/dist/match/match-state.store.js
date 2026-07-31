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
exports.MatchStateStore = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
let MatchStateStore = class MatchStateStore {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    key(matchId) {
        return `match:${matchId}:state`;
    }
    async get(matchId) {
        return this.redis.getJson(this.key(matchId));
    }
    async set(matchId, state) {
        await this.redis.setJson(this.key(matchId), state, 60 * 60 * 6);
    }
    async delete(matchId) {
        await this.redis.delete(this.key(matchId));
    }
};
exports.MatchStateStore = MatchStateStore;
exports.MatchStateStore = MatchStateStore = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], MatchStateStore);
//# sourceMappingURL=match-state.store.js.map