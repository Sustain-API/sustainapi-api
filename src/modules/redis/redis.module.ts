import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import CacheUtil from '../../utils/cache.util';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        url: process.env.REDIS_URL,
        ttl: Number(process.env.CACHE_TTL) || CacheUtil.THIRTY_MINUTES,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
