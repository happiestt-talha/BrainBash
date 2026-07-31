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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    client;
    publisher;
    subscriber;
    constructor() {
        const config = {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        };
        this.client = new ioredis_1.default(config);
        this.publisher = new ioredis_1.default(config);
        this.subscriber = new ioredis_1.default(config);
    }
    async setJson(key, value, ttlSeconds) {
        const payload = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.set(key, payload, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, payload);
        }
    }
    async getJson(key) {
        const raw = await this.client.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    async delete(key) {
        await this.client.del(key);
    }
    onModuleDestroy() {
        this.client.disconnect();
        this.publisher.disconnect();
        this.subscriber.disconnect();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map