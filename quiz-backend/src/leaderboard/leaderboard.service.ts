import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';
import { MatchParticipant } from '../match/entities/match-participant.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(LeaderboardEntry) private entryRepo: Repository<LeaderboardEntry>,
    @InjectRepository(MatchParticipant) private participantRepo: Repository<MatchParticipant>,
  ) {}

  // called once when a match ends (hook this into MatchService.buildFinalResults)
  async recordMatchResults(matchId: string) {
    const participants = await this.participantRepo.find({
      where: { matchId },
      order: { totalScore: 'DESC' },
    });

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < participants.length; i++) {
      const entry = await this.entryRepo.save(
        this.entryRepo.create({
          matchId,
          matchParticipantId: participants[i].id,
          finalRank: i + 1,
          finalScore: participants[i].totalScore,
        }),
      );
      entries.push(entry);
    }
    return entries;
  }

  async getMatchLeaderboard(matchId: string) {
    const entries = await this.entryRepo.find({
      where: { matchId },
      order: { finalRank: 'ASC' },
    });

    // join in participant display names for the results screen
    const withNames: any[] = [];
    for (const entry of entries) {
      const participant = await this.participantRepo.findOne({ where: { id: entry.matchParticipantId } });
      withNames.push({
        rank: entry.finalRank,
        score: entry.finalScore,
        displayName: participant?.displayName,
        team: participant?.team,
      });
    }
    return withNames;
  }

  // stub for later — becomes real once `friendships` table is queried
  async getFriendGroupLeaderboard(userId: string) {
    // TODO: join leaderboard_entries -> match_participants -> users,
    // filtered to friendships where status = 'accepted', aggregated by user,
    // probably summed or averaged score across matches, your call
    throw new Error('Not implemented — build after friends module');
  }

  // stub for later — global all-time ranking
  async getGlobalLeaderboard() {
    // TODO: similar aggregation, no friendship filter
    throw new Error('Not implemented');
  }
}