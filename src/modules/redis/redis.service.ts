import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache';
import CacheUtil from '../../utils/cache.util';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getData(key: string): Promise<any> {
    let data: any = await this.cache.get(CacheUtil.getCacheKey(key));
    if (data) {
      data = JSON.parse(data);
    }
    return data;
  }

  async saveData(
    key: string,
    value:
      | Record<string, unknown>
      | Record<string, unknown>[]
      | string
      | number
      | any,
    ttl?: number,
  ): Promise<any> {
    ttl = ttl || Number(process.env.CACHE_TTL);
    const data = JSON.stringify(value);
    await this.cache.set(CacheUtil.getCacheKey(key), data, ttl);
  }

  async deleteData(key: string): Promise<any> {
    console.info('deleting key for: %s ', CacheUtil.getCacheKey(key));
    await this.cache.del(CacheUtil.getCacheKey(key));
  }

  async deleteMany(keys: string[]): Promise<void> {
    keys.forEach((key) => {
      this.deleteData(key);
    });
  }
}
