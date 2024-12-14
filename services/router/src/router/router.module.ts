import { Module } from '@nestjs/common';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register({
      clients: [
        {
          name: 'ROUTER_CHECKER_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL as string],
            queue: 'route_checker_queue',
            queueOptions: {
              durable: false,
            },
          },
        },
      ]
    }),
  ],
  controllers: [RouterController],
  providers: [RouterService, JwtStrategy],
})
export class RouterModule {}
