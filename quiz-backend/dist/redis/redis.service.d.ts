import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    readonly client: Redis;
    readonly publisher: Redis;
    readonly subscriber: Redis;
    constructor();
    setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    getJson<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<void>;
    onModuleDestroy(): void;
}
