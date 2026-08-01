import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';
import { MatchParticipant } from '../match/entities/match-participant.entity';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaderboardEntry, MatchParticipant])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}