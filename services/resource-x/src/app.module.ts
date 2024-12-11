import { Module } from '@nestjs/common';
import { ResourceXModule } from './resource-x/resource-x.module';
import { RedisModule } from 'nestjs-redis';
import { HttpModule } from '@nestjs/axios';

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
    HttpModule,
    ResourceXModule,
  ],
})
export class AppModule {}
