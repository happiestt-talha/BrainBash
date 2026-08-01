import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GuestJoinDto } from './dto/guest-join.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    createGuest(dto: GuestJoinDto): Promise<{
        guestSessionId: string;
        sessionToken: string;
        displayName: string;
    }>;
    googleAuth(): void;
    googleCallback(req: any, res: Response): Promise<void>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string;
    }>;
}
