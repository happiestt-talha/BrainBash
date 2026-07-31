import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MatchModule } from './match/match.module';
import { TeamsModule } from './teams/teams.module';
import { ScoringModule } from './scoring/scoring.module';
import { QuestionsModule } from './questions/questions.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // dev only — switch to migrations before this ever touches real user data
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    MatchModule,
    TeamsModule,
    ScoringModule,
    QuestionsModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}