import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RouterService {

  private resourceMap: Map<string,  string>;

  constructor(
    @Inject('ROUTER_CHECKER_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.resourceMap = new Map();
  }

  async checkAccess(userId, resourceId: string): Promise<boolean> {

    try {
      // Отправить запрос к Auth сервису для проверки доступа
      const isAllowed = await firstValueFrom(
        this.authClient.send(
          { cmd: 'check_access' },
          { userId, resourceId },
        )
      );
      console.log(`userId: ${userId} resourceId: ${resourceId}`)
      console.log(`is allowed ${isAllowed}`)

      return isAllowed;
    } catch (error) {
      return false;
    }
  }

  async getInternalUrl(resourceId: string): Promise<string | null> {
    if(!this.resourceMap.has(resourceId)) {
      return null;
    }
    return this.resourceMap.get(resourceId);
  }

  async addRoute(resourceId: string, internalUrl: string): Promise<void> {
    this.resourceMap.set(resourceId, internalUrl);
  }

  async removeRoute(resourceId: string): Promise<void> {
    this.resourceMap.delete(resourceId);
  }
}
