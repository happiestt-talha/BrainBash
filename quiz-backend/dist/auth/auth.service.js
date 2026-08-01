"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_entity_1 = require("../users/entities/user.entity");
const guest_session_entity_1 = require("./entities/guest-session.entity");
let AuthService = class AuthService {
    usersRepo;
    guestRepo;
    jwtService;
    constructor(usersRepo, guestRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.guestRepo = guestRepo;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.usersRepo.save(this.usersRepo.create({ email: dto.email, passwordHash, displayName: dto.displayName }));
        return this.issueToken(user);
    }
    async login(dto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (!user || !user.passwordHash)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueToken(user);
    }
    async validateOrCreateGoogleUser(googleUser) {
        let user = await this.usersRepo.findOne({ where: { email: googleUser.email } });
        if (!user) {
            user = await this.usersRepo.save(this.usersRepo.create({
                email: googleUser.email,
                displayName: googleUser.displayName,
                avatarUrl: googleUser.avatarUrl,
                passwordHash: '',
            }));
        }
        return this.issueToken(user);
    }
    async createGuestSession(displayName) {
        const sessionToken = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12);
        const guest = await this.guestRepo.save(this.guestRepo.create({ tempName: displayName, sessionToken, expiresAt }));
        return { guestSessionId: guest.id, sessionToken, displayName };
    }
    async findUserById(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { id: user.id, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl };
    }
    issueToken(user) {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(guest_session_entity_1.GuestSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map