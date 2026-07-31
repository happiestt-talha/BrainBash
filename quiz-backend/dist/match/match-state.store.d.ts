import { RedisService } from '../redis/redis.service';
import { MatchState } from './interfaces/match-state.interface';
export declare class MatchStateStore {
    private redis;
    constructor(redis: RedisService);
    private key;
    get(matchId: string): Promise<MatchState | null>;
    set(matchId: string, state: MatchState): Promise<void>;
    delete(matchId: string): Promise<void>;
}
