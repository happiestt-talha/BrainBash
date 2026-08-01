import { Repository } from 'typeorm';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';
import { MatchParticipant } from '../match/entities/match-participant.entity';
export declare class LeaderboardService {
    private entryRepo;
    private participantRepo;
    constructor(entryRepo: Repository<LeaderboardEntry>, participantRepo: Repository<MatchParticipant>);
    recordMatchResults(matchId: string): Promise<LeaderboardEntry[]>;
    getMatchLeaderboard(matchId: string): Promise<any[]>;
    getFriendGroupLeaderboard(userId: string): Promise<void>;
    getGlobalLeaderboard(): Promise<void>;
}
