import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('match/:matchId')
  getMatchLeaderboard(@Param('matchId') matchId: string) {
    return this.leaderboardService.getMatchLeaderboard(matchId);
  }
}