import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RouteCheckerService {
  private redisClient: Redis;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async checkUserAccess(userId: string, resourceId: string): Promise<boolean> {
    // Логика проверки доступа
    // Например, проверим, что userId имеет доступ к resourceId
    const resources = await this.authClient.send(
      { cmd: 'get_user_resources' },
      { userId },
    ).toPromise();

    return resources.includes(resourceId);
  }
}
