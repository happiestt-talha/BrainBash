import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { GuestSession } from './entities/guest-session.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(GuestSession) private guestRepo: Repository<GuestSession>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.save(
      this.usersRepo.create({ email: dto.email, passwordHash, displayName: dto.displayName }),
    );

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueToken(user);
  }

  async validateOrCreateGoogleUser(googleUser: { email: string; displayName: string; avatarUrl: string }) {
    let user = await this.usersRepo.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await this.usersRepo.save(
        this.usersRepo.create({
          email: googleUser.email,
          displayName: googleUser.displayName,
          avatarUrl: googleUser.avatarUrl,
          passwordHash: '', // Google-only account, no password login
        }),
      );
    }
    return this.issueToken(user!);
  }

  async createGuestSession(displayName: string) {
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12hr guest session

    const guest = await this.guestRepo.save(
      this.guestRepo.create({ tempName: displayName, sessionToken, expiresAt }),
    );

    return { guestSessionId: guest.id, sessionToken, displayName };
  }

  async findUserById(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl };
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl },
    };
  }
}