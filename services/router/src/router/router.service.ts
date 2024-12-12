import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RouterService {

  constructor(
    @Inject('ROUTER_CHECKER_SERVICE') private readonly authClient: ClientProxy
  ) {
  }

  async checkAccess(token: string, resourceId: string): Promise<boolean> {

    try {

      // Распарсить JWT и получить userId
      const decoded = this.parseToken(token);
      const userId = decoded.userId;

      console.log(`Checking access uid: ${userId} resourceId: ${resourceId} token: ${token}`)
      // Отправить запрос к Auth сервису для проверки доступа
      const isAllowed = await firstValueFrom(
        this.authClient.send(
          { cmd: 'check_access' },
          { userId, resourceId },
        )
      );
      console.log(`is allowed ${isAllowed}`)

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
    const url = "localhost:8080"
    return url || null;
  }

  async addRoute(resourceId: string, internalUrl: string): Promise<void> {
    // await this.redisClient.set(`resource:${resourceId}:url`, internalUrl);
    console.log(`add route ${resourceId} ${internalUrl}`)
  }

  async removeRoute(resourceId: string): Promise<void> {
    console.log(`remove route ${resourceId}`)
    // await this.redisClient.del(`resource:${resourceId}:url`);
  }
}
