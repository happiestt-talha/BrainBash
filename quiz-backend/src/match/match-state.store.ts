import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { MatchState } from './interfaces/match-state.interface';

@Injectable()
export class MatchStateStore {
  constructor(private redis: RedisService) {}

  private key(matchId: string): string {
    return `match:${matchId}:state`;
  }

  async get(matchId: string): Promise<MatchState | null> {
    return this.redis.getJson<MatchState>(this.key(matchId));
  }

  async set(matchId: string, state: MatchState): Promise<void> {
    // TTL as a safety net — a truly stuck/abandoned match shouldn't live in Redis forever
    await this.redis.setJson(this.key(matchId), state, 60 * 60 * 6);
  }

  async delete(matchId: string): Promise<void> {
    await this.redis.delete(this.key(matchId));
  }
}