import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RouteCheckerService {

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
  }

  async checkUserAccess(userId: string, resourceId: string): Promise<boolean> {
    // Логика проверки доступа
    // Например, проверим, что userId имеет доступ к resourceId
    console.log(userId, resourceId)
    const resources = await firstValueFrom(
      this.authClient.send(
        { cmd: 'get_user_resources' },
        { userId },
      )
    )

    return resources.includes(resourceId);
  }
}
