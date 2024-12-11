import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import axios from 'axios';

@Injectable()
export class RouterService {
  private redisClient: Redis;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async checkAccess(token: string, resourceId: string): Promise<boolean> {
    try {
      // Распарсить JWT и получить userId
      const decoded = this.parseToken(token);
      const userId = decoded.sub;

      // Отправить запрос к Auth сервису для проверки доступа
      const isAllowed = await this.authClient.send(
        { cmd: 'check_access' },
        { userId, resourceId },
      ).toPromise();

      return isAllowed;
    } catch (error) {
      return false;
    }
  }

  parseToken(token: string): any {
    // Реализуйте разбор JWT и извлечение payload
    // Например, используя библиотеку jsonwebtoken
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretKey');
    return decoded;
  }

  async getInternalUrl(resourceId: string): Promise<string | null> {
    const url = await this.redisClient.get(`resource:${resourceId}:url`);
    return url || null;
  }

  async addRoute(resourceId: string, internalUrl: string): Promise<void> {
    await this.redisClient.set(`resource:${resourceId}:url`, internalUrl);
  }

  async removeRoute(resourceId: string): Promise<void> {
    await this.redisClient.del(`resource:${resourceId}:url`);
  }
}
