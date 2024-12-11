import { Module } from '@nestjs/common';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RouterController],
  providers: [RouterService],
})
export class RouterModule {}
