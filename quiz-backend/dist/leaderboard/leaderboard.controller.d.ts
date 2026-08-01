import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getMatchLeaderboard(matchId: string): Promise<any[]>;
}
