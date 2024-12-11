import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RouterModule } from './router/router.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            ttl: 30 * 1000,
            store: 
        })
        ClientsModule.register({
            clients: [
                {
                    name: 'AUTH_SERVICE',
                    transport: Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL as string],
                        queue: 'auth_queue',
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]
        }),
        RouterModule,
    ]
})
export class AppModule { }
