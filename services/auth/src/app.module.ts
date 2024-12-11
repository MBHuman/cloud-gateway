import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from 'nestjs-redis';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    RedisModule.register({
      sentinels: [
        { host: 'redis-sentinel', port: 26379 },
        // Добавьте дополнительные Sentinel, если необходимо
      ],
      name: 'mymaster',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    }),
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
          }
        }
      ]
    }),
    AuthModule,
  ],
})
export class AppModule { }
