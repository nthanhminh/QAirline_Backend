import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis'; // Import Redis client type
import { SeatInRedis } from './type/index.type';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  // Set a cache with a TTL (time to live)
  async setCache(key: string, value: any, ttl: number = 60): Promise<void> {
    await this.redisClient.setEx(key, ttl, JSON.stringify(value));  // Set key with value and TTL
  }

  // Get a cache value by key
  async getCache(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;  // Parse JSON value before returning
  }

  // Delete a cache entry by key
  async deleteCache(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // Check if a key exists in the cache
  async hasCache(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists > 0;
  }

  async getAllKey() {
    const keys = await this.redisClient.keys('seat*');
    console.log(keys);
  }

  async getAllSeatInRedis() : Promise<Map<string, string>> {
    const keys = await this.redisClient.keys('seat*');
    const res = new Map<string, string>();
    for(const key of keys) {
        const value = await this.redisClient.get(key);
        res.set(key, JSON.parse(value));
    }
    console.log(keys, res);
    return res;
  }
}
