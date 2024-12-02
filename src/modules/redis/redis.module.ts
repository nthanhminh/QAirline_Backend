import { Module } from '@nestjs/common';
import { createClient } from 'redis'; 
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { CacheService } from './redis.service';
import { CacheController } from './redis.controller';

@Module({
  imports: [ConfigModule], 
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL'); 
        const client = createClient({ url: redisUrl });
        await client.connect();
        return client;
      },
      inject: [ConfigService], 
    },
    CacheService
  ],
  controllers: [],
  exports: ['REDIS_CLIENT', CacheService],
})
export class RedisCacheModule {}
