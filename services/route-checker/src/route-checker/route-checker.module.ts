import { Module } from '@nestjs/common';
import { RouteCheckerController } from './route-checker.controller';
import { RouteCheckerService } from './route-checker.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
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
  ],
  controllers: [RouteCheckerController],
  providers: [RouteCheckerService],
  exports: [RouteCheckerService],
})
export class RouteCheckerModule { }
