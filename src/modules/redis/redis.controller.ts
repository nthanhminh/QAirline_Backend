import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CacheService } from './redis.service';
import { ApiTags } from '@nestjs/swagger';
import { CacheDto } from './dto/cache.dto';
import { AppResponse } from 'src/types/common.type';

@Controller('cache')
@ApiTags('Cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('set')
  async setCache(
    @Body() body: CacheDto,
  ): Promise<AppResponse<any>> {
    const { key, value, ttl } = body;
    await this.cacheService.setCache(key, value, ttl);
    return {
        data: 1,
    }
  }

  @Get('get/:key')
  async getCache(@Param('key') key: string): Promise<AppResponse<any>> {
    return {
        data: await this.cacheService.getCache(key),
    }
  }

  @Get('test')
  async getAllkey() {
    return {
        data: await this.cacheService.getAllSeatInRedis(),
    }
  }
}
