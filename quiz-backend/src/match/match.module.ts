import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchGateway } from './match.gateway';
import { MatchService } from './match.service';
import { MatchStateStore } from './match-state.store';
import { ScoringModule } from '../scoring/scoring.module';
import { Match } from './entities/match.entity';
import { MatchParticipant } from './entities/match-participant.entity';
import { MatchQuestion } from './entities/match-question.entity';
import { MatchAnswer } from './entities/match-answer.entity';
import { Room } from '../rooms/entities/room.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchParticipant, MatchQuestion, MatchAnswer, Room, Question]),
    ScoringModule,
  ],
  providers: [MatchGateway, MatchService, MatchStateStore],
})
export class MatchModule {}