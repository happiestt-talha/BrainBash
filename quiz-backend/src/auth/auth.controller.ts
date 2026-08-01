import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GuestJoinDto } from './dto/guest-join.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('guest')
  createGuest(@Body() dto: GuestJoinDto) {
    return this.authService.createGuestSession(dto.displayName);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // redirect handled by GoogleAuthGuard, nothing needed here
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.validateOrCreateGoogleUser(req.user);
    // redirect back to frontend with token as query param, frontend grabs it and stores it
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    return this.authService.findUserById(req.user.userId);
  }
}