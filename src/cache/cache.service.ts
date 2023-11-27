import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { userDataInCache } from '../users/types';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async setUserInCache(
    key: string,
    userData: userDataInCache,
    ttl: number,
  ): Promise<void> {
    const client = this.redisService.getClient();
    const serializedData = JSON.stringify(userData);

    await client.set(key, serializedData, 'EX', ttl);
  }

  async getUserFromCache(userId: number): Promise<userDataInCache | null> {
    const client = this.redisService.getClient();
    const userData = await client.get(`user:${userId}`);

    return userData ? JSON.parse(userData) : null;
  }
}
