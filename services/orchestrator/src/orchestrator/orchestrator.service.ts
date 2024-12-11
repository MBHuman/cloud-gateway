import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrchestratorService {
    private redisClient: Redis;

    constructor(
        private readonly httpService: HttpService,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        @Inject('ROUTER_SERVICE') private readonly routerClient: ClientProxy,
        private readonly redisService: RedisService,
    ) {
        this.redisClient = this.redisService.getClient();
    }

    async createResource(userId: string, resourceData: any): Promise<string> {
        // Логика создания ресурса в облаке
        // Для примера, создадим простой URL
        const resourceId = uuidv4();
        const internalUrl = `http://resource-x:${process.env.RESOURCE_X_PORT}/${resourceId}`;

        // Сохранить URL ресурса в Redis
        await this.redisClient.set(`resource:${resourceId}:url`, internalUrl);

        // Обновить Auth сервис
        await this.authClient.emit('add_user_resource', { userId, resourceId }).toPromise();

        // Обновить Router сервис
        await this.routerClient.emit('add_route', { resourceId, internalUrl }).toPromise();

        // Вернуть внешний URL
        const externalUrl = `http://router/${resourceId}`;
        return externalUrl;
    }

    async deleteResource(resourceId: string): Promise<void> {
        // Логика удаления ресурса
        // Удалить URL из Redis
        await this.redisClient.del(`resource:${resourceId}:url`);

        // Удалить из Auth сервиса
        // Предполагается, что необходимо знать userId, связанный с ресурсом
        // Для примера пропустим этот шаг

        // Удалить из Router сервиса
        await this.routerClient.emit('remove_route', { resourceId }).toPromise();
    }
}
