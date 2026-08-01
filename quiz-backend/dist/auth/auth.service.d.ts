import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { GuestSession } from './entities/guest-session.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepo;
    private guestRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, guestRepo: Repository<GuestSession>, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
        };
    }>;
    validateOrCreateGoogleUser(googleUser: {
        email: string;
        displayName: string;
        avatarUrl: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
        };
    }>;
    createGuestSession(displayName: string): Promise<{
        guestSessionId: string;
        sessionToken: string;
        displayName: string;
    }>;
    findUserById(userId: string): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string;
    }>;
    private issueToken;
}
