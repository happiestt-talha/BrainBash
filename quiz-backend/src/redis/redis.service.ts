import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;
  public readonly publisher: Redis;
  public readonly subscriber: Redis;

  constructor() {
    const config = {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    };
    this.client = new Redis(config);
    this.publisher = new Redis(config);
    this.subscriber = new Redis(config);
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.publisher.disconnect();
    this.subscriber.disconnect();
  }
}